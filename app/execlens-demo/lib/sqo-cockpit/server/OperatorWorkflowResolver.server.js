'use strict';

const fs = require('fs');
const path = require('path');
const { loadPromotionState } = require('./PromotionStateLoader.server');
const { ROLE_ACTION_MAP, ACTION_AUTHORITY } = require('./SQOAuthorityValidator.server');
const { resolveQualificationPosture, POSTURE } = require('../QualificationPostureResolver');
const { resolveRuntimeSubstrates } = require('./SQORuntimeResolver.server');
const { deriveLearningSignals } = require('./SQOLearningSignalDerivation.server');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');

function loadSpinePropositions(client, runId) {
  const spinePath = path.join(REPO_ROOT, 'clients', client, 'psee', 'runs', runId, 'spine', 'spine_objects.json');
  try {
    const data = JSON.parse(fs.readFileSync(spinePath, 'utf-8'));
    return data.objects?.semantic_propositions || [];
  } catch (_e) {
    return [];
  }
}

function enrichObligationsWithPropositions(obligations, propositions) {
  const byClass = {};
  for (const p of propositions) {
    const cls = p.proposition_class;
    if (!byClass[cls]) byClass[cls] = [];
    byClass[cls].push(p);
  }

  for (const obl of obligations) {
    const cls = obl.proposition_class;
    const classProps = byClass[cls] || [];
    const sorted = classProps.slice().sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    obl.representative_propositions = sorted.slice(0, 3).map(p => ({
      id: p.id,
      proposition: p.proposition,
      confidence: p.confidence,
      derivation_tier: p.derivation_tier,
      ceu_refs: p.ceu_refs || [],
    }));
    const confidences = classProps.map(p => p.confidence).filter(c => c != null);
    if (confidences.length > 0) {
      obl.confidence_envelope = {
        min: Math.min(...confidences),
        max: Math.max(...confidences),
        mean: obl.mean_confidence || (confidences.reduce((a, b) => a + b, 0) / confidences.length),
      };
      obl.tier_distribution = {};
      for (const p of classProps) {
        const tier = p.derivation_tier || 'UNKNOWN';
        obl.tier_distribution[tier] = (obl.tier_distribution[tier] || 0) + 1;
      }
    }
  }
}

function resolveAuthorityWorkspace(client, runId) {
  const loaded = loadPromotionState(client, runId);
  if (!loaded.loaded) {
    return { available: false, client, runId };
  }

  const { promotionState, qualificationBlockers, reviewObligations, promotionEventLog } = loaded;

  const propositions = loadSpinePropositions(client, runId);
  if (reviewObligations?.obligations) {
    enrichObligationsWithPropositions(reviewObligations.obligations, propositions);
  }

  const authorityPosture = resolveAuthorityPosture(promotionState);
  const reviewQueue = resolveReviewQueue(reviewObligations);
  const promotionControl = resolvePromotionControl(promotionState, qualificationBlockers, promotionEventLog);
  const blockerList = resolveBlockerList(qualificationBlockers, reviewObligations);
  const eventTimeline = resolveEventTimeline(promotionEventLog);

  let learningSignals = null;
  try {
    const signals = deriveLearningSignals(client, runId);
    if (signals.available) learningSignals = signals;
  } catch (_) { /* learning signal derivation is non-critical */ }

  return {
    available: true,
    client,
    runId,
    authorityPosture,
    reviewQueue,
    promotionControl,
    blockerList,
    eventTimeline,
    learningSignals,
    _disclaimer: 'actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.',
  };
}

function resolveAuthorityPosture(promotionState) {
  return {
    s_level: promotionState.s_level,
    authority_ceiling: promotionState.authority_ceiling,
    promotion_eligible: promotionState.promotion_eligible,
    insufficiency_acknowledged: promotionState.insufficiency_acknowledged || false,
    insufficiency_permanent: promotionState.insufficiency_permanent || false,
    insufficiency_justification: promotionState.insufficiency_justification || null,
    lanes_summary: Object.entries(promotionState.lanes || {}).map(([key, lane]) => ({
      lane: key,
      state: lane.state,
      authority: lane.authority,
      has_gaps: (lane.blocking_gaps || []).length > 0,
    })),
    promotion_authority_ownership: promotionState.promotion_authority_ownership,
  };
}

function resolveReviewQueue(reviewObligations) {
  const obligations = reviewObligations?.obligations || [];

  const grouped = {
    UNRESOLVED: [],
    CONTESTED: [],
    ARBITRATION_REQUIRED: [],
    PARTIAL_ACCEPT: [],
    DISPUTED: [],
    RESOLVED: [],
    REJECTED: [],
    UNRESOLVABLE: [],
  };

  for (const obl of obligations) {
    const status = obl.status || 'UNRESOLVED';
    if (grouped[status]) {
      grouped[status].push(obl);
    }
  }

  const affordances = {};
  for (const obl of obligations) {
    affordances[obl.id || obl.proposition_id] = resolveObligationAffordances(obl);
  }

  return {
    total: reviewObligations?.total_obligations || 0,
    resolved: reviewObligations?.resolved || 0,
    unresolved: reviewObligations?.unresolved || 0,
    grouped,
    affordances,
  };
}

function resolveObligationAffordances(obl) {
  const status = obl.status || 'UNRESOLVED';
  switch (status) {
    case 'UNRESOLVED':
      return { actions: ['review_accept', 'review_reject', 'review_contest', 'review_partial_accept'], readonly: false };
    case 'CONTESTED':
      return { actions: ['escalate_arbitration', 'review_accept', 'review_reject'], readonly: false };
    case 'ARBITRATION_REQUIRED':
      return { actions: ['resolve_arbitration'], readonly: false, requires_role: 'promotion_authority' };
    case 'PARTIAL_ACCEPT':
      return { actions: ['review_contest'], readonly: false };
    case 'DISPUTED':
      return { actions: ['review_accept', 'review_reject', 'escalate_arbitration'], readonly: false };
    case 'RESOLVED':
    case 'REJECTED':
    case 'UNRESOLVABLE':
      return { actions: [], readonly: true };
    default:
      return { actions: [], readonly: true };
  }
}

function resolvePromotionControl(promotionState, qualificationBlockers, promotionEventLog) {
  const decisionLane = promotionState.lanes?.promotion_decision || {};
  const events = promotionEventLog || [];
  const hasRequest = events.some(e => e.action === 'promotion_request');
  const hasDecision = events.some(e => e.action === 'promotion_approve' || e.action === 'promotion_deny');
  const unresolvedBlockers = (qualificationBlockers?.blockers || []).filter(b => !b.resolved);

  return {
    decision_state: decisionLane.state || 'BLOCKED',
    can_request_advancement: unresolvedBlockers.length === 0 && !hasRequest,
    can_approve: hasRequest && !hasDecision,
    can_deny: hasRequest && !hasDecision,
    can_acknowledge_insufficiency: promotionState.s_level === 'S1' || promotionState.s_level === 'S1.5',
    blockers_remaining: unresolvedBlockers.length,
    promotion_authority_ownership: promotionState.promotion_authority_ownership,
    insufficiency_acknowledged: promotionState.insufficiency_acknowledged || false,
    insufficiency_permanent: promotionState.insufficiency_permanent || false,
  };
}

function resolveBlockerList(qualificationBlockers, reviewObligations) {
  const blockers = qualificationBlockers?.blockers || [];
  return blockers.map(b => ({
    ...b,
    related_obligations: (reviewObligations?.obligations || [])
      .filter(o => o.source === b.lane || o.trigger?.includes(b.gap))
      .map(o => ({ id: o.id, status: o.status })),
  }));
}

function resolveEventTimeline(promotionEventLog) {
  const events = promotionEventLog || [];
  return events.slice().reverse().map(event => ({
    event_id: event.event_id,
    timestamp: event.timestamp,
    actor_id: event.actor_id,
    actor_role: event.actor_role || null,
    action: event.action,
    semantic_disposition: event.semantic_disposition || null,
    authority_domain: event.authority_domain,
    prior_state: event.prior_state,
    resulting_state: event.resulting_state,
    justification: event.justification,
    target_item: event.target_item,
  }));
}

const ROLE_LABELS = {
  operator: 'Operator',
  reviewer: 'Reviewer',
  domain_authority: 'Domain Authority',
  promotion_authority: 'Promotion Authority',
  audit_authority: 'Audit Authority',
};

const TIER2_SECTION_DEFS = [
  { section: 'semantic-candidates', label: 'Semantic Intake' },
  { section: 'progression', label: 'Progression' },
  { section: 'reconciliation', label: 'Reconciliation' },
  { section: 'evidence', label: 'Evidence & Replay' },
  { section: 'debt', label: 'Semantic Debt' },
];

const TIER3_SECTION_DEFS = [
  { section: 'continuity', label: 'Continuity Assessment' },
  { section: 'maturity', label: 'Maturity Profile' },
  { section: 'reconciliation-loop', label: 'Reconciliation Loop' },
  { section: 'handoff', label: 'PATH B Handoff' },
  { section: 'ceu-admissibility', label: 'CEU Admissibility' },
  { section: 'evidence-ingestion', label: 'Evidence Ingestion' },
  { section: 'corridor', label: 'Runtime Corridor' },
  { section: 'evidence-rebase', label: 'Evidence Rebase' },
];

const POSTURE_RELEVANCE = {
  [POSTURE.SEMANTIC_INTAKE]: 'semantic-candidates',
  [POSTURE.QUALIFICATION_PENDING]: 'semantic-candidates',
  [POSTURE.CROSSWALK_ACTIVE]: 'semantic-candidates',
  [POSTURE.RECONCILIATION_ACTIVE]: 'reconciliation',
  [POSTURE.QUALIFIED]: 'debt',
};

const LANE_LABELS = {
  evidence: 'Evidence',
  crosswalk: 'Crosswalk',
  reconciliation: 'Reconciliation',
  semantic_authority: 'Semantic Authority',
  governance: 'Governance',
  grounding: 'Grounding',
  replay: 'Replay',
};

const LANE_RESOLUTION_ACTIONS = {
  evidence: null,
  crosswalk: 'crosswalk_accept',
  reconciliation: 'reconciliation_accept',
  semantic_authority: 'review_accept',
  governance: 'promotion_request',
  grounding: null,
  replay: null,
};

function findRequiredRole(action, excludeRole) {
  const specialistOrder = ['reviewer', 'domain_authority', 'promotion_authority', 'operator'];
  for (const r of specialistOrder) {
    if (r !== excludeRole && (ROLE_ACTION_MAP[r] || []).includes(action)) {
      return r;
    }
  }
  return 'operator';
}

function resolvePrimaryGuidance(currentPosture, obligationSummary, role, runtimeCapabilities, blockerSummary) {
  const roleActions = ROLE_ACTION_MAP[role] || [];
  const hasReviewAuthority = roleActions.some(a => a.startsWith('review_'));
  if (obligationSummary.unresolved > 0 && hasReviewAuthority) {
    return {
      headline: `${obligationSummary.unresolved} review obligation${obligationSummary.unresolved !== 1 ? 's' : ''} require${obligationSummary.unresolved === 1 ? 's' : ''} operator action.`,
      action_target: 'authority',
      urgency: 'critical',
    };
  }

  const caps = runtimeCapabilities || {};
  switch (currentPosture.posture) {
    case POSTURE.PERMANENTLY_UNQUALIFIABLE:
      return { headline: 'Permanent insufficiency acknowledged. No further progression possible.', action_target: null, urgency: 'terminal' };
    case POSTURE.INSUFFICIENT_EVIDENCE:
      return { headline: 'Insufficient evidence for qualification. Determination may be revisited.', action_target: null, urgency: 'informational' };
    case POSTURE.QUALIFIED: {
      const totalBlockers = blockerSummary ? blockerSummary.total : 0;
      if (totalBlockers > 0) {
        const lanes = blockerSummary.by_lane ? Object.values(blockerSummary.by_lane).map(l => l.label.toLowerCase()) : [];
        const laneLabel = lanes.length > 0 ? lanes.join(', ') : 'qualification';
        return {
          headline: `${totalBlockers} qualification blocker${totalBlockers !== 1 ? 's' : ''} active across ${laneLabel}. Remediation required for S3 advancement.`,
          action_target: 'debt',
          urgency: 'actionable',
        };
      }
      return { headline: `Qualified at ${currentPosture.s_level}. No active blockers.`, action_target: null, urgency: 'informational' };
    }
    case POSTURE.RECONCILIATION_ACTIVE:
      return { headline: 'Reconciliation in progress. Review correspondence for completion.', action_target: 'reconciliation', urgency: 'actionable' };
    case POSTURE.CROSSWALK_ACTIVE:
      return { headline: 'Semantic intake complete. Crosswalk construction required for advancement.', action_target: null, urgency: 'actionable' };
    case POSTURE.QUALIFICATION_PENDING:
      return { headline: `${obligationSummary.unresolved} review obligation${obligationSummary.unresolved !== 1 ? 's' : ''} pending resolution.`, action_target: 'authority', urgency: 'critical' };
    case POSTURE.SEMANTIC_INTAKE:
      return { headline: caps.semantic_propositions ? 'Semantic propositions available. CANDIDATE propositions awaiting operator review.' : 'Semantic intake available. Candidate capabilities awaiting review.', action_target: 'semantic-candidates', urgency: 'actionable' };
    case POSTURE.STRUCTURAL_ONLY:
      return { headline: 'Structural topology only. Semantic derivation required for qualification.', action_target: null, urgency: 'informational' };
    default:
      return { headline: 'Qualification state could not be determined.', action_target: null, urgency: 'informational' };
  }
}

function resolveBlockerSummaryV2(qualificationBlockers, role) {
  const blockers = qualificationBlockers?.blockers || [];
  const unresolvedBlockers = blockers.filter(b => !b.resolved);
  const roleActions = ROLE_ACTION_MAP[role] || [];
  const byLane = {};

  for (const b of unresolvedBlockers) {
    const lane = b.lane || 'evidence';
    if (!byLane[lane]) {
      const resAction = LANE_RESOLUTION_ACTIONS[lane] || null;
      byLane[lane] = {
        count: 0,
        label: LANE_LABELS[lane] || lane,
        resolvable_by_role: resAction ? roleActions.includes(resAction) : false,
        resolution_action: resAction,
      };
    }
    byLane[lane].count += 1;
  }

  const critical_count = unresolvedBlockers.filter(b => b.severity === 'critical' || b.blocks_promotion).length;
  const escalation_required = Object.values(byLane).some(l => !l.resolvable_by_role && l.count > 0);

  return { total: unresolvedBlockers.length, by_lane: byLane, critical_count, escalation_required };
}

function resolveObligationSummaryV2(reviewObligations, role) {
  const obligations = reviewObligations?.obligations || [];
  const total = reviewObligations?.total_obligations || obligations.length;
  const resolved = obligations.filter(o => o.status === 'RESOLVED' || o.status === 'REJECTED').length;
  const unresolved = obligations.filter(o => o.status === 'UNRESOLVED' || o.status === 'DISPUTED').length;
  const contested = obligations.filter(o => o.status === 'CONTESTED' || o.status === 'ARBITRATION_REQUIRED').length;

  const roleActions = ROLE_ACTION_MAP[role] || [];
  let actionable = 0;
  for (const obl of obligations) {
    const affordances = resolveObligationAffordances(obl);
    if (!affordances.readonly && affordances.actions.some(a => roleActions.includes(a))) {
      actionable++;
    }
  }

  return { total, unresolved, contested, resolved, actionable_by_role: actionable };
}

function resolveEvidenceState(runtimeCapabilities) {
  const caps = runtimeCapabilities || {};
  return {
    structural_topology: { available: !!caps.structural_topology, detail: caps.structural_topology ? 'Canonical topology available' : null },
    semantic_intake: { available: !!caps.semantic_candidates, detail: caps.semantic_propositions ? 'Semantic propositions available (SPE)' : caps.semantic_candidates ? 'Candidate CSR available' : null },
    crosswalk: { available: !!caps.static_reconciliation, detail: caps.static_reconciliation ? 'Crosswalk correspondence available' : null },
    reconciliation: { available: !!caps.static_reconciliation, detail: caps.static_reconciliation ? 'Reconciliation data available' : null },
    evidence_replay: { available: !!caps.static_replay, detail: caps.static_replay ? 'Replay verification available' : null },
    vault_readiness: { available: !!caps.vault_readiness, detail: caps.vault_readiness ? 'Vault readiness assessed' : null },
    event_lineage: { available: !!caps.event_lineage, detail: caps.event_lineage ? 'Promotion event lineage available' : null },
    authority_runtime: { available: !!caps.authority_runtime, detail: caps.authority_runtime ? 'Authority runtime operational' : null },
  };
}

function resolveAvailableActions(role, promotionState, reviewObligations, promotionEventLog, qualificationBlockers) {
  const roleActions = ROLE_ACTION_MAP[role] || [];
  const obligations = reviewObligations?.obligations || [];
  const events = promotionEventLog || [];
  const blockers = qualificationBlockers?.blockers || [];
  const unresolvedBlockers = blockers.filter(b => !b.resolved);
  const sLevel = promotionState?.s_level;
  const hasRequest = events.some(e => e.action === 'promotion_request');
  const hasDecision = events.some(e => e.action === 'promotion_approve' || e.action === 'promotion_deny');

  const actionDefs = [
    { action: 'review_accept', label: 'Accept Review', category: 'review', stateCheck: () => {
      const t = obligations.filter(o => ['UNRESOLVED', 'CONTESTED', 'DISPUTED'].includes(o.status));
      return { valid: t.length > 0, reason: t.length === 0 ? 'No obligations in reviewable state' : null, count: t.length };
    }},
    { action: 'review_reject', label: 'Reject Review', category: 'review', stateCheck: () => {
      const t = obligations.filter(o => ['UNRESOLVED', 'CONTESTED', 'DISPUTED'].includes(o.status));
      return { valid: t.length > 0, reason: t.length === 0 ? 'No obligations in reviewable state' : null, count: t.length };
    }},
    { action: 'review_contest', label: 'Contest Review', category: 'review', stateCheck: () => {
      const t = obligations.filter(o => ['UNRESOLVED', 'RESOLVED'].includes(o.status));
      return { valid: t.length > 0, reason: t.length === 0 ? 'No obligations in contestable state' : null, count: t.length };
    }},
    { action: 'review_partial_accept', label: 'Partial Accept', category: 'review', stateCheck: () => {
      const t = obligations.filter(o => o.status === 'UNRESOLVED');
      return { valid: t.length > 0, reason: t.length === 0 ? 'No unresolved obligations' : null, count: t.length };
    }},
    { action: 'promotion_request', label: 'Request Promotion', category: 'promotion', stateCheck: () => {
      if (unresolvedBlockers.length > 0) return { valid: false, reason: `${unresolvedBlockers.length} blocker${unresolvedBlockers.length !== 1 ? 's' : ''} unresolved`, count: null };
      if (hasRequest) return { valid: false, reason: 'Promotion already requested', count: null };
      return { valid: true, reason: null, count: null };
    }},
    { action: 'promotion_approve', label: 'Approve Promotion', category: 'promotion', stateCheck: () => {
      if (!hasRequest) return { valid: false, reason: 'No pending promotion request', count: null };
      if (hasDecision) return { valid: false, reason: 'Promotion already decided', count: null };
      return { valid: true, reason: null, count: null };
    }},
    { action: 'promotion_deny', label: 'Deny Promotion', category: 'promotion', stateCheck: () => {
      if (!hasRequest) return { valid: false, reason: 'No pending promotion request', count: null };
      if (hasDecision) return { valid: false, reason: 'Promotion already decided', count: null };
      return { valid: true, reason: null, count: null };
    }},
    { action: 'insufficiency_acknowledge', label: 'Acknowledge Insufficiency', category: 'insufficiency', stateCheck: () => {
      if (sLevel !== 'S1' && sLevel !== 'S1.5') return { valid: false, reason: `Requires S1 state (current: ${sLevel || 'unknown'})`, count: null };
      return { valid: true, reason: null, count: null };
    }},
    { action: 'crosswalk_accept', label: 'Accept Crosswalk', category: 'structural', stateCheck: () => {
      const lane = promotionState?.lanes?.crosswalk;
      if (!lane || lane.state === 'ABSENT') return { valid: false, reason: 'No crosswalk artifact exists', count: null };
      return { valid: true, reason: null, count: null };
    }},
    { action: 'reconciliation_accept', label: 'Accept Reconciliation', category: 'structural', stateCheck: () => {
      const lane = promotionState?.lanes?.reconciliation;
      if (!lane || lane.state === 'ABSENT') return { valid: false, reason: 'No reconciliation artifact exists', count: null };
      return { valid: true, reason: null, count: null };
    }},
    { action: 'escalate_arbitration', label: 'Escalate to Arbitration', category: 'escalation', stateCheck: () => {
      const t = obligations.filter(o => o.status === 'CONTESTED');
      return { valid: t.length > 0, reason: t.length === 0 ? 'No contested obligations' : null, count: t.length };
    }},
    { action: 'resolve_arbitration', label: 'Resolve Arbitration', category: 'escalation', stateCheck: () => {
      const t = obligations.filter(o => o.status === 'ARBITRATION_REQUIRED');
      return { valid: t.length > 0, reason: t.length === 0 ? 'No obligations requiring arbitration' : null, count: t.length };
    }},
  ];

  return actionDefs.map(def => {
    const authority = ACTION_AUTHORITY[def.action];
    const roleHasAction = roleActions.includes(def.action);
    const stateResult = def.stateCheck();
    const available = roleHasAction && stateResult.valid;

    let reason_if_unavailable = null;
    let required_role = null;

    if (!available) {
      if (!roleHasAction) {
        required_role = findRequiredRole(def.action, role);
        reason_if_unavailable = `Requires ${ROLE_LABELS[required_role] || required_role}`;
        if (!stateResult.valid && stateResult.reason) {
          reason_if_unavailable += ` — ${stateResult.reason}`;
        }
      } else {
        reason_if_unavailable = stateResult.reason;
      }
    }

    return {
      action: def.action,
      label: def.label,
      category: def.category,
      available,
      reason_if_unavailable,
      required_role,
      authority_level: authority.level,
      target_count: stateResult.count,
    };
  });
}

function resolveNextPossibleStates(currentPosture, qualificationBlockers, reviewObligations, promotionEventLog, runtimeCapabilities) {
  const sLevel = currentPosture.s_level;
  const caps = runtimeCapabilities || {};
  const blockers = qualificationBlockers?.blockers || [];
  const unresolvedBlockers = blockers.filter(b => !b.resolved);
  const obligations = reviewObligations?.obligations || [];
  const unresolvedObligations = obligations.filter(o => !['RESOLVED', 'REJECTED', 'UNRESOLVABLE'].includes(o.status));
  const events = promotionEventLog || [];
  const hasApproval = events.some(e => e.action === 'promotion_approve');
  const states = [];

  if (sLevel === 'S1' || sLevel === 'S1.5' || !sLevel) {
    const prereqs = [
      { requirement: 'All qualification blockers resolved', met: unresolvedBlockers.length === 0, resolution: unresolvedBlockers.length > 0 ? `${unresolvedBlockers.length} blockers remaining` : null },
      { requirement: 'All review obligations resolved', met: unresolvedObligations.length === 0, resolution: unresolvedObligations.length > 0 ? `${unresolvedObligations.length} obligations unresolved` : null },
      { requirement: 'Crosswalk validated', met: !!caps.static_reconciliation, resolution: !caps.static_reconciliation ? 'Crosswalk construction required' : null },
      { requirement: 'Reconciliation complete', met: !!caps.static_reconciliation, resolution: !caps.static_reconciliation ? 'PATH A/B reconciliation required' : null },
      { requirement: 'Promotion approved', met: hasApproval, resolution: !hasApproval ? 'Promotion request and approval required' : null },
    ];
    states.push({ state: 'S2', label: 'Qualified with Debt', reachable: prereqs.every(p => p.met), remaining_prerequisites: prereqs });
  }

  if (sLevel === 'S2') {
    const groundingBlockers = unresolvedBlockers.filter(b => b.lane === 'grounding');
    const evidenceBlockers = unresolvedBlockers.filter(b => b.lane === 'evidence');
    const otherBlockers = unresolvedBlockers.filter(b => b.lane !== 'grounding' && b.lane !== 'evidence');
    const prereqs = [
      { requirement: 'All grounding gaps resolved', met: groundingBlockers.length === 0, resolution: groundingBlockers.length > 0 ? `${groundingBlockers.length} grounding blocker${groundingBlockers.length !== 1 ? 's' : ''} — source evidence expansion required` : null },
      { requirement: 'All continuity gaps resolved', met: evidenceBlockers.length === 0, resolution: evidenceBlockers.length > 0 ? `${evidenceBlockers.length} evidence blocker${evidenceBlockers.length !== 1 ? 's' : ''} — continuity restoration required` : null },
    ];
    if (otherBlockers.length > 0) {
      prereqs.push({ requirement: 'All remaining blockers resolved', met: false, resolution: `${otherBlockers.length} additional blocker${otherBlockers.length !== 1 ? 's' : ''}` });
    }
    prereqs.push(
      { requirement: 'Authority ceiling at L5', met: false, resolution: 'Current authority ceiling below L5' },
      { requirement: 'Promotion authority approval', met: hasApproval, resolution: !hasApproval ? 'Promotion request and approval required' : null },
    );
    states.push({ state: 'S3', label: 'Authority Ready', reachable: prereqs.every(p => p.met), remaining_prerequisites: prereqs });
  }

  return states;
}

function resolveProgressionPath(currentPosture, runtimeCapabilities, qualificationBlockers) {
  const caps = runtimeCapabilities || {};
  const posture = currentPosture.posture;
  const sLevel = currentPosture.s_level;
  const isTerminal = posture === POSTURE.PERMANENTLY_UNQUALIFIABLE;

  function stepStatus(isComplete, isCurrent) {
    if (isTerminal && !isComplete) return 'terminal';
    if (isComplete) return 'complete';
    if (isCurrent) return 'current';
    return 'future';
  }

  const hasStructural = !!caps.structural_topology;
  const hasSemantic = !!caps.semantic_candidates;
  const hasReview = !!caps.review_obligations;
  const hasReconciliation = !!caps.static_reconciliation || !!caps.static_reconciliation_loop;
  const isQualified = sLevel === 'S2' || sLevel === 'S3';
  const reviewComplete = isQualified || posture === POSTURE.RECONCILIATION_ACTIVE || posture === POSTURE.CROSSWALK_ACTIVE;
  const crosswalkComplete = isQualified || posture === POSTURE.RECONCILIATION_ACTIVE;
  const reconComplete = isQualified;

  const blockers = qualificationBlockers?.blockers || [];
  const unresolvedBlockers = blockers.filter(b => !b.resolved);
  const hasActiveDebt = isQualified && sLevel === 'S2' && unresolvedBlockers.length > 0;

  const steps = [
    { step: 'structural_onboarding', label: 'Structural Onboarding', status: stepStatus(hasStructural, !hasStructural), detail: hasStructural ? 'Canonical topology available' : 'Awaiting structural pipeline' },
    { step: 'semantic_derivation', label: 'Semantic Derivation', status: stepStatus(hasSemantic, hasStructural && !hasSemantic), detail: hasSemantic ? (caps.semantic_propositions ? 'Semantic propositions derived (SPE)' : 'Candidate CSR generated') : (hasStructural ? 'Awaiting semantic derivation' : null) },
    { step: 'semantic_review', label: 'Semantic Review', status: stepStatus(reviewComplete, hasSemantic && !reviewComplete && (posture === POSTURE.QUALIFICATION_PENDING || posture === POSTURE.SEMANTIC_INTAKE)), detail: reviewComplete ? 'Review obligations resolved' : (hasReview ? 'Review obligations pending' : null) },
    { step: 'crosswalk_construction', label: 'Crosswalk Construction', status: stepStatus(crosswalkComplete, posture === POSTURE.CROSSWALK_ACTIVE), detail: crosswalkComplete ? 'Crosswalk validated' : (posture === POSTURE.CROSSWALK_ACTIVE ? 'Crosswalk construction in progress' : null) },
    { step: 'reconciliation', label: 'Reconciliation', status: stepStatus(reconComplete, posture === POSTURE.RECONCILIATION_ACTIVE), detail: reconComplete ? 'PATH A/B reconciliation complete' : (posture === POSTURE.RECONCILIATION_ACTIVE ? 'Reconciliation in progress' : null) },
    { step: 'qualification_promotion', label: 'Qualification Promotion', status: stepStatus(isQualified, reconComplete && !isQualified), detail: isQualified ? `Qualified at ${sLevel}` : null },
  ];

  if (hasActiveDebt) {
    const groundingCount = unresolvedBlockers.filter(b => b.lane === 'grounding').length;
    const evidenceCount = unresolvedBlockers.filter(b => b.lane === 'evidence').length;
    const parts = [];
    if (groundingCount > 0) parts.push(`${groundingCount} grounding`);
    if (evidenceCount > 0) parts.push(`${evidenceCount} evidence`);
    const otherCount = unresolvedBlockers.length - groundingCount - evidenceCount;
    if (otherCount > 0) parts.push(`${otherCount} other`);
    steps.push({
      step: 'semantic_debt_resolution',
      label: 'Debt Remediation',
      status: 'current',
      detail: `${unresolvedBlockers.length} blocker${unresolvedBlockers.length !== 1 ? 's' : ''} active (${parts.join(', ')}) — resolve for S3 eligibility`,
    });
  }

  return steps;
}

function resolveRoleProjection(role) {
  const allActions = Object.keys(ACTION_AUTHORITY);
  const permitted = ROLE_ACTION_MAP[role] || [];
  const prohibited = allActions.filter(a => !permitted.includes(a));
  const escalation_targets = prohibited.map(action => ({
    action,
    required_role: findRequiredRole(action, role),
  }));
  return { role, roleLabel: ROLE_LABELS[role] || role, permitted_actions: permitted, prohibited_actions: prohibited, escalation_targets };
}

function resolveAvailableDrilldowns(sectionAvailability, currentPosture) {
  const sa = sectionAvailability || {};
  const primarySection = POSTURE_RELEVANCE[currentPosture.posture] || null;

  const tier2 = TIER2_SECTION_DEFS.map(def => ({
    section: def.section,
    label: def.label,
    available: !!sa[def.section],
    relevance: def.section === primarySection ? 'primary' : 'standard',
  }));

  const tier3 = TIER3_SECTION_DEFS.map(def => ({
    section: def.section,
    label: def.label,
    available: !!sa[def.section],
  }));

  return { tier2, tier3 };
}

function resolveRemediationWorkflow(currentPosture, blockerSummary, qualificationBlockers) {
  if (currentPosture.posture !== POSTURE.QUALIFIED || !blockerSummary || blockerSummary.total === 0) {
    return null;
  }

  const blockers = qualificationBlockers?.blockers || [];
  const unresolvedByLane = {};
  for (const b of blockers) {
    if (b.resolved) continue;
    const lane = b.lane || 'evidence';
    if (!unresolvedByLane[lane]) unresolvedByLane[lane] = [];
    unresolvedByLane[lane].push(b);
  }

  const stages = [];

  if (unresolvedByLane.evidence) {
    const items = unresolvedByLane.evidence;
    stages.push({
      id: 'continuity_restoration',
      label: 'Continuity Restoration',
      status: 'active',
      blocker_count: items.length,
      description: 'Restore evidence continuity for gap domains',
      source_requirement: 'Continuity documentation for domains with evidence gaps',
      domains: items.filter(b => b.domain_id).map(b => b.domain_id),
    });
  }

  if (unresolvedByLane.grounding) {
    const items = unresolvedByLane.grounding;
    const irreducible = items.filter(b => b.reducibility === 'IRREDUCIBLE_STRUCTURAL_ABSENCE').length;
    stages.push({
      id: 'grounding_expansion',
      label: 'Grounding Expansion',
      status: unresolvedByLane.evidence ? 'pending' : 'active',
      blocker_count: items.length,
      description: 'Expand structural grounding to cover ungrounded domains',
      source_requirement: `Source evidence required for ${items.length} ungrounded domain${items.length !== 1 ? 's' : ''}${irreducible > 0 ? ` (${irreducible} structurally absent — new evidence sources needed)` : ''}`,
      domains: items.filter(b => b.domain_id).map(b => b.domain_id),
    });
  }

  for (const [lane, items] of Object.entries(unresolvedByLane)) {
    if (lane === 'evidence' || lane === 'grounding') continue;
    stages.push({
      id: `${lane}_remediation`,
      label: `${LANE_LABELS[lane] || lane} Remediation`,
      status: 'active',
      blocker_count: items.length,
      description: `Resolve ${(LANE_LABELS[lane] || lane).toLowerCase()} blockers`,
      source_requirement: null,
      domains: items.filter(b => b.domain_id).map(b => b.domain_id),
    });
  }

  stages.push({
    id: 's3_eligibility',
    label: 'S3 Eligibility',
    status: 'future',
    blocker_count: 0,
    description: 'All gates clear for S3 Authority Ready promotion',
    source_requirement: null,
    domains: [],
  });

  return {
    current_state: `${currentPosture.s_level} Qualified with Debt`,
    target_state: 'S3 Authority Ready',
    total_blockers: blockerSummary.total,
    stages,
    gates: [
      { gate: 'All qualification blockers resolved', met: blockerSummary.total === 0 },
      { gate: 'Full structural grounding achieved', met: false },
      { gate: 'Authority ceiling elevated to L5', met: false },
      { gate: 'Promotion authority approval', met: false },
    ],
  };
}

function resolveOperatorWorkflow(client, runId, role, promotionState, qualificationBlockers, reviewObligations, promotionEventLog, runtimeCapabilities, sectionAvailability) {
  const currentPosture = resolveQualificationPosture(promotionState, qualificationBlockers, runtimeCapabilities);
  const blockerSummary = resolveBlockerSummaryV2(qualificationBlockers, role);
  const obligationSummary = resolveObligationSummaryV2(reviewObligations, role);
  const primaryGuidance = resolvePrimaryGuidance(currentPosture, obligationSummary, role, runtimeCapabilities, blockerSummary);
  const evidenceState = resolveEvidenceState(runtimeCapabilities);
  const availableActions = resolveAvailableActions(role, promotionState, reviewObligations, promotionEventLog, qualificationBlockers);
  const nextPossibleStates = resolveNextPossibleStates(currentPosture, qualificationBlockers, reviewObligations, promotionEventLog, runtimeCapabilities);
  const progressionPath = resolveProgressionPath(currentPosture, runtimeCapabilities, qualificationBlockers);
  const roleProjection = resolveRoleProjection(role);
  const availableDrilldowns = resolveAvailableDrilldowns(sectionAvailability, currentPosture);
  const remediationWorkflow = resolveRemediationWorkflow(currentPosture, blockerSummary, qualificationBlockers);
  const isTerminal = currentPosture.posture === POSTURE.PERMANENTLY_UNQUALIFIABLE;
  const terminalReason = isTerminal ? currentPosture.summary : null;

  return {
    currentPosture,
    primaryGuidance,
    blockerSummary,
    obligationSummary,
    evidenceState,
    availableActions,
    nextPossibleStates,
    progressionPath,
    roleProjection,
    availableDrilldowns,
    remediationWorkflow,
    isTerminal,
    terminalReason,
  };
}

function resolveOperatorWorkflowFromRaw(client, runId, role) {
  const runtime = resolveRuntimeSubstrates(client, runId);
  const loaded = loadPromotionState(client, runId);

  if (!loaded.loaded) {
    return resolveOperatorWorkflow(
      client, runId, role || 'operator',
      null, null, null, null,
      runtime.capabilities, runtime.sectionAvailability
    );
  }

  return resolveOperatorWorkflow(
    client, runId, role || 'operator',
    loaded.promotionState,
    loaded.qualificationBlockers,
    loaded.reviewObligations,
    loaded.promotionEventLog,
    runtime.capabilities,
    runtime.sectionAvailability
  );
}

module.exports = { resolveAuthorityWorkspace, resolveOperatorWorkflow, resolveOperatorWorkflowFromRaw };

'use strict';

const { loadPromotionState, writePromotionState, writeReviewObligations, writeQualificationBlockers } = require('./PromotionStateLoader.server');
const { validateAction } = require('./SQOAuthorityValidator.server');
const { readExistingLog, buildEvent, appendEvent } = require('./PromotionEventWriter.server');

const TERMINAL_OBLIGATION_STATES = ['RESOLVED', 'REJECTED', 'UNRESOLVABLE'];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function executeAction({ action, client, runId, actor_id, target_item, justification, accepted_aspects, contested_aspects, resolution_outcome, insufficiency_permanent }) {
  const loaded = loadPromotionState(client, runId);
  if (!loaded.loaded) {
    return { success: false, error: 'ARTIFACTS_NOT_FOUND', detail: `No promotion state artifacts found for ${client}/${runId}` };
  }

  const { promotionState, qualificationBlockers, reviewObligations, promotionEventLog } = loaded;

  const validation = validateAction(action, actor_id, target_item, promotionState, reviewObligations, promotionEventLog, qualificationBlockers);
  if (!validation.valid) {
    return { success: false, error: validation.reason, detail: validation.detail, boundary_violation: validation.boundary_violation || false };
  }

  const stateSnapshot = deepClone(promotionState);
  const obligationsSnapshot = deepClone(reviewObligations);
  const blockersSnapshot = deepClone(qualificationBlockers);

  try {
    const result = applyAction({
      action, client, runId, actor_id, target_item, justification,
      accepted_aspects, contested_aspects, resolution_outcome, insufficiency_permanent,
      promotionState, reviewObligations, promotionEventLog, qualificationBlockers,
      validation,
    });

    const replayResult = replayValidate(client, runId);

    return {
      success: true,
      event: result.event,
      updatedState: result.updatedState,
      replay_valid: replayResult.valid,
      _disclaimer: 'actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.',
    };
  } catch (err) {
    writePromotionState(client, runId, stateSnapshot);
    writeReviewObligations(client, runId, obligationsSnapshot);
    writeQualificationBlockers(client, runId, blockersSnapshot);
    return { success: false, error: 'MUTATION_FAILED', detail: err.message };
  }
}

function applyAction({ action, client, runId, actor_id, target_item, justification, accepted_aspects, contested_aspects, resolution_outcome, insufficiency_permanent, promotionState, reviewObligations, promotionEventLog, qualificationBlockers, validation }) {
  const existingLog = readExistingLog(client, runId);

  switch (action) {
    case 'review_accept':
      return applyReviewAccept({ client, runId, actor_id, target_item, promotionState, reviewObligations, qualificationBlockers, existingLog, validation });

    case 'review_reject':
      return applyReviewReject({ client, runId, actor_id, target_item, justification, promotionState, reviewObligations, qualificationBlockers, existingLog, validation });

    case 'review_contest':
      return applyReviewContest({ client, runId, actor_id, target_item, justification, contested_aspects, promotionState, reviewObligations, existingLog, validation });

    case 'review_partial_accept':
      return applyReviewPartialAccept({ client, runId, actor_id, target_item, accepted_aspects, contested_aspects, promotionState, reviewObligations, existingLog, validation });

    case 'escalate_arbitration':
      return applyEscalateArbitration({ client, runId, actor_id, target_item, justification, promotionState, reviewObligations, existingLog, validation });

    case 'resolve_arbitration':
      return applyResolveArbitration({ client, runId, actor_id, target_item, justification, resolution_outcome, promotionState, reviewObligations, qualificationBlockers, existingLog, validation });

    case 'promotion_request':
      return applyPromotionRequest({ client, runId, actor_id, promotionState, existingLog, validation });

    case 'promotion_approve':
      return applyPromotionApprove({ client, runId, actor_id, justification, promotionState, existingLog, validation });

    case 'promotion_deny':
      return applyPromotionDeny({ client, runId, actor_id, justification, promotionState, existingLog, validation });

    case 'insufficiency_acknowledge':
      return applyInsufficiencyAcknowledge({ client, runId, actor_id, justification, insufficiency_permanent, promotionState, existingLog, validation });

    case 'crosswalk_accept':
      return applyCrosswalkAccept({ client, runId, actor_id, justification, promotionState, existingLog, validation });

    case 'reconciliation_accept':
      return applyReconciliationAccept({ client, runId, actor_id, justification, promotionState, existingLog, validation });

    default:
      throw new Error(`Unhandled action: ${action}`);
  }
}

function applyReviewAccept({ client, runId, actor_id, target_item, promotionState, reviewObligations, qualificationBlockers, existingLog, validation }) {
  const obl = reviewObligations.obligations.find(o => o.id === target_item);
  const priorState = obl.status;
  obl.status = 'RESOLVED';
  obl.semantic_disposition = 'OPERATIONAL_ACCEPTANCE';
  obl.resolved_by = actor_id;
  obl.resolved_at = new Date().toISOString();

  updateObligationCounters(reviewObligations);
  maybeUpdateReviewQueueLane(promotionState, reviewObligations, qualificationBlockers, client, runId);
  writeReviewObligations(client, runId, reviewObligations);
  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'review_accept', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'review_obligations.json',
    targetItem: target_item, priorState, resultingState: 'RESOLVED',
    approvalScope: 'semantic_grouping', semanticDisposition: 'OPERATIONAL_ACCEPTANCE',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { obligation: obl, lane: promotionState.lanes.review_queue } };
}

function applyReviewReject({ client, runId, actor_id, target_item, justification, promotionState, reviewObligations, qualificationBlockers, existingLog, validation }) {
  const obl = reviewObligations.obligations.find(o => o.id === target_item);
  const priorState = obl.status;
  obl.status = 'REJECTED';
  obl.semantic_disposition = 'OPERATIONAL_REJECTION';
  obl.rejected_by = actor_id;
  obl.rejected_at = new Date().toISOString();
  obl.rejection_justification = justification;

  updateObligationCounters(reviewObligations);
  maybeUpdateReviewQueueLane(promotionState, reviewObligations, qualificationBlockers, client, runId);
  writeReviewObligations(client, runId, reviewObligations);
  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'review_reject', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'review_obligations.json',
    targetItem: target_item, priorState, resultingState: 'REJECTED',
    justification, approvalScope: 'semantic_grouping', semanticDisposition: 'OPERATIONAL_REJECTION',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { obligation: obl, lane: promotionState.lanes.review_queue } };
}

function applyReviewContest({ client, runId, actor_id, target_item, justification, contested_aspects, promotionState, reviewObligations, existingLog, validation }) {
  const obl = reviewObligations.obligations.find(o => o.id === target_item);
  const priorState = obl.status;
  obl.status = 'CONTESTED';
  obl.semantic_disposition = 'CONTESTED';
  obl.contested_by = actor_id;
  obl.contested_at = new Date().toISOString();
  obl.contest_reasoning = justification;
  if (contested_aspects) obl.contested_aspects = contested_aspects;

  updateObligationCounters(reviewObligations);
  writeReviewObligations(client, runId, reviewObligations);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'review_contest', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'review_obligations.json',
    targetItem: target_item, priorState, resultingState: 'CONTESTED',
    justification, semanticDisposition: 'CONTESTED',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { obligation: obl } };
}

function applyReviewPartialAccept({ client, runId, actor_id, target_item, accepted_aspects, contested_aspects, promotionState, reviewObligations, existingLog, validation }) {
  const obl = reviewObligations.obligations.find(o => o.id === target_item);
  const priorState = obl.status;
  obl.status = 'PARTIAL_ACCEPT';
  obl.semantic_disposition = 'PARTIAL_ACCEPTANCE';
  obl.partial_accepted_by = actor_id;
  obl.partial_accepted_at = new Date().toISOString();
  obl.accepted_aspects = accepted_aspects || [];
  obl.contested_aspects = contested_aspects || [];

  updateObligationCounters(reviewObligations);
  writeReviewObligations(client, runId, reviewObligations);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'review_partial_accept', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'review_obligations.json',
    targetItem: target_item, priorState, resultingState: 'PARTIAL_ACCEPT',
    semanticDisposition: 'PARTIAL_ACCEPTANCE',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { obligation: obl } };
}

function applyEscalateArbitration({ client, runId, actor_id, target_item, justification, promotionState, reviewObligations, existingLog, validation }) {
  const obl = reviewObligations.obligations.find(o => o.id === target_item);
  const priorState = obl.status;
  obl.status = 'ARBITRATION_REQUIRED';
  obl.semantic_disposition = 'ARBITRATION_ESCALATION';
  obl.escalated_by = actor_id;
  obl.escalated_at = new Date().toISOString();
  obl.escalation_reasoning = justification;

  updateObligationCounters(reviewObligations);
  writeReviewObligations(client, runId, reviewObligations);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'escalate_arbitration', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'review_obligations.json',
    targetItem: target_item, priorState, resultingState: 'ARBITRATION_REQUIRED',
    justification, semanticDisposition: 'ARBITRATION_ESCALATION',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { obligation: obl } };
}

function applyResolveArbitration({ client, runId, actor_id, target_item, justification, resolution_outcome, promotionState, reviewObligations, qualificationBlockers, existingLog, validation }) {
  const obl = reviewObligations.obligations.find(o => o.id === target_item);
  const priorState = obl.status;
  const resultingState = resolution_outcome === 'UNRESOLVABLE' ? 'UNRESOLVABLE' : 'RESOLVED';
  obl.status = resultingState;
  obl.semantic_disposition = resultingState === 'UNRESOLVABLE' ? 'INSUFFICIENCY_DETERMINATION' : 'OPERATIONAL_ACCEPTANCE';
  obl.arbitration_resolved_by = actor_id;
  obl.arbitration_resolved_at = new Date().toISOString();
  obl.arbitration_justification = justification;

  updateObligationCounters(reviewObligations);
  maybeUpdateReviewQueueLane(promotionState, reviewObligations, qualificationBlockers, client, runId);
  writeReviewObligations(client, runId, reviewObligations);
  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'resolve_arbitration', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'review_obligations.json',
    targetItem: target_item, priorState, resultingState,
    justification, semanticDisposition: obl.semantic_disposition,
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { obligation: obl, lane: promotionState.lanes.review_queue } };
}

function applyPromotionRequest({ client, runId, actor_id, promotionState, existingLog, validation }) {
  const priorState = promotionState.lanes.promotion_decision.state;
  promotionState.lanes.promotion_decision.state = 'REQUESTED';

  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'promotion_request', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'promotion_state.json',
    priorState, resultingState: 'REQUESTED',
    promotionAuthorityOwner: actor_id, approvalScope: `${promotionState.s_level} advancement`,
    semanticDisposition: 'QUALIFICATION_REQUEST',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { lane: promotionState.lanes.promotion_decision } };
}

function applyPromotionApprove({ client, runId, actor_id, justification, promotionState, existingLog, validation }) {
  const priorSLevel = promotionState.s_level;
  const nextSLevel = priorSLevel === 'S1' ? 'S1.5' : priorSLevel === 'S1.5' ? 'S2' : 'S2';

  promotionState.s_level = nextSLevel;
  promotionState.promotion_eligible = false;
  promotionState.lanes.promotion_decision.state = 'GRANTED';
  promotionState.promotion_lineage.current_state = nextSLevel;
  promotionState.promotion_lineage.transitions.push({
    from: priorSLevel,
    to: nextSLevel,
    timestamp: new Date().toISOString(),
    actor_id,
    action: 'promotion_approve',
    authority_domain: 'governance_authority',
    audit_event_ref: null,
  });
  promotionState.last_transition_actor = actor_id;
  promotionState.last_transition_reason = justification || `Qualification advancement ${priorSLevel} → ${nextSLevel} approved`;
  promotionState.promotion_authority_ownership = {
    promotion_authority_owner: actor_id,
    approval_required_from: 'governance_authority:L5',
    promotion_scope: `${priorSLevel} → ${nextSLevel}`,
    promotion_reasoning_class: 'EVIDENCE_SUFFICIENT',
  };

  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'promotion_approve', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'promotion_state.json',
    priorState: priorSLevel, resultingState: nextSLevel,
    justification, promotionAuthorityOwner: actor_id,
    approvalScope: `${priorSLevel} → ${nextSLevel} qualification advancement`,
    semanticDisposition: 'QUALIFICATION_ADVANCEMENT',
  });
  const written = appendEvent(client, runId, event);

  promotionState.promotion_lineage.transitions[promotionState.promotion_lineage.transitions.length - 1].audit_event_ref = written.event_id;
  promotionState.audit_event_refs = [...(promotionState.audit_event_refs || []), written.event_id];
  writePromotionState(client, runId, promotionState);

  return { event: written, updatedState: { s_level: nextSLevel, lane: promotionState.lanes.promotion_decision } };
}

function applyPromotionDeny({ client, runId, actor_id, justification, promotionState, existingLog, validation }) {
  const priorState = promotionState.lanes.promotion_decision.state;
  promotionState.lanes.promotion_decision.state = 'DENIED';

  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'promotion_deny', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'promotion_state.json',
    priorState, resultingState: 'DENIED',
    justification, semanticDisposition: 'QUALIFICATION_DENIAL',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { lane: promotionState.lanes.promotion_decision } };
}

function applyInsufficiencyAcknowledge({ client, runId, actor_id, justification, insufficiency_permanent, promotionState, existingLog, validation }) {
  promotionState.insufficiency_acknowledged = true;
  promotionState.insufficiency_justification = justification;
  promotionState.insufficiency_permanent = insufficiency_permanent === true;
  promotionState.insufficiency_acknowledged_by = actor_id;
  promotionState.insufficiency_acknowledged_at = new Date().toISOString();

  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'insufficiency_acknowledge', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'promotion_state.json',
    priorState: promotionState.s_level, resultingState: promotionState.s_level,
    justification, semanticDisposition: 'INSUFFICIENCY_DETERMINATION',
  });
  appendEvent(client, runId, event);

  return {
    event,
    updatedState: {
      insufficiency_acknowledged: true,
      insufficiency_permanent: promotionState.insufficiency_permanent,
      s_level: promotionState.s_level,
    },
  };
}

function applyCrosswalkAccept({ client, runId, actor_id, justification, promotionState, existingLog, validation }) {
  const priorState = promotionState.lanes.crosswalk.state;
  promotionState.lanes.crosswalk.state = 'VALIDATED';
  promotionState.lanes.crosswalk.blocking_gaps = [];

  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'crosswalk_accept', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'promotion_state.json',
    priorState, resultingState: 'VALIDATED',
    justification, semanticDisposition: 'STRUCTURAL_ACCEPTANCE',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { lane: promotionState.lanes.crosswalk } };
}

function applyReconciliationAccept({ client, runId, actor_id, justification, promotionState, existingLog, validation }) {
  const priorState = promotionState.lanes.reconciliation.state;
  promotionState.lanes.reconciliation.state = 'COMPLETE';
  promotionState.lanes.reconciliation.blocking_gaps = [];

  writePromotionState(client, runId, promotionState);

  const event = buildEvent({
    existingLog, actorId: actor_id, actorRole: validation.actor_role,
    action: 'reconciliation_accept', authorityDomain: validation.authority_domain,
    authorityLevel: validation.authority_level, targetArtifact: 'promotion_state.json',
    priorState, resultingState: 'COMPLETE',
    justification, semanticDisposition: 'STRUCTURAL_ACCEPTANCE',
  });
  appendEvent(client, runId, event);

  return { event, updatedState: { lane: promotionState.lanes.reconciliation } };
}

function updateObligationCounters(reviewObligations) {
  const obls = reviewObligations.obligations || [];
  reviewObligations.total_obligations = obls.length;
  reviewObligations.resolved = obls.filter(o => TERMINAL_OBLIGATION_STATES.includes(o.status)).length;
  reviewObligations.unresolved = obls.length - reviewObligations.resolved;
}

function maybeUpdateReviewQueueLane(promotionState, reviewObligations, qualificationBlockers, client, runId) {
  const obls = reviewObligations.obligations || [];
  if (obls.length === 0) return;
  const allTerminal = obls.every(o => TERMINAL_OBLIGATION_STATES.includes(o.status));
  if (allTerminal) {
    promotionState.lanes.review_queue.state = 'RESOLVED';
    promotionState.lanes.review_queue.blocking_gaps = [];

    if (qualificationBlockers && qualificationBlockers.blockers) {
      const reviewBlocker = qualificationBlockers.blockers.find(
        b => b.lane === 'review_queue' && !b.resolved
      );
      if (reviewBlocker) {
        reviewBlocker.resolved = true;
        reviewBlocker.resolved_at = new Date().toISOString();
        reviewBlocker.resolution_path = 'OPERATOR_REVIEW';
        reviewBlocker.resolution_note = `All ${obls.length} proposition class obligations resolved through operator review`;
        qualificationBlockers.unresolved_blockers = qualificationBlockers.blockers.filter(b => !b.resolved).length;
        qualificationBlockers.promotion_eligible = qualificationBlockers.unresolved_blockers === 0;
        writeQualificationBlockers(client, runId, qualificationBlockers);
      }

      if (promotionState.lanes.promotion_decision) {
        const gaps = promotionState.lanes.promotion_decision.blocking_gaps || [];
        const idx = gaps.indexOf('PROPOSITION_REVIEW_PENDING');
        if (idx !== -1) {
          gaps.splice(idx, 1);
        }
      }
    }
  }
}

function replayValidate(client, runId) {
  try {
    const loaded = loadPromotionState(client, runId);
    if (!loaded.loaded) return { valid: false, reason: 'ARTIFACTS_NOT_FOUND' };

    const log = loaded.promotionEventLog || [];
    const state = loaded.promotionState;

    if (!state || !log.length) return { valid: true };

    const lastEvent = log[log.length - 1];
    if (state.audit_event_refs && state.audit_event_refs.length > 0) {
      const lastRef = state.audit_event_refs[state.audit_event_refs.length - 1];
      const refExists = log.some(e => e.event_id === lastRef);
      if (!refExists) return { valid: false, reason: 'AUDIT_REF_MISSING', detail: `Event ${lastRef} not found in log` };
    }

    const eventIds = log.map(e => e.event_id);
    const uniqueIds = new Set(eventIds);
    if (uniqueIds.size !== eventIds.length) {
      return { valid: false, reason: 'DUPLICATE_EVENT_IDS' };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, reason: 'REPLAY_ERROR', detail: err.message };
  }
}

module.exports = { executeAction };

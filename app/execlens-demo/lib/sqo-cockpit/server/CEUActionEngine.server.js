'use strict';

const { loadReconciliationState, writeReconciliationState, writeReconciliationObligations } = require('./CEUStateLoader.server');
const { validateAction } = require('./CEUAuthorityValidator.server');
const { readExistingLog, buildEvent, appendEvent } = require('./CEUEventWriter.server');

const TERMINAL_STATES = ['CONFIRMED', 'REJECTED', 'MERGED'];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function recomputeSummary(candidates) {
  const summary = {
    total: 0, proposed: 0, evidence_attached: 0, reconciled: 0,
    confirmed: 0, rejected: 0, merged: 0, split: 0, reclassified: 0, pending: 0,
  };
  for (const [, c] of Object.entries(candidates)) {
    summary.total++;
    const state = c.state.toLowerCase().replace(/_/g, '_');
    if (state === 'proposed') summary.proposed++;
    else if (state === 'evidence_attached') summary.evidence_attached++;
    else if (state === 'reconciled') summary.reconciled++;
    else if (state === 'confirmed') summary.confirmed++;
    else if (state === 'rejected') summary.rejected++;
    else if (state === 'merged') summary.merged++;

    if (!TERMINAL_STATES.includes(c.state)) summary.pending++;
  }
  return summary;
}

const REVIEW_MODE_RANK = {
  UNCLASSIFIED: 0,
  SYSTEM_TEST: 1,
  OPERATOR_VALIDATED: 2,
  DOMAIN_AUTHORITY_VALIDATED: 3,
};

function recomputePromotionGate(candidates, obligations, reviewMode) {
  const allResolved = Object.values(candidates).every(c => TERMINAL_STATES.includes(c.state));
  const unresolvedObls = (obligations || []).filter(o => o.status === 'UNRESOLVED').length;
  const candidatesCleared = allResolved && unresolvedObls === 0;
  const modeRank = REVIEW_MODE_RANK[reviewMode] ?? 0;
  const reviewSufficient = modeRank >= REVIEW_MODE_RANK.OPERATOR_VALIDATED;
  const permitted = candidatesCleared && reviewSufficient;

  let gate_reason;
  if (permitted) {
    gate_reason = 'All candidates resolved, obligations cleared, and review mode qualifies — semantic derivation permitted';
  } else if (!allResolved) {
    gate_reason = `${Object.values(candidates).filter(c => !TERMINAL_STATES.includes(c.state)).length} candidates still pending resolution`;
  } else if (unresolvedObls > 0) {
    gate_reason = `${unresolvedObls} unresolved obligations remain`;
  } else {
    gate_reason = `Review mode "${reviewMode || 'UNCLASSIFIED'}" insufficient — requires OPERATOR_VALIDATED or DOMAIN_AUTHORITY_VALIDATED`;
  }

  return {
    all_candidates_resolved: allResolved,
    unresolved_obligations: unresolvedObls,
    review_mode: reviewMode || 'UNCLASSIFIED',
    review_sufficient: reviewSufficient,
    semantic_derivation_permitted: permitted,
    gate_reason,
  };
}

function executeAction({ action, client, runId, actor_id, target_ceu_id, justification, merge_target, new_tier, finding, evidence_ref, obligation_description }) {
  const loaded = loadReconciliationState(client, runId);
  if (!loaded.loaded) {
    return { success: false, error: 'ARTIFACTS_NOT_FOUND', detail: `No CEU reconciliation artifacts found for ${client}/${runId}` };
  }

  const { reconciliationState, reconciliationObligations } = loaded;

  const validation = validateAction(action, actor_id, target_ceu_id, reconciliationState, reconciliationObligations);
  if (!validation.valid) {
    return { success: false, error: validation.reason, detail: validation.detail, boundary_violation: validation.boundary_violation || false };
  }

  const stateSnapshot = deepClone(reconciliationState);
  const obligationsSnapshot = deepClone(reconciliationObligations);

  try {
    const result = applyAction({
      action, client, runId, actor_id, target_ceu_id, justification,
      merge_target, new_tier, finding, evidence_ref, obligation_description,
      reconciliationState, reconciliationObligations,
      validation,
    });

    return {
      success: true,
      event: result.event,
      updatedState: result.updatedState,
      _disclaimer: 'actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.',
    };
  } catch (err) {
    writeReconciliationState(client, runId, stateSnapshot);
    writeReconciliationObligations(client, runId, obligationsSnapshot);
    return { success: false, error: 'MUTATION_FAILED', detail: err.message };
  }
}

function applyAction({ action, client, runId, actor_id, target_ceu_id, justification, merge_target, new_tier, finding, evidence_ref, obligation_description, reconciliationState, reconciliationObligations, validation }) {
  const existingLog = readExistingLog(client, runId);
  const now = new Date().toISOString();
  const candidates = reconciliationState.candidates;
  const obligations = reconciliationObligations.obligations || [];

  let event;

  switch (action) {
    case 'ceu_attach_evidence': {
      const candidate = candidates[target_ceu_id];
      const priorState = candidate.state;
      candidate.state = 'EVIDENCE_ATTACHED';
      candidate.evidence_count = (candidate.evidence_count || 0) + 1;
      candidate.last_action = action;
      candidate.last_actor = actor_id;
      candidate.last_action_at = now;

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: target_ceu_id,
        priorState, resultingState: 'EVIDENCE_ATTACHED',
        justification, evidenceRefs: evidence_ref ? [evidence_ref] : [],
      });
      break;
    }

    case 'ceu_reconcile': {
      const candidate = candidates[target_ceu_id];
      const priorState = candidate.state;
      candidate.state = 'RECONCILED';
      candidate.reconciliation_finding = finding || null;
      candidate.last_action = action;
      candidate.last_actor = actor_id;
      candidate.last_action_at = now;

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: target_ceu_id,
        priorState, resultingState: 'RECONCILED',
        justification,
        detail: { finding: finding || null },
      });
      break;
    }

    case 'ceu_confirm': {
      const candidate = candidates[target_ceu_id];
      const priorState = candidate.state;
      candidate.state = 'CONFIRMED';
      candidate.last_action = action;
      candidate.last_actor = actor_id;
      candidate.last_action_at = now;

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: target_ceu_id,
        priorState, resultingState: 'CONFIRMED',
        justification,
      });
      break;
    }

    case 'ceu_reject': {
      const candidate = candidates[target_ceu_id];
      const priorState = candidate.state;
      candidate.state = 'REJECTED';
      candidate.last_action = action;
      candidate.last_actor = actor_id;
      candidate.last_action_at = now;

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: target_ceu_id,
        priorState, resultingState: 'REJECTED',
        justification,
      });
      break;
    }

    case 'ceu_merge': {
      const candidate = candidates[target_ceu_id];
      const priorState = candidate.state;
      candidate.state = 'MERGED';
      candidate.merged_into = merge_target || null;
      candidate.last_action = action;
      candidate.last_actor = actor_id;
      candidate.last_action_at = now;

      if (merge_target && candidates[merge_target]) {
        candidates[merge_target].file_count = (candidates[merge_target].file_count || 0) + (candidate.file_count || 0);
      }

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: target_ceu_id,
        priorState, resultingState: 'MERGED',
        justification,
        detail: { merge_target: merge_target || null },
      });
      break;
    }

    case 'ceu_split': {
      const candidate = candidates[target_ceu_id];
      const priorState = candidate.state;
      candidate.state = 'REJECTED';
      candidate.split_reason = justification || 'Split into sub-domains';
      candidate.last_action = action;
      candidate.last_actor = actor_id;
      candidate.last_action_at = now;

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: target_ceu_id,
        priorState, resultingState: 'REJECTED',
        justification,
        detail: { split: true },
      });
      break;
    }

    case 'ceu_reclassify': {
      const candidate = candidates[target_ceu_id];
      const priorTier = candidate.tier;
      candidate.tier = new_tier || candidate.tier;
      candidate.last_action = action;
      candidate.last_actor = actor_id;
      candidate.last_action_at = now;

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: target_ceu_id,
        priorState: priorTier, resultingState: new_tier || priorTier,
        justification,
        detail: { prior_tier: priorTier, new_tier: new_tier || priorTier },
      });
      break;
    }

    case 'ceu_create_obligation': {
      const oblId = `OBL-CEU-${String(obligations.length + 1).padStart(4, '0')}`;
      obligations.push({
        obligation_id: oblId,
        ceu_id: target_ceu_id,
        obligation_type: 'MANUAL_REVIEW',
        description: obligation_description || 'Manual review obligation',
        required_evidence: justification || '',
        status: 'UNRESOLVED',
        created_at: now,
      });

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: target_ceu_id,
        priorState: null, resultingState: 'UNRESOLVED',
        justification: obligation_description,
        detail: { obligation_id: oblId },
      });
      break;
    }

    case 'ceu_resolve_obligation': {
      const obl = obligations.find(o => o.obligation_id === target_ceu_id);
      const priorStatus = obl.status;
      obl.status = 'RESOLVED';
      obl.resolved_at = now;
      obl.resolved_by = actor_id;
      obl.resolution = justification || 'Resolved';

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: obl.ceu_id,
        priorState: priorStatus, resultingState: 'RESOLVED',
        justification,
        detail: { obligation_id: target_ceu_id },
      });
      break;
    }

    case 'ceu_classify_review': {
      const priorMode = reconciliationState.review_mode || 'UNCLASSIFIED';
      reconciliationState.review_mode = target_ceu_id;

      event = buildEvent({
        existingLog, actorId: actor_id, actorRole: validation.actor_role,
        action, targetCeuId: null,
        priorState: priorMode, resultingState: target_ceu_id,
        justification,
        detail: { prior_review_mode: priorMode, new_review_mode: target_ceu_id },
      });
      break;
    }

    default:
      throw new Error(`Unknown action: ${action}`);
  }

  reconciliationState.summary = recomputeSummary(candidates);
  reconciliationState.promotion_gate = recomputePromotionGate(candidates, obligations, reconciliationState.review_mode);
  reconciliationState.reconciliation_status = reconciliationState.promotion_gate.semantic_derivation_permitted ? 'COMPLETE' : 'IN_PROGRESS';

  reconciliationObligations.obligations = obligations;
  reconciliationObligations.total_obligations = obligations.length;
  reconciliationObligations.resolved = obligations.filter(o => o.status === 'RESOLVED').length;
  reconciliationObligations.unresolved = obligations.filter(o => o.status === 'UNRESOLVED').length;

  writeReconciliationState(client, runId, reconciliationState);
  writeReconciliationObligations(client, runId, reconciliationObligations);
  appendEvent(client, runId, event);

  return { event, updatedState: reconciliationState };
}

module.exports = { executeAction };

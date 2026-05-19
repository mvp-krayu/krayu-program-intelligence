'use strict';

const { loadPromotionState } = require('./PromotionStateLoader.server');
const { ROLE_ACTION_MAP, ACTION_AUTHORITY } = require('./SQOAuthorityValidator.server');

function resolveAuthorityWorkspace(client, runId) {
  const loaded = loadPromotionState(client, runId);
  if (!loaded.loaded) {
    return { available: false, client, runId };
  }

  const { promotionState, qualificationBlockers, reviewObligations, promotionEventLog } = loaded;

  const authorityPosture = resolveAuthorityPosture(promotionState);
  const reviewQueue = resolveReviewQueue(reviewObligations);
  const promotionControl = resolvePromotionControl(promotionState, qualificationBlockers, promotionEventLog);
  const blockerList = resolveBlockerList(qualificationBlockers, reviewObligations);
  const eventTimeline = resolveEventTimeline(promotionEventLog);

  return {
    available: true,
    client,
    runId,
    authorityPosture,
    reviewQueue,
    promotionControl,
    blockerList,
    eventTimeline,
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
    affordances[obl.id] = resolveObligationAffordances(obl);
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

module.exports = { resolveAuthorityWorkspace };

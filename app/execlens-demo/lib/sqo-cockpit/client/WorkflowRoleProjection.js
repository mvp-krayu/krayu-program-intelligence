'use strict';

const ROLE_ACTION_MAP = {
  operator: [
    'review_accept', 'review_reject', 'review_contest', 'review_partial_accept',
    'promotion_request', 'promotion_approve', 'promotion_deny',
    'insufficiency_acknowledge', 'crosswalk_accept', 'reconciliation_accept',
    'escalate_arbitration', 'resolve_arbitration',
  ],
  reviewer: [
    'review_accept', 'review_reject', 'review_contest', 'review_partial_accept',
    'escalate_arbitration',
  ],
  domain_authority: [
    'review_accept', 'review_reject', 'crosswalk_accept',
    'escalate_arbitration',
  ],
  promotion_authority: [
    'promotion_request', 'promotion_approve', 'promotion_deny',
    'insufficiency_acknowledge', 'resolve_arbitration',
  ],
  audit_authority: [],
};

const ROLE_LABELS = {
  operator: 'Operator',
  reviewer: 'Reviewer',
  domain_authority: 'Domain Authority',
  promotion_authority: 'Promotion Authority',
  audit_authority: 'Audit Authority',
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

function computeWorkflowProjection(workflowState, newRole) {
  if (!workflowState) return workflowState;

  const roleActions = ROLE_ACTION_MAP[newRole] || [];
  const allActions = workflowState.availableActions || [];
  const hasReviewAuthority = roleActions.some(a => a.startsWith('review_'));

  const availableActions = allActions.map(def => {
    const roleHasAction = roleActions.includes(def.action);
    const stateBlocked = def.reason_if_unavailable && !def.required_role;
    const stateValid = !stateBlocked || def.available;
    const available = roleHasAction && (def.available || (stateValid && roleHasAction));

    const originalStateReason = def.available ? null : (def.required_role ? null : def.reason_if_unavailable);
    const actuallyAvailable = roleHasAction && !originalStateReason;

    let reason_if_unavailable = null;
    let required_role = null;

    if (!actuallyAvailable) {
      if (!roleHasAction) {
        required_role = findRequiredRole(def.action, newRole);
        reason_if_unavailable = `Requires ${ROLE_LABELS[required_role] || required_role}`;
        if (originalStateReason) {
          reason_if_unavailable += ` — ${originalStateReason}`;
        }
      } else {
        reason_if_unavailable = originalStateReason;
      }
    }

    return {
      ...def,
      available: actuallyAvailable,
      reason_if_unavailable,
      required_role,
    };
  });

  const allActionKeys = allActions.map(a => a.action);
  const permitted = roleActions.filter(a => allActionKeys.includes(a));
  const prohibited = allActionKeys.filter(a => !roleActions.includes(a));
  const escalation_targets = prohibited.map(action => ({
    action,
    required_role: findRequiredRole(action, newRole),
  }));

  const roleProjection = {
    role: newRole,
    roleLabel: ROLE_LABELS[newRole] || newRole,
    permitted_actions: permitted,
    prohibited_actions: prohibited,
    escalation_targets,
  };

  const obligations = workflowState.obligationSummary || {};
  const actionable_by_role = hasReviewAuthority ? obligations.unresolved || 0 : 0;

  const byLane = {};
  const originalLanes = workflowState.blockerSummary?.by_lane || {};
  for (const [lane, data] of Object.entries(originalLanes)) {
    const resAction = data.resolution_action;
    byLane[lane] = {
      ...data,
      resolvable_by_role: resAction ? roleActions.includes(resAction) : false,
    };
  }
  const escalation_required = Object.values(byLane).some(l => !l.resolvable_by_role && l.count > 0);

  let primaryGuidance = workflowState.primaryGuidance;
  if (obligations.unresolved > 0 && hasReviewAuthority) {
    primaryGuidance = {
      headline: `${obligations.unresolved} review obligation${obligations.unresolved !== 1 ? 's' : ''} require${obligations.unresolved === 1 ? 's' : ''} operator action.`,
      action_target: 'authority',
      urgency: 'critical',
    };
  }

  return {
    ...workflowState,
    availableActions,
    roleProjection,
    primaryGuidance,
    obligationSummary: { ...obligations, actionable_by_role },
    blockerSummary: { ...workflowState.blockerSummary, by_lane: byLane, escalation_required },
  };
}

module.exports = { computeWorkflowProjection, ROLE_ACTION_MAP, ROLE_LABELS };

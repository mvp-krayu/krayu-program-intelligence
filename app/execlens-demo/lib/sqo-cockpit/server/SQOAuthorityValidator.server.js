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

const ACTION_AUTHORITY = {
  review_accept: { domain: 'semantic_authority', level: 'L4' },
  review_reject: { domain: 'semantic_authority', level: 'L4' },
  review_contest: { domain: 'semantic_authority', level: 'L4' },
  review_partial_accept: { domain: 'semantic_authority', level: 'L4' },
  promotion_request: { domain: 'governance_authority', level: 'L5' },
  promotion_approve: { domain: 'governance_authority', level: 'L5' },
  promotion_deny: { domain: 'governance_authority', level: 'L5' },
  insufficiency_acknowledge: { domain: 'governance_authority', level: 'L5' },
  crosswalk_accept: { domain: 'structural_authority', level: 'L4' },
  reconciliation_accept: { domain: 'structural_authority', level: 'L5' },
  escalate_arbitration: { domain: 'semantic_authority', level: 'L4' },
  resolve_arbitration: { domain: 'governance_authority', level: 'L5' },
};

const REVIEW_ACTIONABLE_STATES = ['UNRESOLVED', 'CONTESTED', 'DISPUTED'];
const REVIEW_CONTESTABLE_STATES = ['UNRESOLVED', 'RESOLVED'];

function extractRole(actorId) {
  if (!actorId || typeof actorId !== 'string') return null;
  const colonIdx = actorId.indexOf(':');
  if (colonIdx === -1) return null;
  return actorId.substring(0, colonIdx);
}

function isSystemActor(actorId) {
  return actorId && actorId.startsWith('system:');
}

function validateAction(action, actorId, targetItem, promotionState, reviewObligations, promotionEventLog, qualificationBlockers) {
  if (!action || !ACTION_AUTHORITY[action]) {
    return { valid: false, reason: 'UNKNOWN_ACTION', detail: `Action "${action}" is not recognized` };
  }

  if (!actorId) {
    return { valid: false, reason: 'MISSING_ACTOR', detail: 'actor_id is required' };
  }

  if (isSystemActor(actorId)) {
    return {
      valid: false,
      reason: 'NON_AUTOMATABLE_BOUNDARY',
      boundary_violation: true,
      detail: 'System actors cannot execute authority actions. This is a non-automatable boundary.',
    };
  }

  const role = extractRole(actorId);
  if (!role || !ROLE_ACTION_MAP[role]) {
    return { valid: false, reason: 'UNKNOWN_ROLE', detail: `Role "${role}" is not recognized. Use operator, reviewer, domain_authority, promotion_authority, or audit_authority.` };
  }

  if (!ROLE_ACTION_MAP[role].includes(action)) {
    return {
      valid: false,
      reason: 'ROLE_ACTION_MISMATCH',
      detail: `Role "${role}" is not authorized for action "${action}"`,
    };
  }

  const authority = ACTION_AUTHORITY[action];
  const stateCheck = validateStatePrerequisites(action, targetItem, promotionState, reviewObligations, promotionEventLog, qualificationBlockers);
  if (!stateCheck.valid) return stateCheck;

  return {
    valid: true,
    action,
    actor_id: actorId,
    actor_role: role,
    authority_domain: authority.domain,
    authority_level: authority.level,
  };
}

function validateStatePrerequisites(action, targetItem, promotionState, reviewObligations, promotionEventLog, qualificationBlockers) {
  const obligations = reviewObligations?.obligations || [];

  switch (action) {
    case 'review_accept':
    case 'review_reject': {
      if (!targetItem) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_item is required for review actions' };
      const obl = obligations.find(o => o.id === targetItem);
      if (!obl) return { valid: false, reason: 'TARGET_NOT_FOUND', detail: `Obligation "${targetItem}" not found` };
      if (!REVIEW_ACTIONABLE_STATES.includes(obl.status)) {
        return { valid: false, reason: 'INVALID_STATE', detail: `Obligation "${targetItem}" is in state "${obl.status}" — must be one of: ${REVIEW_ACTIONABLE_STATES.join(', ')}` };
      }
      return { valid: true };
    }

    case 'review_contest': {
      if (!targetItem) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_item is required for contest' };
      const obl = obligations.find(o => o.id === targetItem);
      if (!obl) return { valid: false, reason: 'TARGET_NOT_FOUND', detail: `Obligation "${targetItem}" not found` };
      if (!REVIEW_CONTESTABLE_STATES.includes(obl.status)) {
        return { valid: false, reason: 'INVALID_STATE', detail: `Obligation "${targetItem}" is in state "${obl.status}" — must be one of: ${REVIEW_CONTESTABLE_STATES.join(', ')}` };
      }
      return { valid: true };
    }

    case 'review_partial_accept': {
      if (!targetItem) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_item is required for partial accept' };
      const obl = obligations.find(o => o.id === targetItem);
      if (!obl) return { valid: false, reason: 'TARGET_NOT_FOUND', detail: `Obligation "${targetItem}" not found` };
      if (obl.status !== 'UNRESOLVED') {
        return { valid: false, reason: 'INVALID_STATE', detail: `Obligation "${targetItem}" must be UNRESOLVED for partial accept` };
      }
      return { valid: true };
    }

    case 'escalate_arbitration': {
      if (!targetItem) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_item is required for arbitration escalation' };
      const obl = obligations.find(o => o.id === targetItem);
      if (!obl) return { valid: false, reason: 'TARGET_NOT_FOUND', detail: `Obligation "${targetItem}" not found` };
      if (obl.status !== 'CONTESTED') {
        return { valid: false, reason: 'INVALID_STATE', detail: `Obligation "${targetItem}" must be CONTESTED for arbitration escalation` };
      }
      return { valid: true };
    }

    case 'resolve_arbitration': {
      if (!targetItem) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_item is required for arbitration resolution' };
      const obl = obligations.find(o => o.id === targetItem);
      if (!obl) return { valid: false, reason: 'TARGET_NOT_FOUND', detail: `Obligation "${targetItem}" not found` };
      if (obl.status !== 'ARBITRATION_REQUIRED') {
        return { valid: false, reason: 'INVALID_STATE', detail: `Obligation "${targetItem}" must be ARBITRATION_REQUIRED for resolution` };
      }
      return { valid: true };
    }

    case 'promotion_request': {
      const unresolvedBlockers = (qualificationBlockers?.blockers || []).filter(b => !b.resolved);
      if (unresolvedBlockers.length > 0) {
        return { valid: false, reason: 'BLOCKERS_UNRESOLVED', detail: `${unresolvedBlockers.length} qualification blockers remain unresolved` };
      }
      return { valid: true };
    }

    case 'promotion_approve':
    case 'promotion_deny': {
      const events = promotionEventLog || [];
      const hasRequest = events.some(e => e.action === 'promotion_request');
      const hasDecision = events.some(e => e.action === 'promotion_approve' || e.action === 'promotion_deny');
      if (!hasRequest) {
        return { valid: false, reason: 'NO_PROMOTION_REQUEST', detail: 'No pending promotion request exists' };
      }
      if (hasDecision) {
        return { valid: false, reason: 'ALREADY_DECIDED', detail: 'Promotion has already been approved or denied' };
      }
      return { valid: true };
    }

    case 'insufficiency_acknowledge': {
      const sLevel = promotionState?.s_level;
      if (sLevel !== 'S1' && sLevel !== 'S1.5') {
        return { valid: false, reason: 'INVALID_S_LEVEL', detail: `Insufficiency acknowledgment requires S1 or S1.5, current is ${sLevel}` };
      }
      return { valid: true };
    }

    case 'crosswalk_accept': {
      const crosswalkLane = promotionState?.lanes?.crosswalk;
      if (!crosswalkLane || crosswalkLane.state === 'ABSENT') {
        return { valid: false, reason: 'NO_CROSSWALK', detail: 'No crosswalk artifact exists to accept' };
      }
      return { valid: true };
    }

    case 'reconciliation_accept': {
      const reconLane = promotionState?.lanes?.reconciliation;
      if (!reconLane || reconLane.state === 'ABSENT') {
        return { valid: false, reason: 'NO_RECONCILIATION', detail: 'No reconciliation artifact exists to accept' };
      }
      return { valid: true };
    }

    default:
      return { valid: false, reason: 'UNKNOWN_ACTION', detail: `No prerequisite check for "${action}"` };
  }
}

module.exports = {
  validateAction,
  extractRole,
  isSystemActor,
  ACTION_AUTHORITY,
  ROLE_ACTION_MAP,
};

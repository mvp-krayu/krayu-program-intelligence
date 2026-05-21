'use strict';

const ROLE_ACTION_MAP = {
  operator: [
    'ceu_attach_evidence', 'ceu_reconcile',
    'ceu_confirm', 'ceu_reject', 'ceu_merge', 'ceu_split', 'ceu_reclassify',
    'ceu_create_obligation', 'ceu_resolve_obligation',
    'ceu_classify_review',
  ],
  reviewer: [
    'ceu_attach_evidence', 'ceu_reconcile',
    'ceu_create_obligation',
  ],
  domain_authority: [
    'ceu_confirm', 'ceu_reject', 'ceu_merge', 'ceu_split', 'ceu_reclassify',
    'ceu_resolve_obligation',
    'ceu_classify_review',
  ],
  promotion_authority: [],
  audit_authority: [],
};

const ACTION_AUTHORITY = {
  ceu_attach_evidence:    { domain: 'semantic_authority', level: 'L3' },
  ceu_reconcile:          { domain: 'semantic_authority', level: 'L4' },
  ceu_confirm:            { domain: 'semantic_authority', level: 'L4' },
  ceu_reject:             { domain: 'semantic_authority', level: 'L4' },
  ceu_merge:              { domain: 'semantic_authority', level: 'L4' },
  ceu_split:              { domain: 'semantic_authority', level: 'L4' },
  ceu_reclassify:         { domain: 'semantic_authority', level: 'L4' },
  ceu_create_obligation:  { domain: 'semantic_authority', level: 'L3' },
  ceu_resolve_obligation: { domain: 'semantic_authority', level: 'L4' },
  ceu_classify_review:    { domain: 'governance_authority', level: 'L4' },
};

const VALID_CANDIDATE_STATES = ['PROPOSED', 'EVIDENCE_ATTACHED', 'RECONCILED', 'CONFIRMED', 'REJECTED', 'MERGED'];
const TERMINAL_STATES = ['CONFIRMED', 'REJECTED', 'MERGED'];

function extractRole(actorId) {
  if (!actorId || typeof actorId !== 'string') return 'unknown';
  const idx = actorId.indexOf(':');
  return idx > 0 ? actorId.substring(0, idx) : 'unknown';
}

function isSystemActor(actorId) {
  return actorId && actorId.startsWith('system:');
}

function validateAction(action, actorId, targetCeuId, reconciliationState, reconciliationObligations) {
  if (!action) {
    return { valid: false, reason: 'MISSING_ACTION', detail: 'Action is required' };
  }

  if (!actorId) {
    return { valid: false, reason: 'MISSING_ACTOR', detail: 'actor_id is required' };
  }

  if (isSystemActor(actorId)) {
    return {
      valid: false,
      reason: 'NON_AUTOMATABLE_BOUNDARY',
      detail: 'System actors cannot execute CEU reconciliation actions. Human authority required.',
      boundary_violation: true,
    };
  }

  const role = extractRole(actorId);
  const allowedActions = ROLE_ACTION_MAP[role];
  if (!allowedActions) {
    return { valid: false, reason: 'UNKNOWN_ROLE', detail: `Role "${role}" is not recognized` };
  }

  if (!allowedActions.includes(action)) {
    return { valid: false, reason: 'ACTION_NOT_PERMITTED', detail: `Role "${role}" cannot perform "${action}"` };
  }

  const authority = ACTION_AUTHORITY[action];
  if (!authority) {
    return { valid: false, reason: 'UNKNOWN_ACTION', detail: `Action "${action}" is not recognized` };
  }

  const candidates = reconciliationState?.candidates || {};
  const obligations = reconciliationObligations?.obligations || [];

  switch (action) {
    case 'ceu_attach_evidence': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_ceu_id is required' };
      const candidate = candidates[targetCeuId];
      if (!candidate) return { valid: false, reason: 'CANDIDATE_NOT_FOUND', detail: `CEU "${targetCeuId}" not found` };
      if (TERMINAL_STATES.includes(candidate.state)) {
        return { valid: false, reason: 'CANDIDATE_TERMINAL', detail: `CEU "${targetCeuId}" is in terminal state "${candidate.state}"` };
      }
      break;
    }

    case 'ceu_reconcile': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_ceu_id is required' };
      const candidate = candidates[targetCeuId];
      if (!candidate) return { valid: false, reason: 'CANDIDATE_NOT_FOUND', detail: `CEU "${targetCeuId}" not found` };
      if (candidate.state !== 'EVIDENCE_ATTACHED') {
        return { valid: false, reason: 'INVALID_STATE_FOR_RECONCILE', detail: `CEU "${targetCeuId}" must be EVIDENCE_ATTACHED to reconcile, current: "${candidate.state}"` };
      }
      break;
    }

    case 'ceu_confirm': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_ceu_id is required' };
      const candidate = candidates[targetCeuId];
      if (!candidate) return { valid: false, reason: 'CANDIDATE_NOT_FOUND', detail: `CEU "${targetCeuId}" not found` };
      if (candidate.state !== 'RECONCILED') {
        return { valid: false, reason: 'INVALID_STATE_FOR_CONFIRM', detail: `CEU "${targetCeuId}" must be RECONCILED to confirm, current: "${candidate.state}"` };
      }
      break;
    }

    case 'ceu_reject': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_ceu_id is required' };
      const candidate = candidates[targetCeuId];
      if (!candidate) return { valid: false, reason: 'CANDIDATE_NOT_FOUND', detail: `CEU "${targetCeuId}" not found` };
      if (TERMINAL_STATES.includes(candidate.state)) {
        return { valid: false, reason: 'CANDIDATE_TERMINAL', detail: `CEU "${targetCeuId}" is already in terminal state "${candidate.state}"` };
      }
      break;
    }

    case 'ceu_merge': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_ceu_id (source) is required' };
      const candidate = candidates[targetCeuId];
      if (!candidate) return { valid: false, reason: 'CANDIDATE_NOT_FOUND', detail: `CEU "${targetCeuId}" not found` };
      if (TERMINAL_STATES.includes(candidate.state)) {
        return { valid: false, reason: 'CANDIDATE_TERMINAL', detail: `CEU "${targetCeuId}" is already in terminal state "${candidate.state}"` };
      }
      break;
    }

    case 'ceu_split': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_ceu_id is required' };
      const candidate = candidates[targetCeuId];
      if (!candidate) return { valid: false, reason: 'CANDIDATE_NOT_FOUND', detail: `CEU "${targetCeuId}" not found` };
      if (candidate.state !== 'RECONCILED') {
        return { valid: false, reason: 'INVALID_STATE_FOR_SPLIT', detail: `CEU "${targetCeuId}" must be RECONCILED to split, current: "${candidate.state}"` };
      }
      break;
    }

    case 'ceu_reclassify': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_ceu_id is required' };
      const candidate = candidates[targetCeuId];
      if (!candidate) return { valid: false, reason: 'CANDIDATE_NOT_FOUND', detail: `CEU "${targetCeuId}" not found` };
      if (candidate.state !== 'RECONCILED') {
        return { valid: false, reason: 'INVALID_STATE_FOR_RECLASSIFY', detail: `CEU "${targetCeuId}" must be RECONCILED to reclassify, current: "${candidate.state}"` };
      }
      break;
    }

    case 'ceu_create_obligation': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'target_ceu_id is required' };
      const candidate = candidates[targetCeuId];
      if (!candidate) return { valid: false, reason: 'CANDIDATE_NOT_FOUND', detail: `CEU "${targetCeuId}" not found` };
      break;
    }

    case 'ceu_resolve_obligation': {
      if (!targetCeuId) return { valid: false, reason: 'MISSING_TARGET', detail: 'obligation_id is required as target_ceu_id' };
      const obl = obligations.find(o => o.obligation_id === targetCeuId);
      if (!obl) return { valid: false, reason: 'OBLIGATION_NOT_FOUND', detail: `Obligation "${targetCeuId}" not found` };
      if (obl.status !== 'UNRESOLVED') {
        return { valid: false, reason: 'OBLIGATION_NOT_UNRESOLVED', detail: `Obligation "${targetCeuId}" is "${obl.status}", must be UNRESOLVED` };
      }
      break;
    }

    case 'ceu_classify_review': {
      const VALID_MODES = ['SYSTEM_TEST', 'OPERATOR_VALIDATED', 'DOMAIN_AUTHORITY_VALIDATED'];
      if (!targetCeuId || !VALID_MODES.includes(targetCeuId)) {
        return { valid: false, reason: 'INVALID_REVIEW_MODE', detail: `target_ceu_id must be one of: ${VALID_MODES.join(', ')}` };
      }
      const currentMode = reconciliationState?.review_mode || 'UNCLASSIFIED';
      if (targetCeuId === 'SYSTEM_TEST' && currentMode !== 'UNCLASSIFIED' && currentMode !== 'SYSTEM_TEST') {
        return { valid: false, reason: 'REVIEW_MODE_DOWNGRADE', detail: `Cannot downgrade review mode from "${currentMode}" to "SYSTEM_TEST"` };
      }
      break;
    }

    default:
      return { valid: false, reason: 'UNKNOWN_ACTION', detail: `Action "${action}" is not recognized` };
  }

  return {
    valid: true,
    actor_role: role,
    authority_domain: authority.domain,
    authority_level: authority.level,
  };
}

module.exports = { validateAction, extractRole, isSystemActor, ACTION_AUTHORITY, ROLE_ACTION_MAP };

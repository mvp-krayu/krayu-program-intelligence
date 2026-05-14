'use strict';

/**
 * ReadinessBadgeAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Transforms report_object readiness fields into ReadinessBadge display props.
 * Token mapping sourced from VIS-READY-01 (visual_semantics_registry.json).
 *
 * Contract: pure function — no mutation, no generation, no AI calls.
 * Raw readiness_state enum must never be passed to the component.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

// VIS-READY-01 — governance-derived token and label mapping
const READINESS_BADGE_MAP = {
  EXECUTIVE_READY: {
    badge_token: 'token-ready',
    executive_label: 'Executive Ready',
    governance_status_label: 'Governance: Pass',
  },
  EXECUTIVE_READY_WITH_QUALIFIER: {
    badge_token: 'token-ready-qualified',
    executive_label: 'Executive Ready — Qualified',
    governance_status_label: 'Governance: Pass — Qualifier Active',
  },
  DIAGNOSTIC_ONLY: {
    badge_token: 'token-diagnostic',
    executive_label: 'Under Structural Review',
    governance_status_label: 'Governance: Diagnostic',
  },
  SUPPRESSED_FROM_EXECUTIVE: {
    badge_token: 'token-suppressed',
    executive_label: 'Not Available',
    governance_status_label: 'Governance: Suppressed',
  },
  BLOCKED_PENDING_DOMAIN_GROUNDING: {
    badge_token: 'token-blocked',
    executive_label: 'Pending Grounding',
    governance_status_label: 'Governance: Blocked',
  },
};

/**
 * adaptReadinessBadge(reportObject)
 *
 * Maps readiness_state and header_block.readiness_badge into display props.
 * Uses VIS-READY-01 token mapping — no raw enum values in output.
 *
 * Returns:
 * {
 *   readiness_label: string,
 *   badge_token: string,
 *   governance_status_label: string,
 *   qualifier_label: string,
 *   tooltip_text: string,
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Does not mutate reportObject.
 */
function adaptReadinessBadge(reportObject) {
  if (!reportObject || typeof reportObject !== 'object') {
    return _blocked('ADAPT-READY-01', 'reportObject is null');
  }

  const { readiness_state, header_block } = reportObject;
  const mapping = READINESS_BADGE_MAP[readiness_state];

  if (!mapping) {
    return _blocked('ADAPT-READY-01',
      `readiness_state '${readiness_state}' has no VIS-READY-01 mapping`);
  }

  const badge = header_block && header_block.readiness_badge;
  // qualifier_label and tooltip_text come from the already-normalized header_block
  // (ALI-03 applied at generation time). Never generated here.
  const qualifier_label = (badge && typeof badge.qualifier_label === 'string')
    ? badge.qualifier_label
    : '';
  const tooltip_text = (badge && typeof badge.tooltip_text === 'string')
    ? badge.tooltip_text
    : '';

  return {
    readiness_label: mapping.executive_label,
    badge_token: mapping.badge_token,
    governance_status_label: mapping.governance_status_label,
    qualifier_label,
    tooltip_text,
    error: null,
  };
}

function _blocked(errorId, detail) {
  return {
    readiness_label: 'Readiness classification unavailable',
    badge_token: 'token-blocked',
    governance_status_label: 'Governance: Blocked',
    qualifier_label: '',
    tooltip_text: '',
    error: makeAdapterError(errorId, detail),
  };
}

module.exports = { adaptReadinessBadge, READINESS_BADGE_MAP };

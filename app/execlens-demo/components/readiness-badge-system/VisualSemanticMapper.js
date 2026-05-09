'use strict';

/**
 * VisualSemanticMapper.js
 * PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01
 *
 * Maps readiness, qualifier, and governance states to governed visual tokens.
 * All mappings derive from visual_semantics_registry.json — not designer preference.
 *
 * Rules enforced:
 *   VIS-READY-01: Readiness badge state token mapping
 *   VIS-QUAL-01:  Qualifier chip token and label mapping
 *   VIS-BLOCK-01: Blocked state full module rendering
 *   VIS-DIAG-01:  Diagnostic state visual rendering
 *   VIS-BLOCK-02: No silent blocked degradation
 *
 * Pure functions. No React. No AI. No external APIs. Deterministic.
 */

// VIS-READY-01: governed readiness badge token mapping
const READINESS_BADGE_MAP = {
  EXECUTIVE_READY: {
    badge_token: 'token-ready',
    executive_label: 'Executive Ready',
    governance_status_label: 'Governance: Pass',
    qualifier_chip_state: null,
  },
  EXECUTIVE_READY_WITH_QUALIFIER: {
    badge_token: 'token-ready-qualified',
    executive_label: 'Executive Ready — Qualified',
    governance_status_label: 'Governance: Pass',
    qualifier_chip_state: 'ACTIVE',
  },
  DIAGNOSTIC_ONLY: {
    badge_token: 'token-diagnostic',
    executive_label: 'Under Structural Review',
    governance_status_label: 'Governance: Advisory',
    qualifier_chip_state: 'token-qualifier-grey',
  },
  SUPPRESSED_FROM_EXECUTIVE: {
    badge_token: 'token-suppressed',
    executive_label: 'Not Available',
    governance_status_label: 'Governance: Suppressed',
    qualifier_chip_state: null,
  },
  BLOCKED_PENDING_DOMAIN_GROUNDING: {
    badge_token: 'token-blocked',
    executive_label: 'Pending Grounding',
    governance_status_label: 'Governance: Pending',
    qualifier_chip_state: null,
  },
};

// VIS-QUAL-01: governed qualifier chip token mapping
const QUALIFIER_CHIP_MAP = {
  'Q-00': {
    renders: false,
    chip_label: null,
    chip_token: 'NONE',
    absence_notice: null,
  },
  'Q-01': {
    renders: true,
    chip_label: 'Partial Grounding',
    chip_token: 'token-qualifier-amber',
    absence_notice: null,
  },
  'Q-02': {
    renders: true,
    chip_label: 'Structural View',
    chip_token: 'token-qualifier-blue',
    absence_notice: null,
  },
  'Q-03': {
    renders: true,
    chip_label: 'Under Review',
    chip_token: 'token-qualifier-grey',
    absence_notice: null,
  },
  'Q-04': {
    renders: false,
    chip_label: null,
    chip_token: 'NONE',
    absence_notice: 'Signal intelligence withheld from this view.',
  },
};

// VIS-BLOCK-01: blocked state display constants
const BLOCKED_DISPLAY = {
  blocked_headline: 'Readiness classification unavailable',
  blocked_body_governance_fail: 'Governance verdict: FAIL',
  blocked_body_hash_fail: 'Evidence integrity: UNVERIFIED',
  badge_token: 'token-blocked',
  blocked_visible: true,
};

// VIS-DIAG-01: diagnostic state display constants
const DIAGNOSTIC_DISPLAY = {
  banner_text: 'This report contains content under advisory review. Advisory confirmation recommended.',
  badge_token: 'token-diagnostic',
  advisory_notice_required: true,
  diagnostic_visible: true,
};

// Governed qualifier tooltips from executive_vocabulary_contract.json
const QUALIFIER_TOOLTIP_MAP = {
  'Q-00': null,
  'Q-01': 'Analysis based on grounded domains. Coverage may be partial.',
  'Q-02': 'Structural topology confirmed. Semantic depth reflects available grounding.',
  'Q-03': 'Advisory confirmation recommended before executive action.',
  'Q-04': null,
};

/**
 * mapReadinessState(readiness_state)
 *
 * Maps a readiness_state enum value to governed badge display props (VIS-READY-01).
 * Unknown states fail closed to token-blocked.
 * Raw enum values never appear in executive_label.
 */
function mapReadinessState(readiness_state) {
  const mapping = READINESS_BADGE_MAP[readiness_state];
  if (!mapping) {
    return {
      badge_token: 'token-blocked',
      executive_label: 'Readiness classification unavailable',
      governance_status_label: 'Governance: Unknown',
      qualifier_chip_state: null,
      error: `VSM-01: unknown readiness_state — ${String(readiness_state)}`,
    };
  }
  return { ...mapping, error: null };
}

/**
 * mapQualifierClass(qualifier_class)
 *
 * Maps a qualifier_class Q-taxonomy value to governed chip display props (VIS-QUAL-01).
 * Q-01..Q-03: renders=true always enforced.
 * Q-04: absence_notice mandatory.
 * Unknown classes fail closed to Q-00 (no-render) with error.
 */
function mapQualifierClass(qualifier_class) {
  const mapping = QUALIFIER_CHIP_MAP[qualifier_class];
  if (!mapping) {
    return {
      renders: false,
      chip_label: null,
      chip_token: 'NONE',
      absence_notice: null,
      error: `VSM-02: unknown qualifier_class — ${String(qualifier_class)}`,
    };
  }
  return { ...mapping, error: null };
}

/**
 * mapGovernanceState(governance_verdict, renderState)
 *
 * Maps governance verdict + render state to governance indicator props.
 * governance_verdict FAIL always produces FAIL_BLOCKED indicator.
 * Deterministic — never infers governance state from other sources.
 */
function mapGovernanceState(governance_verdict, renderState) {
  const isBlocked = renderState === 'BLOCKED' || governance_verdict === 'FAIL';
  const isDiagnostic = renderState === 'DIAGNOSTIC_ONLY';

  let governance_indicator;
  if (governance_verdict === 'FAIL') {
    governance_indicator = 'FAIL_BLOCKED';
  } else if (governance_verdict === 'PASS') {
    governance_indicator = 'PASS';
  } else {
    governance_indicator = 'UNKNOWN';
  }

  return {
    governance_indicator,
    blocked_visible: isBlocked,
    diagnostic_visible: isDiagnostic,
    badge_token: isBlocked
      ? 'token-blocked'
      : isDiagnostic
        ? 'token-diagnostic'
        : 'token-ready',
    error: null,
  };
}

/**
 * mapBlockedState()
 *
 * Returns the governed blocked state display constants (VIS-BLOCK-01).
 * Blocked headline is always 'Readiness classification unavailable'.
 * Never returns a partial or silent result.
 */
function mapBlockedState() {
  return { ...BLOCKED_DISPLAY, error: null };
}

/**
 * mapDiagnosticState()
 *
 * Returns the governed diagnostic state display constants (VIS-DIAG-01).
 * Advisory word always present in banner_text.
 * Never silently degrades.
 */
function mapDiagnosticState() {
  return { ...DIAGNOSTIC_DISPLAY, error: null };
}

/**
 * getQualifierTooltip(qualifier_class)
 *
 * Returns the pre-rendered tooltip text for a qualifier.
 * Text sourced from executive_vocabulary_contract.json.
 * Never generates text dynamically.
 */
function getQualifierTooltip(qualifier_class) {
  return QUALIFIER_TOOLTIP_MAP[qualifier_class] || null;
}

module.exports = {
  mapReadinessState,
  mapQualifierClass,
  mapGovernanceState,
  mapBlockedState,
  mapDiagnosticState,
  getQualifierTooltip,
  READINESS_BADGE_MAP,
  QUALIFIER_CHIP_MAP,
  BLOCKED_DISPLAY,
  DIAGNOSTIC_DISPLAY,
  QUALIFIER_TOOLTIP_MAP,
};

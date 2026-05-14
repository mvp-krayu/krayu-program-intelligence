'use strict';

/**
 * PropagationSemanticMapper.js
 * PI.LENS.NEXTGEN-REPORTS.PROPAGATION-EXPLAINABILITY.01
 *
 * Maps propagation roles, pressure tiers, render states, qualifier classes,
 * and density modes to governance-derived visual semantics.
 *
 * Authority: visual_semantics_registry.json (VIS-PROP-01, VIS-PROP-02, VIS-PRESS-01)
 *            evidence_panel_rules_registry.json (EXP-TRACE-01, EXP-QUAL-01/02)
 *
 * Propagation rendering explains committed structural propagation.
 * Propagation rendering does not compute structural propagation.
 *
 * Pure functions. No React. No AI. No external APIs. Deterministic.
 */

// VIS-PROP-01: Propagation role → governance-derived display semantics
const PROPAGATION_ROLE_MAP = {
  ORIGIN: {
    display_label: 'Origin of Pressure',
    indicator: 'source-indicator',
    visual_weight: 'high',
    role_token: 'token-role-origin',
  },
  RECEIVER: {
    display_label: 'Pressure Receiver',
    indicator: 'receiver-indicator',
    visual_weight: 'medium',
    role_token: 'token-role-receiver',
  },
  PASS_THROUGH: {
    display_label: 'Pressure Pass-through',
    indicator: 'flow-indicator',
    visual_weight: 'medium',
    role_token: 'token-role-passthrough',
  },
  ISOLATED: {
    display_label: 'Independent Domain',
    indicator: 'neutral-indicator',
    visual_weight: 'low',
    role_token: 'token-role-isolated',
  },
};

// VIS-PRESS-01: Pressure tier → governance-derived display semantics
const PRESSURE_TIER_MAP = {
  HIGH: {
    display_label: 'High execution pressure',
    pressure_token: 'token-pressure-high',
  },
  ELEVATED: {
    display_label: 'Elevated pressure',
    pressure_token: 'token-pressure-elevated',
  },
  MODERATE: {
    display_label: 'Moderate pressure',
    pressure_token: 'token-pressure-moderate',
  },
  LOW: {
    display_label: 'Stable / low pressure',
    pressure_token: 'token-pressure-low',
  },
};

// Propagation surface display modes per render state
const PROPAGATION_STATE_MAP = {
  EXECUTIVE_READY: {
    propagation_mode: 'FULL_PROPAGATION',
    qualifier_overlay_active: false,
    blocked_notice: null,
    diagnostic_notice: null,
    surface_token: 'propagation-executive-ready',
    all_chains_visible: true,
    evidence_linkage_visible: true,
  },
  EXECUTIVE_READY_WITH_QUALIFIER: {
    propagation_mode: 'QUALIFIED_PROPAGATION',
    qualifier_overlay_active: true,
    blocked_notice: null,
    diagnostic_notice: null,
    surface_token: 'propagation-executive-qualified',
    all_chains_visible: true,
    evidence_linkage_visible: true,
  },
  DIAGNOSTIC_ONLY: {
    propagation_mode: 'DIAGNOSTIC_PROPAGATION',
    qualifier_overlay_active: true,
    blocked_notice: null,
    diagnostic_notice: 'This report contains content under advisory review. Advisory confirmation recommended.',
    surface_token: 'propagation-diagnostic',
    all_chains_visible: true,
    evidence_linkage_visible: true,
  },
  BLOCKED: {
    propagation_mode: 'BLOCKED_PROPAGATION',
    qualifier_overlay_active: false,
    blocked_notice: 'Readiness classification unavailable',
    diagnostic_notice: null,
    surface_token: 'propagation-blocked',
    all_chains_visible: false,
    evidence_linkage_visible: false,
  },
};

// Qualifier overlay display props per Q-taxonomy class (EXP-QUAL-01/02, VIS-QUAL-01)
const PROPAGATION_QUALIFIER_MAP = {
  'Q-00': {
    renders: false,
    overlay_text: null,
    overlay_token: null,
    absence_notice: null,
  },
  'Q-01': {
    renders: true,
    overlay_text: 'Propagation analysis reflects confirmed structural evidence within grounded domains.',
    overlay_token: 'token-qualifier-amber',
    absence_notice: null,
  },
  'Q-02': {
    renders: true,
    overlay_text: 'Structural topology confirmed. Propagation depth reflects available grounding.',
    overlay_token: 'token-qualifier-blue',
    absence_notice: null,
  },
  'Q-03': {
    renders: true,
    overlay_text: 'Advisory confirmation recommended before acting on propagation analysis.',
    overlay_token: 'token-qualifier-grey',
    absence_notice: null,
  },
  'Q-04': {
    renders: false,
    overlay_text: null,
    overlay_token: null,
    absence_notice: 'Signal intelligence withheld from this view.',
  },
};

// Propagation density layout props per density class
const PROPAGATION_DENSITY_MAP = {
  EXECUTIVE_DENSE: {
    show_propagation_summary: true,
    show_propagation_chains: true,
    show_evidence_linkage: true,
    max_visible_chains: 3,
    chains_collapsed_by_default: false,
    evidence_references_preserved: true,
  },
  EXECUTIVE_BALANCED: {
    show_propagation_summary: true,
    show_propagation_chains: true,
    show_evidence_linkage: false,
    max_visible_chains: 2,
    chains_collapsed_by_default: true,
    evidence_references_preserved: true,
  },
  INVESTIGATION_DENSE: {
    show_propagation_summary: true,
    show_propagation_chains: true,
    show_evidence_linkage: true,
    max_visible_chains: 3,
    chains_collapsed_by_default: false,
    evidence_references_preserved: true,
  },
};

// NORM-FORBID-01: Predictive patterns
const FORBIDDEN_PREDICTIVE_PATTERNS = [
  'will result in', 'will cause', 'will lead to',
  'is expected to', 'is likely to', 'is anticipated to',
  'predicts', 'forecasts', 'projected outcome',
  'will degrade', 'will improve', 'will spread',
  'will cascade', 'will propagate further',
];

// NORM-FORBID-02: Recommendation patterns
const FORBIDDEN_RECOMMENDATION_PATTERNS = [
  'we recommend', 'action item', 'you should', 'the team should',
  'must be addressed', 'requires immediate', 'action required',
  'fix this', 'resolve this', 'address this',
];

// NORM-FORBID-03: Speculative patterns
const FORBIDDEN_SPECULATIVE_PATTERNS = [
  'possibly', 'perhaps', 'maybe', 'might indicate', 'could suggest',
  'may represent', 'our analysis suggests', 'we believe', 'we think',
  'unclear', 'uncertain',
];

// NORM-FORBID-04: AI phrasing
const FORBIDDEN_AI_PHRASING = [
  'Sure!', 'Certainly!', 'Great question!', 'Let me explain',
  'I think', 'I believe', 'I found', 'As an AI',
  'Based on my analysis', "I'm unable to",
];

// GEIOS internal identifiers
const FORBIDDEN_GEIOS_IDENTIFIERS = [
  'TAXONOMY-01', 'signal_value', 'activation_state', 'signal_stable_key',
  'DPSIG', 'EXSIG', 'canonical_topology.json', 'GEIOS substrate',
  'cpi_score', 'cfa_score', 'derivation_hash', 'evidence_object_hash',
  'governed-dpsig-baseline-v1', 'AS-01', 'N-SAF-01',
];

// Probabilistic/confidence framing (EXP-CONF-01: forbidden in propagation rendering)
const FORBIDDEN_PROBABILISTIC_PATTERNS = [
  '%', 'confidence:', 'probability', 'likelihood', 'confidence score',
  'statistical confidence', 'p-value', 'correlation coefficient',
];

/**
 * mapPropagationRole(propagationRole)
 *
 * Maps a PropagationRole enum to governance-derived display props.
 * Unknown roles fail closed to ISOLATED.
 */
function mapPropagationRole(propagationRole) {
  const mapping = PROPAGATION_ROLE_MAP[propagationRole];
  if (!mapping) {
    return {
      ...PROPAGATION_ROLE_MAP['ISOLATED'],
      error: `PSM-01: unknown propagationRole — ${String(propagationRole)}; failing closed to ISOLATED`,
    };
  }
  return { ...mapping, error: null };
}

/**
 * mapPressureTier(pressureTier)
 *
 * Maps a PressureTier enum to governance-derived display props.
 * Numerical values are forbidden (VIS-PRESS-01).
 * Unknown tiers fail closed to MODERATE.
 */
function mapPressureTier(pressureTier) {
  const mapping = PRESSURE_TIER_MAP[pressureTier];
  if (!mapping) {
    return {
      ...PRESSURE_TIER_MAP['MODERATE'],
      error: `PSM-02: unknown pressureTier — ${String(pressureTier)}; failing closed to MODERATE`,
    };
  }
  return { ...mapping, error: null };
}

/**
 * mapPropagationState(renderState)
 *
 * Maps a render state to propagation surface display props.
 * Unknown states fail closed to BLOCKED_PROPAGATION mode.
 */
function mapPropagationState(renderState) {
  const mapping = PROPAGATION_STATE_MAP[renderState];
  if (!mapping) {
    return {
      propagation_mode: 'BLOCKED_PROPAGATION',
      qualifier_overlay_active: false,
      blocked_notice: 'Readiness classification unavailable',
      diagnostic_notice: null,
      surface_token: 'propagation-blocked',
      all_chains_visible: false,
      evidence_linkage_visible: false,
      error: `PSM-03: unknown renderState — ${String(renderState)}`,
    };
  }
  return { ...mapping, error: null };
}

/**
 * mapPropagationQualifier(qualifierClass)
 *
 * Maps a qualifier class to propagation overlay display props (EXP-QUAL-01/02).
 * Q-04: absence_notice mandatory — never silent.
 * Unknown classes fail closed to no-render.
 */
function mapPropagationQualifier(qualifierClass) {
  const mapping = PROPAGATION_QUALIFIER_MAP[qualifierClass];
  if (!mapping) {
    return {
      renders: false,
      overlay_text: null,
      overlay_token: null,
      absence_notice: null,
      error: `PSM-04: unknown qualifierClass — ${String(qualifierClass)}`,
    };
  }
  return { ...mapping, error: null };
}

/**
 * mapPropagationDensity(densityClass)
 *
 * Maps a density class to propagation layout props.
 * evidence_references_preserved is always true.
 * Unknown density classes fall back to EXECUTIVE_DENSE.
 */
function mapPropagationDensity(densityClass) {
  const mapping = PROPAGATION_DENSITY_MAP[densityClass];
  if (!mapping) {
    return {
      ...PROPAGATION_DENSITY_MAP['EXECUTIVE_DENSE'],
      density_class: densityClass,
      error: `PSM-05: unknown densityClass — ${String(densityClass)}; defaulting to EXECUTIVE_DENSE`,
    };
  }
  return { ...mapping, density_class: densityClass, error: null };
}

/**
 * scanPropagationText(text)
 *
 * Safety scan for forbidden vocabulary in propagation text.
 * Used in test contexts only — never called at render time.
 *
 * Returns: { violations, predictive, recommendation, speculative, ai_phrasing, geios, probabilistic }
 */
function scanPropagationText(text) {
  if (!text || typeof text !== 'string') {
    return {
      violations: [],
      predictive: [], recommendation: [], speculative: [],
      ai_phrasing: [], geios: [], probabilistic: [],
    };
  }
  const lower = text.toLowerCase();
  const predictive = FORBIDDEN_PREDICTIVE_PATTERNS.filter(p => lower.includes(p.toLowerCase()));
  const recommendation = FORBIDDEN_RECOMMENDATION_PATTERNS.filter(p => lower.includes(p.toLowerCase()));
  const speculative = FORBIDDEN_SPECULATIVE_PATTERNS.filter(p => lower.includes(p.toLowerCase()));
  const ai_phrasing = FORBIDDEN_AI_PHRASING.filter(p => lower.includes(p.toLowerCase()));
  const geios = FORBIDDEN_GEIOS_IDENTIFIERS.filter(p => text.includes(p));
  const probabilistic = FORBIDDEN_PROBABILISTIC_PATTERNS.filter(p => lower.includes(p.toLowerCase()));
  const violations = [...predictive, ...recommendation, ...speculative, ...ai_phrasing, ...geios, ...probabilistic];
  return { violations, predictive, recommendation, speculative, ai_phrasing, geios, probabilistic };
}

module.exports = {
  mapPropagationRole,
  mapPressureTier,
  mapPropagationState,
  mapPropagationQualifier,
  mapPropagationDensity,
  scanPropagationText,
  PROPAGATION_ROLE_MAP,
  PRESSURE_TIER_MAP,
  PROPAGATION_STATE_MAP,
  PROPAGATION_QUALIFIER_MAP,
  PROPAGATION_DENSITY_MAP,
  FORBIDDEN_PREDICTIVE_PATTERNS,
  FORBIDDEN_RECOMMENDATION_PATTERNS,
  FORBIDDEN_SPECULATIVE_PATTERNS,
  FORBIDDEN_AI_PHRASING,
  FORBIDDEN_GEIOS_IDENTIFIERS,
  FORBIDDEN_PROBABILISTIC_PATTERNS,
};

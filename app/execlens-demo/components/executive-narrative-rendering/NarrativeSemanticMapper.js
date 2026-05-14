'use strict';

/**
 * NarrativeSemanticMapper.js
 * PI.LENS.NEXTGEN-REPORTS.EXECUTIVE-NARRATIVE-RENDERING.01
 *
 * Maps narrative render states, qualifier classes, and density modes to
 * governed display properties for executive narrative surfaces.
 *
 * All normalization was applied at GEIOS generation time (NORM-DET-01, NORM-DET-02).
 * This module maps pre-normalized state to rendering props — never re-normalizes.
 *
 * Forbidden pattern arrays from normalization_rules_registry.json:
 *   NORM-FORBID-01: Predictive language
 *   NORM-FORBID-02: Recommendation language
 *   NORM-FORBID-03: Speculative language
 *   NORM-FORBID-04: Consumer AI phrasing
 *
 * Pure functions. No React. No AI. No external APIs. Deterministic.
 */

// Narrative surface display modes per render state
const NARRATIVE_STATE_MAP = {
  EXECUTIVE_READY: {
    narrative_mode: 'FULL_EXECUTIVE',
    qualifier_banner_active: false,
    blocked_notice: null,
    diagnostic_notice: null,
    surface_token: 'narrative-executive-ready',
    all_sections_visible: true,
  },
  EXECUTIVE_READY_WITH_QUALIFIER: {
    narrative_mode: 'QUALIFIED_EXECUTIVE',
    qualifier_banner_active: true,
    blocked_notice: null,
    diagnostic_notice: null,
    surface_token: 'narrative-executive-qualified',
    all_sections_visible: true,
  },
  DIAGNOSTIC_ONLY: {
    narrative_mode: 'DIAGNOSTIC_FRAME',
    qualifier_banner_active: true,
    blocked_notice: null,
    diagnostic_notice: 'This report contains content under advisory review. Advisory confirmation recommended.',
    surface_token: 'narrative-diagnostic',
    all_sections_visible: true,
  },
  BLOCKED: {
    narrative_mode: 'BLOCKED',
    qualifier_banner_active: false,
    blocked_notice: 'Readiness classification unavailable',
    diagnostic_notice: null,
    surface_token: 'narrative-blocked',
    all_sections_visible: false,
  },
};

// Qualifier banner display props per Q-taxonomy class
// Sourced from executive_vocabulary_contract.json + normalization_rules_registry.json NORM-Q-01..04
const QUALIFIER_BANNER_MAP = {
  'Q-00': {
    renders: false,
    banner_text: null,
    banner_token: null,
    absence_notice: null,
  },
  'Q-01': {
    renders: true,
    banner_text: 'Analysis based on confirmed structural evidence within grounded domains.',
    banner_token: 'token-qualifier-amber',
    absence_notice: null,
  },
  'Q-02': {
    renders: true,
    banner_text: 'Structural topology confirmed. Semantic depth reflects available grounding.',
    banner_token: 'token-qualifier-blue',
    absence_notice: null,
  },
  'Q-03': {
    renders: true,
    banner_text: 'Advisory confirmation recommended before executive action.',
    banner_token: 'token-qualifier-grey',
    absence_notice: null,
  },
  'Q-04': {
    renders: false,
    banner_text: null,
    banner_token: null,
    absence_notice: 'Signal intelligence withheld from this view.',
  },
};

// Narrative density layout props per density class
// Sourced from executive_rendering_system.json + NORM-DENSITY-01/02
const NARRATIVE_DENSITY_MAP = {
  EXECUTIVE_DENSE: {
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: true,
    max_primary_findings: 3,
    why_default_expanded: true,
    evidence_references_preserved: true,
  },
  EXECUTIVE_BALANCED: {
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: false,
    max_primary_findings: 2,
    why_default_expanded: true,
    evidence_references_preserved: true,
  },
  INVESTIGATION_DENSE: {
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: true,
    max_primary_findings: 3,
    why_default_expanded: true,
    evidence_references_preserved: true,
  },
};

// NORM-FORBID-01: Predictive language patterns (fail_action: BLOCKED)
const FORBIDDEN_PREDICTIVE_PATTERNS = [
  'will result in', 'will cause', 'will lead to',
  'is expected to', 'is likely to', 'is anticipated to',
  'predicts', 'forecasts', 'projected outcome',
  'will degrade', 'will improve', 'will spread',
];

// NORM-FORBID-02: Recommendation language patterns (fail_action: BLOCKED)
const FORBIDDEN_RECOMMENDATION_PATTERNS = [
  'we recommend', 'action item', 'you should', 'the team should',
  'must be addressed', 'requires immediate', 'action required',
  'fix this', 'resolve this', 'address this',
];

// NORM-FORBID-03: Speculative language patterns (fail_action: DIAGNOSTIC)
const FORBIDDEN_SPECULATIVE_PATTERNS = [
  'possibly', 'perhaps', 'maybe', 'might indicate', 'could suggest',
  'may represent', 'our analysis suggests', 'we believe', 'we think',
  'unclear', 'uncertain',
];

// NORM-FORBID-04: Consumer AI and chatbot phrasing (fail_action: BLOCKED)
const FORBIDDEN_AI_PHRASING = [
  'Sure!', 'Certainly!', 'Great question!', 'Let me explain',
  'I think', 'I believe', 'I found', 'As an AI',
  'Based on my analysis', "I'm unable to",
];

// GEIOS internal identifiers (forbidden from executive vocabulary contract)
const FORBIDDEN_GEIOS_IDENTIFIERS = [
  'TAXONOMY-01', 'signal_value', 'activation_state', 'signal_stable_key',
  'DPSIG', 'EXSIG', 'canonical_topology.json', 'GEIOS substrate',
  'cpi_score', 'cfa_score', 'derivation_hash', 'evidence_object_hash',
  'governed-dpsig-baseline-v1', 'AS-01', 'N-SAF-01',
];

/**
 * mapNarrativeRenderState(renderState)
 *
 * Maps a render state to narrative surface display props.
 * Unknown states fail closed to BLOCKED mode.
 */
function mapNarrativeRenderState(renderState) {
  const mapping = NARRATIVE_STATE_MAP[renderState];
  if (!mapping) {
    return {
      narrative_mode: 'BLOCKED',
      qualifier_banner_active: false,
      blocked_notice: 'Readiness classification unavailable',
      diagnostic_notice: null,
      surface_token: 'narrative-blocked',
      all_sections_visible: false,
      error: `NSM-01: unknown renderState — ${String(renderState)}`,
    };
  }
  return { ...mapping, error: null };
}

/**
 * mapNarrativeQualifierBanner(qualifierClass)
 *
 * Maps a qualifier class to narrative qualifier banner display props.
 * Q-04: absence_notice mandatory.
 * Unknown classes fail closed to Q-00 (no-render).
 */
function mapNarrativeQualifierBanner(qualifierClass) {
  const mapping = QUALIFIER_BANNER_MAP[qualifierClass];
  if (!mapping) {
    return {
      renders: false,
      banner_text: null,
      banner_token: null,
      absence_notice: null,
      error: `NSM-02: unknown qualifierClass — ${String(qualifierClass)}`,
    };
  }
  return { ...mapping, error: null };
}

/**
 * mapNarrativeDensity(densityClass)
 *
 * Maps a density class to narrative layout props (NORM-DENSITY-01/02).
 * evidence_references_preserved is always true — density manages hierarchy, not removal.
 * Unknown density classes fall back to EXECUTIVE_DENSE.
 */
function mapNarrativeDensity(densityClass) {
  const mapping = NARRATIVE_DENSITY_MAP[densityClass];
  if (!mapping) {
    return {
      ...NARRATIVE_DENSITY_MAP['EXECUTIVE_DENSE'],
      density_class: densityClass,
      error: `NSM-03: unknown densityClass — ${String(densityClass)}; defaulting to EXECUTIVE_DENSE`,
    };
  }
  return { ...mapping, density_class: densityClass, error: null };
}

/**
 * scanNarrativeText(text)
 *
 * Safety scan for forbidden vocabulary in narrative text.
 * Used in test contexts to verify governance compliance of narrative content.
 * NOT called at render time (NORM: no live normalization at render time).
 *
 * Returns: { violations: string[], predictive: [], recommendation: [], speculative: [], ai_phrasing: [], geios: [] }
 */
function scanNarrativeText(text) {
  if (!text || typeof text !== 'string') {
    return {
      violations: [],
      predictive: [], recommendation: [], speculative: [], ai_phrasing: [], geios: [],
    };
  }
  const lower = text.toLowerCase();

  const predictive = FORBIDDEN_PREDICTIVE_PATTERNS.filter(p => lower.includes(p.toLowerCase()));
  const recommendation = FORBIDDEN_RECOMMENDATION_PATTERNS.filter(p => lower.includes(p.toLowerCase()));
  const speculative = FORBIDDEN_SPECULATIVE_PATTERNS.filter(p => lower.includes(p.toLowerCase()));
  const ai_phrasing = FORBIDDEN_AI_PHRASING.filter(p => lower.includes(p.toLowerCase()));
  const geios = FORBIDDEN_GEIOS_IDENTIFIERS.filter(p => text.includes(p));

  const violations = [...predictive, ...recommendation, ...speculative, ...ai_phrasing, ...geios];
  return { violations, predictive, recommendation, speculative, ai_phrasing, geios };
}

module.exports = {
  mapNarrativeRenderState,
  mapNarrativeQualifierBanner,
  mapNarrativeDensity,
  scanNarrativeText,
  NARRATIVE_STATE_MAP,
  QUALIFIER_BANNER_MAP,
  NARRATIVE_DENSITY_MAP,
  FORBIDDEN_PREDICTIVE_PATTERNS,
  FORBIDDEN_RECOMMENDATION_PATTERNS,
  FORBIDDEN_SPECULATIVE_PATTERNS,
  FORBIDDEN_AI_PHRASING,
  FORBIDDEN_GEIOS_IDENTIFIERS,
};

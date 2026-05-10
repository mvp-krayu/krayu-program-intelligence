'use strict';

const S_STATE_LABELS = {
  S0: 'STRUCTURAL ONLY',
  S1: 'STRUCTURAL LABELS ONLY',
  S2: 'PARTIAL GROUNDING WITH CONTINUITY',
  S3: 'SEMANTICALLY GOVERNABLE',
  S4_PLUS: 'GOVERNED COGNITION',
};

const S_STATE_AUTHORIZATION = {
  S0: 'NOT AUTHORIZED',
  S1: 'NOT AUTHORIZED',
  S2: 'AUTHORIZED WITH QUALIFICATION',
  S3: 'AUTHORIZED',
};

const S_STATE_PROJECTION = {
  S0: 'Report pack only.',
  S1: 'Projection authorization restricted by unresolved semantic debt.',
  S2: 'Projection authorized with qualification disclosures.',
  S3: 'Projection authorized with full semantic qualification.',
};

const S_STATE_BOARDROOM = {
  S0: 'REPORT PACK ONLY',
  S1: 'NOT READY',
  S2: 'BOARDROOM QUALIFIED',
  S3: 'BOARDROOM READY',
};

const GRAVITY_DESCRIPTIONS = {
  FRAGMENTED: 'Semantic dimensions are disconnected. Qualification relies on isolated evidence.',
  EMERGING: 'Semantic dimensions are beginning to align. Qualification has emerging structural support.',
  STABILIZING: 'Semantic dimensions are converging. Qualification has stable multi-dimensional support.',
  GRAVITATIONAL: 'Semantic dimensions are fully aligned. Qualification has comprehensive evidence support.',
};

const STABILITY_DESCRIPTIONS = {
  UNSTABLE: 'Qualification state is vulnerable to evidence changes.',
  CONDITIONAL: 'Qualification state has conditional stability. Key dimensions require strengthening.',
  STABLE: 'Qualification state is resilient to minor evidence changes.',
  RESILIENT: 'Qualification state is robust across all contributing dimensions.',
};

const S_STATE_WARNINGS = {
  S0: 'Semantic qualification unavailable.',
  S1: 'Projection authorization restricted by unresolved semantic debt.',
  S2: 'Projection authorized with qualification disclosures.',
  S3: 'Projection authorized with full semantic qualification.',
};

function formatQualificationBanner(qualificationState) {
  if (!qualificationState) return null;

  const qs = qualificationState.qualification_state || {};
  const sState = qs.s_state || 'S0';

  return {
    s_state: sState,
    s_state_label: S_STATE_LABELS[sState] || sState,
    authorization_tier: S_STATE_AUTHORIZATION[sState] || 'NOT AUTHORIZED',
    projection_permission: S_STATE_PROJECTION[sState] || '',
    boardroom_readiness: S_STATE_BOARDROOM[sState] || 'NOT READY',
  };
}

function formatMaturityPanel(maturityProfile) {
  if (!maturityProfile) return null;

  const dims = maturityProfile.dimensions || {};
  let strong = 0, stable = 0, partial = 0, low = 0;

  for (const id of Object.keys(dims)) {
    const cls = dims[id].classification;
    if (cls === 'STRONG') strong++;
    else if (cls === 'STABLE') stable++;
    else if (cls === 'PARTIAL') partial++;
    else low++;
  }

  return {
    overall_score: maturityProfile.overall_maturity_score,
    overall_classification: maturityProfile.overall_classification,
    dimensions: dims,
    dimension_summary: { strong, stable, partial, low },
  };
}

function formatGravityIndicator(gravityAssessment) {
  if (!gravityAssessment) return null;

  const cls = gravityAssessment.classification || 'FRAGMENTED';
  return {
    score: gravityAssessment.semantic_gravity_score,
    classification: cls,
    description: GRAVITY_DESCRIPTIONS[cls] || '',
  };
}

function formatStabilityIndicator(stabilityAssessment) {
  if (!stabilityAssessment) return null;

  const cls = stabilityAssessment.classification || 'UNSTABLE';
  return {
    score: stabilityAssessment.qualification_stability_score,
    classification: cls,
    description: STABILITY_DESCRIPTIONS[cls] || '',
  };
}

function formatDebtSummary(debtInventory) {
  if (!debtInventory) return null;

  const summary = debtInventory.summary || {};
  const items = debtInventory.debt_items || [];
  const highest = items.length > 0 ? items[0] : null;

  return {
    total_debt_items: debtInventory.total_debt_items || 0,
    critical_count: summary.critical_count || 0,
    high_count: summary.high_count || 0,
    blocking_count: summary.s_state_blocking_count || 0,
    highest_priority_pathway: highest && highest.remediation
      ? highest.remediation.enrichment_pathway
      : null,
  };
}

function formatProgressionSummary(progressionReadiness) {
  if (!progressionReadiness) return null;

  const blocking = progressionReadiness.blocking_debts || [];
  const pathways = new Set();
  for (const debt of blocking) {
    if (debt.remediation_pathway) pathways.add(debt.remediation_pathway);
  }

  return {
    current_s_state: progressionReadiness.current_s_state,
    next_s_state: progressionReadiness.next_s_state_target,
    readiness_score: progressionReadiness.progression_readiness,
    blocking_count: progressionReadiness.blocking_debt_count || 0,
    required_pathways: Array.from(pathways).sort(),
  };
}

function resolveWarnings(sState) {
  const warning = S_STATE_WARNINGS[sState];
  if (!warning) return [];
  return [{ s_state: sState, text: warning }];
}

module.exports = {
  S_STATE_LABELS,
  S_STATE_AUTHORIZATION,
  S_STATE_PROJECTION,
  S_STATE_BOARDROOM,
  S_STATE_WARNINGS,
  GRAVITY_DESCRIPTIONS,
  STABILITY_DESCRIPTIONS,
  formatQualificationBanner,
  formatMaturityPanel,
  formatGravityIndicator,
  formatStabilityIndicator,
  formatDebtSummary,
  formatProgressionSummary,
  resolveWarnings,
};

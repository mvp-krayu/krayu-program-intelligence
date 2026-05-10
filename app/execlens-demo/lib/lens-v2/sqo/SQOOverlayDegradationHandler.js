'use strict';

function buildDegradedOverlay() {
  return {
    available: false,
    degradation_reason: 'SQO_ARTIFACTS_UNAVAILABLE',
    qualification_banner: null,
    maturity_panel: null,
    gravity_indicator: null,
    stability_indicator: null,
    debt_summary: null,
    progression_summary: null,
    governance_disclosure: buildGovernanceDisclosure(),
    warnings: [],
  };
}

function buildGovernanceDisclosure() {
  return {
    sqo_advisory_only: true,
    deterministic_scoring: true,
    no_ai_inference: true,
    no_substrate_mutation: true,
    qualification_disclosures_active: true,
  };
}

function isArtifactAvailable(sqoResult, key) {
  return !!(
    sqoResult &&
    sqoResult.artifacts &&
    sqoResult.artifacts[key] &&
    sqoResult.artifacts[key].ok &&
    sqoResult.artifacts[key].data
  );
}

function assessDegradation(sqoResult) {
  if (!sqoResult || !sqoResult.ok) {
    return { degraded: true, reason: 'SQO_LOAD_FAILED', missing: [] };
  }

  const missing = [];
  const critical = ['qualification_state', 'semantic_maturity_profile'];

  for (const key of critical) {
    if (!isArtifactAvailable(sqoResult, key)) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    return { degraded: true, reason: 'CRITICAL_ARTIFACTS_MISSING', missing };
  }

  return { degraded: false, reason: null, missing: [] };
}

module.exports = {
  buildDegradedOverlay,
  buildGovernanceDisclosure,
  isArtifactAvailable,
  assessDegradation,
};

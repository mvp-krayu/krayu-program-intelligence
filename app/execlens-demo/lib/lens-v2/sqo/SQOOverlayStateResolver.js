'use strict';

const { loadAllSQOArtifacts } = require('./SQORuntimeOverlayLoader');
const { assessDegradation, buildDegradedOverlay, buildGovernanceDisclosure, isArtifactAvailable } = require('./SQOOverlayDegradationHandler');
const {
  formatQualificationBanner,
  formatMaturityPanel,
  formatGravityIndicator,
  formatStabilityIndicator,
  formatDebtSummary,
  formatProgressionSummary,
  resolveWarnings,
} = require('./SQOOverlayFormatter');

function resolveSQOOverlays(client, runId) {
  const sqoResult = loadAllSQOArtifacts(client, runId);
  const degradation = assessDegradation(sqoResult);

  if (degradation.degraded) {
    return buildDegradedOverlay();
  }

  const a = sqoResult.artifacts;

  const qualificationState = isArtifactAvailable(sqoResult, 'qualification_state')
    ? a.qualification_state.data
    : null;

  const maturityProfile = isArtifactAvailable(sqoResult, 'semantic_maturity_profile')
    ? a.semantic_maturity_profile.data
    : null;

  const gravityAssessment = isArtifactAvailable(sqoResult, 'semantic_gravity_assessment')
    ? a.semantic_gravity_assessment.data
    : null;

  const stabilityAssessment = isArtifactAvailable(sqoResult, 'qualification_stability')
    ? a.qualification_stability.data
    : null;

  const debtInventory = isArtifactAvailable(sqoResult, 'semantic_debt_inventory')
    ? a.semantic_debt_inventory.data
    : null;

  const progressionReadiness = isArtifactAvailable(sqoResult, 'progression_readiness')
    ? a.progression_readiness.data
    : null;

  const sState = qualificationState
    ? (qualificationState.qualification_state && qualificationState.qualification_state.s_state) || 'S0'
    : 'S0';

  return {
    available: true,
    degradation_reason: null,
    qualification_banner: formatQualificationBanner(qualificationState),
    maturity_panel: formatMaturityPanel(maturityProfile),
    gravity_indicator: formatGravityIndicator(gravityAssessment),
    stability_indicator: formatStabilityIndicator(stabilityAssessment),
    debt_summary: formatDebtSummary(debtInventory),
    progression_summary: formatProgressionSummary(progressionReadiness),
    governance_disclosure: buildGovernanceDisclosure(),
    warnings: resolveWarnings(sState),
  };
}

module.exports = {
  resolveSQOOverlays,
};

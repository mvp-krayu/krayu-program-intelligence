'use strict';

/**
 * flagship-experience/index.js
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Public exports for the LENS v2 Flagship Executive Intelligence Experience.
 */

// Pure orchestration (CJS — safe for server/test)
const {
  orchestrateFlagshipExperience,
  resolveBoardroomConfig,
  resolveCinemaOrchestration,
  resolveAttentionHierarchy,
  resolveUrgencyFrame,
  resolveInvestigationStage,
  resolveNextStage,
  resolvePreviousStage,
  resolveGravityToken,
  resolvePresenceToken,
  resolveVisibleRegions,
  INVESTIGATION_STAGES,
} = require('./flagshipOrchestration');

module.exports = {
  orchestrateFlagshipExperience,
  resolveBoardroomConfig,
  resolveCinemaOrchestration,
  resolveAttentionHierarchy,
  resolveUrgencyFrame,
  resolveInvestigationStage,
  resolveNextStage,
  resolvePreviousStage,
  resolveGravityToken,
  resolvePresenceToken,
  resolveVisibleRegions,
  INVESTIGATION_STAGES,
};

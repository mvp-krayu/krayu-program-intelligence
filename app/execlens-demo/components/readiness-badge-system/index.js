'use strict';

/**
 * readiness-badge-system/index.js
 * PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01
 *
 * CommonJS entry for the pure visual semantic logic layer.
 * React components (JSX) require Next.js transpilation and are imported directly.
 */

const {
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
} = require('./VisualSemanticMapper');

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
};

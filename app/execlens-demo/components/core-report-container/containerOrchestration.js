'use strict';

/**
 * containerOrchestration.js
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 *
 * Pure orchestration logic for CoreReportContainer.
 * Calls validation → adapter pipeline and maps render state to route targets.
 *
 * This module is fully synchronous, pure, and has no side effects.
 * No React, no AI calls, no external APIs.
 */

const { adaptReport } = require('../../adapters/index');

const ROUTE_TARGET_MAP = {
  BLOCKED: 'BlockedReportState',
  DIAGNOSTIC_ONLY: 'DiagnosticReportState',
  EXECUTIVE_READY: 'ReportModuleShell',
  EXECUTIVE_READY_WITH_QUALIFIER: 'ReportModuleShell',
};

const VALID_AUDIENCE_TIERS = ['EXECUTIVE', 'ADVISORY', 'AUDIT'];

/**
 * orchestrateReport(reportObject, audienceTier, phase)
 *
 * Runs the full validation → adapter chain and returns a route decision
 * with the fully-adapted props ready for component consumption.
 *
 * Returns:
 * {
 *   route: string,             — BLOCKED | DIAGNOSTIC_ONLY | EXECUTIVE_READY | EXECUTIVE_READY_WITH_QUALIFIER
 *   routeTarget: string,       — BlockedReportState | DiagnosticReportState | ReportModuleShell
 *   adaptedProps: object|null, — full adapter output; null only on ORCH-01 / ORCH-02
 *   orchestrationError: string|null,
 * }
 *
 * Pure function. Does not mutate reportObject.
 */
function orchestrateReport(reportObject, audienceTier, phase) {
  if (
    reportObject === null ||
    reportObject === undefined ||
    typeof reportObject !== 'object' ||
    Array.isArray(reportObject)
  ) {
    return {
      route: 'BLOCKED',
      routeTarget: 'BlockedReportState',
      adaptedProps: null,
      orchestrationError: 'ORCH-01: reportObject absent or not an object',
    };
  }

  const tier = VALID_AUDIENCE_TIERS.includes(audienceTier) ? audienceTier : 'EXECUTIVE';
  const currentPhase = (typeof phase === 'number' && phase > 0) ? phase : 2;

  let adaptedProps;
  try {
    adaptedProps = adaptReport(reportObject, tier, currentPhase);
  } catch (err) {
    return {
      route: 'BLOCKED',
      routeTarget: 'BlockedReportState',
      adaptedProps: null,
      orchestrationError: `ORCH-02: adapter failure — ${err.message}`,
    };
  }

  const route = adaptedProps.renderState;
  const routeTarget = ROUTE_TARGET_MAP[route] || 'BlockedReportState';

  return {
    route,
    routeTarget,
    adaptedProps,
    orchestrationError: null,
  };
}

/**
 * getRouteTarget(route)
 * Maps a render state string to the target component name.
 * Unknown routes fall back to 'BlockedReportState' (fail-closed).
 */
function getRouteTarget(route) {
  return ROUTE_TARGET_MAP[route] || 'BlockedReportState';
}

module.exports = {
  orchestrateReport,
  getRouteTarget,
  ROUTE_TARGET_MAP,
  VALID_AUDIENCE_TIERS,
};

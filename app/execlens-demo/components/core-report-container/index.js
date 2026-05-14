'use strict';

/**
 * core-report-container/index.js
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 *
 * CommonJS entry point for the pure orchestration logic.
 * React components (JSX) require Next.js transpilation and are imported directly.
 */

const { orchestrateReport, getRouteTarget, ROUTE_TARGET_MAP, VALID_AUDIENCE_TIERS } =
  require('./containerOrchestration');

module.exports = {
  orchestrateReport,
  getRouteTarget,
  ROUTE_TARGET_MAP,
  VALID_AUDIENCE_TIERS,
};

'use client';

import React from 'react';
import { orchestrateReport } from './containerOrchestration';
import SurfaceModeRouter from './SurfaceModeRouter';
import ReportContainerErrorBoundary from './ReportContainerErrorBoundary';

/**
 * CoreReportContainer
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 *
 * Top-level report rendering orchestrator.
 * Runs validation → adapter pipeline via orchestrateReport(), then routes
 * to the appropriate display component via SurfaceModeRouter.
 *
 * Does not compute intelligence. Does not call AI. Does not mutate input.
 */
export default function CoreReportContainer({
  reportObject,
  audienceTier = 'EXECUTIVE',
  phase = 2,
}) {
  const orchestration = orchestrateReport(reportObject, audienceTier, phase);

  return (
    <ReportContainerErrorBoundary>
      <div
        data-container="core-report-container"
        data-render-state={orchestration.route}
        data-audience-tier={audienceTier}
      >
        <SurfaceModeRouter
          route={orchestration.route}
          adaptedProps={orchestration.adaptedProps}
          orchestrationError={orchestration.orchestrationError}
        />
      </div>
    </ReportContainerErrorBoundary>
  );
}

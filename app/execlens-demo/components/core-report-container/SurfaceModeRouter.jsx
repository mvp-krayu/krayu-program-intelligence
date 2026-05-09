'use client';

import React from 'react';
import ReportModuleShell from './ReportModuleShell';
import BlockedReportState from './BlockedReportState';
import DiagnosticReportState from './DiagnosticReportState';

/**
 * SurfaceModeRouter
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 *
 * Routes render state to the appropriate display component.
 * Unknown or absent routes fail closed to BlockedReportState.
 */
export default function SurfaceModeRouter({ route, adaptedProps, orchestrationError }) {
  if (route === 'EXECUTIVE_READY' || route === 'EXECUTIVE_READY_WITH_QUALIFIER') {
    return <ReportModuleShell adaptedProps={adaptedProps} />;
  }

  if (route === 'DIAGNOSTIC_ONLY') {
    return <DiagnosticReportState adaptedProps={adaptedProps} />;
  }

  return (
    <BlockedReportState
      adaptedProps={adaptedProps}
      orchestrationError={orchestrationError}
    />
  );
}

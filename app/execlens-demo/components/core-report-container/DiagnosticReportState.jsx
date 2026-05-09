'use client';

import React from 'react';

/**
 * DiagnosticReportState
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 *
 * Explicit diagnostic state display. Not promotable to executive-ready.
 * Renders diagnostic_banner_text and advisory_notice from adapter output.
 * Never generates content. Never calls AI.
 */
export default function DiagnosticReportState({ adaptedProps }) {
  const banner =
    adaptedProps?.diagnosticState?.diagnostic_banner_text ||
    'Report Under Structural Review';

  const notice = adaptedProps?.diagnosticState?.advisory_notice || null;

  return (
    <div
      data-module="diagnostic-report-state"
      role="status"
      aria-live="polite"
    >
      <div data-field="diagnostic-banner">{banner}</div>
      {notice && <div data-field="advisory-notice">{notice}</div>}
    </div>
  );
}

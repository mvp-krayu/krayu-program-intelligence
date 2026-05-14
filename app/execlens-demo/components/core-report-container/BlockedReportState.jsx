'use client';

import React from 'react';

/**
 * BlockedReportState
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 *
 * Explicit blocked state display. Always visible. Never silent.
 * Shows blocked_headline and blocked_reason from adapter output or orchestrationError.
 * Never exposes raw report_object fields. Never generates content.
 */
export default function BlockedReportState({ adaptedProps, orchestrationError }) {
  const headline =
    adaptedProps?.blockedState?.blocked_headline ||
    'Report Unavailable';

  const reason =
    adaptedProps?.blockedState?.blocked_reason_display ||
    orchestrationError ||
    'This report cannot be displayed at this time.';

  return (
    <div
      data-module="blocked-report-state"
      role="alert"
      aria-live="assertive"
    >
      <div data-field="blocked-headline">{headline}</div>
      <div data-field="blocked-reason">{reason}</div>
    </div>
  );
}

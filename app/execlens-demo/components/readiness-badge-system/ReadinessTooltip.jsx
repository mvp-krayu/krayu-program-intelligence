'use client';

import React from 'react';

/**
 * ReadinessTooltip
 * PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01
 *
 * Renders pre-rendered tooltip text from report_object.
 * Never generates text dynamically. Never calls AI. Never invents interpretation.
 * tooltip_text is pass-through from header_block.readiness_badge.tooltip_text.
 */
export default function ReadinessTooltip({ tooltip_text }) {
  if (!tooltip_text) return null;

  return (
    <div
      data-component="readiness-tooltip"
      role="tooltip"
    >
      <span data-field="tooltip-text">{tooltip_text}</span>
    </div>
  );
}

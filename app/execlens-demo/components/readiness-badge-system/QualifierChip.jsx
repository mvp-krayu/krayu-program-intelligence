'use client';

import React from 'react';
import { mapQualifierClass, getQualifierTooltip } from './VisualSemanticMapper';

/**
 * QualifierChip
 * PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01
 *
 * Renders qualifier chip per VIS-QUAL-01 mapping.
 * Q-01..Q-03: chip always visible (renders=true enforced).
 * Q-04: absence notice rendered instead (never silent).
 * Q-00: renders nothing.
 *
 * Props:
 *   qualifier_class  — Q-00..Q-04
 *   qualifier_label  — pre-rendered label override (falls back to chip_label)
 */
export default function QualifierChip({ qualifier_class, qualifier_label }) {
  const chipProps = mapQualifierClass(qualifier_class);
  const tooltip = getQualifierTooltip(qualifier_class);

  // Q-04: explicit absence notice — never silent
  if (!chipProps.renders && chipProps.absence_notice) {
    return (
      <div
        data-component="qualifier-chip"
        data-qualifier-class={qualifier_class}
        data-chip-token="NONE"
        data-absence-notice="true"
        role="note"
      >
        <span data-field="absence-notice">{chipProps.absence_notice}</span>
      </div>
    );
  }

  // Q-00: no chip
  if (!chipProps.renders) {
    return null;
  }

  // Q-01..Q-03: chip visible
  const displayLabel = qualifier_label || chipProps.chip_label;

  return (
    <div
      data-component="qualifier-chip"
      data-qualifier-class={qualifier_class}
      data-chip-token={chipProps.chip_token}
      role="note"
      aria-label={displayLabel}
    >
      <span data-field="chip-label" data-token={chipProps.chip_token}>
        {displayLabel}
      </span>

      {tooltip && (
        <span data-field="qualifier-tooltip" aria-hidden="true">
          {tooltip}
        </span>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { mapReadinessState } from './VisualSemanticMapper';
import QualifierChip from './QualifierChip';
import ReadinessTooltip from './ReadinessTooltip';

/**
 * ReadinessBadge
 * PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01
 *
 * Governed readiness state badge. Renders executive_label and badge_token
 * from VIS-READY-01 mapping. Does not compute or reinterpret readiness.
 *
 * Props (from readinessBadge adapter output):
 *   readiness_state   — enum value (EXECUTIVE_READY etc.)
 *   qualifier_class   — Q-00..Q-04
 *   tooltip_text      — pre-rendered tooltip from report_object
 *   qualifier_label   — pre-rendered qualifier label
 */
export default function ReadinessBadge({
  readiness_state,
  qualifier_class,
  tooltip_text,
  qualifier_label,
}) {
  const badgeProps = mapReadinessState(readiness_state);
  const showQualifier = qualifier_class && qualifier_class !== 'Q-00';

  return (
    <div
      data-component="readiness-badge"
      data-badge-token={badgeProps.badge_token}
      data-readiness-state={readiness_state}
      role="status"
      aria-label={badgeProps.executive_label}
    >
      <span data-field="readiness-label" data-token={badgeProps.badge_token}>
        {badgeProps.executive_label}
      </span>

      <span data-field="governance-status" data-token={badgeProps.badge_token}>
        {badgeProps.governance_status_label}
      </span>

      {showQualifier && (
        <QualifierChip qualifier_class={qualifier_class} qualifier_label={qualifier_label} />
      )}

      {tooltip_text && (
        <ReadinessTooltip tooltip_text={tooltip_text} />
      )}
    </div>
  );
}

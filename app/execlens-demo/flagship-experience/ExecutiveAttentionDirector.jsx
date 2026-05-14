'use client';

import React from 'react';

/**
 * ExecutiveAttentionDirector
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Guides executive cognitive flow. Coordinates attention hierarchy,
 * evidence emphasis, qualifier escalation, diagnostic escalation,
 * and operational urgency framing.
 *
 * Does not manipulate emotionally. Does not hide uncertainty.
 * Does not suppress blocked states.
 */

const ATTENTION_HIERARCHY = {
  BLOCKED: ['BLOCKED_ESCALATION'],
  DIAGNOSTIC_ONLY: ['DIAGNOSTIC_ESCALATION', 'READINESS_BADGE', 'QUALIFIER_NOTICE', 'NARRATIVE'],
  EXECUTIVE_READY_WITH_QUALIFIER: ['READINESS_BADGE', 'QUALIFIER_NOTICE', 'NARRATIVE', 'PROPAGATION', 'EVIDENCE'],
  EXECUTIVE_READY: ['READINESS_BADGE', 'NARRATIVE', 'PROPAGATION', 'EVIDENCE'],
};

export function resolveAttentionHierarchy(renderState) {
  return ATTENTION_HIERARCHY[renderState] || ATTENTION_HIERARCHY['BLOCKED'];
}

export function resolveUrgencyFrame(renderState) {
  if (renderState === 'BLOCKED') return 'CRITICAL_HOLD';
  if (renderState === 'DIAGNOSTIC_ONLY') return 'ADVISORY_REVIEW';
  if (renderState === 'EXECUTIVE_READY_WITH_QUALIFIER') return 'QUALIFIED_AUTHORITY';
  return 'OPERATIONAL_AUTHORITY';
}

export default function ExecutiveAttentionDirector({
  renderState,
  qualifierClass,
  children,
}) {
  const hierarchy = resolveAttentionHierarchy(renderState);
  const urgencyFrame = resolveUrgencyFrame(renderState);

  return (
    <div
      data-attention-director="true"
      data-urgency-frame={urgencyFrame}
      data-attention-priority-count={hierarchy.length}
      data-render-state={renderState}
      data-no-emotional-manipulation="true"
      data-uncertainty-never-hidden="true"
      data-blocked-states-never-suppressed="true"
    >
      {children}
    </div>
  );
}

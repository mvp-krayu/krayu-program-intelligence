'use client';

import React from 'react';

/**
 * StructuralAuthorityFrame
 *
 * Establishes the visual authority frame for the executive intelligence surface.
 * Communicates evidence-first authority, operational seriousness, and investigation capability.
 *
 * Not decorative chrome. Not "AI oracle" aesthetics.
 * Frame derives its authority from the governance substrate beneath it.
 */
export default function StructuralAuthorityFrame({
  renderState,
  densityClass,
  qualifierClass,
  children,
}) {
  const isBlocked = renderState === 'BLOCKED';
  const isDiagnostic = renderState === 'DIAGNOSTIC_ONLY';
  const hasQualifier = qualifierClass && qualifierClass !== 'Q-00';

  return (
    <div
      data-component="StructuralAuthorityFrame"
      data-render-state={renderState}
      data-density-class={densityClass}
      data-qualifier-class={qualifierClass || 'Q-00'}
      data-authority-state={isBlocked ? 'BLOCKED' : isDiagnostic ? 'DIAGNOSTIC' : hasQualifier ? 'QUALIFIED' : 'FULL'}
      data-frame-token="authority-frame"
    >
      {children}
    </div>
  );
}

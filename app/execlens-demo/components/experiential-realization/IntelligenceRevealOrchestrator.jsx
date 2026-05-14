'use client';

import React from 'react';
import { resolveRevealSequence, resolveMotionProfile, isBlockedOrDiagnosticFirst } from './MotionSemanticController';
import ExecutiveRevealPanel from './ExecutiveRevealPanel';

/**
 * IntelligenceRevealOrchestrator
 *
 * Coordinates staged intelligence reveal with executive cognitive pacing.
 * Reveal sequence is governed by MotionSemanticController.resolveRevealSequence().
 * Sequencing is deterministic: same render state → same reveal order, always.
 *
 * Never animates propagation flows.
 * Never creates "AI thinking" effects.
 * Never introduces probabilistic transitions.
 *
 * Blocked state: single BLOCKED_ESCALATION phase. No further content.
 * Diagnostic state: DIAGNOSTIC_ESCALATION phase precedes all content.
 * Qualifier state: QUALIFIER_NOTICE phase immediately follows READINESS_BADGE.
 */
export default function IntelligenceRevealOrchestrator({
  renderState,
  qualifierClass,
  children,
}) {
  const revealSequence = resolveRevealSequence(renderState);
  const motionProfile = resolveMotionProfile(renderState);
  const escalatesFirst = isBlockedOrDiagnosticFirst(renderState);

  return (
    <div
      data-component="IntelligenceRevealOrchestrator"
      data-render-state={renderState}
      data-motion-profile={motionProfile.profile}
      data-phase-count={revealSequence.phase_count}
      data-escalates-first={escalatesFirst ? 'true' : 'false'}
      data-reveal-sequence={revealSequence.phases.join(',')}
    >
      {children}
    </div>
  );
}

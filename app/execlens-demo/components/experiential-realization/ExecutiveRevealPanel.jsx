'use client';

import React from 'react';
import { resolveMotionProfile, getPhaseIndex } from './MotionSemanticController';

/**
 * ExecutiveRevealPanel
 *
 * Cinematic reveal surface for a single intelligence section.
 * Phase ordering is governed by MotionSemanticController.
 * Never generates content. Never alters narrative semantics.
 * Never introduces recommendation language.
 */
export default function ExecutiveRevealPanel({
  phase,
  renderState,
  children,
  label,
}) {
  const motionProfile = resolveMotionProfile(renderState);
  const phaseIndex = getPhaseIndex(renderState, phase);

  const delayMs = phaseIndex >= 0
    ? motionProfile.reveal_base_ms + (phaseIndex * motionProfile.stagger_ms)
    : 0;

  return (
    <div
      data-component="ExecutiveRevealPanel"
      data-phase={phase}
      data-phase-index={phaseIndex}
      data-render-state={renderState}
      data-motion-profile={motionProfile.profile}
      data-reveal-delay-ms={delayMs}
      data-panel-label={label || phase}
    >
      {children}
    </div>
  );
}

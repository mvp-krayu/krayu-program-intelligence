'use client';

import React from 'react';
import { resolveRevealSequence, resolveMotionProfile, isBlockedOrDiagnosticFirst } from '../components/experiential-realization/MotionSemanticController';

/**
 * IntelligenceRevealCinema
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Orchestrates cinematic reveal sequences across the flagship experience:
 * readiness → narrative → propagation → explainability → evidence escalation.
 *
 * Does not animate propagation flow. Does not create "thinking AI" effects.
 * Does not create speculative transitions.
 */

export function resolveCinemaOrchestration(renderState) {
  const sequence = resolveRevealSequence(renderState);
  const profile = resolveMotionProfile(renderState);
  const escalatesFirst = isBlockedOrDiagnosticFirst(renderState);

  return {
    phases: sequence.phases,
    phase_count: sequence.phase_count,
    motion_profile: profile.profile,
    reveal_base_ms: profile.reveal_base_ms,
    stagger_ms: profile.stagger_ms,
    escalates_first: escalatesFirst,
    no_animated_propagation: profile.no_animation_on_propagation,
    no_ai_thinking: true,
    no_speculative_transitions: true,
  };
}

export default function IntelligenceRevealCinema({
  renderState,
  qualifierClass,
  children,
}) {
  const orchestration = resolveCinemaOrchestration(renderState);

  return (
    <div
      data-reveal-cinema="true"
      data-phase-count={orchestration.phase_count}
      data-motion-profile={orchestration.motion_profile}
      data-escalates-first={String(orchestration.escalates_first)}
      data-no-animated-propagation="true"
      data-no-ai-thinking="true"
      data-no-speculative-transitions="true"
      data-render-state={renderState}
    >
      {children}
    </div>
  );
}

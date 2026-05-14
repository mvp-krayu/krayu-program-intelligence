'use client';

import React from 'react';
import { resolveDensityTransition } from './MotionSemanticController';

/**
 * ExecutivePresentationMode
 *
 * Boardroom-grade presentation mode shell.
 * Supports fullscreen executive rendering with density-safe orchestration.
 * Supports briefing-mode navigation.
 *
 * No slide-deck metaphors. No dashboard widgets. No flashy transitions.
 * Presentation mode is executive framing, not entertainment.
 */
export default function ExecutivePresentationMode({
  active,
  densityClass,
  renderState,
  children,
}) {
  const densityTransition = resolveDensityTransition(densityClass || 'EXECUTIVE_BALANCED');

  if (!active) {
    return (
      <div
        data-component="ExecutivePresentationMode"
        data-mode="STANDARD"
        data-render-state={renderState}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-component="ExecutivePresentationMode"
      data-mode="PRESENTATION"
      data-render-state={renderState}
      data-density-class={densityClass}
      data-density-token={densityTransition.density_token}
      data-transition-ms={densityTransition.transition_ms}
      data-presentation-active="true"
    >
      {children}
    </div>
  );
}

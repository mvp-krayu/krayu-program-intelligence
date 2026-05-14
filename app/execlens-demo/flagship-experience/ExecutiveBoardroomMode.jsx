'use client';

import React from 'react';

/**
 * ExecutiveBoardroomMode
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Creates the immersive boardroom-grade presentation experience.
 * Supports fullscreen intelligence briefing, executive reveal pacing,
 * controlled operational focus, executive presentation sequencing.
 *
 * Must feel: cinematic, operational, premium, structurally serious.
 * Must not feel: like slideware, like dashboards, use flashy gimmicks.
 * Does not introduce prompt surfaces, chatbot UX, or AI personas.
 */

const BOARDROOM_PACING_MAP = {
  EXECUTIVE_READY: { pacing: 'CONTROLLED', reveal_style: 'STAGED', fullscreen_optimal: true },
  EXECUTIVE_READY_WITH_QUALIFIER: { pacing: 'CONTROLLED', reveal_style: 'STAGED_WITH_QUALIFIER_HOLD', fullscreen_optimal: true },
  DIAGNOSTIC_ONLY: { pacing: 'ADVISORY', reveal_style: 'ESCALATION_FIRST', fullscreen_optimal: false },
  BLOCKED: { pacing: 'HOLD', reveal_style: 'BLOCKED_ASSERTIVE', fullscreen_optimal: false },
};

export function resolveBoardroomConfig(renderState, densityClass) {
  const pacing = BOARDROOM_PACING_MAP[renderState] || BOARDROOM_PACING_MAP['BLOCKED'];
  return {
    ...pacing,
    density_class: densityClass,
    presentation_mode: 'EXECUTIVE_BRIEFING',
    no_prompt_surfaces: true,
    no_chatbot_ux: true,
    no_ai_personas: true,
    no_slideware_feel: true,
    no_dashboard_feel: true,
  };
}

export default function ExecutiveBoardroomMode({
  active,
  renderState,
  densityClass,
  children,
}) {
  const config = resolveBoardroomConfig(renderState, densityClass);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      data-boardroom-mode="true"
      data-boardroom-active="true"
      data-pacing={config.pacing}
      data-reveal-style={config.reveal_style}
      data-fullscreen-optimal={String(config.fullscreen_optimal)}
      data-density-class={densityClass}
      data-render-state={renderState}
      data-no-prompt-surfaces="true"
      data-no-chatbot-ux="true"
      data-no-ai-personas="true"
      data-no-slideware-feel="true"
      data-no-dashboard-feel="true"
      data-cinematic="true"
      data-operationally-serious="true"
    >
      {children}
    </div>
  );
}

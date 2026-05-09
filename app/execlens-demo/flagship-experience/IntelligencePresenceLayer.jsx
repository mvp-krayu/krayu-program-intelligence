'use client';

import React from 'react';

/**
 * IntelligencePresenceLayer
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Establishes persistent operational atmosphere, intelligence continuity,
 * structural awareness, and executive immersion.
 * Reinforces evidence-first doctrine, qualifier persistence, governance authority.
 *
 * Does not create AI personality. Does not create chatbot feel.
 * Does not create assistant persona.
 */

const PRESENCE_TOKENS = {
  EXECUTIVE_READY: 'presence-executive-authority',
  EXECUTIVE_READY_WITH_QUALIFIER: 'presence-qualified-authority',
  DIAGNOSTIC_ONLY: 'presence-diagnostic-alert',
  BLOCKED: 'presence-blocked-hold',
};

export function resolvePresenceToken(renderState) {
  return PRESENCE_TOKENS[renderState] || PRESENCE_TOKENS['BLOCKED'];
}

export default function IntelligencePresenceLayer({
  renderState,
  qualifierClass,
  children,
}) {
  const presenceToken = resolvePresenceToken(renderState);

  return (
    <div
      data-intelligence-presence="true"
      data-presence-token={presenceToken}
      data-render-state={renderState}
      data-evidence-first="true"
      data-qualifier-persistent="true"
      data-governance-authority="true"
      data-no-ai-personality="true"
      data-no-chatbot-feel="true"
      data-no-assistant-persona="true"
    >
      {children}
    </div>
  );
}

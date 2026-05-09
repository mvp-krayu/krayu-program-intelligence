'use client';

import React from 'react';

/**
 * OperationalGravitySystem
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Establishes executive authority, evidence gravity, and operational weight.
 * Coordinates density, pacing, emphasis, and reveal intensity.
 *
 * Does not gamify intelligence. Does not create AI-oracle effects.
 * Does not simulate autonomous cognition.
 */

const GRAVITY_INTENSITY_MAP = {
  EXECUTIVE_READY: 'standard',
  EXECUTIVE_READY_WITH_QUALIFIER: 'qualifier_prominent',
  DIAGNOSTIC_ONLY: 'diagnostic_prominent',
  BLOCKED: 'blocked_dominant',
};

const GRAVITY_TOKENS = {
  standard: 'gravity-standard',
  qualifier_prominent: 'gravity-qualifier',
  diagnostic_prominent: 'gravity-diagnostic',
  blocked_dominant: 'gravity-blocked',
};

export function resolveGravityIntensity(renderState) {
  return GRAVITY_INTENSITY_MAP[renderState] || 'blocked_dominant';
}

export function resolveGravityToken(renderState) {
  const intensity = resolveGravityIntensity(renderState);
  return GRAVITY_TOKENS[intensity] || GRAVITY_TOKENS['blocked_dominant'];
}

export default function OperationalGravitySystem({
  renderState,
  densityClass,
  children,
}) {
  const gravityToken = resolveGravityToken(renderState);

  return (
    <div
      data-operational-gravity="true"
      data-gravity-token={gravityToken}
      data-density-class={densityClass}
      data-render-state={renderState}
      data-no-gamification="true"
      data-no-ai-oracle="true"
    >
      {children}
    </div>
  );
}

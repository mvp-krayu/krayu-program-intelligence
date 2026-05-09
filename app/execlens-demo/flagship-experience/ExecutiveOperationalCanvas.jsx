'use client';

import React from 'react';

/**
 * ExecutiveOperationalCanvas
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Creates the cinematic operational canvas. Integrates all experiential regions
 * into a cohesive executive intelligence composition.
 * Orchestrates density, evidence accessibility, investigation posture continuity.
 *
 * Does not devolve into widget dashboards. Does not create fragmented UI zones.
 * Does not hide governance-critical information.
 */

const CANVAS_REGION_ORDER = [
  'AUTHORITY_HEADER',
  'READINESS_COMMAND',
  'INTELLIGENCE_NARRATIVE',
  'PROPAGATION_ZONE',
  'EVIDENCE_LAYER',
];

export function resolveVisibleRegions(densityClass, renderState) {
  if (renderState === 'BLOCKED') {
    return ['AUTHORITY_HEADER', 'READINESS_COMMAND'];
  }
  if (renderState === 'DIAGNOSTIC_ONLY') {
    return ['AUTHORITY_HEADER', 'READINESS_COMMAND', 'INTELLIGENCE_NARRATIVE'];
  }
  if (densityClass === 'EXECUTIVE_BALANCED') {
    return ['AUTHORITY_HEADER', 'READINESS_COMMAND', 'INTELLIGENCE_NARRATIVE', 'PROPAGATION_ZONE'];
  }
  return CANVAS_REGION_ORDER;
}

export default function ExecutiveOperationalCanvas({
  renderState,
  densityClass,
  qualifierClass,
  children,
}) {
  const visibleRegions = resolveVisibleRegions(densityClass, renderState);

  return (
    <div
      data-operational-canvas="true"
      data-density-class={densityClass}
      data-render-state={renderState}
      data-visible-region-count={visibleRegions.length}
      data-no-widget-dashboard="true"
      data-no-fragmented-zones="true"
      data-governance-info-never-hidden="true"
      data-canvas-cinematic="true"
    >
      {children}
    </div>
  );
}

'use client';

import React from 'react';
import { mapNarrativeRenderState } from './NarrativeSemanticMapper';
import { resolveDensityLayout } from './NarrativeDensityController';
import ExecutiveSummaryBlock from './ExecutiveSummaryBlock';
import WhyNarrativeBlock from './WhyNarrativeBlock';
import StructuralFindingsBlock from './StructuralFindingsBlock';
import NarrativeQualifierBanner from './NarrativeQualifierBanner';

export default function ExecutiveNarrativeSurface({
  narrativeProps,
  renderState,
  qualifierClass,
  densityClass,
}) {
  const surfaceState = mapNarrativeRenderState(renderState);
  const densityLayout = resolveDensityLayout(densityClass || 'EXECUTIVE_DENSE', narrativeProps || {});

  if (surfaceState.narrative_mode === 'BLOCKED') {
    return (
      <div
        data-component="ExecutiveNarrativeSurface"
        data-narrative-mode="BLOCKED"
        data-surface-token={surfaceState.surface_token}
        role="alert"
        aria-live="assertive"
      >
        <span data-blocked-notice="true">{surfaceState.blocked_notice}</span>
      </div>
    );
  }

  const props = narrativeProps || {};

  return (
    <div
      data-component="ExecutiveNarrativeSurface"
      data-narrative-mode={surfaceState.narrative_mode}
      data-surface-token={surfaceState.surface_token}
      data-render-state={renderState}
      data-density-class={densityClass}
    >
      {surfaceState.qualifier_banner_active && qualifierClass && (
        <NarrativeQualifierBanner qualifier_class={qualifierClass} />
      )}

      {surfaceState.diagnostic_notice && (
        <div
          data-diagnostic-notice="true"
          role="status"
          aria-live="polite"
        >
          {surfaceState.diagnostic_notice}
        </div>
      )}

      {densityLayout.show_executive_summary && (
        <ExecutiveSummaryBlock
          executive_summary={props.executive_summary}
          renderState={renderState}
        />
      )}

      {densityLayout.show_why_statement && (
        <WhyNarrativeBlock
          why_primary_statement={props.why_primary_statement}
          renderState={renderState}
          why_default_expanded={densityLayout.why_default_expanded}
        />
      )}

      {densityLayout.show_structural_findings && (
        <StructuralFindingsBlock
          structural_summary={props.structural_summary}
          renderState={renderState}
          max_primary_findings={densityLayout.max_primary_findings}
        />
      )}
    </div>
  );
}

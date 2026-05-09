'use client';

import React from 'react';
import { mapPropagationState } from './PropagationSemanticMapper';
import { resolvePropagationDensityLayout } from './PropagationDensityController';
import PropagationSummaryBlock from './PropagationSummaryBlock';
import PropagationChainBlock from './PropagationChainBlock';
import PropagationEvidenceLinkage from './PropagationEvidenceLinkage';
import PropagationQualifierOverlay from './PropagationQualifierOverlay';

export default function PropagationExplainabilitySurface({
  propagationProps,
  renderState,
  qualifierClass,
  densityClass,
}) {
  const surfaceState = mapPropagationState(renderState);
  const densityLayout = resolvePropagationDensityLayout(
    densityClass || 'EXECUTIVE_DENSE',
    propagationProps || {}
  );

  if (surfaceState.propagation_mode === 'BLOCKED_PROPAGATION') {
    return (
      <div
        data-component="PropagationExplainabilitySurface"
        data-propagation-mode="BLOCKED_PROPAGATION"
        data-surface-token={surfaceState.surface_token}
        role="alert"
        aria-live="assertive"
      >
        <span data-blocked-notice="true">{surfaceState.blocked_notice}</span>
      </div>
    );
  }

  const props = propagationProps || {};

  return (
    <div
      data-component="PropagationExplainabilitySurface"
      data-propagation-mode={surfaceState.propagation_mode}
      data-surface-token={surfaceState.surface_token}
      data-render-state={renderState}
      data-density-class={densityClass}
    >
      {surfaceState.qualifier_overlay_active && qualifierClass && (
        <PropagationQualifierOverlay
          qualifier_class={qualifierClass}
          renderState={renderState}
        />
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

      {densityLayout.show_propagation_summary && (
        <PropagationSummaryBlock
          propagation_summary={props.propagation_summary}
          renderState={renderState}
        />
      )}

      {densityLayout.show_propagation_chains && (
        <PropagationChainBlock
          propagation_chains={props.propagation_chains}
          renderState={renderState}
          max_visible_chains={densityLayout.max_visible_chains}
          chains_collapsed_by_default={densityLayout.chains_collapsed_by_default}
        />
      )}

      {densityLayout.show_evidence_linkage && (
        <PropagationEvidenceLinkage
          evidence_links={props.evidence_links}
          renderState={renderState}
        />
      )}
    </div>
  );
}

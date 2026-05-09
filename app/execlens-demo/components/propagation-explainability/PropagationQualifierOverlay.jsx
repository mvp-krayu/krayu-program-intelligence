'use client';

import React from 'react';
import { mapPropagationQualifier } from './PropagationSemanticMapper';

export default function PropagationQualifierOverlay({ qualifier_class, renderState }) {
  const overlay = mapPropagationQualifier(qualifier_class);

  if (overlay.absence_notice) {
    return (
      <div
        data-component="PropagationQualifierOverlay"
        data-qualifier-class={qualifier_class}
        data-overlay-state="ABSENCE_NOTICE"
        data-render-state={renderState}
        role="note"
      >
        <span data-absence-notice="true">{overlay.absence_notice}</span>
      </div>
    );
  }

  if (!overlay.renders) {
    return null;
  }

  return (
    <div
      data-component="PropagationQualifierOverlay"
      data-qualifier-class={qualifier_class}
      data-overlay-token={overlay.overlay_token}
      data-overlay-state="ACTIVE"
      data-render-state={renderState}
      role="note"
      aria-label={`Propagation qualifier notice: ${qualifier_class}`}
    >
      <span data-overlay-text="true">{overlay.overlay_text}</span>
    </div>
  );
}

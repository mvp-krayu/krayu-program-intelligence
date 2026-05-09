'use client';

import React from 'react';

export default function PropagationSummaryBlock({ propagation_summary, renderState }) {
  if (!propagation_summary) {
    return null;
  }

  return (
    <div
      data-component="PropagationSummaryBlock"
      data-render-state={renderState}
      data-block="propagation-summary"
    >
      <p data-propagation-summary="true">{propagation_summary}</p>
    </div>
  );
}

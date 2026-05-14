'use client';

import React from 'react';

export default function ExecutiveSummaryBlock({ executive_summary, renderState }) {
  if (!executive_summary) {
    return null;
  }

  return (
    <div
      data-component="ExecutiveSummaryBlock"
      data-render-state={renderState}
      data-block="executive-summary"
    >
      <p data-executive-summary="true">{executive_summary}</p>
    </div>
  );
}

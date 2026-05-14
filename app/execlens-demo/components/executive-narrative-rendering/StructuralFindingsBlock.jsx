'use client';

import React from 'react';

export default function StructuralFindingsBlock({ structural_summary, renderState, max_primary_findings }) {
  if (!structural_summary) {
    return null;
  }

  return (
    <div
      data-component="StructuralFindingsBlock"
      data-render-state={renderState}
      data-block="structural-findings"
      data-max-findings={max_primary_findings}
    >
      <p data-structural-summary="true">{structural_summary}</p>
    </div>
  );
}

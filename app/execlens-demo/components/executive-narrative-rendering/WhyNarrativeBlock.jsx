'use client';

import React from 'react';

export default function WhyNarrativeBlock({ why_primary_statement, renderState, why_default_expanded }) {
  if (!why_primary_statement) {
    return null;
  }

  return (
    <div
      data-component="WhyNarrativeBlock"
      data-render-state={renderState}
      data-block="why-narrative"
      data-default-expanded={why_default_expanded ? 'true' : 'false'}
    >
      <p data-why-statement="true">{why_primary_statement}</p>
    </div>
  );
}

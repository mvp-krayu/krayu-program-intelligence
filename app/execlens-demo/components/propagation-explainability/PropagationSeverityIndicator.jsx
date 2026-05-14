'use client';

import React from 'react';
import { mapPressureTier } from './PropagationSemanticMapper';

export default function PropagationSeverityIndicator({ pressure_tier, domain_alias }) {
  const severity = mapPressureTier(pressure_tier);

  return (
    <span
      data-component="PropagationSeverityIndicator"
      data-pressure-tier={pressure_tier}
      data-pressure-token={severity.pressure_token}
      data-domain={domain_alias || null}
      aria-label={severity.display_label}
    >
      {severity.display_label}
    </span>
  );
}

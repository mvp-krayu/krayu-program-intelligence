'use client';

import React from 'react';
import { mapNarrativeQualifierBanner } from './NarrativeSemanticMapper';

export default function NarrativeQualifierBanner({ qualifier_class }) {
  const banner = mapNarrativeQualifierBanner(qualifier_class);

  if (banner.absence_notice) {
    return (
      <div
        data-component="NarrativeQualifierBanner"
        data-qualifier-class={qualifier_class}
        data-banner-state="ABSENCE_NOTICE"
        role="note"
      >
        <span data-absence-notice="true">{banner.absence_notice}</span>
      </div>
    );
  }

  if (!banner.renders) {
    return null;
  }

  return (
    <div
      data-component="NarrativeQualifierBanner"
      data-qualifier-class={qualifier_class}
      data-banner-token={banner.banner_token}
      data-banner-state="ACTIVE"
      role="note"
      aria-label={`Qualifier notice: ${qualifier_class}`}
    >
      <span data-banner-text="true">{banner.banner_text}</span>
    </div>
  );
}

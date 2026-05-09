'use client';

import React from 'react';
import { mapPropagationRole } from './PropagationSemanticMapper';

export default function PropagationEvidenceLinkage({ evidence_links, renderState }) {
  if (!evidence_links || !Array.isArray(evidence_links) || evidence_links.length === 0) {
    return (
      <div
        data-component="PropagationEvidenceLinkage"
        data-render-state={renderState}
        data-linkage-state="MISSING_EVIDENCE"
        role="status"
      >
        <span data-missing-evidence="true">No evidence linkage available for this propagation analysis.</span>
      </div>
    );
  }

  return (
    <div
      data-component="PropagationEvidenceLinkage"
      data-render-state={renderState}
      data-linkage-state="PRESENT"
      data-link-count={evidence_links.length}
    >
      {evidence_links.map((link, idx) => {
        const roleDisplay = mapPropagationRole(link.propagation_role);
        return (
          <div
            key={idx}
            data-evidence-link="true"
            data-domain={link.domain_alias}
            data-propagation-role={link.propagation_role}
            data-role-indicator={roleDisplay.indicator}
            data-role-token={roleDisplay.role_token}
          >
            <span data-domain-alias="true">{link.domain_alias}</span>
            <span data-role-label="true">{roleDisplay.display_label}</span>
            {link.evidence_summary && (
              <span data-evidence-summary="true">{link.evidence_summary}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

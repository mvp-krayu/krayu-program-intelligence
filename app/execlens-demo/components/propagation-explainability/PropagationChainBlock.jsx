'use client';

import React from 'react';
import { mapPropagationRole, mapPressureTier } from './PropagationSemanticMapper';
import PropagationSeverityIndicator from './PropagationSeverityIndicator';

export default function PropagationChainBlock({ propagation_chains, renderState, max_visible_chains, chains_collapsed_by_default }) {
  if (!propagation_chains || !Array.isArray(propagation_chains) || propagation_chains.length === 0) {
    return null;
  }

  const visibleChains = max_visible_chains
    ? propagation_chains.slice(0, max_visible_chains)
    : propagation_chains;

  return (
    <div
      data-component="PropagationChainBlock"
      data-render-state={renderState}
      data-block="propagation-chain"
      data-chain-count={propagation_chains.length}
      data-visible-count={visibleChains.length}
    >
      {visibleChains.map((chain, chainIdx) => (
        <div
          key={chainIdx}
          data-chain="true"
          data-chain-index={chainIdx}
          data-default-collapsed={chains_collapsed_by_default ? 'true' : 'false'}
        >
          {Array.isArray(chain.path) && chain.path.map((domainAlias, pathIdx) => (
            <span
              key={pathIdx}
              data-path-node="true"
              data-path-index={pathIdx}
              data-domain-alias={domainAlias}
            >
              {domainAlias}
            </span>
          ))}
          {chain.pressure_tier && (
            <PropagationSeverityIndicator
              pressure_tier={chain.pressure_tier}
              domain_alias={chain.origin_domain}
            />
          )}
          {chain.propagation_role && (() => {
            const roleDisplay = mapPropagationRole(chain.propagation_role);
            return (
              <span
                data-chain-role="true"
                data-role-indicator={roleDisplay.indicator}
                data-role-token={roleDisplay.role_token}
              >
                {roleDisplay.display_label}
              </span>
            );
          })()}
        </div>
      ))}
    </div>
  );
}

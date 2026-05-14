'use client';

import React from 'react';

/**
 * TopologySafeVisualSurface
 *
 * Cinematic topology-safe visualization shell.
 * Renders static structural overlays and executive-safe topology framing.
 * Topology is ALWAYS read-only. No node manipulation. No topology editing.
 * No live graph traversal. No animated propagation flow (VIS-PROP-02).
 * No hidden topology internals exposed.
 *
 * This is a Phase-2 structural framing surface.
 * Interactive topology (Phase 3+) requires a new governance contract.
 */
export default function TopologySafeVisualSurface({
  propagation_chains,
  renderState,
  densityClass,
}) {
  const isBlocked = renderState === 'BLOCKED';

  if (isBlocked) {
    return (
      <div
        data-component="TopologySafeVisualSurface"
        data-surface-state="BLOCKED"
        data-topology-interactive="false"
        data-topology-editable="false"
        role="alert"
      >
        <span data-blocked-notice="true">Structural topology unavailable.</span>
      </div>
    );
  }

  const visibleChains = Array.isArray(propagation_chains) ? propagation_chains : [];

  return (
    <div
      data-component="TopologySafeVisualSurface"
      data-surface-state="ACTIVE"
      data-render-state={renderState}
      data-density-class={densityClass}
      data-topology-interactive="false"
      data-topology-editable="false"
      data-topology-animated="false"
      data-chain-count={visibleChains.length}
    >
      {visibleChains.map((chain, idx) => (
        <div
          key={idx}
          data-topology-chain="true"
          data-chain-index={idx}
          data-chain-role={chain.propagation_role || null}
          data-no-animation="true"
        >
          {Array.isArray(chain.path) && chain.path.map((node, nodeIdx) => (
            <span
              key={nodeIdx}
              data-topology-node="true"
              data-node-index={nodeIdx}
              data-domain-alias={node}
            >
              {node}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

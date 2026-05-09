'use client';

import React from 'react';

/**
 * TopologySafeVisualRealization
 * PI.LENS.V2.INTEGRATED-EXECUTIVE-EXPERIENCE.01
 *
 * Creates cinematic structural overlays with propagation-aware emphasis.
 * Operational topology framing. Investigation-safe structural visibility.
 * Preserves topology immutability.
 *
 * Does not allow graph manipulation. Does not expose hidden topology.
 * Does not introduce graph playground interaction.
 * No animated propagation flow (VIS-PROP-02).
 */

const ROLE_VISUAL_MAP = {
  ORIGIN: { label: 'Origin of Pressure', indicator: 'source-indicator', weight: 'high', token: 'token-role-origin' },
  PASS_THROUGH: { label: 'Pressure Pass-through', indicator: 'flow-indicator', weight: 'medium', token: 'token-role-passthrough' },
  RECEIVER: { label: 'Pressure Receiver', indicator: 'receiver-indicator', weight: 'medium', token: 'token-role-receiver' },
  ISOLATED: { label: 'Independent Domain', indicator: 'neutral-indicator', weight: 'low', token: 'token-role-isolated' },
};

const PRESSURE_TOKEN_MAP = {
  HIGH: { label: 'High execution pressure', token: 'token-pressure-high' },
  ELEVATED: { label: 'Elevated pressure', token: 'token-pressure-elevated' },
  MODERATE: { label: 'Moderate pressure', token: 'token-pressure-moderate' },
  LOW: { label: 'Stable / low pressure', token: 'token-pressure-low' },
};

function resolveRoleVisual(role) {
  return ROLE_VISUAL_MAP[role] || ROLE_VISUAL_MAP['ISOLATED'];
}

function resolvePressureToken(tier) {
  return PRESSURE_TOKEN_MAP[tier] || PRESSURE_TOKEN_MAP['MODERATE'];
}

function renderChain(chain, index) {
  const roleVisual = resolveRoleVisual(chain.propagation_role);
  const pressureToken = resolvePressureToken(chain.pressure_tier);

  return (
    <div
      key={index}
      data-propagation-chain={index}
      data-pressure-token={pressureToken.token}
      data-role-indicator={roleVisual.indicator}
      data-role-token={roleVisual.token}
      data-no-animation="true"
      data-topology-interactive="false"
    >
      <div data-propagation-path="true" data-path-length={chain.path.length}>
        {chain.path.map((domain, i) => (
          <span
            key={i}
            data-domain-node={i}
            data-domain-alias={domain}
          >
            {domain}
          </span>
        ))}
      </div>
      <div data-role-label="true" data-visual-weight={roleVisual.weight}>
        {roleVisual.label}
      </div>
      <div data-pressure-label="true">
        {pressureToken.label}
      </div>
    </div>
  );
}

export default function TopologySafeVisualRealization({
  propagation_chains,
  renderState,
  densityClass,
}) {
  const chains = Array.isArray(propagation_chains) ? propagation_chains : [];

  if (chains.length === 0) {
    return (
      <div
        data-topology-realization="true"
        data-topology-interactive="false"
        data-topology-editable="false"
        data-topology-animated="false"
        data-no-propagation-chains="true"
      >
        No active propagation paths in this structural scope.
      </div>
    );
  }

  return (
    <div
      data-topology-realization="true"
      data-topology-interactive="false"
      data-topology-editable="false"
      data-topology-animated="false"
      data-no-graph-manipulation="true"
      data-no-hidden-topology="true"
      data-no-animated-flow="true"
      data-render-state={renderState}
      data-chain-count={chains.length}
    >
      {chains.map((chain, i) => renderChain(chain, i))}
    </div>
  );
}

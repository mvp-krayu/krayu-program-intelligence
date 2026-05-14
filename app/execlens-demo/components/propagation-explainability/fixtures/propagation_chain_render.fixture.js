'use strict';

const PROPAGATION_CHAIN_RENDER_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  densityClass: 'EXECUTIVE_DENSE',
  propagation_chains: [
    {
      path: ['Primary Delivery', 'Coordination Layer', 'Secondary Delivery'],
      pressure_tier: 'HIGH',
      propagation_role: 'ORIGIN',
      origin_domain: 'Primary Delivery',
    },
    {
      path: ['Coordination Layer', 'Secondary Delivery'],
      pressure_tier: 'ELEVATED',
      propagation_role: 'PASS_THROUGH',
      origin_domain: 'Coordination Layer',
    },
    {
      path: ['Secondary Delivery'],
      pressure_tier: 'MODERATE',
      propagation_role: 'RECEIVER',
      origin_domain: 'Secondary Delivery',
    },
  ],
  expected: {
    chain_count: 3,
    max_visible_in_dense: 3,
    paths_preserved: true,
    ordering_preserved: true,
    pressure_tiers_preserved: true,
    propagation_roles_preserved: true,
  },
};

module.exports = { PROPAGATION_CHAIN_RENDER_FIXTURE };

'use strict';

const FLAGSHIP_FORBIDDEN_TOPOLOGY_MUTATION_FIXTURE = {
  topology_chains: [
    {
      path: ['Primary Delivery', 'Coordination Layer', 'Secondary Delivery'],
      pressure_tier: 'HIGH',
      propagation_role: 'ORIGIN',
      origin_domain: 'Primary Delivery',
    },
  ],
  mutation_attempts: [
    { type: 'reorder_path', forbidden: true },
    { type: 'add_domain', forbidden: true },
    { type: 'remove_domain', forbidden: true },
    { type: 'edit_role', forbidden: true },
    { type: 'infer_additional_links', forbidden: true },
    { type: 'animate_flow', forbidden: true },
    { type: 'domain_selection_interaction', forbidden: true },
    { type: 'cluster_detail_expand', forbidden: true },
    { type: 'free_topology_navigation', forbidden: true },
  ],
  expected: {
    no_topology_mutation: true,
    no_live_inference: true,
    no_animated_flow: true,
    topology_read_only: true,
    chains_unchanged_after_render: true,
    no_domain_selection: true,
    no_free_exploration: true,
  },
};

module.exports = { FLAGSHIP_FORBIDDEN_TOPOLOGY_MUTATION_FIXTURE };

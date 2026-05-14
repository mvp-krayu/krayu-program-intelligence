'use strict';

// Fixture verifying topology remains read-only throughout experiential realization.
const EXPERIENTIAL_FORBIDDEN_TOPOLOGY_MUTATION_FIXTURE = {
  topology_chains: [
    { path: ['Domain A', 'Domain B'], pressure_tier: 'HIGH', propagation_role: 'ORIGIN', origin_domain: 'Domain A' },
  ],
  mutation_attempts: [
    { type: 'reorder_path', forbidden: true },
    { type: 'add_domain', forbidden: true },
    { type: 'remove_domain', forbidden: true },
    { type: 'edit_role', forbidden: true },
    { type: 'infer_additional_links', forbidden: true },
    { type: 'animate_flow', forbidden: true },
  ],
  expected: {
    no_topology_mutation: true,
    no_live_inference: true,
    no_animated_flow: true,
    topology_read_only: true,
    chains_unchanged_after_render: true,
  },
};

module.exports = { EXPERIENTIAL_FORBIDDEN_TOPOLOGY_MUTATION_FIXTURE };

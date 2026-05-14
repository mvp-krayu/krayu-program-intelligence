'use strict';

const FLAGSHIP_TOPOLOGY_SAFE_FIXTURE = {
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
      origin_domain: 'Primary Delivery',
    },
  ],
  topology_governance: {
    interactive: false,
    editable: false,
    animated: false,
    node_manipulation_allowed: false,
    topology_editing_allowed: false,
    live_graph_traversal_allowed: false,
    animated_propagation_flow_allowed: false,
    hidden_topology_internals_allowed: false,
    free_exploration_allowed: false,
  },
  visual_realization: {
    role_indicators_static: true,
    pressure_tokens_applied: true,
    domain_aliases_displayed: true,
    structural_role_labels_visible: true,
    no_animated_edges: true,
    no_directional_flow_animation: true,
    no_edge_weight_visualization: true,
  },
  expected: {
    topology_read_only: true,
    chains_unchanged_after_render: true,
    no_topology_mutation: true,
    no_live_inference: true,
    no_animated_flow: true,
    no_interactive_affordances: true,
    visual_realization_static: true,
  },
};

module.exports = { FLAGSHIP_TOPOLOGY_SAFE_FIXTURE };

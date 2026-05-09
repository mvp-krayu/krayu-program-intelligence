'use strict';

// Fixture verifying topology-safe invariants.
// Topology must always be read-only. No mutation. No interactive affordances. No animation.
const EXPERIENTIAL_TOPOLOGY_SAFE_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  propagation_chains: [
    { path: ['Primary Delivery', 'Coordination Layer', 'Secondary Delivery'], pressure_tier: 'HIGH', propagation_role: 'ORIGIN', origin_domain: 'Primary Delivery' },
    { path: ['Coordination Layer', 'Secondary Delivery'], pressure_tier: 'ELEVATED', propagation_role: 'PASS_THROUGH', origin_domain: 'Coordination Layer' },
  ],
  governance_invariants: {
    topology_interactive: false,
    topology_editable: false,
    topology_animated: false,
    no_node_manipulation: true,
    no_topology_editing: true,
    no_live_graph_traversal: true,
    no_hidden_topology_internals: true,
    no_animated_propagation_flow: true,
  },
};

module.exports = { EXPERIENTIAL_TOPOLOGY_SAFE_FIXTURE };

'use strict';

const FLAGSHIP_OPERATOR_FLOW_FIXTURE = {
  operator_stages: [
    { stage: 'SUMMARY', from: null, to: 'SUMMARY', allowed: true },
    { stage: 'EVIDENCE', from: 'SUMMARY', to: 'EVIDENCE', allowed: true },
    { stage: 'PROPAGATION', from: 'EVIDENCE', to: 'PROPAGATION', allowed: true },
    { stage: 'EXPLAINABILITY', from: 'PROPAGATION', to: 'EXPLAINABILITY', allowed: true },
    { stage: 'LINEAGE', from: 'EXPLAINABILITY', to: 'LINEAGE', allowed: true },
  ],
  forbidden_transitions: [
    { type: 'free_form_exploration', forbidden: true },
    { type: 'prompt_input', forbidden: true },
    { type: 'conversational_ux', forbidden: true },
    { type: 'nlq_surface', forbidden: true },
    { type: 'ai_mediated_navigation', forbidden: true },
  ],
  expected: {
    operator_is_bounded: true,
    no_free_form_exploration: true,
    no_prompt_interaction: true,
    no_conversational_ux: true,
    all_stages_deterministic: true,
    operator_preserves_topology_immutability: true,
    operator_preserves_evidence_integrity: true,
  },
};

module.exports = { FLAGSHIP_OPERATOR_FLOW_FIXTURE };

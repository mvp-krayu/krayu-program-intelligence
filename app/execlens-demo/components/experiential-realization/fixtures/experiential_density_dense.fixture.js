'use strict';

const EXPERIENTIAL_DENSITY_DENSE_FIXTURE = {
  densityClass: 'EXECUTIVE_DENSE',
  renderState: 'EXECUTIVE_READY',
  adaptedProps: {
    qualifier_class: 'Q-00',
    executive_summary: 'Structural pressure confirmed.',
    why_primary_statement: 'Primary domain elevated.',
    structural_summary: 'Secondary domains stable.',
    propagation_chains: [],
    evidence_links: [{ domain_alias: 'Primary Delivery', propagation_role: 'ORIGIN', evidence_summary: 'Confirmed.' }],
  },
  expected: {
    density_class: 'EXECUTIVE_DENSE',
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: true,
    show_propagation_posture: true,
    show_evidence_posture: true,
    max_visible_chains: 3,
    collapsed_by_default: false,
    density_token: 'density-executive-dense',
    presentation_compatible: true,
    evidence_references_preserved: true,
  },
};

module.exports = { EXPERIENTIAL_DENSITY_DENSE_FIXTURE };

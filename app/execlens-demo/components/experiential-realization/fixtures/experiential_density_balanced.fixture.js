'use strict';

const EXPERIENTIAL_DENSITY_BALANCED_FIXTURE = {
  densityClass: 'EXECUTIVE_BALANCED',
  renderState: 'EXECUTIVE_READY',
  adaptedProps: {
    qualifier_class: 'Q-00',
    executive_summary: 'Structural pressure confirmed in primary delivery domain.',
    why_primary_statement: 'Primary delivery domain shows elevated cluster load.',
    structural_summary: 'Secondary domains stable.',
    propagation_chains: [],
    evidence_links: [],
  },
  expected: {
    density_class: 'EXECUTIVE_BALANCED',
    show_executive_summary: true,
    show_why_statement: true,
    show_structural_findings: false,
    show_propagation_posture: true,
    show_evidence_posture: false,
    max_visible_chains: 2,
    collapsed_by_default: true,
    density_token: 'density-executive-balanced',
    presentation_compatible: true,
    evidence_references_preserved: true,
    qualifier_notice_visible: false,
    blocked_notice_visible: false,
    diagnostic_notice_visible: false,
  },
};

module.exports = { EXPERIENTIAL_DENSITY_BALANCED_FIXTURE };

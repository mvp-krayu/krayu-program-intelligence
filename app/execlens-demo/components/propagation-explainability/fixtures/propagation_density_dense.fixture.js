'use strict';

const PROPAGATION_DENSITY_DENSE_FIXTURE = {
  densityClass: 'EXECUTIVE_DENSE',
  propagationProps: {
    propagation_summary: 'Structural pressure flow confirmed across the primary delivery topology.',
    propagation_chains: [
      { path: ['Primary Delivery', 'Layer A'], pressure_tier: 'HIGH', propagation_role: 'ORIGIN', origin_domain: 'Primary Delivery' },
      { path: ['Layer A', 'Layer B'], pressure_tier: 'ELEVATED', propagation_role: 'PASS_THROUGH', origin_domain: 'Layer A' },
      { path: ['Layer B'], pressure_tier: 'MODERATE', propagation_role: 'RECEIVER', origin_domain: 'Layer B' },
    ],
    evidence_links: [
      { domain_alias: 'Primary Delivery', propagation_role: 'ORIGIN', evidence_summary: 'Origin confirmed.' },
    ],
  },
  expected: {
    show_propagation_summary: true,
    show_propagation_chains: true,
    show_evidence_linkage: true,
    max_visible_chains: 3,
    chains_collapsed_by_default: false,
    evidence_references_preserved: true,
  },
};

module.exports = { PROPAGATION_DENSITY_DENSE_FIXTURE };

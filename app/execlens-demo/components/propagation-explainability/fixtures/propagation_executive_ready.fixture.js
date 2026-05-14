'use strict';

const PROPAGATION_EXECUTIVE_READY_FIXTURE = {
  renderState: 'EXECUTIVE_READY',
  qualifierClass: 'Q-00',
  densityClass: 'EXECUTIVE_DENSE',
  propagationProps: {
    propagation_summary: 'Structural pressure concentrates in the primary delivery domain and propagates through two intermediate domains. No cross-boundary propagation detected.',
    propagation_chains: [
      {
        path: ['Primary Delivery', 'Coordination Layer', 'Secondary Delivery'],
        pressure_tier: 'HIGH',
        propagation_role: 'ORIGIN',
        origin_domain: 'Primary Delivery',
      },
    ],
    evidence_links: [
      {
        domain_alias: 'Primary Delivery',
        propagation_role: 'ORIGIN',
        evidence_summary: 'Structural load concentration confirmed across primary delivery topology.',
      },
    ],
  },
  expected_mode: 'FULL_PROPAGATION',
  expected_surface_token: 'propagation-executive-ready',
  expected_all_chains_visible: true,
  expected_evidence_linkage_visible: true,
};

module.exports = { PROPAGATION_EXECUTIVE_READY_FIXTURE };

'use strict';

const PROPAGATION_EXECUTIVE_READY_Q01_FIXTURE = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-01',
  densityClass: 'EXECUTIVE_DENSE',
  propagationProps: {
    propagation_summary: 'Propagation analysis reflects confirmed structural evidence within grounded domains. Partial grounding scope applied to secondary delivery analysis.',
    propagation_chains: [
      {
        path: ['Primary Delivery', 'Coordination Layer'],
        pressure_tier: 'ELEVATED',
        propagation_role: 'ORIGIN',
        origin_domain: 'Primary Delivery',
      },
    ],
    evidence_links: [
      {
        domain_alias: 'Primary Delivery',
        propagation_role: 'ORIGIN',
        evidence_summary: 'Structural evidence confirmed within grounded primary domain scope.',
      },
    ],
  },
  expected_mode: 'QUALIFIED_PROPAGATION',
  expected_surface_token: 'propagation-executive-qualified',
  expected_overlay_token: 'token-qualifier-amber',
  expected_overlay_renders: true,
};

module.exports = { PROPAGATION_EXECUTIVE_READY_Q01_FIXTURE };

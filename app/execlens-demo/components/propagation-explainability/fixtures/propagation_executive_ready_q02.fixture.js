'use strict';

const PROPAGATION_EXECUTIVE_READY_Q02_FIXTURE = {
  renderState: 'EXECUTIVE_READY_WITH_QUALIFIER',
  qualifierClass: 'Q-02',
  densityClass: 'EXECUTIVE_DENSE',
  propagationProps: {
    propagation_summary: 'Structural topology confirmed. Propagation depth reflects available grounding within confirmed topology scope.',
    propagation_chains: [
      {
        path: ['Core Infrastructure', 'Delivery Coordination'],
        pressure_tier: 'MODERATE',
        propagation_role: 'PASS_THROUGH',
        origin_domain: 'Core Infrastructure',
      },
    ],
    evidence_links: [
      {
        domain_alias: 'Core Infrastructure',
        propagation_role: 'PASS_THROUGH',
        evidence_summary: 'Structural topology confirmed at infrastructure layer.',
      },
    ],
  },
  expected_mode: 'QUALIFIED_PROPAGATION',
  expected_surface_token: 'propagation-executive-qualified',
  expected_overlay_token: 'token-qualifier-blue',
  expected_overlay_renders: true,
};

module.exports = { PROPAGATION_EXECUTIVE_READY_Q02_FIXTURE };

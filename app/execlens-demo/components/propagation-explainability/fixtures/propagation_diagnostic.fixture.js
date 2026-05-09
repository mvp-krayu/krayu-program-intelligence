'use strict';

const PROPAGATION_DIAGNOSTIC_FIXTURE = {
  renderState: 'DIAGNOSTIC_ONLY',
  qualifierClass: 'Q-03',
  densityClass: 'EXECUTIVE_DENSE',
  propagationProps: {
    propagation_summary: 'Structural propagation patterns are under advisory review. Confirmation recommended before executive action.',
    propagation_chains: [
      {
        path: ['Primary Domain', 'Secondary Domain'],
        pressure_tier: 'ELEVATED',
        propagation_role: 'RECEIVER',
        origin_domain: 'Primary Domain',
      },
    ],
    evidence_links: [
      {
        domain_alias: 'Primary Domain',
        propagation_role: 'RECEIVER',
        evidence_summary: 'Propagation evidence under structural review scope.',
      },
    ],
  },
  expected_mode: 'DIAGNOSTIC_PROPAGATION',
  expected_surface_token: 'propagation-diagnostic',
  expected_diagnostic_notice: 'This report contains content under advisory review. Advisory confirmation recommended.',
};

module.exports = { PROPAGATION_DIAGNOSTIC_FIXTURE };

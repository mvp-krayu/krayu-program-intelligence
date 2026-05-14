'use strict';

const PROPAGATION_BLOCKED_FIXTURE = {
  renderState: 'BLOCKED',
  qualifierClass: 'Q-04',
  densityClass: 'EXECUTIVE_DENSE',
  propagationProps: {
    propagation_summary: null,
    propagation_chains: [],
    evidence_links: [],
  },
  expected_mode: 'BLOCKED_PROPAGATION',
  expected_surface_token: 'propagation-blocked',
  expected_blocked_notice: 'Readiness classification unavailable',
  expected_all_chains_visible: false,
  expected_evidence_linkage_visible: false,
};

module.exports = { PROPAGATION_BLOCKED_FIXTURE };

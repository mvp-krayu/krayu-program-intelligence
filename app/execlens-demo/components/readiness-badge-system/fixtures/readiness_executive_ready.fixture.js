'use strict';

const READINESS_EXECUTIVE_READY_FIXTURE = {
  input: { readiness_state: 'EXECUTIVE_READY', governance_verdict: 'PASS' },
  expected: {
    badge_token: 'token-ready',
    executive_label: 'Executive Ready',
    governance_status_label: 'Governance: Pass',
    qualifier_chip_state: null,
  },
};

module.exports = { READINESS_EXECUTIVE_READY_FIXTURE };

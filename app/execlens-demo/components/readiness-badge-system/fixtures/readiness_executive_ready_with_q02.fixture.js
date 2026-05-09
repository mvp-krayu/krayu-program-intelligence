'use strict';

const READINESS_EXECUTIVE_READY_WITH_Q02_FIXTURE = {
  readiness_input: {
    readiness_state: 'EXECUTIVE_READY_WITH_QUALIFIER',
    governance_verdict: 'PASS',
  },
  qualifier_input: { qualifier_class: 'Q-02' },
  expected_badge: {
    badge_token: 'token-ready-qualified',
    executive_label: 'Executive Ready — Qualified',
    qualifier_chip_state: 'ACTIVE',
  },
  expected_chip: {
    renders: true,
    chip_label: 'Structural View',
    chip_token: 'token-qualifier-blue',
  },
};

module.exports = { READINESS_EXECUTIVE_READY_WITH_Q02_FIXTURE };

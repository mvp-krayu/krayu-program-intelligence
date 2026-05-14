'use strict';

const READINESS_EXECUTIVE_READY_WITH_Q01_FIXTURE = {
  readiness_input: {
    readiness_state: 'EXECUTIVE_READY_WITH_QUALIFIER',
    governance_verdict: 'PASS',
  },
  qualifier_input: { qualifier_class: 'Q-01' },
  expected_badge: {
    badge_token: 'token-ready-qualified',
    executive_label: 'Executive Ready — Qualified',
    qualifier_chip_state: 'ACTIVE',
  },
  expected_chip: {
    renders: true,
    chip_label: 'Partial Grounding',
    chip_token: 'token-qualifier-amber',
  },
};

module.exports = { READINESS_EXECUTIVE_READY_WITH_Q01_FIXTURE };

'use strict';

const READINESS_BLOCKED_FIXTURE = {
  input: { governance_verdict: 'FAIL', readiness_state: 'BLOCKED' },
  expected_governance: {
    governance_indicator: 'FAIL_BLOCKED',
    blocked_visible: true,
    badge_token: 'token-blocked',
  },
  expected_blocked: {
    blocked_headline: 'Readiness classification unavailable',
    blocked_visible: true,
    badge_token: 'token-blocked',
  },
};

module.exports = { READINESS_BLOCKED_FIXTURE };

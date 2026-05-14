'use strict';

const GOVERNANCE_FAIL_STATE_FIXTURE = {
  input: { governance_verdict: 'FAIL', renderState: 'BLOCKED' },
  expected: {
    governance_indicator: 'FAIL_BLOCKED',
    blocked_visible: true,
    diagnostic_visible: false,
    badge_token: 'token-blocked',
  },
  blocked_display_expected: {
    blocked_headline: 'Readiness classification unavailable',
    blocked_visible: true,
    badge_token: 'token-blocked',
  },
};

module.exports = { GOVERNANCE_FAIL_STATE_FIXTURE };

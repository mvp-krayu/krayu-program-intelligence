'use strict';

const READINESS_DIAGNOSTIC_ONLY_FIXTURE = {
  input: { readiness_state: 'DIAGNOSTIC_ONLY', governance_verdict: 'PASS' },
  expected: {
    badge_token: 'token-diagnostic',
    executive_label: 'Under Structural Review',
    governance_status_label: 'Governance: Advisory',
    qualifier_chip_state: 'token-qualifier-grey',
  },
  diagnostic_expected: {
    advisory_notice_required: true,
    diagnostic_visible: true,
  },
};

module.exports = { READINESS_DIAGNOSTIC_ONLY_FIXTURE };

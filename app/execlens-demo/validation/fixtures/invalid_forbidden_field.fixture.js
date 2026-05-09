'use strict';

/**
 * invalid_forbidden_field.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Invalid fixture: contains forbidden field 'prompt_input'.
 * Expected validation outcome: BLOCKED (VAL-GOV-02).
 * Prompt fields must never appear in a report_object.
 */

const { EXECUTIVE_READY_FIXTURE } = require('./executive_ready.fixture');

const INVALID_FORBIDDEN_FIELD_FIXTURE = {
  ...EXECUTIVE_READY_FIXTURE,
  report_id: 'RPT-INVALID-FORBIDDEN-FIELD',
  prompt_input: 'What is the readiness state of the organization?',
};

module.exports = {
  INVALID_FORBIDDEN_FIELD_FIXTURE,
  expectedOutcome: {
    renderState: 'BLOCKED',
    expectedErrorId: 'VAL-GOV-02',
  },
};

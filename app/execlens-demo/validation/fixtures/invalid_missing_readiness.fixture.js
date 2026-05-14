'use strict';

/**
 * invalid_missing_readiness.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Invalid fixture: readiness_state field absent.
 * Expected validation outcome: BLOCKED (VAL-SCHEMA-02).
 * Executive readiness state is required for all rendering decisions.
 */

const { EXECUTIVE_READY_FIXTURE } = require('./executive_ready.fixture');

const base = { ...EXECUTIVE_READY_FIXTURE };
delete base.readiness_state;

const INVALID_MISSING_READINESS_FIXTURE = {
  ...base,
  report_id: 'RPT-INVALID-NO-READINESS',
};

module.exports = {
  INVALID_MISSING_READINESS_FIXTURE,
  expectedOutcome: {
    renderState: 'BLOCKED',
    expectedErrorId: 'VAL-SCHEMA-02',
  },
};

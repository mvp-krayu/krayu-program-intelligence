'use strict';

/**
 * invalid_missing_qualifier.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Invalid fixture: qualifier_class field absent.
 * Expected validation outcome: BLOCKED (VAL-SCHEMA-02).
 * Qualifier preservation cannot be guaranteed without qualifier_class.
 */

const { EXECUTIVE_READY_FIXTURE } = require('./executive_ready.fixture');

const base = { ...EXECUTIVE_READY_FIXTURE };
delete base.qualifier_class;

const INVALID_MISSING_QUALIFIER_FIXTURE = {
  ...base,
  report_id: 'RPT-INVALID-NO-QUALIFIER',
};

module.exports = {
  INVALID_MISSING_QUALIFIER_FIXTURE,
  expectedOutcome: {
    renderState: 'BLOCKED',
    expectedErrorId: 'VAL-SCHEMA-02',
  },
};

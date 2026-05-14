'use strict';

/**
 * invalid_explainability_bundle.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Invalid fixture: explainability_bundle missing the WHY panel.
 * Expected validation outcome: BLOCKED (VAL-EXPLAIN-01).
 * All seven panels are required — partial bundles are rejected.
 */

const { EXECUTIVE_READY_FIXTURE } = require('./executive_ready.fixture');

const incompleteBundle = { ...EXECUTIVE_READY_FIXTURE.explainability_bundle };
delete incompleteBundle.why_panel;

const INVALID_EXPLAINABILITY_BUNDLE_FIXTURE = {
  ...EXECUTIVE_READY_FIXTURE,
  report_id: 'RPT-INVALID-NO-WHY-PANEL',
  explainability_bundle: incompleteBundle,
};

module.exports = {
  INVALID_EXPLAINABILITY_BUNDLE_FIXTURE,
  expectedOutcome: {
    renderState: 'BLOCKED',
    expectedErrorId: 'VAL-EXPLAIN-01',
  },
};

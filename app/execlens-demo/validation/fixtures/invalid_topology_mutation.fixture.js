'use strict';

/**
 * invalid_topology_mutation.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Invalid fixture: topology_scope contains a mutation field 'update_request'.
 * Expected validation outcome: BLOCKED (VAL-GOV-02).
 * Topology is READ-ONLY at the LENS layer — mutation fields are forbidden.
 */

const { EXECUTIVE_READY_FIXTURE } = require('./executive_ready.fixture');

const INVALID_TOPOLOGY_MUTATION_FIXTURE = {
  ...EXECUTIVE_READY_FIXTURE,
  report_id: 'RPT-INVALID-TOPOLOGY-MUTATION',
  topology_scope: {
    ...EXECUTIVE_READY_FIXTURE.topology_scope,
    update_request: { domain_id: 'dom-001', action: 'add_cluster' },
  },
};

module.exports = {
  INVALID_TOPOLOGY_MUTATION_FIXTURE,
  expectedOutcome: {
    renderState: 'BLOCKED',
    expectedErrorId: 'VAL-GOV-02',
  },
};

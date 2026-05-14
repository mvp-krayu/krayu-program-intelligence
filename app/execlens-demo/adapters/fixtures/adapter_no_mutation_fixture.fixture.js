'use strict';

const { EXECUTIVE_READY_FIXTURE } = require('../../validation/fixtures/executive_ready.fixture');

// Deep-frozen copy to verify adapters do not mutate input
const ADAPTER_NO_MUTATION_FIXTURE = JSON.parse(JSON.stringify(EXECUTIVE_READY_FIXTURE));

module.exports = {
  ADAPTER_NO_MUTATION_FIXTURE,
  // Snapshot used in tests to compare against after adapter runs
  ADAPTER_NO_MUTATION_SNAPSHOT: JSON.parse(JSON.stringify(EXECUTIVE_READY_FIXTURE)),
};

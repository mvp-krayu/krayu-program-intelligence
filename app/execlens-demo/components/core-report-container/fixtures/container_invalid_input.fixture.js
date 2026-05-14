'use strict';

const { INVALID_MISSING_QUALIFIER_FIXTURE } = require('../../../validation/fixtures/invalid_missing_qualifier.fixture');

// Invalid schema fixture: qualifier_class absent — routes to BLOCKED (VAL-SCHEMA-02)
const CONTAINER_INVALID_SCHEMA_FIXTURE = INVALID_MISSING_QUALIFIER_FIXTURE;

// Null input — routes to BLOCKED (ORCH-01)
const CONTAINER_NULL_INPUT_FIXTURE = null;

// Array input — routes to BLOCKED (ORCH-01)
const CONTAINER_ARRAY_INPUT_FIXTURE = [];

module.exports = {
  CONTAINER_INVALID_SCHEMA_FIXTURE,
  CONTAINER_NULL_INPUT_FIXTURE,
  CONTAINER_ARRAY_INPUT_FIXTURE,
};

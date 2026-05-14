'use strict';

const { INVALID_FORBIDDEN_FIELD_FIXTURE } = require('../../validation/fixtures/invalid_forbidden_field.fixture');

// Fixture with a forbidden field — validation layer blocks; adapter never runs
const ADAPTER_FORBIDDEN_GEIOS_INTERNAL = INVALID_FORBIDDEN_FIELD_FIXTURE;

module.exports = {
  ADAPTER_FORBIDDEN_GEIOS_INTERNAL,
  expectedRenderState: 'BLOCKED',
  expectedValidationErrorId: 'VAL-GOV-02',
};

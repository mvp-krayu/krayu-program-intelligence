'use strict';

const { DIAGNOSTIC_ONLY_FIXTURE } = require('../../validation/fixtures/diagnostic_only.fixture');

const ADAPTER_VALID_DIAGNOSTIC = DIAGNOSTIC_ONLY_FIXTURE;

module.exports = {
  ADAPTER_VALID_DIAGNOSTIC,
  expectedRenderState: 'DIAGNOSTIC_ONLY',
  audienceTier: 'ADVISORY',
};

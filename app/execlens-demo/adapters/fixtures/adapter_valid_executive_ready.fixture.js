'use strict';

/**
 * adapter_valid_executive_ready.fixture.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Valid EXECUTIVE_READY adapter input fixture.
 * Built from the validated validation-layer fixture.
 */

const { EXECUTIVE_READY_FIXTURE } = require('../../validation/fixtures/executive_ready.fixture');

const ADAPTER_VALID_EXECUTIVE_READY = EXECUTIVE_READY_FIXTURE;

module.exports = {
  ADAPTER_VALID_EXECUTIVE_READY,
  expectedRenderState: 'EXECUTIVE_READY',
  audienceTier: 'EXECUTIVE',
};

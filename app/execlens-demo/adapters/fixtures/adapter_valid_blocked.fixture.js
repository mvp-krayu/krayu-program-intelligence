'use strict';

const { BLOCKED_FIXTURE } = require('../../validation/fixtures/blocked.fixture');

const ADAPTER_VALID_BLOCKED = BLOCKED_FIXTURE;

module.exports = {
  ADAPTER_VALID_BLOCKED,
  expectedRenderState: 'BLOCKED',
  audienceTier: 'EXECUTIVE',
};

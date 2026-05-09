'use strict';

const { INVALID_EXPLAINABILITY_BUNDLE_FIXTURE } = require('../../validation/fixtures/invalid_explainability_bundle.fixture');

const ADAPTER_MISSING_PANEL_REJECTED = INVALID_EXPLAINABILITY_BUNDLE_FIXTURE;

module.exports = {
  ADAPTER_MISSING_PANEL_REJECTED,
  expectedRenderState: 'BLOCKED',
  expectedAdapterError: 'ADAPT-EXPLAIN-01',
};

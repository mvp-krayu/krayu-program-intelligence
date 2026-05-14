'use strict';

/**
 * validationPipeline.test.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Integration tests for the full validation pipeline (validation/index.js):
 * - All four stages run in sequence
 * - End-to-end routing for each fixture state
 * - Determinism guarantee
 * - No mutation guarantee
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateReportObjectPipeline,
  isRenderBlocked,
  isRenderDiagnostic,
  isExecutiveReady,
  RenderState,
} = require('../index');
const { EXECUTIVE_READY_FIXTURE } = require('../fixtures/executive_ready.fixture');
const { EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE } = require('../fixtures/executive_ready_with_qualifier.fixture');
const { DIAGNOSTIC_ONLY_FIXTURE } = require('../fixtures/diagnostic_only.fixture');
const { BLOCKED_FIXTURE } = require('../fixtures/blocked.fixture');
const { INVALID_MISSING_QUALIFIER_FIXTURE } = require('../fixtures/invalid_missing_qualifier.fixture');
const { INVALID_MISSING_READINESS_FIXTURE } = require('../fixtures/invalid_missing_readiness.fixture');
const { INVALID_EXPLAINABILITY_BUNDLE_FIXTURE } = require('../fixtures/invalid_explainability_bundle.fixture');
const { INVALID_FORBIDDEN_FIELD_FIXTURE } = require('../fixtures/invalid_forbidden_field.fixture');
const { INVALID_TOPOLOGY_MUTATION_FIXTURE } = require('../fixtures/invalid_topology_mutation.fixture');

test('PIPELINE PASS: EXECUTIVE_READY fixture → EXECUTIVE_READY render state', () => {
  const result = validateReportObjectPipeline(EXECUTIVE_READY_FIXTURE);
  assert.equal(result.renderState, RenderState.EXECUTIVE_READY);
  assert.equal(result.blockedReason, null);
  assert.ok(isExecutiveReady(result));
  assert.ok(!isRenderBlocked(result));
  assert.ok(!isRenderDiagnostic(result));
});

test('PIPELINE PASS: EXECUTIVE_READY_WITH_QUALIFIER fixture → EXECUTIVE_READY_WITH_QUALIFIER', () => {
  const result = validateReportObjectPipeline(EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE);
  assert.equal(result.renderState, RenderState.EXECUTIVE_READY_WITH_QUALIFIER);
  assert.ok(isExecutiveReady(result));
});

test('PIPELINE PASS: DIAGNOSTIC_ONLY fixture → DIAGNOSTIC_ONLY render state', () => {
  const result = validateReportObjectPipeline(DIAGNOSTIC_ONLY_FIXTURE);
  assert.equal(result.renderState, RenderState.DIAGNOSTIC_ONLY);
  assert.ok(isRenderDiagnostic(result));
  assert.ok(!isRenderBlocked(result));
});

test('PIPELINE BLOCK: BLOCKED fixture (governance_verdict FAIL) → BLOCKED render state', () => {
  const result = validateReportObjectPipeline(BLOCKED_FIXTURE);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(isRenderBlocked(result));
  assert.ok(result.blockedReason, 'blockedReason must be populated');
});

test('PIPELINE BLOCK: missing qualifier_class → BLOCKED', () => {
  const result = validateReportObjectPipeline(INVALID_MISSING_QUALIFIER_FIXTURE);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(isRenderBlocked(result));
  assert.ok(result.allErrors.some(e => e.id === 'VAL-SCHEMA-02'));
});

test('PIPELINE BLOCK: missing readiness_state → BLOCKED', () => {
  const result = validateReportObjectPipeline(INVALID_MISSING_READINESS_FIXTURE);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(result.allErrors.some(e => e.id === 'VAL-SCHEMA-02'));
});

test('PIPELINE BLOCK: missing explainability panel → BLOCKED', () => {
  const result = validateReportObjectPipeline(INVALID_EXPLAINABILITY_BUNDLE_FIXTURE);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(result.allErrors.some(e => e.id === 'VAL-EXPLAIN-01'));
});

test('PIPELINE BLOCK: forbidden field (prompt_input) → BLOCKED', () => {
  const result = validateReportObjectPipeline(INVALID_FORBIDDEN_FIELD_FIXTURE);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(result.allErrors.some(e => e.id === 'VAL-GOV-02'));
});

test('PIPELINE BLOCK: topology mutation field → BLOCKED', () => {
  const result = validateReportObjectPipeline(INVALID_TOPOLOGY_MUTATION_FIXTURE);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(result.allErrors.some(e => e.id === 'VAL-GOV-02'));
});

test('PIPELINE BLOCK: null input → BLOCKED', () => {
  const result = validateReportObjectPipeline(null);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(isRenderBlocked(result));
});

test('PIPELINE: stageResults object contains all four stage keys', () => {
  const result = validateReportObjectPipeline(EXECUTIVE_READY_FIXTURE);
  assert.ok(result.stageResults.governance !== undefined);
  assert.ok(result.stageResults.schema !== undefined);
  assert.ok(result.stageResults.explainability !== undefined);
  assert.ok(result.stageResults.phase2 !== undefined);
});

test('PIPELINE DETERMINISTIC: same report_object always produces same result', () => {
  const r1 = validateReportObjectPipeline(EXECUTIVE_READY_FIXTURE);
  const r2 = validateReportObjectPipeline(EXECUTIVE_READY_FIXTURE);
  const r3 = validateReportObjectPipeline(EXECUTIVE_READY_FIXTURE);
  assert.equal(r1.renderState, r2.renderState);
  assert.equal(r2.renderState, r3.renderState);
  assert.equal(r1.allErrors.length, r2.allErrors.length);
  assert.equal(r1.valid, r2.valid);
});

test('PIPELINE NO MUTATION: report_object is not mutated by pipeline', () => {
  const original = JSON.parse(JSON.stringify(EXECUTIVE_READY_FIXTURE));
  validateReportObjectPipeline(EXECUTIVE_READY_FIXTURE);
  assert.deepEqual(EXECUTIVE_READY_FIXTURE, original, 'report_object must not be mutated by pipeline');
});

test('PIPELINE BLOCKED renders with blockedReason string', () => {
  const result = validateReportObjectPipeline({
    ...EXECUTIVE_READY_FIXTURE,
    governance_verdict: 'FAIL',
  });
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.equal(typeof result.blockedReason, 'string');
  assert.ok(result.blockedReason.length > 0);
});

test('PIPELINE: isExecutiveReady convenience predicate works correctly', () => {
  const r1 = validateReportObjectPipeline(EXECUTIVE_READY_FIXTURE);
  const r2 = validateReportObjectPipeline(EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE);
  const r3 = validateReportObjectPipeline(BLOCKED_FIXTURE);
  assert.equal(isExecutiveReady(r1), true);
  assert.equal(isExecutiveReady(r2), true);
  assert.equal(isExecutiveReady(r3), false);
});

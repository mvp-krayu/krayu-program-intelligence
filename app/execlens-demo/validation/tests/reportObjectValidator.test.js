'use strict';

/**
 * reportObjectValidator.test.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Tests for ReportObjectValidator:
 * - Required field validation
 * - Enum validation
 * - Evidence block validation
 * - Module registry validation
 * - Interaction registry phase restriction enforcement
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateReportObject } = require('../ReportObjectValidator');
const { EXECUTIVE_READY_FIXTURE } = require('../fixtures/executive_ready.fixture');
const { INVALID_MISSING_QUALIFIER_FIXTURE } = require('../fixtures/invalid_missing_qualifier.fixture');
const { INVALID_MISSING_READINESS_FIXTURE } = require('../fixtures/invalid_missing_readiness.fixture');

test('PASS: valid EXECUTIVE_READY fixture has no schema errors', () => {
  const result = validateReportObject(EXECUTIVE_READY_FIXTURE);
  const schemaErrors = result.errors.filter(e => e.id.startsWith('VAL-SCHEMA'));
  assert.equal(schemaErrors.length, 0, `Unexpected schema errors: ${JSON.stringify(schemaErrors)}`);
  assert.equal(result.hasBlockingError, false);
});

test('BLOCK: null reportObject returns BLOCKED result with VAL-SCHEMA-01', () => {
  const result = validateReportObject(null);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-SCHEMA-01'), 'Expected VAL-SCHEMA-01');
  assert.equal(result.hasBlockingError, true);
});

test('BLOCK: undefined reportObject returns BLOCKED result with VAL-SCHEMA-01', () => {
  const result = validateReportObject(undefined);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-SCHEMA-01'));
});

test('BLOCK: missing qualifier_class produces VAL-SCHEMA-02', () => {
  const result = validateReportObject(INVALID_MISSING_QUALIFIER_FIXTURE);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-SCHEMA-02'),
    'Expected VAL-SCHEMA-02 for missing qualifier_class');
});

test('BLOCK: missing readiness_state produces VAL-SCHEMA-02', () => {
  const result = validateReportObject(INVALID_MISSING_READINESS_FIXTURE);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-SCHEMA-02'),
    'Expected VAL-SCHEMA-02 for missing readiness_state');
});

test('BLOCK: missing evidence_object_hash produces VAL-BLOCK-02', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE };
  delete fixture.evidence_object_hash;
  const result = validateReportObject(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-BLOCK-02'),
    'Expected VAL-BLOCK-02 for missing evidence_object_hash');
});

test('BLOCK: governance_verdict FAIL produces VAL-BLOCK-01', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, governance_verdict: 'FAIL' };
  const result = validateReportObject(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-BLOCK-01'),
    'Expected VAL-BLOCK-01 for governance_verdict FAIL');
});

test('BLOCK: invalid governance_verdict value produces VAL-SCHEMA-02', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, governance_verdict: 'UNKNOWN' };
  const result = validateReportObject(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-SCHEMA-02'));
});

test('BLOCK: missing narrative_block produces VAL-SCHEMA-01', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE };
  delete fixture.narrative_block;
  const result = validateReportObject(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-SCHEMA-01'));
});

test('BLOCK: empty evidence_blocks produces VAL-SCHEMA-01', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, evidence_blocks: [] };
  const result = validateReportObject(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-SCHEMA-01'));
});

test('BLOCK: missing explainability_bundle produces VAL-EXPLAIN-01', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE };
  delete fixture.explainability_bundle;
  const result = validateReportObject(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-01'));
});

test('WARN: incomplete topology_scope produces VAL-DIAG-01 warning (not blocking)', () => {
  const fixture = {
    ...EXECUTIVE_READY_FIXTURE,
    topology_scope: { domain_count: 5 },
  };
  const result = validateReportObject(fixture);
  assert.ok(result.warnings.some(e => e.id === 'VAL-DIAG-01'));
  // Should not block valid fixture otherwise
});

test('WARN: incomplete rendering_metadata produces VAL-DIAG-02 warning', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, rendering_metadata: {} };
  const result = validateReportObject(fixture);
  assert.ok(result.warnings.some(e => e.id === 'VAL-DIAG-02'));
});

test('WARN: phase-restricted interaction active produces VAL-GOV-03 warning', () => {
  const fixture = {
    ...EXECUTIVE_READY_FIXTURE,
    interaction_registry: {
      interactions: [
        {
          interaction_id: 'INT-BAD',
          interaction_type: 'COPILOT_ENTRY',
          target_module_id: 'MOD-001',
          phase_required: 5,
          active: true,
          governance_gate: 'GATE-5',
        },
      ],
    },
  };
  const result = validateReportObject(fixture);
  assert.ok(result.warnings.some(e => e.id === 'VAL-GOV-03'));
});

test('DETERMINISTIC: same input always produces same output', () => {
  const result1 = validateReportObject(EXECUTIVE_READY_FIXTURE);
  const result2 = validateReportObject(EXECUTIVE_READY_FIXTURE);
  assert.deepEqual(result1.valid, result2.valid);
  assert.deepEqual(result1.errors.length, result2.errors.length);
  assert.deepEqual(result1.warnings.length, result2.warnings.length);
});

test('NO MUTATION: reportObject is not mutated by validation', () => {
  const original = JSON.parse(JSON.stringify(EXECUTIVE_READY_FIXTURE));
  validateReportObject(EXECUTIVE_READY_FIXTURE);
  assert.deepEqual(EXECUTIVE_READY_FIXTURE, original, 'reportObject must not be mutated');
});

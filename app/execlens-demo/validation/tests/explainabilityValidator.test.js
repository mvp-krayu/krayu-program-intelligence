'use strict';

/**
 * explainabilityValidator.test.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Tests for ExplainabilityValidator:
 * - Seven-panel completeness
 * - Panel structure validation
 * - Q-04 absence notice requirement
 * - Audience validation
 * - Live generation field detection
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateExplainabilityBundle, validatePanel, validateQ04AbsenceNotice } = require('../ExplainabilityValidator');
const { EXECUTIVE_READY_FIXTURE } = require('../fixtures/executive_ready.fixture');
const { BLOCKED_FIXTURE } = require('../fixtures/blocked.fixture');
const { INVALID_EXPLAINABILITY_BUNDLE_FIXTURE } = require('../fixtures/invalid_explainability_bundle.fixture');

const VALID_BUNDLE = EXECUTIVE_READY_FIXTURE.explainability_bundle;

test('PASS: valid seven-panel bundle has no errors', () => {
  const result = validateExplainabilityBundle(VALID_BUNDLE, 'Q-00');
  assert.equal(result.valid, true, `Unexpected errors: ${JSON.stringify(result.errors)}`);
  assert.equal(result.errors.length, 0);
  assert.equal(result.panelsFound.length, 7);
  assert.equal(result.panelsMissing.length, 0);
});

test('BLOCK: null bundle produces VAL-EXPLAIN-01', () => {
  const result = validateExplainabilityBundle(null, 'Q-00');
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-01'));
  assert.equal(result.panelsMissing.length, 7);
});

test('BLOCK: missing why_panel produces VAL-EXPLAIN-01', () => {
  const bundle = { ...VALID_BUNDLE };
  delete bundle.why_panel;
  const result = validateExplainabilityBundle(bundle, 'Q-00');
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-01'));
  assert.ok(result.panelsMissing.includes('WHY'));
});

test('BLOCK: missing evidence_panel produces VAL-EXPLAIN-01', () => {
  const bundle = { ...VALID_BUNDLE };
  delete bundle.evidence_panel;
  const result = validateExplainabilityBundle(bundle, 'Q-00');
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-01'));
  assert.ok(result.panelsMissing.includes('EVIDENCE'));
});

test('BLOCK: missing trace_panel produces VAL-EXPLAIN-01', () => {
  const bundle = { ...VALID_BUNDLE };
  delete bundle.trace_panel;
  const result = validateExplainabilityBundle(bundle, 'Q-00');
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-01'));
});

test('BLOCK: missing qualifiers_panel produces VAL-EXPLAIN-01', () => {
  const bundle = { ...VALID_BUNDLE };
  delete bundle.qualifiers_panel;
  const result = validateExplainabilityBundle(bundle, 'Q-00');
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-01'));
  assert.ok(result.panelsMissing.includes('QUALIFIERS'));
});

test('BLOCK: invalid panel audience produces VAL-EXPLAIN-02', () => {
  const bundle = {
    ...VALID_BUNDLE,
    why_panel: { ...VALID_BUNDLE.why_panel, audience: 'INVALID_AUDIENCE' },
  };
  const result = validateExplainabilityBundle(bundle, 'Q-00');
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-02'));
});

test('BLOCK: invalid panel_id produces VAL-EXPLAIN-02', () => {
  const bundle = {
    ...VALID_BUNDLE,
    why_panel: { ...VALID_BUNDLE.why_panel, panel_id: 'INVENTED_PANEL' },
  };
  const result = validateExplainabilityBundle(bundle, 'Q-00');
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-02'));
});

test('BLOCK: panel with null content_blocks produces VAL-EXPLAIN-02', () => {
  const bundle = {
    ...VALID_BUNDLE,
    why_panel: { ...VALID_BUNDLE.why_panel, content_blocks: null },
  };
  const result = validateExplainabilityBundle(bundle, 'Q-00');
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-02'));
});

test('GOVERNANCE VIOLATION: Q-04 without absence notice produces VAL-EXPLAIN-03', () => {
  const bundle = {
    ...VALID_BUNDLE,
    qualifiers_panel: {
      panel_id: 'QUALIFIERS',
      panel_title: 'Qualifiers',
      content_blocks: [{ block_type: 'NARRATIVE', content: 'Some content without the required notice.' }],
      audience: 'EXECUTIVE',
      available_in_phase: 2,
    },
  };
  const result = validateExplainabilityBundle(bundle, 'Q-04');
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-03'),
    'Expected VAL-EXPLAIN-03 for missing Q-04 absence notice');
});

test('PASS: Q-04 with correct absence notice text passes validation', () => {
  const bundle = BLOCKED_FIXTURE.explainability_bundle;
  const result = validateExplainabilityBundle(bundle, 'Q-04');
  const q04Errors = result.errors.filter(e => e.id === 'VAL-EXPLAIN-03');
  assert.equal(q04Errors.length, 0, 'Q-04 absence notice should satisfy requirement');
});

test('PASS: Q-00 does not require absence notice', () => {
  const result = validateExplainabilityBundle(VALID_BUNDLE, 'Q-00');
  assert.ok(!result.errors.some(e => e.id === 'VAL-EXPLAIN-03'));
});

test('BLOCK: live_generated=true field on panel produces VAL-GOV-02', () => {
  const bundle = {
    ...VALID_BUNDLE,
    why_panel: { ...VALID_BUNDLE.why_panel, live_generated: true },
  };
  const result = validateExplainabilityBundle(bundle, 'Q-00');
  assert.ok(result.errors.some(e => e.id === 'VAL-GOV-02'));
});

test('BLOCK: invalid fixture with missing why_panel produces correct error', () => {
  const result = validateExplainabilityBundle(
    INVALID_EXPLAINABILITY_BUNDLE_FIXTURE.explainability_bundle, 'Q-00'
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-EXPLAIN-01'));
  assert.ok(result.panelsMissing.includes('WHY'));
});

test('DETERMINISTIC: same bundle always produces same result', () => {
  const r1 = validateExplainabilityBundle(VALID_BUNDLE, 'Q-00');
  const r2 = validateExplainabilityBundle(VALID_BUNDLE, 'Q-00');
  assert.deepEqual(r1.valid, r2.valid);
  assert.deepEqual(r1.panelsFound, r2.panelsFound);
});

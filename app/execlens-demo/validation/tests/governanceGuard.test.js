'use strict';

/**
 * governanceGuard.test.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Tests for GovernanceGuard:
 * - Forbidden top-level field detection
 * - GEIOS identifier detection in narrative text
 * - Topology mutation field detection
 * - Phase-restricted interaction detection
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  runGovernanceGuard,
  checkForbiddenTopLevelFields,
  validateNarrativeVocabulary,
  checkTopologyMutationFields,
  checkInteractionGovernance,
  scanTextForForbiddenIdentifiers,
} = require('../GovernanceGuard');
const { EXECUTIVE_READY_FIXTURE } = require('../fixtures/executive_ready.fixture');
const { INVALID_FORBIDDEN_FIELD_FIXTURE } = require('../fixtures/invalid_forbidden_field.fixture');
const { INVALID_TOPOLOGY_MUTATION_FIXTURE } = require('../fixtures/invalid_topology_mutation.fixture');

test('PASS: valid EXECUTIVE_READY fixture passes governance guard', () => {
  const result = runGovernanceGuard(EXECUTIVE_READY_FIXTURE);
  assert.equal(result.passed, true, `Unexpected governance errors: ${JSON.stringify(result.errors)}`);
  assert.equal(result.errors.length, 0);
});

test('BLOCK: prompt_input field produces VAL-GOV-02', () => {
  const result = runGovernanceGuard(INVALID_FORBIDDEN_FIELD_FIXTURE);
  assert.equal(result.passed, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-GOV-02' && e.detail && e.detail.includes('prompt_input')),
    'Expected VAL-GOV-02 with prompt_input detail');
});

test('BLOCK: ai_response field produces VAL-GOV-02', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, ai_response: 'some text' };
  const result = runGovernanceGuard(fixture);
  assert.equal(result.passed, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-GOV-02' && e.detail && e.detail.includes('ai_response')));
});

test('BLOCK: llm_output field produces VAL-GOV-02', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, llm_output: 'text' };
  const result = runGovernanceGuard(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-GOV-02'));
});

test('BLOCK: rag_payload field produces VAL-GOV-02', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, rag_payload: { chunks: [] } };
  const result = runGovernanceGuard(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-GOV-02'));
});

test('BLOCK: topology mutation field (update_request) produces VAL-GOV-02', () => {
  const result = runGovernanceGuard(INVALID_TOPOLOGY_MUTATION_FIXTURE);
  assert.equal(result.passed, false);
  assert.ok(result.errors.some(e => e.id === 'VAL-GOV-02' && e.detail && e.detail.includes('update_request')));
});

test('BLOCK: narrative text containing TAXONOMY-01 produces VAL-GOV-02', () => {
  const fixture = {
    ...EXECUTIVE_READY_FIXTURE,
    narrative_block: {
      executive_summary: 'Based on TAXONOMY-01 analysis, readiness is confirmed.',
      why_section: 'Normal why section.',
      structural_summary: 'Normal structural summary.',
    },
  };
  const result = runGovernanceGuard(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-GOV-02' && e.detail && e.detail.includes('TAXONOMY-01')));
});

test('BLOCK: narrative text containing GEIOS produces VAL-GOV-02', () => {
  const fixture = {
    ...EXECUTIVE_READY_FIXTURE,
    narrative_block: {
      executive_summary: 'The GEIOS substrate has computed the result.',
      why_section: 'Normal why section.',
      structural_summary: 'Normal structural summary.',
    },
  };
  const result = runGovernanceGuard(fixture);
  assert.ok(result.errors.some(e => e.id === 'VAL-GOV-02'));
});

test('BLOCK: checkForbiddenTopLevelFields detects vector_result', () => {
  const errors = checkForbiddenTopLevelFields({ vector_result: [0.1, 0.2], report_id: 'test' });
  assert.ok(errors.some(e => e.id === 'VAL-GOV-02'));
});

test('PASS: checkForbiddenTopLevelFields on clean object returns no errors', () => {
  const errors = checkForbiddenTopLevelFields({ report_id: 'test', readiness_state: 'EXECUTIVE_READY' });
  assert.equal(errors.length, 0);
});

test('BLOCK: checkTopologyMutationFields detects update_request', () => {
  const errors = checkTopologyMutationFields({
    domain_count: 5,
    update_request: { action: 'add' },
  });
  assert.ok(errors.some(e => e.id === 'VAL-GOV-02' && e.detail && e.detail.includes('update_request')));
});

test('PASS: checkTopologyMutationFields on clean topology returns no errors', () => {
  const errors = checkTopologyMutationFields({
    domain_count: 5,
    cluster_count: 20,
    grounded_domain_count: 5,
    grounding_label: 'Full Coverage',
  });
  assert.equal(errors.length, 0);
});

test('WARN: active COPILOT_ENTRY interaction produces VAL-GOV-03 warning', () => {
  const ir = {
    interactions: [
      { interaction_id: 'INT-COP', interaction_type: 'COPILOT_ENTRY', active: true },
    ],
  };
  const errors = checkInteractionGovernance(ir);
  assert.ok(errors.some(e => e.id === 'VAL-GOV-03'));
});

test('PASS: active EXPAND_COLLAPSE interaction does not trigger governance violation', () => {
  const ir = {
    interactions: [
      { interaction_id: 'INT-EC', interaction_type: 'EXPAND_COLLAPSE', active: true },
    ],
  };
  const errors = checkInteractionGovernance(ir);
  assert.equal(errors.length, 0);
});

test('DETERMINISTIC: same input always produces same result', () => {
  const r1 = runGovernanceGuard(EXECUTIVE_READY_FIXTURE);
  const r2 = runGovernanceGuard(EXECUTIVE_READY_FIXTURE);
  assert.deepEqual(r1.passed, r2.passed);
  assert.deepEqual(r1.errors.length, r2.errors.length);
});

test('NO MUTATION: runGovernanceGuard does not mutate input', () => {
  const copy = JSON.parse(JSON.stringify(EXECUTIVE_READY_FIXTURE));
  runGovernanceGuard(EXECUTIVE_READY_FIXTURE);
  assert.deepEqual(EXECUTIVE_READY_FIXTURE, copy);
});

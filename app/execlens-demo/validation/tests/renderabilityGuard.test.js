'use strict';

/**
 * renderabilityGuard.test.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Tests for RenderabilityGuard:
 * - EXECUTIVE_READY routing
 * - EXECUTIVE_READY_WITH_QUALIFIER routing
 * - DIAGNOSTIC_ONLY routing
 * - BLOCKED routing (governance_verdict FAIL, blocking errors)
 * - Phase 2 compatibility
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { determineRenderState, isPhase2Compatible, RenderState } = require('../RenderabilityGuard');
const { makeError } = require('../ValidationErrorTaxonomy');
const { EXECUTIVE_READY_FIXTURE } = require('../fixtures/executive_ready.fixture');
const { EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE } = require('../fixtures/executive_ready_with_qualifier.fixture');
const { DIAGNOSTIC_ONLY_FIXTURE } = require('../fixtures/diagnostic_only.fixture');
const { BLOCKED_FIXTURE } = require('../fixtures/blocked.fixture');

test('PASS: EXECUTIVE_READY fixture routes to EXECUTIVE_READY', () => {
  const result = determineRenderState(EXECUTIVE_READY_FIXTURE, [], [], []);
  assert.equal(result.renderState, RenderState.EXECUTIVE_READY);
  assert.equal(result.blockedReason, null);
});

test('PASS: EXECUTIVE_READY_WITH_QUALIFIER fixture routes correctly', () => {
  const result = determineRenderState(EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE, [], [], []);
  assert.equal(result.renderState, RenderState.EXECUTIVE_READY_WITH_QUALIFIER);
  assert.equal(result.blockedReason, null);
});

test('PASS: DIAGNOSTIC_ONLY fixture routes to DIAGNOSTIC_ONLY', () => {
  const result = determineRenderState(DIAGNOSTIC_ONLY_FIXTURE, [], [], []);
  assert.equal(result.renderState, RenderState.DIAGNOSTIC_ONLY);
  assert.equal(result.blockedReason, null);
});

test('PASS: SUPPRESSED_FROM_EXECUTIVE routes to DIAGNOSTIC_ONLY', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, readiness_state: 'SUPPRESSED_FROM_EXECUTIVE' };
  const result = determineRenderState(fixture, [], [], []);
  assert.equal(result.renderState, RenderState.DIAGNOSTIC_ONLY);
});

test('BLOCK: BLOCKED_PENDING_DOMAIN_GROUNDING routes to BLOCKED', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, readiness_state: 'BLOCKED_PENDING_DOMAIN_GROUNDING' };
  const result = determineRenderState(fixture, [], [], []);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(result.blockedReason);
});

test('BLOCK: governance_verdict FAIL routes to BLOCKED regardless of readiness_state', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, governance_verdict: 'FAIL' };
  const result = determineRenderState(fixture, [], [], []);
  assert.equal(result.renderState, RenderState.BLOCKED);
});

test('BLOCK: VAL-BLOCK-01 error in validationErrors routes to BLOCKED', () => {
  const error = makeError('VAL-BLOCK-01', 'governance FAIL');
  const result = determineRenderState(EXECUTIVE_READY_FIXTURE, [error], [], []);
  assert.equal(result.renderState, RenderState.BLOCKED);
  assert.ok(result.blockedReason && result.blockedReason.includes('VAL-BLOCK-01'));
});

test('BLOCK: VAL-BLOCK-02 error routes to BLOCKED', () => {
  const error = makeError('VAL-BLOCK-02', 'hash absent');
  const result = determineRenderState(EXECUTIVE_READY_FIXTURE, [error], [], []);
  assert.equal(result.renderState, RenderState.BLOCKED);
});

test('BLOCK: VAL-EXPLAIN-01 error routes to BLOCKED', () => {
  const error = makeError('VAL-EXPLAIN-01', 'panel missing');
  const result = determineRenderState(EXECUTIVE_READY_FIXTURE, [], [], [error]);
  assert.equal(result.renderState, RenderState.BLOCKED);
});

test('BLOCK: VAL-GOV-02 error in governance errors routes to BLOCKED', () => {
  const error = makeError('VAL-GOV-02', 'forbidden field');
  const result = determineRenderState(EXECUTIVE_READY_FIXTURE, [], [error], []);
  assert.equal(result.renderState, RenderState.BLOCKED);
});

test('BLOCK: GOVERNANCE_VIOLATION route errors always block', () => {
  const error = makeError('VAL-EXPLAIN-03', 'Q-04 silent');
  const result = determineRenderState(EXECUTIVE_READY_FIXTURE, [], [], [error]);
  assert.equal(result.renderState, RenderState.BLOCKED);
});

test('BLOCK: null reportObject routes to BLOCKED', () => {
  const result = determineRenderState(null, [], [], []);
  assert.equal(result.renderState, RenderState.BLOCKED);
});

test('PHASE2: valid EXECUTIVE_READY fixture is Phase 2 compatible', () => {
  const result = isPhase2Compatible(EXECUTIVE_READY_FIXTURE);
  assert.equal(result.compatible, true, `Violations: ${JSON.stringify(result.violations)}`);
  assert.equal(result.violations.length, 0);
});

test('PHASE2: active COPILOT_ENTRY interaction is not Phase 2 compatible', () => {
  const fixture = {
    ...EXECUTIVE_READY_FIXTURE,
    interaction_registry: {
      interactions: [
        {
          interaction_id: 'INT-COP',
          interaction_type: 'COPILOT_ENTRY',
          active: true,
          phase_required: 5,
          governance_gate: 'GATE-5',
        },
      ],
    },
  };
  const result = isPhase2Compatible(fixture);
  assert.equal(result.compatible, false);
  assert.ok(result.violations.length > 0);
});

test('PHASE2: live_generation field makes report non-Phase-2 compatible', () => {
  const fixture = { ...EXECUTIVE_READY_FIXTURE, live_generation: true };
  const result = isPhase2Compatible(fixture);
  assert.equal(result.compatible, false);
});

test('DETERMINISTIC: same inputs always produce same render state', () => {
  const r1 = determineRenderState(EXECUTIVE_READY_FIXTURE, [], [], []);
  const r2 = determineRenderState(EXECUTIVE_READY_FIXTURE, [], [], []);
  assert.equal(r1.renderState, r2.renderState);
  assert.equal(r1.blockedReason, r2.blockedReason);
});

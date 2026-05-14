'use strict';

/**
 * coreReportContainer.test.js
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 *
 * Tests for containerOrchestration.js — the pure logic layer of CoreReportContainer.
 * Tests run via: node --test
 * No React rendering required — orchestration logic is pure CJS.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  orchestrateReport,
  getRouteTarget,
  ROUTE_TARGET_MAP,
  VALID_AUDIENCE_TIERS,
} = require('../containerOrchestration');

const { CONTAINER_EXECUTIVE_READY_FIXTURE } = require('../fixtures/container_executive_ready.fixture');
const { CONTAINER_EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE } = require('../fixtures/container_executive_ready_with_qualifier.fixture');
const { CONTAINER_DIAGNOSTIC_FIXTURE } = require('../fixtures/container_diagnostic.fixture');
const { CONTAINER_BLOCKED_FIXTURE } = require('../fixtures/container_blocked.fixture');
const {
  CONTAINER_INVALID_SCHEMA_FIXTURE,
  CONTAINER_NULL_INPUT_FIXTURE,
  CONTAINER_ARRAY_INPUT_FIXTURE,
} = require('../fixtures/container_invalid_input.fixture');

const { INVALID_FORBIDDEN_FIELD_FIXTURE } = require('../../../validation/fixtures/invalid_forbidden_field.fixture');

const FORBIDDEN_PROMPT_FIELDS = [
  'prompt_input', 'ai_response', 'llm_output', 'vector_result',
  'rag_payload', 'orchestration_payload',
];

const FORBIDDEN_GEIOS_IDENTIFIERS = [
  'TAXONOMY-01', 'activation_state', 'signal_stable_key',
  'canonical_topology.json', 'DPSIG', 'EXSIG',
];

// ---------------------------------------------------------------------------
// Route resolution
// ---------------------------------------------------------------------------

describe('Route resolution', () => {
  test('EXECUTIVE_READY input → routeTarget ReportModuleShell', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'ReportModuleShell');
  });

  test('EXECUTIVE_READY_WITH_QUALIFIER input → routeTarget ReportModuleShell', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'ReportModuleShell');
  });

  test('DIAGNOSTIC_ONLY input → routeTarget DiagnosticReportState', () => {
    const result = orchestrateReport(CONTAINER_DIAGNOSTIC_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'DiagnosticReportState');
  });

  test('BLOCKED fixture input → routeTarget BlockedReportState', () => {
    const result = orchestrateReport(CONTAINER_BLOCKED_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'BlockedReportState');
  });

  test('invalid schema input (missing qualifier) → routeTarget BlockedReportState', () => {
    const result = orchestrateReport(CONTAINER_INVALID_SCHEMA_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'BlockedReportState');
  });

  test('null input → routeTarget BlockedReportState', () => {
    const result = orchestrateReport(CONTAINER_NULL_INPUT_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'BlockedReportState');
  });

  test('array input → routeTarget BlockedReportState', () => {
    const result = orchestrateReport(CONTAINER_ARRAY_INPUT_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'BlockedReportState');
  });

  test('string input → routeTarget BlockedReportState', () => {
    const result = orchestrateReport('not-an-object', 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'BlockedReportState');
  });
});

// ---------------------------------------------------------------------------
// Render state propagation
// ---------------------------------------------------------------------------

describe('Render state propagation', () => {
  test('EXECUTIVE_READY input → route EXECUTIVE_READY', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.route, 'EXECUTIVE_READY');
  });

  test('EXECUTIVE_READY_WITH_QUALIFIER input → route EXECUTIVE_READY_WITH_QUALIFIER', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_WITH_QUALIFIER_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.route, 'EXECUTIVE_READY_WITH_QUALIFIER');
  });

  test('DIAGNOSTIC_ONLY input → route DIAGNOSTIC_ONLY', () => {
    const result = orchestrateReport(CONTAINER_DIAGNOSTIC_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.route, 'DIAGNOSTIC_ONLY');
  });

  test('BLOCKED fixture input → route BLOCKED', () => {
    const result = orchestrateReport(CONTAINER_BLOCKED_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.route, 'BLOCKED');
  });
});

// ---------------------------------------------------------------------------
// Null / absent input handling
// ---------------------------------------------------------------------------

describe('Null and absent input handling', () => {
  test('null → orchestrationError is ORCH-01', () => {
    const result = orchestrateReport(null, 'EXECUTIVE', 2);
    assert.ok(result.orchestrationError);
    assert.ok(result.orchestrationError.startsWith('ORCH-01'));
  });

  test('null → adaptedProps is null', () => {
    const result = orchestrateReport(null, 'EXECUTIVE', 2);
    assert.strictEqual(result.adaptedProps, null);
  });

  test('undefined → route BLOCKED', () => {
    const result = orchestrateReport(undefined, 'EXECUTIVE', 2);
    assert.strictEqual(result.route, 'BLOCKED');
  });

  test('undefined → orchestrationError set', () => {
    const result = orchestrateReport(undefined, 'EXECUTIVE', 2);
    assert.ok(result.orchestrationError);
  });
});

// ---------------------------------------------------------------------------
// Adapter failure routing
// ---------------------------------------------------------------------------

describe('Adapter failure handling', () => {
  test('adapter failure (getter throws) → routeTarget BlockedReportState', () => {
    const throwingInput = {};
    Object.defineProperty(throwingInput, 'governance_verdict', {
      get() { throw new Error('Simulated adapter failure'); },
      enumerable: true,
    });
    const result = orchestrateReport(throwingInput, 'EXECUTIVE', 2);
    assert.strictEqual(result.routeTarget, 'BlockedReportState');
  });

  test('adapter failure → orchestrationError starts with ORCH-02', () => {
    const throwingInput = {};
    Object.defineProperty(throwingInput, 'governance_verdict', {
      get() { throw new Error('Simulated adapter failure'); },
      enumerable: true,
    });
    const result = orchestrateReport(throwingInput, 'EXECUTIVE', 2);
    assert.ok(result.orchestrationError);
    assert.ok(result.orchestrationError.startsWith('ORCH-02'));
  });

  test('adapter failure → adaptedProps is null', () => {
    const throwingInput = {};
    Object.defineProperty(throwingInput, 'governance_verdict', {
      get() { throw new Error('Simulated adapter failure'); },
      enumerable: true,
    });
    const result = orchestrateReport(throwingInput, 'EXECUTIVE', 2);
    assert.strictEqual(result.adaptedProps, null);
  });
});

// ---------------------------------------------------------------------------
// No mutation
// ---------------------------------------------------------------------------

describe('No mutation of input', () => {
  test('orchestrateReport does not mutate EXECUTIVE_READY reportObject', () => {
    const snapshot = JSON.parse(JSON.stringify(CONTAINER_EXECUTIVE_READY_FIXTURE));
    orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    assert.deepStrictEqual(CONTAINER_EXECUTIVE_READY_FIXTURE, snapshot);
  });

  test('orchestrateReport does not mutate BLOCKED reportObject', () => {
    const snapshot = JSON.parse(JSON.stringify(CONTAINER_BLOCKED_FIXTURE));
    orchestrateReport(CONTAINER_BLOCKED_FIXTURE, 'EXECUTIVE', 2);
    assert.deepStrictEqual(CONTAINER_BLOCKED_FIXTURE, snapshot);
  });
});

// ---------------------------------------------------------------------------
// Governance safety — no forbidden content in adaptedProps
// ---------------------------------------------------------------------------

describe('Governance safety — no forbidden content in output', () => {
  test('no prompt field keys in EXECUTIVE_READY adaptedProps', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    const serialized = JSON.stringify(result.adaptedProps);
    FORBIDDEN_PROMPT_FIELDS.forEach(field => {
      assert.ok(
        !serialized.includes(`"${field}"`),
        `Forbidden prompt field "${field}" found in adaptedProps`
      );
    });
  });

  test('no GEIOS internal identifiers in EXECUTIVE_READY adaptedProps', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    const serialized = JSON.stringify(result.adaptedProps);
    FORBIDDEN_GEIOS_IDENTIFIERS.forEach(id => {
      assert.ok(
        !serialized.includes(id),
        `Forbidden GEIOS identifier "${id}" found in adaptedProps`
      );
    });
  });

  test('forbidden field input (prompt_input present) → BLOCKED, no prompt content leaked', () => {
    const result = orchestrateReport(INVALID_FORBIDDEN_FIELD_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.route, 'BLOCKED');
    const serialized = JSON.stringify(result.adaptedProps);
    FORBIDDEN_PROMPT_FIELDS.forEach(field => {
      assert.ok(
        !serialized.includes(`"${field}"`),
        `Forbidden prompt field "${field}" leaked into blocked adaptedProps`
      );
    });
  });

  test('no prompt_input in ADVISORY tier adaptedProps', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'ADVISORY', 2);
    const serialized = JSON.stringify(result.adaptedProps);
    assert.ok(!serialized.includes('"prompt_input"'));
  });
});

// ---------------------------------------------------------------------------
// ROUTE_TARGET_MAP completeness
// ---------------------------------------------------------------------------

describe('ROUTE_TARGET_MAP', () => {
  test('ROUTE_TARGET_MAP has all 4 expected routes', () => {
    assert.strictEqual(ROUTE_TARGET_MAP['BLOCKED'], 'BlockedReportState');
    assert.strictEqual(ROUTE_TARGET_MAP['DIAGNOSTIC_ONLY'], 'DiagnosticReportState');
    assert.strictEqual(ROUTE_TARGET_MAP['EXECUTIVE_READY'], 'ReportModuleShell');
    assert.strictEqual(ROUTE_TARGET_MAP['EXECUTIVE_READY_WITH_QUALIFIER'], 'ReportModuleShell');
  });

  test('getRouteTarget: unknown route falls back to BlockedReportState', () => {
    assert.strictEqual(getRouteTarget('UNKNOWN_STATE'), 'BlockedReportState');
    assert.strictEqual(getRouteTarget(undefined), 'BlockedReportState');
    assert.strictEqual(getRouteTarget(''), 'BlockedReportState');
  });

  test('VALID_AUDIENCE_TIERS contains EXECUTIVE, ADVISORY, AUDIT', () => {
    assert.ok(VALID_AUDIENCE_TIERS.includes('EXECUTIVE'));
    assert.ok(VALID_AUDIENCE_TIERS.includes('ADVISORY'));
    assert.ok(VALID_AUDIENCE_TIERS.includes('AUDIT'));
  });
});

// ---------------------------------------------------------------------------
// adaptedProps structure
// ---------------------------------------------------------------------------

describe('adaptedProps structure verification', () => {
  test('EXECUTIVE_READY → adaptedProps.readinessBadge not null', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    assert.ok(result.adaptedProps);
    assert.ok(result.adaptedProps.readinessBadge);
  });

  test('EXECUTIVE_READY → adaptedProps.blockedState is null', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.adaptedProps.blockedState, null);
  });

  test('BLOCKED fixture → adaptedProps.blockedState not null', () => {
    const result = orchestrateReport(CONTAINER_BLOCKED_FIXTURE, 'EXECUTIVE', 2);
    assert.ok(result.adaptedProps);
    assert.ok(result.adaptedProps.blockedState);
    assert.ok(result.adaptedProps.blockedState.blocked_headline);
  });

  test('BLOCKED → adaptedProps.readinessBadge is null', () => {
    const result = orchestrateReport(CONTAINER_BLOCKED_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.adaptedProps.readinessBadge, null);
  });

  test('DIAGNOSTIC_ONLY → adaptedProps.diagnosticState not null', () => {
    const result = orchestrateReport(CONTAINER_DIAGNOSTIC_FIXTURE, 'EXECUTIVE', 2);
    assert.ok(result.adaptedProps);
    assert.ok(result.adaptedProps.diagnosticState);
    assert.ok(result.adaptedProps.diagnosticState.diagnostic_banner_text);
  });

  test('EXECUTIVE_READY → orchestrationError is null', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(result.orchestrationError, null);
  });
});

// ---------------------------------------------------------------------------
// Audience tier routing (same report, different tiers)
// ---------------------------------------------------------------------------

describe('Audience tier handling', () => {
  test('ADVISORY tier: EXECUTIVE_READY → ReportModuleShell', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'ADVISORY', 2);
    assert.strictEqual(result.routeTarget, 'ReportModuleShell');
    assert.strictEqual(result.adaptedProps.audienceTier, 'ADVISORY');
  });

  test('AUDIT tier: EXECUTIVE_READY → ReportModuleShell', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'AUDIT', 2);
    assert.strictEqual(result.routeTarget, 'ReportModuleShell');
    assert.strictEqual(result.adaptedProps.audienceTier, 'AUDIT');
  });

  test('invalid tier defaults to EXECUTIVE', () => {
    const result = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'INVALID_TIER', 2);
    assert.strictEqual(result.adaptedProps.audienceTier, 'EXECUTIVE');
  });
});

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

describe('Determinism', () => {
  test('same EXECUTIVE_READY input → same route on repeated calls', () => {
    const r1 = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    const r2 = orchestrateReport(CONTAINER_EXECUTIVE_READY_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(r1.route, r2.route);
    assert.strictEqual(r1.routeTarget, r2.routeTarget);
  });

  test('same DIAGNOSTIC_ONLY input → same route on repeated calls', () => {
    const r1 = orchestrateReport(CONTAINER_DIAGNOSTIC_FIXTURE, 'EXECUTIVE', 2);
    const r2 = orchestrateReport(CONTAINER_DIAGNOSTIC_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(r1.route, r2.route);
    assert.strictEqual(r1.routeTarget, r2.routeTarget);
  });

  test('same BLOCKED input → same route on repeated calls', () => {
    const r1 = orchestrateReport(CONTAINER_BLOCKED_FIXTURE, 'EXECUTIVE', 2);
    const r2 = orchestrateReport(CONTAINER_BLOCKED_FIXTURE, 'EXECUTIVE', 2);
    assert.strictEqual(r1.route, r2.route);
    assert.strictEqual(r1.routeTarget, r2.routeTarget);
  });
});

'use strict';

/**
 * RenderabilityGuard.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Determines the render-safe state for a report_object based on:
 * - governance_verdict
 * - readiness_state
 * - validation errors from ReportObjectValidator and GovernanceGuard
 * - Phase 2 compatibility
 *
 * Output is one of: EXECUTIVE_READY | EXECUTIVE_READY_WITH_QUALIFIER |
 *                   DIAGNOSTIC_ONLY | BLOCKED
 *
 * Note: SUPPRESSED_FROM_EXECUTIVE is a valid readiness_state but maps to
 * DIAGNOSTIC_ONLY for rendering purposes (no executive surface rendered).
 *
 * Contract: pure function — does not mutate input, does not call AI,
 * does not call external APIs. Does not recompute readiness or qualifiers.
 */

const { makeError, RenderRoute } = require('./ValidationErrorTaxonomy');

const RenderState = {
  EXECUTIVE_READY: 'EXECUTIVE_READY',
  EXECUTIVE_READY_WITH_QUALIFIER: 'EXECUTIVE_READY_WITH_QUALIFIER',
  DIAGNOSTIC_ONLY: 'DIAGNOSTIC_ONLY',
  BLOCKED: 'BLOCKED',
};

/**
 * Conditions that always route to BLOCKED regardless of readiness_state.
 * Based on ROM-VAL-05, ROM-VAL-03, and validation error routing.
 */
const BLOCKING_ERROR_IDS = [
  'VAL-BLOCK-01',  // governance_verdict FAIL
  'VAL-BLOCK-02',  // evidence_object_hash absent
  'VAL-SCHEMA-01', // required field absent
  'VAL-SCHEMA-02', // invalid enum
  'VAL-EXPLAIN-01', // panel missing
  'VAL-EXPLAIN-02', // panel invalid
  'VAL-GOV-01',    // governance FAIL
  'VAL-GOV-02',    // forbidden field
  'VAL-RENDER-01', // state indeterminate
];

const DIAGNOSTIC_ERROR_IDS = [
  'VAL-DIAG-01',   // topology incomplete
  'VAL-DIAG-02',   // rendering_metadata incomplete
  'VAL-RENDER-02', // surface mode mismatch
];

/**
 * determineRenderState(reportObject, validationErrors, governanceErrors, explainabilityErrors)
 *
 * Determines the final render state for this report_object.
 *
 * Parameters:
 *   reportObject         — the report_object (read-only, not mutated)
 *   validationErrors     — errors from ReportObjectValidator (array)
 *   governanceErrors     — errors from GovernanceGuard (array)
 *   explainabilityErrors — errors from ExplainabilityValidator (array)
 *
 * Returns:
 * {
 *   renderState: RenderState,
 *   blockedReason: string | null,
 *   diagnosticReasons: string[],
 *   warnings: ValidationError[],
 * }
 *
 * Pure function. Does not mutate input.
 */
function determineRenderState(reportObject, validationErrors, governanceErrors, explainabilityErrors) {
  const allErrors = [
    ...(validationErrors || []),
    ...(governanceErrors || []),
    ...(explainabilityErrors || []),
  ];

  const warnings = [];
  const diagnosticReasons = [];
  let blockedReason = null;

  // Governance violation errors always block
  const governanceViolations = allErrors.filter(e => e.route === RenderRoute.GOVERNANCE_VIOLATION);
  if (governanceViolations.length > 0) {
    blockedReason = governanceViolations.map(e => `${e.id}: ${e.detail || e.message}`).join('; ');
    return { renderState: RenderState.BLOCKED, blockedReason, diagnosticReasons, warnings };
  }

  // Blocking errors
  const blockingErrors = allErrors.filter(e => BLOCKING_ERROR_IDS.includes(e.id));
  if (blockingErrors.length > 0) {
    blockedReason = blockingErrors.map(e => `${e.id}: ${e.detail || e.message}`).join('; ');
    return { renderState: RenderState.BLOCKED, blockedReason, diagnosticReasons, warnings };
  }

  // Warn-and-deactivate (phase restriction violations) — not blocking, logged as warnings
  const warnErrors = allErrors.filter(e => e.route === RenderRoute.WARN_AND_DEACTIVATE);
  warnings.push(...warnErrors);

  // Diagnostic conditions — degrade render quality but don't block
  const diagnosticErrors = allErrors.filter(e => DIAGNOSTIC_ERROR_IDS.includes(e.id));
  diagnosticErrors.forEach(e => diagnosticReasons.push(`${e.id}: ${e.detail || e.message}`));

  // No blocking errors — proceed to readiness_state routing
  if (!reportObject || typeof reportObject !== 'object') {
    return {
      renderState: RenderState.BLOCKED,
      blockedReason: 'VAL-RENDER-01: reportObject is null — render state cannot be determined',
      diagnosticReasons,
      warnings,
    };
  }

  const { readiness_state, governance_verdict } = reportObject;

  // governance_verdict FAIL always blocks (belt-and-suspenders for cases where
  // the BLOCK-01 error was filtered as a warning somewhere upstream)
  if (governance_verdict === 'FAIL') {
    return {
      renderState: RenderState.BLOCKED,
      blockedReason: 'VAL-BLOCK-01: governance_verdict is FAIL',
      diagnosticReasons,
      warnings,
    };
  }

  switch (readiness_state) {
    case 'EXECUTIVE_READY':
      return { renderState: RenderState.EXECUTIVE_READY, blockedReason: null, diagnosticReasons, warnings };

    case 'EXECUTIVE_READY_WITH_QUALIFIER':
      return { renderState: RenderState.EXECUTIVE_READY_WITH_QUALIFIER, blockedReason: null, diagnosticReasons, warnings };

    case 'DIAGNOSTIC_ONLY':
    case 'SUPPRESSED_FROM_EXECUTIVE':
      return { renderState: RenderState.DIAGNOSTIC_ONLY, blockedReason: null, diagnosticReasons, warnings };

    case 'BLOCKED_PENDING_DOMAIN_GROUNDING':
      return {
        renderState: RenderState.BLOCKED,
        blockedReason: 'VAL-BLOCK-01: readiness_state is BLOCKED_PENDING_DOMAIN_GROUNDING',
        diagnosticReasons,
        warnings,
      };

    default:
      return {
        renderState: RenderState.BLOCKED,
        blockedReason: `VAL-RENDER-01: readiness_state '${readiness_state}' cannot be mapped to a render state`,
        diagnosticReasons,
        warnings,
      };
  }
}

/**
 * isPhase2Compatible(reportObject)
 *
 * Checks that the report_object is compatible with Phase 2 rendering constraints.
 * Phase 2: only EXPAND_COLLAPSE interactions active; all panel content pre-rendered.
 * Returns { compatible: boolean, violations: string[] }
 */
function isPhase2Compatible(reportObject) {
  const violations = [];
  if (!reportObject) return { compatible: false, violations: ['reportObject is null'] };

  // Check no live AI interaction fields
  const liveAIFields = ['live_generation', 'ai_generation_request', 'copilot_payload', 'rag_retrieval_request'];
  liveAIFields.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(reportObject, field)) {
      violations.push(`Forbidden Phase-2 field: '${field}' — live AI interaction prohibited in Phase 2`);
    }
  });

  // Check interaction_registry: no phase-3+ interactions active
  const ir = reportObject.interaction_registry;
  if (ir && Array.isArray(ir.interactions)) {
    ir.interactions.forEach((interaction, i) => {
      if (interaction.interaction_type !== 'EXPAND_COLLAPSE' && interaction.active === true) {
        violations.push(`interaction_registry[${i}]: '${interaction.interaction_type}' is active — not permitted in Phase 2`);
      }
    });
  }

  return { compatible: violations.length === 0, violations };
}

module.exports = {
  determineRenderState,
  isPhase2Compatible,
  RenderState,
  BLOCKING_ERROR_IDS,
  DIAGNOSTIC_ERROR_IDS,
};

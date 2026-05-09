'use strict';

/**
 * validation/index.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * LENS Frontend Input Validation Pipeline — main entry point.
 *
 * Orchestrates the deterministic four-stage validation sequence:
 *   STAGE 1: GovernanceGuard   — forbidden fields, GEIOS vocabulary, topology mutation
 *   STAGE 2: ReportObjectValidator — required fields, schema, enum validation
 *   STAGE 3: ExplainabilityValidator — seven-panel bundle, Q-04 absence notice
 *   STAGE 4: RenderabilityGuard — final render state determination
 *
 * Contract:
 *   - Pure orchestration: each stage is a pure function
 *   - Input is never mutated
 *   - No AI calls, no external API calls
 *   - No readiness recomputation, no qualifier reinterpretation
 *   - Invalid inputs fail CLOSED (BLOCKED state, never silent degradation)
 *   - Deterministic: same report_object always produces same ValidationResult
 *
 * Usage:
 *   const { validateReportObjectPipeline } = require('./validation');
 *   const result = validateReportObjectPipeline(reportObject);
 *   // result.renderState: 'EXECUTIVE_READY' | 'EXECUTIVE_READY_WITH_QUALIFIER' |
 *   //                     'DIAGNOSTIC_ONLY' | 'BLOCKED'
 */

const { runGovernanceGuard } = require('./GovernanceGuard');
const { validateReportObject } = require('./ReportObjectValidator');
const { validateExplainabilityBundle } = require('./ExplainabilityValidator');
const { determineRenderState, isPhase2Compatible, RenderState } = require('./RenderabilityGuard');

/**
 * validateReportObjectPipeline(reportObject)
 *
 * Runs all four validation stages and returns a final ValidationResult.
 *
 * Returns:
 * {
 *   renderState: string,           — EXECUTIVE_READY | EXECUTIVE_READY_WITH_QUALIFIER | DIAGNOSTIC_ONLY | BLOCKED
 *   valid: boolean,                — true only if ALL stages pass with no errors
 *   blockedReason: string | null,  — reason if BLOCKED; null otherwise
 *   diagnosticReasons: string[],   — non-blocking degradation reasons
 *   warnings: ValidationError[],   — WARN_AND_DEACTIVATE phase restriction notices
 *   stageResults: {                — per-stage results for audit/debugging
 *     governance: GovernanceResult,
 *     schema: SchemaResult,
 *     explainability: ExplainabilityResult,
 *     phase2: Phase2Result,
 *   },
 *   allErrors: ValidationError[],  — flattened list of all errors across all stages
 * }
 *
 * Pure function. Does not mutate reportObject.
 */
function validateReportObjectPipeline(reportObject) {
  // STAGE 1: GovernanceGuard
  const governanceResult = runGovernanceGuard(reportObject);

  // STAGE 2: ReportObjectValidator
  const schemaResult = validateReportObject(reportObject);

  // STAGE 3: ExplainabilityValidator
  const qualifierClass = reportObject && reportObject.qualifier_class;
  const bundle = reportObject && reportObject.explainability_bundle;
  const explainabilityResult = validateExplainabilityBundle(bundle, qualifierClass);

  // STAGE 4: Phase 2 compatibility check
  const phase2Result = isPhase2Compatible(reportObject);

  // Collect all errors
  const allErrors = [
    ...governanceResult.errors,
    ...schemaResult.errors,
    ...explainabilityResult.errors,
  ];
  const allWarnings = [
    ...governanceResult.warnings,
    ...schemaResult.warnings,
  ];

  // Add phase2 violations as warning-level errors (WARN_AND_DEACTIVATE)
  if (!phase2Result.compatible) {
    phase2Result.violations.forEach(v => {
      allWarnings.push({
        id: 'VAL-GOV-03',
        errorClass: 'GOVERNANCE',
        message: v,
        route: 'WARN_AND_DEACTIVATE',
        detail: null,
      });
    });
  }

  // STAGE 4: RenderabilityGuard
  const renderResult = determineRenderState(
    reportObject,
    schemaResult.errors,
    governanceResult.errors,
    explainabilityResult.errors
  );

  const valid = allErrors.length === 0 && renderResult.renderState !== RenderState.BLOCKED;

  return {
    renderState: renderResult.renderState,
    valid,
    blockedReason: renderResult.blockedReason,
    diagnosticReasons: [
      ...renderResult.diagnosticReasons,
      ...(schemaResult.diagnosticReasons || []),
    ],
    warnings: [...allWarnings, ...(renderResult.warnings || [])],
    stageResults: {
      governance: governanceResult,
      schema: schemaResult,
      explainability: explainabilityResult,
      phase2: phase2Result,
    },
    allErrors,
  };
}

/**
 * isRenderBlocked(validationResult)
 * Convenience predicate for render-layer components.
 */
function isRenderBlocked(validationResult) {
  return validationResult.renderState === RenderState.BLOCKED;
}

/**
 * isRenderDiagnostic(validationResult)
 * Convenience predicate — DIAGNOSTIC_ONLY render state.
 */
function isRenderDiagnostic(validationResult) {
  return validationResult.renderState === RenderState.DIAGNOSTIC_ONLY;
}

/**
 * isExecutiveReady(validationResult)
 * Convenience predicate — either EXECUTIVE_READY or EXECUTIVE_READY_WITH_QUALIFIER.
 */
function isExecutiveReady(validationResult) {
  return (
    validationResult.renderState === RenderState.EXECUTIVE_READY ||
    validationResult.renderState === RenderState.EXECUTIVE_READY_WITH_QUALIFIER
  );
}

module.exports = {
  validateReportObjectPipeline,
  isRenderBlocked,
  isRenderDiagnostic,
  isExecutiveReady,
  RenderState,
};

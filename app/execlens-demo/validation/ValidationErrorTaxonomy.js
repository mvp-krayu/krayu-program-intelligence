'use strict';

/**
 * ValidationErrorTaxonomy.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Defines all validation error classes, error IDs, routing decisions, and
 * governance constants used by the LENS frontend validation layer.
 *
 * Rules: deterministic, no side effects, no external calls, no mutation.
 */

const ValidationErrorClass = {
  SCHEMA: 'SCHEMA',
  GOVERNANCE: 'GOVERNANCE',
  EXPLAINABILITY: 'EXPLAINABILITY',
  RENDERABILITY: 'RENDERABILITY',
  BLOCKED: 'BLOCKED',
  DIAGNOSTIC: 'DIAGNOSTIC',
};

const RenderRoute = {
  BLOCKED: 'BLOCKED',
  DIAGNOSTIC: 'DIAGNOSTIC',
  WARN_AND_DEACTIVATE: 'WARN_AND_DEACTIVATE',
  GOVERNANCE_VIOLATION: 'GOVERNANCE_VIOLATION',
  PASS: 'PASS',
};

const ValidationErrors = {
  'VAL-SCHEMA-01': {
    id: 'VAL-SCHEMA-01',
    errorClass: ValidationErrorClass.SCHEMA,
    message: 'Required field absent or malformed in report_object',
    route: RenderRoute.BLOCKED,
  },
  'VAL-SCHEMA-02': {
    id: 'VAL-SCHEMA-02',
    errorClass: ValidationErrorClass.SCHEMA,
    message: 'Invalid enum value in report_object field',
    route: RenderRoute.BLOCKED,
  },
  'VAL-GOV-01': {
    id: 'VAL-GOV-01',
    errorClass: ValidationErrorClass.GOVERNANCE,
    message: 'Governance verdict is FAIL — all intelligence modules blocked',
    route: RenderRoute.BLOCKED,
  },
  'VAL-GOV-02': {
    id: 'VAL-GOV-02',
    errorClass: ValidationErrorClass.GOVERNANCE,
    message: 'Forbidden field or vocabulary detected in report_object',
    route: RenderRoute.BLOCKED,
  },
  'VAL-GOV-03': {
    id: 'VAL-GOV-03',
    errorClass: ValidationErrorClass.GOVERNANCE,
    message: 'Phase-restricted interaction type is active — deactivating per ROM-VAL-14',
    route: RenderRoute.WARN_AND_DEACTIVATE,
  },
  'VAL-EXPLAIN-01': {
    id: 'VAL-EXPLAIN-01',
    errorClass: ValidationErrorClass.EXPLAINABILITY,
    message: 'Explainability bundle missing one or more of the seven required panels',
    route: RenderRoute.BLOCKED,
  },
  'VAL-EXPLAIN-02': {
    id: 'VAL-EXPLAIN-02',
    errorClass: ValidationErrorClass.EXPLAINABILITY,
    message: 'Panel has invalid state, panel_id, audience, or missing content_blocks',
    route: RenderRoute.BLOCKED,
  },
  'VAL-EXPLAIN-03': {
    id: 'VAL-EXPLAIN-03',
    errorClass: ValidationErrorClass.EXPLAINABILITY,
    message: 'Q-04 qualifier requires explicit absence notice — silent suppression detected',
    route: RenderRoute.GOVERNANCE_VIOLATION,
  },
  'VAL-RENDER-01': {
    id: 'VAL-RENDER-01',
    errorClass: ValidationErrorClass.RENDERABILITY,
    message: 'Render state cannot be determined from report_object fields',
    route: RenderRoute.BLOCKED,
  },
  'VAL-RENDER-02': {
    id: 'VAL-RENDER-02',
    errorClass: ValidationErrorClass.RENDERABILITY,
    message: 'Surface mode and readiness_state are inconsistent in rendering_metadata',
    route: RenderRoute.DIAGNOSTIC,
  },
  'VAL-BLOCK-01': {
    id: 'VAL-BLOCK-01',
    errorClass: ValidationErrorClass.BLOCKED,
    message: 'Governance verdict FAIL — report enters BLOCKED render state per ROM-VAL-05',
    route: RenderRoute.BLOCKED,
  },
  'VAL-BLOCK-02': {
    id: 'VAL-BLOCK-02',
    errorClass: ValidationErrorClass.BLOCKED,
    message: 'Evidence object hash absent — report enters BLOCKED render state per ROM-VAL-03',
    route: RenderRoute.BLOCKED,
  },
  'VAL-DIAG-01': {
    id: 'VAL-DIAG-01',
    errorClass: ValidationErrorClass.DIAGNOSTIC,
    message: 'Topology scope metadata incomplete — scope indicator degraded per ROM-VAL-08',
    route: RenderRoute.DIAGNOSTIC,
  },
  'VAL-DIAG-02': {
    id: 'VAL-DIAG-02',
    errorClass: ValidationErrorClass.DIAGNOSTIC,
    message: 'Rendering metadata incomplete — provenance tracking degraded per ROM-VAL-15',
    route: RenderRoute.DIAGNOSTIC,
  },
};

const REQUIRED_PANEL_IDS = [
  'WHY',
  'EVIDENCE',
  'TRACE',
  'QUALIFIERS',
  'LINEAGE',
  'CONFIDENCE',
  'READINESS_STATE',
];

const VALID_READINESS_STATES = [
  'EXECUTIVE_READY',
  'EXECUTIVE_READY_WITH_QUALIFIER',
  'DIAGNOSTIC_ONLY',
  'SUPPRESSED_FROM_EXECUTIVE',
  'BLOCKED_PENDING_DOMAIN_GROUNDING',
];

const VALID_QUALIFIER_CLASSES = ['Q-00', 'Q-01', 'Q-02', 'Q-03', 'Q-04'];

const VALID_GOVERNANCE_VERDICTS = ['PASS', 'FAIL'];

const VALID_AUDIENCES = ['EXECUTIVE', 'ADVISORY', 'AUDIT'];

const VALID_PANEL_IDS = [
  'WHY',
  'EVIDENCE',
  'TRACE',
  'QUALIFIERS',
  'LINEAGE',
  'CONFIDENCE',
  'READINESS_STATE',
];

const VALID_PROPAGATION_ROLES = ['ORIGIN', 'RECEIVER', 'PASS_THROUGH', 'ISOLATED'];

const VALID_PRESSURE_TIERS = ['HIGH', 'ELEVATED', 'MODERATE', 'LOW'];

const FORBIDDEN_FIELDS = [
  'prompt_input',
  'ai_response',
  'llm_output',
  'vector_result',
  'rag_payload',
  'orchestration_payload',
  'topology_mutations',
  'topology_update_request',
  'agent_output',
  'model_output',
  'completion',
  'generation_result',
  'live_generation',
  'copilot_payload',
];

const PHASE_2_PERMITTED_INTERACTIONS = ['EXPAND_COLLAPSE'];

function makeError(errorId, detail) {
  const template = ValidationErrors[errorId];
  if (!template) throw new Error(`Unknown validation error ID: ${errorId}`);
  return {
    id: template.id,
    errorClass: template.errorClass,
    message: template.message,
    route: template.route,
    detail: detail || null,
  };
}

module.exports = {
  ValidationErrorClass,
  RenderRoute,
  ValidationErrors,
  REQUIRED_PANEL_IDS,
  VALID_READINESS_STATES,
  VALID_QUALIFIER_CLASSES,
  VALID_GOVERNANCE_VERDICTS,
  VALID_AUDIENCES,
  VALID_PANEL_IDS,
  VALID_PROPAGATION_ROLES,
  VALID_PRESSURE_TIERS,
  FORBIDDEN_FIELDS,
  PHASE_2_PERMITTED_INTERACTIONS,
  makeError,
};

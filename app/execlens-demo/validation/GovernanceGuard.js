'use strict';

/**
 * GovernanceGuard.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Guards the LENS frontend against forbidden fields and governance violations
 * in the report_object. Enforces:
 *   - No GEIOS internal fields exposed (ROM-VAL-16)
 *   - No prompt interaction fields
 *   - No AI/LLM response fields
 *   - No topology mutation fields
 *   - No forbidden vocabulary categories A-G in rendered text fields
 *
 * Contract: pure function — does not mutate input, does not call AI,
 * does not call external APIs.
 */

const { makeError, FORBIDDEN_FIELDS } = require('./ValidationErrorTaxonomy');

/**
 * Forbidden GEIOS internal identifiers that must never appear in
 * any field of the report_object (extended list from executive_vocabulary_contract.json).
 */
const FORBIDDEN_GEIOS_IDENTIFIERS = [
  'TAXONOMY-01',
  'signal_value',
  'activation_state',
  'signal_stable_key',
  'GEIOS', 'GEIOS substrate', 'GEIOS architecture',
  'AS-01', 'N-SAF-01', 'E-SAF-01', 'C-SAF-01', 'ES-01', 'OS-01',
  'DPSIG', 'EXSIG', 'ORGSIG', 'FLOWSIG', 'RISKSIG', 'TIMSIG', 'RUNSIG', 'OPSIG',
  'canonical_topology.json',
  'governed-dpsig-baseline-v1',
  'Lane A', 'Lane B', 'Lane C', 'Lane D',
];

/**
 * Forbidden AI/LLM vocabulary that must not appear in executive text surfaces.
 * Subset of vocabulary_contract.json category_B.
 */
const FORBIDDEN_AI_VOCABULARY = [
  'llm_output',
  'rag_payload',
  'vector_result',
  'embedding',
  'similarity_score',
  'orchestration_payload',
  'agent_output',
  'model_output',
  'prompt_input',
  'ai_response',
  'copilot_payload',
];

/**
 * Checks a flat object for any forbidden top-level field keys.
 * Returns an array of error objects.
 */
function checkForbiddenTopLevelFields(obj) {
  const errors = [];
  if (!obj || typeof obj !== 'object') return errors;

  FORBIDDEN_FIELDS.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      errors.push(makeError('VAL-GOV-02', `Forbidden field '${field}' detected in report_object — must not be present`));
    }
  });

  return errors;
}

/**
 * Checks a text string for forbidden GEIOS identifiers.
 * Used for narrative text fields that will be rendered in the executive surface.
 * Returns array of violations (each is a forbidden string found).
 */
function scanTextForForbiddenIdentifiers(text, fieldPath) {
  const violations = [];
  if (typeof text !== 'string') return violations;

  FORBIDDEN_GEIOS_IDENTIFIERS.forEach(identifier => {
    if (text.includes(identifier)) {
      violations.push({ fieldPath, forbidden: identifier });
    }
  });

  FORBIDDEN_AI_VOCABULARY.forEach(term => {
    if (text.toLowerCase().includes(term.toLowerCase())) {
      violations.push({ fieldPath, forbidden: term });
    }
  });

  return violations;
}

/**
 * Checks narrative_block text fields for forbidden vocabulary.
 * LENS must not render GEIOS internal identifiers in the executive surface.
 * Returns array of errors.
 */
function validateNarrativeVocabulary(narrativeBlock) {
  const errors = [];
  if (!narrativeBlock || typeof narrativeBlock !== 'object') return errors;

  const textFields = [
    ['executive_summary', narrativeBlock.executive_summary],
    ['why_section', narrativeBlock.why_section],
    ['structural_summary', narrativeBlock.structural_summary],
  ];

  textFields.forEach(([fieldName, text]) => {
    const violations = scanTextForForbiddenIdentifiers(text, `narrative_block.${fieldName}`);
    violations.forEach(v => {
      errors.push(makeError('VAL-GOV-02',
        `narrative_block.${v.fieldPath}: forbidden identifier '${v.forbidden}' detected — GEIOS internals must not appear in executive surface`));
    });
  });

  return errors;
}

/**
 * Checks topology_scope for mutation attempt fields.
 * topology_scope is display-only metadata — no mutation fields permitted.
 */
function checkTopologyMutationFields(topologyScope) {
  const errors = [];
  if (!topologyScope || typeof topologyScope !== 'object') return errors;

  const mutationFields = [
    'update_request', 'mutation', 'write_request', 'topology_update',
    'edit_payload', 'cluster_edit', 'domain_edit',
  ];

  mutationFields.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(topologyScope, field)) {
      errors.push(makeError('VAL-GOV-02',
        `topology_scope.${field}: topology mutation field detected — topology is READ-ONLY in LENS (ROM-VAL-19)`));
    }
  });

  if (Array.isArray(topologyScope.mutations) && topologyScope.mutations.length > 0) {
    errors.push(makeError('VAL-GOV-02', 'topology_scope.mutations: topology mutation payload detected — prohibited'));
  }

  return errors;
}

/**
 * Checks interaction_registry for forbidden interaction types.
 * Phase 2: only EXPAND_COLLAPSE may be active.
 */
function checkInteractionGovernance(interactionRegistry) {
  const errors = [];
  if (!interactionRegistry || !Array.isArray(interactionRegistry.interactions)) return errors;

  const FORBIDDEN_ACTIVE_TYPES_PHASE2 = ['COPILOT_ENTRY', 'INVESTIGATION_ENTRY'];

  interactionRegistry.interactions.forEach((interaction, i) => {
    if (FORBIDDEN_ACTIVE_TYPES_PHASE2.includes(interaction.interaction_type) && interaction.active === true) {
      errors.push(makeError('VAL-GOV-03',
        `interaction_registry[${i}].interaction_type '${interaction.interaction_type}' is active — forbidden in Phase 2 (phase gate not cleared)`));
    }
  });

  return errors;
}

/**
 * runGovernanceGuard(reportObject)
 *
 * Runs all governance checks on the report_object.
 * Returns:
 * {
 *   passed: boolean,
 *   errors: ValidationError[],
 *   warnings: ValidationError[],
 * }
 *
 * Pure function. Does not mutate reportObject.
 * Does not call AI or external APIs.
 */
function runGovernanceGuard(reportObject) {
  const errors = [];
  const warnings = [];

  if (!reportObject || typeof reportObject !== 'object') {
    errors.push(makeError('VAL-GOV-02', 'reportObject is null — governance guard cannot run'));
    return { passed: false, errors, warnings };
  }

  // Check forbidden top-level fields
  errors.push(...checkForbiddenTopLevelFields(reportObject));

  // Check narrative vocabulary for GEIOS identifiers
  errors.push(...validateNarrativeVocabulary(reportObject.narrative_block));

  // Check topology mutation fields
  errors.push(...checkTopologyMutationFields(reportObject.topology_scope));

  // Check interaction governance (Phase 2 enforcement)
  const interactionErrors = checkInteractionGovernance(reportObject.interaction_registry);
  // Phase restriction violations are warnings (WARN_AND_DEACTIVATE) not hard blocks
  warnings.push(...interactionErrors.filter(e => e.route === 'WARN_AND_DEACTIVATE'));
  errors.push(...interactionErrors.filter(e => e.route !== 'WARN_AND_DEACTIVATE'));

  const passed = errors.length === 0;
  return { passed, errors, warnings };
}

module.exports = {
  runGovernanceGuard,
  checkForbiddenTopLevelFields,
  validateNarrativeVocabulary,
  checkTopologyMutationFields,
  checkInteractionGovernance,
  scanTextForForbiddenIdentifiers,
  FORBIDDEN_GEIOS_IDENTIFIERS,
  FORBIDDEN_AI_VOCABULARY,
};

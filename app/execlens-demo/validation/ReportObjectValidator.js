'use strict';

/**
 * ReportObjectValidator.js
 * PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01
 *
 * Validates the structure, required fields, and enum values of a report_object
 * before it is passed to the rendering adapter layer.
 *
 * Contract: pure function — does not mutate input, does not call AI, does not
 * call external APIs, does not recompute readiness or qualifiers.
 *
 * Based on: ROM-VAL-01..ROM-VAL-20 (report_object_validation_rules.json)
 */

const {
  makeError,
  VALID_READINESS_STATES,
  VALID_QUALIFIER_CLASSES,
  VALID_GOVERNANCE_VERDICTS,
  VALID_PROPAGATION_ROLES,
  VALID_PRESSURE_TIERS,
  PHASE_2_PERMITTED_INTERACTIONS,
} = require('./ValidationErrorTaxonomy');

/**
 * Validates a single EvidenceBlock entry.
 * Returns an array of errors (empty = valid).
 * Pure function.
 */
function validateEvidenceBlock(block, index) {
  const errors = [];
  if (!block || typeof block !== 'object') {
    errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}] is not an object`));
    return errors;
  }
  if (!block.domain_alias || typeof block.domain_alias !== 'string') {
    errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}].domain_alias absent`));
  }
  if (!VALID_QUALIFIER_CLASSES.includes(block.grounding_status)) {
    errors.push(makeError('VAL-SCHEMA-02', `evidence_blocks[${index}].grounding_status invalid`));
  }
  if (!block.grounding_label || typeof block.grounding_label !== 'string') {
    errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}].grounding_label absent`));
  }
  if (!Array.isArray(block.signal_cards)) {
    errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}].signal_cards absent`));
  } else {
    block.signal_cards.forEach((card, ci) => {
      if (!card.signal_label) errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}].signal_cards[${ci}].signal_label absent`));
      if (!card.pressure_label) errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}].signal_cards[${ci}].pressure_label absent`));
      if (!VALID_PRESSURE_TIERS.includes(card.pressure_tier)) {
        errors.push(makeError('VAL-SCHEMA-02', `evidence_blocks[${index}].signal_cards[${ci}].pressure_tier invalid`));
      }
      if (typeof card.qualifier_label !== 'string') {
        errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}].signal_cards[${ci}].qualifier_label must be string (empty for Q-00)`));
      }
      if (!card.evidence_text) errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}].signal_cards[${ci}].evidence_text absent`));
    });
  }
  if (!block.evidence_description || typeof block.evidence_description !== 'string') {
    errors.push(makeError('VAL-SCHEMA-01', `evidence_blocks[${index}].evidence_description absent`));
  }
  if (!VALID_PROPAGATION_ROLES.includes(block.propagation_role)) {
    errors.push(makeError('VAL-SCHEMA-02', `evidence_blocks[${index}].propagation_role invalid`));
  }
  return errors;
}

/**
 * Validates a single ModuleRegistryEntry.
 * Returns array of errors.
 */
function validateModuleRegistryEntry(entry, index) {
  const errors = [];
  if (!entry || typeof entry !== 'object') {
    errors.push(makeError('VAL-SCHEMA-01', `module_registry.entries[${index}] is not an object`));
    return errors;
  }
  ['module_id', 'module_type', 'report_id', 'evidence_ref', 'registered_at'].forEach(field => {
    if (!entry[field]) {
      errors.push(makeError('VAL-SCHEMA-01', `module_registry.entries[${index}].${field} absent`));
    }
  });
  if (typeof entry.active !== 'boolean') {
    errors.push(makeError('VAL-SCHEMA-01', `module_registry.entries[${index}].active must be boolean`));
  }
  if (typeof entry.phase_gate !== 'number') {
    errors.push(makeError('VAL-SCHEMA-01', `module_registry.entries[${index}].phase_gate must be number`));
  }
  return errors;
}

/**
 * validateReportObject(reportObject)
 *
 * Primary validation function. Returns a ValidationResult object:
 * {
 *   valid: boolean,
 *   errors: Array<ValidationError>,
 *   warnings: Array<ValidationError>,
 *   diagnosticReasons: string[],
 *   blockedReasons: string[],
 * }
 *
 * Pure function. Does not mutate reportObject.
 * Does not recompute readiness, qualifiers, or normalization.
 * Does not call AI services or external APIs.
 */
function validateReportObject(reportObject) {
  const errors = [];
  const warnings = [];

  if (!reportObject || typeof reportObject !== 'object' || Array.isArray(reportObject)) {
    errors.push(makeError('VAL-SCHEMA-01', 'report_object is null, undefined, or not an object'));
    return buildResult(errors, warnings);
  }

  // ROM-VAL-01: report_id
  if (!reportObject.report_id || typeof reportObject.report_id !== 'string') {
    errors.push(makeError('VAL-SCHEMA-01', 'report_id absent or not a string'));
  }

  // ROM-VAL-02: baseline_ref
  if (!reportObject.baseline_ref || typeof reportObject.baseline_ref !== 'string') {
    errors.push(makeError('VAL-SCHEMA-01', 'baseline_ref absent or not a string'));
  }

  // ROM-VAL-03: evidence_object_hash
  if (!reportObject.evidence_object_hash || typeof reportObject.evidence_object_hash !== 'string') {
    errors.push(makeError('VAL-BLOCK-02', 'evidence_object_hash absent — evidence seal missing'));
  }

  // ROM-VAL-04: derivation_hash
  if (!reportObject.derivation_hash || typeof reportObject.derivation_hash !== 'string') {
    errors.push(makeError('VAL-SCHEMA-01', 'derivation_hash absent'));
  }

  // ROM-VAL-05: governance_verdict
  if (!VALID_GOVERNANCE_VERDICTS.includes(reportObject.governance_verdict)) {
    errors.push(makeError('VAL-SCHEMA-02', `governance_verdict invalid or absent — got: ${reportObject.governance_verdict}`));
  } else if (reportObject.governance_verdict === 'FAIL') {
    errors.push(makeError('VAL-BLOCK-01', 'governance_verdict is FAIL — BLOCKED state triggered'));
  }

  // ROM-VAL-06: readiness_state
  if (!VALID_READINESS_STATES.includes(reportObject.readiness_state)) {
    errors.push(makeError('VAL-SCHEMA-02', `readiness_state invalid or absent — got: ${reportObject.readiness_state}`));
  }

  // ROM-VAL-07: qualifier_class
  if (!VALID_QUALIFIER_CLASSES.includes(reportObject.qualifier_class)) {
    errors.push(makeError('VAL-SCHEMA-02', `qualifier_class invalid or absent — got: ${reportObject.qualifier_class}`));
  }

  // ROM-VAL-08: topology_scope (DIAGNOSTIC on failure)
  const ts = reportObject.topology_scope;
  if (!ts || typeof ts !== 'object' ||
      typeof ts.domain_count !== 'number' ||
      typeof ts.cluster_count !== 'number' ||
      typeof ts.grounded_domain_count !== 'number' ||
      !ts.grounding_label) {
    warnings.push(makeError('VAL-DIAG-01', 'topology_scope incomplete or malformed'));
  }

  // ROM-VAL-09: narrative_block
  const nb = reportObject.narrative_block;
  if (!nb || typeof nb !== 'object' ||
      !nb.executive_summary || !nb.why_section || !nb.structural_summary) {
    errors.push(makeError('VAL-SCHEMA-01', 'narrative_block absent or incomplete — executive_summary, why_section, structural_summary all required'));
  }

  // ROM-VAL-10: evidence_blocks
  if (!Array.isArray(reportObject.evidence_blocks) || reportObject.evidence_blocks.length === 0) {
    errors.push(makeError('VAL-SCHEMA-01', 'evidence_blocks absent or empty array'));
  } else {
    reportObject.evidence_blocks.forEach((block, i) => {
      const blockErrors = validateEvidenceBlock(block, i);
      errors.push(...blockErrors);
    });
  }

  // ROM-VAL-11: trace_block (DIAGNOSTIC on failure)
  const tb = reportObject.trace_block;
  if (!tb || typeof tb !== 'object' ||
      !Array.isArray(tb.propagation_path) ||
      !tb.propagation_summary ||
      !tb.derivation_lineage_ref ||
      !tb.baseline_ref) {
    warnings.push(makeError('VAL-DIAG-01', 'trace_block absent or incomplete — trace panel will render degraded'));
  }

  // ROM-VAL-12: explainability_bundle — delegated to ExplainabilityValidator
  // (caller must pass errors from ExplainabilityValidator)
  if (!reportObject.explainability_bundle || typeof reportObject.explainability_bundle !== 'object') {
    errors.push(makeError('VAL-EXPLAIN-01', 'explainability_bundle absent'));
  }

  // ROM-VAL-13: module_registry
  const mr = reportObject.module_registry;
  if (!mr || !Array.isArray(mr.entries) || mr.entries.length === 0) {
    errors.push(makeError('VAL-SCHEMA-01', 'module_registry absent or entries empty'));
  } else {
    mr.entries.forEach((entry, i) => {
      const entryErrors = validateModuleRegistryEntry(entry, i);
      errors.push(...entryErrors);
    });
  }

  // ROM-VAL-14: interaction_registry phase restrictions (Phase 2)
  const ir = reportObject.interaction_registry;
  if (ir && Array.isArray(ir.interactions)) {
    ir.interactions.forEach((interaction, i) => {
      if (interaction.active === true &&
          !PHASE_2_PERMITTED_INTERACTIONS.includes(interaction.interaction_type)) {
        warnings.push(makeError('VAL-GOV-03',
          `interaction_registry[${i}].interaction_type '${interaction.interaction_type}' is active but not permitted in Phase 2`));
      }
    });
  }

  // ROM-VAL-15: rendering_metadata (DIAGNOSTIC on failure)
  const rm = reportObject.rendering_metadata;
  if (!rm || typeof rm !== 'object' ||
      !rm.normalization_version ||
      !rm.surface_mode ||
      !rm.rendered_at ||
      !rm.lens_version) {
    warnings.push(makeError('VAL-DIAG-02', 'rendering_metadata absent or incomplete'));
  }

  // header_block structure check
  if (!reportObject.header_block || typeof reportObject.header_block !== 'object') {
    errors.push(makeError('VAL-SCHEMA-01', 'header_block absent'));
  } else {
    const hb = reportObject.header_block;
    if (!hb.readiness_badge || !hb.readiness_badge.state_label || !hb.readiness_badge.color_token) {
      errors.push(makeError('VAL-SCHEMA-01', 'header_block.readiness_badge incomplete — state_label and color_token required'));
    }
    if (typeof hb.readiness_badge?.qualifier_label !== 'string') {
      errors.push(makeError('VAL-SCHEMA-01', 'header_block.readiness_badge.qualifier_label must be string (empty string for Q-00, never null)'));
    }
    if (!hb.scope_indicator || !hb.scope_indicator.domain_label || !hb.scope_indicator.grounding_label) {
      errors.push(makeError('VAL-SCHEMA-01', 'header_block.scope_indicator incomplete'));
    }
    if (!hb.report_metadata || !hb.report_metadata.report_id || !hb.report_metadata.generated_at) {
      errors.push(makeError('VAL-SCHEMA-01', 'header_block.report_metadata incomplete'));
    }
  }

  // stream_ref and generated_at
  if (!reportObject.stream_ref || typeof reportObject.stream_ref !== 'string') {
    errors.push(makeError('VAL-SCHEMA-01', 'stream_ref absent'));
  }
  if (!reportObject.generated_at || typeof reportObject.generated_at !== 'string') {
    errors.push(makeError('VAL-SCHEMA-01', 'generated_at absent'));
  }

  // trace_linkage
  if (!reportObject.trace_linkage || typeof reportObject.trace_linkage !== 'object') {
    errors.push(makeError('VAL-SCHEMA-01', 'trace_linkage absent'));
  } else {
    const tl = reportObject.trace_linkage;
    ['evidence_object_hash', 'derivation_hash', 'baseline_anchor', 'stream_anchor', 'run_id'].forEach(field => {
      if (!tl[field]) {
        errors.push(makeError('VAL-SCHEMA-01', `trace_linkage.${field} absent`));
      }
    });
  }

  return buildResult(errors, warnings);
}

function buildResult(errors, warnings) {
  const blockedReasons = [
    ...errors.filter(e => e.route === 'BLOCKED').map(e => `${e.id}: ${e.detail || e.message}`),
  ];
  const diagnosticReasons = [
    ...warnings.filter(w => w.route === 'DIAGNOSTIC').map(w => `${w.id}: ${w.detail || w.message}`),
  ];
  const hasBlockingError = errors.some(e => e.route === 'BLOCKED' || e.route === 'GOVERNANCE_VIOLATION');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    blockedReasons,
    diagnosticReasons,
    hasBlockingError,
  };
}

module.exports = {
  validateReportObject,
  validateEvidenceBlock,
  validateModuleRegistryEntry,
};

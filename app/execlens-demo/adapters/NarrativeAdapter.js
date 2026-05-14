'use strict';

/**
 * NarrativeAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Pass-through adapter for narrative_block fields.
 * ALI-01..07 normalization was applied at GEIOS generation time — never re-applied here.
 * Text is extracted and shaped for component props; never generated or rewritten.
 *
 * Contract: pure function — no mutation, no text generation, no normalization.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

/**
 * adaptNarrative(reportObject)
 *
 * Extracts narrative_block fields and qualifier_notice for display.
 * If any field is absent, the affected section enters diagnostic mode.
 *
 * Returns:
 * {
 *   executive_summary: string | null,
 *   why_primary_statement: string | null,
 *   structural_summary: string | null,
 *   qualifier_notice: string | null,    — pre-rendered from explainability_bundle.why_panel if Q active
 *   diagnosticFields: string[],         — fields that are missing (diagnostic, not blocked)
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Does not mutate reportObject. Does not generate text.
 */
function adaptNarrative(reportObject) {
  if (!reportObject || typeof reportObject !== 'object') {
    return _narrativeDiagnostic(['executive_summary', 'why_primary_statement', 'structural_summary'],
      'reportObject is null');
  }

  const nb = reportObject.narrative_block;
  const diagnosticFields = [];

  const executive_summary = _extractText(nb, 'executive_summary', diagnosticFields);
  const why_primary_statement = _extractText(nb, 'why_section', diagnosticFields);
  const structural_summary = _extractText(nb, 'structural_summary', diagnosticFields);

  // qualifier_notice sourced from pre-rendered WHY panel content (never generated)
  const qualifier_notice = _extractQualifierNotice(reportObject);

  const error = diagnosticFields.length > 0
    ? makeAdapterError('ADAPT-NARR-01', `Narrative fields absent: ${diagnosticFields.join(', ')}`)
    : null;

  return {
    executive_summary,
    why_primary_statement,
    structural_summary,
    qualifier_notice,
    diagnosticFields,
    error,
  };
}

function _extractText(narrativeBlock, fieldName, diagnosticFields) {
  if (!narrativeBlock || typeof narrativeBlock !== 'object') {
    diagnosticFields.push(fieldName);
    return null;
  }
  const value = narrativeBlock[fieldName];
  if (!value || typeof value !== 'string') {
    diagnosticFields.push(fieldName);
    return null;
  }
  return value;
}

function _extractQualifierNotice(reportObject) {
  // qualifier_notice is sourced from the pre-rendered WHY explainability panel
  // (it was placed there at generation time). Never generated at adapter time.
  try {
    const bundle = reportObject.explainability_bundle;
    if (!bundle || !bundle.why_panel) return null;
    const whyBlocks = bundle.why_panel.content_blocks;
    if (!Array.isArray(whyBlocks)) return null;
    // Find a content block with a qualifier_ref set
    const qualifierBlock = whyBlocks.find(
      b => b.qualifier_ref && typeof b.content === 'string'
    );
    return qualifierBlock ? qualifierBlock.content : null;
  } catch (_) {
    return null;
  }
}

function _narrativeDiagnostic(fields, detail) {
  return {
    executive_summary: null,
    why_primary_statement: null,
    structural_summary: null,
    qualifier_notice: null,
    diagnosticFields: fields,
    error: makeAdapterError('ADAPT-NARR-01', detail),
  };
}

module.exports = { adaptNarrative };

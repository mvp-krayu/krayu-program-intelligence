'use strict';

/**
 * TracePanelAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts trace_block and trace_linkage into TracePanel display props.
 * Applies audience-tier hash visibility rules:
 *   EXECUTIVE: no hash in output
 *   ADVISORY:  abbreviated hash (8 chars + "...")
 *   AUDIT:     abbreviated hash (hash is never fully decoded or explained)
 *
 * Contract: pure function — TAXONOMY-01 raw fields must never appear in output.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

/**
 * adaptTracePanel(reportObject, audienceTier)
 *
 * Returns:
 * {
 *   propagation_path: string[],           — aliases only (ALI-04 pre-applied)
 *   propagation_summary: string,
 *   baseline_ref_label: string,
 *   stream_ref_label: string | null,      — Advisory+ only
 *   derivation_ref_abbreviated: string | null, — Advisory+ abbreviated hash
 *   default_collapsed: boolean,           — true for EXECUTIVE tier
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Does not mutate reportObject.
 */
function adaptTracePanel(reportObject, audienceTier) {
  if (!reportObject || typeof reportObject !== 'object') {
    return _traceDiagnostic('reportObject is null');
  }

  const tb = reportObject.trace_block;
  if (!tb || typeof tb !== 'object' || !Array.isArray(tb.propagation_path)) {
    return _traceDiagnostic('trace_block absent or propagation_path missing');
  }

  const propagation_path = tb.propagation_path.slice();   // copy, no mutation
  const propagation_summary = (typeof tb.propagation_summary === 'string')
    ? tb.propagation_summary : '';
  const baseline_ref_label = (typeof tb.baseline_ref === 'string')
    ? tb.baseline_ref : '';

  // Audience-tier hash visibility (EXP-TRACE-03 / AuditLineage rules)
  const isAdvisoryOrAbove = audienceTier === 'ADVISORY' || audienceTier === 'AUDIT';

  const stream_ref_label = isAdvisoryOrAbove && tb.derivation_lineage_ref
    ? tb.derivation_lineage_ref
    : null;

  // Derivation hash: abbreviated for Advisory/Audit; never decoded; never for Executive
  const derivation_ref_abbreviated = isAdvisoryOrAbove && reportObject.derivation_hash
    ? _abbreviateHash(reportObject.derivation_hash)
    : null;

  // Executive tier: collapsed by default per EXP-TRACE-01
  const default_collapsed = audienceTier === 'EXECUTIVE';

  return {
    propagation_path,
    propagation_summary,
    baseline_ref_label,
    stream_ref_label,
    derivation_ref_abbreviated,
    default_collapsed,
    error: null,
  };
}

// 8 chars + "..." per adapter plan §2.9
function _abbreviateHash(hash) {
  if (!hash || typeof hash !== 'string') return null;
  return hash.length > 8 ? `${hash.slice(0, 8)}...` : hash;
}

function _traceDiagnostic(detail) {
  return {
    propagation_path: [],
    propagation_summary: '',
    baseline_ref_label: '',
    stream_ref_label: null,
    derivation_ref_abbreviated: null,
    default_collapsed: true,
    error: makeAdapterError('ADAPT-TRACE-01', detail),
  };
}

module.exports = { adaptTracePanel };

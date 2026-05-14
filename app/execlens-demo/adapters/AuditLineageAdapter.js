'use strict';

/**
 * AuditLineageAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts trace_linkage and rendering_metadata into audit/advisory display props.
 * Audience tier controls hash visibility:
 *   EXECUTIVE: lineage not included
 *   ADVISORY:  abbreviated evidence hash (8 chars + "..."); stream anchor as label
 *   AUDIT:     abbreviated evidence hash; full stream anchor; run_id included
 *
 * Hash values are never decoded or explained. Never expose to executive tier.
 *
 * Contract: pure function — no GEIOS internal exposure, no cross-tier leakage.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

/**
 * adaptAuditLineage(reportObject, audienceTier)
 *
 * Returns:
 * {
 *   baseline_anchor_label: string | null,
 *   evidence_hash_display: string | null,
 *   stream_anchor_display: string | null,
 *   run_id: string | null,               — AUDIT tier only
 *   generated_at: string | null,
 *   visible_for_tier: boolean,           — false for EXECUTIVE
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Does not mutate reportObject.
 */
function adaptAuditLineage(reportObject, audienceTier) {
  // Executive tier: lineage is not included in output
  if (!audienceTier || audienceTier === 'EXECUTIVE') {
    return {
      baseline_anchor_label: null,
      evidence_hash_display: null,
      stream_anchor_display: null,
      run_id: null,
      generated_at: null,
      visible_for_tier: false,
      error: null,
    };
  }

  if (!reportObject || typeof reportObject !== 'object') {
    return _lineageDiagnostic(audienceTier, 'reportObject is null');
  }

  const tl = reportObject.trace_linkage;
  const rm = reportObject.rendering_metadata;

  if (!tl || typeof tl !== 'object') {
    return _lineageDiagnostic(audienceTier, 'trace_linkage absent');
  }

  const isAudit = audienceTier === 'AUDIT';

  const baseline_anchor_label = tl.baseline_anchor || null;

  // Evidence hash: abbreviated for both Advisory and Audit — never full hash
  const evidence_hash_display = tl.evidence_object_hash
    ? _abbreviateHash(tl.evidence_object_hash)
    : null;

  // Stream anchor: both tiers get the value as a reference label
  const stream_anchor_display = tl.stream_anchor || null;

  // run_id: AUDIT only
  const run_id = isAudit ? (tl.run_id || null) : null;

  // generated_at from rendering_metadata
  const generated_at = (rm && rm.rendered_at) ? rm.rendered_at : null;

  return {
    baseline_anchor_label,
    evidence_hash_display,
    stream_anchor_display,
    run_id,
    generated_at,
    visible_for_tier: true,
    error: null,
  };
}

function _abbreviateHash(hash) {
  if (!hash || typeof hash !== 'string') return null;
  return hash.length > 8 ? `${hash.slice(0, 8)}...` : hash;
}

function _lineageDiagnostic(audienceTier, detail) {
  return {
    baseline_anchor_label: null,
    evidence_hash_display: null,
    stream_anchor_display: null,
    run_id: null,
    generated_at: null,
    visible_for_tier: audienceTier !== 'EXECUTIVE',
    error: makeAdapterError('ADAPT-TRACE-01', `AuditLineage: ${detail}`),
  };
}

module.exports = { adaptAuditLineage };

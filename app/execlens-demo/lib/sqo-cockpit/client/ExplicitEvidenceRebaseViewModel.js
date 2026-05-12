'use strict';

function buildExplicitEvidenceRebaseViewModel(data) {
  if (!data || !data.ok) {
    return {
      available: false,
      error: data ? data.error : 'NO_DATA',
    };
  }

  const evidenceItems = (data.manifest && data.manifest.evidence_items || []).map(item => ({
    evidence_id: item.evidence_id || '',
    filename: item.filename || '',
    source_type: item.source_type || '',
    evidence_hash: item.evidence_hash
      ? item.evidence_hash.slice(0, 16) + '...'
      : null,
    evidence_hash_full: item.evidence_hash || null,
    byte_size: item.byte_size || 0,
    operator_provided: item.operator_provided || false,
    source_class: item.source_class || '',
  }));

  const evaluations = (data.evaluations || []).map(evaluation => ({
    candidate_id: evaluation.candidate_id || '',
    evidence_id: evaluation.evidence_id || '',
    extracted_label: evaluation.extracted_label || '',
    candidate_type: evaluation.candidate_type || '',
    candidate_domain: evaluation.candidate_domain || '',
    admissibility_state: evaluation.admissibility_state || '',
    structural_compatibility: evaluation.structural_compatibility || '',
    confidence_class: evaluation.confidence_class || '',
    admissibility_reason: evaluation.admissibility_reason || '',
    required_next_step: evaluation.required_next_step || '',
    source_hash: evaluation.source_hash
      ? evaluation.source_hash.slice(0, 16) + '...'
      : null,
    is_admissible: evaluation.admissibility_state === 'ADMISSIBLE',
    is_quarantined: evaluation.admissibility_state === 'QUARANTINED',
    is_rejected: evaluation.admissibility_state === 'REJECTED',
  }));

  return {
    available: true,
    client: data.client || '',
    run_id: data.run_id || '',
    evidence_set_id: data.evidence_set_id || '',
    source_status: data.source_status || '',
    previous_chain_status: data.previous_chain_status || '',
    is_upstream_bound: data.source_status === 'UPSTREAM_EVIDENCE_BOUND',
    is_previous_non_authoritative: data.previous_chain_status === 'PRE_REBASE_NON_AUTHORITATIVE',
    evidence_items: evidenceItems,
    evidence_count: evidenceItems.length,
    total_bytes: (data.manifest && data.manifest.total_bytes) || 0,
    all_operator_provided: (data.manifest && data.manifest.all_operator_provided) || false,
    ingestion_log: (data.ingestion_log || []).map(entry => ({
      filename: entry.filename || '',
      status: entry.status || '',
      evidence_id: entry.evidence_id || '',
      hash: entry.hash || '',
      reason: entry.reason || '',
    })),
    extraction_log: (data.extraction_log || []).map(entry => ({
      evidence_id: entry.evidence_id || '',
      source_type: entry.source_type || '',
      filename: entry.filename || '',
      candidates_extracted: entry.candidates_extracted || 0,
      hash_verified: entry.hash_verified || false,
    })),
    evaluations,
    candidate_count: data.candidate_count || 0,
    evaluation_count: data.evaluation_count || 0,
    summary: {
      total_candidates: (data.summary && data.summary.total_candidates) || 0,
      mapped_candidates: (data.summary && data.summary.mapped_candidates) || 0,
      unmapped_candidates: (data.summary && data.summary.unmapped_candidates) || 0,
      domains_referenced: (data.summary && data.summary.domains_referenced) || [],
      total_evaluated: (data.summary && data.summary.total_evaluated) || 0,
      admissible: (data.summary && data.summary.admissible) || 0,
      quarantined: (data.summary && data.summary.quarantined) || 0,
      rejected: (data.summary && data.summary.rejected) || 0,
      evidence_files: (data.summary && data.summary.evidence_files) || [],
      evidence_hashes: (data.summary && data.summary.evidence_hashes) || [],
    },
    governance: {
      no_grounding_mutation: (data.governance && data.governance.no_grounding_mutation) || false,
      no_overlay_generation: (data.governance && data.governance.no_overlay_generation) || false,
      no_qualification_mutation: (data.governance && data.governance.no_qualification_mutation) || false,
      no_authority_assertion: (data.governance && data.governance.no_authority_assertion) || false,
      no_lens_mutation: (data.governance && data.governance.no_lens_mutation) || false,
      upstream_evidence_bound: (data.governance && data.governance.upstream_evidence_bound) || false,
      additive_only: (data.governance && data.governance.additive_only) || false,
      fail_closed: (data.governance && data.governance.fail_closed) || false,
    },
  };
}

module.exports = { buildExplicitEvidenceRebaseViewModel };

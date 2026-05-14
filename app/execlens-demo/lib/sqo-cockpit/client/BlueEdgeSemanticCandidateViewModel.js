'use strict';

function buildSemanticCandidateViewModel(data) {
  if (!data || !data.ok) {
    return {
      available: false,
      error: data ? data.error : 'NO_DATA',
    };
  }

  const candidates = (data.candidates || []).map(c => ({
    candidate_id: c.candidate_id,
    evidence_id: c.evidence_id,
    source_path: c.source_path,
    source_hash: c.source_hash ? c.source_hash.slice(0, 16) + '...' : null,
    source_hash_full: c.source_hash,
    extracted_label: c.extracted_label,
    candidate_type: c.candidate_type,
    candidate_domain: c.candidate_domain,
    is_unmapped: c.candidate_domain === 'UNMAPPED_CANDIDATE',
    source_span_reference: c.source_span_reference,
    extraction_method: c.extraction_method,
    confidence_class: c.confidence_class,
    conflict_status: c.conflict_status,
    authority_state: c.authority_state,
    next_required_gate: c.next_required_gate,
  }));

  const extractionLog = (data.extraction_log || []).map(e => ({
    evidence_id: e.evidence_id,
    source_type: e.source_type || null,
    status: e.status,
    reason: e.reason || null,
    hash_verified: e.hash_verified || false,
    candidates_extracted: e.candidates_extracted || 0,
  }));

  const summary = data.summary || {};
  const governance = data.governance || {};

  return {
    available: true,
    client: data.client,
    run_id: data.run_id,
    evidence_registry_id: data.evidence_registry_id,
    candidate_count: data.candidate_count,
    candidates,
    extraction_log: extractionLog,
    summary: {
      total_candidates: summary.total_candidates || 0,
      mapped_candidates: summary.mapped_candidates || 0,
      unmapped_candidates: summary.unmapped_candidates || 0,
      domains_referenced: summary.domains_referenced || 0,
      domain_counts: summary.domain_counts || {},
      extraction_methods_used: summary.extraction_methods_used || [],
      confidence_distribution: summary.confidence_distribution || {},
      all_non_authoritative: summary.all_non_authoritative || false,
      all_gated: summary.all_gated || false,
    },
    governance: {
      no_grounding_mutation: governance.no_grounding_mutation || false,
      no_overlay_generation: governance.no_overlay_generation || false,
      no_qualification_mutation: governance.no_qualification_mutation || false,
      no_authority_assertion: governance.no_authority_assertion || false,
      no_lens_mutation: governance.no_lens_mutation || false,
      extraction_only: governance.extraction_only || false,
      additive_only: governance.additive_only || false,
      fail_closed: governance.fail_closed || false,
    },
  };
}

module.exports = { buildSemanticCandidateViewModel };

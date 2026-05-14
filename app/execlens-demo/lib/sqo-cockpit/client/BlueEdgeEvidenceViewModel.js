'use strict';

function buildEvidenceViewModel(data) {
  if (!data || !data.ok) {
    return {
      available: false,
      error: data ? data.error : 'NO_DATA',
    };
  }

  const registry = data.registry || {};
  const items = registry.evidence_items || [];
  const verifications = data.verifications || [];
  const verificationMap = {};
  for (const v of verifications) {
    verificationMap[v.evidence_id] = v;
  }

  const evidenceItems = items.map(item => {
    const v = verificationMap[item.evidence_id] || {};
    return {
      evidence_id: item.evidence_id,
      source_type: item.source_type,
      source_path: item.source_path,
      evidence_hash: item.evidence_hash ? item.evidence_hash.slice(0, 16) + '...' : null,
      evidence_hash_full: item.evidence_hash,
      replay_hash: item.replay_hash ? item.replay_hash.slice(0, 16) + '...' : null,
      ingestion_timestamp: item.ingestion_timestamp,
      provenance_origin: item.provenance_origin,
      candidate_domains: item.candidate_domains || [],
      candidate_domain_count: (item.candidate_domains || []).length,
      structural_correlation_status: item.structural_correlation_status || 'UNKNOWN',
      authority_state: item.authority_state || 'NON_AUTHORITATIVE_EVIDENCE',
      file_size_bytes: item.file_size_bytes || 0,
      description: item.description || '',
      hash_verified: v.verified || false,
    };
  });

  const summary = registry.summary || {};
  const governance = registry.governance || {};

  return {
    available: true,
    client: data.client,
    run_id: data.run_id,
    registry_id: registry.registry_id,
    ingestion_boundary: registry.ingestion_boundary || 'NON_AUTHORITATIVE',
    item_count: data.item_count,
    all_verified: data.all_verified,
    items: evidenceItems,
    summary: {
      total_items: summary.total_items || 0,
      source_types: summary.source_types || [],
      total_size_bytes: summary.total_size_bytes || 0,
      all_non_authoritative: summary.all_non_authoritative || false,
      all_replay_safe: summary.all_replay_safe || false,
      domains_covered: summary.domains_covered || 0,
      correlations_pending: summary.structural_correlations_pending || 0,
    },
    governance: {
      no_semantic_mutation: governance.no_semantic_mutation || false,
      no_authority_mutation: governance.no_authority_mutation || false,
      no_overlay_generation: governance.no_overlay_generation || false,
      ingestion_only: governance.ingestion_only || false,
      additive_only: governance.additive_only || false,
    },
  };
}

module.exports = { buildEvidenceViewModel };

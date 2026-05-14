'use strict';

function buildDynamicCEUAdmissibilityViewModel(data) {
  if (!data || !data.ok) {
    return {
      available: false,
      error: data ? data.error : 'NO_DATA',
    };
  }

  const evaluations = (data.evaluations || []).map(evaluation => ({
    ...evaluation,
    source_hash: evaluation.source_hash
      ? evaluation.source_hash.slice(0, 16) + '...'
      : null,
    source_hash_full: evaluation.source_hash || null,
    is_admissible: evaluation.admissibility_state === 'ADMISSIBLE',
    is_quarantined: evaluation.admissibility_state === 'QUARANTINED',
    is_rejected: evaluation.admissibility_state === 'REJECTED',
    is_unresolved: evaluation.admissibility_state === 'UNRESOLVED',
  }));

  return {
    available: true,
    client: data.client || '',
    run_id: data.run_id || '',
    upstream_registry_id: data.upstream_registry_id || '',
    upstream_candidate_count: data.upstream_candidate_count || 0,
    evaluation_count: data.evaluation_count || 0,
    evaluations,
    evaluation_log: (data.evaluation_log || []).map(entry => ({
      candidate_id: entry.candidate_id || '',
      candidate_domain: entry.candidate_domain || '',
      admissibility_state: entry.admissibility_state || '',
      structural_compatibility: entry.structural_compatibility || '',
      replay_compatibility: entry.replay_compatibility || '',
      conflict_status: entry.conflict_status || '',
    })),
    summary: {
      total_evaluated: (data.summary && data.summary.total_evaluated) || 0,
      admissible: (data.summary && data.summary.admissible) || 0,
      quarantined: (data.summary && data.summary.quarantined) || 0,
      rejected: (data.summary && data.summary.rejected) || 0,
      unresolved: (data.summary && data.summary.unresolved) || 0,
      admissible_domains: (data.summary && data.summary.admissible_domains) || [],
      quarantined_domains: (data.summary && data.summary.quarantined_domains) || [],
      none_domains_with_admissible: (data.summary && data.summary.none_domains_with_admissible) || [],
      structural_compatibility_distribution: (data.summary && data.summary.structural_compatibility_distribution) || {},
      replay_compatibility_distribution: (data.summary && data.summary.replay_compatibility_distribution) || {},
      conflict_count: (data.summary && data.summary.conflict_count) || 0,
      all_non_authoritative: (data.summary && data.summary.all_non_authoritative) || false,
    },
    governance: {
      no_grounding_mutation: (data.governance && data.governance.no_grounding_mutation) || false,
      no_overlay_generation: (data.governance && data.governance.no_overlay_generation) || false,
      no_qualification_mutation: (data.governance && data.governance.no_qualification_mutation) || false,
      no_authority_assertion: (data.governance && data.governance.no_authority_assertion) || false,
      no_lens_mutation: (data.governance && data.governance.no_lens_mutation) || false,
      admissibility_evaluation_only: (data.governance && data.governance.admissibility_evaluation_only) || false,
      additive_only: (data.governance && data.governance.additive_only) || false,
      fail_closed: (data.governance && data.governance.fail_closed) || false,
    },
  };
}

module.exports = { buildDynamicCEUAdmissibilityViewModel };

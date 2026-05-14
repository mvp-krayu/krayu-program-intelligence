/**
 * ReconciliationLifecycleCompiler
 * PI.SQO.BLUEEDGE.PROGRESSIVE-RECONCILIATION-LIFECYCLE.01
 *
 * Compiles an ordered sequence of reconciliation correspondence artifacts
 * into a progressive lifecycle with epochs, deltas, and progression tracking.
 *
 * Client-agnostic: processes any correspondence artifacts that conform to
 * the reconciliation_correspondence.v1 schema.
 *
 * Input: ordered array of { epochLabel, enrichmentType, sourceStream, artifact }
 * Output: reconciliation_lifecycle artifact with epochs, deltas, progression, runtime summary
 */

'use strict';

function extractEpochSnapshot(artifact) {
  const correspondences = artifact.correspondences || [];
  return {
    summary: {
      total_semantic_domains: artifact.summary.total_semantic_domains,
      reconciled_count: artifact.summary.reconciled_count,
      unreconciled_count: artifact.summary.unreconciled_count,
      reconciliation_ratio: artifact.summary.reconciliation_ratio,
      weighted_confidence_score: artifact.summary.weighted_confidence_score,
      confidence_distribution: { ...artifact.summary.confidence_distribution },
      unmatched_structural_count: artifact.summary.unmatched_structural_count,
    },
    per_domain: correspondences.map(c => ({
      domain_id: c.semantic_domain_id,
      domain_name: c.semantic_domain_name,
      domain_type: c.semantic_domain_type,
      cluster_id: c.cluster_id,
      confidence_level: c.confidence_level,
      confidence_label: c.confidence_label,
      structural_dom_id: c.structural_dom_id,
      structural_domain_name: c.structural_domain_name,
      correspondence_basis: c.correspondence_basis,
      reconciliation_status: c.reconciliation_status,
    })),
    unmatched_structural: (artifact.unmatched_structural || []).map(u => ({
      structural_dom_id: u.structural_dom_id,
      structural_domain_name: u.structural_domain_name,
    })),
  };
}

function computeDelta(fromEpoch, toEpoch) {
  const fromSummary = fromEpoch.summary;
  const toSummary = toEpoch.summary;

  const fromDist = fromSummary.confidence_distribution;
  const toDist = toSummary.confidence_distribution;

  const summaryDelta = {
    weighted_confidence: {
      from: fromSummary.weighted_confidence_score,
      to: toSummary.weighted_confidence_score,
      delta: +(toSummary.weighted_confidence_score - fromSummary.weighted_confidence_score).toFixed(1),
    },
    reconciliation_ratio: {
      from: fromSummary.reconciliation_ratio,
      to: toSummary.reconciliation_ratio,
      delta: +(toSummary.reconciliation_ratio - fromSummary.reconciliation_ratio).toFixed(4),
    },
    level_distribution_delta: {
      L5: (toDist.level_5_structurally_grounded || 0) - (fromDist.level_5_structurally_grounded || 0),
      L4: (toDist.level_4_observationally_corroborated || 0) - (fromDist.level_4_observationally_corroborated || 0),
      L3: (toDist.level_3_semantically_coherent || 0) - (fromDist.level_3_semantically_coherent || 0),
      L2: (toDist.level_2_upstream_evidence_bound || 0) - (fromDist.level_2_upstream_evidence_bound || 0),
      L1: (toDist.level_1_unmapped || 0) - (fromDist.level_1_unmapped || 0),
    },
    unmatched_structural: {
      from: fromSummary.unmatched_structural_count,
      to: toSummary.unmatched_structural_count,
      delta: toSummary.unmatched_structural_count - fromSummary.unmatched_structural_count,
    },
  };

  const fromDomainMap = {};
  for (const d of fromEpoch.per_domain) fromDomainMap[d.domain_id] = d;

  const domainDeltas = [];
  const domainsImproved = [];
  const domainsDegraded = [];
  const domainsUnchanged = [];

  for (const toDomain of toEpoch.per_domain) {
    const fromDomain = fromDomainMap[toDomain.domain_id];
    if (!fromDomain) continue;

    const levelDelta = toDomain.confidence_level - fromDomain.confidence_level;

    if (levelDelta !== 0) {
      const entry = {
        domain_id: toDomain.domain_id,
        domain_name: toDomain.domain_name,
        from_level: fromDomain.confidence_level,
        to_level: toDomain.confidence_level,
        delta: levelDelta,
        from_dom: fromDomain.structural_dom_id,
        to_dom: toDomain.structural_dom_id,
        from_basis: fromDomain.correspondence_basis,
        to_basis: toDomain.correspondence_basis,
      };
      domainDeltas.push(entry);
      if (levelDelta > 0) domainsImproved.push(toDomain.domain_id);
      else domainsDegraded.push(toDomain.domain_id);
    } else {
      domainsUnchanged.push(toDomain.domain_id);
    }
  }

  return {
    summary_delta: summaryDelta,
    domain_deltas: domainDeltas,
    domains_improved: domainsImproved,
    domains_degraded: domainsDegraded,
    domains_unchanged: domainsUnchanged,
  };
}

/**
 * Compile a reconciliation lifecycle from an ordered sequence of correspondence epochs.
 *
 * @param {object} opts
 * @param {string} opts.client — client identifier
 * @param {string} opts.runId — run identifier
 * @param {Array<object>} opts.epochs — ordered list of:
 *   { epochLabel: string, enrichmentType: string, sourceStream: string, sourceArtifact: string, artifact: object }
 * @returns {object} reconciliation lifecycle artifact
 */
function compileLifecycle(opts) {
  const { client, runId, epochs: epochInputs } = opts;

  if (!epochInputs || epochInputs.length === 0) {
    return { ok: false, error: 'NO_EPOCHS_PROVIDED' };
  }

  const epochs = epochInputs.map((input, index) => {
    const snapshot = extractEpochSnapshot(input.artifact);
    return {
      epoch_id: index,
      epoch_label: input.epochLabel,
      source_stream: input.sourceStream,
      source_artifact: input.sourceArtifact,
      timestamp: input.artifact.generated_at,
      enrichment_type: input.enrichmentType,
      ...snapshot,
    };
  });

  const deltas = [];
  for (let i = 1; i < epochs.length; i++) {
    const delta = computeDelta(epochs[i - 1], epochs[i]);
    deltas.push({
      from_epoch: i - 1,
      to_epoch: i,
      from_label: epochs[i - 1].epoch_label,
      to_label: epochs[i].epoch_label,
      ...delta,
    });
  }

  const currentEpoch = epochs[epochs.length - 1];
  const unresolvedDomains = currentEpoch.per_domain
    .filter(d => d.confidence_level === 1)
    .map(d => d.domain_id);

  const progression = {
    total_epochs: epochs.length,
    current_epoch: epochs.length - 1,
    overall_trend: determineTrend(epochs),
    weighted_confidence_trajectory: epochs.map(e => e.summary.weighted_confidence_score),
    reconciliation_ratio_trajectory: epochs.map(e => e.summary.reconciliation_ratio),
    unresolved_trajectory: epochs.map(e => e.summary.confidence_distribution.level_1_unmapped || 0),
    unmatched_structural_trajectory: epochs.map(e => e.summary.unmatched_structural_count),
    semantic_debt_summary: {
      total_unresolved: unresolvedDomains.length,
      unresolved_domain_ids: unresolvedDomains,
      resolution_rate: epochs.length > 1
        ? +((epochs[0].summary.confidence_distribution.level_1_unmapped - unresolvedDomains.length) /
            epochs[0].summary.confidence_distribution.level_1_unmapped * 100).toFixed(1)
        : 0,
    },
  };

  const runtimeSummary = {
    client,
    run_id: runId,
    current_epoch: currentEpoch.epoch_label,
    total_epochs: epochs.length,
    weighted_confidence: currentEpoch.summary.weighted_confidence_score,
    reconciliation_ratio: currentEpoch.summary.reconciliation_ratio,
    confidence_distribution: currentEpoch.summary.confidence_distribution,
    unresolved_count: unresolvedDomains.length,
    total_domains: currentEpoch.summary.total_semantic_domains,
    trend: progression.overall_trend,
    last_delta: deltas.length > 0 ? {
      weighted_confidence_change: deltas[deltas.length - 1].summary_delta.weighted_confidence.delta,
      domains_improved: deltas[deltas.length - 1].domains_improved.length,
      domains_degraded: deltas[deltas.length - 1].domains_degraded.length,
      unresolved_change: deltas[deltas.length - 1].summary_delta.level_distribution_delta.L1,
    } : null,
  };

  return {
    ok: true,
    schema_version: '1.0',
    artifact_type: 'reconciliation_lifecycle',
    generated_at: new Date().toISOString(),
    lifecycle_version: 'PI.SQO.BLUEEDGE.PROGRESSIVE-RECONCILIATION-LIFECYCLE.01',
    client,
    run_id: runId,
    epochs,
    deltas,
    progression,
    runtime_summary: runtimeSummary,
    governance: {
      deterministic: true,
      replay_safe: true,
      no_new_inference: true,
      path_a_frozen: true,
      compiler_unchanged: true,
    },
  };
}

function determineTrend(epochs) {
  if (epochs.length < 2) return 'INSUFFICIENT_DATA';
  const first = epochs[0].summary.weighted_confidence_score;
  const last = epochs[epochs.length - 1].summary.weighted_confidence_score;
  if (last > first) return 'IMPROVING';
  if (last < first) return 'DEGRADING';
  return 'STABLE';
}

module.exports = {
  compileLifecycle,
  extractEpochSnapshot,
  computeDelta,
  determineTrend,
};

'use strict';

/**
 * ReconciliationLifecycleProjection
 * PI.SQO.RUNTIME-SEMANTIC-LIFECYCLE-PROJECTION.01
 *
 * Transforms reconciliation lifecycle artifacts into runtime-consumable
 * projection shapes for SQO cockpit rendering.
 *
 * Pure deterministic consumer — no inference, no enrichment, no mutation.
 */

function projectLifecycleForRuntime(lifecycleArtifact) {
  if (!lifecycleArtifact || !lifecycleArtifact.ok) return null;

  return {
    trend: projectTrend(lifecycleArtifact),
    trajectory: projectTrajectory(lifecycleArtifact),
    currentPosture: projectCurrentPosture(lifecycleArtifact),
    epochSummary: projectEpochSummary(lifecycleArtifact),
    latestDelta: projectLatestDelta(lifecycleArtifact),
    semanticDebt: projectSemanticDebt(lifecycleArtifact),
    unresolvedDomains: projectUnresolvedDomains(lifecycleArtifact),
    provenance: projectProvenance(lifecycleArtifact),
  };
}

function projectTrend(lifecycle) {
  const prog = lifecycle.progression;
  return {
    label: prog.overall_trend,
    total_epochs: prog.total_epochs,
    current_epoch_index: prog.current_epoch,
    current_epoch_label: lifecycle.runtime_summary.current_epoch,
  };
}

function projectTrajectory(lifecycle) {
  const prog = lifecycle.progression;
  const epochs = lifecycle.epochs;

  return {
    weighted_confidence: prog.weighted_confidence_trajectory,
    reconciliation_ratio: prog.reconciliation_ratio_trajectory,
    unresolved: prog.unresolved_trajectory,
    unmatched_structural: prog.unmatched_structural_trajectory,
    epoch_labels: epochs.map(e => e.epoch_label),
  };
}

function projectCurrentPosture(lifecycle) {
  const rs = lifecycle.runtime_summary;
  return {
    weighted_confidence: rs.weighted_confidence,
    reconciliation_ratio: rs.reconciliation_ratio,
    reconciliation_ratio_pct: +(rs.reconciliation_ratio * 100).toFixed(1),
    unresolved_count: rs.unresolved_count,
    total_domains: rs.total_domains,
    resolved_count: rs.total_domains - rs.unresolved_count,
    confidence_distribution: rs.confidence_distribution,
    trend: rs.trend,
  };
}

function projectEpochSummary(lifecycle) {
  return lifecycle.epochs.map(epoch => ({
    epoch_id: epoch.epoch_id,
    label: epoch.epoch_label,
    enrichment_type: epoch.enrichment_type,
    source_stream: epoch.source_stream,
    source_artifact: epoch.source_artifact,
    timestamp: epoch.timestamp,
    weighted_confidence: epoch.summary.weighted_confidence_score,
    reconciliation_ratio: epoch.summary.reconciliation_ratio,
    unresolved: epoch.summary.confidence_distribution.level_1_unmapped || 0,
    unmatched_structural: epoch.summary.unmatched_structural_count,
    distribution: {
      L5: epoch.summary.confidence_distribution.level_5_structurally_grounded || 0,
      L4: epoch.summary.confidence_distribution.level_4_observationally_corroborated || 0,
      L3: epoch.summary.confidence_distribution.level_3_semantically_coherent || 0,
      L2: epoch.summary.confidence_distribution.level_2_upstream_evidence_bound || 0,
      L1: epoch.summary.confidence_distribution.level_1_unmapped || 0,
    },
  }));
}

function projectLatestDelta(lifecycle) {
  if (!lifecycle.deltas || lifecycle.deltas.length === 0) return null;

  const d = lifecycle.deltas[lifecycle.deltas.length - 1];
  return {
    from_label: d.from_label,
    to_label: d.to_label,
    weighted_confidence_change: d.summary_delta.weighted_confidence.delta,
    weighted_confidence_from: d.summary_delta.weighted_confidence.from,
    weighted_confidence_to: d.summary_delta.weighted_confidence.to,
    reconciliation_ratio_change: d.summary_delta.reconciliation_ratio.delta,
    level_movement: d.summary_delta.level_distribution_delta,
    domains_improved_count: d.domains_improved.length,
    domains_degraded_count: d.domains_degraded.length,
    domains_unchanged_count: d.domains_unchanged.length,
    domain_movements: d.domain_deltas.map(dd => ({
      domain_id: dd.domain_id,
      domain_name: dd.domain_name,
      from_level: dd.from_level,
      to_level: dd.to_level,
      delta: dd.delta,
    })),
  };
}

function projectSemanticDebt(lifecycle) {
  const debt = lifecycle.progression.semantic_debt_summary;
  return {
    total_unresolved: debt.total_unresolved,
    resolution_rate: debt.resolution_rate,
    unresolved_domain_ids: debt.unresolved_domain_ids,
  };
}

function projectUnresolvedDomains(lifecycle) {
  const currentEpoch = lifecycle.epochs[lifecycle.epochs.length - 1];
  return currentEpoch.per_domain
    .filter(d => d.confidence_level === 1)
    .map(d => ({
      domain_id: d.domain_id,
      domain_name: d.domain_name,
      domain_type: d.domain_type,
      cluster_id: d.cluster_id,
    }));
}

function projectProvenance(lifecycle) {
  return {
    lifecycle_version: lifecycle.lifecycle_version,
    schema_version: lifecycle.schema_version,
    generated_at: lifecycle.generated_at,
    governance: lifecycle.governance,
    epoch_sources: lifecycle.epochs.map(e => ({
      epoch_label: e.epoch_label,
      source_stream: e.source_stream,
      source_artifact: e.source_artifact,
      timestamp: e.timestamp,
    })),
  };
}

module.exports = {
  projectLifecycleForRuntime,
  projectTrend,
  projectTrajectory,
  projectCurrentPosture,
  projectEpochSummary,
  projectLatestDelta,
  projectSemanticDebt,
  projectUnresolvedDomains,
  projectProvenance,
};

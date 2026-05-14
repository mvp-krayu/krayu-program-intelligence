'use strict';

/**
 * TemporalAnalyticsProjection
 * PI.SQO.BLUEEDGE.RECONCILIATION-TEMPORAL-ANALYTICS.01
 *
 * Transforms the reconciliation_temporal_analytics artifact into
 * runtime-consumable projection shapes for SQO cockpit and LENS v2.
 *
 * Pure deterministic consumer — no inference, no enrichment, no mutation.
 */

function projectTemporalAnalyticsForRuntime(analyticsArtifact) {
  if (!analyticsArtifact) return null;

  return {
    trend: projectTrend(analyticsArtifact),
    enrichmentEffectiveness: projectEnrichmentEffectiveness(analyticsArtifact),
    debtReduction: projectDebtReduction(analyticsArtifact),
    unresolvedPersistence: projectUnresolvedPersistence(analyticsArtifact),
    degradation: projectDegradation(analyticsArtifact),
    divergence: projectDivergence(analyticsArtifact),
    epochTimeline: analyticsArtifact.epoch_timeline || [],
    runtimeSummary: analyticsArtifact.runtime_summary || null,
    provenance: projectProvenance(analyticsArtifact),
  };
}

function projectTrend(artifact) {
  const t = artifact.trend;
  if (!t) return null;
  return { label: t.label, reason: t.reason };
}

function projectEnrichmentEffectiveness(artifact) {
  const ee = artifact.enrichment_effectiveness;
  if (!ee || !ee.available) return null;

  return {
    grade: ee.grade,
    weighted_lift: ee.weighted_lift,
    weighted_lift_pct: ee.weighted_lift_pct,
    unresolved_reduction: ee.unresolved_reduction,
    domains_improved: ee.domains_improved,
    domains_degraded: ee.domains_degraded,
    effectiveness_ratio: ee.effectiveness_ratio,
    level_transitions: ee.level_transitions,
  };
}

function projectDebtReduction(artifact) {
  const dr = artifact.debt_reduction;
  if (!dr || !dr.available) return null;

  return {
    baseline_unmapped: dr.baseline_unmapped,
    current_unmapped: dr.current_unmapped,
    reduction_count: dr.reduction_count,
    reduction_ratio: dr.reduction_ratio,
    enrichment_impact: dr.enrichment_impact,
    irreducible_floor: dr.irreducible_floor,
    remaining_reducible: dr.remaining_reducible,
    weighted_debt_score: dr.weighted_debt_score,
  };
}

function projectUnresolvedPersistence(artifact) {
  const up = artifact.unresolved_persistence;
  if (!up || !up.available) return null;

  return {
    persistent_count: up.persistent_count,
    resolved_count: up.resolved_count,
    persistence_ratio: up.persistence_ratio,
    persistent_domains: up.persistent_domains.map(d => ({
      domain_id: d.domain_id,
      domain_name: d.domain_name,
      reducibility: d.reducibility,
    })),
  };
}

function projectDegradation(artifact) {
  const deg = artifact.degradation;
  if (!deg) return null;

  return {
    detected: deg.detected,
    signal_count: deg.signal_count,
    signals: deg.signals.map(s => ({
      type: s.type,
      domain_id: s.domain_id || null,
      epoch_transition: s.epoch_transition,
    })),
  };
}

function projectDivergence(artifact) {
  const div = artifact.structural_semantic_divergence;
  if (!div || !div.available) return null;

  return {
    divergence_score: div.divergence_score,
    structurally_grounded: div.structurally_grounded,
    semantic_only: div.semantic_only,
    total_domains: div.total_domains,
    grounded_ratio: div.grounded_ratio,
    indicators: div.indicators.map(i => ({
      type: i.type,
      domain_id: i.domain_id,
      domain_name: i.domain_name,
    })),
  };
}

function projectProvenance(artifact) {
  return {
    generated_at: artifact.generated_at,
    compiler_version: artifact.compiler_version,
    deterministic: artifact.governance && artifact.governance.deterministic,
    replay_safe: artifact.governance && artifact.governance.replay_safe,
    epoch_count: (artifact.epoch_timeline || []).length,
  };
}

module.exports = {
  projectTemporalAnalyticsForRuntime,
  projectTrend,
  projectEnrichmentEffectiveness,
  projectDebtReduction,
  projectUnresolvedPersistence,
  projectDegradation,
  projectDivergence,
  projectProvenance,
};

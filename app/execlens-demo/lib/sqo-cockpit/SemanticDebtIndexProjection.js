'use strict';

/**
 * SemanticDebtIndexProjection
 * PI.SQO.BLUEEDGE.SEMANTIC-DEBT-INDEX.01
 *
 * Transforms the semantic_debt_index artifact into runtime-consumable
 * projection shapes for SQO cockpit, LENS v2, and future qualification
 * projection surfaces.
 *
 * Pure deterministic consumer — no inference, no enrichment, no mutation.
 */

function projectDebtIndexForRuntime(debtIndexArtifact) {
  if (!debtIndexArtifact) return null;

  return {
    aggregatePosture: projectAggregatePosture(debtIndexArtifact),
    domainPostures: projectDomainPostures(debtIndexArtifact),
    lifecycle: projectLifecycle(debtIndexArtifact),
    reducibilitySummary: projectReducibilitySummary(debtIndexArtifact),
    originSummary: projectOriginSummary(debtIndexArtifact),
    exposureSummary: projectExposureSummary(debtIndexArtifact),
    continuityDebt: projectContinuityDebt(debtIndexArtifact),
    provenance: projectProvenance(debtIndexArtifact),
  };
}

function projectAggregatePosture(artifact) {
  const agg = artifact.aggregate_posture;
  if (!agg) return null;

  return {
    total_domains: agg.total_domains,
    total_debt_items: agg.total_debt_items,
    domains_with_debt: agg.domains_with_debt,
    domains_clear: agg.domains_clear,
    debt_ratio: agg.debt_ratio,
    weighted_debt_score: agg.weighted_debt_score,
    operational_exposure: agg.operational_exposure,
    qualification_impact: agg.qualification_impact,
    s_state_blocking_count: agg.s_state_blocking_count,
    severity_distribution: agg.severity_distribution,
  };
}

function projectDomainPostures(artifact) {
  const postures = artifact.domain_postures;
  if (!postures) return [];

  return postures.map(dp => ({
    domain_id: dp.domain_id,
    domain_name: dp.domain_name,
    debt_status: dp.debt_status,
    debt_item_count: dp.debt_item_count,
    baseline_level: dp.baseline_confidence_level,
    enriched_level: dp.enriched_confidence_level,
    confidence_delta: dp.confidence_delta,
    reducibility: dp.reducibility,
    origin_type: dp.origin_type,
    operational_exposure: dp.operational_exposure,
    enrichment_status: dp.enrichment_status,
  }));
}

function projectLifecycle(artifact) {
  const lc = artifact.lifecycle;
  if (!lc) return null;

  return {
    baseline_unmapped: lc.baseline_unmapped_count,
    enriched_unmapped: lc.enriched_unmapped_count,
    reduction_count: lc.debt_reduction_by_enrichment,
    reduction_ratio: lc.debt_reduction_ratio,
    enrichment_impact: lc.enrichment_impact,
    active_count: lc.active_debt_domains,
    partially_resolved_count: lc.partially_resolved_domains,
    clear_count: lc.clear_domains,
  };
}

function projectReducibilitySummary(artifact) {
  const dist = artifact.aggregate_posture && artifact.aggregate_posture.reducibility_distribution;
  if (!dist) return null;

  const entries = Object.entries(dist).map(([label, count]) => ({ label, count }));
  entries.sort((a, b) => b.count - a.count);
  return {
    entries,
    irreducible_count: dist.IRREDUCIBLE_STRUCTURAL_ABSENCE || 0,
    reducible_count: (dist.REDUCIBLE_BY_EVIDENCE || 0) + (dist.REDUCED_BY_ENRICHMENT || 0),
  };
}

function projectOriginSummary(artifact) {
  const dist = artifact.aggregate_posture && artifact.aggregate_posture.origin_distribution;
  if (!dist) return null;

  const entries = Object.entries(dist).map(([label, count]) => ({ label, count }));
  entries.sort((a, b) => b.count - a.count);
  return { entries };
}

function projectExposureSummary(artifact) {
  const postures = artifact.domain_postures;
  if (!postures) return null;

  const dist = {};
  for (const dp of postures) {
    const exp = dp.operational_exposure;
    dist[exp] = (dist[exp] || 0) + 1;
  }

  return {
    distribution: dist,
    high_exposure_domains: postures
      .filter(dp => dp.operational_exposure === 'HIGH')
      .map(dp => ({ domain_id: dp.domain_id, domain_name: dp.domain_name, reducibility: dp.reducibility })),
  };
}

function projectContinuityDebt(artifact) {
  const items = artifact.continuity_debt;
  if (!items || items.length === 0) return null;

  return {
    count: items.length,
    items: items.map(d => ({
      id: d.id,
      severity: d.severity,
      description: d.description,
    })),
  };
}

function projectProvenance(artifact) {
  return {
    generated_at: artifact.generated_at,
    compiler_version: artifact.compiler_version,
    deterministic: artifact.governance && artifact.governance.deterministic,
    replay_safe: artifact.governance && artifact.governance.replay_safe,
    no_inference: artifact.governance && artifact.governance.no_inference,
    source_artifacts: artifact.provenance && artifact.provenance.source_artifacts,
  };
}

module.exports = {
  projectDebtIndexForRuntime,
  projectAggregatePosture,
  projectDomainPostures,
  projectLifecycle,
  projectReducibilitySummary,
  projectOriginSummary,
  projectExposureSummary,
  projectContinuityDebt,
  projectProvenance,
};

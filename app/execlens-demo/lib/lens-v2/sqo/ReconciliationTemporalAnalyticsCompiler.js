'use strict';

const path = require('path');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const COMPILER_VERSION = '1.0';

const TREND = {
  IMPROVING: 'IMPROVING',
  STABLE: 'STABLE',
  DEGRADING: 'DEGRADING',
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
};

function classifyTrend(lifecycle) {
  const prog = lifecycle.progression;
  if (!prog || !prog.total_epochs || prog.total_epochs < 2) {
    return { label: TREND.INSUFFICIENT_DATA, reason: 'fewer than 2 epochs available' };
  }

  const wt = prog.weighted_confidence_trajectory || [];
  const ut = prog.unresolved_trajectory || [];

  if (wt.length < 2) {
    return { label: TREND.INSUFFICIENT_DATA, reason: 'trajectory data incomplete' };
  }

  const firstW = wt[0];
  const lastW = wt[wt.length - 1];
  const weightedDelta = lastW - firstW;

  const firstU = ut.length >= 2 ? ut[0] : null;
  const lastU = ut.length >= 2 ? ut[ut.length - 1] : null;
  const unresolvedDelta = firstU !== null && lastU !== null ? lastU - firstU : 0;

  if (weightedDelta > 5 && unresolvedDelta <= 0) {
    return { label: TREND.IMPROVING, reason: `weighted confidence +${weightedDelta.toFixed(1)}, unresolved ${unresolvedDelta >= 0 ? 'stable' : 'reduced'}` };
  }
  if (weightedDelta < -5) {
    return { label: TREND.DEGRADING, reason: `weighted confidence ${weightedDelta.toFixed(1)}` };
  }
  if (unresolvedDelta > 0 && weightedDelta <= 0) {
    return { label: TREND.DEGRADING, reason: `unresolved domains increased by ${unresolvedDelta}` };
  }
  return { label: TREND.STABLE, reason: `weighted confidence delta ${weightedDelta.toFixed(1)}, within stability band` };
}

function computeEnrichmentEffectiveness(lifecycle, debtIndex) {
  const prog = lifecycle.progression;
  const wt = prog && prog.weighted_confidence_trajectory;
  const ut = prog && prog.unresolved_trajectory;
  const deltas = lifecycle.deltas || [];

  if (!wt || wt.length < 2) {
    return { available: false, reason: 'insufficient epoch data' };
  }

  const baselineWeighted = wt[0];
  const currentWeighted = wt[wt.length - 1];
  const weightedLift = currentWeighted - baselineWeighted;
  const weightedLiftPct = baselineWeighted > 0 ? +((weightedLift / baselineWeighted) * 100).toFixed(1) : 0;

  const baselineUnresolved = ut && ut.length >= 2 ? ut[0] : 0;
  const currentUnresolved = ut && ut.length >= 2 ? ut[ut.length - 1] : 0;
  const unresolvedReduction = baselineUnresolved - currentUnresolved;

  const totalDomains = debtIndex
    ? debtIndex.aggregate_posture.total_domains
    : (prog.weighted_confidence_trajectory ? lifecycle.epochs[0].summary.total_semantic_domains : 17);

  let domainsImproved = 0;
  let domainsDegraded = 0;
  let levelLifts = {};

  for (const delta of deltas) {
    const dd = delta.domain_deltas || [];
    for (const d of dd) {
      if (d.delta > 0) {
        domainsImproved++;
        const key = `L${d.from_level}_to_L${d.to_level}`;
        levelLifts[key] = (levelLifts[key] || 0) + 1;
      } else if (d.delta < 0) {
        domainsDegraded++;
      }
    }
  }

  const enrichedDomains = debtIndex
    ? debtIndex.domain_postures.filter(dp => dp.enrichment_status === 'AI_RECONSTRUCTED').length
    : domainsImproved;

  const effectivenessRatio = totalDomains > 0
    ? +((enrichedDomains / totalDomains) * 100).toFixed(1)
    : 0;

  let grade;
  if (weightedLift >= 20 && unresolvedReduction >= 8) grade = 'HIGH';
  else if (weightedLift >= 10 && unresolvedReduction >= 4) grade = 'MODERATE';
  else if (weightedLift > 0 || unresolvedReduction > 0) grade = 'LOW';
  else grade = 'NONE';

  return {
    available: true,
    grade,
    baseline_weighted_confidence: baselineWeighted,
    current_weighted_confidence: currentWeighted,
    weighted_lift: +weightedLift.toFixed(1),
    weighted_lift_pct: weightedLiftPct,
    baseline_unresolved: baselineUnresolved,
    current_unresolved: currentUnresolved,
    unresolved_reduction: unresolvedReduction,
    domains_improved: domainsImproved,
    domains_degraded: domainsDegraded,
    enriched_domains: enrichedDomains,
    effectiveness_ratio: effectivenessRatio,
    level_transitions: levelLifts,
  };
}

function computeDebtReductionMetrics(debtIndex) {
  if (!debtIndex || !debtIndex.lifecycle) {
    return { available: false, reason: 'debt index lifecycle unavailable' };
  }

  const lc = debtIndex.lifecycle;
  const agg = debtIndex.aggregate_posture;

  const byReducibility = {};
  const byOrigin = {};
  for (const dp of debtIndex.domain_postures) {
    if (dp.debt_status !== 'CLEAR') {
      byReducibility[dp.reducibility] = (byReducibility[dp.reducibility] || 0) + 1;
      byOrigin[dp.origin_type] = (byOrigin[dp.origin_type] || 0) + 1;
    }
  }

  const irreducibleCount = byReducibility['IRREDUCIBLE_STRUCTURAL_ABSENCE'] || 0;
  const reducibleCount = agg.domains_with_debt - irreducibleCount;
  const theoreticalFloor = irreducibleCount;
  const theoreticalCeiling = agg.total_domains - irreducibleCount;

  return {
    available: true,
    baseline_unmapped: lc.baseline_unmapped_count,
    current_unmapped: lc.enriched_unmapped_count,
    reduction_count: lc.debt_reduction_by_enrichment,
    reduction_ratio: lc.debt_reduction_ratio,
    enrichment_impact: lc.enrichment_impact,
    active_debt: lc.active_debt_domains,
    partially_resolved: lc.partially_resolved_domains,
    clear: lc.clear_domains,
    irreducible_floor: theoreticalFloor,
    theoretical_ceiling: theoreticalCeiling,
    remaining_reducible: reducibleCount,
    residual_by_reducibility: byReducibility,
    residual_by_origin: byOrigin,
    weighted_debt_score: agg.weighted_debt_score,
    debt_ratio: agg.debt_ratio,
  };
}

function computeUnresolvedPersistence(lifecycle, debtIndex) {
  const epochs = lifecycle.epochs || [];
  if (epochs.length < 1) {
    return { available: false, reason: 'no epochs' };
  }

  const baselineEpoch = epochs[0];
  const currentEpoch = epochs[epochs.length - 1];
  const baselineDomains = baselineEpoch.per_domain || [];
  const currentDomains = currentEpoch.per_domain || [];

  const baselineUnmapped = new Set(
    baselineDomains.filter(d => d.confidence_level === 1).map(d => d.domain_id)
  );
  const currentUnmapped = new Set(
    currentDomains.filter(d => d.confidence_level === 1).map(d => d.domain_id)
  );

  const persistent = [...baselineUnmapped].filter(id => currentUnmapped.has(id));
  const resolved = [...baselineUnmapped].filter(id => !currentUnmapped.has(id));
  const newlyUnmapped = [...currentUnmapped].filter(id => !baselineUnmapped.has(id));

  const persistentDomains = persistent.map(id => {
    const bl = baselineDomains.find(d => d.domain_id === id);
    const di = debtIndex ? debtIndex.domain_postures.find(dp => dp.domain_id === id) : null;
    return {
      domain_id: id,
      domain_name: bl ? bl.domain_name : id,
      epochs_unmapped: epochs.length,
      reducibility: di ? di.reducibility : null,
      origin_type: di ? di.origin_type : null,
    };
  });

  const resolvedDomains = resolved.map(id => {
    const bl = baselineDomains.find(d => d.domain_id === id);
    const cu = currentDomains.find(d => d.domain_id === id);
    return {
      domain_id: id,
      domain_name: bl ? bl.domain_name : id,
      resolved_to_level: cu ? cu.confidence_level : null,
    };
  });

  const persistenceRatio = baselineUnmapped.size > 0
    ? +(persistent.length / baselineUnmapped.size).toFixed(4)
    : 0;

  return {
    available: true,
    baseline_unmapped_count: baselineUnmapped.size,
    current_unmapped_count: currentUnmapped.size,
    persistent_count: persistent.length,
    resolved_count: resolved.length,
    newly_unmapped_count: newlyUnmapped.length,
    persistence_ratio: persistenceRatio,
    persistent_domains: persistentDomains,
    resolved_domains: resolvedDomains,
    newly_unmapped_domains: newlyUnmapped,
  };
}

function detectDegradation(lifecycle) {
  const deltas = lifecycle.deltas || [];
  const signals = [];

  for (const delta of deltas) {
    const dd = delta.domain_deltas || [];
    for (const d of dd) {
      if (d.delta < 0) {
        signals.push({
          type: 'DOMAIN_CONFIDENCE_DROP',
          domain_id: d.domain_id,
          domain_name: d.domain_name,
          from_level: d.from_level,
          to_level: d.to_level,
          delta: d.delta,
          epoch_transition: `${delta.from_label} → ${delta.to_label}`,
        });
      }
    }

    const sd = delta.summary_delta;
    if (sd) {
      if (sd.weighted_confidence && sd.weighted_confidence.delta < 0) {
        signals.push({
          type: 'WEIGHTED_CONFIDENCE_DROP',
          from: sd.weighted_confidence.from,
          to: sd.weighted_confidence.to,
          delta: sd.weighted_confidence.delta,
          epoch_transition: `${delta.from_label} → ${delta.to_label}`,
        });
      }
      if (sd.unmatched_structural && sd.unmatched_structural.delta > 0) {
        signals.push({
          type: 'STRUCTURAL_COVERAGE_REGRESSION',
          from: sd.unmatched_structural.from,
          to: sd.unmatched_structural.to,
          delta: sd.unmatched_structural.delta,
          epoch_transition: `${delta.from_label} → ${delta.to_label}`,
        });
      }
    }
  }

  return {
    detected: signals.length > 0,
    signal_count: signals.length,
    signals,
  };
}

function computeStructuralSemanticDivergence(lifecycle, debtIndex) {
  const currentEpoch = lifecycle.epochs && lifecycle.epochs[lifecycle.epochs.length - 1];
  if (!currentEpoch) {
    return { available: false, reason: 'no current epoch' };
  }

  const domains = currentEpoch.per_domain || [];
  const indicators = [];

  for (const d of domains) {
    if (d.confidence_level >= 3 && !d.structural_dom_id) {
      indicators.push({
        type: 'SEMANTIC_WITHOUT_STRUCTURAL',
        domain_id: d.domain_id,
        domain_name: d.domain_name,
        confidence_level: d.confidence_level,
        structural_dom_id: null,
        description: 'Domain has semantic confidence without direct structural backing',
      });
    }
  }

  const debtPostures = debtIndex ? debtIndex.domain_postures : [];
  for (const dp of debtPostures) {
    if (dp.enrichment_status === 'AI_RECONSTRUCTED' && dp.enriched_confidence_level <= 2) {
      indicators.push({
        type: 'ENRICHMENT_WEAK_STRUCTURAL_FIT',
        domain_id: dp.domain_id,
        domain_name: dp.domain_name,
        enriched_level: dp.enriched_confidence_level,
        lineage_status: dp.lineage_status,
        description: 'AI enrichment applied but structural fit remains weak',
      });
    }
  }

  const totalDomains = domains.length || debtPostures.length;
  const structurallyGrounded = domains.filter(d => d.confidence_level === 5).length;
  const semanticOnly = domains.filter(d => d.confidence_level >= 2 && d.confidence_level <= 3 && !d.structural_dom_id).length;

  return {
    available: true,
    indicator_count: indicators.length,
    indicators,
    grounded_ratio: totalDomains > 0 ? +(structurallyGrounded / totalDomains).toFixed(4) : 0,
    structurally_grounded: structurallyGrounded,
    semantic_only: semanticOnly,
    total_domains: totalDomains,
    divergence_score: totalDomains > 0 ? +((1 - structurallyGrounded / totalDomains) * 100).toFixed(1) : 0,
  };
}

function compileTemporalAnalytics(inputs) {
  const { lifecycle, debtIndex, client, runId } = inputs;

  const trend = classifyTrend(lifecycle);
  const enrichmentEffectiveness = computeEnrichmentEffectiveness(lifecycle, debtIndex);
  const debtReduction = computeDebtReductionMetrics(debtIndex);
  const unresolvedPersistence = computeUnresolvedPersistence(lifecycle, debtIndex);
  const degradation = detectDegradation(lifecycle);
  const divergence = computeStructuralSemanticDivergence(lifecycle, debtIndex);

  const epochs = lifecycle.epochs || [];
  const epochTimeline = epochs.map((e, i) => ({
    epoch_index: i,
    epoch_label: e.epoch_label,
    enrichment_type: e.enrichment_type,
    weighted_confidence: e.summary ? e.summary.weighted_confidence_score : null,
    reconciliation_ratio: e.summary ? e.summary.reconciliation_ratio : null,
    unresolved_count: e.summary
      ? (e.summary.confidence_distribution ? e.summary.confidence_distribution.level_1_unmapped : null)
      : null,
    total_domains: e.summary ? e.summary.total_semantic_domains : null,
  }));

  const runtimeSummary = {
    trend: trend.label,
    trend_reason: trend.reason,
    enrichment_grade: enrichmentEffectiveness.available ? enrichmentEffectiveness.grade : null,
    weighted_lift: enrichmentEffectiveness.available ? enrichmentEffectiveness.weighted_lift : null,
    debt_reduction_ratio: debtReduction.available ? debtReduction.reduction_ratio : null,
    irreducible_floor: debtReduction.available ? debtReduction.irreducible_floor : null,
    persistent_unmapped: unresolvedPersistence.available ? unresolvedPersistence.persistent_count : null,
    degradation_detected: degradation.detected,
    divergence_score: divergence.available ? divergence.divergence_score : null,
    epoch_count: epochs.length,
  };

  const body = {
    schema_version: SCHEMA_VERSION,
    artifact_type: 'reconciliation_temporal_analytics',
    client,
    run_id: runId,
    generated_at: new Date().toISOString(),
    compiler_version: COMPILER_VERSION,
    trend,
    enrichment_effectiveness: enrichmentEffectiveness,
    debt_reduction: debtReduction,
    unresolved_persistence: unresolvedPersistence,
    degradation,
    structural_semantic_divergence: divergence,
    epoch_timeline: epochTimeline,
    runtime_summary: runtimeSummary,
    governance: {
      deterministic: true,
      replay_safe: true,
      no_inference: true,
      no_enrichment: true,
      no_authority_promotion: true,
    },
    provenance: {
      source_artifacts: [
        'reconciliation_lifecycle.v1.json',
        'semantic_debt_index.v1.json',
      ],
      source_commit: getSourceCommit(),
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitTemporalAnalytics(artifact, client, runId) {
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', client, runId);
  const outputPath = path.join(outputDir, 'reconciliation_temporal_analytics.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  COMPILER_VERSION,
  TREND,
  classifyTrend,
  computeEnrichmentEffectiveness,
  computeDebtReductionMetrics,
  computeUnresolvedPersistence,
  detectDegradation,
  computeStructuralSemanticDivergence,
  compileTemporalAnalytics,
  emitTemporalAnalytics,
};

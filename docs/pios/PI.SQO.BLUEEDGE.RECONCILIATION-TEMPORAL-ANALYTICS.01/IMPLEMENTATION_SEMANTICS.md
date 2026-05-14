# Implementation Semantics

**Stream:** PI.SQO.BLUEEDGE.RECONCILIATION-TEMPORAL-ANALYTICS.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `compileTemporalAnalytics` | ReconciliationTemporalAnalyticsCompiler.js | Master compiler: produces temporal analytics from lifecycle + debt index | Reusable — any client with lifecycle + debt index |
| `emitTemporalAnalytics` | ReconciliationTemporalAnalyticsCompiler.js | Write analytics artifact to governed path | Reusable |
| `classifyTrend` | ReconciliationTemporalAnalyticsCompiler.js | Classify overall trend from lifecycle trajectory | Reusable |
| `computeEnrichmentEffectiveness` | ReconciliationTemporalAnalyticsCompiler.js | Quantify enrichment impact across confidence, unresolved reduction, domain coverage | Reusable |
| `computeDebtReductionMetrics` | ReconciliationTemporalAnalyticsCompiler.js | Compute debt reduction with irreducible floor and residual classification | Reusable |
| `computeUnresolvedPersistence` | ReconciliationTemporalAnalyticsCompiler.js | Identify domains that persist as unmapped across epochs | Reusable |
| `detectDegradation` | ReconciliationTemporalAnalyticsCompiler.js | Detect confidence drops, coverage regressions | Reusable |
| `computeStructuralSemanticDivergence` | ReconciliationTemporalAnalyticsCompiler.js | Identify where semantic confidence lacks structural backing | Reusable |
| `projectTemporalAnalyticsForRuntime` | TemporalAnalyticsProjection.js | Transform analytics artifact into 9-facet runtime projection | Reusable |

## 2. Input Contracts

### compileTemporalAnalytics(inputs)

**inputs.lifecycle** — `reconciliation_lifecycle.v1.json`
- Consumed fields: `epochs[]` (summary, per_domain), `deltas[]` (summary_delta, domain_deltas), `progression` (trajectories, overall_trend)
- Required: YES

**inputs.debtIndex** — `semantic_debt_index.v1.json`
- Consumed fields: `aggregate_posture`, `domain_postures[]` (enrichment_status, reducibility, origin_type), `lifecycle`
- Required: NO (graceful degradation — analytics computed from lifecycle alone if absent)

## 3. Output Contracts

### Analytics Artifact Shape (`reconciliation_temporal_analytics.v1.json`)
```
{
  schema_version, artifact_type, client, run_id, generated_at, compiler_version,
  trend: { label, reason },
  enrichment_effectiveness: { available, grade, weighted_lift, weighted_lift_pct,
    unresolved_reduction, domains_improved, domains_degraded, effectiveness_ratio, level_transitions },
  debt_reduction: { available, baseline_unmapped, current_unmapped, reduction_count,
    reduction_ratio, enrichment_impact, irreducible_floor, remaining_reducible,
    residual_by_reducibility, residual_by_origin, weighted_debt_score },
  unresolved_persistence: { available, baseline_unmapped_count, current_unmapped_count,
    persistent_count, resolved_count, persistence_ratio, persistent_domains[], resolved_domains[] },
  degradation: { detected, signal_count, signals[] },
  structural_semantic_divergence: { available, divergence_score, structurally_grounded,
    semantic_only, total_domains, grounded_ratio, indicators[] },
  epoch_timeline: [{ epoch_index, epoch_label, enrichment_type, weighted_confidence,
    reconciliation_ratio, unresolved_count, total_domains }],
  runtime_summary: { trend, trend_reason, enrichment_grade, weighted_lift, debt_reduction_ratio,
    irreducible_floor, persistent_unmapped, degradation_detected, divergence_score, epoch_count },
  governance, provenance
}
```

### Runtime Projection Shape
```
{ trend, enrichmentEffectiveness, debtReduction, unresolvedPersistence,
  degradation, divergence, epochTimeline, runtimeSummary, provenance }
```

## 4. Calibration Assumptions

| Constant | Value | Nature |
|----------|-------|--------|
| Trend classification thresholds | ±5 weighted confidence | Tunable |
| Enrichment grade thresholds | HIGH: ≥20 lift + ≥8 reduction; MODERATE: ≥10 + ≥4; LOW: >0; NONE: 0 | Tunable |
| Degradation signals | confidence_drop < 0, unmatched_structural increase > 0 | Fixed detection criteria |

## 5. Extension Points

- **Epoch accumulation**: compiler handles any number of epochs (2+); future enrichment passes add epochs
- **Degradation signal types**: new signal types can be added without modifying existing detection
- **Divergence indicators**: new indicator types extensible alongside existing ones
- **Trend classification**: thresholds can be adjusted for different operational sensitivity
- **Multi-client**: compiler parameterized by client/runId — works for any client

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| ReconciliationTemporalAnalyticsCompiler.js | Analytics compilation: trend, effectiveness, reduction, persistence, degradation, divergence |
| TemporalAnalyticsProjection.js | Runtime projection: transforms artifact into consumable shapes |
| SQOCockpitArtifactLoader.js | Artifact registry: loads temporal analytics alongside SQO artifacts |
| SQOCockpitFormatter.js | Integration: includes temporal analytics projection in reconciliation section |
| compile_blueedge_temporal_analytics.js | Compilation script: orchestrates BlueEdge-specific compilation |

# Implementation Semantics

**Stream:** PI.SQO.BLUEEDGE.SEMANTIC-DEBT-INDEX.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `compileDebtIndex` | SemanticDebtIndexCompiler.js | Compile semantic debt index from 4 source artifacts | Reusable — any client with debt inventory + correspondence |
| `emitDebtIndex` | SemanticDebtIndexCompiler.js | Write debt index artifact to governed path | Reusable |
| `buildDomainPosture` | SemanticDebtIndexCompiler.js | Build classified debt posture for a single domain | Reusable |
| `classifyReducibility` | SemanticDebtIndexCompiler.js | Classify whether debt is reducible and how | Reusable |
| `classifyOriginType` | SemanticDebtIndexCompiler.js | Classify the origin of debt (structural absence vs enrichment residual vs unresolved correspondence) | Reusable |
| `classifyExposure` | SemanticDebtIndexCompiler.js | Classify operational exposure level from confidence | Reusable |
| `classifyDebtStatus` | SemanticDebtIndexCompiler.js | Classify domain debt status (CLEAR/ACTIVE/PARTIALLY_RESOLVED) | Reusable |
| `computeWeightedDebtScore` | SemanticDebtIndexCompiler.js | Aggregate weighted debt score across all domains | Reusable |
| `projectDebtIndexForRuntime` | SemanticDebtIndexProjection.js | Transform debt index artifact into runtime projection shape | Reusable |
| `projectAggregatePosture` | SemanticDebtIndexProjection.js | Project aggregate posture for runtime surfaces | Reusable |
| `projectDomainPostures` | SemanticDebtIndexProjection.js | Project per-domain postures for rendering | Reusable |
| `projectReducibilitySummary` | SemanticDebtIndexProjection.js | Project reducibility distribution with irreducible/reducible counts | Reusable |
| `projectOriginSummary` | SemanticDebtIndexProjection.js | Project origin type distribution | Reusable |
| `projectExposureSummary` | SemanticDebtIndexProjection.js | Project exposure distribution with high-exposure domain list | Reusable |

## 2. Input Contracts

### compileDebtIndex(inputs)

**inputs.debtInventory** — `semantic_debt_inventory.v1.json`
- Consumed fields: `debt_items[]` (id, category, severity, evidence.field_path, blocks_s_state)
- Required: YES

**inputs.baselineCorrespondence** — `reconciliation_correspondence.v1.json`
- Consumed fields: `correspondences[]` (semantic_domain_id, semantic_domain_name, confidence_level, reconciliation_status, crosswalk_lineage_status, semantic_domain_type, cluster_id)
- Required: YES

**inputs.enrichedCorrespondence** — `reconciliation_correspondence.enriched.v1.json`
- Consumed fields: `correspondences[]` (semantic_domain_id, confidence_level, reconciliation_status)
- Required: NO (graceful degradation — baseline used if absent)

**inputs.enrichedTopology** — `semantic_topology_model.enriched.json`
- Consumed fields: `domains[]` (domain_id, domain_name, domain_type, cluster_id, enrichment_status, enrichment_reason, lineage_status, confidence)
- Required: NO (graceful degradation — reducibility classification limited if absent)

### projectDebtIndexForRuntime(debtIndexArtifact)
- Input: output of `compileDebtIndex` (the full artifact)
- Returns: 8-facet runtime projection shape

## 3. Output Contracts

### Debt Index Artifact Shape (`semantic_debt_index.v1.json`)
```
{
  schema_version, artifact_type, client, run_id, generated_at, compiler_version,
  aggregate_posture: { total_domains, total_debt_items, domains_with_debt, domains_clear,
    severity_distribution, reducibility_distribution, origin_distribution, exposure_distribution,
    s_state_blocking_count, operational_exposure, debt_ratio, weighted_debt_score, qualification_impact },
  domain_postures: [{ domain_id, domain_name, domain_type, cluster_id, debt_status, debt_item_ids,
    debt_item_count, baseline_confidence_level, enriched_confidence_level, confidence_delta,
    lineage_status, reconciliation_status, enrichment_status, enrichment_reason, reducibility,
    origin_type, operational_exposure }],
  continuity_debt: [{ id, category, severity, description, origin_type }],
  lifecycle: { baseline_unmapped_count, enriched_unmapped_count, debt_reduction_by_enrichment,
    debt_reduction_ratio, enrichment_impact, active_debt_domains, partially_resolved_domains, clear_domains },
  classification_framework: { reducibility_definitions, origin_type_definitions, exposure_levels, debt_status_definitions },
  governance: { deterministic, replay_safe, no_inference, no_enrichment, no_authority_promotion },
  provenance: { source_artifacts, source_commit, output_hash }
}
```

### Runtime Projection Shape
```
{
  aggregatePosture, domainPostures[], lifecycle, reducibilitySummary,
  originSummary, exposureSummary, continuityDebt, provenance
}
```

## 4. Calibration Assumptions

| Constant | Value | Nature |
|----------|-------|--------|
| REDUCIBILITY enum | IRREDUCIBLE_STRUCTURAL_ABSENCE, REDUCIBLE_BY_EVIDENCE, REDUCED_BY_ENRICHMENT, NOT_APPLICABLE | Governed classification vocabulary |
| ORIGIN_TYPE enum | STRUCTURAL_ABSENCE, ENRICHMENT_RESIDUAL, UNRESOLVED_CORRESPONDENCE, CONTINUITY_DEFICIENCY, NONE | Governed classification vocabulary |
| EXPOSURE_LEVEL enum | NONE, LOW, MEDIUM, HIGH | Threshold-based: L5→NONE, L3+→LOW, L2→MEDIUM, L1→HIGH |
| DEBT_STATUS enum | CLEAR, ACTIVE, PARTIALLY_RESOLVED | State classification |
| Weighted debt level weights | L5=0, L4=1, L3=2, L2=3, L1=5 | Tunable — higher weight for lower confidence |
| Enrichment impact thresholds | ≥50%=SIGNIFICANT, ≥25%=MODERATE, <25%=MARGINAL | Tunable |

## 5. Extension Points

- **Reducibility vocabulary**: new categories can be added (e.g., REDUCIBLE_BY_REBASE for evidence rebase scenarios)
- **Origin type vocabulary**: extensible (e.g., SEMANTIC_AMBIGUITY if detected in future topology models)
- **Domain posture fields**: additional metadata can be appended without breaking existing consumers
- **Projection facets**: new projections can be added to SemanticDebtIndexProjection without modifying existing ones
- **Weighted debt scoring**: level weights are adjustable for different operational sensitivity profiles
- **Multi-client**: compiler is parameterized by client/runId — works for any client with the 4 source artifacts

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| SemanticDebtIndexCompiler.js | Classification + compilation: reads 4 source artifacts, classifies each domain, produces debt index artifact |
| SemanticDebtIndexProjection.js | Runtime projection: transforms artifact into 8-facet runtime shape |
| SQOCockpitArtifactLoader.js | Artifact registry: loads debt index alongside other SQO artifacts |
| SQOCockpitFormatter.js | Integration: includes debt index projection in formatted debt section |
| compile_blueedge_debt_index.js | Compilation script: orchestrates BlueEdge-specific compilation |

## 7. Debt Lifecycle

```
Source Artifacts → SemanticDebtIndexCompiler → semantic_debt_index.v1.json
                                                        ↓
                                              SemanticDebtIndexProjection
                                                        ↓
                                              Runtime Projection Shape
                                                   ↓        ↓
                                              SQO Cockpit   LENS v2
```

### Replay Boundaries
- Compiler is deterministic: same inputs → same output (excluding timestamp)
- Replay verified by running compiler twice and comparing (excluding generated_at, output_hash)
- Source artifacts are immutable for a given client/run — replay safety guaranteed
- No external API calls, no network dependencies

### Operational Semantics
- Debt index is a downstream consumer of reconciliation and enrichment outputs
- Does not modify any source artifact
- Does not promote authority (debt posture is advisory, not governance)
- Operational exposure classification is threshold-based, not inferred
- Reducibility classification reflects enrichment outcomes, not predictions

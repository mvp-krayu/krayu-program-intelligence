# Implementation Semantics — PI.SOFTWARE-INTELLIGENCE.EXECUTION-FRAGILITY-SLICE.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `fragility_surface` computation | GenericSemanticPayloadResolver.js | Derives per-file cohesion/coupling/fragility from raw IMPORTS edges | REUSABLE — consumed by any rule function accessing structuralEnrichment |
| `module_of(path)` | GenericSemanticPayloadResolver.js | Groups files into modules by first 2 path segments | REUSABLE — generic path-to-module resolution |
| `ruleExecutionFragility()` | SignalSynthesisEngine.js | Produces EXECUTION_FRAGILITY conditions from fragility_surface data | CONDITION-SPECIFIC — follows established rule function pattern |
| `mapEF()` | ConsequenceCompiler.js | Maps EXECUTION_FRAGILITY condition to RESIL_DEF, COORD_FRAG, DEP_AMP consequences | CONDITION-SPECIFIC — follows established mapping pattern |

## 2. Input Contracts

### fragility_surface computation

**Consumed from:** `codeGraphData.data.relationships` (first argument to `deriveStructuralEnrichment`)

**Expected shape:**
```
relationships[]: {
  relation_type: string,    // filters for 'IMPORTS'
  source_path: string,      // file path of importing file
  target_path: string,      // file path of imported file
}
```

**Fallback:** When `relationships` is absent or empty, falls back to centrality-based degree-ratio proxy using `relationship_summary.import_out_degree` and `relationship_summary.import_in_degree` from `centrality_ranking` entries.

### ruleExecutionFragility

**Consumed from:** `structuralEnrichment.fragility_surface`

**Expected shape:**
```
fragility_surface: {
  fragility_hotspots: [{
    path: string,
    fragility_score: number,
    coupling: number,
    cohesion: number,
    structural_role: string,
    role_context: string | null,
    module_prefix: string,
  }],
  thresholds: { fragility_threshold: number },
  fragile_count: number,
}
```

## 3. Output Contracts

### fragility_surface (enrichment output)

```
enrichment.fragility_surface = {
  fragility_hotspots: [...],        // files exceeding fragility threshold
  module_cohesion: [...],           // per-module aggregated cohesion/fragility stats
  absorptive_modules: [...],        // modules with mean_cohesion >= 0.7
  thresholds: {
    coupling_min: 5,                // minimum edge count for meaningful measurement
    fragility_threshold: number,    // max(p75, nonZeroMedian)
  },
  fragile_count: number,
  absorptive_count: number,
  cohesion_source: 'IMPORT_EDGE_ANALYSIS' | 'DEGREE_RATIO_PROXY',
}
```

### EXECUTION_FRAGILITY condition (rule output)

Standard 17-field condition shape plus:
- `_has_hub_fragility: boolean` — true when any hotspot in domain has `role_context === 'fragile_hub'`
- `fragility_evidence: { hotspot_count, max_fragility, mean_fragility, hotspot_files: [...] }`
- `topology_overlay.overlay_mode: 'FRAGILITY_HOTSPOT'`
- `governance_boundary: 'STRUCTURAL_ONLY'`
- `evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED'`

## 4. Calibration Assumptions

| Parameter | Value | Tuned/Governed |
|-----------|-------|----------------|
| `coupling_min` | 5 | TUNED — minimum edge count for meaningful cohesion measurement |
| Module depth | 2 segments | TUNED — `path.split('/').slice(0, 2)` for module grouping |
| Fragility threshold | `max(p75, nonZeroMedian)` | TUNED — avoids zero-median when many files have perfect cohesion |
| HIGH severity | `maxFrag >= p90` | TUNED — top 10th percentile of all fragility scores |
| ELEVATED severity | `maxFrag >= medianScore * 3` | TUNED — 3x median |
| Absorptive threshold | `mean_cohesion >= 0.7` | TUNED — module-level absorptive classification |

## 5. Extension Points

| Point | Description |
|-------|-------------|
| Module grouping depth | Currently 2 segments — could be parameterized per client/repo structure |
| Temporal fragility | Could extend with churn data to compute fragility-over-time trajectories |
| Cross-module fragility corridors | fragility_surface data enables corridor analysis between fragile modules |
| Fragility-weighted propagation | Fragility scores could weight propagation analysis in future slice types |

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| GenericSemanticPayloadResolver.js | Computes raw fragility_surface from import edge data — data layer |
| SignalSynthesisEngine.js | Derives EXECUTION_FRAGILITY conditions from enrichment — condition engine |
| ConsequenceCompiler.js | Maps conditions to consequence types — consequence pipeline |
| CognitionOntology.js | Defines ontology graph structure — static knowledge graph |
| InvestigationVerifier.js | Validates condition→consequence derivation — verification layer |
| IntelligenceField.jsx | Renders condition glyph — visual projection |
| StructuralTopologyZone.jsx | Renders topology overlay color — visual projection |
| SoftwareIntelligenceProjectionAdapter.js | Maps surface categories to conditions — projection routing |

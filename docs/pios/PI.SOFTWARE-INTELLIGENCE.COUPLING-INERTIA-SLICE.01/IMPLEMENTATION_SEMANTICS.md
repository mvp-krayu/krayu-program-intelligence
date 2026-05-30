# PI.SOFTWARE-INTELLIGENCE.COUPLING-INERTIA-SLICE.01 — Implementation Semantics

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| coupling_inertia enrichment | GenericSemanticPayloadResolver.js | Bidirectional cluster detection via union-find | REUSABLE — consumed by ruleCouplingInertia |
| ruleCouplingInertia | SignalSynthesisEngine.js | Condition synthesis from enrichment surface | REUSABLE — standard condition engine pattern |
| mapCI | ConsequenceCompiler.js | Consequence derivation for COUPLING_INERTIA | REUSABLE — standard consequence mapping pattern |
| COUPLING_INERTIA CONDITION_NODE | CognitionOntology.js | Ontology graph node with behavioral descriptions | REUSABLE — consumed by all persona projections |

## 2. Input Contracts

### enrichment.coupling_inertia (Phase 1 → Phase 2)

Consumed by `ruleCouplingInertia()` from `structuralEnrichment.coupling_inertia`.

Expected shape:
```
{
  inertia_clusters: [{
    modules: string[],        // sorted module prefixes
    module_count: number,
    bidirectional_pairs: number,
    intra_edge_count: number,
    density: number,          // 0..1
    inertia_score: number,
  }],
  system_coupling_index: number, // coupled_modules / total_modules
  thresholds: { min_cluster_size: number, inertia_median: number },
  cluster_count: number,
  coupled_module_count: number,
  total_module_count: number,
  bidirectional_pair_count: number,
  inertia_source: 'IMPORT_EDGE_ANALYSIS',
}
```

Required upstream: `codeGraphData.data.relationships` with `relation_type: 'IMPORTS'`, `source_path`, `target_path` fields. Minimum 6 import edges.

### COUPLING_INERTIA condition (Phase 2 → Phase 3)

Standard 17-field condition shape plus:
- `_has_choke_in_cluster: boolean` — consumed by mapCI for conditional DEP_AMP
- `inertia_evidence: { cluster_count, max_inertia, has_choke_in_cluster, system_coupling_index, inertia_source, clusters[] }`

## 3. Output Contracts

### Consequence outputs (Phase 3)

- COORD_FRAG: Always produced (defining). Scope: LOCAL.
- OP_BOTTLENECK: Produced when severity >= ELEVATED (conditional). Scope: LOCAL.
- DEP_AMP: Produced when `_has_choke_in_cluster` is true (conditional). Scope: LOCAL.

### Ontology outputs (Phase 4)

- COUPLING_INERTIA downstream: COORD_FRAG (defining), OP_BOTTLENECK (conditional), DEP_AMP (conditional)
- COORD_FRAG, DEP_AMP, OP_BOTTLENECK upstream: COUPLING_INERTIA refs added
- §4 governance upstream: COUPLING_INERTIA ref added

### Visual outputs (Phase 6)

- Glyph: 'coupling' (reuses existing SVG glyph)
- Overlay color: '#b794f4' (soft violet — new Class D cognitive category)
- Surface: STRUCTURAL_COUPLING

## 4. Calibration Assumptions

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| min_cluster_size | 3 | Bidirectional pairs (size 2) are common and often intentional; inertia applies at 3+ |
| min_import_edges | 6 | Below 6 total edges, module graph is too sparse for meaningful clustering |
| inertia_score formula | density * module_count * log2(max(intra_edges, 2)) | Balances density, size, and edge weight |
| severity p90 → HIGH | Top 10% of cluster scores | Consistent with EF/EC/SBD severity calibration |
| severity median*3 → ELEVATED | 3x median score | Consistent with EF/EC/SBD severity calibration |
| module_of heuristic | path.split('/').slice(0, 2).join('/') | Shared across all enrichment surfaces — pragmatic for BlueEdge |

## 5. Extension Points

1. **Module membership heuristic.** The `moduleOf()` path prefix function is shared across all enrichment surfaces. If a future specimen uses a different directory convention, this function is the single parameterization point.

2. **Cluster minimum size.** The `min_cluster_size: 3` threshold could be parameterized per specimen if bidirectional pairs carry different semantic weight in different codebases.

3. **Inertia score formula.** The density * size * log(edges) formula could be extended with additional factors (e.g., weighted by file count within cluster modules, or by centrality of cluster members).

4. **Cross-enrichment references.** The `_has_choke_in_cluster` flag cross-references `constriction_surface` from EC enrichment. Similar cross-references to `fragility_surface` or `boundary_divergence` could be added for richer interaction modeling.

## 6. Module Responsibility Map

| File | Responsibility |
|------|---------------|
| GenericSemanticPayloadResolver.js | Computes coupling_inertia enrichment from raw import edges |
| SignalSynthesisEngine.js | Synthesizes COUPLING_INERTIA conditions from enrichment, manages vocabulary/interventions/roleMap |
| ConsequenceCompiler.js | Maps COUPLING_INERTIA to COORD_FRAG/OP_BOTTLENECK/DEP_AMP consequences |
| CognitionOntology.js | Defines COUPLING_INERTIA ontology node and upstream/downstream graph connections |
| InvestigationVerifier.js | Validates condition→consequence derivation rules and projection disposition |
| IntelligenceField.jsx | Maps COUPLING_INERTIA to 'coupling' dynamics glyph |
| StructuralTopologyZone.jsx | Maps COUPLING_CLUSTER overlay to '#b794f4' color |
| SoftwareIntelligenceProjectionAdapter.js | Maps STRUCTURAL_COUPLING surface to COUPLING_INERTIA condition |

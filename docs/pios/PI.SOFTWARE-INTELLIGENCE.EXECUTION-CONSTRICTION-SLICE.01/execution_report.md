# PI.SOFTWARE-INTELLIGENCE.EXECUTION-CONSTRICTION-SLICE.01 — Execution Report

## Stream Metadata

| Field | Value |
|-------|-------|
| Stream ID | PI.SOFTWARE-INTELLIGENCE.EXECUTION-CONSTRICTION-SLICE.01 |
| Classification | G1 (architecture-mutating — new enrichment surface, condition type, consequence mappings, ontology node) |
| Branch | `feature/runtime-demo` |
| Baseline | `b110dd8` |
| §5.5 | YES — new reusable code primitives |
| Source authority | BEHAVIORAL_SLICE_INVENTORY.md §4.2 (Candidate C-2, N-2) |
| Governing rule | "The behavior is the slice. The graph metric is evidence." |

## Pre-Flight

| Check | Status |
|-------|--------|
| Branch authorized | YES — feature/runtime-demo owns app/execlens-demo |
| Canonical state loaded | YES |
| Terminology loaded | YES |
| Behavioral inventory consulted | YES — N-2 (Execution Constriction, Class A, ACCEPTED) |

## Behavioral Pattern

Operational flow is forced through a narrow structural passage, creating a throughput ceiling that cannot be raised by adding capacity. Work queues up because the structure permits only sequential or tightly-coordinated passage through this point.

**Distinction from Dependency Choke Point:** DChP measures inbound dependency count (how many things depend on it). Execution Constriction measures path centrality — through-flow (how many paths pass through it) plus bridge detection (whether removing it disconnects regions). Different graph properties, different operational questions, different failure modes.

## Implementation

### Phase 1: Data Foundation — GenericSemanticPayloadResolver.js

Added `enrichment.constriction_surface` computation using raw import edges:

1. Build directed adjacency lists from IMPORTS edges
2. Build undirected adjacency for articulation point detection
3. Run Tarjan's algorithm (DFS-based, O(V+E)) to find articulation points — structural bridges whose removal disconnects the import graph
4. Compute through-flow per node: `min(in_degree, out_degree)` — nodes with both inbound and outbound edges are path conduits
5. Score: `constriction = through_flow * (is_bridge ? 3 : 1)` — bridge multiplier amplifies articulation points
6. Threshold: `constriction_score > max(p75, median * 2)` OR `is_bridge`
7. Fallback: degree-ratio proxy from centrality ranking when no raw edges

Output shape:
```
enrichment.constriction_surface = {
  constriction_hotspots: [{ path, constriction_score, through_flow, in_degree, out_degree, is_bridge, structural_role, centrality_rank, module_prefix }],
  thresholds: { through_flow_min, constriction_threshold },
  constriction_count, bridge_count, articulation_point_count, total_nodes,
  constriction_source: 'IMPORT_EDGE_ANALYSIS' | 'DEGREE_RATIO_PROXY',
}
```

### Phase 2: Condition Engine — SignalSynthesisEngine.js

- CONDITION_VOCABULARY: +EXECUTION_CONSTRICTION
- CONDITION_INTERVENTIONS: +EXECUTION_CONSTRICTION (inspect bottleneck, trace paths, compare alternatives)
- roleMap: +EXECUTION_CONSTRICTION → 'constriction point'
- `ruleExecutionConstriction()`: derives from `structuralEnrichment.constriction_surface`, produces one EXECUTION_CONSTRICTION condition per affected domain
- Severity: max_constriction >= p90 → HIGH, >= median*3 → ELEVATED, else MODERATE
- `_has_bridge_constriction: true` when any hotspot is an articulation point
- synthesize() and synthesizeTeaser(): +ruleExecutionConstriction

### Phase 3: Consequence Pipeline — ConsequenceCompiler.js

- `mapEC()`: OP_BOTTLENECK (defining, always), COORD_FRAG (conditional, severity >= ELEVATED), DEP_AMP (conditional, when bridge constriction present)
- mapCondition switch: +case EXECUTION_CONSTRICTION
- COGNITION_SLICE_VOCABULARY: +EXECUTION_CONSTRICTION (is_dynamic: true, executive_name: 'Execution Constriction')
- MAP_CONDITION_KEYS: +EXECUTION_CONSTRICTION

### Phase 4: Cognition Ontology — CognitionOntology.js

- CONDITION_NODES: +EXECUTION_CONSTRICTION with behavioral-first descriptions
- Downstream: OP_BOTTLENECK (defining), COORD_FRAG (conditional), DEP_AMP (conditional)
- OP_BOTTLENECK upstream: +EXECUTION_CONSTRICTION (defining)
- COORD_FRAG upstream: +EXECUTION_CONSTRICTION (conditional)
- DEP_AMP upstream: +EXECUTION_CONSTRICTION (conditional)
- §4 RULE_NODES upstream: +EXECUTION_CONSTRICTION (governance)

### Phase 5: Investigation Verifier — InvestigationVerifier.js

- SECTION_4_RULES: +EXECUTION_CONSTRICTION (OP_BOTTLENECK defining, COORD_FRAG conditional, DEP_AMP conditional)
- PROJECTION_DISPOSITION_TABLE: +EXECUTION_CONSTRICTION (all REQUIRED)

### Phase 6: Visual Projection

- DYNAMICS_GLYPH_TYPE: +EXECUTION_CONSTRICTION → 'hub' (reuses existing hub glyph — constriction IS a structural hub behavior)
- COGNITION_OVERLAY_COLORS: +CONSTRICTION_POINT → '#ffd700' (amber — distinct from red fragility, blue coupling)
- SURFACE_CONDITION_MAP: COORDINATION_SATURATION += 'EXECUTION_CONSTRICTION' (flow bottleneck surfaces with DChP and CDCP)

## Key Design Decisions

1. **Tarjan's algorithm for bridge detection.** O(V+E) articulation point detection is feasible for 680 nodes / 2139 edges. Identifies structural bridges whose removal disconnects regions — the topological definition of a constriction point.

2. **Through-flow metric.** `min(in_degree, out_degree)` captures nodes that both receive and transmit — path conduits. A node with high in-degree but no out-degree is a sink, not a constriction. A node with high out-degree but no in-degree is a source, not a constriction.

3. **Bridge multiplier (3x).** Articulation points are categorically more constricting than high-flow nodes because removing them disconnects the graph. Non-bridge high-flow nodes have alternative paths; bridge nodes do not.

4. **Consequence mapping follows inventory specification.** OP_BOTTLENECK (defining — constriction IS the bottleneck mechanic), COORD_FRAG (conditional — constricted paths force coordination), DEP_AMP (conditional — when a bridge constriction also acts as a dependency hub, both behaviors compound).

5. **Surface mapping to COORDINATION_SATURATION.** Constriction shares operational semantics with dependency choke points (both constrain flow) rather than fragility (structural weakness) or propagation (change spread).

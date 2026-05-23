# PATH A Signal Integration Map

> **Canonical mapping of where signal families emerge from the PATH A structural substrate.**
> **Established:** 2026-05-23
> **Stream:** PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01

---

## Purpose

This page maps every signal family to its precise emergence point in the PATH A structural substrate. It answers: "at which pipeline phase, from which artifact, does each signal family's structural truth become available?"

PATH B specimens follow the same spine but with fewer emergence points (no 40.3s, no 40.3c, no Level 1 families).

---

## Emergence Point Map

### Phase 3: Structural Verification (40.2, 40.3, 40.4)

| Artifact | What Becomes Available | Signal Family | Status |
|----------|----------------------|---------------|--------|
| 40.2/structural_node_inventory.json | Node namespace, file paths, total node count | Provides node_id resolution for all downstream families | OPERATIONAL |
| 40.3/structural_topology_log.json | Containment topology, regex-detected IMPORTS | Base topology for edge relationships | OPERATIONAL |
| 40.4/canonical_topology.json | Cluster structure (cluster_id, node_count, membership) | **DPSIG** — CPI and CFA derive entirely from this | OPERATIONAL |

**DPSIG emergence:** 40.4 is the SOLE input. DPSIG-031 (CPI) and DPSIG-032 (CFA) can be computed immediately after Phase 3 completes. The `derive_relational_signals.py` script is standalone — it does not require any downstream pipeline phase.

### Phase 3.5: Structural Relevance Classification (40.2r)

| Artifact | What Becomes Available | Signal Family | Status |
|----------|----------------------|---------------|--------|
| 40.2r/structural_relevance.json | PRIMARY/SUPPORT/PERIPHERAL classification per node | Determines which nodes enter DOM layer and downstream binding | OPERATIONAL |

No signal family derives directly from 40.2r. Its influence is GATING — it determines the node population that enters Phase 5 binding, which then drives PSIG.

### Phase 3.6: Code-Graph Enrichment (40.3s)

| Artifact | What Becomes Available | Signal Family | Status |
|----------|----------------------|---------------|--------|
| 40.3s/code_graph.json | Resolved IMPORTS edges, DEFINES_CLASS, DEFINES_FUNCTION | **ISIG** candidate source: per-file import in/out degree is derivable from relationship counts | PARTIALLY_IMPLIED |

**ISIG emergence:** 40.3s contains the raw evidence. Per-file import counts (hub pressure, fan asymmetry) are COMPUTABLE from 40.3s at this point. Currently not computed as named signals.

**Downstream influence on PSIG:** 40.3s IMPORTS relationships propagate through Phase 5 enrichment → IMPORTS_ACROSS edges in binding → changed PSIG fan metrics.

### Phase 3.7: Structural Centrality (40.3c)

| Artifact | What Becomes Available | Signal Family | Status |
|----------|----------------------|---------------|--------|
| 40.3c/structural_centrality.json | Per-file centrality metrics (in_degree, out_degree, structural_throughput_proxy, structural_role, centrality_rank) | **CSIG** candidate source: centrality concentration, role distribution are derivable | PARTIALLY_IMPLIED |

**CSIG emergence:** 40.3c contains computed centrality metrics and structural role classification (7 roles). Gini coefficient of centrality, role distribution skew, throughput peak are all COMPUTABLE at this point.

**Downstream influence on PSIG:** 40.3c centrality_evidence annotations are added to CE nodes in Phase 5 binding, but these are NODE ATTRIBUTES (not edges) — they do NOT change fan metrics and therefore do NOT influence PSIG values.

### Phase 5: Binding Envelope Construction

| Artifact | What Becomes Available | Signal Family | Status |
|----------|----------------------|---------------|--------|
| binding/binding_envelope.json | Complete binding topology: nodes (BC + CE + CS), edges (GROUNDS + EXPOSES + IMPORTS_ACROSS), capability_surfaces | **PSIG** source: fan_in, fan_out, surfaces_per_ceu, cluster isolation all derivable | OPERATIONAL |
| binding/binding_envelope.json | Binding metadata: node counts, edge counts, enrichment stats | **BSIG** candidate source: coverage ratio, cross-DOM density, grounding uniformity, orphan ratio | NEW |
| Phase 5 enrichment step (40.3s → binding) | Delta between pre-enrichment and post-enrichment binding | **ESIG** candidate source: enrichment lift, enrichment coverage | NEW |
| dom/dom_layer.json | DOM layer save-through with re-indexed node IDs | Used by Phase 5b; not directly signal-relevant | OPERATIONAL |

**PSIG emergence:** The binding envelope is the SOLE input to PSIG computation. All 4 PSIG signals derive from the binding's node/edge/surface topology.

**BSIG emergence:** The binding envelope contains all the metadata needed for BSIG computation. BSIG measures the binding's own quality — coverage, uniformity, orphan rate.

**ESIG emergence:** The enrichment step in Phase 5 adds IMPORTS_ACROSS edges from 40.3s. The delta (edges added, DOM groups connected) is the ESIG source.

### Phase 6+7: Signal Computation

| Artifact | What Becomes Available | Signal Family | Status |
|----------|----------------------|---------------|--------|
| 75.x/condition_correlation_state.json | Per-node PSIG conditions (HIGH/NORMAL/ACTIVATED) | PSIG conditions with attribution | OPERATIONAL |
| 75.x/pressure_candidate_state.json | Entities with ≥2 activated conditions | Pressure zone candidates | OPERATIONAL |
| 75.x/pressure_zone_state.json | Zone designations with zone_class | Pressure zone topology | OPERATIONAL |
| 41.x/signal_projection.json | Projected signal values with full attribution | PSIG projection ready for LENS | OPERATIONAL |
| 41.x/pressure_zone_projection.json | Projected zone state | Pressure zone projection ready for LENS | OPERATIONAL |

### Phase 8a: Vault Construction

| Artifact | What Becomes Available | Signal Family | Status |
|----------|----------------------|---------------|--------|
| vault/signal_registry.json | PSIG signals in vault format (PSIG labels, population types, GR-01 guardrail) | PSIG in vault — canonical signal state | OPERATIONAL |
| vault/binding_envelope.json | Copy of Phase 5 binding | Binding in vault — available for LENS structural metrics | OPERATIONAL |

---

## PATH B Differences

PATH B specimens (HTML evidence, no code graph) have a REDUCED emergence map:

| Phase | PATH A | PATH B |
|-------|--------|--------|
| Phase 3 (40.2, 40.3, 40.4) | Available | Available |
| Phase 3.5 (40.2r) | Available | Available |
| Phase 3.6 (40.3s) | Available | **NOT AVAILABLE** — no code graph |
| Phase 3.7 (40.3c) | Available | **NOT AVAILABLE** — depends on 40.3s |
| Phase 5 (binding) | Full: GROUNDS + EXPOSES + IMPORTS_ACROSS | Reduced: GROUNDS + EXPOSES only (no IMPORTS_ACROSS enrichment) |
| Phase 6+7 (PSIG) | Full: Level 1 + Level 2 | Reduced: Level 2 only |
| DPSIG | Available (40.4) | Available (40.4) |

**Signal family availability:**

| Family | PATH A | PATH B |
|--------|--------|--------|
| PSIG | YES (Level 1 enriched) | YES (Level 2 only) |
| DPSIG | YES | YES |
| BSIG | YES | YES |
| ISIG | YES | NO — requires 40.3s |
| CSIG | YES | NO — requires 40.3c |
| ESIG | YES | NO — requires 40.3s enrichment |

---

## Enrichment Propagation: 40.3s → PSIG

The enrichment path is the critical bridge between Level 1 and Level 2:

```
40.3s code_graph.json (2,138 IMPORTS for BlueEdge)
  │
  └─ Phase 5: _enrich_binding_with_structural_evidence()
       │
       ├─ Step 1: Load 40.3s IMPORTS relationships
       │
       ├─ Step 2: Build DOM membership index from dom/dom_layer.json
       │    (which node_id belongs to which DOM group, via evidence_paths)
       │
       ├─ Step 3: For each IMPORTS relationship where source_node_dom ≠ target_node_dom:
       │    Aggregate cross-DOM import count per (source_dom, target_dom) pair
       │
       ├─ Step 4: Emit IMPORTS_ACROSS edges in binding envelope
       │    (BlueEdge: 4 edges — DOM-09→DOM-05, DOM-04→DOM-05, DOM-04→DOM-09, DOM-08→DOM-05)
       │
       └─ Step 5: Annotate GROUNDS edges with import_evidence.import_count
            (per-edge count of within-DOM IMPORTS relationships)
```

**Enrichment impact on PSIG (BlueEdge):**
- Without enrichment: 29 edges (19 GROUNDS + 10 EXPOSES), mean_fan = 29/33 = 0.879
- With enrichment: 33 edges (19 GROUNDS + 10 EXPOSES + 4 IMPORTS_ACROSS), mean_fan = 33/33 = 1.0
- Delta: 4 edges added → fan_out of DOM-04, DOM-08, DOM-09 increases → PSIG-002 values shift
- The 4 enrichment edges are 12.1% of the total edge population

---

## Level 1 → Level 2 Intelligence Gap (Certified)

The enrichment path compresses 2,138 source-level IMPORTS to 4 IMPORTS_ACROSS edges (535:1 ratio). This compression preserves aggregate coupling direction but LOSES file-level distribution. Specific intelligence gaps:

| Intelligence | Level 1 (40.3s/40.3c) | Level 2 (binding) | Status |
|-------------|----------------------|-------------------|--------|
| Import hub concentration (e.g., common/dto/index.ts = 111 inbound) | VISIBLE | INVISIBLE | LOST_READ → ISIG required |
| Import fan concentration (e.g., app.module.ts = 69 outbound) | VISIBLE | INVISIBLE | LOST_READ → ISIG required |
| Centrality distribution skew | VISIBLE | INVISIBLE | PARTIALLY_IMPLIED → CSIG candidate |
| Cross-domain coupling direction | VISIBLE (2,138 edges) | VISIBLE (4 IMPORTS_ACROSS edges) | PRESERVED (compressed) |
| Architectural isolation | NOT VISIBLE | VISIBLE (PSIG-006 = 0.1515) | NEW_READ at Level 2 |

The compression is by design — Level 2 exists to see architectural patterns. But Level 1 intelligence must exist as independent signal families, not only as enrichment artifacts.

See [[LEVEL_1_VS_LEVEL_2_SIGNAL_DOCTRINE]] for the canonical doctrine.

---

## Cross-References

- [[LEVEL_1_VS_LEVEL_2_SIGNAL_DOCTRINE]] — Level 1 vs Level 2 signal doctrine
- [[SIGNAL_DERIVATION_SPINE]] — full derivation chain
- [[SIGNAL_FAMILY_TAXONOMY]] — signal family registry
- [[../03_PATH_SPLIT_EVOLUTION/PATH_A_EMERGENCE]] — PATH A/PATH B architectural split

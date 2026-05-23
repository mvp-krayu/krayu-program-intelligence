# Signal Family Taxonomy

> **Canonical registry of all xxSIG signal families in Program Intelligence.**
> **Established:** 2026-05-23
> **Stream:** PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01
> **Classification:** G1 — constitutional knowledge. Signal families are structural cognition outputs of the generic derivation spine, not standalone metrics.

---

## Governing Principle

Signals are NOT dashboards. Signals are structural cognition outputs that emerge from the governed derivation spine. Each signal family:
- derives from a specific structural evidence artifact
- measures a specific structural phenomenon at a defined abstraction level
- produces deterministic activation states from governed thresholds
- projects through 41.x into LENS/BOARDROOM executive surfaces

Signal families are positioned within the derivation spine, not alongside it.

---

## Signal Family Registry

### Generic GENESIS Families (Any Specimen)

These families derive from artifacts available to ALL specimens — PATH A and PATH B alike. They define the structural cognition baseline of Program Intelligence.

#### PSIG — Primary Structural Intelligence Signals

| Field | Value |
|-------|-------|
| Status | **IMPLEMENTED** |
| Source artifact | `binding/binding_envelope.json` (Phase 5 output) |
| Derivation level | Level 2 — Architectural Binding Intelligence |
| Derivation phase | Phase 6+7 (75.x activation + 41.x projection) |
| Computation scripts | `compute_condition_correlation.py` → `compute_pressure_candidates.py` → `compute_pressure_zones.py` → `compute_signal_projection.py` → `compute_zone_projection.py` |
| Downstream projection | vault/signal_registry.json → LENS Tier-1/Tier-2 → BOARDROOM |
| Chronicle eligibility | YES — source artifact, derivation phase, activation state all traceable |

**Signals:**

| ID | Name | Formula | What It Measures | Early-Warning Value |
|----|------|---------|-----------------|---------------------|
| PSIG-001 | coupling_pressure | fan_in(node) / mean_fan | Inbound architectural coupling concentration | Detects structural bottleneck nodes — single points of coupling failure |
| PSIG-002 | export_pressure | fan_out(node) / mean_fan | Outbound architectural coupling concentration | Detects structural broadcast nodes — change propagation origins |
| PSIG-004 | zone_coverage_concentration | surfaces_per_ceu / mean_surfaces | Capability surface concentration per CEU | Detects responsibility overload — one CEU exposing disproportionate capability surface |
| PSIG-006 | isolation_pressure | (cluster_count - 1) / total_nodes | Binding graph fragmentation | Detects structural isolation — disconnected architectural regions |

#### DPSIG — Derived Program Structural Intelligence Signals

| Field | Value |
|-------|-------|
| Status | **PARTIALLY IMPLEMENTED** (Class 4 only) |
| Source artifact | `structure/40.4/canonical_topology.json` |
| Derivation level | Topology-level (independent of Level 1 and Level 2) |
| Derivation phase | Independent — `derive_relational_signals.py` (not part of Phase 6+7) |
| Computation script | `scripts/pios/dpsig/derive_relational_signals.py` |
| Downstream projection | `artifacts/dpsig/<client>/<run>/dpsig_signal_set.json` → LENS (additive sidecar) |
| Chronicle eligibility | YES |

**Signals (Class 4 — implemented):**

| ID | Name | Formula | What It Measures | Early-Warning Value |
|----|------|---------|-----------------|---------------------|
| DPSIG-031 | Cluster Pressure Index (CPI) | max(cluster_node_count) / mean(non_singleton) | Structural mass concentration | Investment concentration risk — one cluster dominates topology |
| DPSIG-032 | Cluster Fan Asymmetry (CFA) | max(cluster_node_count) / total_nodes | Largest cluster's share of total | Distribution balance — whether structure is evenly spread or gravitationally captured |

**Reserved classes:** 1-3, 5-8 (documented as future in `derive_relational_signals.py`; may use binding_envelope.json and structural_topology_log.json)

#### BSIG — Binding Fusion Intelligence Signals

| Field | Value |
|-------|-------|
| Status | **NEW — not yet implemented** |
| Source artifact | `binding/binding_envelope.json` (Phase 5 output) |
| Derivation level | Level 2 — Architectural Binding Intelligence (meta-signal about binding quality) |
| Derivation phase | Would derive from Phase 5 output |
| Chronicle eligibility | YES (when implemented) |

**Candidate signals:**

| ID | Name | Formula | What It Measures | Early-Warning Value |
|----|------|---------|-----------------|---------------------|
| BSIG-001 | CEU-DOM Coverage Ratio | governed_nodes / total_40.2_nodes | Proportion of structural inventory with CEU governance | PI cognitive resolution — low coverage = high structural blind spot |
| BSIG-002 | Cross-DOM Import Density | IMPORTS_ACROSS_edges / total_edges | Architectural coupling between domains | Cross-domain entanglement — high density = deployment coordination risk |
| BSIG-003 | Grounding Uniformity | variance(evidence_refs_count per CEU) | Evidence distribution across capabilities | Balanced vs skewed architectural understanding |
| BSIG-004 | DOM Orphan Ratio | DOM_groups_with_zero_CE / total_DOM_groups | Structural domains without capability binding | Unbound architectural regions — structure exists without governed capability |

**Meta-signal property:** BSIG measures the QUALITY of the binding itself, not the specimen's structural characteristics. Low BSIG-001 means PI has limited visibility — a signal about the signal system's own resolution.

#### ESI — Structural Coherence Delta

| Field | Value |
|-------|-------|
| Status | **CONCEPT_ONLY — no implementation exists** |
| Source artifact | Cross-plane comparison (multiple operational planes across runs) |
| Derivation level | Cross-run temporal |
| What it measures | Structural coherence across operational planes — whether structural and semantic registries agree |
| Dependency | Requires multi-run comparison infrastructure |

#### RAG — Representation Alignment Gap

| Field | Value |
|-------|-------|
| Status | **CONCEPT_ONLY — no implementation exists** |
| Source artifact | Structural registry vs semantic registry comparison |
| Derivation level | Cross-registry |
| What it measures | Gap between what the structural substrate captures and what the semantic registry claims |
| Dependency | Requires both PATH A and PATH B artifacts in the same run |

---

### Software Module Families (Code Graph Required)

These families derive from 40.3s and 40.3c artifacts. They are available ONLY for PATH A specimens with code graph evidence. They attach to the generic spine as PATH A extensions.

#### ISIG — Import Structure Intelligence Signals

| Field | Value |
|-------|-------|
| Status | **OPERATIONAL** (ISIG-001, ISIG-002) |
| Source artifact | `structure/40.3s/code_graph.json` (IMPORTS relationships) |
| Derivation level | Level 1 — File-Level Structural Intelligence |
| Derivation phase | Independent — `derive_import_signals.py` (not part of Phase 6+7) |
| Computation script | `scripts/pios/isig/derive_import_signals.py` |
| Downstream projection | `artifacts/isig/<client>/<run>/isig_signal_set.json` (standalone; LENS integration future) |
| PATH A dependency | 40.3s code graph (IMPORTS relationship type) |
| Chronicle eligibility | YES |

**Signals (implemented):**

| ID | Name | Formula | What It Measures | Early-Warning Value |
|----|------|---------|-----------------|---------------------|
| ISIG-001 | Import Hub Pressure | max(import_in_degree) / mean(import_in_degree) | File-level import centrality concentration | Structural single-point-of-failure — a file imported by 111 others means 111 dependents break on change |
| ISIG-002 | Import Fan Asymmetry | max(import_out_degree) / mean(import_out_degree) | File-level coupling concentration | Monolithic coupling — a file importing 70 others is an integration bottleneck |

**Deferred signal:**

| ID | Name | Formula | What It Measures | Status |
|----|------|---------|-----------------|--------|
| ISIG-003 | Import Chain Depth | max(transitive import chain length) | Dependency chain depth | DEFERRED — requires transitive graph traversal |

**Operational evidence:**
- BlueEdge: ISIG-001=35.304 HIGH (`common/dto/index.ts`: 111 inbound, mean 3.14), ISIG-002=22.264 HIGH (`App.tsx`: 70 outbound)
- NetBox: ISIG-001=51.135 HIGH, ISIG-002=8.949 HIGH (1,155 files, 3,614 IMPORTS)
- Cross-validated on both PATH A specimens. Client-agnostic, code-graph-native.

**PSIG-004 LOST_READ resolution:** ISIG-001=35.304 reveals file-level hub concentration that is invisible at Level 2 (PSIG-004=1.0 NORMAL). The LOST_READ is closed.

**Software execution connection:** Import in-degree = blast radius for breaking changes. Import out-degree = coupling surface for dependency upgrades. Both directly predict PR review complexity, deployment risk, and change coordination cost.

#### CSIG — Centrality Structure Intelligence Signals

| Field | Value |
|-------|-------|
| Status | **PARTIALLY IMPLIED** — raw metrics exist in 40.3c; not computed as named signals |
| Source artifact | `structure/40.3c/structural_centrality.json` |
| Derivation level | Level 1 — File-Level Structural Intelligence (derived from Level 1) |
| Derivation phase | Would derive from Phase 3.7 output |
| PATH A dependency | 40.3c structural centrality (depends on 40.3s) |
| Chronicle eligibility | YES (when implemented) |

**Candidate signals:**

| ID | Name | Formula | What It Measures | Early-Warning Value |
|----|------|---------|-----------------|---------------------|
| CSIG-001 | Centrality Concentration | Gini coefficient of centrality distribution | How concentrated structural authority is | High concentration = few files carry disproportionate architectural weight |
| CSIG-002 | Role Distribution Skew | VALIDATION_SUPPORT count / INTERFACE_BOUNDARY count | Barrel-file vs interface-boundary ratio | High skew = barrel-file dominated architecture (indirect dependency masking) |
| CSIG-003 | Structural Throughput Proxy Peak | max(structural_throughput_proxy) | Peak structural throughput concentration | Files that both receive many imports AND export many — structural chokepoints |

**Evidence basis (BlueEdge):** 643 ranked files, 386 VALIDATION_SUPPORT, 257 INTERFACE_BOUNDARY. Role ratio = 1.50.

**Software execution connection:** Centrality rank predicts review bottleneck — high-centrality files change frequently and require expert review. Structural role distribution predicts team scaling characteristics.

#### ESIG — Enrichment Structure Intelligence Signals

| Field | Value |
|-------|-------|
| Status | **NEW — not yet implemented** |
| Source artifact | Phase 5 enrichment delta (pre vs post enrichment binding) |
| Derivation level | Level 1→2 bridge (measures how Level 1 evidence affects Level 2 binding) |
| Derivation phase | Would derive from Phase 5 enrichment step |
| PATH A dependency | 40.3s code graph (enrichment source) |
| Chronicle eligibility | YES (when implemented) |

**Candidate signals:**

| ID | Name | Formula | What It Measures | Early-Warning Value |
|----|------|---------|-----------------|---------------------|
| ESIG-001 | Enrichment Lift | (edges_after - edges_before) / edges_before | How much code graph enrichment changes binding topology | Investment signal — high lift = code graph analysis adds significant value |
| ESIG-002 | Semantic Topology Enrichment Coverage | enriched_domains / total_domains | Phase 5b enrichment penetration | Enrichment completeness — how much of the semantic model is structurally grounded |

**Software execution connection:** Enrichment lift measures the delta between "what we know from architecture" (Level 2) and "what we learn from code analysis" (Level 1). A decision input for deeper structural analysis investment.

---

## Signal → PATH Integration Model

```
PATH A STRUCTURAL SUBSTRATE
│
├── 40.2 structural_node_inventory ─────────── Topology/containment basis
│     └── 40.2r structural_relevance ────────── Significance filtering
│
├── 40.3 structural_topology_log ───────────── Relationship surface
│     └── 40.3r filtered_topology ───────────── PRIMARY-only relationships
│           └── 40.3s code_graph ────────────── ISIG source (OPERATIONAL)
│                 └── 40.3c structural_centrality ─ CSIG candidate source
│
├── 40.4 canonical_topology ────────────────── DPSIG source (IMPLEMENTED)
│
├── Phase 5 binding/fusion ─────────────────── PSIG source (IMPLEMENTED)
│     │                                        BSIG source (NEW)
│     │
│     └── Phase 5 enrichment (40.3s → binding) ─ ESIG source (NEW)
│
└── Phase 6+7 ──────────────────────────────── PSIG computation (IMPLEMENTED)
      └── 41.x projection ──────────────────── Signal projection (IMPLEMENTED)
            └── Phase 8a vault ──────────────── Signal registry (IMPLEMENTED)
                  └── LENS/BOARDROOM ─────────── Executive projection (IMPLEMENTED)
```

---

## Maturity Classification

| Family | Level | Maturity | Evidence |
|--------|-------|----------|---------|
| PSIG | Level 2 | OPERATIONAL | 4 signals, 5 computation scripts, pipeline Phase 6+7, vault integration. Generic corridor certified: NET IMPROVEMENT over historical shortcut |
| DPSIG | Topology | OPERATIONAL (Class 4) | 2 signals, topology-native script, LENS additive sidecar. CFA correction: false BALANCED → genuine ASYMMETRIC on BlueEdge |
| BSIG | Level 2 | SPECIFIED_NOT_IMPLEMENTED | Raw data exists in binding envelope; no computation pipeline |
| ISIG | Level 1 | **OPERATIONAL** (ISIG-001, ISIG-002) | 2 signals, code-graph-native script, standalone derivation. PSIG-004 LOST_READ closed. BlueEdge: IHP=35.3 HIGH, IFA=22.3 HIGH. NetBox: IHP=51.1 HIGH, IFA=8.9 HIGH |
| CSIG | Level 1 | PARTIALLY_IMPLIED | Raw metrics in 40.3c; no named signal computation |
| ESIG | Level 1→2 bridge | SPECIFIED_NOT_IMPLEMENTED | Enrichment delta observable; no computation pipeline |
| ESI | Cross-run | CONCEPT_ONLY | Defined, no evidence or implementation |
| RAG | Cross-registry | CONCEPT_ONLY | Defined, no evidence or implementation |
| EXSIG | Temporal | FUTURE_DECLARED | Requires TEMPORAL capability class |
| TIMSIG | Temporal | FUTURE_DECLARED | Requires TEMPORAL capability class |

---

## Intelligence Delta Certification (BlueEdge, 2026-05-23)

The generic corridor (Level 2) was certified against the historical shortcut corridor (Level 1) on BlueEdge:

| Change | Classification | Significance |
|--------|---------------|-------------|
| PSIG-002: 1 domain → 4 domains | IMPROVED_READ | Export pressure revealed as systemic, not localized |
| DPSIG-032: BALANCED → ASYMMETRIC | IMPROVED_READ | Historical was false reassurance; 57% mass in one cluster |
| DPSIG-031: same state, real substrate | IMPROVED_READ | 944-node evidence vs 35-node abstraction |
| Pressure zones: 1 → 4 | IMPROVED_READ | Pressure distributed across architecture |
| PSIG-001: different entity, same read | DIFFERENT_ABSTRACTION_SAME_READ | Coupling concentration preserved at architectural level |
| PSIG-006: theoretical → genuine | NEW_READ | Architectural fragmentation discovered |
| PSIG-004: HIGH → uniform | **LOST_READ → RESOLVED** | File-level hub concentration invisible at Level 2 → ISIG-001=35.3 HIGH now provides this intelligence at Level 1 |

**Verdict:** The generic corridor produces MORE truthful structural cognition than the historical shortcut corridor. The single LOST_READ (PSIG-004) has been resolved by ISIG implementation — all signal intelligence is now preserved or improved.

See [[../../PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01/BLUEEDGE_SIGNAL_INTELLIGENCE_DELTA]] for full evidence.

---

## Cross-References

- [[LEVEL_1_VS_LEVEL_2_SIGNAL_DOCTRINE]] — canonical Level 1 vs Level 2 doctrine
- [[SIGNAL_DERIVATION_SPINE]] — full derivation chain from intake to projection
- [[PATH_A_SIGNAL_INTEGRATION_MAP]] — detailed PATH A signal emergence points
- [[../06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK]] — locked signal terminology
- [[../../PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01/SIGNAL_DERIVATION_CONTRACT]] — formal derivation contract
- [[../../PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01/CHRONICLE_SIGNAL_LINEAGE_REQUIREMENTS]] — chronicle integration requirements

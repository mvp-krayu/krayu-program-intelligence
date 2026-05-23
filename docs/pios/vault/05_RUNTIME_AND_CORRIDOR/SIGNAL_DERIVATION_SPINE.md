# Signal Derivation Spine

> **Canonical reference for the full signal derivation chain — from structural intake to executive projection.**
> **Established:** 2026-05-23
> **Stream:** PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01
> **Classification:** G1 — this page is constitutional knowledge, not implementation guidance.

---

## Purpose

This page defines how structural intelligence signals derive from governed evidence and propagate through the pipeline to executive projection surfaces. It is the canonical answer to: "where do signals come from, what do they measure, and how do they reach the audience?"

This knowledge was previously scattered across script docstrings, stream execution reports, and operational memory. It is now vault-locked.

---

## The Derivation Chain

```
RAW INTAKE (source archive)
    │
    ├─ Phase 1-2: boundary + intake verification
    │
    ├─ Phase 3: 40.2 (node inventory) + 40.3 (topology) + 40.4 (canonical topology)
    │     │
    │     ├─ Phase 3.5: 40.2r (structural relevance classification)
    │     │
    │     ├─ Phase 3.6: 40.3s (code-graph enrichment — IMPORTS, DEFINES_CLASS, DEFINES_FUNCTION)
    │     │     │
    │     │     └─ Phase 3.7: 40.3c (structural centrality — per-file metrics, role classification)
    │     │
    │     └─ Phase 3b/3c: semantic derivation (CSR, SPE — parallel path, not signal-relevant)
    │
    ├─ Phase 4: CEU grounding verification (gate only)
    │
    ├─ Phase 5: BINDING ENVELOPE CONSTRUCTION ◄── PRIMARY SIGNAL INPUT
    │     │
    │     │  Consumes: CEU registry + DOM layer + 40.2 (node namespace)
    │     │  Enriches with: 40.3s (IMPORTS_ACROSS edges) + 40.3c (centrality annotations)
    │     │
    │     │  Produces: binding_envelope.json
    │     │    ├── nodes (binding_context + component_entity + capability_surface)
    │     │    ├── edges (GROUNDS + EXPOSES + IMPORTS_ACROSS)
    │     │    └── capability_surfaces
    │     │
    │     └─ Phase 5b: semantic topology enrichment (consumes 40.3s, 40.3c, dom_layer — not signal-relevant)
    │
    ├─ Phase 6+7: SIGNAL COMPUTATION ◄── PSIG DERIVATION
    │     │
    │     │  Input: binding_envelope.json (SOLE structural input)
    │     │  Scripts: compute_condition_correlation → compute_pressure_candidates
    │     │           → compute_pressure_zones → compute_signal_projection → compute_zone_projection
    │     │
    │     │  Produces:
    │     │    ├── 75.x/condition_correlation_state.json (per-node PSIG conditions)
    │     │    ├── 75.x/pressure_candidate_state.json (entities with ≥2 activated conditions)
    │     │    ├── 75.x/pressure_zone_state.json (zone designations with zone_class)
    │     │    ├── 41.x/signal_projection.json (projected signal values + attribution)
    │     │    └── 41.x/pressure_zone_projection.json (projected zone state)
    │     │
    │     └─ DPSIG DERIVATION (independent parallel path)
    │           Input: 40.4/canonical_topology.json (SOLE input — no binding, no 40.3s)
    │           Script: derive_relational_signals.py
    │           Produces: artifacts/dpsig/<client>/<run>/dpsig_signal_set.json
    │
    ├─ Phase 8a: VAULT CONSTRUCTION
    │     │
    │     │  Reads: 41.x/signal_projection.json → vault/signal_registry.json
    │     │  Reads: binding_envelope.json → vault/binding_envelope.json (copy)
    │     │
    │     └─ Phase 8b: vault readiness validation (VR-01 through VR-09)
    │
    └─ LENS / BOARDROOM CONSUMPTION
          │
          ├── vault/signal_registry.json → signal strips, condition rendering
          ├── 41.x/signal_projection.json → Tier-1 evidence brief, narrative brief
          ├── 41.x/pressure_zone_projection.json → Tier-1/Tier-2 zone rendering
          ├── dpsig_signal_set.json → DPSIG projection weighting (additive sidecar)
          └── binding_envelope.json → structural metrics, topology SVG
```

---

## Signal Derivation Levels

Two distinct abstraction levels exist. They measure different structural phenomena. They are NOT interchangeable.

### Level 1: File-Level Structural Intelligence

- **Evidence source:** 40.3s code graph (resolved IMPORTS between source files)
- **Population:** Individual source files (hundreds to thousands per specimen)
- **What it measures:** Code import density, file-to-file coupling, per-file fan metrics
- **Signal semantics:** "This file imports 69 other files — that's a structural pressure point"
- **Availability:** PATH A specimens with code graph only. PATH B specimens (HTML evidence) have no Level 1.
- **How it enters signals:** INDIRECTLY — 40.3s enrichment adds IMPORTS_ACROSS edges to the binding envelope (Phase 5), which changes PSIG fan metrics. Also: 40.3c centrality annotations on CE nodes (decorative — does not change edge topology).

### Level 2: Architectural Binding Intelligence

- **Evidence source:** Phase 5 binding envelope (CEU→DOM grounding, DOM→CE→CS exposure, cross-DOM coupling)
- **Population:** Architectural binding nodes (tens per specimen — DOM + CE + CS)
- **What it measures:** Domain-to-capability grounding topology, capability exposure, cross-domain structural coupling
- **Signal semantics:** "This capability entity is grounded by 4 domain groups — that's architectural coupling"
- **Availability:** ALL specimens with a binding envelope (PATH A and PATH B)
- **How it enters signals:** DIRECTLY — the binding envelope is the sole input to PSIG computation

### Level 2 is the generic corridor. Level 1 is enrichment.

This means:
- Any specimen that passes through the generic pipeline produces Level 2 signals
- PATH A specimens with 40.3s code graphs get additional Level 1 enrichment (IMPORTS_ACROSS edges)
- Level 1 enrichment is ADDITIVE — it adds edges to the binding, changing fan metrics
- The DEGREE of Level 1 influence depends on how many IMPORTS_ACROSS edges are added relative to the base GROUNDS/EXPOSES topology

---

## Signal Family Registry

### Implemented Families

| Family | Full Name | Source Artifact | Derivation Level | Generic? | Signals |
|--------|-----------|-----------------|-------------------|----------|---------|
| **PSIG** | Primary Structural Intelligence Signals | binding_envelope.json | Level 2 (with Level 1 enrichment when available) | YES — any specimen with binding | PSIG-001 (coupling_pressure), PSIG-002 (export_pressure), PSIG-004 (zone_coverage_concentration), PSIG-006 (isolation_pressure) |
| **DPSIG** | Derived Program Structural Intelligence Signals | canonical_topology.json (40.4) | Topology-level (independent of both Level 1 and Level 2) | YES — any specimen with 40.4 | DPSIG-031 (Cluster Pressure Index), DPSIG-032 (Cluster Fan Asymmetry). Classes 1-3, 5-8 reserved but not implemented |

### Implied Families (Evidence Exists, Not Yet Named/Computed)

| Family | Proposed Name | Source Artifact | Derivation Level | Generic? | What It Measures |
|--------|--------------|-----------------|-------------------|----------|-----------------|
| **ISIG** | Import Structure Intelligence Signals | 40.3s/code_graph.json | Level 1 | SOFTWARE MODULE ONLY | Per-file import hub pressure, import fan asymmetry, import chain depth |
| **CSIG** | Centrality Structure Intelligence Signals | 40.3c/structural_centrality.json | Level 1 | SOFTWARE MODULE ONLY | Centrality concentration, role distribution skew, structural throughput |
| **BSIG** | Binding Fusion Intelligence Signals | binding_envelope.json | Level 2 | YES | CEU-DOM coverage ratio, cross-DOM import density, grounding uniformity, DOM orphan ratio |
| **ESIG** | Enrichment Structure Intelligence Signals | Phase 5 enrichment delta | Level 1→2 bridge | SOFTWARE MODULE ONLY | Enrichment lift, semantic topology enrichment coverage |

### Concept-Only Families (No Implementation or Evidence)

| Family | Proposed Name | Status | What It Would Measure |
|--------|--------------|--------|----------------------|
| **ESI** | Structural Coherence Delta | CONCEPT_ONLY | Cross-plane structural coherence across operational planes |
| **RAG** | Representation Alignment Gap | CONCEPT_ONLY | Gap between structural registry and semantic registry |
| **EXSIG** | Execution Signals | SPECIFIED_NOT_IMPLEMENTED (TEMPORAL capability class) | Runtime execution dynamics |
| **TIMSIG** | Temporal Intelligence Signals | FUTURE_DECLARED (TEMPORAL capability class) | Posture drift, run-over-run comparison |

### Generic vs. Module-Specific Classification

```
GENERIC GENESIS (any specimen)     SOFTWARE MODULE (code graph required)
├── PSIG  (Level 2 binding)        ├── ISIG  (Level 1 imports)
├── DPSIG (40.4 topology)          ├── CSIG  (Level 1 centrality)
├── BSIG  (Level 2 binding meta)   └── ESIG  (Level 1→2 bridge)
├── ESI   (concept)
└── RAG   (concept)
```

This mirrors the PATH A / PATH B split: PATH A specimens get all families; PATH B specimens get the generic families only. The enrichment architecture (40.3s → IMPORTS_ACROSS) is the bridge.

---

## PSIG Computation Detail

All PSIG computation reads `binding/binding_envelope.json` as the SOLE structural input.

| Signal | Formula | Population | Threshold | Activation |
|--------|---------|------------|-----------|------------|
| PSIG-001 | fan_in(node) / mean_fan(all_nodes) | All binding nodes | > 2.0 | HIGH |
| PSIG-002 | fan_out(node) / mean_fan(all_nodes) | All binding nodes (domain-level attribution) | > 2.0 | HIGH |
| PSIG-004 | surfaces_per_ceu(node) / mean_surfaces | Component entity nodes | > 2.0 | HIGH |
| PSIG-006 | (cluster_count - 1) / total_nodes | All binding nodes (BFS connected components) | > 0 | ACTIVATED |

**mean_fan** = total_edges / total_nodes (rounded to 3 decimals)
**mean_surfaces** = total_capability_surfaces / total_component_entities

### PSIG Activation States

| State | Meaning | Deterministic? |
|-------|---------|----------------|
| HIGH | Signal ratio > threshold (2.0) | YES |
| NORMAL | Signal ratio ≤ threshold | YES |
| ACTIVATED | Structural telemetry marker (PSIG-006 — cluster isolation detected) | YES |
| NOT | Not activated | YES |

### Pressure Zone Classification

Zones form from entities sharing ≥2 activated PSIG conditions:

| Zone Class | Condition Combination | Meaning |
|------------|----------------------|---------|
| COMPOUND_ZONE | ≥3 conditions | Multiple simultaneous pressure types converge |
| COUPLING_ZONE | PSIG-001 + PSIG-002 | Coupling + export pressure convergence |
| PROPAGATION_ZONE | PSIG-002 + PSIG-004 | Export + coverage concentration convergence |
| RESPONSIBILITY_ZONE | PSIG-001 + PSIG-004 | Coupling + coverage concentration convergence |
| FRAGMENTATION_ZONE | PSIG-006 present | Structural fragmentation / isolation |

---

## DPSIG Computation Detail

DPSIG reads `structure/40.4/canonical_topology.json` as the SOLE input. No binding, no 40.3s, no conformance artifacts.

| Signal | Formula | Status |
|--------|---------|--------|
| DPSIG-031 (CPI) | max(cluster_node_count) / mean(non_singleton_cluster_sizes) | OPERATIONAL |
| DPSIG-032 (CFA) | max(cluster_node_count) / total_structural_nodes | OPERATIONAL |
| DPSIG Classes 1-3, 5-8 | Reserved | NOT IMPLEMENTED |

**DPSIG thresholds (independent from PSIG):**
- CPI ≥ 5.0 → CLUSTER_PRESSURE_HIGH
- CPI ≥ 2.0 → CLUSTER_PRESSURE_ELEVATED
- CFA ≥ 0.60 → DOMINANT_CLUSTER
- CFA ≥ 0.35 → CLUSTER_ASYMMETRIC

---

## 40.3s/40.3c Influence Path

**40.3s influences PSIG INDIRECTLY:**
```
40.3s/code_graph.json
  → Phase 5: _enrich_binding_with_structural_evidence()
    → Cross-DOM IMPORTS aggregated → IMPORTS_ACROSS edges added to binding
    → Same-DOM IMPORTS → GROUNDS edge import_count annotations
  → binding_envelope.json now has additional edges
  → Phase 6+7: fan_in/fan_out counts include IMPORTS_ACROSS edges
  → PSIG values shift
```

**40.3c influences PSIG DECORATIVELY (no topology change):**
```
40.3c/structural_centrality.json
  → Phase 5: CE nodes annotated with centrality_evidence (hub_file, in_degree, structural_role)
  → These are NODE ATTRIBUTES, not edges — they do NOT change fan metrics
  → PSIG values unaffected by 40.3c
```

**Neither 40.3s nor 40.3c influences DPSIG.** DPSIG reads 40.4 only.

---

## SIGNAL_SHORTCUT_RETAINED — PERMANENTLY REMOVED

**Status:** REMOVED (2026-05-23, PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01)
**Previously:** `run_client_pipeline.py`, Phase 6+7 copied pre-computed conformance artifacts when `source_manifest["fastapi_conformance_path"]` was set.
**Removed because:** The generic corridor produces MORE truthful structural cognition than the shortcut corridor. Intelligence delta certified: 4 IMPROVED_READ, 1 NEW_READ, 1 DIFFERENT_ABSTRACTION_SAME_READ, 1 LOST_READ (OPEN_GAP with resolution path).
**The shortcut must not be restored.** The LOST_READ (PSIG-004 file-level hub concentration) has a governed resolution path: ISIG as a first-class Level 1 signal family. Shortcut restoration would reintroduce false reassurance (DPSIG-032 BALANCED when the structure is genuinely ASYMMETRIC).

See [[LEVEL_1_VS_LEVEL_2_SIGNAL_DOCTRINE]] for why the abstraction difference is structural, not a deficiency.

---

## LENS / BOARDROOM Consumption

LENS report generation (`scripts/pios/lens_report_generator.py`) reads:

| Artifact | Source | Signal Family | Used For |
|----------|--------|---------------|----------|
| vault/signal_registry.json | Phase 8a (from 41.x/signal_projection.json) | PSIG | Signal strips, condition rendering |
| 41.x/signal_projection.json | Phase 6+7 | PSIG | Tier-1 evidence brief, narrative brief |
| 41.x/pressure_zone_projection.json | Phase 6+7 | PSIG zones | Tier-1/2 zone rendering |
| vault/canonical_topology.json | Phase 8a (from DOM layer) | N/A (structural) | Topology SVG |
| binding/binding_envelope.json | Phase 5 | N/A (structural metrics) | Fan metrics, structural metrics computation |
| dpsig_signal_set.json | DPSIG derivation (independent) | DPSIG | Additive sidecar — CPI/CFA projection weighting |

DPSIG projection weighting is ADDITIVE — it reads `dpsig_signal_set.json` at a fixed path (`artifacts/dpsig/<client>/<run>/`) and computes fragility scores, severity bands, and executive readiness classification. It never modifies PSIG artifacts.

---

## What This Page Does NOT Cover

- Signal value calibration or threshold tuning — those are implementation decisions, not constitutional knowledge
- LENS rendering logic — that is a 51.x/42.x concern
- ESI/RAG computation — those are CONCEPT_ONLY, no implementation exists
- TEMPORAL signal families (EXSIG, TIMSIG) — those are FUTURE_DECLARED
- Signal regression testing — that is infrastructure, not architecture

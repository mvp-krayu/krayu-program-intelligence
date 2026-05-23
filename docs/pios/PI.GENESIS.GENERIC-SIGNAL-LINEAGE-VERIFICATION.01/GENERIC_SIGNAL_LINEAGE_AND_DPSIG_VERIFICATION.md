# Generic Signal Lineage and DPSIG Verification

> **Stream:** PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01
> **Classification:** G2 (architecture-consuming)
> **Base commit:** 037f514 (main, 2026-05-23)
> **Calibration specimen:** BlueEdge (first generic corridor normalization)

---

## Mission

Verify that signal derivation (PSIG / DPSIG / pressure propagation / activation) can derive from the normalized generic corridor without relying on historical specimen-specific shortcuts.

This is NOT "BlueEdge signal migration." This is generic GENESIS / Program Intelligence signal lineage verification. BlueEdge is the first normalization specimen — the verification must establish whether the generic corridor can lawfully derive equivalent early-warning cognition for ANY specimen that enters through the governed pipeline.

---

## 1. Signal Family Classification

### 1a. PSIG — Primary Structural Intelligence Signals

| Signal | Name | Derivation Source | Computation Method |
|--------|------|-------------------|--------------------|
| PSIG-001 | coupling_pressure | binding envelope topology | fan_in(node) / mean_fan(all_nodes) |
| PSIG-002 | export_pressure (domain_coupling) | binding envelope topology | fan_out(domain_node) / mean_fan(all_nodes) |
| PSIG-004 | zone_coverage_concentration | binding envelope topology + pressure zone state | surfaces_per_ceu / mean_surfaces |
| PSIG-006 | isolation_pressure (unanchored_nodes) | binding envelope topology | (cluster_count - 1) / total_nodes |

**Computation chain:** `compute_condition_correlation.py` → `compute_pressure_candidates.py` → `compute_pressure_zones.py` → `compute_signal_projection.py` → `compute_zone_projection.py`

**Single input:** `binding/binding_envelope.json` — ALL PSIG computation reads ONLY the binding envelope. No external artifacts.

### 1b. DPSIG — Derived Program Structural Intelligence Signals

| Signal | Name | Derivation Source | Computation Method |
|--------|------|-------------------|--------------------|
| DPSIG-031 | Cluster Pressure Index (CPI) | canonical_topology.json (40.4) | max(cluster_node_count) / mean(non_singleton_cluster_sizes) |
| DPSIG-032 | Cluster Fan Asymmetry (CFA) | canonical_topology.json (40.4) | max(cluster_node_count) / total_structural_nodes |

**Computation script:** `scripts/pios/dpsig/derive_relational_signals.py`

**Single input:** `structure/40.4/canonical_topology.json` — topology-native, client-agnostic. Class 4 only (Classes 1-8 deferred).

### 1c. Pressure Zones

| Concept | Derivation Source | Computation |
|---------|-------------------| ------------|
| Pressure zone designation | PSIG conditions | Zones formed from entities sharing ≥2 activated PSIG conditions |
| Zone class | PSIG combination | COMPOUND (≥3 conditions), COUPLING (001+002), PROPAGATION (002+004), RESPONSIBILITY (001+004), FRAGMENTATION (006) |
| Zone projection | 75.x pressure_zone_state | Pure projection into 41.x format — no recomputation |

### 1d. Activation States

| State | Meaning | Derivation |
|-------|---------|------------|
| HIGH | Signal ratio > threshold (2.0) | Deterministic from fan/surface ratios |
| NORMAL | Signal ratio ≤ threshold | Deterministic |
| ACTIVATED | Structural telemetry marker (PSIG-006) | Binary: cluster_count > 1 |
| NOT | Not activated | Complement |

### 1e. Propagation Semantics

Pressure zone member_entities propagate signal attribution from individual conditions to zone-level aggregate:
- Primary attribution: highest signal value entity in zone
- Secondary attribution: other HIGH entities in zone
- Domain attribution: DOM-level scope from CEU→DOM mapping

### 1f. ESI / RAG

| Concept | Status | Note |
|---------|--------|------|
| ESI (Structural Coherence Delta) | NOT YET COMPUTED | Cross-plane computation; requires multi-run comparison. Not in current signal pipeline. |
| RAG (Representation Alignment Gap) | NOT YET COMPUTED | Requires structural vs. semantic registry alignment. Phase 5 concept, not signal-layer. |

---

## 2. Current Provenance: Historical (Pre-Computed) vs. Generic Corridor

### 2a. PSIG Historical Values (Pre-Computed Conformance Path)

Source: `PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01`

These values were derived from a DIFFERENT evidence source:
- **Population basis:** 35 CEU-grounded nodes from `ceu_node_map.json`
- **Fan metric source:** `40.3/structural_topology_log.json` — per-file IMPORTS relationships (69 outbound IMPORTS for NODE-0021)
- **DOM aggregation:** 13 DOM groups × per-DOM SUM(IMPORTS) (DOM-04 = 71 aggregate)
- **Zone metric source:** 7 pressure zones × per-zone node fraction

| Signal | Historical Value | Evidence Basis |
|--------|-----------------|----------------|
| PSIG-001 | 5.6630 | NODE-0021: 69 outbound IMPORTS / σ=11.63 → z-score 5.663 |
| PSIG-002 | 3.2098 | DOM-04: 71 aggregate IMPORTS / σ=19.48 → z-score 3.210 |
| PSIG-004 | 2.1822 | PZ-001: 15/35 = 0.4286 node fraction / σ=0.131 → z-score 2.182 |
| PSIG-006 | 0 (THEORETICAL_BASELINE) | unanchored_count = 0 from ceu_node_map |

**Critical observation:** These historical values were derived from 40.3 structural IMPORT relationships embedded into a PRE-COMPUTED binding envelope that is NOT the same schema as the generic binding. The pre-computed binding (`binding_envelope_fastapi_compatible.json`) uses `bindings`, `domain_telemetry`, `pressure_zone_designations` — it has NO `nodes`, `edges`, `capability_surfaces`.

The signal computation scripts (`compute_condition_correlation.py` et al.) expect the GENERIC schema (`nodes`, `edges`, `capability_surfaces`). The historical values were produced by a manual conformance process that pre-computed signal values outside the automated pipeline and placed them as static artifacts.

### 2b. PSIG Generic Corridor Values (What the Pipeline Would Derive)

Source: BlueEdge generic binding envelope produced by Phase 5 (PI.BLUEEDGE.GENERIC-BINDING-MIGRATION.01)

**Population basis:** 33 nodes (13 binding_context + 10 component_entity + 10 capability_surface)
**Edge population:** 33 edges (19 GROUNDS + 10 EXPOSES + 4 IMPORTS_ACROSS)
**mean_fan:** 33 edges / 33 nodes = 1.0

| Signal | Generic Corridor Value | Evidence Basis | Activation |
|--------|----------------------|----------------|------------|
| PSIG-001 | 4.0 | CE-04 (api_layer): fan_in=4 / mean_fan=1.0 | HIGH (>2.0) |
| PSIG-002 | 4.0 | DOM-04 (backend_app_root): fan_out=4 / mean_fan=1.0 | HIGH (>2.0) |
| PSIG-004 | 1.0 | All CEUs: 1 surface each / mean=1.0 | NORMAL (≤2.0) |
| PSIG-006 | 0.1515 | 6 connected components / 33 nodes | ACTIVATED (isolated nodes present) |

### 2c. Comparison: Historical vs. Generic Corridor

| Signal | Historical | Generic | Direction | Activation Preserved? |
|--------|-----------|---------|-----------|----------------------|
| PSIG-001 | 5.663 | 4.0 | ↓ lower but still HIGH | **YES** |
| PSIG-002 | 3.210 | 4.0 | ↑ higher, still HIGH | **YES** |
| PSIG-004 | 2.182 | 1.0 | ↓ below threshold | **NO — LOST** |
| PSIG-006 | 0 | 0.1515 | ↑ non-zero (structural change) | **CHANGED** |

### 2d. Why the Values Differ: Structural Explanation

The values differ because the **populations are fundamentally different**:

1. **Historical PSIG-001/002** measure **file-level code import density** — how many actual `import` statements exist between source files. NODE-0021 (`app.module.ts`) has 69 outbound imports because it's a NestJS module root that imports 69 other files. This is FILE-LEVEL structural intelligence from 40.3 code graph analysis.

2. **Generic corridor PSIG-001/002** measure **binding envelope graph topology** — how many GROUNDS/EXPOSES/IMPORTS_ACROSS edges connect DOM↔CE↔CS nodes. CE-04 has fan_in=4 because 4 DOM groups contribute evidence to the API_LAYER capability. This is ARCHITECTURAL-LEVEL binding topology intelligence.

3. **Historical PSIG-004** measures **zone coverage concentration** — what fraction of CEU-grounded nodes fall within a single pressure zone (15/35 = 42.86%). The generic binding has only 1 surface per CEU (deterministic: the pipeline creates exactly one CS per CE), so surfaces_per_ceu / mean_surfaces = 1.0 for all CEUs.

4. **PSIG-006** changes because the graph topology has different connected components. The historical value used a custom unanchored_count metric; the generic corridor uses BFS cluster detection on the binding graph.

**Root cause:** The historical signals and the generic corridor signals measure DIFFERENT STRUCTURAL PHENOMENA at DIFFERENT ABSTRACTION LEVELS. The historical signals measure file-level import density (40.3 evidence). The generic corridor signals measure architectural binding topology (Phase 5 evidence). These are NOT the same measurement.

### 2e. DPSIG Provenance

| Signal | Current Value | Derivation Source | Shortcut Dependency |
|--------|--------------|-------------------|---------------------|
| DPSIG-031 (CPI) | 2.1176 | canonical_topology.json (40.4) | **NONE** |
| DPSIG-032 (CFA) | 0.1714 | canonical_topology.json (40.4) | **NONE** |

**DPSIG is already fully generic.** The `derive_relational_signals.py` script is topology-native and client-agnostic by design. It reads ONLY `canonical_topology.json` — no binding envelope, no conformance shortcuts, no specimen-specific paths. Current BlueEdge DPSIG values derive from `run_blueedge_productized_01_fixed` topology; re-derivation from `run_blueedge_genesis_e2e_02` would use the same 40.4 artifact and produce potentially different values based on the genesis topology (10 clusters, 944 nodes vs. 13 clusters, 35 nodes in prior).

---

## 3. Shortcut Dependency Map

| Artifact | Currently Used By | Shortcut? | Generic Alternative |
|----------|-------------------|-----------|---------------------|
| `fastapi_conformance_path` (source_manifest) | Phase 6+7 signal computation | **YES — SIGNAL_SHORTCUT_RETAINED** | `run_end_to_end.py` on generic binding |
| `signal_projection_fastapi_compatible.json` | Phase 6+7 → copies to `41.x/signal_projection.json` | YES — static copy | Signal projection script |
| `condition_correlation_state_fastapi_compatible.json` | Phase 6+7 → copies to `75.x/condition_correlation_state.json` | YES — static copy | Condition correlation script |
| `pressure_zone_state_fastapi_compatible.json` | Phase 6+7 → copies to `75.x/pressure_zone_state.json` + `41.x/pressure_zone_projection.json` | YES — static copy | Pressure zone script |
| `binding_envelope_fastapi_compatible.json` | NOT directly consumed by Phase 6+7 | YES — but unused in pipeline | Generic binding replaces it |
| `canonical_topology.json` (40.4) | DPSIG derivation | **NO — already generic** | N/A |
| `dpsig_signal_set.json` | LENS report generator (additive sidecar) | **NO — already generic** | N/A |

---

## 4. Does 40.3s/40.3c Influence DPSIG?

**No.** DPSIG Class 4 (CPI, CFA) reads ONLY `canonical_topology.json` (40.4). The DPSIG script explicitly documents:
- `binding_envelope.json` — reserved for future classes
- `structural_topology_log.json` — reserved for future classes
- `grounding_state` — reserved for future classes

40.3s (code graph / IMPORTS relationships) and 40.3c (structural centrality) influence the BINDING ENVELOPE via Phase 5 enrichment (IMPORTS_ACROSS edges), which then influences PSIG. But they do NOT influence DPSIG.

**Indirect chain:** 40.3s → Phase 5 enrichment → IMPORTS_ACROSS edges in binding → PSIG fan metrics. This is an INDIRECT influence on PSIG (4 additional edges, changing total from 29 to 33), not on DPSIG.

---

## 5. Activation and Projection Changes Under Generic Corridor

### 5a. PSIG Activation State Changes

| Signal | Historical Activation | Generic Corridor Activation | Change |
|--------|----------------------|----------------------------|--------|
| PSIG-001 | HIGH (5.663 > 2.0) | HIGH (4.0 > 2.0) | **PRESERVED** — coupling pressure detected at different magnitude |
| PSIG-002 | HIGH (3.210 > 2.0) | HIGH (4.0 > 2.0) | **PRESERVED** — export pressure detected, STRONGER on generic |
| PSIG-004 | HIGH (2.182 > 2.0) | NORMAL (1.0 ≤ 2.0) | **LOST** — zone coverage concentration signal disappears |
| PSIG-006 | ACTIVATED (0, telemetry) | ACTIVATED (0.1515, structural) | **CHANGED** — semantics shift from "all anchored" to "6 clusters, some isolated" |

### 5b. Pressure Zone Impact

Historical: PZ-001 = COMPOUND_ZONE (PSIG-001 + PSIG-002 + PSIG-004, condition_count=3)

Generic corridor: PZ-001 would become either:
- **COUPLING_ZONE** (PSIG-001 + PSIG-002 only, condition_count=2) — if zone formation still groups them
- OR **no zone at all** — if the zone formation algorithm requires the same entity to carry ≥2 conditions and the per-node activation patterns differ

**Key risk:** The COMPOUND_ZONE classification is semantically significant — it indicates three simultaneous pressure types converging on a single architectural region. Losing PSIG-004 reduces this to a COUPLING_ZONE (two-signal convergence), which communicates less structural urgency.

### 5c. Projection Surface Impact

The 41.x projection layer is a PURE PASS-THROUGH of 75.x outputs. No recomputation. If 75.x condition_correlation changes, 41.x signal_projection and pressure_zone_projection change identically.

LENS report generation reads 41.x projections. DPSIG projection weighting reads `dpsig_signal_set.json` (independent path). The projection surface for LENS would show:
- Two HIGH signals instead of three
- Different magnitude values
- Different zone classification
- Different attribution patterns (CE-04 becomes primary PSIG-001 instead of NODE-0021)

---

## 6. The Abstraction-Level Gap

The core finding of this verification is that there are TWO DISTINCT SIGNAL DERIVATION LEVELS, and the generic corridor currently operates at a different level than the historical signals:

### Level 1: File-Level Structural Intelligence (40.3 evidence)
- **What it measures:** Code import density, file-to-file coupling, per-file fan metrics
- **Population:** Individual source files (35 CEU-grounded files, or 944 full inventory)
- **Evidence source:** 40.3 code graph analysis (AST/IMPORTS parsing)
- **Signal semantics:** "This file imports 69 other files — that's a structural pressure point"
- **Historical PSIG values derive from this level**

### Level 2: Architectural Binding Intelligence (Phase 5 evidence)
- **What it measures:** DOM-to-CEU grounding topology, CEU-to-capability surface exposure, cross-DOM import coupling
- **Population:** Architectural binding nodes (13 DOM + 10 CE + 10 CS = 33)
- **Evidence source:** Governed binding envelope (CEU registry + DOM layer + 40.3s enrichment)
- **Signal semantics:** "This capability entity is grounded by 4 domain groups — that's architectural coupling"
- **Generic corridor PSIG values derive from this level**

### These are both valid signal sources. They are NOT interchangeable.

The generic corridor produces lawful signals — they derive deterministically from governed artifacts. But they measure a DIFFERENT structural phenomenon than the historical signals. Claiming "equivalent early-warning cognition" requires establishing that architectural-level coupling (Level 2) provides comparable warning capacity to file-level coupling (Level 1).

**Assessment:** Level 2 signals are WEAKER early-warning indicators than Level 1 for fine-grained structural pressure, but STRONGER indicators for architectural coupling patterns. The 4 IMPORTS_ACROSS edges (from 40.3s enrichment) are the only bridge between the two levels — they inject file-level coupling evidence into the architectural binding.

---

## 7. Minimum Gap to Fully Generic Signal Derivation

### 7a. What Already Works Generically

| Component | Generic Status | Notes |
|-----------|---------------|-------|
| Signal computation scripts | **GENERIC** | All 5 scripts read generic-schema binding_envelope.json |
| DPSIG derivation | **GENERIC** | Topology-native, client-agnostic, no shortcuts |
| Pressure zone formation | **GENERIC** | Derived deterministically from PSIG conditions |
| Zone projection | **GENERIC** | Pure pass-through of 75.x state |
| Activation state classification | **GENERIC** | Deterministic threshold comparison |
| LENS DPSIG weighting | **GENERIC** | Additive sidecar, independent path |

### 7b. What Requires Migration

| Component | Current State | Migration Requirement | Complexity |
|-----------|--------------|----------------------|------------|
| Phase 6+7 shortcut | Copies pre-computed artifacts | Remove `fastapi_conformance_path` check; run `run_end_to_end.py` on generic binding | LOW — code change is trivial |
| Signal value equivalence | Historical ≠ generic | **DECISION REQUIRED** — accept Level 2 signals or inject Level 1 evidence into binding | HIGH — architectural decision |
| PSIG-004 preservation | Lost under generic corridor | Requires either: (a) accept loss, or (b) inject per-CEU surface multiplicity from 40.3s/40.3c evidence into binding envelope | MEDIUM |
| PSIG-006 semantics | Changed meaning | Requires clarification: is "binding graph clusters" the intended isolation metric, or should it measure "unanchored structural nodes"? | LOW — definition decision |
| Signal value regression testing | Not yet available | Produce reference signal set from generic corridor; establish as new baseline | MEDIUM |
| LENS signal display compatibility | Untested | LENS reads 41.x projections — schema is compatible, but magnitude changes may affect UI rendering (tier classification, severity bands) | MEDIUM |

### 7c. Three Migration Strategies

**Strategy A: Accept Level 2 Signals (MINIMAL)**
- Remove Phase 6+7 shortcut
- Run `run_end_to_end.py` on generic binding
- Accept new signal values as the canonical baseline for generic corridor
- Document that generic corridor signals measure architectural coupling, not file-level coupling
- PSIG-004 loss is documented as "NOT_APPLICABLE_AT_BINDING_LEVEL"
- Precedent: PSIG-006 was already THEORETICAL_BASELINE — accepting different semantics is established practice

**Strategy B: Inject File-Level Evidence into Binding (TARGETED)**
- Modify Phase 5 binding envelope construction to embed 40.3s IMPORTS counts as edge weights or additional node attributes
- Signal scripts already count edges — adding per-file IMPORTS edges (not just cross-DOM) would restore Level 1 signal capacity
- This effectively merges Level 1 and Level 2 evidence into a single binding
- Risk: binding envelope grows from 33 edges to potentially hundreds/thousands
- Benefit: signals preserve file-level structural intelligence within generic schema

**Strategy C: Dual-Signal Architecture (COMPREHENSIVE)**
- Keep both PSIG levels: Level 2 (binding topology, always available) and Level 1 (file-level, available when 40.3s exists)
- Level 2 is the generic corridor baseline
- Level 1 is an enrichment when code graph evidence exists
- DPSIG remains at topology level (40.4) — already dual-capable
- Benefit: PATH A specimens get Level 1 + Level 2; PATH B specimens get Level 2 only
- Cost: signal ontology complexity increases; LENS must handle optional Level 1 signals

---

## 8. Answers to the Five Required Questions

### Q1: Which signals already derive generically?

**DPSIG (both signals):** DPSIG-031 (CPI) and DPSIG-032 (CFA) are ALREADY fully generic. They derive from `canonical_topology.json` (40.4) with no shortcuts, no specimen-specific paths, no conformance artifacts. The `derive_relational_signals.py` script is topology-native and client-agnostic by design.

**PSIG computation infrastructure:** All 5 signal computation scripts (`compute_condition_correlation.py`, `compute_pressure_candidates.py`, `compute_pressure_zones.py`, `compute_signal_projection.py`, `compute_zone_projection.py`) are ALREADY generic. They read `binding/binding_envelope.json` in generic schema format. They would execute successfully on ANY specimen's generic binding envelope.

**Pressure zones, activation states, projections:** All derived deterministically from PSIG outputs. Generic by construction.

### Q2: Which signals still depend on shortcuts?

**PSIG values for BlueEdge:** Phase 6+7 currently copies pre-computed conformance artifacts instead of running signal computation on the generic binding. This is the SIGNAL_SHORTCUT_RETAINED classified by PI.BLUEEDGE.GENERIC-BINDING-MIGRATION.01.

**No other signal family has shortcut dependencies.** DPSIG is clean. The shortcut is isolated to the Phase 6+7 `fastapi_conformance_path` code path in `run_client_pipeline.py` (lines 1501-1539).

### Q3: Does 40.3s/40.3c influence DPSIG?

**No.** DPSIG Class 4 reads ONLY `canonical_topology.json` (40.4). 40.3s and 40.3c influence the BINDING ENVELOPE via Phase 5 enrichment (4 IMPORTS_ACROSS edges), which indirectly influences PSIG fan metrics. But DPSIG has zero dependency on 40.3s/40.3c.

Future DPSIG classes (1-3, 5-8) are documented as "reserved for future classes" and MAY use `binding_envelope.json` and `structural_topology_log.json`, but these classes do not yet exist.

### Q4: What changes in activation and projection under generic corridor?

- **PSIG-001:** Activation PRESERVED (HIGH). Magnitude changes (5.663 → 4.0). Primary attribution shifts from NODE-0021 to CE-04. Different structural phenomenon measured.
- **PSIG-002:** Activation PRESERVED (HIGH). Magnitude changes (3.210 → 4.0). DOM-04 remains primary but via different evidence.
- **PSIG-004:** Activation LOST (HIGH → NORMAL). Generic binding has uniform 1:1 CEU:surface mapping — no concentration possible. Zone classification degrades from COMPOUND_ZONE to COUPLING_ZONE.
- **PSIG-006:** Semantics CHANGED. From "unanchored structural node count" to "binding graph connected component isolation." Non-zero value (0.1515) appears where historical was 0.
- **Pressure zones:** PZ-001 survives but downgrades from COMPOUND_ZONE (3 conditions) to COUPLING_ZONE (2 conditions) or RESPONSIBILITY_ZONE depending on zone formation.
- **DPSIG:** No change under generic corridor (independent path).

### Q5: What is the minimum gap to fully generic signal derivation?

**Code change:** Remove `fastapi_conformance_path` check from Phase 6+7 in `run_client_pipeline.py` (lines 1501-1539). This is a trivial code change — delete ~40 lines and let `run_end_to_end.py` execute on the generic binding.

**Architectural decision:** Accept that generic corridor signals measure BINDING TOPOLOGY (Level 2) not FILE-LEVEL IMPORTS (Level 1). This is not a bug — it is a different abstraction level. The gap is:

1. **PSIG-004 loss** — requires either accepting the loss or injecting surface multiplicity evidence
2. **Signal value discontinuity** — new values are not comparable to historical; requires establishing new baseline
3. **LENS rendering impact** — untested; may affect tier classification and severity bands
4. **Signal regression framework** — no infrastructure to compare historical vs. generic and certify equivalence

**Estimated minimum migration:**
- Strategy A (accept Level 2): 1 stream (remove shortcut, establish new baseline, LENS verification)
- Strategy B (inject file-level): 2 streams (binding enrichment, signal recomputation, LENS verification)
- Strategy C (dual-signal): 3+ streams (signal ontology extension, pipeline modification, LENS multi-level display)

---

## 9. Honest Gaps

| Gap | Severity | Status |
|-----|----------|--------|
| Historical and generic signal values are NOT equivalent — they measure different structural phenomena | HIGH | STRUCTURAL — inherent to the abstraction-level difference |
| PSIG-004 zone_coverage_concentration lost under generic corridor | MEDIUM | STRUCTURAL — 1:1 CEU:surface in generic binding eliminates concentration variance |
| PSIG-006 semantics change from "unanchored file count" to "binding graph cluster isolation" | LOW | DEFINITION — requires clarification of intended measurement |
| LENS rendering with generic corridor signal values untested | MEDIUM | DEFERRED — downstream verification needed |
| No signal regression framework exists to certify value transitions | MEDIUM | INFRASTRUCTURE_GAP — no mechanism to compare historical vs. generic baselines |
| ESI/RAG not yet computed in any corridor | LOW | NOT_YET_IMPLEMENTED — concepts defined but no computation pipeline exists |
| DPSIG Classes 1-3, 5-8 not yet implemented | LOW | DEFERRED — only Class 4 (CPI, CFA) exists; future classes may have different lineage requirements |

---

## 10. Verdict

### GENERIC_SIGNAL_CORRIDOR_STRUCTURALLY_VIABLE_WITH_ABSTRACTION_LEVEL_GAP

The generic corridor CAN lawfully derive early-warning signals. The signal computation scripts are already generic. DPSIG is already generic. The pipeline infrastructure is ready.

The gap is NOT a missing implementation. The gap is an ABSTRACTION-LEVEL DIFFERENCE between what the historical signals measured (file-level import density from 40.3) and what the generic corridor measures (architectural binding topology from Phase 5). Both are valid structural intelligence. They are not the same measurement.

The decision required is: which abstraction level does Program Intelligence commit to as the generic signal corridor?

- **Level 2 only (binding topology):** Available for ALL specimens (PATH A and PATH B). Loses file-level granularity. Sufficient for architectural coupling and responsibility pressure. This is the natural generic corridor.
- **Level 1 + Level 2 (file + binding):** Available for PATH A specimens with code graph (40.3s). Preserves file-level granularity. PATH B specimens (HTML evidence, no code graph) get Level 2 only. This is the enriched corridor.
- **Level 1 injected into Level 2:** Merges file-level evidence into binding edges. Available when 40.3s exists. Richer signals but larger binding envelope. This is the convergent corridor.

**Recommendation:** Level 2 as generic baseline, Level 1 as enrichment when available. This preserves the principle that PATH A and PATH B specimens share the same governance spine while acknowledging that different evidence channels produce different signal resolution. The enrichment is ADDITIVE, not REPLACEMENT — consistent with established enrichment architecture (40.3s → IMPORTS_ACROSS already demonstrates this pattern).

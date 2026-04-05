# PSEE.F1 — Heuristic Registry

**Stream:** PSEE.F1
**Family:** PSEE
**Position:** INTERMEDIATE — NON-CANONICAL
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document catalogs the early heuristics and decomposition approaches detectable in the Phase A manual reverse-engineering corpus. Each heuristic is classified by its final status: RETAINED (survived into PSEE.0 canonical form), MODIFIED (present in PSEE.0 but transformed), or DISCARDED (present in Phase A but absent from PSEE.0).

**Value:** Knowing which heuristics were discarded prevents their reintroduction into PSEE.1+. Knowing which survived with modification identifies where the canonical form differs from the original intent.

---

#### METHODOLOGY LAYER

1. Identify each heuristic from: file existence patterns in phase_a_inventory.md, version/iteration indicators, PSEE.0 rule catalog cross-references.
2. For each heuristic, identify: original form (what Phase A did), survival status, canonical form if retained or modified.
3. Evidence-back every classification — no unobservable inferences.
4. Direct content of docs/reverse_engineering/ files not accessed; heuristics are derived from file naming, known document types, and PSEE.0 cross-references.

---

#### TECHNICAL LAYER

---

### H-01 — Architecture-First Decomposition

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-01 |
| **Status** | MODIFIED |
| **Original form** | Decompose the subject system by architectural responsibility zones first, then map to evidence |
| **Observable evidence** | `architectural_responsibility_zones.md`, `1.4_bluedge_architecture_reconstruction.md`, `implied_program_architecture_model.md` — all in docs/reverse_engineering/ |
| **Phase A application** | Architecture-first: assign responsibility zones → then find evidence to populate zones |
| **Canonical form** | R-GRP-01 through R-GRP-03 (grouping rules) — but evidence-first: enumerate source domains → derive structure from what exists |
| **Modification** | Direction of reasoning inverted. Phase A: architecture → evidence. PSEE.0: evidence → structure. The grouping principle survived; the direction did not. |
| **PSEE.0 rule reference** | R-GRP-01, R-GRP-02, R-GRP-03 |

---

### H-02 — Iterative Narrative Assessment

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-02 |
| **Status** | DISCARDED |
| **Original form** | Produce narrative preliminary assessments of the system in successive versions, refining understanding |
| **Observable evidence** | `blueedge_preliminary_assessment_v1.md`, `blueedge_preliminary_assessment_v_2.md` |
| **Phase A application** | Assessment v1 → Assessment v2: iterative interpretation to build understanding |
| **Canonical form** | NONE — PSEE.0 contains no assessment artifacts; all outputs are structural and evidence-mapped |
| **Reason for discard** | Narrative assessments are interpretation-based, not evidence-first. They produce conclusions that cannot be deterministically reproduced from source evidence alone. R-NRM-03 (unknown-space preservation) explicitly prohibits this approach: "do not infer from absence of evidence." |
| **PSEE.0 rule reference** | None (discarded) — indirectly blocked by R-NRM-03 |

---

### H-03 — Capability-Domain Taxonomy as Classification Anchor

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-03 |
| **Status** | DISCARDED |
| **Original form** | Classify system components by functional capability domain (taxonomy of capabilities) |
| **Observable evidence** | `capability_domain_taxonomy.md`, `capability_domain_taxonomy_v2.md`, `capability_domain_map.md`, `capability_ownership_surfaces.md`, `system_capability_map.md`, `system_capability_map_v2.md` |
| **Phase A application** | Organize the system understanding by what the system *can do* (capabilities), then map components to capabilities |
| **Canonical form** | NONE at 40.2 level — capability analysis is a 40.3/41.x domain, not a 40.2 intake concern |
| **Reason for discard** | The 40.2 intake layer organizes evidence by provenance (repository/source origin) not by capability. Capability-domain organization belongs to the semantic reconstruction layer. At the intake level, it would conflate "what evidence exists" with "what the system does." |
| **PSEE.0 rule reference** | R-GRP-01 displaced H-03: grouping by source domain, not by capability domain |

---

### H-04 — Component Inventory by Repository

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-04 |
| **Status** | RETAINED |
| **Original form** | Enumerate system components by their repository/archive of origin |
| **Observable evidence** | `component_inventory_v3_23.md` → formalized in `analysis/02_top_level_component_inventory.md` |
| **Phase A application** | List top-level components (backend, frontend, svg-agents, monitoring, load-tests, .github) by their repository root |
| **Canonical form** | R-GRP-01: "Group evidence by top-level source domain" — directly uses component labels from analysis/02_top_level_component_inventory.md |
| **Survival path** | component_inventory_v3_23.md → analysis/02_top_level_component_inventory.md → R-GRP-01 grounded application → ESI-U03/U04/U05 domain labels |
| **PSEE.0 rule reference** | R-GRP-01 |

---

### H-05 — Module-Level Enumeration

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-05 |
| **Status** | RETAINED |
| **Original form** | Enumerate all domain modules within a component at file-by-file resolution |
| **Observable evidence** | `backend_module_inventory.md` — dedicated to listing the 63 backend modules |
| **Phase A application** | Produce a complete list of all 63 backend domain modules |
| **Canonical form** | R-ABS-02: "Represent repeated structural patterns as typed pattern rows" — the 63 modules become 5 pattern rows |
| **Modification note** | The enumeration intent survived but was abstracted. Phase A: 63 individual module rows. PSEE.0: 5 pattern rows representing all 63. The count (63) survived as metadata within CEU-08-MODULES. |
| **PSEE.0 rule reference** | R-ABS-02, CEU-08-MODULES |

---

### H-06 — Cross-Component Coordination Hotspot Detection

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-06 |
| **Status** | MODIFIED |
| **Original form** | Identify points where components must coordinate — "hotspots" of cross-component dependency |
| **Observable evidence** | `coordination_hotspots.md`, `program_coordination_model.md`, `program_coordination_model_md.md` |
| **Phase A application** | Map cross-component coordination pressure points (likely used for program intelligence signal derivation) |
| **Canonical form** | R-NRM-02: "Declare overlap pairs with canonical preference" — overlap between standalone and platform-embedded components is the 40.2 formalization of the coordination hotspot concept |
| **Modification** | Original heuristic was about coordination dynamics (functional concern). PSEE.0 equivalent is about structural overlap (evidence management concern). The overlap pair declaration is structurally similar but epistemically narrower. |
| **PSEE.0 rule reference** | R-NRM-02, OVL-01/02 |

---

### H-07 — Visual Graph Modeling of Program Execution

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-07 |
| **Status** | DISCARDED (at 40.2 level) |
| **Original form** | Represent program execution flow as a visual graph |
| **Observable evidence** | `blueedge_program_execution_graph.md`, `blueedge_program_execution_graph_visual.md`, `program_execution_graph.md`, `program_execution_graph_framework.md` |
| **Phase A application** | Produced a graph-based model of program execution (at least 4 related artifacts, including a dedicated visual variant) |
| **Canonical form at 40.2** | NONE — 40.2 is a structural intake inventory, not an execution model |
| **Canonical form at 40.3+** | PARTIAL SURVIVAL — 40.3 `program_execution_graph.md` exists in the baseline. The execution graph concept survived into the structural reconstruction layer (40.3) but was not promoted to the intake layer (40.2). |
| **PSEE.0 rule reference** | Not in PSEE.0 (40.2 scope) |
| **Note** | This is the clearest example of a heuristic that survived in a different layer (40.3) rather than the target layer (40.2). |

---

### H-08 — Architecture-Source Reconciliation (Version-Anchored)

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-08 |
| **Status** | MODIFIED |
| **Original form** | Reconcile the architecture model against the actual source version (version-specific artifact) |
| **Observable evidence** | `architecture_source_reconciliation_v3_23.md` — explicitly version-anchored to v3.23 |
| **Phase A application** | Verify that the reconstructed architecture matched what was actually in source-v3.23 |
| **Canonical form** | R-NRM-01 (path normalization) + context_validation.md (Phase A ↔ Phase B system identity confirmation) |
| **Modification** | Phase A: architecture ↔ source reconciliation (interpretive). PSEE.0: path normalization (mechanical) + identity confirmation (metadata match). The reconciliation concept survived but was narrowed to path and version identity, stripping the interpretive architecture comparison. |
| **PSEE.0 rule reference** | R-NRM-01, context_validation.md |

---

### H-09 — Evidence Index with Named Evidence IDs

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-09 |
| **Status** | MODIFIED |
| **Original form** | Maintain an index of evidence artifacts with named IDs (EVID-001 through EVID-005) |
| **Observable evidence** | `blueedge_evidence_matrix.md`, `evidence_index.md` |
| **Phase A application** | Evidence IDs (EVID-001 through EVID-005) referenced in the evidence matrix |
| **Canonical form** | CEU-NN naming system (CEU-01 through CEU-13) in normalized_evidence_map.md |
| **Modification** | Naming scheme changed (EVID-NN → CEU-NN). Priority-tier ordering introduced (R-NAM-01). Sub-unit naming added (R-NAM-02). The core concept (named, indexed evidence units) survived with formal ordering semantics. |
| **PSEE.0 rule reference** | R-NAM-01, R-NAM-02, R-ABS-01 |

---

### H-10 — Reverse Engineering Mapping Table

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-10 |
| **Status** | MODIFIED |
| **Original form** | Maintain an explicit mapping from source constructs to analytical constructs in a table format |
| **Observable evidence** | `reverse_engineering_mapping_table.md` → `_prepopulated.md` → `_v2.md` (3 versions) |
| **Phase A application** | Iterative table building: start blank → prepopulate → refine to v2 |
| **Canonical form** | `transformation_mapping.md` in PSEE.0 — maps 53 Phase B units to Phase A contributors |
| **Modification** | Mapping direction formalized (Phase A → Phase B vs. prior source → analytical construct). Iteration methodology replaced by single deterministic pass. Version tracking replaced by immutable stream artifact. |
| **PSEE.0 rule reference** | All transformation rules (this heuristic is the precursor to the transformation mapping methodology) |

---

### H-11 — Source Snapshot Intake Record

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-11 |
| **Status** | RETAINED |
| **Original form** | Document what was taken as source evidence for a given version (explicit intake record) |
| **Observable evidence** | `source_snapshot_intake_v3_23.md` |
| **Phase A application** | Recorded what was ingested from source-v3.23 for the manual analysis |
| **Canonical form** | `evidence_boundary.md` (accessible via runs/run_02_blueedge/) and `intake_validation_log.md` (40.2) |
| **Survival path** | source_snapshot_intake_v3_23.md → evidence_boundary.md formalization → IVL validation checks |
| **Note** | This is the most direct Phase A → PSEE.0 lineage path. The snapshot intake concept became the formal evidence boundary model. |
| **PSEE.0 rule reference** | R-FLT-01, R-FLT-02, R-FLT-03 (all filtering rules operate on evidence_boundary.md) |

---

### H-12 — Lessons-Learned Capture (Multi-Part)

| Attribute | Value |
|---|---|
| **Heuristic ID** | H-12 |
| **Status** | MODIFIED |
| **Original form** | Capture execution lessons in multiple parts (lessons_p1, p2, p3) at stream closure |
| **Observable evidence** | `stream_01_lessons_learned.md`, `_p1.md`, `_p2.md`, `_p3.md` in docs/streams/ |
| **Phase A application** | Post-stream reflection across at least 3 lesson categories |
| **Canonical form** | IG.1A bootstrap model — explicit variable resolution requirement. The lessons from manual stream failures were translated into the mandatory pre-flight check structure (all variables explicit, no environment defaults). |
| **Modification** | Lessons became engineering requirements, not narrative retrospectives. The multi-part format was not retained; the constraints identified in lessons were codified in bootstrap and boundary contracts. |
| **PSEE.0 rule reference** | R-NRM-03 (unknown-space preservation) — the most direct lesson from Phase A |

---

### Heuristic Registry Summary

| Heuristic ID | Description | Status | PSEE.0 Reference |
|---|---|---|---|
| H-01 | Architecture-first decomposition | MODIFIED | R-GRP-01/02/03 (direction inverted) |
| H-02 | Iterative narrative assessment | DISCARDED | — |
| H-03 | Capability-domain taxonomy as classification anchor | DISCARDED | R-GRP-01 replaced it |
| H-04 | Component inventory by repository | RETAINED | R-GRP-01 |
| H-05 | Module-level enumeration | RETAINED | R-ABS-02 |
| H-06 | Cross-component coordination hotspot detection | MODIFIED | R-NRM-02 (narrowed) |
| H-07 | Visual graph modeling of program execution | DISCARDED (40.2) | 40.3 PEG (different layer) |
| H-08 | Architecture-source reconciliation | MODIFIED | R-NRM-01 + context_validation |
| H-09 | Evidence index with named evidence IDs | MODIFIED | R-NAM-01/02 + R-ABS-01 |
| H-10 | Reverse engineering mapping table | MODIFIED | transformation_mapping.md |
| H-11 | Source snapshot intake record | RETAINED | R-FLT-01/02/03 |
| H-12 | Lessons-learned capture (multi-part) | MODIFIED | IG.1A bootstrap model |

**By status: RETAINED: 3 | MODIFIED: 7 | DISCARDED: 2**

---

#### EVIDENCE LAYER

| Heuristic | Evidence source |
|---|---|
| H-01 (architecture-first) | phase_a_inventory.md — architectural_responsibility_zones, 1.4 architecture reconstruction; PSEE.0/rule_catalog_v0.md R-GRP-01 theoretical basis |
| H-02 (narrative assessment) | phase_a_inventory.md — preliminary_assessment_v1/v2; PSEE.0/rule_catalog_v0.md R-NRM-03 |
| H-03 (capability taxonomy) | phase_a_inventory.md — capability_domain_taxonomy/v2, system_capability_map/v2 |
| H-04 (component inventory) | phase_a_inventory.md — component_inventory_v3_23; PSEE.0/rule_catalog_v0.md R-GRP-01 grounded application |
| H-05 (module enumeration) | phase_a_inventory.md — backend_module_inventory; PSEE.0/rule_catalog_v0.md R-ABS-02 grounded application |
| H-06 (coordination hotspot) | phase_a_inventory.md — coordination_hotspots; PSEE.0/rule_catalog_v0.md R-NRM-02 |
| H-07 (visual graph) | phase_a_inventory.md — 4 execution graph variants; docs/pios/40.3/ program_execution_graph.md exists |
| H-08 (arch-source reconcile) | phase_a_inventory.md — architecture_source_reconciliation_v3_23; PSEE.0/context_validation.md |
| H-09 (evidence index) | phase_a_inventory.md — blueedge_evidence_matrix, evidence_index; PSEE.0/rule_catalog_v0.md R-NAM-01 |
| H-10 (mapping table) | phase_a_inventory.md — reverse_engineering_mapping_table x3; PSEE.0/transformation_mapping.md |
| H-11 (snapshot intake) | phase_a_inventory.md — source_snapshot_intake_v3_23; IG.1B_INPUT_BOUNDARY.md |
| H-12 (lessons-learned) | phase_a_inventory.md — stream_01_lessons_learned p1/p2/p3; IG.1A_BOOTSTRAP_INTERFACE_SPEC.md |

---

#### LIMITATIONS & BOUNDARIES

- Heuristic classification is inferred from file names and PSEE.0 cross-references only. Direct content of the Phase A docs/reverse_engineering/ files was not accessed.
- The DISCARDED/RETAINED/MODIFIED classification applies to the 40.2 intake layer only. Several discarded heuristics survived at 40.3+ layers (H-07 is explicitly noted).
- H-03 (capability taxonomy) is classified DISCARDED at 40.2 level; it may have survived in 41.x semantic layer. That determination is out of scope for PSEE.F1.

---

#### STATUS

| Check | Result |
|---|---|
| Heuristics identified | 12 (H-01 through H-12) |
| All evidence-backed | CONFIRMED |
| No canonical mutation | CONFIRMED |

**HEURISTIC REGISTRY: COMPLETE — 12 heuristics: 3 RETAINED, 7 MODIFIED, 2 DISCARDED**

# PSEE.F1 — Survival Mapping

**Stream:** PSEE.F1
**Family:** PSEE
**Position:** INTERMEDIATE — NON-CANONICAL
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document maps Phase A lineage elements to their canonical PSEE.0 form. For each lineage element that survived, it traces the exact path from Phase A source → intermediate form (if any) → canonical PSEE.0 construct. For elements that did not survive, it documents their endpoint. This is the closure document for the heuristic registry and lineage map.

**Value:** The survival mapping proves that the PSEE.0 rule system is traceable to specific Phase A antecedents, not created ex nihilo. It also confirms that elements excluded from 40.2 intake were either discarded intentionally or survived in adjacent layers.

---

#### METHODOLOGY LAYER

1. For each heuristic (H-01 through H-12) and each contradiction resolution: determine whether a specific Phase A artifact or conceptual construct survived into PSEE.0.
2. Map: Phase A source artifact → (intermediate form if applicable) → PSEE.0 canonical form.
3. For non-survivors: document the layer where the construct terminated (Phase A discard, 40.2 exclusion, or layer migration).
4. Evidence: PSEE.0 rule catalog grounded applications, transformation_mapping.md, phase_a_inventory.md.

---

#### TECHNICAL LAYER

---

### Survival Group A — Direct Path Survivals (Phase A artifact → PSEE.0 rule directly)

---

#### SUR-01 — component_inventory_v3_23.md → R-GRP-01

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-01 |
| **Phase A source** | `docs/reverse_engineering/component_inventory_v3_23.md` (structural, EXCLUDED) |
| **Intermediate form** | `source-v3.23/analysis/02_top_level_component_inventory.md` (formalized, ACCEPTED-SUPPORT-ONLY) |
| **PSEE.0 canonical form** | R-GRP-01: "Group evidence by top-level source domain" |
| **Survival path** | Phase A manual component enumeration → formalized into extraction analysis → provided component labels (backend, frontend, svg-agents, monitoring, load-tests, .github) → directly fed R-GRP-01 grounded application |
| **What survived** | The organizing principle: list system components by repository/archive origin |
| **What was discarded** | Any capability-oriented or program-alignment context from the original document |
| **PSEE.0 evidence** | rule_catalog_v0.md R-GRP-01 grounded application: "analysis/02_top_level_component_inventory.md enumerates 6 components" |

---

#### SUR-02 — backend_module_inventory.md → R-ABS-02 (63-module count)

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-02 |
| **Phase A source** | `docs/reverse_engineering/backend_module_inventory.md` (structural, EXCLUDED) |
| **Intermediate form** | `analysis/02_top_level_component_inventory.md` domain modules entry: "Domain Modules: 63 total" |
| **PSEE.0 canonical form** | R-ABS-02: pattern row approach with N=63; CEU-08-MODULES sub-unit |
| **Survival path** | Manual module enumeration (63 backend modules listed) → count captured in top-level component inventory → R-ABS-02 uses count as the instance multiplier for pattern rows |
| **What survived** | The count (63) and the conceptual fact of 63 distinct domain modules |
| **What was discarded** | Individual module names (auth, billing, fleet, vehicles, etc.) are not in PSEE.0 artifacts at 40.2 level — they are behind R-ABS-02 abstraction |

---

#### SUR-03 — source_snapshot_intake_v3_23.md → evidence_boundary.md → R-FLT-01/02/03

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-03 |
| **Phase A source** | `docs/reverse_engineering/source_snapshot_intake_v3_23.md` (structural, EXCLUDED) |
| **Intermediate form** | `docs/pios/runs/run_02_blueedge/evidence_boundary.md` — formalizes the intake boundary with explicit path lists |
| **PSEE.0 canonical form** | R-FLT-01 (provenance archives), R-FLT-02 (support-only downgrade), R-FLT-03 (exclusion list) |
| **Survival path** | Manual snapshot intake record → formal evidence_boundary.md with provenance_only_paths, explicitly_excluded_paths, source_materials annotations → 3 filtering rules operate entirely on evidence_boundary.md |
| **What survived** | The core concept: explicitly declare what is and is not evidence. |
| **What was discarded** | Manual authorship; replaced by formal boundary schema |

---

#### SUR-04 — reverse_engineering_mapping_table → transformation_mapping.md

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-04 |
| **Phase A source** | `reverse_engineering_mapping_table.md` → `_prepopulated.md` → `_v2.md` (structural, EXCLUDED) |
| **Intermediate form** | NONE — the iteration pattern was discarded; the concept was re-implemented |
| **PSEE.0 canonical form** | `PSEE.0/transformation_mapping.md` — single immutable mapping document |
| **Survival path** | Iterative mapping approach (3 versions) → the practice of explicit source-to-output mapping survived; the iteration/template model was replaced with single deterministic execution |
| **What survived** | The mapping discipline: trace each output unit back to its input contributor |
| **What was discarded** | Iteration, template model, versioning pattern |
| **PSEE.0 evidence** | transformation_mapping.md: "For each Phase B unit: identify the Phase A file(s) that provided the input. State the transformation type." |

---

#### SUR-05 — coordination_hotspots.md → analysis/03_overlap_validation.md → R-NRM-02

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-05 |
| **Phase A source** | `docs/reverse_engineering/coordination_hotspots.md` (dependency, EXCLUDED) |
| **Intermediate form** | `source-v3.23/analysis/03_overlap_validation.md` — operationalized as diff-based verification |
| **PSEE.0 canonical form** | R-NRM-02: "Declare overlap pairs with canonical preference, preserve unknown-space" |
| **Survival path** | Informal coordination hotspot identification (conceptual) → diff-based overlap verification (operational) → formal OVL-01/02 declaration (canonical) |
| **What survived** | The recognition that backend and frontend exist in both standalone and integrated forms; the need to declare a canonical preference |
| **What was discarded** | Program dynamics analysis (what the overlap means for delivery); only structural overlap declaration survived |

---

#### SUR-06 — evidence_matrix/evidence_index → CEU-NN naming system

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-06 |
| **Phase A source** | `docs/reverse_engineering/blueedge_evidence_matrix.md`, `evidence_index.md` (structural/auxiliary, EXCLUDED) |
| **Intermediate form** | NONE directly accessible; the EVID-001 through EVID-005 naming scheme was not formalized as an intermediate artifact |
| **PSEE.0 canonical form** | R-NAM-01 + R-NAM-02: CEU-NN sequential naming with priority-tier ordering and parent-role sub-unit suffixes |
| **Survival path** | Named evidence identifiers (EVID-NN) → structured CEU identifiers (CEU-NN) with ordering semantics |
| **What survived** | The concept of assigning stable named identifiers to evidence units |
| **What was discarded** | EVID prefix, unordered assignment (replaced by priority-tier ordering) |

---

### Survival Group B — Concept-Level Survivals (principle survived; source artifact did not)

---

#### SUR-07 — Reverse-Engineering Execution Model → psee_v0_execution_spec.md

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-07 |
| **Phase A source** | `docs/reverse_engineering/reverse_engineering_execution_model.md` (auxiliary, EXCLUDED) |
| **What survived** | The concept of a documented execution model — a step-by-step process for performing reverse engineering analysis |
| **PSEE.0 canonical form** | `PSEE.0/psee_v0_execution_spec.md` — 7-phase portable execution specification with prerequisites, decision points, and stop conditions |
| **Key transformation** | Phase A execution model: informal steps for a manual analyst. PSEE.0 execution spec: formal phases with explicit decision trees, stop conditions, and entity population sequences. The purpose (a documented process) survived; the form was entirely replaced. |

---

#### SUR-08 — Stream Closure / Lessons → IG.1A Bootstrap Interface

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-08 |
| **Phase A source** | `stream_01_lessons_learned_p1/p2/p3.md`, `stream_01_structural_baseline_completion.md` (auxiliary, EXCLUDED/GRAY-ZONE) |
| **What survived** | The principle: make all execution variables explicit before proceeding; capture what went wrong for future process hardening |
| **PSEE.0 canonical form** | `IG.1A_BOOTSTRAP_INTERFACE_SPEC.md` — mandatory explicit variable resolution model. Specifically: "No variable may remain implicit or derived from environment defaults without declaration." |
| **Key transformation** | Phase A: narrative lessons written after the fact. IG.1A: pre-execution gate enforced before the fact. The retrospective discipline became a prospective requirement. |

---

#### SUR-09 — Architecture Dossier / Architecture Reconstruction → evidence_surface_inventory.md + evidence_classification_map.md

| Attribute | Value |
|---|---|
| **Survival ID** | SUR-09 |
| **Phase A source** | `blueedge_architecture_dossier.md`, `1.4_bluedge_architecture_reconstruction.md` (structural, EXCLUDED) |
| **What survived** | The concept of a comprehensive, structured document capturing all system components with their roles and evidence classification |
| **PSEE.0 canonical form** | `40.2/evidence_surface_inventory.md` (comprehensive domain inventory) + `40.2/evidence_classification_map.md` (classification of all evidence) |
| **Key transformation** | Phase A: architecture reconstruction combines structural observations with interpretive architecture models. 40.2: evidence surface inventory is evidence-only; no architectural interpretation. The comprehensive coverage intent survived; the interpretive content was excised. |

---

### Survival Group C — Non-Survivals (terminated at Phase A)

---

#### TERM-01 — Preliminary Assessment (v1/v2) — TERMINATED

| Attribute | Value |
|---|---|
| **Termination ID** | TERM-01 |
| **Phase A source** | `blueedge_preliminary_assessment_v1.md`, `blueedge_preliminary_assessment_v_2.md` |
| **Termination reason** | Narrative assessment approach is epistemically incompatible with evidence-first methodology. No portion of the preliminary assessments survived into 40.2. |
| **Layer of termination** | Phase A corpus — did not survive into analysis/ files or evidence_boundary.md |
| **PSEE.0 impact** | R-NRM-03 (unknown-space preservation) is the canonical opposite of preliminary assessment. The rule explicitly prohibits inference from absence of evidence — the primary mechanism of preliminary assessment. |

---

#### TERM-02 — Capability Domain Taxonomy — TERMINATED at 40.2

| Attribute | Value |
|---|---|
| **Termination ID** | TERM-02 |
| **Phase A source** | `capability_domain_taxonomy.md`, `capability_domain_taxonomy_v2.md`, `system_capability_map.md`, `system_capability_map_v2.md` |
| **Termination reason** | Capability classification is not a 40.2 intake concern. The 40.2 layer is provenance-based, not capability-based. |
| **Layer of termination** | Terminated at 40.2; POSSIBLE SURVIVAL at 40.3/41.x (capability reasoning belongs in semantic reconstruction) |
| **PSEE.0 impact** | None — R-GRP-01 displaced capability-domain grouping with source-domain grouping. |

---

#### TERM-03 — Visual Execution Graph — TERMINATED at 40.2

| Attribute | Value |
|---|---|
| **Termination ID** | TERM-03 |
| **Phase A source** | `blueedge_program_execution_graph_visual.md` |
| **Termination reason** | Visual representation artifacts are not evidence intake artifacts. |
| **Layer of termination** | Terminated at 40.2. The non-visual execution graph concept survived at 40.3 (program_execution_graph.md). |
| **PSEE.0 impact** | None at PSEE.0 scope. |

---

#### TERM-04 — _md.md Format Variants — TERMINATED

| Attribute | Value |
|---|---|
| **Termination ID** | TERM-04 |
| **Phase A source** | 5 `_md.md` suffixed files (CONTRA-01) |
| **Termination reason** | Format migration artifacts; no analytical content beyond their originals. |
| **Layer of termination** | Phase A corpus — entirely excluded. |
| **PSEE.0 impact** | None. The PSEE.0 artifact format (single, immutable, no format variants) eliminates the possibility of this pattern recurring. |

---

### Survival Map Summary

| ID | Phase A source | Survived to | Canonical form |
|---|---|---|---|
| SUR-01 | component_inventory_v3_23.md | R-GRP-01 | Top-level domain grouping rule |
| SUR-02 | backend_module_inventory.md | R-ABS-02 | Pattern row abstraction (63 count) |
| SUR-03 | source_snapshot_intake_v3_23.md | R-FLT-01/02/03 | All filtering rules |
| SUR-04 | RE mapping table (3 versions) | transformation_mapping.md | Single immutable mapping document |
| SUR-05 | coordination_hotspots.md | R-NRM-02 | Overlap pair declaration |
| SUR-06 | evidence_matrix / evidence_index | R-NAM-01/02 | CEU-NN naming system |
| SUR-07 | RE execution model | psee_v0_execution_spec.md | 7-phase execution specification |
| SUR-08 | Stream 1 lessons (3 parts) | IG.1A bootstrap interface | Mandatory pre-execution variable resolution |
| SUR-09 | Architecture dossier / reconstruction | evidence_surface_inventory + classification_map | Comprehensive evidence surface (minus interpretation) |
| TERM-01 | Preliminary assessments v1/v2 | TERMINATED | — |
| TERM-02 | Capability domain taxonomy | TERMINATED at 40.2 | — |
| TERM-03 | Visual execution graph | TERMINATED at 40.2 | — |
| TERM-04 | _md.md format variants | TERMINATED | — |

**Survivals: 9 | Terminations: 4**

---

#### EVIDENCE LAYER

| Mapping | Evidence source |
|---|---|
| SUR-01 | PSEE.0/rule_catalog_v0.md R-GRP-01 grounded application (cites analysis/02_top_level_component_inventory.md) |
| SUR-02 | PSEE.0/rule_catalog_v0.md R-ABS-02 grounded application (63 modules cited) |
| SUR-03 | PSEE.0/transformation_mapping.md evidence_boundary.md → 12 Phase B units; IG.1B_INPUT_BOUNDARY.md |
| SUR-04 | PSEE.0/transformation_mapping.md; phase_a_inventory.md (3 mapping table files) |
| SUR-05 | PSEE.0/rule_catalog_v0.md R-NRM-02 grounded application (analysis/03_overlap_validation.md) |
| SUR-06 | PSEE.0/rule_catalog_v0.md R-NAM-01 grounded application; phase_a_inventory.md (evidence_matrix, evidence_index) |
| SUR-07 | phase_a_inventory.md (reverse_engineering_execution_model.md); PSEE.0/psee_v0_execution_spec.md |
| SUR-08 | phase_a_inventory.md (stream_01_lessons_learned p1/p2/p3); IG.1A_BOOTSTRAP_INTERFACE_SPEC.md |
| SUR-09 | phase_a_inventory.md (architecture_dossier, 1.4 architecture reconstruction); 40.2 baseline artifacts |
| TERM-01-04 | phase_a_inventory.md (EXCLUDED disposition for all) |

---

#### LIMITATIONS & BOUNDARIES

- SUR-07 (execution model) and SUR-08 (lessons) are concept-level survivals, not artifact-level. The Phase A documents are not directly accessible; survival is inferred from conceptual alignment between Phase A file purpose (from naming + inventory) and PSEE.0 artifact function.
- SUR-04 (mapping table) survival path goes through a complete methodological replacement, not a refinement. Calling it a "survival" acknowledges the discipline concept, not the artifact.
- TERM-02 (capability taxonomy): this is a termination at 40.2 only. Whether it survived at 40.3/41.x is outside PSEE.F1 scope.

---

#### STATUS

| Check | Result |
|---|---|
| Survival paths mapped | 9 (SUR-01 through SUR-09) |
| Terminations documented | 4 (TERM-01 through TERM-04) |
| All evidence-backed | CONFIRMED |
| No canonical mutation | CONFIRMED |

**SURVIVAL MAPPING: COMPLETE — 9 survivals, 4 terminations**

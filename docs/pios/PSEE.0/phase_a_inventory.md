# PSEE.0 — Phase A Inventory

**Stream:** PSEE.0
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document enumerates and classifies all Markdown files in the BlueEdge Phase A corpus. Classification determines how each file contributed (or was excluded) from the Phase B (40.2) transformation, and informs rule derivation in subsequent phases. Every file is accounted for — none are skipped.

**Value:** A complete, classified Phase A inventory is the prerequisite for any coverage measurement. It establishes the transformation surface and prevents rules from being derived from an incomplete or misclassified input set.

---

#### METHODOLOGY LAYER

1. Enumerate all MD files in source-v3.23/ and docs/ (after path normalization per source_normalization_log.md).
2. Classify each file as: **structural** (defines components, boundaries, architecture) | **functional** (describes capabilities, features, behaviors) | **dependency** (maps inter-component relationships) | **narrative** (interpretive account, assessment, context) | **auxiliary** (index, log, template, administrative).
3. Record the 40.2 intake disposition: ACCEPTED | ACCEPTED-SUPPORT-ONLY | EXCLUDED | GRAY-ZONE | NOT-INGESTED.
4. Compute totals per classification and disposition.

---

#### TECHNICAL LAYER

### Section 1 — source-v3.23/ MD Files (5 files)

These files were directly accepted (as support-only) into the 40.2 intake.

| # | File | Path | Classification | 40.2 Disposition |
|---|------|------|----------------|-----------------|
| 1 | 00_extraction_log.md | source-v3.23/analysis/ | auxiliary | ACCEPTED-SUPPORT-ONLY |
| 2 | 01_repository_classification.md | source-v3.23/analysis/ | structural | ACCEPTED-SUPPORT-ONLY |
| 3 | 02_top_level_component_inventory.md | source-v3.23/analysis/ | structural | ACCEPTED-SUPPORT-ONLY |
| 4 | 03_overlap_validation.md | source-v3.23/analysis/ | structural | ACCEPTED-SUPPORT-ONLY |
| 5 | README.md | source-v3.23/extracted/platform/blueedge-platform/ | narrative | ACCEPTED (as documentation) |

---

### Section 2 — docs/reverse_engineering/ (56 files)

These are the primary structural and architectural analysis artifacts. They were EXCLUDED from 40.2 intake as prior analytical outputs. They represent the human-authored knowledge base that PSEE.0 is formalizing into extraction rules.

| # | File | Classification | Notes |
|---|------|----------------|-------|
| 1 | 1.2_bluedge_website_intent_analysis.md | narrative | Website intent analysis |
| 2 | 1.3_bluedge_capability_map.md | functional | Capability surface map |
| 3 | 1.4_bluedge_architecture_reconstruction.md | structural | Architecture reconstruction |
| 4 | 1.5_repository_architecture_mapping.md | structural | Repository architecture mapping |
| 5 | architectural_responsibility_zones.md | structural | Responsibility zone definitions |
| 6 | architecture_program_alignment.md | structural | Architecture ↔ program alignment |
| 7 | architecture_program_alignment_md.md | structural | Architecture program alignment (variant) |
| 8 | architecture_source_reconciliation_v3_23.md | structural | Architecture ↔ source reconciliation v3.23 |
| 9 | backend_module_inventory.md | structural | Backend module enumeration (63 modules) |
| 10 | blueedge_architecture_dossier.md | structural | Full architecture dossier |
| 11 | blueedge_evidence_matrix.md | structural | Evidence matrix (evidence ID → artifact) |
| 12 | blueedge_gitlab_inspection_plan.md | auxiliary | Inspection planning artifact |
| 13 | blueedge_preliminary_assessment_v1.md | narrative | Preliminary assessment v1 |
| 14 | blueedge_preliminary_assessment_v_2.md | narrative | Preliminary assessment v2 |
| 15 | blueedge_program_execution_graph.md | dependency | Program execution graph |
| 16 | blueedge_program_execution_graph_visual.md | dependency | Execution graph visual variant |
| 17 | capability_domain_map.md | functional | Capability domain mapping |
| 18 | capability_domain_taxonomy.md | functional | Capability taxonomy |
| 19 | capability_domain_taxonomy_v2.md | functional | Capability taxonomy v2 |
| 20 | capability_ownership_surfaces.md | functional | Capability ownership surfaces |
| 21 | component_inventory_v3_23.md | structural | Component inventory v3.23 |
| 22 | coordination_hotspots.md | dependency | Cross-component coordination hotspots |
| 23 | cross_domain_programs.md | structural | Cross-domain program structure |
| 24 | cross_domain_programs_md.md | structural | Cross-domain programs (variant) |
| 25 | domain_execution_areas.md | structural | Domain execution area definitions |
| 26 | domain_execution_areas_md.md | structural | Domain execution areas (variant) |
| 27 | evidence_index.md | auxiliary | Evidence index (EVID-001 through EVID-005) |
| 28 | frontend_capability_surface.md | functional | Frontend capability surface |
| 29 | frontend_feature_inventory.md | functional | Frontend feature enumeration |
| 30 | implied_program_architecture_model.md | structural | Implied architecture model |
| 31 | platform_architecture_assessment.md | structural | Platform architecture assessment |
| 32 | program_architecture_implications.md | structural | Architecture → program implications |
| 33 | program_architecture_inventory.md | structural | Program architecture inventory |
| 34 | program_coordination_model.md | dependency | Program coordination model |
| 35 | program_coordination_model_md.md | dependency | Coordination model (variant) |
| 36 | program_execution_graph.md | dependency | Execution graph |
| 37 | program_execution_graph_framework.md | structural | Execution graph framework definition |
| 38 | reconstructed_program_structure.md | structural | Reconstructed program structure |
| 39 | reconstructed_program_structure_md.md | structural | Reconstructed structure (variant) |
| 40 | repository_map.md | structural | Repository ↔ domain mapping |
| 41 | repository_topology.md | structural | Repository topology |
| 42 | reverse_engineering_execution_model.md | auxiliary | RE execution model |
| 43 | reverse_engineering_inputs (1).md | auxiliary | RE inputs log |
| 44 | reverse_engineering_insights.md | narrative | RE insights summary |
| 45 | reverse_engineering_mapping_table.md | structural | RE mapping table |
| 46 | reverse_engineering_mapping_table_prepopulated.md | structural | RE mapping table prepopulated |
| 47 | reverse_engineering_mapping_table_v2.md | structural | RE mapping table v2 |
| 48 | reverse_engineering_outputs.md | auxiliary | RE outputs list |
| 49 | reverse_engineering_steps.md | auxiliary | RE step definitions |
| 50 | source_snapshot_intake_v3_23.md | structural | Source snapshot intake record v3.23 |
| 51 | stream_01_lessons_learned.md | auxiliary | Stream 1 lessons learned |
| 52 | stream_01_structural_baseline_completion.md | auxiliary | Stream 1 completion record |
| 53 | system_capability_map.md | functional | System capability map |
| 54 | system_capability_map_v2.md | functional | System capability map v2 |
| 55 | system_component_map.md | structural | System component map |
| 56 | technology_stack.md | structural | Technology stack inventory |

**40.2 Disposition: EXCLUDED (prior analytical output)**

---

### Section 3 — docs/signal-layer/ (10 files)

| # | File | Classification | Notes |
|---|------|----------------|-------|
| 1 | blueedge_activity_signals.md | functional | Activity signal definitions |
| 2 | blueedge_delivery_dependency_signals.md | dependency | Delivery dependency signals |
| 3 | blueedge_signal_dataset_specification.md | structural | Signal dataset specification |
| 4 | blueedge_structural_signals.md | structural | Structural signal definitions |
| 5 | capability_maturity_model.md | structural | Capability maturity model |
| 6 | execution_signal_dashboard.md | narrative | Signal dashboard overview |
| 7 | funding_signal_narrative.md | narrative | Funding signal narrative |
| 8 | program_execution_ontology.md | structural | Program execution ontology |
| 9 | program_execution_ontology_map.md | structural | Execution ontology map |
| 10 | program_intelligence_brief.md | narrative | Program intelligence summary brief |

**40.2 Disposition: EXCLUDED (prior analytical output)**

---

### Section 4 — docs/streams/ (8 files)

| # | File | Classification | Notes |
|---|------|----------------|-------|
| 1 | stream_01_lessons_learned.md | auxiliary | Stream 1 lessons |
| 2 | stream_01_lessons_learned_p1.md | auxiliary | Stream 1 lessons part 1 |
| 3 | stream_01_lessons_learned_p2.md | auxiliary | Stream 1 lessons part 2 |
| 4 | stream_01_lessons_learned_p3.md | auxiliary | Stream 1 lessons part 3 |
| 5 | stream_01_reverse_engineering.md | auxiliary | Stream 1 execution record |
| 6 | stream_02_program_charter.md | auxiliary | Stream 2 execution record |
| 7 | stream_03_execution_telemetry.md | auxiliary | Stream 3 execution record |
| 8 | stream_04_case_study.md | auxiliary | Stream 4 execution record |

**40.2 Disposition: GRAY-ZONE (not in evidence_boundary.md)**

---

### Section 5 — docs/execution-telemetry/ (7 files)

| # | File | Classification | Notes |
|---|------|----------------|-------|
| 1 | blueedge_execution_telemetry_dataset.md | structural | Execution telemetry dataset |
| 2 | blueedge_signal_dataset.md | structural | Signal dataset |
| 3 | dependency_map.md | dependency | Component dependency map |
| 4 | engineering_activity_metrics.md | functional | Engineering activity metrics |
| 5 | execution_telemetry_baseline.md | structural | Execution telemetry baseline |
| 6 | module_activity_heatmap.md | functional | Module activity heatmap |
| 7 | telemetry_model.md | structural | Telemetry model definition |

**40.2 Disposition: EXCLUDED (prior analytical output)**

---

### Section 6 — docs/case-study/ (5 files)

| # | File | Classification | Notes |
|---|------|----------------|-------|
| 1 | blueedge_program_conditions.md | narrative | Program conditions analysis |
| 2 | blueedge_program_diagnosis.md | narrative | Program diagnosis |
| 3 | blueedge_program_intelligence_brief.md | narrative | Program intelligence brief |
| 4 | blueedge_program_intelligence_case.md | narrative | Program intelligence case study |
| 5 | signal_case_study_blueedge.md | narrative | Signal case study |

**40.2 Disposition: EXCLUDED (prior analytical output)**

---

### Section 7 — docs/program-charter/ (5 files)

| # | File | Classification | Notes |
|---|------|----------------|-------|
| 1 | blueedge_program_charter.md | structural | Program charter document |
| 2 | cto_briefing_blueedge_program_intelligence.md | narrative | CTO briefing |
| 3 | governance_model.md | structural | Program governance model |
| 4 | program_capability_model.md | functional | Program capability model |
| 5 | program_roadmap.md | structural | Program roadmap |

**40.2 Disposition: EXCLUDED (prior analytical output)**

---

### Section 8 — docs/discipline/ (3 files)

| # | File | Classification | Notes |
|---|------|----------------|-------|
| 1 | discipline_execution_lessons.md | auxiliary | Execution discipline lessons |
| 2 | lessons_registry.md | auxiliary | Discipline lessons registry |
| 3 | lessons_template.md | auxiliary | Lesson documentation template |

**40.2 Disposition: GRAY-ZONE**

---

### Section 9 — docs/ root (1 file)

| # | File | Classification | Notes |
|---|------|----------------|-------|
| 1 | docs_index_blueedge_program_intelligence.md | auxiliary | Repository-wide MD file index |

**40.2 Disposition: GRAY-ZONE**

---

### Phase A Inventory Summary

| Category | Count | Classification distribution | 40.2 Disposition |
|---|---|---|---|
| source-v3.23/analysis/ | 4 | 3 structural, 1 auxiliary | ACCEPTED-SUPPORT-ONLY |
| source-v3.23/ README.md | 1 | 1 narrative | ACCEPTED |
| docs/reverse_engineering/ | 56 | 28 structural, 12 functional, 6 dependency, 5 narrative, 5 auxiliary | EXCLUDED |
| docs/signal-layer/ | 10 | 5 structural, 2 functional, 1 dependency, 2 narrative | EXCLUDED |
| docs/streams/ | 8 | 8 auxiliary | GRAY-ZONE |
| docs/execution-telemetry/ | 7 | 4 structural, 2 functional, 1 dependency | EXCLUDED |
| docs/case-study/ | 5 | 5 narrative | EXCLUDED |
| docs/program-charter/ | 5 | 3 structural, 1 functional, 1 narrative | EXCLUDED |
| docs/discipline/ | 3 | 3 auxiliary | GRAY-ZONE |
| docs/ root | 1 | 1 auxiliary | GRAY-ZONE |
| **TOTAL** | **100** | | |

**By classification:**
| Classification | Count | % |
|---|---|---|
| structural | 52 | 52% |
| functional | 17 | 17% |
| auxiliary | 20 | 20% |
| narrative | 8 | 8% |
| dependency | 8 | 8% |  (wait — let me recount)

Recount:
- structural: 3 (analysis) + 28 (RE) + 5 (signal) + 4 (telemetry) + 3 (charter) = 43
- functional: 0 (analysis) + 12 (RE) + 2 (signal) + 2 (telemetry) + 1 (charter) = 17
- dependency: 0 (analysis) + 6 (RE) + 1 (signal) + 1 (telemetry) + 0 (charter) = 8
- narrative: 1 (README) + 5 (RE) + 2 (signal) + 0 (telemetry) + 5 (case) + 1 (charter) = 14
- auxiliary: 1 (analysis) + 5 (RE) + 0 (signal) + 8 (streams) + 0 (telemetry) + 0 (case) + 3 (discipline) + 1 (index) = 18

Total: 43 + 17 + 8 + 14 + 18 = 100 ✓

**By classification (corrected):**
| Classification | Count | % |
|---|---|---|
| structural | 43 | 43% |
| functional | 17 | 17% |
| auxiliary | 18 | 18% |
| narrative | 14 | 14% |
| dependency | 8 | 8% |
| **Total** | **100** | **100%** |

**By 40.2 disposition:**
| Disposition | Count |
|---|---|
| ACCEPTED-SUPPORT-ONLY | 4 |
| ACCEPTED | 1 |
| EXCLUDED | 83 |
| GRAY-ZONE | 12 |
| **Total** | **100** |

---

#### EVIDENCE LAYER

| Classification decision | Basis |
|---|---|
| analysis/ files = structural/auxiliary | Content verified by reading: classification and inventory files are structural; extraction log is auxiliary |
| docs/reverse_engineering/ = structural majority | 56-file corpus is dominated by architecture reconstruction, inventory, and mapping artifacts |
| docs/streams/ = auxiliary | These are execution records and lessons-learned artifacts (stream management) |
| Excluded disposition | evidence_boundary.md explicitly_excluded_paths |
| Gray-zone disposition | Absent from both evidence_boundary.md inclusion and exclusion lists |

---

#### LIMITATIONS & BOUNDARIES

- HTML files (3) and source code (~1,466 files) are Phase A evidence but are not MD files. This inventory covers MD files only per contract Section F.
- File classification is based on filename and content sampling. A small number of boundary cases exist (e.g., narrative vs. structural in assessment documents); these are classified by primary function.
- Gray-zone files (12) are present in the inventory but their relationship to 40.2 outputs is not established — they are administrative artifacts from prior analytical streams.

---

#### REUSABILITY STATEMENT

To apply this inventory to another repository corpus:
1. Enumerate MD files by directory, not by content — directory structure reflects analytical layering.
2. Apply the five-class classification (structural / functional / dependency / narrative / auxiliary) consistently across file types.
3. Cross-reference each file against the evidence_boundary.md of the downstream pipeline to determine 40.2 disposition.
4. Always separate source-v3.23-equivalent files (primary evidence) from docs/-equivalent files (analytical outputs) — they play different roles in the transformation.

---

#### STATUS

| Check | Result |
|---|---|
| Phase A MD files enumerated | COMPLETE — 100 files |
| All files classified | COMPLETE |
| 40.2 disposition recorded for all files | COMPLETE |
| Gray-zone files flagged | 12 files (GRAY-ZONE) |

**PHASE A INVENTORY: COMPLETE**

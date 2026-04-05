# PSEE.F1 — Contradiction Matrix

**Stream:** PSEE.F1
**Family:** PSEE
**Position:** INTERMEDIATE — NON-CANONICAL
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document identifies conflicting constructs, redundant artifacts, and unresolved competing representations in the Phase A corpus. For each contradiction, it records the resolution path (where one construct displaced another) or its abandonment (where the conflict was left unresolved at corpus level and never formalized).

**Value:** Contradictions mark the positions where the manual analysis was unstable before formalization. Understanding where instability existed — and how it was resolved — validates the robustness of the canonical constructs that emerged.

---

#### METHODOLOGY LAYER

1. Identify contradictions from: duplicate files with same name, version pairs without clear deprecation markers, competing organizational approaches applied to the same content, cross-boundary file appearances.
2. For each contradiction: identify both conflicting constructs, classify the type (FORMAT | ORGANIZATIONAL | EPISTEMIC | SCOPE), and determine resolution path or abandonment status.
3. Evidence: file enumeration from phase_a_inventory.md and cross-reference with PSEE.0 artifacts.

---

#### TECHNICAL LAYER

---

### CONTRA-01 — Format Migration Ambiguity (_md.md pairs)

| Attribute | Value |
|---|---|
| **Contradiction ID** | CONTRA-01 |
| **Type** | FORMAT |
| **Conflicting constructs** | Original files vs. `_md.md` suffixed variants of the same document |
| **Observable instances** | `architecture_program_alignment.md` ↔ `architecture_program_alignment_md.md` |
| | `cross_domain_programs.md` ↔ `cross_domain_programs_md.md` |
| | `reconstructed_program_structure.md` ↔ `reconstructed_program_structure_md.md` |
| | `domain_execution_areas.md` ↔ `domain_execution_areas_md.md` |
| | `program_coordination_model.md` ↔ `program_coordination_model_md.md` |
| **Total pairs:** | 5 confirmed duplicate format pairs |
| **Classification** | Both files in each pair are classified EXCLUDED and have the same disposition — neither was promoted to 40.2 intake |
| **Nature of conflict** | Two versions of the same document with different formatting coexisted without an explicit deprecation record. The `_md.md` suffix suggests a format conversion artifact (likely Word or another format converted to Markdown), with the original retained alongside. |
| **Resolution path** | ABANDONED at corpus level — neither version of any pair was promoted to intake. The conflict was resolved by excluding both versions from the formal intake boundary. |
| **PSEE.0 impact** | None — CONTRA-01 constructs were entirely excluded (R-FLT-03). |

---

### CONTRA-02 — Competing Execution Graph Representations

| Attribute | Value |
|---|---|
| **Contradiction ID** | CONTRA-02 |
| **Type** | ORGANIZATIONAL |
| **Conflicting constructs** | Multiple overlapping execution graph artifacts without a declared canonical |
| **Observable instances** | `program_execution_graph.md` (docs/reverse_engineering/) |
| | `blueedge_program_execution_graph.md` (docs/reverse_engineering/) |
| | `blueedge_program_execution_graph_visual.md` (docs/reverse_engineering/) |
| | `program_execution_graph_framework.md` (docs/reverse_engineering/) |
| **Classification** | All 4 are classified dependency or structural; all EXCLUDED |
| **Nature of conflict** | Two named execution graph documents (`program_execution_graph.md` vs. `blueedge_program_execution_graph.md`) with overlapping scope and no declared supersession. A visual variant and a framework definition further fragment the execution graph construct. |
| **Resolution path** | ABANDONED at 40.2 level — all four excluded. PARTIAL RESOLUTION at 40.3 level: `docs/pios/40.3/program_execution_graph.md` exists in the baseline, suggesting the concept was eventually resolved in the structural reconstruction layer. |
| **PSEE.0 impact** | None at 40.2 scope — but the resolution at 40.3 confirms the construct was not inherently unresolvable; it required a different layer. |

---

### CONTRA-03 — Dual Capability Classification Approach

| Attribute | Value |
|---|---|
| **Contradiction ID** | CONTRA-03 |
| **Type** | ORGANIZATIONAL |
| **Conflicting constructs** | Capability-domain taxonomy approach vs. component-repository approach |
| **Observable instances** | Capability track: `capability_domain_taxonomy.md`, `capability_domain_taxonomy_v2.md`, `capability_domain_map.md`, `system_capability_map.md`, `system_capability_map_v2.md` |
| | Component track: `component_inventory_v3_23.md`, `system_component_map.md`, `architecture_source_reconciliation_v3_23.md` |
| **Nature of conflict** | Two concurrent organizational frameworks: (a) classify by what the system does (capabilities), (b) classify by what exists in repositories (components). Both frameworks were developed in parallel with no declared winner. |
| **Resolution path** | RESOLVED in favor of component/repository track at 40.2 level. R-GRP-01 explicitly groups by "top-level source domain" (repository structure), not capability domain. Capability-domain track was excluded from 40.2 and relegated to 40.3/41.x layers. |
| **PSEE.0 impact** | R-GRP-01 encodes the resolution: evidence-provenance grouping (component track) was formalized; capability grouping was not a 40.2 concern. |

---

### CONTRA-04 — Cross-Boundary File Placement (stream_01_lessons_learned.md)

| Attribute | Value |
|---|---|
| **Contradiction ID** | CONTRA-04 |
| **Type** | SCOPE |
| **Conflicting constructs** | Same filename appearing in two corpus directories with different dispositions |
| **Observable instances** | `stream_01_lessons_learned.md` appears in both: |
| | — `docs/reverse_engineering/` (listed in phase_a_inventory.md Section 2) |
| | — `docs/streams/` (listed in phase_a_inventory.md Section 4) |
| **Classification** | docs/reverse_engineering/ instance: EXCLUDED; docs/streams/ instance: GRAY-ZONE |
| **Nature of conflict** | The same artifact was placed in two directories with different governance dispositions (one explicitly excluded, one gray-zone). This creates an ambiguity about where the file belongs conceptually. |
| **Resolution path** | UNRESOLVED in Phase A corpus — no explicit deprecation. Resolved by effect in 40.2 intake: both instances excluded (different reasons: RE instance = excluded as prior analytical output; streams instance = gray-zone = also not ingested). Same practical outcome, different basis. |
| **PSEE.0 impact** | None — both instances excluded. The unresolved placement was not material to the canonical intake structure. |

---

### CONTRA-05 — Preliminary Assessment vs. Formal Reconstruction (Epistemic Mode)

| Attribute | Value |
|---|---|
| **Contradiction ID** | CONTRA-05 |
| **Type** | EPISTEMIC |
| **Conflicting constructs** | Iterative narrative assessment (preliminary_assessment_v1/v2) vs. deterministic structural reconstruction (architecture_source_reconciliation_v3_23, component_inventory_v3_23) |
| **Observable instances** | Narrative: `blueedge_preliminary_assessment_v1.md`, `blueedge_preliminary_assessment_v_2.md`, `reverse_engineering_insights.md` |
| | Deterministic: `architecture_source_reconciliation_v3_23.md`, `component_inventory_v3_23.md`, `source_snapshot_intake_v3_23.md` |
| **Nature of conflict** | Two epistemic modes operated simultaneously: (a) interpretive/narrative — "here is my assessment," (b) structural/deterministic — "here is what exists." The v3.23 anchoring in deterministic artifacts suggests these were produced after the narrative assessments as a verification pass. |
| **Resolution path** | RESOLVED — the deterministic mode was canonicalized. R-NRM-03 (unknown-space preservation) and the evidence-first principle in PSEE.0 encode this resolution explicitly: "no evidence → no output." The narrative approach was not only excluded but its opposite was formalized as a governing rule. |
| **PSEE.0 impact** | R-NRM-03 is the canonical resolution of CONTRA-05. The discarding of H-02 (iterative narrative assessment) is the direct consequence. |

---

### CONTRA-06 — DRIFT-001: Fabricated Reference in Entity Telemetry

| Attribute | Value |
|---|---|
| **Contradiction ID** | CONTRA-06 |
| **Type** | EPISTEMIC |
| **Conflicting constructs** | Baseline CE-003 telemetry (OVL-01/OVL-02 indirect coverage, no N-C03) vs. Regenerated CE-003 telemetry (N-C03 fabricated reference) |
| **Observable instances** | `IG.1D_DRIFT_CLASSIFICATION.md` DRIFT-001: `node_ref: N-C03` and `M-08` in regenerated entity_telemetry.md |
| **Nature of conflict** | During IG.1D comparison, a fabricated PEG node reference (N-C03, not in 40.3 entity catalog N-01 through N-17) and entity reference (M-08, not in any 40.3 artifact) were introduced into the CE-003 section of entity_telemetry.md during re-generation. |
| **Resolution path** | RESOLVED via IG.1R — IG.1R_CORRECTION_LOG.md documents the removal of both N-C03 and M-08. CE-003 section restored to baseline-equivalent content. IG.1D-R verdict: PASS. |
| **PSEE.0 impact** | Not applicable to PSEE.0 directly (this occurred in IG.1/40.4 scope). Forensic significance: the detection and correction of DRIFT-001 demonstrates that the determinism enforcement mechanism works. The contradiction was introduced, detected, corrected, and verified — the full governance loop was exercised. |

---

### CONTRA-07 — Reverse Engineering Mapping Table Iterations (3 Versions)

| Attribute | Value |
|---|---|
| **Contradiction ID** | CONTRA-07 |
| **Type** | FORMAT |
| **Conflicting constructs** | Three versions of the reverse engineering mapping table with unclear mutual relationship |
| **Observable instances** | `reverse_engineering_mapping_table.md` (original) |
| | `reverse_engineering_mapping_table_prepopulated.md` (pre-populated variant) |
| | `reverse_engineering_mapping_table_v2.md` (explicit v2) |
| **Nature of conflict** | Three files exist: the prepopulated variant suggests a template was populated into an instance, but both coexist with the original rather than replacing it. The v2 has an explicit version suffix but the prepopulated file does not, creating ambiguity about the sequence. |
| **Resolution path** | ABANDONED at corpus level — all three excluded from 40.2. RESOLVED at methodology level: PSEE.0 transformation_mapping.md is a single deterministic document with no versioning (immutable stream artifact, not an iterable template). |
| **PSEE.0 impact** | The three-version anti-pattern directly motivated the PSEE.0 principle of producing single immutable mapping artifacts rather than iterable tables. |

---

### Contradiction Summary

| ID | Type | Status | PSEE.0 Impact |
|---|---|---|---|
| CONTRA-01 | FORMAT | ABANDONED (both excluded) | None |
| CONTRA-02 | ORGANIZATIONAL | ABANDONED at 40.2 / RESOLVED at 40.3 | None at 40.2 |
| CONTRA-03 | ORGANIZATIONAL | RESOLVED — component track won | R-GRP-01 encodes resolution |
| CONTRA-04 | SCOPE | UNRESOLVED in corpus / same outcome (excluded) | None |
| CONTRA-05 | EPISTEMIC | RESOLVED — deterministic mode won | R-NRM-03 encodes resolution |
| CONTRA-06 | EPISTEMIC | RESOLVED via IG.1R correction | Governance loop verified |
| CONTRA-07 | FORMAT | ABANDONED at corpus / resolved at methodology | Single-artifact principle in PSEE.0 |

**Unresolved in corpus: 1 (CONTRA-04 — no practical impact)**
**Resolved by PSEE.0 canonical form: 3 (CONTRA-03, CONTRA-05, CONTRA-07)**

---

#### EVIDENCE LAYER

| Contradiction | Evidence source |
|---|---|
| CONTRA-01 (_md.md pairs) | phase_a_inventory.md — 5 duplicate file pairs enumerated in Section 2 |
| CONTRA-02 (execution graphs) | phase_a_inventory.md — 4 execution graph variants; docs/pios/40.3/ baseline has program_execution_graph.md |
| CONTRA-03 (capability vs component) | phase_a_inventory.md — capability track (6 files) + component track (3 files) in Section 2 |
| CONTRA-04 (cross-boundary file) | phase_a_inventory.md — stream_01_lessons_learned in both Section 2 and Section 4 with different dispositions |
| CONTRA-05 (epistemic mode) | phase_a_inventory.md — narrative vs deterministic file types; PSEE.0/rule_catalog_v0.md R-NRM-03 |
| CONTRA-06 (DRIFT-001) | IG.1D_DRIFT_CLASSIFICATION.md; IG.1R_CORRECTION_LOG.md |
| CONTRA-07 (mapping table x3) | phase_a_inventory.md — 3 mapping table files; PSEE.0/transformation_mapping.md |

---

#### LIMITATIONS & BOUNDARIES

- CONTRA-01 and CONTRA-07 are classified as FORMAT contradictions based on naming patterns. Without access to file content, whether the variants differ semantically or only in formatting cannot be determined.
- CONTRA-04 (cross-boundary placement) cannot be fully resolved without knowing the authoring context. The duplicate placement may reflect intentional cross-referencing rather than error.
- CONTRA-02 resolution at 40.3 level is observable (40.3/program_execution_graph.md exists in baseline) but the specific resolution path between the Phase A variants is not traceable from available evidence.

---

#### STATUS

| Check | Result |
|---|---|
| Contradictions identified | 7 (CONTRA-01 through CONTRA-07) |
| Resolution paths documented | 6 / 7 (CONTRA-04 abandoned / no impact) |
| PSEE.0 mutation prevented | CONFIRMED |

**CONTRADICTION MATRIX: COMPLETE — 7 contradictions identified, 6 with resolution paths**

# Structural Telemetry
run_id: run_06_orchestrated_ingestion
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG3-BOOTSTRAP
upstream_contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh
input: docs/pios/runs/run_06_orchestrated_ingestion/40.3/reconstruction/ (full corpus), docs/pios/runs/run_06_orchestrated_ingestion/40.3/traceability/structural_traceability_map.md
evidence_references_via: docs/pios/runs/run_06_orchestrated_ingestion/40.2/normalized_evidence_map.md, docs/pios/runs/run_06_orchestrated_ingestion/40.2/evidence_surface_inventory.md
schema: docs/pios/runs/run_06_orchestrated_ingestion/40.4/telemetry_schema.md

---

## Extraction Rule

Structural telemetry captures static measurements of composition, topology, and relationships. All values are derived directly from the 40.3 reconstruction corpus. No value is inferred or computed heuristically. Every metric is classified as `static` unless the value changes on a known structural event.

---

## Repository Composition Metrics

### ST-001 — Total Repository File Count

| Field | Value |
|---|---|
| Metric ID | ST-001 |
| Metric Name | Total Repository File Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-05a |
| Structural Element | Repository (INT-03 baseline) |
| Evidence Reference | evidence_surface_inventory.md Summary |
| Description | Total count of files in the repository at INT-03 baseline scan. Value: 106. |

---

### ST-002 — Documentation File Count

| Field | Value |
|---|---|
| Metric ID | ST-002 |
| Metric Name | Documentation File Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-05a |
| Structural Element | Repository (INT-03 baseline) — Documentation classification |
| Evidence Reference | evidence_surface_inventory.md Summary |
| Description | Count of files classified as Documentation at INT-03 baseline. Value: 94. |

---

### ST-003 — Code File Count

| Field | Value |
|---|---|
| Metric ID | ST-003 |
| Metric Name | Code File Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-05a |
| Structural Element | Repository (INT-03 baseline) — Code classification |
| Evidence Reference | evidence_surface_inventory.md Summary |
| Description | Count of files classified as Code at INT-03 baseline. Value: 1. |

---

### ST-004 — Configuration File Count

| Field | Value |
|---|---|
| Metric ID | ST-004 |
| Metric Name | Configuration File Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-05a |
| Structural Element | Repository (INT-03 baseline) — Configuration classification |
| Evidence Reference | evidence_surface_inventory.md Summary |
| Description | Count of files classified as Configuration at INT-03 baseline. Value: 3. |

---

## Repository Topology Metrics

### ST-005 — Repository Zone Count

| Field | Value |
|---|---|
| Metric ID | ST-005 |
| Metric Name | Repository Zone Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-05b, TSD-05c, TSD-05d, TSD-05e |
| Structural Element | repository_topology.md (Zones 1–4) |
| Evidence Reference | normalized_evidence_map.md §2, §9 |
| Description | Count of distinct functional zones in the repository topology. Value: 4. |

---

### ST-006 — Architectural Responsibility Zone Count

| Field | Value |
|---|---|
| Metric ID | ST-006 |
| Metric Name | Architectural Responsibility Zone Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-05b |
| Structural Element | architectural_responsibility_zones.md (ARZ-01 through ARZ-08) |
| Evidence Reference | normalized_evidence_map.md §2, §9; structural_traceability_map.md §Architectural Responsibility Zones |
| Description | Count of declared architectural responsibility zones. Value: 8. |

---

## PEG Node and Edge Metrics

### ST-007 — PEG Total Node Count

| Field | Value |
|---|---|
| Metric ID | ST-007 |
| Metric Name | PEG Total Node Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-01, TSD-02, TSD-04, TSD-06 |
| Structural Element | program_execution_graph.md — Node Registry |
| Evidence Reference | normalized_evidence_map.md §1, §2, §4, §9 |
| Description | Total count of registered nodes in the Program Execution Graph. Value: 22. Node types: 3 components, 10 modules, 4 external streams, 3 automation, 2 governance. |

---

### ST-008 — PEG Component Node Count

| Field | Value |
|---|---|
| Metric ID | ST-008 |
| Metric Name | PEG Component Node Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-01 |
| Structural Element | program_execution_graph.md — N-C01, N-C02, N-C03 |
| Evidence Reference | normalized_evidence_map.md §1.1, §1.2, §1.3 |
| Description | Count of component-type nodes in the PEG. Value: 3. |

---

### ST-009 — PEG Module Node Count

| Field | Value |
|---|---|
| Metric ID | ST-009 |
| Metric Name | PEG Module Node Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-02 |
| Structural Element | program_execution_graph.md — N-M01 through N-M10 |
| Evidence Reference | normalized_evidence_map.md §2.1–§2.10 |
| Description | Count of module-type nodes in the PEG. Value: 10. |

---

### ST-010 — PEG Total Edge Count

| Field | Value |
|---|---|
| Metric ID | ST-010 |
| Metric Name | PEG Total Edge Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-01, TSD-02, TSD-03, TSD-04, TSD-06 |
| Structural Element | program_execution_graph.md — Edge Registry |
| Evidence Reference | normalized_evidence_map.md §1, §2, §4, §8, §9 |
| Description | Total count of registered edges in the Program Execution Graph. Value: 28. Edge categories: 12 containment, 7 pipeline, 1 delivery, 3 model activation, 2 governance, 1 feedback, 2 automation. |

---

### ST-011 — PEG Containment Edge Count

| Field | Value |
|---|---|
| Metric ID | ST-011 |
| Metric Name | PEG Containment Edge Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-01, TSD-02 |
| Structural Element | program_execution_graph.md — E-01a, E-01b, E-01c1–E-01c10 |
| Evidence Reference | normalized_evidence_map.md §1.1, §1.2, §1.3 |
| Description | Count of containment-type edges in the PEG. Value: 12. |

---

### ST-012 — PEG Pipeline Edge Count

| Field | Value |
|---|---|
| Metric ID | ST-012 |
| Metric Name | PEG Pipeline Edge Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-03 |
| Structural Element | program_execution_graph.md — E-02a through E-02g |
| Evidence Reference | normalized_evidence_map.md §8 |
| Description | Count of mandatory sequential pipeline edges in the PEG. Value: 7. |

---

### ST-013 — PEG Model Activation Edge Count

| Field | Value |
|---|---|
| Metric ID | ST-013 |
| Metric Name | PEG Model Activation Edge Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-02f, TSD-02g |
| Structural Element | program_execution_graph.md — E-04a, E-04b, E-04c |
| Evidence Reference | normalized_evidence_map.md §2.6, §2.7 |
| Description | Count of model activation edges in the PEG (M-06 → Stream 70; M-07 → Stream 75.1; M-07 → Stream 75.2). Value: 3. |

---

### ST-014 — PEG Governance Edge Count

| Field | Value |
|---|---|
| Metric ID | ST-014 |
| Metric Name | PEG Governance Edge Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-06 |
| Structural Element | program_execution_graph.md — E-05a, E-05b |
| Evidence Reference | normalized_evidence_map.md §9 GC-01, GC-08 |
| Description | Count of governance-type edges in the PEG. Value: 2. |

---

### ST-015 — Non-PEG Governance Constraint Count

| Field | Value |
|---|---|
| Metric ID | ST-015 |
| Metric Name | Non-PEG Governance Constraint Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-06 |
| Structural Element | dependency_map.md §5 (GC-07→M-07; PiOS Execution Contract→C-02; CKR→34 constructs) |
| Evidence Reference | normalized_evidence_map.md §9 GC-07; normalized_evidence_map.md §1.1; normalized_evidence_map.md §3 |
| Description | Count of governance constraints not represented as PEG edges. Value: 3. |

---

## Pipeline Structure Metrics

### ST-016 — PiOS Pipeline Stage Count

| Field | Value |
|---|---|
| Metric ID | ST-016 |
| Metric Name | PiOS Pipeline Stage Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-03 |
| Structural Element | dependency_map.md §1 — M-03 through M-10 |
| Evidence Reference | normalized_evidence_map.md §8 |
| Description | Count of stages in the PiOS mandatory sequential pipeline. Value: 8. Stages: M-03 (Evidence Connectors) through M-10 (Feedback and CI). |

---

### ST-017 — Pipeline Execution Mode Count

| Field | Value |
|---|---|
| Metric ID | ST-017 |
| Metric Name | Pipeline Execution Mode Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-02i |
| Structural Element | capability_map.md CAP-08 — Snapshot Mode, Continuous Mode, Monitoring Mode |
| Evidence Reference | normalized_evidence_map.md §2.9 |
| Description | Count of distinct execution modes in which the PiOS pipeline can be operated. Value: 3. |

---

## Analytical Construct Metrics

### ST-018 — CKR Construct Count

| Field | Value |
|---|---|
| Metric ID | ST-018 |
| Metric Name | CKR Construct Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-06 |
| Structural Element | entity_catalog.md EC-04 — CKR-001 through CKR-034 |
| Evidence Reference | normalized_evidence_map.md §3 |
| Description | Total count of entries in the Canonical Knowledge Registry. Value: 34. |

---

### ST-019 — Architectural Layer Count

| Field | Value |
|---|---|
| Metric ID | ST-019 |
| Metric Name | Architectural Layer Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-07 |
| Structural Element | entity_catalog.md EC-07 — AL-01, AL-02, AL-03 |
| Evidence Reference | normalized_evidence_map.md §7 |
| Description | Count of named architectural layers in the Program Intelligence system. Value: 3. Layers: Observability (AL-01), Intelligence (AL-02), Executive Intelligence (AL-03). |

---

### ST-020 — Capability Domain Count

| Field | Value |
|---|---|
| Metric ID | ST-020 |
| Metric Name | Capability Domain Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-02 |
| Structural Element | capability_domain_map.md — Domain A, B, C, D |
| Evidence Reference | normalized_evidence_map.md §2.3–§2.10 |
| Description | Count of capability domains in the PiOS module structure. Value: 4. |

---

### ST-021 — Total Capability Count

| Field | Value |
|---|---|
| Metric ID | ST-021 |
| Metric Name | Total Capability Count |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-02 |
| Structural Element | capability_map.md — CAP-01 through CAP-10 |
| Evidence Reference | normalized_evidence_map.md §2.1–§2.10, §4.1, §6.1 |
| Description | Count of declared capabilities across all PiOS modules and automation entities. Value: 10. |

---

### ST-022 — Component Containment Depth

| Field | Value |
|---|---|
| Metric ID | ST-022 |
| Metric Name | Component Containment Depth |
| Dimension | structural |
| Temporal Classification | static |
| Unit | count (levels) |
| Surface | TSD-01, TSD-02 |
| Structural Element | component_inventory.md — C-01 (Krayu) → C-02 (PiOS) → M-01–M-10 |
| Evidence Reference | normalized_evidence_map.md §1.1, §1.3 |
| Description | Maximum depth of the component containment hierarchy from top-level container to leaf module. Value: 3 levels (Krayu → PiOS → Module). |

---

## Structural Telemetry Summary

| Metric ID | Name | Temporal Classification | Value |
|---|---|---|---|
| ST-001 | Total Repository File Count | static | 106 |
| ST-002 | Documentation File Count | static | 94 |
| ST-003 | Code File Count | static | 1 |
| ST-004 | Configuration File Count | static | 3 |
| ST-005 | Repository Zone Count | static | 4 |
| ST-006 | Architectural Responsibility Zone Count | static | 8 |
| ST-007 | PEG Total Node Count | static | 22 |
| ST-008 | PEG Component Node Count | static | 3 |
| ST-009 | PEG Module Node Count | static | 10 |
| ST-010 | PEG Total Edge Count | static | 28 |
| ST-011 | PEG Containment Edge Count | static | 12 |
| ST-012 | PEG Pipeline Edge Count | static | 7 |
| ST-013 | PEG Model Activation Edge Count | static | 3 |
| ST-014 | PEG Governance Edge Count | static | 2 |
| ST-015 | Non-PEG Governance Constraint Count | static | 3 |
| ST-016 | PiOS Pipeline Stage Count | static | 8 |
| ST-017 | Pipeline Execution Mode Count | static | 3 |
| ST-018 | CKR Construct Count | static | 34 |
| ST-019 | Architectural Layer Count | static | 3 |
| ST-020 | Capability Domain Count | static | 4 |
| ST-021 | Total Capability Count | static | 10 |
| ST-022 | Component Containment Depth | static | 3 |

**Total structural metrics: 22**
**All metrics temporal classification: static**
**All metrics evidence-linked: yes**
**All metrics structurally mapped: yes**

# Telemetry Surface Definition
run_id: run_06_orchestrated_ingestion
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG3-BOOTSTRAP
upstream_contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh
input: docs/pios/runs/run_06_orchestrated_ingestion/40.3/reconstruction/ (full corpus), docs/pios/runs/run_06_orchestrated_ingestion/40.3/traceability/structural_traceability_map.md
evidence_references_via: docs/pios/runs/run_06_orchestrated_ingestion/40.2/normalized_evidence_map.md, docs/pios/runs/run_06_orchestrated_ingestion/40.2/evidence_surface_inventory.md

---

## Definition Rule

A telemetry surface is a structural entity from the 40.3 reconstruction corpus from which observable properties can be measured. Surfaces are declared only for entities with explicit evidence coverage in 40.2. Every surface entry carries source traceability.

Telemetry is produced across three dimensions only: Structural, Activity, Delivery.
No surface emits signals, scores, diagnoses, or interpretive output.

---

## TSD-01 — Component Surface

| Surface ID | Entity | Entity ID | PEG Node | Evidence Source |
|---|---|---|---|---|
| TSD-01a | Krayu | C-01 | N-C01 | normalized_evidence_map.md §1.3 |
| TSD-01b | PiOS | C-02 | N-C02 | normalized_evidence_map.md §1.1 |
| TSD-01c | Signäl Platform | C-03 | N-C03 | normalized_evidence_map.md §1.2 |

**Observable telemetry dimensions:** Structural, Delivery
**Observable properties:** containment relationships, component count, delivery edges to/from component

---

## TSD-02 — Module Surface (PiOS Runtime Stack)

| Surface ID | Entity | Entity ID | PEG Node | Pipeline Stage | Evidence Source |
|---|---|---|---|---|---|
| TSD-02a | PiOS Runtime Layer | M-01 | N-M01 | — | normalized_evidence_map.md §2.1 |
| TSD-02b | PiOS Runtime Architecture | M-02 | N-M02 | — | normalized_evidence_map.md §2.2 |
| TSD-02c | PiOS Evidence Connectors Layer | M-03 | N-M03 | Stage 1 | normalized_evidence_map.md §2.3 |
| TSD-02d | PiOS Reverse Engineering Engine | M-04 | N-M04 | Stage 2 | normalized_evidence_map.md §2.4 |
| TSD-02e | PiOS Telemetry Extraction Layer | M-05 | N-M05 | Stage 3 | normalized_evidence_map.md §2.5 |
| TSD-02f | PiOS Signal Computation Engine | M-06 | N-M06 | Stage 4 | normalized_evidence_map.md §2.6 |
| TSD-02g | PiOS Condition and Diagnosis Activation Layer | M-07 | N-M07 | Stage 5 | normalized_evidence_map.md §2.7 |
| TSD-02h | PiOS Intelligence Synthesis Layer | M-08 | N-M08 | Stage 6 | normalized_evidence_map.md §2.8 |
| TSD-02i | PiOS Agentic Orchestration Layer | M-09 | N-M09 | Stage 7 | normalized_evidence_map.md §2.9 |
| TSD-02j | PiOS Feedback and Continuous Improvement Layer | M-10 | N-M10 | Stage 8 | normalized_evidence_map.md §2.10 |

**Observable telemetry dimensions:** Structural, Activity, Delivery
**Observable properties:** pipeline stage position, sequential dependency edges, module-to-model dependencies, output artifact delivery, execution mode

---

## TSD-03 — Pipeline Surface

| Surface ID | Entity | Evidence Source |
|---|---|---|
| TSD-03a | PiOS Pipeline (M-03 through M-10, mandatory sequential) | normalized_evidence_map.md §8 |

**Observable telemetry dimensions:** Structural, Activity, Delivery
**Observable properties:** stage count, edge count, execution mode (Snapshot / Continuous / Monitoring), pipeline run events, per-stage artifact delivery

Source files: pios_pipeline_specification.md, pios_execution_contract.md
(referenced via normalized_evidence_map.md §8)

---

## TSD-04 — Automation Surface

| Surface ID | Entity | Entity ID | PEG Node | Evidence Source |
|---|---|---|---|---|
| TSD-04a | update-handbook-indexes.yml | CF-03 | N-CF03 | normalized_evidence_map.md §4.1 |
| TSD-04b | generate-stream-indexes.sh | SC-01 | N-SC01 | normalized_evidence_map.md §6.1 |
| TSD-04c | docs/handbook/ (output target) | — | N-HB01 | normalized_evidence_map.md §6.1 |

**Observable telemetry dimensions:** Activity, Delivery
**Observable properties:** trigger events (push to main), execution events, file delivery count to docs/handbook/, automation actor identity

Source files: update-handbook-indexes.yml, generate-stream-indexes.sh
(referenced via normalized_evidence_map.md §4.1, §6.1)

---

## TSD-05 — Repository Structure Surface

| Surface ID | Entity | Evidence Source |
|---|---|---|
| TSD-05a | Repository file tree (106 files, INT-03 baseline) | evidence_surface_inventory.md Summary |
| TSD-05b | Zone 1 — docs/ (Discipline and Framework) | repository_topology.md Zone 1 |
| TSD-05c | Zone 2 — streams/ (Runtime Working Files) | repository_topology.md Zone 2 |
| TSD-05d | Zone 3 — Automation (scripts/ + .github/) | repository_topology.md Zone 3 |
| TSD-05e | Zone 4 — PiOS Execution Outputs (docs/pios/) | repository_topology.md Zone 4 |

**Observable telemetry dimensions:** Structural
**Observable properties:** total file count, file counts by classification, zone count, inter-zone dependency relationships

Source: evidence_surface_inventory.md, repository_topology.md, repository_map.md

---

## TSD-06 — Governance Surface

| Surface ID | Entity | Entity ID | PEG Node | Evidence Source |
|---|---|---|---|---|
| TSD-06a | Governance Master Capsule | GC-01 | N-GC01 | normalized_evidence_map.md §9 GC-01 |
| TSD-06b | PERM | GC-08 | N-GC08 | normalized_evidence_map.md §9 GC-08 |

**Observable telemetry dimensions:** Structural
**Observable properties:** governance edge count (PEG-mapped), non-PEG governance constraint count, CKR construct count

Source: entity_catalog.md EC-08, dependency_map.md §5

---

## TSD-07 — Architectural Layer Surface

| Surface ID | Entity | Evidence Source |
|---|---|---|
| TSD-07a | Observability Layer (AL-01) | normalized_evidence_map.md §7 |
| TSD-07b | Intelligence Layer (AL-02) | normalized_evidence_map.md §7 |
| TSD-07c | Executive Intelligence Layer (AL-03) | normalized_evidence_map.md §7 |

**Observable telemetry dimensions:** Structural
**Observable properties:** layer count, capability-to-layer assignment, domain-to-layer alignment

Source file: program_intelligence_three_layer_model.md
(referenced via normalized_evidence_map.md §7)

---

## Surface Summary

| Surface ID | Name | Dimensions Active | PEG Coverage |
|---|---|---|---|
| TSD-01 | Component Surface | Structural, Delivery | N-C01, N-C02, N-C03 |
| TSD-02 | Module Surface | Structural, Activity, Delivery | N-M01–N-M10 |
| TSD-03 | Pipeline Surface | Structural, Activity, Delivery | Pipeline edges E-02a–E-02g |
| TSD-04 | Automation Surface | Activity, Delivery | N-CF03, N-SC01, N-HB01 |
| TSD-05 | Repository Structure Surface | Structural | — (repository_topology.md) |
| TSD-06 | Governance Surface | Structural | N-GC01, N-GC08 |
| TSD-07 | Architectural Layer Surface | Structural | — (capability_domain_map.md) |

**Total surfaces defined: 7**
**Total surface instances: 22 (matching PEG node count where applicable)**

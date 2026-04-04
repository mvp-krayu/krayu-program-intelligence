# Entity Catalog
run_id: run_04_adapter_simulation
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG2-ADAPTER
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.2 adapter simulation run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; GitHub adapter ENABLED (mvp-krayu/krayu-program-intelligence); Jira adapter CAPSULE
input: docs/pios/runs/run_04_adapter_simulation/40.2/normalized_evidence_map.md, docs/pios/runs/run_04_adapter_simulation/40.2/evidence_surface_inventory.md
reconstruction_method: PERM — deterministic entity extraction from normalized evidence

---

## Extraction Rules

- All entities derived strictly from 40.2 normalized_evidence_map.md and evidence_surface_inventory.md.
- No repository re-scanning.
- No inference beyond explicitly observable structure.
- Every entity carries source traceability to 40.2 inputs.

---

## EC-01 — Components

| ID | Name | Classification | Evidence Source |
|---|---|---|---|
| C-01 | Krayu | component | normalized_evidence_map.md §1.3 |
| C-02 | PiOS | component | normalized_evidence_map.md §1.1 |
| C-03 | Signäl Platform | component | normalized_evidence_map.md §1.2 |

---

## EC-02 — Modules (PiOS Runtime Stack)

| ID | Name | Stream ID | Evidence Source |
|---|---|---|---|
| M-01 | PiOS Runtime Layer | 40.0 | normalized_evidence_map.md §2.1 |
| M-02 | PiOS Runtime Architecture (Conceptual Model) | 40.1 | normalized_evidence_map.md §2.2 |
| M-03 | PiOS Evidence Connectors Layer | 40.2 | normalized_evidence_map.md §2.3 |
| M-04 | PiOS Reverse Engineering Engine | 40.3 | normalized_evidence_map.md §2.4 |
| M-05 | PiOS Telemetry Extraction Layer | 40.4 | normalized_evidence_map.md §2.5 |
| M-06 | PiOS Signal Computation Engine | 40.5 | normalized_evidence_map.md §2.6 |
| M-07 | PiOS Condition and Diagnosis Activation Layer | 40.6 | normalized_evidence_map.md §2.7 |
| M-08 | PiOS Intelligence Synthesis Layer | 40.7 | normalized_evidence_map.md §2.8 |
| M-09 | PiOS Agentic Orchestration Layer | 40.8 | normalized_evidence_map.md §2.9 |
| M-10 | PiOS Feedback and Continuous Improvement Layer | 40.9 | normalized_evidence_map.md §2.10 |

---

## EC-03 — Referenced Discipline Streams

| ID | Stream | Name | Evidence Source |
|---|---|---|---|
| DS-01 | 10 | Program Intelligence Discipline | normalized_evidence_map.md §2.11 |
| DS-02 | 20 | Program Intelligence Framework | normalized_evidence_map.md §2.11 |
| DS-03 | 30 | Program Intelligence Commercialization | normalized_evidence_map.md §2.11 |
| DS-04 | 30.1 | Signäl Platform & Product Architecture | normalized_evidence_map.md §2.11 |
| DS-05 | 40 | Signäl Execution Signal Infrastructure | normalized_evidence_map.md §2.11 |
| DS-06 | 50 | Program Intelligence Demonstrations | normalized_evidence_map.md §2.11 |
| DS-07 | 60 | Program Intelligence Case Studies | normalized_evidence_map.md §2.11 |
| DS-08 | 70 | Execution Signal Science | normalized_evidence_map.md §2.11 |
| DS-09 | 75 | Program Diagnosis and Intelligence Models | normalized_evidence_map.md §2.11 |
| DS-10 | 75.1 | Program Condition Model | normalized_evidence_map.md §2.11 |
| DS-11 | 75.2 | Program Diagnosis Model | normalized_evidence_map.md §2.11 |
| DS-12 | 77 | Discipline Feedback Loop Registry | normalized_evidence_map.md §2.11 |
| DS-13 | 80 | Execution Stability Index (ESI) | normalized_evidence_map.md §2.11 |
| DS-14 | 90 | Program Intelligence Working State Control | normalized_evidence_map.md §2.11 |

---

## EC-04 — Analytical Constructs (CKR)

| ID | CKR ID | Name | Class | Evidence Source |
|---|---|---|---|---|
| AC-01 | CKR-001 | Program Intelligence | Discipline Concept | normalized_evidence_map.md §3 |
| AC-02 | CKR-002 | Program Execution System | Discipline Concept | normalized_evidence_map.md §3 |
| AC-03 | CKR-003 | Execution Evidence | Discipline Concept | normalized_evidence_map.md §3 |
| AC-04 | CKR-004 | Execution Telemetry | Discipline Concept | normalized_evidence_map.md §3 |
| AC-05 | CKR-005 | Execution Signals | Analytical Construct | normalized_evidence_map.md §3 |
| AC-06 | CKR-006 | Coordination Pressure | Analytical Construct | normalized_evidence_map.md §3 |
| AC-07 | CKR-007 | Dependency Load | Analytical Construct | normalized_evidence_map.md §3 |
| AC-08 | CKR-008 | Change Concentration | Analytical Construct | normalized_evidence_map.md §3 |
| AC-09 | CKR-009 | Structural Volatility | Analytical Construct | normalized_evidence_map.md §3 |
| AC-10 | CKR-010 | Execution Throughput | Analytical Construct | normalized_evidence_map.md §3 |
| AC-11 | CKR-011 | Execution Stability | Analytical Construct | normalized_evidence_map.md §3 |
| AC-12 | CKR-012 | Program Conditions | Analytical Construct | normalized_evidence_map.md §3 |
| AC-13 | CKR-013 | Program Diagnosis | Analytical Construct | normalized_evidence_map.md §3 |
| AC-14 | CKR-014 | Execution Stability Index (ESI) | Analytical Construct | normalized_evidence_map.md §3 |
| AC-15 | CKR-015 | Risk Acceleration Gradient (RAG) | Analytical Construct | normalized_evidence_map.md §3 |
| AC-16 | CKR-016 | Risk Momentum Gradient | Analytical Construct | normalized_evidence_map.md §3 |
| AC-17 | CKR-017 | Program Structure | Discipline Concept | normalized_evidence_map.md §3 |
| AC-18 | CKR-018 | Program Structure Reconstruction | Discipline Concept | normalized_evidence_map.md §3 |
| AC-19 | CKR-019 | Delivery Graph | Analytical Construct | normalized_evidence_map.md §3 |
| AC-20 | CKR-020 | Dependency Topology | Analytical Construct | normalized_evidence_map.md §3 |
| AC-21 | CKR-021 | Signäl Platform | Architecture Construct | normalized_evidence_map.md §3 |
| AC-22 | CKR-022 | PiOS Runtime | Architecture Construct | normalized_evidence_map.md §3 |
| AC-23 | CKR-023 | Evidence Connectors | Architecture Construct | normalized_evidence_map.md §3 |
| AC-24 | CKR-024 | Reverse Engineering Engine | Architecture Construct | normalized_evidence_map.md §3 |
| AC-25 | CKR-025 | Telemetry Extraction Layer | Architecture Construct | normalized_evidence_map.md §3 |
| AC-26 | CKR-026 | Signal Computation Engine | Architecture Construct | normalized_evidence_map.md §3 |
| AC-27 | CKR-027 | Condition and Diagnosis Activation Layer | Architecture Construct | normalized_evidence_map.md §3 |
| AC-28 | CKR-028 | Intelligence Synthesis Layer | Architecture Construct | normalized_evidence_map.md §3 |
| AC-29 | CKR-029 | Agentic Orchestration Layer | Architecture Construct | normalized_evidence_map.md §3 |
| AC-30 | CKR-030 | Feedback and Continuous Improvement Layer | Architecture Construct | normalized_evidence_map.md §3 |
| AC-31 | CKR-031 | Program Intelligence Working State | Governance Construct | normalized_evidence_map.md §3 |
| AC-32 | CKR-032 | Discipline Feedback Loop | Governance Construct | normalized_evidence_map.md §3 |
| AC-33 | CKR-033 | Execution Signal Registry | Governance Construct | normalized_evidence_map.md §3 |
| AC-34 | CKR-034 | Canonical Knowledge Registry | Governance Construct | normalized_evidence_map.md §3 |

---

## EC-05 — Configurations

| ID | Name | Evidence Source |
|---|---|---|
| CF-01 | .gitignore | evidence_surface_inventory.md §Configuration |
| CF-02 | .env.claude | evidence_surface_inventory.md §Configuration |
| CF-03 | update-handbook-indexes.yml | evidence_surface_inventory.md §Configuration; normalized_evidence_map.md §4.1 |

---

## EC-06 — Scripts

| ID | Name | Evidence Source |
|---|---|---|
| SC-01 | generate-stream-indexes.sh | evidence_surface_inventory.md §Code; normalized_evidence_map.md §6.1 |

---

## EC-07 — Architectural Layers

| ID | Name | Evidence Source |
|---|---|---|
| AL-01 | Observability Layer | normalized_evidence_map.md §7 |
| AL-02 | Intelligence Layer | normalized_evidence_map.md §7 |
| AL-03 | Executive Intelligence Layer | normalized_evidence_map.md §7 |

---

## EC-08 — Governance Constructs

| ID | Name | Evidence Source |
|---|---|---|
| GC-01 | Governance Master Capsule | normalized_evidence_map.md §9 |
| GC-02 | Governance Operating Model | normalized_evidence_map.md §9 |
| GC-03 | Canonical Knowledge Registry | normalized_evidence_map.md §9 |
| GC-04 | Krayu Governance Capsule | normalized_evidence_map.md §9 |
| GC-05 | Stream Architecture (00–60) | normalized_evidence_map.md §9 |
| GC-06 | Evidence-First Principle | normalized_evidence_map.md §9 |
| GC-07 | State–Diagnosis Separation Principle | normalized_evidence_map.md §9 |
| GC-08 | PERM (Program Execution Reconstruction Model) | normalized_evidence_map.md §9 |
| GC-09 | Program Execution Graph (PEG) | normalized_evidence_map.md §9 |

---

## EC-09 — Research and Case Study Artifacts

| ID | Name | Evidence Source |
|---|---|---|
| RS-01 | RSR-06 — Execution Stability Index | normalized_evidence_map.md §11 |
| CS-01 | BlueEdge Program Case Study | normalized_evidence_map.md §10 |

---

## Summary

| Entity Class | Count |
|---|---|
| Components | 3 |
| Modules (PiOS runtime) | 10 |
| Discipline streams (referenced) | 14 |
| Analytical constructs (CKR) | 34 |
| Configurations | 3 |
| Scripts | 1 |
| Architectural layers | 3 |
| Governance constructs | 9 |
| Research artifacts | 1 |
| Case studies | 1 |
| **Total entities** | **79** |

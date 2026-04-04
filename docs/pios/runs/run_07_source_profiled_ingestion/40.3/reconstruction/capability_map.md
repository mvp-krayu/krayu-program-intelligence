# Capability Map
run_id: run_07_source_profiled_ingestion
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh
input: docs/pios/runs/run_07_source_profiled_ingestion/40.2/normalized_evidence_map.md

---

## Extraction Rule

Capabilities are extracted only from explicitly observable statements in the 40.2 normalized evidence. No capability is inferred. Each entry carries a direct source reference.

---

## CAP-01 — Evidence Acquisition

| Field | Value |
|---|---|
| Name | Evidence Acquisition |
| Owner | Stream 40.2 — PiOS Evidence Connectors Layer |
| Module | M-03 |
| CKR reference | CKR-023 |
| Evidence source | normalized_evidence_map.md §2.3 |

**Observable sub-capabilities:**
- Identify available evidence sources
- Establish governed connections to evidence sources
- Retrieve evidence required by the pipeline
- Preserve evidence provenance and timestamps
- Normalize evidence into ingestion-ready formats for downstream modules

---

## CAP-02 — Program Reconstruction

| Field | Value |
|---|---|
| Name | Program Reconstruction |
| Owner | Stream 40.3 — PiOS Reverse Engineering Engine |
| Module | M-04 |
| CKR references | CKR-024, CKR-018 (Program Structure Reconstruction), CKR-019 (Delivery Graph), CKR-020 (Dependency Topology) |
| Evidence source | normalized_evidence_map.md §2.4, §9 GC-08 |

**Observable sub-capabilities:**
- Entity extraction (repositories, modules, services, components, capabilities)
- Structural grouping (systems, domains, layers)
- Dependency inference (where evidence-supported)
- Interface identification (APIs, integration boundaries, contracts)
- Execution context anchoring (activity density, change frequency, contributor distribution, delivery patterns)
- Program Execution Graph (PEG) construction

**Governing model:** PERM (Program Execution Reconstruction Model)

---

## CAP-03 — Telemetry Generation

| Field | Value |
|---|---|
| Name | Telemetry Generation |
| Owner | Stream 40.4 — PiOS Telemetry Extraction Layer |
| Module | M-05 |
| CKR reference | CKR-025, CKR-004 (Execution Telemetry) |
| Evidence source | normalized_evidence_map.md §2.5 |

**Observable telemetry dimensions (explicitly named):**
- Structural Telemetry — dependency density, coupling distribution, system size, architectural layering
- Activity Telemetry — change concentration, activity distribution, hotspot identification
- Delivery Telemetry — delivery cadence, change propagation patterns, release distribution

---

## CAP-04 — Signal Computation

| Field | Value |
|---|---|
| Name | Signal Computation |
| Owner | Stream 40.5 — PiOS Signal Computation Engine |
| Module | M-06 |
| CKR reference | CKR-026, CKR-005 (Execution Signals) |
| Evidence source | normalized_evidence_map.md §2.6 |

**Observable signals computed:**
- Execution Stability Index (ESI) — CKR-014
- Risk Acceleration Gradient (RAG) — CKR-015

**Signal categories (explicitly referenced):**
- Coordination Pressure (CKR-006)
- Dependency Load (CKR-007)
- Change Concentration (CKR-008)
- Structural Volatility (CKR-009)
- Execution Throughput (CKR-010)
- Execution Stability (CKR-011)

---

## CAP-05 — Condition Activation

| Field | Value |
|---|---|
| Name | Condition Activation |
| Owner | Stream 40.6 — PiOS Condition and Diagnosis Activation Layer |
| Module | M-07 |
| CKR reference | CKR-027, CKR-012 (Program Conditions) |
| Evidence source | normalized_evidence_map.md §2.7 |

**Observable condition types:**
- Stability level
- Concentration imbalance
- Dependency stress
- Coordination stress
- Structural volatility
- Change concentration
- Execution stability

**Governing model:** Stream 75.1 — Program Condition Model

---

## CAP-06 — Diagnosis Activation

| Field | Value |
|---|---|
| Name | Diagnosis Activation |
| Owner | Stream 40.6 — PiOS Condition and Diagnosis Activation Layer |
| Module | M-07 |
| CKR reference | CKR-027, CKR-013 (Program Diagnosis) |
| Evidence source | normalized_evidence_map.md §2.7 |

**Observable scope:**
- Interprets condition combinations to identify systemic execution dynamics
- Preserves State–Diagnosis Separation Principle (GC-07)

**Governing model:** Stream 75.2 — Program Diagnosis Model

---

## CAP-07 — Intelligence Synthesis

| Field | Value |
|---|---|
| Name | Intelligence Synthesis |
| Owner | Stream 40.7 — PiOS Intelligence Synthesis Layer |
| Module | M-08 |
| CKR reference | CKR-028 |
| Evidence source | normalized_evidence_map.md §2.8 |

**Observable outputs:**
- program_intelligence_summary.md
- evidence_linked_intelligence_packet.md
- executive_interpretation_brief.md
- intelligence_lineage_map.md

---

## CAP-08 — Agentic Orchestration

| Field | Value |
|---|---|
| Name | Agentic Orchestration |
| Owner | Stream 40.8 — PiOS Agentic Orchestration Layer |
| Module | M-09 |
| CKR reference | CKR-029 |
| Evidence source | normalized_evidence_map.md §2.9 |

**Observable sub-capabilities:**
- Pipeline scheduling and triggering
- Validation gate enforcement
- Runtime health monitoring
- Anomaly detection

**Execution modes:** Snapshot Mode, Continuous Mode, Monitoring Mode

---

## CAP-09 — Feedback and Continuous Improvement

| Field | Value |
|---|---|
| Name | Feedback and Continuous Improvement |
| Owner | Stream 40.9 — PiOS Feedback and Continuous Improvement Layer |
| Module | M-10 |
| CKR reference | CKR-030, CKR-032 (Discipline Feedback Loop) |
| Evidence source | normalized_evidence_map.md §2.10 |

**Observable routing:** Feeds improvements to Stream 77 — Discipline Feedback Loop Registry

---

## CAP-10 — Handbook Compilation

| Field | Value |
|---|---|
| Name | Handbook Compilation |
| Owner | scripts/generate-stream-indexes.sh + .github/workflows/update-handbook-indexes.yml |
| Module | SC-01, CF-03 |
| Evidence source | normalized_evidence_map.md §4.1, §6.1 |

**Observable sub-capabilities:**
- Generate per-stream markdown index files
- Auto-commit and push on `main` branch push

---

## Capability Summary

| ID | Name | Module | CKR |
|---|---|---|---|
| CAP-01 | Evidence Acquisition | M-03 | CKR-023 |
| CAP-02 | Program Reconstruction | M-04 | CKR-024 |
| CAP-03 | Telemetry Generation | M-05 | CKR-025 |
| CAP-04 | Signal Computation | M-06 | CKR-026 |
| CAP-05 | Condition Activation | M-07 | CKR-027 |
| CAP-06 | Diagnosis Activation | M-07 | CKR-027 |
| CAP-07 | Intelligence Synthesis | M-08 | CKR-028 |
| CAP-08 | Agentic Orchestration | M-09 | CKR-029 |
| CAP-09 | Feedback and CI | M-10 | CKR-030 |
| CAP-10 | Handbook Compilation | SC-01, CF-03 | — |

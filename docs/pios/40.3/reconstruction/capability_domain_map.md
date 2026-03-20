# Capability Domain Map

**Stream:** 40.3 — PiOS Reverse Engineering Engine
**Input:** docs/pios/40.3/reconstruction/capability_map.md, docs/pios/40.2/normalized_evidence_map.md
**Date:** 2026-03-18

---

## Reconstruction Rule

Capability domains are groupings of related capabilities observable from evidence. Domains are not named in the source evidence; they are structural groupings derived from observable ownership and module alignment. No domain name implies additional meaning beyond what is stated.

---

## Domain Structure

Capabilities are grouped into four observable domains based on their module ownership and functional alignment within the PiOS pipeline.

---

## Domain A — Evidence and Reconstruction

**Observable scope:** Acquiring, normalizing, and structuring execution evidence into a reconstructed program model.

| Capability ID | Name | Module | CKR |
|---|---|---|---|
| CAP-01 | Evidence Acquisition | M-03 | CKR-023 |
| CAP-02 | Program Reconstruction | M-04 | CKR-024 |

**Domain authority:** Stream 40.2 (CAP-01), Stream 40.3 (CAP-02)

**Observable flow:** Evidence Acquisition feeds normalized evidence to Program Reconstruction. Program Reconstruction produces the entity catalog, repository map, dependency map, interface map, and Program Execution Graph (PEG).

**Evidence source:** normalized_evidence_map.md §2.3, §2.4; capability_map.md CAP-01, CAP-02

---

## Domain B — Measurement and Computation

**Observable scope:** Extracting measurable telemetry from the reconstruction corpus and computing analytical signals.

| Capability ID | Name | Module | CKR |
|---|---|---|---|
| CAP-03 | Telemetry Generation | M-05 | CKR-025 |
| CAP-04 | Signal Computation | M-06 | CKR-026 |

**Domain authority:** Stream 40.4 (CAP-03), Stream 40.5 (CAP-04)

**Observable flow:** Telemetry Generation accepts the reconstruction corpus and PEG. Signal Computation applies signal models from Stream 70 to produce ESI (CKR-014) and RAG (CKR-015).

**Evidence source:** normalized_evidence_map.md §2.5, §2.6; capability_map.md CAP-03, CAP-04

---

## Domain C — Interpretation and Synthesis

**Observable scope:** Activating analytical models to produce program conditions, diagnoses, and synthesized intelligence.

| Capability ID | Name | Module | CKR |
|---|---|---|---|
| CAP-05 | Condition Activation | M-07 | CKR-027 |
| CAP-06 | Diagnosis Activation | M-07 | CKR-027 |
| CAP-07 | Intelligence Synthesis | M-08 | CKR-028 |

**Domain authority:** Stream 40.6 (CAP-05, CAP-06), Stream 40.7 (CAP-07)

**Observable flow:** Condition Activation activates models from Stream 75.1. Diagnosis Activation activates models from Stream 75.2. Intelligence Synthesis assembles outputs into structured intelligence objects delivered to Signäl Platform.

**Governing constraint:** State–Diagnosis Separation Principle (GC-07) applies to CAP-05 and CAP-06.

**Evidence source:** normalized_evidence_map.md §2.7, §2.8; capability_map.md CAP-05, CAP-06, CAP-07

---

## Domain D — Operations and Infrastructure

**Observable scope:** Runtime orchestration, handbook compilation automation, and continuous improvement routing.

| Capability ID | Name | Module | CKR |
|---|---|---|---|
| CAP-08 | Agentic Orchestration | M-09 | CKR-029 |
| CAP-09 | Feedback and Continuous Improvement | M-10 | CKR-030 |
| CAP-10 | Handbook Compilation | SC-01, CF-03 | — |

**Domain authority:** Stream 40.8 (CAP-08), Stream 40.9 (CAP-09), scripts/CI layer (CAP-10)

**Observable flow:** Agentic Orchestration coordinates all pipeline modules across execution modes. Feedback and CI routes improvements to Stream 77. Handbook Compilation auto-generates per-stream markdown indexes on push to main.

**Evidence source:** normalized_evidence_map.md §2.9, §2.10, §4.1, §6.1; capability_map.md CAP-08, CAP-09, CAP-10

---

## Domain Summary

| Domain | Capabilities | Modules |
|---|---|---|
| A — Evidence and Reconstruction | CAP-01, CAP-02 | M-03, M-04 |
| B — Measurement and Computation | CAP-03, CAP-04 | M-05, M-06 |
| C — Interpretation and Synthesis | CAP-05, CAP-06, CAP-07 | M-07, M-08 |
| D — Operations and Infrastructure | CAP-08, CAP-09, CAP-10 | M-09, M-10, SC-01/CF-03 |

---

## Capability-to-Three-Layer-Model Alignment

| Domain | Three-Layer Model Layer | Evidence source |
|---|---|---|
| A — Evidence and Reconstruction | Observability Layer (AL-01) | normalized_evidence_map.md §7 |
| B — Measurement and Computation | Observability Layer (AL-01) | normalized_evidence_map.md §7 |
| C — Interpretation and Synthesis | Intelligence Layer (AL-02), Executive Intelligence Layer (AL-03) | normalized_evidence_map.md §7 |
| D — Operations and Infrastructure | Cross-layer (runtime infrastructure) | normalized_evidence_map.md §2.9, §2.10 |

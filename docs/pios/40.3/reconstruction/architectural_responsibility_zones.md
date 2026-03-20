# Architectural Responsibility Zones

**Stream:** 40.3 — PiOS Reverse Engineering Engine
**Input:** docs/pios/40.2/normalized_evidence_map.md, docs/pios/40.3/reconstruction/repository_topology.md
**Date:** 2026-03-18

---

## Reconstruction Rule

Responsibility zones define what each structural zone of the repository is responsible for, as stated or directly observable in the 40.2 normalized evidence. Zone boundaries and responsibilities are not inferred.

---

## Zone Overview

The repository is organized into four structural zones (from repository_topology.md). Each zone carries a distinct and observable responsibility profile.

---

## ARZ-01 — Governance and Discipline Authority Zone

**Repository paths:** `docs/governance/`, `docs/program-intelligence-discipline/`

**Zone responsibility (observable):**
- Defines governance authority over all streams and components (GC-01 — Governance Master Capsule)
- Maintains the Canonical Knowledge Registry — single source of truth for all 34 CKR constructs
- Defines stream architecture (streams 00–60)
- Declares the Evidence-First Principle (GC-06)
- Declares the State–Diagnosis Separation Principle (GC-07 — observable in stream files)
- Declares PERM as governing model for reconstruction (GC-08)
- Defines the Program Execution Graph (GC-09)

**Authority scope:** Governance artifacts in this zone govern all other zones. No stream artifact overrides governance authority.

**Stream ownership:** Stream 00 (Governance), Stream 10 (Discipline)

**Evidence source:** normalized_evidence_map.md §9; repository_topology.md Zone 1

---

## ARZ-02 — Framework and Specification Zone

**Repository paths:** `docs/program-intelligence-framework/`, `docs/program-intelligence-framework/pios/`, `docs/program-intelligence-framework/drafts/`

**Zone responsibility (observable):**
- Defines PiOS runtime architecture specification (pios_runtime_architecture.md)
- Defines PiOS execution contract (pios_execution_contract.md)
- Defines PiOS pipeline specification — canonical pipeline order (pios_pipeline_specification.md)
- Defines the Three-Layer Model: Observability Layer (AL-01), Intelligence Layer (AL-02), Executive Intelligence Layer (AL-03)
- Contains draft artifacts (9 files) under pre-formalization status

**Authority scope:** Framework specifications are normative for PiOS module execution. PiOS stream files operationalize what this zone specifies.

**Stream ownership:** Stream 20 (Framework)

**Evidence source:** normalized_evidence_map.md §7, §8; repository_topology.md Zone 1

---

## ARZ-03 — Experience and Commercialization Zone

**Repository paths:** `docs/program-intelligence-commercialization/`, `docs/web-governance/`

**Zone responsibility (observable):**
- Defines Signäl Platform product architecture and commercialization (Stream 30.1 authority)
- Contains web governance artifacts
- Responsible for rendering intelligence outputs from M-08 as user-facing and executive-facing experiences

**Authority scope:** Explicitly outside PiOS scope. This zone receives outputs from PiOS but does not own any PiOS runtime module.

**Stream ownership:** Stream 30 (Commercialization), Stream 30.1 (Signäl Platform)

**Evidence source:** normalized_evidence_map.md §1.2; repository_topology.md Zone 1

---

## ARZ-04 — Demonstrations and Case Studies Zone

**Repository paths:** `docs/program-intelligence-demonstrations/`, `docs/program-intelligence-case-studies/`

**Zone responsibility (observable):**
- Contains demonstrations of Program Intelligence application (Stream 50)
- Contains case studies of Program Intelligence in practice (Stream 60)
- BlueEdge Program Case Study explicitly named (CS-01)

**Authority scope:** Evidence and illustration — not governance or specification authority.

**Stream ownership:** Stream 50 (Demonstrations), Stream 60 (Case Studies)

**Evidence source:** normalized_evidence_map.md §10; repository_topology.md Zone 1

---

## ARZ-05 — Analytical Science Zone

**Repository paths:** `docs/signal-science/`, `docs/research/`

**Zone responsibility (observable):**
- Contains analytical models for signal science (Stream 70 authority)
- Contains research artifact RSR-06 — Execution Stability Index (RS-01)
- Informs framework via DS-08 relationship (signal science → framework)

**Authority scope:** Analytical models in this zone are referenced by M-06 (Signal Computation Engine). Stream 70 defines the signal models that M-06 applies.

**Stream ownership:** Stream 70 (Execution Signal Science), Stream 40 (analytical artifacts)

**Evidence source:** normalized_evidence_map.md §11; repository_topology.md Zone 1 (inter-zone relationship DS-08)

---

## ARZ-06 — Runtime Working Files Zone

**Repository paths:** `streams/40_Signal Execution Signal Infra/`

**Zone responsibility (observable):**
- Contains one working file per PiOS stream module (40.0 through 40.9)
- Each file defines the stream's scope, inputs, outputs, and governing contracts
- Files produced by stream execution feed the framework spec zone (ARZ-02)

**Authority scope:** Execution authority for Stream 40 module definitions. Not governance authority.

**Stream ownership:** Stream 40 (PiOS Runtime — all 40.0–40.9 sub-streams)

**Evidence source:** normalized_evidence_map.md §2.1–§2.10; repository_topology.md Zone 2

---

## ARZ-07 — Automation Zone

**Repository paths:** `scripts/`, `.github/workflows/`

**Zone responsibility (observable):**
- Generates per-stream handbook indexes automatically on push to main
- `generate-stream-indexes.sh` reads from `docs/<stream-dir>/*.md` and writes to `docs/handbook/`
- `update-handbook-indexes.yml` triggers and orchestrates the script

**Authority scope:** Operational automation. No governance or specification authority.

**Evidence source:** normalized_evidence_map.md §4.1, §6.1; repository_topology.md Zone 3

---

## ARZ-08 — PiOS Execution Outputs Zone

**Repository paths:** `docs/pios/`

**Zone responsibility (observable):**
- Stores all PiOS pipeline execution artifacts (intake, reconstruction, traceability)
- Segregated from discipline artifacts; excluded from INT-03 baseline count
- Contains 40.2 intake artifacts and 40.3 reconstruction artifacts (this execution)

**Authority scope:** Execution output persistence. Read-only reference for downstream modules.

**Evidence source:** repository_topology.md Zone 4

---

## Handbook Zone

**Repository paths:** `docs/handbook/`

**Zone responsibility (observable):**
- Contains 22 auto-generated index files (one per stream)
- Receives write from ARZ-07 automation
- Provides compiled handbook view of all stream documentation

**Evidence source:** normalized_evidence_map.md §6.1; repository_map.md

---

## Responsibility Zone Summary

| ID | Zone | Primary Responsibility | Stream Ownership |
|---|---|---|---|
| ARZ-01 | Governance and Discipline Authority | Governance over all streams | Stream 00, 10 |
| ARZ-02 | Framework and Specification | PiOS runtime specs | Stream 20 |
| ARZ-03 | Experience and Commercialization | Signäl Platform | Stream 30, 30.1 |
| ARZ-04 | Demonstrations and Case Studies | Evidence/illustration | Stream 50, 60 |
| ARZ-05 | Analytical Science | Signal models, research | Stream 70 |
| ARZ-06 | Runtime Working Files | PiOS module definitions | Stream 40 (40.0–40.9) |
| ARZ-07 | Automation | Handbook index generation | scripts/, .github/ |
| ARZ-08 | PiOS Execution Outputs | Pipeline output persistence | docs/pios/ |
| — | Handbook | Compiled stream indexes | docs/handbook/ |

# System Component Map
run_id: run_06_orchestrated_ingestion
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh
input: docs/pios/runs/run_06_orchestrated_ingestion/40.2/normalized_evidence_map.md, docs/pios/runs/run_06_orchestrated_ingestion/40.3/reconstruction/component_inventory.md

---

## Reconstruction Rule

This map represents the system-level component structure observable from the 40.2 normalized evidence. No structure is inferred. All containment, boundary, and ownership claims reference exact evidence sources.

---

## System Hierarchy

```
Krayu (C-01)
├── PiOS (C-02)
│   ├── M-01 — PiOS Runtime Layer (40.0)
│   ├── M-02 — PiOS Runtime Architecture (40.1)
│   ├── M-03 — PiOS Evidence Connectors Layer (40.2)
│   ├── M-04 — PiOS Reverse Engineering Engine (40.3)
│   ├── M-05 — PiOS Telemetry Extraction Layer (40.4)
│   ├── M-06 — PiOS Signal Computation Engine (40.5)
│   ├── M-07 — PiOS Condition and Diagnosis Activation Layer (40.6)
│   ├── M-08 — PiOS Intelligence Synthesis Layer (40.7)
│   ├── M-09 — PiOS Agentic Orchestration Layer (40.8)
│   └── M-10 — PiOS Feedback and Continuous Improvement Layer (40.9)
└── Signäl Platform (C-03)
    └── [Architecture and commercialization — Stream 30.1 authority]
```

**Evidence source:** normalized_evidence_map.md §1.1, §1.2, §1.3; component_inventory.md C-01, C-02, C-03

---

## Component Profiles

### Krayu (C-01)

| Field | Value |
|---|---|
| Type | Program-level container |
| Governance authority | Governance Master Capsule |
| Top-level streams | 00, 10, 20, 30, 40, 50, 60 |
| Contained components | PiOS (runtime), Signäl Platform (experience) |
| CKR reference | — (program-level, not a CKR construct) |
| Evidence source | normalized_evidence_map.md §1.3 |

**Boundary:** Krayu is the top-level named project. All streams and components operate within its governance scope.

---

### PiOS (C-02)

| Field | Value |
|---|---|
| Type | Runtime execution system |
| Full name | Program Intelligence Operating System |
| CKR reference | CKR-022 |
| Governing contract | PiOS Execution Contract |
| Contained by | Krayu (C-01) |
| Execution modes | Snapshot Mode, Continuous Mode, Monitoring Mode |
| Evidence source | normalized_evidence_map.md §1.1, §2.1–§2.10 |

**Observable boundaries (explicitly stated):**
- Does not define analytical theory
- Does not define commercialization
- Does not define product experience rendering

**Observable module sequence:** M-01 → M-02 → M-03 → M-04 → M-05 → M-06 → M-07 → M-08 → M-09 → M-10

---

### Signäl Platform (C-03)

| Field | Value |
|---|---|
| Type | Experience layer |
| CKR reference | CKR-021 |
| Stream authority | Stream 30.1 |
| Contained by | Krayu (C-01) |
| Evidence source | normalized_evidence_map.md §1.2 |

**Observable relationship to PiOS:** Downstream consumer of M-08 (Intelligence Synthesis Layer) outputs.

**Observable inputs from PiOS:**
- program_intelligence_summary.md
- evidence_linked_intelligence_packet.md
- executive_interpretation_brief.md
- intelligence_lineage_map.md

**Observable boundaries:**
- Platform architecture and commercialization remain within Stream 30.1
- Explicitly referenced as outside PiOS scope

---

## PiOS Module Registry

| ID | Stream | Name | Position in Pipeline |
|---|---|---|---|
| M-01 | 40.0 | PiOS Runtime Layer | Orchestration container |
| M-02 | 40.1 | PiOS Runtime Architecture | Conceptual model |
| M-03 | 40.2 | PiOS Evidence Connectors Layer | Stage 1 |
| M-04 | 40.3 | PiOS Reverse Engineering Engine | Stage 2 |
| M-05 | 40.4 | PiOS Telemetry Extraction Layer | Stage 3 |
| M-06 | 40.5 | PiOS Signal Computation Engine | Stage 4 |
| M-07 | 40.6 | PiOS Condition and Diagnosis Activation Layer | Stage 5 |
| M-08 | 40.7 | PiOS Intelligence Synthesis Layer | Stage 6 |
| M-09 | 40.8 | PiOS Agentic Orchestration Layer | Stage 7 |
| M-10 | 40.9 | PiOS Feedback and Continuous Improvement Layer | Stage 8 |

**Evidence source:** normalized_evidence_map.md §8 (pipeline definition); §2.1–§2.10 (module structural hints)

---

## Cross-Component Handover Points

| From | To | Handover artifact | Evidence source |
|---|---|---|---|
| M-08 (Intelligence Synthesis) | Signäl Platform (C-03) | program_intelligence_summary.md, evidence_linked_intelligence_packet.md, executive_interpretation_brief.md, intelligence_lineage_map.md | normalized_evidence_map.md §1.2, §2.8 |
| M-10 (Feedback and CI) | Stream 77 (Discipline Feedback Loop Registry) | Improvement routing artifacts | normalized_evidence_map.md §2.10 |

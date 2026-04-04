# Program Execution Graph (PEG)
run_id: run_02_blueedge
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG1C-REGEN
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1C fresh baseline re-ingestion from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation
input: docs/pios/runs/run_02_blueedge/40.2/normalized_evidence_map.md
governing_model: PERM (Program Execution Reconstruction Model) — GC-08

---

## PEG Construction Rule

The Program Execution Graph (PEG) is explicitly named in the normalized evidence as a required output of Stream 40.3 (normalized_evidence_map.md §2.4, §9 GC-09). The PEG represents the full set of entities as nodes and their dependencies/interactions as directed edges.

Nodes are derived from the entity catalog. Edges are derived from the dependency map and interface map. No node or edge is added without an explicit evidence source.

---

## Node Registry

### Component Nodes

| Node ID | Name | Type | CKR |
|---|---|---|---|
| N-C01 | Krayu | Component — program | — |
| N-C02 | PiOS | Component — runtime | CKR-022 |
| N-C03 | Signäl Platform | Component — experience | CKR-021 |

### Module Nodes (PiOS Runtime Stack)

| Node ID | Name | Stream | CKR |
|---|---|---|---|
| N-M01 | PiOS Runtime Layer | 40.0 | CKR-022 |
| N-M02 | PiOS Runtime Architecture | 40.1 | CKR-022 |
| N-M03 | PiOS Evidence Connectors Layer | 40.2 | CKR-023 |
| N-M04 | PiOS Reverse Engineering Engine | 40.3 | CKR-024 |
| N-M05 | PiOS Telemetry Extraction Layer | 40.4 | CKR-025 |
| N-M06 | PiOS Signal Computation Engine | 40.5 | CKR-026 |
| N-M07 | PiOS Condition and Diagnosis Activation Layer | 40.6 | CKR-027 |
| N-M08 | PiOS Intelligence Synthesis Layer | 40.7 | CKR-028 |
| N-M09 | PiOS Agentic Orchestration Layer | 40.8 | CKR-029 |
| N-M10 | PiOS Feedback and Continuous Improvement Layer | 40.9 | CKR-030 |

### External Stream Nodes (referenced, not fully defined in repository)

Only streams with observable edges in this graph are registered as nodes.

| Node ID | Name | Stream |
|---|---|---|
| N-DS03 | Execution Signal Science | 70 |
| N-DS04 | Program Condition Model | 75.1 |
| N-DS05 | Program Diagnosis Model | 75.2 |
| N-DS06 | Discipline Feedback Loop Registry | 77 |

**Note:** Stream 10 (N-DS01) and Stream 20 (N-DS02) are referenced in normalized evidence but have no observable directed edges in this graph. They are cataloged in entity_catalog.md EC-03 but are not registered as PEG nodes.

### Automation Nodes

| Node ID | Name | Type |
|---|---|---|
| N-SC01 | generate-stream-indexes.sh | Script |
| N-CF03 | update-handbook-indexes.yml | Configuration / CI |
| N-HB01 | docs/handbook/ | Output target |

### Governance Nodes

Only governance artifacts with observable edges in this graph are registered as nodes.

| Node ID | Name | Type |
|---|---|---|
| N-GC01 | Governance Master Capsule | Governance artifact |
| N-GC08 | PERM | Governing model |

**Note:** Canonical Knowledge Registry (N-GC03) governs the 34 CKR constructs, but CKR constructs are not modeled as PEG nodes in this graph. With no explicit PEG edges resolvable to registered nodes, N-GC03 is excluded. CKR governance coverage is provided in entity_catalog.md EC-04 and structural_traceability_map.md.

---

## Edge Registry

### E-01 — Containment Edges (Component hierarchy)

| Edge ID | From | To | Relationship | Evidence source |
|---|---|---|---|---|
| E-01a | N-C01 (Krayu) | N-C02 (PiOS) | contains | normalized_evidence_map.md §1.1, §1.3 |
| E-01b | N-C01 (Krayu) | N-C03 (Signäl Platform) | contains | normalized_evidence_map.md §1.2, §1.3 |
| E-01c1 | N-C02 (PiOS) | N-M01 (PiOS Runtime Layer) | contains | normalized_evidence_map.md §1.1, §2.1 |
| E-01c2 | N-C02 (PiOS) | N-M02 (PiOS Runtime Architecture) | contains | normalized_evidence_map.md §1.1, §2.2 |
| E-01c3 | N-C02 (PiOS) | N-M03 (PiOS Evidence Connectors) | contains | normalized_evidence_map.md §1.1, §2.3 |
| E-01c4 | N-C02 (PiOS) | N-M04 (PiOS Reverse Engineering) | contains | normalized_evidence_map.md §1.1, §2.4 |
| E-01c5 | N-C02 (PiOS) | N-M05 (PiOS Telemetry Extraction) | contains | normalized_evidence_map.md §1.1, §2.5 |
| E-01c6 | N-C02 (PiOS) | N-M06 (PiOS Signal Computation) | contains | normalized_evidence_map.md §1.1, §2.6 |
| E-01c7 | N-C02 (PiOS) | N-M07 (PiOS Condition/Diagnosis) | contains | normalized_evidence_map.md §1.1, §2.7 |
| E-01c8 | N-C02 (PiOS) | N-M08 (PiOS Intelligence Synthesis) | contains | normalized_evidence_map.md §1.1, §2.8 |
| E-01c9 | N-C02 (PiOS) | N-M09 (PiOS Agentic Orchestration) | contains | normalized_evidence_map.md §1.1, §2.9 |
| E-01c10 | N-C02 (PiOS) | N-M10 (PiOS Feedback and CI) | contains | normalized_evidence_map.md §1.1, §2.10 |

### E-02 — Pipeline Execution Edges (Mandatory sequential flow)

| Edge ID | From | To | Relationship | Evidence source |
|---|---|---|---|---|
| E-02a | N-M03 | N-M04 | pipeline output → input | normalized_evidence_map.md §8 |
| E-02b | N-M04 | N-M05 | pipeline output → input | normalized_evidence_map.md §8 |
| E-02c | N-M05 | N-M06 | pipeline output → input | normalized_evidence_map.md §8 |
| E-02d | N-M06 | N-M07 | pipeline output → input | normalized_evidence_map.md §8 |
| E-02e | N-M07 | N-M08 | pipeline output → input | normalized_evidence_map.md §8 |
| E-02f | N-M08 | N-M09 | pipeline output → input | normalized_evidence_map.md §8 |
| E-02g | N-M09 | N-M10 | pipeline output → input | normalized_evidence_map.md §8 |

### E-03 — Intelligence Delivery Edge

| Edge ID | From | To | Relationship | Evidence source |
|---|---|---|---|---|
| E-03a | N-M08 (Intelligence Synthesis) | N-C03 (Signäl Platform) | delivers intelligence outputs | normalized_evidence_map.md §1.2, §2.8 |

**Handover artifacts:** program_intelligence_summary.md, evidence_linked_intelligence_packet.md, executive_interpretation_brief.md, intelligence_lineage_map.md

### E-04 — Model Activation Edges

| Edge ID | From | To | Relationship | Evidence source |
|---|---|---|---|---|
| E-04a | N-M06 (Signal Computation) | N-DS03 (Stream 70) | applies signal models from | normalized_evidence_map.md §2.6 |
| E-04b | N-M07 (Condition/Diagnosis) | N-DS04 (Stream 75.1) | activates condition model | normalized_evidence_map.md §2.7 |
| E-04c | N-M07 (Condition/Diagnosis) | N-DS05 (Stream 75.2) | activates diagnosis model | normalized_evidence_map.md §2.7 |

### E-05 — Governance Edges

| Edge ID | From | To | Relationship | Evidence source |
|---|---|---|---|---|
| E-05a | N-GC01 (Governance Master Capsule) | N-C01 (Krayu) | governs | normalized_evidence_map.md §9 |
| E-05b | N-GC08 (PERM) | N-M04 (Reverse Engineering) | governing model for | normalized_evidence_map.md §9 GC-08 |

**Excluded governance relationships (non-PEG, reclassified as governance constraints):**
- State–Diagnosis Separation Principle (GC-07) → M-07: GC-07 has no PEG node; recorded as governance constraint in dependency_map.md §5
- PiOS Execution Contract → PiOS (C-02): no PEG node; recorded as governance constraint in dependency_map.md §5
- CKR canonical authority over 34 constructs: constructs not modeled as PEG nodes; recorded in entity_catalog.md EC-04

### E-06 — Feedback Edge

| Edge ID | From | To | Relationship | Evidence source |
|---|---|---|---|---|
| E-06a | N-M10 (Feedback and CI) | N-DS06 (Stream 77) | routes improvements to | normalized_evidence_map.md §2.10 |

### E-07 — Automation Edges

| Edge ID | From | To | Relationship | Evidence source |
|---|---|---|---|---|
| E-07a | N-CF03 (yml) | N-SC01 (script) | invokes on push to main | normalized_evidence_map.md §4.1 |
| E-07b | N-SC01 (script) | N-HB01 (handbook) | writes index files to | normalized_evidence_map.md §6.1 |

---

## PEG — Text Representation

```
[Krayu (N-C01)]
  ├── E-01a: contains → [PiOS (N-C02)]
  │     ├── E-01c1:  contains → [M-01 Runtime Layer (N-M01)]
  │     ├── E-01c2:  contains → [M-02 Runtime Architecture (N-M02)]
  │     ├── E-01c3:  contains → [M-03 Evidence Connectors (N-M03)]
  │     ├── E-01c4:  contains → [M-04 Reverse Engineering (N-M04)]
  │     ├── E-01c5:  contains → [M-05 Telemetry Extraction (N-M05)]
  │     ├── E-01c6:  contains → [M-06 Signal Computation (N-M06)]
  │     ├── E-01c7:  contains → [M-07 Condition/Diagnosis (N-M07)]
  │     ├── E-01c8:  contains → [M-08 Intelligence Synthesis (N-M08)]
  │     ├── E-01c9:  contains → [M-09 Agentic Orchestration (N-M09)]
  │     └── E-01c10: contains → [M-10 Feedback and CI (N-M10)]
  └── E-01b: contains → [Signäl Platform (N-C03)]

Pipeline (mandatory sequential):
[M-03] ─E-02a─► [M-04] ─E-02b─► [M-05] ─E-02c─► [M-06] ─E-02d─►
[M-07] ─E-02e─► [M-08] ─E-02f─► [M-09] ─E-02g─► [M-10]

Cross-component delivery:
[M-08] ─E-03a─► [Signäl Platform (N-C03)]

Model activation:
[M-06] ─E-04a─► [Stream 70 / N-DS03]
[M-07] ─E-04b─► [Stream 75.1 / N-DS04]
[M-07] ─E-04c─► [Stream 75.2 / N-DS05]

Governance:
[Governance Master Capsule (N-GC01)] ─E-05a─► [Krayu (N-C01)]
[PERM (N-GC08)] ─E-05b─► [M-04 Reverse Engineering (N-M04)]

Feedback:
[M-10 (N-M10)] ─E-06a─► [Stream 77 / N-DS06]

Automation:
[update-handbook-indexes.yml (N-CF03)] ─E-07a─► [generate-stream-indexes.sh (N-SC01)]
[generate-stream-indexes.sh (N-SC01)] ─E-07b─► [docs/handbook/ (N-HB01)]
```

---

## PEG Summary

| Element | Count | Node IDs |
|---|---|---|
| Component nodes | 3 | N-C01, N-C02, N-C03 |
| Module nodes | 10 | N-M01 through N-M10 |
| External stream nodes | 4 | N-DS03, N-DS04, N-DS05, N-DS06 |
| Automation nodes | 3 | N-SC01, N-CF03, N-HB01 |
| Governance nodes | 2 | N-GC01, N-GC08 |
| **Total nodes** | **22** | |

| Edge category | Count | Edge IDs |
|---|---|---|
| Containment edges | 12 | E-01a, E-01b, E-01c1–E-01c10 |
| Pipeline edges | 7 | E-02a–E-02g |
| Intelligence delivery edges | 1 | E-03a |
| Model activation edges | 3 | E-04a, E-04b, E-04c |
| Governance edges | 2 | E-05a, E-05b |
| Feedback edges | 1 | E-06a |
| Automation edges | 2 | E-07a, E-07b |
| **Total edges** | **28** | |

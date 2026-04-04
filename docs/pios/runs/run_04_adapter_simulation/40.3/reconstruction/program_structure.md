# Program Structure
run_id: run_04_adapter_simulation
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG2-ADAPTER
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.2 adapter simulation run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; GitHub adapter ENABLED (mvp-krayu/krayu-program-intelligence); Jira adapter CAPSULE
input: docs/pios/runs/run_04_adapter_simulation/40.2/normalized_evidence_map.md
governing_model: PERM (Program Execution Reconstruction Model) — GC-08

---

## Reconstruction Rule

Program structure is reconstructed strictly from observable content in the 40.2 normalized evidence. Structure reflects only what is explicitly named, assigned, or described in source artifacts. All claims reference exact evidence.

---

## 1. Program Identity

| Field | Value | Evidence source |
|---|---|---|
| Program name | Krayu | normalized_evidence_map.md §1.3 |
| Full name | Krayu Program Intelligence Platform | normalized_evidence_map.md §1.3 |
| Naming rule | All-capital "KRAYU" must not be used | component_inventory.md C-01 |
| Type | Program Intelligence Platform | normalized_evidence_map.md §1.3 |
| Governance | Governed by Governance Master Capsule | normalized_evidence_map.md §9 |

---

## 2. Top-Level Stream Structure

Streams are the primary organizational unit of Krayu. Stream architecture is explicitly defined in the Governance Master Capsule.

| Stream | Name | Directory | Evidence source |
|---|---|---|---|
| Stream 00 | Krayu Governance | docs/governance/ | normalized_evidence_map.md §9 |
| Stream 10 | Program Intelligence Discipline | docs/program-intelligence-discipline/ | normalized_evidence_map.md §2.11 |
| Stream 20 | Program Intelligence Framework | docs/program-intelligence-framework/ | normalized_evidence_map.md §2.11 |
| Stream 30 | Program Intelligence Commercialization | docs/program-intelligence-commercialization/ | normalized_evidence_map.md §2.11 |
| Stream 40 | Signäl Execution Signal Infrastructure | streams/40_Signal Execution Signal Infra/ | normalized_evidence_map.md §2.11 |
| Stream 50 | Program Intelligence Demonstrations | docs/program-intelligence-demonstrations/ | normalized_evidence_map.md §2.11 |
| Stream 60 | Program Intelligence Case Studies | docs/program-intelligence-case-studies/ | normalized_evidence_map.md §2.11 |

**Observable execution order (explicitly stated in governance_master_capsule.md):**
```
Stream 10 → Stream 40 → Stream 20 → Stream 50 → Stream 60 → Stream 30
```

**Evidence source:** normalized_evidence_map.md §9 (GC-05)

---

## 3. Sub-Stream Structure (Stream 40)

Stream 40 contains the complete PiOS runtime pipeline. Sub-streams are numbered 40.0 through 40.9.

| Sub-Stream | Name | Module ID | Directory |
|---|---|---|---|
| 40.0 | PiOS Runtime Layer | M-01 | 40.0_PiOSRuntimeLayer/ |
| 40.1 | PiOS Runtime Architecture | M-02 | 40.1_PiOSRuntimeArchitecture/ |
| 40.2 | PiOS Evidence Connectors Layer | M-03 | 40.2_PiOSEvidenceConnectors/ |
| 40.3 | PiOS Reverse Engineering Engine | M-04 | 40.3_PIOSReverseEngineering/ |
| 40.4 | PiOS Telemetry Extraction Layer | M-05 | 40.4_PiOSTelementryExtraction/ |
| 40.5 | PiOS Signal Computation Engine | M-06 | 40.5_PiOSSignalComputation/ |
| 40.6 | PiOS Condition and Diagnosis Activation Layer | M-07 | 40.6_PiOSConditionDiagnosisLayer/ |
| 40.7 | PiOS Intelligence Synthesis Layer | M-08 | 40.7_PiOSIntellignceSynthesisLayer/ |
| 40.8 | PiOS Agentic Orchestration Layer | M-09 | 40.8_PiOSAgenticOrchestrationLayer/ |
| 40.9 | PiOS Feedback and Continuous Improvement Layer | M-10 | 40.9_PiOSFeedbackAndCI Layer/ |

**Evidence source:** normalized_evidence_map.md §2.1–§2.10

---

## 4. Referenced External Streams (Beyond Krayu Top-Level)

These streams are referenced by PiOS modules but are not fully defined in this repository.

| Stream | Name | Referenced by | Evidence source |
|---|---|---|---|
| Stream 30.1 | Signäl Platform & Product Architecture | All stream files | normalized_evidence_map.md §2.11 |
| Stream 70 | Execution Signal Science | M-06 | normalized_evidence_map.md §2.6, §2.11 |
| Stream 75 | Program Diagnosis and Intelligence Models | M-07 | normalized_evidence_map.md §2.11 |
| Stream 75.1 | Program Condition Model | M-07 | normalized_evidence_map.md §2.7, §2.11 |
| Stream 75.2 | Program Diagnosis Model | M-07 | normalized_evidence_map.md §2.7, §2.11 |
| Stream 77 | Discipline Feedback Loop Registry | M-10 | normalized_evidence_map.md §2.10, §2.11 |
| Stream 80 | Execution Stability Index (ESI) | All stream files | normalized_evidence_map.md §2.11 |
| Stream 90 | Program Intelligence Working State Control | All stream files | normalized_evidence_map.md §2.11 |

---

## 5. Component Structure

| Component | Layer | Contained By | CKR |
|---|---|---|---|
| Krayu | Program | — | — |
| PiOS | Runtime | Krayu | CKR-022 |
| Signäl Platform | Experience | Krayu | CKR-021 |

**Evidence source:** normalized_evidence_map.md §1.1, §1.2, §1.3

---

## 6. Three-Layer Model Mapping

The program is structured around three explicitly named analytical layers.

| Layer | Name | CKR constructs at this layer | Evidence source |
|---|---|---|---|
| Layer 1 | Observability Layer | CKR-003 (Execution Evidence), CKR-004 (Execution Telemetry), CKR-005 (Execution Signals) | normalized_evidence_map.md §7 |
| Layer 2 | Intelligence Layer | CKR-012 (Program Conditions), CKR-013 (Program Diagnosis), CKR-014 (ESI), CKR-015 (RAG) | normalized_evidence_map.md §7 |
| Layer 3 | Executive Intelligence Layer | CKR-028 (Intelligence Synthesis) — produces executive outputs | normalized_evidence_map.md §7 |

---

## 7. Governance Structure

| Governance artifact | Scope | Evidence source |
|---|---|---|
| Governance Master Capsule | All streams and components | normalized_evidence_map.md §9 GC-01 |
| Governance Operating Model | Operational governance rules | normalized_evidence_map.md §9 GC-02 |
| Canonical Knowledge Registry | All 34 CKR constructs | normalized_evidence_map.md §3, §9 GC-03 |
| Krayu Governance Capsule | Web governance | normalized_evidence_map.md §9 GC-04 |
| PiOS Execution Contract | PiOS runtime behavior | normalized_evidence_map.md §1.1 |

---

## 8. File Structure Summary

| Zone | File count | Classification |
|---|---|---|
| docs/governance/ | 5 | Documentation |
| docs/handbook/ | 22 | Documentation (auto-generated) |
| docs/program-intelligence-discipline/ | 9 | Documentation |
| docs/program-intelligence-framework/ (all) | 19 | Documentation |
| docs/signal-science/ | 14 | Documentation |
| docs/program-intelligence-commercialization/ | 4 | Documentation |
| docs/program-intelligence-demonstrations/ | 4 | Documentation |
| docs/program-intelligence-case-studies/ | 4 | Documentation |
| docs/web-governance/ | 1 | Documentation |
| docs/research/ | 1 | Documentation |
| streams/ (md) | 10 | Documentation |
| root README.md | 1 | Documentation |
| scripts/ | 1 | Code |
| .github/workflows/ | 1 | Configuration |
| .gitignore | 1 | Configuration |
| .env.claude | 1 | Configuration |
| Other (.DS_Store × 3, .zip × 2) | 5 | Other |
| **Total (INT-03 baseline)** | **94 doc + 1 code + 3 config + 8 other = 106** | |

**Evidence source:** normalized_evidence_map.md; evidence_surface_inventory.md

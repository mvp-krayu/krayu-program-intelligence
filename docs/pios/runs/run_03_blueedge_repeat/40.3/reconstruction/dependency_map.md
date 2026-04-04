# Dependency Map
run_id: run_03_blueedge_repeat
stream: Stream 40.3 — PiOS Reverse Engineering Engine
contract: PIOS-40.3-RUN02-IG1E-REPEAT
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1E determinism re-run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; repeat of IG.1C for determinism verification
input: docs/pios/runs/run_03_blueedge_repeat/40.2/normalized_evidence_map.md

---

## Reconstruction Rule

All dependencies recorded here are explicitly observable from the 40.2 normalized evidence. Dependency relationships are declared only where evidence contains explicit directional references (e.g., "accepts input from", "produces output to", "invokes", "governs", "routes to"). No dependency is inferred from proximity or naming alone.

Dependency notation: `A → B` means A depends on B as an input, or A produces output consumed by B.

---

## 1. Module Pipeline Dependencies (Sequential)

Observable from: normalized_evidence_map.md §8 (pipeline definition — explicitly stated as mandatory order)

```
M-03 (Evidence Connectors)
  → M-04 (Reverse Engineering Engine)
    → M-05 (Telemetry Extraction Layer)
      → M-06 (Signal Computation Engine)
        → M-07 (Condition and Diagnosis Activation Layer)
          → M-08 (Intelligence Synthesis Layer)
            → M-09 (Agentic Orchestration Layer)
              → M-10 (Feedback and Continuous Improvement Layer)
```

**Pipeline constraint:** Order is mandatory (explicitly stated in pios_pipeline_specification.md).

---

## 2. Module-to-Model Dependencies

Observable from: normalized_evidence_map.md §2.4–§2.7

| Module | Depends On | Relationship | Evidence source |
|---|---|---|---|
| M-04 (Reverse Engineering Engine) | PERM (GC-08) | Governing model — operationalized by M-04 | normalized_evidence_map.md §2.4, §9 |
| M-06 (Signal Computation Engine) | Stream 70 signal models | Model application — M-06 applies signal models from Stream 70 | normalized_evidence_map.md §2.6 |
| M-07 (Condition Activation) | Stream 75.1 (Program Condition Model) | Model activation — M-07 activates Stream 75.1 | normalized_evidence_map.md §2.7 |
| M-07 (Diagnosis Activation) | Stream 75.2 (Program Diagnosis Model) | Model activation — M-07 activates Stream 75.2 | normalized_evidence_map.md §2.7 |

---

## 3. Module-to-Component Dependencies

Observable from: normalized_evidence_map.md §1.2, §2.8

| Module | Depends On | Relationship | Evidence source |
|---|---|---|---|
| M-08 (Intelligence Synthesis Layer) | Signäl Platform (C-03) | Output delivery — M-08 delivers intelligence outputs to Signäl Platform | normalized_evidence_map.md §1.2, §2.8 |
| M-10 (Feedback and CI) | Stream 77 (Discipline Feedback Loop Registry) | Output routing — M-10 routes improvements to Stream 77 | normalized_evidence_map.md §2.10 |

---

## 4. Automation Dependencies

Observable from: normalized_evidence_map.md §4.1, §6.1

| From | To | Relationship | Evidence source |
|---|---|---|---|
| CF-03 (update-handbook-indexes.yml) | SC-01 (generate-stream-indexes.sh) | CI/CD invokes script on push to main | normalized_evidence_map.md §4.1 |
| SC-01 (generate-stream-indexes.sh) | docs/handbook/ | Script writes auto-generated handbook index files | normalized_evidence_map.md §6.1 |

**Observable trigger:** push to `main` branch
**Observable actor:** `github-actions` / `actions@github.com`

---

## 5. Governance Dependencies

Observable from: normalized_evidence_map.md §9

**Classification:** Each entry is classified as either a PEG edge (represented in program_execution_graph.md) or a non-PEG governance constraint (no corresponding PEG node; recorded here only).

| Governed Entity | Governed By | Relationship | PEG representation | Evidence source |
|---|---|---|---|---|
| All streams and components | Governance Master Capsule (GC-01) | Governance authority over all stream artifacts | PEG edge E-05a | normalized_evidence_map.md §9 GC-01 |
| M-04 (Reverse Engineering Engine) | PERM (GC-08) | PERM is governing model for reconstruction | PEG edge E-05b | normalized_evidence_map.md §9 GC-08 |
| M-07 (Condition/Diagnosis Layer) | State–Diagnosis Separation Principle (GC-07) | Principle governs condition/diagnosis separation | **Non-PEG governance constraint** — GC-07 has no PEG node | normalized_evidence_map.md §9 GC-07 |
| PiOS (C-02) | PiOS Execution Contract | Contract governs PiOS runtime behavior | **Non-PEG governance constraint** — PiOS Execution Contract has no PEG node | normalized_evidence_map.md §1.1 |
| All 34 CKR constructs | Canonical Knowledge Registry (GC-03, CKR-034) | Registry governs canonical construct definitions | **Non-PEG governance constraint** — CKR constructs not modeled as PEG nodes; covered in entity_catalog.md EC-04 | normalized_evidence_map.md §3 |

**PEG-mapped governance edges: 2 (E-05a, E-05b)**
**Non-PEG governance constraints: 3 (GC-07→M-07, PiOS Execution Contract→PiOS, CKR→34 constructs)**

---

## 6. M-04 Input Dependencies (This Module's Position in Pipeline)

Observable from: normalized_evidence_map.md §2.4

M-04 (PiOS Reverse Engineering Engine) accepts the following as strict inputs:

| Input artifact | Producer | Evidence source |
|---|---|---|
| evidence_surface_inventory.md | M-03 (Evidence Connectors) | normalized_evidence_map.md §2.4 |
| normalized_evidence_map.md | M-03 (Evidence Connectors) | normalized_evidence_map.md §2.4 |

M-04 produces the following as strict outputs for M-05:

| Output artifact | Consumer | Evidence source |
|---|---|---|
| entity_catalog.md | M-05 (Telemetry Extraction) | normalized_evidence_map.md §2.4, §2.5 |
| repository_map.md | M-05 (Telemetry Extraction) | normalized_evidence_map.md §2.4, §2.5 |
| dependency_map.md | M-05 (Telemetry Extraction) | normalized_evidence_map.md §2.4, §2.5 |
| interface_map.md | M-05 (Telemetry Extraction) | normalized_evidence_map.md §2.4, §2.5 |
| program_execution_graph.md | M-05 (Telemetry Extraction) | normalized_evidence_map.md §2.4, §2.5 |

---

## Dependency Summary

| Category | Count | Observable |
|---|---|---|
| Sequential pipeline dependencies | 7 edges | Yes — mandatory order stated |
| Module-to-model dependencies | 4 | Yes — explicitly named in evidence |
| Module-to-component dependencies | 2 | Yes — explicitly named in evidence |
| Automation dependencies | 2 | Yes — yml invocation chain observable |
| Governance dependencies | 5 | Yes — governance artifacts name governed scope |

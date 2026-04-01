# Execution Manifest

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**date:** 2026-04-01
**branch:** feature/pios-core

---

## Execution Identity

| Field | Value |
|---|---|
| Stream | 40.6 |
| Run ID | run_01_condition_activation |
| Contract type | Core Execution — CE-Aligned Condition & Diagnosis Activation Run |
| Execution mode | Claude Code — EXECUTION ONLY |
| Pre-flight result | PASS |
| Pre-flight timestamp | 2026-04-01T13:25:12Z (inherited from upstream gate; no dirty state) |
| CWD | /Users/khorrix/Projects/k-pi-core |
| Branch | feature/pios-core |
| Output root | runs/pios/40.6/run_01_condition_activation/ |

---

## Input Boundary

| Input | Path | Access Type | Authorized |
|---|---|---|---|
| Signal Output Set | runs/pios/40.5/run_02_ce_validation/signal_output_set.md | read | yes |
| Signal Traceability Map | runs/pios/40.5/run_02_ce_validation/signal_traceability_map.md | read | yes |
| Signal Validation Report | runs/pios/40.5/run_02_ce_validation/signal_validation_report.md | read | yes |
| Execution Manifest (40.5) | runs/pios/40.5/run_02_ce_validation/execution_manifest.md | read | yes |
| Condition Validation Report (baseline) | docs/pios/40.6/condition_validation_report.md | read (reference) | yes |
| Condition Boundary Enforcement (baseline) | docs/pios/40.6/condition_boundary_enforcement.md | read (reference) | yes |
| Any 40.4 artifact | docs/pios/40.4/*.md | not accessed | — |
| Any 41.x / 42.x / 51.x artifact | docs/pios/41.x–51.x/ | not accessed | — |

---

## Enforcement Applied

| CE Rule | Applied |
|---|---|
| CE.3 I2 interface validation | APPLIED — GH-03 I2 pre-check validated; all 8 checks PASS |
| CE.4 GH-03 (40.5 → 40.6 handoff gate) | PASS |
| CE.5 executable validation surface | APPLIED — validation report produced |
| CE.5 failure handling (F2 for PARTIAL) | APPLIED — PARTIAL conditions and diagnoses carry UNDEFINED flags |
| Global Execution Safety contract | COMPLIANT — demo untouched, docs untouched, run isolated |

---

## Work Packages Executed

| WP | Title | Status |
|---|---|---|
| WP1 | Condition Input Matrix | COMPLETE |
| WP2 | Condition Activation Specification | COMPLETE |
| WP3 | Condition Output Set | COMPLETE |
| WP4 | Condition Traceability Map | COMPLETE |
| WP5 | Diagnosis Input Matrix | COMPLETE |
| WP6 | Diagnosis Activation Specification | COMPLETE |
| WP7 | Diagnosis Output Set | COMPLETE |
| WP8 | Condition Validation Report | COMPLETE |
| WP9 | Execution Manifest | COMPLETE |

---

## Artifacts Produced

| Artifact | Path |
|---|---|
| Condition Input Matrix | runs/pios/40.6/run_01_condition_activation/condition_input_matrix.md |
| Condition Activation Specification | runs/pios/40.6/run_01_condition_activation/condition_activation_specification.md |
| Condition Output Set | runs/pios/40.6/run_01_condition_activation/condition_output_set.md |
| Condition Traceability Map | runs/pios/40.6/run_01_condition_activation/condition_traceability_map.md |
| Diagnosis Input Matrix | runs/pios/40.6/run_01_condition_activation/diagnosis_input_matrix.md |
| Diagnosis Activation Specification | runs/pios/40.6/run_01_condition_activation/diagnosis_activation_specification.md |
| Diagnosis Output Set | runs/pios/40.6/run_01_condition_activation/diagnosis_output_set.md |
| Condition Validation Report | runs/pios/40.6/run_01_condition_activation/condition_validation_report.md |
| Execution Manifest | runs/pios/40.6/run_01_condition_activation/execution_manifest.md |

---

## Condition and Diagnosis Coverage Summary

| Category | Count | IDs |
|---|---|---|
| Conditions complete / diagnoses active | 2 | COND-001/DIAG-001, COND-002/DIAG-002 |
| Conditions partial / diagnoses partial | 4 | COND-003/DIAG-003, COND-004/DIAG-004, COND-007/DIAG-007, COND-008/DIAG-008 |
| Conditions blocked / diagnoses blocked | 2 | COND-005/DIAG-005, COND-006/DIAG-006 |

---

## Scope Extension Declaration

| Observation | Type | Disposition |
|---|---|---|
| Contract includes diagnosis WPs (WP5–WP7); canonical 40.6 boundary enforcement declares diagnosis as Stream 75.2 authority | SCOPE-EXTENSION | Noted and flagged. Diagnosis artifacts produced as limited coverage activation records only — no root cause attribution, no semantic enrichment. GC-07 (State–Diagnosis Separation) fully enforced. |

---

## Scope Adherence

| Check | Result |
|---|---|
| All output written to runs/pios/40.6/run_01_condition_activation/ | PASS |
| docs/ not written | PASS |
| 40.5 run_02_ce_validation artifacts not overwritten | PASS |
| Demo (41.x / 42.x / 51.9) untouched | PASS |
| 40.4 inputs not accessed | PASS |
| 40.5 signal values not recomputed | PASS |
| CE artifacts not modified | PASS |
| No other files created | PASS |

---

## Final Execution Status

| Dimension | Status |
|---|---|
| Pre-flight | PASS |
| GH-03 I2 validation | PASS |
| Condition activation | PARTIAL (governed — 2 complete, 4 partial, 2 blocked) |
| Diagnosis activation | PARTIAL (governed — 2 active, 4 partial, 2 blocked) |
| Boundary compliance | PASS |
| Demo safety | PASS |
| Scope extension | FLAGGED (1 observation — diagnosis WPs included per contract; GC-07 enforced) |

**EXECUTION STATUS: PASS**

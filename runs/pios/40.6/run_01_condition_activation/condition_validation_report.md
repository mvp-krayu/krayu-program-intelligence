# Condition Validation Report

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_02_ce_validation (Stream 40.5)
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Validation Rule

This report validates run_01_condition_activation artifacts against PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1. All checks must pass for final validation status to be PASS.

---

## GH-03 I2 Pre-Check (40.5 → 40.6 Handoff Gate)

| Check | Rule | Result |
|---|---|---|
| GH-03-C01 | Upstream run_id = run_02_ce_validation | PASS |
| GH-03-C02 | All PARTIAL signal flags present in signal_output_set.md | PASS |
| GH-03-C03 | No UNDEFINED value rendered as 0 in upstream outputs | PASS |
| GH-03-C04 | Signal values unmodified from 40.5 run_02_ce_validation | PASS |
| GH-03-C05 | GH-02 handoff gate status = PASS in upstream execution_manifest.md | PASS |
| GH-03-C06 | No direct 40.4 artifact access by this run | PASS |
| GH-03-C07 | No 41.x / 42.x path accessed | PASS |
| GH-03-C08 | Input boundary restricted to runs/pios/40.5/run_02_ce_validation/ | PASS |

**GH-03 I2 Pre-Check: PASS — all 8 checks pass**

---

## Check 1 — Completeness

All expected run_01_condition_activation artifacts must be present.

| Artifact | Expected Path | Status |
|---|---|---|
| condition_input_matrix.md | runs/pios/40.6/run_01_condition_activation/ | Present |
| condition_activation_specification.md | runs/pios/40.6/run_01_condition_activation/ | Present |
| condition_output_set.md | runs/pios/40.6/run_01_condition_activation/ | Present |
| condition_traceability_map.md | runs/pios/40.6/run_01_condition_activation/ | Present |
| diagnosis_input_matrix.md | runs/pios/40.6/run_01_condition_activation/ | Present |
| diagnosis_activation_specification.md | runs/pios/40.6/run_01_condition_activation/ | Present |
| diagnosis_output_set.md | runs/pios/40.6/run_01_condition_activation/ | Present |
| condition_validation_report.md | runs/pios/40.6/run_01_condition_activation/ | Present (this file) |
| execution_manifest.md | runs/pios/40.6/run_01_condition_activation/ | Present |

**Result: PASS — 9/9 artifacts present**

---

## Check 2 — Condition Traceability Coverage

Every governed condition must trace to: (a) CKR-012, (b) at least one governed 40.5 signal, (c) the 40.5 artifact in which that signal is defined, (d) the 40.4 metric chain (via signal traceability), (e) an inherited temporal reference.

| Condition | CKR Ref | Signal Traced | 40.5 Artifact Cited | 40.4 Chain Declared | Temporal Inherited | Traced |
|---|---|---|---|---|---|---|
| COND-001 | CKR-012 | SIG-002 | signal_output_set.md | yes (ST-007, ST-012..ST-015) | static | yes |
| COND-002 | CKR-012 | SIG-004 | signal_output_set.md | yes (ST-006..ST-011) | static | yes |
| COND-003 | CKR-012 | SIG-001 | signal_output_set.md | yes (ST-012, ST-016, AT-005, AT-007) | static + event-based | yes |
| COND-004 | CKR-012 | SIG-005 | signal_output_set.md | yes (AT-005, DT-001, DT-003, DT-007) | event-based | yes |
| COND-005 | CKR-012 | SIG-003 | signal_output_set.md | yes (AT-001, AT-002, AT-003) | time-series | yes |
| COND-006 | CKR-012 | SIG-006 | signal_output_set.md | yes (AT-007, AT-009, DT-007, DT-008) | event-based | yes |
| COND-007 | CKR-012 | SIG-007 | signal_output_set.md | yes (via SIG-002, SIG-005, SIG-006) | event-based | yes |
| COND-008 | CKR-012 | SIG-008 | signal_output_set.md | yes (via SIG-001, SIG-003, SIG-004) | mixed | yes |

**Result: PASS — 8/8 conditions fully traced**

---

## Check 3 — Coverage Propagation Correctness

Signal state propagation to condition state must be exact. No condition may be elevated above its governing signal state.

| Condition | Governing Signal | Signal State | Expected Condition State | Declared Condition State | Correct |
|---|---|---|---|---|---|
| COND-001 | SIG-002 | COMPLETE | complete | complete | yes |
| COND-002 | SIG-004 | COMPLETE | complete | complete | yes |
| COND-003 | SIG-001 | PARTIAL | partial | partial | yes |
| COND-004 | SIG-005 | PARTIAL | partial | partial | yes |
| COND-005 | SIG-003 | BLOCKED | blocked | blocked | yes |
| COND-006 | SIG-006 | BLOCKED | blocked | blocked | yes |
| COND-007 | SIG-007 | PARTIAL | partial | partial | yes |
| COND-008 | SIG-008 | PARTIAL | partial | partial | yes |

**Result: PASS — 8/8 conditions correctly propagate signal coverage states**

---

## Check 4 — Diagnosis Traceability Coverage

Every diagnosis entry must trace to its originating condition and the condition's supporting signals.

| Diagnosis | Originating Condition | Condition State | Supporting Signals | Traced |
|---|---|---|---|---|
| DIAG-001 | COND-001 | complete | SIG-002 | yes |
| DIAG-002 | COND-002 | complete | SIG-004 | yes |
| DIAG-003 | COND-003 | partial | SIG-001 | yes |
| DIAG-004 | COND-004 | partial | SIG-005 | yes |
| DIAG-005 | COND-005 | blocked | SIG-003 | yes |
| DIAG-006 | COND-006 | blocked | SIG-006 | yes |
| DIAG-007 | COND-007 | partial | SIG-007 (SIG-002 component) | yes |
| DIAG-008 | COND-008 | partial | SIG-008 (SIG-001, SIG-004 active; SIG-003 UNDEFINED) | yes |

**Result: PASS — 8/8 diagnoses traced to originating conditions and supporting signals**

---

## Check 5 — Diagnosis Coverage Propagation Correctness

Condition coverage state must propagate to diagnosis activation state without modification. No diagnosis may be elevated above its originating condition.

| Diagnosis | Originating Condition | Condition State | Expected Diagnosis State | Declared Diagnosis State | Correct |
|---|---|---|---|---|---|
| DIAG-001 | COND-001 | complete | active | active | yes |
| DIAG-002 | COND-002 | complete | active | active | yes |
| DIAG-003 | COND-003 | partial | partial | partial | yes |
| DIAG-004 | COND-004 | partial | partial | partial | yes |
| DIAG-005 | COND-005 | blocked | blocked | blocked | yes |
| DIAG-006 | COND-006 | blocked | blocked | blocked | yes |
| DIAG-007 | COND-007 | partial | partial | partial | yes |
| DIAG-008 | COND-008 | partial | partial | partial | yes |

**Result: PASS — 8/8 diagnoses correctly propagate condition coverage states**

---

## Check 6 — Boundary Compliance

| Prohibition | Status |
|---|---|
| No telemetry generation | Compliant — no telemetry produced |
| No signal generation | Compliant — no signal artifacts produced |
| No modification of 40.5 artifacts | Compliant — 40.5 artifacts read-only |
| No direct access to 40.4, 40.3, 40.2 artifacts | Compliant — not accessed |
| No threshold evaluation | Compliant — threshold authority declared as Stream 75.1 |
| No root cause attribution | Compliant — root cause authority declared as Stream 75.2 |
| No narrative generation | Compliant — no narrative text in condition or diagnosis outputs |
| No fabricated activation state | Compliant — no activation state elevated above available condition/signal coverage |
| No UNDEFINED rendered as 0 | Compliant — all UNDEFINED values preserved as UNDEFINED |
| No signal recomputation | Compliant — all signal values carried unmodified from 40.5 run_02_ce_validation |
| No condition recomputation | Compliant — all condition values carried unmodified from condition_output_set.md |
| Output isolated to runs/ | Compliant — all output written to runs/pios/40.6/run_01_condition_activation/ |
| docs/ not written | Compliant — no docs/ artifact modified |

**Result: PASS — all boundary constraints satisfied**

---

## Scope Extension Note

| Observation | Type | Disposition |
|---|---|---|
| Contract PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1 includes diagnosis WPs (WP5–WP7) | SCOPE-EXTENSION | Noted — canonical docs/pios/40.6/condition_boundary_enforcement.md declares diagnosis as Stream 75.2 authority. Contract governs this run. Diagnosis artifacts produced as limited coverage activation records only — no root cause attribution performed. GC-07 enforced. |

---

## Validation Summary

| Check | Result |
|---|---|
| GH-03 I2 Pre-Check (8/8 handoff checks) | PASS |
| 1. Completeness — 9/9 artifacts present | PASS |
| 2. Condition traceability — 8/8 conditions fully traced | PASS |
| 3. Coverage propagation correctness — 8/8 conditions | PASS |
| 4. Diagnosis traceability — 8/8 diagnoses traced | PASS |
| 5. Diagnosis coverage propagation — 8/8 diagnoses | PASS |
| 6. Boundary compliance — all prohibitions satisfied | PASS |

**Final validation status: PASS — all checks pass**

---

## Condition and Diagnosis Coverage Status

| Category | Count | IDs |
|---|---|---|
| Conditions complete / diagnoses active | 2 | COND-001/DIAG-001, COND-002/DIAG-002 |
| Conditions partial / diagnoses partial | 4 | COND-003/DIAG-003, COND-004/DIAG-004, COND-007/DIAG-007, COND-008/DIAG-008 |
| Conditions blocked / diagnoses blocked | 2 | COND-005/DIAG-005, COND-006/DIAG-006 |

**Governance note:** Evidence-First Principle (GC-06) governs this outcome. State–Diagnosis Separation Principle (GC-07) governs content boundaries. Missing runtime telemetry blocks condition and diagnosis activation exactly as it blocked signal computation in 40.5. No values fabricated or inferred. Final execution status: PARTIAL.

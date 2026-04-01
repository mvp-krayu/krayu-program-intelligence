# Diagnosis Output Set

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_artifact:** runs/pios/40.6/run_01_condition_activation/condition_output_set.md
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Output Rule

This document records diagnosis activation outputs for run_01_condition_activation. All condition values are carried forward exactly from condition_output_set.md (this run) — no recomputation, no modification. Diagnosis activation states are derived exclusively from condition coverage propagation. No root cause attribution. No threshold evaluation. No interpretation.

---

## Active Diagnoses

### DIAG-001 — Dependency Load Elevation

| Field | Value |
|---|---|
| diagnosis_id | DIAG-001 |
| canonical_name | Dependency Load Elevation |
| originating_condition | COND-001 |
| supporting_signals | SIG-002 Dependency Load |
| condition_coverage_state | complete |
| diagnosis_activation_state | **active** |

**Condition values (carried from condition_output_set.md, unmodified):**

| Component | Value |
|---|---|
| Dependency Load ratio | 0.682 |
| Dependency edge count | 15 |

---

### DIAG-002 — Structural Volatility State

| Field | Value |
|---|---|
| diagnosis_id | DIAG-002 |
| canonical_name | Structural Volatility State |
| originating_condition | COND-002 |
| supporting_signals | SIG-004 Structural Volatility |
| condition_coverage_state | complete |
| diagnosis_activation_state | **active** |

**Condition values (carried from condition_output_set.md, unmodified):**

| Component | Value |
|---|---|
| Total edge density | 1.273 |
| Containment density | 0.545 |
| Responsibility density | 0.364 |
| Module density | 0.455 |

---

## Partial Diagnoses

### DIAG-003 — Coordination Pressure Active

| Field | Value |
|---|---|
| diagnosis_id | DIAG-003 |
| canonical_name | Coordination Pressure Active |
| originating_condition | COND-003 |
| supporting_signals | SIG-001 Coordination Pressure |
| condition_coverage_state | partial |
| diagnosis_activation_state | **partial — structural component active; runtime component UNDEFINED** |

**Condition values (carried from condition_output_set.md, unmodified):**

| Component | Value | Contribution |
|---|---|---|
| Structural ratio (SIG-001 static) | 0.875 | active |
| Runtime gate component (AT-007) | UNDEFINED | blocked |

---

### DIAG-004 — Throughput Degradation Risk

| Field | Value |
|---|---|
| diagnosis_id | DIAG-004 |
| canonical_name | Throughput Degradation Risk |
| originating_condition | COND-004 |
| supporting_signals | SIG-005 Execution Throughput |
| condition_coverage_state | partial |
| diagnosis_activation_state | **partial — throughput rate active; completion factor UNDEFINED** |

**Condition values (carried from condition_output_set.md, unmodified):**

| Component | Value | Contribution |
|---|---|---|
| Throughput rate (artifacts/stage) | 1.125 | active |
| Completion factor (DT-007) | UNDEFINED | blocked |

---

### DIAG-007 — Execution Health Deficit

| Field | Value |
|---|---|
| diagnosis_id | DIAG-007 |
| canonical_name | Execution Health Deficit |
| originating_condition | COND-007 |
| supporting_signals | SIG-007 ESI (SIG-002 component active; SIG-005, SIG-006 UNDEFINED) |
| condition_coverage_state | partial |
| diagnosis_activation_state | **partial — SIG-002 component active; SIG-005 completion and SIG-006 UNDEFINED** |

**Condition values (carried from condition_output_set.md, unmodified):**

| Component | Value | Contribution |
|---|---|---|
| SIG-002 (Dependency Load) component | 0.682 | active |
| SIG-005 (Execution Throughput) completion | UNDEFINED | blocked |
| SIG-006 (Execution Stability) | UNDEFINED | blocked |

---

### DIAG-008 — Risk Acceleration State

| Field | Value |
|---|---|
| diagnosis_id | DIAG-008 |
| canonical_name | Risk Acceleration State |
| originating_condition | COND-008 |
| supporting_signals | SIG-008 RAG (SIG-001 and SIG-004 active; SIG-003 UNDEFINED) |
| condition_coverage_state | partial |
| diagnosis_activation_state | **partial — SIG-001 and SIG-004 components active; SIG-003 UNDEFINED** |

**Condition values (carried from condition_output_set.md, unmodified):**

| Component | Value | Contribution |
|---|---|---|
| SIG-001 structural ratio | 0.875 | active |
| SIG-004 total edge density | 1.273 | active |
| SIG-004 containment density | 0.545 | active |
| SIG-004 responsibility density | 0.364 | active |
| SIG-004 module density | 0.455 | active |
| SIG-003 (Change Concentration) | UNDEFINED | blocked |

---

## Blocked Diagnoses

| Diagnosis | Canonical Name | Originating Condition | Condition State | Blocking Origin |
|---|---|---|---|---|
| DIAG-005 | Change Concentration Accumulation | COND-005 | blocked | SIG-003 BLOCKED — AT-001, AT-002 time-series absent from static telemetry |
| DIAG-006 | Execution Instability | COND-006 | blocked | SIG-006 BLOCKED — AT-007, AT-009, DT-007, DT-008 event-based; live pipeline required |

---

## Coverage Summary

| Category | Count | Diagnosis IDs |
|---|---|---|
| Active | 2 | DIAG-001, DIAG-002 |
| Partial | 4 | DIAG-003, DIAG-004, DIAG-007, DIAG-008 |
| Blocked | 2 | DIAG-005, DIAG-006 |

---

## Governance Lock

| Principle | Application |
|---|---|
| Evidence-First (GC-06) | All UNDEFINED condition components propagate as UNDEFINED — no fabrication |
| State–Diagnosis Separation (GC-07) | Diagnoses are coverage activation records only — no root cause attribution, no threshold evaluation |
| No condition recomputation | All values carried from condition_output_set.md; no new computation |
| No fabrication | Blocked/UNDEFINED diagnoses carry no estimated activation state |
| Root cause authority | Stream 75.2 — Program Diagnosis Model |
| Threshold authority | Stream 75.1 — Program Condition Model |

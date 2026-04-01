# Condition Output Set

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_02_ce_validation (Stream 40.5)
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Output Rule

This document records condition activation outputs for run_01_condition_activation. All signal values are carried forward exactly from 40.5 run_02_ce_validation — no recomputation, no modification. Condition states are derived exclusively from signal coverage propagation. No threshold evaluation. No interpretation.

---

## Complete Conditions

### COND-001 — Dependency Load Elevation

| Field | Value |
|---|---|
| condition_id | COND-001 |
| canonical_name | Dependency Load Elevation |
| ckr_ref | CKR-012 |
| governing_signal | SIG-002 Dependency Load |
| signal_state | COMPLETE |
| condition_coverage_state | **complete** |
| activation_state | **activated** |

**Signal values (carried from 40.5, unmodified):**

| Signal Component | Value |
|---|---|
| Dependency Load ratio | 0.682 |
| Dependency edge count | 15 |

---

### COND-002 — Structural Volatility State

| Field | Value |
|---|---|
| condition_id | COND-002 |
| canonical_name | Structural Volatility State |
| ckr_ref | CKR-012 |
| governing_signal | SIG-004 Structural Volatility |
| signal_state | COMPLETE |
| condition_coverage_state | **complete** |
| activation_state | **activated** |

**Signal values (carried from 40.5, unmodified):**

| Signal Component | Value |
|---|---|
| Total edge density (ST-010/ST-007) | 1.273 |
| Containment density (ST-011/ST-007) | 0.545 |
| Responsibility density (ST-006/ST-007) | 0.364 |
| Module density (ST-009/ST-007) | 0.455 |

---

## Partial Conditions

### COND-003 — Coordination Pressure Active

| Field | Value |
|---|---|
| condition_id | COND-003 |
| canonical_name | Coordination Pressure Active |
| ckr_ref | CKR-012 |
| governing_signal | SIG-001 Coordination Pressure |
| signal_state | PARTIAL |
| condition_coverage_state | **partial** |
| activation_state | **partial — structural component activated; runtime component UNDEFINED** |

**Signal values (carried from 40.5, unmodified):**

| Signal Component | Value | Activation |
|---|---|---|
| Structural ratio (ST-012/ST-016) | 0.875 | active |
| Runtime gate component (AT-007) | UNDEFINED | blocked |

---

### COND-004 — Throughput Degradation Risk

| Field | Value |
|---|---|
| condition_id | COND-004 |
| canonical_name | Throughput Degradation Risk |
| ckr_ref | CKR-012 |
| governing_signal | SIG-005 Execution Throughput |
| signal_state | PARTIAL |
| condition_coverage_state | **partial** |
| activation_state | **partial — throughput rate activated; completion factor UNDEFINED** |

**Signal values (carried from 40.5, unmodified):**

| Signal Component | Value | Activation |
|---|---|---|
| Throughput rate (artifacts/stage) | 1.125 | active |
| Completion factor (DT-007) | UNDEFINED | blocked |

---

### COND-007 — Execution Health Deficit

| Field | Value |
|---|---|
| condition_id | COND-007 |
| canonical_name | Execution Health Deficit |
| ckr_ref | CKR-012 |
| governing_signal | SIG-007 ESI |
| signal_state | PARTIAL |
| condition_coverage_state | **partial** |
| activation_state | **partial — SIG-002 component activated; SIG-005 and SIG-006 components UNDEFINED** |

**Signal values (carried from 40.5, unmodified):**

| Signal Component | Value | Activation |
|---|---|---|
| SIG-002 (Dependency Load) component | 0.682 | active |
| SIG-005 completion factor | UNDEFINED | blocked |
| SIG-006 (Execution Stability) | UNDEFINED | blocked |

---

### COND-008 — Risk Acceleration State

| Field | Value |
|---|---|
| condition_id | COND-008 |
| canonical_name | Risk Acceleration State |
| ckr_ref | CKR-012 |
| governing_signal | SIG-008 RAG |
| signal_state | PARTIAL |
| condition_coverage_state | **partial** |
| activation_state | **partial — SIG-001 and SIG-004 components activated; SIG-003 component UNDEFINED** |

**Signal values (carried from 40.5, unmodified):**

| Signal Component | Value | Activation |
|---|---|---|
| SIG-001 structural ratio | 0.875 | active |
| SIG-004 total edge density | 1.273 | active |
| SIG-004 containment density | 0.545 | active |
| SIG-004 responsibility density | 0.364 | active |
| SIG-004 module density | 0.455 | active |
| SIG-003 (Change Concentration) | UNDEFINED | blocked |

---

## Blocked Conditions

| Condition | Canonical Name | Governing Signal | Signal State | Blocking Input |
|---|---|---|---|---|
| COND-005 | Change Concentration Accumulation | SIG-003 | BLOCKED | AT-001, AT-002 (time-series; push-to-main event counts absent from static telemetry) |
| COND-006 | Execution Instability | SIG-006 | BLOCKED | AT-007, AT-009, DT-007, DT-008 (all event-based; live pipeline required) |

---

## Coverage Summary

| Category | Count | Condition IDs |
|---|---|---|
| Complete | 2 | COND-001, COND-002 |
| Partial | 4 | COND-003, COND-004, COND-007, COND-008 |
| Blocked | 2 | COND-005, COND-006 |

---

## Governance Lock

| Principle | Application |
|---|---|
| Evidence-First (GC-06) | All UNDEFINED signal components propagate as UNDEFINED — no fabrication |
| State–Diagnosis Separation (GC-07) | Conditions are coverage states only — no threshold evaluation, no diagnosis |
| No signal recomputation | All values carried from 40.5 run_02_ce_validation; no new computation |
| No fabrication | Blocked/UNDEFINED conditions carry no estimated activation state |
| Threshold authority | Stream 75.1 — Program Condition Model |

# Condition Activation Specification

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_02_ce_validation (Stream 40.5)
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Governing Authority

Condition activation logic is governed by Stream 75.1 — Program Condition Model (M-07). This stream activates condition coverage states using signal state propagation rules only. Threshold evaluation is Stream 75.1's exclusive authority and is not performed here.

Canonical condition schema source: docs/pios/40.6/condition_validation_report.md (baseline)

---

## Coverage State Propagation Rules

| Signal State | Condition Coverage State | Activation Rule |
|---|---|---|
| COMPLETE | complete | Signal value(s) present; condition is activated with full signal |
| PARTIAL | partial | Resolved signal component(s) activate condition partially; UNDEFINED components produce no activation |
| BLOCKED | blocked | Signal is UNDEFINED; condition produces no activation state |

No condition may be elevated above its governing signal state. No fabrication. No inference.

---

## COND-001 — Dependency Load Elevation

| Field | Value |
|---|---|
| condition_id | COND-001 |
| canonical_name | Dependency Load Elevation |
| ckr_ref | CKR-012 |
| governing_signal | SIG-002 Dependency Load |
| cvar_input | CVAR_002 |
| signal_state | COMPLETE |
| condition_coverage_state | **complete** |

**Activation rule:** Signal SIG-002 is COMPLETE. Condition coverage state = complete. Signal value carried forward: ratio = 0.682; dependency edge count = 15. No threshold evaluation — Stream 75.1 authority.

---

## COND-002 — Structural Volatility State

| Field | Value |
|---|---|
| condition_id | COND-002 |
| canonical_name | Structural Volatility State |
| ckr_ref | CKR-012 |
| governing_signal | SIG-004 Structural Volatility |
| cvar_input | CVAR_004 |
| signal_state | COMPLETE |
| condition_coverage_state | **complete** |

**Activation rule:** Signal SIG-004 is COMPLETE. Condition coverage state = complete. Signal values carried forward: total edge density = 1.273; containment density = 0.545; responsibility density = 0.364; module density = 0.455. No threshold evaluation — Stream 75.1 authority.

---

## COND-003 — Coordination Pressure Active

| Field | Value |
|---|---|
| condition_id | COND-003 |
| canonical_name | Coordination Pressure Active |
| ckr_ref | CKR-012 |
| governing_signal | SIG-001 Coordination Pressure |
| cvar_input | CVAR_001 |
| signal_state | PARTIAL |
| condition_coverage_state | **partial** |

**Activation rule:** Signal SIG-001 is PARTIAL. Static structural component (0.875) is resolved. Runtime component is UNDEFINED. Condition activates on resolved component only. Runtime component carries UNDEFINED state — not fabricated.

| Component | Signal Source | Value | Activation |
|---|---|---|---|
| Structural ratio component | SIG-001 static (ST-012/ST-016) | 0.875 | active |
| Runtime gate component | SIG-001 runtime (AT-007) | UNDEFINED | blocked |

---

## COND-004 — Throughput Degradation Risk

| Field | Value |
|---|---|
| condition_id | COND-004 |
| canonical_name | Throughput Degradation Risk |
| ckr_ref | CKR-012 |
| governing_signal | SIG-005 Execution Throughput |
| cvar_input | CVAR_005 |
| signal_state | PARTIAL |
| condition_coverage_state | **partial** |

**Activation rule:** Signal SIG-005 is PARTIAL. Static constants (throughput rate = 1.125 artifacts/stage) are resolved. Completion factor (DT-007) is UNDEFINED. Condition activates on resolved component only.

| Component | Signal Source | Value | Activation |
|---|---|---|---|
| Throughput rate (artifacts/stage) | SIG-005 static (AT-005, DT-001, DT-003) | 1.125 | active |
| Completion factor | SIG-005 runtime (DT-007) | UNDEFINED | blocked |

---

## COND-005 — Change Concentration Accumulation

| Field | Value |
|---|---|
| condition_id | COND-005 |
| canonical_name | Change Concentration Accumulation |
| ckr_ref | CKR-012 |
| governing_signal | SIG-003 Change Concentration |
| cvar_input | CVAR_003 |
| signal_state | BLOCKED |
| condition_coverage_state | **blocked** |

**Activation rule:** Signal SIG-003 is BLOCKED. No condition activation. Blocking input: AT-001 and AT-002 time-series (push-to-main event counts across successive intervals) absent from 40.5 run_02_ce_validation outputs.

---

## COND-006 — Execution Instability

| Field | Value |
|---|---|
| condition_id | COND-006 |
| canonical_name | Execution Instability |
| ckr_ref | CKR-012 |
| governing_signal | SIG-006 Execution Stability |
| cvar_input | CVAR_006 |
| signal_state | BLOCKED |
| condition_coverage_state | **blocked** |

**Activation rule:** Signal SIG-006 is BLOCKED. No condition activation. All inputs (AT-007, AT-009, DT-007, DT-008) require live pipeline execution.

---

## COND-007 — Execution Health Deficit

| Field | Value |
|---|---|
| condition_id | COND-007 |
| canonical_name | Execution Health Deficit |
| ckr_ref | CKR-012 |
| governing_signal | SIG-007 ESI |
| cvar_input | CVAR_007 |
| signal_state | PARTIAL |
| condition_coverage_state | **partial** |

**Activation rule:** Signal SIG-007 is PARTIAL. SIG-002 component (Dependency Load = 0.682) is resolved. SIG-005 completion factor and SIG-006 are UNDEFINED. Condition activates on SIG-002 component only.

| Component | Signal Source | Value | Activation |
|---|---|---|---|
| SIG-002 (Dependency Load) component | ESI composite | 0.682 | active |
| SIG-005 (Execution Throughput) completion component | ESI composite | UNDEFINED | blocked |
| SIG-006 (Execution Stability) component | ESI composite | UNDEFINED | blocked |

---

## COND-008 — Risk Acceleration State

| Field | Value |
|---|---|
| condition_id | COND-008 |
| canonical_name | Risk Acceleration State |
| ckr_ref | CKR-012 |
| governing_signal | SIG-008 RAG |
| cvar_input | CVAR_008 |
| signal_state | PARTIAL |
| condition_coverage_state | **partial** |

**Activation rule:** Signal SIG-008 is PARTIAL. SIG-001 structural component (0.875) and SIG-004 volatility ratios (1.273/0.545/0.364/0.455) are resolved. SIG-003 (Change Concentration) is BLOCKED. RAG accumulation component is UNDEFINED.

| Component | Signal Source | Value | Activation |
|---|---|---|---|
| SIG-001 structural ratio component | RAG composite | 0.875 | active |
| SIG-004 total edge density | RAG composite | 1.273 | active |
| SIG-004 containment density | RAG composite | 0.545 | active |
| SIG-004 responsibility density | RAG composite | 0.364 | active |
| SIG-004 module density | RAG composite | 0.455 | active |
| SIG-003 (Change Concentration) component | RAG composite | UNDEFINED | blocked |

---

## Coverage Summary

| Condition | Canonical Name | Signal | Signal State | Condition State |
|---|---|---|---|---|
| COND-001 | Dependency Load Elevation | SIG-002 | COMPLETE | **complete** |
| COND-002 | Structural Volatility State | SIG-004 | COMPLETE | **complete** |
| COND-003 | Coordination Pressure Active | SIG-001 | PARTIAL | **partial** |
| COND-004 | Throughput Degradation Risk | SIG-005 | PARTIAL | **partial** |
| COND-005 | Change Concentration Accumulation | SIG-003 | BLOCKED | **blocked** |
| COND-006 | Execution Instability | SIG-006 | BLOCKED | **blocked** |
| COND-007 | Execution Health Deficit | SIG-007 | PARTIAL | **partial** |
| COND-008 | Risk Acceleration State | SIG-008 | PARTIAL | **partial** |

**COMPLETE: 2 (COND-001, COND-002)**
**PARTIAL: 4 (COND-003, COND-004, COND-007, COND-008)**
**BLOCKED: 2 (COND-005, COND-006)**

Governance note: State–Diagnosis Separation (GC-07) enforced. Conditions are observational coverage states only. No threshold evaluation performed.

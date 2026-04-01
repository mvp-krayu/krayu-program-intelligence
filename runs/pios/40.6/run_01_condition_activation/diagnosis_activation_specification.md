# Diagnosis Activation Specification

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_artifact:** runs/pios/40.6/run_01_condition_activation/condition_output_set.md
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Governing Authority

Diagnosis activation logic is governed by Stream 75.2 — Program Diagnosis Model. This stream activates diagnosis coverage states using condition state propagation rules only. No root cause attribution. No semantic enrichment. No narrative expansion. No threshold evaluation.

Diagnosis entries are deterministic structural records only — each entry states which condition(s) originated it and what coverage state those conditions carry. No interpretation is added.

---

## Coverage State Propagation Rules

| Condition Coverage State | Diagnosis Activation State | Activation Rule |
|---|---|---|
| complete | active | Condition fully activated; diagnosis entry activated with full condition basis |
| partial | partial | Resolved condition component(s) present; UNDEFINED components produce no diagnosis contribution |
| blocked | blocked | Condition not activated; diagnosis entry produces no activation |

No diagnosis activation state may exceed its originating condition coverage state. No fabrication. No inference.

---

## DIAG-001 — Dependency Load Elevation Diagnosis

| Field | Value |
|---|---|
| diagnosis_id | DIAG-001 |
| canonical_name | Dependency Load Elevation |
| dvar_input | DVAR_001 |
| originating_condition | COND-001 Dependency Load Elevation |
| condition_coverage_state | complete |
| diagnosis_activation_state | **active** |

**Activation rule:** COND-001 is complete. Diagnosis entry activated. Condition values carried: ratio = 0.682; dependency edge count = 15. No root cause attribution — Stream 75.2 authority.

| Component | Value | Diagnosis Contribution |
|---|---|---|
| Dependency Load ratio (SIG-002) | 0.682 | active |
| Dependency edge count (SIG-002) | 15 | active |

---

## DIAG-002 — Structural Volatility Diagnosis

| Field | Value |
|---|---|
| diagnosis_id | DIAG-002 |
| canonical_name | Structural Volatility State |
| dvar_input | DVAR_002 |
| originating_condition | COND-002 Structural Volatility State |
| condition_coverage_state | complete |
| diagnosis_activation_state | **active** |

**Activation rule:** COND-002 is complete. Diagnosis entry activated. Condition values carried: total edge density = 1.273; containment density = 0.545; responsibility density = 0.364; module density = 0.455. No root cause attribution — Stream 75.2 authority.

| Component | Value | Diagnosis Contribution |
|---|---|---|
| Total edge density (SIG-004) | 1.273 | active |
| Containment density (SIG-004) | 0.545 | active |
| Responsibility density (SIG-004) | 0.364 | active |
| Module density (SIG-004) | 0.455 | active |

---

## DIAG-003 — Coordination Pressure Diagnosis

| Field | Value |
|---|---|
| diagnosis_id | DIAG-003 |
| canonical_name | Coordination Pressure Active |
| dvar_input | DVAR_003 |
| originating_condition | COND-003 Coordination Pressure Active |
| condition_coverage_state | partial |
| diagnosis_activation_state | **partial — structural component active; runtime component UNDEFINED** |

**Activation rule:** COND-003 is partial. Structural component (0.875) activates partial diagnosis entry. Runtime component is UNDEFINED — no contribution. No root cause attribution — Stream 75.2 authority.

| Component | Value | Diagnosis Contribution |
|---|---|---|
| Structural ratio (SIG-001 static) | 0.875 | active |
| Runtime gate component (SIG-001 runtime / AT-007) | UNDEFINED | blocked |

---

## DIAG-004 — Throughput Degradation Diagnosis

| Field | Value |
|---|---|
| diagnosis_id | DIAG-004 |
| canonical_name | Throughput Degradation Risk |
| dvar_input | DVAR_004 |
| originating_condition | COND-004 Throughput Degradation Risk |
| condition_coverage_state | partial |
| diagnosis_activation_state | **partial — throughput rate active; completion factor UNDEFINED** |

**Activation rule:** COND-004 is partial. Throughput rate component (1.125) activates partial diagnosis entry. Completion factor is UNDEFINED — no contribution. No root cause attribution — Stream 75.2 authority.

| Component | Value | Diagnosis Contribution |
|---|---|---|
| Throughput rate (SIG-005 static) | 1.125 artifacts/stage | active |
| Completion factor (SIG-005 / DT-007) | UNDEFINED | blocked |

---

## DIAG-005 — Change Concentration Diagnosis

| Field | Value |
|---|---|
| diagnosis_id | DIAG-005 |
| canonical_name | Change Concentration Accumulation |
| dvar_input | DVAR_005 |
| originating_condition | COND-005 Change Concentration Accumulation |
| condition_coverage_state | blocked |
| diagnosis_activation_state | **blocked** |

**Activation rule:** COND-005 is blocked. No diagnosis activation. Blocking origin: SIG-003 BLOCKED — AT-001, AT-002 time-series absent from static telemetry. No root cause attribution — Stream 75.2 authority.

---

## DIAG-006 — Execution Instability Diagnosis

| Field | Value |
|---|---|
| diagnosis_id | DIAG-006 |
| canonical_name | Execution Instability |
| dvar_input | DVAR_006 |
| originating_condition | COND-006 Execution Instability |
| condition_coverage_state | blocked |
| diagnosis_activation_state | **blocked** |

**Activation rule:** COND-006 is blocked. No diagnosis activation. Blocking origin: SIG-006 BLOCKED — AT-007, AT-009, DT-007, DT-008 all event-based; live pipeline required. No root cause attribution — Stream 75.2 authority.

---

## DIAG-007 — Execution Health Deficit Diagnosis

| Field | Value |
|---|---|
| diagnosis_id | DIAG-007 |
| canonical_name | Execution Health Deficit |
| dvar_input | DVAR_007 |
| originating_condition | COND-007 Execution Health Deficit |
| condition_coverage_state | partial |
| diagnosis_activation_state | **partial — SIG-002 component active; SIG-005 completion and SIG-006 UNDEFINED** |

**Activation rule:** COND-007 is partial. SIG-002 component (0.682) activates partial diagnosis entry. SIG-005 completion component and SIG-006 are UNDEFINED — no contribution. No root cause attribution — Stream 75.2 authority.

| Component | Value | Diagnosis Contribution |
|---|---|---|
| SIG-002 (Dependency Load) component | 0.682 | active |
| SIG-005 (Execution Throughput) completion | UNDEFINED | blocked |
| SIG-006 (Execution Stability) | UNDEFINED | blocked |

---

## DIAG-008 — Risk Acceleration Diagnosis

| Field | Value |
|---|---|
| diagnosis_id | DIAG-008 |
| canonical_name | Risk Acceleration State |
| dvar_input | DVAR_008 |
| originating_condition | COND-008 Risk Acceleration State |
| condition_coverage_state | partial |
| diagnosis_activation_state | **partial — SIG-001 and SIG-004 components active; SIG-003 UNDEFINED** |

**Activation rule:** COND-008 is partial. SIG-001 structural component (0.875) and SIG-004 ratios (1.273/0.545/0.364/0.455) activate partial diagnosis entry. SIG-003 (Change Concentration) is BLOCKED — no contribution. No root cause attribution — Stream 75.2 authority.

| Component | Value | Diagnosis Contribution |
|---|---|---|
| SIG-001 structural ratio | 0.875 | active |
| SIG-004 total edge density | 1.273 | active |
| SIG-004 containment density | 0.545 | active |
| SIG-004 responsibility density | 0.364 | active |
| SIG-004 module density | 0.455 | active |
| SIG-003 (Change Concentration) | UNDEFINED | blocked |

---

## Diagnosis Coverage Summary

| Diagnosis | Canonical Name | Originating Condition | Condition State | Diagnosis State |
|---|---|---|---|---|
| DIAG-001 | Dependency Load Elevation | COND-001 | complete | **active** |
| DIAG-002 | Structural Volatility State | COND-002 | complete | **active** |
| DIAG-003 | Coordination Pressure Active | COND-003 | partial | **partial** |
| DIAG-004 | Throughput Degradation Risk | COND-004 | partial | **partial** |
| DIAG-005 | Change Concentration Accumulation | COND-005 | blocked | **blocked** |
| DIAG-006 | Execution Instability | COND-006 | blocked | **blocked** |
| DIAG-007 | Execution Health Deficit | COND-007 | partial | **partial** |
| DIAG-008 | Risk Acceleration State | COND-008 | partial | **partial** |

**ACTIVE: 2 (DIAG-001, DIAG-002)**
**PARTIAL: 4 (DIAG-003, DIAG-004, DIAG-007, DIAG-008)**
**BLOCKED: 2 (DIAG-005, DIAG-006)**

Governance note: State–Diagnosis Separation (GC-07) enforced. Diagnosis entries are coverage activation records only — no root cause attribution, no threshold evaluation, no narrative enrichment. Root cause authority: Stream 75.2.

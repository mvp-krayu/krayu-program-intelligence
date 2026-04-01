# Diagnosis Input Matrix

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_artifact:** runs/pios/40.6/run_01_condition_activation/condition_output_set.md
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Input Boundary Declaration

All diagnosis inputs sourced exclusively from condition_output_set.md (this run). No upstream 40.5 signal artifacts accessed directly. No 40.4 artifacts accessed. No 41.x / 42.x paths accessed. Diagnosis is derived from conditions — never from signals or telemetry directly.

| Artifact | Path | Access Type | Status |
|---|---|---|---|
| condition_output_set.md | runs/pios/40.6/run_01_condition_activation/ | read | Consumed |

---

## Condition State Inventory (from condition_output_set.md, this run)

Condition states are inherited exactly as produced by run_01_condition_activation condition layer. No modification.

| Condition ID | Canonical Name | Coverage State | Active Component(s) |
|---|---|---|---|
| COND-001 | Dependency Load Elevation | complete | ratio: 0.682; edge count: 15 |
| COND-002 | Structural Volatility State | complete | 1.273 / 0.545 / 0.364 / 0.455 |
| COND-003 | Coordination Pressure Active | partial | structural ratio: 0.875; runtime: UNDEFINED |
| COND-004 | Throughput Degradation Risk | partial | throughput rate: 1.125; completion factor: UNDEFINED |
| COND-005 | Change Concentration Accumulation | blocked | UNDEFINED |
| COND-006 | Execution Instability | blocked | UNDEFINED |
| COND-007 | Execution Health Deficit | partial | SIG-002 component: 0.682; others: UNDEFINED |
| COND-008 | Risk Acceleration State | partial | SIG-001: 0.875; SIG-004 ratios active; SIG-003: UNDEFINED |

---

## Diagnosis Input Variables (DVAR_)

Each DVAR_ maps one condition to one diagnosis entry. Condition coverage state is inherited without modification.

| DVAR | Condition | Condition State | Diagnosis Entry |
|---|---|---|---|
| DVAR_001 | COND-001 Dependency Load Elevation | complete | DIAG-001 |
| DVAR_002 | COND-002 Structural Volatility State | complete | DIAG-002 |
| DVAR_003 | COND-003 Coordination Pressure Active | partial | DIAG-003 |
| DVAR_004 | COND-004 Throughput Degradation Risk | partial | DIAG-004 |
| DVAR_005 | COND-005 Change Concentration Accumulation | blocked | DIAG-005 |
| DVAR_006 | COND-006 Execution Instability | blocked | DIAG-006 |
| DVAR_007 | COND-007 Execution Health Deficit | partial | DIAG-007 |
| DVAR_008 | COND-008 Risk Acceleration State | partial | DIAG-008 |

---

## Coverage Propagation Rule (Condition → Diagnosis)

Condition coverage state propagates to diagnosis activation state:

| Condition Coverage State | Diagnosis Activation State |
|---|---|
| complete | active — full condition basis available |
| partial | partial — resolved condition component(s) only |
| blocked | blocked — no diagnosis activation |

No diagnosis activation state may exceed its originating condition coverage state. No fabricated or inferred diagnosis. PARTIAL diagnoses carry only the condition components present. UNDEFINED components remain UNDEFINED in diagnosis output.

---

## DVAR Summary

| DVAR | Condition | Condition State | Expected Diagnosis State |
|---|---|---|---|
| DVAR_001 | COND-001 | complete | active |
| DVAR_002 | COND-002 | complete | active |
| DVAR_003 | COND-003 | partial | partial |
| DVAR_004 | COND-004 | partial | partial |
| DVAR_005 | COND-005 | blocked | blocked |
| DVAR_006 | COND-006 | blocked | blocked |
| DVAR_007 | COND-007 | partial | partial |
| DVAR_008 | COND-008 | partial | partial |

**Active (complete): 2 — DVAR_001, DVAR_002**
**Limited (partial): 4 — DVAR_003, DVAR_004, DVAR_007, DVAR_008**
**Blocked: 2 — DVAR_005, DVAR_006**

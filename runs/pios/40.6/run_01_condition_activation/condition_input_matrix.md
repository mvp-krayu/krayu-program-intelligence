# Condition Input Matrix

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_02_ce_validation (Stream 40.5)
**upstream_path:** runs/pios/40.5/run_02_ce_validation/
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Input Boundary Declaration

All inputs sourced exclusively from runs/pios/40.5/run_02_ce_validation/. No 40.4 artifacts accessed directly. No 41.x / 42.x paths accessed.

| Artifact | Path | Access Type | Status |
|---|---|---|---|
| signal_output_set.md | runs/pios/40.5/run_02_ce_validation/ | read | Consumed |
| signal_traceability_map.md | runs/pios/40.5/run_02_ce_validation/ | read | Consumed |
| signal_validation_report.md | runs/pios/40.5/run_02_ce_validation/ | read | Consumed |
| execution_manifest.md | runs/pios/40.5/run_02_ce_validation/ | read | Consumed |

**GH-03 I2 pre-check:** run_id verified (run_02_ce_validation); all PARTIAL flags present; no UNDEFINED rendered as 0; signal values unmodified from 40.5 output.

---

## Signal State Inventory (from 40.5 run_02_ce_validation)

Signal values are inherited exactly as produced by 40.5. No modification.

| Signal ID | Canonical Name | State | Static Value(s) |
|---|---|---|---|
| SIG-001 | Coordination Pressure | PARTIAL | 0.875 (structural); runtime UNDEFINED |
| SIG-002 | Dependency Load | COMPLETE | ratio: 0.682; edge count: 15 |
| SIG-003 | Change Concentration | BLOCKED | UNDEFINED |
| SIG-004 | Structural Volatility | COMPLETE | 1.273 / 0.545 / 0.364 / 0.455 |
| SIG-005 | Execution Throughput | PARTIAL | 1.125 artifacts/stage; completion UNDEFINED |
| SIG-006 | Execution Stability | BLOCKED | UNDEFINED |
| SIG-007 | ESI | PARTIAL | SIG-002 component: 0.682; others UNDEFINED |
| SIG-008 | RAG | PARTIAL | SIG-001: 0.875; SIG-004 ratios resolved; SIG-003 BLOCKED |

---

## Condition Input Variables (CVAR_)

Each CVAR_ maps one governing signal to one condition. Signal state is inherited without modification.

| CVAR | Signal | Signal State | Condition |
|---|---|---|---|
| CVAR_001 | SIG-001 Coordination Pressure | PARTIAL | COND-003 |
| CVAR_002 | SIG-002 Dependency Load | COMPLETE | COND-001 |
| CVAR_003 | SIG-003 Change Concentration | BLOCKED | COND-005 |
| CVAR_004 | SIG-004 Structural Volatility | COMPLETE | COND-002 |
| CVAR_005 | SIG-005 Execution Throughput | PARTIAL | COND-004 |
| CVAR_006 | SIG-006 Execution Stability | BLOCKED | COND-006 |
| CVAR_007 | SIG-007 ESI | PARTIAL | COND-007 |
| CVAR_008 | SIG-008 RAG | PARTIAL | COND-008 |

---

## Coverage Propagation Rule

Signal state propagates to condition coverage state:

| Signal State | Condition Coverage State |
|---|---|
| COMPLETE | complete — full condition activation |
| PARTIAL | partial — limited activation from resolved component(s) only |
| BLOCKED | blocked — no condition activation |

No condition coverage state may exceed its governing signal state. No fabricated or inferred activation. PARTIAL conditions carry only the values present in the resolved signal component. UNDEFINED components remain UNDEFINED in condition output.

---

## CVAR Summary

| CVAR | Signal | Signal State | Expected Condition State |
|---|---|---|---|
| CVAR_001 | SIG-001 | PARTIAL | partial |
| CVAR_002 | SIG-002 | COMPLETE | complete |
| CVAR_003 | SIG-003 | BLOCKED | blocked |
| CVAR_004 | SIG-004 | COMPLETE | complete |
| CVAR_005 | SIG-005 | PARTIAL | partial |
| CVAR_006 | SIG-006 | BLOCKED | blocked |
| CVAR_007 | SIG-007 | PARTIAL | partial |
| CVAR_008 | SIG-008 | PARTIAL | partial |

**Active (COMPLETE): 2 — CVAR_002, CVAR_004**
**Limited (PARTIAL): 4 — CVAR_001, CVAR_005, CVAR_007, CVAR_008**
**Blocked: 2 — CVAR_003, CVAR_006**

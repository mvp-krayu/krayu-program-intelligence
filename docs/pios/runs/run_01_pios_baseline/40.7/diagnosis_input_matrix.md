# Diagnosis Input Matrix

**Stream:** 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
**Input:** docs/pios/40.6/condition_output_set.md, docs/pios/40.6/condition_traceability_map.md, docs/pios/40.6/condition_validation_report.md, docs/pios/40.6/execution_manifest.md
**Governing model:** Stream 75.2 — Program Diagnosis Model
**Date:** 2026-03-18

---

## Input Rule

Diagnosis in Stream 40.7 is derived exclusively from governed 40.6 condition outputs. No signal artifact is directly accessed. No telemetry artifact is directly referenced. Every diagnosis maps to one or more governed conditions. Condition coverage states propagate to diagnosis coverage states without modification.

---

## Upstream State Summary

**40.6 final_status: PARTIAL**

| Category | Count | Condition IDs |
|---|---|---|
| Evaluable | 2 | COND-001, COND-002 |
| Partial | 4 | COND-003, COND-004, COND-007, COND-008 |
| Blocked | 2 | COND-005, COND-006 |

---

## Diagnosis Model Inputs

### DIAG-001 — Structural Dependency Characterization

| Input Dimension | Condition | Coverage State | Value |
|---|---|---|---|
| Dependency load ratio | COND-001 | evaluable | 0.682 |
| Dependency edge count | COND-001 | evaluable | 15 |
| PEG node count (denominator) | COND-001 (via SIG-002) | evaluable | 22 |
| Edge composition: pipeline | COND-001 (via SIG-002 ST-012) | evaluable | 7 |
| Edge composition: model activation | COND-001 (via SIG-002 ST-013) | evaluable | 3 |
| Edge composition: governance | COND-001 (via SIG-002 ST-014) | evaluable | 2 |
| Edge composition: external constraint | COND-001 (via SIG-002 ST-015) | evaluable | 3 |

**Diagnosis input coverage state: evaluable**
**Governing CKR reference:** CKR-005 (Execution Signals), CKR-007 (Dependency Load via COND-001 chain)

---

### DIAG-002 — Structural Volatility Characterization

| Input Dimension | Condition | Coverage State | Value |
|---|---|---|---|
| Edge-to-node ratio | COND-002 | evaluable | 1.273 |
| Containment density ratio | COND-002 | evaluable | 0.545 |
| Responsibility distribution | COND-002 | evaluable | 0.364 |
| Module surface ratio | COND-002 | evaluable | 0.455 |
| PEG total edges | COND-002 (via SIG-004) | evaluable | 28 |
| PEG total nodes | COND-002 (via SIG-004) | evaluable | 22 |
| ARZ count | COND-002 (via SIG-004) | evaluable | 8 |

**Diagnosis input coverage state: evaluable**
**Governing CKR reference:** CKR-005, CKR-009 (Structural Volatility via COND-002 chain)

---

### DIAG-003 — Coordination Pressure Characterization

| Input Dimension | Condition | Coverage State | Value |
|---|---|---|---|
| Structural coordination ratio | COND-003 | partial | 0.875 (static component) |
| Pipeline stages coordinated | COND-003 (via SIG-001) | partial | 7 of 8 |
| Runtime coordination events per run | COND-003 | partial | pending (AT-005, AT-007) |

**Diagnosis input coverage state: partial**
**Governing CKR reference:** CKR-005, CKR-006 (Coordination Pressure via COND-003 chain)

---

### DIAG-004 — Throughput Profile Characterization

| Input Dimension | Condition | Coverage State | Value |
|---|---|---|---|
| Stage throughput per run | COND-004 | partial | 8 stages/run |
| Total artifacts per run | COND-004 | partial | 9 artifacts/run |
| Internal delivery per run | COND-004 (via SIG-005) | partial | 5 artifacts/run |
| Intelligence output per run | COND-004 (via SIG-005) | partial | 4 artifacts/run |
| Completion factor | COND-004 | partial | pending (DT-007) |
| Execution mode context | COND-004 | partial | pending (AT-006) |

**Diagnosis input coverage state: partial**
**Governing CKR reference:** CKR-005, CKR-010 (Execution Throughput via COND-004 chain)

---

### DIAG-005 — Change Concentration Characterization

| Input Dimension | Condition | Coverage State | Value |
|---|---|---|---|
| Change event rate | COND-005 | blocked | — |
| Per-event concentration | COND-005 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-005 blocked — SIG-003 unavailable (AT-001, AT-002 time-series not in static 40.4 inputs)
**Governing CKR reference:** CKR-005, CKR-008 (Change Concentration via COND-005 chain)

---

### DIAG-006 — Execution Stability Characterization

| Input Dimension | Condition | Coverage State | Value |
|---|---|---|---|
| Per-run stability | COND-006 | blocked | — |
| Gate enforcement rate | COND-006 | blocked | — |
| Feedback closure rate | COND-006 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-006 blocked — SIG-006 unavailable (DT-007, AT-007 event-based telemetry requires live pipeline execution)
**Governing CKR reference:** CKR-005, CKR-011 (Execution Stability via COND-006 chain)

---

### DIAG-007 — Execution Health Index Characterization

| Input Dimension | Condition | Coverage State | Value |
|---|---|---|---|
| ESI — Dependency Load component | COND-007 (via SIG-002) | partial | 0.682 |
| ESI — Execution Throughput component | COND-007 (via SIG-005) | partial | constants: 8 stages, 9 artifacts/run |
| ESI — Execution Stability component | COND-007 (via SIG-006) | partial | blocked |

**Diagnosis input coverage state: partial**
**Governing CKR reference:** CKR-005, CKR-014 (ESI via COND-007 chain)

---

### DIAG-008 — Risk Acceleration Characterization

| Input Dimension | Condition | Coverage State | Value |
|---|---|---|---|
| RAG — Structural Volatility component | COND-008 (via SIG-004) | partial | 1.273/0.545/0.364/0.455 |
| RAG — Coordination Pressure component | COND-008 (via SIG-001) | partial | structural: 0.875 |
| RAG — Change Concentration component | COND-008 (via SIG-003) | partial | blocked |

**Diagnosis input coverage state: partial**
**Governing CKR reference:** CKR-005, CKR-015 (RAG via COND-008 chain)

---

## Coverage State Summary

| Diagnosis ID | Source Condition | Condition State | Diagnosis Input State |
|---|---|---|---|
| DIAG-001 | COND-001 | evaluable | evaluable |
| DIAG-002 | COND-002 | evaluable | evaluable |
| DIAG-003 | COND-003 | partial | partial |
| DIAG-004 | COND-004 | partial | partial |
| DIAG-005 | COND-005 | blocked | blocked |
| DIAG-006 | COND-006 | blocked | blocked |
| DIAG-007 | COND-007 | partial | partial |
| DIAG-008 | COND-008 | partial | partial |

| Category | Count | Diagnosis IDs |
|---|---|---|
| Evaluable | 2 | DIAG-001, DIAG-002 |
| Partial | 4 | DIAG-003, DIAG-004, DIAG-007, DIAG-008 |
| Blocked | 2 | DIAG-005, DIAG-006 |

---

## Blocked and Unknown Condition Space

| Blocked Dimension | Source | Reason | Diagnosis Outcome |
|---|---|---|---|
| Change Concentration | COND-005 → SIG-003 | AT-001, AT-002 time-series telemetry not in static 40.4 inputs | DIAG-005 blocked |
| Execution Instability | COND-006 → SIG-006 | DT-007, AT-007 event-based telemetry requires live pipeline execution | DIAG-006 blocked |

These dimensions represent explicitly unknown program state spaces. They are not absent by design; they are unavailable due to runtime telemetry gaps. They must not be inferred, approximated, or omitted from downstream intelligence artifacts.

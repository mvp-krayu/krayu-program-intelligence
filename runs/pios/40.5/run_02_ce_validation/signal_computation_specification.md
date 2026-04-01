# Signal Computation Specification

**run_id:** run_02_ce_validation
**stream:** Stream 40.5 — PiOS Signal Computation Engine
**contract:** PIOS-40.5-RUN02-CE-VALIDATION-CONTRACT-v1
**upstream_contract:** PIOS-40.4-RUN01-CONTRACT-v1
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Specification Rule

This document defines the computation specification for each governed signal in run_02_ce_validation. The canonical signal schema is:

| Signal ID | Canonical Name | CKR Ref | Authority |
|---|---|---|---|
| SIG-001 | Coordination Pressure | CKR-006 | signal_validation_report.md (run_01 baseline) |
| SIG-002 | Dependency Load | CKR-007 | signal_validation_report.md (run_01 baseline) |
| SIG-003 | Change Concentration | CKR-008 | signal_validation_report.md (run_01 baseline) |
| SIG-004 | Structural Volatility | CKR-009 | signal_validation_report.md (run_01 baseline) |
| SIG-005 | Execution Throughput | CKR-010 | signal_validation_report.md (run_01 baseline) |
| SIG-006 | Execution Stability | CKR-011 | signal_validation_report.md (run_01 baseline) |
| SIG-007 | ESI | CKR-014 | signal_validation_report.md (run_01 baseline) |
| SIG-008 | RAG | CKR-015 | signal_validation_report.md (run_01 baseline) |

No computation produces conditions, diagnoses, or intelligence. All signal values are observational state only.

---

## SIG-001 — Coordination Pressure

| Field | Value |
|---|---|
| Signal ID | SIG-001 |
| Canonical Name | Coordination Pressure |
| CKR Ref | CKR-006 |
| Signal Class | composite (static + event-based) |
| Temporal | static component: static; runtime component: event-based per pipeline run |

**Input Variables:**

| Variable | Source Metric | Value |
|---|---|---|
| VAR_ST_012 | ST-012 (PEG Pipeline Edge Count) | 7 |
| VAR_ST_016 | ST-016 (PiOS Pipeline Stage Count) | 8 |
| VAR_AT_005 | AT-005 (Pipeline Module Execution Count Per Run) | 8 (event-based) |
| VAR_AT_007 | AT-007 (Validation Gate Enforcement Count Per Run) | PENDING |

**Computation Definition:**

- Static structural component = VAR_ST_012 / VAR_ST_016 = 7 / 8 = **0.875**
- Runtime component = VAR_AT_005 (per pipeline run count) × VAR_AT_007 (gate count) → PENDING

**Computation State:** PARTIAL — static structural component computed; runtime component pending live pipeline execution.

---

## SIG-002 — Dependency Load

| Field | Value |
|---|---|
| Signal ID | SIG-002 |
| Canonical Name | Dependency Load |
| CKR Ref | CKR-007 |
| Signal Class | composite (static) |
| Temporal | static |

**Input Variables:**

| Variable | Source Metric | Value |
|---|---|---|
| VAR_ST_007 | ST-007 (PEG Total Node Count) | 22 |
| VAR_ST_012 | ST-012 (PEG Pipeline Edge Count) | 7 |
| VAR_ST_013 | ST-013 (PEG Model Activation Edge Count) | 3 |
| VAR_ST_014 | ST-014 (PEG Governance Edge Count) | 2 |
| VAR_ST_015 | ST-015 (Non-PEG Governance Constraint Count) | 3 |

**Computation Definition:**

- Dependency edge count = VAR_ST_012 + VAR_ST_013 + VAR_ST_014 + VAR_ST_015 = 7 + 3 + 2 + 3 = **15**
- Dependency Load ratio = dependency_edge_count / VAR_ST_007 = 15 / 22 = **0.682** (rounded to 3dp)

**Computation State:** COMPLETE — all inputs are static telemetry values.

---

## SIG-003 — Change Concentration

| Field | Value |
|---|---|
| Signal ID | SIG-003 |
| Canonical Name | Change Concentration |
| CKR Ref | CKR-008 |
| Signal Class | composite (time-series) |
| Temporal | time-series (push-to-main event accumulation) |

**Input Variables:**

| Variable | Source Metric | Value |
|---|---|---|
| VAR_AT_001 | AT-001 (Automation Trigger Frequency) | PENDING — time-series |
| VAR_AT_002 | AT-002 (Auto-Commit Event Frequency) | PENDING — time-series |
| VAR_AT_003 | AT-003 (Script Execution Event Count) | 1 per invocation (partial static) |

**Computation Definition:**

- Requires AT-001 and AT-002 accumulated time-series data across successive intervals.
- AT-003 provides partial context (1 execution per CI invocation) but is insufficient alone.

**Computation State:** BLOCKED — requires AT-001 and AT-002 time-series (GitHub-sourced push-to-main event counts over successive intervals; not present in static 40.4 telemetry).

---

## SIG-004 — Structural Volatility

| Field | Value |
|---|---|
| Signal ID | SIG-004 |
| Canonical Name | Structural Volatility |
| CKR Ref | CKR-009 |
| Signal Class | composite (static) |
| Temporal | static |

**Input Variables:**

| Variable | Source Metric | Value |
|---|---|---|
| VAR_ST_007 | ST-007 (PEG Total Node Count) | 22 |
| VAR_ST_009 | ST-009 (PEG Module Node Count) | 10 |
| VAR_ST_010 | ST-010 (PEG Total Edge Count) | 28 |
| VAR_ST_011 | ST-011 (PEG Containment Edge Count) | 12 |
| VAR_ST_006 | ST-006 (Architectural Responsibility Zone Count) | 8 |

**Computation Definition:**

- Total edge density: VAR_ST_010 / VAR_ST_007 = 28 / 22 = **1.273**
- Containment density: VAR_ST_011 / VAR_ST_007 = 12 / 22 = **0.545**
- Responsibility density: VAR_ST_006 / VAR_ST_007 = 8 / 22 = **0.364**
- Module density: VAR_ST_009 / VAR_ST_007 = 10 / 22 = **0.455**

**Computation State:** COMPLETE — all inputs are static telemetry values.

---

## SIG-005 — Execution Throughput

| Field | Value |
|---|---|
| Signal ID | SIG-005 |
| Canonical Name | Execution Throughput |
| CKR Ref | CKR-010 |
| Signal Class | composite (static + event-based) |
| Temporal | static component: static; completion factor: event-based |

**Input Variables:**

| Variable | Source Metric | Value |
|---|---|---|
| VAR_AT_005 | AT-005 (Pipeline Module Execution Count Per Run) | 8 (per run) |
| VAR_DT_001 | DT-001 (Intelligence Output Artifact Count Per Run) | 4 (per run) |
| VAR_DT_003 | DT-003 (Reconstruction Artifact Delivery Count Per Run) | 5 (per run) |
| VAR_DT_007 | DT-007 (Pipeline Run Completion Status) | PENDING — event-based |

**Computation Definition:**

- Static constants: pipeline stages = 8; artifacts delivered = DT-001(4) + DT-003(5) = 9 total per run
- Throughput rate (artifacts/stage): 9 / 8 = **1.125 artifacts per stage**
- Completion factor (DT-007): PENDING — requires live pipeline execution

**Computation State:** PARTIAL — per-run constants computed; completion factor pending live pipeline execution.

---

## SIG-006 — Execution Stability

| Field | Value |
|---|---|
| Signal ID | SIG-006 |
| Canonical Name | Execution Stability |
| CKR Ref | CKR-011 |
| Signal Class | composite (event-based) |
| Temporal | event-based |

**Input Variables:**

| Variable | Source Metric | Value |
|---|---|---|
| VAR_AT_007 | AT-007 (Validation Gate Enforcement Count Per Run) | PENDING |
| VAR_AT_009 | AT-009 (Feedback Routing Event Count Per Pipeline Run) | PENDING |
| VAR_DT_007 | DT-007 (Pipeline Run Completion Status) | PENDING |
| VAR_DT_008 | DT-008 (Feedback Loop Delivery Event Count) | PENDING |

**Computation State:** BLOCKED — all inputs are event-based; require live pipeline execution.

---

## SIG-007 — ESI

| Field | Value |
|---|---|
| Signal ID | SIG-007 |
| Canonical Name | ESI (Execution Stability Index) |
| CKR Ref | CKR-014 |
| Signal Class | composite (derived from SIG-005, SIG-006, SIG-002) |
| Temporal | event-based (dependent on SIG-005, SIG-006 completion) |

**Computation State:** PARTIAL — SIG-002 component (Dependency Load = 0.682) is resolved. SIG-005 completion factor and SIG-006 are pending. ESI cannot be computed without SIG-006 (Execution Stability).

---

## SIG-008 — RAG

| Field | Value |
|---|---|
| Signal ID | SIG-008 |
| Canonical Name | RAG (Risk Acceleration Gradient) |
| CKR Ref | CKR-015 |
| Signal Class | composite (derived from SIG-003, SIG-001, SIG-004) |
| Temporal | time-series (dependent on SIG-003 time-series) |

**Computation State:** PARTIAL — SIG-001 structural component (0.875) and SIG-004 ratios (1.273, 0.545, 0.364, 0.455) resolved. SIG-003 (Change Concentration) is BLOCKED on time-series. RAG cannot be computed without SIG-003.

---

## Specification Summary

| Signal ID | Canonical Name | State | Static Output |
|---|---|---|---|
| SIG-001 | Coordination Pressure | PARTIAL | 0.875 (structural component) |
| SIG-002 | Dependency Load | COMPLETE | ratio: 0.682; edge count: 15 |
| SIG-003 | Change Concentration | BLOCKED | — |
| SIG-004 | Structural Volatility | COMPLETE | 1.273 / 0.545 / 0.364 / 0.455 |
| SIG-005 | Execution Throughput | PARTIAL | 1.125 artifacts/stage; completion pending |
| SIG-006 | Execution Stability | BLOCKED | — |
| SIG-007 | ESI | PARTIAL | SIG-002 component: 0.682; others pending |
| SIG-008 | RAG | PARTIAL | SIG-001: 0.875; SIG-004 ratios resolved; SIG-003 blocked |

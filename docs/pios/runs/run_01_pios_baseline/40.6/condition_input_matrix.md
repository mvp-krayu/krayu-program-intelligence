# Condition Input Matrix

**Stream:** 40.6 — PiOS Condition Activation Engine
**Input:** docs/pios/40.5/signal_output_set.md, docs/pios/40.5/signal_validation_report.md, docs/pios/40.5/signal_traceability_map.md, docs/pios/40.5/execution_manifest.md
**Governing model:** Stream 75.1 — Program Condition Model (applied by M-07)
**Date:** 2026-03-18

---

## Input Rule

Condition activation in Stream 40.6 is derived exclusively from governed 40.5 signal outputs. No telemetry artifact is directly accessed. No 40.4 metric is directly referenced. Every condition maps to one or more governed signals. Signal coverage states propagate to condition coverage states without modification.

---

## Governed Condition Catalog

All 8 governed conditions fall under CKR-012 (Program Conditions). Activation logic for each condition is governed by Stream 75.1 — Program Condition Model.

| Condition ID | Condition Name | CKR | Class |
|---|---|---|---|
| COND-001 | Dependency Load Elevation | CKR-012 | structural |
| COND-002 | Structural Volatility State | CKR-012 | structural |
| COND-003 | Coordination Pressure Active | CKR-012 | execution |
| COND-004 | Throughput Degradation Risk | CKR-012 | execution |
| COND-005 | Change Concentration Accumulation | CKR-012 | activity |
| COND-006 | Execution Instability | CKR-012 | execution |
| COND-007 | Execution Health Deficit | CKR-012 | composite |
| COND-008 | Risk Acceleration State | CKR-012 | composite |

---

## Condition-to-Signal Input Mapping

### COND-001 — Dependency Load Elevation

| Input Field | Signal ID | Signal Name | Signal CKR | Signal Coverage State | Value Available |
|---|---|---|---|---|---|
| Dependency load ratio | SIG-002 | Dependency Load | CKR-007 | complete | 0.682 |
| Dependency edge count | SIG-002 | Dependency Load | CKR-007 | complete | 15 |

**Condition coverage state: evaluable**
**Reason:** All required signals complete. Stream 75.1 threshold evaluation can proceed.

---

### COND-002 — Structural Volatility State

| Input Field | Signal ID | Signal Name | Signal CKR | Signal Coverage State | Value Available |
|---|---|---|---|---|---|
| Edge-to-node ratio | SIG-004 | Structural Volatility | CKR-009 | complete | 1.273 |
| Containment density ratio | SIG-004 | Structural Volatility | CKR-009 | complete | 0.545 |
| Responsibility distribution | SIG-004 | Structural Volatility | CKR-009 | complete | 0.364 |
| Module surface ratio | SIG-004 | Structural Volatility | CKR-009 | complete | 0.455 |

**Condition coverage state: evaluable**
**Reason:** All required signals complete. Stream 75.1 threshold evaluation can proceed.

---

### COND-003 — Coordination Pressure Active

| Input Field | Signal ID | Signal Name | Signal CKR | Signal Coverage State | Value Available |
|---|---|---|---|---|---|
| Structural coordination ratio | SIG-001 | Coordination Pressure | CKR-006 | partial | 0.875 (structural only) |
| Runtime coordination events per run | SIG-001 | Coordination Pressure | CKR-006 | partial | pending (AT-005, AT-007) |

**Condition coverage state: partial**
**Reason:** SIG-001 partial — structural component resolved (0.875); event-based runtime component pending live telemetry (AT-005, AT-007).

---

### COND-004 — Throughput Degradation Risk

| Input Field | Signal ID | Signal Name | Signal CKR | Signal Coverage State | Value Available |
|---|---|---|---|---|---|
| Stage throughput per run | SIG-005 | Execution Throughput | CKR-010 | partial | 8 stages/run (constant) |
| Total artifacts per run | SIG-005 | Execution Throughput | CKR-010 | partial | 9 artifacts/run (constant) |
| Completion factor | SIG-005 | Execution Throughput | CKR-010 | partial | pending (DT-007) |
| Execution mode context | SIG-005 | Execution Throughput | CKR-010 | partial | pending (AT-006) |

**Condition coverage state: partial**
**Reason:** SIG-005 partial — per-run constants available; completion-conditioned throughput rate pending live telemetry (DT-007, AT-006).

---

### COND-005 — Change Concentration Accumulation

| Input Field | Signal ID | Signal Name | Signal CKR | Signal Coverage State | Value Available |
|---|---|---|---|---|---|
| Change event rate | SIG-003 | Change Concentration | CKR-008 | blocked | — (AT-001, AT-002 not present) |
| Per-event concentration | SIG-003 | Change Concentration | CKR-008 | blocked | — (AT-003 dependent on AT-001 time-series) |

**Condition coverage state: blocked**
**Reason:** SIG-003 blocked — requires AT-001 and AT-002 (time-series push-to-main event counts, GitHub-dependent; not present in static 40.4 inputs). Condition cannot be evaluated until signal is available.

---

### COND-006 — Execution Instability

| Input Field | Signal ID | Signal Name | Signal CKR | Signal Coverage State | Value Available |
|---|---|---|---|---|---|
| Per-run stability | SIG-006 | Execution Stability | CKR-011 | blocked | — (DT-007 requires live pipeline execution) |
| Gate enforcement rate | SIG-006 | Execution Stability | CKR-011 | blocked | — (AT-007 requires live pipeline execution) |
| Feedback closure rate | SIG-006 | Execution Stability | CKR-011 | blocked | — (AT-009, DT-008 requires live pipeline execution) |

**Condition coverage state: blocked**
**Reason:** SIG-006 blocked — requires DT-007 and AT-007 (event-based, per pipeline run; no pipeline runs recorded in static 40.4 inputs). Condition cannot be evaluated until signal is available.

---

### COND-007 — Execution Health Deficit

| Input Field | Signal ID | Signal Name | Signal CKR | Signal Coverage State | Value Available |
|---|---|---|---|---|---|
| ESI — Dependency Load component | SIG-007 (via SIG-002) | ESI | CKR-014 | partial | SIG-002 ratio: 0.682 |
| ESI — Execution Throughput component | SIG-007 (via SIG-005) | ESI | CKR-014 | partial | SIG-005 constants: 8 stages, 9 artifacts/run |
| ESI — Execution Stability component | SIG-007 (via SIG-006) | ESI | CKR-014 | partial | pending (SIG-006 blocked) |

**Condition coverage state: partial**
**Reason:** SIG-007 partial — SIG-002 component resolved; SIG-005 partial component available; SIG-006 component blocked. Full ESI required for complete condition evaluation.

---

### COND-008 — Risk Acceleration State

| Input Field | Signal ID | Signal Name | Signal CKR | Signal Coverage State | Value Available |
|---|---|---|---|---|---|
| RAG — Structural Volatility component | SIG-008 (via SIG-004) | RAG | CKR-015 | partial | SIG-004 ratios: 1.273/0.545/0.364/0.455 |
| RAG — Coordination Pressure component | SIG-008 (via SIG-001) | RAG | CKR-015 | partial | SIG-001 structural: 0.875; runtime pending |
| RAG — Change Concentration component | SIG-008 (via SIG-003) | RAG | CKR-015 | partial | pending (SIG-003 blocked) |

**Condition coverage state: partial**
**Reason:** SIG-008 partial — SIG-004 ratios and SIG-001 structural component resolved; SIG-003 time-series component blocked. Full RAG gradient computation pending SIG-003.

---

## Coverage State Summary

| Condition ID | Required Signal(s) | Signal State(s) | Condition Coverage State |
|---|---|---|---|
| COND-001 | SIG-002 | complete | evaluable |
| COND-002 | SIG-004 | complete | evaluable |
| COND-003 | SIG-001 | partial | partial |
| COND-004 | SIG-005 | partial | partial |
| COND-005 | SIG-003 | blocked | blocked |
| COND-006 | SIG-006 | blocked | blocked |
| COND-007 | SIG-007 (via SIG-002, SIG-005, SIG-006) | partial | partial |
| COND-008 | SIG-008 (via SIG-004, SIG-001, SIG-003) | partial | partial |

| Category | Count | Condition IDs |
|---|---|---|
| Evaluable | 2 | COND-001, COND-002 |
| Partial | 4 | COND-003, COND-004, COND-007, COND-008 |
| Blocked | 2 | COND-005, COND-006 |

---

## Coverage Propagation Rule Applied

Signal coverage states propagate to condition coverage states without exception:
- A condition requiring only complete signals → evaluable
- A condition requiring any partial signal (and no blocked signals) → partial
- A condition requiring any blocked signal → blocked

No condition coverage state is elevated above its least-available signal input. No fabrication. No inference.

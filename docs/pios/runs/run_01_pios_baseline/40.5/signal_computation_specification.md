# Signal Computation Specification

**Stream:** 40.5 — PiOS Signal Computation Engine
**Input:** docs/pios/40.4/ (full corpus), docs/pios/40.5/signal_input_matrix.md
**Governing computation model:** Stream 70 — Execution Signal Science (applied by M-06; sourced via telemetry_surface_definition.md TSD-02f)
**Date:** 2026-03-18

---

## Specification Rule

This document defines the computation specification for each governed signal. Computation formulas are governed by Stream 70 — Execution Signal Science (referenced as model activation dependency in 40.4 telemetry_surface_definition.md TSD-02f, surface for M-06). Input fields are drawn exclusively from 40.4 telemetry metrics as mapped in signal_input_matrix.md.

Every signal specification must declare:
- Signal ID, Name, and CKR reference
- Signal class (atomic | composite)
- Input telemetry fields
- Computation definition (as governed)
- Output type and unit
- Temporal reference

No computation may introduce signals, indices, scores, or values from outside the governed signal definitions. No interpretation, condition label, or diagnosis is produced.

---

## SIG-001 — Coordination Pressure

| Field | Value |
|---|---|
| Signal ID | SIG-001 |
| Signal Name | Coordination Pressure |
| CKR Reference | CKR-006 |
| Signal Class | atomic |
| Governing Authority | Stream 70 — Execution Signal Science |
| Temporal Reference | static (structural component); event-based (runtime component) |
| Output Type | ratio + event-count |
| Output Unit | dimensionless ratio (structural); count per run (runtime) |

**Input Telemetry Fields:**

| Field | Metric ID | Value / State | Component |
|---|---|---|---|
| PiOS Pipeline Stage Count | ST-016 | 8 | structural |
| PEG Pipeline Edge Count | ST-012 | 7 | structural |
| Pipeline Module Execution Count Per Run | AT-005 | event-based — per run | runtime |
| Validation Gate Enforcement Count Per Run | AT-007 | event-based — per run | runtime |

**Computation Definition (governed by Stream 70):**

- Structural component: pipeline coordination ratio = ST-012 ÷ ST-016
- Runtime component: active coordination events per run = AT-005 + AT-007 (per pipeline run event)
- Full signal: Stream 70 aggregation of structural and runtime components per governed formula

**Computation boundary:** Structural component is computable from current static telemetry. Runtime component requires event-based telemetry collected per pipeline execution.

---

## SIG-002 — Dependency Load

| Field | Value |
|---|---|
| Signal ID | SIG-002 |
| Signal Name | Dependency Load |
| CKR Reference | CKR-007 |
| Signal Class | atomic |
| Governing Authority | Stream 70 — Execution Signal Science |
| Temporal Reference | static |
| Output Type | ratio |
| Output Unit | dimensionless ratio (dependency edges per node) |

**Input Telemetry Fields:**

| Field | Metric ID | Value | Component |
|---|---|---|---|
| PEG Total Node Count | ST-007 | 22 | normalisation base |
| PEG Total Edge Count | ST-010 | 28 | total relationship surface |
| PEG Pipeline Edge Count | ST-012 | 7 | pipeline dependency edges |
| PEG Model Activation Edge Count | ST-013 | 3 | model dependency edges |
| PEG Governance Edge Count | ST-014 | 2 | governance dependency edges |
| Non-PEG Governance Constraint Count | ST-015 | 3 | off-graph constraint load |

**Computation Definition (governed by Stream 70):**

- Dependency edge set = ST-012 + ST-013 + ST-014 + ST-015 = 7 + 3 + 2 + 3 = 15 dependency-type edges
- Dependency load ratio = dependency edge set ÷ ST-007 = 15 ÷ 22
- Full signal: Stream 70 application to dependency load ratio per governed formula

**Computation boundary:** Fully computable from current static telemetry.

---

## SIG-003 — Change Concentration

| Field | Value |
|---|---|
| Signal ID | SIG-003 |
| Signal Name | Change Concentration |
| CKR Reference | CKR-008 |
| Signal Class | atomic |
| Governing Authority | Stream 70 — Execution Signal Science |
| Temporal Reference | time-series |
| Output Type | rate |
| Output Unit | events per time interval |

**Input Telemetry Fields:**

| Field | Metric ID | Value / State | Component |
|---|---|---|---|
| Automation Trigger Frequency | AT-001 | time-series — per interval | primary change rate |
| Auto-Commit Event Frequency | AT-002 | time-series — per interval | commit change rate |
| Script Execution Event Count | AT-003 | event-based — per invocation | per-event execution |

**Computation Definition (governed by Stream 70):**

- Change event rate = AT-001 + AT-002 (per time interval; time-series accumulation)
- Per-event concentration = AT-003 per AT-001 event
- Full signal: Stream 70 time-series aggregation of change event rates per governed formula

**Computation boundary:** Requires live time-series telemetry. No static value computable from current telemetry state.

---

## SIG-004 — Structural Volatility

| Field | Value |
|---|---|
| Signal ID | SIG-004 |
| Signal Name | Structural Volatility |
| CKR Reference | CKR-009 |
| Signal Class | atomic |
| Governing Authority | Stream 70 — Execution Signal Science |
| Temporal Reference | static |
| Output Type | ratio |
| Output Unit | dimensionless ratio |

**Input Telemetry Fields:**

| Field | Metric ID | Value | Component |
|---|---|---|---|
| PEG Total Node Count | ST-007 | 22 | structural size |
| PEG Total Edge Count | ST-010 | 28 | relationship density numerator |
| PEG Module Node Count | ST-009 | 10 | module-level surface |
| Component Containment Depth | ST-022 | 3 | structural nesting depth |
| Architectural Responsibility Zone Count | ST-006 | 8 | structural partitioning breadth |
| PEG Containment Edge Count | ST-011 | 12 | containment topology density |

**Computation Definition (governed by Stream 70):**

- Edge-to-node ratio = ST-010 ÷ ST-007 = 28 ÷ 22
- Containment density ratio = ST-011 ÷ ST-007 = 12 ÷ 22
- Responsibility distribution = ST-006 ÷ ST-007 = 8 ÷ 22
- Full signal: Stream 70 aggregation of structural volatility sub-ratios per governed formula

**Computation boundary:** Fully computable from current static telemetry.

---

## SIG-005 — Execution Throughput

| Field | Value |
|---|---|
| Signal ID | SIG-005 |
| Signal Name | Execution Throughput |
| CKR Reference | CKR-010 |
| Signal Class | atomic |
| Governing Authority | Stream 70 — Execution Signal Science |
| Temporal Reference | event-based |
| Output Type | rate |
| Output Unit | artifacts per run; completion boolean |

**Input Telemetry Fields:**

| Field | Metric ID | Value / State | Component |
|---|---|---|---|
| Pipeline Module Execution Count Per Run | AT-005 | event-based — 8 per run | execution volume |
| Pipeline Execution Mode At Runtime | AT-006 | event-based — enumeration | execution context |
| Intelligence Output Artifact Count Per Pipeline Run | DT-001 | event-based — 4 per run | output volume |
| Reconstruction Artifact Delivery Count Per Run | DT-003 | event-based — 5 per run | internal delivery volume |
| Pipeline Run Completion Status | DT-007 | event-based — boolean | completion gate |

**Computation Definition (governed by Stream 70):**

- Stage throughput = AT-005 per run event = 8
- Output throughput = DT-001 + DT-003 per run event = 4 + 5 = 9 artifacts delivered
- Completion factor = DT-007 (1 if complete, 0 if incomplete)
- Full signal: Stream 70 throughput aggregation per governed formula, conditioned on execution mode (AT-006)

**Computation boundary:** Per-run values are deterministic (AT-005=8, DT-001=4, DT-003=5 per run); completion factor (DT-007) requires live execution state.

---

## SIG-006 — Execution Stability

| Field | Value |
|---|---|
| Signal ID | SIG-006 |
| Signal Name | Execution Stability |
| CKR Reference | CKR-011 |
| Signal Class | atomic |
| Governing Authority | Stream 70 — Execution Signal Science |
| Temporal Reference | event-based |
| Output Type | rate |
| Output Unit | completion ratio (over successive runs) |

**Input Telemetry Fields:**

| Field | Metric ID | Value / State | Component |
|---|---|---|---|
| Pipeline Run Completion Status | DT-007 | event-based — boolean | run-level stability indicator |
| Validation Gate Enforcement Count Per Run | AT-007 | event-based — count | gate-level stability indicator |
| Feedback Routing Event Count Per Pipeline Run | AT-009 | event-based — count | feedback loop activation |
| Feedback Loop Delivery Event Count | DT-008 | event-based — count | feedback delivery completeness |

**Computation Definition (governed by Stream 70):**

- Per-run stability = DT-007 (complete = 1, incomplete = 0)
- Gate enforcement rate = AT-007 per run event
- Feedback closure rate = DT-008 per AT-009 per run
- Full signal: Stream 70 stability aggregation over successive run events per governed formula

**Computation boundary:** Requires event-based telemetry collected per pipeline execution. No static value computable from current telemetry state.

---

## SIG-007 — Execution Stability Index (ESI) [Composite]

| Field | Value |
|---|---|
| Signal ID | SIG-007 |
| Signal Name | Execution Stability Index (ESI) |
| CKR Reference | CKR-014 |
| Signal Class | composite |
| Component Signals | SIG-006 (CKR-011), SIG-005 (CKR-010), SIG-002 (CKR-007) |
| Governing Authority | Stream 70 — Execution Signal Science |
| Temporal Reference | event-based |
| Output Type | index |
| Output Unit | dimensionless index (governed scale) |

**Input Signal Components:**

| Component | Signal ID | CKR | Computable Now | Temporal |
|---|---|---|---|---|
| Execution Stability | SIG-006 | CKR-011 | no (event-based) | event-based |
| Execution Throughput | SIG-005 | CKR-010 | partial | event-based |
| Dependency Load | SIG-002 | CKR-007 | yes (static) | static |

**Computation Definition (governed by Stream 70):**

- Inputs: SIG-006 (per-run), SIG-005 (per-run), SIG-002 (static)
- Full ESI computation: Stream 70 composite aggregation per governed formula
- Static partial computation: SIG-002 component fully resolved

**Computation boundary:** Full ESI requires event-based runtime telemetry (SIG-006, SIG-005). Partial static input (SIG-002) pre-computed.

---

## SIG-008 — Risk Acceleration Gradient (RAG) [Composite]

| Field | Value |
|---|---|
| Signal ID | SIG-008 |
| Signal Name | Risk Acceleration Gradient (RAG) |
| CKR Reference | CKR-015 |
| Signal Class | composite |
| Component Signals | SIG-003 (CKR-008), SIG-001 (CKR-006), SIG-004 (CKR-009) |
| Governing Authority | Stream 70 — Execution Signal Science |
| Temporal Reference | time-series |
| Output Type | gradient |
| Output Unit | dimensionless gradient (governed scale, over time intervals) |

**Input Signal Components:**

| Component | Signal ID | CKR | Computable Now | Temporal |
|---|---|---|---|---|
| Change Concentration | SIG-003 | CKR-008 | no (time-series) | time-series |
| Coordination Pressure | SIG-001 | CKR-006 | partial (structural) | static + event-based |
| Structural Volatility | SIG-004 | CKR-009 | yes (static) | static |

**Computation Definition (governed by Stream 70):**

- Inputs: SIG-003 (time-series), SIG-001 (structural + runtime), SIG-004 (static)
- Full RAG computation: Stream 70 gradient aggregation across successive time intervals per governed formula
- Static partial computation: SIG-004 component fully resolved; SIG-001 structural component pre-computed

**Computation boundary:** Full RAG requires sequential time-series telemetry (SIG-003). Partial static inputs (SIG-004, structural SIG-001) pre-computed.

---

## Specification Summary

| Signal ID | Name | CKR | Class | Temporal | Static Computable | Runtime Required |
|---|---|---|---|---|---|---|
| SIG-001 | Coordination Pressure | CKR-006 | atomic | static + event-based | partial | yes (AT-005, AT-007) |
| SIG-002 | Dependency Load | CKR-007 | atomic | static | yes | no |
| SIG-003 | Change Concentration | CKR-008 | atomic | time-series | no | yes (AT-001, AT-002) |
| SIG-004 | Structural Volatility | CKR-009 | atomic | static | yes | no |
| SIG-005 | Execution Throughput | CKR-010 | atomic | event-based | partial | yes (DT-007) |
| SIG-006 | Execution Stability | CKR-011 | atomic | event-based | no | yes (DT-007, AT-007) |
| SIG-007 | ESI | CKR-014 | composite | event-based | partial | yes (SIG-005, SIG-006) |
| SIG-008 | RAG | CKR-015 | composite | time-series | partial | yes (SIG-003) |

**Total governed signals: 8**
**Fully computable from current static telemetry: 2 (SIG-002, SIG-004)**
**Partially computable (static component only): 4 (SIG-001, SIG-005, SIG-007, SIG-008)**
**Requires runtime telemetry only: 2 (SIG-003, SIG-006)**

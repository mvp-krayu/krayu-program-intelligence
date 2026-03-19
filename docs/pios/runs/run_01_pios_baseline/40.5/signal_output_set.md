# Signal Output Set

**Stream:** 40.5 — PiOS Signal Computation Engine
**Input:** docs/pios/40.4/ (full corpus), docs/pios/40.5/signal_input_matrix.md, docs/pios/40.5/signal_computation_specification.md
**Date:** 2026-03-18

---

## Output Rule

This document records the computed output for each governed signal. Where the computation is fully deterministic from current static telemetry, the computed value is provided. Where computation requires runtime (event-based or time-series) telemetry, the output schema and computation state are declared and the value is marked as pending live telemetry.

No signal value is fabricated, inferred, or estimated. No interpretation, condition label, or diagnosis is attached to any output.

---

## SIG-001 — Coordination Pressure (CKR-006)

| Field | Value |
|---|---|
| Signal ID | SIG-001 |
| Signal Name | Coordination Pressure |
| CKR Reference | CKR-006 |
| Temporal Reference | static (structural component); event-based (runtime component) |
| Computation State | partial |

**Structural Component Output (static — computable):**

| Sub-computation | Formula | Telemetry Inputs | Result |
|---|---|---|---|
| Pipeline coordination ratio | ST-012 ÷ ST-016 | ST-012=7, ST-016=8 | 0.875 |

**Runtime Component Output (event-based — pending):**

| Sub-computation | Formula | Required Telemetry | State |
|---|---|---|---|
| Active coordination events per run | AT-005 + AT-007 | AT-005 (per run), AT-007 (per run) | pending live telemetry |

**Full Signal Output:** pending — requires Stream 70 aggregation of structural and runtime components.

---

## SIG-002 — Dependency Load (CKR-007)

| Field | Value |
|---|---|
| Signal ID | SIG-002 |
| Signal Name | Dependency Load |
| CKR Reference | CKR-007 |
| Temporal Reference | static |
| Computation State | complete |

**Computed Output:**

| Sub-computation | Formula | Telemetry Inputs | Result |
|---|---|---|---|
| Dependency edge set | ST-012 + ST-013 + ST-014 + ST-015 | 7 + 3 + 2 + 3 | 15 dependency edges |
| Dependency load ratio | dependency edge set ÷ ST-007 | 15 ÷ 22 | 0.682 (3 dp) |

**Full Signal Output:**
- Dependency edge count: **15**
- Dependency load ratio: **0.682**
- Temporal reference: static — value is stable unless structural definition changes
- Full Stream 70 signal application: pending Stream 70 model activation

---

## SIG-003 — Change Concentration (CKR-008)

| Field | Value |
|---|---|
| Signal ID | SIG-003 |
| Signal Name | Change Concentration |
| CKR Reference | CKR-008 |
| Temporal Reference | time-series |
| Computation State | pending |

**Output Schema:**

| Output Field | Type | Unit | Required Telemetry |
|---|---|---|---|
| Change event rate | time-series | events per interval | AT-001 (per interval) + AT-002 (per interval) |
| Per-event concentration | event-based | executions per trigger | AT-003 per AT-001 event |

**Full Signal Output:** pending — requires time-series telemetry accumulation (AT-001, AT-002).

---

## SIG-004 — Structural Volatility (CKR-009)

| Field | Value |
|---|---|
| Signal ID | SIG-004 |
| Signal Name | Structural Volatility |
| CKR Reference | CKR-009 |
| Temporal Reference | static |
| Computation State | complete |

**Computed Output:**

| Sub-computation | Formula | Telemetry Inputs | Result |
|---|---|---|---|
| Edge-to-node ratio | ST-010 ÷ ST-007 | 28 ÷ 22 | 1.273 (3 dp) |
| Containment density ratio | ST-011 ÷ ST-007 | 12 ÷ 22 | 0.545 (3 dp) |
| Responsibility distribution | ST-006 ÷ ST-007 | 8 ÷ 22 | 0.364 (3 dp) |
| Module surface ratio | ST-009 ÷ ST-007 | 10 ÷ 22 | 0.455 (3 dp) |

**Full Signal Output:**
- Edge-to-node ratio: **1.273**
- Containment density ratio: **0.545**
- Responsibility distribution: **0.364**
- Module surface ratio: **0.455**
- Temporal reference: static — values stable unless structural definition changes
- Full Stream 70 signal application: pending Stream 70 model activation

---

## SIG-005 — Execution Throughput (CKR-010)

| Field | Value |
|---|---|
| Signal ID | SIG-005 |
| Signal Name | Execution Throughput |
| CKR Reference | CKR-010 |
| Temporal Reference | event-based |
| Computation State | partial |

**Deterministic Per-Run Constants (from telemetry-declared values):**

| Output Field | Value | Telemetry Source | Basis |
|---|---|---|---|
| Stage throughput per run | 8 | AT-005 (value per run: 8) | declared constant in telemetry |
| Internal delivery per run | 5 | DT-003 (value per run: 5) | declared constant in telemetry |
| Intelligence output per run | 4 | DT-001 (value per run: 4) | declared constant in telemetry |
| Total artifacts per run | 9 | DT-001 + DT-003 | 4 + 5 |

**Runtime-Dependent Output (pending):**

| Output Field | Required Telemetry | State |
|---|---|---|
| Completion factor | DT-007 (boolean per run) | pending live telemetry |
| Execution mode context | AT-006 (enumeration per run) | pending live telemetry |

**Full Signal Output:** partial — deterministic throughput constants available; completion-conditioned aggregation pending Stream 70 model activation with live telemetry.

---

## SIG-006 — Execution Stability (CKR-011)

| Field | Value |
|---|---|
| Signal ID | SIG-006 |
| Signal Name | Execution Stability |
| CKR Reference | CKR-011 |
| Temporal Reference | event-based |
| Computation State | pending |

**Output Schema:**

| Output Field | Type | Unit | Required Telemetry |
|---|---|---|---|
| Per-run stability | event-based | boolean (1=complete, 0=incomplete) | DT-007 |
| Gate enforcement rate | event-based | count per run | AT-007 |
| Feedback closure rate | event-based | DT-008 ÷ AT-009 per run | AT-009, DT-008 |

**Full Signal Output:** pending — requires event-based telemetry from pipeline executions.

---

## SIG-007 — Execution Stability Index (ESI) (CKR-014) [Composite]

| Field | Value |
|---|---|
| Signal ID | SIG-007 |
| Signal Name | Execution Stability Index (ESI) |
| CKR Reference | CKR-014 |
| Temporal Reference | event-based |
| Computation State | partial |

**Component Status:**

| Component | Signal ID | State | Value |
|---|---|---|---|
| Dependency Load | SIG-002 | complete | ratio: 0.682 |
| Execution Throughput | SIG-005 | partial | constants: stage=8, delivery=9/run |
| Execution Stability | SIG-006 | pending | requires live telemetry |

**Full Signal Output:** pending — full ESI computation requires SIG-006 (event-based) and Stream 70 composite aggregation. SIG-002 static component resolved.

---

## SIG-008 — Risk Acceleration Gradient (RAG) (CKR-015) [Composite]

| Field | Value |
|---|---|
| Signal ID | SIG-008 |
| Signal Name | Risk Acceleration Gradient (RAG) |
| CKR Reference | CKR-015 |
| Temporal Reference | time-series |
| Computation State | partial |

**Component Status:**

| Component | Signal ID | State | Value |
|---|---|---|---|
| Structural Volatility | SIG-004 | complete | edge-to-node: 1.273; containment: 0.545; responsibility: 0.364; module: 0.455 |
| Coordination Pressure | SIG-001 | partial | structural ratio: 0.875; runtime pending |
| Change Concentration | SIG-003 | pending | requires time-series telemetry |

**Full Signal Output:** pending — full RAG computation requires SIG-003 time-series data and Stream 70 gradient aggregation across successive intervals. SIG-004 and structural SIG-001 components resolved.

---

## Signal Output Summary

| Signal ID | Name | CKR | Temporal | State | Computed Values Available |
|---|---|---|---|---|---|
| SIG-001 | Coordination Pressure | CKR-006 | static + event-based | partial | Structural ratio: 0.875 |
| SIG-002 | Dependency Load | CKR-007 | static | complete | Ratio: 0.682; Edge count: 15 |
| SIG-003 | Change Concentration | CKR-008 | time-series | pending | — |
| SIG-004 | Structural Volatility | CKR-009 | static | complete | Ratios: 1.273 / 0.545 / 0.364 / 0.455 |
| SIG-005 | Execution Throughput | CKR-010 | event-based | partial | Per-run constants: 8 stages, 9 artifacts |
| SIG-006 | Execution Stability | CKR-011 | event-based | pending | — |
| SIG-007 | ESI | CKR-014 | event-based | partial | SIG-002 component: 0.682 |
| SIG-008 | RAG | CKR-015 | time-series | partial | SIG-004 ratios; SIG-001 structural: 0.875 |

**Signals with complete static output: 2 (SIG-002, SIG-004)**
**Signals with partial output (static component resolved): 4 (SIG-001, SIG-005, SIG-007, SIG-008)**
**Signals pending runtime telemetry: 2 (SIG-003, SIG-006)**
**All outputs: no interpretation, no condition label, no diagnosis attached**

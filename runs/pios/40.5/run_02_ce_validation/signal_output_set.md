# Signal Output Set

**run_id:** run_02_ce_validation
**stream:** Stream 40.5 — PiOS Signal Computation Engine
**contract:** PIOS-40.5-RUN02-CE-VALIDATION-CONTRACT-v1
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Output Rule

This document records the computed output for each governed signal in run_02_ce_validation. All computed values are deterministic from static 40.4 telemetry. No values are fabricated, inferred, or estimated. No interpretation, condition label, or diagnosis is attached to any output.

GH-02 check (40.5 → 40.6 handoff gate) status is declared per signal.

---

## SIG-001 — Coordination Pressure

| Field | Value |
|---|---|
| Signal ID | SIG-001 |
| Canonical Name | Coordination Pressure |
| Computation State | PARTIAL |
| GH-02 status | F2 — PARTIAL; static component computed; runtime component UNDEFINED |

**Output:**

| Component | Formula | Inputs | Value |
|---|---|---|---|
| Static structural ratio | ST-012 / ST-016 | 7 / 8 | **0.875** |
| Runtime component | AT-005 × AT-007 per run | PENDING | UNDEFINED |

Full SIG-001 output: PARTIAL — static structural component = **0.875**; runtime component = **UNDEFINED** (pending live pipeline execution).

---

## SIG-002 — Dependency Load

| Field | Value |
|---|---|
| Signal ID | SIG-002 |
| Canonical Name | Dependency Load |
| Computation State | COMPLETE |
| GH-02 status | PASS |

**Output:**

| Sub-computation | Formula | Inputs | Result |
|---|---|---|---|
| Dependency edge count | ST-012 + ST-013 + ST-014 + ST-015 | 7 + 3 + 2 + 3 | **15** |
| Dependency Load ratio | dependency_count / ST-007 | 15 / 22 | **0.682** |

Full SIG-002 output: **ratio = 0.682; dependency edge count = 15**

---

## SIG-003 — Change Concentration

| Field | Value |
|---|---|
| Signal ID | SIG-003 |
| Canonical Name | Change Concentration |
| Computation State | BLOCKED |
| GH-02 status | F2 — PARTIAL; output = UNDEFINED |

**Output:** UNDEFINED — requires AT-001 and AT-002 time-series accumulation. These are GitHub push-to-main event counts recorded over successive time intervals. Not present in static 40.4 telemetry. Evidence-First Principle applies: no value fabricated.

---

## SIG-004 — Structural Volatility

| Field | Value |
|---|---|
| Signal ID | SIG-004 |
| Canonical Name | Structural Volatility |
| Computation State | COMPLETE |
| GH-02 status | PASS |

**Output:**

| Sub-computation | Formula | Inputs | Result |
|---|---|---|---|
| Total edge density | ST-010 / ST-007 | 28 / 22 | **1.273** |
| Containment density | ST-011 / ST-007 | 12 / 22 | **0.545** |
| Responsibility density | ST-006 / ST-007 | 8 / 22 | **0.364** |
| Module density | ST-009 / ST-007 | 10 / 22 | **0.455** |

Full SIG-004 output: **total edge density = 1.273; containment density = 0.545; responsibility density = 0.364; module density = 0.455**

---

## SIG-005 — Execution Throughput

| Field | Value |
|---|---|
| Signal ID | SIG-005 |
| Canonical Name | Execution Throughput |
| Computation State | PARTIAL |
| GH-02 status | F2 — PARTIAL; static constants resolved; completion factor UNDEFINED |

**Output:**

| Component | Formula | Inputs | Value |
|---|---|---|---|
| Total artifacts per run | DT-001 + DT-003 | 4 + 5 | **9** |
| Pipeline stages per run | AT-005 declared | 8 | **8** |
| Throughput rate | artifacts / stages | 9 / 8 | **1.125 artifacts/stage** |
| Completion factor | DT-007 | PENDING runtime | UNDEFINED |

Full SIG-005 output: PARTIAL — throughput rate = **1.125 artifacts/stage**; completion factor = **UNDEFINED** (DT-007 pending live pipeline execution).

---

## SIG-006 — Execution Stability

| Field | Value |
|---|---|
| Signal ID | SIG-006 |
| Canonical Name | Execution Stability |
| Computation State | BLOCKED |
| GH-02 status | F2 — PARTIAL; output = UNDEFINED |

**Output:** UNDEFINED — all inputs (AT-007, AT-009, DT-007, DT-008) require live pipeline execution. Evidence-First Principle applies: no value fabricated.

---

## SIG-007 — ESI

| Field | Value |
|---|---|
| Signal ID | SIG-007 |
| Canonical Name | ESI (Execution Stability Index) |
| Computation State | PARTIAL |
| GH-02 status | F2 — PARTIAL; SIG-002 component resolved; SIG-005/SIG-006 pending |

**Output:**

| Component | Status | Value |
|---|---|---|
| SIG-002 (Dependency Load) component | RESOLVED | 0.682 |
| SIG-005 (Execution Throughput) completion factor | UNDEFINED | — |
| SIG-006 (Execution Stability) | UNDEFINED | — |

Full SIG-007 output: PARTIAL — SIG-002 component = **0.682**; full ESI computation requires SIG-005 and SIG-006, both pending.

---

## SIG-008 — RAG

| Field | Value |
|---|---|
| Signal ID | SIG-008 |
| Canonical Name | RAG (Risk Acceleration Gradient) |
| Computation State | PARTIAL |
| GH-02 status | F2 — PARTIAL; SIG-001/SIG-004 components resolved; SIG-003 blocked |

**Output:**

| Component | Status | Value |
|---|---|---|
| SIG-001 structural component | RESOLVED | 0.875 |
| SIG-004 total edge density | RESOLVED | 1.273 |
| SIG-004 containment density | RESOLVED | 0.545 |
| SIG-004 responsibility density | RESOLVED | 0.364 |
| SIG-004 module density | RESOLVED | 0.455 |
| SIG-003 (Change Concentration) | BLOCKED | UNDEFINED |

Full SIG-008 output: PARTIAL — structural and volatility components resolved; RAG acceleration component requires SIG-003 time-series, which is BLOCKED.

---

## Signal Output Summary

| Signal ID | Canonical Name | State | Static Output Available |
|---|---|---|---|
| SIG-001 | Coordination Pressure | PARTIAL | 0.875 |
| SIG-002 | Dependency Load | COMPLETE | ratio: 0.682; edge count: 15 |
| SIG-003 | Change Concentration | BLOCKED | — |
| SIG-004 | Structural Volatility | COMPLETE | 1.273 / 0.545 / 0.364 / 0.455 |
| SIG-005 | Execution Throughput | PARTIAL | 1.125 artifacts/stage |
| SIG-006 | Execution Stability | BLOCKED | — |
| SIG-007 | ESI | PARTIAL | SIG-002 component: 0.682 |
| SIG-008 | RAG | PARTIAL | SIG-001: 0.875; SIG-004 ratios resolved |

**COMPLETE: 2 (SIG-002, SIG-004)**
**PARTIAL: 4 (SIG-001, SIG-005, SIG-007, SIG-008)**
**BLOCKED: 2 (SIG-003, SIG-006)**

signal_output_completeness: PARTIAL

PARTIAL is the governed position. COMPLETE is not achievable because SIG-003 and SIG-006 require runtime telemetry not present in static 40.4 inputs. Evidence-First Principle (GC-06) governs this outcome. No values fabricated or inferred.

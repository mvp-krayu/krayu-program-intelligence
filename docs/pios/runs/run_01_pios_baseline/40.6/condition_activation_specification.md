# Condition Activation Specification

**Stream:** 40.6 — PiOS Condition Activation Engine
**Input:** docs/pios/40.5/ (full corpus), docs/pios/40.6/condition_input_matrix.md
**Governing model:** Stream 75.1 — Program Condition Model (applied by M-07)
**Date:** 2026-03-18

---

## Specification Rule

This document defines the activation specification for each governed program condition. Activation logic for every condition is governed by Stream 75.1 — Program Condition Model. The activation specification declares:

1. Condition identity (ID, name, CKR, class)
2. Required signal inputs and their coverage states
3. Temporal reference (inherited from governing signal)
4. Activation logic reference (Stream 75.1 threshold authority)
5. Activation coverage state (evaluable | partial | blocked)

No threshold values are defined within this stream. Threshold definitions are the exclusive authority of Stream 75.1. 40.6 declares activation readiness based on signal coverage, not condition truth value.

---

## COND-001 — Dependency Load Elevation

| Field | Value |
|---|---|
| Condition ID | COND-001 |
| Condition Name | Dependency Load Elevation |
| CKR Reference | CKR-012 |
| Class | structural |
| Governing Model | Stream 75.1 — Program Condition Model |
| Temporal Reference | static (inherited from SIG-002) |
| Activation Coverage State | evaluable |

**Required Signal Inputs:**

| Signal | Coverage State | Available Value |
|---|---|---|
| SIG-002 — Dependency Load ratio | complete | 0.682 |
| SIG-002 — Dependency edge count | complete | 15 |

**Activation Logic (per Stream 75.1):**
Stream 75.1 evaluates COND-001 by applying the Dependency Load Elevation threshold against SIG-002 output values. Threshold application is the exclusive authority of Stream 75.1. 40.6 confirms signal input is sufficient for Stream 75.1 evaluation.

**Activation Readiness:** READY — all required signal inputs available.

---

## COND-002 — Structural Volatility State

| Field | Value |
|---|---|
| Condition ID | COND-002 |
| Condition Name | Structural Volatility State |
| CKR Reference | CKR-012 |
| Class | structural |
| Governing Model | Stream 75.1 — Program Condition Model |
| Temporal Reference | static (inherited from SIG-004) |
| Activation Coverage State | evaluable |

**Required Signal Inputs:**

| Signal | Coverage State | Available Value |
|---|---|---|
| SIG-004 — Edge-to-node ratio | complete | 1.273 |
| SIG-004 — Containment density ratio | complete | 0.545 |
| SIG-004 — Responsibility distribution | complete | 0.364 |
| SIG-004 — Module surface ratio | complete | 0.455 |

**Activation Logic (per Stream 75.1):**
Stream 75.1 evaluates COND-002 by applying Structural Volatility State thresholds across all four SIG-004 ratio outputs. Multi-ratio threshold logic is the exclusive authority of Stream 75.1.

**Activation Readiness:** READY — all required signal inputs available.

---

## COND-003 — Coordination Pressure Active

| Field | Value |
|---|---|
| Condition ID | COND-003 |
| Condition Name | Coordination Pressure Active |
| CKR Reference | CKR-012 |
| Class | execution |
| Governing Model | Stream 75.1 — Program Condition Model |
| Temporal Reference | static + event-based (inherited from SIG-001) |
| Activation Coverage State | partial |

**Required Signal Inputs:**

| Signal | Coverage State | Available Value |
|---|---|---|
| SIG-001 — Structural coordination ratio | partial (static component) | 0.875 |
| SIG-001 — Runtime coordination events per run | partial (event-based pending) | pending (AT-005, AT-007) |

**Activation Logic (per Stream 75.1):**
Stream 75.1 evaluates COND-003 using full SIG-001 output (both structural and runtime components). Partial evaluation using structural component only is not authorized by Stream 75.1 — full signal required for condition activation.

**Activation Readiness:** PARTIAL — structural component available; runtime component pending live telemetry (AT-005: pipeline module execution count per run; AT-007: validation gate enforcement count per run).

---

## COND-004 — Throughput Degradation Risk

| Field | Value |
|---|---|
| Condition ID | COND-004 |
| Condition Name | Throughput Degradation Risk |
| CKR Reference | CKR-012 |
| Class | execution |
| Governing Model | Stream 75.1 — Program Condition Model |
| Temporal Reference | event-based (inherited from SIG-005) |
| Activation Coverage State | partial |

**Required Signal Inputs:**

| Signal | Coverage State | Available Value |
|---|---|---|
| SIG-005 — Stage throughput per run | partial (declared constant) | 8 stages/run |
| SIG-005 — Total artifacts per run | partial (declared constant) | 9 artifacts/run |
| SIG-005 — Completion factor | partial (event-based pending) | pending (DT-007) |
| SIG-005 — Execution mode context | partial (event-based pending) | pending (AT-006) |

**Activation Logic (per Stream 75.1):**
Stream 75.1 evaluates COND-004 using full SIG-005 output including completion-conditioned throughput rate. Per-run constants alone are insufficient for full condition evaluation per Stream 75.1 model.

**Activation Readiness:** PARTIAL — throughput constants available; completion factor and execution mode pending live telemetry (DT-007: pipeline run completion status; AT-006: execution mode at runtime).

---

## COND-005 — Change Concentration Accumulation

| Field | Value |
|---|---|
| Condition ID | COND-005 |
| Condition Name | Change Concentration Accumulation |
| CKR Reference | CKR-012 |
| Class | activity |
| Governing Model | Stream 75.1 — Program Condition Model |
| Temporal Reference | time-series (inherited from SIG-003) |
| Activation Coverage State | blocked |

**Required Signal Inputs:**

| Signal | Coverage State | Available Value |
|---|---|---|
| SIG-003 — Change event rate | blocked | — (AT-001: automation trigger frequency — time-series; not in static 40.4 inputs) |
| SIG-003 — Per-event concentration | blocked | — (AT-002: auto-commit event frequency — time-series; AT-003 dependent on AT-001) |

**Activation Logic (per Stream 75.1):**
Stream 75.1 evaluates COND-005 using SIG-003 time-series accumulation across successive intervals. Activation requires SIG-003 to be computed; SIG-003 is blocked by missing GitHub-dependent time-series telemetry.

**Activation Readiness:** BLOCKED — SIG-003 unavailable. Condition evaluation cannot proceed until AT-001 and AT-002 time-series telemetry is accumulated from live repository activity.

---

## COND-006 — Execution Instability

| Field | Value |
|---|---|
| Condition ID | COND-006 |
| Condition Name | Execution Instability |
| CKR Reference | CKR-012 |
| Class | execution |
| Governing Model | Stream 75.1 — Program Condition Model |
| Temporal Reference | event-based (inherited from SIG-006) |
| Activation Coverage State | blocked |

**Required Signal Inputs:**

| Signal | Coverage State | Available Value |
|---|---|---|
| SIG-006 — Per-run stability | blocked | — (DT-007: pipeline run completion status; requires live pipeline execution) |
| SIG-006 — Gate enforcement rate | blocked | — (AT-007: validation gate enforcement per run; requires live pipeline execution) |
| SIG-006 — Feedback closure rate | blocked | — (AT-009, DT-008: feedback routing and delivery per run; requires live pipeline execution) |

**Activation Logic (per Stream 75.1):**
Stream 75.1 evaluates COND-006 using SIG-006 per-run stability metrics. Activation requires SIG-006 event-based values from pipeline execution runs; no pipeline runs recorded in current 40.4 inputs.

**Activation Readiness:** BLOCKED — SIG-006 unavailable. Condition evaluation cannot proceed until DT-007, AT-007, AT-009, DT-008 event-based telemetry is recorded from live pipeline executions.

---

## COND-007 — Execution Health Deficit

| Field | Value |
|---|---|
| Condition ID | COND-007 |
| Condition Name | Execution Health Deficit |
| CKR Reference | CKR-012 |
| Class | composite |
| Governing Model | Stream 75.1 — Program Condition Model |
| Temporal Reference | event-based (inherited from SIG-007 ESI) |
| Activation Coverage State | partial |

**Required Signal Inputs:**

| Signal | Via | Coverage State | Available Value |
|---|---|---|---|
| SIG-007 — ESI Dependency Load component | SIG-002 | complete | ratio: 0.682 |
| SIG-007 — ESI Execution Throughput component | SIG-005 | partial | constants: 8 stages, 9 artifacts/run |
| SIG-007 — ESI Execution Stability component | SIG-006 | blocked (via SIG-006) | pending |

**Activation Logic (per Stream 75.1):**
Stream 75.1 evaluates COND-007 using full SIG-007 (ESI) composite output. Full ESI computation requires all three component signals (SIG-002, SIG-005, SIG-006). SIG-006 component is blocked, preventing full ESI computation and full condition evaluation.

**Activation Readiness:** PARTIAL — SIG-002 component resolved; SIG-005 partial component available; SIG-006 component blocked. Full condition evaluation pending SIG-006.

---

## COND-008 — Risk Acceleration State

| Field | Value |
|---|---|
| Condition ID | COND-008 |
| Condition Name | Risk Acceleration State |
| CKR Reference | CKR-012 |
| Class | composite |
| Governing Model | Stream 75.1 — Program Condition Model |
| Temporal Reference | time-series (inherited from SIG-008 RAG) |
| Activation Coverage State | partial |

**Required Signal Inputs:**

| Signal | Via | Coverage State | Available Value |
|---|---|---|---|
| SIG-008 — RAG Structural Volatility component | SIG-004 | complete | ratios: 1.273/0.545/0.364/0.455 |
| SIG-008 — RAG Coordination Pressure component | SIG-001 | partial | structural: 0.875; runtime pending |
| SIG-008 — RAG Change Concentration component | SIG-003 | blocked (via SIG-003) | pending |

**Activation Logic (per Stream 75.1):**
Stream 75.1 evaluates COND-008 using full SIG-008 (RAG) composite output across successive temporal intervals. Full RAG gradient computation requires SIG-003 time-series data; SIG-003 is blocked.

**Activation Readiness:** PARTIAL — SIG-004 and SIG-001 structural components resolved; SIG-003 time-series component blocked. Full condition evaluation pending SIG-003.

---

## Activation Specification Summary

| Condition ID | Name | CKR | Temporal | Governing Signal(s) | Activation State |
|---|---|---|---|---|---|
| COND-001 | Dependency Load Elevation | CKR-012 | static | SIG-002 | evaluable |
| COND-002 | Structural Volatility State | CKR-012 | static | SIG-004 | evaluable |
| COND-003 | Coordination Pressure Active | CKR-012 | static + event-based | SIG-001 | partial |
| COND-004 | Throughput Degradation Risk | CKR-012 | event-based | SIG-005 | partial |
| COND-005 | Change Concentration Accumulation | CKR-012 | time-series | SIG-003 | blocked |
| COND-006 | Execution Instability | CKR-012 | event-based | SIG-006 | blocked |
| COND-007 | Execution Health Deficit | CKR-012 | event-based | SIG-007 | partial |
| COND-008 | Risk Acceleration State | CKR-012 | time-series | SIG-008 | partial |

**Evaluable: 2 | Partial: 4 | Blocked: 2**

---

## State–Diagnosis Separation Declaration

This specification activates conditions only. Conditions declared evaluable, partial, or blocked represent coverage states of the activation pipeline, not diagnosis outputs. No cause attribution, remediation recommendation, or diagnostic inference is produced in this stream. Diagnosis is the exclusive authority of Stream 75.2 — Program Diagnosis Model, applied in downstream pipeline stages.

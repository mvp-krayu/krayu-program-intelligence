# Condition Output Set

**Stream:** 40.6 — PiOS Condition Activation Engine
**Input:** docs/pios/40.5/signal_output_set.md, docs/pios/40.6/condition_input_matrix.md, docs/pios/40.6/condition_activation_specification.md
**Date:** 2026-03-18

---

## Output Rule

This document records the activation output for each governed program condition. Where all required signals are complete, the condition is declared evaluable and its signal input values are passed to Stream 75.1. Where required signals are partial or blocked, the condition activation state and the reason are explicitly declared. No condition value is fabricated, inferred, or estimated. No interpretation, diagnosis, or remediation recommendation is attached to any output.

---

## COND-001 — Dependency Load Elevation (CKR-012)

| Field | Value |
|---|---|
| Condition ID | COND-001 |
| Condition Name | Dependency Load Elevation |
| CKR Reference | CKR-012 |
| Temporal Reference | static |
| Activation Coverage State | evaluable |

**Signal Input Values Passed to Stream 75.1:**

| Input | Signal ID | Value |
|---|---|---|
| Dependency load ratio | SIG-002 | 0.682 |
| Dependency edge count | SIG-002 | 15 |
| Total node count (denominator) | SIG-002 (via ST-007) | 22 |

**Activation Output:** EVALUABLE — signal inputs complete; Stream 75.1 threshold evaluation authorized. Activation result is the authority of Stream 75.1.

---

## COND-002 — Structural Volatility State (CKR-012)

| Field | Value |
|---|---|
| Condition ID | COND-002 |
| Condition Name | Structural Volatility State |
| CKR Reference | CKR-012 |
| Temporal Reference | static |
| Activation Coverage State | evaluable |

**Signal Input Values Passed to Stream 75.1:**

| Input | Signal ID | Value |
|---|---|---|
| Edge-to-node ratio | SIG-004 | 1.273 |
| Containment density ratio | SIG-004 | 0.545 |
| Responsibility distribution | SIG-004 | 0.364 |
| Module surface ratio | SIG-004 | 0.455 |

**Activation Output:** EVALUABLE — all four SIG-004 ratio outputs available; Stream 75.1 threshold evaluation authorized.

---

## COND-003 — Coordination Pressure Active (CKR-012)

| Field | Value |
|---|---|
| Condition ID | COND-003 |
| Condition Name | Coordination Pressure Active |
| CKR Reference | CKR-012 |
| Temporal Reference | static + event-based |
| Activation Coverage State | partial |

**Resolved Signal Input Values:**

| Input | Signal ID | Value |
|---|---|---|
| Structural coordination ratio | SIG-001 | 0.875 |

**Pending Signal Input Values:**

| Input | Signal ID | Required Telemetry | State |
|---|---|---|---|
| Runtime coordination events per run | SIG-001 | AT-005, AT-007 | pending live telemetry |

**Activation Output:** PARTIAL — structural coordination component available (0.875); runtime event-based component pending. Full condition evaluation requires complete SIG-001.

---

## COND-004 — Throughput Degradation Risk (CKR-012)

| Field | Value |
|---|---|
| Condition ID | COND-004 |
| Condition Name | Throughput Degradation Risk |
| CKR Reference | CKR-012 |
| Temporal Reference | event-based |
| Activation Coverage State | partial |

**Resolved Signal Input Values:**

| Input | Signal ID | Value |
|---|---|---|
| Stage throughput per run | SIG-005 | 8 stages/run |
| Total artifacts per run | SIG-005 | 9 artifacts/run |
| Internal delivery per run | SIG-005 | 5 artifacts/run |
| Intelligence output per run | SIG-005 | 4 artifacts/run |

**Pending Signal Input Values:**

| Input | Signal ID | Required Telemetry | State |
|---|---|---|---|
| Completion factor | SIG-005 | DT-007 | pending live telemetry |
| Execution mode context | SIG-005 | AT-006 | pending live telemetry |

**Activation Output:** PARTIAL — throughput constants available; completion-conditioned rate pending. Full condition evaluation requires complete SIG-005.

---

## COND-005 — Change Concentration Accumulation (CKR-012)

| Field | Value |
|---|---|
| Condition ID | COND-005 |
| Condition Name | Change Concentration Accumulation |
| CKR Reference | CKR-012 |
| Temporal Reference | time-series |
| Activation Coverage State | blocked |

**Blocked Signal:**

| Signal | Blocking Reason |
|---|---|
| SIG-003 | Requires AT-001 (automation trigger frequency, time-series) and AT-002 (auto-commit event frequency, time-series). These are GitHub repository activity metrics accumulated over successive intervals, not present in static 40.4 inputs. |

**Activation Output:** BLOCKED — SIG-003 unavailable. No condition values declared. No fabrication. No inference.

---

## COND-006 — Execution Instability (CKR-012)

| Field | Value |
|---|---|
| Condition ID | COND-006 |
| Condition Name | Execution Instability |
| CKR Reference | CKR-012 |
| Temporal Reference | event-based |
| Activation Coverage State | blocked |

**Blocked Signal:**

| Signal | Blocking Reason |
|---|---|
| SIG-006 | Requires DT-007 (pipeline run completion status, event-based) and AT-007 (validation gate enforcement count per run, event-based). These require live pipeline execution records; no pipeline runs recorded in static 40.4 inputs. |

**Activation Output:** BLOCKED — SIG-006 unavailable. No condition values declared. No fabrication. No inference.

---

## COND-007 — Execution Health Deficit (CKR-012)

| Field | Value |
|---|---|
| Condition ID | COND-007 |
| Condition Name | Execution Health Deficit |
| CKR Reference | CKR-012 |
| Temporal Reference | event-based |
| Activation Coverage State | partial |

**Component Status:**

| Component | Via Signal | Coverage State | Available Values |
|---|---|---|---|
| Dependency Load component | SIG-002 | complete | ratio: 0.682; edges: 15 |
| Execution Throughput component | SIG-005 | partial | constants: 8 stages, 9 artifacts/run |
| Execution Stability component | SIG-006 | blocked | — |

**Activation Output:** PARTIAL — SIG-002 component resolved; SIG-005 partial; SIG-006 blocked. Full ESI composite and full condition evaluation pending SIG-006.

---

## COND-008 — Risk Acceleration State (CKR-012)

| Field | Value |
|---|---|
| Condition ID | COND-008 |
| Condition Name | Risk Acceleration State |
| CKR Reference | CKR-012 |
| Temporal Reference | time-series |
| Activation Coverage State | partial |

**Component Status:**

| Component | Via Signal | Coverage State | Available Values |
|---|---|---|---|
| Structural Volatility component | SIG-004 | complete | edge-to-node: 1.273; containment: 0.545; responsibility: 0.364; module: 0.455 |
| Coordination Pressure component | SIG-001 | partial | structural ratio: 0.875; runtime pending |
| Change Concentration component | SIG-003 | blocked | — |

**Activation Output:** PARTIAL — SIG-004 and SIG-001 structural components resolved; SIG-003 time-series component blocked. Full RAG gradient and full condition evaluation pending SIG-003.

---

## Condition Output Summary

| Condition ID | Name | CKR | Temporal | Activation State | Signal Values Available |
|---|---|---|---|---|---|
| COND-001 | Dependency Load Elevation | CKR-012 | static | evaluable | SIG-002: ratio=0.682, edges=15 |
| COND-002 | Structural Volatility State | CKR-012 | static | evaluable | SIG-004: 1.273/0.545/0.364/0.455 |
| COND-003 | Coordination Pressure Active | CKR-012 | static + event-based | partial | SIG-001: structural=0.875 |
| COND-004 | Throughput Degradation Risk | CKR-012 | event-based | partial | SIG-005: 8 stages, 9 artifacts/run |
| COND-005 | Change Concentration Accumulation | CKR-012 | time-series | blocked | — |
| COND-006 | Execution Instability | CKR-012 | event-based | blocked | — |
| COND-007 | Execution Health Deficit | CKR-012 | event-based | partial | SIG-002: 0.682; SIG-005: partial constants |
| COND-008 | Risk Acceleration State | CKR-012 | time-series | partial | SIG-004: full ratios; SIG-001: structural 0.875 |

**Evaluable: 2 | Partial: 4 | Blocked: 2**
**All outputs: no interpretation, no diagnosis, no cause attribution attached**

---

## Governance Note

Evidence-First Principle (GC-06) governs this output. State–Diagnosis Separation Principle (GC-07) prohibits diagnostic content. Missing runtime telemetry blocks condition activation exactly as it blocked signal computation in 40.5. No values fabricated or inferred. Final execution status: PARTIAL.

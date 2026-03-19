# Condition Traceability Map

**Stream:** 40.6 — PiOS Condition Activation Engine
**Input:** docs/pios/40.6/condition_input_matrix.md, docs/pios/40.6/condition_activation_specification.md, docs/pios/40.6/condition_output_set.md
**Date:** 2026-03-18

---

## Traceability Rule

Every governed condition must trace to:
1. A governed condition definition under CKR-012 (Program Conditions)
2. One or more governed 40.5 signals as explicit inputs
3. The 40.5 artifact in which each signal is defined
4. The CKR reference for each governing signal
5. A temporal reference (inherited from governing signal)

No condition is valid without complete traceability. No traceability entry may reference 40.2, 40.3, or 40.4 artifacts directly — only 40.5 signal artifacts are in scope.

---

## COND-001 — Dependency Load Elevation Traceability

| Condition ID | CKR | Signal Input | Signal ID | Signal CKR | 40.5 Artifact | Temporal |
|---|---|---|---|---|---|---|
| COND-001 | CKR-012 | Dependency load ratio | SIG-002 | CKR-007 | signal_output_set.md | static |
| COND-001 | CKR-012 | Dependency edge count | SIG-002 | CKR-007 | signal_output_set.md | static |

**CKR governance chain:** COND-001 → CKR-012 (Program Conditions) → SIG-002 (CKR-007, Dependency Load) → ST-012, ST-013, ST-014, ST-015, ST-007 (structural_telemetry.md via 40.4)
**Temporal inheritance:** static (from SIG-002)
**Coverage state:** evaluable

---

## COND-002 — Structural Volatility State Traceability

| Condition ID | CKR | Signal Input | Signal ID | Signal CKR | 40.5 Artifact | Temporal |
|---|---|---|---|---|---|---|
| COND-002 | CKR-012 | Edge-to-node ratio | SIG-004 | CKR-009 | signal_output_set.md | static |
| COND-002 | CKR-012 | Containment density ratio | SIG-004 | CKR-009 | signal_output_set.md | static |
| COND-002 | CKR-012 | Responsibility distribution | SIG-004 | CKR-009 | signal_output_set.md | static |
| COND-002 | CKR-012 | Module surface ratio | SIG-004 | CKR-009 | signal_output_set.md | static |

**CKR governance chain:** COND-002 → CKR-012 → SIG-004 (CKR-009, Structural Volatility) → ST-007, ST-010, ST-009, ST-022, ST-006, ST-011 (structural_telemetry.md via 40.4)
**Temporal inheritance:** static (from SIG-004)
**Coverage state:** evaluable

---

## COND-003 — Coordination Pressure Active Traceability

| Condition ID | CKR | Signal Input | Signal ID | Signal CKR | 40.5 Artifact | Temporal |
|---|---|---|---|---|---|---|
| COND-003 | CKR-012 | Structural coordination ratio | SIG-001 | CKR-006 | signal_output_set.md | static |
| COND-003 | CKR-012 | Runtime coordination events per run | SIG-001 | CKR-006 | signal_output_set.md | event-based |

**CKR governance chain:** COND-003 → CKR-012 → SIG-001 (CKR-006, Coordination Pressure) → ST-016, ST-012, AT-005, AT-007 (structural_telemetry.md, activity_telemetry.md via 40.4)
**Temporal inheritance:** static + event-based (from SIG-001)
**Coverage state:** partial (event-based component pending)

---

## COND-004 — Throughput Degradation Risk Traceability

| Condition ID | CKR | Signal Input | Signal ID | Signal CKR | 40.5 Artifact | Temporal |
|---|---|---|---|---|---|---|
| COND-004 | CKR-012 | Stage throughput per run | SIG-005 | CKR-010 | signal_output_set.md | event-based |
| COND-004 | CKR-012 | Total artifacts per run | SIG-005 | CKR-010 | signal_output_set.md | event-based |
| COND-004 | CKR-012 | Completion factor | SIG-005 | CKR-010 | signal_output_set.md | event-based |
| COND-004 | CKR-012 | Execution mode context | SIG-005 | CKR-010 | signal_output_set.md | event-based |

**CKR governance chain:** COND-004 → CKR-012 → SIG-005 (CKR-010, Execution Throughput) → AT-005, AT-006, DT-001, DT-003, DT-007 (activity_telemetry.md, delivery_telemetry.md via 40.4)
**Temporal inheritance:** event-based (from SIG-005)
**Coverage state:** partial (DT-007, AT-006 pending)

---

## COND-005 — Change Concentration Accumulation Traceability

| Condition ID | CKR | Signal Input | Signal ID | Signal CKR | 40.5 Artifact | Temporal |
|---|---|---|---|---|---|---|
| COND-005 | CKR-012 | Change event rate | SIG-003 | CKR-008 | signal_output_set.md | time-series |
| COND-005 | CKR-012 | Per-event concentration | SIG-003 | CKR-008 | signal_output_set.md | time-series |

**CKR governance chain:** COND-005 → CKR-012 → SIG-003 (CKR-008, Change Concentration) → AT-001, AT-002, AT-003 (activity_telemetry.md via 40.4) — BLOCKED
**Temporal inheritance:** time-series (from SIG-003)
**Coverage state:** blocked (SIG-003 blocked by missing AT-001, AT-002 time-series telemetry)

---

## COND-006 — Execution Instability Traceability

| Condition ID | CKR | Signal Input | Signal ID | Signal CKR | 40.5 Artifact | Temporal |
|---|---|---|---|---|---|---|
| COND-006 | CKR-012 | Per-run stability | SIG-006 | CKR-011 | signal_output_set.md | event-based |
| COND-006 | CKR-012 | Gate enforcement rate | SIG-006 | CKR-011 | signal_output_set.md | event-based |
| COND-006 | CKR-012 | Feedback closure rate | SIG-006 | CKR-011 | signal_output_set.md | event-based |

**CKR governance chain:** COND-006 → CKR-012 → SIG-006 (CKR-011, Execution Stability) → DT-007, AT-007, AT-009, DT-008 (delivery_telemetry.md, activity_telemetry.md via 40.4) — BLOCKED
**Temporal inheritance:** event-based (from SIG-006)
**Coverage state:** blocked (SIG-006 blocked by missing DT-007, AT-007 event-based pipeline run telemetry)

---

## COND-007 — Execution Health Deficit Traceability (Composite)

| Condition ID | CKR | Via Component | Component Signal | Signal CKR | 40.5 Artifact | Temporal |
|---|---|---|---|---|---|---|
| COND-007 | CKR-012 | CKR-014 (ESI) | SIG-007 (via SIG-002) | CKR-007 | signal_output_set.md | static |
| COND-007 | CKR-012 | CKR-014 (ESI) | SIG-007 (via SIG-002) | CKR-007 | signal_output_set.md | static |
| COND-007 | CKR-012 | CKR-014 (ESI) | SIG-007 (via SIG-005) | CKR-010 | signal_output_set.md | event-based |
| COND-007 | CKR-012 | CKR-014 (ESI) | SIG-007 (via SIG-005) | CKR-010 | signal_output_set.md | event-based |
| COND-007 | CKR-012 | CKR-014 (ESI) | SIG-007 (via SIG-006) | CKR-011 | signal_output_set.md | event-based |

**CKR governance chain:** COND-007 → CKR-012 → SIG-007 (CKR-014, ESI) → SIG-002 (CKR-007) + SIG-005 (CKR-010) + SIG-006 (CKR-011) → telemetry inputs (structural_telemetry.md, activity_telemetry.md, delivery_telemetry.md via 40.4)
**Temporal inheritance:** event-based (from SIG-007)
**Coverage state:** partial (SIG-006 component blocked)

---

## COND-008 — Risk Acceleration State Traceability (Composite)

| Condition ID | CKR | Via Component | Component Signal | Signal CKR | 40.5 Artifact | Temporal |
|---|---|---|---|---|---|---|
| COND-008 | CKR-012 | CKR-015 (RAG) | SIG-008 (via SIG-004) | CKR-009 | signal_output_set.md | static |
| COND-008 | CKR-012 | CKR-015 (RAG) | SIG-008 (via SIG-004) | CKR-009 | signal_output_set.md | static |
| COND-008 | CKR-012 | CKR-015 (RAG) | SIG-008 (via SIG-004) | CKR-009 | signal_output_set.md | static |
| COND-008 | CKR-012 | CKR-015 (RAG) | SIG-008 (via SIG-004) | CKR-009 | signal_output_set.md | static |
| COND-008 | CKR-012 | CKR-015 (RAG) | SIG-008 (via SIG-001) | CKR-006 | signal_output_set.md | static |
| COND-008 | CKR-012 | CKR-015 (RAG) | SIG-008 (via SIG-001) | CKR-006 | signal_output_set.md | event-based |
| COND-008 | CKR-012 | CKR-015 (RAG) | SIG-008 (via SIG-003) | CKR-008 | signal_output_set.md | time-series |

**CKR governance chain:** COND-008 → CKR-012 → SIG-008 (CKR-015, RAG) → SIG-004 (CKR-009) + SIG-001 (CKR-006) + SIG-003 (CKR-008) → telemetry inputs (structural_telemetry.md, activity_telemetry.md via 40.4)
**Temporal inheritance:** time-series (from SIG-008)
**Coverage state:** partial (SIG-003 component blocked)

---

## 40.5 Artifact Coverage

| 40.5 Artifact | Signals Providing Condition Inputs | Conditions Fed |
|---|---|---|
| signal_output_set.md | SIG-001, SIG-002, SIG-003, SIG-004, SIG-005, SIG-006, SIG-007, SIG-008 | COND-001 through COND-008 (all) |
| signal_computation_specification.md | Signal temporal references | All conditions (temporal inheritance) |
| signal_traceability_map.md | Signal-to-telemetry chains | All conditions (upstream authority chain) |
| signal_validation_report.md | Signal coverage states | All conditions (coverage propagation) |
| execution_manifest.md | Upstream blocking declarations | COND-005, COND-006, COND-007, COND-008 (blocking inheritance) |

---

## Traceability Completeness Declaration

| Condition | CKR Traced | Signal Inputs Traced | 40.5 Artifact Cited | Temporal Reference | Complete |
|---|---|---|---|---|---|
| COND-001 | yes | yes (2 inputs via SIG-002) | yes | yes | yes |
| COND-002 | yes | yes (4 inputs via SIG-004) | yes | yes | yes |
| COND-003 | yes | yes (2 inputs via SIG-001) | yes | yes | yes |
| COND-004 | yes | yes (4 inputs via SIG-005) | yes | yes | yes |
| COND-005 | yes | yes (2 inputs via SIG-003) | yes | yes | yes |
| COND-006 | yes | yes (3 inputs via SIG-006) | yes | yes | yes |
| COND-007 | yes | yes (5 inputs via SIG-007 composite) | yes | yes | yes |
| COND-008 | yes | yes (7 inputs via SIG-008 composite) | yes | yes | yes |

**Total conditions traced: 8 / 8**
**Total signal input mappings traced: 29 (including composite condition chains)**
**Conditions with missing traceability: 0**

# Intelligence Output Set

**run_id:** run_01_intelligence_synthesis
**stream:** Stream 40.7 — PiOS Intelligence Synthesis Layer
**contract:** PIOS-40.7-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_01_condition_activation (Stream 40.6)
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Output Rule

This document records intelligence synthesis outputs for run_01_intelligence_synthesis. All diagnosis values are carried forward exactly from the normalized diagnosis registry (WP2) — no recomputation, no modification. Intelligence synthesis states are derived exclusively from diagnosis activation propagation. No root cause attribution. No threshold evaluation. No narrative interpretation.

---

## Synthesized Intelligence

### INTEL-001 — Dependency Load Elevation

| Field | Value |
|---|---|
| intel_id | INTEL-001 |
| canonical_name | Dependency Load Elevation |
| source_diagnosis | DIAG-001 |
| originating_condition | COND-001 |
| supporting_signals | SIG-002 (Dependency Load) |
| diagnosis_activation_state | active |
| synthesis_state | **synthesized** |
| completeness_state | complete |
| evidence_scope | full — SIG-002 static structural evidence available |

**Values (carried from IVAR_001, unmodified):**

| Component | Value |
|---|---|
| Dependency Load ratio | 0.682 |
| Dependency edge count | 15 |

**Evidence-bounded scope note:** Supported by full SIG-002 evidence (static, 40.4 structural telemetry). No runtime component. Threshold evaluation: Stream 75.1. Root cause attribution: Stream 75.2.

---

### INTEL-002 — Structural Volatility State

| Field | Value |
|---|---|
| intel_id | INTEL-002 |
| canonical_name | Structural Volatility State |
| source_diagnosis | DIAG-002 |
| originating_condition | COND-002 |
| supporting_signals | SIG-004 (Structural Volatility) |
| diagnosis_activation_state | active |
| synthesis_state | **synthesized** |
| completeness_state | complete |
| evidence_scope | full — SIG-004 static structural evidence available |

**Values (carried from IVAR_002, unmodified):**

| Component | Value |
|---|---|
| Total edge density (ST-010 / ST-007) | 1.273 |
| Containment density (ST-011 / ST-007) | 0.545 |
| Responsibility density (ST-006 / ST-007) | 0.364 |
| Module density (ST-009 / ST-007) | 0.455 |

**Evidence-bounded scope note:** Supported by full SIG-004 evidence — four structural density ratios (static 40.4 telemetry: ST-006, ST-007, ST-009, ST-010, ST-011). No runtime component. Threshold evaluation: Stream 75.1. Root cause attribution: Stream 75.2.

---

## Partial Intelligence

### INTEL-003 — Coordination Pressure Active

| Field | Value |
|---|---|
| intel_id | INTEL-003 |
| canonical_name | Coordination Pressure Active |
| source_diagnosis | DIAG-003 |
| originating_condition | COND-003 |
| supporting_signals | SIG-001 (Coordination Pressure) |
| diagnosis_activation_state | partial |
| synthesis_state | **partial — structural component synthesized; runtime component UNDEFINED** |
| completeness_state | partial |
| evidence_scope | partial — SIG-001 static component only; runtime component absent |

**Values (carried from IVAR_003, resolved components only):**

| Component | Value | Status |
|---|---|---|
| Structural ratio (ST-012 / ST-016) | 0.875 | synthesized |
| Runtime gate component (AT-007) | UNDEFINED | blocked |

**Evidence-bounded scope note:** Supported by static structural component of SIG-001 (7 of 8 structural interfaces cross-team; ST-012/ST-016). Runtime gate component (AT-007) requires live pipeline event data — unavailable. Intelligence is partial. Threshold evaluation: Stream 75.1. Root cause attribution: Stream 75.2.

---

### INTEL-004 — Throughput Degradation Risk

| Field | Value |
|---|---|
| intel_id | INTEL-004 |
| canonical_name | Throughput Degradation Risk |
| source_diagnosis | DIAG-004 |
| originating_condition | COND-004 |
| supporting_signals | SIG-005 (Execution Throughput) |
| diagnosis_activation_state | partial |
| synthesis_state | **partial — throughput rate synthesized; completion factor UNDEFINED** |
| completeness_state | partial |
| evidence_scope | partial — SIG-005 static component only; completion factor absent |

**Values (carried from IVAR_004, resolved components only):**

| Component | Value | Status |
|---|---|---|
| Throughput rate (AT-005, DT-001, DT-003) | 1.125 artifacts/stage | synthesized |
| Completion factor (DT-007) | UNDEFINED | blocked |

**Evidence-bounded scope note:** Supported by static throughput rate from SIG-005 (9 artifacts / 8 stages = 1.125). Completion factor (DT-007) requires event-based delivery telemetry — unavailable. Intelligence is partial. Threshold evaluation: Stream 75.1. Root cause attribution: Stream 75.2.

---

### INTEL-007 — Execution Health Deficit

| Field | Value |
|---|---|
| intel_id | INTEL-007 |
| canonical_name | Execution Health Deficit |
| source_diagnosis | DIAG-007 |
| originating_condition | COND-007 |
| supporting_signals | SIG-007 (ESI composite; SIG-002 component active) |
| diagnosis_activation_state | partial |
| synthesis_state | **partial — SIG-002 ESI component synthesized; SIG-005 completion and SIG-006 UNDEFINED** |
| completeness_state | partial |
| evidence_scope | partial — SIG-002 ESI contribution only; ESI composite not computable |

**Values (carried from IVAR_007, resolved components only):**

| Component | Value | Status |
|---|---|---|
| SIG-002 (Dependency Load) ESI component | 0.682 | synthesized |
| SIG-005 (Execution Throughput) completion | UNDEFINED | blocked |
| SIG-006 (Execution Stability) | UNDEFINED | blocked |

**Evidence-bounded scope note:** Supported by SIG-002 contribution to SIG-007 (ESI) only. SIG-005 completion factor and SIG-006 are UNDEFINED — both require live event-based pipeline data. ESI composite value cannot be computed. Intelligence is partial. Threshold evaluation: Stream 75.1. Root cause attribution: Stream 75.2.

---

### INTEL-008 — Risk Acceleration State

| Field | Value |
|---|---|
| intel_id | INTEL-008 |
| canonical_name | Risk Acceleration State |
| source_diagnosis | DIAG-008 |
| originating_condition | COND-008 |
| supporting_signals | SIG-008 (RAG composite; SIG-001, SIG-004 active; SIG-003 UNDEFINED) |
| diagnosis_activation_state | partial |
| synthesis_state | **partial — SIG-001 and SIG-004 RAG components synthesized; SIG-003 component UNDEFINED** |
| completeness_state | partial |
| evidence_scope | partial — structural and volatility RAG components only; change concentration component absent |

**Values (carried from IVAR_008, resolved components only):**

| Component | Value | Status |
|---|---|---|
| SIG-001 structural ratio | 0.875 | synthesized |
| SIG-004 total edge density | 1.273 | synthesized |
| SIG-004 containment density | 0.545 | synthesized |
| SIG-004 responsibility density | 0.364 | synthesized |
| SIG-004 module density | 0.455 | synthesized |
| SIG-003 (Change Concentration) | UNDEFINED | blocked |

**Evidence-bounded scope note:** Supported by SIG-001 and SIG-004 contributions to SIG-008 (RAG). SIG-003 contribution is UNDEFINED — blocked due to AT-001/AT-002 time-series absence. RAG composite value is not fully computable. Intelligence is partial. Threshold evaluation: Stream 75.1. Root cause attribution: Stream 75.2.

---

## Blocked Intelligence

| Intelligence | Canonical Name | Source Diagnosis | Diagnosis State | Blocking Origin |
|---|---|---|---|---|
| INTEL-005 | Change Concentration Accumulation | DIAG-005 | blocked | SIG-003 BLOCKED — AT-001, AT-002 time-series absent from static telemetry |
| INTEL-006 | Execution Instability | DIAG-006 | blocked | SIG-006 BLOCKED — AT-007, AT-009, DT-007, DT-008 event-based; live pipeline required |

---

## Coverage Summary

| Category | Count | Intelligence IDs |
|---|---|---|
| Synthesized | 2 | INTEL-001, INTEL-002 |
| Partial | 4 | INTEL-003, INTEL-004, INTEL-007, INTEL-008 |
| Blocked | 2 | INTEL-005, INTEL-006 |

---

## Governance Lock

| Principle | Application |
|---|---|
| Evidence-First (GC-06) | All UNDEFINED diagnosis components propagate as UNDEFINED — no fabrication |
| State–Diagnosis Separation (GC-07) | Intelligence entries are coverage synthesis records only — no threshold evaluation, no root cause attribution |
| No diagnosis recomputation | All values carried from IVAR_ inputs; no new computation |
| No fabrication | Blocked/UNDEFINED intelligence entries carry no estimated synthesis state |
| Root cause authority | Stream 75.2 — Program Diagnosis Model |
| Threshold authority | Stream 75.1 — Program Condition Model |
| intelligence_output_completeness | PARTIAL (governed) |

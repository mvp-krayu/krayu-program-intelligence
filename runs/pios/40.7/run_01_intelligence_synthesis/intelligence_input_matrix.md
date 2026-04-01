# Intelligence Input Matrix

**run_id:** run_01_intelligence_synthesis
**stream:** Stream 40.7 — PiOS Intelligence Synthesis Layer
**contract:** PIOS-40.7-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_01_condition_activation (Stream 40.6)
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Input Boundary Declaration

All intelligence inputs sourced exclusively from the normalized diagnosis registry (diagnosis_normalization_report.md, this run). No 40.6 artifacts accessed beyond what was already verified and normalized in WP1–WP2. No 40.5, 40.4, 41.x, 42.x paths accessed.

---

## Intelligence Input Variables (IVAR_)

Each IVAR_ maps one normalized diagnosis entry to one intelligence synthesis entry. Diagnosis activation state is inherited without modification.

| IVAR | Diagnosis | Diagnosis State | Active Components | Intelligence Entry |
|---|---|---|---|---|
| IVAR_001 | DIAG-001 Dependency Load Elevation | active | ratio: 0.682; edge count: 15 | INTEL-001 |
| IVAR_002 | DIAG-002 Structural Volatility State | active | 1.273 / 0.545 / 0.364 / 0.455 | INTEL-002 |
| IVAR_003 | DIAG-003 Coordination Pressure Active | partial | struct ratio: 0.875 | INTEL-003 |
| IVAR_004 | DIAG-004 Throughput Degradation Risk | partial | throughput rate: 1.125 | INTEL-004 |
| IVAR_005 | DIAG-005 Change Concentration Accumulation | blocked | — | INTEL-005 |
| IVAR_006 | DIAG-006 Execution Instability | blocked | — | INTEL-006 |
| IVAR_007 | DIAG-007 Execution Health Deficit | partial | SIG-002 component: 0.682 | INTEL-007 |
| IVAR_008 | DIAG-008 Risk Acceleration State | partial | SIG-001: 0.875; SIG-004 ×4 | INTEL-008 |

---

## IVAR Detail Records

### IVAR_001

| Field | Value |
|---|---|
| ivar_id | IVAR_001 |
| source_diagnosis | DIAG-001 |
| originating_condition | COND-001 |
| supporting_signals | SIG-002 |
| diagnosis_state | active |
| active_components | ratio: 0.682; dependency edge count: 15 |
| undefined_components | — |
| blocking_inputs | — |
| completeness_state | complete |

### IVAR_002

| Field | Value |
|---|---|
| ivar_id | IVAR_002 |
| source_diagnosis | DIAG-002 |
| originating_condition | COND-002 |
| supporting_signals | SIG-004 |
| diagnosis_state | active |
| active_components | total edge density: 1.273; containment density: 0.545; responsibility density: 0.364; module density: 0.455 |
| undefined_components | — |
| blocking_inputs | — |
| completeness_state | complete |

### IVAR_003

| Field | Value |
|---|---|
| ivar_id | IVAR_003 |
| source_diagnosis | DIAG-003 |
| originating_condition | COND-003 |
| supporting_signals | SIG-001 |
| diagnosis_state | partial |
| active_components | structural ratio: 0.875 (ST-012 / ST-016) |
| undefined_components | runtime gate component (AT-007) |
| blocking_inputs | AT-007 event-based; live pipeline required |
| completeness_state | partial |

### IVAR_004

| Field | Value |
|---|---|
| ivar_id | IVAR_004 |
| source_diagnosis | DIAG-004 |
| originating_condition | COND-004 |
| supporting_signals | SIG-005 |
| diagnosis_state | partial |
| active_components | throughput rate: 1.125 artifacts/stage (AT-005, DT-001, DT-003) |
| undefined_components | completion factor (DT-007) |
| blocking_inputs | DT-007 event-based; live pipeline required |
| completeness_state | partial |

### IVAR_005

| Field | Value |
|---|---|
| ivar_id | IVAR_005 |
| source_diagnosis | DIAG-005 |
| originating_condition | COND-005 |
| supporting_signals | SIG-003 |
| diagnosis_state | blocked |
| active_components | — |
| undefined_components | all (AT-001, AT-002 time-series absent) |
| blocking_inputs | AT-001, AT-002 push-to-main time-series; GitHub-dependent |
| completeness_state | blocked |

### IVAR_006

| Field | Value |
|---|---|
| ivar_id | IVAR_006 |
| source_diagnosis | DIAG-006 |
| originating_condition | COND-006 |
| supporting_signals | SIG-006 |
| diagnosis_state | blocked |
| active_components | — |
| undefined_components | all (AT-007, AT-009, DT-007, DT-008 event-based) |
| blocking_inputs | AT-007, AT-009, DT-007, DT-008; live pipeline required |
| completeness_state | blocked |

### IVAR_007

| Field | Value |
|---|---|
| ivar_id | IVAR_007 |
| source_diagnosis | DIAG-007 |
| originating_condition | COND-007 |
| supporting_signals | SIG-007 (ESI composite; SIG-002 component active) |
| diagnosis_state | partial |
| active_components | SIG-002 (Dependency Load) component: 0.682 |
| undefined_components | SIG-005 completion factor; SIG-006 (all UNDEFINED) |
| blocking_inputs | SIG-005 DT-007; SIG-006 AT-007/AT-009/DT-007/DT-008 |
| completeness_state | partial |

### IVAR_008

| Field | Value |
|---|---|
| ivar_id | IVAR_008 |
| source_diagnosis | DIAG-008 |
| originating_condition | COND-008 |
| supporting_signals | SIG-008 (RAG composite; SIG-001 and SIG-004 active; SIG-003 UNDEFINED) |
| diagnosis_state | partial |
| active_components | SIG-001 structural ratio: 0.875; SIG-004 total: 1.273; contain: 0.545; resp: 0.364; module: 0.455 |
| undefined_components | SIG-003 (Change Concentration) component |
| blocking_inputs | SIG-003 BLOCKED — AT-001, AT-002 time-series absent |
| completeness_state | partial |

---

## Intelligence Synthesis Coverage Propagation Rule

Diagnosis activation state propagates to intelligence synthesis state:

| Diagnosis Activation State | Intelligence Synthesis State |
|---|---|
| active | synthesized — full diagnosis basis available |
| partial | partial — resolved diagnosis component(s) only |
| blocked | blocked — no intelligence synthesis |

No intelligence synthesis state may exceed its source diagnosis activation state. No fabrication. No inference. No silent omission of blocked entries.

---

## IVAR Summary

| IVAR | Diagnosis | Diagnosis State | Expected Intelligence State |
|---|---|---|---|
| IVAR_001 | DIAG-001 | active | synthesized |
| IVAR_002 | DIAG-002 | active | synthesized |
| IVAR_003 | DIAG-003 | partial | partial |
| IVAR_004 | DIAG-004 | partial | partial |
| IVAR_005 | DIAG-005 | blocked | blocked |
| IVAR_006 | DIAG-006 | blocked | blocked |
| IVAR_007 | DIAG-007 | partial | partial |
| IVAR_008 | DIAG-008 | partial | partial |

**Synthesized (active): 2 — IVAR_001, IVAR_002**
**Limited (partial): 4 — IVAR_003, IVAR_004, IVAR_007, IVAR_008**
**Blocked: 2 — IVAR_005, IVAR_006**

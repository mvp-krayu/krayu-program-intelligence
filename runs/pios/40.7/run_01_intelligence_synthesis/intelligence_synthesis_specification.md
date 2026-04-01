# Intelligence Synthesis Specification

**run_id:** run_01_intelligence_synthesis
**stream:** Stream 40.7 — PiOS Intelligence Synthesis Layer
**contract:** PIOS-40.7-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_01_condition_activation (Stream 40.6)
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Governing Authority

Intelligence synthesis rules are governed by the deterministic activation structure of Stream 40.7. This stream packages diagnosis activation records into intelligence entries using propagation rules only. No root cause attribution (Stream 75.2 authority). No threshold evaluation (Stream 75.1 authority). No semantic enrichment. No narrative expansion.

Intelligence entries are structured aggregation records — each entry packages the full evidence chain (signal → condition → diagnosis → intelligence) into a single governed form.

---

## Synthesis Rules

| Rule | Specification |
|---|---|
| SR-01 | Each intelligence entry is derived from exactly one IVAR_ input (1:1 diagnosis→intelligence mapping) |
| SR-02 | Intelligence synthesis state is the propagated diagnosis activation state — no elevation permitted |
| SR-03 | All numeric values carried forward exactly from IVAR_ inputs — no recomputation |
| SR-04 | UNDEFINED components remain UNDEFINED in intelligence output — no substitution |
| SR-05 | Blocked intelligence entries are recorded explicitly — no silent omission |
| SR-06 | Each intelligence entry must declare: source DIAG ID, originating COND ID, supporting SIG ID(s), synthesis state, evidence scope note |
| SR-07 | No root cause attribution produced — synthesis state reflects coverage only |
| SR-08 | No threshold values introduced — threshold authority is Stream 75.1 |
| SR-09 | Intelligence label derived from diagnosis canonical name — no relabeling, no reinterpretation |
| SR-10 | Evidence-bounded scope note required per entry — explicitly states what evidence is and is not available |

---

## INTEL-001 — Dependency Load Elevation

| Field | Specification |
|---|---|
| intel_id | INTEL-001 |
| synthesis_rule | SR-01: IVAR_001 → INTEL-001 |
| ivar_input | IVAR_001 |
| source_diagnosis | DIAG-001 |
| originating_condition | COND-001 |
| supporting_signals | SIG-002 |
| diagnosis_state | active |
| synthesis_state | **synthesized** |

**SR-03 Value carry-forward:** ratio = 0.682; dependency edge count = 15

**SR-10 Evidence scope note:** Intelligence entry is supported by full SIG-002 (Dependency Load) evidence. Values are static structural telemetry from 40.4. No runtime component. Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority.

---

## INTEL-002 — Structural Volatility State

| Field | Specification |
|---|---|
| intel_id | INTEL-002 |
| synthesis_rule | SR-01: IVAR_002 → INTEL-002 |
| ivar_input | IVAR_002 |
| source_diagnosis | DIAG-002 |
| originating_condition | COND-002 |
| supporting_signals | SIG-004 |
| diagnosis_state | active |
| synthesis_state | **synthesized** |

**SR-03 Value carry-forward:** total edge density = 1.273; containment density = 0.545; responsibility density = 0.364; module density = 0.455

**SR-10 Evidence scope note:** Intelligence entry is supported by full SIG-004 (Structural Volatility) evidence — four density ratios from static structural telemetry (ST-006, ST-007, ST-009, ST-010, ST-011). No runtime component. Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority.

---

## INTEL-003 — Coordination Pressure Active

| Field | Specification |
|---|---|
| intel_id | INTEL-003 |
| synthesis_rule | SR-01: IVAR_003 → INTEL-003 |
| ivar_input | IVAR_003 |
| source_diagnosis | DIAG-003 |
| originating_condition | COND-003 |
| supporting_signals | SIG-001 |
| diagnosis_state | partial |
| synthesis_state | **partial — structural component synthesized; runtime component UNDEFINED** |

**SR-03 Value carry-forward (resolved components only):** structural ratio = 0.875 (ST-012 / ST-016)

**SR-04 UNDEFINED components:** runtime gate component (AT-007) — UNDEFINED propagated, not substituted

**SR-10 Evidence scope note:** Intelligence entry is supported by the static structural component of SIG-001 (ST-012/ST-016 = 7/8 = 0.875) only. Runtime component requires AT-007 event-based telemetry — unavailable in static 40.4 inputs. Intelligence state is partial, not complete. Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority.

---

## INTEL-004 — Throughput Degradation Risk

| Field | Specification |
|---|---|
| intel_id | INTEL-004 |
| synthesis_rule | SR-01: IVAR_004 → INTEL-004 |
| ivar_input | IVAR_004 |
| source_diagnosis | DIAG-004 |
| originating_condition | COND-004 |
| supporting_signals | SIG-005 |
| diagnosis_state | partial |
| synthesis_state | **partial — throughput rate synthesized; completion factor UNDEFINED** |

**SR-03 Value carry-forward (resolved components only):** throughput rate = 1.125 artifacts/stage (AT-005, DT-001, DT-003)

**SR-04 UNDEFINED components:** completion factor (DT-007) — UNDEFINED propagated

**SR-10 Evidence scope note:** Intelligence entry is supported by static throughput constants from SIG-005 (9 artifacts / 8 stages = 1.125). Completion factor requires DT-007 event-based delivery telemetry — unavailable in static 40.4 inputs. Intelligence state is partial. Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority.

---

## INTEL-005 — Change Concentration Accumulation

| Field | Specification |
|---|---|
| intel_id | INTEL-005 |
| synthesis_rule | SR-01: IVAR_005 → INTEL-005 |
| ivar_input | IVAR_005 |
| source_diagnosis | DIAG-005 |
| originating_condition | COND-005 |
| supporting_signals | SIG-003 |
| diagnosis_state | blocked |
| synthesis_state | **blocked** |

**SR-05 Blocked record:** no synthesis produced. Blocking origin: SIG-003 BLOCKED — AT-001, AT-002 push-to-main time-series absent from static 40.4 telemetry. Explicit record required.

**SR-10 Evidence scope note:** No evidence available for this intelligence entry. SIG-003 (Change Concentration) is fully blocked. AT-001 and AT-002 require GitHub push-to-main event streams across successive intervals — not present in static analysis context. Intelligence entry declared blocked, not omitted.

---

## INTEL-006 — Execution Instability

| Field | Specification |
|---|---|
| intel_id | INTEL-006 |
| synthesis_rule | SR-01: IVAR_006 → INTEL-006 |
| ivar_input | IVAR_006 |
| source_diagnosis | DIAG-006 |
| originating_condition | COND-006 |
| supporting_signals | SIG-006 |
| diagnosis_state | blocked |
| synthesis_state | **blocked** |

**SR-05 Blocked record:** no synthesis produced. Blocking origin: SIG-006 BLOCKED — AT-007, AT-009, DT-007, DT-008 all event-based; live pipeline execution required.

**SR-10 Evidence scope note:** No evidence available for this intelligence entry. SIG-006 (Execution Stability) is fully blocked. All four required inputs are live pipeline event-based — unavailable in static 40.4 context. Intelligence entry declared blocked, not omitted.

---

## INTEL-007 — Execution Health Deficit

| Field | Specification |
|---|---|
| intel_id | INTEL-007 |
| synthesis_rule | SR-01: IVAR_007 → INTEL-007 |
| ivar_input | IVAR_007 |
| source_diagnosis | DIAG-007 |
| originating_condition | COND-007 |
| supporting_signals | SIG-007 (ESI composite) |
| diagnosis_state | partial |
| synthesis_state | **partial — SIG-002 component synthesized; SIG-005 completion and SIG-006 UNDEFINED** |

**SR-03 Value carry-forward (resolved components only):** SIG-002 (Dependency Load) ESI component = 0.682

**SR-04 UNDEFINED components:** SIG-005 completion factor; SIG-006 (Execution Stability) — both UNDEFINED propagated

**SR-10 Evidence scope note:** Intelligence entry is supported by the SIG-002 component of SIG-007 (ESI) only. SIG-005 completion and SIG-006 components are UNDEFINED — dependent on DT-007 and AT-007/AT-009/DT-008 respectively. ESI composite value is not computable. Intelligence state is partial. Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority.

---

## INTEL-008 — Risk Acceleration State

| Field | Specification |
|---|---|
| intel_id | INTEL-008 |
| synthesis_rule | SR-01: IVAR_008 → INTEL-008 |
| ivar_input | IVAR_008 |
| source_diagnosis | DIAG-008 |
| originating_condition | COND-008 |
| supporting_signals | SIG-008 (RAG composite) |
| diagnosis_state | partial |
| synthesis_state | **partial — SIG-001 and SIG-004 components synthesized; SIG-003 component UNDEFINED** |

**SR-03 Value carry-forward (resolved components only):** SIG-001 structural ratio = 0.875; SIG-004: total = 1.273; containment = 0.545; responsibility = 0.364; module = 0.455

**SR-04 UNDEFINED components:** SIG-003 (Change Concentration) RAG component — UNDEFINED propagated

**SR-10 Evidence scope note:** Intelligence entry is supported by SIG-001 and SIG-004 components of SIG-008 (RAG) only. SIG-003 component is UNDEFINED — blocked due to AT-001/AT-002 time-series absence. RAG composite value is not fully computable. Intelligence state is partial. Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority.

---

## Synthesis Coverage Summary

| Intelligence Entry | Canonical Name | Source Diagnosis | Synthesis State |
|---|---|---|---|
| INTEL-001 | Dependency Load Elevation | DIAG-001 | **synthesized** |
| INTEL-002 | Structural Volatility State | DIAG-002 | **synthesized** |
| INTEL-003 | Coordination Pressure Active | DIAG-003 | **partial** |
| INTEL-004 | Throughput Degradation Risk | DIAG-004 | **partial** |
| INTEL-005 | Change Concentration Accumulation | DIAG-005 | **blocked** |
| INTEL-006 | Execution Instability | DIAG-006 | **blocked** |
| INTEL-007 | Execution Health Deficit | DIAG-007 | **partial** |
| INTEL-008 | Risk Acceleration State | DIAG-008 | **partial** |

**SYNTHESIZED: 2 (INTEL-001, INTEL-002)**
**PARTIAL: 4 (INTEL-003, INTEL-004, INTEL-007, INTEL-008)**
**BLOCKED: 2 (INTEL-005, INTEL-006)**

Governance note: Evidence-First (GC-06) enforced — no UNDEFINED value substituted. State–Diagnosis Separation (GC-07) enforced — no threshold evaluation, no root cause attribution in synthesis.

# Condition Traceability Map

**run_id:** run_01_condition_activation
**stream:** Stream 40.6 — PiOS Condition & Diagnosis Activation Layer
**contract:** PIOS-40.6-RUN01-CE-VALIDATION-CONTRACT-v1
**upstream_run:** run_02_ce_validation (Stream 40.5)
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Traceability Rule

Every condition must trace to:
1. A CKR-governed definition (CKR-012)
2. One or more governing 40.5 signals (from run_02_ce_validation)
3. The 40.5 artifact in which the signal is defined
4. A temporal reference inherited from the governing signal
5. The original 40.4 metric chain (via signal traceability)

No condition is valid without complete traceability. No condition may reference 40.4 artifacts directly.

---

## COND-001 — Dependency Load Elevation

| Condition ID | CKR Ref | Governing Signal | Signal Artifact | Signal Value | 40.4 Chain |
|---|---|---|---|---|---|
| COND-001 | CKR-012 | SIG-002 Dependency Load | signal_output_set.md (run_02_ce_validation) | ratio: 0.682; edge count: 15 | ST-007(22), ST-012(7), ST-013(3), ST-014(2), ST-015(3) — structural_telemetry.md |

**Lineage chain:** 40.4 structural_telemetry.md → SIG-002 (run_02_ce_validation) → COND-001 (this run)

---

## COND-002 — Structural Volatility State

| Condition ID | CKR Ref | Governing Signal | Signal Artifact | Signal Values | 40.4 Chain |
|---|---|---|---|---|---|
| COND-002 | CKR-012 | SIG-004 Structural Volatility | signal_output_set.md (run_02_ce_validation) | 1.273/0.545/0.364/0.455 | ST-007(22), ST-009(10), ST-010(28), ST-011(12), ST-006(8) — structural_telemetry.md |

**Lineage chain:** 40.4 structural_telemetry.md → SIG-004 (run_02_ce_validation) → COND-002 (this run)

---

## COND-003 — Coordination Pressure Active

| Condition ID | CKR Ref | Governing Signal | Signal Artifact | Signal Values | 40.4 Chain |
|---|---|---|---|---|---|
| COND-003 | CKR-012 | SIG-001 Coordination Pressure | signal_output_set.md (run_02_ce_validation) | 0.875 (static); UNDEFINED (runtime) | ST-012(7), ST-016(8), AT-005(8), AT-007(PENDING) — structural_telemetry.md, activity_telemetry.md |

**Lineage chain:** 40.4 structural/activity_telemetry.md → SIG-001 (run_02_ce_validation) → COND-003 (this run)

**Partial lineage note:** Static component (0.875) fully traced. Runtime component (AT-007) lineage declared but value absent — UNDEFINED propagated.

---

## COND-004 — Throughput Degradation Risk

| Condition ID | CKR Ref | Governing Signal | Signal Artifact | Signal Values | 40.4 Chain |
|---|---|---|---|---|---|
| COND-004 | CKR-012 | SIG-005 Execution Throughput | signal_output_set.md (run_02_ce_validation) | 1.125 artifacts/stage (static); UNDEFINED (completion) | AT-005(8), DT-001(4), DT-003(5), DT-007(PENDING) — activity_telemetry.md, delivery_telemetry.md |

**Lineage chain:** 40.4 activity/delivery_telemetry.md → SIG-005 (run_02_ce_validation) → COND-004 (this run)

---

## COND-005 — Change Concentration Accumulation

| Condition ID | CKR Ref | Governing Signal | Signal Artifact | Signal Values | 40.4 Chain |
|---|---|---|---|---|---|
| COND-005 | CKR-012 | SIG-003 Change Concentration | signal_output_set.md (run_02_ce_validation) | UNDEFINED | AT-001(PENDING time-series), AT-002(PENDING time-series), AT-003(1/invocation) — activity_telemetry.md |

**Lineage chain:** 40.4 activity_telemetry.md → SIG-003 BLOCKED (run_02_ce_validation) → COND-005 BLOCKED (this run)

---

## COND-006 — Execution Instability

| Condition ID | CKR Ref | Governing Signal | Signal Artifact | Signal Values | 40.4 Chain |
|---|---|---|---|---|---|
| COND-006 | CKR-012 | SIG-006 Execution Stability | signal_output_set.md (run_02_ce_validation) | UNDEFINED | AT-007, AT-009, DT-007, DT-008 (all PENDING) — activity_telemetry.md, delivery_telemetry.md |

**Lineage chain:** 40.4 activity/delivery_telemetry.md → SIG-006 BLOCKED (run_02_ce_validation) → COND-006 BLOCKED (this run)

---

## COND-007 — Execution Health Deficit

| Condition ID | CKR Ref | Governing Signal | Signal Artifact | Signal Values | 40.4 Chain |
|---|---|---|---|---|---|
| COND-007 | CKR-012 | SIG-007 ESI | signal_output_set.md (run_02_ce_validation) | SIG-002 component: 0.682; others UNDEFINED | SIG-002 → ST-007/ST-012/ST-013/ST-014/ST-015; SIG-005/SIG-006 UNDEFINED |

**Lineage chain:** 40.4 structural_telemetry.md → SIG-002 → SIG-007 partial (run_02_ce_validation) → COND-007 partial (this run)

---

## COND-008 — Risk Acceleration State

| Condition ID | CKR Ref | Governing Signal | Signal Artifact | Signal Values | 40.4 Chain |
|---|---|---|---|---|---|
| COND-008 | CKR-012 | SIG-008 RAG | signal_output_set.md (run_02_ce_validation) | SIG-001: 0.875; SIG-004: 1.273/0.545/0.364/0.455; SIG-003: UNDEFINED | SIG-001 → ST-012/ST-016; SIG-004 → ST-006/ST-007/ST-009/ST-010/ST-011; SIG-003 BLOCKED |

**Lineage chain:** 40.4 structural_telemetry.md → SIG-001/SIG-004 → SIG-008 partial (run_02_ce_validation) → COND-008 partial (this run)

---

## Traceability Completeness Declaration

| Condition | CKR Ref | Signal Traced | 40.5 Artifact Cited | 40.4 Chain Declared | Temporal Inherited | Complete |
|---|---|---|---|---|---|---|
| COND-001 | CKR-012 | SIG-002 | signal_output_set.md | yes (ST-007, ST-012..ST-015) | static | yes |
| COND-002 | CKR-012 | SIG-004 | signal_output_set.md | yes (ST-006..ST-011) | static | yes |
| COND-003 | CKR-012 | SIG-001 | signal_output_set.md | yes (ST-012, ST-016, AT-005, AT-007) | static + event-based | yes |
| COND-004 | CKR-012 | SIG-005 | signal_output_set.md | yes (AT-005, DT-001, DT-003, DT-007) | event-based | yes |
| COND-005 | CKR-012 | SIG-003 | signal_output_set.md | yes (AT-001, AT-002, AT-003) | time-series | yes |
| COND-006 | CKR-012 | SIG-006 | signal_output_set.md | yes (AT-007, AT-009, DT-007, DT-008) | event-based | yes |
| COND-007 | CKR-012 | SIG-007 | signal_output_set.md | yes (via SIG-002, SIG-005, SIG-006) | event-based | yes |
| COND-008 | CKR-012 | SIG-008 | signal_output_set.md | yes (via SIG-001, SIG-003, SIG-004) | mixed | yes |

**Total conditions traced: 8 / 8**
**Conditions with missing traceability: 0**

# Diagnosis Traceability Map

**Stream:** 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
**Input:** docs/pios/40.7/diagnosis_input_matrix.md, docs/pios/40.7/diagnosis_output_set.md
**Date:** 2026-03-18

---

## Traceability Rule

Every governed diagnosis must trace to:
1. A governed condition under CKR-012 (Program Conditions) from 40.6
2. The 40.6 artifact in which that condition is defined
3. The governed signal(s) from which the condition was derived (via 40.6 chain)
4. The CKR reference for each governing signal
5. A temporal reference (inherited from condition, inherited from signal)

No diagnosis is valid without complete traceability. No traceability entry may reference 40.2, 40.3, 40.4, or 40.5 artifacts directly — only 40.6 condition artifacts are in scope for this stream's input boundary.

---

## DIAG-001 — Structural Dependency Characterization Traceability

| Diagnosis ID | Source Condition | Condition CKR | 40.6 Artifact | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| DIAG-001 | COND-001 | CKR-012 | condition_output_set.md | SIG-002 | CKR-007 | static |

**Full traceability chain:**
DIAG-001 → COND-001 (CKR-012, condition_output_set.md) → SIG-002 (CKR-007, signal_output_set.md) → ST-012, ST-013, ST-014, ST-015, ST-007 (structural_telemetry.md)

**Governing diagnosis model:** Stream 75.2 — Program Diagnosis Model
**CKR diagnosis authority:** CKR-005 (Execution Signals), CKR-007 (Dependency Load)
**Coverage state:** computed

---

## DIAG-002 — Structural Volatility Characterization Traceability

| Diagnosis ID | Source Condition | Condition CKR | 40.6 Artifact | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| DIAG-002 | COND-002 | CKR-012 | condition_output_set.md | SIG-004 | CKR-009 | static |

**Full traceability chain:**
DIAG-002 → COND-002 (CKR-012, condition_output_set.md) → SIG-004 (CKR-009, signal_output_set.md) → ST-007, ST-010, ST-009, ST-022, ST-006, ST-011 (structural_telemetry.md)

**Governing diagnosis model:** Stream 75.2
**CKR diagnosis authority:** CKR-005, CKR-009 (Structural Volatility)
**Coverage state:** computed

---

## DIAG-003 — Coordination Pressure Characterization Traceability

| Diagnosis ID | Source Condition | Condition CKR | 40.6 Artifact | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| DIAG-003 | COND-003 | CKR-012 | condition_output_set.md | SIG-001 | CKR-006 | static |
| DIAG-003 | COND-003 | CKR-012 | condition_output_set.md | SIG-001 | CKR-006 | event-based |

**Full traceability chain:**
DIAG-003 → COND-003 (CKR-012, condition_output_set.md) → SIG-001 (CKR-006, signal_output_set.md) → ST-016, ST-012, AT-005, AT-007 (structural_telemetry.md, activity_telemetry.md)

**Governing diagnosis model:** Stream 75.2
**CKR diagnosis authority:** CKR-005, CKR-006 (Coordination Pressure)
**Coverage state:** partial (event-based component pending)

---

## DIAG-004 — Throughput Profile Characterization Traceability

| Diagnosis ID | Source Condition | Condition CKR | 40.6 Artifact | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| DIAG-004 | COND-004 | CKR-012 | condition_output_set.md | SIG-005 | CKR-010 | event-based |

**Full traceability chain:**
DIAG-004 → COND-004 (CKR-012, condition_output_set.md) → SIG-005 (CKR-010, signal_output_set.md) → AT-005, AT-006, DT-001, DT-003, DT-007 (activity_telemetry.md, delivery_telemetry.md)

**Governing diagnosis model:** Stream 75.2
**CKR diagnosis authority:** CKR-005, CKR-010 (Execution Throughput)
**Coverage state:** partial (DT-007, AT-006 pending)

---

## DIAG-005 — Change Concentration Characterization Traceability

| Diagnosis ID | Source Condition | Condition CKR | 40.6 Artifact | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| DIAG-005 | COND-005 | CKR-012 | condition_output_set.md | SIG-003 | CKR-008 | time-series |

**Full traceability chain:**
DIAG-005 → COND-005 (CKR-012, condition_output_set.md) → SIG-003 (CKR-008, signal_output_set.md) → AT-001, AT-002, AT-003 (activity_telemetry.md) — BLOCKED

**Governing diagnosis model:** Stream 75.2
**CKR diagnosis authority:** CKR-005, CKR-008 (Change Concentration)
**Coverage state:** blocked

---

## DIAG-006 — Execution Stability Characterization Traceability

| Diagnosis ID | Source Condition | Condition CKR | 40.6 Artifact | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| DIAG-006 | COND-006 | CKR-012 | condition_output_set.md | SIG-006 | CKR-011 | event-based |

**Full traceability chain:**
DIAG-006 → COND-006 (CKR-012, condition_output_set.md) → SIG-006 (CKR-011, signal_output_set.md) → DT-007, AT-007, AT-009, DT-008 (delivery_telemetry.md, activity_telemetry.md) — BLOCKED

**Governing diagnosis model:** Stream 75.2
**CKR diagnosis authority:** CKR-005, CKR-011 (Execution Stability)
**Coverage state:** blocked

---

## DIAG-007 — Execution Health Index Characterization Traceability (Composite)

| Diagnosis ID | Source Condition | Condition CKR | 40.6 Artifact | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| DIAG-007 | COND-007 | CKR-012 | condition_output_set.md | SIG-007 (via SIG-002) | CKR-014/CKR-007 | static |
| DIAG-007 | COND-007 | CKR-012 | condition_output_set.md | SIG-007 (via SIG-005) | CKR-014/CKR-010 | event-based |
| DIAG-007 | COND-007 | CKR-012 | condition_output_set.md | SIG-007 (via SIG-006) | CKR-014/CKR-011 | event-based |

**Full traceability chain:**
DIAG-007 → COND-007 (CKR-012, condition_output_set.md) → SIG-007 (CKR-014, signal_output_set.md) → SIG-002 (CKR-007) + SIG-005 (CKR-010) + SIG-006 (CKR-011, BLOCKED) → telemetry inputs

**Governing diagnosis model:** Stream 75.2
**CKR diagnosis authority:** CKR-005, CKR-014 (ESI)
**Coverage state:** partial (SIG-006 component blocked)

---

## DIAG-008 — Risk Acceleration Characterization Traceability (Composite)

| Diagnosis ID | Source Condition | Condition CKR | 40.6 Artifact | Via Signal | Signal CKR | Temporal |
|---|---|---|---|---|---|---|
| DIAG-008 | COND-008 | CKR-012 | condition_output_set.md | SIG-008 (via SIG-004) | CKR-015/CKR-009 | static |
| DIAG-008 | COND-008 | CKR-012 | condition_output_set.md | SIG-008 (via SIG-001) | CKR-015/CKR-006 | static |
| DIAG-008 | COND-008 | CKR-012 | condition_output_set.md | SIG-008 (via SIG-001) | CKR-015/CKR-006 | event-based |
| DIAG-008 | COND-008 | CKR-012 | condition_output_set.md | SIG-008 (via SIG-003) | CKR-015/CKR-008 | time-series |

**Full traceability chain:**
DIAG-008 → COND-008 (CKR-012, condition_output_set.md) → SIG-008 (CKR-015, signal_output_set.md) → SIG-004 (CKR-009) + SIG-001 (CKR-006) + SIG-003 (CKR-008, BLOCKED) → telemetry inputs

**Governing diagnosis model:** Stream 75.2
**CKR diagnosis authority:** CKR-005, CKR-015 (RAG)
**Coverage state:** partial (SIG-003 component blocked)

---

## 40.6 Artifact Coverage

| 40.6 Artifact | Conditions Providing Diagnosis Inputs | Diagnoses Fed |
|---|---|---|
| condition_output_set.md | COND-001 through COND-008 | DIAG-001 through DIAG-008 (all) |
| condition_traceability_map.md | All condition-to-signal chains | All diagnoses (upstream authority chain) |
| condition_validation_report.md | Coverage states for all conditions | All diagnoses (coverage propagation) |
| execution_manifest.md | Upstream blocking declarations | DIAG-005, DIAG-006 (blocking inheritance) |

---

## Traceability Completeness Declaration

| Diagnosis | CKR-012 Condition Traced | 40.6 Artifact Cited | Signal Chain Traced | Temporal Reference | Complete |
|---|---|---|---|---|---|
| DIAG-001 | yes | yes | yes (SIG-002) | yes | yes |
| DIAG-002 | yes | yes | yes (SIG-004) | yes | yes |
| DIAG-003 | yes | yes | yes (SIG-001) | yes | yes |
| DIAG-004 | yes | yes | yes (SIG-005) | yes | yes |
| DIAG-005 | yes | yes | yes (SIG-003, blocked) | yes | yes |
| DIAG-006 | yes | yes | yes (SIG-006, blocked) | yes | yes |
| DIAG-007 | yes | yes | yes (SIG-007 composite) | yes | yes |
| DIAG-008 | yes | yes | yes (SIG-008 composite) | yes | yes |

**Total diagnoses traced: 8 / 8**
**Total condition input mappings traced: 16 (including composite diagnosis chains)**
**Diagnoses with missing traceability: 0**

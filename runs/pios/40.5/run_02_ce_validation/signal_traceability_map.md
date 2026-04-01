# Signal Traceability Map

**run_id:** run_02_ce_validation
**stream:** Stream 40.5 — PiOS Signal Computation Engine
**contract:** PIOS-40.5-RUN02-CE-VALIDATION-CONTRACT-v1
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## Traceability Rule

Every signal in this stream must trace to:
1. A CKR-governed definition (entity from CKR registry)
2. One or more VAR_ input variables declared in signal_input_matrix.md
3. The metric ref (AT-/DT-/ST-) each variable maps to
4. The 40.4 artifact in which that metric is defined
5. A temporal reference (static | event-based | time-series)

No signal is valid without complete traceability. No traceability entry may reference 40.2 or 40.3 artifacts directly.

---

## SIG-001 — Coordination Pressure Traceability

| Signal ID | CKR Ref | Variable | Source Metric | 40.4 Artifact | Value | Temporal |
|---|---|---|---|---|---|---|
| SIG-001 | CKR-006 | VAR_ST_012 | ST-012 (PEG Pipeline Edge Count) | structural_telemetry.md | 7 | static |
| SIG-001 | CKR-006 | VAR_ST_016 | ST-016 (PiOS Pipeline Stage Count) | structural_telemetry.md | 8 | static |
| SIG-001 | CKR-006 | VAR_AT_005 | AT-005 (Pipeline Module Execution Count Per Run) | activity_telemetry.md | 8 (per run) | event-based |
| SIG-001 | CKR-006 | VAR_AT_007 | AT-007 (Validation Gate Enforcement Count Per Run) | activity_telemetry.md | PENDING | event-based |

**Computed chain:** ST-012 (7) / ST-016 (8) = 0.875 [static component confirmed]

---

## SIG-002 — Dependency Load Traceability

| Signal ID | CKR Ref | Variable | Source Metric | 40.4 Artifact | Value | Temporal |
|---|---|---|---|---|---|---|
| SIG-002 | CKR-007 | VAR_ST_007 | ST-007 (PEG Total Node Count) | structural_telemetry.md | 22 | static |
| SIG-002 | CKR-007 | VAR_ST_012 | ST-012 (PEG Pipeline Edge Count) | structural_telemetry.md | 7 | static |
| SIG-002 | CKR-007 | VAR_ST_013 | ST-013 (PEG Model Activation Edge Count) | structural_telemetry.md | 3 | static |
| SIG-002 | CKR-007 | VAR_ST_014 | ST-014 (PEG Governance Edge Count) | structural_telemetry.md | 2 | static |
| SIG-002 | CKR-007 | VAR_ST_015 | ST-015 (Non-PEG Governance Constraint Count) | structural_telemetry.md | 3 | static |

**Computed chain:** (7 + 3 + 2 + 3) / 22 = 15/22 = 0.682 [full computation confirmed]

---

## SIG-003 — Change Concentration Traceability

| Signal ID | CKR Ref | Variable | Source Metric | 40.4 Artifact | Value | Temporal |
|---|---|---|---|---|---|---|
| SIG-003 | CKR-008 | VAR_AT_001 | AT-001 (Automation Trigger Frequency) | activity_telemetry.md | PENDING | time-series |
| SIG-003 | CKR-008 | VAR_AT_002 | AT-002 (Auto-Commit Event Frequency) | activity_telemetry.md | PENDING | time-series |
| SIG-003 | CKR-008 | VAR_AT_003 | AT-003 (Script Execution Event Count) | activity_telemetry.md | 1/invocation | event-based |

**Computation state:** BLOCKED — AT-001 and AT-002 require accumulated time-series data across successive push-to-main intervals. Not present in static 40.4 telemetry.

---

## SIG-004 — Structural Volatility Traceability

| Signal ID | CKR Ref | Variable | Source Metric | 40.4 Artifact | Value | Temporal |
|---|---|---|---|---|---|---|
| SIG-004 | CKR-009 | VAR_ST_007 | ST-007 (PEG Total Node Count) | structural_telemetry.md | 22 | static |
| SIG-004 | CKR-009 | VAR_ST_009 | ST-009 (PEG Module Node Count) | structural_telemetry.md | 10 | static |
| SIG-004 | CKR-009 | VAR_ST_010 | ST-010 (PEG Total Edge Count) | structural_telemetry.md | 28 | static |
| SIG-004 | CKR-009 | VAR_ST_011 | ST-011 (PEG Containment Edge Count) | structural_telemetry.md | 12 | static |
| SIG-004 | CKR-009 | VAR_ST_006 | ST-006 (Architectural Responsibility Zone Count) | structural_telemetry.md | 8 | static |

**Computed chain:**
- 28/22 = 1.273 [total edge density, confirmed]
- 12/22 = 0.545 [containment density, confirmed]
- 8/22 = 0.364 [responsibility density, confirmed]
- 10/22 = 0.455 [module density, confirmed]

---

## SIG-005 — Execution Throughput Traceability

| Signal ID | CKR Ref | Variable | Source Metric | 40.4 Artifact | Value | Temporal |
|---|---|---|---|---|---|---|
| SIG-005 | CKR-010 | VAR_AT_005 | AT-005 (Pipeline Module Execution Count Per Run) | activity_telemetry.md | 8 | event-based |
| SIG-005 | CKR-010 | VAR_DT_001 | DT-001 (Intelligence Output Artifact Count Per Run) | delivery_telemetry.md | 4 | event-based |
| SIG-005 | CKR-010 | VAR_DT_003 | DT-003 (Reconstruction Artifact Delivery Count Per Run) | delivery_telemetry.md | 5 | event-based |
| SIG-005 | CKR-010 | VAR_DT_007 | DT-007 (Pipeline Run Completion Status) | delivery_telemetry.md | PENDING | event-based |

**Computed chain:** (4+5)/8 = 9/8 = 1.125 [throughput rate from declared constants]; completion factor pending.

---

## SIG-006 — Execution Stability Traceability

| Signal ID | CKR Ref | Variable | Source Metric | 40.4 Artifact | Value | Temporal |
|---|---|---|---|---|---|---|
| SIG-006 | CKR-011 | VAR_AT_007 | AT-007 (Validation Gate Enforcement Count Per Run) | activity_telemetry.md | PENDING | event-based |
| SIG-006 | CKR-011 | VAR_AT_009 | AT-009 (Feedback Routing Event Count Per Pipeline Run) | activity_telemetry.md | PENDING | event-based |
| SIG-006 | CKR-011 | VAR_DT_007 | DT-007 (Pipeline Run Completion Status) | delivery_telemetry.md | PENDING | event-based |
| SIG-006 | CKR-011 | VAR_DT_008 | DT-008 (Feedback Loop Delivery Event Count) | delivery_telemetry.md | PENDING | event-based |

**Computation state:** BLOCKED — all inputs event-based; require live pipeline execution.

---

## SIG-007 — ESI Traceability

Derived from SIG-002, SIG-005, SIG-006.

| Signal ID | CKR Ref | Source Signal | Source Metric Chain | Status |
|---|---|---|---|---|
| SIG-007 | CKR-014 | SIG-002 (Dependency Load) | ST-007, ST-012..ST-015 | RESOLVED (0.682) |
| SIG-007 | CKR-014 | SIG-005 (Execution Throughput) | AT-005, DT-001, DT-003, DT-007 | PARTIAL |
| SIG-007 | CKR-014 | SIG-006 (Execution Stability) | AT-007, AT-009, DT-007, DT-008 | BLOCKED |

---

## SIG-008 — RAG Traceability

Derived from SIG-003, SIG-001, SIG-004.

| Signal ID | CKR Ref | Source Signal | Source Metric Chain | Status |
|---|---|---|---|---|
| SIG-008 | CKR-015 | SIG-001 (Coordination Pressure) | ST-012, ST-016, AT-005, AT-007 | PARTIAL (0.875 static) |
| SIG-008 | CKR-015 | SIG-004 (Structural Volatility) | ST-006..ST-011 | RESOLVED (1.273/0.545/0.364/0.455) |
| SIG-008 | CKR-015 | SIG-003 (Change Concentration) | AT-001, AT-002, AT-003 | BLOCKED |

---

## 40.4 Artifact Coverage

| 40.4 Artifact | Metrics Consumed | Signals Fed |
|---|---|---|
| structural_telemetry.md | ST-006, ST-007, ST-009, ST-010, ST-011, ST-012, ST-013, ST-014, ST-015, ST-016 | SIG-001, SIG-002, SIG-004 (and derived SIG-007, SIG-008) |
| activity_telemetry.md | AT-001, AT-002, AT-003, AT-005, AT-007, AT-009 | SIG-001, SIG-003, SIG-005, SIG-006 |
| delivery_telemetry.md | DT-001, DT-003, DT-007, DT-008 | SIG-005, SIG-006 |
| dependency_telemetry.md | Coverage levels (HIGH/PARTIAL/INDIRECT/NONE) | Signal validation context |

---

## Traceability Completeness Declaration

| Signal | CKR Ref | Variables Traced | 40.4 Artifact Cited | Temporal Ref | Complete |
|---|---|---|---|---|---|
| SIG-001 | CKR-006 | 4 inputs | structural_telemetry.md, activity_telemetry.md | static + event-based | yes |
| SIG-002 | CKR-007 | 5 inputs | structural_telemetry.md | static | yes |
| SIG-003 | CKR-008 | 3 inputs | activity_telemetry.md | time-series + event-based | yes |
| SIG-004 | CKR-009 | 5 inputs | structural_telemetry.md | static | yes |
| SIG-005 | CKR-010 | 4 inputs | activity_telemetry.md, delivery_telemetry.md | event-based | yes |
| SIG-006 | CKR-011 | 4 inputs | activity_telemetry.md, delivery_telemetry.md | event-based | yes |
| SIG-007 | CKR-014 | via SIG-002/005/006 | all three telemetry artifacts | event-based | yes |
| SIG-008 | CKR-015 | via SIG-001/003/004 | all three telemetry artifacts | mixed | yes |

**Total signals traced: 8 / 8**
**Signals with missing traceability: 0**

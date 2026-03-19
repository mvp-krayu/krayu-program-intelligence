# Signal Traceability Map

**Stream:** 40.5 — PiOS Signal Computation Engine
**Input:** docs/pios/40.5/signal_input_matrix.md, docs/pios/40.5/signal_computation_specification.md, docs/pios/40.5/signal_output_set.md
**Date:** 2026-03-18

---

## Traceability Rule

Every signal defined in this stream must trace to:
1. A governed signal definition (CKR reference, sourced from 40.4 structural_telemetry.md ST-018)
2. One or more 40.4 telemetry metrics as explicit input fields
3. The 40.4 artifact in which each telemetry input is defined
4. A temporal reference

No signal is valid without complete traceability. No traceability entry may reference 40.2 or 40.3 artifacts directly.

---

## SIG-001 — Coordination Pressure Traceability

| Signal ID | CKR | Telemetry Input | Metric ID | 40.4 Artifact | Temporal |
|---|---|---|---|---|---|
| SIG-001 | CKR-006 | PiOS Pipeline Stage Count | ST-016 | structural_telemetry.md | static |
| SIG-001 | CKR-006 | PEG Pipeline Edge Count | ST-012 | structural_telemetry.md | static |
| SIG-001 | CKR-006 | Pipeline Module Execution Count Per Run | AT-005 | activity_telemetry.md | event-based |
| SIG-001 | CKR-006 | Validation Gate Enforcement Count Per Run | AT-007 | activity_telemetry.md | event-based |

**CKR governance chain:** SIG-001 → CKR-006 (Coordination Pressure) → ST-018 (CKR Construct Count, structural_telemetry.md) → entity_catalog.md EC-04 (via 40.4 reference)

---

## SIG-002 — Dependency Load Traceability

| Signal ID | CKR | Telemetry Input | Metric ID | 40.4 Artifact | Temporal |
|---|---|---|---|---|---|
| SIG-002 | CKR-007 | PEG Total Node Count | ST-007 | structural_telemetry.md | static |
| SIG-002 | CKR-007 | PEG Total Edge Count | ST-010 | structural_telemetry.md | static |
| SIG-002 | CKR-007 | PEG Pipeline Edge Count | ST-012 | structural_telemetry.md | static |
| SIG-002 | CKR-007 | PEG Model Activation Edge Count | ST-013 | structural_telemetry.md | static |
| SIG-002 | CKR-007 | PEG Governance Edge Count | ST-014 | structural_telemetry.md | static |
| SIG-002 | CKR-007 | Non-PEG Governance Constraint Count | ST-015 | structural_telemetry.md | static |

**CKR governance chain:** SIG-002 → CKR-007 (Dependency Load) → ST-018 → entity_catalog.md EC-04

---

## SIG-003 — Change Concentration Traceability

| Signal ID | CKR | Telemetry Input | Metric ID | 40.4 Artifact | Temporal |
|---|---|---|---|---|---|
| SIG-003 | CKR-008 | Automation Trigger Frequency | AT-001 | activity_telemetry.md | time-series |
| SIG-003 | CKR-008 | Auto-Commit Event Frequency | AT-002 | activity_telemetry.md | time-series |
| SIG-003 | CKR-008 | Script Execution Event Count | AT-003 | activity_telemetry.md | event-based |

**CKR governance chain:** SIG-003 → CKR-008 (Change Concentration) → ST-018 → entity_catalog.md EC-04

---

## SIG-004 — Structural Volatility Traceability

| Signal ID | CKR | Telemetry Input | Metric ID | 40.4 Artifact | Temporal |
|---|---|---|---|---|---|
| SIG-004 | CKR-009 | PEG Total Node Count | ST-007 | structural_telemetry.md | static |
| SIG-004 | CKR-009 | PEG Total Edge Count | ST-010 | structural_telemetry.md | static |
| SIG-004 | CKR-009 | PEG Module Node Count | ST-009 | structural_telemetry.md | static |
| SIG-004 | CKR-009 | Component Containment Depth | ST-022 | structural_telemetry.md | static |
| SIG-004 | CKR-009 | Architectural Responsibility Zone Count | ST-006 | structural_telemetry.md | static |
| SIG-004 | CKR-009 | PEG Containment Edge Count | ST-011 | structural_telemetry.md | static |

**CKR governance chain:** SIG-004 → CKR-009 (Structural Volatility) → ST-018 → entity_catalog.md EC-04

---

## SIG-005 — Execution Throughput Traceability

| Signal ID | CKR | Telemetry Input | Metric ID | 40.4 Artifact | Temporal |
|---|---|---|---|---|---|
| SIG-005 | CKR-010 | Pipeline Module Execution Count Per Run | AT-005 | activity_telemetry.md | event-based |
| SIG-005 | CKR-010 | Pipeline Execution Mode At Runtime | AT-006 | activity_telemetry.md | event-based |
| SIG-005 | CKR-010 | Intelligence Output Artifact Count Per Pipeline Run | DT-001 | delivery_telemetry.md | event-based |
| SIG-005 | CKR-010 | Reconstruction Artifact Delivery Count Per Run | DT-003 | delivery_telemetry.md | event-based |
| SIG-005 | CKR-010 | Pipeline Run Completion Status | DT-007 | delivery_telemetry.md | event-based |

**CKR governance chain:** SIG-005 → CKR-010 (Execution Throughput) → ST-018 → entity_catalog.md EC-04

---

## SIG-006 — Execution Stability Traceability

| Signal ID | CKR | Telemetry Input | Metric ID | 40.4 Artifact | Temporal |
|---|---|---|---|---|---|
| SIG-006 | CKR-011 | Pipeline Run Completion Status | DT-007 | delivery_telemetry.md | event-based |
| SIG-006 | CKR-011 | Validation Gate Enforcement Count Per Run | AT-007 | activity_telemetry.md | event-based |
| SIG-006 | CKR-011 | Feedback Routing Event Count Per Pipeline Run | AT-009 | activity_telemetry.md | event-based |
| SIG-006 | CKR-011 | Feedback Loop Delivery Event Count | DT-008 | delivery_telemetry.md | event-based |

**CKR governance chain:** SIG-006 → CKR-011 (Execution Stability) → ST-018 → entity_catalog.md EC-04

---

## SIG-007 — ESI Traceability (Composite)

| Signal ID | CKR | Via Component | Component Signal | Telemetry Input | Metric ID | 40.4 Artifact | Temporal |
|---|---|---|---|---|---|---|---|
| SIG-007 | CKR-014 | CKR-011 | SIG-006 | Pipeline Run Completion Status | DT-007 | delivery_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-011 | SIG-006 | Validation Gate Enforcement Count Per Run | AT-007 | activity_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-011 | SIG-006 | Feedback Routing Event Count Per Pipeline Run | AT-009 | activity_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-011 | SIG-006 | Feedback Loop Delivery Event Count | DT-008 | delivery_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-010 | SIG-005 | Pipeline Module Execution Count Per Run | AT-005 | activity_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-010 | SIG-005 | Intelligence Output Artifact Count Per Pipeline Run | DT-001 | delivery_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-010 | SIG-005 | Reconstruction Artifact Delivery Count Per Run | DT-003 | delivery_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-010 | SIG-005 | Pipeline Execution Mode At Runtime | AT-006 | activity_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-010 | SIG-005 | Pipeline Run Completion Status | DT-007 | delivery_telemetry.md | event-based |
| SIG-007 | CKR-014 | CKR-007 | SIG-002 | PEG Total Node Count | ST-007 | structural_telemetry.md | static |
| SIG-007 | CKR-014 | CKR-007 | SIG-002 | PEG Total Edge Count | ST-010 | structural_telemetry.md | static |
| SIG-007 | CKR-014 | CKR-007 | SIG-002 | PEG Pipeline Edge Count | ST-012 | structural_telemetry.md | static |
| SIG-007 | CKR-014 | CKR-007 | SIG-002 | PEG Model Activation Edge Count | ST-013 | structural_telemetry.md | static |
| SIG-007 | CKR-014 | CKR-007 | SIG-002 | PEG Governance Edge Count | ST-014 | structural_telemetry.md | static |
| SIG-007 | CKR-014 | CKR-007 | SIG-002 | Non-PEG Governance Constraint Count | ST-015 | structural_telemetry.md | static |

**CKR governance chain:** SIG-007 → CKR-014 (ESI) → ST-018 → entity_catalog.md EC-04

---

## SIG-008 — RAG Traceability (Composite)

| Signal ID | CKR | Via Component | Component Signal | Telemetry Input | Metric ID | 40.4 Artifact | Temporal |
|---|---|---|---|---|---|---|---|
| SIG-008 | CKR-015 | CKR-008 | SIG-003 | Automation Trigger Frequency | AT-001 | activity_telemetry.md | time-series |
| SIG-008 | CKR-015 | CKR-008 | SIG-003 | Auto-Commit Event Frequency | AT-002 | activity_telemetry.md | time-series |
| SIG-008 | CKR-015 | CKR-008 | SIG-003 | Script Execution Event Count | AT-003 | activity_telemetry.md | event-based |
| SIG-008 | CKR-015 | CKR-006 | SIG-001 | PiOS Pipeline Stage Count | ST-016 | structural_telemetry.md | static |
| SIG-008 | CKR-015 | CKR-006 | SIG-001 | PEG Pipeline Edge Count | ST-012 | structural_telemetry.md | static |
| SIG-008 | CKR-015 | CKR-006 | SIG-001 | Pipeline Module Execution Count Per Run | AT-005 | activity_telemetry.md | event-based |
| SIG-008 | CKR-015 | CKR-006 | SIG-001 | Validation Gate Enforcement Count Per Run | AT-007 | activity_telemetry.md | event-based |
| SIG-008 | CKR-015 | CKR-009 | SIG-004 | PEG Total Node Count | ST-007 | structural_telemetry.md | static |
| SIG-008 | CKR-015 | CKR-009 | SIG-004 | PEG Total Edge Count | ST-010 | structural_telemetry.md | static |
| SIG-008 | CKR-015 | CKR-009 | SIG-004 | PEG Module Node Count | ST-009 | structural_telemetry.md | static |
| SIG-008 | CKR-015 | CKR-009 | SIG-004 | Component Containment Depth | ST-022 | structural_telemetry.md | static |
| SIG-008 | CKR-015 | CKR-009 | SIG-004 | Architectural Responsibility Zone Count | ST-006 | structural_telemetry.md | static |
| SIG-008 | CKR-015 | CKR-009 | SIG-004 | PEG Containment Edge Count | ST-011 | structural_telemetry.md | static |

**CKR governance chain:** SIG-008 → CKR-015 (RAG) → ST-018 → entity_catalog.md EC-04

---

## 40.4 Artifact Coverage

| 40.4 Artifact | Metrics Providing Signal Inputs | Signals Fed |
|---|---|---|
| structural_telemetry.md | ST-006, ST-007, ST-009, ST-010, ST-011, ST-012, ST-013, ST-014, ST-015, ST-016, ST-022 | SIG-001, SIG-002, SIG-004, SIG-007, SIG-008 |
| activity_telemetry.md | AT-001, AT-002, AT-003, AT-005, AT-006, AT-007, AT-009 | SIG-001, SIG-003, SIG-005, SIG-006, SIG-007, SIG-008 |
| delivery_telemetry.md | DT-001, DT-003, DT-007, DT-008 | SIG-005, SIG-006, SIG-007 |
| telemetry_surface_definition.md | TSD-02f (M-06 surface → Stream 70 reference) | Governing authority chain for all signals |
| telemetry_schema.md | §5 (ESI, RAG excluded from telemetry) | Confirms SIG-007, SIG-008 as signal-layer objects |
| telemetry_traceability_map.md | Cross-reference for telemetry metric provenance | All signals (upstream chain) |

---

## Traceability Completeness Declaration

| Signal | CKR Traced | Telemetry Inputs Traced | 40.4 Artifact Traced | Temporal Reference | Complete |
|---|---|---|---|---|---|
| SIG-001 | yes | yes (4 inputs) | yes | yes | yes |
| SIG-002 | yes | yes (6 inputs) | yes | yes | yes |
| SIG-003 | yes | yes (3 inputs) | yes | yes | yes |
| SIG-004 | yes | yes (6 inputs) | yes | yes | yes |
| SIG-005 | yes | yes (5 inputs) | yes | yes | yes |
| SIG-006 | yes | yes (4 inputs) | yes | yes | yes |
| SIG-007 | yes | yes (14 inputs) | yes | yes | yes |
| SIG-008 | yes | yes (13 inputs) | yes | yes | yes |

**Total signals traced: 8 / 8**
**Total telemetry input mappings traced: 55 (including composite signal chains)**
**Signals with missing traceability: 0**

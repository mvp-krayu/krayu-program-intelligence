# Signal Input Matrix

**Stream:** 40.5 — PiOS Signal Computation Engine
**Input:** docs/pios/40.4/ (full corpus — 6 telemetry artifacts)
**Date:** 2026-03-18

---

## Matrix Rule

This matrix maps every 40.4 telemetry metric that serves as an input to a governed signal. Only telemetry metrics explicitly relevant to a signal computation are listed as inputs. Every mapping is derived from the telemetry field definitions in docs/pios/40.4/. No 40.2 or 40.3 artifacts are accessed directly.

**Governed signals:** CKR-006, CKR-007, CKR-008, CKR-009, CKR-010, CKR-011 (atomic); CKR-014, CKR-015 (composite). CKR registry sourced from 40.4 structural_telemetry.md ST-018 (entity_catalog.md EC-04 reference).

**Telemetry metrics not mapped to any signal input:** ST-001, ST-002, ST-003, ST-004 (repository file classification counts — no signal dependency), ST-005 (zone count), ST-017 (execution mode count), ST-019 (architectural layer count), ST-020 (capability domain count), ST-021 (total capability count), AT-004 (streams per automation run), AT-008 (evidence source count — M-03 scope, pre-signal), AT-010 (reconstruction artifact count — M-04 scope, pre-signal), DT-004 (handbook index delivery — automation scope), DT-005 (handbook stream coverage — static, automation scope).

---

## Signal: CKR-006 — Coordination Pressure

| Telemetry Input | Metric ID | Dimension | Temporal Classification | Telemetry Source | Mapping Rationale |
|---|---|---|---|---|---|
| PiOS Pipeline Stage Count | ST-016 | structural | static | structural_telemetry.md ST-016 | Counts mandatory sequential coordination steps in the pipeline |
| PEG Pipeline Edge Count | ST-012 | structural | static | structural_telemetry.md ST-012 | Counts mandatory sequential dependency relationships requiring coordination |
| Pipeline Module Execution Count Per Run | AT-005 | activity | event-based | activity_telemetry.md AT-005 | Measures coordination execution load per pipeline run |
| Validation Gate Enforcement Count Per Run | AT-007 | activity | event-based | activity_telemetry.md AT-007 | Measures active coordination enforcement events per run |

**Telemetry temporal range for this signal:** static (structural) + event-based (runtime)

---

## Signal: CKR-007 — Dependency Load

| Telemetry Input | Metric ID | Dimension | Temporal Classification | Telemetry Source | Mapping Rationale |
|---|---|---|---|---|---|
| PEG Total Edge Count | ST-010 | structural | static | structural_telemetry.md ST-010 | Total relationship surface |
| PEG Pipeline Edge Count | ST-012 | structural | static | structural_telemetry.md ST-012 | Mandatory sequential dependencies |
| PEG Model Activation Edge Count | ST-013 | structural | static | structural_telemetry.md ST-013 | Model dependency relationships |
| PEG Governance Edge Count | ST-014 | structural | static | structural_telemetry.md ST-014 | Governance dependency relationships |
| Non-PEG Governance Constraint Count | ST-015 | structural | static | structural_telemetry.md ST-015 | Off-graph dependency constraints |
| PEG Total Node Count | ST-007 | structural | static | structural_telemetry.md ST-007 | Normalisation base (entity count) |

**Telemetry temporal range for this signal:** static

---

## Signal: CKR-008 — Change Concentration

| Telemetry Input | Metric ID | Dimension | Temporal Classification | Telemetry Source | Mapping Rationale |
|---|---|---|---|---|---|
| Automation Trigger Frequency | AT-001 | activity | time-series | activity_telemetry.md AT-001 | Measures rate of change events (push-to-main) over time |
| Auto-Commit Event Frequency | AT-002 | activity | time-series | activity_telemetry.md AT-002 | Measures rate of automated change commits over time |
| Script Execution Event Count | AT-003 | activity | event-based | activity_telemetry.md AT-003 | Per-event execution contributing to change propagation |

**Telemetry temporal range for this signal:** time-series (primary) + event-based

---

## Signal: CKR-009 — Structural Volatility

| Telemetry Input | Metric ID | Dimension | Temporal Classification | Telemetry Source | Mapping Rationale |
|---|---|---|---|---|---|
| PEG Total Node Count | ST-007 | structural | static | structural_telemetry.md ST-007 | Structural entity count (size denominator) |
| PEG Total Edge Count | ST-010 | structural | static | structural_telemetry.md ST-010 | Total relationship count (complexity numerator) |
| PEG Module Node Count | ST-009 | structural | static | structural_telemetry.md ST-009 | Module-level structural surface |
| Component Containment Depth | ST-022 | structural | static | structural_telemetry.md ST-022 | Structural nesting depth |
| Architectural Responsibility Zone Count | ST-006 | structural | static | structural_telemetry.md ST-006 | Structural partitioning breadth |
| PEG Containment Edge Count | ST-011 | structural | static | structural_telemetry.md ST-011 | Containment topology density |

**Telemetry temporal range for this signal:** static

---

## Signal: CKR-010 — Execution Throughput

| Telemetry Input | Metric ID | Dimension | Temporal Classification | Telemetry Source | Mapping Rationale |
|---|---|---|---|---|---|
| Pipeline Module Execution Count Per Run | AT-005 | activity | event-based | activity_telemetry.md AT-005 | Modules processed per pipeline execution |
| Pipeline Run Completion Status | DT-007 | delivery | event-based | delivery_telemetry.md DT-007 | Full pipeline completion per run |
| Intelligence Output Artifact Count Per Pipeline Run | DT-001 | delivery | event-based | delivery_telemetry.md DT-001 | Output volume per run |
| Reconstruction Artifact Delivery Count Per Run | DT-003 | delivery | event-based | delivery_telemetry.md DT-003 | Internal pipeline output volume per run |
| Pipeline Execution Mode At Runtime | AT-006 | activity | event-based | activity_telemetry.md AT-006 | Execution mode determining throughput context |

**Telemetry temporal range for this signal:** event-based

---

## Signal: CKR-011 — Execution Stability

| Telemetry Input | Metric ID | Dimension | Temporal Classification | Telemetry Source | Mapping Rationale |
|---|---|---|---|---|---|
| Pipeline Run Completion Status | DT-007 | delivery | event-based | delivery_telemetry.md DT-007 | Binary run success/failure per execution |
| Validation Gate Enforcement Count Per Run | AT-007 | activity | event-based | activity_telemetry.md AT-007 | Gate enforcement contributing to stability assurance |
| Feedback Routing Event Count Per Pipeline Run | AT-009 | activity | event-based | activity_telemetry.md AT-009 | Feedback loop activation as stability indicator |
| Feedback Loop Delivery Event Count | DT-008 | delivery | event-based | delivery_telemetry.md DT-008 | Feedback delivery completeness per run |

**Telemetry temporal range for this signal:** event-based

---

## Signal: CKR-014 — Execution Stability Index (ESI) [Composite]

Composite of CKR-011 (Execution Stability), CKR-010 (Execution Throughput), CKR-007 (Dependency Load).

| Telemetry Input | Metric ID | Dimension | Temporal Classification | Via Signal | Telemetry Source |
|---|---|---|---|---|---|
| Pipeline Run Completion Status | DT-007 | delivery | event-based | CKR-011 | delivery_telemetry.md DT-007 |
| Validation Gate Enforcement Count Per Run | AT-007 | activity | event-based | CKR-011 | activity_telemetry.md AT-007 |
| Feedback Routing Event Count Per Pipeline Run | AT-009 | activity | event-based | CKR-011 | activity_telemetry.md AT-009 |
| Feedback Loop Delivery Event Count | DT-008 | delivery | event-based | CKR-011 | delivery_telemetry.md DT-008 |
| Pipeline Module Execution Count Per Run | AT-005 | activity | event-based | CKR-010 | activity_telemetry.md AT-005 |
| Intelligence Output Artifact Count Per Pipeline Run | DT-001 | delivery | event-based | CKR-010 | delivery_telemetry.md DT-001 |
| Reconstruction Artifact Delivery Count Per Run | DT-003 | delivery | event-based | CKR-010 | delivery_telemetry.md DT-003 |
| Pipeline Execution Mode At Runtime | AT-006 | activity | event-based | CKR-010 | activity_telemetry.md AT-006 |
| PEG Total Edge Count | ST-010 | structural | static | CKR-007 | structural_telemetry.md ST-010 |
| PEG Pipeline Edge Count | ST-012 | structural | static | CKR-007 | structural_telemetry.md ST-012 |
| PEG Model Activation Edge Count | ST-013 | structural | static | CKR-007 | structural_telemetry.md ST-013 |
| PEG Governance Edge Count | ST-014 | structural | static | CKR-007 | structural_telemetry.md ST-014 |
| Non-PEG Governance Constraint Count | ST-015 | structural | static | CKR-007 | structural_telemetry.md ST-015 |
| PEG Total Node Count | ST-007 | structural | static | CKR-007 | structural_telemetry.md ST-007 |

**Telemetry temporal range for this signal:** event-based (requires runtime telemetry for full computation); static component (CKR-007) computable from current telemetry.

---

## Signal: CKR-015 — Risk Acceleration Gradient (RAG) [Composite]

Composite of CKR-008 (Change Concentration), CKR-006 (Coordination Pressure), CKR-009 (Structural Volatility).

| Telemetry Input | Metric ID | Dimension | Temporal Classification | Via Signal | Telemetry Source |
|---|---|---|---|---|---|
| Automation Trigger Frequency | AT-001 | activity | time-series | CKR-008 | activity_telemetry.md AT-001 |
| Auto-Commit Event Frequency | AT-002 | activity | time-series | CKR-008 | activity_telemetry.md AT-002 |
| Script Execution Event Count | AT-003 | activity | event-based | CKR-008 | activity_telemetry.md AT-003 |
| PiOS Pipeline Stage Count | ST-016 | structural | static | CKR-006 | structural_telemetry.md ST-016 |
| PEG Pipeline Edge Count | ST-012 | structural | static | CKR-006 | structural_telemetry.md ST-012 |
| Pipeline Module Execution Count Per Run | AT-005 | activity | event-based | CKR-006 | activity_telemetry.md AT-005 |
| Validation Gate Enforcement Count Per Run | AT-007 | activity | event-based | CKR-006 | activity_telemetry.md AT-007 |
| PEG Total Node Count | ST-007 | structural | static | CKR-009 | structural_telemetry.md ST-007 |
| PEG Total Edge Count | ST-010 | structural | static | CKR-009 | structural_telemetry.md ST-010 |
| PEG Module Node Count | ST-009 | structural | static | CKR-009 | structural_telemetry.md ST-009 |
| Component Containment Depth | ST-022 | structural | static | CKR-009 | structural_telemetry.md ST-022 |
| Architectural Responsibility Zone Count | ST-006 | structural | static | CKR-009 | structural_telemetry.md ST-006 |
| PEG Containment Edge Count | ST-011 | structural | static | CKR-009 | structural_telemetry.md ST-011 |

**Telemetry temporal range for this signal:** time-series (requires sequential telemetry observations for full computation); static component (CKR-009 + static CKR-006) computable from current telemetry.

---

## Matrix Summary

| Signal | CKR | Class | Telemetry Inputs | Temporal Range | Static Computable |
|---|---|---|---|---|---|
| Coordination Pressure | CKR-006 | atomic | ST-016, ST-012, AT-005, AT-007 | static + event-based | partial (structural component) |
| Dependency Load | CKR-007 | atomic | ST-007, ST-010, ST-012, ST-013, ST-014, ST-015 | static | yes |
| Change Concentration | CKR-008 | atomic | AT-001, AT-002, AT-003 | time-series + event-based | no |
| Structural Volatility | CKR-009 | atomic | ST-006, ST-007, ST-009, ST-010, ST-011, ST-022 | static | yes |
| Execution Throughput | CKR-010 | atomic | AT-005, AT-006, DT-001, DT-003, DT-007 | event-based | no |
| Execution Stability | CKR-011 | atomic | AT-007, AT-009, DT-007, DT-008 | event-based | no |
| ESI | CKR-014 | composite | 14 inputs (via CKR-007, CKR-010, CKR-011) | event-based | partial (CKR-007 component) |
| RAG | CKR-015 | composite | 13 inputs (via CKR-006, CKR-008, CKR-009) | time-series | partial (CKR-009 + static CKR-006) |

**Total telemetry inputs mapped: 26 distinct metrics (of 40 total)**
**Telemetry metrics not mapped to any signal: 14 (listed in Matrix Rule)**

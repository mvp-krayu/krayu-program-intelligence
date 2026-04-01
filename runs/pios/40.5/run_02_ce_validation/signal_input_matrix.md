# Signal Input Matrix

**run_id:** run_02_ce_validation
**stream:** Stream 40.5 — PiOS Signal Computation Engine
**contract:** PIOS-40.5-RUN02-CE-VALIDATION-CONTRACT-v1
**upstream_contract:** PIOS-40.4-RUN01-CONTRACT-v1
**date:** 2026-04-01
**enforcement:** CE.3/CE.4/CE.5 aligned

---

## I1 Interface Validation (GH-01)

| Check | Result |
|---|---|
| input_contract_id present | PASS — pios_core_40.16_input_contract_0.1 |
| Input boundary: only docs/pios/40.4/ | PASS |
| No pre-computed signals in input | PASS — no ESI/RAG/SSZ/SSI keys in 40.4 telemetry |
| run_id present and non-empty | PASS — run_02_ce_validation |
| 40.4 artifacts parseable | PASS — all 17 artifacts confirmed present |
| No 41.x / 42.x paths accessed | PASS |
| No DRIFT-001 (computeSSZ in pipeline) | PASS |

**GH-01 result: PASS — execution authorized to proceed**

---

## Matrix Rule

This matrix declares all telemetry input variables for run_02_ce_validation. Variables are drawn exclusively from docs/pios/40.4/ canonical artifacts. The canonical signal schema for Stream 40.5 is defined by signal_validation_report.md (run_01 baseline): SIG-001..SIG-008.

Only variables consumed by signals that can be computed from static 40.4 telemetry are marked as active for this run. Time-series and event-based variables are declared but blocked.

---

## Group VAR_ST — Structural Telemetry Variables

All sourced from: docs/pios/40.4/structural_telemetry.md

| Variable | DIM / Metric Ref | Name | Type | Value | Signal Use |
|---|---|---|---|---|---|
| VAR_ST_007 | ST-007 | PEG Total Node Count | static count | 22 | SIG-002, SIG-004 |
| VAR_ST_009 | ST-009 | PEG Module Node Count | static count | 10 | SIG-004 |
| VAR_ST_010 | ST-010 | PEG Total Edge Count | static count | 28 | SIG-004 |
| VAR_ST_011 | ST-011 | PEG Containment Edge Count | static count | 12 | SIG-004 |
| VAR_ST_012 | ST-012 | PEG Pipeline Edge Count | static count | 7 | SIG-001, SIG-002 |
| VAR_ST_013 | ST-013 | PEG Model Activation Edge Count | static count | 3 | SIG-002 |
| VAR_ST_014 | ST-014 | PEG Governance Edge Count | static count | 2 | SIG-002 |
| VAR_ST_015 | ST-015 | Non-PEG Governance Constraint Count | static count | 3 | SIG-002 |
| VAR_ST_016 | ST-016 | PiOS Pipeline Stage Count | static count | 8 | SIG-001 |
| VAR_ST_006 | ST-006 | Architectural Responsibility Zone Count | static count | 8 | SIG-004 |

---

## Group VAR_AT — Activity Telemetry Variables

All sourced from: docs/pios/40.4/activity_telemetry.md

| Variable | Metric Ref | Name | Type | Value | Signal Use |
|---|---|---|---|---|---|
| VAR_AT_005 | AT-005 | Pipeline Module Execution Count Per Run | event-based count | 8 (per run) | SIG-001, SIG-005 |
| VAR_AT_007 | AT-007 | Validation Gate Enforcement Count Per Run | event-based count | PENDING runtime | SIG-001, SIG-006 |
| VAR_AT_001 | AT-001 | Automation Trigger Frequency | time-series | PENDING time-series | SIG-003 |
| VAR_AT_002 | AT-002 | Auto-Commit Event Frequency | time-series | PENDING time-series | SIG-003 |
| VAR_AT_003 | AT-003 | Script Execution Event Count | event-based | 1 per invocation | SIG-003 (partial) |
| VAR_AT_009 | AT-009 | Feedback Routing Event Count Per Pipeline Run | event-based | PENDING runtime | SIG-006 |

---

## Group VAR_DT — Delivery Telemetry Variables

All sourced from: docs/pios/40.4/delivery_telemetry.md

| Variable | Metric Ref | Name | Type | Value | Signal Use |
|---|---|---|---|---|---|
| VAR_DT_001 | DT-001 | Intelligence Output Artifact Count Per Run | event-based count | 4 (per run) | SIG-005 |
| VAR_DT_003 | DT-003 | Reconstruction Artifact Delivery Count Per Run | event-based count | 5 (per run) | SIG-005 |
| VAR_DT_007 | DT-007 | Pipeline Run Completion Status | event-based boolean | PENDING runtime | SIG-005, SIG-006 |
| VAR_DT_008 | DT-008 | Feedback Loop Delivery Event Count | event-based count | PENDING runtime | SIG-006 |

---

## Dependency Telemetry Coverage Variables

Sourced from: docs/pios/40.4/dependency_telemetry.md

| Variable | Description | Coverage Level | Count |
|---|---|---|---|
| VAR_DEP_HIGH | Dependencies with HIGH telemetry coverage | HIGH | 5 (SD-002, SD-004, SD-008, SD-009, BD-002) |
| VAR_DEP_PARTIAL | Dependencies with PARTIAL coverage | PARTIAL | 5 (SD-001, SD-005, SD-006, SD-007, BD-003) |
| VAR_DEP_INDIRECT | Dependencies with INDIRECT coverage | INDIRECT | 7 (SD-003, BD-001, BD-004, BD-005, BD-006, BD-007, LD-001) |
| VAR_DEP_NONE | Dependencies with no server-observable coverage | NONE | 6 (FD-001..005, LD-002) |
| VAR_DEP_TOTAL | Total enumerated dependencies | total | 23 |

---

## Matrix Summary

| Group | Active Variables | Blocked Variables | Total |
|---|---|---|---|
| VAR_ST (structural) | 10 | 0 | 10 |
| VAR_AT (activity) | 2 (AT-005, AT-003 partial) | 4 | 6 |
| VAR_DT (delivery) | 2 (DT-001, DT-003) | 2 | 4 |
| VAR_DEP (dependency coverage) | 5 (all static) | 0 | 5 |
| **Total** | **19** | **6** | **25** |

Active for computation: 19 variables (all from static 40.4 fields)
Blocked: 6 variables (time-series or event-based runtime required)

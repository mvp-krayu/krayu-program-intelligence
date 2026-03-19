# Activity Telemetry

**Stream:** 40.4 — PiOS Telemetry Extraction
**Input:** docs/pios/40.3/reconstruction/ (full corpus), docs/pios/40.3/traceability/structural_traceability_map.md
**Evidence references via:** docs/pios/40.2/normalized_evidence_map.md, docs/pios/40.2/evidence_surface_inventory.md
**Schema:** docs/pios/40.4/telemetry_schema.md
**Date:** 2026-03-18

---

## Extraction Rule

Activity telemetry captures measurements of engineering activity events: CI/CD automation triggers, pipeline execution events, module-level operations, and actor-driven actions. All values are derived directly from the 40.3 reconstruction corpus. No value is inferred. Every metric is classified as `event-based` or `time-series`.

---

## Automation Activity Metrics

### AT-001 — Automation Trigger Frequency

| Field | Value |
|---|---|
| Metric ID | AT-001 |
| Metric Name | Automation Trigger Frequency |
| Dimension | activity |
| Temporal Classification | time-series |
| Unit | count per interval |
| Surface | TSD-04a |
| Structural Element | N-CF03 (update-handbook-indexes.yml) — trigger: push to `main` branch |
| Evidence Reference | normalized_evidence_map.md §4.1 |
| Description | Count of CI/CD workflow trigger events (push to `main`) per unit time interval. Measured as accumulated invocations of the `update-indexes` job over successive time intervals. |

---

### AT-002 — Auto-Commit Event Frequency

| Field | Value |
|---|---|
| Metric ID | AT-002 |
| Metric Name | Auto-Commit Event Frequency |
| Dimension | activity |
| Temporal Classification | time-series |
| Unit | count per interval |
| Surface | TSD-04a, TSD-04b |
| Structural Element | N-CF03 → N-SC01 chain; actor: github-actions / actions@github.com |
| Evidence Reference | normalized_evidence_map.md §4.1 |
| Description | Count of automated git commit events executed by the github-actions actor per unit time interval. Each commit corresponds to one successful CI/CD execution committing docs/handbook updates. |

---

### AT-003 — Script Execution Event Count

| Field | Value |
|---|---|
| Metric ID | AT-003 |
| Metric Name | Script Execution Event Count |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-04b |
| Structural Element | N-SC01 (generate-stream-indexes.sh) |
| Evidence Reference | normalized_evidence_map.md §6.1 |
| Description | Count of executions of generate-stream-indexes.sh per CI/CD invocation event. Value per invocation: 1. |

---

### AT-004 — Streams Processed Per Automation Run

| Field | Value |
|---|---|
| Metric ID | AT-004 |
| Metric Name | Streams Processed Per Automation Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-04b |
| Structural Element | N-SC01 — stream directories processed: program-intelligence-discipline, program-intelligence-framework, signal-science, program-intelligence-demonstrations, program-intelligence-case-studies, program-intelligence-commercialization |
| Evidence Reference | normalized_evidence_map.md §6.1 |
| Description | Count of stream directories processed by generate-stream-indexes.sh per execution event. Value per execution: 6. |

---

## Pipeline Activity Metrics

### AT-005 — Pipeline Module Execution Count Per Run

| Field | Value |
|---|---|
| Metric ID | AT-005 |
| Metric Name | Pipeline Module Execution Count Per Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-03 |
| Structural Element | dependency_map.md §1 — M-03 through M-10 |
| Evidence Reference | normalized_evidence_map.md §8 |
| Description | Count of pipeline modules executed per pipeline run event. Value per run: 8 (M-03 through M-10 in mandatory sequential order). |

---

### AT-006 — Pipeline Execution Mode At Runtime

| Field | Value |
|---|---|
| Metric ID | AT-006 |
| Metric Name | Pipeline Execution Mode At Runtime |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | enumeration |
| Surface | TSD-02i |
| Structural Element | capability_map.md CAP-08 — Snapshot Mode \| Continuous Mode \| Monitoring Mode |
| Evidence Reference | normalized_evidence_map.md §2.9 |
| Description | Execution mode active at the time of each pipeline run event. Measured as the enumerated mode value recorded at pipeline initiation. Allowed values: Snapshot Mode, Continuous Mode, Monitoring Mode. |

---

### AT-007 — Validation Gate Enforcement Count Per Run

| Field | Value |
|---|---|
| Metric ID | AT-007 |
| Metric Name | Validation Gate Enforcement Count Per Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-02i |
| Structural Element | capability_map.md CAP-08 — validation gate enforcement |
| Evidence Reference | normalized_evidence_map.md §2.9 |
| Description | Count of validation gate enforcement events per pipeline run, as coordinated by M-09 (Agentic Orchestration Layer). |

---

### AT-008 — Evidence Source Count Per Acquisition Run

| Field | Value |
|---|---|
| Metric ID | AT-008 |
| Metric Name | Evidence Source Count Per Acquisition Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-02c |
| Structural Element | capability_map.md CAP-01 — M-03 (Evidence Acquisition) |
| Evidence Reference | normalized_evidence_map.md §2.3 |
| Description | Count of evidence sources identified and connected per M-03 acquisition run event. |

---

### AT-009 — Feedback Routing Event Count Per Pipeline Run

| Field | Value |
|---|---|
| Metric ID | AT-009 |
| Metric Name | Feedback Routing Event Count Per Pipeline Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-02j |
| Structural Element | program_execution_graph.md — E-06a: N-M10 → N-DS06 (Stream 77) |
| Evidence Reference | normalized_evidence_map.md §2.10 |
| Description | Count of improvement observations routed from M-10 (Feedback and CI) to Stream 77 per pipeline run event. |

---

### AT-010 — Reconstruction Artifact Production Count Per Run

| Field | Value |
|---|---|
| Metric ID | AT-010 |
| Metric Name | Reconstruction Artifact Production Count Per Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-02d |
| Structural Element | dependency_map.md §6 — M-04 outputs: entity_catalog.md, repository_map.md, dependency_map.md, interface_map.md, program_execution_graph.md |
| Evidence Reference | normalized_evidence_map.md §2.4, §2.5 |
| Description | Count of reconstruction artifacts produced by M-04 (Reverse Engineering Engine) per pipeline run event. Value per run: 5. |

---

## Activity Telemetry Summary

| Metric ID | Name | Temporal Classification |
|---|---|---|
| AT-001 | Automation Trigger Frequency | time-series |
| AT-002 | Auto-Commit Event Frequency | time-series |
| AT-003 | Script Execution Event Count | event-based |
| AT-004 | Streams Processed Per Automation Run | event-based |
| AT-005 | Pipeline Module Execution Count Per Run | event-based |
| AT-006 | Pipeline Execution Mode At Runtime | event-based |
| AT-007 | Validation Gate Enforcement Count Per Run | event-based |
| AT-008 | Evidence Source Count Per Acquisition Run | event-based |
| AT-009 | Feedback Routing Event Count Per Pipeline Run | event-based |
| AT-010 | Reconstruction Artifact Production Count Per Run | event-based |

**Total activity metrics: 10**
**Temporal classification coverage: 2 time-series, 8 event-based**
**All metrics evidence-linked: yes**
**All metrics structurally mapped: yes**

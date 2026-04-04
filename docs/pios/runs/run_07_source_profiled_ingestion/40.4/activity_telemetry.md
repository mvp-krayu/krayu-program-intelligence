# Activity Telemetry
run_id: run_07_source_profiled_ingestion
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG3-BOOTSTRAP
upstream_contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh
input: docs/pios/runs/run_07_source_profiled_ingestion/40.3/reconstruction/ (full corpus), docs/pios/runs/run_07_source_profiled_ingestion/40.3/traceability/structural_traceability_map.md
evidence_references_via: docs/pios/runs/run_07_source_profiled_ingestion/40.2/normalized_evidence_map.md, docs/pios/runs/run_07_source_profiled_ingestion/40.2/evidence_surface_inventory.md
schema: docs/pios/runs/run_07_source_profiled_ingestion/40.4/telemetry_schema.md

---

## Extraction Rule

Activity telemetry captures measurements of engineering activity events and distributions. All values are derived directly from the 40.3 reconstruction corpus. No value is inferred or computed heuristically. Every metric is classified as `event-based` or `time-series` to reflect its activity nature.

---

## Pipeline Activity Metrics

### AT-001 — Automation Trigger Frequency

| Field | Value |
|---|---|
| Metric ID | AT-001 |
| Metric Name | Automation Trigger Frequency |
| Dimension | activity |
| Temporal Classification | time-series |
| Unit | count per push-to-main event |
| Surface | TSD-04a |
| Structural Element | N-CF03 — update-handbook-indexes.yml; trigger: push to main |
| Evidence Reference | normalized_evidence_map.md §4.1 |
| Description | Count of CI/CD automation triggers fired per push-to-main event. One trigger per push to main. Actor: github-actions. |

---

### AT-002 — Auto-Commit Event Frequency

| Field | Value |
|---|---|
| Metric ID | AT-002 |
| Metric Name | Auto-Commit Event Frequency |
| Dimension | activity |
| Temporal Classification | time-series |
| Unit | count per automation run |
| Surface | TSD-04a, TSD-04b |
| Structural Element | N-CF03 → N-SC01; git commit by actor: github-actions |
| Evidence Reference | normalized_evidence_map.md §4.1 |
| Description | Count of automated git commits per CI/CD run. One auto-commit staged from docs/handbook path per run. |

---

### AT-003 — Script Execution Event Count

| Field | Value |
|---|---|
| Metric ID | AT-003 |
| Metric Name | Script Execution Event Count |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count per CI/CD run |
| Surface | TSD-04b |
| Structural Element | N-SC01 — generate-stream-indexes.sh |
| Evidence Reference | normalized_evidence_map.md §6.1 |
| Description | Count of script execution events per CI/CD invocation. One script execution (generate-stream-indexes.sh) per automation run. |

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
| Structural Element | N-SC01 — generate-stream-indexes.sh; 6 stream directories (10, 20, 30, 40, 50, 60) |
| Evidence Reference | normalized_evidence_map.md §6.1 |
| Description | Count of stream directories processed in a single automation run. Value: 6. Streams: 10, 20, 30, 40, 50, 60. |

---

## PiOS Pipeline Activity Metrics

### AT-005 — Pipeline Module Execution Count Per Run

| Field | Value |
|---|---|
| Metric ID | AT-005 |
| Metric Name | Pipeline Module Execution Count Per Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-03a |
| Structural Element | dependency_map.md §1 — M-03 through M-10 in mandatory sequence |
| Evidence Reference | normalized_evidence_map.md §8 |
| Description | Count of pipeline stage modules executed per PiOS pipeline run. Value: 8. Stages: M-03 (Evidence Connectors) through M-10 (Feedback and CI). |

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
| Structural Element | capability_map.md CAP-08 — Snapshot Mode, Continuous Mode, Monitoring Mode |
| Evidence Reference | normalized_evidence_map.md §2.9 |
| Description | The execution mode selected for a pipeline run. Values: Snapshot Mode, Continuous Mode, or Monitoring Mode. One mode active per run. |

---

### AT-007 — Validation Gate Enforcement Count Per Run

| Field | Value |
|---|---|
| Metric ID | AT-007 |
| Metric Name | Validation Gate Enforcement Count Per Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-02i |
| Structural Element | capability_map.md CAP-08 — M-09 enforces validation gates |
| Evidence Reference | normalized_evidence_map.md §2.9 |
| Description | Count of validation gate enforcement events per pipeline run. Enforced by M-09 (Agentic Orchestration Layer). |

---

### AT-008 — Evidence Source Count Per Acquisition Run

| Field | Value |
|---|---|
| Metric ID | AT-008 |
| Metric Name | Evidence Source Count Per Acquisition Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-02c |
| Structural Element | capability_map.md CAP-01 — M-03 (PiOS Evidence Connectors Layer) |
| Evidence Reference | normalized_evidence_map.md §2.3 |
| Description | Count of evidence sources acquired per M-03 execution. Measured at Stage 1 of the PiOS pipeline. |

---

### AT-009 — Feedback Routing Event Count Per Pipeline Run

| Field | Value |
|---|---|
| Metric ID | AT-009 |
| Metric Name | Feedback Routing Event Count Per Pipeline Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-02j |
| Structural Element | program_execution_graph.md — E-06a: N-M10 → N-DS06 (Stream 77) |
| Evidence Reference | normalized_evidence_map.md §2.10 |
| Description | Count of improvement routing events fired per pipeline run at M-10. Routed to Stream 77 (Discipline Feedback Loop Registry). |

---

### AT-010 — Reconstruction Artifact Production Count Per Run

| Field | Value |
|---|---|
| Metric ID | AT-010 |
| Metric Name | Reconstruction Artifact Production Count Per Run |
| Dimension | activity |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-02d |
| Structural Element | dependency_map.md §6 — M-04 produces 5 artifacts consumed by M-05 |
| Evidence Reference | normalized_evidence_map.md §2.4, §2.5 |
| Description | Count of reconstruction artifacts produced by M-04 per pipeline run and delivered to M-05. Value: 5. |

---

## Activity Telemetry Summary

| Metric ID | Name | Temporal Classification | Value |
|---|---|---|---|
| AT-001 | Automation Trigger Frequency | time-series | 1 per push-to-main |
| AT-002 | Auto-Commit Event Frequency | time-series | 1 per run |
| AT-003 | Script Execution Event Count | event-based | 1 per run |
| AT-004 | Streams Processed Per Automation Run | event-based | 6 |
| AT-005 | Pipeline Module Execution Count Per Run | event-based | 8 |
| AT-006 | Pipeline Execution Mode At Runtime | event-based | enum (3 values) |
| AT-007 | Validation Gate Enforcement Count Per Run | event-based | per run |
| AT-008 | Evidence Source Count Per Acquisition Run | event-based | per run |
| AT-009 | Feedback Routing Event Count Per Pipeline Run | event-based | per run |
| AT-010 | Reconstruction Artifact Production Count Per Run | event-based | 5 |

**Total activity metrics: 10**
**All metrics evidence-linked: yes**
**All metrics structurally mapped: yes**

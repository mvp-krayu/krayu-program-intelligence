# Delivery Telemetry

**Stream:** 40.4 — PiOS Telemetry Extraction
**Input:** docs/pios/40.3/reconstruction/ (full corpus), docs/pios/40.3/traceability/structural_traceability_map.md
**Evidence references via:** docs/pios/40.2/normalized_evidence_map.md, docs/pios/40.2/evidence_surface_inventory.md
**Schema:** docs/pios/40.4/telemetry_schema.md
**Date:** 2026-03-18

---

## Extraction Rule

Delivery telemetry captures measurements of output delivery: artifact counts, delivery paths, delivery completeness, and latency where observable. All values are derived directly from the 40.3 reconstruction corpus. No value is inferred. Every metric is classified as `event-based` or `time-series`.

---

## Intelligence Output Delivery Metrics

### DT-001 — Intelligence Output Artifact Count Per Pipeline Run

| Field | Value |
|---|---|
| Metric ID | DT-001 |
| Metric Name | Intelligence Output Artifact Count Per Pipeline Run |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-02h |
| Structural Element | program_execution_graph.md — E-03a: N-M08 → N-C03 (Signäl Platform); capability_map.md CAP-07 outputs |
| Evidence Reference | normalized_evidence_map.md §1.2, §2.8 |
| Description | Count of intelligence output artifacts delivered from M-08 (Intelligence Synthesis Layer) to Signäl Platform per pipeline run event. Value per run: 4. Artifacts: program_intelligence_summary.md, evidence_linked_intelligence_packet.md, executive_interpretation_brief.md, intelligence_lineage_map.md. |

---

### DT-002 — Cross-Component Delivery Event Count Per Run

| Field | Value |
|---|---|
| Metric ID | DT-002 |
| Metric Name | Cross-Component Delivery Event Count Per Run |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-01b, TSD-01c |
| Structural Element | program_execution_graph.md — E-03a (M-08 → Signäl Platform) |
| Evidence Reference | normalized_evidence_map.md §1.2, §2.8 |
| Description | Count of cross-component delivery events from PiOS to Signäl Platform per pipeline run event. Value per run: 1 (edge E-03a represents one delivery boundary crossing). |

---

## Reconstruction Artifact Delivery Metrics

### DT-003 — Reconstruction Artifact Delivery Count Per Run

| Field | Value |
|---|---|
| Metric ID | DT-003 |
| Metric Name | Reconstruction Artifact Delivery Count Per Run |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-02d |
| Structural Element | dependency_map.md §6 — M-04 outputs to M-05: entity_catalog.md, repository_map.md, dependency_map.md, interface_map.md, program_execution_graph.md |
| Evidence Reference | normalized_evidence_map.md §2.4, §2.5 |
| Description | Count of reconstruction artifacts delivered from M-04 (Reverse Engineering Engine) to M-05 (Telemetry Extraction Layer) per pipeline run event. Value per run: 5. |

---

## Handbook Delivery Metrics

### DT-004 — Handbook Index File Delivery Count Per CI/CD Run

| Field | Value |
|---|---|
| Metric ID | DT-004 |
| Metric Name | Handbook Index File Delivery Count Per CI/CD Run |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-04b, TSD-04c |
| Structural Element | N-SC01 → N-HB01; program_execution_graph.md — E-07b |
| Evidence Reference | normalized_evidence_map.md §6.1 |
| Description | Count of handbook index files delivered to docs/handbook/ by generate-stream-indexes.sh per CI/CD execution event. Value per run: 6. Files: handbook_stream_10_index.md, handbook_stream_20_index.md, handbook_stream_30_index.md, handbook_stream_40_index.md, handbook_stream_50_index.md, handbook_stream_60_index.md. |

---

### DT-005 — Handbook Delivery Stream Coverage

| Field | Value |
|---|---|
| Metric ID | DT-005 |
| Metric Name | Handbook Delivery Stream Coverage |
| Dimension | delivery |
| Temporal Classification | static |
| Unit | count |
| Surface | TSD-04c |
| Structural Element | N-HB01 (docs/handbook/) — stream directories covered: Streams 10, 20, 30, 40, 50, 60 |
| Evidence Reference | normalized_evidence_map.md §6.1 |
| Description | Count of discipline streams covered by the handbook index generation automation. Value: 6. Streams: 10, 20, 30, 40, 50, 60. |

---

### DT-006 — Push-to-Delivery Latency

| Field | Value |
|---|---|
| Metric ID | DT-006 |
| Metric Name | Push-to-Delivery Latency |
| Dimension | delivery |
| Temporal Classification | time-series |
| Unit | duration |
| Surface | TSD-04a, TSD-04b, TSD-04c |
| Structural Element | N-CF03 → N-SC01 → N-HB01 chain; program_execution_graph.md — E-07a, E-07b |
| Evidence Reference | normalized_evidence_map.md §4.1, §6.1 |
| Description | Duration elapsed between push-to-main trigger event and successful delivery of handbook index files to docs/handbook/. Measured per CI/CD execution event and accumulated across successive runs as a time-series. |

---

## Pipeline Delivery Metrics

### DT-007 — Pipeline Run Completion Status

| Field | Value |
|---|---|
| Metric ID | DT-007 |
| Metric Name | Pipeline Run Completion Status |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | boolean |
| Surface | TSD-03 |
| Structural Element | dependency_map.md §1 — M-03 through M-10 full pipeline; capability_map.md CAP-08 (validation gates) |
| Evidence Reference | normalized_evidence_map.md §8, §2.9 |
| Description | Binary status of pipeline run completion at the end of each pipeline execution event. Values: complete (all 8 stages executed and validation gates passed) / incomplete (one or more stages not completed or validation gate not passed). |

---

### DT-008 — Feedback Loop Delivery Event Count

| Field | Value |
|---|---|
| Metric ID | DT-008 |
| Metric Name | Feedback Loop Delivery Event Count |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count |
| Surface | TSD-02j |
| Structural Element | program_execution_graph.md — E-06a: N-M10 → N-DS06 (Stream 77 — Discipline Feedback Loop Registry) |
| Evidence Reference | normalized_evidence_map.md §2.10 |
| Description | Count of delivery events from M-10 (Feedback and CI) to Stream 77 per pipeline run event. Measures the presence of feedback routing activity at the terminal stage of the pipeline. |

---

## Delivery Telemetry Summary

| Metric ID | Name | Temporal Classification |
|---|---|---|
| DT-001 | Intelligence Output Artifact Count Per Pipeline Run | event-based |
| DT-002 | Cross-Component Delivery Event Count Per Run | event-based |
| DT-003 | Reconstruction Artifact Delivery Count Per Run | event-based |
| DT-004 | Handbook Index File Delivery Count Per CI/CD Run | event-based |
| DT-005 | Handbook Delivery Stream Coverage | static |
| DT-006 | Push-to-Delivery Latency | time-series |
| DT-007 | Pipeline Run Completion Status | event-based |
| DT-008 | Feedback Loop Delivery Event Count | event-based |

**Total delivery metrics: 8**
**Temporal classification coverage: 1 static, 1 time-series, 6 event-based**
**All metrics evidence-linked: yes**
**All metrics structurally mapped: yes**

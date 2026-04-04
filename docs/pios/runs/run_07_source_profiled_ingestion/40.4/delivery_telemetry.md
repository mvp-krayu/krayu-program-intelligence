# Delivery Telemetry
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

Delivery telemetry captures measurements of output delivery: artifact delivery counts, delivery paths, and delivery latency where observable. All values are derived directly from the 40.3 reconstruction corpus. No value is inferred or computed heuristically. Every metric is classified as `event-based` or `time-series`.

---

## Intelligence Output Delivery Metrics

### DT-001 — Intelligence Output Artifact Count Per Pipeline Run

| Field | Value |
|---|---|
| Metric ID | DT-001 |
| Metric Name | Intelligence Output Artifact Count Per Pipeline Run |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-01c, TSD-02h |
| Structural Element | E-03a: N-M08 → N-C03; capability_map.md CAP-07 — 4 named intelligence output artifacts |
| Evidence Reference | normalized_evidence_map.md §1.2, §2.8 |
| Description | Count of intelligence output artifacts delivered by M-08 (Intelligence Synthesis Layer) per pipeline run. Value: 4. Artifacts: program_intelligence_summary.md, evidence_linked_intelligence_packet.md, executive_interpretation_brief.md, intelligence_lineage_map.md. |

---

### DT-002 — Cross-Component Delivery Event Count Per Run

| Field | Value |
|---|---|
| Metric ID | DT-002 |
| Metric Name | Cross-Component Delivery Event Count Per Pipeline Run |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-01b, TSD-01c |
| Structural Element | E-03a: N-M08 → N-C03 (PiOS → Signäl Platform) |
| Evidence Reference | normalized_evidence_map.md §1.2, §2.8 |
| Description | Count of cross-component delivery events per pipeline run. Value: 1 delivery event (M-08 → Signäl Platform); delivers 4 artifacts per event. |

---

## Reconstruction Delivery Metrics

### DT-003 — Reconstruction Artifact Delivery Count Per Run

| Field | Value |
|---|---|
| Metric ID | DT-003 |
| Metric Name | Reconstruction Artifact Delivery Count Per Run |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-02d, TSD-02e |
| Structural Element | dependency_map.md §6 — M-04 delivers 5 artifacts to M-05 |
| Evidence Reference | normalized_evidence_map.md §2.4, §2.5 |
| Description | Count of reconstruction artifacts delivered from M-04 (Reverse Engineering Engine) to M-05 (Telemetry Extraction Layer) per pipeline run. Value: 5. |

---

## Handbook Delivery Metrics

### DT-004 — Handbook Index File Delivery Count Per CI/CD Run

| Field | Value |
|---|---|
| Metric ID | DT-004 |
| Metric Name | Handbook Index File Delivery Count Per CI/CD Run |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count per CI/CD run |
| Surface | TSD-04b, TSD-04c |
| Structural Element | E-07b: N-SC01 → N-HB01; 6 index files written to docs/handbook/ |
| Evidence Reference | normalized_evidence_map.md §6.1 |
| Description | Count of handbook index files produced and written per CI/CD automation run. Value: 6. One index per stream (Streams 10, 20, 30, 40, 50, 60). |

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
| Structural Element | N-HB01 — docs/handbook/; Streams 10, 20, 30, 40, 50, 60 |
| Evidence Reference | normalized_evidence_map.md §6.1 |
| Description | Count of streams whose index files are included in each handbook generation run. Value: 6. Streams covered: 10, 20, 30, 40, 50, 60. |

---

### DT-006 — Push-to-Delivery Latency

| Field | Value |
|---|---|
| Metric ID | DT-006 |
| Metric Name | Push-to-Delivery Latency |
| Dimension | delivery |
| Temporal Classification | time-series |
| Unit | duration (observable from CI/CD run timestamps) |
| Surface | TSD-04a, TSD-04b, TSD-04c |
| Structural Element | E-07a + E-07b: N-CF03 → N-SC01 → N-HB01 |
| Evidence Reference | normalized_evidence_map.md §4.1, §6.1 |
| Description | Duration from push-to-main event to handbook index file commit. Measured as elapsed time across E-07a (yml invokes script) and E-07b (script writes to docs/handbook/). |

---

## Pipeline Completion Metrics

### DT-007 — Pipeline Run Completion Status

| Field | Value |
|---|---|
| Metric ID | DT-007 |
| Metric Name | Pipeline Run Completion Status |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | enumeration |
| Surface | TSD-03a, TSD-02i |
| Structural Element | dependency_map.md §1 — M-03 through M-10; capability_map.md CAP-08 validation gates |
| Evidence Reference | normalized_evidence_map.md §8, §2.9 |
| Description | Completion status of a full pipeline run as enforced by M-09 validation gates. Values: complete (all 8 stages passed all gates) or incomplete (gate failure at a named stage). |

---

### DT-008 — Feedback Loop Delivery Event Count

| Field | Value |
|---|---|
| Metric ID | DT-008 |
| Metric Name | Feedback Loop Delivery Event Count |
| Dimension | delivery |
| Temporal Classification | event-based |
| Unit | count per pipeline run |
| Surface | TSD-02j |
| Structural Element | E-06a: N-M10 → N-DS06 (Stream 77 — Discipline Feedback Loop Registry) |
| Evidence Reference | normalized_evidence_map.md §2.10 |
| Description | Count of improvement artifacts routed from M-10 (Feedback and CI) to Stream 77 per pipeline run. |

---

## Delivery Telemetry Summary

| Metric ID | Name | Temporal Classification | Value |
|---|---|---|---|
| DT-001 | Intelligence Output Artifact Count Per Pipeline Run | event-based | 4 |
| DT-002 | Cross-Component Delivery Event Count Per Run | event-based | 1 |
| DT-003 | Reconstruction Artifact Delivery Count Per Run | event-based | 5 |
| DT-004 | Handbook Index File Delivery Count Per CI/CD Run | event-based | 6 |
| DT-005 | Handbook Delivery Stream Coverage | static | 6 |
| DT-006 | Push-to-Delivery Latency | time-series | duration |
| DT-007 | Pipeline Run Completion Status | event-based | enum |
| DT-008 | Feedback Loop Delivery Event Count | event-based | per run |

**Total delivery metrics: 8**
**All metrics evidence-linked: yes**
**All metrics structurally mapped: yes**

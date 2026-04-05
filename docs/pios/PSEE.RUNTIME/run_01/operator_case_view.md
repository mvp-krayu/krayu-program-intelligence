# PSEE Runtime — Operator Case View

stream: PSEE-RUNTIME.1
run_id: run_01
source_date: 2026-04-05
source_run: run_07_source_profiled_ingestion
baseline_commit: 9000f73eb1c88d2f13b19e748f065d8700d9ea72
rhp_root: docs/pios/IG.RUNTIME/run_01

---

## System Identity

| Field | Value |
|---|---|
| source_kind | LOCAL_SNAPSHOT |
| version | blueedge-program-intelligence/source-v3.23 |
| baseline_anchor | pios-core-v0.4-final |
| admissibility | GOVERNED |
| resolution | DETERMINISTIC |

---

## Runtime State

| Field | Value |
|---|---|
| current_state | PENDING_PSEE_EXECUTION |
| execution_mode | FULL |
| psee_engine_run | NO |

PANEL-01 (Primary Score): PENDING — PSEE engine not yet executed
PANEL-02 (Dimensions):    PENDING — PSEE engine not yet executed
PANEL-03 (Review Surface): PENDING — PSEE engine not yet executed
PANEL-04 (Portfolio): 1 run registered — scores PENDING

---

## Evidence Layer Summary

total_admitted: 30
total_excluded: 0
decision_basis: IG.6 orchestration gate PASS — ORCHESTRATION_COMPLETE 26/26; IG.7 batch runner BATCH_COMPLETE 9/9

### L40_2 — Evidence Layer

source_path: docs/pios/runs/run_07_source_profiled_ingestion/40.2
artifact_count: 4
admission_status: ADMITTED

- evidence_classification_map.md
- evidence_surface_inventory.md
- intake_validation_log.md
- normalized_evidence_map.md

### L40_3 — Structural Layer

source_path: docs/pios/runs/run_07_source_profiled_ingestion/40.3
artifact_count: 6
admission_status: ADMITTED

- dependency_map.md
- entity_catalog.md
- interface_map.md
- program_execution_graph.md
- reconstruction_validation_log.md
- structural_traceability_map.md

### L40_4 — Telemetry Layer

source_path: docs/pios/runs/run_07_source_profiled_ingestion/40.4
artifact_count: 17
admission_status: ADMITTED

- activity_telemetry.md
- delivery_telemetry.md
- dependency_telemetry.md
- domain_telemetry.md
- entity_telemetry.md
- interface_telemetry.md
- structural_telemetry.md
- structure_immutability_log.md
- telemetry_dimension_catalog.md
- telemetry_normalization_spec.md
- telemetry_schema.md
- telemetry_surface_definition.md
- telemetry_surface_map.md
- telemetry_to_peg_mapping.md
- telemetry_traceability_map.md
- telemetry_validation_log.md
- temporal_telemetry_series.md

---

## Execution Boundary

admitted_input_class: RHP
enforcement: STRICT

### Excluded Input Classes

- BEHAVIORAL_ANALYSIS
- PSEE_UI
- PSEE_VALIDATION
- REPLAY_ARTIFACTS

---

## Provenance Chain

chain_length: 6
orchestration_gate: IG.6
determinism_confirmed: true

### Invariants Confirmed

- ADAPTER_INVARIANT
- ADMISSIBLE
- BOOTSTRAP_INVARIANT
- DETERMINISTIC
- INVARIANT
- ORCHESTRATION_INVARIANT
- PAYLOAD_NORMALIZED
- SOURCE_PROFILE_INVARIANT

---

## Intake Summary

| Metric | Value |
|---|---|
| Total artifacts evaluated | 30 |
| Admitted | 30 |
| Excluded | 0 |

# PIOS-40.5-RUN01-CONTRACT-v1

**Stream:** 40.5 — PiOS Signal Computation Engine
**Run ID:** run_01_blueedge
**Contract version:** v1
**Issue date:** 2026-03-19
**Subject:** BlueEdge Fleet Management Platform v3.23.0

---

## Contract Identity

| Field | Value |
|-------|-------|
| contract_id | PIOS-40.5-RUN01-CONTRACT-v1 |
| run_id | run_01_blueedge |
| stream | Stream 40.5 — PiOS Signal Computation Engine |
| upstream_contract | PIOS-40.4-RUN01-CONTRACT-v1 |
| execution_date | 2026-03-19 |
| governing_model | Evidence-First (GC-06) + State–Diagnosis Separation (GC-07) |

---

## Input Boundary

### Mandatory 40.4 Telemetry Inputs (read-only)

| Input Artifact | Path |
|---------------|------|
| telemetry_dimension_catalog.md | docs/pios/40.4/telemetry_dimension_catalog.md |
| temporal_telemetry_series.md | docs/pios/40.4/temporal_telemetry_series.md |
| entity_telemetry.md | docs/pios/40.4/entity_telemetry.md |
| telemetry_surface_map.md | docs/pios/40.4/telemetry_surface_map.md |
| telemetry_to_peg_mapping.md | docs/pios/40.4/telemetry_to_peg_mapping.md |
| telemetry_validation_log.md | docs/pios/40.4/telemetry_validation_log.md |
| structure_immutability_log.md | docs/pios/40.4/structure_immutability_log.md |
| PIOS-40.4-RUN01.execution.md | docs/pios/contracts/40.4/PIOS-40.4-RUN01.execution.md |

---

## Strict Exclusions

| Excluded path | Reason |
|--------------|--------|
| docs/pios/40.3/ | Structural truth — not direct input to signal layer |
| docs/pios/40.2/ | Prior pipeline layer |
| All paths outside docs/pios/40.4/ | Out of scope for signal computation |

---

## Fail Conditions

Any of the following constitutes a hard FAIL:

- Missing mandatory 40.4 input artifacts
- Modification of any 40.4 artifact
- Signal values fabricated without evidence grounding
- Signal computation without VAR_ variable declaration
- Signal without explicit temporal reference
- Signal without entity reference from 40.3 entity_catalog.md (via 40.4 artifacts)
- Prohibited operations performed (condition activation, diagnosis, intelligence synthesis)
- Non-traceable signal values

---

## Mandatory Canonical Output Artifacts

| Artifact | Path |
|----------|------|
| signal_input_matrix.md | docs/pios/40.5/signal_input_matrix.md |
| signal_computation_specification.md | docs/pios/40.5/signal_computation_specification.md |
| signal_output_set.md | docs/pios/40.5/signal_output_set.md |
| signal_traceability_map.md | docs/pios/40.5/signal_traceability_map.md |
| signal_validation_log.md | docs/pios/40.5/signal_validation_log.md |
| signal_boundary_enforcement.md | docs/pios/40.5/signal_boundary_enforcement.md |

---

## Script Artifacts

| Script | Path | Purpose |
|--------|------|---------|
| validate_signal_artifacts.py | scripts/pios/40.5/validate_signal_artifacts.py | Validates all 6 canonical signal artifacts (11 checks) |
| build_signal_artifacts.py | scripts/pios/40.5/build_signal_artifacts.py | Optional: verifies input boundary |

---

## Governed Signal Set

Signal computation is restricted to the following 8 governed signals.

| Signal ID | Name | Entity Ref | Class |
|-----------|------|-----------|-------|
| SIG-001 | Backend Process Heap Usage | CE-001/BM-061 | atomic |
| SIG-002 | Cache Hit Efficiency | CE-001/BM-061+INF-002 | atomic |
| SIG-003 | Cache Connectivity State | CE-001/BM-061+INF-002 | atomic |
| SIG-004 | Domain Event Emission Count | CE-001/BM-063 | atomic |
| SIG-005 | Fleet Active Connection Count | CE-001/BM-062 | atomic |
| SIG-006 | Sensor Bridge Batch Throughput Rate | SA-001 | atomic |
| SIG-007 | Vehicle Alert Severity State | CE-001/BM-005 | atomic |
| SIG-008 | Driver Session Performance | CE-001/BM-057+BM-043 | composite |

---

## Transformation Rules

1. Derive signals only from governed 40.4 telemetry dimensions (DIM- references)
2. Declare every signal input as an explicit VAR_ variable in signal_input_matrix.md
3. Map every VAR_ variable to its DIM- dimension and 40.4 source artifact
4. Compute signals only across the 8 governed signal definitions
5. Require deterministic computation for identical inputs
6. Require explicit temporal reference (TMP-) for every signal
7. Require entity governance reference (BM-/entity from 40.3) for every signal
8. Preserve strict layer separation: telemetry ≠ signal ≠ condition ≠ diagnosis ≠ intelligence
9. Do not introduce interpretation, narrative, condition labels, or diagnosis

---

## Constraints and Prohibitions

| Prohibited | Rule |
|-----------|------|
| Telemetry generation | No telemetry produced in this stream |
| Condition activation | No condition labels produced |
| Diagnosis | No diagnostic output |
| Intelligence synthesis | No intelligence artifacts produced |
| Narrative generation | No narrative text in signal outputs |
| Modification of 40.4 artifacts | 40.4 is read-only throughout 40.5 execution |
| Direct access to 40.3 artifacts | Prohibited |
| Direct access to 40.2 artifacts | Prohibited |
| Inferred or reconstructed input data | Prohibited |
| Signal without temporal reference | Every signal must declare TMP- reference |
| Signal without evidence linkage | Every signal must trace to 40.4 DIM- dimension |
| Heuristic enrichment | All values derived from explicit DIM- fields only |

---

## Completion Criteria

COMPLETE:
- All 6 signal artifacts produced
- All 8 signals fully computed
- Validation: 11/11 PASS

PARTIAL:
- All 6 signal artifacts produced
- At least 1 signal computable; remaining signals pending runtime telemetry
- All pending signals explicitly declared with blocking reason
- Validation: 11/11 PASS

INCOMPLETE:
- Missing output artifacts
- Fabricated signal values
- Prohibited operations performed
- Non-traceable signal values
- Validation failures

---

## Governance Alignment

| Principle | Application |
|-----------|------------|
| GC-06 Evidence-First | All signal inputs carry DIM- evidence reference; no fabrication |
| GC-07 State–Diagnosis Separation | Signals are observational state only — no conditions, no diagnosis |
| PERM | 40.3 structural entity references preserved through 40.4 entity_telemetry.md |
| Validation Immutability Rule | Validator read-only after stream execution declared complete |
| 40.4 Immutability Rule | All 40.4 artifacts read-only throughout 40.5 execution |

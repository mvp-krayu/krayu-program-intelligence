---
title: S1 — Coverage and Reconstruction
node_type: stage
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Computes DIM-01 (coverage: required vs admissible units from IG evidence boundary) and DIM-02 (reconstruction: does admitted evidence assemble into a structurally valid program representation?). Produces `coverage_state.json` and `reconstruction_state.json`.

## Authoritative Paths

- `docs/psee/PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01/s1_runscoped_ig_alignment_spec.md`
- `scripts/pios/runtime/compute_coverage.sh`
- `scripts/pios/runtime/compute_reconstruction.sh`

## Classification

gauge-artifact

## Producing Step

**S1-01:**
- Command: `pios emit coverage --run-dir <run_dir> --ig-dir <ig_dir>`
- Script/file: `scripts/pios/runtime/compute_coverage.sh`

**S1-02:**
- Command: `pios emit reconstruction --run-dir <run_dir> --ig-dir <ig_dir>`
- Script/file: `scripts/pios/runtime/compute_reconstruction.sh`

## Consuming Step

- Command: `pios compute gauge --run-dir <run_dir>` (reads coverage_state.json, reconstruction_state.json)

## Input Artifacts

- `<ig_dir>/admissibility_log.json` (source: `required_units = summary.total`)
- `<ig_dir>/evidence_boundary.json` (source_run consistency check)
- `<ig_dir>/source_manifest.json` (root artifact names)
- `<ig_dir>/normalized_intake_structure/layer_index.json` (layer artifact names)

**Authoritative IG used for recomputed run:**
- `docs/pios/IG.RUNTIME/run_01/` (passed as `--ig-dir`)

## Output Artifacts

- `clients/<tenant>/psee/runs/<run_id>/package/coverage_state.json`
- `clients/<tenant>/psee/runs/<run_id>/package/reconstruction_state.json`
- Updated `clients/<tenant>/psee/runs/<run_id>/package/gauge_inputs.json`

**Authoritative values (`run_authoritative_recomputed_01`):**
- `coverage_state.json`: required_units=30, admissible_units=30, coverage_percent=100.0, state=COMPUTED
- `reconstruction_state.json`: validated_units=30, state=PASS, violations=0

## Linked Specs

- `docs/psee/PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01/s1_runscoped_ig_alignment_spec.md`

## Linked Execution Logs

- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/EXECUTION_LOG.md` → S1-01 PASS, S1-02 PASS

## Determinism / Constraint Notes

`compute_coverage.sh` cross-references: (1) artifact names from `layer_index.json` layers with `admission_status=ADMITTED` → 27 names; (2) root artifact names from `source_manifest.json` → 3 names; (3) each ADMITTED entry in `admissibility_log.json` must have a name in the union set. `required_units = admissibility_log.summary.total`. Forbidden path check does NOT forbid `docs/pios/IG.RUNTIME/`. `evidence_boundary.source_run` must equal `admissibility_log.source_run`.

## Status / Boundary Notes

For `run_authoritative_recomputed_01`: S1 executed successfully using `docs/pios/IG.RUNTIME/run_01/` as `--ig-dir`. The `execution_layer_evaluated` field in `coverage_state.json` is absent → treated as `False` by `pios compute gauge`. This gates completion_points to 0 and sets execution_status=NOT_EVALUATED.

## Artifact Reference

See [[Package Artifacts]] and [[Gauge State]] for downstream consumption.

## Transitions

- ← [[L40.4 — Structural Normalization]]
- → [[S2 — Topology Emission]]

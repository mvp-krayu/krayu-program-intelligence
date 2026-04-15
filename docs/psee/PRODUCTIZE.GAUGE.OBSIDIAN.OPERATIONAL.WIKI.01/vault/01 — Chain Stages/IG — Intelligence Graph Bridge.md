---
title: IG — Intelligence Graph Bridge
node_type: stage
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Transforms the governed intake bundle into the IG-compatible runtime input structure (6 files) required by `compute_coverage.sh` and `compute_reconstruction.sh`. Also registers structural layer outputs into `layer_index.json` after L40.2–L40.4 complete.

## Authoritative Paths

- `docs/psee/PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialization_spec.md`
- `docs/psee/IG.HANDOFF.AUTHORITY.01/ig_handoff_authority.md`
- `docs/psee/PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01/s1_runscoped_ig_alignment_spec.md`
- `docs/pios/IG.RUNTIME/run_01/` (authoritative 30-unit IG basis)

## Classification

runtime-artifact

## Producing Step

**IG-01:**
- Command: `pios ig materialize --tenant <tenant> --intake-id <intake_id> --run-id <run_id>`
- Script/file: `scripts/pios/pios.py`

**IG-02 (post-structural-chain):**
- Command: `pios ig integrate-structural-layers --tenant <tenant> --run-id <run_id>`
- Script/file: `scripts/pios/pios.py`

## Consuming Step

- Command: `pios emit coverage --run-dir <run_dir> --ig-dir <ig_dir>`
- Command: `pios emit reconstruction --run-dir <run_dir> --ig-dir <ig_dir>`

## Input Artifacts

**IG-01:**
- `clients/<tenant>/psee/intake/<intake_id>/` (full intake bundle)

**IG-02:**
- `clients/<tenant>/psee/runs/<run_id>/40_2/`
- `clients/<tenant>/psee/runs/<run_id>/40_3/`
- `clients/<tenant>/psee/runs/<run_id>/40_4/`

## Output Artifacts

**IG-01 — run-scoped:**
- `clients/<tenant>/psee/runs/<run_id>/ig/evidence_boundary.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/admissibility_log.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/source_manifest.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/layer_index.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/provenance_chain.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/source_profile.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/run_identity.json`

**Authoritative 30-unit IG basis (legacy, used directly as `--ig-dir`):**
- `docs/pios/IG.RUNTIME/run_01/` (same 6 files, no run_identity.json)

**IG-02:**
- Updated `clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/layer_index.json`

## Linked Specs

- `docs/psee/PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialization_spec.md`
- `docs/psee/IG.HANDOFF.AUTHORITY.01/ig_handoff_authority.md`
- `docs/psee/PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01/s1_runscoped_ig_alignment_spec.md`

## Linked Execution Logs

- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/EXECUTION_LOG.md` → ig materialize BLOCKED; IG.RUNTIME/run_01 used as --ig-dir

## Determinism / Constraint Notes

`admissibility_log.json.summary.total` is the source for `required_units` in `compute_coverage.sh`. `evidence_boundary.source_run` must equal `admissibility_log.source_run` for the script's consistency check to pass. For `docs/pios/IG.RUNTIME/run_01/`: both reference `run_07_source_profiled_ingestion` — check passes.

## Status / Boundary Notes

For the 30-unit authoritative basis: IG-01 (`pios ig materialize`) is **BLOCKED** — intake bundle absent. `docs/pios/IG.RUNTIME/run_01/` passed directly as `--ig-dir` to S1 commands. IG-02 (`pios ig integrate-structural-layers`) is **BLOCKED** — no run-scoped ig/ and structural chain was not executed for this lineage.

## Artifact Reference

See [[IG Artifacts]] for full file-level classification of `docs/pios/IG.RUNTIME/run_01/`.

## Transitions

- ← [[S0 — Intake and Bootstrap]]
- → [[L40.2 — Structural Extraction]]

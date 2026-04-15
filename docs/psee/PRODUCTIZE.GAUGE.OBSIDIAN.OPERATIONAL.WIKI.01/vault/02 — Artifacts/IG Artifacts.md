---
title: IG Artifacts
node_type: artifact
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Classification of the Intelligence Graph handoff package. Either run-scoped (`runs/<run_id>/ig/`) or the authoritative legacy basis (`docs/pios/IG.RUNTIME/run_01/`). Input to `pios emit coverage` and `pios emit reconstruction` via `--ig-dir`.

## Authoritative Paths

- `docs/pios/IG.RUNTIME/run_01/` (authoritative 30-unit IG basis — PRESENT)
- `clients/<tenant>/psee/runs/<run_id>/ig/` (run-scoped schema — produced by `pios ig materialize`)
- `docs/psee/PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialization_spec.md`
- `docs/psee/IG.HANDOFF.AUTHORITY.01/ig_handoff_authority.md`

## Classification

runtime-artifact

## Producing Step

- Command: `pios ig materialize --tenant <tenant> --intake-id <intake_id> --run-id <run_id>`

## Consuming Step

- Command: `pios emit coverage --run-dir <run_dir> --ig-dir <ig_dir>`
- Command: `pios emit reconstruction --run-dir <run_dir> --ig-dir <ig_dir>`

## Files

| file | path | description |
|------|------|-------------|
| `evidence_boundary.json` | `<ig_dir>/evidence_boundary.json` | enforcement=STRICT, source_run reference |
| `admissibility_log.json` | `<ig_dir>/admissibility_log.json` | Per-artifact ADMITTED/EXCLUDED decisions; `summary.total` = required_units |
| `source_manifest.json` | `<ig_dir>/source_manifest.json` | root_artifacts list (3 root files for authoritative basis) |
| `layer_index.json` | `<ig_dir>/normalized_intake_structure/layer_index.json` | Layer-to-artifact count map: L40_2:4, L40_3:6, L40_4:17 |
| `provenance_chain.json` | `<ig_dir>/normalized_intake_structure/provenance_chain.json` | Ingestion provenance chain |
| `source_profile.json` | `<ig_dir>/normalized_intake_structure/source_profile.json` | Source profile metadata |

## Authoritative IG Basis (30-unit)

Path: `docs/pios/IG.RUNTIME/run_01/`

| field | value |
|-------|-------|
| admissibility_log.summary.total | 30 |
| admissibility_log.summary.admitted | 30 |
| Layer breakdown | ROOT:3, L40_2:4, L40_3:6, L40_4:17 = 30 |
| evidence_boundary.enforcement | STRICT |
| evidence_boundary.source_run | run_07_source_profiled_ingestion [NOT PRESENT — lineage constraint] |

## Determinism / Constraint Notes

`compute_coverage.sh` requires: `evidence_boundary.source_run == admissibility_log.source_run`. For `docs/pios/IG.RUNTIME/run_01/`: both reference `run_07_source_profiled_ingestion` — consistency check passes. Forbidden path check in the script does NOT forbid `docs/pios/IG.RUNTIME/`.

## Status / Boundary Notes

The original source (`run_07_source_profiled_ingestion/`) that produced `docs/pios/IG.RUNTIME/run_01/` does not exist. The IG.RUNTIME/run_01 artifacts are the authoritative surviving basis and are not recoverable from upstream.

## Produced By

[[IG — Intelligence Graph Bridge]]

## Consumed By

[[S1 — Coverage and Reconstruction]]

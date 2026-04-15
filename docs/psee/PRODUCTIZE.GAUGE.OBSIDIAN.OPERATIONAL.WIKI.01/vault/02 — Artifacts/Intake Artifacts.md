---
title: Intake Artifacts
node_type: artifact
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Classification of the governed hash bundle produced by `pios intake create`. Bound to a specific `intake_id`. Input to `pios ig materialize`.

## Authoritative Paths

- `clients/<tenant>/psee/intake/<intake_id>/` (schema description)
- `docs/psee/PRODUCTIZE.RAW.SOURCE.INTAKE.01/intake_specification.md`

## Classification

intake-artifact

## Producing Step

- Command: `pios intake create --tenant <tenant> --intake-id <intake_id> --source-path <path>`

## Consuming Step

- Command: `pios ig materialize --tenant <tenant> --intake-id <intake_id> --run-id <run_id>`

## Files

| file | description |
|------|-------------|
| `intake_record.json` | Full intake declaration — intake_id, source_type, source_version, timestamp, hash |
| `source_manifest.json` | Manifest of source files included in bundle |
| `file_hash_manifest.json` | Per-file hash map for integrity verification |
| `git_metadata.json` | Git commit/branch metadata (present only for GIT_DIRECTORY source type) |

## Path Convention

```
clients/<tenant>/psee/intake/<intake_id>/intake_record.json
clients/<tenant>/psee/intake/<intake_id>/source_manifest.json
clients/<tenant>/psee/intake/<intake_id>/file_hash_manifest.json
```

## Determinism / Constraint Notes

Intake artifacts are immutable once produced. Re-running `pios intake create` with the same `intake_id` fails closed. Source type must be `LOCAL_DIRECTORY` or `GIT_DIRECTORY`.

## Status / Boundary Notes

For the 30-unit authoritative basis: the original intake (`clients/blueedge/psee/intake/` for `run_07_source_profiled_ingestion`) is no longer recoverable. The surviving IG artifact is at `docs/pios/IG.RUNTIME/run_01/`. See [[IG Artifacts]].

## Produced By

[[S0 — Intake and Bootstrap]]

## Consumed By

[[IG — Intelligence Graph Bridge]]

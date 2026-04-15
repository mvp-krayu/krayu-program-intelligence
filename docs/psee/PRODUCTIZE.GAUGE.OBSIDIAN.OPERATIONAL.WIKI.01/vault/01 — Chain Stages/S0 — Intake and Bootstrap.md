---
title: S0 — Intake and Bootstrap
node_type: stage
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Declares a governed source bundle (PRE-S0) and initializes run identity with AC-schema ledger artifact and execution engine state (S0). These two sub-steps must complete before any IG or chain commands can run.

## Authoritative Paths

- `docs/psee/PRODUCTIZE.RAW.SOURCE.INTAKE.01/intake_specification.md`
- `docs/psee/FRESH.RUN.BOOTSTRAP.PROTOCOL.01/fresh_run_bootstrap_protocol.md`
- `docs/psee/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01/runtime_surface_specification.md`

## Classification

canonical-doc

## Producing Step

**PRE-S0:**
- Command: `pios intake create --tenant <tenant> --intake-id <intake_id> --source-path <path>`
- Script/file: `scripts/pios/pios.py`

**S0-01:**
- Command: `pios ledger create --run-id <run_id> --client <tenant> --source-version <version>`
- Script/file: `scripts/pios/pios.py`

**S0-02:**
- Command: `pios bootstrap --run-dir <run_dir>`
- Script/file: `scripts/pios/pios.py`

## Consuming Step

- Command: `pios ig materialize` (consumes intake bundle)
- Command: All S1–S4 commands (consume engine_state.json, gauge_inputs.json via `--run-dir`)

## Input Artifacts

- Local directory or git repository at `<source-path>` (PRE-S0)
- `clients/<tenant>/psee/intake/<intake_id>/` bundle (S0 — reads source version)

## Output Artifacts

**PRE-S0:**
- `clients/<tenant>/psee/intake/<intake_id>/intake_record.json`
- `clients/<tenant>/psee/intake/<intake_id>/source_manifest.json`
- `clients/<tenant>/psee/intake/<intake_id>/file_hash_manifest.json`

**S0-01:**
- `clients/<tenant>/psee/runs/<run_id>/intake_record.json`

**S0-02:**
- `clients/<tenant>/psee/runs/<run_id>/package/engine_state.json`
- `clients/<tenant>/psee/runs/<run_id>/package/gauge_inputs.json`

## Linked Specs

- `docs/psee/PRODUCTIZE.RAW.SOURCE.INTAKE.01/intake_specification.md`
- `docs/psee/FRESH.RUN.BOOTSTRAP.PROTOCOL.01/fresh_run_bootstrap_protocol.md`

## Linked Execution Logs

- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/EXECUTION_LOG.md` → S0-01, S0-02 PASS; intake create BLOCKED

## Determinism / Constraint Notes

PRE-S0 intake type must be declared as `LOCAL_DIRECTORY` or `GIT_DIRECTORY`. Fails closed if source path invalid or output dir already exists. S0-02 bootstrap fails closed if run_dir does not contain intake_record.json.

## Status / Boundary Notes

For the 30-unit authoritative basis (`run_authoritative_recomputed_01`): PRE-S0 (`pios intake create`) is **BLOCKED** — `docs/pios/runs/run_07_source_profiled_ingestion/` [NOT PRESENT — lineage constraint]. S0-01 and S0-02 executed successfully.

## Transitions

- ← [[Directory Map]]
- → [[IG — Intelligence Graph Bridge]]

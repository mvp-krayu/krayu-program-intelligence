---
title: S3 — Signal Emission
node_type: stage
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Emits the governed signal registry from the evidence_confidence evidence model. Output is `signal_registry.json` in the run package and is also maintained as a canonical shared artifact.

## Authoritative Paths

- `docs/psee/PSEE.FRESH.S2.S3.EMISSION.01/psee_fresh_s2_s3_emission_report.md`
- `scripts/pios/41.4/build_signals.py`
- `docs/pios/41.4/signal_registry.json`

## Classification

gauge-artifact

## Producing Step

- Command: `pios emit signals --run-dir <run_dir>`
- Script/file: `scripts/pios/41.4/build_signals.py`

## Consuming Step

- Route: `app/gauge-product/pages/api/signals.js` (hardcoded — reads `docs/pios/41.4/signal_registry.json`)

## Input Artifacts

- Signal model: `scripts/pios/41.4/build_signals.py` (with CC-2 correction applied)
- Run context from `<run_dir>/package/gauge_inputs.json`

## Output Artifacts

- `clients/<tenant>/psee/runs/<run_id>/package/signal_registry.json`
- `clients/<tenant>/psee/runs/<run_id>/package/evidence_mapping_index.json`
- `clients/<tenant>/psee/runs/<run_id>/package/executive_signal_report.md`

**Authoritative canonical (shared):**
- `docs/pios/41.4/signal_registry.json`

**Authoritative values:**
- total=5, run_reference=run_01_blueedge

## Linked Specs

- `docs/psee/PSEE.FRESH.S2.S3.EMISSION.01/psee_fresh_s2_s3_emission_report.md`

## Linked Execution Logs

- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/EXECUTION_LOG.md` → S3-01 PASS, 5 signals

## Determinism / Constraint Notes

The `/api/signals` route is hardcoded to `docs/pios/41.4/signal_registry.json`. It is NOT overridable by `GAUGE_PACKAGE_DIR`. Both localhost:3001 and localhost:3002 serve identical signals from the same source. See [[App Routes]].

## Transitions

- ← [[S2 — Topology Emission]]
- → [[S4 — Gauge Computation and Freshness]]

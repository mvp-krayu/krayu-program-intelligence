---
title: S4 — Gauge Computation and Freshness
node_type: stage
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Computes the governed `gauge_state.json` from S1–S3 package artifacts; declares run coherence; validates freshness through all gates (AC, CA, GC, SC). Terminal chain stage — output is consumed directly by the GAUGE product surface.

## Authoritative Paths

- `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/gauge_state_computation_contract.md`
- `docs/psee/S3.S4.RUN.COHERENCE.CONTRACT.01/s3_s4_run_coherence_contract.md`
- `docs/psee/PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01/gauge_scoring_semantic_alignment_spec.md`

## Classification

gauge-artifact

## Producing Step

**S4-01:**
- Command: `pios compute gauge --run-dir <run_dir>`
- Script/file: `scripts/pios/pios.py`

**S4-02:**
- Command: `pios declare coherence --run-dir <run_dir>`
- Script/file: `scripts/pios/pios.py`

**S4-03:**
- Command: `pios validate freshness --run-dir <run_dir>`
- Script/file: `scripts/pios/pios.py`

## Consuming Step

- Route: `app/gauge-product/pages/api/gauge.js` (reads `gauge_state.json` via `GAUGE_PACKAGE_DIR`)

## Input Artifacts

- `clients/<tenant>/psee/runs/<run_id>/package/coverage_state.json`
- `clients/<tenant>/psee/runs/<run_id>/package/reconstruction_state.json`
- `clients/<tenant>/psee/runs/<run_id>/package/canonical_topology.json`
- `clients/<tenant>/psee/runs/<run_id>/package/signal_registry.json`
- `clients/<tenant>/psee/runs/<run_id>/package/engine_state.json`
- `clients/<tenant>/psee/runs/<run_id>/package/gauge_inputs.json`

## Output Artifacts

**S4-01:**
- `clients/<tenant>/psee/runs/<run_id>/package/gauge_state.json`

**S4-02:**
- `clients/<tenant>/psee/runs/<run_id>/coherence_record.json`

**S4-03:**
- Verdict to stdout (no file artifact)

**Authoritative values (`run_authoritative_recomputed_01`):**
- `gauge_state.json`: canonical_score=60, projected_score=100, band_label=CONDITIONAL, execution_status=NOT_EVALUATED, execution_layer_evaluated=False, confidence.lower=60, confidence.upper=100, confidence.status=SPLIT_EXECUTION_NOT_EVALUATED
- S4-02: MODE_B COHERENT
- S4-03: GOVERNED AND FRESH THROUGH S4

## Linked Specs

- `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/gauge_state_computation_contract.md`
- `docs/psee/S3.S4.RUN.COHERENCE.CONTRACT.01/s3_s4_run_coherence_contract.md`
- `docs/psee/PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01/gauge_scoring_semantic_alignment_spec.md`

## Linked Execution Logs

- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/EXECUTION_LOG.md` → S4-01/S4-02/S4-03 all PASS

## Determinism / Constraint Notes

Score model (Stream 10 / PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01): `canonical_score = completion_points + coverage_points + reconstruction_points`. Gate: `execution_layer_evaluated` from `coverage_state.json` (absent = False). When False: `completion_points=0`, `execution_status=NOT_EVALUATED`, `projected_score = canonical + 40 = 100`, confidence band = [60, 100] SPLIT_EXECUTION_NOT_EVALUATED. GC-03 valid statuses include NOT_EVALUATED.

## Status / Boundary Notes

GAUGE chain terminates at S4. Execution layer (completion_points=40) requires `execution_layer_evaluated=True` in `coverage_state.json`. Until PSEE execution engine is run and evidence produced, canonical_score=60 is structural proof only.

## Artifact Reference

See [[Gauge State]] for full `gauge_state.json` field documentation. See [[App Routes]] for how this artifact binds to the product surface.

## Transitions

- ← [[S3 — Signal Emission]]
- → [[App Routes]] (product surface)

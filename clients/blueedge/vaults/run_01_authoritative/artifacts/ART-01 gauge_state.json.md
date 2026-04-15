---
node_class: artifact
artifact_id: ART-01
artifact_name: gauge_state.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Terminal output of the S0→S4 execution chain. The single artifact consumed by the GAUGE product surface (/api/gauge). Contains all dimensions, scores, execution state, confidence, and projection.

## Producing Step
`pios compute gauge` (S4) → `pios declare coherence` → `pios validate freshness`

## Consuming Steps
`/api/gauge` reads via GAUGE_PACKAGE_DIR environment variable → serves index.js, overview.js

## Structure Summary
Two schema variants coexist:
- **Legacy (run_01_authoritative):** execution_status=PHASE_1_ACTIVE, no score.projected, confidence.status=COMPUTED
- **Stream 10 (run_authoritative_recomputed_01):** execution_status=NOT_EVALUATED, score.projected=100, confidence.status=SPLIT_EXECUTION_NOT_EVALUATED, state.execution_layer_evaluated=false, state.execution_mode=STRUCTURAL_ONLY

Key fields: run_id, stream, state (execution_status, execution_layer_evaluated, execution_mode), dimensions (DIM-01..06), score (canonical, projected, components, band_label), projection (value, rule, caveat), confidence (lower, upper, status)

## Claims Grounded
[[CLM-01]] [[CLM-02]] [[CLM-03]] [[CLM-04]] [[CLM-05]] [[CLM-06]] [[CLM-07]] [[CLM-08]] [[CLM-09]] [[CLM-10]] [[CLM-11]] [[CLM-12]] [[CLM-13]] [[CLM-25 Executive Three-Axis Verdict]]

## Authoritative Path
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json`

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
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]] [[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]] [[CLM-05 Escalation Clearance]] [[CLM-06 Runtime Unknown-Space Count]] [[CLM-07 Source Data Intake Complete]] [[CLM-08 Structural Patterns Conform]] [[CLM-09 Proven Structural Score]] [[CLM-10 Achievable Score Projected]] [[CLM-11 Score Band Classification]] [[CLM-12 Score Confidence Range]] [[CLM-13 Execution Layer Status]] [[CLM-25 Executive Three-Axis Verdict]]

## Authoritative Path
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json`

## Product Role

This is the artifact that powers the GAUGE product surface. The execution chain computes — this file is the terminal product of that computation. GAUGE renders by reading this single file through the GAUGE_PACKAGE_DIR binding: every dimension panel, score display, confidence band, and executive verdict in the product traces to a field in gauge_state.json. It is the handoff point between the execution chain and the rendering surface. When this file is updated — as happens when running the recomputed schema — GAUGE immediately reflects the new state without any recomputation of its own.

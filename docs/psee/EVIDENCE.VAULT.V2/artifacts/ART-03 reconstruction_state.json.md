---
node_class: artifact
artifact_id: ART-03
artifact_name: reconstruction_state.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Records the result of `pios emit reconstruction` (S1). Establishes overall reconstruction result and four-axis detail. Feeds gauge_state.json DIM-02 and score.components.reconstruction_points.

## Producing Step
`pios emit reconstruction` (S1)

## Consuming Steps
`/api/gauge` reads and passes to DIM-02 and axis_results

## Structure Summary
Key fields: overall_result (PASS), axis_results (4 axes × PASS/FAIL), validated_units (30), total_units (30), violations (0)
Four axes: COMPLETENESS, STRUCTURAL_LINK, REFERENTIAL_INTEGRITY, LAYER_CONSISTENCY — all PASS in run_authoritative_recomputed_01.

## Claims Grounded
[[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]] [[CLM-09 Proven Structural Score]]

## Authoritative Path
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/reconstruction_state.json`

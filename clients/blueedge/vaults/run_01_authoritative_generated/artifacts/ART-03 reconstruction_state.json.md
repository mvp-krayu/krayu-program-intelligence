---
node_class: artifact
artifact_id: ART-03
artifact_name: reconstruction_state.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Reconstruction result. Primary source for DIM-02. Produced by the S1 pios reconstruction stage.

## Producing Step
`pios reconstruction` (S1) via IG.RUNTIME structural reconstruction validation

## Key Fields
- `state`: PASS
- `validated_units`: 30
- `axis_results`: COMPLETENESS=PASS, STRUCTURAL_LINK=PASS, REFERENTIAL_INTEGRITY=PASS, LAYER_CONSISTENCY=PASS

## Claims Grounded
[[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]]

## Authoritative Path
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/reconstruction_state.json`

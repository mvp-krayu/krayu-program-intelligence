---
node_class: transformation
transformation_id: TRN-02
transformation_name: Reconstruction Computation
stage: S1
command: pios emit reconstruction
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Tests whether the 30 admitted structural units assemble into a coherent program representation across four axes. Produces reconstruction_state.json.

## Inputs
- Admitted structural units from IG (via L40.2/L40.3/L40.4 layers)
- admissibility_log.json — unit inventory

## Outputs
- [[ART-03 reconstruction_state.json]] — overall_result=PASS, 4 axis results

## Rules (Four Axes)
- COMPLETENESS: all required elements present
- STRUCTURAL_LINK: relationship edges internally consistent
- REFERENTIAL_INTEGRITY: all cross-references resolve
- LAYER_CONSISTENCY: L40.2/L40.3/L40.4 artifacts mutually compatible
Reconstruction award: PASS→25 points, otherwise→0

## Claims Produced
[[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]]

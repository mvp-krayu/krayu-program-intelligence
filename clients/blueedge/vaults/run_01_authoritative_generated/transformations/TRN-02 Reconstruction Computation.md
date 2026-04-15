---
node_class: transformation
transformation_id: TRN-02
transformation_name: Reconstruction Computation
stage: S1
command: pios reconstruction
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Validates structural coherence of admitted units across four axes.

## Inputs
- [[ART-07 admissibility_log.json]] — admitted unit set
- normalized_intake_structure/ — layer_index, provenance_chain, source_profile

## Outputs
- [[ART-03 reconstruction_state.json]] — state=PASS, axis_results

## Rules
- Four axes: COMPLETENESS, STRUCTURAL_LINK, REFERENTIAL_INTEGRITY, LAYER_CONSISTENCY
- All must PASS for overall PASS
- Result: COMPLETENESS=PASS | STRUCTURAL_LINK=PASS | REFERENTIAL_INTEGRITY=PASS | LAYER_CONSISTENCY=PASS
- reconstruction_points: PASS → 25

## Claims Produced
[[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]]

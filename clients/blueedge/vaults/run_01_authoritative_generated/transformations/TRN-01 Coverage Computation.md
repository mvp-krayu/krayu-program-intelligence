---
node_class: transformation
transformation_id: TRN-01
transformation_name: Coverage Computation
stage: S1
command: pios coverage
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Computes coverage_percent from admitted units vs required units.

## Inputs
- [[ART-07 admissibility_log.json]] — admitted unit count
- evidence_boundary.json — required unit declaration

## Outputs
- [[ART-02 coverage_state.json]] — coverage_percent=100.0, state=COMPUTED

## Rules
- coverage_percent = admissible_units / required_units * 100 = 30 / 30 * 100 = 100.0
- coverage_points = round(coverage_percent × 0.35) = 35

## Claims Produced
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]]

---
node_class: transformation
transformation_id: TRN-01
transformation_name: Coverage Computation
stage: S1
command: pios emit coverage
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Computes structural coverage percentage from admitted structural units. Produces coverage_state.json.

## Inputs
- [[ART-07 admissibility_log.json]] — admitted unit count (30) and required unit count (30)
- IG.RUNTIME/run_01 — authoritative IG basis

## Outputs
- [[ART-02 coverage_state.json]] — coverage_percent=100.0, admissible_units=30, required_units=30

## Rules
coverage_percent = (admissible_units / required_units) × 100.0
coverage_points = round(coverage_percent × coverage_weight) where coverage_weight=0.35
At 100%: coverage_points = round(100.0 × 0.35) = 35

## Claims Produced
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]]

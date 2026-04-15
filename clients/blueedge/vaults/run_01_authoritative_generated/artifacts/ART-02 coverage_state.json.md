---
node_class: artifact
artifact_id: ART-02
artifact_name: coverage_state.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Coverage computation result. Primary source for DIM-01. Produced by the S1 pios coverage stage.

## Producing Step
`pios coverage` (S1) via IG.RUNTIME admissibility computation

## Key Fields
- `coverage_percent`: 100.0
- `state`: COMPUTED
- `required_units`: 30
- `admissible_units`: 30

## Claims Grounded
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]]

## Authoritative Path
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/coverage_state.json`

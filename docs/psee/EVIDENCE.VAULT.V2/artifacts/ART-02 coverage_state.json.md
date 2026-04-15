---
node_class: artifact
artifact_id: ART-02
artifact_name: coverage_state.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Records the result of `pios emit coverage` (S1). Establishes coverage_percent and admissible unit counts. Feeds gauge_state.json DIM-01 and score.components.coverage_points.

## Producing Step
`pios emit coverage` (S1)

## Consuming Steps
`/api/gauge` reads alongside gauge_state.json; feeds coverage_points computation

## Structure Summary
Key fields: state (COMPUTED), coverage_percent (100.0), admissible_units (30), required_units (30), total_count, intake_complete

## Claims Grounded
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]] [[CLM-07 Source Data Intake Complete]] [[CLM-09 Proven Structural Score]]

## Explanation
Produced after the IG pipeline admits 30 structural units. The coverage_percent=100.0 is the primary input to score.components.coverage_points (35 points = round(100.0 × 0.35)).

## Authoritative Path
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/coverage_state.json`

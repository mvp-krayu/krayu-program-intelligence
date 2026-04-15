---
node_class: artifact
artifact_id: ART-07
artifact_name: admissibility_log.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Records the IG pipeline admissibility decision for each structural unit. The forensic evidence that each of the 30 declared structural units was classified, scored, and admitted into the evidence boundary.

## Producing Step
`pios ig integrate-structural-layers` → admissibility_log.json

## Consuming Steps
`pios emit coverage` reads to establish coverage_percent and admissible_units count

## Structure Summary
Per-unit records with: unit_id, source_path, classification, admissibility_score, status (admitted/excluded). Summary: total=30, admitted=30, excluded=0.

## Claims Grounded
[[CLM-01 Structural Coverage Completeness]] — 30/30 admitted → coverage=100%
[[CLM-02 Structural Unit Count]] — count=30

## Authoritative Path
`docs/pios/IG.RUNTIME/run_01/`

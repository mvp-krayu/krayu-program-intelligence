---
node_class: entity
entity_id: ENT-dimensions
entity_label: Dimensions
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Entity: Dimensions

## Definition

Six dimensions provide the structured evidence breakdown behind the canonical score and executive verdict.

## Dimension Summary

| id | label | value | source |
|----|-------|-------|--------|
| DIM-01 | Coverage | 100.0% (30/30) | coverage_state.json |
| DIM-02 | Reconstruction | PASS (4-axis) | reconstruction_state.json |
| DIM-03 | Escalation Clearance | CLEAR | S-13 invariant |
| DIM-04 | Unknown-Space | 0 (min observable) | DIM-04 projection |
| DIM-05 | Intake Completeness | COMPLETE | S-13 invariant |
| DIM-06 | Heuristic Compliance | PASS | S-13 invariant |

## Exposure Policy

| zone | what is exposed |
|------|----------------|
| ZONE-1 | All 6 dimensions with values |
| ZONE-2 | DIM-01/02/03 (summary); DIM-04/05/06 contextual |
| ZONE-3 | Full dimension detail |

**DIM-04 caveat:** total_count=0 is minimum observable state, not proven zero. Must accompany ZONE-2 surface.
**DIM-05/06:** Invariants — derived from S-13 terminal state, not directly measured.

## Source Artifact

[[ART-01 gauge_state.json]]

## Related Claims

[[CLM-01 Structural Coverage Completeness]] [[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-05 Escalation Clearance]] [[CLM-06 Runtime Unknown-Space Count]] [[CLM-07 Source Data Intake Complete]] [[CLM-08 Structural Patterns Conform]]

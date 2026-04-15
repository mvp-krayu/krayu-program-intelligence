---
node_class: entity
entity_id: ENT-dimensions
entity_family: Dimensions (DIM-01..DIM-06)
count: 6
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Definition
Six assessment dimensions in gauge_state.json that represent distinct aspects of the platform's structural state. Rendered in the RuntimeIntelligence panel.

## Dimensions
| dimension | label | authoritative_value | ZONE-2 |
|-----------|-------|---------------------|--------|
| DIM-01 | Coverage | coverage_percent=100.0, admissible=30, required=30 | YES — summary |
| DIM-02 | Reconstruction | state=PASS, validated=30, total=30 | YES — summary |
| DIM-03 | Escalation Clearance | value=100, state_label=CLEAR | YES — summary |
| DIM-04 | Unknown Space | total_count=0 (caveat: minimum observable state) | CONDITIONAL — caveat required |
| DIM-05 | Intake State | state=COMPLETE | YES |
| DIM-06 | Heuristic Compliance | state=PASS | CONDITIONAL (CTO audience) |

## Role in Claims
- DIM-01 → [[CLM-01 Structural Coverage Completeness]], [[CLM-02 Structural Unit Count]]
- DIM-02 → [[CLM-03 Structural Reconstruction Pass-Fail]], [[CLM-04 Four-Axis Reconstruction Detail]]
- DIM-03 → [[CLM-05 Escalation Clearance]]
- DIM-04 → [[CLM-06 Runtime Unknown-Space Count]]
- DIM-05 → [[CLM-07 Source Data Intake Complete]]
- DIM-06 → [[CLM-08 Structural Patterns Conform]]

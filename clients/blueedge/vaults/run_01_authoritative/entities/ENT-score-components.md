---
node_class: entity
entity_id: ENT-score-components
entity_family: Score Components
count: 3
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Definition
Three additive components that sum to produce the canonical score. Computed by `pios compute gauge` (S4) from structural emission artifacts.

## Components
| component | value | weight | gate |
|-----------|-------|--------|------|
| completion_points | 0 | COMPLETION_WEIGHT=40 | execution_layer_evaluated=False → 0 |
| coverage_points | 35 | coverage_weight=0.35 | round(100.0 × 0.35) = 35 |
| reconstruction_points | 25 | categorical PASS | PASS→25, otherwise→0 |
| **canonical total** | **60** | | |
| **projected total** | **100** | | canonical + COMPLETION_WEIGHT |

## Role in Claims
- [[CLM-09 Proven Structural Score]] — sum=60
- [[CLM-10 Achievable Score Projected]] — canonical+40=100
- [[CLM-13 Execution Layer Status]] — drives completion_points gate

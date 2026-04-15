---
node_class: entity
entity_id: ENT-score-components
entity_label: Score Components
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Entity: Score Components

## Definition

The canonical score is composed of three additive components. Each component is gated on specific evidence conditions.

## Components

| component | value | condition | weight |
|-----------|-------|-----------|--------|
| completion_points | 0 | execution_layer_evaluated=True required | up to 40 |
| coverage_points | 35 | round(coverage_percent × 0.35) | max 35 |
| reconstruction_points | 25 | PASS → 25, otherwise 0 | max 25 |

**Derivation:** 0 + 35 + 25 = 60 = 60

**Projected:** 60 + 40 (completion weight) = 100

## Exposure Policy

| zone | what is exposed |
|------|----------------|
| ZONE-1 | Full: completion/coverage/reconstruction points with derivation |
| ZONE-2 | Narrative: "structural evidence contributes 60 points; execution layer can add up to 40" |
| ZONE-3 | Full component breakdown |

## Source Artifact

[[ART-01 gauge_state.json]]

## Related Claims

[[CLM-09 Proven Structural Score]] [[CLM-10 Achievable Score Projected]] [[CLM-11 Score Band Classification]] [[CLM-12 Score Confidence Range]]

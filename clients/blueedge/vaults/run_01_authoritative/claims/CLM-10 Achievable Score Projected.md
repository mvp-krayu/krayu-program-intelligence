---
node_class: claim
claim_id: CLM-10
claim_label: Achievable Score Projected
claim_type: metric
exposure: ZONE-2
lens_admissible: CONDITIONAL
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
When execution_layer_evaluated=False, the projected score is the sum of the current canonical score plus the full COMPLETION_WEIGHT (40 points). This represents the maximum achievable score if the execution layer is subsequently evaluated and completes successfully. It is a projection, not a proven value. Must accompany [[CLM-09 Proven Structural Score]] (canonical=60). Score range [60, 100] is the confidence band.

## Authoritative Value
100

## Source Fields
- `gauge_state.json` → `projection.value`
- `gauge_state.json` → `score.projected`

## Upstream Artifacts
- [[ART-01 gauge_state.json]]
- [[CLM-09 Proven Structural Score]]

## Transformation Chain
canonical(60) + COMPLETION_WEIGHT(40) = 100

## Entity Links
- Stage of origin: S4

## Exposure
- ZONE: ZONE-2
- LENS admissible: CONDITIONAL
- Reason: Admissible with mandatory execution caveat — "maximum score achievable if execution is run"

## Traceability
- Status: FULL
- Caveats: None


## Why It Matters

The projected score of 100 tells a buyer that the platform's structural evidence is complete enough that a perfect score is achievable — not hypothetically but by completing a defined and bounded additional step: running the execution assessment. This is a credible ceiling, not a marketing claim; it is derived arithmetically from the proven 60 plus the execution weight (40). Together, CLM-09 and CLM-10 define the assessment range: the worst case is proven at 60, the best case is achievable at 100.

## Surfaces
- StatusBand "Achievable: 100"
- ScoreGauge achievable chip
- `projection.value`

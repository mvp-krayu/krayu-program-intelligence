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
When execution_layer_evaluated=False, the projected score is the sum of the current canonical score plus the full COMPLETION_WEIGHT (40 points). This represents the maximum achievable score if the execution layer is subsequently evaluated and completes successfully. It is a projection, not a proven value. Must accompany [[CLM-09 Canonical Score Proven]] (canonical=60). Score range [60, 100] is the confidence band.

## Authoritative Value
100

## Source Fields
- `gauge_state.json` → `projection.value`
- `gauge_state.json` → `score.projected`

## Upstream Artifacts
- [[gauge_state.json]]
- [[CLM-09 Canonical Score Proven]]

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

## Surfaces
- StatusBand "Achievable: 100"
- ScoreGauge achievable chip
- `projection.value`

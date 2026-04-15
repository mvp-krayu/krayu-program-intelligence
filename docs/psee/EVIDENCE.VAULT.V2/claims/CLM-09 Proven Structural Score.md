---
node_class: claim
claim_id: CLM-09
claim_label: Proven Structural Score
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The canonical score is the proven floor. coverage_points=35 is derived as round(100.0 × 0.35). reconstruction_points=25 is a categorical award for a PASS verdict. completion_points=0 because the execution layer has not been evaluated (execution_layer_evaluated=False). The execution layer can award up to 40 additional points when run. This is not a partial or preliminary score — it is the maximum provable from structural evidence alone. Computed in S4 by the pios compute gauge stage.

## Authoritative Value

60

## Source Fields

- `gauge_state.json` → `score.canonical`

## Upstream Artifacts

- [[gauge_state.json]]

## Transformation Chain

- [[pios compute gauge (S4)]]

## Entity Links

N/A

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Primary commercial number

## Traceability

- Status: FULL
- Caveats: None — derivation: completion_points(0) + coverage_points(35) + reconstruction_points(25) = 60

## Surfaces

- StatusBand ("Proven Score: 60")
- ScoreGauge proven chip
- CONCEPT-12 resolution

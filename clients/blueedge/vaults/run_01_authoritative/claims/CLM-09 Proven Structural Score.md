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

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge (S4)

## Entity Links

N/A

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Primary commercial number

## Traceability

- Status: FULL
- Caveats: None — derivation: completion_points(0) + coverage_points(35) + reconstruction_points(25) = 60


## Why It Matters

A score of 60 is not a low score — it is the maximum provable from structural analysis alone. It means the entire structural evidence base is present, coherent, and verified. The 40-point gap is not a deficit; it is the execution assessment, which requires running the platform to measure. For a buyer or operator, 60 is the floor: a commitment backed by evidence that cannot be removed. It is not an estimate or a projection; it is a deterministic sum of verified structural facts.

## Surfaces

- StatusBand ("Proven Score: 60")
- ScoreGauge proven chip
- CONCEPT-12 resolution

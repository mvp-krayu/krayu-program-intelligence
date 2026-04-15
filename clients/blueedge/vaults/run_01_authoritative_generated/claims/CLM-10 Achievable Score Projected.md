---
node_class: claim
claim_id: CLM-10
claim_label: Achievable Score Projected
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The projected score is 100. It equals the canonical score (60) plus the COMPLETION_WEIGHT (40) that becomes available when the execution layer is evaluated. This is not a guarantee — it is the maximum achievable if execution completes to maximum structural state. The projection rule is PR-NOT-EVALUATED: execution not yet run.

## Authoritative Value

100 (achievable upon execution assessment)

## Source Fields

- `gauge_state.json` → `score.projected`
- `gauge_state.json` → `projection.rule=PR-NOT-EVALUATED`

## Upstream Artifacts

- [[ART-01 gauge_state.json]]

## Transformation Chain

- pios compute gauge (S4) — projection_logic_spec PR-NOT-EVALUATED

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES — "Achievable: 100 if execution completes"
- Reason: Caveat (execution not yet run) must accompany LENS surface

## Traceability

- Status: FULL
- Caveats: Execution layer NOT evaluated — projection assumes maximum structural state

## Why It Matters

A projected score of 100/100 defines the ceiling of this assessment. It tells a buyer: the platform's structural foundation earns 60 today; the remaining 40 points are earned by running runtime execution assessment. This is not speculation — it is the mathematical upper bound given the scoring model. The 60–100 range is the evidence-backed confidence interval: the floor is proven, the ceiling is achievable.

## Surfaces

- StatusBand ("Achievable: 100")
- ScoreGauge projected chip
- CONCEPT-13 resolution

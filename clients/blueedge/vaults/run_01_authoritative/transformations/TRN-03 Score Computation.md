---
node_class: transformation
transformation_id: TRN-03
transformation_name: Score Computation
stage: S4
command: pios compute gauge
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Computes canonical and projected scores from coverage, reconstruction, and execution state. Produces score fields in gauge_state.json.

## Inputs
- [[ART-02 coverage_state.json]] — coverage_percent → coverage_points; execution_layer_evaluated → completion gate
- [[ART-03 reconstruction_state.json]] — overall_result → reconstruction_points

## Outputs
- [[ART-01 gauge_state.json]] — score.canonical=60, score.projected=100, score.components

## Rules
- completion_points: requires execution_layer_evaluated=True; if False → 0; if True → terminal state lookup (S-13→40, S-T3→20)
- coverage_points = round(coverage_percent × 0.35) = 35
- reconstruction_points = PASS→25, otherwise→0
- canonical = sum(completion + coverage + reconstruction) = 0+35+25 = 60
- projected = canonical + COMPLETION_WEIGHT(40) = 60+40 = 100 (when execution not evaluated)

## Claims Produced
[[CLM-09 Proven Structural Score]] [[CLM-10 Achievable Score Projected]] [[CLM-11 Score Band Classification]] [[CLM-12 Score Confidence Range]]

## Product Role

Score computation is the transformation where structural evidence becomes a number. The execution chain runs this step — GAUGE renders the result. The arithmetic is deterministic and bounded: coverage contributes a maximum of 35 points, reconstruction contributes 25, execution contributes up to 40 when evaluated. The canonical score (60) and projected score (100) are the two commercial numbers that appear in StatusBand, ScoreGauge, and the executive overview. Understanding this transformation is what makes those numbers defensible: they are not estimates, they are the output of explicit rules applied to verified evidence.

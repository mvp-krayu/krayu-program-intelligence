---
title: Gauge State
node_type: artifact
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

`gauge_state.json` — the single terminal artifact consumed by the GAUGE product surface. Encodes the complete scored state of a run including canonical score, projected score, execution status, and confidence band.

## Authoritative Paths

- `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json`
- `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/gauge_state_computation_contract.md`
- `docs/psee/PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01/gauge_scoring_semantic_alignment_spec.md`

## Classification

gauge-artifact

## Path Convention

```
clients/<tenant>/psee/runs/<run_id>/package/gauge_state.json
```

## Key Fields (Stream 10 schema)

| field | path in JSON | description |
|-------|-------------|-------------|
| `run_id` | `.run_id` | Run identifier |
| `canonical_score` | `.score.canonical` | Proven score: completion_points + coverage_points + reconstruction_points |
| `projected_score` | `.score.projected` | Projected score if execution layer evaluated: canonical + 40 |
| `band_label` | `.score.band_label` | Score band (CONDITIONAL, EMERGING, etc.) |
| `completion_points` | `.score.components.completion_points` | 0 when execution_layer_evaluated=False |
| `completion_status` | `.score.components.completion_status` | NOT_EVALUATED when execution not run |
| `coverage_points` | `.score.components.coverage_points` | DIM-01 contribution (max 35) |
| `reconstruction_points` | `.score.components.reconstruction_points` | DIM-02 contribution (max 25) |
| `execution_status` | `.state.execution_status` | NOT_EVALUATED / COMPLETE / PARTIAL / ESCALATED / STOPPED / INDETERMINATE |
| `execution_layer_evaluated` | `.state.execution_layer_evaluated` | Boolean — gates completion_points |
| `execution_mode` | `.state.execution_mode` | STRUCTURAL_ONLY when execution not evaluated; FULL when evaluated |
| `confidence.lower` | `.confidence.lower` | Lower bound = canonical_score |
| `confidence.upper` | `.confidence.upper` | Upper bound = projected_score (when NOT_EVALUATED) |
| `confidence.status` | `.confidence.status` | SPLIT_EXECUTION_NOT_EVALUATED when execution not evaluated; COMPUTED when evaluated |

## Authoritative Values (`run_authoritative_recomputed_01`)

| field | value |
|-------|-------|
| run_id | run_authoritative_recomputed_01 |
| canonical_score | 60 |
| projected_score | 100 |
| band_label | CONDITIONAL |
| completion_points | 0 |
| coverage_points | 35 |
| reconstruction_points | 25 |
| execution_status | NOT_EVALUATED |
| execution_layer_evaluated | False |
| execution_mode | STRUCTURAL_ONLY |
| confidence.lower | 60 |
| confidence.upper | 100 |
| confidence.status | SPLIT_EXECUTION_NOT_EVALUATED |

## Score Derivation

`canonical_score = 0 (completion) + 35 (coverage) + 25 (reconstruction) = 60`
`projected_score = 60 + 40 (COMPLETION_WEIGHT) = 100`

## Determinism / Constraint Notes

`execution_layer_evaluated` is read from `coverage_state.json` (absent = False). This boolean gates: (1) completion_points award, (2) execution_status value, (3) execution_mode value, (4) confidence band semantics. Score model authority: `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/gauge_state_computation_contract.md`.

## Produced By

[[S4 — Gauge Computation and Freshness]]

## Consumed By

[[App Routes]] (via `GAUGE_PACKAGE_DIR` → `/api/gauge`)

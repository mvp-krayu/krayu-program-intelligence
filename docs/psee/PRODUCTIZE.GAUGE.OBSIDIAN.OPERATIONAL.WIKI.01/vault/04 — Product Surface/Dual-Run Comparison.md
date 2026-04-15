---
title: Dual-Run Comparison
node_type: product-surface
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Documents the localhost:3001 vs localhost:3002 comparison result. Proves the structural score foundation is identical across the pre-Stream-10 run and the recomputed authoritative run. Classifies schema version differences as intentional Stream 10 additions.

## Authoritative Paths

- `docs/psee/PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01/gauge_dual_run_comparison_spec.md`
- `docs/psee/PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01/EXECUTION_LOG.md`
- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/gauge_authoritative_apples_to_apples_recompute_spec.md`
- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/EXECUTION_LOG.md`

## Classification

canonical-doc

## Comparison Result

**Verdict: DIFFERENCE (expected — schema version gap only)**

### Structural foundation (IDENTICAL)

| metric | localhost:3001 (run_01_authoritative) | localhost:3002 (run_authoritative_recomputed_01) | match |
|--------|--------------------------------------|------------------------------------------------|-------|
| coverage required_units | 30 | 30 | SAME |
| coverage admissible_units | 30 | 30 | SAME |
| canonical_score | 60 | 60 | SAME |
| band_label | CONDITIONAL | CONDITIONAL | SAME |
| coverage_points | 35 | 35 | SAME |
| reconstruction_points | 25 | 25 | SAME |
| completion_points | 0 | 0 | SAME |
| topology domains | 17 | 17 | SAME |
| topology capabilities | 42 | 42 | SAME |
| topology components | 89 | 89 | SAME |
| signals total | 5 | 5 | SAME |
| confidence lower | 60 | 60 | SAME |
| confidence upper | 100 | 100 | SAME |

### Schema version differences (EXPECTED — Stream 10)

| field | localhost:3001 | localhost:3002 | cause |
|-------|---------------|---------------|-------|
| projected_score | absent | 100 | Stream 10 new field |
| execution_status | PHASE_1_ACTIVE | NOT_EVALUATED | Stream 10 semantics |
| execution_layer_evaluated | absent | False | Stream 10 new field |
| execution_mode | FULL | STRUCTURAL_ONLY | Stream 10 new field |
| confidence.status | COMPUTED | SPLIT_EXECUTION_NOT_EVALUATED | Stream 10 new semantics |

## Determinism / Constraint Notes

Zero unintended differences. 13 structural fields IDENTICAL. 5 schema version differences — all Stream 10 intentional additions. No product logic error. No scoring logic error.

## Linked Specs

- `docs/psee/PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01/gauge_dual_run_comparison_spec.md`
- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/gauge_authoritative_apples_to_apples_recompute_spec.md`
- `docs/psee/PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01/gauge_scoring_semantic_alignment_spec.md`

## See Also

[[Lock Baseline]], [[S4 — Gauge Computation and Freshness]], [[Gauge State]], [[App Routes]]

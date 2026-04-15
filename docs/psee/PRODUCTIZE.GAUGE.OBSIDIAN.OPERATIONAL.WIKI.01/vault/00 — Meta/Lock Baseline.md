---
title: Lock Baseline
node_type: meta
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: LOCKED
---

## Purpose

States the locked product baseline that anchors all authoritative values in this wiki. Every artifact value cited in this vault derives from this baseline.

## Authoritative Paths

- `docs/psee/GAUGE.BASELINE.LOCK.01/gauge_baseline_lock_contract.md`

## Classification

lock-reference

## Locked Baseline Identity

| field | value |
|-------|-------|
| Tag | `product-gauge-authoritative-v1` |
| Commit | `6f8c62b` |
| Validated run | `run_authoritative_recomputed_01` |
| Authoritative IG | `docs/pios/IG.RUNTIME/run_01/` |
| Upstream source | `docs/pios/runs/run_07_source_profiled_ingestion/` → [NOT PRESENT — lineage constraint] |

## Locked Authoritative Values

| metric | value |
|--------|-------|
| coverage required_units | 30 |
| coverage admissible_units | 30 |
| coverage_percent | 100.0 |
| reconstruction validated_units | 30 |
| reconstruction state | PASS |
| topology domains | 17 |
| topology capabilities | 42 |
| topology components | 89 |
| topology total_nodes | 148 |
| signals total | 5 |
| canonical_score | 60 |
| projected_score | 100 |
| band_label | CONDITIONAL |
| execution_status | NOT_EVALUATED |
| execution_layer_evaluated | False |
| confidence lower | 60 |
| confidence upper | 100 |
| verdict | GOVERNED AND FRESH THROUGH S4 |

## Linked Specs

- `docs/psee/GAUGE.BASELINE.LOCK.01/gauge_baseline_lock_contract.md`
- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/gauge_authoritative_apples_to_apples_recompute_spec.md`

## Determinism / Constraint Notes

The locked baseline may only be updated by a formal new baseline lock stream. Values in this page must not be manually edited.

## Status / Boundary Notes

`run_07_source_profiled_ingestion/` — the original ingestion source — is not recoverable. The authoritative IG basis (`docs/pios/IG.RUNTIME/run_01/`) is the surviving 30-unit artifact set and is treated as the floor of all authoritative evidence.

## Transitions

- → [[Chain Overview]]

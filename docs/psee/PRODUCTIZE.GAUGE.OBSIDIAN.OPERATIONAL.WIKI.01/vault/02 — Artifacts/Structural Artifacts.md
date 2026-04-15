---
title: Structural Artifacts
node_type: artifact
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Classification of the L40.2 / L40.3 / L40.4 structural chain outputs. Run-scoped. Not present for the 30-unit authoritative recomputed run (source chain was blocked).

## Authoritative Paths

- `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01/structural_truth_40_2_spec.md`
- `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01/structural_truth_40_3_spec.md`
- `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01/structural_truth_40_4_spec.md`

## Classification

structural-artifact

## Path Convention

```
clients/<tenant>/psee/runs/<run_id>/40_2/    ← L40.2 output (CEU classifications)
clients/<tenant>/psee/runs/<run_id>/40_3/    ← L40.3 output (relationship edges)
clients/<tenant>/psee/runs/<run_id>/40_4/    ← L40.4 output (normalized topology)
```

## Producing Steps

| artifact | producing command |
|----------|-----------------|
| `40_2/` | `pios structural extract --tenant <tenant> --run-id <run_id>` |
| `40_3/` | `pios structural relate --tenant <tenant> --run-id <run_id>` |
| `40_4/` | `pios structural normalize --tenant <tenant> --run-id <run_id>` |

## Consuming Step

- Command: `pios ig integrate-structural-layers --tenant <tenant> --run-id <run_id>` (registers 40_4/ into layer_index.json)

## Determinism / Constraint Notes

L40.4 does not read from `ig/` artifacts directly. L40.4 outputs must be registered via `pios ig integrate-structural-layers` before `pios emit coverage` cross-reference will match. For direct use of `docs/pios/IG.RUNTIME/run_01/` as `--ig-dir`, this integration step is not required — layer_index.json is already populated.

## Status / Boundary Notes

For `run_authoritative_recomputed_01`: **All three structural artifact directories are [NOT PRESENT]** — the structural chain (L40.2 → L40.3 → L40.4) was blocked due to absent source (`run_07_source_profiled_ingestion/`). The authoritative IG basis (`docs/pios/IG.RUNTIME/run_01/`) was used directly, bypassing the structural chain entirely.

## Produced By

[[L40.2 — Structural Extraction]], [[L40.3 — Structural Relation]], [[L40.4 — Structural Normalization]]

## Consumed By

[[IG — Intelligence Graph Bridge]] (integrate-structural-layers)

---
title: Package Artifacts
node_type: artifact
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Classification of the terminal produced artifacts from each chain stage (S0 bootstrap through S4). The `package/` directory is the sole input to the GAUGE product surface.

## Authoritative Paths

- `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/` (authoritative run)
- `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/gauge_state_computation_contract.md`

## Classification

gauge-artifact

## Path Convention

```
clients/<tenant>/psee/runs/<run_id>/package/
```

## Files

| file | produced by | consumed by |
|------|------------|-------------|
| `engine_state.json` | `pios bootstrap` | `pios validate freshness` (AC gate) |
| `gauge_inputs.json` | `pios bootstrap` (updated by S1, S2, S3) | `pios compute gauge` |
| `coverage_state.json` | `pios emit coverage` | `pios compute gauge` |
| `reconstruction_state.json` | `pios emit reconstruction` | `pios compute gauge` |
| `canonical_topology.json` | `pios emit topology` | `/api/topology` (run-scoped copy; canonical is `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`) |
| `signal_registry.json` | `pios emit signals` | `/api/signals` (run-scoped copy; canonical is `docs/pios/41.4/signal_registry.json`) |
| `gauge_state.json` | `pios compute gauge` | `/api/gauge` (via `GAUGE_PACKAGE_DIR`) |

## Authoritative Values (`run_authoritative_recomputed_01`)

| file | key values |
|------|-----------|
| `coverage_state.json` | required_units=30, admissible_units=30, coverage_percent=100.0, state=COMPUTED, execution_layer_evaluated=absent (→ False) |
| `reconstruction_state.json` | validated_units=30, state=PASS, violations=0 |
| `canonical_topology.json` | domains=17, capabilities=42, components=89, total_nodes=148 |
| `signal_registry.json` | total=5 |
| `gauge_state.json` | canonical=60, projected=100, band=CONDITIONAL, NOT_EVALUATED — see [[Gauge State]] |

## Determinism / Constraint Notes

All 9 package artifacts for `run_authoritative_recomputed_01` were produced by the executable chain — none were copied from prior runs. Run artifact path: `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/`.

## Produced By

[[S0 — Intake and Bootstrap]], [[S1 — Coverage and Reconstruction]], [[S2 — Topology Emission]], [[S3 — Signal Emission]], [[S4 — Gauge Computation and Freshness]]

## Consumed By

[[S4 — Gauge Computation and Freshness]], [[App Routes]]

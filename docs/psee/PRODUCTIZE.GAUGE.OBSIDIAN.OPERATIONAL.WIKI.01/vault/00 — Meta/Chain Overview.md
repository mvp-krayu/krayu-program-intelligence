---
title: Chain Overview
node_type: meta
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Single-page view of the complete GAUGE operational chain stage flow. Each stage links to its dedicated node page.

## Authoritative Paths

- `docs/psee/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01/runtime_surface_specification.md`

## Classification

canonical-doc

## Full Stage Flow

```
PRE-S0  →  S0  →  IG  →  L40.2  →  L40.3  →  L40.4  →  S1  →  S2  →  S3  →  S4  →  GAUGE
```

| stage | name | pios command | key output |
|-------|------|-------------|------------|
| PRE-S0 | Source Intake | `pios intake create` | `intake_record.json`, `source_manifest.json`, `file_hash_manifest.json` |
| S0-01 | Ledger Create | `pios ledger create` | `intake_record.json` (run-scoped, AC schema) |
| S0-02 | Bootstrap | `pios bootstrap` | `engine_state.json`, `gauge_inputs.json` |
| IG-01 | IG Materialize | `pios ig materialize` | `ig/` (6 files) |
| IG-02 | IG Integrate Structural | `pios ig integrate-structural-layers` | updated `ig/normalized_intake_structure/layer_index.json` |
| L40.2 | Structural Extract | `pios structural extract` | `40_2/` |
| L40.3 | Structural Relate | `pios structural relate` | `40_3/` |
| L40.4 | Structural Normalize | `pios structural normalize` | `40_4/` |
| S1-01 | Emit Coverage | `pios emit coverage` | `coverage_state.json` |
| S1-02 | Emit Reconstruction | `pios emit reconstruction` | `reconstruction_state.json` |
| S2 | Emit Topology | `pios emit topology` | `canonical_topology.json` |
| S3 | Emit Signals | `pios emit signals` | `signal_registry.json` |
| S4-01 | Compute Gauge | `pios compute gauge` | `gauge_state.json` |
| S4-02 | Declare Coherence | `pios declare coherence` | `coherence_record.json` |
| S4-03 | Validate Freshness | `pios validate freshness` | verdict (stdout) |

## Stage Links

[[S0 — Intake and Bootstrap]] → [[IG — Intelligence Graph Bridge]] → [[L40.2 — Structural Extraction]] → [[L40.3 — Structural Relation]] → [[L40.4 — Structural Normalization]] → [[S1 — Coverage and Reconstruction]] → [[S2 — Topology Emission]] → [[S3 — Signal Emission]] → [[S4 — Gauge Computation and Freshness]]

## Known Lineage Constraint

For the 30-unit authoritative basis, PRE-S0 (`pios intake create`) and IG-01 (`pios ig materialize`) are BLOCKED — original source absent. `docs/pios/IG.RUNTIME/run_01/` used directly as `--ig-dir`. See [[Lock Baseline]].

## Transitions

- ← [[Lock Baseline]]
- → [[Directory Map]]

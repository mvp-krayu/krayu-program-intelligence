---
title: GAUGE — Operational Wiki
node_type: meta
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Entry point for the GAUGE Operational Wiki. This vault documents the complete operational chain — intake → IG → 40.2 → 40.3 → 40.4 → S1 → S2 → S3 → S4 → GAUGE product surface — as a navigable, evidence-backed documentation layer. No content from authoritative sources is duplicated here. All nodes link to repo-anchored paths.

## Locked Baseline

- Tag: `product-gauge-authoritative-v1`
- Commit: `6f8c62b`
- Validated run: `run_authoritative_recomputed_01`
- Authoritative IG: `docs/pios/IG.RUNTIME/run_01/`
- Known constraint: `docs/pios/runs/run_07_source_profiled_ingestion/` → [NOT PRESENT — lineage constraint]

## Chain Flow

```
PRE-S0 (intake create)
  → S0 (ledger create + bootstrap)
  → IG (ig materialize + ig integrate-structural-layers)
  → L40.2 (structural extract)
  → L40.3 (structural relate)
  → L40.4 (structural normalize)
  → S1 (emit coverage + emit reconstruction)
  → S2 (emit topology)
  → S3 (emit signals)
  → S4 (compute gauge + declare coherence + validate freshness)
  → GAUGE product surface (/api/gauge, /api/topology, /api/signals)
```

## Wiki Sections

| section | folder | description |
|---------|--------|-------------|
| [[Lock Baseline]] | 00 — Meta | Locked tag, commit, run_id, known constraints |
| [[Chain Overview]] | 00 — Meta | Full stage flow — one page |
| [[Directory Map]] | 00 — Meta | Repo-root anchored path map |
| [[S0 — Intake and Bootstrap]] | 01 — Chain Stages | Pre-S0 intake + S0 ledger/bootstrap |
| [[IG — Intelligence Graph Bridge]] | 01 — Chain Stages | ig materialize + structural integration |
| [[L40.2 — Structural Extraction]] | 01 — Chain Stages | pios structural extract |
| [[L40.3 — Structural Relation]] | 01 — Chain Stages | pios structural relate |
| [[L40.4 — Structural Normalization]] | 01 — Chain Stages | pios structural normalize |
| [[S1 — Coverage and Reconstruction]] | 01 — Chain Stages | pios emit coverage + emit reconstruction |
| [[S2 — Topology Emission]] | 01 — Chain Stages | pios emit topology |
| [[S3 — Signal Emission]] | 01 — Chain Stages | pios emit signals |
| [[S4 — Gauge Computation and Freshness]] | 01 — Chain Stages | pios compute gauge + declare coherence + validate freshness |
| [[Intake Artifacts]] | 02 — Artifacts | intake bundle file classification |
| [[IG Artifacts]] | 02 — Artifacts | ig/ directory file classification |
| [[Structural Artifacts]] | 02 — Artifacts | 40_2/, 40_3/, 40_4/ classification |
| [[Package Artifacts]] | 02 — Artifacts | package/ files S1–S4 |
| [[Gauge State]] | 02 — Artifacts | gauge_state.json schema and fields |
| [[Contracts]] | 03 — Governance | Governing contracts index |
| [[Protocols]] | 03 — Governance | Governing protocols index |
| [[App Routes]] | 04 — Product Surface | gauge-product route binding |
| [[Dual-Run Comparison]] | 04 — Product Surface | localhost:3001 vs localhost:3002 |
| [[Alignment Streams Index]] | 05 — Alignment Streams | PRODUCTIZE.* streams index |

## Authoritative Spec

`docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01/gauge_obsidian_operational_wiki_spec.md`

---
title: S2 — Topology Emission
node_type: stage
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Emits the canonical topology (domains / capabilities / components) from the semantic derivation layer. Output is `canonical_topology.json` in the run package and is also maintained as a canonical shared artifact.

## Authoritative Paths

- `docs/psee/PSEE.FRESH.S2.S3.EMISSION.01/psee_fresh_s2_s3_emission_report.md`
- `scripts/pios/41.1/build_semantic_layer.py`
- `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`

## Classification

gauge-artifact

## Producing Step

- Command: `pios emit topology --run-dir <run_dir> --run-id <run_id>`
- Script/file: `scripts/pios/41.1/build_semantic_layer.py`

## Consuming Step

- Route: `app/gauge-product/pages/api/topology.js` (hardcoded — reads `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`)

## Input Artifacts

- Semantic derivation module: `scripts/pios/41.1/build_semantic_layer.py`
- Run reference: `run_03_blueedge_derivation_validation` (contract: PIOS-41.1-RUN01-CONTRACT-v1)

## Output Artifacts

- `clients/<tenant>/psee/runs/<run_id>/package/canonical_topology.json`

**Authoritative canonical (shared):**
- `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`

**Authoritative values:**
- domains=17, capabilities=42, components=89, total_nodes=148

## Linked Specs

- `docs/psee/PSEE.FRESH.S2.S3.EMISSION.01/psee_fresh_s2_s3_emission_report.md`

## Linked Execution Logs

- `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/EXECUTION_LOG.md` → S2-01 PASS, 17/42/89/148

## Determinism / Constraint Notes

The `/api/topology` route is hardcoded to `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`. It is NOT overridable by `GAUGE_PACKAGE_DIR`. Both localhost:3001 and localhost:3002 serve identical topology from the same source. See [[App Routes]].

## Transitions

- ← [[S1 — Coverage and Reconstruction]]
- → [[S3 — Signal Emission]]

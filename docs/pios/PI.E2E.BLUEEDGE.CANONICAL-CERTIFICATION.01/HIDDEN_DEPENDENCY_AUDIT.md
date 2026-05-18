# Hidden Dependency Audit
## PI.E2E.BLUEEDGE.CANONICAL-CERTIFICATION.01

**Generated:** 2026-05-17
**Stream posture:** DISCOVERY — no assumptions about canonical stages

---

## Audit Scope

Identify all artifacts in the LENS-serving BlueEdge runtime that depend on sources outside the canonical generic pipeline (`run_client_pipeline.py` + its pre-requisite scripts).

---

## Hidden Dependency HD-001: dom_path_domain_layer.json

| Field | Value |
|-------|-------|
| **Artifact** | `dom_path_domain_layer.json` |
| **Current location** | `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json` |
| **Content** | 13 DOM groups, 35 curated nodes |
| **Consumed by** | `run_client_pipeline.py` Phase 8a (vault construction) → `vault/canonical_topology.json` → LENS projection |
| **Dependency type** | HARD — without this artifact, LENS renders 1 domain (ROOT) instead of 13 |
| **Origin** | Conformance stream `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` |
| **Recovery commit** | `64ff900` — recovered from git stash (`stash@{0}^3`) |
| **Stash source** | `WIP on work/psee-runtime: 40a5db1 lens: lock e2e pipeline reality and conformance evidence` |
| **Original derivation method** | Path-prefix grouping on 35 curated nodes from `ceu_node_map.json` |
| **Derivation rule** | "Group nodes by longest common path prefix that represents a meaningful structural boundary" |
| **Generic pipeline equivalent** | DOES NOT EXIST — generic pipeline produces 1 cluster / 1 domain for BlueEdge |
| **SHA256** | `f5e2a0dfeedeab8f2450b2dc6894fc63d70ed28cf8429eaed7e229f898ca29a6` |

### Why this is hidden

The artifact was produced by a one-time conformance stream, recovered from a git stash, and stored in `docs/psee/` (not `clients/`). It is referenced by `source_manifest.json` via `dom_layer_path` but there is no canonical pipeline stage that produces it. The generic `dom_layer_generator.py` produces a different (structurally inferior) result.

---

## Hidden Dependency HD-002: Conformance Path Signal Artifacts

| Field | Value |
|-------|-------|
| **Artifacts** | `signal_registry_fastapi_compatible.json`, `condition_correlation_state_fastapi_compatible.json`, `pressure_zone_state_fastapi_compatible.json`, binding/signal recompute artifacts |
| **Current location** | `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/` and `PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/` |
| **Recovery commit** | `e05a4f7` |
| **Consumed by** | `run_client_pipeline.py` Phase 5 + Phase 6-7 (conformance path) |
| **Dependency type** | CONDITIONAL — only used when `source_manifest.json` contains `fastapi_conformance_path` |
| **Generic pipeline equivalent** | EXISTS — Phases 5-7 have native generation path via `run_end_to_end.py` |
| **Impact if removed** | Native path would execute instead (untested for BlueEdge with current binding envelope) |

### Why this is partially hidden

The existing BlueEdge `source_manifest.json` (source_01) declares `fastapi_conformance_path`, causing the orchestrator to use pre-computed conformance artifacts instead of computing signals natively. The certification run (source_certification) does NOT have this field and successfully computed signals natively — but from the structurally poor 1-cluster input.

---

## Hidden Dependency HD-003: UUID-Based Client Path

| Field | Value |
|-------|-------|
| **Pattern** | `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/` |
| **Used by** | Existing BlueEdge `source_manifest.json` (source_01) for `extracted_path`, `structure_path` |
| **Relationship to `clients/blueedge/`** | The `clients/blueedge/` alias directory contains `client.yaml`, `sources/`, `lens/`, and `psee/runs/` for newer runs. The UUID path contains the original intake, structural, and grounding artifacts. |
| **Impact** | Two physical paths serve BlueEdge artifacts. The UUID path is where the original 40.x structural analysis lives. Newer runs use `clients/blueedge/psee/runs/`. |
| **Generic pipeline behavior** | Uses `clients/<client_id>/psee/runs/<run_id>/` exclusively — does not reference UUID paths |

---

## Hidden Dependency HD-004: 35-Node Curation vs 945-Node Raw Scan

| Field | Value |
|-------|-------|
| **LENS-serving node count** | 35 (curated structural nodes) |
| **Generic scanner node count** | 945 (all files in archive) |
| **Curation source** | `ceu_node_map.json` from `run_blueedge_integrated_01` |
| **Curation method** | CEU-grounded nodes selected as structurally meaningful representatives |
| **Generic scanner method** | Every file in `source_inventory.json` becomes a node |
| **Impact** | Even if clustering were fixed, the generic pipeline would produce domains from 945 nodes, not the curated 35. The resulting topology structure would differ. |

---

## Hidden Dependency HD-005: LENS-Serving Run Assembly

| Field | Value |
|-------|-------|
| **Current LENS-serving run** | `run_be_orchestrated_fixup_01` |
| **Run contents** | 41.x (signal/pressure projections), 75.x (condition/pressure), binding, vault |
| **Missing from run** | intake, structure (40.x), CEU, DOM, integration validation, vault readiness |
| **Assembly method** | Partial outputs assembled from multiple prior runs and conformance artifacts |
| **Generic pipeline behavior** | Produces all phases in a single run directory |
| **Impact** | The LENS-serving run was NOT produced by a single end-to-end pipeline execution |

---

## Summary

| ID | Artifact | Generic Pipeline Produces Equivalent? | LENS Impact |
|----|----------|---------------------------------------|-------------|
| HD-001 | dom_path_domain_layer.json (13 domains) | NO — produces 1 domain | CRITICAL — topology structure |
| HD-002 | Conformance signal artifacts | YES (native path exists) | LOW — native path works |
| HD-003 | UUID-based client path | N/A (path convention) | LOW — newer runs use alias |
| HD-004 | 35 curated nodes vs 945 raw | NO — no curation stage | HIGH — node selection affects all downstream |
| HD-005 | Assembled run (not single execution) | YES (single execution) | MEDIUM — run completeness |

**Critical finding:** HD-001 and HD-004 together mean the generic pipeline cannot currently reproduce the LENS-serving BlueEdge domain topology. The gap is not in the pipeline orchestration (which works mechanically) but in the structural reconstruction method.

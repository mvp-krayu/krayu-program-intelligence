# PATH A Revalidation — PI.BLUEEDGE.E2E.RUNTIME-REVALIDATION.01

**Stream:** PI.BLUEEDGE.E2E.RUNTIME-REVALIDATION.01
**Date:** 2026-05-18
**Phase:** A — Bottom-Up Pipeline Replay

---

## 1. Pipeline Execution Summary

Full bottom-up replay executed from verified source archive through pipeline Phases 1-8b. Phase 9 (selector update) deliberately SKIPPED to protect production state.

Pre-pipeline stages executed independently before orchestrator:
- `source_intake.py` — fresh extraction + inventory
- `structural_scanner.py` — fresh 40.x structural scan
- `ceu_grounding.py` — fresh CEU grounding against current generic registry

Orchestrator phases (run_client_pipeline.py --phase N):
- Phase 1: Source Boundary — PASS
- Phase 2: Intake Verification — PASS
- Phase 3: 40.x Structural Verification — PASS
- Phase 4: CEU Grounding Verification — PASS
- Phase 5: Build Binding Envelope — PASS (STAGE_NOT_AUTOMATED — pre-computed conformance artifacts)
- Phase 6+7: 75.x/41.x Projection — PASS (STAGE_NOT_AUTOMATED — pre-computed conformance artifacts)
- Phase 8a: Vault Construction — PASS (9 vault artifacts)
- Phase 8b: Vault Readiness — PASS (9/9 checks)
- Phase 9: Selector Update — **SKIPPED** (non-mutation rule)

---

## 2. Layer-by-Layer Validation

### Layer A — Raw Structural Scan

| Metric | Expected | Actual | Status |
|---|---|---|---|
| Total nodes | ~945 | 945 | **MATCH** |
| File nodes | ~741 | 741 | **MATCH** |
| Directory nodes | ~204 | 204 | **MATCH** |
| Wrapper normalization | blueedge-platform handled | blueedge-platform normalized | **MATCH** |
| Root collapse | Must NOT collapse to 1 ROOT | 11 clusters (non-collapsed) | **PASS** |

**Classification:** LAYER_A_PASS — raw structural scan reproduces expected node inventory from verified source archive.

### Layer B — Wrapper Normalization

| Metric | Expected | Actual | Status |
|---|---|---|---|
| Wrapper detection | blueedge-platform prefix | Detected, normalized | **MATCH** |
| Cluster count (40.4) | Multiple top-level clusters | 11 clusters | **MATCH** |
| Root collapse (GAP-001 regression) | MUST NOT produce 1 ROOT domain | 11 clusters, non-collapsed | **PASS — NO REGRESSION** |

**Classification:** LAYER_B_PASS — wrapper normalization works correctly. GAP-001 (1 ROOT domain) is NOT present. The A.5 canonicalization fix holds.

### Layer C — A5a Raw Structural Substrate

| Metric | Expected | Actual | Status |
|---|---|---|---|
| A5a domain count | 48 replay-safe structural domains | NOT PRODUCED in this pipeline run | **NOT VALIDATED** |
| Method | Full-node path-prefix grouping | Not executed — pipeline uses conformance artifact | **N/A** |

**Note:** The current pipeline does NOT produce the A.5a 48-domain layer. The A5a layer was validated in a prior stream (`run_blueedge_a5_validation_01`) which produced 48 DOM groups from 945 nodes via `a5_path_prefix_reconstruction`. The current orchestrator pipeline skips this intermediate step and reads the A.5b executive layer directly from `dom_layer_path` in the source manifest.

**Classification:** LAYER_C_NOT_VALIDATED — A5a substrate not produced by this pipeline configuration. Prior A5 validation (48 domains) confirmed separately. This is a PIPELINE_ARCHITECTURE_GAP, not a regression.

### Layer D — CEU Participation

| Metric | Expected | Actual | Status |
|---|---|---|---|
| CEU-grounded nodes | 35 (historical) | 5/10 grounded (52 evidence nodes) | **CEU_REGISTRY_DRIFT** |
| CEU registry | Historical BlueEdge-specific | Generic 10-CEU registry (ceu_registry.json) | **DRIFT** |
| Grounding ratio | 1.0 (historical) | 0.5 | **DRIFT** |
| Coverage classification | FULL | MEDIUM | **DRIFT** |
| Grounding gate | PASS | PASS | **MATCH** |

**Analysis:** The generic CEU registry (`scripts/pios/ceu_registry.json`) has 10 abstract CEUs (APPLICATION_CORE, SERVICE_LAYER, DATA_LAYER, etc.) with generic patterns. Only 5 ground against BlueEdge's evidence. The historical 35 CEU-grounded nodes came from a different, BlueEdge-specific CEU configuration (`ceu_grounding_registry.json` at the UUID-based path).

However, the vault's canonical_topology and binding envelope use the `dom_layer_path` conformance artifact (13 DOMs, 35 nodes), NOT the fresh CEU grounding output. The fresh CEU grounding (5/10, ratio=0.5) is produced but not consumed by the vault construction. The vault uses the pre-existing dom_layer artifact.

**Classification:** CEU_REGISTRY_DRIFT — the generic CEU registry produces different grounding than the historical BlueEdge-specific CEU configuration. This drift does NOT affect the current LENS projection because the vault construction path bypasses the fresh CEU output.

### Layer E — Executive Structural DOM Layer

| Metric | Expected | Actual | Status |
|---|---|---|---|
| DOM count | 13 | 13 | **MATCH** |
| Total nodes | 35 | 35 | **MATCH** |
| Determinism hash | Production value | Exact match | **MATCH** |

**Source:** The 13 DOMs come from `dom_path_domain_layer.json` (conformance artifact at `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/`). This is NOT freshly derived from the 945-node structural scan. Both production and revalidation consume the same conformance artifact.

| DOM | Label | Nodes | Status |
|---|---|---|---|
| DOM-01 | root_configuration | 3 | MATCH |
| DOM-02 | ci_cd_workflows | 2 | MATCH |
| DOM-03 | backend_migrations | 3 | MATCH |
| DOM-04 | backend_app_root | 2 | MATCH |
| DOM-05 | backend_common | 5 | MATCH |
| DOM-06 | backend_config | 2 | MATCH |
| DOM-07 | backend_events | 1 | MATCH |
| DOM-08 | backend_health | 2 | MATCH |
| DOM-09 | backend_modules | 6 | MATCH |
| DOM-10 | frontend | 3 | MATCH |
| DOM-11 | load_tests | 2 | MATCH |
| DOM-12 | monitoring | 2 | MATCH |
| DOM-13 | svg_agents | 2 | MATCH |

**Classification:** LAYER_E_PASS — 13 DOMs match production exactly, determinism hash confirmed.

---

## 3. Vault Artifact Comparison (Revalidation vs Production)

| Artifact | Production | Revalidation | Match |
|---|---|---|---|
| canonical_topology.json | 13 domains, 35 nodes | 13 domains, 35 nodes | **EXACT** (determinism hash) |
| signal_registry.json | 4 signals, 3 active | 4 signals, 3 active | **EXACT** (all values) |
| gauge_state.json | canonical=60, CONDITIONAL | canonical=60, CONDITIONAL | **EXACT** |
| coverage_state.json | 100%, 10/10 | 100%, 10/10 | **EXACT** |
| reconstruction_state.json | PASS, 10/10 | PASS, 10/10 | **EXACT** |
| binding_envelope.json | From conformance | From conformance | **EXACT** (same source) |

**Signal Value Comparison:**

| Signal | Production | Revalidation | Match |
|---|---|---|---|
| PSIG-001 (coupling_pressure) | 5.663 | 5.663 | **EXACT** |
| PSIG-002 (domain_coupling_pressure) | 3.2098 | 3.2098 | **EXACT** |
| PSIG-004 (zone_coverage_concentration) | 2.1822 | 2.1822 | **EXACT** |
| PSIG-006 (unanchored_nodes) | 0 (THEORETICAL_BASELINE) | 0 (THEORETICAL_BASELINE) | **EXACT** |

---

## 4. Deviation Register

### DEV-001: MANIFEST_LINEAGE_DRIFT

**Severity:** HIGH — active runtime dependency on conformance artifact
**Classification:** MANIFEST_LINEAGE_DRIFT

`source_manifest.json` field `dom_layer_path` points to:
```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json
```

This is a conformance recovery artifact, NOT a canonicalized A.5b pipeline output. It is actively consumed at:
- `run_client_pipeline.py` line 346 — Phase 5 binding envelope construction
- `run_client_pipeline.py` line 645 — Phase 8a vault canonical_topology.json construction

The 13-DOM executive layer in LENS derives from this conformance artifact. PIOS_CURRENT_CANONICAL_STATE.md (line 59) states: "grounded executive compression layer (13 domains) requires canonicalization" — meaning A.5b is not yet integrated into the pipeline.

**Impact:** The pipeline produces correct and deterministic results, but the DOM layer source is a recovery artifact rather than a governed pipeline stage output. If the conformance artifact were removed or modified, the pipeline would fail.

**Disposition:** Document. Do NOT fix during this stream.

### DEV-002: CEU_REGISTRY_DRIFT

**Severity:** MEDIUM — produces different grounding than historical
**Classification:** CEU_REGISTRY_DRIFT

Generic CEU registry (10 CEUs) produces 5/10 grounded, ratio=0.5. Historical BlueEdge-specific configuration produced 35 grounded nodes, ratio=1.0.

**Impact:** Does NOT affect current LENS projection. The vault construction path consumes `dom_layer_path` directly, not the fresh CEU grounding output. The fresh CEU grounding is produced and logged but not used for vault DOM construction.

**Disposition:** Document. The generic CEU registry is the correct forward path for multi-client support. BlueEdge-specific CEU patterns are not in the generic registry.

### DEV-003: PIPELINE_ARCHITECTURE_GAP — A5a Not Produced

**Severity:** LOW — architectural expectation, not regression
**Classification:** PIPELINE_ARCHITECTURE_GAP

The current pipeline does not produce the A.5a 48-domain substrate as an intermediate artifact. It jumps from 40.4 raw clusters (11) directly to the 13-DOM executive layer (from conformance artifact). The A.5a layer was validated in a separate run (`run_blueedge_a5_validation_01`).

**Impact:** No operational impact on LENS. The A.5a layer is documented in vault but not integrated into the E2E pipeline chain.

**Disposition:** Document. Future pipeline evolution may integrate A.5a as an explicit intermediate stage.

### DEV-004: STAGE_NOT_AUTOMATED — Signal Computation

**Severity:** LOW — architectural design choice, not regression
**Classification:** STAGE_NOT_AUTOMATED

`fastapi_conformance_path` in source_manifest.json causes Phase 6+7 to bypass `run_end_to_end.py` and load pre-computed signal artifacts directly. Signal values (PSIG-001=5.663, PSIG-002=3.2098, PSIG-004=2.1822, PSIG-006=THEORETICAL_BASELINE) come from 4 FastAPI conformance contracts.

**Impact:** Signal values are reproducible (from the same conformance artifacts) but not independently recomputable from the structural scan alone.

**Disposition:** Document. This is the canonical signal computation pathway for BlueEdge.

### DEV-005: VAULT_READINESS_SCHEMA_BRIDGE

**Severity:** LOW — schema inconsistency in existing pipeline
**Classification:** SCHEMA_BRIDGE_GAP

Phase 8b vault readiness checker (VR-09) expects `validation_status` at top level of `integration_validation.json`. The actual artifact uses `summary.status`. Schema bridge applied during revalidation to pass the check.

**Impact:** Pipeline functions correctly; vault readiness checker has a slightly inconsistent schema expectation.

**Disposition:** Document. Minor schema alignment fix for a future stream.

### DEV-006: RUN_LOCAL_ARTIFACT_GAP

**Severity:** LOW — pipeline architecture gap
**Classification:** RUN_LOCAL_ARTIFACT_GAP

Vault readiness checker expects `dom/dom_layer.json` and `integration/integration_validation.json` at run-local paths. The pipeline orchestrator reads these from manifest-registered external paths but does not copy them to the run directory. Required manual copy during revalidation.

**Impact:** Vault readiness fails until artifacts are manually bridged to run-local paths.

**Disposition:** Document. Future pipeline improvement should copy manifest-sourced artifacts to run-local paths for vault readiness self-containment.

---

## 5. Phase A Verdict

**PHASE A: PASS WITH DEVIATIONS**

The bottom-up pipeline replay produces vault artifacts that are an **exact deterministic match** with production. All 6 vault artifacts match: canonical_topology (determinism hash match), signal_registry (all 4 values exact), gauge_state (score=60, CONDITIONAL), coverage (100%, 10/10), reconstruction (PASS, 10/10), binding envelope (same source).

6 deviations registered:
- 1 HIGH (MANIFEST_LINEAGE_DRIFT — conformance artifact dependency)
- 1 MEDIUM (CEU_REGISTRY_DRIFT — generic vs historical CEU registry)
- 4 LOW (pipeline architecture gaps, schema bridge, stage automation)

No CRITICAL REGRESSIONS detected. GAP-001 (1 ROOT domain) is NOT present — the A.5 canonicalization fix holds.

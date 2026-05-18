# Deviation Analysis — PI.BLUEEDGE.E2E.RUNTIME-REVALIDATION.01

**Stream:** PI.BLUEEDGE.E2E.RUNTIME-REVALIDATION.01
**Date:** 2026-05-18

---

## 1. Deviation Summary

| ID | Classification | Severity | Layer | Phase | Production Impact |
|---|---|---|---|---|---|
| DEV-001 | MANIFEST_LINEAGE_DRIFT | HIGH | E (DOM) | A | None (deterministic) |
| DEV-002 | CEU_REGISTRY_DRIFT | MEDIUM | D (CEU) | A | None (bypassed) |
| DEV-003 | PIPELINE_ARCHITECTURE_GAP | LOW | C (A5a) | A | None (separate validation) |
| DEV-004 | STAGE_NOT_AUTOMATED | LOW | Signals | A | None (canonical path) |
| DEV-005 | SCHEMA_BRIDGE_GAP | LOW | Vault Readiness | A | None (functional) |
| DEV-006 | RUN_LOCAL_ARTIFACT_GAP | LOW | Vault Readiness | A | None (manual bridge) |

**Critical regressions: 0**
**Prior GAP re-appearances: 0**

---

## 2. Detailed Deviation Analysis

### DEV-001: MANIFEST_LINEAGE_DRIFT

**Classification:** MANIFEST_LINEAGE_DRIFT
**Severity:** HIGH
**Affected layer:** E — Executive Structural DOM Layer
**Affected pipeline phases:** 5 (binding), 8a (vault construction)

#### What

`source_manifest.json` field `dom_layer_path` resolves to:
```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json
```

This is a conformance recovery artifact from stream `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01`, NOT a canonicalized A.5b pipeline stage output.

#### Active Consumption Points

| Pipeline location | Phase | Consumption |
|---|---|---|
| `run_client_pipeline.py:346` | 5 | `dom_path = REPO_ROOT / source_manifest["dom_layer_path"]` — reads conformance artifact for binding envelope DOM groups |
| `run_client_pipeline.py:645` | 8a | `dom_path = REPO_ROOT / source_manifest["dom_layer_path"]` — reads conformance artifact for vault canonical_topology.json construction |

#### Why This Matters

The 13-DOM executive layer that LENS serves is deterministic — both production and revalidation produce identical results from the same conformance artifact. However:

1. **Lineage gap:** The DOM layer's provenance is a recovery artifact, not a governed pipeline stage. No canonicalized A.5b stage exists in the pipeline.
2. **Vault state mismatch:** PIOS_CURRENT_CANONICAL_STATE.md (line 59) states: "grounded executive compression layer (13 domains) requires canonicalization." The pipeline already consumes the 13 DOMs — but the vault says they're not yet canonicalized.
3. **Fragility:** If the conformance artifact path changes or is removed, the pipeline fails at Phase 5 with no alternative derivation path.

#### Why This Is NOT a Regression

The conformance artifact produces correct results. The 13 DOMs match the expected executive structural layer. The determinism hash is reproducible. The issue is provenance, not correctness.

#### Resolution Path

A future stream should:
1. Canonicalize the A.5b stage as a governed pipeline phase
2. Update `source_manifest.json` to point to the canonicalized output
3. Update PIOS_CURRENT_CANONICAL_STATE.md to reflect A.5b as operational
4. Deprecate the conformance artifact as authoritative source

---

### DEV-002: CEU_REGISTRY_DRIFT

**Classification:** CEU_REGISTRY_DRIFT
**Severity:** MEDIUM
**Affected layer:** D — CEU Participation

#### What

| Metric | Historical | Revalidation |
|---|---|---|
| CEU registry | BlueEdge-specific (35 CEU-grounded nodes) | Generic 10-CEU (`ceu_registry.json`) |
| Grounded CEUs | 35/35 match | 5/10 grounded |
| Evidence nodes | 35 | 52 |
| Grounding ratio | 1.0 | 0.5 |
| Coverage | FULL | MEDIUM |

#### Why

The generic CEU registry (`scripts/pios/ceu_registry.json`) contains 10 abstract patterns (APPLICATION_CORE, SERVICE_LAYER, DATA_LAYER, API_ROUTING, CONFIGURATION, TESTING, CI_CD, GENERATED_ARTIFACTS, LOGGING_OBSERVABILITY, DEPENDENCY_MANAGEMENT). Only 5 have patterns that match BlueEdge's file structure.

The historical 35 nodes came from a BlueEdge-specific CEU configuration (`ceu_grounding_registry.json`) with CEUs tailored to BlueEdge's domain structure.

#### Why This Does NOT Affect LENS

The vault construction path (Phase 8a) reads `dom_layer_path` directly for canonical_topology.json. It does NOT consume the fresh CEU grounding output. The fresh CEU grounding is produced (Phase 4 verification) and logged, but the vault's 13-DOM layer comes from the conformance artifact, not from CEU-derived grouping.

#### Resolution Path

The CEU registry evolution (35→67 nodes documented in PATH_A5_PARTICIPATION_ARCHITECTURE.md) is an ongoing architectural concern. The generic registry is the correct forward path for multi-client support, but BlueEdge-specific CEU patterns would need to be added for the generic pipeline to reproduce the historical 35-node grounding.

---

### DEV-003: PIPELINE_ARCHITECTURE_GAP — A5a Not Produced

**Classification:** PIPELINE_ARCHITECTURE_GAP
**Severity:** LOW
**Affected layer:** C — A5a Raw Structural Substrate

The E2E pipeline does not produce the A5a 48-domain substrate as an intermediate artifact. The pipeline goes:

```
40.4 (11 clusters, 945 nodes) → [gap] → dom_layer_path (13 DOMs, 35 nodes)
```

The A5a layer (48 domains from full-node path-prefix grouping) was validated in a separate run (`run_blueedge_a5_validation_01`, method: `a5_path_prefix_reconstruction`). It is documented in vault but not integrated into the standard E2E pipeline.

---

### DEV-004: STAGE_NOT_AUTOMATED — Signal Computation

**Classification:** STAGE_NOT_AUTOMATED
**Severity:** LOW
**Affected phases:** 5, 6+7

`source_manifest.json` field `fastapi_conformance_path` causes the pipeline to:
1. Load pre-computed `binding_envelope_fastapi_compatible.json` instead of synthesizing from DOM+CEU
2. Load pre-computed signal artifacts instead of running `run_end_to_end.py`

Signal values are canonical (from 4 FastAPI conformance contracts) but not independently recomputable from the structural scan alone.

---

### DEV-005: SCHEMA_BRIDGE_GAP

**Classification:** SCHEMA_BRIDGE_GAP
**Severity:** LOW

Phase 8b vault readiness checker (VR-09) expects `validation_status` at top level of `integration_validation.json`. The actual artifact uses `summary.status`. A schema bridge was applied during revalidation.

---

### DEV-006: RUN_LOCAL_ARTIFACT_GAP

**Classification:** RUN_LOCAL_ARTIFACT_GAP
**Severity:** LOW

Vault readiness checker expects `dom/dom_layer.json` and `integration/integration_validation.json` at run-local paths. The pipeline orchestrator reads these from manifest-registered external paths but does not copy them into the run directory.

---

## 3. GAP-001 Through GAP-004 Status

| GAP | Original Finding | Current Status |
|---|---|---|
| GAP-001 | Pipeline produced 1 ROOT domain | **NOT PRESENT** — 11 clusters, wrapper normalized. A.5 fix holds. |
| GAP-002 | Node curation stage missing | **NOT ASSESSED** — curation not in generic pipeline scope. CEU grounding provides partial curation. |
| GAP-003 | LENS-serving run assembled from partial outputs | **PARTIALLY ADDRESSED** — vault artifacts match production, but conformance artifact dependency remains (DEV-001). |
| GAP-004 | Reconstruction method not canonically declared | **ADDRESSED** — vault canonicalization complete, operational ontology documents all methods. |

---

## 4. Deviation Impact Matrix

| Deviation | LENS Projection | SQO State | Marketplace Claim | Pipeline Automation |
|---|---|---|---|---|
| DEV-001 | No impact (deterministic) | No impact | Provenance claim weakened | Future canonicalization needed |
| DEV-002 | No impact (bypassed) | No impact | Generic pipeline claim qualified | Registry alignment needed |
| DEV-003 | No impact | No impact | A5a claim limited to separate validation | Pipeline integration needed |
| DEV-004 | No impact (canonical) | No impact | Automation claim qualified | Signal stage automation future work |
| DEV-005 | No impact | No impact | None | Schema fix (trivial) |
| DEV-006 | No impact | No impact | None | Pipeline improvement (minor) |

---

## 5. Overall Assessment

The revalidation demonstrates that the BlueEdge E2E pipeline is **deterministic and reproducible** — vault artifacts match production exactly. The pipeline is functioning correctly within its current architectural constraints.

The deviations are architectural gaps (how the pipeline sources its data) rather than correctness failures (what the pipeline produces). The most significant finding (DEV-001: MANIFEST_LINEAGE_DRIFT) identifies that the 13-DOM executive layer depends on a conformance recovery artifact rather than a canonicalized pipeline stage. This is a provenance concern, not a correctness concern.

No critical regressions. No prior GAP re-appearances. The A.5 canonicalization fix holds.

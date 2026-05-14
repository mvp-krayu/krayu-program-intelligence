# PI.LENS.V2.FASTAPI-RUNTIME-ONBOARDING.01 — Implementation

**Stream:** PI.LENS.V2.FASTAPI-RUNTIME-ONBOARDING.01
**Branch:** work/lens-v2-productization
**Baseline:** 1e46b83 (PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01)
**Date:** 2026-05-10

---

## 1. Objective

Onboard FastAPI `run_02_oss_fastapi_pipeline` as the second client/run
through the manifest registry, proving the configuration-only onboarding
path requires no UI code changes.

FastAPI's role: **CONTROL_FIXTURE_NOT_FLAGSHIP**. It is a thin semantic
substrate test (3 of 6 required artifacts absent) that proves the
resolver fails closed on missing evidence without fabrication.

---

## 2. Changes

### 2.1 Manifest (created)

`app/execlens-demo/lib/lens-v2/manifests/fastapi.run_02_oss_fastapi_pipeline.json`

Declares:
- **6 required artifacts** — `semantic_topology_model`, `decision_validation`,
  `reproducibility_verdict`, `semantic_continuity_crosswalk`,
  `canonical_topology_40_4`, `dpsig_signal_set`. Three exist on disk; three
  are declared at their conventional paths but absent.
- **6 optional artifacts** — `structural_topology_log_40_3`, `signal_registry`,
  `evidence_trace`, `vault_readiness`, `semantic_bundle_manifest`,
  `rendering_metadata`. All present except `rendering_metadata` (not emitted
  because the writer requires the absent artifacts).
- **4 report-pack HTML files** — all present on disk.
- **6 governance flags** — all `true`.

### 2.2 Registry entry (modified)

`app/execlens-demo/lib/lens-v2/manifests/index.js`

One-line addition to the `REGISTRY` map:

```js
fastapi: {
  run_02_oss_fastapi_pipeline: 'fastapi.run_02_oss_fastapi_pipeline.json',
},
```

### 2.3 Test suite (created)

`app/execlens-demo/flagship-experience/tests/fastapi-onboarding.test.js`

34 tests across 9 suites:
- FastAPI registry registration (3 tests)
- FastAPI manifest schema validation (5 tests)
- FastAPI resolver fail-closed (3 tests)
- FastAPI flagship binding rejection (3 tests)
- BlueEdge preservation (3 tests)
- FastAPI report-pack artifacts (4 tests)
- FastAPI artifact presence/absence (6 tests)
- Writer behaviour (3 tests)
- No client-name branching (4 tests)

---

## 3. Artifact availability

| Artifact category | Count | Status |
|-------------------|-------|--------|
| Required (present) | 3 | `semantic_topology_model`, `canonical_topology_40_4`, `dpsig_signal_set` |
| Required (absent) | 3 | `decision_validation`, `reproducibility_verdict`, `semantic_continuity_crosswalk` |
| Optional (present) | 5 | `structural_topology_log_40_3`, `signal_registry`, `evidence_trace`, `vault_readiness`, `semantic_bundle_manifest` |
| Optional (absent) | 1 | `rendering_metadata` (writer cannot produce it without the 3 absent required artifacts) |
| Report-pack | 4 | All 4 HTML reports present on disk |

---

## 4. Behaviour matrix

| Endpoint / Route | Input | HTTP | Payload |
|------------------|-------|------|---------|
| `/api/lens-payload?client=fastapi&run=run_02_oss_fastapi_pipeline` | Registered pair, missing artifacts | 424 | `REQUIRED_ARTIFACT_MISSING` |
| `/api/lens-payload?client=fastapi&run=nonexistent` | Unregistered run | 404 | `RUN_NOT_ALLOWED` |
| `/lens-v2-flagship?client=fastapi&run=run_02_oss_fastapi_pipeline` | Registered pair, missing artifacts | 502 | `LIVE_BINDING_FAILED` |
| `/api/report-pack?artifact=decision-surface&client=fastapi&run=run_02_oss_fastapi_pipeline` | Report HTML exists | 200 | HTML content |
| `/api/lens-payload?client=blueedge&run=run_blueedge_productized_01_fixed` | BlueEdge (unchanged) | 200 | LIVE payload |
| `/lens-v2-flagship` | Default (BlueEdge) | 200 | LIVE |

---

## 5. What was NOT changed

- No page route source (`pages/lens-v2-flagship.js`)
- No API route source (`pages/api/lens-payload.js`, `pages/api/report-pack.js`)
- No generic resolver modules
- No components, adapters, or validation modules
- No schemas
- No governance documents
- No Lane A / Lane D artifacts

This confirms the configuration-only onboarding path.

---

## 6. Future: when FastAPI artifacts arrive

When the upstream pipeline produces the 3 missing FastAPI artifacts:

1. Place them at the paths declared in the manifest.
2. Run the rendering_metadata writer.
3. The resolver will automatically produce a LIVE payload.
4. No code changes required.

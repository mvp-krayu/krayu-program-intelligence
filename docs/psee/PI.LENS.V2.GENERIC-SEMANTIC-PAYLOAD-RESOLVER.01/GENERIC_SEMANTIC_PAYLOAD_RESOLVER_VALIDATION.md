# PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01 — Validation

**Stream:** PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
**Branch:** work/lens-v2-productization
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Milestone:** lens-v2-live-substrate-v1
**Date:** 2026-05-10

---

## 1. Mandatory validation matrix

| Check                                                              | Result |
|--------------------------------------------------------------------|--------|
| Generic resolver emits same BlueEdge payload semantics             | ✅ PASS |
| BlueEdge wrapper remains compatible (legacy exports preserved)     | ✅ PASS |
| Manifest path safety (traversal rejected, absolute rejected)       | ✅ PASS |
| Missing required artifact fails closed (REQUIRED_ARTIFACT_MISSING) | ✅ PASS |
| Optional missing artifact becomes explicit unresolved gap          | ✅ PASS |
| Missing rendering_metadata classifies as IP placeholder gap         | ✅ PASS |
| Invalid rendering_metadata classifies as IP_RENDERING_METADATA_INVALID gap | ✅ PASS |
| Q-02 governance class preserved on canonical payload                | ✅ PASS |
| IP actor HYDRATED with `inference_prohibition_status = ENFORCED`   | ✅ PASS |
| DPSIG provenance (replay_class, derivation_trace, provenance_chain) preserved | ✅ PASS |
| Report-pack artifact ids preserved                                  | ✅ PASS |
| Governance assertions (6 flags = true) preserved                    | ✅ PASS |
| No source mutation                                                  | ✅ PASS |
| No synthetic telemetry                                              | ✅ PASS |
| No client-name branching in generic modules                         | ✅ PASS |
| No filesystem inference outside manifest-declared paths             | ✅ PASS |
| LensSemanticPayloadSchema validates the payload                     | ✅ PASS |
| ClientRunManifestSchema validates the BlueEdge manifest             | ✅ PASS |
| Adapter pipeline parity (EXECUTIVE_READY_WITH_QUALIFIER, no warnings) | ✅ PASS |
| Existing live-binding suite passes                                  | ✅ 37/37 |
| Existing q02-and-ip suite passes                                    | ✅ 36/36 |
| Existing flagshipExperience suite passes                            | ✅ unchanged |
| Existing flagshipSpinoffSmoke suite passes                          | ✅ unchanged |
| Generic-resolver suite passes                                       | ✅ 33/33 |
| Full execlens-demo regression                                       | ✅ 753/753 |
| `/api/lens-payload` returns 200 for BlueEdge productized run         | ✅ PASS |
| `/api/lens-payload` returns 4xx for unknown client/run               | ✅ PASS |
| `/api/report-pack` returns 200 for allowed artifact                  | ✅ PASS |
| `/lens-v2-flagship` renders Q-02 banner + ENFORCED IP                 | ✅ PASS |
| BlueEdge live binding NOT broken                                    | ✅ PASS |

All 30 mandatory checks PASS.

---

## 2. Schema validation evidence

### 2.1 Manifest

```
$ node -e "
  const { validateClientRunManifest } = require('./app/execlens-demo/lib/lens-v2/generic/ClientRunManifestSchema');
  const m = require('./app/execlens-demo/lib/lens-v2/manifests/blueedge.run_blueedge_productized_01_fixed.json');
  console.log(validateClientRunManifest(m));
"
{ ok: true, errors: [] }
```

### 2.2 Canonical payload

```
$ node -e "
  process.env.REPO_ROOT='...';
  const { resolveBlueEdgePayload } = require('.../BlueEdgePayloadResolver');
  const { validateLensSemanticPayload } = require('.../generic/LensSemanticPayloadSchema');
  const p = resolveBlueEdgePayload('blueedge', 'run_blueedge_productized_01_fixed');
  console.log(validateLensSemanticPayload(p));
"
{ ok: true, errors: [] }
```

---

## 3. BlueEdge parity evidence

### 3.1 Wrapper output ≡ generic output

`flagship-experience/tests/generic-semantic-payload-resolver.test.js`
section "BlueEdge wrapper parity with generic resolver" performs
`assert.deepEqual(stripVolatile(direct), stripVolatile(viaWrapper))`
across the entire payload (excluding `generated_at`/`rendered_at`
timestamps which change between calls). Result: PASS.

### 3.2 Resolver field parity

| Field                                            | Value                                  |
|--------------------------------------------------|----------------------------------------|
| `binding_status`                                 | LIVE                                   |
| `client`                                         | blueedge                               |
| `run_id`                                         | run_blueedge_productized_01_fixed      |
| `baseline_commit`                                | 93098cb                                |
| `qualifier_summary.qualifier_class`              | Q-02                                   |
| `qualifier_summary.qualifier_class_compat`       | Q-01                                   |
| `qualifier_class` (top-level legacy compat)      | Q-01                                   |
| `qualifier_class_governance` (top-level mirror)  | Q-02                                   |
| `actor_registry.inference_prohibition.status`    | HYDRATED                               |
| `actor_registry` count                           | 15                                     |
| Actor distribution                               | HYDRATED 12 / HYDRATED_WITH_DERIVATION 2 / PRESENTATION_LAYER_DERIVED 1 |
| `report_pack.artifacts` ids                       | decision-surface, tier1-evidence, tier1-narrative, tier2-diagnostic |
| `unresolved_gaps` codes                           | STRUCTURAL_TOPOLOGY_LOG_40_3, VAULT_READINESS |
| `governance_assertions.evidence_first`            | true                                   |
| `governance_assertions.no_source_mutation`        | true                                   |
| `governance_assertions.no_synthetic_telemetry`    | true                                   |
| `governance_assertions.no_ai_generation`          | true                                   |
| `governance_assertions.topology_native`           | true                                   |
| `governance_assertions.replay_safe`               | true                                   |

---

## 4. Manifest path safety evidence

| Test                                              | Result |
|---------------------------------------------------|--------|
| Manifest with `..` in declared path               | REJECTED |
| Manifest with absolute path                       | REJECTED |
| Manifest with `governance.lane_a_read_only=false` | REJECTED |
| Manifest missing required artifact key            | REJECTED |
| Loader request to required artifact at non-existent path | REJECTED with `REQUIRED_ARTIFACT_MISSING` |
| Loader request to optional missing artifact       | NON_BLOCKING gap surfaced |
| Loader request to optional missing rendering_metadata | INFERENCE_PROHIBITION_PLACEHOLDER gap surfaced |

---

## 5. No client-name branching evidence

The parity test asserts that the source files for the generic resolver,
generic loader, and manifest schema contain **no occurrences** of any
client name (case-insensitive `blueedge` / `fastapi`). Result: PASS.

| Module                                | Contains 'blueedge'? | Contains 'fastapi'? |
|---------------------------------------|----------------------|---------------------|
| GenericSemanticPayloadResolver.js     | NO                   | NO                  |
| GenericSemanticArtifactLoader.js      | NO                   | NO                  |
| ClientRunManifestSchema.js            | NO                   | NO                  |
| LensSemanticPayloadSchema.js          | NO                   | NO                  |

The legacy `BlueEdgePayloadResolver.js` retains its client name
(by file naming and registry entry) only because of public-API
backward-compat with existing tests and routes. All semantic logic
inside it delegates to the generic modules.

---

## 6. Test execution summary

```
$ REPO_ROOT=/Users/khorrix/Projects/k-pi-core node --test \
    flagship-experience/tests/generic-semantic-payload-resolver.test.js
# tests       33
# suites       7
# pass        33
# fail         0
```

```
$ REPO_ROOT=/Users/khorrix/Projects/k-pi-core node --test \
    flagship-experience/tests/ validation/tests/ adapters/tests/ \
    components/executive-narrative-rendering/tests/ \
    components/experiential-realization/tests/ \
    components/readiness-badge-system/tests/ \
    components/propagation-explainability/tests/ \
    components/core-report-container/tests/
# tests       753
# suites      131
# pass        753
# fail         0
```

---

## 7. Runtime smoke evidence

| Probe                                                        | Result |
|--------------------------------------------------------------|--------|
| `GET /api/lens-payload` (allowed pair) → JSON body has `binding_status: LIVE`, `qualifier_class_governance: Q-02` | 200    |
| `GET /api/lens-payload` (unknown client) → JSON body `error: CLIENT_NOT_ALLOWED` | 404    |
| `GET /api/report-pack` (allowed artifact) → HTML body served  | 200    |
| `GET /lens-v2-flagship` (Playwright @ 1440×900) → banner: `INFERENCE PROHIBITION: ENFORCED · QUALIFIER Q-02` · mandate: `QUALIFIER Q-02 · Partial Grounding · Structural Continuity` | OK     |

Visual evidence: `screenshots/dense_1440x900_generic.png`.

---

## 8. Final verdict

`VALIDATION_COMPLETE`. The productized generic semantic payload
resolver is operational; BlueEdge live binding is preserved without
regression; the Client C onboarding path is configuration-only.

# PI.LENS.V2.FASTAPI-RUNTIME-ONBOARDING.01 — Validation

**Stream:** PI.LENS.V2.FASTAPI-RUNTIME-ONBOARDING.01
**Branch:** work/lens-v2-productization
**Baseline:** 1e46b83
**Date:** 2026-05-10

---

## 1. Mandatory validation matrix

| Check | Result |
|-------|--------|
| FastAPI pair registered in REGISTRY | PASS |
| `isClientRunAllowed('fastapi', 'run_02_oss_fastapi_pipeline')` returns `true` | PASS |
| `listAllowedClientRuns()` includes both BlueEdge and FastAPI | PASS |
| FastAPI manifest passes `ClientRunManifestSchema` validation | PASS |
| FastAPI manifest identity (`client`, `run_id`) matches registry key | PASS |
| FastAPI manifest declares all 6 required artifact keys | PASS |
| FastAPI manifest governance flags all `true` | PASS |
| Resolver returns `ok: false`, `binding_status: REJECTED` for FastAPI | PASS |
| Resolver reports `error: REQUIRED_ARTIFACT_MISSING` (key: `decision_validation`) | PASS |
| No synthetic payload returned on rejection | PASS |
| Flagship binding returns statusCode 502 for FastAPI | PASS |
| Flagship binding returns structured `liveBindingError` with correct kind | PASS |
| Flagship binding identifies client/run correctly on rejection | PASS |
| No propagation chains on rejected binding | PASS |
| BlueEdge default route still returns LIVE binding | PASS |
| BlueEdge Q-02 governance preserved | PASS |
| BlueEdge IP actor still HYDRATED with ENFORCED | PASS |
| FastAPI report-pack HTML files (4) present on disk | PASS |
| FastAPI present required artifacts (3) exist on disk | PASS |
| FastAPI absent required artifacts (3) correctly missing | PASS |
| Writer accepts FastAPI as known client (registry check passes) | PASS |
| Writer throws SOURCE_ARTIFACT_MISSING for FastAPI (substrate incomplete) | PASS |
| BlueEdge writer replay-safety preserved after FastAPI registration | PASS |
| No client-name branching ("fastapi") in generic modules (4 files) | PASS |
| `fastapi-onboarding.test.js`: 34/34 | PASS |
| `runtime-parameterization.test.js`: 23/23 (unchanged) | PASS |
| `live-binding.test.js`: 37/37 (unchanged) | PASS |
| `q02-and-ip.test.js`: 36/36 (unchanged) | PASS |
| `generic-semantic-payload-resolver.test.js`: 33/33 (unchanged) | PASS |
| Full execlens-demo regression: 810/810 | PASS |

All 30 mandatory checks PASS.

---

## 2. URL behaviour evidence

```
$ curl -s -o /dev/null -w "%{http_code}\n" \
    "http://localhost:3002/api/lens-payload?client=fastapi&run=run_02_oss_fastapi_pipeline"
424

$ curl -s "http://localhost:3002/api/lens-payload?client=fastapi&run=run_02_oss_fastapi_pipeline" | python3 -m json.tool
{
    "error": "REQUIRED_ARTIFACT_MISSING",
    "detail": {
        "key": "decision_validation",
        "path": "clients/fastapi/.../semantic/decision/decision_validation.json",
        "reason": "MISSING"
    }
}

$ curl -s -o /dev/null -w "%{http_code}\n" \
    "http://localhost:3002/api/lens-payload?client=fastapi&run=nonexistent"
404

$ curl -s -o /dev/null -w "%{http_code}\n" \
    "http://localhost:3002/lens-v2-flagship?client=fastapi&run=run_02_oss_fastapi_pipeline"
502

$ curl -s -o /dev/null -w "%{http_code}\n" \
    "http://localhost:3002/api/report-pack?artifact=decision-surface&client=fastapi&run=run_02_oss_fastapi_pipeline"
200

$ curl -s -o /dev/null -w "%{http_code}\n" \
    "http://localhost:3002/api/lens-payload?client=blueedge&run=run_blueedge_productized_01_fixed"
200

$ curl -s -o /dev/null -w "%{http_code}\n" \
    "http://localhost:3002/lens-v2-flagship"
200
```

---

## 3. Resolver rejection evidence

```
$ REPO_ROOT=$(pwd) node -e "
const { resolveBlueEdgePayload } = require('./app/execlens-demo/lib/lens-v2/BlueEdgePayloadResolver');
const r = resolveBlueEdgePayload('fastapi', 'run_02_oss_fastapi_pipeline');
console.log('ok:', r.ok, '| binding_status:', r.binding_status, '| error:', r.error);
console.log('missing:', JSON.stringify(r.missing));
"
ok: false | binding_status: REJECTED | error: REQUIRED_ARTIFACT_MISSING
missing: {"key":"decision_validation","path":"clients/fastapi/.../decision_validation.json","reason":"MISSING"}
```

---

## 4. Writer behaviour evidence

Writer passes registry check but fails on missing substrate:

```
$ REPO_ROOT=$(pwd) node scripts/pios/.../emit_rendering_metadata.js \
    --client fastapi --run run_02_oss_fastapi_pipeline --dry-run
Error: SOURCE_ARTIFACT_MISSING:.../semantic/decision/decision_validation.json
(exit 1)
```

BlueEdge replay-safety preserved:

```
$ REPO_ROOT=$(pwd) node scripts/pios/.../emit_rendering_metadata.js \
    --client blueedge --run run_blueedge_productized_01_fixed --dry-run > /dev/null
(exit 0)
```

---

## 5. Test execution summary

```
$ REPO_ROOT=$(pwd) node --test \
    flagship-experience/tests/fastapi-onboarding.test.js
# tests       34
# suites       9
# pass        34
# fail         0
```

```
$ REPO_ROOT=$(pwd) node --test \
    flagship-experience/tests/ validation/tests/ adapters/tests/ \
    components/*/tests/
# tests       810
# suites      147
# pass        810
# fail         0
```

---

## 6. Configuration-only onboarding proof

Total changes to existing code: **1 file modified** (manifests/index.js —
3 lines added to REGISTRY map).

Total new code: **1 manifest JSON** (configuration, not code).

No page routes, API routes, components, adapters, resolvers, schemas,
or governance documents were modified. This proves that the
configuration-only onboarding path established by
PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01 works
as designed.

---

## 7. Final verdict

`VALIDATION_COMPLETE`. FastAPI is onboarded via configuration only. The
resolver honestly rejects the binding due to missing required artifacts.
BlueEdge is unaffected. Full regression is 810/810 PASS.

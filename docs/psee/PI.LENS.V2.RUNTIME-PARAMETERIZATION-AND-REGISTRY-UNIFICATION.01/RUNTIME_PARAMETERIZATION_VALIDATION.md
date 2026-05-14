# PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01 — Validation

**Stream:** PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01
**Branch:** work/lens-v2-productization
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Milestone:** lens-v2-live-substrate-v1
**Date:** 2026-05-10

---

## 1. Mandatory validation matrix

| Check                                                                                  | Result |
|----------------------------------------------------------------------------------------|--------|
| Default route `/lens-v2-flagship` resolves BlueEdge productized run                    | ✅ PASS |
| Explicit query `?client=blueedge&run=run_blueedge_productized_01_fixed` resolves       | ✅ PASS |
| Default route and explicit query produce structurally equivalent payloads              | ✅ PASS |
| Unknown client/run fails closed with 404 + `CLIENT_RUN_NOT_ALLOWED`                     | ✅ PASS |
| Malformed param (traversal / overlength) fails closed with 400 + `INVALID_PARAM`        | ✅ PASS |
| No fixture / synthetic fallback on failure                                              | ✅ PASS |
| Q-02 governance class preserved                                                         | ✅ PASS |
| IP actor `HYDRATED` with `inference_prohibition_status = ENFORCED`                      | ✅ PASS |
| DPSIG provenance preserved                                                              | ✅ PASS |
| Generic resolver parity preserved (deepEqual under volatile-strip)                      | ✅ PASS |
| Manifest registry exposes contract-named API (`isClientRunAllowed` etc.)                | ✅ PASS |
| `rendering_metadata` writer no longer declares literal allow-list Sets                   | ✅ PASS |
| Writer derives allow-list via `listAllowedClientRuns()`                                  | ✅ PASS |
| Writer rejects unknown client/run (exit 64)                                             | ✅ PASS |
| Writer remains byte-identical (replay-safe) under registry-driven allow-list           | ✅ PASS |
| Runtime registry and writer registry agree on allowed pairs                             | ✅ PASS |
| Generic modules contain no client-name literals (in code, ignoring doc comments)        | ✅ PASS |
| Existing live-binding suite passes unchanged                                            | ✅ 37/37 |
| Existing q02-and-ip suite passes unchanged                                              | ✅ 36/36 |
| Existing generic-semantic-payload-resolver suite passes unchanged                       | ✅ 33/33 |
| New runtime-parameterization suite passes                                                | ✅ 23/23 |
| Full execlens-demo regression passes                                                    | ✅ 776/776 |
| `/api/lens-payload` continues to return BlueEdge LIVE payload                           | ✅ PASS |
| `/api/report-pack` continues to return BlueEdge report HTML                             | ✅ PASS |
| BlueEdge live binding NOT broken                                                         | ✅ PASS |

All 25 mandatory checks PASS.

---

## 2. URL behaviour evidence

```
$ curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3002/lens-v2-flagship"
200
$ curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3002/lens-v2-flagship?client=blueedge&run=run_blueedge_productized_01_fixed"
200
$ curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3002/lens-v2-flagship?client=unknown&run=unknown"
404
$ curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3002/lens-v2-flagship?client=..&run=run_blueedge_productized_01_fixed"
400
$ curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3002/lens-v2-flagship?client=blueedge&run=run_does_not_exist"
404
```

The `LIVE_BINDING_FAILED` visible state on the unknown-pair URL is
captured in `screenshots/unknown_pair_failclose.png` (page title:
"LENS v2 — Live binding failure"). No fixture data; no synthetic
semantics.

---

## 3. Default vs explicit-query parity evidence

The new test
`flagship-experience/tests/runtime-parameterization.test.js`
suite "resolveFlagshipBinding — explicit BlueEdge query" performs
`assert.deepEqual(stripVolatile(default.props.livePayload), stripVolatile(explicit.props.livePayload))`.
Result: PASS.

Volatile fields stripped: `generated_at`, `rendered_at`,
`module_registry.entries[*].registered_at`,
`header_block.report_metadata.generated_at`.

---

## 4. Generic resolver parity evidence

The new suite also performs
`assert.deepEqual(stripVolatile(default.props.livePayload), stripVolatile(resolveBlueEdgePayload(CLIENT, RUN)))`.
The page surface payload matches the direct generic-resolver call.
Result: PASS.

---

## 5. Writer replay-safety evidence

```
$ cp .../vault/rendering_metadata.json /tmp/rm_pre_unify.json
$ REPO_ROOT=$(pwd) node scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js \
    --client blueedge --run run_blueedge_productized_01_fixed
WROTE:clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault/rendering_metadata.json
HASH:sha256:869d49549f8fd894d378d38112c1cf7a421f932997e4b4c7bca314bb5a2718a4
CLASS:Q-02
$ diff /tmp/rm_pre_unify.json .../vault/rendering_metadata.json
$ echo $?
0
```

Hash and content unchanged after the registry-driven allow-list refactor.

---

## 6. Authority gating evidence

Writer rejection of an unknown client (exit 64):

```
$ node scripts/pios/.../emit_rendering_metadata.js --client not_a_client --run run_blueedge_productized_01_fixed --dry-run
CLIENT_NOT_ALLOWED: not_a_client
$ echo $?
64
```

Writer rejection of an unknown run on a known client (exit 64):

```
$ node scripts/pios/.../emit_rendering_metadata.js --client blueedge --run run_does_not_exist --dry-run
RUN_NOT_ALLOWED: blueedge / run_does_not_exist
$ echo $?
64
```

Both are gated by `isClientRunAllowed` from the manifest registry —
the same function consulted by the page.

---

## 7. Test execution summary

```
$ REPO_ROOT=$(pwd) node --test \
    flagship-experience/tests/runtime-parameterization.test.js
# tests       23
# suites       7
# pass        23
# fail         0
```

```
$ REPO_ROOT=$(pwd) node --test \
    flagship-experience/tests/ validation/tests/ adapters/tests/ \
    components/executive-narrative-rendering/tests/ \
    components/experiential-realization/tests/ \
    components/readiness-badge-system/tests/ \
    components/propagation-explainability/tests/ \
    components/core-report-container/tests/
# tests       776
# suites      138
# pass        776
# fail         0
```

---

## 8. Visual evidence

| File                                                                                   | What it shows                                                                                  |
|----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| `screenshots/default_route.png`                                                        | `/lens-v2-flagship` default → LIVE BlueEdge productized binding, Q-02 + ENFORCED IP visible    |
| `screenshots/explicit_blueedge_query.png`                                              | `?client=blueedge&run=run_blueedge_productized_01_fixed` → identical surface to default        |
| `screenshots/unknown_pair_failclose.png`                                               | `?client=unknown&run=unknown` → LIVE_BINDING_FAILED visible state; no synthetic data           |

---

## 9. Final verdict

`VALIDATION_COMPLETE`. The runtime is parameterised, the rendering_metadata
writer's allow-list is unified with the runtime manifest registry, the
default and explicit BlueEdge URLs render identical payloads, unknown
pairs fail closed, and the full execlens-demo regression is 776/776 PASS.

# PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01 — Implementation

**Stream:** PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01
**Branch:** work/lens-v2-productization
**Authoritative upstream:** PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
**Baseline (governance):** governed-dpsig-baseline-v1 (93098cb)
**Milestone (LENS):** lens-v2-live-substrate-v1
**Date:** 2026-05-10

---

## 1. Purpose

Complete the configuration-only Client C onboarding path by:

1. Parameterising `pages/lens-v2-flagship.js` so the route accepts
   `?client=<id>&run=<id>` query parameters and resolves them via the
   manifest registry (single source of truth).
2. Aligning the `rendering_metadata` writer's allow-list with the
   manifest registry, removing its previously independent literal
   allow-list.

After this stream, adding a new certified client/run requires only
manifest authoring + a registry entry. Page code, API routes, writer
script, generic resolver, and tests all consume the same registry.

---

## 2. Architecture

```
        ?client / ?run query                  pages/lens-v2-flagship.js
              │                                        │
              ▼                                        ▼
      ┌───────────────────────────┐         ┌───────────────────────────┐
      │  flagshipBinding          │◀────────│  getServerSideProps        │
      │  resolveFlagshipBinding   │         │  delegates to              │
      │  paramSafe + statusCode   │         │  flagshipBinding           │
      └───────────────────────────┘         └───────────────────────────┘
              │                                        ▲
              │ isClientRunAllowed                     │ props (livePayload, …)
              ▼                                        │
      ┌───────────────────────────┐                    │
      │  manifests/index.js       │ ──┬───────────────┘
      │  registry (allow-list)    │   │
      │   ├ isClientRunAllowed    │   │
      │   ├ listAllowedClientRuns │   │
      │   └ resolveClientRunMani… │   │
      └───────────────────────────┘   │
              ▲   ▲                    │
              │   │                    │
   ┌──────────┘   └────────────┐      │
   │                           │      │
/api/lens-payload     scripts/pios/.../emit_rendering_metadata.js
/api/report-pack      (writer's allow-list now sourced from registry)
```

Single source of truth: the manifest registry. Every consumer
(`/api/lens-payload`, `/api/report-pack`, the page route, the
rendering_metadata writer) is gated by the same `isClientRunAllowed`
function and the same set of registered manifest pairs.

---

## 3. Components delivered

### 3.1 Manifest registry — contract-named API

`app/execlens-demo/lib/lens-v2/manifests/index.js`

Added contract-named aliases (existing helpers preserved):

- `listAllowedClientRuns()` — alias of `listKnownPairs()`
- `isClientRunAllowed(client, runId)` — alias of `isAllowedPair(...)`
- `resolveClientRunManifest(client, runId)` — alias of `loadManifest(...)`

### 3.2 Flagship binding module

`app/execlens-demo/lib/lens-v2/flagshipBinding.js` (new)

Exports `resolveFlagshipBinding({ query, res })` which:

- reads `client` / `run` from the query (defaults: BlueEdge productized
  run);
- enforces param-safety (`/^[A-Za-z0-9_\-]+$/`, `<= 200` chars, no `..`);
- gates via `isClientRunAllowed` (single source of truth);
- delegates resolution to `BlueEdgePayloadResolver` (which delegates to
  the generic resolver);
- sets the appropriate HTTP status code on failure
  (400 INVALID_PARAM / 404 CLIENT_RUN_NOT_ALLOWED / 502 PAYLOAD_NULL or
  PAYLOAD_NOT_OK);
- returns `{ props, statusCode }`.

The page's `getServerSideProps` is now a thin wrapper that delegates to
`resolveFlagshipBinding` and returns only `{ props }` (per Next.js's
contract).

### 3.3 Page parameterization

`app/execlens-demo/pages/lens-v2-flagship.js`

- Removed `LIVE_BINDING_CLIENT` / `LIVE_BINDING_RUN` constants.
- `DEFAULT_BINDING_CLIENT` / `DEFAULT_BINDING_RUN` retained as
  page-level defaults referenced when no query parameters are present.
- `getServerSideProps(context)` reads `context.query` and delegates to
  `resolveFlagshipBinding`; passes `bindingClient` / `bindingRun` props
  through to the page component.
- Live banner now displays the resolved client/run dynamically:
  `LIVE SUBSTRATE · <client> · <run> · baseline <commit> · INFERENCE
  PROHIBITION: ENFORCED · QUALIFIER Q-02`.
- Report-pack registry built per render via `buildReportPackRegistry(client, run)`
  so URLs reflect the active pair.

### 3.4 Rendering metadata writer alignment

`scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js`

- Removed literal `new Set(['blueedge'])` and `{ blueedge: new Set([...]) }`
  declarations.
- The writer now imports the manifest registry directly:

```js
const { isClientRunAllowed, listAllowedClientRuns } = require(path.join(manifestsDir));
```

- `ALLOWED_CLIENTS` / `ALLOWED_RUNS` exports preserved for any
  downstream consumer, but **derived** from the registry rather than
  declared as literals.
- The runtime gating check now uses `isClientRunAllowed`; the writer
  still emits CLIENT_NOT_ALLOWED / RUN_NOT_ALLOWED on stderr to
  preserve its existing CLI behaviour.

### 3.5 Tests

`app/execlens-demo/flagship-experience/tests/runtime-parameterization.test.js`
(new, 23 cases) covering:

- registry contract-named API mirrors legacy helpers;
- default route resolves BlueEdge with `binding_status: LIVE`,
  Q-02 governance, IP HYDRATED + ENFORCED;
- explicit BlueEdge query is structurally equivalent to default
  (volatile timestamps stripped);
- unknown client/run → 404 + `CLIENT_RUN_NOT_ALLOWED`;
- malformed param (traversal / overlong) → 400 + `INVALID_PARAM`;
- no synthetic / fixture fallback;
- writer source uses `listAllowedClientRuns()` (not literal Sets);
- writer rejects unknown clients/runs (exit 64);
- writer remains byte-identical (replay-safe) under the registry-driven
  allow-list;
- runtime registry and writer registry agree on the canonical pair;
- generic-resolver parity preserved under parameterization;
- generic modules contain no client-name literals (in code, ignoring
  doc comments).

---

## 4. URLs

| URL                                                                              | Behaviour                                                          | HTTP |
|----------------------------------------------------------------------------------|--------------------------------------------------------------------|------|
| `/lens-v2-flagship`                                                              | LIVE BlueEdge productized binding (default)                        | 200  |
| `/lens-v2-flagship?client=blueedge&run=run_blueedge_productized_01_fixed`        | LIVE BlueEdge productized binding (explicit, identical to default) | 200  |
| `/lens-v2-flagship?client=unknown&run=unknown`                                    | LIVE_BINDING_FAILED visible state (`CLIENT_RUN_NOT_ALLOWED`)        | 404  |
| `/lens-v2-flagship?client=..&run=run_blueedge_productized_01_fixed`              | LIVE_BINDING_FAILED visible state (`INVALID_PARAM`)                 | 400  |
| `/lens-v2-flagship?client=blueedge&run=run_does_not_exist`                       | LIVE_BINDING_FAILED visible state (`CLIENT_RUN_NOT_ALLOWED`)        | 404  |

---

## 5. Governance preservation

- BlueEdge live binding is preserved verbatim. Default route and
  explicit-query route deepEqual (volatile timestamps stripped).
- Q-02 governance class preserved
  (`qualifier_summary.qualifier_class = Q-02`; legacy compat
  top-level `qualifier_class = Q-01`).
- IP actor remains `HYDRATED` with
  `inference_prohibition_status = ENFORCED`.
- DPSIG TAXONOMY-01 fields preserved.
- No fixture fallback; no synthetic semantics.
- No new AI calls, prompt UX, chatbot UX, animated propagation.
- No client-name branching in generic modules.
- Manifest registry is the single source of truth for runtime AND the
  writer.
- `rendering_metadata.json` byte-identical re-emission verified.

---

## 6. Visual evidence (Playwright, 1440×900)

- `screenshots/explicit_blueedge_query.png` — explicit
  `?client=blueedge&run=...` URL with the dynamic live banner.
- `screenshots/default_route.png` — default `/lens-v2-flagship` URL.
- `screenshots/unknown_pair_failclose.png` — fail-closed surface
  (`LIVE_BINDING_FAILED` title, no synthetic semantics).

Both LIVE views show:

```
LIVE SUBSTRATE · blueedge · run_blueedge_productized_01_fixed · baseline 93098cb
  · INFERENCE PROHIBITION: ENFORCED · QUALIFIER Q-02
QUALIFIER Q-02 · Partial Grounding · Structural Continuity
```

---

## 7. Files added / modified

### Added (5 files + screenshots)

- `app/execlens-demo/lib/lens-v2/flagshipBinding.js`
- `app/execlens-demo/flagship-experience/tests/runtime-parameterization.test.js`
- `docs/psee/PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01/RUNTIME_PARAMETERIZATION_IMPLEMENTATION.md`
- `docs/psee/PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01/RUNTIME_PARAMETERIZATION_VALIDATION.md`
- `docs/psee/PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01/client_c_runtime_onboarding_checklist.md`
- `docs/psee/PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01/screenshots/{default_route,explicit_blueedge_query,unknown_pair_failclose}.png`

### Modified (3 files)

- `app/execlens-demo/lib/lens-v2/manifests/index.js` — added
  contract-named aliases.
- `app/execlens-demo/pages/lens-v2-flagship.js` — query-parameterised
  via the shared `flagshipBinding` module.
- `scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js`
  — allow-list sourced from the manifest registry.

### Untouched

- All generic resolver modules under `lib/lens-v2/generic/`.
- All adapters / validation / component modules.
- All API route source files (`pages/api/lens-payload.js`,
  `pages/api/report-pack.js`).
- Q-02 governance amendment + rendering_metadata schema.
- `app/gauge-product`, FastAPI artifacts, BlueEdge source artifacts.

---

## 8. Test summary

| Suite                                                              | Tests | Result |
|--------------------------------------------------------------------|-------|--------|
| `runtime-parameterization.test.js` (new)                           | 23    | PASS   |
| `generic-semantic-payload-resolver.test.js` (unchanged)            | 33    | PASS   |
| `live-binding.test.js` (unchanged)                                 | 37    | PASS   |
| `q02-and-ip.test.js` (unchanged)                                   | 36    | PASS   |
| Aggregate execlens-demo regression                                 | 776   | PASS   |
| HTTP smoke `/lens-v2-flagship` default → 200                        | —     | PASS   |
| HTTP smoke explicit BlueEdge query → 200                            | —     | PASS   |
| HTTP smoke unknown pair → 404                                       | —     | PASS   |
| HTTP smoke malformed param → 400                                    | —     | PASS   |
| Writer replay-safe re-emission (byte-identical diff)                | —     | PASS   |

---

## 9. Verdict

The runtime parameterization is operational. The rendering_metadata
writer's allow-list is now sourced from the manifest registry. The
Client C runtime onboarding path is configuration-only — see
`client_c_runtime_onboarding_checklist.md`.

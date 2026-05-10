# Client C Runtime Onboarding Checklist

**Stream:** PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01
**Authoritative upstream:** PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
**Date:** 2026-05-10

This is the runtime-side onboarding checklist for a future Client C.
After completing it, `/lens-v2-flagship?client=<client>&run=<run>`
renders Client C's certified live payload with no UI code changes.

The complementary upstream playbook is `client_c_onboarding_model.md`
under `PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01`.

---

## 1. Add the manifest JSON

Author a new manifest at:

```
app/execlens-demo/lib/lens-v2/manifests/<client>.<run>.json
```

It MUST validate against
`docs/governance/runtime/client_run_manifest.schema.json`. Declare
all artifact paths (required + optional + report-pack), the
`baseline.{governance_tag, pipeline_commit}`, and the six governance
flags (all `true`).

---

## 2. Add a manifest registry entry

Append a single line to:

```
app/execlens-demo/lib/lens-v2/manifests/index.js
```

```js
const REGISTRY = {
  blueedge: { run_blueedge_productized_01_fixed: 'blueedge.run_blueedge_productized_01_fixed.json' },
  client_c: { run_client_c_certified_01:        'client_c.run_client_c_certified_01.json' },
};
```

This entry is the **single source of truth** consumed by:

- `pages/lens-v2-flagship.js` — `resolveFlagshipBinding` gates
  `?client=<>&run=<>` via `isClientRunAllowed`.
- `pages/api/lens-payload.js` — gated via the same registry.
- `pages/api/report-pack.js` — gated via the same registry.
- `scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js`
  — derives its `ALLOWED_CLIENTS` / `ALLOWED_RUNS` from the registry.

There is no other allow-list to update.

---

## 3. Emit rendering_metadata through the shared registry

When the upstream pipeline run completes for Client C, emit the
governance-true rendering metadata into the run vault:

```
REPO_ROOT=$(pwd) node \
  scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js \
  --client client_c \
  --run    run_client_c_certified_01
```

The writer no longer has its own allow-list; it consults the manifest
registry directly. The pair must already be registered (step 2) for
the writer to accept it.

The output is placed at the path declared in the manifest's
`artifacts.optional.rendering_metadata`. The writer is replay-safe
(byte-identical re-run) and additive-only (never mutates prior
artifacts).

---

## 4. Verify `/api/lens-payload`

```
curl -s -o /dev/null -w "%{http_code}\n" \
  "http://localhost:3002/api/lens-payload?client=client_c&run=run_client_c_certified_01"
# expect 200
```

The JSON body must include:

- `binding_status: LIVE`
- `payload_version: '1.0'`
- `qualifier_summary.qualifier_class` ∈ {Q-01, Q-02, Q-03, Q-04} (per
  `docs/governance/Q02_GOVERNANCE_AMENDMENT.md`)
- `actor_registry` with 15 entries
- `governance_assertions` with all six flags `true`
- `source_artifacts.rendering_metadata.{ok, valid}` both `true` (when
  vault metadata was emitted)

Negative cases (must fail closed):

```
curl -s -o /dev/null -w "%{http_code}\n" \
  "http://localhost:3002/api/lens-payload?client=client_c&run=run_does_not_exist"
# expect 404 (RUN_NOT_ALLOWED)
```

---

## 5. Verify `/lens-v2-flagship?client=<client>&run=<run>`

```
http://localhost:3002/lens-v2-flagship?client=client_c&run=run_client_c_certified_01
```

Expected behaviour:

- Page title: `LENS v2 — Executive Intelligence`.
- Live banner: `LIVE SUBSTRATE · client_c · run_client_c_certified_01
  · baseline <commit> · INFERENCE PROHIBITION: ENFORCED · QUALIFIER
  Q-XX` (Q-XX per the actual qualifier).
- Qualifier mandate: contract-mandated executive language (no
  probabilistic / AI-confidence wording).

Negative cases (fail closed):

- `/lens-v2-flagship?client=client_c&run=unregistered_run`
  → HTTP 404, page title `LENS v2 — Live binding failure`,
  `LIVE_BINDING_FAILED` visible state.
- `/lens-v2-flagship?client=..&run=anything`
  → HTTP 400, `INVALID_PARAM` visible state.

---

## 6. No UI code changes required

For a Client C onboarding that follows steps 1–5:

- **No** changes to `pages/lens-v2-flagship.js`.
- **No** changes to `pages/api/lens-payload.js`.
- **No** changes to `pages/api/report-pack.js`.
- **No** changes to the generic resolver / loader / schemas.
- **No** changes to the rendering_metadata writer.
- **No** changes to any component, adapter, or validation module.

The only edits are the new manifest JSON (step 1) and the registry
entry (step 2).

---

## 7. Verification sequence

Run the existing parity + parameterization test suites — they
structurally validate any registered manifest:

```
REPO_ROOT=$(pwd) node --test \
  app/execlens-demo/flagship-experience/tests/generic-semantic-payload-resolver.test.js \
  app/execlens-demo/flagship-experience/tests/runtime-parameterization.test.js
```

For Client C, additionally:

```
REPO_ROOT=$(pwd) node \
  scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js \
  --client client_c --run run_client_c_certified_01 --dry-run
```

If the dry-run succeeds, the writer agrees with the runtime registry.

Finally, capture a Playwright screenshot at 1440×900 of
`/lens-v2-flagship?client=client_c&run=run_client_c_certified_01` and
attach it to the Client C onboarding ticket.

---

## 8. Failure modes (fail closed)

| Failure                                                                | Status | Visible state                            |
|------------------------------------------------------------------------|--------|------------------------------------------|
| Pair not in registry                                                   | 404    | LIVE_BINDING_FAILED · CLIENT_RUN_NOT_ALLOWED |
| Manifest invalid                                                       | 502    | LIVE_BINDING_FAILED · MANIFEST_INVALID   |
| Required artifact missing                                              | 502    | LIVE_BINDING_FAILED · REQUIRED_ARTIFACT_MISSING |
| Optional artifact missing                                              | 200    | LIVE; explicit `unresolved_gaps` entry   |
| `rendering_metadata` absent                                            | 200    | LIVE; IP `PLACEHOLDER_BINDING_PENDING`; banner shows `INFERENCE PROHIBITION: BINDING PENDING` |
| `rendering_metadata` invalid                                           | 200    | LIVE; IP `PLACEHOLDER_BINDING_PENDING`; banner shows `INFERENCE PROHIBITION: BINDING PENDING`; `unresolved_gaps` entry `IP_RENDERING_METADATA_INVALID` |
| Param malformed (`..`, overlong, non-alphanumeric)                     | 400    | LIVE_BINDING_FAILED · INVALID_PARAM      |

There is no fixture fallback. There is no synthetic recovery. There is
no AI inference filling in the gap.

---

## 9. Summary

Onboarding Client C at the runtime level is now bounded to:

1. Author the manifest JSON.
2. Add one registry line.
3. Emit rendering metadata via the shared script.
4. Verify the API endpoints.
5. Verify the page URL.

No UI code changes. No allow-list updates outside the registry. No
schema edits. No bespoke engineering.

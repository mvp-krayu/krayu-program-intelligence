# PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01 — Implementation

**Stream:** PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
**Branch:** work/lens-v2-productization
**Baseline (governance):** governed-dpsig-baseline-v1 (93098cb)
**Milestone (LENS):** lens-v2-live-substrate-v1
**Date:** 2026-05-10

---

## 1. Purpose

Productize the BlueEdge live binding into a generic, manifest-driven,
client/run-agnostic semantic payload resolver. After this stream:

- A new certified client/run requires **configuration + certified
  artifacts + validation** — not bespoke UI engineering.
- The runtime route `/lens-v2-flagship`, the `/api/lens-payload`
  endpoint, and the `/api/report-pack` endpoint are unchanged in
  external behaviour.
- The four-class qualifier governance (`Q02_GOVERNANCE_AMENDMENT.md`)
  and IP actor hydration via `rendering_metadata.json` are preserved.

---

## 2. Architecture

```
                       ┌─────────────────────────────────────────┐
                       │     ClientRunManifest (governed JSON)     │
                       │  docs/governance/runtime/                  │
                       │   client_run_manifest.schema.json         │
                       └─────────────────────────────────────────┘
                                          │  validate
                                          ▼
   ┌───────────────────────────────────────────────────────────────┐
   │   manifests/<client>.<run>.json   (allow-listed by registry)  │
   └───────────────────────────────────────────────────────────────┘
                                          │  loadManifest()
                                          ▼
   ┌───────────────────────────────────────────────────────────────┐
   │     GenericSemanticArtifactLoader                             │
   │     (manifest-declared paths only; no inference; traversal     │
   │      protection; required→fail-closed; optional→gap)          │
   └───────────────────────────────────────────────────────────────┘
                                          │  loadArtifacts()
                                          ▼
   ┌───────────────────────────────────────────────────────────────┐
   │  GenericSemanticPayloadResolver                               │
   │  ├─ projectDPSIGSignalSet (TAXONOMY-01 preserved)              │
   │  ├─ projectPSIGSignals (optional)                             │
   │  ├─ buildCrosswalkIndex / resolveDisplayLabel                  │
   │  ├─ validateRenderingMetadata                                 │
   │  ├─ QClassResolver (Q02-RES-RULE-01)                           │
   │  └─ GenericActorHydrator (15 actors)                          │
   └───────────────────────────────────────────────────────────────┘
                                          │  resolveSemanticPayload()
                                          ▼
   ┌───────────────────────────────────────────────────────────────┐
   │  Canonical lens_semantic_payload                              │
   │  docs/governance/runtime/lens_semantic_payload.schema.json     │
   └───────────────────────────────────────────────────────────────┘
                                          │
                ┌─────────────────────────┴──────────────────────┐
                ▼                                                ▼
   /api/lens-payload, /api/report-pack             pages/lens-v2-flagship.js
   (BlueEdge wrapper retained for compat)         (existing UI; unchanged)
```

The legacy `BlueEdgePayloadResolver.js` remains the public API; it now
delegates to the generic resolver while preserving its old exports
(`buildPaths`, `validateClientRun`, `resolveBlueEdgePayload`,
`ALLOWED_CLIENTS`, `ALLOWED_RUNS`).

---

## 3. Manifest-driven resolution model

### 3.1 Schema

`docs/governance/runtime/client_run_manifest.schema.json` (LOCKED)

Required top-level fields:

- `manifest_version` (semver-style)
- `client`, `run_id`
- `stream_anchor`, `amendment_anchor` (optional)
- `baseline.governance_tag`, `baseline.pipeline_commit`
- `artifacts.required` (map id → repo-relative path)
- `artifacts.optional` (map id → repo-relative path)
- `report_pack` (map artifact id → repo-relative path)
- `governance` (must declare `lane_a_read_only`, `lane_d_dpsig_read_only`,
  `additive_only` all `true`)

Required artifact ids the resolver expects (map keys):

- `semantic_topology_model`
- `decision_validation`
- `reproducibility_verdict`
- `semantic_continuity_crosswalk`
- `canonical_topology_40_4`
- `dpsig_signal_set`

Optional artifact ids the resolver consumes when present:

- `structural_topology_log_40_3`
- `signal_registry`
- `evidence_trace`
- `vault_readiness`
- `semantic_bundle_manifest`
- `rendering_metadata` (Q02 amendment)

### 3.2 Path safety

The wire schema rejects path traversal (`..`), absolute paths, and
empty strings. The Node loader (`SemanticArtifactLoader`) anchors all
reads to `REPO_ROOT` and rejects any path that resolves outside it.
There is **no** filesystem inference in the resolver — only declared
paths.

### 3.3 Allow-list registry

`app/execlens-demo/lib/lens-v2/manifests/index.js`

```js
const REGISTRY = {
  blueedge: {
    run_blueedge_productized_01_fixed: 'blueedge.run_blueedge_productized_01_fixed.json',
  },
};
```

Adding a new client/run is a single registry entry plus a manifest
file. There is no client-name branching in the resolver code.

The registry resolves manifest paths in a webpack-safe manner: it
prefers `__dirname`-relative when available (Node tests, scripts), then
falls back to `<REPO_ROOT>/app/execlens-demo/lib/lens-v2/manifests/`
when running inside the Next.js bundled API routes.

---

## 4. Generic resolver flow

`GenericSemanticPayloadResolver.resolveSemanticPayload(manifest)`:

1. `loadArtifacts(manifest)` — required ones must succeed; missing
   required → `binding_status: REJECTED`.
2. Validate `rendering_metadata.json` (when present) via
   `RenderingMetadataSchema`.
3. Project `dpsig_signal_set` and `signal_registry` (optional) via the
   reusable mappers.
4. Build the crosswalk index (DOM-XX → business label).
5. Hydrate the 15 LENS V2 actors via `GenericActorHydrator` (which
   re-exports the existing client-agnostic
   `SemanticActorHydrator.hydrateActors`).
6. Compute the qualifier via `QClassResolver` (Q02-RES-RULE-01) and
   emit both:
   - `qualifier_summary.qualifier_class` — governance class (Q-02 for
     BlueEdge)
   - `qualifier_class` (top-level) — legacy compat (Q-01 for BlueEdge)
7. Construct fixture-compat fields (`evidence_blocks`, `header_block`,
   `narrative_block`, `trace_block`, `rendering_metadata`, etc.) so the
   existing `flagshipOrchestration` adapter consumes the payload
   without modification.
8. Emit the canonical payload, validated against
   `LensSemanticPayloadSchema`.

The resolver:

- **MUST NOT** branch on client name.
- **MUST NOT** infer missing semantics.
- **MUST NOT** generate narrative outside the deterministic templates
  composed from substrate fields.
- **MUST NOT** mutate any source artifact.

---

## 5. Actor hydration model

| Code | Actor                     | Status (BlueEdge productized run)        |
|------|---------------------------|------------------------------------------|
| DP   | Decision Posture          | HYDRATED                                 |
| CB   | Confidence Boundary       | HYDRATED_WITH_DERIVATION                 |
| PA   | Pressure Anchor           | HYDRATED                                 |
| PP   | Propagation Path          | HYDRATED                                 |
| AL   | Absorption Load           | HYDRATED                                 |
| RE   | Receiver Exposure         | HYDRATED                                 |
| ST   | Semantic Topology         | HYDRATED                                 |
| SB   | Structural Backing        | HYDRATED                                 |
| SO   | Semantic-Only Exposure    | HYDRATED                                 |
| CC   | Cluster Concentration     | HYDRATED                                 |
| SS   | Signal Stack              | HYDRATED                                 |
| ET   | Evidence Trace            | HYDRATED                                 |
| RB   | Resolution Boundary       | HYDRATED_WITH_DERIVATION                 |
| IP   | Inference Prohibition     | HYDRATED (rendering_metadata present)    |
| RA   | Report Artifact Access    | PRESENTATION_LAYER_DERIVED               |

When `rendering_metadata` is absent or invalid, IP transitions to
`PLACEHOLDER_BINDING_PENDING` and the resolver emits an
`IP_RENDERING_METADATA` (or `IP_RENDERING_METADATA_INVALID`) gap with
`INFERENCE_PROHIBITION_PLACEHOLDER` impact — same behaviour as the
prior pre-Q02 binding.

---

## 6. Q-class governance integration

The generic resolver consumes `QClassResolver` directly. Q-class
resolution is a pure function of:

- `backed_count` (semantic domains with EXACT/STRONG lineage)
- `total_count` (semantic_topology_model.domains length)
- `semantic_continuity_status` (VALIDATED iff crosswalk artifact present)
- `evidence_availability` (AVAILABLE iff decision_validation present)

For the BlueEdge productized run: `(4, 17, VALIDATED, AVAILABLE) →
Q-02`. The legacy compat class for adapter pipeline is `Q-01`.

---

## 7. Rendering metadata integration

`rendering_metadata.json` is one of the optional artifacts; when
present it is validated against
`docs/governance/runtime/rendering_metadata.schema.json` via the JS
mirror in `app/execlens-demo/lib/lens-v2/RenderingMetadataSchema.js`.

The resolver attaches the validated document to the actor hydrator, so
the IP actor surfaces governance-true values (`grounding_class`,
`semantic_projection_class`, `inference_prohibition_status`,
`disclosure_requirements`, `unresolved_semantic_gaps_count`,
`rendering_metadata_hash`) and the fixture-compat
`rendering_metadata.binding_status` field on the payload reads
`INFERENCE_PROHIBITION_ENFORCED`.

The upstream emitter for `rendering_metadata.json` is unchanged:
`scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js`.

---

## 8. BlueEdge parity

The BlueEdge wrapper (`BlueEdgePayloadResolver.js`) is now a thin
delegation layer. The parity test
(`flagship-experience/tests/generic-semantic-payload-resolver.test.js`)
asserts that the wrapper output and the direct generic output are
structurally identical (volatile timestamp fields excluded).

| Parity dimension                                  | Result |
|---------------------------------------------------|--------|
| `client`, `run_id`                                | EQUAL  |
| `baseline_commit` (`93098cb`)                     | EQUAL  |
| `binding_status` (`LIVE`)                         | EQUAL  |
| `qualifier_summary.qualifier_class` (Q-02)        | EQUAL  |
| `qualifier_class` top-level (Q-01 legacy compat)  | EQUAL  |
| Actor distribution (12/2/0/1)                     | EQUAL  |
| IP actor `HYDRATED` + `ENFORCED`                  | EQUAL  |
| DPSIG provenance preserved                        | EQUAL  |
| Report-pack ids (4 artifacts)                     | EQUAL  |
| Governance assertions (6 flags = true)            | EQUAL  |
| `unresolved_gaps` (`STRUCTURAL_TOPOLOGY_LOG_40_3`, `VAULT_READINESS`) | EQUAL  |

Adapter pipeline parity: `adaptReport(...)` continues to return
`renderState = EXECUTIVE_READY_WITH_QUALIFIER` with no warnings.

---

## 9. Client C onboarding implications

For a future Client C with a certified DPSIG run, the onboarding cost
is:

1. **DPSIG governed pipeline run** completes and emits its set of
   certified artifacts at known repo-relative paths. This is upstream
   work; LENS V2 does not perform it.
2. **Per-run rendering_metadata** is emitted into the run vault via
   `emit_rendering_metadata.js` (after that script's
   `ALLOWED_CLIENTS`/`ALLOWED_RUNS` is extended for Client C — a
   one-line change).
3. **A new manifest** is added at
   `app/execlens-demo/lib/lens-v2/manifests/<client>.<run>.json`
   declaring all required + optional + report-pack artifact paths.
4. **Registry entry** added in
   `app/execlens-demo/lib/lens-v2/manifests/index.js`.
5. **Manifest validates** (run the generic-resolver tests — they
   structurally validate any registered manifest).
6. **No bespoke UI engineering** is required. The runtime route
   `/lens-v2-flagship` consumes the canonical payload and is unchanged.

Failure modes are explicit:

- Missing required artifact → `binding_status: REJECTED` with a clear
  `missing.{key,path,reason}` field.
- Missing optional artifact → unresolved gap surfaced on the payload.
- Missing `rendering_metadata` → IP actor remains
  `PLACEHOLDER_BINDING_PENDING` with an explicit gap.
- Invalid `rendering_metadata` → `IP_RENDERING_METADATA_INVALID` gap
  with the schema errors attached.

See `client_c_onboarding_model.md` for the full onboarding playbook.

---

## 10. Files added / modified

### Added (15 files)

- `docs/governance/runtime/client_run_manifest.schema.json`
- `docs/governance/runtime/lens_semantic_payload.schema.json`
- `app/execlens-demo/lib/lens-v2/generic/ClientRunManifestSchema.js`
- `app/execlens-demo/lib/lens-v2/generic/LensSemanticPayloadSchema.js`
- `app/execlens-demo/lib/lens-v2/generic/GenericSemanticArtifactLoader.js`
- `app/execlens-demo/lib/lens-v2/generic/GenericSemanticPayloadResolver.js`
- `app/execlens-demo/lib/lens-v2/generic/GenericActorHydrator.js`
- `app/execlens-demo/lib/lens-v2/generic/mappers/index.js`
- `app/execlens-demo/lib/lens-v2/manifests/index.js`
- `app/execlens-demo/lib/lens-v2/manifests/blueedge.run_blueedge_productized_01_fixed.json`
- `app/execlens-demo/flagship-experience/tests/generic-semantic-payload-resolver.test.js`
- `docs/psee/PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01/GENERIC_SEMANTIC_PAYLOAD_RESOLVER_IMPLEMENTATION.md`
- `docs/psee/PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01/GENERIC_SEMANTIC_PAYLOAD_RESOLVER_VALIDATION.md`
- `docs/psee/PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01/client_c_onboarding_model.md`
- `docs/psee/PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01/screenshots/dense_1440x900_generic.png`

### Modified (1 file)

- `app/execlens-demo/lib/lens-v2/BlueEdgePayloadResolver.js` —
  refactored to a compatibility wrapper around the generic resolver.

### Untouched

- `pages/api/lens-payload.js`, `pages/api/report-pack.js`,
  `pages/lens-v2-flagship.js` — unchanged in this stream.
- All component / adapter / validation modules — unchanged.

---

## 11. Test summary

```
$ REPO_ROOT=... node --test \
    flagship-experience/tests/generic-semantic-payload-resolver.test.js
# tests       33
# suites       7
# pass        33
# fail         0
```

```
$ REPO_ROOT=... node --test \
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

Runtime smoke check (HTTP):

| Endpoint                                                                 | Status |
|--------------------------------------------------------------------------|--------|
| `GET /api/lens-payload?client=blueedge&run=run_blueedge_productized_01_fixed` | 200    |
| `GET /api/lens-payload?client=not_a_client&run=foo`                       | 404    |
| `GET /api/report-pack?client=blueedge&run=run_blueedge_productized_01_fixed&artifact=decision-surface` | 200    |
| `GET /lens-v2-flagship` (Playwright snapshot)                              | OK · `INFERENCE PROHIBITION: ENFORCED · QUALIFIER Q-02` visible |

---

## 12. Verdict

The productized generic semantic payload resolver is **operational**.
BlueEdge live binding is preserved without functional regression. The
Client C onboarding path is configuration-only.

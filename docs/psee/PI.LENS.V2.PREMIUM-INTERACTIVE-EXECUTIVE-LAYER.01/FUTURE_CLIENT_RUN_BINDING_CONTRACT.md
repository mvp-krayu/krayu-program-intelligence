# FUTURE CLIENT/RUN BINDING CONTRACT

**Stream:** PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01
**Status:** DESIGN-LEVEL — defines the future binding required to move LENS V2 from in-memory fixture mode to live client/run integration. **Not implemented in this stream.**

---

## 1. Current state (honest)

LENS V2 currently runs against a single in-memory fixture:

```
app/execlens-demo/flagship-experience/fixtures/flagship_real_report.fixture.js
```

This fixture is the entire content source for the LENS V2 flagship surface. The `orchestrateFlagshipExperience` function in `flagship-experience/flagshipOrchestration.js` adapts that fixture into the renderable shapes the LENS V2 components consume.

There is **no live binding** between LENS V2 and:

- a real client/run upstream pipeline
- the static report generator that produces the Tier-1 / Tier-2 HTML artifacts
- any database, API, or evidence store

The Report Pack band added in this iteration is a guarded placeholder. Its entries are `aria-disabled="true"` and their `binding_path` values are documentation only. Clicking them does nothing.

This is intentional. The contract for this stream forbids fake pipeline binding. Future contracts will close this gap.

---

## 2. Target binding architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ Real upstream evidence (clients/<client_id>/...)                       │
│  - source documents                                                    │
│  - cluster intelligence                                                │
│  - signal stack                                                        │
│  - propagation chain                                                   │
│  - governance verdict                                                  │
└─────────────────────────────┬──────────────────────────────────────────┘
                              │
              ┌───────────────┴────────────────┐
              ▼                                ▼
┌────────────────────────────┐    ┌──────────────────────────────────────┐
│ Static report generator    │    │ LENS V2 semantic payload generator   │
│ produces:                   │    │ produces:                            │
│  - lens_decision_surface   │    │  - { render_state, narrative,        │
│  - lens_tier1_narrative    │    │      readiness_badge,                │
│  - lens_tier1_evidence     │    │      qualifier_chip,                 │
│  - lens_tier2_diagnostic   │    │      evidence_blocks[],              │
│                             │    │      propagation_chains[],           │
│  written to:                │    │      topology_scope,                 │
│   clients/<id>/reports/...  │    │      governance,                     │
└────────────────────────────┘    │      ... }                           │
              │                    └──────────────────────┬───────────────┘
              │                                           │
              ▼                                           ▼
┌────────────────────────────┐    ┌──────────────────────────────────────┐
│ /api/report-pack            │    │ /api/lens-payload                    │
│ ?client=<id>                │    │ ?client=<id>                         │
│ &run=<id>                   │    │ &run=<id>                            │
│ &artifact=<id>              │    │                                      │
│                             │    │ returns the structured payload       │
│ streams the static HTML     │    │ that LENS V2 components consume      │
└─────────────────────────────┘    └──────────────────────────────────────┘
              │                                           │
              ▼                                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LENS V2 flagship route (/lens-v2-flagship)                             │
│  - Report Pack band consumes /api/report-pack (per artifact)           │
│  - Representation Field consumes /api/lens-payload (per route load)    │
│  - same evidence ground reflected in both                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. API contract — `/api/report-pack`

### Request

```
GET /api/report-pack?artifact=<artifact_id>&client=<client_id>&run=<run_id>
```

### Parameters

| Name        | Required | Allowed values                                                            |
|-------------|----------|---------------------------------------------------------------------------|
| artifact    | yes      | `decision-surface` \| `tier1-narrative` \| `tier1-evidence` \| `tier2-diagnostic` |
| client      | yes      | a known client id under `clients/`                                        |
| run         | yes      | a known run id under `clients/<client>/...`                               |

### Server-side resolution

```
artifact_to_filename = {
  'decision-surface':  'lens_decision_surface.html',
  'tier1-narrative':   'lens_tier1_narrative_brief.html',
  'tier1-evidence':    'lens_tier1_evidence_brief.html',
  'tier2-diagnostic':  'lens_tier2_diagnostic_narrative.html',
}

artifact_to_tier_dir = {
  'decision-surface':  'decision',
  'tier1-narrative':   'tier1',
  'tier1-evidence':    'tier1',
  'tier2-diagnostic':  'tier2',
}

resolved_path = `${REPO_ROOT}/clients/${client}/reports/${tier_dir}/${filename}`
```

### Response

| Status | Body                                          | Notes                                                |
|--------|-----------------------------------------------|------------------------------------------------------|
| 200    | the static HTML body                          | `Content-Type: text/html; charset=utf-8`             |
| 400    | `{ "error": "INVALID_ARTIFACT" }`             | unknown `artifact` value                             |
| 404    | `{ "error": "ARTIFACT_NOT_GENERATED", ... }`  | resolved file does not exist                         |
| 500    | `{ "error": "INTERNAL", ... }`                | unexpected — log and return                          |

### Security

- The `client` and `run` parameters MUST be sanitized (reject path traversal).
- Only the four canonical artifact filenames are resolved — no arbitrary file access.
- The endpoint MUST NOT proxy any non-`clients/.../reports/...` path.

---

## 4. API contract — `/api/lens-payload`

### Request

```
GET /api/lens-payload?client=<client_id>&run=<run_id>
```

### Response (success)

A JSON object matching the shape consumed by `orchestrateFlagshipExperience` and the LENS V2 components. At minimum:

```jsonc
{
  "render_state": "EXECUTIVE_READY_WITH_QUALIFIER",
  "qualifier_class": "Q-01",
  "topology_scope": {
    "domain_count": 3,
    "cluster_count": 47,
    "grounded_domain_count": 2,
    "grounding_label": "Partial Coverage"
  },
  "header_block": { ... },
  "narrative_block": { ... },
  "evidence_blocks": [ ... ],
  "trace_block": { ... },
  "governance": { ... },
  "report_pack_availability": {
    "decision-surface":  { "binding_status": "AVAILABLE", "generated_at": "..." },
    "tier1-narrative":   { "binding_status": "AVAILABLE", "generated_at": "..." },
    "tier1-evidence":    { "binding_status": "AVAILABLE", "generated_at": "..." },
    "tier2-diagnostic":  { "binding_status": "PENDING" }
  }
}
```

### Notes

- The shape MUST be byte-compatible with the current `flagship_real_report.fixture.js` so that swapping the source from fixture to API requires no changes to the components.
- The `report_pack_availability` field is new — added so the Report Pack can render AVAILABLE / PENDING per artifact rather than always PENDING.

---

## 5. Component-level integration plan

### Step 1 — Introduce the API endpoints

- `app/execlens-demo/pages/api/report-pack.js` — implements the file resolver per §3.
- `app/execlens-demo/pages/api/lens-payload.js` — implements the payload resolver per §4 (initially proxying the fixture, then later proxying real upstream).

### Step 2 — Replace fixture import with payload fetch

Replace:

```js
const { FLAGSHIP_REAL_REPORT, FLAGSHIP_PROPAGATION_CHAINS } = require('../flagship-experience/fixtures/flagship_real_report.fixture')
```

With a `getServerSideProps` (or `getStaticProps` + revalidation) that calls `/api/lens-payload` per request.

### Step 3 — Wire Report Pack to AVAILABLE / PENDING

The Report Pack reads `report_pack_availability` from the payload and:

- removes `aria-disabled` on AVAILABLE entries
- attaches `href` pointing to `/api/report-pack?...`
- updates the state caption to "open in new tab"

### Step 4 — Preserve visual surface

The four lenses, the persona-line microcopy, the cinematic atmospheric ground, the anti-dashboard rules — all preserved. The binding contract changes only the data-flow plumbing, not the visual surface.

---

## 6. Sequencing relative to other LENS V2 streams

This binding contract should be implemented as a separate stream (proposed name: `PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.01`). It depends on:

- `PI.LENS.V2.VISUAL-DIRECTION-DOCTRINE.01` (cinematic constraints)
- `PI.LENS.V2.PLAYWRIGHT-VISUAL-INSPECTION.01` (rubric expectations)
- `PI.LENS.V2.REPRESENTATION-FIELD-AND-PERSONA-CONSOLIDATION.01` (persona / zone mapping)
- this stream (`PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01`) for the Report Pack contract

The future binding stream MUST consult all four before drafting.

---

## 7. Honest scope for this stream

This stream:

- Defined the binding contract.
- Documented the future API.
- Added the Report Pack band as a guarded placeholder.
- Did NOT implement the API endpoints.
- Did NOT remove the in-memory fixture.
- Did NOT alter the runtime data path.

Anyone reading this document should understand that LENS V2 today still runs from a single fixture and the Report Pack is documented binding, not actual binding.

---

## 8. Authority

This document is authoritative as the binding specification. Future binding work must implement against this specification or, if the specification needs to change, must explicitly amend this document and record the rationale.

---

**End of future client/run binding contract.**

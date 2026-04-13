# GAUGE.STANDALONE.TOPOLOGY.DATASOURCE.ISOLATION.01 — Contract

## Contract Identity

- ID: GAUGE.STANDALONE.TOPOLOGY.DATASOURCE.ISOLATION.01
- Type: DATASOURCE OWNERSHIP CORRECTION
- Mode: STRICT ISOLATION CORRECTION
- Branch: work/psee-runtime
- Date: 2026-04-13

---

## Purpose

Correct the standalone Gauge topology add-on so it no longer depends on ExecLens DEMO for topology data.

This is a datasource ownership correction only.
No rendering change. No layout change. No new computation.

---

## Problem Statement

Prior state: `app/gauge-product/pages/api/topology.js` proxied to ExecLens DEMO adapter:
- Fetched from `TOPOLOGY_UPSTREAM_URL` (default `http://localhost:8000`)
- Called `/api/execlens?envelope=true`
- 503 message instructed user to "Start the ExecLens DEMO adapter (app/execlens-demo)"

This violates the standalone Gauge ownership principle: Gauge must own its topology datasource.

---

## Correction

### Local Governed Source

```
clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json
```

This is the canonical governed artifact for topology data, as defined by PSEE.BLUEEDGE.GAUGE.HANDOFF.01.
It is the authoritative input to the envelope adapter pipeline.

### Files Changed

| File | Change |
|------|--------|
| `app/gauge-product/pages/api/topology.js` | Removed ExecLens proxy; reads local binding_envelope.json directly |
| `app/gauge-product/components/TopologyAddon.js` | Corrected 503 error message (removed ExecLens reference) |

### Files Created

| File | Description |
|------|-------------|
| `app/gauge-product/lib/envelope_adapter.js` | JS port of envelope_adapter.py — deterministic render model derivation |

---

## Adapter Port

`app/gauge-product/lib/envelope_adapter.js` is a faithful JS port of:
`app/execlens-demo/lib/gauge/envelope_adapter.py`

Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01

Ported functions:
- `_buildProductNames(nodesList)` — corpus builder for N-1 casing preservation
- `_tokenize(s)` — T-1 through T-5 split rules (snake, kebab, PascalCase, digit boundary)
- `_normalize(tok, productNames)` — N-1 product casing, N-3 abbreviation register, N-2 title case
- `resolveLabel(source, productNames)` — full grammar
- `validateEnvelope(envelope)` — fail-closed on missing required collections
- `buildRenderModel(envelope, envelopePath)` — full render model derivation

No new computation introduced. Same deterministic output contract as Python adapter.

---

## API Route Contract

`app/gauge-product/pages/api/topology.js`:

1. Resolves `GAUGE_ENVELOPE_PATH` env var OR default path (repo-root-relative)
2. Checks file existence — 503 with local-artifact message if missing
3. Parses JSON — 503 on parse error
4. Validates envelope — 503 on missing required collections
5. Derives render model via `buildRenderModel`
6. Returns 200 with complete render model

503 messages reference `binding_envelope.json` only — no ExecLens mention.

---

## Path Resolution

```js
const REPO_ROOT       = path.resolve(process.cwd(), '..', '..')
// process.cwd() = app/gauge-product/
// REPO_ROOT     = k-pi-core/
```

Default envelope: `k-pi-core/clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json`

Override: `GAUGE_ENVELOPE_PATH` environment variable.

---

## Governance

- Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
- Stream boundary: L6 runtime (feature/runtime-demo domain)
- No cross-app imports
- No new semantic computation
- No ExecLens runtime dependency

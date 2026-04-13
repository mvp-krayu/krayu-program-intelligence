# GAUGE.STANDALONE.PRODUCT.REBUILD.01 — Contract

## Contract Identity

- ID: GAUGE.STANDALONE.PRODUCT.REBUILD.01
- Type: PRODUCT BUILD
- Mode: BASELINE FAITHFUL PORT
- Branch: work/psee-runtime
- Date: 2026-04-12

---

## Purpose

Rebuild the Gauge surface as a standalone Next.js product at `app/gauge-product/`.
The authoritative baseline is `docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v2_product.html`.

The standalone Gauge product is independent of the ExecLens DEMO app (`app/execlens-demo/`).
Topology is an optional add-on — OFF by default, behind explicit activation boundary.

---

## Authoritative Baseline

`docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v2_product.html`

All content, labels, copy, scores, states, and structural data values are fixed to this baseline.
No deviation from baseline content is permitted unless the contract explicitly authorizes it.

---

## Governed Separation

| Surface    | App                    | Topology Presentation  | Default State |
|------------|------------------------|------------------------|---------------|
| Gauge      | app/gauge-product/     | TopologyAddon (add-on) | OFF           |
| DEMO       | app/execlens-demo/     | TopologyPanel mode=topology | ON (always) |

No cross-import between apps. Each app is independently deployable.

---

## Execution Scope

### Files Created

#### App scaffold
- `app/gauge-product/package.json` — standalone Next.js 14, port 3001
- `app/gauge-product/next.config.js` — minimal config
- `app/gauge-product/pages/_app.js` — CSS import
- `app/gauge-product/styles/gauge.css` — full CSS port from baseline HTML

#### Components
- `app/gauge-product/components/TopologyAddon.js` — self-contained topology add-on
  - `useTopologyData(active)` — fetches `/api/topology` only when active=true
  - `TopologyAddon` — activation bar always rendered; panel rendered only when `showTopology=true`
  - `TopologyView` — mirrors EnvelopeTopology; uses `display_label`, `secondary_label`

#### Pages
- `app/gauge-product/pages/index.js` — main Gauge product page
  - React state: `discoveryEnabled`, `modalOpen`, `accessKeyInput`, `keyDenied`, `showTopology`
  - `VALID_KEY = 'PIOS-DISCOVERY-DEMO'`
  - Sections: modal, top bar, left column, right column, topology add-on
- `app/gauge-product/pages/api/topology.js` — proxy to ExecLens DEMO adapter

---

## Access Key Behavior

- `VALID_KEY = 'PIOS-DISCOVERY-DEMO'`
- Valid key → `discoveryEnabled = true`
- Effects of `discoveryEnabled`:
  - CTA button: `.cta-btn` → `.cta-btn-enabled` ("Discovery Access Enabled")
  - SI bridge button: `.si-bridge-btn` → `.si-bridge-btn-enabled` ("Discovery Access Enabled")
  - Access chip: visible
  - Discovery success message: visible
  - Structural queries: `query-block structural-query` gains `unlocked` class
  - State summary discovery row: dot `#3fb950`, text "ACCESS ENABLED"
- Exec-locked queries remain locked regardless of access key

---

## Topology Add-on Boundary

- Activation boundary: `showTopology` state in `pages/index.js`
- Default: `false` (OFF)
- Toggle: `TopologyAddon onToggle` prop → `setShowTopology(v => !v)`
- No auto-activation, no query param trigger, no `useEffect` coupling to page state
- Data fetch: only triggered when `active=true` (inside `useTopologyData`)
- API route: `pages/api/topology.js` → proxies to `TOPOLOGY_UPSTREAM_URL` (default: `http://localhost:8000`)
- Upstream: ExecLens DEMO adapter at `/api/execlens?envelope=true`

---

## CSS Port Notes

Classes ported verbatim from baseline HTML styles section.
New classes added for React state patterns not present in vanilla HTML:
- `.cta-btn-enabled` — replaces `.cta-btn` when discovery enabled (green, no hover)
- `.si-bridge-btn-enabled` — replaces `.si-bridge-btn` when discovery enabled
- `.topology-addon-bar`, `.topology-addon-label`, `.topology-addon-btn` — add-on bar
- `.topology-addon-panel`, `.topology-addon-note` — add-on expanded panel

---

## Governance

- Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
- Stream boundary: L6 runtime (feature/runtime-demo domain)
- No Core derivation, no activation logic, no semantic enrichment
- No synthetic data — topology panel explicitly reports unavailability if adapter not running

GAUGE RUNTIME REMOUNT TOPOLOGY ADD-ON CONTRACT
Contract ID: GAUGE.RUNTIME.REMOUNT.TOPOLOGY.ADDON.01
Layer: Runtime Exposure (42.x) — Gauge Base vs Topology Add-on Separation
Status: IMPLEMENTED

---

## SECTION 1 — OBJECTIVE

Restore the Gauge / ExecLens base surface to its authoritative baseline behavior and isolate structural topology rendering as a non-invasive, explicitly-activated add-on.

Before this implementation:
- `TopologyPanel` was rendered unconditionally in `pages/index.js:168-170`
- No activation gate existed; topology appeared in the default surface for every page load
- The base Gauge surface (hero, gauge strip, query selector, intelligence output) was structurally intact but topology was injected between LandingGaugeStrip and QuerySelector without activation control

After this implementation:
- `TopologyPanel` renders ONLY when `showTopology === true`
- `showTopology` defaults to `false`
- An explicit toggle button provides the activation boundary
- Base Gauge surface is identical to pre-injection state when topology is inactive

---

## SECTION 2 — AUTHORITATIVE BASELINE

Reference file: `docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v2_product.html`

This file defines the correct product-grade Gauge surface. It was NOT modified by this implementation.

Key structural intent from baseline:
- Left column: score decomposition, component explanation, confidence, missing capabilities, operator details
- Right column: structural insights bridge (with explicit "View Structural Topology →" button as activation model)
- Topology is accessed via explicit user action — it is NOT part of the default surface layout

The right-column `si-bridge` section in the baseline HTML confirms the architectural intent: topology is a linked capability reached via explicit button, not a default panel.

---

## SECTION 3 — IMPLEMENTATION SCOPE

One file modified. No other files changed.

**`app/execlens-demo/pages/index.js`**

Change A — Added `showTopology` state (default `false`):
```javascript
// ── Topology add-on state — OFF by default; must be explicitly activated ──
const [showTopology, setShowTopology] = useState(false)
```

Change B — Replaced unconditional topology render with gated render + activation toggle:

Before:
```jsx
{/* ── Structural topology panel — beneath gauges, above query selector ── */}
<div data-demo-section="topology">
  <TopologyPanel selectedQuery={selectedQuery} />
</div>
```

After:
```jsx
{/* ── Structural topology add-on — explicit activation required ── */}
{/* Default: OFF. Topology must not affect base Gauge when inactive. */}
<div data-demo-section="topology">
  <div style={{ padding: '10px 0', borderBottom: showTopology ? 'none' : '1px solid #1f2937' }}>
    <button
      onClick={() => setShowTopology(prev => !prev)}
      style={{
        fontFamily: 'monospace', fontSize: '13px', padding: '8px 16px',
        border: '1px solid #1b3a5c', background: '#0b1f31', color: '#58a6ff',
        cursor: 'pointer',
      }}
    >
      {showTopology ? '▲ Hide Structural Topology' : '▼ View Structural Topology'}
    </button>
  </div>
  {showTopology && <TopologyPanel selectedQuery={selectedQuery} />}
</div>
```

---

## SECTION 4 — ACTIVATION BOUNDARY

The activation boundary is explicit activation state:

| Property | Value |
|---|---|
| Mechanism | React state (`showTopology`) |
| Default | `false` (OFF) |
| Activation | User click on "▼ View Structural Topology" button |
| Deactivation | User click on "▲ Hide Structural Topology" button |
| Auto-activation | NONE — no query param, no mount side-effect triggers it |
| Demo choreography coupling | NONE — topology activation is independent of `demoActive`/`demoStep` |

When `showTopology === false`:
- `TopologyPanel` component is not mounted
- No API call to `/api/execlens?envelope=true`
- No topology data fetched
- No topology rendering at any layer
- Base Gauge surface is unaffected

When `showTopology === true`:
- `TopologyPanel` component mounts
- Topology renders in place (below LandingGaugeStrip, above QuerySelector)
- Base Gauge panels are not modified

---

## SECTION 5 — NON-CONTAMINATION PROOF

| Item | Status | Evidence |
|---|---|---|
| `TopologyPanel.js` modified | NO | Not in this contract's diff; pre-existing modification from GAUGE.RUNTIME.LABEL.CONSUMPTION.01 only |
| `envelope_adapter.py` modified | NO | Not in this contract's diff |
| `LandingGaugeStrip.js` modified | NO | Untouched |
| `QuerySelector.js` modified | NO | Untouched |
| `ExecutivePanel.js` modified | NO | Untouched |
| `SignalGaugeCard.js` modified | NO | Untouched |
| `EvidencePanel.js` modified | NO | Untouched |
| `NavigationPanel.js` modified | NO | Untouched |
| `DemoController.js` modified | NO | Untouched |
| Any other base component modified | NO | Only `pages/index.js` changed |
| Shared components carrying topology logic | NONE | Topology is self-contained in `TopologyPanel.js`; no shared component altered |

---

## SECTION 6 — PROHIBITED ACTIONS CONFIRMED ABSENT

| Prohibition | Status |
|---|---|
| UI redesign of Gauge | NOT DONE — no layout, style, or component change to base Gauge |
| Merging topology into existing panels | NOT DONE — topology renders separately, in its own container |
| Replacing Gauge sections with topology | NOT DONE — all base sections intact |
| Auto-activation | NOT DONE — `showTopology` defaults to `false`; no side effect sets it to `true` |
| Semantic enrichment | NOT DONE |
| New API calls | NOT DONE — `TopologyPanel` component unchanged; no new endpoints |
| Structural mutation | NOT DONE |
| Label transformation | NOT DONE |
| Modification of baseline HTML reference | NOT DONE |

---

## SECTION 7 — ISOLATION MODEL

```
DEFAULT STATE (showTopology = false):
  page-root
  ├── hero
  ├── LandingGaugeStrip             ← base Gauge, unaffected
  ├── [topology-section]
  │     └── "▼ View Structural Topology" button (only visible artifact)
  ├── QuerySelector                 ← base Gauge, unaffected
  └── intelligence-output           ← base Gauge, unaffected

ACTIVATED STATE (showTopology = true):
  page-root
  ├── hero
  ├── LandingGaugeStrip             ← unchanged
  ├── [topology-section]
  │     ├── "▲ Hide Structural Topology" button
  │     └── <TopologyPanel />       ← add-on, renders here only
  ├── QuerySelector                 ← unchanged
  └── intelligence-output           ← unchanged
```

No base component is inside the conditional. The topology section container (`data-demo-section="topology"`) is retained but contains only the toggle and the conditionally-rendered `TopologyPanel`.

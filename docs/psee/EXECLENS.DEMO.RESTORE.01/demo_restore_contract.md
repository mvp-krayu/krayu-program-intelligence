EXECLENS DEMO RESTORE CONTRACT
Contract ID: EXECLENS.DEMO.RESTORE.01
Layer: Runtime Exposure (42.x) — ExecLens DEMO Restoration
Status: IMPLEMENTED

---

## SECTION 1 — OBJECTIVE

Restore ExecLens DEMO as its own product surface. Remove Gauge-style topology mounting from the DEMO. Ensure structural topology in DEMO renders using DEMO-native presentation, not Gauge envelope presentation.

DEMO = DEMO. GAUGE = GAUGE. No shared presentation contamination.

---

## SECTION 2 — PRIOR STATE INVENTORY

Two prior contracts introduced Gauge-style elements into ExecLens DEMO:

### State A — Pre-GAUGE contracts (original baseline)
```jsx
{/* ── Structural topology panel — beneath gauges, above query selector ── */}
<div data-demo-section="topology">
  <TopologyPanel selectedQuery={selectedQuery} />
</div>
```
`TopologyPanel` with no explicit `mode` prop → `mode = 'envelope'` (default) → fetched `/api/execlens?envelope=true` → rendered `EnvelopeTopology` (Gauge presentation). The DEMO was already using Gauge-style topology.

### State B — GAUGE.RUNTIME.REMOUNT.TOPOLOGY.ADDON.01 (prior contract)
Added `showTopology` state (default `false`) and a toggle button: "▼ View Structural Topology / ▲ Hide Structural Topology". Gated `TopologyPanel` behind the toggle. This added a Gauge add-on control pattern inside the DEMO, making it worse.

### After This Contract (restored state)
```jsx
{/* ── Structural topology — DEMO presentation (42.7 signal-projection path) ── */}
<div data-demo-section="topology">
  <TopologyPanel selectedQuery={selectedQuery} mode="topology" />
</div>
```
`mode="topology"` → fetches `/api/execlens?topology=true` → `topology.envelope !== true` → `EnvelopeTopology` NOT rendered → legacy 42.7 hierarchy path renders → `DomainBlock` hierarchy ("STRUCTURAL TOPOLOGY — SIGNAL PROJECTION"). This is DEMO presentation.

---

## SECTION 3 — IMPLEMENTATION SCOPE

One file modified. No other files changed.

**`app/execlens-demo/pages/index.js`**

| Item | Before | After |
|---|---|---|
| `showTopology` state | Present (REMOUNT artifact) | Removed |
| Toggle button ("View Structural Topology") | Present (REMOUNT artifact) | Removed |
| Conditional topology render | `{showTopology && <TopologyPanel ... />}` | Removed |
| Topology section | Gated behind toggle | Unconditional |
| `mode` prop | Not set → defaults to `'envelope'` (Gauge path) | Explicitly `mode="topology"` (DEMO path) |
| Comment | Gauge add-on framing | DEMO presentation framing |

`TopologyPanel.js` was NOT modified by this contract. The `mode` prop is an existing interface in the component.

---

## SECTION 4 — RENDERING PATH SEPARATION

### Gauge presentation path (NOT used in DEMO after restoration)
```
mode === 'envelope'
→ /api/execlens?envelope=true
→ binding_envelope.json → envelope_adapter.py
→ topology.envelope === true
→ <EnvelopeTopology />
   └── RegionCard (binding_context regions)
   └── ComponentFooter (component_entity nodes)
   └── StandaloneSection (orphan nodes)
   └── DiagnosticsPanel (structural overlaps)
   Header: "STRUCTURAL TOPOLOGY" + "binding_envelope.json · click items to inspect"
```

### DEMO presentation path (active after restoration)
```
mode === "topology" (any non-'envelope' value)
→ /api/execlens?topology=true (+ optional &highlight=<query>)
→ 42.7 topology adapter
→ topology.envelope !== true → EnvelopeTopology NOT rendered
→ topology.wow_chain disabled (if false &&)
→ legacy hierarchy path:
   DomainBlock → CapabilityGroup → EntityChip
   Header: "STRUCTURAL TOPOLOGY — SIGNAL PROJECTION"
   Meta: "source: 42.7 adapter · hierarchy via co-occurrence · all entities governed"
   Query-driven: updates when selectedQuery changes (highlight mode)
```

The DEMO presentation is query-contextual (topology responds to selected query). The Gauge presentation is always-on structural topology independent of query selection.

---

## SECTION 5 — NON-CONTAMINATION PROOF

Files NOT modified by this contract:

| File | Status |
|---|---|
| `app/execlens-demo/components/TopologyPanel.js` | NOT modified (pre-existing from GAUGE.RUNTIME.LABEL.CONSUMPTION.01) |
| `app/execlens-demo/lib/gauge/envelope_adapter.py` | NOT modified (pre-existing from GAUGE.RUNTIME.LABEL.CONSUMPTION.01) |
| `app/execlens-demo/components/LandingGaugeStrip.js` | NOT modified |
| `app/execlens-demo/components/QuerySelector.js` | NOT modified |
| `app/execlens-demo/components/ExecutivePanel.js` | NOT modified |
| `docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v2_product.html` | NOT modified |
| Any PiOS core, ingestion, binding, or label resolution file | NOT modified |

---

## SECTION 6 — DEMO TOPOLOGY PRESENCE JUSTIFICATION

Structural topology DOES belong to DEMO baseline behavior:
- `data-demo-section="topology"` attribute was present in the original page
- `DemoController` sequences through demo sections including `"topology"`
- The page comment reads: "Topology rewired to governed WOW chain: 42.22 → 51.1 → 51.1R → 42.23"
- The 42.7 legacy path with DomainBlock hierarchy is the DEMO-native topology presentation

Topology remains in the DEMO, rendered unconditionally (as the original baseline had it), but now uses the DEMO-native 42.7 signal-projection presentation rather than the Gauge envelope presentation.

---

## SECTION 7 — WHAT THIS CONTRACT DOES NOT DO

| Item | Status |
|---|---|
| Redesign of DEMO | NOT DONE |
| Feature addition | NOT DONE |
| Gauge integration into DEMO | NOT DONE — explicitly removed |
| Topology add-on model | NOT DONE — add-on toggle removed |
| Modification of label resolution | NOT DONE |
| Modification of binding contracts | NOT DONE |
| Modification of scoring/signals | NOT DONE |
| New API calls | NOT DONE — existing `?topology=true` path |

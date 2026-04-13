# GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01 — Contract

## Contract Identity

- ID: GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01
- Type: RELOCATION + CONTEXT INHERITANCE
- Mode: STRICT EXTRACTION
- Branch: wip/gauge-psee-hygiene-snapshot
- Date: 2026-04-13

---

## Purpose

Move the Structural Topology add-on from inline expansion (toggle-based, at bottom of main page)
to a dedicated route `/topology`, while preserving Gauge column 3 context as a compact
context strip on the new page. Maintain full product continuity and visual identity.

This is NOT a new feature. This is a relocation + context inheritance.

---

## Layout Change

### Main page (index.js)

| Before | After |
|--------|-------|
| `showTopology` toggle state | Removed |
| `TopologyAddon` mounted below columns | Removed |
| `TopologyAddon` import | Removed |
| Column 3: ends after Topology Summary | Column 3: Topology CTA panel added after Topology Summary |

### New topology page (topology.js)

| Section | Content |
|---------|---------|
| Back nav bar | "← Back to Gauge" link + page title + artifact reference |
| Context strip | 4-panel compact grid: Runtime Intelligence, Structural Metrics, Signal Set, Topology Summary |
| Explorer | TopologyAddon (showTopology=true, full width) |

---

## Shared Components

### GaugeContextPanels.js (NEW)

Extracted from `pages/index.js` to avoid duplication between main and topology pages.

Exports:
- `useGaugeData()` → /api/gauge
- `useTopologySummary()` → /api/topology
- `DIM_STATE_CLASS`
- `RuntimeIntelligence`
- `StructuralMetrics`
- `SignalSet`
- `TopologySummaryPanel`

Both `pages/index.js` and `pages/topology.js` import from this shared module.

---

## Routing

| Route | Page |
|-------|------|
| `/` | `pages/index.js` — Gauge main product |
| `/topology` | `pages/topology.js` — Topology deep dive |

Navigation:
- Main page column 3 CTA: `<Link href="/topology">View Structural Topology →</Link>`
- Topology page back: `<Link href="/">← Back to Gauge</Link>`

---

## Data Contract

No changes to API routes or data structures.

| API | Source | Used by |
|-----|--------|---------|
| `/api/gauge` | gauge_state.json | RuntimeIntelligence, StructuralMetrics |
| `/api/topology` | binding_envelope.json | SignalSet, TopologySummaryPanel, TopologyAddon |

---

## Files Changed

| File | Change |
|------|--------|
| `app/gauge-product/pages/index.js` | Remove TopologyAddon, remove showTopology state; import from GaugeContextPanels; add Topology CTA panel |
| `app/gauge-product/styles/gauge.css` | Append tp-* CSS block |

## Files Created

| File | Description |
|------|-------------|
| `app/gauge-product/components/GaugeContextPanels.js` | Shared data hooks and panel components |
| `app/gauge-product/pages/topology.js` | Dedicated topology page |
| `docs/psee/GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01/topology_page_extraction_contract.md` | This file |
| `docs/psee/GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01/topology_page_extraction_validation.md` | Validation |
| `docs/psee/GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01/GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01_EXECUTION_LOG.md` | Execution log |

---

## CSS Classes Added

| Class | Purpose |
|-------|---------|
| `.tp-back-bar` | Back navigation bar on topology page |
| `.tp-back-link` | "← Back to Gauge" anchor |
| `.tp-back-identity` | Page title + artifact ref |
| `.tp-back-title` | Title text |
| `.tp-back-sub` | Subtitle text |
| `.tp-context-strip` | 4-panel compact context grid |
| `.tp-context-block` | Individual context panel in strip |
| `.tp-explorer` | Topology explorer wrapper |
| `.tp-cta-link` | Topology CTA link on main page |
| `.tp-cta-sub` | CTA subtitle text |

---

## Governance

- Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
- Stream boundary: L6 runtime (wip/gauge-psee-hygiene-snapshot domain)
- No new API endpoints
- No data or semantic changes
- No ExecLens dependency introduced
- TopologyAddon unchanged — no internal logic modified
- Gauge core logic (scores, proof, discovery) unchanged

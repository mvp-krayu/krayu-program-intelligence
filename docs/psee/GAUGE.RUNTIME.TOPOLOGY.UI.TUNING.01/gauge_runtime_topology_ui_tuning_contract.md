# GAUGE Runtime Topology UI Tuning Contract
# GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.01 — Deliverable 1

## Identity

- Contract: GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.01
- Date: 2026-04-14
- Branch: wip/gauge-psee-hygiene-snapshot
- Mode: STRICT UI TUNING — NO DATA/API CHANGES

---

## Objective

Improve topology UI usability through progressive disclosure and hierarchy emphasis. No data changes. No semantic changes. Visual and interaction layer only.

---

## Problem Statement

With 17 domains each containing 2–5 capabilities and their components, the previous flat-expanded view created immediate visual overload. All 89 components visible simultaneously with no focus mechanism.

---

## Changes Made

### File 1: `app/gauge-product/components/TopologyAddon.js`

**Change type:** Interaction behavior — collapse/expand state management

| addition | description |
|----------|-------------|
| `expandedDomainId` state | `useState(null)` — null = all domains collapsed on load |
| `toggleDomain(domainId)` | Sets expandedDomainId; if same domain clicked, collapses it; if different, replaces previous (single-focus) |
| Domain header `onClick` | Now calls both `toggleDomain(rootId)` and `selectNode(rootId)` |
| `isExpanded` variable | `expandedDomainId === rootId` per domain |
| Surfaces render guard | `{isExpanded && visibleSurfaces.length > 0 && ...}` |
| Components render guard | `{isExpanded && components.map(...)}` |
| Expand arrow | `<span className="ta-expand-arrow">{isExpanded ? '▼' : '▶'}</span>` |
| `ta-region--expanded` class | Applied when `isExpanded` is true |
| Badge labels | "surfaces" → "cap", "components" → "comp" (compact form for collapsed header) |

**Existing behavior preserved:**
- `selectNode()` unchanged — inspector panel still responds to all node clicks
- `showAllSurfaces` state unchanged — surface pagination preserved within expanded domain
- `selectedNodeId` state unchanged — selection highlight preserved
- All data passthrough unchanged — display_label, secondary_label, grounding, etc.

### File 2: `app/gauge-product/styles/gauge.css`

**Change type:** Visual hierarchy — minimal targeted CSS additions/modifications

| selector | change | reason |
|----------|--------|--------|
| `.ta-region-header` | `border-bottom-color: #161d27` (slightly darker) | Quieter separator in collapsed state |
| `.ta-region--expanded .ta-region-header` | `border-bottom-color: #1f3a55` | Stronger separator when expanded |
| `.ta-expand-arrow` | New: `font-size:9px; color:#444; width:14px; margin-right:2px` | Expand/collapse arrow indicator |
| `.ta-region--expanded .ta-expand-arrow` | `color: #58a6ff` | Arrow highlights when expanded |
| `.ta-region-name` | `color: #8b949e` (was `#c9d1d9`); `font-weight:600` (was `bold`) | Collapsed domains are dimmed |
| `.ta-region--expanded .ta-region-name` | `color: #c9d1d9` | Expanded domain is full brightness |
| `.ta-surface-name` | `color: #a0adb6` (was `#c9d1d9`) | Secondary level — slightly dimmer |
| `.ta-component-name` | `color: #8b949e` (was `#c9d1d9`) | Tertiary level — quieter |

---

## Interaction Contract

```
Initial load:
  expandedDomainId = null
  All domains: collapsed (header only visible)

Click domain header:
  IF expandedDomainId === domainId → set null (collapse)
  IF expandedDomainId !== domainId → set domainId (expand, collapses previous)
  Also: selectNode(domainId) → inspector updates

Click capability (when domain expanded):
  selectNode(capability_id) → inspector updates
  Domain remains expanded

Click component (when domain expanded):
  selectNode(component_id) → inspector updates
  Domain remains expanded
```

---

## No-Change Scope (Confirmed)

| item | status |
|------|--------|
| topology API (`/api/topology`) | UNCHANGED |
| `canonical_topology.json` | UNCHANGED (read-only source) |
| `envelope_adapter.js` | UNCHANGED |
| `pages/api/gauge.js` | UNCHANGED |
| `pages/index.js` | UNCHANGED |
| `pages/overview.js` | UNCHANGED |
| `pages/topology.js` | UNCHANGED |
| `GaugeContextPanels.js` | UNCHANGED |
| Node inspector behavior | UNCHANGED |
| Topology data values | UNCHANGED — no id/name/grounding/count modifications |
| Business ontology / BOML | UNCHANGED |

# GAUGE.TOPOLOGY.ADDON.RESTORE.INSPECTOR.AND.PRESENTATION.01 — Contract

## Contract Identity

- ID: GAUGE.TOPOLOGY.ADDON.RESTORE.INSPECTOR.AND.PRESENTATION.01
- Type: COMPONENT RESTORATION + PRESENTATION UPGRADE
- Mode: STRICT RESTORATION
- Branch: wip/gauge-psee-hygiene-snapshot
- Date: 2026-04-13

---

## Purpose

Restore the topology node inspector (click node → full detail view) in `TopologyAddon.js`
and upgrade the overall topology add-on presentation from flat inline output to
product-grade quality with structured blocks, CSS classes, and a full `NodeInspector` panel.

---

## Scope

| File | Change |
|------|--------|
| `app/gauge-product/components/TopologyAddon.js` | Full rewrite: inspector, selection state, structured tree, NodeInspector panel |
| `app/gauge-product/styles/gauge.css` | Append `ta-*` CSS class block |

No other files modified.

---

## Behavioral Changes

### Selection Model

- Previous: `expandedNodes` Set (multi-expand)
- Restored: `selectedNodeId` single-selection state
- `selectNode(nodeId)` toggles: same ID → deselect, different ID → select

### Two-Panel Layout

- `ta-body`: full-width tree when no node selected
- `ta-body--split`: 52% tree / flex:1 inspector when node selected
- Inspector scrollable, max-height 640px

### NodeInspector Sections

| Section | Fields |
|---------|--------|
| Identity | display_label, secondary_label (canonical ID, mono), raw label, resolved_label |
| Structural Context | type (mapped), depth, parent domain, children count, overlap peers, is_root, is_orphan |
| Provenance | binding_model_ref, source_artifact, source_origin, documented_taxonomy_source, structural_topology_source, containment_basis, path_pattern |
| Signals | signal_id, metric_name, value, unit (per signal) |
| Footer | source: binding_envelope.json |

### Presentation Upgrade

- Region cards: header clickable, surface rows with `—` indicator + ID badge
- Component blocks: `●` dot, signal count `~`, overlap badge `⟷`
- Show more/less button for surfaces (limit: 5 visible)
- Orphans rendered as inline chips
- Structural overlaps section with from→to rows
- Click-to-inspect hint when inspector is closed

---

## CSS Classes Added

All `ta-*` prefixed. Appended to `gauge.css` topology section.
Covers: states, header, body/split layout, regions, badges, surfaces, components,
overlaps, orphans, notes, inspector (header, type-row, sections, rows, signals, footer).

Node type color coding:
- `binding_context` → blue (`#58a6ff`)
- `capability_surface` → green (`#3fb950`)
- `component_entity` → amber (`#d29922`)

---

## Data Contract

- All displayed fields are direct projections of `binding_envelope.json` adapter output
- No semantic enrichment, no ranking, no synthetic values
- `null`/empty fields skipped by `InspRow` helper (no placeholder text)
- Fallback to `NODE_TYPE_LABELS[node.type] || node.type` for unknown types only

---

## Governance

- Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
- Stream boundary: L6 runtime (wip/gauge-psee-hygiene-snapshot domain)
- No ExecLens DEMO dependency introduced or modified
- No base Gauge layout (pages/index.js) modified
- TopologyAddon remains: default OFF, additive only, below column body

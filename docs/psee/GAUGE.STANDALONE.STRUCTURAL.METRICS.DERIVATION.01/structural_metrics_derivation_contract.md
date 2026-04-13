# GAUGE.STANDALONE.STRUCTURAL.METRICS.DERIVATION.01 — Contract

## Contract Identity

- ID: GAUGE.STANDALONE.STRUCTURAL.METRICS.DERIVATION.01
- Type: RUNTIME EXPOSURE CORRECTION
- Mode: STRICT DERIVATION — NO DATA CHANGE
- Branch: wip/gauge-psee-hygiene-snapshot
- Date: 2026-04-13

---

## Purpose

Expose topology-derived structural type counts (Domains, Surfaces, Components) in the
Gauge Topology Summary panel. Previously these fields rendered as `—` because
`TopologySummaryPanel` referenced non-existent `summary.*` keys.

**This is a runtime exposure correction only. No data, ontology, or upstream contract changed.**

---

## Root Cause

`TopologySummaryPanel` in `GaugeContextPanels.js` read from three fields that
`envelope_adapter.js → buildRenderModel` does not populate:

| Expected field                           | Actual status        |
|------------------------------------------|----------------------|
| `summary.domain_nodes_count`             | NOT IN SUMMARY OBJECT |
| `summary.capability_surface_nodes_count` | NOT IN SUMMARY OBJECT |
| `summary.component_entity_nodes_count`   | NOT IN SUMMARY OBJECT |
| `summary.overlap_structural_edges_count` | NOT IN SUMMARY (exists as `overlap_edges_count`) |

The `/api/topology` response DOES include `nodes[]` where each node carries a `type` field
(`binding_context`, `capability_surface`, `component_entity`). The counts were always available
— they were simply not being derived.

---

## Authoritative Source

- `/api/topology` → `nodes[]` → `node.type`
- Counting by type is non-transforming: only `.filter()` and `.length` applied

---

## Changes Made

Single file modified: `app/gauge-product/components/GaugeContextPanels.js`

### Change 1 — `TopologySummaryPanel`: derive structural counts from nodes[]

```js
// Before
{ label: 'Domains',    value: summary.domain_nodes_count ?? '—' },
{ label: 'Surfaces',   value: summary.capability_surface_nodes_count ?? '—' },
{ label: 'Components', value: summary.component_entity_nodes_count ?? '—' },
{ label: 'Structural overlaps', value: summary.overlap_structural_edges_count ?? '—', ... },

// After
const nodes      = topoData?.nodes || []
const domains    = topoData ? nodes.filter(n => n.type === 'binding_context').length    : '—'
const surfaces   = topoData ? nodes.filter(n => n.type === 'capability_surface').length : '—'
const components = topoData ? nodes.filter(n => n.type === 'component_entity').length   : '—'

{ label: 'Domains',    value: domains },
{ label: 'Surfaces',   value: surfaces },
{ label: 'Components', value: components },
{ label: 'Structural overlaps', value: summary.overlap_edges_count ?? '—', ... },
```

Fail-closed: if `topoData` is null (API unavailable), all three yield `'—'` — not `0`.

### Change 2 — `StructuralMetrics`: fix broken overlap field reference

```js
// Before
{ val: summary.overlap_structural_edges_count ?? '—', lbl: 'Overlaps' },

// After
{ val: summary.overlap_edges_count ?? '—', lbl: 'Overlaps' },
```

Same source (`/api/topology` → `summary`), correct key name.

---

## DO NOT MODIFY Compliance

| File                                              | Modified? |
|---------------------------------------------------|-----------|
| app/gauge-product/pages/api/topology.js           | NO        |
| app/gauge-product/pages/api/gauge.js              | NO        |
| app/gauge-product/lib/envelope_adapter.js         | NO        |
| app/gauge-product/pages/index.js                  | NO        |
| app/gauge-product/pages/topology.js               | NO        |
| app/gauge-product/components/TopologyAddon.js     | NO        |
| Business ontology files                           | NO        |
| ExecLens code                                     | NO        |

---

## Derivation Rules Applied

| Count      | Derivation                                              |
|------------|---------------------------------------------------------|
| Domains    | `nodes.filter(n => n.type === 'binding_context').length` |
| Surfaces   | `nodes.filter(n => n.type === 'capability_surface').length` |
| Components | `nodes.filter(n => n.type === 'component_entity').length` |
| Unknown space | Unchanged — sourced from `cf.unknown_space_count` (constraint_flags) |

---

## Governance

- No new API endpoints
- No adapter rewrites
- No topology data transformation beyond counting by type
- No ontology changes
- No ExecLens modifications
- Fail-closed: unavailable topology → `'—'` displayed, not `0`
- Unknown space logic unchanged

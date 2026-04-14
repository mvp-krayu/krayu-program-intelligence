# GAUGE Runtime Topology UI Tuning Validation
# GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.01 — Deliverable 2

## Identity

- Contract: GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.01
- Date: 2026-04-14
- Branch: wip/gauge-psee-hygiene-snapshot

---

## Validation Results

| check | description | result |
|-------|-------------|--------|
| V1 | All domains collapsed on initial load | PASS |
| V2 | Opening one domain collapses previously open domain | PASS |
| V3 | Capabilities remain clickable | PASS |
| V4 | Components remain clickable | PASS |
| V5 | Right inspection panel still updates correctly | PASS |
| V6 | Topology counts displayed remain unchanged | PASS |
| V7 | No API/data contract changes | PASS |
| V8 | No topology values changed | PASS |
| V9 | CSS/runtime file set minimized | PASS |

**PASS: 9/9**

---

## Detailed Evidence

### V1 — Domains collapsed on initial load

`expandedDomainId` initialized as `useState(null)`.

Surfaces render condition: `{isExpanded && visibleSurfaces.length > 0 && ...}`
Components render condition: `{isExpanded && components.map(...)}`

When `expandedDomainId === null`, `isExpanded = (null === rootId) = false` for all domains. Surfaces and components are not rendered. Only domain headers visible.

### V2 — Single-focus domain expansion

```javascript
function toggleDomain(domainId) {
  setExpandedDomainId(prev => prev === domainId ? null : domainId)
}
```

- Click domain A: `prev=null → expandedDomainId=A` (A expands)
- Click domain B: `prev=A → expandedDomainId=B` (A collapses, B expands)
- Click domain B again: `prev=B → expandedDomainId=null` (B collapses)

Only `expandedDomainId` controls which domain is expanded. Setting a new domain ID atomically removes the previous. State is simple string comparison — no array, no multi-select.

### V3 — Capabilities remain clickable

```javascript
{isExpanded && visibleSurfaces.length > 0 && (
  <div className="ta-surfaces">
    {visibleSurfaces.map(s => (
      <div onClick={() => selectNode(s.node_id)} ...>
```

`selectNode` is unchanged. `onClick` remains on every capability row. Only shown when `isExpanded` — they remain interactive when visible.

### V4 — Components remain clickable

```javascript
{isExpanded && components.map(comp => (
  <div onClick={() => selectNode(comp.node_id)} ...>
```

Same pattern as capabilities. `selectNode` unchanged.

### V5 — Detail panel behavior preserved

`selectedNodeId` state and `selectNode` function are unchanged:
```javascript
function selectNode(nodeId) {
  setSelectedNodeId(prev => prev === nodeId ? null : nodeId)
}
```

Domain header click calls `selectNode(rootId)` — inspector still updates when clicking domain header.
Capability/component click calls `selectNode(node_id)` — inspector still updates.
`NodeInspector` renders whenever `selectedNode` is non-null — unchanged.

### V6 — Topology counts unchanged

No data is modified. `nodes`, `roots`, `containment_tree`, `summary`, `constraint_flags` are all consumed identically from the API response. The `TopologySummaryPanel` in the context strip (not in TopologyAddon) reads `topoData.summary.nodes_count` directly — unchanged.

The `ta-meta` header in `TopologyView` displays:
```javascript
{rootsForGrid.length} region{...} · {summary.nodes_count} nodes
```

`rootsForGrid.length` = 17 (unchanged). `summary.nodes_count` = 148 (unchanged).

### V7 — No API/data contract changes

`git diff --name-only` shows only:
- `app/gauge-product/components/TopologyAddon.js`
- `app/gauge-product/styles/gauge.css`

No changes to `pages/api/topology.js`, `pages/api/gauge.js`, `envelope_adapter.js`, or any data source.

### V8 — No topology values changed

The diff touches only:
1. State initialization and toggle function (new behavior)
2. `isExpanded` conditional wrapping surfaces/components (conditional render only)
3. `ta-region--expanded` class addition (CSS class only)
4. Expand arrow JSX (new UI element, no data field)
5. Badge label text: "surfaces" → "cap", "components" → "comp" (display label abbreviation only — no data field change)

No `node_id`, `display_label`, `secondary_label`, `grounding`, `confidence`, `cross_domain_ref`, or count value is modified.

### V9 — File set minimized

| file | role | necessary |
|------|------|-----------|
| `TopologyAddon.js` | State and conditional render | YES — only file that owns topology expand/collapse state |
| `gauge.css` | Hierarchy visual differentiation | YES — expand arrow must be styled; collapsed/expanded domain visual distinction required |

2 files. No additional files required.

---

## Mandatory Question Answers

**Q1 — Which exact UI file now controls topology expand/collapse?**
`app/gauge-product/components/TopologyAddon.js` — `expandedDomainId` state in `TopologyView`.

**Q2 — Are domains collapsed by default?**
YES — `useState(null)` means no domain is expanded on initial render.

**Q3 — Can only one domain be expanded at a time?**
YES — `toggleDomain` sets `expandedDomainId` to a single value. Previous value is replaced atomically.

**Q4 — Was any topology data changed?**
NO.

**Q5 — Was the detail panel behavior preserved?**
YES — `selectNode` unchanged; inspector panel updates on domain/capability/component click as before.

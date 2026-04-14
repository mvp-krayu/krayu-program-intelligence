# GAUGE Runtime Topology UI Tuning Contract 02
# GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.02 — Deliverable 1

## Identity

- Contract: GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.02
- Date: 2026-04-14
- Branch: wip/gauge-psee-hygiene-snapshot
- Mode: STRICT UI TUNING — NO DATA/API CHANGES

---

## Objective

Set a guided default state on initial topology load: first domain open, first capability selected, detail panel pre-populated.

---

## Change Made

**File:** `app/gauge-product/components/TopologyAddon.js`
**Location:** `TopologyView` function — initial `useState` values only

### Before

```javascript
const [selectedNodeId,  setSelectedNodeId]  = useState(null)
const [expandedDomainId, setExpandedDomainId] = useState(null)  // null = all collapsed
```

### After

```javascript
const [expandedDomainId, setExpandedDomainId] = useState(() => {
  const roots   = data.roots   || []
  const orphans = new Set(data.orphans || [])
  return roots.find(r => !orphans.has(r)) || null
})
const [selectedNodeId, setSelectedNodeId] = useState(() => {
  const roots   = data.roots   || []
  const orphans = new Set(data.orphans || [])
  const firstDomain = roots.find(r => !orphans.has(r))
  if (!firstDomain) return null
  const tree = data.containment_tree || {}
  return tree[firstDomain]?.[0] || null
})
```

### Implementation Notes

- React lazy initializer pattern (`useState(() => ...)`) — initializer runs exactly once at mount
- `expandedDomainId` initial value: first non-orphan root ID (`DOMAIN-01`)
- `selectedNodeId` initial value: first capability in first domain (`CAP-01` — "Vehicle Sensor Collection")
- If data arrives empty (`roots=[]`), both fall back to `null` — null-safe
- No behavior change after initialization — `toggleDomain` and `selectNode` work identically

---

## Resulting Default State

| state | value on load |
|-------|---------------|
| `expandedDomainId` | `DOMAIN-01` (Edge Data Acquisition) |
| `selectedNodeId` | `CAP-01` (Vehicle Sensor Collection) |
| Detail panel | Populated with CAP-01 node data |
| All other domains | Collapsed |

---

## No-Change Scope

| item | status |
|------|--------|
| topology API | UNCHANGED |
| canonical_topology.json | UNCHANGED |
| envelope_adapter.js | UNCHANGED |
| gauge.js | UNCHANGED |
| All page files | UNCHANGED |
| GaugeContextPanels.js | UNCHANGED |
| toggleDomain() behavior | UNCHANGED |
| selectNode() behavior | UNCHANGED |
| Inspector rendering | UNCHANGED |
| CSS | UNCHANGED |
| Any data value | UNCHANGED |

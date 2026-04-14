# GAUGE Runtime Topology UI Tuning Validation 02
# GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.02 — Deliverable 2

## Identity

- Contract: GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.02
- Date: 2026-04-14
- Branch: wip/gauge-psee-hygiene-snapshot

---

## Validation Results

| check | description | result |
|-------|-------------|--------|
| V1 | First domain open on load | PASS |
| V2 | All other domains collapsed on load | PASS |
| V3 | First capability selected on load | PASS |
| V4 | Right detail panel populated on load | PASS |
| V5 | Single-focus domain expansion still works | PASS |
| V6 | No topology data changed | PASS |

**PASS: 6/6**

---

## Evidence

### V1 — First domain open on load

```javascript
useState(() => {
  const roots   = data.roots   || []
  const orphans = new Set(data.orphans || [])
  return roots.find(r => !orphans.has(r)) || null
})
```

From canonical topology: `data.roots[0] = 'DOMAIN-01'`, `data.orphans = []`.
Result: `expandedDomainId = 'DOMAIN-01'` on first render.

`isExpanded = (expandedDomainId === rootId)` → true only for DOMAIN-01.

### V2 — All other domains collapsed

`expandedDomainId` is a single string. Only `DOMAIN-01` matches `isExpanded` check.
Domains DOMAIN-02 through DOMAIN-17: `isExpanded = false` → surfaces and components not rendered.

### V3 — First capability selected on load

```javascript
useState(() => {
  const firstDomain = roots.find(r => !orphans.has(r))  // DOMAIN-01
  const tree = data.containment_tree || {}
  return tree[firstDomain]?.[0] || null  // tree['DOMAIN-01'][0] = 'CAP-01'
})
```

`data.containment_tree['DOMAIN-01'] = ['CAP-01','CAP-02','CAP-03','CAP-04']`
Result: `selectedNodeId = 'CAP-01'` on first render.

Validation script output:
```
firstDomain: DOMAIN-01
firstCap: CAP-01
capability name: Vehicle Sensor Collection
```

### V4 — Detail panel populated on load

```javascript
const selectedNode = selectedNodeId ? nodeIndex[selectedNodeId] : null
```

`selectedNodeId = 'CAP-01'` → `nodeIndex['CAP-01']` resolves to the CAP-01 node object.
`selectedNode` is non-null on first render → `NodeInspector` renders immediately.

The inspector shows:
- Display name: Vehicle Sensor Collection
- Canonical ID: CAP-01
- Type: Capability Surface
- Depth: 1
- Grounding: GROUNDED

### V5 — Single-focus domain expansion preserved

`toggleDomain` function unchanged:
```javascript
function toggleDomain(domainId) {
  setExpandedDomainId(prev => prev === domainId ? null : domainId)
}
```

Post-initialization behavior is identical to GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.01.
Opening a different domain sets `expandedDomainId` to that domain, collapsing DOMAIN-01.

### V6 — No topology data changed

Only `useState` initializer values changed. No data field, count, id, name, grounding, or API response modified.

`git diff --name-only` shows only `app/gauge-product/components/TopologyAddon.js`.

---

## Mandatory Question Answers

**Q1 — Is the first domain open by default?**
YES — `expandedDomainId` initialized to `DOMAIN-01`.

**Q2 — Is one capability selected by default?**
YES — `selectedNodeId` initialized to `CAP-01` (Vehicle Sensor Collection).

**Q3 — Is the detail panel populated on first render?**
YES — `selectedNode = nodeIndex['CAP-01']` is non-null; `NodeInspector` renders on load.

**Q4 — Were any topology values changed?**
NO.

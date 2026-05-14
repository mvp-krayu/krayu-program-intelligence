# Graph Label Check
## PI.LENS.WORKSPACE.GRAPH-OVERVIEW-START.01

**Date:** 2026-05-03

---

## Label Matrix

| State | `activeMode` | `isOverview` | `graphLabel` (before) | `graphLabel` (after) |
|-------|-------------|-------------|----------------------|---------------------|
| Initial load | `null` | `true` | `'full vault structure'` | **`'OVERVIEW'`** ✓ |
| Zone activated, no query | `null` | `false` | `'full vault structure'` | `'full vault structure'` (unchanged) |
| WHY query | `'WHY'` | `false` | `'structural scope'` | `'structural scope'` (unchanged) |
| EVIDENCE query | `'EVIDENCE'` | `false` | `'zone evidence focus'` | `'zone evidence focus'` (unchanged) |
| TRACE query | `'TRACE'` | `false` | `'trace paths'` | `'trace paths'` (unchanged) |
| After reset | `null` | `true` | `'full vault structure'` | **`'OVERVIEW'`** ✓ |

## Header Display

Panel header in JSX:
```jsx
<span className="ws-graph-panel-mode">{graphLabel}</span>
```

Initial state: renders `OVERVIEW`.  
Mode transitions: render mode-specific labels (unchanged behavior).

## Condition

```js
const graphLabel = isOverview
  ? 'OVERVIEW'
  : activeMode ? (GRAPH_MODE_LABEL[activeMode] ?? '') : 'full vault structure'
```

`isOverview` is the authoritative gate. No separate `graphMode` state introduced — the existing `isOverview` derivation is sufficient and correct.

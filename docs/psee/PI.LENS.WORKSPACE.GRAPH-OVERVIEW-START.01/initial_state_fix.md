# Initial State Fix
## PI.LENS.WORKSPACE.GRAPH-OVERVIEW-START.01

**Date:** 2026-05-03

---

## Changes to workspace.js

### 1. Removed `WS_STATE_KEY` constant

```js
// REMOVED:
const WS_STATE_KEY = 'ws_state'
```

### 2. Removed sessionStorage restore effect

```js
// REMOVED:
useEffect(() => {
  if (pageState !== 'ready' || !zonesData) return
  try {
    const saved = sessionStorage.getItem(WS_STATE_KEY)
    if (!saved) return
    const { zoneId, mode, qsData } = JSON.parse(saved)
    const zone = zonesData.zones.find(z => z.zone_id === zoneId)
    if (zone) {
      setActiveZone(zone)
      if (mode)   setActiveMode(mode)
      if (qsData) setActiveQsData(qsData)
    }
  } catch {}
}, [pageState, zonesData])
```

This was the only path that caused auto-zone selection on load.

### 3. Removed sessionStorage persist effect

```js
// REMOVED (dead code once restore is gone):
useEffect(() => {
  if (!activeZone) return
  try {
    sessionStorage.setItem(WS_STATE_KEY, JSON.stringify({
      zoneId: activeZone.zone_id,
      mode:   activeMode,
      qsData: activeQsData,
    }))
  } catch {}
}, [activeZone, activeMode, activeQsData])
```

### 4. Removed `sessionStorage.removeItem` from `handleReset`

```js
// REMOVED from handleReset:
try { sessionStorage.removeItem(WS_STATE_KEY) } catch {}
```

### 5. Fixed `graphLabel`

```js
// BEFORE:
const graphLabel = activeMode ? (GRAPH_MODE_LABEL[activeMode] ?? '') : 'full vault structure'

// AFTER:
const graphLabel = isOverview
  ? 'OVERVIEW'
  : activeMode ? (GRAPH_MODE_LABEL[activeMode] ?? '') : 'full vault structure'
```

---

## No Other Changes

- WHY / EVIDENCE / TRACE button behavior: UNCHANGED
- `handleGraphQuery` logic: UNCHANGED
- `handleGraphNodeSelect` logic: UNCHANGED
- `handleActivate`: UNCHANGED
- `isOverview` computation: UNCHANGED (`!activeZone && !activeMode && !activeQsData`)
- `graphZone` fallback: UNCHANGED (`activeZone ?? zonesData?.zones?.[0] ?? null`)
- VaultGraph component: NOT MODIFIED
- graph_state.json: NOT MODIFIED
- API endpoints: NOT MODIFIED

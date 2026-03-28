# A.7 — Projection Purification Record

Stream: A.7 | Projection Purification | Fail-Closed | Non-Destructive
Authority: A.6 (2e21887), A.5B PASS (2c539e8), A.5C (49e4c32), A.4, A.3, A.2R, A.2G, canonical-layer-model.md (00.2)
Runtime target: index.js HEAD 2e21887 (pre-purification)
Branch: feature/51-9-runtime-convergence
Execution date: 2026-03-28

---

## Purification Summary

Before A.7: `index.js` contained orchestration logic in the projection layer:
- `getPanelExpanded` computed panel state using `computePanelState` and mode branches (GUIDED/rawStep/ENTRY/FREE)
- Persona auto-open `useEffect` directly mutated `openPanels` via `setOpenPanels`
- `TraversalEngine` imported 7 symbols beyond what the projection layer requires

After A.7: `index.js` is a pure projection of CONTROL state:
- `getPanelExpanded` is a pure lookup into `resolvedPanelState` (pre-computed by CONTROL, carried in `applyControlResponse`)
- Persona auto-open `useEffect` removed entirely (was a no-op for all current personas; PERSONA_GUIDED_FLOWS guard exited early in every case)
- `TraversalEngine` import pruned to `getFlowNodes` and `PANEL_STATES` only

---

## Changes Made

### 1. TraversalEngine import pruned

| Before | After |
|--------|-------|
| `TRAVERSAL_FLOWS, PERSONA_AUTO_OPEN, getFlowPanels, getFlowNodes, PANEL_STATES, D2_PANEL_MAP, PERSONA_DEPTH_ENVELOPE, computePanelState, validatePanelTransition` | `getFlowNodes, PANEL_STATES` |

**Removed symbols:**
- `TRAVERSAL_FLOWS` — referenced only by removed constants / CONTROL now holds flow data
- `PERSONA_AUTO_OPEN` — referenced only by removed persona auto-open useEffect
- `getFlowPanels` — no call sites in index.js post-A.6
- `D2_PANEL_MAP` — no call sites in index.js post-A.6
- `PERSONA_DEPTH_ENVELOPE` — no call sites in index.js post-A.6
- `computePanelState` — replaced by `resolvedPanelState` lookup [A.7]
- `validatePanelTransition` — not applied in index.js per 51.9B; no remaining call sites

**Kept:**
- `getFlowNodes` — used in ENL node traversal rendering (not orchestration)
- `PANEL_STATES` — used in `getPanelExpanded` lookup (ACTIVE/EXPANDED comparison)

---

### 2. `resolvedPanelState` React state added

```javascript
const [resolvedPanelState, setResolvedPanelState] = useState(
  () => CONTROL(INTENTS.INIT, {}, null).newSnapshot.resolvedPanelState
)
```

Initialized from `CONTROL(INTENTS.INIT)` output — identical to the initial state the runtime would have computed via the old `getPanelExpanded` logic. Updated in every `applyControlResponse` call via `setResolvedPanelState(s.resolvedPanelState)`.

---

### 3. `applyControlResponse` updated

Added: `setResolvedPanelState(s.resolvedPanelState)` — propagates CONTROL-computed panel state to projection layer on every intent response.

---

### 4. `getPanelExpanded` replaced

**Before (A.6):**
```javascript
const getPanelExpanded = useCallback((panelId) => {
  if (panelId === 'situation' || panelId === 'persona') return openPanels.includes(panelId)
  if (demoActive) {
    if (rawStepActive && panelId === 'evidence') return openPanels.includes('evidence')
    const state = computePanelState(panelId, openPanels, traversalHistory, enlPersona, demoActive, freeMode)
    return state === PANEL_STATES.ACTIVE || state === PANEL_STATES.EXPANDED
  }
  return openPanels.includes(panelId)
}, [openPanels, traversalHistory, enlPersona, demoActive, freeMode, rawStepActive])
```

**After (A.7):**
```javascript
const getPanelExpanded = useCallback((panelId) => {
  const state = resolvedPanelState?.[panelId]
  return state === PANEL_STATES.ACTIVE || state === PANEL_STATES.EXPANDED
}, [resolvedPanelState])
```

**Behavior equivalence:** CONTROL's `_resolveAllPanelStates` uses the same conditional logic as the replaced `getPanelExpanded`: simple panels mapped directly from openPanels (ACTIVE/AVAILABLE), GUIDED mode uses `computePanelState`, rawStep exception preserved inside CONTROL. Output is structurally identical for all 44 A.5B-covered scenarios.

---

### 5. Persona auto-open useEffect removed

**Before (A.6):**
```javascript
useEffect(() => {
  if (!enlPersona || !demoActive) return
  if (PERSONA_GUIDED_FLOWS[enlPersona]) return  // exits early for ALL current personas
  const autoPanels = PERSONA_AUTO_OPEN[enlPersona]
  if (!autoPanels || autoPanels.length === 0) return
  setOpenPanels(prev => { ... })
}, [enlPersona, demoActive])
```

**After (A.7):** Removed entirely. Replaced with comment noting removal rationale.

**Safety:** The `if (PERSONA_GUIDED_FLOWS[enlPersona]) return` guard exits early for every currently-supported persona (EXECUTIVE, CTO, ANALYST all have PERSONA_GUIDED_FLOWS entries). The `setOpenPanels` body was never reached. Removal has no behavioral effect.

---

## Behavior Drift Confirmation

**None.**

- `getPanelExpanded` replacement is behavior-preserving: CONTROL's `_resolveAllPanelStates` uses identical branching logic; `resolvedPanelState` is updated on every CONTROL response before the next render
- Persona auto-open useEffect was a confirmed no-op for all current personas
- TraversalEngine symbols removed had no call sites in index.js post-A.6

---

## Projection Purity — Final State

After A.7, `index.js` contains:
- **Projection only**: render tree, `getPanelExpanded` (pure lookup from CONTROL state), display-only reads
- **Adapter only**: `captureState` (read), `applyControlResponse` (write via CONTROL output), intent routing wrappers
- **No orchestration logic**: no branching on mode/state to compute UI behavior
- **No direct orchestration state mutation**: all orchestration state flows through CONTROL

Remaining non-CONTROL state mutations:
- `setQueryData`, `setLoading`, `setError`, `setEnlPersonaData` — data state, outside CONTROL scope by design
- `openPanel` in demo stage useEffect — uncovered Path C, explicitly preserved [A.6, A.7]
- `setOpenPanels` in demo stage useEffect — same uncovered Path C

---

## File Modified

`app/execlens-demo/pages/index.js` only.

No other files modified. Control.js, TraversalEngine.js, validation artifacts unchanged.

---

## Uncovered Paths — Unchanged

All 4 uncovered paths from A.5B/A.6 remain acknowledged and untouched per A.7 contract.

| Uncovered Path | A.7 Handling |
|----------------|-------------|
| DEMO_NEXT Path B (legacy selectedFlow) | Not touched. CONTROL routes internally. |
| DEMO_NEXT Path C (standard stage mode) | Not touched. Demo stage useEffect preserved as-is. |
| QUERY_SELECT null mid-demo | Not touched. Runtime behavior undefined — uncovered path acknowledged. |
| DEMO_START from mid-demo without prior EXIT | Not touched. CONTROL handles defensively. |

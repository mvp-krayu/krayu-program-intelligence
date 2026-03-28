# A.6 — CONTROL Authority Switch Record

Stream: A.6 | Authority Transfer | Fail-Closed | Non-Destructive
Authority: A.5, A.5C (49e4c32), A.5B PASS (2c539e8), A.4, A.3, A.2R, A.2G, canonical-layer-model.md (00.2)
Runtime target: index.js HEAD a5691c3 (pre-switch)
Branch: feature/51-9-runtime-convergence
Execution date: 2026-03-28

---

## Authority Transfer Summary

Before A.6: `index.js` held orchestration authority — intent handlers mutated React state directly.

After A.6: `CONTROL.js` is the sole authority for all state transitions. `index.js` is adapter + projection only. Every intent is routed through `CONTROL(intent, runtimeContext, snapshot) → CONTROL_RESPONSE`, then applied atomically via `applyControlResponse`.

---

## Intent → CONTROL Routing Map

| Intent | Handler / Site | CONTROL Call |
|--------|---------------|--------------|
| INIT | useState initializations | Not routed (initial state unchanged; CONTROL.INIT shape matches useState) |
| PANEL_TOGGLE | `handleToggle` (useCallback) | `CONTROL(INTENTS.PANEL_TOGGLE, { panelId }, snap)` |
| DEMO_START | `handleStartDemo` | `CONTROL(INTENTS.DEMO_START, {}, snap)` |
| DEMO_NEXT | `handleDemoNext` | `CONTROL(INTENTS.DEMO_NEXT, {}, snap)` |
| DEMO_EXIT | `handleDemoExit` | `CONTROL(INTENTS.DEMO_EXIT, {}, snap)` |
| QUERY_SELECT | `handleQuerySelect` (new, replaces `setSelectedQuery` onSelect) | `CONTROL(INTENTS.QUERY_SELECT, { query }, snap)` |
| PERSONA_SELECT | `handlePersonaSelect` (new, replaces `setEnlPersona` onPersonaChange) | `CONTROL(INTENTS.PERSONA_SELECT, { persona }, snap)` |
| AUTO_START | auto-start useEffect body | `CONTROL(INTENTS.AUTO_START, {}, snap)` |

All 7 active intents routed. INIT not routed (initial React state matches CONTROL.INIT output exactly — validated in A.5B).

---

## Runtime Mutation Blocks Removed

| Removed | Location | Replaced by |
|---------|----------|-------------|
| `setDemoComplete`, `setDemoActive`, etc. in `handleStartDemo` | lines 400–426 | `CONTROL(DEMO_START)` → `applyControlResponse` |
| `setDemoComplete`, `setGuidedStepIndex`, `setOpenPanels`, etc. in `handleDemoNext` (all 3 paths) | lines 428–486 | `CONTROL(DEMO_NEXT)` → `applyControlResponse` |
| `setFreeMode`, `setDemoActive`, `setTraversalHistory`, etc. in `handleDemoExit` | lines 488–499 | `CONTROL(DEMO_EXIT)` → `applyControlResponse` |
| `togglePanel` helper | lines 190–198 | removed; toggle mutations go through CONTROL |
| `setGuidedStepIndex`, `setDemoActive`, `setDemoComplete`, etc. in persona change reset useEffect | lines 308–327 | entire useEffect removed; CONTROL.PERSONA_SELECT handles atomically |
| `setDemoComplete`, `setDemoActive`, `setOpenPanels`, etc. in auto-start useEffect | lines 367–378 | body replaced with `CONTROL(AUTO_START)` → `applyControlResponse` |
| `setEnlPersona(null)`, `setTraversalNodeIndex(0)` in query fetch useEffect | lines 257–259 | removed; CONTROL.QUERY_SELECT handles; query fetch now data-only |
| `PERSONA_DEFAULT_FLOW` constant | lines 54–58 | removed; CONTROL inlines it |
| `TOTAL_STAGES` constant | line 93 | removed; CONTROL inlines it |
| `prevEnlPersonaRef` | line 173 | removed; no longer needed after persona change useEffect removal |
| `const togglePanel` | lines 190–198 | removed; CONTROL handles all toggle mutations |

---

## Added / New

| Addition | Purpose |
|----------|---------|
| `import { CONTROL, buildSnapshot, INTENTS }` | CONTROL adapter import |
| `captureState()` | Snapshots current React state into CONTROL input shape |
| `applyControlResponse(response)` | Unpacks CONTROL_RESPONSE.newSnapshot to all React state setters atomically |
| `handleQuerySelect` (useCallback) | Routes QUERY_SELECT through CONTROL; replaces `setSelectedQuery` as onSelect prop |
| `handlePersonaSelect` (useCallback) | Routes PERSONA_SELECT through CONTROL; replaces `setEnlPersona` as onPersonaChange prop |

---

## Behavior Drift Confirmation

**None observed (qualitative + structural analysis).**

Every CONTROL handler was validated to produce identical state outputs to the runtime for all 44 covered events (A.5B PASS, commit 2c539e8). The authority switch replaces imperative state mutation with CONTROL-mediated state application — the resulting state transitions are identical.

Runtime-specific mechanisms preserved unchanged:
- `exitedRef` (defense-in-depth auto-start suppression)
- `autoStartPrevRef` (persona/query change detection for auto-start)
- `getPanelExpanded` and `computePanelState` wiring (51.9B, unchanged)
- Viewport scroll useEffect (DOM side effect, unchanged)
- ⌘K keyboard handler (calls `handleDemoExit`, unchanged)

---

## Uncovered Paths — Confirmation Untouched

| Uncovered Path | Handling |
|----------------|---------|
| DEMO_NEXT Path B (legacy selectedFlow) | Not touched. CONTROL routes this path internally. Not tested. |
| DEMO_NEXT Path C (standard stage mode) | Not touched. Demo stage useEffect (`setSelectedQuery('GQ-003')`, `openPanel`) preserved as-is for uncovered Path C side effects. Comment added. |
| QUERY_SELECT null mid-demo | Not touched. CONTROL handles as validated (traversalHistory not reset). Runtime behavior for this case is undefined — uncovered path acknowledged. |
| DEMO_START from mid-demo without prior EXIT | Not touched. CONTROL handles defensively. Not tested. |

---

## Projection Purity Confirmation

`index.js` after A.6 contains:
- **Projection only**: render tree, getPanelExpanded, display-only reads from state
- **Adapter only**: captureState (read), applyControlResponse (write via CONTROL output), intent routing wrappers
- **No decision logic**: all branching in CONTROL, not in the UI or in event handlers
- **No orchestration state computation**: all derived from CONTROL_RESPONSE

The only non-CONTROL state mutations remaining:
- `setQueryData`, `setLoading`, `setError`, `setEnlPersonaData` — data state, not orchestration; outside CONTROL's scope by design
- `openPanel` in demo stage useEffect — uncovered Path C, explicitly noted
- `setOpenPanels` in persona auto-open useEffect — effectively no-op (guarded by `PERSONA_GUIDED_FLOWS` return for all current personas)
- `setSelectedQuery('GQ-003')` in demo stage useEffect — data-loading side effect for uncovered Path C

---

## File Modified

`app/execlens-demo/pages/index.js` only.

No other files modified. Control.js, TraversalEngine.js, validation artifacts unchanged.

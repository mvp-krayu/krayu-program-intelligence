# DEMO TRUTH REGISTRY — Stream B.1
## ExecLens Demo Surface — Evidence-Backed System Truths

---

## Extraction Basis

Source commit: `df3eaf6` on `feature/51-9-runtime-convergence`
Closure authority: `docs/pios/51.CLOSE/closure.md`, `validation_receipt.md`
Extraction date: 2026-03-29

---

## Format

Each truth follows the 5-part model:

> **DEMO OBSERVATION** — what is directly observable in the demo surface
> **CONTROL MAPPING** — which CONTROL handler(s) govern this behavior
> **EVIDENCE SOURCE** — file:line citations
> **SYSTEM TRUTH** — the bounded, defensible statement
> **CLAIM BOUNDARY** — what this truth does NOT assert

---

## Category 1: ENTRY & ACTIVATION MODEL

### T1.1 — Query is the primary activation trigger

**DEMO OBSERVATION:** QuerySelector is always enabled at ENTRY. The entry strip labels it Step 1. The Start button is disabled when query is absent.

**CONTROL MAPPING:** `DEMO_START` fails if `selectedQuery` is null (Control.js:432–433). `AUTO_START` fails if `selectedQuery` is null (Control.js:477–479). No guard blocks QuerySelector from receiving input.

**EVIDENCE SOURCE:**
- `index.js:502` — `disabled={false}` on QuerySelector
- `index.js:469` — Start button `disabled={!enlPersona || !selectedQuery}`
- `Control.js:432–433` — DEMO_START: `if (!selectedQuery) return FAIL`
- `Control.js:477–479` — AUTO_START: `if (!selectedQuery) return FAIL`
- `docs/pios/51.CLOSE/validation_receipt.md` V5

**SYSTEM TRUTH:** QuerySelector is never disabled. Query selection is required before guided execution can begin. The Start button is disabled until both query and persona are present.

**CLAIM BOUNDARY:** Does not claim query determines analysis content. Query is the activation trigger and the API fetch key — not the analysis logic.

---

### T1.2 — Persona is a context modifier that determines the traversal sequence

**DEMO OBSERVATION:** Selecting a persona completes the entry strip (Step 2 becomes `guided-step-done`). Persona does not enable QuerySelector — that is always enabled.

**CONTROL MAPPING:** `DEMO_START` gates on `selectedPersona` non-null (Control.js:429–431). Persona determines which `PERSONA_GUIDED_FLOWS` entry is used (Control.js:436). `PERSONA_SELECT` always resets `guidedStepIndex` to 0 (Control.js:360).

**EVIDENCE SOURCE:**
- `index.js:459–462` — Step 2 styling conditional on `enlPersona`
- `index.js:469` — Start button `disabled={!enlPersona || !selectedQuery}`
- `Control.js:429–431` — DEMO_START persona guard
- `Control.js:436` — `PERSONA_GUIDED_FLOWS[selectedPersona]`

**SYSTEM TRUTH:** Persona is required alongside query before Start is enabled. Persona determines the guided panel traversal sequence applied during execution. It does not gate query input.

**CLAIM BOUNDARY:** Does not claim persona changes the underlying data returned by the API. Persona determines traversal order, not data content.

---

### T1.3 — ENTRY surface renders query zone, situation panel, and persona panel only

**DEMO OBSERVATION:** At ENTRY (demoActive=false, freeMode=false), no signals, evidence, or narrative panels appear.

**CONTROL MAPPING:** `showExtendedPanels = demoActive || freeMode` (index.js:415). At ENTRY both are false; `showExtendedPanels` evaluates to false. The three downstream panels are wrapped in `{showExtendedPanels && ...}`.

**EVIDENCE SOURCE:**
- `index.js:415` — `const showExtendedPanels = demoActive || freeMode`
- `index.js:564` — signals panel: `{showExtendedPanels && ...}`
- `index.js:590` — evidence panel: `{showExtendedPanels && ...}`
- `index.js:620` — narrative panel: `{showExtendedPanels && ...}`
- `docs/pios/51.CLOSE/validation_receipt.md` V3

**SYSTEM TRUTH:** Signals, evidence, and narrative panels are not rendered at ENTRY. Situation and persona panels are always rendered (no showExtendedPanels gate on them).

**CLAIM BOUNDARY:** Does not claim situation or persona panels are expanded at ENTRY — only that they are rendered. Expanded state is governed by CONTROL via `resolvedPanelState`.

---

## Category 2: PROJECTION PURITY

### T2.1 — All orchestration state transitions are routed through CONTROL

**DEMO OBSERVATION:** Eight user-triggered or system-triggered intents all call CONTROL before updating React state.

**CONTROL MAPPING:** All 8 intents handled exclusively in Control.js §5. `applyControlResponse` is the sole site for orchestration state setter calls in index.js.

**EVIDENCE SOURCE:**
- `index.js:149` — INIT via `CONTROL(INTENTS.INIT, {}, null)`
- `index.js:198–202` — PANEL_TOGGLE via `CONTROL(INTENTS.PANEL_TOGGLE, ...)`
- `index.js:298–300` — AUTO_START via `CONTROL(INTENTS.AUTO_START, ...)`
- `index.js:322–328` — DEMO_START via `CONTROL(INTENTS.DEMO_START, ...)`
- `index.js:333–337` — DEMO_NEXT via `CONTROL(INTENTS.DEMO_NEXT, ...)`
- `index.js:341–346` — DEMO_EXIT via `CONTROL(INTENTS.DEMO_EXIT, ...)`
- `index.js:350–355` — QUERY_SELECT via `CONTROL(INTENTS.QUERY_SELECT, ...)`
- `index.js:359–364` — PERSONA_SELECT via `CONTROL(INTENTS.PERSONA_SELECT, ...)`
- `index.js:172–188` — all orchestration setters inside `applyControlResponse` only
- `docs/pios/51.CLOSE/validation_receipt.md` V6, V10

**SYSTEM TRUTH:** No orchestration state setter (`setOpenPanels`, `setDemoActive`, `setGuidedStepIndex`, `setEnlPersona`, `setSelectedQuery`, `setFreeMode`, `setResolvedPanelState`, etc.) is called outside `applyControlResponse`. All transitions are CONTROL-mediated.

**CLAIM BOUNDARY:** Data-fetch state setters (`setQueryData`, `setLoading`, `setError`, `setEnlPersonaData`) are managed outside CONTROL in a fetch `useEffect`. These are not orchestration state.

---

### T2.2 — index.js is a pure projection adapter for all orchestration state

**DEMO OBSERVATION:** index.js does not compute orchestration decisions independently. The captureState → CONTROL → applyControlResponse pattern applies for every intent.

**CONTROL MAPPING:** `captureState()` reads current React state (index.js:164–168). `CONTROL(intent, ctx, snap)` returns `CONTROL_RESPONSE`. `applyControlResponse(response)` unpacks `newSnapshot` to setters (index.js:172–188).

**EVIDENCE SOURCE:**
- `index.js:164–188` — captureState / applyControlResponse definitions
- `docs/pios/51.CLOSE/closure.md` §4 "Runtime architecture"

**SYSTEM TRUTH:** index.js does not make orchestration decisions. It captures state, invokes CONTROL, and applies the response.

**CLAIM BOUNDARY:** index.js contains local UI derivations: `showExtendedPanels` (index.js:415) and `activePanelId` (index.js:369–384). These are presentation-layer projections derived from CONTROL-produced state. They are not orchestration authority.

---

### T2.3 — resolvedPanelState is derived exclusively by CONTROL and consumed read-only by index.js

**DEMO OBSERVATION:** Panel expanded state (whether a panel is open or closed) is not computed anywhere in index.js.

**CONTROL MAPPING:** `_resolveAllPanelStates` is called inside `_rebuildDerivedFields` in Control.js; result is stored in `newSnapshot.resolvedPanelState`. `setResolvedPanelState` is called only inside `applyControlResponse` (index.js:188).

**EVIDENCE SOURCE:**
- `index.js:188` — `setResolvedPanelState(s.resolvedPanelState)` — inside applyControlResponse only
- `index.js:205–211` — `getPanelExpanded` reads `resolvedPanelState` read-only
- `Control.js:151–160` — `_resolveAllPanelStates`
- `Control.js:225–242` — `_rebuildDerivedFields` calls it
- `docs/pios/51.CLOSE/validation_receipt.md` V10

**SYSTEM TRUTH:** `resolvedPanelState` is a CONTROL-produced map of panelId → PANEL_STATE string. index.js reads it through `getPanelExpanded` and never mutates it directly.

**CLAIM BOUNDARY:** `activePanelId` (which panel receives visual emphasis and scroll focus) is computed in index.js as a useMemo derivation from `resolvedPanelState`. This is distinct from `resolvedPanelState` itself — it is a secondary presentation derivation.

---

## Category 3: FLOW GOVERNANCE

### T3.1 — PERSONA_GUIDED_FLOWS is the canonical traversal definition, exported from Control.js

**DEMO OBSERVATION:** Three personas produce distinct panel traversal orders during guided execution.

**CONTROL MAPPING:** `PERSONA_GUIDED_FLOWS` is a named export from Control.js (A.12). It is imported in index.js from Control.js — no local duplicate exists (A.12 eliminated it).

**EVIDENCE SOURCE:**
- `Control.js:55–72` — PERSONA_GUIDED_FLOWS definition
- `index.js:57` — `import { CONTROL, buildSnapshot, INTENTS, PERSONA_GUIDED_FLOWS } from '../components/Control'`
- `docs/pios/51.CLOSE/validation_receipt.md` V8

**SYSTEM TRUTH:**
- EXECUTIVE: narrative → signals → evidence (3 steps)
- CTO: signals → evidence → narrative (3 steps)
- ANALYST: evidence → signals → narrative → raw/evidence (4 steps; step 4 is rawStep=true)

**CLAIM BOUNDARY:** These sequences are static definitions. They determine which panels are opened in sequence — not what data those panels display. No claim is made that the sequence is analytically optimal.

---

### T3.2 — DEMO_START requires both selectedPersona and selectedQuery; opens first step panel on success

**DEMO OBSERVATION:** Clicking "Start Lens Demo" transitions to GUIDED mode. The first panel in the persona's sequence opens alongside the situation panel.

**CONTROL MAPPING:** Control.js:429–433 gates on `selectedPersona` and `selectedQuery`. On success: derives `firstPanel` from `PERSONA_GUIDED_FLOWS[selectedPersona][0].panelId`; sets `demoActive=true`, `demoStage=1`, `guidedStepIndex=0`, `freeMode=false`.

**EVIDENCE SOURCE:**
- `Control.js:428–463` — DEMO_START handler
- `Control.js:442–443` — `_openPanelsForStep(firstPanel)` → `['situation', firstPanel]`
- `index.js:322–328` — handleStartDemo

**SYSTEM TRUTH:** DEMO_START is fail-closed. On success, `openPanels = ['situation', firstPanel]`, `demoActive=true`. `freeMode` is explicitly cleared.

**CLAIM BOUNDARY:** Does not claim the demo content is generated at start time. Panel content is loaded from API response triggered by query selection.

---

### T3.3 — DEMO_NEXT advances through PERSONA_GUIDED_FLOWS steps; terminal step sets demoComplete=true

**DEMO OBSERVATION:** Pressing Next reveals the next panel in sequence. After the last step, the guided controls disappear and the surface returns to ENTRY-like state.

**CONTROL MAPPING:** DEMO_NEXT Path A (Control.js:526–572). At `nextIndex >= steps.length`: `demoComplete=true`, `demoActive=false`, `selectedPersona=null`, `openPanels=['situation']`. DemoController hides when `active={demoActive && !demoComplete}` (index.js:644).

**EVIDENCE SOURCE:**
- `Control.js:527–572` — DEMO_NEXT Path A
- `Control.js:530–546` — terminal state handling
- `index.js:644` — DemoController `active` prop

**SYSTEM TRUTH:** Final step completion sets `demoComplete=true`, `demoActive=false`, clears persona, collapses panels to `['situation']`. The DemoController bar is hidden. POST_COMPLETION surface is rendered.

**CLAIM BOUNDARY:** Path B (`selectedFlow`-based) and Path C (stage-based) exist in CONTROL code but are annotated DORMANT-GOVERNED LEGACY (A.14). They are CONTROL-unreachable under current transitions. Neither path can be triggered through the current demo surface.

---

### T3.4 — PANEL_TOGGLE is a no-op during guided execution; post-completion locks all panels except persona

**DEMO OBSERVATION:** Clicking panel headers does not change panel state while the demo is active.

**CONTROL MAPPING:** Control.js:332–338 — if `demoActive`, returns `currentSnapshot` unchanged (no-op). If `demoComplete && panelId !== 'persona'`, returns `currentSnapshot` unchanged (post-completion lock).

**EVIDENCE SOURCE:**
- `Control.js:332–338` — PANEL_TOGGLE guards

**SYSTEM TRUTH:** Panel toggle is blocked during guided execution. In POST_COMPLETION, only the persona panel is interactive via toggle.

**CLAIM BOUNDARY:** Max-2 rule (`_applyToggle`) applies in ENTRY and FREE modes — not during GUIDED or POST_COMPLETION.

---

## Category 4: RE-ENTRY & STATE RESET

### T4.1 — POST_COMPLETION renders a clean ENTRY surface (no downstream panels)

**DEMO OBSERVATION:** After guided execution completes, signals/evidence/narrative panels disappear. The surface returns to ENTRY-equivalent layout.

**CONTROL MAPPING:** `showExtendedPanels = demoActive || freeMode` (index.js:415). `demoComplete` was removed from this expression in 51.14T. At POST_COMPLETION: `demoActive=false`, `freeMode=false` → `showExtendedPanels=false`.

**EVIDENCE SOURCE:**
- `index.js:415` — `const showExtendedPanels = demoActive || freeMode`
- `docs/pios/51.CLOSE/validation_receipt.md` V4
- `docs/pios/51.CLOSE/closure.md` §4 "Post-run re-entry"

**SYSTEM TRUTH:** POST_COMPLETION state (demoComplete=true, demoActive=false, freeMode=false) does not render signals, evidence, or narrative panels. The surface is ENTRY-equivalent.

**CLAIM BOUNDARY:** A "Guided execution complete" message is rendered at POST_COMPLETION (index.js:445–449) — it is a pure projection of `demoComplete` state (51.12). Situation and persona panels remain rendered.

---

### T4.2 — PERSONA_SELECT with a non-null persona clears demoComplete=false

**DEMO OBSERVATION:** Selecting a new persona after completion allows the entry strip and Start button to function normally.

**CONTROL MAPPING:** Control.js:362–365 — `if (persona !== null) newOrchestration.demoComplete = false`. `guidedStepIndex` is always reset to 0 on persona change (Control.js:360).

**EVIDENCE SOURCE:**
- `Control.js:362–365` — PERSONA_SELECT handler
- `docs/pios/51.CLOSE/validation_receipt.md` V4

**SYSTEM TRUTH:** Selecting a non-null persona clears the completion lock. This is the canonical re-entry mechanism after a completed run.

**CLAIM BOUNDARY:** Does not claim persona selection clears `selectedQuery` — query is preserved on non-null persona select. Only null QUERY_SELECT clears persona (Control.js:403–408).

---

### T4.3 — QUERY_SELECT with null clears persona and traversal history; non-null preserves persona

**DEMO OBSERVATION:** Clearing the selected query deselects any active persona. Selecting a new query preserves the existing persona.

**CONTROL MAPPING:** Control.js:396–422. Null query: `selectedPersona=null`, `traversalHistory=[]`, `traversalNodeIndex=0`. Non-null query: `selectedPersona` preserved, `traversalNodeIndex=0`.

**EVIDENCE SOURCE:**
- `Control.js:396–422` — QUERY_SELECT handler

**SYSTEM TRUTH:** Query clear is a full context reset (persona + history). A new query selection preserves the persona context.

**CLAIM BOUNDARY:** Query selection does not directly trigger data fetch inside CONTROL. The API fetch fires in a separate `useEffect` (index.js:224–) that observes `selectedQuery` state changes.

---

## Category 5: PANEL SEMANTICS

### T5.1 — Max-2 open panels rule is enforced by CONTROL in non-guided modes

**DEMO OBSERVATION:** In ENTRY and FREE/Operator modes, no more than 2 panels are open simultaneously.

**CONTROL MAPPING:** `_applyToggle` (Control.js:166–172) — if `next.length > 2`, returns `next.slice(next.length - 2)`.

**EVIDENCE SOURCE:**
- `Control.js:166–172` — `_applyToggle`

**SYSTEM TRUTH:** Opening a third panel evicts the first element of the resulting array (oldest open panel). Maximum 2 panels can be open at any time in non-guided modes.

**CLAIM BOUNDARY:** This rule is not applied during GUIDED execution (toggle is a no-op). Post-completion only allows persona panel toggle; max-2 is not the operative constraint there.

---

### T5.2 — Situation panel is pinned alongside the step panel during guided execution

**DEMO OBSERVATION:** Situation panel remains visible throughout all guided steps alongside the current step panel.

**CONTROL MAPPING:** `_openPanelsForStep(stepPanel)` (Control.js:184–185) returns `['situation', stepPanel]` for any non-situation step panel. Used by DEMO_START, AUTO_START, and DEMO_NEXT (Path A).

**EVIDENCE SOURCE:**
- `Control.js:184–185` — `_openPanelsForStep`
- `Control.js:442–443` — DEMO_START openPanels
- `Control.js:552` — DEMO_NEXT openPanels

**SYSTEM TRUTH:** Every guided step transition results in `openPanels = ['situation', currentStepPanel]`. Situation is always co-open with the active step panel.

**CLAIM BOUNDARY:** Does not claim situation receives the `dp-active` CSS class — the `dp-active` class is applied to the `activePanelId` which during GUIDED is the panel with `PANEL_STATES.EXPANDED`.

---

### T5.3 — Situation and persona panels are always rendered regardless of activation state

**DEMO OBSERVATION:** Situation and persona panels appear at all states: ENTRY, GUIDED, POST_COMPLETION, and FREE/Operator mode.

**CONTROL MAPPING:** No `showExtendedPanels` gate on situation or persona render blocks in index.js (contrast: signals/evidence/narrative at index.js:564, 590, 620 are gated).

**EVIDENCE SOURCE:**
- `index.js:533–558` — situation and persona panels rendered without showExtendedPanels gate
- `docs/pios/51.CLOSE/validation_receipt.md` V3

**SYSTEM TRUTH:** Only signals, evidence, and narrative panels are gated by `showExtendedPanels`. Situation and persona are always present in the DOM.

**CLAIM BOUNDARY:** Panel presence ≠ panel expanded state. Situation and persona may be collapsed (not expanded) at any given state — expanded state is governed by `resolvedPanelState` from CONTROL.

---

### T5.4 — activePanelId is a presentation-layer derivation, not a CONTROL output field

**DEMO OBSERVATION:** One panel receives a highlighted border (`dp-active` class) and is scrolled into view when it becomes the active focus.

**CONTROL MAPPING:** `activePanelId` is computed in index.js as `useMemo` (index.js:369–384), derived from `resolvedPanelState` + `demoActive`, `freeMode`, `selectedQuery`, `enlPersona`. It is not in `CONTROL_RESPONSE.newSnapshot`.

**EVIDENCE SOURCE:**
- `index.js:369–384` — activePanelId useMemo
- `index.js:390–398` — scroll-on-change useEffect
- `docs/pios/51.CLOSE/validation_receipt.md` V6

**SYSTEM TRUTH:** `activePanelId` drives the `dp-active` CSS class on `DisclosurePanel` and the scroll-to-panel effect. It has no effect on CONTROL state or any orchestration setter.

**CLAIM BOUNDARY:** Returns null during freeMode (no guided sequence). At ENTRY with query selected but no persona, returns `'persona'` — this is a step-2 attention cue, not a lock or gate.

---

## Category 6: OPERATOR MODE

### T6.1 — Operator mode (FREE) is entered exclusively via DEMO_EXIT

**DEMO OBSERVATION:** The "Exit demo" button and Cmd/Ctrl+K both produce the orange-tinted Operator surface.

**CONTROL MAPPING:** DEMO_EXIT handler (Control.js:304–322) — sets `freeMode=true`, clears `demoActive=false`, `demoStage=0`, `demoComplete=false`, `traversalHistory=[]`. No other CONTROL intent sets `freeMode=true`.

**EVIDENCE SOURCE:**
- `Control.js:304–322` — DEMO_EXIT handler: `freeMode: true`
- `index.js:308–316` — ⌘K handler fires `handleDemoExit` when `demoActive || demoComplete`
- `index.js:341–346` — handleDemoExit

**SYSTEM TRUTH:** `freeMode=true` is only produced by DEMO_EXIT. No other intent sets it. DEMO_EXIT can be triggered from GUIDED (demoActive=true) or from POST_COMPLETION (demoComplete=true).

**CLAIM BOUNDARY:** Does not claim Operator mode is exclusively entered from mid-demo — ⌘K also triggers from POST_COMPLETION. In both cases, the result is identical: freeMode=true.

---

### T6.2 — In operator mode, all five panels are rendered and toggle-accessible with max-2 rule

**DEMO OBSERVATION:** All panels (situation, persona, signals, evidence, narrative) are visible and interactive in Operator mode.

**CONTROL MAPPING:** `showExtendedPanels = demoActive || freeMode` — in FREE mode, `freeMode=true` → `showExtendedPanels=true`. PANEL_TOGGLE is not blocked when `demoActive=false` and `demoComplete=false`.

**EVIDENCE SOURCE:**
- `index.js:415` — `showExtendedPanels` true when freeMode
- `index.js:564, 590, 620` — signals/evidence/narrative panels rendered
- `Control.js:332–346` — PANEL_TOGGLE not blocked in FREE state
- `Control.js:166–172` — max-2 rule enforced

**SYSTEM TRUTH:** Operator mode renders all five panels and permits open-access toggling subject to the max-2 rule.

**CLAIM BOUNDARY:** Does not claim Operator mode renders panels with evidence content — evidence panel content has its own `demoActive || freeMode` check at index.js:599. In freeMode with query and persona: ENLPanel is rendered.

---

### T6.3 — AUTO_START is explicitly blocked in FREE mode

**DEMO OBSERVATION:** In Operator mode, the auto-start behavior does not fire even when persona and query are both set.

**CONTROL MAPPING:** AUTO_START handler (Control.js:470–472) — `if (freeMode) return FAIL`.

**EVIDENCE SOURCE:**
- `Control.js:470–472` — `if (freeMode) { return { status: 'FAIL', failReason: 'AUTO_START is blocked in FREE mode...' } }`

**SYSTEM TRUTH:** AUTO_START cannot execute when `freeMode=true`. The guard is fail-closed and explicit. Manual "Run Lens Demo" from the Operator surface is the only activation path in FREE mode.

**CLAIM BOUNDARY:** Does not claim AUTO_START is blocked in ENTRY — it fires in ENTRY when both persona and query are set (and not exited). The block is specific to FREE mode.

---

## Category 7: SYSTEM INVARIANTS

### T7.1 — CONTROL is a pure function: no side effects, no external state, deterministic orchestration output

**DEMO OBSERVATION:** All CONTROL calls produce the same orchestration state given the same inputs.

**CONTROL MAPPING:** Control.js §5 — no module-level mutable state, no async operations, no external calls. `CONTROL(intent, runtimeContext, currentSnapshot) → CONTROL_RESPONSE`.

**EVIDENCE SOURCE:**
- `Control.js:256–257` — "Pure: no hidden state, no side effects, no external authority, deterministic."
- `Control.js:259` — function signature

**SYSTEM TRUTH:** All orchestration state fields in `CONTROL_RESPONSE.newSnapshot` are deterministically derived from inputs. CONTROL has no observable side effects.

**CLAIM BOUNDARY:** `traceId` is generated with `Date.now()` and `Math.random()` (Control.js:260) — not deterministic. All orchestration state fields (openPanels, resolvedPanelState, orchestrationState, etc.) are deterministic.

---

### T7.2 — BLOCKED STATE guard is a permanent fail-closed safety net for INIT failure

**DEMO OBSERVATION:** Under normal operation, the application renders normally. If INIT fails validation, the page displays "Initialization unavailable — canonical state missing" and no panels render.

**CONTROL MAPPING:** `CONTROL(INTENTS.INIT, {}, null)` is called in a `useState` initializer (index.js:148–153). Result is validated: `r && r.newSnapshot && r.newSnapshot.resolvedPanelState != null`. If validation fails, `resolvedPanelState` is null. BLOCKED STATE check fires before any render logic (index.js:403–408).

**EVIDENCE SOURCE:**
- `index.js:148–153` — INIT call + validation
- `index.js:400–408` — BLOCKED STATE guard + render
- `docs/pios/51.CLOSE/validation_receipt.md` V1, V2

**SYSTEM TRUTH:** BLOCKED STATE guard is a permanent safety net. It does not trigger under current code (A.13 resolved the INIT deadlock). It provides defense-in-depth against any future INIT regression.

**CLAIM BOUNDARY:** Does not claim BLOCKED STATE is reachable under current code. A.13 repositioned the INIT handler before the `!currentSnapshot` guard, resolving the prior deadlock. The guard is retained by contract (51.10).

---

### T7.3 — Viewport scroll uses data-panel-id attribute selector, not element id

**DEMO OBSERVATION:** When the active panel changes, the viewport scrolls smoothly to bring the panel into view.

**CONTROL MAPPING:** scroll-on-change `useEffect` (index.js:390–398) uses `document.querySelector('[data-panel-id="${activePanelId}"]')`. `DisclosurePanel` renders `data-panel-id={id}` on the root div (not an `id` attribute).

**EVIDENCE SOURCE:**
- `index.js:392` — `document.querySelector('[data-panel-id="${activePanelId}"]')`
- `index.js:390–398` — scroll useEffect
- `docs/pios/51.CLOSE/validation_receipt.md` Gap context (51.14S fix rationale)

**SYSTEM TRUTH:** Scroll targets `data-panel-id` attribute. Using `getElementById` would be a silent no-op (DisclosurePanel does not set an `id` attribute). 80ms delay allows panel open transition to start before scroll fires.

**CLAIM BOUNDARY:** If the panel element is not found in the DOM (e.g., panel not rendered because showExtendedPanels=false), scroll is silently skipped. No error is thrown.

---

### T7.4 — ANALYST persona has 4 guided steps; step 4 activates rawStepActive=true

**DEMO OBSERVATION:** ANALYST flow advances through 4 steps; the fourth step opens the evidence panel in a distinct mode.

**CONTROL MAPPING:** `PERSONA_GUIDED_FLOWS.ANALYST` has 4 entries; `steps[3].rawStep = true` (Control.js:70). DEMO_NEXT Path A: `newRawStepActive = step.rawStep ? true : rawStepActive` (Control.js:558). `_resolvePanelState` for evidence when `rawStepActive=true`: falls back to `openPanels`-driven state instead of `computePanelState` (Control.js:142–143).

**EVIDENCE SOURCE:**
- `Control.js:66–71` — ANALYST flow definition
- `Control.js:557–558` — rawStep exception in DEMO_NEXT
- `Control.js:140–145` — rawStep panel state resolution exception

**SYSTEM TRUTH:** Only ANALYST persona produces `rawStepActive=true`. This changes the panel state resolution path for the evidence panel on step 4, making it `openPanels`-driven rather than `computePanelState`-governed.

**CLAIM BOUNDARY:** Does not claim `rawStepActive` changes evidence panel content. ENLPanel receives `rawStepActive` as a prop; its rendering behavior is outside the scope of this extraction.

---

*Registry produced: 2026-03-29 | Stream: B.1 | Source commit: df3eaf6 | 18 truths across 7 categories*

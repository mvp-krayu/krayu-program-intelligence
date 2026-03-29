# TRACEABILITY MAP — Stream B.1
## ExecLens Demo Surface — Truth → Evidence Source Index

---

## Purpose

Maps each truth in `demo_truth_registry.md` to its primary evidence sources by file and line number. Enables independent verification of any extracted truth against the stabilization commit `df3eaf6`.

---

## Source Files Referenced

| Short code | Full path |
|------------|-----------|
| `CTL` | `app/execlens-demo/components/Control.js` |
| `IDX` | `app/execlens-demo/pages/index.js` |
| `CLO` | `docs/pios/51.CLOSE/closure.md` |
| `VAL` | `docs/pios/51.CLOSE/validation_receipt.md` |

---

## Traceability Index

### T1.1 — Query is the primary activation trigger

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| QuerySelector always enabled | `IDX` | 502 | `disabled={false}` |
| Start button disabled without query | `IDX` | 469 | `disabled={!enlPersona \|\| !selectedQuery}` |
| DEMO_START query guard | `CTL` | 432–433 | `if (!selectedQuery) return FAIL` |
| AUTO_START query guard | `CTL` | 477–479 | `if (!selectedQuery) return FAIL` |
| Validation confirmation | `VAL` | V5 | QuerySelector `disabled={false}` confirmed |

---

### T1.2 — Persona is a context modifier that determines the traversal sequence

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| Step 2 persona styling | `IDX` | 459–462 | `guided-step-done` conditional on `enlPersona` |
| Start button persona gate | `IDX` | 469 | `disabled={!enlPersona \|\| !selectedQuery}` |
| DEMO_START persona guard | `CTL` | 429–431 | `if (!selectedPersona) return FAIL` |
| Persona selects flow | `CTL` | 436 | `PERSONA_GUIDED_FLOWS[selectedPersona]` |
| Persona subtitle | `IDX` | 553 | `"Determines depth and perspective of interpretation"` |

---

### T1.3 — ENTRY surface renders query zone, situation panel, and persona panel only

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| showExtendedPanels definition | `IDX` | 415 | `demoActive \|\| freeMode` |
| Signals gate | `IDX` | 564 | `{showExtendedPanels && <DisclosurePanel id="signals" ...}` |
| Evidence gate | `IDX` | 590 | `{showExtendedPanels && <DisclosurePanel id="evidence" ...}` |
| Narrative gate | `IDX` | 620 | `{showExtendedPanels && <DisclosurePanel id="narrative" ...}` |
| Situation — no gate | `IDX` | 533–547 | No showExtendedPanels wrapper |
| Persona — no gate | `IDX` | 551–559 | No showExtendedPanels wrapper |
| Validation confirmation | `VAL` | V3 | PASS — showExtendedPanels=false at ENTRY |

---

### T2.1 — All orchestration state transitions are routed through CONTROL

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| INIT intent | `IDX` | 149 | `CONTROL(INTENTS.INIT, {}, null)` |
| PANEL_TOGGLE intent | `IDX` | 198–202 | `CONTROL(INTENTS.PANEL_TOGGLE, ...)` |
| AUTO_START intent | `IDX` | 298–300 | `CONTROL(INTENTS.AUTO_START, ...)` |
| DEMO_START intent | `IDX` | 322–328 | `CONTROL(INTENTS.DEMO_START, ...)` |
| DEMO_NEXT intent | `IDX` | 333–337 | `CONTROL(INTENTS.DEMO_NEXT, ...)` |
| DEMO_EXIT intent | `IDX` | 341–346 | `CONTROL(INTENTS.DEMO_EXIT, ...)` |
| QUERY_SELECT intent | `IDX` | 350–355 | `CONTROL(INTENTS.QUERY_SELECT, ...)` |
| PERSONA_SELECT intent | `IDX` | 359–364 | `CONTROL(INTENTS.PERSONA_SELECT, ...)` |
| applyControlResponse — sole setter site | `IDX` | 172–188 | All orchestration setters inside only |
| Validation confirmation | `VAL` | V6, V10 | 8 intents confirmed, no rogue setters |

---

### T2.2 — index.js is a pure projection adapter

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| captureState definition | `IDX` | 164–168 | Reads React state for CONTROL input |
| applyControlResponse definition | `IDX` | 172–188 | Unpacks CONTROL_RESPONSE to setters |
| Closure confirmation | `CLO` | §4 | "captureState → CONTROL → applyControlResponse for every intent" |

---

### T2.3 — resolvedPanelState is derived exclusively by CONTROL

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| setResolvedPanelState call site | `IDX` | 188 | Inside applyControlResponse only |
| getPanelExpanded reads resolvedPanelState | `IDX` | 205–211 | `resolvedPanelState?.[panelId]` |
| _resolveAllPanelStates | `CTL` | 151–160 | Loops PANEL_IDS, calls _resolvePanelState |
| _rebuildDerivedFields calls it | `CTL` | 225–242 | Recomputes resolvedPanelState after each intent |
| Validation confirmation | `VAL` | V10 | No orchestration setters outside applyControlResponse |

---

### T3.1 — PERSONA_GUIDED_FLOWS is the canonical traversal definition

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| EXECUTIVE flow | `CTL` | 56–60 | narrative → signals → evidence |
| CTO flow | `CTL` | 61–65 | signals → evidence → narrative |
| ANALYST flow | `CTL` | 66–71 | evidence → signals → narrative → raw/evidence |
| Named export declaration | `CTL` | 55 | `export const PERSONA_GUIDED_FLOWS = {` |
| Import in index.js (no local duplicate) | `IDX` | 57 | `import { ... PERSONA_GUIDED_FLOWS } from '../components/Control'` |
| Validation confirmation | `VAL` | V8 | No local duplicate found |

---

### T3.2 — DEMO_START requires persona and query; opens first step panel

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| Persona guard | `CTL` | 429–431 | `if (!selectedPersona) return FAIL` |
| Query guard | `CTL` | 432–433 | `if (!selectedQuery) return FAIL` |
| First panel derivation | `CTL` | 436–440 | From PERSONA_GUIDED_FLOWS[0].panelId |
| openPanels construction | `CTL` | 442–443 | `_openPanelsForStep(firstPanel)` |
| demoActive=true | `CTL` | 447 | `demoActive: true` |
| freeMode cleared | `CTL` | 454 | `freeMode: false` |
| handleStartDemo | `IDX` | 322–328 | CONTROL call + fail-closed return |

---

### T3.3 — DEMO_NEXT advances steps; terminal sets demoComplete=true

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| Path A step advance | `CTL` | 527–572 | nextIndex = guidedStepIndex + 1 |
| Terminal detection | `CTL` | 530 | `if (nextIndex >= steps.length)` |
| demoComplete=true set | `CTL` | 534 | `demoComplete: true` |
| demoActive=false set | `CTL` | 535 | `demoActive: false` |
| selectedPersona cleared | `CTL` | 541 | `selectedPersona: null` |
| openPanels collapsed | `CTL` | 542 | `openPanels: ['situation']` |
| DemoController hides | `IDX` | 644 | `active={demoActive && !demoComplete}` |

---

### T3.4 — PANEL_TOGGLE no-op during guided; post-completion lock

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| Guided no-op guard | `CTL` | 332–334 | `if (demoActive) return currentSnapshot` |
| Post-completion lock | `CTL` | 337–338 | `if (demoComplete && panelId !== 'persona') return currentSnapshot` |

---

### T4.1 — POST_COMPLETION renders clean ENTRY surface

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| showExtendedPanels excludes demoComplete | `IDX` | 415 | `demoActive \|\| freeMode` only |
| 51.14T annotation | `IDX` | 414 | Comment confirming demoComplete removal |
| Validation confirmation | `VAL` | V4 | PASS — demoComplete excluded from showExtendedPanels |
| Closure confirmation | `CLO` | §4 | "Post-run re-entry" |

---

### T4.2 — PERSONA_SELECT with non-null persona clears demoComplete

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| demoComplete cleared | `CTL` | 362–365 | `if (persona !== null) newOrchestration.demoComplete = false` |
| guidedStepIndex reset | `CTL` | 360 | `guidedStepIndex: 0` |
| Validation confirmation | `VAL` | V4 | CONTROL.PERSONA_SELECT resets demoComplete=false |

---

### T4.3 — QUERY_SELECT null clears persona; non-null preserves persona

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| Null query handler | `CTL` | 396–409 | selectedPersona=null, traversalHistory=[] |
| Non-null query handler | `CTL` | 411–422 | selectedPersona preserved |
| Non-null: persona preservation comment | `CTL` | 420 | `// selectedPersona preserved — no reset on non-null query` |

---

### T5.1 — Max-2 rule enforced by CONTROL

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| _applyToggle max-2 enforcement | `CTL` | 166–172 | `next.slice(next.length - 2)` if `> 2` |

---

### T5.2 — Situation panel pinned in guided steps

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| _openPanelsForStep | `CTL` | 184–185 | `['situation', stepPanel]` or `['situation']` |
| Used in DEMO_START | `CTL` | 442–443 | `_openPanelsForStep(firstPanel)` |
| Used in DEMO_NEXT Path A | `CTL` | 552 | `_openPanelsForStep(stepPanel)` |

---

### T5.3 — Situation and persona always rendered

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| Situation render — no gate | `IDX` | 533–547 | DisclosurePanel id="situation" — no showExtendedPanels |
| Persona render — no gate | `IDX` | 551–559 | DisclosurePanel id="persona" — no showExtendedPanels |
| Validation confirmation | `VAL` | V3 | "Situation panel and persona panel always render (no showExtendedPanels gate) — allowlisted by contract" |

---

### T5.4 — activePanelId is presentation-only

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| activePanelId useMemo | `IDX` | 369–384 | Derived from resolvedPanelState + orchestration flags |
| Scroll useEffect | `IDX` | 390–398 | Fires on activePanelId change |
| Not in CONTROL_RESPONSE | `CTL` | 207–222 | CONTROL_RESPONSE snapshot fields — activePanelId absent |
| Validation confirmation | `VAL` | V6 | activePanelId derivation confirmed as projection-only |

---

### T6.1 — Operator mode entered via DEMO_EXIT only

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| freeMode=true in DEMO_EXIT | `CTL` | 307 | `freeMode: true` |
| DEMO_EXIT full handler | `CTL` | 304–322 | All orchestration cleared |
| ⌘K handler | `IDX` | 308–316 | Fires handleDemoExit when demoActive \|\| demoComplete |
| handleDemoExit | `IDX` | 341–346 | exitedRef set + CONTROL call |

---

### T6.2 — All 5 panels rendered and toggle-accessible in FREE mode

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| showExtendedPanels true in freeMode | `IDX` | 415 | `freeMode` in expression |
| PANEL_TOGGLE not blocked in FREE | `CTL` | 332–346 | Guards only check demoActive and demoComplete |
| max-2 applies | `CTL` | 166–172 | _applyToggle enforces max-2 |

---

### T6.3 — AUTO_START blocked in FREE mode

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| AUTO_START freeMode guard | `CTL` | 470–472 | `if (freeMode) return FAIL` |

---

### T7.1 — CONTROL is pure / deterministic

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| Purity declaration | `CTL` | 256–257 | "Pure: no hidden state, no side effects, no external authority, deterministic." |
| Function signature | `CTL` | 259 | `export function CONTROL(intent, runtimeContext, currentSnapshot)` |
| No module-level state | `CTL` | 1–36 | Header — no exports of mutable state |

---

### T7.2 — BLOCKED STATE is a permanent fail-closed guard

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| INIT call and validation | `IDX` | 148–153 | `resolvedPanelState != null` check |
| BLOCKED STATE render | `IDX` | 400–408 | `if (resolvedPanelState === null)` |
| Validation confirmation | `VAL` | V1, V2 | INIT PASS + guard retained confirmed |

---

### T7.3 — Scroll uses data-panel-id selector

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| querySelector usage | `IDX` | 392 | `document.querySelector('[data-panel-id="${activePanelId}"]')` |
| 80ms delay | `IDX` | 394 | `setTimeout(..., 80)` |
| DisclosurePanel renders data-panel-id | `app/execlens-demo/components/DisclosurePanel.js` | 51.14 | `data-panel-id={id}` on root div |

---

### T7.4 — ANALYST has 4 steps; step 4 activates rawStepActive

| Evidence | Source | Lines | Content |
|----------|--------|-------|---------|
| ANALYST flow definition | `CTL` | 66–71 | 4 entries; `rawStep: true` on entry 4 |
| rawStep exception in DEMO_NEXT | `CTL` | 557–558 | `newRawStepActive = step.rawStep ? true : rawStepActive` |
| rawStep panel resolution | `CTL` | 140–145 | `if (rawStepActive && panelId === 'evidence')` → openPanels-driven |

---

*Traceability map produced: 2026-03-29 | Stream: B.1 | Commit: df3eaf6 | 18 truths mapped*

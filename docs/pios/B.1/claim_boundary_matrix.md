# CLAIM BOUNDARY MATRIX — Stream B.1
## ExecLens Demo Surface — What Is and Is Not Asserted

---

## Purpose

This matrix makes explicit the limits of each category of truth extracted from the demo surface. Its function is to prevent capability inflation and narrative drift when these truths are used in subsequent streams (I.x, demo documentation, etc.).

Each row states what IS asserted, what IS NOT asserted, and the consequence of crossing the boundary.

---

## Category 1: ENTRY & ACTIVATION MODEL

| Assertion | IS asserted | IS NOT asserted |
|-----------|-------------|-----------------|
| Query enables activation | Query is required before guided execution can start; Start button is disabled without query | Query determines the analysis output, conclusions, or interpretation |
| Persona enables activation | Persona is required alongside query before Start is enabled | Persona filters, alters, or generates the underlying data |
| Persona determines traversal | Persona selects which PERSONA_GUIDED_FLOWS sequence is applied | The sequence is analytically optimal or evidence-grounded |
| ENTRY surface scope | Signals, evidence, narrative panels are not rendered at ENTRY | Situation/persona panels are expanded at ENTRY (they are rendered but may be collapsed) |

**Consequence of crossing:** Claiming "persona customizes the analysis" inflates what is demonstrated. Persona selects a traversal order. Data comes from the API.

---

## Category 2: PROJECTION PURITY

| Assertion | IS asserted | IS NOT asserted |
|-----------|-------------|-----------------|
| All orchestration through CONTROL | No orchestration setter is called outside applyControlResponse | There is no local logic in index.js whatsoever |
| index.js is a projection adapter | index.js does not make orchestration decisions | index.js has zero computation — it has UI derivations (showExtendedPanels, activePanelId) |
| resolvedPanelState from CONTROL | Panel expanded state is CONTROL-produced | activePanelId (visual emphasis) is CONTROL-produced — it is a secondary local derivation |
| Data fetch is outside CONTROL | API fetch fires in a useEffect outside CONTROL scope | This makes the data fetch ungoverned — it is data-layer state, not orchestration state |

**Consequence of crossing:** Claiming "CONTROL governs all state" is partially false if it implies data-fetch state. The boundary is: orchestration state = CONTROL authority; data-fetch state = separate concern.

---

## Category 3: FLOW GOVERNANCE

| Assertion | IS asserted | IS NOT asserted |
|-----------|-------------|-----------------|
| PERSONA_GUIDED_FLOWS is canonical | The three flow sequences are defined in Control.js and exported as a named export | The sequences are derived from analytical methodology or are dynamically computed |
| DEMO_START is fail-closed | Returns FAIL without persona and query | Failure is surfaced to the user — it is a silent no-op in the UI (handleStartDemo returns early) |
| DEMO_NEXT terminal clears persona | demoComplete=true, demoActive=false, selectedPersona=null | Panel content is cleared — panels collapse but content remains in memory |
| Path B / Path C are absent | Both paths are annotated DORMANT-GOVERNED LEGACY and are CONTROL-unreachable | Both paths are removed from the codebase — they are retained as archived code in Control.js |

**Consequence of crossing:** Claiming Path B/C are "removed" is false. They are annotated and unreachable but still present. The accurate claim is: they cannot be triggered through current CONTROL-governed transitions.

---

## Category 4: RE-ENTRY & STATE RESET

| Assertion | IS asserted | IS NOT asserted |
|-----------|-------------|-----------------|
| POST_COMPLETION is ENTRY-equivalent | showExtendedPanels=false at POST_COMPLETION; downstream panels not rendered | POST_COMPLETION is identical to ENTRY — a completion message IS rendered (index.js:445–449) |
| Persona select clears demoComplete | Non-null PERSONA_SELECT resets demoComplete=false | Any persona select clears all completion state — guidedStepIndex also resets but query is preserved |
| Query clear resets persona | Null QUERY_SELECT clears selectedPersona | Non-null query change clears persona — it does not; persona is preserved |

**Consequence of crossing:** Claiming "re-entry is transparent" is inaccurate — the completion message distinguishes POST_COMPLETION from ENTRY visually.

---

## Category 5: PANEL SEMANTICS

| Assertion | IS asserted | IS NOT asserted |
|-----------|-------------|-----------------|
| Max-2 rule enforced by CONTROL | _applyToggle enforces max-2 in ENTRY and FREE modes | Max-2 is enforced in GUIDED mode — toggle is a no-op there; the rule is inapplicable |
| Situation pinned in guided steps | openPanels always includes 'situation' during guided transitions | Situation is the focused panel — the active step panel receives dp-active, not situation |
| Situation/persona always rendered | Both panels are in the DOM at all states | Both panels are always expanded — expanded state is CONTROL-governed |
| activePanelId is presentation-only | Drives dp-active CSS and scroll — no orchestration effect | activePanelId is a CONTROL output — it is computed locally in index.js from CONTROL-produced state |

**Consequence of crossing:** Claiming "situation is always the active panel" is false during GUIDED — the step panel is active.

---

## Category 6: OPERATOR MODE

| Assertion | IS asserted | IS NOT asserted |
|-----------|-------------|-----------------|
| FREE mode entered via DEMO_EXIT only | freeMode=true is only set by DEMO_EXIT handler | FREE mode can only be reached from mid-demo — ⌘K also triggers from POST_COMPLETION |
| All 5 panels rendered in FREE mode | showExtendedPanels=true when freeMode; all five DisclosurePanel instances are rendered | All panels are automatically opened — they are rendered but not expanded; toggle is required |
| AUTO_START blocked in FREE | AUTO_START returns FAIL when freeMode=true | AUTO_START is the only way to start a demo in FREE mode — manual "Run Lens Demo" button is available |
| Evidence content in FREE | ENLPanel renders when queryData && enlPersona && freeMode (index.js:599–606) | Evidence content is the same as GUIDED mode — rawStepActive=false in FREE mode |

**Consequence of crossing:** Claiming "panels open automatically in operator mode" is false. They are rendered but collapsed unless toggled.

---

## Category 7: SYSTEM INVARIANTS

| Assertion | IS asserted | IS NOT asserted |
|-----------|-------------|-----------------|
| CONTROL is pure / deterministic | All orchestration output fields are deterministically derived from inputs | CONTROL is fully referentially transparent — traceId is non-deterministic (Date.now, Math.random) |
| BLOCKED STATE is permanent | Guard is retained by contract and fires before any render | BLOCKED STATE is currently reachable — A.13 resolved the INIT deadlock; guard does not trigger under normal operation |
| Scroll uses data-panel-id | querySelector targets data-panel-id attribute, not element id | Scroll is guaranteed to execute — if the element is not in the DOM, scroll is silently skipped |
| ANALYST rawStep changes panel behavior | rawStepActive=true changes panel state resolution path for evidence panel | rawStepActive changes panel content — ENLPanel content behavior is outside this extraction's scope |

**Consequence of crossing:** Claiming "BLOCKED STATE fires on initialization failure in current code" implies the guard triggers regularly. It does not — current INIT is deterministic and valid.

---

## Forbidden Language Register

The following terms must not appear in claims derived from these truths:

| Forbidden term | Why forbidden |
|----------------|---------------|
| "intelligent" | No inference or learning is observable in the demo surface |
| "AI-driven" | CONTROL is a pure deterministic function — no ML |
| "predictive" | No prediction mechanism is present |
| "adaptive" | Flow sequences are static; no dynamic adaptation |
| "insightful" | Narrative language; not a system truth |
| "automatically adjusts" | Panel sequences are fixed static arrays |
| "understands" | No semantic interpretation occurs in CONTROL |
| "generates" | Content comes from API response data, not generation |

---

*Boundary matrix produced: 2026-03-29 | Stream: B.1 | Source: demo_truth_registry.md*

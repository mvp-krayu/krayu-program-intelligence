# Execution Report — 51.8R

Stream: 51.8R — Entry Strip + Analyst Raw Evidence Access + Final Polish + Guided Flow Correction + Loop Closure + Amendment 5 + Amendment 6 + Amendment 7 + Amendment 8 + Amendment 9 + Amendment 10
Date: 2026-03-26
Amendment applied: 2026-03-26; Amendment 5 applied: 2026-03-27; Amendment 6 applied: 2026-03-27; Amendment 7 applied: 2026-03-27; Amendment 8 applied: 2026-03-27; Amendment 9 applied: 2026-03-27; Amendment 10 applied: 2026-03-27
Branch: feature/51-8R-entry-strip-analyst-access
Baseline commit: f5525dc (stream 51.8)
Contract: PIOS-51.8R-RUN01-CONTRACT-v7 (supersedes v6, v5, v4, v3, v2, v1)
References: PIOS-51.8-RUN01-CONTRACT-v1

---

## Pre-flight

- Branch: feature/51-8R-entry-strip-analyst-access ✓
- Inputs present: index.js, ENLPanel.js, PersonaPanel.js, globals.css, 51.8 artifacts ✓
- Dependencies complete: 51.8 baseline clean (f5525dc) ✓
- Validators present: validate_51_8R.py created ✓

---

## Execution Summary

### Files Modified

| File | Change |
|---|---|
| app/execlens-demo/pages/index.js | PIOS annotation → 51.8R; guided-entry-strip inner wrapper; gate message repositioned below strip; hero-meta updated; [amendment] demoComplete state, prevEnlPersonaRef, ⌘K handler, persona-change-reset effect, terminal strip UI, DemoController active prop; [guided correction] PERSONA_GUIDED_FLOWS; guidedStepIndex + rawStepActive states; handleStartDemo dual gate; handleDemoNext guided primary path; handleDemoExit guided reset; copy corrections |
| app/execlens-demo/components/ENLPanel.js | PIOS annotation → 51.8R; RawArtifactsSection prominent prop; promoted before chain; bottom render removed; [amendment] analyst-source-header, hide label correction, per-block source reference; [guided correction] useEffect imported; forceOpen prop; rawStepActive prop |
| app/execlens-demo/components/DemoController.js | [guided correction] GuidedBar component added; guidedSteps/guidedStepIndex/guidedPersona props; GuidedBar routed first |
| app/execlens-demo/components/PersonaPanel.js | [guided correction] if (!queryId) return null removed; ENL output re-gated as selectedPersona && queryId |
| app/execlens-demo/styles/globals.css | PIOS-51.8R block: guided-entry-steps align-items override; guided-entry-strip row layout; guided-step-arrow; raw-artifacts-*-prominent styles; [amendment] te-node-dot-active contrast, terminal strip styles, analyst source styles; [guided correction] .demo-bar-guided, .guided-bar-persona-label |
| scripts/pios/51.8R/validate_51_8R.py | 4 supersessions applied for guided correction |
| scripts/pios/51.7/validate_51_7.py | Start button check: dual gate supersedes persona-only |
| scripts/pios/51.8/validate_51_8.py | Start button check: dual gate; ENLPanel check: updated precision |
| scripts/pios/51.6R.4/validate_persona_required_on_demo_start.py | useState bound: <= 12 → <= 14 (guidedStepIndex + rawStepActive; superseded by guided correction) |

### Files Created

| File | Purpose |
|---|---|
| scripts/pios/51.8R/validate_51_8R.py | Stream validator: 15 groups (entry strip + amendment) |
| scripts/pios/51.8R/validate_51_8R_guided.py | Guided flow validator: 16 groups, 82 checks |
| docs/pios/51.8R/entry_strip_layout.md | Entry strip layout specification |
| docs/pios/51.8R/analyst_raw_evidence_access.md | Analyst access affordance specification |
| docs/pios/51.8R/guided_demo_choreography.md | Guided flow choreography specification |
| docs/pios/51.8R/persona_entry_contract.md | Persona entry and dual gate contract |
| docs/pios/51.8R/execution_report.md | This file |
| docs/pios/51.8R/validation_log.json | Validation output (88/88 PASS) |
| docs/pios/51.8R/validation_log_guided.json | Guided correction validation output (82/82 PASS) |
| docs/pios/51.8R/file_changes.json | File change log |
| docs/pios/51.8R/CLOSURE.md | Stream closure |

---

## Behavioral Changes

### 1. Guided Entry Strip Layout

- Inner wrapper `.guided-entry-strip` added — `flex-direction: row`, `align-items: center`
- Step 1 → (arrow) → Step 2 → [Start Lens Demo] all on one horizontal line
- `.guided-entry-steps` override in PIOS-51.8R: `align-items: flex-start` — left-aligned
- `persona-gate-message` moved outside the strip — renders below the horizontal row
- Step states (active/done) and persona label unchanged

### 2. Analyst Raw Evidence Visibility

- `RawArtifactsSection` gains `prominent` boolean prop
- When `prominent`: renders with `raw-artifacts-section-prominent` + `raw-artifacts-toggle-prominent` CSS; label "View raw evidence"
- Moved to render BEFORE chain steps (after PersonaNarrativeHeader) for ANALYST persona
- Bottom render removed (replaced by top-positioned prominent render)
- All underlying data unchanged — reads from `orderedSignals`, `JSON.stringify(sig.evidence, ...)`

### 3. Analyst Label Correction [amendment]

- Hide label: `'Hide source-level evidence'` when prominent and open (was `'Hide raw artifacts'`)
- `'Hide raw artifacts'` preserved in ternary for non-prominent case
- `ANALYST MODE — SOURCE EVIDENCE` header added above button when prominent
- `.analyst-source-header` CSS: uppercase, orange (`var(--weak)`), letter-spaced

### 4. Source Traceability Affordance [amendment]

- Per-block source reference added inside `raw-artifacts-body`
- Reads `sig.evidence.source_file` — field read only, no computation
- Renders: `Source  <filename>  [Open]` per evidence block when `source_file` present
- `[Open]` button is visual affordance only (no handler — read-only display)
- CSS: `.raw-artifact-source-ref`, `.raw-artifact-source-label`, `.raw-artifact-source-file`, `.raw-artifact-open-btn`

### 5. Active Tab Contrast [amendment]

- `.te-node-dot-active { color: #0d0f14 }` — dark text on green (active traversal node)
- Appended to PIOS-51.8R CSS block

### 6. Guided Demo Terminal State [amendment]

- `demoComplete` useState(false) — tracks post-traversal terminal state
- At traversal end: `setDemoComplete(true)` (demoActive stays true — guided lock preserved)
- `DemoController active={demoActive && !demoComplete}` — controller hides at terminal
- `guided-terminal-strip` renders when demoComplete: "Guided demo complete" + "Exit guided mode ⌘K"
- ⌘K keydown handler: `e.metaKey || e.ctrlKey` + `key === 'k'` → calls `handleDemoExit()` when demoActive
- `handleDemoExit()` now also calls `setDemoComplete(false)`
- `handleStartDemo()` calls `setDemoComplete(false)` on re-run

### 7. Persona Change Reset [amendment]

- `prevEnlPersonaRef = useRef(null)` — detects persona change without [enlPersona]-only dep
- useEffect with deps `[enlPersona, demoActive, demoComplete]` — resets demo if persona changes mid-demo
- Resets: demoActive, demoStage, traversalNodeIndex, selectedFlow, demoComplete

### 8. validate_51_8.py Update

- Check `"51.8" not in enl` → `"PIOS-51.8-RUN01-CONTRACT-v1" not in enl`
- Justification: 51.8R explicitly supersedes ENLPanel isolation asserted in 51.8
- Documented in file_changes.json

### 10. Guided Loop Closure [amendment 3]

- `handleDemoNext` terminal path: after `setDemoComplete(true)` → `setDemoActive(false)`, `setGuidedStepIndex(0)`, `setRawStepActive(false)`
- Entry strip becomes visible immediately on completion (`!demoActive` guard already present)
- Button CTA: `{demoComplete ? 'Try another perspective' : 'Start Lens Demo'}`
- Persona NOT reset — context preserved across completion
- Query NOT reset — may persist
- ⌘K handler still present; no longer fires at terminal (demoActive=false)
- Terminal strip still renders on `demoComplete` — "Exit guided mode" button clears completion label
- All three legacy terminal paths updated for consistency (unreachable in practice)
- `validate_51_8R.py`: `guided_loop_closure` group added (7 checks); `no_zombie_guided_state` check superseded
- `validate_51_8R_guided.py`: `"Guided lock held at terminal"` check name superseded

### 9. Guided Flow Correction

- `PERSONA_GUIDED_FLOWS` constant in index.js — static, no computation, reuses existing panel IDs only
- EXEC flow: narrative → signals → evidence (3 steps)
- CTO flow: signals → evidence → narrative (3 steps)
- ANALYST flow: evidence → signals → narrative → raw (4 steps; raw step = forceOpen on evidence panel)
- `guidedStepIndex` useState(0) + `rawStepActive` useState(false) — total 14 useState in index.js
- `handleStartDemo`: persona hard gate (first) + query hard gate (second); guided state reset on re-run
- `handleDemoNext`: PERSONA_GUIDED_FLOWS primary path; legacy traversal path preserved for backward compat
- `handleDemoExit`: clears guidedStepIndex + rawStepActive in addition to prior resets
- Persona-change effect: clears guidedStepIndex + rawStepActive; deps `[enlPersona, demoActive, demoComplete]`
- `PersonaPanel.js`: `if (!queryId) return null` removed — persona selector renders always; ENL output re-gated by `selectedPersona && queryId`
- `ENLPanel.js`: `forceOpen` prop on RawArtifactsSection; `rawStepActive` prop on ENLPanel export; useEffect forces section open when forceOpen
- `DemoController.js`: GuidedBar component renders persona-labeled step indicator; replaces TraversalBar when guidedSteps present
- Start Demo button: `disabled={!enlPersona || !selectedQuery}` — dual gate
- Copy: "Select a query to project signals onto this structure." and "Interpret this situation from a decision perspective"

### 11. Amendment 5 — PIOS-51.8R-RUN01-CONTRACT-v2 [2026-03-27]

#### A. Query-First Entry Gate
- `PersonaPanel` buttons gain `disabled={!queryId}` — persona selection blocked without query
- Persona selector still renders; no layout change; fetch still gated by both persona AND queryId

#### B. Guided Flow Rebinding on Persona Switch
- Persona-change useEffect: `setGuidedStepIndex(0)` and `setDemoComplete(false)` moved outside `if (demoActive)` guard — always reset on persona switch
- Ensures GuidedBar reflects new persona's step sequence from step 1 regardless of demo state

#### C. Deterministic Reset — Canonical Entry State
- `handleDemoNext` terminal path: `setDemoComplete(false)` (was `true`), adds `setOpenPanels(['situation'])`
- Completion immediately returns to canonical entry state — no terminal strip, no ⌘K required
- `guided-terminal-strip` removed from index.js — `demoComplete` preserved for DemoController active prop only
- CTA simplifies to `'Start Lens Demo'` (no ternary)

#### D. GuidedBar Last-Step Label
- `DemoController.js` GuidedBar: `{isLast ? 'Try another perspective' : 'Next →'}` (was `'Finish ✓'`)
- User sees "Try another perspective" on last guided step before clicking

#### E. Navigation Relocation to Topology
- `NavigationPanel` removed from `ENLPanel` — import and render both removed
- `NavigationPanel` added to `TopologyPanel` inside `<details className="topo-nav-links">` with summary "View source-level topology links"
- `navigation` prop added to `TopologyPanel`; removed from `ENLPanel`
- `index.js`: `<TopologyPanel navigation={queryData?.navigation} />` — passes navigation from query data
- Navigation content exposed only on explicit user action within Situation panel

#### Validator changes (amendment 5)
- `validate_51_8R.py`: 8 new groups (34 checks); 10 supersessions; total 156/156 PASS
- `validate_51_8R_guided.py`: 5 supersessions; total 82/82 PASS
- `validate_enl_visible_chain.py` (51.5R): 2 supersessions (NavigationPanel moved to TopologyPanel); total 66/66 PASS

### 12. Amendment 6 — PIOS-51.8R-RUN01-CONTRACT-v3 [2026-03-27]

#### A. Persona-First Entry Gate (Gate Direction Inverted)
- `QuerySelector.js` gains `disabled` prop; passed to `<select disabled={disabled}>`
- `index.js` calls `<QuerySelector disabled={!enlPersona} />` — query selector non-interactive until persona selected
- Gate message "Select a persona first to enable query selection" rendered in query-zone when `!enlPersona`
- `PersonaPanel` buttons: `disabled={!queryId}` removed — persona always interactive at all times (supersedes Amendment 5)

#### B. Query-Zone First Visual Position
- `query-zone` div moved to first render position (before Situation and Persona panels)
- Visual order: query-zone → Situation → Persona → Signals → Evidence → Narrative
- No data path change; no API change; layout only

#### C. Post-Completion Interaction Lock
- `handleToggle` gains second lock condition: `if (!enlPersona && demoComplete && panelId !== 'persona') return`
- All panels non-interactive after completion except Persona panel (exempt via `panelId !== 'persona'`)
- Dep array updated: `[demoActive, enlPersona, demoComplete, togglePanel]`

#### D. Terminal setDemoComplete(true) — Reverts Amendment 5
- `handleDemoNext` terminal path: `setDemoComplete(true)` (was `false` in Amendment 5)
- `demoComplete=true` + `enlPersona=null` activates post-completion lock
- `setOpenPanels(['situation'])` preserved — panel state still canonical

#### E. Persona-Change Effect Restructure
- Null-init check (`if (prevEnlPersonaRef.current === null)`) removed — equality check handles mount case
- `setDemoComplete(false)` conditioned on `enlPersona !== null`: persona selection resets lock; terminal clear (null) preserves it
- Effect structure: `if (prev === current) return` → assign ref → `setGuidedStepIndex(0)` → `if (enlPersona !== null) { setDemoComplete(false) }` → `if (demoActive)` reset block

#### Validator changes (amendment 6)
- `validate_51_8R.py`: ~10 supersessions (panel_order query-zone-first, deterministic_reset true, entry_gate inverted, _pcb→_pcb6 extraction); 10 new groups (46 checks); total 202/202 PASS
- All prior validators: no regressions

---

### 13. Amendment 7 — PIOS-51.8R-RUN01-CONTRACT-v4 [2026-03-27]

#### A. 3-Stage Execution Gating (Persona → Query → CTA)
- Evidence panel fully gated by `demoActive`: renders `ENLPanel` only when `demoActive === true`
- Pre-demo (persona + query selected, demo not started): `<div className="evidence-blocked-state">Start Lens Demo to view evidence analysis</div>`
- Without persona: `<div className="evidence-blocked-state">Evidence requires a selected Persona</div>`
- Without query: `<div className="no-query-state">Select a query to load evidence.</div>`
- No panel interaction, evidence access, or navigation possible before explicit CTA click

#### B. Post-Completion Lock Simplified
- `handleToggle` second condition simplified: `if (demoComplete && panelId !== 'persona') return` (removed `!enlPersona &&`)
- Dep array simplified: `[demoActive, demoComplete, togglePanel]` (removed `enlPersona`)
- Lock is unconditional on demoComplete — no persona-state dependency

#### C. CTRL+K Restores Free Navigation from Post-Completion
- CTRL+K handler condition extended: `if (demoActive || demoComplete)` (was `demoActive` only)
- Post-completion: CTRL+K calls `handleDemoExit()` → sets `demoComplete(false)` → releases lock → free navigation
- Pre-demo: CTRL+K does not fire (both flags false)
- `handleDemoExit` does NOT clear persona or query — context preserved for re-entry
- CTRL+K useEffect deps updated to `[demoActive, demoComplete]`

#### D. validate_ui_naming_lens.py Supersession
- `Start Lens Demo` count check: `== 1` → `>= 1` — Amendment 7 added pre-demo evidence message containing "Start Lens Demo"; count = 2 in index.js
- After supersession: 17/17 PASS

#### Validator changes (amendment 7)
- `validate_51_8R.py`: ~5 supersessions (ui_locked !enlPersona&& removed, no_bypass simplified, demo_cannot_restart simplified); 10 new groups (46 checks); total 248/248 PASS
- `validate_ui_naming_lens.py` (51.6R.4): 1 supersession (Start Lens Demo count == 1 → >= 1); 17/17 PASS
- All prior validators: no regressions

---

### 14. Amendment 8 — PIOS-51.8R-RUN01-CONTRACT-v5 [2026-03-27]

#### A. Situation Persistence — Persona→Evidence Auto-Open Effect Removed
- `useEffect(() => { if (!enlPersona || demoActive) return; openPanel('evidence') }, [enlPersona, demoActive, openPanel])` removed from `index.js`
- Root cause: when PersonaPanel was open (`openPanels = ['situation', 'persona']`) and user selected a persona, effect fired `openPanel('evidence')`, which pushed evidence in and dropped Situation via max-2 rule → Situation disappeared
- Replacement: comment block documents the removal and rationale
- Evidence opens via guided flow step transitions only (`setOpenPanels([step.panelId])` in `handleDemoNext`)
- Free explore post-CTRL+K: user toggles evidence manually

#### B. Persona Preserved Across Query Change — Query Fetch Effect
- `setEnlPersona(null)` and `setEnlPersonaData(null)` removed from the non-null query selection branch in the query fetch `useEffect`
- Previously: selecting a query cleared persona → user forced to re-select persona before CTA became enabled (duplicate selection)
- Now: `enlPersona` persists through query change; `PersonaPanel` fetch effect `[selectedPersona, queryId]` automatically re-fetches persona data for the new query
- Comment block added documenting the preservation contract
- `setEnlPersona(null)` preserved in: null-query branch (query cleared) and guided completion terminal path

#### C. PersonaPanel queryId Reset Effect — Preserve Persona Selection
- `setSelectedPersona(null)` removed from queryId reset effect in `PersonaPanel.js`
- `onPersonaChange?.(null)` removed from queryId reset effect — no longer calls parent reset on query change
- `setPersonaData(null)` and `onPersonaDataChange?.(null)` retained — data cleared and re-fetched automatically
- Comment block added: "preserve persona selection [51.8R amendment 8]"
- `activePersona` reset effect unchanged — terminal completion still clears PersonaPanel internal state via `activePersona === null`

#### Validator changes (amendment 8)
- `validate_51_8R.py`: 10 new groups (50 new checks); 1 check precision fix (situation terminal: use `idx` not `_term5`); total 298/298 PASS
- `validate_51_8.py`: 1 supersession (free explore effect guard check inverted to confirm removal); 44/44 PASS
- `validate_persona_panel_transform.py` (51.6R.3): 4 supersessions in `evidence_open_behavior` group; 32/32 PASS
- All prior validators: no regressions

---

## Validator Results

| Validator | Result |
|---|---|
| validate_51_8R_guided.py | 82/82 PASS (16 groups — guided correction; amendment 5 supersessions) |
| validate_51_8R.py | 298/298 PASS (61 groups — entry strip + amendments + loop closure + amendment 5 + amendment 6 + amendment 7 + amendment 8) |
| validate_51_8.py | 44/44 PASS |
| validate_51_7.py | 27/27 PASS |
| validate_mode_state_guard.py (51.6R.2) | 35/35 PASS |
| validate_entry_correction.py (51.6R.1) | 34/34 PASS |
| validate_persona_required_on_demo_start.py (51.6R.4) | 21/21 PASS (useState bound updated to <= 14) |
| validate_persona_panel_transform.py (51.6R.3) | 32/32 PASS |
| validate_analyst_raw_access.py (51.6R.4) | 22/22 PASS |
| validate_ui_naming_lens.py (51.6R.4) | 17/17 PASS |
| validate_traversal_sequence.py (51.6) | 69/69 PASS |
| validate_persona_invariance.py (51.6) | 40/40 PASS |
| validate_enl_visible_chain.py (51.5R) | 66/66 PASS |
| validate_demo_flow_structure.py (51.4) | 31/31 PASS |

---

## Governance Confirmation

- No data mutation
- No computation
- No interpretation
- No new API calls
- No runtime changes
- No evidence changes
- No semantic changes
- No synthetic data
- Persona hard gate preserved and not weakened
- Evidence empty-state guards preserved
- Analyst raw access read-only: JSON.stringify of existing evidence fields only
- Source traceability: read-only display of sig.evidence.source_file — no new data path
- [Open] button: visual affordance only, no handler, no navigation
- ⌘K: exits demo only — does not mutate evidence or query state
- Terminal state: demoActive=true held — guided lock preserved at completion

## Section 16 — Amendment 10 (CONTRACT-v7) — 2026-03-27

### Purpose
Viewport enforcement on every guided step change, deterministic auto-start across all runs (first run, post-completion, post-persona-switch), exit guard suppresses auto-restart after explicit exit.

### Behavioral changes
1. **Viewport enforcement**: `useEffect([demoActive, guidedStepIndex, enlPersona])` fires after each step advance. Calls `document.getElementById(step.panelId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })`. Ensures active panel is in viewport on every step transition.
2. **Deterministic auto-start across runs**: Auto-start deps changed from `[enlPersona, selectedQuery]` to `[enlPersona, selectedQuery, demoComplete]`. After loop completion: persona-change effect sets `demoComplete=false` → dep change triggers auto-start on re-render → demo re-starts for new persona.
3. **Exit guard (`exitedRef`)**: `handleDemoExit` sets `exitedRef.current = true`. Auto-start checks: if `exitedRef.current && !personaChanged && !queryChanged` → suppress and consume flag. If persona or query changed (new selection) → proceed with auto-start (flag also cleared).
4. **`autoStartPrevRef`**: tracks previous persona+query values. Enables auto-start to distinguish "dep changed because persona/query changed" (should auto-start) from "dep changed because demoComplete changed" (may need suppression via exitedRef).
5. **Separate demoActive/demoComplete guards**: `if (demoActive) return` and `if (demoComplete) return` as separate guards (previous: combined `if (demoActive || demoComplete) return`). demoComplete guard is intentional stale read — fires on dep change but returns early when lock not yet cleared; second firing (after persona-change clears lock) proceeds.

### Validator results
- validate_51_8R.py: 404/404 PASS (79 groups — added 8 Amendment 10 groups; 6 supersessions for dep-string change and combined-guard supersession)
- validate_51_8R_guided.py: 82/82 PASS
- validate_51_8.py: 44/44 PASS
- validate_51_7.py: 27/27 PASS

### Governance
- Two new refs (exitedRef, autoStartPrevRef) — not state variables; not tracked by React
- Viewport scroll: DOM read only (`getElementById` + `scrollIntoView`) — no mutation
- Auto-start dep addition (demoComplete): no new state; no new API; no behavioral change to data path
- TraversalEngine.js unchanged; DemoController.js unchanged; PersonaPanel.js unchanged

## Section 15 — Amendment 9 (CONTRACT-v6) — 2026-03-27

### Purpose
Stabilize guided demo control model: Situation panel pinned during guided execution, auto-start on Persona + Query selection (CTA no longer required), uniform panel gate model (no partial unlock states).

### Behavioral changes
1. **Situation pinned during guided demo**: `handleStartDemo` and `handleDemoNext` `setOpenPanels` calls always include `'situation'` alongside the current step panel (`['situation', stepPanel]`). `handleToggle` already blocks all toggles when `demoActive` — situation cannot be closed during guided execution.
2. **Auto-start on Persona + Query**: `useEffect` with deps `[enlPersona, selectedQuery]` fires when both are set and demo is not running. Sets `demoActive=true`, `demoStage=1`, initializes guided state — same as `handleStartDemo`. CTA button preserved as fallback.
3. **CTRL+K free mode preserved**: auto-start deps are `[enlPersona, selectedQuery]` only — CTRL+K does not change either → effect does not re-fire → free mode maintained post-exit.
4. **Terminal no-restart**: at loop completion, `setEnlPersona(null)` fires → auto-start guard `if (!enlPersona || !selectedQuery) return` fires → no restart.
5. **Uniform panel gate**: all panel toggles flow through `handleToggle` with the same two guards (demoActive lock, demoComplete lock). No per-panel partial unlock logic added.

### Validator results
- validate_51_8R.py: 355/355 PASS (71 groups — added 10 Amendment 9 groups, 4 supersessions for count==1 checks broken by auto-start, _ctrlk_block extraction fix)
- validate_51_8R_guided.py: 82/82 PASS (1 supersession: Both gates before setDemoActive — index-based → handleStartDemo-relative)
- validate_51_8.py: 44/44 PASS
- validate_51_7.py: 27/27 PASS (1 supersession: execution_blocked_without_persona — index-based → handleStartDemo-relative)

### Governance
- No new state variables
- No new API calls
- TraversalEngine.js unchanged
- DemoController.js unchanged
- PersonaPanel.js unchanged
- Auto-start effect: no data fetch, no evidence access, no mutation

## Section 16 — Amendment 10 (CONTRACT-v7) — 2026-03-27

### Purpose
Stabilize guided demo control model: Situation panel pinned during guided execution, auto-start on Persona + Query selection (CTA no longer required), uniform panel gate model (no partial unlock states).

### Behavioral changes
1. **Situation pinned during guided demo**: `handleStartDemo` and `handleDemoNext` `setOpenPanels` calls always include `'situation'` alongside the current step panel (`['situation', stepPanel]`). `handleToggle` already blocks all toggles when `demoActive` — situation cannot be closed during guided execution.
2. **Auto-start on Persona + Query**: `useEffect` with deps `[enlPersona, selectedQuery]` fires when both are set and demo is not running. Sets `demoActive=true`, `demoStage=1`, initializes guided state — same as `handleStartDemo`. CTA button preserved as fallback.
3. **CTRL+K free mode preserved**: auto-start deps are `[enlPersona, selectedQuery]` only — CTRL+K does not change either → effect does not re-fire → free mode maintained post-exit.
4. **Terminal no-restart**: at loop completion, `setEnlPersona(null)` fires → auto-start guard `if (!enlPersona || !selectedQuery) return` fires → no restart.
5. **Uniform panel gate**: all panel toggles flow through `handleToggle` with the same two guards (demoActive lock, demoComplete lock). No per-panel partial unlock logic added.

### Validator results
- validate_51_8R.py: 355/355 PASS (71 groups — added 10 Amendment 9 groups, 4 supersessions for count==1 checks broken by auto-start, _ctrlk_block extraction fix)
- validate_51_8R_guided.py: 82/82 PASS (1 supersession: Both gates before setDemoActive — index-based → handleStartDemo-relative)
- validate_51_8.py: 44/44 PASS
- validate_51_7.py: 27/27 PASS (1 supersession: execution_blocked_without_persona — index-based → handleStartDemo-relative)

### Governance
- No new state variables
- No new API calls
- TraversalEngine.js unchanged
- DemoController.js unchanged
- PersonaPanel.js unchanged
- Auto-start effect: no data fetch, no evidence access, no mutation

/**
 * Control.js
 * A.15 — Snapshot Surface Normalization (G3 closed: allowedTransitions/personaEnvelope removed; mode/currentStepIndex/sequenceId/terminalState declared non-authoritative derived fields [A.15])
 * A.14 — Legacy Path Governance (G5 closed: Path B and Path C annotated as dormant-governed legacy in DEMO_NEXT; activation preconditions stated; A.10R/A.11 cited as governing authority [A.14])
 * A.13 — CONTROL Bootstrap Authority Closure (G2/G6 closed: INIT executes before !currentSnapshot guard; sole bootstrap authority established [A.13])
 * A.12 — Consistency Drift Elimination (G4 closed: PERSONA_GUIDED_FLOWS exported as canonical named export; local runtime duplicate removed [A.12])
 * A.5 — CONTROL Shadow Implementation
 *
 * Stream:    A.5 | Shadow Implementation | Fail-Closed | Non-Destructive
 * Authority: A.4 CONTROL Surface Specification | A.3 CONTROL Layer Externalization
 *            A.2R Projection Purity Contract | A.2G Projection Purity Gate
 *            canonical-layer-model.md (00.2) | program_intelligence_stack.md (B.1)
 *            pios_traversal_contract.md (D.1) | execlens_traversal_binding.md (D.2)
 *            drift_register.md (DRIFT-001)
 *
 * PURPOSE
 * Pure CONTROL surface — shadow implementation.
 * Mirrors all runtime authority logic from 51.9 ExecLens (index.js HEAD a5691c3).
 * Zero runtime modification. Zero side effects. Deterministic.
 *
 * Exports:
 *   CONTROL(intent, runtimeContext, currentSnapshot) → CONTROL_RESPONSE
 *   buildSnapshot(runtimeState) → { status, ...CONTROL_SNAPSHOT } | { status: 'FAIL', failReason }
 *   compareParityToRuntime(runtimeState, controlResponse) → PARITY_RESULT
 *   produceTrace(intent, snapshot, controlResponse, runtimeState, parityResult) → TRACE_RECORD
 *   INTENTS, MODES (constants)
 *
 * EXECUTION PRINCIPLE
 * "Replicate, do not reinterpret."
 * Behavioral source of truth: 51.9 runtime. Any deviation = FAIL.
 *
 * PROHIBITIONS (enforced by contract A.5 §8)
 * This file must NOT be imported by index.js or TraversalEngine.js.
 * It must NOT alter runtime state.
 * It must NOT introduce authority back into Projection.
 */

import {
  PANEL_STATES,
  computePanelState,
  getFlowPanels,
} from './TraversalEngine'
// A.15: PERSONA_DEPTH_ENVELOPE and D2_PATH_MAP removed from import — were used only by
// allowedTransitions and personaEnvelope (both removed as unconsumed G3 fields). [A.15]

// ---------------------------------------------------------------------------
// §1 — Constants (mirrored exactly from runtime source of truth)
// Source: index.js HEAD a5691c3
// ---------------------------------------------------------------------------

const PANEL_IDS = ['situation', 'persona', 'signals', 'evidence', 'narrative']

// PERSONA_GUIDED_FLOWS — canonical flow definition; exported as named export for runtime consumption. [A.12 G4]
// Static. No computation. Reuse existing panel IDs only.
export const PERSONA_GUIDED_FLOWS = {
  EXECUTIVE: [
    { id: 'narrative', label: 'Answer',   panelId: 'narrative' },
    { id: 'signals',   label: 'Signal',   panelId: 'signals'   },
    { id: 'evidence',  label: 'Evidence', panelId: 'evidence'  },
  ],
  CTO: [
    { id: 'signals',   label: 'Signal',   panelId: 'signals'   },
    { id: 'evidence',  label: 'Evidence', panelId: 'evidence'  },
    { id: 'narrative', label: 'Answer',   panelId: 'narrative' },
  ],
  ANALYST: [
    { id: 'evidence',  label: 'Evidence', panelId: 'evidence'  },
    { id: 'signals',   label: 'Signal',   panelId: 'signals'   },
    { id: 'narrative', label: 'Answer',   panelId: 'narrative' },
    { id: 'raw',       label: 'Raw',      panelId: 'evidence',  rawStep: true },
  ],
}

// PERSONA_DEFAULT_FLOW — mirrored from index.js:54–58
const _PERSONA_DEFAULT_FLOW = {
  EXECUTIVE: 'executive_insight',
  CTO:       'structural_analysis',
  ANALYST:   'evidence_audit',
}

// TOTAL_STAGES — mirrored from index.js:93
const TOTAL_STAGES = 5

// STAGE_PANEL — mirrored from index.js:96–102
const STAGE_PANEL = {
  1: 'situation',
  2: 'signals',
  3: 'persona',
  4: 'evidence',
  5: 'narrative',
}

// ---------------------------------------------------------------------------
// §2 — Intent and Mode definitions
// ---------------------------------------------------------------------------

export const INTENTS = {
  DEMO_START:           'DEMO_START',    // handleStartDemo
  DEMO_NEXT:            'DEMO_NEXT',     // handleDemoNext
  DEMO_EXIT:            'DEMO_EXIT',     // handleDemoExit / ⌘K
  PANEL_TOGGLE:         'PANEL_TOGGLE',  // handleToggle
  PERSONA_SELECT:       'PERSONA_SELECT', // setEnlPersona + persona change reset effect
  QUERY_SELECT:         'QUERY_SELECT',  // setSelectedQuery
  AUTO_START:           'AUTO_START',    // auto-start useEffect
  INIT:                 'INIT',          // initial state construction
}

export const MODES = {
  ENTRY:           'ENTRY',           // !demoActive && !demoComplete && !freeMode
  GUIDED:          'GUIDED',          // demoActive === true
  FREE:            'FREE',            // freeMode === true (Operator mode)
  POST_COMPLETION: 'POST_COMPLETION', // demoComplete === true, !demoActive, !freeMode
}

// ---------------------------------------------------------------------------
// §3 — Pure derivation helpers
// ---------------------------------------------------------------------------

// deriveMode — mirrors mode semantics from runtime orchestration flags
// Precedence: FREE > GUIDED > POST_COMPLETION > ENTRY
// (freeMode is checked first because CTRL+K can set freeMode=true from any state)
function _deriveMode({ demoActive, demoComplete, freeMode }) {
  if (freeMode)      return MODES.FREE
  if (demoActive)    return MODES.GUIDED
  if (demoComplete)  return MODES.POST_COMPLETION
  return MODES.ENTRY
}

// _resolvePanelState — mirrors getPanelExpanded (index.js:217–229) + computePanelState
// Returns full PANEL_STATE string (not boolean) for richer snapshot representation.
// ENTRY/FREE/POST_COMPLETION: ACTIVE if open, AVAILABLE otherwise (all accessible in open-access modes)
// GUIDED: computePanelState governs except non-traversal companion panels and rawStep exception
function _resolvePanelState(panelId, openPanels, traversalHistory, persona, demoActive, freeMode, rawStepActive) {
  // Non-traversal companion panels: always openPanels [situation pinned, persona always interactive]
  // These panels are never in traversalHistory; computePanelState is not authoritative for them.
  if (panelId === 'situation' || panelId === 'persona') {
    return openPanels.includes(panelId) ? PANEL_STATES.ACTIVE : PANEL_STATES.AVAILABLE
  }
  // GUIDED mode: computePanelState governs [D.3 / 51.9B]
  if (demoActive) {
    // rawStep exception: ANALYST step 4 re-opens 'evidence' without new traversalHistory entry [51.8R]
    if (rawStepActive && panelId === 'evidence') {
      return openPanels.includes('evidence') ? PANEL_STATES.ACTIVE : PANEL_STATES.AVAILABLE
    }
    return computePanelState(panelId, openPanels, traversalHistory, persona, demoActive, freeMode)
  }
  // ENTRY / FREE / POST_COMPLETION: openPanels-driven [51.8R sanctioned]
  return openPanels.includes(panelId) ? PANEL_STATES.ACTIVE : PANEL_STATES.AVAILABLE
}

// _resolveAllPanelStates — full panel state map for all PANEL_IDS
function _resolveAllPanelStates(openPanels, traversalHistory, persona, demoActive, freeMode, rawStepActive) {
  const result = {}
  for (const panelId of PANEL_IDS) {
    result[panelId] = _resolvePanelState(
      panelId, openPanels, traversalHistory, persona, demoActive, freeMode, rawStepActive
    )
  }
  return result
}

// A.15: _resolveAllowedTransitions REMOVED — sole call site was allowedTransitions in
// _rebuildDerivedFields, which is removed as an unconsumed G3 field. [A.15]

// _applyToggle — mirrors togglePanel (index.js:188–196): toggle with max-2 rule
function _applyToggle(openPanels, panelId) {
  if (openPanels.includes(panelId)) {
    return openPanels.filter(id => id !== panelId)
  }
  const next = [...openPanels, panelId]
  return next.length > 2 ? next.slice(next.length - 2) : next
}

// _appendHistory — mirrors setTraversalHistory append guard (index.js:451)
// Deduplication: if panelId already in history, returns history unchanged
function _appendHistory(traversalHistory, panelId) {
  if (!panelId || panelId === 'situation') return traversalHistory
  if (traversalHistory.includes(panelId)) return traversalHistory
  return [...traversalHistory, panelId]
}

// _openPanelsForStep — mirrors setOpenPanels call pattern in handleDemoNext (index.js:449)
// situation always pinned [51.8R amendment 9]
function _openPanelsForStep(stepPanel) {
  return stepPanel === 'situation' ? ['situation'] : ['situation', stepPanel]
}

// ---------------------------------------------------------------------------
// §4 — Initial snapshot — mirrors useState initializations (index.js:138–168)
// ---------------------------------------------------------------------------

function _buildInitSnapshot() {
  const orchestrationState = {
    demoActive:         false,
    demoStage:          0,
    demoComplete:       false,
    guidedStepIndex:    0,
    rawStepActive:      false,
    freeMode:           false,
    traversalNodeIndex: 0,
    selectedFlow:       null,
  }
  const openPanels     = ['situation'] // mirrors useState(['situation']) index.js:145
  const traversalHistory = []
  const selectedPersona  = null

  return {
    // ── Authoritative fields — consumed by applyControlResponse [A.6] ──────────
    selectedPersona,
    selectedQuery:      null,
    resolvedPanelState: _resolveAllPanelStates(openPanels, traversalHistory, null, false, false, false),
    openPanels,
    traversalHistory,
    orchestrationState,
    // ── Non-authoritative derived fields — informational; not applied to React state [A.15 G3] ──
    mode:               MODES.ENTRY,
    currentStepIndex:   0,    // mirrors orchestrationState.guidedStepIndex
    sequenceId:         null, // mirrors selectedPersona
    terminalState:      false, // derivable: demoComplete && !demoActive && !freeMode
    // allowedTransitions: REMOVED [A.15] — no render consumer
    // personaEnvelope:    REMOVED [A.15] — no render consumer
  }
}

// _rebuildDerivedFields — recompute all derived snapshot fields after state change
function _rebuildDerivedFields(snapshot) {
  const { openPanels, traversalHistory, selectedPersona, orchestrationState } = snapshot
  const { demoActive, freeMode, rawStepActive, demoComplete } = orchestrationState
  return {
    ...snapshot,
    // ── Authoritative derived field — consumed by applyControlResponse [A.6] ────
    resolvedPanelState: _resolveAllPanelStates(
      openPanels, traversalHistory, selectedPersona, demoActive, freeMode, rawStepActive
    ),
    // ── Non-authoritative derived fields — informational; not applied to React state [A.15 G3] ──
    mode:               _deriveMode(orchestrationState),
    sequenceId:         selectedPersona || null, // mirrors selectedPersona
    terminalState:      demoComplete && !demoActive && !freeMode,
    // allowedTransitions: REMOVED [A.15] — no render consumer
    // personaEnvelope:    REMOVED [A.15] — no render consumer
  }
}

// ---------------------------------------------------------------------------
// §5 — CONTROL — pure function
//
// CONTROL(intent, runtimeContext, currentSnapshot) → CONTROL_RESPONSE
//
// intent:           string — one of INTENTS
// runtimeContext:   object — intent-specific payload (e.g., { panelId } for PANEL_TOGGLE)
// currentSnapshot:  CONTROL_SNAPSHOT — state before the intent
//
// Returns CONTROL_RESPONSE:
//   { status: 'OK'|'FAIL', failReason: string|null, traceId: string, newSnapshot: CONTROL_SNAPSHOT }
//
// Pure: no hidden state, no side effects, no external authority, deterministic.
// ---------------------------------------------------------------------------

export function CONTROL(intent, runtimeContext, currentSnapshot) {
  const traceId = `ctrl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  // Fail-closed: required inputs
  if (!intent) {
    return { status: 'FAIL', failReason: 'intent is required', traceId, newSnapshot: currentSnapshot || null }
  }

  // ── INTENT: INIT ──────────────────────────────────────────────────────────
  // INIT requires no prior snapshot — must execute before the !currentSnapshot guard. [A.13 G2/G6]
  // _buildInitSnapshot() is entirely self-contained: constructs canonical bootstrap state from scratch.
  // Calling CONTROL(INTENTS.INIT, {}, null) now returns a valid snapshot. Deadlock resolved.
  if (intent === INTENTS.INIT) {
    return { status: 'OK', failReason: null, traceId, newSnapshot: _buildInitSnapshot() }
  }

  // All other intents require a valid current snapshot
  if (!currentSnapshot) {
    return { status: 'FAIL', failReason: 'currentSnapshot is required', traceId, newSnapshot: null }
  }

  const ctx = runtimeContext || {}

  const {
    openPanels,
    traversalHistory,
    orchestrationState,
    selectedPersona,
    selectedQuery,
  } = currentSnapshot

  const {
    demoActive,
    demoStage,
    demoComplete,
    guidedStepIndex,
    rawStepActive,
    freeMode,
    selectedFlow,
    traversalNodeIndex,
  } = orchestrationState

  // ── INTENT: DEMO_EXIT ─────────────────────────────────────────────────────
  // Mirrors handleDemoExit (index.js:488–499)
  // Sets freeMode=true (Operator FREE mode); clears all demo orchestration state.
  if (intent === INTENTS.DEMO_EXIT) {
    const newOrchestration = {
      ...orchestrationState,
      freeMode:           true,      // setFreeMode(true) — enter Operator FREE mode [51.8R RUN04]
      demoActive:         false,
      demoStage:          0,
      demoComplete:       false,     // clear terminal state [51.8R amendment]
      guidedStepIndex:    0,
      rawStepActive:      false,
      traversalNodeIndex: 0,
      selectedFlow:       null,      // mandatory exit reset [51.6R.2]
    }
    const partial = {
      ...currentSnapshot,
      // openPanels preserved: runtime handleDemoExit does not call setOpenPanels [MM-001 fix]
      traversalHistory:   [], // D.3: Operator mode session not added to governed traversal history
      orchestrationState: newOrchestration,
    }
    return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
  }

  // ── INTENT: PANEL_TOGGLE ──────────────────────────────────────────────────
  // Mirrors handleToggle (index.js:204–212)
  if (intent === INTENTS.PANEL_TOGGLE) {
    const { panelId } = ctx
    if (!panelId) {
      return { status: 'FAIL', failReason: 'PANEL_TOGGLE requires runtimeContext.panelId', traceId, newSnapshot: currentSnapshot }
    }
    // Guided demo: step-driven only — toggle is a no-op [51.8]
    if (demoActive) {
      return { status: 'OK', failReason: null, traceId, newSnapshot: currentSnapshot }
    }
    // Post-completion lock: only persona panel interactive [51.8R amendment 7]
    if (demoComplete && panelId !== 'persona') {
      return { status: 'OK', failReason: null, traceId, newSnapshot: currentSnapshot }
    }
    // validatePanelTransition NOT applied: ENTRY/FREE/OPERATOR are sanctioned open-access modes [51.9B]
    const newOpenPanels = _applyToggle(openPanels, panelId)
    const partial = {
      ...currentSnapshot,
      openPanels: newOpenPanels,
    }
    return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
  }

  // ── INTENT: PERSONA_SELECT ────────────────────────────────────────────────
  // Mirrors setEnlPersona call + persona change reset useEffect (index.js:308–323)
  // persona may be null (deselect / terminal reset)
  if (intent === INTENTS.PERSONA_SELECT) {
    const { persona } = ctx
    // typeof check: persona must be string or null — not undefined
    if (persona === undefined) {
      return { status: 'FAIL', failReason: 'PERSONA_SELECT requires runtimeContext.persona (string or null)', traceId, newSnapshot: currentSnapshot }
    }
    let newOrchestration = {
      ...orchestrationState,
      guidedStepIndex: 0, // always reset on persona change [51.8R amendment 5]
    }
    // Reset completion lock if selecting a non-null persona [51.8R amendment 6]
    if (persona !== null) {
      newOrchestration.demoComplete = false
    }
    // If demo was active: full demo state reset [51.8R amendment — persona switch mid-demo]
    let newTraversalHistory = traversalHistory
    if (demoActive) {
      newOrchestration = {
        ...newOrchestration,
        demoActive:         false,
        demoStage:          0,
        traversalNodeIndex: 0,
        selectedFlow:       null,
        rawStepActive:      false,
      }
      // traversalHistory preserved: runtime persona change effect does not clear it [MM-002/MM-003 fix]
    }
    const partial = {
      ...currentSnapshot,
      selectedPersona:    persona,
      traversalHistory:   newTraversalHistory,
      orchestrationState: newOrchestration,
    }
    return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
  }

  // ── INTENT: QUERY_SELECT ──────────────────────────────────────────────────
  // Mirrors setSelectedQuery + query fetch useEffect side effects on state
  // (index.js:254–285 — persona preserved on non-null query, cleared on null)
  if (intent === INTENTS.QUERY_SELECT) {
    const { query } = ctx
    if (query === undefined) {
      return { status: 'FAIL', failReason: 'QUERY_SELECT requires runtimeContext.query (string or null)', traceId, newSnapshot: currentSnapshot }
    }
    // Null query: clear persona + traversal state [index.js:256–262]
    if (query === null) {
      const newOrchestration = {
        ...orchestrationState,
        traversalNodeIndex: 0,
      }
      const partial = {
        ...currentSnapshot,
        selectedQuery:      null,
        selectedPersona:    null, // setEnlPersona(null)
        traversalHistory:   [],
        orchestrationState: newOrchestration,
      }
      return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
    }
    // Non-null query: preserve persona, reset traversalNodeIndex [51.8R amendment 8]
    const newOrchestration = {
      ...orchestrationState,
      traversalNodeIndex: 0,
    }
    const partial = {
      ...currentSnapshot,
      selectedQuery:      query,
      orchestrationState: newOrchestration,
      // selectedPersona preserved — no reset on non-null query [51.8R amendment 8]
    }
    return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
  }

  // ── INTENT: DEMO_START ────────────────────────────────────────────────────
  // Mirrors handleStartDemo (index.js:395–426)
  // Explicit guided start. Clears freeMode.
  if (intent === INTENTS.DEMO_START) {
    if (!selectedPersona) {
      return { status: 'FAIL', failReason: 'DEMO_START requires selectedPersona', traceId, newSnapshot: currentSnapshot }
    }
    if (!selectedQuery) {
      return { status: 'FAIL', failReason: 'DEMO_START requires selectedQuery', traceId, newSnapshot: currentSnapshot }
    }
    // Derive first step (mirrors activeFlow path in handleStartDemo — always resolves for known personas)
    const steps       = PERSONA_GUIDED_FLOWS[selectedPersona]
    const activeFlow  = _PERSONA_DEFAULT_FLOW[selectedPersona] || null
    const firstPanel  = steps && steps.length > 0
      ? steps[0].panelId
      : (activeFlow ? (getFlowPanels(activeFlow)[0] || 'situation') : 'situation')

    const newOpenPanels     = _openPanelsForStep(firstPanel)
    const newTraversalHist  = firstPanel && firstPanel !== 'situation' ? [firstPanel] : []

    const newOrchestration = {
      ...orchestrationState,
      demoActive:         true,
      demoStage:          1,
      demoComplete:       false,
      guidedStepIndex:    0,
      rawStepActive:      false,
      traversalNodeIndex: 0,
      selectedFlow:       activeFlow,
      freeMode:           false,     // explicit start clears operator FREE mode [51.8R RUN04]
    }
    const partial = {
      ...currentSnapshot,
      openPanels:         newOpenPanels,
      traversalHistory:   newTraversalHist,
      orchestrationState: newOrchestration,
      currentStepIndex:   0,
    }
    return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
  }

  // ── INTENT: AUTO_START ────────────────────────────────────────────────────
  // Mirrors auto-start useEffect (index.js:349–376)
  // Auto-start fires when: persona + query both present, !demoActive, !demoComplete, !freeMode
  if (intent === INTENTS.AUTO_START) {
    // Fail-closed: auto-start must not fire in FREE mode
    if (freeMode) {
      return { status: 'FAIL', failReason: 'AUTO_START is blocked in FREE mode (freeMode=true)', traceId, newSnapshot: currentSnapshot }
    }
    if (!selectedPersona) {
      return { status: 'FAIL', failReason: 'AUTO_START requires selectedPersona', traceId, newSnapshot: currentSnapshot }
    }
    if (!selectedQuery) {
      return { status: 'FAIL', failReason: 'AUTO_START requires selectedQuery', traceId, newSnapshot: currentSnapshot }
    }
    if (demoActive) {
      return { status: 'FAIL', failReason: 'AUTO_START blocked: demo already active', traceId, newSnapshot: currentSnapshot }
    }
    if (demoComplete) {
      return { status: 'FAIL', failReason: 'AUTO_START blocked: demoComplete (persona change effect must clear first)', traceId, newSnapshot: currentSnapshot }
    }

    const steps      = PERSONA_GUIDED_FLOWS[selectedPersona]
    const activeFlow = _PERSONA_DEFAULT_FLOW[selectedPersona] || null
    const firstPanel = steps && steps.length > 0 ? steps[0].panelId : 'situation'

    const newOpenPanels    = _openPanelsForStep(firstPanel)
    const newTraversalHist = firstPanel && firstPanel !== 'situation' ? [firstPanel] : []

    const newOrchestration = {
      ...orchestrationState,
      demoActive:         true,
      demoStage:          1,
      demoComplete:       false,
      guidedStepIndex:    0,
      rawStepActive:      false,
      traversalNodeIndex: 0,
      selectedFlow:       activeFlow,
      // AUTO_START does NOT modify freeMode — it is already false (guard above)
    }
    const partial = {
      ...currentSnapshot,
      openPanels:         newOpenPanels,
      traversalHistory:   newTraversalHist,
      orchestrationState: newOrchestration,
      currentStepIndex:   0,
    }
    return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
  }

  // ── INTENT: DEMO_NEXT ─────────────────────────────────────────────────────
  // Mirrors handleDemoNext (index.js:428–486) — three execution paths:
  //   Path A: PERSONA_GUIDED_FLOWS (primary — all current personas) [DECLARED / AUTHORIZED]
  //   Path B: legacy selectedFlow traversal mode [51.6]             [DORMANT-GOVERNED LEGACY — A.14]
  //   Path C: standard stage mode [51.4]                            [DORMANT-GOVERNED LEGACY — A.14]
  if (intent === INTENTS.DEMO_NEXT) {
    const steps = selectedPersona ? PERSONA_GUIDED_FLOWS[selectedPersona] : null

    // ── Path A: PERSONA_GUIDED_FLOWS (primary path) ──────────────────────
    // validatePanelTransition NOT applied: sequences are valid-by-construction [51.9B]
    // ANALYST (evidence→signals) and CTO (signals-first) are sanctioned 51.8R exceptions.
    if (steps) {
      const nextIndex = guidedStepIndex + 1

      // Terminal state: all steps completed
      if (nextIndex >= steps.length) {
        // [51.8R amendment 6]: post-completion lock + persona clear
        const newOrchestration = {
          ...orchestrationState,
          demoComplete:    true,
          demoActive:      false,
          guidedStepIndex: 0,
          rawStepActive:   false,
        }
        const partial = {
          ...currentSnapshot,
          selectedPersona:    null,    // setEnlPersona(null)
          openPanels:         ['situation'],
          orchestrationState: newOrchestration,
          currentStepIndex:   0,
        }
        return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
      }

      // Advance to next step
      const step       = steps[nextIndex]
      const stepPanel  = step.panelId
      const newOpenPanels    = _openPanelsForStep(stepPanel)
      // Dedup guard: if stepPanel already in history, do not re-append [index.js:451]
      const newTraversalHist = (stepPanel && stepPanel !== 'situation')
        ? _appendHistory(traversalHistory, stepPanel)
        : traversalHistory
      // rawStep: ANALYST step 4 forces rawStepActive=true [51.8R guided correction]
      const newRawStepActive = step.rawStep ? true : rawStepActive

      const newOrchestration = {
        ...orchestrationState,
        guidedStepIndex: nextIndex,
        rawStepActive:   newRawStepActive,
      }
      const partial = {
        ...currentSnapshot,
        openPanels:         newOpenPanels,
        traversalHistory:   newTraversalHist,
        orchestrationState: newOrchestration,
        currentStepIndex:   nextIndex,
      }
      return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
    }

    // ── Path B: DORMANT-GOVERNED LEGACY — selectedFlow traversal mode [51.6] ─────
    // Governance authority: A.10R (gate verdict) | A.11 (closure planning) | A.14 (archival)
    // Status: ARCHIVED — non-authoritative; retained for historical traceability only.
    // Reachability: state combination (selectedPersona=null && selectedFlow!=null) is
    //   CONTROL-unproducible. DEMO_START gates on non-null selectedPersona; no current
    //   transition produces selectedFlow without selectedPersona. Path is unreachable.
    // Activation precondition: full snapshot coverage for Path B scenarios required;
    //   A.5B-equivalent validation required; dedicated CONTROL stream must explicitly
    //   activate this path. NO execution without that stream.
    if (selectedFlow) {
      const panels    = getFlowPanels(selectedFlow)
      const nextIndex = traversalNodeIndex + 1

      if (nextIndex >= panels.length) {
        // Terminal
        const newOrchestration = {
          ...orchestrationState,
          demoComplete:       true,
          demoActive:         false,
          guidedStepIndex:    0,
          rawStepActive:      false,
          traversalNodeIndex: nextIndex,
        }
        const partial = {
          ...currentSnapshot,
          selectedPersona:    null,
          orchestrationState: newOrchestration,
        }
        return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
      }

      const newOrchestration = {
        ...orchestrationState,
        traversalNodeIndex: nextIndex,
      }
      const partial = {
        ...currentSnapshot,
        openPanels:         [panels[nextIndex]], // legacy: no situation pin [51.6 behavior]
        orchestrationState: newOrchestration,
      }
      return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
    }

    // ── Path C: DORMANT-GOVERNED LEGACY — standard stage mode [51.4] ────────────
    // Governance authority: A.10R (gate verdict) | A.11 (closure planning) | A.14 (archival)
    // Status: ARCHIVED — non-authoritative; retained for historical traceability only.
    // Reachability: state (!selectedPersona && !selectedFlow && demoActive) is
    //   unreachable — DEMO_START gates on non-null selectedPersona, so demoActive=true
    //   implies selectedPersona is non-null, which populates `steps` (Path A). Unreachable.
    // Open gap: G1 — DEMO_NEXT Path C does not set selectedQuery (removed in A.9).
    // Activation preconditions: (1) G1 must be closed (selectedQuery mutation added);
    //   (2) path must be formally declared; (3) A.5B-equivalent validation for Path C
    //   scenarios must be performed; (4) dedicated CONTROL stream must explicitly activate.
    //   NO execution without all four preconditions met.
    const newDemoStage = demoStage + 1
    if (newDemoStage > TOTAL_STAGES) {
      const newOrchestration = {
        ...orchestrationState,
        demoComplete:    true,
        demoActive:      false,
        guidedStepIndex: 0,
        rawStepActive:   false,
        demoStage:       newDemoStage,
      }
      const partial = {
        ...currentSnapshot,
        selectedPersona:    null,
        orchestrationState: newOrchestration,
      }
      return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
    } else {
      const stagePanelId  = STAGE_PANEL[newDemoStage]
      let newOpenPanels   = openPanels
      if (stagePanelId && !openPanels.includes(stagePanelId)) {
        // mirrors openPanel() — append with max-2 rule [index.js:179–186]
        const next = [...openPanels, stagePanelId]
        newOpenPanels = next.length > 2 ? next.slice(next.length - 2) : next
      }
      const newOrchestration = {
        ...orchestrationState,
        demoStage: newDemoStage,
      }
      const partial = {
        ...currentSnapshot,
        openPanels:         newOpenPanels,
        orchestrationState: newOrchestration,
      }
      return { status: 'OK', failReason: null, traceId, newSnapshot: _rebuildDerivedFields(partial) }
    }
  }

  // ── Unknown intent — fail closed ──────────────────────────────────────────
  return {
    status:      'FAIL',
    failReason:  `Unknown intent: '${intent}'. Must be one of: ${Object.values(INTENTS).join(', ')}`,
    traceId,
    newSnapshot: currentSnapshot,
  }
}

// ---------------------------------------------------------------------------
// §6 — buildSnapshot (Shadow Adapter)
//
// Constructs a CONTROL_SNAPSHOT from the runtime's React state.
// Observation only: no mutation, no injection, no authority alteration.
//
// Usage: developer captures runtimeState as a plain object snapshot at a
// point in time and passes it here. Does not require live runtime access.
//
// runtimeState must include the following fields from index.js Home():
//   openPanels, traversalHistory, enlPersona, selectedQuery,
//   demoActive, demoStage, demoComplete, guidedStepIndex,
//   rawStepActive, freeMode, selectedFlow, traversalNodeIndex
//
// Returns { status: 'OK', ...CONTROL_SNAPSHOT } | { status: 'FAIL', failReason }
// ---------------------------------------------------------------------------

export function buildSnapshot(runtimeState) {
  if (!runtimeState || typeof runtimeState !== 'object') {
    return { status: 'FAIL', failReason: 'runtimeState must be a non-null object' }
  }

  const REQUIRED = [
    'openPanels', 'traversalHistory', 'demoActive', 'freeMode', 'demoComplete'
  ]
  for (const field of REQUIRED) {
    if (runtimeState[field] === undefined) {
      return { status: 'FAIL', failReason: `Required field missing from runtimeState: '${field}'` }
    }
  }

  const {
    openPanels,
    traversalHistory,
    enlPersona       = null,
    selectedQuery    = null,
    demoActive,
    demoStage        = 0,
    demoComplete,
    guidedStepIndex  = 0,
    rawStepActive    = false,
    freeMode,
    selectedFlow     = null,
    traversalNodeIndex = 0,
  } = runtimeState

  // Validate types — fail closed on ambiguous state
  if (!Array.isArray(openPanels))       return { status: 'FAIL', failReason: 'openPanels must be an array' }
  if (!Array.isArray(traversalHistory)) return { status: 'FAIL', failReason: 'traversalHistory must be an array' }

  const orchestrationState = {
    demoActive,
    demoStage,
    demoComplete,
    guidedStepIndex,
    rawStepActive,
    freeMode,
    traversalNodeIndex,
    selectedFlow,
  }

  const snapshot = {
    // ── Authoritative fields — consumed by applyControlResponse [A.6] ──────────
    status:             'OK',
    selectedPersona:    enlPersona,
    selectedQuery,
    resolvedPanelState: _resolveAllPanelStates(openPanels, traversalHistory, enlPersona, demoActive, freeMode, rawStepActive),
    openPanels:         [...openPanels],
    traversalHistory:   [...traversalHistory],
    orchestrationState,
    // ── Non-authoritative derived fields — informational; not applied to React state [A.15 G3] ──
    mode:               _deriveMode(orchestrationState),
    currentStepIndex:   guidedStepIndex, // mirrors orchestrationState.guidedStepIndex
    sequenceId:         enlPersona,      // mirrors selectedPersona
    terminalState:      demoComplete && !demoActive && !freeMode,
    // allowedTransitions: REMOVED [A.15] — no render consumer
    // personaEnvelope:    REMOVED [A.15] — no render consumer
  }

  return snapshot
}

// ---------------------------------------------------------------------------
// §7 — compareParityToRuntime (Parity Comparison Harness)
//
// Compares CONTROL_RESPONSE.newSnapshot against the observed runtime state
// after the same intent was applied to the runtime.
//
// Exact structural equality required — no tolerance, no approximation.
// Any mismatch → FAIL with exact field-level difference.
//
// Usage:
//   1. Capture runtimeState BEFORE intent → call buildSnapshot → get snapshotBefore
//   2. Apply intent to runtime (user action or programmatic)
//   3. Capture runtimeState AFTER intent → runtimeStateAfter
//   4. Call CONTROL(intent, ctx, snapshotBefore) → controlResponse
//   5. Call compareParityToRuntime(runtimeStateAfter, controlResponse) → PARITY_RESULT
// ---------------------------------------------------------------------------

// Fields compared for parity — ordered by failure significance
const PARITY_FIELDS = [
  'openPanels',
  'traversalHistory',
  'currentStepIndex',
  'mode',
  'selectedPersona',
  'selectedQuery',
  'terminalState',
  'orchestrationState.demoActive',
  'orchestrationState.demoComplete',
  'orchestrationState.freeMode',
  'orchestrationState.rawStepActive',
  'orchestrationState.guidedStepIndex',
  'orchestrationState.demoStage',
  'orchestrationState.selectedFlow',
  'orchestrationState.traversalNodeIndex',
]

function _getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc != null && key in acc ? acc[key] : undefined), obj)
}

function _deepEqual(a, b) {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((v, i) => _deepEqual(v, b[i]))
  }
  if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a).sort()
    const kb = Object.keys(b).sort()
    if (!_deepEqual(ka, kb)) return false
    return ka.every(k => _deepEqual(a[k], b[k]))
  }
  return false
}

export function compareParityToRuntime(runtimeStateAfter, controlResponse) {
  const traceId = controlResponse.traceId || `parity-${Date.now()}`

  // CONTROL itself failed — immediate FAIL
  if (controlResponse.status === 'FAIL') {
    return {
      status:         'FAIL',
      mismatchFields: ['CONTROL_STATUS'],
      runtimeValue:   null,
      controlValue:   { status: 'FAIL', failReason: controlResponse.failReason },
      traceId,
    }
  }

  // Build runtime snapshot from post-intent state
  const runtimeSnapshot = buildSnapshot(runtimeStateAfter)
  if (runtimeSnapshot.status === 'FAIL') {
    return {
      status:         'FAIL',
      mismatchFields: ['RUNTIME_SNAPSHOT_BUILD'],
      runtimeValue:   null,
      controlValue:   null,
      traceId,
    }
  }

  const controlSnapshot = controlResponse.newSnapshot
  if (!controlSnapshot) {
    return {
      status:         'FAIL',
      mismatchFields: ['CONTROL_SNAPSHOT_NULL'],
      runtimeValue:   null,
      controlValue:   null,
      traceId,
    }
  }

  const mismatchFields = []
  const mismatchDetails = {}

  for (const field of PARITY_FIELDS) {
    const rVal = _getNestedValue(runtimeSnapshot, field)
    const cVal = _getNestedValue(controlSnapshot, field)
    if (!_deepEqual(rVal, cVal)) {
      mismatchFields.push(field)
      mismatchDetails[field] = { runtime: rVal, control: cVal }
    }
  }

  if (mismatchFields.length > 0) {
    const firstField = mismatchFields[0]
    return {
      status:         'FAIL',
      mismatchFields,
      mismatchDetails,
      runtimeValue:   mismatchDetails[firstField].runtime,
      controlValue:   mismatchDetails[firstField].control,
      traceId,
    }
  }

  return {
    status:         'PASS',
    mismatchFields: [],
    mismatchDetails: {},
    runtimeValue:   null,
    controlValue:   null,
    traceId,
  }
}

// ---------------------------------------------------------------------------
// §8 — produceTrace
//
// Deterministic trace record per CONTROL invocation.
// Replayable across runs: all inputs and outputs captured.
// ---------------------------------------------------------------------------

export function produceTrace(intent, inputSnapshot, controlResponse, runtimeStateAfter, parityResult) {
  return {
    timestamp:           Date.now(),
    traceId:             controlResponse.traceId,
    inputIntent:         intent,
    inputSnapshot:       inputSnapshot,
    controlResponse: {
      status:            controlResponse.status,
      failReason:        controlResponse.failReason || null,
      newSnapshot:       controlResponse.newSnapshot,
    },
    runtimeStateAfter,
    parityResult,
  }
}

// ---------------------------------------------------------------------------
// §9 — Usage pattern (reference only — not executable as-is)
//
// 1. Initial state:
//    const snapshot0 = CONTROL(INTENTS.INIT, {}, null).newSnapshot
//
// 2. Before a user action (e.g., DEMO_NEXT), capture runtime state:
//    const runtimeBefore = captureRuntimeState()  // developer-provided
//    const snapshotBefore = buildSnapshot(runtimeBefore)
//
// 3. Apply intent to CONTROL:
//    const response = CONTROL(INTENTS.DEMO_NEXT, {}, snapshotBefore)
//
// 4. After action completes in runtime, capture post-action state:
//    const runtimeAfter = captureRuntimeState()
//
// 5. Compare parity:
//    const parity = compareParityToRuntime(runtimeAfter, response)
//
// 6. Produce trace:
//    const trace = produceTrace(INTENTS.DEMO_NEXT, snapshotBefore, response, runtimeAfter, parity)
//
// 7. Parity PASS → CONTROL mirrors runtime exactly for this interaction.
//    Parity FAIL → mismatchFields and mismatchDetails identify exact divergence.
//
// CONTROL is ready for A.6 (Authority Switch) when parity PASS is established
// across all interactions under test.
// ---------------------------------------------------------------------------

/**
 * pages/index.js
 * PIOS-51.15-SURFACE-CLARITY (entry strip border/bg; active step elevated contrast; operator mode orange tint + desc text; presentation-only [51.15])
 * PIOS-51.14T-ENTRY-RESET (demoComplete removed from showExtendedPanels; POST_COMPLETION renders clean ENTRY surface; activePanelId ENTRY logic applies at POST_COMPLETION [51.14T])
 * PIOS-51.14S-FOCUS-STEERING (viewport scroll fixed: getElementById→querySelector; activePanelId elevated to useMemo; scroll-on-change useEffect added; persona-switch focus covered [51.14S])
 * PIOS-51.14R-ENTRY-ENFORCEMENT (query-first activation: QuerySelector always enabled; signals/narrative gated to showExtendedPanels only; entry strip query→persona order; attention corrected [51.14R])
 * PIOS-51.14-ENTRY-SEMANTICS (entry strip restructured: query is explicit Step 2/activation point; persona framed as context modifier; attention guidance via activePanelId/dp-active; exit clarity [51.14])
 * PIOS-51.13-GUIDED-CLARITY (progressive panel reveal: signals/evidence/narrative deferred from ENTRY surface; showExtendedPanels derived from CONTROL orchestration state [51.13])
 * PIOS-51.12-PROJECTION-REFINEMENT (STAGE_PANEL dead constant removed; post-completion context indicator added; projection-layer cleanup only [51.12])
 * PIOS-A.12-CONSISTENCY-DRIFT (G4 closed: PERSONA_GUIDED_FLOWS local duplicate removed; imported from CONTROL canonical export [A.12])
 * PIOS-51.10-BOOT-INTEGRITY (safe INIT contract validation; BLOCKED STATE on invalid CONTROL.INIT response; resolvedPanelState null-sentinel fail-closed [51.10])
 * PIOS-A.9-RUNTIME-CONFORMANCE (openPanel local authority removed; demo stage useEffect removed; runtime is projection-only, CONTROL-driven, transition non-authoritative [A.9])
 * PIOS-A.7-PROJECTION-PURIFICATION (UI is pure projection of CONTROL state; getPanelExpanded replaced by resolvedPanelState lookup; persona auto-open useEffect removed; TraversalEngine imports pruned [A.7])
 * PIOS-A.6-AUTHORITY-SWITCH (CONTROL is sole authority for all state transitions; index.js is adapter + projection only [A.6])
 * PIOS-51.9B-AUTHORITY-WIRING (getPanelExpanded: computePanelState governs GUIDED rendering; validatePanelTransition bypassed in ENTRY/FREE/OPERATOR; valid-by-construction comment on handleDemoNext [51.9B])
 * PIOS-51.9A-TRAVERSAL-HISTORY (reset+first-panel recording on session start for handleStartDemo and auto-start; traversalHistory is primary traversal record [51.9A])
 * PIOS-51.8R-RUN05-OPERATOR (FREE panel data restored: ENLPanel accessible in freeMode; operator-mode-badge; ENTRY vs FREE render separation — !demoActive && !freeMode gates ENTRY placeholder only)
 * PIOS-51.8R-RUN04-FREE (freeMode state: explicit operator mode entered only via Exit/CTRL-K; auto-start blocked in freeMode; entry strip hidden; operator surface with explicit re-entry)
 * PIOS-51.8R-RUN03-HARDENING (demoActive added to auto-start deps; mid-guided persona switch now deterministically restarts guided flow — demoActive dep change fires after persona-change teardown)
 * PIOS-51.8R-RUN01-CONTRACT-v7 (extended: Viewport enforcement on step change, deterministic auto-start across all runs, exit guard suppresses re-start, demoComplete in auto-start deps [51.8R amendment 10])
 * PIOS-51.8R-RUN01-CONTRACT-v6 (extended: Situation pinned during guided, auto-start on persona+query, persona switch full reset, uniform panel gate [51.8R amendment 9])
 * PIOS-51.8R-RUN01-CONTRACT-v5 (extended: Situation persistence, no duplicate persona gate, persona preserved across query change, evidence auto-open effect removed [51.8R amendment 8])
 * PIOS-51.8R-RUN01-CONTRACT-v4 (extended: 3-stage execution gate, panel lock pre-demo, evidence gated by demoActive, CTRL+K post-completion restore [51.8R amendment 7])
 * PIOS-51.8R-RUN01-CONTRACT-v3 (extended: persona-first gate, query-first visual position, post-completion lock, guided loop re-entry control [51.8R amendment 6])
 * PIOS-51.8R-RUN01-CONTRACT-v2 (extended: query-first gate, guided flow rebinding, deterministic reset, navigation relocation [51.8R amendment 5])
 * PIOS-51.8R-RUN01-CONTRACT-v1 (amended: terminal state, ⌘K exit, persona reset)
 * (supersedes PIOS-51.8-RUN01-CONTRACT-v1)
 * Lineage: PIOS-51.6-RUN01-CONTRACT-v1 → PIOS-51.6R-RUN01-CONTRACT-v1 → PIOS-51.6R.1-RUN01-CONTRACT-v1 → PIOS-51.6R.2-RUN01-CONTRACT-v1 → PIOS-51.6R.3-RUN01-CONTRACT-v1 → PIOS-51.6R.4-RUN01-CONTRACT-v1 → PIOS-51.7-RUN01-CONTRACT-v1 → PIOS-51.8-RUN01-CONTRACT-v1 → PIOS-51.8R-RUN01-CONTRACT-v1 → PIOS-51.8R-RUN01-CONTRACT-v2 → PIOS-51.8R-RUN01-CONTRACT-v3 → PIOS-51.8R-RUN01-CONTRACT-v4 → PIOS-51.8R-RUN01-CONTRACT-v5
 *
 * ExecLens Demo Surface — panel-orchestrated progressive disclosure.
 * Supersedes: PIOS-51.3 (step-driven navigation)
 *
 * Panel system:
 *   SituationPanel  — topology + gauges (entry: open)
 *   SignalPanel     — intelligence signals ("Why is this critical?")
 *   PersonaPanel    — persona selector + ENL ("What does this mean for you?")
 *   ENLPanel        — evidence + navigation ("Show evidence")
 *   NarrativePanel  — executive narrative ("So what?")
 *
 * Rules:
 *   R1  max 2 panels open simultaneously
 *   R2  no new API calls beyond what 42.29 established
 *   R3  same query drives all panels
 *   R4  demo choreography maps stage → panel open (deterministic)
 *   R5  non-demo mode: user can toggle any panel freely (max 2)
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Head from 'next/head'

import QuerySelector    from '../components/QuerySelector'
import SignalGaugeCard  from '../components/SignalGaugeCard'
import LandingGaugeStrip from '../components/LandingGaugeStrip'
import TopologyPanel    from '../components/TopologyPanel'
import DemoController   from '../components/DemoController'
import { getFlowNodes, PANEL_STATES } from '../components/TraversalEngine'
import { CONTROL, buildSnapshot, INTENTS, PERSONA_GUIDED_FLOWS } from '../components/Control'

// A.12: PERSONA_GUIDED_FLOWS local duplicate removed — imported from CONTROL canonical export. [A.12 G4]
import DisclosurePanel  from '../components/DisclosurePanel'
import PersonaPanel     from '../components/PersonaPanel'
import ENLPanel         from '../components/ENLPanel'
import NarrativePanel   from '../components/NarrativePanel'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// 51.12: STAGE_PANEL removed — was sole call site in demo stage useEffect removed in A.9.
// Path C (standard stage mode) is DORMANT-GOVERNED LEGACY [A.14]. No active call sites remain.

const CONF_COLORS = {
  STRONG:   'var(--strong)',
  MODERATE: 'var(--moderate)',
  WEAK:     'var(--weak)',
}

// ---------------------------------------------------------------------------
// ActiveQueryBar
// ---------------------------------------------------------------------------

function ActiveQueryBar({ data }) {
  const confColor = CONF_COLORS[data.aggregate_confidence] || 'var(--text-dim)'
  return (
    <div className="active-query-bar">
      <span className="aq-id">{data.query_id}</span>
      <span className="aq-sep">·</span>
      <span className="aq-intent">{data.intent_type}</span>
      <span className="aq-sep">·</span>
      <span className="aq-conf" style={{ color: confColor }}>
        {data.aggregate_confidence}
      </span>
      <span className="aq-sep">·</span>
      <span className="aq-signals">
        {data.signals ? data.signals.length : 0} signal{data.signals?.length !== 1 ? 's' : ''} bound
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------

export default function Home() {
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [queryData,     setQueryData]     = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState(null)

  // Panel open state — array, max 2 [R1]
  // Situation panel open by default — first visible content on entry [51.8R final polish]
  const [openPanels, setOpenPanels] = useState(['situation'])

  // ENL persona lift state [51.5]
  const [enlPersona,     setEnlPersona]     = useState(null)
  const [enlPersonaData, setEnlPersonaData] = useState(null)

  // Traversal engine state [51.6]
  const [selectedFlow,       setSelectedFlow]       = useState(null)
  const [traversalNodeIndex, setTraversalNodeIndex] = useState(0)

  // Demo choreography state
  const [demoActive,    setDemoActive]    = useState(false)
  const [demoStage,     setDemoStage]     = useState(0)
  // Terminal state: traversal complete, guided lock held, awaiting explicit exit [51.8R amendment]
  const [demoComplete,  setDemoComplete]  = useState(false)
  // Persona-guided flow step index [51.8R guided correction]
  const [guidedStepIndex, setGuidedStepIndex] = useState(0)
  // ANALYST raw step active — forces source evidence open [51.8R guided correction]
  const [rawStepActive,   setRawStepActive]   = useState(false)
  // Operator / FREE mode — true only after explicit Exit or CTRL-K; blocks auto-start [51.8R RUN04]
  const [freeMode,        setFreeMode]        = useState(false)

  // D.3 — traversal history [lens_runtime_state_mapping.md §5]
  // Ordered array of panel IDs visited in the current governed session.
  // Reset on demo start and demo exit; not populated during Operator mode.
  const [traversalHistory, setTraversalHistory] = useState([])

  // A.7: Resolved panel state — pre-computed by CONTROL, updated via applyControlResponse.
  // Replaces getPanelExpanded orchestration logic. Initialized from CONTROL INIT output. [A.7]
  // 51.10: Fail-closed INIT contract validation. Null-sentinel: if INIT returns invalid output,
  // resolvedPanelState is null → BLOCKED STATE render fires. [51.10]
  // 51.11: A.13 resolved the INIT deadlock — CONTROL(INTENTS.INIT, {}, null) now returns
  // { status: 'OK', newSnapshot: { resolvedPanelState: {...valid map...}, ... } }.
  // The validation below correctly accepts this output. BLOCKED STATE guard does not trigger.
  // 51.10 guard is retained as a permanent fail-closed safety net. [51.11]
  const [resolvedPanelState, setResolvedPanelState] = useState(() => {
    const r = CONTROL(INTENTS.INIT, {}, null)
    return (r && r.newSnapshot && r.newSnapshot.resolvedPanelState != null)
      ? r.newSnapshot.resolvedPanelState
      : null
  })

  // Exit guard — set by handleDemoExit; suppresses auto-start on demoComplete dep change [51.8R amendment 10]
  const exitedRef = useRef(false)
  // Auto-start previous deps — detects persona/query change vs demoComplete change [51.8R amendment 10]
  const autoStartPrevRef = useRef({ persona: null, query: null })

  // ── A.6: CONTROL adapter helpers ──

  // captureState — snapshot current React state for CONTROL input.
  // Reads from closure; correct at call time within event handlers and effects. [A.6]
  const captureState = () => ({
    openPanels, traversalHistory, enlPersona, selectedQuery,
    demoActive, demoStage, demoComplete, guidedStepIndex,
    rawStepActive, freeMode, selectedFlow, traversalNodeIndex,
  })

  // applyControlResponse — unpack CONTROL_RESPONSE.newSnapshot to React state setters.
  // Fail-closed: no-op if CONTROL returns FAIL. Atomic: React 18 batches all setters. [A.6]
  const applyControlResponse = (response) => {
    if (!response || response.status === 'FAIL') return
    const s = response.newSnapshot
    const o = s.orchestrationState
    setOpenPanels(s.openPanels)
    setTraversalHistory(s.traversalHistory)
    setEnlPersona(s.selectedPersona)
    setSelectedQuery(s.selectedQuery)
    setDemoActive(o.demoActive)
    setDemoStage(o.demoStage)
    setDemoComplete(o.demoComplete)
    setGuidedStepIndex(o.guidedStepIndex)
    setRawStepActive(o.rawStepActive)
    setFreeMode(o.freeMode)
    setTraversalNodeIndex(o.traversalNodeIndex)
    setSelectedFlow(o.selectedFlow)
    setResolvedPanelState(s.resolvedPanelState)  // A.7: projection-layer authority
  }

  // A.9: openPanel REMOVED — was local panel-state authority bypassing CONTROL.
  // All panel mutations now exclusively through CONTROL via applyControlResponse.
  // togglePanel was already removed in A.6. [A.9]

  // ── handleToggle — routes PANEL_TOGGLE through CONTROL [A.6] ──
  // CONTROL enforces: guided lock, post-completion lock, max-2 rule. [51.8, 51.8R amendment 7]
  // validatePanelTransition NOT applied: ENTRY/FREE/OPERATOR are sanctioned open-access paths. [51.9B]
  const handleToggle = useCallback((panelId) => {
    const snap = buildSnapshot(captureState())
    const response = CONTROL(INTENTS.PANEL_TOGGLE, { panelId }, snap)
    applyControlResponse(response)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPanels, traversalHistory, enlPersona, selectedQuery, demoActive, demoStage, demoComplete, guidedStepIndex, rawStepActive, freeMode, selectedFlow, traversalNodeIndex])

  // ── Panel expanded state — A.7: pure projection of CONTROL-derived resolvedPanelState ──
  // All orchestration logic (GUIDED branching, computePanelState, rawStep exception) is in CONTROL.
  // UI reads pre-computed result only. [A.7]
  const getPanelExpanded = useCallback((panelId) => {
    const state = resolvedPanelState?.[panelId]
    return state === PANEL_STATES.ACTIVE || state === PANEL_STATES.EXPANDED
  }, [resolvedPanelState])


  // A.7: Persona auto-open useEffect REMOVED.
  // Was a no-op for all current personas (PERSONA_GUIDED_FLOWS guard exited early for every case).
  // Panel state is governed entirely by CONTROL via resolvedPanelState. [A.7]

  // ── Query fetch [R2: same API calls as 42.29] ──
  // [51.8R amendment 8: persona→evidence auto-open effect removed]
  // Reason: auto-open caused Situation collapse via max-2 rule when PersonaPanel was open.
  // Evidence opens via guided flow step transitions only (explicit choreography).
  // Free explore: user toggles evidence manually after CTRL+K.

  useEffect(() => {
    // A.6: orchestration setters removed — CONTROL handles enlPersona and traversalNodeIndex
    // via QUERY_SELECT intent in handleQuerySelect. Only data state managed here.
    if (!selectedQuery) {
      setQueryData(null)
      setEnlPersonaData(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setQueryData(null)

    fetch(`/api/execlens?query=${encodeURIComponent(selectedQuery)}`)
      .then(r => {
        if (!r.ok) return r.json().then(d => { throw new Error(d.error || `HTTP ${r.status}`) })
        return r.json()
      })
      .then(data => {
        setQueryData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [selectedQuery])

  // A.9: Demo stage useEffect REMOVED — contained two illegal local authority sites:
  //   1. setSelectedQuery('GQ-003') — bypassed CONTROL QUERY_SELECT intent
  //   2. openPanel(panelId) — local panel-open authority bypassing CONTROL
  // CONTROL.DEMO_NEXT Path C sets openPanels in its response (canonical); panel-open is now CONTROL-owned.
  // setSelectedQuery for Path C is missing canonical wiring — exposed as truth-revealing controlled degradation. [A.9]

  // A.6: Persona change reset useEffect REMOVED.
  // CONTROL handles all persona-change resets atomically via PERSONA_SELECT intent.
  // handlePersonaSelect routes all persona changes through CONTROL. [A.6]

  // ── Viewport enforcement — scroll active guided panel into view on step change [51.8R amendment 10] ──
  // Fires after render on every guided step index change.
  // 51.14S: Fixed querySelector — DisclosurePanel renders data-panel-id, not id; getElementById was a no-op. [51.14S]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!demoActive || !enlPersona) return
    const steps = PERSONA_GUIDED_FLOWS[enlPersona]
    if (!steps) return
    const step = steps[guidedStepIndex]
    if (!step) return
    const panelEl = document.querySelector(`[data-panel-id="${step.panelId}"]`)
    if (panelEl) panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [demoActive, guidedStepIndex, enlPersona])

  // ── Auto-start guided demo — routes AUTO_START through CONTROL [A.6] ──
  // Runtime-specific guards (exitedRef, autoStartPrevRef) preserved as-is — not CONTROL's concern.
  // CONTROL guards (freeMode, demoActive, demoComplete, persona/query presence) remain in CONTROL.
  // [51.8R amendment 9/10/RUN03/RUN04]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const personaChanged = autoStartPrevRef.current.persona !== enlPersona
    const queryChanged   = autoStartPrevRef.current.query   !== selectedQuery
    autoStartPrevRef.current = { persona: enlPersona, query: selectedQuery }

    if (freeMode) return                       // operator mode guard [51.8R RUN04]
    if (!enlPersona || !selectedQuery) return  // both required
    if (demoActive) return                     // already running
    if (demoComplete) return                   // completion lock
    if (exitedRef.current && !personaChanged && !queryChanged) {
      exitedRef.current = false
      return
    }
    exitedRef.current = false

    // A.6: route AUTO_START through CONTROL
    const snap = buildSnapshot(captureState())
    const response = CONTROL(INTENTS.AUTO_START, {}, snap)
    applyControlResponse(response)
  }, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])

  // ── ⌘K handler — exit guided mode or post-completion state [51.8R amendment 7] ──
  // Fires when demoActive (mid-demo) OR demoComplete (post-completion lock).
  // handleDemoExit sets demoComplete=false → releases post-completion lock → free navigation.
  // Does NOT clear persona or query — context preserved for re-entry.

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        if (demoActive || demoComplete) { e.preventDefault(); handleDemoExit() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [demoActive, demoComplete])

  // ── Demo control handlers ──

  // ── handleStartDemo — routes DEMO_START through CONTROL [A.6] ──
  // CONTROL enforces persona/query gates and derives first step. [51.7, 51.8R]
  const handleStartDemo = () => {
    const snap = buildSnapshot(captureState())
    const response = CONTROL(INTENTS.DEMO_START, {}, snap)
    if (response.status === 'FAIL') return  // fail-closed: persona or query missing
    exitedRef.current = false               // clear exit flag on explicit guided start [51.8R RUN04]
    applyControlResponse(response)
  }

  // ── handleDemoNext — routes DEMO_NEXT through CONTROL [A.6] ──
  // CONTROL handles all three paths: PERSONA_GUIDED_FLOWS, legacy selectedFlow, standard stage mode.
  // validatePanelTransition NOT applied: sequences are valid-by-construction [51.9B]
  const handleDemoNext = () => {
    const snap = buildSnapshot(captureState())
    const response = CONTROL(INTENTS.DEMO_NEXT, {}, snap)
    applyControlResponse(response)
  }

  // ── handleDemoExit — routes DEMO_EXIT through CONTROL [A.6] ──
  // exitedRef set before CONTROL call: defense-in-depth guard preserved [51.8R amendment 10]
  const handleDemoExit = () => {
    exitedRef.current = true    // defense-in-depth: suppress auto-start on demoActive dep change [51.8R amendment 10]
    const snap = buildSnapshot(captureState())
    const response = CONTROL(INTENTS.DEMO_EXIT, {}, snap)
    applyControlResponse(response)
  }

  // ── handleQuerySelect — routes QUERY_SELECT through CONTROL [A.6] ──
  // Replaces direct setSelectedQuery; query fetch useEffect fires after selectedQuery state update.
  const handleQuerySelect = useCallback((query) => {
    const snap = buildSnapshot(captureState())
    const response = CONTROL(INTENTS.QUERY_SELECT, { query }, snap)
    applyControlResponse(response)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPanels, traversalHistory, enlPersona, selectedQuery, demoActive, demoStage, demoComplete, guidedStepIndex, rawStepActive, freeMode, selectedFlow, traversalNodeIndex])

  // ── handlePersonaSelect — routes PERSONA_SELECT through CONTROL [A.6] ──
  // Replaces direct setEnlPersona; CONTROL handles all resets (guidedStepIndex, demoComplete, demoActive mid-demo).
  const handlePersonaSelect = useCallback((persona) => {
    const snap = buildSnapshot(captureState())
    const response = CONTROL(INTENTS.PERSONA_SELECT, { persona }, snap)
    applyControlResponse(response)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPanels, traversalHistory, enlPersona, selectedQuery, demoActive, demoStage, demoComplete, guidedStepIndex, rawStepActive, freeMode, selectedFlow, traversalNodeIndex])

  // ── 51.14S: activePanelId — elevated to useMemo so useEffect can depend on it safely. [51.14S] ──
  // Pure derivation from existing CONTROL-derived state. No state mutation. No authority.
  // null when resolvedPanelState is unavailable (BLOCKED STATE guard fires independently).
  const activePanelId = useMemo(() => {
    if (!resolvedPanelState) return null
    // 51.14T: demoComplete not used as a gate — ENTRY logic applies at POST_COMPLETION too. [51.14T]
    if (!demoActive && !freeMode) {
      // ENTRY / POST_COMPLETION: step 2 focus — persona panel when query selected but perspective not yet chosen
      if (selectedQuery && !enlPersona) return 'persona'
      return null
    }
    if (demoActive) {
      // Active demo — highlight panel CONTROL set to EXPANDED
      return Object.keys(resolvedPanelState).find(
        id => resolvedPanelState[id] === PANEL_STATES.EXPANDED
      ) || null
    }
    return null
  }, [resolvedPanelState, demoActive, freeMode, selectedQuery, enlPersona])

  // ── 51.14S: Scroll viewport to canonically active panel when focus changes. [51.14S] ──
  // Presentation-only. Fires only when activePanelId changes value (React dep comparison).
  // Covers: guided-flow advances, persona-switch in demo, ENTRY attention after query selection.
  // 80ms delay: allows panel open transition to begin before scroll fires.
  useEffect(() => {
    if (!activePanelId) return
    const el = document.querySelector(`[data-panel-id="${activePanelId}"]`)
    if (!el) return
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 80)
    return () => clearTimeout(t)
  }, [activePanelId])

  // ── 51.10: BLOCKED STATE — fail-closed render when CONTROL.INIT is invalid ──
  // resolvedPanelState === null means INIT contract validation failed at mount.
  // No panel state available — render blocked. No synthetic fallback. No authority inference. [51.10]
  if (resolvedPanelState === null) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'var(--text-dim, #888)' }}>
        Initialization unavailable — canonical state missing
      </div>
    )
  }

  // ── Render ──

  // 51.13: Progressive reveal — derived from CONTROL orchestration state only. [51.13]
  // 51.14T: demoComplete removed — POST_COMPLETION must render clean ENTRY surface, not extend panels. [51.14T]
  const showExtendedPanels = demoActive || freeMode

  // activePanelId is now a useMemo above (51.14S) — used directly in render below.

  return (
    <>
      <Head>
        <title>Lens — Program Intelligence</title>
        <meta name="description" content="Evidence-first program intelligence surface — PIOS run_02_governed" />
      </Head>

      <div className={`page-root${demoActive ? ' demo-active' : ''}`}>

        {/* ── Hero ── */}
        <header className="hero">
          <div className="hero-eyebrow">PROGRAM INTELLIGENCE — EXECUTION SURFACE</div>
          <h1 className="hero-title">Lens</h1>
          <div className="hero-positioning">Lens — a Signäl capability (Krayu · Program Intelligence)</div>
          <p className="hero-subtitle">
            Evidence-first system for program diagnosis, structural risk, and execution visibility
          </p>
          <div className="hero-meta">
            PIOS-51.8R-RUN05-OPERATOR · run_02_governed
            &ensp;·&ensp;
            No inference. No synthetic data.
          </div>

          {!demoActive && !freeMode && (
            <div className="guided-entry-steps">
              {/* Post-completion context — pure projection of demoComplete state [51.12] */}
              {demoComplete && (
                <div className="demo-complete-message">
                  Guided execution complete · Select a new persona to run again
                </div>
              )}
              {/* Horizontal step strip — Step 1 (query/activation) → Step 2 (perspective/modifier) → Start [51.14R] */}
              {/* 51.14R: query is Step 1 and the activation trigger; persona is Step 2 context modifier [51.14R] */}
              <div className="guided-entry-strip">
                <div className={`guided-step${selectedQuery ? ' guided-step-done' : ' guided-step-active'}`}>
                  <span className="guided-step-num">1</span>
                  <span className="guided-step-label">Select a query</span>
                  {selectedQuery && <span className="guided-step-persona">{selectedQuery}</span>}
                </div>
                <span className="guided-step-arrow">→</span>
                <div className={`guided-step${enlPersona ? ' guided-step-done' : (selectedQuery ? ' guided-step-active' : '')}`}>
                  <span className="guided-step-num">2</span>
                  <span className="guided-step-label">Select a perspective</span>
                  {enlPersona && <span className="guided-step-persona">{enlPersona}</span>}
                </div>
                <span className="guided-step-arrow">→</span>
                <button
                  className="demo-start-btn"
                  onClick={handleStartDemo}
                  type="button"
                  disabled={!enlPersona || !selectedQuery}
                >
                  {'Start Lens Demo'}
                </button>
              </div>
              {selectedQuery && !enlPersona && (
                <div className="persona-gate-message">Select a perspective to enable guided execution</div>
              )}
            </div>
          )}

          {/* ── Operator surface — FREE mode re-entry [51.8R RUN04] ── */}
          {/* Visible only in explicit FREE mode (after Exit / CTRL-K). No guided shell. */}
          {freeMode && !demoActive && (
            <div className="operator-surface">
              <div className="operator-mode-badge">OPERATOR MODE</div>
              {/* 51.15: description text — presentation only; makes operator mode feel deliberate [51.15] */}
              <div className="operator-mode-desc">Free exploration · no guided sequence · full surface accessible</div>
              <button
                className="demo-start-btn"
                onClick={handleStartDemo}
                type="button"
                disabled={!enlPersona || !selectedQuery}
              >
                Run Lens Demo
              </button>
            </div>
          )}
        </header>

        {/* ── Query selector — first position; query is the activation trigger [51.14R] ── */}
        {/* 51.14R: always enabled — query is Step 1 and the activation point; persona is Step 2 modifier [51.14R] */}
        <div className="query-zone">
          <QuerySelector selectedQuery={selectedQuery} onSelect={handleQuerySelect} disabled={false} />

          {queryData && !loading && <ActiveQueryBar data={queryData} />}

          {!selectedQuery && (
            <div className="no-query-state">
              Select a query to activate guided execution.
            </div>
          )}

          {selectedQuery && !enlPersona && (
            <div className="no-query-state">
              Select a perspective to complete setup.
            </div>
          )}

          {selectedQuery && loading && (
            <div className="loading-state">
              Executing {selectedQuery} · traversal in progress…
            </div>
          )}

          {error && (
            <div className="error-state">
              Execution failure for {selectedQuery}: {error}
            </div>
          )}
        </div>

        {/* ── Panel: Situation — structural baseline [51.8R final polish] ── */}
        {/* Second position — below query zone */}
        <DisclosurePanel
          id="situation"
          title="Situation"
          subtitle="Structural baseline — architecture and projection emphasis"
          expanded={getPanelExpanded('situation')}
          onToggle={() => handleToggle('situation')}
          active={activePanelId === 'situation'}
        >
          <div data-demo-section="gauges">
            <LandingGaugeStrip />
          </div>
          <div data-demo-section="topology">
            <TopologyPanel selectedQuery={selectedQuery} navigation={queryData?.navigation} />
          </div>
        </DisclosurePanel>

        {/* ── Panel: Persona — persona selector + ENL lens ── */}
        {/* Third position — persona always interactive [51.8R amendment 6] */}
        <DisclosurePanel
          id="persona"
          title="What does this mean for you?"
          subtitle="Determines depth and perspective of interpretation"
          expanded={getPanelExpanded('persona')}
          onToggle={() => handleToggle('persona')}
          active={activePanelId === 'persona'}
        >
          <PersonaPanel queryId={selectedQuery} onPersonaChange={handlePersonaSelect} onPersonaDataChange={setEnlPersonaData} activePersona={enlPersona} />
        </DisclosurePanel>

        {/* ── Panel: Signals — intelligence signals ── */}
        {/* 51.14R: visible only after canonical activation (demoActive, freeMode, demoComplete) — not at ENTRY [51.14R] */}
        {showExtendedPanels && (
        <DisclosurePanel
          id="signals"
          title="Why is this critical?"
          subtitle={queryData ? `${queryData.signals?.length || 0} intelligence signals bound` : 'Select a query to load signals'}
          badge={queryData?.signals?.length ? String(queryData.signals.length) : null}
          expanded={getPanelExpanded('signals')}
          onToggle={() => handleToggle('signals')}
          active={activePanelId === 'signals'}
        >
          {queryData && queryData.signals && queryData.signals.length > 0 ? (
            <div className="signal-grid" data-demo-section="signals">
              {queryData.signals.map(sig => (
                <SignalGaugeCard key={sig.signal_id} signal={sig} />
              ))}
            </div>
          ) : (
            <div className="no-query-state">
              {selectedQuery && loading ? 'Loading signals…' : 'Select a query to load signals.'}
            </div>
          )}
        </DisclosurePanel>
        )}

        {/* ── Panel: Evidence — evidence chain + traceability ── */}
        {/* 51.13: visible only when demo is active or complete — not rendered at ENTRY [51.13] */}
        {showExtendedPanels && (
        <DisclosurePanel
          id="evidence"
          title="Show evidence"
          subtitle="Evidence chain and vault traceability"
          expanded={getPanelExpanded('evidence')}
          onToggle={() => handleToggle('evidence')}
          active={activePanelId === 'evidence'}
        >
          {queryData && enlPersona && (demoActive || freeMode) ? (
            // demoActive: guided mode — step-driven evidence; freeMode: operator mode — full evidence access [51.8R RUN05]
            <ENLPanel
              signals={queryData.signals}
              persona={enlPersona}
              personaData={enlPersonaData}
              rawStepActive={rawStepActive}
            />
          ) : queryData && enlPersona && !demoActive && !freeMode ? (
            // ENTRY only — pre-guided shell; not FREE [51.8R RUN05]
            <div className="evidence-blocked-state">Start Lens Demo to view evidence analysis</div>
          ) : queryData && !enlPersona ? (
            <div className="evidence-blocked-state">Evidence requires a selected Persona</div>
          ) : (
            <div className="no-query-state">Select a query to load evidence.</div>
          )}
        </DisclosurePanel>
        )}

        {/* ── Panel: Narrative — executive summary ── */}
        {/* 51.14R: visible only after canonical activation (demoActive, freeMode, demoComplete) — not at ENTRY [51.14R] */}
        {showExtendedPanels && (
        <DisclosurePanel
          id="narrative"
          title="So what?"
          subtitle="Executive narrative — evidence-grounded"
          expanded={getPanelExpanded('narrative')}
          onToggle={() => handleToggle('narrative')}
          active={activePanelId === 'narrative'}
        >
          {queryData && enlPersona ? (
            <NarrativePanel queryData={queryData} />
          ) : queryData && !enlPersona ? (
            <div className="no-query-state">Select a Persona to enable execution</div>
          ) : (
            <div className="no-query-state">Select a query to load narrative.</div>
          )}
        </DisclosurePanel>
        )}

      </div>

      {/* ── Demo bar — rendered outside page-root for fixed positioning ── */}
      {/* active: false during terminal state — DemoController hidden when complete [51.8R amendment] */}
      <DemoController
        active={demoActive && !demoComplete}
        stage={demoStage}
        onNext={handleDemoNext}
        onExit={handleDemoExit}
        selectedFlow={selectedFlow}
        traversalNodeIndex={traversalNodeIndex}
        traversalNodes={selectedFlow ? getFlowNodes(selectedFlow) : null}
        guidedSteps={enlPersona ? PERSONA_GUIDED_FLOWS[enlPersona] : null}
        guidedStepIndex={guidedStepIndex}
        guidedPersona={enlPersona}
      />

    </>
  )
}

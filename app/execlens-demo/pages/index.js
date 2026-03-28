/**
 * pages/index.js
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

import { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'

import QuerySelector    from '../components/QuerySelector'
import SignalGaugeCard  from '../components/SignalGaugeCard'
import LandingGaugeStrip from '../components/LandingGaugeStrip'
import TopologyPanel    from '../components/TopologyPanel'
import DemoController   from '../components/DemoController'
import { TRAVERSAL_FLOWS, PERSONA_AUTO_OPEN, getFlowPanels, getFlowNodes,
         PANEL_STATES, D2_PANEL_MAP, PERSONA_DEPTH_ENVELOPE,       // D3.1–D3.4
         computePanelState, validatePanelTransition                  // D3.5–D3.6
       } from '../components/TraversalEngine'
import { CONTROL, buildSnapshot, INTENTS } from '../components/Control'

// ---------------------------------------------------------------------------
// PERSONA_GUIDED_FLOWS — kept for display/scroll/auto-open guard usage only [A.6]
// Orchestration authority transferred to CONTROL. Not used for state transitions.
// ---------------------------------------------------------------------------

const PERSONA_GUIDED_FLOWS = {
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
import DisclosurePanel  from '../components/DisclosurePanel'
import PersonaPanel     from '../components/PersonaPanel'
import ENLPanel         from '../components/ENLPanel'
import NarrativePanel   from '../components/NarrativePanel'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Stage → panel to open [uncovered Path C — standard stage mode side effect only, not touched by A.6]
const STAGE_PANEL = {
  1: 'situation',
  2: 'signals',
  3: 'persona',
  4: 'evidence',
  5: 'narrative',
}

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
  }

  // ── Panel helpers ──

  // openPanel kept for demo stage useEffect (uncovered Path C) [A.6]
  const openPanel = useCallback((panelId) => {
    setOpenPanels(prev => {
      if (prev.includes(panelId)) return prev
      const next = [...prev, panelId]
      // max 2: drop oldest if over limit [R1]
      return next.length > 2 ? next.slice(next.length - 2) : next
    })
  }, [])

  // togglePanel REMOVED: all toggle transitions route through CONTROL [A.6]

  // ── handleToggle — routes PANEL_TOGGLE through CONTROL [A.6] ──
  // CONTROL enforces: guided lock, post-completion lock, max-2 rule. [51.8, 51.8R amendment 7]
  // validatePanelTransition NOT applied: ENTRY/FREE/OPERATOR are sanctioned open-access paths. [51.9B]
  const handleToggle = useCallback((panelId) => {
    const snap = buildSnapshot(captureState())
    const response = CONTROL(INTENTS.PANEL_TOGGLE, { panelId }, snap)
    applyControlResponse(response)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPanels, traversalHistory, enlPersona, selectedQuery, demoActive, demoStage, demoComplete, guidedStepIndex, rawStepActive, freeMode, selectedFlow, traversalNodeIndex])

  // ── Panel expanded state — D.3 authority wiring [51.9B] ──
  // GUIDED mode: computePanelState is rendering authority per D.3 / lens_runtime_state_mapping.md §4
  // ENTRY / FREE / POST-COMPLETION: openPanels-driven (51.8R sanctioned)
  // Non-traversal companion panels (situation, persona): always openPanels — never in traversalHistory
  // rawStep exception: ANALYST step 4 reopens 'evidence' without new traversalHistory entry [51.8R amendment]
  const getPanelExpanded = useCallback((panelId) => {
    // Non-traversal companion panels: bypass computePanelState [situation pinned, persona always interactive]
    if (panelId === 'situation' || panelId === 'persona') return openPanels.includes(panelId)
    // GUIDED mode: computePanelState governs [D.3]
    if (demoActive) {
      // rawStep exception: evidence re-opened without new traversalHistory entry [51.8R ANALYST step 4]
      if (rawStepActive && panelId === 'evidence') return openPanels.includes('evidence')
      const state = computePanelState(panelId, openPanels, traversalHistory, enlPersona, demoActive, freeMode)
      return state === PANEL_STATES.ACTIVE || state === PANEL_STATES.EXPANDED
    }
    // ENTRY / FREE / POST-COMPLETION: openPanels-driven [51.8R sanctioned]
    return openPanels.includes(panelId)
  }, [openPanels, traversalHistory, enlPersona, demoActive, freeMode, rawStepActive])


  // ── Persona auto-open — reveal depth only [51.6, R3] ──
  // Zero content variation. Only panel open depth differs.
  // Guard: only fires during active demo [51.6R.2 — persona click must not open panels implicitly]

  useEffect(() => {
    if (!enlPersona || !demoActive) return
    if (PERSONA_GUIDED_FLOWS[enlPersona]) return  // guided mode owns panel management — auto-open would drop situation via max-2 [51.8R Post-RUN01 hardening]
    const autoPanels = PERSONA_AUTO_OPEN[enlPersona]
    if (!autoPanels || autoPanels.length === 0) return
    setOpenPanels(prev => {
      // Open persona's default panels, respect max-2 rule
      const merged = [...new Set([...prev, ...autoPanels])]
      return merged.length > 2 ? merged.slice(merged.length - 2) : merged
    })
  }, [enlPersona, demoActive])

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

  // ── Demo stage → panel mapping [R4] — standard mode only ──

  useEffect(() => {
    if (!demoActive || !demoStage) return
    if (selectedFlow) return  // traversal mode handles its own panel opening [51.6]

    // Stage 1: auto-select GQ-003 so data loads during Situation reveal
    if (demoStage === 1) {
      setSelectedQuery('GQ-003')
    }

    const panelId = STAGE_PANEL[demoStage]
    if (panelId) {
      openPanel(panelId)
    }
  }, [demoActive, demoStage, openPanel, selectedFlow])

  // A.6: Persona change reset useEffect REMOVED.
  // CONTROL handles all persona-change resets atomically via PERSONA_SELECT intent.
  // handlePersonaSelect routes all persona changes through CONTROL. [A.6]

  // ── Viewport enforcement — scroll active guided panel into view on step change [51.8R amendment 10] ──
  // Fires after render on every guided step index change.
  // Scrolls panel element by id (panel id matches DisclosurePanel id prop).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!demoActive || !enlPersona) return
    const steps = PERSONA_GUIDED_FLOWS[enlPersona]
    if (!steps) return
    const step = steps[guidedStepIndex]
    if (!step) return
    const panelEl = document.getElementById(step.panelId)
    if (panelEl) panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  // ── Render ──

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
              {/* Horizontal step strip — Step 1 → Step 2 → Start [51.8R] */}
              <div className="guided-entry-strip">
                <div className={`guided-step${enlPersona ? ' guided-step-done' : ' guided-step-active'}`}>
                  <span className="guided-step-num">1</span>
                  <span className="guided-step-label">Select your lens persona</span>
                  {enlPersona && <span className="guided-step-persona">{enlPersona}</span>}
                </div>
                <span className="guided-step-arrow">→</span>
                <div className={`guided-step${enlPersona ? ' guided-step-active' : ''}`}>
                  <span className="guided-step-num">2</span>
                  <span className="guided-step-label">Begin guided execution</span>
                </div>
                <button
                  className="demo-start-btn"
                  onClick={handleStartDemo}
                  type="button"
                  disabled={!enlPersona || !selectedQuery}
                >
                  {'Start Lens Demo'}
                </button>
              </div>
              {!enlPersona && (
                <div className="persona-gate-message">Select a Persona to enable execution</div>
              )}
            </div>
          )}

          {/* ── Operator surface — FREE mode re-entry [51.8R RUN04] ── */}
          {/* Visible only in explicit FREE mode (after Exit / CTRL-K). No guided shell. */}
          {freeMode && !demoActive && (
            <div className="operator-surface">
              <div className="operator-mode-badge">OPERATOR MODE</div>
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

        {/* ── Query selector — first position [51.8R amendment 6: persona-first gate, query-first visual] ── */}
        {/* Non-interactive until persona selected — disabled={!enlPersona} */}
        <div className="query-zone">
          <QuerySelector selectedQuery={selectedQuery} onSelect={handleQuerySelect} disabled={!enlPersona} />

          {!enlPersona && (
            <div className="no-query-state">
              Select a persona first to enable query selection.
            </div>
          )}

          {queryData && !loading && <ActiveQueryBar data={queryData} />}

          {enlPersona && !selectedQuery && (
            <div className="no-query-state">
              Select a query to project signals onto this structure.
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
          subtitle="Interpret this situation from a decision perspective"
          expanded={getPanelExpanded('persona')}
          onToggle={() => handleToggle('persona')}
        >
          <PersonaPanel queryId={selectedQuery} onPersonaChange={handlePersonaSelect} onPersonaDataChange={setEnlPersonaData} activePersona={enlPersona} />
        </DisclosurePanel>

        {/* ── Panel: Signals — intelligence signals ── */}
        <DisclosurePanel
          id="signals"
          title="Why is this critical?"
          subtitle={queryData ? `${queryData.signals?.length || 0} intelligence signals bound` : 'Select a query to load signals'}
          badge={queryData?.signals?.length ? String(queryData.signals.length) : null}
          expanded={getPanelExpanded('signals')}
          onToggle={() => handleToggle('signals')}
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

        {/* ── Panel: Evidence — evidence chain + traceability ── */}
        <DisclosurePanel
          id="evidence"
          title="Show evidence"
          subtitle="Evidence chain and vault traceability"
          expanded={getPanelExpanded('evidence')}
          onToggle={() => handleToggle('evidence')}
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

        {/* ── Panel: Narrative — executive summary ── */}
        <DisclosurePanel
          id="narrative"
          title="So what?"
          subtitle="Executive narrative — evidence-grounded"
          expanded={getPanelExpanded('narrative')}
          onToggle={() => handleToggle('narrative')}
        >
          {queryData && enlPersona ? (
            <NarrativePanel queryData={queryData} />
          ) : queryData && !enlPersona ? (
            <div className="no-query-state">Select a Persona to enable execution</div>
          ) : (
            <div className="no-query-state">Select a query to load narrative.</div>
          )}
        </DisclosurePanel>

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

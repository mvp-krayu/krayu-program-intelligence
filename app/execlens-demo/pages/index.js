/**
 * pages/index.js
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
import { TRAVERSAL_FLOWS, PERSONA_AUTO_OPEN, getFlowPanels, getFlowNodes } from '../components/TraversalEngine'

// ---------------------------------------------------------------------------
// PERSONA_DEFAULT_FLOW — static mapping, no computation [51.6R]
// Persona → default DemoFlow binding
// ---------------------------------------------------------------------------

const PERSONA_DEFAULT_FLOW = {
  EXECUTIVE: 'executive_insight',
  CTO:       'structural_analysis',
  ANALYST:   'evidence_audit',
}

// ---------------------------------------------------------------------------
// PERSONA_GUIDED_FLOWS — persona-specific guided step sequences [51.8R guided correction]
// Static. No computation. Reuse existing panel IDs only.
// ANALYST raw step: special guided state of evidence panel — forces source evidence open.
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

const TOTAL_STAGES = 5

// Stage → panel to open
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

  // Persona change detection — ref-based to avoid [enlPersona]-only dep [51.8R amendment]
  const prevEnlPersonaRef = useRef(null)
  // Exit guard — set by handleDemoExit; suppresses auto-start on demoComplete dep change [51.8R amendment 10]
  const exitedRef = useRef(false)
  // Auto-start previous deps — detects persona/query change vs demoComplete change [51.8R amendment 10]
  const autoStartPrevRef = useRef({ persona: null, query: null })

  // ── Panel helpers ──

  const openPanel = useCallback((panelId) => {
    setOpenPanels(prev => {
      if (prev.includes(panelId)) return prev
      const next = [...prev, panelId]
      // max 2: drop oldest if over limit [R1]
      return next.length > 2 ? next.slice(next.length - 2) : next
    })
  }, [])

  const togglePanel = useCallback((panelId) => {
    setOpenPanels(prev => {
      if (prev.includes(panelId)) {
        return prev.filter(id => id !== panelId)
      }
      const next = [...prev, panelId]
      return next.length > 2 ? next.slice(next.length - 2) : next
    })
  }, [])

  // ── Guided toggle — locked during active guided demo [51.8] ──
  // Free explore: toggles normally. Guided mode: panels opened by choreography only.
  // Post-completion lock: only persona panel interactive after guided completion [51.8R amendment 7]
  // CTRL+K releases post-completion by setting demoComplete=false → all panels free again
  const handleToggle = useCallback((panelId) => {
    if (demoActive) return  // guided demo: step-driven only [51.8]
    if (demoComplete && panelId !== 'persona') return  // post-completion lock [51.8R amendment 7]
    togglePanel(panelId)
  }, [demoActive, demoComplete, togglePanel])


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
    if (!selectedQuery) {
      setQueryData(null)
    setEnlPersona(null)
    setEnlPersonaData(null)
    setTraversalNodeIndex(0)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setQueryData(null)
    // [51.8R amendment 8] Preserve enlPersona across query change — no reset here.
    // PersonaPanel re-fetches persona data automatically on queryId change via [selectedPersona, queryId] effect.
    // enlPersona cleared only on: query cleared (null branch above), guided completion terminal, or CTRL+K.
    setTraversalNodeIndex(0)

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

  // ── Persona change reset — resets demo if persona switches mid-demo [51.8R amendment] ──
  // Uses prevEnlPersonaRef to detect change without [enlPersona]-only dep [51.6R.2 guard preserved]
  // Always rebinds guided flow steps on persona switch [51.8R amendment 5]

  useEffect(() => {
    if (prevEnlPersonaRef.current === enlPersona) return  // no change (includes null→null on mount)
    prevEnlPersonaRef.current = enlPersona
    // Reset guided step on any persona change [51.8R amendment 5]
    setGuidedStepIndex(0)
    // Reset completion lock on persona selection only (non-null); terminal clear preserves lock [51.8R amendment 6]
    if (enlPersona !== null) {
      setDemoComplete(false)
    }
    if (demoActive) {
      setDemoActive(false)
      setDemoStage(0)
      setTraversalNodeIndex(0)
      setSelectedFlow(null)
      setRawStepActive(false)  // clear raw step on persona change [51.8R guided correction]
    }
  }, [enlPersona, demoActive, demoComplete])

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

  // ── Auto-start guided demo on Persona + Query selection [51.8R amendment 9/10] ──
  // Deps: [enlPersona, selectedQuery, demoComplete]
  //   - First run: persona or query changes with both present → start
  //   - After completion: persona-change effect sets demoComplete=false → dep change → start
  //   - After CTRL+K: exitedRef.current=true; demoComplete dep fires but exitedRef suppresses unless persona/query changed
  // autoStartPrevRef tracks previous persona/query values to distinguish dep change source.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const personaChanged = autoStartPrevRef.current.persona !== enlPersona
    const queryChanged   = autoStartPrevRef.current.query   !== selectedQuery
    autoStartPrevRef.current = { persona: enlPersona, query: selectedQuery }

    if (!enlPersona || !selectedQuery) return  // both required
    if (demoActive) return                     // already running (intentional stale read)
    if (demoComplete) return                   // completion lock not yet cleared (stale; persona-change effect will clear)
    if (exitedRef.current && !personaChanged && !queryChanged) {
      // demoComplete changed (CTRL+K cleared it) but persona/query unchanged → suppress auto-start [51.8R amendment 10]
      exitedRef.current = false  // consume exit flag
      return
    }
    exitedRef.current = false  // clear exit flag on genuine persona/query selection
    const steps = PERSONA_GUIDED_FLOWS[enlPersona]
    const activeFlow = PERSONA_DEFAULT_FLOW[enlPersona]
    setDemoComplete(false)
    setGuidedStepIndex(0)
    setRawStepActive(false)
    setTraversalNodeIndex(0)
    setSelectedFlow(activeFlow)
    const firstPanel = steps && steps.length > 0 ? steps[0].panelId : 'situation'
    setOpenPanels(firstPanel === 'situation' ? ['situation'] : ['situation', firstPanel])
    setDemoActive(true)
    setDemoStage(1)
  }, [enlPersona, selectedQuery, demoComplete])  // demoComplete added: fires after persona-change effect clears lock [51.8R amendment 10]

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

  const handleStartDemo = () => {
    // Persona hard gate — execution blocked without explicit selection [51.7]
    if (!enlPersona) return
    // Query hard gate — query required for guided execution [51.8R guided correction]
    if (!selectedQuery) return
    setDemoComplete(false)   // reset terminal state on re-run [51.8R amendment]
    setGuidedStepIndex(0)    // reset guided step [51.8R guided correction]
    setRawStepActive(false)  // reset raw step [51.8R guided correction]
    // Derive active flow — backward compat [51.6R.2]
    const activeFlow = selectedFlow || (enlPersona ? PERSONA_DEFAULT_FLOW[enlPersona] : null)
    setTraversalNodeIndex(0)
    if (activeFlow) {
      // Keep traversal flow state for compat; persona-guided flow controls panel opening
      setSelectedFlow(activeFlow)
      const panels = getFlowPanels(activeFlow)
      // Open first step of persona-guided flow; situation pinned alongside [51.8R amendment 9]
      const steps = PERSONA_GUIDED_FLOWS[enlPersona]
      const firstPanel = steps && steps.length > 0 ? steps[0].panelId : panels.length > 0 ? panels[0] : 'situation'
      setOpenPanels(firstPanel === 'situation' ? ['situation'] : ['situation', firstPanel])  // situation pinned [51.8R amendment 9]
    } else {
      // Standard 51.4 stage mode fallback
      const steps = PERSONA_GUIDED_FLOWS[enlPersona]
      const firstPanel = steps && steps.length > 0 ? steps[0].panelId : 'situation'
      setOpenPanels(firstPanel === 'situation' ? ['situation'] : ['situation', firstPanel])  // situation pinned [51.8R amendment 9]
    }
    setDemoActive(true)
    setDemoStage(1)
  }

  const handleDemoNext = () => {
    // Persona-guided flow [51.8R guided correction]: primary path
    const steps = PERSONA_GUIDED_FLOWS[enlPersona]
    if (steps) {
      const nextIndex = guidedStepIndex + 1
      if (nextIndex >= steps.length) {
        // Amendment 6: post-completion lock state [51.8R amendment 6]
        // setDemoComplete(true) reverts Amendment 5 false — lock panels until persona re-selected
        setDemoComplete(true)
        setDemoActive(false)
        setGuidedStepIndex(0)
        setRawStepActive(false)
        setEnlPersona(null)
        setOpenPanels(['situation'])
      } else {
        const step = steps[nextIndex]
        setGuidedStepIndex(nextIndex)
        const stepPanel = step.panelId
        setOpenPanels(stepPanel === 'situation' ? ['situation'] : ['situation', stepPanel])  // situation pinned [51.8R amendment 9]
        if (step.rawStep) {
          // ANALYST raw step: force source evidence open [51.8R guided correction]
          setRawStepActive(true)
        }
      }
      return
    }
    // Legacy traversal mode [51.6] — backward compat path
    if (selectedFlow) {
      const panels = getFlowPanels(selectedFlow)
      const nextIndex = traversalNodeIndex + 1
      if (nextIndex >= panels.length) {
        setDemoComplete(true)
        setDemoActive(false)
        setGuidedStepIndex(0)
        setRawStepActive(false)
        setEnlPersona(null)
      } else {
        setTraversalNodeIndex(nextIndex)
        setOpenPanels([panels[nextIndex]])
      }
    } else {
      // Standard 51.4 stage mode
      if (demoStage >= TOTAL_STAGES) {
        setDemoComplete(true)
        setDemoActive(false)
        setGuidedStepIndex(0)
        setRawStepActive(false)
        setEnlPersona(null)
      } else {
        setDemoStage(prev => prev + 1)
      }
    }
  }

  const handleDemoExit = () => {
    exitedRef.current = true    // suppress auto-start on demoComplete dep change [51.8R amendment 10]
    setDemoActive(false)
    setDemoStage(0)
    setTraversalNodeIndex(0)
    setSelectedFlow(null)       // mandatory exit reset [51.6R.2]
    setDemoComplete(false)      // clear terminal state [51.8R amendment]
    setGuidedStepIndex(0)       // clear guided step [51.8R guided correction]
    setRawStepActive(false)     // clear raw step [51.8R guided correction]
  }

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
            PIOS-51.8R-RUN01-CONTRACT-v7 · run_02_governed
            &ensp;·&ensp;
            No inference. No synthetic data.
          </div>

          {!demoActive && (
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
        </header>

        {/* ── Query selector — first position [51.8R amendment 6: persona-first gate, query-first visual] ── */}
        {/* Non-interactive until persona selected — disabled={!enlPersona} */}
        <div className="query-zone">
          <QuerySelector selectedQuery={selectedQuery} onSelect={setSelectedQuery} disabled={!enlPersona} />

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
          expanded={openPanels.includes('situation')}
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
          expanded={openPanels.includes('persona')}
          onToggle={() => handleToggle('persona')}
        >
          <PersonaPanel queryId={selectedQuery} onPersonaChange={setEnlPersona} onPersonaDataChange={setEnlPersonaData} activePersona={enlPersona} />
        </DisclosurePanel>

        {/* ── Panel: Signals — intelligence signals ── */}
        <DisclosurePanel
          id="signals"
          title="Why is this critical?"
          subtitle={queryData ? `${queryData.signals?.length || 0} intelligence signals bound` : 'Select a query to load signals'}
          badge={queryData?.signals?.length ? String(queryData.signals.length) : null}
          expanded={openPanels.includes('signals')}
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
          expanded={openPanels.includes('evidence')}
          onToggle={() => handleToggle('evidence')}
        >
          {queryData && enlPersona && demoActive ? (
            <ENLPanel
              signals={queryData.signals}
              persona={enlPersona}
              personaData={enlPersonaData}
              rawStepActive={rawStepActive}
            />
          ) : queryData && enlPersona && !demoActive ? (
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
          expanded={openPanels.includes('narrative')}
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

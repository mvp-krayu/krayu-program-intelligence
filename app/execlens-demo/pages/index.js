/**
 * pages/index.js
 * PIOS-42.23-RUN01-CONTRACT-v1
 *
 * ExecLens Demo Surface — main page.
 * Topology rewired to governed WOW chain: 42.22 → 51.1 → 51.1R → 42.23
 *
 * All content sourced from /api/execlens → adapter → governed artifacts.
 * No synthetic data. No hardcoded query content.
 */

import { useState, useEffect } from 'react'
import Head from 'next/head'

import QuerySelector     from '../components/QuerySelector'
import ExecutivePanel    from '../components/ExecutivePanel'
import SignalGaugeCard   from '../components/SignalGaugeCard'
import EvidencePanel     from '../components/EvidencePanel'
import NavigationPanel   from '../components/NavigationPanel'
import TemplateRenderer  from '../components/TemplateRenderer'
import LandingGaugeStrip from '../components/LandingGaugeStrip'
import TopologyPanel     from '../components/TopologyPanel'
import DemoController    from '../components/DemoController'

// Pipeline nodes rendered in the hero strip
const PIPELINE_NODES = ['QUERY', 'SIGNAL', 'EVIDENCE', 'NAVIGATION', 'OUTPUT']

const TOTAL_DEMO_STEPS = 7

function PipelineStrip() {
  return (
    <div className="pipeline-strip">
      {PIPELINE_NODES.map((node, i) => (
        <span key={node} className="pipeline-segment">
          <span className="pipeline-node">{node}</span>
          {i < PIPELINE_NODES.length - 1 && (
            <span className="pipeline-arrow">→</span>
          )}
        </span>
      ))}
    </div>
  )
}

const CONF_COLORS = { STRONG: 'var(--strong)', MODERATE: 'var(--moderate)', WEAK: 'var(--weak)' }

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

export default function Home() {
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [queryData,     setQueryData]     = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState(null)

  // ── Demo choreography state (42.8) ──
  const [demoActive, setDemoActive] = useState(false)
  const [demoStep,   setDemoStep]   = useState(0)

  // Query fetch
  useEffect(() => {
    if (!selectedQuery) {
      setQueryData(null)
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

  // Demo step 3: auto-select GQ-003 via normal query path (R7)
  useEffect(() => {
    if (demoActive && demoStep === 3) {
      setSelectedQuery('GQ-003')
    }
  }, [demoActive, demoStep])

  // Demo control handlers
  const handleStartDemo = () => {
    setDemoActive(true)
    setDemoStep(1)
  }

  const handleDemoNext = () => {
    if (demoStep >= TOTAL_DEMO_STEPS) {
      handleDemoExit()
    } else {
      setDemoStep(prev => prev + 1)
    }
  }

  const handleDemoExit = () => {
    setDemoActive(false)
    setDemoStep(0)
  }

  return (
    <>
      <Head>
        <title>ExecLens — Program Intelligence</title>
        <meta name="description" content="Evidence-first program intelligence surface — PIOS run_02_governed" />
      </Head>

      <div className={`page-root${demoActive ? ' demo-active' : ''}`}>

        {/* ── Hero ── */}
        <header className="hero">
          <div className="hero-eyebrow">PROGRAM INTELLIGENCE — EXECUTION SURFACE</div>
          <h1 className="hero-title">ExecLens</h1>
          <p className="hero-subtitle">
            Evidence-first system for program diagnosis, structural risk, and execution visibility
          </p>
          <PipelineStrip />
          <div className="hero-meta">
            PIOS-42.23-RUN01-CONTRACT-v1 · run_02_governed
            &ensp;·&ensp;
            42.22 → 51.1 → 51.1R → 42.23
            &ensp;·&ensp;
            No inference. No synthetic data.
          </div>

          {/* ── Demo activation button ── */}
          {!demoActive && (
            <button className="demo-start-btn" onClick={handleStartDemo}>
              Start ExecLens Demo
            </button>
          )}
        </header>

        {/* ── Landing gauge strip — structural overview before query selection ── */}
        <div data-demo-section="gauges">
          <LandingGaugeStrip />
        </div>

        {/* ── Structural topology — DEMO presentation (42.7 signal-projection path) ── */}
        <div data-demo-section="topology">
          <TopologyPanel selectedQuery={selectedQuery} mode="topology" />
        </div>

        {/* ── Query selector ── */}
        <div className="query-zone" data-demo-section="query">
          <QuerySelector selectedQuery={selectedQuery} onSelect={setSelectedQuery} />

          {queryData && !loading && <ActiveQueryBar data={queryData} />}

          {!selectedQuery && (
            <div className="no-query-state">
              Select a query to load program intelligence.
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

        {/* ── Intelligence output ── */}
        {queryData && !loading && (
          <div className="intelligence-output">

            {/* 1. Query identity panel */}
            <ExecutivePanel data={queryData} />

            {/* 2. Intelligence response — primary executive content */}
            {queryData.template_section && (
              <TemplateRenderer
                templateSection={queryData.template_section}
                navigation={queryData.navigation}
                queryId={queryData.query_id}
              />
            )}

            {/* 3. Bound signals — supporting detail */}
            {queryData.signals && queryData.signals.length > 0 && (
              <div className="panel" data-demo-section="signals">
                <div className="panel-title">
                  Intelligence Signals
                  <span className="panel-title-count">{queryData.signals.length} bound</span>
                </div>
                <div className="signal-grid">
                  {queryData.signals.map(sig => (
                    <SignalGaugeCard key={sig.signal_id} signal={sig} />
                  ))}
                </div>
              </div>
            )}

            {/* 4. Evidence chains — technical detail */}
            <div data-demo-section="evidence">
              <EvidencePanel signals={queryData.signals} />
            </div>

            {/* 5. Navigation vault references */}
            <div data-demo-section="navigation">
              <NavigationPanel navigation={queryData.navigation} />
            </div>

          </div>
        )}

      </div>

      {/* ── Demo choreography bar — rendered outside page-root for fixed positioning ── */}
      <DemoController
        active={demoActive}
        step={demoStep}
        onNext={handleDemoNext}
        onExit={handleDemoExit}
      />
    </>
  )
}

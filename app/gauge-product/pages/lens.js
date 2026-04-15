/**
 * pages/lens.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.REPORT.DELIVERY.01 / PRODUCTIZE.LENS.UI.POLISH.01
 *
 * LENS v1 — Executive intelligence surface.
 *
 * Fetches ZONE-2 projections only. All claims requested at ZONE-2 depth L1.
 * Any payload that is not ZONE-2 is rejected — component renders nothing.
 * Fail-closed: payload.error_type → surface shows blocked state, not blank.
 *
 * Claim assembly:
 *   CLM-09 — Proven Structural Score     → CausalNarrative, StabilityComposition
 *   CLM-20 — SIG-001 Signal              → SignalCards
 *   CLM-25 — Executive Three-Axis Verdict → ExecutiveStatusPanel
 *   CLM-12 — Score Confidence Range      → StabilityComposition
 *   CLM-10 — Achievable Score Projected  → StabilityComposition, EvidenceDepthIndicator
 *
 * Authority: PRODUCTIZE.LENS.UI.POLISH.01
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ExecutiveStatusPanel from '../components/lens/ExecutiveStatusPanel'
import SignalCards from '../components/lens/SignalCards'
import CausalNarrative from '../components/lens/CausalNarrative'
import StabilityComposition from '../components/lens/StabilityComposition'
import RiskPanel from '../components/lens/RiskPanel'
import EvidenceDepthIndicator from '../components/lens/EvidenceDepthIndicator'

// LENS v1 claim set — ZONE-2 only
const LENS_CLAIMS = ['CLM-09', 'CLM-20', 'CLM-25', 'CLM-12', 'CLM-10']
const ZONE  = 'ZONE-2'
const DEPTH = 'L1'

async function fetchProjection(claimId) {
  const url = `/api/projection?claim_id=${claimId}&zone=${ZONE}&depth=${DEPTH}`
  const res = await fetch(url)
  if (!res.ok) {
    return { error_type: 'FETCH_ERROR', reason: `HTTP ${res.status}`, claim_id: claimId }
  }
  return res.json()
}

// ---------------------------------------------------------------------------
// Loading / error shells
// ---------------------------------------------------------------------------

function LoadingShell() {
  return (
    <div className="lens-loading">
      <div className="lens-loading-label">Loading intelligence surface…</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section A — Hero band
// ---------------------------------------------------------------------------

function HeroBand({ scores }) {
  const { proven, achievable, rangeLabel } = scores

  const chips = [
    { label: 'Structural Readiness', value: 'Verified',  color: '#3fb950', bg: '#0d2e1a', border: '#1b5e3d' },
    { label: 'Operational Validation', value: 'Pending', color: '#d29922', bg: '#1a1600', border: '#3d3208' },
    { label: 'Confidence Range',     value: 'Controlled', color: '#58a6ff', bg: '#0b1f31', border: '#1b3a5c' },
  ]

  return (
    <div className="lens-hero-band">
      <div className="lens-hero-main">
        <div className="lens-hero-title">Operational Readiness Snapshot</div>
        <div className="lens-hero-headline">
          Structurally verified. Operational validation remains the final step.
        </div>
        <p className="lens-hero-copy">
          The platform has established a provable structural baseline and a bounded path to full readiness.
          The current uncertainty is not architectural integrity, but runtime confirmation of live execution behavior.
        </p>
      </div>
      <div className="lens-hero-chips">
        {chips.map(c => (
          <div key={c.label} className="lens-hero-chip" style={{ borderColor: c.border, background: c.bg }}>
            <span className="lens-hero-chip-label">{c.label}</span>
            <span className="lens-hero-chip-value" style={{ color: c.color }}>{c.value}</span>
          </div>
        ))}
      </div>
      {proven && (
        <div className="lens-hero-score-row">
          <div className="lens-hero-score-item">
            <span className="lens-hero-score-key">Proven floor</span>
            <span className="lens-hero-score-val">{proven}</span>
          </div>
          <div className="lens-hero-score-divider" />
          <div className="lens-hero-score-item">
            <span className="lens-hero-score-key">Achievable ceiling</span>
            <span className="lens-hero-score-val">{achievable}</span>
          </div>
          {rangeLabel && (
            <>
              <div className="lens-hero-score-divider" />
              <div className="lens-hero-score-item">
                <span className="lens-hero-score-key">Confidence range</span>
                <span className="lens-hero-score-val">{rangeLabel}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section F — Advanced Intelligence Access
// ---------------------------------------------------------------------------

function AdvancedAccessBlock() {
  return (
    <div className="lens-advanced-panel">
      <div className="lens-panel-label">ADVANCED INTELLIGENCE ACCESS</div>
      <p className="lens-advanced-intro">
        The intelligence underlying this view is governed, queryable, and available at greater depth
        for stakeholders requiring stronger assurance, deeper investigation, or technical validation.
      </p>
      <div className="lens-advanced-grid">
        <div className="lens-advanced-item">
          <div className="lens-advanced-item-title">Operational Detail</div>
          <p className="lens-advanced-item-body">
            Deeper operational context is available — including evidence chains, confidence rationale,
            and signal-level interrogation — for technical and leadership teams that require it.
          </p>
        </div>
        <div className="lens-advanced-item">
          <div className="lens-advanced-item-title">Targeted Questioning</div>
          <p className="lens-advanced-item-body">
            The system supports targeted questions about constraints, confidence, and readiness
            at the level of detail required by the client and its technical counterparts.
          </p>
        </div>
        <div className="lens-advanced-item">
          <div className="lens-advanced-item-title">Trace Interrogation</div>
          <p className="lens-advanced-item-body">
            Full trace access enables precise interrogation of how any readiness claim was
            derived — from raw evidence through to the governed conclusion.
          </p>
        </div>
      </div>
      <div className="lens-advanced-access-note">
        Extended query access and deeper trace views are available in advanced access.
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section E — What You Unlock
// ---------------------------------------------------------------------------

function WhatYouUnlock() {
  const points = [
    'Distinguish proven readiness from projected readiness — and act on each with appropriate confidence.',
    'Identify operational blind spots before they become issues — not after commitment.',
    'Move forward with greater confidence on structurally verified decisions, without waiting for full execution measurement.',
    'Use deeper trace and query capabilities where additional assurance is required by leadership or the client.',
  ]

  return (
    <div className="lens-unlock-panel">
      <div className="lens-panel-label">WHAT YOU UNLOCK</div>
      <p className="lens-unlock-intro">
        With this level of observable intelligence, leadership and the client can:
      </p>
      <ul className="lens-unlock-list">
        {points.map((pt, i) => (
          <li key={i} className="lens-unlock-item">
            <span className="lens-unlock-marker">✓</span>
            <span className="lens-unlock-text">{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section G — Execution Visibility Map
// ---------------------------------------------------------------------------

function ExecutionVisibilityMap({ traceAvailable }) {
  const rows = [
    {
      label: 'Structural Coverage',
      value: 'Complete',
      status: 'verified',
      note: 'All structural components examined and accounted for.',
    },
    {
      label: 'Operational Measurement',
      value: 'Partial',
      status: 'pending',
      note: 'Runtime execution assessment not yet completed.',
    },
    {
      label: 'Trace Access',
      value: traceAvailable ? 'Available' : 'Not available',
      status: traceAvailable ? 'available' : 'locked',
      note: traceAvailable ? 'Deeper evidence chains accessible on request.' : null,
    },
    {
      label: 'Audit Depth',
      value: 'Available',
      status: 'available',
      note: 'Full audit trail accessible for governance and verification.',
    },
  ]

  return (
    <div className="lens-vismap-panel">
      <div className="lens-panel-label">EXECUTION VISIBILITY MAP</div>
      <p className="lens-vismap-intro">
        This view summarises visibility depth without exposing internal system structure.
      </p>
      <div className="lens-vismap-rows">
        {rows.map(r => (
          <div key={r.label} className="lens-vismap-row">
            <span className="lens-vismap-label">{r.label}</span>
            <span className={`lens-vismap-value lens-vismap-value--${r.status}`}>{r.value}</span>
            {r.note && <span className="lens-vismap-note">{r.note}</span>}
          </div>
        ))}
      </div>
      <div className="lens-vismap-cta">
        <a href="/topology" className="lens-vismap-link">Explore operational detail →</a>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function LensHeader({ runId, generatedAt }) {
  return (
    <div className="lens-header">
      <div className="lens-header-top">
        <div>
          <div className="lens-header-title">PROGRAM INTELLIGENCE LENS</div>
          <div className="lens-header-sub">Governed Executive Projection · {ZONE} · {DEPTH}</div>
        </div>
        <div className="lens-header-meta">
          {runId && (
            <div className="lens-meta-row">
              <span className="lens-meta-key">ASSESSMENT RUN</span>
              <span className="lens-meta-val">{runId}</span>
            </div>
          )}
          {generatedAt && (
            <div className="lens-meta-row">
              <span className="lens-meta-key">GENERATED</span>
              <span className="lens-meta-val">{generatedAt.replace('T', ' ').replace('Z', ' UTC')}</span>
            </div>
          )}
        </div>
      </div>
      <div className="lens-header-nav">
        <Link href="/overview" className="lens-nav-link">← Overview</Link>
        <Link href="/topology" className="lens-nav-link">Topology</Link>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Report panel (unchanged logic)
// ---------------------------------------------------------------------------

async function generateReport() {
  const res  = await fetch('/api/report')
  const data = await res.json()
  if (!res.ok || data.status !== 'ok') {
    throw new Error(data.reason || 'GENERATION_FAILED')
  }
  return data.report_path
}

function ReportPanel({ runId }) {
  const [state, setState] = useState(null)

  function handleGenerate() {
    setState('loading')
    generateReport()
      .then(path  => setState({ path }))
      .catch(err  => setState({ error: err.message || 'GENERATION_FAILED' }))
  }

  function handleOpen()     { if (state?.path) window.open(state.path) }
  function handleDownload() {
    if (!state?.path) return
    const a = document.createElement('a')
    a.href = state.path
    a.download = state.path.split('/').pop() || 'lens_report.html'
    a.click()
  }

  return (
    <div className="lens-report-panel">
      <div className="lens-panel-label">EXECUTIVE REPORT</div>
      <div className="lens-report-row">
        {(!state || state === 'loading' || state?.error) && (
          <button className="lens-report-btn" onClick={handleGenerate} disabled={state === 'loading'}>
            {state === 'loading' ? 'Generating…' : 'Generate Executive Report'}
          </button>
        )}
        {state === 'loading' && <span className="lens-report-status">Building governed projection report…</span>}
        {state?.error && <span className="lens-report-error">{state.error}</span>}
        {state?.path && (
          <div className="lens-report-actions">
            <button className="lens-report-action-btn lens-report-open" onClick={handleOpen}>Open Report</button>
            <button className="lens-report-action-btn lens-report-download" onClick={handleDownload}>Download Report</button>
            <span className="lens-report-ready">Report ready</span>
          </div>
        )}
      </div>
      {runId && (
        <div className="lens-report-basis">
          Derived from governed projection (ZONE-2) · Run: {runId}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LensPage() {
  const [payloads, setPayloads] = useState({})
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all(LENS_CLAIMS.map(id => fetchProjection(id)))
      .then(results => {
        if (cancelled) return
        const map = {}
        results.forEach((p, i) => { map[LENS_CLAIMS[i]] = p })
        setPayloads(map)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message || 'FETCH_FAILED')
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingShell />
  if (error) {
    return (
      <div className="lens-page">
        <div className="lens-fatal-error">LENS UNAVAILABLE — {error}</div>
      </div>
    )
  }

  const p09 = payloads['CLM-09']
  const p20 = payloads['CLM-20']
  const p25 = payloads['CLM-25']
  const p12 = payloads['CLM-12']
  const p10 = payloads['CLM-10']

  const allPayloads = LENS_CLAIMS.map(id => payloads[id]).filter(Boolean)
  const anchor      = allPayloads.find(p => !p.error_type && p.zone === ZONE)
  const runId       = anchor?.run_id       || null
  const generatedAt = anchor?.generated_at || null

  // Extract scores for hero band
  const provenNarrative    = p09?.value?.narrative || null
  const achievableNarrative = p10?.value?.narrative || null
  const rangeRaw = p12?.value?.narrative || null
  const rangeLabel = rangeRaw
    ? rangeRaw.replace(/,?\s*status=\S+/g, '').trim().replace(/^lower=(\d+),\s*upper=(\d+)/, '$1 – $2')
    : null
  const heroScores = { proven: provenNarrative, achievable: achievableNarrative, rangeLabel }

  const traceAvailable = anchor?.trace_available === true

  return (
    <div className="lens-page">
      <LensHeader runId={runId} generatedAt={generatedAt} />

      {/* Section A — Hero band */}
      <div className="lens-band">
        <HeroBand scores={heroScores} />
      </div>

      {/* Primary band — readiness verdict + confidence distribution + depth */}
      <div className="lens-band lens-band-primary">
        <div className="lens-col lens-col-main">
          <ExecutiveStatusPanel payload={p25} />
        </div>
        <div className="lens-col lens-col-aside">
          <StabilityComposition payloads={allPayloads} />
          <EvidenceDepthIndicator payload={p10 || p09} />
        </div>
      </div>

      {/* Section B — Decision relevance */}
      <div className="lens-band">
        <CausalNarrative payload={p09} />
      </div>

      {/* Section C — Operational signal */}
      {p20 && !p20.error_type && (
        <div className="lens-band">
          <SignalCards payloads={[p20]} />
        </div>
      )}

      {/* Section D — Decision conditions */}
      <div className="lens-band">
        <RiskPanel payloads={allPayloads} />
      </div>

      {/* Section G — Execution Visibility Map */}
      <div className="lens-band">
        <ExecutionVisibilityMap traceAvailable={traceAvailable} />
      </div>

      {/* Section E — What You Unlock */}
      <div className="lens-band">
        <WhatYouUnlock />
      </div>

      {/* Section F — Advanced Intelligence Access */}
      <div className="lens-band">
        <AdvancedAccessBlock />
      </div>

      {/* Report generation */}
      <div className="lens-band">
        <ReportPanel runId={runId} />
      </div>

      <div className="lens-footer">
        <span className="lens-footer-authority">PRODUCTIZE.LENS.UI.POLISH.01</span>
        <span className="lens-footer-zone-lock">ZONE-2 ONLY · NO INTERNAL STRUCTURE EXPOSED</span>
      </div>
    </div>
  )
}

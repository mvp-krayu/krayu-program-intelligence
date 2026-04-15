/**
 * pages/lens.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.REPORT.DELIVERY.01
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
 * Authority: PRODUCTIZE.LENS.UI.01
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
const ZONE = 'ZONE-2'
const DEPTH = 'L1'

async function fetchProjection(claimId) {
  const url = `/api/projection?claim_id=${claimId}&zone=${ZONE}&depth=${DEPTH}`
  const res = await fetch(url)
  if (!res.ok) {
    return {
      error_type: 'FETCH_ERROR',
      reason: `HTTP ${res.status}`,
      claim_id: claimId,
    }
  }
  return res.json()
}

function LoadingShell() {
  return (
    <div className="lens-loading">
      <div className="lens-loading-label">LOADING INTELLIGENCE SURFACE…</div>
    </div>
  )
}

function LensHeader({ runId, generatedAt }) {
  return (
    <div className="lens-header">
      <div className="lens-header-top">
        <div>
          <div className="lens-header-title">PROGRAM INTELLIGENCE LENS</div>
          <div className="lens-header-sub">Executive Projection · {ZONE} · {DEPTH}</div>
        </div>
        <div className="lens-header-meta">
          {runId && <div className="lens-meta-row"><span className="lens-meta-key">RUN</span><span className="lens-meta-val">{runId}</span></div>}
          {generatedAt && <div className="lens-meta-row"><span className="lens-meta-key">GENERATED</span><span className="lens-meta-val">{generatedAt.replace('T', ' ').replace('Z', ' UTC')}</span></div>}
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
// Report generation — Section E/F
// ---------------------------------------------------------------------------

// reportState: null | 'loading' | { path: string } | { error: string }
async function generateReport() {
  const res = await fetch('/api/report')
  const data = await res.json()
  if (!res.ok || data.status !== 'ok') {
    throw new Error(data.reason || 'GENERATION_FAILED')
  }
  return data.report_path
}

function ReportPanel({ runId }) {
  const [state, setState] = useState(null) // null | 'loading' | {path} | {error}

  function handleGenerate() {
    setState('loading')
    generateReport()
      .then(path => setState({ path }))
      .catch(err => setState({ error: err.message || 'GENERATION_FAILED' }))
  }

  function handleOpen() {
    if (state?.path) window.open(state.path)
  }

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
        {!state || state === 'loading' || state?.error ? (
          <button
            className="lens-report-btn"
            onClick={handleGenerate}
            disabled={state === 'loading'}
          >
            {state === 'loading' ? 'Generating…' : 'Generate Executive Report'}
          </button>
        ) : null}

        {state === 'loading' && (
          <span className="lens-report-status">Building governed projection report…</span>
        )}

        {state?.error && (
          <span className="lens-report-error">{state.error}</span>
        )}

        {state?.path && (
          <div className="lens-report-actions">
            <button className="lens-report-action-btn lens-report-open" onClick={handleOpen}>
              Open Report
            </button>
            <button className="lens-report-action-btn lens-report-download" onClick={handleDownload}>
              Download Report
            </button>
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
        <div className="lens-fatal-error">
          LENS UNAVAILABLE — {error}
        </div>
      </div>
    )
  }

  // Payload accessors
  const p09 = payloads['CLM-09']
  const p20 = payloads['CLM-20']
  const p25 = payloads['CLM-25']
  const p12 = payloads['CLM-12']
  const p10 = payloads['CLM-10']

  const allPayloads = LENS_CLAIMS.map(id => payloads[id]).filter(Boolean)

  // Header metadata — take from first successful ZONE-2 payload
  const anchor = allPayloads.find(p => !p.error_type && p.zone === ZONE)
  const runId      = anchor?.run_id      || null
  const generatedAt = anchor?.generated_at || null

  return (
    <div className="lens-page">
      <LensHeader runId={runId} generatedAt={generatedAt} />

      {/* Primary band — verdict + composition + depth */}
      <div className="lens-band lens-band-primary">
        <div className="lens-col lens-col-main">
          <ExecutiveStatusPanel payload={p25} />
        </div>
        <div className="lens-col lens-col-aside">
          <StabilityComposition payloads={allPayloads} />
          <EvidenceDepthIndicator payload={p10 || p09} />
        </div>
      </div>

      {/* Narrative band — causal explanation */}
      <div className="lens-band">
        <CausalNarrative payload={p09} />
      </div>

      {/* Signal band */}
      {p20 && !p20.error_type && (
        <div className="lens-band">
          <SignalCards payloads={[p20]} />
        </div>
      )}

      {/* Risk band — caveats from all claims */}
      <div className="lens-band">
        <RiskPanel payloads={allPayloads} />
      </div>

      {/* Report generation band */}
      <div className="lens-band">
        <ReportPanel runId={runId} />
      </div>

      <div className="lens-footer">
        <span className="lens-footer-authority">PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.REPORT.DELIVERY.01</span>
        <span className="lens-footer-zone-lock">ZONE-2 ONLY · NO INTERNAL STRUCTURE EXPOSED</span>
      </div>
    </div>
  )
}

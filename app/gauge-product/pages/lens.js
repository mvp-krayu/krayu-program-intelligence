/**
 * pages/lens.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.REPORT.DELIVERY.01 / PRODUCTIZE.LENS.UI.POLISH.01
 * PRODUCTIZE.LENS.TOPOLOGY.INTELLIGENCE.01 / PRODUCTIZE.LENS.COMMERCIAL.GATING.01
 *
 * LENS v1 — Executive intelligence surface.
 *
 * Fetches ZONE-2 projections only. All claims requested at ZONE-2 depth L1.
 * Any payload that is not ZONE-2 is rejected — component renders nothing.
 * Fail-closed: payload.error_type → surface shows blocked state, not blank.
 *
 * Claim assembly:
 *   CLM-09 — Proven Structural Score       → SystemIntelligenceOverview, ConnectedSystemView, CausalNarrative, StabilityComposition
 *   CLM-20 — SIG-001 Signal                → SystemIntelligenceOverview, ConnectedSystemView, FocusDomainPanel, SignalCards
 *   CLM-25 — Executive Three-Axis Verdict  → ExecutiveStatusPanel, SystemIntelligenceOverview, ConnectedSystemView
 *   CLM-12 — Score Confidence Range        → SystemIntelligenceOverview, ConnectedSystemView, StabilityComposition
 *   CLM-10 — Achievable Score Projected    → SystemIntelligenceOverview, ConnectedSystemView, StabilityComposition, EvidenceDepthIndicator
 *
 * Page flow (rebalanced per TOPOLOGY.INTELLIGENCE.01):
 *   Hero → System Intelligence Overview → Connected System View → Focus Domain →
 *   [verdict + confidence + depth] → Decision Relevance → Operational Signals →
 *   Decision Conditions → What You Unlock → Advanced Intelligence Access →
 *   Explore Governed Detail → Report
 *
 * Authority: PRODUCTIZE.LENS.COMMERCIAL.GATING.01
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ExecutiveStatusPanel from '../components/lens/ExecutiveStatusPanel'
import SignalCards from '../components/lens/SignalCards'
import CausalNarrative from '../components/lens/CausalNarrative'
import StabilityComposition from '../components/lens/StabilityComposition'
import RiskPanel from '../components/lens/RiskPanel'
import EvidenceDepthIndicator from '../components/lens/EvidenceDepthIndicator'
import SystemIntelligenceOverview from '../components/lens/SystemIntelligenceOverview'
import ConnectedSystemView from '../components/lens/ConnectedSystemView'
import FocusDomainPanel from '../components/lens/FocusDomainPanel'
import ExploreGovernedDetail from '../components/lens/ExploreGovernedDetail'
import AccessGateModal from '../components/lens/AccessGateModal'
import { useAccessGate } from '../lib/lens/useAccessGate'

// LENS v1 claim set — ZONE-2 only
const LENS_CLAIMS = ['CLM-09', 'CLM-20', 'CLM-25', 'CLM-12', 'CLM-10']
// GAP-01 gate — set true only after CONCEPT-06 predicate fix (concepts.json NOT_EVALUATED support)
const GAP_01_RESOLVED = false
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

function WhatYouUnlock({ onUnlock }) {
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
      <div className="lens-unlock-cta-block">
        <span className="lens-unlock-cta-label">
          Additional intelligence depth is available for stakeholders requiring stronger assurance.
        </span>
        <button className="lens-unlock-cta-btn" onClick={onUnlock}>
          Unlock Advanced Intelligence Access
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section F — Deeper Intelligence Access (footer conversion block)
// ---------------------------------------------------------------------------

function IntelligenceGateCTA({ onUnlock }) {
  const gatedItems = [
    'Full trace interrogation — evidence chain validation from raw signal to governed conclusion',
    'Capability-level topology — structural detail beneath the domain overview layer',
    'Operational evidence chains — signal-to-conclusion traceability at L2/L3 depth',
    'Full audit trail — governance and verification access for technical and leadership teams',
  ]

  return (
    <div className="lens-gate-cta-panel">
      <div className="lens-panel-label">DEEPER INTELLIGENCE ACCESS</div>
      <div className="lens-gate-cta-title">Extended Intelligence Layers Available</div>
      <p className="lens-gate-cta-sub">
        The governed intelligence system contains additional depth beyond this executive surface.
        Entitlement-based access unlocks the full traceability and interrogation capabilities.
      </p>
      <ul className="lens-gate-cta-list">
        {gatedItems.map((item, i) => (
          <li key={i} className="lens-gate-cta-item">
            <span className="lens-gate-cta-item-marker">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="lens-gate-cta-actions">
        <button className="lens-gate-cta-primary" onClick={onUnlock}>
          Unlock Access
        </button>
        <Link href="/plans" className="lens-gate-cta-secondary">
          View Plans
        </Link>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function LensHeader({ runId, generatedAt, hasAccess, onUnlock }) {
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
        {hasAccess ? (
          <Link href="/topology" className="lens-nav-link">Topology</Link>
        ) : (
          <button className="lens-nav-link lens-nav-link--gated" onClick={onUnlock}>
            Deep Access
          </button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Report panel
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Runtime Selector + Generate
// ---------------------------------------------------------------------------

function RuntimeSelector() {
  const [runtimes,  setRuntimes]  = useState([])
  const [selected,  setSelected]  = useState('')
  const [genState,  setGenState]  = useState(null) // null | 'loading' | {urls} | {error}

  useEffect(() => {
    fetch('/api/runtime-list')
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setRuntimes(list)
        if (list.length > 0) setSelected(`${list[0].client}||${list[0].run}`)
      })
      .catch(() => {})
  }, [])

  const rt = runtimes.find(r => `${r.client}||${r.run}` === selected)

  function handleGenerate() {
    if (!rt) return
    setGenState('loading')
    fetch(`/api/generate-report?client=${encodeURIComponent(rt.client)}&run=${encodeURIComponent(rt.run)}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') setGenState({ urls: data.report_urls })
        else setGenState({ error: data.reason || 'GENERATION_FAILED' })
      })
      .catch(err => setGenState({ error: err.message || 'FETCH_ERROR' }))
  }

  const selectStyle = {
    background: '#16161a', color: '#e8e8e8', border: '1px solid #2a2a2e',
    borderRadius: '3px', padding: '6px 10px', fontSize: '12px',
    marginRight: '10px', minWidth: '260px',
  }

  return (
    <div className="lens-report-panel">
      <div className="lens-panel-label">RUNTIME REPORTS</div>
      <div className="lens-report-row" style={{ alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <select
          value={selected}
          onChange={e => { setSelected(e.target.value); setGenState(null) }}
          style={selectStyle}
          disabled={runtimes.length === 0}
        >
          {runtimes.length === 0 && <option value="">Loading…</option>}
          {runtimes.map(r => (
            <option key={`${r.client}||${r.run}`} value={`${r.client}||${r.run}`}>
              {r.client} / {r.run}
            </option>
          ))}
        </select>
        <button
          className="lens-report-btn"
          onClick={handleGenerate}
          disabled={genState === 'loading' || !rt}
        >
          {genState === 'loading' ? 'Generating…' : 'Generate'}
        </button>
      </div>
      {genState === 'loading' && (
        <span className="lens-report-status" style={{ marginTop: '8px', display: 'block' }}>
          Building reports…
        </span>
      )}
      {genState?.error && (
        <span className="lens-report-error" style={{ marginTop: '8px', display: 'block' }}>
          {genState.error}
        </span>
      )}
      {genState?.urls && (
        <div className="lens-report-artifacts" style={{ marginTop: '12px' }}>
          {genState.urls.tier1_narrative && (
            <button className="lens-report-action-btn lens-report-primary"
              onClick={() => window.open(genState.urls.tier1_narrative)}>
              Executive Brief
            </button>
          )}
          {genState.urls.tier1_evidence && (
            <button className="lens-report-action-btn lens-report-secondary"
              onClick={() => window.open(genState.urls.tier1_evidence)}>
              Structural Evidence
            </button>
          )}
          {genState.urls.tier2_diagnostic && (
            <button className="lens-report-action-btn lens-report-narrative"
              onClick={() => window.open(genState.urls.tier2_diagnostic)}>
              Diagnostic
            </button>
          )}
          {genState.urls.decision && (
            <button className="lens-report-action-btn lens-report-primary"
              onClick={() => window.open(genState.urls.decision)}
              style={{ marginLeft: '4px' }}>
              Decision Surface
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Second-client scoping — mirrors workspace.js pattern
const _SC_CLIENT_ID = 'e65d2f0a-dfa7-4257-9333-fcbb583f0880'
const _SC_RUN_ID    = 'run_01_oss_fastapi'

function reportUrl(name) {
  return `/api/report-file?name=${encodeURIComponent(name)}&client=${_SC_CLIENT_ID}&runId=${_SC_RUN_ID}`
}

async function generateReport() {
  const [res1, res2] = await Promise.all([
    fetch('/api/report'),
    fetch(`/api/report?client=${_SC_CLIENT_ID}&runId=${_SC_RUN_ID}&deliverable=diagnostic`),
  ])
  const [data1, data2] = await Promise.all([res1.json(), res2.json()])
  if (!res1.ok || data1.status !== 'ok') {
    throw new Error(data1.reason || 'GENERATION_FAILED')
  }
  const byName = {}
  for (const f of data1.files) byName[f.name] = f
  if (res2.ok && data2.status === 'ok') {
    for (const f of data2.files) byName[f.name] = f
  }
  const withUrl = name => byName[name]
    ? { ...byName[name], path: reportUrl(name) }
    : undefined
  return {
    executive:  withUrl('lens_tier1_narrative_brief.html'),
    lens:       withUrl('lens_tier1_evidence_brief.html'),
    diagnostic: withUrl('lens_tier2_diagnostic_narrative.html'),
  }
}

function ReportPanel({ runId }) {
  const [state, setState] = useState(null)

  function handleGenerate() {
    setState('loading')
    generateReport()
      .then(artifacts => setState({ artifacts }))
      .catch(err       => setState({ error: err.message || 'GENERATION_FAILED' }))
  }

  return (
    <div className="lens-report-panel">
      <div className="lens-panel-label">REPORTS</div>
      <div className="lens-report-row">
        {(!state || state === 'loading' || state?.error) && (
          <button className="lens-report-btn" onClick={handleGenerate} disabled={state === 'loading'}>
            {state === 'loading' ? 'Generating…' : 'Generate'}
          </button>
        )}
        {state === 'loading' && <span className="lens-report-status">Building governed reports…</span>}
        {state?.error && <span className="lens-report-error">{state.error}</span>}
      </div>
      {state?.artifacts && (
        <div className="lens-report-artifacts">
          {state.artifacts.executive && (
            <button
              className="lens-report-action-btn lens-report-primary"
              onClick={() => window.open(state.artifacts.executive.path)}
            >
              Executive
            </button>
          )}
          {state.artifacts.lens && (
            <button
              className="lens-report-action-btn lens-report-secondary"
              onClick={() => window.open(state.artifacts.lens.path)}
            >
              LENS
            </button>
          )}
          {state.artifacts.diagnostic && (
            <button
              className="lens-report-action-btn lens-report-narrative"
              onClick={() => window.open(state.artifacts.diagnostic.path)}
            >
              Diagnostic
            </button>
          )}
        </div>
      )}
      <div className="lens-report-workspace-row">
        <button
          className="lens-report-workspace"
          onClick={() => window.open('/tier2/workspace')}
        >
          Diagnostic Workspace
        </button>
        <span className="lens-report-workspace-hint">
          Live WHY &amp; EVIDENCE &amp; TRACE · inference_prohibition: ACTIVE
        </span>
      </div>
      {runId && (
        <div className="lens-report-basis">
          Governed projection (ZONE-2) · Run: {runId}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LensPage() {
  const { hasAccess, modalOpen, showModal, hideModal, grantAccess } = useAccessGate()
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

  return (
    <div className="lens-page">
      <AccessGateModal open={modalOpen} onClose={hideModal} onGrant={grantAccess} />

      <LensHeader runId={runId} generatedAt={generatedAt} hasAccess={hasAccess} onUnlock={showModal} />

      {/* Section A — Hero band */}
      <div className="lens-band">
        <HeroBand scores={heroScores} />
      </div>

      {/* Section B — System Intelligence Overview: suppressed — client-specific content not available */}
      {null}

      {/* Section C — Connected System View: suppressed — client-specific content not available */}
      {null}

      {/* Section D — Focus Domain: suppressed — client-specific content not available */}
      {null}

      {/* Primary band — readiness verdict + confidence distribution + depth */}
      <div className="lens-band lens-band-primary">
        <div className="lens-col lens-col-main">
          {GAP_01_RESOLVED && p25 && !p25.error_type
            ? <ExecutiveStatusPanel payload={p25} />
            : <div className="lens-gated-slot">Conceptual coherence not yet evaluated</div>
          }
        </div>
        <div className="lens-col lens-col-aside">
          <StabilityComposition payloads={allPayloads} />
          <EvidenceDepthIndicator payload={p10 || p09} onUnlock={showModal} hasAccess={hasAccess} />
        </div>
      </div>

      {/* Decision Relevance */}
      <div className="lens-band">
        <CausalNarrative payload={p09} />
      </div>

      {/* Operational Signals */}
      {p20 && !p20.error_type && (
        <div className="lens-band">
          <SignalCards payloads={[p20]} />
        </div>
      )}

      {/* Decision Conditions */}
      <div className="lens-band">
        <RiskPanel payloads={allPayloads} />
      </div>

      {/* What You Unlock */}
      <div className="lens-band">
        <WhatYouUnlock onUnlock={showModal} />
      </div>

      {/* Advanced Intelligence Access */}
      <div className="lens-band">
        <AdvancedAccessBlock />
      </div>

      {/* Section E — Explore Governed Detail (gated) */}
      <div className="lens-band">
        <ExploreGovernedDetail onUnlock={showModal} hasAccess={hasAccess} />
      </div>

      {/* Section F — Deeper Intelligence Access (footer conversion) */}
      <div className="lens-band">
        <IntelligenceGateCTA onUnlock={showModal} />
      </div>

      {/* Runtime selector + generate */}
      <div className="lens-band">
        <RuntimeSelector />
      </div>

      {/* Report generation */}
      <div className="lens-band">
        <ReportPanel runId={runId} />
      </div>

      <div className="lens-footer">
        <span className="lens-footer-authority">PRODUCTIZE.LENS.COMMERCIAL.GATING.01</span>
        <span className="lens-footer-zone-lock">ZONE-2 ONLY · NO INTERNAL STRUCTURE EXPOSED</span>
      </div>
    </div>
  )
}

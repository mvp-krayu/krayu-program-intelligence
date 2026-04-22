/**
 * pages/tier2/workspace.js
 * TIER2.RUNTIME.QUERY.ENGINE.01
 *
 * Tier-2 Diagnostic Workspace — minimum viable live interrogation surface.
 *
 * Loads zone list from /api/zones on mount.
 * Renders per-zone WHY and EVIDENCE query buttons.
 * Results render inline below each zone card — no navigation required.
 *
 * TRACE mode is not implemented. Zone filtering/sorting is not implemented.
 * inference_prohibition: ACTIVE is enforced in every query response and shown
 * as the first element of every result panel.
 *
 * Authority: TIER2.RUNTIME.QUERY.ENGINE.01
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ---------------------------------------------------------------------------
// Badge helpers
// ---------------------------------------------------------------------------

function zoneTypeMeta(zt) {
  return {
    pressure_concentration:   { label: 'pressure concentration', cls: 'ws-type-pressure'      },
    evidence_gap:             { label: 'evidence gap',            cls: 'ws-type-gap'           },
    signal_conflict:          { label: 'signal conflict',         cls: 'ws-type-conflict'      },
    structural_inconsistency: { label: 'structural inconsistency',cls: 'ws-type-inconsistency' },
  }[zt] || { label: zt, cls: '' }
}

const SEV_CLS  = { HIGH: 'ws-sev-high', MODERATE: 'ws-sev-moderate', LOW: 'ws-sev-low' }
const CONF_CLS = { STRONG: 'ws-conf-strong', PARTIAL: 'ws-conf-partial', WEAK: 'ws-conf-weak' }
const TRACE_CLS = {
  FULLY_TRACEABLE:     'ws-trace-full',
  PARTIALLY_TRACEABLE: 'ws-trace-partial',
  NOT_TRACEABLE:       'ws-trace-none',
}

// ---------------------------------------------------------------------------
// Sub-panels shared by WHY and EVIDENCE results
// ---------------------------------------------------------------------------

function ProhibitionBadge() {
  return (
    <div className="ws-prohibition">
      <span className="ws-prohibition-label">inference_prohibition</span>
      <span className="ws-prohibition-value">ACTIVE</span>
    </div>
  )
}

function UnresolvedBlock({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="ws-result-section ws-uncertainty">
      <div className="ws-result-label">Unresolved Elements</div>
      {items.map((u, i) => (
        <div key={i} className="ws-unresolved-row">
          <div className="ws-unresolved-element">{u.element}</div>
          <div className="ws-unresolved-reason">{u.reason}</div>
        </div>
      ))}
    </div>
  )
}

function MissingBlock({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="ws-result-section ws-missing">
      <div className="ws-result-label">Missing Evidence</div>
      {items.map((m, i) => (
        <div key={i} className="ws-missing-row">
          <div className="ws-missing-item">{m.item}</div>
          <div className="ws-missing-impact">{m.impact}</div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// WHY result panel
// ---------------------------------------------------------------------------

function WhyResult({ data }) {
  const r = data.result
  const { cls: typeCls, label: typeLabel } = zoneTypeMeta(r.zone_type)
  return (
    <div className="ws-result-panel">
      <ProhibitionBadge />
      <div className="ws-result-section">
        <div className="ws-result-label">Classification</div>
        <div className="ws-badge-row">
          <span className={`ws-badge ${typeCls}`}>{typeLabel}</span>
          <span className={`ws-badge ${SEV_CLS[r.severity] || ''}`}>{r.severity}</span>
          <span className={`ws-badge ${CONF_CLS[r.confidence] || ''}`}>{r.confidence}</span>
        </div>
      </div>
      <UnresolvedBlock items={data.uncertainty.unresolved} />
      <MissingBlock    items={data.evidence_basis.missing} />
      <div className="ws-result-section">
        <div className="ws-result-label">Structural Scope</div>
        <div className="ws-scope-line">
          {r.structural_scope.capability_count} capability node{r.structural_scope.capability_count !== 1 ? 's' : ''}
          {r.structural_scope.capability_ids.map(c => (
            <span key={c} className="ws-chip">{c}</span>
          ))}
        </div>
      </div>
      <div className="ws-result-section">
        <div className="ws-result-label">Classification Rationale</div>
        <div className="ws-rationale">
          {r.classification_rationale.map((f, i) => (
            <div key={i} className="ws-rationale-row">
              <span className="ws-rationale-factor">{f.factor.replace(/_/g, ' ')}</span>
              <span className="ws-rationale-value">
                {typeof f.value === 'object' ? JSON.stringify(f.value) : String(f.value)}
              </span>
              <span className="ws-rationale-contrib">{f.contribution}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Vault link section (EVIDENCE results only)
// ---------------------------------------------------------------------------

function VaultLinks({ targets }) {
  if (!targets || targets.length === 0) return null
  return (
    <div className="ws-result-section ws-vault-links">
      <div className="ws-result-label">Evidence Vault</div>
      <div className="ws-vault-target-list">
        {targets.map(t => (
          <a
            key={`${t.type}-${t.id}`}
            href={`/vault?type=${t.type}&id=${encodeURIComponent(t.id)}`}
            target="_blank"
            rel="noreferrer"
            className={`ws-vault-link ws-vault-link-${t.type}`}
          >
            <span className="ws-vault-link-type">{t.type}</span>
            <span className="ws-vault-link-id">{t.id}</span>
            <span className="ws-vault-link-label">{t.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EVIDENCE result panel
// ---------------------------------------------------------------------------

function EvidenceResult({ data }) {
  const r = data.result
  return (
    <div className="ws-result-panel">
      <ProhibitionBadge />
      <UnresolvedBlock items={data.uncertainty.unresolved} />
      <MissingBlock    items={data.evidence_basis.missing} />
      <div className="ws-result-section">
        <div className="ws-result-label">Signal Coverage</div>
        <div className="ws-badge-row">
          <span className="ws-badge ws-badge-neutral">
            {r.signals_total} signal{r.signals_total !== 1 ? 's' : ''} bound
          </span>
          <span className="ws-badge ws-badge-neutral">
            {r.total_trace_links} trace link{r.total_trace_links !== 1 ? 's' : ''}
          </span>
        </div>
        {r.signal_coverage.length === 0 && (
          <div className="ws-empty-note">No signals bound to this zone&apos;s domain.</div>
        )}
        {r.signal_coverage.map(s => (
          <div key={s.signal_id} className="ws-signal-block">
            <div className="ws-signal-header">
              <span className="ws-signal-id">{s.signal_id}</span>
              <span className={`ws-badge ${CONF_CLS[s.evidence_confidence] || ''}`}>
                {s.evidence_confidence}
              </span>
              <span className="ws-signal-title">{s.title}</span>
            </div>
            {s.trace_links.length > 0 ? (
              <ul className="ws-trace-list">
                {s.trace_links.map((l, i) => <li key={i} className="ws-trace-link">{l}</li>)}
              </ul>
            ) : (
              <div className="ws-empty-note">No trace links.</div>
            )}
          </div>
        ))}
      </div>
      <VaultLinks targets={data.vault_targets} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Zone card
// ---------------------------------------------------------------------------

function ZoneCard({ zone }) {
  const [qs, setQs] = useState(null) // null | {loading,mode} | {mode,data} | {mode,error}

  async function fireQuery(mode) {
    setQs({ loading: true, mode })
    try {
      const res  = await fetch(`/api/query?zone_id=${zone.zone_id}&mode=${mode}`)
      const data = await res.json()
      setQs(data.status === 'ok'
        ? { mode, data }
        : { mode, error: data.reason || 'QUERY_FAILED' })
    } catch {
      setQs({ mode, error: 'NETWORK_ERROR' })
    }
  }

  const { cls: typeCls, label: typeLabel } = zoneTypeMeta(zone.zone_type)

  return (
    <div className="ws-zone-card">
      <div className="ws-zone-header">
        <div className="ws-zone-id">{zone.zone_id}</div>
        <div className="ws-zone-domain">{zone.domain_name}</div>
        <div className="ws-badge-row">
          <span className={`ws-badge ${typeCls}`}>{typeLabel}</span>
          <span className={`ws-badge ${SEV_CLS[zone.severity]  || ''}`}>{zone.severity}</span>
          <span className={`ws-badge ${CONF_CLS[zone.confidence] || ''}`}>{zone.confidence}</span>
          <span className={`ws-badge ${TRACE_CLS[zone.traceability] || ''} ws-badge-sm`}>
            {zone.traceability.replace(/_/g, ' ')}
          </span>
          <span className="ws-badge ws-badge-neutral ws-badge-sm">
            {zone.capability_count} cap{zone.capability_count !== 1 ? 's' : ''}
          </span>
          <span className="ws-badge ws-badge-neutral ws-badge-sm">
            {zone.signal_count} sig{zone.signal_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="ws-zone-vault-row">
        <a
          href={`/vault?type=domain&id=${encodeURIComponent(zone.domain_id)}`}
          target="_blank"
          rel="noreferrer"
          className="ws-vault-zone-link"
        >
          Open Vault (Zone Scope) ↗
        </a>
      </div>

      <div className="ws-zone-actions">
        <button
          className="ws-btn ws-btn-why"
          onClick={() => fireQuery('WHY')}
          disabled={qs?.loading}
          title="Zone type, severity, confidence, and classification rationale"
        >
          WHY
        </button>
        <button
          className="ws-btn ws-btn-evidence"
          onClick={() => fireQuery('EVIDENCE')}
          disabled={qs?.loading}
          title="Signal coverage, trace links, and evidence gaps for this zone"
        >
          EVIDENCE
        </button>
        {qs?.data && (
          <button className="ws-btn ws-btn-clear" onClick={() => setQs(null)}>✕ clear</button>
        )}
      </div>

      {qs?.loading && (
        <div className="ws-query-loading">Querying {qs.mode}…</div>
      )}
      {qs?.error && (
        <div className="ws-query-error">{qs.error}</div>
      )}
      {qs?.data && qs.mode === 'WHY'      && <WhyResult      data={qs.data} />}
      {qs?.data && qs.mode === 'EVIDENCE' && <EvidenceResult data={qs.data} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Tier2WorkspacePage() {
  const [pageState, setPageState] = useState('loading')
  const [zonesData, setZonesData] = useState(null)

  useEffect(() => {
    fetch('/api/zones')
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok') {
          setZonesData(data)
          setPageState('ready')
        } else {
          setPageState('error')
        }
      })
      .catch(() => setPageState('error'))
  }, [])

  return (
    <div className="ws-page">
      <div className="ws-topbar">
        <Link href="/" className="ws-back-link">← LENS</Link>
        <span className="ws-topbar-title">Tier-2 Diagnostic Workspace</span>
        {zonesData && <span className="ws-topbar-run">{zonesData.run_id}</span>}
      </div>

      {pageState === 'loading' && (
        <div className="ws-page-state">Loading canonical zone data…</div>
      )}

      {pageState === 'error' && (
        <div className="ws-page-state ws-page-error">
          <div className="ws-error-label">CANONICAL DATA UNAVAILABLE</div>
          <div className="ws-error-detail">Zone data could not be loaded. Canonical inputs may be missing or inaccessible.</div>
        </div>
      )}

      {pageState === 'ready' && zonesData && (
        <>
          <div className="ws-context-lock">
            <div className="ws-ctx-field">
              <span className="ws-ctx-label">Run</span>
              <span className="ws-ctx-value">{zonesData.run_id}</span>
            </div>
            <div className="ws-ctx-field">
              <span className="ws-ctx-label">Score</span>
              <span className="ws-ctx-value">{zonesData.context.score} — {zonesData.context.band}</span>
            </div>
            <div className="ws-ctx-field">
              <span className="ws-ctx-label">Confidence</span>
              <span className="ws-ctx-value">{zonesData.context.confidence}</span>
            </div>
            <div className="ws-ctx-field">
              <span className="ws-ctx-label">inference_prohibition</span>
              <span className="ws-ctx-value ws-ctx-active">ACTIVE</span>
            </div>
          </div>

          <div className="ws-inventory-header">
            <span className="ws-inventory-title">Diagnostic Zones</span>
            <span className="ws-inventory-count">
              {zonesData.total_zones} zone{zonesData.total_zones !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="ws-zone-list">
            {zonesData.zones.map(zone => (
              <ZoneCard key={zone.zone_id} zone={zone} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

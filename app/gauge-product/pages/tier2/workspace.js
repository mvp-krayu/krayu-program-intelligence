/**
 * pages/tier2/workspace.js
 * TIER2.WORKSPACE.GRAPH.REPOSITION.01
 *
 * Tier-2 Diagnostic Workspace — governed investigation surface.
 * WHY / EVIDENCE / TRACE modes live. Vault links resolve to exported pages.
 * inference_prohibition: ACTIVE on all result panels.
 *
 * Graph repositioned: single global VaultGraph above zone list.
 * Zone cards are investigation triggers; graph reflects active zone + mode.
 * State persisted via sessionStorage for vault navigation continuity.
 *
 * Authority: TIER2.RUNTIME.QUERY.ENGINE.01
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const VaultGraph = dynamic(() => import('../../components/VaultGraph'), { ssr: false })

// ---------------------------------------------------------------------------
// Vault index resolution
// ---------------------------------------------------------------------------

const _VAULT_CLIENT    = process.env.NEXT_PUBLIC_VAULT_CLIENT || null
const _VAULT_RUN_ID    = process.env.NEXT_PUBLIC_VAULT_RUN_ID || null
const VAULT_INDEX_URL  = (_VAULT_CLIENT && _VAULT_RUN_ID)
  ? `/vault/${_VAULT_CLIENT}/${_VAULT_RUN_ID}/vault_index.json`
  : null

function resolveVaultLink(type, id, vi) {
  if (!vi || vi.export_status !== 'EXPORTED') return null
  let path = null
  if (type === 'artifact') {
    path = vi.artifacts?.[id]
  } else if (type === 'signal') {
    const claimId = vi.signals?.[id]
    if (claimId) path = vi.claims?.[claimId]
  } else if (type === 'claim') {
    path = vi.claims?.[id]
  } else if (type === 'domain' || type === 'zone') {
    path = vi.domain_routing?.fallback
  } else if (type === 'entity') {
    path = vi.entities?.[id]
  }
  if (!path) return null
  return `${vi.base_url}/${path}`
}

// ---------------------------------------------------------------------------
// Badge / meta helpers
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
const TRACE_LABELS = {
  FULLY_TRACEABLE:     'fully traceable',
  PARTIALLY_TRACEABLE: 'partial trace',
  NOT_TRACEABLE:       'not traceable',
}
const SEV_CARD_CLS = {
  HIGH:     'ws-zone-sev-high',
  MODERATE: 'ws-zone-sev-moderate',
}
const EVID_CLS = {
  STRONG:   'ws-conf-strong',
  MODERATE: 'ws-conf-partial',
  PARTIAL:  'ws-conf-partial',
  WEAK:     'ws-conf-weak',
}

// ---------------------------------------------------------------------------
// Shared sub-panels
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
    <div className="ws-result-panel ws-result-panel-why">
      <ProhibitionBadge />

      <div className="ws-finding-primary">
        <div className="ws-finding-badges">
          <span className={`ws-badge ws-badge-lg ${typeCls}`}>{typeLabel}</span>
          <span className={`ws-badge ws-badge-lg ${SEV_CLS[r.severity] || ''}`}>{r.severity}</span>
          <span className={`ws-badge ${CONF_CLS[r.confidence] || ''}`}>{r.confidence}</span>
          {r.traceability && (
            <span className={`ws-badge ws-badge-sm ${TRACE_CLS[r.traceability] || ''}`}>
              {TRACE_LABELS[r.traceability] || r.traceability.replace(/_/g, ' ')}
            </span>
          )}
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
// TRACE result panel
// ---------------------------------------------------------------------------

function PathBlock({ p }) {
  return (
    <div className={`ws-path-block${p.inferred_declaration ? ' ws-path-block-inferred' : ''}`}>
      <div className="ws-path-header">
        <span className="ws-path-id">{p.path_id}</span>
        <span className={`ws-badge ${EVID_CLS[p.evidence_support] || ''}`}>
          {p.evidence_support}
        </span>
      </div>
      <div className={`ws-path-chain ws-path-chain-${(p.path_type || '').toLowerCase()}`}>
        {p.node_chain.map((node, i) => (
          <span key={i} className="ws-path-chain-row">
            {i > 0 && <span className="ws-path-arrow">→</span>}
            <span className="ws-path-node">{node}</span>
          </span>
        ))}
      </div>
      {p.inferred_declaration && (
        <div className="ws-path-inferred">
          <span className="ws-path-inferred-label">INFERRED</span>
          {p.inferred_declaration}
        </div>
      )}
    </div>
  )
}

function TraceResult({ data }) {
  const paths        = data.trace || []
  const forwardPaths = paths.filter(p => p.path_type === 'FORWARD')
  const evidencePaths= paths.filter(p => p.path_type === 'EVIDENCE')

  return (
    <div className="ws-result-panel ws-result-panel-trace">
      <ProhibitionBadge />
      <UnresolvedBlock items={data.uncertainty.unresolved} />

      {paths.length === 0 ? (
        <div className="ws-trace-empty">
          <div className="ws-trace-empty-label">NOT TRACEABLE</div>
          <div className="ws-trace-empty-detail">
            {data.message || 'No propagation paths exist for this zone.'}
          </div>
          <div className="ws-trace-empty-note">
            This zone falls outside the structural propagation model. No structural inference is available.
          </div>
        </div>
      ) : (
        <>
          <div className="ws-trace-summary-row">
            <span className="ws-trace-summary-stat">
              {paths.length} path{paths.length !== 1 ? 's' : ''}
            </span>
            {forwardPaths.length > 0 && (
              <>
                <span className="ws-trace-summary-sep">·</span>
                <span className="ws-trace-summary-type ws-trace-summary-forward">
                  {forwardPaths.length} structural
                </span>
              </>
            )}
            {evidencePaths.length > 0 && (
              <>
                <span className="ws-trace-summary-sep">·</span>
                <span className="ws-trace-summary-type ws-trace-summary-evidence">
                  {evidencePaths.length} evidence
                </span>
              </>
            )}
          </div>

          {forwardPaths.length > 0 && (
            <div className="ws-result-section">
              <div className="ws-result-label ws-trace-group-forward">Structural Paths</div>
              {forwardPaths.map(p => <PathBlock key={p.path_id} p={p} />)}
            </div>
          )}

          {evidencePaths.length > 0 && (
            <div className="ws-result-section">
              <div className="ws-result-label ws-trace-group-evidence">Evidence Paths</div>
              {evidencePaths.map(p => <PathBlock key={p.path_id} p={p} />)}
            </div>
          )}
        </>
      )}

      <MissingBlock items={data.evidence_basis.missing} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Vault links (EVIDENCE results only)
// ---------------------------------------------------------------------------

function VaultLinks({ targets, vaultIndex }) {
  if (!targets || targets.length === 0) return null
  return (
    <div className="ws-result-section ws-vault-section">
      <div className="ws-result-label ws-vault-section-label">
        Evidence Vault
        <span className="ws-vault-section-hint">proof source</span>
      </div>
      <div className="ws-vault-target-list">
        {targets.map(t => {
          const url = resolveVaultLink(t.type, t.id, vaultIndex)
          if (url) {
            return (
              <a
                key={`${t.type}-${t.id}`}
                href={url}
                target="_blank"
                rel="noreferrer"
                className={`ws-vault-link ws-vault-link-${t.type}`}
              >
                <span className="ws-vault-link-type">{t.type}</span>
                <span className="ws-vault-link-id">{t.id}</span>
                <span className="ws-vault-link-label">{t.label}</span>
                <span className="ws-vault-link-arrow">↗</span>
              </a>
            )
          }
          return (
            <div
              key={`${t.type}-${t.id}`}
              className={`ws-vault-link ws-vault-link-${t.type} ws-vault-link-unresolved`}
            >
              <span className="ws-vault-link-type">{t.type}</span>
              <span className="ws-vault-link-id">{t.id}</span>
              <span className="ws-vault-link-label ws-vault-not-exported">NOT EXPORTED</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EVIDENCE result panel
// ---------------------------------------------------------------------------

function EvidenceResult({ data, vaultIndex }) {
  const r = data.result
  return (
    <div className="ws-result-panel ws-result-panel-evidence">
      <ProhibitionBadge />
      <UnresolvedBlock items={data.uncertainty.unresolved} />
      <MissingBlock    items={data.evidence_basis.missing} />

      <div className="ws-result-section">
        <div className="ws-result-label">Signal Coverage</div>
        <div className="ws-ev-summary">
          <div className="ws-ev-stat-block">
            <span className="ws-ev-stat-num">{r.signals_total}</span>
            <span className="ws-ev-stat-unit">signal{r.signals_total !== 1 ? 's' : ''} bound</span>
          </div>
          <div className="ws-ev-stat-sep" />
          <div className="ws-ev-stat-block">
            <span className="ws-ev-stat-num">{r.total_trace_links}</span>
            <span className="ws-ev-stat-unit">trace link{r.total_trace_links !== 1 ? 's' : ''}</span>
          </div>
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
            </div>
            <div className="ws-signal-title">{s.title}</div>
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

      <VaultLinks targets={data.vault_targets} vaultIndex={vaultIndex} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Zone card — investigation trigger, not graph container
// ---------------------------------------------------------------------------

function ZoneCard({ zone, vaultIndex, defaultOpen, isActive, onActivate }) {
  const [expanded, setExpanded] = useState(defaultOpen || false)
  const [qs, setQs]             = useState(null)
  const resultRef               = useRef(null)

  useEffect(() => {
    if (qs?.data && !qs.loading && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [qs])

  async function fireQuery(mode) {
    setQs({ loading: true, mode })
    try {
      const res  = await fetch(`/api/query?zone_id=${zone.zone_id}&mode=${mode}`)
      const data = await res.json()
      if (data.status === 'ok') {
        setQs({ mode, data })
        onActivate(zone, mode, data)
      } else {
        setQs({ mode, error: data.reason || 'QUERY_FAILED' })
      }
    } catch {
      setQs({ mode, error: 'NETWORK_ERROR' })
    }
  }

  const { cls: typeCls, label: typeLabel } = zoneTypeMeta(zone.zone_type)
  const localMode   = (qs?.data && !qs.loading) ? qs.mode : null
  const loadingMode = qs?.loading ? qs.mode : null

  return (
    <div
      className={`ws-zone-card ${SEV_CARD_CLS[zone.severity] || ''}${isActive ? ' ws-zone-card--active' : ''}${!expanded ? ' ws-zone-card--collapsed' : ''}`}
      ref={resultRef}
    >
      <button className="ws-zone-toggle" onClick={() => {
        const next = !expanded
        setExpanded(next)
        if (!next && isActive && !qs?.data) onActivate(null, null, null)
      }}>
        <div className="ws-zone-toggle-left">
          <span className="ws-zone-id">{zone.zone_id}</span>
          <span className={`ws-badge ${SEV_CLS[zone.severity] || ''}`}>{zone.severity}</span>
          <span className={`ws-badge ${typeCls}`}>{typeLabel}</span>
        </div>
        <span className="ws-zone-toggle-title">{zone.domain_name}</span>
        <span className="ws-zone-chevron">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <>
          <div className="ws-zone-overview">
            <div className="ws-zone-condition">
              <span className={`ws-badge ${CONF_CLS[zone.confidence] || ''}`}>{zone.confidence}</span>
              <span className={`ws-badge ${TRACE_CLS[zone.traceability] || ''} ws-badge-sm`}>
                {TRACE_LABELS[zone.traceability] || (zone.traceability ? zone.traceability.replace(/_/g, ' ') : '—')}
              </span>
              <span className="ws-zone-stat">{zone.capability_count} cap{zone.capability_count !== 1 ? 's' : ''}</span>
              <span className="ws-zone-stat">{zone.signal_count} sig{zone.signal_count !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="ws-zone-actions">
            <button
              className={`ws-btn${localMode === 'WHY' ? ' ws-btn-active-why' : ''}`}
              onClick={() => fireQuery('WHY')}
              disabled={!!loadingMode}
            >
              {loadingMode === 'WHY' ? 'WHY…' : 'WHY'}
            </button>
            <button
              className={`ws-btn${localMode === 'EVIDENCE' ? ' ws-btn-active-evidence' : ''}`}
              onClick={() => fireQuery('EVIDENCE')}
              disabled={!!loadingMode}
            >
              {loadingMode === 'EVIDENCE' ? 'EVIDENCE…' : 'EVIDENCE'}
            </button>
            <span className="ws-btn-sep" aria-hidden="true" />
            <button
              className={`ws-btn${localMode === 'TRACE' ? ' ws-btn-active-trace' : ''}`}
              onClick={() => fireQuery('TRACE')}
              disabled={!!loadingMode}
            >
              {loadingMode === 'TRACE' ? 'TRACE…' : 'TRACE'}
            </button>
            {qs?.data && !loadingMode && (
              <button
                className="ws-btn ws-btn-clear"
                onClick={() => { setQs(null); if (isActive) onActivate(null, null, null) }}
              >✕</button>
            )}
          </div>

          {qs?.error && <div className="ws-query-error">{qs.error}</div>}
          {qs?.data && qs.mode === 'WHY'      && <WhyResult      data={qs.data} />}
          {qs?.data && qs.mode === 'EVIDENCE' && <EvidenceResult data={qs.data} vaultIndex={vaultIndex} />}
          {qs?.data && qs.mode === 'TRACE'    && <TraceResult    data={qs.data} />}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Second-client projection config
// ---------------------------------------------------------------------------

const USE_SECOND_CLIENT = true
const _SC_CLIENT_ID     = 'e65d2f0a-dfa7-4257-9333-fcbb583f0880'
const _SC_RUN_ID        = 'run_01_oss_fastapi'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const WS_STATE_KEY = 'ws_state'

const GRAPH_MODE_LABEL = {
  EVIDENCE: 'zone evidence focus',
  TRACE:    'trace paths',
  WHY:      'structural scope',
}

export default function Tier2WorkspacePage() {
  const [pageState, setPageState]       = useState('loading')
  const [zonesData, setZonesData]       = useState(null)
  const [vaultIndex, setVaultIndex]     = useState(null)
  const [activeZone, setActiveZone]     = useState(null)
  const [activeMode, setActiveMode]     = useState(null)
  const [activeQsData, setActiveQsData] = useState(null)

  // Load zones
  useEffect(() => {
    const zonesUrl = USE_SECOND_CLIENT
      ? `/api/zones?client=${_SC_CLIENT_ID}&runId=${_SC_RUN_ID}`
      : '/api/zones'
    fetch(zonesUrl)
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

  // Load vault index
  useEffect(() => {
    if (!VAULT_INDEX_URL) return
    fetch(VAULT_INDEX_URL)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.export_status === 'EXPORTED') setVaultIndex(data) })
      .catch(() => {})
  }, [])

  // Restore workspace state from sessionStorage after zones load
  useEffect(() => {
    if (pageState !== 'ready' || !zonesData) return
    try {
      const saved = sessionStorage.getItem(WS_STATE_KEY)
      if (!saved) return
      const { zoneId, mode, qsData } = JSON.parse(saved)
      const zone = zonesData.zones.find(z => z.zone_id === zoneId)
      if (zone) {
        setActiveZone(zone)
        if (mode)   setActiveMode(mode)
        if (qsData) setActiveQsData(qsData)
      }
    } catch {}
  }, [pageState, zonesData])

  // Persist workspace state to sessionStorage
  useEffect(() => {
    if (!activeZone) return
    try {
      sessionStorage.setItem(WS_STATE_KEY, JSON.stringify({
        zoneId: activeZone.zone_id,
        mode:   activeMode,
        qsData: activeQsData,
      }))
    } catch {}
  }, [activeZone, activeMode, activeQsData])

  function handleActivate(zone, mode, data) {
    setActiveZone(zone)
    setActiveMode(mode)
    setActiveQsData(data)
  }

  function handleReset() {
    setActiveZone(null)
    setActiveMode(null)
    setActiveQsData(null)
    try { sessionStorage.removeItem(WS_STATE_KEY) } catch {}
  }

  // Graph inputs
  const isOverview = !activeZone && !activeMode && !activeQsData
  const graphZone  = activeZone ?? zonesData?.zones?.[0] ?? null
  const graphQs    = (activeMode && activeQsData) ? { mode: activeMode, data: activeQsData } : null
  const graphLabel = activeMode ? (GRAPH_MODE_LABEL[activeMode] ?? '') : 'full vault structure'

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
              <span className="ws-ctx-value ws-ctx-score">
                {zonesData.context.score}
                <span className="ws-ctx-band">{zonesData.context.band}</span>
              </span>
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

          {graphZone && (
            <div className="ws-graph-panel">
              <div className="ws-graph-panel-header">
                <span className="ws-graph-panel-title">VAULT GRAPH — GLOBAL CONTEXT</span>
                {activeZone && (
                  <span className="ws-graph-panel-zone">{activeZone.zone_id}</span>
                )}
                <span className="ws-graph-panel-mode">{graphLabel}</span>
                {activeZone && (
                  <button className="ws-graph-panel-reset" onClick={handleReset}>
                    Overview
                  </button>
                )}
              </div>
              <VaultGraph zone={graphZone} vaultIndex={vaultIndex} qs={graphQs} isOverview={isOverview} />
            </div>
          )}

          <div className="ws-inventory-header">
            <span className="ws-inventory-title">Diagnostic Zones</span>
            <span className="ws-inventory-count">
              {zonesData.total_zones} zone{zonesData.total_zones !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="ws-zone-list">
            {zonesData.zones.map((zone, i) => (
              <ZoneCard
                key={zone.zone_id}
                zone={zone}
                vaultIndex={vaultIndex}
                defaultOpen={
                  zone.severity === 'HIGH' ||
                  (i === 0 && !zonesData.zones.some(z => z.severity === 'HIGH'))
                }
                isActive={activeZone?.zone_id === zone.zone_id}
                onActivate={handleActivate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

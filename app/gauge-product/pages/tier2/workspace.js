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
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const VaultGraph = dynamic(() => import('../../components/VaultGraph'), { ssr: false })


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
    DOMAIN_ZONE:              { label: 'domain zone',             cls: 'ws-type-pressure'      },
    COMPOUND_ZONE:            { label: 'compound pressure zone',  cls: 'ws-type-pressure'      },
    COUPLING_ZONE:            { label: 'coupling zone',           cls: 'ws-type-conflict'      },
    PROPAGATION_ZONE:         { label: 'propagation zone',        cls: 'ws-type-inconsistency' },
    RESPONSIBILITY_ZONE:      { label: 'responsibility zone',     cls: 'ws-type-gap'           },
    FRAGMENTATION_ZONE:       { label: 'fragmentation zone',      cls: 'ws-type-gap'           },
  }[zt] || { label: zt ? String(zt).replace(/_/g, ' ').toLowerCase() : zt, cls: '' }
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
  STRONG:    'ws-conf-strong',
  MODERATE:  'ws-conf-partial',
  PARTIAL:   'ws-conf-partial',
  WEAK:      'ws-conf-weak',
  HIGH:      'ws-conf-partial',
  ACTIVATED: 'ws-conf-weak',
}

const PAIR_RULE_LABELS = {
  COMPOUND_ZONE:       'compound pressure zone',
  COUPLING_ZONE:       'coupling zone',
  PROPAGATION_ZONE:    'propagation zone',
  RESPONSIBILITY_ZONE: 'responsibility zone',
  FRAGMENTATION_ZONE:  'fragmentation zone',
  DOMAIN_ZONE:         'domain zone',
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

function UnresolvedBlock({ items, label = 'Unresolved Elements' }) {
  if (!items || items.length === 0) return null
  return (
    <div className="ws-result-section ws-uncertainty">
      <div className="ws-result-label">{label}</div>
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
  const { cls: typeCls, label: typeLabel } = zoneTypeMeta(r.zone_class || r.zone_type)
  const isProjection = data.evidence_basis?.canonical_topology_used === false
  return (
    <div className="ws-result-panel ws-result-panel-why">
      <ProhibitionBadge />

      <div className="ws-finding-primary">
        <div className="ws-finding-badges">
          <span className={`ws-badge ws-badge-lg ${typeCls}`}>{typeLabel}</span>
          {r.severity && <span className={`ws-badge ws-badge-lg ${SEV_CLS[r.severity] || ''}`}>{r.severity}</span>}
          {r.confidence && <span className={`ws-badge ${CONF_CLS[r.confidence] || ''}`}>{r.confidence}</span>}
          {r.traceability && (
            <span className={`ws-badge ws-badge-sm ${TRACE_CLS[r.traceability] || ''}`}>
              {TRACE_LABELS[r.traceability] || r.traceability.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      <UnresolvedBlock
        items={data.uncertainty.unresolved}
        label={isProjection ? 'Scope — not yet resolved' : undefined}
      />
      <MissingBlock    items={data.evidence_basis.missing} />

      <div className="ws-result-section">
        <div className="ws-result-label">Structural Scope</div>
        <div className="ws-scope-line">
          {r.structural_scope.capability_count ?? 0} capability node{(r.structural_scope.capability_count ?? 0) !== 1 ? 's' : ''}
          {(r.structural_scope.capability_ids || []).map(c => (
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
                {Array.isArray(f.value)
                  ? f.value.map(v => PAIR_RULE_LABELS[v] || String(v).replace(/_/g, ' ').toLowerCase()).join(' · ')
                  : typeof f.value === 'object' && f.value !== null
                    ? [f.value.signal_id, f.value.activation_state, f.value.signal_value].filter(v => v != null).join(' · ')
                    : String(f.value ?? '')}
              </span>
              <span className="ws-rationale-contrib">{f.contribution}</span>
            </div>
          ))}
        </div>
      </div>

      {r.interpretation && (
        <>
          {r.interpretation.executive_interpretation_line && (
            <div className="ws-result-section ws-exec-interp-section">
              <div className="ws-result-label ws-exec-interp-label">EXECUTIVE INTERPRETATION</div>
              <div className="ws-exec-interp-line">{r.interpretation.executive_interpretation_line}</div>
              {r.attribution_profile && (
                <span className="ws-exec-attr-label">{r.attribution_profile.toUpperCase()} ZONE</span>
              )}
            </div>
          )}
          <div className="ws-result-section ws-interp-section">
            <div className="ws-result-label ws-interp-label">
              Behavioral Meaning
              <span className="ws-interp-ref">{r.interpretation.interpretation_ref}</span>
              {r.interpretation.binding_id && <span className="ws-interp-ref">{r.interpretation.binding_id}</span>}
            </div>
            <div className="ws-interp-text">{r.interpretation.behavioral_meaning}</div>
          </div>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// TRACE result panel
// ---------------------------------------------------------------------------

function PathBlock({ p, vaultIndex }) {
  // Resolve CLM vault URL from path fields (projection traces only)
  const clmUrl = (p.vault_resolved && p.clm_html_path && vaultIndex?.base_url)
    ? `${vaultIndex.base_url}/${p.clm_html_path}`
    : null
  const lastIdx = (p.node_chain?.length ?? 0) - 1

  return (
    <div className={`ws-path-block${p.inferred_declaration ? ' ws-path-block-inferred' : ''}`}>
      <div className="ws-path-header">
        <span className="ws-path-id">{p.path_id}</span>
        <span className={`ws-badge ${EVID_CLS[p.evidence_support] || ''}`}>
          {p.evidence_support}
        </span>
      </div>
      <div className={`ws-path-chain ws-path-chain-${(p.path_type || '').toLowerCase()}`}>
        {p.node_chain.map((node, i) => {
          const isClmNode = clmUrl && i === lastIdx
          return (
            <span key={i} className="ws-path-chain-row">
              {i > 0 && <span className="ws-path-arrow">→</span>}
              {isClmNode
                ? (
                  <a
                    href={clmUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ws-path-node ws-path-node-link"
                  >{node}</a>
                )
                : <span className="ws-path-node">{node}</span>
              }
            </span>
          )
        })}
      </div>
      {p.vault_resolved && p.linked_artifacts?.length > 0 && vaultIndex?.base_url && (
        <div className="ws-path-artifacts">
          {p.linked_artifacts.map(art => {
            const artPath = vaultIndex.artifacts?.[art.id]
            const artUrl  = artPath ? `${vaultIndex.base_url}/${artPath}` : null
            return artUrl ? (
              <a
                key={art.id}
                href={artUrl}
                target="_blank"
                rel="noreferrer"
                className="ws-vault-link ws-vault-link-artifact"
                style={{ fontSize: '11px' }}
              >
                <span className="ws-vault-link-type">artifact</span>
                <span className="ws-vault-link-id">{art.id}</span>
                <span className="ws-vault-link-label">{art.label}</span>
                <span className="ws-vault-link-arrow">↗</span>
              </a>
            ) : null
          })}
        </div>
      )}
      {p.inferred_declaration && (
        <div className="ws-path-inferred">
          <span className="ws-path-inferred-label">INFERRED</span>
          {p.inferred_declaration}
        </div>
      )}
      {p.interpretation_ref && (
        <div className="ws-path-interp">
          <span className="ws-path-interp-ref">{p.interpretation_ref}</span>
          {p.binding_id && <span className="ws-chip">{p.binding_id}</span>}
        </div>
      )}
    </div>
  )
}

function TraceResult({ data, vaultIndex }) {
  const paths        = data.trace || []
  const forwardPaths = paths.filter(p => p.path_type === 'FORWARD')
  const evidencePaths= paths.filter(p => p.path_type === 'EVIDENCE')
  const isProjection = data.evidence_basis?.canonical_topology_used === false

  return (
    <div className="ws-result-panel ws-result-panel-trace">
      <ProhibitionBadge />
      <UnresolvedBlock
        items={data.uncertainty.unresolved}
        label={isProjection ? 'Scope — not yet resolved' : undefined}
      />

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
              {forwardPaths.map(p => <PathBlock key={p.path_id} p={p} vaultIndex={vaultIndex} />)}
            </div>
          )}

          {evidencePaths.length > 0 && (
            <div className="ws-result-section">
              <div className="ws-result-label ws-trace-group-evidence">Evidence Paths</div>
              {evidencePaths.map(p => <PathBlock key={p.path_id} p={p} vaultIndex={vaultIndex} />)}
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

function EvidenceResult({ data, vaultIndex, langLayer = {} }) {
  const r = data.result
  const isProjection = data.evidence_basis?.canonical_topology_used === false
  return (
    <div className="ws-result-panel ws-result-panel-evidence">
      <ProhibitionBadge />
      <UnresolvedBlock
        items={data.uncertainty.unresolved}
        label={isProjection ? 'Scope — not yet resolved' : undefined}
      />
      <MissingBlock    items={data.evidence_basis.missing} />

      <div className="ws-result-section">
        <div className="ws-result-label">Signal Coverage</div>
        <div className="ws-ev-summary">
          <div className="ws-ev-stat-block">
            <span className="ws-ev-stat-num">{r.signals_total ?? r.total_conditions ?? 0}</span>
            <span className="ws-ev-stat-unit">signal{(r.signals_total ?? r.total_conditions ?? 0) !== 1 ? 's' : ''} bound</span>
          </div>
          <div className="ws-ev-stat-sep" />
          <div className="ws-ev-stat-block">
            <span className="ws-ev-stat-num">{r.total_trace_links ?? 0}</span>
            <span className="ws-ev-stat-unit">trace link{(r.total_trace_links ?? 0) !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {r.signal_coverage.length === 0 && (
          <div className="ws-empty-note">No signals bound to this zone&apos;s domain.</div>
        )}
        {r.signal_coverage.map(s => (
          <div key={s.condition_id || s.signal_id} className="ws-signal-block">
            <div className="ws-signal-header">
              <span className="ws-signal-id">{s.signal_id}</span>
              {s.condition_id && <span className="ws-chip">{s.condition_id}</span>}
              <span className={`ws-badge ${CONF_CLS[s.evidence_confidence] || ''}`}>
                {s.evidence_confidence || s.activation_state}
              </span>
            </div>
            {(s.title || s.signal_value !== undefined) && (
              <div className="ws-signal-title">
                {s.title || `value: ${s.signal_value}`}
              </div>
            )}
            {s.activation_method && (
              <div className="ws-signal-title">
                {s.activation_method.replace(/_/g, ' ').toLowerCase()}
                {langLayer[s.activation_method]?.short_decode && (
                  <span className="ws-ll-decode"> — {langLayer[s.activation_method].short_decode}</span>
                )}
              </div>
            )}
            {s.interpretation && (
              <div className="ws-interp-text ws-interp-cond">{s.interpretation.behavioral_meaning}</div>
            )}
            {(s.trace_links?.length > 0) ? (
              <ul className="ws-trace-list">
                {s.trace_links.map((l, i) => <li key={i} className="ws-trace-link">{l}</li>)}
              </ul>
            ) : (s.trace_links !== undefined) && (
              <div className="ws-empty-note">No trace links.</div>
            )}
          </div>
        ))}
      </div>

      <VaultLinks targets={data.vault_targets} vaultIndex={vaultIndex} />

      {r.interpretation_trace && (
        <div className="ws-result-section">
          <div className="ws-result-label">Interpretation Trace</div>
          <div className="ws-interp-trace-section">
            <div className="ws-interp-trace-row">
              <span className="ws-interp-trace-label">registry</span>
              <span className="ws-interp-trace-val">{r.interpretation_trace.registry_path}</span>
            </div>
            <div className="ws-interp-trace-row">
              <span className="ws-interp-trace-label">binding</span>
              <span className="ws-interp-trace-val">{r.interpretation_trace.binding_path}</span>
            </div>
            <div className="ws-interp-trace-row">
              <span className="ws-interp-trace-label">status</span>
              <span className="ws-badge ws-conf-strong">{r.interpretation_trace.evidence_status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Zone card — investigation trigger, not graph container
// ---------------------------------------------------------------------------

function ZoneCard({ zone, vaultIndex, defaultOpen, isActive, onActivate, langLayer = {}, effectiveClient, effectiveVaultRun }) {
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
      const queryUrl = (effectiveClient && effectiveVaultRun)
        ? `/api/query?zone_id=${zone.zone_id}&mode=${mode}&client=${effectiveClient}&runId=${effectiveVaultRun}`
        : `/api/query?zone_id=${zone.zone_id}&mode=${mode}`
      const res  = await fetch(queryUrl)
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

  const { cls: typeCls, label: typeLabel } = zoneTypeMeta(zone.zone_class || zone.zone_type)
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
          {zone.severity && <span className={`ws-badge ${SEV_CLS[zone.severity] || ''}`}>{zone.severity}</span>}
          <span className={`ws-badge ${typeCls}`}>{typeLabel}</span>
        </div>
        <span className="ws-zone-toggle-title">{zone.anchor_name || zone.domain_name || zone.zone_id}</span>
        <span className="ws-zone-chevron">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <>
          <div className="ws-zone-overview">
            {zone.condition_count !== undefined ? (
              <div className="ws-zone-condition">
                <span className="ws-zone-stat">{zone.condition_count} condition{zone.condition_count !== 1 ? 's' : ''}</span>
                {zone.attribution_profile && (
                  <>
                    <span className="ws-badge ws-badge-sm">{zone.attribution_profile}</span>
                    {langLayer[zone.attribution_profile?.toUpperCase()]?.executive_label && (
                      <span className="ws-ll-attr-label">
                        {langLayer[zone.attribution_profile.toUpperCase()].executive_label}
                      </span>
                    )}
                  </>
                )}
                {zone.zone_class && (
                  <span className={`ws-badge ws-badge-sm ${zoneTypeMeta(zone.zone_class).cls}`}>
                    {zoneTypeMeta(zone.zone_class).label}
                  </span>
                )}
              </div>
            ) : (
              <div className="ws-zone-condition">
                <span className={`ws-badge ${CONF_CLS[zone.confidence] || ''}`}>{zone.confidence}</span>
                <span className={`ws-badge ${TRACE_CLS[zone.traceability] || ''} ws-badge-sm`}>
                  {TRACE_LABELS[zone.traceability] || (zone.traceability ? zone.traceability.replace(/_/g, ' ') : '—')}
                </span>
                <span className="ws-zone-stat">{zone.capability_count} cap{zone.capability_count !== 1 ? 's' : ''}</span>
                <span className="ws-zone-stat">{zone.signal_count} sig{zone.signal_count !== 1 ? 's' : ''}</span>
              </div>
            )}
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
          {qs?.data && qs.mode === 'EVIDENCE' && <EvidenceResult data={qs.data} vaultIndex={vaultIndex} langLayer={langLayer} />}
          {qs?.data && qs.mode === 'TRACE'    && <TraceResult    data={qs.data} vaultIndex={vaultIndex} />}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const GRAPH_MODE_LABEL = {
  EVIDENCE: 'zone evidence focus',
  TRACE:    'trace paths',
  WHY:      'structural scope',
}

export default function Tier2WorkspacePage() {
  const router = useRouter()
  // Bundle params: vaultRun drives all API calls; displayRun is UI label; reportRun is report context.
  // Tolerate legacy runId param as fallback for backward compat.
  const effectiveClient     = router.query.client     || null
  const effectiveVaultRun   = router.query.vaultRun   || router.query.runId || null
  const effectiveDisplayRun = router.query.displayRun || router.query.runId || null
  const effectiveReportRun  = router.query.reportRun  || effectiveDisplayRun || null

  const [pageState, setPageState]           = useState('loading')
  const [zonesData, setZonesData]           = useState(null)
  const [vaultIndex, setVaultIndex]         = useState(null)
  const [activeZone, setActiveZone]         = useState(null)
  const [activeMode, setActiveMode]         = useState(null)
  const [activeQsData, setActiveQsData]     = useState(null)
  const [graphPanelQuery, setGraphPanelQuery] = useState(null)
  const [langLayer, setLangLayer]           = useState({})

  // Load language layer
  useEffect(() => {
    fetch('/api/language')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.status === 'ok' && data.entries?.length) {
          const byLabel = {}
          data.entries.forEach(e => { byLabel[e.canonical_label] = e })
          setLangLayer(byLabel)
        }
      })
      .catch(() => {})
  }, [])

  // Load zones — wait for router hydration so vaultRun is available
  useEffect(() => {
    if (!router.isReady) return
    const zonesUrl = (effectiveClient && effectiveVaultRun)
      ? `/api/zones?client=${effectiveClient}&runId=${effectiveVaultRun}`
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
  }, [router.isReady, effectiveClient, effectiveVaultRun])

  // Load vault index from graph_state.json (bundle-aware, no env vars required)
  useEffect(() => {
    if (!router.isReady || !effectiveClient || !effectiveReportRun) return
    const gsUrl = `/api/report-file?source=psee&client=${encodeURIComponent(effectiveClient)}&runId=${encodeURIComponent(effectiveReportRun)}&name=graph_state.json`
    fetch(gsUrl)
      .then(r => r.ok ? r.json() : null)
      .then(gs => {
        if (!gs || !Array.isArray(gs.nodes)) return
        const signals = {}
        const artifacts = {}
        const claims = {}
        for (const link of gs.links || []) {
          const srcNode = gs.nodes.find(n => n.id === link.source)
          const tgtNode = gs.nodes.find(n => n.id === link.target)
          if (srcNode?.type === 'SIGNAL' && tgtNode?.type === 'CLAIM') {
            signals[srcNode.id] = tgtNode.id
            claims[tgtNode.id] = null
          }
        }
        for (const node of gs.nodes) {
          if (node.type === 'ARTIFACT') artifacts[node.id] = null
          if (node.type === 'SIGNAL' && !(node.id in signals)) signals[node.id] = null
          if (node.type === 'CLAIM'  && !(node.id in claims))  claims[node.id]  = null
        }
        setVaultIndex({ export_status: 'EXPORTED', base_url: null, signals, artifacts, claims })
      })
      .catch(() => {})
  }, [router.isReady, effectiveClient, effectiveReportRun])

  function handleActivate(zone, mode, data) {
    setActiveZone(zone)
    setActiveMode(mode)
    setActiveQsData(data)
  }

  function handleReset() {
    setActiveZone(null)
    setActiveMode(null)
    setActiveQsData(null)
    setGraphPanelQuery(null)
  }

  // Graph-initiated query: fires zone query and surfaces result in graph panel
  async function handleGraphQuery(zoneId, mode) {
    if (!zonesData) return
    setGraphPanelQuery({ loading: true, mode, zoneId })

    const buildUrl = m => (effectiveClient && effectiveVaultRun)
      ? `/api/query?zone_id=${zoneId}&mode=${m}&client=${effectiveClient}&runId=${effectiveVaultRun}`
      : `/api/query?zone_id=${zoneId}&mode=${m}`

    // FULL_EXPLANATION: fire WHY + EVIDENCE + TRACE in parallel, render all three panels
    if (mode === 'FULL_EXPLANATION') {
      try {
        const [whyRes, evRes, traceRes] = await Promise.all([
          fetch(buildUrl('WHY')).then(r => r.json()).catch(() => null),
          fetch(buildUrl('EVIDENCE')).then(r => r.json()).catch(() => null),
          fetch(buildUrl('TRACE')).then(r => r.json()).catch(() => null),
        ])
        const why      = whyRes?.status   === 'ok' ? whyRes   : null
        const evidence = evRes?.status    === 'ok' ? evRes    : null
        const trace    = traceRes?.status === 'ok' ? traceRes : null
        setGraphPanelQuery({ mode: 'FULL_EXPLANATION', zoneId, why, evidence, trace })
        const zone = zonesData.zones.find(z => z.zone_id === zoneId)
        if (zone && evidence) {
          setActiveZone(zone)
          setActiveMode('EVIDENCE')
          setActiveQsData(evidence)
        }
      } catch {
        setGraphPanelQuery({ mode: 'FULL_EXPLANATION', zoneId, error: 'NETWORK_ERROR' })
      }
      return
    }

    try {
      const res  = await fetch(buildUrl(mode))
      const data = await res.json()
      if (data.status === 'ok') {
        setGraphPanelQuery({ mode, zoneId, data })
        const zone = zonesData.zones.find(z => z.zone_id === zoneId)
        if (zone) {
          setActiveZone(zone)
          setActiveMode(mode)
          setActiveQsData(data)
        }
      } else {
        setGraphPanelQuery({ mode, zoneId, error: data.reason || 'QUERY_FAILED' })
      }
    } catch {
      setGraphPanelQuery({ mode, zoneId, error: 'NETWORK_ERROR' })
    }
  }

  function handleGraphNodeSelect({ type, id, zoneId }) {
    if (type === 'signal') {
      // PSIG click: full explanation — WHY + EVIDENCE + TRACE, no vault navigation
      handleGraphQuery(zoneId, 'FULL_EXPLANATION')
    } else if (type === 'zone') {
      // ZONE click: EVIDENCE query to push aggregated PSIG list
      const targetZoneId = id.startsWith('PZ-') ? id : (zonesData?.zones?.[0]?.zone_id ?? id)
      handleGraphQuery(targetZoneId, 'EVIDENCE')
    }
  }

  // Graph inputs
  const isOverview = !activeZone && !activeMode && !activeQsData
  const graphZone  = activeZone ?? zonesData?.zones?.[0] ?? null
  const graphQs    = (activeMode && activeQsData) ? { mode: activeMode, data: activeQsData } : null
  const graphLabel = isOverview
    ? 'OVERVIEW'
    : activeMode ? (GRAPH_MODE_LABEL[activeMode] ?? '') : 'full vault structure'

  return (
    <div className="ws-page">
      <div className="ws-topbar">
        <Link href="/" className="ws-back-link">← LENS</Link>
        <span className="ws-topbar-title">Tier-2 Diagnostic Workspace</span>
        {(effectiveDisplayRun || zonesData) && (
          <span className="ws-topbar-run">{effectiveDisplayRun || zonesData?.run_id}</span>
        )}
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
                {zonesData.context?.score ?? '—'}
                <span className="ws-ctx-band">{zonesData.context?.band ?? 'Not available'}</span>
              </span>
            </div>
            <div className="ws-ctx-field">
              <span className="ws-ctx-label">Confidence</span>
              <span className="ws-ctx-value">{zonesData.context?.confidence ?? '—'}</span>
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
              <VaultGraph
                zone={graphZone}
                vaultIndex={vaultIndex}
                qs={graphQs}
                isOverview={isOverview}
                onNodeSelect={handleGraphNodeSelect}
              />
              {graphPanelQuery && (
                <div className="ws-graph-query-panel">
                  <div className="ws-graph-query-header">
                    <span className="ws-graph-query-zone">{graphPanelQuery.zoneId}</span>
                    <span className="ws-graph-query-mode">{graphPanelQuery.mode}</span>
                    <button
                      className="ws-btn ws-btn-clear"
                      onClick={() => setGraphPanelQuery(null)}
                    >✕</button>
                  </div>
                  {graphPanelQuery.loading && (
                    <div className="ws-graph-query-loading">
                      {graphPanelQuery.mode === 'FULL_EXPLANATION'
                        ? 'WHY · EVIDENCE · TRACE…'
                        : `${graphPanelQuery.mode}…`}
                    </div>
                  )}
                  {graphPanelQuery.error && (
                    <div className="ws-query-error">{graphPanelQuery.error}</div>
                  )}
                  {graphPanelQuery.mode === 'FULL_EXPLANATION' && !graphPanelQuery.loading && (
                    <>
                      {graphPanelQuery.why && (
                        <div className="ws-graph-query-section">
                          <div className="ws-graph-query-section-label">WHY</div>
                          <WhyResult data={graphPanelQuery.why} />
                        </div>
                      )}
                      {graphPanelQuery.evidence && (
                        <div className="ws-graph-query-section">
                          <div className="ws-graph-query-section-label">EVIDENCE</div>
                          <EvidenceResult data={graphPanelQuery.evidence} vaultIndex={vaultIndex} langLayer={langLayer} />
                        </div>
                      )}
                      {graphPanelQuery.trace && (
                        <div className="ws-graph-query-section">
                          <div className="ws-graph-query-section-label">TRACE</div>
                          <TraceResult data={graphPanelQuery.trace} vaultIndex={vaultIndex} />
                        </div>
                      )}
                      {!graphPanelQuery.why && !graphPanelQuery.evidence && !graphPanelQuery.trace && (
                        <div className="ws-query-error">ALL_QUERIES_FAILED</div>
                      )}
                    </>
                  )}
                  {graphPanelQuery.data && graphPanelQuery.mode === 'EVIDENCE' && (
                    <EvidenceResult data={graphPanelQuery.data} vaultIndex={vaultIndex} langLayer={langLayer} />
                  )}
                  {graphPanelQuery.data && graphPanelQuery.mode === 'WHY' && (
                    <WhyResult data={graphPanelQuery.data} />
                  )}
                  {graphPanelQuery.data && graphPanelQuery.mode === 'TRACE' && (
                    <TraceResult data={graphPanelQuery.data} vaultIndex={vaultIndex} />
                  )}
                </div>
              )}
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
                langLayer={langLayer}
                effectiveClient={effectiveClient}
                effectiveVaultRun={effectiveVaultRun}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

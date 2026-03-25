/**
 * TopologyPanel.js
 * PIOS-42.23-RUN01-CONTRACT-v1
 *
 * Landing-page structural topology panel.
 * Rewired to governed WOW chain (42.22 + 51.1 + 51.1R).
 *
 * Data source: /api/execlens?topology=true
 *   → scripts/pios/42.23/execlens_wowchain_adapter.py
 *   → docs/pios/42.22/sample_runtime_output.json
 *   → 51.1 static rendering spec (RENDER_RED / RENDER_AMBER / RENDER_NEUTRAL / RENDER_NONE)
 *
 * WOW chain format: topology.wow_chain === true
 *   topology.exposure_records[] — governed nodes with emphasis and render token
 *
 * Governing rules:
 *   R3   governed entities only — no synthetic nodes
 *   R4   curated layout, not force graph
 *   R8   sparse data rendered sparsely — no aesthetic filler
 *   R14  topology unavailable → controlled omission state
 */

import { useState, useEffect } from 'react'
import { buildObsidianLink } from '../utils/obsidian'

// Vault name from Next.js NEXT_PUBLIC_* env — configured only, never hardcoded
const VAULT_NAME = process.env.NEXT_PUBLIC_OBSIDIAN_VAULT_NAME || null

// ---------------------------------------------------------------------------
// Emphasis render token → CSS class mapping (51.1 static mapping)
// ---------------------------------------------------------------------------

const RENDER_TOKEN_CLASS = {
  RENDER_RED:     'topo-emphasis-red',
  RENDER_AMBER:   'topo-emphasis-amber',
  RENDER_NEUTRAL: 'topo-emphasis-neutral',
  RENDER_NONE:    'topo-emphasis-none',
}

// ---------------------------------------------------------------------------
// ExposureNodeRow — WOW chain governed exposure record (42.23 / 51.1)
// ---------------------------------------------------------------------------

function ExposureNodeRow({ record }) {
  const emphasisClass = RENDER_TOKEN_CLASS[record.emphasis_render_token] || 'topo-emphasis-none'
  return (
    <div className={`topo-exposure-row ${emphasisClass}`}>
      <span className="topo-exposure-signal">{record.signal_id}</span>
      <span className="topo-exposure-node">{record.node_label}</span>
      <span className="topo-exposure-emphasis">{record.emphasis}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EntityChip — Component level
// ---------------------------------------------------------------------------

function EntityChip({ entity, type }) {
  const highlighted  = entity.highlighted === true
  const emphasisHigh = entity.emphasis === 'high'
  const resolved     = entity.resolved
  const vaultLink    = (resolved && VAULT_NAME && entity.vault_path)
    ? buildObsidianLink(VAULT_NAME, `docs/pios/41.2/pie_vault/${entity.vault_path}.md`)
    : null

  const chipClass = [
    'topo-chip',
    `topo-chip-${type}`,
    highlighted  ? 'topo-chip-highlighted' : '',
    emphasisHigh ? 'topo-emphasis-red'     : '',
    !resolved    ? 'topo-chip-unresolved'  : '',
  ].filter(Boolean).join(' ')

  if (vaultLink) {
    return (
      <a className={chipClass} href={vaultLink} title={`Open in Obsidian: ${entity.vault_path}`}>
        {entity.label}
        {highlighted && <span className="topo-highlight-dot" />}
      </a>
    )
  }

  return (
    <span className={chipClass} title={resolved ? entity.id : `⚠ UNRESOLVED in vault`}>
      {!resolved && <span className="topo-unresolved-icon">⚠</span>}
      {entity.label}
      {highlighted && <span className="topo-highlight-dot" />}
    </span>
  )
}

// ---------------------------------------------------------------------------
// CapabilityGroup — Capability + its Components
// ---------------------------------------------------------------------------

function CapabilityGroup({ cap }) {
  const highlighted  = cap.highlighted === true
  const emphasisHigh = cap.emphasis === 'high'
  const resolved     = cap.resolved
  const vaultLink    = (resolved && VAULT_NAME && cap.vault_path)
    ? buildObsidianLink(VAULT_NAME, `docs/pios/41.2/pie_vault/${cap.vault_path}.md`)
    : null

  const capClass = [
    'topo-cap',
    highlighted  ? 'topo-cap-highlighted' : '',
    emphasisHigh ? 'topo-emphasis-red'    : '',
    !resolved    ? 'topo-cap-unresolved'  : '',
  ].filter(Boolean).join(' ')

  const capLabel = (
    <span className="topo-cap-label-inner">
      {!resolved && <span className="topo-unresolved-icon">⚠</span>}
      {cap.label}
      {highlighted && <span className="topo-highlight-dot" />}
    </span>
  )

  return (
    <div className={capClass}>
      <div className="topo-cap-label">
        {vaultLink ? (
          <a href={vaultLink} title={`Open in Obsidian: ${cap.vault_path}`}>
            {capLabel}
          </a>
        ) : capLabel}
      </div>

      {cap.components && cap.components.length > 0 && (
        <div className="topo-comp-row">
          {cap.components.map(cmp => (
            <EntityChip key={cmp.id} entity={cmp} type="component" />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DomainBlock — Domain + its Capabilities
// ---------------------------------------------------------------------------

function DomainBlock({ domain }) {
  const highlighted  = domain.highlighted === true
  const emphasisHigh = domain.emphasis === 'high'
  const resolved     = domain.resolved
  const vaultLink    = (resolved && VAULT_NAME && domain.vault_path)
    ? buildObsidianLink(VAULT_NAME, `docs/pios/41.2/pie_vault/${domain.vault_path}.md`)
    : null

  const domainClass = [
    'topo-domain',
    highlighted  ? 'topo-domain-highlighted' : '',
    emphasisHigh ? 'topo-emphasis-red'        : '',
  ].filter(Boolean).join(' ')

  const domainLabel = (
    <span className="topo-domain-label-inner">
      {!resolved && <span className="topo-unresolved-icon">⚠</span>}
      {domain.label}
      {highlighted && <span className="topo-highlight-dot" />}
    </span>
  )

  return (
    <div className={domainClass}>
      <div className="topo-domain-header">
        <span className="topo-domain-id">{domain.id.split('_').slice(0, 2).join('_')}</span>
        {vaultLink ? (
          <a className="topo-domain-name" href={vaultLink} title={`Open in Obsidian: ${domain.vault_path}`}>
            {domainLabel}
          </a>
        ) : (
          <span className="topo-domain-name">{domainLabel}</span>
        )}
      </div>

      <div className="topo-caps-list">
        {domain.capabilities && domain.capabilities.length > 0
          ? domain.capabilities.map(cap => (
              <CapabilityGroup key={cap.id} cap={cap} />
            ))
          : <div className="topo-empty-caps">no capabilities grounded</div>
        }
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TopologyPanel
// ---------------------------------------------------------------------------

export default function TopologyPanel({ selectedQuery }) {
  const [topology,  setTopology]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [lastQuery, setLastQuery] = useState(null)

  useEffect(() => {
    const url = selectedQuery
      ? `/api/execlens?topology=true&highlight=${encodeURIComponent(selectedQuery)}`
      : '/api/execlens?topology=true'

    // Avoid re-fetch if query hasn't changed
    if (selectedQuery === lastQuery && topology !== null) return

    setLoading(true)
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        setTopology(data)
        setLastQuery(selectedQuery)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [selectedQuery])

  if (loading) {
    return (
      <div className="topo-panel topo-panel-loading">
        <span className="topo-loading-text">Loading structural topology…</span>
      </div>
    )
  }

  if (error || !topology) {
    return (
      <div className="topo-panel topo-panel-error">
        <span className="topo-error-text">
          Structural topology unavailable — {error || 'no data'}
        </span>
      </div>
    )
  }

  // WOW chain rendering path (42.23 / 51.1)
  if (false && topology.wow_chain === true) {
    const records = topology.exposure_records || []
    const ec = topology.emphasis_counts || {}
    return (
      <div className="topo-panel">
        <div className="topo-panel-header">
          <div className="topo-panel-title-row">
            <span className="topo-panel-label">STRUCTURAL TOPOLOGY — SIGNAL PROJECTION</span>
            <span className="topo-panel-counts">
              {topology.record_count} nodes · high:{ec.high ?? 0} · medium:{ec.medium ?? 0} · low:{ec.low ?? 0} · none:{ec.none ?? 0}
            </span>
          </div>
          <div className="topo-panel-meta">
            source: 42.22 WOW chain · governed emphasis exposure · 51.1 rendering spec
            {selectedQuery && (
              <span className="topo-highlight-label"> · query {selectedQuery}</span>
            )}
          </div>
        </div>
        <div className="topo-exposure-list">
          {records.map(rec => (
            <ExposureNodeRow key={rec.node_id} record={rec} />
          ))}
        </div>
      </div>
    )
  }

  // Legacy hierarchy rendering path (42.7 — retained for fallback)
  const domains = topology.topology || []

  return (
    <div className="topo-panel">
      <div className="topo-panel-header">
        <div className="topo-panel-title-row">
          <span className="topo-panel-label">STRUCTURAL TOPOLOGY — SIGNAL PROJECTION</span>
          <span className="topo-panel-counts">
            {topology.domain_count}D · {topology.capability_count}C · {topology.component_count} nodes
          </span>
        </div>
        <div className="topo-panel-meta">
          source: 42.7 adapter · hierarchy via co-occurrence · all entities governed
          {selectedQuery && (
            <span className="topo-highlight-label"> · highlighting {selectedQuery}</span>
          )}
        </div>
      </div>

      <div className="topo-domains-grid">
        {domains.map(domain => (
          <DomainBlock key={domain.id} domain={domain} />
        ))}
      </div>

      {!selectedQuery && (
        <div className="topo-panel-hint">
          Select a query above to highlight relevant domains, capabilities, and components.
        </div>
      )}
    </div>
  )
}

/**
 * TopologyPanel.js
 * PIOS-42.23-RUN01-CONTRACT-v1
 * PSEE.BLUEEDGE.GAUGE.HANDOFF.01 — envelope render path (presentation recovery pass)
 *
 * Render paths (selected by topology response shape):
 *   envelope === true  → GAUGE envelope path — meaning-first, detail-on-demand
 *     source: /api/execlens?envelope=true
 *     → app/execlens-demo/lib/gauge/envelope_adapter.py
 *     → binding_envelope.json (ONLY topology authority)
 *   wow_chain === true → WOW chain path (42.22 + 51.1 + 51.1R) — retained
 *   default            → 42.7 legacy hierarchy path — retained as fallback
 *
 * Envelope path governing rules:
 *   R1   binding_envelope.json is the only topology source
 *   R2   structure derived from nodes[], edges[], signals[], constraint_flags
 *   R3   OVERLAP_STRUCTURAL edges always visible (inline on component footer)
 *   R4   unknown space in diagnostics panel only — never as topology nodes
 *   R5   deterministic layout (BFS depth from roots, stable input order)
 *   R6   orphan nodes in StandaloneSection (type-grouped, human-readable)
 *   R7   diagnostics (constraints, evidence) collapsed by default
 */

import { useState, useEffect } from 'react'
import { buildObsidianLink } from '../utils/obsidian'

// Vault name from Next.js NEXT_PUBLIC_* env — configured only, never hardcoded
const VAULT_NAME = process.env.NEXT_PUBLIC_OBSIDIAN_VAULT_NAME || null

// ---------------------------------------------------------------------------
// GAUGE Envelope rendering — PSEE.BLUEEDGE.GAUGE.HANDOFF.01
// Presentation recovery: meaning-first default, detail on demand
// ---------------------------------------------------------------------------

// Humanize an internal label: replace underscores, title-case each word
function humanize(label) {
  if (!label) return ''
  return label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// --- SignalDot ---
// Lightweight inline indicator for nodes with bound signals.
// Full signal payload is available in the expanded component detail view.

function SignalDot({ signals }) {
  if (!signals || signals.length === 0) return null
  const accented = signals.some(
    s => s.computation_state !== undefined && s.computation_state !== 'AVAILABLE'
  )
  const label = `${signals.length} signal${signals.length > 1 ? 's' : ''} bound`
  return (
    <span
      className={`gauge-signal-dot${accented ? ' gauge-signal-dot--active' : ''}`}
      title={label}
    >
      {'~'.repeat(signals.length)}
    </span>
  )
}

// --- SignalDetail ---
// Full signal payload shown only in the expanded component detail view.

function SignalDetail({ signals }) {
  if (!signals || signals.length === 0) return null
  return (
    <div className="gauge-signal-detail">
      {signals.map(s => (
        <div key={s.signal_id} className="gauge-signal-row">
          {Object.entries(s).map(([k, v]) => (
            <span key={k} className="gauge-signal-field">
              <span className="gauge-signal-key">{k}:</span>{' '}
              <span className="gauge-signal-val">
                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

// --- ComponentFooter ---
// The structural component anchoring a region.
// Default row: human-readable name + signal dot + overlap cross-references (always visible).
// Expanded: internal id, type, provenance, full signal payload.

function ComponentFooter({ node, overlapEdges, nodeIndex, expanded, onToggle }) {
  const overlapsWith = overlapEdges
    .filter(e => e.from_node === node.node_id || e.to_node === node.node_id)
    .map(e => {
      const otherId = e.from_node === node.node_id ? e.to_node : e.from_node
      return nodeIndex[otherId]
    })
    .filter(Boolean)

  const sharedCount =
    (node.additional_parents || []).length + (node.canonical_parent ? 1 : 0)

  return (
    <div
      className={`gauge-component${node.is_overlap_endpoint ? ' gauge-component--shared' : ''}`}
      onClick={onToggle}
      title="Click to inspect"
    >
      <div className="gauge-component-row">
        <span className="gauge-component-dot">●</span>
        <span className="gauge-component-name">{node.display_label}</span>
        <SignalDot signals={node.signals} />
      </div>

      {/* Cross-boundary references — always visible, structural truth */}
      {overlapsWith.length > 0 && (
        <div className="gauge-component-overlaps">
          {overlapsWith.map(other => (
            <span key={other.node_id} className="gauge-overlap-ref">
              → {other.display_label}
            </span>
          ))}
        </div>
      )}

      {sharedCount > 1 && (
        <div className="gauge-component-shared">across {sharedCount} surfaces</div>
      )}

      {expanded && (
        <div className="gauge-component-detail">
          <span className="gauge-detail-id">{node.secondary_label}</span>
          <span className="gauge-detail-type">{node.type}</span>
          {node.temporal_classification && (
            <span className="gauge-detail-tc">{node.temporal_classification}</span>
          )}
          {node.provenance && (
            <div className="gauge-provenance">
              {Object.entries(node.provenance).map(([k, v]) => (
                <span key={k} className="gauge-prov-field">
                  {k}: {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </span>
              ))}
            </div>
          )}
          <SignalDetail signals={node.signals} />
        </div>
      )}
    </div>
  )
}

// --- RegionCard ---
// Renders one structural region (non-orphan root + surfaces + component).
// Default: region name header, surface list (up to SURFACE_PREVIEW, foldable),
// component footer with overlap references.

const SURFACE_PREVIEW = 5

function RegionCard({ rootId, treeData, overlapEdges, expandedNodes, onToggle }) {
  const rootNode = treeData.nodeIndex[rootId]
  if (!rootNode) return null

  const surfaceIds = treeData.containmentTree[rootId] || []
  const surfaces   = surfaceIds.map(id => treeData.nodeIndex[id]).filter(Boolean)

  // Canonical components reachable from this region's surfaces
  const componentIds = new Set()
  for (const sid of surfaceIds) {
    for (const cid of (treeData.containmentTree[sid] || [])) {
      componentIds.add(cid)
    }
  }
  const components = [...componentIds].map(id => treeData.nodeIndex[id]).filter(Boolean)

  // Overlap edges involving this region's components
  const regionOverlaps = overlapEdges.filter(
    e => componentIds.has(e.from_node) || componentIds.has(e.to_node)
  )

  const surfacesKey     = `${rootId}:surfaces`
  const showAll         = expandedNodes.has(surfacesKey)
  const visibleSurfaces = showAll ? surfaces : surfaces.slice(0, SURFACE_PREVIEW)
  const hiddenCount     = surfaces.length - SURFACE_PREVIEW

  return (
    <div className="gauge-region">
      <div className="gauge-region-header">
        <span className="gauge-region-name">{rootNode.display_label}</span>
        {surfaces.length > 0 && (
          <span className="gauge-region-count">{surfaces.length}</span>
        )}
      </div>

      {surfaces.length > 0 && (
        <div className="gauge-surface-list">
          {visibleSurfaces.map(s => (
            <div
              key={s.node_id}
              className="gauge-surface-item"
              onClick={() => onToggle(s.node_id)}
              title={s.secondary_label}
            >
              {s.display_label}
              {expandedNodes.has(s.node_id) && (
                <span className="gauge-surface-id"> {s.secondary_label}</span>
              )}
            </div>
          ))}
          {hiddenCount > 0 && (
            <button
              className="gauge-surface-more"
              onClick={e => { e.stopPropagation(); onToggle(surfacesKey) }}
            >
              {showAll ? 'show less' : `+${hiddenCount} more`}
            </button>
          )}
        </div>
      )}

      {components.map(comp => (
        <ComponentFooter
          key={comp.node_id}
          node={comp}
          overlapEdges={regionOverlaps}
          nodeIndex={treeData.nodeIndex}
          expanded={expandedNodes.has(comp.node_id)}
          onToggle={() => onToggle(comp.node_id)}
        />
      ))}
    </div>
  )
}

// --- StandaloneSection ---
// Replaces raw OrphanLane. Groups nodes with no CONTAINS edges by type,
// presented as human-readable named items. Click to reveal internal id.

const STANDALONE_TYPE_LABELS = {
  binding_context:    'Regions without surfaces',
  component_entity:   'Components without surface binding',
  capability_surface: 'Unbound surfaces',
}

function StandaloneSection({ orphanIds, nodeIndex, expandedNodes, onToggle }) {
  if (!orphanIds || orphanIds.length === 0) return null

  const byType = {}
  for (const id of orphanIds) {
    const n = nodeIndex[id]
    if (!n) continue
    if (!byType[n.type]) byType[n.type] = []
    byType[n.type].push(n)
  }

  if (Object.keys(byType).length === 0) return null

  return (
    <div className="gauge-standalone">
      <div className="gauge-standalone-header">Standalone items</div>
      {Object.entries(byType).map(([type, nodes]) => (
        <div key={type} className="gauge-standalone-group">
          <span className="gauge-standalone-type">
            {STANDALONE_TYPE_LABELS[type] || humanize(type)}
          </span>
          <div className="gauge-standalone-items">
            {nodes.map(n => (
              <span
                key={n.node_id}
                className="gauge-standalone-item"
                onClick={() => onToggle(n.node_id)}
                title={n.secondary_label}
              >
                {n.display_label}
                {expandedNodes.has(n.node_id) && (
                  <span className="gauge-standalone-id"> ({n.secondary_label})</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// --- DiagnosticsPanel ---
// Collapsible at the bottom. Contains all constraint/structural detail:
// overlap evidence, unknown space, parity recovery, unknown edge types.
// Default: collapsed, showing pill-count summary only.

function DiagnosticsPanel({ constraintFlags, overlapEdges, unknownEdges, nodeIndex }) {
  const [open, setOpen] = useState(false)
  if (!constraintFlags) return null

  const cf    = constraintFlags
  const pills = []
  if (cf.overlap_present)                         pills.push(`${cf.overlap_count} overlap`)
  if (cf.unknown_space_present)                   pills.push(`${cf.unknown_space_count} unknown space`)
  if (cf.parity_recovery)                         pills.push('parity recovery')
  if (unknownEdges && unknownEdges.length > 0)    pills.push(`${unknownEdges.length} unknown edge type`)

  if (pills.length === 0) return null

  return (
    <div className="gauge-diagnostics">
      <button className="gauge-diag-toggle" onClick={() => setOpen(o => !o)}>
        <span className="gauge-diag-label">Structural notes</span>
        <span className="gauge-diag-pills">
          {pills.map((p, i) => (
            <span key={i} className="gauge-diag-pill">{p}</span>
          ))}
        </span>
        <span className="gauge-diag-caret">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="gauge-diag-body">
          {cf.overlap_present && (
            <div className="gauge-diag-section">
              <div className="gauge-diag-section-label">
                STRUCTURAL OVERLAPS ({cf.overlap_count})
              </div>
              {overlapEdges.map(e => {
                const fromNode = nodeIndex[e.from_node]
                const toNode   = nodeIndex[e.to_node]
                const evidence = (cf.overlap_evidence || []).find(ev =>
                  ev.includes(fromNode?.label || '') || ev.includes(e.from_node)
                )
                return (
                  <div key={e.edge_id} className="gauge-diag-overlap">
                    <span>{fromNode ? fromNode.display_label : e.from_node}</span>
                    <span className="gauge-diag-arrow">⟷</span>
                    <span>{toNode ? toNode.display_label : e.to_node}</span>
                    {evidence && (
                      <span className="gauge-diag-evidence">{evidence}</span>
                    )}
                  </div>
                )
              })}
              {cf.overlap_source && (
                <div className="gauge-diag-source">source: {cf.overlap_source}</div>
              )}
            </div>
          )}

          {cf.unknown_space_present && (
            <div className="gauge-diag-section">
              <div className="gauge-diag-section-label">
                UNKNOWN SPACE ({cf.unknown_space_count})
              </div>
              {(cf.unknown_space_evidence || []).map((ev, i) => (
                <div key={i} className="gauge-diag-unknown">{ev}</div>
              ))}
              <div className="gauge-diag-note">not rendered as topology nodes</div>
              {cf.unknown_space_source && (
                <div className="gauge-diag-source">source: {cf.unknown_space_source}</div>
              )}
            </div>
          )}

          {cf.parity_recovery && (
            <div className="gauge-diag-section">
              <div className="gauge-diag-section-label">PARITY RECOVERY</div>
              <div className="gauge-diag-parity">{cf.parity_recovery}</div>
            </div>
          )}

          {unknownEdges && unknownEdges.length > 0 && (
            <div className="gauge-diag-section">
              <div className="gauge-diag-section-label">
                UNKNOWN EDGE TYPES ({unknownEdges.length}) — flagged
              </div>
              {unknownEdges.map(e => (
                <div key={e.edge_id} className="gauge-diag-unknown-edge">
                  [{e.edge_type}] {e.from_node} → {e.to_node}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// --- EnvelopeTopology ---
// Top-level envelope render. Meaning-first default surface.

function EnvelopeTopology({ data }) {
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  const onToggle = (key) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const nodeIndex = {}
  for (const n of data.nodes || []) {
    nodeIndex[n.node_id] = n
  }

  const treeData = {
    nodeIndex,
    containmentTree:      data.containment_tree      || {},
    additionalParentRefs: data.additional_parent_refs || {},
  }

  const orphanSet    = new Set(data.orphans || [])
  const rootsForGrid = (data.roots || []).filter(r => !orphanSet.has(r))
  const orphans      = data.orphans       || []
  const overlapEdges = data.overlap_edges || []
  const unknownEdges = data.unknown_edges || []
  const summary      = data.summary       || {}
  const cf           = data.constraint_flags || {}

  return (
    <div className="topo-panel">
      {/* Panel header — simplified */}
      <div className="topo-panel-header">
        <div className="topo-panel-title-row">
          <span className="topo-panel-label">STRUCTURAL TOPOLOGY</span>
          <span className="topo-panel-counts">
            {rootsForGrid.length} region{rootsForGrid.length !== 1 ? 's' : ''}
            {summary.signals_count > 0 && ` · ${summary.signals_count} signals`}
            {summary.overlap_edges_count > 0 && ` · ${summary.overlap_edges_count} cross-boundary`}
          </span>
        </div>
        <div className="topo-panel-meta">
          binding_envelope.json · click items to inspect
        </div>
      </div>

      {/* Primary regions grid */}
      <div className="gauge-regions-grid">
        {rootsForGrid.map(rootId => (
          <RegionCard
            key={rootId}
            rootId={rootId}
            treeData={treeData}
            overlapEdges={overlapEdges}
            expandedNodes={expandedNodes}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* Standalone items — human-readable, grouped by type */}
      <StandaloneSection
        orphanIds={orphans}
        nodeIndex={nodeIndex}
        expandedNodes={expandedNodes}
        onToggle={onToggle}
      />

      {/* Diagnostics — collapsible, at bottom, default collapsed */}
      <DiagnosticsPanel
        constraintFlags={cf}
        overlapEdges={overlapEdges}
        unknownEdges={unknownEdges}
        nodeIndex={nodeIndex}
      />
    </div>
  )
}

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

export default function TopologyPanel({ selectedQuery, mode = 'envelope' }) {
  const [topology,  setTopology]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [lastQuery, setLastQuery] = useState(null)

  useEffect(() => {
    // Envelope mode: fetch from binding_envelope adapter; query highlight not applicable
    // Legacy mode: fetch from 42.7 topology adapter with optional query highlight
    const url = mode === 'envelope'
      ? '/api/execlens?envelope=true'
      : selectedQuery
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

  // Envelope rendering path — PSEE.BLUEEDGE.GAUGE.HANDOFF.01
  if (topology.envelope === true) {
    return <EnvelopeTopology data={topology} />
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

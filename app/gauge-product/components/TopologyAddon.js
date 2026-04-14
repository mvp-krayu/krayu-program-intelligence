/**
 * TopologyAddon.js
 * GAUGE.TOPOLOGY.ADDON.RESTORE.INSPECTOR.AND.PRESENTATION.01
 *
 * Structural Topology add-on for the standalone Gauge product.
 * Activation boundary, tree view, and node inspector.
 *
 * Rules:
 *   - OFF by default (showTopology prop controls visibility)
 *   - Does not alter base Gauge layout when inactive
 *   - Additive only — no base Gauge component modification
 *   - All displayed fields are direct projections of governed data
 *   - No semantic enrichment, no ranking, no fallback labeling
 *
 * Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
 * Source: binding_envelope.json via /api/topology (envelope_adapter.js)
 */

import { useState, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NODE_TYPE_LABELS = {
  binding_context:    'Domain',
  capability_surface: 'Capability Surface',
  component_entity:   'Component Entity',
}

// ---------------------------------------------------------------------------
// Data loader
// ---------------------------------------------------------------------------

function useTopologyData(active) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!active) return
    setLoading(true)
    setError(null)
    fetch('/api/topology')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [active])

  return { data, loading, error }
}

// ---------------------------------------------------------------------------
// TopologyAddon — activation boundary
// ---------------------------------------------------------------------------

export default function TopologyAddon({ showTopology, onToggle }) {
  const { data, loading, error } = useTopologyData(showTopology)

  return (
    <div>
      {/* Activation bar — always rendered, no layout impact when inactive */}
      <div className="topology-addon-bar">
        <span className="topology-addon-label">Structural Topology</span>
        <button className="topology-addon-btn" onClick={onToggle}>
          {showTopology ? '▲ Hide Structural Topology' : '▼ View Structural Topology →'}
        </button>
      </div>

      {/* Topology panel — rendered only when activated */}
      {showTopology && (
        <div className="topology-addon-panel">
          <div className="topology-addon-note">
            <strong>STRUCTURAL TOPOLOGY</strong> — PSEE.BLUEEDGE.GAUGE.HANDOFF.01<br/>
            Envelope-based structural topology. Governed fields: display_label, secondary_label, resolved_label.<br/>
            Source: binding_envelope.json · adapter: envelope_adapter.js · click nodes to inspect
          </div>

          {loading && (
            <div className="ta-state-loading">Loading structural topology…</div>
          )}

          {error && (
            <div className="ta-state-error">
              Structural topology unavailable — {error}
              <div className="ta-state-error-detail">
                Requires local governed artifact: binding_envelope.json<br/>
                Source: clients/…/run_335c0575a080/binding/binding_envelope.json
              </div>
            </div>
          )}

          {data && !loading && !error && (
            <TopologyView data={data} />
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// TopologyView — tree + inspector
// ---------------------------------------------------------------------------

function TopologyView({ data }) {
  // Default state: first domain open, first capability selected
  // Lazy initializers run once — computed from data at mount time only
  const [expandedDomainId, setExpandedDomainId] = useState(() => {
    const roots   = data.roots   || []
    const orphans = new Set(data.orphans || [])
    return roots.find(r => !orphans.has(r)) || null
  })
  const [selectedNodeId, setSelectedNodeId] = useState(() => {
    const roots   = data.roots   || []
    const orphans = new Set(data.orphans || [])
    const firstDomain = roots.find(r => !orphans.has(r))
    if (!firstDomain) return null
    const tree = data.containment_tree || {}
    return tree[firstDomain]?.[0] || null   // first capability in first domain
  })
  const [showAllSurfaces, setShowAllSurfaces] = useState({})  // rootId → bool

  const nodes        = data.nodes        || []
  const roots        = data.roots        || []
  const orphans      = data.orphans      || []
  const overlapEdges = data.overlap_edges || []
  const summary      = data.summary      || {}
  const cf           = data.constraint_flags || {}

  const nodeIndex = {}
  for (const n of nodes) nodeIndex[n.node_id] = n

  const containmentTree = data.containment_tree || {}
  const orphanSet       = new Set(orphans)
  const rootsForGrid    = roots.filter(r => !orphanSet.has(r))

  const selectedNode = selectedNodeId ? nodeIndex[selectedNodeId] : null

  function selectNode(nodeId) {
    setSelectedNodeId(prev => prev === nodeId ? null : nodeId)
  }

  // T2 — single-focus domain expansion: opening a domain auto-collapses the previous one
  function toggleDomain(domainId) {
    setExpandedDomainId(prev => prev === domainId ? null : domainId)
  }

  function toggleShowAllSurfaces(rootId) {
    setShowAllSurfaces(prev => ({ ...prev, [rootId]: !prev[rootId] }))
  }

  return (
    <div>
      {/* Panel header */}
      <div className="ta-header">
        <div className="ta-title">Structural Topology</div>
        <div className="ta-meta">
          {rootsForGrid.length} region{rootsForGrid.length !== 1 ? 's' : ''}
          {summary.nodes_count && ` · ${summary.nodes_count} nodes`}
          {summary.overlap_edges_count > 0 && ` · ${summary.overlap_edges_count} cross-boundary`}
          {' · '}binding_envelope.json
        </div>
      </div>

      {/* Body: tree + inspector side by side */}
      <div className={`ta-body${selectedNode ? ' ta-body--split' : ''}`}>

        {/* Tree */}
        <div className="ta-tree">
          <div className="ta-regions">
            {rootsForGrid.map(rootId => {
              const rootNode   = nodeIndex[rootId]
              if (!rootNode) return null

              const surfaceIds   = containmentTree[rootId] || []
              const surfaces     = surfaceIds.map(id => nodeIndex[id]).filter(Boolean)
              const componentIds = new Set()
              for (const sid of surfaceIds) {
                for (const cid of (containmentTree[sid] || [])) componentIds.add(cid)
              }
              const components    = [...componentIds].map(id => nodeIndex[id]).filter(Boolean)
              const regionOverlaps = overlapEdges.filter(
                e => componentIds.has(e.from_node) || componentIds.has(e.to_node)
              )

              const SURFACE_LIMIT = 5
              const showAll       = showAllSurfaces[rootId]
              const visibleSurfaces = showAll ? surfaces : surfaces.slice(0, SURFACE_LIMIT)
              const hiddenCount     = surfaces.length - SURFACE_LIMIT

              const isRootSelected = selectedNodeId === rootId
              const isExpanded     = expandedDomainId === rootId

              return (
                <div
                  key={rootId}
                  className={`ta-region${isRootSelected ? ' ta-region--selected' : ''}${isExpanded ? ' ta-region--expanded' : ''}`}
                >
                  {/* Region header — T1: click expands/collapses; T2: single-focus */}
                  <div
                    className="ta-region-header"
                    onClick={() => { toggleDomain(rootId); selectNode(rootId) }}
                    title={`${rootNode.secondary_label} · ${NODE_TYPE_LABELS[rootNode.type] || rootNode.type}`}
                  >
                    <span className="ta-expand-arrow">{isExpanded ? '▼' : '▶'}</span>
                    <span className="ta-region-name">{rootNode.display_label}</span>
                    <span className="ta-region-badges">
                      {surfaces.length > 0 && (
                        <span className="ta-badge ta-badge--dim">{surfaces.length} cap</span>
                      )}
                      {components.length > 0 && (
                        <span className="ta-badge ta-badge--dim">{components.length} comp</span>
                      )}
                    </span>
                  </div>

                  {/* Surfaces — T1: only visible when domain is expanded */}
                  {isExpanded && visibleSurfaces.length > 0 && (
                    <div className="ta-surfaces">
                      {visibleSurfaces.map(s => (
                        <div
                          key={s.node_id}
                          className={`ta-surface-row${selectedNodeId === s.node_id ? ' ta-surface-row--selected' : ''}`}
                          onClick={() => selectNode(s.node_id)}
                          title={s.secondary_label}
                        >
                          <span className="ta-surface-indicator">—</span>
                          <span className="ta-surface-name">{s.display_label}</span>
                          <span className="ta-surface-id">{s.secondary_label}</span>
                        </div>
                      ))}
                      {hiddenCount > 0 && (
                        <button
                          className="ta-show-more"
                          onClick={e => { e.stopPropagation(); toggleShowAllSurfaces(rootId) }}
                        >
                          {showAll ? '▲ show less' : `+${hiddenCount} more surfaces`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Components — T1: only visible when domain is expanded */}
                  {isExpanded && components.map(comp => {
                    const overlapsWith = regionOverlaps
                      .filter(e => e.from_node === comp.node_id || e.to_node === comp.node_id)
                      .map(e => nodeIndex[e.from_node === comp.node_id ? e.to_node : e.from_node])
                      .filter(Boolean)

                    const isSelected = selectedNodeId === comp.node_id

                    return (
                      <div
                        key={comp.node_id}
                        className={`ta-component${comp.is_overlap_endpoint ? ' ta-component--overlap' : ''}${isSelected ? ' ta-component--selected' : ''}`}
                        onClick={() => selectNode(comp.node_id)}
                        title={comp.secondary_label}
                      >
                        <div className="ta-component-row">
                          <span className="ta-component-dot">●</span>
                          <span className="ta-component-name">{comp.display_label}</span>
                          {comp.signal_count > 0 && (
                            <span className="ta-signal-count">{comp.signal_count}~</span>
                          )}
                          {comp.is_overlap_endpoint && (
                            <span className="ta-badge ta-badge--overlap">⟷</span>
                          )}
                        </div>
                        {overlapsWith.length > 0 && (
                          <div className="ta-overlap-refs">
                            {overlapsWith.map(other => (
                              <span key={other.node_id} className="ta-overlap-ref">
                                → {other.display_label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Orphans */}
          {orphans.length > 0 && (
            <div className="ta-orphans">
              <div className="ta-orphans-header">Standalone items</div>
              <div className="ta-orphans-list">
                {orphans.map(id => {
                  const n = nodeIndex[id]
                  if (!n) return null
                  return (
                    <span
                      key={id}
                      className={`ta-orphan-item${selectedNodeId === id ? ' ta-orphan-item--selected' : ''}`}
                      onClick={() => selectNode(id)}
                      title={n.secondary_label}
                    >
                      {n.display_label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Structural notes */}
          {cf.overlap_present && (
            <div className="ta-notes">
              <div className="ta-notes-header">
                Structural overlaps ({cf.overlap_count})
              </div>
              {overlapEdges.map(e => {
                const from = nodeIndex[e.from_node]
                const to   = nodeIndex[e.to_node]
                return (
                  <div key={e.edge_id} className="ta-note-row">
                    <span className="ta-note-from">{from ? from.display_label : e.from_node}</span>
                    <span className="ta-note-arrow">⟷</span>
                    <span className="ta-note-to">{to ? to.display_label : e.to_node}</span>
                  </div>
                )
              })}
              {cf.unknown_space_present && (
                <div className="ta-notes-unknown">
                  Unknown space: {cf.unknown_space_count} record{cf.unknown_space_count !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inspector */}
        {selectedNode && (
          <div className="ta-inspector">
            <NodeInspector
              node={selectedNode}
              nodeIndex={nodeIndex}
              overlapEdges={overlapEdges}
              containmentTree={containmentTree}
              onClose={() => setSelectedNodeId(null)}
            />
          </div>
        )}

        {/* Empty inspector hint when tree is full-width */}
        {!selectedNode && (
          <div className="ta-inspector-hint">
            Click any node to inspect
          </div>
        )}

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// NodeInspector — full detail view for selected node
// All fields are direct projections of binding_envelope.json adapter output.
// ---------------------------------------------------------------------------

function InspectorSection({ label, children }) {
  return (
    <div className="ta-insp-section">
      <div className="ta-insp-section-label">{label}</div>
      {children}
    </div>
  )
}

function InspRow({ label, value, mono }) {
  if (value === undefined || value === null || value === '') return null
  const displayVal = typeof value === 'object' ? JSON.stringify(value) : String(value)
  return (
    <div className="ta-insp-row">
      <span className="ta-insp-key">{label}</span>
      <span className={`ta-insp-val${mono ? ' ta-insp-val--mono' : ''}`}>{displayVal}</span>
    </div>
  )
}

function NodeInspector({ node, nodeIndex, overlapEdges, containmentTree, onClose }) {
  const typeLabel = NODE_TYPE_LABELS[node.type] || node.type

  // Overlap peers
  const overlapPeers = overlapEdges
    .filter(e => e.from_node === node.node_id || e.to_node === node.node_id)
    .map(e => {
      const peerId = e.from_node === node.node_id ? e.to_node : e.from_node
      return { peer: nodeIndex[peerId], edge: e }
    })
    .filter(x => x.peer)

  // Containment parent
  const parentId = node.parent_binding_context || node.context || null
  const parentNode = parentId ? nodeIndex[parentId] : null

  // Children in containment tree
  const children = (containmentTree[node.node_id] || [])
    .map(id => nodeIndex[id])
    .filter(Boolean)

  // Provenance fields (all except known-structural keys)
  const prov = node.provenance || {}
  const SKIP_PROV = new Set([]) // show all provenance fields
  const provEntries = Object.entries(prov).filter(([k]) => !SKIP_PROV.has(k))

  // Source origins
  const sourceOrigins = Array.isArray(prov.source_origin)
    ? prov.source_origin.join(', ')
    : prov.source_origin

  // Signals / metrics
  const signals = node.signals || []

  return (
    <div className="ta-insp">
      {/* Header */}
      <div className="ta-insp-header">
        <div className="ta-insp-title">{node.display_label}</div>
        <button className="ta-insp-close" onClick={onClose} title="Close inspector">✕</button>
      </div>

      <div className="ta-insp-id">{node.secondary_label}</div>

      <div className="ta-insp-type-row">
        <span className={`ta-insp-type ta-insp-type--${node.type}`}>{typeLabel}</span>
        {node.temporal_classification && (
          <span className="ta-insp-tc">{node.temporal_classification}</span>
        )}
        {node.is_overlap_endpoint && (
          <span className="ta-insp-overlap-badge">CROSS-BOUNDARY</span>
        )}
      </div>

      {/* Identity */}
      <InspectorSection label="Identity">
        <InspRow label="Display name"  value={node.display_label} />
        <InspRow label="Canonical ID"  value={node.secondary_label} mono />
        <InspRow label="Raw label"     value={node.label} />
        <InspRow label="Resolved"      value={node.resolved_label} />
      </InspectorSection>

      {/* Structural Context */}
      <InspectorSection label="Structural Context">
        <InspRow label="Type"         value={typeLabel} />
        <InspRow label="Depth"        value={node.depth} />
        {parentNode && (
          <InspRow label="Parent domain"  value={`${parentNode.display_label} (${parentNode.secondary_label})`} />
        )}
        {children.length > 0 && (
          <InspRow label={`Children (${children.length})`} value={children.map(c => c.display_label).join(', ')} />
        )}
        {overlapPeers.length > 0 && overlapPeers.map(({ peer, edge }) => (
          <InspRow key={edge.edge_id} label="Overlaps with" value={`${peer.display_label} (${peer.secondary_label})`} />
        ))}
        <InspRow label="Is root"      value={node.is_root     ? 'yes' : null} />
        <InspRow label="Is orphan"    value={node.is_orphan   ? 'yes' : null} />
      </InspectorSection>

      {/* Provenance */}
      {provEntries.length > 0 && (
        <InspectorSection label="Provenance">
          {prov.binding_model_ref && (
            <InspRow label="Binding ref"   value={prov.binding_model_ref} mono />
          )}
          {prov.source_artifact && (
            <InspRow label="Source artifact" value={prov.source_artifact} />
          )}
          {sourceOrigins && (
            <InspRow label="Source origin"   value={sourceOrigins} />
          )}
          {prov.documented_taxonomy_source && (
            <InspRow label="Taxonomy source" value={prov.documented_taxonomy_source} />
          )}
          {prov.structural_topology_source && (
            <InspRow label="Topology source" value={prov.structural_topology_source} />
          )}
          {prov.containment_basis && (
            <InspRow label="Containment"   value={prov.containment_basis} />
          )}
          {prov.path_pattern && (
            <InspRow label="Path pattern"  value={prov.path_pattern} mono />
          )}
        </InspectorSection>
      )}

      {/* Signals / Metrics */}
      {signals.length > 0 && (
        <InspectorSection label={`Signals (${signals.length})`}>
          {signals.map(s => (
            <div key={s.signal_id} className="ta-insp-signal">
              <span className="ta-insp-sig-id">{s.signal_id}</span>
              <span className="ta-insp-sig-metric">{s.metric_name || '—'}</span>
              <span className="ta-insp-sig-val">
                {s.value !== undefined ? String(s.value) : '—'}
                {s.unit && <span className="ta-insp-sig-unit"> {s.unit}</span>}
              </span>
            </div>
          ))}
        </InspectorSection>
      )}

      <div className="ta-insp-source">
        source: binding_envelope.json
      </div>
    </div>
  )
}

/**
 * TopologyAddon.js
 * GAUGE.STANDALONE.PRODUCT.REBUILD.01
 *
 * Structural Topology add-on for the standalone Gauge product.
 * This component is the activation boundary and container for the topology capability.
 *
 * Rules:
 *   - OFF by default (showTopology prop controls visibility)
 *   - Does not alter base Gauge layout when inactive
 *   - Additive only — no base Gauge component modification
 *
 * Full topology rendering (EnvelopeTopology) requires the binding_envelope.json adapter
 * from the PSEE runtime pipeline. This component renders the activation surface
 * and topology mount point.
 *
 * The topology adapter is defined in:
 *   app/execlens-demo/lib/gauge/envelope_adapter.py
 *   Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
 */

import { useState, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Topology data loader
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
// TopologyAddon
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
            Source: binding_envelope.json · adapter: envelope_adapter.py
          </div>

          {loading && (
            <div style={{ color: '#8b949e', fontSize: '13px' }}>
              Loading structural topology…
            </div>
          )}

          {error && (
            <div style={{ color: '#f85149', fontSize: '13px', border: '1px solid #3d1a1a', padding: '10px' }}>
              Structural topology unavailable — {error}
              <div style={{ color: '#444', fontSize: '11px', marginTop: '6px' }}>
                Requires local governed artifact: binding_envelope.json
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
// TopologyView — minimal faithful rendering of the envelope topology
// Mirrors EnvelopeTopology from TopologyPanel.js (GAUGE presentation layer)
// ---------------------------------------------------------------------------

function TopologyView({ data }) {
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  const onToggle = key => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '4px' }}>
          Structural Topology
        </div>
        <div style={{ fontSize: '12px', color: '#444' }}>
          {rootsForGrid.length} region{rootsForGrid.length !== 1 ? 's' : ''}
          {summary.overlap_edges_count > 0 && ` · ${summary.overlap_edges_count} cross-boundary`}
          {' · '}binding_envelope.json · click items to inspect
        </div>
      </div>

      {/* Regions */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {rootsForGrid.map(rootId => {
          const rootNode   = nodeIndex[rootId]
          if (!rootNode) return null
          const surfaceIds = containmentTree[rootId] || []
          const surfaces   = surfaceIds.map(id => nodeIndex[id]).filter(Boolean)
          const componentIds = new Set()
          for (const sid of surfaceIds) {
            for (const cid of (containmentTree[sid] || [])) componentIds.add(cid)
          }
          const components    = [...componentIds].map(id => nodeIndex[id]).filter(Boolean)
          const regionOverlaps = overlapEdges.filter(
            e => componentIds.has(e.from_node) || componentIds.has(e.to_node)
          )

          return (
            <div key={rootId} style={{ border: '1px solid #1f2937', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{rootNode.display_label}</span>
                {surfaces.length > 0 && (
                  <span style={{ fontSize: '11px', color: '#8b949e', border: '1px solid #1f2937', padding: '1px 6px' }}>
                    {surfaces.length}
                  </span>
                )}
              </div>

              {surfaces.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  {surfaces.slice(0, 5).map(s => (
                    <div
                      key={s.node_id}
                      onClick={() => onToggle(s.node_id)}
                      title={s.secondary_label}
                      style={{
                        fontSize: '12px', color: '#8b949e', padding: '2px 0',
                        cursor: 'pointer', borderBottom: '1px solid #111'
                      }}
                    >
                      {s.display_label}
                      {expandedNodes.has(s.node_id) && (
                        <span style={{ color: '#444', marginLeft: '8px' }}>{s.secondary_label}</span>
                      )}
                    </div>
                  ))}
                  {surfaces.length > 5 && (
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>
                      +{surfaces.length - 5} more
                    </div>
                  )}
                </div>
              )}

              {components.map(comp => {
                const overlapsWith = regionOverlaps
                  .filter(e => e.from_node === comp.node_id || e.to_node === comp.node_id)
                  .map(e => nodeIndex[e.from_node === comp.node_id ? e.to_node : e.from_node])
                  .filter(Boolean)

                return (
                  <div
                    key={comp.node_id}
                    onClick={() => onToggle(comp.node_id)}
                    style={{
                      border: '1px solid #1f2937', padding: '8px',
                      cursor: 'pointer', marginTop: '6px',
                      borderColor: comp.is_overlap_endpoint ? '#1b3a5c' : '#1f2937'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#58a6ff', fontSize: '11px' }}>●</span>
                      <span style={{ fontSize: '13px' }}>{comp.display_label}</span>
                    </div>
                    {overlapsWith.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        {overlapsWith.map(other => (
                          <span key={other.node_id} style={{ fontSize: '11px', color: '#1b3a5c', marginRight: '8px' }}>
                            → {other.display_label}
                          </span>
                        ))}
                      </div>
                    )}
                    {expandedNodes.has(comp.node_id) && (
                      <div style={{ marginTop: '8px', borderTop: '1px solid #1f2937', paddingTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#444', marginRight: '12px' }}>{comp.secondary_label}</span>
                        <span style={{ fontSize: '11px', color: '#444' }}>{comp.type}</span>
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
        <div style={{ marginTop: '14px', borderTop: '1px solid #1f2937', paddingTop: '12px' }}>
          <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>
            Standalone items
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {orphans.map(id => {
              const n = nodeIndex[id]
              if (!n) return null
              return (
                <span
                  key={id}
                  onClick={() => onToggle(id)}
                  title={n.secondary_label}
                  style={{
                    fontSize: '12px', color: '#8b949e', border: '1px solid #1f2937',
                    padding: '3px 8px', cursor: 'pointer'
                  }}
                >
                  {n.display_label}
                  {expandedNodes.has(id) && (
                    <span style={{ color: '#444', marginLeft: '6px' }}>({n.secondary_label})</span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Structural notes */}
      {cf.overlap_present && (
        <div style={{ marginTop: '14px', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
          <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>
            Structural overlaps ({cf.overlap_count})
          </div>
          {overlapEdges.map(e => {
            const from = nodeIndex[e.from_node]
            const to   = nodeIndex[e.to_node]
            return (
              <div key={e.edge_id} style={{ fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>
                {from ? from.display_label : e.from_node}
                <span style={{ margin: '0 8px', color: '#444' }}>⟷</span>
                {to ? to.display_label : e.to_node}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

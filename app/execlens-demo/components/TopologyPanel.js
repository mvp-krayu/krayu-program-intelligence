/**
 * TopologyPanel.js
 * PIOS-42.23-RUN01-CONTRACT-v1
 * PSEE.BLUEEDGE.GAUGE.HANDOFF.01 — envelope render path added
 *
 * Landing-page structural topology panel.
 *
 * Render paths (selected by topology response shape):
 *   envelope === true  → GAUGE envelope path (PSEE.BLUEEDGE.GAUGE.HANDOFF.01)
 *     source: /api/execlens?envelope=true
 *     → scripts/psee/gauge_envelope_adapter.py
 *     → binding_envelope.json (ONLY topology authority)
 *   wow_chain === true → WOW chain path (42.22 + 51.1 + 51.1R) — retained
 *   default            → 42.7 legacy hierarchy path — retained as fallback
 *
 * Envelope path governing rules:
 *   R1   binding_envelope.json is the only topology source
 *   R2   structure derived from nodes[], edges[], signals[], constraint_flags
 *   R3   OVERLAP_STRUCTURAL edges always visible
 *   R4   unknown space rendered in constraint lane only — never as topology nodes
 *   R5   deterministic layout (BFS depth from roots, stable input order)
 *   R6   orphan nodes rendered in unbound lane
 */

import { useState, useEffect } from 'react'
import { buildObsidianLink } from '../utils/obsidian'

// Vault name from Next.js NEXT_PUBLIC_* env — configured only, never hardcoded
const VAULT_NAME = process.env.NEXT_PUBLIC_OBSIDIAN_VAULT_NAME || null

// ---------------------------------------------------------------------------
// GAUGE Envelope rendering — PSEE.BLUEEDGE.GAUGE.HANDOFF.01
// ---------------------------------------------------------------------------

// --- Signal badge ---
// Renders a count badge on nodes that have bound signals.
// badge is accented if any signal carries computation_state !== 'AVAILABLE'.

function SignalBadge({ signals }) {
  if (!signals || signals.length === 0) return null
  const accented = signals.some(
    s => s.computation_state !== undefined && s.computation_state !== 'AVAILABLE'
  )
  return (
    <span className={`topo-env-signal-badge${accented ? ' topo-env-signal-badge--active' : ''}`}>
      {signals.length}
    </span>
  )
}

// --- Signal detail list (shown in expanded node view) ---

function SignalList({ signals }) {
  if (!signals || signals.length === 0) return null
  return (
    <div className="topo-env-signal-list">
      {signals.map(s => (
        <div key={s.signal_id} className="topo-env-signal-row">
          {Object.entries(s).map(([k, v]) => (
            <span key={k} className="topo-env-signal-field">
              <span className="topo-env-signal-key">{k}:</span>{' '}
              <span className="topo-env-signal-val">
                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

// --- Constraint lane ---
// Always rendered. Surfaces overlap, unknown space, and parity recovery.

function ConstraintLane({ constraintFlags, overlapEdges, nodeIndex }) {
  if (!constraintFlags) return null
  const {
    overlap_present, overlap_count, overlap_evidence, overlap_source,
    unknown_space_present, unknown_space_count, unknown_space_evidence, unknown_space_source,
    parity_recovery,
  } = constraintFlags

  return (
    <div className="topo-env-constraint-lane">
      {overlap_present && (
        <div className="topo-env-constraint-item topo-env-constraint-overlap">
          <span className="topo-env-constraint-label">
            STRUCTURAL OVERLAPS: {overlap_count}
          </span>
          <div className="topo-env-overlap-arcs">
            {overlapEdges.map(e => {
              const fromNode = nodeIndex[e.from_node]
              const toNode   = nodeIndex[e.to_node]
              const evidence = (overlap_evidence || []).find(ev =>
                ev.includes(fromNode?.label || '') || ev.includes(e.from_node)
              )
              return (
                <div key={e.edge_id} className="topo-env-overlap-arc" title={evidence || e.edge_id}>
                  <span className="topo-env-overlap-endpoint">
                    {fromNode ? fromNode.label : e.from_node}
                  </span>
                  <span className="topo-env-overlap-arrow">⟷</span>
                  <span className="topo-env-overlap-endpoint">
                    {toNode ? toNode.label : e.to_node}
                  </span>
                  {evidence && (
                    <span className="topo-env-overlap-evidence">{evidence}</span>
                  )}
                </div>
              )
            })}
          </div>
          {overlap_source && (
            <span className="topo-env-constraint-source">source: {overlap_source}</span>
          )}
        </div>
      )}

      {unknown_space_present && (
        <div className="topo-env-constraint-item topo-env-constraint-unknown">
          <span className="topo-env-constraint-label">
            UNKNOWN SPACE: {unknown_space_count}
          </span>
          <div className="topo-env-unknown-list">
            {(unknown_space_evidence || []).map((ev, i) => (
              <span key={i} className="topo-env-unknown-entry">{ev}</span>
            ))}
          </div>
          <span className="topo-env-constraint-note">
            regions not fully bounded — not rendered as topology nodes
          </span>
          {unknown_space_source && (
            <span className="topo-env-constraint-source">source: {unknown_space_source}</span>
          )}
        </div>
      )}

      {parity_recovery && (
        <div className="topo-env-constraint-item topo-env-parity-banner">
          <span className="topo-env-constraint-label">PARITY RECOVERY ACTIVE</span>
          <span className="topo-env-parity-value">{parity_recovery}</span>
        </div>
      )}
    </div>
  )
}

// --- Envelope node chip ---
// Renders a single node. Expanded state shows signal detail.

function EnvNodeChip({ node, additionalParentRefs, nodeIndex, expanded, onToggle }) {
  const typeClass = `topo-env-node-${node.type.replace(/_/g, '-')}`
  const overlapClass = node.is_overlap_endpoint ? ' topo-env-overlap-endpoint-node' : ''

  return (
    <div
      className={`topo-env-node ${typeClass}${overlapClass}`}
      onClick={onToggle}
      title={`${node.node_id} · ${node.type} · depth:${node.depth}`}
    >
      <div className="topo-env-node-header">
        <span className="topo-env-node-id">{node.node_id}</span>
        <span className="topo-env-node-label">{node.label}</span>
        {node.is_overlap_endpoint && (
          <span className="topo-env-overlap-marker" title="structural overlap endpoint">⊕</span>
        )}
        <SignalBadge signals={node.signals} />
      </div>

      {/* Additional parent connectors (multi-parent non-canonical refs) */}
      {additionalParentRefs && additionalParentRefs.length > 0 && (
        <div className="topo-env-addl-parents">
          {additionalParentRefs.map(pid => {
            const pn = nodeIndex[pid]
            return (
              <span key={pid} className="topo-env-addl-parent-ref">
                ⤳ also in {pn ? pn.label : pid}
              </span>
            )
          })}
        </div>
      )}

      {expanded && (
        <div className="topo-env-node-detail">
          <div className="topo-env-node-meta">
            <span className="topo-env-meta-field">id: {node.node_id}</span>
            <span className="topo-env-meta-field">type: {node.type}</span>
            <span className="topo-env-meta-field">tc: {node.temporal_classification}</span>
            {node.depth !== undefined && (
              <span className="topo-env-meta-field">depth: {node.depth}</span>
            )}
          </div>
          {node.provenance && (
            <div className="topo-env-provenance">
              {Object.entries(node.provenance).map(([k, v]) => (
                <span key={k} className="topo-env-prov-field">
                  {k}: {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </span>
              ))}
            </div>
          )}
          <SignalList signals={node.signals} />
        </div>
      )}
    </div>
  )
}

// --- Subtree renderer ---
// Recursively renders containment children from the containment_tree.
// Multi-parent children appear under their canonical parent only;
// non-canonical references render as dashed connector stubs via additional_parent_refs.

function SubtreeNode({ nodeId, data, expandedNodes, onToggle, depth }) {
  const node              = data.nodeIndex[nodeId]
  const children          = data.containmentTree[nodeId] || []
  const addlRefs          = data.additionalParentRefs[nodeId] || []
  const expanded          = expandedNodes.has(nodeId)

  if (!node) return null

  return (
    <div className={`topo-env-subtree topo-env-depth-${Math.min(depth, 4)}`}>
      <EnvNodeChip
        node={node}
        additionalParentRefs={node.additional_parents}
        nodeIndex={data.nodeIndex}
        expanded={expanded}
        onToggle={() => onToggle(nodeId)}
      />

      {/* Additional parent refs for this node's children that are non-canonical here */}
      {addlRefs.length > 0 && (
        <div className="topo-env-addl-ref-list">
          {addlRefs.map(childId => {
            const cn = data.nodeIndex[childId]
            return (
              <span key={childId} className="topo-env-addl-ref-connector">
                ⤳ {cn ? cn.label : childId}
                <span className="topo-env-addl-ref-note"> (shared component)</span>
              </span>
            )
          })}
        </div>
      )}

      {children.length > 0 && (
        <div className="topo-env-children">
          {children.map(childId => (
            <SubtreeNode
              key={childId}
              nodeId={childId}
              data={data}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// --- Orphan lane ---
// Renders nodes with no CONTAINS edges in a dedicated unbound lane.

function OrphanLane({ orphanIds, data, expandedNodes, onToggle }) {
  if (!orphanIds || orphanIds.length === 0) return null
  return (
    <div className="topo-env-orphan-lane">
      <div className="topo-env-orphan-header">UNBOUND NODES ({orphanIds.length})</div>
      <div className="topo-env-orphan-list">
        {orphanIds.map(nid => {
          const node = data.nodeIndex[nid]
          if (!node) return null
          return (
            <EnvNodeChip
              key={nid}
              node={node}
              additionalParentRefs={[]}
              nodeIndex={data.nodeIndex}
              expanded={expandedNodes.has(nid)}
              onToggle={() => onToggle(nid)}
            />
          )
        })}
      </div>
    </div>
  )
}

// --- Unknown edge lane ---
// Renders any edge_type values outside the known set as flagged connectors.

function UnknownEdgeLane({ unknownEdges }) {
  if (!unknownEdges || unknownEdges.length === 0) return null
  return (
    <div className="topo-env-unknown-edge-lane">
      <div className="topo-env-unknown-edge-header">
        UNKNOWN EDGE TYPES ({unknownEdges.length}) — flagged
      </div>
      {unknownEdges.map(e => (
        <div key={e.edge_id} className="topo-env-unknown-edge">
          [{e.edge_type}] {e.from_node} → {e.to_node}
        </div>
      ))}
    </div>
  )
}

// --- EnvelopeTopology — top-level envelope render ---

function EnvelopeTopology({ data }) {
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  const onToggle = (nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  // Build node index from annotated nodes array
  const nodeIndex = {}
  for (const n of data.nodes || []) {
    nodeIndex[n.node_id] = n
  }

  // Shared data context passed down to subtree renderers
  const treeData = {
    nodeIndex,
    containmentTree:     data.containment_tree     || {},
    additionalParentRefs: data.additional_parent_refs || {},
  }

  const orphanSet    = new Set(data.orphans || [])
  // Roots rendered in the containment grid are non-orphan roots only.
  // Orphans (no inbound AND no outbound CONTAINS) always go to the orphan lane.
  const rootsForGrid  = (data.roots || []).filter(r => !orphanSet.has(r))
  const orphans       = data.orphans       || []
  const overlapEdges  = data.overlap_edges || []
  const unknownEdges  = data.unknown_edges || []
  const summary       = data.summary       || {}
  const cf            = data.constraint_flags || {}

  return (
    <div className="topo-panel">
      {/* Panel header */}
      <div className="topo-panel-header">
        <div className="topo-panel-title-row">
          <span className="topo-panel-label">STRUCTURAL TOPOLOGY — BINDING ENVELOPE</span>
          <span className="topo-panel-counts">
            {summary.nodes_count}N · {summary.edges_count}E · {summary.signals_count}S
            {summary.orphans_count > 0 && ` · ${summary.orphans_count} unbound`}
            {summary.overlap_edges_count > 0 && ` · ${summary.overlap_edges_count} overlap`}
          </span>
        </div>
        <div className="topo-panel-meta">
          source: binding_envelope.json · PSEE.BLUEEDGE.GAUGE.HANDOFF.01 · click nodes to expand
        </div>
      </div>

      {/* Constraint lane — always rendered */}
      <ConstraintLane
        constraintFlags={cf}
        overlapEdges={overlapEdges}
        nodeIndex={nodeIndex}
      />

      {/* Containment grid — one column per non-orphan root */}
      <div className="topo-env-roots-grid">
        {rootsForGrid.map(rootId => (
          <div key={rootId} className="topo-env-root-col">
            <SubtreeNode
              nodeId={rootId}
              data={treeData}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              depth={0}
            />
          </div>
        ))}
      </div>

      {/* Orphan lane — rendered only when orphans present */}
      <OrphanLane
        orphanIds={orphans}
        data={treeData}
        expandedNodes={expandedNodes}
        onToggle={onToggle}
      />

      {/* Unknown edge lane — rendered only when unknown edge types present */}
      <UnknownEdgeLane unknownEdges={unknownEdges} />
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

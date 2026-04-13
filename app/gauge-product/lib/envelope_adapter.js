/**
 * lib/envelope_adapter.js
 * GAUGE.STANDALONE.TOPOLOGY.DATASOURCE.ISOLATION.01
 *
 * JS port of app/execlens-demo/lib/gauge/envelope_adapter.py
 * Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
 *
 * Produces a deterministic render model from binding_envelope.json.
 * All topology structure is derived from nodes[], edges[], signals[],
 * and constraint_flags. No upstream artifact reads beyond the envelope.
 *
 * Rules:
 *   R1  binding_envelope.json is the only topology input
 *   R2  render model is fully derived from the graph — no hardcoded names or counts
 *   R3  fail closed on missing required collections or malformed input
 *   R4  deterministic — same input produces same output (stable input order preserved)
 */

const CONTRACT_ID          = 'PSEE.BLUEEDGE.GAUGE.HANDOFF.01'
const REQUIRED_COLLECTIONS = ['nodes', 'edges', 'signals', 'constraint_flags']

// ---------------------------------------------------------------------------
// PSEE.STRUCTURAL.LABEL.RESOLUTION.01 — Structural label resolution
// Deterministic transformation grammar. No interpretation. No fallback naming.
// ---------------------------------------------------------------------------

const _ABBREVIATION_REGISTER = {
  cfg: 'Config',
  svc: 'Service',
  mgr: 'Manager',
  ctx: 'Context',
  idx: 'Index',
  api: 'API',
}

/**
 * Collect original-cased tokens from node label corpus to support N-1 preservation.
 * A token qualifies when its canonical form differs from its lowercase form.
 * Returns: { lowercase_token: canonical_cased_form }
 */
function _buildProductNames(nodesList) {
  const registry = {}
  for (const n of nodesList) {
    const raw = n.label || ''
    for (const tok of raw.split(/[_-]+/)) {
      if (!tok) continue
      const lower = tok.toLowerCase()
      if (!(lower in registry)) {
        registry[lower] = tok
      } else if (tok !== tok.toLowerCase() && registry[lower] === registry[lower].toLowerCase()) {
        registry[lower] = tok  // prefer cased form over lowercase
      }
    }
  }
  return registry
}

/**
 * T-1 through T-5: split snake_case, kebab-case, PascalCase, camelCase,
 * and letter–digit / digit–letter boundaries.
 */
function _tokenize(s) {
  const parts = s.split(/[_-]+/)
  const tokens = []
  for (const part of parts) {
    if (!part) continue
    let p = part
    // T-3: PascalCase / camelCase
    p = p.replace(/([a-z])([A-Z])/g, '$1 $2')
    p = p.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    // T-5: letter–digit and digit–letter
    p = p.replace(/([A-Za-z])([0-9])/g, '$1 $2')
    p = p.replace(/([0-9])([A-Za-z])/g, '$1 $2')
    for (const t of p.split(' ')) {
      if (t) tokens.push(t)
    }
  }
  return tokens
}

/**
 * N-1 through N-4 normalization for a single token.
 */
function _normalize(tok, productNames) {
  const lower = tok.toLowerCase()
  // N-1: product casing preservation
  if (lower in productNames && productNames[lower] !== lower) {
    return productNames[lower]
  }
  // N-3: structural abbreviation register (closed set)
  if (lower in _ABBREVIATION_REGISTER) {
    return _ABBREVIATION_REGISTER[lower]
  }
  // N-2: title case
  return tok.length > 1 ? tok[0].toUpperCase() + tok.slice(1).toLowerCase() : tok.toUpperCase()
}

/**
 * Apply full grammar and return resolved_label string.
 * Returns null only when source is empty — never invents content.
 */
function resolveLabel(source, productNames) {
  if (!source) return null
  const tokens = _tokenize(source)
  if (!tokens.length) return null
  return tokens.map(t => _normalize(t, productNames)).join(' ')
}

// ---------------------------------------------------------------------------
// Envelope validator
// ---------------------------------------------------------------------------

function validateEnvelope(envelope) {
  const missing = REQUIRED_COLLECTIONS.filter(c => !(c in envelope))
  if (missing.length) {
    throw new Error(`REQUIRED COLLECTIONS ABSENT: ${missing.join(', ')}`)
  }
  for (const c of ['nodes', 'edges', 'signals']) {
    if (!Array.isArray(envelope[c])) {
      throw new Error(`COLLECTION NOT A LIST: ${c}`)
    }
  }
  if (typeof envelope.constraint_flags !== 'object' || Array.isArray(envelope.constraint_flags)) {
    throw new Error('constraint_flags is not an object')
  }
}

// ---------------------------------------------------------------------------
// Render model derivation
// ---------------------------------------------------------------------------

function buildRenderModel(envelope, envelopePath) {
  const nodesList      = envelope.nodes
  const edgesList      = envelope.edges
  const signalsList    = envelope.signals
  const constraintFlags = envelope.constraint_flags

  // --- Node index ---
  const nodeIndex = {}
  for (const n of nodesList) nodeIndex[n.node_id] = n

  // --- Edge partition ---
  const containsEdges = edgesList.filter(e => e.edge_type === 'CONTAINS')
  const overlapEdges  = edgesList.filter(e => e.edge_type === 'OVERLAP_STRUCTURAL')
  const unknownEdges  = edgesList.filter(e => e.edge_type !== 'CONTAINS' && e.edge_type !== 'OVERLAP_STRUCTURAL')

  // --- CONTAINS adjacency (stable input order) ---
  const childrenOf = {}  // parent_id → [child_id, ...]
  const parentsOf  = {}  // child_id  → [parent_id, ...]
  for (const e of containsEdges) {
    if (!childrenOf[e.from_node]) childrenOf[e.from_node] = []
    childrenOf[e.from_node].push(e.to_node)
    if (!parentsOf[e.to_node]) parentsOf[e.to_node] = []
    parentsOf[e.to_node].push(e.from_node)
  }

  // --- Root detection: nodes with no inbound CONTAINS ---
  const hasInbound  = new Set(Object.keys(parentsOf))
  const hasOutbound = new Set(Object.keys(childrenOf))

  // Stable order: preserve nodes[] input order
  const roots = nodesList.map(n => n.node_id).filter(id => !hasInbound.has(id))

  // --- Orphan detection: no inbound AND no outbound CONTAINS ---
  const orphanIds = new Set(
    nodesList.map(n => n.node_id).filter(id => !hasInbound.has(id) && !hasOutbound.has(id))
  )

  // --- Depth assignment via BFS from roots ---
  const nodeDepths = {}
  const queue = []
  for (const r of roots) {
    if (!(r in nodeDepths)) {
      nodeDepths[r] = 0
      queue.push(r)
    }
  }
  let qi = 0
  while (qi < queue.length) {
    const nid = queue[qi++]
    for (const child of (childrenOf[nid] || [])) {
      if (!(child in nodeDepths)) {
        nodeDepths[child] = nodeDepths[nid] + 1
        queue.push(child)
      }
    }
  }
  // Nodes reachable only from non-root CONTAINS sources
  for (const nid of [...Object.keys(childrenOf), ...Object.keys(parentsOf)]) {
    if (!(nid in nodeDepths)) nodeDepths[nid] = 0
  }

  // --- Multi-parent detection ---
  const multiParent = {}
  for (const [child, plist] of Object.entries(parentsOf)) {
    if (plist.length > 1) multiParent[child] = plist
  }

  // Canonical parent: first parent in edges[] input order
  const canonicalParent = {}
  for (const e of containsEdges) {
    if (!(e.to_node in canonicalParent)) {
      canonicalParent[e.to_node] = e.from_node
    }
  }

  // --- Containment tree ---
  const containmentTree = {}
  const additionalParentRefs = {}
  for (const [parent, children] of Object.entries(childrenOf)) {
    const seen = new Set()
    const canonChildren = []
    for (const child of children) {
      if (seen.has(child)) continue
      seen.add(child)
      if (canonicalParent[child] === parent) {
        canonChildren.push(child)
      } else {
        if (!additionalParentRefs[parent]) additionalParentRefs[parent] = []
        additionalParentRefs[parent].push(child)
      }
    }
    containmentTree[parent] = canonChildren
  }

  // --- Overlap endpoint index ---
  const overlapEndpoints = new Set()
  for (const e of overlapEdges) {
    overlapEndpoints.add(e.from_node)
    overlapEndpoints.add(e.to_node)
  }

  // --- Signals by node ---
  const signalsByNode = {}
  const orphanSignals = []
  for (const s of signalsList) {
    const nid = s.node_id
    if (nid && nid in nodeIndex) {
      if (!signalsByNode[nid]) signalsByNode[nid] = []
      signalsByNode[nid].push(s)
    } else {
      orphanSignals.push(s)
    }
  }

  // --- Bound label fields — PSEE.STRUCTURAL.LABEL.RESOLUTION.01 + GAUGE.RUNTIME.LABEL.BINDING.01 ---
  const productNames = _buildProductNames(nodesList)

  // --- Annotated node list (non-mutating) ---
  const annotatedNodes = []
  for (const n of nodesList) {
    const nid = n.node_id
    const ann = { ...n }
    ann.depth               = nodeDepths[nid] ?? 0
    ann.is_orphan           = orphanIds.has(nid)
    ann.is_root             = roots.includes(nid)
    ann.is_overlap_endpoint = overlapEndpoints.has(nid)
    ann.signal_count        = (signalsByNode[nid] || []).length
    ann.signals             = signalsByNode[nid] || []
    if (nid in multiParent) {
      ann.canonical_parent   = canonicalParent[nid]
      ann.additional_parents = multiParent[nid].filter(p => p !== canonicalParent[nid])
    }

    // Bound label fields
    const labelSource     = n.label || nid
    const resolved        = resolveLabel(labelSource, productNames) || nid
    ann.resolved_label    = resolved
    ann.display_label     = resolved           // display_label := resolved_label
    ann.secondary_label   = nid                // secondary_label := canonical_id
    if ('short_label' in n) ann.short_label = n.short_label

    annotatedNodes.push(ann)
  }

  // --- Summary ---
  const summary = {
    nodes_count:              nodesList.length,
    roots_count:              roots.length,
    orphans_count:            orphanIds.size,
    edges_count:              edgesList.length,
    contains_edges_count:     containsEdges.length,
    overlap_edges_count:      overlapEdges.length,
    unknown_edges_count:      unknownEdges.length,
    signals_count:            signalsList.length,
    orphan_signals_count:     orphanSignals.length,
    multi_parent_nodes_count: Object.keys(multiParent).length,
  }

  return {
    envelope:               true,
    contract_id:            CONTRACT_ID,
    envelope_path:          envelopePath,
    nodes:                  annotatedNodes,
    roots,
    orphans:                [...orphanIds].sort(),
    containment_tree:       containmentTree,
    additional_parent_refs: additionalParentRefs,
    node_depths:            nodeDepths,
    multi_parent_nodes:     multiParent,
    overlap_edges:          overlapEdges,
    unknown_edges:          unknownEdges,
    signals_by_node:        signalsByNode,
    orphan_signals:         orphanSignals,
    constraint_flags:       constraintFlags,
    summary,
    capability_surfaces_index: envelope.capability_surfaces || [],
  }
}

module.exports = { validateEnvelope, buildRenderModel }

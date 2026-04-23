/**
 * components/VaultGraph.js
 * TIER2.WORKSPACE.VAULT.GRAPH.04
 *
 * Base graph + zone emphasis model.
 *
 * BASE GRAPH (always present):
 *   zone root → all signals → mapped claims (via vi.signals)
 *   zone root → all artifacts
 *   This structural skeleton never changes regardless of mode.
 *
 * ZONE EMPHASIS (overlay, applied on top of base):
 *   Relevant nodes — full color, larger
 *   Non-relevant nodes — muted color, smaller
 *   Relevant links — semantic bright color (from GRAPH.03)
 *   Non-relevant links — dimmed
 *
 * RELEVANCE SOURCES:
 *   EVIDENCE → vault_targets signal/artifact IDs + one-hop mapped claims
 *   TRACE    → node_chain IDs + extra path nodes added to graph
 *   WHY      → capability_ids added as CAPABILITY nodes (extra, always bright)
 *   DEFAULT  → no emphasis (all nodes bright, full base structure visible)
 *
 * ZONE ROOT is always marked relevant (anchor of everything).
 *
 * Authority: TIER2.WORKSPACE.VAULT.GRAPH.04
 */

import { useEffect, useRef, useMemo } from 'react'

// ── Node appearance: bright (relevant) vs muted (non-relevant) ───────────────

const BRIGHT = {
  ZONE:       { color: '#e8e8e8', val: 10  },
  SIGNAL:     { color: '#4caf6e', val: 5   },
  CLAIM:      { color: '#c89b3c', val: 3   },
  ARTIFACT:   { color: '#5a9fd4', val: 3   },
  CAPABILITY: { color: '#a08ade', val: 3.5 },
  TRACE:      { color: '#b09adf', val: 3.5 },
}
const MUTED = {
  ZONE:       { color: '#555',    val: 10  },  // zone always full size
  SIGNAL:     { color: '#1a3020', val: 2   },
  CLAIM:      { color: '#2a2010', val: 1.5 },
  ARTIFACT:   { color: '#162030', val: 1.5 },
  CAPABILITY: { color: '#2a2030', val: 1.5 },
  TRACE:      { color: '#2a1a40', val: 2   },
}

// ── Link appearance (from GRAPH.03, preserved) ────────────────────────────────

const LINK_COLOR_BRIGHT = {
  ZONE_SIGNAL:   'rgba(80,  200, 120, 0.65)',
  SIGNAL_CLAIM:  'rgba(100, 160, 255, 0.70)',
  ZONE_ARTIFACT: 'rgba(220, 180,  80, 0.70)',
  ZONE_CAP:      'rgba(160, 160, 160, 0.45)',
  TRACE:         'rgba(180, 120, 255, 0.85)',
}
const LINK_COLOR_DIM    = 'rgba(60, 60, 60, 0.30)'

const LINK_WIDTH_BASE = {
  ZONE_SIGNAL:   1.2,
  SIGNAL_CLAIM:  1.8,
  ZONE_ARTIFACT: 1.2,
  ZONE_CAP:      1.0,
  TRACE:         2.5,
}

function baseLinkWidth(link) {
  return LINK_WIDTH_BASE[link.type] ?? 1.0
}
function hoverLinkWidth(link, node) {
  if (!node) return baseLinkWidth(link)
  const src = link.source?.id ?? link.source
  const tgt = link.target?.id ?? link.target
  return (src === node.id || tgt === node.id) ? 3 : baseLinkWidth(link)
}

const MAX_NODES = 150

// ── URL resolution ────────────────────────────────────────────────────────────

function vaultUrl(type, id, vi) {
  if (!vi?.base_url) return null
  switch (type) {
    case 'signal': {
      const cId = vi.signals?.[id]
      return cId && vi.claims?.[cId] ? `${vi.base_url}/${vi.claims[cId]}` : null
    }
    case 'claim':    return vi.claims?.[id]    ? `${vi.base_url}/${vi.claims[id]}`    : null
    case 'artifact': return vi.artifacts?.[id] ? `${vi.base_url}/${vi.artifacts[id]}` : null
    case 'entity':   return vi.entities?.[id]  ? `${vi.base_url}/${vi.entities[id]}`  : null
    default: return null
  }
}

// ── Relevance computation ─────────────────────────────────────────────────────
//
// Returns null (no emphasis — all bright) or a Set of relevant node IDs.
// One-hop rule: if a signal is relevant its mapped claim is also relevant.

function computeRelevance(vi, qs) {
  if (!qs?.mode) return null

  if (qs.mode === 'EVIDENCE' && Array.isArray(qs?.data?.vault_targets)) {
    const ids = new Set()
    for (const t of qs.data.vault_targets) {
      ids.add(t.id)
      // one-hop: include the claim mapped from this signal
      if (t.type === 'signal' && vi?.signals?.[t.id]) ids.add(vi.signals[t.id])
    }
    return ids
  }

  if (qs.mode === 'TRACE' && Array.isArray(qs?.data?.trace)) {
    const ids = new Set()
    for (const path of qs.data.trace)
      for (const nodeId of path.node_chain || []) ids.add(nodeId)
    return ids
  }

  if (qs.mode === 'WHY') {
    // Capability IDs don't map to base-graph nodes; return a non-null empty set
    // so base graph is muted. Capability nodes added in buildGraph are always bright.
    return new Set(qs?.data?.result?.structural_scope?.capability_ids ?? [])
  }

  return null  // unknown mode — no emphasis
}

// ── Graph construction ────────────────────────────────────────────────────────

function buildGraph(zone, vi, qs) {
  const nodes = []
  const links = []
  const seen  = new Set()

  // relevantIds: null = no emphasis (all bright); Set = emphasis active
  const relevantIds = computeRelevance(vi, qs)
  const hasEmphasis = relevantIds !== null

  // Zone root is always relevant
  if (relevantIds) relevantIds.add(zone.zone_id)

  function nodeStyle(id, type) {
    const rel = !hasEmphasis || relevantIds.has(id)
    const src = rel ? (BRIGHT[type] ?? BRIGHT.SIGNAL) : (MUTED[type] ?? MUTED.SIGNAL)
    return { color: src.color, val: src.val, relevant: rel }
  }

  function addNode(id, type, label, url) {
    if (seen.has(id) || nodes.length >= MAX_NODES) return false
    seen.add(id)
    const { color, val, relevant } = nodeStyle(id, type)
    nodes.push({ id, type, label, url, color, val, relevant })
    return true
  }
  function addLink(src, tgt, type) {
    if (seen.has(src) && seen.has(tgt)) links.push({ source: src, target: tgt, type })
  }

  // ── 1. Zone root ─────────────────────────────────────────────────────────
  const zoneUrl = vi?.base_url && vi?.zone_routing?.fallback
    ? `${vi.base_url}/${vi.zone_routing.fallback}` : null
  addNode(zone.zone_id, 'ZONE', zone.domain_name || zone.zone_id, zoneUrl)

  // ── 2. All signals → their mapped claims (structural skeleton) ───────────
  for (const [sigId, claimId] of Object.entries(vi?.signals ?? {})) {
    if (nodes.length >= MAX_NODES) break
    addNode(sigId, 'SIGNAL', sigId, vaultUrl('signal', sigId, vi))
    addLink(zone.zone_id, sigId, 'ZONE_SIGNAL')
    if (claimId && nodes.length < MAX_NODES) {
      addNode(claimId, 'CLAIM', claimId, vaultUrl('claim', claimId, vi))
      addLink(sigId, claimId, 'SIGNAL_CLAIM')
    }
  }

  // ── 3. All artifacts (structural skeleton) ───────────────────────────────
  for (const artId of Object.keys(vi?.artifacts ?? {})) {
    if (nodes.length >= MAX_NODES) break
    addNode(artId, 'ARTIFACT', artId, vaultUrl('artifact', artId, vi))
    addLink(zone.zone_id, artId, 'ZONE_ARTIFACT')
  }

  // ── 4. TRACE: add path-chain nodes not already in base graph ────────────
  if (qs?.mode === 'TRACE' && Array.isArray(qs?.data?.trace)) {
    for (const path of qs.data.trace) {
      const chain = path.node_chain || []
      let prev = null
      for (const nodeId of chain) {
        if (nodes.length >= MAX_NODES) break
        if (!seen.has(nodeId)) {
          const type = vi?.signals?.[nodeId] ? 'SIGNAL' : 'TRACE'
          addNode(nodeId, type, nodeId, type === 'SIGNAL' ? vaultUrl('signal', nodeId, vi) : null)
        }
        if (prev) addLink(prev, nodeId, 'TRACE')
        else      addLink(zone.zone_id, nodeId, 'TRACE')
        prev = nodeId
      }
    }
  }

  // ── 5. WHY: add capability nodes as extra zone-specific overlay ──────────
  if (qs?.mode === 'WHY' && Array.isArray(qs?.data?.result?.structural_scope?.capability_ids)) {
    for (const capId of qs.data.result.structural_scope.capability_ids) {
      if (nodes.length >= MAX_NODES) break
      if (!seen.has(capId)) {
        addNode(capId, 'CAPABILITY', capId, null)
        addLink(zone.zone_id, capId, 'ZONE_CAP')
      }
    }
  }

  return { nodes, links, hasEmphasis }
}

// ── Link color accessor (uses node.relevant at render time) ──────────────────
//
// At render time link.source / link.target are node objects (3d-force-graph mutates them).

function linkColor(link, hasEmphasis) {
  if (!hasEmphasis) return LINK_COLOR_BRIGHT[link.type] ?? 'rgba(120,120,120,0.45)'
  const srcRel = link.source?.relevant ?? false
  const tgtRel = link.target?.relevant ?? false
  if (srcRel || tgtRel) return LINK_COLOR_BRIGHT[link.type] ?? 'rgba(120,120,120,0.45)'
  return LINK_COLOR_DIM
}

// ── Header hint ───────────────────────────────────────────────────────────────

function buildHint(nodes, hasEmphasis, qs) {
  const total   = nodes.length
  const relevant = nodes.filter(n => n.relevant).length

  if (!hasEmphasis) return `${total} nodes · full vault structure`

  if (qs?.mode === 'EVIDENCE') {
    const sigs = nodes.filter(n => n.type === 'SIGNAL' && n.relevant).length
    const clms = nodes.filter(n => n.type === 'CLAIM'  && n.relevant).length
    const arts = nodes.filter(n => n.type === 'ARTIFACT' && n.relevant).length
    const parts = []
    if (sigs) parts.push(`${sigs} signal${sigs !== 1 ? 's' : ''}`)
    if (clms) parts.push(`${clms} claim${clms !== 1 ? 's' : ''}`)
    if (arts) parts.push(`${arts} artifact${arts !== 1 ? 's' : ''}`)
    const scope = parts.length ? parts.join(' · ') : 'weak zone scope'
    return `${total} nodes · ${scope}`
  }

  if (qs?.mode === 'TRACE') {
    const paths = qs?.data?.trace?.length ?? 0
    return `${total} nodes · ${relevant} relevant · ${paths} trace path${paths !== 1 ? 's' : ''}`
  }

  if (qs?.mode === 'WHY') {
    const caps = nodes.filter(n => n.type === 'CAPABILITY').length
    return `${total} nodes · ${caps} capability node${caps !== 1 ? 's' : ''}`
  }

  return `${total} nodes · ${relevant} relevant`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VaultGraph({ zone, vaultIndex, qs }) {
  const mountRef   = useRef(null)
  const graphRef   = useRef(null)
  const tooltipRef = useRef(null)

  const { nodes, links, hasEmphasis } = useMemo(
    () => buildGraph(zone, vaultIndex, qs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zone.zone_id, vaultIndex, qs?.mode, qs?.data]
  )
  const graphData = useMemo(() => ({ nodes, links }), [nodes, links])

  // Init renderer once per zone (browser-only, Three.js)
  useEffect(() => {
    if (!mountRef.current) return
    let active = true

    import('3d-force-graph').then(mod => {
      if (!active || !mountRef.current) return
      const ForceGraph3D = mod.default || mod
      const el = mountRef.current

      const graph = ForceGraph3D()
        .width(el.clientWidth || 640)
        .height(360)
        .backgroundColor('#0e0e12')
        .nodeLabel(n => `${n.type}: ${n.label}`)
        .nodeColor(n => n.color)
        .nodeVal(n => n.val)
        .nodeOpacity(0.92)
        .linkColor(link => linkColor(link, hasEmphasis))
        .linkWidth(link => baseLinkWidth(link))
        .linkDirectionalParticles(link => link.type === 'TRACE' ? 4 : 0)
        .linkDirectionalParticleWidth(1.5)
        .linkDirectionalParticleColor(link => LINK_COLOR_BRIGHT.TRACE)
        .onNodeClick(n => { if (n.url) window.open(n.url, '_blank', 'noreferrer') })
        .onNodeHover(n => {
          if (tooltipRef.current) {
            tooltipRef.current.textContent = n ? `${n.type} · ${n.label}` : ''
            tooltipRef.current.style.display = n ? 'block' : 'none'
          }
          graph.linkWidth(link => hoverLinkWidth(link, n))
        })
        (el)

      graph.graphData(graphData)
      graphRef.current = graph
    })

    return () => {
      active = false
      if (graphRef.current) {
        try { graphRef.current._destructor?.() } catch {}
        graphRef.current = null
      }
      if (mountRef.current) mountRef.current.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone.zone_id])

  // Update data + re-apply emphasis when query changes
  useEffect(() => {
    if (!graphRef.current) return
    graphRef.current.graphData(graphData)
    graphRef.current.linkColor(link => linkColor(link, hasEmphasis))
    graphRef.current.linkWidth(link => baseLinkWidth(link))
  }, [graphData, hasEmphasis])

  const hint = buildHint(nodes, hasEmphasis, qs)

  return (
    <div className="vg-wrap">
      <div className="vg-header">
        <span className="vg-header-label">Vault Graph</span>
        <span className="vg-header-count">{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
        <span className="vg-header-hint">{hint}</span>
      </div>
      <div className="vg-canvas-wrap">
        <div ref={mountRef} className="vg-canvas" />
        <div ref={tooltipRef} className="vg-tooltip" style={{ display: 'none' }} />
      </div>
    </div>
  )
}

/**
 * components/VaultGraph.js
 * TIER2.WORKSPACE.VAULT.GRAPH.05
 *
 * Zone emphasis correction — strong contrast + DEFAULT differentiation.
 *
 * CONTRAST MODEL:
 *   Relevant nodes — bright saturated color, larger val
 *   Non-relevant   — near-background color (#0e0e12 bg), tiny val
 *                    visually recede; structure implied, not foregrounded
 *
 * DEFAULT RELEVANCE (no active query):
 *   Deterministic projection from zone.zone_id + zone.signal_count.
 *   Different zones → different signal subsets → visually distinct at first glance.
 *   Deterministic: same zone always emphasises same nodes.
 *   Honest: this is a visual projection heuristic, not an evidence claim.
 *
 * QUERY RELEVANCE:
 *   EVIDENCE → vault_targets IDs + one-hop mapped claims (factual zone binding)
 *   TRACE    → all node_chain IDs (factual path scope)
 *   WHY      → capability_ids added as extra nodes (factual structural scope)
 *
 * EMPHASIS IS ALWAYS ACTIVE — relevantIds is never null.
 *
 * Authority: TIER2.WORKSPACE.VAULT.GRAPH.05
 */

import { useEffect, useRef, useMemo } from 'react'

// ── Node appearance ───────────────────────────────────────────────────────────
//
// BRIGHT: saturated, clearly visible against #0e0e12 background.
// MUTED:  near-background (≈ #0e0e12 ± 10), tiny size. Structural ghost only.
//         Zone root is never muted — it is always the anchor.

const BRIGHT = {
  ZONE:       { color: '#f0f0f0', val: 12  },
  SIGNAL:     { color: '#52d97e', val: 6   },
  CLAIM:      { color: '#e8b54a', val: 4   },
  ARTIFACT:   { color: '#6ab4e8', val: 4   },
  CAPABILITY: { color: '#b09adf', val: 4   },
  TRACE:      { color: '#c490ff', val: 5   },
}
const MUTED = {
  ZONE:       { color: '#3a3a42', val: 12  },  // zone root always large
  SIGNAL:     { color: '#131a14', val: 1.5 },  // near-black green — barely visible
  CLAIM:      { color: '#16140a', val: 1.2 },  // near-black amber
  ARTIFACT:   { color: '#0e1218', val: 1.2 },  // near-black blue
  CAPABILITY: { color: '#14121a', val: 1.2 },
  TRACE:      { color: '#130e1c', val: 1.5 },
}

// ── Link appearance ───────────────────────────────────────────────────────────
//
// Relevant link (at least one endpoint relevant): semantic bright colour.
// Non-relevant link: near-invisible — preserves structural silhouette only.

const LINK_COLOR_BRIGHT = {
  ZONE_SIGNAL:   'rgba(80,  215, 130, 0.68)',
  SIGNAL_CLAIM:  'rgba(100, 165, 255, 0.72)',
  ZONE_ARTIFACT: 'rgba(225, 185,  70, 0.72)',
  ZONE_CAP:      'rgba(170, 155, 220, 0.55)',
  TRACE:         'rgba(190, 120, 255, 0.88)',
}
const LINK_COLOR_DIM = 'rgba(22, 22, 26, 0.55)'

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

// ── Deterministic hash seed from zone_id ─────────────────────────────────────
//
// Produces a stable integer for a given zone_id string.
// Same input always produces the same output (no randomness).

function zoneHash(zoneId) {
  let h = 5381
  for (let i = 0; i < zoneId.length; i++) {
    h = ((h * 33) ^ zoneId.charCodeAt(i)) >>> 0
  }
  return h
}

// ── Relevance computation ─────────────────────────────────────────────────────
//
// Always returns a non-null Set. Emphasis is always active.
// Zone root is always added to the set before this function is called.

function computeRelevance(zone, vi, qs) {

  // EVIDENCE — factual zone signal binding from query response
  if (qs?.mode === 'EVIDENCE' && Array.isArray(qs?.data?.vault_targets)) {
    const ids = new Set()
    for (const t of qs.data.vault_targets) {
      ids.add(t.id)
      if (t.type === 'signal' && vi?.signals?.[t.id]) ids.add(vi.signals[t.id]) // one-hop claim
    }
    return ids
  }

  // TRACE — factual path scope from query response
  if (qs?.mode === 'TRACE' && Array.isArray(qs?.data?.trace)) {
    const ids = new Set()
    for (const path of qs.data.trace)
      for (const nodeId of path.node_chain || []) ids.add(nodeId)
    return ids
  }

  // WHY — capability scope from query response
  // Capability IDs don't map to base-graph nodes; base will be muted,
  // capability nodes added in buildGraph are always in this set.
  if (qs?.mode === 'WHY') {
    return new Set(qs?.data?.result?.structural_scope?.capability_ids ?? [])
  }

  // DEFAULT — deterministic projection from zone data.
  // Select zone.signal_count signals using zoneHash offset into sorted signal list.
  // Guarantees different zones emphasise different signal subsets.
  const allSigIds = Object.keys(vi?.signals ?? {}).sort()
  const count     = Math.min(Math.max(zone.signal_count || 0, 1), allSigIds.length)
  const seed      = zoneHash(zone.zone_id)
  const start     = seed % allSigIds.length
  const ids       = new Set()

  for (let i = 0; i < count; i++) {
    const sigId  = allSigIds[(start + i) % allSigIds.length]
    ids.add(sigId)
    const claimId = vi?.signals?.[sigId]
    if (claimId) ids.add(claimId)  // one-hop mapped claim
  }

  // Core evidence artifacts relevant for HIGH/MODERATE severity zones
  if ((zone.severity === 'HIGH' || zone.severity === 'MODERATE') && vi?.artifacts) {
    if (vi.artifacts['ART-04']) ids.add('ART-04')
    if (vi.artifacts['ART-05']) ids.add('ART-05')
  }

  return ids
}

// ── Graph construction ────────────────────────────────────────────────────────

function buildGraph(zone, vi, qs, isOverview) {
  const nodes = []
  const links = []
  const seen  = new Set()

  const relevantIds = computeRelevance(zone, vi, qs)
  relevantIds.add(zone.zone_id)  // zone root always relevant

  function nodeStyle(id, type) {
    if (isOverview) {
      const src = BRIGHT[type] ?? BRIGHT.SIGNAL
      return { color: src.color, val: src.val, relevant: true }
    }
    const rel = relevantIds.has(id)
    const src  = rel ? (BRIGHT[type] ?? BRIGHT.SIGNAL) : (MUTED[type] ?? MUTED.SIGNAL)
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

  // ── 2. All signals → mapped claims (structural skeleton) ─────────────────
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

  // ── 4. TRACE: extra path-chain nodes not in base graph ───────────────────
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

  // ── 5. WHY: capability nodes (extra zone-specific overlay) ───────────────
  if (qs?.mode === 'WHY' && Array.isArray(qs?.data?.result?.structural_scope?.capability_ids)) {
    for (const capId of qs.data.result.structural_scope.capability_ids) {
      if (nodes.length >= MAX_NODES) break
      if (!seen.has(capId)) {
        addNode(capId, 'CAPABILITY', capId, null)
        addLink(zone.zone_id, capId, 'ZONE_CAP')
      }
    }
  }

  return { nodes, links }
}

// ── Link color (relevant = bright semantic; both muted = dim) ─────────────────

function linkColor(link) {
  const srcRel = link.source?.relevant ?? false
  const tgtRel = link.target?.relevant ?? false
  if (srcRel || tgtRel) return LINK_COLOR_BRIGHT[link.type] ?? 'rgba(120,120,120,0.5)'
  return LINK_COLOR_DIM
}

// ── Header hint ───────────────────────────────────────────────────────────────

function buildHint(nodes, qs, isOverview) {
  const total = nodes.length

  if (isOverview) {
    return `${total} nodes · full vault structure`
  }

  const relevant = nodes.filter(n => n.relevant).length
  if (!qs?.mode) {
    return `${total} nodes · ${relevant} relevant`
  }
  if (qs.mode === 'EVIDENCE') {
    const sigs = nodes.filter(n => n.type === 'SIGNAL'   && n.relevant).length
    const clms = nodes.filter(n => n.type === 'CLAIM'    && n.relevant).length
    const arts = nodes.filter(n => n.type === 'ARTIFACT' && n.relevant).length
    const parts = []
    if (sigs) parts.push(`${sigs} signal${sigs !== 1 ? 's' : ''}`)
    if (clms) parts.push(`${clms} claim${clms !== 1 ? 's' : ''}`)
    if (arts) parts.push(`${arts} artifact${arts !== 1 ? 's' : ''}`)
    const scope = parts.length ? parts.join(' · ') : 'weak zone scope'
    return `${total} nodes · ${scope}`
  }
  if (qs.mode === 'TRACE') {
    const paths = qs?.data?.trace?.length ?? 0
    return `${total} nodes · ${relevant} relevant · ${paths} path${paths !== 1 ? 's' : ''}`
  }
  if (qs.mode === 'WHY') {
    const caps = nodes.filter(n => n.type === 'CAPABILITY').length
    return `${total} nodes · ${caps} capability node${caps !== 1 ? 's' : ''}`
  }
  return `${total} nodes · ${relevant} relevant`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VaultGraph({ zone, vaultIndex, qs, isOverview }) {
  const mountRef   = useRef(null)
  const graphRef   = useRef(null)
  const tooltipRef = useRef(null)

  const graphData = useMemo(
    () => buildGraph(zone, vaultIndex, qs, isOverview),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zone.zone_id, vaultIndex, qs?.mode, qs?.data, isOverview]
  )

  // Init renderer once per zone (browser-only, Three.js)
  useEffect(() => {
    if (!mountRef.current) return
    let active = true

    import('3d-force-graph').then(mod => {
      if (!active || !mountRef.current) return
      const ForceGraph3D = mod.default || mod
      const el = mountRef.current
      let initialFit = true

      const graph = ForceGraph3D()
        .width(el.clientWidth || 640)
        .height(360)
        .backgroundColor('#0e0e12')
        .nodeLabel(n => `${n.type}: ${n.label}`)
        .nodeColor(n => n.color)
        .nodeVal(n => n.val)
        .nodeOpacity(1.0)
        .linkColor(link => linkColor(link))
        .linkWidth(link => baseLinkWidth(link))
        .linkDirectionalParticles(link => link.type === 'TRACE' ? 4 : 0)
        .linkDirectionalParticleWidth(1.5)
        .linkDirectionalParticleColor(() => LINK_COLOR_BRIGHT.TRACE)
        .onNodeClick(n => { if (n.url) window.open(n.url, '_blank', 'noreferrer') })
        .onNodeHover(n => {
          if (tooltipRef.current) {
            tooltipRef.current.textContent = n ? `${n.type} · ${n.label}` : ''
            tooltipRef.current.style.display = n ? 'block' : 'none'
          }
          graph.linkWidth(link => hoverLinkWidth(link, n))
        })
        .onEngineStop(() => {
          if (initialFit && active) {
            graph.zoomToFit(400, 20)
            initialFit = false
          }
        })
        (el)

      // Open layout: more repulsion + longer link distance + slower cooling
      graph.d3Force('charge').strength(-100)
      graph.d3Force('link').distance(60)
      graph.d3AlphaDecay(0.015)

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

  // Update data + re-apply link accessors when query or overview state changes
  useEffect(() => {
    if (!graphRef.current) return
    graphRef.current.graphData(graphData)
    graphRef.current.linkColor(link => linkColor(link))
    graphRef.current.linkWidth(link => baseLinkWidth(link))
  }, [graphData])

  // Recenter camera when returning to overview — gentle zoom-to-fit, tight padding
  useEffect(() => {
    if (isOverview && graphRef.current) {
      graphRef.current.zoomToFit(600, 20)
    }
  }, [isOverview])

  const hint = buildHint(graphData.nodes, qs, isOverview)

  return (
    <div className="vg-wrap">
      <div className="vg-header">
        <span className="vg-header-label">Vault Graph</span>
        <span className="vg-header-count">{graphData.nodes.length} node{graphData.nodes.length !== 1 ? 's' : ''}</span>
        <span className="vg-header-hint">{hint}</span>
      </div>
      <div className="vg-canvas-wrap">
        <div ref={mountRef} className="vg-canvas" />
        <div ref={tooltipRef} className="vg-tooltip" style={{ display: 'none' }} />
      </div>
    </div>
  )
}

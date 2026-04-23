/**
 * components/VaultGraph.js
 * TIER2.WORKSPACE.VAULT.GRAPH.03
 *
 * Zone-scoping + edge visibility correction.
 *
 * ZONE-SCOPING RULE — a node appears only if:
 *   (a) it is directly referenced by this zone's query response, OR
 *   (b) it is one hop from (a) via vault_index, OR
 *   (c) it is a universal evidence source (ART-04/05) for DEFAULT state, OR
 *   (d) it is a TRACE path-chain node
 *
 * DATA MODEL PER MODE:
 *
 *   DEFAULT   zone root + ART-04 + ART-05 (universal evidence artifacts)
 *   WHY       zone root + capability nodes from result.structural_scope.capability_ids
 *   EVIDENCE  zone root → signals (vault_targets) → claims (vi.signals map) + artifacts
 *   TRACE     zone root + path-chain entity nodes (TRACE overlay)
 *
 * LINK TYPES (semantic colour + width):
 *   ZONE_SIGNAL   zone → signal     green  1.2
 *   SIGNAL_CLAIM  signal → claim    blue   1.8
 *   ZONE_ARTIFACT zone → artifact   amber  1.2
 *   ZONE_CAP      zone → capability grey   1.0
 *   TRACE         chain edges       purple 2.5 + directional particles
 *
 * No run-scoped inflation. No invented edges.
 * Every link traces to vault_index or the active query response.
 *
 * Authority: TIER2.WORKSPACE.VAULT.GRAPH.03
 */

import { useEffect, useRef, useMemo } from 'react'

// ── Node appearance ──────────────────────────────────────────────────────────

const NODE = {
  ZONE:       { color: '#e8e8e8', val: 10 },
  SIGNAL:     { color: '#4caf6e', val: 5  },
  CLAIM:      { color: '#c89b3c', val: 3  },
  ARTIFACT:   { color: '#5a9fd4', val: 3  },
  CAPABILITY: { color: '#888',    val: 2.5 },
  TRACE:      { color: '#9a6abf', val: 2.5 },
}

// ── Link appearance ──────────────────────────────────────────────────────────

const LINK_COLOR = {
  ZONE_SIGNAL:   'rgba(80,  200, 120, 0.65)',
  SIGNAL_CLAIM:  'rgba(100, 160, 255, 0.70)',
  ZONE_ARTIFACT: 'rgba(220, 180,  80, 0.70)',
  ZONE_CAP:      'rgba(160, 160, 160, 0.40)',
  TRACE:         'rgba(180, 120, 255, 0.85)',
  DEFAULT:       'rgba(160, 160, 160, 0.40)',
}

const LINK_WIDTH_BASE = {
  ZONE_SIGNAL:   1.2,
  SIGNAL_CLAIM:  1.8,
  ZONE_ARTIFACT: 1.2,
  ZONE_CAP:      1.0,
  TRACE:         2.5,
  DEFAULT:       1.0,
}

function baseLinkWidth(link) {
  return LINK_WIDTH_BASE[link.type] ?? LINK_WIDTH_BASE.DEFAULT
}
function hoverLinkWidth(link, node) {
  if (!node) return baseLinkWidth(link)
  const src = link.source?.id ?? link.source
  const tgt = link.target?.id ?? link.target
  return (src === node.id || tgt === node.id) ? 3 : baseLinkWidth(link)
}

const MAX_NODES = 150

// ── URL resolution ───────────────────────────────────────────────────────────

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
    default:         return null
  }
}

// ── Graph construction ───────────────────────────────────────────────────────

function buildGraph(zone, vi, qs) {
  const nodes = []
  const links = []
  const seen  = new Set()

  function addNode(id, nodeType, label, url) {
    if (seen.has(id) || nodes.length >= MAX_NODES) return false
    seen.add(id)
    const { color, val } = NODE[nodeType] || NODE.TRACE
    nodes.push({ id, type: nodeType, label, url, color, val })
    return true
  }
  function addLink(src, tgt, type) {
    if (seen.has(src) && seen.has(tgt)) links.push({ source: src, target: tgt, type })
  }

  // Zone root always present
  const zoneUrl = vi?.base_url && vi?.zone_routing?.fallback
    ? `${vi.base_url}/${vi.zone_routing.fallback}` : null
  addNode(zone.zone_id, 'ZONE', zone.domain_name || zone.zone_id, zoneUrl)

  // ── EVIDENCE — primary zone-scoped chain ─────────────────────────────────
  if (qs?.mode === 'EVIDENCE' && Array.isArray(qs?.data?.vault_targets)) {
    for (const t of qs.data.vault_targets) {
      if (nodes.length >= MAX_NODES) break
      if (t.type === 'signal') {
        addNode(t.id, 'SIGNAL', t.label || t.id, vaultUrl('signal', t.id, vi))
        addLink(zone.zone_id, t.id, 'ZONE_SIGNAL')
        // One-hop: claim chained from this signal via vault_index
        const claimId = vi?.signals?.[t.id]
        if (claimId && nodes.length < MAX_NODES) {
          addNode(claimId, 'CLAIM', claimId, vaultUrl('claim', claimId, vi))
          addLink(t.id, claimId, 'SIGNAL_CLAIM')
        }
      } else if (t.type === 'artifact') {
        addNode(t.id, 'ARTIFACT', t.label || t.id, vaultUrl('artifact', t.id, vi))
        addLink(zone.zone_id, t.id, 'ZONE_ARTIFACT')
      } else if (t.type === 'claim' && !seen.has(t.id)) {
        addNode(t.id, 'CLAIM', t.label || t.id, vaultUrl('claim', t.id, vi))
        addLink(zone.zone_id, t.id, 'SIGNAL_CLAIM')
      }
    }
    return { nodes, links }
  }

  // ── TRACE — path chain overlay ────────────────────────────────────────────
  if (qs?.mode === 'TRACE' && Array.isArray(qs?.data?.trace)) {
    for (const path of qs.data.trace) {
      const chain = path.node_chain || []
      let prev = null
      for (const nodeId of chain) {
        if (nodes.length >= MAX_NODES) break
        // If this node ID is a known signal in vault_index, render as SIGNAL
        const nodeType = vi?.signals?.[nodeId] ? 'SIGNAL' : 'TRACE'
        const url = nodeType === 'SIGNAL' ? vaultUrl('signal', nodeId, vi) : null
        if (!seen.has(nodeId)) addNode(nodeId, nodeType, nodeId, url)
        if (prev) addLink(prev, nodeId, 'TRACE')
        else      addLink(zone.zone_id, nodeId, 'TRACE')
        prev = nodeId
      }
    }
    return { nodes, links }
  }

  // ── WHY — zone capability scope ───────────────────────────────────────────
  if (qs?.mode === 'WHY' && Array.isArray(qs?.data?.result?.structural_scope?.capability_ids)) {
    for (const capId of qs.data.result.structural_scope.capability_ids) {
      if (nodes.length >= MAX_NODES) break
      addNode(capId, 'CAPABILITY', capId, null)
      addLink(zone.zone_id, capId, 'ZONE_CAP')
    }
    return { nodes, links }
  }

  // ── DEFAULT — minimal honest graph ────────────────────────────────────────
  // Universal evidence artifacts that underpin every zone in this run.
  // ART-04 = canonical_topology.json, ART-05 = signal_registry.json
  const universalArtifacts = ['ART-04', 'ART-05']
  for (const artId of universalArtifacts) {
    if (vi?.artifacts?.[artId]) {
      addNode(artId, 'ARTIFACT', artId, vaultUrl('artifact', artId, vi))
      addLink(zone.zone_id, artId, 'ZONE_ARTIFACT')
    }
  }

  return { nodes, links }
}

// ── Header hint ──────────────────────────────────────────────────────────────

function buildHint(nodes, qs) {
  if (!qs?.mode) {
    return 'minimal scope — run EVIDENCE to expand'
  }
  if (qs.mode === 'WHY') {
    const caps = nodes.filter(n => n.type === 'CAPABILITY').length
    return caps > 0
      ? `${caps} capability node${caps !== 1 ? 's' : ''} · zone structural scope`
      : 'no capability scope resolved'
  }
  if (qs.mode === 'EVIDENCE') {
    const sigs  = nodes.filter(n => n.type === 'SIGNAL').length
    const clms  = nodes.filter(n => n.type === 'CLAIM').length
    const arts  = nodes.filter(n => n.type === 'ARTIFACT').length
    const parts = []
    if (sigs)  parts.push(`${sigs} signal${sigs  !== 1 ? 's' : ''}`)
    if (clms)  parts.push(`${clms} claim${clms   !== 1 ? 's' : ''}`)
    if (arts)  parts.push(`${arts} artifact${arts !== 1 ? 's' : ''}`)
    return parts.length ? parts.join(' · ') : 'weak zone scope — limited mapped evidence'
  }
  if (qs.mode === 'TRACE') {
    const chains = qs?.data?.trace?.length ?? 0
    const ents   = nodes.filter(n => n.type === 'TRACE' || n.type === 'SIGNAL').length - 1
    return chains > 0
      ? `${ents} path node${ents !== 1 ? 's' : ''} · ${chains} trace path${chains !== 1 ? 's' : ''}`
      : 'no traceable paths for this zone'
  }
  return ''
}

// ── Component ────────────────────────────────────────────────────────────────

export default function VaultGraph({ zone, vaultIndex, qs }) {
  const mountRef   = useRef(null)
  const graphRef   = useRef(null)
  const tooltipRef = useRef(null)

  const graphData = useMemo(
    () => buildGraph(zone, vaultIndex, qs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zone.zone_id, vaultIndex, qs?.mode, qs?.data]
  )

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
        .nodeOpacity(0.9)
        .linkColor(link => LINK_COLOR[link.type] ?? LINK_COLOR.DEFAULT)
        .linkWidth(link => baseLinkWidth(link))
        .linkDirectionalParticles(link => link.type === 'TRACE' ? 4 : 0)
        .linkDirectionalParticleWidth(1.5)
        .linkDirectionalParticleColor(link => LINK_COLOR[link.type] ?? LINK_COLOR.DEFAULT)
        .onNodeClick(n => { if (n.url) window.open(n.url, '_blank', 'noreferrer') })
        .onNodeHover(n => {
          // tooltip
          if (tooltipRef.current) {
            tooltipRef.current.textContent = n ? `${n.type} · ${n.label}` : ''
            tooltipRef.current.style.display = n ? 'block' : 'none'
          }
          // edge emphasis
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

  // Update data on query change — no reinit
  useEffect(() => {
    if (!graphRef.current) return
    graphRef.current.graphData(graphData)
    // Restore base link widths after data update (hover state cleared)
    graphRef.current.linkWidth(link => baseLinkWidth(link))
  }, [graphData])

  const hint = buildHint(graphData.nodes, qs)

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

/**
 * components/VaultGraph.js
 * TIER2.WORKSPACE.VAULT.GRAPH.02
 *
 * 3D vault graph — projection layer only.
 *
 * DATA MODEL (vault_index.json is primary):
 *
 *   Base graph (always rendered on open):
 *     ZONE → SIGNAL[n]  (all signals from vi.signals — run-scoped, single client)
 *     SIGNAL → CLAIM    (vi.signals[id] = claimId → vi.claims[claimId])
 *     ZONE → ARTIFACT   (vi.artifacts — evidence source nodes for this run)
 *
 *   EVIDENCE enrichment (qs.data.vault_targets):
 *     Boost size/color of signals explicitly bound to this zone.
 *     Already in base graph; no new nodes unless vault_targets adds extras.
 *
 *   TRACE enrichment (qs.data.trace):
 *     Add path-chain entity nodes not already present.
 *     Overlay: does not replace base graph.
 *
 * Relationship rule: no invented edges. Every link has a source in vault_index.
 *
 * Authority: TIER2.WORKSPACE.VAULT.GRAPH.02
 */

import { useEffect, useRef, useMemo } from 'react'

// ── Colours ─────────────────────────────────────────────────────────────────

const BASE = {
  ZONE:     { color: '#e8e8e8', val: 10 },
  SIGNAL:   { color: '#4caf6e', val: 4  },
  SIGNAL_BOUND: { color: '#7fd89a', val: 6 },  // EVIDENCE-confirmed zone signal
  CLAIM:    { color: '#c89b3c', val: 3  },
  ARTIFACT: { color: '#5a9fd4', val: 2.5 },
  ENTITY:   { color: '#555',   val: 2  },
  TRACE:    { color: '#9a6abf', val: 2  },      // TRACE path-chain overlay
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

  function addNode(id, type, label, url) {
    if (seen.has(id) || nodes.length >= MAX_NODES) return false
    seen.add(id)
    const { color, val } = BASE[type] || BASE.ENTITY
    nodes.push({ id, type, label, url, color, val })
    return true
  }
  function link(src, tgt) {
    if (seen.has(src) && seen.has(tgt)) links.push({ source: src, target: tgt })
  }

  // ── 1. Zone root ──────────────────────────────────────────────────────────
  const zoneNodeUrl = vi?.base_url && vi?.zone_routing?.fallback
    ? `${vi.base_url}/${vi.zone_routing.fallback}`
    : null
  addNode(zone.zone_id, 'ZONE', zone.domain_name || zone.zone_id, zoneNodeUrl)

  // ── 2. EVIDENCE enrichment: identify zone-bound signal IDs ───────────────
  // vault_targets from EVIDENCE response are the only authoritative source
  // of zone-to-signal binding available in the projection layer.
  const boundSignalIds = new Set()
  if (qs?.mode === 'EVIDENCE' && Array.isArray(qs?.data?.vault_targets)) {
    for (const t of qs.data.vault_targets) {
      if (t.type === 'signal') boundSignalIds.add(t.id)
    }
  }

  // ── 3. Signals → Claims (primary vault chain) ────────────────────────────
  const signalMap = vi?.signals || {}
  for (const [sigId, claimId] of Object.entries(signalMap)) {
    if (nodes.length >= MAX_NODES) break

    // Boost node style if this signal is bound to current zone
    const sigType = boundSignalIds.has(sigId) ? 'SIGNAL_BOUND' : 'SIGNAL'
    addNode(sigId, sigType, sigId, vaultUrl('signal', sigId, vi))
    link(zone.zone_id, sigId)

    // Claim chained from this signal
    if (claimId && nodes.length < MAX_NODES) {
      addNode(claimId, 'CLAIM', claimId, vaultUrl('claim', claimId, vi))
      link(sigId, claimId)
    }
  }

  // ── 4. Artifacts (evidence source nodes for this run) ────────────────────
  const artifactMap = vi?.artifacts || {}
  for (const artId of Object.keys(artifactMap)) {
    if (nodes.length >= MAX_NODES) break
    addNode(artId, 'ARTIFACT', artId, vaultUrl('artifact', artId, vi))
    link(zone.zone_id, artId)
  }

  // ── 5. EVIDENCE extra vault_targets not already in graph ─────────────────
  // (covers artifact/claim targets beyond standard signal list)
  if (qs?.mode === 'EVIDENCE' && Array.isArray(qs?.data?.vault_targets)) {
    for (const t of qs.data.vault_targets) {
      if (nodes.length >= MAX_NODES) break
      if (seen.has(t.id)) continue
      const nodeType = t.type === 'artifact' ? 'ARTIFACT'
                     : t.type === 'claim'    ? 'CLAIM'
                     : 'SIGNAL'
      addNode(t.id, nodeType, t.label || t.id, vaultUrl(t.type, t.id, vi))
      link(zone.zone_id, t.id)
    }
  }

  // ── 6. TRACE path-chain overlay ───────────────────────────────────────────
  if (qs?.mode === 'TRACE' && Array.isArray(qs?.data?.trace)) {
    for (const path of qs.data.trace) {
      const chain = path.node_chain || []
      let prev = null
      for (const nodeId of chain) {
        if (nodes.length >= MAX_NODES) break
        if (!seen.has(nodeId)) addNode(nodeId, 'TRACE', nodeId, null)
        if (prev) link(prev, nodeId)
        else      link(zone.zone_id, nodeId)
        prev = nodeId
      }
    }
  }

  return { nodes, links }
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
      const w  = el.clientWidth || 640

      const graph = ForceGraph3D()
        .width(w)
        .height(360)
        .backgroundColor('#0e0e12')
        .nodeLabel(n => `${n.type}: ${n.label}`)
        .nodeColor(n => n.color)
        .nodeVal(n => n.val)
        .linkColor(() => '#333')
        .linkWidth(0.6)
        .linkDirectionalParticles(1)
        .linkDirectionalParticleWidth(0.8)
        .linkDirectionalParticleColor(() => '#444')
        .nodeThreeObject(null)
        .onNodeClick(n => { if (n.url) window.open(n.url, '_blank', 'noreferrer') })
        .onNodeHover(n => {
          if (!tooltipRef.current) return
          tooltipRef.current.textContent = n ? `${n.type} · ${n.label}` : ''
          tooltipRef.current.style.display = n ? 'block' : 'none'
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

  // Update data on query change — no reinit needed
  useEffect(() => {
    if (graphRef.current) graphRef.current.graphData(graphData)
  }, [graphData])

  const sigCount  = Object.keys(vaultIndex?.signals  || {}).length
  const artCount  = Object.keys(vaultIndex?.artifacts || {}).length
  const hint      = qs?.mode === 'EVIDENCE' ? 'zone-bound signals highlighted'
                  : qs?.mode === 'TRACE'    ? '+ trace path overlay'
                  : `${sigCount} sig · ${artCount} artifact · click → vault`

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

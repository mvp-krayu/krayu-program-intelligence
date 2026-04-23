/**
 * components/VaultGraph.js
 * TIER2.WORKSPACE.VAULT.GRAPH.01
 *
 * 3D vault graph panel for the Tier-2 Diagnostic Workspace.
 * Projection-only: sources data exclusively from vault_index.json + query responses.
 * No backend contract changes. Browser-only (Three.js). Max 150 nodes.
 * Click → vault page. Hover tooltip.
 *
 * Data sources (all existing runtime outputs):
 *   - vaultIndex  → node URLs, signal→claim mapping, artifact paths
 *   - qs.data.vault_targets (EVIDENCE) → zone-scoped signal + artifact nodes
 *   - qs.data.trace (TRACE) → path chain entity nodes
 *   - zone.zone_id / zone.domain_name → root node only
 *
 * Authority: TIER2.WORKSPACE.VAULT.GRAPH.01
 */

import { useEffect, useRef, useMemo } from 'react'

const NODE_COLOR = {
  ZONE:     '#e8e8e8',
  SIGNAL:   '#4caf6e',
  ARTIFACT: '#5a9fd4',
  CLAIM:    '#c89b3c',
  ENTITY:   '#555',
}
const NODE_VAL = {
  ZONE:     8,
  SIGNAL:   4,
  ARTIFACT: 2.5,
  CLAIM:    3,
  ENTITY:   2,
}
const MAX_NODES = 150

function resolveVaultUrl(type, id, vi) {
  if (!vi?.base_url) return null
  if (type === 'artifact') return vi.artifacts?.[id] ? `${vi.base_url}/${vi.artifacts[id]}` : null
  if (type === 'signal') {
    const cId = vi.signals?.[id]
    return cId && vi.claims?.[cId] ? `${vi.base_url}/${vi.claims[cId]}` : null
  }
  if (type === 'claim') return vi.claims?.[id] ? `${vi.base_url}/${vi.claims[id]}` : null
  return null
}

function buildGraph(zone, vaultIndex, qs) {
  const nodes = []
  const links = []
  const seen  = new Set()
  const vi    = vaultIndex

  function addNode(id, type, label, url) {
    if (seen.has(id) || nodes.length >= MAX_NODES) return
    seen.add(id)
    nodes.push({ id, type, label, url, color: NODE_COLOR[type] || '#666', val: NODE_VAL[type] || 2 })
  }
  function addLink(source, target) {
    if (seen.has(source) && seen.has(target)) links.push({ source, target })
  }

  // Root: zone node — URL from vault domain_routing fallback
  const zoneUrl = vi?.base_url && vi?.domain_routing?.fallback
    ? `${vi.base_url}/${vi.domain_routing.fallback}`
    : null
  addNode(zone.zone_id, 'ZONE', zone.domain_name || zone.zone_id, zoneUrl)

  // EVIDENCE mode: vault_targets are scoped to this zone by the query engine
  if (qs?.mode === 'EVIDENCE' && qs?.data?.vault_targets) {
    for (const t of qs.data.vault_targets) {
      if (nodes.length >= MAX_NODES) break
      const nodeType = t.type === 'artifact' ? 'ARTIFACT' : t.type === 'signal' ? 'SIGNAL' : 'CLAIM'
      const url = resolveVaultUrl(t.type, t.id, vi)
      addNode(t.id, nodeType, t.label || t.id, url)
      addLink(zone.zone_id, t.id)
    }
    // Link signal → artifact pairs via vault_index cross-reference
    if (vi?.signals && vi?.artifacts) {
      const sigNodes = nodes.filter(n => n.type === 'SIGNAL')
      const artNodes = nodes.filter(n => n.type === 'ARTIFACT')
      for (const sig of sigNodes) {
        for (const art of artNodes) {
          // Evidence artifacts (ART-04, ART-05) connect to all signals
          if (art.id === 'ART-04' || art.id === 'ART-05') addLink(sig.id, art.id)
        }
      }
    }
  }

  // TRACE mode: path chain nodes from trace result
  if (qs?.mode === 'TRACE' && qs?.data?.trace) {
    for (const path of qs.data.trace) {
      const chain = path.node_chain || []
      let prev = null
      for (const nodeId of chain) {
        if (nodes.length >= MAX_NODES) break
        if (!seen.has(nodeId)) addNode(nodeId, 'ENTITY', nodeId, null)
        if (prev) addLink(prev, nodeId)
        else addLink(zone.zone_id, nodeId)
        prev = nodeId
      }
    }
  }

  return { nodes, links }
}

export default function VaultGraph({ zone, vaultIndex, qs }) {
  const mountRef   = useRef(null)
  const graphRef   = useRef(null)
  const tooltipRef = useRef(null)

  const graphData = useMemo(
    () => buildGraph(zone, vaultIndex, qs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zone.zone_id, vaultIndex, qs?.mode, qs?.data]
  )

  // Init graph once per zone (browser only, Three.js)
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
        .linkColor(() => '#2a2a2e')
        .linkWidth(0.5)
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

  // Update data on query change — no reinit
  useEffect(() => {
    if (graphRef.current) graphRef.current.graphData(graphData)
  }, [graphData])

  const hint = qs?.mode === 'EVIDENCE'
    ? 'zone + evidence vault targets'
    : qs?.mode === 'TRACE'
    ? 'zone + trace path nodes'
    : 'zone root · run WHY / EVIDENCE / TRACE to expand'

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

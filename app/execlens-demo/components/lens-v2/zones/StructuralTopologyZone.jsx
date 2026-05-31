import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { PRESSURE_META } from './constants'
import { TermHint } from './OperatorReadingGuide'

const LINEAGE_LABELS = {
  EXACT: 'EXACT',
  STRONG: 'STRONG',
  PARTIAL: 'PARTIAL',
  WEAK: 'WEAK',
  NONE: 'SEMANTIC-ONLY',
}

const LINEAGE_COLORS = {
  EXACT:   '#64ffda',
  STRONG:  '#64ffda',
  PARTIAL: '#ffd700',
  WEAK:    '#ff9e4a',
  NONE:    '#5e6d8a',
}


function StructuralComposition({ topologySummary, isS1, structuralEnrichment }) {
  const ts = topologySummary || {}
  const total = ts.semantic_domain_count || 0
  const backed = ts.structurally_backed_count || 0
  const semOnly = ts.semantic_only_count || 0
  const clusters = ts.cluster_count || 0
  const enriched = structuralEnrichment && structuralEnrichment.available
  if (isS1) {
    return (
      <div className="topo-composition">
        <div className="topo-composition-summary">
          Structural topology active. {clusters} structural clusters across {total} structural domains.
          {enriched && ts.total_structural_edges ? ` ${ts.total_structural_edges.toLocaleString()} structural edges resolved (${ts.total_import_edges.toLocaleString()} import · ${ts.total_inheritance_edges.toLocaleString()} inheritance).` : ''}
        </div>
        <div className="topo-composition-stats">
          <div className="topo-stat-card">
            <div className="topo-stat-value">{clusters}</div>
            <div className="topo-stat-label"><TermHint term="STRUCTURAL CLUSTERS">STRUCTURAL CLUSTERS</TermHint></div>
          </div>
          <div className="topo-stat-card">
            <div className="topo-stat-value">{enriched ? (ts.code_graph_file_count || total) : total}</div>
            <div className="topo-stat-label">{enriched ? <TermHint term="CODE GRAPH FILES">CODE GRAPH FILES</TermHint> : 'STRUCTURAL DOMAINS'}</div>
          </div>
          {enriched && ts.total_import_edges ? (
            <div className="topo-stat-card">
              <div className="topo-stat-value">{ts.total_import_edges.toLocaleString()}</div>
              <div className="topo-stat-label"><TermHint term="IMPORT EDGES">IMPORT EDGES</TermHint></div>
            </div>
          ) : (
            <div className="topo-stat-card">
              <div className="topo-stat-value">{ts.structural_dom_count || clusters}</div>
              <div className="topo-stat-label">TOPOLOGY GROUPS</div>
            </div>
          )}
          {enriched && ts.total_inheritance_edges ? (
            <div className="topo-stat-card">
              <div className="topo-stat-value">{ts.total_inheritance_edges.toLocaleString()}</div>
              <div className="topo-stat-label"><TermHint term="INHERITANCE EDGES">INHERITANCE EDGES</TermHint></div>
            </div>
          ) : null}
          {enriched && ts.total_classes ? (
            <div className="topo-stat-card">
              <div className="topo-stat-value">{ts.total_classes.toLocaleString()}</div>
              <div className="topo-stat-label">CLASS DEFINITIONS</div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
  return (
    <div className="topo-composition">
      <div className="topo-composition-summary">
        {backed} of {total} semantic domains have current structural backing. {semOnly} remain semantic-only and are shown as projection-layer coverage.
      </div>
      <div className="topo-composition-stats">
        <div className="topo-stat-card">
          <div className="topo-stat-value">{total}</div>
          <div className="topo-stat-label">SEMANTIC DOMAINS</div>
        </div>
        <div className="topo-stat-card">
          <div className="topo-stat-value">{backed}</div>
          <div className="topo-stat-label">STRUCTURALLY BACKED</div>
        </div>
        <div className="topo-stat-card">
          <div className="topo-stat-value">{semOnly}</div>
          <div className="topo-stat-label">SEMANTIC-ONLY</div>
        </div>
      </div>
    </div>
  )
}

export function StructuralSpinesPanel({ structuralEnrichment }) {
  if (!structuralEnrichment || !structuralEnrichment.available) return null
  const ct = structuralEnrichment.centrality
  if (!ct || !ct.top_structural_spines || ct.top_structural_spines.length === 0) return null
  const spines = ct.top_structural_spines
  const dual = structuralEnrichment.dual_authority
  return (
    <div className="topo-spines-panel">
      <div className="topo-spines-heading">STRUCTURAL CENTRALITY — TOP SPINES</div>
      {dual && (
        <div className="topo-spines-dual">
          <span className="topo-spines-dual-tag" style={{ borderColor: '#4a9eff' }}>
            <TermHint term="IMPORT AUTHORITY">IMPORT AUTHORITY</TermHint>: {dual.import_dominant.path.split('/').slice(-2).join('/')} ({dual.import_dominant.import_in_degree})
          </span>
          <span className="topo-spines-dual-tag" style={{ borderColor: '#64ffda' }}>
            <TermHint term="INHERITANCE AUTHORITY">INHERITANCE AUTHORITY</TermHint>: {dual.inheritance_dominant.path.split('/').slice(-2).join('/')} ({dual.inheritance_dominant.inherits_in_degree})
          </span>
        </div>
      )}
      <div className="topo-spines-grid">
        {spines.map((s, i) => {
          const shortPath = s.path.split('/').slice(-2).join('/')
          const hasInheritance = s.inherits_in_degree > 0
          const hasImports = s.import_in_degree > 0
          return (
            <div key={i} className="topo-spine-card">
              <div className="topo-spine-card-rank">#{s.centrality_rank}</div>
              <div className="topo-spine-card-path" title={s.path}>{shortPath}</div>
              <div className="topo-spine-card-role">{s.structural_role}</div>
              <div className="topo-spine-card-metrics">
                {hasImports && <span className="topo-spine-metric" data-type="import" title="Import dependencies: inbound ↓ outbound ↑">Import {s.import_in_degree}↓ {s.import_out_degree}↑</span>}
                {hasInheritance && <span className="topo-spine-metric" data-type="inherit" title="Inheritance dependencies: inbound ↓ outbound ↑">Inherit {s.inherits_in_degree}↓ {s.inherits_out_degree}↑</span>}
              </div>
            </div>
          )
        })}
      </div>
      {ct.role_summary && (
        <div className="topo-spines-roles">
          {Object.entries(ct.role_summary).filter(([,v]) => v > 0).map(([role, count]) => (
            <span key={role} className="topo-spine-role-chip">{role.replace(/_/g, ' ')} ({count})</span>
          ))}
        </div>
      )}
    </div>
  )
}

function EvidenceCardPanel({ evidenceBlocks }) {
  if (!evidenceBlocks || evidenceBlocks.length === 0) return null
  return (
    <div className="topo-evidence-panel">
      {evidenceBlocks.map((block, i) => {
        const card = (block.signal_cards || [])[0] || {}
        const role = (block.propagation_role || '').replace('_', ' ')
        return (
          <div key={i} className="topo-evidence-card" data-tier={card.pressure_tier}>
            <div className="topo-evidence-card-role">{role}</div>
            <div className="topo-evidence-card-name">{block.domain_alias}</div>
            <div className="topo-evidence-card-ground">{block.grounding_label}</div>
            <div className="topo-evidence-card-signal">{card.pressure_label}</div>
            <div className="topo-evidence-card-text">{card.evidence_text}</div>
          </div>
        )
      })}
    </div>
  )
}

function splitLabel(name, maxLen) {
  if (!name) return ['?']
  const words = name.split(/\s+/)
  const lines = []
  let cur = ''
  words.forEach(w => {
    if (cur && (cur + ' ' + w).length > maxLen) { lines.push(cur); cur = w }
    else { cur = cur ? cur + ' ' + w : w }
  })
  if (cur) lines.push(cur)
  return lines.slice(0, 2)
}

const EDGE_COLORS = {
  EMITS: '#3fb950',
  CALLS: '#58a6ff',
  inferred_semantic: '#d29922',
  structural_co_membership: '#8b949e',
}
const EDGE_DASHED = { inferred_semantic: '5,4', structural_co_membership: '3,3' }

function nodeStyle(d) {
  if (d.lineage_status === 'STRUCTURAL') return { fill: '#0d1a2e', stroke: '#58a6ff', sw: 1.8, glow: '#58a6ff', glowOp: 0.15, dashed: false }
  if (d.lineage_status === 'EXACT') return { fill: '#0d2e1a', stroke: '#3fb950', sw: 2, glow: '#3fb950', glowOp: 0.18, dashed: false }
  if (d.lineage_status === 'STRONG') return { fill: '#0d1f3c', stroke: '#58a6ff', sw: 2, glow: '#58a6ff', glowOp: 0.18, dashed: false }
  if (d.lineage_status === 'PARTIAL') return { fill: '#1c1600', stroke: '#d29922', sw: 1.5, glow: '#d29922', glowOp: 0.18, dashed: false }
  return { fill: '#0d1117', stroke: '#8b949e', sw: 1.2, glow: 'rgba(139,148,158,0.18)', glowOp: 0.18, dashed: true }
}

function confColor(d) {
  if (d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG') return '#3fb950'
  if (d.lineage_status === 'PARTIAL') return '#d29922'
  return '#8b949e'
}

function tooltipOffsetY(cy) {
  return cy > 68 ? 60 : -30
}

const COGNITION_OVERLAY_COLORS = {
  IMPORT_PRESSURE: '#ff9e4a',
  INTEGRATION_CORRIDOR: '#4a9eff',
  INTEGRATION_MIXED: '#4a9eff',
  DELIVERY_FRAGILITY: '#ff6b6b',
  COORDINATION_LOAD: '#4a9eff',
  PROPAGATION_RISK: '#ff9e4a',
  PROPAGATION_CORRIDOR: '#ff9e4a',
  CLUSTER_PRESSURE: '#ffd700',
  COUPLING_CORRIDOR: '#4a9eff',
  COMPOUND_CONVERGENCE: '#ff6b6b',
  COVERAGE_GAP: '#ff9e4a',
  COVERAGE_COMPLETE: '#64ffda',
  TOPOLOGY_POSTURE: '#64ffda',
  QUALIFICATION_POSTURE: '#64ffda',
  PRESSURE_ZONE: '#ff6b6b',
  EVIDENCE_GAP: '#5e6d8a',
  SW_INTEL_POSTURE: '#ff6b6b',
  FRAGILITY_HOTSPOT: '#ff6b6b',
  CONSTRICTION_POINT: '#ffd700',
  BOUNDARY_DIVERGENCE: '#ff9e4a',
  COUPLING_CLUSTER: '#b794f4',
}

const ROLE_COLORS = {
  ORIGIN: '#ff6b6b',
  PASS_THROUGH: '#ffd700',
  RECEIVER: '#ff9e4a',
}

export function TopologyGraph({ domains, clusters, edges, pressureZoneLabel, pressureZoneState, focusedDomain, onNodeSelect, onPressureZoneClick, activePressureZone, isS1, cognitionOverlay }) {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [selectedAnchor, setSelectedAnchor] = useState(null)
  const svgRef = useRef(null)

  const clusterMap = useMemo(() => {
    const map = {}
    ;(clusters || []).forEach(c => { map[c.cluster_id] = { ...c, domains: [] } })
    ;(domains || []).forEach(d => { if (map[d.cluster_id]) map[d.cluster_id].domains.push(d) })
    return map
  }, [domains, clusters])

  const connectedTo = useMemo(() => {
    const map = {}
    ;(edges || []).forEach(e => {
      if (!map[e.source_domain]) map[e.source_domain] = new Set()
      if (!map[e.target_domain]) map[e.target_domain] = new Set()
      map[e.source_domain].add(e.target_domain)
      map[e.target_domain].add(e.source_domain)
    })
    return map
  }, [edges])

  const handleNodeEnter = useCallback((domainId) => { setHoveredNode(domainId) }, [])
  const handleNodeLeave = useCallback(() => { setHoveredNode(null) }, [])
  const handleNodeClick = useCallback((d) => {
    if (d.zone_anchor) {
      setSelectedAnchor(prev => prev === d.domain_id ? null : d.domain_id)
    }
    if (onNodeSelect) onNodeSelect(d.domain_id)
  }, [onNodeSelect])
  const handleBgClick = useCallback(() => {
    setSelectedAnchor(null)
    if (onNodeSelect) onNodeSelect(null)
  }, [onNodeSelect])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setSelectedAnchor(null)
        if (onNodeSelect) onNodeSelect(null)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onNodeSelect])

  useEffect(() => {
    if (focusedDomain && svgRef.current) {
      svgRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [focusedDomain])

  const highlightSet = useMemo(() => {
    const anchor = selectedAnchor || focusedDomain
    if (!anchor) return null
    const set = new Set([anchor])
    const conn = connectedTo[anchor]
    if (conn) conn.forEach(id => set.add(id))
    return set
  }, [selectedAnchor, focusedDomain, connectedTo])

  const cognitionEmphasis = useMemo(() => {
    if (!cognitionOverlay) return null
    return new Set(cognitionOverlay.emphasis_domains || [])
  }, [cognitionOverlay])

  const cognitionDim = useMemo(() => {
    if (!cognitionOverlay) return null
    return new Set(cognitionOverlay.dim_domains || [])
  }, [cognitionOverlay])

  const cognitionAdvisory = useMemo(() => {
    if (!cognitionOverlay) return null
    return new Set(cognitionOverlay.advisory_zones || [])
  }, [cognitionOverlay])

  const visibleIds = Object.keys(clusterMap).filter(id => clusterMap[id].domains.length > 0).sort()
  if (visibleIds.length === 0) return null

  const legendH = 36
  const nodeSpX = 110, nodeSpY = 66
  const cluPadTop = 24, cluPadLeft = 18
  const gap = 14
  const maxPerRow = isS1 ? Math.min(Math.ceil(Math.sqrt(visibleIds.length)), 5) : 3

  function clusterRect(id) {
    const n = clusterMap[id].domains.length
    const cols = Math.min(n, 2)
    const rows = Math.ceil(n / Math.max(cols, 1))
    const w = cluPadLeft * 2 + Math.max(cols, 1) * nodeSpX
    const h = cluPadTop + Math.max(rows, 1) * nodeSpY + 8
    return { w, h, cols: Math.max(cols, 1), rows }
  }

  const rowGroups = []
  for (let i = 0; i < visibleIds.length; i += maxPerRow) {
    rowGroups.push(visibleIds.slice(i, i + maxPerRow))
  }

  const layouts = {}
  let curY = 8
  let maxRowW = 0
  rowGroups.forEach(rowIds => {
    const rects = rowIds.map(clusterRect)
    const rowH = Math.max(...rects.map(r => r.h), 0)
    let curX = 8
    rowIds.forEach((id, i) => {
      const r = rects[i]
      layouts[id] = { x: curX, y: curY, w: r.w, h: rowH, cols: r.cols }
      curX += r.w + gap
    })
    maxRowW = Math.max(maxRowW, curX)
    curY += rowH + gap
  })

  const W = maxRowW + 8

  const allPos = {}
  Object.entries(layouts).forEach(([cid, lay]) => {
    clusterMap[cid].domains.forEach((d, di) => {
      const col = di % lay.cols
      const row = Math.floor(di / lay.cols)
      allPos[d.domain_id] = {
        cx: lay.x + cluPadLeft + nodeSpX / 2 + col * nodeSpX,
        cy: lay.y + cluPadTop + nodeSpY / 2 + row * nodeSpY,
      }
    })
  })

  const svgH = curY + legendH
  const tooltipH = 52
  const tooltipW = 180

  const hoveredDomain = hoveredNode && (domains || []).find(d => d.domain_id === hoveredNode)
  const hoveredPos = hoveredNode && allPos[hoveredNode]

  return (
    <div className="topo-graph-wrap">
      <div className="topo-graph-heading">{isS1 ? 'STRUCTURAL EXECUTION TOPOLOGY' : 'SEMANTIC DOMAIN TOPOLOGY (WITH STRUCTURAL BACKING)'}</div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${svgH}`} className="topo-graph-svg" role="img" aria-label="Semantic domain topology graph — click zone anchors to highlight connections">
        <defs>
          <marker id="arr-green" markerWidth={10} markerHeight={10} refX={8} refY={4} orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L0,8 L10,4 z" fill="#3fb950" /></marker>
          <marker id="arr-blue" markerWidth={10} markerHeight={10} refX={8} refY={4} orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L0,8 L10,4 z" fill="#58a6ff" /></marker>
          <marker id="arr-amber" markerWidth={10} markerHeight={10} refX={8} refY={4} orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L0,8 L10,4 z" fill="#d29922" /></marker>
          <marker id="arr-gray" markerWidth={10} markerHeight={10} refX={8} refY={4} orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L0,8 L10,4 z" fill="#8b949e" /></marker>
        </defs>

        <rect x="0" y="0" width={W} height={svgH} fill="transparent" onClick={handleBgClick} />

        {Object.entries(layouts).map(([cid, lay]) => {
          const cl = clusterMap[cid]
          const color = cl.color_accent || '#2a2f40'
          return (
            <g key={cid}>
              <rect x={lay.x} y={lay.y} width={lay.w} height={lay.h} rx={9}
                fill={color} fillOpacity={0.06} stroke={color} strokeWidth={1} strokeOpacity={0.35} />
              <text x={lay.x + lay.w / 2} y={lay.y + 16} textAnchor="middle"
                fontSize={8.3} letterSpacing="0.12em" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontWeight={600} fill={color} fillOpacity={0.55}>
                {(cl.cluster_label || cid).toUpperCase()}
              </text>
            </g>
          )
        })}

        {pressureZoneState && pressureZoneState.zones && pressureZoneState.zones.map(zone => {
          const resolveEntityPos = (entityId) => {
            if (allPos[entityId]) return allPos[entityId]
            if (/^DOM-\d+$/.test(entityId)) {
              const byDom = domains.find(d => d.dominant_dom_id === entityId)
              if (byDom && allPos[byDom.domain_id]) return allPos[byDom.domain_id]
            }
            return null
          }
          const members = (zone.member_entities || []).filter(m => resolveEntityPos(m.entity_id))
          if (members.length === 0) return null
          const positions = members.map(m => resolveEntityPos(m.entity_id))
          const minX = Math.min(...positions.map(p => p.cx)) - 30
          const minY = Math.min(...positions.map(p => p.cy)) - 30
          const maxX = Math.max(...positions.map(p => p.cx)) + 30
          const maxY = Math.max(...positions.map(p => p.cy)) + 30
          const isActive = activePressureZone === zone.zone_id
          const isCognitionTarget = cognitionOverlay && cognitionOverlay.overlay_mode === 'PRESSURE_ZONE' && cognitionOverlay.pressure_zone_emphasis === zone.zone_id
          const zoneColor = zone.zone_class === 'COMPOUND_ZONE' ? '#ff6b6b' : '#ff9e4a'
          return (
            <g key={zone.zone_id}
              onClick={(e) => { e.stopPropagation(); onPressureZoneClick && onPressureZoneClick(zone.zone_id) }}
              style={{ cursor: onPressureZoneClick ? 'pointer' : 'default' }}
            >
              <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} rx={12}
                fill={zoneColor} fillOpacity={isCognitionTarget ? 0.12 : isActive ? 0.08 : 0.03}
                stroke={zoneColor} strokeWidth={isCognitionTarget ? 2 : isActive ? 1.5 : 1} strokeOpacity={isCognitionTarget ? 0.8 : isActive ? 0.6 : 0.25}
                strokeDasharray={isCognitionTarget || isActive ? undefined : '6,3'}
                style={{ transition: 'fill-opacity 0.2s, stroke-opacity 0.2s, stroke-width 0.2s' }}
              >
                {isCognitionTarget && (
                  <animate attributeName="stroke-opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
                )}
              </rect>
              <text x={minX + 6} y={minY + 10} fontSize={isCognitionTarget ? 5.5 : 5} fontWeight={600}
                fill={zoneColor} fillOpacity={isCognitionTarget ? 0.95 : isActive ? 0.8 : 0.45}
                fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" letterSpacing="0.08em">
                {zone.zone_id} · {zone.zone_class.replace(/_/g, ' ')}{isCognitionTarget ? ` · ${(zone.aggregated_conditions || []).length} CONDITIONS` : ` · ${(zone.aggregated_conditions || []).length} condition${(zone.aggregated_conditions || []).length !== 1 ? 's' : ''}`}
              </text>
            </g>
          )
        })}

        {(edges || []).map((e, i) => {
          const from = allPos[e.source_domain]
          const to = allPos[e.target_domain]
          if (!from || !to) return null
          const color = EDGE_COLORS[e.relationship_type] || '#8b949e'
          const markerKey = color === '#3fb950' ? 'green' : color === '#58a6ff' ? 'blue' : color === '#d29922' ? 'amber' : 'gray'
          const dash = EDGE_DASHED[e.relationship_type] || undefined
          const dx = to.cx - from.cx, dy = to.cy - from.cy
          const len = Math.sqrt(dx * dx + dy * dy)
          if (len === 0) return null
          const ux = dx / len, uy = dy / len
          const sD = (domains || []).find(dd => dd.domain_id === e.source_domain)
          const tD = (domains || []).find(dd => dd.domain_id === e.target_domain)
          const sR = (sD && (sD.structurally_backed || sD.lineage_status === 'PARTIAL')) ? 18 : 14
          const tR = (tD && (tD.structurally_backed || tD.lineage_status === 'PARTIAL')) ? 18 : 14

          const dimmed = highlightSet && !highlightSet.has(e.source_domain) && !highlightSet.has(e.target_domain)
          const bright = highlightSet && highlightSet.has(e.source_domain) && highlightSet.has(e.target_domain)

          return (
            <line key={`e-${i}`}
              x1={from.cx + ux * sR} y1={from.cy + uy * sR}
              x2={to.cx - ux * (tR + 4)} y2={to.cy - uy * (tR + 4)}
              stroke={color} strokeOpacity={dimmed ? 0.12 : bright ? 0.95 : 0.6} strokeWidth={bright ? 2 : 1.5}
              markerEnd={`url(#arr-${markerKey})`}
              strokeDasharray={dash}
              style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
            />
          )
        })}

        {cognitionOverlay && cognitionOverlay.corridor_paths && cognitionOverlay.corridor_paths.length > 0 && (
          <g className="cognition-corridors">
            {cognitionOverlay.corridor_paths.map((cp, ci) => {
              const from = allPos[cp.from]
              const to = allPos[cp.to]
              if (!from || !to) return null
              const evidenceDerived = cp.evidence === 'semantic_topology_edge'
              const color = cp.type === 'pressure_propagation' ? '#ff6b6b'
                : cp.type === 'import_consumer' ? '#ff9e4a'
                : cp.type === 'import_hub_outbound' ? '#4a9eff'
                : cp.type === 'propagation' ? '#ff9e4a'
                : '#ff9e4a'
              const dx = to.cx - from.cx, dy = to.cy - from.cy
              const len = Math.sqrt(dx * dx + dy * dy)
              if (len === 0) return null
              const ux = dx / len, uy = dy / len
              const x1 = from.cx + ux * 20, y1 = from.cy + uy * 20
              const x2 = to.cx - ux * 20, y2 = to.cy - uy * 20
              return (
                <line key={`cc-${ci}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={color}
                  strokeWidth={evidenceDerived ? 2.5 : 3}
                  strokeOpacity={evidenceDerived ? 0.55 : 0.35}
                  strokeDasharray={evidenceDerived ? undefined : '8,4'}
                  markerEnd={evidenceDerived ? `url(#arr-${color === '#ff9e4a' ? 'amber' : color === '#4a9eff' ? 'blue' : 'gray'})` : undefined}
                  style={{ transition: 'stroke-opacity 0.3s' }}
                />
              )
            })}
          </g>
        )}

        {(() => {
          const incomingAbove = {}
          ;(edges || []).forEach(e => {
            const from = allPos[e.source_domain]
            const to = allPos[e.target_domain]
            if (from && to && from.cy < to.cy) {
              incomingAbove[e.target_domain] = (incomingAbove[e.target_domain] || 0) + 1
            }
          })
          const overlayColor = cognitionOverlay ? (COGNITION_OVERLAY_COLORS[cognitionOverlay.overlay_mode] || '#4a9eff') : null
          return (domains || []).map(d => {
          const pos = allPos[d.domain_id]
          if (!pos) return null
          const st = nodeStyle(d)
          const backed = d.structurally_backed || d.lineage_status === 'PARTIAL'
          const isPZ = d.zone_anchor
          const innerR = backed ? 18 : 14
          const glowR = backed ? 22 : 17
          const lines = splitLabel(d.business_label || d.domain_name, 15)
          const crowdedAbove = (incomingAbove[d.domain_id] || 0) > 1

          const isEmphasized = cognitionEmphasis && cognitionEmphasis.has(d.domain_id)
          const isCognitionDimmed = cognitionDim && cognitionDim.has(d.domain_id)
          const isAdvisory = cognitionAdvisory && cognitionAdvisory.has(d.domain_id)

          const dimmed = cognitionOverlay
            ? isCognitionDimmed
            : (highlightSet && !highlightSet.has(d.domain_id))
          const nodeOpacity = dimmed ? 0.18 : 1
          const isSelected = selectedAnchor === d.domain_id

          const block = (fullReport => null)
          const evidBlock = cognitionOverlay && cognitionOverlay.overlay_mode === 'DELIVERY_FRAGILITY'
            ? (() => {
                const blocks = (cognitionOverlay._blocks || [])
                return blocks.find(b => {
                  const match = (domains || []).find(dd => dd.domain_name === b.domain_alias || dd.business_label === b.domain_alias)
                  return match && match.domain_id === d.domain_id
                })
              })()
            : null
          const roleColor = evidBlock ? (ROLE_COLORS[evidBlock.propagation_role] || null) : null

          return (
            <g key={d.domain_id}
               opacity={nodeOpacity}
               style={{ transition: 'opacity 0.3s', cursor: isPZ || onNodeSelect ? 'pointer' : 'default' }}
               onMouseEnter={() => handleNodeEnter(d.domain_id)}
               onMouseLeave={handleNodeLeave}
               onClick={(e) => { e.stopPropagation(); handleNodeClick(d) }}
            >
              {isEmphasized && cognitionOverlay && (
                <circle cx={pos.cx} cy={pos.cy} r={innerR + 8}
                  fill="none" stroke={overlayColor} strokeWidth={cognitionOverlay.overlay_mode === 'PRESSURE_ZONE' ? 2 : 1.5} strokeOpacity={0.5}
                  strokeDasharray={isAdvisory ? '3,3' : undefined}
                  style={{ transition: 'stroke-opacity 0.3s' }}
                >
                  {(cognitionOverlay.overlay_mode === 'IMPORT_PRESSURE' || cognitionOverlay.overlay_mode === 'PRESSURE_ZONE' || cognitionOverlay.overlay_mode === 'COMPOUND_CONVERGENCE') && (
                    <animate attributeName="stroke-opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                  )}
                  {cognitionOverlay.overlay_mode === 'CLUSTER_PRESSURE' && (
                    <animate attributeName="stroke-opacity" values="0.5;0.2;0.5" dur="4s" repeatCount="indefinite" />
                  )}
                </circle>
              )}
              {!isEmphasized && !isCognitionDimmed && isAdvisory && cognitionOverlay && cognitionOverlay.overlay_mode === 'PRESSURE_ZONE' && (
                <circle cx={pos.cx} cy={pos.cy} r={innerR + 6}
                  fill="none" stroke="#5e6d8a" strokeWidth={1} strokeOpacity={0.4}
                  strokeDasharray="3,3"
                  style={{ transition: 'stroke-opacity 0.3s' }}
                />
              )}
              {isPZ && !cognitionOverlay && (
                <circle cx={pos.cx} cy={pos.cy} r={24}
                  fill="none" stroke={isSelected ? '#ffd700' : '#ff7b72'} strokeWidth={isSelected ? 2 : 1.3} strokeDasharray={isSelected ? undefined : '3,2'} opacity={isSelected ? 1 : 0.7}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }} />
              )}
              {isPZ && cognitionOverlay && (
                <circle cx={pos.cx} cy={pos.cy} r={24}
                  fill="none" stroke={isEmphasized ? overlayColor : '#ff7b72'} strokeWidth={isEmphasized ? 2 : 1} strokeDasharray={isEmphasized ? undefined : '3,2'} opacity={isEmphasized ? 0.8 : 0.3}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s, opacity 0.3s' }} />
              )}
              <circle cx={pos.cx} cy={pos.cy} r={glowR}
                fill={isEmphasized && cognitionOverlay ? overlayColor : st.glow} fillOpacity={isEmphasized ? 0.22 : st.glowOp} />
              <circle cx={pos.cx} cy={pos.cy} r={innerR}
                fill={st.fill} stroke={isEmphasized && cognitionOverlay ? overlayColor : st.stroke} strokeWidth={isEmphasized ? 2.2 : st.sw}
                strokeDasharray={(st.dashed && !isEmphasized) ? '4,3' : (isAdvisory && isEmphasized) ? '4,3' : undefined}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }} />
              {backed && d.confidence > 0 && !cognitionOverlay && (
                crowdedAbove
                  ? <text x={pos.cx + innerR + 4} y={pos.cy - innerR + 2} textAnchor="start"
                      fontSize={5.75} fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontWeight={600} fill={confColor(d)}>
                      {d.confidence.toFixed(2)}
                    </text>
                  : <text x={pos.cx} y={pos.cy - innerR - 3} textAnchor="middle"
                      fontSize={5.75} fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontWeight={600} fill={confColor(d)}>
                      {d.confidence.toFixed(2)}
                    </text>
              )}
              {lines.map((line, li) => (
                <text key={li} x={pos.cx} y={pos.cy - 3 + li * 8} textAnchor="middle"
                  fontSize={5.5} fill={isEmphasized ? '#e0e6f0' : isCognitionDimmed ? '#4a5570' : '#9aa4c0'}
                  fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                  style={{ transition: 'fill 0.3s' }}>{line}</text>
              ))}
            </g>
          )
        })})()}

        {hoveredDomain && hoveredPos && (() => {
          const tx = Math.min(hoveredPos.cx - tooltipW / 2, W - tooltipW - 8)
          const ty = hoveredPos.cy - tooltipOffsetY(hoveredPos.cy)
          const tp = 6
          return (
            <g className="topo-tooltip" style={{ pointerEvents: 'none' }}>
              <rect x={tx} y={ty} width={tooltipW} height={tooltipH} rx={4}
                fill="#141720" stroke="#2a2f40" strokeWidth={1} fillOpacity={0.96} />
              <text x={tx + tp} y={ty + 14}
                fontSize={6.5} fontWeight={600} fill="#ccd6f6" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace">
                {hoveredDomain.business_label || hoveredDomain.domain_name}
              </text>
              <text x={tx + tp} y={ty + 25}
                fontSize={5.5} fill="#7a8aaa" fontFamily="-apple-system, sans-serif">
                {isS1
                  ? `${hoveredDomain.node_count || '?'} components · ${hoveredDomain.cluster_id}`
                  : `${hoveredDomain.cluster_id} · ${(LINEAGE_LABELS[hoveredDomain.lineage_status] || 'SEMANTIC-ONLY')} · conf ${hoveredDomain.confidence != null ? hoveredDomain.confidence.toFixed(2) : '—'}`}
              </text>
              <text x={tx + tp} y={ty + 36}
                fontSize={5.5} fill={hoveredDomain.zone_anchor ? '#ffd700' : '#6a7a9a'} fontFamily="-apple-system, sans-serif">
                {hoveredDomain.zone_anchor ? (isS1 ? 'Dominant cluster — structural concentration anchor' : 'Zone Anchor — click to highlight connections') : (isS1 ? 'Structural group' : hoveredDomain.structurally_backed ? 'Structurally backed' : 'Semantic-only')}
              </text>
              <text x={tx + tp} y={ty + 47}
                fontSize={5} fill="#5e6d8a" fontFamily="-apple-system, sans-serif">
                {hoveredDomain.dominant_dom_id || hoveredDomain.domain_id}
              </text>
            </g>
          )
        })()}

        {(() => {
          const ly = svgH - legendH + 8
          if (cognitionOverlay && cognitionOverlay.legend_entries && cognitionOverlay.legend_entries.length > 0) {
            let cx = 14
            return (
              <g>
                <text x={cx} y={ly - 2} fontSize={5} fontWeight={700} letterSpacing="0.1em"
                  fill={COGNITION_OVERLAY_COLORS[cognitionOverlay.overlay_mode] || '#4a9eff'} fillOpacity={0.7}
                  fontFamily="ui-monospace, 'SF Mono', Menlo, monospace">
                  {cognitionOverlay.topology_label || cognitionOverlay.overlay_mode}
                </text>
                {cognitionOverlay.legend_entries.map((entry, i) => {
                  const x = 14 + i * 120
                  return (
                    <g key={i}>
                      <circle cx={x} cy={ly + 10} r={3}
                        fill={entry.style === 'dashed' || entry.style === 'dotted' ? 'none' : entry.color}
                        stroke={entry.color} strokeWidth={1.2}
                        strokeDasharray={entry.style === 'dashed' ? '2,2' : entry.style === 'dotted' ? '1,2' : undefined} />
                      <text x={x + 8} y={ly + 13} fontSize={5} fill="#7a8aaa"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">{entry.label}</text>
                    </g>
                  )
                })}
                {cognitionOverlay.evidence_gaps && cognitionOverlay.evidence_gaps.length > 0 && (
                  <text x={14} y={ly + 26} fontSize={4.5} fill="#5e6d8a" fontStyle="italic"
                    fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
                    {cognitionOverlay.evidence_gaps[0].label}
                  </text>
                )}
              </g>
            )
          }
          return isS1 ? (
            <g>
              <circle cx={14} cy={ly} r={3} fill="#58a6ff" />
              <text x={22} y={ly + 3} fontSize={5.5} fill="#6a7593" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">Structural Group</text>
              <circle cx={120} cy={ly} r={3} fill="none" stroke="#ffd700" strokeWidth={1.3} />
              <text x={128} y={ly + 3} fontSize={5.5} fill="#6a7593" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
                Concentration Anchor{pressureZoneLabel ? ` — ${pressureZoneLabel}` : ''}
              </text>
              <text x={14} y={ly + 16} fontSize={4.6} fill="#5e6d8a" fontStyle="italic" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
                Structural clusters from PATH A topology · hover for component counts
              </text>
            </g>
          ) : (
            <g>
              <circle cx={14} cy={ly} r={3} fill="#3fb950" />
              <text x={22} y={ly + 3} fontSize={5.5} fill="#6a7593" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">Grounded</text>
              <circle cx={100} cy={ly} r={3} fill="#d29922" />
              <text x={108} y={ly + 3} fontSize={5.5} fill="#6a7593" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">Weakly Grounded</text>
              <circle cx={14} cy={ly + 13} r={3} fill="none" stroke="#58a6ff" strokeWidth={1.2} />
              <text x={22} y={ly + 16} fontSize={5.5} fill="#6a7593" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
                Primary Pressure Zone{pressureZoneLabel ? ` — ${pressureZoneLabel}` : ''}
              </text>
              <text x={14} y={ly + 28} fontSize={4.6} fill="#5e6d8a" fontStyle="italic" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
                Hover nodes for details · click zone anchors to highlight connections · Escape to reset
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}


function DomainCoverageGrid({ domains, onDomainClick, focusedDomain, isS1 }) {
  if (!domains || domains.length === 0) return null
  return (
    <div className="topo-coverage">
      <div className="topo-coverage-heading">{isS1 ? 'STRUCTURAL DOMAIN COVERAGE' : 'SEMANTIC DOMAIN COVERAGE'}</div>
      <div className="topo-coverage-grid">
        {domains.map(d => {
          const backed = d.structurally_backed
          const partial = d.lineage_status === 'PARTIAL'
          const isPZ = d.zone_anchor
          const lineageLabel = isS1 ? (d.lineage_status || 'STRUCTURAL') : (LINEAGE_LABELS[d.lineage_status] || 'SEMANTIC-ONLY')
          const lineageColor = LINEAGE_COLORS[d.lineage_status] || LINEAGE_COLORS.NONE
          const isFocused = focusedDomain === d.domain_id
          return (
            <div
              key={d.domain_id}
              className={`topo-coverage-card${backed ? ' topo-coverage-card--backed' : ''}${isPZ ? ' topo-coverage-card--pz' : ''}${isFocused ? ' topo-coverage-card--focused' : ''}`}
              onClick={() => onDomainClick && onDomainClick(isFocused ? null : d.domain_id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="topo-coverage-card-header">
                {(backed || partial) && (
                  <span className="topo-coverage-dot" style={{ background: lineageColor }} />
                )}
                <span className="topo-coverage-card-name">{d.business_label || d.domain_name}</span>
              </div>
              <div className="topo-coverage-card-meta">
                {d.cluster_id}{d.dominant_dom_id ? ` · ${d.dominant_dom_id}` : ''}{isPZ ? <>{' · '}<TermHint term="Zone Anchor">Zone Anchor</TermHint></> : ''}
              </div>
              <div className="topo-coverage-card-lineage" style={{ color: lineageColor }}>
                <TermHint term={lineageLabel}>{lineageLabel}</TermHint>{d.confidence > 0 ? ` ${d.confidence.toFixed(2)}` : ''}
              </div>
            </div>
          )
        })}
      </div>
      <div className="topo-coverage-legend">
        {isS1 ? (
          <span className="topo-coverage-legend-item">
            <span className="topo-coverage-dot" style={{ background: '#58a6ff' }} />
            Structural Domains ({domains.length} — PATH A topology, semantic qualification pending)
          </span>
        ) : (
          <>
            <span className="topo-coverage-legend-item">
              <span className="topo-coverage-dot" style={{ background: '#64ffda' }} />
              Structurally Backed ({domains.filter(d => d.structurally_backed).length} domains — EXACT/STRONG/PARTIAL evidence)
            </span>
            <span className="topo-coverage-legend-item">
              <span className="topo-coverage-dot" style={{ background: '#5e6d8a' }} />
              Semantic-Only ({domains.filter(d => d.semantic_only).length} domains — projection layer, no current structural backing)
            </span>
          </>
        )}
        {domains.some(d => d.zone_anchor) && (
          <span className="topo-coverage-legend-item">
            <span className="topo-coverage-dot" style={{ background: '#ffd700' }} />
            <TermHint term="Primary Pressure Zone">Primary Pressure Zone</TermHint>
          </span>
        )}
      </div>
    </div>
  )
}

export default function StructuralTopologyZone({ evidenceBlocks, propagationChains, fullReport, boardroomMode, densityClass }) {
  const [focusedDomain, setFocusedDomain] = useState(null)

  const domainRegistry = (fullReport && fullReport.semantic_domain_registry) || []
  const clusterRegistry = (fullReport && fullReport.semantic_cluster_registry) || []
  const topologyEdges = (fullReport && fullReport.semantic_topology_edges) || []
  const topologySummary = (fullReport && fullReport.topology_summary) || {}
  const propagationSummary = (fullReport && fullReport.propagation_summary) || {}
  const structuralEnrichment = (fullReport && fullReport.structural_enrichment) || null
  const zoneName = propagationSummary.primary_zone_business_label || ''
  const isS1 = (fullReport && fullReport.qualification_level) === 'S1'

  if (domainRegistry.length === 0 && !isS1) return null

  if (boardroomMode) return null

  if (densityClass === 'EXECUTIVE_BALANCED' || densityClass === 'EXECUTIVE_DENSE') {
    return (
      <div className="topo-executive" aria-label={isS1 ? 'Structural execution topology' : 'Structural topology — executive view'}>
        {clusterRegistry.length > 0 && (
          <TopologyGraph
            domains={domainRegistry}
            clusters={clusterRegistry}
            edges={topologyEdges}
            pressureZoneLabel={zoneName}
            focusedDomain={focusedDomain}
            onNodeSelect={setFocusedDomain}
            isS1={isS1}
          />
        )}
        {isS1 && domainRegistry.length === 0 && clusterRegistry.length > 0 && (
          <StructuralComposition topologySummary={topologySummary} isS1={isS1} structuralEnrichment={structuralEnrichment} />
        )}
        {isS1 && structuralEnrichment && structuralEnrichment.available && (
          <StructuralSpinesPanel structuralEnrichment={structuralEnrichment} />
        )}
        {densityClass === 'EXECUTIVE_DENSE' && domainRegistry.length > 0 && (
          <DomainCoverageGrid domains={domainRegistry} onDomainClick={setFocusedDomain} focusedDomain={focusedDomain} isS1={isS1} />
        )}
      </div>
    )
  }

  return (
    <div className={`topo-executive${boardroomMode ? ' topo-executive--boardroom' : ''}`} aria-label={isS1 ? 'Structural execution topology' : 'Structural topology — executive view'}>
      <div className="topo-executive-header">
        <span className="topo-executive-pre">{isS1 ? 'STRUCTURAL TOPOLOGY' : 'STRUCTURAL COMPOSITION'}</span>
      </div>

      <StructuralComposition topologySummary={topologySummary} isS1={isS1} structuralEnrichment={structuralEnrichment} />

      <EvidenceCardPanel evidenceBlocks={evidenceBlocks} />

      {isS1 && <StructuralSpinesPanel structuralEnrichment={structuralEnrichment} />}

      {clusterRegistry.length > 0 && (
        <TopologyGraph
          domains={domainRegistry}
          clusters={clusterRegistry}
          edges={topologyEdges}
          pressureZoneLabel={zoneName}
          focusedDomain={focusedDomain}
          onNodeSelect={setFocusedDomain}
          isS1={isS1}
        />
      )}

      {domainRegistry.length > 0 && (
        <DomainCoverageGrid domains={domainRegistry} onDomainClick={setFocusedDomain} focusedDomain={focusedDomain} isS1={isS1} />
      )}
    </div>
  )
}

import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { PRESSURE_META } from './constants'

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


function StructuralComposition({ topologySummary }) {
  const ts = topologySummary || {}
  const total = ts.semantic_domain_count || 0
  const backed = ts.structurally_backed_count || 0
  const semOnly = ts.semantic_only_count || 0
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

function tooltipOffsetY(cy, row0Y) {
  return cy > row0Y + 60 ? 60 : -30
}

export function TopologyGraph({ domains, clusters, edges, pressureZoneLabel, focusedDomain, onNodeSelect }) {
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

  const clusterIds = Object.keys(clusterMap).sort()
  if (clusterIds.length === 0) return null

  const legendH = 36
  const nodeSpX = 110, nodeSpY = 66
  const cluPadTop = 24, cluPadLeft = 18
  const gap = 14

  const row0Ids = ['CLU-01', 'CLU-02', 'CLU-03'].filter(id => clusterMap[id])
  const row1Ids = ['CLU-04', 'CLU-05'].filter(id => clusterMap[id])

  function clusterRect(id) {
    const n = clusterMap[id].domains.length
    const cols = Math.min(n, 2)
    const rows = Math.ceil(n / cols)
    const w = cluPadLeft * 2 + cols * nodeSpX
    const h = cluPadTop + rows * nodeSpY + 8
    return { w, h, cols, rows }
  }

  const row0Rects = row0Ids.map(clusterRect)
  const row1Rects = row1Ids.map(clusterRect)
  const row0H = Math.max(...row0Rects.map(r => r.h), 0)
  const row1H = row1Rects.length > 0 ? Math.max(...row1Rects.map(r => r.h), 0) : 0
  const row0Y = 8, row1Y = row0Y + row0H + gap

  const layouts = {}
  let x0 = 8
  row0Ids.forEach((id, i) => {
    const r = row0Rects[i]
    layouts[id] = { x: x0, y: row0Y, w: r.w, h: row0H, cols: r.cols }
    x0 += r.w + gap
  })
  let x1 = 8
  row1Ids.forEach((id, i) => {
    const r = row1Rects[i]
    layouts[id] = { x: x1, y: row1Y, w: r.w, h: row1H, cols: r.cols }
    x1 += r.w + gap
  })

  const contentW = Math.max(x0, x1)
  const W = contentW + 8

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

  const svgH = row1Y + row1H + legendH
  const tooltipH = 52
  const tooltipW = 180

  const hoveredDomain = hoveredNode && (domains || []).find(d => d.domain_id === hoveredNode)
  const hoveredPos = hoveredNode && allPos[hoveredNode]

  return (
    <div className="topo-graph-wrap">
      <div className="topo-graph-heading">SEMANTIC DOMAIN TOPOLOGY (WITH STRUCTURAL BACKING)</div>
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

        {(() => {
          const incomingAbove = {}
          ;(edges || []).forEach(e => {
            const from = allPos[e.source_domain]
            const to = allPos[e.target_domain]
            if (from && to && from.cy < to.cy) {
              incomingAbove[e.target_domain] = (incomingAbove[e.target_domain] || 0) + 1
            }
          })
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

          const dimmed = highlightSet && !highlightSet.has(d.domain_id)
          const nodeOpacity = dimmed ? 0.25 : 1
          const isSelected = selectedAnchor === d.domain_id

          return (
            <g key={d.domain_id}
               opacity={nodeOpacity}
               style={{ transition: 'opacity 0.2s', cursor: isPZ ? 'pointer' : 'default' }}
               onMouseEnter={() => handleNodeEnter(d.domain_id)}
               onMouseLeave={handleNodeLeave}
               onClick={(e) => { e.stopPropagation(); handleNodeClick(d) }}
            >
              {isPZ && (
                <circle cx={pos.cx} cy={pos.cy} r={24}
                  fill="none" stroke={isSelected ? '#ffd700' : '#ff7b72'} strokeWidth={isSelected ? 2 : 1.3} strokeDasharray={isSelected ? undefined : '3,2'} opacity={isSelected ? 1 : 0.7}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }} />
              )}
              <circle cx={pos.cx} cy={pos.cy} r={glowR}
                fill={st.glow} fillOpacity={st.glowOp} />
              <circle cx={pos.cx} cy={pos.cy} r={innerR}
                fill={st.fill} stroke={st.stroke} strokeWidth={st.sw}
                strokeDasharray={st.dashed ? '4,3' : undefined} />
              {backed && d.confidence > 0 && (
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
                  fontSize={5.5} fill="#9aa4c0" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace">{line}</text>
              ))}
            </g>
          )
        })})()}

        {hoveredDomain && hoveredPos && (() => {
          const tx = Math.min(hoveredPos.cx - tooltipW / 2, W - tooltipW - 8)
          const ty = hoveredPos.cy - tooltipOffsetY(hoveredPos.cy, row0Y)
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
                {hoveredDomain.cluster_id} · {(LINEAGE_LABELS[hoveredDomain.lineage_status] || 'SEMANTIC-ONLY')} · conf {hoveredDomain.confidence != null ? hoveredDomain.confidence.toFixed(2) : '—'}
              </text>
              <text x={tx + tp} y={ty + 36}
                fontSize={5.5} fill={hoveredDomain.zone_anchor ? '#ffd700' : '#6a7a9a'} fontFamily="-apple-system, sans-serif">
                {hoveredDomain.zone_anchor ? 'Zone Anchor — click to highlight connections' : hoveredDomain.structurally_backed ? 'Structurally backed' : 'Semantic-only'}
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
          return (
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


function DomainCoverageGrid({ domains, onDomainClick, focusedDomain }) {
  if (!domains || domains.length === 0) return null
  return (
    <div className="topo-coverage">
      <div className="topo-coverage-heading">SEMANTIC DOMAIN COVERAGE</div>
      <div className="topo-coverage-grid">
        {domains.map(d => {
          const backed = d.structurally_backed
          const partial = d.lineage_status === 'PARTIAL'
          const isPZ = d.zone_anchor
          const lineageLabel = LINEAGE_LABELS[d.lineage_status] || 'SEMANTIC-ONLY'
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
                {d.cluster_id}{d.dominant_dom_id ? ` · ${d.dominant_dom_id}` : ''}{isPZ ? ' · Zone Anchor' : ''}
              </div>
              <div className="topo-coverage-card-lineage" style={{ color: lineageColor }}>
                {lineageLabel}{d.confidence > 0 ? ` ${d.confidence.toFixed(2)}` : ''}
              </div>
            </div>
          )
        })}
      </div>
      <div className="topo-coverage-legend">
        <span className="topo-coverage-legend-item">
          <span className="topo-coverage-dot" style={{ background: '#64ffda' }} />
          Structurally Backed ({domains.filter(d => d.structurally_backed).length} domains — EXACT/STRONG/PARTIAL evidence)
        </span>
        <span className="topo-coverage-legend-item">
          <span className="topo-coverage-dot" style={{ background: '#5e6d8a' }} />
          Semantic-Only ({domains.filter(d => d.semantic_only).length} domains — projection layer, no current structural backing)
        </span>
        {domains.some(d => d.zone_anchor) && (
          <span className="topo-coverage-legend-item">
            <span className="topo-coverage-dot" style={{ background: '#ffd700' }} />
            Primary Pressure Zone
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
  const zoneName = propagationSummary.primary_zone_business_label || ''

  if (domainRegistry.length === 0) return null

  if (boardroomMode) return null

  if (densityClass === 'EXECUTIVE_BALANCED' || densityClass === 'EXECUTIVE_DENSE') {
    return (
      <div className="topo-executive" aria-label="Structural topology — executive view">
        {clusterRegistry.length > 0 && (
          <TopologyGraph
            domains={domainRegistry}
            clusters={clusterRegistry}
            edges={topologyEdges}
            pressureZoneLabel={zoneName}
            focusedDomain={focusedDomain}
            onNodeSelect={setFocusedDomain}
          />
        )}
        {densityClass === 'EXECUTIVE_DENSE' && (
          <DomainCoverageGrid domains={domainRegistry} onDomainClick={setFocusedDomain} focusedDomain={focusedDomain} />
        )}
      </div>
    )
  }

  return (
    <div className={`topo-executive${boardroomMode ? ' topo-executive--boardroom' : ''}`} aria-label="Structural topology — executive view">
      <div className="topo-executive-header">
        <span className="topo-executive-pre">STRUCTURAL COMPOSITION</span>
      </div>

      <StructuralComposition topologySummary={topologySummary} />

      <EvidenceCardPanel evidenceBlocks={evidenceBlocks} />

      {clusterRegistry.length > 0 && (
        <TopologyGraph
          domains={domainRegistry}
          clusters={clusterRegistry}
          edges={topologyEdges}
          pressureZoneLabel={zoneName}
          focusedDomain={focusedDomain}
          onNodeSelect={setFocusedDomain}
        />
      )}

      <DomainCoverageGrid domains={domainRegistry} onDomainClick={setFocusedDomain} focusedDomain={focusedDomain} />
    </div>
  )
}

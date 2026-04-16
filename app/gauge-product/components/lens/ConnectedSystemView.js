/**
 * components/lens/ConnectedSystemView.js
 * PRODUCTIZE.LENS.GRAPH.RENDER.01
 *
 * Full 17-domain clustered platform graph.
 * Implements Mode 1 (Clustered Capability Map) from lens_graph_rendering_guidance.md.
 *
 * Renders:
 * - 5 thematic cluster enclosures (bounded rounded rectangles)
 * - 17 domain nodes colored by evidence status
 * - 12 curated inter-cluster edges (governed edge vocabulary)
 * - Focus emphasis on Edge Data Acquisition (gn-01)
 * - Legend and "more depth available" indicator
 *
 * Data source: lib/lens/curatedGraphData.js
 * Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01 / PRODUCTIZE.LENS.GRAPH.RENDER.01
 *
 * GOVERNANCE:
 * - All domain names are from the safe admitted 17-domain set.
 * - No component names. No internal IDs. No reconstruction-grade structure.
 * - Edge count: 12 (≤25 limit per graph_leakage_prevention.md §DL-01).
 * - Pre-computed static layout — no force-directed simulation.
 * - Static component — no payload dependency.
 */

import {
  SVG_VIEWBOX,
  CLUSTERS,
  NODES,
  EDGES,
  EDGE_STYLE,
  NODE_STYLE,
  LEGEND,
} from '../../lib/lens/curatedGraphData'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nodeById(id) {
  return NODES.find(n => n.id === id)
}

function getNodeStyle(node) {
  if (node.focus) return NODE_STYLE.focus
  return NODE_STYLE[node.status] || NODE_STYLE.verified
}

// ---------------------------------------------------------------------------
// SVG sub-components
// ---------------------------------------------------------------------------

function ClusterRect({ cluster }) {
  return (
    <rect
      x={cluster.x} y={cluster.y}
      width={cluster.w} height={cluster.h}
      rx={cluster.rx}
      fill="rgba(255,255,255,0.015)"
      stroke={cluster.accent}
      strokeWidth="1"
      strokeOpacity="0.25"
    />
  )
}

function ClusterLabel({ cluster }) {
  return (
    <text
      x={cluster.x + cluster.w / 2}
      y={cluster.y + 20}
      textAnchor="middle"
      fontSize="8.5"
      fontFamily="'SF Mono','Fira Mono',monospace"
      fontWeight="600"
      letterSpacing="0.08em"
      fill={cluster.accent}
      fillOpacity="0.55"
      textTransform="uppercase"
    >
      {cluster.label.toUpperCase()}
    </text>
  )
}

function EdgeLine({ edge }) {
  const src = nodeById(edge.source)
  const tgt = nodeById(edge.target)
  if (!src || !tgt) return null

  const style = EDGE_STYLE[edge.relation] || EDGE_STYLE.connects_to

  return (
    <line
      x1={src.cx} y1={src.cy}
      x2={tgt.cx} y2={tgt.cy}
      stroke={style.stroke}
      strokeWidth="1.2"
      strokeOpacity={style.opacity}
      strokeDasharray={style.dash || undefined}
      strokeLinecap="round"
    >
      <title>{edge.visible_reason}</title>
    </line>
  )
}

function DomainNode({ node }) {
  const style = getNodeStyle(node)
  const lineH  = 11
  const startY = node.cy - ((node.svgLines.length - 1) * lineH) / 2

  return (
    <g role="img" aria-label={node.fullName}>
      <title>{node.fullName}</title>

      {/* Outer glow ring */}
      <circle
        cx={node.cx} cy={node.cy}
        r={node.r + (node.focus ? 12 : 7)}
        fill={style.glow}
        stroke={style.stroke}
        strokeWidth="0.5"
        strokeOpacity={node.focus ? 0.45 : 0.25}
      />

      {/* Main circle */}
      <circle
        cx={node.cx} cy={node.cy}
        r={node.r}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={node.focus ? 1.8 : 1.2}
      />

      {/* Label lines */}
      {node.svgLines.map((line, i) => (
        <text
          key={i}
          x={node.cx}
          y={startY + i * lineH}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={node.focus ? 8.5 : 7.5}
          fontFamily="'SF Mono','Fira Mono',monospace"
          fontWeight={node.focus ? '600' : '400'}
          fill={style.label}
          fillOpacity={node.focus ? 1 : 0.85}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ConnectedSystemView() {
  return (
    <div className="lens-csv-panel">
      <div className="lens-panel-label">CONNECTED SYSTEM VIEW</div>
      <p className="lens-csv-intro">
        17 functional domains mapped across 5 structural clusters.
        Lines indicate governed relationships between domains.
        One domain is highlighted as the intelligence focus.
      </p>

      <div className="lens-csv-svg-outer">
        <svg
          viewBox={SVG_VIEWBOX}
          xmlns="http://www.w3.org/2000/svg"
          className="lens-csv-svg"
          aria-label="Connected system view — 17 platform domains in 5 clusters"
          role="img"
        >
          {/* ── Cluster enclosures (rendered first — behind everything) ── */}
          {CLUSTERS.map(c => (
            <ClusterRect key={c.id} cluster={c} />
          ))}

          {/* ── Edges (behind nodes) ── */}
          {EDGES.map((e, i) => (
            <EdgeLine key={i} edge={e} />
          ))}

          {/* ── Cluster labels (above enclosures, below nodes) ── */}
          {CLUSTERS.map(c => (
            <ClusterLabel key={c.id} cluster={c} />
          ))}

          {/* ── Domain nodes ── */}
          {NODES.map(node => (
            <DomainNode key={node.id} node={node} />
          ))}
        </svg>
      </div>

      <div className="lens-csv-footer">
        <div className="lens-csv-legend">
          {LEGEND.map(item => (
            <div key={item.key} className="lens-csv-legend-item">
              <span className="lens-csv-legend-dot" style={{ background: item.color }} />
              <span className="lens-csv-legend-label">{item.label}</span>
            </div>
          ))}
          <div className="lens-csv-legend-item">
            <span className="lens-csv-legend-edge-sample lens-csv-edge--informs" />
            <span className="lens-csv-legend-label">Informs</span>
          </div>
          <div className="lens-csv-legend-item">
            <span className="lens-csv-legend-edge-sample lens-csv-edge--supports" />
            <span className="lens-csv-legend-label">Supports</span>
          </div>
        </div>
        <div className="lens-csv-depth-note">
          17 domains shown. Capability-level structure and governed trace access available in deeper assessment access.
        </div>
      </div>
    </div>
  )
}

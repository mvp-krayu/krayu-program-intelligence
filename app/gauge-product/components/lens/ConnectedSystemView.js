/**
 * components/lens/ConnectedSystemView.js
 * PRODUCTIZE.LENS.TOPOLOGY.INTELLIGENCE.01
 *
 * SVG network visualization — hub-and-spoke topology.
 * Pure SVG, no external dependencies.
 *
 * Hub: CLM-25 "Operational Readiness" — center
 * Satellites:
 *   CLM-09 "Platform Architecture"    — top-left
 *   CLM-20 "Security Intelligence"    — top-right  (focus glow)
 *   CLM-12 "Assessment Confidence"    — bottom-left
 *   CLM-10 "Execution Pathway"        — bottom-right
 *
 * Node colors from evidence_class. No internal claim IDs exposed in labels.
 * Focus glow on Security Intelligence (CLM-20).
 *
 * Consumes ZONE-2 projection payloads only.
 */

const EC_COLOR = {
  VERIFIED:    { stroke: '#3fb950', fill: '#0d2e1a', glow: 'rgba(63,185,80,0.25)' },
  CONDITIONAL: { stroke: '#d29922', fill: '#1a1600', glow: 'rgba(210,153,34,0.25)' },
  PARTIAL:     { stroke: '#e07a30', fill: '#18100a', glow: 'rgba(224,122,48,0.25)' },
  BLOCKED:     { stroke: '#f85149', fill: '#1a0a0a', glow: 'rgba(248,81,73,0.25)' },
}

const DEFAULT_COLOR = EC_COLOR.BLOCKED

// Layout — all coordinates in a 560 × 320 viewBox
const HUB = { cx: 280, cy: 160, r: 44, label: 'Operational\nReadiness' }

const NODES = [
  { id: 'CLM-09', cx:  90, cy:  72, r: 36, label: 'Platform\nArchitecture', focus: false },
  { id: 'CLM-20', cx: 470, cy:  72, r: 36, label: 'Security\nIntelligence',  focus: true  },
  { id: 'CLM-12', cx:  90, cy: 248, r: 36, label: 'Assessment\nConfidence',  focus: false },
  { id: 'CLM-10', cx: 470, cy: 248, r: 36, label: 'Execution\nPathway',      focus: false },
]

// Peripheral cross-edges (non-hub): PA ↔ AC (left column), SI ↔ EP (right column)
const CROSS_EDGES = [
  { from: 'CLM-09', to: 'CLM-12' },
  { from: 'CLM-20', to: 'CLM-10' },
]

function getColor(payload) {
  if (!payload || payload.error_type || payload.zone !== 'ZONE-2') return DEFAULT_COLOR
  return EC_COLOR[payload.evidence_class] || DEFAULT_COLOR
}

function nodeById(id) {
  return NODES.find(n => n.id === id)
}

function EdgeLine({ x1, y1, x2, y2, dashed }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="#30363d"
      strokeWidth="1.5"
      strokeDasharray={dashed ? '5,4' : undefined}
      strokeLinecap="round"
    />
  )
}

function SpokeEdge({ node, color }) {
  return (
    <line
      x1={HUB.cx} y1={HUB.cy}
      x2={node.cx} y2={node.cy}
      stroke={color.stroke}
      strokeWidth="1.5"
      strokeOpacity="0.4"
      strokeLinecap="round"
    />
  )
}

function NodeCircle({ node, color }) {
  return (
    <>
      {node.focus && (
        <circle
          cx={node.cx} cy={node.cy}
          r={node.r + 10}
          fill={color.glow}
          stroke={color.stroke}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      )}
      <circle
        cx={node.cx} cy={node.cy}
        r={node.r}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth={node.focus ? 2 : 1.5}
      />
    </>
  )
}

function NodeLabel({ node }) {
  const lines = node.label.split('\n')
  const lineH = 13
  const startY = node.cy - ((lines.length - 1) * lineH) / 2

  return (
    <>
      {lines.map((line, i) => (
        <text
          key={i}
          x={node.cx}
          y={startY + i * lineH}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fontFamily="'SF Mono', 'Fira Mono', monospace"
          fill="#c9d1d9"
          fontWeight={node.focus ? '600' : '400'}
        >
          {line}
        </text>
      ))}
    </>
  )
}

function HubNode({ color }) {
  const lines = HUB.label.split('\n')
  const lineH = 14
  const startY = HUB.cy - ((lines.length - 1) * lineH) / 2

  return (
    <>
      <circle
        cx={HUB.cx} cy={HUB.cy}
        r={HUB.r + 6}
        fill={color.glow}
        stroke={color.stroke}
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      <circle
        cx={HUB.cx} cy={HUB.cy}
        r={HUB.r}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth="2"
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={HUB.cx}
          y={startY + i * lineH}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fontFamily="'SF Mono', 'Fira Mono', monospace"
          fill="#c9d1d9"
          fontWeight="600"
        >
          {line}
        </text>
      ))}
    </>
  )
}

export default function ConnectedSystemView({ payloads }) {
  if (!payloads) return null

  const hubColor = getColor(payloads['CLM-25'])

  return (
    <div className="lens-csv-panel">
      <div className="lens-panel-label">CONNECTED SYSTEM VIEW</div>
      <p className="lens-csv-intro">
        Five intelligence domains are structurally connected. Lines indicate assessed evidence relationships.
      </p>
      <div className="lens-csv-svg-wrap">
        <svg
          viewBox="0 0 560 320"
          xmlns="http://www.w3.org/2000/svg"
          className="lens-csv-svg"
          aria-label="Connected system view — five intelligence domains"
        >
          {/* Cross-edges (peripheral, dashed) */}
          {CROSS_EDGES.map(({ from, to }) => {
            const a = nodeById(from)
            const b = nodeById(to)
            if (!a || !b) return null
            return <EdgeLine key={`${from}-${to}`} x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} dashed />
          })}

          {/* Spoke edges hub → satellites */}
          {NODES.map(node => (
            <SpokeEdge key={node.id} node={node} color={getColor(payloads[node.id])} />
          ))}

          {/* Hub */}
          <HubNode color={hubColor} />

          {/* Satellite nodes */}
          {NODES.map(node => {
            const color = getColor(payloads[node.id])
            return (
              <g key={node.id}>
                <NodeCircle node={node} color={color} />
                <NodeLabel node={node} />
              </g>
            )
          })}
        </svg>
      </div>
      <div className="lens-csv-legend">
        {[
          { ec: 'VERIFIED',    label: 'Verified',    color: '#3fb950' },
          { ec: 'CONDITIONAL', label: 'In Progress', color: '#d29922' },
          { ec: 'PARTIAL',     label: 'Partial',     color: '#e07a30' },
          { ec: 'BLOCKED',     label: 'Blocked',     color: '#f85149' },
        ].map(({ ec, label, color }) => (
          <div key={ec} className="lens-csv-legend-item">
            <span className="lens-csv-legend-dot" style={{ background: color }} />
            <span className="lens-csv-legend-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

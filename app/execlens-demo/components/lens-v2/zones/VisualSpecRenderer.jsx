import { useState } from 'react'

const TIER_COLORS = {
  edge_ingestion: { bg: '#1a1520', border: '#3d2a4a', label: '#bb86fc' },
  event_coordination: { bg: '#1a1a20', border: '#2a3a5a', label: '#4a9eff' },
  runtime_fanout: { bg: '#141a1a', border: '#1a3a3a', label: '#64ffda' },
}

const RISK_COLOR = '#ff6b6b'
const WARN_COLOR = '#ff9e4a'
const EVIDENCE_COLOR = '#4a9eff'
const MUTED = '#7a8aaa'
const TEXT = '#e8edf8'
const DIM = '#5a6580'

function EvidenceChip({ label, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 6px', borderRadius: 3,
      fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.05em',
      background: (color || EVIDENCE_COLOR) + '18', color: color || EVIDENCE_COLOR,
      border: `1px solid ${(color || EVIDENCE_COLOR)}40`,
    }}>{label}</span>
  )
}

function BoundaryLine({ y, label, width }) {
  return (
    <g>
      <line x1={20} y1={y} x2={width - 20} y2={y} stroke={DIM} strokeWidth={1} strokeDasharray="6,4" />
      <text x={width / 2} y={y - 6} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace" letterSpacing="0.2em">{label}</text>
    </g>
  )
}

function FlowArrow({ x, y1, y2, label, color }) {
  const mid = (y1 + y2) / 2
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - 6} stroke={color || DIM} strokeWidth={1.5} />
      <polygon points={`${x - 4},${y2 - 8} ${x + 4},${y2 - 8} ${x},${y2}`} fill={color || DIM} />
      {label && <text x={x + 8} y={mid + 3} fill={MUTED} fontSize={8} fontFamily="monospace">{label}</text>}
    </g>
  )
}

function NodeBox({ x, y, w, h, label, sublabel, risk, glow, di }) {
  const fill = risk === 'critical' ? '#2a1015' : risk === 'warn' ? '#2a1e10' : '#1a1e2a'
  const borderColor = risk === 'critical' ? RISK_COLOR : risk === 'warn' ? WARN_COLOR : '#3a4560'
  return (
    <g>
      {glow && <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={6} fill="none" stroke={borderColor} strokeWidth={1} opacity={0.3} />}
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={borderColor} strokeWidth={risk ? 1.5 : 1} />
      {di && (
        <rect x={x - 1} y={y - 1} width={w + 2} height={h + 2} rx={5} fill="none" stroke="#bb86fc" strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
      )}
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 3 : h / 2 + 3)} textAnchor="middle" fill={TEXT} fontSize={10} fontFamily="monospace" fontWeight={risk ? 600 : 400}>{label}</text>
      {sublabel && <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fill={MUTED} fontSize={8} fontFamily="monospace">{sublabel}</text>}
    </g>
  )
}

function RiskCallout({ x, y, label, af, color }) {
  const c = color || RISK_COLOR
  return (
    <g>
      <line x1={x} y1={y} x2={x + 16} y2={y} stroke={c} strokeWidth={1} />
      <circle cx={x + 20} cy={y} r={3} fill={c} />
      <text x={x + 28} y={y + 3} fill={c} fontSize={9} fontFamily="monospace" fontWeight={600}>{af}</text>
      <text x={x + 28} y={y + 14} fill={MUTED} fontSize={8} fontFamily="monospace">{label}</text>
    </g>
  )
}

function RuntimeCoordinationBackboneSVG() {
  const W = 780
  const H = 680

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      <defs>
        <linearGradient id="tier1bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TIER_COLORS.edge_ingestion.bg} />
          <stop offset="100%" stopColor="#161220" />
        </linearGradient>
        <linearGradient id="tier2bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TIER_COLORS.event_coordination.bg} />
          <stop offset="100%" stopColor="#161820" />
        </linearGradient>
        <linearGradient id="tier3bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TIER_COLORS.runtime_fanout.bg} />
          <stop offset="100%" stopColor="#121818" />
        </linearGradient>
      </defs>

      {/* Tier backgrounds */}
      <rect x={10} y={10} width={W - 20} height={200} rx={6} fill="url(#tier1bg)" stroke={TIER_COLORS.edge_ingestion.border} strokeWidth={1} />
      <rect x={10} y={230} width={W - 20} height={220} rx={6} fill="url(#tier2bg)" stroke={TIER_COLORS.event_coordination.border} strokeWidth={1} />
      <rect x={10} y={470} width={W - 20} height={200} rx={6} fill="url(#tier3bg)" stroke={TIER_COLORS.runtime_fanout.border} strokeWidth={1} />

      {/* Tier labels */}
      <text x={30} y={32} fill={TIER_COLORS.edge_ingestion.label} fontSize={9} fontFamily="monospace" letterSpacing="0.15em" fontWeight={600}>TIER 1 · EDGE INGESTION</text>
      <text x={30} y={252} fill={TIER_COLORS.event_coordination.label} fontSize={9} fontFamily="monospace" letterSpacing="0.15em" fontWeight={600}>TIER 2 · EVENT COORDINATION BACKBONE</text>
      <text x={30} y={492} fill={TIER_COLORS.runtime_fanout.label} fontSize={9} fontFamily="monospace" letterSpacing="0.15em" fontWeight={600}>TIER 3 · RUNTIME FAN-OUT</text>

      {/* Boundary lines */}
      <BoundaryLine y={220} label="HARDWARE BOUNDARY" width={W} />
      <BoundaryLine y={460} label="APPLICATION BOUNDARY" width={W} />

      {/* === TIER 1: Edge Ingestion === */}
      {/* Hardware node */}
      <NodeBox x={290} y={48} w={200} h={32} label="NXP i.MX 95 Hardware" sublabel="" />

      {/* Edge agents */}
      <NodeBox x={210} y={100} w={160} h={28} label="sensor_collector.py" sublabel="" />
      <NodeBox x={410} y={100} w={160} h={28} label="hasi_bridge.py" sublabel="" />
      <text x={600} y={118} fill={DIM} fontSize={8} fontFamily="monospace">systemd services</text>

      {/* Lines from HW to agents */}
      <line x1={360} y1={80} x2={290} y2={100} stroke={DIM} strokeWidth={1} />
      <line x1={420} y1={80} x2={490} y2={100} stroke={DIM} strokeWidth={1} />

      {/* Arrows from agents to broker */}
      <FlowArrow x={290} y1={128} y2={155} label="" color="#ff9e4a" />
      <FlowArrow x={490} y1={128} y2={155} label="" color="#ff9e4a" />
      <text x={390} y={145} textAnchor="middle" fill="#ff9e4a" fontSize={8} fontFamily="monospace">MQTT publish</text>

      {/* MQTT Broker — SPOF */}
      <NodeBox x={240} y={158} w={300} h={36} label="mqtt.blueedge.network:8883" sublabel="" risk="critical" glow />

      {/* SPOF callout */}
      <RiskCallout x={548} y={170} label="Single point of failure — all edge telemetry" af="AF-003" />

      {/* Arrow from broker down */}
      <FlowArrow x={390} y1={194} y2={230} label="4 topic channels" color="#ff9e4a" />

      {/* === TIER 2: Event Coordination === */}
      {/* Event emitter */}
      <NodeBox x={215} y={270} w={350} h={42} label="fleet-event-emitter.service.ts" sublabel="53 events · 17 emitters · 74 subscriptions" di />
      <text x={580} y={280} fill="#bb86fc" fontSize={8} fontFamily="monospace">@Global DI</text>
      <text x={580} y={292} fill={DIM} fontSize={8} fontFamily="monospace">injected without</text>
      <text x={580} y={303} fill={DIM} fontSize={8} fontFamily="monospace">import edge</text>

      {/* Concentration callout */}
      <RiskCallout x={548} y={330} label="Handler failure = systemic, not regional" af="AF-004" color={WARN_COLOR} />

      {/* Fan-out to 4 handlers */}
      <FlowArrow x={290} y1={312} y2={358} color={TIER_COLORS.event_coordination.label} />
      <FlowArrow x={350} y1={312} y2={358} color={TIER_COLORS.event_coordination.label} />
      <FlowArrow x={410} y1={312} y2={358} color={TIER_COLORS.event_coordination.label} />
      <FlowArrow x={470} y1={312} y2={358} color={TIER_COLORS.event_coordination.label} />

      {/* Handler boxes */}
      <NodeBox x={265} y={360} w={50} h={24} label="H-A" />
      <NodeBox x={325} y={360} w={50} h={24} label="H-B" />
      <NodeBox x={385} y={360} w={50} h={24} label="H-C" />
      <NodeBox x={445} y={360} w={50} h={24} label="H-D" />

      {/* Handler domain labels */}
      <text x={290} y={404} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">Fleet Core</text>
      <text x={290} y={413} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">Operations</text>
      <text x={350} y={404} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">Telemetry</text>
      <text x={350} y={413} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">Transport</text>
      <text x={410} y={404} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">Analytics</text>
      <text x={410} y={413} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">Intelligence</text>
      <text x={470} y={404} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">5 domains</text>
      <text x={470} y={413} textAnchor="middle" fill={MUTED} fontSize={7} fontFamily="monospace">(systemic)</text>

      {/* Ratio label */}
      <text x={390} y={440} textAnchor="middle" fill={WARN_COLOR} fontSize={9} fontFamily="monospace" fontWeight={600}>13.3:1 events-to-handlers ratio</text>

      {/* === TIER 3: Runtime Fan-Out === */}
      {/* WebSocket gateway */}
      <NodeBox x={240} y={510} w={300} h={36} label="fleet.gateway.ts" sublabel="12 streams · 16 consumers · 5 source domains" risk="warn" glow />

      {/* Choke point callout */}
      <RiskCallout x={548} y={522} label="WebSocket choke point — live visibility" af="AF-005" color={WARN_COLOR} />

      {/* Fan-out to consumers */}
      <FlowArrow x={290} y1={546} y2={580} color={TIER_COLORS.runtime_fanout.label} />
      <FlowArrow x={340} y1={546} y2={580} color={TIER_COLORS.runtime_fanout.label} />
      <FlowArrow x={390} y1={546} y2={580} color={TIER_COLORS.runtime_fanout.label} />
      <FlowArrow x={440} y1={546} y2={580} color={TIER_COLORS.runtime_fanout.label} />
      <FlowArrow x={490} y1={546} y2={580} color={TIER_COLORS.runtime_fanout.label} />

      {/* Consumer labels */}
      <NodeBox x={255} y={582} w={70} h={22} label="Positions" />
      <NodeBox x={335} y={582} w={50} h={22} label="Alerts" />
      <NodeBox x={395} y={582} w={60} h={22} label="Telemetry" />
      <NodeBox x={465} y={582} w={60} h={22} label="Safety" />
      <NodeBox x={535} y={582} w={75} h={22} label="Compliance" />

      {/* Frontend consumer */}
      <rect x={280} y={618} width={220} height={26} rx={4} fill="#1a1e2a" stroke="#64ffda40" strokeWidth={1} />
      <text x={390} y={635} textAnchor="middle" fill="#64ffda" fontSize={9} fontFamily="monospace">Frontend Application receives all streams</text>

      {/* Evidence chips row */}
      <g transform="translate(30, 658)">
        <text x={0} y={0} fill={DIM} fontSize={8} fontFamily="monospace" letterSpacing="0.1em">EVIDENCE</text>
        <rect x={68} y={-9} width={52} height={14} rx={3} fill="#ff6b6b18" stroke="#ff6b6b40" strokeWidth={1} />
        <text x={72} y={1} fill={RISK_COLOR} fontSize={8} fontFamily="monospace">RSIG-001</text>
        <rect x={126} y={-9} width={52} height={14} rx={3} fill="#ff6b6b18" stroke="#ff6b6b40" strokeWidth={1} />
        <text x={130} y={1} fill={RISK_COLOR} fontSize={8} fontFamily="monospace">RSIG-002</text>
        <rect x={184} y={-9} width={52} height={14} rx={3} fill="#ff6b6b18" stroke="#ff6b6b40" strokeWidth={1} />
        <text x={188} y={1} fill={RISK_COLOR} fontSize={8} fontFamily="monospace">RSIG-003</text>
        <rect x={242} y={-9} width={52} height={14} rx={3} fill="#ff6b6b18" stroke="#ff6b6b40" strokeWidth={1} />
        <text x={246} y={1} fill={RISK_COLOR} fontSize={8} fontFamily="monospace">RSIG-004</text>

        <rect x={310} y={-9} width={72} height={14} rx={3} fill="#ff9e4a18" stroke="#ff9e4a40" strokeWidth={1} />
        <text x={314} y={1} fill={WARN_COLOR} fontSize={8} fontFamily="monospace">MQTT_FLOW</text>
        <rect x={388} y={-9} width={72} height={14} rx={3} fill="#4a9eff18" stroke="#4a9eff40" strokeWidth={1} />
        <text x={392} y={1} fill={EVIDENCE_COLOR} fontSize={8} fontFamily="monospace">EVENT_FLOW</text>
        <rect x={466} y={-9} width={56} height={14} rx={3} fill="#64ffda18" stroke="#64ffda40" strokeWidth={1} />
        <text x={470} y={1} fill="#64ffda" fontSize={8} fontFamily="monospace">WS_FLOW</text>
        <rect x={528} y={-9} width={60} height={14} rx={3} fill="#bb86fc18" stroke="#bb86fc40" strokeWidth={1} />
        <text x={532} y={1} fill="#bb86fc" fontSize={8} fontFamily="monospace">DI_MODULE</text>
      </g>
    </svg>
  )
}

function extractGravityData(fullReport, crossDomainCognition) {
  const cdc = crossDomainCognition || (fullReport && fullReport._crossDomainCognition)
  const domConc = (cdc && cdc.domain_concentration) || []
  const execCenter = (cdc && cdc.execution_center) || null
  const execConc = (cdc && cdc.execution_concentration) || []
  const narratives = (cdc && cdc.domain_narratives) || []

  const staticDomains = domConc.slice(0, 5).map(d => d.domain || d)
  const runtimeDomains = execConc.slice(0, 5).map(d => d.domain || d)

  const staticSet = new Set(staticDomains.map(d => (typeof d === 'string' ? d : '').toLowerCase()))
  const runtimeSet = new Set(runtimeDomains.map(d => (typeof d === 'string' ? d : '').toLowerCase()))

  const staticOnly = staticDomains.filter(d => !runtimeSet.has((typeof d === 'string' ? d : '').toLowerCase()))
  const runtimeOnly = runtimeDomains.filter(d => !staticSet.has((typeof d === 'string' ? d : '').toLowerCase()))
  const overlap = staticDomains.filter(d => runtimeSet.has((typeof d === 'string' ? d : '').toLowerCase()))

  const staticCount = domConc.length
  const runtimeCount = execConc.length

  return { staticOnly: staticOnly.slice(0, 3), runtimeOnly: runtimeOnly.slice(0, 4), overlap: overlap.slice(0, 3), staticCount, runtimeCount, execCenter, hasDivergence: runtimeOnly.length > 0 }
}

function wrapLabel(domain) {
  if (typeof domain !== 'string') return ['Unknown']
  if (domain.length <= 22) return [domain]
  const mid = Math.ceil(domain.length / 2)
  const spaceNear = domain.lastIndexOf(' ', mid)
  if (spaceNear > 4) return [domain.slice(0, spaceNear), domain.slice(spaceNear + 1)]
  return [domain]
}

function DualGravityMapSVG({ fullReport, crossDomainCognition }) {
  const data = extractGravityData(fullReport, crossDomainCognition)
  const maxNodes = Math.max(data.staticOnly.length, data.runtimeOnly.length, data.overlap.length, 1)
  const nodeSpacing = 90
  const contentH = 80 + maxNodes * nodeSpacing + 120
  const W = 780
  const H = Math.max(400, contentH)

  const colStatic = 120
  const colOverlap = 390
  const colRuntime = 660
  const nodeW = 180
  const nodeH = 44
  const topY = 80

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      <defs>
        <linearGradient id="staticGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1e2a" />
          <stop offset="100%" stopColor="#1a1e2a00" />
        </linearGradient>
        <linearGradient id="runtimeGrad" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#1a1520" />
          <stop offset="100%" stopColor="#1a152000" />
        </linearGradient>
        <linearGradient id="overlapGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1e1000" />
          <stop offset="30%" stopColor="#2a1e1030" />
          <stop offset="70%" stopColor="#2a1e1030" />
          <stop offset="100%" stopColor="#2a1e1000" />
        </linearGradient>
      </defs>

      {/* Column backgrounds */}
      <rect x={10} y={50} width={260} height={H - 130} rx={6} fill="url(#staticGrad)" stroke="#3a456020" strokeWidth={1} />
      {data.overlap.length > 0 && <rect x={280} y={50} width={220} height={H - 130} rx={0} fill="url(#overlapGrad)" />}
      <rect x={510} y={50} width={260} height={H - 130} rx={6} fill="url(#runtimeGrad)" stroke="#3d2a4a20" strokeWidth={1} />

      {/* Column headers */}
      <text x={colStatic} y={38} textAnchor="middle" fill={MUTED} fontSize={9} fontFamily="monospace" letterSpacing="0.15em" fontWeight={600}>STATIC GRAVITY</text>
      <text x={colStatic} y={50} textAnchor="middle" fill={DIM} fontSize={8} fontFamily="monospace">import graph authority</text>
      {data.overlap.length > 0 && <>
        <text x={colOverlap} y={38} textAnchor="middle" fill={WARN_COLOR} fontSize={9} fontFamily="monospace" letterSpacing="0.15em" fontWeight={600}>CONVERGENCE</text>
        <text x={colOverlap} y={50} textAnchor="middle" fill={DIM} fontSize={8} fontFamily="monospace">both authorities present</text>
      </>}
      <text x={colRuntime} y={38} textAnchor="middle" fill="#bb86fc" fontSize={9} fontFamily="monospace" letterSpacing="0.15em" fontWeight={600}>OPERATIONAL GRAVITY</text>
      <text x={colRuntime} y={50} textAnchor="middle" fill={DIM} fontSize={8} fontFamily="monospace">runtime authority</text>

      {/* Static-only nodes */}
      {data.staticOnly.map((d, i) => {
        const y = topY + i * nodeSpacing
        const lines = wrapLabel(d)
        const x = colStatic - nodeW / 2
        return (
          <g key={`s${i}`}>
            <rect x={x} y={y} width={nodeW} height={nodeH} rx={4} fill="#1a1e2a" stroke="#3a4560" strokeWidth={1} />
            {lines.map((line, li) => (
              <text key={li} x={colStatic} y={y + (lines.length === 1 ? 26 : 18 + li * 13)} textAnchor="middle" fill={TEXT} fontSize={10} fontFamily="monospace">{line}</text>
            ))}
          </g>
        )
      })}

      {/* Overlap nodes */}
      {data.overlap.map((d, i) => {
        const y = topY + i * nodeSpacing + 30
        const lines = wrapLabel(d)
        const w = 160
        const x = colOverlap - w / 2
        return (
          <g key={`o${i}`}>
            <rect x={x} y={y} width={w} height={nodeH} rx={4} fill="#2a1e10" stroke={WARN_COLOR + '60'} strokeWidth={1.5} />
            {lines.map((line, li) => (
              <text key={li} x={colOverlap} y={y + (lines.length === 1 ? 26 : 18 + li * 13)} textAnchor="middle" fill="#ffd7a0" fontSize={10} fontFamily="monospace">{line}</text>
            ))}
          </g>
        )
      })}

      {/* Runtime-only nodes (divergent) */}
      {data.runtimeOnly.map((d, i) => {
        const y = topY + i * nodeSpacing
        const lines = wrapLabel(d)
        const x = colRuntime - nodeW / 2
        return (
          <g key={`r${i}`}>
            <rect x={x - 2} y={y - 2} width={nodeW + 4} height={nodeH + 4} rx={6} fill="none" stroke="#bb86fc30" strokeWidth={1} />
            <rect x={x} y={y} width={nodeW} height={nodeH} rx={4} fill="#1a1520" stroke="#bb86fc60" strokeWidth={1} />
            {lines.map((line, li) => (
              <text key={li} x={colRuntime} y={y + (lines.length === 1 ? 26 : 18 + li * 13)} textAnchor="middle" fill={TEXT} fontSize={10} fontFamily="monospace">{line}</text>
            ))}
            <text x={x + nodeW + 8} y={y + nodeH / 2 + 4} fill="#bb86fc" fontSize={12} fontFamily="monospace" fontWeight={700}>Δ</text>
          </g>
        )
      })}

      {/* Connection lines: static → overlap */}
      {data.overlap.length > 0 && data.staticOnly.map((_, si) => {
        const sy = topY + si * nodeSpacing + nodeH / 2
        return data.overlap.map((_, oi) => {
          const oy = topY + oi * nodeSpacing + 30 + nodeH / 2
          return <line key={`so${si}${oi}`} x1={colStatic + nodeW / 2} y1={sy} x2={colOverlap - 80} y2={oy} stroke={DIM} strokeWidth={1} strokeDasharray="4,3" />
        })
      })}

      {/* Connection lines: overlap → runtime */}
      {data.overlap.length > 0 && data.overlap.map((_, oi) => {
        const oy = topY + oi * nodeSpacing + 30 + nodeH / 2
        return data.runtimeOnly.map((_, ri) => {
          const ry = topY + ri * nodeSpacing + nodeH / 2
          return <line key={`or${oi}${ri}`} x1={colOverlap + 80} y1={oy} x2={colRuntime - nodeW / 2} y2={ry} stroke="#bb86fc40" strokeWidth={1} strokeDasharray="4,3" />
        })
      })}

      {/* Connection lines: static → runtime (no overlap) */}
      {data.overlap.length === 0 && data.staticOnly.map((_, si) => {
        const sy = topY + si * nodeSpacing + nodeH / 2
        return data.runtimeOnly.slice(0, 2).map((_, ri) => {
          const ry = topY + ri * nodeSpacing + nodeH / 2
          return <line key={`sr${si}${ri}`} x1={colStatic + nodeW / 2} y1={sy} x2={colRuntime - nodeW / 2} y2={ry} stroke={DIM} strokeWidth={1} strokeDasharray="4,3" />
        })
      })}

      {/* Summary */}
      <g transform={`translate(40, ${H - 80})`}>
        <text x={0} y={0} fill={MUTED} fontSize={9} fontFamily="monospace">Static: {data.staticCount} domain{data.staticCount !== 1 ? 's' : ''} in concentration</text>
        <text x={0} y={14} fill={MUTED} fontSize={9} fontFamily="monospace">Runtime: {data.runtimeCount} domain{data.runtimeCount !== 1 ? 's' : ''} in concentration</text>
        {data.hasDivergence && <text x={0} y={32} fill={WARN_COLOR} fontSize={9} fontFamily="monospace" fontWeight={600}>{data.runtimeOnly.length} divergent loci (Δ) — runtime-only authority</text>}
        {!data.hasDivergence && <text x={0} y={32} fill="#64ffda" fontSize={9} fontFamily="monospace">Structural and operational gravity converge</text>}
      </g>
    </svg>
  )
}

const SEV_COLORS = {
  CRITICAL: '#ff6b6b',
  HIGH: '#ff9e4a',
  ELEVATED: '#e6b800',
  MODERATE: '#7a8aaa',
  LOW: '#5a6580',
  NOMINAL: '#3a4560',
}

const SEV_BG = {
  CRITICAL: '#2a1015',
  HIGH: '#2a1e10',
  ELEVATED: '#2a2510',
  MODERATE: '#1a1e2a',
  LOW: '#1a1e2a',
  NOMINAL: '#1a1e2a',
}

function extractRiskData(crossDomainCognition) {
  const cdc = crossDomainCognition || {}
  const domConc = cdc.domain_concentration || []
  const themes = cdc.consequence_themes || []
  const postureLabel = cdc.posture_label || 'Unknown'
  const postureSeverity = cdc.posture_severity || 'MODERATE'
  const postureScope = cdc.posture_scope || 'LOCAL'
  const primaryLocus = cdc.primary_locus || (domConc.length > 0 ? domConc[0].domain : null)
  const consequenceCount = cdc.consequence_count || 0
  const systemicCount = cdc.systemic_count || 0
  return { domConc, themes, postureLabel, postureSeverity, postureScope, primaryLocus, consequenceCount, systemicCount }
}

function RiskConcentrationMapSVG({ crossDomainCognition }) {
  const data = extractRiskData(crossDomainCognition)
  if (data.domConc.length === 0) return null

  const W = 780
  const maxDomains = Math.min(data.domConc.length, 10)
  const topThemes = data.themes.slice(0, 5)
  const H = 130 + maxDomains * 46 + (topThemes.length > 0 ? 30 + topThemes.length * 34 : 0) + 40

  const maxWeight = data.domConc[0]?.weight || 1
  const barMaxW = 340

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      <defs>
        <linearGradient id="riskBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1520" />
          <stop offset="100%" stopColor="#14171f" />
        </linearGradient>
      </defs>

      <rect x={0} y={0} width={W} height={H} rx={6} fill="url(#riskBg)" />

      {/* Posture header */}
      <text x={30} y={32} fill={MUTED} fontSize={11} fontFamily="monospace" letterSpacing="0.15em" fontWeight={600}>RISK CONCENTRATION</text>
      <text x={30} y={56} fill={SEV_COLORS[data.postureSeverity] || TEXT} fontSize={16} fontFamily="monospace" fontWeight={600}>{data.postureLabel}</text>
      <rect x={30} y={66} width={90} height={20} rx={3} fill={SEV_BG[data.postureSeverity]} stroke={(SEV_COLORS[data.postureSeverity] || DIM) + '60'} strokeWidth={1} />
      <text x={75} y={80} textAnchor="middle" fill={SEV_COLORS[data.postureSeverity] || DIM} fontSize={10} fontFamily="monospace" fontWeight={600}>{data.postureSeverity}</text>
      <rect x={126} y={66} width={76} height={20} rx={3} fill={data.postureScope === 'SYSTEMIC' ? '#2a101520' : '#1a1e2a'} stroke={data.postureScope === 'SYSTEMIC' ? '#ff6b6b40' : '#3a4560'} strokeWidth={1} />
      <text x={164} y={80} textAnchor="middle" fill={data.postureScope === 'SYSTEMIC' ? RISK_COLOR : MUTED} fontSize={10} fontFamily="monospace">{data.postureScope}</text>

      {/* Counts */}
      <g transform={`translate(${W - 260}, 32)`}>
        <text x={0} y={0} fill={MUTED} fontSize={12} fontFamily="monospace">{data.consequenceCount} consequences</text>
        <text x={0} y={18} fill={data.systemicCount > 0 ? WARN_COLOR : MUTED} fontSize={12} fontFamily="monospace">{data.systemicCount} systemic</text>
        {data.primaryLocus && <text x={0} y={38} fill={DIM} fontSize={10} fontFamily="monospace">Primary locus:</text>}
        {data.primaryLocus && <text x={0} y={52} fill={MUTED} fontSize={10} fontFamily="monospace">{data.primaryLocus}</text>}
      </g>

      {/* Domain concentration bars */}
      {data.domConc.slice(0, maxDomains).map((d, i) => {
        const y = 108 + i * 46
        const barW = Math.max(10, (d.weight / maxWeight) * barMaxW)
        const csqTypes = d.consequence_types || []
        const sevForDomain = data.themes.find(t => {
          const bg = t.board_grounding
          return bg && bg.primary_zone && bg.primary_zone.includes(d.domain)
        })
        const sev = sevForDomain ? sevForDomain.severity : (d.weight > 0.15 ? 'HIGH' : d.weight > 0.08 ? 'ELEVATED' : 'MODERATE')
        const isPrimary = i === 0

        return (
          <g key={i}>
            {/* Domain label */}
            <text x={30} y={y + 14} fill={isPrimary ? TEXT : MUTED} fontSize={isPrimary ? 13 : 11} fontFamily="monospace" fontWeight={isPrimary ? 600 : 400}>{d.domain}</text>
            {isPrimary && <text x={barMaxW + 42} y={y + 14} fill={RISK_COLOR} fontSize={10} fontFamily="monospace" fontWeight={600}>PRIMARY</text>}

            {/* Bar */}
            <rect x={30} y={y + 22} width={barMaxW} height={12} rx={2} fill="#1a1e2a" stroke="#2a3040" strokeWidth={0.5} />
            <rect x={30} y={y + 22} width={barW} height={12} rx={2} fill={SEV_COLORS[sev] || MUTED} opacity={0.6} />
            <rect x={30} y={y + 22} width={barW} height={12} rx={2} fill="none" stroke={SEV_COLORS[sev] || DIM} strokeWidth={0.5} opacity={0.8} />

            {/* Weight / count */}
            <text x={barMaxW + 42} y={y + 33} fill={DIM} fontSize={11} fontFamily="monospace">{d.condition_count}c · {(d.weight * 100).toFixed(0)}%</text>

            {/* Consequence type chips */}
            {csqTypes.slice(0, 3).map((ct, ci) => (
              <g key={ci}>
                <rect x={barMaxW + 120 + ci * 80} y={y + 20} width={74} height={18} rx={3} fill={(SEV_COLORS[sev] || DIM) + '10'} stroke={(SEV_COLORS[sev] || DIM) + '30'} strokeWidth={0.5} />
                <text x={barMaxW + 124 + ci * 80} y={y + 33} fill={(SEV_COLORS[sev] || DIM)} fontSize={9} fontFamily="monospace">{ct.length > 10 ? ct.slice(0, 9) + '…' : ct}</text>
              </g>
            ))}
          </g>
        )
      })}

      {/* Consequence themes section */}
      {topThemes.length > 0 && (() => {
        const themesY = 108 + maxDomains * 46 + 12
        return (
          <g>
            <line x1={30} y1={themesY} x2={W - 30} y2={themesY} stroke="#2a3040" strokeWidth={0.5} />
            <text x={30} y={themesY + 20} fill={MUTED} fontSize={11} fontFamily="monospace" letterSpacing="0.1em" fontWeight={600}>CONSEQUENCE THEMES</text>
            {topThemes.map((t, i) => {
              const ty = themesY + 32 + i * 34
              const sev = t.severity || 'MODERATE'
              const scope = t.scope || 'LOCAL'
              const domains = t.affected_domains || []
              return (
                <g key={i}>
                  <circle cx={40} cy={ty + 6} r={5} fill={SEV_COLORS[sev]} opacity={0.8} />
                  <text x={54} y={ty + 11} fill={TEXT} fontSize={12} fontFamily="monospace" fontWeight={500}>{t.theme_label}</text>
                  <rect x={54 + (t.theme_label || '').length * 7.2 + 10} y={ty - 2} width={70} height={18} rx={3} fill={SEV_BG[sev]} stroke={(SEV_COLORS[sev]) + '40'} strokeWidth={0.5} />
                  <text x={58 + (t.theme_label || '').length * 7.2 + 10} y={ty + 11} fill={SEV_COLORS[sev]} fontSize={10} fontFamily="monospace">{sev}</text>
                  <text x={58 + (t.theme_label || '').length * 7.2 + 86} y={ty + 11} fill={scope === 'SYSTEMIC' ? RISK_COLOR : DIM} fontSize={10} fontFamily="monospace">{scope}</text>
                  {domains.length > 0 && <text x={58 + (t.theme_label || '').length * 7.2 + 86 + scope.length * 6.2 + 10} y={ty + 11} fill={DIM} fontSize={10} fontFamily="monospace">{domains.length} domain{domains.length !== 1 ? 's' : ''}</text>}
                </g>
              )
            })}
          </g>
        )
      })()}
    </svg>
  )
}

function resolveConfidenceLabel(fullReport) {
  const gl = fullReport && fullReport.governance_lifecycle
  if (gl && gl.available) return { label: 'GOVERNED', color: '#64ffda' }
  const pa = fullReport && fullReport._projectionAuthority
  if (pa && pa.projectionLevel >= 3) return { label: 'QUALIFIED', color: '#4a9eff' }
  if (pa && pa.projectionLevel >= 2) return { label: 'EVIDENCED', color: '#e6b800' }
  return { label: 'ADVISORY', color: '#7a8aaa' }
}

function ExecutiveRiskCard({ crossDomainCognition, fullReport }) {
  const cdc = crossDomainCognition || {}
  const postureLabel = cdc.posture_label
  if (!postureLabel) return null

  const severity = cdc.posture_severity || 'MODERATE'
  const scope = cdc.posture_scope || 'LOCAL'
  const consequenceCount = cdc.consequence_count || 0
  const systemicCount = cdc.systemic_count || 0
  const primaryLocus = cdc.primary_locus || (cdc.domain_concentration && cdc.domain_concentration.length > 0 ? cdc.domain_concentration[0].domain : null)
  const confidence = resolveConfidenceLabel(fullReport)
  const themes = cdc.consequence_themes || []
  const primaryTheme = themes.length > 0 ? themes[0] : null

  const sevColor = SEV_COLORS[severity] || MUTED
  const scopeColor = scope === 'SYSTEMIC' ? RISK_COLOR : scope === 'REGIONAL' ? WARN_COLOR : '#64ffda'
  const ratio = consequenceCount > 0 ? systemicCount / consequenceCount : 0

  const badgeStyle = (color) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: 3,
    fontSize: 10, fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.04em',
    color, background: color + '12', border: `1px solid ${color}35`,
  })

  return (
    <div style={{ padding: '10px 0 14px' }}>
      {/* Posture + badges — single line */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 15, fontFamily: 'monospace', fontWeight: 700, color: sevColor }}>{postureLabel}</span>
        <span style={badgeStyle(sevColor)}>{severity}</span>
        <span style={badgeStyle(scopeColor)}>{scope}</span>
        <span style={badgeStyle(confidence.color)}>{confidence.label}</span>
      </div>

      {/* Metrics line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
        {consequenceCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={60} height={4} style={{ display: 'block' }}>
              <rect x={0} y={0} width={60} height={4} rx={2} fill="#1a1e2a" />
              <rect x={0} y={0} width={Math.max(4, ratio * 60)} height={4} rx={2} fill={sevColor} opacity={0.6} />
            </svg>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: systemicCount > 0 ? sevColor : MUTED }}>
              {systemicCount}/{consequenceCount} systemic
            </span>
          </div>
        )}
        {primaryLocus && (
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: MUTED }}>
            <span style={{ color: DIM, letterSpacing: '0.06em', marginRight: 4 }}>exposure</span>
            <span style={{ color: TEXT }}>{primaryLocus}</span>
          </span>
        )}
      </div>

      {/* Key theme — subtle */}
      {primaryTheme && (
        <div style={{ marginTop: 6, fontSize: 10, fontFamily: 'monospace', color: DIM }}>
          {primaryTheme.theme_label}
          {primaryTheme.severity && <span style={{ color: SEV_COLORS[primaryTheme.severity] || DIM, marginLeft: 6 }}>{primaryTheme.severity}</span>}
        </div>
      )}
    </div>
  )
}

export default function VisualSpecRenderer({ specId, fullReport, crossDomainCognition }) {
  if (specId === 'runtime_coordination_backbone') {
    return (
      <div style={{ padding: '12px 0' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: MUTED, marginBottom: 4, fontFamily: 'monospace' }}>VISUAL SPEC · RUNTIME COORDINATION BACKBONE</div>
        <div style={{ fontSize: 12, color: TEXT, marginBottom: 12, fontFamily: 'monospace' }}>Operational coordination architecture — invisible to import graph</div>
        <RuntimeCoordinationBackboneSVG />
      </div>
    )
  }
  if (specId === 'dual_gravity_map') {
    return (
      <div style={{ padding: '12px 0' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: MUTED, marginBottom: 4, fontFamily: 'monospace' }}>VISUAL SPEC · DUAL GRAVITY MAP</div>
        <div style={{ fontSize: 12, color: TEXT, marginBottom: 12, fontFamily: 'monospace' }}>Structural vs operational authority divergence</div>
        <DualGravityMapSVG fullReport={fullReport} crossDomainCognition={crossDomainCognition} />
      </div>
    )
  }
  if (specId === 'executive_risk_card') {
    return <ExecutiveRiskCard crossDomainCognition={crossDomainCognition} fullReport={fullReport} />
  }
  if (specId === 'risk_concentration_map') {
    return (
      <div style={{ padding: '12px 0' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', color: MUTED, marginBottom: 4, fontFamily: 'monospace' }}>VISUAL SPEC · RISK CONCENTRATION MAP</div>
        <div style={{ fontSize: 12, color: TEXT, marginBottom: 12, fontFamily: 'monospace' }}>Where structural and operational risk concentrates across domains</div>
        <RiskConcentrationMapSVG crossDomainCognition={crossDomainCognition} />
      </div>
    )
  }
  return null
}

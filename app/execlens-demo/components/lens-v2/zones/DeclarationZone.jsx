import { STATE_LABELS } from './constants'

function CompactForensicBar({ title, fullReport }) {
  const sigs = fullReport.signal_interpretations || []
  const rsigCount = sigs.filter(s => s.signal_family === 'RSIG').length
  const synResult = fullReport._synthesisResult
  const conditions = synResult ? (synResult.conditions || []).filter(c => c.severity !== 'NOMINAL') : []
  const critical = conditions.filter(c => c.severity === 'CRITICAL' || c.severity === 'HIGH')
  const qClass = fullReport.qualifier_class || ''
  const pa = fullReport._projectionAuthority
  const pLabel = pa ? pa.projectionLabel : null
  const gl = fullReport.governance_lifecycle
  const transitions = gl && gl.available ? gl.transition_count : 0

  return (
    <div className="declaration-zone declaration-zone--forensic-compact">
      <span className="declaration-fc-title">{title}</span>
      <span className="declaration-fc-sep">·</span>
      {qClass && <><span className="declaration-fc-tag">{qClass}</span><span className="declaration-fc-sep">·</span></>}
      {pLabel && <><span className="declaration-fc-tag">{pLabel}</span><span className="declaration-fc-sep">·</span></>}
      <span className="declaration-fc-metric">Signals {sigs.length}</span>
      <span className="declaration-fc-sep">·</span>
      <span className="declaration-fc-metric">Conditions {conditions.length}</span>
      <span className="declaration-fc-sep">·</span>
      <span className="declaration-fc-metric declaration-fc-metric--critical">Critical {critical.length}</span>
      {rsigCount > 0 && <><span className="declaration-fc-sep">·</span><span className="declaration-fc-metric declaration-fc-metric--runtime">Runtime {rsigCount}</span></>}
      {transitions > 0 && <><span className="declaration-fc-sep">·</span><span className="declaration-fc-metric">Transitions {transitions}</span></>}
    </div>
  )
}

export default function DeclarationZone({ renderState, adapted, boardroomMode, fullReport, boardroomProjection, densityClass }) {
  if (boardroomMode) return null

  if (densityClass === 'OPERATOR_DENSE' && fullReport) {
    return <CompactForensicBar title="OPERATOR FORENSICS" fullReport={fullReport} />
  }

  if (densityClass === 'EXECUTIVE_DENSE' && fullReport) {
    return <CompactForensicBar title="STRUCTURAL EXPLORATION" fullReport={fullReport} />
  }

  if (densityClass === 'EXECUTIVE_BALANCED' && fullReport) {
    return <CompactForensicBar title="NARRATIVE INTERPRETATION" fullReport={fullReport} />
  }

  const label = STATE_LABELS[renderState] || renderState.replace(/_/g, ' ')
  return (
    <div className="declaration-zone">
      <div className="declaration-pre-label">OPERATIONAL POSTURE</div>
      <div className="declaration-state">{label}</div>
      <div className="declaration-scope">
        <span className="declaration-scope-item">3 Domains</span>
        <span className="declaration-scope-sep">·</span>
        <span className="declaration-scope-item">47 Clusters</span>
        <span className="declaration-scope-sep">·</span>
        <span className="declaration-scope-item">Partial Coverage</span>
      </div>
    </div>
  )
}

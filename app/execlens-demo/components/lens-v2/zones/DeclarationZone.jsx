import { STATE_LABELS } from './constants'

export default function DeclarationZone({ renderState, adapted, boardroomMode, fullReport, boardroomProjection, densityClass }) {
  if (boardroomMode) return null

  if (densityClass === 'OPERATOR_DENSE' && fullReport) {
    const sigs = fullReport.signal_interpretations || []
    const rsigCount = sigs.filter(s => s.signal_family === 'RSIG').length
    const synResult = fullReport._synthesisResult
    const conditions = synResult ? (synResult.conditions || []).filter(c => c.severity !== 'NOMINAL') : []
    const critical = conditions.filter(c => c.severity === 'CRITICAL' || c.severity === 'HIGH')
    const qClass = fullReport.qualifier_class
    const gl = fullReport.governance_lifecycle
    const transitions = gl && gl.available ? gl.transition_count : 0

    return (
      <div className="declaration-zone declaration-zone--forensic">
        <div className="declaration-forensic-grid">
          <div className="declaration-forensic-cell">
            <span className="declaration-forensic-count">{sigs.length}</span>
            <span className="declaration-forensic-label">signals</span>
          </div>
          <div className="declaration-forensic-cell">
            <span className="declaration-forensic-count">{conditions.length}</span>
            <span className="declaration-forensic-label">conditions</span>
          </div>
          <div className="declaration-forensic-cell declaration-forensic-cell--critical">
            <span className="declaration-forensic-count">{critical.length}</span>
            <span className="declaration-forensic-label">critical</span>
          </div>
          {rsigCount > 0 && (
            <div className="declaration-forensic-cell declaration-forensic-cell--runtime">
              <span className="declaration-forensic-count">{rsigCount}</span>
              <span className="declaration-forensic-label">runtime</span>
            </div>
          )}
          {transitions > 0 && (
            <div className="declaration-forensic-cell">
              <span className="declaration-forensic-count">{transitions}</span>
              <span className="declaration-forensic-label">transitions</span>
            </div>
          )}
        </div>
        <div className="declaration-forensic-meta">
          {qClass && <span className="declaration-forensic-tag">{qClass}</span>}
          <span className="declaration-forensic-tag">{rsigCount > 0 ? 'Structural + Runtime' : 'Structural'} evidence</span>
        </div>
      </div>
    )
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

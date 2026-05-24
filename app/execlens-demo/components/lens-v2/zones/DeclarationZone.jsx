import { STATE_LABELS } from './constants'

const POSTURE_LABELS = {
  INVESTIGATE: 'INVESTIGATE',
  PROCEED: 'PROCEED',
  ESCALATE: 'ESCALATE',
  HOLD: 'HOLD',
}

const POSTURE_RATIONALE = {
  INVESTIGATE: 'Structural evidence is incomplete. Decision requires further grounding before executive action.',
  PROCEED: 'Structural evidence supports forward movement. All critical domains are grounded.',
  ESCALATE: 'Pressure signals exceed operational thresholds. Immediate executive attention required.',
  HOLD: 'Evidence state is indeterminate. Await additional structural grounding.',
}

function BoardroomDeclarationZone({ fullReport }) {
  const rs = (fullReport && fullReport.readiness_summary) || {}
  const gl = fullReport && fullReport.governance_lifecycle
  const isGovernedS1Plus = gl && gl.available && gl.s_level && ['S1', 'S2', 'S3'].includes(gl.s_level)

  if (isGovernedS1Plus) {
    const sigs = (fullReport && fullReport.signal_interpretations) || []
    const activated = sigs.filter(s => s.severity !== 'NOMINAL')
    const activeFamilies = [...new Set(activated.map(s => s.signal_family).filter(Boolean))]
    const tensionCount = activeFamilies.length
    const tensionSuffix = tensionCount > 0
      ? `${tensionCount} STRUCTURAL TENSION${tensionCount > 1 ? 'S' : ''}`
      : 'NO ELEVATED PRESSURE'
    return (
      <div className="declaration-zone declaration-zone--boardroom declaration-zone--governed">
        <div className="declaration-boardroom-pre">GOVERNED INTELLIGENCE POSTURE</div>
        <div className="declaration-boardroom-posture" data-posture="GOVERNED" data-level={gl.s_level}>
          {gl.s_level} GOVERNED
        </div>
        <div className="declaration-boardroom-tension" data-active={String(activated.length > 0)}>
          {tensionSuffix}
        </div>
        <div className="declaration-boardroom-rationale">
          {gl.qualification_provenance === 'GOVERNED_LIFECYCLE'
            ? 'Intelligence qualified through governed lifecycle — operator review, evidence enrichment, deterministic revalidation, and constitutional anchor verification.'
            : 'Intelligence qualified through structural governance. Evidence substrate proven.'}
        </div>
      </div>
    )
  }

  const posture = rs.posture || 'INVESTIGATE'
  const postureLabel = POSTURE_LABELS[posture] || posture
  const rationale = POSTURE_RATIONALE[posture] || ''

  return (
    <div className="declaration-zone declaration-zone--boardroom">
      <div className="declaration-boardroom-pre">DECISION POSTURE</div>
      <div className="declaration-boardroom-posture" data-posture={posture}>
        {postureLabel}
      </div>
      <div className="declaration-boardroom-rationale">{rationale}</div>
    </div>
  )
}

export default function DeclarationZone({ renderState, adapted, boardroomMode, fullReport }) {
  if (boardroomMode) {
    return <BoardroomDeclarationZone fullReport={fullReport} />
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

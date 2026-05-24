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

function BoardroomDeclarationZone({ fullReport, boardroomProjection }) {
  const bp = boardroomProjection
  const qp = bp && bp.qualification_posture
  const ts = bp && bp.tension_summary

  if (qp && qp.governed) {
    return (
      <div className="declaration-zone declaration-zone--boardroom declaration-zone--governed">
        <div className="declaration-boardroom-pre">GOVERNED INTELLIGENCE POSTURE</div>
        <div className="declaration-boardroom-posture" data-posture="GOVERNED" data-level={qp.s_level}>
          {qp.posture_label}
        </div>
        <div className="declaration-boardroom-tension" data-active={String(ts.tension_count > 0)}>
          {ts.tension_label}
        </div>
        <div className="declaration-boardroom-rationale">
          {qp.provenance_summary
            ? 'Intelligence qualified through governed lifecycle — operator review, evidence enrichment, deterministic revalidation, and constitutional anchor verification.'
            : 'Intelligence qualified through structural governance. Evidence substrate proven.'}
        </div>
      </div>
    )
  }

  const rs = (fullReport && fullReport.readiness_summary) || {}
  const posture = (qp && qp.posture_label) || rs.posture || 'INVESTIGATE'
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

export default function DeclarationZone({ renderState, adapted, boardroomMode, fullReport, boardroomProjection }) {
  if (boardroomMode) {
    return <BoardroomDeclarationZone fullReport={fullReport} boardroomProjection={boardroomProjection} />
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

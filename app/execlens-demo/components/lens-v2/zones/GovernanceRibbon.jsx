import { useState } from 'react'

function PostureField({ label, value, color }) {
  return (
    <span className="gov-posture-field">
      <span className="gov-posture-label">{label}</span>
      <span className="gov-posture-value" style={color ? { color } : undefined}>{value}</span>
    </span>
  )
}

function InvariantChips({ governance }) {
  const entries = Object.entries(governance)
  const allPass = entries.every(([, v]) => v === true)
  return (
    <div className={`gov-invariants-strip${allPass ? '' : ' gov-invariants-strip--fail'}`}>
      {entries.map(([key, val]) => (
        <span key={key} className={`gov-item${val ? ' gov-pass' : ' gov-fail'}`}>
          <span className="gov-dot">{val ? '✓' : '✗'}</span>
          <span className="gov-key">{key.replace(/_/g, ' ')}</span>
        </span>
      ))}
    </div>
  )
}

export default function GovernanceRibbon({
  governance,
  persona,
  substrateBinding,
  qualifierClass,
  qualifierLabel,
}) {
  const [invariantsOpen, setInvariantsOpen] = useState(false)
  const entries = Object.entries(governance)
  const allPass = entries.every(([, v]) => v === true)

  if (persona !== 'OPERATOR_DENSE') {
    return (
      <div className={`gov-ribbon${allPass ? '' : ' gov-ribbon--fail'}`}>
        <span className="gov-label">GOVERNANCE</span>
        <div className="gov-items">
          {entries.map(([key, val]) => (
            <span key={key} className={`gov-item${val ? ' gov-pass' : ' gov-fail'}`}>
              <span className="gov-dot">{val ? '✓' : '✗'}</span>
              <span className="gov-key">{key.replace(/_/g, ' ')}</span>
            </span>
          ))}
        </div>
        <a href="/" className="gov-back" title="Return to executive overview">← Overview</a>
      </div>
    )
  }

  const tp = substrateBinding?.trustPosture
  const sb = substrateBinding?.structuralBacking
  const dv = substrateBinding?.debtVisibility

  const sLevel = tp?.s_state || '—'
  const qClass = qualifierClass || tp?.q_class || '—'
  const posture = tp?.label || '—'
  const postureColor = tp?.color || undefined
  const reconText = sb ? `${sb.reconciled}/${sb.total_domains}` : '—'
  const qualLabel = qualifierLabel || '—'
  const blockerCount = dv?.blocking_count ?? 0

  return (
    <div className="gov-ribbon gov-ribbon--operator">
      <div className="gov-posture">
        <span className="gov-label">GOVERNANCE POSTURE</span>
        <div className="gov-posture-fields">
          <PostureField label="S-LEVEL" value={sLevel} color={postureColor} />
          <PostureField label="Q-CLASS" value={qClass} />
          <PostureField label="POSTURE" value={posture} color={postureColor} />
          <PostureField label="RECONCILIATION" value={reconText} />
          <PostureField label="QUALIFIER" value={qualLabel} />
          <PostureField label="BLOCKERS" value={blockerCount === 0 ? 'none' : `${blockerCount} blocking`} color={blockerCount > 0 ? '#ff6b6b' : '#64ffda'} />
        </div>
      </div>
      <div className="gov-invariants">
        <button
          className="gov-invariants-toggle"
          onClick={() => setInvariantsOpen(prev => !prev)}
          type="button"
          aria-expanded={invariantsOpen}
        >
          <span className="gov-invariants-summary">
            {entries.length} governance invariants · {allPass ? 'all pass' : `${entries.filter(([,v]) => !v).length} failing`}
          </span>
          <span className="gov-invariants-caret">{invariantsOpen ? '▴' : '▾'}</span>
        </button>
        {invariantsOpen && <InvariantChips governance={governance} />}
      </div>
      <a href="/" className="gov-back" title="Return to executive overview">← Overview</a>
    </div>
  )
}

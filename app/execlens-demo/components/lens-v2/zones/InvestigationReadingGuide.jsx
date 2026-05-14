import { useState, useCallback } from 'react'

const TERM_DECODE_MAP = {
  'ORIGIN': {
    executive: 'This domain is the structural source — pressure originates here.',
    technical: 'Primary attribution in the propagation chain. Pressure generation point in the directed dependency graph.',
  },
  'PASS-THROUGH': {
    executive: 'This domain conducts pressure from upstream — it carries load without generating it.',
    technical: 'Secondary attribution. Conducts propagated structural load from ORIGIN without local generation.',
  },
  'PASS_THROUGH': {
    executive: 'This domain conducts pressure from upstream — it carries load without generating it.',
    technical: 'Secondary attribution. Conducts propagated structural load from ORIGIN without local generation.',
  },
  'RECEIVER': {
    executive: 'This domain absorbs pressure at the end of the chain — terminal structural load.',
    technical: 'Terminal absorption point. Receives propagated pressure without further downstream propagation.',
  },
  'HIGH': {
    executive: 'Significant structural concentration — this area demands attention.',
    technical: 'Signal value substantially exceeds the activation threshold relative to normalized cluster baseline.',
  },
  'ELEVATED': {
    executive: 'Above-normal structural weight — worth understanding whether proportional to the domain\'s role.',
    technical: 'Signal value exceeds the activation threshold. Structural load is disproportionate to normalized baseline.',
  },
  'MODERATE': {
    executive: 'Within expected range but on the higher side — monitor, not act.',
    technical: 'Signal value approaches but does not exceed the activation threshold.',
  },
  'LOW': {
    executive: 'Normal structural weight — no pressure concerns.',
    technical: 'Signal value well within the normalized baseline. No activation.',
  },
  'structurally backed': {
    executive: 'Real file-level evidence confirms this domain — findings are grounded.',
    technical: 'Reconciled against structural evidence artifacts. Grounding status Q-00 or Q-01.',
  },
  'semantic-only': {
    executive: 'This domain exists in the model but lacks structural confirmation — treat as advisory.',
    technical: 'No reconciled structural evidence. Grounding status Q-02+. Qualifier mandate applies.',
  },
  'advisory bound': {
    executive: 'This finding requires advisory confirmation before executive action — evidence is partial.',
    technical: 'Qualifier mandate active. Signal derives from Q-02+ grounded domain. Executive commitment requires confirmation.',
  },
  'Confidence': {
    executive: 'How much structural evidence supports this particular finding.',
    technical: 'Qualifier classification (Q-00 through Q-04) mapped to trust label. Higher confidence = stronger structural grounding.',
  },
}

export function TermHint({ term, children }) {
  const [show, setShow] = useState(false)
  const decode = TERM_DECODE_MAP[term]
  if (!decode) return children || term

  const handleEnter = useCallback(() => setShow(true), [])
  const handleLeave = useCallback(() => setShow(false), [])

  return (
    <span
      className="term-hint"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-has-decode="true"
    >
      {children || term}
      {show && (
        <span className="term-hint-popup" role="tooltip">
          <span className="term-hint-popup-exec">{decode.executive}</span>
          <span className="term-hint-popup-tech">{decode.technical}</span>
        </span>
      )}
    </span>
  )
}

export default function InvestigationReadingGuide() {
  return (
    <div className="reading-guide-preamble" role="region" aria-label="Investigation reading guide">
      <div className="reading-guide-preamble-label">HOW TO READ THIS VIEW</div>
      <div className="reading-guide-preamble-body">
        <p className="reading-guide-prose">
          This investigation surface presents structural evidence organized by propagation — how pressure moves through the system. Each domain carries a <strong>propagation role</strong>: origins generate pressure, pass-throughs conduct it, receivers absorb it. When you see elevated pressure on a pass-through domain, it typically reflects upstream origination, not local problems.
        </p>
        <p className="reading-guide-prose">
          <strong>Pressure tiers</strong> (HIGH, ELEVATED, MODERATE, LOW) are derived from structural signal computation — not subjective assessment. They measure a domain's structural footprint against the system's total mass. Pressure is not inherently negative; a delivery-focused domain will naturally carry more weight than a coordination layer. What matters is whether it's proportional.
        </p>
        <p className="reading-guide-prose">
          When multiple signals co-activate across the same structural region, that creates a <strong>compound zone</strong> — convergent pressure from independent sources. This is the primary indicator that pressure is systemic rather than localized, and it amplifies exposure non-linearly.
        </p>
        <p className="reading-guide-prose reading-guide-prose--hint">
          Terms with a dotted underline carry contextual definitions — hover to decode.
        </p>
      </div>
    </div>
  )
}

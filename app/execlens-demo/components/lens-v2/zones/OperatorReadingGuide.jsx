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
  'S2': {
    executive: 'Governed Lifecycle — structural evidence has been qualified through a governed review process.',
    technical: 'SQO S-level 2. Semantic propositions have been reviewed and accepted. Structural evidence is under governed lifecycle management.',
  },
  'L1': {
    executive: 'File structure level — the most granular analysis, measuring individual file import dependencies.',
    technical: 'Derivation Level 1: ISIG signals computed from file-level import graph analysis. Invisible at architectural level.',
  },
  'L3': {
    executive: 'Architectural binding — the deepest structural analysis level, measuring cross-domain dependencies.',
    technical: 'Derivation Level 3: PSIG signals computed from cross-domain coupling metrics at the architectural binding plane.',
  },
  'RICHNESS': {
    executive: 'How complete and detailed the structural evidence is for this specimen.',
    technical: 'Evidence richness dimension: measures domain coverage, signal depth, structural backing ratio, and enrichment completeness.',
  },
  'GOVERNANCE': {
    executive: 'Whether this specimen has been through governed qualification — reviewed and accepted by authority.',
    technical: 'Governance dimension: tracks SQO S-level, proposition review status, and qualification provenance.',
  },
  'RECONCILIATION': {
    executive: 'Whether semantic claims match structural reality — are the domain descriptions confirmed by code evidence?',
    technical: 'Reconciliation dimension: measures alignment between semantic propositions and structural evidence artifacts. UNRECONCILED means semantic claims await structural confirmation.',
  },
  'UNRECONCILED': {
    executive: 'Semantic descriptions exist but structural evidence has not yet confirmed them — findings are advisory.',
    technical: 'Reconciliation status: semantic propositions have not been matched against structural evidence artifacts. Qualifier mandate Q-02+ applies.',
  },
  'Executive Ready': {
    executive: 'This specimen has passed all qualification gates for executive consumption — evidence is structurally grounded and governance-reviewed.',
    technical: 'QualificationPostureResolver output: S-level ≥ S2, evidence richness sufficient, governance lifecycle active. Ready for executive decision support.',
  },
  'Qualified': {
    executive: 'Evidence has been through a formal governed review process and accepted — not just computed, but reviewed.',
    technical: 'Qualification provenance: GOVERNED_LIFECYCLE. Propositions reviewed and accepted. S-level earned through operational progression, not assigned.',
  },
  'LIVE SUBSTRATE': {
    executive: 'Structural evidence is loaded and active — this is a live operational view, not a static report.',
    technical: 'Runtime substrate status: structural evidence pipeline is connected and data is flowing from governed artifacts.',
  },
  'Semantic Continuity Only': {
    executive: 'Structural descriptions carry forward from prior analysis but have not been re-confirmed against current code.',
    technical: 'Qualifier class Q-03: semantic propositions exist but structural reconciliation has not been performed in current cycle. Evidence is advisory.',
  },
  'coupling_pressure': {
    executive: 'How much cross-boundary coordination this part of the codebase forces on other parts.',
    technical: 'PSIG metric: measures bidirectional coupling load between architectural domains. Higher values indicate structural interdependency that constrains independent delivery.',
  },
  'domain_coupling_pressure': {
    executive: 'How tightly this domain is structurally bound to other domains — high values mean changes here ripple outward.',
    technical: 'PSIG metric: domain-level aggregation of coupling pressure across all boundary interfaces. Measures structural entanglement.',
  },
  'zone_coverage_concentration': {
    executive: 'Whether structural weight is spread evenly or concentrated in one area of this zone.',
    technical: 'PSIG metric: measures the distribution uniformity of structural mass within a pressure zone. High values indicate concentrated load.',
  },
  'unanchored_nodes': {
    executive: 'Structural components that exist in code but are not assigned to any domain — governance blind spots.',
    technical: 'PSIG metric: count of structural nodes without domain anchoring. Zero means complete coverage; non-zero indicates governance gaps.',
  },
  'Cluster Pressure Index': {
    executive: 'How much structural load this cluster carries relative to the average cluster — higher means more concentrated.',
    technical: 'DPSIG metric: ratio of cluster structural mass to normalized baseline. Value of 3.45 means this cluster carries 3.45× the average structural load.',
  },
  'Cluster Fan Asymmetry': {
    executive: 'Whether dependencies in this cluster flow evenly or are lopsided — high asymmetry means uneven structural responsibility.',
    technical: 'DPSIG metric: measures the asymmetry of dependency fan-in vs fan-out within a cluster. Higher values indicate structural imbalance.',
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

export default function OperatorReadingGuide() {
  return (
    <div className="reading-guide-preamble" role="region" aria-label="Operator reading guide">
      <div className="reading-guide-preamble-label">HOW TO READ THIS VIEW</div>
      <div className="reading-guide-preamble-body">
        <p className="reading-guide-prose">
          This operator surface presents structural evidence organized by propagation — how pressure moves through the system. Each domain carries a <strong>propagation role</strong>: origins generate pressure, pass-throughs conduct it, receivers absorb it. When you see elevated pressure on a pass-through domain, it typically reflects upstream origination, not local problems.
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

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

  // ─── Governance Lifecycle ────────────────────────

  'Provenance': {
    executive: 'How the current qualification status was earned — the path through governance.',
    technical: 'Records whether qualification was achieved through governed review, structural analysis, or semantic continuity from a prior run.',
  },
  'Authority ceiling': {
    executive: 'The maximum qualification level this specimen can reach given current evidence.',
    technical: 'Based on structural coverage and governance completeness, this is the highest S-level achievable without additional evidence or review.',
  },
  'Accepted': {
    executive: 'Proposition reviewed and accepted — semantic claim validated by governance review.',
    technical: 'A semantic proposition was evaluated through the governance review process and accepted as accurate. Contributes to qualification progression.',
  },
  'Rejected': {
    executive: 'Proposition reviewed and rejected — semantic claim found invalid or unsupported.',
    technical: 'A semantic proposition was evaluated and rejected. Does not contribute to qualification. May indicate a gap between semantic description and structural reality.',
  },
  'Arbitrated': {
    executive: 'Proposition resolved through structured arbitration — disputed claim settled by authority.',
    technical: 'A contested proposition was resolved through formal arbitration rather than standard review. The arbitration decision is binding.',
  },
  'Contested': {
    executive: 'Proposition under active dispute — semantic claim challenged during governance review.',
    technical: 'A proposition\'s validity is disputed. It has not been accepted or rejected — it remains in a contested state pending resolution.',
  },
  'Friction rate': {
    executive: 'Proportion of propositions that encountered governance resistance.',
    technical: 'Percentage of reviewed propositions that were rejected, contested, or required arbitration. Higher friction indicates more disagreement between semantic claims and evidence.',
  },

  // ─── Reconciliation Levels ───────────────────────

  'RECONCILED': {
    executive: 'Semantic descriptions confirmed by structural evidence — claims match reality.',
    technical: 'The semantic domain model has been reconciled against the structural code graph. Structural correspondence verified.',
  },
  'FULL': {
    executive: 'Complete reconciliation — all dimensions checked and confirmed.',
    technical: 'Every reconciliation dimension (coverage, adequacy, structural correspondence) has been evaluated and passed.',
  },
  'EXERCISED': {
    executive: 'Reconciliation was attempted — partial alignment achieved.',
    technical: 'The reconciliation process was run but did not achieve full confirmation. Some dimensions passed, others remain open.',
  },

  // ─── Confidence Labels ──────────────────────────

  'Governed': {
    executive: 'Evidence qualified through formal governance process — highest confidence.',
    technical: 'This finding is backed by evidence that has been through governed review and qualification. Not just structural analysis — it has been reviewed.',
  },
  'Structural': {
    executive: 'Evidence from structural analysis only — not yet governance-reviewed.',
    technical: 'This finding is derived from code graph structural analysis. It has not been through governance review. Structurally sound but not governance-qualified.',
  },

  // ─── Report / Export ────────────────────────────

  'EVIDENCE RECORD': {
    executive: 'Governed evidence export — the auditable output package from this analysis.',
    technical: 'A structured export containing all evidence, findings, and governance state from this run. Designed for downstream consumption and audit trail.',
  },
  'EVIDENCE STATE': {
    executive: 'Current evidence backing status — how complete and qualified the structural evidence is.',
    technical: 'Summary of the evidence coverage: how many domains are structurally backed, what qualification level has been achieved, and what gaps remain.',
  },

  // ─── Topology / Centrality ──────────────────────

  'STRUCTURAL CLUSTERS': {
    executive: 'Groups of files that form coherent structural units in the code graph.',
    technical: 'Clusters identified by structural analysis of import and inheritance relationships. Each cluster is a set of files more connected to each other than to the rest of the codebase.',
  },
  'CODE GRAPH FILES': {
    executive: 'Total files included in the structural analysis.',
    technical: 'The number of source files that were parsed and included in the code graph. This is the raw input to structural topology computation.',
  },
  'IMPORT EDGES': {
    executive: 'Dependency connections between files through import statements.',
    technical: 'The number of import/require/include relationships detected between files. These form the primary structural dependency graph.',
  },
  'INHERITANCE EDGES': {
    executive: 'Connections between classes through extends/implements relationships.',
    technical: 'The number of class inheritance or interface implementation relationships. These form the secondary structural graph measuring behavioral propagation paths.',
  },
  'IMPORT AUTHORITY': {
    executive: 'Files that the most other files depend on — structural centrality from import relationships.',
    technical: 'Centrality ranking based on the import dependency graph. High import authority means many files import from this component — changes here have wide blast radius.',
  },
  'INHERITANCE AUTHORITY': {
    executive: 'Classes that define behavior inherited by many others — centrality from class hierarchies.',
    technical: 'Centrality ranking based on the inheritance graph. High inheritance authority means many classes extend this one — behavioral changes propagate broadly.',
  },
  'NOMINAL': {
    executive: 'No structural concern — within normal expected range.',
    technical: 'This metric or signal shows values within normal parameters. No elevated structural pattern detected.',
  },

  // ─── Lineage Status ─────────────────────────────

  'EXACT': {
    executive: 'Perfect structural-semantic alignment — file-level evidence exactly matches semantic description.',
    technical: 'The domain\'s semantic definition maps one-to-one with structural evidence from the code graph. Highest confidence.',
  },
  'STRONG': {
    executive: 'High-confidence structural backing — strong evidence with minor alignment gaps.',
    technical: 'Structural evidence strongly supports the semantic description, with only minor discrepancies in boundary mapping.',
  },
  'PARTIAL': {
    executive: 'Some structural evidence — gaps between semantic claims and structural reality.',
    technical: 'Structural evidence exists but does not fully cover the semantic description. Some claims are unsupported.',
  },
  'WEAK': {
    executive: 'Minimal structural support — most semantic claims lack structural confirmation.',
    technical: 'Very limited structural evidence supports this domain\'s description. Most claims are semantic-only. Treat findings as provisional.',
  },

  // ─── Topology Context ──────────────────────────

  'Zone Anchor': {
    executive: 'The domain that anchors a pressure zone — where structural concentration originates.',
    technical: 'This domain is the focal point of a pressure zone. Structural signals converge here, making it the primary attribution point for zone-level findings.',
  },
  'Primary Pressure Zone': {
    executive: 'Region of highest structural concentration — where the most operational risk converges.',
    technical: 'The pressure zone with the highest combined structural signal density. This is where the most significant operational patterns are concentrated.',
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

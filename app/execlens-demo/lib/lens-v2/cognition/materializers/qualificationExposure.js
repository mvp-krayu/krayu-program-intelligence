'use strict'

const OBJECT_ID = 'qualification_exposure'

function materialize(cip) {
  const fr = cip.fullReport || cip
  const gl = fr.governance_lifecycle || {}
  const pc = fr.proposition_corpus || {}
  const ri = fr.revalidation_intelligence || {}
  const ca = fr.constitutional_anchor || {}
  const ci = fr.convergence_intelligence || {}
  const cc = fr.chronicle_certification || {}
  const ei = fr.enrichment_intelligence || {}

  const artifacts = [
    { name: 'Governance Lifecycle', present: !!gl.available },
    { name: 'Proposition Corpus', present: !!pc.available },
    { name: 'Revalidation', present: !!ri.available },
    { name: 'Constitutional Anchor', present: !!ca.available },
    { name: 'Convergence Intelligence', present: !!ci.available },
    { name: 'Chronicle Certification', present: !!cc.available },
    { name: 'Enrichment Intelligence', present: !!ei.available },
  ]

  const presentCount = artifacts.filter(a => a.present).length
  const gaps = artifacts.filter(a => !a.present).map(a => a.name)
  const blockers = []

  if (gl.available && !gl.promotion_eligible && gl.hold_reason) {
    blockers.push(`advancement held: ${gl.hold_reason}`)
  }
  if (pc.available && pc.flagged_count > 0) {
    blockers.push(`${pc.flagged_count} proposition${pc.flagged_count !== 1 ? 's' : ''} flagged`)
  }
  if (ri.available && ri.failed > 0) {
    blockers.push(`${ri.failed} revalidation check${ri.failed !== 1 ? 's' : ''} failed`)
  }

  const severity = blockers.length >= 2 ? 'HIGH'
    : blockers.length >= 1 ? 'ELEVATED'
    : presentCount < 3 ? 'MODERATE'
    : 'LOW'

  const sLevel = gl.available ? gl.s_level : null

  return {
    surface_id: 'QUALIFICATION_EXPOSURE',
    surface_name: 'Qualification Exposure',
    severity,
    operational_summary: sLevel
      ? `Qualification at ${sLevel} — ${presentCount}/7 governance artifacts present${blockers.length > 0 ? `, ${blockers.length} blocker${blockers.length !== 1 ? 's' : ''}` : ''}`
      : `${presentCount}/7 governance artifacts present — no governance lifecycle established`,
    consequence: blockers.length > 0
      ? `Qualification progression blocked: ${blockers.join('; ')}`
      : gaps.length > 0
        ? `Missing governance artifacts (${gaps.slice(0, 3).join(', ')}${gaps.length > 3 ? `, +${gaps.length - 3} more` : ''}) limit qualification depth`
        : 'Governance artifacts fully present — qualification progression unblocked',
    evidence_density: presentCount + blockers.length,
    affected_domains: [],
    constituents: {
      s_level: sLevel,
      promotion_eligible: gl.available ? gl.promotion_eligible : null,
      authority_ceiling: gl.available ? gl.authority_ceiling : null,
      artifacts_present: presentCount,
      artifacts_total: 7,
      gaps,
      blockers,
    },
    trace_sources: ['governance_lifecycle', 'proposition_corpus', 'revalidation_intelligence', 'constitutional_anchor', 'convergence_intelligence', 'chronicle_certification', 'enrichment_intelligence'],
  }
}

module.exports = { materialize, OBJECT_ID }

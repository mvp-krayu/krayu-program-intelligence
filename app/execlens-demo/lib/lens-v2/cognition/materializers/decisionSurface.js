// T2 materializer — assembly + lookup from condition interventions and severity
const OBJECT_ID = 'decision_surface'

const SEVERITY_ORDER = { CRITICAL: 5, HIGH: 4, ELEVATED: 3, MODERATE: 2, LOW: 1, NOMINAL: 0 }

function materialize(cip) {
  const synthesisResult = cip.synthesisResult || {}
  const consequenceResult = cip.consequenceResult || {}
  const conditions = (synthesisResult.conditions || []).filter(c => c.severity !== 'NOMINAL')
  const consequences = consequenceResult.consequences || []

  const leveragePoints = []
  for (const cond of conditions) {
    const interventions = cond.guided_interventions || []
    if (interventions.length === 0) continue

    const domains = (cond.shared_topology_targets && cond.shared_topology_targets.domains) || []

    leveragePoints.push({
      condition_type: cond.condition_type,
      condition_id: cond.condition_id,
      severity: cond.severity,
      targets: domains,
      evidence_mode: cond.evidence_mode || null,
      interventions: interventions.map(iv => ({
        action_type: iv.action_type,
        operator_label: iv.operator_label,
        topology_mutation: iv.topology_mutation || null,
      })),
      intervention_count: interventions.length,
    })
  }

  leveragePoints.sort((a, b) =>
    (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0)
  )

  const decisionDrivers = consequences
    .filter(c => c.consequence_scope === 'SYSTEMIC' || c.consequence_scope === 'REGIONAL')
    .map(c => ({
      consequence_type: c.consequence_type_id,
      severity: c.severity,
      scope: c.consequence_scope,
      locus: c.primary_locus_display || null,
      is_combination: !!c.combination_pattern,
      source_condition_count: (c.source_conditions || []).length,
    }))

  const urgencyFactors = {
    has_critical: conditions.some(c => c.severity === 'CRITICAL'),
    has_systemic: consequences.some(c => c.consequence_scope === 'SYSTEMIC'),
    convergence_count: conditions.filter(c => c.condition_type === 'COMPOUND_CONVERGENCE').length,
    combination_count: consequences.filter(c => !!c.combination_pattern).length,
  }

  return {
    object_id: OBJECT_ID,
    leverage_points: leveragePoints,
    decision_drivers: decisionDrivers,
    decision_urgency: urgencyFactors,
    total_leverage_points: leveragePoints.length,
    total_interventions: leveragePoints.reduce((sum, lp) => sum + lp.intervention_count, 0),
    pending_decisions: leveragePoints.filter(lp =>
      SEVERITY_ORDER[lp.severity] >= SEVERITY_ORDER['HIGH']
    ).length,
  }
}

module.exports = { materialize, OBJECT_ID }

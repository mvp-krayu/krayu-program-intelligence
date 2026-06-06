// T2 materializer — assembly + lookup from qualification posture and consequence severity
const OBJECT_ID = 'operational_ceiling'

const SEVERITY_ORDER = { CRITICAL: 5, HIGH: 4, ELEVATED: 3, MODERATE: 2, LOW: 1, NOMINAL: 0 }

// Ceiling properties derived from constraint type — rule-based, not inferred
const CEILING_PROPERTY_RULES = {
  COORD_FRAG: { architecture_sensitive: true, staffing_sensitive: false },
  DEP_AMP: { architecture_sensitive: true, staffing_sensitive: false },
  DEL_EXP: { architecture_sensitive: false, staffing_sensitive: true },
  OP_BOTTLENECK: { architecture_sensitive: true, staffing_sensitive: false },
  RESIL_DEF: { architecture_sensitive: true, staffing_sensitive: false },
  GOV_GAP: { architecture_sensitive: false, staffing_sensitive: false },
  PROP_EXP: { architecture_sensitive: true, staffing_sensitive: false },
  STAB_RISK: { architecture_sensitive: true, staffing_sensitive: false },
}

function materialize(cip) {
  const fr = cip.fullReport || {}
  const consequenceResult = cip.consequenceResult || {}
  const synthesisResult = cip.synthesisResult || {}
  const readiness = fr.readiness_summary || {}
  const qualifier = fr.qualifier_summary || {}
  const consequences = consequenceResult.consequences || []
  const conditions = (synthesisResult.conditions || []).filter(c => c.severity !== 'NOMINAL')

  const hasCriticalConvergence = conditions.some(
    c => c.condition_type === 'COMPOUND_CONVERGENCE' && c.severity === 'CRITICAL'
  )

  const ceilingDrivers = consequences
    .sort((a, b) => (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0))
    .slice(0, 5)
    .map(c => ({
      consequence_type: c.consequence_type_id,
      severity: c.severity,
      scope: c.consequence_scope,
      locus: c.primary_locus_display || null,
      is_combination: !!c.combination_pattern,
    }))

  const ceilingProperties = { architecture_sensitive: false, staffing_sensitive: false }
  for (const csq of consequences) {
    const rules = CEILING_PROPERTY_RULES[csq.consequence_type_id]
    if (rules) {
      if (rules.architecture_sensitive) ceilingProperties.architecture_sensitive = true
      if (rules.staffing_sensitive) ceilingProperties.staffing_sensitive = true
    }
  }

  const qualificationConstraints = []
  if (fr.qualification_blockers) {
    for (const blocker of fr.qualification_blockers) {
      qualificationConstraints.push({
        blocker_id: blocker.blocker_id || blocker.id,
        description: blocker.description || blocker.label || null,
        status: blocker.status || null,
      })
    }
  }

  const advancementBlockers = qualificationConstraints.filter(
    b => b.status !== 'RESOLVED' && b.status !== 'CLOSED'
  )

  return {
    object_id: OBJECT_ID,
    posture_statement: {
      qualified: readiness.posture || null,
      qualification_class: qualifier.qualifier_class || null,
      ceiling_exists: hasCriticalConvergence || consequences.some(c => c.consequence_scope === 'SYSTEMIC'),
    },
    ceiling_drivers: ceilingDrivers,
    ceiling_properties: ceilingProperties,
    qualification_constraints: qualificationConstraints,
    advancement_blockers: advancementBlockers,
    ceiling_factors: {
      consequence_count: consequences.length,
      systemic_count: (consequenceResult.systemic_count || 0),
      critical_convergence: hasCriticalConvergence,
      combination_patterns: consequences.filter(c => !!c.combination_pattern).length,
    },
  }
}

module.exports = { materialize, OBJECT_ID }

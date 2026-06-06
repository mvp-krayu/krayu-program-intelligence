'use strict'

const OBJECT_ID = 'sw_intel_absence'

const CONDITION_TYPE_LABELS = {
  DELIVERY_PRESSURE_CONCENTRATION: 'DELIVERY PRESSURE',
  DEPENDENCY_CHOKE_POINT: 'DEPENDENCY CHOKE POINT',
  PROPAGATION_ASYMMETRY: 'PROPAGATION ASYMMETRY',
  STRUCTURAL_MASS_CONCENTRATION: 'STRUCTURAL MASS',
  CROSS_DOMAIN_COUPLING_PRESSURE: 'COUPLING PRESSURE',
  GOVERNANCE_COVERAGE_STATUS: 'GOVERNANCE COVERAGE',
  COMPOUND_CONVERGENCE: 'COMPOUND CONVERGENCE',
  EXECUTION_FRAGILITY: 'EXECUTION FRAGILITY',
  EXECUTION_CONSTRICTION: 'EXECUTION CONSTRICTION',
  STRUCTURAL_BOUNDARY_DIVERGENCE: 'BOUNDARY DIVERGENCE',
  COUPLING_INERTIA: 'COUPLING INERTIA',
}

function isActivated(sig) {
  return sig.severity !== 'NOMINAL' && sig.activation_state !== 'NOMINAL' && sig.activation_state !== 'CLUSTER_BALANCED'
}

function materialize(cip) {
  const fr = cip.fullReport || cip
  const sigs = (fr.signal_interpretations || []).filter(isActivated)
  const se = fr.structural_enrichment || {}

  const ALL_CONDITION_TYPES = [
    'DELIVERY_PRESSURE_CONCENTRATION',
    'DEPENDENCY_CHOKE_POINT',
    'PROPAGATION_ASYMMETRY',
    'STRUCTURAL_MASS_CONCENTRATION',
    'CROSS_DOMAIN_COUPLING_PRESSURE',
    'EXECUTION_FRAGILITY',
    'EXECUTION_CONSTRICTION',
    'STRUCTURAL_BOUNDARY_DIVERGENCE',
    'COUPLING_INERTIA',
    'GOVERNANCE_COVERAGE_GAP',
  ]

  const totalConditionTypes = ALL_CONDITION_TYPES.length

  const activeConditionTypes = new Set()
  for (const sig of sigs) {
    if (sig.condition_type) activeConditionTypes.add(sig.condition_type)
    if (sig.signal_family === 'ISIG') {
      activeConditionTypes.add('DEPENDENCY_CHOKE_POINT')
      if (sig.signal_name && sig.signal_name.includes('Fan Asymmetry')) activeConditionTypes.add('PROPAGATION_ASYMMETRY')
    }
    if (sig.signal_family === 'DPSIG') {
      if (sig.signal_name && sig.signal_name.includes('Absorption')) activeConditionTypes.add('STRUCTURAL_MASS_CONCENTRATION')
      if (sig.signal_name && sig.signal_name.includes('Cluster Pressure')) activeConditionTypes.add('DELIVERY_PRESSURE_CONCENTRATION')
    }
  }

  if (se.available) {
    if (se.fragility_surface && (se.fragility_surface.fragility_hotspots || []).length > 0) activeConditionTypes.add('EXECUTION_FRAGILITY')
    if (se.boundary_divergence && (se.boundary_divergence.divergent_modules || []).length > 0) activeConditionTypes.add('STRUCTURAL_BOUNDARY_DIVERGENCE')
    if (se.coupling_inertia && (se.coupling_inertia.inertia_clusters || []).length > 0) activeConditionTypes.add('COUPLING_INERTIA')
    if (se.constriction_surface && (se.constriction_surface.constricted_paths || []).length > 0) activeConditionTypes.add('EXECUTION_CONSTRICTION')
  }

  const absentTypes = []
  const activeTypes = []

  for (const condType of ALL_CONDITION_TYPES) {
    const label = CONDITION_TYPE_LABELS[condType] || condType.replace(/_/g, ' ')
    if (activeConditionTypes.has(condType)) {
      activeTypes.push({ type: condType, label })
    } else {
      let reason = 'No activation detected'
      if (condType === 'EXECUTION_FRAGILITY' && se.available && se.fragility_surface) reason = 'Fragility surface nominal'
      else if (condType === 'STRUCTURAL_BOUNDARY_DIVERGENCE' && se.available && se.boundary_divergence) reason = 'Boundary alignment intact'
      else if (condType === 'COUPLING_INERTIA' && se.available && se.coupling_inertia) reason = 'Coupling within threshold'
      else if (condType === 'EXECUTION_CONSTRICTION' && se.available && se.constriction_surface) reason = 'No constricted paths'
      else if (condType === 'GOVERNANCE_COVERAGE_GAP') reason = 'Governance coverage sufficient'
      else if (!se.available && ['EXECUTION_FRAGILITY', 'STRUCTURAL_BOUNDARY_DIVERGENCE', 'COUPLING_INERTIA', 'EXECUTION_CONSTRICTION'].includes(condType)) reason = 'Unobservable — enrichment not available'
      absentTypes.push({ type: condType, label, reason })
    }
  }

  const absentCount = absentTypes.length
  const activeCount = activeTypes.length

  if (sigs.length === 0 && !se.available) return null

  return {
    surface_id: 'ABSENCE_PROFILE',
    surface_name: 'Absence Profile',
    severity: 'LOW',
    operational_summary: `${absentCount} of ${totalConditionTypes} structural condition types are nominal — ${activeCount} active, ${absentCount} absent${absentCount > activeCount ? ' — system health is structurally confirmed for the majority of condition types' : ''}`,
    consequence: absentCount >= totalConditionTypes * 0.7
      ? 'Strong structural health — most condition types are nominal, pressure is concentrated rather than systemic'
      : absentCount >= totalConditionTypes * 0.4
        ? 'Mixed health profile — some condition types are absent but a significant number are active'
        : 'Most condition types are active — pressure is systemic rather than concentrated',
    evidence_density: absentCount,
    affected_domains: [],
    constituents: {
      absent_count: absentCount,
      total_types: totalConditionTypes,
      active_count: activeCount,
      health_ratio: Math.round(absentCount / totalConditionTypes * 100),
      absent_types: absentTypes,
      active_types: activeTypes,
    },
    trace_sources: ['signal_interpretations', 'structural_enrichment'],
  }
}

module.exports = { materialize, OBJECT_ID }

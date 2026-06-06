// T3 materializer — vocabulary authoring for capability gaps (what was NOT found)
const OBJECT_ID = 'absence_profile'

// All condition types the system CAN detect
const FULL_CONDITION_VOCABULARY = [
  'DELIVERY_PRESSURE_CONCENTRATION',
  'DEPENDENCY_CHOKE_POINT',
  'PROPAGATION_ASYMMETRY',
  'STRUCTURAL_MASS_CONCENTRATION',
  'CROSS_DOMAIN_COUPLING_PRESSURE',
  'EXECUTION_FRAGILITY',
  'EXECUTION_CONSTRICTION',
  'STRUCTURAL_BOUNDARY_DIVERGENCE',
  'COUPLING_INERTIA',
  'GOVERNANCE_COVERAGE_STATUS',
  'COMPOUND_CONVERGENCE',
]

// Classification of absence — why something was not found
const ABSENCE_CLASSIFICATION_RULES = {
  NOMINAL: 'POSITIVE',
  DEFERRED_TEMPORAL: 'EXPECTED',
  NOT_MEASURABLE: 'EXPECTED',
  SUPPRESSED_BELOW_THRESHOLD: 'POSITIVE',
}

// Deferred behavioral slices — things the system cannot yet measure
const DEFERRED_SLICES = [
  { slice_id: 'DEPENDENCY_DEBT_ACCUMULATION', reason: 'Requires temporal evidence (run-over-run comparison)', classification: 'EXPECTED' },
]

function materialize(cip) {
  const synthesisResult = cip.synthesisResult || {}
  const conditions = synthesisResult.conditions || []
  const active = synthesisResult.active || conditions.filter(c => c.severity !== 'NOMINAL')
  const suppressed = synthesisResult.suppressed || conditions.filter(c => c.severity === 'NOMINAL')
  const signals = (cip.fullReport && cip.fullReport.signal_interpretations) || []

  const activeTypes = new Set(active.map(c => c.condition_type))
  const suppressedTypes = new Set(suppressed.map(c => c.condition_type))

  const inactiveConditions = []
  for (const condType of FULL_CONDITION_VOCABULARY) {
    if (condType === 'COMPOUND_CONVERGENCE') continue
    if (activeTypes.has(condType)) continue

    const isSuppressed = suppressedTypes.has(condType)
    inactiveConditions.push({
      condition_type: condType,
      status: isSuppressed ? 'SUPPRESSED' : 'NOT_ACTIVATED',
      classification: isSuppressed ? 'POSITIVE' : 'POSITIVE',
      reason: isSuppressed
        ? 'Evaluated — severity below activation threshold.'
        : 'No structural evidence triggered this condition type.',
    })
  }

  const nonActivatedSignals = signals
    .filter(s => s.severity === 'NOMINAL' || !s.severity)
    .map(s => ({
      signal_id: s.signal_id,
      signal_name: s.signal_name || s.signal_id,
      reason: 'Signal value below activation threshold.',
      classification: 'POSITIVE',
    }))

  const unmeasuredCapabilities = DEFERRED_SLICES.map(s => ({
    capability: s.slice_id,
    reason: s.reason,
    classification: s.classification,
  }))

  return {
    object_id: OBJECT_ID,
    absent_conditions: inactiveConditions,
    non_activated_signals: nonActivatedSignals,
    unmeasured_capabilities: unmeasuredCapabilities,
    coverage_summary: {
      total_condition_types: FULL_CONDITION_VOCABULARY.length - 1,
      active_count: activeTypes.size,
      suppressed_count: suppressedTypes.size,
      not_activated_count: inactiveConditions.filter(c => c.status === 'NOT_ACTIVATED').length,
      unmeasured_count: unmeasuredCapabilities.length,
    },
    classification_distribution: {
      POSITIVE: inactiveConditions.filter(c => c.classification === 'POSITIVE').length,
      EXPECTED: unmeasuredCapabilities.length,
      CONCERNING: 0,
    },
  }
}

module.exports = { materialize, OBJECT_ID }

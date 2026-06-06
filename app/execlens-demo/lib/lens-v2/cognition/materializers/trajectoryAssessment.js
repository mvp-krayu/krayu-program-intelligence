// T2 materializer — assembly + trajectory property lookup from consequence patterns
const OBJECT_ID = 'trajectory_assessment'

// Trajectory is a PROPERTY of the pattern type — deterministic, not inferred.
// A STRUCT_GRAVITY_WELL inherently worsens because mass accumulation is self-reinforcing.
const COMBINATION_TRAJECTORY = {
  STRUCT_GRAVITY_WELL: { direction: 'WORSENING', reason: 'Mass accumulation is self-reinforcing — structural gravity attracts more operational stress.' },
  AMPLIFIED_DEP_FRAG: { direction: 'WORSENING', reason: 'Dependency amplification compounds coordination fragility over time.' },
  SYSTEMIC_OP_FRAG: { direction: 'WORSENING', reason: 'Systemic convergence of multiple consequence types creates compounding instability.' },
}

const CONDITION_TRAJECTORY = {
  COUPLING_INERTIA: { direction: 'WORSENING', reason: 'Bidirectional coupling resists refactoring — inertia increases as more code depends on the coupled pair.' },
  STRUCTURAL_MASS_CONCENTRATION: { direction: 'WORSENING', reason: 'Structural mass attracts additional functionality — concentration deepens over time.' },
  GOVERNANCE_COVERAGE_STATUS: { direction: 'STABLE', reason: 'Governance coverage is a structural property — does not worsen without active change.' },
}

function materialize(cip) {
  const consequenceResult = cip.consequenceResult || {}
  const synthesisResult = cip.synthesisResult || {}
  const consequences = consequenceResult.consequences || []
  const conditions = synthesisResult.conditions || []
  const active = conditions.filter(c => c.severity !== 'NOMINAL')

  const worseningVectors = []
  const stableVectors = []
  const unmeasuredVectors = []

  for (const csq of consequences) {
    if (csq.combination_pattern && COMBINATION_TRAJECTORY[csq.combination_pattern]) {
      const traj = COMBINATION_TRAJECTORY[csq.combination_pattern]
      const entry = {
        source_type: 'combination',
        source_id: csq.consequence_id,
        pattern: csq.combination_pattern,
        severity: csq.severity,
        locus: csq.primary_locus_display || null,
        direction: traj.direction,
        reason: traj.reason,
      }
      if (traj.direction === 'WORSENING') worseningVectors.push(entry)
      else stableVectors.push(entry)
    }
  }

  for (const cond of active) {
    if (CONDITION_TRAJECTORY[cond.condition_type]) {
      const traj = CONDITION_TRAJECTORY[cond.condition_type]
      const entry = {
        source_type: 'condition',
        source_id: cond.condition_id,
        condition_type: cond.condition_type,
        severity: cond.severity,
        direction: traj.direction,
        reason: traj.reason,
      }
      if (traj.direction === 'WORSENING') worseningVectors.push(entry)
      else stableVectors.push(entry)
    }
  }

  // Temporal slices are deferred — these represent trajectory dimensions we cannot yet measure
  unmeasuredVectors.push({
    dimension: 'POSTURE_DRIFT',
    reason: 'Requires EXSIG/TIMSIG — run-over-run posture comparison not yet available.',
    classification: 'EXPECTED',
  })
  unmeasuredVectors.push({
    dimension: 'DEPENDENCY_DEBT_ACCUMULATION',
    reason: 'Deferred behavioral slice — requires temporal evidence.',
    classification: 'EXPECTED',
  })

  return {
    object_id: OBJECT_ID,
    worsening: worseningVectors,
    stable: stableVectors,
    unmeasured: unmeasuredVectors,
    summary: {
      worsening_count: worseningVectors.length,
      stable_count: stableVectors.length,
      unmeasured_count: unmeasuredVectors.length,
      dominant_trajectory: worseningVectors.length > 0 ? 'WORSENING'
        : stableVectors.length > 0 ? 'STABLE'
        : 'INSUFFICIENT_DATA',
    },
  }
}

module.exports = { materialize, OBJECT_ID }

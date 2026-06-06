// T4 materializer — rule formalization for measurement frontier
const OBJECT_ID = 'detection_boundary'

// Static lookup: what each condition type detects that traditional analysis cannot.
// Authored from EIR Chapter 8 ("What Would Have Been Hard to Discover Traditionally").
const TRADITIONAL_DETECTABILITY = {
  DELIVERY_PRESSURE_CONCENTRATION: {
    measurement_capability: 'Structural pressure zone computation reveals hidden delivery concentration invisible to Jira/sprint metrics.',
    prior_art_measurement: 'Sprint velocity variance, team utilization reports.',
    measurement_gap: 'Traditional tools measure workflow, not structural topology — they cannot detect that pressure concentrates on specific structural regions.',
    measurement_class: 'STRUCTURAL_TOPOLOGY',
  },
  DEPENDENCY_CHOKE_POINT: {
    measurement_capability: 'Import graph centrality identifies structural choke points that code review cannot see at scale.',
    prior_art_measurement: 'Code review, architectural diagrams, tribal knowledge.',
    measurement_gap: 'Manual review cannot track transitive dependency chains across hundreds of files — hub pressure is invisible until a change breaks something.',
    measurement_class: 'CODE_GRAPH',
  },
  PROPAGATION_ASYMMETRY: {
    measurement_capability: 'Cluster mass ratio computation reveals asymmetric change propagation risk from structural topology.',
    prior_art_measurement: 'Change impact analysis, manual dependency tracing.',
    measurement_gap: 'Traditional impact analysis is local — it cannot compute system-wide propagation asymmetry from topology structure.',
    measurement_class: 'STRUCTURAL_TOPOLOGY',
  },
  STRUCTURAL_MASS_CONCENTRATION: {
    measurement_capability: 'Cluster node distribution analysis reveals disproportionate structural mass invisible to file-level metrics.',
    prior_art_measurement: 'Lines of code, file count per module.',
    measurement_gap: 'LOC/file count measures quantity, not structural weight — a 50-file module with 90% of inbound edges carries more mass than a 500-file module with none.',
    measurement_class: 'STRUCTURAL_TOPOLOGY',
  },
  CROSS_DOMAIN_COUPLING_PRESSURE: {
    measurement_capability: 'Cross-boundary import ratio reveals governance misalignment between organizational boundaries and actual dependencies.',
    prior_art_measurement: 'Architecture review boards, module ownership documentation.',
    measurement_gap: 'Documentation describes intended boundaries — structural analysis reveals actual coupling that has drifted from intent.',
    measurement_class: 'GOVERNANCE',
  },
  EXECUTION_FRAGILITY: {
    measurement_capability: 'Combined coupling/cohesion analysis at file level identifies fragile code that appears healthy in isolation.',
    prior_art_measurement: 'Cyclomatic complexity, test coverage.',
    measurement_gap: 'Complexity metrics measure internal structure — fragility combines internal weakness with external dependency exposure.',
    measurement_class: 'CODE_GRAPH',
  },
  EXECUTION_CONSTRICTION: {
    measurement_capability: 'Articulation point detection via Tarjan algorithm identifies throughput bottlenecks invisible to load testing.',
    prior_art_measurement: 'Load testing, performance profiling.',
    measurement_gap: 'Performance tools measure runtime throughput — structural constriction reveals where the architecture constrains throughput regardless of load.',
    measurement_class: 'CODE_GRAPH',
  },
  STRUCTURAL_BOUNDARY_DIVERGENCE: {
    measurement_capability: 'Cross-boundary import ratio analysis reveals where actual dependency patterns have diverged from governance boundaries.',
    prior_art_measurement: 'Architecture decision records, module ownership maps.',
    measurement_gap: 'ADRs describe decisions — they cannot detect that actual implementation has silently diverged from the decided boundary.',
    measurement_class: 'GOVERNANCE',
  },
  COUPLING_INERTIA: {
    measurement_capability: 'Bidirectional cluster detection reveals coupled module pairs that resist independent change.',
    prior_art_measurement: 'Merge conflict frequency, cross-team PR reviews.',
    measurement_gap: 'Merge conflicts are symptoms — coupling inertia detects the structural cause before conflicts manifest.',
    measurement_class: 'CODE_GRAPH',
  },
  GOVERNANCE_COVERAGE_STATUS: {
    measurement_capability: 'Systematic governance boundary completeness check against actual structural surface.',
    prior_art_measurement: 'Governance audit, compliance checklist.',
    measurement_gap: 'Manual audits check what is governed — structural analysis reveals what structural surface exists but has no governance boundary.',
    measurement_class: 'GOVERNANCE',
  },
}

function materialize(cip) {
  const synthesisResult = cip.synthesisResult || {}
  const conditions = (synthesisResult.conditions || []).filter(c => c.severity !== 'NOMINAL')

  const activeDetections = []
  const detectedTypes = new Set()
  for (const cond of conditions) {
    if (cond.condition_type === 'COMPOUND_CONVERGENCE') continue
    if (detectedTypes.has(cond.condition_type)) continue
    detectedTypes.add(cond.condition_type)

    const detectability = TRADITIONAL_DETECTABILITY[cond.condition_type]
    if (!detectability) continue

    activeDetections.push({
      condition_type: cond.condition_type,
      severity: cond.severity,
      measurement_capability: detectability.measurement_capability,
      prior_art_measurement: detectability.prior_art_measurement,
      measurement_gap: detectability.measurement_gap,
      measurement_class: detectability.measurement_class,
    })
  }

  const inactiveDetections = Object.entries(TRADITIONAL_DETECTABILITY)
    .filter(([type]) => !detectedTypes.has(type))
    .map(([type, det]) => ({
      condition_type: type,
      measurement_class: det.measurement_class,
      status: 'AVAILABLE_NOT_TRIGGERED',
    }))

  const classDistribution = {}
  for (const det of activeDetections) {
    classDistribution[det.measurement_class] = (classDistribution[det.measurement_class] || 0) + 1
  }

  return {
    object_id: OBJECT_ID,
    measurement_frontier: activeDetections,
    available_not_triggered: inactiveDetections,
    detection_novelty: {
      total_detection_types: Object.keys(TRADITIONAL_DETECTABILITY).length,
      active_count: activeDetections.length,
      available_count: inactiveDetections.length,
      class_distribution: classDistribution,
    },
  }
}

module.exports = { materialize, OBJECT_ID }

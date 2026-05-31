// T1 materializer — assembles tension_map from synthesis conditions and ontology class activation
const OBJECT_ID = 'tension_map'

function materialize(cip) {
  const synthesisResult = cip.synthesisResult || {}
  const conditions = synthesisResult.conditions || []
  const active = conditions.filter(c => c.severity !== 'NOMINAL')
  const ontologyClass = (cip.cognitionOntology && cip.cognitionOntology.CONDITION_ONTOLOGY_CLASS) || {}

  const convergenceCenters = []
  const composites = conditions.filter(c => c.condition_type === 'COMPOUND_CONVERGENCE')

  for (const comp of composites) {
    const contributing = (comp.contributing_condition_ids || [])
      .map(id => conditions.find(c => c.condition_id === id))
      .filter(Boolean)

    const classes = new Set()
    for (const c of contributing) {
      const cls = ontologyClass[c.condition_type]
      if (cls) classes.add(cls.class_id)
    }

    convergenceCenters.push({
      condition_id: comp.condition_id,
      severity: comp.severity,
      domains: (comp.shared_topology_targets && comp.shared_topology_targets.domains) || [],
      contributing_count: contributing.length,
      contributing_condition_types: contributing.map(c => c.condition_type),
      behavioral_classes: [...classes].sort(),
      class_count: classes.size,
    })
  }

  const classActivation = {}
  for (const cond of active) {
    const cls = ontologyClass[cond.condition_type]
    if (!cls) continue
    if (!classActivation[cls.class_id]) {
      classActivation[cls.class_id] = {
        class_id: cls.class_id,
        class_name: cls.class_name,
        condition_count: 0,
        max_severity: 'NOMINAL',
        condition_types: [],
      }
    }
    const entry = classActivation[cls.class_id]
    entry.condition_count++
    if (!entry.condition_types.includes(cond.condition_type)) {
      entry.condition_types.push(cond.condition_type)
    }
    if (severityRank(cond.severity) > severityRank(entry.max_severity)) {
      entry.max_severity = cond.severity
    }
  }

  const crossDomainTensions = []
  for (const cond of active) {
    const domains = (cond.shared_topology_targets && cond.shared_topology_targets.domains) || []
    if (domains.length > 1) {
      crossDomainTensions.push({
        condition_type: cond.condition_type,
        severity: cond.severity,
        domain_count: domains.length,
        domains,
      })
    }
  }

  return {
    object_id: OBJECT_ID,
    convergence_centers: convergenceCenters,
    behavioral_class_activation: Object.values(classActivation)
      .sort((a, b) => severityRank(b.max_severity) - severityRank(a.max_severity)),
    cross_domain_tensions: crossDomainTensions,
    severity_distribution: computeSeverityDistribution(active),
    active_condition_count: active.length,
    composite_count: composites.length,
  }
}

const SEVERITY_ORDER = { CRITICAL: 5, HIGH: 4, ELEVATED: 3, MODERATE: 2, LOW: 1, NOMINAL: 0 }
function severityRank(s) { return SEVERITY_ORDER[s] || 0 }

function computeSeverityDistribution(conditions) {
  const dist = {}
  for (const c of conditions) {
    dist[c.severity] = (dist[c.severity] || 0) + 1
  }
  return dist
}

module.exports = { materialize, OBJECT_ID }

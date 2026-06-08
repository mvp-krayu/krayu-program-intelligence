const { SEVERITY_RANK, resolveDomainDisplay } = require('../SignalSynthesisEngine')
const { CONDITION_ONTOLOGY_CLASS } = require('./CognitionOntology')

// ─── Constants ─────────────────────────────────────────

const SEVERITY_ESCALATION = {
  NOMINAL: 'LOW', LOW: 'MODERATE', MODERATE: 'ELEVATED',
  ELEVATED: 'HIGH', HIGH: 'CRITICAL', CRITICAL: 'CRITICAL',
}

const CONFIDENCE_RANK = { GOVERNED: 0, ADVISORY_BOUND: 1, STRUCTURAL_ONLY: 2 }
const SCOPE_RANK = { LOCAL: 0, REGIONAL: 1, SYSTEMIC: 2 }

// ─── Three-Layer Vocabulary (§12) ──────────────────────

const CONSEQUENCE_VOCABULARY = {
  COORD_FRAG: {
    consequence_type_id: 'COORD_FRAG',
    structural_consequence_label: 'Structural Coordination Brittleness',
    operator_consequence_title: 'Coordination Fragility',
    operational_implication: 'Operations on this region require multi-party coordination that structural concentration makes brittle.',
    board_implication: 'Cross-team delivery in this area becomes increasingly unpredictable. Changes require coordination across multiple owners, creating scheduling constraints and delivery risk.',
  },
  DEP_AMP: {
    consequence_type_id: 'DEP_AMP',
    structural_consequence_label: 'Dependency Concentration Amplification',
    operator_consequence_title: 'Dependency Amplification',
    operational_implication: 'A single structural dependency point amplifies change impact beyond its apparent scope.',
    board_implication: 'Any change to this region cascades further than expected. Investment in this component carries amplified risk — both the cost of change and the cost of not changing increase.',
  },
  DEL_EXP: {
    consequence_type_id: 'DEL_EXP',
    structural_consequence_label: 'Structural Delivery Risk Surface',
    operator_consequence_title: 'Delivery Exposure',
    operational_implication: 'Delivery decisions affecting this region carry elevated structural risk.',
    board_implication: 'Delivery throughput is constrained by structural concentration. Planned releases touching this area carry elevated risk of unintended side effects.',
  },
  OP_BOTTLENECK: {
    consequence_type_id: 'OP_BOTTLENECK',
    structural_consequence_label: 'Structural Throughput Constraint',
    operator_consequence_title: 'Operational Bottleneck',
    operational_implication: 'Structural concentration creates a throughput constraint on operational flow.',
    board_implication: 'Development velocity in this area is structurally constrained. Adding capacity does not relieve the bottleneck — the constraint is architectural, not resourcing.',
  },
  RESIL_DEF: {
    consequence_type_id: 'RESIL_DEF',
    structural_consequence_label: 'Structural Resilience Concentration',
    operator_consequence_title: 'Resilience Deficit',
    operational_implication: 'Structural resilience depends disproportionately on one region.',
    board_implication: 'System resilience depends on a small number of components. If these components degrade, the system lacks structural alternatives — recovery options narrow as concentration increases.',
  },
  GOV_GAP: {
    consequence_type_id: 'GOV_GAP',
    structural_consequence_label: 'Governance Surface Incompleteness',
    operator_consequence_title: 'Governance Coverage Gap',
    operational_implication: 'Governance boundary does not fully cover the structural surface.',
    board_implication: 'Parts of the system operate outside governed boundaries. Decisions affecting these regions lack the structural validation that governed areas receive.',
  },
  PROP_EXP: {
    consequence_type_id: 'PROP_EXP',
    structural_consequence_label: 'Asymmetric Propagation Surface',
    operator_consequence_title: 'Propagation Exposure',
    operational_implication: 'Change originating at this point propagates asymmetrically — blast radius exceeds structural locality.',
    board_implication: 'Changes here affect more of the system than their apparent scope suggests. Estimation accuracy degrades because blast radius is structurally hidden.',
  },
  STAB_RISK: {
    consequence_type_id: 'STAB_RISK',
    structural_consequence_label: 'Multi-Factor Structural Instability',
    operator_consequence_title: 'Structural Stability Risk',
    operational_implication: 'Multiple independent structural indicators converge, creating compounding instability.',
    board_implication: 'Several independent structural pressures affect the same region simultaneously. This is not isolated risk — it compounds. Addressing one pressure without the others may not materially improve stability.',
  },
  AMPLIFIED_DEP_FRAG: {
    consequence_type_id: 'AMPLIFIED_DEP_FRAG',
    structural_consequence_label: 'Amplified Dependency-Pressure Fragility',
    operator_consequence_title: 'Amplified Dependency Fragility',
    operational_implication: 'Coordination fragility is amplified by dependency concentration — the hub sits inside the pressure zone.',
    board_implication: 'The most depended-upon component is also the most structurally stressed. This creates a compounding risk where the highest-value asset is simultaneously the most fragile.',
  },
  STRUCT_GRAVITY_WELL: {
    consequence_type_id: 'STRUCT_GRAVITY_WELL',
    structural_consequence_label: 'Structural Mass-Pressure Gravity Well',
    operator_consequence_title: 'Structural Gravity Well',
    operational_implication: 'The structurally dominant region attracts disproportionate operational stress.',
    board_implication: 'One region dominates the system architecture. Over time, more features, dependencies, and operational decisions gravitate toward it — increasing concentration and reducing architectural flexibility.',
  },
  RT_EVENT_CONCENTRATION: {
    consequence_type_id: 'RT_EVENT_CONCENTRATION',
    structural_consequence_label: 'Runtime Event Coordination Concentration',
    operator_consequence_title: 'Event Coordination Concentration',
    operational_implication: 'Event infrastructure carries disproportionate coordination load — all domain events route through a central bus.',
    board_implication: 'Cross-domain coordination depends on a single event infrastructure. If event processing degrades, all coordinated operations are affected simultaneously.',
  },
  RT_RUNTIME_DEPENDENCY_CHOKE_POINT: {
    consequence_type_id: 'RT_RUNTIME_DEPENDENCY_CHOKE_POINT',
    structural_consequence_label: 'Runtime Channel Dependency Concentration',
    operator_consequence_title: 'Runtime Dependency Choke Point',
    operational_implication: 'A runtime channel or gateway is a dependency for multiple domains — failure disrupts cross-domain coordination.',
    board_implication: 'A single runtime gateway controls visibility across multiple operational domains. Gateway failure creates silent operational blindness — the system continues but visibility goes dark.',
  },
  RT_BROKER_DEPENDENCY: {
    consequence_type_id: 'RT_BROKER_DEPENDENCY',
    structural_consequence_label: 'Shared Broker Single-Point Dependency',
    operator_consequence_title: 'Broker Dependency Risk',
    operational_implication: 'All edge-to-cloud communication depends on a single broker — a single point of failure for telemetry ingestion.',
    board_implication: 'Field-to-cloud data continuity depends on a single message broker. Broker failure stops data ingestion across the entire edge fleet without affecting cloud application health indicators.',
  },
  RT_TOPIC_FANOUT_PRESSURE: {
    consequence_type_id: 'RT_TOPIC_FANOUT_PRESSURE',
    structural_consequence_label: 'Topic Fan-Out Propagation Surface',
    operator_consequence_title: 'Topic Fanout Pressure',
    operational_implication: 'Topic families feed multiple consumers — changes to topic structure propagate broadly across domains.',
    board_implication: 'Message structure changes affect multiple downstream consumers simultaneously. Schema evolution in this area carries broad coordination cost.',
  },
  RT_ASYNC_PROPAGATION_ASYMMETRY: {
    consequence_type_id: 'RT_ASYNC_PROPAGATION_ASYMMETRY',
    structural_consequence_label: 'Async Event Producer/Handler Imbalance',
    operator_consequence_title: 'Async Propagation Asymmetry',
    operational_implication: 'Broad event vocabulary converges on narrow handler surface — concentrated failure exposure.',
    board_implication: 'Many event types are processed by few handlers. If those handlers fail, a broad range of business events stop being processed while the platform continues to appear healthy.',
  },
  RT_EDGE_CLOUD_PROPAGATION_RISK: {
    consequence_type_id: 'RT_EDGE_CLOUD_PROPAGATION_RISK',
    structural_consequence_label: 'Edge-to-Cloud Dependency Path',
    operator_consequence_title: 'Edge-Cloud Propagation Exposure',
    operational_implication: 'Edge devices depend on cloud-side coordination through a single ingestion path — edge failure propagates to cloud visibility.',
    board_implication: 'Field operations depend on a single data path to the cloud. If that path degrades, cloud-side dashboards and decisions lose access to field reality.',
  },
  RT_RUNTIME_OBSERVABILITY_GAP: {
    consequence_type_id: 'RT_RUNTIME_OBSERVABILITY_GAP',
    structural_consequence_label: 'Runtime Traceability Incompleteness',
    operator_consequence_title: 'Runtime Observability Gap',
    operational_implication: 'Runtime flows exist with weak traceability — event types defined without matching handlers.',
    board_implication: 'Parts of the runtime system emit events that nothing processes. These are potential blind spots where operational issues could occur without producing alerts.',
  },
  SYSTEMIC_OP_FRAG: {
    consequence_type_id: 'SYSTEMIC_OP_FRAG',
    structural_consequence_label: 'Systemic Multi-Factor Operational Fragility',
    operator_consequence_title: 'Systemic Operational Fragility',
    operational_implication: 'Multiple independent structural indicators converge on the same region through independent evidence paths.',
    board_implication: 'Independent structural pressures arrive at the same conclusion through different evidence. This is the strongest signal — the system is converging toward a single fragility center through multiple independent paths.',
  },
}

// ─── Helpers ───────────────────────────────────────────

function sevGte(severity, threshold) {
  return (SEVERITY_RANK[severity] ?? 5) <= (SEVERITY_RANK[threshold] ?? 5)
}

function maxSev(severities) {
  let best = 'NOMINAL'
  for (const s of severities) {
    if ((SEVERITY_RANK[s] ?? 5) < (SEVERITY_RANK[best] ?? 5)) best = s
  }
  return best
}

function minConfidence(boundaries) {
  if (boundaries.length === 0) return 'STRUCTURAL_ONLY'
  const unique = [...new Set(boundaries)]
  if (unique.length === 1) return unique[0]
  return 'ADVISORY_BOUND'
}

function primaryLocusKey(condition) {
  const domains = (condition.shared_topology_targets && condition.shared_topology_targets.domains) || []
  return domains.length > 0 ? domains[0] : 'system'
}

function locusIdPart(key) {
  return key.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function clusterFanAsymmetry(dpsigData) {
  if (!dpsigData) return 0
  const nb = dpsigData.normalization_basis || {}
  const dc = dpsigData.derivation_context || {}
  const clusterNodes = nb.max_cluster_node_count || 0
  const total = dc.total_structural_nodes || 0
  return total > 0 ? (clusterNodes / total) * 100 : 0
}

function hubInDegree(condition, structuralEnrichment) {
  const files = (condition.shared_topology_targets && condition.shared_topology_targets.files) || []
  if (files.length === 0 || !structuralEnrichment) return 0
  const spines = (structuralEnrichment.centrality && structuralEnrichment.centrality.top_structural_spines) || []
  for (const file of files) {
    const node = spines.find(s => s.path === file)
    if (node) return node.import_in_degree || node.in_degree || 0
  }
  return 0
}

function extractSignalFamilies(signalIds) {
  if (!signalIds || signalIds.length === 0) return []
  const families = new Set()
  for (const id of signalIds) {
    const upper = (id || '').toUpperCase()
    if (upper.startsWith('PSIG')) families.add('PSIG')
    else if (upper.startsWith('DPSIG')) families.add('DPSIG')
    else if (upper.startsWith('ISIG')) families.add('ISIG')
    else if (upper.startsWith('BSIG')) families.add('BSIG')
    else if (upper.startsWith('CSIG')) families.add('CSIG')
    else if (upper.startsWith('ESIG')) families.add('ESIG')
  }
  return [...families]
}

// ─── Atomic Consequence Factory ────────────────────────

function makeAtomic(typeId, condition, scope, isDefining, registry) {
  const vocab = CONSEQUENCE_VOCABULARY[typeId]
  const lk = primaryLocusKey(condition)
  const targets = condition.shared_topology_targets || {}
  const domains = targets.domains || []
  const display = domains.length > 0
    ? resolveDomainDisplay(domains[0], registry).display_name
    : 'System-wide'

  return {
    consequence_type_id: typeId,
    structural_consequence_label: vocab.structural_consequence_label,
    operator_consequence_title: vocab.operator_consequence_title,
    operational_implication: vocab.operational_implication,
    severity: condition.severity,
    confidence: condition.governance_boundary,
    consequence_scope: scope,
    primary_locus: {
      domains: [...(domains)],
      clusters: [...(targets.clusters || [])],
      files: [...(targets.files || [])],
    },
    primary_locus_display: display,
    source_conditions: [condition.condition_id],
    source_condition_types: [condition.condition_type],
    source_signal_ids: [...(condition.supporting_signal_ids || [])],
    activation_rule: '§4 ' + condition.condition_type + ' → ' + typeId,
    combination_pattern: null,
    escalation_applied: false,
    escalation_reason: null,
    evidence_summary: {
      condition_count: 1,
      condition_types: [condition.condition_type],
      source_signal_families: extractSignalFamilies(condition.supporting_signal_ids),
    },
    evidence_refs: [{
      type: 'condition',
      id: condition.condition_id,
      condition_type: condition.condition_type,
    }],
    governance_caveat: null,
    derivation_trace: [{
      source_id: condition.condition_id,
      source_type: condition.condition_type,
      rule: '§4',
      target_id: typeId,
      target_type: 'consequence',
    }],
    pressure_zone_id: condition.pressure_zone_id || null,
    temporal_marker: null,
    evidence_class: condition.evidence_class || 'STATIC_IMPORT',
    visibility_layer: condition.evidence_mode === 'RUNTIME_EVIDENCE' ? 'RUNTIME' : 'STATIC',
    _src_type: condition.condition_type,
    _src_boundary: condition.governance_boundary,
    _defining: isDefining,
    _lk: lk,
  }
}

// ─── Primitive-to-Consequence Mapping (§4) ─────────────

function mapDPC(cond, registry) {
  const r = []
  r.push(makeAtomic('COORD_FRAG', cond, 'REGIONAL', true, registry))
  r.push(makeAtomic('DEL_EXP', cond, 'REGIONAL', true, registry))
  if ((cond.supporting_signal_ids || []).length >= 3) {
    r.push(makeAtomic('OP_BOTTLENECK', cond, 'REGIONAL', false, registry))
  }
  return r
}

function mapDCkP(cond, ctx, registry) {
  const r = []
  r.push(makeAtomic('DEP_AMP', cond, 'LOCAL', true, registry))
  if (sevGte(cond.severity, 'HIGH')) {
    r.push(makeAtomic('COORD_FRAG', cond, 'LOCAL', false, registry))
  }
  if (sevGte(cond.severity, 'HIGH') && hubInDegree(cond, ctx.structuralEnrichment) > 20) {
    r.push(makeAtomic('OP_BOTTLENECK', cond, 'LOCAL', false, registry))
  }
  return r
}

function mapPA(cond, registry) {
  const r = []
  r.push(makeAtomic('PROP_EXP', cond, 'LOCAL', true, registry))
  if (sevGte(cond.severity, 'HIGH')) {
    r.push(makeAtomic('DEL_EXP', cond, 'LOCAL', false, registry))
  }
  return r
}

function mapSMC(cond, ctx, registry) {
  const r = []
  r.push(makeAtomic('RESIL_DEF', cond, 'REGIONAL', true, registry))
  if (sevGte(cond.severity, 'ELEVATED') && clusterFanAsymmetry(ctx.dpsigData) > 50) {
    r.push(makeAtomic('STAB_RISK', cond, 'REGIONAL', false, registry))
  }
  return r
}

function mapCDCP(cond, registry) {
  const r = []
  r.push(makeAtomic('COORD_FRAG', cond, 'REGIONAL', true, registry))
  if (sevGte(cond.severity, 'HIGH')) {
    r.push(makeAtomic('PROP_EXP', cond, 'REGIONAL', false, registry))
  }
  return r
}

function mapEF(cond, registry) {
  const r = []
  r.push(makeAtomic('RESIL_DEF', cond, 'LOCAL', true, registry))
  if (sevGte(cond.severity, 'ELEVATED')) {
    r.push(makeAtomic('COORD_FRAG', cond, 'LOCAL', false, registry))
  }
  if (cond._has_hub_fragility) {
    r.push(makeAtomic('DEP_AMP', cond, 'LOCAL', false, registry))
  }
  return r
}

function mapEC(cond, registry) {
  const r = []
  r.push(makeAtomic('OP_BOTTLENECK', cond, 'LOCAL', true, registry))
  if (sevGte(cond.severity, 'ELEVATED')) {
    r.push(makeAtomic('COORD_FRAG', cond, 'LOCAL', false, registry))
  }
  if (cond._has_bridge_constriction) {
    r.push(makeAtomic('DEP_AMP', cond, 'LOCAL', false, registry))
  }
  return r
}

function mapSBD(cond, registry) {
  const r = []
  r.push(makeAtomic('GOV_GAP', cond, 'LOCAL', true, registry))
  if (sevGte(cond.severity, 'ELEVATED')) {
    r.push(makeAtomic('COORD_FRAG', cond, 'LOCAL', false, registry))
  }
  if (sevGte(cond.severity, 'HIGH')) {
    r.push(makeAtomic('PROP_EXP', cond, 'LOCAL', false, registry))
  }
  return r
}

function mapCI(cond, registry) {
  const r = []
  r.push(makeAtomic('COORD_FRAG', cond, 'LOCAL', true, registry))
  if (sevGte(cond.severity, 'ELEVATED')) {
    r.push(makeAtomic('OP_BOTTLENECK', cond, 'LOCAL', false, registry))
  }
  if (cond._has_choke_in_cluster) {
    r.push(makeAtomic('DEP_AMP', cond, 'LOCAL', false, registry))
  }
  return r
}

function mapGCS(cond, registry) {
  if (cond.severity === 'NOMINAL') return []
  return [makeAtomic('GOV_GAP', cond, 'SYSTEMIC', true, registry)]
}

function mapCC(cond, registry) {
  return [makeAtomic('STAB_RISK', cond, 'SYSTEMIC', true, registry)]
}

const RUNTIME_CANONICAL_FAMILY = {
  EVENT_CONCENTRATION: 'COORD_FRAG',
  RUNTIME_DEPENDENCY_CHOKE_POINT: 'DEP_AMP',
  BROKER_DEPENDENCY: 'RESIL_DEF',
  TOPIC_FANOUT_PRESSURE: 'PROP_EXP',
  ASYNC_PROPAGATION_ASYMMETRY: 'COORD_FRAG',
  EDGE_CLOUD_PROPAGATION_RISK: 'DEL_EXP',
  RUNTIME_OBSERVABILITY_GAP: 'GOV_GAP',
}

function mapRuntimeCondition(cond, registry) {
  const canonicalType = RUNTIME_CANONICAL_FAMILY[cond.condition_type] || 'COORD_FRAG'
  if (!CONSEQUENCE_VOCABULARY[canonicalType]) return []
  const domains = (cond.shared_topology_targets && cond.shared_topology_targets.domains) || []
  const scope = domains.length > 2 ? 'SYSTEMIC' : domains.length > 0 ? 'REGIONAL' : 'LOCAL'

  return [makeAtomic(canonicalType, cond, scope, true, registry)]
}

function mapCondition(cond, ctx, registry) {
  switch (cond.condition_type) {
    case 'DELIVERY_PRESSURE_CONCENTRATION': return mapDPC(cond, registry)
    case 'DEPENDENCY_CHOKE_POINT': return mapDCkP(cond, ctx, registry)
    case 'PROPAGATION_ASYMMETRY': return mapPA(cond, registry)
    case 'STRUCTURAL_MASS_CONCENTRATION': return mapSMC(cond, ctx, registry)
    case 'CROSS_DOMAIN_COUPLING_PRESSURE': return mapCDCP(cond, registry)
    case 'EXECUTION_FRAGILITY': return mapEF(cond, registry)
    case 'EXECUTION_CONSTRICTION': return mapEC(cond, registry)
    case 'STRUCTURAL_BOUNDARY_DIVERGENCE': return mapSBD(cond, registry)
    case 'COUPLING_INERTIA': return mapCI(cond, registry)
    case 'GOVERNANCE_COVERAGE_STATUS': return mapGCS(cond, registry)
    case 'COMPOUND_CONVERGENCE': return mapCC(cond, registry)
    case 'EVENT_CONCENTRATION':
    case 'RUNTIME_DEPENDENCY_CHOKE_POINT':
    case 'BROKER_DEPENDENCY':
    case 'TOPIC_FANOUT_PRESSURE':
    case 'ASYNC_PROPAGATION_ASYMMETRY':
    case 'EDGE_CLOUD_PROPAGATION_RISK':
    case 'RUNTIME_OBSERVABILITY_GAP':
      return mapRuntimeCondition(cond, registry)
    default: return []
  }
}

// ─── Deduplication ─────────────────────────────────────

function deduplicateConsequences(atomics) {
  const groups = {}
  for (const csq of atomics) {
    const key = csq.consequence_type_id + '::' + csq._lk
    if (!groups[key]) {
      groups[key] = {
        ...csq,
        _src_types: [csq._src_type],
        _src_boundaries: [csq._src_boundary],
      }
    } else {
      const g = groups[key]
      g.source_conditions = [...new Set([...g.source_conditions, ...csq.source_conditions])]
      g.source_condition_types = [...new Set([...(g.source_condition_types || []), ...(csq.source_condition_types || [])])]
      g.source_signal_ids = [...new Set([...(g.source_signal_ids || []), ...(csq.source_signal_ids || [])])]
      g.severity = maxSev([g.severity, csq.severity])
      g._src_types.push(csq._src_type)
      g._src_boundaries.push(csq._src_boundary)
      g._defining = g._defining || csq._defining
      g.derivation_trace = [...(g.derivation_trace || []), ...(csq.derivation_trace || [])]
      g.evidence_refs = [...(g.evidence_refs || []), ...(csq.evidence_refs || [])]
      if (csq.visibility_layer === 'RUNTIME') g.visibility_layer = 'MIXED'
      if (csq.evidence_class && csq.evidence_class !== g.evidence_class) {
        g.evidence_class = 'MIXED'
      }
    }
  }

  const result = Object.values(groups)
  for (const g of result) {
    g.confidence = minConfidence(g._src_boundaries)
    g.consequence_id = 'csq-' + g.consequence_type_id.toLowerCase().replace(/_/g, '-') + '-' + locusIdPart(g._lk)
    const uniqueTypes = [...new Set(g._src_types)]
    g.evidence_summary = {
      condition_count: g.source_conditions.length,
      condition_types: uniqueTypes,
      source_signal_families: extractSignalFamilies(g.source_signal_ids),
    }
  }
  return result
}

// ─── Combination Detection (§5) ────────────────────────

function hasSourceType(csq, type) {
  return (csq._src_types || [csq._src_type]).includes(type)
}

function makeCombination(patternId, contributing, lk, escalate, registry) {
  const vocab = CONSEQUENCE_VOCABULARY[patternId]
  const allSources = [...new Set(contributing.flatMap(c => c.source_conditions))]
  const allBoundaries = contributing.flatMap(c => c._src_boundaries || [c._src_boundary])
  const baseSev = maxSev(contributing.map(c => c.severity))
  const severity = escalate ? (SEVERITY_ESCALATION[baseSev] || baseSev) : baseSev
  const confidence = minConfidence(allBoundaries)
  const scope = patternId === 'SYSTEMIC_OP_FRAG' ? 'SYSTEMIC' : 'REGIONAL'
  const first = contributing[0]

  const distinctPrimitiveTypes = new Set()
  const allSignalIds = []
  const allEvidenceRefs = []
  const allDerivationSteps = []
  for (const c of contributing) {
    for (const t of (c._src_types || [c._src_type])) {
      if (t !== 'COMPOUND_CONVERGENCE') distinctPrimitiveTypes.add(t)
    }
    allSignalIds.push(...(c.source_signal_ids || []))
    allEvidenceRefs.push(...(c.evidence_refs || []))
    allDerivationSteps.push(...(c.derivation_trace || []))
  }

  const combinationStep = {
    source_id: contributing.map(c => c.consequence_type_id).join(' + '),
    source_type: 'combination',
    rule: escalate ? '§5.2 + §6.1' : '§5.2',
    target_id: patternId,
    target_type: 'consequence',
  }

  const mergedSignalIds = [...new Set(allSignalIds)]

  return {
    consequence_id: 'csq-' + patternId.toLowerCase().replace(/_/g, '-') + '-' + locusIdPart(lk),
    consequence_type_id: patternId,
    structural_consequence_label: vocab.structural_consequence_label,
    operator_consequence_title: vocab.operator_consequence_title,
    operational_implication: vocab.operational_implication,
    severity,
    confidence,
    consequence_scope: scope,
    primary_locus: first.primary_locus,
    primary_locus_display: first.primary_locus_display,
    source_conditions: allSources,
    source_condition_types: [...distinctPrimitiveTypes],
    source_signal_ids: mergedSignalIds,
    contributing_consequences: contributing.map(c => c.consequence_id),
    activation_rule: '§5.2 ' + patternId,
    combination_pattern: patternId,
    escalation_applied: escalate,
    escalation_reason: escalate
      ? distinctPrimitiveTypes.size + ' primitive conditions converge → severity escalates one level above MAX (§6.1)'
      : null,
    decomposition: {
      contributing_primitive_consequences: contributing.map(c => c.consequence_id),
      decomposition_available: true,
    },
    evidence_summary: {
      condition_count: allSources.length,
      condition_types: [...distinctPrimitiveTypes],
      source_signal_families: extractSignalFamilies(mergedSignalIds),
    },
    evidence_refs: [
      ...allEvidenceRefs,
      ...contributing.map(c => ({
        type: 'consequence',
        id: c.consequence_id,
        condition_type: c.consequence_type_id,
      })),
    ],
    governance_caveat: null,
    derivation_trace: [...allDerivationSteps, combinationStep],
    pressure_zone_id: first.pressure_zone_id || null,
    temporal_marker: null,
    evidence_class: contributing.some(c => c.evidence_class === 'MIXED' || (c.visibility_layer === 'RUNTIME'))
      ? (contributing.every(c => c.visibility_layer === 'RUNTIME') ? contributing[0].evidence_class : 'MIXED')
      : (first.evidence_class || 'STATIC_IMPORT'),
    visibility_layer: contributing.some(c => c.visibility_layer === 'RUNTIME')
      ? (contributing.every(c => c.visibility_layer === 'RUNTIME') ? 'RUNTIME' : 'MIXED')
      : 'STATIC',
  }
}

function detectCombinations(dedupedAtomics, registry) {
  const byLocus = {}
  for (const csq of dedupedAtomics) {
    if (!byLocus[csq._lk]) byLocus[csq._lk] = []
    byLocus[csq._lk].push(csq)
  }

  const combinations = []
  const combinedLoci = new Set()

  for (const [lk, atomics] of Object.entries(byLocus)) {
    if (atomics.length < 2) continue

    const coordFromDPC = atomics.find(c =>
      c.consequence_type_id === 'COORD_FRAG' && hasSourceType(c, 'DELIVERY_PRESSURE_CONCENTRATION'))
    const depAmpFromDCkP = atomics.find(c =>
      c.consequence_type_id === 'DEP_AMP' && hasSourceType(c, 'DEPENDENCY_CHOKE_POINT'))
    if (coordFromDPC && depAmpFromDCkP) {
      combinations.push(makeCombination('AMPLIFIED_DEP_FRAG', [coordFromDPC, depAmpFromDCkP], lk, false, registry))
      combinedLoci.add(lk)
    }

    const delExpFromDPC = atomics.find(c =>
      c.consequence_type_id === 'DEL_EXP' && hasSourceType(c, 'DELIVERY_PRESSURE_CONCENTRATION'))
    const resilFromSMC = atomics.find(c =>
      c.consequence_type_id === 'RESIL_DEF' && hasSourceType(c, 'STRUCTURAL_MASS_CONCENTRATION'))
    if (delExpFromDPC && resilFromSMC) {
      combinations.push(makeCombination('STRUCT_GRAVITY_WELL', [delExpFromDPC, resilFromSMC], lk, false, registry))
      combinedLoci.add(lk)
    }

    const primitiveTypes = new Set()
    for (const csq of atomics) {
      for (const t of (csq._src_types || [csq._src_type])) {
        if (t !== 'COMPOUND_CONVERGENCE') primitiveTypes.add(t)
      }
    }
    if (atomics.length >= 3 && primitiveTypes.size >= 3) {
      combinations.push(makeCombination('SYSTEMIC_OP_FRAG', atomics, lk, true, registry))
      combinedLoci.add(lk)
    }
  }

  return { combinations, combinedLoci }
}

// ─── Core Compilation ──────────────────────────────────

function emptyResult() {
  return {
    consequences: [],
    atomic_consequences: [],
    combination_consequences: [],
    consequence_count: 0,
    systemic_count: 0,
    primary_consequence: null,
    compilation_trace: {
      input_condition_count: 0,
      conditions_producing_consequences: 0,
      suppressed_conditions: 0,
      combination_patterns_matched: 0,
      escalations_applied: 0,
    },
  }
}

function stripInternal(csq) {
  const { _src_type, _src_types, _src_boundary, _src_boundaries, _defining, _lk, ...clean } = csq
  return clean
}

function compile(synthesisResult, fullReport) {
  if (!synthesisResult || !synthesisResult.conditions) return emptyResult()

  const active = synthesisResult.conditions.filter(c => c.severity !== 'NOMINAL')
  if (active.length === 0) {
    const r = emptyResult()
    r.compilation_trace.input_condition_count = synthesisResult.conditions.length
    r.compilation_trace.suppressed_conditions = synthesisResult.conditions.length
    return r
  }

  const registry = (fullReport && fullReport.semantic_domain_registry) || []
  const ctx = {
    dpsigData: fullReport && fullReport.dpsig_signal_summary,
    structuralEnrichment: fullReport && fullReport.structural_enrichment,
  }

  let rawAtomics = []
  for (const cond of active) {
    rawAtomics.push(...mapCondition(cond, ctx, registry))
  }

  const deduped = deduplicateConsequences(rawAtomics)
  const { combinations, combinedLoci } = detectCombinations(deduped, registry)

  const topLevel = []
  const allAtomics = deduped.map(stripInternal)

  for (const csq of deduped) {
    if (combinedLoci.has(csq._lk)) continue
    if (csq._defining) topLevel.push(stripInternal(csq))
  }
  for (const combo of combinations) topLevel.push(combo)

  topLevel.sort((a, b) => (SEVERITY_RANK[a.severity] ?? 5) - (SEVERITY_RANK[b.severity] ?? 5))

  return {
    consequences: topLevel,
    atomic_consequences: allAtomics,
    combination_consequences: combinations.map(c => c.consequence_id),
    consequence_count: topLevel.length,
    systemic_count: topLevel.filter(c => c.consequence_scope === 'SYSTEMIC').length,
    primary_consequence: topLevel.length > 0 ? topLevel[0].consequence_id : null,
    compilation_trace: {
      input_condition_count: synthesisResult.conditions.length,
      conditions_producing_consequences: active.length,
      suppressed_conditions: synthesisResult.conditions.length - active.length,
      combination_patterns_matched: combinations.length,
      escalations_applied: combinations.filter(c => c.escalation_applied).length,
    },
  }
}

// ─── Teaser (SW-Intel OFF, §9.2) ──────────────────────

function compileTeaser(synthesisResult, fullReport) {
  const result = compile(synthesisResult, fullReport)
  if (result.consequence_count === 0) return null

  const top = result.consequences[0]
  return {
    consequence_teaser: {
      active_consequence_count: result.consequence_count,
      top_consequence_class: top.consequence_type_id,
      top_consequence_severity: top.severity,
      top_consequence_scope: top.consequence_scope,
      requires_module: 'SOFTWARE_INTELLIGENCE',
    },
  }
}

// ─── Cognition Slice Vocabulary (executive surface) ───

const COGNITION_SLICE_VOCABULARY = {
  DELIVERY_PRESSURE_CONCENTRATION: {
    executive_name: 'Pressure Convergence',
    localize: (d) => `Multiple delivery paths converge on ${d} — coordination and scheduling are structurally constrained.`,
    is_dynamic: true,
  },
  DEPENDENCY_CHOKE_POINT: {
    executive_name: 'Dependency Choke Point',
    localize: (d) => `${d} contains a dependency hub — many components import from this area, concentrating change impact.`,
    is_dynamic: true,
  },
  PROPAGATION_ASYMMETRY: {
    executive_name: 'Propagation Asymmetry',
    localize: (d) => `Changes originating in ${d} propagate asymmetrically — blast radius exceeds structural locality.`,
    is_dynamic: true,
  },
  STRUCTURAL_MASS_CONCENTRATION: {
    executive_name: 'Structural Gravity',
    localize: (d) => `${d} carries disproportionate structural mass — this region absorbs operational gravity.`,
    is_dynamic: true,
  },
  CROSS_DOMAIN_COUPLING_PRESSURE: {
    executive_name: 'Cross-Domain Coupling',
    localize: (d) => `${d} exhibits cross-boundary coupling that constrains operational independence between domains.`,
    is_dynamic: true,
  },
  EXECUTION_FRAGILITY: {
    executive_name: 'Execution Fragility',
    localize: (d) => `${d} shows structural fragility — localized weakness amplifies operational disruption beyond this region's apparent importance.`,
    is_dynamic: true,
  },
  EXECUTION_CONSTRICTION: {
    executive_name: 'Execution Constriction',
    localize: (d) => `${d} forces operational flow through a narrow structural passage — throughput is capped by topology, not by capacity.`,
    is_dynamic: true,
  },
  STRUCTURAL_BOUNDARY_DIVERGENCE: {
    executive_name: 'Boundary Divergence',
    localize: (d) => `${d} shows structural boundary divergence — declared organizational structure does not match actual dependency structure.`,
    is_dynamic: true,
  },
  COUPLING_INERTIA: {
    executive_name: 'Coupling Inertia',
    localize: (d) => `${d} contains tightly-coupled module clusters that resist independent evolution — bidirectional dependencies fuse modules into a single change unit.`,
    is_dynamic: true,
  },
  COMPOUND_CONVERGENCE: { executive_name: null, localize: () => null, is_dynamic: false },
  GOVERNANCE_COVERAGE_STATUS: { executive_name: null, localize: () => null, is_dynamic: false },
  EVENT_CONCENTRATION: {
    executive_name: 'Event Coordination Concentration',
    localize: (d) => `Event infrastructure concentrates coordination load — all domain events route through a central bus affecting ${d}.`,
    is_dynamic: true,
  },
  RUNTIME_DEPENDENCY_CHOKE_POINT: {
    executive_name: 'Runtime Dependency Choke Point',
    localize: (d) => `A runtime channel or gateway serving ${d} is a dependency for multiple domains — failure disrupts cross-domain coordination.`,
    is_dynamic: true,
  },
  BROKER_DEPENDENCY: {
    executive_name: 'Broker Dependency Risk',
    localize: (d) => `All edge-to-cloud communication depends on a single broker — a single point of failure for telemetry reaching ${d}.`,
    is_dynamic: true,
  },
  TOPIC_FANOUT_PRESSURE: {
    executive_name: 'Topic Fanout Pressure',
    localize: (d) => `MQTT topic families feeding ${d} create broad propagation surface — topic structure changes propagate widely.`,
    is_dynamic: true,
  },
  ASYNC_PROPAGATION_ASYMMETRY: {
    executive_name: 'Async Propagation Asymmetry',
    localize: (d) => `Broad event vocabulary converges on narrow handler surface at ${d} — many event types, few handlers, concentrated failure exposure.`,
    is_dynamic: true,
  },
  EDGE_CLOUD_PROPAGATION_RISK: {
    executive_name: 'Edge-Cloud Propagation Exposure',
    localize: (d) => `Edge devices depend on cloud-side coordination at ${d} through a single ingestion path — edge failure propagates to cloud visibility.`,
    is_dynamic: true,
  },
  RUNTIME_OBSERVABILITY_GAP: {
    executive_name: 'Runtime Observability Gap',
    localize: (d) => `Runtime flows at ${d} have weak traceability — event types exist without matching handlers.`,
    is_dynamic: true,
  },
}

const CONFIDENCE_EXECUTIVE = {
  GOVERNED: 'Governed',
  ADVISORY_BOUND: 'Advisory-bound',
  STRUCTURAL_ONLY: 'Structural only',
  RUNTIME_STRUCTURAL: 'Runtime-structural',
}

// ─── Persona: BOARDROOM (§10.1) ────────────────────────

const CLASS_RISK_LABEL = {
  A:    'flow convergence — delivery pressure concentrates here',
  B:    'structural concentration — disproportionate mass and dependency',
  C:    'structural fragility — changes break more than they should',
  D:    'coupling rigidity — tightly coupled modules resist independent change',
  E:    'structural drift — coupling patterns are shifting in ways that undermine operational predictability',
  AB:   'flow pressure on a concentrated structure — a bottleneck region that everything flows through',
  AC:   'flow pressure compounding fragility — delivery pressure hits a structurally weak region',
  AD:   'flow pressure locked by coupling — delivery converges on rigidly coupled modules',
  AE:   'flow pressure on a drifting structure — delivery converges on a region losing structural predictability',
  BC:   'concentrated and fragile — high-mass region that is also structurally brittle',
  BD:   'concentrated and rigidly coupled — high-mass region locked by bidirectional dependencies',
  BE:   'concentrated and drifting — high-mass region with shifting coupling patterns',
  CD:   'fragile and rigidly coupled — weak structure reinforced by coupling that prevents restructuring',
  CE:   'fragile and drifting — weak structure with unstable coupling that compounds unpredictability',
  DE:   'rigid yet drifting — tightly coupled modules showing structural instability',
  ABC:  'flow, concentration, and fragility converging — a gravity well that is also brittle',
  ABD:  'flow, concentration, and coupling converging — everything flows through a rigidly locked region',
  ABE:  'flow, concentration, and drift converging — a bottleneck region losing structural predictability',
  ACD:  'flow, fragility, and coupling converging — delivery pressure hits fragile coupled modules',
  ACE:  'flow, fragility, and drift converging — delivery pressure hits a fragile region that is also unstable',
  ADE:  'flow, coupling, and drift converging — delivery locked by rigid coupling in a drifting region',
  BCD:  'concentration, fragility, and coupling converging — the heaviest region is also the most brittle and the hardest to change',
  BCE:  'concentration, fragility, and drift converging — a heavy brittle region with unstable coupling',
  BDE:  'concentration, coupling, and drift converging — a rigid mass region losing structural predictability',
  CDE:  'fragility, coupling, and drift converging — fragile rigid structure that is also drifting',
  ABCD: 'all four risk dimensions converging — flow, mass, fragility, and coupling stack up in one region',
  ABCE: 'flow, concentration, fragility, and drift converging — a brittle gravity well that is also unstable',
  ABDE: 'flow, concentration, coupling, and drift converging — a rigid bottleneck losing predictability',
  ACDE: 'flow, fragility, coupling, and drift converging — delivery pressure on a fragile drifting rigid region',
  BCDE: 'concentration, fragility, coupling, and drift converging — structural risk across all defensive axes',
  ABCDE: 'all five risk dimensions converging — flow, mass, fragility, coupling, and drift stack up in one region',
}

function deriveDomainRiskProfile(conditionTypes) {
  const classSet = new Set()
  for (const ct of conditionTypes) {
    const ont = CONDITION_ONTOLOGY_CLASS[ct]
    if (ont) classSet.add(ont.class_id)
  }
  const classKey = ['A', 'B', 'C', 'D', 'E'].filter(c => classSet.has(c)).join('')
  const riskLabel = CLASS_RISK_LABEL[classKey] || 'structural stress is present'

  if (classSet.size >= 3) return { shape: 'gravity_well', label: riskLabel, classes: classKey }
  if (classSet.size === 2) {
    if (classSet.has('C') && classSet.has('B')) return { shape: 'fragile_concentrated', label: riskLabel, classes: classKey }
    if (classSet.has('C')) return { shape: 'fragile_compound', label: riskLabel, classes: classKey }
    if (classSet.has('A') && classSet.has('B')) return { shape: 'pressure_concentration', label: riskLabel, classes: classKey }
    return { shape: 'compound', label: riskLabel, classes: classKey }
  }
  if (classSet.has('C')) return { shape: 'fragile', label: riskLabel, classes: classKey }
  if (classSet.has('A')) return { shape: 'flow_pressure', label: riskLabel, classes: classKey }
  if (classSet.has('B')) return { shape: 'concentration', label: riskLabel, classes: classKey }
  if (classSet.has('D')) return { shape: 'rigidity', label: riskLabel, classes: classKey }
  return { shape: 'stress', label: riskLabel, classes: classKey }
}

const RUNTIME_CONDITION_SET = new Set([
  'EVENT_CONCENTRATION', 'RUNTIME_DEPENDENCY_CHOKE_POINT', 'BROKER_DEPENDENCY',
  'TOPIC_FANOUT_PRESSURE', 'ASYNC_PROPAGATION_ASYMMETRY',
  'EDGE_CLOUD_PROPAGATION_RISK', 'RUNTIME_OBSERVABILITY_GAP',
])

function synthesizeBoardroomNarrative(domainConcentration, slices) {
  if (!domainConcentration || domainConcentration.length === 0) return { domain_narratives: [], executive_synthesis: null }

  const domainConditionTypes = {}
  for (const slice of slices) {
    const d = slice.domain || 'System-wide'
    if (!domainConditionTypes[d]) domainConditionTypes[d] = []
    domainConditionTypes[d].push(slice.condition_type)
  }

  const narratives = domainConcentration
    .filter(d => d.condition_count > 0)
    .map(d => {
      const condTypes = domainConditionTypes[d.domain] || []
      const risk = deriveDomainRiskProfile(condTypes)
      return {
        domain: d.domain,
        condition_count: d.condition_count,
        weight: d.weight,
        consequence_count: d.consequence_types.length,
        risk_shape: risk.shape,
        risk_label: risk.label,
        classes: risk.classes,
      }
    })

  let synthesis = null
  if (narratives.length === 1) {
    const a = narratives[0]
    const verb = a.risk_shape === 'gravity_well' ? 'is your structural gravity well' : 'concentrates structural risk'
    synthesis = `${a.domain} ${verb} — ${a.risk_label}.`
  } else if (narratives.length === 2) {
    const a = narratives[0], b = narratives[1]
    const aVerb = a.risk_shape === 'gravity_well' ? 'is your structural gravity well'
      : a.risk_shape === 'pressure_concentration' ? 'is a structural bottleneck'
      : 'concentrates structural risk'
    synthesis = `${a.domain} ${aVerb} — ${a.risk_label}. ${b.domain} has a separate problem: ${b.risk_label}. These are distinct operational risks with different remediation shapes.`
  } else {
    const a = narratives[0]
    const runtimeDomains = narratives.filter((n, i) => i > 0 && slices.some(s => s.domain === n.domain && RUNTIME_CONDITION_SET.has(s.condition_type)))
    if (runtimeDomains.length > 0) {
      const rtNames = runtimeDomains.slice(0, 3).map(n => n.domain).join(', ')
      synthesis = `${a.domain} concentrates the dominant risk — ${a.risk_label}. Runtime connectivity analysis reveals additional structural stress in ${rtNames}${runtimeDomains.length > 3 ? ` (+${runtimeDomains.length - 3} more)` : ''}. ${narratives.length - 1 - runtimeDomains.length > 0 ? (narratives.length - 1 - runtimeDomains.length) + ' other region' + (narratives.length - 1 - runtimeDomains.length > 1 ? 's' : '') + ' also show structural stress.' : ''}`
    } else {
      synthesis = `${a.domain} concentrates the dominant risk — ${a.risk_label}. ${narratives.length - 1} other region${narratives.length - 1 > 1 ? 's' : ''} show independent structural stress.`
    }
  }

  return { domain_narratives: narratives, executive_synthesis: synthesis }
}

function derivePostureLabel(consequences, hasSystemic) {
  if (consequences.length === 0) return 'Nominal'
  if (hasSystemic) return 'Systemic Operational Fragility'
  if (consequences.length >= 3) return 'Multi-Factor Structural Stress'
  if (consequences.length === 2) return 'Compound Structural Stress'
  return consequences[0].operator_consequence_title
}

function forBoardroom(consequenceResult, synthesisResult, fullReport) {
  if (!consequenceResult || consequenceResult.consequence_count === 0) return null

  const csqs = consequenceResult.consequences
  const hasSystemic = consequenceResult.systemic_count > 0
  const registry = (fullReport && fullReport.semantic_domain_registry) || []

  const slices = []
  if (synthesisResult && synthesisResult.conditions) {
    for (const cond of synthesisResult.conditions) {
      if (cond.severity === 'NOMINAL') continue
      const vocab = COGNITION_SLICE_VOCABULARY[cond.condition_type]
      if (!vocab || !vocab.is_dynamic) continue
      const domains = (cond.shared_topology_targets && cond.shared_topology_targets.domains) || []
      const domainDisplay = domains.length > 0
        ? resolveDomainDisplay(domains[0], registry).display_name
        : 'System-wide'
      slices.push({
        executive_name: vocab.executive_name,
        condition_type: cond.condition_type,
        domain: domainDisplay,
        operational_meaning: vocab.localize(domainDisplay),
        severity: cond.severity,
        confidence: cond.governance_boundary,
        confidence_label: CONFIDENCE_EXECUTIVE[cond.governance_boundary] || cond.governance_boundary,
        evidence_class: cond.evidence_class || 'STATIC_IMPORT',
        evidence_mode: cond.evidence_mode || 'STATIC_EVIDENCE',
        evidence_refs: [{
          type: 'condition',
          id: cond.condition_id,
          condition_type: cond.condition_type,
        }],
        source_signal_ids: [...(cond.supporting_signal_ids || [])],
      })
    }
  }

  const postureLabel = derivePostureLabel(csqs, hasSystemic)
  const primaryLocus = csqs[0].primary_locus_display
  const overallConfidence = csqs[0].confidence
  const confidenceSuffix = overallConfidence === 'ADVISORY_BOUND'
    ? ' Advisory-bound — evidence classes are mixed and reconciliation is incomplete.'
    : overallConfidence === 'STRUCTURAL_ONLY'
    ? ' Structurally derived — no semantic qualification available.'
    : ''
  const combinedSynthesis = slices.length > 1
    ? `Together, these ${slices.length} dynamics create ${postureLabel} concentrated in ${primaryLocus}.${confidenceSuffix}`
    : slices.length === 1
    ? `This dynamic indicates ${postureLabel} in ${primaryLocus}.${confidenceSuffix}`
    : null

  const allAtomics = consequenceResult.atomic_consequences || []
  const runtimeAtomicCount = allAtomics.filter(a => a.visibility_layer === 'RUNTIME').length
  const totalAtomicCount = allAtomics.length

  const consequenceThemes = []
  const themeMap = {}
  for (const csq of csqs) {
    const tid = csq.consequence_type_id
    if (!themeMap[tid]) {
      const vocab = CONSEQUENCE_VOCABULARY[tid]
      const srcConds = csq.source_conditions || []
      const srcTypes = csq.source_condition_types || []
      const locusDisplay = csq.primary_locus_display || null
      themeMap[tid] = {
        theme_id: tid,
        theme_label: vocab ? vocab.operator_consequence_title : tid,
        description: vocab ? vocab.operational_implication : '',
        severity: csq.severity,
        scope: csq.consequence_scope,
        source_count: srcConds.length,
        is_combination: !!csq.combination_pattern,
        _evidence_classes: new Set(),
        _static_sources: 0,
        _runtime_sources: 0,
        _causal_types: new Set(srcTypes),
        _locus_displays: locusDisplay ? [locusDisplay] : [],
        board_implication: vocab ? vocab.board_implication : null,
      }
    } else {
      themeMap[tid].source_count += (csq.source_conditions || []).length
      if ((SEVERITY_RANK[csq.severity] || 0) > (SEVERITY_RANK[themeMap[tid].severity] || 0)) {
        themeMap[tid].severity = csq.severity
      }
      for (const st of (csq.source_condition_types || [])) themeMap[tid]._causal_types.add(st)
      if (csq.primary_locus_display && !themeMap[tid]._locus_displays.includes(csq.primary_locus_display)) {
        themeMap[tid]._locus_displays.push(csq.primary_locus_display)
      }
    }
    if (csq.evidence_class) themeMap[tid]._evidence_classes.add(csq.evidence_class)
    const srcTypes = csq.source_condition_types || []
    const hasRuntimeSrc = srcTypes.some(t => RUNTIME_CONDITION_SET.has(t))
    if (csq.visibility_layer === 'RUNTIME' || csq.visibility_layer === 'MIXED' || hasRuntimeSrc) {
      themeMap[tid]._runtime_sources += (csq.source_conditions || []).length
    } else {
      themeMap[tid]._static_sources += (csq.source_conditions || []).length
    }
  }
  for (const tid of Object.keys(themeMap)) {
    const t = themeMap[tid]
    t.evidence_classes = [...t._evidence_classes]
    t.static_sources = t._static_sources
    t.runtime_sources = t._runtime_sources
    if (t._runtime_sources > 0 && t._static_sources > 0) {
      t.evidence_diversity = 'MIXED'
      t.evidence_annotation = `${t.source_count} sources (${t._static_sources} static, ${t._runtime_sources} runtime)`
    } else if (t._runtime_sources > 0) {
      t.evidence_diversity = 'RUNTIME'
      t.evidence_annotation = `${t.source_count} sources (runtime connectivity evidence)`
    } else if (runtimeAtomicCount > 0) {
      t.evidence_diversity = 'MIXED'
      t.evidence_annotation = `${t.source_count} sources — system includes ${runtimeAtomicCount} runtime-derived findings across ${totalAtomicCount} total structural observations`
    } else {
      t.evidence_diversity = 'STATIC'
      t.evidence_annotation = `${t.source_count} sources`
    }
    const causalTypes = [...t._causal_types]
    const CAUSAL_LABELS = {
      STRUCTURAL_MASS_CONCENTRATION: 'structural concentration',
      CROSS_DOMAIN_COUPLING_PRESSURE: 'cross-domain coupling',
      COUPLING_INERTIA: 'coupling resistance',
      STRUCTURAL_BOUNDARY_DIVERGENCE: 'boundary drift',
      GOVERNANCE_COVERAGE_STATUS: 'governance gap',
      EXECUTION_FRAGILITY: 'fragility',
      EXECUTION_CONSTRICTION: 'constriction',
      DELIVERY_PRESSURE_CONCENTRATION: 'delivery pressure',
      DEPENDENCY_CHOKE_POINT: 'dependency concentration',
      PROPAGATION_ASYMMETRY: 'propagation asymmetry',
      EVENT_CONCENTRATION: 'event coordination concentration',
      RUNTIME_DEPENDENCY_CHOKE_POINT: 'runtime choke point',
      BROKER_DEPENDENCY: 'broker dependency',
      TOPIC_FANOUT_PRESSURE: 'topic fanout',
      ASYNC_PROPAGATION_ASYMMETRY: 'async propagation',
      EDGE_CLOUD_PROPAGATION_RISK: 'edge-cloud dependency',
      RUNTIME_OBSERVABILITY_GAP: 'observability gap',
      COMPOUND_CONVERGENCE: 'convergence',
    }
    const locusDisplays = t._locus_displays || []

    let themeSlices = slices.filter(s => causalTypes.includes(s.condition_type))
    if (themeSlices.length === 0 && causalTypes.includes('COMPOUND_CONVERGENCE')) {
      themeSlices = slices.filter(s => s.severity === 'HIGH' || s.severity === 'CRITICAL').slice(0, 10)
    }
    const SRANK = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3, LOW: 4, NOMINAL: 5 }
    const driverGroups = {}
    for (const s of themeSlices) {
      const key = s.executive_name
      if (!driverGroups[key]) driverGroups[key] = { name: key, domains: [], maxSev: 'NOMINAL', count: 0 }
      driverGroups[key].count++
      if (!driverGroups[key].domains.includes(s.domain)) driverGroups[key].domains.push(s.domain)
      if ((SRANK[s.severity] ?? 5) < (SRANK[driverGroups[key].maxSev] ?? 5)) driverGroups[key].maxSev = s.severity
    }
    const topContributors = Object.values(driverGroups)
      .sort((a, b) => (SRANK[a.maxSev] ?? 5) - (SRANK[b.maxSev] ?? 5) || b.count - a.count)
      .slice(0, 5)
      .map(g => ({
        name: g.name,
        domain: g.domains.length === 1 ? g.domains[0] : g.domains.length <= 3 ? g.domains.join(', ') : g.domains.slice(0, 2).join(', ') + ' +' + (g.domains.length - 2),
        severity: g.maxSev,
      }))

    t.board_grounding = {
      causal_drivers: causalTypes.slice(0, 4).map(ct => CAUSAL_LABELS[ct] || ct.toLowerCase().replace(/_/g, ' ')),
      primary_zone: locusDisplays[0] || (topContributors[0] ? topContributors[0].domain : null),
      contributing_zones: locusDisplays.slice(0, 3),
      top_contributors: topContributors,
      evidence_paths: t.evidence_classes,
    }

    delete t._evidence_classes
    delete t._static_sources
    delete t._runtime_sources
    delete t._causal_types
    delete t._locus_displays
    consequenceThemes.push(t)
  }
  consequenceThemes.sort((a, b) => (SEVERITY_RANK[b.severity] || 0) - (SEVERITY_RANK[a.severity] || 0))

  const CONDITION_CONSEQUENCE_MAP = {
    DELIVERY_PRESSURE_CONCENTRATION: ['COORD_FRAG', 'DEL_EXP', 'OP_BOTTLENECK'],
    DEPENDENCY_CHOKE_POINT: ['DEP_AMP', 'COORD_FRAG', 'OP_BOTTLENECK'],
    PROPAGATION_ASYMMETRY: ['PROP_EXP', 'DEL_EXP'],
    STRUCTURAL_MASS_CONCENTRATION: ['RESIL_DEF', 'STAB_RISK'],
    CROSS_DOMAIN_COUPLING_PRESSURE: ['COORD_FRAG', 'PROP_EXP'],
    EXECUTION_FRAGILITY: ['RESIL_DEF', 'COORD_FRAG', 'DEP_AMP'],
    EXECUTION_CONSTRICTION: ['OP_BOTTLENECK', 'COORD_FRAG', 'DEP_AMP'],
    STRUCTURAL_BOUNDARY_DIVERGENCE: ['GOV_GAP', 'COORD_FRAG', 'PROP_EXP'],
    COUPLING_INERTIA: ['COORD_FRAG', 'OP_BOTTLENECK', 'DEP_AMP'],
  }
  const domainBuckets = {}
  for (const slice of slices) {
    const d = slice.domain || 'System-wide'
    if (!domainBuckets[d]) {
      domainBuckets[d] = { domain: d, condition_count: 0, consequence_types: new Set() }
    }
    domainBuckets[d].condition_count++
    const csqTypes = CONDITION_CONSEQUENCE_MAP[slice.condition_type] || []
    for (const ct of csqTypes) domainBuckets[d].consequence_types.add(ct)
  }
  const totalConditions = slices.length || 1
  const domainConcentration = Object.values(domainBuckets)
    .map(b => ({ domain: b.domain, condition_count: b.condition_count, weight: b.condition_count / totalConditions, consequence_types: [...b.consequence_types] }))
    .sort((a, b) => b.weight - a.weight)

  const { domain_narratives, executive_synthesis } = synthesizeBoardroomNarrative(domainConcentration, slices)

  return {
    posture_label: postureLabel,
    posture_severity: csqs[0].severity,
    posture_scope: hasSystemic ? 'SYSTEMIC'
      : csqs.some(c => c.consequence_scope === 'REGIONAL') ? 'REGIONAL' : 'LOCAL',
    primary_locus: primaryLocus,
    consequence_count: consequenceResult.consequence_count,
    systemic_count: consequenceResult.systemic_count,
    overall_confidence: overallConfidence,
    overall_confidence_label: CONFIDENCE_EXECUTIVE[overallConfidence] || overallConfidence,
    cognition_slices: slices,
    consequence_themes: consequenceThemes,
    domain_concentration: domainConcentration,
    domain_narratives,
    executive_synthesis,
    combined_synthesis: combinedSynthesis,
  }
}

// ─── Persona: BALANCED (§10.2) ────────────────────────

function resolveSourceConditions(consequence, conditionMap) {
  return (consequence.source_conditions || []).map(condId => {
    const cond = conditionMap[condId]
    if (!cond) return { condition_type: condId, display_title: condId }
    const vocab = COGNITION_SLICE_VOCABULARY[cond.condition_type]
    return {
      condition_type: cond.condition_type,
      display_title: (vocab && vocab.executive_name) || cond.condition_type,
    }
  })
}

function deriveCombinationExplanation(consequence) {
  switch (consequence.combination_pattern) {
    case 'SYSTEMIC_OP_FRAG':
      return 'Multiple independent structural conditions converge through independent evidence paths.'
    case 'AMPLIFIED_DEP_FRAG':
      return 'Coordination fragility compounded by dependency concentration on the same structural point.'
    case 'STRUCT_GRAVITY_WELL':
      return 'Delivery exposure and resilience deficit compound on the structurally dominant region.'
    default:
      return 'Multiple structural consequences combined.'
  }
}

function deriveRelationshipVerb(consequence, primary) {
  const sameLocus = consequence.primary_locus_display === primary.primary_locus_display
  if (!sameLocus) return 'widens'
  if (consequence.combination_pattern) return 'amplifies'
  const csqScope = SCOPE_RANK[consequence.consequence_scope] ?? 0
  const priScope = SCOPE_RANK[primary.consequence_scope] ?? 0
  if (csqScope < priScope) return 'concentrates'
  if (csqScope > priScope) return 'converges with'
  return 'reinforces'
}

function compileRelationshipSentence(verb, consequence, primary) {
  const typeId = consequence.consequence_type_id
  const locus = consequence.primary_locus_display
  const primaryLocus = primary.primary_locus_display

  if (verb === 'amplifies') {
    if (typeId === 'AMPLIFIED_DEP_FRAG') return 'Dependency hub sits inside the pressure corridor.'
    if (typeId === 'STRUCT_GRAVITY_WELL') return 'Delivery risk compounds on the structurally dominant region.'
    return `Compounds structural stress on ${primaryLocus}.`
  }
  if (verb === 'reinforces') return `Structural pressure intensifies on ${primaryLocus}.`
  if (verb === 'widens') return `Structural exposure extends to ${locus}.`
  if (verb === 'concentrates') return `Pressure concentrates within ${locus}.`
  if (verb === 'converges with') return `Broader dynamic converges on ${primaryLocus}.`
  return consequence.operational_implication
}

function deriveBalancedConfidenceSentence(confidence, primaryLocus) {
  switch (confidence) {
    case 'ADVISORY_BOUND':
      return `Advisory-bound — structural reconciliation incomplete outside ${primaryLocus}.`
    case 'STRUCTURAL_ONLY':
      return 'Structural only — no semantic qualification available for this assessment.'
    case 'GOVERNED':
      return 'Governed — all evidence classes reconciled.'
    default:
      return `${confidence} confidence.`
  }
}

function deriveBalancedSynthesis(consequences, postureLabel, primaryLocus) {
  if (consequences.length === 0) return null
  if (consequences.length === 1) {
    return `${consequences[0].operator_consequence_title} concentrated in ${primaryLocus}.`
  }
  const wideningLoci = [...new Set(
    consequences
      .filter(c => c.primary_locus_display !== primaryLocus)
      .map(c => c.primary_locus_display)
  )]
  if (wideningLoci.length > 0) {
    return `${postureLabel} concentrated in ${primaryLocus} — exposure widens to ${wideningLoci.join(', ')}.`
  }
  return `${postureLabel} concentrated in ${primaryLocus} — ${consequences.length} structural dynamics converge on the same corridor.`
}

function forBalanced(consequenceResult, synthesisResult, fullReport) {
  if (!consequenceResult || consequenceResult.consequence_count === 0) return null

  const csqs = consequenceResult.consequences
  const hasSystemic = consequenceResult.systemic_count > 0
  const registry = (fullReport && fullReport.semantic_domain_registry) || []

  const postureLabel = derivePostureLabel(csqs, hasSystemic)
  const primaryLocus = csqs[0].primary_locus_display
  const overallConfidence = csqs[0].confidence

  const conditionMap = {}
  if (synthesisResult && synthesisResult.conditions) {
    for (const cond of synthesisResult.conditions) {
      conditionMap[cond.condition_id] = cond
    }
  }

  const primary = csqs[0]
  const isCombination = !!primary.combination_pattern

  const contributingTypes = isCombination
    ? (primary.source_condition_types || []).map(ct => {
        const vocab = COGNITION_SLICE_VOCABULARY[ct]
        return { condition_type: ct, executive_name: vocab ? vocab.executive_name : ct }
      })
    : null

  const primaryStory = {
    consequence_type_id: primary.consequence_type_id,
    title: primary.operator_consequence_title,
    operational_implication: primary.operational_implication,
    severity: primary.severity,
    confidence: primary.confidence,
    confidence_label: CONFIDENCE_EXECUTIVE[primary.confidence] || primary.confidence,
    scope: primary.consequence_scope,
    locus: primary.primary_locus_display,
    source_conditions: resolveSourceConditions(primary, conditionMap),
    evidence_refs: primary.evidence_refs || [],
    source_signal_ids: primary.source_signal_ids || [],
    is_combination: isCombination,
    combination_pattern: isCombination ? primary.combination_pattern : null,
    combination_explanation: isCombination ? deriveCombinationExplanation(primary) : null,
    contributing_condition_types: contributingTypes,
    escalation_applied: isCombination ? (primary.escalation_applied || false) : false,
    escalation_reason: isCombination ? (primary.escalation_reason || null) : null,
  }

  const reinforcementFlow = csqs.slice(1).map(csq => {
    const verb = deriveRelationshipVerb(csq, primary)
    return {
      consequence_type_id: csq.consequence_type_id,
      title: csq.operator_consequence_title,
      operational_implication: csq.operational_implication,
      severity: csq.severity,
      confidence_label: CONFIDENCE_EXECUTIVE[csq.confidence] || csq.confidence,
      relationship_verb: verb,
      relationship_sentence: compileRelationshipSentence(verb, csq, primary),
      evidence_refs: csq.evidence_refs || [],
    }
  })

  const ontologyGroups = []
  const classMap = {}
  if (synthesisResult && synthesisResult.conditions) {
    for (const cond of synthesisResult.conditions) {
      if (cond.severity === 'NOMINAL') continue
      const ontClass = CONDITION_ONTOLOGY_CLASS[cond.condition_type]
      if (!ontClass) continue
      const cid = ontClass.class_id
      if (!classMap[cid]) {
        classMap[cid] = {
          class_id: ontClass.class_id,
          class_name: ontClass.class_name,
          class_question: ontClass.class_question,
          conditions: [],
        }
      }
      const vocab = COGNITION_SLICE_VOCABULARY[cond.condition_type]
      const domains = (cond.shared_topology_targets && cond.shared_topology_targets.domains) || []
      const domainDisplay = domains.length > 0
        ? resolveDomainDisplay(domains[0], registry).display_name
        : 'System-wide'
      classMap[cid].conditions.push({
        condition_type: cond.condition_type,
        executive_name: vocab ? vocab.executive_name : cond.condition_type,
        domain: domainDisplay,
        severity: cond.severity,
        operational_meaning: vocab ? vocab.localize(domainDisplay) : '',
        confidence: cond.governance_boundary,
        confidence_label: CONFIDENCE_EXECUTIVE[cond.governance_boundary] || cond.governance_boundary,
      })
    }
  }
  for (const cid of ['A', 'B', 'C', 'D', 'E']) {
    if (classMap[cid]) ontologyGroups.push(classMap[cid])
  }

  return {
    posture_label: postureLabel,
    posture_severity: csqs[0].severity,
    posture_scope: hasSystemic ? 'SYSTEMIC'
      : csqs.some(c => c.consequence_scope === 'REGIONAL') ? 'REGIONAL' : 'LOCAL',
    primary_locus: primaryLocus,
    consequence_count: consequenceResult.consequence_count,
    systemic_count: consequenceResult.systemic_count,
    overall_confidence: overallConfidence,
    overall_confidence_label: CONFIDENCE_EXECUTIVE[overallConfidence] || overallConfidence,
    combined_synthesis: deriveBalancedSynthesis(csqs, postureLabel, primaryLocus),
    primary_story: primaryStory,
    reinforcement_flow: reinforcementFlow,
    confidence_sentence: deriveBalancedConfidenceSentence(overallConfidence, primaryLocus),
    ontology_groups: ontologyGroups,
  }
}

// ─── Persona: OPERATOR (§10.4) ───────────────────

function forOperator(consequenceResult) {
  if (!consequenceResult) return null

  return {
    headline_consequences: consequenceResult.consequences.map(c => ({
      consequence_id: c.consequence_id,
      consequence_type_id: c.consequence_type_id,
      operator_consequence_title: c.operator_consequence_title,
      severity: c.severity,
      confidence: c.confidence,
      consequence_scope: c.consequence_scope,
      source_conditions: c.source_conditions,
      source_condition_types: c.source_condition_types || [],
      source_signal_ids: c.source_signal_ids || [],
      evidence_refs: c.evidence_refs || [],
      evidence_summary: c.evidence_summary || null,
      combination_pattern: c.combination_pattern,
      escalation_applied: c.escalation_applied,
      escalation_reason: c.escalation_reason,
      derivation_trace: c.derivation_trace,
      decomposition: c.decomposition || null,
    })),
    full_atomic_set: consequenceResult.atomic_consequences,
    compilation_trace: consequenceResult.compilation_trace,
  }
}

// ─── Persona: INVESTIGATION (verification-oriented) ───

function forInvestigation(consequenceResult, synthesisResult) {
  if (!consequenceResult) return null

  return {
    consequences: consequenceResult.consequences.map(c => ({
      consequence_id: c.consequence_id,
      consequence_type_id: c.consequence_type_id,
      severity: c.severity,
      confidence: c.confidence,
      consequence_scope: c.consequence_scope,
      activation_rule: c.activation_rule,
      combination_pattern: c.combination_pattern,
      escalation_applied: c.escalation_applied,
      escalation_reason: c.escalation_reason,
      source_conditions: c.source_conditions,
      source_condition_types: c.source_condition_types || [],
      source_signal_ids: c.source_signal_ids || [],
      evidence_refs: c.evidence_refs || [],
      evidence_summary: c.evidence_summary || null,
      derivation_trace: c.derivation_trace || [],
      decomposition: c.decomposition || null,
      primary_locus: c.primary_locus,
    })),
    atomic_consequences: consequenceResult.atomic_consequences,
    combination_consequences: consequenceResult.combination_consequences,
    compilation_trace: consequenceResult.compilation_trace,
    consequence_count: consequenceResult.consequence_count,
    systemic_count: consequenceResult.systemic_count,
    primary_consequence: consequenceResult.primary_consequence,
    synthesis_condition_count: synthesisResult ? synthesisResult.conditions.length : 0,
  }
}

// ─── Exports ───────────────────────────────────────────

function deriveArchitecturalFindings(consequenceResult, synthesisResult, fullReport) {
  if (!consequenceResult || !synthesisResult) return []
  const findings = []
  const conditions = synthesisResult.conditions || []
  const atomics = consequenceResult.atomic_consequences || []
  const stAtomics = atomics.filter(a => a.visibility_layer !== 'RUNTIME')
  const rtAtomics = atomics.filter(a => a.visibility_layer === 'RUNTIME')
  const registry = (fullReport && fullReport.semantic_domain_registry) || []
  const ts = (fullReport && fullReport.topology_summary) || {}

  const stLoci = [...new Set(stAtomics.map(a => a.primary_locus_display).filter(Boolean))]
  const rtLoci = [...new Set(rtAtomics.map(a => a.primary_locus_display).filter(Boolean))]
  const sharedLoci = stLoci.filter(l => rtLoci.includes(l))
  const rtOnlyLoci = rtLoci.filter(l => !stLoci.includes(l))

  if (stLoci.length > 0 && rtLoci.length > 0 && rtOnlyLoci.length > 0) {
    findings.push({
      id: 'AF-001',
      title: 'Structural vs Operational Gravity Divergence',
      description: 'The code\'s structural center of mass and the system\'s operational center of mass do not fully coincide. Static gravity concentrates at ' + stLoci.slice(0, 2).join(', ') + '. Runtime operational gravity concentrates at ' + rtOnlyLoci.slice(0, 3).join(', ') + '.' + (sharedLoci.length > 0 ? ' Partial overlap at ' + sharedLoci.join(', ') + '.' : ''),
      evidence: 'Static: ' + stAtomics.length + ' consequences across ' + stLoci.length + ' loci. Runtime: ' + rtAtomics.length + ' consequences across ' + rtLoci.length + ' loci. Divergent loci: ' + rtOnlyLoci.length + '.',
      significance: 'CRITICAL',
      impacted_domains: [...new Set([...stLoci, ...rtOnlyLoci])],
      executive_implication: 'Transformation planning based solely on static code analysis targets the wrong center of mass for operational resilience. The runtime coordination backbone requires separate assessment.',
    })
  }

  const totalDomains = registry.length
  const runtimeBacked = registry.filter(d => d.backing_status === 'RUNTIME_BACKED' || d.runtime_visible).length
  if (runtimeBacked > 0) {
    findings.push({
      id: 'AF-002',
      title: 'Runtime Visibility Corrected Domain Coverage',
      description: runtimeBacked + ' of ' + totalDomains + ' domains were invisible to static import analysis but operationally connected through runtime connectivity. The original Q-03 "semantic-only" classification was a visibility-layer gap, not a coverage gap.',
      evidence: 'Static backing: ' + (totalDomains - runtimeBacked) + ' domains. Runtime backing: ' + runtimeBacked + ' domains. Evidence layers: EVENT_FLOW, MQTT_TOPIC_FLOW, WEBSOCKET_FLOW, API_BOUNDARY, DI_MODULE_GRAPH.',
      significance: 'HIGH',
      impacted_domains: registry.filter(d => d.backing_status === 'RUNTIME_BACKED' || d.runtime_visible).map(d => d.business_label || d.domain_name || d.domain_id),
      executive_implication: 'Domain coverage is complete when measured across all visibility layers. The previous "13 dark domains" conclusion was a measurement limitation, not a system reality.',
    })
  }

  const brokerCond = conditions.find(c => c.condition_type === 'BROKER_DEPENDENCY')
  if (brokerCond) {
    findings.push({
      id: 'AF-003',
      title: 'MQTT Broker Operational Single Point of Failure',
      description: 'All edge-to-cloud telemetry routes through a single MQTT broker. Edge agents on separate hardware depend entirely on this endpoint. No import graph analysis can detect this dependency.',
      evidence: brokerCond.measurement_basis || 'Single broker dependency detected via MQTT topology analysis.',
      significance: 'HIGH',
      impacted_domains: (brokerCond.shared_topology_targets && brokerCond.shared_topology_targets.domains) || [],
      executive_implication: 'Broker failure disconnects all field telemetry. This is the highest-impact single point of failure in the system and is invisible to static code analysis.',
    })
  }

  const eventCond = conditions.find(c => c.condition_type === 'EVENT_CONCENTRATION' && c.evidence_class === 'EVENT_FLOW')
  if (eventCond) {
    findings.push({
      id: 'AF-004',
      title: 'Event Coordination Backbone Concentration',
      description: 'Domain event infrastructure concentrates coordination load through a narrow handler surface. ' + (eventCond.measurement_basis || ''),
      evidence: 'Event concentration ratio: ' + eventCond.signal_value + ':1. Evidence class: EVENT_FLOW.',
      significance: 'ELEVATED',
      impacted_domains: (eventCond.shared_topology_targets && eventCond.shared_topology_targets.domains) || [],
      executive_implication: 'Handler failure affects all operational domains simultaneously. The event bus is the coordination backbone, not the import graph.',
    })
  }

  const edgeCloudCond = conditions.find(c => c.condition_type === 'EDGE_CLOUD_PROPAGATION_RISK')
  if (edgeCloudCond) {
    findings.push({
      id: 'AF-005',
      title: 'Edge-Cloud Dependency Chain',
      description: 'Edge devices run on separate hardware and communicate with the cloud through MQTT. This dependency crosses deployment boundaries and is invisible to any single-codebase analysis. ' + (edgeCloudCond.measurement_basis || ''),
      evidence: 'Evidence class: MQTT_TOPIC_FLOW. Edge agents: separate hardware (systemd services).',
      significance: 'ELEVATED',
      impacted_domains: (edgeCloudCond.shared_topology_targets && edgeCloudCond.shared_topology_targets.domains) || [],
      executive_implication: 'The system boundary extends beyond the codebase. Static analysis sees the cloud application. Runtime analysis sees the edge-cloud dependency chain.',
    })
  }

  return findings
}

module.exports = {
  compile,
  compileTeaser,
  forBoardroom,
  forBalanced,
  forOperator,
  forInvestigation,
  deriveArchitecturalFindings,
  CONSEQUENCE_VOCABULARY,
  COGNITION_SLICE_VOCABULARY,
  MAP_CONDITION_KEYS: new Set(['DELIVERY_PRESSURE_CONCENTRATION', 'DEPENDENCY_CHOKE_POINT', 'PROPAGATION_ASYMMETRY', 'STRUCTURAL_MASS_CONCENTRATION', 'CROSS_DOMAIN_COUPLING_PRESSURE', 'EXECUTION_FRAGILITY', 'EXECUTION_CONSTRICTION', 'STRUCTURAL_BOUNDARY_DIVERGENCE', 'COUPLING_INERTIA', 'GOVERNANCE_COVERAGE_STATUS', 'COMPOUND_CONVERGENCE', 'EVENT_CONCENTRATION', 'RUNTIME_DEPENDENCY_CHOKE_POINT', 'BROKER_DEPENDENCY', 'TOPIC_FANOUT_PRESSURE', 'ASYNC_PROPAGATION_ASYMMETRY', 'EDGE_CLOUD_PROPAGATION_RISK', 'RUNTIME_OBSERVABILITY_GAP']),
}

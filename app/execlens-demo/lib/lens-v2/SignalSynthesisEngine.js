const { translateSignal, SIGNAL_COGNITION_MAP } = require('./SoftwareIntelligenceProjectionAdapter')

// ─── 3-Layer Vocabulary ────────────────────────────────────────────
const CONDITION_VOCABULARY = {
  DELIVERY_PRESSURE_CONCENTRATION: {
    internal: 'DELIVERY_PRESSURE_CONCENTRATION',
    l2: 'Compound Pressure Zone Convergence',
    l3: 'Delivery Pressure Concentration',
    consequence: 'Execution pressure converges on a single structural region — multiple conditions active in a compound zone. Delivery decisions affecting this region carry elevated structural exposure.',
    topology_effect: 'Pressure zone boundary active with anchor pulse and contributing condition legend',
    governance: 'Structural confirmation required before deployment decisions',
  },
  DEPENDENCY_CHOKE_POINT: {
    internal: 'DEPENDENCY_CHOKE_POINT',
    l2: 'Dependency Hub Concentration',
    l3: 'Structural Dependency Bottleneck',
    consequence: 'A structural dependency hub concentrates traffic — failure or change at this point has disproportionate downstream impact.',
    topology_effect: 'Import amplification corridor active with hub node emphasis',
    governance: 'Advisory-bound until cross-domain topology confirms corridor exposure',
  },
  PROPAGATION_ASYMMETRY: {
    internal: 'PROPAGATION_ASYMMETRY',
    l2: 'Outbound Dependency Spread Asymmetry',
    l3: 'Change Propagation Exposure',
    consequence: 'Outbound dependency spread is asymmetric — changes here ripple disproportionately across the system.',
    topology_effect: 'Asymmetric propagation corridor with downstream impact markers',
    governance: 'Advisory-bound — structural confirmation needed',
  },
  STRUCTURAL_MASS_CONCENTRATION: {
    internal: 'STRUCTURAL_MASS_CONCENTRATION',
    l2: 'Cluster Load Asymmetry',
    l3: 'Structural Load Imbalance',
    consequence: 'Structural load is concentrated in a dominant region — this cluster carries disproportionate architectural weight.',
    topology_effect: 'Dominant cluster emphasis with structural gravity indicator',
    governance: 'Elevated structural attention required',
  },
  CROSS_DOMAIN_COUPLING_PRESSURE: {
    internal: 'CROSS_DOMAIN_COUPLING_PRESSURE',
    l2: 'Domain Interdependency Overload',
    l3: 'Cross-Domain Coupling Risk',
    consequence: 'Cross-domain coupling exceeds structural norms — interdependency constrains operational independence.',
    topology_effect: 'Coupling corridor emphasis with hub indicator',
    governance: 'Structural confirmation required before deployment decisions',
  },
  GOVERNANCE_COVERAGE_COMPLETE: {
    internal: 'GOVERNANCE_COVERAGE_STATUS',
    l2: 'Structural Anchoring Completeness',
    l3: 'Governance Coverage Complete',
    consequence: 'All structural nodes are domain-anchored. Governance coverage is structurally complete.',
    topology_effect: 'Anchoring status indicator — no gaps',
    governance: 'Verified — no gap',
  },
  GOVERNANCE_COVERAGE_GAP: {
    internal: 'GOVERNANCE_COVERAGE_STATUS',
    l2: 'Structural Anchoring Incompleteness',
    l3: 'Governance Coverage Gap',
    consequence: 'Structural components exist without domain anchoring — governance coverage has gaps.',
    topology_effect: 'Structural blind spots visible on topology',
    governance: 'Governance coverage verification required',
  },
  COMPOUND_CONVERGENCE: {
    internal: 'COMPOUND_CONVERGENCE',
    l2: 'Multi-Condition Topology Convergence',
    l3: 'Compound Structural Convergence',
    consequence: 'Multiple independent structural indicators converge on the same region. This is the highest-priority structural attention target.',
    topology_effect: 'Compound convergence overlay — zone boundary + hub indicator + import corridors + cluster emphasis',
    governance: 'Structural review mandatory before delivery-affecting decisions',
  },
}

// ─── Severity ──────────────────────────────────────────────────────
const SEVERITY_RANK = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3, LOW: 4, NOMINAL: 5, ACTIVATED: 2 }

function maxSeverity(severities) {
  let best = 'NOMINAL'
  for (const s of severities) {
    if ((SEVERITY_RANK[s] ?? 5) < (SEVERITY_RANK[best] ?? 5)) best = s
  }
  return best
}

// ─── Guided Interventions ──────────────────────────────────────────
const CONDITION_INTERVENTIONS = {
  DELIVERY_PRESSURE_CONCENTRATION: [
    { intervention_id: 'dpc-inspect-zone', action_type: 'INSPECT', operator_label: 'Inspect pressure zone members', topology_mutation: 'Zone members emphasized, non-members dimmed', panel_mutation: 'Zone member inventory with per-member evidence' },
    { intervention_id: 'dpc-trace-conditions', action_type: 'TRACE', operator_label: 'Trace condition origins', topology_mutation: 'Contributing signal paths visualized', panel_mutation: 'Signal → feature → condition derivation chain' },
    { intervention_id: 'dpc-blast-radius', action_type: 'INSPECT', operator_label: 'Assess blast radius', topology_mutation: 'Advisory zones (blind spots) emphasized', panel_mutation: 'Blind spot inventory and zone proximity' },
  ],
  DEPENDENCY_CHOKE_POINT: [
    { intervention_id: 'dck-trace-hub', action_type: 'TRACE', operator_label: 'Trace dependency hub connections', topology_mutation: 'Import corridors from hub file visualized', panel_mutation: 'Top-N dependents of hub file' },
    { intervention_id: 'dck-inspect-domain', action_type: 'INSPECT', operator_label: 'Inspect hub domain structural role', topology_mutation: 'Domain containing hub file emphasized', panel_mutation: 'Domain structural profile' },
  ],
  PROPAGATION_ASYMMETRY: [
    { intervention_id: 'pa-trace-fanout', action_type: 'TRACE', operator_label: 'Trace outbound dependency spread', topology_mutation: 'Fan-out corridors visualized', panel_mutation: 'Outbound dependency inventory' },
    { intervention_id: 'pa-inspect-domain', action_type: 'INSPECT', operator_label: 'Inspect propagation domain', topology_mutation: 'Domain containing fan-out file emphasized', panel_mutation: 'Domain structural profile' },
  ],
  STRUCTURAL_MASS_CONCENTRATION: [
    { intervention_id: 'smc-inspect-cluster', action_type: 'INSPECT', operator_label: 'Inspect dominant cluster composition', topology_mutation: 'Cluster boundary emphasized, member domains highlighted', panel_mutation: 'Cluster member inventory' },
    { intervention_id: 'smc-compare-clusters', action_type: 'COMPARE', operator_label: 'Compare cluster load distribution', topology_mutation: 'All clusters sized by node count', panel_mutation: 'Cluster distribution table' },
  ],
  CROSS_DOMAIN_COUPLING_PRESSURE: [
    { intervention_id: 'cdcp-trace-coupling', action_type: 'TRACE', operator_label: 'Trace coupling corridors', topology_mutation: 'Coupling paths from hub domain emphasized', panel_mutation: 'Coupling path inventory with dependent domains' },
    { intervention_id: 'cdcp-inspect-hub', action_type: 'INSPECT', operator_label: 'Inspect coordination hub', topology_mutation: 'Hub domain enlarged, connections visible', panel_mutation: 'Hub domain structural profile and dependency count' },
  ],
  GOVERNANCE_COVERAGE_STATUS: [
    { intervention_id: 'gc-inspect-gaps', action_type: 'INSPECT', operator_label: 'Inspect structural coverage', topology_mutation: 'Unanchored domains or blind spots emphasized', panel_mutation: 'Coverage status inventory' },
    { intervention_id: 'gc-qualify', action_type: 'QUALIFY', operator_label: 'Assess qualification impact', topology_mutation: 'Governance boundary indicators on affected regions', panel_mutation: 'Qualification boundary and SQO implications' },
  ],
  COMPOUND_CONVERGENCE: [
    { intervention_id: 'cc-decompose', action_type: 'DECOMPOSE', operator_label: 'Decompose into contributing conditions', topology_mutation: 'Transitions from compound overlay to selected primitive', panel_mutation: 'Selected primitive condition evidence' },
    { intervention_id: 'cc-inspect-convergence', action_type: 'INSPECT', operator_label: 'Inspect convergence domain', topology_mutation: 'Convergence domain enlarged, connections emphasized', panel_mutation: 'Domain structural profile with convergence factor count' },
    { intervention_id: 'cc-qualify', action_type: 'QUALIFY', operator_label: 'Assess qualification impact of convergence', topology_mutation: 'Governance boundary indicators on convergence domain', panel_mutation: 'Qualification boundary assessment and SQO implications' },
  ],
}

// ─── Feature Extraction ────────────────────────────────────────────

function extractFeatures(signal, pressureZoneState, structuralEnrichment) {
  const features = []
  const sid = signal.signal_id
  const family = signal.signal_family || 'DPSIG'
  const severity = signal.severity || signal.activation_state || 'NOMINAL'
  const sevRank = SEVERITY_RANK[severity] ?? 5
  const value = signal.signal_value

  const dzm = pressureZoneState && pressureZoneState.domain_zone_mapping
    ? pressureZoneState.domain_zone_mapping
    : {}
  const zones = pressureZoneState && pressureZoneState.zones
    ? pressureZoneState.zones
    : []

  const signalZone = zones.find(z =>
    z.aggregated_conditions && z.aggregated_conditions.includes(sid)
  )

  if (signalZone && ['COMPOUND_ZONE', 'COUPLING_ZONE', 'PROPAGATION_ZONE', 'RESPONSIBILITY_ZONE'].includes(signalZone.zone_class)) {
    features.push('pressure_concentration')
  }

  if (family === 'ISIG' && sid === 'ISIG-001' && sevRank <= SEVERITY_RANK.ELEVATED) {
    features.push('dependency_amplification')
  }

  if (family === 'ISIG' && sid === 'ISIG-002' && sevRank <= SEVERITY_RANK.ELEVATED) {
    features.push('propagation_asymmetry')
  }

  if (sid === 'PSIG-001' || sid === 'PSIG-002') {
    features.push('coupling_exposure')
  }

  if (sid === 'PSIG-004' || (signalZone && signalZone.zone_class === 'COMPOUND_ZONE' && signalZone.condition_count >= 3)) {
    features.push('resilience_concentration')
  }

  if (family === 'DPSIG' && sevRank <= SEVERITY_RANK.ELEVATED) {
    features.push('structural_mass_asymmetry')
  }

  if (sid === 'PSIG-006') {
    if (value != null && value > 0) {
      features.push('domain_anchoring_gap')
    } else {
      features.push('domain_anchoring_complete')
    }
  }

  const spines = (structuralEnrichment && structuralEnrichment.available && structuralEnrichment.centrality)
    ? (structuralEnrichment.centrality.top_structural_spines || [])
    : []
  const hubPaths = spines.filter(s => s.structural_role === 'hub' || s.structural_role === 'authority').map(s => s.path)
  if (hubPaths.length > 0 && signal.concentration) {
    const primaryEntity = extractPrimaryEntity(signal)
    if (primaryEntity && hubPaths.some(hp => primaryEntity.includes(hp) || hp.includes(primaryEntity))) {
      features.push('coordination_load')
    }
  }

  return features
}

function extractPrimaryEntity(signal) {
  if (!signal.concentration) return null
  const match = signal.concentration.match(/Primary entity:\s*(.+)/)
  return match ? match[1].trim() : null
}

// ─── Domain Resolution ─────────────────────────────────────────────

function buildDomainResolver(registry) {
  const idSet = new Set((registry || []).map(d => d.domain_id))
  return function resolveToRegistryId(entityId) {
    if (!entityId) return null
    if (idSet.has(entityId)) return entityId
    const num = entityId.replace(/^DOM-/, '')
    if (idSet.has('DOMAIN-' + num)) return 'DOMAIN-' + num
    return null
  }
}

// ─── Primitive Rule Engines ────────────────────────────────────────

function ruleDeliveryPressureConcentration(taggedSignals, pressureZoneState, registry) {
  const resolve = buildDomainResolver(registry)
  const zones = (pressureZoneState && pressureZoneState.zones) || []
  const conditions = []

  for (const zone of zones) {
    const zoneSignals = taggedSignals.filter(ts =>
      ts.features.includes('pressure_concentration') &&
      zone.aggregated_conditions && zone.aggregated_conditions.includes(ts.signal.signal_id)
    )
    if (zoneSignals.length < 2 || zone.zone_class !== 'COMPOUND_ZONE') continue

    const anchorId = resolve(zone.anchor_id)
    const memberIds = (zone.member_entities || []).map(m => resolve(m.entity_id)).filter(Boolean)
    const emphasisIds = [...new Set([...memberIds, ...(anchorId ? [anchorId] : [])])]
    const domainIdSet = new Set((registry || []).map(d => d.domain_id))
    const blindSpots = (pressureZoneState.structural_blind_spot_entities || [])
      .map(e => resolve(e.entity_id)).filter(Boolean)
    const dimIds = Array.from(domainIdSet).filter(id => !emphasisIds.includes(id) && !blindSpots.includes(id))

    const vocab = CONDITION_VOCABULARY.DELIVERY_PRESSURE_CONCENTRATION
    const sev = maxSeverity(zoneSignals.map(ts => ts.signal.severity || ts.signal.activation_state))

    conditions.push({
      condition_id: 'dpc-' + zone.zone_id.toLowerCase(),
      condition_type: 'DELIVERY_PRESSURE_CONCENTRATION',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: vocab.consequence.replace('a single structural region', zone.anchor_name || zone.anchor_id),
      governance_boundary: 'GOVERNED',
      topology_effect: vocab.topology_effect,
      severity: sev,
      supporting_signal_ids: zoneSignals.map(ts => ts.signal.signal_id),
      shared_topology_targets: { domains: emphasisIds, clusters: [], files: [] },
      pressure_zone_ids: [zone.zone_id],
      evidence_mode: 'TOPOLOGY_DRIVEN',
      topology_overlay: {
        overlay_mode: 'PRESSURE_ZONE',
        emphasis_domains: emphasisIds,
        dim_domains: dimIds,
        advisory_zones: blindSpots,
        signal_overlays: zoneSignals.map(ts => ({
          signal_id: ts.signal.signal_id,
          signal_name: ts.signal.signal_name,
          severity: ts.signal.severity,
          type: 'pressure_condition',
        })),
        corridor_paths: [],
      },
      guided_interventions: CONDITION_INTERVENTIONS.DELIVERY_PRESSURE_CONCENTRATION.map(i => ({ ...i, condition_id: 'dpc-' + zone.zone_id.toLowerCase() })),
      orchestration_hooks: ['pressure_zone_review', 'deployment_gate_advisory'],
      contributing_features: ['pressure_concentration', 'resilience_concentration'],
      derivation_trace: zoneSignals.map(ts => ts.signal.signal_id).join(' + ') + ' → COMPOUND_ZONE ' + zone.zone_id + ' → DELIVERY_PRESSURE_CONCENTRATION',
    })
  }

  return conditions
}

function ruleDependencyChokePoint(taggedSignals, registry) {
  const signals = taggedSignals.filter(ts => ts.features.includes('dependency_amplification'))
  if (signals.length === 0) return []

  const resolve = buildDomainResolver(registry)
  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.DEPENDENCY_CHOKE_POINT

  return signals.map(ts => {
    const primaryEntity = extractPrimaryEntity(ts.signal)
    const empDomains = []
    if (ts.signal.signal_id === 'ISIG-001' && primaryEntity) {
      const parts = primaryEntity.split('/')
      const domGuess = parts[0]
      for (const d of (registry || [])) {
        if ((d.domain_name || '').toLowerCase().includes(domGuess.toLowerCase()) ||
            (d.business_label || '').toLowerCase().includes(domGuess.toLowerCase())) {
          empDomains.push(d.domain_id)
          break
        }
      }
    }

    const dimIds = Array.from(domainIdSet).filter(id => !empDomains.includes(id))

    return {
      condition_id: 'dck-' + ts.signal.signal_id.toLowerCase(),
      condition_type: 'DEPENDENCY_CHOKE_POINT',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: primaryEntity
        ? vocab.consequence.replace('A structural dependency hub', primaryEntity)
        : vocab.consequence,
      governance_boundary: 'STRUCTURAL_ONLY',
      topology_effect: vocab.topology_effect,
      severity: ts.signal.severity || 'HIGH',
      supporting_signal_ids: [ts.signal.signal_id],
      shared_topology_targets: { domains: empDomains, clusters: [], files: primaryEntity ? [primaryEntity] : [] },
      pressure_zone_ids: [],
      evidence_mode: 'SIGNAL_DRIVEN',
      topology_overlay: {
        overlay_mode: 'IMPORT_PRESSURE',
        emphasis_domains: empDomains,
        dim_domains: dimIds,
        advisory_zones: [],
        signal_overlays: [{ signal_id: ts.signal.signal_id, signal_name: ts.signal.signal_name, severity: ts.signal.severity, type: 'hub_pressure' }],
        corridor_paths: [],
      },
      guided_interventions: CONDITION_INTERVENTIONS.DEPENDENCY_CHOKE_POINT.map(i => ({ ...i, condition_id: 'dck-' + ts.signal.signal_id.toLowerCase() })),
      orchestration_hooks: ['dependency_hub_review'],
      contributing_features: ['dependency_amplification'],
      derivation_trace: ts.signal.signal_id + ' (value=' + (ts.signal.signal_value != null ? ts.signal.signal_value.toFixed(2) : '?') + ') → DEPENDENCY_CHOKE_POINT',
    }
  })
}

function rulePropagationAsymmetry(taggedSignals, registry) {
  const signals = taggedSignals.filter(ts => ts.features.includes('propagation_asymmetry'))
  if (signals.length === 0) return []

  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.PROPAGATION_ASYMMETRY

  return signals.map(ts => {
    const primaryEntity = extractPrimaryEntity(ts.signal)
    const empDomains = []
    if (primaryEntity) {
      const parts = primaryEntity.split('/')
      const domGuess = parts[0]
      for (const d of (registry || [])) {
        if ((d.domain_name || '').toLowerCase().includes(domGuess.toLowerCase()) ||
            (d.business_label || '').toLowerCase().includes(domGuess.toLowerCase())) {
          empDomains.push(d.domain_id)
          break
        }
      }
    }

    const dimIds = Array.from(domainIdSet).filter(id => !empDomains.includes(id))

    return {
      condition_id: 'pa-' + ts.signal.signal_id.toLowerCase(),
      condition_type: 'PROPAGATION_ASYMMETRY',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: primaryEntity
        ? vocab.consequence.replace('changes here', 'changes at ' + primaryEntity)
        : vocab.consequence,
      governance_boundary: 'STRUCTURAL_ONLY',
      topology_effect: vocab.topology_effect,
      severity: ts.signal.severity || 'HIGH',
      supporting_signal_ids: [ts.signal.signal_id],
      shared_topology_targets: { domains: empDomains, clusters: [], files: primaryEntity ? [primaryEntity] : [] },
      pressure_zone_ids: [],
      evidence_mode: 'SIGNAL_DRIVEN',
      topology_overlay: {
        overlay_mode: 'PROPAGATION_CORRIDOR',
        emphasis_domains: empDomains,
        dim_domains: dimIds,
        advisory_zones: [],
        signal_overlays: [{ signal_id: ts.signal.signal_id, signal_name: ts.signal.signal_name, severity: ts.signal.severity, type: 'fan_asymmetry' }],
        corridor_paths: [],
      },
      guided_interventions: CONDITION_INTERVENTIONS.PROPAGATION_ASYMMETRY.map(i => ({ ...i, condition_id: 'pa-' + ts.signal.signal_id.toLowerCase() })),
      orchestration_hooks: ['propagation_review'],
      contributing_features: ['propagation_asymmetry'],
      derivation_trace: ts.signal.signal_id + ' (value=' + (ts.signal.signal_value != null ? ts.signal.signal_value.toFixed(2) : '?') + ') → PROPAGATION_ASYMMETRY',
    }
  })
}

function ruleStructuralMassConcentration(taggedSignals, registry, dpsigData) {
  const signals = taggedSignals.filter(ts => ts.features.includes('structural_mass_asymmetry'))
  if (signals.length === 0) return []

  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.STRUCTURAL_MASS_CONCENTRATION

  const nb = dpsigData && dpsigData.normalization_basis ? dpsigData.normalization_basis : {}
  let clusterName = nb.max_cluster_name || null
  const clusterNodeCount = nb.max_cluster_node_count || 0
  const totalNodes = dpsigData && dpsigData.derivation_context ? dpsigData.derivation_context.total_structural_nodes : 0

  if (!clusterName && signals.length > 0) {
    for (const ts of signals) {
      if (ts.signal.concentration) {
        const m = ts.signal.concentration.match(/in\s+"?([^"(]+?)(?:\s*\(|"|\s*,)/)
        if (m) { clusterName = m[1].trim(); break }
        const m2 = ts.signal.concentration.match(/Concentrated in\s+(\S+)/)
        if (m2) { clusterName = m2[1].trim(); break }
      }
    }
  }
  if (!clusterName) clusterName = 'dominant cluster'

  const empDomains = []
  for (const d of (registry || [])) {
    if ((d.domain_name || '').toLowerCase().includes(clusterName.toLowerCase()) ||
        (d.business_label || '').toLowerCase().includes(clusterName.toLowerCase())) {
      empDomains.push(d.domain_id)
    }
  }

  const dimIds = Array.from(domainIdSet).filter(id => !empDomains.includes(id))
  const sev = maxSeverity(signals.map(ts => ts.signal.severity || ts.signal.activation_state))

  return [{
    condition_id: 'smc-cluster',
    condition_type: 'STRUCTURAL_MASS_CONCENTRATION',
    internal_condition_id: vocab.internal,
    technical_semantic_label: vocab.l2,
    operator_cognition_title: vocab.l3,
    operational_consequence: clusterName
      ? vocab.consequence.replace('a dominant region', 'the ' + clusterName + ' cluster (' + clusterNodeCount + ' of ' + totalNodes + ' nodes)')
      : vocab.consequence,
    governance_boundary: 'GOVERNED',
    topology_effect: vocab.topology_effect,
    severity: sev,
    supporting_signal_ids: signals.map(ts => ts.signal.signal_id),
    shared_topology_targets: { domains: empDomains, clusters: [nb.max_cluster_id || 'CLU-?'], files: [] },
    pressure_zone_ids: [],
    evidence_mode: 'TOPOLOGY_DRIVEN',
    topology_overlay: {
      overlay_mode: 'CLUSTER_PRESSURE',
      emphasis_domains: empDomains,
      dim_domains: dimIds,
      advisory_zones: [],
      signal_overlays: signals.map(ts => ({ signal_id: ts.signal.signal_id, signal_name: ts.signal.signal_name, severity: ts.signal.severity, type: 'cluster_pressure' })),
      corridor_paths: [],
    },
    guided_interventions: CONDITION_INTERVENTIONS.STRUCTURAL_MASS_CONCENTRATION.map(i => ({ ...i, condition_id: 'smc-cluster' })),
    orchestration_hooks: ['cluster_load_review'],
    contributing_features: ['structural_mass_asymmetry'],
    derivation_trace: signals.map(ts => ts.signal.signal_id).join(' + ') + ' → STRUCTURAL_MASS_CONCENTRATION on ' + (nb.max_cluster_id || '?'),
  }]
}

function ruleCrossDomainCouplingPressure(taggedSignals, registry, structuralEnrichment) {
  const signals = taggedSignals.filter(ts => ts.features.includes('coupling_exposure'))
  if (signals.length === 0) return []

  const resolve = buildDomainResolver(registry)
  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.CROSS_DOMAIN_COUPLING_PRESSURE

  const spines = (structuralEnrichment && structuralEnrichment.available && structuralEnrichment.centrality)
    ? (structuralEnrichment.centrality.top_structural_spines || [])
    : []
  const hubs = spines.filter(s => s.structural_role === 'hub' || s.structural_role === 'authority')
  const hasHub = hubs.length > 0

  if (!hasHub) return []

  const hubDomainIds = hubs.map(h => {
    const pathTail = h.path.split('/').slice(-2).join('/')
    const match = (registry || []).find(d =>
      (d.domain_name || '').includes(pathTail) || (d.business_label || '').includes(pathTail)
    )
    return match ? match.domain_id : null
  }).filter(Boolean)

  if (hubDomainIds.length === 0) {
    const primaryDomain = signals[0].signal.signal_id === 'PSIG-001' || signals[0].signal.signal_id === 'PSIG-002'
      ? resolve('DOM-04')
      : null
    if (primaryDomain) hubDomainIds.push(primaryDomain)
  }

  const dimIds = Array.from(domainIdSet).filter(id => !hubDomainIds.includes(id))
  const sev = maxSeverity(signals.map(ts => ts.signal.severity || ts.signal.activation_state))

  return [{
    condition_id: 'cdcp-coupling',
    condition_type: 'CROSS_DOMAIN_COUPLING_PRESSURE',
    internal_condition_id: vocab.internal,
    technical_semantic_label: vocab.l2,
    operator_cognition_title: vocab.l3,
    operational_consequence: vocab.consequence,
    governance_boundary: 'GOVERNED',
    topology_effect: vocab.topology_effect,
    severity: sev,
    supporting_signal_ids: signals.map(ts => ts.signal.signal_id),
    shared_topology_targets: { domains: hubDomainIds, clusters: [], files: [] },
    pressure_zone_ids: [],
    evidence_mode: 'MIXED',
    topology_overlay: {
      overlay_mode: 'COUPLING_CORRIDOR',
      emphasis_domains: hubDomainIds,
      dim_domains: dimIds,
      advisory_zones: [],
      signal_overlays: signals.map(ts => ({ signal_id: ts.signal.signal_id, signal_name: ts.signal.signal_name, severity: ts.signal.severity, type: 'coupling' })),
      corridor_paths: [],
    },
    guided_interventions: CONDITION_INTERVENTIONS.CROSS_DOMAIN_COUPLING_PRESSURE.map(i => ({ ...i, condition_id: 'cdcp-coupling' })),
    orchestration_hooks: ['coupling_review', 'deployment_gate_advisory'],
    contributing_features: ['coupling_exposure'],
    derivation_trace: signals.map(ts => ts.signal.signal_id).join(' + ') + ' → hub domains [' + hubDomainIds.join(', ') + '] → CROSS_DOMAIN_COUPLING_PRESSURE',
  }]
}

function ruleGovernanceCoverageStatus(taggedSignals, pressureZoneState, registry) {
  const resolve = buildDomainResolver(registry)
  const gapSignals = taggedSignals.filter(ts => ts.features.includes('domain_anchoring_gap'))
  const completeSignals = taggedSignals.filter(ts => ts.features.includes('domain_anchoring_complete'))

  if (gapSignals.length === 0 && completeSignals.length === 0) return []

  const blindSpots = (pressureZoneState && pressureZoneState.structural_blind_spot_entities || [])
    .map(e => resolve(e.entity_id)).filter(Boolean)

  if (gapSignals.length > 0) {
    const vocab = CONDITION_VOCABULARY.GOVERNANCE_COVERAGE_GAP
    const sig = gapSignals[0].signal
    return [{
      condition_id: 'gc-gap',
      condition_type: 'GOVERNANCE_COVERAGE_STATUS',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: vocab.consequence,
      governance_boundary: 'GOVERNED',
      topology_effect: vocab.topology_effect,
      severity: 'ELEVATED',
      supporting_signal_ids: [sig.signal_id],
      shared_topology_targets: { domains: [], clusters: [], files: [] },
      pressure_zone_ids: [],
      evidence_mode: 'TOPOLOGY_DRIVEN',
      topology_overlay: {
        overlay_mode: 'COVERAGE_GAP',
        emphasis_domains: [],
        dim_domains: [],
        advisory_zones: blindSpots,
        signal_overlays: [{ signal_id: sig.signal_id, signal_name: sig.signal_name, severity: sig.severity, type: 'coverage' }],
        corridor_paths: [],
      },
      guided_interventions: CONDITION_INTERVENTIONS.GOVERNANCE_COVERAGE_STATUS.map(i => ({ ...i, condition_id: 'gc-gap' })),
      orchestration_hooks: ['coverage_gap_review'],
      contributing_features: ['domain_anchoring_gap'],
      derivation_trace: sig.signal_id + ' (value=' + sig.signal_value + ') → GOVERNANCE_COVERAGE_GAP',
    }]
  }

  const vocab = CONDITION_VOCABULARY.GOVERNANCE_COVERAGE_COMPLETE
  const sig = completeSignals[0].signal
  return [{
    condition_id: 'gc-complete',
    condition_type: 'GOVERNANCE_COVERAGE_STATUS',
    internal_condition_id: vocab.internal,
    technical_semantic_label: vocab.l2,
    operator_cognition_title: vocab.l3,
    operational_consequence: blindSpots.length > 0
      ? vocab.consequence + ' ' + blindSpots.length + ' domains remain outside pressure zone candidacy.'
      : vocab.consequence,
    governance_boundary: 'GOVERNED',
    topology_effect: vocab.topology_effect,
    severity: 'NOMINAL',
    supporting_signal_ids: [sig.signal_id],
    shared_topology_targets: { domains: [], clusters: [], files: [] },
    pressure_zone_ids: [],
    evidence_mode: 'TOPOLOGY_DRIVEN',
    topology_overlay: {
      overlay_mode: 'COVERAGE_COMPLETE',
      emphasis_domains: [],
      dim_domains: [],
      advisory_zones: blindSpots,
      signal_overlays: [{ signal_id: sig.signal_id, signal_name: sig.signal_name, severity: 'NOMINAL', type: 'coverage' }],
      corridor_paths: [],
    },
    guided_interventions: CONDITION_INTERVENTIONS.GOVERNANCE_COVERAGE_STATUS.map(i => ({ ...i, condition_id: 'gc-complete' })),
    orchestration_hooks: [],
    contributing_features: ['domain_anchoring_complete'],
    derivation_trace: sig.signal_id + ' (value=0) → GOVERNANCE_COVERAGE_COMPLETE',
  }]
}

// ─── Composite Rule ────────────────────────────────────────────────

function ruleCompoundConvergence(primitiveConditions, registry) {
  const domainConditions = {}
  for (const cond of primitiveConditions) {
    if (cond.severity === 'NOMINAL') continue
    for (const domId of (cond.shared_topology_targets.domains || [])) {
      if (!domainConditions[domId]) domainConditions[domId] = []
      domainConditions[domId].push(cond)
    }
  }

  const composites = []
  for (const [domId, conds] of Object.entries(domainConditions)) {
    if (conds.length < 3) continue

    const domainIdSet = new Set((registry || []).map(d => d.domain_id))
    const empDomains = [domId]
    const dimIds = Array.from(domainIdSet).filter(id => id !== domId)
    const allSignalIds = [...new Set(conds.flatMap(c => c.supporting_signal_ids))]
    const allZoneIds = [...new Set(conds.flatMap(c => c.pressure_zone_ids))]
    const allFeatures = [...new Set(conds.flatMap(c => c.contributing_features))]
    const sev = conds.length >= 3 ? 'CRITICAL' : maxSeverity(conds.map(c => c.severity))

    const advisoryZones = [...new Set(conds.flatMap(c => c.topology_overlay.advisory_zones || []))]
    const allOverlays = conds.flatMap(c => c.topology_overlay.signal_overlays || [])
    const allCorridors = conds.flatMap(c => c.topology_overlay.corridor_paths || [])

    const domName = (registry || []).find(d => d.domain_id === domId)
    const domLabel = domName ? (domName.business_label || domName.domain_name || domId) : domId

    const vocab = CONDITION_VOCABULARY.COMPOUND_CONVERGENCE

    composites.push({
      condition_id: 'cc-' + domId.toLowerCase(),
      condition_type: 'COMPOUND_CONVERGENCE',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: conds.length + ' operational conditions converge on ' + domLabel + ': ' + conds.map(c => c.operator_cognition_title).join(', ') + '. ' + vocab.consequence,
      governance_boundary: conds.some(c => c.governance_boundary === 'STRUCTURAL_ONLY') ? 'ADVISORY_BOUND' : 'GOVERNED',
      topology_effect: vocab.topology_effect,
      severity: sev,
      supporting_signal_ids: allSignalIds,
      shared_topology_targets: { domains: empDomains, clusters: [...new Set(conds.flatMap(c => c.shared_topology_targets.clusters || []))], files: [...new Set(conds.flatMap(c => c.shared_topology_targets.files || []))] },
      pressure_zone_ids: allZoneIds,
      evidence_mode: 'MIXED',
      topology_overlay: {
        overlay_mode: 'COMPOUND_CONVERGENCE',
        emphasis_domains: empDomains,
        dim_domains: dimIds,
        advisory_zones: advisoryZones,
        signal_overlays: allOverlays,
        corridor_paths: allCorridors,
      },
      guided_interventions: CONDITION_INTERVENTIONS.COMPOUND_CONVERGENCE.map(i => ({ ...i, condition_id: 'cc-' + domId.toLowerCase() })),
      orchestration_hooks: ['convergence_review', 'deployment_gate_mandatory', 'qualification_impact_assessment'],
      contributing_features: allFeatures,
      contributing_condition_ids: conds.map(c => c.condition_id),
      derivation_trace: conds.map(c => c.condition_id).join(' + ') + ' → convergence on ' + domId + ' → COMPOUND_CONVERGENCE',
    })
  }

  return composites
}

// ─── Main Synthesis Pipeline ───────────────────────────────────────

function synthesize(fullReport) {
  if (!fullReport) return { conditions: [], active: [], suppressed: [], summary: null }

  const signals = fullReport.signal_interpretations || []
  const pressureZoneState = fullReport.pressure_zone_state || {}
  const structuralEnrichment = fullReport.structural_enrichment || {}
  const registry = fullReport.semantic_domain_registry || []

  const dpsigData = null

  const taggedSignals = signals.map(signal => ({
    signal,
    features: extractFeatures(signal, pressureZoneState, structuralEnrichment),
  }))

  const primitives = [
    ...ruleDeliveryPressureConcentration(taggedSignals, pressureZoneState, registry),
    ...ruleDependencyChokePoint(taggedSignals, registry),
    ...rulePropagationAsymmetry(taggedSignals, registry),
    ...ruleStructuralMassConcentration(taggedSignals, registry, dpsigData),
    ...ruleCrossDomainCouplingPressure(taggedSignals, registry, structuralEnrichment),
    ...ruleGovernanceCoverageStatus(taggedSignals, pressureZoneState, registry),
  ]

  const composites = ruleCompoundConvergence(primitives, registry)

  const allConditions = [...primitives, ...composites]

  const active = allConditions.filter(c => c.severity !== 'NOMINAL')
  const suppressed = allConditions.filter(c => c.severity === 'NOMINAL')

  const primaryCondition = composites.length > 0
    ? composites.reduce((best, c) => (SEVERITY_RANK[c.severity] ?? 5) < (SEVERITY_RANK[best.severity] ?? 5) ? c : best, composites[0])
    : active.length > 0
      ? active.reduce((best, c) => (SEVERITY_RANK[c.severity] ?? 5) < (SEVERITY_RANK[best.severity] ?? 5) ? c : best, active[0])
      : null

  return {
    conditions: allConditions,
    active,
    suppressed,
    primitives,
    composites,
    primary: primaryCondition,
    summary: {
      total_signals: signals.length,
      total_conditions: allConditions.length,
      active_count: active.length,
      suppressed_count: suppressed.length,
      composite_count: composites.length,
      primary_condition: primaryCondition ? primaryCondition.operator_cognition_title : null,
      primary_severity: primaryCondition ? primaryCondition.severity : null,
    },
  }
}

module.exports = { synthesize, extractFeatures, CONDITION_VOCABULARY, SEVERITY_RANK, CONDITION_INTERVENTIONS }

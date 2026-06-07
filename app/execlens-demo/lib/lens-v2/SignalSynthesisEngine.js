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
  EXECUTION_FRAGILITY: {
    internal: 'EXECUTION_FRAGILITY',
    l2: 'Structural Fragility Concentration',
    l3: 'Execution Fragility',
    consequence: 'Localized structural weakness amplifies operational disruption — high external coupling combined with low internal cohesion creates a fragility hotspot where changes propagate disproportionate risk.',
    topology_effect: 'Fragility hotspot emphasis with coupling/cohesion surface',
    governance: 'Structural confirmation required — evidence-bound',
  },
  EXECUTION_CONSTRICTION: {
    internal: 'EXECUTION_CONSTRICTION',
    l2: 'Structural Throughput Constriction',
    l3: 'Execution Constriction',
    consequence: 'Operational flow is forced through a narrow structural passage — this node sits on critical traversal paths between otherwise-independent regions, creating a throughput ceiling that cannot be raised by adding capacity.',
    topology_effect: 'Constriction point emphasis with bridge detection overlay',
    governance: 'Structural confirmation required — evidence-bound',
  },
  STRUCTURAL_BOUNDARY_DIVERGENCE: {
    internal: 'STRUCTURAL_BOUNDARY_DIVERGENCE',
    l2: 'Organizational-Structural Boundary Mismatch',
    l3: 'Structural Boundary Divergence',
    consequence: 'Declared organizational structure diverges from actual dependency structure — directory boundaries do not match import graph boundaries, creating governance gaps where ownership assumptions are structurally invalid.',
    topology_effect: 'Boundary divergence overlay with cross-boundary import corridors',
    governance: 'Structural confirmation required — evidence-bound',
  },
  COUPLING_INERTIA: {
    internal: 'COUPLING_INERTIA',
    l2: 'Bidirectional Coupling Cluster Resistance',
    l3: 'Coupling Inertia',
    consequence: 'Tightly-coupled module clusters resist independent evolution — bidirectional import relationships structurally fuse modules into a single change unit, decaying development velocity in proportion to cluster density.',
    topology_effect: 'Coupling cluster overlay with bidirectional edge emphasis',
    governance: 'Structural confirmation required — evidence-bound',
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
    { intervention_id: 'dpc-inspect-zone', action_type: 'INSPECT', operator_label: 'Show pressure zone members', topology_mutation: 'Zone members emphasized, non-members dimmed', panel_mutation: 'Zone member inventory with per-member evidence' },
    { intervention_id: 'dpc-trace-conditions', action_type: 'TRACE', operator_label: 'Explain convergence', topology_mutation: 'Contributing signal paths visualized', panel_mutation: 'Signal → feature → condition derivation chain' },
    { intervention_id: 'dpc-blast-radius', action_type: 'INSPECT', operator_label: 'Map blast radius', topology_mutation: 'Advisory zones (blind spots) emphasized', panel_mutation: 'Blind spot inventory and zone proximity' },
  ],
  DEPENDENCY_CHOKE_POINT: [
    { intervention_id: 'dck-trace-hub', action_type: 'TRACE', operator_label: 'Show dependency hub connections', topology_mutation: 'Import corridors from hub file visualized', panel_mutation: 'Top-N dependents of hub file' },
    { intervention_id: 'dck-inspect-domain', action_type: 'INSPECT', operator_label: 'Check advisory boundary', topology_mutation: 'Domain containing hub file emphasized', panel_mutation: 'Domain structural profile' },
  ],
  PROPAGATION_ASYMMETRY: [
    { intervention_id: 'pa-trace-fanout', action_type: 'TRACE', operator_label: 'Trace downstream impact', topology_mutation: 'Fan-out corridors visualized', panel_mutation: 'Outbound dependency inventory' },
    { intervention_id: 'pa-inspect-domain', action_type: 'INSPECT', operator_label: 'Show propagation domain', topology_mutation: 'Domain containing fan-out file emphasized', panel_mutation: 'Domain structural profile' },
  ],
  STRUCTURAL_MASS_CONCENTRATION: [
    { intervention_id: 'smc-inspect-cluster', action_type: 'INSPECT', operator_label: 'Show cluster composition', topology_mutation: 'Cluster boundary emphasized, member domains highlighted', panel_mutation: 'Cluster member inventory' },
    { intervention_id: 'smc-compare-clusters', action_type: 'COMPARE', operator_label: 'Compare cluster load distribution', topology_mutation: 'All clusters sized by node count', panel_mutation: 'Cluster distribution table' },
  ],
  CROSS_DOMAIN_COUPLING_PRESSURE: [
    { intervention_id: 'cdcp-trace-coupling', action_type: 'TRACE', operator_label: 'Show coupling corridors', topology_mutation: 'Coupling paths from hub domain emphasized', panel_mutation: 'Coupling path inventory with dependent domains' },
    { intervention_id: 'cdcp-inspect-hub', action_type: 'INSPECT', operator_label: 'Show coordination hub', topology_mutation: 'Hub domain enlarged, connections visible', panel_mutation: 'Hub domain structural profile and dependency count' },
  ],
  GOVERNANCE_COVERAGE_STATUS: [
    { intervention_id: 'gc-inspect-gaps', action_type: 'INSPECT', operator_label: 'Review coverage status', topology_mutation: 'Unanchored domains or blind spots emphasized', panel_mutation: 'Coverage status inventory' },
    { intervention_id: 'gc-qualify', action_type: 'QUALIFY', operator_label: 'Check qualification impact', topology_mutation: 'Governance boundary indicators on affected regions', panel_mutation: 'Qualification boundary and SQO implications' },
  ],
  COMPOUND_CONVERGENCE: [
    { intervention_id: 'cc-decompose', action_type: 'DECOMPOSE', operator_label: 'Break down contributing conditions', topology_mutation: 'Transitions from compound overlay to selected primitive', panel_mutation: 'Selected primitive condition evidence' },
    { intervention_id: 'cc-inspect-convergence', action_type: 'INSPECT', operator_label: 'Show convergence domain', topology_mutation: 'Convergence domain enlarged, connections emphasized', panel_mutation: 'Domain structural profile with convergence factor count' },
    { intervention_id: 'cc-qualify', action_type: 'QUALIFY', operator_label: 'Check qualification impact', topology_mutation: 'Governance boundary indicators on convergence domain', panel_mutation: 'Qualification boundary assessment and SQO implications' },
  ],
  EXECUTION_FRAGILITY: [
    { intervention_id: 'ef-inspect-hotspot', action_type: 'INSPECT', operator_label: 'Show fragility hotspot files', topology_mutation: 'Fragility hotspot files emphasized, absorptive files dimmed', panel_mutation: 'Fragility hotspot inventory with per-file coupling/cohesion metrics' },
    { intervention_id: 'ef-trace-coupling', action_type: 'TRACE', operator_label: 'Trace coupling exposure', topology_mutation: 'Import corridors from fragile files visualized', panel_mutation: 'Inbound/outbound dependency inventory for fragile files' },
    { intervention_id: 'ef-compare-resilience', action_type: 'COMPARE', operator_label: 'Compare fragile vs absorptive regions', topology_mutation: 'Bidirectional resilience overlay — fragile highlighted, absorptive dimmed', panel_mutation: 'Resilience distribution table by module' },
  ],
  EXECUTION_CONSTRICTION: [
    { intervention_id: 'ec-inspect-bottleneck', action_type: 'INSPECT', operator_label: 'Show constriction points', topology_mutation: 'Constriction points emphasized, bridge nodes highlighted', panel_mutation: 'Constriction inventory with through-flow and bridge status per file' },
    { intervention_id: 'ec-trace-paths', action_type: 'TRACE', operator_label: 'Trace traversal paths', topology_mutation: 'Critical path corridors from constriction point visualized', panel_mutation: 'Inbound/outbound path inventory showing regions connected through this node' },
    { intervention_id: 'ec-compare-alternatives', action_type: 'COMPARE', operator_label: 'Assess alternative routes', topology_mutation: 'Bridge vs non-bridge constrictions compared', panel_mutation: 'Path redundancy assessment — bridge nodes vs high-flow nodes' },
  ],
  STRUCTURAL_BOUNDARY_DIVERGENCE: [
    { intervention_id: 'sbd-inspect-divergence', action_type: 'INSPECT', operator_label: 'Show divergent modules', topology_mutation: 'Divergent modules emphasized, aligned modules dimmed', panel_mutation: 'Divergence inventory with cross-boundary ratio per module' },
    { intervention_id: 'sbd-trace-boundaries', action_type: 'TRACE', operator_label: 'Trace cross-boundary imports', topology_mutation: 'Cross-boundary import corridors visualized', panel_mutation: 'Import inventory showing declared vs actual dependency paths' },
    { intervention_id: 'sbd-compare-alignment', action_type: 'COMPARE', operator_label: 'Compare declared vs actual boundaries', topology_mutation: 'Aligned vs divergent modules contrasted', panel_mutation: 'Boundary alignment assessment by module' },
  ],
  COUPLING_INERTIA: [
    { intervention_id: 'ci-inspect-clusters', action_type: 'INSPECT', operator_label: 'Show coupling clusters', topology_mutation: 'Coupled module clusters emphasized, independent modules dimmed', panel_mutation: 'Cluster inventory with per-cluster density and inertia score' },
    { intervention_id: 'ci-trace-coupling', action_type: 'TRACE', operator_label: 'Trace bidirectional dependencies', topology_mutation: 'Bidirectional import corridors within clusters visualized', panel_mutation: 'Bidirectional pair inventory with edge counts per direction' },
    { intervention_id: 'ci-compare-independence', action_type: 'COMPARE', operator_label: 'Compare coupled vs independent regions', topology_mutation: 'Coupled clusters contrasted with independent modules', panel_mutation: 'Independence assessment — coupled vs decoupled module distribution' },
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
  const domDomIndex = new Map()
  for (const d of (registry || [])) {
    if (d.dominant_dom_id) domDomIndex.set(d.dominant_dom_id, d.domain_id)
  }
  return function resolveToRegistryId(entityId) {
    if (!entityId) return null
    if (idSet.has(entityId)) return entityId
    if (/^DOM-\d+$/.test(entityId) && domDomIndex.has(entityId)) return domDomIndex.get(entityId)
    return null
  }
}

function resolveDomainDisplay(domainId, registry) {
  if (!domainId || !registry) return { id: domainId || 'unknown', display_name: domainId || 'unknown', structural_role: null }
  // First: try exact match on domain_id
  let entry = registry.find(d => d.domain_id === domainId)
  // Second: if input is DOM-XX, find the semantic domain whose dominant_dom_id matches
  if (!entry && /^DOM-\d+$/.test(domainId)) {
    entry = registry.find(d => d.dominant_dom_id === domainId)
  }
  // Third: fallback to DOMAIN-XX numeric match (only for DOMAIN-prefixed input)
  if (!entry && /^DOMAIN-\d+$/.test(domainId)) {
    const num = domainId.replace(/^DOMAIN-/, '')
    entry = registry.find(d => d.domain_id === 'DOM-' + num)
  }
  const resolvedId = entry ? entry.domain_id : domainId
  return {
    id: resolvedId,
    display_name: entry ? (entry.business_label || entry.domain_name || resolvedId) : domainId,
    structural_role: null,
  }
}

function buildDomainTargets(domainIds, registry, conditionType) {
  const roleMap = {
    DELIVERY_PRESSURE_CONCENTRATION: 'convergence target',
    DEPENDENCY_CHOKE_POINT: 'dependency hub',
    PROPAGATION_ASYMMETRY: 'propagation source',
    STRUCTURAL_MASS_CONCENTRATION: 'structural gravity center',
    CROSS_DOMAIN_COUPLING_PRESSURE: 'coupling hub',
    GOVERNANCE_COVERAGE_GAP: 'advisory blind spot',
    GOVERNANCE_COVERAGE_COMPLETE: 'anchored',
    COMPOUND_CONVERGENCE: 'convergence target',
    EXECUTION_FRAGILITY: 'fragility hotspot',
    EXECUTION_CONSTRICTION: 'constriction point',
    STRUCTURAL_BOUNDARY_DIVERGENCE: 'boundary divergence',
    COUPLING_INERTIA: 'coupling cluster',
  }
  return (domainIds || []).map(id => {
    const resolved = resolveDomainDisplay(id, registry)
    resolved.condition_role = roleMap[conditionType] || 'target'
    return resolved
  })
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

function resolveFileToRegistryDomain(filePath, registry, pressureZoneState) {
  if (!filePath) return null
  const parts = filePath.split('/')
  const topDir = parts[0]
  for (const d of (registry || [])) {
    if ((d.domain_name || '').toLowerCase().includes(topDir.toLowerCase()) ||
        (d.business_label || '').toLowerCase().includes(topDir.toLowerCase())) {
      return d.domain_id
    }
  }
  const zones = (pressureZoneState && pressureZoneState.zones) || []
  for (const z of zones) {
    if (z.anchor_name && z.anchor_name.includes(topDir)) {
      const resolve = buildDomainResolver(registry)
      return resolve(z.anchor_id)
    }
  }
  return null
}

const STRUCTURAL_ROLE_LABELS = {
  hub: 'Coordination Hub',
  authority: 'Authority Spine',
  bridge: 'Integration Bridge',
  connector: 'Integration Connector',
  spine: 'Runtime Spine',
  foundation: 'Foundation Surface',
  VALIDATION_SUPPORT: 'Structural Foundation',
  INTERFACE_BOUNDARY: 'Interface Boundary',
  RUNTIME_SPINE: 'Runtime Spine',
  UTILITY_HUB: 'Utility Hub',
  RE_EXPORT_HUB: 'Re-Export Surface',
  ENTRYPOINT: 'Entrypoint',
  ISOLATED_LEAF: 'Isolated Leaf',
}

function translateCentralityNode(node) {
  if (!node || !node.path) return null
  const path = node.path
  const fileName = path.split('/').pop()
  const shortPath = path.split('/').slice(-2).join('/')
  const inDeg = node.in_degree || node.import_in_degree || 0
  const outDeg = node.out_degree || node.import_out_degree || 0
  const role = node.structural_role || 'unknown'
  const roleLabel = STRUCTURAL_ROLE_LABELS[role] || role

  let operationalName = shortPath
  let operationalRole = 'structural node'

  const lower = path.toLowerCase()
  if (lower.includes('/dto/') || lower.includes('/dto.')) {
    operationalName = 'Data Contract Surface'
    operationalRole = inDeg > 50 ? 'schema chokepoint — all consumers share this contract' : 'shared data contract'
  } else if (lower.includes('/hooks/') && lower.endsWith('index.tsx')) {
    operationalName = 'Frontend Hook Spine'
    operationalRole = inDeg > 30 ? 'state management chokepoint — frontend behavior flows through here' : 'shared hook surface'
  } else if (lower.includes('/api/client')) {
    operationalName = 'API Client Interface'
    operationalRole = 'external communication boundary — all outbound requests route here'
  } else if (lower.includes('/guards/') && lower.includes('roles')) {
    operationalName = 'Authorization Guard'
    operationalRole = 'access enforcement point — imported by all protected routes'
  } else if (lower.includes('/guards/') && lower.includes('jwt')) {
    operationalName = 'Authentication Guard'
    operationalRole = 'identity verification point — imported by all authenticated routes'
  } else if (lower.includes('/cache/') && lower.endsWith('index.ts')) {
    operationalName = 'Cache Infrastructure'
    operationalRole = 'shared caching surface — cross-cutting dependency'
  } else if (lower.includes('/socket/') && lower.endsWith('index.tsx')) {
    operationalName = 'WebSocket Interface'
    operationalRole = 'real-time communication spine — runtime event propagation'
  } else if (lower.includes('/utils/') && lower.endsWith('index.ts')) {
    operationalName = 'Utility Foundation'
    operationalRole = 'shared utility surface — broad structural dependency'
  } else if (lower.includes('/layout/') || lower.includes('pageheader')) {
    operationalName = 'Layout Shell'
    operationalRole = 'presentation framework — imported by all page-level components'
  } else if (lower.includes('/ui/') && lower.includes('badge')) {
    operationalName = 'UI Primitive'
    operationalRole = 'shared presentation atom'
  } else if (lower.endsWith('index.ts') || lower.endsWith('index.tsx') || lower.endsWith('index.js')) {
    const parent = path.split('/').slice(-2, -1)[0] || 'module'
    operationalName = `${parent.charAt(0).toUpperCase() + parent.slice(1)} Index`
    operationalRole = `re-export surface for ${parent}`
  }

  return {
    path,
    file_name: fileName,
    short_path: shortPath,
    operational_name: operationalName,
    operational_role: operationalRole,
    structural_role: role,
    structural_role_label: roleLabel,
    in_degree: inDeg,
    out_degree: outDeg,
    centrality_rank: node.centrality_rank,
    consumer_label: inDeg > 0 ? `${inDeg} consumer${inDeg !== 1 ? 's' : ''}` : 'no consumers',
  }
}

function ruleDependencyChokePoint(taggedSignals, registry, pressureZoneState, topologyEdges) {
  const signals = taggedSignals.filter(ts => ts.features.includes('dependency_amplification'))
  if (signals.length === 0) return []

  const resolve = buildDomainResolver(registry)
  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.DEPENDENCY_CHOKE_POINT
  const edges = topologyEdges || []

  return signals.map(ts => {
    const primaryEntity = extractPrimaryEntity(ts.signal)
    const empDomains = []
    if (primaryEntity) {
      const domId = resolveFileToRegistryDomain(primaryEntity, registry, pressureZoneState)
      if (domId) empDomains.push(domId)
    }

    const hubDomainId = empDomains[0] || null
    const corridorPaths = []
    const corridorDomains = new Set(empDomains)

    if (hubDomainId) {
      const inbound = edges.filter(e => e.target_domain === hubDomainId && e.source_domain !== hubDomainId)
      const outbound = edges.filter(e => e.source_domain === hubDomainId && e.target_domain !== hubDomainId)

      for (const e of inbound) {
        corridorPaths.push({
          from: e.source_domain,
          to: hubDomainId,
          type: 'import_consumer',
          relationship: e.relationship_type,
          evidence: 'semantic_topology_edge',
        })
        corridorDomains.add(e.source_domain)
      }
      for (const e of outbound) {
        corridorPaths.push({
          from: hubDomainId,
          to: e.target_domain,
          type: 'import_hub_outbound',
          relationship: e.relationship_type,
          evidence: 'semantic_topology_edge',
        })
        corridorDomains.add(e.target_domain)
      }
    }

    const dimIds = Array.from(domainIdSet).filter(id => !corridorDomains.has(id))

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
        emphasis_domains: Array.from(corridorDomains),
        dim_domains: dimIds,
        advisory_zones: [],
        signal_overlays: [{ signal_id: ts.signal.signal_id, signal_name: ts.signal.signal_name, severity: ts.signal.severity, type: 'hub_pressure' }],
        corridor_paths: corridorPaths,
        corridor_evidence: corridorPaths.length > 0 ? 'EVIDENCE_DERIVED' : 'NO_TOPOLOGY_EDGES',
      },
      guided_interventions: CONDITION_INTERVENTIONS.DEPENDENCY_CHOKE_POINT.map(i => ({ ...i, condition_id: 'dck-' + ts.signal.signal_id.toLowerCase() })),
      orchestration_hooks: ['dependency_hub_review'],
      contributing_features: ['dependency_amplification'],
      derivation_trace: ts.signal.signal_id + ' (value=' + (ts.signal.signal_value != null ? ts.signal.signal_value.toFixed(2) : '?') + ') → DEPENDENCY_CHOKE_POINT' + (corridorPaths.length > 0 ? ' → ' + corridorPaths.length + ' evidence-derived corridors' : ''),
    }
  })
}

function rulePropagationAsymmetry(taggedSignals, registry, pressureZoneState, topologyEdges, structuralEnrichment) {
  const signals = taggedSignals.filter(ts => ts.features.includes('propagation_asymmetry'))
  if (signals.length === 0) return []

  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.PROPAGATION_ASYMMETRY
  const edges = topologyEdges || []

  return signals.map(ts => {
    const primaryEntity = extractPrimaryEntity(ts.signal)
    const empDomains = []
    let sourceDomainId = null
    if (primaryEntity) {
      sourceDomainId = resolveFileToRegistryDomain(primaryEntity, registry, pressureZoneState)
      if (sourceDomainId) empDomains.push(sourceDomainId)
    }

    const corridorPaths = []
    const corridorDomains = new Set(empDomains)

    if (sourceDomainId) {
      const outbound = edges.filter(e => e.source_domain === sourceDomainId && e.target_domain !== sourceDomainId)
      for (const e of outbound) {
        corridorPaths.push({
          from: sourceDomainId,
          to: e.target_domain,
          type: 'propagation_outbound',
          relationship: e.relationship_type,
          evidence: 'semantic_topology_edge',
        })
        corridorDomains.add(e.target_domain)
      }
    }

    const fanOutRatio = ts.signal.signal_value != null ? ts.signal.signal_value : 0
    const cent = structuralEnrichment && structuralEnrichment.centrality
    const spines = (cent && cent.top_structural_spines) || []
    let entityCentrality = null
    if (primaryEntity) {
      entityCentrality = spines.find(n => n.path === primaryEntity)
    }
    const importOutDegree = entityCentrality ? (entityCentrality.import_out_degree || entityCentrality.out_degree || 0) : 0
    const importInDegree = entityCentrality ? (entityCentrality.import_in_degree || entityCentrality.in_degree || 0) : 0
    const structuralRole = entityCentrality ? entityCentrality.structural_role : null

    if (corridorPaths.length === 0 && (fanOutRatio > 0 || importOutDegree > 0)) {
      corridorPaths.push({
        from: sourceDomainId,
        to: null,
        type: 'propagation_fanout',
        fan_out_ratio: fanOutRatio,
        import_out_degree: importOutDegree,
        import_in_degree: importInDegree,
        evidence: entityCentrality ? 'structural_centrality' : 'signal_metric',
      })
    }

    const dimIds = Array.from(domainIdSet).filter(id => !corridorDomains.has(id))

    const sourceDomainEntry = sourceDomainId && registry ? registry.find(d => d.domain_id === sourceDomainId) : null
    const sourceDomainLabel = sourceDomainEntry ? (sourceDomainEntry.business_label || sourceDomainEntry.domain_name) : null

    const effectiveOutDegree = importOutDegree > 0 ? importOutDegree : (fanOutRatio > 1 ? Math.round(fanOutRatio) : 0)

    const consequenceText = sourceDomainLabel && (importOutDegree > 0 || fanOutRatio > 1)
      ? 'Changes originating from ' + sourceDomainLabel + ' propagate across ' + (effectiveOutDegree > 0 ? effectiveOutDegree + ' downstream entities' : 'downstream entities') + ' — fan-out ratio ' + fanOutRatio.toFixed(1) + ':1.'
      : primaryEntity
        ? vocab.consequence.replace('changes here', 'changes at ' + primaryEntity)
        : vocab.consequence

    const hasTopologyEdges = corridorPaths.some(p => p.evidence === 'semantic_topology_edge')

    return {
      condition_id: 'pa-' + ts.signal.signal_id.toLowerCase(),
      condition_type: 'PROPAGATION_ASYMMETRY',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: consequenceText,
      governance_boundary: 'STRUCTURAL_ONLY',
      topology_effect: vocab.topology_effect,
      severity: ts.signal.severity || 'HIGH',
      supporting_signal_ids: [ts.signal.signal_id],
      shared_topology_targets: { domains: empDomains, clusters: [], files: primaryEntity ? [primaryEntity] : [] },
      pressure_zone_ids: [],
      evidence_mode: 'SIGNAL_DRIVEN',
      topology_overlay: {
        overlay_mode: 'PROPAGATION_CORRIDOR',
        emphasis_domains: Array.from(corridorDomains),
        dim_domains: dimIds,
        advisory_zones: [],
        signal_overlays: [{ signal_id: ts.signal.signal_id, signal_name: ts.signal.signal_name, severity: ts.signal.severity, type: 'fan_asymmetry' }],
        corridor_paths: corridorPaths,
        corridor_evidence: hasTopologyEdges ? 'EVIDENCE_DERIVED' : corridorPaths.length > 0 ? 'STRUCTURAL_CENTRALITY_DERIVED' : 'NO_EVIDENCE',
        propagation_metrics: {
          fan_out_ratio: fanOutRatio,
          import_out_degree: effectiveOutDegree,
          import_in_degree: importInDegree,
          source_entity: primaryEntity,
          source_role: structuralRole,
          source_domain: sourceDomainLabel,
        },
      },
      guided_interventions: CONDITION_INTERVENTIONS.PROPAGATION_ASYMMETRY.map(i => ({ ...i, condition_id: 'pa-' + ts.signal.signal_id.toLowerCase() })),
      orchestration_hooks: ['propagation_review'],
      contributing_features: ['propagation_asymmetry'],
      derivation_trace: ts.signal.signal_id + ' (value=' + (fanOutRatio > 0 ? fanOutRatio.toFixed(2) : '?') + ') → PROPAGATION_ASYMMETRY' + (corridorPaths.length > 0 ? ' → ' + corridorPaths.length + ' ' + (hasTopologyEdges ? 'evidence-derived' : 'centrality-derived') + ' corridor' + (corridorPaths.length !== 1 ? 's' : '') : ''),
    }
  })
}

function ruleStructuralMassConcentration(taggedSignals, registry, dpsigData, pressureZoneState) {
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

  if (empDomains.length === 0 && clusterName) {
    const resolve = buildDomainResolver(registry)
    const zones = (pressureZoneState && pressureZoneState.zones) || []
    for (const z of zones) {
      if (z.anchor_name && z.anchor_name.includes(clusterName)) {
        const domId = resolve(z.anchor_id)
        if (domId) { empDomains.push(domId); break }
      }
    }
    if (empDomains.length === 0) {
      const fallback = resolve('DOM-04')
      if (fallback) empDomains.push(fallback)
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

  const hubDomainIds = hubs.map(h => {
    const pathTail = h.path.split('/').slice(-2).join('/')
    const match = (registry || []).find(d =>
      (d.domain_name || '').includes(pathTail) || (d.business_label || '').includes(pathTail)
    )
    return match ? match.domain_id : null
  }).filter(Boolean)

  if (hubDomainIds.length === 0) {
    for (const ts of signals) {
      if (ts.signal.concentration) {
        const entity = extractPrimaryEntity(ts.signal)
        if (entity) {
          const parts = entity.split('/')
          const domGuess = parts[0]
          for (const d of (registry || [])) {
            if ((d.domain_name || '').toLowerCase().includes(domGuess.toLowerCase()) ||
                (d.business_label || '').toLowerCase().includes(domGuess.toLowerCase())) {
              hubDomainIds.push(d.domain_id)
              break
            }
          }
        }
      }
    }
  }

  if (hubDomainIds.length === 0) {
    const fallback = resolve('DOM-04')
    if (fallback) hubDomainIds.push(fallback)
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

function ruleExecutionFragility(taggedSignals, registry, structuralEnrichment, pressureZoneState) {
  const fs = structuralEnrichment && structuralEnrichment.fragility_surface
  if (!fs || !fs.fragility_hotspots || fs.fragility_hotspots.length === 0) return []

  const resolve = buildDomainResolver(registry)
  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.EXECUTION_FRAGILITY

  const domainHotspots = {}
  for (const h of fs.fragility_hotspots) {
    const domId = resolveFileToRegistryDomain(h.path, registry, pressureZoneState)
    const resolvedId = domId ? resolve(domId) : null
    if (!resolvedId) continue
    if (!domainHotspots[resolvedId]) domainHotspots[resolvedId] = []
    domainHotspots[resolvedId].push(h)
  }

  if (Object.keys(domainHotspots).length === 0) return []

  const allScores = fs.fragility_hotspots.map(h => h.fragility_score).sort((a, b) => a - b)
  const p90 = allScores[Math.floor(allScores.length * 0.9)] || 0
  const medianScore = allScores[Math.floor(allScores.length / 2)] || 0

  const conditions = []
  for (const [domId, hotspots] of Object.entries(domainHotspots)) {
    const maxFrag = Math.max(...hotspots.map(h => h.fragility_score))
    const hasHubFragility = hotspots.some(h => h.role_context === 'fragile_hub')
    const severity = maxFrag >= p90 ? 'HIGH'
      : maxFrag >= medianScore * 3 ? 'ELEVATED'
      : 'MODERATE'
    const emphasisIds = [domId]
    const dimIds = Array.from(domainIdSet).filter(id => !emphasisIds.includes(id))

    conditions.push({
      condition_id: 'ef-' + domId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      condition_type: 'EXECUTION_FRAGILITY',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: vocab.consequence,
      governance_boundary: 'STRUCTURAL_ONLY',
      topology_effect: vocab.topology_effect,
      severity,
      supporting_signal_ids: [],
      shared_topology_targets: { domains: emphasisIds, clusters: [], files: hotspots.map(h => h.path) },
      pressure_zone_ids: [],
      evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED',
      _has_hub_fragility: hasHubFragility,
      topology_overlay: {
        overlay_mode: 'FRAGILITY_HOTSPOT',
        emphasis_domains: emphasisIds,
        dim_domains: dimIds,
        advisory_zones: [],
        signal_overlays: hotspots.map(h => ({
          signal_id: 'fragility-' + h.path.replace(/[/\\]/g, '-'),
          signal_name: 'Fragility: ' + h.path.split('/').pop(),
          severity,
          type: 'fragility_hotspot',
        })),
        corridor_paths: [],
      },
      guided_interventions: CONDITION_INTERVENTIONS.EXECUTION_FRAGILITY.map(i => ({
        ...i,
        condition_id: 'ef-' + domId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      })),
      orchestration_hooks: ['fragility_review'],
      contributing_features: ['execution_fragility'],
      derivation_trace: hotspots.map(h => h.path).join(' + ') +
        ' → fragility_surface [' + fs.cohesion_source + '] → EXECUTION_FRAGILITY on ' + domId,
      fragility_evidence: {
        hotspot_count: hotspots.length,
        max_fragility: maxFrag,
        has_hub_fragility: hasHubFragility,
        cohesion_source: fs.cohesion_source,
        hotspot_files: hotspots.slice(0, 5).map(h => ({
          path: h.path,
          fragility: h.fragility_score,
          coupling: h.coupling,
          cohesion: h.cohesion,
          structural_role: h.structural_role,
          role_context: h.role_context,
        })),
      },
    })
  }

  return conditions
}

function ruleExecutionConstriction(taggedSignals, registry, structuralEnrichment, pressureZoneState) {
  const cs = structuralEnrichment && structuralEnrichment.constriction_surface
  if (!cs || !cs.constriction_hotspots || cs.constriction_hotspots.length === 0) return []

  const resolve = buildDomainResolver(registry)
  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.EXECUTION_CONSTRICTION

  const domainConstrictions = {}
  for (const h of cs.constriction_hotspots) {
    const domId = resolveFileToRegistryDomain(h.path, registry, pressureZoneState)
    const resolvedId = domId ? resolve(domId) : null
    if (!resolvedId) continue
    if (!domainConstrictions[resolvedId]) domainConstrictions[resolvedId] = []
    domainConstrictions[resolvedId].push(h)
  }

  if (Object.keys(domainConstrictions).length === 0) return []

  const allScores = cs.constriction_hotspots.map(h => h.constriction_score).sort((a, b) => a - b)
  const p90 = allScores[Math.floor(allScores.length * 0.9)] || 0
  const medianScore = allScores[Math.floor(allScores.length / 2)] || 0

  const conditions = []
  for (const [domId, hotspots] of Object.entries(domainConstrictions)) {
    const maxConstriction = Math.max(...hotspots.map(h => h.constriction_score))
    const hasBridge = hotspots.some(h => h.is_bridge)
    const severity = maxConstriction >= p90 ? 'HIGH'
      : maxConstriction >= medianScore * 3 ? 'ELEVATED'
      : 'MODERATE'
    const emphasisIds = [domId]
    const dimIds = Array.from(domainIdSet).filter(id => !emphasisIds.includes(id))

    conditions.push({
      condition_id: 'ec-' + domId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      condition_type: 'EXECUTION_CONSTRICTION',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: vocab.consequence,
      governance_boundary: 'STRUCTURAL_ONLY',
      topology_effect: vocab.topology_effect,
      severity,
      supporting_signal_ids: [],
      shared_topology_targets: { domains: emphasisIds, clusters: [], files: hotspots.map(h => h.path) },
      pressure_zone_ids: [],
      evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED',
      _has_bridge_constriction: hasBridge,
      topology_overlay: {
        overlay_mode: 'CONSTRICTION_POINT',
        emphasis_domains: emphasisIds,
        dim_domains: dimIds,
        advisory_zones: [],
        signal_overlays: hotspots.map(h => ({
          signal_id: 'constriction-' + h.path.replace(/[/\\]/g, '-'),
          signal_name: (h.is_bridge ? 'Bridge: ' : 'Constriction: ') + h.path.split('/').pop(),
          severity,
          type: h.is_bridge ? 'bridge_constriction' : 'flow_constriction',
        })),
        corridor_paths: [],
      },
      guided_interventions: CONDITION_INTERVENTIONS.EXECUTION_CONSTRICTION.map(i => ({
        ...i,
        condition_id: 'ec-' + domId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      })),
      orchestration_hooks: ['constriction_review'],
      contributing_features: ['execution_constriction'],
      derivation_trace: hotspots.map(h => h.path).join(' + ') +
        ' → constriction_surface [' + cs.constriction_source + '] → EXECUTION_CONSTRICTION on ' + domId,
      constriction_evidence: {
        hotspot_count: hotspots.length,
        max_constriction: maxConstriction,
        has_bridge: hasBridge,
        bridge_count: hotspots.filter(h => h.is_bridge).length,
        constriction_source: cs.constriction_source,
        hotspot_files: hotspots.slice(0, 5).map(h => ({
          path: h.path,
          constriction: h.constriction_score,
          through_flow: h.through_flow,
          in_degree: h.in_degree,
          out_degree: h.out_degree,
          is_bridge: h.is_bridge,
          structural_role: h.structural_role,
        })),
      },
    })
  }

  return conditions
}

function ruleStructuralBoundaryDivergence(taggedSignals, registry, structuralEnrichment, pressureZoneState) {
  const bd = structuralEnrichment && structuralEnrichment.boundary_divergence
  if (!bd || !bd.divergent_modules || bd.divergent_modules.length === 0) return []

  const resolve = buildDomainResolver(registry)
  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.STRUCTURAL_BOUNDARY_DIVERGENCE

  const domainDivergences = {}
  for (const m of bd.divergent_modules) {
    const domId = resolveFileToRegistryDomain(m.module_prefix, registry, pressureZoneState)
    const resolvedId = domId ? resolve(domId) : null
    if (!resolvedId) continue
    if (!domainDivergences[resolvedId]) domainDivergences[resolvedId] = []
    domainDivergences[resolvedId].push(m)
  }

  if (Object.keys(domainDivergences).length === 0) return []

  const allScores = bd.divergent_modules.map(m => m.divergence_score).sort((a, b) => a - b)
  const p90 = allScores[Math.floor(allScores.length * 0.9)] || 0
  const medianScore = allScores[Math.floor(allScores.length / 2)] || 0

  const conditions = []
  for (const [domId, modules] of Object.entries(domainDivergences)) {
    const maxDiv = Math.max(...modules.map(m => m.divergence_score))
    const hasOrphaned = (bd.orphaned_modules || []).some(o => {
      const oDomId = resolveFileToRegistryDomain(o.module_prefix, registry, pressureZoneState)
      return oDomId && resolve(oDomId) === domId
    })
    const severity = maxDiv >= p90 ? 'HIGH'
      : maxDiv >= medianScore * 3 ? 'ELEVATED'
      : 'MODERATE'
    const emphasisIds = [domId]
    const dimIds = Array.from(domainIdSet).filter(id => !emphasisIds.includes(id))

    conditions.push({
      condition_id: 'sbd-' + domId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      condition_type: 'STRUCTURAL_BOUNDARY_DIVERGENCE',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: vocab.consequence,
      governance_boundary: 'STRUCTURAL_ONLY',
      topology_effect: vocab.topology_effect,
      severity,
      supporting_signal_ids: [],
      shared_topology_targets: { domains: emphasisIds, clusters: [], files: modules.flatMap(m => m.module_prefix ? [m.module_prefix] : []) },
      pressure_zone_ids: [],
      evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED',
      _has_orphaned_modules: hasOrphaned,
      topology_overlay: {
        overlay_mode: 'BOUNDARY_DIVERGENCE',
        emphasis_domains: emphasisIds,
        dim_domains: dimIds,
        advisory_zones: [],
        signal_overlays: modules.map(m => ({
          signal_id: 'divergence-' + m.module_prefix.replace(/[/\\]/g, '-'),
          signal_name: 'Divergence: ' + m.module_prefix,
          severity,
          type: 'boundary_divergence',
        })),
        corridor_paths: [],
      },
      guided_interventions: CONDITION_INTERVENTIONS.STRUCTURAL_BOUNDARY_DIVERGENCE.map(i => ({
        ...i,
        condition_id: 'sbd-' + domId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      })),
      orchestration_hooks: ['boundary_divergence_review'],
      contributing_features: ['structural_boundary_divergence'],
      derivation_trace: modules.map(m => m.module_prefix).join(' + ') +
        ' → boundary_divergence [' + bd.divergence_source + '] → STRUCTURAL_BOUNDARY_DIVERGENCE on ' + domId,
      divergence_evidence: {
        module_count: modules.length,
        max_divergence: maxDiv,
        has_orphaned: hasOrphaned,
        system_divergence_index: bd.system_divergence_index,
        divergence_source: bd.divergence_source,
        divergent_modules: modules.slice(0, 5).map(m => ({
          module_prefix: m.module_prefix,
          divergence_score: m.divergence_score,
          cross_boundary_ratio: m.cross_boundary_ratio,
          file_count: m.file_count,
          total_edges: m.total_edges,
          is_orphaned: m.is_orphaned,
        })),
      },
    })
  }

  return conditions
}

function ruleCouplingInertia(taggedSignals, registry, structuralEnrichment, pressureZoneState) {
  const ci = structuralEnrichment && structuralEnrichment.coupling_inertia
  if (!ci || !ci.inertia_clusters || ci.inertia_clusters.length === 0) return []

  const resolve = buildDomainResolver(registry)
  const domainIdSet = new Set((registry || []).map(d => d.domain_id))
  const vocab = CONDITION_VOCABULARY.COUPLING_INERTIA

  const domainClusters = {}
  for (const cluster of ci.inertia_clusters) {
    const clusterDomains = new Set()
    for (const modPrefix of cluster.modules) {
      const domId = resolveFileToRegistryDomain(modPrefix, registry, pressureZoneState)
      const resolvedId = domId ? resolve(domId) : null
      if (resolvedId) clusterDomains.add(resolvedId)
    }
    for (const domId of clusterDomains) {
      if (!domainClusters[domId]) domainClusters[domId] = []
      domainClusters[domId].push(cluster)
    }
  }

  if (Object.keys(domainClusters).length === 0) return []

  const allScores = ci.inertia_clusters.map(c => c.inertia_score).sort((a, b) => a - b)
  const p90 = allScores[Math.floor(allScores.length * 0.9)] || 0
  const medianScore = allScores[Math.floor(allScores.length / 2)] || 0

  const conditions = []
  for (const [domId, clusters] of Object.entries(domainClusters)) {
    const maxInertia = Math.max(...clusters.map(c => c.inertia_score))
    const hasChokeInCluster = clusters.some(c => {
      if (!structuralEnrichment.constriction_surface) return false
      const chokeFiles = (structuralEnrichment.constriction_surface.constriction_hotspots || []).map(h => h.path)
      return c.modules.some(m => chokeFiles.some(f => f.startsWith(m + '/')))
    })
    const severity = maxInertia >= p90 ? 'HIGH'
      : maxInertia >= medianScore * 3 ? 'ELEVATED'
      : 'MODERATE'
    const emphasisIds = [domId]
    const dimIds = Array.from(domainIdSet).filter(id => !emphasisIds.includes(id))

    conditions.push({
      condition_id: 'ci-' + domId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      condition_type: 'COUPLING_INERTIA',
      internal_condition_id: vocab.internal,
      technical_semantic_label: vocab.l2,
      operator_cognition_title: vocab.l3,
      operational_consequence: vocab.consequence,
      governance_boundary: 'STRUCTURAL_ONLY',
      topology_effect: vocab.topology_effect,
      severity,
      supporting_signal_ids: [],
      shared_topology_targets: { domains: emphasisIds, clusters: clusters.flatMap(c => c.modules), files: [] },
      pressure_zone_ids: [],
      evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED',
      _has_choke_in_cluster: hasChokeInCluster,
      topology_overlay: {
        overlay_mode: 'COUPLING_CLUSTER',
        emphasis_domains: emphasisIds,
        dim_domains: dimIds,
        advisory_zones: [],
        signal_overlays: clusters.map(c => ({
          signal_id: 'inertia-cluster-' + c.modules[0].replace(/[/\\]/g, '-'),
          signal_name: 'Cluster: ' + c.modules.slice(0, 3).join(', ') + (c.modules.length > 3 ? ' +' + (c.modules.length - 3) : ''),
          severity,
          type: 'coupling_cluster',
        })),
        corridor_paths: [],
      },
      guided_interventions: CONDITION_INTERVENTIONS.COUPLING_INERTIA.map(i => ({
        ...i,
        condition_id: 'ci-' + domId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      })),
      orchestration_hooks: ['coupling_inertia_review'],
      contributing_features: ['coupling_inertia'],
      derivation_trace: clusters.map(c => c.modules.join('+')).join(' | ') +
        ' → coupling_inertia [' + ci.inertia_source + '] → COUPLING_INERTIA on ' + domId,
      inertia_evidence: {
        cluster_count: clusters.length,
        max_inertia: maxInertia,
        has_choke_in_cluster: hasChokeInCluster,
        system_coupling_index: ci.system_coupling_index,
        inertia_source: ci.inertia_source,
        clusters: clusters.slice(0, 3).map(c => ({
          modules: c.modules,
          module_count: c.module_count,
          bidirectional_pairs: c.bidirectional_pairs,
          density: c.density,
          inertia_score: c.inertia_score,
        })),
      },
    })
  }

  return conditions
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

function runtimeSignalToCondition(rsig, registry) {
  const resolve = buildDomainResolver(registry)
  const domains = (rsig.affected_domains || []).map(d => resolve(d) || d).filter(Boolean)

  return {
    condition_id: 'rt-' + rsig.signal_type.toLowerCase().replace(/_/g, '-'),
    condition_type: rsig.signal_type,
    internal_condition_id: rsig.signal_type,
    technical_semantic_label: rsig.l2,
    operator_cognition_title: rsig.l3,
    operational_consequence: rsig.operational_consequence,
    governance_boundary: rsig.governance_boundary || 'RUNTIME_STRUCTURAL',
    topology_effect: 'Runtime connectivity evidence — ' + rsig.evidence_class,
    severity: rsig.severity,
    supporting_signal_ids: [rsig.signal_id],
    shared_topology_targets: { domains: rsig.affected_domains || [], clusters: [], files: [] },
    pressure_zone_ids: [],
    evidence_mode: 'RUNTIME_EVIDENCE',
    evidence_class: rsig.evidence_class,
    measurement_basis: rsig.measurement_basis,
    signal_value: rsig.signal_value,
    topology_overlay: {
      overlay_mode: 'RUNTIME_' + rsig.evidence_class,
      emphasis_domains: rsig.affected_domains || [],
      dim_domains: [],
      advisory_zones: [],
      signal_overlays: [{ signal_id: rsig.signal_id, signal_name: rsig.signal_name, severity: rsig.severity, type: 'runtime' }],
      corridor_paths: [],
    },
    guided_interventions: [],
    orchestration_hooks: [],
    contributing_features: ['runtime_' + rsig.signal_type.toLowerCase()],
    derivation_trace: rsig.signal_id + ' (' + rsig.evidence_class + ', value=' + rsig.signal_value + ') → ' + rsig.signal_type,
  }
}

function synthesize(fullReport) {
  if (!fullReport) return { conditions: [], active: [], suppressed: [], summary: null }

  const signals = fullReport.signal_interpretations || []
  const pressureZoneState = fullReport.pressure_zone_state || {}
  const structuralEnrichment = fullReport.structural_enrichment || {}
  const registry = fullReport.semantic_domain_registry || []

  const dpsigData = fullReport.dpsig_signal_summary || null

  const topologyEdges = fullReport.semantic_topology_edges || []

  const taggedSignals = signals.map(signal => ({
    signal,
    features: extractFeatures(signal, pressureZoneState, structuralEnrichment),
  }))

  const staticPrimitives = [
    ...ruleDeliveryPressureConcentration(taggedSignals, pressureZoneState, registry),
    ...ruleDependencyChokePoint(taggedSignals, registry, pressureZoneState, topologyEdges),
    ...rulePropagationAsymmetry(taggedSignals, registry, pressureZoneState, topologyEdges, structuralEnrichment),
    ...ruleStructuralMassConcentration(taggedSignals, registry, dpsigData, pressureZoneState),
    ...ruleCrossDomainCouplingPressure(taggedSignals, registry, structuralEnrichment),
    ...ruleExecutionFragility(taggedSignals, registry, structuralEnrichment, pressureZoneState),
    ...ruleExecutionConstriction(taggedSignals, registry, structuralEnrichment, pressureZoneState),
    ...ruleStructuralBoundaryDivergence(taggedSignals, registry, structuralEnrichment, pressureZoneState),
    ...ruleCouplingInertia(taggedSignals, registry, structuralEnrichment, pressureZoneState),
    ...ruleGovernanceCoverageStatus(taggedSignals, pressureZoneState, registry),
  ]

  const runtimeSignals = fullReport._runtime_signals || []
  const runtimePrimitives = runtimeSignals.map(rsig => runtimeSignalToCondition(rsig, registry))

  const primitives = [...staticPrimitives, ...runtimePrimitives]

  const composites = ruleCompoundConvergence(primitives, registry)

  const allConditions = [...primitives, ...composites]

  for (const c of allConditions) {
    c.domain_targets = buildDomainTargets(
      (c.shared_topology_targets && c.shared_topology_targets.domains) || [],
      registry,
      c.condition_type
    )
  }

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
    runtime_signal_count: runtimeSignals.length,
    runtime_condition_count: runtimePrimitives.length,
    summary: {
      total_signals: signals.length + runtimeSignals.length,
      total_conditions: allConditions.length,
      active_count: active.length,
      suppressed_count: suppressed.length,
      composite_count: composites.length,
      static_condition_count: staticPrimitives.length,
      runtime_condition_count: runtimePrimitives.length,
      primary_condition: primaryCondition ? primaryCondition.operator_cognition_title : null,
      primary_severity: primaryCondition ? primaryCondition.severity : null,
    },
  }
}

function synthesizeTeaser(fullReport) {
  if (!fullReport) return null

  const signals = fullReport.signal_interpretations || []
  const pressureZoneState = fullReport.pressure_zone_state || {}
  const structuralEnrichment = fullReport.structural_enrichment || {}
  const registry = fullReport.semantic_domain_registry || []

  const taggedSignals = signals.map(signal => ({
    signal,
    features: extractFeatures(signal, pressureZoneState, structuralEnrichment),
  }))

  const primitives = [
    ...ruleDeliveryPressureConcentration(taggedSignals, pressureZoneState, registry),
    ...ruleDependencyChokePoint(taggedSignals, registry, pressureZoneState, []),
    ...rulePropagationAsymmetry(taggedSignals, registry, pressureZoneState),
    ...ruleStructuralMassConcentration(taggedSignals, registry, null, pressureZoneState),
    ...ruleCrossDomainCouplingPressure(taggedSignals, registry, structuralEnrichment),
    ...ruleExecutionFragility(taggedSignals, registry, structuralEnrichment, pressureZoneState),
    ...ruleExecutionConstriction(taggedSignals, registry, structuralEnrichment, pressureZoneState),
    ...ruleStructuralBoundaryDivergence(taggedSignals, registry, structuralEnrichment, pressureZoneState),
    ...ruleCouplingInertia(taggedSignals, registry, structuralEnrichment, pressureZoneState),
    ...ruleGovernanceCoverageStatus(taggedSignals, pressureZoneState, registry),
  ]

  const composites = ruleCompoundConvergence(primitives, registry)
  const allConditions = [...primitives, ...composites]
  const active = allConditions.filter(c => c.severity !== 'NOMINAL')
  const sorted = [...active].sort((a, b) => (SEVERITY_RANK[a.severity] ?? 5) - (SEVERITY_RANK[b.severity] ?? 5))

  return {
    active_count: active.length,
    total_count: allConditions.length,
    top_conditions: sorted.slice(0, 3).map(c => {
      const domId = (c.shared_topology_targets?.domains || [])[0]
      const domEntry = domId ? registry.find(r => r.domain_id === domId) : null
      const target = domEntry ? (domEntry.business_label || domEntry.domain_name) : null
      return {
        condition_id: c.condition_id,
        title: c.operator_cognition_title + (target ? ' — ' + target : ''),
        severity: c.severity,
      }
    }),
    overflow: Math.max(0, sorted.length - 3),
  }
}

// ─── VISIBILITY-LAYER DOMAIN QUALIFICATION ──────────────────────
// Augments specimen domain backing with runtime connectivity evidence.
// Must run BEFORE synthesize() so condition formation reflects
// actual system connectivity, not static-import-only backing.

const BACKING_STATUS = {
  STATIC_BACKED: 'STATIC_BACKED',
  RUNTIME_BACKED: 'RUNTIME_BACKED',
  SYSTEM_BACKED: 'SYSTEM_BACKED',
  SEMANTIC_ONLY: 'SEMANTIC_ONLY',
  UNRESOLVED: 'UNRESOLVED',
}

function qualifyDomainBacking(fullReport, visibilityLayerCompleteness, runtimeConnectivityEdges, runtimeGraphs) {
  if (!fullReport) return fullReport
  if (!visibilityLayerCompleteness && !runtimeConnectivityEdges) return fullReport

  const qualified = { ...fullReport }
  const registry = [...(fullReport.semantic_domain_registry || [])]

  if (runtimeGraphs && runtimeGraphs._derived_signals) {
    qualified._runtime_signals = runtimeGraphs._derived_signals
  }

  const runtimeConnectedDomains = new Set()
  if (runtimeConnectivityEdges) {
    for (const edge of runtimeConnectivityEdges) {
      if (edge.source_domain) runtimeConnectedDomains.add(edge.source_domain)
      if (edge.target_domain) runtimeConnectedDomains.add(edge.target_domain)
    }
  }

  let backedCount = 0
  let runtimeBackedCount = 0

  qualified.semantic_domain_registry = registry.map(d => {
    const dom = { ...d }
    if (d.structurally_backed) {
      dom.backing_status = BACKING_STATUS.STATIC_BACKED
      if (runtimeConnectedDomains.has(d.domain_id)) {
        dom.backing_status = BACKING_STATUS.SYSTEM_BACKED
      }
      backedCount++
    } else if (runtimeConnectedDomains.has(d.domain_id)) {
      dom.backing_status = BACKING_STATUS.RUNTIME_BACKED
      dom.runtime_visible = true
      runtimeBackedCount++
      backedCount++
    } else {
      dom.backing_status = BACKING_STATUS.SEMANTIC_ONLY
    }
    return dom
  })

  if (runtimeBackedCount > 0 && fullReport.topology_summary) {
    const totalDomains = registry.length
    qualified.topology_summary = {
      ...fullReport.topology_summary,
      structurally_backed_count: backedCount,
      semantic_only_count: totalDomains - backedCount,
      grounding_ratio: totalDomains > 0 ? backedCount / totalDomains : 0,
      runtime_backed_count: runtimeBackedCount,
      static_backed_count: backedCount - runtimeBackedCount,
      coverage_classification: backedCount / totalDomains >= 0.8 ? 'HIGH'
        : backedCount / totalDomains >= 0.5 ? 'MEDIUM' : 'LOW',
      backing_qualification: 'VISIBILITY_LAYER_QUALIFIED',
    }
  }

  return qualified
}

// ─── SIGNAL LAYER BACKFILL ──────────────────────────────────────
// For S1 specimens where signal_interpretations is empty but conditions
// and runtime signals exist, derive signal_interpretation objects so
// downstream consumers see intelligence. Does NOT overwrite real S2 signals.

const EVIDENCE_MODE_LABEL = {
  STRUCTURAL_ENRICHMENT_DERIVED: 'Structural enrichment',
  SIGNAL_DRIVEN: 'Signal-driven',
  RUNTIME_DERIVED: 'Runtime connectivity',
  MIXED: 'Mixed',
}

function backfillSignalInterpretations(fullReport, synthesisResult) {
  if (!fullReport || !synthesisResult) return
  const existing = fullReport.signal_interpretations || []
  if (existing.length > 0) return

  const conditions = synthesisResult.conditions || []
  const runtimeSignals = fullReport._runtime_signals || []
  if (conditions.length === 0 && runtimeSignals.length === 0) return

  const registry = fullReport.semantic_domain_registry || []
  const rl = (id) => { const d = registry.find(r => r.domain_id === id); return d ? (d.business_label || d.domain_name || id) : id }

  const derived = []
  let idx = 0

  for (const c of conditions) {
    if (c.severity === 'NOMINAL') continue
    const domains = (c.shared_topology_targets?.domains || []).slice(0, 3).map(rl)
    derived.push({
      signal_id: `DCSI-${String(++idx).padStart(3, '0')}`,
      signal_name: c.operator_cognition_title || c.condition_label || c.condition_type,
      signal_family: 'DERIVED_CONDITION_SIGNAL',
      derivation_level: 'Condition',
      signal_value: null,
      severity: c.severity,
      activation_state: c.severity !== 'NOMINAL' ? 'ACTIVATED' : 'NOMINAL',
      interpretation: c.operational_consequence || null,
      boardroom_interpretation: c.operational_consequence || null,
      engineering_detail: c.measurement_basis || null,
      concentration: domains[0] || null,
      co_presence: null,
      source_condition_type: c.condition_type,
      evidence_mode: c.evidence_mode || 'STRUCTURAL_ENRICHMENT_DERIVED',
      evidence_source: EVIDENCE_MODE_LABEL[c.evidence_mode] || c.evidence_mode || 'Derived',
      derived_from: 'condition',
      affected_domains: domains,
    })
  }

  for (const rs of runtimeSignals) {
    derived.push({
      signal_id: rs.signal_id || `RSIG-${String(++idx).padStart(3, '0')}`,
      signal_name: rs.signal_name || rs.condition_type || 'Runtime Signal',
      signal_family: 'RSIG',
      derivation_level: 'Runtime',
      signal_value: rs.signal_value || null,
      severity: rs.severity || 'ELEVATED',
      activation_state: 'ACTIVATED',
      interpretation: rs.interpretation || rs.operational_consequence || null,
      boardroom_interpretation: rs.boardroom_interpretation || rs.interpretation || null,
      engineering_detail: rs.evidence_class || null,
      concentration: rs.concentration_domain || null,
      co_presence: null,
      source_condition_type: rs.condition_type || null,
      evidence_mode: 'RUNTIME_DERIVED',
      evidence_source: 'Runtime connectivity',
      derived_from: 'runtime_signal',
      affected_domains: (rs.affected_domains || []).slice(0, 3).map(rl),
    })
  }

  fullReport.signal_interpretations = derived
}

module.exports = { synthesize, synthesizeTeaser, extractFeatures, resolveDomainDisplay, translateCentralityNode, STRUCTURAL_ROLE_LABELS, CONDITION_VOCABULARY, SEVERITY_RANK, CONDITION_INTERVENTIONS, qualifyDomainBacking, BACKING_STATUS, backfillSignalInterpretations }

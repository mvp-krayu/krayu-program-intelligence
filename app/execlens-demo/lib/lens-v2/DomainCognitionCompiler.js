// ─── DOMAIN COGNITION COMPILER ──────────────────────────────────
// Assembles fragmented domain cognition from 6 existing computed
// sources into one consumable object per domain. Pure assembly —
// does not infer, discover, or synthesize new intelligence.
//
// Authority: PIOS.DOMAIN-COGNITION-ASSEMBLY.01
// Both BlueEdge and StackStorm feed the same function.
// Any output difference reflects evidence richness, not code path.

const ROLE_EXECUTIVE_LABEL = {
  FOUNDATION: 'Foundation layer',
  SHARED_LIBRARY: 'Central coordination layer',
  EXECUTION_ENGINE: 'Execution engine',
  API_BOUNDARY: 'External integration boundary',
  AUTH_BOUNDARY: 'Access control boundary',
  TEST_INFRASTRUCTURE: 'Quality assurance substrate',
  CLIENT_INTERFACE: 'Client integration surface',
  STREAMING_INTERFACE: 'Streaming interface',
  BUILD_INFRASTRUCTURE: 'Build infrastructure',
  APPLICATION_DOMAIN: 'Application module',
  UTILITY: 'Utility layer',
}

const ROLE_PRESSURE_LABEL = {
  FOUNDATION: 'structural foundation',
  SHARED_LIBRARY: 'coordination dependency surface',
  EXECUTION_ENGINE: 'execution processing surface',
  API_BOUNDARY: 'integration boundary',
  AUTH_BOUNDARY: 'security boundary',
  TEST_INFRASTRUCTURE: 'test dependency surface',
  CLIENT_INTERFACE: 'client integration point',
  STREAMING_INTERFACE: 'streaming coordination point',
  BUILD_INFRASTRUCTURE: 'build dependency',
  APPLICATION_DOMAIN: 'application domain',
  UTILITY: 'utility dependency',
}

function resolveExecutiveLabel(domain) {
  if (domain.business_label && domain.business_label !== domain.domain_name && domain.lineage_status === 'EXACT') {
    return domain.business_label
  }
  if (domain.role_classification && ROLE_EXECUTIVE_LABEL[domain.role_classification]) {
    return ROLE_EXECUTIVE_LABEL[domain.role_classification]
  }
  return domain.business_label || domain.domain_name || domain.domain_id
}

function resolveStructuralRole(domain, spines, fragHotspots, constrHotspots) {
  const name = (domain.domain_name || '').toLowerCase()
  const isSpine = spines.some(s => (s.path || s.file || '').toLowerCase().includes(name))
  const fragCount = fragHotspots.filter(h => (h.path || h.file || '').toLowerCase().includes(name)).length
  const constrCount = constrHotspots.filter(h => (h.path || h.file || '').toLowerCase().includes(name)).length
  const inbound = domain.inbound_imports || 0
  const outbound = domain.outbound_imports || 0

  const roles = []
  if (isSpine) roles.push('structural spine')
  if (inbound > 500) roles.push('dependency hub')
  else if (inbound > 100) roles.push('dependency target')
  if (outbound > 300 && inbound < 100) roles.push('outbound-dominant')
  if (fragCount > 10) roles.push('fragility concentration')
  if (constrCount > 5) roles.push('constriction point')

  return roles.length > 0 ? roles : null
}

function resolveRuntimeRole(domainId, domainName, runtimeSignals, conditions) {
  const rtCondTypes = new Set([
    'EVENT_CONCENTRATION', 'RUNTIME_DEPENDENCY_CHOKE_POINT', 'BROKER_DEPENDENCY',
    'TOPIC_FANOUT_PRESSURE', 'ASYNC_PROPAGATION_ASYMMETRY',
    'EDGE_CLOUD_PROPAGATION_RISK', 'RUNTIME_OBSERVABILITY_GAP',
  ])

  const nameLower = (domainName || '').toLowerCase()
  const rtConds = conditions.filter(c =>
    rtCondTypes.has(c.condition_type) &&
    c.severity !== 'NOMINAL' &&
    ((c.shared_topology_targets?.domains || []).includes(domainId) ||
     (c.shared_topology_targets?.domains || []).some(d => d.toLowerCase() === nameLower))
  )

  if (rtConds.length === 0) return null

  const roles = []
  if (rtConds.some(c => c.condition_type === 'EVENT_CONCENTRATION')) roles.push('event coordination hub')
  if (rtConds.some(c => c.condition_type === 'BROKER_DEPENDENCY')) roles.push('broker-dependent')
  if (rtConds.some(c => c.condition_type === 'RUNTIME_DEPENDENCY_CHOKE_POINT')) roles.push('runtime choke point')
  if (rtConds.some(c => c.condition_type === 'TOPIC_FANOUT_PRESSURE')) roles.push('topic fanout surface')
  if (rtConds.some(c => c.condition_type === 'RUNTIME_OBSERVABILITY_GAP')) roles.push('observability gap')
  if (rtConds.some(c => c.condition_type === 'ASYNC_PROPAGATION_ASYMMETRY')) roles.push('async propagation surface')
  if (rtConds.some(c => c.condition_type === 'EDGE_CLOUD_PROPAGATION_RISK')) roles.push('edge-cloud boundary')

  return roles.length > 0 ? roles : null
}

function resolvePressureRole(domainId, domainName, conditions, pressureZoneState) {
  const nameLower = (domainName || '').toLowerCase()
  const domConds = conditions.filter(c =>
    c.severity !== 'NOMINAL' &&
    ((c.shared_topology_targets?.domains || []).includes(domainId) ||
     (c.shared_topology_targets?.domains || []).some(d => d.toLowerCase() === nameLower))
  )
  if (domConds.length === 0) return { role: null, conditionCount: 0, peakSeverity: 'NOMINAL' }

  const SEV = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3 }
  const peakSeverity = domConds.reduce((best, c) => (SEV[c.severity] ?? 4) < (SEV[best] ?? 4) ? c.severity : best, 'NOMINAL')

  const zones = (pressureZoneState && pressureZoneState.zones) || []
  const inPressureZone = zones.some(z => (z.member_entities || []).includes(domainId))

  let role = 'condition target'
  if (domConds.length >= 4) role = 'pressure concentrator'
  else if (domConds.length >= 2) role = 'multi-condition target'
  if (inPressureZone) role = 'pressure zone member'

  return { role, conditionCount: domConds.length, peakSeverity }
}

function inferExecutiveRole(domain) {
  const sr = domain.structural_roles || []
  const rr = domain.runtime_roles || []
  const me = domain.measurement_evidence || {}
  const inbound = domain.inbound_imports || 0
  const outbound = domain.outbound_imports || 0

  const isSpine = sr.includes('structural spine')
  const isHub = sr.includes('dependency hub') || inbound > 500
  const isFragile = sr.includes('fragility concentration') || me.fragility_count > 10
  const isConstriction = sr.includes('constriction point') || me.constriction_count > 5
  const isOutbound = sr.includes('outbound-dominant') || (outbound > 200 && inbound < 50)
  const isDivergent = me.divergence && me.divergence.score > 5
  const isRuntimeHub = rr.includes('event coordination hub')
  const isBrokerDep = rr.includes('broker-dependent')
  const isChokePoint = rr.includes('runtime choke point')
  const isEdgeBoundary = rr.includes('edge-cloud boundary')
  const isFanout = rr.includes('topic fanout surface')

  if (isSpine && isHub && isFragile) return 'operational gravity center'
  if (isSpine && isHub) return 'structural dependency anchor'
  if (isRuntimeHub && isBrokerDep && isFanout) return 'runtime coordination hub'
  if (isRuntimeHub && isChokePoint) return 'runtime dependency bottleneck'
  if (isRuntimeHub && isEdgeBoundary) return 'edge integration corridor'
  if (isRuntimeHub && isBrokerDep) return 'runtime coordination surface'
  if (isRuntimeHub) return 'event coordination surface'
  if (isHub && isFragile) return 'fragile dependency center'
  if (isOutbound && isFragile) return 'propagation exposure surface'
  if (isOutbound && isRuntimeHub) return 'outbound coordination engine'
  if (isOutbound) return 'propagation corridor'
  if (isFragile && isConstriction) return 'structural stress concentrator'
  if (isFragile) return 'fragility exposure zone'
  if (isDivergent) return 'boundary drift zone'
  if (isChokePoint) return 'runtime bottleneck'
  if (isBrokerDep) return 'broker-dependent surface'
  if (isEdgeBoundary) return 'edge boundary surface'
  if (domain.condition_count >= 4) return 'pressure concentrator'
  if (domain.condition_count >= 2) return 'multi-pressure target'
  return 'structural participant'
}

function synthesizeWhyItMatters(domain) {
  const parts = []
  const sr = domain.structural_roles || []
  const rr = domain.runtime_roles || []
  const me = domain.measurement_evidence || {}

  if (sr.includes('structural spine') || sr.includes('dependency hub')) {
    parts.push(`structural authority — ${domain.inbound_imports ? domain.inbound_imports + ' inbound dependencies' : 'high centrality'}`)
  }
  if (me.fragility_count > 0) {
    parts.push(`${me.fragility_count} fragile file${me.fragility_count !== 1 ? 's' : ''} (peak ${me.peak_fragility})`)
  }
  if (rr.length > 0) {
    const rtSummary = rr.slice(0, 2).join(', ')
    parts.push(`runtime: ${rtSummary}`)
  }
  if (me.divergence) {
    parts.push(`boundary divergence ${me.divergence.score.toFixed(1)}`)
  }
  if (sr.includes('outbound-dominant')) {
    parts.push(`outbound-dominant — changes propagate widely`)
  }

  if (parts.length === 0) {
    return `${domain.condition_count} structural condition${domain.condition_count !== 1 ? 's' : ''} concentrate here.`
  }

  return parts.join('. ') + '.'
}

function buildEvidenceAnchors(domain) {
  const anchors = []
  const me = domain.measurement_evidence || {}
  if (me.top_spine) anchors.push(`spine: ${me.top_spine.path.split('/').slice(-2).join('/')} (in:${me.top_spine.in_degree})`)
  if (me.fragility_count > 0) anchors.push(`fragility: ${me.fragility_count} hotspots`)
  if (me.constriction_count > 0) anchors.push(`constriction: ${me.constriction_count} points`)
  if (me.divergence) anchors.push(`divergence: ${me.divergence.score.toFixed(1)}`)
  if (domain.runtime_roles && domain.runtime_roles.length > 0) anchors.push(`runtime: ${domain.runtime_roles.length} role${domain.runtime_roles.length !== 1 ? 's' : ''}`)
  if (domain.backing_status) anchors.push(domain.backing_status.toLowerCase().replace(/_/g, ' '))
  return anchors
}

function assembleDomainCognition(fullReport) {
  if (!fullReport) return { domains: [], attention_zones: [], pressure_summary: null }

  const registry = fullReport.semantic_domain_registry || []
  const se = fullReport.structural_enrichment || {}
  const spines = (se.centrality && se.centrality.top_structural_spines) || []
  const fragHotspots = (se.fragility_surface && se.fragility_surface.fragility_hotspots) || []
  const constrHotspots = (se.constriction_surface && se.constriction_surface.constriction_hotspots) || []
  const conditions = (fullReport._synthesisResult && fullReport._synthesisResult.conditions) || []
  const activeConditions = conditions.filter(c => c.severity !== 'NOMINAL')
  const runtimeSignals = fullReport._runtime_signals || []
  const pressureZoneState = fullReport.pressure_zone_state || {}

  const SEV = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3, LOW: 4, NOMINAL: 5 }

  const domains = registry.map(d => {
    const executiveLabel = resolveExecutiveLabel(d)
    const structuralRoles = resolveStructuralRole(d, spines, fragHotspots, constrHotspots)
    const runtimeRoles = resolveRuntimeRole(d.domain_id, d.domain_name, runtimeSignals, activeConditions)
    const { role: pressureRole, conditionCount, peakSeverity } = resolvePressureRole(d.domain_id, d.domain_name, activeConditions, pressureZoneState)

    const nameLower = (d.domain_name || '').toLowerCase()
    const domainSpines = spines.filter(s => (s.path || s.file || '').toLowerCase().includes(nameLower)).slice(0, 3)
    const domainFrag = fragHotspots.filter(h => (h.path || h.file || '').toLowerCase().includes(nameLower))
    const domainConstr = constrHotspots.filter(h => (h.path || h.file || '').toLowerCase().includes(nameLower))
    const bd = se.boundary_divergence || {}
    const domainDivergence = (bd.divergent_modules || []).find(m => (m.module_prefix || '').toLowerCase().includes(nameLower))

    return {
      domain_id: d.domain_id,
      technical_name: d.domain_name || d.domain_id,
      executive_label: executiveLabel,
      role_classification: d.role_classification || null,
      backing_status: d.backing_status || null,

      structural_roles: structuralRoles,
      runtime_roles: runtimeRoles,
      pressure_role: pressureRole,

      condition_count: conditionCount,
      peak_severity: peakSeverity,

      node_count: d.node_count || null,
      inbound_imports: d.inbound_imports || null,
      outbound_imports: d.outbound_imports || null,

      measurement_evidence: {
        spine_count: domainSpines.length,
        top_spine: domainSpines[0] ? { path: domainSpines[0].path, in_degree: domainSpines[0].in_degree || domainSpines[0].import_in_degree, out_degree: domainSpines[0].out_degree || domainSpines[0].import_out_degree } : null,
        fragility_count: domainFrag.length,
        peak_fragility: domainFrag.length > 0 ? Math.max(...domainFrag.map(h => h.fragility_score || 0)) : 0,
        constriction_count: domainConstr.length,
        divergence: domainDivergence ? { score: domainDivergence.divergence_score, file_count: domainDivergence.file_count, is_orphaned: domainDivergence.is_orphaned } : null,
      },

      evidence_basis: [
        d.role_classification ? 'role_classification' : null,
        d.backing_status ? 'domain_backing' : null,
        structuralRoles ? 'structural_enrichment' : null,
        runtimeRoles ? 'runtime_connectivity' : null,
        conditionCount > 0 ? 'condition_targets' : null,
        domainDivergence ? 'boundary_divergence' : null,
      ].filter(Boolean),
    }
  })

  domains.sort((a, b) => (SEV[a.peak_severity] ?? 5) - (SEV[b.peak_severity] ?? 5) || b.condition_count - a.condition_count)

  const attentionZones = domains
    .filter(d => d.condition_count >= 2 || d.peak_severity === 'CRITICAL' || d.peak_severity === 'HIGH')
    .slice(0, 5)
    .map(d => {
      const execRole = inferExecutiveRole(d)
      const whyItMatters = synthesizeWhyItMatters(d)
      return {
        domain_id: d.domain_id,
        technical_name: d.technical_name,
        executive_label: d.executive_label,
        executive_role: execRole,
        why_it_matters: whyItMatters,
        severity: d.peak_severity,
        evidence_anchors: buildEvidenceAnchors(d),
      }
    })

  const labelCounts = {}
  attentionZones.forEach(az => { labelCounts[az.executive_label] = (labelCounts[az.executive_label] || 0) + 1 })
  attentionZones.forEach(az => {
    if (labelCounts[az.executive_label] > 1 && az.technical_name !== az.executive_label) {
      az.executive_label = az.executive_label + ' — ' + az.technical_name
    }
  })

  const pressureZoneName = (pressureZoneState.zones && pressureZoneState.zones[0])
    ? (pressureZoneState.zones[0].anchor_business_label || pressureZoneState.zones[0].anchor_id || null)
    : null
  const primaryDomain = domains[0]

  return {
    domains,
    attention_zones: attentionZones,
    pressure_summary: {
      primary_zone: pressureZoneName,
      primary_domain: primaryDomain ? {
        technical_name: primaryDomain.technical_name,
        executive_label: primaryDomain.executive_label,
        condition_count: primaryDomain.condition_count,
        peak_severity: primaryDomain.peak_severity,
      } : null,
      total_domains: domains.length,
      domains_under_pressure: domains.filter(d => d.condition_count > 0).length,
      domains_with_runtime: domains.filter(d => d.runtime_roles).length,
    },
  }
}

module.exports = { assembleDomainCognition, resolveExecutiveLabel, ROLE_EXECUTIVE_LABEL, ROLE_PRESSURE_LABEL }

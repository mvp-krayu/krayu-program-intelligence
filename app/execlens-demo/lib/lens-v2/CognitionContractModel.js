const { SURFACE_CONDITION_MAP } = require('./SoftwareIntelligenceProjectionAdapter')

const RT_CONDITION_TYPES = new Set([
  'EVENT_CONCENTRATION','RUNTIME_DEPENDENCY_CHOKE_POINT','BROKER_DEPENDENCY',
  'TOPIC_FANOUT_PRESSURE','ASYNC_PROPAGATION_ASYMMETRY',
  'EDGE_CLOUD_PROPAGATION_RISK','RUNTIME_OBSERVABILITY_GAP',
])

const ROLE_SHORT = {
  FOUNDATION: 'Foundation', SHARED_LIBRARY: 'Shared Library',
  EXECUTION_ENGINE: 'Execution Engine', API_BOUNDARY: 'API',
  AUTH_BOUNDARY: 'Auth', TEST_INFRASTRUCTURE: 'Test',
  CLIENT_INTERFACE: 'Client', STREAMING_INTERFACE: 'Streaming',
  BUILD_INFRASTRUCTURE: 'Build', APPLICATION_DOMAIN: 'Application',
  UTILITY: 'Utility',
}

const BLINDNESS_CONFIG = {
  BOUNDARY: {
    label: 'Boundary Blindness',
    color: '#ff4757', icon: '◇',
    conditions: ['BROKER_DEPENDENCY', 'EDGE_CLOUD_PROPAGATION_RISK'],
    failure: 'Cloud application remains healthy while field data silently stops arriving',
  },
  SILENCE: {
    label: 'Silence Blindness',
    color: '#ff6b6b', icon: '○',
    conditions: ['RUNTIME_DEPENDENCY_CHOKE_POINT', 'ASYNC_PROPAGATION_ASYMMETRY'],
    failure: 'Backend processing continues but live operational visibility goes dark',
  },
  COUPLING: {
    label: 'Coupling Blindness',
    color: '#ff9e4a', icon: '◉',
    conditions: ['EVENT_CONCENTRATION', 'TOPIC_FANOUT_PRESSURE'],
    failure: 'Event bus failure interrupts coordination across all affected domains simultaneously',
  },
}

function resolveRegistry(fullReport) {
  return fullReport.semantic_domain_registry || []
}

function resolveDomainLabel(id, registry) {
  const d = registry.find(r => r.domain_id === id)
  return d ? (d.business_label || d.domain_name || id) : id
}

function resolveDomainRole(id, registry) {
  const d = registry.find(r => r.domain_id === id)
  return d && d.role_classification ? (ROLE_SHORT[d.role_classification] || d.role_classification) : null
}

function buildDomainEvidence(domainIds, registry, severity) {
  return domainIds.slice(0, 5).map(id => ({
    label: resolveDomainLabel(id, registry),
    value: (() => { const role = resolveDomainRole(id, registry); return role ? role + ' · ' + severity : severity })(),
    severity: severity === 'CRITICAL' || severity === 'HIGH' ? 'critical' : 'elevated',
  }))
}

function conditionLabel(condType) {
  if (!condType) return null
  return condType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

function resolveDomainForPath(filePath, registry) {
  if (!filePath || !registry || !registry.length) return null
  const fp = filePath.toLowerCase()
  return registry.find(d => fp.includes((d.domain_name || '').toLowerCase())) || null
}

function deriveAffectedDomainsFromPaths(paths, registry) {
  const map = new Map()
  for (const p of paths) {
    const match = resolveDomainForPath(p, registry)
    if (match) {
      const label = match.business_label || match.domain_name
      map.set(label, (map.get(label) || 0) + 1)
    }
  }
  return map
}

function formatLensMetric(value, metricType) {
  if (value == null || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  if (metricType === 'percent_normalized') return Math.round(n * 100) + '%'
  if (metricType === 'percent') return Math.round(n) + '%'
  if (metricType === 'score') return String(Math.round(n))
  if (metricType === 'count') return String(n)
  if (n > 0 && n <= 1) return Math.round(n * 100) + '%'
  return String(Math.round(n))
}

function domainListSummary(ids, registry, limit) {
  const n = limit || 3
  const labels = ids.slice(0, n).map(id => resolveDomainLabel(id, registry))
  const suffix = ids.length > n ? ' +' + (ids.length - n) + ' more' : ''
  return labels.join(', ') + suffix
}

// ─── Strategy: Execution Blindness ───

function resolveExecutionBlindness(surface, fullReport) {
  const registry = resolveRegistry(fullReport)
  const conditions = (fullReport._synthesisResult?.conditions || [])
  const rtConditions = conditions.filter(c => RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL')
  const rtDomains = [...new Set(rtConditions.flatMap(c => (c.shared_topology_targets?.domains || [])))]

  return {
    meta: { code: 'EB', label: 'Execution Blindness', icon: '◆' },
    inlineStrategy: 'EXECUTION_BLINDNESS',
    interpretation: {
      heading: 'Execution Blindness — What Cannot Be Seen',
      operationalMeaning: rtConditions.length > 0
        ? `${rtConditions.length} runtime-derived condition${rtConditions.length !== 1 ? 's' : ''} identify failure modes invisible to static analysis. ${rtDomains.length} domain${rtDomains.length !== 1 ? 's are' : ' is'} affected. The platform can report healthy while operational capabilities silently fail.`
        : 'No runtime conditions detected — execution blindness analysis requires runtime connectivity evidence.',
      structuralEvidence: rtConditions.slice(0, 5).map(c => ({
        label: c.operator_cognition_title || c.condition_type,
        value: c.severity + (c.shared_topology_targets?.domains_display?.[0] ? ' · ' + c.shared_topology_targets.domains_display[0] : ''),
        severity: c.severity === 'HIGH' || c.severity === 'CRITICAL' ? 'critical' : 'elevated',
      })),
    },
    implications: {
      orchestration: [
        { action: 'Map runtime coordination dependencies before transformation', priority: 'CRITICAL' },
        { action: 'Establish monitoring for silent failure modes (data freshness, coordination health)', priority: 'HIGH' },
        { action: 'Verify broker redundancy and failover paths', priority: 'HIGH' },
      ],
    },
    guidedCognition: [
      { question: 'Which failure modes produce silence instead of errors?', tone: 'forensic', archetype: 'TRACE', depth: 'deep', boundary: 'Structural derivation only — no inferred failure scenarios',
        answer_derive: (report) => {
          const conds = (report._synthesisResult?.conditions || []).filter(c => BLINDNESS_CONFIG.SILENCE.conditions.includes(c.condition_type) && c.severity !== 'NOMINAL')
          return { summary: conds.length > 0 ? `${conds.length} condition${conds.length !== 1 ? 's' : ''} produce silence instead of errors. These failures create absence of signal rather than observable error — the system appears healthy while operational visibility degrades.` : 'No silence-producing conditions detected in current evidence.',
            evidence: conds.map(c => ({ label: c.operator_cognition_title || c.condition_type, value: c.severity + ' · ' + (c.shared_topology_targets?.domains || []).length + ' domains', severity: c.severity === 'HIGH' || c.severity === 'CRITICAL' ? 'critical' : 'elevated' })),
            structuralContext: 'Silence blindness is the most dangerous blindness class — it produces no alert, no error, no signal. Monitoring must look for absence, not presence.' }
        }},
      { question: 'Where does the operational system extend beyond the codebase?', tone: 'forensic', archetype: 'BOUNDARY', depth: 'standard', boundary: 'Evidence from runtime connectivity graphs only',
        answer_derive: (report) => {
          const reg = resolveRegistry(report)
          const conds = (report._synthesisResult?.conditions || []).filter(c => BLINDNESS_CONFIG.BOUNDARY.conditions.includes(c.condition_type) && c.severity !== 'NOMINAL')
          const doms = [...new Set(conds.flatMap(c => c.shared_topology_targets?.domains || []))]
          return { summary: doms.length > 0 ? `The operational system extends beyond the codebase at ${doms.length} domain${doms.length !== 1 ? 's' : ''}: ${domainListSummary(doms, reg, 4)}. These domains depend on infrastructure (message brokers, edge gateways) that exists outside the code repository.` : 'No boundary extensions detected.',
            evidence: conds.map(c => ({ label: c.operator_cognition_title || c.condition_type, value: c.severity, severity: 'elevated' })) }
        }},
      { question: 'Which runtime coordination paths carry the highest blast radius?', tone: 'structural', archetype: 'RISK', depth: 'standard', boundary: 'Blast radius from event/topic concentration analysis',
        answer_derive: (report) => {
          const reg = resolveRegistry(report)
          const conds = (report._synthesisResult?.conditions || []).filter(c => BLINDNESS_CONFIG.COUPLING.conditions.includes(c.condition_type) && c.severity !== 'NOMINAL')
          return { summary: conds.length > 0 ? `${conds.length} coordination path${conds.length !== 1 ? 's' : ''} carry concentrated blast radius. A single event bus or topic failure at these points interrupts coordination across multiple domains simultaneously.` : 'No concentrated coordination paths detected.',
            evidence: conds.map(c => ({ label: c.operator_cognition_title || c.condition_type, value: c.severity + ' · ' + (c.shared_topology_targets?.domains || []).slice(0, 3).map(d => resolveDomainLabel(d, reg)).join(', '), severity: c.severity === 'HIGH' || c.severity === 'CRITICAL' ? 'critical' : 'elevated' })) }
        }},
    ],
    actions: [
      { label: 'Identify silent failure scenarios', type: 'assessment', priority: 'HIGH' },
      { label: 'Map boundary dependencies (brokers, external infrastructure)', type: 'assessment', priority: 'HIGH' },
    ],
  }
}

// ─── Strategy: Gravity Divergence ───

function resolveGravityDivergence(surface, fullReport) {
  const registry = resolveRegistry(fullReport)
  const conditions = (fullReport._synthesisResult?.conditions || [])
  const staticDomains = [...new Set(conditions.filter(c => !RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL').flatMap(c => c.shared_topology_targets?.domains || []))]
  const runtimeDomains = [...new Set(conditions.filter(c => RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL').flatMap(c => c.shared_topology_targets?.domains || []))]
  const divergent = runtimeDomains.filter(d => !staticDomains.includes(d))

  return {
    meta: { code: 'GD', label: 'Gravity Divergence', icon: '◆' },
    inlineStrategy: 'GRAVITY_DIVERGENCE',
    interpretation: {
      heading: 'Gravity Divergence — Code vs Operational Center of Mass',
      operationalMeaning: divergent.length > 0
        ? `The code center of mass and the operational center of mass do not coincide. ${divergent.length} domain${divergent.length !== 1 ? 's carry' : ' carries'} operational gravity without corresponding static code weight: ${domainListSummary(divergent, registry, 3)}. Transformation planning based solely on static code analysis targets the wrong center of mass.`
        : 'No divergence detected between static and runtime gravity — both gravity fields appear aligned.',
      structuralEvidence: [
        { label: 'Static gravity loci', value: domainListSummary(staticDomains, registry, 3), severity: 'nominal' },
        { label: 'Runtime gravity loci', value: domainListSummary(runtimeDomains, registry, 3), severity: 'elevated' },
        { label: 'Divergent domains', value: String(divergent.length), severity: divergent.length > 0 ? 'critical' : 'nominal' },
      ],
    },
    implications: {
      orchestration: [
        { action: 'Assess whether refactoring targets align with operational gravity', priority: 'CRITICAL' },
        { action: 'Include runtime topology in architectural investment decisions', priority: 'HIGH' },
      ],
    },
    guidedCognition: [
      { question: 'Where does the import graph concentrate and where does runtime coordination concentrate?', tone: 'structural', archetype: 'COMPARE', depth: 'standard', boundary: 'Derived from static topology and runtime connectivity graphs',
        answer_derive: (report) => {
          const reg = resolveRegistry(report)
          const conds = (report._synthesisResult?.conditions || [])
          const sDoms = [...new Set(conds.filter(c => !RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL').flatMap(c => c.shared_topology_targets?.domains || []))]
          const rDoms = [...new Set(conds.filter(c => RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL').flatMap(c => c.shared_topology_targets?.domains || []))]
          return { summary: `Import graph concentrates on ${domainListSummary(sDoms, reg, 3)}. Runtime coordination concentrates on ${domainListSummary(rDoms, reg, 3)}. Where these sets diverge, operational risk is invisible to static analysis.`,
            evidence: [
              { label: 'Static gravity', value: domainListSummary(sDoms, reg, 4), severity: 'nominal' },
              { label: 'Runtime gravity', value: domainListSummary(rDoms, reg, 4), severity: 'elevated' },
              { label: 'Divergent count', value: String(rDoms.filter(d => !sDoms.includes(d)).length) + ' runtime-only', severity: rDoms.filter(d => !sDoms.includes(d)).length > 0 ? 'critical' : 'nominal' },
            ] }
        }},
      { question: 'Would refactoring the static hub reduce operational risk?', tone: 'forensic', archetype: 'TRACE', depth: 'deep', boundary: 'Structural correlation only — not a recommendation',
        answer_derive: (report) => {
          const conds = (report._synthesisResult?.conditions || [])
          const rDoms = [...new Set(conds.filter(c => RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL').flatMap(c => c.shared_topology_targets?.domains || []))]
          const sDoms = [...new Set(conds.filter(c => !RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL').flatMap(c => c.shared_topology_targets?.domains || []))]
          const runtimeOnly = rDoms.filter(d => !sDoms.includes(d))
          return { summary: runtimeOnly.length > 0 ? `Refactoring the static hub alone would not address ${runtimeOnly.length} domain${runtimeOnly.length !== 1 ? 's' : ''} that carry operational gravity without static code weight. These domains need runtime-aware investment — static refactoring targets the wrong center of mass.` : 'Static and runtime gravity are aligned — refactoring the static hub would address operational risk.',
            structuralContext: 'This is a structural correlation, not a recommendation. Investment decisions require governance review.' }
        }},
      { question: 'Which domains appear structurally insignificant but carry operational load?', tone: 'structural', archetype: 'RISK', depth: 'standard', boundary: 'Evidence from runtime connectivity only',
        answer_derive: (report) => {
          const reg = resolveRegistry(report)
          const conds = (report._synthesisResult?.conditions || [])
          const sDoms = new Set(conds.filter(c => !RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL').flatMap(c => c.shared_topology_targets?.domains || []))
          const rDoms = [...new Set(conds.filter(c => RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL').flatMap(c => c.shared_topology_targets?.domains || []))]
          const hidden = rDoms.filter(d => !sDoms.has(d))
          return { summary: hidden.length > 0 ? `${hidden.length} domain${hidden.length !== 1 ? 's appear' : ' appears'} structurally insignificant but ${hidden.length !== 1 ? 'carry' : 'carries'} operational load: ${hidden.map(d => resolveDomainLabel(d, reg)).join(', ')}. These are invisible to import-graph-based analysis.` : 'All operationally loaded domains also carry static code weight — no hidden operational load detected.',
            evidence: hidden.map(d => ({ label: resolveDomainLabel(d, reg), value: 'Runtime gravity · no static weight', severity: 'critical' })) }
        }},
    ],
    actions: [
      { label: 'Compare static and runtime investment targets', type: 'assessment', priority: 'HIGH' },
    ],
  }
}

// ─── Strategy: Generic (any surface) ───

function resolveGeneric(surface, fullReport) {
  const registry = resolveRegistry(fullReport)
  const domains = (surface.affected_domains || [])
  const domainEvidence = buildDomainEvidence(domains, registry, surface.severity)
  const condLbl = conditionLabel(surface.condition_type)

  return {
    meta: { code: (surface.surface_name || '??').slice(0, 2).toUpperCase(), label: surface.surface_name || 'Cognition Surface', icon: '◆' },
    inlineStrategy: null,
    interpretation: {
      heading: (surface.surface_name || 'Cognition Surface') + ' — Active',
      operationalMeaning: (surface.operational_summary || surface.consequence || 'This surface identifies a structural condition requiring attention.')
        + (domains.length > 0 ? ` Affects ${domains.length} domain${domains.length !== 1 ? 's' : ''}: ${domainListSummary(domains, registry, 3)}.` : ''),
      structuralEvidence: domainEvidence.length > 0 ? domainEvidence : [
        { label: 'Severity', value: surface.severity, severity: 'elevated' },
        { label: 'Evidence density', value: String(surface.evidence_density || 0) + ' items', severity: 'nominal' },
      ],
    },
    implications: {
      orchestration: [
        { action: 'Investigate affected domains for this condition', priority: surface.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH' },
        { action: 'Assess structural impact before changes to affected regions', priority: 'HIGH' },
      ],
    },
    guidedCognition: [
      { question: `Why does ${surface.surface_name} affect these domains?`, tone: 'forensic', archetype: 'TRACE', depth: 'standard', boundary: 'Structural derivation from condition evidence',
        answer_derive: () => ({ summary: `${surface.surface_name} affects ${domains.length} domain${domains.length !== 1 ? 's' : ''} because ${(surface.operational_summary || 'structural conditions concentrate in these regions').toLowerCase()}`,
          evidence: domainEvidence.slice(0, 5) }) },
      { question: `Which domain carries the highest concentration for this condition?`, tone: 'structural', archetype: 'RISK', depth: 'standard', boundary: 'Evidence density from condition targets',
        answer_derive: () => ({ summary: domains.length > 0 ? `${resolveDomainLabel(domains[0], registry)} carries the highest concentration for this condition across the affected region.` : 'No domain concentration data available.',
          evidence: domainEvidence.slice(0, 3) }) },
      ...(condLbl ? [{ question: `What structural pattern drives ${condLbl}?`, tone: 'structural', archetype: 'TRACE', depth: 'standard', boundary: 'Structural pattern from condition classification',
        answer_derive: () => ({ summary: `${condLbl} is driven by structural patterns that ${(surface.consequence || 'create operational risk in affected regions').toLowerCase()}` }) }] : []),
    ],
    actions: [
      { label: 'Review affected domain structural profiles', type: 'assessment', priority: 'HIGH' },
    ],
  }
}

// ─── Resolution ───

const STRATEGY_MAP = {
  EXECUTION_BLINDNESS: resolveExecutionBlindness,
  GRAVITY_DIVERGENCE: resolveGravityDivergence,
}

function buildConditionIndex(conditionMap) {
  const idx = {}
  for (const [contractId, conds] of Object.entries(conditionMap)) {
    for (const ct of conds) { idx[ct] = contractId }
  }
  return idx
}

let _conditionIndex = null

function resolveCognitionContract(surfaceId, surface, fullReport, legacyContracts) {
  if (!surface || !fullReport) return null

  // 1. Strategy-based (EB, GD)
  const strategyFn = STRATEGY_MAP[surfaceId]
  if (strategyFn) {
    const result = strategyFn(surface, fullReport)
    return { ...result, surface }
  }

  // 2. Legacy contract: direct by surface_id
  let contract = legacyContracts[surfaceId]

  // 3. Legacy contract: via condition_type mapping (skip for combination/consequence surfaces)
  if (!contract && surface.condition_type && !surface.is_combination && !surface.combination_pattern) {
    if (!_conditionIndex) _conditionIndex = buildConditionIndex(SURFACE_CONDITION_MAP)
    const legacyId = _conditionIndex[surface.condition_type]
    if (legacyId) contract = legacyContracts[legacyId]
  }

  if (contract) {
    return { meta: contract.meta, surface, inlineStrategy: null, ...contract.resolve(fullReport, surface) }
  }

  // 4. Generic fallback
  const result = resolveGeneric(surface, fullReport)
  return { ...result, surface }
}

module.exports = {
  resolveCognitionContract,
  resolveGeneric,
  BLINDNESS_CONFIG,
  RT_CONDITION_TYPES,
  ROLE_SHORT,
  resolveDomainLabel,
  resolveDomainRole,
  resolveDomainForPath,
  deriveAffectedDomainsFromPaths,
  buildDomainEvidence,
  formatLensMetric,
  conditionLabel,
  domainListSummary,
}

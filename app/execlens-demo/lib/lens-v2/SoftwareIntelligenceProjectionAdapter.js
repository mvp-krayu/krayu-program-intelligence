'use strict'

/**
 * SoftwareIntelligenceProjectionAdapter
 * PI.SOFTWARE-INTELLIGENCE.COGNITION-COMPRESSION.01
 *
 * Produces compressed operational cognition surfaces from PI Core data.
 * Each surface synthesizes MULTIPLE PI Core sources into a single
 * operational assessment — not re-labeled lists.
 */

const PROJECTION_STATUS = {
  ABSENT: 'ABSENT',
  AVAILABLE: 'AVAILABLE',
  INVALID: 'INVALID',
}

const SURFACE_CONDITION_MAP = {
  DELIVERY_FRAGILITY: ['DELIVERY_PRESSURE_CONCENTRATION', 'COMPOUND_CONVERGENCE'],
  COORDINATION_SATURATION: ['DEPENDENCY_CHOKE_POINT', 'CROSS_DOMAIN_COUPLING_PRESSURE', 'EXECUTION_CONSTRICTION'],
  INTEGRATION_EXPOSURE: ['CROSS_DOMAIN_COUPLING_PRESSURE'],
  OPERATIONAL_TOPOLOGY: ['STRUCTURAL_MASS_CONCENTRATION'],
  QUALIFICATION_EXPOSURE: ['GOVERNANCE_COVERAGE_GAP', 'GOVERNANCE_COVERAGE_COMPLETE'],
  PROPAGATION_RISK: ['PROPAGATION_ASYMMETRY'],
  STRUCTURAL_FRAGILITY: ['EXECUTION_FRAGILITY'],
  BOUNDARY_ALIGNMENT: ['STRUCTURAL_BOUNDARY_DIVERGENCE'],
}

// ─── SIGNAL TRANSLATION DOCTRINE ──────────────────────────────────
// L1 = raw derivation (internal), L2 = structural semantic, L3 = operational cognition

const SIGNAL_COGNITION_MAP = {
  'PSIG-001': {
    l2: 'Cross-Domain Propagation Pressure',
    l3_title: 'Structural Dependency Concentration',
    l3_consequence: 'Changes in this structural region propagate across multiple operational domains.',
    topology_effect: 'Dependency amplification corridor active',
    governance: 'Advisory-bound downstream topology',
  },
  'PSIG-002': {
    l2: 'Domain Interdependency Load',
    l3_title: 'Operational Coupling Overload',
    l3_consequence: 'This domain carries disproportionate interdependency — operational independence is constrained.',
    topology_effect: 'Concentrated coupling corridor',
    governance: 'Structural confirmation required before deployment decisions',
  },
  'PSIG-004': {
    l2: 'Structural Resilience Concentration',
    l3_title: 'Resilience Concentration Risk',
    l3_consequence: 'Operational resilience depends disproportionately on one structural region.',
    topology_effect: 'Concentrated pressure zone with elevated blast radius',
    governance: 'Advisory-bound for downstream domains',
  },
  'PSIG-006': {
    l2: 'Structural Coverage Completeness',
    l3_title: 'Domain Anchoring Status',
    l3_consequence: 'All structural nodes are domain-anchored. Governance coverage is complete.',
    l3_consequence_gap: 'Structural components exist without domain anchoring — governance coverage has gaps.',
    topology_effect: 'Structural blind spots visible on topology',
    governance: 'Governance coverage verification',
  },
  'ISIG-001': {
    l2: 'Dependency Hub Concentration',
    l3_title: 'Structural Dependency Choke Point',
    l3_consequence: 'A structural dependency hub concentrates import traffic — failure at this point has disproportionate downstream impact.',
    topology_effect: 'Import amplification corridor active',
    governance: 'Advisory-bound until cross-domain topology confirms corridor exposure',
  },
  'ISIG-002': {
    l2: 'Dependency Spread Asymmetry',
    l3_title: 'Asymmetric Downstream Exposure',
    l3_consequence: "One component's changes ripple disproportionately across the system — dependency spread is unbalanced.",
    topology_effect: 'Asymmetric propagation corridor',
    governance: 'Advisory-bound — structural confirmation needed',
  },
  'DPSIG-031': {
    l2: 'Structural Load Concentration',
    l3_title: 'Operational Load Concentration',
    l3_consequence: 'Structural load is concentrated in a dominant region — this domain carries disproportionate architectural weight.',
    topology_effect: 'Pressure zone boundary active — concentrated structural mass',
    governance: 'Elevated structural attention required',
  },
  'DPSIG-032': {
    l2: 'Structural Coordination Overload',
    l3_title: 'Coordination Responsibility Imbalance',
    l3_consequence: 'This domain carries disproportionate coordination responsibility across the topology.',
    topology_effect: 'Coordination hub emphasis — asymmetric structural dependency',
    governance: 'Organizational dependency on this domain is elevated',
  },
}

function translateSignal(signalId) {
  return SIGNAL_COGNITION_MAP[signalId] || null
}

const SEVERITY_ORDER = { HIGH: 0, ELEVATED: 1, MODERATE: 2, LOW: 3, NOMINAL: 4 }

function maxSeverity(items) {
  let best = 'NOMINAL'
  for (const item of items) {
    const sev = item.severity || item
    if ((SEVERITY_ORDER[sev] ?? 5) < (SEVERITY_ORDER[best] ?? 5)) best = sev
  }
  return best
}

function isActivated(sig) {
  return sig.severity !== 'NOMINAL' && sig.activation_state !== 'NOMINAL' && sig.activation_state !== 'CLUSTER_BALANCED'
}

function deriveModuleState(fullReport) {
  if (!fullReport) return PROJECTION_STATUS.ABSENT
  const sigs = fullReport.signal_interpretations
  const registry = fullReport.semantic_domain_registry
  const hasSigs = sigs && sigs.length > 0
  const hasDomains = registry && registry.length > 0
  if (!hasSigs && !hasDomains) return PROJECTION_STATUS.ABSENT
  return PROJECTION_STATUS.AVAILABLE
}

// ─── SURFACE: DELIVERY FRAGILITY ────────────────────────────────────
// Synthesizes: origin evidence blocks + high-severity signals + propagation summary
// Question: "How fragile are our delivery paths?"

function deriveDeliveryFragility(fullReport) {
  const sigs = (fullReport.signal_interpretations || []).filter(isActivated)
  const blocks = fullReport.evidence_blocks || []
  const ps = fullReport.propagation_summary || {}

  const origins = blocks.filter(b => b.propagation_role === 'ORIGIN')
  if (origins.length === 0 && sigs.length === 0) return null

  const originDomains = origins.map(o => o.domain_alias)
  const highSigs = sigs.filter(s => s.severity === 'HIGH' || s.severity === 'ELEVATED')

  const severity = highSigs.length >= 2 ? 'HIGH'
    : highSigs.length >= 1 ? 'ELEVATED'
    : sigs.length > 2 ? 'MODERATE'
    : 'LOW'

  const constituents = []
  for (const origin of origins) {
    const domainSigs = sigs.filter(s =>
      s.concentration && s.concentration.toLowerCase().includes(origin.domain_alias.toLowerCase())
    )
    constituents.push({
      domain: origin.domain_alias,
      role: 'origin',
      grounding: origin.grounding_status,
      signal_count: domainSigs.length,
      peak_severity: domainSigs.length > 0 ? maxSeverity(domainSigs) : null,
    })
  }

  const pressureZone = ps.primary_zone_business_label || null

  return {
    surface_id: 'DELIVERY_FRAGILITY',
    surface_name: 'Delivery Fragility',
    severity,
    operational_summary: origins.length > 0
      ? `${origins.length} domain${origins.length !== 1 ? 's' : ''} ${origins.length !== 1 ? 'originate' : 'originates'} structural pressure with ${highSigs.length} elevated-or-higher signal${highSigs.length !== 1 ? 's' : ''} — delivery paths carry concentrated load${pressureZone ? ` at ${pressureZone}` : ''}`
      : `${sigs.length} active pressure signal${sigs.length !== 1 ? 's' : ''} ${sigs.length !== 1 ? 'indicate' : 'indicates'} structural stress on delivery paths`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Changes touching pressure-origin domains propagate risk through execution corridors — deployment requires structural awareness'
      : 'Delivery paths under moderate structural load — monitor for concentration drift',
    evidence_density: origins.length + highSigs.length,
    affected_domains: originDomains,
    constituents,
    trace_sources: ['signal_interpretations', 'evidence_blocks', 'propagation_summary'],
  }
}

// ─── SURFACE: COORDINATION SATURATION ──────────────────────────────
// Synthesizes: structural centrality (hubs/authorities) + concentration signals
// Question: "Are coordination points overloaded?"

function deriveCoordinationSaturation(fullReport) {
  const se = fullReport.structural_enrichment || {}
  const sigs = (fullReport.signal_interpretations || []).filter(isActivated)

  if (!se.available || !se.centrality) return null

  const spines = se.centrality.top_structural_spines || []
  const roleSummary = se.centrality.role_summary || {}
  const hubCount = (roleSummary.hub || 0) + (roleSummary.authority || 0)
  const totalClassified = Object.values(roleSummary).reduce((a, b) => a + b, 0)

  const coordinationNodes = spines.filter(s =>
    s.structural_role === 'hub' || s.structural_role === 'authority'
  )

  const concentrationSigs = sigs.filter(s =>
    (s.signal_name && (s.signal_name.includes('Absorption') || s.signal_name.includes('Cluster Pressure'))) ||
    s.severity === 'HIGH'
  )

  if (coordinationNodes.length === 0) return null

  const meanInDegree = coordinationNodes.reduce((sum, n) => sum + (n.in_degree || 0), 0) / coordinationNodes.length
  const maxInDegree = Math.max(...coordinationNodes.map(n => n.in_degree || 0))
  const hubRatio = totalClassified > 0 ? hubCount / totalClassified : 0

  const severity = concentrationSigs.length >= 2 && hubRatio > 0.15 ? 'HIGH'
    : concentrationSigs.length >= 1 || hubRatio > 0.2 ? 'ELEVATED'
    : hubRatio > 0.1 ? 'MODERATE'
    : 'LOW'

  const constituents = coordinationNodes.slice(0, 5).map(n => ({
    path: n.path,
    role: n.structural_role,
    in_degree: n.in_degree,
    out_degree: n.out_degree,
    centrality_rank: n.centrality_rank,
  }))

  return {
    surface_id: 'COORDINATION_SATURATION',
    surface_name: 'Coordination Saturation',
    severity,
    operational_summary: `${hubCount} coordination hub${hubCount !== 1 ? 's' : ''} absorb structural load — peak inbound dependency ${maxInDegree}, mean ${Math.round(meanInDegree * 10) / 10}${concentrationSigs.length > 0 ? ` with ${concentrationSigs.length} concentration signal${concentrationSigs.length !== 1 ? 's' : ''} active` : ''}`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Coordination hubs carry disproportionate coupling — changes to these files amplify across the dependency graph'
      : 'Coordination load is distributed — no immediate concentration risk',
    evidence_density: coordinationNodes.length + concentrationSigs.length,
    affected_domains: coordinationNodes.slice(0, 5).map(n => n.path.split('/').slice(-2).join('/')),
    constituents,
    hub_ratio: Math.round(hubRatio * 100),
    trace_sources: ['structural_enrichment.centrality'],
  }
}

// ─── SURFACE: INTEGRATION EXPOSURE ─────────────────────────────────
// Synthesizes: bridge/connector roles + ISIG signals + pass-through evidence
// Question: "Where are integration boundaries under stress?"

function deriveIntegrationExposure(fullReport) {
  const se = fullReport.structural_enrichment || {}
  const sigs = (fullReport.signal_interpretations || []).filter(isActivated)
  const blocks = fullReport.evidence_blocks || []

  const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
  const isigSigs = sigs.filter(s => s.signal_family === 'ISIG')
  const asymmetrySigs = sigs.filter(s => s.signal_name && s.signal_name.includes('Fan Asymmetry'))

  let bridgeCount = 0
  let connectorCount = 0
  const bridgeNodes = []

  if (se.available && se.centrality) {
    const roleSummary = se.centrality.role_summary || {}
    bridgeCount = roleSummary.bridge || 0
    connectorCount = roleSummary.connector || 0
    const spines = se.centrality.top_structural_spines || []
    bridgeNodes.push(...spines.filter(s => s.structural_role === 'bridge' || s.structural_role === 'connector').slice(0, 5))
  }

  const integrationSignalCount = isigSigs.length + asymmetrySigs.length
  if (bridgeCount === 0 && integrationSignalCount === 0 && passThroughs.length === 0) return null

  const hasTopology = (bridgeCount + connectorCount) > 0 || passThroughs.length > 0
  const hasIsig = isigSigs.length > 0
  const evidence_mode = hasTopology && hasIsig ? 'MIXED'
    : hasTopology ? 'TOPOLOGY_DRIVEN'
    : hasIsig ? 'IMPORT_SIGNAL_DRIVEN'
    : 'EVIDENCE_GAP'

  const severity = isigSigs.length >= 2 ? 'ELEVATED'
    : (isigSigs.length >= 1 && passThroughs.length >= 2) ? 'ELEVATED'
    : (bridgeCount > 0 && (isigSigs.length > 0 || asymmetrySigs.length > 0)) ? 'MODERATE'
    : 'LOW'

  const affectedDomains = [
    ...passThroughs.map(p => p.domain_alias),
    ...bridgeNodes.map(n => n.path.split('/').slice(-2).join('/')),
  ]

  const topologyCount = bridgeCount + connectorCount
  let operational_summary
  if (evidence_mode === 'IMPORT_SIGNAL_DRIVEN') {
    const peakSev = maxSeverity(isigSigs)
    operational_summary = `Elevated file-level import dependency pressure — ${isigSigs.length} ${peakSev} ISIG signal${isigSigs.length !== 1 ? 's' : ''} detect structural stress at import boundaries`
      + (passThroughs.length > 0 ? ` across ${passThroughs.length} pass-through domain${passThroughs.length !== 1 ? 's' : ''}` : '')
      + `. Cross-domain integration corridor topology not yet resolved.`
  } else if (evidence_mode === 'TOPOLOGY_DRIVEN') {
    operational_summary = `${topologyCount} cross-domain integration point${topologyCount !== 1 ? 's' : ''}`
      + (passThroughs.length > 0 ? ` — ${passThroughs.length} domain${passThroughs.length !== 1 ? 's' : ''} ${passThroughs.length !== 1 ? 'conduct' : 'conducts'} pressure` : '')
  } else if (evidence_mode === 'MIXED') {
    operational_summary = `${topologyCount} cross-domain integration point${topologyCount !== 1 ? 's' : ''} under ${isigSigs.length} import dependency signal${isigSigs.length !== 1 ? 's' : ''}`
      + (passThroughs.length > 0 ? ` — ${passThroughs.length} domain${passThroughs.length !== 1 ? 's' : ''} ${passThroughs.length !== 1 ? 'conduct' : 'conducts'} pressure` : '')
  } else {
    operational_summary = 'Integration exposure evidence insufficient for operational assessment'
  }

  let consequence
  if (evidence_mode === 'IMPORT_SIGNAL_DRIVEN') {
    consequence = severity === 'ELEVATED'
      ? 'File-level import dependency concentration is elevated — advisory-bound until cross-domain integration topology confirms corridor exposure'
      : 'Import dependency signals present but below elevated threshold'
  } else {
    consequence = severity === 'ELEVATED' || severity === 'HIGH'
      ? 'Integration boundaries are absorbing cross-domain pressure — changes here risk cascading through connected subsystems'
      : 'Integration points present but not under elevated structural stress'
  }

  return {
    surface_id: 'INTEGRATION_EXPOSURE',
    surface_name: 'Integration Exposure',
    severity,
    evidence_mode,
    operational_summary,
    consequence,
    evidence_density: bridgeCount + connectorCount + isigSigs.length + passThroughs.length,
    affected_domains: [...new Set(affectedDomains)],
    constituents: {
      bridges: bridgeCount,
      connectors: connectorCount,
      isig_signals: isigSigs.length,
      isig_peak_severity: isigSigs.length > 0 ? maxSeverity(isigSigs) : null,
      pass_through_domains: passThroughs.map(p => p.domain_alias),
    },
    trace_sources: ['structural_enrichment.centrality', 'signal_interpretations', 'evidence_blocks'],
  }
}

// ─── SURFACE: OPERATIONAL TOPOLOGY POSTURE ──────────────────────────
// Synthesizes: role distribution + grounding + reconciliation + domain registry
// Question: "What is the structural health of this system's topology?"

function deriveOperationalTopologyPosture(fullReport) {
  const se = fullReport.structural_enrichment || {}
  const ts = fullReport.topology_summary || {}
  const rs = fullReport.reconciliation_summary || {}
  const registry = fullReport.semantic_domain_registry || []

  const domainCount = ts.semantic_domain_count || registry.length || 0
  if (domainCount === 0) return null

  const groundingRatio = ts.grounding_ratio || (ts.structurally_backed_count && ts.semantic_domain_count
    ? ts.structurally_backed_count / ts.semantic_domain_count : 0)
  const backed = ts.structurally_backed_count || 0
  const semanticOnly = ts.semantic_only_count || 0

  let roleDistribution = 'unknown'
  let totalClassified = 0
  const roleBreakdown = {}
  if (se.available && se.centrality) {
    const roleSummary = se.centrality.role_summary || {}
    totalClassified = Object.values(roleSummary).reduce((a, b) => a + b, 0)
    const hubPct = totalClassified > 0 ? ((roleSummary.hub || 0) + (roleSummary.authority || 0)) / totalClassified : 0
    const leafPct = totalClassified > 0 ? (roleSummary.leaf || 0) / totalClassified : 0
    roleDistribution = hubPct > 0.25 ? 'hub-concentrated'
      : leafPct > 0.7 ? 'leaf-heavy'
      : 'balanced'
    for (const [role, count] of Object.entries(roleSummary)) {
      roleBreakdown[role] = { count, pct: totalClassified > 0 ? Math.round(count / totalClassified * 100) : 0 }
    }
  }

  const reconciled = rs.available ? (rs.reconciled_count || rs.aligned_count || 0) : 0
  const reconciliationRatio = rs.available && domainCount > 0 ? reconciled / domainCount : 0

  const severity = groundingRatio < 0.5 ? 'ELEVATED'
    : groundingRatio < 0.7 ? 'MODERATE'
    : 'LOW'

  const zoneAnchors = registry.filter(d => d.zone_anchor)

  return {
    surface_id: 'OPERATIONAL_TOPOLOGY',
    surface_name: 'Operational Topology Posture',
    severity,
    operational_summary: `${domainCount} domain${domainCount !== 1 ? 's' : ''} — ${backed} structurally grounded (${Math.round(groundingRatio * 100)}%), ${semanticOnly} semantic-only — topology ${roleDistribution}${totalClassified > 0 ? `, ${totalClassified} files classified` : ''}`,
    consequence: groundingRatio < 0.5
      ? 'Low grounding coverage means operational assessments rest on semantic inference — structural confirmation needed before deployment decisions'
      : groundingRatio < 0.7
        ? 'Partial grounding — topology assessments are advisory-qualified for ungrounded domains'
        : 'Topology has strong structural grounding — operational assessments carry structural authority',
    evidence_density: domainCount + totalClassified + (rs.available ? 1 : 0),
    affected_domains: zoneAnchors.map(d => d.domain_name || d.domain_id),
    constituents: {
      domain_count: domainCount,
      backed,
      semantic_only: semanticOnly,
      grounding_pct: Math.round(groundingRatio * 100),
      reconciliation_pct: Math.round(reconciliationRatio * 100),
      role_distribution: roleDistribution,
      role_breakdown: roleBreakdown,
      zone_anchors: zoneAnchors.length,
    },
    trace_sources: ['topology_summary', 'structural_enrichment.centrality', 'reconciliation_summary', 'semantic_domain_registry'],
  }
}

// ─── SURFACE: QUALIFICATION EXPOSURE ────────────────────────────────
// Synthesizes: governance lifecycle + proposition + revalidation + constitutional
// Question: "What governance gaps affect qualification progression?"

function deriveQualificationExposure(fullReport) {
  const gl = fullReport.governance_lifecycle || {}
  const pc = fullReport.proposition_corpus || {}
  const ri = fullReport.revalidation_intelligence || {}
  const ca = fullReport.constitutional_anchor || {}
  const ci = fullReport.convergence_intelligence || {}
  const cc = fullReport.chronicle_certification || {}
  const ei = fullReport.enrichment_intelligence || {}

  const artifacts = [
    { name: 'Governance Lifecycle', present: !!gl.available },
    { name: 'Proposition Corpus', present: !!pc.available },
    { name: 'Revalidation', present: !!ri.available },
    { name: 'Constitutional Anchor', present: !!ca.available },
    { name: 'Convergence Intelligence', present: !!ci.available },
    { name: 'Chronicle Certification', present: !!cc.available },
    { name: 'Enrichment Intelligence', present: !!ei.available },
  ]

  const presentCount = artifacts.filter(a => a.present).length
  const gaps = artifacts.filter(a => !a.present).map(a => a.name)
  const blockers = []

  if (gl.available && !gl.promotion_eligible && gl.hold_reason) {
    blockers.push(`advancement held: ${gl.hold_reason}`)
  }
  if (pc.available && pc.flagged_count > 0) {
    blockers.push(`${pc.flagged_count} proposition${pc.flagged_count !== 1 ? 's' : ''} flagged`)
  }
  if (ri.available && ri.failed > 0) {
    blockers.push(`${ri.failed} revalidation check${ri.failed !== 1 ? 's' : ''} failed`)
  }

  const severity = blockers.length >= 2 ? 'HIGH'
    : blockers.length >= 1 ? 'ELEVATED'
    : presentCount < 3 ? 'MODERATE'
    : 'LOW'

  const sLevel = gl.available ? gl.s_level : null

  return {
    surface_id: 'QUALIFICATION_EXPOSURE',
    surface_name: 'Qualification Exposure',
    severity,
    operational_summary: sLevel
      ? `Qualification at ${sLevel} — ${presentCount}/7 governance artifacts present${blockers.length > 0 ? `, ${blockers.length} blocker${blockers.length !== 1 ? 's' : ''}` : ''}`
      : `${presentCount}/7 governance artifacts present — no governance lifecycle established`,
    consequence: blockers.length > 0
      ? `Qualification progression blocked: ${blockers.join('; ')}`
      : gaps.length > 0
        ? `Missing governance artifacts (${gaps.slice(0, 3).join(', ')}${gaps.length > 3 ? `, +${gaps.length - 3} more` : ''}) limit qualification depth`
        : 'Governance artifacts fully present — qualification progression unblocked',
    evidence_density: presentCount + blockers.length,
    affected_domains: [],
    constituents: {
      s_level: sLevel,
      promotion_eligible: gl.available ? gl.promotion_eligible : null,
      authority_ceiling: gl.available ? gl.authority_ceiling : null,
      artifacts_present: presentCount,
      artifacts_total: 7,
      gaps,
      blockers,
    },
    trace_sources: ['governance_lifecycle', 'proposition_corpus', 'revalidation_intelligence', 'constitutional_anchor', 'convergence_intelligence', 'chronicle_certification', 'enrichment_intelligence'],
  }
}

// ─── SURFACE: PROPAGATION RISK ──────────────────────────────────────
// Synthesizes: evidence block flow chain + signal co-presence + concentration
// Question: "How does pressure propagate through the system?"

function derivePropagationRisk(fullReport) {
  const blocks = fullReport.evidence_blocks || []
  const sigs = (fullReport.signal_interpretations || []).filter(isActivated)
  const ps = fullReport.propagation_summary || {}

  if (blocks.length === 0) return null

  const origins = blocks.filter(b => b.propagation_role === 'ORIGIN')
  const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
  const receivers = blocks.filter(b => b.propagation_role === 'RECEIVER')

  const coPresenceSigs = sigs.filter(s => s.co_presence && s.co_presence.length > 0)
  const concentratedSigs = sigs.filter(s => s.concentration)

  const chainLength = origins.length + passThroughs.length + receivers.length
  const severity = (origins.length >= 2 && receivers.length >= 2) ? 'HIGH'
    : (origins.length >= 1 && passThroughs.length >= 1 && receivers.length >= 1) ? 'ELEVATED'
    : chainLength > 2 ? 'MODERATE'
    : 'LOW'

  const chain = [
    ...origins.map(o => ({ domain: o.domain_alias, role: 'ORIGIN', grounding: o.grounding_status })),
    ...passThroughs.map(p => ({ domain: p.domain_alias, role: 'PASS_THROUGH', grounding: p.grounding_status })),
    ...receivers.map(r => ({ domain: r.domain_alias, role: 'RECEIVER', grounding: r.grounding_status })),
  ]

  const concentrationPattern = concentratedSigs.length > sigs.length * 0.5 ? 'concentrated' : 'distributed'

  return {
    surface_id: 'PROPAGATION_RISK',
    surface_name: 'Propagation Risk',
    severity,
    operational_summary: passThroughs.length > 0
      ? `Pressure propagates from ${origins.length} origin${origins.length !== 1 ? 's' : ''} through ${passThroughs.length} corridor${passThroughs.length !== 1 ? 's' : ''} to ${receivers.length} receiver${receivers.length !== 1 ? 's' : ''} — signal concentration ${concentrationPattern}`
      : `Pressure propagates directly from ${origins.length} origin${origins.length !== 1 ? 's' : ''} to ${receivers.length} receiver${receivers.length !== 1 ? 's' : ''} — no intermediate corridors detected, signal concentration ${concentrationPattern}`,
    consequence: severity === 'HIGH' || severity === 'ELEVATED'
      ? 'Multi-domain pressure propagation active — changes at origins amplify through corridors to receivers'
      : 'Pressure propagation paths present but not under elevated structural load',
    evidence_density: chainLength + coPresenceSigs.length,
    affected_domains: chain.map(c => c.domain),
    constituents: {
      chain,
      origins: origins.length,
      pass_throughs: passThroughs.length,
      receivers: receivers.length,
      co_presence_signals: coPresenceSigs.length,
      concentration_pattern: concentrationPattern,
    },
    trace_sources: ['evidence_blocks', 'signal_interpretations', 'propagation_summary'],
  }
}

// ─── QUALIFICATION DECOMPOSITION (preserved — already compressed) ───

const SW_INTEL_ROLE_MAP = {
  hub: 'runtime coordination hub',
  spine: 'structural spine',
  leaf: 'peripheral module',
  bridge: 'cross-domain bridge',
  isolate: 'isolated component',
  authority: 'authority node',
  connector: 'integration connector',
}

function deriveStructuralRichnessAxis(fullReport) {
  const se = fullReport.structural_enrichment || {}
  const ts = fullReport.topology_summary || {}
  const sigs = fullReport.signal_interpretations || []

  const substrates = [
    { name: 'Code Graph (40.3s)', present: !!(se.available && se.code_graph), detail: se.available && se.code_graph ? `${se.code_graph.total_import_edges || 0} import edges, ${se.code_graph.total_classes || 0} classes` : null },
    { name: 'Structural Centrality (40.3c)', present: !!(se.available && se.centrality), detail: se.available && se.centrality ? `${Object.values(se.centrality.role_summary || {}).reduce((a, b) => a + b, 0)} files classified` : null },
    { name: 'Signal Registry', present: sigs.length > 0, detail: sigs.length > 0 ? `${sigs.length} signals loaded` : null },
    { name: 'Semantic Domain Registry', present: !!(ts.semantic_domain_count && ts.semantic_domain_count > 0), detail: ts.semantic_domain_count ? `${ts.semantic_domain_count} domains` : null },
  ]

  const presentCount = substrates.filter(s => s.present).length
  const families = new Set(sigs.map(s => s.signal_family || 'DPSIG'))
  const activated = sigs.filter(isActivated)

  let level = 'MINIMAL'
  if (presentCount >= 4) level = 'FULL'
  else if (presentCount >= 2) level = 'PARTIAL'

  return { axis: 'STRUCTURAL_RICHNESS', level, substrates, present_count: presentCount, total_count: substrates.length, signal_families: { total: sigs.length, activated: activated.length, families: [...families] }, domain_count: ts.semantic_domain_count || 0 }
}

function deriveGovernanceDepthAxis(fullReport) {
  const gl = fullReport.governance_lifecycle || {}
  const pc = fullReport.proposition_corpus || {}
  const ri = fullReport.revalidation_intelligence || {}
  const ca = fullReport.constitutional_anchor || {}
  const ci = fullReport.convergence_intelligence || {}
  const cc = fullReport.chronicle_certification || {}
  const ei = fullReport.enrichment_intelligence || {}

  const artifacts = [
    { name: 'Governance Lifecycle', present: !!gl.available, detail: gl.available ? `${gl.s_level}, ${gl.transition_count || 0} transition${(gl.transition_count || 0) !== 1 ? 's' : ''}` : null },
    { name: 'Proposition Corpus', present: !!pc.available, detail: pc.available ? `${pc.total || 0} propositions, ${pc.disposition_counts?.accepted || 0} accepted` : null },
    { name: 'Revalidation', present: !!ri.available, detail: ri.available ? `${ri.passed || 0}/${ri.total_checks || 0} ${ri.status || ''}` : null },
    { name: 'Constitutional Anchor', present: !!ca.available, detail: ca.available ? `${ca.status || 'UNKNOWN'}, ${(ca.dimensions || []).length} dimensions` : null },
    { name: 'Convergence Intelligence', present: !!ci.available, detail: ci.available ? `${ci.total_observations || 0} observations` : null },
    { name: 'Chronicle Certification', present: !!cc.available, detail: cc.available ? `${cc.passed || 0}/${cc.total_checks || 0} ${cc.certification_status || ''}` : null },
    { name: 'Enrichment Intelligence', present: !!ei.available, detail: ei.available ? `${ei.enrichment_events || 0} events, ${ei.domains_corrected || 0} corrected` : null },
  ]

  const presentCount = artifacts.filter(a => a.present).length
  let level = 'NONE'
  if (presentCount >= 6) level = 'FULL'
  else if (presentCount >= 3) level = 'EXERCISED'
  else if (presentCount >= 1) level = 'MINIMAL'

  return { axis: 'GOVERNANCE_DEPTH', level, artifacts, present_count: presentCount, total_count: artifacts.length, s_level: gl.available ? gl.s_level : null, transition_count: gl.available ? (gl.transition_count || 0) : 0 }
}

function deriveReconciliationAuthorityAxis(fullReport) {
  const rs = fullReport.reconciliation_summary || {}
  const qs = fullReport.qualifier_summary || {}
  const ts = fullReport.topology_summary || {}

  const reconciled = rs.available ? (rs.reconciled_count || rs.aligned_count || 0) : 0
  const total = rs.available ? (rs.total_semantic_domains || ts.semantic_domain_count || 0) : (ts.semantic_domain_count || 0)
  const ratio = total > 0 ? reconciled / total : 0
  const weightedConfidence = rs.available ? (rs.weighted_confidence_score || 0) : 0

  const qClass = qs.qualifier_class || fullReport.qualifier_class || 'Q-01'
  const qClassDisplay = qs.derived_qualifier_class || qs.qualifier_class_compat || qClass

  let level = 'UNAVAILABLE'
  if (!rs.available) level = 'UNAVAILABLE'
  else if (ratio >= 0.8) level = 'RECONCILED'
  else if (ratio > 0) level = 'PARTIAL'
  else level = 'UNRECONCILED'

  return { axis: 'RECONCILIATION_AUTHORITY', level, reconciled_count: reconciled, total_domains: total, reconciliation_ratio: Math.round(ratio * 100), weighted_confidence: Math.round(weightedConfidence * 10) / 10, q_class: qClass, q_class_display: qClassDisplay, q_label: qs.qualifier_label || null, available: !!rs.available }
}

function deriveQualificationGuidance(fullReport) {
  const guidance = []
  const gl = fullReport.governance_lifecycle || {}
  const pc = fullReport.proposition_corpus || {}
  const rs = fullReport.reconciliation_summary || {}
  const se = fullReport.structural_enrichment || {}
  const ri = fullReport.revalidation_intelligence || {}
  const ts = fullReport.topology_summary || {}

  if (!gl.available) {
    guidance.push({ condition: 'No governance lifecycle artifacts present', action: 'SQO governance lifecycle not exercised — promotion state, transitions, and authority ceiling unavailable', priority: 'MEDIUM', axis: 'GOVERNANCE_DEPTH' })
  }
  if (!pc.available) {
    guidance.push({ condition: 'No proposition corpus', action: 'Semantic propositions not derived — governed structural claims not produced for this run', priority: 'MEDIUM', axis: 'GOVERNANCE_DEPTH' })
  }
  if (!rs.available) {
    guidance.push({ condition: 'Reconciliation unavailable', action: 'Crosswalk translation required before reconciliation can assess structural backing of semantic domains', priority: 'HIGH', axis: 'RECONCILIATION_AUTHORITY' })
  } else {
    const reconciled = rs.reconciled_count || rs.aligned_count || 0
    const total = rs.total_semantic_domains || ts.semantic_domain_count || 0
    const unreconciled = total - reconciled
    if (unreconciled > 0) {
      guidance.push({ condition: `${unreconciled} of ${total} domains unreconciled`, action: `Structural backing required for ${unreconciled} domain${unreconciled !== 1 ? 's' : ''} — advisory confirmation mandatory before executive commitment`, priority: unreconciled > total * 0.5 ? 'HIGH' : 'MEDIUM', axis: 'RECONCILIATION_AUTHORITY' })
    }
  }
  if (!se.available) {
    guidance.push({ condition: 'No code graph or structural centrality', action: 'Code graph enrichment (40.3s) and structural centrality (40.3c) not available — file-level structural intelligence absent', priority: 'LOW', axis: 'STRUCTURAL_RICHNESS' })
  }
  if (gl.available && !gl.promotion_eligible && gl.hold_reason) {
    guidance.push({ condition: `Advancement held: ${gl.hold_reason}`, action: `Qualification at ${gl.s_level} — advancement held, resolution required before progression`, priority: 'MEDIUM', axis: 'GOVERNANCE_DEPTH' })
  }
  if (pc.available && pc.flagged_count > 0) {
    guidance.push({ condition: `${pc.flagged_count} proposition${pc.flagged_count !== 1 ? 's' : ''} flagged`, action: 'Flagged propositions require operator review before qualification progression', priority: 'HIGH', axis: 'GOVERNANCE_DEPTH' })
  }
  if (ri.available && ri.failed > 0) {
    guidance.push({ condition: `Revalidation: ${ri.failed} check${ri.failed !== 1 ? 's' : ''} failed`, action: `Revalidation detected ${ri.failed} failure${ri.failed !== 1 ? 's' : ''} — substrate does not replay cleanly under structural rigor`, priority: 'HIGH', axis: 'GOVERNANCE_DEPTH' })
  }

  return guidance.sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3)
  })
}

// ─── ORCHESTRATION BACKWARD COMPATIBILITY ───────────────────────────
// OrchestrationGuidanceRuntime reads execution_corridors for suspect receiver detection

function deriveExecutionCorridors(fullReport) {
  const blocks = fullReport.evidence_blocks
  if (!blocks || !blocks.length) return []
  return blocks.map(block => ({
    domain: block.domain_alias,
    role: block.propagation_role,
    grounding: block.grounding_status,
    operational_description:
      block.propagation_role === 'ORIGIN'
        ? `Pressure originates from "${block.domain_alias}" — delivery-critical path`
        : block.propagation_role === 'PASS_THROUGH'
          ? `"${block.domain_alias}" conducts pressure — coordination corridor`
          : `"${block.domain_alias}" absorbs downstream pressure — receiver exposure`,
  }))
}

function deriveQualificationCognition(fullReport) {
  const gl = fullReport.governance_lifecycle || {}
  const rs = fullReport.readiness_summary || {}
  if (!gl.available) return null
  return {
    s_level: gl.s_level,
    authority_ceiling: gl.authority_ceiling || null,
    promotion_eligible: gl.promotion_eligible,
    operational_statement: gl.promotion_eligible
      ? `Qualification at ${gl.s_level} — eligible for advancement to ceiling ${gl.authority_ceiling || 'unknown'}`
      : `Qualification at ${gl.s_level} — advancement ${gl.hold_reason ? 'held: ' + gl.hold_reason : 'not eligible'}`,
    governance_maturity: { transition_count: gl.transition_count || 0, last_updated: gl.last_updated || null },
  }
}

// ─── MAIN PROJECTION ────────────────────────────────────────────────

function deriveProjection(fullReport) {
  const moduleState = deriveModuleState(fullReport)

  if (moduleState === PROJECTION_STATUS.ABSENT) {
    return {
      projection_type: 'COMPRESSED_SW_INTEL_COGNITION',
      module_state: PROJECTION_STATUS.ABSENT,
      reason: 'Insufficient structural data for software intelligence projection',
      surfaces: [],
      qualification_decomposition: null,
      qualification_cognition: null,
      execution_corridors: [],
    }
  }

  const rawSurfaces = [
    deriveDeliveryFragility(fullReport),
    deriveCoordinationSaturation(fullReport),
    deriveIntegrationExposure(fullReport),
    deriveOperationalTopologyPosture(fullReport),
    deriveQualificationExposure(fullReport),
    derivePropagationRisk(fullReport),
  ].filter(Boolean)

  const surfaces = rawSurfaces.sort((a, b) =>
    (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5)
  )

  return {
    projection_type: 'COMPRESSED_SW_INTEL_COGNITION',
    module_state: moduleState,
    surfaces,
    surface_count: surfaces.length,
    peak_severity: surfaces.length > 0 ? surfaces[0].severity : 'NOMINAL',
    qualification_decomposition: {
      structural_richness: deriveStructuralRichnessAxis(fullReport),
      governance_depth: deriveGovernanceDepthAxis(fullReport),
      reconciliation_authority: deriveReconciliationAuthorityAxis(fullReport),
      guidance: deriveQualificationGuidance(fullReport),
    },
    qualification_cognition: deriveQualificationCognition(fullReport),
    execution_corridors: deriveExecutionCorridors(fullReport),
  }
}

// ─── TOPOLOGY COGNITION STATE ──────────────────────────────────────
// Produces overlay state for the SVG topology when a SW-Intel surface is active.
// The topology becomes the cognition canvas — this object drives what changes.

function deriveTopologyCognitionState(activeSurfaceId, fullReport, resolvedSurface) {
  if (!activeSurfaceId || !fullReport || !resolvedSurface) return null

  const sigs = (fullReport.signal_interpretations || []).filter(isActivated)
  const blocks = fullReport.evidence_blocks || []
  const se = fullReport.structural_enrichment || {}
  const registry = fullReport.semantic_domain_registry || []
  const pzState = fullReport.pressure_zone_state || {}
  const zones = pzState.zones || []

  const domainIdSet = new Set(registry.map(d => d.domain_id))
  const backedDomains = new Set(registry.filter(d => d.structurally_backed).map(d => d.domain_id))
  const semanticOnlyDomains = new Set(registry.filter(d => d.semantic_only || (!d.structurally_backed && d.lineage_status !== 'PARTIAL')).map(d => d.domain_id))
  const zoneAnchorDomains = new Set(registry.filter(d => d.zone_anchor).map(d => d.domain_id))

  const base = {
    active_surface: activeSurfaceId,
    overlay_mode: null,
    emphasis_domains: [],
    dim_domains: [],
    signal_overlays: [],
    pressure_zone_emphasis: null,
    corridor_paths: [],
    advisory_zones: [],
    grounding_gradient: null,
    evidence_gaps: [],
    topology_label: null,
    legend_entries: [],
  }

  if (activeSurfaceId === 'INTEGRATION_EXPOSURE') {
    const isigSigs = sigs.filter(s => s.signal_family === 'ISIG')
    const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
    const spines = (se.available && se.centrality) ? (se.centrality.top_structural_spines || []) : []
    const bridges = spines.filter(s => s.structural_role === 'bridge' || s.structural_role === 'connector')
    const mode = resolvedSurface.evidence_mode || 'EVIDENCE_GAP'

    const signalOverlays = isigSigs.map(s => ({
      signal_id: s.signal_id,
      signal_name: s.signal_name,
      severity: s.severity,
      type: 'import_pressure',
      source_entity: s.concentration || null,
      affected_domain: null,
    }))

    const ptDomainIds = passThroughs.map(p => {
      const match = registry.find(d => d.domain_name === p.domain_alias || d.business_label === p.domain_alias)
      return match ? match.domain_id : null
    }).filter(Boolean)

    const bridgeDomainIds = bridges.map(b => {
      const pathTail = b.path.split('/').slice(-2).join('/')
      const match = registry.find(d => (d.domain_name || '').includes(pathTail) || (d.business_label || '').includes(pathTail))
      return match ? match.domain_id : null
    }).filter(Boolean)

    const emphasisIds = [...new Set([...ptDomainIds, ...bridgeDomainIds, ...Array.from(zoneAnchorDomains)])]
    const dimIds = Array.from(domainIdSet).filter(id => !emphasisIds.includes(id))

    base.overlay_mode = mode === 'IMPORT_SIGNAL_DRIVEN' ? 'IMPORT_PRESSURE' : mode === 'TOPOLOGY_DRIVEN' ? 'INTEGRATION_CORRIDOR' : mode === 'MIXED' ? 'INTEGRATION_MIXED' : 'EVIDENCE_GAP'
    base.emphasis_domains = emphasisIds
    base.dim_domains = emphasisIds.length > 0 ? dimIds : []
    base.signal_overlays = signalOverlays
    base.advisory_zones = mode === 'IMPORT_SIGNAL_DRIVEN' ? Array.from(domainIdSet) : Array.from(semanticOnlyDomains)
    base.evidence_gaps = mode === 'IMPORT_SIGNAL_DRIVEN'
      ? [{ type: 'CORRIDOR_TOPOLOGY_UNRESOLVED', label: 'Integration corridor topology not resolved' }]
      : []
    base.topology_label = mode === 'IMPORT_SIGNAL_DRIVEN'
      ? 'IMPORT DEPENDENCY PRESSURE (ADVISORY-BOUND)'
      : 'INTEGRATION EXPOSURE'
    base.legend_entries = [
      ...(isigSigs.length > 0 ? [{ color: '#ff9e4a', label: `ISIG Signal (${isigSigs.length})`, style: 'pulse' }] : []),
      ...(bridges.length > 0 ? [{ color: '#4a9eff', label: `Bridge Node (${bridges.length})`, style: 'solid' }] : []),
      ...(ptDomainIds.length > 0 ? [{ color: '#ffd700', label: `Pass-Through (${ptDomainIds.length})`, style: 'dashed' }] : []),
      ...(mode === 'IMPORT_SIGNAL_DRIVEN' ? [{ color: '#5e6d8a', label: 'Corridor Unresolved', style: 'dotted' }] : []),
    ]
  }

  else if (activeSurfaceId === 'DELIVERY_FRAGILITY') {
    const origins = blocks.filter(b => b.propagation_role === 'ORIGIN')
    const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
    const receivers = blocks.filter(b => b.propagation_role === 'RECEIVER')
    const highSigs = sigs.filter(s => s.severity === 'HIGH' || s.severity === 'ELEVATED')

    const resolveDomainId = (alias) => {
      const match = registry.find(d => d.domain_name === alias || d.business_label === alias)
      return match ? match.domain_id : null
    }

    const originIds = origins.map(o => resolveDomainId(o.domain_alias)).filter(Boolean)
    const ptIds = passThroughs.map(p => resolveDomainId(p.domain_alias)).filter(Boolean)
    const receiverIds = receivers.map(r => resolveDomainId(r.domain_alias)).filter(Boolean)
    const corridorIds = [...new Set([...originIds, ...ptIds, ...receiverIds])]
    const dimIds = Array.from(domainIdSet).filter(id => !corridorIds.includes(id))

    const corridorPaths = []
    if (originIds.length > 0 && (ptIds.length > 0 || receiverIds.length > 0)) {
      originIds.forEach(oid => {
        const targets = ptIds.length > 0 ? ptIds : receiverIds
        targets.forEach(tid => {
          corridorPaths.push({ from: oid, to: tid, type: 'pressure_propagation' })
        })
      })
      if (ptIds.length > 0 && receiverIds.length > 0) {
        ptIds.forEach(pid => {
          receiverIds.forEach(rid => {
            corridorPaths.push({ from: pid, to: rid, type: 'pressure_propagation' })
          })
        })
      }
    }

    base.overlay_mode = 'DELIVERY_FRAGILITY'
    base.emphasis_domains = corridorIds
    base.dim_domains = dimIds
    base.signal_overlays = highSigs.map(s => ({ signal_id: s.signal_id, signal_name: s.signal_name, severity: s.severity, type: 'pressure' }))
    base.corridor_paths = corridorPaths
    base.pressure_zone_emphasis = zones.length > 0 ? zones[0].zone_id : null
    base.advisory_zones = Array.from(semanticOnlyDomains)
    base.topology_label = 'DELIVERY FRAGILITY'
    base.legend_entries = [
      ...(originIds.length > 0 ? [{ color: '#ff6b6b', label: `Origin (${originIds.length})`, style: 'solid' }] : []),
      ...(ptIds.length > 0 ? [{ color: '#ffd700', label: `Corridor (${ptIds.length})`, style: 'dashed' }] : []),
      ...(receiverIds.length > 0 ? [{ color: '#ff9e4a', label: `Receiver (${receiverIds.length})`, style: 'solid' }] : []),
      ...(highSigs.length > 0 ? [{ color: '#ff6b6b', label: `Elevated Signal (${highSigs.length})`, style: 'pulse' }] : []),
    ]
  }

  else if (activeSurfaceId === 'COORDINATION_SATURATION') {
    const spines = (se.available && se.centrality) ? (se.centrality.top_structural_spines || []) : []
    const hubs = spines.filter(s => s.structural_role === 'hub' || s.structural_role === 'authority')
    const hubDomainIds = hubs.map(h => {
      const pathTail = h.path.split('/').slice(-2).join('/')
      const match = registry.find(d => (d.domain_name || '').includes(pathTail) || (d.business_label || '').includes(pathTail))
      return match ? match.domain_id : null
    }).filter(Boolean)

    base.overlay_mode = 'COORDINATION_LOAD'
    base.emphasis_domains = hubDomainIds.length > 0 ? hubDomainIds : Array.from(zoneAnchorDomains)
    base.dim_domains = Array.from(domainIdSet).filter(id => !base.emphasis_domains.includes(id))
    base.topology_label = 'COORDINATION LOAD'
    base.legend_entries = [
      ...(hubDomainIds.length > 0 ? [{ color: '#4a9eff', label: `Hub/Authority (${hubDomainIds.length})`, style: 'solid' }] : []),
    ]
  }

  else if (activeSurfaceId === 'OPERATIONAL_TOPOLOGY') {
    base.overlay_mode = 'TOPOLOGY_POSTURE'
    base.grounding_gradient = true
    base.advisory_zones = Array.from(semanticOnlyDomains)
    base.topology_label = 'TOPOLOGY POSTURE'
    base.legend_entries = [
      { color: '#64ffda', label: 'Grounded', style: 'solid' },
      { color: '#d29922', label: 'Weakly Grounded', style: 'solid' },
      { color: '#8b949e', label: 'Semantic-Only', style: 'dashed' },
    ]
  }

  else if (activeSurfaceId === 'QUALIFICATION_EXPOSURE') {
    const gl = fullReport.governance_lifecycle || {}
    base.overlay_mode = 'QUALIFICATION_POSTURE'
    base.grounding_gradient = true
    base.advisory_zones = Array.from(semanticOnlyDomains)
    base.topology_label = gl.available ? `QUALIFICATION POSTURE — ${gl.s_level}` : 'QUALIFICATION POSTURE'
    base.legend_entries = [
      { color: '#64ffda', label: 'Governed & Grounded', style: 'solid' },
      { color: '#8b949e', label: 'Ungrounded Trust', style: 'dashed' },
    ]
  }

  else if (activeSurfaceId === 'PROPAGATION_RISK') {
    const origins = blocks.filter(b => b.propagation_role === 'ORIGIN')
    const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
    const receivers = blocks.filter(b => b.propagation_role === 'RECEIVER')

    const resolveDomainId = (alias) => {
      const match = registry.find(d => d.domain_name === alias || d.business_label === alias)
      return match ? match.domain_id : null
    }

    const originIds = origins.map(o => resolveDomainId(o.domain_alias)).filter(Boolean)
    const ptIds = passThroughs.map(p => resolveDomainId(p.domain_alias)).filter(Boolean)
    const receiverIds = receivers.map(r => resolveDomainId(r.domain_alias)).filter(Boolean)
    const allIds = [...new Set([...originIds, ...ptIds, ...receiverIds])]

    const corridorPaths = []
    originIds.forEach(oid => {
      const next = ptIds.length > 0 ? ptIds : receiverIds
      next.forEach(tid => corridorPaths.push({ from: oid, to: tid, type: 'propagation' }))
    })
    if (ptIds.length > 0 && receiverIds.length > 0) {
      ptIds.forEach(pid => receiverIds.forEach(rid => corridorPaths.push({ from: pid, to: rid, type: 'propagation' })))
    }

    base.overlay_mode = 'PROPAGATION_RISK'
    base.emphasis_domains = allIds
    base.dim_domains = Array.from(domainIdSet).filter(id => !allIds.includes(id))
    base.corridor_paths = corridorPaths
    base.topology_label = 'PROPAGATION RISK'
    base.legend_entries = [
      ...(originIds.length > 0 ? [{ color: '#ff6b6b', label: `Origin (${originIds.length})`, style: 'solid' }] : []),
      ...(ptIds.length > 0 ? [{ color: '#ffd700', label: `Pass-Through (${ptIds.length})`, style: 'dashed' }] : []),
      ...(receiverIds.length > 0 ? [{ color: '#ff9e4a', label: `Receiver (${receiverIds.length})`, style: 'solid' }] : []),
    ]
  }

  return base
}

// ─── PRESSURE ZONE COGNITION STATE ─────────────────────────────────
// Produces overlay state for the SVG topology when a pressure zone is activated.
// Orthogonal to surface activation — the zone itself is a cognition trigger.

function derivePressureZoneCognitionState(zoneId, fullReport) {
  if (!zoneId || !fullReport) return null

  const pzState = fullReport.pressure_zone_state || {}
  const zones = pzState.zones || []
  const zone = zones.find(z => z.zone_id === zoneId)
  if (!zone) return null

  const registry = fullReport.semantic_domain_registry || []
  const sigs = fullReport.signal_interpretations || []
  const domainIdSet = new Set(registry.map(d => d.domain_id))

  function resolveToRegistryId(entityId) {
    if (domainIdSet.has(entityId)) return entityId
    if (/^DOM-\d+$/.test(entityId)) {
      const byDomDom = registry.find(d => d.dominant_dom_id === entityId)
      if (byDomDom) return byDomDom.domain_id
    }
    return null
  }

  const memberIds = (zone.member_entities || [])
    .map(m => resolveToRegistryId(m.entity_id))
    .filter(Boolean)

  const anchorId = resolveToRegistryId(zone.anchor_id)

  const contributingConditions = zone.aggregated_conditions || []
  const contributingSigs = sigs.filter(s =>
    contributingConditions.includes(s.signal_id)
  )

  const blindSpotEntities = pzState.structural_blind_spot_entities || []
  const blindSpots = blindSpotEntities
    .map(e => resolveToRegistryId(e.entity_id))
    .filter(Boolean)

  const emphasisIds = [...new Set([...memberIds, ...(anchorId ? [anchorId] : [])])]
  const dimIds = Array.from(domainIdSet).filter(id =>
    !emphasisIds.includes(id) && !blindSpots.includes(id)
  )

  const signalOverlays = contributingSigs.map(s => ({
    signal_id: s.signal_id,
    signal_name: s.signal_name,
    severity: s.activation_state || s.severity,
    type: 'pressure_condition',
    source_entity: s.concentration || null,
  }))

  return {
    active_surface: null,
    active_pressure_zone: zoneId,
    overlay_mode: 'PRESSURE_ZONE',
    emphasis_domains: emphasisIds,
    dim_domains: dimIds,
    signal_overlays: signalOverlays,
    pressure_zone_emphasis: zoneId,
    corridor_paths: [],
    advisory_zones: blindSpots,
    grounding_gradient: null,
    evidence_gaps: [],
    topology_label: `PRESSURE ZONE ${zoneId} · ${zone.zone_class.replace(/_/g, ' ')}`,
    legend_entries: [
      { color: '#ff6b6b', label: `Zone Anchor: ${zone.anchor_name || zone.anchor_id}`, style: 'solid' },
      ...contributingConditions.map(cond => {
        const translation = translateSignal(cond)
        return {
          color: '#ffd700',
          label: translation ? translation.l2 : cond,
          style: 'solid',
        }
      }),
      ...(blindSpots.length > 0 ? [{ color: '#5e6d8a', label: `Structural Blind Spot (${blindSpots.length})`, style: 'dashed' }] : []),
    ],
    zone_detail: {
      zone_id: zoneId,
      zone_class: zone.zone_class,
      anchor_id: zone.anchor_id,
      anchor_name: zone.anchor_name,
      condition_count: zone.condition_count,
      conditions: contributingConditions,
      embedded_pair_rules: zone.embedded_pair_rules || [],
      blind_spot_count: blindSpots.length,
    },
  }
}

// ─── CONDITION COGNITION STATE ────────────────────────────────────
// Promotes a synthesized condition's topology_overlay into the full
// overlay shape TopologyGraph consumes. This is the topology-first
// cognition behavior loop: condition activation → topology mutation.

const CONDITION_OVERLAY_SEVERITY_COLORS = {
  CRITICAL: '#ff6b6b',
  HIGH: '#ff6b6b',
  ELEVATED: '#ff9e4a',
  MODERATE: '#ffd700',
  LOW: '#7a8aaa',
  NOMINAL: '#64ffda',
}

const CONDITION_TYPE_LABELS = {
  DELIVERY_PRESSURE_CONCENTRATION: 'DELIVERY PRESSURE',
  DEPENDENCY_CHOKE_POINT: 'DEPENDENCY CHOKE POINT',
  PROPAGATION_ASYMMETRY: 'PROPAGATION ASYMMETRY',
  STRUCTURAL_MASS_CONCENTRATION: 'STRUCTURAL MASS',
  CROSS_DOMAIN_COUPLING_PRESSURE: 'COUPLING PRESSURE',
  GOVERNANCE_COVERAGE_STATUS: 'GOVERNANCE COVERAGE',
  COMPOUND_CONVERGENCE: 'COMPOUND CONVERGENCE',
}

function deriveConditionCognitionState(condition, fullReport) {
  if (!condition || !condition.topology_overlay) return null

  const overlay = condition.topology_overlay
  const registry = (fullReport && fullReport.semantic_domain_registry) || []
  const sevColor = CONDITION_OVERLAY_SEVERITY_COLORS[condition.severity] || '#ff9e4a'

  const targetDomains = (condition.shared_topology_targets && condition.shared_topology_targets.domains) || []
  const targetLabels = targetDomains.map(id => {
    const d = registry.find(r => r.domain_id === id)
    return d ? (d.business_label || d.domain_name || id) : id
  })

  const typeLabel = CONDITION_TYPE_LABELS[condition.condition_type] || condition.condition_type.replace(/_/g, ' ')
  const domainSuffix = targetLabels.length > 0 ? ' · ' + targetLabels[0] : ''

  const legendEntries = []

  if (targetLabels.length > 0) {
    legendEntries.push({
      color: sevColor,
      label: targetLabels[0],
      style: 'solid',
    })
  }

  if (condition.condition_type === 'COMPOUND_CONVERGENCE' && condition.contributing_condition_ids) {
    legendEntries.push({
      color: '#ffd700',
      label: condition.contributing_condition_ids.length + ' converging conditions',
      style: 'solid',
    })
  }

  const signalOverlays = overlay.signal_overlays || []
  if (signalOverlays.length > 0 && condition.condition_type !== 'COMPOUND_CONVERGENCE') {
    if (overlay.overlay_mode === 'CLUSTER_PRESSURE') {
      const dpsigSummary = (fullReport && fullReport.dpsig_signal_summary) || {}
      const nb = dpsigSummary.normalization_basis || {}
      const clusterName = nb.max_cluster_name || 'dominant cluster'
      const nodeCount = nb.max_cluster_node_count || 0
      const totalNodes = (dpsigSummary.derivation_context && dpsigSummary.derivation_context.total_structural_nodes) || 0
      legendEntries.push({
        color: '#ffd700',
        label: clusterName + (nodeCount > 0 && totalNodes > 0 ? ' · ' + (nodeCount / totalNodes * 100).toFixed(0) + '% mass' : ''),
        style: 'solid',
      })
    } else {
      const translated = translateSignal(signalOverlays[0].signal_id)
      legendEntries.push({
        color: '#ffd700',
        label: translated ? translated.l2 : signalOverlays[0].signal_name || signalOverlays[0].signal_id,
        style: 'solid',
      })
    }
  }

  const corridors = overlay.corridor_paths || []
  const evidenceCorridors = corridors.filter(c => c.evidence === 'semantic_topology_edge')
  const centralityCorridors = corridors.filter(c => c.evidence === 'structural_centrality' || c.evidence === 'signal_metric')
  if (evidenceCorridors.length > 0) {
    const resolveName = (id) => {
      const d = registry.find(r => r.domain_id === id)
      return d ? (d.business_label || d.domain_name || id) : id
    }
    const inbound = evidenceCorridors.filter(c => c.type === 'import_consumer')
    const outbound = evidenceCorridors.filter(c => c.type === 'import_hub_outbound')
    const propagationOut = evidenceCorridors.filter(c => c.type === 'propagation_outbound')
    for (const c of inbound) {
      legendEntries.push({
        color: '#ff9e4a',
        label: resolveName(c.from) + ' →',
        style: 'solid',
      })
    }
    for (const c of outbound) {
      legendEntries.push({
        color: '#4a9eff',
        label: '→ ' + resolveName(c.to),
        style: 'solid',
      })
    }
    for (const c of propagationOut) {
      legendEntries.push({
        color: '#64ffda',
        label: '⤑ ' + resolveName(c.to),
        style: 'solid',
      })
    }
  }
  if (centralityCorridors.length > 0 && evidenceCorridors.length === 0) {
    const metrics = overlay.propagation_metrics
    if (metrics && metrics.import_out_degree > 0) {
      legendEntries.push({
        color: '#64ffda',
        label: metrics.import_out_degree + ' outbound · ' + (metrics.fan_out_ratio > 0 ? metrics.fan_out_ratio.toFixed(1) + ':1' : 'asymmetric'),
        style: 'solid',
      })
    }
  }

  if ((overlay.advisory_zones || []).length > 0) {
    legendEntries.push({
      color: '#5e6d8a',
      label: 'Advisory (' + overlay.advisory_zones.length + ')',
      style: 'dashed',
    })
  }

  const pzIds = condition.pressure_zone_ids || []

  return {
    active_surface: null,
    active_pressure_zone: pzIds[0] || null,
    active_condition_id: condition.condition_id,
    overlay_mode: overlay.overlay_mode,
    emphasis_domains: overlay.emphasis_domains || [],
    dim_domains: overlay.dim_domains || [],
    signal_overlays: overlay.signal_overlays || [],
    pressure_zone_emphasis: pzIds[0] || null,
    corridor_paths: overlay.corridor_paths || [],
    advisory_zones: overlay.advisory_zones || [],
    grounding_gradient: null,
    evidence_gaps: [],
    topology_label: typeLabel + domainSuffix,
    legend_entries: legendEntries,
  }
}

module.exports = { deriveProjection, deriveModuleState, deriveTopologyCognitionState, derivePressureZoneCognitionState, deriveConditionCognitionState, translateSignal, SIGNAL_COGNITION_MAP, PROJECTION_STATUS, SURFACE_CONDITION_MAP }

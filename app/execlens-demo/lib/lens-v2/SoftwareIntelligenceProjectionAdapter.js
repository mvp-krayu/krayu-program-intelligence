'use strict'

/**
 * SoftwareIntelligenceProjectionAdapter — PRE (Projection Rendering Engine)
 *
 * All 12 SW-Intel cognition surfaces are consumed from PICR-materialized PICP payload.
 * This adapter projects, sorts, filters, and renders — it does not derive cognition.
 * Cognition formation lives in cognition/materializers/*.js via PICRRuntime.
 */

const { materialize: materializePICR, assembleCIP, getSwIntelSurface } = require('./cognition/PICRRuntime')

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
  STRUCTURAL_COUPLING: ['COUPLING_INERTIA'],
  REINFORCEMENT_FLOWS: [],
  CONVERGENCE_PATTERNS: ['COMPOUND_CONVERGENCE'],
  ABSENCE_PROFILE: [],
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

// ─── CONSEQUENCE → SURFACE BRIDGE ────────────────────────────────────
// Converts consequence/cognition objects into surface-compatible shapes
// for LENS DENSE/OPERATOR rendering. This is the authoritative projection
// path: consequences are the source of truth; surfaces are the rendering shape.
// Legacy surface constituents are joined as evidence-detail payload.

const CONSEQUENCE_SURFACE_NAMES = {
  COORD_FRAG: 'Coordination Fragility',
  DEP_AMP: 'Dependency Amplification',
  DEL_EXP: 'Delivery Exposure',
  OP_BOTTLENECK: 'Operational Bottleneck',
  RESIL_DEF: 'Resilience Deficit',
  GOV_GAP: 'Governance Coverage Gap',
  PROP_EXP: 'Propagation Exposure',
  STAB_RISK: 'Structural Stability Risk',
}

const CONDITION_TO_LEGACY_SURFACE = {
  DELIVERY_PRESSURE_CONCENTRATION: 'DELIVERY_FRAGILITY',
  DEPENDENCY_CHOKE_POINT: 'COORDINATION_SATURATION',
  PROPAGATION_ASYMMETRY: 'PROPAGATION_RISK',
  STRUCTURAL_MASS_CONCENTRATION: 'OPERATIONAL_TOPOLOGY',
  CROSS_DOMAIN_COUPLING_PRESSURE: 'INTEGRATION_EXPOSURE',
  EXECUTION_FRAGILITY: 'STRUCTURAL_FRAGILITY',
  EXECUTION_CONSTRICTION: 'COORDINATION_SATURATION',
  STRUCTURAL_BOUNDARY_DIVERGENCE: 'BOUNDARY_ALIGNMENT',
  COUPLING_INERTIA: 'STRUCTURAL_COUPLING',
  GOVERNANCE_COVERAGE_STATUS: 'QUALIFICATION_EXPOSURE',
}

function consequencesToSurfaces(consequenceResult, synthesisResult, legacySurfaces) {
  if (!consequenceResult) return []

  const legacyMap = {}
  for (const ls of (legacySurfaces || [])) {
    legacyMap[ls.surface_id] = ls
  }

  const consequences = consequenceResult.consequences || []
  const conditionMap = {}
  if (synthesisResult && synthesisResult.conditions) {
    for (const c of synthesisResult.conditions) {
      conditionMap[c.condition_id] = c
    }
  }

  return consequences
    .filter(csq => csq.severity !== 'NOMINAL')
    .map(csq => {
      const sourceConditions = (csq.source_conditions || [])
        .map(cid => conditionMap[cid])
        .filter(Boolean)
      const conditionTypes = sourceConditions.map(c => c.condition_type)
      const isRuntime = csq.visibility_layer === 'RUNTIME' || csq.visibility_layer === 'MIXED' || sourceConditions.some(c => c.evidence_mode === 'RUNTIME_EVIDENCE')

      const legacySurfaceId = conditionTypes.length > 0 ? CONDITION_TO_LEGACY_SURFACE[conditionTypes[0]] : null
      const legacyConstituents = legacySurfaceId && legacyMap[legacySurfaceId]
        ? legacyMap[legacySurfaceId].constituents
        : null

      const affectedDomains = sourceConditions.flatMap(c =>
        (c.shared_topology_targets && c.shared_topology_targets.domains) || []
      )

      return {
        surface_id: csq.consequence_id || ('csq-' + csq.consequence_type_id + '-' + csq.primary_locus),
        surface_name: csq.operator_consequence_title || CONSEQUENCE_SURFACE_NAMES[csq.consequence_type_id] || csq.consequence_type_id,
        severity: csq.severity,
        operational_summary: csq.operational_implication,
        consequence: csq.structural_consequence_label,
        affected_domains: [...new Set(affectedDomains)],
        evidence_density: (csq.source_conditions || []).length + (csq.evidence_refs || []).length,
        _evidence_items: [
          ...(sourceConditions || []).map(sc => ({ type: 'condition', id: sc.condition_id, label: sc.operator_cognition_title || sc.condition_type, severity: sc.severity, domain: sc.shared_topology_targets?.domains_display?.[0] || sc.shared_topology_targets?.domains?.[0] || null })),
          ...(csq.evidence_refs || []).map(ref => ({ type: 'reference', id: typeof ref === 'string' ? ref : ref.id || '', label: typeof ref === 'string' ? ref : ref.condition_type || ref.id || 'evidence ref', severity: ref.severity || null, domain: null })),
        ],
        evidence_class: isRuntime ? (sourceConditions[0] && sourceConditions[0].evidence_class) || 'RUNTIME' : 'STATIC_IMPORT',
        evidence_mode: isRuntime ? 'RUNTIME_EVIDENCE' : 'STATIC_EVIDENCE',
        condition_type: conditionTypes[0] || null,
        condition_id: sourceConditions[0] ? sourceConditions[0].condition_id : null,
        source_consequence_id: csq.consequence_id,
        consequence_type_id: csq.consequence_type_id,
        confidence: csq.confidence,
        governance_boundary: csq.confidence,
        consequence_scope: csq.consequence_scope,
        combination_pattern: csq.combination_pattern || null,
        source_condition_types: csq.source_condition_types || (conditionTypes.length > 0 ? conditionTypes : null),
        is_combination: !!csq.combination_pattern,
        is_runtime: isRuntime,
        is_consequence_derived: true,
        constituents: legacyConstituents || (isRuntime ? {
          signal_value: sourceConditions[0] && sourceConditions[0].signal_value,
          measurement_basis: sourceConditions[0] && sourceConditions[0].measurement_basis,
          supporting_signals: sourceConditions[0] ? (sourceConditions[0].supporting_signal_ids || []) : [],
        } : null),
      }
    })
}

function deriveProjection(fullReport, synthesisResult, consequenceResult) {
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

  const cip = assembleCIP(fullReport)
  const picp = materializePICR(cip)

  const legacySurfaces = [
    getSwIntelSurface(picp, 'delivery_fragility'),
    getSwIntelSurface(picp, 'coordination_saturation'),
    getSwIntelSurface(picp, 'integration_exposure'),
    getSwIntelSurface(picp, 'topology_posture'),
    getSwIntelSurface(picp, 'qualification_exposure'),
    getSwIntelSurface(picp, 'propagation_risk'),
    getSwIntelSurface(picp, 'structural_fragility'),
    getSwIntelSurface(picp, 'boundary_alignment'),
    getSwIntelSurface(picp, 'structural_coupling'),
    getSwIntelSurface(picp, 'reinforcement_flows'),
    getSwIntelSurface(picp, 'convergence_patterns'),
    getSwIntelSurface(picp, 'sw_intel_absence'),
  ].filter(Boolean)

  let surfaces
  if (synthesisResult && consequenceResult) {
    surfaces = consequencesToSurfaces(consequenceResult, synthesisResult, legacySurfaces)
  } else {
    surfaces = legacySurfaces
  }

  surfaces.sort((a, b) =>
    (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5)
  )

  // Deduplicate surfaces by name — merge affected domains, keep highest severity
  const deduped = []
  const seen = {}
  for (const s of surfaces) {
    const key = s.surface_name
    if (seen[key]) {
      const existing = seen[key]
      if ((SEVERITY_ORDER[s.severity] ?? 5) < (SEVERITY_ORDER[existing.severity] ?? 5)) {
        existing.severity = s.severity
      }
      const newDomains = (s.affected_domains || []).filter(d => !(existing.affected_domains || []).includes(d))
      existing.affected_domains = [...(existing.affected_domains || []), ...newDomains]
      existing.evidence_density = (existing.evidence_density || 0) + (s.evidence_density || 0)
      existing._merged_count = (existing._merged_count || 1) + 1
    } else {
      const merged = { ...s, _merged_count: 1 }
      seen[key] = merged
      deduped.push(merged)
    }
  }
  surfaces = deduped

  const hasRuntimeConditions = synthesisResult && (synthesisResult.conditions || []).some(c =>
    ['EVENT_CONCENTRATION','RUNTIME_DEPENDENCY_CHOKE_POINT','BROKER_DEPENDENCY','TOPIC_FANOUT_PRESSURE','ASYNC_PROPAGATION_ASYMMETRY','EDGE_CLOUD_PROPAGATION_RISK','RUNTIME_OBSERVABILITY_GAP'].includes(c.condition_type)
  )
  if (hasRuntimeConditions) {
    surfaces.unshift(
      {
        surface_id: 'EXECUTION_BLINDNESS',
        surface_name: 'Execution Blindness',
        severity: 'CRITICAL',
        operational_summary: 'What can fail while the organization believes it is healthy',
        is_category_surface: true,
        is_runtime: true,
      },
      {
        surface_id: 'GRAVITY_DIVERGENCE',
        surface_name: 'Gravity Divergence',
        severity: 'CRITICAL',
        operational_summary: 'Where code gravity and operational gravity diverge',
        is_category_surface: true,
        is_runtime: true,
      },
    )
  }

  return {
    projection_type: 'COMPRESSED_SW_INTEL_COGNITION',
    module_state: moduleState,
    surfaces,
    surface_count: surfaces.length,
    consequence_derived: !!(synthesisResult && consequenceResult),
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

  else if (activeSurfaceId === 'STRUCTURAL_FRAGILITY') {
    const fs = se.fragility_surface || {}
    const hotspots = fs.fragility_hotspots || []

    const hotspotDomainIds = []
    for (const hs of hotspots) {
      const filePath = hs.file || hs.path || ''
      const match = registry.find(d => filePath.startsWith(d.domain_name || '') || filePath.includes(d.domain_name || ''))
      if (match && !hotspotDomainIds.includes(match.domain_id)) hotspotDomainIds.push(match.domain_id)
    }

    const dimIds = Array.from(domainIdSet).filter(id => !hotspotDomainIds.includes(id))

    base.overlay_mode = 'FRAGILITY_HOTSPOT'
    base.emphasis_domains = hotspotDomainIds
    base.dim_domains = hotspotDomainIds.length > 0 ? dimIds : []
    base.topology_label = 'STRUCTURAL FRAGILITY'
    base.legend_entries = [
      ...(hotspotDomainIds.length > 0 ? [{ color: '#ff6b6b', label: `Fragility Hotspot (${hotspots.length} files)`, style: 'solid' }] : []),
    ]
  }

  else if (activeSurfaceId === 'BOUNDARY_ALIGNMENT') {
    const bd = se.boundary_divergence || {}
    const divergent = bd.divergent_modules || []

    const divergentDomainIds = []
    for (const dm of divergent) {
      const modName = dm.module || dm.name || ''
      const match = registry.find(d => modName.startsWith(d.domain_name || '') || modName.includes(d.domain_name || ''))
      if (match && !divergentDomainIds.includes(match.domain_id)) divergentDomainIds.push(match.domain_id)
    }

    const dimIds = Array.from(domainIdSet).filter(id => !divergentDomainIds.includes(id))

    base.overlay_mode = 'BOUNDARY_DIVERGENCE'
    base.emphasis_domains = divergentDomainIds
    base.dim_domains = divergentDomainIds.length > 0 ? dimIds : []
    base.topology_label = 'BOUNDARY ALIGNMENT'
    base.legend_entries = [
      ...(divergentDomainIds.length > 0 ? [{ color: '#ffd700', label: `Divergent (${divergent.length} modules)`, style: 'solid' }] : []),
    ]
  }

  else if (activeSurfaceId === 'STRUCTURAL_COUPLING') {
    const ci = se.coupling_inertia || {}
    const clusters = ci.inertia_clusters || []

    const clusterDomainIds = []
    for (const cl of clusters) {
      const modules = cl.modules || cl.members || []
      for (const mod of modules) {
        const match = registry.find(d => (typeof mod === 'string' ? mod : '').includes(d.domain_name || ''))
        if (match && !clusterDomainIds.includes(match.domain_id)) clusterDomainIds.push(match.domain_id)
      }
    }

    const dimIds = Array.from(domainIdSet).filter(id => !clusterDomainIds.includes(id))

    base.overlay_mode = 'COUPLING_CLUSTER'
    base.emphasis_domains = clusterDomainIds
    base.dim_domains = clusterDomainIds.length > 0 ? dimIds : []
    base.topology_label = 'STRUCTURAL COUPLING'
    base.legend_entries = [
      ...(clusterDomainIds.length > 0 ? [{ color: '#ff9e4a', label: `Coupling Cluster (${clusters.length})`, style: 'solid' }] : []),
      ...(ci.bidirectional_pair_count > 0 ? [{ color: '#ffd700', label: `${ci.bidirectional_pair_count} bidirectional pair${ci.bidirectional_pair_count !== 1 ? 's' : ''}`, style: 'dashed' }] : []),
    ]
  }

  else if (activeSurfaceId === 'REINFORCEMENT_FLOWS') {
    const coPresenceSigs = sigs.filter(s => typeof s.co_presence === 'string' && s.co_presence.length > 0)

    // Resolve amplification domains from the surface constituents
    const ampDomainIds = []
    const surfaceAmps = (resolvedSurface.constituents || {}).amplification_domains || []
    for (const amp of surfaceAmps) {
      const match = registry.find(d => d.domain_name === amp.domain || d.business_label === amp.domain || d.domain_id === amp.domain)
      if (match && !ampDomainIds.includes(match.domain_id)) ampDomainIds.push(match.domain_id)
    }

    // Build corridor paths from top_flows (domain concentration pairs, not co_presence iteration)
    const corridorPaths = []
    const topFlows = (resolvedSurface.constituents || {}).top_flows || []
    for (const flow of topFlows) {
      if (flow.domain) {
        const match = registry.find(d => d.business_label === flow.domain || d.domain_name === flow.domain || d.domain_id === flow.domain)
        if (match) corridorPaths.push({ from: match.domain_id, to: match.domain_id, type: 'reinforcement' })
      }
    }

    const emphasisIds = [...new Set([...ampDomainIds, ...corridorPaths.map(c => c.from)].filter(Boolean))]
    const dimIds = Array.from(domainIdSet).filter(id => !emphasisIds.includes(id))

    base.overlay_mode = 'REINFORCEMENT_FLOW'
    base.emphasis_domains = emphasisIds
    base.dim_domains = emphasisIds.length > 0 ? dimIds : []
    base.corridor_paths = corridorPaths
    base.topology_label = 'REINFORCEMENT FLOWS'
    base.legend_entries = [
      ...(ampDomainIds.length > 0 ? [{ color: '#ff9e4a', label: `Amplification Domain (${ampDomainIds.length})`, style: 'solid' }] : []),
      ...(coPresenceSigs.length > 0 ? [{ color: '#ff6b6b', label: `Co-Present Signal (${coPresenceSigs.length})`, style: 'pulse' }] : []),
    ]
  }

  else if (activeSurfaceId === 'CONVERGENCE_PATTERNS') {
    const convergenceDomains = (resolvedSurface.constituents || {}).convergence_domains || []

    const convergenceDomainIds = []
    for (const cd of convergenceDomains) {
      const match = registry.find(d => d.business_label === cd.domain || d.domain_name === cd.domain || d.domain_id === cd.domain)
      if (match && !convergenceDomainIds.includes(match.domain_id)) convergenceDomainIds.push(match.domain_id)
    }

    const dimIds = Array.from(domainIdSet).filter(id => !convergenceDomainIds.includes(id))

    base.overlay_mode = 'CONVERGENCE_ZONE'
    base.emphasis_domains = convergenceDomainIds
    base.dim_domains = convergenceDomainIds.length > 0 ? dimIds : []
    base.topology_label = 'CONVERGENCE PATTERNS'
    base.legend_entries = [
      ...(convergenceDomainIds.length > 0 ? [{ color: '#ff9e4a', label: `Convergence Domain (${convergenceDomains.length})`, style: 'solid' }] : []),
    ]
  }

  else if (activeSurfaceId === 'ABSENCE_PROFILE') {
    base.overlay_mode = 'STRUCTURAL_HEALTH'
    base.grounding_gradient = true
    // Show everything — no dim domains for health view
    base.topology_label = 'STRUCTURAL HEALTH'
    const c = resolvedSurface.constituents || {}
    base.legend_entries = [
      { color: '#64ffda', label: `Healthy: ${c.absent_count || 0} types nominal`, style: 'solid' },
      { color: '#ff9e4a', label: `Active: ${c.active_count || 0} types firing`, style: 'solid' },
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

  if (activeSurfaceId === 'GRAVITY_DIVERGENCE') {
    const RT_CONDITION_TYPES = new Set(['EVENT_CONCENTRATION','RUNTIME_DEPENDENCY_CHOKE_POINT','BROKER_DEPENDENCY','TOPIC_FANOUT_PRESSURE','ASYNC_PROPAGATION_ASYMMETRY','EDGE_CLOUD_PROPAGATION_RISK','RUNTIME_OBSERVABILITY_GAP'])

    const conditions = (fullReport._synthesisResult || fullReport.synthesisResult || {}).conditions || []
    const staticDomains = new Set()
    const runtimeDomains = new Set()

    for (const c of conditions) {
      const domains = (c.shared_topology_targets && c.shared_topology_targets.domains) || []
      if (RT_CONDITION_TYPES.has(c.condition_type)) {
        domains.forEach(id => runtimeDomains.add(id))
      } else if (c.severity !== 'NOMINAL') {
        domains.forEach(id => staticDomains.add(id))
      }
    }

    const allGravity = new Set([...staticDomains, ...runtimeDomains])
    const dimIds = Array.from(domainIdSet).filter(id => !allGravity.has(id))

    base.overlay_mode = 'GRAVITY_DIVERGENCE'
    base.emphasis_domains = Array.from(allGravity)
    base.dim_domains = dimIds
    base.gravity_static = staticDomains
    base.gravity_runtime = runtimeDomains
    base.topology_label = 'Gravity Divergence — Code vs Operational Center of Mass'
    base.legend_entries = [
      { color: '#4a9eff', label: 'Code gravity (static import)', style: 'solid' },
      { color: '#ff9e4a', label: 'Operational gravity (runtime)', style: 'solid' },
      { color: '#b392f0', label: 'Both', style: 'solid' },
    ]
    return base
  }

  if (activeSurfaceId === 'EXECUTION_BLINDNESS') {
    const blindnessTypes = {}
    const affectedIds = new Set()

    const conditions = (fullReport._synthesisResult || fullReport.synthesisResult || {}).conditions || []
    for (const c of conditions) {
      const domains = (c.shared_topology_targets && c.shared_topology_targets.domains) || []
      if (c.condition_type === 'BROKER_DEPENDENCY' || c.condition_type === 'EDGE_CLOUD_PROPAGATION_RISK') {
        domains.forEach(id => { blindnessTypes[id] = 'BOUNDARY'; affectedIds.add(id) })
      } else if (c.condition_type === 'RUNTIME_DEPENDENCY_CHOKE_POINT' || c.condition_type === 'ASYNC_PROPAGATION_ASYMMETRY') {
        domains.forEach(id => { if (!blindnessTypes[id]) blindnessTypes[id] = 'SILENCE'; affectedIds.add(id) })
      } else if (c.condition_type === 'EVENT_CONCENTRATION' || c.condition_type === 'TOPIC_FANOUT_PRESSURE') {
        domains.forEach(id => { if (!blindnessTypes[id]) blindnessTypes[id] = 'COUPLING'; affectedIds.add(id) })
      }
    }

    const dimIds = Array.from(domainIdSet).filter(id => !affectedIds.has(id))

    base.overlay_mode = 'EXECUTION_BLINDNESS'
    base.emphasis_domains = Array.from(affectedIds)
    base.dim_domains = dimIds
    base.blindness_types = blindnessTypes
    base.topology_label = 'Execution Blindness — What Can Fail While Appearing Healthy'
    base.legend_entries = [
      { color: '#ff4757', label: 'Boundary blind (outside codebase)', style: 'dashed' },
      { color: '#ff4757', label: 'Silence blind (failure produces no signal)', style: 'solid' },
      { color: '#ff4757', label: 'Coupling blind (blast radius exceeds prediction)', style: 'dotted' },
    ]
    return base
  }

  // Consequence-derived surfaces (csq-* IDs, including runtime)
  if (resolvedSurface && resolvedSurface.is_consequence_derived) {
    const affectedIds = (resolvedSurface.affected_domains || []).filter(id => domainIdSet.has(id))
    const dimIds = Array.from(domainIdSet).filter(id => !affectedIds.includes(id))
    const isRT = resolvedSurface.is_runtime
    const evidenceClass = resolvedSurface.evidence_class || 'STATIC_IMPORT'
    const overlayColor = isRT ? '#ff9e4a' : '#ff6b6b'

    base.overlay_mode = isRT ? 'RUNTIME_' + evidenceClass : 'CONSEQUENCE_STATIC'
    base.emphasis_domains = affectedIds
    base.dim_domains = affectedIds.length > 0 ? dimIds : []
    base.topology_label = resolvedSurface.surface_name + (isRT ? ' (RUNTIME)' : '')
    base.legend_entries = [
      { color: overlayColor, label: resolvedSurface.surface_name, style: isRT ? 'dashed' : 'solid' },
      ...(affectedIds.length > 0 ? [{ color: overlayColor, label: `${affectedIds.length} affected domain${affectedIds.length !== 1 ? 's' : ''}`, style: 'solid' }] : []),
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
  EXECUTION_FRAGILITY: 'EXECUTION FRAGILITY',
  EXECUTION_CONSTRICTION: 'EXECUTION CONSTRICTION',
  STRUCTURAL_BOUNDARY_DIVERGENCE: 'BOUNDARY DIVERGENCE',
  COUPLING_INERTIA: 'COUPLING INERTIA',
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

// ─── PRE ZONE A: AUDIENCE-CALIBRATED PROJECTION ──────────────────
// Deterministic audience projection. Same PICP → same output per persona.
// Zone B (governed narrative via AI) is not implemented — these are rule-based.

const BOARDROOM_NAMES = {
  DELIVERY_FRAGILITY: 'Delivery Risk',
  STRUCTURAL_FRAGILITY: 'Structural Vulnerability',
  INTEGRATION_EXPOSURE: 'Integration Risk',
  OPERATIONAL_TOPOLOGY: 'Architecture Health',
  QUALIFICATION_EXPOSURE: 'Governance Gaps',
  BOUNDARY_ALIGNMENT: 'Boundary Integrity',
  REINFORCEMENT_FLOWS: 'Compounding Patterns',
  CONVERGENCE_PATTERNS: 'Risk Concentration',
  PROPAGATION_RISK: 'Change Impact',
  ABSENCE_PROFILE: 'Coverage Health',
  COORDINATION_SATURATION: 'Coordination Load',
  STRUCTURAL_COUPLING: 'Coupling Rigidity',
}

module.exports = { deriveProjection, deriveModuleState, deriveTopologyCognitionState, derivePressureZoneCognitionState, deriveConditionCognitionState, translateSignal, SIGNAL_COGNITION_MAP, PROJECTION_STATUS, SURFACE_CONDITION_MAP }

'use strict'

/**
 * SoftwareIntelligenceProjectionAdapter
 * PI.SOFTWARE-INTELLIGENCE.MODULE-ACTIVATION-AND-LENS-PROJECTION.01
 *
 * Derives a PROVISIONAL_DERIVED_SW_INTEL_PROJECTION from existing fullReport
 * fields. This is NOT the canonical software_intelligence_module.json artifact —
 * it is a strictly derived projection from PI Core outputs for BlueEdge only.
 *
 * Every operational statement produced here traces to a fullReport field.
 * No AI commentary. No invented data. No hardcoded prose.
 */

const PROJECTION_STATUS = {
  ABSENT: 'ABSENT',
  AVAILABLE: 'AVAILABLE',
  INVALID: 'INVALID',
}

const SW_INTEL_ROLE_MAP = {
  hub: 'runtime coordination hub',
  spine: 'structural spine',
  leaf: 'peripheral module',
  bridge: 'cross-domain bridge',
  isolate: 'isolated component',
  authority: 'authority node',
  connector: 'integration connector',
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

function deriveRoleAbstractions(fullReport) {
  const result = []
  const registry = fullReport.semantic_domain_registry
  if (!registry || !registry.length) return result

  for (const domain of registry) {
    const abstraction = {
      domain_id: domain.domain_id,
      domain_name: domain.domain_name || domain.domain_id,
      operational_role: domain.zone_anchor
        ? 'pressure zone anchor — primary concentration point'
        : domain.structurally_backed
          ? 'structurally backed operational domain'
          : 'semantic-only domain — advisory bound',
      structural_backing: domain.structurally_backed ? 'BACKED' : 'SEMANTIC_ONLY',
      confidence: domain.confidence,
      trace: {
        source: 'fullReport.semantic_domain_registry',
        field: 'domain_id=' + domain.domain_id,
      },
    }
    result.push(abstraction)
  }
  return result
}

function derivePressureInterpretations(fullReport) {
  const result = []
  const sigs = fullReport.signal_interpretations
  if (!sigs || !sigs.length) return result

  for (const sig of sigs) {
    if (sig.severity === 'NOMINAL' || sig.activation_state === 'NOMINAL' || sig.activation_state === 'CLUSTER_BALANCED') continue
    const family = sig.signal_family || 'DPSIG'

    let operationalType = 'structural pressure'
    if (family === 'ISIG') operationalType = 'import dependency pressure'
    else if (family === 'PSIG') operationalType = 'architectural binding pressure'
    else if (sig.signal_name && sig.signal_name.includes('Cluster Pressure')) operationalType = 'concentration overload'
    else if (sig.signal_name && sig.signal_name.includes('Fan Asymmetry')) operationalType = 'dependency asymmetry'
    else if (sig.signal_name && sig.signal_name.includes('Absorption')) operationalType = 'coordination saturation'

    result.push({
      signal_id: sig.signal_id,
      signal_name: sig.signal_name,
      signal_family: family,
      operational_type: operationalType,
      severity: sig.severity,
      value: sig.signal_value,
      concentration: sig.concentration || null,
      operational_statement: sig.boardroom_interpretation || sig.interpretation || null,
      trace: {
        source: 'fullReport.signal_interpretations',
        field: 'signal_id=' + sig.signal_id,
      },
    })
  }
  return result
}

function deriveExecutionCorridors(fullReport) {
  const result = []
  const blocks = fullReport.evidence_blocks
  if (!blocks || !blocks.length) return result

  for (const block of blocks) {
    result.push({
      domain: block.domain_alias,
      role: block.propagation_role,
      grounding: block.grounding_status,
      operational_description:
        block.propagation_role === 'ORIGIN'
          ? `Pressure originates from "${block.domain_alias}" — delivery-critical path`
          : block.propagation_role === 'PASS_THROUGH'
            ? `"${block.domain_alias}" conducts pressure — coordination corridor`
            : `"${block.domain_alias}" absorbs downstream pressure — receiver exposure`,
      trace: {
        source: 'fullReport.evidence_blocks',
        field: 'domain_alias=' + block.domain_alias,
      },
    })
  }
  return result
}

function deriveTopologyRoles(fullReport) {
  const result = {}
  const se = fullReport.structural_enrichment
  if (!se || !se.available || !se.centrality) return result

  const roleSummary = se.centrality.role_summary || {}
  for (const [role, count] of Object.entries(roleSummary)) {
    result[role] = {
      count,
      operational_name: SW_INTEL_ROLE_MAP[role] || role,
      trace: {
        source: 'fullReport.structural_enrichment.centrality.role_summary',
        field: role,
      },
    }
  }
  return result
}

function deriveAttentionSignals(fullReport) {
  const result = []
  const sigs = fullReport.signal_interpretations
  if (!sigs || !sigs.length) return result

  const activated = sigs.filter(s =>
    s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL' && s.activation_state !== 'CLUSTER_BALANCED'
  )
  const sorted = [...activated].sort((a, b) => {
    const order = { HIGH: 0, ELEVATED: 1, MODERATE: 2, LOW: 3 }
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4)
  })

  for (const sig of sorted.slice(0, 5)) {
    result.push({
      signal_id: sig.signal_id,
      signal_name: sig.signal_name,
      severity: sig.severity,
      operational_attention: sig.boardroom_interpretation || sig.interpretation,
      trace: {
        source: 'fullReport.signal_interpretations',
        field: 'signal_id=' + sig.signal_id,
      },
    })
  }
  return result
}

function deriveCoordinationSpines(fullReport) {
  const result = []
  const se = fullReport.structural_enrichment
  if (!se || !se.available || !se.centrality) return result

  const spines = se.centrality.top_structural_spines || []
  for (const spine of spines.slice(0, 8)) {
    result.push({
      path: spine.path,
      structural_role: spine.structural_role,
      operational_role: SW_INTEL_ROLE_MAP[spine.structural_role] || spine.structural_role,
      in_degree: spine.in_degree,
      out_degree: spine.out_degree,
      centrality_rank: spine.centrality_rank,
      trace: {
        source: 'fullReport.structural_enrichment.centrality.top_structural_spines',
        field: 'path=' + spine.path,
      },
    })
  }
  return result
}

function deriveValidationPosture(fullReport) {
  const ts = fullReport.topology_summary || {}
  const rs = fullReport.reconciliation_summary || {}
  const qs = fullReport.qualifier_summary || {}

  return {
    grounding_coverage: {
      backed: ts.structurally_backed_count || 0,
      total: ts.semantic_domain_count || 0,
      semantic_only: ts.semantic_only_count || 0,
      operational_statement: (ts.structurally_backed_count || 0) > 0
        ? `${ts.structurally_backed_count} of ${ts.semantic_domain_count || 0} domains structurally validated`
        : 'No structural validation available',
    },
    reconciliation: rs.available
      ? {
          status: rs.status || 'UNKNOWN',
          operational_statement: `Reconciliation ${rs.status || 'UNKNOWN'} — ${rs.aligned_count || 0} aligned, ${rs.misaligned_count || 0} misaligned`,
        }
      : null,
    qualifier: {
      class: qs.qualifier_class || fullReport.qualifier_class || 'Q-01',
      operational_statement: qs.qualifier_label || 'Qualifier active',
    },
    trace: {
      source: 'fullReport.topology_summary + reconciliation_summary + qualifier_summary',
    },
  }
}

function deriveDeploymentRisk(fullReport) {
  const ps = fullReport.propagation_summary || {}
  const sigs = fullReport.signal_interpretations || []
  const activated = sigs.filter(s =>
    s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL' && s.activation_state !== 'CLUSTER_BALANCED'
  )

  const hasHighSeverity = activated.some(s => s.severity === 'HIGH')
  const riskLevel = hasHighSeverity ? 'ELEVATED' : activated.length > 2 ? 'MODERATE' : 'LOW'

  return {
    risk_level: riskLevel,
    activated_signal_count: activated.length,
    pressure_zone: ps.primary_zone_business_label || null,
    operational_statement: ps.primary_zone_business_label
      ? `Deployment risk ${riskLevel.toLowerCase()} — pressure concentrated at "${ps.primary_zone_business_label}"`
      : `Deployment risk ${riskLevel.toLowerCase()} — ${activated.length} pressure signals active`,
    trace: {
      source: 'fullReport.propagation_summary + signal_interpretations',
    },
  }
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
    governance_maturity: {
      transition_count: gl.transition_count || 0,
      last_updated: gl.last_updated || null,
    },
    trace: {
      source: 'fullReport.governance_lifecycle + readiness_summary',
    },
  }
}

function deriveStructuralRichnessAxis(fullReport) {
  const se = fullReport.structural_enrichment || {}
  const ts = fullReport.topology_summary || {}
  const sigs = fullReport.signal_interpretations || []

  const substrates = [
    {
      name: 'Code Graph (40.3s)',
      present: !!(se.available && se.code_graph),
      detail: se.available && se.code_graph
        ? `${se.code_graph.total_import_edges || 0} import edges, ${se.code_graph.total_classes || 0} classes`
        : null,
      trace: { source: 'fullReport.structural_enrichment.code_graph' },
    },
    {
      name: 'Structural Centrality (40.3c)',
      present: !!(se.available && se.centrality),
      detail: se.available && se.centrality
        ? `${Object.values(se.centrality.role_summary || {}).reduce((a, b) => a + b, 0)} files classified`
        : null,
      trace: { source: 'fullReport.structural_enrichment.centrality' },
    },
    {
      name: 'Signal Registry',
      present: sigs.length > 0,
      detail: sigs.length > 0 ? `${sigs.length} signals loaded` : null,
      trace: { source: 'fullReport.signal_interpretations' },
    },
    {
      name: 'Semantic Domain Registry',
      present: !!(ts.semantic_domain_count && ts.semantic_domain_count > 0),
      detail: ts.semantic_domain_count ? `${ts.semantic_domain_count} domains` : null,
      trace: { source: 'fullReport.topology_summary' },
    },
  ]

  const presentCount = substrates.filter(s => s.present).length
  const families = new Set(sigs.map(s => s.signal_family || 'DPSIG'))
  const activated = sigs.filter(s =>
    s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL' && s.activation_state !== 'CLUSTER_BALANCED'
  )

  let level = 'MINIMAL'
  if (presentCount >= 4) level = 'FULL'
  else if (presentCount >= 2) level = 'PARTIAL'

  return {
    axis: 'STRUCTURAL_RICHNESS',
    level,
    substrates,
    present_count: presentCount,
    total_count: substrates.length,
    signal_families: {
      total: sigs.length,
      activated: activated.length,
      families: [...families],
    },
    domain_count: ts.semantic_domain_count || 0,
    trace: { source: 'fullReport.structural_enrichment + topology_summary + signal_interpretations' },
  }
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
    {
      name: 'Governance Lifecycle',
      present: !!gl.available,
      detail: gl.available
        ? `${gl.s_level}, ${gl.transition_count || 0} transition${(gl.transition_count || 0) !== 1 ? 's' : ''}`
        : null,
      trace: { source: 'fullReport.governance_lifecycle' },
    },
    {
      name: 'Proposition Corpus',
      present: !!pc.available,
      detail: pc.available
        ? `${pc.total || 0} propositions, ${pc.disposition_counts?.accepted || 0} accepted`
        : null,
      trace: { source: 'fullReport.proposition_corpus' },
    },
    {
      name: 'Revalidation',
      present: !!ri.available,
      detail: ri.available
        ? `${ri.passed || 0}/${ri.total_checks || 0} ${ri.status || ''}`
        : null,
      trace: { source: 'fullReport.revalidation_intelligence' },
    },
    {
      name: 'Constitutional Anchor',
      present: !!ca.available,
      detail: ca.available
        ? `${ca.status || 'UNKNOWN'}, ${(ca.dimensions || []).length} dimensions`
        : null,
      trace: { source: 'fullReport.constitutional_anchor' },
    },
    {
      name: 'Convergence Intelligence',
      present: !!ci.available,
      detail: ci.available
        ? `${ci.total_observations || 0} observations`
        : null,
      trace: { source: 'fullReport.convergence_intelligence' },
    },
    {
      name: 'Chronicle Certification',
      present: !!cc.available,
      detail: cc.available
        ? `${cc.passed || 0}/${cc.total_checks || 0} ${cc.certification_status || ''}`
        : null,
      trace: { source: 'fullReport.chronicle_certification' },
    },
    {
      name: 'Enrichment Intelligence',
      present: !!ei.available,
      detail: ei.available
        ? `${ei.enrichment_events || 0} events, ${ei.domains_corrected || 0} corrected`
        : null,
      trace: { source: 'fullReport.enrichment_intelligence' },
    },
  ]

  const presentCount = artifacts.filter(a => a.present).length
  let level = 'NONE'
  if (presentCount >= 6) level = 'FULL'
  else if (presentCount >= 3) level = 'EXERCISED'
  else if (presentCount >= 1) level = 'MINIMAL'

  return {
    axis: 'GOVERNANCE_DEPTH',
    level,
    artifacts,
    present_count: presentCount,
    total_count: artifacts.length,
    s_level: gl.available ? gl.s_level : null,
    transition_count: gl.available ? (gl.transition_count || 0) : 0,
    trace: { source: 'fullReport.governance_lifecycle + proposition_corpus + revalidation + constitutional_anchor + convergence + chronicle + enrichment' },
  }
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

  return {
    axis: 'RECONCILIATION_AUTHORITY',
    level,
    reconciled_count: reconciled,
    total_domains: total,
    reconciliation_ratio: Math.round(ratio * 100),
    weighted_confidence: Math.round(weightedConfidence * 10) / 10,
    q_class: qClass,
    q_class_display: qClassDisplay,
    q_label: qs.qualifier_label || null,
    available: !!rs.available,
    trace: { source: 'fullReport.reconciliation_summary + qualifier_summary + topology_summary' },
  }
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
    guidance.push({
      condition: 'No governance lifecycle artifacts present',
      action: 'SQO governance lifecycle not exercised — promotion state, transitions, and authority ceiling unavailable',
      priority: 'MEDIUM',
      axis: 'GOVERNANCE_DEPTH',
      trace: { source: 'fullReport.governance_lifecycle.available === false' },
    })
  }

  if (!pc.available) {
    guidance.push({
      condition: 'No proposition corpus',
      action: 'Semantic propositions not derived — governed structural claims not produced for this run',
      priority: 'MEDIUM',
      axis: 'GOVERNANCE_DEPTH',
      trace: { source: 'fullReport.proposition_corpus.available === false' },
    })
  }

  if (!rs.available) {
    guidance.push({
      condition: 'Reconciliation unavailable',
      action: 'Crosswalk translation required before reconciliation can assess structural backing of semantic domains',
      priority: 'HIGH',
      axis: 'RECONCILIATION_AUTHORITY',
      trace: { source: 'fullReport.reconciliation_summary.available === false' },
    })
  } else {
    const reconciled = rs.reconciled_count || rs.aligned_count || 0
    const total = rs.total_semantic_domains || ts.semantic_domain_count || 0
    const unreconciled = total - reconciled
    if (unreconciled > 0) {
      guidance.push({
        condition: `${unreconciled} of ${total} domains unreconciled`,
        action: `Structural backing required for ${unreconciled} domain${unreconciled !== 1 ? 's' : ''} — advisory confirmation mandatory before executive commitment`,
        priority: unreconciled > total * 0.5 ? 'HIGH' : 'MEDIUM',
        axis: 'RECONCILIATION_AUTHORITY',
        trace: { source: `fullReport.reconciliation_summary: ${reconciled}/${total} reconciled` },
      })
    }
  }

  if (!se.available) {
    guidance.push({
      condition: 'No code graph or structural centrality',
      action: 'Code graph enrichment (40.3s) and structural centrality (40.3c) not available — file-level structural intelligence absent',
      priority: 'LOW',
      axis: 'STRUCTURAL_RICHNESS',
      trace: { source: 'fullReport.structural_enrichment.available === false' },
    })
  }

  if (gl.available && !gl.promotion_eligible && gl.hold_reason) {
    guidance.push({
      condition: `Advancement held: ${gl.hold_reason}`,
      action: `Qualification at ${gl.s_level} — advancement held, resolution required before progression`,
      priority: 'MEDIUM',
      axis: 'GOVERNANCE_DEPTH',
      trace: { source: `fullReport.governance_lifecycle: hold_reason=${gl.hold_reason}` },
    })
  }

  if (pc.available && pc.flagged_count > 0) {
    guidance.push({
      condition: `${pc.flagged_count} proposition${pc.flagged_count !== 1 ? 's' : ''} flagged`,
      action: 'Flagged propositions require operator review before qualification progression',
      priority: 'HIGH',
      axis: 'GOVERNANCE_DEPTH',
      trace: { source: `fullReport.proposition_corpus.flagged_count=${pc.flagged_count}` },
    })
  }

  if (ri.available && ri.failed > 0) {
    guidance.push({
      condition: `Revalidation: ${ri.failed} check${ri.failed !== 1 ? 's' : ''} failed`,
      action: `Revalidation detected ${ri.failed} failure${ri.failed !== 1 ? 's' : ''} — substrate does not replay cleanly under structural rigor`,
      priority: 'HIGH',
      axis: 'GOVERNANCE_DEPTH',
      trace: { source: `fullReport.revalidation_intelligence: ${ri.passed}/${ri.total_checks}` },
    })
  }

  return guidance.sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3)
  })
}

function deriveProjection(fullReport) {
  const moduleState = deriveModuleState(fullReport)

  if (moduleState === PROJECTION_STATUS.ABSENT) {
    return {
      projection_type: 'PROVISIONAL_DERIVED_SW_INTEL_PROJECTION',
      module_state: PROJECTION_STATUS.ABSENT,
      reason: 'Insufficient structural data for software intelligence projection',
      role_abstractions: [],
      pressure_interpretations: [],
      execution_corridors: [],
      topology_roles: {},
      attention_signals: [],
      coordination_spines: [],
      validation_posture: null,
      deployment_risk: null,
      qualification_cognition: null,
      qualification_decomposition: null,
    }
  }

  return {
    projection_type: 'PROVISIONAL_DERIVED_SW_INTEL_PROJECTION',
    module_state: moduleState,
    role_abstractions: deriveRoleAbstractions(fullReport),
    pressure_interpretations: derivePressureInterpretations(fullReport),
    execution_corridors: deriveExecutionCorridors(fullReport),
    topology_roles: deriveTopologyRoles(fullReport),
    attention_signals: deriveAttentionSignals(fullReport),
    coordination_spines: deriveCoordinationSpines(fullReport),
    validation_posture: deriveValidationPosture(fullReport),
    deployment_risk: deriveDeploymentRisk(fullReport),
    qualification_cognition: deriveQualificationCognition(fullReport),
    qualification_decomposition: {
      structural_richness: deriveStructuralRichnessAxis(fullReport),
      governance_depth: deriveGovernanceDepthAxis(fullReport),
      reconciliation_authority: deriveReconciliationAuthorityAxis(fullReport),
      guidance: deriveQualificationGuidance(fullReport),
    },
  }
}

module.exports = { deriveProjection, deriveModuleState, PROJECTION_STATUS }

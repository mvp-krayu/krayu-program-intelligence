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
  }
}

module.exports = { deriveProjection, deriveModuleState, PROJECTION_STATUS }

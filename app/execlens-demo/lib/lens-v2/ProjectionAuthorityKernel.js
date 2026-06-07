// ─── PI PROJECTION AUTHORITY KERNEL ─────────────────────────────
// Constitutional governance kernel. All consumers (LENS, THORR, EIR,
// SW-INTEL) depend on this single authority object.
//
// Authority: PI_STATE_MACHINE_CONTRACT.md
// Origin: PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 Phase 1

// ─── Evidence Capability ───

const E = {
  STRUCTURAL: 'E-STRUCTURAL',
  RUNTIME: 'E-RUNTIME',
  SEMANTIC: 'E-SEMANTIC',
  GOVERNED: 'E-GOVERNED',
}

// ─── Projection Authority Levels ───

const P = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
}

const P_LABEL = {
  0: 'P0 — Topology Only',
  1: 'P1 — Structural Observation',
  2: 'P2 — Runtime Interpretation',
  3: 'P3 — Semantic Cognition',
  4: 'P4 — Narrative Authority',
}

// ─── Condition Type Authority Classification ───
// From PI_STATE_MACHINE_CONTRACT.md Appendix B

const CONDITION_AUTHORITY = {
  STRUCTURAL_MASS_CONCENTRATION: P.P1,
  CROSS_DOMAIN_COUPLING_PRESSURE: P.P1,
  COUPLING_INERTIA: P.P1,
  STRUCTURAL_BOUNDARY_DIVERGENCE: P.P1,
  GOVERNANCE_COVERAGE_STATUS: P.P1,

  EXECUTION_FRAGILITY: P.P2,
  EXECUTION_CONSTRICTION: P.P2,
  EVENT_CONCENTRATION: P.P2,
  RUNTIME_DEPENDENCY_CHOKE_POINT: P.P2,
  BROKER_DEPENDENCY: P.P2,
  TOPIC_FANOUT_PRESSURE: P.P2,
  ASYNC_PROPAGATION_ASYMMETRY: P.P2,
  EDGE_CLOUD_PROPAGATION_RISK: P.P2,
  RUNTIME_OBSERVABILITY_GAP: P.P2,

  DELIVERY_PRESSURE_CONCENTRATION: P.P3,
  DEPENDENCY_CHOKE_POINT: P.P3,
  PROPAGATION_ASYMMETRY: P.P3,
}

// ─── Evidence Capability Detection ───
// From PI_STATE_MACHINE_CONTRACT.md Appendix A

function detectEvidenceCapabilities(fullReport) {
  const capabilities = new Set()
  const reasoning = []

  if (!fullReport) return { capabilities, reasoning }

  const se = fullReport.structural_enrichment || {}
  const hasTopology = !!(fullReport.topology_summary || fullReport.topology_scope)
  const hasCodeGraph = !!(se.code_graph || se.centrality)
  const hasEnrichment = !!(se.available || se.fragility_surface || se.constriction_surface)

  if (hasTopology && (hasEnrichment || hasCodeGraph)) {
    capabilities.add(E.STRUCTURAL)
    reasoning.push({ capability: E.STRUCTURAL, basis: 'canonical_topology present' + (hasCodeGraph ? ' + code_graph/centrality' : '') + (hasEnrichment ? ' + structural_enrichment' : '') })
  }

  const runtimeSignals = fullReport._runtime_signals || []
  const hasRuntimeSignals = runtimeSignals.length > 0

  if (capabilities.has(E.STRUCTURAL) && hasRuntimeSignals) {
    capabilities.add(E.RUNTIME)
    reasoning.push({ capability: E.RUNTIME, basis: `${runtimeSignals.length} runtime signal${runtimeSignals.length !== 1 ? 's' : ''} derived from connectivity graphs` })
  }

  const sigs = fullReport.signal_interpretations || []
  const hasCanonicalSignals = sigs.length > 0 && !sigs[0].derived_from
  const hasRecon = fullReport.reconciliation_summary && fullReport.reconciliation_summary.available

  if (capabilities.has(E.STRUCTURAL) && hasCanonicalSignals && hasRecon) {
    capabilities.add(E.SEMANTIC)
    reasoning.push({ capability: E.SEMANTIC, basis: `${sigs.length} canonical signal${sigs.length !== 1 ? 's' : ''} (${[...new Set(sigs.map(s => s.signal_family))].join('/')}) + reconciliation available` })
  }

  const gl = fullReport.governance_lifecycle
  const hasGovernance = gl && gl.available

  if (capabilities.has(E.SEMANTIC) && hasGovernance) {
    capabilities.add(E.GOVERNED)
    reasoning.push({ capability: E.GOVERNED, basis: 'governance_lifecycle available + proposition_corpus present' })
  }

  return { capabilities, reasoning }
}

// ─── Projection Level Derivation ───

function deriveProjectionLevel(capabilities) {
  if (capabilities.has(E.GOVERNED)) return P.P4
  if (capabilities.has(E.SEMANTIC)) return P.P3
  if (capabilities.has(E.RUNTIME)) return P.P2
  if (capabilities.has(E.STRUCTURAL)) return P.P1
  return P.P0
}

// ─── Condition Authorization ───

function classifyConditionAuthority(conditionType) {
  if (conditionType === 'COMPOUND_CONVERGENCE') return null
  return CONDITION_AUTHORITY[conditionType] ?? null
}

// ─── Evidence Lineage → Proven Authority ───
// Doctrine B: each condition must independently prove its authority
// from its own evidence lineage, not from specimen-level capability.

const EVIDENCE_MODE_AUTHORITY = {
  STRUCTURAL_ENRICHMENT_DERIVED: P.P1,
  TOPOLOGY_METRIC_DERIVED: P.P1,
  TOPOLOGY_DRIVEN: P.P1,
  PRESSURE_ZONE_DERIVED: P.P1,
  STRUCTURAL_CENTRALITY_DERIVED: P.P1,
  EVIDENCE_DERIVED: P.P1,
  SIGNAL_DRIVEN: P.P3,
  RUNTIME_DERIVED: P.P2,
  RUNTIME_EVIDENCE: P.P2,
  MIXED: null,
}

function resolveProvenAuthority(condition, allConditions) {
  if (condition.condition_type === 'COMPOUND_CONVERGENCE') {
    const contributingIds = condition.contributing_condition_ids || []
    let maxP = P.P0
    for (const id of contributingIds) {
      const constituent = allConditions.find(c => c.condition_id === id || c.internal_condition_id === id)
      if (constituent) {
        const p = resolveProvenAuthority(constituent, allConditions)
        if (p > maxP) maxP = p
      }
    }
    return maxP
  }

  const mode = condition.evidence_mode
  if (!mode) return P.P1

  if (mode === 'MIXED') {
    const sources = condition.evidence_sources || []
    let maxP = P.P1
    for (const src of sources) {
      const p = EVIDENCE_MODE_AUTHORITY[src]
      if (p !== null && p !== undefined && p > maxP) maxP = p
    }
    return maxP
  }

  return EVIDENCE_MODE_AUTHORITY[mode] ?? P.P1
}

function authorizeConditions(conditions, projectionLevel) {
  const authorized = []
  const violations = []

  for (const c of conditions) {
    const requestedP = c.condition_type === 'COMPOUND_CONVERGENCE'
      ? classifyConditionAuthority(c.contributing_condition_ids && c.contributing_condition_ids.length > 0
          ? conditions.find(x => x.condition_id === c.contributing_condition_ids[0] || x.internal_condition_id === c.contributing_condition_ids[0])?.condition_type
          : null) || P.P1
      : classifyConditionAuthority(c.condition_type)

    if (requestedP === null) {
      authorized.push(c)
      continue
    }

    const provenP = resolveProvenAuthority(c, conditions)

    const specimenAuthorizes = requestedP <= projectionLevel
    const lineageAuthorizes = provenP >= requestedP

    if (specimenAuthorizes && lineageAuthorizes) {
      authorized.push(c)
    } else {
      const reasons = []
      if (!specimenAuthorizes) reasons.push(`specimen at ${P_LABEL[projectionLevel]}, requires ${P_LABEL[requestedP]}`)
      if (!lineageAuthorizes) reasons.push(`evidence lineage proves ${P_LABEL[provenP]}, requires ${P_LABEL[requestedP]} (${c.evidence_mode || 'unknown'})`)

      violations.push({
        condition_id: c.condition_id || c.internal_condition_id,
        condition_type: c.condition_type,
        condition_label: c.operator_cognition_title || c.condition_label || c.condition_type,
        severity: c.severity,
        requested_level: requestedP,
        requested_label: P_LABEL[requestedP],
        proven_level: provenP,
        proven_label: P_LABEL[provenP],
        specimen_level: projectionLevel,
        specimen_label: P_LABEL[projectionLevel],
        violation_type: !specimenAuthorizes && !lineageAuthorizes ? 'BOTH' : !specimenAuthorizes ? 'SPECIMEN_AUTHORITY' : 'EVIDENCE_LINEAGE',
        violation: reasons.join('; '),
      })
    }
  }

  return { authorized, violations }
}

function resolveCompoundAuthority(condition, allConditions) {
  return resolveProvenAuthority(condition, allConditions)
}

// ─── Authorized Condition Type Set ───

function getAuthorizedConditionTypes(projectionLevel) {
  const types = new Set()
  for (const [type, requiredP] of Object.entries(CONDITION_AUTHORITY)) {
    if (requiredP <= projectionLevel) types.add(type)
  }
  types.add('COMPOUND_CONVERGENCE')
  return types
}

// ─── Qualification State Detection ───

function detectQualificationState(fullReport) {
  if (!fullReport) return 'S0'
  const gl = fullReport.governance_lifecycle
  if (gl && gl.available) return 'S3'
  const hasRecon = fullReport.reconciliation_summary && fullReport.reconciliation_summary.available
  const sigs = fullReport.signal_interpretations || []
  const hasCanonicalSignals = sigs.length > 0 && !sigs[0].derived_from
  if (hasCanonicalSignals && hasRecon) return 'S2'
  const se = fullReport.structural_enrichment || {}
  if (se.available || se.fragility_surface || se.code_graph || se.centrality) return 'S1'
  return 'S0'
}

// ─── Constitutional Kernel ───

function computeProjectionAuthority(fullReport) {
  const { capabilities, reasoning: capabilityReasoning } = detectEvidenceCapabilities(fullReport)
  const projectionLevel = deriveProjectionLevel(capabilities)
  const qualificationState = detectQualificationState(fullReport)
  const authorizedConditionTypes = getAuthorizedConditionTypes(projectionLevel)

  const conditions = (fullReport && fullReport._synthesisResult && fullReport._synthesisResult.conditions) || []
  const activeConditions = conditions.filter(c => c.severity !== 'NOMINAL')
  const { authorized, violations } = authorizeConditions(activeConditions, projectionLevel)

  const runtimePresent = (fullReport && fullReport._runtime_signals && fullReport._runtime_signals.length > 0) || false
  const runtimeQualified = capabilities.has(E.RUNTIME)

  return {
    qualificationState,

    evidenceCapabilities: [...capabilities],
    evidenceReasoning: capabilityReasoning,

    projectionLevel,
    projectionLabel: P_LABEL[projectionLevel],

    authorizedConditionTypes: [...authorizedConditionTypes],
    authorizedConditionCount: authorized.length,
    totalActiveConditionCount: activeConditions.length,

    violations,
    violationCount: violations.length,
    hasViolations: violations.length > 0,

    runtimePresent,
    runtimeQualified,

    summary: {
      state: `${qualificationState} · ${P_LABEL[projectionLevel]}`,
      evidence: [...capabilities].join(' + '),
      conditionAuthority: `${authorized.length} of ${activeConditions.length} conditions authorized at ${P_LABEL[projectionLevel]}`,
      violationSummary: violations.length > 0
        ? `${violations.length} projection violation${violations.length !== 1 ? 's' : ''}: ${[...new Set(violations.map(v => v.condition_type))].join(', ')}`
        : 'No projection violations',
    },
  }
}

// ─── Consumer Authority Checks ───

function isProjectionAuthorized(projectionLevel, requiredLevel) {
  return projectionLevel >= requiredLevel
}

function isConditionTypeAuthorized(conditionType, projectionLevel) {
  const required = CONDITION_AUTHORITY[conditionType]
  if (required === undefined) return true
  return required <= projectionLevel
}

function isPersonaAuthorized(persona, projectionLevel) {
  const PERSONA_MINIMUM = {
    EXECUTIVE_DENSE: P.P1,
    OPERATOR: P.P1,
    INVESTIGATION: P.P1,
    EXECUTIVE_BALANCED: P.P1,
    BOARDROOM: P.P1,
  }
  return projectionLevel >= (PERSONA_MINIMUM[persona] || P.P1)
}

function isNarrativeModeAuthorized(narrativeMode, projectionLevel) {
  if (narrativeMode === 'EXECUTION_BLINDNESS') return projectionLevel >= P.P2
  if (narrativeMode === 'STRUCTURAL_INTELLIGENCE') return projectionLevel >= P.P1
  return true
}

module.exports = {
  computeProjectionAuthority,

  isProjectionAuthorized,
  isConditionTypeAuthorized,
  isPersonaAuthorized,
  isNarrativeModeAuthorized,

  authorizeConditions,
  getAuthorizedConditionTypes,
  detectEvidenceCapabilities,
  deriveProjectionLevel,
  detectQualificationState,
  classifyConditionAuthority,
  resolveCompoundAuthority,
  resolveProvenAuthority,

  E,
  P,
  P_LABEL,
  CONDITION_AUTHORITY,
  EVIDENCE_MODE_AUTHORITY,
}

// CognitiveContinuations.js
// PiOS Core Primitive — PI.COGNITIVE-CONTINUATIONS.01
//
// Answer → unexplored cognition edges → next valuable inquiry
//
// Not prompt suggestions. Not LLM generation. Deterministic graph traversal.
// Every continuation traces to a specific cognition object.

const SURFACE_ADJACENCY = {
  EXECUTION_BLINDNESS: ['GRAVITY_DIVERGENCE', 'DELIVERY_FRAGILITY', 'COORDINATION_SATURATION'],
  GRAVITY_DIVERGENCE: ['EXECUTION_BLINDNESS', 'STRUCTURAL_FRAGILITY', 'OPERATIONAL_TOPOLOGY'],
  DELIVERY_FRAGILITY: ['EXECUTION_BLINDNESS', 'PROPAGATION_RISK', 'COORDINATION_SATURATION'],
  COORDINATION_SATURATION: ['DELIVERY_FRAGILITY', 'EXECUTION_BLINDNESS', 'STRUCTURAL_COUPLING'],
  PROPAGATION_RISK: ['DELIVERY_FRAGILITY', 'INTEGRATION_EXPOSURE', 'BOUNDARY_ALIGNMENT'],
  STRUCTURAL_FRAGILITY: ['GRAVITY_DIVERGENCE', 'CONVERGENCE_PATTERNS', 'REINFORCEMENT_FLOWS'],
  INTEGRATION_EXPOSURE: ['PROPAGATION_RISK', 'STRUCTURAL_COUPLING'],
  STRUCTURAL_COUPLING: ['COORDINATION_SATURATION', 'INTEGRATION_EXPOSURE'],
  OPERATIONAL_TOPOLOGY: ['GRAVITY_DIVERGENCE', 'STRUCTURAL_FRAGILITY'],
  BOUNDARY_ALIGNMENT: ['PROPAGATION_RISK', 'QUALIFICATION_EXPOSURE'],
}

const SURFACE_NAMES = {
  EXECUTION_BLINDNESS: 'Execution Blindness',
  GRAVITY_DIVERGENCE: 'Gravity Divergence',
  DELIVERY_FRAGILITY: 'Delivery Fragility',
  COORDINATION_SATURATION: 'Coordination Saturation',
  PROPAGATION_RISK: 'Propagation Risk',
  STRUCTURAL_FRAGILITY: 'Structural Fragility',
  INTEGRATION_EXPOSURE: 'Integration Exposure',
  STRUCTURAL_COUPLING: 'Structural Coupling',
  OPERATIONAL_TOPOLOGY: 'Operational Topology',
  BOUNDARY_ALIGNMENT: 'Boundary Alignment',
  CONVERGENCE_PATTERNS: 'Convergence Patterns',
  REINFORCEMENT_FLOWS: 'Reinforcement Flows',
  QUALIFICATION_EXPOSURE: 'Qualification Exposure',
  ABSENCE_PROFILE: 'Absence Profile',
}

const FALSIFICATION_PATHS = {
  EXECUTION_BLINDNESS: 'all runtime dependencies had redundant paths and no single broker/event coordination point existed',
  GRAVITY_DIVERGENCE: 'code gravity and operational gravity converged on the same domains',
  DELIVERY_FRAGILITY: 'delivery pressure were distributed across multiple independent domains',
  COORDINATION_SATURATION: 'coordination paths were decentralized with no single high-centrality orchestrator',
  INTEGRATION_EXPOSURE: 'integration boundaries were encapsulated with no pass-through coupling',
  PROPAGATION_RISK: 'propagation chains had circuit breakers and no asymmetric fan-out existed',
  STRUCTURAL_FRAGILITY: 'fragility indicators were distributed rather than compounding in one region',
  STRUCTURAL_COUPLING: 'coupling patterns allowed independent evolution of connected domains',
}

function makeContinuation(type, question, derivedFrom, opts = {}) {
  return {
    type,
    question,
    derivedFrom,
    targetSurface: opts.targetSurface || null,
    targetEvidence: opts.targetEvidence || null,
    authorityRequired: opts.authorityRequired || 1,
  }
}

// ─── Traversal Functions ────────────────────────────────────────

function deriveClarify(surfaceId, ctx) {
  const results = []
  const domConc = (ctx.crossDomainCognition && ctx.crossDomainCognition.domain_concentration) || []
  const topDomain = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = ctx.crossDomainCognition && ctx.crossDomainCognition.execution_center
  const sigs = (ctx.fullReport && ctx.fullReport.signal_interpretations) || []
  const rsigs = sigs.filter(s => s.signal_family === 'RSIG')

  if (surfaceId === 'GRAVITY_DIVERGENCE' && execCenter && topDomain) {
    results.push(makeContinuation('clarify',
      `Why is ${execCenter} the execution center rather than ${topDomain}?`,
      'execution_concentration[0] vs domain_concentration[0]'))
  }

  if (surfaceId === 'EXECUTION_BLINDNESS' && rsigs.length > 0) {
    results.push(makeContinuation('clarify',
      `Which specific runtime paths create the blindness?`,
      `RSIG signals (${rsigs.length})`,
      { targetEvidence: 'RSIG' }))
  }

  if (surfaceId === 'DEPENDENCY_AMPLIFICATION' && topDomain) {
    results.push(makeContinuation('clarify',
      `What makes ${topDomain} an amplifier rather than just structurally large?`,
      `domain_concentration[0].weight + condition_count`))
  }

  if (surfaceId === 'RUNTIME_DEPENDENCY_CHOKE_POINT' && rsigs.length > 0) {
    const chokeSig = rsigs.find(s => s.signal_name && s.signal_name.toLowerCase().includes('choke'))
    if (chokeSig) {
      results.push(makeContinuation('clarify',
        `Which domains depend on this runtime gateway?`,
        `${chokeSig.signal_id}.affected_domains`,
        { targetEvidence: chokeSig.signal_id }))
    }
  }

  if (surfaceId === 'SYSTEMIC_OPERATIONAL_FRAGILITY') {
    const themes = (ctx.crossDomainCognition && ctx.crossDomainCognition.consequence_themes) || []
    results.push(makeContinuation('clarify',
      `Which ${themes.length} pressures converge to create systemic fragility?`,
      `consequence_themes[]`))
  }

  return results
}

function deriveImplication(surfaceId, ctx) {
  const results = []
  const domConc = (ctx.crossDomainCognition && ctx.crossDomainCognition.domain_concentration) || []
  const narratives = (ctx.crossDomainCognition && ctx.crossDomainCognition.domain_narratives) || []
  const topDomain = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = ctx.crossDomainCognition && ctx.crossDomainCognition.execution_center

  if (surfaceId === 'GRAVITY_DIVERGENCE' && execCenter && topDomain && execCenter.toLowerCase() !== topDomain.toLowerCase()) {
    results.push(makeContinuation('implication',
      `Which delivery decisions are affected by having architecture in ${topDomain} and operations in ${execCenter}?`,
      'domain_narratives for both centers'))
  }

  if (surfaceId === 'EXECUTION_BLINDNESS') {
    results.push(makeContinuation('implication',
      'What monitoring gaps does this create for operational teams?',
      'RUNTIME_OBSERVABILITY_GAP condition'))
  }

  if (surfaceId === 'DEPENDENCY_AMPLIFICATION' && narratives.length > 1) {
    const receivers = narratives.slice(1, 4).map(n => n.domain)
    results.push(makeContinuation('implication',
      `Which downstream teams (${receivers.join(', ')}) are affected without knowing it?`,
      'domain_narratives receivers'))
  }

  if (surfaceId === 'SYSTEMIC_OPERATIONAL_FRAGILITY' && topDomain) {
    results.push(makeContinuation('implication',
      `Which teams experience this as delivery unpredictability?`,
      'domain_narratives top domains'))
  }

  if (surfaceId === 'RUNTIME_DEPENDENCY_CHOKE_POINT') {
    results.push(makeContinuation('implication',
      'What happens to downstream services if this gateway degrades?',
      'CONSEQUENCE_LABELS[RUNTIME_DEPENDENCY_CHOKE_POINT]'))
  }

  return results
}

function deriveChallenge(surfaceId, ctx) {
  const results = []
  const falsification = FALSIFICATION_PATHS[surfaceId]

  if (falsification) {
    results.push(makeContinuation('challenge',
      `Would this finding disappear if ${falsification}?`,
      `FALSIFICATION_PATHS[${surfaceId}]`))
  }

  const themes = (ctx.crossDomainCognition && ctx.crossDomainCognition.consequence_themes) || []
  if (surfaceId === 'SYSTEMIC_OPERATIONAL_FRAGILITY' && themes.length > 1) {
    results.push(makeContinuation('challenge',
      `Would addressing ${themes[0].theme_label} alone reduce systemic scope?`,
      'consequence_themes[0] vs posture_scope'))
  }

  const gl = ctx.fullReport && ctx.fullReport.governance_lifecycle
  if (!gl || !gl.available) {
    results.push(makeContinuation('challenge',
      'This finding is advisory-only — what would governed qualification change?',
      'governance_lifecycle.available = false',
      { authorityRequired: 1 }))
  }

  return results
}

function deriveDescent(surfaceId, ctx) {
  const results = []
  const sigs = (ctx.fullReport && ctx.fullReport.signal_interpretations) || []
  const rsigs = sigs.filter(s => s.signal_family === 'RSIG')
  const execCenter = ctx.crossDomainCognition && ctx.crossDomainCognition.execution_center

  if (surfaceId === 'GRAVITY_DIVERGENCE' && rsigs.length > 0 && execCenter) {
    results.push(makeContinuation('descent',
      `Show the RSIG signals supporting ${execCenter} as execution center`,
      'RSIG signals filtered by execution_center domain',
      { targetEvidence: 'RSIG', authorityRequired: 2 }))
  }

  if (surfaceId === 'EXECUTION_BLINDNESS') {
    results.push(makeContinuation('descent',
      'Show the 3 blindness types and their affected domains',
      'blindness_types map (BOUNDARY/SILENCE/COUPLING)',
      { targetEvidence: 'blindness_types', authorityRequired: 2 }))
  }

  if (surfaceId === 'DEPENDENCY_AMPLIFICATION') {
    const se = ctx.fullReport && ctx.fullReport.structural_enrichment
    if (se && se.centrality) {
      results.push(makeContinuation('descent',
        'Show the import graph fan-out from the primary domain',
        'structural_enrichment.centrality.top_structural_spines',
        { targetEvidence: 'centrality' }))
    }
  }

  if (surfaceId === 'SYSTEMIC_OPERATIONAL_FRAGILITY') {
    results.push(makeContinuation('descent',
      'Show the condition chain that produces this posture',
      'cognition_slices from forBoardroom()',
      { targetEvidence: 'cognition_slices' }))
  }

  if (surfaceId === 'RUNTIME_DEPENDENCY_CHOKE_POINT') {
    results.push(makeContinuation('descent',
      'Show the runtime connectivity flow through this choke point',
      'runtimeConnectivityEdges filtered by choke domain',
      { targetEvidence: 'runtimeConnectivityEdges', authorityRequired: 2 }))
  }

  return results
}

function deriveAdjacent(surfaceId, ctx) {
  const results = []
  const adjacentIds = SURFACE_ADJACENCY[surfaceId] || []
  const themes = (ctx.crossDomainCognition && ctx.crossDomainCognition.consequence_themes) || []
  const themeLabels = new Set(themes.map(t => t.theme_label))

  for (const adjId of adjacentIds.slice(0, 2)) {
    const adjName = SURFACE_NAMES[adjId] || adjId
    results.push(makeContinuation('adjacent',
      `Does this finding contribute to ${adjName}?`,
      `SURFACE_ADJACENCY[${surfaceId}] → ${adjId}`,
      { targetSurface: adjId }))
  }

  if (surfaceId === 'GRAVITY_DIVERGENCE') {
    results.push(makeContinuation('adjacent',
      'Does the divergence compound with Execution Blindness?',
      'execution_center domains ∩ blindness_types domains',
      { targetSurface: 'EXECUTION_BLINDNESS' }))
  }

  if (surfaceId === 'DEPENDENCY_AMPLIFICATION') {
    results.push(makeContinuation('adjacent',
      'Does amplification compound with propagation dynamics?',
      'domain_concentration[0] === domain_narratives[0]',
      { targetSurface: 'PROPAGATION_RISK' }))
  }

  return results
}

function deriveAscent(surfaceId, ctx) {
  const results = []
  const cdc = ctx.crossDomainCognition

  results.push(makeContinuation('ascent',
    'How does the BOARDROOM project this finding?',
    'crossDomainCognition.posture_label + consequence_themes',
    { authorityRequired: 1 }))

  if (cdc && cdc.posture_label) {
    results.push(makeContinuation('ascent',
      `What does ${cdc.posture_label} mean for how the organization operates?`,
      'BALANCED interpret_operational_posture',
      { authorityRequired: 1 }))
  }

  const gl = ctx.fullReport && ctx.fullReport.governance_lifecycle
  if (gl && gl.available) {
    results.push(makeContinuation('ascent',
      'Can these findings be presented with institutional confidence?',
      `governance_lifecycle.s_level = ${gl.s_level}`,
      { authorityRequired: 3 }))
  }

  return results
}

// ─── Main Export ─────────────────────────────────────────────────

function deriveContinuations(surfaceId, cognitionContext, projectionLevel) {
  const ctx = cognitionContext || {}
  const pLevel = projectionLevel || 0

  const raw = {
    clarify: deriveClarify(surfaceId, ctx),
    implication: deriveImplication(surfaceId, ctx),
    challenge: deriveChallenge(surfaceId, ctx),
    descent: deriveDescent(surfaceId, ctx),
    adjacent: deriveAdjacent(surfaceId, ctx),
    ascent: deriveAscent(surfaceId, ctx),
  }

  const gated = {}
  for (const [type, continuations] of Object.entries(raw)) {
    gated[type] = continuations.map(c => ({
      ...c,
      available: pLevel >= (c.authorityRequired || 1),
    }))
  }

  return gated
}

module.exports = { deriveContinuations, SURFACE_ADJACENCY, SURFACE_NAMES }

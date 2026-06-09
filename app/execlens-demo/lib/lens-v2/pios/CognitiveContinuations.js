// CognitiveContinuations.js
// PiOS Core Primitive — PI.COGNITIVE-CONTINUATIONS.01
//
// Answer → unexplored cognition edges → next valuable inquiry
//
// Property-based derivation. No surface ID hardcoding.
// Every continuation carries: trace (resolvable path), reason (triggering condition).

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

function makeContinuation(type, question, trace, reason, opts = {}) {
  return {
    type,
    question,
    trace,
    reason,
    targetSurface: opts.targetSurface || null,
    targetEvidence: opts.targetEvidence || null,
    authorityRequired: opts.authorityRequired || 1,
  }
}

// ─── Property Detection ─────────────────────────────────────────
// Derive surface properties from cognition objects, not surface IDs.

function detectProperties(surfaceId, ctx) {
  const cdc = ctx.crossDomainCognition || {}
  const fr = ctx.fullReport || {}
  const domConc = cdc.domain_concentration || []
  const sigs = fr.signal_interpretations || []
  const rsigs = sigs.filter(s => s.signal_family === 'RSIG')
  const themes = cdc.consequence_themes || []
  const narratives = cdc.domain_narratives || []
  const gl = fr.governance_lifecycle
  const se = fr.structural_enrichment
  const structCenter = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = cdc.execution_center || null

  return {
    surfaceId,
    structCenter,
    execCenter,
    hasDivergence: execCenter && structCenter && execCenter.toLowerCase() !== structCenter.toLowerCase(),
    hasRuntime: rsigs.length > 0,
    rsigCount: rsigs.length,
    rsigs,
    hasMultipleThemes: themes.length > 1,
    themeCount: themes.length,
    themes,
    hasPropagation: narratives.length > 1,
    narratives,
    propagationOrigin: narratives.length > 0 ? narratives[0].domain : null,
    propagationReceivers: narratives.slice(1, 4).map(n => n.domain),
    isGoverned: gl && gl.available,
    governanceLevel: gl && gl.available ? gl.s_level : null,
    hasCentrality: se && se.available && se.centrality,
    hasFalsification: !!FALSIFICATION_PATHS[surfaceId],
    falsificationPath: FALSIFICATION_PATHS[surfaceId] || null,
    adjacentSurfaces: SURFACE_ADJACENCY[surfaceId] || [],
    domainCount: domConc.length,
    postureLabel: cdc.posture_label || null,
    postureScope: cdc.posture_scope || null,
  }
}

// ─── Traversal Functions ────────────────────────────────────────
// All derived from properties, not surface IDs.

function deriveClarify(p) {
  const results = []

  if (p.hasDivergence) {
    results.push(makeContinuation('clarify',
      `Why is ${p.execCenter} the execution center rather than ${p.structCenter}?`,
      { object: 'execution_concentration[0]', field: 'domain', value: p.execCenter },
      `execution_center (${p.execCenter}) !== structural_center (${p.structCenter})`
    ))
  }

  if (p.hasRuntime && p.rsigCount > 0) {
    results.push(makeContinuation('clarify',
      'Which specific runtime paths create pressure?',
      { object: 'signal_interpretations', field: 'RSIG', value: p.rsigCount },
      `${p.rsigCount} RSIG signals exist`,
      { targetEvidence: 'RSIG', authorityRequired: 2 }
    ))
  }

  if (p.structCenter && p.domainCount > 1) {
    results.push(makeContinuation('clarify',
      `What makes ${p.structCenter} dominant rather than just large?`,
      { object: 'domain_concentration[0]', field: 'domain', value: p.structCenter },
      `${p.structCenter} is domain_concentration[0] with ${p.domainCount} total domains`
    ))
  }

  if (p.hasMultipleThemes) {
    results.push(makeContinuation('clarify',
      `Which ${p.themeCount} pressures converge to create ${p.postureLabel || 'this posture'}?`,
      { object: 'consequence_themes', field: 'length', value: p.themeCount },
      `${p.themeCount} consequence themes exist`
    ))
  }

  return results
}

function deriveImplication(p) {
  const results = []

  if (p.hasDivergence) {
    results.push(makeContinuation('implication',
      `Which delivery decisions are affected by having architecture in ${p.structCenter} and operations in ${p.execCenter}?`,
      { object: 'domain_concentration + execution_center', field: 'divergence', value: true },
      `structural_center (${p.structCenter}) !== execution_center (${p.execCenter})`
    ))
  }

  if (p.hasRuntime) {
    results.push(makeContinuation('implication',
      'What monitoring gaps exist for runtime execution paths?',
      { object: 'signal_interpretations', field: 'RSIG_present', value: true },
      `${p.rsigCount} runtime signals indicate execution dependencies invisible to static analysis`
    ))
  }

  if (p.hasPropagation && p.propagationReceivers.length > 0) {
    results.push(makeContinuation('implication',
      `Which downstream domains (${p.propagationReceivers.join(', ')}) are affected by this propagation?`,
      { object: 'domain_narratives', field: 'receivers', value: p.propagationReceivers },
      `${p.propagationReceivers.length} receiver domains in propagation chain`
    ))
  }

  if (p.structCenter && p.hasMultipleThemes) {
    results.push(makeContinuation('implication',
      'Which delivery decisions become harder because of this structural concentration?',
      { object: 'domain_narratives', field: 'top_domains', value: p.structCenter },
      `multiple themes converge around ${p.structCenter}`
    ))
  }

  return results
}

function deriveChallenge(p) {
  const results = []

  if (p.hasFalsification) {
    results.push(makeContinuation('challenge',
      `Would this finding disappear if ${p.falsificationPath}?`,
      { object: 'FALSIFICATION_PATHS', field: p.surfaceId, value: p.falsificationPath },
      `falsification path defined for ${p.surfaceId}`
    ))
  }

  if (p.hasMultipleThemes) {
    const topTheme = p.themes[0]
    results.push(makeContinuation('challenge',
      `Would addressing ${topTheme.theme_label} alone reduce the systemic scope?`,
      { object: 'consequence_themes[0]', field: 'theme_label', value: topTheme.theme_label },
      `${p.themeCount} themes exist — removing the dominant one may or may not change posture_scope`
    ))
  }

  if (!p.isGoverned) {
    results.push(makeContinuation('challenge',
      'This finding is advisory-only — what would governed qualification change?',
      { object: 'governance_lifecycle', field: 'available', value: false },
      'governance_lifecycle not available — all findings carry advisory weight'
    ))
  }

  if (p.hasDivergence) {
    results.push(makeContinuation('challenge',
      `What evidence would show ${p.structCenter} and ${p.execCenter} are actually converging?`,
      { object: 'execution_center', field: 'convergence_test', value: `${p.structCenter} vs ${p.execCenter}` },
      'divergence exists — convergence is the inverse condition'
    ))
  }

  return results
}

function deriveDescent(p) {
  const results = []

  if (p.hasRuntime && p.rsigCount > 0) {
    results.push(makeContinuation('descent',
      `Show the ${p.rsigCount} runtime signals and their affected domains`,
      { object: 'signal_interpretations', field: 'RSIG[]', value: p.rsigCount },
      `${p.rsigCount} RSIG signals available for inspection`,
      { targetEvidence: 'RSIG', authorityRequired: 2 }
    ))
  }

  if (p.hasCentrality) {
    results.push(makeContinuation('descent',
      'Show the structural authority spines and import graph',
      { object: 'structural_enrichment.centrality', field: 'top_structural_spines', value: 'available' },
      'centrality data available in structural enrichment',
      { targetEvidence: 'centrality' }
    ))
  }

  if (p.hasMultipleThemes) {
    results.push(makeContinuation('descent',
      'Show the condition chain that produces this posture',
      { object: 'crossDomainCognition', field: 'cognition_slices', value: 'available' },
      `${p.themeCount} consequence themes derive from underlying conditions`,
      { targetEvidence: 'cognition_slices' }
    ))
  }

  if (p.hasPropagation) {
    results.push(makeContinuation('descent',
      `Show the propagation chain from ${p.propagationOrigin}`,
      { object: 'domain_narratives', field: 'propagation_roles', value: p.narratives.length },
      `propagation origin ${p.propagationOrigin} with ${p.narratives.length - 1} receivers`,
      { targetEvidence: 'domain_narratives' }
    ))
  }

  return results
}

function deriveAdjacent(p) {
  const results = []

  for (const adjId of p.adjacentSurfaces.slice(0, 2)) {
    const adjName = SURFACE_NAMES[adjId] || adjId
    results.push(makeContinuation('adjacent',
      `Does this finding contribute to ${adjName}?`,
      { object: 'SURFACE_ADJACENCY', field: p.surfaceId, value: adjId },
      `${adjId} is an adjacent cognition surface in the graph`,
      { targetSurface: adjId }
    ))
  }

  if (p.hasDivergence && p.hasRuntime) {
    results.push(makeContinuation('adjacent',
      'Does the structural/execution divergence compound with runtime blindness?',
      { object: 'execution_center + blindness_types', field: 'domain_overlap', value: 'test_required' },
      'both divergence and runtime evidence exist — potential compounding',
      { targetSurface: 'EXECUTION_BLINDNESS' }
    ))
  }

  if (p.hasPropagation && p.structCenter) {
    results.push(makeContinuation('adjacent',
      'Does structural concentration compound with propagation dynamics?',
      { object: 'domain_concentration[0] vs domain_narratives[0]', field: 'domain_match', value: `${p.structCenter} vs ${p.propagationOrigin}` },
      `structural center (${p.structCenter}) may or may not be propagation origin (${p.propagationOrigin})`,
      { targetSurface: 'PROPAGATION_RISK' }
    ))
  }

  return results
}

function deriveAscent(p) {
  const results = []

  results.push(makeContinuation('ascent',
    'How does the BOARDROOM project this finding?',
    { object: 'crossDomainCognition', field: 'posture_label', value: p.postureLabel },
    'BOARDROOM consumes crossDomainCognition as executive synthesis'
  ))

  if (p.postureLabel) {
    results.push(makeContinuation('ascent',
      `What does ${p.postureLabel} mean for how the organization operates?`,
      { object: 'BALANCED.interpret_operational_posture', field: 'posture_label', value: p.postureLabel },
      'BALANCED interprets posture as organizational meaning'
    ))
  }

  if (p.isGoverned) {
    results.push(makeContinuation('ascent',
      'Can these findings be presented with institutional confidence?',
      { object: 'governance_lifecycle', field: 's_level', value: p.governanceLevel },
      `governance_lifecycle available at ${p.governanceLevel}`,
      { authorityRequired: 3 }
    ))
  }

  return results
}

// ─── Main Export ─────────────────────────────────────────────────

// Projection-aware weighting: which continuation types matter most per persona
const PROJECTION_WEIGHTS = {
  boardroom: { ascent: 3, implication: 3, challenge: 2, adjacent: 1, clarify: 0, descent: 0 },
  balanced:  { implication: 3, ascent: 2, adjacent: 2, challenge: 1, clarify: 1, descent: 0 },
  dense:     { clarify: 3, descent: 3, adjacent: 2, implication: 1, challenge: 1, ascent: 0 },
  operator:  { challenge: 3, descent: 3, clarify: 2, adjacent: 1, implication: 0, ascent: 0 },
  thorr:     { implication: 2, challenge: 2, adjacent: 2, descent: 2, clarify: 2, ascent: 2 },
}

function deriveContinuations(surfaceId, cognitionContext, projectionLevel, projectionMode) {
  const ctx = cognitionContext || {}
  const pLevel = projectionLevel || 0
  const mode = projectionMode || 'thorr'
  const weights = PROJECTION_WEIGHTS[mode] || PROJECTION_WEIGHTS.thorr
  const p = detectProperties(surfaceId, ctx)

  const raw = {
    clarify: deriveClarify(p),
    implication: deriveImplication(p),
    challenge: deriveChallenge(p),
    descent: deriveDescent(p),
    adjacent: deriveAdjacent(p),
    ascent: deriveAscent(p),
  }

  const gated = {}
  for (const [type, continuations] of Object.entries(raw)) {
    const weight = weights[type] ?? 1
    gated[type] = continuations
      .filter(() => weight > 0)
      .map(c => ({
        ...c,
        available: pLevel >= (c.authorityRequired || 1),
        weight,
      }))
  }

  return gated
}

module.exports = { deriveContinuations, detectProperties, SURFACE_ADJACENCY, SURFACE_NAMES }

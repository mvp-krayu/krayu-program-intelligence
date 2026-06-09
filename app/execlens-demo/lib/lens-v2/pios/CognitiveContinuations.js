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

function deriveClarify(p, altitude) {
  const results = []

  if (p.hasDivergence) {
    const q = {
      executive: 'Why does the operational risk center differ from where structural investment is concentrated?',
      technical: `Why is ${p.execCenter} the operational authority rather than ${p.structCenter}?`,
      strategic: 'Why does transformation sequencing need to account for two different gravity centers?',
      operational: 'Which coordination assumptions change because structural and operational gravity diverge?',
    }[altitude] || `Why is ${p.execCenter} the execution center rather than ${p.structCenter}?`
    results.push(makeContinuation('clarify', q,
      { object: 'execution_concentration[0]', field: 'domain', value: p.execCenter },
      `execution_center (${p.execCenter}) !== structural_center (${p.structCenter})`
    ))
  }

  if (p.hasRuntime && p.rsigCount > 0) {
    const q = {
      executive: 'Which runtime dependencies create exposure beyond what conventional analysis reveals?',
      technical: 'Which runtime paths create operational pressure invisible to the import graph?',
      strategic: 'Which runtime dependencies create unplanned transformation scope?',
      operational: 'Which runtime execution paths are invisible to current delivery coordination?',
    }[altitude] || 'Which specific runtime paths create pressure?'
    results.push(makeContinuation('clarify', q,
      { object: 'signal_interpretations', field: 'RSIG', value: p.rsigCount },
      `${p.rsigCount} RSIG signals exist`,
      { targetEvidence: 'RSIG', authorityRequired: 2 }
    ))
  }

  if (p.structCenter && p.domainCount > 1) {
    const q = {
      executive: `Why does ${p.structCenter} carry outsized governance significance?`,
      technical: `What makes ${p.structCenter} an operational authority rather than just a large codebase?`,
      strategic: `Why does ${p.structCenter} create transformation drag beyond its apparent size?`,
      operational: `Why does ${p.structCenter} create coordination load beyond its apparent scope?`,
    }[altitude] || `What makes ${p.structCenter} dominant rather than just large?`
    results.push(makeContinuation('clarify', q,
      { object: 'domain_concentration[0]', field: 'domain', value: p.structCenter },
      `${p.structCenter} is domain_concentration[0] with ${p.domainCount} total domains`
    ))
  }

  if (p.hasMultipleThemes) {
    const q = {
      executive: 'Which converging pressures create the systemic governance exposure?',
      technical: `Which ${p.themeCount} pressures create compounding operational risk?`,
      strategic: 'Which converging pressures create transformation sequencing constraints?',
      operational: `Which ${p.themeCount} pressures create compounding delivery coordination risk?`,
    }[altitude] || `Which ${p.themeCount} pressures converge to create ${p.postureLabel || 'this posture'}?`
    results.push(makeContinuation('clarify', q,
      { object: 'consequence_themes', field: 'length', value: p.themeCount },
      `${p.themeCount} consequence themes exist`
    ))
  }

  return results
}

function deriveImplication(p, altitude) {
  const results = []

  if (p.hasDivergence) {
    const q = {
      executive: 'Which investment assumptions are invalidated by structural and operational gravity pointing at different regions?',
      technical: 'Which operational decisions become unreliable because static and runtime blast radii diverge?',
      strategic: 'Which transformation investments are mis-targeted by following structural gravity instead of operational gravity?',
      operational: 'Which delivery coordination decisions are affected by structural and operational pressure pointing at different regions?',
    }[altitude] || `Which delivery decisions are affected by having architecture in ${p.structCenter} and operations in ${p.execCenter}?`
    results.push(makeContinuation('implication', q,
      { object: 'domain_concentration + execution_center', field: 'divergence', value: true },
      `structural_center (${p.structCenter}) !== execution_center (${p.execCenter})`
    ))
  }

  if (p.hasRuntime) {
    const q = {
      executive: 'Which oversight assumptions about system health are unverified by current monitoring?',
      technical: 'Which incident response assumptions are invalidated by runtime dependencies invisible to static analysis?',
      strategic: 'Which adoption timelines are at risk from unmonitored runtime execution paths?',
      operational: 'Which delivery dependencies are invisible to current coordination practices?',
    }[altitude] || 'What monitoring gaps exist for runtime execution paths?'
    results.push(makeContinuation('implication', q,
      { object: 'signal_interpretations', field: 'RSIG_present', value: true },
      `${p.rsigCount} runtime signals indicate execution dependencies invisible to static analysis`
    ))
  }

  if (p.hasPropagation && p.propagationReceivers.length > 0) {
    const q = {
      executive: `Which governance decisions are affected by structural pressure propagating across ${p.propagationReceivers.join(', ')}?`,
      technical: `Which release decisions become unreliable because changes in ${p.propagationOrigin} cascade into ${p.propagationReceivers.join(', ')}?`,
      strategic: `Which modernization investments in ${p.propagationOrigin} carry hidden downstream sequencing risk?`,
      operational: `Which delivery plans are affected by structural pressure propagating from ${p.propagationOrigin}?`,
    }[altitude] || `Which downstream domains (${p.propagationReceivers.join(', ')}) are affected by this propagation?`
    results.push(makeContinuation('implication', q,
      { object: 'domain_narratives', field: 'receivers', value: p.propagationReceivers },
      `${p.propagationReceivers.length} receiver domains in propagation chain`
    ))
  }

  if (p.structCenter && p.hasMultipleThemes) {
    const q = {
      executive: 'Which budget commitments become unreliable because multiple structural pressures converge?',
      technical: 'Which architectural assumptions become unreliable because of compounding structural concentration?',
      strategic: 'Which change capacity assumptions are invalidated by converging structural pressures?',
      operational: 'Which coordination dependencies are hidden by converging structural pressures?',
    }[altitude] || 'Which delivery decisions become harder because of this structural concentration?'
    results.push(makeContinuation('implication', q,
      { object: 'domain_narratives', field: 'top_domains', value: p.structCenter },
      `multiple themes converge around ${p.structCenter}`
    ))
  }

  return results
}

function deriveChallenge(p, altitude) {
  const results = []

  if (p.hasFalsification) {
    const q = {
      executive: 'What evidence would show this risk exposure is overstated?',
      technical: `Would this finding disappear if ${p.falsificationPath}?`,
      strategic: 'What evidence would show this transformation risk is manageable without structural remediation?',
      operational: 'What evidence would show this delivery risk is contained?',
    }[altitude] || `Would this finding disappear if ${p.falsificationPath}?`
    results.push(makeContinuation('challenge', q,
      { object: 'FALSIFICATION_PATHS', field: p.surfaceId, value: p.falsificationPath },
      `falsification path defined for ${p.surfaceId}`
    ))
  }

  if (p.hasMultipleThemes) {
    const topTheme = p.themes[0]
    const q = {
      executive: `Would resolving ${topTheme.theme_label} materially reduce the governance exposure?`,
      technical: `Would addressing ${topTheme.theme_label} alone change the operational decision landscape?`,
      strategic: `Would addressing ${topTheme.theme_label} alone unblock the transformation sequence?`,
      operational: `Would addressing ${topTheme.theme_label} alone reduce delivery coordination complexity?`,
    }[altitude] || `Would addressing ${topTheme.theme_label} alone reduce the systemic scope?`
    results.push(makeContinuation('challenge', q,
      { object: 'consequence_themes[0]', field: 'theme_label', value: topTheme.theme_label },
      `${p.themeCount} themes exist — removing the dominant one may or may not change posture_scope`
    ))
  }

  if (!p.isGoverned) {
    const q = {
      executive: 'What institutional confidence level does this finding carry for board-level decisions?',
      technical: 'This finding is advisory — what would governed qualification change for architectural planning?',
      strategic: 'What confidence level does this finding carry for transformation investment decisions?',
      operational: 'This finding is advisory — what would governed qualification change for delivery planning?',
    }[altitude] || 'This finding is advisory-only — what would governed qualification change?'
    results.push(makeContinuation('challenge', q,
      { object: 'governance_lifecycle', field: 'available', value: false },
      'governance_lifecycle not available — all findings carry advisory weight'
    ))
  }

  if (p.hasDivergence) {
    const q = {
      executive: 'What evidence would show structural and operational risks are converging?',
      technical: `What evidence would show ${p.structCenter} and ${p.execCenter} are actually converging?`,
      strategic: 'What evidence would demonstrate that current transformation targets align with operational gravity?',
      operational: 'What evidence would show structural and operational coordination load is converging?',
    }[altitude] || `What evidence would show ${p.structCenter} and ${p.execCenter} are actually converging?`
    results.push(makeContinuation('challenge', q,
      { object: 'execution_center', field: 'convergence_test', value: `${p.structCenter} vs ${p.execCenter}` },
      'divergence exists — convergence is the inverse condition'
    ))
  }

  return results
}

function deriveDescent(p, altitude) {
  const results = []

  if (p.hasRuntime && p.rsigCount > 0) {
    const q = {
      technical: `Which ${p.rsigCount} runtime signals create the operational dependencies?`,
      operational: `Show the ${p.rsigCount} runtime execution paths and their operational scope`,
    }[altitude] || `Show the ${p.rsigCount} runtime signals and their affected domains`
    results.push(makeContinuation('descent', q,
      { object: 'signal_interpretations', field: 'RSIG[]', value: p.rsigCount },
      `${p.rsigCount} RSIG signals available for inspection`,
      { targetEvidence: 'RSIG', authorityRequired: 2 }
    ))
  }

  if (p.hasCentrality) {
    const q = {
      technical: 'Show which structural spines carry operational authority',
      operational: 'Show the structural authority spines and their delivery impact',
    }[altitude] || 'Show the structural authority spines and import graph'
    results.push(makeContinuation('descent', q,
      { object: 'structural_enrichment.centrality', field: 'top_structural_spines', value: 'available' },
      'centrality data available in structural enrichment',
      { targetEvidence: 'centrality' }
    ))
  }

  if (p.hasMultipleThemes) {
    const q = {
      technical: 'Show the evidence chain that produces this operational posture',
      operational: 'Show the condition chain and its delivery implications',
    }[altitude] || 'Show the condition chain that produces this posture'
    results.push(makeContinuation('descent', q,
      { object: 'crossDomainCognition', field: 'cognition_slices', value: 'available' },
      `${p.themeCount} consequence themes derive from underlying conditions`,
      { targetEvidence: 'cognition_slices' }
    ))
  }

  if (p.hasPropagation) {
    const q = {
      technical: `Show the cascade path from ${p.propagationOrigin} and its operational reach`,
      operational: `Show how changes in ${p.propagationOrigin} propagate to downstream delivery`,
    }[altitude] || `Show the propagation chain from ${p.propagationOrigin}`
    results.push(makeContinuation('descent', q,
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

// Altitude-keyed weighting: derived from PERSONA_PROJECTIONS.altitude
const PROJECTION_WEIGHTS = {
  executive:   { ascent: 3, implication: 3, challenge: 2, adjacent: 1, clarify: 0, descent: 0 },
  strategic:   { implication: 3, challenge: 2, adjacent: 2, ascent: 2, clarify: 1, descent: 0 },
  operational: { implication: 3, ascent: 2, adjacent: 2, challenge: 1, clarify: 1, descent: 0 },
  technical:   { implication: 3, challenge: 2, adjacent: 2, descent: 2, clarify: 1, ascent: 0 },
  structural:  { clarify: 3, descent: 3, adjacent: 2, implication: 1, challenge: 1, ascent: 0 },
  sovereign:   { implication: 2, challenge: 2, adjacent: 2, descent: 2, clarify: 2, ascent: 2 },
}

function selectTopContinuations(gated, maxItems) {
  const n = maxItems || 6
  const guaranteed = []
  const pool = []

  for (const [type, items] of Object.entries(gated)) {
    const avail = items.filter(c => c.available && c.weight > 0)
    if (avail.length > 0) {
      guaranteed.push({ ...avail[0], typeKey: type })
      for (let i = 1; i < avail.length; i++) {
        pool.push({ ...avail[i], typeKey: type })
      }
    }
  }

  guaranteed.sort((a, b) => b.weight - a.weight)
  pool.sort((a, b) => b.weight - a.weight)

  const result = guaranteed.slice(0, n)
  if (result.length < n) {
    result.push(...pool.slice(0, n - result.length))
  }

  result.sort((a, b) => b.weight - a.weight)
  return result
}

function deriveContinuations(surfaceId, cognitionContext, projectionLevel, projectionMode) {
  const ctx = cognitionContext || {}
  const pLevel = projectionLevel || 0
  const mode = projectionMode || 'sovereign'
  const weights = PROJECTION_WEIGHTS[mode] || PROJECTION_WEIGHTS.sovereign
  const p = detectProperties(surfaceId, ctx)

  const raw = {
    clarify: deriveClarify(p, mode),
    implication: deriveImplication(p, mode),
    challenge: deriveChallenge(p, mode),
    descent: deriveDescent(p, mode),
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

  gated.ranked = selectTopContinuations(gated)
  return gated
}

module.exports = { deriveContinuations, detectProperties, SURFACE_ADJACENCY, SURFACE_NAMES }

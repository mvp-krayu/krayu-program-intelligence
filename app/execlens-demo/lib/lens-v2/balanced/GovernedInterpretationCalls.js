// GovernedInterpretationCalls.js
// BALANCED governed narrative interpretation calls.
//
// Each call derives ORGANIZATIONAL MEANING from structural findings.
// Not translation (dictionary). Interpretation (cognition).
//
// The meaning ("your organizational decision-making structure doesn't match
// your architectural reality") does not exist in the structural data.
// It is derived from the data meeting operational context.
//
// Authority: PI.PROJECTION.CONSTITUTION.01 §2.4
// Territory: PI.BALANCED.INTERPRETATION-TERRITORY.01

// ─── Authority Gate ─────────────────────────────────────────────

const CALL_AUTHORITY = {
  interpret_operational_posture: 1,
  interpret_primary_finding: 1,
  interpret_runtime_divergence: 2,
  interpret_execution_blindness: 2,
  interpret_governance_confidence: 3,
  interpret_propagation_dynamics: 1,
  interpret_dependency_amplification: 1,
}

function gateAuthority(callName, projectionLevel) {
  const required = CALL_AUTHORITY[callName]
  if (required == null) return true
  return projectionLevel >= required
}

// ─── Output Schema ──────────────────────────────────────────────

function makeResult(callName, available, narrative, evidenceAnchors, organizationalInsight) {
  return {
    call: callName,
    available,
    narrative: available ? narrative : null,
    organizational_insight: available ? organizationalInsight : null,
    evidence_anchors: available ? evidenceAnchors : [],
    governance: { contract: 'PI.PROJECTION.CONSTITUTION.01 §2.4', deterministic_intent: true },
  }
}

// ─── Governed Interpretation Calls ──────────────────────────────

function interpret_operational_posture(crossDomainCognition, fullReport, projectionLevel) {
  if (!gateAuthority('interpret_operational_posture', projectionLevel)) {
    return makeResult('interpret_operational_posture', false, null, [], null)
  }
  const cdc = crossDomainCognition
  if (!cdc) return makeResult('interpret_operational_posture', false, null, [], null)

  const postureLabel = cdc.posture_label || 'Structural Assessment'
  const themes = (cdc.consequence_themes || [])
  const critCount = themes.filter(t => t.severity === 'CRITICAL' || t.severity === 'HIGH').length
  const domConc = cdc.domain_concentration || []
  const locus = domConc.length > 0 ? domConc[0].domain : null
  const scope = cdc.posture_scope || 'LOCAL'

  const narrative = scope === 'SYSTEMIC'
    ? `This is not a localized problem with a single fix. ${postureLabel} affects multiple teams and delivery streams simultaneously. Remediation requires cross-team coordination — no single team owns this, which is exactly why it persists.`
    : critCount > 1
      ? `${critCount} independent structural pressures converge${locus ? ` around ${locus}` : ''}. Each looks manageable in isolation, but together they constrain delivery coordination across the program. Teams working in this area are likely experiencing slower releases and unexpected side effects without understanding the structural cause.`
      : `Structural pressure concentrates${locus ? ` in ${locus}` : ''}, but the impact is contained. This is a dynamic to monitor, not an emergency — the risk is that unmanaged concentration gradually becomes systemic.`

  const insight = locus
    ? `The team responsible for ${locus} is likely managing more organizational complexity than their scope suggests.`
    : 'No single domain dominates — pressure is distributed across the program.'

  return makeResult('interpret_operational_posture', true, narrative,
    [{ type: 'posture', source: 'ConsequenceCompiler', field: 'posture_label' }],
    insight
  )
}

function interpret_primary_finding(crossDomainCognition, projectionLevel) {
  if (!gateAuthority('interpret_primary_finding', projectionLevel)) {
    return makeResult('interpret_primary_finding', false, null, [], null)
  }
  const themes = (crossDomainCognition && crossDomainCognition.consequence_themes) || []
  if (themes.length === 0) return makeResult('interpret_primary_finding', false, null, [], null)

  const primary = themes[0]
  const domConc = (crossDomainCognition && crossDomainCognition.domain_concentration) || []
  const topDomain = domConc.length > 0 ? domConc[0].domain : null

  const FINDING_INTERPRETATIONS = {
    'Structural Stability Risk': topDomain
      ? `${topDomain} carries compounding structural pressures. Teams working here are likely experiencing unpredictable delivery — not because of poor execution, but because multiple independent forces create instability that no single change can resolve. This is an architectural dynamic, not a team performance issue.`
      : 'Multiple structural pressures compound in the same region. This creates instability that feels like poor execution but is actually architectural.',
    'Systemic Operational Fragility': `The system has evolved into a state where operational failure modes are structural, not incidental. This means improving operational practices alone won't resolve fragility — the architecture itself constrains operational reliability. Investment decisions should account for this: feature velocity and operational stability compete for the same architectural resources.`,
    'Coordination Fragility': topDomain
      ? `Operations on ${topDomain} require coordination across multiple teams that may not know they depend on each other. This hidden coupling means release scheduling, incident response, and change management all carry coordination overhead that isn't visible in project plans.`
      : 'Cross-team coordination dependencies exist that aren\'t reflected in organizational structure. Teams are coupled architecturally but managed independently.',
  }

  const narrative = FINDING_INTERPRETATIONS[primary.theme_label]
    || `${primary.theme_label} is the dominant structural dynamic. ${primary.board_implication || ''} This is not a defect to fix in a sprint — it\'s an architectural characteristic that shapes how the program operates.`

  return makeResult('interpret_primary_finding', true, narrative,
    [{ type: 'consequence_theme', source: 'ConsequenceCompiler', field: primary.theme_label }],
    primary.board_implication || null
  )
}

function interpret_runtime_divergence(crossDomainCognition, projectionLevel) {
  if (!gateAuthority('interpret_runtime_divergence', projectionLevel)) {
    return makeResult('interpret_runtime_divergence', false, null, [], null)
  }
  const cdc = crossDomainCognition
  if (!cdc) return makeResult('interpret_runtime_divergence', false, null, [], null)

  const domConc = cdc.domain_concentration || []
  const structuralCenter = domConc.length > 0 ? domConc[0].domain : null
  const executionCenter = cdc.execution_center || null

  if (!structuralCenter || !executionCenter || structuralCenter.toLowerCase() === executionCenter.toLowerCase()) {
    return makeResult('interpret_runtime_divergence', true,
      structuralCenter
        ? `Structural mass and execution pressure converge on ${structuralCenter}. This simplifies remediation — the team responsible for this region addresses both architectural debt and operational risk in the same work stream. However, it also means this team carries disproportionate organizational responsibility.`
        : 'Insufficient data for divergence analysis.',
      [{ type: 'convergence', source: 'domain_concentration + execution_center', field: 'converged' }],
      structuralCenter ? `The ${structuralCenter} team carries dual responsibility — architectural and operational.` : null
    )
  }

  const narrative = `Your architecture team is probably focused on ${structuralCenter} because that's where code mass sits. But your operations team should be watching ${executionCenter} because that's where execution pressure actually flows. These are different remediation tracks with different owners. Refactoring ${structuralCenter} addresses architectural debt. Hardening ${executionCenter} addresses operational risk. Treating them as one problem will satisfy neither.`

  return makeResult('interpret_runtime_divergence', true, narrative,
    [
      { type: 'structural_center', source: 'domain_concentration[0]', field: structuralCenter },
      { type: 'execution_center', source: 'execution_concentration[0]', field: executionCenter },
    ],
    `Architecture ownership (${structuralCenter}) and operations ownership (${executionCenter}) are split across different regions.`
  )
}

function interpret_execution_blindness(crossDomainCognition, fullReport, projectionLevel) {
  if (!gateAuthority('interpret_execution_blindness', projectionLevel)) {
    return makeResult('interpret_execution_blindness', false, null, [], null)
  }
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const rsigs = sigs.filter(s => s.signal_family === 'RSIG')
  const runtimeDomains = [...new Set(rsigs.flatMap(s => s.affected_domains || []))]

  if (rsigs.length === 0) {
    return makeResult('interpret_execution_blindness', true,
      'No runtime connectivity evidence is available. This doesn\'t mean execution blindness doesn\'t exist — it means the system cannot currently detect it. Static analysis alone cannot reveal failure modes that only manifest at runtime. Until runtime evidence is collected, operational monitoring assumptions should be treated as unverified.',
      [{ type: 'absence', source: 'signal_interpretations', field: 'RSIG count = 0' }],
      'Monitoring confidence is unverified — operational assumptions may not hold.'
    )
  }

  const hasBroker = rsigs.some(s => s.signal_name && s.signal_name.toLowerCase().includes('broker'))
  const hasChoke = rsigs.some(s => s.signal_name && s.signal_name.toLowerCase().includes('choke'))

  const narrative = `Your monitoring won't catch this. ${runtimeDomains.length} domain${runtimeDomains.length !== 1 ? 's carry' : ' carries'} runtime dependencies that are invisible to static analysis and standard health checks. ${hasBroker ? 'All broker-mediated coordination depends on a single path — if it degrades, the system reports healthy while operational capabilities silently fail. ' : ''}${hasChoke ? 'Runtime execution routes through a single gateway — downstream services continue but without the coordination they assume exists. ' : ''}Teams believe the system is healthy because their dashboards reflect code-level health, not execution-level connectivity. Change management processes are blind to this failure class.`

  return makeResult('interpret_execution_blindness', true, narrative,
    rsigs.slice(0, 3).map(s => ({ type: 'RSIG', source: s.signal_id, field: s.signal_name })),
    'Operational monitoring covers code health but not execution connectivity — a blind spot that persists until runtime evidence is acted on.'
  )
}

function interpret_governance_confidence(crossDomainCognition, fullReport, projectionLevel) {
  if (!gateAuthority('interpret_governance_confidence', projectionLevel)) {
    return makeResult('interpret_governance_confidence', false, null, [], null)
  }
  const gl = fullReport && fullReport.governance_lifecycle
  if (!gl || !gl.available) {
    return makeResult('interpret_governance_confidence', true,
      'This intelligence has not passed through governed review. Every finding is advisory — useful for internal discussion but not suitable for executive commitment or external presentation. To move from advisory to governed, the specimen needs operator review of semantic propositions, deterministic replay verification, and constitutional anchor confirmation. Until then, treat conclusions as working hypotheses, not institutional positions.',
      [{ type: 'governance_absent', source: 'governance_lifecycle', field: 'available = false' }],
      'Findings are working hypotheses, not institutional positions.'
    )
  }

  const pc = fullReport.proposition_corpus
  const rv = fullReport.revalidation_intelligence
  const cc = fullReport.chronicle_certification
  const accepted = pc && pc.available ? pc.disposition_counts.accepted : 0
  const rejected = pc && pc.available ? pc.disposition_counts.rejected : 0
  const replayOk = rv && rv.available && rv.status === 'PASS'
  const certified = cc && cc.available && cc.certification_status === 'CERTIFIED'

  const narrative = `You can present these findings to a board with institutional confidence. ${accepted} propositions survived operator review${rejected > 0 ? ` — ${rejected} were challenged and resolved, proving the governance process has teeth` : ''}. ${replayOk ? 'Every conclusion is deterministically replayable — run it again and you get the same answer. ' : ''}${certified ? 'The evidence chain is replay-certified, meaning the full derivation from source code to board conclusion can be independently verified. ' : ''}This is not advisory opinion. This is governed intelligence — the difference between "we think this might be true" and "we have institutionally verified this is true."`

  return makeResult('interpret_governance_confidence', true, narrative,
    [
      { type: 'governance', source: 'governance_lifecycle', field: `${gl.s_level}` },
      pc && pc.available ? { type: 'propositions', source: 'proposition_corpus', field: `${accepted} accepted` } : null,
    ].filter(Boolean),
    replayOk ? 'Intelligence is governed and replayable — suitable for institutional commitment.' : 'Intelligence is governed but replay verification pending.'
  )
}

function interpret_propagation_dynamics(crossDomainCognition, fullReport, projectionLevel) {
  if (!gateAuthority('interpret_propagation_dynamics', projectionLevel)) {
    return makeResult('interpret_propagation_dynamics', false, null, [], null)
  }
  const cdc = crossDomainCognition
  const narratives = (cdc && cdc.domain_narratives) || []
  if (narratives.length === 0) {
    return makeResult('interpret_propagation_dynamics', true,
      'No propagation dynamics detected. Changes in one region do not structurally cascade into others. This is a healthy architectural property — teams can operate independently without hidden coupling.',
      [], 'Teams can operate independently — no hidden propagation coupling detected.'
    )
  }

  const origin = narratives[0]
  const receivers = narratives.slice(1, 4)

  const narrative = `Changes in ${origin.domain} don't stay in ${origin.domain}. They cascade into ${receivers.length > 0 ? receivers.map(r => r.domain).join(', ') : 'downstream regions'} through structural dependencies — not because teams chose to couple these areas, but because the architecture evolved that way. This means release planning for any of these regions is unreliable unless you account for the propagation. Delivery estimation, incident blast radius, and change review scope are all larger than they appear. Teams that don't know they're coupled will continue to be surprised by cross-cutting failures.`

  return makeResult('interpret_propagation_dynamics', true, narrative,
    narratives.slice(0, 3).map(n => ({ type: 'domain_narrative', source: 'domain_concentration', field: n.domain })),
    `Release planning must account for hidden coupling between ${origin.domain} and ${receivers.length} downstream region${receivers.length !== 1 ? 's' : ''}.`
  )
}

function interpret_dependency_amplification(crossDomainCognition, projectionLevel) {
  if (!gateAuthority('interpret_dependency_amplification', projectionLevel)) {
    return makeResult('interpret_dependency_amplification', false, null, [], null)
  }
  const cdc = crossDomainCognition
  const domConc = (cdc && cdc.domain_concentration) || []
  const topDomain = domConc.length > 0 ? domConc[0].domain : null

  if (!topDomain) return makeResult('interpret_dependency_amplification', false, null, [], null)

  const narrative = `The engineering team probably treats ${topDomain} as a shared utility layer — a stable foundation that other teams build on. The topology suggests the opposite. Every strategic initiative now depends on decisions made in ${topDomain}, whether teams realize it or not. This means your delivery roadmap is increasingly governed by the teams maintaining ${topDomain}, not by the teams building features. Investment in ${topDomain} carries amplified risk — both the cost of changing it and the cost of not changing it increase over time. This is not a bug to fix. It is an architectural dynamic to manage.`

  return makeResult('interpret_dependency_amplification', true, narrative,
    [{ type: 'domain_concentration', source: 'domain_concentration[0]', field: topDomain }],
    `The ${topDomain} team governs the program's delivery roadmap more than feature teams realize.`
  )
}

// ─── Registry + Execution ───────────────────────────────────────

const GOVERNED_CALLS = {
  interpret_operational_posture,
  interpret_primary_finding,
  interpret_runtime_divergence,
  interpret_execution_blindness,
  interpret_governance_confidence,
  interpret_propagation_dynamics,
  interpret_dependency_amplification,
}

function executeAll(crossDomainCognition, fullReport, projectionLevel) {
  const results = {}
  for (const [name, fn] of Object.entries(GOVERNED_CALLS)) {
    if (fn.length === 3) {
      results[name] = fn(crossDomainCognition, fullReport, projectionLevel)
    } else {
      results[name] = fn(crossDomainCognition, projectionLevel)
    }
  }
  return results
}

function getAvailableCalls(projectionLevel) {
  return Object.entries(CALL_AUTHORITY)
    .filter(([, required]) => projectionLevel >= required)
    .map(([name]) => name)
}

module.exports = {
  GOVERNED_CALLS,
  CALL_AUTHORITY,
  executeAll,
  getAvailableCalls,
}

// GovernedInterpretationCalls.js
// BALANCED governed narrative interpretation — THORR Lite.
//
// Each call produces multi-section interpretation:
//   meaning → why_it_matters → who_should_care → operational_consequence → evidence_basis
//
// Authority: PI.PROJECTION.CONSTITUTION.01 §2.4

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

function makeResult(callName, available, sections, evidenceAnchors, hook) {
  return {
    call: callName,
    available,
    hook: available ? hook : null,
    sections: available ? sections : null,
    evidence_anchors: available ? evidenceAnchors : [],
  }
}

// ─── Calls ──────────────────────────────────────────────────────

function interpret_operational_posture(cdc, fullReport, projectionLevel) {
  if (!gateAuthority('interpret_operational_posture', projectionLevel)) return makeResult('interpret_operational_posture', false, null, [], null)
  if (!cdc) return makeResult('interpret_operational_posture', false, null, [], null)

  const themes = cdc.consequence_themes || []
  const critCount = themes.filter(t => t.severity === 'CRITICAL' || t.severity === 'HIGH').length
  const domConc = cdc.domain_concentration || []
  const locus = domConc.length > 0 ? domConc[0].domain : null
  const scope = cdc.posture_scope || 'LOCAL'

  return makeResult('interpret_operational_posture', true, {
    meaning: scope === 'SYSTEMIC'
      ? `This is not a localized problem with a single fix. ${cdc.posture_label || 'Structural pressure'} affects multiple teams and delivery streams simultaneously. No single team owns this — which is exactly why it persists.`
      : `${critCount} structural pressure${critCount !== 1 ? 's' : ''} converge${locus ? ` around ${locus}` : ''}. Each looks manageable in isolation. Together they constrain delivery coordination across the program.`,
    why_it_matters: locus
      ? `Teams working in ${locus} are likely experiencing slower releases and unexpected side effects without understanding the structural cause. This is not a team performance issue — it is an architectural dynamic.`
      : 'Pressure distribution means no single bottleneck is obvious, but cumulative structural load slows the entire program.',
    who_should_care: scope === 'SYSTEMIC'
      ? ['Program leadership', 'All delivery teams', 'Architecture governance']
      : ['Engineering leadership', `${locus || 'Primary domain'} team`, 'Release management'],
    operational_consequence: scope === 'SYSTEMIC'
      ? 'Remediation requires cross-team coordination. Fixing one pressure without addressing the others may not materially improve stability.'
      : `Delivery estimation for ${locus || 'the primary domain'} is unreliable until the structural concentration is addressed.`,
  },
    [{ type: 'posture', source: 'ConsequenceCompiler', field: cdc.posture_label || 'posture' }],
    critCount > 1 ? `${critCount} pressures converge — no single team owns this` : `Pressure concentrates${locus ? ` in ${locus}` : ''}`
  )
}

function interpret_primary_finding(cdc, projectionLevel) {
  if (!gateAuthority('interpret_primary_finding', projectionLevel)) return makeResult('interpret_primary_finding', false, null, [], null)
  const themes = (cdc && cdc.consequence_themes) || []
  if (themes.length === 0) return makeResult('interpret_primary_finding', false, null, [], null)

  const primary = themes[0]
  const domConc = (cdc && cdc.domain_concentration) || []
  const topDomain = domConc.length > 0 ? domConc[0].domain : null

  return makeResult('interpret_primary_finding', true, {
    meaning: topDomain
      ? `${topDomain} carries compounding structural pressures. Teams here experience unpredictable delivery — not because of poor execution, but because multiple independent forces create instability that no single change resolves.`
      : `${primary.theme_label} is the dominant structural dynamic. This is an architectural characteristic, not a defect to fix in a sprint.`,
    why_it_matters: primary.board_implication || 'This dynamic shapes how the program operates — delivery velocity, change risk, and coordination overhead are all affected.',
    who_should_care: topDomain
      ? [`${topDomain} team`, 'Architecture leadership', 'Delivery management']
      : ['Engineering leadership', 'Architecture governance'],
    operational_consequence: `Investment decisions should account for this: feature velocity and operational stability compete for the same architectural resources${topDomain ? ` in ${topDomain}` : ''}.`,
  },
    [{ type: 'consequence_theme', source: 'ConsequenceCompiler', field: primary.theme_label }],
    `${primary.theme_label}${topDomain ? ` — concentrated in ${topDomain}` : ''}`
  )
}

function interpret_runtime_divergence(cdc, projectionLevel) {
  if (!gateAuthority('interpret_runtime_divergence', projectionLevel)) return makeResult('interpret_runtime_divergence', false, null, [], null)
  if (!cdc) return makeResult('interpret_runtime_divergence', false, null, [], null)

  const domConc = cdc.domain_concentration || []
  const structural = domConc.length > 0 ? domConc[0].domain : null
  const execution = cdc.execution_center || null

  if (!structural || !execution || structural.toLowerCase() === execution.toLowerCase()) {
    if (!structural) return makeResult('interpret_runtime_divergence', false, null, [], null)
    return makeResult('interpret_runtime_divergence', true, {
      meaning: `Structural mass and execution pressure converge on ${structural}. This simplifies remediation — one region addresses both architectural debt and operational risk.`,
      why_it_matters: `The ${structural} team carries dual responsibility. This is efficient but fragile — a single team becomes the program's critical path.`,
      who_should_care: [`${structural} team`, 'Engineering leadership'],
      operational_consequence: `Capacity planning for ${structural} must account for both architectural and operational demands.`,
    }, [{ type: 'convergence', source: 'domain_concentration', field: structural }],
      `Structural and execution pressure converge on ${structural}`
    )
  }

  return makeResult('interpret_runtime_divergence', true, {
    meaning: `Your architecture team is focused on ${structural} because that's where code mass sits. Your operations team should be watching ${execution} because that's where execution pressure flows. These are different remediation tracks with different owners.`,
    why_it_matters: `Refactoring ${structural} addresses architectural debt. Hardening ${execution} addresses operational risk. Treating them as one problem satisfies neither.`,
    who_should_care: [`${structural} architecture owner`, `${execution} operations owner`, 'Program leadership'],
    operational_consequence: `Roadmap planning must distinguish between architectural investment (${structural}) and operational investment (${execution}). Teams don't realize they need both.`,
  },
    [{ type: 'structural_center', source: 'domain_concentration[0]', field: structural }, { type: 'execution_center', source: 'execution_concentration[0]', field: execution }],
    `Architecture (${structural}) and operations (${execution}) are split`
  )
}

function interpret_execution_blindness(cdc, fullReport, projectionLevel) {
  if (!gateAuthority('interpret_execution_blindness', projectionLevel)) return makeResult('interpret_execution_blindness', false, null, [], null)
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const rsigs = sigs.filter(s => s.signal_family === 'RSIG')
  const runtimeDomains = [...new Set(rsigs.flatMap(s => s.affected_domains || []))]

  if (rsigs.length === 0) return makeResult('interpret_execution_blindness', true, {
    meaning: 'No runtime connectivity evidence is available. The system may have blind spots that static analysis cannot detect.',
    why_it_matters: 'Operational monitoring assumptions are unverified. Teams may believe coverage is complete when it is not.',
    who_should_care: ['Operations leadership', 'Monitoring team'],
    operational_consequence: 'Until runtime evidence is collected, treat monitoring confidence as unverified.',
  }, [{ type: 'absence', source: 'RSIG', field: 'count = 0' }], 'Runtime blind spots may exist — unverified')

  return makeResult('interpret_execution_blindness', true, {
    meaning: `Your monitoring won't catch this. ${runtimeDomains.length} domain${runtimeDomains.length !== 1 ? 's carry' : ' carries'} runtime dependencies invisible to static analysis. The system reports healthy while operational capabilities silently degrade.`,
    why_it_matters: 'Teams believe the system is healthy because dashboards reflect code-level health, not execution-level connectivity. Change management processes are blind to this failure class.',
    who_should_care: ['Operations leadership', 'Monitoring/observability team', 'Incident response'],
    operational_consequence: `Broker-mediated coordination, event routing, and runtime gateways represent single points of failure across ${runtimeDomains.length} domain${runtimeDomains.length !== 1 ? 's' : ''}. Standard health checks will not detect degradation.`,
  },
    rsigs.slice(0, 3).map(s => ({ type: 'RSIG', source: s.signal_id, field: s.signal_name })),
    `${runtimeDomains.length} domains carry invisible failure modes`
  )
}

function interpret_governance_confidence(cdc, fullReport, projectionLevel) {
  if (!gateAuthority('interpret_governance_confidence', projectionLevel)) return makeResult('interpret_governance_confidence', false, null, [], null)
  const gl = fullReport && fullReport.governance_lifecycle
  if (!gl || !gl.available) return makeResult('interpret_governance_confidence', true, {
    meaning: 'This intelligence has not passed through governed review. Every finding is advisory — useful for discussion but not suitable for executive commitment.',
    why_it_matters: 'Advisory findings require caveats in every presentation. Governed findings carry institutional weight.',
    who_should_care: ['Executive sponsors', 'Governance officers'],
    operational_consequence: 'To move from advisory to governed: operator review of semantic propositions, deterministic replay, and constitutional anchor confirmation.',
  }, [{ type: 'governance_absent', source: 'governance_lifecycle', field: 'not available' }], 'Advisory only — not yet governed')

  const pc = fullReport.proposition_corpus
  const rv = fullReport.revalidation_intelligence
  const cc = fullReport.chronicle_certification
  const accepted = pc && pc.available ? pc.disposition_counts.accepted : 0
  const rejected = pc && pc.available ? pc.disposition_counts.rejected : 0
  const replayOk = rv && rv.available && rv.status === 'PASS'
  const certified = cc && cc.available && cc.certification_status === 'CERTIFIED'

  return makeResult('interpret_governance_confidence', true, {
    meaning: `You can present these findings with institutional confidence. ${accepted} propositions survived operator review${rejected > 0 ? ` — ${rejected} were challenged and resolved, proving governance has teeth` : ''}. ${replayOk ? 'Every conclusion is deterministically replayable.' : ''} ${certified ? 'The evidence chain is replay-certified.' : ''}`,
    why_it_matters: 'This is not advisory opinion. This is governed intelligence — the difference between "we think" and "we have institutionally verified."',
    who_should_care: ['Board/executive sponsors', 'Compliance/governance', 'Program leadership'],
    operational_consequence: replayOk ? 'Findings can be cited in board materials, compliance documentation, and investment decisions without qualification.' : 'Findings carry governed weight but full replay certification is pending.',
  },
    [{ type: 'governance', source: 'governance_lifecycle', field: gl.s_level }],
    replayOk ? 'Governed and replayable — institutional confidence' : `${gl.s_level} governed — ${accepted} propositions accepted`
  )
}

function interpret_propagation_dynamics(cdc, fullReport, projectionLevel) {
  if (!gateAuthority('interpret_propagation_dynamics', projectionLevel)) return makeResult('interpret_propagation_dynamics', false, null, [], null)
  const narratives = (cdc && cdc.domain_narratives) || []
  if (narratives.length === 0) return makeResult('interpret_propagation_dynamics', true, {
    meaning: 'No propagation dynamics detected. Changes in one region do not structurally cascade into others.',
    why_it_matters: 'Teams can operate independently — a healthy architectural property.',
    who_should_care: [],
    operational_consequence: 'No hidden coupling detected.',
  }, [], 'No propagation coupling detected')

  const origin = narratives[0]
  const receivers = narratives.slice(1, 4)

  return makeResult('interpret_propagation_dynamics', true, {
    meaning: `Changes in ${origin.domain} don't stay in ${origin.domain}. They cascade into ${receivers.map(r => r.domain).join(', ')} through structural dependencies — not because teams chose to couple these areas, but because the architecture evolved that way.`,
    why_it_matters: `Release planning, incident blast radius, and change review scope are all larger than they appear. Teams that don't know they're coupled will continue to be surprised by cross-cutting failures.`,
    who_should_care: [`${origin.domain} team`, ...receivers.slice(0, 2).map(r => `${r.domain} team`), 'Release management'],
    operational_consequence: `Delivery estimation for any of these regions is unreliable unless propagation is accounted for. A "small change" in ${origin.domain} can cascade into ${receivers.length} downstream region${receivers.length !== 1 ? 's' : ''}.`,
  },
    narratives.slice(0, 3).map(n => ({ type: 'domain_narrative', source: 'domain_concentration', field: n.domain })),
    `Changes in ${origin.domain} cascade into ${receivers.length} region${receivers.length !== 1 ? 's' : ''}`
  )
}

function interpret_dependency_amplification(cdc, projectionLevel) {
  if (!gateAuthority('interpret_dependency_amplification', projectionLevel)) return makeResult('interpret_dependency_amplification', false, null, [], null)
  const domConc = (cdc && cdc.domain_concentration) || []
  const topDomain = domConc.length > 0 ? domConc[0].domain : null
  if (!topDomain) return makeResult('interpret_dependency_amplification', false, null, [], null)

  return makeResult('interpret_dependency_amplification', true, {
    meaning: `${topDomain} behaves less like a shared utility and more like an execution authority. Teams think they own feature delivery, but delivery velocity is increasingly governed by decisions made in ${topDomain}.`,
    why_it_matters: `This creates a hidden prioritization problem. Small changes in ${topDomain} affect multiple delivery streams simultaneously while feature teams remain unaware of the dependency.`,
    who_should_care: [`${topDomain} team`, 'Feature delivery teams', 'Engineering leadership', 'Release management'],
    operational_consequence: `Roadmap commitments become coupled to ${topDomain} change velocity. Investment in ${topDomain} carries amplified risk — both the cost of changing it and the cost of not changing it increase over time.`,
  },
    [{ type: 'domain_concentration', source: 'domain_concentration[0]', field: topDomain }],
    `${topDomain} governs the roadmap more than feature teams realize`
  )
}

// ─── Registry ───────────────────────────────────────────────────

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

module.exports = { GOVERNED_CALLS, CALL_AUTHORITY, executeAll }

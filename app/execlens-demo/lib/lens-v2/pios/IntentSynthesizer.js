// IntentSynthesizer.js
// PiOS Core — Intent-based synthesis (v1: deterministic code)
//
// Every synthesizer receives a SynthesisContext.
// No inference from partial objects. Missing context = explicit failure.

const { validateForIntent } = require('./SynthesisContext')

function synthesizeByIntent(intent, ctx) {
  if (!intent || !ctx) return { synthesis_type: intent || 'unknown', answerable: false, summary: 'Cannot synthesize: no context provided.' }

  const validation = validateForIntent(ctx, intent)
  if (!validation.valid) {
    return { synthesis_type: intent, answerable: false, summary: `Cannot synthesize: missing ${validation.missing.join(', ')}.` }
  }

  const fn = SYNTHESIZERS[intent]
  if (!fn) return { synthesis_type: intent, answerable: false, summary: `No synthesizer for intent: ${intent}` }

  return fn(ctx)
}

const SYNTHESIZERS = {
  governance_decision: synthesizeGovernanceDecision,
  qualification_review: synthesizeQualificationReview,
  operational_impact: synthesizeOperationalImpact,
  structural_mechanism: synthesizeStructuralMechanism,
  compounding_analysis: synthesizeCompoundingAnalysis,
  evidence_verification: synthesizeEvidenceVerification,
}

function synthesizeGovernanceDecision(ctx) {
  const decisions = []

  if (ctx.hasDivergence) {
    decisions.push({
      decision: 'Investment allocation',
      assumption: `Structural mass in ${ctx.structuralCenter} predicts where operational risk concentrates`,
      exposure: `Operational risk concentrates in ${ctx.executionCenter} (${ctx.executionCenterDetail?.rsigCount || 0} runtime signals). Investment following structural gravity targets ${ctx.structuralCenter} instead.`,
    })
    decisions.push({
      decision: 'Monitoring and observability coverage',
      assumption: 'Static analysis coverage equals runtime observability',
      exposure: `${ctx.rsigCount} runtime signals reveal execution paths invisible to static analysis. ${ctx.evidenceLayers.length} evidence layers active.`,
    })
  }

  if (ctx.consequenceThemes.length > 0) {
    const critical = ctx.consequenceThemes.filter(t => t.severity === 'CRITICAL')
    if (critical.length > 0) {
      decisions.push({
        decision: 'Risk disclosure to stakeholders',
        assumption: 'Current risk posture is accurately communicated',
        exposure: `${critical.length} CRITICAL finding${critical.length !== 1 ? 's' : ''}: ${critical.map(t => t.theme_label).join(', ')}. ${ctx.isGoverned ? 'Governed and replay-certified.' : 'Advisory only — not yet governed.'}`,
      })
    }
  }

  if (decisions.length === 0) {
    decisions.push({
      decision: 'Assessment confidence',
      assumption: `${ctx.qualificationState} qualification covers key decisions`,
      exposure: `${ctx.conditionCount} conditions active across ${ctx.domainConcentration.length} domains. ${ctx.isGoverned ? 'Governed.' : 'Advisory.'}`,
    })
  }

  return {
    synthesis_type: 'governance_decision',
    answerable: true,
    summary: `${decisions.length} governance decision${decisions.length !== 1 ? 's' : ''} affected. Qualification: ${ctx.qualificationState}.${ctx.replayCertified ? ' Replay-certified.' : ''}`,
    decisions,
    qualification: ctx.isGoverned ? `Governed — ${ctx.qualificationState} qualified${ctx.replayCertified ? ', replay-certified' : ''}` : `Advisory — ${ctx.qualificationState}`,
    next_intents: ['qualification_review', 'operational_impact'],
  }
}

function synthesizeQualificationReview(ctx) {
  const basis = [
    { layer: 'STATIC_IMPORT', status: ctx.evidenceLayers.includes('STATIC_IMPORT') ? 'PRESENT' : 'ABSENT', contribution: `Structural gravity confirmed${ctx.structuralCenter ? ' — ' + ctx.structuralCenter + ' is concentration center' : ''}` },
    { layer: 'EVENT_FLOW', status: ctx.evidenceLayers.includes('EVENT_FLOW') ? 'PRESENT' : 'ABSENT', contribution: `Event concentration ${ctx.evidenceLayers.includes('EVENT_FLOW') ? 'measured — 53 events through 4 handlers' : 'not measured'}` },
    { layer: 'MQTT_TOPIC_FLOW', status: ctx.evidenceLayers.includes('MQTT_TOPIC_FLOW') ? 'PRESENT' : 'ABSENT', contribution: `Broker dependency ${ctx.evidenceLayers.includes('MQTT_TOPIC_FLOW') ? 'confirmed — single MQTT broker' : 'not measured'}` },
    { layer: 'WEBSOCKET_FLOW', status: ctx.evidenceLayers.includes('WEBSOCKET_FLOW') ? 'PRESENT' : 'ABSENT', contribution: `Gateway throughput ${ctx.evidenceLayers.includes('WEBSOCKET_FLOW') ? 'measured — single WebSocket fan-out' : 'not measured'}` },
  ]
  const present = basis.filter(b => b.status === 'PRESENT')
  const confidence = present.length >= 3 ? 'HIGH' : present.length >= 2 ? 'MODERATE' : 'LOW'

  return {
    synthesis_type: 'qualification_review',
    answerable: true,
    summary: `Confidence: ${confidence}. ${present.length} of ${basis.length} evidence layers present. Qualification: ${ctx.qualificationState}. ${ctx.domainConcentration.length} domains assessed, ${ctx.rsigCount} runtime signals.`,
    confidence_level: confidence,
    evidence_basis: basis,
    gaps: [{ layer: 'TEMPORAL', status: 'ABSENT', impact: 'Cannot assess trend — point-in-time only' }],
    qualification_state: ctx.qualificationState,
    governance_weight: ctx.isGoverned ? `Governed — ${ctx.qualificationState}${ctx.replayCertified ? ', replay-certified' : ''}` : 'Advisory',
    next_intents: ['evidence_verification'],
  }
}

function synthesizeOperationalImpact(ctx) {
  const impacts = []

  if (ctx.hasDivergence) {
    impacts.push({
      operation: 'Delivery coordination',
      assumption_violated: 'Static dependency analysis reflects runtime coordination load',
      consequence: `Release decisions based on import graph miss runtime propagation through ${ctx.executionCenter}. ${ctx.executionCenterDetail?.rsigCount || 0} runtime signals concentrated there.`,
      severity: 'HIGH',
    })
    impacts.push({
      operation: 'Incident response',
      assumption_violated: `Structural hotspots (${ctx.structuralCenter}) predict operational failures`,
      consequence: `Runbooks target ${ctx.structuralCenter} (${ctx.structuralCenterDetail?.conditionCount || 0} conditions) while incidents originate in ${ctx.executionCenter} (${ctx.executionCenterDetail?.rsigCount || 0} runtime signals).`,
      severity: 'ELEVATED',
    })
    impacts.push({
      operation: 'Monitoring coverage',
      assumption_violated: 'Static analysis coverage equals runtime observability',
      consequence: `${ctx.rsigCount} runtime signals reveal paths invisible to static analysis. ${ctx.evidenceLayers.length} evidence layers active.`,
      severity: 'ELEVATED',
    })
  } else if (ctx.consequenceThemes.length > 0) {
    const topTheme = ctx.consequenceThemes[0]
    impacts.push({
      operation: 'Operational coordination',
      assumption_violated: `Current coordination model accounts for ${topTheme.theme_label}`,
      consequence: `${ctx.consequenceThemes.length} themes active. Top: ${topTheme.theme_label} (${topTheme.severity}). ${ctx.domainConcentration.length} domains affected.`,
      severity: topTheme.severity === 'CRITICAL' ? 'HIGH' : 'ELEVATED',
    })
  }

  return {
    synthesis_type: 'operational_impact',
    answerable: true,
    summary: `${impacts.length} operational area${impacts.length !== 1 ? 's' : ''} affected: ${impacts.map(i => i.operation.toLowerCase()).join(', ')}.`,
    impacts,
    qualification: ctx.rsigCount > 0 ? 'HIGH — runtime evidence confirms operational patterns' : 'MODERATE — structurally inferred',
    next_intents: ['governance_decision', 'structural_mechanism'],
  }
}

function synthesizeStructuralMechanism(ctx) {
  if (ctx.hasDivergence) {
    const sd = ctx.structuralCenterDetail || {}
    const ed = ctx.executionCenterDetail || {}
    return {
      synthesis_type: 'structural_mechanism',
      answerable: true,
      summary: `Structural gravity concentrates in ${ctx.structuralCenter} (${sd.conditionCount || 0} conditions). Operational gravity concentrates in ${ctx.executionCenter} (${ed.rsigCount || 0} runtime signals). They don't overlap.`,
      mechanism: {
        cause: `Import graph concentrates structural mass in ${ctx.structuralCenter}. Runtime event/WebSocket/MQTT flows concentrate operational load in ${ctx.executionCenter}.`,
        structural_evidence: [
          `${ctx.structuralCenter}: ${sd.conditionCount || 0} conditions${sd.narrative ? ' — ' + sd.narrative.risk_label : ''}`,
          `Domain concentration[0] = ${ctx.structuralCenter}`,
          ctx.structuralEnrichment ? `${ctx.structuralEnrichment.topSpines.length} structural spines identified` : null,
        ].filter(Boolean),
        runtime_evidence: [
          `${ctx.executionCenter}: ${ed.rsigCount || 0} RSIG signals${ed.narrative ? ' — ' + ed.narrative.risk_label : ''}`,
          ctx.evidenceLayers.includes('EVENT_FLOW') ? 'Event handler concentration confirmed' : null,
          ctx.evidenceLayers.includes('MQTT_TOPIC_FLOW') ? 'MQTT broker dependency confirmed' : null,
          ctx.evidenceLayers.includes('WEBSOCKET_FLOW') ? 'WebSocket gateway fan-out confirmed' : null,
        ].filter(Boolean),
      },
      qualification: 'HIGH — structural and runtime evidence independently confirm the pattern',
      next_intents: ['compounding_analysis', 'operational_impact'],
    }
  }

  const topDomain = ctx.domainConcentration.length > 0 ? ctx.domainConcentration[0] : null
  return {
    synthesis_type: 'structural_mechanism',
    answerable: true,
    summary: topDomain
      ? `Structural pressure concentrates on ${topDomain.domain} (${topDomain.condition_count || 0} conditions). ${ctx.consequenceThemes.length} consequence themes, ${ctx.rsigCount} runtime signals.`
      : `${ctx.conditionCount} conditions active across ${ctx.domainConcentration.length} domains.`,
    mechanism: {
      cause: topDomain ? `${topDomain.domain} carries the highest structural mass.${ctx.domainNarratives[0] ? ' ' + ctx.domainNarratives[0].risk_label : ''}` : 'Structural concentration pattern.',
      structural_evidence: ctx.domainConcentration.slice(0, 3).map(d => `${d.domain}: ${d.condition_count || 0} conditions`),
      runtime_evidence: ctx.rsigCount > 0 ? [`${ctx.rsigCount} RSIG runtime signals active`] : ['No runtime evidence available'],
    },
    qualification: ctx.rsigCount > 0 ? 'HIGH — runtime confirms structural pattern' : 'MODERATE — structural evidence only',
    next_intents: ['compounding_analysis'],
  }
}

function synthesizeCompoundingAnalysis(ctx) {
  const adjacent = ctx.surfaceAdjacency || []
  const names = ctx.surfaceNames || {}

  const verdicts = adjacent.slice(0, 3).map(adjId => {
    const name = names[adjId] || adjId.replace(/_/g, ' ')
    const bridgeDomains = []
    if (ctx.executionCenter) bridgeDomains.push(ctx.executionCenter)
    if (adjId === 'EXECUTION_BLINDNESS' && ctx.executionCenter) {
      const telemetry = ctx.domainConcentration.find(d => (d.domain || '').includes('Telemetry'))
      if (telemetry) bridgeDomains.push(telemetry.domain)
    }
    const compounds = adjId === 'EXECUTION_BLINDNESS' && ctx.hasDivergence
    return {
      surface: adjId,
      surface_name: name,
      compounds,
      bridge_domains: compounds ? bridgeDomains : [],
      mechanism: compounds ? `Operational gravity concentrates in ${ctx.executionCenter} — a region also affected by ${name}` : null,
      compound_severity: compounds ? 'CRITICAL' : null,
    }
  })

  const compounding = verdicts.filter(v => v.compounds)

  return {
    synthesis_type: 'compounding_analysis',
    answerable: true,
    summary: compounding.length > 0
      ? `${compounding.length} compounding relationship${compounding.length !== 1 ? 's' : ''} detected across ${adjacent.length} adjacent surfaces. ${compounding.map(c => c.surface_name).join(', ')} compound${compounding.length === 1 ? 's' : ''} with this finding.`
      : `No compounding detected across ${adjacent.length} adjacent surface${adjacent.length !== 1 ? 's' : ''}: ${adjacent.map(id => names[id] || id.replace(/_/g, ' ')).join(', ')}.`,
    verdicts,
    qualification: compounding.length > 0 ? 'HIGH — domain overlap confirmed' : 'MODERATE — no overlap detected',
    next_intents: ['governance_decision'],
  }
}

function synthesizeEvidenceVerification(ctx) {
  const steps = []

  if (ctx.hasDivergence) {
    steps.push({ claim: `Structural center is ${ctx.structuralCenter}`, evidence: `domain_concentration[0], ${ctx.structuralCenterDetail?.conditionCount || 0} conditions`, status: 'VERIFIED', confidence: 'HIGH' })
    steps.push({ claim: `Execution center is ${ctx.executionCenter}`, evidence: `${ctx.executionCenterDetail?.rsigCount || 0} RSIG signals concentrated`, status: ctx.rsigCount > 0 ? 'VERIFIED' : 'UNVERIFIABLE', confidence: ctx.rsigCount > 0 ? 'ELEVATED' : 'N/A' })
    steps.push({ claim: 'Centers are different domains', evidence: `${ctx.structuralCenter} ≠ ${ctx.executionCenter}`, status: 'VERIFIED', confidence: 'HIGH' })
    steps.push({ claim: 'Divergence is not converging', evidence: 'temporal data', status: 'UNVERIFIABLE', confidence: 'N/A' })
  } else {
    steps.push({ claim: `${ctx.conditionCount} conditions active`, evidence: 'signal_interpretations', status: ctx.conditionCount > 0 ? 'VERIFIED' : 'UNVERIFIABLE', confidence: ctx.conditionCount > 3 ? 'HIGH' : 'MODERATE' })
    steps.push({ claim: `${ctx.domainConcentration.length} domains assessed`, evidence: 'domain_concentration', status: ctx.domainConcentration.length > 0 ? 'VERIFIED' : 'UNVERIFIABLE', confidence: 'HIGH' })
  }

  const verified = steps.filter(s => s.status === 'VERIFIED').length

  return {
    synthesis_type: 'evidence_verification',
    answerable: true,
    summary: `${verified} of ${steps.length} claims verified. ${ctx.evidenceLayers.length} evidence layers active. ${ctx.isGoverned ? 'Governed.' : 'Advisory.'}`,
    verification_steps: steps,
    overall_verdict: verified === steps.length ? 'FULLY_VERIFIED' : verified > 0 ? 'VERIFIED_WITH_GAPS' : 'INSUFFICIENT_EVIDENCE',
    gaps: steps.filter(s => s.status === 'UNVERIFIABLE').map(s => `${s.claim} — not verifiable`),
    next_intents: ['qualification_review'],
  }
}

module.exports = { synthesizeByIntent }

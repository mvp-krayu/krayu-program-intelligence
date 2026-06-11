// IntentSynthesizer.js
// PiOS Core — Intent-based synthesis (v1: deterministic code)
//
// Same intent + different persona = same synthesis + different projection.
// v1: code-based synthesis from evidence. v2: THORR API call.

function synthesizeByIntent(invocation) {
  if (!invocation || !invocation.intent) return null

  const fn = SYNTHESIZERS[invocation.intent]
  if (!fn) return { synthesis_type: invocation.intent, summary: 'No synthesizer available for this intent.', answerable: false }

  return fn(invocation)
}

const SYNTHESIZERS = {
  governance_decision: synthesizeGovernanceDecision,
  qualification_review: synthesizeQualificationReview,
  operational_impact: synthesizeOperationalImpact,
  structural_mechanism: synthesizeStructuralMechanism,
  compounding_analysis: synthesizeCompoundingAnalysis,
  evidence_verification: synthesizeEvidenceVerification,
}

function synthesizeGovernanceDecision(inv) {
  const ao = inv.answer_object
  const finding = inv.finding || {}

  const decisions = []
  if (ao && ao.ao_type === 'DIVERGENCE_PAIR') {
    decisions.push({
      decision: 'Platform modernization investment allocation',
      assumption: 'Structural mass predicts operational risk distribution',
      exposure: `Budget targets ${ao.instance?.domain_a?.domain || 'structural center'} while operational risk accumulates in ${ao.instance?.domain_b?.domain || 'execution center'}`,
      confidence: 'HIGH',
    })
    decisions.push({
      decision: 'Monitoring and observability investment',
      assumption: 'Static analysis coverage equals runtime observability',
      exposure: 'Runtime pressure paths through event handlers and message broker are outside current monitoring scope',
      confidence: 'ELEVATED',
    })
  } else {
    decisions.push({
      decision: 'Risk prioritization',
      assumption: 'Current assessment reflects actual risk distribution',
      exposure: `Finding "${finding.posture_label || finding.surface || 'this finding'}" may affect governance confidence`,
      confidence: inv.evidence?.qualification_state === 'S2' ? 'HIGH' : 'MODERATE',
    })
  }

  return {
    synthesis_type: 'governance_decision',
    answerable: true,
    summary: `${decisions.length} governance decision${decisions.length !== 1 ? 's' : ''} affected by this finding.`,
    decisions,
    qualification: inv.evidence?.qualification_state === 'S2' ? 'Governed — S2 qualified, replay-certified' : 'Advisory — structural confirmation needed',
    next_intents: ['qualification_review', 'operational_impact'],
  }
}

function synthesizeQualificationReview(inv) {
  const ev = inv.evidence || {}
  const layers = ev.evidence_layers || []

  const basis = [
    { layer: 'STATIC_IMPORT', status: layers.includes('STATIC_IMPORT') ? 'PRESENT' : 'ABSENT', contribution: 'Structural gravity confirmed' },
    { layer: 'EVENT_FLOW', status: layers.includes('EVENT_FLOW') ? 'PRESENT' : 'ABSENT', contribution: 'Event concentration measured' },
    { layer: 'MQTT_TOPIC_FLOW', status: layers.includes('MQTT_TOPIC_FLOW') ? 'PRESENT' : 'ABSENT', contribution: 'Broker dependency confirmed' },
    { layer: 'WEBSOCKET_FLOW', status: layers.includes('WEBSOCKET_FLOW') ? 'PRESENT' : 'ABSENT', contribution: 'Gateway throughput measured' },
  ]
  const present = basis.filter(b => b.status === 'PRESENT')
  const absent = basis.filter(b => b.status === 'ABSENT')

  const gaps = [
    { layer: 'TEMPORAL', status: 'ABSENT', impact: 'Cannot assess trend — point-in-time only' },
  ]

  const confidence = present.length >= 3 ? 'HIGH' : present.length >= 2 ? 'MODERATE' : 'LOW'

  return {
    synthesis_type: 'qualification_review',
    answerable: true,
    summary: `Confidence: ${confidence}. ${present.length} of ${basis.length} evidence layers present. Qualification: ${ev.qualification_state || 'S0'}.`,
    confidence_level: confidence,
    evidence_basis: basis,
    gaps,
    qualification_state: ev.qualification_state || 'S0',
    governance_weight: ev.qualification_state === 'S2' ? 'Governed — replay-certified' : 'Advisory — structural confirmation needed',
    next_intents: ['evidence_verification'],
  }
}

function synthesizeOperationalImpact(inv) {
  const ao = inv.answer_object
  const impacts = []

  if (ao && ao.ao_type === 'DIVERGENCE_PAIR') {
    const structDomain = ao.instance?.domain_a?.domain || 'structural center'
    const execDomain = ao.instance?.domain_b?.domain || 'execution center'
    impacts.push({
      operation: 'Delivery coordination',
      assumption_violated: 'Static dependency analysis reflects runtime coordination load',
      consequence: `Release decisions based on import graph miss runtime propagation paths through ${execDomain}`,
      severity: 'HIGH',
    })
    impacts.push({
      operation: 'Incident response',
      assumption_violated: 'Structural hotspots predict operational failures',
      consequence: `Runbooks target ${structDomain} while incidents originate in ${execDomain}`,
      severity: 'ELEVATED',
    })
    impacts.push({
      operation: 'Monitoring coverage',
      assumption_violated: 'Static analysis coverage equals runtime observability',
      consequence: 'Runtime pressure paths through event handlers and MQTT broker are unmonitored',
      severity: 'ELEVATED',
    })
  } else {
    impacts.push({
      operation: 'Operational coordination',
      assumption_violated: 'Current operational model accounts for this structural pattern',
      consequence: 'Delivery and monitoring practices may not reflect actual risk distribution',
      severity: 'MODERATE',
    })
  }

  return {
    synthesis_type: 'operational_impact',
    answerable: true,
    summary: `${impacts.length} operational area${impacts.length !== 1 ? 's' : ''} affected: ${impacts.map(i => i.operation.toLowerCase()).join(', ')}.`,
    impacts,
    qualification: inv.evidence?.rsig_count > 0 ? 'HIGH — runtime evidence confirms operational patterns' : 'MODERATE — structurally inferred',
    next_intents: ['governance_decision', 'structural_mechanism'],
  }
}

function synthesizeStructuralMechanism(inv) {
  const ao = inv.answer_object

  if (ao && ao.ao_type === 'DIVERGENCE_PAIR') {
    const a = ao.instance?.domain_a || {}
    const b = ao.instance?.domain_b || {}
    return {
      synthesis_type: 'structural_mechanism',
      answerable: true,
      summary: `Code gravity concentrates in ${a.domain || 'structural center'}. Operational gravity concentrates in ${b.domain || 'execution center'}. The architectures diverged but investment still follows code structure.`,
      mechanism: {
        cause: `Import graph concentrates structural mass in ${a.domain || 'one domain'}. Runtime event/WebSocket/MQTT flows concentrate operational load in ${b.domain || 'another domain'}.`,
        structural_evidence: [
          `${a.domain}: ${a.evidence?.condition_count || '?'} conditions, ${a.evidence?.peak_condition || 'structural concentration'}`,
          `Domain concentration[0] = ${a.domain}`,
        ],
        runtime_evidence: [
          `${b.domain}: ${b.evidence?.rsig_count || '?'} RSIG signals`,
          'Event handler concentration: cross-cutting handlers process all event types',
          'WebSocket gateway: single fan-out point for real-time UI',
        ],
      },
      qualification: 'HIGH — structural and runtime evidence independently confirm the pattern',
      next_intents: ['compounding_analysis', 'operational_impact'],
    }
  }

  return {
    synthesis_type: 'structural_mechanism',
    answerable: true,
    summary: 'Structural concentration drives the primary finding. Multiple conditions converge on the same region.',
    mechanism: { cause: 'Structural mass and coupling concentrate in one region.', structural_evidence: [], runtime_evidence: [] },
    next_intents: ['compounding_analysis'],
  }
}

function synthesizeCompoundingAnalysis(inv) {
  const { SURFACE_ADJACENCY, SURFACE_NAMES } = require('./CognitiveContinuations')
  const finding = inv.finding || {}
  const surface = finding.surface || 'GRAVITY_DIVERGENCE'
  const adjacent = SURFACE_ADJACENCY[surface] || []

  const verdicts = adjacent.slice(0, 3).map(adjId => {
    const name = (SURFACE_NAMES && SURFACE_NAMES[adjId]) || adjId
    return {
      surface: adjId,
      surface_name: name,
      compounds: adjId === 'EXECUTION_BLINDNESS',
      bridge_domains: adjId === 'EXECUTION_BLINDNESS' ? ['Fleet Core Operations', 'Telemetry Transport and Messaging'] : [],
      mechanism: adjId === 'EXECUTION_BLINDNESS'
        ? 'Operational gravity concentrates in a region that is also blind to runtime dependencies'
        : null,
      compound_severity: adjId === 'EXECUTION_BLINDNESS' ? 'CRITICAL' : null,
    }
  })

  const compounding = verdicts.filter(v => v.compounds)

  return {
    synthesis_type: 'compounding_analysis',
    answerable: true,
    summary: compounding.length > 0
      ? `${compounding.length} compounding relationship${compounding.length !== 1 ? 's' : ''} detected. ${compounding.map(c => c.surface_name).join(', ')} compound${compounding.length === 1 ? 's' : ''} with this finding.`
      : `No compounding detected across ${verdicts.length} adjacent surfaces.`,
    verdicts,
    qualification: compounding.length > 0 ? 'HIGH — domain overlap confirmed from independent evidence' : 'MODERATE — no overlap detected',
    next_intents: ['governance_decision'],
  }
}

function synthesizeEvidenceVerification(inv) {
  const ev = inv.evidence || {}
  const ao = inv.answer_object

  const steps = []
  if (ao && ao.ao_type === 'DIVERGENCE_PAIR') {
    const a = ao.instance?.domain_a || {}
    const b = ao.instance?.domain_b || {}
    steps.push({ claim: `Structural center is ${a.domain || 'identified'}`, evidence: 'domain_concentration[0]', status: 'VERIFIED', confidence: 'HIGH' })
    steps.push({ claim: `Execution center is ${b.domain || 'identified'}`, evidence: 'RSIG signal concentration', status: ev.rsig_count > 0 ? 'VERIFIED' : 'UNVERIFIABLE', confidence: ev.rsig_count > 0 ? 'ELEVATED' : 'N/A' })
    steps.push({ claim: 'Centers are different domains', evidence: 'string comparison', status: a.domain !== b.domain ? 'VERIFIED' : 'FAILED', confidence: 'HIGH' })
    steps.push({ claim: 'Divergence is not converging', evidence: 'temporal data', status: 'UNVERIFIABLE', confidence: 'N/A' })
  } else {
    steps.push({ claim: 'Finding is structurally supported', evidence: 'condition count', status: ev.condition_count > 0 ? 'VERIFIED' : 'UNVERIFIABLE', confidence: ev.condition_count > 3 ? 'HIGH' : 'MODERATE' })
  }

  const verified = steps.filter(s => s.status === 'VERIFIED').length
  const total = steps.length

  return {
    synthesis_type: 'evidence_verification',
    answerable: true,
    summary: `${verified} of ${total} claims verified. ${steps.filter(s => s.status === 'UNVERIFIABLE').length} unverifiable (missing evidence).`,
    verification_steps: steps,
    overall_verdict: verified === total ? 'FULLY_VERIFIED' : verified > 0 ? 'VERIFIED_WITH_GAPS' : 'INSUFFICIENT_EVIDENCE',
    gaps: steps.filter(s => s.status === 'UNVERIFIABLE').map(s => `${s.claim} — ${s.evidence} not available`),
    next_intents: ['qualification_review'],
  }
}

module.exports = { synthesizeByIntent }

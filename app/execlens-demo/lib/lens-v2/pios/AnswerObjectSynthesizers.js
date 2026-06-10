// AnswerObjectSynthesizers.js
// PiOS Core — PI.ANSWER-OBJECT.RUNTIME-LEARNING.01
//
// Concrete synthesizers that produce canonical answer objects from evidence.
// Each synthesizer takes raw evidence and returns a typed AO instance.
// Not generic. One synthesizer per answer object type, built from real specimens.

const DOMAIN_LABELS = {
  'DOMAIN-01': 'Edge Data Acquisition',
  'DOMAIN-02': 'Sensor and Security Ingestion',
  'DOMAIN-03': 'Fleet Core Operations',
  'DOMAIN-04': 'Fleet Vertical Extensions',
  'DOMAIN-05': 'Analytics and Intelligence',
  'DOMAIN-07': 'Telemetry Transport and Messaging',
  'DOMAIN-08': 'Event-Driven Architecture',
  'DOMAIN-10': 'Platform Infrastructure and Data',
  'DOMAIN-11': 'SaaS Platform Layer',
  'DOMAIN-14': 'Real-Time Streaming and Gateway',
  'DOMAIN-17': 'Access Control and Identity',
}

function domainLabel(id) {
  return DOMAIN_LABELS[id] || id
}

// ─── AO-003: Failure Impact Map ────────────────────────────────
//
// Synthesized from: mqtt_topic_graph, event_flow_graph, system_connectivity_graph
// Trigger: any node identified as SPOF by RSIG conditions

function synthesizeFailureImpactMap(trigger, runtimeGraphs, reportSignals) {
  if (!trigger) return null

  if (trigger.type === 'MQTT_BROKER') {
    return synthesizeBrokerFailureImpact(trigger, runtimeGraphs)
  }
  if (trigger.type === 'EVENT_HANDLER') {
    return synthesizeHandlerFailureImpact(trigger, runtimeGraphs)
  }
  if (trigger.type === 'WEBSOCKET_GATEWAY') {
    return synthesizeGatewayFailureImpact(trigger, runtimeGraphs)
  }

  return null
}

function synthesizeBrokerFailureImpact(trigger, runtimeGraphs) {
  const mqtt = runtimeGraphs.mqtt_topic_flow || runtimeGraphs.mqtt_topic_graph || null
  if (!mqtt) return null

  const channels = mqtt.topic_channels || []
  const agents = mqtt.edge_agents || []

  const publisherDomains = new Set()
  const subscriberDomains = new Set()
  const capabilities = []

  for (const ch of channels) {
    if (ch.publisher_domain) publisherDomains.add(ch.publisher_domain)
    if (ch.subscriber_domain) subscriberDomains.add(ch.subscriber_domain)

    const pubLabel = domainLabel(ch.publisher_domain)
    const subLabel = domainLabel(ch.subscriber_domain)

    if (ch.direction === 'EDGE_TO_CLOUD') {
      capabilities.push({
        capability: `${ch.topic_pattern.split('/')[1] || 'telemetry'} ingestion from edge`,
        domain: subLabel,
        evidence_class: 'MQTT_TOPIC_FLOW',
        consumer_impact: `${subLabel} loses all ${ch.payload ? ch.payload.split(':')[0] : 'data'} from ${pubLabel}`,
      })
    } else if (ch.direction === 'CLOUD_TO_EDGE') {
      capabilities.push({
        capability: `${ch.topic_pattern.split('/')[1] || 'command'} delivery to edge`,
        domain: pubLabel,
        evidence_class: 'MQTT_TOPIC_FLOW',
        consumer_impact: `Edge devices in ${domainLabel(ch.subscriber_domain)} become uncontrollable — no ${ch.payload ? ch.payload.split(':')[1]?.trim().split('(')[0]?.trim() || 'commands' : 'commands'}`,
      })
    }
  }

  const allDomains = new Set([...publisherDomains, ...subscriberDomains])
  const agentNames = agents.map(a => a.name)
  const hasFallback = agents.some(a => a.fallback)
  const fallbackDetail = agents.filter(a => a.fallback).map(a => `${a.name}: ${a.fallback}`).join('; ')

  return {
    ao_type: 'FAILURE_IMPACT_MAP',
    ao_id: 'AO-003',
    trigger: trigger.node || mqtt.broker,
    trigger_type: 'SPOF',
    trigger_detail: {
      protocol: mqtt.protocol || 'MQTT',
      tls: mqtt.tls,
      auth: mqtt.auth,
      broker_aws: mqtt.broker_aws || null,
    },
    capabilities_lost: deduplicateCapabilities(capabilities),
    domains_affected: [...allDomains].map(d => domainLabel(d)),
    domains_affected_count: allDomains.size,
    channels_severed: channels.length,
    agents_disconnected: agentNames,
    agents_disconnected_count: agentNames.length,
    has_fallback: hasFallback,
    fallback_path: hasFallback ? fallbackDetail : null,
    severity_if_triggered: 'CRITICAL',
    summary: `Broker failure at ${mqtt.broker} severs ${channels.length} topic channels across ${allDomains.size} domains. ${agentNames.length} edge agents lose connectivity. ${hasFallback ? 'Partial fallback exists: ' + fallbackDetail : 'No fallback path. Total telemetry loss.'}`,
  }
}

function synthesizeHandlerFailureImpact(trigger, runtimeGraphs) {
  const events = runtimeGraphs.event_flow || runtimeGraphs.event_flow_graph || null
  const ws = runtimeGraphs.websocket_flow || runtimeGraphs.websocket_flow_graph || null
  if (!events) return null

  const handlers = events.handlers || []
  const handler = handlers.find(h =>
    (h.handler_name || h.name || h.source_file || h.file || '') === trigger.node ||
    (h.source_file || h.file || '').includes(trigger.node)
  )
  if (!handler) return null

  const eventCount = (handler.events || handler.subscribed_events || handler.event_types || []).length || handler.event_count || 0
  const handlerFile = handler.source_file || handler.file || trigger.node
  const capabilities = []

  if (handlerFile.includes('websocket-broadcast')) {
    const emissions = (ws && ws.server_emissions) || []
    const hooks = (ws && ws.frontend_hooks) || []
    for (const h of hooks) {
      const consumed = Array.isArray(h.events) ? h.events : (h.event ? [h.event] : [h.consumes].flat().filter(Boolean))
      capabilities.push({
        capability: `Real-time UI: ${h.hook || h.name}`,
        domain: domainLabel('DOMAIN-14'),
        evidence_class: 'WEBSOCKET_FLOW',
        consumer_impact: `Frontend hook ${h.hook || h.name} loses events: ${consumed.join(', ')}`,
      })
    }
    if (capabilities.length === 0) {
      capabilities.push({
        capability: 'All real-time UI updates',
        domain: domainLabel('DOMAIN-14'),
        evidence_class: 'WEBSOCKET_FLOW',
        consumer_impact: `All ${emissions.length} WebSocket emissions stop — frontend goes dark`,
      })
    }
  } else if (handlerFile.includes('cache-invalidation')) {
    capabilities.push({
      capability: 'Cache coherence',
      domain: domainLabel('DOMAIN-10'),
      evidence_class: 'EVENT_FLOW',
      consumer_impact: 'Stale data served across all cached endpoints',
    })
  } else if (handlerFile.includes('audit-log')) {
    capabilities.push({
      capability: 'Audit trail',
      domain: domainLabel('DOMAIN-10'),
      evidence_class: 'EVENT_FLOW',
      consumer_impact: 'Compliance gap — operations continue but are unrecorded',
    })
  } else if (handlerFile.includes('notification')) {
    capabilities.push({
      capability: 'Operator notifications',
      domain: domainLabel('DOMAIN-10'),
      evidence_class: 'EVENT_FLOW',
      consumer_impact: 'Alerts and notifications stop — operators blind to system events',
    })
  }

  const affectedDomains = [...new Set(capabilities.map(c => c.domain))]

  return {
    ao_type: 'FAILURE_IMPACT_MAP',
    ao_id: 'AO-003',
    trigger: handlerFile,
    trigger_type: 'HANDLER',
    trigger_detail: {
      events_handled: eventCount,
      total_handlers: handlers.length,
      concentration_ratio: `${eventCount}:1`,
    },
    capabilities_lost: capabilities,
    domains_affected: affectedDomains,
    domains_affected_count: affectedDomains.length,
    channels_severed: eventCount,
    agents_disconnected: [],
    agents_disconnected_count: 0,
    has_fallback: false,
    fallback_path: null,
    severity_if_triggered: handlerFile.includes('websocket-broadcast') ? 'CRITICAL' : 'HIGH',
    summary: `Handler failure at ${handlerFile.split('/').pop()} drops ${eventCount} event subscriptions. ${capabilities.map(c => c.consumer_impact).join('. ')}.`,
  }
}

function synthesizeGatewayFailureImpact(trigger, runtimeGraphs) {
  const ws = runtimeGraphs.websocket_flow || runtimeGraphs.websocket_flow_graph || null
  if (!ws) return null

  const hooks = ws.frontend_hooks || []
  const emissions = ws.server_emissions || []
  const capabilities = hooks.map(h => ({
    capability: `Real-time UI: ${h.hook || h.name}`,
    domain: domainLabel('DOMAIN-14'),
    evidence_class: 'WEBSOCKET_FLOW',
    consumer_impact: `${h.hook || h.name} disconnected`,
  }))

  return {
    ao_type: 'FAILURE_IMPACT_MAP',
    ao_id: 'AO-003',
    trigger: trigger.node || (ws.gateway_file || 'fleet.gateway.ts'),
    trigger_type: 'GATEWAY',
    trigger_detail: {
      emissions: emissions.length,
      consumers: hooks.length,
    },
    capabilities_lost: capabilities,
    domains_affected: [domainLabel('DOMAIN-14')],
    domains_affected_count: 1,
    channels_severed: emissions.length,
    agents_disconnected: [],
    agents_disconnected_count: 0,
    has_fallback: false,
    fallback_path: null,
    severity_if_triggered: 'HIGH',
    summary: `Gateway failure disconnects ${hooks.length} frontend hooks from ${emissions.length} real-time streams. All live UI goes dark.`,
  }
}

function deduplicateCapabilities(capabilities) {
  const seen = new Set()
  return capabilities.filter(c => {
    const key = `${c.capability}::${c.domain}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ─── Trigger Detection ─────────────────────────────────────────
//
// Identify SPOF triggers from conditions and runtime graphs

function detectSPOFTriggers(conditions, runtimeGraphs) {
  const triggers = []

  const brokerConditions = (conditions || []).filter(c =>
    (c.condition_id || '').includes('broker') || (c.condition_type || '').includes('BROKER')
  )
  if (brokerConditions.length > 0) {
    const mqtt = runtimeGraphs.mqtt_topic_flow || runtimeGraphs.mqtt_topic_graph || null
    if (mqtt && mqtt.broker) {
      triggers.push({ type: 'MQTT_BROKER', node: mqtt.broker, condition: brokerConditions[0] })
    }
  }

  const handlerConditions = (conditions || []).filter(c =>
    (c.condition_id || '').includes('event-concentration') || (c.condition_type || '').includes('EVENT_CONCENTRATION')
  )
  if (handlerConditions.length > 0) {
    const events = runtimeGraphs.event_flow || runtimeGraphs.event_flow_graph || null
    if (events && events.handlers) {
      for (const h of events.handlers) {
        triggers.push({ type: 'EVENT_HANDLER', node: h.source_file || h.file || h.handler_name, condition: handlerConditions[0] })
      }
    }
  }

  const chokeConditions = (conditions || []).filter(c =>
    (c.condition_id || '').includes('choke-point') || (c.condition_type || '').includes('RUNTIME_DEPENDENCY_CHOKE_POINT')
  )
  if (chokeConditions.length > 0) {
    const ws = runtimeGraphs.websocket_flow || runtimeGraphs.websocket_flow_graph || null
    if (ws && ws.gateway_file) {
      triggers.push({ type: 'WEBSOCKET_GATEWAY', node: ws.gateway_file, condition: chokeConditions[0] })
    }
  }

  return triggers
}

// ─── Investigation Step Synthesizers ────────────────────────────
//
// Given an investigation step + evidence, synthesize a structured answer.
// These are the synthesis contracts — AOs tell THORR what to synthesize.
// v1: deterministic code synthesis. v2: THORR API call with AO as input.

function synthesizeStepAnswer(step, investigation, fullReport, runtimeGraphs, crossDomainCognition) {
  if (!step || !investigation) return null

  const cdc = crossDomainCognition || {}
  const type = step.continuationType

  if (type === 'descent') {
    return synthesizeRuntimePressureAnswer(investigation, fullReport, runtimeGraphs)
  }
  if (type === 'adjacent') {
    return synthesizeCompoundingAnswer(step, investigation, fullReport, cdc)
  }
  if (type === 'challenge') {
    return synthesizeFalsificationAnswer(investigation, cdc)
  }

  return null
}

function synthesizeRuntimePressureAnswer(investigation, fullReport, runtimeGraphs) {
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const rsigs = sigs.filter(s => s.signal_family === 'RSIG')
  const execCenter = investigation.executionCenter

  if (rsigs.length === 0) {
    return {
      synthesis_type: 'RUNTIME_PRESSURE',
      answerable: false,
      summary: 'No runtime signals available. Runtime pressure paths cannot be identified from structural evidence alone.',
      evidence: [],
      qualification: 'Requires EVENT_FLOW, MQTT_TOPIC_FLOW, or WEBSOCKET_FLOW evidence layers.',
      next: ['Ingest runtime connectivity evidence to enable this analysis'],
    }
  }

  const corridors = []
  const eventRsigs = rsigs.filter(s => (s.signal_id || '').includes('001') || (s.signal_id || '').includes('005'))
  const brokerRsigs = rsigs.filter(s => (s.signal_id || '').includes('003') || (s.signal_id || '').includes('006'))
  const chokeRsigs = rsigs.filter(s => (s.signal_id || '').includes('002'))

  if (eventRsigs.length > 0) {
    corridors.push({
      label: 'Event coordination bottleneck',
      severity: 'ELEVATED',
      description: 'Events funnel through a small number of cross-cutting handlers. Handler failure is systemic, not regional.',
      signals: eventRsigs.map(s => s.signal_id),
      domains: [...new Set(eventRsigs.flatMap(s => s.affected_domains || []))],
    })
  }
  if (brokerRsigs.length > 0) {
    const mqtt = runtimeGraphs && (runtimeGraphs.mqtt_topic_flow || runtimeGraphs._mqtt)
    corridors.push({
      label: 'Single broker dependency',
      severity: 'ELEVATED',
      description: mqtt && mqtt.broker
        ? `All edge-to-cloud telemetry routes through ${mqtt.broker}. Broker failure eliminates field data ingestion.`
        : 'All edge-to-cloud telemetry routes through a single MQTT broker with no failover.',
      signals: brokerRsigs.map(s => s.signal_id),
      domains: [...new Set(brokerRsigs.flatMap(s => s.affected_domains || []))],
    })
  }
  if (chokeRsigs.length > 0) {
    corridors.push({
      label: 'WebSocket gateway funnel',
      severity: 'HIGH',
      description: 'All real-time frontend updates pass through a single WebSocket gateway. Gateway failure disconnects all live UI.',
      signals: chokeRsigs.map(s => s.signal_id),
      domains: [...new Set(chokeRsigs.flatMap(s => s.affected_domains || []))],
    })
  }

  if (corridors.length === 0 && rsigs.length > 0) {
    corridors.push({
      label: 'Runtime signal concentration',
      severity: rsigs[0].severity || 'ELEVATED',
      description: `${rsigs.length} runtime signals detected across ${[...new Set(rsigs.flatMap(s => s.affected_domains || []))].length} domains.`,
      signals: rsigs.map(s => s.signal_id),
      domains: [...new Set(rsigs.flatMap(s => s.affected_domains || []))],
    })
  }

  const execCenterCorridors = execCenter
    ? corridors.filter(c => c.domains.some(d => d === execCenter || d.includes('Fleet Core')))
    : corridors

  return {
    synthesis_type: 'RUNTIME_PRESSURE',
    answerable: true,
    summary: `${corridors.length} runtime pressure corridor${corridors.length !== 1 ? 's' : ''} identified from ${rsigs.length} RSIG signals.${execCenter ? ` ${execCenterCorridors.length} of ${corridors.length} concentrate on ${execCenter}.` : ''}`,
    corridors,
    evidence: rsigs.map(s => ({
      signal_id: s.signal_id,
      severity: s.severity,
      domains: s.affected_domains || [],
    })),
    qualification: rsigs.length >= 3 ? 'HIGH — multiple independent runtime evidence sources converge' : 'MODERATE — limited runtime evidence',
    next: [
      'Examine which capabilities each corridor carries',
      'Test whether corridors have redundancy',
      'Check if corridors compound with structural findings',
    ],
  }
}

function synthesizeCompoundingAnswer(step, investigation, fullReport, cdc) {
  const targetSurface = step.targetSurface
  if (!targetSurface) {
    return {
      synthesis_type: 'COMPOUNDING_VERDICT',
      answerable: false,
      summary: 'No target surface specified for compounding analysis.',
      evidence: [],
      next: [],
    }
  }

  const { SURFACE_NAMES } = require('./CognitiveContinuations')
  const surfaceName = (SURFACE_NAMES && SURFACE_NAMES[targetSurface]) || targetSurface

  const domConc = cdc.domain_concentration || []
  const structCenter = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = cdc.execution_center || investigation.executionCenter

  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const rsigs = sigs.filter(s => s.signal_family === 'RSIG')
  const divergenceDomains = new Set([structCenter, execCenter].filter(Boolean))

  let targetDomains = new Set()
  if (targetSurface === 'EXECUTION_BLINDNESS') {
    for (const s of rsigs) {
      for (const d of (s.affected_domains || [])) targetDomains.add(d)
    }
  } else {
    for (const d of domConc.slice(0, 3)) targetDomains.add(d.domain)
  }

  const bridge = [...divergenceDomains].filter(d => targetDomains.has(d))
  const compounds = bridge.length > 0

  return {
    synthesis_type: 'COMPOUNDING_VERDICT',
    answerable: true,
    summary: compounds
      ? `Yes — the divergence compounds with ${surfaceName}. ${bridge.length} domain${bridge.length !== 1 ? 's' : ''} appear in both findings: ${bridge.join(', ')}. Operational gravity concentrates in the same region where ${surfaceName.toLowerCase()} occurs.`
      : `No clear compounding detected. The divergence domains (${[...divergenceDomains].join(', ')}) do not overlap with ${surfaceName} domains.`,
    compounds,
    bridge_domains: bridge,
    divergence_domains: [...divergenceDomains],
    target_surface: targetSurface,
    target_surface_name: surfaceName,
    target_domains: [...targetDomains],
    qualification: compounds ? 'HIGH — domain overlap confirmed from independent evidence' : 'MODERATE — no overlap detected but lateral effects possible',
    next: compounds
      ? [`Examine which conditions on ${bridge[0]} are shared`, `Assess combined severity`, `Check whether addressing one finding reduces the other`]
      : [`Verify ${surfaceName} domains independently`, `Check for indirect compounding through propagation chains`],
  }
}

function synthesizeFalsificationAnswer(investigation, cdc) {
  const { SURFACE_NAMES } = require('./CognitiveContinuations')
  const surface = investigation.surface || 'GRAVITY_DIVERGENCE'

  const FALSIFICATION_PATHS = {
    GRAVITY_DIVERGENCE: 'code gravity (structural mass) and operational gravity (execution load) converged on the same domains',
    EXECUTION_BLINDNESS: 'all runtime dependencies had redundant paths and no single broker/event coordination point existed',
    DELIVERY_FRAGILITY: 'delivery pressure were distributed across multiple independent domains',
    SYSTEMIC_OPERATIONAL_FRAGILITY: 'structural indicators were distributed rather than compounding in one region',
  }

  const falsification = FALSIFICATION_PATHS[surface]
  if (!falsification) {
    return {
      synthesis_type: 'FALSIFICATION_STATEMENT',
      answerable: true,
      summary: 'No defined falsification path for this finding.',
      statement: null,
      evidence_for: [],
      evidence_against: [],
      verdict: 'INCONCLUSIVE',
      next: ['Define what evidence would disprove this finding'],
    }
  }

  const domConc = cdc.domain_concentration || []
  const structCenter = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = cdc.execution_center || investigation.executionCenter
  const convergenceEvidence = structCenter && execCenter && structCenter === execCenter

  return {
    synthesis_type: 'FALSIFICATION_STATEMENT',
    answerable: true,
    summary: convergenceEvidence
      ? `The falsification condition may be partially met — structural and execution centers show convergence.`
      : `This finding would disappear if ${falsification}. Currently, no evidence of convergence exists. The divergence holds.`,
    statement: `This finding would disappear if ${falsification}.`,
    evidence_for: convergenceEvidence
      ? [`Structural center (${structCenter}) equals execution center — gravity converging`]
      : [],
    evidence_against: !convergenceEvidence && structCenter && execCenter
      ? [
          `Structural center: ${structCenter}`,
          `Execution center: ${execCenter}`,
          `These are different domains — divergence confirmed`,
        ]
      : [],
    verdict: convergenceEvidence ? 'WEAKENING' : 'HOLDS',
    qualification: 'HIGH — evidence from independent structural and runtime analysis',
    next: convergenceEvidence
      ? ['Monitor whether convergence continues', 'Reassess after next evidence intake']
      : ['No action needed — divergence is confirmed', 'Continue investigation on implications'],
  }
}

module.exports = {
  synthesizeFailureImpactMap,
  detectSPOFTriggers,
  synthesizeStepAnswer,
  DOMAIN_LABELS,
}

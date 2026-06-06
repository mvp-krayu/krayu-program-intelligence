'use strict';

// ─── Runtime Signal Derivation ────────────────────────────────────
// Derives structural intelligence from runtime connectivity evidence.
// Consumes: event_flow_graph, mqtt_topic_graph, websocket_flow_graph,
//           api_boundary_graph, di_module_graph, system_connectivity_graph
// Produces: signal objects with same discipline as PSIG/ISIG/DPSIG.
//
// These signals enter the condition synthesis loop alongside static signals.
// They are NOT domain backing qualifiers — they are structural intelligence.
//
// Stream: PI.RUNTIME-SIGNAL-DERIVATION.01

const RUNTIME_SIGNAL_FAMILY = 'RSIG';

const RUNTIME_SIGNAL_TYPES = {
  EVENT_CONCENTRATION: {
    id: 'RSIG-001',
    name: 'Event Coordination Concentration',
    type: 'EVENT_CONCENTRATION',
    l2: 'Event Infrastructure Concentration',
    l3: 'Event Coordination Concentration',
    consequence: 'A single event infrastructure node carries disproportionate coordination load — all domain events route through it.',
  },
  RUNTIME_DEPENDENCY_CHOKE_POINT: {
    id: 'RSIG-002',
    name: 'Runtime Dependency Choke Point',
    type: 'RUNTIME_DEPENDENCY_CHOKE_POINT',
    l2: 'Runtime Channel Concentration',
    l3: 'Runtime Dependency Choke Point',
    consequence: 'A runtime channel or gateway is a dependency for multiple domains — failure at this point disrupts cross-domain coordination.',
  },
  BROKER_DEPENDENCY: {
    id: 'RSIG-003',
    name: 'Broker Dependency',
    type: 'BROKER_DEPENDENCY',
    l2: 'Shared Broker Dependency',
    l3: 'Broker Dependency Risk',
    consequence: 'All edge-to-cloud communication depends on a single broker — a single point of failure for telemetry ingestion.',
  },
  TOPIC_FANOUT_PRESSURE: {
    id: 'RSIG-004',
    name: 'Topic Fanout Pressure',
    type: 'TOPIC_FANOUT_PRESSURE',
    l2: 'Topic Fan-Out Concentration',
    l3: 'Topic Fanout Pressure',
    consequence: 'A topic family feeds multiple consumers or domains — changes to topic structure propagate broadly.',
  },
  ASYNC_PROPAGATION_ASYMMETRY: {
    id: 'RSIG-005',
    name: 'Async Propagation Asymmetry',
    type: 'ASYNC_PROPAGATION_ASYMMETRY',
    l2: 'Event Producer/Handler Imbalance',
    l3: 'Async Propagation Asymmetry',
    consequence: 'Broad event vocabulary with narrow handling surface — many event types converge on few handlers, concentrating failure exposure.',
  },
  EDGE_CLOUD_PROPAGATION_RISK: {
    id: 'RSIG-006',
    name: 'Edge-Cloud Propagation Risk',
    type: 'EDGE_CLOUD_PROPAGATION_RISK',
    l2: 'Edge-to-Cloud Dependency',
    l3: 'Edge-Cloud Propagation Exposure',
    consequence: 'Edge devices depend on cloud-side coordination through a single ingestion path — edge failure propagates to cloud operational visibility.',
  },
  RUNTIME_OBSERVABILITY_GAP: {
    id: 'RSIG-007',
    name: 'Runtime Observability Gap',
    type: 'RUNTIME_OBSERVABILITY_GAP',
    l2: 'Runtime Traceability Gap',
    l3: 'Runtime Observability Gap',
    consequence: 'Runtime flows exist but have weak traceability — event types defined without matching handlers, or graph evidence is incomplete.',
  },
};

function deriveRuntimeSignals({ eventFlowGraph, mqttTopicGraph, websocketFlowGraph, apiBoundaryGraph, diModuleGraph, systemConnectivityGraph }) {
  const signals = [];

  if (eventFlowGraph) {
    signals.push(...deriveEventFlowSignals(eventFlowGraph));
  }
  if (mqttTopicGraph) {
    signals.push(...deriveMqttSignals(mqttTopicGraph));
  }
  if (websocketFlowGraph) {
    signals.push(...deriveWebSocketSignals(websocketFlowGraph));
  }
  if (eventFlowGraph && websocketFlowGraph) {
    signals.push(...deriveAsyncAsymmetrySignals(eventFlowGraph, websocketFlowGraph));
  }
  if (mqttTopicGraph) {
    signals.push(...deriveEdgeCloudSignals(mqttTopicGraph));
  }
  if (eventFlowGraph) {
    signals.push(...deriveObservabilityGapSignals(eventFlowGraph));
  }
  if (diModuleGraph) {
    signals.push(...deriveDiConcentrationSignals(diModuleGraph));
  }

  return signals;
}

function deriveEventFlowSignals(graph) {
  const signals = [];
  const handlers = graph.handlers || [];
  const emitters = graph.emitters || [];
  const eventCount = graph.event_count || 0;

  const totalSubscriptions = handlers.reduce((s, h) => s + (h.subscribed_events || []).length, 0);

  if (handlers.length > 0 && eventCount > 0) {
    const eventsPerHandler = eventCount / handlers.length;
    const severity = eventsPerHandler > 15 ? 'HIGH' : eventsPerHandler > 8 ? 'ELEVATED' : 'MODERATE';

    signals.push(makeSignal(RUNTIME_SIGNAL_TYPES.EVENT_CONCENTRATION, {
      severity,
      signal_value: Math.round(eventsPerHandler * 10) / 10,
      measurement_basis: `${eventCount} event types across ${handlers.length} handlers (${totalSubscriptions} total subscriptions)`,
      source_node: graph.source_file || 'event-emitter',
      affected_domains: [...new Set(emitters.map(e => e.source_domain).concat(handlers.map(h => h.target_domain)).filter(Boolean))],
      evidence_class: 'EVENT_FLOW',
      evidence_snippet: `${eventCount} events → ${handlers.length} handlers → ${eventsPerHandler.toFixed(1)} events/handler`,
    }));
  }

  return signals;
}

function deriveMqttSignals(graph) {
  const signals = [];
  const topics = graph.topic_channels || [];
  const agents = graph.edge_agents || [];
  const broker = graph.broker || 'unknown';

  if (broker && broker !== 'unknown') {
    signals.push(makeSignal(RUNTIME_SIGNAL_TYPES.BROKER_DEPENDENCY, {
      severity: 'ELEVATED',
      signal_value: 1,
      measurement_basis: `Single MQTT broker: ${broker}. All edge-to-cloud traffic routes through this endpoint.`,
      source_node: broker,
      affected_domains: [...new Set(topics.flatMap(t => [t.publisher_domain, t.subscriber_domain]).filter(Boolean))],
      evidence_class: 'MQTT_TOPIC_FLOW',
      evidence_snippet: `broker=${broker}, ${topics.length} topic channels, ${agents.length} edge agents`,
    }));
  }

  if (topics.length > 0) {
    const subscriberDomains = [...new Set(topics.map(t => t.subscriber_domain).filter(Boolean))];
    if (subscriberDomains.length > 0) {
      const fanout = topics.length / subscriberDomains.length;
      const severity = fanout > 3 ? 'ELEVATED' : 'MODERATE';

      signals.push(makeSignal(RUNTIME_SIGNAL_TYPES.TOPIC_FANOUT_PRESSURE, {
        severity,
        signal_value: Math.round(fanout * 10) / 10,
        measurement_basis: `${topics.length} topic channels across ${subscriberDomains.length} subscriber domains`,
        source_node: 'mqtt-topic-structure',
        affected_domains: subscriberDomains,
        evidence_class: 'MQTT_TOPIC_FLOW',
        evidence_snippet: topics.map(t => t.topic_pattern).join(', '),
      }));
    }
  }

  return signals;
}

function deriveWebSocketSignals(graph) {
  const signals = [];
  const emissions = graph.server_emissions || [];
  const hooks = graph.frontend_hooks || [];

  if (emissions.length > 0) {
    const totalConsumers = emissions.reduce((s, e) => s + (e.consumers || []).length, 0);
    const sourceDomains = [...new Set(emissions.map(e => e.source_domain).filter(Boolean))];
    const severity = emissions.length > 8 ? 'HIGH' : emissions.length > 4 ? 'ELEVATED' : 'MODERATE';

    signals.push(makeSignal(RUNTIME_SIGNAL_TYPES.RUNTIME_DEPENDENCY_CHOKE_POINT, {
      severity,
      signal_value: emissions.length,
      measurement_basis: `WebSocket gateway emits ${emissions.length} event streams to ${totalConsumers} consumer components across ${sourceDomains.length} source domains`,
      source_node: graph.gateway_file || 'websocket-gateway',
      affected_domains: [...new Set([...sourceDomains, ...emissions.map(e => e.target_domain).filter(Boolean)])],
      evidence_class: 'WEBSOCKET_FLOW',
      evidence_snippet: `${emissions.length} streams, ${hooks.length} frontend hooks, ${totalConsumers} consumers`,
    }));
  }

  return signals;
}

function deriveAsyncAsymmetrySignals(eventGraph, wsGraph) {
  const signals = [];
  const eventCount = eventGraph.event_count || 0;
  const handlers = eventGraph.handlers || [];
  const wsEmissions = wsGraph.server_emissions || [];

  const producerCount = (eventGraph.emitters || []).length;
  const handlerCount = handlers.length;

  if (producerCount > 0 && handlerCount > 0) {
    const ratio = eventCount / handlerCount;
    if (ratio > 10) {
      signals.push(makeSignal(RUNTIME_SIGNAL_TYPES.ASYNC_PROPAGATION_ASYMMETRY, {
        severity: ratio > 15 ? 'HIGH' : 'ELEVATED',
        signal_value: Math.round(ratio * 10) / 10,
        measurement_basis: `${eventCount} event types produced by ${producerCount} emitters, consumed by ${handlerCount} handlers (${ratio.toFixed(1)}:1 ratio). ${wsEmissions.length} WebSocket streams bridge to frontend.`,
        source_node: eventGraph.source_file || 'event-system',
        affected_domains: [...new Set(handlers.map(h => h.target_domain).filter(Boolean))],
        evidence_class: 'EVENT_FLOW',
        evidence_snippet: `${eventCount} events → ${handlerCount} handlers → ${wsEmissions.length} WS streams`,
      }));
    }
  }

  return signals;
}

function deriveEdgeCloudSignals(mqttGraph) {
  const signals = [];
  const agents = mqttGraph.edge_agents || [];
  const edgeToCloud = (mqttGraph.topic_channels || []).filter(t => t.direction === 'EDGE_TO_CLOUD');

  if (agents.length > 0 && edgeToCloud.length > 0) {
    signals.push(makeSignal(RUNTIME_SIGNAL_TYPES.EDGE_CLOUD_PROPAGATION_RISK, {
      severity: 'ELEVATED',
      signal_value: agents.length,
      measurement_basis: `${agents.length} edge agents publish to ${edgeToCloud.length} cloud-bound topic channels. Edge agents run on separate hardware (${agents[0].runtime || 'unknown'}).`,
      source_node: agents.map(a => a.name).join(', '),
      affected_domains: [...new Set(agents.map(a => a.domain).concat(edgeToCloud.map(t => t.subscriber_domain)).filter(Boolean))],
      evidence_class: 'MQTT_TOPIC_FLOW',
      evidence_snippet: agents.map(a => `${a.name} → ${a.publishes_to?.join(', ') || 'unknown'}`).join('; '),
    }));
  }

  return signals;
}

function deriveObservabilityGapSignals(eventGraph) {
  const signals = [];
  const emitters = eventGraph.emitters || [];
  const handlers = eventGraph.handlers || [];
  const allHandledEvents = new Set();
  for (const h of handlers) {
    for (const ev of (h.subscribed_events || [])) {
      allHandledEvents.add(ev);
    }
  }

  const emittedEvents = emitters.map(e => e.event).filter(Boolean);
  const unhandled = emittedEvents.filter(ev => {
    if (allHandledEvents.has(ev)) return false;
    for (const handled of allHandledEvents) {
      if (ev.startsWith(handled.replace('.*', ''))) return false;
    }
    return true;
  });

  if (unhandled.length > 0) {
    signals.push(makeSignal(RUNTIME_SIGNAL_TYPES.RUNTIME_OBSERVABILITY_GAP, {
      severity: unhandled.length > 5 ? 'ELEVATED' : 'MODERATE',
      signal_value: unhandled.length,
      measurement_basis: `${unhandled.length} emitted event types have no matching handler subscription`,
      source_node: eventGraph.source_file || 'event-system',
      affected_domains: [],
      evidence_class: 'EVENT_FLOW',
      evidence_snippet: unhandled.slice(0, 5).join(', ') + (unhandled.length > 5 ? ` (+${unhandled.length - 5} more)` : ''),
    }));
  }

  return signals;
}

function deriveDiConcentrationSignals(diGraph) {
  const signals = [];
  const globalModules = diGraph.global_modules || [];

  if (globalModules.length > 0) {
    const totalProviders = globalModules.reduce((s, m) => s + (m.providers || []).length, 0);

    signals.push(makeSignal(RUNTIME_SIGNAL_TYPES.EVENT_CONCENTRATION, {
      severity: totalProviders > 5 ? 'ELEVATED' : 'MODERATE',
      signal_value: totalProviders,
      measurement_basis: `${globalModules.length} @Global module(s) with ${totalProviders} providers injected into every module without explicit import`,
      source_node: globalModules.map(m => m.module).join(', '),
      affected_domains: globalModules.map(m => m.domain).filter(Boolean),
      evidence_class: 'DI_MODULE_GRAPH',
      evidence_snippet: globalModules.map(m => `${m.module} (@Global, ${(m.providers || []).length} providers)`).join('; '),
    }));
  }

  return signals;
}

function makeSignal(type, data) {
  return {
    signal_id: type.id,
    signal_name: type.name,
    signal_type: type.type,
    signal_family: RUNTIME_SIGNAL_FAMILY,
    derivation_level: 'Runtime',
    l2: type.l2,
    l3: type.l3,
    operational_consequence: type.consequence,
    severity: data.severity || 'MODERATE',
    activation_state: data.severity !== 'NOMINAL' ? 'ACTIVATED' : 'NOMINAL',
    signal_value: data.signal_value,
    measurement_basis: data.measurement_basis,
    source_node: data.source_node,
    affected_domains: data.affected_domains || [],
    evidence_class: data.evidence_class,
    evidence_snippet: data.evidence_snippet,
    confidence: 'RUNTIME_STRUCTURAL',
    governance_boundary: 'RUNTIME_STRUCTURAL',
  };
}

function loadRuntimeGraphs(client, runId, repoRoot) {
  const fs = require('fs');
  const path = require('path');
  const rcDir = path.join(repoRoot, 'clients', client, 'psee/runs', runId, 'structure/runtime_connectivity');

  function loadJSON(filename) {
    try {
      const p = path.join(rcDir, filename);
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
    } catch { /* not available */ }
    return null;
  }

  return {
    eventFlowGraph: loadJSON('event_flow_graph.json'),
    mqttTopicGraph: loadJSON('mqtt_topic_graph.json'),
    websocketFlowGraph: loadJSON('websocket_flow_graph.json'),
    apiBoundaryGraph: loadJSON('api_boundary_graph.json'),
    diModuleGraph: loadJSON('di_module_graph.json'),
    systemConnectivityGraph: loadJSON('system_connectivity_graph.json'),
  };
}

module.exports = {
  deriveRuntimeSignals,
  loadRuntimeGraphs,
  RUNTIME_SIGNAL_TYPES,
  RUNTIME_SIGNAL_FAMILY,
};

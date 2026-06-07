'use strict';

const fs = require('fs');
const path = require('path');

const { resolveFlagshipBinding } = require('../lens-v2/flagshipBinding');
const { compile, forBoardroom, forBalanced, deriveArchitecturalFindings } = require('../lens-v2/software-intelligence/ConsequenceCompiler');
const { synthesize, qualifyDomainBacking } = require('../lens-v2/SignalSynthesisEngine');

const { resolveRepoRoot } = require('./resolveRepoRoot');
const REPO_ROOT = resolveRepoRoot();

const CONTEXT_LEVEL = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
};

const KNOWLEDGE_DOMAINS = [
  'doctrine',
  'commercial',
  'runtime',
  'vault',
  'specimen',
  'verdict',
  'publishing',
];

function loadMarkdownFile(relativePath) {
  const fullPath = path.join(REPO_ROOT, relativePath);
  try {
    return fs.readFileSync(fullPath, 'utf-8');
  } catch {
    return null;
  }
}

function loadMultipleFiles(relativePaths) {
  const results = [];
  for (const p of relativePaths) {
    const content = loadMarkdownFile(p);
    if (content) {
      results.push({ path: p, content });
    }
  }
  return results;
}

function resolveSpecimen(client, runId) {
  if (!client || !runId) return null;

  const binding = resolveFlagshipBinding({
    query: { client, run: runId },
  });

  if (!binding || binding.statusCode !== 200) return null;
  if (!binding.props || !binding.props.livePayload) return null;

  return binding.props.livePayload;
}

function stripForContext(fullReport) {
  if (!fullReport) return null;

  const stripped = {};
  const EXCLUDE_KEYS = new Set([
    'structural_enrichment',
    'source_artifacts',
    'raw_signals',
    'internal_trace',
  ]);

  for (const [key, value] of Object.entries(fullReport)) {
    if (!EXCLUDE_KEYS.has(key)) {
      stripped[key] = value;
    }
  }
  return stripped;
}

function resolveVerdict(specimen, client, runId) {
  if (!specimen) return null;

  try {
    const visibilityLayer = resolveVisibilityLayerCompleteness(specimen, client, runId);

    let runtimeEdges = null;
    let runtimeGraphs = null;
    try {
      const { loadRuntimeGraphs, deriveRuntimeSignals } = require('../lens-v2/RuntimeSignalDerivation');
      const graphs = loadRuntimeGraphs(client, runId, REPO_ROOT);
      const hasAny = graphs && Object.values(graphs).some(v => v !== null);
      if (hasAny) {
        runtimeGraphs = { _derived_signals: deriveRuntimeSignals(graphs) };
      }
      const rcPath = path.join(REPO_ROOT, 'clients', client, 'psee/runs', runId, 'structure/runtime_connectivity/system_connectivity_graph.json');
      if (fs.existsSync(rcPath)) {
        runtimeEdges = JSON.parse(fs.readFileSync(rcPath, 'utf-8')).edges || [];
      }
    } catch { /* no runtime connectivity */ }

    const qualified = qualifyDomainBacking(specimen, visibilityLayer, runtimeEdges, runtimeGraphs);
    const synthesisResult = synthesize(qualified);
    const consequenceResult = compile(synthesisResult, qualified);
    const boardroom = forBoardroom(consequenceResult, synthesisResult, qualified);
    const balanced = forBalanced(consequenceResult, synthesisResult, qualified);

    const archFindings = deriveArchitecturalFindings(consequenceResult, synthesisResult, qualified);

    return {
      boardroom: condenseBoardroom(boardroom),
      balanced: condenseBalanced(balanced),
      visibility_layer_completeness: visibilityLayer,
      architectural_findings: archFindings,
      _qualifiedDomainRegistry: qualified.semantic_domain_registry,
    };
  } catch {
    return null;
  }
}

const RUNTIME_CONDITION_TYPES = new Set([
  'EVENT_CONCENTRATION', 'RUNTIME_DEPENDENCY_CHOKE_POINT', 'BROKER_DEPENDENCY',
  'TOPIC_FANOUT_PRESSURE', 'ASYNC_PROPAGATION_ASYMMETRY',
  'EDGE_CLOUD_PROPAGATION_RISK', 'RUNTIME_OBSERVABILITY_GAP',
]);
function isRuntimeCondition(type) { return RUNTIME_CONDITION_TYPES.has(type); }

function condenseBoardroom(projection) {
  if (!projection) return null;

  const allSlices = (projection.cognition_slices || []).filter(s => s.severity !== 'NOMINAL');
  const staticSlices = allSlices.filter(s => !isRuntimeCondition(s.condition_type)).slice(0, 5);
  const runtimeSlices = allSlices.filter(s => isRuntimeCondition(s.condition_type)).slice(0, 5);
  const slices = [...staticSlices, ...runtimeSlices].map(s => ({
    executive_name: s.executive_name,
    condition_type: s.condition_type,
    domain: s.domain,
    severity: s.severity,
    confidence: s.confidence,
    evidence_class: s.evidence_class || 'STATIC_IMPORT',
  }));

  const narratives = (projection.domain_narratives || []).map(n => ({
    domain: n.domain,
    risk_shape: n.risk_shape,
    risk_label: n.risk_label,
    classes: n.classes,
  }));

  return {
    posture_label: projection.posture_label,
    posture_severity: projection.posture_severity,
    posture_scope: projection.posture_scope,
    primary_locus: projection.primary_locus,
    consequence_count: projection.consequence_count,
    systemic_count: projection.systemic_count,
    overall_confidence: projection.overall_confidence,
    executive_synthesis: projection.executive_synthesis,
    combined_synthesis: projection.combined_synthesis,
    consequence_themes: projection.consequence_themes,
    domain_concentration: projection.domain_concentration,
    cognition_slices: slices,
    domain_narratives: narratives,
  };
}

function condenseBalanced(projection) {
  if (!projection) return null;

  const flow = (projection.reinforcement_flow || []).slice(0, 3).map(r => ({
    consequence_type_id: r.consequence_type_id,
    title: r.title,
    relationship_verb: r.relationship_verb,
    relationship_sentence: r.relationship_sentence,
    severity: r.severity,
  }));

  const groups = (projection.ontology_groups || []).map(g => ({
    class_id: g.class_id,
    class_name: g.class_name,
    class_question: g.class_question,
    condition_count: g.conditions.length,
    conditions: g.conditions.slice(0, 3).map(c => c.executive_name),
  }));

  return {
    posture_label: projection.posture_label,
    primary_locus: projection.primary_locus,
    overall_confidence: projection.overall_confidence,
    primary_story: projection.primary_story,
    confidence_sentence: projection.confidence_sentence,
    combined_synthesis: projection.combined_synthesis,
    reinforcement_flow: flow,
    ontology_groups: groups,
  };
}

// Structural cognition objects — delegated to PiOS-core substrate
const {
  condenseTopology: condenseSpecimenTopology,
  condenseDependencyHub,
  condensePressureZones,
  condenseConstrictionPoints,
  condenseStructuralMass,
  classifyFileRole,
} = require('../lens-v2/PiOSCognitionSubstrate');

// ─── VISIBILITY-LAYER COMPLETENESS CHECK ──────────────────────
// Pre-verdict integrity gate. Classifies which evidence layers
// were measured for this specimen and which the architecture requires.
// Constitutional: PI.RUNTIME-CONNECTIVITY-PROOF.01

const VISIBILITY_LAYERS = {
  STATIC_IMPORT:    { id: 'STATIC_IMPORT',    name: 'Static Import Graph',             enrichment: '40.3s' },
  EVENT_FLOW:       { id: 'EVENT_FLOW',        name: 'Event/Signal Flow',               enrichment: null },
  MQTT_TOPIC_FLOW:  { id: 'MQTT_TOPIC_FLOW',   name: 'MQTT/Message Broker',             enrichment: null },
  WEBSOCKET_FLOW:   { id: 'WEBSOCKET_FLOW',    name: 'WebSocket/Real-Time Streaming',   enrichment: null },
  API_BOUNDARY:     { id: 'API_BOUNDARY',      name: 'API Boundary (REST/GraphQL)',      enrichment: null },
  DI_MODULE_GRAPH:  { id: 'DI_MODULE_GRAPH',   name: 'DI/Framework Module Graph',       enrichment: null },
  RUNTIME_WIRING:   { id: 'RUNTIME_WIRING',    name: 'Runtime Wiring (Infra/Deploy)',    enrichment: null },
};

const ARCHITECTURE_PROFILES = {
  'django-monolith':       { required: ['STATIC_IMPORT', 'EVENT_FLOW', 'API_BOUNDARY', 'DI_MODULE_GRAPH'] },
  'nestjs-event-driven':   { required: ['STATIC_IMPORT', 'EVENT_FLOW', 'WEBSOCKET_FLOW', 'API_BOUNDARY', 'DI_MODULE_GRAPH'] },
  'nestjs-iot':            { required: ['STATIC_IMPORT', 'EVENT_FLOW', 'MQTT_TOPIC_FLOW', 'WEBSOCKET_FLOW', 'API_BOUNDARY', 'DI_MODULE_GRAPH'] },
  'microservices':         { required: ['STATIC_IMPORT', 'EVENT_FLOW', 'API_BOUNDARY', 'RUNTIME_WIRING'] },
  'spa-api':               { required: ['STATIC_IMPORT', 'API_BOUNDARY', 'WEBSOCKET_FLOW'] },
  'unknown':               { required: ['STATIC_IMPORT'] },
};

function detectArchitectureProfile(rawSpecimen, client, runId) {
  if (!rawSpecimen) return 'unknown';

  try {
    const fsMod = require('fs');
    const pathMod = require('path');
    const intakePath = pathMod.join(REPO_ROOT, 'clients', client, 'psee/runs', runId, 'intake/canonical_repo');
    if (fsMod.existsSync(intakePath)) {
      const topFiles = fsMod.readdirSync(intakePath).join(' ').toLowerCase();
      const hasSubdirs = (dir) => {
        try { return fsMod.readdirSync(pathMod.join(intakePath, dir)).join(' ').toLowerCase(); } catch { return ''; }
      };
      const svgAgents = hasSubdirs('svg-agents');
      const backend = hasSubdirs('backend');

      if (svgAgents.includes('mqtt') || svgAgents.includes('paho') || svgAgents.includes('sensor'))
        return 'nestjs-iot';
      if (backend.includes('.module.ts') || topFiles.includes('nest'))
        return 'nestjs-event-driven';
      if (topFiles.includes('manage.py') || topFiles.includes('django') || topFiles.includes('wsgi'))
        return 'django-monolith';
      if (topFiles.includes('docker-compose') && topFiles.includes('requirements.txt'))
        return 'django-monolith';
      if (topFiles.includes('pyproject.toml') && topFiles.includes('netbox'))
        return 'django-monolith';
    }
  } catch {
    // Intake not accessible — fall back to specimen data
  }

  return 'unknown';
}

function resolveVisibilityLayerCompleteness(rawSpecimen, client, runId) {
  if (!rawSpecimen) return null;

  const profile = detectArchitectureProfile(rawSpecimen, client, runId);
  const required = (ARCHITECTURE_PROFILES[profile] || ARCHITECTURE_PROFILES['unknown']).required;

  const se = rawSpecimen.structural_enrichment || {};
  const hasCodeGraph = !!(se.available && se.code_graph);

  const runtimeConnPath = `clients/${client}/psee/runs/${runId}/structure/runtime_connectivity`;
  let hasEventFlow = false;
  let hasMqtt = false;
  let hasWebSocket = false;
  let hasApiBoundary = false;
  let hasDiModule = false;

  try {
    const fs = require('fs');
    const path = require('path');
    const rcDir = path.join(REPO_ROOT, runtimeConnPath);
    if (fs.existsSync(rcDir)) {
      const EVIDENCE_TYPE_TO_LAYER = {
        'EVENT_FLOW_GRAPH': 'EVENT_FLOW',
        'AMQP_EXCHANGE_GRAPH': 'EVENT_FLOW',
        'MQTT_TOPIC_GRAPH': 'MQTT_TOPIC_FLOW',
        'EXTERNAL_DEPENDENCY_GRAPH': 'MQTT_TOPIC_FLOW',
        'WEBSOCKET_FLOW_GRAPH': 'WEBSOCKET_FLOW',
        'API_BOUNDARY_GRAPH': 'API_BOUNDARY',
        'SERVICE_TOPOLOGY': 'API_BOUNDARY',
        'DI_MODULE_GRAPH': 'DI_MODULE_GRAPH',
      };
      const detectedLayers = new Set();
      const files = fs.readdirSync(rcDir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(rcDir, file), 'utf-8'));
          const layer = content.evidence_type && EVIDENCE_TYPE_TO_LAYER[content.evidence_type];
          if (layer) detectedLayers.add(layer);
        } catch { /* skip */ }
      }
      hasEventFlow = detectedLayers.has('EVENT_FLOW');
      hasMqtt = detectedLayers.has('MQTT_TOPIC_FLOW');
      hasWebSocket = detectedLayers.has('WEBSOCKET_FLOW');
      hasApiBoundary = detectedLayers.has('API_BOUNDARY');
      hasDiModule = detectedLayers.has('DI_MODULE_GRAPH');
    }
  } catch {
    // Runtime connectivity not available
  }

  const measured = [];
  if (hasCodeGraph) measured.push('STATIC_IMPORT');
  if (hasEventFlow) measured.push('EVENT_FLOW');
  if (hasMqtt) measured.push('MQTT_TOPIC_FLOW');
  if (hasWebSocket) measured.push('WEBSOCKET_FLOW');
  if (hasApiBoundary) measured.push('API_BOUNDARY');
  if (hasDiModule) measured.push('DI_MODULE_GRAPH');

  const missing = required.filter(r => !measured.includes(r));
  const completeness = required.length > 0 ? measured.filter(m => required.includes(m)).length / required.length : 0;

  const verdictScope = measured.length <= 1 ? 'CODE_CONNECTIVITY'
    : measured.length >= 4 ? 'SYSTEM_CONNECTIVITY'
    : 'PARTIAL_CONNECTIVITY';

  return {
    architecture_profile: profile,
    layers_measured: measured.map(id => ({ id, name: VISIBILITY_LAYERS[id].name, enrichment: VISIBILITY_LAYERS[id].enrichment })),
    layers_required: required.map(id => ({ id, name: VISIBILITY_LAYERS[id].name })),
    layers_missing: missing.map(id => ({ id, name: VISIBILITY_LAYERS[id].name })),
    completeness: Math.round(completeness * 100),
    verdict_scope: verdictScope,
    qualifier_modifier: completeness < 1.0 ? 'VISIBILITY_INCOMPLETE' : null,
    measured_count: measured.length,
    required_count: required.length,
  };
}

function determineContextLevel(client, runId, specimen, producedArtifacts) {
  if (!client || !runId) return CONTEXT_LEVEL.L0;
  if (!specimen) return CONTEXT_LEVEL.L0;

  const hasVerdict = specimen.governance_verdict || specimen.readiness_summary;
  if (producedArtifacts && producedArtifacts.length > 0) return CONTEXT_LEVEL.L3;
  if (hasVerdict) return CONTEXT_LEVEL.L2;
  return CONTEXT_LEVEL.L1;
}

function getAvailableDomains(contextLevel) {
  const domains = ['doctrine', 'commercial', 'runtime', 'vault'];
  if (contextLevel >= CONTEXT_LEVEL.L1) domains.push('specimen');
  if (contextLevel >= CONTEXT_LEVEL.L2) domains.push('verdict');
  if (contextLevel >= CONTEXT_LEVEL.L3) domains.push('publishing');
  return domains;
}

module.exports = {
  CONTEXT_LEVEL,
  KNOWLEDGE_DOMAINS,
  loadMarkdownFile,
  loadMultipleFiles,
  resolveSpecimen,
  stripForContext,
  resolveVerdict,
  condenseSpecimenTopology,
  condenseDependencyHub,
  condensePressureZones,
  condenseConstrictionPoints,
  condenseStructuralMass,
  resolveVisibilityLayerCompleteness,
  VISIBILITY_LAYERS,
  ARCHITECTURE_PROFILES,
  determineContextLevel,
  getAvailableDomains,
};

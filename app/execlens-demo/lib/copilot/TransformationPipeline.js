'use strict';

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { assemble, formatContextForPrompt } = require('./PIContextAssembler');
const { resolveMode, getModeConfig } = require('./ModeOrchestrator');
const { validate } = require('./ProhibitionValidator');
const { routeIntent } = require('./topic-router');

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 4096;

function loadEnvLocal() {
  if (process.env.ANTHROPIC_API_KEY) return;
  const envPath = path.resolve(__dirname, '../../.env.local');
  try {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {}
}

loadEnvLocal();

function createClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }
  return new Anthropic({ apiKey });
}

function buildMessages(history, currentMessage) {
  const messages = [];

  if (history && Array.isArray(history)) {
    for (const entry of history) {
      if (entry.role === 'user' || entry.role === 'assistant') {
        messages.push({
          role: entry.role,
          content: entry.content,
        });
      }
    }
  }

  messages.push({
    role: 'user',
    content: currentMessage,
  });

  return messages;
}

function buildSystemPrompt(assembled, modeConfig) {
  const parts = [
    assembled.systemPrompt,
    '',
    '---',
    '',
    'MODE GUIDANCE:',
    modeConfig.promptGuide,
    '',
    '---',
    '',
    'PI KNOWLEDGE (use this to ground your responses):',
    '',
    formatContextForPrompt(assembled),
  ];

  return parts.join('\n');
}

function extractVitals(assembled) {
  const vitals = {};

  if (assembled.structuralTopology) {
    const st = assembled.structuralTopology;

    if (st.topology?.clusters) {
      let totalDomains = 0;
      let structuralDomains = 0;
      const clusters = [];
      for (const c of st.topology.clusters) {
        const total = c.domains.length;
        const backed = c.domains.filter(d => d.structurally_backed).length;
        totalDomains += total;
        structuralDomains += backed;
        clusters.push({
          label: c.label,
          total,
          structural: backed,
        });
      }
      vitals.domains = { total: totalDomains, structural: structuralDomains };
      vitals.clusters = clusters;
    }

    if (st.dependencyHub?.metrics) {
      const m = st.dependencyHub.metrics;
      vitals.files = m.total_files;
      vitals.edges = m.total_import_edges;
    }

    if (st.pressureZones?.zones) {
      vitals.pressureZones = st.pressureZones.zones.length;
    }

    if (st.structuralMass?.code_graph) {
      const cg = st.structuralMass.code_graph;
      vitals.classes = cg.total_classes;
      vitals.functions = cg.total_functions;
    }
  }

  if (assembled.verdict?.boardroom) {
    const b = assembled.verdict.boardroom;
    vitals.posture = b.posture_label;
    vitals.confidence = b.overall_confidence;
  }

  return Object.keys(vitals).length > 0 ? vitals : null;
}

function extractPersonaSummary(audience) {
  if (!audience) return null;
  const { PERSONA_PROJECTIONS, ACCESS_TIER } = require('./PIContextAssembler');
  if (!PERSONA_PROJECTIONS) return null;
  const persona = PERSONA_PROJECTIONS[audience];
  if (!persona) return { name: audience };
  return {
    name: audience,
    decisionHorizon: persona.decisionHorizon,
    altitude: persona.altitude,
    accessTier: persona.accessTier,
  };
}

function wrapDisclosure(content, contextLevel) {
  const levelNames = {
    0: 'Level 0 — doctrine and commercial knowledge only (no specimen)',
    1: 'Level 1 — specimen loaded (no verdict)',
    2: 'Level 2 — verdict available',
    3: 'Level 3 — publishing assets available',
  };

  const disclosure = levelNames[contextLevel] || levelNames[0];
  return `${content}\n\n---\n*Context: ${disclosure}*`;
}

async function transform({
  message,
  mode: explicitMode,
  audience,
  client,
  runId,
  history,
  producedArtifacts,
}) {
  const resolvedMode = resolveMode(message, explicitMode);
  const modeConfig = getModeConfig(resolvedMode);

  const additionalTopics = modeConfig.additionalTopics || [];
  const intentRouting = routeIntent(message);
  const allTopics = [...new Set([...intentRouting.topics, ...additionalTopics])];

  const assembled = assemble({
    client,
    runId,
    intent: message,
    mode: resolvedMode,
    audience,
    producedArtifacts,
  });

  const systemPrompt = buildSystemPrompt(assembled, modeConfig);
  const messages = buildMessages(history, message);

  const anthropic = createClient();
  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: MAX_TOKENS,
    temperature: modeConfig.temperature,
    system: systemPrompt,
    messages,
  });

  const content = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  const validation = validate(content, assembled.contextLevel);
  const output = wrapDisclosure(content, assembled.contextLevel);

  return {
    content: output,
    rawContent: content,
    mode: resolvedMode,
    contextLevel: assembled.contextLevel,
    availableDomains: assembled.availableDomains,
    retrievedTopics: allTopics,
    validation,
    usage: {
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
    },
  };
}

async function* transformStream({
  message,
  mode: explicitMode,
  audience,
  client,
  runId,
  history,
  producedArtifacts,
}) {
  const resolvedMode = resolveMode(message, explicitMode);
  const modeConfig = getModeConfig(resolvedMode);

  const additionalTopics = modeConfig.additionalTopics || [];
  const intentRouting = routeIntent(message);
  const allTopics = [...new Set([...intentRouting.topics, ...additionalTopics])];

  const assembled = assemble({
    client,
    runId,
    intent: message,
    mode: resolvedMode,
    audience,
    producedArtifacts,
  });

  const systemPrompt = buildSystemPrompt(assembled, modeConfig);
  const messages = buildMessages(history, message);

  const anthropic = createClient();

  yield {
    type: 'meta',
    mode: resolvedMode,
    contextLevel: assembled.contextLevel,
    accessTier: assembled.accessTier,
    availableDomains: assembled.availableDomains,
    retrievedTopics: allTopics,
    vitals: extractVitals(assembled),
    persona: extractPersonaSummary(audience),
  };

  const stream = anthropic.messages.stream({
    model: DEFAULT_MODEL,
    max_tokens: MAX_TOKENS,
    temperature: modeConfig.temperature,
    system: systemPrompt,
    messages,
  });

  let fullContent = '';

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      fullContent += event.delta.text;
      yield {
        type: 'delta',
        text: event.delta.text,
      };
    }
  }

  const finalMessage = await stream.finalMessage();
  const validation = validate(fullContent, assembled.contextLevel);

  yield {
    type: 'done',
    validation,
    usage: {
      inputTokens: finalMessage.usage?.input_tokens,
      outputTokens: finalMessage.usage?.output_tokens,
    },
    disclosure: {
      contextLevel: assembled.contextLevel,
    },
  };
}

module.exports = {
  transform,
  transformStream,
  DEFAULT_MODEL,
};

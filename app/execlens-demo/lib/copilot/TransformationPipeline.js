'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const { assemble, formatContextForPrompt } = require('./PIContextAssembler');
const { resolveMode, getModeConfig } = require('./ModeOrchestrator');
const { validate } = require('./ProhibitionValidator');
const { routeIntent } = require('./topic-router');

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;

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
    availableDomains: assembled.availableDomains,
    retrievedTopics: allTopics,
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

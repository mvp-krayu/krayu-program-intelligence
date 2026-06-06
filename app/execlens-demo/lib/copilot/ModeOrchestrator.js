'use strict';

// Modes are internal orchestration constructs, not operator-facing prisons.
// The operator thinks in intent + audience + context.
// Mode resolution is internal — shaping how the pipeline processes a request.
//
// DEBT: V1 resolves to a single mode. Real operator intents often span
// multiple modes simultaneously ("Generate a PE acquisition briefing"
// = explain + compare + curate + position). Future: mode blend —
// intent resolves to weighted mode composition, not single selection.
// The transformation pipeline must eventually support multi-mode
// prompt assembly.

const MODES = {
  query: {
    id: 'query',
    tier: 'understand',
    label: 'Query',
    temperature: 0.0,
    promptGuide: 'Answer the operator\'s question using available PI knowledge. Cite the source domain (doctrine, commercial, vault, specimen, verdict) for key claims. Be precise and evidence-grounded.',
  },
  explore: {
    id: 'explore',
    tier: 'understand',
    label: 'Explore',
    temperature: 0.0,
    promptGuide: 'Help the operator navigate and discover connections in the PI knowledge graph. Surface related concepts, trace lineage, show how ideas connect. Guide the operator to deeper understanding.',
  },
  explain: {
    id: 'explain',
    tier: 'understand',
    label: 'Explain',
    temperature: 0.1,
    promptGuide: 'Explain the concept, finding, or architecture at depth appropriate to the operator\'s audience specification. No jargon escalation — use the terminology the operator uses. Build understanding progressively.',
  },
  compare: {
    id: 'compare',
    tier: 'curate',
    label: 'Compare',
    temperature: 0.0,
    promptGuide: 'Produce a structured comparison with evidence per dimension. Compare PI to competitors, SKUs to each other, domains to domains, or any two concepts the operator specifies. Every comparison claim must trace to structural evidence.',
    additionalTopics: ['competitive'],
  },
  curate: {
    id: 'curate',
    tier: 'curate',
    label: 'Curate',
    temperature: 0.2,
    promptGuide: 'Produce a consumption artifact for the specified audience. The artifact catalog is OPEN — produce whatever the operator requests. Adapt language, depth, and framing for the target audience. Same governed knowledge, different consumption format.',
  },
  challenge: {
    id: 'challenge',
    tier: 'curate',
    label: 'Challenge',
    minLevel: 1,
    temperature: 0.1,
    promptGuide: 'Stress-test findings with evidence. Handle objections the audience might raise. Play devil\'s advocate using structural evidence — never invent objections from outside the evidence boundary. Every challenge and response must trace to governed findings.',
  },
  visualize: {
    id: 'visualize',
    tier: 'publish',
    label: 'Visualize',
    minLevel: 2,
    temperature: 0.0,
    promptGuide: 'Describe visual representation of structural findings. Reference topology, pressure zones, and domain relationships. Produce specifications for charts, diagrams, or visual narratives that could be rendered from the governed data.',
  },
  package: {
    id: 'package',
    tier: 'publish',
    label: 'Package',
    minLevel: 2,
    temperature: 0.1,
    promptGuide: 'Format curated content into a deliverable artifact. Apply formatting appropriate to the output type (brief, deck outline, one-pager, executive summary). Structure content for the delivery medium.',
  },
  position: {
    id: 'position',
    tier: 'publish',
    label: 'Position',
    temperature: 0.2,
    promptGuide: 'Frame commercial implications. Position PI capabilities for the specified audience. Use commercial authority (offer catalog, SKU model, competitive positioning) to ground positioning claims. Never overclaim beyond evidence.',
    additionalTopics: ['commercial', 'competitive'],
  },
};

const INTENT_PATTERNS = [
  { mode: 'compare',   patterns: [/\bcompar/i, /\bvs\.?\b/i, /\bversus\b/i, /\bdifferen(ce|t)/i, /\bcontrast\b/i] },
  { mode: 'curate',    patterns: [/\bgenerat/i, /\bcreate\b/i, /\bproduce\b/i, /\bdraft\b/i, /\bwrite\b/i, /\bbrief\b/i, /\bsummary\b/i, /\bone-?pager\b/i] },
  { mode: 'challenge',  patterns: [/\bchalleng/i, /\bobjection/i, /\bstress[- ]?test/i, /\bdefend\b/i, /\bdevil/i, /\bpush\s*back/i] },
  { mode: 'explain',   patterns: [/\bexplain\b/i, /\bwhat\s+is\b/i, /\bhow\s+does\b/i, /\bwhy\s+does\b/i, /\bwhat\s+does\b/i, /\bdescribe\b/i] },
  { mode: 'explore',   patterns: [/\bexplor/i, /\bnavigate\b/i, /\btrace\b/i, /\blineage\b/i, /\bconnect/i, /\brelat/i] },
  { mode: 'visualize', patterns: [/\bvisuali[sz]/i, /\bchart\b/i, /\bdiagram\b/i, /\bgraph\b/i, /\bvisual\b/i] },
  { mode: 'package',   patterns: [/\bpackage\b/i, /\bformat\b/i, /\bdeck\b/i, /\bslide/i, /\bpresentation\b/i] },
  { mode: 'position',  patterns: [/\bposition/i, /\bcommercial\b/i, /\bsell\b/i, /\bpitch\b/i, /\bproposal\b/i] },
];

function inferMode(input) {
  if (!input) return 'query';

  for (const { mode, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(input)) return mode;
    }
  }

  return 'query';
}

function resolveMode(input, explicitMode) {
  if (explicitMode && MODES[explicitMode]) return explicitMode;
  return inferMode(input);
}

function getModeConfig(modeId) {
  return MODES[modeId] || MODES.query;
}

function isAvailableAtLevel(modeId, contextLevel) {
  const mode = MODES[modeId];
  if (!mode) return false;
  if (!mode.minLevel) return true;
  return contextLevel >= mode.minLevel;
}

function getAvailableModes(contextLevel) {
  return Object.values(MODES).filter(m => !m.minLevel || contextLevel >= m.minLevel);
}

module.exports = {
  MODES,
  inferMode,
  resolveMode,
  getModeConfig,
  isAvailableAtLevel,
  getAvailableModes,
};

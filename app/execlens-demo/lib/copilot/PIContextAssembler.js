'use strict';

const path = require('path');
const {
  CONTEXT_LEVEL,
  loadMarkdownFile,
  loadMultipleFiles,
  resolveSpecimen,
  stripForContext,
  resolveVerdict,
  determineContextLevel,
  getAvailableDomains,
} = require('./PIKnowledgeGraphAccess');
const { routeIntent } = require('./topic-router');

const BOOT_CONTEXT_PATH = path.join(__dirname, 'pi-boot-context.md');

let cachedBootContext = null;

function loadBootContext() {
  if (cachedBootContext) return cachedBootContext;
  try {
    cachedBootContext = require('fs').readFileSync(BOOT_CONTEXT_PATH, 'utf-8');
  } catch {
    cachedBootContext = '[Boot context unavailable]';
  }
  return cachedBootContext;
}

function assembleTier1() {
  return {
    bootContext: loadBootContext(),
  };
}

function assembleTier2(contextLevel, client, runId, producedArtifacts) {
  const tier2 = {
    specimen: null,
    verdict: null,
    publishingAssets: null,
  };

  if (contextLevel < CONTEXT_LEVEL.L1 || !client || !runId) {
    return tier2;
  }

  const rawSpecimen = resolveSpecimen(client, runId);
  if (!rawSpecimen) return tier2;

  tier2.specimen = stripForContext(rawSpecimen);

  if (contextLevel >= CONTEXT_LEVEL.L2) {
    tier2.verdict = resolveVerdict(rawSpecimen);
  }

  if (contextLevel >= CONTEXT_LEVEL.L3 && producedArtifacts) {
    tier2.publishingAssets = producedArtifacts.map(a => ({
      title: a.title,
      audience: a.audience,
      mode: a.mode,
      timestamp: a.timestamp,
      contentPreview: (a.content || '').slice(0, 500),
    }));
  }

  return tier2;
}

function assembleTier3(intent) {
  if (!intent) return { topics: [], documents: [] };

  const routing = routeIntent(intent);
  const documents = loadMultipleFiles(routing.files);

  return {
    topics: routing.topics,
    documents,
  };
}

function assembleSystemPrompt(contextLevel, mode, audience) {
  const levelDescriptions = {
    [CONTEXT_LEVEL.L0]: 'Level 0 — Doctrine, commercial, vault, and runtime knowledge available. No specimen loaded.',
    [CONTEXT_LEVEL.L1]: 'Level 1 — Specimen loaded. Topology, signals, findings, and qualification state available.',
    [CONTEXT_LEVEL.L2]: 'Level 2 — Verdict generated. Full structural assessment with posture, findings, and governed narrative available.',
    [CONTEXT_LEVEL.L3]: 'Level 3 — Publishing assets available. Previously generated consumption artifacts can be refined.',
  };

  const parts = [
    'You are the PI Co-Pilot — the universal intelligence interaction surface for Program Intelligence.',
    'Your purpose is operator amplification: the operator enters with intent, you contribute knowledge + context + transformation, the outcome is an amplified operator.',
    '',
    `Current context: ${levelDescriptions[contextLevel] || levelDescriptions[CONTEXT_LEVEL.L0]}`,
    '',
    'ABSOLUTE PROHIBITIONS (non-negotiable):',
    '- Never infer team behavior, organizational intent, or human motive',
    '- Never diagnose culture, leadership quality, or management effectiveness',
    '- Never attribute findings to personnel or predict individual behavior',
    '- Never prescribe remediation or say "you should"',
    '- Never rank next actions or prioritize fixes',
    '- Never create intelligence — only interrogate, explain, curate, package',
    '- Never change findings, evidence, or qualification state',
    '- Never claim knowledge beyond your current context level',
    '- All outputs must be traceable to structural evidence',
    '',
    'CONTEXT-HONESTY: Always disclose what context level you are operating at. If asked about specimen-specific data at Level 0, say so — do not hallucinate context you do not have.',
  ];

  if (audience) {
    parts.push('', `Target audience: ${audience}. Adapt language, depth, and framing for this audience.`);
  }

  if (mode) {
    parts.push('', `Active mode: ${mode}. This shapes the transformation type but does not constrain the operator's intent.`);
  }

  return parts.join('\n');
}

function assemble({ client, runId, intent, mode, audience, producedArtifacts }) {
  const rawSpecimen = (client && runId) ? resolveSpecimen(client, runId) : null;
  const contextLevel = determineContextLevel(client, runId, rawSpecimen, producedArtifacts);
  const availableDomains = getAvailableDomains(contextLevel);

  const tier1 = assembleTier1();
  const tier2 = assembleTier2(contextLevel, client, runId, producedArtifacts);
  const tier3 = assembleTier3(intent);
  const systemPrompt = assembleSystemPrompt(contextLevel, mode, audience);

  return {
    contextLevel,
    client: client || null,
    runId: runId || null,
    availableDomains,

    systemPrompt,
    bootContext: tier1.bootContext,

    specimen: tier2.specimen,
    verdict: tier2.verdict,
    publishingAssets: tier2.publishingAssets,

    retrievedTopics: tier3.topics,
    retrievedDocuments: tier3.documents,
  };
}

function formatContextForPrompt(assembled) {
  const sections = [];

  sections.push(assembled.bootContext);

  if (assembled.retrievedDocuments.length > 0) {
    sections.push('\n---\n## Retrieved Knowledge\n');
    for (const doc of assembled.retrievedDocuments) {
      sections.push(`### ${doc.path}\n\n${doc.content}\n`);
    }
  }

  if (assembled.specimen) {
    sections.push('\n---\n## Specimen Data\n');
    const specimenSummary = formatSpecimenSummary(assembled.specimen);
    sections.push(specimenSummary);
  }

  if (assembled.verdict) {
    sections.push('\n---\n## Verdict Data\n');
    if (assembled.verdict.boardroom) {
      sections.push('### Boardroom Projection\n');
      sections.push(JSON.stringify(assembled.verdict.boardroom, null, 2));
    }
    if (assembled.verdict.balanced) {
      sections.push('\n### Balanced Projection\n');
      sections.push(JSON.stringify(assembled.verdict.balanced, null, 2));
    }
  }

  if (assembled.publishingAssets && assembled.publishingAssets.length > 0) {
    sections.push('\n---\n## Previously Produced Artifacts\n');
    for (const asset of assembled.publishingAssets) {
      sections.push(`- **${asset.title}** (${asset.audience}, ${asset.mode}, ${asset.timestamp})`);
      if (asset.contentPreview) {
        sections.push(`  Preview: ${asset.contentPreview}...`);
      }
    }
  }

  return sections.join('\n');
}

function formatSpecimenSummary(specimen) {
  const parts = [];

  if (specimen.client) parts.push(`Client: ${specimen.client}`);
  if (specimen.run_id) parts.push(`Run: ${specimen.run_id}`);

  if (specimen.topology_summary) {
    const t = specimen.topology_summary;
    parts.push(`Topology: ${t.domain_count || '?'} domains, ${t.cluster_count || '?'} clusters`);
  }

  if (specimen.readiness_summary) {
    const r = specimen.readiness_summary;
    parts.push(`Posture: ${r.posture || 'unknown'}`);
    parts.push(`Readiness band: ${r.band || 'unknown'}`);
  }

  if (specimen.qualifier_summary) {
    const q = specimen.qualifier_summary;
    parts.push(`Qualifier class: ${q.qualifier_class || 'unknown'}`);
  }

  if (specimen.evidence_summary) {
    const e = specimen.evidence_summary;
    parts.push(`Signal count: ${e.signal_count || '?'}`);
  }

  if (specimen.semantic_domain_registry) {
    const domains = Object.keys(specimen.semantic_domain_registry);
    if (domains.length > 0) {
      parts.push(`Domains: ${domains.join(', ')}`);
    }
  }

  return parts.join('\n');
}

module.exports = {
  assembleTier1,
  assembleTier2,
  assembleTier3,
  assembleSystemPrompt,
  assemble,
  formatContextForPrompt,
};

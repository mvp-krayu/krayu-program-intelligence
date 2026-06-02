'use strict';

const fs = require('fs');
const path = require('path');

const { resolveFlagshipBinding } = require('../lens-v2/flagshipBinding');
const { compile, forBoardroom, forBalanced } = require('../lens-v2/software-intelligence/ConsequenceCompiler');
const { synthesize } = require('../lens-v2/SignalSynthesisEngine');

const REPO_ROOT = path.resolve(__dirname, '../../../../');

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

function resolveVerdict(specimen) {
  if (!specimen) return null;

  try {
    const synthesisResult = synthesize(specimen);
    const consequenceResult = compile(synthesisResult, specimen);
    const boardroom = forBoardroom(consequenceResult, synthesisResult, specimen);
    const balanced = forBalanced(consequenceResult, synthesisResult, specimen);

    return {
      boardroom: condenseBoardroom(boardroom),
      balanced: condenseBalanced(balanced),
    };
  } catch {
    return null;
  }
}

function condenseBoardroom(projection) {
  if (!projection) return null;
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
  };
}

function condenseBalanced(projection) {
  if (!projection) return null;
  return {
    posture_label: projection.posture_label,
    primary_locus: projection.primary_locus,
    overall_confidence: projection.overall_confidence,
    primary_story: projection.primary_story,
    confidence_sentence: projection.confidence_sentence,
    combined_synthesis: projection.combined_synthesis,
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
  determineContextLevel,
  getAvailableDomains,
};

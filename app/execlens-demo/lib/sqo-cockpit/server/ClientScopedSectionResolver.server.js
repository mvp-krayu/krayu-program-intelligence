'use strict';

const { resolveRuntimeSubstrates } = require('./SQORuntimeResolver.server');

const BLUEEDGE_CLIENT = 'blueedge';
const BLUEEDGE_RUN = 'run_blueedge_productized_01_fixed';

function resolveClientScopedSection(client, runId, section) {
  const runtime = resolveRuntimeSubstrates(client, runId);
  const available = runtime.sectionAvailability[section];

  if (!available) {
    return { available: false, failReason: 'SECTION_NOT_AVAILABLE', section, client, runId };
  }

  switch (section) {
    case 'semantic-candidates':
      return resolveSemanticCandidates(client, runId, runtime);
    case 'ceu-admissibility':
      return resolveCEUAdmissibility(client, runId);
    case 'evidence-ingestion':
      return resolveEvidenceIngestion(client, runId);
    case 'corridor':
      return resolveCorridor(client, runId);
    case 'evidence-rebase':
      return resolveEvidenceRebase(client, runId);
    default:
      return { available: false, failReason: 'UNKNOWN_SECTION', section };
  }
}

function resolveSemanticCandidates(client, runId, runtime) {
  if (client === BLUEEDGE_CLIENT && runId === BLUEEDGE_RUN) {
    return loadBlueEdgeCandidates();
  }

  if (runtime.capabilities.semantic_candidates) {
    const { resolveSemanticQualificationIntake } = require('./SemanticQualificationIntakeResolver.server');
    return resolveSemanticQualificationIntake(client, runId);
  }

  return { available: false, failReason: 'NO_SEMANTIC_CANDIDATE_DATA', section: 'semantic-candidates', client, runId };
}

function loadBlueEdgeCandidates() {
  try {
    const { loadRebasedCandidateData } = require('./ExplicitEvidenceRebaseExtractor.server');
    const { buildSemanticCandidateViewModel } = require('../client/BlueEdgeSemanticCandidateViewModel');
    const candidateData = loadRebasedCandidateData();
    const extraction = buildSemanticCandidateViewModel(candidateData);
    if (extraction.available) {
      extraction.source_status = candidateData.source_status || null;
      extraction.previous_chain_status = candidateData.previous_chain_status || null;
      extraction.evidence_set_id = candidateData.evidence_set_id || null;
      extraction.evidence_files = candidateData.evidence_files || [];
      extraction.source_class = candidateData.source_class || null;
    }
    extraction.layer = 'A';
    return extraction;
  } catch (_e) {
    return { available: false, failReason: 'BLUEEDGE_LOADER_ERROR', layer: 'A' };
  }
}

function resolveCEUAdmissibility(client, runId) {
  if (client !== BLUEEDGE_CLIENT || runId !== BLUEEDGE_RUN) {
    return { available: false, failReason: 'CEU_ADMISSIBILITY_BLUEEDGE_ONLY', section: 'ceu-admissibility', client, runId };
  }
  try {
    const { loadRebasedAdmissibilityData } = require('./ExplicitEvidenceRebaseExtractor.server');
    const { buildDynamicCEUAdmissibilityViewModel } = require('../client/DynamicCEUAdmissibilityViewModel');
    const admissibilityData = loadRebasedAdmissibilityData();
    const admissibility = buildDynamicCEUAdmissibilityViewModel(admissibilityData);
    if (admissibility.available) {
      admissibility.source_status = admissibilityData.source_status || null;
      admissibility.previous_chain_status = admissibilityData.previous_chain_status || null;
      admissibility.evidence_set_id = admissibilityData.evidence_set_id || null;
      admissibility.evidence_files = admissibilityData.evidence_files || [];
      admissibility.source_class = admissibilityData.source_class || null;
    }
    admissibility.layer = 'A';
    return admissibility;
  } catch (_e) {
    return { available: false, failReason: 'CEU_LOADER_ERROR', layer: 'A' };
  }
}

function resolveEvidenceIngestion(client, runId) {
  if (client !== BLUEEDGE_CLIENT || runId !== BLUEEDGE_RUN) {
    return { available: false, failReason: 'EVIDENCE_INGESTION_BLUEEDGE_ONLY', section: 'evidence-ingestion', client, runId };
  }
  try {
    const { loadEvidenceIngestionData } = require('./BlueEdgeEvidenceIngestionLoader.server');
    const { buildEvidenceViewModel } = require('../client/BlueEdgeEvidenceViewModel');
    const rawData = loadEvidenceIngestionData();
    const evidence = buildEvidenceViewModel(rawData);
    evidence.layer = 'A';
    return evidence;
  } catch (_e) {
    return { available: false, failReason: 'EVIDENCE_INGESTION_LOADER_ERROR', layer: 'A' };
  }
}

function resolveCorridor(client, runId) {
  if (client !== BLUEEDGE_CLIENT || runId !== BLUEEDGE_RUN) {
    return { available: false, failReason: 'CORRIDOR_BLUEEDGE_ONLY', section: 'corridor', client, runId };
  }
  try {
    const { loadCorridorData } = require('./BlueEdgeRuntimeCorridorLoader.server');
    const { buildCorridorViewModel } = require('../client/BlueEdgeRuntimeCorridorViewModel');
    const rawData = loadCorridorData();
    const corridor = buildCorridorViewModel(rawData);
    corridor.layer = 'A';
    return corridor;
  } catch (_e) {
    return { available: false, failReason: 'CORRIDOR_LOADER_ERROR', layer: 'A' };
  }
}

function resolveEvidenceRebase(client, runId) {
  if (client !== BLUEEDGE_CLIENT || runId !== BLUEEDGE_RUN) {
    return { available: false, failReason: 'EVIDENCE_REBASE_BLUEEDGE_ONLY', section: 'evidence-rebase', client, runId };
  }
  try {
    const { loadExplicitEvidenceRebaseData } = require('./ExplicitEvidenceRebaseExtractor.server');
    const { buildExplicitEvidenceRebaseViewModel } = require('../client/ExplicitEvidenceRebaseViewModel');
    const rawData = loadExplicitEvidenceRebaseData();
    const rebase = buildExplicitEvidenceRebaseViewModel(rawData);
    rebase.layer = 'A';
    return rebase;
  } catch (_e) {
    return { available: false, failReason: 'EVIDENCE_REBASE_LOADER_ERROR', layer: 'A' };
  }
}

module.exports = { resolveClientScopedSection };

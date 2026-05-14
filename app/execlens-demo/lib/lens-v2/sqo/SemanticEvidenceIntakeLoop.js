'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { computeHash, getSourceCommit, writeArtifact } = require('./QualificationStateArtifact');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');
const SCHEMA_VERSION = '1.0';
const COMPILER_VERSION = '1.0';

const SOURCE_CLASS = {
  STRUCTURAL_EVIDENCE: 'STRUCTURAL_EVIDENCE',
  GAUGE_ARTIFACT: 'GAUGE_ARTIFACT',
  DIAGNOSTIC_NARRATIVE: 'DIAGNOSTIC_NARRATIVE',
  EXPLICIT_REBASE: 'EXPLICIT_REBASE',
  CLIENT_UPLOAD: 'CLIENT_UPLOAD',
  UNKNOWN: 'UNKNOWN',
};

const INTAKE_STATUS = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  QUARANTINED: 'QUARANTINED',
};

const REJECTION_REASON = {
  HASH_MISMATCH: 'HASH_MISMATCH',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  PATH_VIOLATION: 'PATH_VIOLATION',
  EMPTY_FILE: 'EMPTY_FILE',
  INVALID_SOURCE_TYPE: 'INVALID_SOURCE_TYPE',
};

const ELIGIBLE_OPS = {
  SEMANTIC_RECONSTRUCTION: 'SEMANTIC_RECONSTRUCTION',
  ENRICHMENT: 'ENRICHMENT',
  RECONCILIATION: 'RECONCILIATION',
  LIFECYCLE_PROGRESSION: 'LIFECYCLE_PROGRESSION',
};

const SOURCE_TYPE_TO_CLASS = {
  'HTML_EVIDENCE_BRIEF': SOURCE_CLASS.STRUCTURAL_EVIDENCE,
  'HTML_GAUGE_ARTIFACT': SOURCE_CLASS.GAUGE_ARTIFACT,
  'HTML_GAUGE_CLAIM': SOURCE_CLASS.GAUGE_ARTIFACT,
  'HTML_DIAGNOSTIC_NARRATIVE': SOURCE_CLASS.DIAGNOSTIC_NARRATIVE,
  'HTML_EXPLICIT_REBASE': SOURCE_CLASS.EXPLICIT_REBASE,
  'PDF_EVIDENCE': SOURCE_CLASS.CLIENT_UPLOAD,
  'JSON_ARTIFACT': SOURCE_CLASS.STRUCTURAL_EVIDENCE,
};

function classifySource(sourceType) {
  return SOURCE_TYPE_TO_CLASS[sourceType] || SOURCE_CLASS.UNKNOWN;
}

function computeFileHash(absPath) {
  const content = fs.readFileSync(absPath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function validateEvidence(item) {
  if (!item || !item.source_path) {
    return { status: INTAKE_STATUS.REJECTED, reason: REJECTION_REASON.PATH_VIOLATION, detail: 'no source_path' };
  }

  const abs = path.resolve(REPO_ROOT, item.source_path);
  if (!abs.startsWith(REPO_ROOT)) {
    return { status: INTAKE_STATUS.REJECTED, reason: REJECTION_REASON.PATH_VIOLATION, detail: 'path outside repo root' };
  }

  if (!fs.existsSync(abs)) {
    return { status: INTAKE_STATUS.REJECTED, reason: REJECTION_REASON.FILE_NOT_FOUND, detail: abs };
  }

  const stat = fs.statSync(abs);
  if (stat.size === 0) {
    return { status: INTAKE_STATUS.REJECTED, reason: REJECTION_REASON.EMPTY_FILE, detail: abs };
  }

  const computedHash = computeFileHash(abs);
  if (item.evidence_hash && computedHash !== item.evidence_hash) {
    return {
      status: INTAKE_STATUS.QUARANTINED,
      reason: REJECTION_REASON.HASH_MISMATCH,
      detail: `expected ${item.evidence_hash}, computed ${computedHash}`,
      computed_hash: computedHash,
      expected_hash: item.evidence_hash,
    };
  }

  return {
    status: INTAKE_STATUS.ACCEPTED,
    reason: null,
    computed_hash: computedHash,
    file_size: stat.size,
  };
}

function determineEligibility(sourceClass, validationResult) {
  if (validationResult.status !== INTAKE_STATUS.ACCEPTED) {
    return [];
  }

  const eligible = [];

  if (sourceClass === SOURCE_CLASS.STRUCTURAL_EVIDENCE) {
    eligible.push(ELIGIBLE_OPS.SEMANTIC_RECONSTRUCTION);
    eligible.push(ELIGIBLE_OPS.ENRICHMENT);
    eligible.push(ELIGIBLE_OPS.RECONCILIATION);
    eligible.push(ELIGIBLE_OPS.LIFECYCLE_PROGRESSION);
  }

  if (sourceClass === SOURCE_CLASS.EXPLICIT_REBASE) {
    eligible.push(ELIGIBLE_OPS.SEMANTIC_RECONSTRUCTION);
    eligible.push(ELIGIBLE_OPS.ENRICHMENT);
    eligible.push(ELIGIBLE_OPS.RECONCILIATION);
    eligible.push(ELIGIBLE_OPS.LIFECYCLE_PROGRESSION);
  }

  if (sourceClass === SOURCE_CLASS.GAUGE_ARTIFACT) {
    eligible.push(ELIGIBLE_OPS.ENRICHMENT);
    eligible.push(ELIGIBLE_OPS.RECONCILIATION);
  }

  if (sourceClass === SOURCE_CLASS.DIAGNOSTIC_NARRATIVE) {
    eligible.push(ELIGIBLE_OPS.ENRICHMENT);
  }

  return eligible;
}

function processIntakeItem(item) {
  const sourceClass = classifySource(item.source_type);
  const validation = validateEvidence(item);
  const eligibility = determineEligibility(sourceClass, validation);

  return {
    evidence_id: item.evidence_id,
    source_type: item.source_type,
    source_class: sourceClass,
    source_path: item.source_path,
    authority_state: item.authority_state || 'UNKNOWN',
    candidate_domain_count: (item.candidate_domains || []).length,
    candidate_domains: item.candidate_domains || [],
    provenance_origin: item.provenance_origin || null,
    intake_status: validation.status,
    rejection_reason: validation.reason,
    rejection_detail: validation.detail || null,
    hash_verified: validation.status === INTAKE_STATUS.ACCEPTED,
    computed_hash: validation.computed_hash || null,
    expected_hash: item.evidence_hash || null,
    file_size: validation.file_size || item.file_size_bytes || null,
    eligible_operations: eligibility,
    description: item.description || null,
  };
}

function scanRebaseEvidence(client) {
  const rebaseDir = path.join(REPO_ROOT, 'clients', client, 'sqo', 'evidence');
  if (!fs.existsSync(rebaseDir)) return [];

  const rebaseItems = [];
  const sets = fs.readdirSync(rebaseDir).filter(f => {
    const full = path.join(rebaseDir, f);
    return fs.statSync(full).isDirectory();
  });

  for (const setName of sets) {
    const setDir = path.join(rebaseDir, setName);
    const files = fs.readdirSync(setDir).filter(f => f.endsWith('.html') || f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.relative(REPO_ROOT, path.join(setDir, file));
      const abs = path.join(setDir, file);
      const stat = fs.statSync(abs);
      const hash = computeFileHash(abs);
      rebaseItems.push({
        evidence_id: `EV-REBASE-${setName}-${file.replace(/\.[^.]+$/, '')}`,
        source_type: 'HTML_EXPLICIT_REBASE',
        source_path: filePath,
        evidence_hash: hash,
        file_size_bytes: stat.size,
        provenance_origin: `EXPLICIT_REBASE_${setName}`,
        authority_state: 'NON_AUTHORITATIVE_EVIDENCE',
        candidate_domains: [],
        description: `Rebase evidence: ${file} from ${setName}`,
      });
    }
  }

  return rebaseItems;
}

function runIntakeLoop(inputs) {
  const { evidenceRegistry, client, runId, includeRebase } = inputs;

  const registryItems = (evidenceRegistry && evidenceRegistry.evidence_items) || [];
  const rebaseItems = includeRebase ? scanRebaseEvidence(client) : [];

  const allItems = [...registryItems, ...rebaseItems];
  const processedItems = allItems.map(processIntakeItem);

  const accepted = processedItems.filter(i => i.intake_status === INTAKE_STATUS.ACCEPTED);
  const rejected = processedItems.filter(i => i.intake_status === INTAKE_STATUS.REJECTED);
  const quarantined = processedItems.filter(i => i.intake_status === INTAKE_STATUS.QUARANTINED);

  const eligibilityCounts = {};
  for (const item of accepted) {
    for (const op of item.eligible_operations) {
      eligibilityCounts[op] = (eligibilityCounts[op] || 0) + 1;
    }
  }

  const sourceClassDist = {};
  for (const item of processedItems) {
    sourceClassDist[item.source_class] = (sourceClassDist[item.source_class] || 0) + 1;
  }

  const allDomains = new Set();
  for (const item of accepted) {
    for (const d of item.candidate_domains) {
      allDomains.add(d);
    }
  }

  const intakeSummary = {
    total_items: processedItems.length,
    accepted_count: accepted.length,
    rejected_count: rejected.length,
    quarantined_count: quarantined.length,
    all_valid: rejected.length === 0 && quarantined.length === 0,
    source_class_distribution: sourceClassDist,
    eligibility_counts: eligibilityCounts,
    covered_domains: [...allDomains].sort(),
    covered_domain_count: allDomains.size,
    registry_items_count: registryItems.length,
    rebase_items_count: rebaseItems.length,
  };

  const body = {
    schema_version: SCHEMA_VERSION,
    artifact_type: 'semantic_evidence_intake',
    client,
    run_id: runId,
    generated_at: new Date().toISOString(),
    compiler_version: COMPILER_VERSION,
    intake_summary: intakeSummary,
    items: processedItems,
    accepted: accepted.map(i => ({
      evidence_id: i.evidence_id,
      source_class: i.source_class,
      eligible_operations: i.eligible_operations,
      candidate_domain_count: i.candidate_domain_count,
    })),
    rejected: rejected.map(i => ({
      evidence_id: i.evidence_id,
      source_class: i.source_class,
      rejection_reason: i.rejection_reason,
      rejection_detail: i.rejection_detail,
    })),
    quarantined: quarantined.map(i => ({
      evidence_id: i.evidence_id,
      source_class: i.source_class,
      rejection_reason: i.rejection_reason,
      rejection_detail: i.rejection_detail,
    })),
    eligibility: {
      semantic_reconstruction: accepted.filter(i => i.eligible_operations.includes(ELIGIBLE_OPS.SEMANTIC_RECONSTRUCTION)).map(i => i.evidence_id),
      enrichment: accepted.filter(i => i.eligible_operations.includes(ELIGIBLE_OPS.ENRICHMENT)).map(i => i.evidence_id),
      reconciliation: accepted.filter(i => i.eligible_operations.includes(ELIGIBLE_OPS.RECONCILIATION)).map(i => i.evidence_id),
      lifecycle_progression: accepted.filter(i => i.eligible_operations.includes(ELIGIBLE_OPS.LIFECYCLE_PROGRESSION)).map(i => i.evidence_id),
    },
    governance: {
      deterministic: true,
      replay_safe: true,
      no_inference: true,
      no_enrichment: true,
      no_authority_promotion: true,
      ingestion_boundary: 'NON_AUTHORITATIVE',
    },
    provenance: {
      source_artifacts: ['evidence_registry.v1.json'],
      source_commit: getSourceCommit(),
      output_hash: null,
    },
  };

  body.provenance.output_hash = 'sha256:' + computeHash(body);
  return body;
}

function emitIntakeArtifact(artifact, client, runId) {
  const outputDir = path.join(REPO_ROOT, 'artifacts', 'sqo', client, runId);
  const outputPath = path.join(outputDir, 'semantic_evidence_intake.v1.json');
  writeArtifact(outputPath, artifact);
  return { path: outputPath, artifact };
}

module.exports = {
  SCHEMA_VERSION,
  COMPILER_VERSION,
  SOURCE_CLASS,
  INTAKE_STATUS,
  REJECTION_REASON,
  ELIGIBLE_OPS,
  classifySource,
  validateEvidence,
  determineEligibility,
  processIntakeItem,
  scanRebaseEvidence,
  runIntakeLoop,
  emitIntakeArtifact,
};

#!/usr/bin/env node

/**
 * Compile BlueEdge semantic evidence intake loop.
 * PI.SQO.BLUEEDGE.SEMANTIC-EVIDENCE-INTAKE-LOOP.01
 *
 * Loads evidence registry, scans rebase evidence, validates all items,
 * classifies sources, determines eligibility, and emits the intake artifact.
 *
 * Usage: node scripts/reconciliation/compile_blueedge_evidence_intake.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const { runIntakeLoop, emitIntakeArtifact } = require('../../app/execlens-demo/lib/lens-v2/sqo/SemanticEvidenceIntakeLoop');

const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';
const REPO_ROOT = process.env.REPO_ROOT;

function loadJSON(filePath) {
  const abs = path.resolve(REPO_ROOT, filePath);
  if (!fs.existsSync(abs)) {
    console.error(`MISSING: ${abs}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

const evidenceRegistry = loadJSON(
  `artifacts/sqo/${CLIENT}/${RUN_ID}/evidence-ingestion/evidence_registry.v1.json`
);

if (!evidenceRegistry) {
  console.error('FATAL: evidence registry not found');
  process.exit(1);
}

console.log(`Running evidence intake loop for ${CLIENT}/${RUN_ID}...`);
console.log(`  Registry items: ${(evidenceRegistry.evidence_items || []).length}`);

const artifact = runIntakeLoop({
  evidenceRegistry,
  client: CLIENT,
  runId: RUN_ID,
  includeRebase: true,
});

const result = emitIntakeArtifact(artifact, CLIENT, RUN_ID);
console.log(`\nArtifact written: ${result.path}`);

const s = artifact.intake_summary;
console.log(`\nIntake summary:`);
console.log(`  Total items: ${s.total_items}`);
console.log(`  Accepted: ${s.accepted_count}`);
console.log(`  Rejected: ${s.rejected_count}`);
console.log(`  Quarantined: ${s.quarantined_count}`);
console.log(`  All valid: ${s.all_valid}`);
console.log(`  Covered domains: ${s.covered_domain_count}`);

console.log(`\nSource class distribution:`);
for (const [k, v] of Object.entries(s.source_class_distribution)) {
  console.log(`  ${k}: ${v}`);
}

console.log(`\nEligibility counts:`);
for (const [k, v] of Object.entries(s.eligibility_counts)) {
  console.log(`  ${k}: ${v}`);
}

console.log(`\nAccepted items:`);
for (const a of artifact.accepted) {
  console.log(`  ${a.evidence_id}: ${a.source_class} → [${a.eligible_operations.join(', ')}]`);
}

if (artifact.rejected.length > 0) {
  console.log(`\nRejected items:`);
  for (const r of artifact.rejected) {
    console.log(`  ${r.evidence_id}: ${r.rejection_reason} — ${r.rejection_detail}`);
  }
}

if (artifact.quarantined.length > 0) {
  console.log(`\nQuarantined items:`);
  for (const q of artifact.quarantined) {
    console.log(`  ${q.evidence_id}: ${q.rejection_reason} — ${q.rejection_detail}`);
  }
}

console.log(`\nEligibility matrix:`);
const elig = artifact.eligibility;
console.log(`  SEMANTIC_RECONSTRUCTION: [${elig.semantic_reconstruction.join(', ')}]`);
console.log(`  ENRICHMENT: [${elig.enrichment.join(', ')}]`);
console.log(`  RECONCILIATION: [${elig.reconciliation.join(', ')}]`);
console.log(`  LIFECYCLE_PROGRESSION: [${elig.lifecycle_progression.join(', ')}]`);

console.log(`\nDone.`);

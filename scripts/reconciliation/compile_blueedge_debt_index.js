#!/usr/bin/env node

/**
 * Compile BlueEdge semantic debt index.
 * PI.SQO.BLUEEDGE.SEMANTIC-DEBT-INDEX.01
 *
 * Loads debt inventory, baseline/enriched correspondence, and enriched
 * topology model. Feeds them into the SemanticDebtIndexCompiler to produce
 * a classified, lifecycle-aware debt index artifact.
 *
 * Usage: node scripts/reconciliation/compile_blueedge_debt_index.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const { compileDebtIndex, emitDebtIndex } = require('../../app/execlens-demo/lib/lens-v2/sqo/SemanticDebtIndexCompiler');

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

const ARTIFACT_DIR = `artifacts/sqo/${CLIENT}/${RUN_ID}`;

const debtInventory = loadJSON(`${ARTIFACT_DIR}/semantic_debt_inventory.v1.json`);
const baselineCorrespondence = loadJSON(`${ARTIFACT_DIR}/reconciliation_correspondence.v1.json`);
const enrichedCorrespondence = loadJSON(`${ARTIFACT_DIR}/reconciliation_correspondence.enriched.v1.json`);
const enrichedTopology = loadJSON(
  `clients/${CLIENT}/psee/runs/${RUN_ID}/semantic/topology/semantic_topology_model.enriched.json`
);

if (!debtInventory) {
  console.error('FATAL: debt inventory not found');
  process.exit(1);
}
if (!baselineCorrespondence) {
  console.error('FATAL: baseline correspondence not found');
  process.exit(1);
}

console.log(`Compiling semantic debt index for ${CLIENT}/${RUN_ID}...`);
console.log(`  Debt items: ${debtInventory.total_debt_items}`);
console.log(`  Baseline domains: ${(baselineCorrespondence.correspondences || []).length}`);
console.log(`  Enriched domains: ${enrichedCorrespondence ? (enrichedCorrespondence.correspondences || []).length : 'N/A'}`);
console.log(`  Topology domains: ${enrichedTopology ? (enrichedTopology.domains || []).length : 'N/A'}`);

const artifact = compileDebtIndex({
  debtInventory,
  baselineCorrespondence,
  enrichedCorrespondence,
  enrichedTopology,
  client: CLIENT,
  runId: RUN_ID,
});

const result = emitDebtIndex(artifact, CLIENT, RUN_ID);
console.log(`\nArtifact written: ${result.path}`);

const agg = artifact.aggregate_posture;
console.log(`\nAggregate posture:`);
console.log(`  Total domains: ${agg.total_domains}`);
console.log(`  Domains with debt: ${agg.domains_with_debt}`);
console.log(`  Domains clear: ${agg.domains_clear}`);
console.log(`  Debt items: ${agg.total_debt_items}`);
console.log(`  S-state blocking: ${agg.s_state_blocking_count}`);
console.log(`  Operational exposure: ${agg.operational_exposure}`);
console.log(`  Weighted debt score: ${agg.weighted_debt_score}`);
console.log(`  Qualification impact: ${agg.qualification_impact}`);

console.log(`\nReducibility distribution:`);
for (const [k, v] of Object.entries(agg.reducibility_distribution)) {
  console.log(`  ${k}: ${v}`);
}

console.log(`\nOrigin distribution:`);
for (const [k, v] of Object.entries(agg.origin_distribution)) {
  console.log(`  ${k}: ${v}`);
}

const lc = artifact.lifecycle;
console.log(`\nLifecycle:`);
console.log(`  Baseline unmapped: ${lc.baseline_unmapped_count}`);
console.log(`  Enriched unmapped: ${lc.enriched_unmapped_count}`);
console.log(`  Debt reduction: ${lc.debt_reduction_by_enrichment} (${(lc.debt_reduction_ratio * 100).toFixed(1)}%)`);
console.log(`  Enrichment impact: ${lc.enrichment_impact}`);

console.log(`\nDomain postures:`);
for (const dp of artifact.domain_postures) {
  const delta = dp.confidence_delta > 0 ? `+${dp.confidence_delta}` : `${dp.confidence_delta}`;
  console.log(`  ${dp.domain_id}: ${dp.debt_status.padEnd(20)} L${dp.baseline_confidence_level}→L${dp.enriched_confidence_level} (${delta}) ${dp.reducibility}`);
}

console.log(`\nDone.`);

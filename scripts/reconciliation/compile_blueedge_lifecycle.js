#!/usr/bin/env node

/**
 * Compile BlueEdge progressive reconciliation lifecycle.
 * PI.SQO.BLUEEDGE.PROGRESSIVE-RECONCILIATION-LIFECYCLE.01
 *
 * Loads baseline and enriched correspondence artifacts,
 * feeds them as ordered epochs into the lifecycle compiler,
 * writes the reconciliation_lifecycle.v1.json artifact.
 *
 * Usage: node scripts/reconciliation/compile_blueedge_lifecycle.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const { compileLifecycle } = require('../../app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationLifecycleCompiler');

const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';
const REPO_ROOT = process.env.REPO_ROOT;

const ARTIFACT_DIR = path.join(REPO_ROOT, 'artifacts', 'sqo', CLIENT, RUN_ID);

function loadArtifact(filename) {
  const filepath = path.join(ARTIFACT_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.error(`FATAL: artifact not found: ${filepath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function main() {
  console.log('=== Progressive Reconciliation Lifecycle Compiler ===');
  console.log(`Client: ${CLIENT}`);
  console.log(`Run: ${RUN_ID}`);
  console.log(`Stream: PI.SQO.BLUEEDGE.PROGRESSIVE-RECONCILIATION-LIFECYCLE.01`);
  console.log('');

  const baseline = loadArtifact('reconciliation_correspondence.v1.json');
  const enriched = loadArtifact('reconciliation_correspondence.enriched.v1.json');

  console.log('Epochs loaded:');
  console.log(`  Epoch 0 (BASELINE): reconciliation_correspondence.v1.json`);
  console.log(`    weighted_confidence: ${baseline.summary.weighted_confidence_score}%`);
  console.log(`    L1=${baseline.summary.confidence_distribution.level_1_unmapped}`);
  console.log(`  Epoch 1 (AI_ENRICHED): reconciliation_correspondence.enriched.v1.json`);
  console.log(`    weighted_confidence: ${enriched.summary.weighted_confidence_score}%`);
  console.log(`    L1=${enriched.summary.confidence_distribution.level_1_unmapped}`);
  console.log('');

  const result = compileLifecycle({
    client: CLIENT,
    runId: RUN_ID,
    epochs: [
      {
        epochLabel: 'BASELINE',
        enrichmentType: 'NONE',
        sourceStream: 'PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01',
        sourceArtifact: 'reconciliation_correspondence.v1.json',
        artifact: baseline,
      },
      {
        epochLabel: 'AI_ENRICHED',
        enrichmentType: 'AI_ASSISTED_SEMANTIC_ENRICHMENT',
        sourceStream: 'PI.SQO.BLUEEDGE.AI-ASSISTED-RECONCILIATION.ENRICHMENT.01',
        sourceArtifact: 'reconciliation_correspondence.enriched.v1.json',
        artifact: enriched,
      },
    ],
  });

  if (!result.ok) {
    console.error('LIFECYCLE COMPILATION FAILED:', result.error);
    process.exit(1);
  }

  // Print lifecycle summary
  console.log('=== LIFECYCLE COMPILED ===');
  console.log('');
  console.log(`Epochs: ${result.progression.total_epochs}`);
  console.log(`Trend: ${result.progression.overall_trend}`);
  console.log(`Weighted confidence trajectory: ${result.progression.weighted_confidence_trajectory.join(' → ')}`);
  console.log(`Reconciliation ratio trajectory: ${result.progression.reconciliation_ratio_trajectory.join(' → ')}`);
  console.log(`Unresolved trajectory: ${result.progression.unresolved_trajectory.join(' → ')}`);
  console.log(`Unmatched structural trajectory: ${result.progression.unmatched_structural_trajectory.join(' → ')}`);
  console.log('');

  // Print delta details
  if (result.deltas.length > 0) {
    const d = result.deltas[0];
    console.log(`=== DELTA: ${d.from_label} → ${d.to_label} ===`);
    console.log(`  Weighted confidence: ${d.summary_delta.weighted_confidence.from} → ${d.summary_delta.weighted_confidence.to} (${d.summary_delta.weighted_confidence.delta > 0 ? '+' : ''}${d.summary_delta.weighted_confidence.delta})`);
    console.log(`  Reconciliation ratio: ${d.summary_delta.reconciliation_ratio.from} → ${d.summary_delta.reconciliation_ratio.to}`);
    console.log(`  Level distribution delta: L5=${d.summary_delta.level_distribution_delta.L5} L4=${d.summary_delta.level_distribution_delta.L4} L3=${d.summary_delta.level_distribution_delta.L3} L2=${d.summary_delta.level_distribution_delta.L2} L1=${d.summary_delta.level_distribution_delta.L1}`);
    console.log(`  Domains improved: ${d.domains_improved.length}`);
    console.log(`  Domains degraded: ${d.domains_degraded.length}`);
    console.log(`  Domains unchanged: ${d.domains_unchanged.length}`);
    console.log('');

    if (d.domain_deltas.length > 0) {
      console.log('  Per-domain movement:');
      for (const dd of d.domain_deltas) {
        console.log(`    ${dd.domain_id} ${dd.domain_name}: L${dd.from_level} → L${dd.to_level} (${dd.delta > 0 ? '+' : ''}${dd.delta})`);
      }
      console.log('');
    }
  }

  // Print semantic debt
  const debt = result.progression.semantic_debt_summary;
  console.log('=== SEMANTIC DEBT ===');
  console.log(`  Unresolved domains: ${debt.total_unresolved}`);
  console.log(`  Resolution rate: ${debt.resolution_rate}%`);
  console.log(`  Unresolved IDs: ${debt.unresolved_domain_ids.join(', ')}`);
  console.log('');

  // Print runtime summary
  console.log('=== RUNTIME SUMMARY (SQO/LENS consumable) ===');
  const rs = result.runtime_summary;
  console.log(`  Client: ${rs.client}`);
  console.log(`  Current epoch: ${rs.current_epoch}`);
  console.log(`  Weighted confidence: ${rs.weighted_confidence}%`);
  console.log(`  Reconciliation ratio: ${(rs.reconciliation_ratio * 100).toFixed(1)}%`);
  console.log(`  Unresolved: ${rs.unresolved_count}/${rs.total_domains}`);
  console.log(`  Trend: ${rs.trend}`);
  if (rs.last_delta) {
    console.log(`  Last delta: confidence ${rs.last_delta.weighted_confidence_change > 0 ? '+' : ''}${rs.last_delta.weighted_confidence_change}, improved ${rs.last_delta.domains_improved}, degraded ${rs.last_delta.domains_degraded}`);
  }
  console.log('');

  // Write artifact
  const outputPath = path.join(ARTIFACT_DIR, 'reconciliation_lifecycle.v1.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`Artifact written: artifacts/sqo/${CLIENT}/${RUN_ID}/reconciliation_lifecycle.v1.json`);
  console.log('DONE');
}

main();

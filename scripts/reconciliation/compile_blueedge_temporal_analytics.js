#!/usr/bin/env node

/**
 * Compile BlueEdge reconciliation temporal analytics.
 * PI.SQO.BLUEEDGE.RECONCILIATION-TEMPORAL-ANALYTICS.01
 *
 * Loads reconciliation lifecycle and semantic debt index artifacts,
 * feeds them into the temporal analytics compiler to produce
 * trend, enrichment effectiveness, debt reduction, persistence,
 * degradation, and divergence analytics.
 *
 * Usage: node scripts/reconciliation/compile_blueedge_temporal_analytics.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const { compileTemporalAnalytics, emitTemporalAnalytics } = require('../../app/execlens-demo/lib/lens-v2/sqo/ReconciliationTemporalAnalyticsCompiler');

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

const lifecycle = loadJSON(`${ARTIFACT_DIR}/reconciliation_lifecycle.v1.json`);
const debtIndex = loadJSON(`${ARTIFACT_DIR}/semantic_debt_index.v1.json`);

if (!lifecycle) {
  console.error('FATAL: reconciliation lifecycle artifact not found');
  process.exit(1);
}

console.log(`Compiling temporal analytics for ${CLIENT}/${RUN_ID}...`);
console.log(`  Lifecycle epochs: ${(lifecycle.epochs || []).length}`);
console.log(`  Debt index: ${debtIndex ? 'present' : 'absent'}`);

const artifact = compileTemporalAnalytics({
  lifecycle,
  debtIndex,
  client: CLIENT,
  runId: RUN_ID,
});

const result = emitTemporalAnalytics(artifact, CLIENT, RUN_ID);
console.log(`\nArtifact written: ${result.path}`);

const t = artifact.trend;
console.log(`\nTrend: ${t.label} — ${t.reason}`);

const ee = artifact.enrichment_effectiveness;
if (ee.available) {
  console.log(`\nEnrichment effectiveness: ${ee.grade}`);
  console.log(`  Weighted lift: ${ee.weighted_lift} (${ee.weighted_lift_pct}%)`);
  console.log(`  Unresolved reduction: ${ee.unresolved_reduction}`);
  console.log(`  Domains improved: ${ee.domains_improved}`);
  console.log(`  Domains degraded: ${ee.domains_degraded}`);
  console.log(`  Effectiveness ratio: ${ee.effectiveness_ratio}%`);
  console.log(`  Level transitions:`, JSON.stringify(ee.level_transitions));
}

const dr = artifact.debt_reduction;
if (dr.available) {
  console.log(`\nDebt reduction:`);
  console.log(`  Baseline unmapped: ${dr.baseline_unmapped}`);
  console.log(`  Current unmapped: ${dr.current_unmapped}`);
  console.log(`  Reduction: ${dr.reduction_count} (${(dr.reduction_ratio * 100).toFixed(1)}%)`);
  console.log(`  Irreducible floor: ${dr.irreducible_floor}`);
  console.log(`  Remaining reducible: ${dr.remaining_reducible}`);
  console.log(`  Weighted debt score: ${dr.weighted_debt_score}`);
}

const up = artifact.unresolved_persistence;
if (up.available) {
  console.log(`\nUnresolved persistence:`);
  console.log(`  Baseline unmapped: ${up.baseline_unmapped_count}`);
  console.log(`  Current unmapped: ${up.current_unmapped_count}`);
  console.log(`  Persistent: ${up.persistent_count} (${(up.persistence_ratio * 100).toFixed(1)}%)`);
  console.log(`  Resolved: ${up.resolved_count}`);
  console.log(`  Persistent domains:`, up.persistent_domains.map(d => d.domain_id));
}

const deg = artifact.degradation;
console.log(`\nDegradation: ${deg.detected ? `DETECTED (${deg.signal_count} signals)` : 'NONE'}`);
if (deg.detected) {
  for (const s of deg.signals) {
    console.log(`  ${s.type}: ${s.domain_id || ''} ${s.epoch_transition}`);
  }
}

const div = artifact.structural_semantic_divergence;
if (div.available) {
  console.log(`\nStructural-semantic divergence:`);
  console.log(`  Divergence score: ${div.divergence_score}%`);
  console.log(`  Structurally grounded: ${div.structurally_grounded}/${div.total_domains}`);
  console.log(`  Semantic only: ${div.semantic_only}`);
  console.log(`  Indicators: ${div.indicator_count}`);
  for (const ind of div.indicators) {
    console.log(`    ${ind.type}: ${ind.domain_id} — ${ind.description}`);
  }
}

const rs = artifact.runtime_summary;
console.log(`\nRuntime summary:`);
console.log(`  Trend: ${rs.trend}`);
console.log(`  Enrichment grade: ${rs.enrichment_grade}`);
console.log(`  Weighted lift: ${rs.weighted_lift}`);
console.log(`  Debt reduction ratio: ${rs.debt_reduction_ratio}`);
console.log(`  Irreducible floor: ${rs.irreducible_floor}`);
console.log(`  Persistent unmapped: ${rs.persistent_unmapped}`);
console.log(`  Degradation: ${rs.degradation_detected}`);
console.log(`  Divergence: ${rs.divergence_score}%`);

console.log(`\nDone.`);

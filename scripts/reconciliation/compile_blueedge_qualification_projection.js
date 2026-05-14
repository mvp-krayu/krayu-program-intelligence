'use strict';

const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const {
  compileRuntimeQualificationProjection,
  emitQualificationProjection,
} = require('../../app/execlens-demo/lib/lens-v2/sqo/RuntimeQualificationProjectionCompiler');

const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';

console.log(`\n=== Runtime Qualification Projection: ${CLIENT} / ${RUN_ID} ===\n`);

const projection = compileRuntimeQualificationProjection(CLIENT, RUN_ID);

if (!projection.ok) {
  console.error('COMPILATION FAILED:', projection.error);
  process.exit(1);
}

const emitResult = emitQualificationProjection(projection, CLIENT, RUN_ID);
console.log(`Artifact emitted: ${emitResult.path} (${emitResult.size} bytes)\n`);

console.log('--- Qualification Posture ---');
const qp = projection.qualification_posture;
if (qp) {
  console.log(`  S-State: ${qp.s_state} (${qp.state_label})`);
  console.log(`  Q-Class: ${qp.q_class}`);
  console.log(`  Authorization: ${qp.authorization_tier}`);
  console.log(`  Grounding Ratio: ${qp.grounding_ratio}`);
  if (qp.maturity) console.log(`  Maturity: ${qp.maturity.score} (${qp.maturity.classification})`);
  if (qp.gravity) console.log(`  Gravity: ${qp.gravity.score} (${qp.gravity.classification})`);
  if (qp.stability) console.log(`  Stability: ${qp.stability.score} (${qp.stability.classification})`);
  if (qp.progression) console.log(`  Progression: ${qp.progression.readiness} → ${qp.progression.target} (${qp.progression.blocking_debt_count} blocking)`);
}

console.log('\n--- Reconciliation Posture ---');
const rp = projection.reconciliation_posture;
if (rp && rp.summary) {
  console.log(`  Domains: ${rp.summary.total_semantic_domains} total, ${rp.summary.reconciled_count} reconciled, ${rp.summary.unreconciled_count} unreconciled`);
  console.log(`  Reconciliation Ratio: ${rp.summary.reconciliation_ratio}`);
  console.log(`  Weighted Confidence: ${rp.summary.weighted_confidence}`);
  if (rp.lifecycle && rp.lifecycle.trend) console.log(`  Lifecycle Trend: ${rp.lifecycle.trend.label}`);
}

console.log('\n--- Semantic Debt Posture ---');
const dp = projection.semantic_debt_posture;
if (dp) {
  if (dp.summary) console.log(`  Total Items: ${dp.summary.total_items}, Blocking: ${dp.summary.blocking_count}`);
  if (dp.index && dp.index.aggregatePosture) {
    console.log(`  Weighted Debt: ${dp.index.aggregatePosture.weighted_debt_score}`);
    console.log(`  Exposure: ${dp.index.aggregatePosture.operational_exposure}`);
    console.log(`  Impact: ${dp.index.aggregatePosture.qualification_impact}`);
  }
}

console.log('\n--- Temporal Analytics Posture ---');
const tp = projection.temporal_analytics_posture;
if (tp) {
  if (tp.trend) console.log(`  Trend: ${tp.trend.label}`);
  if (tp.enrichmentEffectiveness) console.log(`  Enrichment: ${tp.enrichmentEffectiveness.grade} (${tp.enrichmentEffectiveness.weighted_lift_pct}% lift)`);
  if (tp.debtReduction) console.log(`  Debt Reduction: ${(tp.debtReduction.reduction_ratio * 100).toFixed(1)}%`);
  if (tp.degradation) console.log(`  Degradation: ${tp.degradation.detected ? 'DETECTED' : 'none'}`);
}

console.log('\n--- Evidence Intake Posture ---');
const ei = projection.evidence_intake_posture;
if (ei) {
  console.log(`  Total: ${ei.accepted_count} accepted, ${ei.rejected_count} rejected, ${ei.quarantined_count} quarantined`);
  console.log(`  All Valid: ${ei.all_valid}`);
}

console.log('\n--- Propagation Readiness ---');
const pr = projection.propagation_readiness;
if (pr) {
  console.log(`  Ready: ${pr.ready}`);
  console.log(`  Gates: ${pr.gates_met}/${pr.gate_count} met`);
  if (pr.blocking_summary.length > 0) {
    console.log(`  Blocking: ${pr.blocking_summary.join(', ')}`);
  }
  for (const gate of pr.gates) {
    console.log(`    [${gate.met ? 'PASS' : 'FAIL'}] ${gate.gate}${gate.detail ? ' — ' + gate.detail : ''}`);
  }
}

console.log('\n--- Semantic Envelope ---');
const se = projection.semantic_envelope;
if (se) {
  console.log(`  Coverage: ${se.available_count}/${se.total_facets} (${(se.coverage_ratio * 100).toFixed(1)}%)`);
  console.log(`  Complete: ${se.complete}`);
  if (se.missing.length > 0) console.log(`  Missing: ${se.missing.join(', ')}`);
}

console.log('\n--- Boundary Disclosure ---');
const bd = projection.boundary_disclosure;
if (bd) {
  console.log(`  Source Artifacts: ${bd.source_artifact_count}`);
  console.log(`  Deterministic: ${bd.governance.deterministic}`);
  console.log(`  Replay Safe: ${bd.governance.replay_safe}`);
  console.log(`  No Inference: ${bd.governance.no_inference}`);
}

console.log('\n=== Compilation Complete ===\n');

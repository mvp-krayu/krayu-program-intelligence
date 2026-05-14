'use strict';

const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const {
  compileSemanticOperationsSubstrate,
  emitSubstrate,
} = require('../../app/execlens-demo/lib/lens-v2/sqo/RuntimeSemanticOperationsSubstrate');

const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';

console.log(`\n=== Runtime Semantic Operations Substrate: ${CLIENT} / ${RUN_ID} ===\n`);

const substrate = compileSemanticOperationsSubstrate(CLIENT, RUN_ID);

if (!substrate.ok) {
  console.error('COMPILATION FAILED:', substrate.error);
  process.exit(1);
}

const emitResult = emitSubstrate(substrate, CLIENT, RUN_ID);
console.log(`Artifact emitted: ${emitResult.path} (${emitResult.size} bytes)\n`);

console.log('--- Operational Model ---');
const om = substrate.operational_model;
console.log(`  Ownership domains: ${om.ownership_domain_count}`);
console.log(`  Propagation contracts: ${om.propagation_contract_count}`);
console.log(`  Orchestration phases: ${om.orchestration_phase_count}`);
console.log(`  Registered artifacts: ${om.registered_artifact_count}`);
console.log(`  Stabilization rules: ${om.stabilization_rule_count}`);

console.log('\n--- Operational Health ---');
const oh = substrate.operational_health;
console.log(`  Overall healthy: ${oh.overall_healthy}`);
console.log(`  Coverage: ${oh.total_present}/${oh.total_artifacts} (${(oh.coverage * 100).toFixed(1)}%)`);
for (const [id, d] of Object.entries(oh.domains)) {
  const status = d.healthy ? 'HEALTHY' : `MISSING: ${d.missing_artifacts.join(', ')}`;
  console.log(`    ${id}: ${d.present_count}/${d.artifact_count} — ${status}`);
}

console.log('\n--- Propagation Integrity ---');
const pi = substrate.propagation_integrity;
console.log(`  All intact: ${pi.all_intact}`);
console.log(`  Contracts: ${pi.intact_count}/${pi.total_contracts} intact`);
for (const c of pi.contracts) {
  const from = Array.isArray(c.from) ? c.from.join('+') : c.from;
  console.log(`    [${c.intact ? 'OK' : 'BROKEN'}] ${c.id}: ${from} → ${c.to} (${c.direction})`);
}

console.log('\n--- Qualification Projection Summary ---');
const qp = substrate.qualification_projection;
if (qp) {
  const q = qp.qualification_posture;
  if (q) console.log(`  S-State: ${q.s_state}, Q-Class: ${q.q_class}`);
  const pr = qp.propagation_readiness;
  if (pr) console.log(`  Propagation: ${pr.ready ? 'READY' : 'NOT READY'} (${pr.gates_met}/${pr.gate_count} gates)`);
  const se = qp.semantic_envelope;
  if (se) console.log(`  Envelope: ${se.available_count}/${se.total_facets} (${se.complete ? 'COMPLETE' : 'INCOMPLETE'})`);
}

console.log('\n--- Ownership Boundaries ---');
for (const b of substrate.ownership_boundaries) {
  console.log(`  ${b.id}: ${b.description} [${b.artifact_count} artifacts, auth: ${b.mutation_authority}]`);
}

console.log('\n--- Orchestration Phases ---');
for (const p of substrate.orchestration.phases) {
  console.log(`  Phase ${p.phase}: ${p.domain} — ${p.description}`);
}

console.log('\n--- Stabilization Rules ---');
for (let i = 0; i < substrate.stabilization_rules.length; i++) {
  console.log(`  ${i + 1}. ${substrate.stabilization_rules[i]}`);
}

console.log('\n=== Compilation Complete ===\n');

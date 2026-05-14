#!/usr/bin/env node

/**
 * Compile BlueEdge reconciliation loop state.
 * PI.SQO.RUNTIME-SEMANTIC-RECONCILIATION-LOOP.OPERATIONALIZATION.01
 *
 * Loads all SQO artifacts, assesses phase completion, determines current
 * lifecycle state, resolves the rerun chain, and emits the loop state artifact.
 *
 * Usage: node scripts/reconciliation/compile_blueedge_reconciliation_loop.js
 */

'use strict';

const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const {
  compileReconciliationLoopState,
  emitLoopState,
} = require('../../app/execlens-demo/lib/lens-v2/sqo/ReconciliationLoopOrchestrator');

const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';

console.log(`Compiling reconciliation loop state for ${CLIENT}/${RUN_ID}...`);

const compiled = compileReconciliationLoopState(CLIENT, RUN_ID);

if (!compiled.ok) {
  console.error(`FATAL: compilation failed — ${compiled.error}`);
  process.exit(1);
}

const result = emitLoopState(compiled, CLIENT, RUN_ID);
console.log(`Artifact written: ${result.path}`);

const lc = compiled.lifecycle;
console.log(`\nLifecycle state: ${lc.current_state}`);
console.log(`  Description: ${lc.state_description}`);
console.log(`  Terminal: ${lc.is_terminal}`);

const pa = compiled.phase_assessment;
console.log(`\nPhase assessment: ${pa.completed_phases}/${pa.total_phases} complete (${(pa.completion_ratio * 100).toFixed(1)}%)`);
for (const phase of pa.phases) {
  const status = phase.complete ? 'COMPLETE' : 'INCOMPLETE';
  console.log(`  Phase ${phase.phase} (${phase.id}): ${status}`);
  if (!phase.complete && phase.missing_inputs.length > 0) {
    console.log(`    Missing inputs: ${phase.missing_inputs.join(', ')}`);
  }
  if (!phase.complete && phase.missing_outputs.length > 0) {
    console.log(`    Missing outputs: ${phase.missing_outputs.join(', ')}`);
  }
}

if (compiled.rerun_chain) {
  const rc = compiled.rerun_chain;
  console.log(`\nRerun chain: ${rc.id}`);
  console.log(`  ${rc.description}`);
  console.log(`  Scripts (${rc.script_count}):`);
  for (const s of rc.scripts) {
    console.log(`    ${s}`);
  }
} else {
  console.log(`\nRerun chain: NONE (system fully propagated)`);
}

if (compiled.progression_readiness) {
  const pr = compiled.progression_readiness;
  console.log(`\nProgression readiness: ${pr.ready ? 'READY' : 'BLOCKED'}`);
  console.log(`  Gates: ${pr.gates_met}/${pr.gate_count}`);
  console.log(`  ${pr.s_state_current} → ${pr.s_state_target}`);
  if (pr.blocking_gates.length > 0) {
    console.log(`  Blocking: ${pr.blocking_gates.join(', ')}`);
  }
}

console.log(`\nPropagation chain: ${compiled.propagation_chain.step_count} steps`);

console.log(`\nDone.`);

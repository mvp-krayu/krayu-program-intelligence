#!/usr/bin/env node

/**
 * Compile BlueEdge reconciliation correspondence artifact.
 * PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01
 *
 * Reads PATH A + PATH B artifacts, runs the correspondence compiler,
 * writes the replayable artifact to the SQO artifact directory.
 *
 * Usage: node scripts/reconciliation/compile_blueedge_correspondence.js
 */

'use strict';

const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const { loadJSON } = require('../../app/execlens-demo/lib/lens-v2/SemanticArtifactLoader');
const { compileCorrespondence } = require('../../app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler');
const { writeReconciliationArtifact } = require('../../app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationArtifactWriter');

const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';

const PATHS = {
  semanticTopology: `clients/${CLIENT}/psee/runs/${RUN_ID}/semantic/topology/semantic_topology_model.json`,
  canonicalTopology: `clients/${CLIENT}/psee/runs/${RUN_ID}/vault/canonical_topology.json`,
  crosswalk: `clients/${CLIENT}/psee/runs/${RUN_ID}/semantic/crosswalk/semantic_continuity_crosswalk.json`,
  signalRegistry: `clients/${CLIENT}/psee/runs/${RUN_ID}/vault/signal_registry.json`,
  evidenceTrace: `clients/${CLIENT}/psee/runs/${RUN_ID}/vault/evidence_trace.json`,
};

function main() {
  console.log('=== Reconciliation Correspondence Compiler ===');
  console.log(`Client: ${CLIENT}`);
  console.log(`Run: ${RUN_ID}`);
  console.log('');

  const semanticTopology = loadJSON(PATHS.semanticTopology);
  if (!semanticTopology.ok) {
    console.error('FATAL: semantic_topology_model.json not loadable:', semanticTopology);
    process.exit(1);
  }

  const canonicalTopology = loadJSON(PATHS.canonicalTopology);
  if (!canonicalTopology.ok) {
    console.error('FATAL: canonical_topology.json not loadable:', canonicalTopology);
    process.exit(1);
  }

  const crosswalk = loadJSON(PATHS.crosswalk);
  if (!crosswalk.ok) {
    console.error('FATAL: semantic_continuity_crosswalk.json not loadable:', crosswalk);
    process.exit(1);
  }

  const signalRegistry = loadJSON(PATHS.signalRegistry);
  const evidenceTrace = loadJSON(PATHS.evidenceTrace);

  console.log('Artifacts loaded:');
  console.log(`  semantic_topology: ${semanticTopology.ok ? 'OK' : 'MISSING'} (${(semanticTopology.data.domains || []).length} domains)`);
  console.log(`  canonical_topology: ${canonicalTopology.ok ? 'OK' : 'MISSING'} (${(canonicalTopology.data.domains || []).length} DOM groups)`);
  console.log(`  crosswalk: ${crosswalk.ok ? 'OK' : 'MISSING'} (${(crosswalk.data.entities || []).length} entities)`);
  console.log(`  signal_registry: ${signalRegistry.ok ? 'OK' : 'MISSING'}`);
  console.log(`  evidence_trace: ${evidenceTrace.ok ? 'OK' : 'MISSING'}`);
  console.log('');

  const result = compileCorrespondence({
    semanticTopologyModel: semanticTopology.data,
    canonicalTopology: canonicalTopology.data,
    semanticCrosswalk: crosswalk.data,
    signalRegistry: signalRegistry.ok ? signalRegistry.data : null,
    evidenceTrace: evidenceTrace.ok ? evidenceTrace.data : null,
  });

  if (!result.ok) {
    console.error('COMPILATION FAILED:', result.error);
    process.exit(1);
  }

  console.log('Correspondence compiled:');
  console.log(`  Total semantic domains: ${result.summary.total_semantic_domains}`);
  console.log(`  Reconciled: ${result.summary.reconciled_count}`);
  console.log(`  Unreconciled: ${result.summary.unreconciled_count}`);
  console.log(`  Reconciliation ratio: ${(result.summary.reconciliation_ratio * 100).toFixed(1)}%`);
  console.log(`  Weighted confidence: ${result.summary.weighted_confidence_score}%`);
  console.log('');
  console.log('  Confidence distribution:');
  console.log(`    L5 Structurally Grounded: ${result.summary.confidence_distribution.level_5_structurally_grounded}`);
  console.log(`    L4 Observationally Corroborated: ${result.summary.confidence_distribution.level_4_observationally_corroborated}`);
  console.log(`    L3 Semantically Coherent: ${result.summary.confidence_distribution.level_3_semantically_coherent}`);
  console.log(`    L2 Upstream Evidence Bound: ${result.summary.confidence_distribution.level_2_upstream_evidence_bound}`);
  console.log(`    L1 Unmapped: ${result.summary.confidence_distribution.level_1_unmapped}`);
  console.log('');

  console.log('Per-domain correspondence:');
  for (const c of result.correspondences) {
    const marker = c.reconciliation_status === 'RECONCILED' ? '✓' : '·';
    console.log(`  ${marker} ${c.semantic_domain_id} ${c.semantic_domain_name}`);
    console.log(`    → L${c.confidence_level} ${c.confidence_label} | ${c.correspondence_basis}`);
    if (c.structural_dom_id) {
      console.log(`    → ${c.structural_dom_id} (${c.structural_domain_name})`);
    }
  }
  console.log('');

  if (result.unmatched_structural.length > 0) {
    console.log(`Unmatched structural DOMs (${result.unmatched_structural.length}):`);
    for (const u of result.unmatched_structural) {
      console.log(`  · ${u.structural_dom_id} ${u.structural_domain_name} (${u.component_count} components)`);
    }
    console.log('');
  }

  const writeResult = writeReconciliationArtifact(CLIENT, RUN_ID, result);
  if (!writeResult.ok) {
    console.error('WRITE FAILED:', writeResult);
    process.exit(1);
  }

  console.log(`Artifact written: ${writeResult.path}`);
  console.log('DONE');
}

main();

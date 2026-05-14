#!/usr/bin/env node

/**
 * Compile BlueEdge reconciliation correspondence using AI-enriched semantic material.
 * PI.SQO.BLUEEDGE.AI-ASSISTED-RECONCILIATION.ENRICHMENT.01
 *
 * Reads enriched PATH B artifacts + frozen PATH A artifacts,
 * runs the same deterministic correspondence compiler,
 * writes the enriched artifact alongside the original.
 *
 * Usage: node scripts/reconciliation/compile_blueedge_enriched_correspondence.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..');

const { loadJSON } = require('../../app/execlens-demo/lib/lens-v2/SemanticArtifactLoader');
const { compileCorrespondence } = require('../../app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler');

const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';
const REPO_ROOT = process.env.REPO_ROOT;

const PATHS = {
  enrichedTopology: `clients/${CLIENT}/psee/runs/${RUN_ID}/semantic/topology/semantic_topology_model.enriched.json`,
  originalTopology: `clients/${CLIENT}/psee/runs/${RUN_ID}/semantic/topology/semantic_topology_model.json`,
  canonicalTopology: `clients/${CLIENT}/psee/runs/${RUN_ID}/vault/canonical_topology.json`,
  crosswalk: `clients/${CLIENT}/psee/runs/${RUN_ID}/semantic/crosswalk/semantic_continuity_crosswalk.json`,
  signalRegistry: `clients/${CLIENT}/psee/runs/${RUN_ID}/vault/signal_registry.json`,
  evidenceTrace: `clients/${CLIENT}/psee/runs/${RUN_ID}/vault/evidence_trace.json`,
};

function main() {
  console.log('=== Enriched Reconciliation Correspondence Compiler ===');
  console.log(`Client: ${CLIENT}`);
  console.log(`Run: ${RUN_ID}`);
  console.log(`Stream: PI.SQO.BLUEEDGE.AI-ASSISTED-RECONCILIATION.ENRICHMENT.01`);
  console.log('');

  // Load enriched semantic topology
  const enrichedTopology = loadJSON(PATHS.enrichedTopology);
  if (!enrichedTopology.ok) {
    console.error('FATAL: enriched semantic_topology_model not loadable:', enrichedTopology);
    process.exit(1);
  }

  // Load original for comparison
  const originalTopology = loadJSON(PATHS.originalTopology);
  if (!originalTopology.ok) {
    console.error('FATAL: original semantic_topology_model not loadable');
    process.exit(1);
  }

  // Load frozen PATH A artifacts
  const canonicalTopology = loadJSON(PATHS.canonicalTopology);
  if (!canonicalTopology.ok) {
    console.error('FATAL: canonical_topology.json not loadable');
    process.exit(1);
  }

  const crosswalk = loadJSON(PATHS.crosswalk);
  if (!crosswalk.ok) {
    console.error('FATAL: crosswalk not loadable');
    process.exit(1);
  }

  const signalRegistry = loadJSON(PATHS.signalRegistry);
  const evidenceTrace = loadJSON(PATHS.evidenceTrace);

  console.log('Artifacts loaded:');
  console.log(`  enriched_topology: OK (${enrichedTopology.data.domains.length} domains)`);
  console.log(`  original_topology: OK (${originalTopology.data.domains.length} domains)`);
  console.log(`  canonical_topology: OK (${canonicalTopology.data.domains.length} DOM groups)`);
  console.log(`  crosswalk: OK (${crosswalk.data.entities.length} entities)`);
  console.log(`  signal_registry: ${signalRegistry.ok ? 'OK' : 'MISSING'}`);
  console.log(`  evidence_trace: ${evidenceTrace.ok ? 'OK' : 'MISSING'}`);
  console.log('');

  // Compile with ORIGINAL topology (baseline)
  const baselineResult = compileCorrespondence({
    semanticTopologyModel: originalTopology.data,
    canonicalTopology: canonicalTopology.data,
    semanticCrosswalk: crosswalk.data,
    signalRegistry: signalRegistry.ok ? signalRegistry.data : null,
    evidenceTrace: evidenceTrace.ok ? evidenceTrace.data : null,
  });

  // Compile with ENRICHED topology
  const enrichedResult = compileCorrespondence({
    semanticTopologyModel: enrichedTopology.data,
    canonicalTopology: canonicalTopology.data,
    semanticCrosswalk: crosswalk.data,
    signalRegistry: signalRegistry.ok ? signalRegistry.data : null,
    evidenceTrace: evidenceTrace.ok ? evidenceTrace.data : null,
  });

  if (!enrichedResult.ok) {
    console.error('ENRICHED COMPILATION FAILED:', enrichedResult.error);
    process.exit(1);
  }

  // Tag the enriched result
  enrichedResult.enrichment_metadata = {
    enrichment_source: 'PI.SQO.BLUEEDGE.AI-ASSISTED-RECONCILIATION.ENRICHMENT.01',
    enrichment_date: new Date().toISOString(),
    enrichment_type: 'AI_ASSISTED_SEMANTIC_ENRICHMENT',
    ai_confidence_cap: 'L3',
    path_a_frozen: true,
    compiler_unchanged: true,
  };

  // Write enriched artifact
  const enrichedArtifact = {
    ...enrichedResult,
    client: CLIENT,
    run_id: RUN_ID,
    artifact_path: `artifacts/sqo/${CLIENT}/${RUN_ID}/reconciliation_correspondence.enriched.v1.json`,
  };

  const outputPath = path.join(
    REPO_ROOT,
    'artifacts', 'sqo', CLIENT, RUN_ID,
    'reconciliation_correspondence.enriched.v1.json'
  );

  fs.writeFileSync(outputPath, JSON.stringify(enrichedArtifact, null, 2), 'utf8');

  // Print comparison
  console.log('=== BEFORE / AFTER COMPARISON ===');
  console.log('');
  console.log('BASELINE (original semantic material):');
  printSummary(baselineResult);
  console.log('');
  console.log('ENRICHED (AI-assisted semantic material):');
  printSummary(enrichedResult);
  console.log('');

  // Print per-domain delta
  console.log('=== PER-DOMAIN CONFIDENCE DELTA ===');
  console.log('');
  for (let i = 0; i < enrichedResult.correspondences.length; i++) {
    const baseline = baselineResult.correspondences[i];
    const enriched = enrichedResult.correspondences[i];
    const delta = enriched.confidence_level - baseline.confidence_level;
    if (delta !== 0) {
      console.log(`  ${enriched.semantic_domain_id} ${enriched.semantic_domain_name}`);
      console.log(`    L${baseline.confidence_level} → L${enriched.confidence_level} (${delta > 0 ? '+' : ''}${delta}) | ${enriched.correspondence_basis}`);
      if (enriched.structural_dom_id) {
        console.log(`    → ${enriched.structural_dom_id} (${enriched.structural_domain_name || 'unknown'})`);
      }
    }
  }
  console.log('');

  // Print unresolved domains
  const unresolved = enrichedResult.correspondences.filter(c => c.confidence_level === 1);
  console.log(`=== UNRESOLVED DOMAINS (${unresolved.length}) ===`);
  for (const u of unresolved) {
    const domain = enrichedTopology.data.domains.find(d => d.domain_id === u.semantic_domain_id);
    console.log(`  ${u.semantic_domain_id} ${u.semantic_domain_name}`);
    console.log(`    Reason: ${domain && domain.enrichment_reason ? domain.enrichment_reason : 'No structural evidence'}`);
  }
  console.log('');

  console.log(`Artifact written: ${enrichedArtifact.artifact_path}`);
  console.log('DONE');
}

function printSummary(result) {
  const s = result.summary;
  console.log(`  Total domains: ${s.total_semantic_domains}`);
  console.log(`  Reconciled (L4+): ${s.reconciled_count}`);
  console.log(`  Unreconciled: ${s.unreconciled_count}`);
  console.log(`  Reconciliation ratio: ${(s.reconciliation_ratio * 100).toFixed(1)}%`);
  console.log(`  Weighted confidence: ${s.weighted_confidence_score}%`);
  console.log(`  Distribution: L5=${s.confidence_distribution.level_5_structurally_grounded} L4=${s.confidence_distribution.level_4_observationally_corroborated} L3=${s.confidence_distribution.level_3_semantically_coherent} L2=${s.confidence_distribution.level_2_upstream_evidence_bound} L1=${s.confidence_distribution.level_1_unmapped}`);
}

main();

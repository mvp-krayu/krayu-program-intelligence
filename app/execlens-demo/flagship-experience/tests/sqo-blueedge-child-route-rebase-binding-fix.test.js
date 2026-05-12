'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const APP_ROOT = path.resolve(__dirname, '..', '..');

// Suite 1: semantic-candidates route resolves corrected registry
describe('Child Route Rebase Binding: semantic-candidates route resolves corrected registry', () => {
  const { loadRebasedCandidateData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));
  const { buildSemanticCandidateViewModel } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'BlueEdgeSemanticCandidateViewModel'));

  it('loadRebasedCandidateData returns ok', () => {
    const result = loadRebasedCandidateData();
    assert.ok(result.ok);
  });

  it('loadRebasedCandidateData returns candidates', () => {
    const result = loadRebasedCandidateData();
    assert.ok(Array.isArray(result.candidates));
    assert.ok(result.candidates.length > 0);
  });

  it('view model builds from rebased candidate data', () => {
    const data = loadRebasedCandidateData();
    const vm = buildSemanticCandidateViewModel(data);
    assert.ok(vm.available);
    assert.ok(vm.candidates.length > 0);
  });

  it('route page file exists', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'semantic-candidates.js');
    assert.ok(fs.existsSync(routePath));
  });

  it('route page imports from ExplicitEvidenceRebaseExtractor', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'semantic-candidates.js');
    const content = fs.readFileSync(routePath, 'utf8');
    assert.ok(content.includes('ExplicitEvidenceRebaseExtractor.server'));
    assert.ok(content.includes('loadRebasedCandidateData'));
  });
});

// Suite 2: ceu-admissibility route resolves corrected registry
describe('Child Route Rebase Binding: ceu-admissibility route resolves corrected registry', () => {
  const { loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));
  const { buildDynamicCEUAdmissibilityViewModel } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'DynamicCEUAdmissibilityViewModel'));

  it('loadRebasedAdmissibilityData returns ok', () => {
    const result = loadRebasedAdmissibilityData();
    assert.ok(result.ok);
  });

  it('loadRebasedAdmissibilityData returns evaluations', () => {
    const result = loadRebasedAdmissibilityData();
    assert.ok(Array.isArray(result.evaluations));
    assert.ok(result.evaluations.length > 0);
  });

  it('view model builds from rebased admissibility data', () => {
    const data = loadRebasedAdmissibilityData();
    const vm = buildDynamicCEUAdmissibilityViewModel(data);
    assert.ok(vm.available);
    assert.ok(vm.evaluations.length > 0);
  });

  it('route page file exists', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'ceu-admissibility.js');
    assert.ok(fs.existsSync(routePath));
  });

  it('route page imports from ExplicitEvidenceRebaseExtractor', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'ceu-admissibility.js');
    const content = fs.readFileSync(routePath, 'utf8');
    assert.ok(content.includes('ExplicitEvidenceRebaseExtractor.server'));
    assert.ok(content.includes('loadRebasedAdmissibilityData'));
  });
});

// Suite 3: Only evidence_sources.yaml lineage is accepted
describe('Child Route Rebase Binding: only evidence_sources.yaml lineage accepted', () => {
  const { loadRebasedCandidateData, loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('candidate data source_class is EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE', () => {
    const result = loadRebasedCandidateData();
    assert.equal(result.source_class, 'EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE');
  });

  it('admissibility data source_class is EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE', () => {
    const result = loadRebasedAdmissibilityData();
    assert.equal(result.source_class, 'EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE');
  });

  it('evidence files come from evidence_sources.yaml', () => {
    const result = loadRebasedCandidateData();
    assert.ok(Array.isArray(result.evidence_files));
    assert.ok(result.evidence_files.length > 0);
    for (const f of result.evidence_files) {
      assert.ok(typeof f === 'string' && f.length > 0);
    }
  });
});

// Suite 4: Tier-1 report lineage is rejected as operational source
describe('Child Route Rebase Binding: Tier-1 report lineage rejected', () => {
  const { isFileAllowed, parseEvidenceSources } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('lens_tier1 file is rejected', () => {
    const sources = parseEvidenceSources();
    assert.ok(sources.ok);
    assert.ok(!isFileAllowed('lens_tier1_evidence.html', sources.sources));
  });

  it('tier1_diagnostic file is rejected', () => {
    const sources = parseEvidenceSources();
    assert.ok(sources.ok);
    assert.ok(!isFileAllowed('tier1_diagnostic_output.html', sources.sources));
  });
});

// Suite 5: Tier-2 report lineage is rejected as operational source
describe('Child Route Rebase Binding: Tier-2 report lineage rejected', () => {
  const { isFileAllowed, parseEvidenceSources } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('lens_tier2 file is rejected', () => {
    const sources = parseEvidenceSources();
    assert.ok(sources.ok);
    assert.ok(!isFileAllowed('lens_tier2_evidence.html', sources.sources));
  });

  it('tier2_diagnostic file is rejected', () => {
    const sources = parseEvidenceSources();
    assert.ok(sources.ok);
    assert.ok(!isFileAllowed('tier2_diagnostic_summary.html', sources.sources));
  });
});

// Suite 6: LENS output lineage is rejected
describe('Child Route Rebase Binding: LENS output lineage rejected', () => {
  const { isFileAllowed, parseEvidenceSources } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('lens_output file is rejected', () => {
    const sources = parseEvidenceSources();
    assert.ok(sources.ok);
    assert.ok(!isFileAllowed('lens_output_summary.html', sources.sources));
  });
});

// Suite 7: Gauge artifact lineage is rejected
describe('Child Route Rebase Binding: gauge artifact lineage rejected', () => {
  const { isFileAllowed, parseEvidenceSources } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('gauge_artifact file is rejected', () => {
    const sources = parseEvidenceSources();
    assert.ok(sources.ok);
    assert.ok(!isFileAllowed('gauge_artifact_output.html', sources.sources));
  });

  it('gauge_claim file is rejected', () => {
    const sources = parseEvidenceSources();
    assert.ok(sources.ok);
    assert.ok(!isFileAllowed('gauge_claim_summary.html', sources.sources));
  });
});

// Suite 8: Source status UPSTREAM_EVIDENCE_BOUND is present
describe('Child Route Rebase Binding: UPSTREAM_EVIDENCE_BOUND status present', () => {
  const { loadRebasedCandidateData, loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('candidate data has UPSTREAM_EVIDENCE_BOUND source_status', () => {
    const result = loadRebasedCandidateData();
    assert.equal(result.source_status, 'UPSTREAM_EVIDENCE_BOUND');
  });

  it('admissibility data has UPSTREAM_EVIDENCE_BOUND source_status', () => {
    const result = loadRebasedAdmissibilityData();
    assert.equal(result.source_status, 'UPSTREAM_EVIDENCE_BOUND');
  });
});

// Suite 9: Previous chain marked PRE_REBASE_NON_AUTHORITATIVE
describe('Child Route Rebase Binding: PRE_REBASE_NON_AUTHORITATIVE marking', () => {
  const { loadRebasedCandidateData, loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('candidate data has PRE_REBASE_NON_AUTHORITATIVE previous_chain_status', () => {
    const result = loadRebasedCandidateData();
    assert.equal(result.previous_chain_status, 'PRE_REBASE_NON_AUTHORITATIVE');
  });

  it('admissibility data has PRE_REBASE_NON_AUTHORITATIVE previous_chain_status', () => {
    const result = loadRebasedAdmissibilityData();
    assert.equal(result.previous_chain_status, 'PRE_REBASE_NON_AUTHORITATIVE');
  });
});

// Suite 10: Candidate panel source status display
describe('Child Route Rebase Binding: candidate panel source status display', () => {
  it('SemanticCandidateExtractionPanel has source status section', () => {
    const panelPath = path.join(APP_ROOT, 'components', 'sqo-cockpit', 'SemanticCandidateExtractionPanel.jsx');
    const content = fs.readFileSync(panelPath, 'utf8');
    assert.ok(content.includes('candidate-panel__source-status'));
    assert.ok(content.includes('Source Status'));
    assert.ok(content.includes('Source Class'));
    assert.ok(content.includes('Evidence Set'));
  });

  it('SemanticCandidateExtractionPanel has tier warning', () => {
    const panelPath = path.join(APP_ROOT, 'components', 'sqo-cockpit', 'SemanticCandidateExtractionPanel.jsx');
    const content = fs.readFileSync(panelPath, 'utf8');
    assert.ok(content.includes('Tier-1/Tier-2/LENS/gauge outputs are not admissible'));
  });
});

// Suite 11: Admissibility panel source status display
describe('Child Route Rebase Binding: admissibility panel source status display', () => {
  it('DynamicCEUAdmissibilityPanel has source status section', () => {
    const panelPath = path.join(APP_ROOT, 'components', 'sqo-cockpit', 'DynamicCEUAdmissibilityPanel.jsx');
    const content = fs.readFileSync(panelPath, 'utf8');
    assert.ok(content.includes('admissibility-panel__source-status'));
    assert.ok(content.includes('Source Status'));
    assert.ok(content.includes('Source Class'));
    assert.ok(content.includes('Evidence Set'));
  });

  it('DynamicCEUAdmissibilityPanel has tier warning', () => {
    const panelPath = path.join(APP_ROOT, 'components', 'sqo-cockpit', 'DynamicCEUAdmissibilityPanel.jsx');
    const content = fs.readFileSync(panelPath, 'utf8');
    assert.ok(content.includes('Tier-1/Tier-2/LENS/gauge outputs are not admissible'));
  });
});

// Suite 12: No pre-rebase extractor imports in child routes
describe('Child Route Rebase Binding: no pre-rebase extractor imports', () => {
  it('semantic-candidates.js does not import BlueEdgeSemanticCandidateExtractor.server', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'semantic-candidates.js');
    const content = fs.readFileSync(routePath, 'utf8');
    assert.ok(!content.includes('BlueEdgeSemanticCandidateExtractor.server'));
  });

  it('ceu-admissibility.js does not import DynamicCEUAdmissibilityEvaluator.server', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'ceu-admissibility.js');
    const content = fs.readFileSync(routePath, 'utf8');
    assert.ok(!content.includes('DynamicCEUAdmissibilityEvaluator.server'));
  });
});

// Suite 13: Adapter data shape matches view model contracts
describe('Child Route Rebase Binding: adapter data shape matches view model contracts', () => {
  const { loadRebasedCandidateData, loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('candidate adapter has evidence_registry_id', () => {
    const data = loadRebasedCandidateData();
    assert.ok(data.evidence_registry_id);
  });

  it('candidate adapter has extraction_log', () => {
    const data = loadRebasedCandidateData();
    assert.ok(Array.isArray(data.extraction_log));
  });

  it('candidate adapter has summary with domain_counts', () => {
    const data = loadRebasedCandidateData();
    assert.ok(data.summary.domain_counts !== undefined);
  });

  it('candidate adapter has summary with extraction_methods_used', () => {
    const data = loadRebasedCandidateData();
    assert.ok(Array.isArray(data.summary.extraction_methods_used));
  });

  it('candidate adapter has summary with confidence_distribution', () => {
    const data = loadRebasedCandidateData();
    assert.ok(data.summary.confidence_distribution !== undefined);
    assert.ok(data.summary.confidence_distribution.STRONG !== undefined);
  });

  it('admissibility adapter has upstream_registry_id', () => {
    const data = loadRebasedAdmissibilityData();
    assert.ok(data.upstream_registry_id);
  });

  it('admissibility adapter has upstream_candidate_count', () => {
    const data = loadRebasedAdmissibilityData();
    assert.ok(typeof data.upstream_candidate_count === 'number');
    assert.ok(data.upstream_candidate_count > 0);
  });

  it('admissibility adapter has evaluation_log', () => {
    const data = loadRebasedAdmissibilityData();
    assert.ok(Array.isArray(data.evaluation_log));
  });

  it('admissibility adapter has structural_compatibility_distribution', () => {
    const data = loadRebasedAdmissibilityData();
    assert.ok(data.summary.structural_compatibility_distribution !== undefined);
    assert.ok(data.summary.structural_compatibility_distribution.HIGH !== undefined);
  });

  it('admissibility adapter has replay_compatibility_distribution', () => {
    const data = loadRebasedAdmissibilityData();
    assert.ok(data.summary.replay_compatibility_distribution !== undefined);
    assert.ok(data.summary.replay_compatibility_distribution.COMPATIBLE !== undefined);
  });
});

// Suite 14: No grounding mutation
describe('Child Route Rebase Binding: no grounding mutation', () => {
  const { loadRebasedCandidateData, loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('candidate data governance has no_grounding_mutation', () => {
    const data = loadRebasedCandidateData();
    assert.equal(data.governance.no_grounding_mutation, true);
  });

  it('admissibility data governance has no_grounding_mutation', () => {
    const data = loadRebasedAdmissibilityData();
    assert.equal(data.governance.no_grounding_mutation, true);
  });
});

// Suite 15: No overlay generation
describe('Child Route Rebase Binding: no overlay generation', () => {
  const { loadRebasedCandidateData, loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('candidate data governance has no_overlay_generation', () => {
    const data = loadRebasedCandidateData();
    assert.equal(data.governance.no_overlay_generation, true);
  });

  it('admissibility data governance has no_overlay_generation', () => {
    const data = loadRebasedAdmissibilityData();
    assert.equal(data.governance.no_overlay_generation, true);
  });
});

// Suite 16: No qualification mutation
describe('Child Route Rebase Binding: no qualification mutation', () => {
  const { loadRebasedCandidateData, loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('candidate data governance has no_qualification_mutation', () => {
    const data = loadRebasedCandidateData();
    assert.equal(data.governance.no_qualification_mutation, true);
  });

  it('admissibility data governance has no_qualification_mutation', () => {
    const data = loadRebasedAdmissibilityData();
    assert.equal(data.governance.no_qualification_mutation, true);
  });
});

// Suite 17: No authority assertion
describe('Child Route Rebase Binding: no authority assertion', () => {
  const { loadRebasedCandidateData, loadRebasedAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));

  it('candidate data all_non_authoritative', () => {
    const data = loadRebasedCandidateData();
    assert.equal(data.summary.all_non_authoritative, true);
  });

  it('admissibility data all_non_authoritative', () => {
    const data = loadRebasedAdmissibilityData();
    assert.equal(data.summary.all_non_authoritative, true);
  });

  it('candidate data governance has no_authority_assertion', () => {
    const data = loadRebasedCandidateData();
    assert.equal(data.governance.no_authority_assertion, true);
  });

  it('admissibility data governance has no_authority_assertion', () => {
    const data = loadRebasedAdmissibilityData();
    assert.equal(data.governance.no_authority_assertion, true);
  });
});

// Suite 18: CSS for source status sections exists
describe('Child Route Rebase Binding: CSS source status classes', () => {
  it('candidate-panel__source-status CSS exists', () => {
    const cssPath = path.join(APP_ROOT, 'styles', 'globals.css');
    const content = fs.readFileSync(cssPath, 'utf8');
    assert.ok(content.includes('.candidate-panel__source-status'));
    assert.ok(content.includes('.candidate-panel__source-status-row'));
    assert.ok(content.includes('.candidate-panel__source-label'));
    assert.ok(content.includes('.candidate-panel__source-value'));
    assert.ok(content.includes('.candidate-panel__source-warning'));
  });

  it('admissibility-panel__source-status CSS exists', () => {
    const cssPath = path.join(APP_ROOT, 'styles', 'globals.css');
    const content = fs.readFileSync(cssPath, 'utf8');
    assert.ok(content.includes('.admissibility-panel__source-status'));
    assert.ok(content.includes('.admissibility-panel__source-status-row'));
    assert.ok(content.includes('.admissibility-panel__source-label'));
    assert.ok(content.includes('.admissibility-panel__source-value'));
    assert.ok(content.includes('.admissibility-panel__source-warning'));
  });
});

// Suite 19: No LENS coupling in child route data path
describe('Child Route Rebase Binding: no LENS coupling in data path', () => {
  it('semantic-candidates.js does not import from lens-v2', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'semantic-candidates.js');
    const content = fs.readFileSync(routePath, 'utf8');
    const lines = content.split('\n');
    const requireLines = lines.filter(l => l.includes('require('));
    for (const line of requireLines) {
      if (line.includes('listAllowedClientRuns')) continue;
      assert.ok(!line.includes('lens-v2'), `Unexpected lens-v2 import in semantic-candidates data path: ${line.trim()}`);
    }
  });

  it('ceu-admissibility.js does not import from lens-v2', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'ceu-admissibility.js');
    const content = fs.readFileSync(routePath, 'utf8');
    const lines = content.split('\n');
    const requireLines = lines.filter(l => l.includes('require('));
    for (const line of requireLines) {
      if (line.includes('listAllowedClientRuns')) continue;
      assert.ok(!line.includes('lens-v2'), `Unexpected lens-v2 import in ceu-admissibility data path: ${line.trim()}`);
    }
  });

  it('rebase extractor does not import LENS tier extractors or LENS output modules', () => {
    const extractorPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js');
    const content = fs.readFileSync(extractorPath, 'utf8');
    assert.ok(!content.includes('LENSExtractor'));
    assert.ok(!content.includes('LensTier1'));
    assert.ok(!content.includes('LensTier2'));
    assert.ok(!content.includes('LENSOutputResolver'));
  });
});

'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const APP_ROOT = path.resolve(__dirname, '..', '..');

// Suite 1: Evidence source pointer loads
describe('Evidence Rebase: evidence source pointer loads', () => {
  const sourcesPath = path.join(REPO_ROOT, 'clients', 'blueedge', 'sqo', 'evidence_sources.yaml');

  it('evidence_sources.yaml exists', () => {
    assert.ok(fs.existsSync(sourcesPath), 'evidence_sources.yaml must exist');
  });

  it('evidence_sources.yaml contains required fields', () => {
    const content = fs.readFileSync(sourcesPath, 'utf8');
    assert.ok(content.includes('client:'), 'must contain client field');
    assert.ok(content.includes('run_id:'), 'must contain run_id field');
    assert.ok(content.includes('evidence_set_id:'), 'must contain evidence_set_id field');
    assert.ok(content.includes('evidence_root:'), 'must contain evidence_root field');
    assert.ok(content.includes('allowed_source_class:'), 'must contain allowed_source_class field');
    assert.ok(content.includes('files:'), 'must contain files field');
  });

  it('allowed source class is EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE', () => {
    const content = fs.readFileSync(sourcesPath, 'utf8');
    assert.ok(content.includes('EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE'));
  });

  it('disallowed source classes are listed', () => {
    const content = fs.readFileSync(sourcesPath, 'utf8');
    assert.ok(content.includes('DOWNSTREAM_PROJECTION'));
    assert.ok(content.includes('SELF_RECURSIVE_EVIDENCE'));
    assert.ok(content.includes('UNCONTROLLED_DISCOVERY'));
    assert.ok(content.includes('MOCK_OR_SEEDED_FIXTURE'));
  });
});

// Suite 2: Evidence files exist and hash
describe('Evidence Rebase: evidence files exist and hash', () => {
  const evidenceRoot = path.join(REPO_ROOT, 'clients', 'blueedge', 'sqo', 'evidence', 'blueedge_explicit_html_rebase_01');

  it('evidence root directory exists', () => {
    assert.ok(fs.existsSync(evidenceRoot), 'evidence root must exist');
  });

  it('PMO Dashboard HTML exists', () => {
    assert.ok(fs.existsSync(path.join(evidenceRoot, 'Blue_Edge_PMO_Dashboard.html')));
  });

  it('Competitive Dashboard HTML exists', () => {
    assert.ok(fs.existsSync(path.join(evidenceRoot, 'BlueEdge_Competitive_Dashboard_Feb2026.html')));
  });

  it('Architecture Specification HTML exists', () => {
    assert.ok(fs.existsSync(path.join(evidenceRoot, 'BlueEdge_Unified_Architecture_v3_23_0.html')));
  });

  it('all evidence files are non-empty', () => {
    const files = ['Blue_Edge_PMO_Dashboard.html', 'BlueEdge_Competitive_Dashboard_Feb2026.html', 'BlueEdge_Unified_Architecture_v3_23_0.html'];
    for (const f of files) {
      const stats = fs.statSync(path.join(evidenceRoot, f));
      assert.ok(stats.size > 0, `${f} must be non-empty`);
    }
  });
});

// Suite 3: Extractor loads and returns ok
describe('Evidence Rebase: extractor loads and returns ok', () => {
  const extractorPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js');

  it('extractor file exists', () => {
    assert.ok(fs.existsSync(extractorPath));
  });

  it('extractor exports loadExplicitEvidenceRebaseData', () => {
    const mod = require(extractorPath);
    assert.ok(typeof mod.loadExplicitEvidenceRebaseData === 'function');
  });

  it('extractor returns ok:true', () => {
    const { loadExplicitEvidenceRebaseData } = require(extractorPath);
    const result = loadExplicitEvidenceRebaseData();
    assert.ok(result.ok, 'result.ok must be true');
  });

  it('extractor returns evidence items', () => {
    const { loadExplicitEvidenceRebaseData } = require(extractorPath);
    const result = loadExplicitEvidenceRebaseData();
    assert.ok(result.manifest.evidence_items.length === 3, 'must have 3 evidence items');
  });
});

// Suite 4: Source status marking
describe('Evidence Rebase: source status marking', () => {
  const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
  const result = loadExplicitEvidenceRebaseData();

  it('source_status is UPSTREAM_EVIDENCE_BOUND', () => {
    assert.equal(result.source_status, 'UPSTREAM_EVIDENCE_BOUND');
  });

  it('previous_chain_status is PRE_REBASE_NON_AUTHORITATIVE', () => {
    assert.equal(result.previous_chain_status, 'PRE_REBASE_NON_AUTHORITATIVE');
  });

  it('all evidence items are operator_provided', () => {
    for (const item of result.manifest.evidence_items) {
      assert.ok(item.operator_provided, `${item.evidence_id} must be operator_provided`);
    }
  });

  it('manifest source_class is EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE', () => {
    assert.equal(result.manifest.source_class, 'EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE');
  });
});

// Suite 5: Candidate extraction
describe('Evidence Rebase: candidate extraction', () => {
  const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
  const result = loadExplicitEvidenceRebaseData();

  it('candidates array is non-empty', () => {
    assert.ok(result.candidates.length > 0, 'must extract at least 1 candidate');
  });

  it('all candidates have required fields', () => {
    const requiredFields = ['candidate_id', 'evidence_id', 'source_path', 'source_hash', 'extracted_label', 'candidate_type', 'candidate_domain', 'extraction_method', 'confidence_class', 'authority_state'];
    for (const c of result.candidates) {
      for (const field of requiredFields) {
        assert.ok(c[field] !== undefined && c[field] !== null, `candidate ${c.candidate_id} missing ${field}`);
      }
    }
  });

  it('all candidates have NON_AUTHORITATIVE_SEMANTIC_CANDIDATE authority', () => {
    for (const c of result.candidates) {
      assert.equal(c.authority_state, 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE');
    }
  });

  it('candidates come from all 3 evidence files', () => {
    const evidenceIds = new Set(result.candidates.map(c => c.evidence_id));
    assert.ok(evidenceIds.size === 3, `Expected 3 evidence sources, got ${evidenceIds.size}`);
  });
});

// Suite 6: Structural compatibility
describe('Evidence Rebase: structural compatibility', () => {
  const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
  const result = loadExplicitEvidenceRebaseData();

  it('all evaluations have structural_compatibility', () => {
    const validCompats = ['HIGH', 'MODERATE', 'LOW', 'NONE'];
    for (const e of result.evaluations) {
      assert.ok(validCompats.includes(e.structural_compatibility), `Invalid compat: ${e.structural_compatibility}`);
    }
  });

  it('ARCHITECTURE_SECTION candidates get HIGH compatibility', () => {
    const archSections = result.evaluations.filter(e => e.candidate_type === 'ARCHITECTURE_SECTION' && e.candidate_domain !== 'UNMAPPED_CANDIDATE');
    for (const e of archSections) {
      assert.equal(e.structural_compatibility, 'HIGH');
    }
  });

  it('PMO_SECTION candidates get LOW compatibility', () => {
    const pmoSections = result.evaluations.filter(e => e.candidate_type === 'PMO_SECTION' && e.candidate_domain !== 'UNMAPPED_CANDIDATE');
    for (const e of pmoSections) {
      assert.equal(e.structural_compatibility, 'LOW');
    }
  });
});

// Suite 7: Inline admissibility
describe('Evidence Rebase: inline admissibility', () => {
  const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
  const result = loadExplicitEvidenceRebaseData();

  it('all evaluations have admissibility_state', () => {
    const validStates = ['ADMISSIBLE', 'QUARANTINED', 'REJECTED'];
    for (const e of result.evaluations) {
      assert.ok(validStates.includes(e.admissibility_state), `Invalid state: ${e.admissibility_state}`);
    }
  });

  it('all evaluations have NON_AUTHORITATIVE_ADMISSIBILITY_RESULT authority', () => {
    for (const e of result.evaluations) {
      assert.equal(e.authority_state, 'NON_AUTHORITATIVE_ADMISSIBILITY_RESULT');
    }
  });

  it('summary counts match evaluation array', () => {
    assert.equal(result.summary.admissible, result.evaluations.filter(e => e.admissibility_state === 'ADMISSIBLE').length);
    assert.equal(result.summary.quarantined, result.evaluations.filter(e => e.admissibility_state === 'QUARANTINED').length);
    assert.equal(result.summary.rejected, result.evaluations.filter(e => e.admissibility_state === 'REJECTED').length);
  });

  it('evaluation count matches candidate count', () => {
    assert.equal(result.evaluation_count, result.candidate_count);
  });
});

// Suite 8: Replay compatibility
describe('Evidence Rebase: replay compatibility', () => {
  const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
  const result = loadExplicitEvidenceRebaseData();

  it('all evaluations have COMPATIBLE replay', () => {
    for (const e of result.evaluations) {
      assert.equal(e.replay_compatibility, 'COMPATIBLE');
    }
  });
});

// Suite 9: No overlay generation
describe('Evidence Rebase: no overlay generation', () => {
  const extractorPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js');
  const content = fs.readFileSync(extractorPath, 'utf8');

  it('no overlay generation in extractor', () => {
    assert.ok(!content.includes('generateOverlay'), 'must not generate overlays');
    assert.ok(!content.includes('overlay_proposal'), 'must not produce overlay proposals');
  });

  it('governance flag confirms no overlay generation', () => {
    const { loadExplicitEvidenceRebaseData } = require(extractorPath);
    const result = loadExplicitEvidenceRebaseData();
    assert.ok(result.governance.no_overlay_generation);
  });
});

// Suite 10: No qualification mutation
describe('Evidence Rebase: no qualification mutation', () => {
  const extractorPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js');
  const content = fs.readFileSync(extractorPath, 'utf8');

  it('no S-state mutation', () => {
    assert.ok(!content.includes('s_state ='), 'must not mutate s_state');
    assert.ok(!content.includes('set_s_state'), 'must not set s_state');
  });

  it('no Q-class mutation', () => {
    assert.ok(!content.includes('q_class ='), 'must not mutate q_class');
  });

  it('governance flag confirms no qualification mutation', () => {
    const { loadExplicitEvidenceRebaseData } = require(extractorPath);
    const result = loadExplicitEvidenceRebaseData();
    assert.ok(result.governance.no_qualification_mutation);
  });
});

// Suite 11: No grounding mutation
describe('Evidence Rebase: no grounding mutation', () => {
  const extractorPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js');
  const content = fs.readFileSync(extractorPath, 'utf8');

  it('no grounding state writes', () => {
    assert.ok(!content.includes('grounding_state ='), 'must not mutate grounding_state');
    assert.ok(!content.includes('setGrounding'), 'must not call setGrounding');
  });

  it('governance flag confirms no grounding mutation', () => {
    const { loadExplicitEvidenceRebaseData } = require(extractorPath);
    const result = loadExplicitEvidenceRebaseData();
    assert.ok(result.governance.no_grounding_mutation);
  });
});

// Suite 12: No PATH A/B imports
describe('Evidence Rebase: no PATH A/B imports', () => {
  const extractorPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js');
  const content = fs.readFileSync(extractorPath, 'utf8');

  it('no PATH A imports', () => {
    assert.ok(!content.includes("require('../../path-a"), 'must not import PATH A');
    assert.ok(!content.includes("from '../../path-a"), 'must not import PATH A');
  });

  it('no PATH B imports', () => {
    assert.ok(!content.includes("require('../../path-b"), 'must not import PATH B');
    assert.ok(!content.includes("from '../../path-b"), 'must not import PATH B');
  });
});

// Suite 13: No LENS coupling
describe('Evidence Rebase: no LENS coupling', () => {
  const extractorPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js');
  const content = fs.readFileSync(extractorPath, 'utf8');

  it('no LENS route imports', () => {
    assert.ok(!content.includes("require('../../lens-v2/routes"), 'must not import LENS routes');
  });

  it('no LENS projection mutation', () => {
    assert.ok(!content.includes('lensProjection'), 'must not reference lensProjection');
    assert.ok(!content.includes('LENSProjection'), 'must not reference LENSProjection');
  });

  it('governance flag confirms no LENS mutation', () => {
    const { loadExplicitEvidenceRebaseData } = require(extractorPath);
    const result = loadExplicitEvidenceRebaseData();
    assert.ok(result.governance.no_lens_mutation);
  });
});

// Suite 14: No browser-side fs import
describe('Evidence Rebase: no browser-side fs import', () => {
  const panelPath = path.join(APP_ROOT, 'components', 'sqo-cockpit', 'ExplicitEvidenceRebasePanel.jsx');
  const viewModelPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'ExplicitEvidenceRebaseViewModel.js');

  it('panel component does not import fs', () => {
    const content = fs.readFileSync(panelPath, 'utf8');
    assert.ok(!content.includes("require('fs')"), 'panel must not import fs');
    assert.ok(!content.includes("from 'fs'"), 'panel must not import fs');
  });

  it('view model does not import fs', () => {
    const content = fs.readFileSync(viewModelPath, 'utf8');
    assert.ok(!content.includes("require('fs')"), 'view model must not import fs');
    assert.ok(!content.includes("from 'fs'"), 'view model must not import fs');
  });

  it('panel does not import path', () => {
    const content = fs.readFileSync(panelPath, 'utf8');
    assert.ok(!content.includes("require('path')"), 'panel must not import path');
  });

  it('panel does not import crypto', () => {
    const content = fs.readFileSync(panelPath, 'utf8');
    assert.ok(!content.includes("require('crypto')"), 'panel must not import crypto');
  });
});

// Suite 15: Route config
describe('Evidence Rebase: route config', () => {
  const routeResolverPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitRouteResolver.js');
  const mod = require(routeResolverPath);

  it('evidence-rebase is in COCKPIT_SECTIONS', () => {
    assert.ok(mod.COCKPIT_SECTIONS.includes('evidence-rebase'));
  });

  it('evidence-rebase has route in SECTION_ROUTES', () => {
    assert.equal(mod.SECTION_ROUTES['evidence-rebase'], '/evidence-rebase');
  });

  it('evidence-rebase has label in SECTION_LABELS', () => {
    assert.equal(mod.SECTION_LABELS['evidence-rebase'], 'Evidence Rebase');
  });

  it('evidence-rebase page route file exists', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'evidence-rebase.js');
    assert.ok(fs.existsSync(routePath), 'evidence-rebase.js route must exist');
  });
});

// Suite 16: View model
describe('Evidence Rebase: view model', () => {
  const viewModelPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'ExplicitEvidenceRebaseViewModel.js');

  it('view model file exists', () => {
    assert.ok(fs.existsSync(viewModelPath));
  });

  it('view model exports buildExplicitEvidenceRebaseViewModel', () => {
    const mod = require(viewModelPath);
    assert.ok(typeof mod.buildExplicitEvidenceRebaseViewModel === 'function');
  });

  it('view model returns available:false for null input', () => {
    const { buildExplicitEvidenceRebaseViewModel } = require(viewModelPath);
    const result = buildExplicitEvidenceRebaseViewModel(null);
    assert.equal(result.available, false);
  });

  it('view model truncates evidence hashes', () => {
    const { buildExplicitEvidenceRebaseViewModel } = require(viewModelPath);
    const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
    const data = loadExplicitEvidenceRebaseData();
    const vm = buildExplicitEvidenceRebaseViewModel(data);
    for (const item of vm.evidence_items) {
      if (item.evidence_hash) {
        assert.ok(item.evidence_hash.endsWith('...'), 'hash must be truncated');
        assert.ok(item.evidence_hash.length <= 20, 'truncated hash must be short');
      }
    }
  });

  it('view model has is_upstream_bound flag', () => {
    const { buildExplicitEvidenceRebaseViewModel } = require(viewModelPath);
    const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
    const data = loadExplicitEvidenceRebaseData();
    const vm = buildExplicitEvidenceRebaseViewModel(data);
    assert.ok(vm.is_upstream_bound);
  });

  it('view model has is_previous_non_authoritative flag', () => {
    const { buildExplicitEvidenceRebaseViewModel } = require(viewModelPath);
    const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
    const data = loadExplicitEvidenceRebaseData();
    const vm = buildExplicitEvidenceRebaseViewModel(data);
    assert.ok(vm.is_previous_non_authoritative);
  });
});

// Suite 17: Manifest output
describe('Evidence Rebase: manifest output', () => {
  const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js'));
  const result = loadExplicitEvidenceRebaseData();
  const manifestPath = path.join(REPO_ROOT, 'artifacts', 'sqo', 'blueedge', 'evidence_rebase_01', 'evidence_manifest.json');

  it('manifest file was written', () => {
    assert.ok(fs.existsSync(manifestPath), 'evidence_manifest.json must exist');
  });

  it('manifest is valid JSON', () => {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const parsed = JSON.parse(content);
    assert.ok(parsed.evidence_set_id);
  });

  it('manifest lists 3 evidence items', () => {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const parsed = JSON.parse(content);
    assert.equal(parsed.evidence_items.length, 3);
  });

  it('manifest all_operator_provided is true', () => {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const parsed = JSON.parse(content);
    assert.ok(parsed.all_operator_provided);
  });

  it('manifest source_bound is true', () => {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const parsed = JSON.parse(content);
    assert.ok(parsed.source_bound);
  });
});

// Suite 18: Component files exist
describe('Evidence Rebase: component files exist', () => {
  it('ExplicitEvidenceRebasePanel.jsx exists', () => {
    assert.ok(fs.existsSync(path.join(APP_ROOT, 'components', 'sqo-cockpit', 'ExplicitEvidenceRebasePanel.jsx')));
  });

  it('ExplicitEvidenceRebaseViewModel.js exists', () => {
    assert.ok(fs.existsSync(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'ExplicitEvidenceRebaseViewModel.js')));
  });

  it('ExplicitEvidenceRebaseExtractor.server.js exists', () => {
    assert.ok(fs.existsSync(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server.js')));
  });

  it('evidence-rebase.js page route exists', () => {
    assert.ok(fs.existsSync(path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'evidence-rebase.js')));
  });

  it('SQOWorkspaceShell includes evidence-rebase in knownSections', () => {
    const shellContent = fs.readFileSync(path.join(APP_ROOT, 'components', 'sqo-cockpit', 'SQOWorkspaceShell.jsx'), 'utf8');
    assert.ok(shellContent.includes("'evidence-rebase'"), 'knownSections must include evidence-rebase');
  });
});

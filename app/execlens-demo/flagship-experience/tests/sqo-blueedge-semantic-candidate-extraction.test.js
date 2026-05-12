'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { loadSemanticCandidateData, CLIENT, RUN, DOMAIN_KEYWORD_MAP } = require('../../lib/sqo-cockpit/server/BlueEdgeSemanticCandidateExtractor.server');
const { buildSemanticCandidateViewModel } = require('../../lib/sqo-cockpit/client/BlueEdgeSemanticCandidateViewModel');
const { COCKPIT_SECTIONS, SECTION_ROUTES, SECTION_LABELS, buildNavigationItems } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');

const REPO_ROOT = process.env.REPO_ROOT;

// ────────────────────────────────────────────────────────────────────────────
// 1. Candidate extractor loads registered evidence
// ────────────────────────────────────────────────────────────────────────────

describe('Candidate extractor loads registered evidence', () => {
  it('loads data successfully from evidence registry', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.ok, true);
    assert.equal(data.client, 'blueedge');
    assert.equal(data.run_id, 'run_blueedge_productized_01_fixed');
    assert.ok(data.evidence_registry_id);
  });

  it('extraction log covers all evidence items', () => {
    const data = loadSemanticCandidateData();
    assert.ok(data.extraction_log.length >= 5, 'Should have extraction log for all evidence items');
    for (const entry of data.extraction_log) {
      assert.ok(entry.evidence_id);
      assert.ok(entry.status);
    }
  });

  it('all evidence items have EXTRACTED status', () => {
    const data = loadSemanticCandidateData();
    for (const entry of data.extraction_log) {
      assert.equal(entry.status, 'EXTRACTED', `${entry.evidence_id} should be EXTRACTED`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Candidates are produced deterministically
// ────────────────────────────────────────────────────────────────────────────

describe('Candidates are produced deterministically', () => {
  it('produces at least 12 candidate signals', () => {
    const data = loadSemanticCandidateData();
    assert.ok(data.candidate_count >= 12, `Expected at least 12 candidates, got ${data.candidate_count}`);
  });

  it('same input produces same output', () => {
    const run1 = loadSemanticCandidateData();
    const run2 = loadSemanticCandidateData();
    assert.equal(run1.candidate_count, run2.candidate_count);
    for (let i = 0; i < run1.candidates.length; i++) {
      assert.equal(run1.candidates[i].candidate_id, run2.candidates[i].candidate_id);
      assert.equal(run1.candidates[i].extracted_label, run2.candidates[i].extracted_label);
      assert.equal(run1.candidates[i].candidate_domain, run2.candidates[i].candidate_domain);
    }
  });

  it('each candidate has all required fields', () => {
    const data = loadSemanticCandidateData();
    const requiredFields = [
      'candidate_id', 'evidence_id', 'source_path', 'source_hash',
      'extracted_label', 'candidate_type', 'candidate_domain',
      'source_span_reference', 'extraction_method', 'confidence_class',
      'conflict_status', 'authority_state', 'next_required_gate',
    ];
    for (const c of data.candidates) {
      for (const field of requiredFields) {
        assert.ok(c[field] !== undefined, `Candidate ${c.candidate_id} missing field: ${field}`);
      }
    }
  });

  it('uses only allowed extraction methods', () => {
    const allowed = [
      'HEADING_EXTRACTION', 'SECTION_TITLE_EXTRACTION', 'TABLE_LABEL_EXTRACTION',
      'DOMAIN_KEYWORD_MAPPING', 'ARCHITECTURE_LAYER_MAPPING', 'MODULE_CAPABILITY_MAPPING',
    ];
    const data = loadSemanticCandidateData();
    for (const c of data.candidates) {
      assert.ok(allowed.includes(c.extraction_method), `${c.candidate_id} uses disallowed method: ${c.extraction_method}`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Candidate source hashes match evidence registry
// ────────────────────────────────────────────────────────────────────────────

describe('Candidate source hashes match evidence registry', () => {
  it('all extraction log entries have hash_verified true', () => {
    const data = loadSemanticCandidateData();
    for (const entry of data.extraction_log) {
      assert.equal(entry.hash_verified, true, `${entry.evidence_id} hash should verify`);
    }
  });

  it('candidate source_hash matches evidence registry hash', () => {
    const data = loadSemanticCandidateData();
    const regPath = path.join(REPO_ROOT, 'artifacts', 'sqo', CLIENT, RUN, 'evidence-ingestion', 'evidence_registry.v1.json');
    const registry = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    const evidenceHashes = {};
    for (const item of registry.evidence_items) {
      evidenceHashes[item.evidence_id] = item.evidence_hash;
    }
    for (const c of data.candidates) {
      const expectedHash = evidenceHashes[c.evidence_id];
      assert.ok(expectedHash, `Evidence hash for ${c.evidence_id} should exist`);
      assert.equal(c.source_hash, expectedHash, `${c.candidate_id} source_hash should match registry`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Candidate source spans render
// ────────────────────────────────────────────────────────────────────────────

describe('Candidate source spans render', () => {
  it('all candidates have non-empty source_span_reference', () => {
    const data = loadSemanticCandidateData();
    for (const c of data.candidates) {
      assert.ok(c.source_span_reference, `${c.candidate_id} must have source_span_reference`);
      assert.ok(c.source_span_reference.length > 0, `${c.candidate_id} source_span_reference must be non-empty`);
    }
  });

  it('view model preserves source spans', () => {
    const data = loadSemanticCandidateData();
    const vm = buildSemanticCandidateViewModel(data);
    for (const c of vm.candidates) {
      assert.ok(c.source_span_reference, `VM candidate ${c.candidate_id} must have source_span_reference`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Candidate domains render
// ────────────────────────────────────────────────────────────────────────────

describe('Candidate domains render', () => {
  it('mapped candidates have DOMAIN-XX format', () => {
    const data = loadSemanticCandidateData();
    const mapped = data.candidates.filter(c => c.candidate_domain !== 'UNMAPPED_CANDIDATE');
    assert.ok(mapped.length > 0, 'Should have mapped candidates');
    for (const c of mapped) {
      assert.ok(/^DOMAIN-\d+$/.test(c.candidate_domain), `${c.candidate_id} domain should match DOMAIN-XX: ${c.candidate_domain}`);
    }
  });

  it('at least one candidate targets a domain at NONE', () => {
    const domainsAtNone = ['DOMAIN-02', 'DOMAIN-03', 'DOMAIN-04', 'DOMAIN-05', 'DOMAIN-06', 'DOMAIN-07', 'DOMAIN-08', 'DOMAIN-09', 'DOMAIN-10', 'DOMAIN-12', 'DOMAIN-13', 'DOMAIN-15', 'DOMAIN-17'];
    const data = loadSemanticCandidateData();
    const targetedNone = data.candidates.filter(c => domainsAtNone.includes(c.candidate_domain));
    assert.ok(targetedNone.length > 0, 'Should have candidates targeting NONE domains');
  });

  it('at least one candidate targets a domain at PARTIAL', () => {
    const domainsAtPartial = ['DOMAIN-11'];
    const data = loadSemanticCandidateData();
    const targetedPartial = data.candidates.filter(c => domainsAtPartial.includes(c.candidate_domain));
    assert.ok(targetedPartial.length > 0, 'Should have candidates targeting PARTIAL domains');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Unmapped candidates fail visible
// ────────────────────────────────────────────────────────────────────────────

describe('Unmapped candidates fail visible', () => {
  it('unmapped candidates have UNMAPPED_CANDIDATE domain', () => {
    const data = loadSemanticCandidateData();
    const unmapped = data.candidates.filter(c => c.candidate_domain === 'UNMAPPED_CANDIDATE');
    assert.ok(unmapped.length > 0, 'Should have at least one unmapped candidate');
    for (const c of unmapped) {
      assert.equal(c.candidate_domain, 'UNMAPPED_CANDIDATE');
    }
  });

  it('summary reports unmapped count', () => {
    const data = loadSemanticCandidateData();
    assert.ok(data.summary.unmapped_candidates > 0, 'Should report unmapped count');
    const actualUnmapped = data.candidates.filter(c => c.candidate_domain === 'UNMAPPED_CANDIDATE').length;
    assert.equal(data.summary.unmapped_candidates, actualUnmapped);
  });

  it('view model marks unmapped candidates', () => {
    const data = loadSemanticCandidateData();
    const vm = buildSemanticCandidateViewModel(data);
    const unmapped = vm.candidates.filter(c => c.is_unmapped);
    assert.ok(unmapped.length > 0, 'View model should flag unmapped candidates');
    for (const c of unmapped) {
      assert.equal(c.is_unmapped, true);
      assert.equal(c.candidate_domain, 'UNMAPPED_CANDIDATE');
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. Authority state remains NON_AUTHORITATIVE_SEMANTIC_CANDIDATE
// ────────────────────────────────────────────────────────────────────────────

describe('Authority state remains NON_AUTHORITATIVE_SEMANTIC_CANDIDATE', () => {
  it('all candidates have correct authority state', () => {
    const data = loadSemanticCandidateData();
    for (const c of data.candidates) {
      assert.equal(c.authority_state, 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE', `${c.candidate_id} authority_state`);
    }
  });

  it('summary confirms all non-authoritative', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.summary.all_non_authoritative, true);
  });

  it('view model preserves authority state', () => {
    const data = loadSemanticCandidateData();
    const vm = buildSemanticCandidateViewModel(data);
    for (const c of vm.candidates) {
      assert.equal(c.authority_state, 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE');
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. Next gate remains DYNAMIC_CEU_ADMISSIBILITY_REQUIRED
// ────────────────────────────────────────────────────────────────────────────

describe('Next gate remains DYNAMIC_CEU_ADMISSIBILITY_REQUIRED', () => {
  it('all candidates have correct next_required_gate', () => {
    const data = loadSemanticCandidateData();
    for (const c of data.candidates) {
      assert.equal(c.next_required_gate, 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED', `${c.candidate_id} next_required_gate`);
    }
  });

  it('summary confirms all gated', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.summary.all_gated, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 9. No grounding mutation occurs
// ────────────────────────────────────────────────────────────────────────────

describe('No grounding mutation occurs', () => {
  it('governance enforces no grounding mutation', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.governance.no_grounding_mutation, true);
  });

  it('governance enforces extraction only', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.governance.extraction_only, true);
  });

  it('governance enforces fail closed', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.governance.fail_closed, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 10. No overlay generation occurs
// ────────────────────────────────────────────────────────────────────────────

describe('No overlay generation occurs', () => {
  it('governance enforces no overlay generation', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.governance.no_overlay_generation, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 11. No qualification mutation occurs
// ────────────────────────────────────────────────────────────────────────────

describe('No qualification mutation occurs', () => {
  it('governance enforces no qualification mutation', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.governance.no_qualification_mutation, true);
  });

  it('governance enforces no authority assertion', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.governance.no_authority_assertion, true);
  });

  it('governance enforces no LENS mutation', () => {
    const data = loadSemanticCandidateData();
    assert.equal(data.governance.no_lens_mutation, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 12. No PATH A imports introduced
// ────────────────────────────────────────────────────────────────────────────

describe('No PATH A imports in candidate components', () => {
  const files = [
    'SemanticCandidateExtractionPanel.jsx',
    'SemanticCandidateRegistryTable.jsx',
    'CandidateEvidenceLineageSummary.jsx',
    'CandidateAuthorityBoundaryNotice.jsx',
  ];

  for (const file of files) {
    it(`${file} does not import PATH A modules`, () => {
      const content = fs.readFileSync(
        path.join(REPO_ROOT, 'app/execlens-demo/components/sqo-cockpit', file), 'utf8'
      );
      assert.ok(!content.includes('path-a/'), `${file} must not import PATH A`);
      assert.ok(!content.includes('PathA'), `${file} must not reference PathA`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 13. No PATH B imports introduced
// ────────────────────────────────────────────────────────────────────────────

describe('No PATH B imports in candidate libs', () => {
  const files = [
    { path: 'server/BlueEdgeSemanticCandidateExtractor.server.js' },
    { path: 'client/BlueEdgeSemanticCandidateViewModel.js' },
  ];

  for (const f of files) {
    it(`${f.path} does not import PATH B modules`, () => {
      const content = fs.readFileSync(
        path.join(REPO_ROOT, 'app/execlens-demo/lib/sqo-cockpit', f.path), 'utf8'
      );
      assert.ok(!content.includes('path-b/'), `${f.path} must not import PATH B`);
      assert.ok(!content.includes('PathB'), `${f.path} must not reference PathB`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 14. No LENS coupling introduced
// ────────────────────────────────────────────────────────────────────────────

describe('No LENS coupling in candidate components', () => {
  const files = [
    'app/execlens-demo/components/sqo-cockpit/SemanticCandidateExtractionPanel.jsx',
    'app/execlens-demo/components/sqo-cockpit/SemanticCandidateRegistryTable.jsx',
    'app/execlens-demo/components/sqo-cockpit/CandidateEvidenceLineageSummary.jsx',
    'app/execlens-demo/components/sqo-cockpit/CandidateAuthorityBoundaryNotice.jsx',
  ];

  for (const file of files) {
    it(`${path.basename(file)} does not import LENS components`, () => {
      const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      assert.ok(!content.includes('lens-v2/components'), `must not import LENS components`);
      assert.ok(!content.includes('LensReport'), `must not reference LensReport`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 15. No browser-side fs import
// ────────────────────────────────────────────────────────────────────────────

describe('No browser-side fs import in candidate files', () => {
  const clientFiles = [
    'app/execlens-demo/components/sqo-cockpit/SemanticCandidateExtractionPanel.jsx',
    'app/execlens-demo/components/sqo-cockpit/SemanticCandidateRegistryTable.jsx',
    'app/execlens-demo/components/sqo-cockpit/CandidateEvidenceLineageSummary.jsx',
    'app/execlens-demo/components/sqo-cockpit/CandidateAuthorityBoundaryNotice.jsx',
    'app/execlens-demo/lib/sqo-cockpit/client/BlueEdgeSemanticCandidateViewModel.js',
  ];

  for (const file of clientFiles) {
    it(`${path.basename(file)} does not import fs`, () => {
      const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      assert.ok(!content.includes("require('fs')"), `must not import fs`);
      assert.ok(!content.includes("require('node:fs')"), `must not import node:fs`);
    });

    it(`${path.basename(file)} does not import path`, () => {
      const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      assert.ok(!content.includes("require('path')"), `must not import path`);
      assert.ok(!content.includes("require('node:path')"), `must not import node:path`);
    });

    it(`${path.basename(file)} does not import crypto`, () => {
      const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      assert.ok(!content.includes("require('crypto')"), `must not import crypto`);
      assert.ok(!content.includes("require('node:crypto')"), `must not import node:crypto`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 16. Route configuration and file existence
// ────────────────────────────────────────────────────────────────────────────

describe('Semantic candidates route configuration', () => {
  it('semantic-candidates section exists in COCKPIT_SECTIONS', () => {
    assert.ok(COCKPIT_SECTIONS.includes('semantic-candidates'));
  });

  it('semantic-candidates route is defined', () => {
    assert.equal(SECTION_ROUTES['semantic-candidates'], '/semantic-candidates');
  });

  it('semantic-candidates label is defined', () => {
    assert.equal(SECTION_LABELS['semantic-candidates'], 'Semantic Candidates');
  });

  it('navigation includes semantic-candidates section', () => {
    const nav = buildNavigationItems('blueedge', 'run_blueedge_productized_01_fixed', 'semantic-candidates');
    const scNav = nav.find(n => n.section === 'semantic-candidates');
    assert.ok(scNav);
    assert.equal(scNav.active, true);
  });

  it('page route file exists', () => {
    const pagePath = path.join(REPO_ROOT, 'app/execlens-demo/pages/sqo/client/[client]/run/[run]/semantic-candidates.js');
    assert.ok(fs.existsSync(pagePath), 'semantic-candidates.js page must exist');
  });

  it('all component files exist', () => {
    const components = [
      'SemanticCandidateExtractionPanel.jsx',
      'SemanticCandidateRegistryTable.jsx',
      'CandidateEvidenceLineageSummary.jsx',
      'CandidateAuthorityBoundaryNotice.jsx',
    ];
    for (const file of components) {
      const fullPath = path.join(REPO_ROOT, 'app/execlens-demo/components/sqo-cockpit', file);
      assert.ok(fs.existsSync(fullPath), `${file} must exist`);
    }
  });

  it('view model handles null data', () => {
    const vm = buildSemanticCandidateViewModel(null);
    assert.equal(vm.available, false);
    assert.equal(vm.error, 'NO_DATA');
  });

  it('view model handles error data', () => {
    const vm = buildSemanticCandidateViewModel({ ok: false, error: 'TEST' });
    assert.equal(vm.available, false);
    assert.equal(vm.error, 'TEST');
  });

  it('extractor is scoped to BlueEdge only', () => {
    assert.equal(CLIENT, 'blueedge');
    assert.equal(RUN, 'run_blueedge_productized_01_fixed');
  });
});

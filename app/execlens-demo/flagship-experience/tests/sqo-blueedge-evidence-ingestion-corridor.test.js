'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { loadEvidenceIngestionData, CLIENT, RUN } = require('../../lib/sqo-cockpit/server/BlueEdgeEvidenceIngestionLoader.server');
const { buildEvidenceViewModel } = require('../../lib/sqo-cockpit/client/BlueEdgeEvidenceViewModel');
const { COCKPIT_SECTIONS, SECTION_ROUTES, SECTION_LABELS, buildNavigationItems } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');

const REPO_ROOT = process.env.REPO_ROOT;

// ────────────────────────────────────────────────────────────────────────────
// 1. Evidence Ingestion Route
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence ingestion route configuration', () => {
  it('evidence-ingestion section exists in COCKPIT_SECTIONS', () => {
    assert.ok(COCKPIT_SECTIONS.includes('evidence-ingestion'));
  });

  it('evidence-ingestion route is defined', () => {
    assert.equal(SECTION_ROUTES['evidence-ingestion'], '/evidence-ingestion');
  });

  it('evidence-ingestion label is defined', () => {
    assert.equal(SECTION_LABELS['evidence-ingestion'], 'Evidence Ingestion');
  });

  it('navigation includes evidence-ingestion section', () => {
    const nav = buildNavigationItems('blueedge', 'run_blueedge_productized_01_fixed', 'evidence-ingestion');
    const eiNav = nav.find(n => n.section === 'evidence-ingestion');
    assert.ok(eiNav);
    assert.equal(eiNav.active, true);
    assert.ok(eiNav.path.includes('/evidence-ingestion'));
  });

  it('evidence-ingestion page file exists', () => {
    const pagePath = path.join(REPO_ROOT, 'app/execlens-demo/pages/sqo/client/[client]/run/[run]/evidence-ingestion.js');
    assert.ok(fs.existsSync(pagePath), 'evidence-ingestion.js page file should exist');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Scoped to BlueEdge (No Generalized Engine)
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence ingestion loader is scoped', () => {
  it('loader is scoped to BlueEdge only', () => {
    assert.equal(CLIENT, 'blueedge');
    assert.equal(RUN, 'run_blueedge_productized_01_fixed');
  });

  it('does not export a generalized evidence ingestion function', () => {
    const mod = require('../../lib/sqo-cockpit/server/BlueEdgeEvidenceIngestionLoader.server');
    assert.equal(typeof mod.loadEvidenceIngestionData, 'function');
    assert.equal(typeof mod.loadGenericEvidence, 'undefined');
    assert.equal(typeof mod.loadEvidenceForClient, 'undefined');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Server-Side Loader — Evidence Registry
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdgeEvidenceIngestionLoader', () => {
  it('loads evidence data successfully', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.ok, true);
    assert.equal(data.client, 'blueedge');
    assert.equal(data.run_id, 'run_blueedge_productized_01_fixed');
  });

  it('loads at least 3 evidence items', () => {
    const data = loadEvidenceIngestionData();
    assert.ok(data.item_count >= 3, `Expected at least 3 items, got ${data.item_count}`);
  });

  it('evidence registry contains required fields', () => {
    const data = loadEvidenceIngestionData();
    assert.ok(data.registry);
    assert.ok(data.registry.registry_id);
    assert.ok(data.registry.evidence_items);
    assert.ok(data.registry.governance);
    assert.ok(data.registry.summary);
  });

  it('each evidence item has required fields', () => {
    const data = loadEvidenceIngestionData();
    for (const item of data.registry.evidence_items) {
      assert.ok(item.evidence_id, 'evidence_id required');
      assert.ok(item.source_type, 'source_type required');
      assert.ok(item.source_path, 'source_path required');
      assert.ok(item.evidence_hash, 'evidence_hash required');
      assert.ok(item.authority_state, 'authority_state required');
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Evidence Hash Verification
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence hash verification', () => {
  it('produces verifications for all items', () => {
    const data = loadEvidenceIngestionData();
    assert.ok(data.verifications);
    assert.equal(data.verifications.length, data.item_count);
  });

  it('each verification has evidence_id and verified flag', () => {
    const data = loadEvidenceIngestionData();
    for (const v of data.verifications) {
      assert.ok(v.evidence_id);
      assert.equal(typeof v.verified, 'boolean');
    }
  });

  it('all evidence hashes verify correctly', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.all_verified, true, 'All evidence hashes should verify');
    for (const v of data.verifications) {
      assert.equal(v.verified, true, `${v.evidence_id} hash should verify`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. View Model — Client-Safe Transform
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdgeEvidenceViewModel', () => {
  it('builds available view model from valid data', () => {
    const data = loadEvidenceIngestionData();
    const vm = buildEvidenceViewModel(data);
    assert.equal(vm.available, true);
    assert.equal(vm.client, 'blueedge');
    assert.ok(vm.items.length >= 3);
  });

  it('returns unavailable for null data', () => {
    const vm = buildEvidenceViewModel(null);
    assert.equal(vm.available, false);
    assert.equal(vm.error, 'NO_DATA');
  });

  it('returns unavailable for error data', () => {
    const vm = buildEvidenceViewModel({ ok: false, error: 'TEST_ERROR' });
    assert.equal(vm.available, false);
    assert.equal(vm.error, 'TEST_ERROR');
  });

  it('truncates evidence hashes in view model', () => {
    const data = loadEvidenceIngestionData();
    const vm = buildEvidenceViewModel(data);
    for (const item of vm.items) {
      if (item.evidence_hash) {
        assert.ok(item.evidence_hash.endsWith('...'), 'Hash should be truncated');
        assert.ok(item.evidence_hash.length < 64, 'Truncated hash should be shorter than full');
        assert.ok(item.evidence_hash_full.length === 64, 'Full hash should be 64 chars');
      }
    }
  });

  it('view model includes governance flags', () => {
    const data = loadEvidenceIngestionData();
    const vm = buildEvidenceViewModel(data);
    assert.equal(typeof vm.governance.no_semantic_mutation, 'boolean');
    assert.equal(typeof vm.governance.no_authority_mutation, 'boolean');
    assert.equal(typeof vm.governance.no_overlay_generation, 'boolean');
    assert.equal(typeof vm.governance.ingestion_only, 'boolean');
    assert.equal(typeof vm.governance.additive_only, 'boolean');
  });

  it('view model includes summary with source types', () => {
    const data = loadEvidenceIngestionData();
    const vm = buildEvidenceViewModel(data);
    assert.ok(vm.summary.total_items > 0);
    assert.ok(vm.summary.source_types.length > 0);
    assert.ok(vm.summary.total_size_bytes > 0);
    assert.ok(vm.summary.domains_covered > 0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Authority State — All Non-Authoritative
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence authority state', () => {
  it('all items are NON_AUTHORITATIVE_EVIDENCE', () => {
    const data = loadEvidenceIngestionData();
    for (const item of data.registry.evidence_items) {
      assert.equal(item.authority_state, 'NON_AUTHORITATIVE_EVIDENCE');
    }
  });

  it('ingestion boundary is NON_AUTHORITATIVE', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.registry.ingestion_boundary, 'NON_AUTHORITATIVE');
  });

  it('summary confirms all_non_authoritative', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.registry.summary.all_non_authoritative, true);
  });

  it('view model preserves authority state', () => {
    const data = loadEvidenceIngestionData();
    const vm = buildEvidenceViewModel(data);
    for (const item of vm.items) {
      assert.equal(item.authority_state, 'NON_AUTHORITATIVE_EVIDENCE');
    }
    assert.equal(vm.ingestion_boundary, 'NON_AUTHORITATIVE');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. No Mutation — Governance Enforcement
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence governance — no mutation', () => {
  it('governance enforces no semantic mutation', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.registry.governance.no_semantic_mutation, true);
  });

  it('governance enforces no authority mutation', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.registry.governance.no_authority_mutation, true);
  });

  it('governance enforces no overlay generation', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.registry.governance.no_overlay_generation, true);
  });

  it('governance enforces ingestion only', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.registry.governance.ingestion_only, true);
  });

  it('governance enforces additive only', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.registry.governance.additive_only, true);
  });

  it('governance enforces fail closed', () => {
    const data = loadEvidenceIngestionData();
    assert.equal(data.registry.governance.fail_closed, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. PATH Safety — No PATH A/B Imports
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence ingestion PATH safety', () => {
  const componentFiles = [
    'EvidenceIngestionCorridorPanel.jsx',
    'EvidenceRegistryTable.jsx',
    'EvidenceProvenanceSummary.jsx',
    'EvidenceAuthorityBoundaryNotice.jsx',
  ];

  const libFiles = [
    'BlueEdgeEvidenceIngestionLoader.server.js',
    'BlueEdgeEvidenceViewModel.js',
  ];

  for (const file of componentFiles) {
    it(`${file} does not import PATH A modules`, () => {
      const content = fs.readFileSync(
        path.join(REPO_ROOT, 'app/execlens-demo/components/sqo-cockpit', file), 'utf8'
      );
      assert.ok(!content.includes('path-a/'), `${file} must not import PATH A`);
      assert.ok(!content.includes('PathA'), `${file} must not reference PathA`);
    });
  }

  for (const file of libFiles) {
    it(`${file} does not import PATH B modules`, () => {
      const dir = file.endsWith('.server.js') ? 'server' : 'client';
      const content = fs.readFileSync(
        path.join(REPO_ROOT, 'app/execlens-demo/lib/sqo-cockpit', dir, file), 'utf8'
      );
      assert.ok(!content.includes('path-b/'), `${file} must not import PATH B`);
      assert.ok(!content.includes('PathB'), `${file} must not reference PathB`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 9. No Browser-Side fs Import
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence ingestion server/client boundary', () => {
  const clientFiles = [
    'app/execlens-demo/components/sqo-cockpit/EvidenceIngestionCorridorPanel.jsx',
    'app/execlens-demo/components/sqo-cockpit/EvidenceRegistryTable.jsx',
    'app/execlens-demo/components/sqo-cockpit/EvidenceProvenanceSummary.jsx',
    'app/execlens-demo/components/sqo-cockpit/EvidenceAuthorityBoundaryNotice.jsx',
    'app/execlens-demo/lib/sqo-cockpit/client/BlueEdgeEvidenceViewModel.js',
  ];

  for (const file of clientFiles) {
    it(`${file} does not import fs`, () => {
      const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      assert.ok(!content.includes("require('fs')"), `${file} must not import fs`);
      assert.ok(!content.includes("require('node:fs')"), `${file} must not import node:fs`);
      assert.ok(!content.includes("from 'fs'"), `${file} must not import fs (ESM)`);
    });

    it(`${file} does not import path`, () => {
      const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      assert.ok(!content.includes("require('path')"), `${file} must not import path`);
      assert.ok(!content.includes("require('node:path')"), `${file} must not import node:path`);
    });

    it(`${file} does not import crypto`, () => {
      const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      assert.ok(!content.includes("require('crypto')"), `${file} must not import crypto`);
      assert.ok(!content.includes("require('node:crypto')"), `${file} must not import node:crypto`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 10. No LENS Coupling
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence ingestion has no LENS coupling', () => {
  const files = [
    'app/execlens-demo/components/sqo-cockpit/EvidenceIngestionCorridorPanel.jsx',
    'app/execlens-demo/components/sqo-cockpit/EvidenceRegistryTable.jsx',
    'app/execlens-demo/components/sqo-cockpit/EvidenceProvenanceSummary.jsx',
    'app/execlens-demo/components/sqo-cockpit/EvidenceAuthorityBoundaryNotice.jsx',
  ];

  for (const file of files) {
    it(`${file} does not import LENS components`, () => {
      const content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
      assert.ok(!content.includes('lens-v2/components'), `${file} must not import LENS components`);
      assert.ok(!content.includes('LensReport'), `${file} must not reference LensReport`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 11. Evidence Registry Artifact Integrity
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence registry artifact integrity', () => {
  it('evidence_registry.v1.json exists', () => {
    const regPath = path.join(
      REPO_ROOT,
      'artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/evidence-ingestion/evidence_registry.v1.json'
    );
    assert.ok(fs.existsSync(regPath), 'Registry artifact must exist');
  });

  it('registry is valid JSON', () => {
    const regPath = path.join(
      REPO_ROOT,
      'artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/evidence-ingestion/evidence_registry.v1.json'
    );
    const raw = fs.readFileSync(regPath, 'utf8');
    const parsed = JSON.parse(raw);
    assert.ok(parsed.schema_version);
    assert.ok(parsed.registry_id);
    assert.ok(parsed.evidence_items);
  });

  it('all source_paths point to existing files', () => {
    const data = loadEvidenceIngestionData();
    for (const item of data.registry.evidence_items) {
      const abs = path.resolve(REPO_ROOT, item.source_path);
      assert.ok(fs.existsSync(abs), `Source file for ${item.evidence_id} must exist: ${item.source_path}`);
    }
  });

  it('all source types are HTML evidence', () => {
    const data = loadEvidenceIngestionData();
    for (const item of data.registry.evidence_items) {
      assert.ok(item.source_type.startsWith('HTML_'), `${item.evidence_id} source_type must be HTML: ${item.source_type}`);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 12. Component File Existence
// ────────────────────────────────────────────────────────────────────────────

describe('Evidence ingestion component files exist', () => {
  const componentFiles = [
    'EvidenceIngestionCorridorPanel.jsx',
    'EvidenceRegistryTable.jsx',
    'EvidenceProvenanceSummary.jsx',
    'EvidenceAuthorityBoundaryNotice.jsx',
  ];

  for (const file of componentFiles) {
    it(`${file} exists`, () => {
      const fullPath = path.join(REPO_ROOT, 'app/execlens-demo/components/sqo-cockpit', file);
      assert.ok(fs.existsSync(fullPath), `${file} must exist`);
    });
  }

  it('page route file exists', () => {
    const pagePath = path.join(REPO_ROOT, 'app/execlens-demo/pages/sqo/client/[client]/run/[run]/evidence-ingestion.js');
    assert.ok(fs.existsSync(pagePath), 'evidence-ingestion.js page must exist');
  });

  it('server loader file exists', () => {
    const loaderPath = path.join(REPO_ROOT, 'app/execlens-demo/lib/sqo-cockpit/server/BlueEdgeEvidenceIngestionLoader.server.js');
    assert.ok(fs.existsSync(loaderPath), 'Server loader must exist');
  });

  it('client view model file exists', () => {
    const vmPath = path.join(REPO_ROOT, 'app/execlens-demo/lib/sqo-cockpit/client/BlueEdgeEvidenceViewModel.js');
    assert.ok(fs.existsSync(vmPath), 'View model must exist');
  });
});

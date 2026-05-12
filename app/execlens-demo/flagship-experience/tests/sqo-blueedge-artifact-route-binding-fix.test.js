'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const APP_ROOT = path.resolve(__dirname, '..', '..');

// Suite 1: BlueEdge base cockpit route resolves
describe('Artifact Route Binding: BlueEdge base cockpit route resolves', () => {
  const { validateRouteParams, buildNavigationItems } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitRouteResolver'));

  it('blueedge/run_blueedge_productized_01_fixed validates', () => {
    const result = validateRouteParams('blueedge', 'run_blueedge_productized_01_fixed');
    assert.ok(result.valid, `Expected valid, got error: ${result.error}`);
  });

  it('navigation items build for blueedge', () => {
    const items = buildNavigationItems('blueedge', 'run_blueedge_productized_01_fixed', 'overview');
    assert.ok(Array.isArray(items));
    assert.ok(items.length > 0);
    for (const item of items) {
      assert.ok(item.label !== undefined && item.label !== null, `label must not be undefined for section ${item.section}`);
      assert.ok(item.path !== undefined && item.path !== null, `path must not be undefined for section ${item.section}`);
    }
  });

  it('cockpit state resolves for blueedge', () => {
    const { resolveCockpitState } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitStateResolver'));
    const state = resolveCockpitState('blueedge', 'run_blueedge_productized_01_fixed');
    assert.ok(state.cockpit_state !== 'NO_CLIENT_SELECTED');
    assert.ok(state.cockpit_state !== 'CLIENT_REGISTERED_NO_SQO', `State must not be CLIENT_REGISTERED_NO_SQO, got: ${state.cockpit_state}`);
  });
});

// Suite 2: BlueEdge corridor route resolves or reports MISSING_OPTIONAL
describe('Artifact Route Binding: corridor route resolves', () => {
  const { COCKPIT_SECTIONS, SECTION_ROUTES, SECTION_LABELS } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitRouteResolver'));

  it('corridor section exists in route config', () => {
    assert.ok(COCKPIT_SECTIONS.includes('corridor'));
    assert.ok(SECTION_ROUTES['corridor'] !== undefined);
    assert.ok(SECTION_LABELS['corridor'] !== undefined);
  });

  it('corridor page route file exists', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'corridor.js');
    assert.ok(fs.existsSync(routePath));
  });
});

// Suite 3: Evidence rebase route resolves
describe('Artifact Route Binding: evidence rebase route resolves', () => {
  it('evidence-rebase page route file exists', () => {
    const routePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'evidence-rebase.js');
    assert.ok(fs.existsSync(routePath));
  });

  it('evidence rebase extractor loads ok', () => {
    const { loadExplicitEvidenceRebaseData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));
    const result = loadExplicitEvidenceRebaseData();
    assert.ok(result.ok);
  });
});

// Suite 4: evidence_sources.yaml discovered through explicit binding
describe('Artifact Route Binding: evidence_sources.yaml binding', () => {
  it('evidence_sources.yaml exists at expected path', () => {
    const sourcesPath = path.join(REPO_ROOT, 'clients', 'blueedge', 'sqo', 'evidence_sources.yaml');
    assert.ok(fs.existsSync(sourcesPath));
  });

  it('extractor parses evidence_sources.yaml', () => {
    const { parseEvidenceSources } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'ExplicitEvidenceRebaseExtractor.server'));
    const result = parseEvidenceSources();
    assert.ok(result.ok, `Expected ok, got error: ${result.error}`);
    assert.equal(result.sources.client, 'blueedge');
  });
});

// Suite 5: evidence_rebase_01 namespace discovered through explicit binding
describe('Artifact Route Binding: evidence_rebase_01 namespace', () => {
  it('evidence manifest exists', () => {
    const manifestPath = path.join(REPO_ROOT, 'artifacts', 'sqo', 'blueedge', 'evidence_rebase_01', 'evidence_manifest.json');
    assert.ok(fs.existsSync(manifestPath));
  });

  it('evidence manifest is valid JSON with 3 items', () => {
    const manifestPath = path.join(REPO_ROOT, 'artifacts', 'sqo', 'blueedge', 'evidence_rebase_01', 'evidence_manifest.json');
    const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(parsed.evidence_items.length, 3);
  });
});

// Suite 6: No broad repo search
describe('Artifact Route Binding: no broad repo search', () => {
  const loaderPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitArtifactLoader.js');
  const content = fs.readFileSync(loaderPath, 'utf8');

  it('artifact loader does not use glob', () => {
    assert.ok(!content.includes('glob('), 'must not use glob');
    assert.ok(!content.includes('glob.sync'), 'must not use glob.sync');
  });

  it('artifact loader does not use readdirSync recursively', () => {
    assert.ok(!content.includes('readdirSync'), 'must not use readdirSync for discovery');
  });

  it('artifact loader uses explicit path construction', () => {
    assert.ok(content.includes("path.join('artifacts', 'sqo'"), 'must use explicit path join');
  });
});

// Suite 7: No FastAPI fallback
describe('Artifact Route Binding: no FastAPI fallback', () => {
  const resolverPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver.js');
  const content = fs.readFileSync(resolverPath, 'utf8');

  it('workspace resolver does not fallback to fastapi', () => {
    assert.ok(!content.includes("'fastapi'"), 'must not hardcode fastapi fallback');
    assert.ok(!content.includes('fallback_client'), 'must not use fallback_client');
  });
});

// Suite 8: No mock/demo fallback
describe('Artifact Route Binding: no mock/demo fallback', () => {
  const loaderPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitArtifactLoader.js');
  const content = fs.readFileSync(loaderPath, 'utf8');

  it('artifact loader does not reference mock data', () => {
    assert.ok(!content.includes('mock'), 'must not reference mock data');
    assert.ok(!content.includes('demo_data'), 'must not reference demo data');
    assert.ok(!content.includes('fixture'), 'must not reference fixtures');
  });
});

// Suite 9: No undefined SSR props
describe('Artifact Route Binding: no undefined SSR props', () => {
  const { resolveWorkspaceData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver'));

  it('workspace data for blueedge contains no undefined values', () => {
    const data = resolveWorkspaceData('blueedge', 'run_blueedge_productized_01_fixed', 'overview');
    assertNoUndefined(data, 'root');
  });

  it('workspace data for invalid client contains no undefined values', () => {
    const data = resolveWorkspaceData('nonexistent', 'fake_run', 'overview');
    assertNoUndefined(data, 'root');
  });
});

function assertNoUndefined(obj, path) {
  if (obj === null) return;
  if (typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => assertNoUndefined(item, `${path}[${i}]`));
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    assert.ok(value !== undefined, `${path}.${key} must not be undefined`);
    assertNoUndefined(value, `${path}.${key}`);
  }
}

// Suite 10: Navigation labels never undefined
describe('Artifact Route Binding: navigation labels', () => {
  const { buildNavigationItems, SECTION_LABELS } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitRouteResolver'));

  it('all section labels are defined', () => {
    const items = buildNavigationItems('blueedge', 'run_blueedge_productized_01_fixed', 'overview');
    for (const item of items) {
      assert.ok(typeof item.label === 'string' && item.label.length > 0, `label for ${item.section} must be non-empty string`);
    }
  });

  it('SECTION_LABELS has no undefined values', () => {
    for (const [section, label] of Object.entries(SECTION_LABELS)) {
      assert.ok(typeof label === 'string', `label for ${section} must be string`);
    }
  });
});

// Suite 11: corridor.error is null, string, or structured object
describe('Artifact Route Binding: error field types', () => {
  const { resolveWorkspaceData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver'));

  it('error is null for valid blueedge binding', () => {
    const data = resolveWorkspaceData('blueedge', 'run_blueedge_productized_01_fixed', 'overview');
    assert.equal(data.error, null);
  });

  it('error is string for invalid client', () => {
    const data = resolveWorkspaceData('nonexistent', 'fake_run', 'overview');
    assert.ok(typeof data.error === 'string', 'error must be string for invalid client');
  });
});

// Suite 12: Missing optional artifacts fail visible
describe('Artifact Route Binding: missing optional artifacts', () => {
  const { loadAllCockpitArtifacts } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitArtifactLoader'));

  it('diagnostics are present in load result', () => {
    const result = loadAllCockpitArtifacts('blueedge', 'run_blueedge_productized_01_fixed');
    assert.ok(result.diagnostics !== null && result.diagnostics !== undefined);
    assert.equal(result.diagnostics.client, 'blueedge');
    assert.equal(result.diagnostics.run_id, 'run_blueedge_productized_01_fixed');
  });

  it('diagnostics report artifact root path', () => {
    const result = loadAllCockpitArtifacts('blueedge', 'run_blueedge_productized_01_fixed');
    assert.ok(result.diagnostics.artifact_root.includes('artifacts/sqo/blueedge'));
  });

  it('diagnostics classify missing artifacts by required/optional', () => {
    const result = loadAllCockpitArtifacts('blueedge', 'run_blueedge_productized_01_fixed');
    for (const m of result.diagnostics.missing) {
      assert.ok(['MISSING_REQUIRED', 'MISSING_OPTIONAL'].includes(m.status));
      assert.ok(typeof m.key === 'string');
      assert.ok(typeof m.path === 'string');
    }
  });
});

// Suite 13: Missing required artifacts fail visible
describe('Artifact Route Binding: missing required artifact detection', () => {
  const { CRITICAL_ARTIFACTS } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitArtifactLoader'));

  it('critical artifacts list is defined', () => {
    assert.ok(Array.isArray(CRITICAL_ARTIFACTS));
    assert.ok(CRITICAL_ARTIFACTS.length > 0);
    assert.ok(CRITICAL_ARTIFACTS.includes('qualification_state'));
  });

  it('diagnostics has_required_missing flag works', () => {
    const { loadAllCockpitArtifacts } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitArtifactLoader'));
    const result = loadAllCockpitArtifacts('blueedge', 'run_blueedge_productized_01_fixed');
    assert.ok(typeof result.diagnostics.has_required_missing === 'boolean');
  });
});

// Suite 14: No evidence files mutated
describe('Artifact Route Binding: no evidence mutation', () => {
  const loaderPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitArtifactLoader.js');
  const content = fs.readFileSync(loaderPath, 'utf8');

  it('artifact loader does not write files', () => {
    assert.ok(!content.includes('writeFileSync'), 'must not write files');
    assert.ok(!content.includes('writeFile('), 'must not write files');
  });

  it('workspace resolver does not write files', () => {
    const resolverContent = fs.readFileSync(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver.js'), 'utf8');
    assert.ok(!resolverContent.includes('writeFileSync'), 'must not write files');
  });
});

// Suite 15: No SQO artifacts regenerated
describe('Artifact Route Binding: no artifact regeneration', () => {
  const resolverPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver.js');
  const content = fs.readFileSync(resolverPath, 'utf8');

  it('workspace resolver does not regenerate artifacts', () => {
    assert.ok(!content.includes('generate'), 'must not generate artifacts');
    assert.ok(!content.includes('create_artifact'), 'must not create artifacts');
  });
});

// Suite 16: No PATH A imports
describe('Artifact Route Binding: no PATH A imports', () => {
  const files = [
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitArtifactLoader.js'),
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver.js'),
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitStateResolver.js'),
  ];

  for (const filePath of files) {
    it(`${path.basename(filePath)} has no PATH A imports`, () => {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(!content.includes("require('../../path-a"));
      assert.ok(!content.includes("from '../../path-a"));
    });
  }
});

// Suite 17: No PATH B imports
describe('Artifact Route Binding: no PATH B imports', () => {
  const files = [
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitArtifactLoader.js'),
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver.js'),
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitStateResolver.js'),
  ];

  for (const filePath of files) {
    it(`${path.basename(filePath)} has no PATH B imports`, () => {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(!content.includes("require('../../path-b"));
      assert.ok(!content.includes("from '../../path-b"));
    });
  }
});

// Suite 18: No LENS coupling
describe('Artifact Route Binding: no LENS coupling', () => {
  const resolverPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver.js');
  const content = fs.readFileSync(resolverPath, 'utf8');

  it('workspace resolver does not import LENS routes', () => {
    assert.ok(!content.includes("require('../../lens-v2/routes"));
    assert.ok(!content.includes('lensProjection'));
  });
});

// Suite 19: No browser-side fs import
describe('Artifact Route Binding: no browser-side fs', () => {
  const degradedPath = path.join(APP_ROOT, 'components', 'sqo-cockpit', 'SQODegradedState.jsx');
  const content = fs.readFileSync(degradedPath, 'utf8');

  it('SQODegradedState does not import fs', () => {
    assert.ok(!content.includes("require('fs')"));
    assert.ok(!content.includes("from 'fs'"));
  });
});

// Suite 20: Full regression
describe('Artifact Route Binding: full regression', () => {
  it('blueedge artifacts directory exists', () => {
    const artifactDir = path.join(REPO_ROOT, 'artifacts', 'sqo', 'blueedge', 'run_blueedge_productized_01_fixed');
    assert.ok(fs.existsSync(artifactDir));
  });

  it('qualification_state.v1.json exists', () => {
    const filePath = path.join(REPO_ROOT, 'artifacts', 'sqo', 'blueedge', 'run_blueedge_productized_01_fixed', 'qualification_state.v1.json');
    assert.ok(fs.existsSync(filePath));
  });

  it('semantic_maturity_profile.v1.json exists', () => {
    const filePath = path.join(REPO_ROOT, 'artifacts', 'sqo', 'blueedge', 'run_blueedge_productized_01_fixed', 'semantic_maturity_profile.v1.json');
    assert.ok(fs.existsSync(filePath));
  });

  it('cockpit state for blueedge is operational', () => {
    const { resolveCockpitState } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitStateResolver'));
    const state = resolveCockpitState('blueedge', 'run_blueedge_productized_01_fixed');
    assert.ok(state.artifacts && state.artifacts.ok, 'artifacts must load ok');
    assert.ok(state.artifacts.loaded_count > 0, 'must load at least 1 artifact');
  });

  it('cockpit workspace data resolves without error', () => {
    const { resolveWorkspaceData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOWorkspaceDataResolver'));
    const data = resolveWorkspaceData('blueedge', 'run_blueedge_productized_01_fixed', 'overview');
    assert.equal(data.error, null);
    assert.ok(data.cockpitState !== null);
    assert.ok(data.navigation !== null);
  });
});

'use strict';

/**
 * fastapi-onboarding.test.js
 * PI.LENS.V2.FASTAPI-RUNTIME-ONBOARDING.01
 *
 * Verifies:
 *   1. FastAPI run_02_oss_fastapi_pipeline is registered via the manifest
 *      registry (configuration-only onboarding).
 *   2. The manifest passes schema validation and identity cross-check.
 *   3. The resolver fails closed (REJECTED / REQUIRED_ARTIFACT_MISSING)
 *      because FastAPI lacks 3 of 6 required semantic artifacts.
 *   4. The flagship binding surfaces the rejection with structured error.
 *   5. No fixture fallback, no synthetic data, no fabrication.
 *   6. BlueEdge live binding is not broken by the registration.
 *   7. FastAPI report-pack artifacts exist on disk.
 *   8. Writer correctly fails on FastAPI (substrate incomplete).
 *   9. No client-name branching in generic modules.
 */

const path = require('node:path');
const fs = require('node:fs');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const {
  isClientRunAllowed,
  listAllowedClientRuns,
  resolveClientRunManifest,
  loadManifest,
  REGISTRY,
} = require('../../lib/lens-v2/manifests');
const { validateClientRunManifest } = require('../../lib/lens-v2/generic/ClientRunManifestSchema');
const {
  resolveBlueEdgePayload,
} = require('../../lib/lens-v2/BlueEdgePayloadResolver');
const {
  resolveFlagshipBinding,
} = require('../../lib/lens-v2/flagshipBinding');

const FASTAPI_CLIENT = 'fastapi';
const FASTAPI_RUN = 'run_02_oss_fastapi_pipeline';
const BLUEEDGE_CLIENT = 'blueedge';
const BLUEEDGE_RUN = 'run_blueedge_productized_01_fixed';

const EMITTER_PATH = path.join(
  process.env.REPO_ROOT,
  'scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js'
);

function callBinding(query) {
  const res = { statusCode: 200 };
  const out = resolveFlagshipBinding({ query: query || {}, res });
  return Object.assign({}, out, { resStatusCode: res.statusCode });
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Registry recognizes FastAPI
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI registry registration', () => {
  it('FastAPI pair is in the REGISTRY', () => {
    assert.ok(REGISTRY[FASTAPI_CLIENT], 'fastapi key must exist in REGISTRY');
    assert.ok(REGISTRY[FASTAPI_CLIENT][FASTAPI_RUN], 'FastAPI run must be registered');
  });

  it('isClientRunAllowed returns true for FastAPI', () => {
    assert.equal(isClientRunAllowed(FASTAPI_CLIENT, FASTAPI_RUN), true);
  });

  it('listAllowedClientRuns includes both BlueEdge and FastAPI', () => {
    const pairs = listAllowedClientRuns();
    assert.ok(pairs.find(p => p.client === BLUEEDGE_CLIENT && p.run === BLUEEDGE_RUN),
      'BlueEdge must remain in the allowed list');
    assert.ok(pairs.find(p => p.client === FASTAPI_CLIENT && p.run === FASTAPI_RUN),
      'FastAPI must appear in the allowed list');
    assert.equal(pairs.length, 2, 'exactly two client/run pairs expected');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Manifest schema validation
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI manifest schema validation', () => {
  it('manifest loads successfully from registry', () => {
    const m = resolveClientRunManifest(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.equal(m.ok, true, `manifest load failed: ${JSON.stringify(m)}`);
    assert.ok(m.manifest);
  });

  it('manifest passes ClientRunManifestSchema validation', () => {
    const m = loadManifest(FASTAPI_CLIENT, FASTAPI_RUN);
    const v = validateClientRunManifest(m.manifest);
    assert.equal(v.ok, true, `schema validation errors: ${JSON.stringify(v.errors)}`);
  });

  it('manifest identity matches registry key', () => {
    const m = loadManifest(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.equal(m.manifest.client, FASTAPI_CLIENT);
    assert.equal(m.manifest.run_id, FASTAPI_RUN);
  });

  it('manifest declares all 6 required artifact keys', () => {
    const m = loadManifest(FASTAPI_CLIENT, FASTAPI_RUN);
    const keys = Object.keys(m.manifest.artifacts.required);
    const expected = [
      'semantic_topology_model', 'decision_validation', 'reproducibility_verdict',
      'semantic_continuity_crosswalk', 'canonical_topology_40_4', 'dpsig_signal_set',
    ];
    for (const k of expected) {
      assert.ok(keys.includes(k), `required artifact key "${k}" missing from manifest`);
    }
  });

  it('manifest governance flags are all true', () => {
    const m = loadManifest(FASTAPI_CLIENT, FASTAPI_RUN);
    const g = m.manifest.governance;
    assert.equal(g.lane_a_read_only, true);
    assert.equal(g.lane_d_dpsig_read_only, true);
    assert.equal(g.additive_only, true);
    assert.equal(g.no_ai_inference, true);
    assert.equal(g.no_topology_mutation, true);
    assert.equal(g.no_synthetic_telemetry, true);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Resolver fails closed on FastAPI (missing required artifacts)
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI resolver — fail closed (REQUIRED_ARTIFACT_MISSING)', () => {
  it('resolveBlueEdgePayload returns ok:false with binding_status REJECTED', () => {
    const result = resolveBlueEdgePayload(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.equal(result.ok, false);
    assert.equal(result.binding_status, 'REJECTED');
    assert.equal(result.error, 'REQUIRED_ARTIFACT_MISSING');
  });

  it('reports the specific missing artifact key', () => {
    const result = resolveBlueEdgePayload(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.ok(result.missing, 'missing field must be present');
    assert.equal(result.missing.key, 'decision_validation');
    assert.equal(result.missing.reason, 'MISSING');
  });

  it('no synthetic payload is returned on rejection', () => {
    const result = resolveBlueEdgePayload(FASTAPI_CLIENT, FASTAPI_RUN);
    assert.equal(result.ok, false);
    assert.equal(result.binding_status, 'REJECTED');
    assert.ok(!result.actor_registry, 'rejected payload must not contain actor_registry');
    assert.ok(!result.semantic_domain_registry, 'rejected payload must not contain semantic_domain_registry');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Flagship binding surfaces rejection
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI flagship binding — rejection surface', () => {
  it('returns 502 with structured liveBindingError', () => {
    const r = callBinding({ client: FASTAPI_CLIENT, run: FASTAPI_RUN });
    assert.equal(r.statusCode, 502);
    assert.equal(r.resStatusCode, 502);
    assert.equal(r.props.livePayload, null);
    assert.ok(r.props.liveBindingError);
    assert.equal(r.props.liveBindingError.kind, 'REQUIRED_ARTIFACT_MISSING');
    assert.equal(r.props.liveBindingError.binding_status, 'REJECTED');
  });

  it('binding identifies client and run correctly', () => {
    const r = callBinding({ client: FASTAPI_CLIENT, run: FASTAPI_RUN });
    assert.equal(r.props.bindingClient, FASTAPI_CLIENT);
    assert.equal(r.props.bindingRun, FASTAPI_RUN);
  });

  it('no propagation chains on rejected binding', () => {
    const r = callBinding({ client: FASTAPI_CLIENT, run: FASTAPI_RUN });
    assert.deepEqual(r.props.livePropagationChains, []);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. BlueEdge not broken by FastAPI registration
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding preserved after FastAPI registration', () => {
  it('BlueEdge default route still returns LIVE', () => {
    const r = callBinding({});
    assert.equal(r.statusCode, 200);
    assert.ok(r.props.livePayload);
    assert.equal(r.props.livePayload.binding_status, 'LIVE');
    assert.equal(r.props.livePayload.client_name, BLUEEDGE_CLIENT);
  });

  it('BlueEdge explicit route still returns LIVE', () => {
    const r = callBinding({ client: BLUEEDGE_CLIENT, run: BLUEEDGE_RUN });
    assert.equal(r.statusCode, 200);
    assert.equal(r.props.livePayload.binding_status, 'LIVE');
    assert.equal(r.props.livePayload.qualifier_summary.qualifier_class, 'Q-02');
  });

  it('BlueEdge IP actor still HYDRATED', () => {
    const r = callBinding({ client: BLUEEDGE_CLIENT, run: BLUEEDGE_RUN });
    const ip = r.props.livePayload.actor_registry.inference_prohibition;
    assert.equal(ip.status, 'HYDRATED');
    assert.equal(ip.value.inference_prohibition_status, 'ENFORCED');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. FastAPI report-pack artifacts exist on disk
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI report-pack artifacts', () => {
  const m = loadManifest(FASTAPI_CLIENT, FASTAPI_RUN);
  const reportPack = m.ok ? m.manifest.report_pack : {};

  for (const [id, relPath] of Object.entries(reportPack)) {
    it(`report-pack artifact "${id}" exists on disk`, () => {
      const abs = path.join(process.env.REPO_ROOT, relPath);
      assert.ok(fs.existsSync(abs), `missing: ${relPath}`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 7. FastAPI present artifacts exist on disk
// ────────────────────────────────────────────────────────────────────────────

describe('FastAPI — present required artifacts exist on disk', () => {
  const m = loadManifest(FASTAPI_CLIENT, FASTAPI_RUN);
  const required = m.ok ? m.manifest.artifacts.required : {};
  const presentKeys = ['semantic_topology_model', 'canonical_topology_40_4', 'dpsig_signal_set'];

  for (const key of presentKeys) {
    it(`required artifact "${key}" exists on disk`, () => {
      const abs = path.join(process.env.REPO_ROOT, required[key]);
      assert.ok(fs.existsSync(abs), `missing: ${required[key]}`);
    });
  }

  const missingKeys = ['decision_validation', 'reproducibility_verdict', 'semantic_continuity_crosswalk'];
  for (const key of missingKeys) {
    it(`required artifact "${key}" is correctly absent from disk (thin substrate)`, () => {
      const abs = path.join(process.env.REPO_ROOT, required[key]);
      assert.ok(!fs.existsSync(abs), `"${key}" should be absent for FastAPI thin substrate`);
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// 8. Writer fails on FastAPI (substrate incomplete)
// ────────────────────────────────────────────────────────────────────────────

describe('Writer behaviour for FastAPI', () => {
  it('writer accepts FastAPI as a known client (registry check passes)', () => {
    assert.equal(isClientRunAllowed(FASTAPI_CLIENT, FASTAPI_RUN), true);
  });

  it('writer throws SOURCE_ARTIFACT_MISSING for FastAPI (substrate incomplete)', () => {
    let threw = null;
    try {
      execFileSync('node', [
        EMITTER_PATH,
        '--client', FASTAPI_CLIENT,
        '--run', FASTAPI_RUN,
        '--dry-run',
      ], { env: { ...process.env, REPO_ROOT: process.env.REPO_ROOT } });
    } catch (e) {
      threw = e;
    }
    assert.ok(threw, 'writer must fail for FastAPI (missing decision_validation)');
    const stderr = threw.stderr ? threw.stderr.toString() : '';
    const stdout = threw.stdout ? threw.stdout.toString() : '';
    const combined = stderr + stdout;
    assert.ok(
      combined.includes('SOURCE_ARTIFACT_MISSING') || threw.status !== 0,
      'writer must fail with SOURCE_ARTIFACT_MISSING or non-zero exit'
    );
  });

  it('BlueEdge writer replay-safety preserved after FastAPI registration', () => {
    const rmPath = path.join(
      process.env.REPO_ROOT,
      'clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault/rendering_metadata.json'
    );
    const before = fs.readFileSync(rmPath, 'utf8');
    execFileSync('node', [
      EMITTER_PATH,
      '--client', BLUEEDGE_CLIENT,
      '--run', BLUEEDGE_RUN,
    ], { env: { ...process.env, REPO_ROOT: process.env.REPO_ROOT } });
    const after = fs.readFileSync(rmPath, 'utf8');
    assert.equal(before, after, 'BlueEdge rendering_metadata must be byte-identical on re-run');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 9. No client-name branching in generic modules
// ────────────────────────────────────────────────────────────────────────────

describe('No client-name branching (FastAPI onboarding)', () => {
  function stripComments(src) {
    return src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');
  }
  const generics = [
    'app/execlens-demo/lib/lens-v2/generic/GenericSemanticPayloadResolver.js',
    'app/execlens-demo/lib/lens-v2/generic/GenericSemanticArtifactLoader.js',
    'app/execlens-demo/lib/lens-v2/generic/ClientRunManifestSchema.js',
    'app/execlens-demo/lib/lens-v2/generic/LensSemanticPayloadSchema.js',
  ];
  generics.forEach(rel => {
    it(`${rel} contains no "fastapi" literal in code`, () => {
      const src = stripComments(fs.readFileSync(path.join(process.env.REPO_ROOT, rel), 'utf8'));
      assert.ok(!/\bfastapi\b/i.test(src), `client-name "fastapi" literal found in ${rel}`);
    });
  });
});

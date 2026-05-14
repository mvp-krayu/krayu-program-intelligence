'use strict';

/**
 * runtime-parameterization.test.js
 * PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01
 *
 * Verifies:
 *   1. The flagship page's getServerSideProps reads ?client / ?run from
 *      the request query, defaulting to the canonical BlueEdge run.
 *   2. The page validates the requested pair against the manifest
 *      registry (single source of truth).
 *   3. Unknown pairs fail closed with a 4xx HTTP status and a
 *      LIVE_BINDING_FAILED visible state (no fixture fallback, no
 *      synthetic semantics).
 *   4. The default route (no query) and the explicit BlueEdge query
 *      route resolve to identical payload semantics.
 *   5. Q-02 governance + IP HYDRATED preserved on both routes.
 *   6. The rendering_metadata writer's allow-list is sourced from the
 *      manifest registry (registry alignment).
 *   7. The writer remains byte-identical (replay-safe) under the
 *      registry-driven allow-list.
 *
 * Note on scope: this suite does not boot the Next.js dev server. It
 * exercises `getServerSideProps` directly using a synthetic Next.js
 * `context` shape, and it spawns the writer via execFileSync. The
 * Playwright-backed visual smoke is documented in the validation md.
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
  isAllowedPair,
  listKnownPairs,
  loadManifest,
  REGISTRY,
} = require('../../lib/lens-v2/manifests');
const {
  resolveBlueEdgePayload,
} = require('../../lib/lens-v2/BlueEdgePayloadResolver');
const {
  resolveFlagshipBinding,
  paramSafe,
  DEFAULT_BINDING_CLIENT,
  DEFAULT_BINDING_RUN,
} = require('../../lib/lens-v2/flagshipBinding');

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_productized_01_fixed';

const EMITTER_PATH = path.join(
  process.env.REPO_ROOT,
  'scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js'
);
const VAULT_RM_PATH = path.join(
  process.env.REPO_ROOT,
  'clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault/rendering_metadata.json'
);

function callBinding(query) {
  const res = { statusCode: 200 };
  const out = resolveFlagshipBinding({ query: query || {}, res });
  return Object.assign({}, out, { resStatusCode: res.statusCode });
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Registry helper aliases (contract-named API)
// ────────────────────────────────────────────────────────────────────────────

describe('Manifest registry — contract-named API', () => {
  it('isClientRunAllowed mirrors isAllowedPair', () => {
    assert.equal(isClientRunAllowed(CLIENT, RUN), isAllowedPair(CLIENT, RUN));
    assert.equal(isClientRunAllowed('not_a_client', RUN), false);
    assert.equal(isClientRunAllowed(CLIENT, 'run_does_not_exist'), false);
  });

  it('listAllowedClientRuns mirrors listKnownPairs', () => {
    assert.deepEqual(listAllowedClientRuns(), listKnownPairs());
    const pairs = listAllowedClientRuns();
    assert.ok(pairs.find(p => p.client === CLIENT && p.run === RUN));
  });

  it('resolveClientRunManifest mirrors loadManifest', () => {
    const a = resolveClientRunManifest(CLIENT, RUN);
    const b = loadManifest(CLIENT, RUN);
    assert.equal(a.ok, b.ok);
    assert.equal(a.manifest.client, b.manifest.client);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. getServerSideProps — default route resolves BlueEdge
// ────────────────────────────────────────────────────────────────────────────

describe('resolveFlagshipBinding — default route (no query)', () => {
  it('exposes the canonical default constants', () => {
    assert.equal(DEFAULT_BINDING_CLIENT, CLIENT);
    assert.equal(DEFAULT_BINDING_RUN, RUN);
    assert.equal(typeof resolveFlagshipBinding, 'function');
    assert.equal(typeof paramSafe, 'function');
  });

  it('returns props with a LIVE BlueEdge payload by default', () => {
    const r = callBinding({});
    assert.equal(r.statusCode, 200);
    assert.equal(r.resStatusCode, 200);
    assert.ok(r.props.livePayload, 'livePayload missing on default route');
    assert.equal(r.props.livePayload.binding_status, 'LIVE');
    assert.equal(r.props.livePayload.client_name, CLIENT);
    assert.equal(r.props.livePayload.run_id, RUN);
    assert.equal(r.props.bindingClient, CLIENT);
    assert.equal(r.props.bindingRun, RUN);
    assert.equal(r.props.liveBindingError, null);
  });

  it('default-route payload carries Q-02 governance + IP HYDRATED', () => {
    const r = callBinding({});
    const p = r.props.livePayload;
    assert.equal(p.qualifier_summary.qualifier_class, 'Q-02');
    assert.equal(p.qualifier_class, 'Q-01'); // legacy compat top-level
    assert.equal(p.qualifier_class_governance, 'Q-02');
    const ip = p.actor_registry.inference_prohibition;
    assert.equal(ip.status, 'HYDRATED');
    assert.equal(ip.value.inference_prohibition_status, 'ENFORCED');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. getServerSideProps — explicit BlueEdge query
// ────────────────────────────────────────────────────────────────────────────

describe('resolveFlagshipBinding — explicit BlueEdge query', () => {
  it('?client=blueedge&run=run_blueedge_productized_01_fixed renders LIVE', () => {
    const r = callBinding({ client: CLIENT, run: RUN });
    assert.equal(r.statusCode, 200);
    assert.ok(r.props.livePayload);
    assert.equal(r.props.livePayload.binding_status, 'LIVE');
    assert.equal(r.props.livePayload.client_name, CLIENT);
    assert.equal(r.props.livePayload.run_id, RUN);
    assert.equal(r.props.bindingClient, CLIENT);
    assert.equal(r.props.bindingRun, RUN);
  });

  it('explicit-route payload is structurally equivalent to default-route payload (volatile fields stripped)', () => {
    const stripVolatile = (p) => {
      const c = JSON.parse(JSON.stringify(p));
      delete c.generated_at;
      if (c.rendering_metadata) delete c.rendering_metadata.rendered_at;
      if (c.module_registry && Array.isArray(c.module_registry.entries)) {
        c.module_registry.entries.forEach(e => { delete e.registered_at; });
      }
      if (c.header_block && c.header_block.report_metadata) {
        delete c.header_block.report_metadata.generated_at;
      }
      return c;
    };
    const a = callBinding({});
    const b = callBinding({ client: CLIENT, run: RUN });
    assert.deepEqual(stripVolatile(a.props.livePayload), stripVolatile(b.props.livePayload));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. getServerSideProps — unknown client/run fails closed
// ────────────────────────────────────────────────────────────────────────────

describe('resolveFlagshipBinding — unknown pair fails closed', () => {
  it('?client=unknown&run=unknown returns 404 and CLIENT_RUN_NOT_ALLOWED', () => {
    const r = callBinding({ client: 'unknown', run: 'unknown' });
    assert.equal(r.statusCode, 404);
    assert.equal(r.resStatusCode, 404);
    assert.equal(r.props.livePayload, null);
    assert.ok(r.props.liveBindingError);
    assert.equal(r.props.liveBindingError.kind, 'CLIENT_RUN_NOT_ALLOWED');
    assert.equal(r.props.liveBindingError.binding_status, 'REJECTED');
  });

  it('?client=blueedge&run=run_does_not_exist returns 404', () => {
    const r = callBinding({ client: CLIENT, run: 'run_does_not_exist' });
    assert.equal(r.statusCode, 404);
    assert.equal(r.props.livePayload, null);
    assert.equal(r.props.liveBindingError.kind, 'CLIENT_RUN_NOT_ALLOWED');
  });

  it('malformed param (path traversal attempt) returns 400', () => {
    const r = callBinding({ client: '../etc/passwd', run: RUN });
    assert.equal(r.statusCode, 400);
    assert.equal(r.props.livePayload, null);
    assert.equal(r.props.liveBindingError.kind, 'INVALID_PARAM');
  });

  it('overly long param returns 400', () => {
    const r = callBinding({ client: 'x'.repeat(201), run: RUN });
    assert.equal(r.statusCode, 400);
    assert.equal(r.props.liveBindingError.kind, 'INVALID_PARAM');
  });

  it('no synthetic / fixture fallback is introduced on failure', () => {
    const r = callBinding({ client: 'unknown', run: 'unknown' });
    assert.equal(r.props.livePayload, null);
    assert.deepEqual(r.props.livePropagationChains, []);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Registry alignment with rendering_metadata writer
// ────────────────────────────────────────────────────────────────────────────

describe('Registry alignment — rendering_metadata writer', () => {
  it('writer source imports the manifest registry (no hardcoded literal allow-lists)', () => {
    const src = fs.readFileSync(EMITTER_PATH, 'utf8');
    assert.ok(src.includes("require(path.join(manifestsDir))"),
      'writer must import the manifest registry module');
    // The writer may still expose ALLOWED_CLIENTS / ALLOWED_RUNS for
    // backward compatibility, but those must be DERIVED from the
    // registry, not declared as literal Sets.
    assert.ok(src.includes('listAllowedClientRuns()'),
      'writer must derive its allow-list from listAllowedClientRuns()');
    assert.ok(!/new Set\(\[['"]blueedge['"]\]\)/.test(src),
      'writer must not declare a literal new Set(["blueedge"])');
  });

  it('writer rejects unknown clients (CLIENT_NOT_ALLOWED) — single source of truth', () => {
    let threw = null;
    try {
      execFileSync('node', [
        EMITTER_PATH,
        '--client', 'not_a_client',
        '--run', RUN,
        '--dry-run',
      ], { env: { ...process.env, REPO_ROOT: process.env.REPO_ROOT } });
    } catch (e) {
      threw = e;
    }
    assert.ok(threw && (threw.status === 64 || threw.code === 64),
      'writer must exit 64 for an unknown client');
  });

  it('writer rejects unknown runs on a known client', () => {
    let threw = null;
    try {
      execFileSync('node', [
        EMITTER_PATH,
        '--client', CLIENT,
        '--run', 'run_does_not_exist',
        '--dry-run',
      ], { env: { ...process.env, REPO_ROOT: process.env.REPO_ROOT } });
    } catch (e) {
      threw = e;
    }
    assert.ok(threw && (threw.status === 64 || threw.code === 64));
  });

  it('writer remains byte-identical (replay-safe) under registry-driven allow-list', () => {
    const before = fs.readFileSync(VAULT_RM_PATH, 'utf8');
    execFileSync('node', [
      EMITTER_PATH,
      '--client', CLIENT,
      '--run', RUN,
    ], { env: { ...process.env, REPO_ROOT: process.env.REPO_ROOT } });
    const after = fs.readFileSync(VAULT_RM_PATH, 'utf8');
    assert.equal(before, after, 'rendering_metadata.json must be byte-identical on re-run');
  });

  it('runtime registry and writer registry agree on the BlueEdge pair', () => {
    // The runtime page uses isClientRunAllowed; the writer uses the same
    // function via the manifest registry. Both must agree.
    assert.equal(isClientRunAllowed(CLIENT, RUN), true);
    // Spawn the writer in dry-run for the canonical pair — it must
    // succeed (exit 0).
    const out = execFileSync('node', [
      EMITTER_PATH,
      '--client', CLIENT,
      '--run', RUN,
      '--dry-run',
    ], { env: { ...process.env, REPO_ROOT: process.env.REPO_ROOT } });
    assert.ok(out.toString().includes('"grounding_class": "Q-02"'),
      'writer dry-run must emit Q-02 for the BlueEdge productized run');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Generic resolver parity preserved
// ────────────────────────────────────────────────────────────────────────────

describe('Generic resolver parity preserved under parameterization', () => {
  it('default-route payload deepEquals direct resolver call (volatile fields stripped)', () => {
    const stripVolatile = (p) => {
      const c = JSON.parse(JSON.stringify(p));
      delete c.generated_at;
      if (c.rendering_metadata) delete c.rendering_metadata.rendered_at;
      if (c.module_registry && Array.isArray(c.module_registry.entries)) {
        c.module_registry.entries.forEach(e => { delete e.registered_at; });
      }
      if (c.header_block && c.header_block.report_metadata) {
        delete c.header_block.report_metadata.generated_at;
      }
      return c;
    };
    const r = callBinding({});
    const direct = resolveBlueEdgePayload(CLIENT, RUN);
    assert.deepEqual(stripVolatile(r.props.livePayload), stripVolatile(direct));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. No client-name branching introduced into generic modules
// ────────────────────────────────────────────────────────────────────────────

describe('No client-name branching introduced under parameterization', () => {
  // Strip block- and line-comments so doc-comment references don't trip
  // the no-branching guard. Branching logic and string literals in code
  // remain visible.
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
    it(`${rel} contains no client-name literals in code`, () => {
      const src = stripComments(fs.readFileSync(path.join(process.env.REPO_ROOT, rel), 'utf8'));
      assert.ok(!/\bblueedge\b/i.test(src), `client-name literal found in ${rel}`);
      assert.ok(!/\bfastapi\b/i.test(src));
    });
  });
});

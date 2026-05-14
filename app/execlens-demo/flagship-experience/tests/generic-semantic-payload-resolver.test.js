'use strict';

/**
 * generic-semantic-payload-resolver.test.js
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * Validates the productized, manifest-driven resolver and proves
 * end-to-end parity with the legacy BlueEdge wrapper:
 *
 *   - the manifest registry only allows declared (client, run) pairs
 *   - manifests validate against ClientRunManifestSchema
 *   - GenericSemanticArtifactLoader rejects traversal and fails closed
 *     on missing required artifacts
 *   - GenericSemanticPayloadResolver produces a payload that validates
 *     against LensSemanticPayloadSchema
 *   - the BlueEdge compatibility wrapper produces the SAME payload as a
 *     direct generic call (parity)
 *   - Q-02 governance + IP HYDRATED preserved
 *   - DPSIG provenance preserved
 *   - report pack ids unchanged
 *   - actor distribution unchanged
 *   - governance assertions unchanged
 *   - no client-name branching reachable from the generic module
 */

const path = require('node:path');
const fs = require('node:fs');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const {
  loadManifest, isAllowedPair, listKnownPairs, REGISTRY,
} = require('../../lib/lens-v2/manifests');
const {
  validateClientRunManifest,
} = require('../../lib/lens-v2/generic/ClientRunManifestSchema');
const {
  validateLensSemanticPayload,
} = require('../../lib/lens-v2/generic/LensSemanticPayloadSchema');
const {
  resolveSemanticPayload,
} = require('../../lib/lens-v2/generic/GenericSemanticPayloadResolver');
const {
  loadArtifacts,
} = require('../../lib/lens-v2/generic/GenericSemanticArtifactLoader');
const {
  resolveBlueEdgePayload,
} = require('../../lib/lens-v2/BlueEdgePayloadResolver');
const { adaptReport } = require('../../adapters/index');

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_productized_01_fixed';

// ────────────────────────────────────────────────────────────────────────────
// 1. Manifest registry — only declared pairs are allowed
// ────────────────────────────────────────────────────────────────────────────

describe('Manifest registry — allow-list', () => {
  it('isAllowedPair accepts the canonical BlueEdge pair', () => {
    assert.equal(isAllowedPair(CLIENT, RUN), true);
  });

  it('isAllowedPair rejects unknown clients', () => {
    assert.equal(isAllowedPair('not_a_client', RUN), false);
  });

  it('isAllowedPair rejects unknown runs on a known client', () => {
    assert.equal(isAllowedPair(CLIENT, 'run_does_not_exist'), false);
  });

  it('listKnownPairs includes the canonical BlueEdge pair', () => {
    const pairs = listKnownPairs();
    assert.ok(pairs.find(p => p.client === CLIENT && p.run === RUN));
  });

  it('REGISTRY only declares manifests under the manifests/ directory', () => {
    for (const c of Object.keys(REGISTRY)) {
      for (const [r, fname] of Object.entries(REGISTRY[c])) {
        assert.ok(/^[A-Za-z0-9_.\-]+\.json$/.test(fname), `manifest filename invalid: ${fname}`);
      }
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Manifest schema validation
// ────────────────────────────────────────────────────────────────────────────

describe('ClientRunManifestSchema — validation', () => {
  it('the BlueEdge manifest validates clean', () => {
    const m = loadManifest(CLIENT, RUN);
    assert.equal(m.ok, true, `manifest invalid: ${JSON.stringify(m.detail)}`);
    const v = validateClientRunManifest(m.manifest);
    assert.equal(v.ok, true, `errors: ${v.errors.join(', ')}`);
  });

  it('rejects manifests missing required artifact keys', () => {
    const m = loadManifest(CLIENT, RUN);
    const broken = JSON.parse(JSON.stringify(m.manifest));
    delete broken.artifacts.required.dpsig_signal_set;
    const v = validateClientRunManifest(broken);
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('ARTIFACT_REQUIRED_MISSING:dpsig_signal_set')));
  });

  it('rejects manifests with traversal in declared paths', () => {
    const m = loadManifest(CLIENT, RUN);
    const broken = JSON.parse(JSON.stringify(m.manifest));
    broken.artifacts.required.dpsig_signal_set = '../../../etc/passwd';
    const v = validateClientRunManifest(broken);
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('ARTIFACT_REQUIRED_PATH_INVALID:dpsig_signal_set')));
  });

  it('rejects manifests with absolute declared paths', () => {
    const m = loadManifest(CLIENT, RUN);
    const broken = JSON.parse(JSON.stringify(m.manifest));
    broken.artifacts.required.dpsig_signal_set = '/etc/passwd';
    const v = validateClientRunManifest(broken);
    assert.equal(v.ok, false);
  });

  it('rejects manifests with governance.lane_a_read_only=false', () => {
    const m = loadManifest(CLIENT, RUN);
    const broken = JSON.parse(JSON.stringify(m.manifest));
    broken.governance.lane_a_read_only = false;
    const v = validateClientRunManifest(broken);
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e === 'GOVERNANCE_LANE_A_NOT_READ_ONLY'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Loader — required-artifact contract + traversal safety
// ────────────────────────────────────────────────────────────────────────────

describe('GenericSemanticArtifactLoader — required-artifact contract', () => {
  it('loads all required artifacts for the BlueEdge manifest', () => {
    const m = loadManifest(CLIENT, RUN);
    const r = loadArtifacts(m.manifest);
    assert.equal(r.ok, true, `loader failed: ${JSON.stringify(r.missing)}`);
    ['semantic_topology_model', 'decision_validation', 'reproducibility_verdict',
     'semantic_continuity_crosswalk', 'canonical_topology_40_4', 'dpsig_signal_set']
      .forEach(k => {
        assert.ok(r.sources[k] && r.sources[k].ok, `required artifact missing: ${k}`);
      });
  });

  it('returns ok=false on a manifest with a missing required artifact', () => {
    const m = loadManifest(CLIENT, RUN);
    const broken = JSON.parse(JSON.stringify(m.manifest));
    broken.artifacts.required.dpsig_signal_set = 'artifacts/dpsig/blueedge/__nope__/dpsig_signal_set.json';
    const r = loadArtifacts(broken);
    assert.equal(r.ok, false);
    assert.equal(r.error, 'REQUIRED_ARTIFACT_MISSING');
    assert.equal(r.missing.key, 'dpsig_signal_set');
  });

  it('records optional missing artifacts as unresolved_gaps', () => {
    const m = loadManifest(CLIENT, RUN);
    const broken = JSON.parse(JSON.stringify(m.manifest));
    broken.artifacts.optional.signal_registry = 'clients/blueedge/__nope__/signal_registry.json';
    const r = loadArtifacts(broken);
    assert.equal(r.ok, true);
    assert.ok(r.unresolvedGaps.find(g => g.code === 'SIGNAL_REGISTRY' && g.impact === 'NON_BLOCKING'));
  });

  it('classifies missing rendering_metadata as INFERENCE_PROHIBITION_PLACEHOLDER', () => {
    const m = loadManifest(CLIENT, RUN);
    const broken = JSON.parse(JSON.stringify(m.manifest));
    broken.artifacts.optional.rendering_metadata = 'clients/blueedge/__nope__/rendering_metadata.json';
    const r = loadArtifacts(broken);
    assert.equal(r.ok, true);
    const ip = r.unresolvedGaps.find(g => g.code === 'IP_RENDERING_METADATA');
    assert.ok(ip);
    assert.equal(ip.impact, 'INFERENCE_PROHIBITION_PLACEHOLDER');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Generic resolver — payload contract + schema validation
// ────────────────────────────────────────────────────────────────────────────

describe('GenericSemanticPayloadResolver — canonical payload contract', () => {
  const m = loadManifest(CLIENT, RUN);
  const payload = resolveSemanticPayload(m.manifest);

  it('emits payload_version 1.0', () => {
    assert.equal(payload.payload_version, '1.0');
  });

  it('payload validates against LensSemanticPayloadSchema', () => {
    const v = validateLensSemanticPayload(payload);
    assert.equal(v.ok, true, `errors: ${v.errors.join(', ')}`);
  });

  it('binding_status is LIVE for the canonical run', () => {
    assert.equal(payload.binding_status, 'LIVE');
  });

  it('exposes all 15 canonical actors', () => {
    const codes = Object.values(payload.actor_registry).map(a => a.code).sort();
    assert.equal(codes.length, 15);
    assert.deepEqual(codes, ['AL','CB','CC','DP','ET','IP','PA','PP','RA','RB','RE','SB','SO','SS','ST']);
  });

  it('IP actor is HYDRATED with ENFORCED inference prohibition', () => {
    const ip = payload.actor_registry.inference_prohibition;
    assert.equal(ip.status, 'HYDRATED');
    assert.equal(ip.value.inference_prohibition_status, 'ENFORCED');
  });

  it('qualifier governance class is Q-02; legacy compat is Q-01', () => {
    assert.equal(payload.qualifier_summary.qualifier_class, 'Q-02');
    assert.equal(payload.qualifier_summary.qualifier_class_compat, 'Q-01');
    assert.equal(payload.qualifier_class, 'Q-01');
    assert.equal(payload.qualifier_class_governance, 'Q-02');
  });

  it('DPSIG provenance preserved', () => {
    assert.ok(payload.dpsig_signal_summary);
    assert.ok(payload.dpsig_signal_summary.provenance_chain);
    assert.equal(payload.dpsig_signal_summary.client_id, CLIENT);
    assert.equal(payload.dpsig_signal_summary.run_id, RUN);
  });

  it('report_pack carries the four canonical artifact ids', () => {
    const ids = (payload.report_pack.artifacts || []).map(a => a.id).sort();
    assert.deepEqual(ids, ['decision-surface', 'tier1-evidence', 'tier1-narrative', 'tier2-diagnostic']);
  });

  it('governance_assertions all true', () => {
    const ga = payload.governance_assertions;
    ['evidence_first','no_source_mutation','no_synthetic_telemetry','no_ai_generation','topology_native','replay_safe']
      .forEach(k => assert.equal(ga[k], true, `governance.${k} must be true`));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. BlueEdge wrapper parity — wrapper output ≡ generic output
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge wrapper parity with generic resolver', () => {
  const m = loadManifest(CLIENT, RUN);
  const direct = resolveSemanticPayload(m.manifest);
  const viaWrapper = resolveBlueEdgePayload(CLIENT, RUN);

  function stripVolatile(p) {
    const c = JSON.parse(JSON.stringify(p));
    // generated_at / rendered_at change between calls; strip for diff.
    delete c.generated_at;
    if (c.rendering_metadata) delete c.rendering_metadata.rendered_at;
    if (c.module_registry && Array.isArray(c.module_registry.entries)) {
      c.module_registry.entries.forEach(e => { delete e.registered_at; });
    }
    if (c.header_block && c.header_block.report_metadata) {
      delete c.header_block.report_metadata.generated_at;
    }
    return c;
  }

  it('wrapper succeeds with binding LIVE', () => {
    assert.equal(viaWrapper.ok, true);
    assert.equal(viaWrapper.binding_status, 'LIVE');
  });

  it('wrapper output structurally matches the direct generic output', () => {
    const a = stripVolatile(direct);
    const b = stripVolatile(viaWrapper);
    assert.deepEqual(a, b);
  });

  it('parity checks: client / run_id / baseline / qualifier / IP / actor distribution', () => {
    assert.equal(viaWrapper.client, CLIENT);
    assert.equal(viaWrapper.run_id, RUN);
    assert.equal(viaWrapper.baseline_commit, '93098cb');
    assert.equal(viaWrapper.qualifier_summary.qualifier_class, 'Q-02');
    assert.equal(viaWrapper.actor_registry.inference_prohibition.status, 'HYDRATED');
    const counts = Object.values(viaWrapper.actor_registry).reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1; return acc;
    }, {});
    assert.equal(counts.HYDRATED, 12);
    assert.equal(counts.HYDRATED_WITH_DERIVATION, 2);
    assert.equal(counts.PRESENTATION_LAYER_DERIVED, 1);
  });

  it('wrapper rejects unknown client with binding REJECTED', () => {
    const r = resolveBlueEdgePayload('not_a_client', RUN);
    assert.equal(r.ok, false);
    assert.equal(r.binding_status, 'REJECTED');
    assert.equal(r.error, 'CLIENT_NOT_ALLOWED');
  });

  it('wrapper rejects unknown run with binding REJECTED', () => {
    const r = resolveBlueEdgePayload(CLIENT, 'run_does_not_exist');
    assert.equal(r.ok, false);
    assert.equal(r.binding_status, 'REJECTED');
    assert.equal(r.error, 'RUN_NOT_ALLOWED');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Adapter pipeline parity — render state preserved
// ────────────────────────────────────────────────────────────────────────────

describe('Adapter pipeline parity', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);
  const adapted = adaptReport(payload, 'EXECUTIVE', 2);

  it('renderState is EXECUTIVE_READY_WITH_QUALIFIER', () => {
    assert.equal(adapted.renderState, 'EXECUTIVE_READY_WITH_QUALIFIER');
  });

  it('warnings list is empty', () => {
    assert.ok(Array.isArray(adapted.warnings));
    assert.equal(adapted.warnings.length, 0);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. No client-name branching reachable from generic module surface
// ────────────────────────────────────────────────────────────────────────────

describe('Productization invariants', () => {
  it('generic resolver source contains no hard-coded client names', () => {
    const src = fs.readFileSync(
      path.join(process.env.REPO_ROOT, 'app/execlens-demo/lib/lens-v2/generic/GenericSemanticPayloadResolver.js'),
      'utf8'
    );
    assert.ok(!/\bblueedge\b/i.test(src),
      'GenericSemanticPayloadResolver.js must not reference client names directly');
    assert.ok(!/\bfastapi\b/i.test(src));
  });

  it('generic loader source contains no hard-coded client names', () => {
    const src = fs.readFileSync(
      path.join(process.env.REPO_ROOT, 'app/execlens-demo/lib/lens-v2/generic/GenericSemanticArtifactLoader.js'),
      'utf8'
    );
    assert.ok(!/\bblueedge\b/i.test(src));
    assert.ok(!/\bfastapi\b/i.test(src));
  });

  it('manifest schema source contains no hard-coded client names', () => {
    const src = fs.readFileSync(
      path.join(process.env.REPO_ROOT, 'app/execlens-demo/lib/lens-v2/generic/ClientRunManifestSchema.js'),
      'utf8'
    );
    assert.ok(!/\bblueedge\b/i.test(src));
    assert.ok(!/\bfastapi\b/i.test(src));
  });
});

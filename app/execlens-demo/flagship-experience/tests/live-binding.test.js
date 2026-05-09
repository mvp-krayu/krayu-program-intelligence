'use strict';

/**
 * live-binding.test.js
 * PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
 *
 * Verifies the live BlueEdge productized substrate hydration:
 *   - resolver returns ok=true with binding_status=LIVE for the allowed pair
 *   - allowed_clients / allowed_runs gating rejects unknown pairs
 *   - all required source artifacts resolve; non-blocking gaps are surfaced
 *   - actor registry hydrates 15 actors with the expected status distribution
 *   - DPSIG TAXONOMY-01 fields and provenance chain are preserved
 *   - adapter pipeline yields EXECUTIVE_READY_WITH_QUALIFIER (Q-01) with no warnings
 *   - 7-panel explainability bundle is present
 *   - governance invariants remain true under live binding
 *
 * Runs against the canonical run:
 *   client = blueedge
 *   run    = run_blueedge_productized_01_fixed
 */

const path = require('node:path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const {
  resolveBlueEdgePayload,
  validateClientRun,
  buildPaths,
} = require('../../lib/lens-v2/BlueEdgePayloadResolver');
const { adaptReport } = require('../../adapters/index');
const { orchestrateFlagshipExperience } = require('../flagshipOrchestration');

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_productized_01_fixed';

const REQUIRED_ARTIFACTS = [
  'semantic_topology_model',
  'decision_validation',
  'reproducibility_verdict',
  'semantic_continuity_crosswalk',
  'canonical_topology_40_4',
  'dpsig_signal_set',
];

const EXPECTED_ACTOR_CODES = [
  'AL', 'CB', 'CC', 'DP', 'ET',
  'IP', 'PA', 'PP', 'RA', 'RB',
  'RE', 'SB', 'SO', 'SS', 'ST',
];

// ────────────────────────────────────────────────────────────────────────────
// 1. Authority gating — allowed_clients / allowed_runs
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding — authority gating', () => {
  it('validateClientRun accepts the canonical pair', () => {
    const v = validateClientRun(CLIENT, RUN);
    assert.equal(v.ok, true);
  });

  it('validateClientRun rejects unknown client', () => {
    const v = validateClientRun('not_a_client', RUN);
    assert.equal(v.ok, false);
    assert.equal(v.error, 'CLIENT_NOT_ALLOWED');
  });

  it('validateClientRun rejects unknown run on a known client', () => {
    const v = validateClientRun(CLIENT, 'run_does_not_exist');
    assert.equal(v.ok, false);
    assert.equal(v.error, 'RUN_NOT_ALLOWED');
  });

  it('buildPaths returns absolute paths anchored under REPO_ROOT', () => {
    const paths = buildPaths(CLIENT, RUN);
    assert.equal(typeof paths, 'object');
    const flat = JSON.stringify(paths);
    assert.ok(flat.includes('clients/blueedge/psee/runs/run_blueedge_productized_01_fixed'));
    assert.ok(flat.includes('artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed/dpsig_signal_set.json'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Resolver — produces a live, ok=true payload
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding — resolver payload', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);

  it('returns ok=true', () => {
    assert.equal(payload.ok, true);
  });

  it('binding_status is LIVE', () => {
    assert.equal(payload.binding_status, 'LIVE');
  });

  it('client_name and run_id reflect the canonical run', () => {
    assert.equal(payload.client_name, CLIENT);
    assert.equal(payload.run_id, RUN);
  });

  it('readiness_state is EXECUTIVE_READY_WITH_QUALIFIER', () => {
    assert.equal(payload.readiness_state, 'EXECUTIVE_READY_WITH_QUALIFIER');
  });

  it('readiness_summary records score, band, posture and validation totals', () => {
    const r = payload.readiness_summary;
    assert.ok(r);
    assert.equal(typeof r.score, 'number');
    assert.equal(r.band, 'CONDITIONAL');
    assert.equal(r.posture, 'INVESTIGATE');
    assert.equal(r.render_state, 'EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(r.decision_validation_passed, r.decision_validation_total);
  });

  it('topology_summary reports 17 domains with 4 backed and 12 semantic-only', () => {
    const t = payload.topology_summary;
    assert.ok(t);
    assert.equal(t.semantic_domain_count, 17);
    assert.equal(t.structurally_backed_count, 4);
    assert.equal(t.semantic_only_count, 12);
  });

  it('qualifier class is Q-01 with derived_qualifier_class Q-02', () => {
    const q = payload.qualifier_summary;
    assert.ok(q);
    assert.equal(q.qualifier_class, 'Q-01');
    assert.equal(q.derived_qualifier_class, 'Q-02');
  });

  it('governance_verdict is PASS', () => {
    assert.equal(payload.governance_verdict, 'PASS');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Required-artifact contract — all required reads must resolve
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding — required source artifacts', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);
  const sa = payload.source_artifacts || {};

  REQUIRED_ARTIFACTS.forEach(id => {
    it(`required artifact resolves: ${id}`, () => {
      assert.ok(sa[id], `source_artifacts.${id} missing`);
      assert.equal(sa[id].ok, true, `source_artifacts.${id}.ok must be true (path=${sa[id].path})`);
    });
  });

  it('canonical_topology_40_4 exposes its hash', () => {
    assert.ok(sa.canonical_topology_40_4);
    assert.equal(typeof sa.canonical_topology_40_4.hash, 'string');
    assert.ok(sa.canonical_topology_40_4.hash.length >= 16);
  });

  it('IP_RENDERING_METADATA is exposed as a known unresolved gap', () => {
    const gaps = payload.unresolved_gaps || [];
    const ip = gaps.find(g => g.code === 'IP_RENDERING_METADATA');
    assert.ok(ip, 'IP_RENDERING_METADATA gap must be visible on the payload');
  });

  it('non-blocking gaps are surfaced (structural_topology_log_40_3, vault_readiness)', () => {
    const gaps = payload.unresolved_gaps || [];
    const codes = new Set(gaps.map(g => g.code));
    assert.ok(codes.has('STRUCTURAL_TOPOLOGY_LOG_40_3'));
    assert.ok(codes.has('VAULT_READINESS'));
    gaps.forEach(g => {
      if (g.code !== 'IP_RENDERING_METADATA') {
        assert.equal(g.impact, 'NON_BLOCKING',
          `gap ${g.code} must be NON_BLOCKING; got ${g.impact}`);
      }
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Actor registry — 15 LENS V2 semantic actors hydrated
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding — actor registry', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);
  const registry = payload.actor_registry || {};
  const actors = Object.values(registry);

  it('actor_registry holds exactly 15 entries', () => {
    assert.equal(actors.length, 15);
  });

  it('all 15 expected actor codes are present', () => {
    const codes = actors.map(a => a && a.code).filter(Boolean).sort();
    assert.deepEqual(codes, [...EXPECTED_ACTOR_CODES].sort());
  });

  it('every actor has code, name and status', () => {
    actors.forEach(a => {
      assert.ok(a.code, 'code missing');
      assert.ok(a.name, `name missing for ${a.code}`);
      assert.ok(a.status, `status missing for ${a.code}`);
    });
  });

  it('status distribution matches the productized run', () => {
    const counts = actors.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});
    assert.equal(counts.HYDRATED, 11, `HYDRATED count off: ${JSON.stringify(counts)}`);
    assert.equal(counts.HYDRATED_WITH_DERIVATION, 2);
    assert.equal(counts.PLACEHOLDER_BINDING_PENDING, 1);
    assert.equal(counts.PRESENTATION_LAYER_DERIVED, 1);
  });

  it('IP actor is exposed as PLACEHOLDER_BINDING_PENDING (binding gap)', () => {
    const ip = actors.find(a => a.code === 'IP');
    assert.ok(ip);
    assert.equal(ip.status, 'PLACEHOLDER_BINDING_PENDING');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. DPSIG provenance — TAXONOMY-01 fields preserved on each signal
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding — DPSIG provenance', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);
  const dpsig = payload.dpsig_signal_summary || {};

  it('dpsig_signal_summary is ok=true and identifies the canonical run', () => {
    assert.equal(dpsig.ok, true);
    assert.equal(dpsig.client_id, CLIENT);
    assert.equal(dpsig.run_id, RUN);
  });

  it('canonical_topology_hash is recorded under derivation_context', () => {
    const ctx = dpsig.derivation_context || {};
    assert.equal(typeof ctx.canonical_topology_hash, 'string');
    assert.ok(ctx.canonical_topology_hash.length >= 16);
  });

  it('top-level provenance chain references DPSIG and canonical baseline', () => {
    const pc = dpsig.provenance_chain || {};
    assert.ok(pc.stream && pc.stream.includes('DPSIG-RUNTIME-NORMALIZATION'));
    assert.ok(pc.baseline_commit, 'provenance_chain.baseline_commit missing');
  });

  it('signals array carries TAXONOMY-01 fields and a derivation_trace per entry', () => {
    const signals = dpsig.signals || [];
    assert.ok(signals.length > 0, 'no DPSIG signals projected');
    signals.forEach((s, i) => {
      assert.ok(s.signal_id, `signals[${i}].signal_id missing`);
      assert.equal(s.replay_class, 'TAXONOMY-01',
        `signals[${i}].replay_class must be TAXONOMY-01`);
      assert.ok(s.denominator_guard, `signals[${i}].denominator_guard missing`);
      assert.ok(s.derivation_trace, `signals[${i}].derivation_trace missing`);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Adapter pipeline — render state, blocked reason, warnings
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding — adapter pipeline', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);
  const adapted = adaptReport(payload, 'EXECUTIVE', 2);

  it('renderState is EXECUTIVE_READY_WITH_QUALIFIER', () => {
    assert.equal(adapted.renderState, 'EXECUTIVE_READY_WITH_QUALIFIER');
  });

  it('blockedReason is absent (null/undefined)', () => {
    assert.ok(adapted.blockedReason === null || adapted.blockedReason === undefined,
      `blockedReason expected null/undefined; got ${adapted.blockedReason}`);
  });

  it('warnings list is empty', () => {
    assert.ok(Array.isArray(adapted.warnings));
    assert.equal(adapted.warnings.length, 0,
      `unexpected warnings: ${JSON.stringify(adapted.warnings)}`);
  });

  it('explainability bundle declares the 7 governance panels', () => {
    const ex = payload.explainability_bundle;
    assert.ok(ex);
    [
      'why_panel', 'evidence_panel', 'trace_panel', 'qualifiers_panel',
      'lineage_panel', 'confidence_panel', 'readiness_state_panel',
    ].forEach(k => {
      assert.ok(ex[k], `explainability panel missing: ${k}`);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 7. Orchestration parity — flagship orchestrator accepts live payload
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding — orchestration parity', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);

  it('orchestrateFlagshipExperience accepts the live payload', () => {
    const result = orchestrateFlagshipExperience(payload, 'EXECUTIVE', 'EXECUTIVE_DENSE', false, 'SUMMARY');
    assert.equal(result.renderState, 'EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(result.gravityToken, 'gravity-qualifier');
    assert.equal(result.presenceToken, 'presence-qualified-authority');
  });

  it('governance invariants remain true under live binding', () => {
    const result = orchestrateFlagshipExperience(payload, 'EXECUTIVE', 'EXECUTIVE_DENSE');
    const required = [
      'topology_always_read_only', 'qualifier_never_suppressed',
      'blocked_state_never_softened', 'diagnostic_state_never_softened',
      'evidence_references_always_preserved', 'no_ai_calls',
      'no_prompt_surfaces', 'no_chatbot_ux', 'no_animated_propagation',
      'no_topology_mutation', 'no_semantic_mutation',
    ];
    required.forEach(key => {
      assert.equal(result.governance[key], true, `governance.${key} must be true under live binding`);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 8. JSON serialization — Next.js getServerSideProps requires JSON-safe props
// ────────────────────────────────────────────────────────────────────────────

describe('BlueEdge live binding — JSON serialization', () => {
  it('full payload is JSON-serializable', () => {
    const payload = resolveBlueEdgePayload(CLIENT, RUN);
    assert.doesNotThrow(() => JSON.stringify(payload));
  });
});

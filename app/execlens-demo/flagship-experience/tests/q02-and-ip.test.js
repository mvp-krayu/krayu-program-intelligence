'use strict';

/**
 * q02-and-ip.test.js
 * PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01
 *
 * Validation suite for the Q-02 governance amendment and the
 * rendering_metadata vault artifact + IP actor hydration:
 *
 *   - QClassResolver implements the four-class model from
 *     docs/governance/Q02_GOVERNANCE_AMENDMENT.md
 *   - QClassResolver rejects probabilistic / AI-confidence semantics
 *     (the resolver is purely deterministic; no probability inputs)
 *   - rendering_metadata.json validates against the schema
 *   - rendering_metadata emission is replay-safe (byte-identical re-run)
 *   - resolver consumes rendering_metadata and hydrates IP actor
 *   - IP actor transitions PLACEHOLDER_BINDING_PENDING → HYDRATED
 *   - qualifier transitions: legacy adapter compat preserved
 *   - live surface (via flagshipOrchestration) accepts the upgraded
 *     payload without regression
 */

const path = require('node:path');
const fs = require('node:fs');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const {
  resolveQClass,
  legacyToGovernance,
  governanceToLegacy,
  Q_CLASSES,
} = require('../../lib/lens-v2/QClassResolver');
const {
  buildRenderingMetadata,
  validateRenderingMetadata,
} = require('../../lib/lens-v2/RenderingMetadataSchema');
const {
  resolveBlueEdgePayload,
} = require('../../lib/lens-v2/BlueEdgePayloadResolver');
const { adaptReport } = require('../../adapters/index');
const { orchestrateFlagshipExperience } = require('../flagshipOrchestration');

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_productized_01_fixed';

const RENDERING_METADATA_PATH = path.join(
  process.env.REPO_ROOT,
  'clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault/rendering_metadata.json'
);

const EMITTER_PATH = path.join(
  process.env.REPO_ROOT,
  'scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js'
);

// ────────────────────────────────────────────────────────────────────────────
// 1. QClassResolver — four-class model
// ────────────────────────────────────────────────────────────────────────────

describe('QClassResolver — four-class governance model', () => {
  it('full grounding (ratio == 1.0) → Q-01', () => {
    const r = resolveQClass({
      backed_count: 17, total_count: 17,
      semantic_continuity_status: 'VALIDATED',
      evidence_availability: 'AVAILABLE',
    });
    assert.equal(r.qualifier_class, 'Q-01');
    assert.equal(r.semantic_projection_class, 'FULL_GROUNDING');
    assert.equal(r.render_chip, false);
    assert.equal(r.compat_legacy_class, 'Q-00');
  });

  it('partial grounding with semantic continuity (0 < ratio < 1.0) → Q-02', () => {
    const r = resolveQClass({
      backed_count: 4, total_count: 17,
      semantic_continuity_status: 'VALIDATED',
      evidence_availability: 'AVAILABLE',
    });
    assert.equal(r.qualifier_class, 'Q-02');
    assert.equal(r.semantic_projection_class, 'PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY');
    assert.equal(r.render_chip, true);
    assert.equal(r.compat_legacy_class, 'Q-01');
  });

  it('zero structural backing with semantic continuity → Q-03', () => {
    const r = resolveQClass({
      backed_count: 0, total_count: 17,
      semantic_continuity_status: 'VALIDATED',
      evidence_availability: 'AVAILABLE',
    });
    assert.equal(r.qualifier_class, 'Q-03');
    assert.equal(r.semantic_projection_class, 'SEMANTIC_ONLY');
    assert.equal(r.render_chip, true);
    assert.equal(r.compat_legacy_class, 'Q-02');
  });

  it('evidence absent → Q-04 (regardless of ratio)', () => {
    const r = resolveQClass({
      backed_count: 4, total_count: 17,
      semantic_continuity_status: 'VALIDATED',
      evidence_availability: 'ABSENT',
    });
    assert.equal(r.qualifier_class, 'Q-04');
    assert.equal(r.render_absence_notice, true);
    assert.equal(r.render_chip, false);
  });

  it('total_count == 0 → Q-04 (no evidence)', () => {
    const r = resolveQClass({
      backed_count: 0, total_count: 0,
      semantic_continuity_status: 'VALIDATED',
      evidence_availability: 'AVAILABLE',
    });
    assert.equal(r.qualifier_class, 'Q-04');
  });

  it('partial grounding without semantic continuity collapses to Q-03 (not Q-02)', () => {
    const r = resolveQClass({
      backed_count: 4, total_count: 17,
      semantic_continuity_status: 'ABSENT',
      evidence_availability: 'AVAILABLE',
    });
    assert.equal(r.qualifier_class, 'Q-03');
  });

  it('determinism: same inputs produce identical outputs across calls', () => {
    const a = resolveQClass({ backed_count: 4, total_count: 17, semantic_continuity_status: 'VALIDATED', evidence_availability: 'AVAILABLE' });
    const b = resolveQClass({ backed_count: 4, total_count: 17, semantic_continuity_status: 'VALIDATED', evidence_availability: 'AVAILABLE' });
    assert.deepEqual(a, b);
  });

  it('every Q-class entry exposes governance metadata (no AI/probabilistic semantics)', () => {
    Object.values(Q_CLASSES).forEach(meta => {
      assert.ok(meta.id);
      assert.ok(meta.name);
      assert.ok(meta.executive_label);
      // Hard prohibition: no probabilistic / AI wording in canonical labels.
      const blob = JSON.stringify(meta).toLowerCase();
      ['probabilistic', 'ai confidence', 'medium confidence', 'estimated likelihood'].forEach(forbidden => {
        assert.ok(!blob.includes(forbidden),
          `forbidden language "${forbidden}" present in Q-class meta: ${JSON.stringify(meta)}`);
      });
    });
  });

  it('compat translations are bidirectional for the canonical classes', () => {
    assert.equal(governanceToLegacy('Q-01'), 'Q-00');
    assert.equal(governanceToLegacy('Q-02'), 'Q-01');
    assert.equal(governanceToLegacy('Q-04'), 'Q-04');
    assert.equal(legacyToGovernance('Q-00'), 'Q-01');
    assert.equal(legacyToGovernance('Q-01'), 'Q-02');
    assert.equal(legacyToGovernance('Q-04'), 'Q-04');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2. RenderingMetadataSchema — validator + builder
// ────────────────────────────────────────────────────────────────────────────

describe('RenderingMetadataSchema — validator', () => {
  function baselineDoc() {
    return buildRenderingMetadata({
      client_id: CLIENT,
      run_id: RUN,
      generated_at: '2026-05-08T07:27:57.944209+00:00',
      grounding_class: 'Q-02',
      semantic_projection_class: 'PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY',
      inference_prohibition_status: 'ENFORCED',
      semantic_continuity_status: 'VALIDATED',
      derivation_inputs: { backed_count: 4, total_count: 17, semantic_continuity_status: 'VALIDATED', evidence_availability: 'AVAILABLE', grounding_ratio: 4/17 },
      unresolved_semantic_gaps: [{ code: 'X', reason: 'r', impact: 'ADVISORY_REQUIRED' }],
      disclosure_requirements: ['Display Q-class with mandated language'],
      actor_projection_status: {
        DP: 'HYDRATED', CB: 'HYDRATED_WITH_DERIVATION', PA: 'HYDRATED', PP: 'HYDRATED',
        AL: 'HYDRATED', RE: 'HYDRATED', ST: 'HYDRATED', SB: 'HYDRATED',
        SO: 'HYDRATED', CC: 'HYDRATED', SS: 'HYDRATED', ET: 'HYDRATED',
        RB: 'HYDRATED_WITH_DERIVATION', IP: 'HYDRATED', RA: 'PRESENTATION_LAYER_DERIVED',
      },
    });
  }

  it('accepts a baseline well-formed document', () => {
    const v = validateRenderingMetadata(baselineDoc());
    assert.equal(v.ok, true, `errors: ${v.errors.join(', ')}`);
  });

  it('rejects probabilistic / unknown grounding_class', () => {
    const doc = baselineDoc();
    doc.grounding_class = 'Q-99';
    const v = validateRenderingMetadata(doc);
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('INVALID_GROUNDING_CLASS')));
  });

  it('rejects replay_safe=false', () => {
    const doc = baselineDoc();
    doc.replay_safe = false;
    const v = validateRenderingMetadata(doc);
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('REPLAY_SAFE_MUST_BE_TRUE')));
  });

  it('rejects topology_safe=false', () => {
    const doc = baselineDoc();
    doc.topology_safe = false;
    const v = validateRenderingMetadata(doc);
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('TOPOLOGY_SAFE_MUST_BE_TRUE')));
  });

  it('rejects no_ai_inference=false', () => {
    const doc = baselineDoc();
    doc.governance_assertions.no_ai_inference = false;
    const v = validateRenderingMetadata(doc);
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('GOVERNANCE_ASSERTION_FALSE:no_ai_inference')));
  });

  it('rejects fewer than 15 actors', () => {
    const doc = baselineDoc();
    delete doc.actor_projection_status.IP;
    const v = validateRenderingMetadata(doc);
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('ACTOR_PROJECTION_STATUS_COUNT_NOT_15')));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Vault writer — replay-safe emission
// ────────────────────────────────────────────────────────────────────────────

describe('rendering_metadata vault writer — replay-safe emission', () => {
  it('the vault artifact exists for the BlueEdge productized run', () => {
    assert.ok(fs.existsSync(RENDERING_METADATA_PATH),
      `expected vault artifact at ${RENDERING_METADATA_PATH}`);
  });

  it('the vault artifact validates against the schema', () => {
    const doc = JSON.parse(fs.readFileSync(RENDERING_METADATA_PATH, 'utf8'));
    const v = validateRenderingMetadata(doc);
    assert.equal(v.ok, true, `errors: ${v.errors.join(', ')}`);
    assert.equal(doc.grounding_class, 'Q-02');
    assert.equal(doc.semantic_projection_class, 'PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY');
    assert.equal(doc.inference_prohibition_status, 'ENFORCED');
    assert.equal(doc.replay_safe, true);
    assert.equal(doc.topology_safe, true);
  });

  it('re-running the writer produces a byte-identical artifact', () => {
    const before = fs.readFileSync(RENDERING_METADATA_PATH, 'utf8');
    execFileSync('node', [
      EMITTER_PATH,
      '--client', CLIENT,
      '--run', RUN,
    ], { env: { ...process.env, REPO_ROOT: process.env.REPO_ROOT } });
    const after = fs.readFileSync(RENDERING_METADATA_PATH, 'utf8');
    assert.equal(before, after, 'vault artifact must be byte-identical on re-run');
  });

  it('the writer rejects unknown clients (CLIENT_NOT_ALLOWED)', () => {
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
    assert.ok(threw, 'writer must exit non-zero for unknown client');
    assert.ok(threw.status === 64 || threw.code === 64);
  });

  it('the writer rejects unknown runs on a known client', () => {
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
    assert.ok(threw);
    assert.ok(threw.status === 64 || threw.code === 64);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 4. Live payload — Q-02 active + IP hydrated
// ────────────────────────────────────────────────────────────────────────────

describe('Live payload — Q-02 active + IP hydrated', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);

  it('payload is ok and binding is LIVE', () => {
    assert.equal(payload.ok, true);
    assert.equal(payload.binding_status, 'LIVE');
  });

  it('qualifier_summary.qualifier_class is Q-02 (governance)', () => {
    assert.equal(payload.qualifier_summary.qualifier_class, 'Q-02');
    assert.equal(payload.qualifier_summary.semantic_projection_class,
      'PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY');
    assert.equal(payload.qualifier_summary.qualifier_class_compat, 'Q-01');
  });

  it('qualifier_summary records the resolution rule id and inputs', () => {
    assert.equal(payload.qualifier_summary.derivation_rule_id, 'Q02-RES-RULE-01');
    assert.equal(payload.qualifier_summary.amendment_anchor,
      'docs/governance/Q02_GOVERNANCE_AMENDMENT.md');
    assert.ok(payload.qualifier_summary.derivation_inputs);
    assert.equal(payload.qualifier_summary.derivation_inputs.backed_count, 4);
    assert.equal(payload.qualifier_summary.derivation_inputs.total_count, 17);
  });

  it('top-level qualifier_class carries the LEGACY compat (Q-01) for adapter pipeline', () => {
    assert.equal(payload.qualifier_class, 'Q-01');
    assert.equal(payload.qualifier_class_governance, 'Q-02');
  });

  it('IP actor is HYDRATED with INFERENCE_PROHIBITION_STATUS=ENFORCED', () => {
    const ip = payload.actor_registry && payload.actor_registry.inference_prohibition;
    assert.ok(ip);
    assert.equal(ip.status, 'HYDRATED');
    assert.equal(ip.value.inference_prohibition_status, 'ENFORCED');
    assert.equal(ip.value.grounding_class, 'Q-02');
    assert.equal(ip.value.semantic_continuity_status, 'VALIDATED');
    assert.ok(Array.isArray(ip.value.disclosure_requirements));
    assert.ok(ip.value.disclosure_requirements.length >= 1);
  });

  it('IP_RENDERING_METADATA is no longer in unresolved_gaps', () => {
    const gaps = payload.unresolved_gaps || [];
    const ip = gaps.find(g => g.code === 'IP_RENDERING_METADATA');
    assert.ok(!ip, 'IP_RENDERING_METADATA gap must be resolved once vault artifact is present');
  });

  it('source_artifacts.rendering_metadata is ok=true and valid=true', () => {
    const sa = payload.source_artifacts && payload.source_artifacts.rendering_metadata;
    assert.ok(sa);
    assert.equal(sa.ok, true);
    assert.equal(sa.valid, true);
    assert.ok(typeof sa.hash === 'string' && sa.hash.startsWith('sha256:'));
  });

  it('rendering_metadata fixture-compat block declares INFERENCE_PROHIBITION_ENFORCED', () => {
    const rm = payload.rendering_metadata;
    assert.ok(rm);
    assert.equal(rm.binding_status, 'INFERENCE_PROHIBITION_ENFORCED');
    assert.ok(rm.rendering_metadata_live);
    assert.equal(rm.rendering_metadata_live.grounding_class, 'Q-02');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 5. Disclosure / forbidden language
// ────────────────────────────────────────────────────────────────────────────

describe('Disclosure correctness — no probabilistic / AI-confidence wording in user-facing prose', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);

  // The forbidden-language guard scopes to user-visible prose only.
  // Meta-policy text inside rendering_metadata.disclosure_requirements
  // (which enumerates the forbidden terms) is intentionally excluded.
  const userFacing = JSON.stringify({
    narrative_block: payload.narrative_block,
    header_block: payload.header_block,
    qualifier_summary_label: payload.qualifier_summary && payload.qualifier_summary.qualifier_label,
    qualifier_summary_note: payload.qualifier_summary && payload.qualifier_summary.qualifier_note,
    evidence_blocks: payload.evidence_blocks,
    trace_block: payload.trace_block,
  }).toLowerCase();

  ['probabilistic', 'ai confidence', 'medium confidence', 'estimated likelihood', 'model thinks']
    .forEach(forbidden => {
      it(`user-facing prose does not contain forbidden language: "${forbidden}"`, () => {
        assert.ok(!userFacing.includes(forbidden),
          `forbidden language "${forbidden}" found in user-facing prose`);
      });
    });

  it('qualifier_summary.qualifier_label uses contract-mandated executive register', () => {
    assert.equal(payload.qualifier_summary.qualifier_label,
      'Partial Grounding · Structural Continuity');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 6. Orchestration parity — adapter pipeline still passes
// ────────────────────────────────────────────────────────────────────────────

describe('Orchestration parity under Q-02 governance', () => {
  const payload = resolveBlueEdgePayload(CLIENT, RUN);
  const adapted = adaptReport(payload, 'EXECUTIVE', 2);

  it('adapter pipeline returns EXECUTIVE_READY_WITH_QUALIFIER with no warnings', () => {
    assert.equal(adapted.renderState, 'EXECUTIVE_READY_WITH_QUALIFIER');
    assert.ok(adapted.warnings && adapted.warnings.length === 0);
    assert.ok(adapted.blockedReason === null || adapted.blockedReason === undefined);
  });

  it('flagshipOrchestration accepts the upgraded payload', () => {
    const r = orchestrateFlagshipExperience(payload, 'EXECUTIVE', 'EXECUTIVE_DENSE', false, 'SUMMARY');
    assert.equal(r.renderState, 'EXECUTIVE_READY_WITH_QUALIFIER');
    assert.equal(r.gravityToken, 'gravity-qualifier');
    assert.equal(r.presenceToken, 'presence-qualified-authority');
    Object.entries(r.governance).forEach(([k, v]) => {
      assert.equal(v, true, `governance.${k} must remain true under Q-02 binding`);
    });
  });
});

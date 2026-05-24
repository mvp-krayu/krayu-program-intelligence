'use strict';

/**
 * balanced-projection-stress.test.js
 *
 * BALANCED Projection Object Stress Matrix
 *
 * Category A: Current governed projection proof (genesis_e2e_03)
 * Category B: Legacy compatibility (productized, fastapi, netbox, stackstorm)
 * Category C: Synthetic edge cases (compiler contract validation)
 */

const path = require('node:path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { resolveSemanticPayload } = require('../../lib/lens-v2/generic/GenericSemanticPayloadResolver');
const { compileBalancedProjection } = require('../../lib/lens-v2/generic/BalancedProjectionCompiler');
const { REGISTRY, loadManifest } = require('../../lib/lens-v2/manifests');

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function resolveRun(client, run) {
  const m = loadManifest(client, run);
  if (!m.ok) return { ok: false, error: m.error };
  const result = resolveSemanticPayload(m.manifest);
  if (!result || result.binding_status === 'REJECTED') return { ok: false, error: result && result.error };
  return { ok: true, payload: result };
}

function assertBalancedSchema(bp) {
  assert.ok(bp, 'balanced_projection must exist');
  assert.equal(bp.persona, 'BALANCED');
  assert.equal(bp.altitude, 'INVESTIGATIVE');
  assert.ok(bp.projection_id, 'must have projection_id');
  assert.ok(bp.generated_at, 'must have generated_at');
  assert.ok(bp.schema_version, 'must have schema_version');

  // 12 sections
  assert.ok('qualification_timeline' in bp, 'must have qualification_timeline');
  assert.ok('signal_family_explanation' in bp, 'must have signal_family_explanation');
  assert.ok('pressure_zone_distribution' in bp, 'must have pressure_zone_distribution');
  assert.ok('governance_friction' in bp, 'must have governance_friction');
  assert.ok('enrichment_corrections' in bp, 'must have enrichment_corrections');
  assert.ok('constitutional_anchor_dimensions' in bp, 'must have constitutional_anchor_dimensions');
  assert.ok('convergence_observations' in bp, 'must have convergence_observations');
  assert.ok('chronicle_navigation' in bp, 'must have chronicle_navigation');
  assert.ok('revalidation_detail' in bp, 'must have revalidation_detail');
  assert.ok('guided_query_seeds' in bp, 'must have guided_query_seeds');
  assert.ok('domain_coverage_extended' in bp, 'must have domain_coverage_extended');
  assert.ok('authority_declaration' in bp, 'must have authority_declaration');
}

function assertGovernedBalanced(bp) {
  assertBalancedSchema(bp);
  const qt = bp.qualification_timeline;
  assert.equal(qt.available, true);
  assert.equal(qt.governed, true);
  assert.ok(['S1', 'S2', 'S3'].includes(qt.s_level), `s_level must be S1-S3, got: ${qt.s_level}`);
  assert.ok(qt.timeline_narrative, 'must have timeline_narrative');
  assert.ok(qt.transitions.length > 0, 'must have at least one transition');

  assert.equal(bp.governance_friction.available, true);
  assert.ok(bp.governance_friction.proposition_review, 'must have proposition_review');
  assert.ok(bp.governance_friction.friction_summary, 'must have friction_summary');

  const ad = bp.authority_declaration;
  assert.equal(ad.interpretive_authority, '75.x');
  assert.equal(ad.authority_ceiling, 'L3');
  assert.equal(ad.evidence_traced, true);
  assert.equal(ad.prohibitions_enforced, 13);
  assert.equal(ad.structural_derivation_primary, true);
  assert.ok(ad.governance_contract.startsWith('BALANCED_'));
}

function assertLegacyBalanced(bp) {
  assertBalancedSchema(bp);
  assert.equal(bp.qualification_timeline.available, false);
  assert.equal(bp.qualification_timeline.governed, false);
  assert.equal(bp.governance_friction.available, false);
  assert.equal(bp.enrichment_corrections.available, false);
  assert.equal(bp.constitutional_anchor_dimensions.available, false);
  assert.equal(bp.convergence_observations.available, false);
  assert.equal(bp.chronicle_navigation.available, false);
  assert.equal(bp.revalidation_detail.available, false);
}

// ────────────────────────────────────────────────────────────────────────────
// CATEGORY A: Current governed projection proof
// ────────────────────────────────────────────────────────────────────────────

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_genesis_e2e_03';

describe('CATEGORY A — Current governed BALANCED proof', () => {
  it('resolves and compiles', () => {
    const r = resolveRun(CLIENT, RUN);
    assert.ok(r.ok);
    const bp = compileBalancedProjection(r.payload);
    assertGovernedBalanced(bp);
  });

  it('qualification_timeline has correct S2 transitions', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const qt = bp.qualification_timeline;
    assert.equal(qt.s_level, 'S2');
    assert.equal(qt.transition_count, 2);
    assert.equal(qt.transitions[0].from, 'S0');
    assert.equal(qt.transitions[0].to, 'S1');
    assert.equal(qt.transitions[1].from, 'S1');
    assert.equal(qt.transitions[1].to, 'S2');
    assert.ok(qt.transitions[0].governance_gates_cleared.length > 0);
    assert.ok(qt.transitions[1].governance_gates_cleared.length > 0);
  });

  it('signal_family_explanation has family explanations', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const sfe = bp.signal_family_explanation;
    assert.ok(sfe.available);
    assert.ok(sfe.families.length > 0);
    for (const fam of sfe.families) {
      assert.ok(fam.family_explanation, `${fam.family} must have family_explanation`);
      assert.ok(fam.family_explanation.length > 20, 'explanation must be substantive');
    }
  });

  it('signal activation_context populated for activated signals', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    for (const fam of bp.signal_family_explanation.families) {
      for (const sig of fam.signals) {
        if (sig.severity !== 'NOMINAL') {
          assert.ok(sig.activation_context, `${sig.signal_id} must have activation_context`);
          assert.ok(sig.activation_context.what_triggered);
          assert.ok(sig.activation_context.what_it_means);
        }
      }
    }
  });

  it('governance_friction has full decomposition', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const gf = bp.governance_friction;
    assert.ok(gf.available);
    const pr = gf.proposition_review;
    assert.equal(pr.total, 85);
    assert.equal(pr.accepted, 81);
    assert.equal(pr.rejected, 3);
    assert.equal(pr.arbitrated, 1);
    assert.ok(Object.keys(pr.class_distribution).length > 0, 'must have class_distribution');
    assert.ok(Object.keys(pr.tier_distribution).length > 0, 'must have tier_distribution');
    assert.ok(pr.friction_narrative.includes('rejected'));
  });

  it('enrichment_corrections reflects specimen data', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const ec = bp.enrichment_corrections;
    assert.ok(ec.available);
    assert.equal(ec.domains_corrected, 12);
    assert.ok(ec.correction_narrative.includes('12'));
    assert.ok(ec.mean_confidence_post > 0);
  });

  it('constitutional_anchor_dimensions has per-dimension breakdown', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const cad = bp.constitutional_anchor_dimensions;
    assert.ok(cad.available);
    assert.equal(cad.dimension_count, 8);
    assert.equal(cad.advancement_blocked, false);
    assert.ok(cad.dimensions.length === 8);
    for (const d of cad.dimensions) {
      assert.ok(d.dimension_id);
      assert.ok(d.verdict);
      assert.ok(d.verdict_label);
    }
    assert.ok(cad.anchor_narrative.includes('8'));
  });

  it('convergence_observations has correct specimen pair', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const co = bp.convergence_observations;
    assert.ok(co.available);
    assert.equal(co.observation_maturity, 'DESCRIPTIVE');
    assert.equal(co.total_observations, 9);
    assert.ok(co.convergences.length > 0);
    assert.ok(co.divergences.length > 0);
    assert.ok(co.specimens.includes('netbox'));
    assert.ok(co.specimens.includes('blueedge'));
    assert.ok(co.convergence_narrative.includes('2 specimens'));
  });

  it('chronicle_navigation is CERTIFIED with semantic phases', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const cn = bp.chronicle_navigation;
    assert.ok(cn.available);
    assert.equal(cn.certification_status, 'CERTIFIED');
    assert.equal(cn.passed, 62);
    assert.equal(cn.total_checks, 62);
    assert.equal(cn.descent_available, true);
    assert.ok(cn.phase_summary.length > 0);
    assert.equal(cn.phase_summary[0].phase_label, 'EMERGENCE');
  });

  it('revalidation_detail has per-phase data', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const rd = bp.revalidation_detail;
    assert.ok(rd.available);
    assert.equal(rd.status, 'PASS');
    assert.equal(rd.passed, 25);
    assert.equal(rd.total_checks, 25);
    assert.ok(rd.phases.length > 0);
  });

  it('guided_query_seeds grounded in available sections', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const gqs = bp.guided_query_seeds;
    assert.ok(gqs.available);
    assert.ok(gqs.queries.length >= 5);
    for (const q of gqs.queries) {
      assert.ok(q.query_id);
      assert.ok(q.query_text);
      assert.ok(q.grounding);
      assert.ok(['DENSE', 'INVESTIGATION'].includes(q.depth_target));
    }
  });

  it('domain_coverage_extended includes proposition coverage', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const dce = bp.domain_coverage_extended;
    assert.ok(dce.available);
    assert.equal(dce.total_domains, 17);
    assert.ok(dce.proposition_coverage);
    assert.ok(dce.proposition_coverage.mean_confidence > 0);
    assert.ok(dce.coverage_narrative.includes('17'));
    assert.ok(dce.coverage_narrative.includes('85'));
  });

  it('no semantic leakage from other clients', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    const otherClients = Object.keys(REGISTRY).filter(c => c !== CLIENT);
    const json = JSON.stringify(bp.qualification_timeline)
      + JSON.stringify(bp.governance_friction)
      + JSON.stringify(bp.enrichment_corrections);
    for (const oc of otherClients) {
      assert.ok(!json.includes(`"${oc}"`),
        `must not contain references to ${oc} in governed fields`);
    }
  });

  it('altitude is INVESTIGATIVE not EXECUTIVE', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBalancedProjection(r.payload);
    assert.equal(bp.altitude, 'INVESTIGATIVE');
    assert.notEqual(bp.altitude, 'EXECUTIVE');
    assert.ok(bp.authority_declaration.governance_contract.includes('BALANCED'));
    assert.ok(!bp.authority_declaration.governance_contract.includes('BOARDROOM'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// CATEGORY B: Legacy compatibility
// ────────────────────────────────────────────────────────────────────────────

describe('CATEGORY B — Legacy BALANCED compatibility', () => {
  const LEGACY_RUNS = [
    { client: 'blueedge', run: 'run_blueedge_productized_01_fixed', label: 'BlueEdge productized' },
    { client: 'fastapi', run: 'run_02_oss_fastapi_pipeline', label: 'FastAPI pipeline' },
    { client: 'netbox', run: 'run_github_netbox_20260520_134600', label: 'NetBox' },
    { client: 'stackstorm', run: 'run_github_st2_20260520_131000', label: 'StackStorm' },
  ];

  for (const { client, run, label } of LEGACY_RUNS) {
    describe(`${label} (${client}/${run})`, () => {
      it('resolves and compiles without crash', () => {
        const r = resolveRun(client, run);
        assert.ok(r.ok, `${label} resolution failed: ${r.error}`);
        const bp = compileBalancedProjection(r.payload);
        assertBalancedSchema(bp);
      });

      it('governed journey sections unavailable for legacy', () => {
        const r = resolveRun(client, run);
        if (!r.ok) return;
        const bp = compileBalancedProjection(r.payload);
        assertLegacyBalanced(bp);
      });

      it('signal and coverage still available', () => {
        const r = resolveRun(client, run);
        if (!r.ok) return;
        const bp = compileBalancedProjection(r.payload);
        assert.ok(bp.signal_family_explanation.available || bp.signal_family_explanation.total_signals === 0);
        assert.ok('total_domains' in bp.domain_coverage_extended);
      });

      it('no cross-client contamination', () => {
        const r = resolveRun(client, run);
        if (!r.ok) return;
        const bp = compileBalancedProjection(r.payload);
        const otherClients = Object.keys(REGISTRY).filter(c => c !== client);
        const json = JSON.stringify(bp.qualification_timeline) + JSON.stringify(bp.governance_friction);
        for (const oc of otherClients) {
          assert.ok(!json.includes(`"${oc}"`));
        }
      });
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// CATEGORY C: Synthetic edge cases
// ────────────────────────────────────────────────────────────────────────────

function syntheticPayload(overrides = {}) {
  return {
    client: 'synthetic',
    run_id: 'synthetic_test',
    readiness_summary: { posture: 'INVESTIGATE', score: 40 },
    topology_summary: { semantic_domain_count: 5, structurally_backed_count: 3, semantic_only_count: 2, cluster_count: 12 },
    signal_interpretations: [],
    propagation_summary: {},
    evidence_blocks: [],
    governance_lifecycle: null,
    governed_narrative: null,
    proposition_corpus: null,
    enrichment_intelligence: null,
    revalidation_intelligence: null,
    constitutional_anchor: null,
    convergence_intelligence: null,
    chronicle_certification: null,
    semantic_domain_registry: [],
    semantic_cluster_registry: [],
    semantic_topology_edges: [],
    ...overrides,
  };
}

function syntheticGoverned(sLevel, overrides = {}) {
  return syntheticPayload({
    governance_lifecycle: {
      available: true,
      s_level: sLevel,
      transition_count: sLevel === 'S0' ? 0 : sLevel === 'S1' ? 2 : 10,
      transitions: sLevel !== 'S0' ? [{ from: 'S0', to: 'S1', timestamp: '2026-01-01T00:00:00Z', actor: 'operator:test', mechanism: 'Revalidation PASS. 20 propositions accepted.' }] : [],
      qualification_provenance: `Test provenance for ${sLevel}`,
      authority_ceiling: 'L3',
    },
    ...overrides,
  });
}

describe('CATEGORY C — Synthetic BALANCED edge cases', () => {

  describe('S0 — pre-governed', () => {
    it('S0 produces legacy balanced (S0 excluded from governed)', () => {
      const bp = compileBalancedProjection(syntheticGoverned('S0'));
      assertBalancedSchema(bp);
      assertLegacyBalanced(bp);
    });
  });

  describe('S1 — governed without enrichment/convergence', () => {
    it('compiles with governance sections available', () => {
      const bp = compileBalancedProjection(syntheticGoverned('S1', {
        proposition_corpus: {
          available: true,
          total: 20,
          disposition_counts: { accepted: 18, rejected: 1, arbitrated: 1 },
          governance_friction_rate: 0.1,
          by_class: { DOMAIN_EVIDENCE_GROUNDING: 10, CAPABILITY_EVIDENCE: 10 },
          by_tier: { DIRECT_EVIDENCE: 15, DERIVED: 5 },
          review_status: 'COMPLETE',
        },
        revalidation_intelligence: {
          available: true,
          status: 'PASS',
          total_checks: 20,
          passed: 20,
          failed: 0,
          phase_count: 6,
          phases: [],
        },
      }));
      assertBalancedSchema(bp);
      assert.equal(bp.qualification_timeline.available, true);
      assert.equal(bp.qualification_timeline.s_level, 'S1');
      assert.equal(bp.governance_friction.available, true);
      assert.equal(bp.governance_friction.proposition_review.total, 20);
      assert.equal(bp.revalidation_detail.available, true);
      // No enrichment, convergence, chronicle
      assert.equal(bp.enrichment_corrections.available, false);
      assert.equal(bp.convergence_observations.available, false);
      assert.equal(bp.chronicle_navigation.available, false);
    });

    it('guided queries exclude unavailable sections', () => {
      const bp = compileBalancedProjection(syntheticGoverned('S1'));
      const grounded = bp.guided_query_seeds.queries.map(q => q.grounding);
      assert.ok(!grounded.includes('enrichment_corrections'));
      assert.ok(!grounded.includes('convergence_observations'));
      assert.ok(!grounded.includes('chronicle_navigation'));
    });
  });

  describe('S2 with full artifacts', () => {
    it('all 12 sections available', () => {
      const bp = compileBalancedProjection(syntheticGoverned('S2', {
        proposition_corpus: { available: true, total: 80, disposition_counts: { accepted: 70, rejected: 5, arbitrated: 5 }, governance_friction_rate: 0.125, by_class: { A: 40, B: 40 }, by_tier: { DIRECT_EVIDENCE: 60, DERIVED: 20 }, review_status: 'COMPLETE', mean_confidence: 0.75 },
        enrichment_intelligence: { available: true, domains_corrected: 10, domains_confirmed: 2, domains_no_sdc_match: 1, capabilities_domain_corrected: 5, mean_confidence_post: 0.8, domains_with_change: 12 },
        revalidation_intelligence: { available: true, status: 'PASS', total_checks: 30, passed: 30, failed: 0, phase_count: 8, phases: [] },
        constitutional_anchor: { available: true, status: 'PASS', advancement_blocked: false, overall_verdict: 'PASS', dimensions: [{ dimension_id: 'DIM-01', verdict: 'PASS' }, { dimension_id: 'DIM-02', verdict: 'PASS' }] },
        convergence_intelligence: { available: true, observation_maturity: 'DESCRIPTIVE', total_observations: 5, convergences: ['a', 'b'], divergences: ['c'], mixed: [], specimens: ['netbox', 'blueedge'], verdict: 'OK', observations: [] },
        chronicle_certification: { available: true, certification_status: 'CERTIFIED', total_checks: 50, passed: 50, failed: 0, phase_count: 8, phase_breakdown: {} },
        signal_interpretations: [{ signal_id: 'SIG-1', signal_name: 'Test', signal_family: 'DPSIG', severity: 'ELEVATED', activation_state: 'ELEVATED', interpretation: 'Test', boardroom_interpretation: 'Test exec' }],
        evidence_blocks: [{ role: 'ORIGIN', domain_name: 'Core', cluster_id: 'C1' }],
      }));
      assertGovernedBalanced(bp);
      assert.equal(bp.enrichment_corrections.available, true);
      assert.equal(bp.constitutional_anchor_dimensions.available, true);
      assert.equal(bp.convergence_observations.available, true);
      assert.equal(bp.chronicle_navigation.available, true);
      assert.equal(bp.revalidation_detail.available, true);
      assert.equal(bp.signal_family_explanation.available, true);
      assert.equal(bp.pressure_zone_distribution.available, true);
      assert.equal(bp.domain_coverage_extended.available, true);
      assert.ok(bp.guided_query_seeds.queries.length >= 5);
    });
  });

  describe('null fullReport', () => {
    it('returns null', () => {
      assert.equal(compileBalancedProjection(null), null);
    });
  });

  describe('governance friction with zero friction', () => {
    it('friction_summary reflects clean review', () => {
      const bp = compileBalancedProjection(syntheticGoverned('S2', {
        proposition_corpus: { available: true, total: 50, disposition_counts: { accepted: 50, rejected: 0, arbitrated: 0 }, governance_friction_rate: 0, by_class: {}, by_tier: {}, review_status: 'COMPLETE' },
      }));
      assert.ok(bp.governance_friction.available);
      assert.ok(bp.governance_friction.friction_summary.includes('0%'));
      assert.ok(bp.governance_friction.friction_summary.includes('All'));
    });
  });

  describe('projection determinism', () => {
    it('same input produces structurally identical output (minus ids/timestamps)', () => {
      const input = syntheticGoverned('S2', {
        proposition_corpus: { available: true, total: 10, disposition_counts: { accepted: 10 }, governance_friction_rate: 0, by_class: {}, by_tier: {}, review_status: 'COMPLETE' },
        revalidation_intelligence: { available: true, status: 'PASS', total_checks: 10, passed: 10, failed: 0, phase_count: 3, phases: [] },
      });
      const a = compileBalancedProjection(input);
      const b = compileBalancedProjection(input);
      const strip = (obj) => {
        const copy = JSON.parse(JSON.stringify(obj));
        delete copy.projection_id;
        delete copy.generated_at;
        delete copy.authority_declaration.compilation_timestamp;
        return copy;
      };
      assert.deepStrictEqual(strip(a), strip(b));
    });
  });

  describe('BALANCED is sibling to BOARDROOM, not child', () => {
    it('persona is BALANCED, altitude is INVESTIGATIVE', () => {
      const bp = compileBalancedProjection(syntheticGoverned('S2'));
      assert.equal(bp.persona, 'BALANCED');
      assert.equal(bp.altitude, 'INVESTIGATIVE');
      assert.notEqual(bp.persona, 'BOARDROOM');
      assert.notEqual(bp.altitude, 'EXECUTIVE');
    });

    it('does not contain any BOARDROOM-only fields', () => {
      const bp = compileBalancedProjection(syntheticGoverned('S2'));
      assert.ok(!('qualification_posture' in bp), 'BALANCED must not have BOARDROOM qualification_posture');
      assert.ok(!('tension_summary' in bp), 'BALANCED must not have BOARDROOM tension_summary');
      assert.ok(!('signal_intelligence' in bp), 'BALANCED must not have BOARDROOM signal_intelligence');
      assert.ok(!('governance_legitimacy' in bp), 'BALANCED must not have BOARDROOM governance_legitimacy');
      assert.ok(!('propagation_chain' in bp), 'BALANCED must not have BOARDROOM propagation_chain');
    });
  });
});

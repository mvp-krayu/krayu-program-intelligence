'use strict';

/**
 * boardroom-projection-stress.test.js
 *
 * BOARDROOM Projection Object Stress Matrix
 *
 * Category A: Current governed projection proof (genesis_e2e_03)
 * Category B: Legacy compatibility (productized, fastapi, flask, netbox, stackstorm)
 * Category C: Synthetic edge cases (compiler contract validation)
 */

const path = require('node:path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

process.env.REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

const { resolveSemanticPayload } = require('../../lib/lens-v2/generic/GenericSemanticPayloadResolver');
const { compileBoardroomProjection } = require('../../lib/lens-v2/generic/BoardroomProjectionCompiler');
const { REGISTRY, loadManifest } = require('../../lib/lens-v2/manifests');

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function resolveRun(client, run) {
  const m = loadManifest(client, run);
  if (!m.ok) {
    return { ok: false, error: m.error, detail: m };
  }
  const result = resolveSemanticPayload(m.manifest);
  if (!result || result.binding_status === 'REJECTED') {
    return { ok: false, error: result && result.error, detail: result };
  }
  return { ok: true, payload: result };
}

function assertProjectionSchema(bp) {
  assert.ok(bp, 'boardroomProjection must exist');
  assert.equal(bp.persona, 'BOARDROOM');
  assert.equal(bp.altitude, 'EXECUTIVE');
  assert.ok(bp.projection_id, 'must have projection_id');
  assert.ok(bp.generated_at, 'must have generated_at');
  assert.ok(bp.schema_version, 'must have schema_version');

  // 9 sections
  assert.ok(bp.qualification_posture, 'must have qualification_posture');
  assert.ok(bp.tension_summary, 'must have tension_summary');
  assert.ok(bp.signal_intelligence, 'must have signal_intelligence');
  assert.ok(bp.domain_coverage, 'must have domain_coverage');
  assert.ok(bp.governed_narrative, 'must have governed_narrative');
  assert.ok(bp.governance_legitimacy, 'must have governance_legitimacy');
  assert.ok(bp.propagation_chain, 'must have propagation_chain');
  assert.ok(bp.topology_reference, 'must have topology_reference');
  assert.ok(bp.authority_declaration, 'must have authority_declaration');
}

function assertGovernedProjection(bp) {
  assertProjectionSchema(bp);
  const qp = bp.qualification_posture;
  assert.equal(qp.governed, true, 'qualification_posture.governed must be true');
  assert.equal(qp.qualification_method, 'GOVERNED_LIFECYCLE');
  assert.ok(['S1', 'S2', 'S3'].includes(qp.s_level), `s_level must be S1-S3, got: ${qp.s_level}`);
  assert.ok(qp.posture_label, 'must have posture_label');
  assert.ok(qp.authority_ceiling, 'must have authority_ceiling');

  // Pre-composed narrative fields
  const ts = bp.tension_summary;
  assert.ok(ts.posture_narrative, 'tension_summary.posture_narrative must be pre-composed');
  assert.ok(typeof ts.posture_narrative === 'string', 'posture_narrative must be string');
  assert.ok(ts.tension_narrative, 'tension_summary.tension_narrative must be pre-composed');
  assert.ok(ts.finding_headline, 'tension_summary.finding_headline must be pre-composed');
  assert.equal(typeof ts.tension_count, 'number');
  assert.equal(typeof ts.activated_count, 'number');
  assert.equal(typeof ts.total_signals, 'number');

  // Governance legitimacy pre-composed fields
  const gl = bp.governance_legitimacy;
  assert.equal(gl.available, true);
  assert.ok(gl.lifecycle_summary, 'must have lifecycle_summary');
  assert.ok(gl.governance_narrative, 'must have governance_narrative');
  assert.ok(gl.confidence_narrative, 'must have confidence_narrative');
  assert.ok(Array.isArray(gl.legitimacy_sentences), 'must have legitimacy_sentences array');
  assert.ok(gl.legitimacy_sentences.length > 0, 'legitimacy_sentences must not be empty');
  assert.ok(gl.sections, 'must have sections');

  // Authority
  const ad = bp.authority_declaration;
  assert.equal(ad.interpretive_authority, '75.x');
  assert.equal(ad.authority_ceiling, 'L3');
  assert.equal(ad.evidence_traced, true);
  assert.equal(ad.prohibitions_enforced, 13);
  assert.equal(ad.structural_derivation_primary, true);
}

function assertLegacyProjection(bp) {
  assertProjectionSchema(bp);
  const qp = bp.qualification_posture;
  assert.equal(qp.governed, false, 'legacy run must have governed=false');
  assert.equal(qp.qualification_method, 'LEGACY');

  // No governed narrative fields
  const gl = bp.governance_legitimacy;
  assert.equal(gl.available, false);

  // Pre-composed briefing fields should be null for legacy
  const ts = bp.tension_summary;
  assert.equal(ts.posture_narrative, null, 'legacy posture_narrative must be null');
  assert.equal(ts.tension_narrative, null, 'legacy tension_narrative must be null');
  assert.equal(ts.finding_headline, null, 'legacy finding_headline must be null');
}

function assertNoSemanticLeakage(bp, otherClient) {
  const json = JSON.stringify(bp);
  if (otherClient) {
    assert.ok(!json.includes(`"${otherClient}"`),
      `projection must not contain cross-client reference to "${otherClient}"`);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// CATEGORY A: Current governed projection proof
// ────────────────────────────────────────────────────────────────────────────

describe('CATEGORY A — Current governed projection proof', () => {
  const CLIENT = 'blueedge';
  const RUN = 'run_blueedge_genesis_e2e_03';

  it('resolves payload successfully', () => {
    const r = resolveRun(CLIENT, RUN);
    assert.ok(r.ok, `Payload resolution failed: ${r.error}`);
  });

  it('compiles boardroomProjection with governed S2 posture', () => {
    const r = resolveRun(CLIENT, RUN);
    assert.ok(r.ok);
    const bp = compileBoardroomProjection(r.payload);
    assertGovernedProjection(bp);
    assert.equal(bp.qualification_posture.s_level, 'S2');
    assert.ok(bp.qualification_posture.posture_label.includes('S2'));
  });

  it('tension summary has correct pressure/signal data', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const ts = bp.tension_summary;
    assert.equal(typeof ts.tension_count, 'number');
    assert.ok(ts.tension_count >= 0);
    assert.ok(ts.total_signals > 0, 'governed run must have signals');
    assert.ok(Array.isArray(ts.active_families));
  });

  it('signal intelligence groups by family', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const si = bp.signal_intelligence;
    assert.ok(Array.isArray(si.families));
    assert.ok(si.families.length > 0, 'must have at least one signal family');
    for (const fam of si.families) {
      assert.ok(fam.family, 'family must have id');
      assert.ok(fam.family_label, 'family must have label');
      assert.ok(Array.isArray(fam.signals));
      assert.ok(fam.signals.length > 0);
      for (const sig of fam.signals) {
        assert.ok(sig.signal_id, 'signal must have id');
        assert.ok(sig.severity, 'signal must have severity');
        assert.ok(sig.source_lineage, 'signal must have source_lineage');
      }
    }
  });

  it('domain coverage reflects topology', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const dc = bp.domain_coverage;
    assert.ok(dc.total_domains > 0, 'must have domains');
    assert.ok(dc.structurally_backed >= 0);
    assert.ok(dc.coverage_label, 'must have coverage_label');
    assert.equal(typeof dc.grounding_ratio, 'number');
  });

  it('governance legitimacy sections present for governed run', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const sec = bp.governance_legitimacy.sections;
    assert.ok(sec.proposition_review, 'must have proposition_review section');
    assert.ok(sec.evidence_enrichment, 'must have evidence_enrichment section');
    assert.ok(sec.deterministic_replay, 'must have deterministic_replay section');
    assert.ok(sec.constitutional_anchor, 'must have constitutional_anchor section');
    assert.ok(sec.cross_specimen, 'must have cross_specimen section');
    assert.ok(sec.replay_certification, 'must have replay_certification section');
  });

  it('each available governance section has pre-composed finding', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const sec = bp.governance_legitimacy.sections;
    for (const [name, section] of Object.entries(sec)) {
      if (section.available) {
        assert.ok(section.finding, `${name}.finding must exist when available`);
        assert.ok(typeof section.finding === 'string', `${name}.finding must be string`);
        assert.ok(section.detail, `${name}.detail must exist when available`);
      }
    }
  });

  it('no semantic leakage from other clients', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    assertNoSemanticLeakage(bp, 'netbox');
    assertNoSemanticLeakage(bp, 'fastapi');
    assertNoSemanticLeakage(bp, 'stackstorm');
  });

  it('posture_narrative contains domain count and S-level', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const pn = bp.tension_summary.posture_narrative;
    assert.ok(pn.includes('S2'), 'posture_narrative must include S-level');
    assert.ok(pn.includes('governed intelligence'), 'must include "governed intelligence"');
    assert.ok(pn.includes('domains'), 'must include domain count');
  });

  it('structural_tension_narrative present when tension exists', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const ts = bp.tension_summary;
    if (ts.tension_count > 0) {
      assert.ok(ts.structural_tension_narrative, 'must have structural_tension_narrative when tension present');
      assert.ok(ts.structural_tension_narrative.includes('active'), 'must mention active');
    } else {
      assert.equal(ts.structural_tension_narrative, null);
    }
  });

  it('confidence_narrative is self-contained prose', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const cn = bp.governance_legitimacy.confidence_narrative;
    assert.ok(cn.length > 10, 'confidence_narrative must be meaningful');
    assert.ok(!cn.includes('[object'), 'must not contain [object Object]');
  });

  it('legitimacy_sentences are self-contained prose array', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    const ls = bp.governance_legitimacy.legitimacy_sentences;
    for (const s of ls) {
      assert.ok(typeof s === 'string');
      assert.ok(s.length > 10, 'each sentence must be meaningful');
      assert.ok(!s.includes('[object'), 'must not contain [object Object]');
    }
    assert.ok(ls[0].includes('S2'), 'first sentence must include S-level');
    assert.ok(ls[0].includes('not bridge'), 'first sentence must distinguish from bridge');
  });

  it('topology reference points to resolved payload', () => {
    const r = resolveRun(CLIENT, RUN);
    const bp = compileBoardroomProjection(r.payload);
    assert.equal(bp.topology_reference.data_ref, 'resolved_payload.topology');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// CATEGORY B: Legacy compatibility
// ────────────────────────────────────────────────────────────────────────────

describe('CATEGORY B — Legacy compatibility', () => {
  const LEGACY_RUNS = [
    { client: 'blueedge', run: 'run_blueedge_productized_01_fixed', label: 'BlueEdge productized', expectLegacy: true },
    { client: 'fastapi', run: 'run_02_oss_fastapi_pipeline', label: 'FastAPI pipeline', expectLegacy: true },
    { client: 'netbox', run: 'run_github_netbox_20260520_134600', label: 'NetBox (resolver exposes governance_lifecycle.available=false)', expectLegacy: true },
    { client: 'stackstorm', run: 'run_github_st2_20260520_131000', label: 'StackStorm', expectLegacy: true },
  ];

  for (const { client, run, label, expectLegacy } of LEGACY_RUNS) {
    describe(`${label} (${client}/${run})`, () => {
      it('resolves payload', () => {
        const r = resolveRun(client, run);
        assert.ok(r.ok, `${label} resolution failed: ${r.error}`);
      });

      it('compiles boardroomProjection without crash', () => {
        const r = resolveRun(client, run);
        if (!r.ok) return;
        const bp = compileBoardroomProjection(r.payload);
        assertProjectionSchema(bp);
      });

      it('governed/legacy branch matches expectation', () => {
        const r = resolveRun(client, run);
        if (!r.ok) return;
        const bp = compileBoardroomProjection(r.payload);
        if (expectLegacy) {
          assert.equal(bp.qualification_posture.governed, false,
            `${label} must produce legacy projection`);
          assertLegacyProjection(bp);
        } else {
          assert.equal(bp.qualification_posture.governed, true,
            `${label} must produce governed projection (LEGACY_GOVERNED_REFERENCE)`);
        }
      });

      it('no cross-client semantic contamination', () => {
        const r = resolveRun(client, run);
        if (!r.ok) return;
        const bp = compileBoardroomProjection(r.payload);
        const otherClients = Object.keys(REGISTRY).filter(c => c !== client);
        for (const oc of otherClients) {
          const json = JSON.stringify(bp.qualification_posture) +
            JSON.stringify(bp.tension_summary) +
            JSON.stringify(bp.governance_legitimacy);
          assert.ok(!json.includes(`"${oc}"`),
            `${label} must not contain references to ${oc} in governed fields`);
        }
      });

      it('signal families array valid', () => {
        const r = resolveRun(client, run);
        if (!r.ok) return;
        const bp = compileBoardroomProjection(r.payload);
        assert.ok(Array.isArray(bp.signal_intelligence.families));
        for (const fam of bp.signal_intelligence.families) {
          assert.ok(fam.family);
          assert.ok(Array.isArray(fam.signals));
        }
      });
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// CATEGORY C: Synthetic edge cases — projection compiler contract
// ────────────────────────────────────────────────────────────────────────────

function syntheticPayload(overrides = {}) {
  const base = {
    client: 'synthetic',
    run_id: 'synthetic_test',
    readiness_summary: { posture: 'INVESTIGATE', score: 40, band: 'LOW' },
    topology_summary: {
      semantic_domain_count: 5,
      structurally_backed_count: 3,
      semantic_only_count: 2,
      cluster_count: 12,
    },
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
  return base;
}

function syntheticGoverned(sLevel, overrides = {}) {
  return syntheticPayload({
    governance_lifecycle: {
      available: true,
      s_level: sLevel,
      transition_count: sLevel === 'S0' ? 0 : sLevel === 'S1' ? 2 : 10,
      transitions: [],
      qualification_provenance: `Test provenance for ${sLevel}`,
      authority_ceiling: 'L3',
    },
    ...overrides,
  });
}

function makeSignals(families) {
  const signals = [];
  for (const [family, count, activated] of families) {
    for (let i = 0; i < count; i++) {
      signals.push({
        signal_id: `${family}-${i + 1}`,
        signal_name: `${family} Signal ${i + 1}`,
        signal_family: family,
        severity: i < activated ? 'ELEVATED' : 'NOMINAL',
        activation_state: i < activated ? 'ELEVATED' : 'NOMINAL',
        interpretation: `Test interpretation for ${family}-${i + 1}`,
        boardroom_interpretation: `Executive reading for ${family}-${i + 1}`,
      });
    }
  }
  return signals;
}

describe('CATEGORY C — Synthetic edge cases', () => {

  describe('S0 — pipeline genesis (pre-governed)', () => {
    it('S0 compiles as non-governed (S0 excluded from governed by design)', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S0'));
      assertProjectionSchema(bp);
      assert.equal(bp.qualification_posture.governed, false,
        'S0 is pre-governed — compiler only grants governed to S1/S2/S3');
      assert.equal(bp.qualification_posture.s_level, null);
    });

    it('S0 governance_legitimacy not available', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S0'));
      assert.equal(bp.governance_legitimacy.available, false,
        'S0 has no governed legitimacy');
    });

    it('S0 produces valid legacy-shaped projection', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S0'));
      assertLegacyProjection(bp);
    });
  });

  describe('S1 — governed but not enriched', () => {
    it('compiles as governed S1', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S1'));
      assertProjectionSchema(bp);
      assert.equal(bp.qualification_posture.s_level, 'S1');
      assert.equal(bp.qualification_posture.governed, true);
    });

    it('S1 posture_narrative includes S1', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S1'));
      assert.ok(bp.tension_summary.posture_narrative.includes('S1'));
    });
  });

  describe('S2 with no signals', () => {
    it('handles zero signals gracefully', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        signal_interpretations: [],
      }));
      assertGovernedProjection(bp);
      assert.equal(bp.tension_summary.tension_count, 0);
      assert.equal(bp.tension_summary.activated_count, 0);
      assert.equal(bp.tension_summary.total_signals, 0);
      assert.ok(bp.tension_summary.posture_narrative.includes('No elevated structural pressure'));
      assert.equal(bp.signal_intelligence.families.length, 0);
      assert.equal(bp.tension_summary.structural_tension_narrative, null);
    });
  });

  describe('S2 with one signal family', () => {
    it('groups signals into single family', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        signal_interpretations: makeSignals([['DPSIG', 3, 2]]),
      }));
      assertGovernedProjection(bp);
      assert.equal(bp.signal_intelligence.families.length, 1);
      assert.equal(bp.signal_intelligence.families[0].family, 'DPSIG');
      assert.equal(bp.signal_intelligence.families[0].signal_count, 3);
      assert.equal(bp.signal_intelligence.families[0].activated_count, 2);
      assert.equal(bp.tension_summary.tension_count, 1);
    });
  });

  describe('S2 with three signal families', () => {
    it('groups into three families sorted correctly', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        signal_interpretations: makeSignals([
          ['DPSIG', 2, 1],
          ['PSIG', 3, 2],
          ['ISIG', 2, 1],
        ]),
      }));
      assertGovernedProjection(bp);
      assert.equal(bp.signal_intelligence.families.length, 3);
      assert.equal(bp.signal_intelligence.families[0].family, 'DPSIG');
      assert.equal(bp.signal_intelligence.families[1].family, 'PSIG');
      assert.equal(bp.signal_intelligence.families[2].family, 'ISIG');
      assert.equal(bp.tension_summary.tension_count, 3);
    });

    it('finding_headline reflects multi-family tension', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        signal_interpretations: makeSignals([
          ['DPSIG', 2, 1],
          ['PSIG', 3, 2],
          ['ISIG', 2, 1],
        ]),
      }));
      assert.ok(bp.tension_summary.finding_headline.includes('3 STRUCTURAL TENSIONS'));
    });
  });

  describe('S2 with no pressure zones', () => {
    it('handles missing pressure zone', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        signal_interpretations: makeSignals([['DPSIG', 3, 2]]),
        propagation_summary: {},
      }));
      assert.equal(bp.tension_summary.pressure_zone, null);
      assert.equal(bp.tension_summary.pressure_zone_narrative, null);
      assert.ok(bp.tension_summary.structural_tension_narrative.includes('across the system'));
    });
  });

  describe('S2 with named pressure zone', () => {
    it('includes pressure zone in narratives', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        signal_interpretations: makeSignals([['DPSIG', 3, 2]]),
        propagation_summary: { primary_zone_business_label: 'Core Infrastructure' },
      }));
      assert.equal(bp.tension_summary.pressure_zone, 'Core Infrastructure');
      assert.ok(bp.tension_summary.pressure_zone_narrative.includes('Core Infrastructure'));
      assert.ok(bp.tension_summary.posture_narrative.includes('Core Infrastructure'));
      assert.ok(bp.tension_summary.structural_tension_narrative.includes('Core Infrastructure'));
    });
  });

  describe('S2 with missing Chronicle certification', () => {
    it('replay_certification section unavailable', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2'));
      assert.equal(bp.governance_legitimacy.sections.replay_certification.available, false);
      assert.ok(!bp.governance_legitimacy.confidence_narrative.includes('Replay-certified'));
    });
  });

  describe('S2 with full governance artifacts', () => {
    it('all governance sections available with findings', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        proposition_corpus: {
          available: true,
          total: 60,
          disposition_counts: { accepted: 50, rejected: 5, arbitrated: 5 },
          governance_friction_rate: 0.17,
        },
        enrichment_intelligence: {
          available: true,
          enrichment_events: 8,
          domains_corrected: 4,
        },
        revalidation_intelligence: {
          available: true,
          status: 'PASS',
          passed: 48,
          total_checks: 48,
          phase_count: 9,
        },
        constitutional_anchor: {
          available: true,
          advancement_blocked: false,
          overall_verdict: 'ALL_PASS',
        },
        convergence_intelligence: {
          available: true,
          total_observations: 7,
          convergences: [1, 2, 3, 4, 5],
          divergences: [1, 2],
        },
        chronicle_certification: {
          available: true,
          certification_status: 'CERTIFIED',
          passed: 10,
          total_checks: 10,
          phase_count: 10,
        },
      }));

      const sec = bp.governance_legitimacy.sections;
      assert.equal(sec.proposition_review.available, true);
      assert.ok(sec.proposition_review.finding.includes('60'));
      assert.equal(sec.evidence_enrichment.available, true);
      assert.ok(sec.evidence_enrichment.finding.includes('8'));
      assert.equal(sec.deterministic_replay.available, true);
      assert.ok(sec.deterministic_replay.finding.includes('PASS'));
      assert.equal(sec.constitutional_anchor.available, true);
      assert.equal(sec.cross_specimen.available, true);
      assert.equal(sec.replay_certification.available, true);

      // confidence_narrative includes replay-certified
      assert.ok(bp.governance_legitimacy.confidence_narrative.includes('Replay-certified'));
      assert.ok(bp.governance_legitimacy.confidence_narrative.includes('Governance friction'));

      // legitimacy_sentences include friction and certification
      const ls = bp.governance_legitimacy.legitimacy_sentences;
      assert.ok(ls.some(s => s.includes('challenged')), 'must mention governance friction');
      assert.ok(ls.some(s => s.includes('Replay-certified')), 'must mention certification');
      assert.ok(ls.some(s => s.includes('independent specimens')), 'must mention convergence');
    });
  });

  describe('S2 with zero friction', () => {
    it('confidence_narrative reflects clean review', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        proposition_corpus: {
          available: true,
          total: 30,
          disposition_counts: { accepted: 30, rejected: 0, arbitrated: 0 },
          governance_friction_rate: 0,
        },
      }));
      assert.ok(bp.governance_legitimacy.confidence_narrative.includes('All claims accepted'));
      assert.ok(!bp.governance_legitimacy.confidence_narrative.includes('friction'));
    });
  });

  describe('S2 with missing topology', () => {
    it('handles zero domains', () => {
      const bp = compileBoardroomProjection(syntheticGoverned('S2', {
        topology_summary: {
          semantic_domain_count: 0,
          structurally_backed_count: 0,
          semantic_only_count: 0,
          cluster_count: 0,
        },
      }));
      assert.equal(bp.domain_coverage.total_domains, 0);
      assert.equal(bp.domain_coverage.grounding_ratio, 0);
      assert.ok(bp.domain_coverage.coverage_label.includes('No domains'));
    });
  });

  describe('Legacy — no governance_lifecycle', () => {
    it('produces legacy projection', () => {
      const bp = compileBoardroomProjection(syntheticPayload());
      assertLegacyProjection(bp);
    });

    it('legacy projection has correct authority declaration', () => {
      const bp = compileBoardroomProjection(syntheticPayload());
      assert.equal(bp.authority_declaration.interpretive_authority, '75.x');
      assert.equal(bp.authority_declaration.evidence_traced, true);
    });
  });

  describe('null fullReport', () => {
    it('returns null', () => {
      const bp = compileBoardroomProjection(null);
      assert.equal(bp, null);
    });
  });

  describe('Projection determinism', () => {
    it('same input produces structurally identical output (minus ids/timestamps)', () => {
      const payload = syntheticGoverned('S2', {
        signal_interpretations: makeSignals([['DPSIG', 3, 2]]),
        propagation_summary: { primary_zone_business_label: 'Core' },
      });
      const bp1 = compileBoardroomProjection(payload);
      const bp2 = compileBoardroomProjection(payload);
      // Strip non-deterministic fields
      const strip = (bp) => {
        const copy = { ...bp };
        delete copy.projection_id;
        delete copy.generated_at;
        delete copy.authority_declaration;
        return JSON.stringify(copy);
      };
      assert.equal(strip(bp1), strip(bp2));
    });
  });
});

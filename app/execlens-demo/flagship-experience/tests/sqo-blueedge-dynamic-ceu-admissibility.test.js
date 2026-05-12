'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const APP_ROOT = path.resolve(__dirname, '..', '..');

// Suite 1: Admissibility evaluator loads candidates
describe('CEU Admissibility: evaluator loads candidates', () => {
  const evaluatorPath = path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js');

  it('evaluator file exists', () => {
    assert.ok(fs.existsSync(evaluatorPath), 'DynamicCEUAdmissibilityEvaluator.server.js must exist');
  });

  it('evaluator exports loadDynamicCEUAdmissibilityData', () => {
    const mod = require(evaluatorPath);
    assert.ok(typeof mod.loadDynamicCEUAdmissibilityData === 'function');
  });

  it('evaluator loads and returns ok:true with evaluations', () => {
    const { loadDynamicCEUAdmissibilityData } = require(evaluatorPath);
    const result = loadDynamicCEUAdmissibilityData();
    assert.ok(result.ok, 'result.ok must be true');
    assert.ok(Array.isArray(result.evaluations), 'result.evaluations must be an array');
    assert.ok(result.evaluation_count > 0, 'evaluation_count must be > 0');
  });

  it('evaluations match upstream candidate count', () => {
    const { loadDynamicCEUAdmissibilityData } = require(evaluatorPath);
    const result = loadDynamicCEUAdmissibilityData();
    assert.equal(result.evaluation_count, result.upstream_candidate_count);
  });
});

// Suite 2: Admissibility states render
describe('CEU Admissibility: admissibility states', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('at least one ADMISSIBLE candidate exists', () => {
    const admissible = result.evaluations.filter(e => e.admissibility_state === 'ADMISSIBLE');
    assert.ok(admissible.length >= 1, `Expected at least 1 ADMISSIBLE, got ${admissible.length}`);
  });

  it('at least one QUARANTINED candidate exists', () => {
    const quarantined = result.evaluations.filter(e => e.admissibility_state === 'QUARANTINED');
    assert.ok(quarantined.length >= 1, `Expected at least 1 QUARANTINED, got ${quarantined.length}`);
  });

  it('at least one REJECTED candidate exists', () => {
    const rejected = result.evaluations.filter(e => e.admissibility_state === 'REJECTED');
    assert.ok(rejected.length >= 1, `Expected at least 1 REJECTED, got ${rejected.length}`);
  });

  it('all states are valid', () => {
    const validStates = ['ADMISSIBLE', 'QUARANTINED', 'REJECTED', 'UNRESOLVED'];
    for (const e of result.evaluations) {
      assert.ok(validStates.includes(e.admissibility_state), `Invalid state: ${e.admissibility_state}`);
    }
  });

  it('at least one admissible targets a NONE domain', () => {
    const admissibleNone = result.evaluations.filter(
      e => e.admissibility_state === 'ADMISSIBLE' && e.domain_lineage_state === 'NONE'
    );
    assert.ok(admissibleNone.length >= 1, `Expected at least 1 admissible targeting NONE domain, got ${admissibleNone.length}`);
  });

  it('summary counts match evaluation array', () => {
    assert.equal(result.summary.admissible, result.evaluations.filter(e => e.admissibility_state === 'ADMISSIBLE').length);
    assert.equal(result.summary.quarantined, result.evaluations.filter(e => e.admissibility_state === 'QUARANTINED').length);
    assert.equal(result.summary.rejected, result.evaluations.filter(e => e.admissibility_state === 'REJECTED').length);
    assert.equal(result.summary.total_evaluated, result.evaluations.length);
  });
});

// Suite 3: Structural compatibility renders
describe('CEU Admissibility: structural compatibility', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('all evaluations have structural_compatibility', () => {
    const validLevels = ['HIGH', 'MODERATE', 'LOW', 'NONE'];
    for (const e of result.evaluations) {
      assert.ok(validLevels.includes(e.structural_compatibility), `Invalid structural compatibility: ${e.structural_compatibility}`);
    }
  });

  it('structural compatibility distribution is present', () => {
    const dist = result.summary.structural_compatibility_distribution;
    assert.ok(dist, 'structural_compatibility_distribution must exist');
    assert.ok(typeof dist.HIGH === 'number');
    assert.ok(typeof dist.MODERATE === 'number');
    assert.ok(typeof dist.LOW === 'number');
    assert.ok(typeof dist.NONE === 'number');
  });

  it('distribution totals match evaluation count', () => {
    const dist = result.summary.structural_compatibility_distribution;
    const total = dist.HIGH + dist.MODERATE + dist.LOW + dist.NONE;
    assert.equal(total, result.evaluation_count);
  });

  it('ADMISSIBLE candidates have HIGH structural compatibility', () => {
    const admissible = result.evaluations.filter(e => e.admissibility_state === 'ADMISSIBLE');
    for (const e of admissible) {
      assert.equal(e.structural_compatibility, 'HIGH', `ADMISSIBLE candidate ${e.candidate_id} must have HIGH structural compatibility`);
    }
  });
});

// Suite 4: Replay compatibility renders
describe('CEU Admissibility: replay compatibility', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('all evaluations have replay_compatibility', () => {
    const validValues = ['COMPATIBLE', 'UNCERTAIN', 'INCOMPATIBLE'];
    for (const e of result.evaluations) {
      assert.ok(validValues.includes(e.replay_compatibility), `Invalid replay compatibility: ${e.replay_compatibility}`);
    }
  });

  it('replay compatibility distribution is present', () => {
    const dist = result.summary.replay_compatibility_distribution;
    assert.ok(dist, 'replay_compatibility_distribution must exist');
    assert.ok(typeof dist.COMPATIBLE === 'number');
  });

  it('all candidates from hash-verified evidence are COMPATIBLE', () => {
    for (const e of result.evaluations) {
      assert.equal(e.replay_compatibility, 'COMPATIBLE');
    }
  });
});

// Suite 5: Quarantine state renders
describe('CEU Admissibility: quarantine state', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('quarantined candidates have quarantine_reason', () => {
    const quarantined = result.evaluations.filter(e => e.admissibility_state === 'QUARANTINED');
    for (const e of quarantined) {
      assert.ok(e.quarantine_reason, `QUARANTINED candidate ${e.candidate_id} must have quarantine_reason`);
      assert.ok(e.quarantine_reason.length > 0);
    }
  });

  it('quarantined candidates have LOW admissibility_confidence', () => {
    const quarantined = result.evaluations.filter(e => e.admissibility_state === 'QUARANTINED');
    for (const e of quarantined) {
      assert.equal(e.admissibility_confidence, 'LOW');
    }
  });

  it('quarantined candidates have QUARANTINE_REVIEW_REQUIRED next step', () => {
    const quarantined = result.evaluations.filter(e => e.admissibility_state === 'QUARANTINED');
    for (const e of quarantined) {
      assert.ok(e.required_next_step.includes('QUARANTINE_REVIEW_REQUIRED'), `Expected QUARANTINE_REVIEW_REQUIRED in next step`);
    }
  });
});

// Suite 6: Rejected state renders
describe('CEU Admissibility: rejected state', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('rejected candidates have admissibility_reason', () => {
    const rejected = result.evaluations.filter(e => e.admissibility_state === 'REJECTED');
    for (const e of rejected) {
      assert.ok(e.admissibility_reason, `REJECTED candidate ${e.candidate_id} must have admissibility_reason`);
      assert.ok(e.admissibility_reason.length > 0);
    }
  });

  it('rejected candidates have N_A admissibility_confidence', () => {
    const rejected = result.evaluations.filter(e => e.admissibility_state === 'REJECTED');
    for (const e of rejected) {
      assert.equal(e.admissibility_confidence, 'N_A');
    }
  });

  it('rejected candidates have REJECTED next step', () => {
    const rejected = result.evaluations.filter(e => e.admissibility_state === 'REJECTED');
    for (const e of rejected) {
      assert.ok(e.required_next_step.includes('REJECTED'), `Expected REJECTED in next step`);
    }
  });

  it('unmapped candidates are always rejected', () => {
    const unmapped = result.evaluations.filter(e => e.candidate_domain === 'UNMAPPED_CANDIDATE');
    for (const e of unmapped) {
      assert.equal(e.admissibility_state, 'REJECTED', `Unmapped candidate ${e.candidate_id} must be REJECTED`);
    }
  });
});

// Suite 7: Authority state remains NON_AUTHORITATIVE_ADMISSIBILITY_RESULT
describe('CEU Admissibility: authority state', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('all evaluations have NON_AUTHORITATIVE_ADMISSIBILITY_RESULT', () => {
    for (const e of result.evaluations) {
      assert.equal(e.authority_state, 'NON_AUTHORITATIVE_ADMISSIBILITY_RESULT');
    }
  });

  it('summary confirms all_non_authoritative', () => {
    assert.ok(result.summary.all_non_authoritative);
  });
});

// Suite 8: No overlay generation occurs
describe('CEU Admissibility: no overlay generation', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('governance flag no_overlay_generation is true', () => {
    assert.equal(result.governance.no_overlay_generation, true);
  });

  it('no evaluation contains overlay proposal data', () => {
    for (const e of result.evaluations) {
      assert.ok(!e.overlay_proposal, `Evaluation ${e.candidate_id} must not contain overlay_proposal`);
      assert.ok(!e.overlay_id, `Evaluation ${e.candidate_id} must not contain overlay_id`);
    }
  });
});

// Suite 9: No qualification mutation occurs
describe('CEU Admissibility: no qualification mutation', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('governance flag no_qualification_mutation is true', () => {
    assert.equal(result.governance.no_qualification_mutation, true);
  });

  it('no evaluation contains s_state or q_class mutation', () => {
    for (const e of result.evaluations) {
      assert.ok(!e.s_state_change, `Evaluation ${e.candidate_id} must not contain s_state_change`);
      assert.ok(!e.q_class_change, `Evaluation ${e.candidate_id} must not contain q_class_change`);
    }
  });
});

// Suite 10: No grounding mutation occurs
describe('CEU Admissibility: no grounding mutation', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('governance flag no_grounding_mutation is true', () => {
    assert.equal(result.governance.no_grounding_mutation, true);
  });

  it('governance flag no_authority_assertion is true', () => {
    assert.equal(result.governance.no_authority_assertion, true);
  });

  it('governance flag no_lens_mutation is true', () => {
    assert.equal(result.governance.no_lens_mutation, true);
  });

  it('governance flag admissibility_evaluation_only is true', () => {
    assert.equal(result.governance.admissibility_evaluation_only, true);
  });
});

// Suite 11: No PATH A imports introduced
describe('CEU Admissibility: no PATH A imports', () => {
  const serverFile = fs.readFileSync(
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'), 'utf8'
  );
  const viewModelFile = fs.readFileSync(
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'DynamicCEUAdmissibilityViewModel.js'), 'utf8'
  );

  it('server evaluator does not import PATH A modules', () => {
    assert.ok(!serverFile.includes('path-a/'), 'Server evaluator must not import PATH A');
    assert.ok(!serverFile.includes('PathA'), 'Server evaluator must not import PathA');
  });

  it('view model does not import PATH A modules', () => {
    assert.ok(!viewModelFile.includes('path-a/'), 'View model must not import PATH A');
    assert.ok(!viewModelFile.includes('PathA'), 'View model must not import PathA');
  });
});

// Suite 12: No PATH B imports introduced
describe('CEU Admissibility: no PATH B imports', () => {
  const serverFile = fs.readFileSync(
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'), 'utf8'
  );
  const viewModelFile = fs.readFileSync(
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'DynamicCEUAdmissibilityViewModel.js'), 'utf8'
  );

  it('server evaluator does not import PATH B modules', () => {
    assert.ok(!serverFile.includes('path-b/'), 'Server evaluator must not import PATH B');
    assert.ok(!serverFile.includes('PathB'), 'Server evaluator must not import PathB');
  });

  it('view model does not import PATH B modules', () => {
    assert.ok(!viewModelFile.includes('path-b/'), 'View model must not import PATH B');
    assert.ok(!viewModelFile.includes('PathB'), 'View model must not import PathB');
  });
});

// Suite 13: No LENS coupling introduced
describe('CEU Admissibility: no LENS coupling', () => {
  const filesToCheck = [
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'),
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'DynamicCEUAdmissibilityViewModel.js'),
    path.join(APP_ROOT, 'components', 'sqo-cockpit', 'DynamicCEUAdmissibilityPanel.jsx'),
    path.join(APP_ROOT, 'components', 'sqo-cockpit', 'AdmissibilityRegistryTable.jsx'),
    path.join(APP_ROOT, 'components', 'sqo-cockpit', 'CandidateCompatibilitySummary.jsx'),
    path.join(APP_ROOT, 'components', 'sqo-cockpit', 'CandidateQuarantineSummary.jsx'),
  ];

  it('no admissibility file imports LENS modules', () => {
    for (const filePath of filesToCheck) {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(!content.includes('/lens/'), `${path.basename(filePath)} must not import from /lens/`);
      assert.ok(!content.includes('LensV2'), `${path.basename(filePath)} must not import LensV2`);
      assert.ok(!content.includes('lens-executive'), `${path.basename(filePath)} must not import lens-executive`);
    }
  });
});

// Suite 14: No browser-side fs import
describe('CEU Admissibility: no browser-side fs import', () => {
  const clientFiles = [
    path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'DynamicCEUAdmissibilityViewModel.js'),
    path.join(APP_ROOT, 'components', 'sqo-cockpit', 'DynamicCEUAdmissibilityPanel.jsx'),
    path.join(APP_ROOT, 'components', 'sqo-cockpit', 'AdmissibilityRegistryTable.jsx'),
    path.join(APP_ROOT, 'components', 'sqo-cockpit', 'CandidateCompatibilitySummary.jsx'),
    path.join(APP_ROOT, 'components', 'sqo-cockpit', 'CandidateQuarantineSummary.jsx'),
  ];

  it('no client file imports fs, path, or crypto', () => {
    for (const filePath of clientFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(!content.includes("require('fs')"), `${path.basename(filePath)} must not require('fs')`);
      assert.ok(!content.includes("require('path')"), `${path.basename(filePath)} must not require('path')`);
      assert.ok(!content.includes("require('crypto')"), `${path.basename(filePath)} must not require('crypto')`);
      assert.ok(!content.includes("from 'fs'"), `${path.basename(filePath)} must not import from 'fs'`);
      assert.ok(!content.includes("from 'path'"), `${path.basename(filePath)} must not import from 'path'`);
      assert.ok(!content.includes("from 'crypto'"), `${path.basename(filePath)} must not import from 'crypto'`);
    }
  });
});

// Suite 15: Route configuration
describe('CEU Admissibility: route configuration', () => {
  it('ceu-admissibility is in COCKPIT_SECTIONS', () => {
    const { COCKPIT_SECTIONS } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitRouteResolver.js'));
    assert.ok(COCKPIT_SECTIONS.includes('ceu-admissibility'));
  });

  it('ceu-admissibility has a route path', () => {
    const { SECTION_ROUTES } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitRouteResolver.js'));
    assert.equal(SECTION_ROUTES['ceu-admissibility'], '/ceu-admissibility');
  });

  it('ceu-admissibility has a label', () => {
    const { SECTION_LABELS } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitRouteResolver.js'));
    assert.ok(SECTION_LABELS['ceu-admissibility']);
  });

  it('ceu-admissibility page file exists', () => {
    const pagePath = path.join(APP_ROOT, 'pages', 'sqo', 'client', '[client]', 'run', '[run]', 'ceu-admissibility.js');
    assert.ok(fs.existsSync(pagePath), 'ceu-admissibility.js page must exist');
  });

  it('ceu-admissibility appears in navigation', () => {
    const { buildNavigationItems } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'SQOCockpitRouteResolver.js'));
    const nav = buildNavigationItems('blueedge', 'run_blueedge_productized_01_fixed', 'ceu-admissibility');
    const ceuItem = nav.find(n => n.section === 'ceu-admissibility');
    assert.ok(ceuItem, 'Navigation must include ceu-admissibility');
    assert.ok(ceuItem.active, 'ceu-admissibility must be active when selected');
  });
});

// Suite 16: View model transformation
describe('CEU Admissibility: view model', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const { buildDynamicCEUAdmissibilityViewModel } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'client', 'DynamicCEUAdmissibilityViewModel.js'));
  const result = loadDynamicCEUAdmissibilityData();
  const vm = buildDynamicCEUAdmissibilityViewModel(result);

  it('view model is available', () => {
    assert.ok(vm.available);
  });

  it('view model truncates source hashes', () => {
    for (const e of vm.evaluations) {
      if (e.source_hash) {
        assert.ok(e.source_hash.endsWith('...'), `Hash ${e.source_hash} must be truncated`);
        assert.ok(e.source_hash.length <= 20);
      }
    }
  });

  it('view model has is_admissible, is_quarantined, is_rejected flags', () => {
    for (const e of vm.evaluations) {
      assert.equal(typeof e.is_admissible, 'boolean');
      assert.equal(typeof e.is_quarantined, 'boolean');
      assert.equal(typeof e.is_rejected, 'boolean');
      assert.equal(typeof e.is_unresolved, 'boolean');
    }
  });

  it('view model flags match admissibility_state', () => {
    for (const e of vm.evaluations) {
      if (e.admissibility_state === 'ADMISSIBLE') assert.ok(e.is_admissible);
      if (e.admissibility_state === 'QUARANTINED') assert.ok(e.is_quarantined);
      if (e.admissibility_state === 'REJECTED') assert.ok(e.is_rejected);
    }
  });

  it('view model handles null data gracefully', () => {
    const nullVm = buildDynamicCEUAdmissibilityViewModel(null);
    assert.ok(!nullVm.available);
  });

  it('view model handles error data gracefully', () => {
    const errorVm = buildDynamicCEUAdmissibilityViewModel({ ok: false, error: 'TEST_ERROR' });
    assert.ok(!errorVm.available);
    assert.equal(errorVm.error, 'TEST_ERROR');
  });
});

// Suite 17: Evaluation completeness
describe('CEU Admissibility: evaluation completeness', () => {
  const { loadDynamicCEUAdmissibilityData } = require(path.join(APP_ROOT, 'lib', 'sqo-cockpit', 'server', 'DynamicCEUAdmissibilityEvaluator.server.js'));
  const result = loadDynamicCEUAdmissibilityData();

  it('every evaluation has all required fields', () => {
    const requiredFields = [
      'candidate_id', 'admissibility_state', 'admissibility_reason',
      'structural_compatibility', 'evidence_repetition_score',
      'replay_compatibility', 'conflict_status',
      'admissibility_confidence', 'required_next_step', 'authority_state',
    ];
    for (const e of result.evaluations) {
      for (const field of requiredFields) {
        assert.ok(e[field] !== undefined, `Evaluation ${e.candidate_id} missing field: ${field}`);
      }
    }
  });

  it('every evaluation has a non-empty admissibility_reason', () => {
    for (const e of result.evaluations) {
      assert.ok(e.admissibility_reason.length > 0);
    }
  });

  it('every evaluation has a non-empty required_next_step', () => {
    for (const e of result.evaluations) {
      assert.ok(e.required_next_step.length > 0);
    }
  });

  it('admissible candidates have OVERLAY_PROPOSAL_ELIGIBLE next step', () => {
    const admissible = result.evaluations.filter(e => e.admissibility_state === 'ADMISSIBLE');
    for (const e of admissible) {
      assert.ok(e.required_next_step.includes('OVERLAY_PROPOSAL_ELIGIBLE'));
    }
  });

  it('evaluation log matches evaluations', () => {
    assert.equal(result.evaluation_log.length, result.evaluations.length);
    for (let i = 0; i < result.evaluations.length; i++) {
      assert.equal(result.evaluation_log[i].candidate_id, result.evaluations[i].candidate_id);
      assert.equal(result.evaluation_log[i].admissibility_state, result.evaluations[i].admissibility_state);
    }
  });
});

// Suite 18: Component files exist
describe('CEU Admissibility: component files', () => {
  const componentDir = path.join(APP_ROOT, 'components', 'sqo-cockpit');

  it('DynamicCEUAdmissibilityPanel.jsx exists', () => {
    assert.ok(fs.existsSync(path.join(componentDir, 'DynamicCEUAdmissibilityPanel.jsx')));
  });

  it('AdmissibilityRegistryTable.jsx exists', () => {
    assert.ok(fs.existsSync(path.join(componentDir, 'AdmissibilityRegistryTable.jsx')));
  });

  it('CandidateCompatibilitySummary.jsx exists', () => {
    assert.ok(fs.existsSync(path.join(componentDir, 'CandidateCompatibilitySummary.jsx')));
  });

  it('CandidateQuarantineSummary.jsx exists', () => {
    assert.ok(fs.existsSync(path.join(componentDir, 'CandidateQuarantineSummary.jsx')));
  });
});

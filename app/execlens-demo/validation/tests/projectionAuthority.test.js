'use strict'

const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')

const {
  computeProjectionAuthority,
  detectEvidenceCapabilities,
  deriveProjectionLevel,
  classifyConditionAuthority,
  authorizeConditions,
  isConditionTypeAuthorized,
  isNarrativeModeAuthorized,
  resolveCompoundAuthority,
  resolveProvenAuthority,
  E, P,
} = require('../../lib/lens-v2/ProjectionAuthorityKernel')
const { resolveSpecimen, resolveVisibilityLayerCompleteness } = require('../../lib/copilot/PIKnowledgeGraphAccess')
const { synthesize, qualifyDomainBacking, backfillSignalInterpretations } = require('../../lib/lens-v2/SignalSynthesisEngine')
const { loadRuntimeGraphs, deriveRuntimeSignals } = require('../../lib/lens-v2/RuntimeSignalDerivation')
const { resolveRepoRoot } = require('../../lib/copilot/resolveRepoRoot')

function loadSpecimen(client, run) {
  const root = resolveRepoRoot()
  const spec = resolveSpecimen(client, run)
  const vlc = resolveVisibilityLayerCompleteness(spec, client, run)
  let rtEdges = []
  try { rtEdges = JSON.parse(fs.readFileSync(path.join(root, `clients/${client}/psee/runs/${run}/structure/runtime_connectivity/system_connectivity_graph.json`), 'utf-8')).edges } catch (e) {}
  const graphs = loadRuntimeGraphs(client, run, root)
  const qualified = qualifyDomainBacking(spec, vlc, rtEdges, graphs)
  qualified._runtime_signals = deriveRuntimeSignals(graphs)
  const synResult = synthesize(qualified)
  backfillSignalInterpretations(qualified, synResult)
  qualified._synthesisResult = synResult
  return qualified
}

describe('Evidence Capability Detection', () => {
  test('StackStorm detects E-STRUCTURAL + E-RUNTIME', () => {
    const report = loadSpecimen('stackstorm', 'run_github_st2_20260520_131000')
    const { capabilities } = detectEvidenceCapabilities(report)
    assert.ok(capabilities.has(E.STRUCTURAL))
    assert.ok(capabilities.has(E.RUNTIME))
    assert.ok(!capabilities.has(E.SEMANTIC), 'StackStorm should not have E-SEMANTIC')
  })

  test('BlueEdge detects all four capabilities', () => {
    const report = loadSpecimen('blueedge', 'run_blueedge_genesis_e2e_03')
    const { capabilities } = detectEvidenceCapabilities(report)
    assert.ok(capabilities.has(E.STRUCTURAL))
    assert.ok(capabilities.has(E.RUNTIME))
    assert.ok(capabilities.has(E.SEMANTIC))
    assert.ok(capabilities.has(E.GOVERNED))
  })

  test('empty report detects nothing', () => {
    const { capabilities } = detectEvidenceCapabilities({})
    assert.equal(capabilities.size, 0)
  })

  test('structural-only specimen has no E-RUNTIME', () => {
    const spec = resolveSpecimen('stackstorm', 'run_github_st2_20260520_131000')
    const noRuntime = qualifyDomainBacking(spec, null, [], {})
    const { capabilities } = detectEvidenceCapabilities(noRuntime)
    assert.ok(capabilities.has(E.STRUCTURAL))
    assert.ok(!capabilities.has(E.RUNTIME))
  })
})

describe('Projection Level Derivation', () => {
  test('E-STRUCTURAL only → P1', () => {
    assert.equal(deriveProjectionLevel(new Set([E.STRUCTURAL])), P.P1)
  })

  test('E-STRUCTURAL + E-RUNTIME → P2', () => {
    assert.equal(deriveProjectionLevel(new Set([E.STRUCTURAL, E.RUNTIME])), P.P2)
  })

  test('E-SEMANTIC without E-RUNTIME → P3', () => {
    assert.equal(deriveProjectionLevel(new Set([E.STRUCTURAL, E.SEMANTIC])), P.P3)
  })

  test('all capabilities → P4', () => {
    assert.equal(deriveProjectionLevel(new Set([E.STRUCTURAL, E.RUNTIME, E.SEMANTIC, E.GOVERNED])), P.P4)
  })

  test('empty → P0', () => {
    assert.equal(deriveProjectionLevel(new Set()), P.P0)
  })
})

describe('Condition Authority Classification', () => {
  test('structural conditions are P1', () => {
    assert.equal(classifyConditionAuthority('STRUCTURAL_MASS_CONCENTRATION'), P.P1)
    assert.equal(classifyConditionAuthority('COUPLING_INERTIA'), P.P1)
    assert.equal(classifyConditionAuthority('GOVERNANCE_COVERAGE_STATUS'), P.P1)
  })

  test('execution/runtime conditions are P2', () => {
    assert.equal(classifyConditionAuthority('EXECUTION_FRAGILITY'), P.P2)
    assert.equal(classifyConditionAuthority('EXECUTION_CONSTRICTION'), P.P2)
    assert.equal(classifyConditionAuthority('EVENT_CONCENTRATION'), P.P2)
    assert.equal(classifyConditionAuthority('BROKER_DEPENDENCY'), P.P2)
  })

  test('signal-driven conditions are P3', () => {
    assert.equal(classifyConditionAuthority('DELIVERY_PRESSURE_CONCENTRATION'), P.P3)
    assert.equal(classifyConditionAuthority('DEPENDENCY_CHOKE_POINT'), P.P3)
    assert.equal(classifyConditionAuthority('PROPAGATION_ASYMMETRY'), P.P3)
  })

  test('COMPOUND_CONVERGENCE returns null (composite)', () => {
    assert.equal(classifyConditionAuthority('COMPOUND_CONVERGENCE'), null)
  })
})

describe('Condition Authorization', () => {
  test('P1 rejects EXECUTION_FRAGILITY', () => {
    const conditions = [{ condition_type: 'EXECUTION_FRAGILITY', severity: 'HIGH' }]
    const { authorized, violations } = authorizeConditions(conditions, P.P1)
    assert.equal(authorized.length, 0)
    assert.equal(violations.length, 1)
    assert.equal(violations[0].condition_type, 'EXECUTION_FRAGILITY')
  })

  test('P2 rejects EXECUTION_FRAGILITY from structural enrichment (Doctrine B)', () => {
    const conditions = [{ condition_type: 'EXECUTION_FRAGILITY', severity: 'HIGH', evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED' }]
    const { authorized, violations } = authorizeConditions(conditions, P.P2)
    assert.equal(authorized.length, 0, 'Structural enrichment cannot prove execution authority')
    assert.equal(violations.length, 1)
    assert.equal(violations[0].violation_type, 'EVIDENCE_LINEAGE')
  })

  test('P2 accepts EXECUTION_FRAGILITY from runtime evidence', () => {
    const conditions = [{ condition_type: 'EXECUTION_FRAGILITY', severity: 'HIGH', evidence_mode: 'RUNTIME_EVIDENCE' }]
    const { authorized, violations } = authorizeConditions(conditions, P.P2)
    assert.equal(authorized.length, 1)
    assert.equal(violations.length, 0)
  })

  test('P1 accepts STRUCTURAL_MASS_CONCENTRATION', () => {
    const conditions = [{ condition_type: 'STRUCTURAL_MASS_CONCENTRATION', severity: 'HIGH' }]
    const { authorized } = authorizeConditions(conditions, P.P1)
    assert.equal(authorized.length, 1)
  })

  test('compound convergence inherits max constituent authority', () => {
    const conditions = [
      { condition_id: 'ef-1', condition_type: 'EXECUTION_FRAGILITY', severity: 'HIGH' },
      { condition_id: 'cc-1', condition_type: 'COMPOUND_CONVERGENCE', severity: 'CRITICAL', contributing_condition_ids: ['ef-1'] },
    ]
    const { violations } = authorizeConditions(conditions, P.P1)
    const ccViolation = violations.find(v => v.condition_type === 'COMPOUND_CONVERGENCE')
    assert.ok(ccViolation, 'COMPOUND_CONVERGENCE with P2 constituent should violate at P1')
  })
})

describe('Full Projection Authority — StackStorm', () => {
  test('StackStorm with runtime: P2, evidence lineage violations for structural-derived execution claims', () => {
    const report = loadSpecimen('stackstorm', 'run_github_st2_20260520_131000')
    const auth = computeProjectionAuthority(report)
    assert.equal(auth.projectionLevel, P.P2)
    assert.equal(auth.qualificationState, 'S1')
    assert.ok(auth.runtimePresent)
    assert.ok(auth.runtimeQualified)
    assert.ok(auth.violationCount > 0, 'Doctrine B: EXECUTION_FRAGILITY from structural enrichment must violate')
    const lineageViolations = auth.violations.filter(v => v.violation_type === 'EVIDENCE_LINEAGE')
    assert.ok(lineageViolations.length > 0, 'Must have EVIDENCE_LINEAGE violations')
    const execFragViolation = lineageViolations.find(v => v.condition_type === 'EXECUTION_FRAGILITY')
    assert.ok(execFragViolation, 'EXECUTION_FRAGILITY from structural enrichment must be flagged')
    assert.equal(execFragViolation.proven_level, P.P1, 'Structural enrichment proves P1')
    assert.equal(execFragViolation.requested_level, P.P2, 'EXECUTION_FRAGILITY requests P2')
  })

  test('StackStorm runtime-derived conditions are authorized', () => {
    const report = loadSpecimen('stackstorm', 'run_github_st2_20260520_131000')
    const auth = computeProjectionAuthority(report)
    const runtimeViolation = auth.violations.find(v => v.condition_type === 'EVENT_CONCENTRATION' || v.condition_type === 'BROKER_DEPENDENCY')
    assert.equal(runtimeViolation, undefined, 'Runtime-derived conditions with RUNTIME_EVIDENCE mode should be authorized at P2')
  })

  test('StackStorm without runtime: P1, all execution conditions violated', () => {
    const spec = resolveSpecimen('stackstorm', 'run_github_st2_20260520_131000')
    const noRuntime = qualifyDomainBacking(spec, null, [], {})
    const synResult = synthesize(noRuntime)
    noRuntime._synthesisResult = synResult
    const auth = computeProjectionAuthority(noRuntime)
    assert.equal(auth.projectionLevel, P.P1)
    assert.ok(auth.violationCount > 0, 'P1 should have violations')
    assert.ok(!auth.runtimeQualified)
  })
})

describe('Full Projection Authority — BlueEdge', () => {
  test('BlueEdge: P4, evidence lineage violations for structural-derived conditions', () => {
    const report = loadSpecimen('blueedge', 'run_blueedge_genesis_e2e_03')
    const auth = computeProjectionAuthority(report)
    assert.equal(auth.projectionLevel, P.P4)
    assert.ok(auth.evidenceCapabilities.includes(E.GOVERNED))
    const lineageOnly = auth.violations.filter(v => v.violation_type === 'EVIDENCE_LINEAGE')
    assert.ok(lineageOnly.length > 0, 'BlueEdge has structural-derived conditions claiming P2/P3 authority')
    assert.equal(auth.violations.filter(v => v.violation_type === 'SPECIMEN_AUTHORITY').length, 0, 'No specimen-level violations at P4')
  })

  test('BlueEdge runtime-derived conditions are authorized', () => {
    const report = loadSpecimen('blueedge', 'run_blueedge_genesis_e2e_03')
    const auth = computeProjectionAuthority(report)
    const runtimeTypes = ['EVENT_CONCENTRATION', 'BROKER_DEPENDENCY', 'TOPIC_FANOUT_PRESSURE', 'RUNTIME_DEPENDENCY_CHOKE_POINT', 'ASYNC_PROPAGATION_ASYMMETRY', 'EDGE_CLOUD_PROPAGATION_RISK']
    for (const rt of runtimeTypes) {
      const v = auth.violations.find(x => x.condition_type === rt)
      if (v) assert.notEqual(v.proven_label, 'P2 — Runtime Interpretation', `Runtime condition ${rt} should prove P2 from RUNTIME_EVIDENCE`)
    }
  })
})

describe('Consumer Authority Checks', () => {
  test('EB narrative mode requires P2', () => {
    assert.ok(!isNarrativeModeAuthorized('EXECUTION_BLINDNESS', P.P1))
    assert.ok(isNarrativeModeAuthorized('EXECUTION_BLINDNESS', P.P2))
  })

  test('SI narrative mode authorized at P1', () => {
    assert.ok(isNarrativeModeAuthorized('STRUCTURAL_INTELLIGENCE', P.P1))
  })

  test('EXECUTION_FRAGILITY not authorized at P1', () => {
    assert.ok(!isConditionTypeAuthorized('EXECUTION_FRAGILITY', P.P1))
    assert.ok(isConditionTypeAuthorized('EXECUTION_FRAGILITY', P.P2))
  })

  test('STRUCTURAL_MASS_CONCENTRATION authorized at P1', () => {
    assert.ok(isConditionTypeAuthorized('STRUCTURAL_MASS_CONCENTRATION', P.P1))
  })
})

describe('Runtime Present vs Qualified', () => {
  test('runtime present but not in evidence → not qualified', () => {
    const report = { _runtime_signals: [{ signal_id: 'RSIG-001' }] }
    const auth = computeProjectionAuthority(report)
    assert.ok(auth.runtimePresent, 'runtime signals are present')
    assert.ok(!auth.runtimeQualified, 'no E-STRUCTURAL → E-RUNTIME not granted')
    assert.equal(auth.projectionLevel, P.P0)
  })
})

describe('Doctrine B — Evidence Lineage Authority', () => {
  test('proven authority derives from evidence_mode, not specimen level', () => {
    const conditions = [
      { condition_type: 'EXECUTION_FRAGILITY', severity: 'HIGH', evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED' },
      { condition_type: 'EVENT_CONCENTRATION', severity: 'ELEVATED', evidence_mode: 'RUNTIME_EVIDENCE' },
      { condition_type: 'STRUCTURAL_MASS_CONCENTRATION', severity: 'HIGH', evidence_mode: 'TOPOLOGY_DRIVEN' },
    ]
    assert.equal(resolveProvenAuthority(conditions[0], conditions), P.P1, 'Structural enrichment proves P1')
    assert.equal(resolveProvenAuthority(conditions[1], conditions), P.P2, 'Runtime evidence proves P2')
    assert.equal(resolveProvenAuthority(conditions[2], conditions), P.P1, 'Topology driven proves P1')
  })

  test('structural enrichment cannot prove execution authority', () => {
    const conditions = [{ condition_type: 'EXECUTION_FRAGILITY', severity: 'HIGH', evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED' }]
    const { violations } = authorizeConditions(conditions, P.P4)
    assert.equal(violations.length, 1, 'Even at P4, structural evidence cannot prove P2 execution claims')
    assert.equal(violations[0].violation_type, 'EVIDENCE_LINEAGE')
  })

  test('signal-driven evidence proves P3', () => {
    const conditions = [{ condition_type: 'DELIVERY_PRESSURE_CONCENTRATION', severity: 'HIGH', evidence_mode: 'SIGNAL_DRIVEN' }]
    const { authorized } = authorizeConditions(conditions, P.P3)
    assert.equal(authorized.length, 1, 'Signal-driven evidence should prove P3 for P3-required condition')
  })

  test('violation includes both requested and proven levels', () => {
    const conditions = [{ condition_type: 'EXECUTION_FRAGILITY', severity: 'HIGH', evidence_mode: 'STRUCTURAL_ENRICHMENT_DERIVED' }]
    const { violations } = authorizeConditions(conditions, P.P2)
    assert.equal(violations[0].requested_level, P.P2)
    assert.equal(violations[0].proven_level, P.P1)
    assert.equal(violations[0].specimen_level, P.P2)
    assert.equal(violations[0].violation_type, 'EVIDENCE_LINEAGE')
  })
})

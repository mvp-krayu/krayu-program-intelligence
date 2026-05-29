'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const {
  investigate,
  verifyEvidenceAnchors,
  verifyDerivationTraces,
  verifyConsequenceRules,
  verifyCombinationPatterns,
  verifyCompilationIntegrity,
  verifyReplay,
  SECTION_4_RULES,
  SECTION_5_2_PATTERNS,
} = require('../InvestigationVerifier')

const { compile, CONSEQUENCE_VOCABULARY } = require('../ConsequenceCompiler')

// ─── Test Fixtures ────────────────────────────────────

function makeCondition(id, type, severity, signalIds) {
  return {
    condition_id: id,
    condition_type: type,
    severity,
    governance_boundary: 'GOVERNED',
    supporting_signal_ids: signalIds || [],
    shared_topology_targets: { domains: ['dom-a'], clusters: [], files: [] },
    pressure_zone_id: 'pz-1',
  }
}

function makeSignal(id) {
  return { signal_id: id, signal_name: id, severity: 'HIGH', signal_value: 0.8 }
}

function makeAtomicConsequence(id, typeId, condId, condType, signalIds) {
  return {
    consequence_id: id,
    consequence_type_id: typeId,
    operator_consequence_title: CONSEQUENCE_VOCABULARY[typeId].operator_consequence_title,
    severity: 'HIGH',
    confidence: 'GOVERNED',
    consequence_scope: 'REGIONAL',
    activation_rule: '§4 ' + condType + ' → ' + typeId,
    combination_pattern: null,
    escalation_applied: false,
    escalation_reason: null,
    source_conditions: [condId],
    source_condition_types: [condType],
    source_signal_ids: signalIds || [],
    evidence_refs: [{ type: 'condition', id: condId, condition_type: condType }],
    evidence_summary: { condition_count: 1, condition_types: [condType], source_signal_families: [] },
    derivation_trace: [{
      source_id: condId,
      source_type: condType,
      rule: '§4',
      target_id: typeId,
      target_type: 'consequence',
    }],
    primary_locus: { domains: ['dom-a'], clusters: [], files: [] },
    decomposition: null,
    pressure_zone_id: 'pz-1',
  }
}

function makeCombinationConsequence(id, patternId, contributing, escalate) {
  const allCondTypes = new Set()
  const allSignalIds = []
  const allEvidenceRefs = []
  const allTraceSteps = []
  for (const c of contributing) {
    for (const t of (c.source_condition_types || [])) allCondTypes.add(t)
    allSignalIds.push(...(c.source_signal_ids || []))
    allEvidenceRefs.push(...(c.evidence_refs || []))
    allTraceSteps.push(...(c.derivation_trace || []))
  }
  const baseSev = 'HIGH'
  const severity = escalate ? 'CRITICAL' : baseSev

  return {
    consequence_id: id,
    consequence_type_id: patternId,
    operator_consequence_title: CONSEQUENCE_VOCABULARY[patternId].operator_consequence_title,
    severity,
    confidence: 'GOVERNED',
    consequence_scope: patternId === 'SYSTEMIC_OP_FRAG' ? 'SYSTEMIC' : 'REGIONAL',
    activation_rule: '§5.2 ' + patternId,
    combination_pattern: patternId,
    escalation_applied: escalate,
    escalation_reason: escalate ? 'test escalation' : null,
    source_conditions: contributing.flatMap(c => c.source_conditions),
    source_condition_types: [...allCondTypes],
    source_signal_ids: [...new Set(allSignalIds)],
    evidence_refs: [
      ...allEvidenceRefs,
      ...contributing.map(c => ({ type: 'consequence', id: c.consequence_id, condition_type: c.consequence_type_id })),
    ],
    evidence_summary: { condition_count: contributing.length, condition_types: [...allCondTypes], source_signal_families: [] },
    derivation_trace: [
      ...allTraceSteps,
      { source_id: contributing.map(c => c.consequence_type_id).join(' + '), source_type: 'combination', rule: escalate ? '§5.2 + §6.1' : '§5.2', target_id: patternId, target_type: 'consequence' },
    ],
    primary_locus: { domains: ['dom-a'], clusters: [], files: [] },
    decomposition: {
      contributing_primitive_consequences: contributing.map(c => c.consequence_id),
      decomposition_available: true,
    },
    pressure_zone_id: 'pz-1',
  }
}

function makeConsequenceResult(consequences, atomics) {
  const combinations = consequences.filter(c => c.combination_pattern)
  return {
    consequences,
    atomic_consequences: atomics || consequences.filter(c => !c.combination_pattern),
    combination_consequences: combinations.map(c => c.consequence_id),
    consequence_count: consequences.length,
    systemic_count: consequences.filter(c => c.consequence_scope === 'SYSTEMIC').length,
    primary_consequence: consequences.length > 0 ? consequences[0].consequence_id : null,
    compilation_trace: {
      input_condition_count: 3,
      conditions_producing_consequences: 3,
      suppressed_conditions: 0,
      combination_patterns_matched: combinations.length,
      escalations_applied: combinations.filter(c => c.escalation_applied).length,
    },
  }
}

function makeSynthesis(conditions) {
  return {
    conditions,
    active: conditions.filter(c => c.severity !== 'NOMINAL'),
    suppressed: conditions.filter(c => c.severity === 'NOMINAL'),
    summary: { total_conditions: conditions.length },
  }
}

function makeReport(signalIds) {
  return {
    signal_interpretations: signalIds.map(makeSignal),
  }
}

// ─── Canonical valid fixture ──────────────────────────

const COND_DPC = makeCondition('dpc-dom-a', 'DELIVERY_PRESSURE_CONCENTRATION', 'HIGH', ['PSIG-001', 'PSIG-002', 'PSIG-003'])
const COND_DCKP = makeCondition('dck-dom-a', 'DEPENDENCY_CHOKE_POINT', 'HIGH', ['DPSIG-001'])
const COND_PA = makeCondition('pa-dom-a', 'PROPAGATION_ASYMMETRY', 'HIGH', ['PSIG-004'])

const ATOM_COORD = makeAtomicConsequence('csq-coord-frag-dom-a', 'COORD_FRAG', 'dpc-dom-a', 'DELIVERY_PRESSURE_CONCENTRATION', ['PSIG-001', 'PSIG-002', 'PSIG-003'])
const ATOM_DEL = makeAtomicConsequence('csq-del-exp-dom-a', 'DEL_EXP', 'dpc-dom-a', 'DELIVERY_PRESSURE_CONCENTRATION', ['PSIG-001', 'PSIG-002', 'PSIG-003'])
const ATOM_DEP = makeAtomicConsequence('csq-dep-amp-dom-a', 'DEP_AMP', 'dck-dom-a', 'DEPENDENCY_CHOKE_POINT', ['DPSIG-001'])
const ATOM_PROP = makeAtomicConsequence('csq-prop-exp-dom-a', 'PROP_EXP', 'pa-dom-a', 'PROPAGATION_ASYMMETRY', ['PSIG-004'])

const COMBO_AMP = makeCombinationConsequence('csq-amplified-dep-frag-dom-a', 'AMPLIFIED_DEP_FRAG', [ATOM_COORD, ATOM_DEP], false)

const VALID_SYNTHESIS = makeSynthesis([COND_DPC, COND_DCKP, COND_PA])
const VALID_REPORT = makeReport(['PSIG-001', 'PSIG-002', 'PSIG-003', 'DPSIG-001', 'PSIG-004'])

const ALL_ATOMICS = [ATOM_COORD, ATOM_DEL, ATOM_DEP, ATOM_PROP]
const VALID_RESULT = makeConsequenceResult([COMBO_AMP, ATOM_PROP], ALL_ATOMICS)

// ─── Static Rule Tables ───────────────────────────────

describe('Static rule tables', () => {
  it('§4 covers all 7 condition types', () => {
    const expected = [
      'DELIVERY_PRESSURE_CONCENTRATION', 'DEPENDENCY_CHOKE_POINT',
      'PROPAGATION_ASYMMETRY', 'STRUCTURAL_MASS_CONCENTRATION',
      'CROSS_DOMAIN_COUPLING_PRESSURE', 'GOVERNANCE_COVERAGE_STATUS',
      'COMPOUND_CONVERGENCE',
    ]
    for (const ct of expected) {
      assert.ok(SECTION_4_RULES[ct], `§4 missing rule for ${ct}`)
    }
  })

  it('§5.2 covers all 3 combination patterns', () => {
    assert.ok(SECTION_5_2_PATTERNS.AMPLIFIED_DEP_FRAG)
    assert.ok(SECTION_5_2_PATTERNS.STRUCT_GRAVITY_WELL)
    assert.ok(SECTION_5_2_PATTERNS.SYSTEMIC_OP_FRAG)
  })

  it('§4 rule entries have correct shape', () => {
    for (const [ct, rules] of Object.entries(SECTION_4_RULES)) {
      for (const r of rules) {
        assert.ok(r.consequence_type, `${ct} rule missing consequence_type`)
        assert.ok(CONSEQUENCE_VOCABULARY[r.consequence_type], `${ct} → ${r.consequence_type} not in CONSEQUENCE_VOCABULARY`)
      }
    }
  })
})

// ─── Step 1: Evidence Anchor ──────────────────────────

describe('Step 1 — Evidence Anchor Verification', () => {
  it('PASS: all evidence refs resolve', () => {
    const result = verifyEvidenceAnchors(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT)
    assert.equal(result.verdict, 'PASS')
    assert.equal(result.failures.length, 0)
  })

  it('FAIL: orphaned condition ref', () => {
    const badAtom = { ...ATOM_COORD, evidence_refs: [{ type: 'condition', id: 'cond-nonexistent', condition_type: 'DPC' }] }
    const badResult = makeConsequenceResult([badAtom], [badAtom])
    const result = verifyEvidenceAnchors(badResult, VALID_SYNTHESIS, VALID_REPORT)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'ORPHANED_CONDITION_REF'))
  })

  it('FAIL: orphaned signal ref', () => {
    const badAtom = { ...ATOM_COORD, source_signal_ids: ['GHOST-999'] }
    const badResult = makeConsequenceResult([badAtom], [badAtom])
    const result = verifyEvidenceAnchors(badResult, VALID_SYNTHESIS, VALID_REPORT)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'ORPHANED_SIGNAL_REF'))
  })

  it('FAIL: orphaned consequence ref in combination', () => {
    const badCombo = { ...COMBO_AMP, evidence_refs: [{ type: 'consequence', id: 'csq-ghost', condition_type: 'X' }] }
    const badResult = makeConsequenceResult([badCombo], ALL_ATOMICS)
    const result = verifyEvidenceAnchors(badResult, VALID_SYNTHESIS, VALID_REPORT)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'ORPHANED_CONSEQUENCE_REF'))
  })

  it('INSUFFICIENT: no synthesis and no report', () => {
    const result = verifyEvidenceAnchors(VALID_RESULT, { conditions: [] }, { signal_interpretations: [] })
    assert.equal(result.verdict, 'INSUFFICIENT')
  })
})

// ─── Step 2: Derivation Trace ─────────────────────────

describe('Step 2 — Derivation Trace Verification', () => {
  it('PASS: valid traces', () => {
    const result = verifyDerivationTraces(VALID_RESULT, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'PASS')
    assert.equal(result.failures.length, 0)
  })

  it('FAIL: missing derivation trace', () => {
    const noTrace = { ...ATOM_PROP, derivation_trace: [] }
    const badResult = makeConsequenceResult([noTrace], [noTrace])
    const result = verifyDerivationTraces(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'TRACE_INCOMPLETE'))
  })

  it('FAIL: unknown rule in trace', () => {
    const badTrace = { ...ATOM_PROP, derivation_trace: [{ source_id: 'pa-dom-a', source_type: 'PROPAGATION_ASYMMETRY', rule: '§99', target_id: 'PROP_EXP', target_type: 'consequence' }] }
    const badResult = makeConsequenceResult([badTrace], [badTrace])
    const result = verifyDerivationTraces(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'RULE_MISMATCH'))
  })

  it('FAIL: trace root not a known condition', () => {
    const badTrace = { ...ATOM_PROP, derivation_trace: [{ source_id: 'ghost-cond', source_type: 'UNKNOWN', rule: '§4', target_id: 'PROP_EXP', target_type: 'consequence' }] }
    const badResult = makeConsequenceResult([badTrace], [badTrace])
    const result = verifyDerivationTraces(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'TRACE_INCOMPLETE'))
  })

  it('FAIL: trace terminal does not match consequence type', () => {
    const badTrace = { ...ATOM_PROP, derivation_trace: [{ source_id: 'pa-dom-a', source_type: 'PROPAGATION_ASYMMETRY', rule: '§4', target_id: 'COORD_FRAG', target_type: 'consequence' }] }
    const badResult = makeConsequenceResult([badTrace], [badTrace])
    const result = verifyDerivationTraces(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'RULE_MISMATCH'))
  })
})

// ─── Step 3: Consequence Rule Verification ────────────

describe('Step 3 — Consequence Rule Verification', () => {
  it('PASS: valid §4 mappings', () => {
    const result = verifyConsequenceRules(VALID_RESULT)
    assert.equal(result.verdict, 'PASS')
    assert.equal(result.failures.length, 0)
  })

  it('FAIL: invalid condition→consequence mapping', () => {
    const badAtom = makeAtomicConsequence('csq-bad', 'GOV_GAP', 'dpc-dom-a', 'DELIVERY_PRESSURE_CONCENTRATION', [])
    const badResult = makeConsequenceResult([], [badAtom])
    const result = verifyConsequenceRules(badResult)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'INVALID_MAPPING'))
  })

  it('FAIL: unknown condition type', () => {
    const badAtom = { ...ATOM_COORD, source_condition_types: ['UNKNOWN_TYPE'] }
    const badResult = makeConsequenceResult([], [badAtom])
    const result = verifyConsequenceRules(badResult)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'INVALID_MAPPING'))
  })
})

// ─── Step 4: Combination Pattern Verification ─────────

describe('Step 4 — Combination Pattern Verification', () => {
  it('PASS: valid AMPLIFIED_DEP_FRAG combination', () => {
    const result = verifyCombinationPatterns(VALID_RESULT)
    assert.equal(result.verdict, 'PASS')
    assert.equal(result.failures.length, 0)
  })

  it('FAIL: unknown combination pattern', () => {
    const badCombo = {
      ...COMBO_AMP,
      consequence_id: 'csq-fake',
      consequence_type_id: 'FAKE_PATTERN',
      combination_pattern: 'FAKE_PATTERN',
    }
    const badResult = makeConsequenceResult([badCombo], ALL_ATOMICS)
    const result = verifyCombinationPatterns(badResult)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'INVALID_COMBINATION'))
  })

  it('FAIL: contributing consequence not in atomics', () => {
    const badCombo = { ...COMBO_AMP, decomposition: { contributing_primitive_consequences: ['csq-ghost-1', 'csq-ghost-2'], decomposition_available: true } }
    const badResult = makeConsequenceResult([badCombo], ALL_ATOMICS)
    const result = verifyCombinationPatterns(badResult)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'CONTRIBUTING_MISMATCH'))
  })

  it('FAIL: escalation required but not applied', () => {
    const sysCombo = makeCombinationConsequence('csq-systemic', 'SYSTEMIC_OP_FRAG', [ATOM_COORD, ATOM_DEP, ATOM_PROP], true)
    sysCombo.escalation_applied = false
    const badResult = makeConsequenceResult([sysCombo], ALL_ATOMICS)
    const result = verifyCombinationPatterns(badResult)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'ESCALATION_ERROR'))
  })

  it('FAIL: escalation applied but not required', () => {
    const badCombo = { ...COMBO_AMP, escalation_applied: true }
    const badResult = makeConsequenceResult([badCombo], ALL_ATOMICS)
    const result = verifyCombinationPatterns(badResult)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'ESCALATION_ERROR'))
  })
})

// ─── Step 5: Compilation Integrity ────────────────────

describe('Step 5 — Compilation Integrity Verification', () => {
  it('PASS: consistent compilation result', () => {
    const result = verifyCompilationIntegrity(VALID_RESULT, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'PASS')
    assert.equal(result.failures.length, 0)
  })

  it('FAIL: consequence_count mismatch', () => {
    const badResult = { ...VALID_RESULT, consequence_count: 99 }
    const result = verifyCompilationIntegrity(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'COUNT_MISMATCH'))
  })

  it('FAIL: systemic_count mismatch', () => {
    const badResult = { ...VALID_RESULT, systemic_count: 99 }
    const result = verifyCompilationIntegrity(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'COUNT_MISMATCH'))
  })

  it('FAIL: primary_consequence mismatch', () => {
    const badResult = { ...VALID_RESULT, primary_consequence: 'csq-nonexistent' }
    const result = verifyCompilationIntegrity(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'PRIMARY_MISMATCH'))
  })

  it('FAIL: severity ordering violation', () => {
    const lowSev = { ...ATOM_PROP, severity: 'NOMINAL' }
    const highSev = { ...ATOM_COORD, severity: 'CRITICAL' }
    const badResult = makeConsequenceResult([lowSev, highSev], [lowSev, highSev])
    const result = verifyCompilationIntegrity(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'ORDERING_VIOLATION'))
  })

  it('FAIL: input_condition_count mismatch', () => {
    const badResult = { ...VALID_RESULT, compilation_trace: { ...VALID_RESULT.compilation_trace, input_condition_count: 99 } }
    const result = verifyCompilationIntegrity(badResult, VALID_SYNTHESIS)
    assert.equal(result.verdict, 'FAIL')
    assert.ok(result.failures.some(f => f.failure_type === 'COUNT_MISMATCH'))
  })
})

// ─── Replay ───────────────────────────────────────────

describe('Replay verification', () => {
  it('REPLAY_MATCH when compile reproduces identical result', () => {
    const mockCompile = () => VALID_RESULT
    const result = verifyReplay(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT, mockCompile)
    assert.equal(result.verdict, 'REPLAY_MATCH')
    assert.equal(result.divergences.length, 0)
  })

  it('REPLAY_DIVERGENCE when counts differ', () => {
    const divergentCompile = () => ({ ...VALID_RESULT, consequence_count: 99, consequences: VALID_RESULT.consequences })
    const result = verifyReplay(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT, divergentCompile)
    assert.equal(result.verdict, 'REPLAY_DIVERGENCE')
    assert.ok(result.divergences.length > 0)
  })

  it('REPLAY_ERROR when compile throws', () => {
    const errorCompile = () => { throw new Error('boom') }
    const result = verifyReplay(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT, errorCompile)
    assert.equal(result.verdict, 'REPLAY_ERROR')
    assert.ok(result.error)
  })

  it('INSUFFICIENT when no compile function', () => {
    const result = verifyReplay(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT, null)
    assert.equal(result.verdict, 'INSUFFICIENT')
  })
})

// ─── Overall Verdict ──────────────────────────────────

describe('Overall investigation verdict', () => {
  it('VERIFIED: all steps pass', () => {
    const result = investigate(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT)
    assert.equal(result.verdict, 'VERIFIED')
    assert.equal(result.failure_count, 0)
    assert.equal(result.steps.length, 5)
    for (const step of result.steps) {
      assert.equal(step.verdict, 'PASS', `Step ${step.step} (${step.name}) should PASS`)
    }
  })

  it('VERIFICATION_FAILED: at least one step fails', () => {
    const badAtom = { ...ATOM_COORD, evidence_refs: [{ type: 'condition', id: 'ghost', condition_type: 'X' }] }
    const badResult = makeConsequenceResult([badAtom], [badAtom])
    badResult.compilation_trace.combination_patterns_matched = 0
    badResult.compilation_trace.escalations_applied = 0
    const result = investigate(badResult, VALID_SYNTHESIS, VALID_REPORT)
    assert.equal(result.verdict, 'VERIFICATION_FAILED')
    assert.ok(result.failure_count > 0)
  })

  it('PARTIALLY_VERIFIED: no fails but insufficient evidence', () => {
    const cleanAtom = {
      ...ATOM_PROP,
      evidence_refs: [],
      source_signal_ids: [],
      derivation_trace: [{
        source_id: 'pa-dom-a',
        source_type: 'PROPAGATION_ASYMMETRY',
        rule: '§4',
        target_id: 'PROP_EXP',
        target_type: 'consequence',
      }],
    }
    const minimalResult = {
      consequences: [cleanAtom],
      atomic_consequences: [cleanAtom],
      combination_consequences: [],
      consequence_count: 1,
      systemic_count: 0,
      primary_consequence: cleanAtom.consequence_id,
      compilation_trace: {
        input_condition_count: 0,
        conditions_producing_consequences: 0,
        suppressed_conditions: 0,
        combination_patterns_matched: 0,
        escalations_applied: 0,
      },
    }
    const emptySynthesis = { conditions: [] }
    const emptyReport = { signal_interpretations: [] }
    const result = investigate(minimalResult, emptySynthesis, emptyReport)
    assert.equal(result.verdict, 'PARTIALLY_VERIFIED')
    assert.ok(result.steps.some(s => s.verdict === 'INSUFFICIENT'))
    assert.ok(!result.steps.some(s => s.verdict === 'FAIL'))
  })

  it('CANNOT_INVESTIGATE: null consequence result', () => {
    const result = investigate(null, VALID_SYNTHESIS, VALID_REPORT)
    assert.equal(result.verdict, 'CANNOT_INVESTIGATE')
  })

  it('targeted investigation scopes to single consequence', () => {
    const result = investigate(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT, { targetConsequenceId: COMBO_AMP.consequence_id })
    assert.equal(result.target, COMBO_AMP.consequence_id)
    assert.equal(result.steps.length, 5)
  })

  it('targeted investigation CANNOT_INVESTIGATE for unknown target', () => {
    const result = investigate(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT, { targetConsequenceId: 'csq-nonexistent' })
    assert.equal(result.verdict, 'CANNOT_INVESTIGATE')
  })

  it('replay runs when compileFn provided in full investigation', () => {
    const mockCompile = () => VALID_RESULT
    const result = investigate(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT, { compileFn: mockCompile })
    assert.ok(result.replay)
    assert.equal(result.replay.verdict, 'REPLAY_MATCH')
  })

  it('replay skipped for targeted investigation', () => {
    const mockCompile = () => VALID_RESULT
    const result = investigate(VALID_RESULT, VALID_SYNTHESIS, VALID_REPORT, { targetConsequenceId: COMBO_AMP.consequence_id, compileFn: mockCompile })
    assert.equal(result.replay, null)
  })
})

// ─── forInvestigation projection ──────────────────────

describe('forInvestigation projection', () => {
  const { forInvestigation } = require('../ConsequenceCompiler')

  it('forInvestigation is a function', () => {
    assert.equal(typeof forInvestigation, 'function')
  })

  it('returns null for null input', () => {
    assert.equal(forInvestigation(null), null)
  })

  it('projects all verification-relevant fields', () => {
    const projected = forInvestigation(VALID_RESULT, VALID_SYNTHESIS)
    assert.ok(projected)
    assert.equal(projected.consequence_count, VALID_RESULT.consequence_count)
    assert.equal(projected.systemic_count, VALID_RESULT.systemic_count)
    assert.equal(projected.primary_consequence, VALID_RESULT.primary_consequence)
    assert.ok(projected.compilation_trace)
    assert.ok(projected.atomic_consequences)
    assert.ok(projected.combination_consequences)

    const first = projected.consequences[0]
    assert.ok(first.derivation_trace)
    assert.ok(first.evidence_refs)
    assert.ok(first.source_condition_types)
    assert.ok(first.source_signal_ids !== undefined)
    assert.ok(first.activation_rule)
  })

  it('preserves synthesis condition count', () => {
    const projected = forInvestigation(VALID_RESULT, VALID_SYNTHESIS)
    assert.equal(projected.synthesis_condition_count, VALID_SYNTHESIS.conditions.length)
  })
})

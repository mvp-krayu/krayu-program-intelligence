'use strict'

const { CONSEQUENCE_VOCABULARY } = require('./ConsequenceCompiler')

// ─── §4 Rule Table (static verification data) ────────

const SECTION_4_RULES = {
  DELIVERY_PRESSURE_CONCENTRATION: [
    { consequence_type: 'COORD_FRAG', defining: true, conditional: false },
    { consequence_type: 'DEL_EXP', defining: true, conditional: false },
    { consequence_type: 'OP_BOTTLENECK', defining: false, conditional: true },
  ],
  DEPENDENCY_CHOKE_POINT: [
    { consequence_type: 'DEP_AMP', defining: true, conditional: false },
    { consequence_type: 'COORD_FRAG', defining: false, conditional: true },
    { consequence_type: 'OP_BOTTLENECK', defining: false, conditional: true },
  ],
  PROPAGATION_ASYMMETRY: [
    { consequence_type: 'PROP_EXP', defining: true, conditional: false },
    { consequence_type: 'DEL_EXP', defining: false, conditional: true },
  ],
  STRUCTURAL_MASS_CONCENTRATION: [
    { consequence_type: 'RESIL_DEF', defining: true, conditional: false },
    { consequence_type: 'STAB_RISK', defining: false, conditional: true },
  ],
  CROSS_DOMAIN_COUPLING_PRESSURE: [
    { consequence_type: 'COORD_FRAG', defining: true, conditional: false },
    { consequence_type: 'PROP_EXP', defining: false, conditional: true },
  ],
  GOVERNANCE_COVERAGE_STATUS: [
    { consequence_type: 'GOV_GAP', defining: true, conditional: true },
  ],
  EXECUTION_FRAGILITY: [
    { consequence_type: 'RESIL_DEF', defining: true, conditional: false },
    { consequence_type: 'COORD_FRAG', defining: false, conditional: true },
    { consequence_type: 'DEP_AMP', defining: false, conditional: true },
  ],
  EXECUTION_CONSTRICTION: [
    { consequence_type: 'OP_BOTTLENECK', defining: true, conditional: false },
    { consequence_type: 'COORD_FRAG', defining: false, conditional: true },
    { consequence_type: 'DEP_AMP', defining: false, conditional: true },
  ],
  COMPOUND_CONVERGENCE: [
    { consequence_type: 'STAB_RISK', defining: true, conditional: false },
  ],
}

// ─── §5.2 Combination Table (static verification data) ─

const SECTION_5_2_PATTERNS = {
  AMPLIFIED_DEP_FRAG: {
    required: [
      { consequence_type: 'COORD_FRAG', from_condition: 'DELIVERY_PRESSURE_CONCENTRATION' },
      { consequence_type: 'DEP_AMP', from_condition: 'DEPENDENCY_CHOKE_POINT' },
    ],
    locus_rule: 'SAME',
    escalation: false,
    min_contributors: 2,
  },
  STRUCT_GRAVITY_WELL: {
    required: [
      { consequence_type: 'DEL_EXP', from_condition: 'DELIVERY_PRESSURE_CONCENTRATION' },
      { consequence_type: 'RESIL_DEF', from_condition: 'STRUCTURAL_MASS_CONCENTRATION' },
    ],
    locus_rule: 'SAME',
    escalation: false,
    min_contributors: 2,
  },
  SYSTEMIC_OP_FRAG: {
    required: null,
    locus_rule: 'SAME',
    escalation: true,
    min_contributors: 3,
    min_distinct_condition_types: 3,
  },
}

const SEVERITY_ESCALATION = {
  NOMINAL: 'LOW', LOW: 'MODERATE', MODERATE: 'ELEVATED',
  ELEVATED: 'HIGH', HIGH: 'CRITICAL', CRITICAL: 'CRITICAL',
}

// ─── Failure constructors ─────────────────────────────

function failure(step, check, failureType, severity, detail) {
  return { step, check, failure_type: failureType, severity, detail }
}

// ─── Step 1: Evidence Anchor Verification ─────────────

function verifyEvidenceAnchors(consequenceResult, synthesisResult, report) {
  const failures = []

  const conditionIds = new Set()
  if (synthesisResult && synthesisResult.conditions) {
    for (const c of synthesisResult.conditions) conditionIds.add(c.condition_id)
  }

  const signalIds = new Set()
  if (report && report.signal_interpretations) {
    for (const s of report.signal_interpretations) signalIds.add(s.signal_id)
  }

  const atomicIds = new Set()
  if (consequenceResult && consequenceResult.atomic_consequences) {
    for (const a of consequenceResult.atomic_consequences) atomicIds.add(a.consequence_id)
  }

  const allConsequences = [
    ...(consequenceResult.consequences || []),
    ...(consequenceResult.atomic_consequences || []),
  ]

  for (const csq of allConsequences) {
    if (csq.evidence_refs) {
      for (const ref of csq.evidence_refs) {
        if (ref.type === 'condition' && !conditionIds.has(ref.id)) {
          failures.push(failure(1, 'evidence_ref_resolution', 'ORPHANED_CONDITION_REF', 'STRUCTURAL',
            `${csq.consequence_id}: evidence_ref condition '${ref.id}' not found in synthesis conditions`))
        }
        if (ref.type === 'consequence' && !atomicIds.has(ref.id)) {
          failures.push(failure(1, 'evidence_ref_resolution', 'ORPHANED_CONSEQUENCE_REF', 'STRUCTURAL',
            `${csq.consequence_id}: evidence_ref consequence '${ref.id}' not found in atomic consequences`))
        }
      }
    }

    if (csq.source_signal_ids && signalIds.size > 0) {
      for (const sid of csq.source_signal_ids) {
        if (!signalIds.has(sid)) {
          failures.push(failure(1, 'signal_anchor', 'ORPHANED_SIGNAL_REF', 'STRUCTURAL',
            `${csq.consequence_id}: source_signal_id '${sid}' not found in report signal_interpretations`))
        }
      }
    }
  }

  if (conditionIds.size === 0 && signalIds.size === 0) {
    return { step: 1, name: 'EVIDENCE_ANCHOR', verdict: 'INSUFFICIENT', failures: [] }
  }

  return {
    step: 1,
    name: 'EVIDENCE_ANCHOR',
    verdict: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
  }
}

// ─── Step 2: Derivation Trace Replay ──────────────────

function verifyDerivationTraces(consequenceResult, synthesisResult) {
  const failures = []

  const conditionIds = new Set()
  if (synthesisResult && synthesisResult.conditions) {
    for (const c of synthesisResult.conditions) conditionIds.add(c.condition_id)
  }

  if (conditionIds.size === 0) {
    return { step: 2, name: 'DERIVATION_TRACE', verdict: 'INSUFFICIENT', failures: [] }
  }

  const validRules = new Set(['§4', '§5.2', '§5.2 + §6.1', '§6.1'])
  const validConsequenceTypes = new Set(Object.keys(CONSEQUENCE_VOCABULARY))

  const allConsequences = consequenceResult.consequences || []

  for (const csq of allConsequences) {
    if (!csq.derivation_trace || csq.derivation_trace.length === 0) {
      failures.push(failure(2, 'trace_completeness', 'TRACE_INCOMPLETE', 'COVERAGE',
        `${csq.consequence_id}: no derivation_trace present`))
      continue
    }

    const firstStep = csq.derivation_trace[0]
    if (firstStep.source_type !== 'combination' && !conditionIds.has(firstStep.source_id)) {
      failures.push(failure(2, 'trace_root', 'TRACE_INCOMPLETE', 'STRUCTURAL',
        `${csq.consequence_id}: first trace step source '${firstStep.source_id}' is not a known condition`))
    }

    for (const step of csq.derivation_trace) {
      if (!validRules.has(step.rule)) {
        failures.push(failure(2, 'rule_validity', 'RULE_MISMATCH', 'STRUCTURAL',
          `${csq.consequence_id}: trace step cites unknown rule '${step.rule}'`))
      }

      if (step.target_type === 'consequence' && !validConsequenceTypes.has(step.target_id)) {
        failures.push(failure(2, 'target_validity', 'RULE_MISMATCH', 'STRUCTURAL',
          `${csq.consequence_id}: trace step targets unknown consequence type '${step.target_id}'`))
      }
    }

    const lastStep = csq.derivation_trace[csq.derivation_trace.length - 1]
    if (lastStep.target_type === 'consequence') {
      const traceTargetType = lastStep.target_id
      if (csq.combination_pattern) {
        if (traceTargetType !== csq.combination_pattern) {
          failures.push(failure(2, 'trace_terminal', 'RULE_MISMATCH', 'CONSISTENCY',
            `${csq.consequence_id}: final trace target '${traceTargetType}' != combination_pattern '${csq.combination_pattern}'`))
        }
      } else {
        if (traceTargetType !== csq.consequence_type_id) {
          failures.push(failure(2, 'trace_terminal', 'RULE_MISMATCH', 'CONSISTENCY',
            `${csq.consequence_id}: final trace target '${traceTargetType}' != consequence_type_id '${csq.consequence_type_id}'`))
        }
      }
    }
  }

  return {
    step: 2,
    name: 'DERIVATION_TRACE',
    verdict: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
  }
}

// ─── Step 3: Consequence Rule Verification ────────────

function verifyConsequenceRules(consequenceResult) {
  const failures = []

  const atomics = consequenceResult.atomic_consequences || []

  for (const csq of atomics) {
    const condTypes = csq.source_condition_types || []

    for (const condType of condTypes) {
      const rules = SECTION_4_RULES[condType]
      if (!rules) {
        failures.push(failure(3, 'rule_existence', 'INVALID_MAPPING', 'STRUCTURAL',
          `${csq.consequence_id}: source condition type '${condType}' has no §4 rules`))
        continue
      }

      const allowed = rules.find(r => r.consequence_type === csq.consequence_type_id)
      if (!allowed) {
        failures.push(failure(3, 'mapping_validity', 'INVALID_MAPPING', 'STRUCTURAL',
          `${csq.consequence_id}: §4 does not map '${condType}' → '${csq.consequence_type_id}'`))
      }
    }
  }

  return {
    step: 3,
    name: 'CONSEQUENCE_RULES',
    verdict: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
  }
}

// ─── Step 4: Combination Pattern Verification ─────────

function verifyCombinationPatterns(consequenceResult) {
  const failures = []

  const atomicIndex = {}
  for (const a of (consequenceResult.atomic_consequences || [])) {
    atomicIndex[a.consequence_id] = a
  }

  const combinations = (consequenceResult.consequences || []).filter(c => c.combination_pattern)

  for (const combo of combinations) {
    const pattern = SECTION_5_2_PATTERNS[combo.combination_pattern]
    if (!pattern) {
      failures.push(failure(4, 'pattern_existence', 'INVALID_COMBINATION', 'STRUCTURAL',
        `${combo.consequence_id}: combination_pattern '${combo.combination_pattern}' not in §5.2`))
      continue
    }

    const contributingIds = (combo.decomposition && combo.decomposition.contributing_primitive_consequences) || []

    if (contributingIds.length < pattern.min_contributors) {
      failures.push(failure(4, 'contributor_count', 'CONTRIBUTING_MISMATCH', 'STRUCTURAL',
        `${combo.consequence_id}: requires ${pattern.min_contributors} contributors, has ${contributingIds.length}`))
    }

    for (const cid of contributingIds) {
      if (!atomicIndex[cid]) {
        failures.push(failure(4, 'contributor_existence', 'CONTRIBUTING_MISMATCH', 'STRUCTURAL',
          `${combo.consequence_id}: contributing consequence '${cid}' not found in atomics`))
      }
    }

    if (pattern.required) {
      for (const req of pattern.required) {
        const match = contributingIds.find(cid => {
          const a = atomicIndex[cid]
          if (!a) return false
          if (a.consequence_type_id !== req.consequence_type) return false
          if (req.from_condition && !(a.source_condition_types || []).includes(req.from_condition)) return false
          return true
        })
        if (!match) {
          failures.push(failure(4, 'required_contributor', 'INVALID_COMBINATION', 'STRUCTURAL',
            `${combo.consequence_id}: missing required contributor ${req.consequence_type} from ${req.from_condition}`))
        }
      }
    }

    if (pattern.min_distinct_condition_types) {
      const distinctTypes = new Set()
      for (const cid of contributingIds) {
        const a = atomicIndex[cid]
        if (a && a.source_condition_types) {
          for (const t of a.source_condition_types) {
            if (t !== 'COMPOUND_CONVERGENCE') distinctTypes.add(t)
          }
        }
      }
      if (distinctTypes.size < pattern.min_distinct_condition_types) {
        failures.push(failure(4, 'type_diversity', 'INVALID_COMBINATION', 'STRUCTURAL',
          `${combo.consequence_id}: requires ${pattern.min_distinct_condition_types} distinct condition types, has ${distinctTypes.size}`))
      }
    }

    if (pattern.escalation && !combo.escalation_applied) {
      failures.push(failure(4, 'escalation_presence', 'ESCALATION_ERROR', 'CONSISTENCY',
        `${combo.consequence_id}: pattern requires escalation but escalation_applied is false`))
    }
    if (!pattern.escalation && combo.escalation_applied) {
      failures.push(failure(4, 'escalation_absence', 'ESCALATION_ERROR', 'CONSISTENCY',
        `${combo.consequence_id}: pattern does not require escalation but escalation_applied is true`))
    }

    if (combo.escalation_applied) {
      const contributingSeverities = contributingIds
        .map(cid => atomicIndex[cid])
        .filter(Boolean)
        .map(a => a.severity)
      if (contributingSeverities.length > 0) {
        const baseSev = maxSev(contributingSeverities)
        const expected = SEVERITY_ESCALATION[baseSev] || baseSev
        if (combo.severity !== expected) {
          failures.push(failure(4, 'escalation_value', 'ESCALATION_ERROR', 'CONSISTENCY',
            `${combo.consequence_id}: escalated severity should be '${expected}', got '${combo.severity}'`))
        }
      }
    }
  }

  return {
    step: 4,
    name: 'COMBINATION_PATTERNS',
    verdict: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
  }
}

// ─── Step 5: Compilation Integrity Verification ───────

function verifyCompilationIntegrity(consequenceResult, synthesisResult) {
  const failures = []

  const trace = consequenceResult.compilation_trace || {}
  const consequences = consequenceResult.consequences || []
  const atomics = consequenceResult.atomic_consequences || []
  const combinationIds = consequenceResult.combination_consequences || []

  if (synthesisResult && synthesisResult.conditions) {
    const actualInputCount = synthesisResult.conditions.length
    if (trace.input_condition_count !== actualInputCount) {
      failures.push(failure(5, 'input_count', 'COUNT_MISMATCH', 'CONSISTENCY',
        `compilation_trace.input_condition_count (${trace.input_condition_count}) != actual (${actualInputCount})`))
    }

    const actualActive = synthesisResult.conditions.filter(c => c.severity !== 'NOMINAL').length
    if (trace.conditions_producing_consequences !== actualActive) {
      failures.push(failure(5, 'active_count', 'COUNT_MISMATCH', 'CONSISTENCY',
        `compilation_trace.conditions_producing_consequences (${trace.conditions_producing_consequences}) != actual active (${actualActive})`))
    }

    const actualSuppressed = actualInputCount - actualActive
    if (trace.suppressed_conditions !== actualSuppressed) {
      failures.push(failure(5, 'suppressed_count', 'COUNT_MISMATCH', 'CONSISTENCY',
        `compilation_trace.suppressed_conditions (${trace.suppressed_conditions}) != actual (${actualSuppressed})`))
    }
  }

  const actualCombinations = consequences.filter(c => c.combination_pattern)
  if (trace.combination_patterns_matched !== actualCombinations.length) {
    failures.push(failure(5, 'combination_count', 'COUNT_MISMATCH', 'CONSISTENCY',
      `compilation_trace.combination_patterns_matched (${trace.combination_patterns_matched}) != actual (${actualCombinations.length})`))
  }

  const actualEscalations = actualCombinations.filter(c => c.escalation_applied)
  if (trace.escalations_applied !== actualEscalations.length) {
    failures.push(failure(5, 'escalation_count', 'COUNT_MISMATCH', 'CONSISTENCY',
      `compilation_trace.escalations_applied (${trace.escalations_applied}) != actual (${actualEscalations.length})`))
  }

  if (consequenceResult.consequence_count !== consequences.length) {
    failures.push(failure(5, 'consequence_count', 'COUNT_MISMATCH', 'CONSISTENCY',
      `consequence_count (${consequenceResult.consequence_count}) != consequences.length (${consequences.length})`))
  }

  const actualSystemic = consequences.filter(c => c.consequence_scope === 'SYSTEMIC').length
  if (consequenceResult.systemic_count !== actualSystemic) {
    failures.push(failure(5, 'systemic_count', 'COUNT_MISMATCH', 'CONSISTENCY',
      `systemic_count (${consequenceResult.systemic_count}) != actual (${actualSystemic})`))
  }

  if (consequences.length > 0 && consequenceResult.primary_consequence !== consequences[0].consequence_id) {
    failures.push(failure(5, 'primary_id', 'PRIMARY_MISMATCH', 'CONSISTENCY',
      `primary_consequence '${consequenceResult.primary_consequence}' != first consequence '${consequences[0].consequence_id}'`))
  }

  const SEVERITY_RANK = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3, LOW: 4, NOMINAL: 5 }
  for (let i = 1; i < consequences.length; i++) {
    const prev = SEVERITY_RANK[consequences[i - 1].severity] ?? 5
    const curr = SEVERITY_RANK[consequences[i].severity] ?? 5
    if (curr < prev) {
      failures.push(failure(5, 'severity_ordering', 'ORDERING_VIOLATION', 'CONSISTENCY',
        `consequences[${i}] severity '${consequences[i].severity}' is higher than consequences[${i - 1}] '${consequences[i - 1].severity}'`))
      break
    }
  }

  const combinedAtomicIds = new Set()
  for (const c of consequences) {
    if (c.decomposition && c.decomposition.contributing_primitive_consequences) {
      for (const id of c.decomposition.contributing_primitive_consequences) {
        combinedAtomicIds.add(id)
      }
    }
  }
  for (const c of consequences) {
    if (!c.combination_pattern && combinedAtomicIds.has(c.consequence_id)) {
      failures.push(failure(5, 'subsumption', 'SUBSUMPTION_LEAK', 'CONSISTENCY',
        `${c.consequence_id}: appears in top-level consequences but was subsumed by a combination`))
    }
  }

  return {
    step: 5,
    name: 'COMPILATION_INTEGRITY',
    verdict: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
  }
}

// ─── Replay ───────────────────────────────────────────

function verifyReplay(consequenceResult, synthesisResult, fullReport, compileFn) {
  if (!compileFn) return { verdict: 'INSUFFICIENT', divergences: [] }

  let replayed
  try {
    replayed = compileFn(synthesisResult, fullReport)
  } catch (err) {
    return { verdict: 'REPLAY_ERROR', error: err.message, divergences: [] }
  }

  const divergences = []

  if (replayed.consequence_count !== consequenceResult.consequence_count) {
    divergences.push(`consequence_count: claim=${consequenceResult.consequence_count} replay=${replayed.consequence_count}`)
  }

  if (replayed.systemic_count !== consequenceResult.systemic_count) {
    divergences.push(`systemic_count: claim=${consequenceResult.systemic_count} replay=${replayed.systemic_count}`)
  }

  const claimIds = (consequenceResult.consequences || []).map(c => c.consequence_id).sort()
  const replayIds = (replayed.consequences || []).map(c => c.consequence_id).sort()
  if (JSON.stringify(claimIds) !== JSON.stringify(replayIds)) {
    divergences.push(`consequence_ids: claim=[${claimIds.join(',')}] replay=[${replayIds.join(',')}]`)
  }

  const claimTypes = (consequenceResult.consequences || []).map(c => c.consequence_type_id).sort()
  const replayTypes = (replayed.consequences || []).map(c => c.consequence_type_id).sort()
  if (JSON.stringify(claimTypes) !== JSON.stringify(replayTypes)) {
    divergences.push(`consequence_types: claim=[${claimTypes.join(',')}] replay=[${replayTypes.join(',')}]`)
  }

  for (const claimed of (consequenceResult.consequences || [])) {
    const match = (replayed.consequences || []).find(r => r.consequence_id === claimed.consequence_id)
    if (match && match.severity !== claimed.severity) {
      divergences.push(`${claimed.consequence_id}.severity: claim=${claimed.severity} replay=${match.severity}`)
    }
  }

  const claimTrace = consequenceResult.compilation_trace || {}
  const replayTrace = replayed.compilation_trace || {}
  for (const key of Object.keys(claimTrace)) {
    if (claimTrace[key] !== replayTrace[key]) {
      divergences.push(`compilation_trace.${key}: claim=${claimTrace[key]} replay=${replayTrace[key]}`)
    }
  }

  return {
    verdict: divergences.length === 0 ? 'REPLAY_MATCH' : 'REPLAY_DIVERGENCE',
    divergences,
  }
}

// ─── Severity helper ──────────────────────────────────

const SEVERITY_RANK_INTERNAL = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3, LOW: 4, NOMINAL: 5 }

function maxSev(severities) {
  let best = 'NOMINAL'
  for (const s of severities) {
    if ((SEVERITY_RANK_INTERNAL[s] ?? 5) < (SEVERITY_RANK_INTERNAL[best] ?? 5)) best = s
  }
  return best
}

// ─── Core: investigate() ──────────────────────────────

function investigate(consequenceResult, synthesisResult, report, options) {
  const opts = options || {}

  if (!consequenceResult || !consequenceResult.consequences) {
    return {
      verdict: 'CANNOT_INVESTIGATE',
      steps: [],
      failures: [],
      replay: null,
      target: opts.targetConsequenceId || null,
    }
  }

  let targetResult = consequenceResult
  if (opts.targetConsequenceId) {
    const targeted = consequenceResult.consequences.find(c => c.consequence_id === opts.targetConsequenceId)
    if (!targeted) {
      return {
        verdict: 'CANNOT_INVESTIGATE',
        steps: [],
        failures: [failure(0, 'target_resolution', 'TARGET_NOT_FOUND', 'STRUCTURAL',
          `Target consequence '${opts.targetConsequenceId}' not found`)],
        replay: null,
        target: opts.targetConsequenceId,
      }
    }
    targetResult = {
      ...consequenceResult,
      consequences: [targeted],
    }
  }

  const step1 = verifyEvidenceAnchors(targetResult, synthesisResult, report)
  const step2 = verifyDerivationTraces(targetResult, synthesisResult)
  const step3 = verifyConsequenceRules(targetResult)
  const step4 = verifyCombinationPatterns(targetResult)
  const step5 = opts.targetConsequenceId
    ? { step: 5, name: 'COMPILATION_INTEGRITY', verdict: 'PASS', failures: [] }
    : verifyCompilationIntegrity(consequenceResult, synthesisResult)

  const steps = [step1, step2, step3, step4, step5]
  const allFailures = steps.flatMap(s => s.failures)

  let verdict
  if (steps.some(s => s.verdict === 'FAIL')) {
    verdict = 'VERIFICATION_FAILED'
  } else if (steps.some(s => s.verdict === 'INSUFFICIENT')) {
    verdict = 'PARTIALLY_VERIFIED'
  } else {
    verdict = 'VERIFIED'
  }

  let replay = null
  if (opts.compileFn && !opts.targetConsequenceId) {
    replay = verifyReplay(consequenceResult, synthesisResult, report, opts.compileFn)
  }

  return {
    verdict,
    steps,
    failures: allFailures,
    failure_count: allFailures.length,
    replay,
    target: opts.targetConsequenceId || null,
  }
}

// ─── Projection Disposition Contract ─────────────────

const DISPOSITION = { REQUIRED: 'REQUIRED', EXEMPT: 'EXEMPT', DEFERRED: 'DEFERRED' }

const PROJECTION_DISPOSITION_TABLE = {
  DELIVERY_PRESSURE_CONCENTRATION:    { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'REQUIRED', SURFACE_CONDITION_MAP: 'REQUIRED' },
  DEPENDENCY_CHOKE_POINT:             { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'REQUIRED', SURFACE_CONDITION_MAP: 'REQUIRED' },
  PROPAGATION_ASYMMETRY:              { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'REQUIRED', SURFACE_CONDITION_MAP: 'REQUIRED' },
  STRUCTURAL_MASS_CONCENTRATION:      { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'REQUIRED', SURFACE_CONDITION_MAP: 'REQUIRED' },
  CROSS_DOMAIN_COUPLING_PRESSURE:     { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'REQUIRED', SURFACE_CONDITION_MAP: 'REQUIRED' },
  GOVERNANCE_COVERAGE_STATUS:         { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'EXEMPT',   SURFACE_CONDITION_MAP: 'REQUIRED' },
  COMPOUND_CONVERGENCE:               { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'EXEMPT',   SURFACE_CONDITION_MAP: 'REQUIRED' },
  EXECUTION_FRAGILITY:                { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'REQUIRED', SURFACE_CONDITION_MAP: 'REQUIRED' },
  EXECUTION_CONSTRICTION:             { CONDITION_VOCABULARY: 'REQUIRED', CONDITION_INTERVENTIONS: 'REQUIRED', COGNITION_SLICE_VOCABULARY: 'REQUIRED', MAP_CONDITION: 'REQUIRED', SECTION_4_RULES: 'REQUIRED', CONDITION_NODES: 'REQUIRED', DYNAMICS_GLYPH_TYPE: 'REQUIRED', SURFACE_CONDITION_MAP: 'REQUIRED' },
}

const GLYPH_EXEMPT_REASONS = {
  GOVERNANCE_COVERAGE_STATUS: 'Renders as coverage indicators (anchored/unanchored markers), not as a dynamics glyph actor',
  COMPOUND_CONVERGENCE: 'Renders as compound overlay compositing multiple primitives, not as a single dynamics glyph',
}

function verifyProjectionDisposition(registries) {
  const {
    conditionVocabulary,
    conditionInterventions,
    cognitionSliceVocabulary,
    mapConditionKeys,
    section4Rules,
    conditionNodes,
    dynamicsGlyphType,
    surfaceConditionMap,
  } = registries

  const internalTypes = new Set()
  for (const v of Object.values(conditionVocabulary)) {
    internalTypes.add(v.internal)
  }

  const surfaceMappedTypes = new Set()
  for (const condTypes of Object.values(surfaceConditionMap)) {
    for (const ct of condTypes) surfaceMappedTypes.add(ct)
  }

  const results = []
  for (const ct of internalTypes) {
    const disp = PROJECTION_DISPOSITION_TABLE[ct]
    if (!disp) {
      results.push({ condition_type: ct, verdict: 'FAIL', reason: 'No disposition entry — add to PROJECTION_DISPOSITION_TABLE', missing: ['DISPOSITION_TABLE'] })
      continue
    }

    const missing = []

    if (disp.CONDITION_INTERVENTIONS === 'REQUIRED' && !conditionInterventions[ct]) missing.push('CONDITION_INTERVENTIONS')
    if (disp.COGNITION_SLICE_VOCABULARY === 'REQUIRED' && !cognitionSliceVocabulary[ct]) missing.push('COGNITION_SLICE_VOCABULARY')
    if (disp.MAP_CONDITION === 'REQUIRED' && !mapConditionKeys.has(ct)) missing.push('MAP_CONDITION')
    if (disp.SECTION_4_RULES === 'REQUIRED' && !section4Rules[ct]) missing.push('SECTION_4_RULES')
    if (disp.CONDITION_NODES === 'REQUIRED' && !conditionNodes[ct]) missing.push('CONDITION_NODES')
    if (disp.DYNAMICS_GLYPH_TYPE === 'REQUIRED' && !dynamicsGlyphType[ct]) missing.push('DYNAMICS_GLYPH_TYPE')
    if (disp.SURFACE_CONDITION_MAP === 'REQUIRED' && !surfaceMappedTypes.has(ct)) missing.push('SURFACE_CONDITION_MAP')

    const exempt = []
    for (const [reg, status] of Object.entries(disp)) {
      if (status === 'EXEMPT') exempt.push({ registry: reg, reason: GLYPH_EXEMPT_REASONS[ct] || 'Architecturally excluded' })
    }

    if (missing.length > 0) {
      results.push({ condition_type: ct, verdict: 'FAIL', reason: `Missing from ${missing.length} required registries`, missing, exempt })
    } else {
      results.push({ condition_type: ct, verdict: 'PASS', reason: 'All required registries populated', missing: [], exempt })
    }
  }

  const allPass = results.every(r => r.verdict === 'PASS')
  return {
    step: 0,
    name: 'PROJECTION_DISPOSITION',
    verdict: allPass ? 'PASS' : 'FAIL',
    results,
    failures: results.filter(r => r.verdict === 'FAIL'),
    condition_count: internalTypes.size,
  }
}

// ─── Exports ──────────────────────────────────────────

module.exports = {
  investigate,
  verifyEvidenceAnchors,
  verifyDerivationTraces,
  verifyConsequenceRules,
  verifyCombinationPatterns,
  verifyCompilationIntegrity,
  verifyReplay,
  verifyProjectionDisposition,
  SECTION_4_RULES,
  SECTION_5_2_PATTERNS,
  PROJECTION_DISPOSITION_TABLE,
  DISPOSITION,
}

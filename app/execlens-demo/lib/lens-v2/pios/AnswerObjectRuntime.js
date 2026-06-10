// AnswerObjectRuntime.js
// PiOS Core Primitive — PI.ANSWER-OBJECT.RUNTIME-LEARNING.01
//
// Governed candidate-capture loop for answer objects.
// Runtime may emit candidates. Ontology promotion remains governed/manual.
//
// Known objects are reused when matched.
// New objects are logged, not canonized.
// Recurrence can be inspected.

// ─── Canonical Ontology (read-only at runtime) ─────────────────

const KNOWN_ANSWER_OBJECTS = {
  'AO-001': {
    id: 'AO-001',
    type: 'FALSIFICATION_STATEMENT',
    schema_keys: ['statement', 'measurable', 'evidence_for', 'evidence_against', 'verdict'],
    question_classes: ['challenge'],
    evidence_requirements: ['finding', 'falsification_path'],
  },
  'AO-002': {
    id: 'AO-002',
    type: 'COMPOUNDING_VERDICT',
    schema_keys: ['compounds', 'bridge_domains', 'bridge_evidence', 'severity_a', 'severity_b', 'compound_severity', 'mechanism'],
    question_classes: ['adjacent', 'challenge'],
    evidence_requirements: ['two_findings_with_affected_domains', 'domain_intersection'],
  },
  'AO-003': {
    id: 'AO-003',
    type: 'FAILURE_IMPACT_MAP',
    schema_keys: ['trigger', 'trigger_type', 'capabilities_lost', 'domains_affected', 'has_fallback', 'severity_if_triggered'],
    question_classes: ['descent', 'implication'],
    evidence_requirements: ['concentrated_node', 'downstream_dependencies'],
  },
  'AO-004': {
    id: 'AO-004',
    type: 'BLAST_RADIUS',
    schema_keys: ['trigger', 'domains_affected', 'channels_or_paths_lost', 'downstream_consumers_affected', 'severity_if_triggered', 'scope'],
    question_classes: ['descent', 'implication', 'adjacent', 'ascent'],
    evidence_requirements: ['concentrated_node', 'topology'],
  },
  'AO-005': {
    id: 'AO-005',
    type: 'PROPAGATION_CHAIN',
    schema_keys: ['origin', 'stages', 'total_amplification', 'bottleneck_stage', 'failure_cascade_direction'],
    question_classes: ['descent', 'adjacent'],
    evidence_requirements: ['runtime_flow_graphs'],
  },
  'AO-006': {
    id: 'AO-006',
    type: 'TEMPORAL_UNAVAILABILITY',
    schema_keys: ['question', 'answerable', 'reason', 'missing_evidence', 'would_require', 'partial_answer'],
    question_classes: ['implication', 'challenge', 'clarify'],
    evidence_requirements: ['absence_of_temporal_data'],
  },
  'AO-007': {
    id: 'AO-007',
    type: 'CONVERGENCE_INVENTORY',
    schema_keys: ['domain', 'total_conditions', 'peak_severity', 'evidence_families', 'conditions_by_family', 'convergence_assessment'],
    question_classes: ['clarify', 'descent'],
    evidence_requirements: ['conditions_with_affected_domains', 'domain_concentration'],
  },
  'AO-008': {
    id: 'AO-008',
    type: 'EVIDENCE_FAMILY_PARTITION',
    schema_keys: ['structural_conditions', 'runtime_conditions', 'compound_conditions', 'agreement', 'agreement_evidence'],
    question_classes: ['descent', 'challenge', 'clarify'],
    evidence_requirements: ['mixed_structural_runtime_conditions'],
  },
  'AO-009': {
    id: 'AO-009',
    type: 'INDEPENDENCE_ASSESSMENT',
    schema_keys: ['domain', 'conditions_assessed', 'independent_roots', 'condition_clusters', 'assessment', 'implication'],
    question_classes: ['clarify', 'challenge'],
    evidence_requirements: ['multiple_conditions_same_domain', 'condition_traces'],
  },
  'AO-010': {
    id: 'AO-010',
    type: 'LOAD_BEARING_CONDITION',
    schema_keys: ['domain', 'load_bearing_condition', 'removal_impact', 'reasoning', 'actionability'],
    question_classes: ['challenge', 'implication'],
    evidence_requirements: ['convergence_inventory', 'independence_assessment'],
  },
}

// ─── Candidate Schema ──────────────────────────────────────────

let candidateCounter = 0

function createCandidate({
  specimen_id,
  finding_id,
  question,
  question_class,
  persona,
  evidence_layers_used,
  source_traces,
  answer_object_type,
  candidate_schema_shape,
  confidence,
}) {
  candidateCounter++
  const id = `AOC-${String(candidateCounter).padStart(4, '0')}`

  const matched = matchKnownObject(question_class, answer_object_type, candidate_schema_shape)

  return {
    id,
    specimen_id: specimen_id || null,
    finding_id: finding_id || null,
    question: question || null,
    question_class: question_class || null,
    persona: persona || null,
    evidence_layers_used: evidence_layers_used || [],
    source_traces: source_traces || [],
    answer_object_type: answer_object_type || null,
    matched_known_object_id: matched ? matched.id : null,
    candidate_schema_shape: candidate_schema_shape || {},
    confidence: confidence || 'LOW',
    recurrence_key: deriveRecurrenceKey(question_class, answer_object_type, candidate_schema_shape),
    created_at: new Date().toISOString(),
  }
}

// ─── Matching ──────────────────────────────────────────────────

function matchKnownObject(question_class, answer_object_type, schema_shape) {
  if (answer_object_type) {
    const byType = Object.values(KNOWN_ANSWER_OBJECTS).find(
      ao => ao.type === answer_object_type
    )
    if (byType) return byType
  }

  if (question_class) {
    const byClass = Object.values(KNOWN_ANSWER_OBJECTS).filter(
      ao => ao.question_classes.includes(question_class)
    )
    if (byClass.length === 1) return byClass[0]

    if (byClass.length > 1 && schema_shape) {
      const shapeKeys = Object.keys(schema_shape).sort()
      let bestMatch = null
      let bestOverlap = 0
      for (const ao of byClass) {
        const overlap = ao.schema_keys.filter(k => shapeKeys.includes(k)).length
        if (overlap > bestOverlap) {
          bestOverlap = overlap
          bestMatch = ao
        }
      }
      if (bestMatch && bestOverlap >= 2) return bestMatch
    }
  }

  return null
}

function deriveRecurrenceKey(question_class, answer_object_type, schema_shape) {
  const shapeSignature = schema_shape
    ? Object.keys(schema_shape).sort().join(',')
    : ''
  return `${question_class || '?'}::${answer_object_type || '?'}::${shapeSignature}`
}

// ─── Candidate Registry (in-memory, exportable) ────────────────

const candidateRegistry = []
const usageLog = []

function emitCandidate(candidate) {
  candidateRegistry.push(candidate)
  return candidate
}

function recordUsage(known_object_id, specimen_id, finding_id, question) {
  usageLog.push({
    known_object_id,
    specimen_id: specimen_id || null,
    finding_id: finding_id || null,
    question: question || null,
    recorded_at: new Date().toISOString(),
  })
}

function synthesizeAndCapture({
  specimen_id,
  finding_id,
  question,
  question_class,
  persona,
  evidence_layers_used,
  source_traces,
  answer_object_type,
  answer_data,
}) {
  const schema_shape = answer_data ? extractSchemaShape(answer_data) : {}
  const matched = matchKnownObject(question_class, answer_object_type, schema_shape)

  if (matched) {
    recordUsage(matched.id, specimen_id, finding_id, question)
    return { matched: true, known_object: matched, candidate: null, answer_data }
  }

  const candidate = createCandidate({
    specimen_id,
    finding_id,
    question,
    question_class,
    persona,
    evidence_layers_used,
    source_traces,
    answer_object_type,
    candidate_schema_shape: schema_shape,
    confidence: evidence_layers_used && evidence_layers_used.length >= 2 ? 'MEDIUM' : 'LOW',
  })
  emitCandidate(candidate)
  return { matched: false, known_object: null, candidate, answer_data }
}

function extractSchemaShape(data) {
  if (!data || typeof data !== 'object') return {}
  const shape = {}
  for (const [key, val] of Object.entries(data)) {
    if (val === null || val === undefined) shape[key] = 'null'
    else if (Array.isArray(val)) shape[key] = 'array'
    else if (typeof val === 'object') shape[key] = 'object'
    else shape[key] = typeof val
  }
  return shape
}

// ─── Recurrence Detection ──────────────────────────────────────

function detectRecurrence() {
  const groups = {}

  for (const c of candidateRegistry) {
    const key = c.recurrence_key
    if (!groups[key]) {
      groups[key] = {
        recurrence_key: key,
        question_class: c.question_class,
        answer_object_type: c.answer_object_type,
        schema_shape: c.candidate_schema_shape,
        evidence_layers: new Set(),
        specimens: new Set(),
        findings: new Set(),
        candidates: [],
      }
    }
    const g = groups[key]
    g.candidates.push(c)
    if (c.specimen_id) g.specimens.add(c.specimen_id)
    if (c.finding_id) g.findings.add(c.finding_id)
    for (const l of (c.evidence_layers_used || [])) g.evidence_layers.add(l)
  }

  const result = []
  for (const g of Object.values(groups)) {
    const findingCount = g.findings.size
    const specimenCount = g.specimens.size

    let maturity
    if (specimenCount >= 2 && findingCount >= 2) maturity = 'PROMOTION_CANDIDATE'
    else if (specimenCount >= 2) maturity = 'CROSS_SPECIMEN'
    else if (findingCount >= 2) maturity = 'RECURRING'
    else maturity = 'OBSERVED_ONCE'

    result.push({
      recurrence_key: g.recurrence_key,
      question_class: g.question_class,
      answer_object_type: g.answer_object_type,
      schema_shape: g.schema_shape,
      evidence_layers: [...g.evidence_layers],
      occurrence_count: g.candidates.length,
      finding_count: findingCount,
      specimen_count: specimenCount,
      maturity,
      candidate_ids: g.candidates.map(c => c.id),
    })
  }

  result.sort((a, b) => {
    const ORDER = { PROMOTION_CANDIDATE: 0, CROSS_SPECIMEN: 1, RECURRING: 2, OBSERVED_ONCE: 3 }
    return (ORDER[a.maturity] || 9) - (ORDER[b.maturity] || 9)
  })

  return result
}

// ─── Promotion Gate ────────────────────────────────────────────

function assessPromotionReadiness(recurrenceEntry) {
  const checks = {
    recurrence_across_findings: recurrenceEntry.finding_count >= 2,
    cross_specimen: recurrenceEntry.specimen_count >= 2,
    stable_schema: Object.keys(recurrenceEntry.schema_shape || {}).length >= 2,
    clear_evidence: (recurrenceEntry.evidence_layers || []).length >= 1,
    clear_question_class: !!recurrenceEntry.question_class,
  }

  const passed = Object.values(checks).filter(Boolean).length
  const total = Object.keys(checks).length

  return {
    ...checks,
    passed,
    total,
    ready: checks.recurrence_across_findings && checks.stable_schema && checks.clear_question_class,
    recommendation: checks.recurrence_across_findings && checks.cross_specimen
      ? 'PROMOTE'
      : checks.recurrence_across_findings
        ? 'PROMOTE_WITH_CAUTION'
        : 'WAIT',
  }
}

// ─── Export / Inspection ───────────────────────────────────────

function getRegistry() {
  return {
    candidates: [...candidateRegistry],
    usage: [...usageLog],
    known_objects: Object.values(KNOWN_ANSWER_OBJECTS),
    recurrence: detectRecurrence(),
  }
}

function getKnownObject(id) {
  return KNOWN_ANSWER_OBJECTS[id] || null
}

function getKnownObjectByType(type) {
  return Object.values(KNOWN_ANSWER_OBJECTS).find(ao => ao.type === type) || null
}

function getCandidatesByFinding(finding_id) {
  return candidateRegistry.filter(c => c.finding_id === finding_id)
}

function getUsageByObject(known_object_id) {
  return usageLog.filter(u => u.known_object_id === known_object_id)
}

module.exports = {
  KNOWN_ANSWER_OBJECTS,
  createCandidate,
  matchKnownObject,
  synthesizeAndCapture,
  emitCandidate,
  recordUsage,
  detectRecurrence,
  assessPromotionReadiness,
  getRegistry,
  getKnownObject,
  getKnownObjectByType,
  getCandidatesByFinding,
  getUsageByObject,
}

// InvestigationRuntime.js
// PiOS Core Primitive — PI.INVESTIGATION-RUNTIME.01
//
// Investigation = first-class PiOS runtime object with lifecycle, proof paths, completion criteria.
// Two layers: Archetype (discovered from cognition graph) + Instance (constructed from operator parameters).
// Guide Runtime consumes this to track proof, not persona traversal.

const { deriveContinuations } = require('./CognitiveContinuations')

const INVESTIGATION_STATES = {
  OPENED: 'OPENED',
  ACTIVE: 'ACTIVE',
  CONVERGING: 'CONVERGING',
  RESOLVED: 'RESOLVED',
  INCONCLUSIVE: 'INCONCLUSIVE',
}

const PROOF_STATUS = {
  UNEXAMINED: 'UNEXAMINED',
  EXAMINED: 'EXAMINED',
}

const PROOF_CATEGORIES = {
  EVIDENCE: 'EVIDENCE',
  CONSEQUENCE: 'CONSEQUENCE',
  FALSIFICATION: 'FALSIFICATION',
  CORRELATION: 'CORRELATION',
}

const TYPE_TO_CATEGORY = {
  clarify: PROOF_CATEGORIES.EVIDENCE,
  descent: PROOF_CATEGORIES.EVIDENCE,
  implication: PROOF_CATEGORIES.CONSEQUENCE,
  challenge: PROOF_CATEGORIES.FALSIFICATION,
  adjacent: PROOF_CATEGORIES.CORRELATION,
  ascent: PROOF_CATEGORIES.CORRELATION,
}

const CATEGORY_LABELS = {
  EVIDENCE: 'Evidence',
  CONSEQUENCE: 'Consequence',
  FALSIFICATION: 'Falsification',
  CORRELATION: 'Correlation',
}

const DECISION_HORIZONS = {
  executive: 'governance, risk, institutional exposure',
  operational: 'delivery coordination, operational dependencies',
  structural: 'architectural integrity, structural dependencies',
}

const STEP_TARGET_MODES = {
  clarify: 'EXECUTIVE_DENSE',
  descent: 'OPERATOR_DENSE',
  implication: 'EXECUTIVE_BALANCED',
  challenge: 'OPERATOR_DENSE',
  adjacent: 'EXECUTIVE_DENSE',
  ascent: 'EXECUTIVE_BALANCED',
}

function deriveStepLabel(continuation) {
  const trace = continuation.trace || {}
  const obj = (trace.object || '').toLowerCase()
  if (obj.includes('execution_center') || obj.includes('execution_concentration')) return 'Why do gravity centers diverge?'
  if (obj.includes('signal_interpretations') && (trace.field || '').includes('RSIG')) return 'Which runtime paths create pressure?'
  if (obj.includes('domain_concentration')) return 'Why is this domain dominant?'
  if (obj.includes('consequence_themes')) return 'Which pressures converge?'
  if (obj.includes('falsification')) return 'What would disprove this?'
  if (obj.includes('surface_adjacency')) {
    const { SURFACE_NAMES } = require('./CognitiveContinuations')
    const target = continuation.targetSurface
    const name = (SURFACE_NAMES && SURFACE_NAMES[target]) || (target || '').replace(/_/g, ' ')
    return name ? `Does this compound with ${name}?` : 'Does this compound with other findings?'
  }
  if (obj.includes('domain_narratives') && (trace.field || '').includes('receiver')) return 'Which domains are downstream?'
  if (obj.includes('domain_narratives')) return 'How does pressure propagate?'
  if (obj.includes('governance_lifecycle')) return 'What confidence does governance grant?'
  if (obj.includes('balanced')) return 'What does this mean operationally?'
  if (obj.includes('crossdomaincognition') || obj.includes('crossDomainCognition')) return 'How does the board see this?'
  if (obj.includes('structural_enrichment')) return 'Which structural spines carry authority?'
  const TYPE_LABELS = {
    clarify: 'Why does this happen?',
    descent: 'Show the evidence chain',
    implication: 'Which decisions are affected?',
    challenge: 'What would disprove this?',
    adjacent: 'Does this compound with other findings?',
    ascent: 'How does the board see this?',
  }
  return TYPE_LABELS[continuation.type] || 'Examine'
}

const TRAVERSAL_PROOF_STEPS = {
  executive: [
    { continuationType: 'implication', label: 'Which decisions are affected?', category: PROOF_CATEGORIES.CONSEQUENCE, targetMode: 'EXECUTIVE_BALANCED' },
    { continuationType: 'challenge', label: 'What would disprove this?', category: PROOF_CATEGORIES.FALSIFICATION, targetMode: 'OPERATOR_DENSE' },
    { continuationType: 'ascent', label: 'How does the board see this?', category: PROOF_CATEGORIES.CORRELATION, targetMode: null, boardroom: true },
  ],
  operational: [
    { continuationType: 'challenge', label: 'What would disprove this?', category: PROOF_CATEGORIES.FALSIFICATION, targetMode: 'OPERATOR_DENSE' },
    { continuationType: 'descent', label: 'Show the evidence chain', category: PROOF_CATEGORIES.EVIDENCE, targetMode: 'OPERATOR_DENSE' },
    { continuationType: 'clarify', label: 'Why does this happen?', category: PROOF_CATEGORIES.EVIDENCE, targetMode: 'EXECUTIVE_DENSE' },
    { continuationType: 'ascent', label: 'How does the board see this?', category: PROOF_CATEGORIES.CORRELATION, targetMode: null, boardroom: true },
  ],
  structural: [
    { continuationType: 'clarify', label: 'Why does this happen?', category: PROOF_CATEGORIES.EVIDENCE, targetMode: 'EXECUTIVE_DENSE' },
    { continuationType: 'descent', label: 'Show the evidence chain', category: PROOF_CATEGORIES.EVIDENCE, targetMode: 'OPERATOR_DENSE' },
    { continuationType: 'challenge', label: 'What would disprove this?', category: PROOF_CATEGORIES.FALSIFICATION, targetMode: 'OPERATOR_DENSE' },
    { continuationType: 'adjacent', label: 'Does this compound with other findings?', category: PROOF_CATEGORIES.CORRELATION, targetMode: null },
  ],
}

function deriveProofSteps(continuations, altitude) {
  const steps = []
  const seen = new Set()

  if (continuations && continuations.ranked) {
    const ranked = continuations.ranked.filter(c => c.available)
    for (const c of ranked) {
      const label = deriveStepLabel(c)
      if (seen.has(label)) continue
      seen.add(label)

      const category = TYPE_TO_CATEGORY[c.typeKey] || PROOF_CATEGORIES.EVIDENCE
      steps.push({
        id: `ps_${c.typeKey}_${steps.length}`,
        category,
        label,
        detail: c.question || null,
        continuationType: c.typeKey,
        targetMode: STEP_TARGET_MODES[c.typeKey] || null,
        targetZone: c.targetSurface ? resolveStepZone(c) : null,
        targetSurface: c.targetSurface || null,
        boardroom: c.typeKey === 'ascent',
        status: PROOF_STATUS.UNEXAMINED,
      })
    }
  }

  if (steps.length === 0) {
    const fallback = TRAVERSAL_PROOF_STEPS[altitude] || TRAVERSAL_PROOF_STEPS.structural
    for (const f of fallback) {
      steps.push({
        id: `ps_${f.continuationType}_${steps.length}`,
        category: f.category,
        label: f.label,
        detail: null,
        continuationType: f.continuationType,
        targetMode: f.targetMode || null,
        targetZone: null,
        boardroom: f.boardroom || false,
        status: PROOF_STATUS.UNEXAMINED,
      })
    }
  }

  return steps.slice(0, 7)
}

function resolveStepZone(continuation) {
  const reason = (continuation.reason || '').toLowerCase()
  const target = continuation.targetSurface
  if (reason.includes('diverge') || reason.includes('execution_center')) return 'interpret_runtime_divergence'
  if (reason.includes('rsig') || reason.includes('runtime signal')) return 'interpret_execution_blindness'
  if (reason.includes('propagation') || reason.includes('receiver')) return 'interpret_propagation_dynamics'
  if (target === 'EXECUTION_BLINDNESS') return 'interpret_execution_blindness'
  if (target === 'PROPAGATION_RISK') return 'interpret_propagation_dynamics'
  if (target === 'GRAVITY_DIVERGENCE') return 'interpret_runtime_divergence'
  return null
}

function deriveInvestigationQuestion(intent, continuations, altitude) {
  if (continuations && continuations.clarify) {
    const topClarify = continuations.clarify.find(c => c.available)
    if (topClarify) return topClarify.question
  }
  const horizonLabel = DECISION_HORIZONS[altitude] || 'operational decisions'
  const findingLabel = (intent.postureLabel || intent.finding || 'this finding').replace(/_/g, ' ')
  return `What does ${findingLabel} mean for ${horizonLabel}?`
}

let instanceCounter = 0

function createInvestigation(intent, crossDomainCognition, fullReport, projectionAuthority) {
  const altitude = intent.fromAltitude || 'structural'
  const pLevel = projectionAuthority ? projectionAuthority.projectionLevel : 0
  const surfaceId = intent.surface || 'SYSTEMIC_OPERATIONAL_FRAGILITY'

  const ctx = {
    crossDomainCognition: crossDomainCognition || {},
    fullReport: fullReport || {},
  }

  const continuations = deriveContinuations(surfaceId, ctx, pLevel, altitude)
  const originType = intent.continuationType || null
  const proofSteps = deriveProofSteps(continuations, altitude)
    .filter(s => s.continuationType !== originType)
  const question = deriveInvestigationQuestion(intent, continuations, altitude)

  instanceCounter++

  return {
    id: `inv_${surfaceId}_${instanceCounter}`,
    finding: intent.finding || null,
    surface: intent.surface || null,
    primaryDomain: intent.primaryDomain || null,
    executionCenter: intent.executionCenter || null,
    postureLabel: intent.postureLabel || null,
    question,
    altitude,
    intent: intent.action || null,
    decisionHorizon: DECISION_HORIZONS[altitude] || null,
    scope: 'SINGLE_FINDING',
    state: INVESTIGATION_STATES.OPENED,
    proofSteps,
    history: [],
    fromAltitude: intent.fromAltitude || null,
    action: intent.action || null,
  }
}

function computeState(investigation) {
  const steps = investigation.proofSteps || []
  if (steps.length === 0) return INVESTIGATION_STATES.OPENED

  const examined = steps.filter(s => s.status === PROOF_STATUS.EXAMINED).length
  if (examined === 0) return INVESTIGATION_STATES.OPENED

  const ratio = examined / steps.length
  if (ratio > 0.5) return INVESTIGATION_STATES.CONVERGING
  return INVESTIGATION_STATES.ACTIVE
}

function examineStep(investigation, stepId) {
  const step = investigation.proofSteps.find(s => s.id === stepId)
  const steps = investigation.proofSteps.map(s =>
    s.id === stepId ? { ...s, status: PROOF_STATUS.EXAMINED } : s
  )

  if (step && step.status === PROOF_STATUS.UNEXAMINED) {
    try {
      const { synthesizeAndCapture } = require('./AnswerObjectRuntime')
      synthesizeAndCapture({
        specimen_id: investigation.id,
        finding_id: investigation.finding,
        question: step.label,
        question_class: step.continuationType,
        persona: investigation.altitude,
        evidence_layers_used: [step.targetSurface, step.continuationType].filter(Boolean),
        source_traces: step.detail ? [step.detail] : [],
        answer_object_type: resolveExpectedObjectType(step),
        answer_data: null,
      })
    } catch (_) {}
  }

  const updated = {
    ...investigation,
    proofSteps: steps,
    history: [...investigation.history, { stepId, action: 'examine' }],
  }
  updated.state = computeState(updated)
  return updated
}

function resolveExpectedObjectType(step) {
  const TYPE_MAP = {
    challenge: 'FALSIFICATION_STATEMENT',
    adjacent: 'COMPOUNDING_VERDICT',
    descent: null,
    clarify: null,
    implication: null,
    ascent: null,
  }
  if (TYPE_MAP[step.continuationType]) return TYPE_MAP[step.continuationType]
  if (step.targetSurface) return 'COMPOUNDING_VERDICT'
  if (step.category === PROOF_CATEGORIES.EVIDENCE) return 'CONVERGENCE_INVENTORY'
  return null
}

function advanceFromNavigation(investigation, continuationType) {
  if (!continuationType) return investigation

  const typeMap = {
    'Why it matters': 'implication',
    'Challenge this': 'challenge',
    'Prove it': 'challenge',
    'Show evidence': 'descent',
    'Explain': 'clarify',
    'What compounds': 'adjacent',
    'Board view': 'ascent',
  }
  const resolvedType = typeMap[continuationType] || continuationType

  const match = investigation.proofSteps.find(
    s => s.continuationType === resolvedType && s.status === PROOF_STATUS.UNEXAMINED
  )

  if (!match) return investigation
  return examineStep(investigation, match.id)
}

function resolveInvestigation(investigation, outcome) {
  const validOutcomes = [INVESTIGATION_STATES.RESOLVED, INVESTIGATION_STATES.INCONCLUSIVE]
  if (!validOutcomes.includes(outcome)) return investigation

  return {
    ...investigation,
    state: outcome,
    history: [...investigation.history, { action: 'resolve', outcome }],
  }
}

function getProgress(investigation) {
  const steps = investigation.proofSteps || []
  const total = steps.length
  const examined = steps.filter(s => s.status === PROOF_STATUS.EXAMINED).length
  return { examined, total, ratio: total > 0 ? examined / total : 0 }
}

function getStepsByCategory(investigation) {
  const result = {}
  for (const step of investigation.proofSteps || []) {
    if (!result[step.category]) result[step.category] = []
    result[step.category].push(step)
  }
  return result
}

function getNextSteps(investigation) {
  return (investigation.proofSteps || []).filter(s => s.status === PROOF_STATUS.UNEXAMINED)
}

function getProvenSteps(investigation) {
  return (investigation.proofSteps || []).filter(s => s.status === PROOF_STATUS.EXAMINED)
}

function isActive(investigation) {
  if (!investigation || !investigation.state) return false
  return investigation.state !== INVESTIGATION_STATES.RESOLVED &&
    investigation.state !== INVESTIGATION_STATES.INCONCLUSIVE
}

module.exports = {
  INVESTIGATION_STATES,
  PROOF_STATUS,
  PROOF_CATEGORIES,
  CATEGORY_LABELS,
  createInvestigation,
  examineStep,
  advanceFromNavigation,
  resolveInvestigation,
  computeState,
  getProgress,
  getStepsByCategory,
  getNextSteps,
  getProvenSteps,
  isActive,
}

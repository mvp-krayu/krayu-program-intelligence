// CognitiveAnchor.js
// PiOS Core — Cognitive Anchor Hierarchy
//
// Every question resolves against the deepest available anchor.
// Level 0: Specimen (BlueEdge, StackStorm)
// Level 1: Posture (S0, S1, S2 + posture label)
// Level 2: Finding (Gravity Divergence, Execution Blindness)
// Level 3: Investigation (specific proof trail)
//
// No chip is ever orphaned. No chip is ever disabled.
// "Why does this happen?" at Level 0 means "Why is BlueEdge S2?"
// "Why does this happen?" at Level 2 means "Why does Gravity Divergence happen?"

const ANCHOR_LEVELS = {
  SPECIMEN: 0,
  POSTURE: 1,
  FINDING: 2,
  INVESTIGATION: 3,
}

function resolveAnchor(crossDomainCognition, fullReport, investigationContext, focusedFinding) {
  if (investigationContext && investigationContext.proofSteps && investigationContext.state !== 'RESOLVED' && investigationContext.state !== 'INCONCLUSIVE') {
    return buildInvestigationAnchor(investigationContext)
  }

  if (focusedFinding) {
    return buildFindingAnchor(focusedFinding, crossDomainCognition, fullReport)
  }

  const cdc = crossDomainCognition || {}
  if (cdc.posture_label || cdc.consequence_themes) {
    return buildPostureAnchor(cdc, fullReport)
  }

  return buildSpecimenAnchor(fullReport)
}

function buildSpecimenAnchor(fullReport) {
  const fr = fullReport || {}
  const ts = fr.topology_scope || fr.topology_summary || {}
  const gl = fr.governance_lifecycle || {}
  const sLevel = gl.s_level || fr.qualification_level || 'S0'

  return {
    level: ANCHOR_LEVELS.SPECIMEN,
    level_label: 'SPECIMEN',
    label: fr._specimen || fr._client || 'Specimen',
    qualification: sLevel,
    description: `${fr._specimen || 'This specimen'} at ${sLevel}`,
    subject: fr._specimen || 'specimen',
    context: {
      domain_count: ts.semantic_domain_count || ts.domain_count || 0,
      cluster_count: ts.cluster_count || 0,
      qualification: sLevel,
    },
    question_framing: {
      'Why does this happen?': `Why is this specimen at ${sLevel}?`,
      'What compounds?': `What structural patterns reinforce this specimen's posture?`,
      'What should we decide?': `What governance decisions does this specimen's state require?`,
      'How confident is this?': `How confident is the ${sLevel} qualification?`,
      'What operations are affected?': `What operational patterns characterize this specimen?`,
    },
  }
}

function buildPostureAnchor(cdc, fullReport) {
  const fr = fullReport || {}
  const gl = fr.governance_lifecycle || {}
  const sLevel = gl.s_level || fr.qualification_level || 'S0'
  const postureLabel = cdc.posture_label || 'structural assessment'
  const themes = cdc.consequence_themes || []
  const domConc = cdc.domain_concentration || []
  const structCenter = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = cdc.execution_center || null
  const hasDivergence = execCenter && structCenter && execCenter.toLowerCase() !== structCenter.toLowerCase()

  return {
    level: ANCHOR_LEVELS.POSTURE,
    level_label: 'POSTURE',
    label: postureLabel,
    qualification: sLevel,
    description: `${postureLabel} — ${themes.length} consequence theme${themes.length !== 1 ? 's' : ''}, ${domConc.length} domains`,
    subject: postureLabel,
    structuralCenter: structCenter,
    executionCenter: execCenter,
    hasDivergence,
    finding: hasDivergence ? 'structural_operational_divergence' : (themes[0] ? themes[0].theme_label : postureLabel),
    surface: hasDivergence ? 'GRAVITY_DIVERGENCE' : 'SYSTEMIC_OPERATIONAL_FRAGILITY',
    context: {
      themes,
      domain_concentration: domConc,
      execution_center: execCenter,
      structural_center: structCenter,
      domain_count: domConc.length,
    },
    question_framing: {
      'Why does this happen?': hasDivergence
        ? `Why is ${execCenter} the execution center rather than ${structCenter}?`
        : `Why does ${postureLabel} characterize this system?`,
      'What compounds?': hasDivergence
        ? `Does the gravity divergence compound with other structural findings?`
        : `What reinforces ${postureLabel}?`,
      'What should we decide?': hasDivergence
        ? `Which governance decisions are affected by structural-operational divergence?`
        : `Which governance decisions does ${postureLabel} affect?`,
      'How confident is this?': `How confident is the ${postureLabel} assessment at ${sLevel}?`,
      'What operations are affected?': hasDivergence
        ? `Which operational assumptions are invalid because structural and operational gravity diverge?`
        : `Which operational patterns are affected by ${postureLabel}?`,
    },
  }
}

function buildFindingAnchor(finding, cdc, fullReport) {
  const fr = fullReport || {}
  const gl = fr.governance_lifecycle || {}
  const sLevel = gl.s_level || fr.qualification_level || 'S0'
  const domConc = (cdc && cdc.domain_concentration) || []
  const structCenter = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = (cdc && cdc.execution_center) || null

  const findingLabel = finding.label || finding.theme_label || finding.surface_id || 'finding'
  const surfaceId = finding.surface_id || finding.surface || 'SYSTEMIC_OPERATIONAL_FRAGILITY'

  return {
    level: ANCHOR_LEVELS.FINDING,
    level_label: 'FINDING',
    label: findingLabel,
    qualification: sLevel,
    description: `${findingLabel} — ${finding.severity || 'assessed'}`,
    subject: findingLabel,
    finding: findingLabel,
    surface: surfaceId,
    structuralCenter: structCenter,
    executionCenter: execCenter,
    context: {
      finding,
      domain_concentration: domConc,
      execution_center: execCenter,
      structural_center: structCenter,
    },
    question_framing: {
      'Why does this happen?': `Why does ${findingLabel} occur?`,
      'What compounds?': `Does ${findingLabel} compound with other findings?`,
      'What should we decide?': `Which decisions does ${findingLabel} affect?`,
      'How confident is this?': `How confident is the ${findingLabel} evidence?`,
      'What operations are affected?': `Which operations does ${findingLabel} impact?`,
    },
  }
}

function buildInvestigationAnchor(investigation) {
  return {
    level: ANCHOR_LEVELS.INVESTIGATION,
    level_label: 'INVESTIGATION',
    label: investigation.postureLabel || investigation.finding || 'investigation',
    qualification: investigation.cognition ? investigation.cognition.qualificationState : null,
    description: investigation.question || 'Active investigation',
    subject: investigation.postureLabel || investigation.finding,
    finding: investigation.finding,
    surface: investigation.surface,
    structuralCenter: investigation.cognition ? investigation.cognition.structuralCenter : investigation.primaryDomain,
    executionCenter: investigation.cognition ? investigation.cognition.executionCenter : investigation.executionCenter,
    investigation,
    context: investigation.cognition || {},
    question_framing: null,
  }
}

function resolveQuestionForAnchor(anchor, chipLabel) {
  if (!anchor) return chipLabel

  if (anchor.question_framing && anchor.question_framing[chipLabel]) {
    return anchor.question_framing[chipLabel]
  }

  const subject = anchor.subject || 'this'
  return chipLabel.replace(/this/gi, subject)
}

function anchorToInvestigationIntent(anchor) {
  return {
    finding: anchor.finding || anchor.label,
    surface: anchor.surface || 'SYSTEMIC_OPERATIONAL_FRAGILITY',
    primaryDomain: anchor.structuralCenter || null,
    executionCenter: anchor.executionCenter || null,
    postureLabel: anchor.label,
    fromAltitude: null,
  }
}

module.exports = {
  ANCHOR_LEVELS,
  resolveAnchor,
  resolveQuestionForAnchor,
  anchorToInvestigationIntent,
}

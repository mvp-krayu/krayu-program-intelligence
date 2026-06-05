'use strict';

// ConsequenceNativeEIR — Projects EIR chapters from consequence/cognition authority.
// Replaces independent cognition synthesis in ExecutiveIntelligenceSynthesis.js.
//
// Rule: EIR may format, sequence, cite, and attach evidence detail.
//       EIR may NOT independently synthesize cognition from raw evidence.
//
// Authority: ConsequenceCompiler → forBoardroom() / forBalanced()
// Evidence detail: PICP objects for topology counts, file stats, ceiling, detection boundary
//
// Stream: PI.COGNITION-AUTHORITY-CONSOLIDATION.01

function projectFromConsequences({ boardroom, balanced, consequenceResult, picp, groundingContext }) {
  if (!boardroom) return { ok: false, error: 'No boardroom projection available' }

  const ctx = groundingContext || {}
  const objects = (picp && (picp.cognition_objects || picp.cognitionObjects)) || {}
  const ceiling = objects.operational_ceiling || {}
  const constraints = objects.constraint_inventory || {}
  const detection = objects.detection_boundary || {}

  const slices = boardroom.cognition_slices || []
  const themes = boardroom.consequence_themes || []
  const narratives = boardroom.domain_narratives || []
  const concentration = boardroom.domain_concentration || []

  const primaryStory = balanced ? balanced.primary_story : null
  const reinforcementFlow = balanced ? (balanced.reinforcement_flow || []) : []
  const ontologyGroups = balanced ? (balanced.ontology_groups || []) : []

  const allConsequences = consequenceResult ? (consequenceResult.consequences || []) : []
  const atomics = consequenceResult ? (consequenceResult.atomic_consequences || []) : []
  const runtimeConsequences = atomics.filter(a => (a.consequence_type_id || '').startsWith('RT_'))

  return {
    ok: true,
    executive_posture: {
      posture_label: boardroom.posture_label,
      posture_severity: boardroom.posture_severity,
      posture_scope: boardroom.posture_scope,
      primary_locus: boardroom.primary_locus,
      overall_confidence: boardroom.overall_confidence,
    },
    chapters: [
      chapterExecutiveBrief(boardroom, ctx),
      chapterProgramOverview(boardroom, ctx),
      chapterStructuralStory(balanced, slices, ctx),
      chapterPIFindings(slices, themes, runtimeConsequences, ctx),
      chapterSWIntelligence(narratives, themes, runtimeConsequences, boardroom),
      chapterRiskLandscape(allConsequences, runtimeConsequences, narratives, ctx),
      chapterOperationalCeiling(ceiling, constraints, ctx),
      chapterDetectionBoundary(detection, runtimeConsequences),
      chapterExecutiveVerdict(boardroom, balanced, ctx),
    ],
  }
}

function chapterExecutiveBrief(boardroom, ctx) {
  const findings = []

  findings.push({
    id: 'eb-posture',
    type: 'posture',
    severity: boardroom.posture_severity,
    title: boardroom.posture_label,
    body: boardroom.executive_synthesis || boardroom.combined_synthesis || '',
    evidence: ['consequence_posture'],
  })

  if (boardroom.consequence_themes && boardroom.consequence_themes.length > 0) {
    findings.push({
      id: 'eb-themes',
      type: 'consequence_themes',
      severity: boardroom.consequence_themes[0].severity,
      title: `${boardroom.consequence_themes.length} consequence dimension${boardroom.consequence_themes.length !== 1 ? 's' : ''} active`,
      body: boardroom.consequence_themes.map(t => `${t.theme_label} [${t.severity}]`).join('; '),
      evidence: ['consequence_themes'],
    })
  }

  return {
    chapter_id: 'executive_brief',
    chapter_label: 'Executive Brief',
    sequence: 1,
    findings,
    evidence_objects: ['structural_posture', 'tension_map'],
  }
}

function chapterProgramOverview(boardroom, ctx) {
  const findings = [{
    id: 'po-scope',
    type: 'scope',
    severity: boardroom.posture_severity,
    title: `${boardroom.posture_scope || 'LOCAL'} scope — ${boardroom.consequence_count || 0} consequence${(boardroom.consequence_count || 0) !== 1 ? 's' : ''}, ${boardroom.systemic_count || 0} systemic`,
    body: boardroom.combined_synthesis || '',
    evidence: ['structural_posture'],
  }]

  return {
    chapter_id: 'program_overview',
    chapter_label: 'Program Overview',
    sequence: 2,
    findings,
    evidence_objects: ['structural_posture'],
  }
}

function chapterStructuralStory(balanced, slices, ctx) {
  const findings = []

  if (balanced && balanced.primary_story) {
    const ps = balanced.primary_story
    findings.push({
      id: 'ss-primary',
      type: 'primary_story',
      severity: ps.severity,
      title: ps.title,
      body: ps.operational_implication,
      evidence: ['tension_map', 'consequence_compiler'],
    })
  }

  if (balanced && balanced.reinforcement_flow) {
    for (const r of balanced.reinforcement_flow) {
      findings.push({
        id: 'ss-rf-' + r.consequence_type_id,
        type: 'reinforcement',
        severity: r.severity,
        title: `${r.relationship_verb} — ${r.title}`,
        body: r.relationship_sentence,
        evidence: ['reinforcement_flow'],
      })
    }
  }

  if (findings.length === 0) {
    findings.push({ id: 'ss-none', type: 'absent', severity: 'NOMINAL', title: 'No structural tension detected', body: '', evidence: [] })
  }

  return {
    chapter_id: 'structural_story',
    chapter_label: 'Structural Topology',
    sequence: 3,
    findings,
    evidence_objects: ['tension_map'],
  }
}

function chapterPIFindings(slices, themes, runtimeConsequences, ctx) {
  const findings = slices.map((s, i) => ({
    id: 'pif-' + (s.condition_type || i),
    type: isRuntimeType(s.condition_type) ? 'runtime_condition' : 'static_condition',
    severity: s.severity,
    title: s.executive_name,
    body: s.operational_meaning || '',
    evidence: ['condition:' + s.condition_type],
    domain: s.domain,
    evidence_class: isRuntimeType(s.condition_type) ? 'RUNTIME' : 'STATIC_IMPORT',
  }))

  return {
    chapter_id: 'pi_findings',
    chapter_label: 'Program Intelligence Findings',
    sequence: 4,
    findings,
    evidence_objects: ['tension_map', 'constraint_inventory'],
  }
}

function chapterSWIntelligence(narratives, themes, runtimeConsequences, boardroom) {
  const findings = []

  for (const n of narratives) {
    findings.push({
      id: 'swi-domain-' + n.domain,
      type: 'domain_risk_profile',
      severity: null,
      title: n.domain,
      body: n.risk_label,
      evidence: ['domain_narratives'],
      risk_shape: n.risk_shape,
      classes: n.classes,
    })
  }

  for (const rc of runtimeConsequences) {
    findings.push({
      id: 'swi-rt-' + rc.consequence_type_id,
      type: 'runtime_consequence',
      severity: rc.severity,
      title: rc.operator_consequence_title,
      body: rc.operational_implication,
      evidence: ['runtime_signal:' + (rc.source_conditions || []).join(',')],
      evidence_class: 'RUNTIME',
    })
  }

  return {
    chapter_id: 'sw_intelligence',
    chapter_label: 'Software Intelligence Assessment',
    sequence: 5,
    findings,
    evidence_objects: ['tension_map', 'structural_posture'],
  }
}

function chapterRiskLandscape(allConsequences, runtimeConsequences, narratives, ctx) {
  const findings = allConsequences
    .filter(c => c.severity !== 'NOMINAL')
    .map(c => ({
      id: 'rl-' + c.consequence_type_id + '-' + (c.primary_locus || 'sys'),
      type: (c.consequence_type_id || '').startsWith('RT_') ? 'runtime_risk' : c.combination_pattern ? 'combination_risk' : 'static_risk',
      severity: c.severity,
      title: c.operator_consequence_title,
      body: c.operational_implication,
      evidence: ['consequence:' + c.consequence_type_id],
      scope: c.consequence_scope,
      locus: c.primary_locus_display,
    }))

  return {
    chapter_id: 'risk_landscape',
    chapter_label: 'Execution Risk Landscape',
    sequence: 6,
    findings,
    evidence_objects: ['exposure_assessment', 'tension_map', 'operational_ceiling'],
  }
}

function chapterOperationalCeiling(ceiling, constraints, ctx) {
  const findings = []
  const items = ceiling.ceiling_items || ceiling.items || []
  for (const item of items) {
    findings.push({
      id: 'oc-' + (item.id || item.ceiling_id || findings.length),
      type: 'ceiling_constraint',
      severity: item.severity || 'MODERATE',
      title: item.label || item.title || 'Operational constraint',
      body: item.description || item.operational_implication || '',
      evidence: ['operational_ceiling'],
    })
  }

  if (findings.length === 0) {
    const gapCount = (constraints.governance_gaps || []).length
    findings.push({
      id: 'oc-summary',
      type: 'ceiling_summary',
      severity: gapCount > 0 ? 'ELEVATED' : 'NOMINAL',
      title: gapCount > 0 ? `${gapCount} governance gap${gapCount !== 1 ? 's' : ''} constrain operational ceiling` : 'No ceiling constraints identified',
      body: '',
      evidence: ['operational_ceiling', 'constraint_inventory'],
    })
  }

  return {
    chapter_id: 'operational_ceiling',
    chapter_label: 'Operational Ceiling',
    sequence: 7,
    findings,
    evidence_objects: ['operational_ceiling', 'constraint_inventory'],
  }
}

function chapterDetectionBoundary(detection, runtimeConsequences) {
  const findings = []
  const rules = detection.detection_rules || detection.rules || []
  for (const rule of rules) {
    findings.push({
      id: 'db-' + (rule.id || rule.rule_id || findings.length),
      type: 'detection_rule',
      severity: rule.severity || 'MODERATE',
      title: rule.label || rule.title || 'Detection boundary rule',
      body: rule.description || '',
      evidence: ['detection_boundary'],
    })
  }

  if (runtimeConsequences.length > 0) {
    findings.push({
      id: 'db-runtime-visibility',
      type: 'runtime_visibility',
      severity: 'ELEVATED',
      title: `${runtimeConsequences.length} runtime-derived finding${runtimeConsequences.length !== 1 ? 's' : ''} invisible to static analysis`,
      body: 'Runtime connectivity analysis (event flows, MQTT topics, WebSocket channels, DI injection) revealed structural risks that no import-graph analysis can detect: ' +
        runtimeConsequences.map(rc => rc.operator_consequence_title).join(', ') + '.',
      evidence: ['runtime_signal_derivation'],
      evidence_class: 'RUNTIME',
    })
  }

  return {
    chapter_id: 'detection_boundary',
    chapter_label: 'What Traditional Analysis Cannot Discover',
    sequence: 8,
    findings,
    evidence_objects: ['detection_boundary'],
  }
}

function chapterExecutiveVerdict(boardroom, balanced, ctx) {
  const findings = [{
    id: 'ev-verdict',
    type: 'verdict',
    severity: boardroom.posture_severity,
    title: boardroom.posture_label,
    body: boardroom.combined_synthesis || '',
    evidence: ['structural_posture', 'tension_map', 'operational_ceiling'],
  }]

  if (boardroom.overall_confidence) {
    findings.push({
      id: 'ev-confidence',
      type: 'confidence',
      severity: boardroom.overall_confidence === 'GOVERNED' ? 'NOMINAL' : 'ELEVATED',
      title: `Confidence: ${boardroom.overall_confidence_label || boardroom.overall_confidence}`,
      body: balanced ? (balanced.confidence_sentence || '') : '',
      evidence: ['qualification_state'],
    })
  }

  return {
    chapter_id: 'executive_verdict',
    chapter_label: 'Executive Verdict',
    sequence: 9,
    findings,
    evidence_objects: ['structural_posture', 'tension_map', 'operational_ceiling'],
  }
}

function isRuntimeType(type) {
  return type && (type.startsWith('RT_') || ['EVENT_CONCENTRATION', 'RUNTIME_DEPENDENCY_CHOKE_POINT', 'BROKER_DEPENDENCY', 'TOPIC_FANOUT_PRESSURE', 'ASYNC_PROPAGATION_ASYMMETRY', 'EDGE_CLOUD_PROPAGATION_RISK', 'RUNTIME_OBSERVABILITY_GAP'].includes(type))
}

module.exports = { projectFromConsequences }

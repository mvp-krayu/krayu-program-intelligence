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

const RT_CONDITION_TYPES = new Set([
  'EVENT_CONCENTRATION','RUNTIME_DEPENDENCY_CHOKE_POINT','BROKER_DEPENDENCY',
  'TOPIC_FANOUT_PRESSURE','ASYNC_PROPAGATION_ASYMMETRY',
  'EDGE_CLOUD_PROPAGATION_RISK','RUNTIME_OBSERVABILITY_GAP',
])

const BLINDNESS_CLASS_CONDITIONS = {
  BOUNDARY: ['BROKER_DEPENDENCY', 'EDGE_CLOUD_PROPAGATION_RISK'],
  SILENCE: ['RUNTIME_DEPENDENCY_CHOKE_POINT', 'ASYNC_PROPAGATION_ASYMMETRY'],
  COUPLING: ['EVENT_CONCENTRATION', 'TOPIC_FANOUT_PRESSURE'],
}

function determineNarrativeMode({ boardroom, vlc, architecturalFindings, synthesisResult, projectionAuthority }) {
  // Criterion 0: Projection authority — EXECUTION_BLINDNESS requires P2
  if (projectionAuthority && projectionAuthority.projectionLevel < 2) {
    return { mode: 'STRUCTURAL_INTELLIGENCE', reason: 'projection authority P' + projectionAuthority.projectionLevel + ' — EXECUTION_BLINDNESS requires P2' }
  }

  // Criterion 1: SYSTEM_CONNECTIVITY scope
  if (!vlc || vlc.verdict_scope !== 'SYSTEM_CONNECTIVITY') {
    return { mode: 'STRUCTURAL_INTELLIGENCE', reason: 'verdict_scope is not SYSTEM_CONNECTIVITY' }
  }

  // Criterion 2: >= 2 runtime conditions
  const conditions = (synthesisResult && synthesisResult.conditions) || []
  const runtimeConditions = conditions.filter(c => RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL')
  if (runtimeConditions.length < 2) {
    return { mode: 'STRUCTURAL_INTELLIGENCE', reason: 'fewer than 2 runtime conditions (' + runtimeConditions.length + ')' }
  }

  // Criterion 3: Proven divergence — runtime gravity loci ≠ static gravity loci
  const staticDomains = new Set()
  const runtimeDomains = new Set()
  for (const c of conditions) {
    if (c.severity === 'NOMINAL') continue
    const domains = (c.shared_topology_targets && c.shared_topology_targets.domains) || []
    if (RT_CONDITION_TYPES.has(c.condition_type)) {
      domains.forEach(id => runtimeDomains.add(id))
    } else {
      domains.forEach(id => staticDomains.add(id))
    }
  }
  const runtimeOnly = [...runtimeDomains].filter(id => !staticDomains.has(id))
  if (runtimeOnly.length === 0) {
    return { mode: 'STRUCTURAL_INTELLIGENCE', reason: 'no divergence — runtime gravity loci fully overlap with static' }
  }

  // Criterion 4: At least one blindness class evidenced
  let blindnessClassCount = 0
  const evidencedClasses = []
  for (const [className, condTypes] of Object.entries(BLINDNESS_CLASS_CONDITIONS)) {
    if (runtimeConditions.some(c => condTypes.includes(c.condition_type))) {
      blindnessClassCount++
      evidencedClasses.push(className)
    }
  }
  if (blindnessClassCount === 0) {
    return { mode: 'STRUCTURAL_INTELLIGENCE', reason: 'no blindness class evidenced' }
  }

  return {
    mode: 'EXECUTION_BLINDNESS',
    reason: 'all criteria met',
    evidence: {
      runtime_condition_count: runtimeConditions.length,
      divergent_domain_count: runtimeOnly.length,
      blindness_classes: evidencedClasses,
    },
  }
}

function projectFromConsequences({ boardroom, balanced, consequenceResult, picp, groundingContext, vlc, architecturalFindings, synthesisResult }) {
  if (!boardroom) return { ok: false, error: 'No boardroom projection available' }

  const narrativeMode = determineNarrativeMode({ boardroom, vlc, architecturalFindings, synthesisResult })

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

  const chapters = narrativeMode.mode === 'EXECUTION_BLINDNESS'
    ? [
        chapterExecutiveBrief(boardroom, ctx, narrativeMode),
        chapterWhatOrgBelieves(boardroom, slices, narratives, ctx),
        chapterWhatGovernsExecution(boardroom, balanced, slices, narratives, runtimeConsequences, architecturalFindings, ctx),
        chapterWhatCannotBeSeen(slices, runtimeConsequences, architecturalFindings, ctx),
        chapterSWIntelligence(narratives, themes, runtimeConsequences, boardroom),
        chapterWhyTraditionalMissed(detection, runtimeConsequences, architecturalFindings),
        chapterExecutiveConsequences(allConsequences, runtimeConsequences, narratives, architecturalFindings, ctx),
        chapterExecutiveVerdict(boardroom, balanced, ctx, narrativeMode),
      ]
    : [
        chapterExecutiveBrief(boardroom, ctx, narrativeMode),
        chapterProgramOverview(boardroom, ctx),
        chapterStructuralStory(balanced, slices, ctx),
        chapterPIFindings(slices, themes, runtimeConsequences, ctx),
        chapterSWIntelligence(narratives, themes, runtimeConsequences, boardroom),
        chapterRiskLandscape(allConsequences, runtimeConsequences, narratives, ctx),
        chapterOperationalCeiling(ceiling, constraints, ctx),
        chapterDetectionBoundary(detection, runtimeConsequences),
        chapterExecutiveVerdict(boardroom, balanced, ctx, narrativeMode),
      ]

  return {
    ok: true,
    narrative_mode: narrativeMode.mode,
    narrative_evidence: narrativeMode.evidence || null,
    executive_posture: {
      posture_label: boardroom.posture_label,
      posture_severity: boardroom.posture_severity,
      posture_scope: boardroom.posture_scope,
      primary_locus: boardroom.primary_locus,
      overall_confidence: boardroom.overall_confidence,
    },
    chapters,
  }
}

function chapterExecutiveBrief(boardroom, ctx, narrativeMode) {
  const findings = []
  const isBlindness = narrativeMode && narrativeMode.mode === 'EXECUTION_BLINDNESS'

  if (isBlindness) {
    findings.push({
      id: 'eb-blindness',
      type: 'execution_blindness',
      severity: 'CRITICAL',
      title: 'Execution Blindness Detected',
      body: 'This system has failure modes that the organization cannot currently detect. The platform can report healthy while its operational backbone is failing. Static code analysis cannot discover these conditions.',
      evidence: ['architectural_findings', 'runtime_conditions'],
    })
  }

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
    narrative: isBlindness ? {
      assertion: boardroom.primary_locus + ' is not primarily exposed because its codebase is structurally complex. It is exposed because the operational system depends on runtime coordination paths that are not visible from the code structure.',
      body: 'Static analysis points the organization toward ' + boardroom.primary_locus + '. Runtime analysis shows that operational continuity is governed elsewhere. This creates Execution Blindness: the system can appear healthy while the operational backbone is failing. The findings that follow are organized not by severity, but by visibility — what the organization can see, what it cannot, and why that matters.',
      transition: 'The assessment begins with what the organization currently understands.',
    } : null,
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
      classes: n.classes || null,
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
    narrative: {
      assertion: 'Software Intelligence identifies the visible structural pressures that remain valid after runtime evidence expands the system boundary.',
      body: 'The static picture is not wrong. It is incomplete. Software Intelligence identifies the internal pressure zones that engineering can already observe: concentration, propagation, fragility, drift, and convergence. Execution Blindness does not replace these findings — it explains why they are insufficient for operational decision-making. Classes: A = Flow, B = Concentration, C = Fragility, D = Reinforcement, E = Drift.',
      transition: null,
    },
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

function chapterExecutiveVerdict(boardroom, balanced, ctx, narrativeMode) {
  const findings = []
  const isBlindness = narrativeMode && narrativeMode.mode === 'EXECUTION_BLINDNESS'

  if (isBlindness) {
    findings.push(
      { id: 'ev-discovery-1', type: 'remembered_discovery', severity: 'CRITICAL',
        title: 'Operational gravity does not live where code gravity lives',
        body: 'The code center of mass and the operational center of mass do not coincide. Transformation planning based solely on static code analysis targets the wrong center of mass for operational resilience.',
        evidence: ['AF-001'] },
      { id: 'ev-discovery-2', type: 'remembered_discovery', severity: 'HIGH',
        title: 'The highest-impact failure mode was invisible',
        body: 'Runtime connectivity analysis revealed failure modes that no static analysis tool can detect. These failures produce no internal error signal — the organization cannot observe them from inside the application boundary.',
        evidence: ['AF-003', 'AF-004', 'AF-005'] },
      { id: 'ev-discovery-3', type: 'remembered_discovery', severity: 'HIGH',
        title: 'The operational system is larger than the software system',
        body: 'The system boundary extends beyond the codebase to external infrastructure and edge hardware. Dependencies outside the software boundary carry the highest operational impact.',
        evidence: ['AF-005', 'runtime_connectivity'] },
    )
  }

  findings.push({
    id: 'ev-verdict',
    type: 'verdict',
    severity: boardroom.posture_severity,
    title: boardroom.posture_label,
    body: boardroom.combined_synthesis || '',
    evidence: ['structural_posture', 'tension_map', 'operational_ceiling'],
  })

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
    chapter_label: 'Verdict',
    sequence: isBlindness ? 8 : 9,
    findings,
    evidence_objects: ['structural_posture', 'tension_map', 'operational_ceiling'],
    narrative: isBlindness ? {
      assertion: 'This assessment changes the organization\'s understanding of where operational risk resides.',
      body: 'Three discoveries emerge from the combined static and runtime analysis. Each is individually significant. Together, they indicate that the organization\'s current structural understanding — while technically accurate — is operationally incomplete. Transformation planning, resilience investment, and architectural prioritization must account for both the visible code structure and the invisible operational coordination backbone.',
      transition: null,
    } : null,
  }
}

// ─── MODE B: EXECUTION BLINDNESS CHAPTERS ─────────────────────────

function chapterWhatOrgBelieves(boardroom, slices, narratives, ctx) {
  const staticSlices = slices.filter(s => !isRuntimeType(s.condition_type))

  const staticDomains = staticSlices.map(s => s.domain).filter(Boolean)
  const domainCounts = {}
  staticDomains.forEach(d => { domainCounts[d] = (domainCounts[d] || 0) + 1 })
  const primaryDomain = Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || boardroom.primary_locus || 'the primary structural region'

  const findings = []
  findings.push({
    id: 'wob-frame',
    type: 'organizational_belief',
    severity: boardroom.posture_severity,
    title: 'The visible picture: ' + primaryDomain,
    body: 'Static code analysis identifies structural coupling, dependency concentration, and propagation risk. These are real findings. They represent what the organization can see and reason about today.',
    evidence: ['static_conditions'],
  })

  for (const s of staticSlices.slice(0, 5)) {
    findings.push({
      id: 'wob-' + (s.condition_type || findings.length),
      type: 'visible_condition',
      severity: s.severity,
      title: s.executive_name,
      body: s.operational_meaning || '',
      domain: s.domain,
      evidence: ['condition:' + s.condition_type],
    })
  }

  return {
    chapter_id: 'what_org_believes',
    chapter_label: 'What the Organization Believes',
    sequence: 2,
    findings,
    evidence_objects: ['structural_posture', 'tension_map'],
    narrative: {
      assertion: 'Static code analysis identifies ' + primaryDomain + ' as the dominant structural center of gravity.',
      body: 'This conclusion is supported by ' + staticSlices.length + ' structural conditions including coupling pressure, dependency concentration, and propagation risk. Viewed through a traditional architecture lens, ' + primaryDomain + ' appears to be the most critical operational region — it absorbs disproportionate structural mass and constrains cross-domain independence. An experienced engineering team would reasonably focus transformation efforts here. At this point, the structural picture appears complete.',
      transition: 'Runtime connectivity evidence reveals a different operational reality.',
    },
  }
}

function chapterWhatGovernsExecution(boardroom, balanced, slices, narratives, runtimeConsequences, architecturalFindings, ctx) {
  const findings = []
  const af001 = (architecturalFindings || []).find(f => f.id === 'AF-001' || f.finding_id === 'AF-001')

  if (af001) {
    findings.push({
      id: 'wge-divergence',
      type: 'gravity_divergence',
      severity: af001.significance || 'CRITICAL',
      title: af001.title,
      body: af001.description,
      evidence: ['AF-001'],
    })
  }

  const runtimeSlices = slices.filter(s => isRuntimeType(s.condition_type))
  for (const s of runtimeSlices) {
    findings.push({
      id: 'wge-rt-' + s.condition_type,
      type: 'runtime_governance',
      severity: s.severity,
      title: s.executive_name,
      body: s.operational_meaning || '',
      domain: s.domain,
      evidence: ['condition:' + s.condition_type],
      evidence_class: 'RUNTIME',
    })
  }

  if (balanced && balanced.primary_story) {
    findings.push({
      id: 'wge-story',
      type: 'primary_story',
      severity: balanced.primary_story.severity,
      title: balanced.primary_story.title,
      body: balanced.primary_story.operational_implication,
      evidence: ['tension_map'],
    })
  }

  const rtDomains = [...new Set(runtimeSlices.map(s => s.domain).filter(Boolean))]
  const staticSlicesHere = slices.filter(s => !isRuntimeType(s.condition_type))
  const stDomains = [...new Set(staticSlicesHere.map(s => s.domain).filter(Boolean))]
  const overlapDomains = stDomains.filter(d => rtDomains.includes(d))
  const staticOnly = stDomains.filter(d => !rtDomains.includes(d))
  const runtimeOnly = rtDomains.filter(d => !stDomains.includes(d))

  return {
    chapter_id: 'what_governs_execution',
    chapter_label: 'What Actually Governs Execution',
    sequence: 3,
    findings,
    evidence_objects: ['architectural_findings', 'runtime_conditions', 'tension_map'],
    narrative: {
      assertion: 'The operational center of mass resides in ' + (runtimeOnly.slice(0, 3).join(', ') || rtDomains.slice(0, 3).join(', ') || 'runtime coordination structures') + ' — not where the code is heaviest.',
      body: (af001 ? af001.description + ' ' : '') + 'Runtime evidence from event flows, message brokers, and WebSocket streams reveals that operational coordination is governed by structures that do not appear as dominant nodes in the static import graph.',
      transition: 'This divergence creates specific forms of organizational blindness.',
      _staticDomains: staticOnly,
      _runtimeDomains: runtimeOnly,
      _overlapDomains: overlapDomains,
    },
  }
}

function chapterWhatCannotBeSeen(slices, runtimeConsequences, architecturalFindings, ctx) {
  const findings = []
  const af = architecturalFindings || []

  const blindnessGroups = {
    BOUNDARY: { label: 'Boundary Blindness', subtitle: 'Critical dependencies exist outside the software boundary', afs: ['AF-003', 'AF-005'], conditions: BLINDNESS_CLASS_CONDITIONS.BOUNDARY },
    SILENCE: { label: 'Silence Blindness', subtitle: 'Failure produces absence of signal, not observable error', afs: ['AF-003', 'AF-004'], conditions: BLINDNESS_CLASS_CONDITIONS.SILENCE },
    COUPLING: { label: 'Coupling Blindness', subtitle: 'Runtime coordination blast radius exceeds static prediction', afs: ['AF-004'], conditions: BLINDNESS_CLASS_CONDITIONS.COUPLING },
  }

  for (const [type, group] of Object.entries(blindnessGroups)) {
    const matchingAFs = af.filter(f => group.afs.includes(f.id))
    const matchingSlices = slices.filter(s => group.conditions.includes(s.condition_type))

    if (matchingAFs.length > 0 || matchingSlices.length > 0) {
      findings.push({
        id: 'wcbs-' + type.toLowerCase(),
        type: 'blindness_class',
        severity: matchingAFs.length > 0 ? (matchingAFs[0].significance || 'HIGH') : (matchingSlices[0] && matchingSlices[0].severity) || 'ELEVATED',
        title: group.label,
        body: group.subtitle + '. ' + matchingAFs.map(f => f.description).join(' '),
        evidence: matchingAFs.map(f => f.id),
        blindness_type: type,
      })
    }
  }

  const activeTypes = Object.entries(blindnessGroups).filter(([, g]) => {
    const matchingAFs = af.filter(f => g.afs.includes(f.id))
    const matchingSlices = slices.filter(s => g.conditions.includes(s.condition_type))
    return matchingAFs.length > 0 || matchingSlices.length > 0
  }).map(([type]) => type.toLowerCase())

  return {
    chapter_id: 'what_cannot_be_seen',
    chapter_label: 'What Cannot Currently Be Seen',
    sequence: 4,
    findings,
    evidence_objects: ['architectural_findings', 'runtime_conditions'],
    narrative: {
      assertion: 'Three forms of execution blindness are evidenced: ' + activeTypes.join(', ') + '.',
      body: 'Execution blindness occurs when a system can fail while the organization believes it is healthy. This assessment identifies ' + findings.length + ' distinct blindness classes, each representing a category of failure that produces no observable signal within the application boundary. These are not theoretical risks — each is supported by measured runtime evidence from the operational system.',
      transition: 'The next question is why these conditions were not visible before.',
    },
  }
}

function chapterWhyTraditionalMissed(detection, runtimeConsequences, architecturalFindings) {
  const findings = []
  const af = architecturalFindings || []

  const af002 = af.find(f => f.id === 'AF-002')
  if (af002) {
    findings.push({
      id: 'wtm-coverage',
      type: 'visibility_correction',
      severity: af002.significance || 'HIGH',
      title: af002.title,
      body: af002.description,
      evidence: ['AF-002'],
    })
  }

  const invisibleFindings = af.filter(f => ['AF-003', 'AF-004', 'AF-005'].includes(f.id))
  for (const f of invisibleFindings) {
    findings.push({
      id: 'wtm-' + f.id,
      type: 'invisible_finding',
      severity: f.significance || 'ELEVATED',
      title: f.title,
      body: f.executive_implication || f.description,
      evidence: [f.id],
    })
  }

  if (findings.length === 0) {
    findings.push({
      id: 'wtm-generic',
      type: 'detection_gap',
      severity: 'ELEVATED',
      title: 'Static analysis measures code coupling, not operational coordination',
      body: 'Runtime coordination mechanisms (event flows, message brokers, WebSocket streams) do not create import edges. They are invisible to any tool that measures code structure alone.',
      evidence: ['runtime_conditions'],
    })
  }

  return {
    chapter_id: 'why_traditional_missed',
    chapter_label: 'Why Traditional Analysis Missed It',
    sequence: 6,
    findings,
    evidence_objects: ['architectural_findings', 'detection_boundary'],
    narrative: {
      assertion: 'Static analysis measures code coupling. It does not measure operational coordination.',
      body: (af002 ? af002.description + ' ' : '') + 'Runtime coordination mechanisms — event flows, message brokers, WebSocket streams, dependency injection — do not create import edges. They are structurally invisible to any tool that measures code structure alone. The findings below are concrete examples of structural risks that no static analysis tool can discover.',
      transition: 'These invisible conditions carry specific executive consequences.',
    },
  }
}

function chapterExecutiveConsequences(allConsequences, runtimeConsequences, narratives, architecturalFindings, ctx) {
  const findings = []
  const af = architecturalFindings || []

  const af003 = af.find(f => f.id === 'AF-003')
  const af004 = af.find(f => f.id === 'AF-004')

  if (af003) {
    findings.push({
      id: 'ec-broker-failure',
      type: 'failure_scenario',
      severity: af003.significance || 'HIGH',
      title: 'Broker failure disconnects all field telemetry',
      body: af003.executive_implication || af003.description,
      evidence: ['AF-003'],
    })
  }

  if (af004) {
    findings.push({
      id: 'ec-event-failure',
      type: 'failure_scenario',
      severity: af004.significance || 'ELEVATED',
      title: 'Event handler failure interrupts cross-domain coordination',
      body: af004.executive_implication || af004.description,
      evidence: ['AF-004'],
    })
  }

  const rtRisks = allConsequences
    .filter(c => c.severity !== 'NOMINAL' && ((c.consequence_type_id || '').startsWith('RT_') || c.visibility_layer === 'RUNTIME'))
    .slice(0, 5)
  for (const c of rtRisks) {
    if (findings.some(f => f.title === c.operator_consequence_title)) continue
    findings.push({
      id: 'ec-rt-' + c.consequence_type_id,
      type: 'runtime_consequence',
      severity: c.severity,
      title: c.operator_consequence_title,
      body: c.operational_implication,
      evidence: ['consequence:' + c.consequence_type_id],
    })
  }

  return {
    chapter_id: 'executive_consequences',
    chapter_label: 'Executive Consequences',
    sequence: 7,
    findings,
    evidence_objects: ['architectural_findings', 'consequence_compiler'],
    narrative: {
      assertion: 'The failure modes identified above carry operational consequences that extend beyond the codebase boundary.',
      body: 'Each blind spot corresponds to a specific failure scenario. These are not hypothetical — they are derived from measured runtime coordination topology. The consequences below describe what happens when these invisible dependencies fail: which domains are affected, whether the failure is detectable, and what operational capability is lost.',
      transition: null,
    },
  }
}

function isRuntimeType(type) {
  return type && (type.startsWith('RT_') || ['EVENT_CONCENTRATION', 'RUNTIME_DEPENDENCY_CHOKE_POINT', 'BROKER_DEPENDENCY', 'TOPIC_FANOUT_PRESSURE', 'ASYNC_PROPAGATION_ASYMMETRY', 'EDGE_CLOUD_PROPAGATION_RISK', 'RUNTIME_OBSERVABILITY_GAP'].includes(type))
}

module.exports = { projectFromConsequences, determineNarrativeMode }

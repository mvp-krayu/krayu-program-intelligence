// LEGACY_NON_AUTHORITATIVE — Superseded by ConsequenceNativeEIR.js
// This file independently synthesizes cognition from PICP objects.
// The authoritative path is: ConsequenceCompiler → forBoardroom/forBalanced → ConsequenceNativeEIR.
// Retained for reference only. No active callers after EIR authority rebase.
//
// Original description:
// Executive Intelligence Synthesis — Consumer Intelligence Module for EIR.
// Reads all 9 PICP cognition objects + specimen grounding context to produce
// narrative-arc executive chapters with named entities and per-condition deep dives.
// Deterministic: same PICP + same context → same synthesis. No AI participation.
// This produces a Consumer Intelligence Artifact, NOT a cognition object.

const SEVERITY_RANK = { CRITICAL: 5, HIGH: 4, ELEVATED: 3, MODERATE: 2, LOW: 1, NOMINAL: 0 }

const CLASS_RISK_LABEL = {
  A:     'flow convergence — delivery pressure concentrates here',
  B:     'structural concentration — disproportionate mass and dependency',
  C:     'structural fragility — changes break more than they should',
  D:     'coupling rigidity — tightly coupled modules resist independent change',
  E:     'structural drift — coupling patterns shifting unpredictably',
  AB:    'flow pressure on a concentrated structure — a bottleneck that everything flows through',
  AC:    'flow pressure compounding fragility — delivery pressure hits a structurally weak region',
  AD:    'flow pressure locked by coupling — delivery converges on rigidly coupled modules',
  AE:    'flow pressure on a drifting structure — delivery converges on a region losing predictability',
  BC:    'concentrated and fragile — high-mass region that is also structurally brittle',
  BD:    'concentrated and rigidly coupled — high-mass region locked by bidirectional dependencies',
  BE:    'concentrated and drifting — high-mass region with shifting coupling patterns',
  CD:    'fragile and rigidly coupled — weak structure reinforced by coupling that prevents restructuring',
  CE:    'fragile and drifting — weak structure with unstable coupling compounding unpredictability',
  DE:    'rigid yet drifting — tightly coupled modules showing structural instability',
  ABC:   'flow, concentration, and fragility converging — a gravity well that is also brittle',
  ABD:   'flow, concentration, and coupling converging — everything flows through a rigidly locked region',
  ABE:   'flow, concentration, and drift converging — a bottleneck losing structural predictability',
  ACD:   'flow, fragility, and coupling converging — delivery pressure hits fragile coupled modules',
  ACE:   'flow, fragility, and drift converging — delivery pressure hits a fragile unstable region',
  ADE:   'flow, coupling, and drift converging — delivery locked by rigid coupling in a drifting region',
  BCD:   'concentration, fragility, and coupling converging — the heaviest region is also the most brittle and hardest to change',
  BCE:   'concentration, fragility, and drift converging — a heavy brittle region with unstable coupling',
  BDE:   'concentration, coupling, and drift converging — a rigid mass region losing predictability',
  CDE:   'fragility, coupling, and drift converging — fragile rigid structure that is also drifting',
  ABCD:  'flow, mass, fragility, and coupling converging in one region',
  ABCE:  'flow, concentration, fragility, and drift converging — a brittle gravity well that is unstable',
  ABDE:  'flow, concentration, coupling, and drift converging — a rigid bottleneck losing predictability',
  ACDE:  'flow, fragility, coupling, and drift converging — delivery pressure on a fragile drifting rigid region',
  BCDE:  'concentration, fragility, coupling, and drift converging — structural risk across all defensive axes',
  ABCDE: 'all five risk dimensions converging — flow, mass, fragility, coupling, and drift in one region',
}

const CLASS_QUESTION = {
  A: 'Where is operational flow concentrating or propagating beyond expected boundaries?',
  B: 'Where is structural mass or dependency creating concentration risk?',
  C: 'Where does the structure lack resilience against change?',
  D: 'Where are coupling patterns reinforcing structural rigidity?',
  E: 'Where is structural drift undermining operational predictability?',
}

const CONSEQUENCE_LABEL = {
  DEL_EXP: 'Delivery Exposure',
  PROP_EXP: 'Propagation Exposure',
  RESIL_DEF: 'Resilience Deficit',
  GOV_GAP: 'Governance Gap',
  SYSTEMIC_OP_FRAG: 'Systemic Operational Fragility',
  AMPLIFIED_DEP_FRAG: 'Amplified Dependency Fragility',
  STRUCT_GRAVITY_WELL: 'Structural Gravity Well',
  COORD_FRAG: 'Coordination Fragility',
  DEP_AMP: 'Dependency Amplification',
  OP_BOTTLENECK: 'Operational Bottleneck',
  STAB_RISK: 'Stability Risk',
}

const CONDITION_LABEL = {
  DELIVERY_PRESSURE_CONCENTRATION: 'Delivery Pressure Concentration',
  DEPENDENCY_CHOKE_POINT: 'Dependency Amplification',
  PROPAGATION_ASYMMETRY: 'Propagation Exposure',
  STRUCTURAL_MASS_CONCENTRATION: 'Structural Mass Concentration',
  CROSS_DOMAIN_COUPLING_PRESSURE: 'Cross-Domain Coupling Pressure',
  EXECUTION_FRAGILITY: 'Execution Fragility',
  EXECUTION_CONSTRICTION: 'Execution Constriction',
  STRUCTURAL_BOUNDARY_DIVERGENCE: 'Structural Boundary Divergence',
  COUPLING_INERTIA: 'Coupling Inertia',
  COMPOUND_CONVERGENCE: 'Compound Convergence',
  GOVERNANCE_COVERAGE_STATUS: 'Governance Coverage',
}


// --- Main entry ---

function synthesize(picp, context) {
  const objects = picp.cognition_objects || {}
  const ctx = context || {}

  const posture = objects.structural_posture || {}
  const tension = objects.tension_map || {}
  const constraints = objects.constraint_inventory || {}
  const exposure = objects.exposure_assessment || {}
  const trajectory = objects.trajectory_assessment || {}
  const absence = objects.absence_profile || {}
  const detection = objects.detection_boundary || {}
  const ceiling = objects.operational_ceiling || {}

  // S-level may be in PICP metadata rather than structural_posture (materializer uses readiness.posture)
  const metaQual = (picp.metadata || {}).qualification_state || {}
  if (!posture.qualification) posture.qualification = {}
  if (!posture.qualification.s_level && metaQual.s_level) {
    posture.qualification.s_level = metaQual.s_level
  }
  if (!posture.qualification.q_class && metaQual.q_class) {
    posture.qualification.q_class = metaQual.q_class
  }

  const dominant = identifyDominantPattern(posture, tension, ceiling, exposure)

  return {
    ok: true,
    executive_posture: dominant,
    chapters: [
      synthesizeExecutiveBrief(posture, tension, ceiling, exposure, dominant, ctx),
      synthesizeProgramOverview(posture, ctx),
      synthesizeStructuralStory(tension, ctx),
      synthesizePIFindings(tension, detection, ctx),
      synthesizeSWIntelligence(tension, absence, dominant),
      synthesizeRiskLandscape(exposure, tension, ceiling, ctx),
      synthesizeOperationalCeiling(ceiling, constraints, ctx),
      synthesizeDetectionBoundary(detection),
      synthesizeVerdict(posture, tension, ceiling, dominant, ctx),
    ],
  }
}

function identifyDominantPattern(posture, tension, ceiling, exposure) {
  const classActivation = tension.behavioral_class_activation || []
  const activeClassIds = classActivation.map(a => a.class_id).sort()
  const classKey = activeClassIds.join('')

  const cs = ceiling.posture_statement || {}
  const cf = ceiling.ceiling_factors || {}
  const q = posture.qualification || {}
  const systemicExposures = (exposure.consequence_exposure || []).filter(c => c.scope === 'SYSTEMIC')

  return {
    class_key: classKey,
    class_count: activeClassIds.length,
    active_classes: classActivation.map(a => ({
      id: a.class_id, name: a.class_name,
      condition_count: a.condition_count, max_severity: a.max_severity,
    })),
    risk_label: CLASS_RISK_LABEL[classKey] || null,
    ceiling_exists: cs.ceiling_exists || false,
    ceiling_hard: !!(cf.critical_convergence),
    s_level: q.s_level,
    q_class: q.q_class,
    q_label: q.q_label,
    dominant_severity: classActivation.length > 0 ? classActivation[0].max_severity : 'NOMINAL',
    total_active_conditions: tension.active_condition_count || 0,
    convergence_count: tension.composite_count || 0,
    systemic_exposure_count: systemicExposures.length,
    consequence_count: cf.consequence_count || 0,
    systemic_count: cf.systemic_count || 0,
  }
}


// --- Chapter 1: Executive Brief ---

function synthesizeExecutiveBrief(posture, tension, ceiling, exposure, dominant, ctx) {
  const findings = []
  const q = posture.qualification || {}
  const scale = ctx.scale || {}
  const centers = tension.convergence_centers || []
  const cs = ceiling.posture_statement || {}
  const cf = ceiling.ceiling_factors || {}
  const clientName = ctx.client_name || 'This program'

  // Finding 1: Headline discovery
  let headline = clientName + ' is a ' + commaNum(scale.file_count || 0) + '-file software program organized across ' +
    (scale.semantic_domain_count || 0) + ' semantic business domains and ' + (scale.cluster_count || 0) + ' structural clusters, ' +
    'with ' + commaNum(scale.total_import_edges || 0) + ' import relationships and ' +
    commaNum(scale.total_classes || 0) + ' class definitions.'

  if (centers.length > 0) {
    headline += ' ' + clientName + ' has ' + centers.length + ' distinct structural pressure center' +
      (centers.length !== 1 ? 's' : '') + ' — '
    const parts = centers.map(c => {
      const domains = (c.domains || []).map(d => domainName(d, ctx)).join(' and ')
      return 'one in ' + (domains || 'an unresolved region')
    })
    headline += parts.join(', and ') + '.'

    for (const center of centers) {
      const domains = (center.domains || []).map(d => domainName(d, ctx)).join(' and ')
      const types = (center.contributing_condition_types || []).map(t => condLabel(t))
      headline += ' ' + (domains || 'Unknown region') + ': ' + center.contributing_count +
        ' independent structural conditions converge (' + types.join(', ') + ') at ' + center.severity + ' severity.'
    }
  }

  findings.push({
    finding_id: 'executive_headline',
    observed: headline,
    matters: dominant.class_count >= 3
      ? dominant.class_count + ' of 5 behavioral risk classes simultaneously active' +
        (dominant.risk_label ? ' — ' + dominant.risk_label : '') +
        '. Multi-class convergence means structural conditions reinforce each other across dimensions. This is a single compounding structural pattern, not a collection of independent issues.'
      : dominant.class_count >= 1
        ? 'Active behavioral classes indicate structural stress patterns constraining operational capacity.'
        : 'No active behavioral risk classes — structural health across measured dimensions.',
    operational_implication: cs.ceiling_exists
      ? 'Operational ceiling present, driven by ' + (cf.consequence_count || 0) + ' consequences (' +
        (cf.systemic_count || 0) + ' systemic).' +
        (cf.critical_convergence ? ' Critical convergence — structurally reinforced ceiling that cannot be resolved through isolated intervention.' : '')
      : null,
    leadership_implication: centers.length > 0
      ? 'These are not minor code quality issues. They are structural execution constraints that directly affect delivery speed, coordination cost, and operational resilience. They persist regardless of team composition, sprint planning, or process changes.'
      : null,
  })

  // Finding 2: What leadership should understand immediately
  const points = []
  if (cs.ceiling_exists) {
    points.push('Delivery speed is structurally constrained. Adding developers will not proportionally increase throughput. The program has topological bottlenecks that create throughput ceilings independent of staffing.')
  }
  if (centers.length > 0) {
    const regionNames = centers.map(c => (c.domains || []).map(d => domainName(d, ctx)).join(' and '))
    points.push(regionNames.join(' and ') + ' concentrate disproportionate risk. Operational resilience depends disproportionately on the stability of these regions.')
  }
  if ((ctx.divergence || {}).pair_count > 0) {
    points.push('Organizational boundaries do not match structural reality. Governance assumptions — code ownership, review policies, deployment boundaries — are drawn around directories, but dependencies cross those lines.')
  }
  if (dominant.class_count >= 3) {
    points.push('These findings are structural, not circumstantial. They persist regardless of team composition, sprint planning, or process changes. They require architectural intervention, not process adjustment.')
  }

  if (points.length > 0) {
    findings.push({
      finding_id: 'executive_leadership_summary',
      observed: 'What leadership should understand immediately: ' + points.map((p, i) => (i + 1) + '. ' + p).join(' '),
      matters: 'These structural constraints define the program\'s operational ceiling. Without architectural intervention, they will persist and compound over successive operational cycles.',
    })
  }

  // Finding 3: Qualification posture
  const env = posture.confidence_envelope || {}
  findings.push({
    finding_id: 'executive_qualification',
    observed: 'Overall operational posture: ' + (q.s_level || 'undetermined') +
      (q.q_class ? ' ' + q.q_class : '') +
      (q.q_label ? ' (' + q.q_label + ')' : '') +
      '. ' + dominant.total_active_conditions + ' structural conditions across ' +
      dominant.class_count + ' behavioral classes' +
      (dominant.convergence_count > 0 ? ', ' + dominant.convergence_count + ' compound convergence event' + (dominant.convergence_count !== 1 ? 's' : '') : '') +
      '.' +
      (env.governance_verdict ? ' Governance verdict: ' + env.governance_verdict + '.' : ''),
    matters: 'Same structural inputs produce the same findings. All conclusions in this report are deterministically derived from the import topology.',
  })

  return {
    chapter_id: 'executive_brief',
    chapter_label: 'Executive Brief',
    sequence: 1,
    findings,
    evidence_objects: ['structural_posture', 'tension_map', 'operational_ceiling', 'exposure_assessment'],
  }
}


// --- Chapter 2: Program Overview ---

function synthesizeProgramOverview(posture, ctx) {
  const scale = ctx.scale || {}
  const clientName = ctx.client_name || 'The program'
  const findings = []

  findings.push({
    finding_id: 'overview_scale',
    observed: 'Structural scale: ' + commaNum(scale.file_count || 0) + ' source files analyzed, ' +
      commaNum(scale.total_import_edges || 0) + ' import relationships mapped, ' +
      commaNum(scale.total_classes || 0) + ' class definitions, ' +
      commaNum(scale.total_functions || 0) + ' function definitions. ' +
      'Organized across ' + (scale.semantic_domain_count || 0) + ' semantic business domains and ' +
      (scale.cluster_count || 0) + ' structural clusters.',
    matters: 'Scale determines the analysis depth. The import graph — ' + commaNum(scale.total_import_edges || 0) +
      ' relationships across ' + commaNum(scale.file_count || 0) + ' files — is the structural foundation for all findings in this report.',
  })

  return {
    chapter_id: 'program_overview',
    chapter_label: 'Program Overview',
    sequence: 2,
    findings,
    evidence_objects: ['structural_posture'],
  }
}


// --- Chapter 3: The Structural Execution Story ---

function synthesizeStructuralStory(tension, ctx) {
  const findings = []
  const constriction = ctx.constriction || {}
  const fragility = ctx.fragility || {}
  const divergence = ctx.divergence || {}
  const centers = tension.convergence_centers || []
  const scale = ctx.scale || {}

  // Topology baseline — always present
  const centerCount = centers.length
  const condCount = tension.active_condition_count || 0
  let baseline = 'The structural topology spans ' + commaNum(scale.file_count || 0) + ' files across ' +
    (scale.semantic_domain_count || 0) + ' semantic domains and ' + (scale.cluster_count || 0) + ' structural clusters.'
  if (centerCount > 0) {
    baseline += ' Program Intelligence identified ' + centerCount + ' convergence center' + (centerCount !== 1 ? 's' : '') +
      ' — structural regions where multiple independent conditions co-locate.'
    const names = centers.map(c => (c.domains || []).map(d => domainName(d, ctx)).join(' and '))
    if (names.length > 0) baseline += ' Primary convergence: ' + names.join('; ') + '.'
  }
  if (condCount > 0) {
    baseline += ' ' + condCount + ' structural conditions above NOMINAL severity shape the execution landscape.'
  }
  findings.push({
    finding_id: 'story_topology_baseline',
    observed: baseline,
    matters: 'This topology — not org charts, not sprint velocity, not test coverage — is where delivery capacity is structurally determined.',
  })

  // How work flows — constriction
  if ((constriction.bridge_count || 0) > 0 || (constriction.articulation_count || 0) > 0) {
    let observed = 'Program Intelligence identified ' + (constriction.bridge_count || 0) +
      ' structural bridge nodes and ' + (constriction.articulation_count || 0) + ' articulation points' +
      ' — files that serve as the only connection path between otherwise-independent regions of the import graph.'
    const tops = (constriction.top_points || []).filter(p => p.file && p.file !== 'unknown')
    if (tops.length > 0) {
      observed += ' The constriction is most severe at ' + tops[0].file +
        ' (through-flow ' + tops[0].through_flow +
        (tops[0].components_if_removed > 0 ? ', ' + tops[0].components_if_removed + ' components isolated if removed' : '') + ').'
      if (tops.length > 1) {
        observed += ' Additional constriction points: ' + tops.slice(1, 3).map(p => p.file + ' (through-flow ' + p.through_flow + ')').join(', ') + '.'
      }
    }
    findings.push({
      finding_id: 'story_how_work_flows',
      observed,
      matters: 'Bridge nodes are execution constriction points — narrow structural passages where all traffic between two regions must flow. When work touches a bridge node, it serializes. Two teams working on opposite sides cannot proceed in parallel.',
      operational_implication: 'Adding more developers does not help at constriction points. The bottleneck is in the graph, not in the headcount.',
    })
  }

  // Where resilience weakens — fragility
  if ((fragility.hotspot_count || 0) > 0) {
    let observed = fragility.hotspot_count + ' structural fragility hotspot' + (fragility.hotspot_count !== 1 ? 's' : '') + ' identified — ' +
      'files with high external coupling combined with low internal cohesion.'
    const tops = (fragility.top_hotspots || []).filter(h => h.file)
    if (tops.length > 0) {
      observed += ' ' + tops.map(h =>
        h.file + ' (fragility score ' + h.score + ', ' + h.inbound + ' inbound, ' + h.outbound + ' outbound)'
      ).join('; ') + '.'
    }
    findings.push({
      finding_id: 'story_where_resilience_weakens',
      observed,
      matters: 'Fragile components amplify disruption. A change to a well-encapsulated module stays contained. A change to a fragile component propagates in unpredictable directions, because the component\'s connections span the system rather than staying within a bounded context.',
      operational_implication: 'Changes touching fragile components carry elevated risk of unexpected downstream impact. The region\'s apparent simplicity masks its structural exposure.',
    })
  }

  // Where coordination becomes difficult — divergence
  if ((divergence.pair_count || 0) > 0) {
    let observed = divergence.pair_count + ' structural boundary divergence pair' + (divergence.pair_count !== 1 ? 's' : '') + ' detected — ' +
      'modules whose declared organizational structure diverges from their actual dependency structure.'
    const tops = (divergence.top_pairs || [])
    if (tops.length > 0) {
      observed += ' ' + tops.map(p =>
        domainName(p.source, ctx) + ' → ' + domainName(p.target, ctx) +
        ' (' + p.imports + ' cross-boundary imports, ' + Math.round((p.ratio || 0) * 100) + '% cross-boundary ratio)'
      ).join('; ') + '.'
    }
    findings.push({
      finding_id: 'story_where_coordination_breaks',
      observed,
      matters: 'When organizational boundaries diverge from structural reality, governance assumptions become invalid. Code ownership policies assigned by directory do not reflect actual coupling. Teams working in different directories are, in structural reality, working on the same interconnected system.',
      operational_implication: 'Governance and ownership boundaries need realignment with actual structural dependencies.',
    })
  }

  return {
    chapter_id: 'structural_story',
    chapter_label: 'Structural Topology',
    sequence: 3,
    findings,
    evidence_objects: ['structural_posture', 'tension_map'],
  }
}


// --- Chapter 4: Program Intelligence Findings (per-condition deep dives) ---

function synthesizePIFindings(tension, detection, ctx) {
  const conditions = ctx.conditions || []
  const frontier = detection.measurement_frontier || []
  const centers = tension.convergence_centers || []
  const constriction = ctx.constriction || {}
  const fragility = ctx.fragility || {}
  const divergence = ctx.divergence || {}

  // Group non-convergence conditions by type
  const byType = {}
  for (const c of conditions) {
    if (c.condition_type === 'COMPOUND_CONVERGENCE') continue
    if (!byType[c.condition_type]) byType[c.condition_type] = []
    byType[c.condition_type].push(c)
  }

  // Sort by max severity descending
  const sorted = Object.entries(byType).sort((a, b) => {
    const maxA = a[1].reduce((m, c) => Math.max(m, SEVERITY_RANK[c.severity] || 0), 0)
    const maxB = b[1].reduce((m, c) => Math.max(m, SEVERITY_RANK[c.severity] || 0), 0)
    return maxB - maxA
  })

  const findings = []

  // Landscape preamble — summarize condition distribution before per-type detail
  const totalTypes = sorted.length
  const totalInstances = conditions.filter(c => c.condition_type !== 'COMPOUND_CONVERGENCE').length
  const sevCounts = {}
  for (const c of conditions) {
    if (c.condition_type === 'COMPOUND_CONVERGENCE') continue
    sevCounts[c.severity] = (sevCounts[c.severity] || 0) + 1
  }
  const sevParts = Object.entries(sevCounts)
    .sort((a, b) => (SEVERITY_RANK[b[0]] || 0) - (SEVERITY_RANK[a[0]] || 0))
    .map(([sev, count]) => count + ' ' + sev)
  if (totalTypes > 0) {
    findings.push({
      finding_id: 'finding_landscape',
      observed: totalInstances + ' structural condition' + (totalInstances !== 1 ? 's' : '') + ' across ' +
        totalTypes + ' condition type' + (totalTypes !== 1 ? 's' : '') +
        (sevParts.length > 0 ? ': ' + sevParts.join(', ') : '') + '.' +
        (centers.length > 0 ? ' ' + centers.length + ' compound convergence event' + (centers.length !== 1 ? 's' : '') + ' where multiple conditions co-locate.' : ''),
      matters: 'The following findings detail each structural condition individually. Compound convergence findings at the end of this chapter reveal where individual conditions interact.',
    })
  }

  for (const [type, instances] of sorted) {
    const allDomains = []
    const allFiles = []
    let maxSev = 'NOMINAL'
    for (const inst of instances) {
      for (const d of (inst.domains || [])) { if (!allDomains.includes(d)) allDomains.push(d) }
      for (const f of (inst.files || [])) { if (!allFiles.includes(f)) allFiles.push(f) }
      if ((SEVERITY_RANK[inst.severity] || 0) > (SEVERITY_RANK[maxSev] || 0)) maxSev = inst.severity
    }

    const domainNames = allDomains.map(d => domainName(d, ctx))
    const gap = frontier.find(f => f.condition_type === type)

    findings.push(buildConditionFinding(type, maxSev, domainNames, allFiles, gap, constriction, fragility, divergence, ctx))
  }

  // Convergence center findings (highest severity — listed last for narrative climax)
  for (const center of centers) {
    const domains = (center.domains || []).map(d => domainName(d, ctx)).join(' and ')
    const types = (center.contributing_condition_types || []).map(t => condLabel(t))
    const classes = (center.behavioral_classes || [])
    const classKey = classes.join('')

    let observed = 'Compound Convergence at ' + (domains || 'unknown region') + ' (' + center.severity + '): ' +
      center.contributing_count + ' independent structural conditions converge on a single region — ' +
      types.join(', ') + '. Each condition was triggered by independent evidence. Their co-location is a structural pattern, not a coincidence.'
    if (classes.length > 0) {
      observed += ' Behavioral classes ' + classes.join(', ') + ' active' +
        (CLASS_RISK_LABEL[classKey] ? ': ' + CLASS_RISK_LABEL[classKey] : '') + '.'
    }

    findings.push({
      finding_id: 'finding_convergence_' + (center.domains || []).join('_').toLowerCase(),
      observed,
      matters: 'Individual structural conditions can be managed in isolation. But when ' + center.contributing_count +
        ' conditions stack in the same region, they interact in ways that make the overall situation qualitatively worse than the sum of parts. ' +
        'A dependency choke point inside a pressure zone inside a structurally dominant cluster creates a compounding effect — a structural gravity well that attracts more mass, more pressure, and more risk over time.',
      operational_implication: 'This region requires fundamentally different treatment from the rest of the program. It is not merely an area with issues — it is where ' +
        center.contributing_count + ' independent risk vectors amplify each other.',
      leadership_implication: 'This is the finding that would be most difficult to produce through traditional analysis. Individual developers know that certain areas are hard to work with. But no traditional review reveals that ' +
        center.contributing_count + ' independent structural risk factors are converging on the same point — because traditional reviews assess one dimension at a time.',
    })
  }

  if (findings.length === 0) {
    findings.push({
      finding_id: 'finding_none',
      observed: 'No structural conditions above NOMINAL severity detected.',
      matters: 'Positive structural evidence — the program does not exhibit the structural patterns that Program Intelligence measures.',
    })
  }

  return {
    chapter_id: 'pi_findings',
    chapter_label: 'Program Intelligence Findings',
    sequence: 4,
    findings,
    evidence_objects: ['tension_map', 'detection_boundary', 'structural_posture', 'constraint_inventory'],
  }
}

function buildConditionFinding(type, severity, domainNames, files, gap, constriction, fragility, divergence, ctx) {
  const label = condLabel(type)
  const domainStr = domainNames.length > 0 ? domainNames.join(' and ') : null

  let observed = label + ' at ' + severity + ' severity'
  if (domainStr) observed += ' in ' + domainStr
  observed += '.'

  // Type-specific structural enrichment
  switch (type) {
    case 'EXECUTION_CONSTRICTION': {
      const bc = constriction.bridge_count || 0
      const ac = constriction.articulation_count || 0
      if (bc > 0 || ac > 0) {
        observed += ' ' + bc + ' bridge nodes and ' + ac + ' articulation points identified.'
      }
      const tops = (constriction.top_points || []).filter(p => p.file && p.file !== 'unknown')
      if (tops.length > 0) {
        observed += ' Highest constriction: ' + tops[0].file + ' (through-flow ' + tops[0].through_flow + ').'
      }
      if (files.length > 0 && !observed.includes(files[0])) {
        observed += ' Condition anchored at: ' + files.slice(0, 3).join(', ') + '.'
      }
      break
    }
    case 'EXECUTION_FRAGILITY': {
      const hc = fragility.hotspot_count || 0
      if (hc > 0) observed += ' ' + hc + ' fragility hotspot' + (hc !== 1 ? 's' : '') + ' detected.'
      const tops = (fragility.top_hotspots || []).filter(h => h.file)
      if (tops.length > 0) {
        observed += ' ' + tops[0].file + ' (fragility score ' + tops[0].score + ', ' + tops[0].inbound + ' inbound dependencies, cohesion ' +
          (tops[0].outbound > 0 && tops[0].inbound > 0 ? (tops[0].outbound / (tops[0].inbound + tops[0].outbound)).toFixed(2) : 'low') + ').'
      }
      break
    }
    case 'STRUCTURAL_BOUNDARY_DIVERGENCE': {
      const pc = divergence.pair_count || 0
      if (pc > 0) observed += ' ' + pc + ' divergent boundary pair' + (pc !== 1 ? 's' : '') + ' detected.'
      const tops = (divergence.top_pairs || [])
      if (tops.length > 0) {
        const p = tops[0]
        observed += ' Highest divergence: ' + domainName(p.source, ctx) + ' → ' + domainName(p.target, ctx) +
          ' (' + Math.round((p.ratio || 0) * 100) + '% cross-boundary, ' + p.imports + ' cross-boundary imports).'
      }
      break
    }
    case 'DEPENDENCY_CHOKE_POINT': {
      if (files.length > 0) {
        observed += ' Primary choke point: ' + files[0] + '. This component concentrates inbound import dependencies far beyond the system mean.'
      }
      break
    }
    case 'PROPAGATION_ASYMMETRY': {
      if (files.length > 0) {
        observed += ' Primary propagation source: ' + files[0] + '. Outbound dependency surface exceeds the system mean by an order of magnitude.'
      }
      break
    }
    case 'STRUCTURAL_MASS_CONCENTRATION': {
      observed += ' One structural region carries a disproportionate share of the program\'s total structural mass — nodes, edges, and dependency weight.'
      break
    }
    case 'DELIVERY_PRESSURE_CONCENTRATION': {
      observed += ' Delivery pressure — the concentration of operational flow — converges on a single structural region.'
      break
    }
    case 'CROSS_DOMAIN_COUPLING_PRESSURE': {
      observed += ' Structural coupling crosses domain boundaries that different teams may own independently.'
      if (files.length > 0) {
        observed += ' Coupling anchor: ' + files.slice(0, 2).join(', ') + '.'
      }
      break
    }
    case 'COUPLING_INERTIA': {
      observed += ' Bidirectional import relationships create tightly-coupled clusters of modules that cannot evolve independently.'
      break
    }
    default: {
      if (files.length > 0 && files.length <= 3) {
        observed += ' Evidence files: ' + files.join(', ') + '.'
      }
    }
  }

  // Matters: structural consequence framing + measurement gap
  const MATTERS = {
    EXECUTION_CONSTRICTION: 'Constriction creates throughput ceilings invisible in conventional analysis. A project manager looking at velocity metrics sees slowdowns but cannot attribute them to topology. A team lead sees merge conflicts but cannot see that they are caused by structural bridges, not by poor coordination.',
    EXECUTION_FRAGILITY: 'Fragile components are disproportionately responsible for escaped defects. A change to a fragile file has an unpredictable blast radius because the file\'s connections span the system. Standard impact analysis based on directory proximity underestimates the true scope. This is distinct from a dependency choke point — fragility is about coupling topology, not concentration.',
    DEPENDENCY_CHOKE_POINT: 'Dependency amplification means that the true cost of changes to this component is systematically underestimated. A seemingly simple type modification — adding a field, changing a validation rule, adjusting a default — cascades to all dependent files. Comprehensive testing would need to cover every consumer context; in practice, testing covers a fraction, and the remainder becomes latent regression risk.',
    PROPAGATION_ASYMMETRY: 'When a component\'s outbound dependency surface is many times the average, its blast radius exceeds structural locality. Changes can theoretically affect all downstream files — and those files may in turn have their own downstream consumers. The propagation chain can reach deeply into the application.',
    STRUCTURAL_MASS_CONCENTRATION: 'Structural mass concentration creates a gravity well. As more functionality accretes around the dominant region, delivery exposure increases, and the cost of eventual restructuring grows. Without intervention, this region will continue to accumulate mass and risk at an accelerating rate.',
    CROSS_DOMAIN_COUPLING_PRESSURE: 'Cross-domain coupling means changes that appear internal to one domain cascade across domain boundaries. Module registration, dependency injection, or configuration changes propagate across boundaries that different teams may own independently.',
    STRUCTURAL_BOUNDARY_DIVERGENCE: 'When organizational boundaries diverge from structural reality, governance assumptions become invalid. Code ownership policies assigned by directory do not reflect actual coupling. Review policies scoped to a single directory miss cross-boundary dependencies. Deployment boundaries drawn around modules are wider than assumed.',
    COUPLING_INERTIA: 'Coupling inertia decays development velocity in proportion to cluster density. The cluster behaves as a monolithic change unit regardless of organizational boundaries. Refactoring one module forces cascading changes in others. Circular dependencies prevent clean extraction.',
    DELIVERY_PRESSURE_CONCENTRATION: 'Pressure concentration means operational flow converges on a region that already carries disproportionate structural weight. The pressure is not distributed — it has a center of gravity.',
    GOVERNANCE_COVERAGE_STATUS: 'Ungoverned structural surface means governance assumptions have blind spots that no amount of process improvement can close without structural realignment.',
  }

  let matters = MATTERS[type] || 'Structural condition affecting operational capacity.'
  if (gap && gap.measurement_gap) {
    matters += ' Detection boundary: ' + gap.measurement_gap
  }

  const OPERATIONAL = {
    EXECUTION_CONSTRICTION: 'Throughput through constriction points cannot be increased by adding capacity. The only resolution is architectural — creating alternative paths that reduce the topological dependency on single bridge nodes.',
    EXECUTION_FRAGILITY: 'Changes touching fragile regions carry elevated risk of unexpected downstream impact. The region\'s apparent simplicity masks its structural exposure.',
    DEPENDENCY_CHOKE_POINT: 'Change impact assessment in the affected layer consistently underestimates the actual blast radius.',
    PROPAGATION_ASYMMETRY: 'Routine changes in high fan-out regions may require broader review and testing than their apparent scope suggests.',
    STRUCTURAL_MASS_CONCENTRATION: 'Without intervention, this region will continue to accumulate mass and risk at an accelerating rate.',
    CROSS_DOMAIN_COUPLING_PRESSURE: 'What appears to be an internal change can affect testing requirements and deployment sequencing across teams.',
    STRUCTURAL_BOUNDARY_DIVERGENCE: 'Governance and ownership boundaries need realignment with actual structural dependencies. Teams working in different directories are, in structural reality, working on the same interconnected system.',
    COUPLING_INERTIA: 'Development velocity through coupled clusters is inversely proportional to cluster size.',
    DELIVERY_PRESSURE_CONCENTRATION: 'Operational stress on this region is self-reinforcing — the structural weight that created the pressure also attracts more pressure.',
  }

  const LEADERSHIP = {
    EXECUTION_CONSTRICTION: 'If teams report that parallel work keeps colliding despite good planning, the cause may be structural rather than organizational. Narrow passages in the topology force serialization regardless of coordination quality.',
    EXECUTION_FRAGILITY: 'If incident post-mortems consistently trace back to the same apparently minor components, the cause is structural fragility, not developer error.',
    DEPENDENCY_CHOKE_POINT: 'If seemingly minor changes to shared types cause surprising regressions in distant features, the cause is dependency amplification concentrated at a structural hub.',
    PROPAGATION_ASYMMETRY: 'When changes cause unexpected side effects in seemingly unrelated features, the cause may be asymmetric propagation from a high fan-out entry point.',
    STRUCTURAL_BOUNDARY_DIVERGENCE: 'If teams report unexpected cross-team dependencies, or if deployment of one module requires changes in another, the cause is structural boundary divergence — the organizational chart does not match the dependency graph.',
    COUPLING_INERTIA: 'If teams report that everything is connected to everything in certain areas, they are observing coupling inertia — bidirectional dependencies that structurally fuse modules into single change units.',
  }

  return {
    finding_id: 'finding_' + type.toLowerCase(),
    observed,
    matters,
    operational_implication: OPERATIONAL[type] || null,
    leadership_implication: LEADERSHIP[type] || null,
  }
}


// --- Chapter 5: Software Intelligence Assessment ---

function synthesizeSWIntelligence(tension, absence, dominant) {
  const classActivation = tension.behavioral_class_activation || []
  const findings = []

  if (classActivation.length > 0) {
    // Finding 1: Per-class activation
    let observed = 'Program Intelligence organizes structural findings into five behavioral cognition classes. ' +
      classActivation.length + ' of 5 classes active in this specimen: '
    observed += classActivation.map(a =>
      'Class ' + a.class_id + ' — ' + a.class_name + ': ' + a.condition_count +
      ' condition' + (a.condition_count !== 1 ? 's' : '') + ', peak ' + a.max_severity
    ).join('. ') + '.'

    const top = classActivation[0]
    findings.push({
      finding_id: 'sw_intel_class_activation',
      observed,
      matters: 'Dominant class: ' + top.class_name + '. ' + (CLASS_QUESTION[top.class_id] || '') +
        (classActivation.length >= 4
          ? ' With ' + classActivation.length + ' of 5 classes active, structural stress spans nearly all measurable dimensions.'
          : classActivation.length >= 2
            ? ' The distribution across ' + classActivation.length + ' classes reveals the primary structural stress axes.'
            : ''),
    })

    // Finding 2: Combined risk profile
    if (dominant.risk_label) {
      findings.push({
        finding_id: 'sw_intel_combined_profile',
        observed: 'Combined behavioral class activation: ' + dominant.class_key + '. ' +
          'Risk profile: ' + dominant.risk_label + '.',
        matters: classActivation.length >= 3
          ? 'This combination means structural conditions reinforce each other across dimensions. Intervention in one dimension encounters resistance from the others. The structural tension is self-reinforcing.'
          : 'Behavioral class pattern identifies the primary structural stress axis.',
      })
    }
  }

  // Finding 3: Absence analysis
  const summary = (absence || {}).coverage_summary || {}
  const unmeasured = (absence || {}).unmeasured_capabilities || []
  if (summary.total_condition_types) {
    const active = summary.active_count || 0
    const total = summary.total_condition_types || 1
    const notTriggered = summary.not_activated_count || 0

    findings.push({
      finding_id: 'sw_intel_absence',
      observed: active + ' of ' + total + ' condition types activated (' + Math.round((active / total) * 100) + '% detection rate). ' +
        (summary.suppressed_count || 0) + ' suppressed, ' +
        notTriggered + ' evaluated but not triggered, ' +
        (summary.unmeasured_count || 0) + ' not yet measurable.' +
        (notTriggered > 0 ? ' Conditions not triggered represent positive structural evidence — the program does not exhibit those patterns.' : ''),
      matters: 'Absence analysis is structural intelligence. What the system can detect but did not find is positive evidence of health in those dimensions.' +
        (unmeasured.length > 0 ? ' Unmeasured capabilities require temporal evidence (multiple analysis runs over time) that is not yet available for this specimen.' : ''),
      operational_implication: unmeasured.length > 0
        ? 'Detection gaps: ' + unmeasured.map(u => (u.capability || '').replace(/_/g, ' ').toLowerCase()).join(', ') + '.'
        : null,
    })
  }

  return {
    chapter_id: 'sw_intelligence',
    chapter_label: 'Software Intelligence Assessment',
    sequence: 5,
    findings,
    evidence_objects: ['tension_map', 'absence_profile'],
  }
}


// --- Chapter 6: Execution Risk Landscape ---

function synthesizeRiskLandscape(exposure, tension, ceiling, ctx) {
  const consequences = exposure.consequence_exposure || []
  const centers = tension.convergence_centers || []
  const drivers = ceiling.ceiling_drivers || []
  const findings = []

  // Localized risks
  const localized = consequences.filter(c => c.scope === 'LOCAL' || c.scope === 'REGIONAL')
  if (localized.length > 0) {
    const parts = localized.map(c => {
      let text = labelConsequence(c.consequence_type) + ' (' + c.severity + ', ' + c.scope + ')'
      if (c.locus) text += ' at ' + c.locus
      return text
    })
    findings.push({
      finding_id: 'risk_localized',
      observed: 'Localized and regional risk: ' + parts.join('; ') + '.',
      matters: 'Localized risks are contained to specific structural regions. Targeted intervention is feasible — the blast radius of remediation is bounded.',
    })
  }

  // Systemic risks
  const systemic = consequences.filter(c => c.scope === 'SYSTEMIC')
  if (systemic.length > 0) {
    const parts = systemic.map(c => {
      let text = labelConsequence(c.consequence_type) + ' (' + c.severity + ')'
      if (c.locus) text += ' at ' + c.locus
      return text
    })
    findings.push({
      finding_id: 'risk_systemic',
      observed: 'Systemic risk: ' + parts.join('; ') + '.',
      matters: 'Systemic risk affects the entire program. These structural vulnerabilities cannot be addressed through localized fixes — they require architectural intervention that addresses the underlying topology.',
    })
  }

  // Emergent risk — reinforcement between convergence centers
  if (centers.length >= 2) {
    const centerDescs = centers.map(c => (c.domains || []).map(d => domainName(d, ctx)).join(' and '))
    findings.push({
      finding_id: 'risk_emergent',
      observed: 'Reinforcement between convergence centers: ' + centerDescs.join(' and ') +
        ' are connected through structural propagation paths. Pressure originating in one center propagates to the other, which is already under separate structural stress. The two centers are not independent — they form a coupled risk pair.',
      matters: 'When convergence centers are structurally connected, conditions in one region amplify conditions in the other. This creates emergent risk that is greater than the sum of the individual convergence patterns.',
    })
  }

  if (findings.length === 0) {
    findings.push({
      finding_id: 'risk_minimal',
      observed: 'No significant structural risk concentration detected.',
      matters: 'Positive structural evidence — operational risk is distributed rather than concentrated.',
    })
  }

  return {
    chapter_id: 'risk_landscape',
    chapter_label: 'Execution Risk Landscape',
    sequence: 6,
    findings,
    evidence_objects: ['exposure_assessment', 'tension_map', 'operational_ceiling'],
  }
}


// --- Chapter 7: Operational Ceiling ---

function synthesizeOperationalCeiling(ceiling, constraints, ctx) {
  const ps = ceiling.posture_statement || {}
  const cf = ceiling.ceiling_factors || {}
  const drivers = ceiling.ceiling_drivers || []
  const cp = ceiling.ceiling_properties || {}
  const blockers = ceiling.advancement_blockers || []
  const totalConstraints = constraints.total_count || 0
  const byType = constraints.by_type || {}
  const findings = []

  // Ceiling assessment with locus names
  let observed = 'Operational ceiling: ' + (ps.ceiling_exists ? 'PRESENT' : 'ABSENT') +
    '. Qualification: ' + (ps.qualification_class || 'undetermined') +
    '. ' + (cf.consequence_count || 0) + ' consequences (' + (cf.systemic_count || 0) + ' systemic' +
    (cf.combination_patterns > 0 ? ', ' + cf.combination_patterns + ' combination patterns' : '') + ').' +
    (cf.critical_convergence ? ' Critical convergence detected.' : '')

  if (drivers.length > 0) {
    observed += ' Ceiling drivers: ' + drivers.map(d => {
      let text = labelConsequence(d.consequence_type) + ' (' + d.severity + ', ' + d.scope + ')'
      if (d.locus) text += ' at ' + d.locus
      return text
    }).join('; ') + '.'
  }

  findings.push({
    finding_id: 'ceiling_assessment',
    observed,
    matters: ps.ceiling_exists
      ? (cf.critical_convergence
        ? 'Structurally reinforced ceiling — multiple consequence types converge at critical severity. Cannot be resolved through isolated intervention; requires coordinated structural remediation across the convergence center.'
        : 'Addressable ceiling — no critical convergence. Targeted intervention at dominant drivers can lift the ceiling incrementally.')
      : 'No formal operational ceiling constrains current structural capacity.',
    operational_implication: [
      cp.architecture_sensitive ? 'Architecture-sensitive: remediation requires architectural change, not process optimization.' : null,
      cp.staffing_sensitive ? 'Staffing-sensitive: delivery patterns contribute to constraint severity.' : null,
    ].filter(Boolean).join(' ') || null,
  })

  // Constraint breakdown
  if (totalConstraints > 0) {
    const activeTypes = Object.entries(byType).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
    findings.push({
      finding_id: 'ceiling_constraints',
      observed: totalConstraints + ' structural constraints across ' + activeTypes.length +
        (activeTypes.length === 1 ? ' category' : ' categories') + ': ' +
        activeTypes.map(([k, v]) => k.replace(/_/g, ' ').toLowerCase() + ' (' + v + ')').join(', ') + '.',
      matters: 'Structural constraints are the mechanisms that enforce the operational ceiling — the specific conditions that limit what can be achieved without architectural intervention.',
    })
  }

  // Advancement blockers
  if (blockers.length > 0) {
    findings.push({
      finding_id: 'ceiling_blockers',
      observed: blockers.length + ' advancement blocker' + (blockers.length !== 1 ? 's' : '') +
        ' require resolution before qualification advancement.' +
        (blockers.length <= 5 ? ' ' + blockers.map(b => (b.description || b.blocker_id || 'unspecified')).join('; ') + '.' : ''),
      matters: 'Advancement blockers are specific structural or governance conditions that must be addressed before the program can qualify for the next operational state.',
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


// --- Chapter 8: What Traditional Analysis Cannot Discover ---

function synthesizeDetectionBoundary(detection) {
  const frontier = detection.measurement_frontier || []
  const novelty = detection.detection_novelty || {}
  const findings = []

  // Per-condition detection boundary
  for (const det of frontier) {
    findings.push({
      finding_id: 'detection_' + det.condition_type.toLowerCase(),
      observed: condLabel(det.condition_type) + ': ' + (det.measurement_capability || 'Structural detection capability.'),
      matters: det.measurement_gap || 'Traditional tools cannot detect this structural condition.',
      operational_implication: det.prior_art_measurement
        ? 'Traditional approach: ' + det.prior_art_measurement + '. Program Intelligence detects the structural cause, not the symptom.'
        : null,
    })
  }

  // Summary
  if (novelty.active_count || novelty.total_detection_types) {
    findings.push({
      finding_id: 'detection_summary',
      observed: (novelty.active_count || 0) + ' of ' + (novelty.total_detection_types || 0) +
        ' detection capabilities triggered in this specimen.' +
        ((novelty.available_count || 0) > 0
          ? ' ' + novelty.available_count + ' detection capabilities available but not triggered — structural health in those dimensions.'
          : ''),
      matters: 'Each triggered detection reveals a structural condition that is invisible to traditional engineering tools — code review, complexity analysis, performance testing, and architectural diagrams each examine one dimension at a time. Program Intelligence combines these dimensions to detect convergence patterns that no single-dimension analysis can reveal.',
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


// --- Chapter 9: Executive Verdict ---

function synthesizeVerdict(posture, tension, ceiling, dominant, ctx) {
  const q = posture.qualification || {}
  const centers = tension.convergence_centers || []
  const cs = ceiling.posture_statement || {}
  const clientName = ctx.client_name || 'This program'
  const findings = []

  let verdict = clientName + ' is a qualified, functional software program'
  if (q.s_level || q.q_class) {
    verdict += ' at ' + (q.s_level || '') + (q.q_class ? ' ' + q.q_class : '') +
      (q.q_label ? ' (' + q.q_label + ')' : '')
  }
  verdict += '. The structural intelligence is evidence-bound, deterministically reproducible, and architecturally grounded.'

  if (centers.length > 0) {
    verdict += ' Beneath this qualified surface, Program Intelligence discovered ' + centers.length +
      ' structural gravity center' + (centers.length !== 1 ? 's' : '') + ' that define the operational ceiling.'

    for (const center of centers) {
      const domains = (center.domains || []).map(d => domainName(d, ctx)).join(' and ')
      const types = (center.contributing_condition_types || []).map(t => condLabel(t))
      verdict += ' ' + (domains || 'Unknown region') + ': ' + center.contributing_count +
        ' conditions converging (' + types.join(', ') + ') at ' + center.severity + '.'
    }
  }

  if (cs.ceiling_exists) {
    verdict += ' ' + clientName + ' works — but its capacity to evolve, absorb change, and deliver at increasing velocity has a structural limit.' +
      ' The teams are likely already experiencing this limit as persistent friction — merge conflicts in shared layers, broader-than-expected blast radii from simple changes, coordination overhead that seems disproportionate to the work being done.'
  }

  verdict += ' Program Intelligence makes this friction visible, measurable, and addressable.'

  findings.push({
    finding_id: 'verdict',
    observed: verdict,
    matters: 'These are not quality defects. They are structural execution constraints that persist regardless of team composition, process maturity, or sprint planning. They create throughput ceilings that cannot be raised by adding capacity.',
    operational_implication: cs.ceiling_exists
      ? 'Certain kinds of change — the kinds that touch shared layers or cross module boundaries — are structurally more expensive than they appear. This is a topological constraint, not an organizational one.'
      : null,
    leadership_implication: dominant.class_count >= 3
      ? 'The structural intelligence produced by this analysis would be extremely difficult — and in some cases impossible — to discover through traditional code review, architectural assessment, or quality audit.'
      : null,
  })

  return {
    chapter_id: 'executive_verdict',
    chapter_label: 'Executive Verdict',
    sequence: 9,
    findings,
    evidence_objects: ['structural_posture', 'tension_map', 'operational_ceiling'],
  }
}


// --- Helpers ---

function domainName(id, ctx) {
  if (!id) return null
  const labels = (ctx && ctx.domainLabels) || {}
  return labels[id] || id.replace(/^DOMAIN-/, 'Domain ')
}

function condLabel(type) {
  return CONDITION_LABEL[type] || (type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function commaNum(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function labelConsequence(type) {
  return CONSEQUENCE_LABEL[type] ||
    (type || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

module.exports = { synthesize }

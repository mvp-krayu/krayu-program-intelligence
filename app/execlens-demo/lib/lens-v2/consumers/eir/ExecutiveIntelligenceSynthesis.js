// Executive Intelligence Synthesis — Consumer Intelligence Module for EIR.
// Reads all 9 PICP cognition objects and produces cross-object executive conclusions.
// Deterministic: same PICP → same synthesis. No AI participation.
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

const CONSTRAINT_LABEL = {
  STRUCTURAL_FRAGILITY: 'structural fragility',
  THROUGHPUT_CEILING: 'throughput ceiling',
  GOVERNANCE_MISALIGNMENT: 'governance misalignment',
  COUPLING_RIGIDITY: 'coupling rigidity',
  BLAST_RADIUS: 'blast radius',
}

function synthesize(picp) {
  const objects = picp.cognition_objects || {}

  const posture = objects.structural_posture || {}
  const tension = objects.tension_map || {}
  const constraints = objects.constraint_inventory || {}
  const exposure = objects.exposure_assessment || {}
  const trajectory = objects.trajectory_assessment || {}
  const decision = objects.decision_surface || {}
  const absence = objects.absence_profile || {}
  const detection = objects.detection_boundary || {}
  const ceiling = objects.operational_ceiling || {}

  const dominant = identifyDominantPattern(posture, tension, ceiling, exposure)

  return {
    ok: true,
    executive_posture: dominant,
    chapters: {
      posture: synthesizePosture(posture, ceiling, dominant),
      tension: synthesizeTensions(tension, constraints, dominant),
      exposure: synthesizeExposure(exposure, detection),
      trajectory: synthesizeTrajectory(trajectory),
      constraints: synthesizeConstraints(constraints, ceiling),
      decisions: synthesizeDecisions(decision, trajectory),
      absence: synthesizeAbsence(absence, detection),
      ceiling: synthesizeCeiling(ceiling, constraints),
    },
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


// --- Chapter synthesis functions ---
// Each returns { findings: Finding[], evidence_objects: string[] }
// Finding shape: { finding_id, observed, matters, operational_implication }

function synthesizePosture(posture, ceiling, dominant) {
  const q = posture.qualification || {}
  const s = posture.scale || {}
  const env = posture.confidence_envelope || {}
  const cs = ceiling.posture_statement || {}
  const cf = ceiling.ceiling_factors || {}
  const findings = []

  const scaleDesc = (s.total_nodes || 0) + ' structural nodes across ' + (s.cluster_count || 0) + ' clusters'
  const importDesc = s.import_relationships ? ' with ' + s.import_relationships + ' import relationships' : ''
  const classDesc = dominant.class_count > 0
    ? dominant.class_count + ' of 5 behavioral risk classes simultaneously active'
    : 'No behavioral risk classes activated'

  findings.push({
    finding_id: 'synthesis_executive_posture',
    observed: 'Qualification ' + (q.q_class || 'undetermined') +
      (q.q_label ? ' (' + q.q_label + ')' : '') +
      ' across ' + scaleDesc + importDesc + '. ' +
      classDesc +
      (dominant.risk_label ? ' — composite pattern: ' + dominant.risk_label : '') + '.' +
      (cs.ceiling_exists
        ? ' Operational ceiling present, driven by ' + (cf.consequence_count || 0) + ' consequences (' + (cf.systemic_count || 0) + ' systemic).'
        : ''),
    matters: dominant.class_count >= 3
      ? 'Multi-class behavioral convergence means structural conditions reinforce each other across dimensions — this is a single compounding structural pattern, not a collection of independent issues.'
      : dominant.class_count >= 1
        ? 'Active behavioral classes indicate structural stress patterns constraining operational capacity.'
        : 'No active behavioral risk classes — structural health across measured dimensions.',
    operational_implication: cs.ceiling_exists
      ? (cf.critical_convergence
        ? 'Critical convergence present — structurally reinforced ceiling that cannot be resolved through isolated intervention.'
        : 'No critical convergence — ceiling is addressable through targeted structural intervention.')
      : 'No formal operational ceiling constrains current structural capacity.',
  })

  if (env.semantic_continuity || env.evidence_availability) {
    findings.push({
      finding_id: 'synthesis_confidence_basis',
      observed: 'Evidence basis: semantic continuity ' + (env.semantic_continuity || 'unknown') +
        ', evidence availability ' + (env.evidence_availability || 'unknown') +
        '. Governance verdict: ' + (env.governance_verdict || 'unknown') + '.',
      matters: 'The confidence envelope bounds the reliability of all projections in this report.',
      operational_implication: null,
    })
  }

  return { findings, evidence_objects: ['structural_posture', 'operational_ceiling', 'tension_map'] }
}

function synthesizeTensions(tension, constraints, dominant) {
  const centers = tension.convergence_centers || []
  const classActivation = tension.behavioral_class_activation || []
  const totalConstraints = constraints.total_count || 0
  const constraintTypes = constraints.by_type || {}
  const findings = []

  if (centers.length > 0) {
    const allDomains = new Set()
    const allTypes = new Set()
    let maxSev = 'MODERATE'
    for (const c of centers) {
      for (const d of (c.domains || [])) allDomains.add(d)
      for (const t of (c.contributing_condition_types || [])) allTypes.add(t)
      if (SEVERITY_RANK[c.severity] > SEVERITY_RANK[maxSev]) maxSev = c.severity
    }

    const constraintSummary = Object.entries(constraintTypes)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => v + ' ' + (CONSTRAINT_LABEL[k] || k.toLowerCase()))
      .join(', ')

    findings.push({
      finding_id: 'synthesis_convergence_pattern',
      observed: centers.length + ' structural convergence center' + (centers.length !== 1 ? 's' : '') +
        ' at up to ' + maxSev + ' severity, spanning ' + allDomains.size +
        ' domain' + (allDomains.size !== 1 ? 's' : '') + '. ' +
        allTypes.size + ' distinct condition types contribute, activating ' +
        dominant.class_count + ' behavioral classes' +
        (dominant.risk_label ? ' — composite: ' + dominant.risk_label : '') + '.',
      matters: 'Convergence means these conditions reinforce each other — intervention in one dimension encounters resistance from the others. The structural tension is self-reinforcing.',
      operational_implication: totalConstraints > 0
        ? totalConstraints + ' structural constraints compound these tensions (' + constraintSummary + ').'
        : null,
    })
  }

  if (classActivation.length > 0) {
    const top = classActivation[0]
    findings.push({
      finding_id: 'synthesis_behavioral_dominance',
      observed: classActivation.length + ' behavioral classes active: ' +
        classActivation.map(a =>
          a.class_name + ' (' + a.class_id + ', ' + a.condition_count + ' conditions, peak ' + a.max_severity + ')'
        ).join('; ') + '.',
      matters: 'Dominant class: ' + top.class_name + '. ' + (CLASS_QUESTION[top.class_id] || ''),
      operational_implication: classActivation.length >= 4
        ? 'With ' + classActivation.length + ' of 5 classes active, structural stress spans nearly all measurable dimensions.'
        : null,
    })
  }

  if (centers.length === 0 && classActivation.length === 0) {
    findings.push({
      finding_id: 'synthesis_tension_absent',
      observed: 'No convergence centers or behavioral class activation detected.',
      matters: 'Absence of convergence is positive structural evidence.',
      operational_implication: null,
    })
  }

  return { findings, evidence_objects: ['tension_map', 'constraint_inventory'] }
}

function synthesizeExposure(exposure, detection) {
  const consequences = exposure.consequence_exposure || []
  const frontier = detection.measurement_frontier || []
  const novelty = detection.detection_novelty || {}
  const findings = []

  if (consequences.length > 0) {
    const byScope = {}
    for (const c of consequences) {
      const scope = c.scope || 'LOCAL'
      if (!byScope[scope]) byScope[scope] = []
      byScope[scope].push(c)
    }

    const scopeParts = []
    if (byScope.SYSTEMIC) scopeParts.push(byScope.SYSTEMIC.length + ' systemic (' + byScope.SYSTEMIC.map(c => labelConsequence(c.consequence_type)).join(', ') + ')')
    if (byScope.REGIONAL) scopeParts.push(byScope.REGIONAL.length + ' regional')
    if (byScope.LOCAL) scopeParts.push(byScope.LOCAL.length + ' localized')

    const maxSev = consequences.reduce((max, c) =>
      SEVERITY_RANK[c.severity] > SEVERITY_RANK[max] ? c.severity : max, 'MODERATE')

    findings.push({
      finding_id: 'synthesis_exposure_profile',
      observed: consequences.length + ' structural exposure consequences at up to ' + maxSev +
        ' severity: ' + scopeParts.join(', ') + '.',
      matters: exposure.has_systemic_exposure
        ? 'Systemic exposure means structural vulnerabilities affect the entire system — remediation requires architectural intervention, not localized fixes.'
        : 'Exposure is contained to specific regions — targeted intervention is feasible.',
      operational_implication: frontier.length > 0
        ? frontier.length + ' of these exposures were detected through structural analysis that traditional tools cannot perform.'
        : null,
    })
  } else {
    findings.push({
      finding_id: 'synthesis_exposure_absent',
      observed: 'No structural exposure consequences detected.',
      matters: 'Absence of exposure is positive structural evidence.',
      operational_implication: null,
    })
  }

  if (frontier.length > 0) {
    const classes = {}
    for (const d of frontier) classes[d.measurement_class] = (classes[d.measurement_class] || 0) + 1

    findings.push({
      finding_id: 'synthesis_detection_novelty',
      observed: (novelty.active_count || 0) + ' of ' + (novelty.total_detection_types || 0) +
        ' detection capabilities triggered. Classes: ' +
        Object.entries(classes).map(([c, n]) => c.replace(/_/g, ' ').toLowerCase() + ' (' + n + ')').join(', ') + '.',
      matters: 'Each triggered detection reveals a structural condition invisible to traditional engineering tools.',
      operational_implication: (novelty.available_count || 0) > 0
        ? novelty.available_count + ' detection capabilities available but not triggered — structural health in those dimensions.'
        : null,
    })
  }

  return { findings, evidence_objects: ['exposure_assessment', 'detection_boundary'] }
}

function synthesizeTrajectory(trajectory) {
  const worsening = trajectory.worsening || []
  const summary = trajectory.summary || {}
  const unmeasured = trajectory.unmeasured || []
  const findings = []

  if (worsening.length > 0) {
    const combos = worsening.filter(w => w.source_type === 'combination')
    const conds = worsening.filter(w => w.source_type === 'condition')
    const maxSev = worsening.reduce((max, w) =>
      SEVERITY_RANK[w.severity] > SEVERITY_RANK[max] ? w.severity : max, 'MODERATE')
    const reasons = [...new Set(worsening.map(w => w.reason))]
    const comboLabels = [...new Set(combos.map(c => labelConsequence(c.pattern)))]

    findings.push({
      finding_id: 'synthesis_trajectory_pattern',
      observed: worsening.length + ' worsening vector' + (worsening.length !== 1 ? 's' : '') +
        ' at up to ' + maxSev + ' severity' +
        (combos.length > 0
          ? ' — ' + combos.length + ' from combination patterns (' +
            comboLabels.join(', ') +
            '), ' + conds.length + ' from individual conditions'
          : '') + '.',
      matters: reasons[0] + (reasons.length > 1 ? ' Additionally: ' + reasons.slice(1).join('. ') : ''),
      operational_implication: 'Dominant trajectory: ' + (summary.dominant_trajectory || 'INSUFFICIENT_DATA') +
        '. Without intervention, these vectors compound over successive operational cycles.' +
        (unmeasured.length > 0
          ? ' ' + unmeasured.length + ' dimensions not yet measurable (require temporal evidence).'
          : ''),
    })
  } else {
    findings.push({
      finding_id: 'synthesis_trajectory_stable',
      observed: 'No worsening trajectories. ' + (summary.stable_count || 0) + ' stable, ' +
        (summary.unmeasured_count || 0) + ' unmeasured dimensions.',
      matters: summary.dominant_trajectory === 'INSUFFICIENT_DATA'
        ? 'Trajectory projection requires run-over-run evidence not yet available for this specimen.'
        : 'Stable trajectory — current structural conditions are not self-reinforcing.',
      operational_implication: unmeasured.length > 0
        ? 'Unmeasured: ' + unmeasured.map(u => u.dimension.replace(/_/g, ' ').toLowerCase()).join(', ') + '.'
        : null,
    })
  }

  return { findings, evidence_objects: ['trajectory_assessment', 'structural_posture'] }
}

function synthesizeConstraints(constraints, ceiling) {
  const totalCount = constraints.total_count || 0
  const byType = constraints.by_type || {}
  const cp = ceiling.ceiling_properties || {}
  const cs = ceiling.posture_statement || {}
  const findings = []

  if (totalCount > 0) {
    const activeTypes = Object.entries(byType).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
    const all = [
      ...(constraints.structural_constraints || []),
      ...(constraints.binding_constraints || []),
      ...(constraints.governance_constraints || []),
      ...(constraints.coupling_constraints || []),
      ...(constraints.blast_radius_constraints || []),
    ]
    const maxSev = all.reduce((max, c) =>
      SEVERITY_RANK[c.severity] > SEVERITY_RANK[max] ? c.severity : max, 'MODERATE')

    findings.push({
      finding_id: 'synthesis_constraint_profile',
      observed: totalCount + ' operational constraints across ' + activeTypes.length +
        (activeTypes.length === 1 ? ' category' : ' categories') + ' at up to ' + maxSev + ' severity. ' +
        activeTypes.map(([k, v]) => (CONSTRAINT_LABEL[k] || k.toLowerCase()) + ': ' + v).join(', ') + '.',
      matters: cs.ceiling_exists
        ? 'These constraints enforce the operational ceiling — the structural mechanisms limiting what can be achieved without architectural intervention.'
        : 'Constraints present but insufficient to produce a formal operational ceiling.',
      operational_implication: [
        cp.architecture_sensitive ? 'Architecture-sensitive: remediation requires architectural change, not process optimization.' : null,
        cp.staffing_sensitive ? 'Staffing-sensitive: delivery patterns contribute to constraint severity.' : null,
      ].filter(Boolean).join(' ') || null,
    })
  } else {
    findings.push({
      finding_id: 'synthesis_constraint_absent',
      observed: 'No structural constraints detected.',
      matters: 'Positive structural evidence — no throughput ceilings, fragility hotspots, or coupling rigidity.',
      operational_implication: constraints.enrichment_available === false
        ? 'Structural enrichment data not available — constraint detection requires code graph enrichment.'
        : null,
    })
  }

  return { findings, evidence_objects: ['constraint_inventory', 'operational_ceiling'] }
}

function synthesizeDecisions(decision, trajectory) {
  const leverage = decision.leverage_points || []
  const drivers = decision.decision_drivers || []
  const urgency = decision.decision_urgency || {}
  const worsening = trajectory.worsening || []
  const findings = []

  if (leverage.length > 0) {
    const worseningTypes = new Set(worsening.map(w => w.condition_type || w.pattern))
    const aligned = leverage.filter(l => worseningTypes.has(l.condition_type))
    const totalInt = leverage.reduce((sum, l) => sum + (l.intervention_count || 0), 0)
    const maxSev = leverage.reduce((max, l) =>
      SEVERITY_RANK[l.severity] > SEVERITY_RANK[max] ? l.severity : max, 'MODERATE')

    findings.push({
      finding_id: 'synthesis_decision_landscape',
      observed: leverage.length + ' structural leverage point' + (leverage.length !== 1 ? 's' : '') +
        ' with ' + totalInt + ' guided interventions at up to ' + maxSev + ' severity.' +
        (aligned.length > 0
          ? ' ' + aligned.length + ' align with worsening trajectories — intervention addresses both current severity and trajectory.'
          : ''),
      matters: urgency.has_critical || urgency.has_systemic
        ? 'Decision urgency elevated: ' +
          [urgency.has_critical ? 'critical conditions present' : null,
           urgency.has_systemic ? 'systemic consequences active' : null,
           urgency.convergence_count > 0 ? urgency.convergence_count + ' convergence zone(s)' : null]
            .filter(Boolean).join(', ') + '.'
        : 'Leverage points represent locations where intervention produces maximum structural impact.',
      operational_implication: drivers.length > 0
        ? drivers.length + ' decision drivers at ' +
          [...new Set(drivers.map(d => d.scope))].join('/') + ' scope.'
        : null,
    })
  } else {
    findings.push({
      finding_id: 'synthesis_decision_absent',
      observed: 'No structural leverage points with guided interventions identified.',
      matters: 'Guided interventions require conditions with defined intervention protocols.',
      operational_implication: null,
    })
  }

  return { findings, evidence_objects: ['decision_surface', 'trajectory_assessment'] }
}

function synthesizeAbsence(absence, detection) {
  const summary = absence.coverage_summary || {}
  const unmeasured = absence.unmeasured_capabilities || []
  const untriggered = detection.available_not_triggered || []
  const novelty = detection.detection_novelty || {}
  const findings = []

  const active = summary.active_count || 0
  const total = summary.total_condition_types || 1
  const ratio = Math.round((active / total) * 100)

  findings.push({
    finding_id: 'synthesis_absence_intelligence',
    observed: active + ' of ' + (summary.total_condition_types || 0) +
      ' condition types activated (' + ratio + '% detection rate). ' +
      (summary.suppressed_count || 0) + ' suppressed, ' +
      (summary.not_activated_count || 0) + ' evaluated but not triggered, ' +
      (summary.unmeasured_count || 0) + ' not yet measurable.',
    matters: 'Absence analysis is structural intelligence — what the system can detect but did not find is positive evidence.' +
      (untriggered.length > 0
        ? ' ' + untriggered.length + ' detection capabilities available but not triggered — healthy structural dimensions.'
        : ''),
    operational_implication: unmeasured.length > 0
      ? 'Detection gaps: ' + unmeasured.map(u => u.capability.replace(/_/g, ' ').toLowerCase()).join(', ') + '.'
      : null,
  })

  return { findings, evidence_objects: ['absence_profile', 'detection_boundary'] }
}

function synthesizeCeiling(ceiling, constraints) {
  const ps = ceiling.posture_statement || {}
  const cf = ceiling.ceiling_factors || {}
  const drivers = ceiling.ceiling_drivers || []
  const blockers = ceiling.advancement_blockers || []
  const findings = []

  findings.push({
    finding_id: 'synthesis_ceiling_assessment',
    observed: 'Operational ceiling: ' + (ps.ceiling_exists ? 'PRESENT' : 'ABSENT') +
      '. Qualification: ' + (ps.qualification_class || 'undetermined') +
      '. ' + (cf.consequence_count || 0) + ' consequences (' + (cf.systemic_count || 0) + ' systemic' +
      (cf.combination_patterns > 0 ? ', ' + cf.combination_patterns + ' combination patterns' : '') + ').' +
      (cf.critical_convergence ? ' Critical convergence detected.' : ''),
    matters: ps.ceiling_exists
      ? (cf.critical_convergence
        ? 'Structurally reinforced ceiling — multiple consequence types converge at critical severity. Cannot be resolved through isolated intervention; requires coordinated structural remediation.'
        : 'Addressable ceiling — no critical convergence. Targeted intervention at dominant drivers can lift the ceiling incrementally.')
      : 'No formal operational ceiling — structural conditions do not currently constrain operational capacity.',
    operational_implication: drivers.length > 0
      ? 'Ceiling drivers: ' + deduplicateDriverLabels(drivers.slice(0, 5)) + '.' +
        (blockers.length > 0 ? ' ' + blockers.length + ' advancement blocker(s) require resolution.' : '')
      : null,
  })

  return { findings, evidence_objects: ['operational_ceiling', 'constraint_inventory'] }
}


// --- Helpers ---

function labelConsequence(type) {
  return CONSEQUENCE_LABEL[type] ||
    (type || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function deduplicateDriverLabels(drivers) {
  const seen = new Set()
  const parts = []
  for (const d of drivers) {
    const key = d.consequence_type + ':' + d.severity + ':' + d.scope
    if (seen.has(key)) continue
    seen.add(key)
    parts.push(labelConsequence(d.consequence_type) + ' (' + d.severity + ', ' + d.scope + ')')
  }
  return parts.join('; ')
}

module.exports = { synthesize }

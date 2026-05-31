// EIR Adapter — transforms PRE projection into EIR chapter structure.
// Deterministic: same PRE output → same chapter assembly.
// This is Reference Consumer #1 — first proof of the consumer-generic architecture.

const PRECore = require('../../projection/PRECore')
const eirConfig = require('../../projection/configs/eir')

function adapt(picp) {
  const projection = PRECore.project(picp, eirConfig)
  if (!projection.ok) {
    return { ok: false, error: projection.error, validation_errors: projection.validation_errors }
  }

  const chapters = projection.projection.sections.map(section => {
    const findings = extractFindings(section)
    return {
      chapter_id: section.section_id,
      chapter_label: section.section_label,
      sequence: section.sequence,
      findings,
      evidence_sources: section.evidence_sources,
      narrative: resolveNarrative(section, projection.projection.qualified_narratives),
      finding_count: findings.length,
    }
  })

  const metadata = buildReportMetadata(picp, projection)

  return {
    ok: true,
    report: {
      title: 'Executive Intelligence Report',
      subtitle: metadata.client_id + ' — ' + metadata.specimen_id,
      metadata,
      chapters,
      appendix: buildAppendix(picp, projection),
      governance: projection.governance,
      disclosures: projection.disclosures,
    },
  }
}

function extractFindings(section) {
  const primary = section.primary_data
  if (!primary) return []

  const findings = []
  const objectId = section.primary_object_id

  if (objectId === 'structural_posture') {
    findings.push(...extractPostureFindings(primary))
  } else if (objectId === 'tension_map') {
    findings.push(...extractTensionFindings(primary))
  } else if (objectId === 'constraint_inventory') {
    findings.push(...extractConstraintFindings(primary))
  } else if (objectId === 'exposure_assessment') {
    findings.push(...extractExposureFindings(primary))
  } else if (objectId === 'trajectory_assessment') {
    findings.push(...extractTrajectoryFindings(primary))
  } else if (objectId === 'decision_surface') {
    findings.push(...extractDecisionFindings(primary))
  } else if (objectId === 'absence_profile') {
    findings.push(...extractAbsenceFindings(primary))
  } else if (objectId === 'operational_ceiling') {
    findings.push(...extractCeilingFindings(primary))
  }

  return findings
}

function extractPostureFindings(obj) {
  const findings = []
  const q = obj.qualification || {}
  const s = obj.scale || {}
  findings.push({
    finding_id: 'posture_qualification',
    observed: 'Qualification state: ' + (q.q_class || 'undetermined') + '. ' +
      (s.total_nodes || 0) + ' structural nodes across ' + (s.cluster_count || 0) + ' clusters.',
    matters: 'Structural qualification determines the authority ceiling for all projections.',
    operational_implication: q.q_class ? 'Q-class ' + q.q_class + ' indicates ' + classifyQClass(q.q_class) + '.' : 'No Q-class derived.',
    leadership_implication: null,
  })

  const drivers = obj.posture_drivers || {}
  if (drivers.render_state) {
    findings.push({
      finding_id: 'posture_render_state',
      observed: 'Render state: ' + drivers.render_state + '.',
      matters: 'Render state indicates the operational readiness posture for projection.',
      operational_implication: drivers.readiness_band ? 'Readiness band: ' + drivers.readiness_band + '.' : null,
      leadership_implication: null,
    })
  }

  const envelope = obj.confidence_envelope || {}
  if (envelope.semantic_continuity || envelope.evidence_availability) {
    findings.push({
      finding_id: 'posture_confidence',
      observed: 'Semantic continuity: ' + (envelope.semantic_continuity || 'unknown') + '. Evidence availability: ' + (envelope.evidence_availability || 'unknown') + '.',
      matters: 'Confidence envelope bounds the reliability of all downstream projections.',
      operational_implication: envelope.governance_verdict ? 'Governance verdict: ' + envelope.governance_verdict + '.' : null,
      leadership_implication: null,
    })
  }

  return findings
}

function extractTensionFindings(obj) {
  const centers = obj.convergence_centers || []
  return centers.map(c => ({
    finding_id: 'tension_' + (c.convergence_id || c.condition_type),
    observed: (c.condition_type || 'CONVERGENCE') + ' — ' + (c.component_count || 0) + ' components at ' + (c.severity || 'unknown') + ' severity.',
    matters: 'Convergence center indicates multiple structural conditions reinforcing each other.',
    operational_implication: c.convergence_pattern ? 'Pattern: ' + c.convergence_pattern + '.' : null,
    leadership_implication: null,
  }))
}

function extractConstraintFindings(obj) {
  const all = [
    ...(obj.structural_constraints || []),
    ...(obj.binding_constraints || []),
    ...(obj.governance_constraints || []),
    ...(obj.coupling_constraints || []),
  ]
  return all.slice(0, 5).map(c => ({
    finding_id: 'constraint_' + (c.constraint_id || c.entity || 'unknown'),
    observed: (c.constraint_type || c.type || 'Structural constraint') + ': ' + (c.entity || c.file || 'unknown entity') + '.',
    matters: c.role || c.structural_role || 'Constrains operational throughput.',
    operational_implication: c.metric_value ? 'Metric: ' + c.metric_value + '.' : null,
    leadership_implication: null,
  }))
}

function extractExposureFindings(obj) {
  const consequences = obj.consequence_exposure || []
  return consequences.slice(0, 5).map(c => ({
    finding_id: 'exposure_' + c.consequence_type,
    observed: c.consequence_type + ' at ' + c.severity + ' severity. Scope: ' + (c.scope || 'unknown') + '.',
    matters: 'Exposure consequence indicating structural vulnerability surface.',
    operational_implication: c.locus ? 'Primary locus: ' + c.locus + '.' : null,
    leadership_implication: null,
  }))
}

function extractTrajectoryFindings(obj) {
  const worsening = obj.worsening || []
  return worsening.map(w => ({
    finding_id: 'trajectory_' + (w.source_id || w.condition_type || 'unknown'),
    observed: (w.condition_type || w.combination_pattern || 'Condition') + ' on ' + (w.trajectory || 'WORSENING') + ' trajectory.',
    matters: 'Without structural intervention, this condition is projected to intensify.',
    operational_implication: w.trajectory_driver ? 'Driver: ' + w.trajectory_driver + '.' : null,
    leadership_implication: null,
  }))
}

function extractDecisionFindings(obj) {
  const leverage = obj.leverage_points || []
  return leverage.slice(0, 5).map(l => ({
    finding_id: 'decision_' + (l.condition_type || 'unknown'),
    observed: (l.condition_type || 'Condition') + ' at ' + (l.severity || 'unknown') + ' — ' + (l.intervention_count || 0) + ' guided interventions available.',
    matters: 'Structural leverage point where guided intervention has highest structural impact.',
    operational_implication: l.action_types ? 'Action types: ' + l.action_types.join(', ') + '.' : null,
    leadership_implication: null,
  }))
}

function extractAbsenceFindings(obj) {
  const summary = obj.coverage_summary || {}
  const findings = []
  findings.push({
    finding_id: 'absence_coverage',
    observed: summary.active_count + ' condition types active, ' + summary.not_activated_count + ' not activated, ' + summary.unmeasured_count + ' unmeasured.',
    matters: 'Absence analysis reveals what the system CAN detect but did NOT find — positive structural evidence.',
    operational_implication: 'Coverage: ' + summary.active_count + '/' + summary.total_condition_types + ' condition types activated.',
    leadership_implication: null,
  })
  return findings
}

function extractCeilingFindings(obj) {
  const posture = obj.posture_statement || {}
  const factors = obj.ceiling_factors || {}
  const findings = []
  findings.push({
    finding_id: 'ceiling_posture',
    observed: 'Ceiling exists: ' + (posture.ceiling_exists ? 'YES' : 'NO') + '. ' +
      factors.consequence_count + ' consequences, ' + factors.systemic_count + ' systemic.',
    matters: 'Operational ceiling constrains what the organization can achieve without structural intervention.',
    operational_implication: factors.critical_convergence ? 'Critical convergence detected — ceiling is hard.' : 'No critical convergence — ceiling is soft.',
    leadership_implication: null,
  })
  return findings
}

function classifyQClass(qClass) {
  const labels = {
    'Q-01': 'full structural backing',
    'Q-02': 'partial structural backing with semantic continuity',
    'Q-03': 'semantic continuity only — structural backing absent',
    'Q-04': 'insufficient evidence for qualification',
  }
  return labels[qClass] || 'unknown qualification class'
}

function resolveNarrative(section, qualifiedNarratives) {
  const match = (qualifiedNarratives || []).find(n => n.section_id === section.section_id)
  if (!match) return { status: 'NO_NARRATIVE', slot: null }
  return {
    status: match.narrative_slot ? match.narrative_slot.status : 'RESOLVED',
    slot: match.narrative_slot || null,
    disclosure: match.disclosure || null,
    debt_disclosure: match.debt_disclosure || null,
  }
}

function buildReportMetadata(picp, projection) {
  const meta = picp.metadata || {}
  return {
    schema_version: meta.schema_version,
    pipeline_run_id: meta.pipeline_run_id,
    client_id: meta.client_id,
    specimen_id: meta.specimen_id,
    generated_at: new Date().toISOString(),
    s_level: projection.projection_summary.s_level,
    q_class: projection.projection_summary.q_class,
    chapter_count: projection.projection.sections.length,
    narrative_mode: projection.projection_summary.narrative_mode,
  }
}

function buildAppendix(picp, projection) {
  const objects = picp.cognition_objects || {}
  return {
    object_inventory: Object.keys(objects).map(id => ({
      object_id: id,
      field_count: Object.keys(objects[id] || {}).filter(k => k !== 'object_id').length,
    })),
    projection_summary: projection.projection_summary,
    governance: projection.governance,
  }
}

module.exports = { adapt }

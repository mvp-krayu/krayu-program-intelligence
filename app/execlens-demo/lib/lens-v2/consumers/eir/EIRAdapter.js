// EIR Adapter — assembles EIR chapter structure from PRE projection and executive synthesis.
// Deterministic: same PICP → same report structure.
// Reference Consumer #1 — first proof of consumer-generic architecture.

const PRECore = require('../../projection/PRECore')
const eirConfig = require('../../projection/configs/eir')
const { synthesize } = require('./ExecutiveIntelligenceSynthesis')

const OBJECT_TO_THEME = {
  structural_posture: 'posture',
  tension_map: 'tension',
  exposure_assessment: 'exposure',
  trajectory_assessment: 'trajectory',
  constraint_inventory: 'constraints',
  decision_surface: 'decisions',
  absence_profile: 'absence',
  operational_ceiling: 'ceiling',
}

function adapt(picp) {
  const projection = PRECore.project(picp, eirConfig)
  if (!projection.ok) {
    return { ok: false, error: projection.error, validation_errors: projection.validation_errors }
  }

  const synthesis = synthesize(picp)
  if (!synthesis.ok) {
    return { ok: false, error: 'Executive intelligence synthesis failed' }
  }

  const chapters = projection.projection.sections.map(section => {
    const theme = OBJECT_TO_THEME[section.primary_object_id]
    const block = (theme && synthesis.chapters[theme]) || { findings: [] }
    return {
      chapter_id: section.section_id,
      chapter_label: section.section_label,
      sequence: section.sequence,
      findings: block.findings,
      evidence_sources: section.evidence_sources,
      narrative: resolveNarrative(section, projection.projection.qualified_narratives),
      finding_count: block.findings.length,
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
    narrative_status: 'ZONE_B_AWAITING_PROVIDER',
  }
}

function buildAppendix(picp, projection) {
  const objects = picp.cognition_objects || {}
  const objectInventory = Object.keys(objects).map(id => {
    const obj = objects[id] || {}
    const arrays = Object.entries(obj).filter(([, v]) => Array.isArray(v))
    const populatedArrays = arrays.filter(([, v]) => v.length > 0)
    return {
      object_id: id,
      field_count: Object.keys(obj).filter(k => k !== 'object_id').length,
      populated_arrays: populatedArrays.length,
      total_arrays: arrays.length,
    }
  })

  return {
    object_inventory: objectInventory,
    projection_summary: projection.projection_summary,
    governance: projection.governance,
  }
}

module.exports = { adapt }

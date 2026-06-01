// EIR Adapter — assembles EIR report from synthesis narrative chapters + PRE governance.
// Deterministic: same PICP + same context → same report structure.
// Reference Consumer #1 — first proof of consumer-generic architecture.
// Synthesis provides narrative arc. PRE provides governance/qualification validation.

const PRECore = require('../../projection/PRECore')
const eirConfig = require('../../projection/configs/eir')
const { synthesize } = require('./ExecutiveIntelligenceSynthesis')

function adapt(picp, context) {
  const projection = PRECore.project(picp, eirConfig)
  if (!projection.ok) {
    return { ok: false, error: projection.error, validation_errors: projection.validation_errors }
  }

  const synthesis = synthesize(picp, context || {})
  if (!synthesis.ok) {
    return { ok: false, error: 'Executive intelligence synthesis failed' }
  }

  const chapters = synthesis.chapters.map(ch => ({
    chapter_id: ch.chapter_id,
    chapter_label: ch.chapter_label,
    sequence: ch.sequence,
    findings: ch.findings,
    evidence_sources: (ch.evidence_objects || []).map(id => ({ object_id: id, role: 'primary' })),
    narrative: { status: 'ZONE_B_AWAITING_PROVIDER' },
    finding_count: ch.findings.length,
  }))

  const metadata = buildReportMetadata(picp, projection)

  return {
    ok: true,
    report: {
      title: 'Executive Intelligence Report',
      subtitle: metadata.client_id + ' — ' + metadata.specimen_id,
      metadata,
      chapters,
      appendix: buildAppendix(picp, projection, chapters),
      governance: projection.governance,
      disclosures: projection.disclosures,
    },
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
    chapter_count: 9,
    narrative_mode: projection.projection_summary.narrative_mode,
    narrative_status: 'ZONE_B_AWAITING_PROVIDER',
  }
}

function buildAppendix(picp, projection, chapters) {
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

  const ps = Object.assign({}, projection.projection_summary, {
    section_count: (chapters || []).length,
  })

  return {
    object_inventory: objectInventory,
    projection_summary: ps,
    governance: projection.governance,
  }
}

module.exports = { adapt }

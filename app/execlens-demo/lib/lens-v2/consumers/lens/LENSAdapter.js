// LENS Adapter — Reference Consumer #2 (5 persona projections).
// Proves consumer-genericity: PICP → PRE → LENS through the same
// three-zone architecture that serves the EIR.
// Deterministic: same PICP + same persona config → same projection.
// Does NOT replace existing proto-PRE functions (forBoardroom, etc.) —
// proves the same data path works through PRE, enabling future re-routing.

const PRECore = require('../../projection/PRECore')
const boardroomConfig = require('../../projection/configs/boardroom')
const balancedConfig = require('../../projection/configs/balanced')
const denseConfig = require('../../projection/configs/dense')
const operatorConfig = require('../../projection/configs/operator')
const investigationConfig = require('../../projection/configs/investigation')

const PERSONA_CONFIGS = {
  BOARDROOM: boardroomConfig,
  BALANCED: balancedConfig,
  DENSE: denseConfig,
  OPERATOR: operatorConfig,
  INVESTIGATION: investigationConfig,
}

function adaptPersona(picp, persona) {
  const config = PERSONA_CONFIGS[persona]
  if (!config) {
    return { ok: false, error: 'Unknown persona: ' + persona }
  }

  const projection = PRECore.project(picp, config)
  if (!projection.ok) {
    return { ok: false, error: projection.error, validation_errors: projection.validation_errors }
  }

  return {
    ok: true,
    persona,
    consumer_id: projection.consumer_id,
    consumer_label: projection.consumer_label,
    sections: buildPersonaSections(projection, config),
    governance: projection.governance,
    disclosures: projection.disclosures,
    projection_summary: projection.projection_summary,
    metadata: projection.metadata,
  }
}

function adaptAll(picp) {
  const results = {}
  for (const persona of Object.keys(PERSONA_CONFIGS)) {
    results[persona] = adaptPersona(picp, persona)
  }
  return results
}

function buildPersonaSections(projection, config) {
  return projection.projection.sections.map(section => {
    const primary = section.primary_data || {}
    const secondaries = (section.secondary_data || []).reduce((acc, s) => {
      acc[s.object_id] = s.data
      return acc
    }, {})

    return {
      section_id: section.section_id,
      section_label: section.section_label,
      sequence: section.sequence,
      primary_object_id: section.primary_object_id,
      primary_data: primary,
      secondary_data: secondaries,
      evidence_sources: section.evidence_sources,
      format_hints: config.format_hints || {},
    }
  })
}

module.exports = { adaptPersona, adaptAll, PERSONA_CONFIGS }

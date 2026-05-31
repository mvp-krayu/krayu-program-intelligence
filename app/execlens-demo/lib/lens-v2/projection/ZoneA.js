// Zone A — Deterministic Projection
// ZERO AI. Pure rendering rules.
// Transforms PICP cognition objects into consumer-ready structures
// based on ProjectionConfig section_mapping.
// Same PICP + same ProjectionConfig → same Zone A output.

function project(picp, config) {
  const objects = picp.cognition_objects || {}
  const sections = []

  for (const mapping of config.section_mapping) {
    const primaryObject = objects[mapping.primary_object] || null
    const secondaryObjects = (mapping.secondary_objects || [])
      .map(id => ({ object_id: id, data: objects[id] || null }))
      .filter(s => s.data !== null)

    const section = {
      section_id: mapping.section_id,
      section_label: mapping.section_label,
      sequence: mapping.sequence,
      primary_object_id: mapping.primary_object,
      primary_data: primaryObject,
      secondary_data: secondaryObjects,
      evidence_sources: extractEvidenceSources(primaryObject, secondaryObjects),
      inclusion: primaryObject ? 'INCLUDED' : 'EXCLUDED_NO_DATA',
    }

    sections.push(section)
  }

  const includedSections = sections.filter(s => s.inclusion === 'INCLUDED')
  const excludedSections = sections.filter(s => s.inclusion !== 'INCLUDED')

  return {
    consumer_id: config.consumer_id,
    sections: includedSections.sort((a, b) => a.sequence - b.sequence),
    excluded_sections: excludedSections,
    projection_summary: {
      total_sections: sections.length,
      included_count: includedSections.length,
      excluded_count: excludedSections.length,
      objects_consumed: [...new Set(includedSections.map(s => s.primary_object_id))],
    },
  }
}

function extractEvidenceSources(primaryObject, secondaryObjects) {
  const sources = []
  if (primaryObject && primaryObject.object_id) {
    sources.push({ object_id: primaryObject.object_id, role: 'PRIMARY' })
  }
  for (const sec of secondaryObjects) {
    sources.push({ object_id: sec.object_id, role: 'SECONDARY' })
  }
  return sources
}

module.exports = { project }

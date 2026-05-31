// ProjectionConfig — consumer-specific data declaration.
// Declares WHAT a consumer needs from PICP. Not HOW it renders.
// Adding a consumer = adding a config. Zero PRE core changes.

function validate(config) {
  const errors = []
  if (!config) return { valid: false, errors: ['config is null'] }
  if (!config.consumer_id) errors.push('consumer_id required')
  if (!config.consumer_label) errors.push('consumer_label required')
  if (!config.audience_model) errors.push('audience_model required')
  if (!config.object_selection || !Array.isArray(config.object_selection)) {
    errors.push('object_selection must be an array of cognition object IDs')
  }
  if (!config.section_mapping || !Array.isArray(config.section_mapping)) {
    errors.push('section_mapping must be an array of section definitions')
  }
  if (!config.narrative_mode) errors.push('narrative_mode required')
  return { valid: errors.length === 0, errors }
}

function resolveConfig(config) {
  const validation = validate(config)
  if (!validation.valid) {
    return { ok: false, errors: validation.errors }
  }
  return {
    ok: true,
    config: {
      consumer_id: config.consumer_id,
      consumer_label: config.consumer_label,
      audience_model: config.audience_model,
      object_selection: config.object_selection,
      section_mapping: config.section_mapping,
      narrative_mode: config.narrative_mode,
      narrative_register: config.narrative_register || 'structural',
      disclosure_level: config.disclosure_level || 'STANDARD',
      format_hints: config.format_hints || {},
    },
  }
}

module.exports = { validate, resolveConfig }

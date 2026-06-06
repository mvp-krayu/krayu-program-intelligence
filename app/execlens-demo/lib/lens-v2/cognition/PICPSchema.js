// PICP — Program Intelligence Cognition Package
// L4 output container: 9 cognition objects + metadata envelope.
// Portable, versioned, deterministic. NOT the architecture — the artifact.

const SCHEMA_VERSION = '1.0.0'

const REQUIRED_OBJECT_IDS = [
  'structural_posture',
  'tension_map',
  'constraint_inventory',
  'exposure_assessment',
  'trajectory_assessment',
  'decision_surface',
  'absence_profile',
  'detection_boundary',
  'operational_ceiling',
]

function validate(picp) {
  const errors = []

  if (!picp) {
    return { valid: false, errors: ['PICP is null or undefined'] }
  }

  if (!picp.metadata) {
    errors.push('metadata is missing')
  } else {
    if (!picp.metadata.schema_version) errors.push('metadata.schema_version is missing')
    if (!picp.metadata.pipeline_run_id) errors.push('metadata.pipeline_run_id is missing')
    if (!picp.metadata.client_id) errors.push('metadata.client_id is missing')
    if (!picp.metadata.timestamp) errors.push('metadata.timestamp is missing')
  }

  if (!picp.cognition_objects) {
    errors.push('cognition_objects is missing')
  } else {
    for (const id of REQUIRED_OBJECT_IDS) {
      if (!picp.cognition_objects[id]) {
        errors.push('cognition_objects.' + id + ' is missing')
      } else if (picp.cognition_objects[id].error) {
        errors.push('cognition_objects.' + id + ' has materialization error: ' + picp.cognition_objects[id].error)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

module.exports = { SCHEMA_VERSION, REQUIRED_OBJECT_IDS, validate }

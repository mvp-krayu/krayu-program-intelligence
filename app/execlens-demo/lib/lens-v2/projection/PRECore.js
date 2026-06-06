// PRE — Projection Rendering Engine
// L5 consumer-generic projection orchestrator.
// Zone A (deterministic) → Zone B (governed narrative) → Zone C (qualification gate).
// Consumer-INDEPENDENT core. Consumer-specific via ProjectionConfig only.

const { resolveConfig } = require('./ProjectionConfig')
const ZoneA = require('./ZoneA')
const ZoneB = require('./ZoneB')
const ZoneC = require('./ZoneC')

function project(picp, projectionConfig) {
  const resolved = resolveConfig(projectionConfig)
  if (!resolved.ok) {
    return {
      ok: false,
      error: 'Invalid ProjectionConfig',
      validation_errors: resolved.errors,
    }
  }

  const config = resolved.config

  if (!picp || !picp.cognition_objects) {
    return {
      ok: false,
      error: 'No PICP provided or cognition_objects missing',
    }
  }

  const qualificationState = (picp.metadata && picp.metadata.qualification_state) || {}

  const zoneAResult = ZoneA.project(picp, config)
  const zoneBResult = ZoneB.narrate(zoneAResult, config)
  const zoneCResult = ZoneC.qualify(zoneBResult, qualificationState)

  return {
    ok: true,
    consumer_id: config.consumer_id,
    consumer_label: config.consumer_label,
    projection: {
      sections: zoneAResult.sections,
      excluded_sections: zoneAResult.excluded_sections,
      qualified_narratives: zoneCResult.qualified_narratives,
      suppressed_narratives: zoneCResult.suppressed_narratives,
    },
    governance: zoneCResult.governance,
    disclosures: zoneCResult.disclosures,
    projection_summary: {
      ...zoneAResult.projection_summary,
      narrative_mode: config.narrative_mode,
      narrative_register: config.narrative_register,
      s_level: qualificationState.s_level || null,
      q_class: qualificationState.q_class || null,
    },
    metadata: {
      picp_schema_version: picp.metadata && picp.metadata.schema_version,
      picp_run_id: picp.metadata && picp.metadata.pipeline_run_id,
      picp_client_id: picp.metadata && picp.metadata.client_id,
      projection_timestamp: new Date().toISOString(),
    },
  }
}

module.exports = { project }

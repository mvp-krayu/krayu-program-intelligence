// PICR — Program Intelligence Cognition Runtime
// L4 cognition formation: transforms CIP into 9 named cognition objects.
// All materializers are pure functions. Same CIP → same PICP. ZERO interpretive authority.

const structuralPosture = require('./materializers/structuralPosture')
const tensionMap = require('./materializers/tensionMap')
const constraintInventory = require('./materializers/constraintInventory')
const exposureAssessment = require('./materializers/exposureAssessment')
const trajectoryAssessment = require('./materializers/trajectoryAssessment')
const decisionSurface = require('./materializers/decisionSurface')
const absenceProfile = require('./materializers/absenceProfile')
const detectionBoundary = require('./materializers/detectionBoundary')
const operationalCeiling = require('./materializers/operationalCeiling')

// SW-Intel sub-object materializers
const swIntelStructuralFragility = require('./materializers/structuralFragility')
const swIntelBoundaryAlignment = require('./materializers/boundaryAlignment')
const swIntelStructuralCoupling = require('./materializers/structuralCoupling')
const swIntelDeliveryFragility = require('./materializers/deliveryFragility')
const swIntelCoordinationSaturation = require('./materializers/coordinationSaturation')
const swIntelIntegrationExposure = require('./materializers/integrationExposure')
const swIntelTopologyPosture = require('./materializers/topologyPosture')
const swIntelQualificationExposure = require('./materializers/qualificationExposure')
const swIntelPropagationRisk = require('./materializers/propagationRisk')
const swIntelReinforcementFlows = require('./materializers/reinforcementFlows')
const swIntelConvergencePatterns = require('./materializers/convergencePatterns')
const swIntelAbsence = require('./materializers/swIntelAbsence')

const MATERIALIZERS = [
  structuralPosture,
  tensionMap,
  constraintInventory,
  exposureAssessment,
  trajectoryAssessment,
  decisionSurface,
  absenceProfile,
  detectionBoundary,
  operationalCeiling,
]

const SW_INTEL_MATERIALIZERS = [
  // Tier 1 (structural enrichment surfaces)
  { materializer: swIntelStructuralFragility, parent: 'constraint_inventory' },
  { materializer: swIntelBoundaryAlignment, parent: 'structural_posture' },
  { materializer: swIntelStructuralCoupling, parent: 'constraint_inventory' },
  // Original 6 (signal + evidence surfaces)
  { materializer: swIntelDeliveryFragility, parent: 'tension_map' },
  { materializer: swIntelCoordinationSaturation, parent: 'constraint_inventory' },
  { materializer: swIntelIntegrationExposure, parent: 'exposure_assessment' },
  { materializer: swIntelTopologyPosture, parent: 'structural_posture' },
  { materializer: swIntelQualificationExposure, parent: 'operational_ceiling' },
  { materializer: swIntelPropagationRisk, parent: 'exposure_assessment' },
  // Tier 2 (cross-signal synthesis surfaces)
  { materializer: swIntelReinforcementFlows, parent: 'tension_map' },
  { materializer: swIntelConvergencePatterns, parent: 'tension_map' },
  { materializer: swIntelAbsence, parent: 'absence_profile' },
]

const SCHEMA_VERSION = '1.0.0'

function materialize(cip) {
  if (!cip || !cip.fullReport) {
    return {
      cognitionObjects: {},
      metadata: { schema_version: SCHEMA_VERSION, materialized: false, error: 'No CIP provided' },
    }
  }

  const cognitionObjects = {}
  const materializationLog = []

  for (const mat of MATERIALIZERS) {
    const start = Date.now()
    try {
      const result = mat.materialize(cip)
      cognitionObjects[mat.OBJECT_ID] = result
      materializationLog.push({
        object_id: mat.OBJECT_ID,
        status: 'MATERIALIZED',
        duration_ms: Date.now() - start,
      })
    } catch (err) {
      cognitionObjects[mat.OBJECT_ID] = { object_id: mat.OBJECT_ID, error: err.message }
      materializationLog.push({
        object_id: mat.OBJECT_ID,
        status: 'ERROR',
        error: err.message,
        duration_ms: Date.now() - start,
      })
    }
  }

  // SW-Intel sub-objects — materialized alongside parent cognition objects
  const swIntelSurfaces = {}
  for (const entry of SW_INTEL_MATERIALIZERS) {
    const start = Date.now()
    try {
      const result = entry.materializer.materialize(cip)
      if (result) {
        swIntelSurfaces[entry.materializer.OBJECT_ID] = result
        // Attach as sub-object to parent cognition object
        const parent = cognitionObjects[entry.parent]
        if (parent && !parent.error) {
          if (!parent.sw_intel_surfaces) parent.sw_intel_surfaces = {}
          parent.sw_intel_surfaces[entry.materializer.OBJECT_ID] = result
        }
      }
      materializationLog.push({
        object_id: entry.materializer.OBJECT_ID,
        type: 'SW_INTEL',
        parent: entry.parent,
        status: result ? 'MATERIALIZED' : 'NULL_RESULT',
        duration_ms: Date.now() - start,
      })
    } catch (err) {
      materializationLog.push({
        object_id: entry.materializer.OBJECT_ID,
        type: 'SW_INTEL',
        parent: entry.parent,
        status: 'ERROR',
        error: err.message,
        duration_ms: Date.now() - start,
      })
    }
  }

  return {
    cognitionObjects,
    swIntelSurfaces,
    metadata: {
      schema_version: SCHEMA_VERSION,
      materialized: true,
      object_count: Object.keys(cognitionObjects).length,
      sw_intel_surface_count: Object.keys(swIntelSurfaces).length,
      materialization_log: materializationLog,
      timestamp: new Date().toISOString(),
    },
  }
}

function assembleCIP(fullReport, synthesisResult, consequenceResult, cognitionOntology) {
  return {
    fullReport: fullReport || {},
    synthesisResult: synthesisResult || {},
    consequenceResult: consequenceResult || {},
    cognitionOntology: cognitionOntology || {},
  }
}

function getSwIntelSurface(picp, surfaceId) {
  if (!picp || !picp.swIntelSurfaces) return null
  return picp.swIntelSurfaces[surfaceId] || null
}

module.exports = { materialize, assembleCIP, getSwIntelSurface, SCHEMA_VERSION, MATERIALIZERS, SW_INTEL_MATERIALIZERS }

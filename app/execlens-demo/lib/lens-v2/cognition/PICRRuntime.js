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

  return {
    cognitionObjects,
    metadata: {
      schema_version: SCHEMA_VERSION,
      materialized: true,
      object_count: Object.keys(cognitionObjects).length,
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

module.exports = { materialize, assembleCIP, SCHEMA_VERSION, MATERIALIZERS }

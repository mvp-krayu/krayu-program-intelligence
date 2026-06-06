// PICP Producer — wraps PICR output in a portable cognition package.
// Deterministic: same inputs → same PICP (except timestamp).
// Reads SQO promotion_state and chronicle_certification from run directory.

const fs = require('fs')
const path = require('path')
const { SCHEMA_VERSION, validate } = require('./PICPSchema')
const { materialize: materializePICR, assembleCIP } = require('./PICRRuntime')

const CLIENTS_DIR = path.resolve(__dirname, '..', '..', '..', '..', '..', 'clients')

function loadSQOState(clientId, runId) {
  const sqoPath = path.join(CLIENTS_DIR, clientId, 'psee', 'runs', runId, 'sqo', 'promotion_state.json')
  try {
    return JSON.parse(fs.readFileSync(sqoPath, 'utf8'))
  } catch {
    return null
  }
}

function loadChronicleCertification(clientId, runId) {
  const certPath = path.join(CLIENTS_DIR, clientId, 'psee', 'runs', runId, 'chronicle', 'chronicle_certification.json')
  try {
    return JSON.parse(fs.readFileSync(certPath, 'utf8'))
  } catch {
    return null
  }
}

function buildQualificationState(sqo) {
  if (!sqo) {
    return { s_level: null, q_class: null, authority_ceiling: null, provenance: null }
  }
  return {
    s_level: sqo.s_level || sqo.current_state || null,
    q_class: null,
    authority_ceiling: sqo.authority_ceiling || null,
    provenance: sqo.qualification_provenance || null,
  }
}

function buildChronicleCertification(cert) {
  if (!cert) {
    return { status: 'UNCERTIFIED', check_count: 0, pass_count: 0 }
  }
  return {
    status: cert.certification_status || 'UNCERTIFIED',
    check_count: cert.total_checks || 0,
    pass_count: cert.passed || 0,
  }
}

function produce(fullReport, synthesisResult, consequenceResult, cognitionOntology, context) {
  const ctx = context || {}
  const clientId = ctx.clientId || fullReport.client || fullReport.client_name || 'unknown'
  const runId = ctx.runId || fullReport.run_id || 'unknown'

  const cip = assembleCIP(fullReport, synthesisResult, consequenceResult, cognitionOntology)
  const picrResult = materializePICR(cip)

  const sqo = ctx.sqoState || loadSQOState(clientId, runId)
  const cert = ctx.chronicleCertification || loadChronicleCertification(clientId, runId)

  const qualifierSummary = fullReport.qualifier_summary || {}

  const qualificationState = buildQualificationState(sqo)
  qualificationState.q_class = qualifierSummary.qualifier_class || qualificationState.q_class

  const picp = {
    metadata: {
      schema_version: SCHEMA_VERSION,
      pipeline_run_id: runId,
      client_id: clientId,
      specimen_id: ctx.specimenId || runId,
      timestamp: new Date().toISOString(),
      qualification_state: qualificationState,
      chronicle_certification: buildChronicleCertification(cert),
      materialization: picrResult.metadata,
    },
    cognition_objects: picrResult.cognitionObjects,
  }

  const validation = validate(picp)
  picp.metadata.validation = validation

  return picp
}

module.exports = { produce, loadSQOState, loadChronicleCertification }

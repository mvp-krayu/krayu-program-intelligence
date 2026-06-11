// SynthesisContext.js
// PiOS Core — Explicit context contract for all synthesis operations.
//
// No synthesizer infers from partial objects.
// No silent fallback. Missing context = explicit failure.

function buildSynthesisContext(crossDomainCognition, fullReport, projectionAuthority, anchor) {
  const cdc = crossDomainCognition || {}
  const fr = fullReport || {}
  const pa = projectionAuthority || {}
  const anc = anchor || {}

  const domConc = cdc.domain_concentration || []
  const themes = cdc.consequence_themes || []
  const narratives = cdc.domain_narratives || []
  const structCenter = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = cdc.execution_center || null
  const hasDivergence = execCenter && structCenter && execCenter.toLowerCase() !== structCenter.toLowerCase()

  const sigs = fr.signal_interpretations || []
  const rsigs = sigs.filter(s => s.signal_family === 'RSIG')
  const se = fr.structural_enrichment || {}
  const gl = fr.governance_lifecycle || {}

  const layers = []
  if (se.available) layers.push('STATIC_IMPORT')
  if (rsigs.some(s => (s.signal_id || '').includes('001') || (s.signal_id || '').includes('005'))) layers.push('EVENT_FLOW')
  if (rsigs.some(s => (s.signal_id || '').includes('003') || (s.signal_id || '').includes('006'))) layers.push('MQTT_TOPIC_FLOW')
  if (rsigs.some(s => (s.signal_id || '').includes('002'))) layers.push('WEBSOCKET_FLOW')

  const activeSurface = hasDivergence ? 'GRAVITY_DIVERGENCE' : (themes.length > 0 ? 'SYSTEMIC_OPERATIONAL_FRAGILITY' : null)

  let { SURFACE_ADJACENCY, SURFACE_NAMES } = {}
  try {
    const cc = require('./CognitiveContinuations')
    SURFACE_ADJACENCY = cc.SURFACE_ADJACENCY
    SURFACE_NAMES = cc.SURFACE_NAMES
  } catch {}

  return {
    // Anchor
    anchor: anc,
    anchorLevel: anc.level != null ? anc.level : null,

    // Finding
    activeSurface,
    activeFinding: hasDivergence ? 'structural_operational_divergence' : (themes[0] ? themes[0].theme_label : cdc.posture_label || null),
    postureLabel: cdc.posture_label || null,

    // Domains
    structuralCenter: structCenter,
    executionCenter: execCenter,
    hasDivergence,
    domainConcentration: domConc,
    domainNarratives: narratives,

    // Evidence
    consequenceThemes: themes,
    signals: sigs,
    rsigSignals: rsigs,
    rsigCount: rsigs.length,
    conditionCount: sigs.length,
    evidenceLayers: layers,

    // Structural
    structuralEnrichment: se.available ? {
      topSpines: (se.centrality && se.centrality.top_structural_spines || []).slice(0, 3),
      importHubCount: se.centrality && se.centrality.import_hub_count,
    } : null,

    // Governance
    qualificationState: gl.s_level || fr.qualification_level || pa.qualificationState || 'S0',
    projectionLevel: pa.projectionLevel || 0,
    isGoverned: gl.available || false,
    replayCertified: !!(gl.available && gl.detail && gl.detail.replay_status === 'PASS'),

    // Adjacency
    surfaceAdjacency: (SURFACE_ADJACENCY && activeSurface) ? (SURFACE_ADJACENCY[activeSurface] || []) : [],
    surfaceNames: SURFACE_NAMES || {},

    // Domain details per center
    structuralCenterDetail: structCenter ? {
      domain: structCenter,
      conditionCount: domConc[0] ? domConc[0].condition_count : 0,
      narrative: narratives.find(n => n.domain === structCenter),
      rsigCount: rsigs.filter(s => (s.affected_domains || []).some(d => d === structCenter || d.includes('Platform'))).length,
    } : null,
    executionCenterDetail: execCenter ? {
      domain: execCenter,
      conditionCount: domConc.find(d => d.domain === execCenter) ? domConc.find(d => d.domain === execCenter).condition_count : 0,
      narrative: narratives.find(n => n.domain === execCenter),
      rsigCount: rsigs.filter(s => (s.affected_domains || []).some(d => d === execCenter || d.includes('Fleet Core'))).length,
    } : null,

    // Completeness flags
    hasCDC: !!(cdc.posture_label || themes.length > 0),
    hasReport: !!fr.signal_interpretations,
    hasRuntime: rsigs.length > 0,
    hasStructural: !!se.available,
    hasGovernance: !!gl.available,
  }
}

function validateForIntent(ctx, intent) {
  const missing = []

  if (!ctx.hasCDC && !ctx.hasReport) missing.push('crossDomainCognition and fullReport')

  if (intent === 'compounding_analysis') {
    if (!ctx.activeSurface) missing.push('activeSurface (no finding resolved)')
    if (ctx.surfaceAdjacency.length === 0) missing.push('surfaceAdjacency (no adjacent surfaces for ' + (ctx.activeSurface || 'unknown surface') + ')')
  }
  if (intent === 'structural_mechanism') {
    if (!ctx.structuralCenter && !ctx.executionCenter) missing.push('domain centers (no structural or execution center resolved)')
  }
  if (intent === 'governance_decision') {
    if (!ctx.postureLabel && ctx.consequenceThemes.length === 0) missing.push('posture or consequence themes')
  }

  return { valid: missing.length === 0, missing }
}

module.exports = { buildSynthesisContext, validateForIntent }

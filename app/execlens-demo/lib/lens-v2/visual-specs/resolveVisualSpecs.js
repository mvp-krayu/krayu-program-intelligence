const VISUAL_SPEC_REGISTRY = {
  runtime_coordination_backbone: {
    title: 'Runtime Coordination Backbone',
    subtitle: 'Operational coordination architecture — invisible to import graph',
    requires: ['EVENT_FLOW', 'MQTT_TOPIC_FLOW', 'WEBSOCKET_FLOW'],
    minimumPLevel: 2,
  },
  dual_gravity_map: {
    title: 'Dual Gravity Map',
    subtitle: 'Structural vs operational authority divergence',
    requires: ['STATIC_IMPORT'],
    requiresRuntime: true,
    minimumPLevel: 2,
  },
  executive_risk_card: {
    title: 'Executive Risk Card',
    subtitle: 'Board-level risk posture at a glance',
    requires: ['STATIC_IMPORT'],
    requiresCDC: true,
    minimumPLevel: 1,
    persona: 'boardroom',
  },
  risk_concentration_map: {
    title: 'Risk Concentration Map',
    subtitle: 'Where structural and operational risk concentrates across domains',
    requires: ['STATIC_IMPORT'],
    requiresCDC: true,
    minimumPLevel: 1,
    persona: 'balanced',
  },
}

function detectEvidenceLayers(fullReport, visibilityLayerCompleteness) {
  const layers = new Set()

  if (visibilityLayerCompleteness && visibilityLayerCompleteness.layers_measured) {
    for (const lm of visibilityLayerCompleteness.layers_measured) {
      if (lm.id) layers.add(lm.id)
    }
    return layers
  }

  const sigs = (fullReport && fullReport.signal_interpretations) || []
  for (const s of sigs) {
    if (s.signal_family === 'PSIG' || s.signal_family === 'ISIG' || s.signal_family === 'DPSIG') {
      layers.add('STATIC_IMPORT')
    }
  }

  if (fullReport && fullReport.structural_enrichment && fullReport.structural_enrichment.available) {
    layers.add('STATIC_IMPORT')
  }

  return layers
}

function hasRuntimeEvidence(layers) {
  return layers.has('EVENT_FLOW') || layers.has('MQTT_TOPIC_FLOW') || layers.has('WEBSOCKET_FLOW')
}

function resolveAvailable(fullReport, projectionLevel, visibilityLayerCompleteness, crossDomainCognition) {
  const layers = detectEvidenceLayers(fullReport, visibilityLayerCompleteness)
  const pLevel = projectionLevel || 0
  const results = []

  for (const [specId, reg] of Object.entries(VISUAL_SPEC_REGISTRY)) {
    const missingLayers = reg.requires.filter(l => !layers.has(l))
    const meetsEvidence = missingLayers.length === 0

    const meetsRuntime = reg.requiresRuntime ? hasRuntimeEvidence(layers) : true
    const meetsPLevel = pLevel >= (reg.minimumPLevel || 0)
    const meetsCDC = reg.requiresCDC ? !!(crossDomainCognition && crossDomainCognition.domain_concentration && crossDomainCognition.domain_concentration.length > 0) : true

    const available = meetsEvidence && meetsRuntime && meetsPLevel && meetsCDC
    let reason = null

    if (!meetsEvidence) {
      reason = `Required evidence layers not present: ${missingLayers.join(', ')}`
    } else if (!meetsRuntime) {
      reason = 'Runtime evidence (EVENT_FLOW / MQTT / WEBSOCKET) not available for this specimen'
    } else if (!meetsCDC) {
      reason = 'Consequence compilation not available — conditions or domain concentration absent'
    } else if (!meetsPLevel) {
      reason = `Requires P${reg.minimumPLevel} authority — current level is P${pLevel}`
    }

    results.push({
      specId,
      title: reg.title,
      subtitle: reg.subtitle,
      available,
      reason,
      evidenceLayers: [...layers],
      requiredLayers: reg.requires,
    })
  }

  return results
}

module.exports = { resolveAvailable, VISUAL_SPEC_REGISTRY, detectEvidenceLayers }

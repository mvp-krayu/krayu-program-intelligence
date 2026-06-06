'use strict'

const OBJECT_ID = 'integration_exposure'

const SEVERITY_ORDER = { HIGH: 0, ELEVATED: 1, MODERATE: 2, LOW: 3, NOMINAL: 4 }

function maxSeverity(items) {
  let best = 'NOMINAL'
  for (const item of items) {
    const sev = item.severity || item
    if ((SEVERITY_ORDER[sev] ?? 5) < (SEVERITY_ORDER[best] ?? 5)) best = sev
  }
  return best
}

function isActivated(sig) {
  return sig.severity !== 'NOMINAL' && sig.activation_state !== 'NOMINAL' && sig.activation_state !== 'CLUSTER_BALANCED'
}

function materialize(cip) {
  const fr = cip.fullReport || cip
  const se = fr.structural_enrichment || {}
  const sigs = (fr.signal_interpretations || []).filter(isActivated)
  const blocks = fr.evidence_blocks || []

  const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
  const isigSigs = sigs.filter(s => s.signal_family === 'ISIG')
  const asymmetrySigs = sigs.filter(s => s.signal_name && s.signal_name.includes('Fan Asymmetry'))

  let bridgeCount = 0
  let connectorCount = 0
  const bridgeNodes = []

  if (se.available && se.centrality) {
    const roleSummary = se.centrality.role_summary || {}
    bridgeCount = roleSummary.bridge || 0
    connectorCount = roleSummary.connector || 0
    const spines = se.centrality.top_structural_spines || []
    bridgeNodes.push(...spines.filter(s => s.structural_role === 'bridge' || s.structural_role === 'connector').slice(0, 5))
  }

  const integrationSignalCount = isigSigs.length + asymmetrySigs.length
  if (bridgeCount === 0 && integrationSignalCount === 0 && passThroughs.length === 0) return null

  const hasTopology = (bridgeCount + connectorCount) > 0 || passThroughs.length > 0
  const hasIsig = isigSigs.length > 0
  const evidence_mode = hasTopology && hasIsig ? 'MIXED'
    : hasTopology ? 'TOPOLOGY_DRIVEN'
    : hasIsig ? 'IMPORT_SIGNAL_DRIVEN'
    : 'EVIDENCE_GAP'

  const severity = isigSigs.length >= 2 ? 'ELEVATED'
    : (isigSigs.length >= 1 && passThroughs.length >= 2) ? 'ELEVATED'
    : (bridgeCount > 0 && (isigSigs.length > 0 || asymmetrySigs.length > 0)) ? 'MODERATE'
    : 'LOW'

  const affectedDomains = [
    ...passThroughs.map(p => p.domain_alias),
    ...bridgeNodes.map(n => n.path.split('/').slice(-2).join('/')),
  ]

  const topologyCount = bridgeCount + connectorCount
  let operational_summary
  if (evidence_mode === 'IMPORT_SIGNAL_DRIVEN') {
    const peakSev = maxSeverity(isigSigs)
    operational_summary = `Elevated file-level import dependency pressure — ${isigSigs.length} ${peakSev} ISIG signal${isigSigs.length !== 1 ? 's' : ''} detect structural stress at import boundaries`
      + (passThroughs.length > 0 ? ` across ${passThroughs.length} pass-through domain${passThroughs.length !== 1 ? 's' : ''}` : '')
      + `. Cross-domain integration corridor topology not yet resolved.`
  } else if (evidence_mode === 'TOPOLOGY_DRIVEN') {
    operational_summary = `${topologyCount} cross-domain integration point${topologyCount !== 1 ? 's' : ''}`
      + (passThroughs.length > 0 ? ` — ${passThroughs.length} domain${passThroughs.length !== 1 ? 's' : ''} ${passThroughs.length !== 1 ? 'conduct' : 'conducts'} pressure` : '')
  } else if (evidence_mode === 'MIXED') {
    operational_summary = `${topologyCount} cross-domain integration point${topologyCount !== 1 ? 's' : ''} under ${isigSigs.length} import dependency signal${isigSigs.length !== 1 ? 's' : ''}`
      + (passThroughs.length > 0 ? ` — ${passThroughs.length} domain${passThroughs.length !== 1 ? 's' : ''} ${passThroughs.length !== 1 ? 'conduct' : 'conducts'} pressure` : '')
  } else {
    operational_summary = 'Integration exposure evidence insufficient for operational assessment'
  }

  let consequence
  if (evidence_mode === 'IMPORT_SIGNAL_DRIVEN') {
    consequence = severity === 'ELEVATED'
      ? 'File-level import dependency concentration is elevated — advisory-bound until cross-domain integration topology confirms corridor exposure'
      : 'Import dependency signals present but below elevated threshold'
  } else {
    consequence = severity === 'ELEVATED' || severity === 'HIGH'
      ? 'Integration boundaries are absorbing cross-domain pressure — changes here risk cascading through connected subsystems'
      : 'Integration points present but not under elevated structural stress'
  }

  return {
    surface_id: 'INTEGRATION_EXPOSURE',
    surface_name: 'Integration Exposure',
    severity,
    evidence_mode,
    operational_summary,
    consequence,
    evidence_density: bridgeCount + connectorCount + isigSigs.length + passThroughs.length,
    affected_domains: [...new Set(affectedDomains)],
    constituents: {
      bridges: bridgeCount,
      connectors: connectorCount,
      isig_signals: isigSigs.length,
      isig_peak_severity: isigSigs.length > 0 ? maxSeverity(isigSigs) : null,
      pass_through_domains: passThroughs.map(p => p.domain_alias),
    },
    trace_sources: ['structural_enrichment.centrality', 'signal_interpretations', 'evidence_blocks'],
  }
}

module.exports = { materialize, OBJECT_ID }

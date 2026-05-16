/**
 * InterrogationTrailBuilder
 * PI.LENS.V2.INTERROGATION-TRAIL-EXPORT.01
 *
 * Pure function module — generates a self-contained HTML document
 * representing a Structural Evidence Record.
 *
 * Document spine: posture → confidence envelope → structural path → governance → evidence review.
 * Progressive disclosure: executive layer → structural layer → evidence layer.
 *
 * Governance: DETERMINISTIC — renders existing derived state.
 * No inference. No recommendation. No prediction.
 */

const FORMAT_VERSION = '1.1'

const SEVERITY_COLOR = {
  critical: '#ff6b6b', elevated: '#ff9e4a', nominal: '#64ffda',
  CRITICAL: '#ff6b6b', HIGH: '#ff6b6b', ELEVATED: '#ff9e4a',
  MODERATE: '#ffd700', LOW: '#64ffda', NOMINAL: '#64ffda',
}

const CONFIDENCE_COLOR = {
  HIGH: '#64ffda', MODERATE: '#ffd700', LOW: '#ff9e4a', INSUFFICIENT: '#ff6b6b',
}

const STABILITY_COLOR = {
  STABLE: '#64ffda', SENSITIVE: '#ffd700', TRANSITIONAL: '#ff9e4a', VOLATILE: '#ff6b6b',
}

const STRUCTURAL_LANGUAGE = {
  PASS_THROUGH: 'Conducting structural pressure without originating it',
  SEMANTIC_ONLY: 'Operationally meaningful but structurally unverified',
  RECEIVER: 'Absorbing propagated pressure from upstream domains',
  ORIGIN: 'Originating structural pressure into the topology',
  NOMINAL: 'Within expected structural parameters',
  ELEVATED: 'Exceeding normal structural thresholds',
  CRITICAL: 'Requiring immediate structural attention',
  HIGH: 'Requiring immediate structural attention',
  MODERATE: 'Approaching structural threshold',
  STRONG: 'Confidence-grade structural backing',
  CONDITIONAL: 'Structurally supported with bounded conditions',
  WEAK: 'Limited structural support available',
}

function esc(str) {
  if (!str) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function humanize(term) {
  return STRUCTURAL_LANGUAGE[term] || term
}

function severityDot(severity) {
  const color = SEVERITY_COLOR[severity] || SEVERITY_COLOR[(severity || '').toLowerCase()] || '#7a8aaa'
  return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:6px;vertical-align:middle;"></span>`
}

function confidenceBar(ratio, color) {
  const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)))
  return `<div class="confidence-bar"><div class="confidence-bar-fill" style="width:${pct}%;background:${color || '#4a9eff'};"></div><span class="confidence-bar-label">${pct}%</span></div>`
}

function derivePostureStability(fullReport) {
  const ts = (fullReport && fullReport.topology_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const edges = (fullReport && fullReport.semantic_topology_edges) || []
  const backed = ts.structurally_backed_count || 0
  const total = ts.semantic_domain_count || 0
  const groundingDensity = total > 0 ? backed / total : 0
  const activated = sigs.filter(s => s.severity !== 'NOMINAL')
  const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
  const signalConcentration = sigs.length > 0 ? activated.length / sigs.length : 0
  const propagationBreadth = total > 0 ? Math.min(1, edges.length / (total * 2)) : 0
  let score = 0
  if (groundingDensity >= 0.7) score += 2; else if (groundingDensity >= 0.4) score += 1
  if (signalConcentration <= 0.3) score += 2; else if (signalConcentration <= 0.5) score += 1
  if (critical.length === 0) score += 2; else if (critical.length <= 1) score += 1
  if (propagationBreadth <= 0.3) score += 1
  if (score >= 6) return { label: 'STABLE', description: 'Posture is structurally well-supported with low signal pressure' }
  if (score >= 4) return { label: 'SENSITIVE', description: 'Posture is supported but sensitive to evidence changes' }
  if (score >= 2) return { label: 'TRANSITIONAL', description: 'Posture may shift with incoming evidence or signal changes' }
  return { label: 'VOLATILE', description: 'Posture is weakly supported with significant structural tensions' }
}

function deriveConfidenceEnvelope(fullReport) {
  const ts = (fullReport && fullReport.topology_summary) || {}
  const rs = (fullReport && fullReport.readiness_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const blocks = (fullReport && fullReport.evidence_blocks) || []
  const edges = (fullReport && fullReport.semantic_topology_edges) || []
  const qs = (fullReport && fullReport.qualifier_summary) || {}
  const backed = ts.structurally_backed_count || 0
  const total = ts.semantic_domain_count || 0
  const groundingRatio = total > 0 ? backed / total : 0
  const backedBlocks = blocks.filter(b => b && b.structural_backing && b.structural_backing !== 'SEMANTIC_ONLY')
  const evidenceContinuity = blocks.length > 0 ? backedBlocks.length / blocks.length : 0
  const activated = sigs.filter(s => s.severity !== 'NOMINAL')
  const propagationVisibility = total > 0 ? Math.min(1, edges.length / (total * 1.5)) : 0
  function classify(ratio) {
    if (ratio >= 0.7) return 'HIGH'
    if (ratio >= 0.4) return 'MODERATE'
    if (ratio >= 0.15) return 'LOW'
    return 'INSUFFICIENT'
  }
  const grounding = classify(groundingRatio)
  const continuity = classify(evidenceContinuity)
  const visibility = classify(propagationVisibility)
  const band = (rs.band || '').toUpperCase()
  const postureConfidence = band === 'STRONG' ? 'HIGH' : band === 'CONDITIONAL' ? 'MODERATE' : 'LOW'
  return {
    grounding: { level: grounding, ratio: groundingRatio, label: 'Structural grounding' },
    continuity: { level: continuity, ratio: evidenceContinuity, label: 'Evidence continuity' },
    visibility: { level: visibility, ratio: propagationVisibility, label: 'Propagation visibility' },
    postureConfidence: { level: postureConfidence, label: 'Posture confidence' },
    interpretiveAuthority: { level: qs.qualifier_class || '—', label: 'Interpretive authority' },
  }
}

function computeSnapshotId(fullReport) {
  const rs = (fullReport && fullReport.readiness_summary) || {}
  const ts = (fullReport && fullReport.topology_summary) || {}
  const parts = [
    rs.score || 0, rs.band || '', rs.posture || '',
    ts.structurally_backed_count || 0, ts.semantic_domain_count || 0,
    ((fullReport && fullReport.signal_interpretations) || []).length,
    ((fullReport && fullReport.evidence_blocks) || []).length,
  ]
  let hash = 0
  const str = parts.join(':')
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function buildStyles() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0d0f14;
      color: #ccd6f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    .mono { font-family: 'Courier New', Courier, monospace; }
    .dim { color: #7a8aaa; }
    .muted { color: #4a5570; }
    .accent { color: #4a9eff; }
    .section { margin-bottom: 32px; }
    .section-title {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #4a5570;
      border-bottom: 1px solid #1e2330;
      padding-bottom: 6px;
      margin-bottom: 16px;
    }
    .posture-label {
      font-family: 'Courier New', Courier, monospace;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin-bottom: 12px;
    }
    .posture-PROCEED { color: #64ffda; }
    .posture-INVESTIGATE { color: #ffd700; }
    .posture-ESCALATE { color: #ff6b6b; }
    .exec-summary {
      padding: 14px 16px;
      background: #141720;
      border-left: 3px solid #4a9eff;
      margin-bottom: 16px;
      line-height: 1.7;
    }
    .exec-summary-item {
      font-size: 13px;
      color: #ccd6f6;
      padding: 2px 0;
    }
    .exec-summary-item::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 10px;
      vertical-align: middle;
    }
    .exec-summary-item[data-severity="nominal"]::before { background: #64ffda; }
    .exec-summary-item[data-severity="elevated"]::before { background: #ffd700; }
    .exec-summary-item[data-severity="critical"]::before { background: #ff6b6b; }
    .stability-badge {
      display: inline-block;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      letter-spacing: 0.06em;
      padding: 3px 8px;
      border: 1px solid;
      margin-left: 12px;
      vertical-align: middle;
    }
    .envelope-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    .envelope-row {
      display: grid;
      grid-template-columns: 180px 1fr 60px;
      align-items: center;
      gap: 12px;
      padding: 8px 14px;
      background: #141720;
    }
    .envelope-label {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      color: #7a8aaa;
    }
    .envelope-level {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      font-weight: 600;
      text-align: right;
    }
    .confidence-bar {
      position: relative;
      height: 6px;
      background: #1e2330;
      border-radius: 3px;
      overflow: hidden;
    }
    .confidence-bar-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s;
    }
    .confidence-bar-label {
      position: absolute;
      right: -48px;
      top: -4px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      color: #4a5570;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 24px;
      margin-bottom: 12px;
    }
    .meta-key {
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #4a5570;
    }
    .meta-val {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      color: #ccd6f6;
    }
    .chain-item {
      padding: 10px 14px;
      background: #141720;
      border-left: 3px solid #2a2f40;
      margin-bottom: 6px;
    }
    .chain-item-label {
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #4a5570;
      margin-bottom: 4px;
    }
    .chain-item-value {
      font-size: 13px;
      color: #ccd6f6;
    }
    .chain-item-explain {
      font-size: 11px;
      color: #7a8aaa;
      font-style: italic;
      margin-top: 2px;
    }
    .evidence-row {
      display: flex;
      align-items: center;
      padding: 4px 0;
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
    }
    .evidence-label { color: #7a8aaa; min-width: 160px; }
    .evidence-value { color: #ccd6f6; }
    .boundary-block {
      padding: 8px 12px;
      background: #12151f;
      border: 1px solid #1e2330;
      margin-top: 6px;
    }
    .boundary-label {
      font-family: 'Courier New', Courier, monospace;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #4a5570;
      margin-bottom: 2px;
    }
    .boundary-text {
      font-size: 11px;
      color: #7a8aaa;
    }
    .zone-group { margin-bottom: 20px; }
    .zone-badge {
      display: inline-block;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      letter-spacing: 0.06em;
      color: #4a9eff;
      border: 1px solid #2a2f40;
      padding: 2px 6px;
      margin-right: 8px;
    }
    .zone-label {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      color: #7a8aaa;
    }
    .finding {
      padding: 12px 14px;
      background: #141720;
      border-left: 3px solid #2a2f40;
      margin: 8px 0;
    }
    .finding-question {
      font-size: 13px;
      color: #ccd6f6;
      margin-bottom: 6px;
    }
    .finding-summary {
      font-size: 12px;
      color: #7a8aaa;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .finding-context {
      font-size: 11px;
      color: #4a5570;
      font-style: italic;
      margin-top: 6px;
    }
    .expansion-type {
      font-family: 'Courier New', Courier, monospace;
      font-size: 9px;
      letter-spacing: 0.08em;
      color: #4a5570;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    details {
      margin-top: 8px;
    }
    details summary {
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      color: #4a5570;
      cursor: pointer;
      letter-spacing: 0.04em;
      padding: 4px 0;
    }
    details summary:hover { color: #7a8aaa; }
    details[open] summary { margin-bottom: 6px; }
    .governance-list {
      list-style: none;
      padding: 0;
    }
    .governance-list li {
      padding: 4px 0;
      font-size: 12px;
      color: #7a8aaa;
      border-bottom: 1px solid #12151f;
    }
    .governance-list li:last-child { border-bottom: none; }
    .scope-item {
      padding: 6px 12px;
      background: #12151f;
      margin-bottom: 4px;
      font-size: 12px;
      color: #4a5570;
    }
    .topology-container {
      background: #0a0c10;
      border: 1px solid #1e2330;
      padding: 16px;
      margin-bottom: 10px;
      overflow-x: auto;
    }
    .topology-container--captured svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .topology-svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .topology-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 8px;
    }
    .topology-legend-item {
      display: flex;
      align-items: center;
      font-family: 'Courier New', Courier, monospace;
      font-size: 9px;
      color: #4a5570;
      letter-spacing: 0.04em;
    }
    .topology-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .topology-stats {
      display: flex;
      gap: 20px;
      padding: 8px 0;
      border-top: 1px solid #12151f;
    }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #1e2330;
    }
    .footer-text {
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      color: #4a5570;
      line-height: 1.6;
    }
    @media print {
      body { background: #fff; color: #1a1a1a; padding: 20px; }
      .chain-item, .finding, .envelope-row, .exec-summary { background: #f5f5f5; border-left-color: #ccc; }
      .boundary-block, .scope-item { background: #f9f9f9; border-color: #ddd; }
      .section-title { color: #666; border-bottom-color: #ddd; }
      .dim, .muted, .meta-key, .chain-item-label, .boundary-label, .boundary-text, .footer-text, .envelope-label { color: #666; }
      .accent, .zone-badge { color: #2563eb; border-color: #ccc; }
      .posture-PROCEED { color: #059669; }
      .posture-INVESTIGATE { color: #d97706; }
      .posture-ESCALATE { color: #dc2626; }
      .confidence-bar { background: #e5e7eb; }
      .topology-container { background: #fafafa; border-color: #ddd; }
      .topology-svg line { stroke: #ccc; }
      .topology-svg text { fill: #555; }
      .topology-stats { border-top-color: #ddd; }
      details { break-inside: avoid; }
    }
  `
}

function buildPostureSection(fullReport, qualifierClass, authorityTier, client, run) {
  const rs = (fullReport && fullReport.readiness_summary) || {}
  const ts = (fullReport && fullReport.topology_summary) || {}
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const blocks = (fullReport && fullReport.evidence_blocks) || []
  const posture = (rs.posture || 'INVESTIGATE').toUpperCase()
  const score = rs.score || 0
  const band = rs.band || '—'
  const qc = qualifierClass || (fullReport && fullReport.qualifier_summary && fullReport.qualifier_summary.qualifier_class) || '—'
  const clientName = (fullReport && (fullReport.client_name || fullReport.client)) || client || '—'
  const runId = (fullReport && fullReport.run_id) || run || '—'
  const timestamp = new Date().toISOString()
  const snapshotId = computeSnapshotId(fullReport)
  const stability = derivePostureStability(fullReport)
  const stabilityColor = STABILITY_COLOR[stability.label] || '#7a8aaa'

  const backed = ts.structurally_backed_count || 0
  const total = ts.semantic_domain_count || 0
  const semanticOnly = Math.max(0, total - backed)
  const groundingRatio = total > 0 ? Math.round(backed / total * 100) : 0
  const activated = sigs.filter(s => s.severity !== 'NOMINAL')
  const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
  const primaryZone = ps.primary_zone_business_label || null

  const summaryItems = []
  summaryItems.push({
    text: `Current posture: ${posture}`,
    severity: posture === 'PROCEED' ? 'nominal' : posture === 'INVESTIGATE' ? 'elevated' : 'critical',
  })
  if (groundingRatio < 70) {
    summaryItems.push({ text: `Confidence constrained by ${groundingRatio}% structural grounding`, severity: groundingRatio < 40 ? 'critical' : 'elevated' })
  } else {
    summaryItems.push({ text: `Structural grounding at ${groundingRatio}% — confidence supported`, severity: 'nominal' })
  }
  if (primaryZone && activated.length > 0) {
    summaryItems.push({ text: `Pressure concentrates in ${primaryZone}`, severity: critical.length > 0 ? 'critical' : 'elevated' })
  }
  if (semanticOnly > 0) {
    summaryItems.push({ text: `Evidence continuity remains partial across ${total} domains`, severity: semanticOnly > total / 2 ? 'critical' : 'elevated' })
  } else {
    summaryItems.push({ text: `Evidence continuity complete across ${total} domains`, severity: 'nominal' })
  }
  if (critical.length === 0) {
    summaryItems.push({ text: 'No critical structural failure detected', severity: 'nominal' })
  } else {
    summaryItems.push({ text: `${critical.length} critical signal${critical.length !== 1 ? 's' : ''} require structural attention`, severity: 'critical' })
  }

  let html = `<div class="section">`
  html += `<div class="posture-label posture-${esc(posture)}">${esc(posture)}`
  html += `<span class="stability-badge" style="color:${stabilityColor};border-color:${stabilityColor};">${esc(stability.label)}</span>`
  html += `</div>`

  html += `<div class="exec-summary">`
  for (const item of summaryItems) {
    html += `<div class="exec-summary-item" data-severity="${item.severity}">${esc(item.text)}</div>`
  }
  html += `</div>`

  html += `<div class="meta-grid">`
  html += `<div><span class="meta-key">Readiness score</span></div><div><span class="meta-val">${score}</span></div>`
  html += `<div><span class="meta-key">Band</span></div><div><span class="meta-val">${esc(band)}</span></div>`
  html += `<div><span class="meta-key">Qualifier class</span></div><div><span class="meta-val">${esc(qc)}</span></div>`
  html += `<div><span class="meta-key">Posture stability</span></div><div><span class="meta-val" style="color:${stabilityColor}">${esc(stability.label)}</span></div>`
  html += `<div><span class="meta-key">Authority tier</span></div><div><span class="meta-val">${esc(authorityTier || 'INVESTIGATIVE')}</span></div>`
  html += `<div><span class="meta-key">Client</span></div><div><span class="meta-val">${esc(clientName)}</span></div>`
  html += `<div><span class="meta-key">Run</span></div><div><span class="meta-val">${esc(runId)}</span></div>`
  html += `<div><span class="meta-key">Snapshot</span></div><div><span class="meta-val">${esc(snapshotId)}</span></div>`
  html += `<div><span class="meta-key">Generated</span></div><div><span class="meta-val">${esc(timestamp)}</span></div>`
  html += `<div><span class="meta-key">Format version</span></div><div><span class="meta-val">${FORMAT_VERSION}</span></div>`
  html += `</div>`
  html += `</div>`
  return html
}

function buildConfidenceEnvelopeSection(fullReport) {
  const envelope = deriveConfidenceEnvelope(fullReport)
  const axes = [envelope.grounding, envelope.continuity, envelope.visibility, envelope.postureConfidence]

  let html = `<div class="section"><div class="section-title">Structural Confidence Envelope</div>`
  html += `<div class="envelope-grid">`
  for (const axis of axes) {
    const color = CONFIDENCE_COLOR[axis.level] || '#7a8aaa'
    html += `<div class="envelope-row">`
    html += `<div class="envelope-label">${esc(axis.label)}</div>`
    html += `<div>${axis.ratio !== undefined ? confidenceBar(axis.ratio, color) : ''}</div>`
    html += `<div class="envelope-level" style="color:${color};">${esc(axis.level)}</div>`
    html += `</div>`
  }
  html += `<div class="envelope-row">`
  html += `<div class="envelope-label">${esc(envelope.interpretiveAuthority.label)}</div>`
  html += `<div></div>`
  html += `<div class="envelope-level" style="color:#4a9eff;">${esc(envelope.interpretiveAuthority.level)}</div>`
  html += `</div>`
  html += `</div>`
  html += `</div>`
  return html
}

function buildTopologySection(fullReport, capturedTopologySvg) {
  const domains = (fullReport && fullReport.semantic_domain_registry) || []
  const edges = (fullReport && fullReport.semantic_topology_edges) || []
  const ts = (fullReport && fullReport.topology_summary) || {}
  const backed = ts.structurally_backed_count || 0
  const total = ts.semantic_domain_count || 0
  const clusters = ts.cluster_count || 0

  if (domains.length === 0 && edges.length === 0) return ''

  const hasTopology = edges.length > 0
  let html = `<div class="section">`

  if (capturedTopologySvg) {
    html += `<div class="section-title">Structural Semantic Topology</div>`
    html += `<div class="topology-container topology-container--captured">`
    html += capturedTopologySvg
    html += `</div>`
    html += `<div class="topology-stats">`
    html += `<span class="mono dim">${total} domains</span>`
    html += `<span class="mono dim">${edges.length} edges</span>`
    html += `<span class="mono dim">${clusters} clusters</span>`
    html += `<span class="mono dim">${backed}/${total} grounded</span>`
    html += `</div>`
  } else if (hasTopology) {
    html += `<div class="section-title">Structural Semantic Topology</div>`
    html += `<div class="dim" style="font-size:11px;margin-bottom:12px;">Authoritative topology projection was not available at export time. Generated structural view shown instead.</div>`

    const blocks = (fullReport && fullReport.evidence_blocks) || []
    const roleMap = {}
    for (const b of blocks) {
      if (b && b.domain_alias && b.propagation_role) {
        roleMap[b.domain_alias.toLowerCase()] = b.propagation_role
      }
    }

    const groundedSet = new Set()
    for (const d of domains) {
      const key = (d.business_label || d.domain_id || '').toLowerCase()
      if (d.structurally_backed || d.grounding_status === 'GROUNDED' || d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG') {
        groundedSet.add(key)
      }
    }

    const nodeIds = new Set()
    for (const d of domains) nodeIds.add(d.domain_id || d.business_label || '')
    for (const e of edges) { nodeIds.add(e.source_domain || ''); nodeIds.add(e.target_domain || '') }
    const nodeList = Array.from(nodeIds).filter(Boolean)

    const domainLabelMap = {}
    for (const d of domains) { domainLabelMap[d.domain_id || ''] = d.business_label || d.domain_id || '' }

    const svgW = 820
    const svgH = Math.max(280, Math.min(460, nodeList.length * 32))
    const cx = svgW / 2, cy = svgH / 2
    const rx = svgW * 0.38, ry = svgH * 0.36

    const nodePositions = {}
    nodeList.forEach((id, i) => {
      const angle = (2 * Math.PI * i) / nodeList.length - Math.PI / 2
      nodePositions[id] = { x: Math.round(cx + rx * Math.cos(angle)), y: Math.round(cy + ry * Math.sin(angle)) }
    })

    html += `<div class="topology-container">`
    html += `<svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="topology-svg">`
    for (const e of edges) {
      const from = nodePositions[e.source_domain], to = nodePositions[e.target_domain]
      if (!from || !to) continue
      html += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#2a2f40" stroke-width="1" stroke-dasharray="${e.relationship_type === 'causal' ? 'none' : '4,3'}"/>`
    }
    for (const id of nodeList) {
      const pos = nodePositions[id]
      if (!pos) continue
      const label = domainLabelMap[id] || id
      const lk = label.toLowerCase()
      const isGrounded = groundedSet.has(lk) || groundedSet.has(id.toLowerCase())
      const role = roleMap[lk] || roleMap[id.toLowerCase()] || null
      const nodeColor = role === 'ORIGIN' ? '#ff6b6b' : role === 'PASS_THROUGH' ? '#ffd700' : isGrounded ? '#64ffda' : '#4a5570'
      const nodeR = role === 'ORIGIN' ? 7 : role === 'PASS_THROUGH' ? 6 : 5
      html += `<circle cx="${pos.x}" cy="${pos.y}" r="${nodeR}" fill="${nodeColor}" opacity="0.9"/>`
      html += `<circle cx="${pos.x}" cy="${pos.y}" r="${nodeR + 3}" fill="none" stroke="${nodeColor}" stroke-width="1" opacity="0.3"/>`
      const labelX = pos.x > cx ? pos.x + nodeR + 6 : pos.x - nodeR - 6
      const anchor = pos.x > cx ? 'start' : 'end'
      html += `<text x="${labelX}" y="${pos.y + 3}" fill="#7a8aaa" font-family="'Courier New', monospace" font-size="9" text-anchor="${anchor}">${esc(label)}</text>`
    }
    html += `</svg></div>`

    html += `<div class="topology-legend">`
    html += `<span class="topology-legend-item"><span class="topology-dot" style="background:#64ffda;"></span>Structurally backed</span>`
    html += `<span class="topology-legend-item"><span class="topology-dot" style="background:#4a5570;"></span>Semantic only</span>`
    html += `<span class="topology-legend-item"><span class="topology-dot" style="background:#ff6b6b;"></span>Pressure origin</span>`
    html += `<span class="topology-legend-item"><span class="topology-dot" style="background:#ffd700;"></span>Pass-through</span>`
    html += `</div>`

    html += `<div class="topology-stats">`
    html += `<span class="mono dim">${total} domains</span>`
    html += `<span class="mono dim">${edges.length} edges</span>`
    html += `<span class="mono dim">${clusters} clusters</span>`
    html += `<span class="mono dim">${backed}/${total} grounded</span>`
    html += `</div>`
  } else {
    html += `<div class="section-title">Semantic-to-Structural Mapping</div>`
    html += `<div class="dim" style="font-size:11px;margin-bottom:12px;">Structural topology projection unavailable for current evidence state. Semantic-to-structural mapping shown instead.</div>`

    const grounded = domains.filter(d => d && (d.structurally_backed || d.grounding_status === 'GROUNDED' || d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG'))
    const semanticOnly = domains.filter(d => d && (d.semantic_only || d.grounding_status === 'SEMANTIC_ONLY' || d.lineage_status === 'NONE' || d.lineage_status === 'WEAK'))
    const unmapped = domains.filter(d => d && !grounded.includes(d) && !semanticOnly.includes(d))

    if (grounded.length > 0) {
      html += `<div class="chain-item" style="border-left-color:#64ffda;"><div class="chain-item-label">Structurally backed</div>`
      html += `<div class="chain-item-value">${grounded.length} domain${grounded.length !== 1 ? 's' : ''}</div>`
      html += `<div class="dim" style="font-size:11px;margin-top:4px;">${grounded.map(d => esc(d.business_label || d.domain_id || '—')).join(' · ')}</div>`
      html += `</div>`
    }
    if (semanticOnly.length > 0) {
      html += `<div class="chain-item" style="border-left-color:#ffd700;"><div class="chain-item-label">Semantic only — ${humanize('SEMANTIC_ONLY').toLowerCase()}</div>`
      html += `<div class="chain-item-value">${semanticOnly.length} domain${semanticOnly.length !== 1 ? 's' : ''}</div>`
      html += `<div class="dim" style="font-size:11px;margin-top:4px;">${semanticOnly.map(d => esc(d.business_label || d.domain_id || '—')).join(' · ')}</div>`
      html += `</div>`
    }
    if (unmapped.length > 0) {
      html += `<div class="chain-item" style="border-left-color:#4a5570;"><div class="chain-item-label">Unmapped</div>`
      html += `<div class="chain-item-value">${unmapped.length} domain${unmapped.length !== 1 ? 's' : ''}</div>`
      html += `<div class="dim" style="font-size:11px;margin-top:4px;">${unmapped.map(d => esc(d.business_label || d.domain_id || '—')).join(' · ')}</div>`
      html += `</div>`
    }
  }

  html += `</div>`
  return html
}

function buildPosturePathSection(fullReport) {
  const rs = (fullReport && fullReport.readiness_summary) || {}
  const ts = (fullReport && fullReport.topology_summary) || {}
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const blocks = (fullReport && fullReport.evidence_blocks) || []
  const edges = (fullReport && fullReport.semantic_topology_edges) || []

  const posture = (rs.posture || 'INVESTIGATE').toUpperCase()
  const score = rs.score || 0
  const band = rs.band || '—'
  const backed = ts.structurally_backed_count || 0
  const total = ts.semantic_domain_count || 0
  const semanticOnly = Math.max(0, total - backed)
  const groundingRatio = total > 0 ? Math.round(backed / total * 100) : 0
  const activated = sigs.filter(s => s.severity !== 'NOMINAL')
  const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
  const primaryZone = ps.primary_zone_business_label || '—'
  const semanticOnlyBlocks = blocks.filter(b => b && (!b.structural_backing || b.structural_backing === 'SEMANTIC_ONLY'))

  const chains = [
    {
      label: 'Readiness chain',
      value: `Score ${score} → Band ${band} → Posture ${posture}`,
      detail: `${rs.decision_validation_passed || 0}/${rs.decision_validation_total || 0} validation checks passed`,
      bar: { ratio: (score || 0) / 100, color: score >= 70 ? '#64ffda' : score >= 40 ? '#ffd700' : '#ff6b6b' },
    },
    {
      label: 'Pressure concentration',
      value: `Primary zone: ${primaryZone}`,
      explain: primaryZone !== '—' ? humanize(ps.psig_signals && ps.psig_signals.length > 0 ? 'ORIGIN' : 'PASS_THROUGH') : null,
      detail: ps.primary_zone_evidence || (ps.psig_signals ? `${ps.psig_signals.length} pressure signals tracked` : null),
    },
    {
      label: 'Grounding quality',
      value: `${backed}/${total} domains structurally backed (${groundingRatio}%)`,
      detail: semanticOnly > 0 ? `${semanticOnly} domain${semanticOnly !== 1 ? 's' : ''} ${humanize('SEMANTIC_ONLY').toLowerCase()}` : 'All domains have structural backing',
      bar: { ratio: groundingRatio / 100, color: groundingRatio >= 70 ? '#64ffda' : groundingRatio >= 40 ? '#ffd700' : '#ff6b6b' },
    },
    {
      label: 'Signal convergence',
      value: `${activated.length} activated signal${activated.length !== 1 ? 's' : ''}${critical.length > 0 ? ` · ${critical.length} critical/high` : ''}`,
      detail: activated.slice(0, 5).map(s => `${s.signal_name || s.label || '—'} — ${humanize(s.severity)}`).join(', ') || 'No activated signals',
    },
    {
      label: 'Unresolved structural tensions',
      value: semanticOnly > 0 || semanticOnlyBlocks.length > 0
        ? `${semanticOnly} domain${semanticOnly !== 1 ? 's' : ''} without structural verification${semanticOnlyBlocks.length > 0 ? ` · ${semanticOnlyBlocks.length} evidence block${semanticOnlyBlocks.length !== 1 ? 's' : ''} ungrounded` : ''}`
        : 'No unresolved tensions identified',
    },
    {
      label: 'Propagation impact',
      value: `${edges.length} topology edge${edges.length !== 1 ? 's' : ''} mapped`,
      detail: edges.length > 0 ? `Cross-domain flow paths tracked across ${total} domains` : null,
    },
    {
      label: 'Evidence sufficiency',
      value: blocks.length > 0
        ? `${blocks.filter(b => b && b.structural_backing && b.structural_backing !== 'SEMANTIC_ONLY').length}/${blocks.length} evidence blocks structurally backed`
        : 'No evidence blocks available',
      bar: blocks.length > 0 ? { ratio: blocks.filter(b => b && b.structural_backing && b.structural_backing !== 'SEMANTIC_ONLY').length / blocks.length, color: '#4a9eff' } : null,
    },
  ]

  let html = `<div class="section">`
  html += `<details open><summary class="section-title" style="display:list-item;">§1 · Structural Path to Posture</summary>`
  for (const c of chains) {
    html += `<div class="chain-item">`
    html += `<div class="chain-item-label">${esc(c.label)}</div>`
    html += `<div class="chain-item-value">${esc(c.value)}</div>`
    if (c.explain) html += `<div class="chain-item-explain">${esc(c.explain)}</div>`
    if (c.detail) html += `<div class="dim" style="font-size:11px;margin-top:2px;">${esc(c.detail)}</div>`
    if (c.bar) html += `<div style="margin-top:6px;padding-right:48px;">${confidenceBar(c.bar.ratio, c.bar.color)}</div>`
    html += `</div>`
  }
  html += `</details></div>`
  return html
}

function buildGovernanceBoundarySection(fullReport, exploredQueries, interrogationTrail, denseZoneRegistry, denseZonePaths) {
  const ts = (fullReport && fullReport.topology_summary) || {}
  const domains = (fullReport && fullReport.semantic_domain_registry) || []
  const backed = ts.structurally_backed_count || 0
  const total = ts.semantic_domain_count || 0
  const semanticOnly = Math.max(0, total - backed)

  const knownDomains = domains.filter(d => d && d.grounding_status !== 'SEMANTIC_ONLY' && d.grounding_status !== 'semantic_only')
  const unresolvedDomains = domains.filter(d => d && (d.grounding_status === 'SEMANTIC_ONLY' || d.grounding_status === 'semantic_only'))

  const allZoneKeys = Object.keys(denseZoneRegistry || {})
  const exploredZones = new Set()
  if (exploredQueries) {
    exploredQueries.forEach(key => {
      const zone = key.split(':')[0]
      if (zone) exploredZones.add(zone)
    })
  }
  const unexaminedZones = allZoneKeys.filter(z => !exploredZones.has(z))

  let html = `<div class="section"><div class="section-title">§2 · Governance Boundary</div>`

  html += `<div class="chain-item"><div class="chain-item-label">What is structurally confirmed</div>`
  html += `<div class="chain-item-value">${backed} domain${backed !== 1 ? 's' : ''} with verified structural evidence</div>`
  if (knownDomains.length > 0) {
    html += `<div class="dim" style="font-size:11px;margin-top:4px;">${knownDomains.slice(0, 8).map(d => esc(d.business_label || d.domain_id || '—')).join(' · ')}</div>`
  }
  html += `</div>`

  html += `<div class="chain-item"><div class="chain-item-label">What remains structurally unverified</div>`
  if (semanticOnly > 0) {
    html += `<div class="chain-item-value">${semanticOnly} domain${semanticOnly !== 1 ? 's' : ''} — ${humanize('SEMANTIC_ONLY').toLowerCase()}</div>`
    if (unresolvedDomains.length > 0) {
      html += `<div class="dim" style="font-size:11px;margin-top:4px;">${unresolvedDomains.slice(0, 8).map(d => esc(d.business_label || d.domain_id || '—')).join(' · ')}</div>`
    }
  } else {
    html += `<div class="chain-item-value">All domains have structural backing</div>`
  }
  html += `</div>`

  html += `<div class="chain-item"><div class="chain-item-label">What is prohibited</div>`
  html += `<div class="chain-item-value">13 absolute prohibitions enforced</div>`
  html += `<details><summary>View prohibitions</summary>`
  html += `<ul class="governance-list">`
  const prohibitions = [
    'No team behavior inference',
    'No organizational intent inference',
    'No human motive interpretation',
    'No cultural diagnosis',
    'No leadership quality assessment',
    'No management effectiveness assessment',
    'No personnel attribution',
    'No behavioral prediction',
    'No organizational sentiment',
    'No causal attribution to humans',
    'No remediation prioritization',
    'No prescriptive language',
    'No ranked next actions',
  ]
  for (const p of prohibitions) {
    html += `<li>${esc(p)}</li>`
  }
  html += `</ul></details></div>`

  const noReview = (!exploredQueries || exploredQueries.size === 0) && (!interrogationTrail || interrogationTrail.size === 0)
  html += `<div class="chain-item"><div class="chain-item-label">What was not structurally reviewed within current evidence review scope</div>`
  if (unexaminedZones.length > 0 || noReview) {
    if (noReview) {
      html += `<div class="chain-item-value">No structural review was conducted within this session</div>`
      html += `<div class="dim" style="font-size:11px;margin-top:4px;">This record presents the structural posture derivation and governance boundary only. All structural zones remain available for future review.</div>`
    } else {
      html += `<div class="chain-item-value">${unexaminedZones.length} structural zone${unexaminedZones.length !== 1 ? 's' : ''} not reviewed within current scope</div>`
    }
    for (const zk of unexaminedZones) {
      const reg = (denseZoneRegistry || {})[zk]
      if (reg) {
        const pathCount = ((denseZonePaths || {})[zk] || []).length
        html += `<div class="scope-item"><span class="mono">${esc(reg.code)}</span> ${esc(reg.label)} — ${pathCount} structural queries available for review</div>`
      }
    }
  } else {
    html += `<div class="chain-item-value">All available structural zones were reviewed within this scope</div>`
  }
  html += `</div>`

  html += `</div>`
  return html
}

function buildEvidenceReviewSection(exploredQueries, interrogationTrail, fullReport, denseZonePaths, guidedQueryAnswers, interrogationExpansionRegistry, expansionTypeLabels, denseZoneRegistry, tonePalette, densityClass, boardroomMode) {
  const hasQueries = exploredQueries && exploredQueries.size > 0
  const hasExpansions = interrogationTrail && interrogationTrail.size > 0
  if (!hasQueries && !hasExpansions) return ''

  let html = `<div class="section"><div class="section-title">§3 · Structural Evidence Review</div>`

  if (hasQueries) {
    const byZone = {}
    exploredQueries.forEach(key => {
      const [zone, idxStr] = key.split(':')
      if (!byZone[zone]) byZone[zone] = []
      byZone[zone].push(parseInt(idxStr, 10))
    })

    for (const [zoneKey, indices] of Object.entries(byZone)) {
      const reg = (denseZoneRegistry || {})[zoneKey]
      const paths = (denseZonePaths || {})[zoneKey] || []
      const answers = (guidedQueryAnswers || {})[zoneKey] || []
      if (!reg) continue

      html += `<div class="zone-group">`
      html += `<div><span class="zone-badge">${esc(reg.code)}</span><span class="zone-label">${esc(reg.label)}</span></div>`

      for (const idx of indices.sort((a, b) => a - b)) {
        const path = paths[idx]
        const answerFn = answers[idx]
        if (!path || !answerFn) continue

        const result = answerFn.derive ? answerFn.derive(fullReport) : (typeof answerFn === 'function' ? answerFn(fullReport) : null)
        if (!result) continue

        html += `<div class="finding">`
        html += `<div class="finding-question">${esc(path.answers || path.label)}</div>`
        html += `<div class="finding-summary">${esc(result.summary)}</div>`
        if (result.evidence && result.evidence.length > 0) {
          html += `<details><summary>Evidence chain (${result.evidence.length} items)</summary>`
          for (const ev of result.evidence) {
            html += `<div class="evidence-row">${severityDot(ev.severity)}<span class="evidence-label">${esc(ev.label)}</span><span class="evidence-value">${esc(ev.value)}</span></div>`
          }
          if (result.structuralContext) {
            html += `<div class="finding-context">${esc(result.structuralContext)}</div>`
          }
          if (path.boundary) {
            html += `<div class="boundary-block"><div class="boundary-label">Governance binding</div><div class="boundary-text">${esc(path.boundary)}</div></div>`
          }
          html += `</details>`
        }
        html += `</div>`
      }
      html += `</div>`
    }
  }

  if (hasExpansions) {
    const modeKey = boardroomMode ? 'boardroom' : densityClass
    const generator = (interrogationExpansionRegistry || {})[modeKey]
    const expansions = generator ? generator(fullReport) : []

    if (expansions.length > 0) {
      html += `<div class="zone-group">`
      html += `<div><span class="zone-badge">SD</span><span class="zone-label">Structural Depth Findings</span></div>`

      interrogationTrail.forEach(idx => {
        const exp = expansions[idx]
        if (!exp) return

        const result = exp.derive ? exp.derive(fullReport) : null
        if (!result) return

        const typeLabel = (expansionTypeLabels || {})[exp.expansionType] || exp.expansionType || '—'
        html += `<div class="finding">`
        html += `<div class="expansion-type">${esc(typeLabel)}</div>`
        html += `<div class="finding-question">${esc(exp.question)}</div>`
        html += `<div class="finding-summary">${esc(result.summary)}</div>`
        if (result.evidence && result.evidence.length > 0) {
          html += `<details><summary>Evidence chain (${result.evidence.length} items)</summary>`
          for (const ev of result.evidence) {
            html += `<div class="evidence-row">${severityDot(ev.severity)}<span class="evidence-label">${esc(ev.label)}</span><span class="evidence-value">${esc(ev.value)}</span></div>`
          }
          if (result.structuralContext) {
            html += `<div class="finding-context">${esc(result.structuralContext)}</div>`
          }
          if (exp.boundary) {
            html += `<div class="boundary-block"><div class="boundary-label">Governance binding</div><div class="boundary-text">${esc(exp.boundary)}</div></div>`
          }
          html += `</details>`
        }
        html += `</div>`
      })
      html += `</div>`
    }
  }

  const allZoneKeys = Object.keys(denseZoneRegistry || {})
  const exploredZones = new Set()
  if (exploredQueries) {
    exploredQueries.forEach(key => {
      const zone = key.split(':')[0]
      if (zone) exploredZones.add(zone)
    })
  }
  const unexaminedZones = allZoneKeys.filter(z => !exploredZones.has(z))
  if (unexaminedZones.length > 0) {
    html += `<div style="margin-top:16px;">`
    html += `<div class="chain-item-label" style="margin-bottom:6px;">Not reviewed within current structural scope</div>`
    for (const zk of unexaminedZones) {
      const reg = (denseZoneRegistry || {})[zk]
      if (reg) {
        const pathCount = ((denseZonePaths || {})[zk] || []).length
        html += `<div class="scope-item"><span class="mono">${esc(reg.code)}</span> ${esc(reg.label)} — ${pathCount} structural queries available for review</div>`
      }
    }
    html += `</div>`
  }

  html += `</div>`
  return html
}

function buildFooter(fullReport) {
  const snapshotId = computeSnapshotId(fullReport)
  const timestamp = new Date().toISOString()
  return `
    <div class="footer">
      <div class="footer-text">
        EVIDENCE BOUNDARY STATEMENT<br><br>
        This record presents structurally-derived intelligence bounded by evidence state at generation time.
        All findings trace to deterministic derivation from qualified semantic payloads.
        No inference, recommendation, or prediction is present.
        13 absolute prohibitions enforced.<br><br>
        Structural derivation remains primary. Interpretive authority is additive, not replacement.<br><br>
        SNAPSHOT ${snapshotId} · ${timestamp}<br>
        FORMAT VERSION ${FORMAT_VERSION} · Governed Structural Derivation
      </div>
    </div>
  `
}

export function buildTrailHTML(options) {
  const {
    exploredQueries,
    interrogationTrail,
    fullReport,
    denseZonePaths,
    guidedQueryAnswers,
    interrogationExpansionRegistry,
    expansionTypeLabels,
    denseZoneRegistry,
    tonePalette,
    client,
    run,
    qualifierClass,
    authorityTier,
    densityClass,
    boardroomMode,
    capturedTopologySvg,
  } = options || {}

  const title = 'Structural Evidence Record'
  const snapshotId = computeSnapshotId(fullReport)

  const s0 = buildPostureSection(fullReport, qualifierClass, authorityTier, client, run)
  const sEnv = buildConfidenceEnvelopeSection(fullReport)
  const sTopo = buildTopologySection(fullReport, capturedTopologySvg)
  const s1 = buildPosturePathSection(fullReport)
  const s2 = buildGovernanceBoundarySection(fullReport, exploredQueries, interrogationTrail, denseZoneRegistry, denseZonePaths)
  const s3 = buildEvidenceReviewSection(exploredQueries, interrogationTrail, fullReport, denseZonePaths, guidedQueryAnswers, interrogationExpansionRegistry, expansionTypeLabels, denseZoneRegistry, tonePalette, densityClass, boardroomMode)
  const footer = buildFooter(fullReport)
  const styles = buildStyles()

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-version" content="${FORMAT_VERSION}">
  <meta name="snapshot-id" content="${esc(snapshotId)}">
  <meta name="generator" content="Governed Structural Derivation">
  <meta name="governance" content="DETERMINISTIC — no inference, no recommendation, no prediction">
  <title>${esc(title)}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="section-title" style="margin-bottom:24px;">STRUCTURAL EVIDENCE RECORD</div>
  ${s0}
  ${sEnv}
  ${sTopo}
  ${s1}
  ${s2}
  ${s3}
  ${footer}
</body>
</html>`
}

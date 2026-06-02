// Assessment Package Builder — single governed export action.
// Produces a self-contained HTML Structural Assessment from runtime state.
// Deterministic: same fullReport + same synthesisResult + same consequenceResult → same package.
//
// Product law (D13): deliverables are runtime-generated through a governed export action.
// Operator reviews. Operator does not compose, edit, suppress, or augment findings.

const { materialize: materializePICR, assembleCIP } = require('./cognition/PICRRuntime')
const { SCHEMA_VERSION } = require('./cognition/PICPSchema')
const { build: buildGroundingContext } = require('./consumers/eir/EIRGroundingContext')
const { synthesize } = require('./consumers/eir/ExecutiveIntelligenceSynthesis')
const { generateChapterGraphics } = require('./consumers/eir/EIRGraphics')
const PRECore = require('./projection/PRECore')
const eirConfig = require('./projection/configs/eir')

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

function buildAssessmentPackage(options) {
  const {
    fullReport,
    synthesisResult,
    consequenceResult,
    capturedTopologySvg,
    qualifierClass,
    client,
    run,
  } = options

  if (!fullReport) {
    return { ok: false, error: 'No fullReport provided' }
  }

  const cip = assembleCIP(fullReport, synthesisResult || {}, consequenceResult || {}, {})
  const picrResult = materializePICR(cip)

  const qualifierSummary = fullReport.qualifier_summary || {}

  const picp = {
    metadata: {
      schema_version: SCHEMA_VERSION,
      pipeline_run_id: run || fullReport.run_id || 'unknown',
      client_id: client || fullReport.client || fullReport.client_name || 'unknown',
      specimen_id: run || fullReport.run_id || 'unknown',
      timestamp: new Date().toISOString(),
      qualification_state: {
        s_level: qualifierSummary.s_level || null,
        q_class: qualifierSummary.qualifier_class || null,
        authority_ceiling: null,
        provenance: null,
      },
      chronicle_certification: { status: 'UNCERTIFIED', check_count: 0, pass_count: 0 },
      materialization: picrResult.metadata,
    },
    cognition_objects: picrResult.cognitionObjects,
  }

  const groundingContext = buildGroundingContext(fullReport, synthesisResult || {})

  const projection = PRECore.project(picp, eirConfig)
  if (!projection.ok) {
    return { ok: false, error: 'PRE projection failed', detail: projection.error }
  }

  const eirSynthesis = synthesize(picp, groundingContext)
  if (!eirSynthesis.ok) {
    return { ok: false, error: 'Executive intelligence synthesis failed' }
  }

  const graphics = generateChapterGraphics(picp, groundingContext)

  const chapters = eirSynthesis.chapters.map(ch => ({
    chapter_id: ch.chapter_id,
    chapter_label: ch.chapter_label,
    sequence: ch.sequence,
    findings: ch.findings,
    evidence_sources: (ch.evidence_objects || []).map(id => ({ object_id: id, role: 'primary' })),
    finding_count: ch.findings.length,
    graphic: graphics[ch.chapter_id] || null,
  }))

  const totalFindings = chapters.reduce((s, ch) => s + ch.finding_count, 0)

  const html = renderAssessmentHTML({
    picp,
    chapters,
    projection,
    totalFindings,
    groundingContext,
    fullReport,
    capturedTopologySvg,
    qualifierClass,
    client: client || fullReport.client || fullReport.client_name || '',
    run: run || fullReport.run_id || '',
  })

  return { ok: true, html }
}


function renderAssessmentHTML(data) {
  const {
    picp, chapters, projection, totalFindings,
    groundingContext, fullReport, capturedTopologySvg,
    qualifierClass, client, run,
  } = data

  const meta = picp.metadata
  const sLevel = meta.qualification_state.s_level || '—'
  const qClass = meta.qualification_state.q_class || '—'
  const clientDisplay = resolveClientDisplay(client)
  const generated = meta.timestamp
  const stability = derivePostureStability(fullReport)
  const envelope = deriveConfidenceEnvelope(fullReport)
  const snapshotId = computeSnapshotId(fullReport)
  const rs = (fullReport && fullReport.readiness_summary) || {}
  const posture = (rs.posture || 'INVESTIGATE').toUpperCase()
  const scale = groundingContext.scale || {}

  const toc = renderTOC(chapters, !!capturedTopologySvg)
  const verdictChapters = chapters.map((ch, i) => renderChapter(ch, i === 0)).join('\n')
  const topologySection = capturedTopologySvg ? renderTopologySection(capturedTopologySvg, scale) : ''
  const evidenceSection = renderEvidenceRecord(fullReport, qualifierClass, posture, stability, envelope, snapshotId, clientDisplay, run)
  const governanceSection = renderGovernance(projection.governance, projection.disclosures)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="generator" content="Signäl Structural Assessment — Governed Cognition Export">
  <meta name="governance" content="DETERMINISTIC Zone A + GOVERNED Zone B (75.x) + QUALIFICATION Zone C">
  <meta name="pipeline-run" content="${esc(meta.pipeline_run_id || '')}">
  <meta name="s-level" content="${esc(sLevel)}">
  <meta name="q-class" content="${esc(qClass)}">
  <title>Structural Assessment — ${esc(clientDisplay)}</title>
  <style>${STYLES}</style>
</head>
<body>
  <header class="report-header">
    <div class="header-rule"></div>
    <div class="header-brand">
      <div class="header-eyebrow">Signäl — Structural Intelligence</div>
    </div>
    <h1 class="report-title">Structural Assessment</h1>
    <div class="report-subtitle">${esc(clientDisplay)}${run ? ' — ' + esc(run) : ''}</div>
    <div class="report-meta">
      <div class="meta-badge meta-badge--primary">${esc(sLevel)}</div>
      <div class="meta-badge">${esc(qClass)}</div>
      <div class="meta-badge meta-badge--posture posture-${esc(posture)}">${esc(posture)}</div>
    </div>
    <div class="header-stats">
      <span class="stat">${chapters.length} chapters</span>
      <span class="stat-sep">/</span>
      <span class="stat">${totalFindings} findings</span>
      <span class="stat-sep">/</span>
      <span class="stat">${esc(String(scale.file_count || 0))} files analyzed</span>
      <span class="stat-sep">/</span>
      <span class="stat">deterministic structural analysis</span>
    </div>
  </header>

  <nav class="toc">
    <div class="toc-header">
      <div class="toc-title">Contents</div>
    </div>
    <div class="toc-grid">
      ${toc}
    </div>
  </nav>

  <div class="report-divider"></div>
  <div class="part-header">
    <div class="part-label">Part I</div>
    <div class="part-title">Structural Verdict</div>
  </div>

  <main class="report-body">
    ${verdictChapters}
  </main>

  ${topologySection ? `
  <div class="report-divider"></div>
  <div class="part-header">
    <div class="part-label">Part II</div>
    <div class="part-title">Structural Topology</div>
  </div>
  ${topologySection}
  ` : ''}

  <div class="report-divider"></div>
  <div class="part-header">
    <div class="part-label">${capturedTopologySvg ? 'Part III' : 'Part II'}</div>
    <div class="part-title">Evidence Record</div>
  </div>
  ${evidenceSection}

  <footer class="report-footer">
    ${governanceSection}
    <div class="footer-disclosure">
      <div class="disclosure-text">
        This Structural Assessment was produced by Signäl's governed intelligence pipeline.
        Same evidence produces the same findings. All conclusions are deterministically derived
        from the structural import topology. No manual composition. No operator augmentation.
      </div>
    </div>
    <div class="footer-timestamp">Generated: ${esc(generated)}</div>
  </footer>
</body>
</html>`
}


function renderTOC(chapters, hasTopology) {
  let entries = chapters.map(ch =>
    `<a class="toc-entry" href="#${esc(ch.chapter_id)}">
      <span class="toc-num">${String(ch.sequence).padStart(2, '0')}</span>
      <span class="toc-body">
        <span class="toc-label">${esc(ch.chapter_label)}</span>
        <span class="toc-count">${ch.finding_count} finding${ch.finding_count !== 1 ? 's' : ''}</span>
      </span>
    </a>`
  ).join('\n')

  if (hasTopology) {
    entries += `\n<a class="toc-entry" href="#topology">
      <span class="toc-num">T</span>
      <span class="toc-body">
        <span class="toc-label">Structural Topology</span>
        <span class="toc-count">topology capture</span>
      </span>
    </a>`
  }

  entries += `\n<a class="toc-entry" href="#evidence-record">
    <span class="toc-num">E</span>
    <span class="toc-body">
      <span class="toc-label">Evidence Record</span>
      <span class="toc-count">posture · confidence · governance</span>
    </span>
  </a>`

  return entries
}


function renderChapter(chapter, isHero) {
  const findings = chapter.findings.map(f => renderFinding(f)).join('\n')
  const heroClass = isHero ? ' chapter--hero' : ''
  const seqLabel = String(chapter.sequence).padStart(2, '0')

  const graphic = chapter.graphic
    ? `<div class="chapter-graphic">${chapter.graphic}</div>`
    : ''

  return `<section class="chapter${heroClass}" id="${esc(chapter.chapter_id)}">
    <div class="chapter-header">
      <div class="chapter-badge">${seqLabel}</div>
      <div class="chapter-header-body">
        <h2 class="chapter-title">${esc(chapter.chapter_label)}</h2>
        <div class="chapter-meta">${chapter.finding_count} finding${chapter.finding_count !== 1 ? 's' : ''} · ${chapter.evidence_sources.map(s => esc(s.object_id)).join(', ')}</div>
      </div>
    </div>
    ${graphic}
    <div class="findings">
      ${findings || '<div class="no-findings">No findings derived from structural evidence.</div>'}
    </div>
  </section>`
}


function renderFinding(finding) {
  const parts = []

  parts.push(`<div class="finding-section finding-observed">
    <div class="finding-marker"></div>
    <div class="finding-body">
      <div class="finding-label">Observed</div>
      <div class="finding-text">${esc(finding.observed || '')}</div>
    </div>
  </div>`)

  parts.push(`<div class="finding-section finding-matters">
    <div class="finding-marker"></div>
    <div class="finding-body">
      <div class="finding-label">Why It Matters</div>
      <div class="finding-text">${esc(finding.matters || '')}</div>
    </div>
  </div>`)

  if (finding.operational_implication) {
    parts.push(`<div class="finding-section finding-operational">
      <div class="finding-marker"></div>
      <div class="finding-body">
        <div class="finding-label">Operational Implication</div>
        <div class="finding-text">${esc(finding.operational_implication)}</div>
      </div>
    </div>`)
  }

  if (finding.leadership_implication) {
    parts.push(`<div class="finding-section finding-leadership">
      <div class="finding-marker"></div>
      <div class="finding-body">
        <div class="finding-label">Leadership Implication</div>
        <div class="finding-text">${esc(finding.leadership_implication)}</div>
      </div>
    </div>`)
  }

  return `<article class="finding" id="${esc(finding.finding_id)}">
    ${parts.join('\n    ')}
  </article>`
}


function renderTopologySection(capturedTopologySvg, scale) {
  return `<section class="topology-part" id="topology">
    <div class="topology-capture">
      ${capturedTopologySvg}
    </div>
    <div class="topology-stats-bar">
      <span class="topo-stat">${commaNum(scale.file_count || 0)} files</span>
      <span class="topo-sep">·</span>
      <span class="topo-stat">${commaNum(scale.total_import_edges || 0)} import edges</span>
      <span class="topo-sep">·</span>
      <span class="topo-stat">${scale.semantic_domain_count || 0} domains</span>
      <span class="topo-sep">·</span>
      <span class="topo-stat">${scale.cluster_count || 0} clusters</span>
    </div>
  </section>`
}


function renderEvidenceRecord(fullReport, qualifierClass, posture, stability, envelope, snapshotId, clientDisplay, run) {
  const rs = (fullReport && fullReport.readiness_summary) || {}
  const ts = (fullReport && fullReport.topology_summary) || {}
  const stabilityColor = STABILITY_COLORS[stability.label] || '#7a8aaa'
  const backed = ts.structurally_backed_count || 0
  const total = ts.semantic_domain_count || 0

  let html = `<section class="evidence-record" id="evidence-record">`

  html += `<div class="er-section">
    <div class="er-section-title">Structural Posture</div>
    <div class="er-posture posture-${esc(posture)}">${esc(posture)}
      <span class="er-stability" style="color:${stabilityColor};border-color:${stabilityColor};">${esc(stability.label)}</span>
    </div>
    <div class="er-grid">
      <div class="er-cell"><span class="er-key">Readiness</span><span class="er-val">${rs.score || 0} / ${esc(rs.band || '—')}</span></div>
      <div class="er-cell"><span class="er-key">Qualifier</span><span class="er-val">${esc(qualifierClass || '—')}</span></div>
      <div class="er-cell"><span class="er-key">Grounding</span><span class="er-val">${backed}/${total} domains structurally backed</span></div>
      <div class="er-cell"><span class="er-key">Snapshot</span><span class="er-val">${esc(snapshotId)}</span></div>
      <div class="er-cell"><span class="er-key">Client</span><span class="er-val">${esc(clientDisplay)}</span></div>
      <div class="er-cell"><span class="er-key">Run</span><span class="er-val">${esc(run)}</span></div>
    </div>
  </div>`

  html += `<div class="er-section">
    <div class="er-section-title">Confidence Envelope</div>
    <div class="er-envelope">`

  const axes = [envelope.grounding, envelope.continuity, envelope.visibility, envelope.postureConfidence]
  for (const axis of axes) {
    const color = CONFIDENCE_COLORS[axis.level] || '#7a8aaa'
    const pct = axis.ratio !== undefined ? Math.round(axis.ratio * 100) : null
    html += `<div class="er-envelope-row">
      <span class="er-envelope-label">${esc(axis.label)}</span>
      <span class="er-envelope-bar">${pct !== null ? renderBar(pct, color) : ''}</span>
      <span class="er-envelope-level" style="color:${color};">${esc(axis.level)}</span>
    </div>`
  }
  html += `<div class="er-envelope-row">
    <span class="er-envelope-label">${esc(envelope.interpretiveAuthority.label)}</span>
    <span class="er-envelope-bar"></span>
    <span class="er-envelope-level" style="color:#4a9eff;">${esc(envelope.interpretiveAuthority.level)}</span>
  </div>`

  html += `</div></div>`

  html += `<div class="er-section">
    <div class="er-section-title">Governance Boundary</div>
    <div class="er-governance-items">
      <div class="er-gov-item">
        <span class="er-gov-label">Methodology</span>
        <span class="er-gov-text">Structural import topology analysis — deterministic signal synthesis from dependency graph</span>
      </div>
      <div class="er-gov-item">
        <span class="er-gov-label">Evidence scope</span>
        <span class="er-gov-text">Static structural evidence snapshot — no runtime, no production, no behavioral data</span>
      </div>
      <div class="er-gov-item">
        <span class="er-gov-label">Reproducibility</span>
        <span class="er-gov-text">Same evidence produces the same findings — deterministic pipeline, no stochastic components</span>
      </div>
      <div class="er-gov-item">
        <span class="er-gov-label">Limitations</span>
        <span class="er-gov-text">Structural topology only — does not assess security, performance, code quality, or organizational effectiveness</span>
      </div>
    </div>
  </div>`

  html += `</section>`
  return html
}


function renderGovernance(governance, disclosures) {
  const gov = governance || {}
  return `<div class="governance-block">
    <div class="governance-title">Governance</div>
    <div class="governance-grid">
      <div class="governance-cell">
        <div class="governance-key">Authority Ceiling</div>
        <div class="governance-val">${esc(gov.authority_ceiling || '—')}</div>
      </div>
      <div class="governance-cell">
        <div class="governance-key">Synthesis</div>
        <div class="governance-val">Deterministic executive synthesis</div>
      </div>
      <div class="governance-cell">
        <div class="governance-key">AI Narrative</div>
        <div class="governance-val">No free-form AI narrative generated</div>
      </div>
      <div class="governance-cell">
        <div class="governance-key">Export Governance</div>
        <div class="governance-val">Runtime-generated — not manually composed</div>
      </div>
    </div>
    <div class="governance-counts">
      Prohibitions enforced: ${gov.prohibitions_enforced || 0} · Qualified: ${gov.qualified_count || 0} · Suppressed: ${gov.suppressed_count || 0}
    </div>
  </div>`
}


function renderBar(pct, color) {
  return `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color};"></div></div>`
}

function esc(str) {
  if (str === null || str === undefined) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function commaNum(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const CLIENT_DISPLAY = {
  blueedge: 'BlueEdge',
  netbox: 'NetBox',
  stackstorm: 'StackStorm',
}

function resolveClientDisplay(raw) {
  if (!raw) return ''
  const key = raw.toLowerCase().replace(/[^a-z0-9]/g, '')
  return CLIENT_DISPLAY[key] || raw.replace(/\b\w/g, c => c.toUpperCase())
}

const STABILITY_COLORS = {
  STABLE: '#64ffda', SENSITIVE: '#ffd700', TRANSITIONAL: '#ff9e4a', VOLATILE: '#ff6b6b',
}

const CONFIDENCE_COLORS = {
  HIGH: '#64ffda', MODERATE: '#ffd700', LOW: '#ff9e4a', INSUFFICIENT: '#ff6b6b',
}


const STYLES = `
  :root {
    --bg-base: #0d0f14;
    --bg-raised: #12151f;
    --bg-card: #141720;
    --bg-inset: #1a1e2b;
    --border: #2a2f40;
    --border-dim: #1e2330;
    --accent: #4a9eff;
    --accent-dim: rgba(74, 158, 255, 0.12);
    --text: #ccd6f6;
    --text-dim: #7a8aaa;
    --text-muted: #5a6580;
    --gold: #ffd700;
    --green: #64ffda;
    --orange: #ff9e4a;
    --red: #ff6b6b;
    --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Courier New', monospace;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: var(--font-body);
    background: var(--bg-base);
    color: var(--text);
    line-height: 1.7;
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 32px 64px;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Header ── */

  .report-header { margin-bottom: 48px; }
  .header-rule { width: 48px; height: 3px; background: var(--accent); margin-bottom: 24px; }
  .header-eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }
  .report-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.5px;
    line-height: 1.2;
    margin-bottom: 8px;
  }
  .report-subtitle {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-dim);
    margin-bottom: 20px;
  }
  .report-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .meta-badge {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    background: var(--bg-raised);
  }
  .meta-badge--primary { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .meta-badge--posture { font-weight: 700; }
  .posture-PROCEED { color: var(--green); border-color: var(--green); }
  .posture-INVESTIGATE { color: var(--gold); border-color: var(--gold); }
  .posture-ESCALATE { color: var(--red); border-color: var(--red); }
  .header-stats {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-muted);
    padding-top: 16px;
    border-top: 1px solid var(--border-dim);
  }
  .stat { color: var(--text-dim); }
  .stat-sep { color: var(--border); margin: 0 6px; }

  /* ── TOC ── */

  .toc {
    background: var(--bg-raised);
    border: 1px solid var(--border-dim);
    border-radius: 6px;
    padding: 24px;
    margin-bottom: 40px;
  }
  .toc-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-dim);
  }
  .toc-title {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
  }
  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 24px;
  }
  .toc-entry {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 10px;
    text-decoration: none;
    color: var(--text);
    border-radius: 4px;
    transition: background 0.15s ease;
  }
  .toc-entry:hover { background: var(--accent-dim); }
  .toc-num {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    min-width: 20px;
    padding-top: 2px;
  }
  .toc-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .toc-label { font-size: 13px; font-weight: 500; color: var(--text); line-height: 1.3; }
  .toc-count { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }

  /* ── Dividers & Parts ── */

  .report-divider {
    height: 1px;
    background: var(--border);
    margin: 56px 0 32px;
  }
  .part-header {
    margin-bottom: 40px;
    text-align: center;
  }
  .part-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
  }
  .part-title {
    font-size: 22px;
    font-weight: 600;
    color: var(--text);
  }

  /* ── Chapters ── */

  .chapter {
    margin-bottom: 56px;
    padding: 32px;
    background: var(--bg-card);
    border: 1px solid var(--border-dim);
    border-radius: 8px;
  }
  .chapter--hero {
    background: linear-gradient(180deg, rgba(74, 158, 255, 0.04) 0%, var(--bg-card) 40%);
    border-color: var(--border);
  }
  .chapter--hero .chapter-badge { background: var(--accent); color: var(--bg-base); border-color: var(--accent); }
  .chapter-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-dim);
  }
  .chapter-badge {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    min-width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--accent);
    background: var(--bg-raised);
    flex-shrink: 0;
  }
  .chapter-header-body { flex: 1; min-width: 0; }
  .chapter-title { font-size: 18px; font-weight: 600; color: var(--text); line-height: 1.3; margin-bottom: 4px; }
  .chapter-meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
  .chapter-graphic {
    margin-bottom: 24px;
    padding: 20px 16px;
    background: var(--bg-inset);
    border: 1px solid var(--border-dim);
    border-radius: 6px;
  }
  .chapter-graphic svg { display: block; max-width: 100%; height: auto; }

  /* ── Findings ── */

  .findings { display: flex; flex-direction: column; gap: 20px; }
  .finding {
    background: var(--bg-inset);
    border: 1px solid var(--border-dim);
    border-radius: 6px;
    overflow: hidden;
  }
  .finding-section {
    display: flex;
    padding: 16px 20px;
    gap: 16px;
    border-bottom: 1px solid rgba(30, 35, 48, 0.6);
  }
  .finding-section:last-child { border-bottom: none; }
  .finding-marker { width: 3px; min-height: 16px; border-radius: 2px; flex-shrink: 0; margin-top: 2px; }
  .finding-body { flex: 1; min-width: 0; }
  .finding-label {
    font-family: var(--font-mono);
    font-size: 10px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    margin-bottom: 6px;
  }
  .finding-text { font-size: 14px; line-height: 1.7; color: var(--text); }

  .finding-observed .finding-marker { background: var(--accent); }
  .finding-observed .finding-label { color: var(--accent); }
  .finding-matters .finding-marker { background: var(--gold); }
  .finding-matters .finding-label { color: var(--gold); }
  .finding-matters { background: rgba(255, 215, 0, 0.02); }
  .finding-operational .finding-marker { background: var(--green); }
  .finding-operational .finding-label { color: var(--green); }
  .finding-leadership .finding-marker { background: var(--orange); }
  .finding-leadership .finding-label { color: var(--orange); }
  .finding-leadership { background: rgba(255, 158, 74, 0.02); }

  .no-findings { font-size: 14px; color: var(--text-dim); font-style: italic; padding: 8px 0; }

  /* ── Topology ── */

  .topology-part {
    background: var(--bg-card);
    border: 1px solid var(--border-dim);
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 40px;
  }
  .topology-capture {
    background: #0a0c10;
    border: 1px solid var(--border-dim);
    border-radius: 4px;
    padding: 16px;
    overflow-x: auto;
    margin-bottom: 16px;
  }
  .topology-capture svg { width: 100%; height: auto; display: block; }
  .topology-stats-bar {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-dim);
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .topo-stat { color: var(--text-dim); }
  .topo-sep { color: var(--border); }

  /* ── Evidence Record ── */

  .evidence-record {
    background: var(--bg-card);
    border: 1px solid var(--border-dim);
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 40px;
  }
  .er-section { margin-bottom: 28px; }
  .er-section:last-child { margin-bottom: 0; }
  .er-section-title {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-dim);
    margin-bottom: 16px;
  }
  .er-posture {
    font-family: var(--font-mono);
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin-bottom: 16px;
  }
  .er-stability {
    display: inline-block;
    font-size: 10px;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border: 1px solid;
    margin-left: 12px;
    vertical-align: middle;
    font-weight: 500;
  }
  .er-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 24px;
  }
  .er-cell { display: flex; flex-direction: column; gap: 2px; }
  .er-key {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .er-val {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text);
  }
  .er-envelope { display: flex; flex-direction: column; gap: 8px; }
  .er-envelope-row {
    display: grid;
    grid-template-columns: 180px 1fr 80px;
    align-items: center;
    gap: 12px;
    padding: 8px 14px;
    background: var(--bg-raised);
  }
  .er-envelope-label {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-dim);
  }
  .er-envelope-bar { position: relative; }
  .er-envelope-level {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    text-align: right;
  }
  .bar-track {
    height: 6px;
    background: var(--border-dim);
    border-radius: 3px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }
  .er-governance-items { display: flex; flex-direction: column; gap: 8px; }
  .er-gov-item {
    padding: 10px 14px;
    background: var(--bg-raised);
    border-left: 3px solid var(--border);
  }
  .er-gov-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 4px;
    display: block;
  }
  .er-gov-text { font-size: 13px; color: var(--text); line-height: 1.6; }

  /* ── Footer / Governance ── */

  .report-footer {
    margin-top: 56px;
    padding-top: 32px;
    border-top: 1px solid var(--border-dim);
  }
  .governance-block {
    background: var(--bg-raised);
    border: 1px solid var(--border-dim);
    border-radius: 6px;
    padding: 24px;
    margin-bottom: 20px;
  }
  .governance-title {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-dim);
  }
  .governance-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .governance-key {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 2px;
  }
  .governance-val { font-size: 13px; color: var(--text); }
  .governance-counts {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    padding-top: 12px;
    border-top: 1px solid var(--border-dim);
  }
  .footer-disclosure {
    margin-bottom: 16px;
    padding: 16px;
    background: var(--bg-raised);
    border: 1px solid var(--border-dim);
    border-radius: 6px;
  }
  .disclosure-text {
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.7;
  }
  .footer-timestamp {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── Print ── */

  @media print {
    body { background: white; color: #1a1a1a; max-width: 100%; padding: 24px; }
    .chapter, .topology-part, .evidence-record { background: #fafafa; border-color: #ddd; }
    .finding { background: #f5f5f5; border-color: #e0e0e0; }
    .finding-section { border-bottom-color: #e8e8e8; }
    .finding-text { color: #1a1a1a; }
    .chapter-badge { background: #333; color: white; border-color: #333; }
    .chapter--hero .chapter-badge { background: #1a5fb4; border-color: #1a5fb4; }
    .toc { background: #fafafa; border-color: #ddd; }
    .governance-block, .footer-disclosure { background: #fafafa; border-color: #ddd; }
    .header-rule { background: #333; }
    .header-eyebrow { color: #333; }
    .meta-badge { background: #f0f0f0; border-color: #ccc; color: #333; }
    .meta-badge--primary { background: #e8f0fe; border-color: #1a5fb4; color: #1a5fb4; }
    .posture-PROCEED { color: #059669; border-color: #059669; }
    .posture-INVESTIGATE { color: #d97706; border-color: #d97706; }
    .posture-ESCALATE { color: #dc2626; border-color: #dc2626; }
    .er-posture.posture-PROCEED { color: #059669; }
    .er-posture.posture-INVESTIGATE { color: #d97706; }
    .er-posture.posture-ESCALATE { color: #dc2626; }
    .finding-marker { opacity: 0.8; }
    .topology-capture { background: #fafafa; border-color: #ddd; }
    .er-envelope-row, .er-gov-item { background: #f5f5f5; border-left-color: #ccc; }
    .bar-track { background: #e5e7eb; }
    .report-header, .toc, .chapter, .topology-part, .evidence-record, .governance-block { break-inside: avoid; }
    .part-header { break-after: avoid; }
  }

  @media (max-width: 700px) {
    body { padding: 24px 16px; }
    .toc-grid { grid-template-columns: 1fr; }
    .governance-grid { grid-template-columns: 1fr; }
    .chapter, .topology-part, .evidence-record { padding: 20px; }
    .finding-section { padding: 12px 14px; }
    .er-grid { grid-template-columns: 1fr; }
    .er-envelope-row { grid-template-columns: 1fr 1fr 60px; }
  }
`

module.exports = { buildAssessmentPackage }

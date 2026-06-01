// EIR Renderer — produces self-contained HTML from adapted EIR report.
// Deterministic: same adapted report → same HTML output (except timestamp).
// Uses the 4-part finding template: Observed → Matters → Operational → Leadership.

const { adapt } = require('./EIRAdapter')

function render(picp, context) {
  const adapted = adapt(picp, context)
  if (!adapted.ok) {
    return { ok: false, error: adapted.error }
  }
  return { ok: true, html: renderHTML(adapted.report) }
}

function renderHTML(report) {
  const chapters = report.chapters.map(ch => renderChapter(ch)).join('\n')
  const toc = renderTOC(report.chapters)
  const meta = renderMetadata(report.metadata)
  const governance = renderGovernance(report.governance, report.disclosures)
  const appendix = renderAppendix(report.appendix)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="generator" content="PI EIR Consumer — Governed Cognition Projection">
  <meta name="governance" content="DETERMINISTIC Zone A + GOVERNED Zone B (75.x) + QUALIFICATION Zone C">
  <meta name="pipeline-run" content="${esc(report.metadata.pipeline_run_id || '')}">
  <meta name="s-level" content="${esc(report.metadata.s_level || '')}">
  <meta name="q-class" content="${esc(report.metadata.q_class || '')}">
  <meta name="narrative-status" content="${esc(report.metadata.narrative_status || '')}">
  <title>${esc(report.title)}</title>
  <style>${STYLES}</style>
</head>
<body>
  <header class="report-header">
    <h1 class="report-title">${esc(report.title)}</h1>
    <div class="report-subtitle">${esc(report.subtitle || '')}</div>
    ${meta}
  </header>
  <nav class="toc">
    <div class="toc-title">CONTENTS</div>
    ${toc}
  </nav>
  <main class="report-body">
    ${chapters}
  </main>
  <section class="appendix">
    <h2 class="appendix-heading">Appendix</h2>
    ${appendix}
  </section>
  <footer class="report-footer">
    ${governance}
    <div class="footer-timestamp">Generated: ${esc(report.metadata.generated_at || '')}</div>
  </footer>
</body>
</html>`
}

function renderTOC(chapters) {
  return chapters.map(ch =>
    `<a class="toc-entry" href="#${esc(ch.chapter_id)}">
      <span class="toc-number">${ch.sequence}</span>
      <span class="toc-label">${esc(ch.chapter_label)}</span>
      <span class="toc-findings">${ch.finding_count} finding${ch.finding_count !== 1 ? 's' : ''}</span>
    </a>`
  ).join('\n')
}

function renderChapter(chapter) {
  const findings = chapter.findings.map(f => renderFinding(f)).join('\n')
  const debtDisclosure = chapter.narrative && chapter.narrative.debt_disclosure
    ? `<div class="debt-disclosure">Qualification: ${esc(chapter.narrative.debt_disclosure.ceiling_label || '')} (${esc(chapter.narrative.debt_disclosure.q_class || '')})</div>`
    : ''

  return `<section class="chapter" id="${esc(chapter.chapter_id)}">
    <h2 class="chapter-title">
      <span class="chapter-number">${chapter.sequence}</span>
      ${esc(chapter.chapter_label)}
    </h2>
    ${debtDisclosure}
    <div class="findings">
      ${findings || '<div class="no-findings">No findings derived from structural evidence.</div>'}
    </div>
    <div class="evidence-trace">
      Evidence sources: ${chapter.evidence_sources.map(s => esc(s.object_id) + ' (' + esc(s.role) + ')').join(', ')}
    </div>
  </section>`
}

function renderFinding(finding) {
  const parts = []

  parts.push(`<div class="finding-part finding-observed">
      <div class="finding-label">OBSERVED</div>
      <div class="finding-content">${esc(finding.observed || '')}</div>
    </div>`)

  parts.push(`<div class="finding-part finding-matters">
      <div class="finding-label">WHY IT MATTERS</div>
      <div class="finding-content">${esc(finding.matters || '')}</div>
    </div>`)

  if (finding.operational_implication) {
    parts.push(`<div class="finding-part finding-operational">
      <div class="finding-label">OPERATIONAL IMPLICATION</div>
      <div class="finding-content">${esc(finding.operational_implication)}</div>
    </div>`)
  }

  if (finding.leadership_implication) {
    parts.push(`<div class="finding-part finding-leadership">
      <div class="finding-label">LEADERSHIP IMPLICATION</div>
      <div class="finding-content">${esc(finding.leadership_implication)}</div>
    </div>`)
  }

  return `<div class="finding" id="${esc(finding.finding_id)}">
    ${parts.join('\n    ')}
  </div>`
}

function renderMetadata(metadata) {
  return `<div class="report-meta">
    <span class="meta-item">S-Level: <strong>${esc(metadata.s_level || '—')}</strong></span>
    <span class="meta-item">Q-Class: <strong>${esc(metadata.q_class || '—')}</strong></span>
    <span class="meta-item">Chapters: <strong>${metadata.chapter_count || 0}</strong></span>
    <span class="meta-item">Run: <strong>${esc(metadata.pipeline_run_id || '—')}</strong></span>
  </div>`
}

function renderGovernance(governance, disclosures) {
  const gov = governance || {}
  return `<div class="governance-block">
    <div class="governance-title">GOVERNANCE</div>
    <div class="governance-item">Authority ceiling: ${esc(gov.authority_ceiling || '—')}</div>
    <div class="governance-item">Zone B provider not connected</div>
    <div class="governance-item">Deterministic executive synthesis active</div>
    <div class="governance-item">No free-form AI narrative generated</div>
    <div class="governance-item">Prohibitions enforced: ${gov.prohibitions_enforced || 0}</div>
    <div class="governance-item">Qualified: ${gov.qualified_count || 0} | Suppressed: ${gov.suppressed_count || 0}</div>
    ${gov.requires_debt_disclosure ? '<div class="governance-item governance-debt">Debt disclosure required (Q-class constraint)</div>' : ''}
  </div>`
}

function renderAppendix(appendix) {
  if (!appendix) return ''
  const objects = (appendix.object_inventory || []).map(o =>
    `<tr><td>${esc(o.object_id)}</td><td>${o.field_count}</td><td>${o.populated_arrays}/${o.total_arrays}</td></tr>`
  ).join('\n')

  const summary = appendix.projection_summary || {}
  const gov = appendix.governance || {}

  return `<div class="appendix-section">
    <h3>Cognition Object Inventory</h3>
    <table class="appendix-table">
      <thead><tr><th>Object ID</th><th>Fields</th><th>Populated Arrays</th></tr></thead>
      <tbody>${objects}</tbody>
    </table>
  </div>
  <div class="appendix-section">
    <h3>Projection Summary</h3>
    <div class="appendix-detail">S-Level: ${esc(summary.s_level || '—')}</div>
    <div class="appendix-detail">Q-Class: ${esc(summary.q_class || '—')}</div>
    <div class="appendix-detail">Narrative Mode: ${esc(summary.narrative_mode || '—')}</div>
    <div class="appendix-detail">Section Count: ${summary.section_count || 0}</div>
    <div class="appendix-detail">Authority Ceiling: ${esc(gov.authority_ceiling || '—')}</div>
  </div>`
}

function esc(str) {
  if (str === null || str === undefined) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; background: #0d0f14; color: #ccd6f6; line-height: 1.6; max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
  .report-header { border-bottom: 1px solid #2a2f40; padding-bottom: 24px; margin-bottom: 32px; }
  .report-title { font-size: 24px; color: #ccd6f6; letter-spacing: 2px; text-transform: uppercase; }
  .report-subtitle { font-size: 14px; color: #7a8aaa; margin-top: 8px; }
  .report-meta { display: flex; gap: 24px; margin-top: 16px; flex-wrap: wrap; }
  .meta-item { font-size: 12px; color: #7a8aaa; }
  .meta-item strong { color: #4a9eff; }
  .toc { border: 1px solid #1e2330; padding: 16px; margin-bottom: 40px; background: #12151f; }
  .toc-title { font-size: 12px; color: #7a8aaa; letter-spacing: 2px; margin-bottom: 12px; }
  .toc-entry { display: flex; gap: 12px; padding: 4px 0; text-decoration: none; color: #ccd6f6; font-size: 13px; }
  .toc-entry:hover { color: #4a9eff; }
  .toc-number { color: #4a9eff; min-width: 24px; }
  .toc-findings { color: #7a8aaa; margin-left: auto; }
  .chapter { margin-bottom: 48px; border-top: 1px solid #2a2f40; padding-top: 24px; }
  .chapter-title { font-size: 18px; color: #ccd6f6; margin-bottom: 16px; }
  .chapter-number { color: #4a9eff; margin-right: 12px; }
  .finding { border-left: 3px solid #2a2f40; padding: 12px 16px; margin-bottom: 16px; background: #141720; }
  .finding-part { margin-bottom: 8px; }
  .finding-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #7a8aaa; margin-bottom: 2px; }
  .finding-content { font-size: 13px; color: #ccd6f6; }
  .finding-observed .finding-label { color: #4a9eff; }
  .finding-matters .finding-label { color: #ffd700; }
  .finding-operational .finding-label { color: #64ffda; }
  .finding-leadership .finding-label { color: #ff9e4a; }
  .evidence-trace { font-size: 11px; color: #7a8aaa; margin-top: 8px; border-top: 1px solid #1e2330; padding-top: 8px; }
  .debt-disclosure { font-size: 11px; color: #ffd700; margin-bottom: 8px; padding: 4px 8px; border: 1px solid #ffd70033; background: #ffd70008; }
  .no-findings { font-size: 13px; color: #7a8aaa; font-style: italic; }
  .appendix { border-top: 1px solid #2a2f40; padding-top: 24px; margin-top: 40px; }
  .appendix-heading { font-size: 18px; color: #ccd6f6; margin-bottom: 16px; }
  .appendix-section { margin-bottom: 24px; }
  .appendix-section h3 { font-size: 14px; color: #7a8aaa; letter-spacing: 1px; margin-bottom: 8px; text-transform: uppercase; }
  .appendix-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .appendix-table th { text-align: left; color: #7a8aaa; border-bottom: 1px solid #2a2f40; padding: 4px 8px; }
  .appendix-table td { padding: 4px 8px; border-bottom: 1px solid #1e2330; }
  .appendix-detail { font-size: 12px; color: #ccd6f6; margin-bottom: 4px; }
  .report-footer { border-top: 1px solid #2a2f40; padding-top: 24px; margin-top: 40px; }
  .governance-block { background: #12151f; border: 1px solid #1e2330; padding: 16px; margin-bottom: 16px; }
  .governance-title { font-size: 12px; letter-spacing: 2px; color: #7a8aaa; margin-bottom: 8px; }
  .governance-item { font-size: 12px; color: #ccd6f6; margin-bottom: 4px; }
  .governance-debt { color: #ffd700; }
  .footer-timestamp { font-size: 11px; color: #7a8aaa; }
  @media print { body { background: white; color: #1a1a1a; } .finding { border-left-color: #ccc; background: #f8f8f8; } }
`

module.exports = { render, renderHTML }

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
  const chapters = report.chapters.map((ch, i) => renderChapter(ch, i === 0)).join('\n')
  const toc = renderTOC(report.chapters)
  const meta = renderMetadata(report.metadata)
  const governance = renderGovernance(report.governance, report.disclosures)
  const appendix = renderAppendix(report.appendix)
  const totalFindings = report.chapters.reduce((s, ch) => s + ch.finding_count, 0)

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
    <div class="header-rule"></div>
    <div class="header-eyebrow">Program Intelligence</div>
    <h1 class="report-title">${esc(report.title)}</h1>
    <div class="report-subtitle">${esc(report.subtitle || '')}</div>
    ${meta}
    <div class="header-stats">
      <span class="stat">${report.metadata.chapter_count || 0} chapters</span>
      <span class="stat-sep">/</span>
      <span class="stat">${totalFindings} findings</span>
      <span class="stat-sep">/</span>
      <span class="stat">deterministic structural analysis</span>
    </div>
  </header>

  <nav class="toc">
    <div class="toc-header">
      <div class="toc-title">Contents</div>
      <div class="toc-subtitle">${report.metadata.chapter_count || 0} chapters</div>
    </div>
    <div class="toc-grid">
      ${toc}
    </div>
  </nav>

  <main class="report-body">
    ${chapters}
  </main>

  <section class="appendix">
    <div class="appendix-rule"></div>
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
      <span class="toc-num">${String(ch.sequence).padStart(2, '0')}</span>
      <span class="toc-body">
        <span class="toc-label">${esc(ch.chapter_label)}</span>
        <span class="toc-count">${ch.finding_count} finding${ch.finding_count !== 1 ? 's' : ''}</span>
      </span>
    </a>`
  ).join('\n')
}

function renderChapter(chapter, isHero) {
  const findings = chapter.findings.map((f, i) => renderFinding(f, i)).join('\n')
  const debtDisclosure = chapter.narrative && chapter.narrative.debt_disclosure
    ? `<div class="debt-disclosure">Qualification: ${esc(chapter.narrative.debt_disclosure.ceiling_label || '')} (${esc(chapter.narrative.debt_disclosure.q_class || '')})</div>`
    : ''

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
    ${debtDisclosure}
    <div class="findings">
      ${findings || '<div class="no-findings">No findings derived from structural evidence.</div>'}
    </div>
  </section>`
}

function renderFinding(finding, index) {
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

function renderMetadata(metadata) {
  return `<div class="report-meta">
    <div class="meta-badge meta-badge--primary">${esc(metadata.s_level || '—')}</div>
    <div class="meta-badge">${esc(metadata.q_class || '—')}</div>
    <div class="meta-detail">
      <span class="meta-key">Run</span>
      <span class="meta-val">${esc(metadata.pipeline_run_id || '—')}</span>
    </div>
    <div class="meta-detail">
      <span class="meta-key">Narrative</span>
      <span class="meta-val">${esc(metadata.narrative_status || '—')}</span>
    </div>
  </div>`
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
        <div class="governance-key">Narrative</div>
        <div class="governance-val">Zone B provider not connected</div>
      </div>
      <div class="governance-cell">
        <div class="governance-key">Synthesis Mode</div>
        <div class="governance-val">Deterministic executive synthesis active</div>
      </div>
      <div class="governance-cell">
        <div class="governance-key">AI Narrative</div>
        <div class="governance-val">No free-form AI narrative generated</div>
      </div>
    </div>
    <div class="governance-counts">
      Prohibitions enforced: ${gov.prohibitions_enforced || 0} · Qualified: ${gov.qualified_count || 0} · Suppressed: ${gov.suppressed_count || 0}
      ${gov.requires_debt_disclosure ? ' · <span class="governance-debt">Debt disclosure required</span>' : ''}
    </div>
  </div>`
}

function renderAppendix(appendix) {
  if (!appendix) return ''
  const objects = (appendix.object_inventory || []).map(o =>
    `<tr>
      <td><code>${esc(o.object_id)}</code></td>
      <td>${o.field_count}</td>
      <td>${o.populated_arrays}/${o.total_arrays}</td>
    </tr>`
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
    <div class="appendix-grid">
      <div class="appendix-cell"><span class="appendix-key">S-Level</span> ${esc(summary.s_level || '—')}</div>
      <div class="appendix-cell"><span class="appendix-key">Q-Class</span> ${esc(summary.q_class || '—')}</div>
      <div class="appendix-cell"><span class="appendix-key">Narrative Mode</span> ${esc(summary.narrative_mode || '—')}</div>
      <div class="appendix-cell"><span class="appendix-key">Sections</span> ${summary.section_count || 0}</div>
      <div class="appendix-cell"><span class="appendix-key">Authority Ceiling</span> ${esc(gov.authority_ceiling || '—')}</div>
    </div>
  </div>`
}

function esc(str) {
  if (str === null || str === undefined) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
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

  .report-header {
    margin-bottom: 48px;
  }
  .header-rule {
    width: 48px; height: 3px;
    background: var(--accent);
    margin-bottom: 24px;
  }
  .header-eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }
  .report-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.5px;
    line-height: 1.2;
    margin-bottom: 8px;
  }
  .report-subtitle {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-dim);
    margin-bottom: 20px;
  }
  .report-meta {
    display: flex;
    align-items: center;
    gap: 16px;
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
  .meta-badge--primary {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-dim);
  }
  .meta-detail {
    font-size: 12px;
    color: var(--text-dim);
  }
  .meta-key {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-right: 6px;
  }
  .meta-val {
    font-family: var(--font-mono);
    color: var(--text-dim);
  }
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
    margin-bottom: 56px;
  }
  .toc-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
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
  .toc-subtitle {
    font-size: 12px;
    color: var(--text-muted);
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
  .toc-entry:hover {
    background: var(--accent-dim);
  }
  .toc-num {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    min-width: 20px;
    padding-top: 2px;
  }
  .toc-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .toc-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    line-height: 1.3;
  }
  .toc-count {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── Chapters ── */

  .chapter {
    margin-bottom: 64px;
    padding: 32px;
    background: var(--bg-card);
    border: 1px solid var(--border-dim);
    border-radius: 8px;
    position: relative;
  }
  .chapter--hero {
    background: linear-gradient(180deg, rgba(74, 158, 255, 0.04) 0%, var(--bg-card) 40%);
    border-color: var(--border);
  }
  .chapter--hero .chapter-badge {
    background: var(--accent);
    color: var(--bg-base);
    border-color: var(--accent);
  }
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
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--accent);
    background: var(--bg-raised);
    flex-shrink: 0;
  }
  .chapter-header-body { flex: 1; min-width: 0; }
  .chapter-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
    margin-bottom: 4px;
  }
  .chapter-meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── Chapter Graphics ── */

  .chapter-graphic {
    margin-bottom: 24px;
    padding: 20px 16px;
    background: var(--bg-inset);
    border: 1px solid var(--border-dim);
    border-radius: 6px;
  }
  .chapter-graphic svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  /* ── Findings ── */

  .findings {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
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
  .finding-section:last-child {
    border-bottom: none;
  }
  .finding-marker {
    width: 3px;
    min-height: 16px;
    border-radius: 2px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .finding-body { flex: 1; min-width: 0; }
  .finding-label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .finding-text {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text);
  }

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

  .no-findings {
    font-size: 14px;
    color: var(--text-dim);
    font-style: italic;
    padding: 8px 0;
  }

  .debt-disclosure {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--gold);
    margin-bottom: 16px;
    padding: 8px 12px;
    border: 1px solid rgba(255, 215, 0, 0.15);
    border-radius: 4px;
    background: rgba(255, 215, 0, 0.04);
  }

  /* ── Appendix ── */

  .appendix {
    margin-top: 56px;
    padding: 32px;
    background: var(--bg-raised);
    border: 1px solid var(--border-dim);
    border-radius: 8px;
  }
  .appendix-rule {
    display: none;
  }
  .appendix-heading {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-dim);
  }
  .appendix-section {
    margin-bottom: 28px;
  }
  .appendix-section:last-child { margin-bottom: 0; }
  .appendix-section h3 {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
  }
  .appendix-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .appendix-table th {
    text-align: left;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    padding: 8px 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .appendix-table td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border-dim);
    color: var(--text);
  }
  .appendix-table code {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--accent);
  }
  .appendix-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }
  .appendix-cell {
    font-size: 13px;
    color: var(--text);
  }
  .appendix-key {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    display: block;
    margin-bottom: 2px;
  }

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
  .governance-cell { }
  .governance-key {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 2px;
  }
  .governance-val {
    font-size: 13px;
    color: var(--text);
  }
  .governance-counts {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    padding-top: 12px;
    border-top: 1px solid var(--border-dim);
  }
  .governance-debt { color: var(--gold); }
  .footer-timestamp {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── Print ── */

  @media print {
    body { background: white; color: #1a1a1a; max-width: 100%; padding: 24px; }
    .chapter { background: #fafafa; border-color: #ddd; }
    .finding { background: #f5f5f5; border-color: #e0e0e0; }
    .finding-section { border-bottom-color: #e8e8e8; }
    .finding-text { color: #1a1a1a; }
    .chapter-badge { background: #333; color: white; border-color: #333; }
    .chapter--hero .chapter-badge { background: #1a5fb4; border-color: #1a5fb4; }
    .toc { background: #fafafa; border-color: #ddd; }
    .appendix { background: #fafafa; border-color: #ddd; }
    .governance-block { background: #fafafa; border-color: #ddd; }
    .header-rule { background: #333; }
    .header-eyebrow { color: #333; }
    .meta-badge { background: #f0f0f0; border-color: #ccc; color: #333; }
    .meta-badge--primary { background: #e8f0fe; border-color: #1a5fb4; color: #1a5fb4; }
    .finding-marker { opacity: 0.8; }
    .report-header, .toc, .chapter, .appendix, .governance-block { break-inside: avoid; }
  }

  @media (max-width: 700px) {
    body { padding: 24px 16px; }
    .toc-grid { grid-template-columns: 1fr; }
    .governance-grid { grid-template-columns: 1fr; }
    .chapter { padding: 20px; }
    .finding-section { padding: 12px 14px; }
  }
`

module.exports = { render, renderHTML }

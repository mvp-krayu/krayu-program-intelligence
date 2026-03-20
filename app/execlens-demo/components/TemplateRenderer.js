/**
 * TemplateRenderer.js
 * PIOS-42.5-RUN01-CONTRACT-v1 (rendering only — no data mutation)
 *
 * Renders the template_section from the 42.4 adapter as a structured,
 * executive-grade intelligence panel.
 *
 * Governance rules:
 *   - exact text preserved verbatim — no rewriting, no shortening, no omission
 *   - wiki-links resolved only via governed navigation mapping from adapter
 *   - numeric highlighting is presentation only — no value extraction
 *   - if any section parse fails, falls back to raw text block
 *   - unresolved links remain explicitly unresolved — never silently hidden
 */

import { useMemo } from 'react'
import {
  parseTemplateSections,
  parseMarkdownTable,
  parseDrilldown,
  parseConfidencePrefix,
  linkToLabel,
  buildNavLookup,
  tokenizeRichText,
} from '../utils/templateParser'

// ---------------------------------------------------------------------------
// Obsidian link builder (same formula as NavigationPanel — G7 consistency)
// ---------------------------------------------------------------------------

function buildObsidianLink(vaultName, path) {
  if (!vaultName || !path) return null
  return `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(path.replace(/\.md$/, ''))}`
}

// ---------------------------------------------------------------------------
// WikiChip — renders a single [[link]] token
// Resolution via governed navigation mapping only.
// ---------------------------------------------------------------------------

function WikiChip({ link, navLookup, vaultName }) {
  const label = linkToLabel(link)
  const navEntry = navLookup[link]

  if (!navEntry) {
    // Link not in navigation payload — render as neutral label (not a resolution failure)
    return <span className="wiki-chip wiki-chip-neutral" title={`[[${link}]]`}>{label}</span>
  }

  if (!navEntry.resolved) {
    return (
      <span className="wiki-chip wiki-chip-unresolved" title={`[[${link}]] — UNRESOLVED in vault`}>
        ⚠ {label}
      </span>
    )
  }

  const href = buildObsidianLink(vaultName, navEntry.path)
  if (href) {
    return (
      <a className="wiki-chip wiki-chip-resolved" href={href} title={navEntry.path}>
        {label} <span className="wiki-chip-arrow">↗</span>
      </a>
    )
  }

  return (
    <span className="wiki-chip wiki-chip-resolved" title={navEntry.path}>
      {label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// RichText — renders a string with inline tokens:
//   [[wiki-links]] → WikiChip
//   SIG-NNN        → styled reference badge
//   numeric values → subtle highlight
//   plain text     → as-is
// ---------------------------------------------------------------------------

function RichText({ text, navLookup, vaultName }) {
  const tokens = useMemo(() => tokenizeRichText(text), [text])

  return (
    <>
      {tokens.map((tok, i) => {
        switch (tok.type) {
          case 'wiki':
            return <WikiChip key={i} link={tok.value} navLookup={navLookup} vaultName={vaultName} />
          case 'sig':
            return <span key={i} className="sig-ref">{tok.value}</span>
          case 'numeric':
            return <span key={i} className="numeric-highlight">{tok.value}</span>
          case 'text':
          default:
            return <span key={i}>{tok.value}</span>
        }
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
// RichParagraphs — splits text into paragraphs, renders each with RichText
// ---------------------------------------------------------------------------

function RichParagraphs({ text, navLookup, vaultName, className }) {
  const paras = useMemo(
    () => text.split(/\n\n+/).map(p => p.trim()).filter(Boolean),
    [text]
  )
  return (
    <>
      {paras.map((para, i) => (
        <p key={i} className={className || 'tr-para'}>
          <RichText text={para} navLookup={navLookup} vaultName={vaultName} />
        </p>
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({ label, children, accent }) {
  return (
    <div className={`tr-section ${accent ? 'tr-section-accent' : ''}`}>
      <div className="tr-section-label">{label}</div>
      <div className="tr-section-body">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Answer section
// ---------------------------------------------------------------------------

function AnswerSection({ text, navLookup, vaultName }) {
  return (
    <Section label="Answer" accent>
      <RichParagraphs
        text={text}
        navLookup={navLookup}
        vaultName={vaultName}
        className="tr-answer-para"
      />
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Key Signals — markdown table → HTML table
// Confidence values in table are styled per level.
// Falls back to raw text if table parse fails.
// ---------------------------------------------------------------------------

const CONF_COLOR = { STRONG: 'var(--strong)', MODERATE: 'var(--moderate)', WEAK: 'var(--weak)' }

function SignalsTableSection({ text }) {
  const parsed = useMemo(() => parseMarkdownTable(text), [text])

  if (!parsed) {
    // Graceful fallback — preserve content as raw text
    return (
      <Section label="Key Signals">
        <pre className="tr-fallback-text">{text}</pre>
      </Section>
    )
  }

  return (
    <Section label="Key Signals">
      <div className="tr-table-wrap">
        <table className="tr-table">
          <thead>
            <tr>
              {parsed.headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsed.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const upper = cell.toUpperCase()
                  const isConf = CONF_COLOR[upper]
                  return (
                    <td key={ci}>
                      {isConf ? (
                        <span className="tr-table-conf" style={{ color: CONF_COLOR[upper] }}>
                          {cell}
                        </span>
                      ) : (
                        ci === 0
                          ? <span className="tr-table-sig-id">{cell}</span>
                          : cell
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Why this matters section
// ---------------------------------------------------------------------------

function WhySection({ text, navLookup, vaultName }) {
  return (
    <Section label="Why this matters">
      <RichParagraphs text={text} navLookup={navLookup} vaultName={vaultName} className="tr-para" />
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Evidence Confidence section
// Detects STRONG/MODERATE/WEAK prefix and renders as styled block.
// Falls back to plain rendering if prefix not detected.
// ---------------------------------------------------------------------------

function ConfidenceSection({ text }) {
  const parsed = useMemo(() => parseConfidencePrefix(text), [text])

  if (!parsed) {
    return (
      <Section label="Evidence Confidence">
        <p className="tr-para">{text}</p>
      </Section>
    )
  }

  return (
    <Section label="Evidence Confidence">
      <div className="tr-confidence-block">
        <span className={`tr-confidence-level conf-${parsed.level}`}>
          {parsed.level}
        </span>
        <span className="tr-confidence-dash">—</span>
        <span className="tr-confidence-body">{parsed.body}</span>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Drill-down section
// Parses Domain / Capability / Components groups with WikiChip rendering.
// Falls back to raw text if parse yields no groups.
// ---------------------------------------------------------------------------

function DrilldownSection({ text, navLookup, vaultName }) {
  const parsed = useMemo(() => parseDrilldown(text), [text])
  const hasContent =
    parsed.domain.length > 0 || parsed.capability.length > 0 || parsed.components.length > 0

  if (!hasContent) {
    // Graceful fallback
    return (
      <Section label="Drill-down">
        <pre className="tr-fallback-text">{text}</pre>
      </Section>
    )
  }

  return (
    <Section label="Drill-down">
      <div className="tr-drilldown">
        {parsed.domain.length > 0 && (
          <div className="tr-drilldown-group">
            <div className="tr-drilldown-group-label">Domain</div>
            <div className="tr-drilldown-chips">
              {parsed.domain.map(link => (
                <WikiChip key={link} link={link} navLookup={navLookup} vaultName={vaultName} />
              ))}
            </div>
          </div>
        )}
        {parsed.capability.length > 0 && (
          <div className="tr-drilldown-group">
            <div className="tr-drilldown-group-label">Capability</div>
            <div className="tr-drilldown-chips">
              {parsed.capability.map(link => (
                <WikiChip key={link} link={link} navLookup={navLookup} vaultName={vaultName} />
              ))}
            </div>
          </div>
        )}
        {parsed.components.length > 0 && (
          <div className="tr-drilldown-group">
            <div className="tr-drilldown-group-label">Components</div>
            <div className="tr-drilldown-chips">
              {parsed.components.map(link => (
                <WikiChip key={link} link={link} navLookup={navLookup} vaultName={vaultName} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// TemplateRenderer — main export
// Parses template_section and renders structured sections.
// Falls back to raw pre block if no sections can be parsed.
// ---------------------------------------------------------------------------

export default function TemplateRenderer({ templateSection, navigation, queryId }) {
  const vaultName = process.env.NEXT_PUBLIC_OBSIDIAN_VAULT_NAME || null

  const navLookup = useMemo(
    () => buildNavLookup(navigation),
    [navigation]
  )

  const sections = useMemo(
    () => parseTemplateSections(templateSection),
    [templateSection]
  )

  const hasSections = Object.keys(sections).length > 0

  if (!templateSection) return null

  return (
    <div className="tr-root panel">
      <div className="tr-header">
        <div className="panel-title">
          Intelligence Response
          <span className="tr-source-label">
            source: query_response_templates.md § {queryId}
          </span>
        </div>
      </div>

      {hasSections ? (
        <div className="tr-sections">
          {sections['Answer (Executive)'] && (
            <AnswerSection
              text={sections['Answer (Executive)']}
              navLookup={navLookup}
              vaultName={vaultName}
            />
          )}
          {sections['Key Signals'] && (
            <SignalsTableSection text={sections['Key Signals']} />
          )}
          {sections['Why this matters'] && (
            <WhySection
              text={sections['Why this matters']}
              navLookup={navLookup}
              vaultName={vaultName}
            />
          )}
          {sections['Evidence Confidence'] && (
            <ConfidenceSection text={sections['Evidence Confidence']} />
          )}
          {sections['Drill-down'] && (
            <DrilldownSection
              text={sections['Drill-down']}
              navLookup={navLookup}
              vaultName={vaultName}
            />
          )}
        </div>
      ) : (
        // Full fallback — preserve raw content if section parse yields nothing
        <pre className="template-text">{templateSection}</pre>
      )}
    </div>
  )
}

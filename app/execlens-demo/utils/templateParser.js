/**
 * templateParser.js
 * PIOS-42.5-RUN01-CONTRACT-v1 (rendering helper — no data mutation)
 *
 * Pure parsing utilities for template_section content from the 42.4 adapter.
 * No values are created, altered, or inferred here.
 * All functions are deterministic: same input → same output.
 *
 * Section structure (from query_response_templates.md):
 *   ## GQ-NNN — <question>
 *   **Answer (Executive)**   <text>
 *   **Key Signals**          <markdown table>
 *   **Why this matters**     <text>
 *   **Evidence Confidence**  LEVEL — <text>
 *   **Drill-down**           <structured list with [[wiki-links]]>
 *   ---
 */

export const SECTION_NAMES = [
  'Answer (Executive)',
  'Key Signals',
  'Why this matters',
  'Evidence Confidence',
  'Drill-down',
]

// ---------------------------------------------------------------------------
// Section parser
// Splits template_section into named content blocks.
// Preserves exact text; returns {} on any failure.
// ---------------------------------------------------------------------------

export function parseTemplateSections(text) {
  if (!text || typeof text !== 'string') return {}

  try {
    const positions = []
    for (const name of SECTION_NAMES) {
      const marker = `**${name}**`
      const idx = text.indexOf(marker)
      if (idx !== -1) {
        positions.push({ name, idx, markerEnd: idx + marker.length })
      }
    }
    positions.sort((a, b) => a.idx - b.idx)

    const sections = {}
    for (let i = 0; i < positions.length; i++) {
      const { name, markerEnd } = positions[i]
      const nextIdx = i + 1 < positions.length ? positions[i + 1].idx : text.length
      sections[name] = text.slice(markerEnd, nextIdx).replace(/\n?---\s*$/, '').trim()
    }
    return sections
  } catch (_) {
    return {}
  }
}

// ---------------------------------------------------------------------------
// Markdown table parser
// Returns { headers: string[], rows: string[][] } or null on failure.
// Fail-safe: returns null rather than throwing.
// ---------------------------------------------------------------------------

export function parseMarkdownTable(text) {
  if (!text) return null
  try {
    const lines = text.trim().split('\n').filter(Boolean)
    if (lines.length < 3) return null

    const isSeparator = line => /^\|[\s\-:|]+\|$/.test(line.trim())
    if (!isSeparator(lines[1])) return null

    const parseRow = line =>
      line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())

    const headers = parseRow(lines[0])
    const rows = lines.slice(2).map(parseRow)
    if (headers.length < 2) return null

    return { headers, rows }
  } catch (_) {
    return null
  }
}

// ---------------------------------------------------------------------------
// Wiki-link extractor
// Finds all [[target]] tokens in a string.
// Returns array of { original: '[[X]]', link: 'X' }
// ---------------------------------------------------------------------------

export function extractWikiLinks(text) {
  if (!text) return []
  const results = []
  const re = /\[\[([^\]]+)\]\]/g
  let m
  while ((m = re.exec(text)) !== null) {
    results.push({ original: m[0], link: m[1] })
  }
  return results
}

// ---------------------------------------------------------------------------
// Drill-down parser
// Parses the Drill-down section into { domain, capability, components }
// where each value is an array of link strings (no [[...]] brackets).
// ---------------------------------------------------------------------------

export function parseDrilldown(text) {
  if (!text) return { domain: [], capability: [], components: [] }

  const result = { domain: [], capability: [], components: [] }
  const lines = text.split('\n')
  let inComponents = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('-')) {
      // Non-bullet: reset components mode
      if (trimmed !== '') inComponents = false
      continue
    }

    const content = trimmed.slice(1).trim()
    if (content.toLowerCase().startsWith('domain:')) {
      result.domain = extractWikiLinks(content).map(w => w.link)
      inComponents = false
    } else if (content.toLowerCase().startsWith('capability:')) {
      result.capability = extractWikiLinks(content).map(w => w.link)
      inComponents = false
    } else if (content.toLowerCase().startsWith('components:')) {
      inComponents = true
    } else if (inComponents) {
      // Sub-bullet component items
      const links = extractWikiLinks(content).map(w => w.link)
      result.components.push(...links)
    }
  }

  return result
}

// ---------------------------------------------------------------------------
// Evidence confidence prefix parser
// "STRONG — explanation text" → { level: 'STRONG', text: 'explanation text' }
// Returns null if the confidence level cannot be detected.
// ---------------------------------------------------------------------------

const CONF_LEVELS = ['STRONG', 'MODERATE', 'WEAK']

export function parseConfidencePrefix(text) {
  if (!text) return null
  const upper = text.trimStart().toUpperCase()
  for (const level of CONF_LEVELS) {
    if (upper.startsWith(level)) {
      // Accept "LEVEL —" or "LEVEL -" or "LEVEL:"
      const afterLevel = text.trimStart().slice(level.length).trimStart()
      const body = afterLevel.replace(/^[\u2014\-:]\s*/, '').trim()
      return { level, body }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Human-readable label from wiki-link target
// D_10_Platform_Infrastructure_and_Data → "Platform Infrastructure and Data"
// C_27_Caching_Layer → "Caching Layer"
// CMP_64_RedisCacheModule → "RedisCacheModule"
// ---------------------------------------------------------------------------

export function linkToLabel(link) {
  return link
    .replace(/^D_\d+_/, '')
    .replace(/^C_\d+_/, '')
    .replace(/^CMP_\d+_/, '')
    .replace(/_/g, ' ')
    .trim()
}

// ---------------------------------------------------------------------------
// Navigation lookup builder
// navigation[] from adapter → { linkName: navEntry }
// ---------------------------------------------------------------------------

export function buildNavLookup(navigation) {
  const lookup = {}
  if (!Array.isArray(navigation)) return lookup
  for (const nb of navigation) {
    if (nb && nb.link) lookup[nb.link] = nb
  }
  return lookup
}

// ---------------------------------------------------------------------------
// Rich text tokenizer
// Splits text into typed tokens for inline rendering.
// Types: 'wiki' | 'sig' | 'numeric' | 'text'
// Deterministic: same text → same token sequence.
// ---------------------------------------------------------------------------

export function tokenizeRichText(text) {
  if (!text) return []

  // Order matters: wiki-links first, then SIG refs, then numeric values
  const TOKEN_RE = /(\[\[[^\]]+\]\]|\bSIG-\d{3,}\b|\b\d+\.\d+%?|\b\d+%)/g

  const tokens = []
  let lastIdx = 0
  let m

  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > lastIdx) {
      tokens.push({ type: 'text', value: text.slice(lastIdx, m.index) })
    }

    const val = m[0]
    if (val.startsWith('[[')) {
      const link = val.slice(2, -2)
      tokens.push({ type: 'wiki', value: link })
    } else if (val.startsWith('SIG-')) {
      tokens.push({ type: 'sig', value: val })
    } else {
      tokens.push({ type: 'numeric', value: val })
    }

    lastIdx = m.index + val.length
  }

  if (lastIdx < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIdx) })
  }

  return tokens
}

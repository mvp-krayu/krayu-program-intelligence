/**
 * components/lens/RiskPanel.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.UI.POLISH.01
 *
 * Decision conditions surface — renamed and polished from "Risk & Conditions".
 * Normalizes caveats (removes internal identifiers), deduplicates, and
 * groups into three business-readable categories.
 *
 * Consumes ZONE-2 projection payloads only.
 */

// Caveat normalization — same transforms as lens_report_generator.py
// Required because ZONE-2 payload caveats may contain internal identifiers
// (CONCEPT-XX, BC-XX, chain notation) that must not appear in the UI surface.

const EXACT_TRANSFORMS = {
  'CONCEPT-06 predicate uses PHASE_1_ACTIVE — will not match NOT_EVALUATED on recomputed run. EXECUTION verdict may not correctly show UNKNOWN on Stream 10 schema. Must be fixed before LENS surface.':
    'Execution readiness verdict requires a configuration update before it can be automatically derived. Currently confirmed as pending assessment.',

  'CONCEPT-06 predicate mismatch (BC-01): EXECUTION verdict cannot be automatically derived until the predicate in concepts.json is updated to include NOT_EVALUATED. Manually confirmed as UNKNOWN based on execution_status=NOT_EVALUATED.':
    'Execution readiness verdict is manually confirmed as pending assessment. This condition resolves upon a targeted configuration update.',

  'Four-layer chain (SIG-006 → COND-006 → DIAG-006 → INTEL-001). Runtime throughput is not measured; ceiling is static configuration only.':
    'Runtime throughput is not measured; the configured capacity ceiling requires live validation to confirm operational performance.',
}

const ID_PATTERNS = [
  [/\bSIG-\d+\b/g,    '[signal reference]'],
  [/\bCOND-\d+\b/g,   '[condition reference]'],
  [/\bDIAG-\d+\b/g,   '[diagnostic reference]'],
  [/\bINTEL-\d+\b/g,  '[intelligence reference]'],
  [/\bCONCEPT-\d+\b/g,'[predicate condition]'],
  [/\bBC-\d+\b/g,      '[blocking condition]'],
  [/PHASE_\w+/g,       '[phase condition]'],
  [/NOT_EVALUATED/g,   'pending assessment'],
  [/execution_status=\w+/g, 'execution status'],
  [/concepts\.json/g,  '[configuration file]'],
  [/Stream \d+/g,      '[schema version]'],
]

function normalizeCaveat(text) {
  const exact = EXACT_TRANSFORMS[text.trim()]
  if (exact) return exact
  let out = text
  for (const [pattern, replacement] of ID_PATTERNS) {
    out = out.replace(pattern, replacement)
  }
  return out
}

// Categorize a normalized caveat into a decision condition type
function categorize(text) {
  const t = text.toLowerCase()
  if (t.includes('configuration') || t.includes('verdict') || t.includes('predicate')) {
    return 'Validation Condition'
  }
  if (t.includes('throughput') || t.includes('runtime') || t.includes('live') || t.includes('observable')) {
    return 'Observability Condition'
  }
  return 'Confidence Condition'
}

function collectConditions(payloads) {
  const seen   = new Set()
  const result = []

  for (const p of payloads) {
    if (!p || p.error_type || p.zone !== 'ZONE-2') continue
    for (const raw of (p.caveats || [])) {
      const normalized = normalizeCaveat(raw.trim())
      const key = normalized.trim().toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        result.push({ text: normalized, category: categorize(normalized) })
      }
    }
  }

  return result
}

export default function RiskPanel({ payloads }) {
  if (!payloads || payloads.length === 0) return null

  const conditions = collectConditions(payloads)

  return (
    <div className="lens-risk-panel">
      <div className="lens-panel-label">DECISION CONDITIONS</div>

      {conditions.length === 0 ? (
        <div className="lens-risk-empty">No active conditions.</div>
      ) : (
        <div className="lens-risk-list">
          {conditions.map((c, i) => (
            <div key={i} className="lens-risk-row">
              <span className="lens-risk-tag">{c.category}</span>
              <span className="lens-risk-text">{c.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

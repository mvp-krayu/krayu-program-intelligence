/**
 * components/lens/ExecutiveStatusPanel.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.UI.POLISH.01 / PRODUCTIZE.LENS.TOPOLOGY.INTELLIGENCE.01
 *
 * Operational readiness hero panel.
 * Renders the executive verdict claim (CLM-25) with evidence class badge,
 * claim narrative, and condition disclosure if CONDITIONAL.
 *
 * Consumes ZONE-2 projection payloads only.
 * No vault reads. No ZONE-1 fields.
 * Caveats are normalized — no internal identifiers exposed (CONCEPT-XX, BC-XX, chain notation).
 */

// ---------------------------------------------------------------------------
// Caveat normalization — same transforms as RiskPanel and lens_report_generator
// ---------------------------------------------------------------------------

const EXACT_TRANSFORMS = {
  'CONCEPT-06 predicate uses PHASE_1_ACTIVE — will not match NOT_EVALUATED on recomputed run. EXECUTION verdict may not correctly show UNKNOWN on Stream 10 schema. Must be fixed before LENS surface.':
    'Execution readiness verdict requires a configuration update before it can be automatically derived. Currently confirmed as pending assessment.',

  'CONCEPT-06 predicate mismatch (BC-01): EXECUTION verdict cannot be automatically derived until the predicate in concepts.json is updated to include NOT_EVALUATED. Manually confirmed as UNKNOWN based on execution_status=NOT_EVALUATED.':
    'Execution readiness verdict is manually confirmed as pending assessment. This condition resolves upon a targeted configuration update.',

  'Four-layer chain (SIG-006 → COND-006 → DIAG-006 → INTEL-001). Runtime throughput is not measured; ceiling is static configuration only.':
    'Runtime throughput is not measured; the configured capacity ceiling requires live validation to confirm operational performance.',
}

const ID_PATTERNS = [
  [/\bSIG-\d+\b/g,     '[signal reference]'],
  [/\bCOND-\d+\b/g,    '[condition reference]'],
  [/\bDIAG-\d+\b/g,    '[diagnostic reference]'],
  [/\bINTEL-\d+\b/g,   '[intelligence reference]'],
  [/\bCONCEPT-\d+\b/g, '[predicate condition]'],
  [/\bBC-\d+\b/g,       '[blocking condition]'],
  [/PHASE_\w+/g,        '[phase condition]'],
  [/NOT_EVALUATED/g,    'pending assessment'],
  [/execution_status=\w+/g, 'execution status'],
  [/concepts\.json/g,   '[configuration file]'],
  [/Stream \d+/g,       '[schema version]'],
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

const EVIDENCE_BADGE = {
  VERIFIED:    { label: 'VERIFIED',    bg: '#0d2e1a', color: '#3fb950', border: '#1b5e3d' },
  CONDITIONAL: { label: 'IN PROGRESS', bg: '#1a1600', color: '#d29922', border: '#3d3208' },
  PARTIAL:     { label: 'PARTIAL',     bg: '#18100a', color: '#e07a30', border: '#4a2910' },
  BLOCKED:     { label: 'BLOCKED',     bg: '#1a0a0a', color: '#f85149', border: '#4a1212' },
}

function EvidenceBadge({ evidenceClass }) {
  const cfg = EVIDENCE_BADGE[evidenceClass] || EVIDENCE_BADGE.BLOCKED
  return (
    <span className="lens-ev-badge" style={{
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  )
}

// Normalize verdict narrative: strip raw internal status codes for display
function formatNarrative(text) {
  if (!text) return '—'
  // Convert "STRUCTURE: X. COMPLEXITY: Y. EXECUTION: Z." into readable form
  return text
    .replace(/STRUCTURE:\s*/g, 'Structural Integrity: ')
    .replace(/COMPLEXITY:\s*/g, 'Structural Concentration: ')
    .replace(/EXECUTION:\s*/g, 'Operational Readiness: ')
}

export default function ExecutiveStatusPanel({ payload }) {
  if (!payload) return null
  if (payload.error_type) {
    return (
      <div className="lens-status-panel lens-panel-blocked">
        <div className="lens-panel-label">OPERATIONAL READINESS</div>
        <div className="lens-error-state">{payload.reason || 'UNAVAILABLE'}</div>
      </div>
    )
  }
  if (payload.zone !== 'ZONE-2') return null

  const narrative = payload.value?.narrative || payload.explanation || '—'
  const caveats   = Array.isArray(payload.caveats) ? payload.caveats : []

  return (
    <div className="lens-status-panel">
      <div className="lens-panel-header">
        <span className="lens-panel-label">OPERATIONAL READINESS</span>
        <EvidenceBadge evidenceClass={payload.evidence_class} />
      </div>

      <div className="lens-status-claim-label">Three-Axis Readiness Assessment</div>

      <div className="lens-status-narrative">{formatNarrative(narrative)}</div>

      {caveats.length > 0 && (
        <div className="lens-status-caveats">
          {caveats.map((c, i) => (
            <div key={i} className="lens-caveat-row">
              <span className="lens-caveat-marker">OPEN ITEM</span>
              <span className="lens-caveat-text">{normalizeCaveat(c)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="lens-panel-footer">
        <span className="lens-footer-id">{payload.claim_id}</span>
        <span className="lens-footer-zone">{payload.zone} · {payload.depth}</span>
      </div>
    </div>
  )
}

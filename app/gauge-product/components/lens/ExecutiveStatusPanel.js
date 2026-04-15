/**
 * components/lens/ExecutiveStatusPanel.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.UI.POLISH.01
 *
 * Operational readiness hero panel.
 * Renders the executive verdict claim (CLM-25) with evidence class badge,
 * claim narrative, and condition disclosure if CONDITIONAL.
 *
 * Consumes ZONE-2 projection payloads only.
 * No vault reads. No ZONE-1 fields.
 */

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
              <span className="lens-caveat-text">{c}</span>
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

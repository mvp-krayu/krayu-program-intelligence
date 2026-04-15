/**
 * components/lens/StabilityComposition.js
 * PRODUCTIZE.LENS.UI.01
 *
 * Stability / confidence composition bar for LENS v1.
 * Takes an array of ZONE-2 payloads and renders a horizontal bar
 * divided proportionally by evidence_class.
 *
 * VERIFIED=green  CONDITIONAL=yellow  PARTIAL=orange  BLOCKED=red
 *
 * Consumes ZONE-2 projection payloads only.
 */

const CLASS_CONFIG = {
  VERIFIED:    { color: '#3fb950', label: 'VERIFIED' },
  CONDITIONAL: { color: '#d29922', label: 'CONDITIONAL' },
  PARTIAL:     { color: '#e07a30', label: 'PARTIAL' },
  BLOCKED:     { color: '#f85149', label: 'BLOCKED' },
}

function buildSegments(payloads) {
  const counts = { VERIFIED: 0, CONDITIONAL: 0, PARTIAL: 0, BLOCKED: 0 }
  let total = 0
  for (const p of payloads) {
    if (!p || p.error_type || p.zone !== 'ZONE-2') continue
    const ec = p.evidence_class
    if (ec in counts) { counts[ec]++; total++ }
  }
  if (total === 0) return []
  return Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([ec, n]) => ({ ec, pct: Math.round((n / total) * 100), count: n }))
}

export default function StabilityComposition({ payloads }) {
  if (!payloads || payloads.length === 0) return null

  const segments = buildSegments(payloads)
  if (segments.length === 0) return null

  return (
    <div className="lens-stability-panel">
      <div className="lens-panel-label">EVIDENCE COMPOSITION</div>

      <div className="lens-stability-bar">
        {segments.map(({ ec, pct }) => (
          <div
            key={ec}
            className="lens-stability-segment"
            title={`${ec}: ${pct}%`}
            style={{ width: `${pct}%`, background: CLASS_CONFIG[ec]?.color || '#555' }}
          />
        ))}
      </div>

      <div className="lens-stability-legend">
        {segments.map(({ ec, pct, count }) => {
          const cfg = CLASS_CONFIG[ec] || { color: '#555', label: ec }
          return (
            <div key={ec} className="lens-stability-legend-item">
              <span className="lens-stability-dot" style={{ background: cfg.color }} />
              <span className="lens-stability-legend-label">{cfg.label}</span>
              <span className="lens-stability-legend-count">{count} ({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

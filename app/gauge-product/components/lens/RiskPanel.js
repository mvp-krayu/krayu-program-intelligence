/**
 * components/lens/RiskPanel.js
 * PRODUCTIZE.LENS.UI.01
 *
 * Risk / caveat surface for LENS v1.
 * Collects caveats from all ZONE-2 payloads, deduplicates,
 * and renders as tagged caveat list.
 *
 * Consumes ZONE-2 projection payloads only.
 */

function collectCaveats(payloads) {
  const seen = new Set()
  const result = []
  for (const p of payloads) {
    if (!p || p.error_type || p.zone !== 'ZONE-2') continue
    const caveats = Array.isArray(p.caveats) ? p.caveats : []
    for (const c of caveats) {
      const key = c.trim().toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        result.push({ text: c.trim(), claimId: p.claim_id })
      }
    }
  }
  return result
}

export default function RiskPanel({ payloads }) {
  if (!payloads || payloads.length === 0) return null

  const caveats = collectCaveats(payloads)

  return (
    <div className="lens-risk-panel">
      <div className="lens-panel-label">RISK &amp; CONDITIONS</div>

      {caveats.length === 0 ? (
        <div className="lens-risk-empty">No active conditions.</div>
      ) : (
        <div className="lens-risk-list">
          {caveats.map((c, i) => (
            <div key={i} className="lens-risk-row">
              <span className="lens-risk-tag">CONDITION</span>
              <span className="lens-risk-text">{c.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * components/lens/CausalNarrative.js
 * PRODUCTIZE.LENS.UI.01
 *
 * Explanation surface for LENS v1.
 * Splits a ZONE-2 explanation string into numbered sentences
 * for clean executive readability.
 *
 * Consumes ZONE-2 projection payloads only.
 * explanation field is the ZONE-2 narrative (## Why It Matters source).
 */

function splitExplanation(text) {
  if (!text) return []
  // Split on sentence boundaries (. ! ?) followed by whitespace or end
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
}

export default function CausalNarrative({ payload }) {
  if (!payload || payload.error_type || payload.zone !== 'ZONE-2') return null

  const sentences = splitExplanation(payload.explanation)
  if (sentences.length === 0) return null

  return (
    <div className="lens-narrative-panel">
      <div className="lens-panel-header">
        <span className="lens-panel-label">WHY IT MATTERS</span>
        <span className="lens-footer-id">{payload.claim_id}</span>
      </div>

      <ol className="lens-narrative-list">
        {sentences.map((s, i) => (
          <li key={i} className="lens-narrative-sentence">
            <span className="lens-narrative-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="lens-narrative-text">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

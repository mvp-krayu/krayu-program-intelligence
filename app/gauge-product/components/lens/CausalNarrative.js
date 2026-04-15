/**
 * components/lens/CausalNarrative.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.UI.POLISH.01
 *
 * Decision relevance surface — renamed and reframed from "Why It Matters".
 * Presents 4 executive decision points followed by the grounding explanation.
 *
 * Consumes ZONE-2 projection payloads only.
 * explanation field is the ZONE-2 narrative (## Why It Matters source).
 */

// Static executive decision points — grounded in CLM-09 VERIFIED evidence class
// and consistent with score range [60–100] and structural completeness state.
const DECISION_POINTS = [
  'Structural certainty is already established. Leadership and the client can act on the proven structural baseline with confidence.',
  'The remaining gap is operational measurement — not foundational design risk. No architectural issues were identified.',
  'Decisions can proceed on what is already proven while isolating the final validation requirement as a discrete, bounded step.',
  'This creates a lower-risk basis for planning, investment, and technical prioritization.',
]

function splitExplanation(text) {
  if (!text) return []
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
        <span className="lens-panel-label">DECISION RELEVANCE</span>
        <span className="lens-footer-id">{payload.claim_id}</span>
      </div>

      <ul className="lens-decision-points">
        {DECISION_POINTS.map((pt, i) => (
          <li key={i} className="lens-decision-point">
            <span className="lens-dp-marker">→</span>
            <span className="lens-dp-text">{pt}</span>
          </li>
        ))}
      </ul>

      <div className="lens-narrative-grounding">
        <div className="lens-grounding-label">EVIDENCE BASIS</div>
        <ol className="lens-narrative-list">
          {sentences.map((s, i) => (
            <li key={i} className="lens-narrative-sentence">
              <span className="lens-narrative-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="lens-narrative-text">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

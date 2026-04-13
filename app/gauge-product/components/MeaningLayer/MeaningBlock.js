/**
 * MeaningBlock.js
 * GAUGE.MEANING.LAYER.PROJECTION.01
 *
 * Renders a single resolved phrase from the business ontology.
 * All text comes from phrases.json — no inline text content.
 *
 * Traceability metadata is emitted as data-* attributes for validation.
 *
 * Props:
 *   phraseId      {string}  — phrase_id from phrases.json
 *   conceptId     {string}  — concept_id from concepts.json
 *   audienceScope {string}  — resolved audience scope (shared/cto/ceo)
 *   text          {string}  — resolved phrase text (placeholders substituted)
 *   tone          {string}  — factual | summary
 *
 * Governed by: GAUGE.MEANING.LAYER.BUSINESS.ONTOLOGY.01
 */

export default function MeaningBlock({ phraseId, conceptId, audienceScope, text, tone }) {
  if (!text) return null

  return (
    <div
      className="ml-block"
      data-concept-id={conceptId}
      data-phrase-id={phraseId}
      data-audience={audienceScope}
      data-tone={tone || 'factual'}
    >
      <p className={`ml-text ml-text--${tone || 'factual'}`}>
        {text}
      </p>
      <div className="ml-meta">
        <span className="ml-meta-concept">{conceptId}</span>
        <span className="ml-meta-sep">·</span>
        <span className="ml-meta-phrase">{phraseId}</span>
        <span className="ml-meta-sep">·</span>
        <span className="ml-meta-scope">{audienceScope}</span>
      </div>
    </div>
  )
}

/**
 * MeaningSection.js
 * GAUGE.MEANING.LAYER.PROJECTION.01
 *
 * Renders a named section of the executive overview page.
 * Contains one or more MeaningBlock phrases.
 *
 * Fail-closed: if no phrases resolve for this section, nothing is rendered.
 *
 * Props:
 *   title         {string}   — section heading (UI scaffolding only, not a business phrase)
 *   phrases       {Array}    — rendered phrase objects from renderer.js
 *   loading       {boolean}
 *   error         {string|null}
 *   sectionKey    {string}   — identifies this section for data-* traceability
 *
 * Governed by: GAUGE.MEANING.LAYER.BUSINESS.ONTOLOGY.01
 */

import MeaningBlock from './MeaningBlock'

export default function MeaningSection({ title, phrases, loading, error, sectionKey }) {
  // Fail-closed: do not render section if no phrases match and not loading
  if (!loading && !error && (!phrases || phrases.length === 0)) {
    return null
  }

  return (
    <div
      className="ml-section"
      data-section={sectionKey}
    >
      <div className="ml-section-title">{title}</div>

      {loading ? (
        <div className="ml-state-loading">Resolving…</div>
      ) : error ? (
        <div className="ml-state-error">State unavailable — {error}</div>
      ) : (
        <div className="ml-blocks">
          {phrases.map(p => (
            <MeaningBlock
              key={p.phraseId}
              phraseId={p.phraseId}
              conceptId={p.conceptId}
              audienceScope={p.audienceScope}
              text={p.text}
              tone={p.tone}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * ExecutivePanel.js
 * PIOS-42.4-RUN01-CONTRACT-v2
 *
 * Renders query identity and confidence header.
 * All values sourced from adapter props — no synthetic data.
 */

function ConfidenceBadge({ level }) {
  if (!level) return null
  const normalized = level.toUpperCase()
  return (
    <span className="conf-badge">
      <span className={`conf-label ${normalized}`}>{normalized}</span>
      <span className="conf-gauge-track">
        <span className={`conf-gauge-fill ${normalized}`} />
      </span>
    </span>
  )
}

export default function ExecutivePanel({ data }) {
  if (!data) return null

  return (
    <div className="panel exec-panel">
      <div className="panel-title">Program Intelligence — Executive View</div>

      <div className="query-id">{data.query_id}</div>
      <div className="query-text">{data.query_text}</div>

      <div className="meta-row">
        <div className="meta-item">
          <span className="meta-label">Intent</span>
          <span className="meta-value">{data.intent_type}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Confidence</span>
          <span className="meta-value">
            <ConfidenceBadge level={data.aggregate_confidence} />
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Signals Bound</span>
          <span className="meta-value">
            {data.signals ? data.signals.length : '—'}
          </span>
        </div>
      </div>

      {data.semantic_tags && data.semantic_tags.length > 0 && (
        <div className="tags">
          {data.semantic_tags.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

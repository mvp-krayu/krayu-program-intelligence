/**
 * SignalGaugeCard.js
 * PIOS-42.5-RUN01-CONTRACT-v1  (refinement of 42.4)
 *
 * Renders a single intelligence signal with governed gauges.
 *
 * Gauge mapping rules (explicit, deterministic — R4/G7):
 *   confidence: STRONG → full bar  |  MODERATE → 62% bar  |  WEAK → 25% bar
 *   relevance:  HIGH   → full bar  |  MEDIUM   → 62% bar  |  LOW  → 25% bar
 *   (source: signal.evidence_confidence, signal.relevance — both from adapter output)
 *
 * Evidence metrics sourced directly from adapter fields (no extraction required):
 *   chain_stages: evidence.evidence_chain.split('→') segment count
 *   evidence_objects: evidence.supporting_objects.length
 *   blocked: evidence.blocking_point !== null
 *
 * No synthetic data. Missing fields → controlled unavailable state.
 */

// ---------------------------------------------------------------------------
// Confidence gauge — STRONG / MODERATE / WEAK
// ---------------------------------------------------------------------------

function ConfidenceGauge({ level }) {
  if (!level) return (
    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>confidence unavailable</span>
  )
  const n = level.toUpperCase()
  return (
    <span className="conf-badge">
      <span className={`conf-label ${n}`}>{n}</span>
      <span className="conf-gauge-track">
        <span className={`conf-gauge-fill ${n}`} />
      </span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Relevance gauge — HIGH / MEDIUM / LOW
// Mapping: HIGH → full bar | MEDIUM → 62% | LOW → 25%
// (Parallel to confidence gauge; same visual encoding, different scale label)
// ---------------------------------------------------------------------------

function RelevanceGauge({ level }) {
  if (!level) return null
  const n = level.toUpperCase()
  return (
    <span className="conf-badge">
      <span className="gauge-prefix-label">RELEVANCE</span>
      <span className={`conf-label rel-${n}`}>{n}</span>
      <span className="conf-gauge-track">
        <span className={`conf-gauge-fill rel-${n}`} />
      </span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Evidence metrics row — all values from adapter evidence payload
// ---------------------------------------------------------------------------

function EvidenceMetrics({ evidence, evidenceWarning }) {
  if (evidenceWarning || !evidence) return null

  // Chain stages: deterministic count of '→'-separated segments in evidence_chain
  // Source: signal.evidence.evidence_chain (string from evidence_mapping_index.json via 42.1)
  const chainText  = evidence.evidence_chain || ''
  const stages     = chainText.split('→').map(s => s.trim()).filter(Boolean).length

  // Evidence objects: supporting_objects array length
  // Source: signal.evidence.supporting_objects (array from evidence_mapping_index.json via 42.1)
  const objCount   = (evidence.supporting_objects || []).length

  // Blocked: presence of blocking_point field
  // Source: signal.evidence.blocking_point (string or null from evidence_mapping_index.json via 42.1)
  const isBlocked  = Boolean(evidence.blocking_point)

  return (
    <div className="evidence-metrics-row">
      <span className="evidence-metric">
        <span className="evidence-metric-label">Chain stages</span>
        <span className="evidence-metric-value">{stages}</span>
      </span>
      <span className="evidence-metric">
        <span className="evidence-metric-label">Evidence objects</span>
        <span className="evidence-metric-value">{objCount}</span>
      </span>
      {isBlocked && (
        <span className="evidence-metric blocked-badge">
          ⚑ BLOCKED
        </span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SignalGaugeCard
// ---------------------------------------------------------------------------

export default function SignalGaugeCard({ signal }) {
  if (!signal) return null

  const components = signal.component_ids && signal.component_names
    ? signal.component_ids.map((id, i) => `${id} (${signal.component_names[i] || ''})`).join(', ')
    : null

  return (
    <div className="signal-card">
      <div className="signal-card-header">
        <span className="signal-id">{signal.signal_id || '—'}</span>
      </div>

      <div className="signal-title">
        {signal.title || <span style={{ color: 'var(--text-muted)' }}>data unavailable</span>}
      </div>

      <div className="signal-gauge-row">
        <ConfidenceGauge level={signal.evidence_confidence} />
        <RelevanceGauge  level={signal.relevance} />
      </div>

      <EvidenceMetrics
        evidence={signal.evidence}
        evidenceWarning={signal.evidence_warning}
      />

      {signal.domain_id && (
        <div className="signal-meta">
          <span>Domain</span>
          {signal.domain_id} — {signal.domain_name}
        </div>
      )}
      {signal.capability_id && (
        <div className="signal-meta">
          <span>Capability</span>
          {signal.capability_id} — {signal.capability_name}
        </div>
      )}
      {components && (
        <div className="signal-meta">
          <span>Components</span>
          {components}
        </div>
      )}

      {signal.statement && (
        <div className="signal-statement">{signal.statement}</div>
      )}
    </div>
  )
}

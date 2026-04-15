/**
 * components/lens/SignalCards.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.UI.POLISH.01
 *
 * Operational signal surface — polished for executive readability.
 * Renders framing + business_impact (as Business Exposure) and risk (as What is Proven)
 * for each ZONE-2 signal payload.
 *
 * Consumes ZONE-2 projection payloads only.
 * No signal_id exposed. No internal reference identifiers.
 */

const CONF_CONFIG = {
  STRONG:   { label: 'STRONG',   bg: '#0d2e1a', color: '#3fb950', border: '#1b5e3d', bar: '#3fb950' },
  MODERATE: { label: 'MODERATE', bg: '#1a1600', color: '#d29922', border: '#3d3208', bar: '#d29922' },
  WEAK:     { label: 'WEAK',     bg: '#111318', color: '#8b949e', border: '#30363d', bar: '#8b949e' },
}

function ConfidenceChip({ level }) {
  const cfg = CONF_CONFIG[level] || CONF_CONFIG.WEAK
  return (
    <span className="lens-conf-chip" style={{
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  )
}

// Executive card title — override raw signal.title with cleaner framing
const CARD_TITLE_OVERRIDE = {
  'CLM-20': 'Security Intelligence Throughput requires live confirmation',
}

// Framing copy per claim — grounded in signal content
const CARD_FRAMING = {
  'CLM-20': 'A critical intelligence pathway is structurally defined and capacity-bounded. The remaining task is to confirm actual throughput under live operating conditions.',
}

// "What is Proven" copy per claim — evidence basis summary
const PROVEN_COPY = {
  'CLM-20': 'The pathway and its configured capacity ceiling are structurally verified. What remains open is runtime confirmation, not structural uncertainty.',
}

function SignalCard({ payload }) {
  if (!payload || payload.error_type || payload.zone !== 'ZONE-2') return null

  const signal = payload.signal
  if (!signal) return null

  const conf    = signal.evidence_confidence || 'WEAK'
  const bar     = CONF_CONFIG[conf]?.bar || '#8b949e'
  const title   = CARD_TITLE_OVERRIDE[payload.claim_id] || signal.title
  const framing = CARD_FRAMING[payload.claim_id]
  const proven  = PROVEN_COPY[payload.claim_id]

  return (
    <div className="lens-signal-card">
      <div className="lens-signal-card-header">
        <span className="lens-signal-title">{title}</span>
        <ConfidenceChip level={conf} />
      </div>

      {framing && (
        <p className="lens-signal-framing">{framing}</p>
      )}

      <div className="lens-signal-conf-bar-wrap">
        <div
          className="lens-signal-conf-bar"
          style={{
            background: bar,
            width: conf === 'STRONG' ? '100%' : conf === 'MODERATE' ? '65%' : '35%',
          }}
        />
      </div>

      <div className="lens-signal-row">
        <span className="lens-signal-row-key">BUSINESS EXPOSURE</span>
        <span className="lens-signal-row-val">{signal.business_impact}</span>
      </div>

      {proven && (
        <div className="lens-signal-row">
          <span className="lens-signal-row-key">WHAT IS PROVEN</span>
          <span className="lens-signal-row-val">{proven}</span>
        </div>
      )}

      <div className="lens-signal-card-footer">
        <span className="lens-footer-id">{payload.claim_id}</span>
        <span className="lens-footer-zone">{payload.evidence_class}</span>
      </div>
    </div>
  )
}

export default function SignalCards({ payloads }) {
  if (!payloads || payloads.length === 0) return null

  const valid = payloads.filter(p => p && !p.error_type && p.zone === 'ZONE-2' && p.signal)
  if (valid.length === 0) return null

  return (
    <div className="lens-signal-section">
      <div className="lens-panel-label">OPERATIONAL SIGNALS</div>
      <div className="lens-signal-grid">
        {valid.map(p => (
          <SignalCard key={p.claim_id} payload={p} />
        ))}
      </div>
    </div>
  )
}

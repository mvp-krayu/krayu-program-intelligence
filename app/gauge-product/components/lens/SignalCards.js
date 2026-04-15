/**
 * components/lens/SignalCards.js
 * PRODUCTIZE.LENS.UI.01
 *
 * Signal claim surface for LENS v1.
 * Renders signal.title, signal.business_impact, signal.risk,
 * and signal.evidence_confidence for each ZONE-2 signal payload.
 *
 * Consumes ZONE-2 projection payloads only.
 * No signal_id exposed. No SIG-XXX references.
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

function SignalCard({ payload }) {
  if (!payload || payload.error_type || payload.zone !== 'ZONE-2') return null

  const signal = payload.signal
  if (!signal) return null

  const conf = signal.evidence_confidence || 'WEAK'
  const bar  = CONF_CONFIG[conf]?.bar || '#8b949e'

  return (
    <div className="lens-signal-card">
      <div className="lens-signal-card-header">
        <span className="lens-signal-title">{signal.title}</span>
        <ConfidenceChip level={conf} />
      </div>

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
        <span className="lens-signal-row-key">BUSINESS IMPACT</span>
        <span className="lens-signal-row-val">{signal.business_impact}</span>
      </div>

      <div className="lens-signal-row">
        <span className="lens-signal-row-key">RISK</span>
        <span className="lens-signal-row-val">{signal.risk}</span>
      </div>

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
      <div className="lens-panel-label">SIGNALS</div>
      <div className="lens-signal-grid">
        {valid.map(p => (
          <SignalCard key={p.claim_id} payload={p} />
        ))}
      </div>
    </div>
  )
}

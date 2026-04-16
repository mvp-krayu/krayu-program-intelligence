/**
 * components/lens/SystemIntelligenceOverview.js
 * PRODUCTIZE.LENS.TOPOLOGY.INTELLIGENCE.01
 *
 * System Intelligence Overview — 5 domain cards derived from ZONE-2 payloads.
 * Each card: domain name, executive description, evidence status badge, primary metric.
 *
 * Domain mapping:
 *   CLM-09 → Platform Architecture
 *   CLM-20 → Security Intelligence
 *   CLM-25 → Operational Readiness (verdict)
 *   CLM-12 → Assessment Confidence
 *   CLM-10 → Execution Pathway
 *
 * Consumes ZONE-2 projection payloads only. No internal identifiers exposed.
 */

const DOMAIN_CONFIG = {
  'CLM-09': {
    title:       'Platform Architecture',
    description: 'Structural integrity of the platform has been assessed and scored. The foundational components are verified and accounted for.',
    metricLabel: 'Structural Score',
  },
  'CLM-20': {
    title:       'Security Intelligence',
    description: 'A critical intelligence pathway is structurally defined and capacity-bounded. Live throughput confirmation is the remaining task.',
    metricLabel: 'Signal Confidence',
  },
  'CLM-25': {
    title:       'Operational Readiness',
    description: 'Three-axis readiness verdict covering structural integrity, operational concentration, and execution status.',
    metricLabel: 'Readiness Status',
  },
  'CLM-12': {
    title:       'Assessment Confidence',
    description: 'The confidence range governing this assessment is bounded and controlled. Uncertainty is quantified, not open-ended.',
    metricLabel: 'Confidence Range',
  },
  'CLM-10': {
    title:       'Execution Pathway',
    description: 'A projectable path to full readiness is defined. The achievable ceiling is known, with a clear set of remaining conditions.',
    metricLabel: 'Achievable Ceiling',
  },
}

const BADGE_CONFIG = {
  VERIFIED:    { label: 'VERIFIED',     bg: '#0d2e1a', color: '#3fb950', border: '#1b5e3d' },
  CONDITIONAL: { label: 'IN PROGRESS',  bg: '#1a1600', color: '#d29922', border: '#3d3208' },
  PARTIAL:     { label: 'PARTIAL',      bg: '#18100a', color: '#e07a30', border: '#4a2910' },
  BLOCKED:     { label: 'BLOCKED',      bg: '#1a0a0a', color: '#f85149', border: '#4a1212' },
}

// Safe label — strip internal ID prefix from value narratives
function safeMetric(payload, claimId) {
  if (!payload || payload.error_type || payload.zone !== 'ZONE-2') return '—'
  const narrative = payload.value?.narrative
  if (!narrative) return '—'
  // For CLM-20, use signal confidence level
  if (claimId === 'CLM-20') {
    const conf = payload.signal?.evidence_confidence
    return conf ? conf.charAt(0) + conf.slice(1).toLowerCase() : '—'
  }
  // For CLM-12, extract range (lower–upper)
  if (claimId === 'CLM-12') {
    const rangeMatch = narrative.match(/lower=(\d+),\s*upper=(\d+)/)
    if (rangeMatch) return `${rangeMatch[1]} – ${rangeMatch[2]}`
    return narrative.replace(/,?\s*status=\S+/g, '').trim()
  }
  // For others, return narrative directly (already executive-grade from ZONE-2)
  return narrative
}

function DomainCard({ claimId, payload }) {
  const cfg   = DOMAIN_CONFIG[claimId]
  if (!cfg) return null

  const valid  = payload && !payload.error_type && payload.zone === 'ZONE-2'
  const ec     = valid ? payload.evidence_class : 'BLOCKED'
  const badge  = BADGE_CONFIG[ec] || BADGE_CONFIG.BLOCKED
  const metric = safeMetric(payload, claimId)

  return (
    <div className={`lens-domain-card lens-domain-card--${(ec || 'blocked').toLowerCase()}`}>
      <div className="lens-domain-card-header">
        <span className="lens-domain-title">{cfg.title}</span>
        <span
          className="lens-domain-badge"
          style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
        >
          {badge.label}
        </span>
      </div>
      <p className="lens-domain-description">{cfg.description}</p>
      {valid && metric !== '—' && (
        <div className="lens-domain-metric">
          <span className="lens-domain-metric-key">{cfg.metricLabel}</span>
          <span className="lens-domain-metric-val">{metric}</span>
        </div>
      )}
    </div>
  )
}

// Order: Platform Architecture → Security Intelligence → Operational Readiness → Assessment Confidence → Execution Pathway
const CARD_ORDER = ['CLM-09', 'CLM-20', 'CLM-25', 'CLM-12', 'CLM-10']

export default function SystemIntelligenceOverview({ payloads }) {
  if (!payloads || Object.keys(payloads).length === 0) return null

  return (
    <div className="lens-sio-panel">
      <div className="lens-panel-label">SYSTEM INTELLIGENCE OVERVIEW</div>
      <p className="lens-sio-intro">
        Five intelligence domains have been assessed. Each domain contributes to the overall readiness determination.
      </p>
      <div className="lens-sio-grid">
        {CARD_ORDER.map(id => (
          <DomainCard key={id} claimId={id} payload={payloads[id] || null} />
        ))}
      </div>
    </div>
  )
}

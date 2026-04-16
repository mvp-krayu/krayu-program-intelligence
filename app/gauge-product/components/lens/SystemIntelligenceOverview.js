/**
 * components/lens/SystemIntelligenceOverview.js
 * PRODUCTIZE.LENS.GRAPH.RENDER.01
 *
 * System Intelligence Overview — 6 curated platform domain cards.
 * Grounded in the safe 17-domain canonical set.
 *
 * Domain selection: 6 of 17 most representative for executive readability.
 * - Edge Data Acquisition (focus — SIG-001 grounded)
 * - Fleet Core Operations (core product domain)
 * - Platform Infrastructure and Data (conditional — 7 unknown dimensions)
 * - Analytics and Intelligence (intelligence layer)
 * - AI/ML Intelligence Layer (AI capabilities)
 * - Access Control and Identity (cross-cutting)
 *
 * Static component — no payload dependency.
 * Data source: lib/lens/curatedGraphData.js
 * Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01 / PRODUCTIZE.LENS.GRAPH.RENDER.01
 *
 * GOVERNANCE:
 * - All domain names are from the safe admitted 17-domain set.
 * - No component names. No internal IDs. No ZONE-1 content.
 */

import { OVERVIEW_DOMAINS } from '../../lib/lens/curatedGraphData'

const BADGE = {
  verified:    { label: 'VERIFIED',     bg: '#0d2e1a', color: '#3fb950', border: '#1b5e3d' },
  conditional: { label: 'IN PROGRESS',  bg: '#1a1600', color: '#d29922', border: '#3d3208' },
}

function DomainCard({ domain }) {
  const badge = BADGE[domain.status] || BADGE.verified
  const isFocus = domain.id === 'gn-01'

  return (
    <div className={`lens-sio-card${isFocus ? ' lens-sio-card--focus' : ''} lens-sio-card--${domain.status}`}>
      <div className="lens-sio-card-header">
        <span className="lens-sio-card-name">{domain.name}</span>
        <span
          className="lens-sio-card-badge"
          style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
        >
          {badge.label}
        </span>
      </div>
      <div className="lens-sio-card-type">{domain.type}</div>
      <p className="lens-sio-card-desc">{domain.description}</p>
      <div className="lens-sio-card-metric">
        <span className="lens-sio-card-metric-key">{domain.metric.label}</span>
        <span
          className="lens-sio-card-metric-val"
          style={{ color: badge.color }}
        >
          {domain.metric.value}
        </span>
      </div>
    </div>
  )
}

export default function SystemIntelligenceOverview() {
  return (
    <div className="lens-sio-panel">
      <div className="lens-panel-label">SYSTEM INTELLIGENCE OVERVIEW</div>
      <p className="lens-sio-intro">
        Six of seventeen assessed domains are highlighted below.
        Each domain has been structurally examined as part of the governed assessment.
      </p>
      <div className="lens-sio-grid-v2">
        {OVERVIEW_DOMAINS.map(d => (
          <DomainCard key={d.id} domain={d} />
        ))}
      </div>
      <div className="lens-sio-footer">
        17 functional domains · 42 capability surfaces · 89 components mapped
      </div>
    </div>
  )
}

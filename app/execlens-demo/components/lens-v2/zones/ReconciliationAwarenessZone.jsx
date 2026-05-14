import { useState } from 'react'

const POSTURE_TIER_META = {
  STRONG:       { color: '#64ffda', symbol: '◆' },
  MODERATE:     { color: '#ffd700', symbol: '◇' },
  WEAK:         { color: '#ff9e4a', symbol: '△' },
  INSUFFICIENT: { color: '#ff6b6b', symbol: '▽' },
}

const RECON_LEVEL_LABELS = {
  HYDRATED: 'Fully reconciled — structural + semantic grounding established',
  RECONCILED: 'Reconciled — structural backing confirmed',
  PARTIAL: 'Partially reconciled — semantic correspondence without full structural grounding',
  EXACT: 'Exact correspondence — direct structural binding',
}

function ReconTrajectoryStrip({ trajectory, latestDelta }) {
  const labels = trajectory.epoch_labels
  const confidence = trajectory.weighted_confidence

  return (
    <div className="recon-trajectory">
      <div className="recon-trajectory-header">
        <span className="recon-trajectory-label">CONFIDENCE TRAJECTORY</span>
        {latestDelta && (
          <span className={`recon-trajectory-delta ${latestDelta.weighted_confidence_change > 0 ? 'recon-trajectory-delta--up' : latestDelta.weighted_confidence_change < 0 ? 'recon-trajectory-delta--down' : ''}`}>
            {latestDelta.weighted_confidence_change > 0 ? '+' : ''}{latestDelta.weighted_confidence_change} from {latestDelta.from_label}
          </span>
        )}
      </div>
      <div className="recon-trajectory-epochs">
        {labels.map((label, i) => (
          <div key={label} className={`recon-trajectory-epoch ${i === labels.length - 1 ? 'recon-trajectory-epoch--current' : ''}`}>
            <span className="recon-trajectory-epoch-label">{label}</span>
            <div className="recon-trajectory-epoch-bar-wrap">
              <div
                className="recon-trajectory-epoch-bar"
                style={{ width: `${confidence[i]}%` }}
              />
            </div>
            <span className="recon-trajectory-epoch-value">{confidence[i]}%</span>
          </div>
        ))}
      </div>
      {latestDelta && latestDelta.domain_movements && latestDelta.domain_movements.length > 0 && (
        <div className="recon-trajectory-movements">
          {latestDelta.domain_movements.map(m => (
            <span key={m.domain_id} className={`recon-trajectory-movement ${m.delta > 0 ? 'recon-trajectory-movement--up' : 'recon-trajectory-movement--down'}`}>
              {m.domain_id}: L{m.from_level}→L{m.to_level}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function DomainDrilldownPanel({ trace }) {
  const CLASSIFICATION_LABELS = {
    CONCEPTUAL_INFRASTRUCTURE: 'Conceptual infrastructure — cross-cutting concern without structural home',
    DISTRIBUTED_CONCERN: 'Distributed concern — code exists but is spread across multiple DOMs',
    BUSINESS_VERTICAL: 'Business vertical — market capability not yet structurally distinct',
  }

  const RESOLUTION_HINTS = {
    'DOMAIN-02': 'A dedicated messaging/queue service (MQTT broker, Kafka, RabbitMQ) visible as a distinct structural component.',
    'DOMAIN-08': 'A dedicated WebSocket server, API gateway service, or streaming microservice visible as a distinct structural component.',
    'DOMAIN-13': 'A dedicated integration module or adapter layer visible as a distinct directory with external service connectors.',
    'DOMAIN-15': 'EV-specific modules, charging API integrations, or battery management code visible in the structural topology.',
  }

  const CLASSIFICATIONS = {
    'DOMAIN-02': 'CONCEPTUAL_INFRASTRUCTURE',
    'DOMAIN-08': 'CONCEPTUAL_INFRASTRUCTURE',
    'DOMAIN-13': 'DISTRIBUTED_CONCERN',
    'DOMAIN-15': 'BUSINESS_VERTICAL',
  }

  const classification = CLASSIFICATIONS[trace.domain_id]
  const classLabel = classification ? CLASSIFICATION_LABELS[classification] : null
  const hint = RESOLUTION_HINTS[trace.domain_id]

  return (
    <div className="recon-drilldown" role="region" aria-label={`${trace.domain_id} reconciliation detail`}>
      <div className="recon-drilldown-section">
        <span className="recon-drilldown-key">Why unmapped</span>
        <span className="recon-drilldown-val">{trace.enrichment_reason}</span>
      </div>
      {classLabel && (
        <div className="recon-drilldown-section">
          <span className="recon-drilldown-key">Classification</span>
          <span className="recon-drilldown-val">{classLabel}</span>
        </div>
      )}
      {hint && (
        <div className="recon-drilldown-section">
          <span className="recon-drilldown-key">Would resolve</span>
          <span className="recon-drilldown-val recon-drilldown-val--hint">{hint}</span>
        </div>
      )}
      <div className="recon-drilldown-meta">
        <span className="recon-drilldown-meta-item">
          enrichment: {trace.enrichment_status || '—'}
        </span>
        <span className="recon-drilldown-meta-item">
          lineage: {trace.lineage_status || '—'}
        </span>
        <span className="recon-drilldown-meta-item">
          cluster: {trace.cluster_id || '—'}
        </span>
      </div>
    </div>
  )
}

function ReconDebtDrilldown({ debtPosture, domainTraceability }) {
  const [expandedDomain, setExpandedDomain] = useState(null)

  const toggle = (domainId) => {
    setExpandedDomain(prev => prev === domainId ? null : domainId)
  }

  const findTrace = (domainId) => {
    if (!domainTraceability) return null
    return domainTraceability.find(t => t.domain_id === domainId) || null
  }

  return (
    <div className="recon-debt">
      <div className="recon-debt-header">
        <span className="recon-debt-label">SEMANTIC DEBT — UNRESOLVED DOMAINS</span>
        <span className="recon-debt-rate">{debtPosture.resolution_rate != null ? `${debtPosture.resolution_rate}% resolved` : ''}</span>
      </div>
      <div className="recon-debt-list">
        {debtPosture.unresolved_domains.map(d => {
          const trace = findTrace(d.domain_id)
          const isExpanded = expandedDomain === d.domain_id
          const hasRationale = trace && trace.enrichment_reason

          return (
            <div key={d.domain_id} className={`recon-debt-entry ${isExpanded ? 'recon-debt-entry--expanded' : ''}`}>
              <button
                className={`recon-debt-item ${hasRationale ? 'recon-debt-item--drillable' : ''}`}
                onClick={() => hasRationale && toggle(d.domain_id)}
                type="button"
                aria-expanded={isExpanded}
                disabled={!hasRationale}
              >
                <span className="recon-debt-item-expand">{hasRationale ? (isExpanded ? '▾' : '▸') : '·'}</span>
                <span className="recon-debt-item-id">{d.domain_id}</span>
                <span className="recon-debt-item-name">{d.domain_name}</span>
                <span className="recon-debt-item-type">{d.domain_type}</span>
              </button>
              {isExpanded && trace && (
                <DomainDrilldownPanel trace={trace} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReconDomainDrilldownTable({ domains }) {
  const [expandedDomain, setExpandedDomain] = useState(null)

  const toggle = (domainId) => {
    setExpandedDomain(prev => prev === domainId ? null : domainId)
  }

  return (
    <div className="recon-domains">
      <span className="recon-domains-label">PER-DOMAIN CORRESPONDENCE</span>
      <div className="recon-domains-grid">
        {domains.map(d => {
          const isExpanded = expandedDomain === d.domain_id
          const hasRationale = !!d.enrichment_reason

          return (
            <div key={d.domain_id} className={`recon-domain-entry ${isExpanded ? 'recon-domain-entry--expanded' : ''}`}>
              <button
                className={`recon-domain-row recon-domain-row--l${d.confidence_level} ${hasRationale ? 'recon-domain-row--drillable' : ''}`}
                onClick={() => hasRationale && toggle(d.domain_id)}
                type="button"
                aria-expanded={isExpanded}
                disabled={!hasRationale}
              >
                <span className={`recon-domain-badge recon-domain-badge--l${d.confidence_level}`}>L{d.confidence_level}</span>
                <span className="recon-domain-id">{d.domain_id}</span>
                <span className="recon-domain-name">{d.domain_name}</span>
                <span className="recon-domain-dom">{d.structural_dom_id || '—'}</span>
                <span className={`recon-domain-status recon-domain-status--${d.reconciliation_status.toLowerCase()}`}>{d.reconciliation_status}</span>
                {hasRationale && (
                  <span className="recon-domain-expand">{isExpanded ? '▾' : '▸'}</span>
                )}
              </button>
              {isExpanded && (
                <div className="recon-drilldown" role="region" aria-label={`${d.domain_id} reconciliation detail`}>
                  <div className="recon-drilldown-section">
                    <span className="recon-drilldown-key">
                      {d.enrichment_status === 'UNMAPPED_RETAINED' ? 'Why unmapped' : 'Enrichment basis'}
                    </span>
                    <span className="recon-drilldown-val">{d.enrichment_reason}</span>
                  </div>
                  {d.pre_enrichment && d.pre_enrichment.lineage_status === 'NONE' && (
                    <div className="recon-drilldown-section">
                      <span className="recon-drilldown-key">Prior state</span>
                      <span className="recon-drilldown-val">Previously unmapped (L1) — elevated via AI-assisted enrichment</span>
                    </div>
                  )}
                  <div className="recon-drilldown-meta">
                    <span className="recon-drilldown-meta-item">
                      enrichment: {d.enrichment_status || '—'}
                    </span>
                    <span className="recon-drilldown-meta-item">
                      lineage: {d.lineage_status || '—'}
                    </span>
                    {d.enrichment_confidence != null && (
                      <span className="recon-drilldown-meta-item">
                        confidence: {d.enrichment_confidence}
                      </span>
                    )}
                    <span className="recon-drilldown-meta-item">
                      basis: {d.correspondence_basis || '—'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReconProvenance({ provenance }) {
  return (
    <div className="recon-provenance">
      <span className="recon-provenance-label">REPLAY PROVENANCE</span>
      <div className="recon-provenance-items">
        <span className="recon-provenance-item">
          <span className="recon-provenance-key">deterministic</span>
          <span className={`recon-provenance-val ${provenance.governance && provenance.governance.deterministic ? 'recon-provenance-val--pass' : ''}`}>
            {provenance.governance && provenance.governance.deterministic ? '✓' : '✗'}
          </span>
        </span>
        <span className="recon-provenance-item">
          <span className="recon-provenance-key">replay-safe</span>
          <span className={`recon-provenance-val ${provenance.governance && provenance.governance.replay_safe ? 'recon-provenance-val--pass' : ''}`}>
            {provenance.governance && provenance.governance.replay_safe ? '✓' : '✗'}
          </span>
        </span>
        <span className="recon-provenance-item">
          <span className="recon-provenance-key">no inference</span>
          <span className={`recon-provenance-val ${provenance.governance && provenance.governance.no_new_inference ? 'recon-provenance-val--pass' : ''}`}>
            {provenance.governance && provenance.governance.no_new_inference ? '✓' : '✗'}
          </span>
        </span>
        <span className="recon-provenance-item">
          <span className="recon-provenance-key">epochs</span>
          <span className="recon-provenance-val">{provenance.epoch_sources ? provenance.epoch_sources.length : 0}</span>
        </span>
        <span className="recon-provenance-item">
          <span className="recon-provenance-key">generated</span>
          <span className="recon-provenance-val">{provenance.generated_at ? provenance.generated_at.split('T')[0] : '—'}</span>
        </span>
      </div>
    </div>
  )
}

export default function ReconciliationAwarenessZone({ awareness, densityClass, boardroomMode, domainTraceability }) {
  if (!awareness || !awareness.available) return null

  const { posture, debtPosture, qualificationFrame, lifecycle, correspondence, per_domain } = awareness
  const tierMeta = POSTURE_TIER_META[posture.tier] || POSTURE_TIER_META.WEAK

  if (boardroomMode) {
    return (
      <div className="recon-zone recon-zone--boardroom">
        <div className="recon-zone-posture-strip">
          <span className="recon-zone-posture-symbol" style={{ color: tierMeta.color }}>{tierMeta.symbol}</span>
          <span className="recon-zone-posture-label">{posture.label}</span>
          <span className="recon-zone-posture-confidence">{posture.weighted_confidence}%</span>
          {lifecycle && lifecycle.trend && (
            <span className={`recon-zone-trend recon-zone-trend--${lifecycle.trend.label.toLowerCase()}`}>
              {lifecycle.trend.label}
            </span>
          )}
        </div>
      </div>
    )
  }

  const isExecutive = densityClass === 'EXECUTIVE_BALANCED'
  const isInvestigation = densityClass === 'INVESTIGATION_DENSE'

  return (
    <div className={`recon-zone recon-zone--${densityClass.toLowerCase()}`}>
      <div className="recon-zone-header">
        <span className="recon-zone-label">RECONCILIATION POSTURE</span>
        <span className="recon-zone-posture-tag" style={{ color: tierMeta.color, borderColor: tierMeta.color }}>
          {tierMeta.symbol} {posture.label}
        </span>
        {lifecycle && lifecycle.trend && (
          <span className={`recon-zone-trend recon-zone-trend--${lifecycle.trend.label.toLowerCase()}`}>
            {lifecycle.trend.label}
          </span>
        )}
      </div>

      <div className="recon-zone-metrics">
        <div className="recon-zone-metric recon-zone-metric--primary">
          <span className="recon-zone-metric-value" style={{ color: tierMeta.color }}>{posture.weighted_confidence}%</span>
          <span className="recon-zone-metric-label">Weighted Confidence</span>
        </div>
        <div className="recon-zone-metric">
          <span className="recon-zone-metric-value">{posture.ratio_pct}%</span>
          <span className="recon-zone-metric-label">Reconciliation Ratio</span>
        </div>
        <div className="recon-zone-metric">
          <span className="recon-zone-metric-value">{posture.coverage_pct}%</span>
          <span className="recon-zone-metric-label">Domain Coverage</span>
        </div>
        <div className="recon-zone-metric">
          <span className="recon-zone-metric-value">{posture.grounded_count}/{posture.total_domains}</span>
          <span className="recon-zone-metric-label">L5 Grounded</span>
        </div>
        <div className="recon-zone-metric">
          <span className="recon-zone-metric-value">{posture.unmapped_count}</span>
          <span className="recon-zone-metric-label">Unmapped</span>
        </div>
      </div>

      {lifecycle && lifecycle.trajectory && lifecycle.trajectory.epoch_labels.length > 1 && (
        <ReconTrajectoryStrip trajectory={lifecycle.trajectory} latestDelta={lifecycle.latestDelta} />
      )}

      {!isExecutive && debtPosture && debtPosture.unresolved_domains && debtPosture.unresolved_domains.length > 0 && (
        <ReconDebtDrilldown debtPosture={debtPosture} domainTraceability={domainTraceability} />
      )}

      {isInvestigation && domainTraceability && domainTraceability.length > 0 && (
        <ReconDomainDrilldownTable domains={domainTraceability} />
      )}

      {isInvestigation && lifecycle && lifecycle.provenance && (
        <ReconProvenance provenance={lifecycle.provenance} />
      )}
    </div>
  )
}

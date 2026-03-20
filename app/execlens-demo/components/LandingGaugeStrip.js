/**
 * LandingGaugeStrip.js
 * PIOS-42.6-RUN01-CONTRACT-v1
 *
 * Landing-page executive gauge strip.
 * Displays four structural metrics before any query is selected.
 *
 * Data source: /api/execlens?overview=true
 *   → scripts/pios/42.6/execlens_overview_adapter.py
 *   → 42.2 → 42.1 → signal_registry.json
 *
 * Metrics displayed (all extracted via deterministic rules — G7):
 *   dependency_load         SIG-003  0.682  → 68.2% fill (0–1 scale)
 *   structural_density      SIG-004  1.273  → 63.6% fill (0–2 scale, threshold at 50%)
 *   coordination_pressure   SIG-005  0.875  → 87.5% fill (0–1 scale)
 *   visibility_deficit      SIG-002  7      → 100% fill (7/7 unknown)
 *
 * Governance:
 *   - all values from adapter JSON; no hardcoded numbers
 *   - if value is null (extraction failed), gauge is omitted for that metric
 *   - if API call fails, strip shows controlled failure state (no fake completeness)
 */

import { useState, useEffect } from 'react'

const CONF_COLORS = {
  STRONG:   'var(--strong)',
  MODERATE: 'var(--moderate)',
  WEAK:     'var(--weak)',
}

// ---------------------------------------------------------------------------
// Individual metric gauge card
// ---------------------------------------------------------------------------

function MetricGauge({ metric }) {
  const { label, signal_id, confidence, value, unit, fill_pct,
          fill_scale, context, threshold, threshold_fill_pct,
          extraction_status } = metric

  // If value unavailable, show controlled unavailable state — no fake fill
  const valueUnavailable = extraction_status !== 'ok' || value === null

  const confColor = CONF_COLORS[confidence] || 'var(--text-muted)'

  // Format display value based on unit
  let displayValue = '—'
  if (!valueUnavailable) {
    if (unit === 'count') {
      displayValue = `${value}`
    } else {
      // For ratios: show the raw value and the percentage
      displayValue = value.toFixed(3)
    }
  }

  let displayPct = null
  if (!valueUnavailable && fill_pct !== null) {
    if (unit === 'ratio' && value < 1) {
      displayPct = `${fill_pct}%`
    } else if (unit === 'count') {
      displayPct = `${value} of ${value}`
    }
    // structural_density: show actual value, no redundant pct label
  }

  // Structural density has a threshold marker
  const hasThreshold = threshold !== null && threshold_fill_pct !== null

  return (
    <div className="lg-card">
      <div className="lg-card-header">
        <span className="lg-metric-label">{label}</span>
        <span className="lg-signal-ref" title={`Source: ${signal_id}`}>
          <span className="lg-signal-id">{signal_id}</span>
          {confidence && (
            <span className="lg-conf-chip" style={{ color: confColor }}>
              {confidence}
            </span>
          )}
        </span>
      </div>

      <div className="lg-value-row">
        {valueUnavailable ? (
          <span className="lg-value-unavailable">unavailable</span>
        ) : (
          <>
            <span className="lg-value">{displayValue}</span>
            {unit === 'ratio' && value >= 1 && (
              <span className="lg-exceeds-badge">EXCEEDS UNITY</span>
            )}
            {unit === 'count' && (
              <span className="lg-count-label">/{value} unknown</span>
            )}
          </>
        )}
      </div>

      {/* Gauge bar — only when value is available */}
      {!valueUnavailable && fill_pct !== null && (
        <div className="lg-gauge-wrap">
          <div className="lg-gauge-track">
            {/* Threshold marker for structural density */}
            {hasThreshold && (
              <div
                className="lg-threshold-marker"
                style={{ left: `${threshold_fill_pct}%` }}
                title={`Unity threshold (${threshold})`}
              />
            )}
            <div
              className="lg-gauge-fill"
              style={{
                width: `${fill_pct}%`,
                background: confColor,
              }}
            />
          </div>
          {displayPct && (
            <span className="lg-gauge-pct">{displayPct}</span>
          )}
        </div>
      )}

      {context && (
        <div className="lg-context">{context}</div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// LandingGaugeStrip
// ---------------------------------------------------------------------------

export default function LandingGaugeStrip() {
  const [metrics,  setMetrics]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    fetch('/api/execlens?overview=true')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        setMetrics(data.metrics || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="lg-strip lg-strip-loading">
        <span className="lg-loading-text">Loading structural metrics…</span>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="lg-strip lg-strip-error">
        <span className="lg-error-text">
          Structural metrics unavailable — {error || 'no data'}
        </span>
      </div>
    )
  }

  return (
    <div className="lg-strip">
      <div className="lg-strip-header">
        <span className="lg-strip-label">Structural Condition — Program Intelligence Overview</span>
        <span className="lg-strip-source">source: signal_registry.json via 42.6 adapter</span>
      </div>
      <div className="lg-grid">
        {metrics.map(m => (
          <MetricGauge key={m.id} metric={m} />
        ))}
      </div>
    </div>
  )
}

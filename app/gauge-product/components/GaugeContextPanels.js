/**
 * GaugeContextPanels.js
 * GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01
 *
 * Shared data hooks and right-column panel components.
 * Extracted from pages/index.js to allow context inheritance
 * on the dedicated topology page without code duplication.
 *
 * Exports:
 *   - useGaugeData()         → /api/gauge
 *   - useTopologySummary()   → /api/topology
 *   - useSignalsData()       → /api/signals
 *   - RuntimeIntelligence
 *   - StructuralMetrics
 *   - SignalSet
 *   - SignalAvailability
 *   - TopologySummaryPanel
 *
 * Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
 */

import { useState, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Data hooks
// ---------------------------------------------------------------------------

export function useGaugeData() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  useEffect(() => {
    fetch('/api/gauge')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])
  return { data, loading, error }
}

export function useTopologySummary() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  useEffect(() => {
    fetch('/api/topology')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])
  return { data, loading, error }
}

export function useSignalsData() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  useEffect(() => {
    fetch('/api/signals')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])
  return { data, loading, error }
}

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

export const DIM_STATE_CLASS = {
  PASS: 'pass', COMPUTED: 'computed', FULL: 'computed',
  CLEAR: 'clear', NONE: 'none', COMPLETE: 'complete',
}

// ---------------------------------------------------------------------------
// Panel components
// ---------------------------------------------------------------------------

export function RuntimeIntelligence({ gaugeData }) {
  if (!gaugeData) return null
  const dims = gaugeData.dimensions || {}

  const dimRows = [
    { id: 'DIM-01', label: 'Coverage',           val: `${dims['DIM-01']?.coverage_percent ?? '—'}%`,                  state: dims['DIM-01']?.state_label || dims['DIM-01']?.state },
    { id: 'DIM-02', label: 'Reconstruction',      val: `${dims['DIM-02']?.validated_units ?? '—'}/${dims['DIM-02']?.total_units ?? '—'} units`, state: dims['DIM-02']?.state },
    { id: 'DIM-03', label: 'Escalation',          val: `${dims['DIM-03']?.value ?? '—'}`,                              state: dims['DIM-03']?.state_label },
    { id: 'DIM-04', label: 'Unknown-Space',        val: `${dims['DIM-04']?.total_count ?? '—'} records`,                state: dims['DIM-04']?.state_label },
    { id: 'DIM-05', label: 'Intake Completeness', val: '',                                                              state: dims['DIM-05']?.state },
    { id: 'DIM-06', label: 'Heuristic',           val: '',                                                              state: dims['DIM-06']?.state },
  ]

  return (
    <div className="ri-section">
      {dimRows.map(d => (
        <div key={d.id} className="ri-dim">
          <span className="ri-dim-label">{d.label}</span>
          {d.val && <span className="ri-dim-val">{d.val}</span>}
          {d.state && (
            <span className={`ri-dim-state ${DIM_STATE_CLASS[d.state] || ''}`}>{d.state}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export function StructuralMetrics({ gaugeData, topoData }) {
  const rec      = gaugeData?.reconstruction
  const coverage = gaugeData?.coverage
  const summary  = topoData?.summary || {}

  const metrics = [
    { val: coverage?.admissible_units ?? '—',                           lbl: 'Validated Units' },
    { val: rec?.axis_results ? Object.keys(rec.axis_results).length : 4, lbl: 'Recon Axes' },
    { val: rec?.violations?.length ?? 0,                                lbl: 'Violations' },
    { val: summary.nodes_count ?? '—',                                  lbl: 'Binding Nodes' },
    { val: summary.overlap_edges_count ?? '—',                          lbl: 'Overlaps' },
    { val: summary.signals_count ?? '—',                                lbl: 'Env Signals' },
  ]

  return (
    <div className="sm-grid">
      {metrics.map((m, i) => (
        <div key={i} className="sm-metric">
          <div className="sm-metric-val">{m.val}</div>
          <div className="sm-metric-lbl">{m.lbl}</div>
        </div>
      ))}
    </div>
  )
}

export function SignalSet({ topoData }) {
  const signals = topoData?.signals_by_node
    ? Object.values(topoData.signals_by_node).flat()
    : []

  if (signals.length === 0) {
    return <div style={{ fontSize: '12px', color: '#444' }}>No signals in this run.</div>
  }

  return (
    <div>
      {signals.map(s => (
        <div key={s.signal_id} className="sig-row">
          <span className="sig-id">{s.signal_id}</span>
          <span className="sig-name">{s.metric_name || s.signal_id}</span>
          <span className="sig-val">
            {s.value !== undefined ? `${s.value}` : '—'}
            {s.unit ? <span style={{ fontSize: '10px', color: '#444', marginLeft: '3px' }}>{s.unit}</span> : null}
          </span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Signal availability constants
// ---------------------------------------------------------------------------

const CONF_ORDER = ['STRONG', 'MODERATE', 'WEAK']
const CONF_CLASS = { STRONG: 'strong', MODERATE: 'moderate', WEAK: 'weak' }

export function SignalAvailability({ signalsData }) {
  if (!signalsData) return null

  const signals       = signalsData.signals       || []
  const total         = signalsData.total         || 0
  const by_confidence = signalsData.by_confidence || {}

  if (total === 0) {
    return (
      <div>
        <div className="sa-empty">No signal instances currently mounted for this run</div>
        <div className="sa-empty-note">
          Signal layer requires execution telemetry or deeper intake coverage
        </div>
      </div>
    )
  }

  const visible = signals.slice(0, 5)

  return (
    <div>
      <div className="sa-summary">
        <span className="sa-count">{total}</span> signals detected
      </div>

      <div className="sa-dist">
        {CONF_ORDER.filter(c => by_confidence[c]).map(c => (
          <span key={c} className={`sa-dist-chip ${CONF_CLASS[c]}`}>
            {c}: {by_confidence[c]}
          </span>
        ))}
        {Object.keys(by_confidence).filter(c => !CONF_ORDER.includes(c)).map(c => (
          <span key={c} className="sa-dist-chip sa-dist-chip--unknown">
            {c}: {by_confidence[c]}
          </span>
        ))}
      </div>

      <div className="sa-list">
        {visible.map(s => (
          <div key={s.signal_id} className="sa-sig">
            <span className="sa-sig-id">{s.signal_id}</span>
            <span className={`sa-sig-conf ${CONF_CLASS[s.evidence_confidence] || ''}`}>
              {s.evidence_confidence}
            </span>
            <span className="sa-sig-title">{s.title}</span>
          </div>
        ))}
      </div>

      <div className="sa-source">
        source: {signalsData.source} &middot; registry: {signalsData.registry_id}
      </div>
    </div>
  )
}

export function TopologySummaryPanel({ topoData }) {
  const summary = topoData?.summary          || {}
  const cf      = topoData?.constraint_flags || {}
  const nodes   = topoData?.nodes            || []

  // Derive structural type counts from nodes[] — GAUGE.STANDALONE.STRUCTURAL.METRICS.DERIVATION.01
  // Source: /api/topology → nodes[].type (binding_context | capability_surface | component_entity)
  // Fail-closed: if topoData is unavailable, preserve '—' rather than showing 0
  const domains    = topoData ? nodes.filter(n => n.type === 'binding_context').length    : '—'
  const surfaces   = topoData ? nodes.filter(n => n.type === 'capability_surface').length : '—'
  const components = topoData ? nodes.filter(n => n.type === 'component_entity').length   : '—'

  const rows = [
    { label: 'Total nodes',        value: summary.nodes_count ?? '—' },
    { label: 'Domains',            value: domains },
    { label: 'Surfaces',           value: surfaces },
    { label: 'Components',         value: components },
    { label: 'Structural overlaps',value: summary.overlap_edges_count ?? '—',  flag: cf.overlap_present ? 'OVL' : null },
    { label: 'Unknown space',      value: cf.unknown_space_count ?? 0,         flag: cf.unknown_space_present ? 'USP' : null },
    { label: 'Envelope signals',   value: summary.signals_count ?? '—' },
  ]

  return (
    <div>
      {rows.map((r, i) => (
        <div key={i} className="ts-row">
          <span className="ts-label">{r.label}</span>
          <span className="ts-value">
            {r.value}
            {r.flag && <span className="ts-flag">{r.flag}</span>}
          </span>
        </div>
      ))}
      <div style={{ fontSize: '11px', color: '#444', marginTop: '8px' }}>
        source: binding_envelope.json
      </div>
    </div>
  )
}

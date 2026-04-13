/**
 * pages/topology.js
 * GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01
 *
 * Dedicated structural topology page for the standalone Gauge product.
 *
 * Layout:
 *   A. Back nav + product header
 *   B. Context strip (compact) — Runtime Intelligence, Structural Metrics,
 *      Signal Set, Topology Summary (inherited from column 3)
 *   C. Full-width topology explorer (TopologyAddon)
 *
 * Data sources:
 *   - /api/gauge    → Runtime Intelligence, Structural Metrics
 *   - /api/topology → Signal Set, Topology Summary, Explorer
 *
 * Rules:
 *   - No data change — same API routes as main page
 *   - No semantic change — same component logic as main page
 *   - No full Gauge layout duplication
 *   - TopologyAddon unchanged — passed showTopology=true
 *
 * Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
 */

import Link from 'next/link'
import TopologyAddon from '../components/TopologyAddon'
import {
  useGaugeData,
  useTopologySummary,
  RuntimeIntelligence,
  StructuralMetrics,
  SignalSet,
  TopologySummaryPanel,
} from '../components/GaugeContextPanels'

// ---------------------------------------------------------------------------
// Context strip — compact context inherited from column 3
// ---------------------------------------------------------------------------

function ContextStrip({ gaugeResult, topoResult }) {
  const gaugeData = gaugeResult.data
  const topoData  = topoResult.data

  return (
    <div className="tp-context-strip">

      {/* Runtime Intelligence */}
      <div className="tp-context-block">
        <div className="panel-label">Runtime Intelligence</div>
        {gaugeResult.loading ? (
          <div className="ri-loading">Loading…</div>
        ) : gaugeResult.error ? (
          <div className="ri-error">Unavailable — {gaugeResult.error}</div>
        ) : (
          <RuntimeIntelligence gaugeData={gaugeData} />
        )}
      </div>

      {/* Structural Metrics */}
      <div className="tp-context-block">
        <div className="panel-label">Structural Metrics</div>
        {gaugeResult.loading && topoResult.loading ? (
          <div className="ri-loading">Loading…</div>
        ) : gaugeResult.error && topoResult.error ? (
          <div className="ri-error">Unavailable</div>
        ) : (
          <StructuralMetrics gaugeData={gaugeData} topoData={topoData} />
        )}
      </div>

      {/* Signal Set */}
      <div className="tp-context-block">
        <div className="panel-label">Signal Set</div>
        {topoResult.loading ? (
          <div className="ri-loading">Loading…</div>
        ) : topoResult.error ? (
          <div className="ri-error">Unavailable — {topoResult.error}</div>
        ) : (
          <SignalSet topoData={topoData} />
        )}
      </div>

      {/* Topology Summary */}
      <div className="tp-context-block">
        <div className="panel-label">Topology Summary</div>
        {topoResult.loading ? (
          <div className="ri-loading">Loading…</div>
        ) : topoResult.error ? (
          <div className="ri-error">Unavailable — {topoResult.error}</div>
        ) : (
          <TopologySummaryPanel topoData={topoData} />
        )}
      </div>

    </div>
  )
}

// ---------------------------------------------------------------------------
// Topology page
// ---------------------------------------------------------------------------

export default function TopologyPage() {
  const gaugeResult = useGaugeData()
  const topoResult  = useTopologySummary()

  return (
    <div className="outer">

      {/* ── BACK NAV + PAGE HEADER ── */}
      <div className="tp-back-bar">
        <Link href="/" className="tp-back-link">&#x2190; Back to Gauge</Link>
        <div className="tp-back-identity">
          <span className="tp-back-title">Structural Topology</span>
          <span className="tp-back-sub">binding_envelope.json · PSEE.BLUEEDGE.GAUGE.HANDOFF.01</span>
        </div>
        <div className="header-tag">gauge-v2-product</div>
      </div>

      {/* ── CONTEXT STRIP — column 3 inherited ── */}
      <ContextStrip gaugeResult={gaugeResult} topoResult={topoResult} />

      {/* ── TOPOLOGY EXPLORER — full width ── */}
      <div className="tp-explorer">
        <TopologyAddon showTopology={true} onToggle={() => {}} />
      </div>

    </div>
  )
}

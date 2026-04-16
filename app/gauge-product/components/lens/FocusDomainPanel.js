/**
 * components/lens/FocusDomainPanel.js
 * PRODUCTIZE.LENS.GRAPH.RENDER.01
 *
 * Focus Domain spotlight — Edge Data Acquisition.
 *
 * Grounded in:
 * - Domain DOMAIN-01 (Edge Data Acquisition) — GROUNDED, FUNCTIONAL
 * - SIG-001 (Sensor Bridge Throughput Ceiling) — structural pathway verified,
 *   live throughput confirmation pending (CLM-20 basis)
 * - canonical_topology.json: 4 capabilities, 7 components (components not exposed)
 *
 * Static component — no payload dependency.
 * Data source: lib/lens/curatedGraphData.js
 * Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01 / PRODUCTIZE.LENS.GRAPH.RENDER.01
 *
 * GOVERNANCE:
 * - No component names. No internal IDs.
 * - Capability count (4) is ZONE-2 safe — it is a count, not individual names.
 * - Connected domain names are from the safe admitted 17-domain set.
 */

import { FOCUS_DOMAIN } from '../../lib/lens/curatedGraphData'

export default function FocusDomainPanel() {
  return (
    <div className="lens-focus-panel lens-focus-panel--v2">
      <div className="lens-panel-label">FOCUS DOMAIN</div>

      <div className="lens-focus-v2-header">
        <div>
          <div className="lens-focus-v2-name">{FOCUS_DOMAIN.name}</div>
          <div className="lens-focus-v2-type">{FOCUS_DOMAIN.type}</div>
        </div>
        <span className="lens-focus-v2-badge">VERIFIED</span>
      </div>

      <p className="lens-focus-v2-tagline">{FOCUS_DOMAIN.tagline}</p>

      <div className="lens-focus-v2-rows">
        {FOCUS_DOMAIN.rows.map(row => (
          <div key={row.key} className="lens-focus-v2-row">
            <span className="lens-focus-v2-row-key">{row.key}</span>
            <span className="lens-focus-v2-row-val">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="lens-focus-v2-connections">
        <div className="lens-focus-v2-conn-label">CONNECTED DOMAINS</div>
        <div className="lens-focus-v2-conn-list">
          {FOCUS_DOMAIN.connections.map(c => (
            <div key={c.name} className="lens-focus-v2-conn-item">
              <span className="lens-focus-v2-conn-name">{c.name}</span>
              <span className="lens-focus-v2-conn-note">{c.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

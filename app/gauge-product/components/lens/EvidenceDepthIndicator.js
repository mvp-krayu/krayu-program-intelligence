/**
 * components/lens/EvidenceDepthIndicator.js
 * PRODUCTIZE.LENS.UI.01
 *
 * Depth availability indicator for LENS v1.
 * Shows L1 (current) and L2/L3 availability from trace_depth_available.
 *
 * Consumes ZONE-2 projection payloads only.
 * trace_depth_available: ["L2", "L3"] | []
 */

const DEPTH_LABELS = {
  L1: 'Executive Summary',
  L2: 'Operational Detail',
  L3: 'Full Audit Trail',
}

export default function EvidenceDepthIndicator({ payload }) {
  if (!payload || payload.error_type || payload.zone !== 'ZONE-2') return null

  const available = Array.isArray(payload.trace_depth_available)
    ? payload.trace_depth_available
    : []

  const depths = [
    { id: 'L1', active: true,                   avail: true },
    { id: 'L2', active: false, avail: available.includes('L2') },
    { id: 'L3', active: false, avail: available.includes('L3') },
  ]

  return (
    <div className="lens-depth-panel">
      <div className="lens-panel-label">EVIDENCE DEPTH</div>
      <div className="lens-depth-track">
        {depths.map(({ id, active, avail }, idx) => (
          <div key={id} className="lens-depth-step">
            <div className={[
              'lens-depth-node',
              active ? 'lens-depth-node--active' : '',
              !active && avail ? 'lens-depth-node--available' : '',
              !avail && !active ? 'lens-depth-node--locked' : '',
            ].filter(Boolean).join(' ')}>
              {id}
            </div>
            <div className={`lens-depth-label ${active ? 'lens-depth-label--active' : ''}`}>
              {DEPTH_LABELS[id]}
              {active && <span className="lens-depth-current-tag">CURRENT</span>}
              {!active && avail && <span className="lens-depth-avail-tag">AVAILABLE</span>}
            </div>
            {idx < depths.length - 1 && (
              <div className={`lens-depth-connector ${avail ? 'lens-depth-connector--live' : ''}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

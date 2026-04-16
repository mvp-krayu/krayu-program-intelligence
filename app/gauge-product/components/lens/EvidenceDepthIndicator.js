/**
 * components/lens/EvidenceDepthIndicator.js
 * PRODUCTIZE.LENS.UI.01 / PRODUCTIZE.LENS.COMMERCIAL.GATING.01
 *
 * Depth availability indicator for LENS v1.
 * Shows L1 (current) and L2/L3 availability from trace_depth_available.
 * L2/L3 "AVAILABLE" tags are gated — clicking opens AccessGateModal.
 *
 * Props:
 *   payload   — ZONE-2 projection payload
 *   onUnlock  — () => void — opens AccessGateModal
 *   hasAccess — boolean    — when true, AVAILABLE shown without unlock prompt
 */

const DEPTH_LABELS = {
  L1: 'Executive Summary',
  L2: 'Operational Detail',
  L3: 'Full Audit Trail',
}

export default function EvidenceDepthIndicator({ payload, onUnlock, hasAccess }) {
  if (!payload || payload.error_type || payload.zone !== 'ZONE-2') return null

  const available = Array.isArray(payload.trace_depth_available)
    ? payload.trace_depth_available
    : []

  const depths = [
    { id: 'L1', active: true,  avail: true },
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
              {!active && avail && (
                hasAccess ? (
                  <span className="lens-depth-avail-tag">AVAILABLE</span>
                ) : (
                  <button className="lens-depth-avail-tag lens-depth-avail-tag--unlock" onClick={onUnlock}>
                    AVAILABLE → UNLOCK
                  </button>
                )
              )}
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

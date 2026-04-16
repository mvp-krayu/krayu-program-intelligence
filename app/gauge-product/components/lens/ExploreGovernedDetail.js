/**
 * components/lens/ExploreGovernedDetail.js
 * PRODUCTIZE.LENS.TOPOLOGY.INTELLIGENCE.01
 * PRODUCTIZE.LENS.COMMERCIAL.GATING.01 / PRODUCTIZE.LENS.FINAL.POLISH.01
 *
 * Explore Governed Detail — governed visibility block.
 *
 * Gating model (FINAL.POLISH.01):
 *   Gated rows show ONE state only:
 *   - hasAccess=false → "Restricted" + [Unlock] button
 *   - hasAccess=true  → "Available" (plain label, no button)
 *
 * Props:
 *   onUnlock  — () => void — opens AccessGateModal
 *   hasAccess — boolean
 */

import Link from 'next/link'

const VISIBILITY_ROWS = [
  {
    label:  'Structural Coverage',
    value:  'Complete',
    status: 'verified',
    note:   'All structural components examined and accounted for.',
    gated:  false,
  },
  {
    label:  'Operational Measurement',
    value:  'Partial',
    status: 'pending',
    note:   'Runtime execution assessment not yet completed.',
    gated:  false,
  },
  {
    label:  'Trace Access',
    value:  'Available',
    status: 'available',
    note:   'Deeper evidence chains accessible on request.',
    gated:  true,
  },
  {
    label:  'Audit Depth',
    value:  'Available',
    status: 'available',
    note:   'Full audit trail accessible for governance and verification.',
    gated:  true,
  },
]

export default function ExploreGovernedDetail({ onUnlock, hasAccess }) {
  return (
    <div className="lens-explore-panel">
      <div className="lens-panel-label">EXPLORE GOVERNED DETAIL</div>
      <p className="lens-explore-intro">
        The intelligence underlying this view is governed and traceable. Deeper visibility is available
        for stakeholders who require operational detail, evidence chains, or technical validation.
      </p>

      <div className="lens-explore-rows">
        {VISIBILITY_ROWS.map(r => (
          <div key={r.label} className="lens-explore-row">
            <span className="lens-explore-row-label">{r.label}</span>

            {r.gated && !hasAccess ? (
              <span className="lens-explore-row-value-gated">
                <span className="lens-explore-row-value lens-explore-row-value--restricted">
                  Restricted
                </span>
                <button className="lens-unlock-btn" onClick={onUnlock}>
                  Unlock
                </button>
              </span>
            ) : (
              <span className={`lens-explore-row-value lens-explore-row-value--${r.status}`}>
                {r.value}
              </span>
            )}

            {r.note && <span className="lens-explore-row-note">{r.note}</span>}
          </div>
        ))}
      </div>

      <div className="lens-explore-cta">
        {hasAccess ? (
          <Link href="/topology" className="lens-explore-link">
            View governed detail →
          </Link>
        ) : (
          <button className="lens-explore-link lens-explore-link--gated" onClick={onUnlock}>
            Unlock governed detail →
          </button>
        )}
      </div>
    </div>
  )
}

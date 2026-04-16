/**
 * components/lens/ExploreGovernedDetail.js
 * PRODUCTIZE.LENS.TOPOLOGY.INTELLIGENCE.01
 *
 * Explore Governed Detail — prominent CTA block.
 * Replaces ExecutionVisibilityMap.
 * Four visibility rows + "View governed detail →" link to /topology.
 *
 * Static content — no payload dependency.
 */

const VISIBILITY_ROWS = [
  {
    label:  'Structural Coverage',
    value:  'Complete',
    status: 'verified',
    note:   'All structural components examined and accounted for.',
  },
  {
    label:  'Operational Measurement',
    value:  'Partial',
    status: 'pending',
    note:   'Runtime execution assessment not yet completed.',
  },
  {
    label:  'Trace Access',
    value:  'Available',
    status: 'available',
    note:   'Deeper evidence chains accessible on request.',
  },
  {
    label:  'Audit Depth',
    value:  'Available',
    status: 'available',
    note:   'Full audit trail accessible for governance and verification.',
  },
]

export default function ExploreGovernedDetail() {
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
            <span className={`lens-explore-row-value lens-explore-row-value--${r.status}`}>{r.value}</span>
            {r.note && <span className="lens-explore-row-note">{r.note}</span>}
          </div>
        ))}
      </div>

      <div className="lens-explore-cta">
        <a href="/topology" className="lens-explore-link">View governed detail →</a>
        <span className="lens-explore-cta-note">
          Operational detail, evidence chains, and trace-level interrogation available in the governed topology view.
        </span>
      </div>
    </div>
  )
}

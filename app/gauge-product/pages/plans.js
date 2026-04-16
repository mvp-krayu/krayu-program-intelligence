/**
 * pages/plans.js
 * PRODUCTIZE.LENS.COMMERCIAL.GATING.01
 *
 * Access Plans — placeholder page.
 * Describes LENS / Advanced Access / Enterprise Access tiers.
 * No pricing logic. No backend. Static content.
 */

import Link from 'next/link'

const TIERS = [
  {
    name:     'LENS',
    tag:      'Included',
    accent:   '#3fb950',
    desc:     'Executive intelligence surface. Governed structural readiness assessment with ZONE-2 projection at L1 depth.',
    features: [
      'Executive readiness summary',
      'System intelligence overview — 17 domains',
      'Structural topology view',
      'Focus domain spotlight',
      'Score confidence range',
      'Decision guidance',
      'Observability advantage overview',
    ],
  },
  {
    name:     'Advanced Access',
    tag:      'Entitlement Required',
    accent:   '#58a6ff',
    desc:     'Operational and audit depth. Extends LENS with trace interrogation, capability-level topology, and evidence chain validation.',
    features: [
      'Operational detail — L2 depth',
      'Full audit trail — L3 depth',
      'Full trace interrogation',
      'Capability-level topology',
      'Evidence chain validation',
      'Signal-to-conclusion traceability',
    ],
  },
  {
    name:     'Enterprise Access',
    tag:      'Governed Contract',
    accent:   '#d29922',
    desc:     'Full operator surface. Complete program intelligence with direct access to the governed topology and evidence vault.',
    features: [
      'All Advanced Access capabilities',
      'Full operator topology surface',
      'Direct evidence vault access',
      'Program-level intelligence queries',
      'Integration planning support',
      'Dedicated trace and audit access',
    ],
  },
]

export default function PlansPage() {
  return (
    <div className="plans-page">

      <div className="plans-header">
        <div className="plans-eyebrow">PROGRAM INTELLIGENCE LENS</div>
        <h1 className="plans-title">Access Plans</h1>
        <p className="plans-sub">
          Intelligence depth is governed and entitlement-based. Each tier unlocks
          additional visibility into the structural and operational assessment.
        </p>
      </div>

      <div className="plans-grid">
        {TIERS.map(tier => (
          <div key={tier.name} className="plans-card">
            <div className="plans-card-header">
              <div className="plans-card-name" style={{ color: tier.accent }}>
                {tier.name}
              </div>
              <span
                className="plans-card-tag"
                style={{ color: tier.accent, borderColor: tier.accent + '55', background: tier.accent + '11' }}
              >
                {tier.tag}
              </span>
            </div>
            <p className="plans-card-desc">{tier.desc}</p>
            <ul className="plans-card-features">
              {tier.features.map(f => (
                <li key={f} className="plans-card-feature">
                  <span className="plans-feature-marker" style={{ color: tier.accent }}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="plans-footer-note">
        Access entitlements are issued separately. Contact your program intelligence representative
        for Advanced Access or Enterprise Access credentials.
      </div>

      <div className="plans-back">
        <Link href="/lens" className="plans-back-link">← Return to LENS</Link>
      </div>

    </div>
  )
}

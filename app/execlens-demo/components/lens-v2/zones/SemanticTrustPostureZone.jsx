const TRUST_COLOR_MAP = {
  AUTHORITY: '#64ffda', CERTIFIED: '#64ffda', EXACT: '#64ffda',
  STRONG: '#4a9eff', PARTIAL: '#ffd700', RECONCILED: '#ffd700',
  HYDRATED: '#ff9e4a', NONE: '#ff6b6b',
}

export default function SemanticTrustPostureZone({ binding, densityClass, boardroomMode }) {
  if (!binding || !binding.available) return null
  const { trustPosture, debtVisibility, temporalVisibility, evidenceVisibility, propagationVisibility, structuralBacking } = binding

  if (!trustPosture) return null

  if (boardroomMode) {
    return (
      <div className="trust-zone trust-zone--boardroom">
        <div className="trust-zone-strip">
          <span className="trust-zone-level" style={{ color: trustPosture.color }}>{trustPosture.label}</span>
          <span className="trust-zone-sep">·</span>
          <span className="trust-zone-s-state">{trustPosture.s_state}</span>
          <span className="trust-zone-sep">·</span>
          <span className="trust-zone-q-class">{trustPosture.q_class}</span>
          {temporalVisibility && (
            <>
              <span className="trust-zone-sep">·</span>
              <span className="trust-zone-trend" style={{ color: temporalVisibility.trend_color }}>{temporalVisibility.trend}</span>
            </>
          )}
        </div>
      </div>
    )
  }

  const isBalanced = densityClass === 'EXECUTIVE_BALANCED'
  const isInvestigation = densityClass === 'INVESTIGATION_DENSE'

  if (isBalanced) {
    return (
      <div className="trust-zone trust-zone--executive_balanced trust-zone--simplified">
        <div className="trust-zone-compact">
          <span className="trust-zone-compact-level" style={{ color: trustPosture.color }}>{trustPosture.label}</span>
          <span className="trust-zone-compact-sep">·</span>
          <span className="trust-zone-compact-state">{trustPosture.s_state}</span>
          <span className="trust-zone-compact-sep">·</span>
          <span className="trust-zone-compact-grounding">{trustPosture.grounding_pct}% grounded</span>
          {trustPosture.maturity_classification && (
            <>
              <span className="trust-zone-compact-sep">·</span>
              <span className="trust-zone-compact-maturity">{trustPosture.maturity_classification}</span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`trust-zone trust-zone--${densityClass.toLowerCase()}`}>
      <div className="trust-zone-header">
        <span className="trust-zone-header-label">SEMANTIC TRUST POSTURE</span>
        <span className="trust-zone-header-level" style={{ color: trustPosture.color, borderColor: trustPosture.color }}>
          {trustPosture.label}
        </span>
      </div>

      <div className="trust-zone-qualification">
        <div className="trust-zone-qual-primary">
          <div className="trust-zone-qual-badge" style={{ borderColor: trustPosture.color }}>
            <span className="trust-zone-qual-s-state">{trustPosture.s_state}</span>
            <span className="trust-zone-qual-q-class">{trustPosture.q_class}</span>
          </div>
          <div className="trust-zone-qual-detail">
            <span className="trust-zone-qual-grounding">{trustPosture.grounding_pct}% structurally grounded</span>
            {trustPosture.maturity_score != null && (
              <span className="trust-zone-qual-maturity">Maturity {(trustPosture.maturity_score * 100).toFixed(0)}% · {trustPosture.maturity_classification}</span>
            )}
          </div>
        </div>
        {trustPosture.progression_readiness != null && (
          <div className="trust-zone-progression">
            <span className="trust-zone-progression-label">→ {trustPosture.progression_target}</span>
            <div className="trust-zone-progression-bar-wrap">
              <div className="trust-zone-progression-bar" style={{ width: `${trustPosture.progression_readiness * 100}%` }} />
            </div>
            <span className="trust-zone-progression-pct">{(trustPosture.progression_readiness * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {(
        <div className="trust-zone-metrics">
          {debtVisibility && (
            <div className="trust-zone-metric-card">
              <div className="trust-zone-metric-label">SEMANTIC DEBT</div>
              <div className="trust-zone-metric-value" style={{ color: debtVisibility.exposure_color }}>{debtVisibility.weighted_debt_score}</div>
              <div className="trust-zone-metric-sub">{debtVisibility.operational_exposure} exposure · {debtVisibility.blocking_count} blocking {trustPosture.progression_target}</div>
              <div className="trust-zone-metric-detail">
                <span>{debtVisibility.irreducible_count} irreducible</span>
                <span className="trust-zone-metric-detail-sep">·</span>
                <span>{debtVisibility.reducible_count} reducible</span>
              </div>
            </div>
          )}
          {temporalVisibility && (
            <div className="trust-zone-metric-card">
              <div className="trust-zone-metric-label">TEMPORAL TREND</div>
              <div className="trust-zone-metric-value" style={{ color: temporalVisibility.trend_color }}>{temporalVisibility.trend}</div>
              {temporalVisibility.enrichment_grade && (
                <div className="trust-zone-metric-sub">Enrichment: {temporalVisibility.enrichment_grade} · +{temporalVisibility.enrichment_lift_pct}% lift</div>
              )}
              {temporalVisibility.debt_reduction_pct != null && (
                <div className="trust-zone-metric-detail">{temporalVisibility.debt_reduction_pct}% debt reduction</div>
              )}
            </div>
          )}
          {evidenceVisibility && (
            <div className="trust-zone-metric-card">
              <div className="trust-zone-metric-label">EVIDENCE INTEGRITY</div>
              <div className="trust-zone-metric-value" style={{ color: evidenceVisibility.integrity_color }}>{evidenceVisibility.all_valid ? 'VALID' : 'ISSUES'}</div>
              <div className="trust-zone-metric-sub">{evidenceVisibility.accepted} accepted · {evidenceVisibility.covered_domains} domains covered</div>
              {(evidenceVisibility.rejected > 0 || evidenceVisibility.quarantined > 0) && (
                <div className="trust-zone-metric-detail trust-zone-metric-detail--warn">
                  {evidenceVisibility.rejected > 0 && <span>{evidenceVisibility.rejected} rejected</span>}
                  {evidenceVisibility.quarantined > 0 && <span>{evidenceVisibility.quarantined} quarantined</span>}
                </div>
              )}
            </div>
          )}
          {propagationVisibility && (
            <div className="trust-zone-metric-card">
              <div className="trust-zone-metric-label">PROPAGATION</div>
              <div className="trust-zone-metric-value" style={{ color: propagationVisibility.gate_color }}>{propagationVisibility.ready ? 'READY' : 'BLOCKED'}</div>
              <div className="trust-zone-metric-sub">{propagationVisibility.gates_met}/{propagationVisibility.gate_count} gates met</div>
              {propagationVisibility.blocking_gates && propagationVisibility.blocking_gates.length > 0 && (
                <div className="trust-zone-metric-detail trust-zone-metric-detail--warn">
                  {propagationVisibility.blocking_gates.map(g => <span key={g}>{g.replace(/_/g, ' ')}</span>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isInvestigation && structuralBacking && (
        <div className="trust-zone-structural">
          <div className="trust-zone-structural-label">STRUCTURAL BACKING DETAIL</div>
          <div className="trust-zone-structural-grid">
            <div className="trust-zone-structural-cell">
              <span className="trust-zone-structural-value">{structuralBacking.reconciled}/{structuralBacking.total_domains}</span>
              <span className="trust-zone-structural-key">Reconciled</span>
            </div>
            <div className="trust-zone-structural-cell">
              <span className="trust-zone-structural-value">{structuralBacking.reconciliation_pct}%</span>
              <span className="trust-zone-structural-key">Ratio</span>
            </div>
            <div className="trust-zone-structural-cell">
              <span className="trust-zone-structural-value">{structuralBacking.weighted_confidence}</span>
              <span className="trust-zone-structural-key">Weighted Confidence</span>
            </div>
            <div className="trust-zone-structural-cell">
              <span className="trust-zone-structural-value">{structuralBacking.unresolved_count}</span>
              <span className="trust-zone-structural-key">Unresolved</span>
            </div>
          </div>
          {structuralBacking.unresolved_domains && structuralBacking.unresolved_domains.length > 0 && (
            <div className="trust-zone-unresolved-disclosure">
              <div className="trust-zone-unresolved-label">UNRESOLVED DOMAIN DISCLOSURE</div>
              {structuralBacking.unresolved_domains.map(d => (
                <div key={d.domain_id} className="trust-zone-unresolved-item">
                  <span className="trust-zone-unresolved-id">{d.domain_id}</span>
                  <span className="trust-zone-unresolved-name">{d.domain_name}</span>
                  {d.domain_type && <span className="trust-zone-unresolved-type">{d.domain_type}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ReconciliationCorrespondencePanel({ reconciliationData }) {
  if (!reconciliationData) {
    return (
      <div className="sqo-panel sqo-panel--empty">
        <h2>Reconciliation Correspondence</h2>
        <p className="sqo-panel__empty-notice">No reconciliation data available. Run the correspondence compiler to generate.</p>
      </div>
    );
  }

  const summary = reconciliationData.summary;
  const correspondences = reconciliationData.correspondences || [];
  const unmatchedStructural = reconciliationData.unmatched_structural || [];
  const lifecycle = reconciliationData.lifecycle;

  const reconciledPct = summary ? (summary.reconciliation_ratio * 100).toFixed(1) : '0.0';

  return (
    <div className="sqo-panel sqo-panel--reconciliation">
      <h2>Reconciliation Correspondence</h2>

      {lifecycle && <LifecycleProjection lifecycle={lifecycle} />}

      <div className="sqo-recon-summary">
        <div className="sqo-recon-summary__ratio">
          <span className="sqo-recon-summary__ratio-value">{reconciledPct}%</span>
          <span className="sqo-recon-summary__ratio-label">Reconciled</span>
        </div>
        <div className="sqo-recon-summary__counts">
          <div className="sqo-recon-count">
            <span className="sqo-recon-count__value">{summary.reconciled_count}</span>
            <span className="sqo-recon-count__label">Reconciled</span>
          </div>
          <div className="sqo-recon-count">
            <span className="sqo-recon-count__value">{summary.unreconciled_count}</span>
            <span className="sqo-recon-count__label">Unreconciled</span>
          </div>
          <div className="sqo-recon-count">
            <span className="sqo-recon-count__value">{summary.total_semantic_domains}</span>
            <span className="sqo-recon-count__label">Total Domains</span>
          </div>
          <div className="sqo-recon-count">
            <span className="sqo-recon-count__value">{summary.weighted_confidence_score}%</span>
            <span className="sqo-recon-count__label">Weighted Confidence</span>
          </div>
        </div>
      </div>

      <div className="sqo-recon-distribution">
        <h3>Confidence Distribution</h3>
        <div className="sqo-recon-distribution__bars">
          {[
            { level: 5, label: 'L5 Structurally Grounded', count: summary.confidence_distribution.level_5_structurally_grounded, className: 'l5' },
            { level: 4, label: 'L4 Observationally Corroborated', count: summary.confidence_distribution.level_4_observationally_corroborated, className: 'l4' },
            { level: 3, label: 'L3 Semantically Coherent', count: summary.confidence_distribution.level_3_semantically_coherent, className: 'l3' },
            { level: 2, label: 'L2 Upstream Evidence Bound', count: summary.confidence_distribution.level_2_upstream_evidence_bound, className: 'l2' },
            { level: 1, label: 'L1 Unmapped', count: summary.confidence_distribution.level_1_unmapped, className: 'l1' },
          ].map(({ level, label, count, className }) => (
            <div key={level} className={`sqo-recon-bar sqo-recon-bar--${className}`}>
              <span className="sqo-recon-bar__label">{label}</span>
              <div className="sqo-recon-bar__track">
                <div
                  className="sqo-recon-bar__fill"
                  style={{ width: `${summary.total_semantic_domains > 0 ? (count / summary.total_semantic_domains) * 100 : 0}%` }}
                />
              </div>
              <span className="sqo-recon-bar__count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sqo-recon-table">
        <h3>Per-Domain Correspondence</h3>
        <table className="sqo-recon-table__table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Confidence</th>
              <th>Structural Link</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {correspondences.map((c) => (
              <tr key={c.semantic_domain_id} className={`sqo-recon-row sqo-recon-row--l${c.confidence_level}`}>
                <td>
                  <span className="sqo-recon-row__domain-id">{c.semantic_domain_id}</span>
                  <span className="sqo-recon-row__domain-name">{c.semantic_domain_name}</span>
                </td>
                <td>
                  <span className={`sqo-recon-badge sqo-recon-badge--l${c.confidence_level}`}>
                    L{c.confidence_level}
                  </span>
                  <span className="sqo-recon-row__confidence-label">{c.confidence_label}</span>
                </td>
                <td>
                  {c.structural_dom_id ? (
                    <span className="sqo-recon-row__structural">
                      {c.structural_dom_id}
                      {c.structural_domain_name && <span className="sqo-recon-row__structural-name"> ({c.structural_domain_name})</span>}
                    </span>
                  ) : (
                    <span className="sqo-recon-row__no-link">No structural link</span>
                  )}
                </td>
                <td>
                  <span className={`sqo-recon-status sqo-recon-status--${c.reconciliation_status.toLowerCase()}`}>
                    {c.reconciliation_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {unmatchedStructural.length > 0 && (
        <div className="sqo-recon-unmatched">
          <h3>Unmatched Structural Domains ({unmatchedStructural.length})</h3>
          <p className="sqo-recon-unmatched__note">
            Structural evidence exists with no semantic consumer.
          </p>
          <div className="sqo-recon-unmatched__list">
            {unmatchedStructural.map((u) => (
              <div key={u.structural_dom_id} className="sqo-recon-unmatched__item">
                <span className="sqo-recon-unmatched__dom-id">{u.structural_dom_id}</span>
                <span className="sqo-recon-unmatched__dom-name">{u.structural_domain_name}</span>
                <span className="sqo-recon-unmatched__count">{u.component_count} components</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function LifecycleProjection({ lifecycle }) {
  const { trend, trajectory, currentPosture, epochSummary, latestDelta, semanticDebt, unresolvedDomains, provenance } = lifecycle;

  return (
    <div className="sqo-lifecycle">
      <div className="sqo-lifecycle__header">
        <h3>Reconciliation Lifecycle</h3>
        <span className={`sqo-lifecycle__trend sqo-lifecycle__trend--${trend.label.toLowerCase()}`}>
          {trend.label}
        </span>
        <span className="sqo-lifecycle__epoch-count">
          {trend.total_epochs} epoch{trend.total_epochs !== 1 ? 's' : ''}
        </span>
      </div>

      <LifecyclePosture posture={currentPosture} />
      <LifecycleTrajectory trajectory={trajectory} />
      {latestDelta && <LifecycleDelta delta={latestDelta} />}
      <LifecycleSemanticDebt debt={semanticDebt} unresolvedDomains={unresolvedDomains} />
      <LifecycleEpochs epochs={epochSummary} />
      <LifecycleProvenance provenance={provenance} />
    </div>
  );
}


function LifecyclePosture({ posture }) {
  return (
    <div className="sqo-lifecycle__posture">
      <div className="sqo-lifecycle__posture-grid">
        <div className="sqo-lifecycle__posture-item sqo-lifecycle__posture-item--primary">
          <span className="sqo-lifecycle__posture-value">{posture.weighted_confidence}%</span>
          <span className="sqo-lifecycle__posture-label">Weighted Confidence</span>
        </div>
        <div className="sqo-lifecycle__posture-item">
          <span className="sqo-lifecycle__posture-value">{posture.reconciliation_ratio_pct}%</span>
          <span className="sqo-lifecycle__posture-label">Reconciliation Ratio</span>
        </div>
        <div className="sqo-lifecycle__posture-item">
          <span className="sqo-lifecycle__posture-value">{posture.resolved_count}/{posture.total_domains}</span>
          <span className="sqo-lifecycle__posture-label">Resolved Domains</span>
        </div>
        <div className="sqo-lifecycle__posture-item">
          <span className="sqo-lifecycle__posture-value">{posture.unresolved_count}</span>
          <span className="sqo-lifecycle__posture-label">Unresolved</span>
        </div>
      </div>
    </div>
  );
}


function LifecycleTrajectory({ trajectory }) {
  const labels = trajectory.epoch_labels;
  const confidence = trajectory.weighted_confidence;
  const unresolved = trajectory.unresolved;

  if (labels.length < 2) return null;

  const maxConf = Math.max(...confidence);
  const maxUnres = Math.max(...unresolved);

  return (
    <div className="sqo-lifecycle__trajectory">
      <h4>Confidence Trajectory</h4>
      <div className="sqo-lifecycle__trajectory-chart">
        {labels.map((label, i) => (
          <div key={label} className="sqo-lifecycle__trajectory-epoch">
            <div className="sqo-lifecycle__trajectory-bars">
              <div className="sqo-lifecycle__trajectory-bar-wrap">
                <div
                  className="sqo-lifecycle__trajectory-bar sqo-lifecycle__trajectory-bar--confidence"
                  style={{ height: `${maxConf > 0 ? (confidence[i] / maxConf) * 100 : 0}%` }}
                />
              </div>
              <div className="sqo-lifecycle__trajectory-bar-wrap">
                <div
                  className="sqo-lifecycle__trajectory-bar sqo-lifecycle__trajectory-bar--unresolved"
                  style={{ height: `${maxUnres > 0 ? (unresolved[i] / maxUnres) * 100 : 0}%` }}
                />
              </div>
            </div>
            <span className="sqo-lifecycle__trajectory-label">{label}</span>
            <span className="sqo-lifecycle__trajectory-value">{confidence[i]}%</span>
          </div>
        ))}
      </div>
      <div className="sqo-lifecycle__trajectory-legend">
        <span className="sqo-lifecycle__legend-item sqo-lifecycle__legend-item--confidence">Confidence</span>
        <span className="sqo-lifecycle__legend-item sqo-lifecycle__legend-item--unresolved">Unresolved</span>
      </div>
    </div>
  );
}


function LifecycleDelta({ delta }) {
  const confSign = delta.weighted_confidence_change > 0 ? '+' : '';

  return (
    <div className="sqo-lifecycle__delta">
      <h4>Latest Delta: {delta.from_label} → {delta.to_label}</h4>
      <div className="sqo-lifecycle__delta-grid">
        <div className="sqo-lifecycle__delta-item">
          <span className="sqo-lifecycle__delta-label">Confidence</span>
          <span className={`sqo-lifecycle__delta-value ${delta.weighted_confidence_change > 0 ? 'sqo-lifecycle__delta-value--positive' : delta.weighted_confidence_change < 0 ? 'sqo-lifecycle__delta-value--negative' : ''}`}>
            {confSign}{delta.weighted_confidence_change}
          </span>
          <span className="sqo-lifecycle__delta-detail">{delta.weighted_confidence_from} → {delta.weighted_confidence_to}</span>
        </div>
        <div className="sqo-lifecycle__delta-item">
          <span className="sqo-lifecycle__delta-label">Improved</span>
          <span className="sqo-lifecycle__delta-value sqo-lifecycle__delta-value--positive">{delta.domains_improved_count}</span>
          <span className="sqo-lifecycle__delta-detail">domains</span>
        </div>
        <div className="sqo-lifecycle__delta-item">
          <span className="sqo-lifecycle__delta-label">Degraded</span>
          <span className={`sqo-lifecycle__delta-value ${delta.domains_degraded_count > 0 ? 'sqo-lifecycle__delta-value--negative' : ''}`}>{delta.domains_degraded_count}</span>
          <span className="sqo-lifecycle__delta-detail">domains</span>
        </div>
        <div className="sqo-lifecycle__delta-item">
          <span className="sqo-lifecycle__delta-label">Unchanged</span>
          <span className="sqo-lifecycle__delta-value">{delta.domains_unchanged_count}</span>
          <span className="sqo-lifecycle__delta-detail">domains</span>
        </div>
      </div>

      {delta.level_movement && (
        <div className="sqo-lifecycle__delta-levels">
          <span className="sqo-lifecycle__delta-levels-title">Level Movement</span>
          <div className="sqo-lifecycle__delta-levels-row">
            {['L5', 'L4', 'L3', 'L2', 'L1'].map(level => {
              const val = delta.level_movement[level] || 0;
              return (
                <span key={level} className={`sqo-lifecycle__delta-level ${val > 0 ? 'sqo-lifecycle__delta-level--up' : val < 0 ? 'sqo-lifecycle__delta-level--down' : ''}`}>
                  {level}: {val > 0 ? '+' : ''}{val}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {delta.domain_movements && delta.domain_movements.length > 0 && (
        <div className="sqo-lifecycle__delta-movements">
          <span className="sqo-lifecycle__delta-movements-title">Per-Domain Movement</span>
          {delta.domain_movements.map(m => (
            <div key={m.domain_id} className="sqo-lifecycle__delta-movement">
              <span className="sqo-lifecycle__delta-movement-id">{m.domain_id}</span>
              <span className="sqo-lifecycle__delta-movement-name">{m.domain_name}</span>
              <span className={`sqo-lifecycle__delta-movement-change ${m.delta > 0 ? 'sqo-lifecycle__delta-movement-change--up' : 'sqo-lifecycle__delta-movement-change--down'}`}>
                L{m.from_level} → L{m.to_level}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function LifecycleSemanticDebt({ debt, unresolvedDomains }) {
  return (
    <div className="sqo-lifecycle__debt">
      <h4>Semantic Debt</h4>
      <div className="sqo-lifecycle__debt-summary">
        <div className="sqo-lifecycle__debt-stat">
          <span className="sqo-lifecycle__debt-stat-value">{debt.total_unresolved}</span>
          <span className="sqo-lifecycle__debt-stat-label">Unresolved</span>
        </div>
        <div className="sqo-lifecycle__debt-stat">
          <span className="sqo-lifecycle__debt-stat-value">{debt.resolution_rate}%</span>
          <span className="sqo-lifecycle__debt-stat-label">Resolution Rate</span>
        </div>
      </div>

      {unresolvedDomains && unresolvedDomains.length > 0 && (
        <div className="sqo-lifecycle__debt-domains">
          <span className="sqo-lifecycle__debt-domains-title">Unresolved Domains</span>
          {unresolvedDomains.map(d => (
            <div key={d.domain_id} className="sqo-lifecycle__debt-domain">
              <span className="sqo-lifecycle__debt-domain-id">{d.domain_id}</span>
              <span className="sqo-lifecycle__debt-domain-name">{d.domain_name}</span>
              <span className="sqo-lifecycle__debt-domain-type">{d.domain_type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function LifecycleEpochs({ epochs }) {
  return (
    <div className="sqo-lifecycle__epochs">
      <h4>Epoch History</h4>
      <div className="sqo-lifecycle__epochs-timeline">
        {epochs.map((epoch, i) => (
          <div key={epoch.epoch_id} className={`sqo-lifecycle__epoch ${i === epochs.length - 1 ? 'sqo-lifecycle__epoch--current' : ''}`}>
            <div className="sqo-lifecycle__epoch-marker">
              <span className="sqo-lifecycle__epoch-dot" />
              {i < epochs.length - 1 && <span className="sqo-lifecycle__epoch-connector" />}
            </div>
            <div className="sqo-lifecycle__epoch-content">
              <div className="sqo-lifecycle__epoch-header">
                <span className="sqo-lifecycle__epoch-label">{epoch.label}</span>
                <span className="sqo-lifecycle__epoch-type">{epoch.enrichment_type === 'NONE' ? 'Baseline' : epoch.enrichment_type.replace(/_/g, ' ').toLowerCase()}</span>
              </div>
              <div className="sqo-lifecycle__epoch-stats">
                <span>Confidence: {epoch.weighted_confidence}%</span>
                <span>Unresolved: {epoch.unresolved}</span>
                <span>L5={epoch.distribution.L5} L3={epoch.distribution.L3} L2={epoch.distribution.L2} L1={epoch.distribution.L1}</span>
              </div>
              <div className="sqo-lifecycle__epoch-source">
                {epoch.source_stream}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function LifecycleProvenance({ provenance }) {
  return (
    <div className="sqo-lifecycle__provenance">
      <h4>Replay Provenance</h4>
      <div className="sqo-lifecycle__provenance-grid">
        <div className="sqo-lifecycle__provenance-row">
          <span className="sqo-lifecycle__provenance-key">Version</span>
          <span className="sqo-lifecycle__provenance-value">{provenance.lifecycle_version}</span>
        </div>
        <div className="sqo-lifecycle__provenance-row">
          <span className="sqo-lifecycle__provenance-key">Schema</span>
          <span className="sqo-lifecycle__provenance-value">{provenance.schema_version}</span>
        </div>
        <div className="sqo-lifecycle__provenance-row">
          <span className="sqo-lifecycle__provenance-key">Generated</span>
          <span className="sqo-lifecycle__provenance-value">{provenance.generated_at}</span>
        </div>
        {provenance.governance && (
          <>
            <div className="sqo-lifecycle__provenance-row">
              <span className="sqo-lifecycle__provenance-key">Deterministic</span>
              <span className="sqo-lifecycle__provenance-value">{provenance.governance.deterministic ? 'YES' : 'NO'}</span>
            </div>
            <div className="sqo-lifecycle__provenance-row">
              <span className="sqo-lifecycle__provenance-key">Replay-Safe</span>
              <span className="sqo-lifecycle__provenance-value">{provenance.governance.replay_safe ? 'YES' : 'NO'}</span>
            </div>
            <div className="sqo-lifecycle__provenance-row">
              <span className="sqo-lifecycle__provenance-key">No New Inference</span>
              <span className="sqo-lifecycle__provenance-value">{provenance.governance.no_new_inference ? 'YES' : 'NO'}</span>
            </div>
          </>
        )}
      </div>
      <div className="sqo-lifecycle__provenance-sources">
        <span className="sqo-lifecycle__provenance-sources-title">Epoch Sources</span>
        {provenance.epoch_sources.map(s => (
          <div key={s.epoch_label} className="sqo-lifecycle__provenance-source">
            <span className="sqo-lifecycle__provenance-source-label">{s.epoch_label}</span>
            <span className="sqo-lifecycle__provenance-source-stream">{s.source_stream}</span>
            <span className="sqo-lifecycle__provenance-source-artifact">{s.source_artifact}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

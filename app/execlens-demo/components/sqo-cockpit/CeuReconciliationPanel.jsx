import { useState } from 'react';

const STATE_COLORS = {
  PROPOSED: 'var(--sqo-dim, #7a8aaa)',
  EVIDENCE_ATTACHED: 'var(--sqo-accent, #4a9eff)',
  RECONCILED: 'var(--sqo-yellow, #ffd700)',
  CONFIRMED: 'var(--sqo-green, #64ffda)',
  REJECTED: 'var(--sqo-red, #ff6b6b)',
  MERGED: 'var(--sqo-orange, #ff9e4a)',
};

const TIER_LABELS = {
  FOUNDATION: 'FND',
  OPERATIONAL_DOMAIN: 'OPS',
  CONSUMER: 'CON',
};

const ACTION_LABELS = {
  ceu_attach_evidence: 'Attach Evidence',
  ceu_reconcile: 'Reconcile',
  ceu_confirm: 'Confirm',
  ceu_reject: 'Reject',
  ceu_merge: 'Merge',
  ceu_split: 'Split',
  ceu_reclassify: 'Reclassify',
  ceu_resolve_obligation: 'Resolve',
};

async function postCeuAction(payload) {
  const res = await fetch('/api/sqo/ceu-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

const REVIEW_MODE_LABELS = {
  UNCLASSIFIED: 'Unclassified',
  SYSTEM_TEST: 'System Test',
  OPERATOR_VALIDATED: 'Operator Validated',
  DOMAIN_AUTHORITY_VALIDATED: 'Domain Authority Validated',
};

function PromotionGateBanner({ gateStatus, summary, reviewMode, client, runId, onActionComplete }) {
  const permitted = gateStatus.semantic_derivation_permitted;
  const reviewSufficient = gateStatus.review_sufficient;
  const mode = reviewMode || 'UNCLASSIFIED';
  const allResolved = gateStatus.all_candidates_resolved;
  const noObligations = gateStatus.unresolved_obligations === 0;
  const canClassify = !reviewSufficient && allResolved && noObligations;

  const [actorId, setActorId] = useState('operator:khorrix');
  const [justification, setJustification] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const handleClassify = async (targetMode) => {
    if (!justification) {
      setError('Justification is required for review classification');
      return;
    }
    setPending(true);
    setError(null);
    const result = await postCeuAction({
      action: 'ceu_classify_review',
      client,
      runId,
      actor_id: actorId,
      target_ceu_id: targetMode,
      justification,
    });
    setPending(false);
    if (result.success) {
      onActionComplete();
    } else {
      setError(result.detail || result.error);
    }
  };

  return (
    <div className={`ceu-gate-banner ceu-gate-banner--${permitted ? 'permitted' : 'blocked'}`}>
      <div className="ceu-gate-banner__header">
        <span className="ceu-gate-banner__label">PROMOTION GATE</span>
        <span className={`ceu-gate-banner__status ceu-gate-banner__status--${permitted ? 'permitted' : 'blocked'}`}>
          {permitted ? 'SEMANTIC DERIVATION PERMITTED' : 'SEMANTIC DERIVATION BLOCKED'}
        </span>
      </div>
      <div className="ceu-gate-banner__review-mode">
        <span className="ceu-gate-banner__review-label">REVIEW MODE</span>
        <span className={`ceu-gate-banner__review-value ceu-gate-banner__review-value--${reviewSufficient ? 'sufficient' : 'insufficient'}`}>
          {REVIEW_MODE_LABELS[mode] || mode}
        </span>
        {!reviewSufficient && (
          <span className="ceu-gate-banner__review-note">
            Requires operator or domain authority validation for promotion
          </span>
        )}
      </div>
      <div className="ceu-gate-banner__stats">
        <span>{summary.total} total</span>
        <span className="ceu-gate-banner__stat--confirmed">{summary.confirmed} confirmed</span>
        <span className="ceu-gate-banner__stat--rejected">{summary.rejected} rejected</span>
        <span className="ceu-gate-banner__stat--merged">{summary.merged} merged</span>
        <span className="ceu-gate-banner__stat--pending">{summary.pending} pending</span>
      </div>
      {gateStatus.gate_reason && (
        <div className="ceu-gate-banner__reason">{gateStatus.gate_reason}</div>
      )}
      {canClassify && (
        <div className="ceu-gate-banner__classify">
          <div className="ceu-gate-banner__classify-label">
            All candidates resolved and obligations cleared. Classify this reconciliation run:
          </div>
          <div className="ceu-gate-banner__classify-controls">
            <input
              className="ceu-gate-banner__classify-input"
              value={actorId}
              onChange={e => setActorId(e.target.value)}
              placeholder="operator:name"
            />
            <input
              className="ceu-gate-banner__classify-input ceu-gate-banner__classify-input--wide"
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder="Justification for review classification (required)"
            />
          </div>
          <div className="ceu-gate-banner__classify-actions">
            <button
              className="ceu-gate-banner__classify-btn ceu-gate-banner__classify-btn--operator"
              onClick={() => handleClassify('OPERATOR_VALIDATED')}
              disabled={pending}
            >
              {pending ? '...' : 'Validate as Operator'}
            </button>
            <button
              className="ceu-gate-banner__classify-btn ceu-gate-banner__classify-btn--domain"
              onClick={() => handleClassify('DOMAIN_AUTHORITY_VALIDATED')}
              disabled={pending}
            >
              {pending ? '...' : 'Validate as Domain Authority'}
            </button>
          </div>
          {error && <div className="ceu-gate-banner__classify-error">{error}</div>}
        </div>
      )}
    </div>
  );
}

function EvidenceDetail({ anchors }) {
  if (!anchors || anchors.length === 0) {
    return <div className="ceu-evidence-detail ceu-evidence-detail--empty">No documentation evidence</div>;
  }

  return (
    <div className="ceu-evidence-detail">
      {anchors.map(a => (
        <div key={a.anchor_id} className="ceu-evidence-detail__item">
          <span className="ceu-evidence-detail__type">{a.evidence_type}</span>
          {a.heading && <span className="ceu-evidence-detail__heading">{a.heading}</span>}
          {a.app_name && <span className="ceu-evidence-detail__value">{a.app_name}</span>}
          {a.model_count && <span className="ceu-evidence-detail__value">{a.model_count} models</span>}
          {a.endpoint_count && <span className="ceu-evidence-detail__value">{a.endpoint_count} endpoints</span>}
          {a.summary && <div className="ceu-evidence-detail__summary">{a.summary}</div>}
        </div>
      ))}
    </div>
  );
}

function CandidateRow({ candidate, client, runId, onActionComplete, isExpanded, onToggle, obligations }) {
  const [actorId, setActorId] = useState('operator:khorrix');
  const [justification, setJustification] = useState('');
  const [finding, setFinding] = useState('ALIGNED');
  const [mergeTarget, setMergeTarget] = useState('');
  const [newTier, setNewTier] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const linkedObligations = (obligations || []).filter(o => o.ceu_id === candidate.ceu_id);

  const handleAction = async (action) => {
    setPending(true);
    setError(null);
    const payload = {
      action,
      client,
      runId,
      actor_id: actorId,
      target_ceu_id: candidate.ceu_id,
    };
    if (justification) payload.justification = justification;
    if (action === 'ceu_reconcile') payload.finding = finding;
    if (action === 'ceu_merge') payload.merge_target = mergeTarget;
    if (action === 'ceu_reclassify') payload.new_tier = newTier;

    const result = await postCeuAction(payload);
    setPending(false);
    if (result.success) {
      onActionComplete();
    } else {
      setError(result.detail || result.error);
    }
  };

  const stateColor = STATE_COLORS[candidate.state] || 'var(--sqo-dim)';
  const tierLabel = TIER_LABELS[candidate.tier] || candidate.tier;
  const isTerminal = ['CONFIRMED', 'REJECTED', 'MERGED'].includes(candidate.state);

  return (
    <div
      id={`ceu-candidate-${candidate.ceu_id}`}
      className={`ceu-candidate-row ceu-candidate-row--${candidate.state.toLowerCase()} ${isExpanded ? 'ceu-candidate-row--expanded' : ''}`}
    >
      <div className="ceu-candidate-row__header" onClick={onToggle}>
        <span className="ceu-candidate-row__expand">{isExpanded ? '▾' : '▸'}</span>
        <span className="ceu-candidate-row__id">{candidate.ceu_id}</span>
        <span className="ceu-candidate-row__domain">{candidate.domain}</span>
        <span className="ceu-candidate-row__tier" title={candidate.tier}>{tierLabel}</span>
        <span className="ceu-candidate-row__files">{candidate.file_count} files</span>
        <span className="ceu-candidate-row__evidence">{candidate.evidence_count} evidence</span>
        <span className="ceu-candidate-row__state" style={{ color: stateColor }}>{candidate.state}</span>
        {linkedObligations.length > 0 && (
          <span className="ceu-candidate-row__obl-count" title={`${linkedObligations.length} obligation(s)`}>
            {linkedObligations.length} obl
          </span>
        )}
        {candidate.merge_candidate && <span className="ceu-candidate-row__flag">MERGE</span>}
        {candidate.authority_pattern === 'NEGLIGIBLE' && <span className="ceu-candidate-row__flag ceu-candidate-row__flag--warn">NEGLIGIBLE</span>}
      </div>

      {isExpanded && (
        <div className="ceu-candidate-row__detail">
          <div className="ceu-candidate-row__columns">
            <div className="ceu-candidate-row__col ceu-candidate-row__col--structural">
              <h4>Structural Evidence</h4>
              {candidate.structural_metrics && (
                <div className="ceu-candidate-row__metrics">
                  <div>Import in: {candidate.structural_metrics.import_in_degree}</div>
                  <div>Import out: {candidate.structural_metrics.import_out_degree}</div>
                  <div>Inherit in: {candidate.structural_metrics.inherits_in_degree}</div>
                  <div>Balance: {candidate.structural_metrics.import_balance_ratio}</div>
                </div>
              )}
              {candidate.top_spine && (
                <div className="ceu-candidate-row__spine">
                  <span className="ceu-candidate-row__label">Top spine:</span> {candidate.top_spine.path}
                </div>
              )}
              <div className="ceu-candidate-row__authority">
                <span className="ceu-candidate-row__label">Authority:</span> {candidate.authority_pattern}
              </div>
            </div>
            <div className="ceu-candidate-row__col ceu-candidate-row__col--documented">
              <h4>Documentation Evidence</h4>
              <EvidenceDetail anchors={candidate.evidence_anchors} />
            </div>
          </div>

          {linkedObligations.length > 0 && (
            <div className="ceu-candidate-row__obligations">
              <h4>Linked Obligations</h4>
              {linkedObligations.map(obl => (
                <div key={obl.obligation_id} className={`ceu-candidate-row__obl ceu-candidate-row__obl--${obl.status.toLowerCase()}`}>
                  <span className="ceu-candidate-row__obl-id">{obl.obligation_id}</span>
                  <span className="ceu-candidate-row__obl-type">{obl.obligation_type}</span>
                  <span className={`ceu-candidate-row__obl-status ceu-candidate-row__obl-status--${obl.status.toLowerCase()}`}>
                    {obl.status}
                  </span>
                  <div className="ceu-candidate-row__obl-desc">{obl.description}</div>
                  {obl.status === 'RESOLVED' && obl.resolved_by && (
                    <div className="ceu-candidate-row__obl-resolution">
                      Resolved by {obl.resolved_by} — {obl.resolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {candidate.reconciliation_finding && (
            <div className="ceu-candidate-row__finding">
              <span className="ceu-candidate-row__label">Reconciliation finding:</span> {candidate.reconciliation_finding}
            </div>
          )}

          {candidate.last_action && (
            <div className="ceu-candidate-row__history">
              Last: {candidate.last_action} by {candidate.last_actor} at {candidate.last_action_at}
            </div>
          )}

          {!isTerminal && candidate.affordances?.actions?.length > 0 && (
            <div className="ceu-candidate-row__actions">
              <input
                className="ceu-candidate-row__input"
                value={actorId}
                onChange={e => setActorId(e.target.value)}
                placeholder="operator:name"
              />
              <input
                className="ceu-candidate-row__input ceu-candidate-row__input--wide"
                value={justification}
                onChange={e => setJustification(e.target.value)}
                placeholder="Justification (required for reject/merge/split/reclassify)"
              />

              {candidate.affordances.actions.includes('ceu_reconcile') && (
                <select
                  className="ceu-candidate-row__select"
                  value={finding}
                  onChange={e => setFinding(e.target.value)}
                >
                  <option value="ALIGNED">ALIGNED</option>
                  <option value="DIVERGENT">DIVERGENT</option>
                  <option value="PARTIAL">PARTIAL</option>
                </select>
              )}

              {candidate.affordances.actions.includes('ceu_merge') && (
                <input
                  className="ceu-candidate-row__input"
                  value={mergeTarget}
                  onChange={e => setMergeTarget(e.target.value)}
                  placeholder="Merge target CEU ID"
                />
              )}

              {candidate.affordances.actions.includes('ceu_reclassify') && (
                <select
                  className="ceu-candidate-row__select"
                  value={newTier}
                  onChange={e => setNewTier(e.target.value)}
                >
                  <option value="">Select tier</option>
                  <option value="FOUNDATION">FOUNDATION</option>
                  <option value="OPERATIONAL_DOMAIN">OPERATIONAL_DOMAIN</option>
                  <option value="CONSUMER">CONSUMER</option>
                  <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                </select>
              )}

              <div className="ceu-candidate-row__buttons">
                {candidate.affordances.actions.map(action => (
                  <button
                    key={action}
                    className={`ceu-candidate-row__btn ceu-candidate-row__btn--${action.replace(/ceu_/g, '').replace(/_/g, '-')}`}
                    onClick={() => handleAction(action)}
                    disabled={pending}
                  >
                    {pending ? '...' : ACTION_LABELS[action] || action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div className="ceu-candidate-row__error">{error}</div>}
        </div>
      )}
    </div>
  );
}

function ObligationItem({ obligation, client, runId, onActionComplete, onNavigateCandidate }) {
  const [actorId, setActorId] = useState('operator:khorrix');
  const [justification, setJustification] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const handleResolve = async () => {
    setPending(true);
    setError(null);
    const result = await postCeuAction({
      action: 'ceu_resolve_obligation',
      client,
      runId,
      actor_id: actorId,
      target_ceu_id: obligation.obligation_id,
      justification: justification || 'Resolved',
    });
    setPending(false);
    if (result.success) {
      onActionComplete();
    } else {
      setError(result.detail || result.error);
    }
  };

  const handleCeuClick = (e) => {
    e.preventDefault();
    if (onNavigateCandidate) {
      onNavigateCandidate(obligation.ceu_id);
    }
  };

  return (
    <div className={`ceu-obligation-item ceu-obligation-item--${obligation.status.toLowerCase()}`}>
      <div className="ceu-obligation-item__header">
        <span className="ceu-obligation-item__id">{obligation.obligation_id}</span>
        <span className="ceu-obligation-item__type">{obligation.obligation_type}</span>
        <a href={`#ceu-candidate-${obligation.ceu_id}`} className="ceu-obligation-item__ceu-link" onClick={handleCeuClick}>
          {obligation.ceu_id}
        </a>
        <span className={`ceu-obligation-item__status ceu-obligation-item__status--${obligation.status.toLowerCase()}`}>
          {obligation.status}
        </span>
      </div>
      <div className="ceu-obligation-item__description">{obligation.description}</div>

      {obligation.status === 'UNRESOLVED' && (
        <div className="ceu-obligation-item__actions">
          <input
            className="ceu-obligation-item__input"
            value={actorId}
            onChange={e => setActorId(e.target.value)}
            placeholder="operator:name"
          />
          <input
            className="ceu-obligation-item__input ceu-obligation-item__input--wide"
            value={justification}
            onChange={e => setJustification(e.target.value)}
            placeholder="Resolution justification"
          />
          <button
            className="ceu-obligation-item__btn"
            onClick={handleResolve}
            disabled={pending}
          >
            {pending ? '...' : 'Resolve'}
          </button>
        </div>
      )}

      {obligation.status === 'RESOLVED' && (
        <div className="ceu-obligation-item__resolution">
          Resolved by {obligation.resolved_by} — {obligation.resolution}
        </div>
      )}

      {error && <div className="ceu-obligation-item__error">{error}</div>}
    </div>
  );
}

function EventTimeline({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="ceu-timeline">
      <h3 className="ceu-section-title">Event Timeline</h3>
      <div className="ceu-timeline__list">
        {events.map(evt => (
          <div key={evt.event_id} className="ceu-timeline__item">
            <span className="ceu-timeline__id">{evt.event_id}</span>
            <span className="ceu-timeline__action">{evt.action}</span>
            {evt.target_ceu_id && <span className="ceu-timeline__target">{evt.target_ceu_id}</span>}
            {evt.prior_state && evt.resulting_state && (
              <span className="ceu-timeline__transition">{evt.prior_state} → {evt.resulting_state}</span>
            )}
            <span className="ceu-timeline__actor">{evt.actor_id}</span>
            <span className="ceu-timeline__time">{new Date(evt.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CeuReconciliationPanel({ ceuData }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedCeuId, setExpandedCeuId] = useState(null);

  if (!ceuData || !ceuData.available) {
    return (
      <div className="ceu-reconciliation-panel ceu-reconciliation-panel--unavailable">
        <p>No CEU reconciliation artifacts found. Run ceu_candidate_derivation.py → ceu_evidence_intake.py → ceu_reconciliation_seeder.py first.</p>
      </div>
    );
  }

  const handleActionComplete = () => {
    setRefreshKey(k => k + 1);
    window.location.reload();
  };

  const navigateToCandidate = (ceuId) => {
    setExpandedCeuId(ceuId);
    setTimeout(() => {
      const el = document.getElementById(`ceu-candidate-${ceuId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const obligations = ceuData.obligationQueue?.items || [];

  return (
    <div className="ceu-reconciliation-panel" key={refreshKey}>
      <PromotionGateBanner
        gateStatus={ceuData.gateStatus}
        summary={ceuData.summary}
        reviewMode={ceuData.reviewMode}
        client={ceuData.client}
        runId={ceuData.runId}
        onActionComplete={handleActionComplete}
      />

      <div className="ceu-reconciliation-panel__sections">
        <div className="ceu-section">
          <h3 className="ceu-section-title">CEU Candidates ({ceuData.candidateList?.length || 0})</h3>
          <div className="ceu-candidate-list">
            {(ceuData.candidateList || []).map(candidate => (
              <CandidateRow
                key={candidate.ceu_id}
                candidate={candidate}
                client={ceuData.client}
                runId={ceuData.runId}
                onActionComplete={handleActionComplete}
                isExpanded={expandedCeuId === candidate.ceu_id}
                onToggle={() => setExpandedCeuId(expandedCeuId === candidate.ceu_id ? null : candidate.ceu_id)}
                obligations={obligations}
              />
            ))}
          </div>
        </div>

        {ceuData.obligationQueue && ceuData.obligationQueue.total > 0 && (
          <div className="ceu-section">
            <h3 className="ceu-section-title">
              Review Obligations ({ceuData.obligationQueue.unresolved} unresolved / {ceuData.obligationQueue.total} total)
            </h3>
            <div className="ceu-obligation-list">
              {obligations.map(obl => (
                <ObligationItem
                  key={obl.obligation_id}
                  obligation={obl}
                  client={ceuData.client}
                  runId={ceuData.runId}
                  onActionComplete={handleActionComplete}
                  onNavigateCandidate={navigateToCandidate}
                />
              ))}
            </div>
          </div>
        )}

        <EventTimeline events={ceuData.eventTimeline} />
      </div>

      <footer className="ceu-reconciliation-panel__disclaimer">
        actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.
      </footer>
    </div>
  );
}

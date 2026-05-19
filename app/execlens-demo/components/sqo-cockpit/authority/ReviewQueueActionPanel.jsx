import { useState } from 'react';

const STATUS_ORDER = ['UNRESOLVED', 'CONTESTED', 'ARBITRATION_REQUIRED', 'DISPUTED', 'PARTIAL_ACCEPT', 'RESOLVED', 'REJECTED', 'UNRESOLVABLE'];

const ACTION_LABELS = {
  review_accept: 'Operational Acceptance',
  review_reject: 'Operational Rejection',
  review_contest: 'Contest Interpretation',
  review_partial_accept: 'Partial Acceptance',
  escalate_arbitration: 'Escalate to Arbitration',
  resolve_arbitration: 'Resolve Arbitration',
};

async function postAction(payload) {
  const res = await fetch('/api/sqo/authority-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

function ObligationItem({ obligation, affordances, client, runId, onActionComplete }) {
  const [actorId, setActorId] = useState('operator:khorrix');
  const [justification, setJustification] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const handleAction = async (action) => {
    setPending(true);
    setError(null);
    const payload = {
      action,
      client,
      runId,
      actor_id: actorId,
      target_item: obligation.id,
    };
    if (justification) payload.justification = justification;

    const result = await postAction(payload);
    setPending(false);
    if (result.success) {
      onActionComplete();
    } else {
      setError(result.detail || result.error);
    }
  };

  const isReadonly = affordances?.readonly;

  return (
    <div className={`sqo-obligation-item sqo-obligation-item--${(obligation.status || 'UNRESOLVED').toLowerCase()}`}>
      <div className="sqo-obligation-item__header">
        <span className="sqo-obligation-item__id">{obligation.id}</span>
        <span className="sqo-obligation-item__status">{obligation.status}</span>
        {obligation.semantic_disposition && (
          <span className="sqo-obligation-item__disposition">{obligation.semantic_disposition}</span>
        )}
      </div>

      <div className="sqo-obligation-item__details">
        {obligation.trigger && <div><span className="sqo-obligation-item__label">Trigger:</span> {obligation.trigger}</div>}
        {obligation.review_type && <div><span className="sqo-obligation-item__label">Type:</span> {obligation.review_type}</div>}
        {obligation.authority_domain && <div><span className="sqo-obligation-item__label">Authority:</span> {obligation.authority_domain} {obligation.required_authority_level}</div>}
        {obligation.action_required && <div><span className="sqo-obligation-item__label">Action:</span> {obligation.action_required}</div>}
      </div>

      {obligation.contest_reasoning && (
        <div className="sqo-obligation-item__contested">
          <span className="sqo-obligation-item__label">Contest Reasoning:</span> {obligation.contest_reasoning}
        </div>
      )}

      {obligation.accepted_aspects && obligation.accepted_aspects.length > 0 && (
        <div className="sqo-obligation-item__partial">
          <div><span className="sqo-obligation-item__label">Accepted:</span> {obligation.accepted_aspects.join(', ')}</div>
          {obligation.contested_aspects && <div><span className="sqo-obligation-item__label">Contested:</span> {obligation.contested_aspects.join(', ')}</div>}
        </div>
      )}

      {!isReadonly && affordances?.actions?.length > 0 && (
        <div className="sqo-obligation-item__actions">
          <input
            className="sqo-obligation-item__actor-input"
            value={actorId}
            onChange={e => setActorId(e.target.value)}
            placeholder="operator:name"
          />
          <input
            className="sqo-obligation-item__justification-input"
            value={justification}
            onChange={e => setJustification(e.target.value)}
            placeholder="Justification (required for reject/contest)"
          />
          <div className="sqo-obligation-item__buttons">
            {affordances.actions.map(action => (
              <button
                key={action}
                className={`sqo-obligation-item__btn sqo-obligation-item__btn--${action.replace(/_/g, '-')}`}
                onClick={() => handleAction(action)}
                disabled={pending}
                type="button"
              >
                {ACTION_LABELS[action] || action}
              </button>
            ))}
          </div>
          {error && <div className="sqo-obligation-item__error">{error}</div>}
        </div>
      )}
    </div>
  );
}

export default function ReviewQueueActionPanel({ reviewQueue, client, runId, onActionComplete }) {
  if (!reviewQueue) return null;

  const hasObligations = reviewQueue.total > 0;

  return (
    <div className="sqo-review-queue">
      <div className="sqo-review-queue__summary">
        <span>Review Obligations: {reviewQueue.total}</span>
        <span>Resolved: {reviewQueue.resolved}</span>
        <span>Pending: {reviewQueue.unresolved}</span>
      </div>

      {!hasObligations && (
        <div className="sqo-review-queue__empty">
          No review obligations. Review queue is clear.
        </div>
      )}

      {hasObligations && STATUS_ORDER.map(status => {
        const items = reviewQueue.grouped[status] || [];
        if (items.length === 0) return null;
        return (
          <div key={status} className="sqo-review-queue__group">
            <h4 className="sqo-review-queue__group-label">{status.replace(/_/g, ' ')}</h4>
            {items.map(obl => (
              <ObligationItem
                key={obl.id}
                obligation={obl}
                affordances={reviewQueue.affordances[obl.id]}
                client={client}
                runId={runId}
                onActionComplete={onActionComplete}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

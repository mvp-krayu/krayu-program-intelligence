import { useState } from 'react';

async function postAction(payload) {
  const res = await fetch('/api/sqo/authority-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export default function PromotionControlPanel({ promotionControl, client, runId, onActionComplete }) {
  const [actorId, setActorId] = useState('operator:khorrix');
  const [justification, setJustification] = useState('');
  const [permanentInsufficiency, setPermanentInsufficiency] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  if (!promotionControl) return null;

  const handleAction = async (action) => {
    setPending(true);
    setError(null);
    const payload = {
      action,
      client,
      runId,
      actor_id: actorId,
    };
    if (justification) payload.justification = justification;
    if (action === 'insufficiency_acknowledge') {
      payload.insufficiency_permanent = permanentInsufficiency;
      if (!justification) {
        setError('Justification is required for insufficiency acknowledgment');
        setPending(false);
        return;
      }
    }

    const result = await postAction(payload);
    setPending(false);
    if (result.success) {
      onActionComplete();
    } else {
      setError(result.detail || result.error);
    }
  };

  return (
    <div className="sqo-promotion-control">
      <div className="sqo-promotion-control__state">
        <span className="sqo-promotion-control__label">Decision State:</span>
        <span className="sqo-promotion-control__value">{promotionControl.decision_state}</span>
      </div>

      <div className="sqo-promotion-control__summary">
        <div>Blockers Remaining: {promotionControl.blockers_remaining}</div>
        {promotionControl.insufficiency_acknowledged && (
          <div className="sqo-promotion-control__insufficiency">
            Insufficiency Acknowledged{promotionControl.insufficiency_permanent ? ' (Permanent)' : ' (Temporary)'}
          </div>
        )}
      </div>

      {promotionControl.promotion_authority_ownership?.promotion_authority_owner && (
        <div className="sqo-promotion-control__ownership">
          <span>Authority Owner: {promotionControl.promotion_authority_ownership.promotion_authority_owner}</span>
          <span>Scope: {promotionControl.promotion_authority_ownership.promotion_scope}</span>
          {promotionControl.promotion_authority_ownership.promotion_reasoning_class && (
            <span>Reasoning: {promotionControl.promotion_authority_ownership.promotion_reasoning_class}</span>
          )}
        </div>
      )}

      <div className="sqo-promotion-control__inputs">
        <input
          className="sqo-promotion-control__actor-input"
          value={actorId}
          onChange={e => setActorId(e.target.value)}
          placeholder="operator:name"
        />
        <input
          className="sqo-promotion-control__justification-input"
          value={justification}
          onChange={e => setJustification(e.target.value)}
          placeholder="Justification"
        />
      </div>

      <div className="sqo-promotion-control__actions">
        {promotionControl.can_request_advancement && (
          <button
            className="sqo-promotion-control__btn sqo-promotion-control__btn--request"
            onClick={() => handleAction('promotion_request')}
            disabled={pending}
            type="button"
          >
            Request Qualification Advancement
          </button>
        )}

        {promotionControl.can_approve && (
          <button
            className="sqo-promotion-control__btn sqo-promotion-control__btn--approve"
            onClick={() => handleAction('promotion_approve')}
            disabled={pending}
            type="button"
          >
            Approve Qualification Advancement
          </button>
        )}

        {promotionControl.can_deny && (
          <button
            className="sqo-promotion-control__btn sqo-promotion-control__btn--deny"
            onClick={() => handleAction('promotion_deny')}
            disabled={pending}
            type="button"
          >
            Deny Qualification Advancement
          </button>
        )}

        {promotionControl.can_acknowledge_insufficiency && !promotionControl.insufficiency_acknowledged && (
          <div className="sqo-promotion-control__insufficiency-action">
            <label className="sqo-promotion-control__permanent-toggle">
              <input
                type="checkbox"
                checked={permanentInsufficiency}
                onChange={e => setPermanentInsufficiency(e.target.checked)}
              />
              Permanent insufficiency (preserves all blockers and unresolved obligations)
            </label>
            <button
              className="sqo-promotion-control__btn sqo-promotion-control__btn--insufficiency"
              onClick={() => handleAction('insufficiency_acknowledge')}
              disabled={pending}
              type="button"
            >
              Acknowledge Insufficiency
            </button>
          </div>
        )}
      </div>

      {error && <div className="sqo-promotion-control__error">{error}</div>}
    </div>
  );
}

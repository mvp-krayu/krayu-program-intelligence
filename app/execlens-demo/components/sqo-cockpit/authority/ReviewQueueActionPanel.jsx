import { useState } from 'react';

const POSTURE_NARRATIVES = {
  STRUCTURAL_DOMINANCE: {
    headline: 'Structural authority concentration detected',
    description: 'High-import nodes form the architectural backbone — primary dependency targets governing control flow across the codebase.',
    impact: 'Affects dependency risk assessment and critical path identification.',
    icon: '◆',
  },
  COUPLING_PATTERN: {
    headline: 'Cross-domain structural entanglement detected',
    description: 'Import relationships cross domain boundaries, revealing coupling that may represent intentional integration or architectural risk.',
    impact: 'Affects module boundary governance and refactoring scope.',
    icon: '⟷',
  },
  AUTHORITY_TOPOLOGY: {
    headline: 'Governance authority distribution mapped',
    description: 'Control and decision-making responsibility distributes unevenly across domains, creating authority asymmetries in the structural graph.',
    impact: 'Affects control flow understanding and authority delegation.',
    icon: '△',
  },
  TIER_GROUNDING: {
    headline: 'Evidence tier anchoring established',
    description: 'Structural evidence maps domains to operational tiers, establishing provenance chains for classification claims.',
    impact: 'Affects qualification evidence completeness and tier classification.',
    icon: '▽',
  },
  HERO_MOMENT_GROUNDING: {
    headline: 'Critical structural pivot points identified',
    description: 'Architectural surprise points where structural reality diverges from documented or expected organization.',
    impact: 'Affects architectural risk awareness and documentation gaps.',
    icon: '⚑',
  },
  CLUSTER_ARCHITECTURE: {
    headline: 'Module clustering topology derived',
    description: 'Algorithmic clustering reveals natural organizational boundaries that may differ from formal package structure.',
    impact: 'Affects organizational boundary understanding and team alignment.',
    icon: '⬡',
  },
};

function resolveConfidencePosture(confidence) {
  if (confidence >= 0.95) return { label: 'Very high', cls: 'very-high' };
  if (confidence >= 0.85) return { label: 'High', cls: 'high' };
  if (confidence >= 0.75) return { label: 'Moderate', cls: 'moderate' };
  if (confidence >= 0.65) return { label: 'Developing', cls: 'developing' };
  return { label: 'Limited', cls: 'limited' };
}

function resolveReviewGuidance(obligation) {
  const status = obligation.status || 'UNRESOLVED';
  const conf = obligation.mean_confidence || 0;

  if (status === 'RESOLVED') return 'Accepted as operational. No further action required.';
  if (status === 'REJECTED') return 'Rejected. Structural interpretation declined.';
  if (status === 'CONTESTED') return 'Interpretation contested. Evidence disputes pending resolution.';
  if (status === 'ARBITRATION_REQUIRED') return 'Escalated to arbitration. Awaiting authority resolution.';
  if (status === 'PARTIAL_ACCEPT') return 'Partially accepted. Contested aspects remain open.';

  if (conf >= 0.9) return 'Strong structural evidence supports this classification. Review for operational acceptance.';
  if (conf >= 0.8) return 'Substantial evidence with high coverage. Review for operational adequacy.';
  if (conf >= 0.7) return 'Moderate evidence coverage. Review carefully for gaps or misclassification.';
  return 'Limited structural evidence. Careful review recommended before acceptance.';
}

const ACTION_LABELS = {
  review_accept: 'Accept as Operational',
  review_reject: 'Reject Interpretation',
  review_contest: 'Contest Evidence',
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

function PostureGroupCard({ obligation, affordances, client, runId, onActionComplete }) {
  const [expanded, setExpanded] = useState(false);
  const [actorId, setActorId] = useState('operator:khorrix');
  const [justification, setJustification] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const narrative = POSTURE_NARRATIVES[obligation.proposition_class] || {
    headline: obligation.proposition_class?.replace(/_/g, ' ') || 'Unknown posture group',
    description: obligation.action_required || '',
    impact: '',
    icon: '○',
  };

  const confidencePosture = resolveConfidencePosture(obligation.mean_confidence || 0);
  const guidance = resolveReviewGuidance(obligation);
  const isReadonly = affordances?.readonly;
  const status = obligation.status || 'UNRESOLVED';
  const ceuCount = (obligation.ceu_refs || []).length;
  const representatives = obligation.representative_propositions || [];
  const envelope = obligation.confidence_envelope;
  const tierDist = obligation.tier_distribution || {};

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

  return (
    <div className={`sqo-posture-group sqo-posture-group--${status.toLowerCase()}`}>
      <div className="sqo-posture-group__header">
        <span className="sqo-posture-group__icon">{narrative.icon}</span>
        <div className="sqo-posture-group__headline-block">
          <h4 className="sqo-posture-group__headline">{narrative.headline}</h4>
          <div className="sqo-posture-group__meta">
            <span className="sqo-posture-group__count">{obligation.proposition_count} observation{obligation.proposition_count !== 1 ? 's' : ''}</span>
            <span className="sqo-posture-group__separator">·</span>
            <span className={`sqo-posture-group__confidence sqo-posture-group__confidence--${confidencePosture.cls}`}>
              {confidencePosture.label} confidence
            </span>
            <span className="sqo-posture-group__separator">·</span>
            <span className="sqo-posture-group__ceu">{ceuCount} evidence unit{ceuCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <span className={`sqo-posture-group__status sqo-posture-group__status--${status.toLowerCase()}`}>
          {status === 'UNRESOLVED' ? 'Awaiting Review' :
           status === 'RESOLVED' ? 'Accepted' :
           status === 'REJECTED' ? 'Rejected' :
           status === 'CONTESTED' ? 'Contested' :
           status === 'PARTIAL_ACCEPT' ? 'Partial' :
           status.replace(/_/g, ' ')}
        </span>
      </div>

      <p className="sqo-posture-group__description">{narrative.description}</p>

      <div className="sqo-posture-group__guidance">
        <span className="sqo-posture-group__guidance-label">Assessment:</span>
        {guidance}
      </div>

      {narrative.impact && (
        <div className="sqo-posture-group__impact">
          <span className="sqo-posture-group__impact-label">Operational impact:</span>
          {narrative.impact}
        </div>
      )}

      {representatives.length > 0 && (
        <div className="sqo-posture-group__examples">
          <span className="sqo-posture-group__examples-label">Strongest observations:</span>
          {representatives.map(rep => (
            <div key={rep.id} className="sqo-posture-group__example">
              <span className="sqo-posture-group__example-text">{rep.proposition}</span>
              <span className="sqo-posture-group__example-conf">{(rep.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}

      {!isReadonly && affordances?.actions?.length > 0 && (
        <div className="sqo-posture-group__actions">
          <div className="sqo-posture-group__action-inputs">
            <input
              className="sqo-posture-group__actor-input"
              value={actorId}
              onChange={e => setActorId(e.target.value)}
              placeholder="operator:name"
            />
            <input
              className="sqo-posture-group__justification-input"
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder="Justification (required for reject/contest)"
            />
          </div>
          <div className="sqo-posture-group__buttons">
            {affordances.actions.map(action => (
              <button
                key={action}
                className={`sqo-posture-group__btn sqo-posture-group__btn--${action.replace(/_/g, '-')}`}
                onClick={() => handleAction(action)}
                disabled={pending}
                type="button"
              >
                {ACTION_LABELS[action] || action}
              </button>
            ))}
          </div>
          {error && <div className="sqo-posture-group__error">{error}</div>}
        </div>
      )}

      <button
        className="sqo-posture-group__expand-toggle"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        {expanded ? '▾ Hide lineage detail' : '▸ Show lineage detail'}
      </button>

      {expanded && (
        <div className="sqo-posture-group__lineage">
          <div className="sqo-posture-group__lineage-row">
            <span className="sqo-posture-group__lineage-label">Obligation ID</span>
            <span className="sqo-posture-group__lineage-value">{obligation.id}</span>
          </div>
          <div className="sqo-posture-group__lineage-row">
            <span className="sqo-posture-group__lineage-label">Proposition class</span>
            <span className="sqo-posture-group__lineage-value">{obligation.proposition_class}</span>
          </div>
          <div className="sqo-posture-group__lineage-row">
            <span className="sqo-posture-group__lineage-label">Review type</span>
            <span className="sqo-posture-group__lineage-value">{obligation.review_type}</span>
          </div>
          <div className="sqo-posture-group__lineage-row">
            <span className="sqo-posture-group__lineage-label">Authority domain</span>
            <span className="sqo-posture-group__lineage-value">{obligation.authority_domain} {obligation.required_authority_level}</span>
          </div>
          {envelope && (
            <div className="sqo-posture-group__lineage-row">
              <span className="sqo-posture-group__lineage-label">Confidence range</span>
              <span className="sqo-posture-group__lineage-value">
                {(envelope.min * 100).toFixed(0)}% – {(envelope.max * 100).toFixed(0)}% (mean {(envelope.mean * 100).toFixed(0)}%)
              </span>
            </div>
          )}
          {Object.keys(tierDist).length > 0 && (
            <div className="sqo-posture-group__lineage-row">
              <span className="sqo-posture-group__lineage-label">Evidence tiers</span>
              <span className="sqo-posture-group__lineage-value">
                {Object.entries(tierDist).map(([tier, count]) => `${tier}: ${count}`).join(', ')}
              </span>
            </div>
          )}
          <div className="sqo-posture-group__lineage-row">
            <span className="sqo-posture-group__lineage-label">CEU references</span>
            <span className="sqo-posture-group__lineage-value">{(obligation.ceu_refs || []).join(', ') || '—'}</span>
          </div>
          {obligation.trigger && (
            <div className="sqo-posture-group__lineage-row">
              <span className="sqo-posture-group__lineage-label">Trigger</span>
              <span className="sqo-posture-group__lineage-value">{obligation.trigger}</span>
            </div>
          )}
          {obligation.resolved_by && (
            <div className="sqo-posture-group__lineage-row">
              <span className="sqo-posture-group__lineage-label">Resolved by</span>
              <span className="sqo-posture-group__lineage-value">{obligation.resolved_by} at {obligation.resolved_at}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewQueueActionPanel({ reviewQueue, client, runId, onActionComplete }) {
  if (!reviewQueue) return null;

  const hasObligations = reviewQueue.total > 0;
  const pendingCount = reviewQueue.unresolved;
  const resolvedCount = reviewQueue.resolved;

  const allItems = [];
  for (const status of ['UNRESOLVED', 'CONTESTED', 'ARBITRATION_REQUIRED', 'DISPUTED', 'PARTIAL_ACCEPT', 'RESOLVED', 'REJECTED', 'UNRESOLVABLE']) {
    const items = reviewQueue.grouped[status] || [];
    for (const item of items) allItems.push(item);
  }

  const unresolvedItems = allItems.filter(o => !['RESOLVED', 'REJECTED', 'UNRESOLVABLE'].includes(o.status));
  const resolvedItems = allItems.filter(o => ['RESOLVED', 'REJECTED', 'UNRESOLVABLE'].includes(o.status));

  return (
    <div className="sqo-review-queue">
      <div className="sqo-review-queue__header">
        <h3 className="sqo-review-queue__title">Semantic Posture Review</h3>
        <div className="sqo-review-queue__summary">
          {pendingCount > 0 && (
            <span className="sqo-review-queue__badge sqo-review-queue__badge--pending">
              {pendingCount} awaiting review
            </span>
          )}
          {resolvedCount > 0 && (
            <span className="sqo-review-queue__badge sqo-review-queue__badge--resolved">
              {resolvedCount} resolved
            </span>
          )}
        </div>
      </div>

      {!hasObligations && (
        <div className="sqo-review-queue__empty">
          No semantic posture groups require review. Review queue is clear.
        </div>
      )}

      {unresolvedItems.length > 0 && (
        <div className="sqo-review-queue__section">
          {unresolvedItems.map(obl => (
            <PostureGroupCard
              key={obl.id}
              obligation={obl}
              affordances={reviewQueue.affordances[obl.id]}
              client={client}
              runId={runId}
              onActionComplete={onActionComplete}
            />
          ))}
        </div>
      )}

      {resolvedItems.length > 0 && (
        <div className="sqo-review-queue__section sqo-review-queue__section--resolved">
          <h4 className="sqo-review-queue__section-label">Resolved</h4>
          {resolvedItems.map(obl => (
            <PostureGroupCard
              key={obl.id}
              obligation={obl}
              affordances={reviewQueue.affordances[obl.id]}
              client={client}
              runId={runId}
              onActionComplete={onActionComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

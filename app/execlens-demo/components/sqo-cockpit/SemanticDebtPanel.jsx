import { useState } from 'react';

const CATEGORY_NARRATIVES = {
  CONFIDENCE_GAP: {
    headline: 'Confidence gaps require evidence strengthening',
    description: 'Proposition classes below confidence thresholds need stronger structural evidence to support qualification claims.',
    impact: 'Weakens qualification foundation — low-confidence propositions may not survive governance scrutiny.',
    icon: '▼',
  },
  COVERAGE_GAP: {
    headline: 'Thin structural coverage limits qualification confidence',
    description: 'Classification dimensions with insufficient proposition count cannot reliably represent structural reality.',
    impact: 'Incomplete structural coverage creates blind spots in qualification assessment.',
    icon: '◇',
  },
  TIER_IMBALANCE: {
    headline: 'Derived-only classes need direct structural anchoring',
    description: 'Proposition classes without direct evidence rely entirely on derived inference — weaker qualification foundation.',
    impact: 'Derived propositions inherit upstream uncertainty. Direct evidence provides independent structural proof.',
    icon: '△',
  },
  REVIEW_DEBT: {
    headline: 'Review debt blocks qualification progression',
    description: 'Unreviewed proposition class obligations prevent advancement through the qualification lifecycle.',
    impact: 'Qualification cannot progress until operator review resolves outstanding obligations.',
    icon: '⊘',
  },
  RECONCILIATION_NOVELTY: {
    headline: 'Novel propositions require reconciliation alignment',
    description: 'Structural observations not yet reconciled against prior evidence — alignment needed for governance consistency.',
    impact: 'Novel propositions may conflict with established evidence. Reconciliation ensures coherence.',
    icon: '◎',
  },
  GROUNDING_GAP: {
    headline: 'Structural grounding gaps limit domain coverage',
    description: 'Semantic domains lack sufficient structural backing from source evidence — source material expansion needed.',
    impact: 'Ungrounded domains cannot be qualified. Source evidence must be expanded to cover these areas.',
    icon: '▽',
  },
  MISSING_ARTIFACT: {
    headline: 'Missing qualification artifacts',
    description: 'Required qualification artifacts are absent from the evidence chain.',
    impact: 'Qualification pipeline cannot complete without all required artifacts in place.',
    icon: '✕',
  },
  CONTINUITY_GAP: {
    headline: 'Evidence continuity gaps detected',
    description: 'Breaks in the evidence chain between structural and semantic layers.',
    impact: 'Discontinuities weaken traceability from source to qualification claim.',
    icon: '⋯',
  },
};

const SEVERITY_LABELS = {
  CRITICAL: { label: 'Critical', cls: 'critical' },
  HIGH: { label: 'High', cls: 'high' },
  'MEDIUM-HIGH': { label: 'Medium-High', cls: 'medium-high' },
  MEDIUM: { label: 'Medium', cls: 'medium' },
  LOW: { label: 'Low', cls: 'low' },
};

function resolveQualificationImpact(items) {
  const s2Blockers = items.filter(i => i.blocks_s_state === 'S2').length;
  const s3Blockers = items.filter(i => i.blocks_s_state === 'S3').length;
  const parts = [];
  if (s2Blockers > 0) parts.push(`${s2Blockers} block${s2Blockers !== 1 ? '' : 's'} S2 advancement`);
  if (s3Blockers > 0) parts.push(`${s3Blockers} block${s3Blockers !== 1 ? '' : 's'} S3 eligibility`);
  if (parts.length === 0) return 'No items directly block qualification advancement.';
  return parts.join('. ') + '.';
}

function resolveNextAction(byCategory) {
  if (byCategory.REVIEW_DEBT && byCategory.REVIEW_DEBT.length > 0) {
    return 'Complete proposition class review obligations to unblock qualification progression.';
  }
  if (byCategory.CONFIDENCE_GAP && byCategory.CONFIDENCE_GAP.some(i => i.severity === 'HIGH')) {
    return 'Strengthen structural evidence for high-severity confidence gaps.';
  }
  if (byCategory.GROUNDING_GAP && byCategory.GROUNDING_GAP.length > 0) {
    return 'Expand source evidence to ground unstructured domains.';
  }
  if (byCategory.COVERAGE_GAP && byCategory.COVERAGE_GAP.length > 0) {
    return 'Expand structural analysis to improve coverage in thin classification dimensions.';
  }
  return 'Address remaining debt items to progress toward full qualification.';
}

function DebtGroupCard({ category, items }) {
  const [expanded, setExpanded] = useState(false);

  const narrative = CATEGORY_NARRATIVES[category] || {
    headline: category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
    description: '',
    impact: '',
    icon: '○',
  };

  const highestSeverity = items.reduce((max, item) => {
    const order = ['CRITICAL', 'HIGH', 'MEDIUM-HIGH', 'MEDIUM', 'LOW'];
    const maxIdx = order.indexOf(max);
    const itemIdx = order.indexOf(item.severity);
    return itemIdx < maxIdx ? item.severity : max;
  }, 'LOW');

  const sevInfo = SEVERITY_LABELS[highestSeverity] || { label: highestSeverity, cls: 'medium' };
  const blockingItems = items.filter(i => i.blocks_s_state);

  return (
    <div className={`sqo-debt-group sqo-debt-group--${sevInfo.cls}`}>
      <div className="sqo-debt-group__header">
        <span className="sqo-debt-group__icon">{narrative.icon}</span>
        <div className="sqo-debt-group__headline-block">
          <h4 className="sqo-debt-group__headline">{narrative.headline}</h4>
          <div className="sqo-debt-group__meta">
            <span className="sqo-debt-group__count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            <span className="sqo-debt-group__separator">·</span>
            <span className={`sqo-debt-group__severity sqo-debt-group__severity--${sevInfo.cls}`}>{sevInfo.label} severity</span>
            {blockingItems.length > 0 && (
              <>
                <span className="sqo-debt-group__separator">·</span>
                <span className="sqo-debt-group__blocking">Blocks {[...new Set(blockingItems.map(i => i.blocks_s_state))].join(', ')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {narrative.description && (
        <p className="sqo-debt-group__description">{narrative.description}</p>
      )}

      {narrative.impact && (
        <div className="sqo-debt-group__impact">
          <span className="sqo-debt-group__impact-label">Why it matters:</span>
          {narrative.impact}
        </div>
      )}

      <div className="sqo-debt-group__items">
        {items.map(item => (
          <div key={item.id} className="sqo-debt-group__item">
            <div className="sqo-debt-group__item-desc">{item.description}</div>
            {item.remediation_action && (
              <div className="sqo-debt-group__item-action">
                <span className="sqo-debt-group__item-action-label">Action:</span>
                {item.remediation_action}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="sqo-debt-group__expand-toggle"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        {expanded ? '▾ Hide lineage detail' : '▸ Show lineage detail'}
      </button>

      {expanded && (
        <div className="sqo-debt-group__lineage">
          {items.map(item => (
            <div key={item.id} className="sqo-debt-group__lineage-item">
              <div className="sqo-debt-group__lineage-row">
                <span className="sqo-debt-group__lineage-label">Debt ID</span>
                <span className="sqo-debt-group__lineage-value">{item.id}</span>
              </div>
              <div className="sqo-debt-group__lineage-row">
                <span className="sqo-debt-group__lineage-label">Severity</span>
                <span className="sqo-debt-group__lineage-value">{item.severity}</span>
              </div>
              {item.blocks_s_state && (
                <div className="sqo-debt-group__lineage-row">
                  <span className="sqo-debt-group__lineage-label">Blocks</span>
                  <span className="sqo-debt-group__lineage-value">{item.blocks_s_state}</span>
                </div>
              )}
              {item.remediation_pathway && (
                <div className="sqo-debt-group__lineage-row">
                  <span className="sqo-debt-group__lineage-label">Pathway</span>
                  <span className="sqo-debt-group__lineage-value">{item.remediation_pathway}</span>
                </div>
              )}
              {item.evidence && (
                <>
                  <div className="sqo-debt-group__lineage-row">
                    <span className="sqo-debt-group__lineage-label">Evidence</span>
                    <span className="sqo-debt-group__lineage-value">{item.evidence.artifact_key}: {item.evidence.field_path}</span>
                  </div>
                  <div className="sqo-debt-group__lineage-row">
                    <span className="sqo-debt-group__lineage-label">Current</span>
                    <span className="sqo-debt-group__lineage-value">{String(item.evidence.current_value)}</span>
                  </div>
                  <div className="sqo-debt-group__lineage-row">
                    <span className="sqo-debt-group__lineage-label">Required</span>
                    <span className="sqo-debt-group__lineage-value">{item.evidence.required_value}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SemanticDebtPanel({ debtData }) {
  if (!debtData) {
    return (
      <div className="sqo-debt-panel sqo-debt-panel--empty">
        <p className="sqo-debt-panel__empty-notice">No debt inventory data available.</p>
      </div>
    );
  }

  const byCategory = debtData.by_category || {};
  const bySeverity = debtData.by_severity || {};
  const allItems = Object.values(byCategory).flat();
  const qualificationImpact = resolveQualificationImpact(allItems);
  const nextAction = resolveNextAction(byCategory);

  const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM-HIGH', 'MEDIUM', 'LOW'];
  const categoryOrder = ['REVIEW_DEBT', 'CONFIDENCE_GAP', 'GROUNDING_GAP', 'COVERAGE_GAP', 'TIER_IMBALANCE', 'RECONCILIATION_NOVELTY', 'MISSING_ARTIFACT', 'CONTINUITY_GAP'];

  const sortedCategories = Object.keys(byCategory).sort((a, b) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="sqo-debt-panel">
      <div className="sqo-debt-panel__summary">
        <div className="sqo-debt-panel__summary-primary">
          <span className="sqo-debt-panel__total">{debtData.total_items} qualification debt item{debtData.total_items !== 1 ? 's' : ''}</span>
          <div className="sqo-debt-panel__severity-chips">
            {severityOrder.map(sev => {
              const items = bySeverity[sev];
              if (!items || items.length === 0) return null;
              const info = SEVERITY_LABELS[sev] || { label: sev, cls: 'medium' };
              return (
                <span key={sev} className={`sqo-debt-panel__severity-chip sqo-debt-panel__severity-chip--${info.cls}`}>
                  {items.length} {info.label}
                </span>
              );
            })}
          </div>
        </div>
        <div className="sqo-debt-panel__summary-impact">
          <span className="sqo-debt-panel__impact-label">Qualification impact:</span>
          {qualificationImpact}
        </div>
        <div className="sqo-debt-panel__summary-action">
          <span className="sqo-debt-panel__action-label">Next action:</span>
          {nextAction}
        </div>
      </div>

      <div className="sqo-debt-panel__groups">
        {sortedCategories.map(category => (
          <DebtGroupCard
            key={category}
            category={category}
            items={byCategory[category]}
          />
        ))}
      </div>
    </div>
  );
}

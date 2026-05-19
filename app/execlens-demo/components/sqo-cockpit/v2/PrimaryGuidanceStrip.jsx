export default function PrimaryGuidanceStrip({ primaryGuidance, onNavigateAction }) {
  if (!primaryGuidance) return null;

  const { headline, action_target, urgency } = primaryGuidance;
  const urgencyClass = `sqo-v2-guidance-strip--${urgency || 'informational'}`;

  function handleClick() {
    if (action_target && onNavigateAction) {
      onNavigateAction(action_target);
    }
  }

  return (
    <div className={`sqo-v2-guidance-strip ${urgencyClass}`}>
      <span className="sqo-v2-guidance-strip__indicator" />
      <span className="sqo-v2-guidance-strip__headline">{headline}</span>
      {action_target && onNavigateAction && (
        <button className="sqo-v2-guidance-strip__action" onClick={handleClick} type="button">
          Go to {action_target === 'authority' ? 'Authority' : action_target === 'semantic-candidates' ? 'Semantic Intake' : action_target === 'reconciliation' ? 'Reconciliation' : action_target === 'debt' ? 'Semantic Debt' : action_target}
        </button>
      )}
    </div>
  );
}

export default function PromotionEventTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="sqo-event-timeline sqo-event-timeline--empty">
        <p>No promotion events recorded.</p>
      </div>
    );
  }

  return (
    <div className="sqo-event-timeline">
      <div className="sqo-event-timeline__count">{events.length} events in qualification lineage</div>
      <div className="sqo-event-timeline__list">
        {events.map(event => (
          <div key={event.event_id} className="sqo-event-timeline__item">
            <div className="sqo-event-timeline__item-header">
              <span className="sqo-event-timeline__event-id">{event.event_id}</span>
              <span className="sqo-event-timeline__timestamp">
                {event.timestamp ? new Date(event.timestamp).toLocaleString() : '—'}
              </span>
            </div>
            <div className="sqo-event-timeline__item-body">
              <div className="sqo-event-timeline__action">{event.action}</div>
              <div className="sqo-event-timeline__actor">
                {event.actor_id}
                {event.actor_role && <span className="sqo-event-timeline__role"> ({event.actor_role})</span>}
              </div>
              {event.semantic_disposition && (
                <div className="sqo-event-timeline__disposition">{event.semantic_disposition}</div>
              )}
              <div className="sqo-event-timeline__transition">
                <span className="sqo-event-timeline__authority">{event.authority_domain}</span>
                <span className="sqo-event-timeline__states">{event.prior_state} → {event.resulting_state}</span>
              </div>
              {event.target_item && (
                <div className="sqo-event-timeline__target">Target: {event.target_item}</div>
              )}
              {event.justification && (
                <div className="sqo-event-timeline__justification">{event.justification}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

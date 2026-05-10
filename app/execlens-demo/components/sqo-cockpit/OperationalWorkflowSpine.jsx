export default function OperationalWorkflowSpine({ spineNodes, sState, nextState }) {
  if (!spineNodes || spineNodes.length === 0) return null;

  return (
    <nav className="sqo-spine" aria-label="Workflow Spine">
      <div className="sqo-spine__origin">
        <span className="sqo-spine__node sqo-spine__node--current">{sState}</span>
      </div>

      <div className="sqo-spine__stages">
        {spineNodes.map((node, idx) => (
          <div
            key={node.id}
            className={`sqo-spine__stage sqo-spine__stage--${node.visual_state} ${node.is_active ? 'sqo-spine__stage--active' : ''}`}
          >
            <div className="sqo-spine__connector" />
            <div className="sqo-spine__stage-content">
              <span className="sqo-spine__stage-pathway">{node.pathway}</span>
              <span className="sqo-spine__stage-label">{node.label}</span>
              <span className="sqo-spine__stage-count">{node.item_count}</span>
            </div>
          </div>
        ))}
      </div>

      {nextState && (
        <div className="sqo-spine__destination">
          <div className="sqo-spine__connector" />
          <span className="sqo-spine__node sqo-spine__node--target">{nextState}</span>
        </div>
      )}
    </nav>
  );
}

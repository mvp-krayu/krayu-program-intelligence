export default function SQOCognitiveLayoutShell({
  visualState,
  heroRegion,
  ribbon,
  spine,
  blockerLayer,
  workflowCluster,
  progressionRail,
  deferredZone,
  forensicLink,
  governance,
}) {
  const paletteClass = visualState ? visualState.chromatic_class : 'sqo-state--neutral';

  return (
    <div className={`sqo-cognitive-shell ${paletteClass}`}>
      <div className="sqo-cognitive-shell__zone sqo-cognitive-shell__zone--state">
        {ribbon}
        {heroRegion}
      </div>

      {blockerLayer && (
        <div className="sqo-cognitive-shell__zone sqo-cognitive-shell__zone--blockers">
          {blockerLayer}
        </div>
      )}

      <div className="sqo-cognitive-shell__operational">
        {spine && (
          <aside className="sqo-cognitive-shell__spine-rail">
            {spine}
          </aside>
        )}

        <div className="sqo-cognitive-shell__main-lane">
          {workflowCluster && (
            <div className="sqo-cognitive-shell__zone sqo-cognitive-shell__zone--action">
              {workflowCluster}
            </div>
          )}

          {progressionRail && (
            <div className="sqo-cognitive-shell__zone sqo-cognitive-shell__zone--progression">
              {progressionRail}
            </div>
          )}
        </div>
      </div>

      {deferredZone && (
        <div className="sqo-cognitive-shell__zone sqo-cognitive-shell__zone--deferred">
          {deferredZone}
        </div>
      )}

      {forensicLink && (
        <div className="sqo-cognitive-shell__zone sqo-cognitive-shell__zone--forensic">
          {forensicLink}
        </div>
      )}

      {governance && (
        <footer className="sqo-cognitive-shell__governance">
          {governance}
        </footer>
      )}
    </div>
  );
}

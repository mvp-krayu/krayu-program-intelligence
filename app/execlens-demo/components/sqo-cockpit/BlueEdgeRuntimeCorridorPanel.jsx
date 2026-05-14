import CorridorSandboxSessionSummary from './CorridorSandboxSessionSummary';
import CorridorOverlayChainSummary from './CorridorOverlayChainSummary';
import CorridorReplayRollbackSummary from './CorridorReplayRollbackSummary';
import CorridorCertificationSummary from './CorridorCertificationSummary';
import CorridorGovernanceZoneSummary from './CorridorGovernanceZoneSummary';
import CorridorAuthorityBoundarySummary from './CorridorAuthorityBoundarySummary';
import CorridorLineageTraceSummary from './CorridorLineageTraceSummary';

export default function BlueEdgeRuntimeCorridorPanel({ corridor }) {
  if (!corridor || !corridor.available) {
    return (
      <div className="corridor-panel corridor-panel--unavailable">
        <div className="corridor-panel__header">
          <h2 className="corridor-panel__title">Runtime Corridor</h2>
          <span className="corridor-badge corridor-badge--critical">UNAVAILABLE</span>
        </div>
        <p className="corridor-panel__error">
          {corridor && corridor.error ? corridor.error : 'Corridor data could not be loaded.'}
        </p>
      </div>
    );
  }

  return (
    <div className="corridor-panel">
      <div className="corridor-panel__header">
        <div className="corridor-panel__header-left">
          <h2 className="corridor-panel__title">SQO Runtime Corridor</h2>
          <span className="corridor-panel__subtitle">
            {corridor.client} / {corridor.run_id} / {corridor.sandbox_id}
          </span>
        </div>
        <div className="corridor-panel__header-right">
          <span className="corridor-badge corridor-badge--safe">READ-ONLY</span>
          <span className="corridor-panel__artifact-count">
            {corridor.loaded_count}/{corridor.total_count} artifacts loaded
          </span>
        </div>
      </div>

      <div className="corridor-panel__governance-notice">
        <span>SQO Operational Corridor · Sandbox state is not authority · Only published authority is LENS-consumable · This corridor is read-only · No activation is executed from this view</span>
      </div>

      <div className="corridor-panel__sections">
        <CorridorSandboxSessionSummary session={corridor.session} />
        <CorridorOverlayChainSummary overlayChain={corridor.overlayChain} />
        <CorridorReplayRollbackSummary replayRollback={corridor.replayRollback} />
        <CorridorCertificationSummary certification={corridor.certification} />
        <CorridorGovernanceZoneSummary governanceZone={corridor.governanceZone} />
        <CorridorAuthorityBoundarySummary authorityBoundary={corridor.authorityBoundary} />
        <CorridorLineageTraceSummary lineageTrace={corridor.lineageTrace} />
      </div>

      <div className="corridor-panel__footer">
        <span className="corridor-panel__footer-text">
          Read-only artifact consumption · No AI interpretation · Deterministic display · Replay and rollback certification are mandatory gates
        </span>
      </div>
    </div>
  );
}

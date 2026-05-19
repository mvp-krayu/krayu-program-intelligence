import PrimaryGuidanceStrip from './PrimaryGuidanceStrip';
import BlockerSummaryPanel from './BlockerSummaryPanel';
import ActionAvailabilityGrid from './ActionAvailabilityGrid';
import ProgressionPathVisualization from './ProgressionPathVisualization';

const POSTURE_CLASSES = {
  STRUCTURAL_ONLY: 'sqo-v2-posture--structural',
  SEMANTIC_INTAKE: 'sqo-v2-posture--intake',
  QUALIFICATION_PENDING: 'sqo-v2-posture--pending',
  CROSSWALK_ACTIVE: 'sqo-v2-posture--crosswalk',
  RECONCILIATION_ACTIVE: 'sqo-v2-posture--reconciliation',
  QUALIFIED: 'sqo-v2-posture--qualified',
  INSUFFICIENT_EVIDENCE: 'sqo-v2-posture--insufficient',
  PERMANENTLY_UNQUALIFIABLE: 'sqo-v2-posture--terminal',
};

const EVIDENCE_LABELS = {
  structural_topology: 'Structural Topology',
  semantic_intake: 'Semantic Intake',
  crosswalk: 'Crosswalk',
  reconciliation: 'Reconciliation',
  evidence_replay: 'Evidence Replay',
  vault_readiness: 'Vault Readiness',
  event_lineage: 'Event Lineage',
  authority_runtime: 'Authority Runtime',
};

export default function OperationalOverviewShell({ workflowState, onNavigateSection, onActionSelect }) {
  if (!workflowState) return null;

  const {
    currentPosture, primaryGuidance, blockerSummary, obligationSummary,
    evidenceState, availableActions, nextPossibleStates, progressionPath,
    roleProjection, availableDrilldowns, remediationWorkflow, isTerminal,
  } = workflowState;

  const postureClass = POSTURE_CLASSES[currentPosture.posture] || '';

  return (
    <div className={`sqo-v2-overview-shell ${postureClass}`}>
      {/* Zone: Posture */}
      <div className="sqo-v2-overview-shell__posture-zone">
        <div className="sqo-v2-overview-shell__s-badge">
          {currentPosture.s_level || 'S0'}
        </div>
        <div className="sqo-v2-overview-shell__posture-info">
          <span className="sqo-v2-overview-shell__posture-label">{currentPosture.postureLabel}</span>
          <span className="sqo-v2-overview-shell__posture-summary">{currentPosture.summary}</span>
        </div>
      </div>

      {/* Zone: Guidance */}
      <PrimaryGuidanceStrip primaryGuidance={primaryGuidance} onNavigateAction={onNavigateSection} />

      {/* Zone: Remediation Workflow */}
      {remediationWorkflow && (
        <div className="sqo-v2-overview-shell__remediation-zone">
          <div className="sqo-v2-overview-shell__remediation-header">
            <span className="sqo-v2-overview-shell__remediation-title">Remediation Workflow</span>
            <span className="sqo-v2-overview-shell__remediation-transition">
              {remediationWorkflow.current_state} → {remediationWorkflow.target_state}
            </span>
          </div>

          <div className="sqo-v2-overview-shell__remediation-stages">
            {remediationWorkflow.stages.map(stage => (
              <div key={stage.id} className={`sqo-v2-overview-shell__remediation-stage sqo-v2-overview-shell__remediation-stage--${stage.status}`}>
                <div className="sqo-v2-overview-shell__remediation-stage-header">
                  <span className="sqo-v2-overview-shell__remediation-stage-indicator">
                    {stage.status === 'active' ? '◉' : stage.status === 'pending' ? '○' : stage.status === 'future' ? '◇' : '●'}
                  </span>
                  <span className="sqo-v2-overview-shell__remediation-stage-label">{stage.label}</span>
                  {stage.blocker_count > 0 && (
                    <span className="sqo-v2-overview-shell__remediation-stage-count">
                      {stage.blocker_count} blocker{stage.blocker_count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <span className="sqo-v2-overview-shell__remediation-stage-desc">{stage.description}</span>
                {stage.source_requirement && (
                  <span className="sqo-v2-overview-shell__remediation-stage-source">{stage.source_requirement}</span>
                )}
                {stage.domains.length > 0 && (
                  <span className="sqo-v2-overview-shell__remediation-stage-domains">
                    {stage.domains.join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="sqo-v2-overview-shell__remediation-gates">
            <span className="sqo-v2-overview-shell__remediation-gates-title">S3 Eligibility Gates</span>
            {remediationWorkflow.gates.map((gate, i) => (
              <div key={i} className={`sqo-v2-overview-shell__remediation-gate ${gate.met ? 'sqo-v2-overview-shell__remediation-gate--met' : ''}`}>
                <span className="sqo-v2-overview-shell__remediation-gate-indicator">{gate.met ? '■' : '□'}</span>
                <span className="sqo-v2-overview-shell__remediation-gate-label">{gate.gate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone: Pressure (Blockers + Actions) */}
      <div className="sqo-v2-overview-shell__pressure-zone">
        <BlockerSummaryPanel blockerSummary={blockerSummary} roleProjection={roleProjection} />
        <ActionAvailabilityGrid availableActions={availableActions} roleProjection={roleProjection} onActionSelect={onActionSelect} />
      </div>

      {/* Zone: Obligations */}
      {obligationSummary && obligationSummary.total > 0 && (
        <div className="sqo-v2-overview-shell__obligation-zone">
          <div className="sqo-v2-overview-shell__obligation-summary">
            <span className="sqo-v2-overview-shell__obligation-title">Review Obligations</span>
            <div className="sqo-v2-overview-shell__obligation-counts">
              <span className="sqo-v2-overview-shell__obligation-stat">
                <span className="sqo-v2-overview-shell__obligation-stat-value">{obligationSummary.total}</span> total
              </span>
              <span className="sqo-v2-overview-shell__obligation-stat">
                <span className="sqo-v2-overview-shell__obligation-stat-value">{obligationSummary.unresolved}</span> unresolved
              </span>
              {obligationSummary.contested > 0 && (
                <span className="sqo-v2-overview-shell__obligation-stat sqo-v2-overview-shell__obligation-stat--contested">
                  <span className="sqo-v2-overview-shell__obligation-stat-value">{obligationSummary.contested}</span> contested
                </span>
              )}
              <span className="sqo-v2-overview-shell__obligation-stat">
                <span className="sqo-v2-overview-shell__obligation-stat-value">{obligationSummary.actionable_by_role}</span> actionable by role
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Zone: Progression */}
      <ProgressionPathVisualization progressionPath={progressionPath} nextPossibleStates={nextPossibleStates} />

      {/* Zone: Evidence */}
      {evidenceState && (
        <div className="sqo-v2-overview-shell__evidence-zone">
          <span className="sqo-v2-overview-shell__evidence-title">Evidence State</span>
          <div className="sqo-v2-overview-shell__evidence-grid">
            {Object.entries(evidenceState).map(([key, state]) => (
              <div
                key={key}
                className={`sqo-v2-overview-shell__evidence-item ${state.available ? 'sqo-v2-overview-shell__evidence-item--available' : 'sqo-v2-overview-shell__evidence-item--absent'}`}
              >
                <span className="sqo-v2-overview-shell__evidence-indicator">{state.available ? '●' : '○'}</span>
                <span className="sqo-v2-overview-shell__evidence-label">{EVIDENCE_LABELS[key] || key}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone: Drilldowns */}
      {availableDrilldowns && (
        <div className="sqo-v2-overview-shell__drilldown-zone">
          {availableDrilldowns.tier2.filter(d => d.available).length > 0 && (
            <div className="sqo-v2-overview-shell__drilldown-group">
              <span className="sqo-v2-overview-shell__drilldown-group-label">Qualification Detail</span>
              <div className="sqo-v2-overview-shell__drilldown-items">
                {availableDrilldowns.tier2.filter(d => d.available).map(d => (
                  <button
                    key={d.section}
                    className={`sqo-v2-overview-shell__drilldown-link ${d.relevance === 'primary' ? 'sqo-v2-overview-shell__drilldown-link--primary' : ''}`}
                    onClick={() => onNavigateSection && onNavigateSection(d.section)}
                    type="button"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zone: Governance */}
      <div className="sqo-v2-overview-shell__governance">
        Operational qualification overview — computed from governed artifacts. Not editable. Not cacheable.
      </div>
    </div>
  );
}

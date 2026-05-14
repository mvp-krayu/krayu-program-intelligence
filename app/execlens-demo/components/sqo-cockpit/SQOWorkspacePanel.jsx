import SemanticDebtPanel from './SemanticDebtPanel';
import ContinuityAssessmentPanel from './ContinuityAssessmentPanel';
import MaturityProfilePanel from './MaturityProfilePanel';
import ProgressionReadinessPanel from './ProgressionReadinessPanel';
import EvidenceReplayPanel from './EvidenceReplayPanel';
import HandoffReadinessPanel from './HandoffReadinessPanel';

const SECTION_PANELS = {
  debt: (data) => <SemanticDebtPanel debtData={data} />,
  continuity: (data) => <ContinuityAssessmentPanel continuityData={data} />,
  maturity: (data) => <MaturityProfilePanel maturityData={data} />,
  progression: (data) => <ProgressionReadinessPanel progressionData={data} />,
  evidence: (data) => <EvidenceReplayPanel evidenceData={data} />,
  handoff: (data) => <HandoffReadinessPanel handoffData={data} />,
};

const SECTION_CONTEXT = {
  debt: {
    title: 'Semantic Debt',
    purpose: 'Forensic qualification debt inspection.',
    focus: 'Focus first on immediate qualification blockers that prevent state advancement.',
    type: 'operational guidance',
  },
  continuity: {
    title: 'Continuity Assessment',
    purpose: 'Semantic continuity validation and crosswalk coverage inspection.',
    focus: 'Review domain coverage gaps and evidence linkage continuity across qualification artifacts.',
    type: 'forensic detail',
  },
  maturity: {
    title: 'Maturity Profile',
    purpose: 'Structural maturity assessment across qualification dimensions.',
    focus: 'Examine dimension-level maturity scores and identify structural weaknesses.',
    type: 'forensic detail',
  },
  progression: {
    title: 'Progression Readiness',
    purpose: 'State transition readiness and gate validation.',
    focus: 'Check which gates are met and what remains before the next qualification state is reachable.',
    type: 'operational guidance',
  },
  evidence: {
    title: 'Evidence & Replay',
    purpose: 'Evidence chain replay and artifact traceability inspection.',
    focus: 'Trace evidence lineage from source through derivation to validate completeness.',
    type: 'forensic detail',
  },
  handoff: {
    title: 'PATH B Handoff',
    purpose: 'PATH B handoff readiness and activation boundary inspection.',
    focus: 'Verify that all qualification prerequisites for PATH B activation are satisfied.',
    type: 'operational guidance',
  },
};

export default function SQOWorkspacePanel({ section, sectionData, onNavigateOverview }) {
  if (!sectionData) return null;

  const renderer = SECTION_PANELS[section];
  const data = sectionData[section];
  const context = SECTION_CONTEXT[section];

  if (!renderer) return null;

  return (
    <div className="sqo-workspace-panel" key={section}>
      {context && (
        <div className="sqo-workspace-panel__header">
          <div className="sqo-workspace-panel__header-top">
            {onNavigateOverview && (
              <button
                className="sqo-workspace-panel__back"
                onClick={onNavigateOverview}
                type="button"
              >
                ← Overview
              </button>
            )}
            <span className="sqo-workspace-panel__type">{context.type}</span>
          </div>
          <h2 className="sqo-workspace-panel__title">{context.title}</h2>
          <p className="sqo-workspace-panel__purpose">{context.purpose}</p>
          <p className="sqo-workspace-panel__focus">{context.focus}</p>
        </div>
      )}
      {renderer(data)}
    </div>
  );
}

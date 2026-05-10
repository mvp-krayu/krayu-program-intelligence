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

export default function SQOWorkspacePanel({ section, sectionData }) {
  if (!sectionData) return null;

  const renderer = SECTION_PANELS[section];
  const data = sectionData[section];

  if (!renderer) return null;

  return (
    <div className="sqo-workspace-panel" key={section}>
      {renderer(data)}
    </div>
  );
}

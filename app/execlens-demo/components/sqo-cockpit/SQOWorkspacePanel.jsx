import SemanticDebtPanel from './SemanticDebtPanel';
import ContinuityAssessmentPanel from './ContinuityAssessmentPanel';
import MaturityProfilePanel from './MaturityProfilePanel';
import ProgressionReadinessPanel from './ProgressionReadinessPanel';
import EvidenceReplayPanel from './EvidenceReplayPanel';
import HandoffReadinessPanel from './HandoffReadinessPanel';
import ReconciliationCorrespondencePanel from './ReconciliationCorrespondencePanel';
import ReconciliationLoopWorkflowPanel from './ReconciliationLoopWorkflowPanel';
import OperatorAuthorityWorkflowPanel from './authority/OperatorAuthorityWorkflowPanel';
import SemanticCandidateExtractionPanel from './SemanticCandidateExtractionPanel';
import DynamicCEUAdmissibilityPanel from './DynamicCEUAdmissibilityPanel';
import EvidenceIngestionCorridorPanel from './EvidenceIngestionCorridorPanel';
import BlueEdgeRuntimeCorridorPanel from './BlueEdgeRuntimeCorridorPanel';
import ExplicitEvidenceRebasePanel from './ExplicitEvidenceRebasePanel';
import SemanticQualificationIntakePanel from './SemanticQualificationIntakePanel';
import CeuReconciliationPanel from './CeuReconciliationPanel';
import SectionUnavailableNotice from './SectionUnavailableNotice';

const SECTION_PANELS = {
  debt: (data) => <SemanticDebtPanel debtData={data} />,
  continuity: (data) => <ContinuityAssessmentPanel continuityData={data} />,
  maturity: (data) => <MaturityProfilePanel maturityData={data} />,
  progression: (data) => <ProgressionReadinessPanel progressionData={data} />,
  evidence: (data) => <EvidenceReplayPanel evidenceData={data} />,
  handoff: (data) => <HandoffReadinessPanel handoffData={data} />,
  reconciliation: (data) => <ReconciliationCorrespondencePanel reconciliationData={data} />,
  'reconciliation-loop': (data) => <ReconciliationLoopWorkflowPanel loopData={data} />,
  authority: (data) => <OperatorAuthorityWorkflowPanel authorityData={data} />,
  'semantic-candidates': (data) => {
    if (!data || !data.available) return <SectionUnavailableNotice section="Semantic Intake" reason={data && data.failReason} />;
    if (data.layer === 'B') return <SemanticQualificationIntakePanel intakeData={data} />;
    return <SemanticCandidateExtractionPanel extraction={data} />;
  },
  'ceu-admissibility': (data) => {
    if (!data || !data.available) return <SectionUnavailableNotice section="CEU Admissibility" reason={data && data.failReason} />;
    return <DynamicCEUAdmissibilityPanel admissibility={data} />;
  },
  'ceu-reconciliation': (data) => {
    if (!data || !data.available) return <SectionUnavailableNotice section="CEU Reconciliation" reason={data && data.failReason} />;
    return <CeuReconciliationPanel ceuData={data} />;
  },
  'evidence-ingestion': (data) => {
    if (!data || !data.available) return <SectionUnavailableNotice section="Evidence Ingestion" reason={data && data.failReason} />;
    return <EvidenceIngestionCorridorPanel evidence={data} />;
  },
  corridor: (data) => {
    if (!data || !data.available) return <SectionUnavailableNotice section="Runtime Corridor" reason={data && data.failReason} />;
    return <BlueEdgeRuntimeCorridorPanel corridor={data} />;
  },
  'evidence-rebase': (data) => {
    if (!data || !data.available) return <SectionUnavailableNotice section="Evidence Rebase" reason={data && data.failReason} />;
    return <ExplicitEvidenceRebasePanel rebase={data} />;
  },
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
  reconciliation: {
    title: 'Reconciliation Correspondence',
    purpose: 'PATH A ↔ PATH B reconciliation: per-domain correspondence with graduated confidence.',
    focus: 'Inspect which semantic domains have structural backing, the confidence level of each correspondence, and what remains unmapped.',
    type: 'forensic detail',
  },
  'reconciliation-loop': {
    title: 'Reconciliation Loop',
    purpose: 'Operational workflow for the semantic reconciliation improvement loop.',
    focus: 'See current loop state, phase completion, next required action, blocked reasons, rerun chain, and propagation status.',
    type: 'operational guidance',
  },
  authority: {
    title: 'Authority Workflow',
    purpose: 'Governed operator authority actions: review obligations, qualification advancement, insufficiency acknowledgment.',
    focus: 'Execute bounded operational acceptance, contest semantic interpretations, manage qualification progression.',
    type: 'operational authority',
  },
  'semantic-candidates': {
    title: 'Semantic Intake',
    purpose: 'Semantic qualification intake: discovered domains, admissibility posture, evidence sufficiency, qualification blockers.',
    focus: 'Understand what semantic structure has been identified and what blocks qualification advancement.',
    type: 'qualification intake',
  },
  'ceu-admissibility': {
    title: 'CEU Admissibility',
    purpose: 'Canonical Evidence Unit admissibility evaluation and structural compatibility assessment.',
    focus: 'Review admissibility determinations for extracted semantic candidates.',
    type: 'engineering substrate',
  },
  'ceu-reconciliation': {
    title: 'CEU Reconciliation',
    purpose: 'Governed CEU candidate validation: structural evidence vs documentation reconciliation.',
    focus: 'Review, reconcile, and confirm or reject structurally-derived CEU candidates.',
    type: 'operational workflow',
  },
  'evidence-ingestion': {
    title: 'Evidence Ingestion',
    purpose: 'Evidence registry, source verification, and ingestion corridor state.',
    focus: 'Inspect evidence source integrity and ingestion pipeline state.',
    type: 'engineering substrate',
  },
  corridor: {
    title: 'Runtime Corridor',
    purpose: 'Runtime overlay management: sandbox state, activation, replay, rollback.',
    focus: 'Manage runtime corridor artifacts and overlay lifecycle.',
    type: 'engineering substrate',
  },
  'evidence-rebase': {
    title: 'Evidence Rebase',
    purpose: 'Evidence chain rebase extraction and source linkage.',
    focus: 'Inspect rebased evidence artifacts and extraction provenance.',
    type: 'engineering substrate',
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

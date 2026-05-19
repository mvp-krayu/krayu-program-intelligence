import OperationalCockpitShell from '../../../../../../../../components/sqo-cockpit/v2/OperationalCockpitShell';

const TIER2_SECTIONS = ['semantic-candidates', 'progression', 'reconciliation', 'evidence', 'debt'];

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveOperatorWorkflowFromRaw } = require('../../../../../../../../lib/sqo-cockpit/server/OperatorWorkflowResolver.server');
  const { resolveClientScopedSection } = require('../../../../../../../../lib/sqo-cockpit/server/ClientScopedSectionResolver.server');
  const { client, run, section } = context.params;

  if (!TIER2_SECTIONS.includes(section)) {
    return { notFound: true };
  }

  const workspaceData = resolveWorkspaceData(client, run, section);
  const workflowState = resolveOperatorWorkflowFromRaw(client, run, 'operator');

  if (['semantic-candidates', 'ceu-admissibility', 'evidence-ingestion', 'corridor', 'evidence-rebase'].includes(section)) {
    const sectionResult = resolveClientScopedSection(client, run, section);
    if (!workspaceData.sectionData) workspaceData.sectionData = {};
    workspaceData.sectionData[section] = JSON.parse(JSON.stringify(sectionResult));
  }

  workspaceData.workflowState = JSON.parse(JSON.stringify(workflowState));

  return { props: workspaceData };
}

export default function V2DetailPage(props) {
  return <OperationalCockpitShell {...props} />;
}

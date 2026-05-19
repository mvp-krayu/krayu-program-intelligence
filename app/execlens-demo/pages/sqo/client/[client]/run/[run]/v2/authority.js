import OperationalCockpitShell from '../../../../../../../components/sqo-cockpit/v2/OperationalCockpitShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveOperatorWorkflowFromRaw, resolveAuthorityWorkspace } = require('../../../../../../../lib/sqo-cockpit/server/OperatorWorkflowResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'authority');
  const workflowState = resolveOperatorWorkflowFromRaw(client, run, 'operator');
  const authorityData = resolveAuthorityWorkspace(client, run);

  if (!workspaceData.sectionData) workspaceData.sectionData = {};
  workspaceData.sectionData.authority = JSON.parse(JSON.stringify(authorityData));
  workspaceData.workflowState = JSON.parse(JSON.stringify(workflowState));

  return { props: workspaceData };
}

export default function V2AuthorityPage(props) {
  return <OperationalCockpitShell {...props} />;
}

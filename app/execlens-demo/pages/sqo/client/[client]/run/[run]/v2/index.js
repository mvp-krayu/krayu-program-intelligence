import OperationalCockpitShell from '../../../../../../../components/sqo-cockpit/v2/OperationalCockpitShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveOperatorWorkflowFromRaw } = require('../../../../../../../lib/sqo-cockpit/server/OperatorWorkflowResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'overview');
  const workflowState = resolveOperatorWorkflowFromRaw(client, run, 'operator');

  workspaceData.workflowState = JSON.parse(JSON.stringify(workflowState));

  return { props: workspaceData };
}

export default function V2OverviewPage(props) {
  return <OperationalCockpitShell {...props} />;
}

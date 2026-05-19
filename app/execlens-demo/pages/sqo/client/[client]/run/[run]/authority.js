import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveAuthorityWorkspace } = require('../../../../../../lib/sqo-cockpit/server/OperatorWorkflowResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'authority');
  const authorityData = resolveAuthorityWorkspace(client, run);

  if (!workspaceData.sectionData) {
    workspaceData.sectionData = {};
  }
  workspaceData.sectionData.authority = JSON.parse(JSON.stringify(authorityData));

  return { props: workspaceData };
}

export default function SQOAuthorityPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

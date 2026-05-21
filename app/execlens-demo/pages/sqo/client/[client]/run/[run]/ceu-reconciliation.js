import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveCeuReconciliationWorkspace } = require('../../../../../../lib/sqo-cockpit/server/CEUReconciliationResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'ceu-reconciliation');
  const ceuData = resolveCeuReconciliationWorkspace(client, run);

  if (!workspaceData.sectionData) {
    workspaceData.sectionData = {};
  }
  workspaceData.sectionData['ceu-reconciliation'] = JSON.parse(JSON.stringify(ceuData));

  return { props: workspaceData };
}

export default function CEUReconciliationPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveClientScopedSection } = require('../../../../../../lib/sqo-cockpit/server/ClientScopedSectionResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'corridor');
  const sectionResult = resolveClientScopedSection(client, run, 'corridor');

  if (!workspaceData.sectionData) {
    workspaceData.sectionData = {};
  }
  workspaceData.sectionData['corridor'] = JSON.parse(JSON.stringify(sectionResult));

  return { props: workspaceData };
}

export default function CorridorPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

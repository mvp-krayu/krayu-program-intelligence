import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveClientScopedSection } = require('../../../../../../lib/sqo-cockpit/server/ClientScopedSectionResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'semantic-candidates');
  const sectionResult = resolveClientScopedSection(client, run, 'semantic-candidates');

  if (!workspaceData.sectionData) {
    workspaceData.sectionData = {};
  }
  workspaceData.sectionData['semantic-candidates'] = JSON.parse(JSON.stringify(sectionResult));

  return { props: workspaceData };
}

export default function SemanticCandidatesPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

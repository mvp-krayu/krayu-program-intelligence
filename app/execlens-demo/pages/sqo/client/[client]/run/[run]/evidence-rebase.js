import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveClientScopedSection } = require('../../../../../../lib/sqo-cockpit/server/ClientScopedSectionResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'evidence-rebase');
  const sectionResult = resolveClientScopedSection(client, run, 'evidence-rebase');

  if (!workspaceData.sectionData) {
    workspaceData.sectionData = {};
  }
  workspaceData.sectionData['evidence-rebase'] = JSON.parse(JSON.stringify(sectionResult));

  return { props: workspaceData };
}

export default function EvidenceRebasePage(props) {
  return <SQOWorkspaceShell {...props} />;
}

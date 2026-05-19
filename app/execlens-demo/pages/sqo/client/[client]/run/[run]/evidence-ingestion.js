import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveClientScopedSection } = require('../../../../../../lib/sqo-cockpit/server/ClientScopedSectionResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'evidence-ingestion');
  const sectionResult = resolveClientScopedSection(client, run, 'evidence-ingestion');

  if (!workspaceData.sectionData) {
    workspaceData.sectionData = {};
  }
  workspaceData.sectionData['evidence-ingestion'] = JSON.parse(JSON.stringify(sectionResult));

  return { props: workspaceData };
}

export default function EvidenceIngestionPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

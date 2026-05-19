import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { resolveClientScopedSection } = require('../../../../../../lib/sqo-cockpit/server/ClientScopedSectionResolver.server');
  const { client, run } = context.params;

  const workspaceData = resolveWorkspaceData(client, run, 'ceu-admissibility');
  const sectionResult = resolveClientScopedSection(client, run, 'ceu-admissibility');

  if (!workspaceData.sectionData) {
    workspaceData.sectionData = {};
  }
  workspaceData.sectionData['ceu-admissibility'] = JSON.parse(JSON.stringify(sectionResult));

  return { props: workspaceData };
}

export default function CEUAdmissibilityPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

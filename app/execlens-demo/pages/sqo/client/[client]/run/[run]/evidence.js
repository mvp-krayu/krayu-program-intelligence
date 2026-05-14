import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { client, run } = context.params;
  return { props: resolveWorkspaceData(client, run, 'evidence') };
}

export default function SQOEvidencePage(props) {
  return <SQOWorkspaceShell {...props} />;
}

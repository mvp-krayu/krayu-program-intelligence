import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { client, run } = context.params;
  return { props: resolveWorkspaceData(client, run, 'handoff') };
}

export default function SQOHandoffPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

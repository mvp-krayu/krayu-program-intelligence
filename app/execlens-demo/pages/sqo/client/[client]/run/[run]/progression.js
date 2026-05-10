import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { client, run } = context.params;
  return { props: resolveWorkspaceData(client, run, 'progression') };
}

export default function SQOProgressionPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { client, run } = context.params;
  return { props: resolveWorkspaceData(client, run, 'maturity') };
}

export default function SQOMaturityPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

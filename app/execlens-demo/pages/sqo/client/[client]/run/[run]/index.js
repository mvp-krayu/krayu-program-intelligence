import SQOWorkspaceShell from '../../../../../../components/sqo-cockpit/SQOWorkspaceShell';

export async function getServerSideProps(context) {
  const { resolveWorkspaceData } = require('../../../../../../lib/sqo-cockpit/SQOWorkspaceDataResolver');
  const { client, run } = context.params;
  const section = context.query.section || 'overview';
  return { props: resolveWorkspaceData(client, run, section) };
}

export default function SQOOverviewPage(props) {
  return <SQOWorkspaceShell {...props} />;
}

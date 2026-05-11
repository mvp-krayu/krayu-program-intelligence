import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import BlueEdgeRuntimeCorridorPanel from '../../../../../../components/sqo-cockpit/BlueEdgeRuntimeCorridorPanel';

export async function getServerSideProps(context) {
  const { loadCorridorData } = require('../../../../../../lib/sqo-cockpit/server/BlueEdgeRuntimeCorridorLoader.server');
  const { buildCorridorViewModel } = require('../../../../../../lib/sqo-cockpit/client/BlueEdgeRuntimeCorridorViewModel');
  const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
  const { listAllowedClientRuns } = require('../../../../../../lib/lens-v2/manifests');

  const { client, run } = context.params;

  const routeCheck = validateRouteParams(client, run);
  if (routeCheck.error) {
    return { props: { client, runId: run, error: routeCheck.error, corridor: null, navigation: [], clientRuns: [] } };
  }

  const corridorData = loadCorridorData();
  const corridor = buildCorridorViewModel(corridorData);

  const navigation = buildNavigationItems(client, run, 'corridor');
  const clientRuns = listAllowedClientRuns();

  return {
    props: {
      client,
      runId: run,
      error: null,
      corridor,
      navigation,
      clientRuns,
    },
  };
}

export default function CorridorPage({ client, runId, error, corridor, navigation, clientRuns }) {
  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <h1>SQO Cockpit</h1>
        <p>Route validation failed: {error}</p>
      </div>
    );
  }

  return (
    <div className="sqo-cockpit">
      <SQONavigation
        client={client}
        runId={runId}
        activeSection="corridor"
        sections={navigation}
        clientRuns={clientRuns}
      />
      <main className="sqo-cockpit__content">
        <BlueEdgeRuntimeCorridorPanel corridor={corridor} />
      </main>
    </div>
  );
}

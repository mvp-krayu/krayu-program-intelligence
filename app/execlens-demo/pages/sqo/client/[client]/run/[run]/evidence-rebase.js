import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import ExplicitEvidenceRebasePanel from '../../../../../../components/sqo-cockpit/ExplicitEvidenceRebasePanel';

export async function getServerSideProps(context) {
  const { loadExplicitEvidenceRebaseData } = require('../../../../../../lib/sqo-cockpit/server/ExplicitEvidenceRebaseExtractor.server');
  const { buildExplicitEvidenceRebaseViewModel } = require('../../../../../../lib/sqo-cockpit/client/ExplicitEvidenceRebaseViewModel');
  const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
  const { listAllowedClientRuns } = require('../../../../../../lib/lens-v2/manifests');

  const { client, run } = context.params;

  const routeCheck = validateRouteParams(client, run);
  if (routeCheck.error) {
    return { props: { client, runId: run, error: routeCheck.error, rebase: null, navigation: [], clientRuns: [] } };
  }

  const rebaseData = loadExplicitEvidenceRebaseData();
  const rebase = buildExplicitEvidenceRebaseViewModel(rebaseData);

  const navigation = buildNavigationItems(client, run, 'evidence-rebase');
  const clientRuns = listAllowedClientRuns();

  return {
    props: {
      client,
      runId: run,
      error: null,
      rebase,
      navigation,
      clientRuns,
    },
  };
}

export default function EvidenceRebasePage({ client, runId, error, rebase, navigation, clientRuns }) {
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
        activeSection="evidence-rebase"
        sections={navigation}
        clientRuns={clientRuns}
      />
      <main className="sqo-cockpit__content">
        <ExplicitEvidenceRebasePanel rebase={rebase} />
      </main>
    </div>
  );
}

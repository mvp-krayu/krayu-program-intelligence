import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import EvidenceIngestionCorridorPanel from '../../../../../../components/sqo-cockpit/EvidenceIngestionCorridorPanel';

export async function getServerSideProps(context) {
  const { loadEvidenceIngestionData } = require('../../../../../../lib/sqo-cockpit/server/BlueEdgeEvidenceIngestionLoader.server');
  const { buildEvidenceViewModel } = require('../../../../../../lib/sqo-cockpit/client/BlueEdgeEvidenceViewModel');
  const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
  const { listAllowedClientRuns } = require('../../../../../../lib/lens-v2/manifests');

  const { client, run } = context.params;

  const routeCheck = validateRouteParams(client, run);
  if (routeCheck.error) {
    return { props: { client, runId: run, error: routeCheck.error, evidence: null, navigation: [], clientRuns: [] } };
  }

  const evidenceData = loadEvidenceIngestionData();
  const evidence = buildEvidenceViewModel(evidenceData);

  const navigation = buildNavigationItems(client, run, 'evidence-ingestion');
  const clientRuns = listAllowedClientRuns();

  return {
    props: {
      client,
      runId: run,
      error: null,
      evidence,
      navigation,
      clientRuns,
    },
  };
}

export default function EvidenceIngestionPage({ client, runId, error, evidence, navigation, clientRuns }) {
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
        activeSection="evidence-ingestion"
        sections={navigation}
        clientRuns={clientRuns}
      />
      <main className="sqo-cockpit__content">
        <EvidenceIngestionCorridorPanel evidence={evidence} />
      </main>
    </div>
  );
}

import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import DynamicCEUAdmissibilityPanel from '../../../../../../components/sqo-cockpit/DynamicCEUAdmissibilityPanel';

export async function getServerSideProps(context) {
  const { loadRebasedAdmissibilityData } = require('../../../../../../lib/sqo-cockpit/server/ExplicitEvidenceRebaseExtractor.server');
  const { buildDynamicCEUAdmissibilityViewModel } = require('../../../../../../lib/sqo-cockpit/client/DynamicCEUAdmissibilityViewModel');
  const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
  const { listAllowedClientRuns } = require('../../../../../../lib/lens-v2/manifests');

  const { client, run } = context.params;

  const routeCheck = validateRouteParams(client, run);
  if (routeCheck.error) {
    return { props: { client, runId: run, error: routeCheck.error, admissibility: null, navigation: [], clientRuns: [] } };
  }

  const admissibilityData = loadRebasedAdmissibilityData();
  const admissibility = buildDynamicCEUAdmissibilityViewModel(admissibilityData);

  if (admissibility.available) {
    admissibility.source_status = admissibilityData.source_status || null;
    admissibility.previous_chain_status = admissibilityData.previous_chain_status || null;
    admissibility.evidence_set_id = admissibilityData.evidence_set_id || null;
    admissibility.evidence_files = admissibilityData.evidence_files || [];
    admissibility.source_class = admissibilityData.source_class || null;
  }

  const navigation = buildNavigationItems(client, run, 'ceu-admissibility');
  const clientRuns = listAllowedClientRuns();

  return {
    props: {
      client,
      runId: run,
      error: null,
      admissibility,
      navigation,
      clientRuns,
    },
  };
}

export default function CEUAdmissibilityPage({ client, runId, error, admissibility, navigation, clientRuns }) {
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
        activeSection="ceu-admissibility"
        sections={navigation}
        clientRuns={clientRuns}
      />
      <main className="sqo-cockpit__content">
        <DynamicCEUAdmissibilityPanel admissibility={admissibility} />
      </main>
    </div>
  );
}

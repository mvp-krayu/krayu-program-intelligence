import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import SemanticCandidateExtractionPanel from '../../../../../../components/sqo-cockpit/SemanticCandidateExtractionPanel';

export async function getServerSideProps(context) {
  const { loadRebasedCandidateData } = require('../../../../../../lib/sqo-cockpit/server/ExplicitEvidenceRebaseExtractor.server');
  const { buildSemanticCandidateViewModel } = require('../../../../../../lib/sqo-cockpit/client/BlueEdgeSemanticCandidateViewModel');
  const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
  const { listAllowedClientRuns } = require('../../../../../../lib/lens-v2/manifests');

  const { client, run } = context.params;

  const routeCheck = validateRouteParams(client, run);
  if (routeCheck.error) {
    return { props: { client, runId: run, error: routeCheck.error, extraction: null, navigation: [], clientRuns: [] } };
  }

  const candidateData = loadRebasedCandidateData();
  const extraction = buildSemanticCandidateViewModel(candidateData);

  if (extraction.available) {
    extraction.source_status = candidateData.source_status || null;
    extraction.previous_chain_status = candidateData.previous_chain_status || null;
    extraction.evidence_set_id = candidateData.evidence_set_id || null;
    extraction.evidence_files = candidateData.evidence_files || [];
    extraction.source_class = candidateData.source_class || null;
  }

  const navigation = buildNavigationItems(client, run, 'semantic-candidates');
  const clientRuns = listAllowedClientRuns();

  return {
    props: {
      client,
      runId: run,
      error: null,
      extraction,
      navigation,
      clientRuns,
    },
  };
}

export default function SemanticCandidatesPage({ client, runId, error, extraction, navigation, clientRuns }) {
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
        activeSection="semantic-candidates"
        sections={navigation}
        clientRuns={clientRuns}
      />
      <main className="sqo-cockpit__content">
        <SemanticCandidateExtractionPanel extraction={extraction} />
      </main>
    </div>
  );
}

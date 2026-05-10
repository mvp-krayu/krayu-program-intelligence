import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import SQODegradedState from '../../../../../../components/sqo-cockpit/SQODegradedState';
import SemanticDebtPanel from '../../../../../../components/sqo-cockpit/SemanticDebtPanel';

const { resolveCockpitState } = require('../../../../../../lib/sqo-cockpit/SQOCockpitStateResolver');
const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
const { formatDebtSection } = require('../../../../../../lib/sqo-cockpit/SQOCockpitFormatter');
const { buildDegradedNotice } = require('../../../../../../lib/sqo-cockpit/SQOCockpitDegradationHandler');

export async function getServerSideProps(context) {
  const { client, run } = context.params;
  const validation = validateRouteParams(client, run);

  if (!validation.valid) {
    return { props: { client, runId: run, error: validation.error, debtData: null, navigation: null, degradation: null, degradedNotice: null } };
  }

  const state = resolveCockpitState(client, run);
  const navigation = buildNavigationItems(client, run, 'debt');
  const debtData = state.artifacts ? formatDebtSection(state.artifacts) : null;
  const degradedNotice = state.degradation ? buildDegradedNotice(state.degradation) : null;

  return {
    props: { client, runId: run, error: null, debtData, navigation, degradation: state.degradation, degradedNotice },
  };
}

export default function SQODebtPage({ client, runId, error, debtData, navigation, degradation, degradedNotice }) {
  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <SQODegradedState degradation={{ state: error, reason: `Route validation failed: ${error}` }} />
      </div>
    );
  }

  return (
    <div className="sqo-cockpit">
      <SQONavigation client={client} runId={runId} activeSection="debt" sections={navigation} degradation={degradation} />
      <main className="sqo-cockpit__content">
        {degradedNotice && <div className={`sqo-cockpit__notice sqo-cockpit__notice--${degradedNotice.severity.toLowerCase()}`}>{degradedNotice.message}</div>}
        <SemanticDebtPanel debtData={debtData} />
      </main>
      <footer className="sqo-cockpit__governance">Read-only artifact consumption · No AI interpretation · Deterministic display</footer>
    </div>
  );
}

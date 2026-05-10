import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import SQODegradedState from '../../../../../../components/sqo-cockpit/SQODegradedState';
import HandoffReadinessPanel from '../../../../../../components/sqo-cockpit/HandoffReadinessPanel';

const { resolveCockpitState } = require('../../../../../../lib/sqo-cockpit/SQOCockpitStateResolver');
const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
const { formatHandoffSection } = require('../../../../../../lib/sqo-cockpit/SQOCockpitFormatter');
const { buildDegradedNotice } = require('../../../../../../lib/sqo-cockpit/SQOCockpitDegradationHandler');

export async function getServerSideProps(context) {
  const { client, run } = context.params;
  const validation = validateRouteParams(client, run);

  if (!validation.valid) {
    return { props: { client, runId: run, error: validation.error, handoffData: null, navigation: null, degradation: null, degradedNotice: null } };
  }

  const state = resolveCockpitState(client, run);
  const navigation = buildNavigationItems(client, run, 'handoff');
  const handoffData = state.artifacts ? formatHandoffSection(state.artifacts, state.handoff_status) : null;
  const degradedNotice = state.degradation ? buildDegradedNotice(state.degradation) : null;

  return {
    props: { client, runId: run, error: null, handoffData, navigation, degradation: state.degradation, degradedNotice },
  };
}

export default function SQOHandoffPage({ client, runId, error, handoffData, navigation, degradation, degradedNotice }) {
  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <SQODegradedState degradation={{ state: error, reason: `Route validation failed: ${error}` }} />
      </div>
    );
  }

  return (
    <div className="sqo-cockpit">
      <SQONavigation client={client} runId={runId} activeSection="handoff" sections={navigation} degradation={degradation} />
      <main className="sqo-cockpit__content">
        {degradedNotice && <div className={`sqo-cockpit__notice sqo-cockpit__notice--${degradedNotice.severity.toLowerCase()}`}>{degradedNotice.message}</div>}
        <HandoffReadinessPanel handoffData={handoffData} />
      </main>
      <footer className="sqo-cockpit__governance">Read-only artifact consumption · No AI interpretation · Deterministic display</footer>
    </div>
  );
}

import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import SQODegradedState from '../../../../../../components/sqo-cockpit/SQODegradedState';
import ProgressionReadinessPanel from '../../../../../../components/sqo-cockpit/ProgressionReadinessPanel';

const { resolveCockpitState } = require('../../../../../../lib/sqo-cockpit/SQOCockpitStateResolver');
const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
const { formatProgressionSection } = require('../../../../../../lib/sqo-cockpit/SQOCockpitFormatter');
const { buildDegradedNotice } = require('../../../../../../lib/sqo-cockpit/SQOCockpitDegradationHandler');

export async function getServerSideProps(context) {
  const { client, run } = context.params;
  const validation = validateRouteParams(client, run);

  if (!validation.valid) {
    return { props: { client, runId: run, error: validation.error, progressionData: null, navigation: null, degradation: null, degradedNotice: null } };
  }

  const state = resolveCockpitState(client, run);
  const navigation = buildNavigationItems(client, run, 'progression');
  const progressionData = state.artifacts ? formatProgressionSection(state.artifacts) : null;
  const degradedNotice = state.degradation ? buildDegradedNotice(state.degradation) : null;

  return {
    props: { client, runId: run, error: null, progressionData, navigation, degradation: state.degradation, degradedNotice },
  };
}

export default function SQOProgressionPage({ client, runId, error, progressionData, navigation, degradation, degradedNotice }) {
  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <SQODegradedState degradation={{ state: error, reason: `Route validation failed: ${error}` }} />
      </div>
    );
  }

  return (
    <div className="sqo-cockpit">
      <SQONavigation client={client} runId={runId} activeSection="progression" sections={navigation} degradation={degradation} />
      <main className="sqo-cockpit__content">
        {degradedNotice && <div className={`sqo-cockpit__notice sqo-cockpit__notice--${degradedNotice.severity.toLowerCase()}`}>{degradedNotice.message}</div>}
        <ProgressionReadinessPanel progressionData={progressionData} />
      </main>
      <footer className="sqo-cockpit__governance">Read-only artifact consumption · No AI interpretation · Deterministic display</footer>
    </div>
  );
}

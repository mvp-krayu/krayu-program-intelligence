import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import SQODegradedState from '../../../../../../components/sqo-cockpit/SQODegradedState';
import QualificationOverviewPanel from '../../../../../../components/sqo-cockpit/QualificationOverviewPanel';

const { resolveCockpitState, COCKPIT_STATES } = require('../../../../../../lib/sqo-cockpit/SQOCockpitStateResolver');
const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
const { formatOverview } = require('../../../../../../lib/sqo-cockpit/SQOCockpitFormatter');
const { buildDegradedNotice } = require('../../../../../../lib/sqo-cockpit/SQOCockpitDegradationHandler');

export async function getServerSideProps(context) {
  const { client, run } = context.params;
  const validation = validateRouteParams(client, run);

  if (!validation.valid) {
    return {
      props: {
        client,
        runId: run,
        error: validation.error,
        cockpitState: null,
        overview: null,
        navigation: null,
        degradedNotice: null,
      },
    };
  }

  const state = resolveCockpitState(client, run);
  const navigation = buildNavigationItems(client, run, 'overview');
  const overview = state.artifacts ? formatOverview(state.artifacts) : null;
  const degradedNotice = state.degradation ? buildDegradedNotice(state.degradation) : null;

  return {
    props: {
      client,
      runId: run,
      error: null,
      cockpitState: {
        state: state.cockpit_state,
        label: state.label,
        visual_posture: state.visual_posture,
      },
      overview,
      navigation,
      degradation: state.degradation,
      degradedNotice,
    },
  };
}

export default function SQOOverviewPage({ client, runId, error, cockpitState, overview, navigation, degradation, degradedNotice }) {
  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <h1>SQO Cockpit</h1>
        <SQODegradedState degradation={{ state: error, reason: `Route validation failed: ${error}` }} />
      </div>
    );
  }

  const isCritical = cockpitState &&
    [COCKPIT_STATES.NO_CLIENT_SELECTED, COCKPIT_STATES.CLIENT_REGISTERED_NO_SQO].includes(cockpitState.state);

  return (
    <div className="sqo-cockpit">
      <SQONavigation
        client={client}
        runId={runId}
        activeSection="overview"
        sections={navigation}
        degradation={degradation}
      />

      <main className="sqo-cockpit__content">
        {degradedNotice && (
          <div className={`sqo-cockpit__notice sqo-cockpit__notice--${degradedNotice.severity.toLowerCase()}`}>
            {degradedNotice.message}
          </div>
        )}

        {isCritical ? (
          <SQODegradedState degradation={degradation} />
        ) : (
          <QualificationOverviewPanel overview={overview} cockpitState={cockpitState} />
        )}
      </main>

      <footer className="sqo-cockpit__governance">
        Read-only artifact consumption · No AI interpretation · Deterministic display
      </footer>
    </div>
  );
}

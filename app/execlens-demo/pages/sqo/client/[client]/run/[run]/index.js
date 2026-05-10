import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import SQODegradedState from '../../../../../../components/sqo-cockpit/SQODegradedState';
import QualificationOverviewPanel from '../../../../../../components/sqo-cockpit/QualificationOverviewPanel';
import QualificationJourneyBanner from '../../../../../../components/sqo-cockpit/QualificationJourneyBanner';
import ImmediateBlockerPanel from '../../../../../../components/sqo-cockpit/ImmediateBlockerPanel';
import RemediationWorkflowPanel from '../../../../../../components/sqo-cockpit/RemediationWorkflowPanel';
import SemanticProgressionTimeline from '../../../../../../components/sqo-cockpit/SemanticProgressionTimeline';
import SourceMaterialGuidancePanel from '../../../../../../components/sqo-cockpit/SourceMaterialGuidancePanel';
import RerunPreparationChecklist from '../../../../../../components/sqo-cockpit/RerunPreparationChecklist';
import ValidationGatePanel from '../../../../../../components/sqo-cockpit/ValidationGatePanel';
import DeferredDebtPanel from '../../../../../../components/sqo-cockpit/DeferredDebtPanel';
import SemanticMaturationStrip from '../../../../../../components/sqo-cockpit/SemanticMaturationStrip';

export async function getServerSideProps(context) {
  const { resolveCockpitState } = require('../../../../../../lib/sqo-cockpit/SQOCockpitStateResolver');
  const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
  const { formatOverview } = require('../../../../../../lib/sqo-cockpit/SQOCockpitFormatter');
  const { buildDegradedNotice } = require('../../../../../../lib/sqo-cockpit/SQOCockpitDegradationHandler');
  const { resolveQualificationJourney } = require('../../../../../../lib/sqo-cockpit/QualificationJourneyResolver');

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
        degradation: null,
        isCritical: false,
        journey: null,
      },
    };
  }

  const state = resolveCockpitState(client, run);
  const navigation = buildNavigationItems(client, run, 'overview');
  const overview = state.artifacts ? formatOverview(state.artifacts) : null;
  const degradedNotice = state.degradation ? buildDegradedNotice(state.degradation) : null;

  const isCritical = state.cockpit_state === 'NO_CLIENT_SELECTED' ||
    state.cockpit_state === 'CLIENT_REGISTERED_NO_SQO';

  let journey = null;
  if (state.artifacts && state.artifacts.ok) {
    try {
      journey = resolveQualificationJourney(state.artifacts);
    } catch (_e) {
      journey = { available: false, reason: 'JOURNEY_RESOLUTION_ERROR' };
    }
  }

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
      isCritical,
      journey,
    },
  };
}

export default function SQOOverviewPage({ client, runId, error, cockpitState, overview, navigation, degradation, degradedNotice, isCritical, journey }) {
  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <h1>SQO Cockpit</h1>
        <SQODegradedState degradation={{ state: error, reason: `Route validation failed: ${error}` }} />
      </div>
    );
  }

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
          <>
            {journey && journey.available && (
              <SemanticMaturationStrip journey={journey} />
            )}

            <QualificationJourneyBanner banner={journey && journey.available ? journey.banner : null} />

            <QualificationOverviewPanel overview={overview} cockpitState={cockpitState} />

            {journey && journey.available && (
              <>
                <ImmediateBlockerPanel
                  blockers={journey.immediateBlockers}
                  debtCounts={journey.debtCounts}
                />

                <RemediationWorkflowPanel
                  stages={journey.remediationStages}
                  currentStage={journey.currentStage}
                />

                <SemanticProgressionTimeline
                  progression={journey.progression}
                  maturity={journey.maturity}
                  continuity={journey.continuity}
                  narratives={journey.narratives}
                />

                <SourceMaterialGuidancePanel guidance={journey.sourceGuidance} />

                <RerunPreparationChecklist checklist={journey.rerunChecklist} />

                <ValidationGatePanel gates={journey.validationGates} />

                <DeferredDebtPanel
                  deferred={journey.deferredDebt}
                  active={journey.activeDebt}
                />
              </>
            )}
          </>
        )}
      </main>

      <footer className="sqo-cockpit__governance">
        Read-only artifact consumption · No AI interpretation · Deterministic display
      </footer>
    </div>
  );
}

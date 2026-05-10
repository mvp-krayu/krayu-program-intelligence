import SQONavigation from '../../../../../../components/sqo-cockpit/SQONavigation';
import SQODegradedState from '../../../../../../components/sqo-cockpit/SQODegradedState';
import SQOCognitiveLayoutShell from '../../../../../../components/sqo-cockpit/SQOCognitiveLayoutShell';
import QualificationHeroRegion from '../../../../../../components/sqo-cockpit/QualificationHeroRegion';
import QualificationStateRibbon from '../../../../../../components/sqo-cockpit/QualificationStateRibbon';
import BlockerDominanceLayer from '../../../../../../components/sqo-cockpit/BlockerDominanceLayer';
import OperationalWorkflowSpine from '../../../../../../components/sqo-cockpit/OperationalWorkflowSpine';
import WorkflowStageCluster from '../../../../../../components/sqo-cockpit/WorkflowStageCluster';
import ProgressionRail from '../../../../../../components/sqo-cockpit/ProgressionRail';
import DeferredDebtCollapseZone from '../../../../../../components/sqo-cockpit/DeferredDebtCollapseZone';
import OperationalAttentionLayout from '../../../../../../components/sqo-cockpit/OperationalAttentionLayout';

export async function getServerSideProps(context) {
  const { resolveCockpitState } = require('../../../../../../lib/sqo-cockpit/SQOCockpitStateResolver');
  const { validateRouteParams, buildNavigationItems } = require('../../../../../../lib/sqo-cockpit/SQOCockpitRouteResolver');
  const { buildDegradedNotice } = require('../../../../../../lib/sqo-cockpit/SQOCockpitDegradationHandler');
  const { resolveQualificationJourney } = require('../../../../../../lib/sqo-cockpit/QualificationJourneyResolver');
  const { resolveVisualState } = require('../../../../../../lib/sqo-cockpit/QualificationVisualStateResolver');
  const { resolveAttentionHierarchy } = require('../../../../../../lib/sqo-cockpit/OperationalAttentionResolver');
  const { resolveWorkflowDominance } = require('../../../../../../lib/sqo-cockpit/WorkflowDominanceResolver');
  const { resolveDeferredVisibility } = require('../../../../../../lib/sqo-cockpit/DeferredVisibilityResolver');

  const { client, run } = context.params;
  const validation = validateRouteParams(client, run);

  if (!validation.valid) {
    return {
      props: {
        client,
        runId: run,
        error: validation.error,
        cockpitState: null,
        navigation: null,
        degradedNotice: null,
        degradation: null,
        isCritical: false,
        journey: null,
        visualState: null,
        attentionHierarchy: null,
        workflowDominance: null,
        deferredVisibility: null,
      },
    };
  }

  const state = resolveCockpitState(client, run);
  const navigation = buildNavigationItems(client, run, 'overview');
  const degradedNotice = state.degradation ? buildDegradedNotice(state.degradation) : null;

  const isCritical = state.cockpit_state === 'NO_CLIENT_SELECTED' ||
    state.cockpit_state === 'CLIENT_REGISTERED_NO_SQO';

  let journey = null;
  let visualState = null;
  let attentionHierarchy = null;
  let workflowDominance = null;
  let deferredVisibility = null;

  if (state.artifacts && state.artifacts.ok) {
    try {
      journey = resolveQualificationJourney(state.artifacts);

      if (journey && journey.available) {
        visualState = resolveVisualState(
          journey.banner.s_state,
          journey.banner.blocker_class
        );
        attentionHierarchy = resolveAttentionHierarchy(journey);
        workflowDominance = resolveWorkflowDominance(
          journey.remediationStages,
          journey.currentStage
        );
        deferredVisibility = resolveDeferredVisibility(journey);
      }
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
      navigation,
      degradation: state.degradation,
      degradedNotice,
      isCritical,
      journey,
      visualState,
      attentionHierarchy,
      workflowDominance,
      deferredVisibility,
    },
  };
}

export default function SQOOverviewPage({
  client, runId, error, cockpitState, navigation,
  degradation, degradedNotice, isCritical,
  journey, visualState, attentionHierarchy, workflowDominance, deferredVisibility,
}) {
  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <h1>SQO Cockpit</h1>
        <SQODegradedState degradation={{ state: error, reason: `Route validation failed: ${error}` }} />
      </div>
    );
  }

  const hasJourney = journey && journey.available;

  return (
    <div className={`sqo-cockpit ${visualState ? visualState.chromatic_class : ''}`}>
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
        ) : hasJourney ? (
          <OperationalAttentionLayout attentionHierarchy={attentionHierarchy}>
            <SQOCognitiveLayoutShell
              visualState={visualState}
              ribbon={
                <QualificationStateRibbon
                  banner={journey.banner}
                  visualState={visualState}
                  debtCounts={journey.debtCounts}
                  maturity={journey.maturity}
                  continuity={journey.continuity}
                />
              }
              heroRegion={
                <QualificationHeroRegion
                  banner={journey.banner}
                  visualState={visualState}
                  narratives={journey.narratives}
                />
              }
              blockerLayer={
                journey.immediateBlockers && journey.immediateBlockers.length > 0 ? (
                  <BlockerDominanceLayer
                    blockers={journey.immediateBlockers}
                    debtCounts={journey.debtCounts}
                    visualState={visualState}
                  />
                ) : null
              }
              spine={
                workflowDominance && workflowDominance.spineNodes.length > 0 ? (
                  <OperationalWorkflowSpine
                    spineNodes={workflowDominance.spineNodes}
                    sState={journey.banner.s_state}
                    nextState={journey.banner.next_reachable}
                  />
                ) : null
              }
              workflowCluster={
                workflowDominance && workflowDominance.stages.length > 0 ? (
                  <WorkflowStageCluster
                    stages={workflowDominance.stages}
                    currentStage={journey.currentStage}
                    sourceGuidance={journey.sourceGuidance}
                    rerunChecklist={journey.rerunChecklist}
                  />
                ) : null
              }
              progressionRail={
                <ProgressionRail
                  progression={journey.progression}
                  validationGates={journey.validationGates}
                  visualState={visualState}
                />
              }
              deferredZone={
                <DeferredDebtCollapseZone
                  deferred={journey.deferredDebt}
                  active={journey.activeDebt}
                  visibility={deferredVisibility}
                />
              }
              forensicLink={
                <div className="sqo-forensic-link">
                  <span className="sqo-forensic-link__label">Detailed exploration</span>
                  <nav className="sqo-forensic-link__nav">
                    {navigation && navigation.filter(n => n.id !== 'overview').map(nav => (
                      <a
                        key={nav.id}
                        href={nav.path}
                        className={`sqo-forensic-link__item ${nav.degraded ? 'sqo-forensic-link__item--degraded' : ''}`}
                      >
                        {nav.label}
                      </a>
                    ))}
                  </nav>
                </div>
              }
              governance={
                <span>Read-only artifact consumption · No AI interpretation · Deterministic display</span>
              }
            />
          </OperationalAttentionLayout>
        ) : (
          <div className="sqo-cockpit__no-journey">
            <p>Qualification journey could not be resolved. Use section navigation for detailed artifact exploration.</p>
          </div>
        )}
      </main>
    </div>
  );
}

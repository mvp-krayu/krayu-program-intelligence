'use strict';

const { resolveCockpitState } = require('./SQOCockpitStateResolver');
const { validateRouteParams, buildNavigationItems, resolveClientList, COCKPIT_SECTIONS } = require('./SQOCockpitRouteResolver');
const { buildDegradedNotice } = require('./SQOCockpitDegradationHandler');
const { resolveQualificationJourney } = require('./QualificationJourneyResolver');
const { resolveVisualState } = require('./QualificationVisualStateResolver');
const { resolveAttentionHierarchy } = require('./OperationalAttentionResolver');
const { resolveWorkflowDominance } = require('./WorkflowDominanceResolver');
const { resolveDeferredVisibility } = require('./DeferredVisibilityResolver');
const {
  formatDebtSection,
  formatContinuitySection,
  formatMaturitySection,
  formatProgressionSection,
  formatEvidenceReplaySection,
  formatHandoffSection,
  formatReconciliationSection,
  formatReconciliationLoopSection,
} = require('./SQOCockpitFormatter');
const { resolveRuntimeSubstrates } = require('./server/SQORuntimeResolver.server');
const { resolveQualificationPosture } = require('./QualificationPostureResolver');
const { loadPromotionState } = require('./server/PromotionStateLoader.server');

function resolveWorkspaceData(client, runId, initialSection) {
  const validation = validateRouteParams(client, runId);

  if (!validation.valid) {
    return {
      client,
      runId,
      error: validation.error,
      cockpitState: null,
      navigation: null,
      clientRuns: resolveClientList(),
      degradedNotice: null,
      degradation: null,
      isCritical: false,
      runtimeCapabilities: null,
      journey: null,
      visualState: null,
      attentionHierarchy: null,
      workflowDominance: null,
      deferredVisibility: null,
      sectionData: null,
      initialSection: initialSection || 'overview',
    };
  }

  const runtime = resolveRuntimeSubstrates(client, runId);

  const state = resolveCockpitState(client, runId);
  const navigation = buildNavigationItems(client, runId, initialSection || 'overview');
  const degradedNotice = state.degradation ? buildDegradedNotice(state.degradation) : null;

  const isCritical = !runtime.anyCapabilityAvailable;

  let qualificationPosture = null;
  try {
    const promotionBundle = loadPromotionState(client, runId);
    if (promotionBundle && promotionBundle.loaded) {
      qualificationPosture = resolveQualificationPosture(
        promotionBundle.promotionState,
        promotionBundle.qualificationBlockers,
        runtime.capabilities
      );
    } else {
      qualificationPosture = resolveQualificationPosture(null, null, runtime.capabilities);
    }
  } catch (_e) {
    qualificationPosture = null;
  }

  let journey = null;
  let visualState = null;
  let attentionHierarchy = null;
  let workflowDominance = null;
  let deferredVisibility = null;
  let sectionData = {};

  if (state.artifacts && state.artifacts.ok) {
    try {
      journey = resolveQualificationJourney(state.artifacts);

      if (journey && journey.available) {
        visualState = resolveVisualState(
          journey.banner.s_state,
          journey.banner.blocker_class
        );
        attentionHierarchy = resolveAttentionHierarchy(journey, visualState);
        workflowDominance = resolveWorkflowDominance(
          journey.remediationStages,
          journey.currentStage
        );
        deferredVisibility = resolveDeferredVisibility(journey);
      }
    } catch (_e) {
      journey = { available: false, reason: 'JOURNEY_RESOLUTION_ERROR' };
    }

    sectionData.debt = formatDebtSection(state.artifacts);
    sectionData.continuity = formatContinuitySection(state.artifacts);
    sectionData.maturity = formatMaturitySection(state.artifacts);
    sectionData.progression = formatProgressionSection(state.artifacts);
    sectionData.evidence = formatEvidenceReplaySection(state.artifacts);
    sectionData.handoff = formatHandoffSection(state.artifacts, state.handoff_status);
    sectionData.reconciliation = formatReconciliationSection(state.artifacts);
    sectionData['reconciliation-loop'] = formatReconciliationLoopSection(state.artifacts);
  }

  if (!sectionData.debt && runtime.capabilities.proposition_debt) {
    try {
      const { resolvePropositionDebt } = require('./server/PropositionDebtResolver.server');
      sectionData.debt = resolvePropositionDebt(client, runId);
    } catch (_e) {
      // fail-closed: no debt section rather than broken page
    }
  }

  return normalizeSSRProps({
    client,
    runId,
    error: null,
    cockpitState: {
      state: state.cockpit_state,
      label: state.label,
      visual_posture: state.visual_posture,
    },
    navigation,
    clientRuns: resolveClientList(),
    degradation: state.degradation,
    degradedNotice,
    isCritical,
    qualificationPosture,
    runtimeCapabilities: runtime.capabilities,
    sectionAvailability: runtime.sectionAvailability,
    runtimeClasses: runtime.runtimeClasses,
    journey,
    visualState,
    attentionHierarchy,
    workflowDominance,
    deferredVisibility,
    sectionData,
    initialSection: initialSection || 'overview',
  });
}

function normalizeSSRProps(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => normalizeSSRProps(item));
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value === undefined ? null : normalizeSSRProps(value);
  }
  return result;
}

module.exports = { resolveWorkspaceData };

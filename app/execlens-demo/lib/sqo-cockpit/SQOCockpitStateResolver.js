'use strict';

const { loadAllCockpitArtifacts, getArtifactData, areCriticalArtifactsPresent } = require('./SQOCockpitArtifactLoader');
const { assessDegradation, checkReplayStatus, DEGRADATION_STATES } = require('./SQOCockpitDegradationHandler');

const COCKPIT_STATES = {
  NO_CLIENT_SELECTED: 'NO_CLIENT_SELECTED',
  CLIENT_REGISTERED_NO_SQO: 'CLIENT_REGISTERED_NO_SQO',
  S0_STRUCTURAL_ONLY: 'S0_STRUCTURAL_ONLY',
  S1_ONBOARDING_REQUIRED: 'S1_ONBOARDING_REQUIRED',
  S2_QUALIFIED_WITH_DEBT: 'S2_QUALIFIED_WITH_DEBT',
  S3_FULLY_GOVERNABLE: 'S3_FULLY_GOVERNABLE',
  ARTIFACT_STALE: 'ARTIFACT_STALE',
  REPLAY_FAILED: 'REPLAY_FAILED',
  HANDOFF_READY: 'HANDOFF_READY',
  HANDOFF_BLOCKED: 'HANDOFF_BLOCKED',
};

const STATE_LABELS = {
  NO_CLIENT_SELECTED: 'No Client Selected',
  CLIENT_REGISTERED_NO_SQO: 'Client Registered — No SQO Data',
  S0_STRUCTURAL_ONLY: 'S0 — Structural Only',
  S1_ONBOARDING_REQUIRED: 'S1 — Onboarding Required',
  S2_QUALIFIED_WITH_DEBT: 'S2 — Qualified with Debt',
  S3_FULLY_GOVERNABLE: 'S3 — Fully Governable',
  ARTIFACT_STALE: 'Artifact Stale',
  REPLAY_FAILED: 'Replay Failed',
  HANDOFF_READY: 'Handoff Ready',
  HANDOFF_BLOCKED: 'Handoff Blocked',
};

const STATE_VISUAL_POSTURE = {
  NO_CLIENT_SELECTED: 'neutral',
  CLIENT_REGISTERED_NO_SQO: 'warning',
  S0_STRUCTURAL_ONLY: 'minimal',
  S1_ONBOARDING_REQUIRED: 'active',
  S2_QUALIFIED_WITH_DEBT: 'active',
  S3_FULLY_GOVERNABLE: 'healthy',
  ARTIFACT_STALE: 'warning',
  REPLAY_FAILED: 'error',
  HANDOFF_READY: 'ready',
  HANDOFF_BLOCKED: 'blocked',
};

function resolveCockpitState(client, runId) {
  if (!client || !runId) {
    return {
      cockpit_state: COCKPIT_STATES.NO_CLIENT_SELECTED,
      label: STATE_LABELS.NO_CLIENT_SELECTED,
      visual_posture: STATE_VISUAL_POSTURE.NO_CLIENT_SELECTED,
      artifacts: null,
      degradation: null,
      replay_status: null,
      handoff_status: null,
    };
  }

  const loadResult = loadAllCockpitArtifacts(client, runId);
  const degradation = assessDegradation(loadResult);

  if (degradation.state === DEGRADATION_STATES.CLIENT_NOT_REGISTERED) {
    return buildStateResult(COCKPIT_STATES.NO_CLIENT_SELECTED, loadResult, degradation, null, null);
  }

  if (degradation.state === DEGRADATION_STATES.NO_SQO_DATA) {
    return buildStateResult(COCKPIT_STATES.CLIENT_REGISTERED_NO_SQO, loadResult, degradation, null, null);
  }

  if (degradation.state === DEGRADATION_STATES.CRITICAL_DEGRADATION ||
      degradation.state === DEGRADATION_STATES.LOAD_FAILURE) {
    return buildStateResult(COCKPIT_STATES.CLIENT_REGISTERED_NO_SQO, loadResult, degradation, null, null);
  }

  const replayStatus = checkReplayStatus(loadResult);
  if (replayStatus.any_failed) {
    return buildStateResult(COCKPIT_STATES.REPLAY_FAILED, loadResult, degradation, replayStatus, { ready: false, reason: 'REPLAY_VERIFICATION_FAILED' });
  }

  const qualState = getArtifactData(loadResult, 'qualification_state');
  if (!qualState || !qualState.qualification_state) {
    return buildStateResult(COCKPIT_STATES.CLIENT_REGISTERED_NO_SQO, loadResult, degradation, replayStatus, null);
  }

  const sState = qualState.qualification_state.s_state;
  const handoffStatus = assessHandoffReadiness(loadResult, sState, replayStatus);

  if (sState === 'S0') {
    return buildStateResult(COCKPIT_STATES.S0_STRUCTURAL_ONLY, loadResult, degradation, replayStatus, handoffStatus);
  }

  if (sState === 'S1') {
    return buildStateResult(COCKPIT_STATES.S1_ONBOARDING_REQUIRED, loadResult, degradation, replayStatus, handoffStatus);
  }

  if (sState === 'S2') {
    if (handoffStatus.ready) {
      return buildStateResult(COCKPIT_STATES.HANDOFF_READY, loadResult, degradation, replayStatus, handoffStatus);
    }
    return buildStateResult(COCKPIT_STATES.S2_QUALIFIED_WITH_DEBT, loadResult, degradation, replayStatus, handoffStatus);
  }

  if (sState === 'S3') {
    if (handoffStatus.ready) {
      return buildStateResult(COCKPIT_STATES.HANDOFF_READY, loadResult, degradation, replayStatus, handoffStatus);
    }
    return buildStateResult(COCKPIT_STATES.S3_FULLY_GOVERNABLE, loadResult, degradation, replayStatus, handoffStatus);
  }

  return buildStateResult(COCKPIT_STATES.S0_STRUCTURAL_ONLY, loadResult, degradation, replayStatus, handoffStatus);
}

function assessHandoffReadiness(loadResult, sState, replayStatus) {
  const blockingConditions = [];

  if (sState === 'S0' || sState === 'S1') {
    blockingConditions.push({ condition: 'S_STATE_INSUFFICIENT', detail: `Current S-state ${sState} does not meet minimum S2 for handoff` });
  }

  if (replayStatus && replayStatus.any_failed) {
    blockingConditions.push({ condition: 'REPLAY_VERIFICATION_FAILED', detail: 'One or more replay verifications failed' });
  }

  const certKeys = ['maturity_certification', 'qualification_state_certification'];
  for (const key of certKeys) {
    const data = getArtifactData(loadResult, key);
    if (data && data.certification_status !== 'CERTIFIED') {
      blockingConditions.push({ condition: 'CERTIFICATION_NOT_PASSED', detail: `${key} status: ${data.certification_status}` });
    }
    if (!data) {
      blockingConditions.push({ condition: 'CERTIFICATION_MISSING', detail: `${key} not available` });
    }
  }

  const progression = getArtifactData(loadResult, 'progression_readiness');
  if (progression && progression.blocking_debt_count > 0) {
    blockingConditions.push({ condition: 'BLOCKING_DEBT_PRESENT', detail: `${progression.blocking_debt_count} blocking debt items remain` });
  }

  return {
    ready: blockingConditions.length === 0,
    blocking_conditions: blockingConditions,
    reason: blockingConditions.length > 0 ? blockingConditions[0].condition : 'ALL_CONDITIONS_MET',
  };
}

function buildStateResult(cockpitState, loadResult, degradation, replayStatus, handoffStatus) {
  return {
    cockpit_state: cockpitState,
    label: STATE_LABELS[cockpitState],
    visual_posture: STATE_VISUAL_POSTURE[cockpitState],
    client: loadResult ? loadResult.client : null,
    run_id: loadResult ? loadResult.run_id : null,
    artifacts: loadResult,
    degradation,
    replay_status: replayStatus,
    handoff_status: handoffStatus,
  };
}

module.exports = {
  COCKPIT_STATES,
  STATE_LABELS,
  STATE_VISUAL_POSTURE,
  resolveCockpitState,
  assessHandoffReadiness,
};

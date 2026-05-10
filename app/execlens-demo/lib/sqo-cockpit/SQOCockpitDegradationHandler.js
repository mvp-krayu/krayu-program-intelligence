'use strict';

const { CRITICAL_ARTIFACTS, isArtifactAvailable } = require('./SQOCockpitArtifactLoader');

const DEGRADATION_STATES = {
  FULLY_OPERATIONAL: 'FULLY_OPERATIONAL',
  PARTIAL_DEGRADATION: 'PARTIAL_DEGRADATION',
  CRITICAL_DEGRADATION: 'CRITICAL_DEGRADATION',
  NO_SQO_DATA: 'NO_SQO_DATA',
  CLIENT_NOT_REGISTERED: 'CLIENT_NOT_REGISTERED',
  LOAD_FAILURE: 'LOAD_FAILURE',
  REPLAY_FAILED: 'REPLAY_FAILED',
};

function assessDegradation(loadResult) {
  if (!loadResult) {
    return {
      state: DEGRADATION_STATES.LOAD_FAILURE,
      reason: 'Artifact load returned null',
      available_sections: [],
      degraded_sections: [],
      unavailable_sections: ['overview', 'debt', 'continuity', 'maturity', 'progression', 'evidence', 'handoff'],
    };
  }

  if (loadResult.error === 'CLIENT_RUN_NOT_REGISTERED') {
    return {
      state: DEGRADATION_STATES.CLIENT_NOT_REGISTERED,
      reason: 'Client/run pair is not registered in the manifest',
      available_sections: [],
      degraded_sections: [],
      unavailable_sections: ['overview', 'debt', 'continuity', 'maturity', 'progression', 'evidence', 'handoff'],
    };
  }

  if (!loadResult.ok || loadResult.loaded_count === 0) {
    return {
      state: DEGRADATION_STATES.NO_SQO_DATA,
      reason: 'No SQO artifacts could be loaded',
      available_sections: [],
      degraded_sections: [],
      unavailable_sections: ['overview', 'debt', 'continuity', 'maturity', 'progression', 'evidence', 'handoff'],
    };
  }

  const criticalMissing = CRITICAL_ARTIFACTS.filter(k => !isArtifactAvailable(loadResult, k));

  if (criticalMissing.length > 0) {
    return {
      state: DEGRADATION_STATES.CRITICAL_DEGRADATION,
      reason: `Critical artifacts missing: ${criticalMissing.join(', ')}`,
      missing_critical: criticalMissing,
      available_sections: [],
      degraded_sections: ['overview'],
      unavailable_sections: ['maturity', 'evidence', 'handoff'],
    };
  }

  const sectionStatus = assessSectionAvailability(loadResult);
  const degradedSections = sectionStatus.filter(s => s.status === 'degraded').map(s => s.section);
  const availableSections = sectionStatus.filter(s => s.status === 'available').map(s => s.section);
  const unavailableSections = sectionStatus.filter(s => s.status === 'unavailable').map(s => s.section);

  if (degradedSections.length === 0 && unavailableSections.length === 0) {
    return {
      state: DEGRADATION_STATES.FULLY_OPERATIONAL,
      reason: 'All artifacts loaded successfully',
      available_sections: availableSections,
      degraded_sections: [],
      unavailable_sections: [],
    };
  }

  return {
    state: DEGRADATION_STATES.PARTIAL_DEGRADATION,
    reason: `${degradedSections.length} section(s) degraded, ${unavailableSections.length} unavailable`,
    available_sections: availableSections,
    degraded_sections: degradedSections,
    unavailable_sections: unavailableSections,
  };
}

function assessSectionAvailability(loadResult) {
  const { SECTION_ARTIFACT_MAP } = require('./SQOCockpitArtifactLoader');
  const sections = [];

  for (const [section, keys] of Object.entries(SECTION_ARTIFACT_MAP)) {
    const available = keys.filter(k => isArtifactAvailable(loadResult, k));
    if (available.length === keys.length) {
      sections.push({ section, status: 'available', loaded: available.length, total: keys.length });
    } else if (available.length > 0) {
      sections.push({ section, status: 'degraded', loaded: available.length, total: keys.length, missing: keys.filter(k => !isArtifactAvailable(loadResult, k)) });
    } else {
      sections.push({ section, status: 'unavailable', loaded: 0, total: keys.length, missing: keys });
    }
  }

  return sections;
}

function checkReplayStatus(loadResult) {
  const replayKeys = [
    'maturity_replay_verification',
    'qualification_state_replay_verification',
    'debt_replay_verification',
  ];

  const results = [];
  for (const key of replayKeys) {
    if (!isArtifactAvailable(loadResult, key)) {
      results.push({ artifact: key, status: 'MISSING', verdict: null });
      continue;
    }
    const data = loadResult.artifacts[key].data;
    const verdict = data.overall_verdict || 'UNKNOWN';
    results.push({ artifact: key, status: 'LOADED', verdict });
  }

  const anyFailed = results.some(r => r.verdict === 'FAIL');
  return {
    all_passed: results.every(r => r.verdict === 'PASS'),
    any_failed: anyFailed,
    results,
  };
}

function buildDegradedNotice(degradation) {
  if (degradation.state === DEGRADATION_STATES.FULLY_OPERATIONAL) return null;

  return {
    severity: degradation.state === DEGRADATION_STATES.CRITICAL_DEGRADATION ||
              degradation.state === DEGRADATION_STATES.NO_SQO_DATA ||
              degradation.state === DEGRADATION_STATES.CLIENT_NOT_REGISTERED ||
              degradation.state === DEGRADATION_STATES.LOAD_FAILURE
      ? 'CRITICAL' : 'WARNING',
    state: degradation.state,
    message: degradation.reason,
    governance: 'SQO Cockpit displays explicit absence for missing data. No silent fallback.',
  };
}

module.exports = {
  DEGRADATION_STATES,
  assessDegradation,
  assessSectionAvailability,
  checkReplayStatus,
  buildDegradedNotice,
};

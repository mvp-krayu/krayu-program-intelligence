'use strict';

const DEBT_URGENCY = {
  IMMEDIATE: 'IMMEDIATE',
  ACTIVE: 'ACTIVE',
  DEFERRED: 'DEFERRED',
};

const URGENCY_LABELS = {
  IMMEDIATE: 'Blocking current S-state progression',
  ACTIVE: 'Impacting current qualification posture',
  DEFERRED: 'Expansion debt for future S-state',
};

function classifyDebtUrgency(debtItems, currentSState) {
  const nextSState = getNextSState(currentSState);

  const immediate = [];
  const active = [];
  const deferred = [];

  for (const item of debtItems) {
    if (item.blocks_s_state === nextSState) {
      immediate.push({ ...item, urgency: DEBT_URGENCY.IMMEDIATE, urgency_reason: `Blocks ${nextSState} qualification` });
    } else if (item.blocks_s_state && item.blocks_s_state !== nextSState) {
      deferred.push({ ...item, urgency: DEBT_URGENCY.DEFERRED, urgency_reason: `${item.blocks_s_state} expansion debt` });
    } else if (item.severity === 'CRITICAL' || item.severity === 'HIGH') {
      active.push({ ...item, urgency: DEBT_URGENCY.ACTIVE, urgency_reason: 'Impacts qualification posture' });
    } else {
      deferred.push({ ...item, urgency: DEBT_URGENCY.DEFERRED, urgency_reason: 'Non-blocking improvement' });
    }
  }

  return {
    immediate,
    active,
    deferred,
    counts: {
      immediate: immediate.length,
      active: active.length,
      deferred: deferred.length,
      total: debtItems.length,
    },
  };
}

function getNextSState(current) {
  const progression = { S0: 'S1', S1: 'S2', S2: 'S3' };
  return progression[current] || null;
}

function getDeferredSummary(classified) {
  const byTarget = {};
  for (const item of classified.deferred) {
    const target = item.blocks_s_state || 'IMPROVEMENT';
    if (!byTarget[target]) byTarget[target] = [];
    byTarget[target].push(item);
  }
  return byTarget;
}

module.exports = {
  DEBT_URGENCY,
  URGENCY_LABELS,
  classifyDebtUrgency,
  getNextSState,
  getDeferredSummary,
};

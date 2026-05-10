'use strict';

const S_STATE_VISUAL = {
  S0: { palette: 'neutral', intensity: 'dimmed', label: 'Structural Only', posture: 'inactive' },
  S1: { palette: 'amber', intensity: 'unstable', label: 'Semantic Onboarding Required', posture: 'blocked' },
  S2: { palette: 'blue', intensity: 'stabilized', label: 'Qualified with Debt', posture: 'active' },
  S3: { palette: 'green', intensity: 'governed', label: 'Fully Governable', posture: 'clear' },
};

const BLOCKER_VISUAL = {
  MISSING_QUALIFICATION_ARTIFACTS: { severity: 'critical', frame: 'escalation', label: 'Missing Qualification Artifacts' },
  GROUNDING_GAPS: { severity: 'high', frame: 'escalation', label: 'Grounding Gaps' },
  MIXED_BLOCKERS: { severity: 'high', frame: 'escalation', label: 'Mixed Blockers' },
  NONE: { severity: 'clear', frame: 'none', label: 'No Blockers' },
};

const DEBT_VISUAL = {
  IMMEDIATE: { weight: 'dominant', layer: 'primary', opacity: 1.0 },
  ACTIVE: { weight: 'standard', layer: 'secondary', opacity: 0.85 },
  DEFERRED: { weight: 'muted', layer: 'tertiary', opacity: 0.55 },
};

function resolveVisualState(sState, blockerClass) {
  const stateVisual = S_STATE_VISUAL[sState] || S_STATE_VISUAL.S0;
  const blockerVisual = BLOCKER_VISUAL[blockerClass] || BLOCKER_VISUAL.NONE;

  return {
    palette: stateVisual.palette,
    intensity: stateVisual.intensity,
    posture: blockerVisual.severity === 'critical' ? 'critical' : stateVisual.posture,
    state_label: stateVisual.label,
    blocker_frame: blockerVisual.frame,
    blocker_label: blockerVisual.label,
    is_blocked: blockerVisual.severity !== 'clear',
    chromatic_class: `sqo-state--${stateVisual.palette}`,
    blocker_class: `sqo-blocker--${blockerVisual.severity}`,
  };
}

function resolveDebtVisual(urgency) {
  return DEBT_VISUAL[urgency] || DEBT_VISUAL.DEFERRED;
}

module.exports = {
  S_STATE_VISUAL,
  BLOCKER_VISUAL,
  DEBT_VISUAL,
  resolveVisualState,
  resolveDebtVisual,
};

'use strict';

const S_STATE_VISUAL = {
  S0: { palette: 'neutral', intensity: 'dimmed', label: 'Structural Only', posture: 'inactive' },
  S1: { palette: 'amber', intensity: 'unstable', label: 'Semantic Onboarding Required', posture: 'onboarding' },
  S2: { palette: 'blue', intensity: 'stabilized', label: 'Projection-Authorized with Qualification Debt', posture: 'active' },
  S3: { palette: 'green', intensity: 'governed', label: 'Fully Governable', posture: 'clear' },
};

const BLOCKER_VISUAL = {
  MISSING_QUALIFICATION_ARTIFACTS: {
    severity_class: 'projection',
    severity: 'critical',
    frame: 'escalation',
    label: 'Missing Qualification Artifacts',
    operational_label: 'Qualification Incomplete',
  },
  GROUNDING_GAPS: {
    severity_class: 'expansion',
    severity: 'constrained',
    frame: 'progression',
    label: 'Grounding Expansion Gaps',
    operational_label: 'Expansion Constrained',
  },
  MIXED_BLOCKERS: {
    severity_class: 'qualification',
    severity: 'operational',
    frame: 'remediation',
    label: 'Qualification Gaps',
    operational_label: 'Remediation Required',
  },
  NONE: {
    severity_class: 'clear',
    severity: 'clear',
    frame: 'none',
    label: 'No Blockers',
    operational_label: 'Operationally Clear',
  },
};

const DEBT_VISUAL = {
  IMMEDIATE: { weight: 'dominant', layer: 'primary', opacity: 1.0 },
  ACTIVE: { weight: 'standard', layer: 'secondary', opacity: 0.85 },
  DEFERRED: { weight: 'muted', layer: 'tertiary', opacity: 0.55 },
};

function resolveVisualState(sState, blockerClass) {
  const stateVisual = S_STATE_VISUAL[sState] || S_STATE_VISUAL.S0;
  const blockerVisual = BLOCKER_VISUAL[blockerClass] || BLOCKER_VISUAL.NONE;

  const isProjectionBlocked = blockerVisual.severity_class === 'projection';
  const isExpansionConstrained = blockerVisual.severity_class === 'expansion';
  const hasConstraints = blockerVisual.severity !== 'clear';

  let posture = stateVisual.posture;
  if (isProjectionBlocked) {
    posture = 'critical';
  } else if (isExpansionConstrained) {
    posture = 'constrained';
  }

  return {
    palette: stateVisual.palette,
    intensity: stateVisual.intensity,
    posture,
    state_label: stateVisual.label,
    blocker_frame: blockerVisual.frame,
    blocker_label: blockerVisual.label,
    operational_label: blockerVisual.operational_label,
    severity_class: blockerVisual.severity_class,
    is_projection_blocked: isProjectionBlocked,
    is_expansion_constrained: isExpansionConstrained,
    is_blocked: isProjectionBlocked,
    has_constraints: hasConstraints,
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

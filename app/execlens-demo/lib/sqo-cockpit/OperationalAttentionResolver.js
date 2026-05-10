'use strict';

const ATTENTION_ZONES = {
  CURRENT_STATE: { order: 1, id: 'current_state', label: 'Current State', prominence: 'hero' },
  BLOCKERS: { order: 2, id: 'blockers', label: 'Qualification Constraints', prominence: 'dominant' },
  OPERATOR_ACTION: { order: 3, id: 'operator_action', label: 'Operator Action', prominence: 'primary' },
  PROGRESSION: { order: 4, id: 'progression', label: 'Progression', prominence: 'standard' },
  DEFERRED_DEBT: { order: 5, id: 'deferred_debt', label: 'Deferred Debt', prominence: 'subordinate' },
  FORENSIC_DETAIL: { order: 6, id: 'forensic_detail', label: 'Forensic Detail', prominence: 'collapsed' },
};

function resolveAttentionHierarchy(journey, visualState) {
  if (!journey || !journey.available) {
    return {
      zones: [],
      primary_focus: null,
      cognitive_load: 'minimal',
    };
  }

  const zones = [];
  const isProjectionBlocked = visualState ? visualState.is_projection_blocked : false;
  const isExpansionConstrained = visualState ? visualState.is_expansion_constrained : false;

  zones.push({
    ...ATTENTION_ZONES.CURRENT_STATE,
    has_content: true,
    emphasis: 'always',
  });

  const hasBlockers = journey.immediateBlockers && journey.immediateBlockers.length > 0;
  let blockerEmphasis = 'dimmed';
  if (hasBlockers && isProjectionBlocked) {
    blockerEmphasis = 'escalated';
  } else if (hasBlockers && isExpansionConstrained) {
    blockerEmphasis = 'constrained';
  } else if (hasBlockers) {
    blockerEmphasis = 'active';
  }

  zones.push({
    ...ATTENTION_ZONES.BLOCKERS,
    has_content: hasBlockers,
    emphasis: blockerEmphasis,
  });

  const hasWorkflow = journey.remediationStages && journey.remediationStages.length > 0;
  zones.push({
    ...ATTENTION_ZONES.OPERATOR_ACTION,
    has_content: hasWorkflow,
    emphasis: hasWorkflow ? 'active' : 'dimmed',
  });

  zones.push({
    ...ATTENTION_ZONES.PROGRESSION,
    has_content: !!journey.progression,
    emphasis: 'standard',
  });

  const hasDeferred = (journey.deferredDebt && journey.deferredDebt.length > 0) ||
    (journey.activeDebt && journey.activeDebt.length > 0);
  zones.push({
    ...ATTENTION_ZONES.DEFERRED_DEBT,
    has_content: hasDeferred,
    emphasis: 'subordinate',
  });

  zones.push({
    ...ATTENTION_ZONES.FORENSIC_DETAIL,
    has_content: true,
    emphasis: 'collapsed',
  });

  let primaryFocus;
  if (hasBlockers && isProjectionBlocked) {
    primaryFocus = 'blockers';
  } else if (hasWorkflow) {
    primaryFocus = 'operator_action';
  } else if (hasBlockers) {
    primaryFocus = 'blockers';
  } else {
    primaryFocus = 'current_state';
  }

  const activeZoneCount = zones.filter(z => z.has_content && z.emphasis !== 'collapsed' && z.emphasis !== 'dimmed').length;
  const cognitiveLoad = activeZoneCount <= 2 ? 'focused' : activeZoneCount <= 4 ? 'moderate' : 'high';

  return {
    zones,
    primary_focus: primaryFocus,
    cognitive_load: cognitiveLoad,
  };
}

module.exports = {
  ATTENTION_ZONES,
  resolveAttentionHierarchy,
};

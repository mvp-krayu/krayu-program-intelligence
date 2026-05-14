'use strict';

const COGNITIVE_GROUPS = {
  STATE_RECOGNITION: {
    id: 'state_recognition',
    label: 'State Recognition',
    sequence: 1,
    panels: ['qualification_hero', 'state_ribbon'],
  },
  BLOCKER_RECOGNITION: {
    id: 'blocker_recognition',
    label: 'Blocker Recognition',
    sequence: 2,
    panels: ['blocker_dominance', 'immediate_blockers'],
  },
  WORKFLOW_RECOGNITION: {
    id: 'workflow_recognition',
    label: 'Workflow Recognition',
    sequence: 3,
    panels: ['remediation_workflow', 'source_guidance', 'rerun_checklist'],
  },
  PROGRESSION_UNDERSTANDING: {
    id: 'progression_understanding',
    label: 'Progression Understanding',
    sequence: 4,
    panels: ['progression_timeline', 'validation_gates'],
  },
  DEFERRED_CONTEXT: {
    id: 'deferred_context',
    label: 'Deferred Context',
    sequence: 5,
    panels: ['deferred_debt', 'active_debt'],
  },
  FORENSIC_EXPLORATION: {
    id: 'forensic_exploration',
    label: 'Forensic Exploration',
    sequence: 6,
    panels: ['full_debt_explorer', 'evidence', 'continuity', 'maturity'],
  },
};

function resolveCognitiveGroups(journey, attentionHierarchy) {
  if (!journey || !journey.available) {
    return { groups: [], activeGroup: null };
  }

  const groups = Object.values(COGNITIVE_GROUPS).map(group => {
    const zone = attentionHierarchy
      ? attentionHierarchy.zones.find(z => z.order === group.sequence)
      : null;

    const hasContent = resolveGroupContent(group.id, journey);

    return {
      ...group,
      has_content: hasContent,
      emphasis: zone ? zone.emphasis : 'standard',
      collapsed: group.sequence >= 5 && !isGroupEscalated(group.id, journey),
    };
  });

  const activeGroup = groups.find(g => g.has_content && !g.collapsed) || groups[0];

  return {
    groups,
    activeGroup: activeGroup ? activeGroup.id : null,
  };
}

function resolveGroupContent(groupId, journey) {
  switch (groupId) {
    case 'state_recognition':
      return !!journey.banner;
    case 'blocker_recognition':
      return journey.immediateBlockers && journey.immediateBlockers.length > 0;
    case 'workflow_recognition':
      return journey.remediationStages && journey.remediationStages.length > 0;
    case 'progression_understanding':
      return !!journey.progression || !!journey.validationGates;
    case 'deferred_context':
      return (journey.deferredDebt && journey.deferredDebt.length > 0) ||
        (journey.activeDebt && journey.activeDebt.length > 0);
    case 'forensic_exploration':
      return true;
    default:
      return false;
  }
}

function isGroupEscalated(groupId, journey) {
  if (groupId === 'blocker_recognition') {
    return journey.immediateBlockers && journey.immediateBlockers.length > 0;
  }
  return false;
}

module.exports = {
  COGNITIVE_GROUPS,
  resolveCognitiveGroups,
};

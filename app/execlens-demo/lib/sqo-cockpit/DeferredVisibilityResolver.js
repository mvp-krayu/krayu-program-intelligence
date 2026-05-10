'use strict';

const VISIBILITY_DEFAULTS = {
  qualification_hero: { visible: true, collapsed: false, reason: 'always visible' },
  state_ribbon: { visible: true, collapsed: false, reason: 'always visible' },
  workflow_spine: { visible: true, collapsed: false, reason: 'always visible' },
  immediate_blockers: { visible: true, collapsed: false, reason: 'blockers always prominent' },
  active_workflow: { visible: true, collapsed: false, reason: 'current workflow always visible' },
  rerun_checklist: { visible: true, collapsed: false, reason: 'operator action visible' },
  progression_gates: { visible: true, collapsed: false, reason: 'progression always visible' },
  source_guidance: { visible: true, collapsed: true, reason: 'expandable on demand' },
  deferred_debt: { visible: true, collapsed: true, reason: 'deferred by default' },
  active_debt: { visible: true, collapsed: true, reason: 'subordinate by default' },
  grounding_debt: { visible: true, collapsed: true, reason: 'S3 expansion deferred' },
  label_debt: { visible: true, collapsed: true, reason: 'enrichment deferred' },
  maturity_internals: { visible: true, collapsed: true, reason: 'forensic detail' },
  continuity_internals: { visible: true, collapsed: true, reason: 'forensic detail' },
  evidence_detail: { visible: true, collapsed: true, reason: 'forensic detail' },
};

function resolveDeferredVisibility(journey) {
  if (!journey || !journey.available) {
    return { panels: {}, collapsed_count: 0, visible_count: 0 };
  }

  const panels = {};
  let collapsedCount = 0;
  let visibleCount = 0;

  for (const [panelId, defaults] of Object.entries(VISIBILITY_DEFAULTS)) {
    const hasContent = resolvePanelContent(panelId, journey);
    const shouldCollapse = defaults.collapsed && !isPanelEscalated(panelId, journey);

    panels[panelId] = {
      id: panelId,
      visible: hasContent,
      collapsed: hasContent ? shouldCollapse : false,
      reason: defaults.reason,
    };

    if (hasContent) {
      if (shouldCollapse) collapsedCount++;
      else visibleCount++;
    }
  }

  return {
    panels,
    collapsed_count: collapsedCount,
    visible_count: visibleCount,
  };
}

function resolvePanelContent(panelId, journey) {
  switch (panelId) {
    case 'qualification_hero':
    case 'state_ribbon':
    case 'workflow_spine':
      return !!journey.banner;
    case 'immediate_blockers':
      return journey.immediateBlockers && journey.immediateBlockers.length > 0;
    case 'active_workflow':
      return journey.remediationStages && journey.remediationStages.length > 0;
    case 'rerun_checklist':
      return !!journey.rerunChecklist;
    case 'progression_gates':
      return !!journey.validationGates && !!journey.validationGates.target;
    case 'source_guidance':
      return journey.sourceGuidance && journey.sourceGuidance.length > 0;
    case 'deferred_debt':
    case 'grounding_debt':
    case 'label_debt':
      return journey.deferredDebt && journey.deferredDebt.length > 0;
    case 'active_debt':
      return journey.activeDebt && journey.activeDebt.length > 0;
    case 'maturity_internals':
    case 'continuity_internals':
    case 'evidence_detail':
      return true;
    default:
      return false;
  }
}

function isPanelEscalated(panelId, journey) {
  if (panelId === 'immediate_blockers') return true;
  if (panelId === 'active_workflow') return true;
  return false;
}

module.exports = {
  VISIBILITY_DEFAULTS,
  resolveDeferredVisibility,
};

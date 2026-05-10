'use strict';

const WORKFLOW_PROMINENCE = {
  ACTIVE: { weight: 'dominant', visual: 'active', expanded: true },
  NEXT: { weight: 'standard', visual: 'pending', expanded: false },
  FUTURE: { weight: 'muted', visual: 'future', expanded: false },
  COMPLETE: { weight: 'muted', visual: 'complete', expanded: false },
};

function resolveWorkflowDominance(remediationStages, currentStage) {
  if (!remediationStages || remediationStages.length === 0) {
    return { stages: [], activeStageId: null, spineNodes: [] };
  }

  const currentId = currentStage ? currentStage.id : null;
  let foundCurrent = false;

  const stages = remediationStages.map(stage => {
    let prominence;
    if (stage.id === currentId) {
      prominence = WORKFLOW_PROMINENCE.ACTIVE;
      foundCurrent = true;
    } else if (!foundCurrent) {
      prominence = WORKFLOW_PROMINENCE.COMPLETE;
    } else {
      prominence = WORKFLOW_PROMINENCE.FUTURE;
    }

    return {
      ...stage,
      prominence: prominence.weight,
      visual_state: prominence.visual,
      expanded: prominence.expanded,
    };
  });

  const spineNodes = buildSpineNodes(stages, currentId);

  return {
    stages,
    activeStageId: currentId,
    spineNodes,
  };
}

function buildSpineNodes(stages, activeStageId) {
  const nodes = [];

  for (const stage of stages) {
    nodes.push({
      id: stage.id,
      label: stage.label,
      pathway: stage.pathway,
      item_count: stage.item_count,
      is_active: stage.id === activeStageId,
      visual_state: stage.visual_state,
      all_blocking: stage.all_blocking,
    });
  }

  return nodes;
}

module.exports = {
  WORKFLOW_PROMINENCE,
  resolveWorkflowDominance,
};

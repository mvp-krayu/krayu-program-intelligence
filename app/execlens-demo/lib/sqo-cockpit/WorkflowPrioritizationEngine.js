'use strict';

const PRIORITY_CLASSES = {
  CRITICAL_BLOCKER: { order: 1, label: 'Critical Blocker', visual: 'critical' },
  HIGH_BLOCKER: { order: 2, label: 'High Blocker', visual: 'high' },
  ACTIVE_DEBT: { order: 3, label: 'Active Debt', visual: 'active' },
  DEFERRED_DEBT: { order: 4, label: 'Deferred Debt', visual: 'deferred' },
  IMPROVEMENT: { order: 5, label: 'Improvement', visual: 'low' },
};

function prioritizeWorkflow(debtItems, currentSState) {
  const nextSState = getNext(currentSState);

  const prioritized = debtItems.map(item => {
    let priorityClass;

    if (item.blocks_s_state === nextSState && item.severity === 'CRITICAL') {
      priorityClass = 'CRITICAL_BLOCKER';
    } else if (item.blocks_s_state === nextSState) {
      priorityClass = 'HIGH_BLOCKER';
    } else if (item.blocks_s_state) {
      priorityClass = 'DEFERRED_DEBT';
    } else if (item.severity === 'HIGH' || item.severity === 'CRITICAL') {
      priorityClass = 'ACTIVE_DEBT';
    } else {
      priorityClass = 'IMPROVEMENT';
    }

    return {
      ...item,
      priority_class: priorityClass,
      priority_order: PRIORITY_CLASSES[priorityClass].order,
      priority_label: PRIORITY_CLASSES[priorityClass].label,
      priority_visual: PRIORITY_CLASSES[priorityClass].visual,
    };
  });

  prioritized.sort((a, b) => {
    if (a.priority_order !== b.priority_order) return a.priority_order - b.priority_order;
    return (a.priority || 999) - (b.priority || 999);
  });

  return prioritized;
}

function getWorkflowSummary(prioritized) {
  const counts = {};
  for (const item of prioritized) {
    counts[item.priority_class] = (counts[item.priority_class] || 0) + 1;
  }
  return {
    total: prioritized.length,
    by_class: counts,
    primary_class: prioritized.length > 0 ? prioritized[0].priority_class : null,
    has_critical: (counts.CRITICAL_BLOCKER || 0) > 0,
  };
}

function getNext(s) {
  return { S0: 'S1', S1: 'S2', S2: 'S3' }[s] || null;
}

module.exports = {
  PRIORITY_CLASSES,
  prioritizeWorkflow,
  getWorkflowSummary,
};

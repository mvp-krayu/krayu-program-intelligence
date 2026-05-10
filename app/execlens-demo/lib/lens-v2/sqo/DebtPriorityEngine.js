'use strict';

const SEVERITY_WEIGHTS = {
  'CRITICAL': 4,
  'HIGH': 3,
  'MEDIUM-HIGH': 2,
  'MEDIUM': 1,
};

function classifyImpact(debtItem) {
  if (debtItem.blocks_s_state && debtItem.blocks_s_state !== 'none') return 2.0;
  return 1.0;
}

function classifyDependency(debtItem) {
  return debtItem.has_upstream_dependency ? 0.5 : 1.0;
}

function computePriorityScore(debtItem) {
  const severityWeight = SEVERITY_WEIGHTS[debtItem.severity] || 1;
  const impactMultiplier = classifyImpact(debtItem);
  const dependencyModifier = classifyDependency(debtItem);
  return severityWeight * impactMultiplier * dependencyModifier;
}

function prioritizeDebtItems(debtItems) {
  const scored = debtItems.map(item => ({
    ...item,
    priority_score: computePriorityScore(item),
  }));
  scored.sort((a, b) => b.priority_score - a.priority_score);
  return scored.map((item, i) => ({
    ...item,
    priority: i + 1,
  }));
}

module.exports = {
  SEVERITY_WEIGHTS,
  classifyImpact,
  classifyDependency,
  computePriorityScore,
  prioritizeDebtItems,
};

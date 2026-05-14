'use strict';

const REMEDIATION_STAGES = [
  {
    stage: 1,
    id: 'SEMANTIC_QUALIFICATION_BLOCKERS',
    label: 'Semantic Qualification Blockers',
    pathway: 'R2',
    description: 'Critical missing artifacts blocking next S-state. Requires semantic pipeline re-run with enriched source material.',
    filter: item => item.blocks_s_state && item.category === 'missing_artifact',
  },
  {
    stage: 2,
    id: 'CONTINUITY_RESTORATION',
    label: 'Continuity Restoration',
    pathway: 'R1',
    description: 'Semantic continuity gaps and coverage debt. Requires source material to establish crosswalk mapping.',
    filter: item => item.category === 'continuity_gap',
  },
  {
    stage: 3,
    id: 'BUSINESS_SEMANTIC_ENRICHMENT',
    label: 'Business Semantic Enrichment',
    pathway: 'R1',
    description: 'Business label and semantic coherence debt. Requires domain glossaries, capability models, and ADRs.',
    filter: item => item.category === 'label',
  },
  {
    stage: 4,
    id: 'GOVERNANCE_INTEGRITY',
    label: 'Governance Integrity Restoration',
    pathway: 'R2/R3',
    description: 'Validation, reproducibility, and rendering metadata debt. Resolved through pipeline re-run and metadata generation.',
    filter: item => ['validation', 'reproducibility', 'rendering_metadata'].includes(item.category),
  },
  {
    stage: 5,
    id: 'GROUNDING_EXPANSION',
    label: 'S2→S3 Grounding Expansion',
    pathway: 'R4',
    description: 'Structural grounding extension for full semantic governance. Deferred until S2 qualification achieved.',
    filter: item => item.category === 'grounding_gap',
  },
];

function resolveRemediationStages(debtItems) {
  const stages = [];
  const assigned = new Set();

  for (const stageDef of REMEDIATION_STAGES) {
    const items = debtItems.filter(item => {
      if (assigned.has(item.id)) return false;
      return stageDef.filter(item);
    });

    items.forEach(item => assigned.add(item.id));

    stages.push({
      stage: stageDef.stage,
      id: stageDef.id,
      label: stageDef.label,
      pathway: stageDef.pathway,
      description: stageDef.description,
      items,
      item_count: items.length,
      has_items: items.length > 0,
      all_blocking: items.every(i => i.blocks_s_state),
    });
  }

  const unassigned = debtItems.filter(item => !assigned.has(item.id));
  if (unassigned.length > 0) {
    stages.push({
      stage: 6,
      id: 'UNCLASSIFIED',
      label: 'Other Debt',
      pathway: 'VARIES',
      description: 'Debt items not classified into a specific remediation stage.',
      items: unassigned,
      item_count: unassigned.length,
      has_items: true,
      all_blocking: false,
    });
  }

  return stages.filter(s => s.has_items);
}

function getCurrentStage(stages) {
  return stages.find(s => s.has_items) || null;
}

module.exports = {
  REMEDIATION_STAGES,
  resolveRemediationStages,
  getCurrentStage,
};

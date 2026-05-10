'use strict';

const REMEDIATION_PATHWAYS = {
  R1: {
    id: 'R1',
    name: 'Source Material Enrichment',
    resolves: ['label', 'grounding_gap', 'continuity_gap'],
    process: 'Client provides additional source material (ADRs, capability models, domain glossaries). Semantic pipeline re-processes with enriched inputs.',
  },
  R2: {
    id: 'R2',
    name: 'Semantic Pipeline Re-Run',
    resolves: ['missing_artifact', 'validation', 'reproducibility'],
    process: 'Verify source material sufficiency, re-run semantic bundle producer to produce missing or corrected artifacts.',
  },
  R3: {
    id: 'R3',
    name: 'Rendering Metadata Emission',
    resolves: ['rendering_metadata'],
    process: 'Verify upstream dependencies resolved (decision_validation, crosswalk present), run emit_rendering_metadata vault writer.',
  },
  R4: {
    id: 'R4',
    name: 'Structural Grounding Extension',
    resolves: ['grounding_gap'],
    process: 'Client provides evidence mapping each domain to structural components. Re-run semantic pipeline with evidence-enriched inputs.',
  },
};

const CATEGORY_PATHWAY_MAP = {
  missing_artifact: 'R2',
  grounding_gap: 'R4',
  continuity_gap: 'R1',
  label: 'R1',
  validation: 'R2',
  reproducibility: 'R2',
  rendering_metadata: 'R3',
};

const CATEGORY_SOURCE_MATERIAL = {
  missing_artifact: 'Sufficient source material for semantic pipeline to produce the missing artifact',
  grounding_gap: 'Evidence mapping each ungrounded domain to structural components',
  continuity_gap: 'Domain glossaries and capability models for richer crosswalk production',
  label: 'Business vocabulary documentation (capability models, domain glossaries)',
  validation: 'Sufficient source material for passing decision validation',
  reproducibility: 'Complete source material for fully reproducible semantic derivation',
  rendering_metadata: 'Resolved upstream dependencies (decision_validation, crosswalk)',
};

const CATEGORY_MATURITY_DIMENSIONS = {
  missing_artifact: ['D1', 'D2', 'D3'],
  grounding_gap: ['D2', 'D4'],
  continuity_gap: ['D3', 'D5'],
  label: ['D5', 'D6'],
  validation: ['D1', 'D7'],
  reproducibility: ['D7'],
  rendering_metadata: ['D6'],
};

function computeExpectedImpact(debtItem) {
  const dimensions = CATEGORY_MATURITY_DIMENSIONS[debtItem.category] || [];
  let progression = 'none';
  if (debtItem.blocks_s_state === 'S2') progression = 'S1_TO_S2';
  else if (debtItem.blocks_s_state === 'S3') progression = 'S2_TO_S3';
  return {
    maturity_dimensions: dimensions,
    s_state_progression: progression,
  };
}

function resolveRemediationPath(debtItem) {
  const pathwayId = CATEGORY_PATHWAY_MAP[debtItem.category];
  if (!pathwayId) return null;
  const pathway = REMEDIATION_PATHWAYS[pathwayId];
  return {
    action: pathway.process,
    source_material_needed: CATEGORY_SOURCE_MATERIAL[debtItem.category] || 'none',
    enrichment_pathway: pathwayId,
    expected_impact: computeExpectedImpact(debtItem),
  };
}

function enrichDebtItemWithRemediation(debtItem) {
  return {
    ...debtItem,
    remediation: resolveRemediationPath(debtItem),
  };
}

module.exports = {
  REMEDIATION_PATHWAYS,
  CATEGORY_PATHWAY_MAP,
  resolveRemediationPath,
  computeExpectedImpact,
  enrichDebtItemWithRemediation,
};

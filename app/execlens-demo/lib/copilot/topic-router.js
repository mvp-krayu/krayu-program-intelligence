'use strict';

// Retrieval Strategy v1 — Topic Router
// Replaceable without changing Co-Pilot architecture.
// The Knowledge Graph defines domains. This determines which files
// to load for a given operator intent.
//
// DEBT: v1 routes to a single best-match topic. Many operator intents
// span multiple knowledge domains (category positioning, investor
// narrative, commercial comparison, acquisition discussion). Future:
// multi-topic weighted retrieval. The Knowledge Graph remains primary.
// The Topic Router remains a replaceable retrieval strategy.

const TOPIC_ROUTES = {
  'pi-identity': {
    label: 'PI Definition & Identity',
    files: [
      'docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md',
      'docs/pios/vault/00_START_HERE/OPERATIONAL_ONTOLOGY.md',
    ],
  },
  'commercial': {
    label: 'Commercial & Offers',
    files: [
      'docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/SIGNAL_OFFER_CATALOG_2026.md',
      'docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/SIGNAL_SKU_MODEL_2026.md',
      'docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/SIGNAL_PRODUCT_PLAN_2026.md',
      'docs/pios/vault/10_CANONICAL_RUNTIME_STATE/COMMERCIAL_INFORMATION_ARCHITECTURE.md',
    ],
  },
  'competitive': {
    label: 'Competitive Positioning',
    files: [
      'docs/pios/PI.STRATEGIC-DIRECTION.SIGNAL-PRODUCT-DEFINITION-2026.01/SIGNAL_COMMERCIAL_DEFINITION_2026.md',
      'docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/CATEGORY_POSITIONING_DECISION.md',
    ],
  },
  'governance': {
    label: 'Governance & Prohibitions',
    files: [
      'docs/governance/runtime/reference_boundary_contract.md',
      'docs/pios/vault/01_FOUNDATIONAL_GOVERNANCE/Q02_GOVERNANCE.md',
    ],
  },
  'sqo': {
    label: 'SQO & Qualification',
    files: [
      'docs/pios/vault/04_SQO_AND_QUALIFICATION/SQO_EVOLUTION.md',
      'docs/pios/vault/07_CANONICAL_LINEAGE/GOVERNANCE_TO_SQO_EVOLUTION.md',
    ],
  },
  'cognition': {
    label: 'Cognition Architecture',
    files: [
      'docs/pios/vault/08_EXECUTION_RUNTIME/COGNITION_ANATOMY.md',
    ],
  },
  'marketplace': {
    label: 'Marketplace & Modules',
    files: [
      'docs/pios/PI.STRATEGIC-DIRECTION.MARKETPLACE-COMMERCIALIZATION-STRATEGY.01/marketplace_commercialization_strategy.md',
      'docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_MARKETPLACE_STRATEGY.md',
    ],
  },
  'delivery': {
    label: 'Delivery Process',
    files: [
      'docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/SIGNAL_IMPLEMENTATION_PLAN_2026.md',
    ],
  },
  'pricing': {
    label: 'Pricing & Packaging',
    files: [
      'docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/SIGNAL_SKU_MODEL_2026.md',
      'docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/SIGNAL_OFFER_CATALOG_2026.md',
    ],
  },
  'runtime': {
    label: 'Runtime Architecture',
    files: [
      'docs/pios/vault/05_RUNTIME_AND_CORRIDOR/RUNTIME_CORRIDOR.md',
    ],
  },
  'signals': {
    label: 'Signal Intelligence',
    files: [
      'docs/pios/vault/08_EXECUTION_RUNTIME/COGNITION_ANATOMY.md',
    ],
  },
  'evidence': {
    label: 'Evidence & Grounding',
    files: [
      'docs/pios/vault/03_PATH_SPLIT_EVOLUTION/PATH_SPLIT_EVOLUTION.md',
    ],
  },
  'strategic': {
    label: 'Strategic & Investor',
    files: [
      'docs/pios/PI.STRATEGIC-DIRECTION.SIGNAL-PRODUCT-DEFINITION-2026.01/SIGNAL_PRODUCT_DEFINITION_2026.md',
      'docs/pios/PI.STRATEGIC-DIRECTION.SIGNAL-PRODUCT-DEFINITION-2026.01/SIGNAL_COMMERCIAL_DEFINITION_2026.md',
    ],
  },
  'consumption': {
    label: 'Consumption Architecture',
    files: [
      'docs/pios/PI.CONSUMPTION-AND-ACCESS-ARCHITECTURE.01/CONSUMPTION_ARCHITECTURE_BASELINE.md',
      'docs/pios/PI.ADVISORY-WORKBENCH-AND-CUSTOMER-ACCESS.ENABLEMENT.01/PI_COPILOT_CONCEPTUAL_BASELINE.md',
    ],
  },
  'copilot': {
    label: 'PI Co-Pilot',
    files: [
      'docs/pios/PI.ADVISORY-WORKBENCH-AND-CUSTOMER-ACCESS.ENABLEMENT.01/PI_COPILOT_CONCEPTUAL_BASELINE.md',
      'docs/pios/PI.ADVISORY-WORKBENCH-AND-CUSTOMER-ACCESS.ENABLEMENT.01/ENABLEMENT_PLAN.md',
    ],
  },
  'terminology': {
    label: 'Terminology & Definitions',
    files: [
      'docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md',
    ],
  },
};

const INTENT_KEYWORDS = {
  'pi-identity':  ['what is pi', 'program intelligence', 'what is program', 'define pi', 'pi definition', 'explain pi', 'what does pi do'],
  'commercial':   ['offer', 'sku', 'pricing', 'package', 'sa-dd', 'sa ', 'commercial', 'product plan', 'catalog'],
  'competitive':  ['compare', 'competitor', 'sonarqube', 'versus', 'vs ', 'differentiat', 'contrast', 'alternative'],
  'governance':   ['prohibit', 'governance', 'boundary', 'forbidden', 'authority', 'constitution', 'rule'],
  'sqo':          ['sqo', 'qualification', 's-state', 's-level', 'promotion', 'gate', 'maturity'],
  'cognition':    ['cognition', 'cognitive', 'stratum', 'strata', 'function', 'picr', 'picp', 'cip'],
  'marketplace':  ['marketplace', 'module', 'domain module', 'projection family'],
  'delivery':     ['deliver', 'engagement', 'intake', 'handoff', 'onboard'],
  'pricing':      ['price', 'cost', 'tier', 'bundle', 'upsell'],
  'runtime':      ['runtime', 'pipeline', 'execution', 'corridor'],
  'signals':      ['signal', 'dpsig', 'synthesis', 'condition'],
  'evidence':     ['evidence', 'grounding', 'path a', 'path b', 'substrate'],
  'strategic':    ['investor', 'strategic', 'pe firm', 'private equity', 'investment', 'board', 'executive'],
  'consumption':  ['consumption', 'surface', 'three-surface', 'customer access', 'hosting'],
  'copilot':      ['co-pilot', 'copilot', 'operator surface', 'amplif'],
  'terminology':  ['term', 'definition', 'vocabulary', 'glossary', 'what is a '],
};

function classifyIntent(input) {
  const lower = (input || '').toLowerCase();
  const scores = {};

  for (const [topic, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score++;
    }
    if (score > 0) scores[topic] = score;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return ['pi-identity'];

  const topScore = sorted[0][1];
  return sorted.filter(([, s]) => s === topScore).map(([t]) => t);
}

function getFilesForTopics(topics) {
  const seen = new Set();
  const files = [];
  for (const topic of topics) {
    const route = TOPIC_ROUTES[topic];
    if (!route) continue;
    for (const f of route.files) {
      if (!seen.has(f)) {
        seen.add(f);
        files.push(f);
      }
    }
  }
  return files;
}

function routeIntent(input) {
  const topics = classifyIntent(input);
  return {
    topics,
    files: getFilesForTopics(topics),
  };
}

module.exports = {
  TOPIC_ROUTES,
  INTENT_KEYWORDS,
  classifyIntent,
  getFilesForTopics,
  routeIntent,
};

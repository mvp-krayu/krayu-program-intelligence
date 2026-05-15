'use strict';

/**
 * DisclosureSequencingContract
 * PI.LENS.V2.PHASE3.DISCLOSURE-SEQUENCING-CONTRACT.01
 *
 * Declarative specification of which LENS v2 zones belong to which
 * disclosure tier, per density/persona mode.
 *
 * Tier semantics:
 *   tier0 — always visible, no expansion required
 *   tier1 — visible by default, collapsible
 *   tier2 — collapsed by default, expandable
 *   tier3 — investigation-depth only, explicit entry required
 *
 * Density mode = who is reading (persona selection).
 * Disclosure tier = how deep the reader is going (depth sequencing).
 *
 * This module is static. It does not import runtime bindings, payload
 * resolvers, filesystem modules, AI, or API logic. It is a data
 * structure, not a function of runtime state.
 */

const KNOWN_ZONES = [
  'DeclarationZone',
  'GovernanceRibbon',
  'QualifierMandate',
  'SemanticTrustPostureZone',
  'ReconciliationAwarenessZone',
  'IntelligenceField',
  'SQOIntelligenceZone',
  'EvidenceDepthLayer',
];

const KNOWN_PERSONAS = [
  'EXECUTIVE_BALANCED',
  'EXECUTIVE_DENSE',
  'INVESTIGATION_DENSE',
  'BOARDROOM',
];

const TIER_NAMES = ['tier0', 'tier1', 'tier2', 'tier3'];
const ALL_TIERS_AND_SUPPRESSED = ['tier0', 'tier1', 'tier2', 'tier3', 'suppressed'];

const DISCLOSURE_TIERS = {
  EXECUTIVE_BALANCED: {
    tier0: ['DeclarationZone'],
    tier1: ['IntelligenceField', 'SemanticTrustPostureZone', 'ReconciliationAwarenessZone', 'SQOIntelligenceZone'],
    tier2: [],
    tier3: ['EvidenceDepthLayer'],
    suppressed: ['GovernanceRibbon', 'QualifierMandate'],
  },
  EXECUTIVE_DENSE: {
    tier0: ['DeclarationZone'],
    tier1: ['SemanticTrustPostureZone', 'ReconciliationAwarenessZone', 'QualifierMandate', 'IntelligenceField', 'SQOIntelligenceZone'],
    tier2: ['GovernanceRibbon'],
    tier3: ['EvidenceDepthLayer'],
  },
  INVESTIGATION_DENSE: {
    tier0: ['DeclarationZone'],
    tier1: ['SemanticTrustPostureZone', 'ReconciliationAwarenessZone', 'QualifierMandate'],
    tier2: ['IntelligenceField', 'SQOIntelligenceZone', 'EvidenceDepthLayer', 'GovernanceRibbon'],
    tier3: [],
  },
  BOARDROOM: {
    tier0: ['DeclarationZone'],
    tier1: ['IntelligenceField'],
    tier2: [],
    tier3: [],
    suppressed: [
      'GovernanceRibbon',
      'QualifierMandate',
      'SemanticTrustPostureZone',
      'ReconciliationAwarenessZone',
      'SQOIntelligenceZone',
      'EvidenceDepthLayer',
    ],
  },
};

const ZONE_METADATA = {
  DeclarationZone: {
    conditional: false,
    description: 'S-state, render state, and adapted display declaration',
  },
  GovernanceRibbon: {
    conditional: false,
    description: 'Governance qualifier, classification, and confidence band — investigation-tier ambient',
  },
  QualifierMandate: {
    conditional: true,
    condition: 'Visible when qualifier_notice_visible AND Q-class is Q-02 or Q-03. Suppressed in BALANCED/BOARDROOM — qualifier language integrated into narrative.',
    description: 'Governance qualifier mandate notice for partial/semantic-only grounding',
  },
  SemanticTrustPostureZone: {
    conditional: true,
    condition: 'Visible when substrateBinding is available',
    description: 'Trust posture, qualification posture, reconciliation summary, debt summary',
  },
  ReconciliationAwarenessZone: {
    conditional: true,
    condition: 'Visible when reconciliationAwareness is available',
    description: 'Per-domain reconciliation status, enrichment rationale, domain traceability',
  },
  IntelligenceField: {
    conditional: false,
    description: 'Persona-dispatched intelligence rendering (Balanced/Dense/Investigation/Boardroom)',
  },
  SQOIntelligenceZone: {
    conditional: true,
    condition: 'Visible when substrateBinding is available and not boardroomMode',
    description: 'SQO qualification intelligence — narrative state, debt, blocking conditions, progression',
  },
  EvidenceDepthLayer: {
    conditional: true,
    condition: 'Currently gated to INVESTIGATION_DENSE mode only (non-boardroom)',
    description: 'Raw evidence blocks with full trace data and confidence scores',
  },
};

/**
 * Retrieve disclosure tier assignments for a given persona mode.
 *
 * @param {string} persona — one of KNOWN_PERSONAS
 * @returns {{ tier0: string[], tier1: string[], tier2: string[], tier3: string[] } | null}
 */
function getDisclosureTiers(persona) {
  return DISCLOSURE_TIERS[persona] || null;
}

/**
 * Retrieve the tier assignment for a specific zone in a specific persona.
 *
 * @param {string} zone — one of KNOWN_ZONES
 * @param {string} persona — one of KNOWN_PERSONAS
 * @returns {string | null} — 'tier0', 'tier1', 'tier2', 'tier3', or null if not found
 */
function getZoneTier(zone, persona) {
  const tiers = DISCLOSURE_TIERS[persona];
  if (!tiers) return null;
  for (const tierName of ALL_TIERS_AND_SUPPRESSED) {
    if (tiers[tierName] && tiers[tierName].includes(zone)) return tierName;
  }
  return null;
}

/**
 * Retrieve the ordered disclosure sequence for a persona.
 * Returns zones in tier order: all tier0 zones first, then tier1, etc.
 *
 * @param {string} persona — one of KNOWN_PERSONAS
 * @returns {Array<{ zone: string, tier: string }>}
 */
function getDisclosureSequence(persona) {
  const tiers = DISCLOSURE_TIERS[persona];
  if (!tiers) return [];
  const sequence = [];
  for (const tierName of TIER_NAMES) {
    if (tiers[tierName]) {
      for (const zone of tiers[tierName]) {
        sequence.push({ zone, tier: tierName });
      }
    }
  }
  return sequence;
}

/**
 * Validate that all known zones are assigned in all personas.
 * Returns a validation result with per-persona coverage.
 *
 * @returns {{ valid: boolean, personas: object }}
 */
function validateZoneCoverage() {
  const result = { valid: true, personas: {} };
  for (const persona of KNOWN_PERSONAS) {
    const tiers = DISCLOSURE_TIERS[persona];
    const assigned = new Set();
    for (const tierName of ALL_TIERS_AND_SUPPRESSED) {
      if (tiers[tierName]) {
        for (const zone of tiers[tierName]) {
          assigned.add(zone);
        }
      }
    }
    const missing = KNOWN_ZONES.filter(z => !assigned.has(z));
    const unknown = [...assigned].filter(z => !KNOWN_ZONES.includes(z));
    const personaResult = {
      assigned: assigned.size,
      total: KNOWN_ZONES.length,
      complete: missing.length === 0 && unknown.length === 0,
      missing,
      unknown,
    };
    result.personas[persona] = personaResult;
    if (!personaResult.complete) result.valid = false;
  }
  return result;
}

module.exports = {
  KNOWN_ZONES,
  KNOWN_PERSONAS,
  TIER_NAMES,
  DISCLOSURE_TIERS,
  ZONE_METADATA,
  getDisclosureTiers,
  getZoneTier,
  getDisclosureSequence,
  validateZoneCoverage,
};

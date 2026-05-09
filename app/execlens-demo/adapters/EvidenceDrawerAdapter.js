'use strict';

/**
 * EvidenceDrawerAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts one evidence_block into EvidenceDrawer display props.
 * Domain alias is already ALI-04 applied. Propagation role mapped to label.
 * Delegates signal_cards to SignalCardAdapter.
 *
 * Contract: pure function — no fetch, no generation, no mutation.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');
const { adaptSignalCard } = require('./SignalCardAdapter');

// Propagation role → human-readable label (VIS-PROP-01 / NORM-PROP-01)
const PROPAGATION_ROLE_LABEL = {
  ORIGIN: 'Pressure Origin',
  RECEIVER: 'Pressure Receiver',
  PASS_THROUGH: 'Pass-Through',
  ISOLATED: 'Independent Domain',
};

// GroundingScope label fallback for Q levels
const GROUNDING_SCOPE_LABEL = {
  'Q-00': 'Full Grounding',
  'Q-01': 'Partial Grounding',
  'Q-02': 'Structural View Only',
  'Q-03': 'Under Review',
  'Q-04': 'Withheld',
};

/**
 * adaptEvidenceDrawer(evidenceBlock, audienceTier, index)
 *
 * Converts one evidence_block → EvidenceDrawerDisplay.
 * Q-04 grounding_status → is_suppressed = true; no signals exposed.
 * domain_alias must never be replaced with a raw domain ID.
 *
 * Returns:
 * {
 *   domain_alias: string,
 *   grounding_scope: string,          — qualifier class as scope label
 *   grounding_label: string,          — human-readable grounding description
 *   propagation_role: string,         — enum (internal)
 *   propagation_role_label: string,   — display label
 *   signal_cards: SignalCardDisplay[],
 *   evidence_summary: string,
 *   is_suppressed: boolean,           — true for Q-04 scoped domains
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Does not mutate evidenceBlock.
 */
function adaptEvidenceDrawer(evidenceBlock, audienceTier, index) {
  const idx = index !== undefined ? index : 0;

  if (!evidenceBlock || typeof evidenceBlock !== 'object') {
    return _drawerDiagnostic(`Domain ${idx + 1}`, 'evidenceBlock is null');
  }

  // Domain alias — ALI-04 already applied at generation. Never use raw domain ID.
  const domain_alias = (evidenceBlock.domain_alias && typeof evidenceBlock.domain_alias === 'string')
    ? evidenceBlock.domain_alias
    : `Domain ${idx + 1}`;

  const grounding_status = evidenceBlock.grounding_status || 'Q-00';
  const grounding_scope = GROUNDING_SCOPE_LABEL[grounding_status] || 'Unknown Grounding';
  const grounding_label = (typeof evidenceBlock.grounding_label === 'string')
    ? evidenceBlock.grounding_label
    : grounding_scope;

  const propagation_role = evidenceBlock.propagation_role || 'ISOLATED';
  const propagation_role_label = PROPAGATION_ROLE_LABEL[propagation_role] || 'Independent Domain';

  const is_suppressed = grounding_status === 'Q-04';

  // Q-04 domains: suppress signal cards per governance; render absence notice only
  let signal_cards = [];
  if (!is_suppressed && Array.isArray(evidenceBlock.signal_cards)) {
    signal_cards = evidenceBlock.signal_cards.map(adaptSignalCard);
  }

  const evidence_summary = (typeof evidenceBlock.evidence_description === 'string')
    ? evidenceBlock.evidence_description
    : '';

  return {
    domain_alias,
    grounding_scope,
    grounding_label,
    propagation_role,
    propagation_role_label,
    signal_cards,
    evidence_summary,
    is_suppressed,
    error: null,
  };
}

function _drawerDiagnostic(domain_alias, detail) {
  return {
    domain_alias,
    grounding_scope: 'Unknown Grounding',
    grounding_label: '',
    propagation_role: 'ISOLATED',
    propagation_role_label: 'Independent Domain',
    signal_cards: [],
    evidence_summary: '',
    is_suppressed: false,
    error: makeAdapterError('ADAPT-EVID-01', detail),
  };
}

module.exports = { adaptEvidenceDrawer, PROPAGATION_ROLE_LABEL, GROUNDING_SCOPE_LABEL };

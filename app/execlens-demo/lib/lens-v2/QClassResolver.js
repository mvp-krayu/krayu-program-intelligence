/**
 * QClassResolver
 * PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01
 *
 * Pure deterministic resolver for the four-class qualifier model defined
 * by docs/governance/Q02_GOVERNANCE_AMENDMENT.md and codified by
 * docs/governance/q02_governance_matrix.json:
 *
 *   Q-01  FULL_GROUNDING
 *   Q-02  PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY
 *   Q-03  SEMANTIC_ONLY
 *   Q-04  UNAVAILABLE
 *
 * Mandatory prohibitions (enforced here):
 *   - Never derive Q-01 from semantic continuity alone.
 *   - Never collapse Q-04 into Q-03.
 *   - Never produce probabilistic / AI-confidence semantics.
 *
 * Backward compatibility (per amendment §6) is exposed via
 * `compat_legacy_class` so legacy fixture-era adapters (Q-00..Q-04)
 * continue to function.
 */

'use strict';

const Q_CLASSES = {
  'Q-01': {
    id: 'Q-01',
    name: 'FULL_GROUNDING',
    executive_label: 'Full Grounding',
    executive_note: null,
    render_chip: false,
    render_absence_notice: false,
    compat_legacy_class: 'Q-00',
  },
  'Q-02': {
    id: 'Q-02',
    name: 'PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY',
    executive_label: 'Partial Grounding · Structural Continuity',
    executive_note:
      'Semantic continuity is validated. Some semantic domains lack structural backing; advisory confirmation is mandatory before executive commitment.',
    render_chip: true,
    render_absence_notice: false,
    compat_legacy_class: 'Q-01',
  },
  'Q-03': {
    id: 'Q-03',
    name: 'SEMANTIC_ONLY',
    executive_label: 'Semantic Continuity Only',
    executive_note:
      'Structural backing is absent. Only semantic continuity supports the projection. Executive caution mandatory.',
    render_chip: true,
    render_absence_notice: false,
    compat_legacy_class: 'Q-02',
  },
  'Q-04': {
    id: 'Q-04',
    name: 'UNAVAILABLE',
    executive_label: 'Withheld',
    executive_note: 'Evidence is unavailable. No semantic projection is permitted.',
    render_chip: false,
    render_absence_notice: true,
    compat_legacy_class: 'Q-04',
  },
};

const RESOLUTION_RULE_ID = 'Q02-RES-RULE-01';
const RESOLUTION_RULE_VERSION = '1.0';

const RESOLUTION_RULE_TEXT =
  'evidence_availability!=AVAILABLE → Q-04; ratio==1.0 → Q-01; ratio==0 → semantic_continuity_status==VALIDATED ? Q-03 : Q-04; 0<ratio<1.0 → semantic_continuity_status==VALIDATED ? Q-02 : Q-03';

/**
 * @param {object} input
 * @param {number} input.backed_count
 * @param {number} input.total_count
 * @param {string} input.semantic_continuity_status   'VALIDATED' or 'ABSENT'
 * @param {string} [input.evidence_availability]      'AVAILABLE' or 'ABSENT' (default 'AVAILABLE')
 * @returns {{
 *   qualifier_class: string,
 *   qualifier_label: string,
 *   qualifier_note: (string|null),
 *   render_chip: boolean,
 *   render_absence_notice: boolean,
 *   compat_legacy_class: string,
 *   semantic_projection_class: string,
 *   derivation_inputs: object,
 *   derivation_rule_id: string,
 *   derivation_rule_version: string,
 *   derivation_rule_text: string,
 * }}
 */
function resolveQClass(input) {
  const total = Math.max(0, Number(input && input.total_count) || 0);
  const backed = Math.max(0, Number(input && input.backed_count) || 0);
  const semanticContinuity =
    (input && input.semantic_continuity_status) === 'VALIDATED'
      ? 'VALIDATED'
      : 'ABSENT';
  const evidenceAvailability =
    (input && input.evidence_availability) === 'ABSENT'
      ? 'ABSENT'
      : 'AVAILABLE';
  const safeTotal = total > 0 ? total : 1;
  const ratio = total > 0 ? backed / safeTotal : 0;

  let id;
  if (evidenceAvailability !== 'AVAILABLE') {
    id = 'Q-04';
  } else if (total === 0) {
    id = 'Q-04';
  } else if (ratio >= 1.0) {
    id = 'Q-01';
  } else if (ratio === 0) {
    id = semanticContinuity === 'VALIDATED' ? 'Q-03' : 'Q-04';
  } else {
    id = semanticContinuity === 'VALIDATED' ? 'Q-02' : 'Q-03';
  }

  const meta = Q_CLASSES[id];
  return {
    qualifier_class: id,
    qualifier_label: meta.executive_label,
    qualifier_note: meta.executive_note,
    render_chip: meta.render_chip,
    render_absence_notice: meta.render_absence_notice,
    compat_legacy_class: meta.compat_legacy_class,
    semantic_projection_class: meta.name,
    derivation_inputs: {
      backed_count: backed,
      total_count: total,
      semantic_continuity_status: semanticContinuity,
      evidence_availability: evidenceAvailability,
      grounding_ratio: ratio,
    },
    derivation_rule_id: RESOLUTION_RULE_ID,
    derivation_rule_version: RESOLUTION_RULE_VERSION,
    derivation_rule_text: RESOLUTION_RULE_TEXT,
  };
}

/**
 * Map legacy adapter Q-class → new governance class (best-effort, lossy
 * for Q-02 ↔ Q-03 inversion). Used only by historical-data shims.
 */
function legacyToGovernance(legacy) {
  switch (legacy) {
    case 'Q-00': return 'Q-01';
    case 'Q-01': return 'Q-02';
    case 'Q-02': return 'Q-03';
    case 'Q-04': return 'Q-04';
    default: return null;
  }
}

/**
 * Map new governance class → legacy adapter class.
 */
function governanceToLegacy(govClass) {
  const meta = Q_CLASSES[govClass];
  return meta ? meta.compat_legacy_class : null;
}

module.exports = {
  Q_CLASSES,
  RESOLUTION_RULE_ID,
  RESOLUTION_RULE_VERSION,
  RESOLUTION_RULE_TEXT,
  resolveQClass,
  legacyToGovernance,
  governanceToLegacy,
};

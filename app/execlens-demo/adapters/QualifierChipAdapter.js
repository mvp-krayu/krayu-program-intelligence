'use strict';

/**
 * QualifierChipAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts qualifier_class into renderable chip props.
 * Enforces Q-04 explicit absence notice. Enforces Q-01..Q-03 mandatory visibility.
 *
 * Token mapping from VIS-QUAL-01 (visual_semantics_registry.json).
 * Contract: pure function — no mutation, no suppression, no generation.
 */

const { makeAdapterError } = require('./AdapterErrorTaxonomy');

// VIS-QUAL-01 — governance-derived qualifier chip mapping
const QUALIFIER_CHIP_MAP = {
  'Q-00': {
    chip_label: null,
    chip_token: 'NONE',
    renders: false,
    absence_notice: null,
  },
  'Q-01': {
    chip_label: 'Partial Grounding',
    chip_token: 'token-qualifier-amber',
    renders: true,
    absence_notice: null,
  },
  'Q-02': {
    chip_label: 'Structural View',
    chip_token: 'token-qualifier-blue',
    renders: true,
    absence_notice: null,
  },
  'Q-03': {
    chip_label: 'Under Review',
    chip_token: 'token-qualifier-grey',
    renders: true,
    absence_notice: null,
  },
  'Q-04': {
    chip_label: null,
    chip_token: 'NONE',
    renders: false,
    absence_notice: 'Signal intelligence withheld from this view.',
  },
};

/**
 * adaptQualifierChip(qualifier_class, tooltip_text)
 *
 * Converts qualifier_class → chip display props per VIS-QUAL-01.
 * Q-00: chip does not render.
 * Q-01..Q-03: chip renders with governance-derived label and token.
 * Q-04: chip does not render; absence_notice is mandatory.
 * tooltip_text is sourced from the pre-rendered header_block (never generated here).
 *
 * Returns:
 * {
 *   renders: boolean,
 *   chip_label: string | null,
 *   chip_token: string,
 *   tooltip_text: string,
 *   absence_notice: string | null,
 *   error: AdapterError | null,
 * }
 *
 * Pure function. Does not mutate input.
 */
function adaptQualifierChip(qualifier_class, tooltip_text) {
  const mapping = QUALIFIER_CHIP_MAP[qualifier_class];

  if (!mapping) {
    // Unknown qualifier — diagnostic (cannot suppress silently)
    return {
      renders: true,
      chip_label: 'Unknown Qualifier',
      chip_token: 'token-qualifier-grey',
      tooltip_text: '',
      absence_notice: null,
      error: makeAdapterError('ADAPT-QUAL-01',
        `qualifier_class '${qualifier_class}' has no VIS-QUAL-01 mapping`),
    };
  }

  return {
    renders: mapping.renders,
    chip_label: mapping.chip_label,
    chip_token: mapping.chip_token,
    // tooltip_text is pre-rendered at generation time — never generated here
    tooltip_text: (typeof tooltip_text === 'string') ? tooltip_text : '',
    absence_notice: mapping.absence_notice,
    error: null,
  };
}

module.exports = { adaptQualifierChip, QUALIFIER_CHIP_MAP };

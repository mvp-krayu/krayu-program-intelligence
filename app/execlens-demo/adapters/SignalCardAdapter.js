'use strict';

/**
 * SignalCardAdapter.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Converts a single signal_card entry into SignalCard display props.
 * ALI-01/02 labels are pre-applied at generation. Pressure tier mapped to
 * governance-derived display label and token (VIS-PRESS-01).
 *
 * Contract: pure function — raw CPI/CFA keys must never appear in output.
 */

const { makeAdapterError, FORBIDDEN_RAW_SIGNAL_KEYS } = require('./AdapterErrorTaxonomy');

// VIS-PRESS-01 — governance-derived pressure tier mapping
const PRESSURE_TIER_MAP = {
  HIGH: {
    display_label: 'High execution pressure',
    pressure_token: 'token-pressure-high',
  },
  ELEVATED: {
    display_label: 'Elevated pressure',
    pressure_token: 'token-pressure-elevated',
  },
  MODERATE: {
    display_label: 'Moderate pressure',
    pressure_token: 'token-pressure-moderate',
  },
  LOW: {
    display_label: 'Stable / low pressure',
    pressure_token: 'token-pressure-low',
  },
};

/**
 * adaptSignalCard(signalCard)
 *
 * Converts one signal_card into SignalCard display props.
 * signal_label is already ALI-01/02 normalized — extracted as-is.
 * pressure_tier is mapped to display_label + pressure_token per VIS-PRESS-01.
 * Numerical values are forbidden in output.
 *
 * Returns:
 * {
 *   signal_label: string,
 *   pressure_tier: string,      — enum value used internally; display_label is the surface text
 *   pressure_label: string,     — from VIS-PRESS-01 display_label
 *   pressure_token: string,     — governance-derived design token
 *   qualifier_label: string,    — pre-rendered Q-taxonomy label (empty string for Q-00)
 *   evidence_text: string,
 *   error: AdapterError | null,
 * }
 */
function adaptSignalCard(signalCard) {
  if (!signalCard || typeof signalCard !== 'object') {
    return _signalDiagnostic('ADAPT-EVID-01', 'signalCard is null or not an object');
  }

  // Guard: raw signal keys must not appear in signal_label
  const signalLabel = signalCard.signal_label || '';
  for (const forbidden of FORBIDDEN_RAW_SIGNAL_KEYS) {
    if (signalLabel.includes(forbidden)) {
      return _signalDiagnostic('ADAPT-GOV-01',
        `signal_label contains forbidden raw key '${forbidden}' — governance violation`);
    }
  }

  const pressureMapping = PRESSURE_TIER_MAP[signalCard.pressure_tier];
  if (!pressureMapping) {
    return _signalDiagnostic('ADAPT-EVID-01',
      `pressure_tier '${signalCard.pressure_tier}' has no VIS-PRESS-01 mapping`);
  }

  const qualifier_label = (typeof signalCard.qualifier_label === 'string')
    ? signalCard.qualifier_label
    : '';

  const evidence_text = (typeof signalCard.evidence_text === 'string')
    ? signalCard.evidence_text
    : '';

  return {
    signal_label: signalLabel,
    pressure_tier: signalCard.pressure_tier,
    pressure_label: pressureMapping.display_label,
    pressure_token: pressureMapping.pressure_token,
    qualifier_label,
    evidence_text,
    error: null,
  };
}

function _signalDiagnostic(errorId, detail) {
  return {
    signal_label: '',
    pressure_tier: 'LOW',
    pressure_label: 'Stable / low pressure',
    pressure_token: 'token-pressure-low',
    qualifier_label: '',
    evidence_text: '',
    error: makeAdapterError(errorId, detail),
  };
}

module.exports = { adaptSignalCard, PRESSURE_TIER_MAP };

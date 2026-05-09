'use strict';

/**
 * AdapterErrorTaxonomy.js
 * PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01
 *
 * Defines all adapter error IDs, classes, and routing decisions for the
 * LENS rendering adapter layer.
 */

const AdapterErrorClass = {
  INPUT: 'INPUT',
  SURFACE: 'SURFACE',
  READINESS: 'READINESS',
  QUALIFIER: 'QUALIFIER',
  NARRATIVE: 'NARRATIVE',
  EVIDENCE: 'EVIDENCE',
  TRACE: 'TRACE',
  EXPLAINABILITY: 'EXPLAINABILITY',
  TOPOLOGY: 'TOPOLOGY',
  BLOCKED: 'BLOCKED',
  DIAGNOSTIC: 'DIAGNOSTIC',
  GOVERNANCE: 'GOVERNANCE',
};

const AdapterRoute = {
  BLOCKED: 'BLOCKED',
  DIAGNOSTIC: 'DIAGNOSTIC',
  GOVERNANCE_VIOLATION: 'GOVERNANCE_VIOLATION',
  PASS: 'PASS',
};

const AdapterErrors = {
  'ADAPT-INPUT-01': {
    id: 'ADAPT-INPUT-01',
    errorClass: AdapterErrorClass.INPUT,
    message: 'Adapter received unvalidated or null reportObject — validation must precede adaptation',
    route: AdapterRoute.BLOCKED,
  },
  'ADAPT-INPUT-02': {
    id: 'ADAPT-INPUT-02',
    errorClass: AdapterErrorClass.INPUT,
    message: 'Adapter input failed validation — blocked state enforced',
    route: AdapterRoute.BLOCKED,
  },
  'ADAPT-SURFACE-01': {
    id: 'ADAPT-SURFACE-01',
    errorClass: AdapterErrorClass.SURFACE,
    message: 'Surface mode cannot be resolved from readiness_state and governance_verdict',
    route: AdapterRoute.BLOCKED,
  },
  'ADAPT-SURFACE-02': {
    id: 'ADAPT-SURFACE-02',
    errorClass: AdapterErrorClass.SURFACE,
    message: 'Unknown audience_tier — defaulting to EXECUTIVE_DENSE density class',
    route: AdapterRoute.DIAGNOSTIC,
  },
  'ADAPT-READY-01': {
    id: 'ADAPT-READY-01',
    errorClass: AdapterErrorClass.READINESS,
    message: 'readiness_state absent or unmappable — blocked state enforced',
    route: AdapterRoute.BLOCKED,
  },
  'ADAPT-QUAL-01': {
    id: 'ADAPT-QUAL-01',
    errorClass: AdapterErrorClass.QUALIFIER,
    message: 'qualifier_class absent or unmappable — diagnostic state enforced',
    route: AdapterRoute.DIAGNOSTIC,
  },
  'ADAPT-NARR-01': {
    id: 'ADAPT-NARR-01',
    errorClass: AdapterErrorClass.NARRATIVE,
    message: 'Narrative field absent — affected panel enters diagnostic state',
    route: AdapterRoute.DIAGNOSTIC,
  },
  'ADAPT-EVID-01': {
    id: 'ADAPT-EVID-01',
    errorClass: AdapterErrorClass.EVIDENCE,
    message: 'evidence_blocks absent or empty — blocked state enforced',
    route: AdapterRoute.BLOCKED,
  },
  'ADAPT-TRACE-01': {
    id: 'ADAPT-TRACE-01',
    errorClass: AdapterErrorClass.TRACE,
    message: 'trace_block absent or incomplete — trace panel enters diagnostic state',
    route: AdapterRoute.DIAGNOSTIC,
  },
  'ADAPT-EXPLAIN-01': {
    id: 'ADAPT-EXPLAIN-01',
    errorClass: AdapterErrorClass.EXPLAINABILITY,
    message: 'Explainability bundle panel absent — panel enters blocked state',
    route: AdapterRoute.BLOCKED,
  },
  'ADAPT-TOPO-01': {
    id: 'ADAPT-TOPO-01',
    errorClass: AdapterErrorClass.TOPOLOGY,
    message: 'topology_scope incomplete — topology summary uses placeholder',
    route: AdapterRoute.DIAGNOSTIC,
  },
  'ADAPT-BLOCK-01': {
    id: 'ADAPT-BLOCK-01',
    errorClass: AdapterErrorClass.BLOCKED,
    message: 'Report is in BLOCKED state — no intelligence surface may render',
    route: AdapterRoute.BLOCKED,
  },
  'ADAPT-DIAG-01': {
    id: 'ADAPT-DIAG-01',
    errorClass: AdapterErrorClass.DIAGNOSTIC,
    message: 'Report is in DIAGNOSTIC state — executive intelligence surface suppressed',
    route: AdapterRoute.DIAGNOSTIC,
  },
  'ADAPT-GOV-01': {
    id: 'ADAPT-GOV-01',
    errorClass: AdapterErrorClass.GOVERNANCE,
    message: 'Adapter output contains forbidden GEIOS identifier or raw key — governance violation',
    route: AdapterRoute.GOVERNANCE_VIOLATION,
  },
};

function makeAdapterError(errorId, detail) {
  const template = AdapterErrors[errorId];
  if (!template) throw new Error(`Unknown adapter error ID: ${errorId}`);
  return { ...template, detail: detail || null };
}

// Governance-enforced forbidden raw signal keys (must never appear in adapter output)
const FORBIDDEN_RAW_SIGNAL_KEYS = [
  'cpi_score', 'cfa_score', 'CPI', 'CFA',
  'TAXONOMY-01', 'signal_value', 'activation_state', 'signal_stable_key',
  'DPSIG', 'EXSIG', 'ORGSIG', 'FLOWSIG', 'RISKSIG', 'TIMSIG', 'RUNSIG', 'OPSIG',
];

const FORBIDDEN_GEIOS_IDENTIFIERS = [
  'GEIOS', 'GEIOS substrate', 'TAXONOMY-01', 'governed-dpsig-baseline-v1',
  'canonical_topology.json', 'AS-01', 'N-SAF-01', 'E-SAF-01',
  'Lane A', 'Lane B', 'Lane C', 'Lane D',
];

module.exports = {
  AdapterErrorClass,
  AdapterRoute,
  AdapterErrors,
  makeAdapterError,
  FORBIDDEN_RAW_SIGNAL_KEYS,
  FORBIDDEN_GEIOS_IDENTIFIERS,
};

'use strict';

/**
 * ProjectionDepthContract
 * PI.LENS.V2.PHASE3.PROJECTION-DEPTH-CONTRACT.01
 *
 * Declarative specification of which fields are exposed at each
 * projection depth (EXECUTIVE vs OPERATOR) for every substrate
 * binding section.
 *
 * EXECUTIVE = compressed, consequence-first subset (labels,
 *   classifications, visual indicators, headline metrics).
 * OPERATOR  = full field set (wildcard '*').
 *
 * This module is static. It does not import runtime bindings,
 * payload resolvers, filesystem modules, AI, or API logic.
 */

const KNOWN_SECTIONS = [
  'trustPosture',
  'debtVisibility',
  'temporalVisibility',
  'evidenceVisibility',
  'propagationVisibility',
  'structuralBacking',
  'envelope',
  'operationalHealth',
  'provenance',
  'reconciliationAwareness.posture',
  'reconciliationAwareness.debtPosture',
  'reconciliationAwareness.qualificationFrame',
  'reconciliationAwareness.correspondence',
  'reconciliationAwareness.lifecycle',
  'reconciliationAwareness.per_domain',
  'domainTraceability',
];

const KNOWN_DEPTHS = ['EXECUTIVE', 'OPERATOR'];

const PROJECTION_DEPTHS = {
  EXECUTIVE: {
    trustPosture: [
      'level',
      'label',
      'color',
      's_state',
      'q_class',
      'grounding_pct',
      'maturity_classification',
      'gravity_classification',
      'stability_classification',
      'progression_readiness',
      'progression_target',
    ],
    debtVisibility: [
      'total_items',
      'blocking_count',
      'has_blocking_debt',
      'operational_exposure',
      'exposure_color',
    ],
    temporalVisibility: [
      'trend',
      'trend_color',
      'enrichment_grade',
      'degradation_detected',
    ],
    evidenceVisibility: [
      'total_items',
      'all_valid',
      'covered_domains',
      'integrity_color',
    ],
    propagationVisibility: [
      'ready',
      's_state_current',
      's_state_target',
      'readiness_pct',
      'blocking_gates',
      'gate_color',
    ],
    structuralBacking: [
      'total_domains',
      'reconciled',
      'unreconciled',
      'reconciliation_pct',
      'weighted_confidence',
      'trend',
    ],
    envelope: '*',
    operationalHealth: '*',
    provenance: '*',
    'reconciliationAwareness.posture': [
      'label',
      'tier',
      'coverage_pct',
      'weighted_confidence',
    ],
    'reconciliationAwareness.debtPosture': [
      'unresolved_count',
      'total_domains',
      'resolution_pct',
    ],
    'reconciliationAwareness.qualificationFrame': [
      'reconciliation_ratio',
      'weighted_confidence',
      'trend',
    ],
    'reconciliationAwareness.correspondence': [
      'reconciliation_ratio',
      'total_domains',
      'weighted_confidence',
    ],
    'reconciliationAwareness.lifecycle': [
      'trend',
    ],
    'reconciliationAwareness.per_domain': [],
    domainTraceability: [],
  },
  OPERATOR: {
    trustPosture: '*',
    debtVisibility: '*',
    temporalVisibility: '*',
    evidenceVisibility: '*',
    propagationVisibility: '*',
    structuralBacking: '*',
    envelope: '*',
    operationalHealth: '*',
    provenance: '*',
    'reconciliationAwareness.posture': '*',
    'reconciliationAwareness.debtPosture': '*',
    'reconciliationAwareness.qualificationFrame': '*',
    'reconciliationAwareness.correspondence': '*',
    'reconciliationAwareness.lifecycle': '*',
    'reconciliationAwareness.per_domain': '*',
    domainTraceability: '*',
  },
};

const SECTION_METADATA = {
  trustPosture: {
    source: 'LensSQOSubstrateConsumer.resolveTrustPosture',
    total_fields: 16,
    description: 'Trust level, classification scores, progression readiness',
  },
  debtVisibility: {
    source: 'LensSQOSubstrateConsumer.resolveDebtVisibility',
    total_fields: 9,
    description: 'Debt counts, blocking status, operational exposure',
  },
  temporalVisibility: {
    source: 'LensSQOSubstrateConsumer.resolveTemporalVisibility',
    total_fields: 8,
    description: 'Trend direction, enrichment grade, degradation detection',
  },
  evidenceVisibility: {
    source: 'LensSQOSubstrateConsumer.resolveEvidenceVisibility',
    total_fields: 7,
    description: 'Evidence counts, validity, coverage, integrity',
  },
  propagationVisibility: {
    source: 'LensSQOSubstrateConsumer.resolvePropagationVisibility',
    total_fields: 9,
    description: 'Gate readiness, S-state progression, blocking gates',
  },
  structuralBacking: {
    source: 'LensSQOSubstrateConsumer.resolveStructuralBackingVisibility',
    total_fields: 9,
    description: 'Domain reconciliation counts, confidence, trend',
  },
  envelope: {
    source: 'qualProjection.envelope',
    total_fields: null,
    description: 'Run envelope metadata (pass-through)',
  },
  operationalHealth: {
    source: 'opsProjection.health',
    total_fields: null,
    description: 'Operational health metrics (pass-through)',
  },
  provenance: {
    source: 'qualProjection.provenance',
    total_fields: null,
    description: 'Data provenance metadata (pass-through)',
  },
  'reconciliationAwareness.posture': {
    source: 'LensReconciliationConsumptionLayer.resolveReconciliationPosture',
    total_fields: 8,
    description: 'Reconciliation posture label, tier, coverage, confidence',
  },
  'reconciliationAwareness.debtPosture': {
    source: 'LensReconciliationConsumptionLayer.resolveDebtPosture',
    total_fields: 6,
    description: 'Unresolved count, resolution rate, domain IDs',
  },
  'reconciliationAwareness.qualificationFrame': {
    source: 'LensReconciliationConsumptionLayer.resolveQualificationFrame',
    total_fields: 7,
    description: 'Qualification ratio, confidence, trend, trajectory',
  },
  'reconciliationAwareness.correspondence': {
    source: 'buildReconciliationAwareness inline',
    total_fields: 7,
    description: 'Per-domain correspondence ratios, counts, confidence',
  },
  'reconciliationAwareness.lifecycle': {
    source: 'ReconciliationLifecycleProjection.projectLifecycleForRuntime',
    total_fields: 8,
    description: 'Lifecycle trend, trajectory, epoch summary, deltas',
  },
  'reconciliationAwareness.per_domain': {
    source: 'reconciliation_summary.per_domain',
    total_fields: null,
    description: 'Per-domain reconciliation entries (array, pass-through)',
  },
  domainTraceability: {
    source: 'LensReconciliationConsumptionLayer.buildDomainTraceability',
    total_fields: 14,
    description: 'Per-domain traceability with enrichment rationale',
  },
};

/**
 * Retrieve the projection field specification for a section at a given depth.
 *
 * @param {string} section — one of KNOWN_SECTIONS
 * @param {string} depth — one of KNOWN_DEPTHS
 * @returns {string[]|string|null} — field list, '*' for all fields, [] for suppressed, null if unknown
 */
function getProjectionFields(section, depth) {
  const depthSpec = PROJECTION_DEPTHS[depth];
  if (!depthSpec) return null;
  const fields = depthSpec[section];
  return fields !== undefined ? fields : null;
}

/**
 * Check whether a section is suppressed at a given depth.
 * A section is suppressed when its field list is an empty array.
 *
 * @param {string} section — one of KNOWN_SECTIONS
 * @param {string} depth — one of KNOWN_DEPTHS
 * @returns {boolean}
 */
function isSectionSuppressed(section, depth) {
  const fields = getProjectionFields(section, depth);
  return Array.isArray(fields) && fields.length === 0;
}

/**
 * Check whether a section exposes all fields at a given depth (wildcard).
 *
 * @param {string} section — one of KNOWN_SECTIONS
 * @param {string} depth — one of KNOWN_DEPTHS
 * @returns {boolean}
 */
function isSectionFullExposure(section, depth) {
  return getProjectionFields(section, depth) === '*';
}

/**
 * Apply projection depth filtering to a source object.
 * Returns a new object containing only the allowed fields,
 * or the original object if depth is '*', or null if suppressed.
 *
 * @param {string} section — one of KNOWN_SECTIONS
 * @param {string} depth — one of KNOWN_DEPTHS
 * @param {object} source — the source object to project
 * @returns {object|null}
 */
function projectSection(section, depth, source) {
  if (!source) return null;
  const fields = getProjectionFields(section, depth);
  if (fields === null) return null;
  if (fields === '*') return source;
  if (Array.isArray(fields) && fields.length === 0) return null;
  const projected = {};
  for (const field of fields) {
    if (field in source) {
      projected[field] = source[field];
    }
  }
  return projected;
}

/**
 * Retrieve the executive field count for a section.
 * Returns null for wildcard or suppressed sections.
 *
 * @param {string} section — one of KNOWN_SECTIONS
 * @returns {number|null}
 */
function getExecutiveFieldCount(section) {
  const fields = PROJECTION_DEPTHS.EXECUTIVE[section];
  if (!fields || fields === '*') return null;
  return fields.length;
}

/**
 * Validate that all known sections are assigned in all depths.
 *
 * @returns {{ valid: boolean, depths: object }}
 */
function validateSectionCoverage() {
  const result = { valid: true, depths: {} };
  for (const depth of KNOWN_DEPTHS) {
    const spec = PROJECTION_DEPTHS[depth];
    const assigned = new Set();
    for (const section of Object.keys(spec)) {
      assigned.add(section);
    }
    const missing = KNOWN_SECTIONS.filter(s => !assigned.has(s));
    const unknown = [...assigned].filter(s => !KNOWN_SECTIONS.includes(s));
    const depthResult = {
      assigned: assigned.size,
      total: KNOWN_SECTIONS.length,
      complete: missing.length === 0 && unknown.length === 0,
      missing,
      unknown,
    };
    result.depths[depth] = depthResult;
    if (!depthResult.complete) result.valid = false;
  }
  return result;
}

/**
 * Get a summary of executive projection compression per section.
 *
 * @returns {Array<{ section: string, total_fields: number|null, executive_fields: number|string, compression: string }>}
 */
function getCompressionSummary() {
  return KNOWN_SECTIONS.map(section => {
    const meta = SECTION_METADATA[section];
    const execFields = PROJECTION_DEPTHS.EXECUTIVE[section];
    let executive_fields, compression;
    if (execFields === '*') {
      executive_fields = 'all';
      compression = 'none';
    } else if (Array.isArray(execFields) && execFields.length === 0) {
      executive_fields = 0;
      compression = 'suppressed';
    } else if (Array.isArray(execFields)) {
      executive_fields = execFields.length;
      if (meta.total_fields) {
        compression = Math.round((1 - execFields.length / meta.total_fields) * 100) + '%';
      } else {
        compression = 'unknown_total';
      }
    } else {
      executive_fields = 'unknown';
      compression = 'unknown';
    }
    return {
      section,
      total_fields: meta ? meta.total_fields : null,
      executive_fields,
      compression,
    };
  });
}

module.exports = {
  KNOWN_SECTIONS,
  KNOWN_DEPTHS,
  PROJECTION_DEPTHS,
  SECTION_METADATA,
  getProjectionFields,
  isSectionSuppressed,
  isSectionFullExposure,
  projectSection,
  getExecutiveFieldCount,
  validateSectionCoverage,
  getCompressionSummary,
};

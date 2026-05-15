'use strict';

/**
 * SeverityHierarchyResolver
 * PI.LENS.V2.PHASE3.SEVERITY-HIERARCHY-RESOLVER.01
 *
 * Deterministic severity-classification primitive for LENS v2.
 * Maps existing substrate/binding state to zone-level severity.
 *
 * Severity levels:
 *   CRITICAL   — blocking condition, immediate awareness required
 *   ELEVATED   — notable non-blocking condition, awareness warranted
 *   AMBIENT    — informational, no escalation required
 *   SUPPRESSED — no relevant data or intentionally omitted
 *
 * This module is a pure resolver. Same input always produces
 * same severity map. No filesystem, network, API, AI, or
 * runtime global access.
 */

const { KNOWN_ZONES, getZoneTier } = require('./DisclosureSequencingContract');

const SEVERITY_LEVELS = ['CRITICAL', 'ELEVATED', 'AMBIENT', 'SUPPRESSED'];

const SEVERITY_PRECEDENCE = { CRITICAL: 0, ELEVATED: 1, AMBIENT: 2, SUPPRESSED: 3 };

const ZONE_SEVERITY_RULES = {
  DeclarationZone: {
    inputs: ['renderState'],
    critical: 'renderState is BLOCKED or absent',
    elevated: null,
    ambient: 'all other render states',
    suppressed: 'never (persona-level suppression only)',
  },
  GovernanceRibbon: {
    inputs: ['substrateBinding.trustPosture', 'qualifierClass', 'substrateBinding.debtVisibility'],
    critical: 'trust level is NONE or absent',
    elevated: 'Q-02/Q-03 qualifier class or blocking debt present',
    ambient: 'trust posture acceptable, no blocking conditions',
    suppressed: 'persona-level suppression only',
  },
  QualifierMandate: {
    inputs: ['qualifierClass', 'qualifierVisible', 'substrateBinding.debtVisibility'],
    critical: 'Q-03 qualifier with blocking debt',
    elevated: 'Q-02 or Q-03 qualifier present',
    ambient: 'qualifier visible but not Q-02/Q-03',
    suppressed: 'qualifier not visible for current state',
  },
  SemanticTrustPostureZone: {
    inputs: ['substrateBinding.trustPosture', 'substrateBinding.debtVisibility'],
    critical: 'trust level absent/NONE, or HYDRATED with blocking debt',
    elevated: 'trust level HYDRATED or PARTIAL',
    ambient: 'trust level RECONCILED or above',
    suppressed: 'substrate binding unavailable',
  },
  ReconciliationAwarenessZone: {
    inputs: ['reconciliationAwareness.posture'],
    critical: 'reconciliation posture INSUFFICIENT',
    elevated: 'reconciliation posture WEAK or MODERATE',
    ambient: 'reconciliation posture STRONG',
    suppressed: 'reconciliation awareness unavailable',
  },
  IntelligenceField: {
    inputs: ['renderState'],
    critical: 'renderState is BLOCKED',
    elevated: null,
    ambient: 'all other states',
    suppressed: 'persona-level suppression only',
  },
  EvidenceDepthLayer: {
    inputs: ['densityClass', 'boardroomMode', 'evidenceAvailable', 'substrateBinding.evidenceVisibility'],
    critical: 'evidence present but integrity check failed (all_valid false)',
    elevated: 'evidence has rejected or quarantined items',
    ambient: 'evidence available with full integrity',
    suppressed: 'outside investigation context or no evidence data',
  },
};

/**
 * Resolve the active persona from density class and boardroom toggle.
 *
 * @param {string} densityClass
 * @param {boolean} boardroomMode
 * @returns {string}
 */
function resolvePersona(densityClass, boardroomMode) {
  if (boardroomMode) return 'BOARDROOM';
  return densityClass || 'EXECUTIVE_BALANCED';
}

/**
 * Classify a single zone's severity.
 *
 * @param {string} zone
 * @param {object} input — resolver input shape
 * @param {string} persona — resolved persona
 * @returns {string} — one of SEVERITY_LEVELS
 */
function classifyZone(zone, input, persona) {
  var tier = getZoneTier(zone, persona);
  if (tier === 'suppressed') return 'SUPPRESSED';

  switch (zone) {
    case 'DeclarationZone': return classifyDeclarationZone(input);
    case 'GovernanceRibbon': return classifyGovernanceRibbon(input);
    case 'QualifierMandate': return classifyQualifierMandate(input);
    case 'SemanticTrustPostureZone': return classifySemanticTrustPostureZone(input);
    case 'ReconciliationAwarenessZone': return classifyReconciliationAwarenessZone(input);
    case 'IntelligenceField': return classifyIntelligenceField(input);
    case 'EvidenceDepthLayer': return classifyEvidenceDepthLayer(input);
    default: return 'AMBIENT';
  }
}

function classifyDeclarationZone(input) {
  if (!input.renderState || input.renderState === 'BLOCKED') return 'CRITICAL';
  return 'AMBIENT';
}

function classifyGovernanceRibbon(input) {
  var tp = input.substrateBinding && input.substrateBinding.trustPosture;
  if (!tp || tp.level === 'NONE') return 'CRITICAL';
  var qc = input.qualifierClass || tp.q_class;
  if (qc === 'Q-03' || qc === 'Q-02') return 'ELEVATED';
  var dv = input.substrateBinding && input.substrateBinding.debtVisibility;
  if (dv && dv.has_blocking_debt) return 'ELEVATED';
  return 'AMBIENT';
}

function classifyQualifierMandate(input) {
  if (!input.qualifierVisible) return 'SUPPRESSED';
  var qc = input.qualifierClass;
  if (qc === 'Q-03') {
    var dv = input.substrateBinding && input.substrateBinding.debtVisibility;
    if (dv && dv.has_blocking_debt) return 'CRITICAL';
    return 'ELEVATED';
  }
  if (qc === 'Q-02') return 'ELEVATED';
  return 'AMBIENT';
}

function classifySemanticTrustPostureZone(input) {
  var sb = input.substrateBinding;
  if (!sb || !sb.available) return 'SUPPRESSED';
  var tp = sb.trustPosture;
  if (!tp || tp.level === 'NONE') return 'CRITICAL';
  var hasBlockingDebt = sb.debtVisibility && sb.debtVisibility.has_blocking_debt;
  if (tp.level === 'HYDRATED' && hasBlockingDebt) return 'CRITICAL';
  if (tp.level === 'HYDRATED' || tp.level === 'PARTIAL') return 'ELEVATED';
  return 'AMBIENT';
}

function classifyReconciliationAwarenessZone(input) {
  var ra = input.reconciliationAwareness;
  if (!ra || !ra.available) return 'SUPPRESSED';
  var posture = ra.posture;
  if (!posture) return 'CRITICAL';
  if (posture.tier === 'INSUFFICIENT') return 'CRITICAL';
  if (posture.tier === 'WEAK' || posture.tier === 'MODERATE') return 'ELEVATED';
  return 'AMBIENT';
}

function classifyIntelligenceField(input) {
  if (input.renderState === 'BLOCKED') return 'CRITICAL';
  return 'AMBIENT';
}

function classifyEvidenceDepthLayer(input) {
  if (input.densityClass !== 'INVESTIGATION_DENSE' || input.boardroomMode) return 'SUPPRESSED';
  if (!input.evidenceAvailable) return 'SUPPRESSED';
  var sb = input.substrateBinding;
  if (sb && sb.evidenceVisibility) {
    if (!sb.evidenceVisibility.all_valid) return 'CRITICAL';
    if (sb.evidenceVisibility.rejected > 0 || sb.evidenceVisibility.quarantined > 0) return 'ELEVATED';
  }
  return 'AMBIENT';
}

/**
 * Resolve zone-level severity for all known LENS v2 zones.
 *
 * Pure function. Same input always produces same output.
 *
 * @param {object} input
 * @param {string}  input.renderState — 'BLOCKED', 'EXECUTIVE_READY', etc. (or null)
 * @param {object}  input.substrateBinding — from buildLensSubstrateBinding (or null)
 * @param {object}  input.reconciliationAwareness — from buildReconciliationAwareness (or null)
 * @param {string}  input.qualifierClass — 'Q-01', 'Q-02', 'Q-03' (or null)
 * @param {boolean} input.qualifierVisible — qualifier mandate visibility
 * @param {boolean} input.evidenceAvailable — are evidence blocks present?
 * @param {boolean} input.topologyAvailable — is topology data present?
 * @param {string}  input.densityClass — 'EXECUTIVE_BALANCED', 'EXECUTIVE_DENSE', etc.
 * @param {boolean} input.boardroomMode — boardroom toggle state
 * @returns {{ zones: object, persona: string, timestamp: null }}
 */
function resolveZoneSeverity(input) {
  var safeInput = input || {};
  var persona = resolvePersona(safeInput.densityClass, safeInput.boardroomMode);
  var zones = {};
  for (var i = 0; i < KNOWN_ZONES.length; i++) {
    zones[KNOWN_ZONES[i]] = classifyZone(KNOWN_ZONES[i], safeInput, persona);
  }
  return { zones: zones, persona: persona, timestamp: null };
}

/**
 * Get severity precedence rank (lower = higher severity).
 *
 * @param {string} level — one of SEVERITY_LEVELS
 * @returns {number} — 0 (CRITICAL) to 3 (SUPPRESSED), -1 if unknown
 */
function getSeverityPrecedence(level) {
  return SEVERITY_PRECEDENCE[level] !== undefined ? SEVERITY_PRECEDENCE[level] : -1;
}

/**
 * Compare two severity levels. Returns true if a is higher severity than b.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function isHigherSeverity(a, b) {
  return getSeverityPrecedence(a) < getSeverityPrecedence(b);
}

/**
 * Get the highest severity level across a severity map.
 *
 * @param {object} severityMap — zone → severity level
 * @returns {string} — highest severity found
 */
function getHighestSeverity(severityMap) {
  var highest = 'SUPPRESSED';
  var keys = Object.keys(severityMap);
  for (var i = 0; i < keys.length; i++) {
    if (isHigherSeverity(severityMap[keys[i]], highest)) {
      highest = severityMap[keys[i]];
    }
  }
  return highest;
}

/**
 * Get all zones at a given severity level.
 *
 * @param {object} severityMap — zone → severity level
 * @param {string} level — one of SEVERITY_LEVELS
 * @returns {string[]}
 */
function getZonesBySeverity(severityMap, level) {
  return Object.keys(severityMap).filter(function(z) {
    return severityMap[z] === level;
  });
}

/**
 * Validate that all known zones have severity rules defined.
 *
 * @returns {{ valid: boolean, zones: object }}
 */
function validateSeverityCoverage() {
  var result = { valid: true, zones: {} };
  for (var i = 0; i < KNOWN_ZONES.length; i++) {
    var zone = KNOWN_ZONES[i];
    var hasRule = ZONE_SEVERITY_RULES[zone] !== undefined;
    result.zones[zone] = {
      hasRule: hasRule,
      inputs: hasRule ? ZONE_SEVERITY_RULES[zone].inputs : [],
    };
    if (!hasRule) result.valid = false;
  }
  var ruleZones = Object.keys(ZONE_SEVERITY_RULES);
  var unknown = ruleZones.filter(function(z) { return KNOWN_ZONES.indexOf(z) === -1; });
  result.total = KNOWN_ZONES.length;
  result.classified = KNOWN_ZONES.filter(function(z) { return ZONE_SEVERITY_RULES[z] !== undefined; }).length;
  result.unknown = unknown;
  if (unknown.length > 0) result.valid = false;
  return result;
}

module.exports = {
  SEVERITY_LEVELS,
  SEVERITY_PRECEDENCE,
  ZONE_SEVERITY_RULES,
  resolveZoneSeverity,
  classifyZone,
  resolvePersona,
  getSeverityPrecedence,
  isHigherSeverity,
  getHighestSeverity,
  getZonesBySeverity,
  validateSeverityCoverage,
};

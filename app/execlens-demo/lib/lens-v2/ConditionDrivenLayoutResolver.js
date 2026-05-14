'use strict';

/**
 * ConditionDrivenLayoutResolver
 * PI.LENS.V2.PHASE3.CONDITION-DRIVEN-LAYOUT.01
 *
 * Combines DisclosureSequencingContract (default tiers) with
 * SeverityHierarchyResolver (zone severity) to produce
 * shell-consumable layout directives.
 *
 * CRITICAL zones are promoted to tier0.
 * SUPPRESSED zones are explicitly excluded.
 * ELEVATED and AMBIENT zones keep their default tier.
 * Escalation banner is generated when non-suppressed CRITICAL
 * zones exist.
 *
 * Pure resolver — deterministic, no side effects.
 */

const {
  KNOWN_ZONES,
  KNOWN_PERSONAS,
  getZoneTier,
  getDisclosureTiers,
} = require('./DisclosureSequencingContract');

const {
  resolveZoneSeverity,
  resolvePersona,
  SEVERITY_LEVELS,
} = require('./SeverityHierarchyResolver');

const DIRECTIVE_TYPES = ['promotion', 'suppression', 'retention'];

/**
 * Resolve layout directives for all known zones.
 *
 * @param {object} input — same shape as resolveZoneSeverity input
 * @param {object} [preResolvedSeverity] — optional pre-resolved severity result
 * @returns {{ effectiveTiers, promotions, suppressions, escalationBanner, diagnostics }}
 */
function resolveLayoutDirectives(input, preResolvedSeverity) {
  var safeInput = input || {};
  var severity = preResolvedSeverity || resolveZoneSeverity(safeInput);
  var persona = severity.persona;

  var tiers = getDisclosureTiers(persona);
  if (!tiers) {
    persona = 'EXECUTIVE_BALANCED';
    tiers = getDisclosureTiers(persona);
  }

  var severityMap = severity.zones;
  var effectiveTiers = {};
  var promotions = [];
  var suppressions = [];

  for (var i = 0; i < KNOWN_ZONES.length; i++) {
    var zone = KNOWN_ZONES[i];
    var zoneSeverity = severityMap[zone] || 'AMBIENT';
    var defaultTier = getZoneTier(zone, persona) || 'tier0';

    if (zoneSeverity === 'SUPPRESSED' || defaultTier === 'suppressed') {
      effectiveTiers[zone] = 'suppressed';
      suppressions.push({
        zone: zone,
        reason: defaultTier === 'suppressed' ? 'persona' : 'severity',
        defaultTier: defaultTier,
      });
    } else if (zoneSeverity === 'CRITICAL' && defaultTier !== 'tier0') {
      effectiveTiers[zone] = 'tier0';
      promotions.push({
        zone: zone,
        from: defaultTier,
        to: 'tier0',
        severity: 'CRITICAL',
      });
    } else {
      effectiveTiers[zone] = defaultTier;
    }
  }

  var criticalNonSuppressed = [];
  for (var j = 0; j < KNOWN_ZONES.length; j++) {
    if (severityMap[KNOWN_ZONES[j]] === 'CRITICAL' && effectiveTiers[KNOWN_ZONES[j]] !== 'suppressed') {
      criticalNonSuppressed.push(KNOWN_ZONES[j]);
    }
  }

  var escalationBanner = {
    active: criticalNonSuppressed.length > 0,
    criticalCount: criticalNonSuppressed.length,
    zones: criticalNonSuppressed,
  };

  var diagnostics = {
    persona: persona,
    severityMap: severityMap,
    promotionCount: promotions.length,
    suppressionCount: suppressions.length,
    totalZones: KNOWN_ZONES.length,
    activeZones: KNOWN_ZONES.length - suppressions.length,
  };

  return {
    effectiveTiers: effectiveTiers,
    promotions: promotions,
    suppressions: suppressions,
    escalationBanner: escalationBanner,
    diagnostics: diagnostics,
  };
}

/**
 * Get the effective disclosure sequence after layout directives.
 * Returns zones ordered by effective tier, excluding suppressed.
 *
 * @param {object} directives — from resolveLayoutDirectives
 * @returns {Array<{ zone: string, tier: string, promoted: boolean }>}
 */
function getEffectiveSequence(directives) {
  var tierOrder = ['tier0', 'tier1', 'tier2', 'tier3'];
  var promotedZones = {};
  for (var p = 0; p < directives.promotions.length; p++) {
    promotedZones[directives.promotions[p].zone] = true;
  }
  var sequence = [];
  for (var t = 0; t < tierOrder.length; t++) {
    var tier = tierOrder[t];
    for (var i = 0; i < KNOWN_ZONES.length; i++) {
      var zone = KNOWN_ZONES[i];
      if (directives.effectiveTiers[zone] === tier) {
        sequence.push({
          zone: zone,
          tier: tier,
          promoted: !!promotedZones[zone],
        });
      }
    }
  }
  return sequence;
}

/**
 * Validate that all known zones have layout directives.
 *
 * @param {object} directives — from resolveLayoutDirectives
 * @returns {{ valid: boolean, total: number, covered: number, missing: string[] }}
 */
function validateDirectiveCoverage(directives) {
  var covered = Object.keys(directives.effectiveTiers);
  var missing = KNOWN_ZONES.filter(function(z) {
    return covered.indexOf(z) === -1;
  });
  return {
    valid: missing.length === 0,
    total: KNOWN_ZONES.length,
    covered: covered.length,
    missing: missing,
  };
}

module.exports = {
  DIRECTIVE_TYPES,
  resolveLayoutDirectives,
  getEffectiveSequence,
  validateDirectiveCoverage,
};

// ZoneComposer.js
// The composition engine. Sequences ALREADY DERIVED cognition into zones.
//
// Input contract (THREE inputs — reconciliation-corrected):
//   1. balancedProjection — from ConsequenceCompiler.forBalanced()
//   2. synthesisResult    — from SignalSynthesisEngine.synthesize() (display only)
//   3. fullReport         — supplementary topology data ONLY
//
// This module does NOT derive, compile, synthesize, or interpret.
// It sequences, frames, paces, and validates.
//
// Stream: PI.BALANCED.GOVERNED-NARRATIVE-COMPOSITION.01

import {
  projectPosture,
  projectReinforcementFlow,
  projectPrimaryStory,
  composeEpicenterFacts,
  composeTrustCalibration,
  DESCENT_PATHS,
} from './NarrativePrimitives.js'

import { validateComposition } from './OperationalVocabulary.js'

import { ZONE_DEFINITIONS, ZONE_TRANSITIONS } from './CompositionContract.js'

// ─────────────────────────────────────────────
// FULL BRIEFING COMPOSITION
//
// Consumes forBalanced() + synthesisResult + fullReport
// Returns governed 5-zone briefing with evidence lineage
// ─────────────────────────────────────────────

export function composeBriefing(balancedProjection, synthesisResult, fullReport) {
  if (!balancedProjection) {
    return { valid: false, reason: 'NO_CONSEQUENCE_PROJECTION', zones: {} }
  }
  if (!fullReport) {
    return { valid: false, reason: 'NO_REPORT', zones: {} }
  }

  const z1 = composeZone1(balancedProjection, fullReport)
  const z2 = composeZone2(balancedProjection, synthesisResult)
  const z3 = composeZone3(balancedProjection, fullReport)
  const z4 = composeZone4(fullReport)
  const z5 = composeZone5()

  const allPrimitives = [
    ...z1.primitives,
    ...z2.primitives,
    ...z3.primitives,
    ...z4.primitives,
  ]

  const allText = allPrimitives
    .map(p => p.text || p.headline || p.dynamics)
    .filter(Boolean)

  const validation = validateComposition(allText)

  return {
    valid: validation.valid,
    zones: { z1, z2, z3, z4, z5 },
    metadata: {
      primitive_count: allPrimitives.length,
      evidence_chain_count: allPrimitives.reduce(
        (sum, p) => sum + (p.evidenceChain || []).length, 0
      ),
      validation,
      zone_definitions: Object.keys(ZONE_DEFINITIONS),
      transitions: ZONE_TRANSITIONS.length,
      cognition_source: 'ConsequenceCompiler.forBalanced()',
    },
  }
}

// ─────────────────────────────────────────────
// ZONE 1 — Operational Posture
// Source: forBalanced() → posture_label, combined_synthesis
// ─────────────────────────────────────────────

function composeZone1(balancedProjection, fullReport) {
  const posture = projectPosture(balancedProjection)

  const chips = []
  const badge = fullReport.readiness_badge || {}
  if (badge.readiness_label) {
    chips.push({
      label: badge.readiness_label,
      tone: badge.color_token === 'green' ? 'qualified' : 'advisory',
    })
  }

  if (balancedProjection.posture_severity === 'CRITICAL' || balancedProjection.posture_severity === 'HIGH') {
    chips.push({ label: 'Pressure-concentrated', tone: 'pressured' })
  }

  const qualifier = fullReport.qualifier_summary || {}
  if (qualifier.qualifier_class === 'Q-03' || qualifier.qualifier_class === 'Q-02') {
    chips.push({ label: 'Advisory-bound', tone: 'advisory' })
  }

  return {
    zone: ZONE_DEFINITIONS.Z1,
    headline: posture.headline,
    dynamics: posture.dynamics,
    posture_label: posture.posture_label,
    posture_severity: posture.posture_severity,
    posture_scope: posture.posture_scope,
    consequence_count: posture.consequence_count,
    chips,
    primitives: [posture],
  }
}

// ─────────────────────────────────────────────
// ZONE 2 — Reinforcement Flow
// Source: forBalanced() → reinforcement_flow
// Conditions from synthesisResult for collapsed signal disclosure
// ─────────────────────────────────────────────

function composeZone2(balancedProjection, synthesisResult) {
  const flow = projectReinforcementFlow(balancedProjection)

  const conditions = (synthesisResult && synthesisResult.conditions) || []
  const activatedConditions = conditions.filter(c => c.severity !== 'NOMINAL')

  return {
    zone: ZONE_DEFINITIONS.Z2,
    entries: flow.entries,
    convergence: flow.convergence_detected ? flow.convergence : null,
    entry_count: flow.entry_count,
    condition_count: activatedConditions.length,
    condition_count_label: flow.entry_count > 0
      ? `${flow.entry_count} consequence dynamics reinforcing primary story`
      : 'No reinforcing dynamics detected',
    conditions_for_disclosure: activatedConditions.map(c => ({
      condition_type: c.condition_type,
      severity: c.severity,
      display_title: c.display_title || c.condition_type,
    })),
    primitives: [flow],
  }
}

// ─────────────────────────────────────────────
// ZONE 3 — Operational Epicenter
// Source: forBalanced() → primary_story (cognition)
//         fullReport → topology facts (supplementary display)
// ─────────────────────────────────────────────

function composeZone3(balancedProjection, fullReport) {
  const story = projectPrimaryStory(balancedProjection)
  const facts = composeEpicenterFacts(fullReport)

  const dpsig = fullReport.dpsig_signal_summary || {}
  const normBasis = dpsig.normalization_basis || {}

  return {
    zone: ZONE_DEFINITIONS.Z3,
    anchorName: story.anchorName || balancedProjection.primary_locus,
    subtitle: `${normBasis.max_cluster_id ? 'backend' : '—'} origin · primary pressure anchor`,
    title: story.title,
    text: story.text,
    is_combination: story.is_combination,
    combination_explanation: story.combination_explanation,
    source_conditions: story.source_conditions,
    facts: facts.facts,
    flow: {
      origin: normBasis.max_cluster_id ? 'backend' : '—',
      target: story.anchorName || balancedProjection.primary_locus,
    },
    primitives: [story, facts],
  }
}

// ─────────────────────────────────────────────
// ZONE 4 — Trust Calibration
// Source: fullReport → topology_summary (LEGITIMATE)
// ─────────────────────────────────────────────

function composeZone4(fullReport) {
  const trust = composeTrustCalibration(fullReport)

  return {
    zone: ZONE_DEFINITIONS.Z4,
    statement: trust.text,
    confirmed: trust.confirmed,
    total: trust.total,
    semanticOnly: trust.semanticOnly,
    groundingRatio: trust.groundingRatio,
    bar: {
      confirmedPercent: trust.total > 0
        ? Math.round((trust.confirmed / trust.total) * 100)
        : 0,
      confirmedLabel: `Confirmed · ${trust.confirmed} domains`,
      advisoryLabel: `Semantic projection · ${trust.semanticOnly}`,
    },
    primitives: [trust],
  }
}

// ─────────────────────────────────────────────
// ZONE 5 — Descent Paths
// ─────────────────────────────────────────────

function composeZone5() {
  return {
    zone: ZONE_DEFINITIONS.Z5,
    paths: DESCENT_PATHS,
    primitives: [],
  }
}

// ─────────────────────────────────────────────
// VALIDATION — runtime checks
// ─────────────────────────────────────────────

export function validateBriefing(briefing) {
  if (!briefing || !briefing.valid) {
    return { valid: false, reason: briefing?.reason || 'INVALID_BRIEFING' }
  }

  const checks = []

  for (const [key, zone] of Object.entries(briefing.zones)) {
    if (key === 'z5') continue
    const hasPrimitives = zone.primitives && zone.primitives.length > 0
    checks.push({
      check: `${key}_has_primitives`,
      pass: hasPrimitives,
    })
  }

  const z2 = briefing.zones.z2
  if (z2 && z2.entry_count > 0) {
    checks.push({
      check: 'z2_has_reinforcement_entries',
      pass: z2.entries && z2.entries.length > 0,
    })
  }

  const z3 = briefing.zones.z3
  checks.push({
    check: 'z3_has_anchor',
    pass: !!(z3 && z3.anchorName),
  })
  checks.push({
    check: 'z3_has_primary_story',
    pass: !!(z3 && z3.text),
  })

  const z4 = briefing.zones.z4
  checks.push({
    check: 'z4_has_statement',
    pass: !!(z4 && z4.statement),
  })

  checks.push({
    check: 'cognition_source_is_forBalanced',
    pass: briefing.metadata?.cognition_source === 'ConsequenceCompiler.forBalanced()',
  })

  const failures = checks.filter(c => !c.pass)

  return {
    valid: failures.length === 0,
    checks,
    failures,
  }
}

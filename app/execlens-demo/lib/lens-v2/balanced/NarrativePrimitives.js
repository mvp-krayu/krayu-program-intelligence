// NarrativePrimitives.js
// Projection orchestration primitives for BALANCED composition.
//
// Each primitive consumes ALREADY DERIVED cognition objects from
// ConsequenceCompiler.forBalanced() and produces governed text
// with evidence lineage.
//
// NO MEANING DERIVATION OCCURS HERE.
//
// The canonical cognition substrate is:
//   Signal → Condition → Consequence → Persona Projection
//
// This module is L4 (Projection Composition). It sequences, frames,
// and paces L3 output (forBalanced()). It does NOT fork semantic truth.
//
// Stream: PI.BALANCED.GOVERNED-NARRATIVE-COMPOSITION.01

import {
  POSTURE_HEADLINES,
  CONVERGENCE_TEMPLATES,
  TRUST_TEMPLATES,
  validateSentence,
} from './OperationalVocabulary.js'

// ─────────────────────────────────────────────
// PRIMITIVE SHAPE CONTRACT
//
// Every primitive returns:
// {
//   text: string,           — the composed sentence(s)
//   evidenceChain: [{       — what produced this
//     source: string,       — cognition object ID (forBalanced(), synthesisResult, topology_summary)
//     field: string,        — specific field consumed
//     value: any,           — the actual value
//   }],
//   primitive_id: string,   — traceable ID
//   zone: string,           — which zone this belongs to
//   authority: string,      — DETERMINISTIC
// }
// ─────────────────────────────────────────────

// ═════════════════════════════════════════════
// ZONE 1 — OPERATIONAL POSTURE
// Consumes: forBalanced() → posture_label, posture_severity, combined_synthesis
// ═════════════════════════════════════════════

export function projectPosture(balancedProjection) {
  const {
    posture_label,
    posture_severity,
    posture_scope,
    combined_synthesis,
    primary_locus,
    consequence_count,
    systemic_count,
  } = balancedProjection

  const headlineKey = mapSeverityToHeadline(posture_severity)
  const headline = POSTURE_HEADLINES[headlineKey]

  return {
    headline,
    dynamics: combined_synthesis,
    posture_label,
    posture_severity,
    posture_scope,
    primary_locus,
    consequence_count,
    systemic_count,
    evidenceChain: [
      { source: 'forBalanced()', field: 'posture_label', value: posture_label },
      { source: 'forBalanced()', field: 'posture_severity', value: posture_severity },
      { source: 'forBalanced()', field: 'posture_scope', value: posture_scope },
      { source: 'forBalanced()', field: 'combined_synthesis', value: combined_synthesis },
    ],
    primitive_id: 'POSTURE_PROJECTION',
    zone: 'Z1',
    authority: 'DETERMINISTIC',
  }
}

function mapSeverityToHeadline(severity) {
  if (severity === 'CRITICAL') return 'EXPOSED'
  if (severity === 'HIGH') return 'CONCENTRATED'
  if (severity === 'ELEVATED' || severity === 'MODERATE') return 'ELEVATED'
  return 'NOMINAL'
}

// ═════════════════════════════════════════════
// ZONE 2 — REINFORCEMENT FLOW
// Consumes: forBalanced() → reinforcement_flow, primary_story
// Convergence is READ from the already-derived relationship verbs,
// NOT re-detected from raw signals.
// ═════════════════════════════════════════════

export function projectReinforcementFlow(balancedProjection) {
  const { reinforcement_flow, primary_story, primary_locus } = balancedProjection

  if (!reinforcement_flow || reinforcement_flow.length === 0) {
    return {
      entries: [],
      convergence: null,
      convergence_detected: false,
      entry_count: 0,
      evidenceChain: [],
      primitive_id: 'REINFORCEMENT_FLOW',
      zone: 'Z2',
      authority: 'DETERMINISTIC',
    }
  }

  const entries = reinforcement_flow.map(csq => ({
    consequence_type_id: csq.consequence_type_id,
    title: csq.title,
    relationship_verb: csq.relationship_verb,
    relationship_sentence: csq.relationship_sentence,
    operational_implication: csq.operational_implication,
    severity: csq.severity,
    confidence_label: csq.confidence_label,
  }))

  const convergentVerbs = ['amplifies', 'reinforces', 'concentrates']
  const convergentCount = reinforcement_flow.filter(
    r => convergentVerbs.includes(r.relationship_verb)
  ).length
  const convergenceDetected = convergentCount > 0

  let convergence = null
  if (convergenceDetected && entries.length > 0) {
    convergence = CONVERGENCE_TEMPLATES.REINFORCING(
      entries[0].title,
      `is already structurally dominant`
    ) + ' ' + CONVERGENCE_TEMPLATES.COMPOUNDING(primary_locus)
  }

  return {
    entries,
    convergence,
    convergence_detected: convergenceDetected,
    entry_count: entries.length,
    evidenceChain: reinforcement_flow.map(r => ({
      source: 'forBalanced().reinforcement_flow',
      field: r.consequence_type_id,
      value: `${r.relationship_verb}: ${r.relationship_sentence}`,
    })),
    primitive_id: 'REINFORCEMENT_FLOW',
    zone: 'Z2',
    authority: 'DETERMINISTIC',
  }
}

// ═════════════════════════════════════════════
// ZONE 3 — OPERATIONAL EPICENTER
// Primary story: consumes forBalanced() → primary_story
// Facts: consumes fullReport topology (LEGITIMATE — structural data, not cognition)
// ═════════════════════════════════════════════

export function projectPrimaryStory(balancedProjection) {
  const { primary_story, primary_locus, consequence_count } = balancedProjection

  if (!primary_story) {
    return {
      text: null,
      anchorName: primary_locus || null,
      evidenceChain: [],
      primitive_id: 'PRIMARY_STORY',
      zone: 'Z3',
      authority: 'DETERMINISTIC',
    }
  }

  return {
    text: primary_story.operational_implication,
    title: primary_story.title,
    anchorName: primary_story.locus,
    severity: primary_story.severity,
    confidence_label: primary_story.confidence_label,
    scope: primary_story.scope,
    is_combination: primary_story.is_combination,
    combination_explanation: primary_story.combination_explanation,
    source_conditions: primary_story.source_conditions,
    evidenceChain: [
      { source: 'forBalanced().primary_story', field: 'consequence_type_id', value: primary_story.consequence_type_id },
      { source: 'forBalanced().primary_story', field: 'title', value: primary_story.title },
      { source: 'forBalanced().primary_story', field: 'operational_implication', value: primary_story.operational_implication },
      { source: 'forBalanced().primary_story', field: 'severity', value: primary_story.severity },
      ...(primary_story.source_conditions || []).map(sc => ({
        source: 'forBalanced().primary_story.source_conditions',
        field: sc.condition_type,
        value: sc.display_title,
      })),
    ],
    primitive_id: 'PRIMARY_STORY',
    zone: 'Z3',
    authority: 'DETERMINISTIC',
  }
}

// Supplementary topology facts — LEGITIMATE
// Structural node counts, domain grounding — display data, not cognition derivation.
export function composeEpicenterFacts(fullReport) {
  const dpsig = fullReport.dpsig_signal_summary || {}
  const normBasis = dpsig.normalization_basis || {}
  const signals = fullReport.signal_interpretations || []
  const topo = fullReport.topology_summary || {}

  const nodeCount = normBasis.max_cluster_node_count || 0
  const totalNodes = normBasis.total_structural_node_count || 0
  const activatedCount = signals.filter(s => s.severity !== 'NOMINAL').length
  const totalSignals = signals.length
  const criticalCount = signals.filter(s =>
    s.severity === 'CRITICAL' || s.severity === 'HIGH'
  ).length
  const backedCount = topo.structurally_backed_count || 0
  const totalDomains = topo.semantic_domain_count || 0
  const semanticOnly = topo.semantic_only_count || 0

  return {
    facts: [
      { key: 'Structural mass', value: `${nodeCount} / ${totalNodes} nodes` },
      { key: 'Signal activation', value: `${activatedCount} / ${totalSignals} signals` },
      { key: 'Critical severity', value: `${criticalCount} signals`, tone: criticalCount >= 3 ? 'critical' : null },
      { key: 'Structural origin', value: normBasis.max_cluster_id ? 'backend' : '—' },
      { key: 'Grounding', value: `${backedCount} / ${totalDomains} confirmed` },
      { key: 'Unconfirmed', value: `${semanticOnly} domains` },
    ],
    evidenceChain: [
      { source: 'dpsig_signal_summary', field: 'normalization_basis', value: normBasis },
      { source: 'topology_summary', field: 'grounding', value: `${backedCount}/${totalDomains}` },
    ],
    primitive_id: 'EPICENTER_FACTS',
    zone: 'Z3',
    authority: 'DETERMINISTIC',
  }
}

// ═════════════════════════════════════════════
// ZONE 4 — TRUST CALIBRATION
// Topology projection — LEGITIMATE
// Reads grounding ratio and qualifier from fullReport.
// Does NOT derive operational meaning or assess severity.
// ═════════════════════════════════════════════

export function composeTrustCalibration(fullReport) {
  const topo = fullReport.topology_summary || {}
  const qualifier = fullReport.qualifier_summary || {}

  const backedCount = topo.structurally_backed_count || 0
  const totalDomains = topo.semantic_domain_count || 0
  const semanticOnly = topo.semantic_only_count || 0
  const groundingRatio = topo.grounding_ratio || 0

  let text
  if (groundingRatio >= 1.0) {
    text = TRUST_TEMPLATES.FULLY_GROUNDED(totalDomains)
  } else if (groundingRatio > 0) {
    text = TRUST_TEMPLATES.ADVISORY_BOUND(backedCount, totalDomains) +
      ' Confidence in the convergence pattern is high within grounded regions. ' +
      'Outside that boundary, directionally useful but not confirmed.'
  } else {
    text = TRUST_TEMPLATES.PARTIALLY_GROUNDED(0, totalDomains)
  }

  return {
    text,
    confirmed: backedCount,
    total: totalDomains,
    semanticOnly,
    groundingRatio,
    evidenceChain: [
      { source: 'topology_summary', field: 'structurally_backed_count', value: backedCount },
      { source: 'topology_summary', field: 'semantic_domain_count', value: totalDomains },
      { source: 'topology_summary', field: 'grounding_ratio', value: groundingRatio },
      { source: 'qualifier_summary', field: 'qualifier_class', value: qualifier.qualifier_class },
    ],
    primitive_id: 'TRUST_CALIBRATION',
    zone: 'Z4',
    authority: 'DETERMINISTIC',
  }
}

// ═════════════════════════════════════════════
// ZONE 5 — DESCENT PATHS
// ═════════════════════════════════════════════

export const DESCENT_PATHS = [
  {
    target: 'DENSE',
    label: 'DENSE',
    description: 'See the topology — how signals structurally behave across the architecture.',
  },
  {
    target: 'INVESTIGATION',
    label: 'INVESTIGATION',
    description: 'Trace the derivation chain — prove every claim back to structural evidence.',
  },
]

// ═════════════════════════════════════════════
// PRIMITIVE REGISTRY
// ═════════════════════════════════════════════

export const PRIMITIVE_REGISTRY = {
  POSTURE_PROJECTION:    { zone: 'Z1', input: 'forBalanced()', compose: projectPosture },
  REINFORCEMENT_FLOW:    { zone: 'Z2', input: 'forBalanced()', compose: projectReinforcementFlow },
  PRIMARY_STORY:         { zone: 'Z3', input: 'forBalanced()', compose: projectPrimaryStory },
  EPICENTER_FACTS:       { zone: 'Z3', input: 'fullReport (topology)', compose: composeEpicenterFacts },
  TRUST_CALIBRATION:     { zone: 'Z4', input: 'fullReport (topology)', compose: composeTrustCalibration },
}

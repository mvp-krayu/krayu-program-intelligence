/**
 * renderer.js
 * GAUGE.MEANING.LAYER.PROJECTION.01
 *
 * Phrase rendering engine.
 * Maps concept_id → phrase template → resolved text.
 *
 * Rules:
 *   - All text comes from phrases.json — no string literals generated here
 *   - Placeholders resolved from live GAUGE + topology data
 *   - Audience scope fallback: requested scope → shared → cto
 *   - If no phrase found for a concept → returns null (fail-closed)
 *   - If a placeholder cannot be resolved → left as {placeholder_name}
 *
 * Governed by: GAUGE.MEANING.LAYER.BUSINESS.ONTOLOGY.01 / schema.json
 */

import phrasesData from './phrases.json'

// ---------------------------------------------------------------------------
// Placeholder value map — built from live GAUGE + topology data
// ---------------------------------------------------------------------------

function buildValueMap(gaugeData, topoData) {
  const dims  = gaugeData?.dimensions   || {}
  const score = gaugeData?.score        || {}
  const proj  = gaugeData?.projection   || {}
  const conf  = gaugeData?.confidence   || {}
  const recon = gaugeData?.reconstruction || {}
  const summ  = topoData?.summary        || {}
  const cf    = topoData?.constraint_flags || {}
  const orphans = topoData?.orphans      || []

  const d01 = dims['DIM-01'] || {}
  const d02 = dims['DIM-02'] || {}
  const d04 = dims['DIM-04'] || {}

  // Derived counts
  const unknownCount  = d04.total_count       ?? 0
  const overlapCount  = cf.overlap_count
    ?? summ.overlap_structural_edges_count    ?? 0
  const signalCount   = summ.signals_count    ?? 0
  const orphanCount   = orphans.length        ?? 0
  const unkSpaceCount = cf.unknown_space_count ?? 0
  const axisCount     = recon.axis_results
    ? Object.keys(recon.axis_results).length
    : 4
  const violationCount = recon.violations?.length
    ?? (d02.state === 'PASS' ? 0 : '—')

  return {
    // DIM-01 / coverage
    component_count:    d01.admissible_units  ?? '—',
    coverage_percent:   d01.coverage_percent  ?? '—',
    admissible_units:   d01.admissible_units  ?? '—',
    required_units:     d01.required_units    ?? '—',

    // DIM-02 / reconstruction
    validated_units:    d02.validated_units   ?? '—',
    axis_count:         axisCount,
    violation_count:    violationCount,

    // DIM-04 / unknown space (gauge)
    unknown_count:      unknownCount,
    element_plural:     unknownCount === 1 ? 'element'  : 'elements',
    record_plural:      unknownCount === 1 ? 'record'   : 'records',

    // Score
    canonical_score:    score.canonical       ?? '—',
    projected_score:    proj.value            ?? '—',
    confidence_lower:   conf.lower            ?? '—',
    confidence_upper:   conf.upper            ?? '—',

    // Topology — overlaps
    overlap_count:      overlapCount,
    component_plural:   overlapCount === 1 ? 'component'  : 'components',
    dependency_plural:  overlapCount === 1 ? 'dependency' : 'dependencies',

    // Topology — signals
    signal_count:       signalCount,
    point_plural:       signalCount === 1 ? 'point'  : 'points',
    signal_plural:      signalCount === 1 ? 'signal' : 'signals',

    // Topology — orphans
    orphan_count:       orphanCount,
    node_plural:        orphanCount === 1 ? 'node'  : 'nodes',
    have_plural:        orphanCount === 1 ? 'has'   : 'have',

    // Topology — structure
    domain_count:       summ.domain_nodes_count                     ?? '—',
    surface_count:      summ.capability_surface_nodes_count         ?? '—',
    component_topo_count: summ.component_entity_nodes_count         ?? '—',

    // Topology — unknown space
    unknown_space_count: unkSpaceCount,
    topo_record_plural:  unkSpaceCount === 1 ? 'record' : 'records',
  }
}

// ---------------------------------------------------------------------------
// Template resolution
// ---------------------------------------------------------------------------

function applyTemplate(template, valueMap) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return key in valueMap ? String(valueMap[key]) : match
  })
}

// Scope fallback order — most specific first
const SCOPE_FALLBACK = {
  ceo:    ['ceo',    'shared', 'cto'],
  cto:    ['cto',    'shared', 'ceo'],
  shared: ['shared', 'cto',    'ceo'],
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Render a phrase for a given concept_id and audience scope.
 * Returns { phraseId, conceptId, audienceScope, text, tone } or null.
 */
export function renderPhrase(conceptId, audienceScope, gaugeData, topoData) {
  const fallbacks = SCOPE_FALLBACK[audienceScope] || SCOPE_FALLBACK.shared

  for (const scope of fallbacks) {
    const phrase = phrasesData.phrases.find(
      p => p.concept_id === conceptId &&
           p.audience_scope === scope &&
           p.status === 'active'
    )
    if (!phrase) continue

    const valueMap = buildValueMap(gaugeData, topoData)
    const text = phrase.placeholders.length > 0
      ? applyTemplate(phrase.template, valueMap)
      : phrase.template

    return {
      phraseId:      phrase.phrase_id,
      conceptId,
      audienceScope: scope,
      text,
      tone:          phrase.tone,
    }
  }

  return null
}

/**
 * Render phrases for an array of concept_ids.
 * Skips concepts with no matching phrase (fail-closed).
 */
export function renderConceptPhrases(conceptIds, audienceScope, gaugeData, topoData) {
  return conceptIds
    .map(id => renderPhrase(id, audienceScope, gaugeData, topoData))
    .filter(Boolean)
}

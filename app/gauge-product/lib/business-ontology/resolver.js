/**
 * resolver.js
 * GAUGE.MEANING.LAYER.PROJECTION.01
 *
 * Deterministic concept resolution engine.
 * Evaluates concept predicates from concepts.json against live GAUGE + topology data.
 * Returns only concept_ids whose predicates evaluate to true.
 *
 * Rules:
 *   - No inference — predicate evaluation only
 *   - No fallback guessing — undefined field → concept does not match
 *   - All predicate operators: ==, !=, >, <, >=, <=
 *   - Compound predicates: COND AND COND
 *
 * Governed by: GAUGE.MEANING.LAYER.BUSINESS.ONTOLOGY.01 / schema.json
 */

import conceptsData from './concepts.json'

// ---------------------------------------------------------------------------
// Field resolution — maps predicate field paths to runtime data sources
// ---------------------------------------------------------------------------

function resolveFieldValue(fieldPath, gaugeData, topoData) {
  const path  = fieldPath.trim()
  const parts = path.split('.')

  // DIM-XX.field → gaugeData.dimensions['DIM-XX'].field
  if (/^DIM-\d+$/.test(parts[0])) {
    const dimKey = parts[0]
    const sub    = parts.slice(1).join('.')
    return nestedGet(gaugeData?.dimensions?.[dimKey], sub)
  }

  // orphans.length — topology array length
  if (path === 'orphans.length') {
    return (topoData?.orphans || []).length
  }

  // Gauge-rooted paths
  if (['score', 'state', 'confidence', 'projection'].includes(parts[0])) {
    return nestedGet(gaugeData?.[parts[0]], parts.slice(1).join('.'))
  }

  // Topology-rooted paths
  if (['summary', 'constraint_flags', 'orphans'].includes(parts[0])) {
    return nestedGet(topoData?.[parts[0]], parts.slice(1).join('.'))
  }

  return undefined
}

function nestedGet(obj, path) {
  if (obj === undefined || obj === null || path === '') return obj
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

// ---------------------------------------------------------------------------
// Predicate evaluation
// ---------------------------------------------------------------------------

function evalSimpleCondition(rawCondition, gaugeData, topoData) {
  // Parse: FIELD OP VALUE (where OP ∈ ==, !=, ===, !==, >, <, >=, <=)
  const match = rawCondition.trim().match(/^(.+?)\s*(===?|!==?|>=|<=|>|<)\s*(.+)$/)
  if (!match) return false

  const [, rawField, op, rawVal] = match
  const actual = resolveFieldValue(rawField.trim(), gaugeData, topoData)

  // Undefined field → predicate does not match (fail-closed)
  if (actual === undefined) return false

  // Parse expected value
  const v = rawVal.trim()
  let expected
  if (v === 'true')  expected = true
  else if (v === 'false') expected = false
  else if ((v[0] === "'" && v.at(-1) === "'") || (v[0] === '"' && v.at(-1) === '"')) {
    expected = v.slice(1, -1)
  } else {
    const n = Number(v)
    expected = isNaN(n) ? v : n
  }

  if (op === '==' || op === '===') return actual == expected   // intentional loose eq for number/string
  if (op === '!=' || op === '!==') return actual != expected
  const a = Number(actual)
  const e = Number(expected)
  if (op === '>')  return a > e
  if (op === '<')  return a < e
  if (op === '>=') return a >= e
  if (op === '<=') return a <= e
  return false
}

function evalPredicate(predicate, gaugeData, topoData) {
  if (!predicate) return false

  // Compound AND — split on ' AND ' (uppercase, space-bounded)
  if (predicate.includes(' AND ')) {
    return predicate.split(' AND ').every(cond =>
      evalSimpleCondition(cond.trim(), gaugeData, topoData)
    )
  }

  return evalSimpleCondition(predicate, gaugeData, topoData)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Evaluate all active concepts against the provided data.
 * Returns array of concept_ids whose predicates evaluate to true.
 */
export function resolveMatchedConcepts(gaugeData, topoData) {
  if (!gaugeData && !topoData) return []

  return conceptsData.concepts
    .filter(c => c.status === 'active')
    .filter(c => evalPredicate(c.predicate, gaugeData, topoData))
    .map(c => c.concept_id)
}

/**
 * Look up a concept by ID.
 */
export function getConcept(conceptId) {
  return conceptsData.concepts.find(c => c.concept_id === conceptId) || null
}

/** Export raw concept list for use by other modules. */
export { conceptsData }

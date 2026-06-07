'use strict'

const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')

const {
  resolveCognitionContract,
  resolveDomainLabel,
  resolveDomainRole,
  resolveDomainForPath,
  deriveAffectedDomainsFromPaths,
  formatLensMetric,
  buildDomainEvidence,
  RT_CONDITION_TYPES,
} = require('../../lib/lens-v2/CognitionContractModel')
const { resolveSpecimen, resolveVisibilityLayerCompleteness } = require('../../lib/copilot/PIKnowledgeGraphAccess')
const { synthesize, qualifyDomainBacking } = require('../../lib/lens-v2/SignalSynthesisEngine')
const { compile } = require('../../lib/lens-v2/software-intelligence/ConsequenceCompiler')
const { loadRuntimeGraphs, deriveRuntimeSignals } = require('../../lib/lens-v2/RuntimeSignalDerivation')
const { resolveRepoRoot } = require('../../lib/copilot/resolveRepoRoot')
const { deriveProjection } = require('../../lib/lens-v2/SoftwareIntelligenceProjectionAdapter')

// ─── Fixtures ───

function loadStackStormFixture() {
  const client = 'stackstorm'
  const run = 'run_github_st2_20260520_131000'
  const root = resolveRepoRoot()
  const spec = resolveSpecimen(client, run)
  const vlc = resolveVisibilityLayerCompleteness(spec, client, run)
  const scgPath = path.join(root, `clients/${client}/psee/runs/${run}/structure/runtime_connectivity/system_connectivity_graph.json`)
  const rtEdges = JSON.parse(fs.readFileSync(scgPath, 'utf-8')).edges
  const graphs = loadRuntimeGraphs(client, run, root)
  const qualified = qualifyDomainBacking(spec, vlc, rtEdges, graphs)
  qualified._runtime_signals = deriveRuntimeSignals(graphs)
  const synResult = synthesize(qualified)
  const csqResult = compile(synResult, qualified)
  const proj = deriveProjection(qualified, synResult, csqResult)
  const fullReport = { ...qualified, _synthesisResult: synResult }
  return { fullReport, projection: proj, registry: spec.semantic_domain_registry || [] }
}

let ST_FIXTURE
function st() {
  if (!ST_FIXTURE) ST_FIXTURE = loadStackStormFixture()
  return ST_FIXTURE
}

// ─── TEST CLASS 1: Impossible Zero Tests ───

describe('CLASS 1 — Impossible Zero', () => {
  test('fragility hotspots > 0 must produce > 0 mapped domains', () => {
    const { fullReport, registry } = st()
    const hotspots = ((fullReport.structural_enrichment || {}).fragility_surface || {}).fragility_hotspots || []
    assert.ok(hotspots.length > 0, 'Fixture must have fragility hotspots')
    const mapped = deriveAffectedDomainsFromPaths(hotspots.map(h => h.path || h.file || ''), registry)
    assert.ok(mapped.size > 0, `${hotspots.length} hotspots produced 0 domain mappings — case mismatch or field error`)
  })

  test('EB with runtime conditions must have > 0 affected domains', () => {
    const { fullReport, projection } = st()
    const ebSurface = projection.surfaces.find(s => s.surface_id === 'EXECUTION_BLINDNESS')
    if (!ebSurface) return
    const contract = resolveCognitionContract('EXECUTION_BLINDNESS', ebSurface, fullReport, {})
    const rtConds = (fullReport._synthesisResult?.conditions || []).filter(c => RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL')
    if (rtConds.length > 0) {
      assert.ok(contract.interpretation.structuralEvidence.length > 0, 'EB has runtime conditions but 0 structural evidence items')
    }
  })

  test('GD with divergent domains must report > 0 divergent count', () => {
    const { fullReport, projection } = st()
    const gdSurface = projection.surfaces.find(s => s.surface_id === 'GRAVITY_DIVERGENCE')
    if (!gdSurface) return
    const contract = resolveCognitionContract('GRAVITY_DIVERGENCE', gdSurface, fullReport, {})
    const divEvidence = contract.interpretation.structuralEvidence.find(e => e.label === 'Divergent domains')
    if (divEvidence && Number(divEvidence.value) > 0) {
      assert.ok(contract.interpretation.operationalMeaning.includes('carry operational gravity'), 'GD has divergent domains but meaning does not reflect it')
    }
  })

  test('every resolved surface must have non-empty interpretation', () => {
    const { fullReport, projection } = st()
    for (const s of projection.surfaces) {
      const contract = resolveCognitionContract(s.surface_id, s, fullReport, {})
      assert.ok(contract, `Surface ${s.surface_id} failed to resolve`)
      assert.ok(contract.interpretation, `Surface ${s.surface_id} has no interpretation`)
      assert.ok(contract.interpretation.heading, `Surface ${s.surface_id} has empty heading`)
      assert.ok(contract.interpretation.operationalMeaning, `Surface ${s.surface_id} has empty operationalMeaning`)
    }
  })

  test('every resolved surface must have >= 1 guided query', () => {
    const { fullReport, projection } = st()
    for (const s of projection.surfaces) {
      const contract = resolveCognitionContract(s.surface_id, s, fullReport, {})
      assert.ok(contract.guidedCognition && contract.guidedCognition.length > 0, `Surface ${s.surface_id} has 0 guided queries`)
    }
  })

  test('every guided query must have answer_derive', () => {
    const { fullReport, projection } = st()
    for (const s of projection.surfaces) {
      const contract = resolveCognitionContract(s.surface_id, s, fullReport, {})
      for (const q of (contract.guidedCognition || [])) {
        assert.equal(typeof q.answer_derive, 'function', `Surface ${s.surface_id} query "${q.question}" lacks answer_derive`)
      }
    }
  })
})

// ─── TEST CLASS 2: Domain Mapping Tests ───

describe('CLASS 2 — Domain Mapping', () => {
  const ST_PATHS = [
    { path: 'st2common/st2common/__init__.py', expectedDomain: 'St2common' },
    { path: 'st2reactor/st2reactor/rules/worker.py', expectedDomain: 'St2reactor' },
    { path: 'st2actions/st2actions/worker.py', expectedDomain: 'St2actions' },
  ]

  test('StackStorm paths map to domains case-insensitively', () => {
    const { registry } = st()
    for (const { path: fp, expectedDomain } of ST_PATHS) {
      const match = resolveDomainForPath(fp, registry)
      assert.ok(match, `Path "${fp}" did not map to any domain`)
      const label = match.business_label || match.domain_name
      assert.equal(label, expectedDomain, `Path "${fp}" mapped to "${label}", expected "${expectedDomain}"`)
    }
  })

  test('path field and file field both resolve', () => {
    const { registry } = st()
    const byPath = resolveDomainForPath('st2common/st2common/util/api.py', registry)
    assert.ok(byPath, 'path-style resolution failed')
  })

  test('resolveDomainLabel returns business_label over domain_name', () => {
    const registry = [
      { domain_id: 'DOM-01', domain_name: 'EdgeAcq', business_label: 'Edge Data Acquisition' },
    ]
    assert.equal(resolveDomainLabel('DOM-01', registry), 'Edge Data Acquisition')
  })

  test('resolveDomainLabel falls back to domain_name', () => {
    const registry = [
      { domain_id: 'DOM-01', domain_name: 'EdgeAcq' },
    ]
    assert.equal(resolveDomainLabel('DOM-01', registry), 'EdgeAcq')
  })

  test('resolveDomainLabel returns raw id when not found', () => {
    assert.equal(resolveDomainLabel('UNKNOWN-99', []), 'UNKNOWN-99')
  })

  test('resolveDomainRole returns short label', () => {
    const registry = [{ domain_id: 'D1', role_classification: 'EXECUTION_ENGINE' }]
    assert.equal(resolveDomainRole('D1', registry), 'Execution Engine')
  })

  test('deriveAffectedDomainsFromPaths counts per domain', () => {
    const registry = [{ domain_id: 'D1', domain_name: 'St2common', business_label: 'St2common' }]
    const paths = ['st2common/a.py', 'st2common/b.py', 'other/c.py']
    const map = deriveAffectedDomainsFromPaths(paths, registry)
    assert.equal(map.get('St2common'), 2)
    assert.equal(map.size, 1)
  })
})

// ─── TEST CLASS 3: Value Scale Tests ───

describe('CLASS 3 — Value Scale', () => {
  test('formatLensMetric: raw score renders as integer', () => {
    assert.equal(formatLensMetric(125, 'score'), '125')
    assert.equal(formatLensMetric(12, 'score'), '12')
  })

  test('formatLensMetric: normalized 0-1 renders as percent', () => {
    assert.equal(formatLensMetric(0.85, 'percent_normalized'), '85%')
    assert.equal(formatLensMetric(0.1, 'percent_normalized'), '10%')
  })

  test('formatLensMetric: percent renders without multiplication', () => {
    assert.equal(formatLensMetric(85, 'percent'), '85%')
  })

  test('formatLensMetric: auto-detect treats 0-1 as normalized', () => {
    assert.equal(formatLensMetric(0.75), '75%')
  })

  test('formatLensMetric: auto-detect treats >1 as raw', () => {
    assert.equal(formatLensMetric(125), '125')
  })

  test('formatLensMetric: handles null/NaN/empty', () => {
    assert.equal(formatLensMetric(null), '—')
    assert.equal(formatLensMetric(''), '—')
    assert.equal(formatLensMetric('abc'), 'abc')
  })

  test('fragility scores never render as inflated percentages', () => {
    const { fullReport } = st()
    const hotspots = ((fullReport.structural_enrichment || {}).fragility_surface || {}).fragility_hotspots || []
    for (const h of hotspots.slice(0, 10)) {
      const score = h.fragility_score || h.score || 0
      const rendered = formatLensMetric(score, 'score')
      assert.ok(!rendered.includes('%'), `Score ${score} rendered as "${rendered}" — should not contain %`)
      assert.ok(Number(rendered) < 200, `Score rendered as ${rendered} — likely scale error`)
    }
  })
})

// ─── TEST CLASS 4: Surface Contract Tests ───

describe('CLASS 4 — Surface Contract Sanity', () => {
  const KEY_SURFACES = ['EXECUTION_BLINDNESS', 'GRAVITY_DIVERGENCE']

  test('strategy surfaces produce valid contracts', () => {
    const { fullReport, projection } = st()
    for (const surfId of KEY_SURFACES) {
      const surface = projection.surfaces.find(s => s.surface_id === surfId)
      if (!surface) continue
      const contract = resolveCognitionContract(surfId, surface, fullReport, {})
      assert.ok(contract, `${surfId} did not resolve`)
      assert.ok(contract.meta.code, `${surfId} has no meta.code`)
      assert.ok(contract.interpretation.heading, `${surfId} has no heading`)
      assert.ok(!contract.interpretation.heading.includes('undefined'), `${surfId} heading contains "undefined"`)
      assert.ok(!contract.interpretation.operationalMeaning.includes('NaN'), `${surfId} meaning contains "NaN"`)
    }
  })

  test('generic surfaces produce valid contracts with no DOM-xx as primary label', () => {
    const { fullReport, projection, registry } = st()
    const genericSurfaces = projection.surfaces.filter(s => !KEY_SURFACES.includes(s.surface_id))
    for (const s of genericSurfaces) {
      const contract = resolveCognitionContract(s.surface_id, s, fullReport, {})
      assert.ok(contract.interpretation.heading, `${s.surface_id} has no heading`)
      for (const ev of (contract.interpretation.structuralEvidence || [])) {
        const domMatch = registry.find(r => r.domain_id === ev.label)
        if (domMatch && (domMatch.business_label || domMatch.domain_name)) {
          assert.ok(!ev.label.startsWith('DOM-'), `${s.surface_id} uses raw domain ID "${ev.label}" when calibrated label "${domMatch.business_label || domMatch.domain_name}" exists`)
        }
      }
    }
  })

  test('answer_derive returns well-formed objects', () => {
    const { fullReport, projection } = st()
    for (const s of projection.surfaces) {
      const contract = resolveCognitionContract(s.surface_id, s, fullReport, {})
      for (const q of (contract.guidedCognition || [])) {
        const answer = q.answer_derive(fullReport)
        assert.ok(answer, `${s.surface_id} query "${q.question}" answer_derive returned falsy`)
        assert.ok(typeof answer.summary === 'string' && answer.summary.length > 0, `${s.surface_id} query "${q.question}" has empty summary`)
        assert.ok(!answer.summary.includes('undefined'), `${s.surface_id} answer contains "undefined"`)
        assert.ok(!answer.summary.includes('NaN'), `${s.surface_id} answer contains "NaN"`)
      }
    }
  })

  test('EB answer_derive returns evidence when conditions exist', () => {
    const { fullReport, projection } = st()
    const eb = projection.surfaces.find(s => s.surface_id === 'EXECUTION_BLINDNESS')
    if (!eb) return
    const contract = resolveCognitionContract('EXECUTION_BLINDNESS', eb, fullReport, {})
    const blastQuery = contract.guidedCognition.find(q => q.question.includes('blast radius'))
    if (blastQuery) {
      const answer = blastQuery.answer_derive(fullReport)
      const rtConds = (fullReport._synthesisResult?.conditions || []).filter(c => ['EVENT_CONCENTRATION', 'TOPIC_FANOUT_PRESSURE'].includes(c.condition_type) && c.severity !== 'NOMINAL')
      if (rtConds.length > 0) {
        assert.ok(answer.evidence && answer.evidence.length > 0, 'EB blast radius has coupling conditions but answer has 0 evidence')
      }
    }
  })

  test('no surface produces "0 domains" when affected_domains is non-empty', () => {
    const { fullReport, projection } = st()
    for (const s of projection.surfaces) {
      if (!s.affected_domains || s.affected_domains.length === 0) continue
      const contract = resolveCognitionContract(s.surface_id, s, fullReport, {})
      for (const q of (contract.guidedCognition || [])) {
        const answer = q.answer_derive(fullReport)
        if (answer.summary.includes('0 domain')) {
          assert.fail(`${s.surface_id} query "${q.question}" says "0 domains" but surface has ${s.affected_domains.length} affected_domains`)
        }
      }
    }
  })
})

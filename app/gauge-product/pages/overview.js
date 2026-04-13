/**
 * pages/overview.js
 * GAUGE.MEANING.LAYER.PROJECTION.01 + GAUGE.MEANING.LAYER.PROJECTION.COMPLETION.01
 * + GAUGE.MEANING.LAYER.EXECUTIVE.IMPACT.01
 * + GAUGE.MEANING.LAYER.EXECUTIVE.IMPACT.02
 *
 * Executive overview page — Gauge truth projected through Business Ontology Mapping Layer.
 * Transformed into a high-impact executive surface with 3 sections and visual hierarchy.
 *
 * Rendering pipeline:
 *   /api/gauge + /api/topology → resolver.js → matched concept_ids
 *   matched concept_ids → renderer.js → resolved phrase objects
 *   resolved phrases → MeaningSection / MeaningBlock → visible text
 *
 * Rules:
 *   - All visible text comes from phrases.json (via renderer.js)
 *   - No inline business-language strings in this file
 *   - Sections are hidden if no concepts match (fail-closed)
 *   - Traceability preserved via data-* attributes
 *   - Metadata (CONCEPT/PHRASE ids) hidden in UI, present in DOM
 *
 * Sections (executive — 3 sections, all 19 active concepts assigned):
 *   Header Band — visibility + execution state (CONCEPT-01/02, CONCEPT-06)
 *   Status Band — proven score, achievable score, domains, unknown space, overlaps
 *   A. Under Control          (CONCEPT-01, 02, 03, 07, 12, 13, 14, 15, 17)
 *   B. Structural Concentration (CONCEPT-08, 09, 10, 11, 16)
 *   C. Outside Visibility     (CONCEPT-04, 05, 06, 18, 19)
 *
 * All 19 active concepts assigned. Deferred concepts excluded by design.
 *
 * Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01 / GAUGE.MEANING.LAYER.BUSINESS.ONTOLOGY.01
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { resolveMatchedConcepts } from '../lib/business-ontology/resolver'
import { renderConceptPhrases, renderPhrase } from '../lib/business-ontology/renderer'
import MeaningSection from '../components/MeaningLayer/MeaningSection'

// ---------------------------------------------------------------------------
// Section → concept mapping (executive 3-section layout)
// All 19 active concepts distributed across 3 executive groups.
// ---------------------------------------------------------------------------

const SECTION_CONCEPTS = {
  // What is known, proven, and structurally healthy
  under_control:      ['CONCEPT-01', 'CONCEPT-02', 'CONCEPT-03', 'CONCEPT-07',
                       'CONCEPT-12', 'CONCEPT-13', 'CONCEPT-14', 'CONCEPT-15', 'CONCEPT-17'],

  // Where structural density and complexity concentrate
  concentration:      ['CONCEPT-08', 'CONCEPT-09', 'CONCEPT-10', 'CONCEPT-11', 'CONCEPT-16'],

  // What remains unmapped, unevaluated, or outside the boundary
  outside_visibility: ['CONCEPT-04', 'CONCEPT-05', 'CONCEPT-06', 'CONCEPT-18', 'CONCEPT-19'],
}

// Default audience scope
const DEFAULT_SCOPE = 'shared'

// ---------------------------------------------------------------------------
// Data hooks (same /api routes — no new endpoints)
// ---------------------------------------------------------------------------

function useGaugeData() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  useEffect(() => {
    fetch('/api/gauge')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])
  return { data, loading, error }
}

function useTopologyData() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  useEffect(() => {
    fetch('/api/topology')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])
  return { data, loading, error }
}

// ---------------------------------------------------------------------------
// Executive header — single flowing statement from matched concepts via renderer
// Uses CONCEPT-01/02 (visibility) as primary and CONCEPT-06 (execution state)
// as secondary, combined into one visual line for impact.
// All text comes from phrases.json via renderPhrase — no inline strings.
// ---------------------------------------------------------------------------

function ExecHeader({ gaugeData, topoData, matchedConcepts }) {
  // Primary: full or partial coverage statement
  const primaryId = ['CONCEPT-01', 'CONCEPT-02'].find(id => matchedConcepts.includes(id))
  const primaryPhrase = primaryId
    ? renderPhrase(primaryId, DEFAULT_SCOPE, gaugeData, topoData)
    : null

  // Secondary: execution state — combined inline for single-flow reading
  const execPhrase = matchedConcepts.includes('CONCEPT-06')
    ? renderPhrase('CONCEPT-06', DEFAULT_SCOPE, gaugeData, topoData)
    : null

  if (!primaryPhrase && !execPhrase) return null

  return (
    <div className="ei-header">
      {primaryPhrase ? (
        <p
          className="ei-header-primary"
          data-concept-id={primaryPhrase.conceptId}
          data-phrase-id={primaryPhrase.phraseId}
          data-audience={primaryPhrase.audienceScope}
        >
          {primaryPhrase.text}
          {execPhrase && (
            <span
              className="ei-header-exec"
              data-concept-id={execPhrase.conceptId}
              data-phrase-id={execPhrase.phraseId}
              data-audience={execPhrase.audienceScope}
            >
              {' '}{execPhrase.text}
            </span>
          )}
        </p>
      ) : execPhrase ? (
        <p
          className="ei-header-primary"
          data-concept-id={execPhrase.conceptId}
          data-phrase-id={execPhrase.phraseId}
          data-audience={execPhrase.audienceScope}
        >
          {execPhrase.text}
        </p>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Status band — compact metrics strip + proportional visual bar
// Derives domain count from topoData.nodes[] (same method as
// GAUGE.STANDALONE.STRUCTURAL.METRICS.DERIVATION.01). No new logic.
// Bar segment widths use flexGrow with raw counts — no normalization required.
// ---------------------------------------------------------------------------

function StatusBand({ gaugeData, topoData }) {
  const nodes    = topoData?.nodes || []
  const domCount = topoData ? nodes.filter(n => n.type === 'binding_context').length : 0
  const ovlCount = typeof topoData?.overlap_edges?.length === 'number'
    ? topoData.overlap_edges.length : 0
  const unkCount = typeof gaugeData?.dimensions?.['DIM-04']?.total_count === 'number'
    ? gaugeData.dimensions['DIM-04'].total_count : 0

  // Display values: '—' when source data is unavailable
  const domDisplay = topoData               ? domCount : '—'
  const ovlDisplay = topoData?.overlap_edges ? ovlCount : '—'
  const unkDisplay = gaugeData?.dimensions?.['DIM-04'] ? unkCount : '—'

  // Bar flex weights — minimum 1 so each segment is always visible
  const barDom = domCount > 0 ? domCount : 1
  const barOvl = ovlCount > 0 ? ovlCount : 1
  const barUnk = unkCount > 0 ? unkCount : 1

  const items = [
    { lbl: 'Proven Score',  val: gaugeData?.score?.canonical  ?? '—', hi: true },
    { lbl: 'Achievable',    val: gaugeData?.projection?.value ?? '—' },
    { lbl: 'Domains',       val: domDisplay },
    { lbl: 'Runtime Unknown', val: unkDisplay },
    { lbl: 'Cross-Domain',  val: ovlDisplay },
  ]

  return (
    <>
      <div className="ei-band">
        {items.map((m, i) => (
          <div key={i} className={`ei-band-item${m.hi ? ' ei-band-item--hi' : ''}`}>
            <div className="ei-band-val">{m.val}</div>
            <div className="ei-band-lbl">{m.lbl}</div>
          </div>
        ))}
      </div>
      <div className="ei-bar" title="Domains (green) · Cross-domain overlaps (amber) · Unknown space (red)">
        <div className="ei-bar-seg ei-bar-good" style={{ flexGrow: barDom }} />
        <div className="ei-bar-seg ei-bar-warn" style={{ flexGrow: barOvl }} />
        <div className="ei-bar-seg ei-bar-risk" style={{ flexGrow: barUnk }} />
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Overview page
// ---------------------------------------------------------------------------

export default function OverviewPage() {
  const { data: gaugeData, loading: gaugeLoading, error: gaugeError } = useGaugeData()
  const { data: topoData,  loading: topoLoading,  error: topoError  } = useTopologyData()

  const [matchedConcepts, setMatchedConcepts] = useState([])

  // Run resolution after both data sources settle
  useEffect(() => {
    if (gaugeLoading || topoLoading) return
    const matched = resolveMatchedConcepts(gaugeData, topoData)
    setMatchedConcepts(matched)
  }, [gaugeData, topoData, gaugeLoading, topoLoading])

  const isLoading = gaugeLoading || topoLoading
  const gaugeErr  = gaugeError  || null
  const topoErr   = topoError   || null

  // Build section phrases from matched concepts
  function getSectionPhrases(sectionKey) {
    const conceptIds = SECTION_CONCEPTS[sectionKey]
    const active     = matchedConcepts.filter(id => conceptIds.includes(id))
    return renderConceptPhrases(active, DEFAULT_SCOPE, gaugeData, topoData)
  }

  return (
    <div className="outer">

      {/* ── HEADER BAR ── */}
      <div className="ov-header-bar">
        <div className="ov-header-identity">
          <div className="ov-header-title">System Overview</div>
          <div className="ov-header-sub">run_01 · gauge-v2-product · PSEE.BLUEEDGE.GAUGE.HANDOFF.01</div>
        </div>
        <div className="ov-nav-links">
          <Link href="/"         className="ov-nav-link">Detailed Gauge &#x2192;</Link>
          <Link href="/topology" className="ov-nav-link">Structural Topology &#x2192;</Link>
        </div>
      </div>

      {/* ── EXECUTIVE HEADER ── */}
      {!isLoading && (
        <ExecHeader
          gaugeData={gaugeData}
          topoData={topoData}
          matchedConcepts={matchedConcepts}
        />
      )}

      {/* ── STATUS BAND ── */}
      {!isLoading && (
        <StatusBand gaugeData={gaugeData} topoData={topoData} />
      )}

      {/* ── EXECUTIVE SECTIONS ── */}
      <div className="ei-sections">

        {/* A — What is structurally sound */}
        <div className="ei-section ei-section--good">
          <MeaningSection
            title="What is structurally sound"
            sectionKey="under_control"
            phrases={getSectionPhrases('under_control')}
            loading={isLoading}
            error={gaugeErr}
          />
        </div>

        {/* B — Where complexity concentrates */}
        <div className="ei-section ei-section--warn">
          <MeaningSection
            title="Where complexity concentrates"
            sectionKey="concentration"
            phrases={getSectionPhrases('concentration')}
            loading={isLoading}
            error={topoErr}
          />
        </div>

        {/* C — What remains outside control */}
        <div className="ei-section ei-section--risk">
          <MeaningSection
            title="What remains outside control"
            sectionKey="outside_visibility"
            phrases={getSectionPhrases('outside_visibility')}
            loading={isLoading}
            error={gaugeErr}
          />
        </div>

      </div>{/* /ei-sections */}

      {/* ── SOURCE ATTRIBUTION ── */}
      <div className="ov-source-note">
        <span>Source: gauge_state.json · binding_envelope.json</span>
        <span>Ontology: GAUGE.MEANING.LAYER.BUSINESS.ONTOLOGY.01</span>
        <span>Language: phrases.json</span>
      </div>

    </div>
  )
}

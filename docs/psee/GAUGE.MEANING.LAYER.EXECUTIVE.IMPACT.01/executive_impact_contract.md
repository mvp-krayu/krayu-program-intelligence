# GAUGE.MEANING.LAYER.EXECUTIVE.IMPACT.01 — Contract

## Contract Identity

- ID: GAUGE.MEANING.LAYER.EXECUTIVE.IMPACT.01
- Type: EXECUTIVE PROJECTION REFINEMENT
- Mode: CONFIG-DRIVEN ONLY
- Branch: wip/gauge-psee-hygiene-snapshot
- Date: 2026-04-13

---

## Purpose

Transform the executive overview page from a flat 8-section ontology phrase grid into a
high-impact executive surface. Surfaces system state immediately. Anchors meaning in real
system structure. Introduces visual hierarchy. Preserves full traceability underneath.

**This is a projection refinement using existing truth. No data, semantic, or upstream changes.**

---

## Prior State (GAUGE.MEANING.LAYER.PROJECTION.COMPLETION.01)

8 sections across a 2-column grid:
- System Visibility (CONCEPT-01, 02, 17)
- Structural Integrity (CONCEPT-03, 18, 07, 14)
- Unmapped Elements (CONCEPT-04, 05, 19)
- Runtime Validation (CONCEPT-06)
- Structural Concentration (CONCEPT-08, 09)
- Observed Signals (CONCEPT-10, 11)
- Unclassified Elements (CONCEPT-16)
- Plus ScoreContextBar (CONCEPT-12, 15, 13)

---

## Changes Made

### Change 1 — Collapse sections from 8 to 3 (SECTION_CONCEPTS)

```js
// Before (7 section keys + HEADER_CONCEPTS)
const SECTION_CONCEPTS = {
  visibility, integrity, unmapped, runtime,
  concentration, signals, unclassified
}
const HEADER_CONCEPTS = ['CONCEPT-12', 'CONCEPT-15', 'CONCEPT-13']

// After (3 section keys, no HEADER_CONCEPTS)
const SECTION_CONCEPTS = {
  under_control:      ['CONCEPT-01', 'CONCEPT-02', 'CONCEPT-03', 'CONCEPT-07',
                       'CONCEPT-12', 'CONCEPT-13', 'CONCEPT-14', 'CONCEPT-15', 'CONCEPT-17'],
  concentration:      ['CONCEPT-08', 'CONCEPT-09', 'CONCEPT-10', 'CONCEPT-11', 'CONCEPT-16'],
  outside_visibility: ['CONCEPT-04', 'CONCEPT-05', 'CONCEPT-06', 'CONCEPT-18', 'CONCEPT-19'],
}
```

No concept lost. All 19 active concepts reassigned to exactly one of the 3 sections.

### Change 2 — Replace ScoreContextBar with ExecHeader + StatusBand

**ScoreContextBar removed.**

**ExecHeader** (new):
- Uses `renderPhrase` for CONCEPT-01/CONCEPT-02 (visibility, from phrases.json)
- Uses `renderPhrase` for CONCEPT-06 (execution state, from phrases.json)
- All text config-driven via renderer.js
- Traceability preserved via data-* attributes

**StatusBand** (new):
- 5 metrics: Proven Score, Achievable Score, Domains, Unknown Space, Cross-Domain overlaps
- Domain count derived from `topoData.nodes.filter(n => n.type === 'binding_context').length`
- Overlap count from `topoData.overlap_edges.length`
- Unknown space from `gaugeData.dimensions['DIM-04'].total_count`
- No new computation beyond counting

### Change 3 — Replace 7 MeaningSection blocks with 3

3 sections in `.ei-sections` grid (3-column layout):
- A. Under Control — `sectionKey="under_control"`, error=gaugeErr
- B. Structural Concentration — `sectionKey="concentration"`, error=topoErr
- C. Outside Visibility — `sectionKey="outside_visibility"`, error=gaugeErr

### Change 4 — CSS appended (gauge.css append-only)

New `.ei-*` block added:
- `.ei-header` / `.ei-header-primary` / `.ei-header-exec`
- `.ei-band` / `.ei-band-item` / `.ei-band-val` / `.ei-band-lbl`
- `.ei-sections` / `.ei-section`
- `.ei-section .ml-meta { display: none }` — hides visible metadata; data-* attributes preserved
- `.ei-highlight` / `.ei-muted`

---

## Concept Redistribution Map

| Concept | Prior Section | New Section |
|---------|--------------|-------------|
| CONCEPT-01 | visibility | under_control |
| CONCEPT-02 | visibility | under_control |
| CONCEPT-03 | integrity | under_control |
| CONCEPT-04 | unmapped | outside_visibility |
| CONCEPT-05 | unmapped | outside_visibility |
| CONCEPT-06 | runtime | outside_visibility |
| CONCEPT-07 | integrity | under_control |
| CONCEPT-08 | concentration | concentration |
| CONCEPT-09 | concentration | concentration |
| CONCEPT-10 | signals | concentration |
| CONCEPT-11 | signals | concentration |
| CONCEPT-12 | header | under_control |
| CONCEPT-13 | header | under_control |
| CONCEPT-14 | integrity | under_control |
| CONCEPT-15 | header | under_control |
| CONCEPT-16 | unclassified | concentration |
| CONCEPT-17 | visibility | under_control |
| CONCEPT-18 | integrity | outside_visibility |
| CONCEPT-19 | unmapped | outside_visibility |

No concepts lost. All 19 active concepts assigned.

---

## ExecHeader Design Note

CONCEPT-17 (multi-domain) predicate depends on `summary.domain_nodes_count` which does not
exist in the current topology summary object. The resolver therefore does not match CONCEPT-17
in this run. The ExecHeader falls back to CONCEPT-01 (full visibility) as its primary phrase:
"All identifiable system components are structurally mapped."

Domain/surface counts are exposed via the StatusBand (derived directly from `nodes[]`).
This is consistent with GAUGE.STANDALONE.STRUCTURAL.METRICS.DERIVATION.01.

---

## DO NOT MODIFY Compliance

| File | Modified? |
|------|-----------|
| resolver.js | NO |
| renderer.js | NO |
| concepts.json | NO |
| phrases.json | NO |
| terms.json | NO |
| schema.json | NO |
| MeaningBlock.js | NO |
| MeaningSection.js | NO |
| pages/index.js | NO |
| pages/topology.js | NO |
| /api/topology | NO |
| /api/gauge | NO |
| ExecLens code | NO |

---

## Governance

- No new rendering primitives created
- No new phrase templates defined
- No new concept definitions
- No semantic drift: only reorganization of existing truth
- All language continues to come from phrases.json via renderer.js
- Traceability metadata hidden from view but preserved in DOM as data-* attributes
- Fail-closed: sections with no matching phrases render nothing

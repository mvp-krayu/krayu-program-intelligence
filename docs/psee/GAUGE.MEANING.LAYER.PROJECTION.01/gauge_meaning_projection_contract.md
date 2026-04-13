# GAUGE.MEANING.LAYER.PROJECTION.01 — Contract

## Contract Identity

- ID: GAUGE.MEANING.LAYER.PROJECTION.01
- Type: EXECUTIVE PROJECTION PAGE
- Mode: STRICT PROJECTION — CONFIG-DRIVEN ONLY
- Branch: wip/gauge-psee-hygiene-snapshot
- Date: 2026-04-13

---

## Purpose

Create the executive overview page that renders GAUGE truth using the Business Ontology
Mapping Layer (BOML). Provides CTO/CEO-readable meaning without introducing interpretation,
narrative, or semantic drift.

**This is a projection layer only. All language comes from config.**

---

## Rendering Pipeline

```
/api/gauge → gauge_state.json fields
/api/topology → binding_envelope.json summary/flags
         ↓
resolver.js — evaluates concept predicates → matched concept_ids[]
         ↓
renderer.js — maps concept_id → phrase template → resolved text
         ↓
MeaningSection / MeaningBlock — renders to DOM with traceability
```

---

## Files Created

| File | Description |
|------|-------------|
| `app/gauge-product/lib/business-ontology/resolver.js` | Predicate evaluation engine |
| `app/gauge-product/lib/business-ontology/renderer.js` | Phrase resolution engine |
| `app/gauge-product/components/MeaningLayer/MeaningBlock.js` | Single phrase renderer |
| `app/gauge-product/components/MeaningLayer/MeaningSection.js` | Section renderer |
| `app/gauge-product/pages/overview.js` | Executive overview page |
| `app/gauge-product/styles/gauge.css` | Appended ov-* and ml-* CSS |

---

## resolver.js

Deterministic predicate evaluator.
- Imports concepts.json directly
- Evaluates each active concept predicate against live data
- Handles: `==`, `!=`, `>`, `<`, `>=`, `<=`, compound `AND`
- Field resolution: `DIM-XX.*` → gaugeData, `score.*` / `state.*` / `confidence.*` → gaugeData, `summary.*` / `constraint_flags.*` / `orphans.*` → topoData
- Undefined field → concept does not match (fail-closed)

## renderer.js

Phrase lookup and template resolver.
- Imports phrases.json directly
- Scope fallback order: requested → shared → cto (for shared scope: shared → cto → ceo)
- Placeholder substitution via `{placeholder}` regex
- No phrase found for concept → returns null (fail-closed)

## MeaningBlock.js

- Renders one phrase `<p>` element
- Emits `data-concept-id`, `data-phrase-id`, `data-audience`, `data-tone` for traceability
- Renders traceability metadata row below phrase text

## MeaningSection.js

- Renders section title + MeaningBlock list
- Fail-closed: returns null if phrases array is empty and not loading
- Loading and error states explicit

## overview.js

Route: `/overview`

### Section Mapping

| Section | Title | Concepts |
|---------|-------|---------|
| Header | System Overview | CONCEPT-12, CONCEPT-15, CONCEPT-13 (score bar) |
| B | System Visibility | CONCEPT-01, CONCEPT-02, CONCEPT-17 |
| C | Structural Integrity | CONCEPT-03, CONCEPT-18, CONCEPT-07, CONCEPT-14 |
| D | Unmapped Elements | CONCEPT-04, CONCEPT-05, CONCEPT-19 |
| E | Runtime Validation | CONCEPT-06 |

### Navigation links

- Header: "Detailed Gauge →" → `href="/"` (main page)
- Header: "Structural Topology →" → `href="/topology"`

---

## Fail-Closed Behavior

| Condition | Behavior |
|-----------|----------|
| No concept predicate matches for section | Section hidden (returns null) |
| No phrase found for concept | Concept not rendered |
| Placeholder value undefined | Placeholder left as `{name}` in template |
| Data loading | Section shows loading state |
| API error | Section shows error state |

---

## DO NOT MODIFY Compliance

| File | Modified? |
|------|-----------|
| pages/index.js | NO |
| pages/topology.js | NO |
| components/TopologyAddon.js | NO |
| lib/business-ontology/*.json | NO |
| pages/api/topology.js | NO |
| pages/api/gauge.js | NO |

---

## Governance

- All visible text sourced from phrases.json via renderer.js
- No inline business-language strings in React/JS files
- Traceability: every phrase has data-concept-id and data-phrase-id in DOM
- Default audience scope: shared
- No ExecLens dependency introduced
- gauge.css appended (ov-* and ml-* sections only)

# GAUGE.RUNTIME.CONSUMPTION.REALIGNMENT.01 — Runtime Binding Map (As-Is)

## Map Format

`UI element → fetch hook → API route → file read → artifact → run_id`

---

## Score Panel (index.js left column)

| UI element | source type | value | legitimate binding? |
|------------|-------------|-------|---------------------|
| "Run: run_01" (L204) | HARDCODED JSX | `"run_01"` (literal) | NO — wrong run_id; actual is `run_01_authoritative` |
| "Execution Phase: PHASE_1_ACTIVE" (L205) | HARDCODED JSX | `"PHASE_1_ACTIVE"` (literal) | NO — value matches API but is not read from it |
| "Canonical Score: 60" (L213) | HARDCODED JSX | `"60"` (literal) | NO — value matches gauge_state.json.score.canonical but is not bound to it |
| "CONDITIONAL" band label (L214) | HARDCODED JSX | `"CONDITIONAL"` (literal) | NO |
| "Projected Score: 100" (L219) | HARDCODED JSX | `"100"` (literal) | NO |
| "[60 – 100]" confidence (L224) | HARDCODED JSX | `"[60 – 100]"` (literal) | NO |
| "Score Decomposition (60 = 0 + 35 + 25)" (L240) | HARDCODED JSX | `"60"`, `"0"`, `"35"`, `"25"` (literals) | NO |
| "0 / 40 pts" completion (L245) | HARDCODED JSX | `"0 / 40 pts"` (literal) | NO |
| "NOT EVALUATED — execution layer not performed" (L250) | HARDCODED JSX | literal | NO |
| "35 / 35 pts" coverage (L256) | HARDCODED JSX | `"35 / 35 pts"` (literal) | NO |
| "COMPUTED — 100% structural coverage (30/30 units)" (L261) | HARDCODED JSX | literal | NO |
| "25 / 25 pts" reconstruction (L267) | HARDCODED JSX | `"25 / 25 pts"` (literal) | NO |
| "PASS — 4-axis structural validation (30/30 units)" (L272) | HARDCODED JSX | literal | NO |

**Score panel binding chain (actual):** NONE — no API call feeds the left column score display

**Score panel binding chain (for right column only):**
```
RuntimeIntelligence / StructuralMetrics (right column)
  → useGaugeData() [GaugeContextPanels.js:26]
  → fetch('/api/gauge')
  → api/gauge.js:35 → fs.readFileSync(gauge_state.json)
  → clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json
  → run_id: run_01_authoritative
```

---

## Score Panel — Raw State Disclosure Table (index.js ~L415–L445)

| table row | value | source type | legitimate? |
|-----------|-------|-------------|-------------|
| execution_status | PHASE_1_ACTIVE | HARDCODED | NO |
| psee_engine_invoked | true | HARDCODED | NO |
| execution_mode | FULL | HARDCODED | NO |
| run_id | run_01 | HARDCODED | NO — wrong; actual is `run_01_authoritative` |
| score.stream | PSEE-RUNTIME.5 | HARDCODED | NO |
| canonical_score | 60 | HARDCODED | NO |
| band_label | CONDITIONAL | HARDCODED | NO |
| derivation | 0 + 35 + 25 = 60 | HARDCODED | NO |
| confidence_lower | 60 | HARDCODED | NO |
| confidence_upper | 100 | HARDCODED | NO |

---

## Topology Panel (index.js right column)

| UI element | source type | binding chain |
|------------|-------------|---------------|
| TopologySummaryPanel | API | `useTopologySummary()` [GaugeContextPanels.js:39] → fetch('/api/topology') → api/topology.js:46 → fs.readFileSync(binding_envelope.json) → run_335c0575a080 |
| SignalSet | API | Same |
| StructuralMetrics (topology portion) | API | Same |

**Topology panel binding chain:**
```
TopologySummaryPanel / SignalSet
  → useTopologySummary() [GaugeContextPanels.js:39]
  → fetch('/api/topology')
  → api/topology.js:46 → fs.readFileSync(binding_envelope.json)
  → validateEnvelope → buildRenderModel
  → clients/1de0d815.../psee/runs/run_335c0575a080/binding/binding_envelope.json
  → run_id: run_335c0575a080 (in envelope.metadata.run_id — NOT surfaced in render model)
```

**run_id surfaced in topology API response:** NO — `buildRenderModel` return object (envelope_adapter.js:290) does not include `run_id`.

---

## Executive Layer (overview.js)

| UI element | source type | binding chain |
|------------|-------------|---------------|
| Header sub "run_01" (L374) | HARDCODED JSX | `"run_01"` — wrong run_id; actual is `run_01_authoritative` |
| ExecutiveDecisionBlock | DERIVED from matchedConcepts | matchedConcepts ← resolveMatchedConcepts(gaugeData, topoData) ← both APIs |
| ExecHeader phrases | API → BOML | gaugeData + topoData → renderer.js → phrases.json |
| ScoreGauge visual | API | gaugeData?.score?.canonical, gaugeData?.projection?.value |
| StructuralGraph visual | API | topoData.nodes, topoData.overlap_edges, gaugeData.dimensions.DIM-04 |
| StatusBand metrics | API | gaugeData?.score?.canonical, gaugeData?.projection?.value, topoData.nodes, topoData.overlap_edges, gaugeData.dimensions.DIM-04 |
| MeaningSection blocks | API → BOML | Same |

**Overview.js data hooks:**
```
useGaugeData() [overview.js:64]    → fetch('/api/gauge')    → gauge_state.json    → run_01_authoritative
useTopologyData() [overview.js:77] → fetch('/api/topology') → binding_envelope.json → run_335c0575a080
```

---

## Violation Summary

| violation | location | type |
|-----------|----------|------|
| V1 | index.js L204: `Run: run_01` | HARDCODED + WRONG RUN_ID |
| V1 | index.js L205: `PHASE_1_ACTIVE` | HARDCODED (value coincidentally correct) |
| V1 | index.js L213–L272: score decomposition block | HARDCODED (13 distinct literal values) |
| V1 | index.js L415–L445: raw state disclosure table | HARDCODED (10+ literal values) including wrong run_id `run_01` |
| V2 | /api/gauge binding | CORRECT — no violation |
| V3 | /api/topology binding | CORRECT — no violation |
| V4 | /api/topology render model | OMITS run_id — envelope.metadata.run_id not surfaced |
| V4 | index.js L419: run_id display | WRONG VALUE — `run_01` instead of `run_01_authoritative` |
| V5 | overview.js L374 header sub | HARDCODED `run_01` — wrong, not API-read |
| V5 | index.js left column | NO API CONSUMPTION — entirely hardcoded |

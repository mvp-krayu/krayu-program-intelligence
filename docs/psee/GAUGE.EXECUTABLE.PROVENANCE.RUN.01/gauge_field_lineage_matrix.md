# GAUGE.EXECUTABLE.PROVENANCE.RUN.01 — Gauge Field Lineage Matrix

## Score Cluster (Mandatory)

| gauge_field | rendered_in | immediate_source | source_type | upstream_artifact_or_constant | origin_status | lineage_summary | verdict |
|-------------|-------------|-----------------|-------------|-------------------------------|---------------|-----------------|---------|
| Canonical Score = 60 | index.js L213 (top bar) | HARDCODED JSX string `"60"` | HARDCODED_IN_CODE | None — literal | NOT_PROVEN | Value matches gauge_state.json.score.canonical but is not read from it | HARDCODED |
| Canonical Score = 60 | index.js L427 (Operator Mode table) | HARDCODED JSX string `"60"` | HARDCODED_IN_CODE | None | NOT_PROVEN | Duplicate of same hardcoded value | HARDCODED |
| Canonical Score display | overview.js StatusBand | gaugeData?.score?.canonical | API_PROVIDED | /api/gauge → gauge_state.json.score.canonical | STATIC_REFERENCE_ONLY | API → fs.readFileSync → committed JSON | STATIC REFERENCE ONLY |
| Canonical Score display | overview.js ScoreGauge | gaugeData?.score?.canonical | API_PROVIDED | /api/gauge → gauge_state.json.score.canonical | STATIC_REFERENCE_ONLY | Same as above | STATIC REFERENCE ONLY |
| Projected Score = 100 | index.js L219 (top bar) | HARDCODED JSX string `"100"` | HARDCODED_IN_CODE | None | NOT_PROVEN | Matches gauge_state.json.projection.value but not read | HARDCODED |
| Projected Score display | overview.js StatusBand | gaugeData?.projection?.value | API_PROVIDED | /api/gauge → gauge_state.json.projection.value | STATIC_REFERENCE_ONLY | API → committed JSON | STATIC REFERENCE ONLY |
| Projected Score display | overview.js ScoreGauge | gaugeData?.projection?.value | API_PROVIDED | /api/gauge → gauge_state.json.projection.value | STATIC_REFERENCE_ONLY | Same | STATIC REFERENCE ONLY |
| Confidence Band [60–100] | index.js L224 (top bar) | HARDCODED JSX string `"[60 – 100]"` | HARDCODED_IN_CODE | None | NOT_PROVEN | Matches confidence fields but not read | HARDCODED |
| confidence.lower = 60 | overview.js (renderer) | gaugeData?.confidence?.lower | API_PROVIDED | /api/gauge → gauge_state.json.confidence.lower | STATIC_REFERENCE_ONLY | API → committed JSON | STATIC REFERENCE ONLY |
| confidence.upper = 100 | overview.js (renderer) | gaugeData?.confidence?.upper | API_PROVIDED | /api/gauge → gauge_state.json.confidence.upper | STATIC_REFERENCE_ONLY | Same | STATIC REFERENCE ONLY |
| CONDITIONAL band label | index.js L214 | HARDCODED JSX `"CONDITIONAL"` | HARDCODED_IN_CODE | None | NOT_PROVEN | Matches gauge_state.json.score.band_label | HARDCODED |
| execution_status | index.js L205 | HARDCODED JSX `"PHASE_1_ACTIVE"` | HARDCODED_IN_CODE | None | NOT_PROVEN | Matches gauge_state.json.state.execution_status | HARDCODED |
| execution_status (RuntimeIntelligence) | index.js right col | gaugeData.execution_status | API_PROVIDED | /api/gauge → gauge_state.json.state.execution_status | STATIC_REFERENCE_ONLY | API → committed JSON | STATIC REFERENCE ONLY |

---

## Coverage Cluster

| gauge_field | rendered_in | immediate_source | source_type | upstream_artifact_or_constant | origin_status | lineage_summary | verdict |
|-------------|-------------|-----------------|-------------|-------------------------------|---------------|-----------------|---------|
| Coverage = 35/35 pts | index.js L253–261 | HARDCODED JSX | HARDCODED_IN_CODE | None | NOT_PROVEN | Literals: 35/35, 100%, 30/30 units, COMPUTED | HARDCODED |
| DIM-01.coverage_percent | GaugeContextPanels.RuntimeIntelligence | gaugeData.dimensions['DIM-01'].coverage_percent | API_PROVIDED | /api/gauge → gauge_state.json.dimensions.DIM-01.coverage_percent (100.0) | STATIC_REFERENCE_ONLY | API → committed JSON | STATIC REFERENCE ONLY |
| DIM-01.coverage_percent | renderer.js valueMap | gaugeData.dimensions['DIM-01'].coverage_percent | API_PROVIDED | Same | STATIC_REFERENCE_ONLY | Used in phrase rendering | STATIC REFERENCE ONLY |
| DIM-01.admissible_units | overview.js / renderer | gaugeData.dimensions['DIM-01'].admissible_units | API_PROVIDED | /api/gauge → gauge_state.json.dimensions.DIM-01.admissible_units (30) | STATIC_REFERENCE_ONLY | API → committed JSON | STATIC REFERENCE ONLY |
| Coverage = COMPUTED (right col) | GaugeContextPanels.RuntimeIntelligence | gaugeData.dimensions['DIM-01'].state_label | API_PROVIDED | gauge_state.json.dimensions.DIM-01.state_label = "FULL" / state = "COMPUTED" | STATIC_REFERENCE_ONLY | "FULL" shown as state_label | STATIC REFERENCE ONLY |

---

## Reconstruction Cluster

| gauge_field | rendered_in | immediate_source | source_type | upstream_artifact_or_constant | origin_status | lineage_summary | verdict |
|-------------|-------------|-----------------|-------------|-------------------------------|---------------|-----------------|---------|
| Reconstruction PASS | index.js L270–272 | HARDCODED JSX | HARDCODED_IN_CODE | None | NOT_PROVEN | Literals: 25/25 pts, PASS, 4-axis, 30/30 units | HARDCODED |
| DIM-02.state | GaugeContextPanels.RuntimeIntelligence | gaugeData.dimensions['DIM-02'].state | API_PROVIDED | /api/gauge → gauge_state.json.dimensions.DIM-02.state = "PASS" | STATIC_REFERENCE_ONLY | API → committed JSON | STATIC REFERENCE ONLY |
| DIM-02.validated_units | GaugeContextPanels.StructuralMetrics | gaugeData.reconstruction.validated_units | API_PROVIDED | /api/gauge → reconstruction_state.json.validated_units = 30 | STATIC_REFERENCE_ONLY | API → committed JSON | STATIC REFERENCE ONLY |
| axis_count | renderer.js | Object.keys(gaugeData.reconstruction.axis_results).length | DERIVED_IN_MEMORY | reconstruction_state.json.axis_results (4 keys) | STATIC_REFERENCE_ONLY | Derived at render time from committed JSON | DERIVED_FROM_FRESH (bounded by static) |
| violations | renderer.js | gaugeData.reconstruction.violations.length | DERIVED_IN_MEMORY | reconstruction_state.json.violations = [] | STATIC_REFERENCE_ONLY | Same | DERIVED_FROM_FRESH (bounded by static) |

---

## Completion / Execution Cluster

| gauge_field | rendered_in | immediate_source | source_type | upstream_artifact_or_constant | origin_status | lineage_summary | verdict |
|-------------|-------------|-----------------|-------------|-------------------------------|---------------|-----------------|---------|
| NOT EVALUATED label | index.js L250, L284, L340–361 | HARDCODED JSX | HARDCODED_IN_CODE | None | NOT_PROVEN | Static absence messaging — no execution state artifact | HARDCODED |
| Completion = 0/40 pts | index.js L245 | HARDCODED JSX | HARDCODED_IN_CODE | None | NOT_PROVEN | No execution artifact exists | HARDCODED |
| execution_status (CONCEPT-06 basis) | overview.js resolver | gaugeData.state.execution_status via resolver.js CONCEPT-06 predicate | API_PROVIDED | gauge_state.json.state.execution_status = "PHASE_1_ACTIVE" | STATIC_REFERENCE_ONLY | CONCEPT-06 always active when PHASE_1_ACTIVE | STATIC REFERENCE ONLY |

---

## Status Labels Cluster

| gauge_field | rendered_in | immediate_source | source_type | upstream_artifact_or_constant | origin_status | lineage_summary | verdict |
|-------------|-------------|-----------------|-------------|-------------------------------|---------------|-----------------|---------|
| DIM-03 value = 100 (CLEAR) | GaugeContextPanels | gaugeData.dimensions['DIM-03'].value | API_PROVIDED | gauge_state.json.dimensions.DIM-03 | STATIC_REFERENCE_ONLY | API → committed JSON | STATIC REFERENCE ONLY |
| DIM-04 total_count = 0 (NONE) | GaugeContextPanels | gaugeData.dimensions['DIM-04'].total_count | API_PROVIDED | gauge_state.json.dimensions.DIM-04 | STATIC_REFERENCE_ONLY | Same | STATIC REFERENCE ONLY |
| DIM-05 COMPLETE | GaugeContextPanels | gaugeData.dimensions['DIM-05'].state | API_PROVIDED | gauge_state.json.dimensions.DIM-05 | STATIC_REFERENCE_ONLY | Same | STATIC REFERENCE ONLY |
| DIM-06 PASS | GaugeContextPanels | gaugeData.dimensions['DIM-06'].state | API_PROVIDED | gauge_state.json.dimensions.DIM-06 | STATIC_REFERENCE_ONLY | Same | STATIC REFERENCE ONLY |

---

## Topology Cluster

| gauge_field | rendered_in | immediate_source | source_type | upstream_artifact_or_constant | origin_status | lineage_summary | verdict |
|-------------|-------------|-----------------|-------------|-------------------------------|---------------|-----------------|---------|
| Domain count (5) | TopologySummaryPanel, StatusBand, StructuralGraph | nodes.filter(type=binding_context).length | DERIVED_IN_MEMORY | /api/topology → binding_envelope.json.nodes[].type | STATIC_REFERENCE_ONLY | Derived from committed JSON; count is deterministic | DERIVED_FROM_FRESH (bounded by static) |
| Surface count (30) | TopologySummaryPanel | nodes.filter(type=capability_surface).length | DERIVED_IN_MEMORY | Same | STATIC_REFERENCE_ONLY | Same | DERIVED_FROM_FRESH (bounded by static) |
| Component count (10) | TopologySummaryPanel | nodes.filter(type=component_entity).length | DERIVED_IN_MEMORY | Same | STATIC_REFERENCE_ONLY | Same | DERIVED_FROM_FRESH (bounded by static) |
| overlap_edges count (2) | TopologySummaryPanel, StructuralGraph | topoData.overlap_edges.length | DERIVED_IN_MEMORY | /api/topology → buildRenderModel → envelope edges filter | STATIC_REFERENCE_ONLY | Derived in memory from committed envelope | DERIVED_FROM_FRESH (bounded by static) |
| constraint_flags.unknown_space_count (3) | TopologySummaryPanel | topoData.constraint_flags.unknown_space_count | API_PROVIDED | binding_envelope.json.constraint_flags.unknown_space_count | STATIC_REFERENCE_ONLY | Passes through unchanged | STATIC REFERENCE ONLY |
| signals_count (5) | StructuralMetrics | topoData.summary.signals_count | API_PROVIDED | binding_envelope.json.summary.signals_count | STATIC_REFERENCE_ONLY | Passes through unchanged | STATIC REFERENCE ONLY |

---

## Executive / Decision Layer Cluster

| gauge_field | rendered_in | immediate_source | source_type | upstream_artifact_or_constant | origin_status | lineage_summary | verdict |
|-------------|-------------|-----------------|-------------|-------------------------------|---------------|-----------------|---------|
| STRUCTURE = STRONG/FRAGMENTED | overview.js ExecutiveDecisionBlock | matchedConcepts (CONCEPT-01, 03, 14 all present) | DERIVED_IN_MEMORY | resolver.js → gaugeData (DIM-01, DIM-02, DIM-06) → gauge_state.json | STATIC_REFERENCE_ONLY | All concept predicates evaluate from committed JSON | DERIVED_FROM_FRESH (bounded by static) |
| COMPLEXITY = RISING/LOW | overview.js ExecutiveDecisionBlock | matchedConcepts (CONCEPT-08, 09, 16 any present) | DERIVED_IN_MEMORY | resolver.js → topoData (overlap_edges, orphans) → binding_envelope.json | STATIC_REFERENCE_ONLY | Same | DERIVED_FROM_FRESH (bounded by static) |
| EXECUTION = UNKNOWN/VERIFIED | overview.js ExecutiveDecisionBlock | matchedConcepts.includes('CONCEPT-06') | DERIVED_IN_MEMORY | resolver.js → gaugeData.state.execution_status → gauge_state.json | STATIC_REFERENCE_ONLY | CONCEPT-06 predicate: state.execution_status == 'PHASE_1_ACTIVE' | DERIVED_FROM_FRESH (bounded by static) |
| Phrase text (overview sections) | overview.js MeaningSection | renderer.js → phrases.json templates + valueMap | DERIVED_IN_MEMORY | phrases.json (static config) + live gaugeData/topoData values | STATIC_REFERENCE_ONLY | Text is static; placeholder values from committed artifacts | DERIVED_FROM_FRESH (bounded by static) |

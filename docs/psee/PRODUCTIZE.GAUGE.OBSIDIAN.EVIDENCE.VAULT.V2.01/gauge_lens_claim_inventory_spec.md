# GAUGE + LENS Forensic Claim Inventory Specification
# PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01

- Version: 1.0
- Stream: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
- Date: 2026-04-15
- Locked baseline: product-gauge-authoritative-v1 (6f8c62b)
- Method: Forensic extraction from actual rendering surfaces — not from assumptions

---

## SECTION 1 — FORENSIC METHOD

Every claim in this registry was extracted from actual code paths in the rendering surfaces:
- `app/gauge-product/pages/api/gauge.js` — reads gauge_state.json + coverage_state.json + reconstruction_state.json
- `app/gauge-product/pages/api/topology.js` — reads canonical_topology.json, builds render model
- `app/gauge-product/pages/api/signals.js` — reads signal_registry.json
- `app/gauge-product/pages/index.js` — main GAUGE product page
- `app/gauge-product/pages/overview.js` — executive meaning layer
- `app/gauge-product/pages/topology.js` — dedicated topology explorer
- `app/gauge-product/components/GaugeContextPanels.js` — RuntimeIntelligence, StructuralMetrics, SignalSet, SignalAvailability, TopologySummaryPanel
- `app/gauge-product/lib/business-ontology/concepts.json` — 19 active concept predicates
- `app/gauge-product/lib/business-ontology/phrases.json` — phrase templates
- `app/gauge-product/lib/business-ontology/resolver.js` — concept resolution engine
- `app/gauge-product/lib/envelope_adapter.js` — binding_envelope.json render model
- `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json` — client-specific envelope
- `clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json` — legacy schema
- `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json` — Stream 10 schema

**No claim in this registry is invented. Every claim has a traceable source.**

---

## SECTION 2 — SURFACED VALUE INVENTORY

All values and fields directly read, derived, or rendered by GAUGE product surfaces.

### 2.1 /api/gauge Response Fields

These fields are constructed in `gauge.js` and served to all consuming pages.

| field | source path in gauge_state.json | rendered where |
|-------|--------------------------------|----------------|
| `run_id` | `.run_id` | overview.js header subtitle |
| `stream` | `.stream` | available in API; not currently displayed |
| `execution_status` | `.state.execution_status` | RuntimeIntelligence panel (DIM display); overview ExecutiveDecisionBlock |
| `state.execution_status` | `.state.execution_status` | API response state object |
| `state.execution_layer_evaluated` | `.state.execution_layer_evaluated` | Available in API; not currently rendered in UI |
| `state.execution_mode` | `.state.execution_mode` | Available in API; not currently rendered in UI |
| `state.psee_engine_invoked` | `.state.psee_engine_invoked` | Available in API; not currently rendered in UI |
| `dimensions.DIM-01.coverage_percent` | `.dimensions.DIM-01.coverage_percent` | RuntimeIntelligence: "Coverage: 100.0%"; resolver CONCEPT-01/02 |
| `dimensions.DIM-01.state_label` | `.dimensions.DIM-01.state_label` | RuntimeIntelligence DIM-01 state chip |
| `dimensions.DIM-01.required_units` | `.dimensions.DIM-01.required_units` | Available; rendered in phrase PHRASE-02-CTO |
| `dimensions.DIM-01.admissible_units` | `.dimensions.DIM-01.admissible_units` | StructuralMetrics "Validated Units"; phrase PHRASE-02-CTO |
| `dimensions.DIM-02.state` | `.dimensions.DIM-02.state` | RuntimeIntelligence DIM-02 state chip; resolver CONCEPT-03/18 |
| `dimensions.DIM-02.state_label` | `.dimensions.DIM-02.state_label` | RuntimeIntelligence state chip display |
| `dimensions.DIM-02.validated_units` | `.dimensions.DIM-02.validated_units` | RuntimeIntelligence "30/30 units"; phrase PHRASE-03-CTO |
| `dimensions.DIM-02.total_units` | `.dimensions.DIM-02.total_units` | RuntimeIntelligence "30/30 units" denominator |
| `dimensions.DIM-03.value` | `.dimensions.DIM-03.value` | RuntimeIntelligence "100" value |
| `dimensions.DIM-03.state_label` | `.dimensions.DIM-03.state_label` | RuntimeIntelligence "CLEAR" chip; resolver CONCEPT-07 |
| `dimensions.DIM-04.total_count` | `.dimensions.DIM-04.total_count` | RuntimeIntelligence "0 records"; overview StatusBand "Runtime Unknown"; resolver CONCEPT-04/05 |
| `dimensions.DIM-04.state_label` | `.dimensions.DIM-04.state_label` | RuntimeIntelligence "NONE" chip |
| `dimensions.DIM-05.state` | `.dimensions.DIM-05.state` | RuntimeIntelligence "COMPLETE" chip; resolver CONCEPT-13 |
| `dimensions.DIM-06.state` | `.dimensions.DIM-06.state` | RuntimeIntelligence "PASS" chip; resolver CONCEPT-14 |
| `score.canonical` | `.score.canonical` | overview StatusBand "Proven Score"; ScoreGauge proven chip; resolver CONCEPT-12 |
| `score.projected` | `.score.projected` | Available in Stream 10 schema; overview achievable display |
| `score.band_label` | `.score.band_label` | Score band; resolver CONCEPT-12 |
| `score.components.completion_points` | `.score.components.completion_points` | Available; resolver CONCEPT-06 predicate |
| `score.components.coverage_points` | `.score.components.coverage_points` | Available; not directly displayed in current UI |
| `score.components.reconstruction_points` | `.score.components.reconstruction_points` | Available; not directly displayed in current UI |
| `projection.value` | `.projection.value` | overview StatusBand "Achievable"; ScoreGauge achievable chip |
| `projection.rule` | `.projection.rule` | Available in API; not displayed |
| `projection.caveat` | `.projection.caveat` | Available in API; not displayed (deferred: CONCEPT-D02) |
| `confidence.lower` | `.confidence.lower` | Available in API; not directly displayed in current UI |
| `confidence.upper` | `.confidence.upper` | Available in API; not directly displayed in current UI |
| `confidence.status` | `.confidence.status` | Available in API; resolver CONCEPT-15 |
| `coverage.admissible_units` | coverage_state.json → passthrough | StructuralMetrics "Validated Units" |
| `coverage.state` | coverage_state.json | Not directly displayed |
| `reconstruction.axis_results` | reconstruction_state.json | StructuralMetrics Recon Axes count |
| `reconstruction.violations` | reconstruction_state.json | StructuralMetrics "Violations" count |

### 2.2 /api/topology Response Fields

Constructed in `topology.js` via `buildCanonicalRenderModel()` from `canonical_topology.json`.

| field | source | rendered where |
|-------|--------|----------------|
| `nodes[]` (full array, 148 nodes) | canonical_topology.json → adapter | Topology explorer (TopologyAddon); derived counts in panels |
| `nodes[].node_id` | canonical `.domain_id` / `.capability_id` / `.component_id` | Topology node secondary_label; node inspector |
| `nodes[].label` / `display_label` / `resolved_label` | canonical `domain_name` / etc. | Topology explorer node labels |
| `nodes[].secondary_label` | canonical ID | Topology inspector |
| `nodes[].type` | `binding_context` | `capability_surface` | `component_entity` | Derived counts in TopologySummaryPanel; filtering |
| `nodes[].depth` | 0|1|2 per type | Topology tree depth rendering |
| `nodes[].is_root` | true for 17 domains | Tree root detection |
| `nodes[].is_overlap_endpoint` | false (canonical model) | Overlap highlighting |
| `nodes[].signal_count` | 0 (canonical model) | Signal badge count per node |
| `nodes[].grounding` | canonical passthrough | Node metadata; not currently displayed in summary |
| `nodes[].confidence` | null (canonical model) | Node metadata; null preserved |
| `nodes[].evidence_refs` | canonical passthrough | Available; not displayed in summary |
| `nodes[].cross_domain_ref` | canonical passthrough (COMP-25 → "DOM-01") | Available; preserved as node field |
| `roots[]` | 17 domain IDs | Tree roots for topology renderer |
| `containment_tree` | domain→capabilities→components | Topology tree structure |
| `summary.nodes_count` | 148 | TopologySummaryPanel "Total nodes" |
| `summary.roots_count` | 17 | Derived |
| `summary.overlap_edges_count` | 0 | TopologySummaryPanel "Structural overlaps"; StatusBand "Cross-Domain" |
| `summary.signals_count` | 0 | TopologySummaryPanel "Envelope signals"; StructuralMetrics "Env Signals" |
| `constraint_flags.overlap_present` | false | TopologySummaryPanel OVL flag; resolver CONCEPT-08/09 |
| `constraint_flags.unknown_space_present` | false | TopologySummaryPanel USP flag; resolver CONCEPT-19 |
| `constraint_flags.unknown_space_count` | 0 | TopologySummaryPanel "Unknown space" |
| `orphans[]` | [] (canonical model) | TopologySummaryPanel (implicitly); resolver CONCEPT-16 |
| `counts.domains` / `capabilities` / `components` | canonical passthrough | Available |
| `domains[]` / `capabilities[]` / `components[]` | canonical passthrough | Full entity arrays available to UI |
| `relationships` | canonical passthrough | Available |

**Note on dual topology models:**
The canonical GAUGE product uses `canonical_topology.json` directly (17/42/89 tree model, 0 overlaps, 0 signals in envelope sense). The `binding_envelope.json` model (`app/execlens-demo/`, `envelope_adapter.js`) uses a client-specific binding model: run_335c0575a080 has 45 nodes, 62 edges, 5 signals bound to nodes, 2 overlaps, 3 unknown-space records. This is a materially richer surface — see Section 6.

### 2.3 /api/signals Response Fields

| field | source | rendered where |
|-------|--------|----------------|
| `signals[]` (full array) | signal_registry.json `.signals` | SignalAvailability panel (first 5 visible) |
| `signals[].signal_id` | signal_registry.json | SignalAvailability signal_id chip; SignalSet panel |
| `signals[].title` | signal_registry.json | SignalAvailability signal title |
| `signals[].statement` | signal_registry.json | Available; not currently displayed in GAUGE UI (full statement text) |
| `signals[].evidence_confidence` | signal_registry.json | SignalAvailability confidence chip (STRONG/MODERATE/WEAK) |
| `signals[].business_impact` | signal_registry.json | Available; not currently displayed in GAUGE UI |
| `signals[].risk` | signal_registry.json | Available; not currently displayed in GAUGE UI |
| `signals[].domain_id` / `domain_name` | signal_registry.json | Available; not currently displayed |
| `signals[].capability_id` / `capability_name` | signal_registry.json | Available; not currently displayed |
| `signals[].component_ids` / `component_names` | signal_registry.json | Available; not currently displayed |
| `signals[].confidence_rationale` | signal_registry.json | Available; not currently displayed |
| `total` | `signals.length` | SignalAvailability "N signals detected" |
| `by_confidence` | aggregated from signals | SignalAvailability confidence distribution chips |
| `mounted` | `signals.length > 0` | SignalAvailability visibility gate |
| `registry_id` | signal_registry.json | SignalAvailability source attribution |
| `run_reference` | signal_registry.json | Available |
| `contract_id` | signal_registry.json | Available |

### 2.4 Business Ontology Derived Values (overview.js)

Values derived by resolver.js from /api/gauge + /api/topology data, mapped to concepts.json predicates.

| derived value | derivation source | rendered where |
|---------------|-------------------|----------------|
| `matchedConcepts[]` | resolver evaluates 19 active predicates | drives all visible text in overview.js |
| STRUCTURE verdict (STRONG/FRAGMENTED) | CONCEPT-01 ∧ CONCEPT-03 ∧ CONCEPT-14 all active | ExecutiveDecisionBlock "STRUCTURE · STRONG" chip |
| COMPLEXITY verdict (RISING/LOW) | any of CONCEPT-08/09/16 active | ExecutiveDecisionBlock "COMPLEXITY · LOW" chip |
| EXECUTION verdict (UNKNOWN/VERIFIED) | CONCEPT-06 active? | ExecutiveDecisionBlock "EXECUTION · UNKNOWN" chip |
| Executive narrative statement | 3-clause composition from above verdicts | ExecutiveDecisionBlock statement paragraph |
| ExecHeader primary phrase | CONCEPT-01 or CONCEPT-02 phrase | Large header text on overview.js |
| ExecHeader exec phrase | CONCEPT-06 phrase | Inline with primary header |
| StatusBand: Proven Score | gaugeData.score.canonical | "60" label in status strip |
| StatusBand: Achievable | gaugeData.projection.value | "100" label in status strip |
| StatusBand: Domains | topoData.nodes.filter(type=binding_context).length | "17" label |
| StatusBand: Runtime Unknown | gaugeData.dimensions.DIM-04.total_count | "0" label |
| StatusBand: Cross-Domain | topoData.overlap_edges.length | "0" label |
| ScoreGauge: proven fill | score.canonical (60%) | Visual bar fill |
| ScoreGauge: gap fill | projection.value - score.canonical (40%) | Visual gap bar |
| Section "Under Control" phrases | CONCEPT-01/02/03/07/12/13/14/15/17 | Rendered via MeaningSection |
| Section "Concentration" phrases | CONCEPT-08/09/10/11/16 | Rendered via MeaningSection |
| Section "Outside Visibility" phrases | CONCEPT-04/05/06/18/19 | Rendered via MeaningSection |

### 2.5 Binding Envelope Values (envelope_adapter path — execlens / client-specific)

These values exist in `binding_envelope.json` for client `1de0d815-0721-58e9-bc8d-ca83e70fa903` and are the actual input to the richer topology surface when using the envelope path.

| field | authoritative value (run_335c0575a080) | significance |
|-------|----------------------------------------|-------------|
| `nodes[]` count | 45 | Client-scoped structural nodes (vs 148 canonical) |
| `edges[]` count | 62 | Structural relationships |
| `signals[]` count | 5 | Signals bound to specific nodes |
| `constraint_flags.overlap_present` | true | 2 cross-domain overlaps exist |
| `constraint_flags.overlap_count` | 2 | OVL-01 (DOM-03↔DOM-05-C), OVL-02 (DOM-04↔DOM-05-D) |
| `constraint_flags.unknown_space_present` | true | 3 unknown-space records |
| `constraint_flags.unknown_space_count` | 3 | USP-01/02/03 (backend/frontend parity unknown) |
| `metadata.source_stratum` | BINDING_MODEL (derived from L1_AUTHORITATIVE_STRUCTURE) | Lineage stratum |

**Total surfaced values enumerated: 72 distinct fields across 5 rendering surfaces.**

---

## SECTION 3 — CLAIM REGISTRY

A claim is a surfaced value or derived assertion that is or could be displayed, used in business logic, or presented as a product output. Claims are derived from the inventory above.

### CLM-01: Coverage Completeness

| field | value |
|-------|-------|
| claim_id | CLM-01 |
| claim_label | Structural Coverage Completeness |
| claim_type | metric |
| surfaced_location | RuntimeIntelligence panel (coverage_percent); CONCEPT-01/02 resolution |
| raw_source_field | `gauge_state.json → dimensions.DIM-01.coverage_percent` |
| normalized_field | `coverage_state.json → state=COMPUTED, coverage_percent=100.0` |
| authoritative_value | 100.0% (30/30 units) |
| stage_of_origin | S1 (pios emit coverage) |
| visible_in_gauge | YES |
| candidate_for_lens | YES — primary commercial claim |
| traceability | FULL — coverage_state.json → admissibility_log.json → IG.RUNTIME/run_01 |
| explanation | 30 admitted artifacts cross-referenced against the 30 required units declared in admissibility_log.json.summary.total. 27 from layer artifacts (L40_2:4 + L40_3:6 + L40_4:17) + 3 root artifacts. All 30 present. |

### CLM-02: Structural Unit Count

| field | value |
|-------|-------|
| claim_id | CLM-02 |
| claim_label | Structural Unit Count (30/30) |
| claim_type | count |
| surfaced_location | RuntimeIntelligence "30/30 units"; StructuralMetrics "Validated Units: 30" |
| raw_source_fields | `DIM-01.admissible_units`, `DIM-01.required_units`, `DIM-02.validated_units` |
| authoritative_value | 30 admitted / 30 required |
| stage_of_origin | S1 |
| visible_in_gauge | YES |
| candidate_for_lens | YES — "30 core structural elements mapped and validated" |
| traceability | FULL |
| explanation | The 30 admitted units are the specific structural artifacts that passed admissibility scoring in the IG pipeline. Each unit represents a file or artifact from the BlueEdge source that was classified, hashed, and accepted into the evidence boundary. |

### CLM-03: Reconstruction State

| field | value |
|-------|-------|
| claim_id | CLM-03 |
| claim_label | Structural Reconstruction Pass/Fail |
| claim_type | verdict |
| surfaced_location | RuntimeIntelligence DIM-02 state chip; CONCEPT-03/18 resolution |
| raw_source_field | `gauge_state.json → dimensions.DIM-02.state` |
| authoritative_value | PASS |
| stage_of_origin | S1 (pios emit reconstruction) |
| visible_in_gauge | YES |
| candidate_for_lens | YES — "structural consistency confirmed" |
| traceability | FULL |
| explanation | Reconstruction tests whether the 30 admitted structural units assemble into a coherent program representation. Four axes are tested: COMPLETENESS (all required elements present), STRUCTURAL_LINK (relationships are internally consistent), REFERENTIAL_INTEGRITY (all cross-references resolve), LAYER_CONSISTENCY (layer artifacts are mutually compatible). All four axes: PASS. Zero violations. |

### CLM-04: Reconstruction Axis Results

| field | value |
|-------|-------|
| claim_id | CLM-04 |
| claim_label | Four-Axis Reconstruction Detail |
| claim_type | verdict |
| surfaced_location | StructuralMetrics "Recon Axes: 4"; full axis_results in run_authoritative_recomputed_01 |
| raw_source_field | `reconstruction_state.json → axis_results` |
| authoritative_value | COMPLETENESS:PASS, STRUCTURAL_LINK:PASS, REFERENTIAL_INTEGRITY:PASS, LAYER_CONSISTENCY:PASS |
| stage_of_origin | S1 |
| visible_in_gauge | PARTIAL — axis count shown, individual axis results not shown in current UI |
| candidate_for_lens | YES — drill-down for CTO audience |
| traceability | FULL (recomputed run); PARTIAL (run_01_authoritative — axis_results absent in legacy schema) |
| explanation | Each axis probes a distinct structural consistency property. COMPLETENESS: presence check. STRUCTURAL_LINK: edge integrity. REFERENTIAL_INTEGRITY: ID cross-reference coherence. LAYER_CONSISTENCY: 40.2/40.3/40.4 mutual compatibility. Absent from legacy run_01_authoritative gauge_state.json — present only in recomputed schema. |

### CLM-05: Escalation Clearance

| field | value |
|-------|-------|
| claim_id | CLM-05 |
| claim_label | No Operational Escalation Conditions |
| claim_type | verdict |
| surfaced_location | RuntimeIntelligence DIM-03 "CLEAR"; CONCEPT-07 resolution |
| raw_source_field | `gauge_state.json → dimensions.DIM-03.state_label` |
| authoritative_value | CLEAR (value=100) |
| stage_of_origin | S4 derivation from S-13 terminal state invariant |
| visible_in_gauge | YES |
| candidate_for_lens | YES — "no blocking conditions found" |
| traceability | FULL |
| explanation | DIM-03 value of 100 and state_label CLEAR are invariant consequences of reaching the S-13 terminal state: the PSEE engine cannot reach S-13 if any open escalation conditions exist. This is a logical guarantee, not a measured observation. |

### CLM-06: Unknown-Space Count

| field | value |
|-------|-------|
| claim_id | CLM-06 |
| claim_label | Runtime Unknown-Space Count |
| claim_type | count |
| surfaced_location | RuntimeIntelligence DIM-04 "0 records"; StatusBand "Runtime Unknown: 0"; CONCEPT-04/05 |
| raw_source_field | `gauge_state.json → dimensions.DIM-04.total_count` |
| authoritative_value | 0 (NONE) |
| stage_of_origin | S4 derivation; caveat: "minimum observable state" per §4.5 |
| visible_in_gauge | YES |
| candidate_for_lens | YES — but with important caveat |
| traceability | PARTIAL — caveat in gauge_state.json: "us_records not available in declared input artifacts" |
| explanation | DIM-04 total_count=0 reflects the minimum observable state from static analysis. It does not claim zero unknown runtime elements — it claims zero unknown elements are observable in the current evidence basis. The binding_envelope path (client run_335c0575a080) shows 3 unknown_space records. These two measures are not contradictory — they apply to different evidence scopes. |

### CLM-07: Intake Completeness

| field | value |
|-------|-------|
| claim_id | CLM-07 |
| claim_label | Source Data Intake Complete |
| claim_type | verdict |
| surfaced_location | RuntimeIntelligence DIM-05 "COMPLETE"; CONCEPT-13 |
| raw_source_field | `gauge_state.json → dimensions.DIM-05.state` |
| authoritative_value | COMPLETE |
| stage_of_origin | S4 derivation from S-13 invariant (PSEE.1 INV-04) |
| visible_in_gauge | YES |
| candidate_for_lens | YES |
| traceability | FULL |
| explanation | COMPLETE is an invariant of S-13 terminal state. The derivation rule states: when Phase 2 completes in the PSEE engine, INV-04 guarantees all files have been assigned. This is a logical guarantee contingent on S-13 being reached. |

### CLM-08: Heuristic Compliance

| field | value |
|-------|-------|
| claim_id | CLM-08 |
| claim_label | Structural Patterns Conform |
| claim_type | verdict |
| surfaced_location | RuntimeIntelligence DIM-06 "PASS"; CONCEPT-14 (audience_scope: cto) |
| raw_source_field | `gauge_state.json → dimensions.DIM-06.state` |
| authoritative_value | PASS |
| stage_of_origin | S4 derivation from S-13 invariant |
| visible_in_gauge | YES |
| candidate_for_lens | CONDITIONAL — audience_scope=cto in concepts.json |
| traceability | FULL |
| explanation | DIM-06 PASS is invariant: the PSEE engine fires STOP-HEURISTIC if structural patterns violate expected standards, making S-13 unreachable in that case. PASS means no STOP-HEURISTIC event fired. The specific heuristic standards are operator-defined and may be too technical for direct client exposure. |

### CLM-09: Canonical Score

| field | value |
|-------|-------|
| claim_id | CLM-09 |
| claim_label | Proven Structural Score (Canonical) |
| claim_type | metric |
| surfaced_location | StatusBand "Proven Score: 60"; ScoreGauge proven chip; CONCEPT-12 |
| raw_source_field | `gauge_state.json → score.canonical` |
| derivation | `completion_points(0) + coverage_points(35) + reconstruction_points(25) = 60` |
| authoritative_value | 60 |
| stage_of_origin | S4 (pios compute gauge) |
| visible_in_gauge | YES |
| candidate_for_lens | YES — primary commercial number |
| traceability | FULL |
| explanation | The canonical score is the proven floor. It reflects what the structural evidence alone establishes. Completion_points=0 because the execution layer has not been evaluated (execution_layer_evaluated=False). Coverage_points=35 = round(100.0 × 0.35). Reconstruction_points=25 = categorical PASS award. The execution layer (when run) can award up to 40 additional points. |

### CLM-10: Projected Score

| field | value |
|-------|-------|
| claim_id | CLM-10 |
| claim_label | Achievable Score (Projected) |
| claim_type | metric |
| surfaced_location | StatusBand "Achievable: 100"; ScoreGauge achievable chip; projection.value |
| raw_source_field | `gauge_state.json → projection.value` / `score.projected` |
| derivation | `canonical(60) + COMPLETION_WEIGHT(40) = 100` |
| authoritative_value | 100 |
| stage_of_origin | S4 |
| visible_in_gauge | YES |
| candidate_for_lens | YES — "maximum score achievable if execution is run" |
| traceability | FULL |
| explanation | When execution_layer_evaluated=False, the projected score is the sum of the current canonical score plus the full COMPLETION_WEIGHT (40 points). This represents the maximum achievable score if the execution layer is subsequently evaluated and completes successfully. It is a projection, not a proven value. The score range [60, 100] is the confidence band. |

### CLM-11: Score Band Label

| field | value |
|-------|-------|
| claim_id | CLM-11 |
| claim_label | Score Band Classification (CONDITIONAL) |
| claim_type | status |
| surfaced_location | CONCEPT-12 resolution; band_label in gauge state |
| raw_source_field | `gauge_state.json → score.band_label` |
| authoritative_value | CONDITIONAL |
| stage_of_origin | S4 |
| visible_in_gauge | INDIRECT — drives CONCEPT-12 phrase resolution |
| candidate_for_lens | YES — "proven floor established, achievable ceiling defined" |
| traceability | FULL |
| explanation | CONDITIONAL means a structural floor has been proven but the execution layer has not been evaluated. The score is not fully resolved — it occupies the range [canonical, projected] = [60, 100]. Band transitions: once execution layer is evaluated, score resolves to a single canonical value and band may change. |

### CLM-12: Confidence Band

| field | value |
|-------|-------|
| claim_id | CLM-12 |
| claim_label | Score Confidence Range [60, 100] |
| claim_type | metric |
| surfaced_location | confidence.lower / confidence.upper; available in API |
| raw_source_fields | `confidence.lower`, `confidence.upper`, `confidence.status` |
| authoritative_value | lower=60, upper=100, status=SPLIT_EXECUTION_NOT_EVALUATED |
| stage_of_origin | S4 |
| visible_in_gauge | PARTIAL — available in API, not currently in main UI panels |
| candidate_for_lens | YES — premium client-facing range visualization |
| traceability | FULL |
| explanation | When execution_layer_evaluated=False, confidence status is SPLIT_EXECUTION_NOT_EVALUATED. Lower bound = canonical score (proven floor from structural evidence). Upper bound = projected score (ceiling assuming execution completes successfully). When execution is evaluated, lower=upper=single resolved score and status=COMPUTED. |

### CLM-13: Execution Status

| field | value |
|-------|-------|
| claim_id | CLM-13 |
| claim_label | Execution Layer Evaluation Status |
| claim_type | status |
| surfaced_location | RuntimeIntelligence DIM display; ExecutiveDecisionBlock EXECUTION verdict; CONCEPT-06 |
| raw_source_field | `gauge_state.json → state.execution_status` |
| authoritative_value | NOT_EVALUATED (Stream 10 schema) / PHASE_1_ACTIVE (legacy) |
| stage_of_origin | S4 |
| visible_in_gauge | YES |
| candidate_for_lens | YES — "execution layer pending" |
| traceability | FULL |
| explanation | NOT_EVALUATED means the execution engine has not yet been run against this structural model. PHASE_1_ACTIVE is the legacy pre-Stream-10 equivalent. Both mean the same operational state — execution assessment is pending. This drives the completion_points gate (0 until evaluated) and the projected vs canonical score split. |

### CLM-14: Topology Domain Count

| field | value |
|-------|-------|
| claim_id | CLM-14 |
| claim_label | Structural Domain Count (17) |
| claim_type | count |
| surfaced_location | TopologySummaryPanel "Domains: 17"; StatusBand "Domains: 17"; CONCEPT-17 |
| raw_source_field | `canonical_topology.json → domains[]` (count=17) |
| authoritative_value | 17 |
| stage_of_origin | S2 (pios emit topology → canonical_topology.json) |
| visible_in_gauge | YES |
| candidate_for_lens | YES — "17 structural domains identified" |
| traceability | FULL |
| explanation | The 17 domains are the root-level structural nodes in the canonical topology. Each domain represents a distinct functional boundary (e.g., "Edge Data Acquisition", "Platform Infrastructure and Data", etc.) in the BlueEdge system. They are the binding contexts for capabilities and components. |

### CLM-15: Topology Capability Count

| field | value |
|-------|-------|
| claim_id | CLM-15 |
| claim_label | Structural Capability Count (42) |
| claim_type | count |
| surfaced_location | TopologySummaryPanel "Surfaces: 42" |
| raw_source_field | `canonical_topology.json → capabilities[]` (count=42) |
| authoritative_value | 42 |
| stage_of_origin | S2 |
| visible_in_gauge | YES |
| candidate_for_lens | YES — "42 capability surfaces mapped" |
| traceability | FULL |
| explanation | Capabilities are the mid-tier nodes representing functional services or surface areas within each domain. They sit between domains (depth=0) and components (depth=2). |

### CLM-16: Topology Component Count

| field | value |
|-------|-------|
| claim_id | CLM-16 |
| claim_label | Structural Component Count (89) |
| claim_type | count |
| surfaced_location | TopologySummaryPanel "Components: 89"; summary.nodes_count=148 total |
| raw_source_field | `canonical_topology.json → components[]` (count=89) |
| authoritative_value | 89 |
| stage_of_origin | S2 |
| visible_in_gauge | YES |
| candidate_for_lens | YES — "89 structural components identified" |
| traceability | FULL |
| explanation | Components are the leaf-level structural nodes representing individual modules, files, services, or functional units. They are the most granular level of the structural model. 89 components across 42 capability surfaces across 17 domains = 148 total nodes. |

### CLM-17: Cross-Domain Overlap Count

| field | value |
|-------|-------|
| claim_id | CLM-17 |
| claim_label | Cross-Domain Structural Overlaps |
| claim_type | count |
| surfaced_location | TopologySummaryPanel "Structural overlaps: 0 (OVL flag absent)"; StatusBand "Cross-Domain: 0"; CONCEPT-08/09 |
| raw_source_field | canonical: `topology.summary.overlap_edges_count=0`; envelope: `constraint_flags.overlap_count=2` |
| authoritative_value | 0 in canonical model; 2 in binding_envelope (run_335c0575a080) |
| stage_of_origin | S2 (canonical) / binding derivation (envelope path) |
| visible_in_gauge | YES (canonical = 0) |
| candidate_for_lens | YES — when envelope path used, 2 overlaps with specific evidence (OVL-01, OVL-02) |
| traceability | FULL for canonical (0 verified); FULL for envelope (2 with named evidence) |
| explanation | The canonical topology model (17/42/89) has no cross-domain overlap edges — the single cross_domain_ref on COMP-25 ("DOM-01") is a known source peculiarity preserved as a node field, not an edge. The binding_envelope for the generic client run shows 2 structural overlaps with specific evidence IDs. These reflect different evidence layers and are not contradictory. |

### CLM-18: Signal Registry Total

| field | value |
|-------|-------|
| claim_id | CLM-18 |
| claim_label | Governed Signal Count (5) |
| claim_type | count |
| surfaced_location | SignalAvailability "5 signals detected"; /api/signals `total=5` |
| raw_source_field | `signal_registry.json → total_signals=5` |
| authoritative_value | 5 |
| stage_of_origin | S3 (pios emit signals) |
| visible_in_gauge | YES |
| candidate_for_lens | YES — headline signal count |
| traceability | FULL |
| explanation | 5 signals in the governed signal registry for BlueEdge run_01_blueedge. Each signal was derived from the evidence_confidence model traversing condition → diagnosis → intelligence chains from the structural artifacts. |

### CLM-19: Signal Confidence Distribution

| field | value |
|-------|-------|
| claim_id | CLM-19 |
| claim_label | Signal Evidence Quality Distribution |
| claim_type | entity-summary |
| surfaced_location | SignalAvailability confidence chips: STRONG:2, MODERATE:2, WEAK:1 |
| raw_source_field | `signal_registry.json → signals[].evidence_confidence` |
| authoritative_value | STRONG:2 (SIG-001, SIG-002), MODERATE:2 (SIG-003, SIG-004), WEAK:1 (SIG-005) |
| stage_of_origin | S3 |
| visible_in_gauge | YES |
| candidate_for_lens | YES — evidence quality distribution is commercially meaningful |
| traceability | FULL |
| explanation | Evidence confidence reflects the quality of the evidence chain supporting each signal. STRONG = complete four-layer chain (signal → condition → diagnosis → intelligence). MODERATE = deterministic computation confirmed but some conditions pending. WEAK = static component only; runtime component blocked or absent. |

### CLM-20 through CLM-24: Individual Signal Claims

Each of the 5 signals is a first-class claim with sub-fields:

| signal | claim_id | title | evidence_confidence | traceable |
|--------|----------|-------|--------------------|---------  |
| SIG-001 | CLM-20 | Sensor Bridge Throughput Ceiling: Configuration Confirmed, Runtime Unknown | STRONG | FULL |
| SIG-002 | CLM-21 | Platform Runtime State: Seven Core Dimensions Are Currently Unknown | STRONG | FULL |
| SIG-003 | CLM-22 | Dependency Load: 68% of Architectural Relationships Are Dependency Edges | MODERATE | FULL |
| SIG-004 | CLM-23 | Structural Volatility: Edge-to-Node Density Exceeds Unity | MODERATE | FULL |
| SIG-005 | CLM-24 | Coordination Pressure: Static Interface Sharing at 87.5%; Runtime State Unresolved | WEAK | PARTIAL |

Each signal claim contains: statement (precise assertion), domain/capability/component anchoring, source_refs chain, business_impact, risk, and confidence_rationale. These are the richest client-facing claims in the system.

### CLM-25: Executive Decision Layer Verdicts

| field | value |
|-------|-------|
| claim_id | CLM-25 |
| claim_label | Executive Three-Axis Verdict (STRUCTURE / COMPLEXITY / EXECUTION) |
| claim_type | verdict |
| surfaced_location | ExecutiveDecisionBlock in overview.js |
| derivation | STRUCTURE: CONCEPT-01 ∧ CONCEPT-03 ∧ CONCEPT-14; COMPLEXITY: any of CONCEPT-08/09/16; EXECUTION: CONCEPT-06 |
| authoritative_value | STRUCTURE=STRONG, COMPLEXITY=LOW, EXECUTION=UNKNOWN |
| stage_of_origin | Derived from S1/S2/S4 (no new data source) |
| visible_in_gauge | YES (overview.js) |
| candidate_for_lens | YES — highest-impact client-facing summary |
| traceability | FULL (derived from fully traced claims) |
| explanation | The executive verdicts are Boolean aggregations of resolved concept predicates. STRUCTURE=STRONG because CONCEPT-01 (coverage=100%), CONCEPT-03 (reconstruction PASS), and CONCEPT-14 (heuristic PASS) all resolve to true. COMPLEXITY=LOW because no envelope overlap (CONCEPT-08 false) and no orphans (CONCEPT-16 false). EXECUTION=UNKNOWN because CONCEPT-06 matches (completion_points=0 AND execution_status pre-Stream-10 was PHASE_1_ACTIVE). NOTE: with Stream 10 schema, CONCEPT-06 predicate uses PHASE_1_ACTIVE — this will not match NOT_EVALUATED. This is a known semantic gap requiring future update. |

### CLM-26: Business Ontology Phrase Claims

| claim_id | CLM-26 |
|----------|--------|
| claim_label | Executive Narrative Phrase Set (19 concepts → N active phrases) |
| claim_type | narrative-support |
| surfaced_location | overview.js three executive sections + ExecHeader |
| raw_sources | concepts.json predicates → resolver.js → phrases.json templates |
| traceability | FULL |
| explanation | 19 active concepts in concepts.json each have a predicate evaluated against live gauge + topology data. Matched concepts are mapped to phrase templates in phrases.json. The phrase templates contain placeholders (e.g., `{component_count}`, `{coverage_percent}`) that are interpolated with actual values. Each rendered phrase is traceable to its concept_id, phrase_id, and audience_scope via `data-*` DOM attributes. |

### CLM-27: Node-Level Topology Entity Set

| claim_id | CLM-27 |
|----------|--------|
| claim_label | Full Node Inventory (148 nodes: 17+42+89) |
| claim_type | entity-summary |
| surfaced_location | Topology explorer (TopologyAddon); full nodes[] array available to UI |
| raw_source | `canonical_topology.json → domains[], capabilities[], components[]` |
| traceability | FULL |
| explanation | Every node has a canonical ID, name, depth, and structural type. The full 148-node set is available in the topology API response. Currently browsable in the topology explorer page. Entity-level drill-down (single node inspector) is present in the topology explorer. |

---

## SECTION 4 — SUMMARY STATISTICS

| category | count |
|----------|-------|
| Distinct claim families identified | 27 (CLM-01 through CLM-27) |
| Individual signal claims (within CLM-20..24) | 5 |
| Total surfaced value fields enumerated | 72 |
| Claims currently visible in GAUGE | 21 |
| Claims available in API but not currently rendered in UI | 8 |
| Claims fully traceable | 24 |
| Claims partially traceable | 3 (CLM-06 caveat, CLM-24 runtime blocked, CLM-25 CONCEPT-06 semantic gap) |
| Claims blocked | 0 |
| Claims candidate for LENS | 25 |
| Entity families identified | 7 (structural units, topology nodes, signals, concepts, reconstruction axes, score components, dimensions) |

---

## SECTION 5 — KNOWN BLOCKED MAPPINGS

| mapping | status | reason |
|---------|--------|--------|
| `docs/pios/runs/run_07_source_profiled_ingestion/` | NOT PRESENT | Original intake source absent; IG.RUNTIME/run_01 is authoritative surviving basis |
| Signal runtime component (CLM-24, SIG-005) | PARTIAL | AT-005 (active pipeline runs) and AT-007 (validation gate counts) are blocked pending live pipeline events |
| DIM-04 precise unknown-space records | CAVEAT | "us_records not available in declared input artifacts" per gauge_state.json §4.5 |
| CONCEPT-06 predicate match on NOT_EVALUATED | SEMANTIC GAP | Predicate requires `execution_status == 'PHASE_1_ACTIVE'` — will not match Stream 10 `NOT_EVALUATED`. ExecutiveDecisionBlock EXECUTION verdict may not trigger correctly on recomputed run. |
| Individual structural unit names (30 CEUs) | OPERATOR-ONLY | Raw file-level artifact names are too technical for direct client exposure |
| axis_results detail per axis | OPERATOR-ONLY in current UI | Present in run_authoritative_recomputed_01 but not rendered in panels |

Authority: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01

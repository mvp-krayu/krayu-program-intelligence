# Static Signal Expansion Registry
## Provisional PSIG Candidate Set — Pressure-Zone and Focus-Domain Identification

**Stream:** PI.SIGNAL-SPACE.EXPANSION.40X.02
**Layer:** 40.5 — Signal Computation Specification
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** PROVISIONAL — DESIGN ONLY; no execution authorized by this document

---

## Purpose

This registry defines a curated set of provisional static signal candidates (PSIG-001..PSIG-008) intended to expand the static-only signal surface available for pressure-zone and focus-domain identification across arbitrary client topologies.

These candidates supplement the two currently computable static signals (SIG-002/CKR-007, SIG-004/CKR-009). They do not replace, redefine, or override any CKR-governed construct.

This document is a governance specification. It does not execute any computation, activate any condition, or produce any signal value.

---

## Scope

- **In scope:** Signal definition, input specification, computation sketch, pressure meaning, portability assessment, CKR relationship, evidence status
- **Out of scope:** Threshold rules (75.x), condition activation (40.6), intelligence synthesis (40.7), runtime telemetry, DORA metrics, ESI/RAG, LLM/AI interpretation, LENS narratives, graph/report generation, code implementation

---

## Governing References

| Document | Role |
|----------|------|
| `docs/pios/PI.SIGNAL-INTELLIGENCE.ONTOLOGY.01.md` | Construct authority and ontology baseline |
| `docs/pios/PI.SIGNAL-INTELLIGENCE.ONTOLOGY.01.index.md` | Key findings and CKR pipeline mapping |
| `canonical_knowledge_registry.md` (external — KH_CAPSULE) | CKR construct authority |
| `governance_master_capsule.md` (external — KH_CAPSULE) | Naming and compliance rules |
| `scripts/pios/40.5/build_signal_artifacts.py` | Signal computation engine (CKR-026) |

---

## Layer Authority Rule

```
CKR    — defines WHAT the construct is (ontological authority)
40.x   — defines HOW it is computed (implementation authority)
41.x   — defines HOW it is exposed and packaged (semantic authority)
Selector — filters which eligible signals are attempted per client/run
```

PSIG signals are **PROVISIONAL_CKR_CANDIDATE** until formally registered in CKR. They must not be treated as canonical constructs. All PSIG outputs must be labeled provisional in run artifacts.

---

## Signal Namespace Clarification

| Namespace | IDs | Authority | Status |
|-----------|-----|-----------|--------|
| SIG-001..008 | CKR-governed delivery-domain signals | CKR-005..011 / 40.5 | CANONICAL |
| PSIG-001..008 | Provisional static expansion candidates | PROVISIONAL_CKR_CANDIDATE | NOT YET CKR-REGISTERED |

No PSIG signal maps to an existing SIG without explicit CKR alignment. No PSIG overrides a SIG definition.

---

## Current Signal Baseline

### Confirmed Static-Computable for Second-Client

| Signal | CKR | Name | Inputs | Status |
|--------|-----|------|--------|--------|
| SIG-002 | CKR-007 | Dependency Load | ST-007, ST-012..015 | COMPUTED — dep_load_ratio=0.044 |
| SIG-004 | CKR-009 | Structural Volatility | ST-006, ST-007, ST-009..011 | COMPUTED — four ratios |

### Confirmed Non-Portable / Blocked

| Signal | Reason | Classification |
|--------|--------|----------------|
| SIG-006 APPLICATION-DOMAIN | hasi_bridge.py BlueEdge-specific; no FastAPI equivalent | BLOCKED_MISSING_STATIC_EQUIVALENT |
| SIG-006 / CKR-011 DELIVERY-DOMAIN | Requires AT-007, AT-009, DT-007, DT-008 event-based delivery telemetry | BLOCKED_RUNTIME |
| SIG-001 / CKR-006 | Requires AT-005/AT-007 activity telemetry | BLOCKED_RUNTIME |
| SIG-003 / CKR-008 | Requires AT-001..003 commit time-series | BLOCKED_RUNTIME |
| SIG-005 / CKR-010 | Requires Prometheus runtime metrics | BLOCKED_RUNTIME |
| SIG-007 / CKR-014 (ESI) | Requires ≥1 temporal execution window; DRIFT-001 active | BLOCKED_RUNTIME |
| SIG-008 / CKR-015 (RAG) | Requires ≥2 temporal delivery windows | BLOCKED_RUNTIME |

### Source Artifact Confirmed Available (Second-Client)

`clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/binding/binding_envelope.json`

Confirmed topology:
- 45 nodes total (5 domain, 10 component_entity/CEU, 30 capability_surface)
- 62 edges (60 CONTAINS, 2 OVERLAP_STRUCTURAL)
- OVERLAP_STRUCTURAL: CEU-08→CEU-10, CEU-09→CEU-10 (both converge on DOM-05)
- Max fan-in: 13; max fan-out: 13
- Capability surfaces: DOM-03=10, DOM-04=13, DOM-05=7, DOM-01=0, DOM-02=0

---

## Candidate Registry: PSIG-001..PSIG-008

ST-030..035 are now formally defined as PROVISIONAL_TELEMETRY_FIELD via PI.STATIC-TELEMETRY.REGISTRATION.40X.03 (`docs/pios/40.4/static_telemetry_expansion_registry.md`). PSIG-001..006 status is updated to INPUT_DEFINED below. Canonical extraction still requires an authorized 40.4 execution contract.

---

## ST-to-PSIG Dependency Mapping

Registered per PI.STATIC-TELEMETRY.REGISTRATION.40X.03:

| ST Field | Name | Status | Governing PSIG |
|----------|------|--------|----------------|
| ST-030 | MAX_FAN_IN | PROVISIONAL_TELEMETRY_FIELD | PSIG-001 |
| ST-031 | MAX_FAN_OUT | PROVISIONAL_TELEMETRY_FIELD | PSIG-002 |
| ST-032 | CROSS_DOMAIN_EDGE_COUNT | PROVISIONAL_TELEMETRY_FIELD | PSIG-003 |
| ST-033 | MAX_RESPONSIBILITY_SURFACE | PROVISIONAL_TELEMETRY_FIELD | PSIG-004 |
| ST-034 | TOTAL_INTERFACE_SURFACE | PROVISIONAL_TELEMETRY_FIELD | PSIG-004, PSIG-005 |
| ST-035 | STRUCTURAL_CLUSTER_COUNT | PROVISIONAL_TELEMETRY_FIELD | PSIG-006 |

All six ST fields are derivable from `binding_envelope.json` only. No additional source artifact is required.

---

---

### PSIG-001 — Fan-In Concentration

**Status:** PROVISIONAL_CKR_CANDIDATE — INPUT_DEFINED (ST-030 registered)

| Property | Value |
|----------|-------|
| Provisional ID | PSIG-001 |
| Proposed name | Fan-In Concentration |
| Pressure family | Coupling pressure |
| CKR relationship | `candidate_for_new_ckr: YES` — extends CKR-007 (Dependency Load) scope to per-node intake concentration; not subsumed by existing CKR |
| Static inputs required | Node fan-in distribution (incoming edge counts per node) from topology graph; total node count (ST-007) |
| ST dependency | ST-030 = MAX_FAN_IN (max incoming edge count for any single node) |
| Source artifact | `binding_envelope.json` — directed edge traversal using `from_node`/`to_node` fields |
| Computation sketch | `fan_in_concentration = ST-030 / (total_edges / ST-007)` — ratio of max fan-in to mean fan-in across all nodes; values > 1 indicate concentrated intake pressure |
| Pressure meaning | A high fan-in concentration identifies a single node receiving a disproportionate share of incoming structural dependencies — a bottleneck candidate and blast-radius focus point |
| Portability status | PORTABLE — derivable from any client binding_envelope with directed edge data |
| Excluded inputs | runtime telemetry, call graphs, dynamic traces |
| Downstream use | Pressure-zone identification; focus-domain selection candidate; CKR-007 (Dependency Load) companion signal |
| Evidence status | INPUT_DEFINED — ST-030 formally specified in PI.STATIC-TELEMETRY.REGISTRATION.40X.03; `binding_envelope.json` confirmed as source; max fan-in = 13 observed for second-client |

**Second-client indicative value (not canonical):**
- ST-030 (MAX_FAN_IN) = 13
- mean fan-in = 62/45 = 1.378
- PSIG-001 = 13 / 1.378 = **9.43** (high concentration on a single intake node)

---

### PSIG-002 — Fan-Out Propagation

**Status:** PROVISIONAL_CKR_CANDIDATE — INPUT_DEFINED (ST-031 registered)

| Property | Value |
|----------|-------|
| Provisional ID | PSIG-002 |
| Proposed name | Fan-Out Propagation |
| Pressure family | Propagation pressure |
| CKR relationship | `candidate_for_new_ckr: YES` — addresses blast-radius / downstream propagation risk; no existing CKR entry covers directional propagation from a single source |
| Static inputs required | Node fan-out distribution (outgoing edge counts per node); total node count (ST-007) |
| ST dependency | ST-031 = MAX_FAN_OUT (max outgoing edge count from any single node) |
| Source artifact | `binding_envelope.json` — directed edge traversal |
| Computation sketch | `fan_out_propagation = ST-031 / (total_edges / ST-007)` — ratio of max fan-out to mean fan-out; values > 1 indicate concentrated propagation pressure |
| Pressure meaning | A high fan-out value identifies a single node that distributes to a disproportionate number of downstream dependents — any structural change to this node propagates broadly; marks the highest-blast-radius node in the graph |
| Portability status | PORTABLE — derivable from any client binding_envelope with directed edge data |
| Excluded inputs | runtime call counts, message bus throughput |
| Downstream use | Pressure-zone identification; blast-radius estimation; focus-domain selection candidate |
| Evidence status | INPUT_DEFINED — ST-031 formally specified in PI.STATIC-TELEMETRY.REGISTRATION.40X.03; max fan-out = 13 observed for second-client |

**Second-client indicative value (not canonical):**
- ST-031 (MAX_FAN_OUT) = 13
- mean fan-out = 62/45 = 1.378
- PSIG-002 = 13 / 1.378 = **9.43** (same node structure as PSIG-001; one node is both highest intake and highest propagation)

---

### PSIG-003 — Cross-Domain Coupling Ratio

**Status:** PROVISIONAL_CKR_CANDIDATE — INPUT_DEFINED (ST-032 registered)

| Property | Value |
|----------|-------|
| Provisional ID | PSIG-003 |
| Proposed name | Cross-Domain Coupling Ratio |
| Pressure family | Cross-domain coordination pressure |
| CKR relationship | `candidate_for_new_ckr: YES` — extends CKR-006 (Coordination Pressure) scope to domain-boundary coupling specifically; CKR-006 targets intra-pipeline coordination, not domain-boundary structural coupling |
| Static inputs required | Cross-domain edge count (OVERLAP_STRUCTURAL edges between different domain contexts); total edge count (ST-010) |
| ST dependency | ST-032 = CROSS_DOMAIN_EDGE_COUNT |
| Source artifact | `binding_envelope.json` — OVERLAP_STRUCTURAL edges with provenance.from_ceu / to_ceu domain resolution |
| Computation sketch | `cross_domain_coupling_ratio = ST-032 / ST-010` — fraction of total edges that cross domain boundaries |
| Pressure meaning | Structural edges crossing domain boundaries represent coordination obligations enforced at the architecture level. A rising cross-domain ratio indicates the program's structural model has increasing inter-domain coupling pressure — each such edge is a structural handoff point where domain team coordination is structurally mandated |
| Portability status | PORTABLE — OVERLAP_STRUCTURAL edge type is a standard binding_envelope construct |
| Excluded inputs | runtime API call counts, dynamic service calls, message queue coupling |
| Downstream use | Coordination pressure zone identification; cross-domain dependency concentration analysis |
| Evidence status | INPUT_DEFINED — ST-032 formally specified in PI.STATIC-TELEMETRY.REGISTRATION.40X.03; 2 OVERLAP_STRUCTURAL edges confirmed (REL-001: CEU-08→CEU-10, REL-002: CEU-09→CEU-10) |

**Second-client indicative value (not canonical):**
- ST-032 (CROSS_DOMAIN_EDGE_COUNT) = 2
- ST-010 = 62
- PSIG-003 = 2 / 62 = **0.032** (low coupling ratio; DOM-05/CEU-10 is the sole structural coupling target)

---

### PSIG-004 — Responsibility Concentration

**Status:** PROVISIONAL_CKR_CANDIDATE — INPUT_DEFINED (ST-033 and ST-034 registered)

| Property | Value |
|----------|-------|
| Provisional ID | PSIG-004 |
| Proposed name | Responsibility Concentration |
| Pressure family | Responsibility concentration |
| CKR relationship | `candidate_for_new_ckr: YES` — related to CKR-009 (Structural Volatility) in that overloaded components are a volatility risk, but PSIG-004 specifically addresses surface ownership concentration within component nodes, which is a distinct structural pressure point |
| Static inputs required | Capability surface count per component entity (CEU); total capability surface count; total CEU count (ST-009) |
| ST dependency | ST-033 = MAX_RESPONSIBILITY_SURFACE; ST-034 = TOTAL_INTERFACE_SURFACE |
| Source artifact | `binding_envelope.json` — `capability_surfaces` array with `provenance.parent_ceu` field |
| Computation sketch | `responsibility_concentration = ST-033 / (ST-034 / ST-009)` — ratio of the most surface-loaded CEU to the mean surfaces-per-CEU across all CEUs |
| Pressure meaning | A component entity owning disproportionately many capability surfaces has concentrated responsibility: it is the structural bottleneck for surface-area-related changes, review, and testing. High concentration identifies the highest-responsibility architectural unit for pressure-zone focus |
| Portability status | PORTABLE — capability_surfaces with parent_ceu provenance is a standard binding_envelope field |
| Excluded inputs | runtime request counts, ownership registries, team assignments |
| Downstream use | Focus-domain and focus-component identification; pressure-zone precondition evaluation; pairing with PSIG-001/PSIG-002 for compound pressure score |
| Evidence status | INPUT_DEFINED — ST-033 and ST-034 formally specified in PI.STATIC-TELEMETRY.REGISTRATION.40X.03; CEU-08=10, CEU-09=13, CEU-10=7 confirmed |

**Second-client indicative value (not canonical):**
- ST-033 (MAX_RESPONSIBILITY_SURFACE) = 13 (CEU-09 / DOM-04 frontend_isolated)
- ST-034 (TOTAL_INTERFACE_SURFACE) = 30; ST-009 = 10
- mean surfaces/CEU = 30/10 = 3.0
- PSIG-004 = 13 / 3.0 = **4.33** (CEU-09 carries 4.3× the mean responsibility load)

---

### PSIG-005 — Interface Surface Area

**Status:** PROVISIONAL_CKR_CANDIDATE — INPUT_DEFINED (ST-034 registered)

| Property | Value |
|----------|-------|
| Provisional ID | PSIG-005 |
| Proposed name | Interface Surface Area |
| Pressure family | Interface surface pressure |
| CKR relationship | `candidate_for_new_ckr: YES` — no existing CKR entry addresses the density of exposed coordination surfaces at the domain level |
| Static inputs required | Total capability surface count; total domain count (ST-006) |
| ST dependency | ST-034 = TOTAL_INTERFACE_SURFACE |
| Source artifact | `binding_envelope.json` — `capability_surfaces` array count; domain count from ST-006 |
| Computation sketch | `interface_surface_ratio = ST-034 / ST-006` — mean capability surfaces exposed per domain; companion metric: `max_surface_domain_ratio = max_surfaces_per_domain / interface_surface_ratio` for concentration |
| Pressure meaning | The interface surface area measures the aggregate coordination exposure of the program's domain structure. A domain with a disproportionately high surface count is structurally exposed: it presents more coordination points than peers, and any structural change ripples across more surfaces. Pairing with PSIG-003 identifies whether high-surface domains are also cross-domain coupling targets |
| Portability status | PORTABLE — ST-034 and ST-006 are derivable from any client binding_envelope |
| Excluded inputs | API endpoint counts, runtime call surface, OpenAPI spec surface |
| Downstream use | Domain-level pressure score component; focus-domain candidate selector input |
| Evidence status | INPUT_DEFINED — ST-034 formally specified in PI.STATIC-TELEMETRY.REGISTRATION.40X.03; 30 capability surfaces confirmed; DOM-04 max (13/30 = 43%) |

**Second-client indicative values (not canonical):**
- ST-034 (TOTAL_INTERFACE_SURFACE) = 30; ST-006 = 5
- PSIG-005 (ratio) = 30 / 5 = **6.0** surfaces/domain
- DOM-04 max concentration = 13 / (30/5) = 13 / 6.0 = **2.17** (DOM-04 has 2.17× mean surface density)

---

### PSIG-006 — Structural Fragmentation Index

**Status:** PROVISIONAL_CKR_CANDIDATE — INPUT_DEFINED (ST-035 registered)

| Property | Value |
|----------|-------|
| Provisional ID | PSIG-006 |
| Proposed name | Structural Fragmentation Index |
| Pressure family | Structural fragmentation |
| CKR relationship | `candidate_for_new_ckr: YES` — addresses structural isolation as a topology pressure; CKR-009 (Structural Volatility) covers topology ratios but not graph connectivity fragmentation |
| Static inputs required | Number of disconnected or weakly connected clusters in structural graph (ST-035); total node count (ST-007) |
| ST dependency | ST-035 = STRUCTURAL_CLUSTER_COUNT |
| Source artifact | `binding_envelope.json` — full node list and edge list for BFS connected-component analysis |
| Computation sketch | `fragmentation_index = (ST-035 - 1) / ST-007` — normalized count of isolated components beyond a fully connected baseline; 0.0 = fully connected (ST-035=1); higher values indicate greater structural fragmentation |
| Pressure meaning | A topology with many disconnected clusters has structural blind spots: nodes in isolated components have no structural coupling to the rest of the program, making them invisible to pressure signals derived from edge data. High fragmentation combined with low PSIG-003 (cross-domain coupling) means the program's inter-domain integration is both sparse and concentrated on very few coupling points — those points become high-confidence pressure-zone candidates. Isolated nodes require test-risk or complexity signals to assess structural health. |
| Portability status | PORTABLE — connected-component analysis is applicable to any client binding_envelope topology |
| Excluded inputs | logical coupling, semantic overlap, shared data stores, call-graph connectivity |
| Downstream use | Structural isolation map; complements PSIG-003; identifies nodes that will produce no coupling or propagation signal and require separate evidence coverage |
| Evidence status | INPUT_DEFINED — ST-035 formally specified as STRUCTURAL_CLUSTER_COUNT in PI.STATIC-TELEMETRY.REGISTRATION.40X.03; BFS analysis of second-client binding_envelope confirmed 10 clusters (1 large + 9 singletons) |

**Second-client indicative value (not canonical):**
- ST-035 (STRUCTURAL_CLUSTER_COUNT) = 10 (1 connected component of 36 nodes + 9 isolated singletons including DOM-01, DOM-02, and 7 CEU nodes with no edges)
- ST-007 = 45
- PSIG-006 = (10 - 1) / 45 = **0.20** (20% fragmentation; 9 structurally isolated nodes out of 45)

---

### PSIG-007 — Critical Untested Surface

**Status:** PROVISIONAL_CKR_CANDIDATE — PROVISIONAL_BLOCKED_INPUT_MISSING

| Property | Value |
|----------|-------|
| Provisional ID | PSIG-007 |
| Proposed name | Critical Untested Surface |
| Pressure family | Test-risk pressure |
| CKR relationship | `candidate_for_new_ckr: YES` — no existing CKR entry addresses test coverage as a structural pressure signal |
| Static inputs required | Test artifact mapping: count of capability surfaces with no corresponding test coverage path; or test path presence per surface from structure manifest |
| Source artifact required | Test coverage mapping artifact — NOT currently present in 40.4 pipeline; no test-to-surface binding in `binding_envelope.json` or any existing 40.x artifact |
| Computation sketch | `critical_untested_surface_ratio = uncovered_surfaces / total_surfaces` — where coverage is determined by presence of test path in structure manifest per capability surface |
| Pressure meaning | Capability surfaces with no structural test coverage path represent unobservable structural regions — changes in these surfaces cannot be validated from static evidence, making them risk-concentrating pressure points |
| Portability status | BLOCKED — requires test artifact mapping not present in current pipeline |
| Excluded inputs | runtime code coverage, dynamic instrumentation, mutation testing |
| Downstream use | Test-risk pressure zone component; structural risk surface identification |
| Evidence status | **PROVISIONAL_BLOCKED_INPUT_MISSING** — no test coverage artifact exists in 40.4 pipeline; no test-to-surface mapping in `binding_envelope.json`; `structure_manifest.json` contains path patterns only without test path indicators; second-client OSS FastAPI stack likely contains test directories but these are not captured in the current binding model |

**Resolution path:** Issue a 40.4 contract to extract test path presence per capability surface from `structure_manifest.json` (or equivalent test inventory) and register as new ST-XXX telemetry.

---

### PSIG-008 — Complexity Hotspot Ratio

**Status:** PROVISIONAL_CKR_CANDIDATE — PROVISIONAL_BLOCKED_INPUT_MISSING

| Property | Value |
|----------|-------|
| Provisional ID | PSIG-008 |
| Proposed name | Complexity Hotspot Ratio |
| Pressure family | Complexity pressure |
| CKR relationship | `candidate_for_new_ckr: YES` — no existing CKR entry addresses static code complexity as a signal |
| Static inputs required | Per-module static complexity metric (cyclomatic complexity, cognitive complexity, or lines-of-code-based proxy); total module count |
| Source artifact required | Static analysis output (complexity extraction) — NOT currently present in any 40.x artifact; `binding_envelope.json` contains structural topology only; no complexity metrics in `structure_manifest.json` or `binding_model.json` |
| Computation sketch | `complexity_hotspot_ratio = max_module_complexity / mean_module_complexity` — ratio of highest-complexity module to mean; values > 1 indicate a complexity concentration point |
| Pressure meaning | A module with disproportionate static complexity is a structural pressure point: it concentrates cognitive load, change risk, and defect probability. When combined with PSIG-001 (fan-in) or PSIG-004 (responsibility concentration), a high-complexity high-fan-in node is the strongest pressure-zone candidate available from purely static evidence |
| Portability status | BLOCKED — requires static complexity extraction capability not currently in pipeline |
| Excluded inputs | runtime profiling, dynamic complexity |
| Downstream use | Complexity pressure zone component; highest-value input for focus-domain selection when available |
| Evidence status | **PROVISIONAL_BLOCKED_INPUT_MISSING** — no static complexity extraction artifact exists in 40.4 pipeline; no complexity metrics in `binding_envelope.json` or `structure_manifest.json`; complexity extraction (via AST analysis, radon, or equivalent) has not been specified or implemented |

**Resolution path:** Issue a 40.4 contract to define complexity extraction specification and produce per-surface/per-module complexity metrics as new ST-XXX telemetry.

---

## CKR / Provisional Status Summary

| Signal | Type | CKR Link | Pressure Family | Evidence Status |
|--------|------|----------|-----------------|-----------------|
| SIG-002 | CANONICAL | CKR-007 | Coupling pressure (load ratio) | COMPUTED |
| SIG-004 | CANONICAL | CKR-009 | Structural volatility | COMPUTED |
| PSIG-001 | PROVISIONAL_CKR_CANDIDATE | candidate_for_new_ckr | Coupling pressure (intake concentration) | INPUT_DEFINED (ST-030) |
| PSIG-002 | PROVISIONAL_CKR_CANDIDATE | candidate_for_new_ckr | Propagation pressure | INPUT_DEFINED (ST-031) |
| PSIG-003 | PROVISIONAL_CKR_CANDIDATE | candidate_for_new_ckr | Cross-domain coordination pressure | INPUT_DEFINED (ST-032) |
| PSIG-004 | PROVISIONAL_CKR_CANDIDATE | candidate_for_new_ckr | Responsibility concentration | INPUT_DEFINED (ST-033, ST-034) |
| PSIG-005 | PROVISIONAL_CKR_CANDIDATE | candidate_for_new_ckr | Interface surface pressure | INPUT_DEFINED (ST-034) |
| PSIG-006 | PROVISIONAL_CKR_CANDIDATE | candidate_for_new_ckr | Structural fragmentation | INPUT_DEFINED (ST-035) |
| PSIG-007 | PROVISIONAL_CKR_CANDIDATE | candidate_for_new_ckr | Test-risk pressure | PROVISIONAL_BLOCKED_INPUT_MISSING |
| PSIG-008 | PROVISIONAL_CKR_CANDIDATE | candidate_for_new_ckr | Complexity pressure | PROVISIONAL_BLOCKED_INPUT_MISSING |

---

## Pressure Family Mapping

| Pressure Family | Signals |
|----------------|---------|
| Coupling pressure | SIG-002 (CKR-007), PSIG-001 |
| Propagation pressure | PSIG-002 |
| Cross-domain coordination pressure | PSIG-003 |
| Responsibility concentration | PSIG-004 |
| Interface surface pressure | PSIG-005 |
| Structural fragmentation | PSIG-006 |
| Structural volatility | SIG-004 (CKR-009) |
| Test-risk pressure | PSIG-007 [BLOCKED] |
| Complexity pressure | PSIG-008 [BLOCKED] |

---

## 40.4 ST-XXX Registration Status

ST-030..035 are now formally defined as PROVISIONAL_TELEMETRY_FIELD via PI.STATIC-TELEMETRY.REGISTRATION.40X.03 (`docs/pios/40.4/static_telemetry_expansion_registry.md`).

| ST-XXX | Name | Status | Governing PSIG |
|--------|------|--------|----------------|
| ST-030 | MAX_FAN_IN | PROVISIONAL_TELEMETRY_FIELD | PSIG-001 |
| ST-031 | MAX_FAN_OUT | PROVISIONAL_TELEMETRY_FIELD | PSIG-002 |
| ST-032 | CROSS_DOMAIN_EDGE_COUNT | PROVISIONAL_TELEMETRY_FIELD | PSIG-003 |
| ST-033 | MAX_RESPONSIBILITY_SURFACE | PROVISIONAL_TELEMETRY_FIELD | PSIG-004 |
| ST-034 | TOTAL_INTERFACE_SURFACE | PROVISIONAL_TELEMETRY_FIELD | PSIG-004, PSIG-005 |
| ST-035 | STRUCTURAL_CLUSTER_COUNT | PROVISIONAL_TELEMETRY_FIELD | PSIG-006 |

These ST-XXX fields are defined and reserved. Canonical registration in `structural_telemetry.md` requires an authorized 40.4 extraction execution contract.

---

## Excluded Signal Types

The following signal categories are explicitly excluded from this expansion set and must not be introduced under PSIG namespace:

| Excluded Type | Reason |
|--------------|--------|
| Runtime telemetry (heap, CPU, throughput) | Not static; requires live process |
| DORA metrics (deployment frequency, MTTR) | Activity/delivery telemetry; BLOCKED_RUNTIME |
| ESI / RAG | CKR-014/015; temporal composite; BLOCKED_RUNTIME |
| Thresholds / condition rules | 75.x authority; not a 40.5 concern |
| LLM/AI-derived scoring | Non-deterministic; violates determinism invariant |
| Semantic interpretation / LENS narrative | 41.x / Phase 5 authority |
| Graph state construction | Phase 4; downstream of vault |

---

## Unresolved Items

| Item | Nature | Resolution Path |
|------|--------|-----------------|
| PSIG-007 input gap | No test artifact mapping in 40.4 pipeline | 40.4 contract to extract test path presence per capability surface |
| PSIG-008 input gap | No static complexity extraction in 40.4 pipeline | 40.4 contract to specify and produce per-module complexity ST-XXX |
| ST-030..035 canonical extraction | ST fields are defined (PROVISIONAL_TELEMETRY_FIELD) but not yet extracted into structural_telemetry.md | Authorized 40.4 extraction execution contract required |
| CKR registration for PSIG-001..006 | All six PSIG candidates are provisional | CKR governance process via authorized CKR update contract |
| 40.6 threshold rules for PSIG signals | No 75.x threshold contract exists for any PSIG | Stream 75.x authority required before any PSIG output activates conditions |
| Fan-in/fan-out node identity (second-client) | Max fan-in = 13 node identified but not named in this specification | Resolved during 40.5 execution contract with node ID resolution |

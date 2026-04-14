# Semantic Computation Authority Contract
# SEMANTIC.COMPUTATION.AUTHORITY.01

---

## 1. IDENTITY

- Contract: SEMANTIC.COMPUTATION.AUTHORITY.01
- Date: 2026-04-14
- Status: AUTHORITATIVE — LOCKED
- Scope: STAGE 3 ONLY — 41.1, 41.2, 41.3, 41.4, 41.5
- Authority level: SEMANTIC DERIVATION AUTHORITY

**Upstream dependency (required before Stage 3 may begin):**
- STRUCTURAL.TRUTH.AUTHORITY.01 — Stage 2 structural truth (40.2–40.4)

**Downstream consumers:**
- GAUGE (Stage 4) — consumes `canonical_topology.json` and `signal_registry.json`
- PiOS Continuation (Stage 5 — 40.5) — consumes `telemetry_dimension_catalog.md` (via S2) and `signal_registry.json` for signal scaffolding

**Authority:** Stage 3 is the only layer authorized to derive semantic meaning from structural truth. It does not invent meaning; it derives it deterministically from the evidence-grounded S2 outputs.

---

## Purpose

This contract defines how structural truth becomes semantic structure — without interpretation drift, manual enrichment, or semantic invention.

Stage 3 spans five sub-stages:

- **41.1 — Topology Emission:** structural entities → component/capability/domain topology
- **41.2 — PIE Vault:** semantic index for navigation and reference
- **41.3 — Semantic Link Normalization:** relationship normalization across structure and semantics
- **41.4 — Signal Registry:** structural-evidence signals with confidence classification
- **41.5 — Query Catalog:** declarative query definitions mapped to signals and topology

The outputs of Stage 3 collectively constitute the semantic layer of the system — the meaning that GAUGE can surface as structural proof and that PiOS continuation can use for signal scaffolding.

---

## 2. INPUT CONTRACT (FROM STAGE 2)

### 2.1 Upstream Authority

Stage 3 inputs are governed by STRUCTURAL.TRUTH.AUTHORITY.01.
The complete structural proof criteria (SP-01 through SP-12) defined in that contract must pass before Stage 3 may begin.
Stage 3 accepts Stage 2 outputs as sealed structural truth — it does not re-classify evidence or re-reconstruct entities.

### 2.2 Authorized Input Artifacts

Stage 3 may consume ONLY the following artifacts from the sealed Stage 2 output set:

| artifact | path |
|---------|------|
| entity_catalog.md | `docs/pios/40.3/entity_catalog.md` |
| dependency_map.md | `docs/pios/40.3/dependency_map.md` |
| interface_map.md | `docs/pios/40.3/interface_map.md` |
| program_execution_graph.md | `docs/pios/40.3/program_execution_graph.md` |
| telemetry_dimension_catalog.md | `docs/pios/40.4/telemetry_dimension_catalog.md` |

### 2.3 Input Identity Binding

All Stage 3 inputs must resolve to exactly one `client_uuid` and one `source_version`.
The semantic layer is bound to a single structural truth state.
No input from a different `client_uuid`, `source_version`, or Stage 2 run may enter Stage 3 within a single execution.

### 2.4 Forbidden Inputs

| forbidden | reason |
|-----------|--------|
| Any RHP artifact (source_manifest, evidence_boundary, admissibility_log, layer_index, source_profile, provenance_chain) | Stage 3 may not bypass Stage 2 and consume IG outputs directly |
| Raw source files from the Stage 0 evidence root | Same reason — Stage 3 works from structural abstractions, not raw evidence |
| 40.2 classification artifacts (evidence_classification_map, normalized_evidence_map, evidence_surface_inventory) | Intermediate classification — Stage 3 consumes reconstructed structure only |
| telemetry_surface_definition.md | Surface map — Stage 3 uses the dimension catalog |
| telemetry_schema.md | Schema definition — not a data artifact |
| reconstruction/ corpus files | Per-entity detail — Stage 3 works from the entity catalog |
| Any activation layer artifact (43.x, 44.x) | Downstream — not admissible as upstream input |
| Any runtime layer artifact (42.x) | Downstream — not admissible as upstream input |
| Any external file, URL, or package registry reference | Non-S2 input |
| Artifacts from a prior Stage 3 run | Cross-run contamination |

### 2.5 No External Enrichment Rule

Stage 3 must not introduce any information not derivable from the 5 authorized S2 inputs.
No human-assigned names, external taxonomies, or domain expertise may supplement the structural derivation.

---

## 3. SEMANTIC DERIVATION MODEL

### 3.1 Three Semantic Layers

Stage 3 derives exactly three semantic layers from structural truth:

| layer | derived from | output form |
|-------|-------------|-------------|
| COMPONENT | structural entities in `entity_catalog.md` | topology nodes of type `component_entity` |
| CAPABILITY | groupings of components via patterns in `dependency_map.md` and `interface_map.md` | topology nodes of type `capability_surface` |
| DOMAIN | groupings of capabilities via structural clustering | topology nodes of type `domain_context` |

### 3.2 Layer Definitions

**COMPONENT**
- Purpose: Represent each structural entity as a typed node in the semantic topology
- Admissible inputs: `entity_catalog.md` (entity_id, entity_name, tier, CEU reference)
- Output form: One component node per structural entity; node carries entity_id, name, tier, and structural evidence reference
- Traceability: Component node → `entity_catalog.md` entry → CEU reference in 40.2

**CAPABILITY**
- Purpose: Group components that collectively expose or implement a bounded functional surface
- Admissible inputs: `dependency_map.md` and `interface_map.md` (structural relationships between entities)
- Output form: One capability node per derived functional grouping; capability carries a component membership list
- Traceability: Capability node → component members → entity_catalog entries → structural relationships in dependency/interface maps

**DOMAIN**
- Purpose: Group capabilities that belong to the same structural ownership or systemic concern
- Admissible inputs: Capability membership patterns derived from structural clustering
- Output form: One domain node per derived structural cluster; domain carries a capability membership list
- Traceability: Domain node → capability members → component members → structural entities

### 3.3 Semantic Derivation Rules

| rule | description |
|------|-------------|
| STRUCTURAL ANCHOR | Every semantic element (component, capability, domain) must trace to at least one structural entity in `entity_catalog.md` |
| NO FREE-FORM NAMING | Semantic element names must be derived from structural evidence (entity names, module paths, interface contracts); no arbitrary human-assigned labels |
| DETERMINISTIC GROUPING | Same S2 inputs → same semantic groupings; grouping must not depend on session state, ordering heuristics, or analyst judgment |
| NO ENRICHMENT | No external taxonomy, domain model, or business vocabulary may be injected into the semantic layer |
| NO ORPHAN SEMANTICS | A semantic element with no structural anchor is a derivation failure — it must not appear in any S3 output |
| LAYERED DERIVATION | Components are derived before capabilities; capabilities are derived before domains; no upward derivation |

---

## 4. 41.1 — TOPOLOGY EMISSION AUTHORITY

### 4.1 Purpose

41.1 emits the canonical topology as a structured graph artifact, translating the three semantic layers into a machine-readable, consumption-ready topology. This artifact is the authoritative structural surface for GAUGE and the semantic reference for PIE vault construction.

### 4.2 Authoritative Output

| artifact | path |
|---------|------|
| `canonical_topology.json` | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` |

### 4.3 Node Types

`canonical_topology.json` must declare exactly these node types:

| node_type | derived from | required fields |
|-----------|-------------|----------------|
| `component_entity` | structural entity in `entity_catalog.md` | `node_id`, `node_type`, `entity_id`, `name`, `tier`, `capability_id` (parent), `evidence_ref` |
| `capability_surface` | derived component grouping | `node_id`, `node_type`, `capability_id`, `name`, `component_ids` (member list), `domain_id` (parent) |
| `domain_context` | derived capability grouping | `node_id`, `node_type`, `domain_id`, `name`, `capability_ids` (member list) |

### 4.4 Required Relationships

| relationship | from | to | direction |
|-------------|------|----|-----------|
| component → capability | `component_entity` node | `capability_surface` node | member-of |
| capability → domain | `capability_surface` node | `domain_context` node | member-of |

### 4.5 Topology Rules

| rule | description |
|------|-------------|
| FULL TRACE | Every `component_entity` node must carry an `entity_id` traceable to `entity_catalog.md` |
| NO ORPHAN NODES | Every node must belong to its parent layer; orphan components (no capability), orphan capabilities (no domain) are FAIL conditions |
| NO INFERRED DOMAIN | A domain node may not be emitted unless at least one capability is assigned to it |
| DETERMINISTIC EMISSION | Same S2 inputs → same topology; no session-variable node assignment |
| NO ENVELOPE-DERIVED TOPOLOGY | Topology must not be sourced from PSEE package envelopes, prior GAUGE state, or any non-S2 artifact |
| NO DUPLICATE NODE IDS | Each `node_id` must be unique within the topology |

### 4.6 Parity Expectation

`canonical_topology.json` must declare its node counts at the root level:

```json
{
  "domain_count": <integer>,
  "capability_count": <integer>,
  "component_count": <integer>,
  "node_total": <integer>,
  ...
}
```

Node counts must be consistent with the node arrays in the file.

---

## 5. 41.2 — PIE VAULT AUTHORITY

### 5.1 Purpose

41.2 builds a semantic index (PIE Vault) from the canonical topology and S2 structural artifacts. The vault provides navigation references and semantic lookup surfaces for query execution and cross-artifact traceability.

### 5.2 Authoritative Output

| artifact | path |
|---------|------|
| PIE vault index and navigation map | `docs/pios/41.2/` (directory) |

The vault directory must contain at minimum:
- A node inventory (enumeration of all semantic nodes with type, id, and structural reference)
- A navigation map (linking nodes to their structural evidence sources)

### 5.3 PIE Vault Rules

| rule | description |
|------|-------------|
| TOPOLOGY GROUNDED | Every vault entry must reference a node in `canonical_topology.json` |
| RECONSTRUCTABLE | The vault must be fully reconstructable from `canonical_topology.json` and the 5 authorized S2 inputs |
| NO ADDITIONAL MEANING | The vault is a structured index, not a semantic enrichment — it must not add attributes, labels, or relationships not derivable from topology and structure |
| NO ENRICHMENT BEYOND TOPOLOGY | Vault entries may not carry semantic annotations not present in the topology node definition |

---

## 6. 41.3 — SEMANTIC LINK NORMALIZATION AUTHORITY

### 6.1 Purpose

41.3 normalizes the relationships between structural entities and semantic topology nodes. Link normalization resolves overlaps, inconsistencies, and ambiguities in how structural dependencies and interfaces project onto the semantic layer.

### 6.2 Authoritative Output

| artifact | path |
|---------|------|
| `semantic_consolidation_report.md` | `docs/pios/41.3/semantic_consolidation_report.md` |

### 6.3 Required Structure

`semantic_consolidation_report.md` must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- Summary of relationship normalization (count of links resolved, overlaps declared, inconsistencies found)
- Per-link entries: link_id, from (node_id), to (node_id), link_type, derivation basis (dependency_map or interface_map reference), normalization action (RETAINED / MERGED / EXCLUDED with reason)
- Explicit exclusion log: any relationship excluded from the normalized set with reason

### 6.4 Link Normalization Rules

| rule | description |
|------|-------------|
| DERIVABLE ONLY | All normalized links must be derivable from `dependency_map.md` or `interface_map.md` |
| NO INVENTED RELATIONSHIPS | A link not traceable to a structural dependency or interface entry must not appear in the normalized output |
| NO CROSS-LAYER CONTAMINATION | Normalization may not introduce relationships from activation (43.x), runtime (42.x), or any non-S2 layer |
| EXPLICIT EXCLUSIONS | Any structural relationship excluded from the normalized set must be logged with reason; silent exclusion is a FAIL condition |

---

## 7. 41.4 — SIGNAL REGISTRY AUTHORITY

### 7.1 Purpose

41.4 defines signals that are observable from structural evidence. The signal registry is the authoritative inventory of what can be known about the system from structural analysis alone — without live runtime telemetry.

### 7.2 Authoritative Output

| artifact | path |
|---------|------|
| `signal_registry.json` | `docs/pios/41.4/signal_registry.json` |

### 7.3 Two Signal Classes

**Class A: STRUCTURAL-EVIDENCE SIGNALS (produced in S3)**

These signals are derivable from structural observations without live runtime access:

| property | definition |
|----------|-----------|
| Source | `entity_catalog.md`, `dependency_map.md`, `interface_map.md`, `telemetry_dimension_catalog.md` (STATIC dimensions) |
| Confidence | `STRONG` / `MODERATE` / `WEAK` — based on evidence quality and coverage |
| Value | Presence indicator — the signal is present if the structural condition it observes is met |
| Runtime required | NO |
| Appears in S3 registry | YES |

**Class B: RUNTIME SIGNALS (NOT produced in S3)**

These signals require live telemetry from a running system:

| property | definition |
|----------|-----------|
| Source | Live Prometheus scrapes, event streams, API calls — unavailable in static analysis |
| Confidence | Not applicable in S3 |
| Value | Not computable in S3 |
| Appears in S3 registry | NO — Runtime signals belong to Stage 5 (40.5) |
| Appears in S3 registry as placeholder | NO — Runtime signals must not be declared as computed or simulated entries in 41.4 |

### 7.4 Required Signal Registry Schema

`signal_registry.json` must include at the root level:

```json
{
  "registry_id": "<string>",
  "run_reference": "<run_id>",
  "contract_id": "SEMANTIC.COMPUTATION.AUTHORITY.01",
  "signal_class": "STRUCTURAL_EVIDENCE",
  "signals": [ ... ],
  "total": <integer>
}
```

Each signal entry must include:
- `signal_id` (unique identifier, e.g. SIG-xxx)
- `name` (derived from structural observation — no free-form labels)
- `evidence_source` (reference to entity_id, dependency_id, dimension_id, or CEU)
- `evidence_confidence` (`STRONG` / `MODERATE` / `WEAK`)
- `structural_basis` (description of what structural condition the signal observes)
- `runtime_required` (must be `false` for all entries in this registry)

### 7.5 Signal Registry Rules

| rule | description |
|------|-------------|
| STRUCTURAL TRACE | Every signal must reference at least one structural source (entity, dependency, interface, or STATIC telemetry dimension) |
| NO RUNTIME IN S3 | A signal requiring live telemetry must not appear in `signal_registry.json` as a computed or present signal |
| NO SIMULATED VALUES | No signal may carry a simulated, estimated, or fabricated observation value |
| CONFIDENCE FROM EVIDENCE | Confidence must be assigned based on the quality and completeness of structural evidence, not analyst preference |
| NO DUPLICATE SIGNAL IDS | Each `signal_id` must be unique within the registry |
| RUNTIME_REQUIRED = FALSE | The `runtime_required` field for every entry in 41.4 must be `false`; signals with `runtime_required: true` belong to S5 |

---

## 8. 41.5 — QUERY CATALOG AUTHORITY

### 8.1 Purpose

41.5 defines the declarative query catalog — a set of pre-defined structural queries that can be answered from the topology and signal registry. Queries are surface-only declarations; no execution logic resides in Stage 3.

### 8.2 Authoritative Outputs

| artifact | path |
|---------|------|
| `golden_query_catalog.md` | `docs/pios/41.5/golden_query_catalog.md` |
| `query_signal_map.json` | `docs/pios/41.5/query_signal_map.json` |

### 8.3 Required Structure Per Output

**golden_query_catalog.md** must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- One entry per defined query with: query_id, query_name, query_description, answer_type (structural / signal-presence / topology-path), required signals (signal_id list), required topology nodes (node_id list)
- No query without a mapping to at least one signal or topology node

**query_signal_map.json** must contain:
- A mapping array where each entry declares: `query_id`, `signal_ids` (list), `topology_node_ids` (list)
- No query_id may appear without at least one signal_id or topology_node_id

### 8.4 Query Catalog Rules

| rule | description |
|------|-------------|
| DECLARATIVE ONLY | Queries define what can be asked — they do not contain execution logic or response generation |
| SIGNAL MAPPING REQUIRED | Every query must map to at least one signal in `signal_registry.json` or one node in `canonical_topology.json` |
| NO IMPLICIT UNLOCK | No query may include logic that automatically unlocks access or bypasses a defined access gate |
| NO GAUGE EXECUTION BEHAVIOR | Query definitions must not carry rendering instructions, scoring rules, or GAUGE UI logic |
| NO RUNTIME QUERY EXECUTION | Execution of queries against runtime data belongs to Stage 6 (42.x ExecLens); Stage 3 defines only the query structure |
| NO ORPHAN QUERIES | A query with no signal mapping and no topology node mapping must not appear in the catalog |

---

## 9. SEMANTIC PROOF CRITERIA

### 9.1 PASS Conditions

Stage 3 is COMPLETE and its output is valid for Stage 4 (GAUGE) consumption if and only if ALL of the following are satisfied:

| condition | check |
|-----------|-------|
| SP3-01 | `canonical_topology.json` exists and is non-empty |
| SP3-02 | `canonical_topology.json` contains at least one node of each type: `domain_context`, `capability_surface`, `component_entity` |
| SP3-03 | `canonical_topology.json` declared node counts match actual node arrays |
| SP3-04 | Every `component_entity` node carries an `entity_id` traceable to `entity_catalog.md` |
| SP3-05 | No `component_entity` node is without a parent `capability_surface` |
| SP3-06 | No `capability_surface` node is without a parent `domain_context` |
| SP3-07 | PIE vault directory (`docs/pios/41.2/`) exists and contains at least one artifact |
| SP3-08 | `semantic_consolidation_report.md` exists and contains at least one link entry |
| SP3-09 | `signal_registry.json` exists and contains at least one signal entry |
| SP3-10 | Every signal in `signal_registry.json` has `runtime_required: false` |
| SP3-11 | Every signal in `signal_registry.json` carries an `evidence_source` traceable to an S2 artifact |
| SP3-12 | `golden_query_catalog.md` exists and contains at least one query entry |
| SP3-13 | `query_signal_map.json` exists and every query_id in the catalog appears in the map |
| SP3-14 | Full traceability chain: S2 entity → component node → capability node → domain node → signal → query |
| SP3-15 | No semantic element (node, signal, query) is present without a structural anchor |

**PASS:** SP3-01 through SP3-15 all satisfied.

**Stage 4 (GAUGE) may not consume Stage 3 outputs until PASS is confirmed.**

### 9.2 Traceability Chain Requirement

The minimum required traceability chain for any query is:

```
entity_catalog.md (entity)
  → canonical_topology.json (component_entity node)
    → canonical_topology.json (capability_surface node)
      → canonical_topology.json (domain_context node)
        → signal_registry.json (signal with evidence_source)
          → golden_query_catalog.md (query mapping to signal)
```

Any break in this chain is a FAIL condition.

---

## 10. DERIVATION RULES

### 10.1 Derived, Not Invented

All Stage 3 outputs must be derived from the 5 authorized S2 inputs. No output may:
- carry semantic labels not derivable from structural evidence
- introduce groupings that cannot be reconstructed from `entity_catalog.md`, `dependency_map.md`, or `interface_map.md`
- use names or identifiers sourced from external business vocabulary

### 10.2 No Manual Naming Injection

Semantic element names (domain names, capability names, signal names) must emerge from structural derivation.

Permitted: Using entity names, module path components, and interface contracts as the source for semantic naming.
Forbidden: Assigning human-readable business names that are not traceable to structural evidence in S2 outputs.

### 10.3 Determinism Rule

Same S2 inputs → same S3 outputs.

Given identical S2 outputs (same `run_id`, same structural artifacts, same content), Stage 3 must produce identical semantic outputs across runs. Non-deterministic Stage 3 outputs are invalid.

### 10.4 No Hidden Dictionaries or Mappings

Stage 3 must not use any mapping table, lookup dictionary, or taxonomy file that is not itself derived from or declared within the 5 authorized S2 inputs. Hidden mappings are a derivation violation.

### 10.5 No Mixing of Signal Classes

Structural-evidence signals (Class A) and runtime signals (Class B) must be kept strictly separate.
`signal_registry.json` (41.4) contains only Class A signals.
Class B signals are the exclusive responsibility of Stage 5 (40.5).
A signal entry in `signal_registry.json` with `runtime_required: true` is a contract violation.

### 10.6 No Stage Collapse

Stage 3 must not absorb responsibilities from adjacent stages:
- Stage 3 does not score structural coverage (Stage 4 responsibility)
- Stage 3 does not compute runtime signal values (Stage 5 responsibility)
- Stage 3 does not produce conditions or diagnoses (Stage 5 responsibility)
- Stage 3 does not perform LENS projection (Stage 6 responsibility)
- Stage 3 does not bind signals to topology for projection (Stage 6 — 43.x responsibility)

---

## 11. OUTPUT CONTRACT (TO STAGE 4 — GAUGE)

### 11.1 What GAUGE May Consume from Stage 3

GAUGE (Stage 4) may consume ONLY the following Stage 3 outputs:

| authorized artifact | path |
|--------------------|------|
| `canonical_topology.json` | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` |
| `signal_registry.json` | `docs/pios/41.4/signal_registry.json` |

### 11.2 What GAUGE Must Not Consume from Stage 3

| forbidden artifact | reason |
|-------------------|--------|
| PIE vault (`docs/pios/41.2/`) | Navigation index — not a GAUGE consumption surface |
| `semantic_consolidation_report.md` | Internal normalization record — not a GAUGE artifact |
| `golden_query_catalog.md` | Query definitions — GAUGE surfaces queries but does not execute them |
| `query_signal_map.json` | Query-signal mapping — internal S3 artifact |
| Any Stage 2 artifact | Stage 3 mediates; GAUGE does not bypass Stage 3 |
| Any Stage 5 outputs | Stage 5 does not run before GAUGE stop boundary |
| Any runtime signal values | GAUGE signal block uses structural-evidence signals only |

### 11.3 GAUGE Signal Block Constraint

GAUGE renders `signal_registry.json` as a signal presence surface only.
GAUGE may display: signal count, `evidence_confidence` distribution (STRONG/MODERATE/WEAK), signal identifiers, signal names.
GAUGE must not: compute signal values, simulate runtime signals, or present structural-evidence signals as computed runtime signals.

### 11.4 Immutability of Stage 3 Outputs

Stage 3 outputs are immutable once the Stage 3 PASS condition (Section 9) is confirmed.
GAUGE must not modify `canonical_topology.json` or `signal_registry.json`.
GAUGE produces its own package artifacts; it does not write back into Stage 3 output paths.

---

## 12. REJECTION CONDITIONS

Stage 3 outputs must be rejected and Stage 4 must not begin on any of the following:

| code | condition |
|------|-----------|
| `S3_INPUT_NOT_S2` | Stage 3 consumed an artifact not authorized by STRUCTURAL.TRUTH.AUTHORITY.01 |
| `S3_SEMANTIC_NO_ANCHOR` | A semantic element (component, capability, domain, signal, or query) has no traceable structural anchor in S2 |
| `S3_DOMAIN_NO_CAPABILITIES` | A domain node exists in `canonical_topology.json` with no capability members |
| `S3_CAPABILITY_NO_COMPONENTS` | A capability node exists in `canonical_topology.json` with no component members |
| `S3_ORPHAN_NODE` | A node in `canonical_topology.json` is not reachable via the component→capability→domain hierarchy |
| `S3_SIGNAL_NO_TRACE` | A signal in `signal_registry.json` carries no traceable reference to an S2 structural artifact |
| `S3_RUNTIME_SIGNAL_IN_S3` | A signal entry in `signal_registry.json` has `runtime_required: true` or carries a live telemetry value |
| `S3_NON_DETERMINISTIC` | Stage 3 produced outputs that differ from a prior run on identical S2 inputs |
| `S3_DUPLICATE_NODE_ID` | Two or more nodes in `canonical_topology.json` share the same `node_id` |
| `S3_DUPLICATE_SIGNAL_ID` | Two or more entries in `signal_registry.json` share the same `signal_id` |
| `S3_TOPOLOGY_COUNT_MISMATCH` | The declared node counts in `canonical_topology.json` do not match the actual node arrays |
| `S3_QUERY_NO_SIGNAL` | A query in `golden_query_catalog.md` has no mapping to any signal or topology node |
| `S3_HIDDEN_MAPPING` | Stage 3 used a mapping table or taxonomy not derivable from the 5 authorized S2 inputs |
| `S3_EXTERNAL_INPUT` | Stage 3 consumed a file outside the 5 authorized S2 inputs |
| `S3_ARTIFACT_MISSING` | Any of the 7 authoritative Stage 3 artifacts is absent |
| `S3_ARTIFACT_EMPTY` | An authoritative Stage 3 artifact exists but contains no substantive content |
| `S3_TRACEABILITY_BREAK` | The traceability chain (S2 entity → component → capability → domain → signal → query) is broken at any point |
| `S3_FREE_FORM_NAMING` | A semantic element carries a name not derivable from structural evidence |
| `S3_LINK_NOT_DERIVABLE` | A normalized link in `semantic_consolidation_report.md` is not traceable to `dependency_map.md` or `interface_map.md` |
| `S3_CROSS_RUN_CONTAMINATION` | A Stage 3 artifact contains entries from more than one `run_id` or `source_version` |

---

## 13. GOVERNANCE RULES

**G1 — No Structure, No Semantics**
Stage 3 may not begin without sealed Stage 2 outputs that have passed SP-01 through SP-12.
Semantic derivation is a function of structural truth, not a substitute for it.
No semantic layer may be constructed from incomplete, missing, or unvalidated S2 artifacts.

**G2 — No Trace, No Meaning**
Every semantic element — node, signal, query — must trace to at least one structural entity in S2.
An element without a structural trace is not derived meaning; it is semantic invention.
Semantic invention is a contract violation and a FAIL condition.

**G3 — No Determinism, No Valid Output**
Stage 3 outputs are only valid if they are reproducible from the same S2 inputs.
Non-deterministic semantic derivation produces unreliable topology, unreliable signals, and unreliable queries.
Any Stage 3 process producing different outputs from identical S2 inputs must be rejected.

**G4 — No Runtime Data in S3**
Stage 3 is a static derivation layer.
Runtime signal values, live telemetry observations, and computed signal states belong to Stage 5 (40.5).
The presence of any runtime data in Stage 3 outputs corrupts the structural-evidence signal boundary and must be treated as a FAIL condition.

**G5 — S3 Outputs Are Immutable Input to S4**
Once Stage 3 PASS is confirmed, `canonical_topology.json` and `signal_registry.json` are sealed.
Stage 4 (GAUGE) reads them; it does not modify them.
No downstream stage may alter any Stage 3 output artifact.
Corrections to Stage 3 outputs require a new Stage 3 run from valid S2 inputs.

---

## 14. STAGE BOUNDARY CONFIRMATION

### 14.1 Stage 3 End Condition

Stage 3 ends at: confirmation of SP3-01 through SP3-15 (Section 9).
Stage 3 output is the set of 7 authoritative artifacts enumerated in Sections 4–8.
No artifact outside that set is an authorized handoff to Stage 4.

### 14.2 Stage 4 Start Condition

Stage 4 (GAUGE — PSEE pipeline) begins at: reading `canonical_topology.json` and `signal_registry.json`.
Stage 4 accepts these artifacts as sealed semantic truth.
Stage 4 does not re-derive semantic layers or re-emit topology.

### 14.3 What Stage 3 Does

Stage 3 DOES:
- derive component, capability, and domain semantic layers from structural entities
- emit `canonical_topology.json` as the authoritative structural topology
- build the PIE vault as a semantic navigation index
- normalize semantic links from structural dependency and interface maps
- define structural-evidence signals with confidence classification
- declare a query catalog against structural signals and topology

### 14.4 What Stage 3 Does Not Do

Stage 3 DOES NOT:

| prohibited activity | owner |
|--------------------|-------|
| Compute runtime signal values | Stage 5 (40.5) |
| Classify live telemetry observations | Stage 5 (40.5) |
| Produce condition activations | Stage 5 (40.6) |
| Produce diagnoses or intelligence outputs | Stage 5 (40.7) |
| Perform GAUGE scoring or coverage computation | Stage 4 (PSEE pipeline) |
| Materialize the GAUGE package | Stage 4 (PSEE pipeline) |
| Bind signals to topology nodes for projection | Stage 6 (43.x) |
| Produce structural overlay projections | Stage 6 (44.x) |
| Execute queries against live runtime state | Stage 6 (42.x ExecLens) |
| Enrich structure beyond what the evidence supports | Forbidden at all stages |

### 14.5 Stage 3 and Stage 5 Relationship

Stage 3 (`signal_registry.json`) and Stage 5 (40.5 signal computation) share the same signal taxonomy but are strictly separated:
- Stage 3 signals: structural-evidence, presence-based, no runtime required
- Stage 5 signals: runtime-computed, value-bearing, require live telemetry

Stage 5 uses the `telemetry_dimension_catalog.md` (from S2 / 40.4) as its input scaffolding — not the Stage 3 signal registry.
BLOCKED dimensions in 40.4 are the exact record of what Stage 5 cannot produce until live telemetry is available.
Stage 3 must not attempt to resolve BLOCKED status or pre-populate Stage 5 signal entries.

---

## Validation at Definition Time

| check | status |
|-------|--------|
| C1 — file exists | PASS |
| C2 — input contract explicit | PASS — Section 2 (5 authorized S2 artifacts, forbidden inputs, identity binding, no enrichment rule) |
| C3 — semantic layers defined | PASS — Section 3 (COMPONENT/CAPABILITY/DOMAIN with purpose, inputs, output form, traceability) |
| C4 — 41.1 topology defined | PASS — Section 4 (canonical_topology.json, 3 node types, 2 relationships, 6 topology rules, parity expectation) |
| C5 — 41.2 PIE defined | PASS — Section 5 (vault directory, node inventory, navigation map, 4 vault rules) |
| C6 — 41.3 normalization defined | PASS — Section 6 (semantic_consolidation_report.md, required structure, 4 link rules) |
| C7 — 41.4 signal registry defined (structural vs runtime split) | PASS — Section 7 (Class A/B split, schema, 6 signal rules; runtime signals explicitly excluded) |
| C8 — 41.5 query catalog defined | PASS — Section 8 (golden_query_catalog.md, query_signal_map.json, required structure, 6 query rules) |
| C9 — semantic proof criteria explicit | PASS — Section 9 (SP3-01 through SP3-15, traceability chain) |
| C10 — derivation rules explicit | PASS — Section 10 (derived-not-invented, no manual naming, determinism, no hidden mappings, no class mixing, no stage collapse) |
| C11 — GAUGE consumption boundary explicit | PASS — Section 11 (2 authorized artifacts, 7 forbidden, signal block constraint, immutability) |
| C12 — ≥15 rejection conditions | PASS — Section 12 (20 named rejection codes) |
| C13 — governance rules present | PASS — Section 13 (G1–G5) |
| C14 — stage boundary explicit | PASS — Section 14 (end condition, start condition, does/does-not table, S5 relationship) |
| C15 — no implementation details | PASS — no script names, no runtime commands |
| C16 — no other file modified | PASS |

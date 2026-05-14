# Static Telemetry Expansion Registry
## Provisional ST-030..035 — Topology and Surface Telemetry Fields

**Stream:** PI.STATIC-TELEMETRY.REGISTRATION.40X.03
**Layer:** 40.4 — PiOS Telemetry Extraction
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** PROVISIONAL_TELEMETRY_FIELD — specification only; no extraction execution authorized by this document

---

## Purpose

This registry formally defines six new provisional static telemetry fields (ST-030..ST-035) required to support PSIG-001..PSIG-006 signal computation. These fields extend the existing structural telemetry set without modifying any previously defined ST-XXX entry.

This document is a governance specification. It does not execute telemetry extraction, compute any signal value, define thresholds, or modify CKR.

---

## Scope

- **In scope:** Telemetry field definition, input artifacts, computation description, output type, governing PSIG
- **Out of scope:** Signal computation (40.5), condition activation (40.6), CKR modification, threshold rules (75.x), runtime telemetry, any 41.x / vault / graph / report / LENS artifact

---

## Relationship to Existing ST-XXX Fields

All previously defined ST-001..ST-022 entries (documented in `docs/pios/40.4/structural_telemetry.md`) remain unchanged. No existing ST-XXX field is redefined or deprecated by this registry.

ST-030..ST-035 are additive extensions. They address topology graph metrics and surface distribution measurements not captured by the existing structural telemetry set.

**Existing ST fields used alongside new fields (reference only — not redefined here):**

| ST-XXX | Name | Used With |
|--------|------|-----------|
| ST-006 | Architectural Responsibility Zone Count | PSIG-005 denominator |
| ST-007 | Total Node Count | PSIG-001, PSIG-002, PSIG-006 denominators |
| ST-009 | Module Node Count (CEU count) | PSIG-004 denominator |
| ST-010 | Total Edge Count | PSIG-003 denominator |

---

## Governing Rules

- ST fields are telemetry primitives, not signals
- ST fields must be deterministic and static-derivable
- ST fields must map to observable structural artifacts
- ST fields must not embed interpretation or thresholds
- All new ST fields are marked PROVISIONAL_TELEMETRY_FIELD
- No ST field becomes canonical without CKR alignment
- Input boundary: `binding_envelope.json` and structural topology graph only; no runtime sources

---

## ST-030 — MAX_FAN_IN

| Field | Value |
|-------|-------|
| Metric ID | ST-030 |
| Metric Name | MAX_FAN_IN |
| Status | PROVISIONAL_TELEMETRY_FIELD |
| Definition | Maximum number of incoming directed edges terminating at any single node in the structural topology graph |
| Temporal classification | static |
| Unit | count (integer) |
| Output type | integer ≥ 0 |
| Input artifacts | `binding_envelope.json` — directed edge list; each edge record contains `from_node` and `to_node` fields |
| Computation description | Traverse all edges; for each edge record `to_node`, increment the incoming-edge counter for that node ID; ST-030 = maximum value across all node counters. Nodes with no incoming edges contribute a count of 0. |
| Second-client example | ST-030 = 13 (one node receives 13 incoming CONTAINS edges; confirmed via topology traversal of `binding_envelope.json`) |
| Governing PSIG | PSIG-001 — Fan-In Concentration |
| CKR status | NOT_APPLICABLE — telemetry primitive; CKR governs signal constructs, not telemetry fields |
| Duplication check | ST-010 (Total Edge Count) counts all edges; ST-030 is a per-node maximum, not a total. No duplication. |

---

## ST-031 — MAX_FAN_OUT

| Field | Value |
|-------|-------|
| Metric ID | ST-031 |
| Metric Name | MAX_FAN_OUT |
| Status | PROVISIONAL_TELEMETRY_FIELD |
| Definition | Maximum number of outgoing directed edges originating from any single node in the structural topology graph |
| Temporal classification | static |
| Unit | count (integer) |
| Output type | integer ≥ 0 |
| Input artifacts | `binding_envelope.json` — directed edge list; each edge record contains `from_node` and `to_node` fields |
| Computation description | Traverse all edges; for each edge record `from_node`, increment the outgoing-edge counter for that node ID; ST-031 = maximum value across all node counters. Nodes with no outgoing edges contribute a count of 0. |
| Second-client example | ST-031 = 13 (one node emits 13 outgoing CONTAINS edges; confirmed via topology traversal; the same node that has max fan-in also has max fan-out in the second-client topology) |
| Governing PSIG | PSIG-002 — Fan-Out Propagation |
| CKR status | NOT_APPLICABLE — telemetry primitive |
| Duplication check | ST-030 is incoming (fan-in); ST-031 is outgoing (fan-out). Complementary fields, not duplicates. |

---

## ST-032 — CROSS_DOMAIN_EDGE_COUNT

| Field | Value |
|-------|-------|
| Metric ID | ST-032 |
| Metric Name | CROSS_DOMAIN_EDGE_COUNT |
| Status | PROVISIONAL_TELEMETRY_FIELD |
| Definition | Count of edges in the structural topology graph that connect nodes belonging to different domain contexts |
| Temporal classification | static |
| Unit | count (integer) |
| Output type | integer ≥ 0 |
| Input artifacts | `binding_envelope.json` — edge list with `edge_type` field; domain mapping derived from node `provenance.parent_context` or edge `provenance.from_ceu`/`to_ceu` domain resolution |
| Computation description | Identify all edges of type `OVERLAP_STRUCTURAL` (the canonical binding_envelope edge type for cross-component structural relationships); resolve domain context for `from_node` and `to_node` of each such edge from the `provenance` section; count edges where resolved domain of `from_node` ≠ resolved domain of `to_node`. For CONTAINS edges: CONTAINS edges by definition connect parent-domain nodes to child nodes within the same domain context, so they do not contribute to CROSS_DOMAIN_EDGE_COUNT. |
| Second-client example | ST-032 = 2 (REL-001: CEU-08/DOM-03 → CEU-10/DOM-05; REL-002: CEU-09/DOM-04 → CEU-10/DOM-05; confirmed from binding_envelope OVERLAP_STRUCTURAL edges) |
| Governing PSIG | PSIG-003 — Cross-Domain Coupling Ratio |
| CKR status | NOT_APPLICABLE — telemetry primitive |
| Duplication check | ST-010 (Total Edge Count) includes all edge types; ST-032 is a filtered subset (cross-domain only). No duplication. |

---

## ST-033 — MAX_RESPONSIBILITY_SURFACE

| Field | Value |
|-------|-------|
| Metric ID | ST-033 |
| Metric Name | MAX_RESPONSIBILITY_SURFACE |
| Status | PROVISIONAL_TELEMETRY_FIELD |
| Definition | Maximum number of capability surfaces owned by (attributed to) a single component entity (CEU) in the binding model |
| Temporal classification | static |
| Unit | count (integer) |
| Output type | integer ≥ 0 |
| Input artifacts | `binding_envelope.json` — `capability_surfaces` array; each capability surface record contains `provenance.parent_ceu` field identifying the owning CEU |
| Computation description | Group all capability surface records by `provenance.parent_ceu`; compute surface count per CEU; ST-033 = maximum count across all CEUs. CEUs with no assigned capability surfaces contribute a count of 0. |
| Second-client example | ST-033 = 13 (CEU-09 / DOM-04 frontend_isolated domain owns 13 of 30 capability surfaces; CEU-08/DOM-03 owns 10; CEU-10/DOM-05 owns 7; CEU-01..CEU-07 own 0 each) |
| Governing PSIG | PSIG-004 — Responsibility Concentration |
| CKR status | NOT_APPLICABLE — telemetry primitive |
| Duplication check | ST-009 (Module Node Count) counts CEU nodes; ST-033 measures surface ownership per CEU. No duplication. |

---

## ST-034 — TOTAL_INTERFACE_SURFACE

| Field | Value |
|-------|-------|
| Metric ID | ST-034 |
| Metric Name | TOTAL_INTERFACE_SURFACE |
| Status | PROVISIONAL_TELEMETRY_FIELD |
| Definition | Total count of capability surface nodes in the binding model across all domains and components |
| Temporal classification | static |
| Unit | count (integer) |
| Output type | integer ≥ 0 |
| Input artifacts | `binding_envelope.json` — `capability_surfaces` array length; or total node count of all nodes with type `capability_surface` |
| Computation description | Count all records in the `capability_surfaces` array of `binding_envelope.json`; this is the total number of structural interface surfaces exposed across the entire program topology. No filtering is applied. |
| Second-client example | ST-034 = 30 (confirmed: binding_envelope.capability_surfaces array contains 30 records; distributed DOM-03=10, DOM-04=13, DOM-05=7; DOM-01=0, DOM-02=0) |
| Governing PSIG | PSIG-004 (denominator for mean surfaces/CEU), PSIG-005 — Interface Surface Area |
| CKR status | NOT_APPLICABLE — telemetry primitive |
| Duplication check | ST-007 (Total Node Count) includes all node types including capability surfaces; ST-034 counts capability_surface nodes specifically. Specific subset, not a duplicate. |

---

## ST-035 — STRUCTURAL_CLUSTER_COUNT

| Field | Value |
|-------|-------|
| Metric ID | ST-035 |
| Metric Name | STRUCTURAL_CLUSTER_COUNT |
| Status | PROVISIONAL_TELEMETRY_FIELD |
| Definition | Number of disconnected or weakly connected clusters (connected components) in the structural topology graph when treated as an undirected graph |
| Temporal classification | static |
| Unit | count (integer) ≥ 1 |
| Output type | integer ≥ 1 (a fully connected graph = 1; each additional isolated component adds 1) |
| Input artifacts | `binding_envelope.json` — full node list and edge list; edges provide adjacency regardless of type |
| Computation description | Construct an undirected adjacency graph from all edges in `binding_envelope.json` treating `from_node`/`to_node` as bidirectional connections. Apply BFS/DFS from each unvisited node to identify connected components. ST-035 = count of connected components found. A fully connected topology (all nodes reachable from any node) produces ST-035 = 1. Each isolated subgraph increments ST-035 by 1. Singleton nodes with no edges each count as one component. |
| Second-client example | ST-035 = 10 (BFS analysis of second-client binding_envelope: 1 large component of 36 nodes (DOM-03, DOM-04, DOM-05 subgraph connected through CEU OVERLAP edges), plus 9 isolated singleton nodes including DOM-01, DOM-02, and 7 isolated CEU nodes with no surface or cross-domain edges) |
| Governing PSIG | PSIG-006 — Structural Fragmentation Index |
| CKR status | NOT_APPLICABLE — telemetry primitive |
| Duplication check | No existing ST-XXX measures connectivity or cluster structure. New field, no duplication. |

---

## ST-XXX → PSIG-XXX → Pressure Dimension Mapping

| ST Field | Name | Governing PSIG | Signal Name | Pressure Dimension |
|----------|------|----------------|-------------|-------------------|
| ST-030 | MAX_FAN_IN | PSIG-001 | Fan-In Concentration | Coupling pressure |
| ST-031 | MAX_FAN_OUT | PSIG-002 | Fan-Out Propagation | Propagation pressure |
| ST-032 | CROSS_DOMAIN_EDGE_COUNT | PSIG-003 | Cross-Domain Coupling Ratio | Cross-domain coordination pressure |
| ST-033 | MAX_RESPONSIBILITY_SURFACE | PSIG-004 | Responsibility Concentration | Responsibility concentration |
| ST-034 | TOTAL_INTERFACE_SURFACE | PSIG-004, PSIG-005 | Responsibility Concentration; Interface Surface Area | Responsibility concentration; Interface surface pressure |
| ST-035 | STRUCTURAL_CLUSTER_COUNT | PSIG-006 | Structural Fragmentation Index | Structural fragmentation |

---

## Input Artifact Requirements

All six ST fields require only `binding_envelope.json` as input:

| Input Artifact | Required For | Availability |
|----------------|-------------|--------------|
| `binding_envelope.json` — node list (all 45 nodes with `node_id`) | ST-030, ST-031, ST-035 | PRESENT — second-client run_01_oss_fastapi |
| `binding_envelope.json` — edge list (62 edges with `from_node`, `to_node`, `edge_type`) | ST-030, ST-031, ST-032, ST-035 | PRESENT |
| `binding_envelope.json` — `capability_surfaces` array (30 records with `provenance.parent_ceu`) | ST-033, ST-034 | PRESENT |
| `binding_envelope.json` — edge `provenance` section (with `from_ceu`, `to_ceu` domain resolution) | ST-032 | PRESENT |

No additional 40.4 artifacts are required beyond `binding_envelope.json` for computing ST-030..035.

---

## Non-Goals

This registry does not:
- Interpret telemetry values or assign meaning to observed levels
- Define thresholds, percentile ranges, or alert boundaries
- Activate conditions (40.6 authority)
- Derive signals (40.5 authority)
- Modify CKR constructs
- Define what constitutes "high" or "low" values for any ST field
- Touch any 41.x, vault, graph, report, or LENS artifact

---

## Governance Status

All six ST fields defined in this document carry status: **PROVISIONAL_TELEMETRY_FIELD**

Promotion to canonical status requires:
1. Formal registration in `docs/pios/40.4/structural_telemetry.md` via authorized 40.4 contract
2. CKR alignment (telemetry fields are NOT CKR constructs — CKR alignment here means confirming no CKR construct is implicitly redefined by the field definition)
3. Inclusion in `docs/pios/40.4/telemetry_schema.md`

---

## Integration Note

These six fields are required inputs before selector-aware 40.5 execution can compute PSIG-001..006. The dependency chain is:

```
[This document] ST-030..035 DEFINED (provisional)
        ↓
[40.4 extraction contract] ST-030..035 EXTRACTED from binding_envelope
        ↓
[40.5 selector-aware execution contract] PSIG-001..006 COMPUTED
        ↓
[75.x threshold contract] PSIG conditions evaluated
```

This document fulfills the first step. No subsequent step is authorized by this document.

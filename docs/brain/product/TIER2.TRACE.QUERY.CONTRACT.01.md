# Brain Node — Product
# TIER2.TRACE.QUERY.CONTRACT.01
# Tier-2 Evidence Interrogation Layer — Trace Graph and Controlled Query Model

**Authority:** TIER2.TRACE.QUERY.CONTRACT.01
**Brain:** PRODUCT
**Status:** DEFINED — NOT IMPLEMENTED
**Alignment date:** 2026-04-22
**Upstream:** docs/brain/product/TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01.md
**Canonical link:** docs/brain/canonical/trace_graph_model.md
**Code link:** docs/brain/code/tier2_trace_query.md
**Publish link:** docs/brain/publish/tier2_trace_query.md

---

## PRODUCT SURFACE DEFINITION

The Evidence Interrogation Layer is the second component of Tier-2 Diagnostic Access. It enables controlled structural interrogation of diagnostic zones via three bounded query types.

The Diagnostic Narrative is the REQUIRED entry point. Queries are always scoped to a zone_id established by the Diagnostic Narrative.

This layer is NOT a reasoning engine. It is a constrained traversal system over a canonical structural graph.

---

## A. TRACE GRAPH MODEL

### Node Types

| Node type | Source artifact | Source field |
|---|---|---|
| `DOMAIN` | `canonical_topology.json` | `domains[].domain_id` |
| `CAPABILITY` | `canonical_topology.json` | `domains[].capability_ids[]` |
| `COMPONENT` | `canonical_topology.json` | `domains[].component_ids[]` |
| `SIGNAL` | `signal_registry.json` | `signals[].signal_id` |
| `ARTIFACT` | `signal_registry.json` | `signals[].artifacts[]` |
| `GAUGE` | `gauge_state.json` | score + confidence context node (singleton) |

Constraint: No node type outside this vocabulary is valid. No invented nodes.

### Edge Types

| Edge type | Connects | Direction |
|---|---|---|
| `CONTAINMENT` | DOMAIN → CAPABILITY → COMPONENT | parent to child |
| `DEPENDENCY` | DOMAIN ↔ DOMAIN or CAPABILITY ↔ CAPABILITY | structural dependency |
| `SIGNAL_EMISSION` | DOMAIN/CAPABILITY/COMPONENT → SIGNAL | node emits signal |
| `EVIDENCE_LINK` | SIGNAL → ARTIFACT | signal backed by artifact |
| `PROPAGATION` | NODE → NODE | structural consequence traversal |

Constraint: Edges must be derivable from canonical source fields. No invented edges.

### Traversal Rules

1. Traversal follows only declared edge types above
2. Cross-type jumping is not permitted without traversing the intermediate node
3. Direction is explicit per query: `UPSTREAM` | `DOWNSTREAM` | `BOTH`
4. Traversal terminates when no further edges exist or evidence is exhausted
5. Depth is bounded by a caller-supplied `depth_limit` (integer, max 5 for v1)
6. Every traversed node MUST report its `evidence_support` state

### Direct Evidence vs Inferred Path

```
direct_evidence:
  A path segment is direct when:
  - the connecting edge has a corresponding entry in signal_registry.json
  - the SIGNAL node at the path has at least one EVIDENCE_LINK to an ARTIFACT
  evidence_support: STRONG | PARTIAL

inferred_path:
  A path segment is inferred when:
  - the connecting edge has no artifact-backed signal reference
  - the path is derivable from structural topology only
  evidence_support: INFERRED
  inferred_declaration: REQUIRED
    MUST state: "This path segment is inferred. No artifact evidence directly
    confirms this structural connection."
```

Inferred path segments MUST be visually distinguished in all rendered outputs.

---

## B. QUERY MODEL

Entry precondition: `zone_id` MUST be present in the Tier-2 Diagnostic Narrative zone inventory before any query is accepted.

---

### WHY Query

```
Purpose:
  Interrogate why a diagnostic zone exhibits its identified condition.

Input:
  zone_id:        string    REQUIRED. Must match zone in Diagnostic Narrative.
  condition_id:   string    Optional. Scopes to specific condition within zone.

Allowed operations:
  - Traverse SIGNAL_EMISSION edges from zone-scoped nodes
  - Traverse DEPENDENCY edges from zone-scoped domains/capabilities
  - Report contributing signals and their evidence state
  - Report dependency chain within evidence boundary

Forbidden operations:
  - Root cause claim without full evidence closure
    (all path segments must have evidence_support ≠ INFERRED for closure)
  - Advisory language
  - Recursive inference beyond available EVIDENCE_LINK traversal
  - Synthesis of multiple zone conditions into a new conclusion
```

---

### TRACE Query

```
Purpose:
  Traverse the structural graph from an entry node to expose propagation paths.

Input:
  entry_node_id:       string    REQUIRED. Must be a valid canonical node ID.
  direction:           enum      UPSTREAM | DOWNSTREAM | BOTH. REQUIRED.
  depth_limit:         integer   REQUIRED. Range: 1–5.

Allowed operations:
  - Traverse DEPENDENCY, SIGNAL_EMISSION, PROPAGATION edges
  - Report each traversed node with evidence_support state
  - Declare inferred segments explicitly

Forbidden operations:
  - Traversal of nodes not present in canonical_topology.json
  - Inferred path traversal without explicit declaration
  - Traversal beyond declared depth_limit
  - Synthesizing traversal result into a causal conclusion
```

---

### EVIDENCE Query

```
Purpose:
  Expand the artifact evidence set for a zone or signal.

Input:
  zone_id:           string    REQUIRED. Must match zone in Diagnostic Narrative.
  artifact_scope:    enum      FULL | BOUNDED. REQUIRED.
    FULL:    all artifacts linked to any signal in zone scope
    BOUNDED: only artifacts linked to signals with evidence_support ≠ WEAK

Allowed operations:
  - Traverse EVIDENCE_LINK edges from SIGNAL nodes in zone scope
  - Report artifact references, coverage state, missing evidence

Forbidden operations:
  - Artifact access not referenced in signal_registry.json
  - Content interpretation of artifact payloads
  - Synthesis of artifact content into a new claim
```

---

## C. RESPONSE MODEL

Every query response MUST include all four fields. No field is optional.

```
RESPONSE OBJECT:

structural_explanation:    string
  Bounded to observable structure only.
  MUST reference the zone_id and the traversed node chain.
  Forbidden: causal language, advisory language, probability claims.

trace_paths:               [path_object]
  Same schema as Propagation Path in Diagnostic Narrative (Section 3C).
  Each path_object:
    path_id:               string     Format: {query_type}-{zone_id}-P{N}
    node_chain:            [node_id]  Canonical node IDs only.
    path_type:             enum       FORWARD | BACKWARD | BIDIRECTIONAL | UNKNOWN
    evidence_support:      enum       STRONG | PARTIAL | INFERRED
    inferred_declaration:  string     REQUIRED when evidence_support = INFERRED

evidence_references:       [object]
  Each entry:
    artifact_ref:          string
    artifact_type:         string
    signal_id:             string     Source signal
    coverage_state:        enum       PRESENT | MISSING | PARTIAL

uncertainty_declaration:   object     MANDATORY. Present in every response.
  unresolved_elements:     [object]
    each:
      element:             string
      reason:              string
      inference_forbidden: boolean    Always: true
  inference_prohibition:   fixed      Always: "ACTIVE"
```

No free-form text response is valid. Responses that cannot be structured per the above MUST return a BOUNDED_RESPONSE_FAILURE with reason.

---

## D. RUNTIME MODEL (DEFINITION ONLY)

### Required API Endpoints

```
GET /api/query?type=WHY&zone_id={zone_id}
GET /api/query?type=WHY&zone_id={zone_id}&condition_id={condition_id}

GET /api/query?type=TRACE&entry_node={node_id}&direction={dir}&depth={n}

GET /api/query?type=EVIDENCE&zone_id={zone_id}&scope={FULL|BOUNDED}
```

All endpoints return structured JSON per the Response Model above.

### Required Data Access

| Data source | Access pattern | Purpose |
|---|---|---|
| `canonical_topology.json` | Read-only, per-query | Node and edge resolution |
| `signal_registry.json` | Read-only, per-query | Signal and artifact resolution |
| `gauge_state.json` | Read-only, session | Scoring context for GAUGE node |
| Tier-2 Diagnostic Narrative | Zone inventory lookup | Entry precondition validation |

### Already Supported by Existing Artifacts

- `canonical_topology.json` exists at canonical package path ✓
- `signal_registry.json` exists at canonical package path ✓
- `gauge_state.json` exists at canonical package path ✓
- `/api/report-file` serving infrastructure exists in `app/gauge-product` ✓
- Zone schema (zone_id, structural_scope) defined in TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01 ✓

### NOT IMPLEMENTED

- `/api/query` endpoint — does not exist
- Trace graph builder (in-memory graph construction from canonical sources)
- Query engine (traversal logic per query type)
- Response renderer (structured JSON output per Response Model)
- Zone entry precondition validator

---

## E. BOUNDARY MODEL

### Strictly Forbidden

| Forbidden behavior | Applies to |
|---|---|
| Advisory conclusions ("you should…", "we recommend…") | All query types and responses |
| Root cause claims without full evidence closure | WHY query responses |
| Speculative reasoning | All query types and responses |
| Non-evidence-based statements | All query types and responses |
| Synthesis across multiple zones | All query types |
| Temporal projection ("this will…", "risk of…") | All query types and responses |
| Probability statements | All query types and responses |
| Cross-run comparison | All query types and responses |
| Content interpretation of artifact payloads | EVIDENCE query |
| Traversal beyond `depth_limit` | TRACE query |

### Enforcement Point

Every response produced by this layer MUST be validated against the Response Model before delivery. A response that fails to conform MUST return `BOUNDED_RESPONSE_FAILURE` rather than a non-conforming answer.

---

## RELATION TO DIAGNOSTIC NARRATIVE

```
Diagnostic Narrative (TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01)
  → defines zones
  → defines zone_id anchors
  → defines query hooks (WHY/TRACE/EVIDENCE per zone)
  → IS the required entry point

Evidence Interrogation Layer (this document)
  → consumes zone_id from Narrative
  → executes queries against trace graph
  → returns structured responses
  → DOES NOT add new zones
  → DOES NOT modify Narrative content
```

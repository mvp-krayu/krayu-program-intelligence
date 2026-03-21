ENL-004 — Lens Binding Layer
────────────────────────────────────────────────────────────

Program
Krayu — Program Intelligence Discipline

Date
2026-03-21

Contract
ENL-004-CONTRACT-v1 · run_01_blueedge

────────────────────────────────────────────────────────────
Purpose
────────────────────────────────────────────────────────────

This document defines the Lens Binding Layer — the formal
adapter between the ENL-003 query engine and the Lens
rendering surface.

The binding layer does not implement logic. It wraps ENL-003
engine outputs into render-ready view structures that Lens
can consume directly without needing to interpret ENL
internals.

Position in architecture:

  ENL graph artifacts (ENL-002)
       ↓
  ENL-003 — Query Engine           (traversal + validation)
       ↓
  ENL-004 — Lens Binding Layer     ← THIS LAYER
       ↓
  Lens                             (rendering + display)

────────────────────────────────────────────────────────────
Binding Architecture
────────────────────────────────────────────────────────────

The binding layer is a thin adapter. It has exactly one
responsibility: translate engine results into Lens view
structures without adding, removing, or transforming
ENL data.

WHAT THE BINDING LAYER DOES
────────────────────────────

  - Calls ENL-003 engine functions exclusively.
  - Wraps engine results in named view structures with
    explicit status fields.
  - Annotates node views with availability flags derived
    from declared ENL fields (upstream_available,
    downstream_available).
  - Translates ENL exception types into Lens exception types,
    preserving all error messages verbatim.
  - Maps ENL query status to Lens query view status
    (ok → complete, incomplete → partial, empty → empty).
  - Identifies seed nodes in query views by inspecting
    source_ref fields — a display annotation, not a
    traversal operation.

WHAT THE BINDING LAYER DOES NOT DO
────────────────────────────────────

  - Does not re-implement traversal logic.
  - Does not filter, reduce, or recompose node sets.
  - Does not mutate ENL node fields.
  - Does not inject fields into ENL node dicts.
  - Does not cache results.
  - Does not hold internal state between calls.
  - Does not infer, enrich, or supplement ENL data.
  - Does not implement persona logic (placeholder only).

────────────────────────────────────────────────────────────
Data Flow
────────────────────────────────────────────────────────────

Every binding function follows the same pattern:

  1. Validate input parameters (non-empty string check).
  2. Call the corresponding ENL-003 engine function.
  3. Catch ENL exceptions; re-raise as Lens exceptions
     with message preserved.
  4. Wrap the engine result into the Lens view structure.
  5. Return the view.

No step modifies ENL data. Steps 1 and 3 are defensive;
steps 2, 4, and 5 are the binding contract.

CALL MAP
────────

  bind_get_full_graph(graph)
    → reads graph['nodes'] directly (engine already loaded
      and validated graph)
    → returns full graph view

  bind_get_node(graph, node_id)
    → calls get_node(graph, node_id)
    → calls get_downstream_nodes(graph, node_id) to set
      downstream_available flag
    → returns node view

  bind_get_upstream_view(graph, node_id)
    → calls get_upstream_chain(graph, node_id)
    → returns upstream view

  bind_get_query_view(graph, query_id)
    → calls get_query_subgraph(graph, query_id)
    → identifies seed nodes from subgraph by source_ref
    → returns query view

  apply_persona(view, persona_config)
    → makes no calls
    → returns view unchanged (placeholder)

────────────────────────────────────────────────────────────
View Structures
────────────────────────────────────────────────────────────

A. UPSTREAM VIEW
────────────────

Returned by bind_get_upstream_view. Represents the navigable
chain from a start node upstream to EVID.

  {
    "status":             "complete" | "incomplete",
    "entry_node":         <node dict — all fields unchanged>,
    "chain":              [ <node>, ... ],
    "terminates_in_evid": bool,
    "error":              null | <str>
  }

  entry_node
    The node at which traversal began. Always the start node.

  chain
    Ordered list of all nodes reachable from entry_node
    via derived_from traversal. Ordered abstract→concrete
    (INTEL first, EVID last). Sorted by node_id within
    each layer for determinism.

  status
    "complete"   — traversal reached EVID; terminates_in_evid
                   is true; error is null.
    "incomplete" — traversal halted before EVID; terminates_in_evid
                   is false; error describes the failure point.

  terminates_in_evid
    True only when the chain contains an EVID node reachable
    from entry_node via unbroken derived_from traversal.

  error
    Null on complete chains. Non-null string on incomplete
    chains, naming the missing or invalid reference.

B. QUERY VIEW
─────────────

Returned by bind_get_query_view. Represents the full subgraph
associated with an intelligence query identifier.

  {
    "status":     "complete" | "partial" | "empty",
    "query_id":   <str>,
    "seed_nodes": [ <node>, ... ],
    "subgraph":   [ <node>, ... ],
    "count":      <int>
  }

  seed_nodes
    Nodes whose source_ref directly references the query_id.
    These are the nodes that were used as starting points for
    upstream expansion. Always a subset of subgraph.
    Sorted by node_id.

  subgraph
    The complete node set returned by the ENL query engine.
    Contains seed nodes plus all nodes reachable upstream
    via derived_from expansion. Unfiltered. Sorted by node_id.

  count
    Total number of nodes in subgraph (not seed_nodes).

  status
    "complete" — engine returned a full, EVID-terminated
                 subgraph (maps from ENL status "ok").
    "partial"  — engine returned a subgraph but at least one
                 upstream chain was incomplete (maps from ENL
                 status "incomplete").
    "empty"    — no nodes matched the query_id (maps from
                 ENL status "empty").

  Note: seed_nodes annotation is a display aid derived from
  ENL source_ref fields. It does not re-implement ENL
  filtering logic. The subgraph field is the authoritative
  result — Lens must not reduce it.

C. NODE VIEW
────────────

Returned by bind_get_node. Represents a single node with
availability annotations.

  {
    "status":               "ok",
    "node":                 <node dict — all fields unchanged>,
    "upstream_available":   bool,
    "downstream_available": bool
  }

  node
    The ENL node with all required fields unchanged.
    No additional fields are injected.

  upstream_available
    True when the node's derived_from array is non-empty.
    Derived from the declared derived_from field — no
    traversal performed.

  downstream_available
    True when at least one other node in the graph declares
    this node_id in its derived_from array.
    Determined by delegating to get_downstream_nodes.

────────────────────────────────────────────────────────────
Rendering Invariants
────────────────────────────────────────────────────────────

These invariants hold across all binding functions and
cannot be suspended by any caller or persona configuration.

  1. Node field integrity
     Every ENL node dict returned in any view contains
     exactly the fields declared in enl_node_schema_v1.
     No fields are added. No fields are removed.
     No field values are altered.

  2. Subgraph completeness
     The subgraph returned in a query view is identical to
     the node set returned by the ENL engine. Lens receives
     it in full. The binding layer makes no reductions.

  3. Chain order
     Nodes in upstream view chains are ordered
     abstract→concrete (INTEL=0, SIG-41=1, SIG-40=2, EVID=3),
     then by node_id within each layer. This ordering is
     deterministic and consistent across calls.

  4. Status faithfulness
     The status fields in all views faithfully reflect the
     ENL engine's assessment. "complete" is returned only
     when ENL confirms EVID termination. "incomplete" is
     surfaced explicitly — never silenced.

  5. No enrichment
     The binding layer never appends computed values,
     external data, or inferred relationships to any
     view structure. All data in every view originates
     in the ENL graph.

────────────────────────────────────────────────────────────
Error Propagation Model
────────────────────────────────────────────────────────────

The binding layer translates ENL exceptions into Lens
exceptions so that Lens does not need to import ENL
exception types. All error messages are preserved verbatim.

EXCEPTION TRANSLATION TABLE
────────────────────────────

  ENL exception            → Lens exception
  ────────────────────────────────────────────
  ENLNodeNotFoundError     → LensNodeNotFoundError
  ENLTransitionError       → LensTransitionError
  ENLTraversalError        → LensTraversalError
  (bad parameter)          → LensInvalidRequestError  (binding-layer only)

BINDING-LAYER ERRORS
─────────────────────

  LensInvalidRequestError
    Raised by the binding layer (not the engine) when a
    required parameter is empty or not a string. Prevents
    malformed requests from reaching the engine.

STATUS-BASED ERROR SIGNALS
───────────────────────────

Not all failure conditions raise exceptions. Two conditions
are represented as explicit status values:

  "incomplete" in upstream view
    Chain traversal halted before EVID. The error field
    names the failure point. Lens must surface this state
    to the consumer — it must not present an incomplete
    chain as resolved.

  "empty" in query view
    No nodes matched the query_id. Not an error — a valid
    informational state. Lens renders it as an empty result.

  "partial" in query view
    The query returned nodes but at least one upstream chain
    was incomplete. Lens must surface this state explicitly.

NO SILENT FALLBACK
───────────────────

The binding layer does not provide default values, fallback
nodes, or placeholder content when ENL fails. If the engine
raises, the binding layer raises. If the engine returns
incomplete, the binding layer returns incomplete. The
consumer (Lens) is responsible for handling all non-"complete"
states visibly.

────────────────────────────────────────────────────────────
Persona Boundary Definition
────────────────────────────────────────────────────────────

apply_persona(view, persona_config) is defined as a
placeholder in v1. It accepts a view and a persona
configuration dict and returns the view unchanged.

This function reserves the extension point for future
persona rendering logic per ENL-002A Section F.

INVARIANTS ENFORCED BY PLACEHOLDER IMPLEMENTATION
───────────────────────────────────────────────────

  - No ENL node fields are altered.
  - No nodes are removed from any view structure.
  - No fields are injected into ENL node dicts.
  - The view returned is structurally identical to
    the view received.

CONSTRAINTS FOR FUTURE PERSONA IMPLEMENTATION
───────────────────────────────────────────────

Any future implementation of apply_persona must comply with
ENL-002A Section F (Persona Layer):

  - Permitted: layer emphasis, label relabelling for display,
    entry point selection, confidence thresholding as a
    display filter.
  - Forbidden: altering node_type, node_id, run_id, status,
    source_ref, derived_from, or created_at; navigation
    shortcuts; synthetic EVID termination.
  - Persona configuration must remain in the Lens layer.
    It must not be written to ENL graph files or schema files.

────────────────────────────────────────────────────────────
Implementation Reference
────────────────────────────────────────────────────────────

  scripts/pios/enl/lens_binding_v1.py
    → Binding module implementation

  scripts/pios/enl/test_lens_binding.py
    → 77-test suite (100% PASS)

  scripts/pios/enl/enl_query_engine_v1.py
    → ENL-003 engine (the only dependency)

────────────────────────────────────────────────────────────
Alignment with ENL-002A Boundary Rules
────────────────────────────────────────────────────────────

  ENL-002A Section B (Allowed Operations)
  → The binding layer exposes exactly the two retrieval modes
    defined in ENL-002A (full graph retrieval, query-scoped
    subgraph retrieval) plus node, upstream, and downstream
    operations. No other retrieval modes are introduced.

  ENL-002A Section C (Forbidden Operations)
  → C.1–C.9: All prohibitions are structurally impossible
    in the binding layer. No mutation path exists.
  → C.10 (no filtering that alters graph composition):
    bind_get_query_view returns the engine subgraph in full.
    seed_nodes is an annotation on the already-returned
    subgraph — it does not reduce the subgraph.

  ENL-002A, Section A (Separation of Concerns)
  → ENL owns filtering: all filtering is performed by the
    engine before results reach the binding layer.
  → Lens owns rendering: the binding layer produces
    render-ready structures without making display decisions.

────────────────────────────────────────────────────────────
Acceptance Criteria
────────────────────────────────────────────────────────────

  ✓ Binding architecture defined (ENL → Lens)
  ✓ Data flow documented for all 4 binding functions
  ✓ Rendering invariants declared
  ✓ Error propagation model complete
  ✓ Persona boundary formally defined
  ✓ Implementation: 4 binding functions + persona placeholder
  ✓ Test suite: 77/77 PASS
  ✓ ENL-002A boundary respected in all functions
  ✓ No logic leakage from ENL into Lens

────────────────────────────────────────────────────────────
Definition of Done
────────────────────────────────────────────────────────────

  - Lens wraps ENL outputs correctly via binding functions
  - ENL-002A boundary respected throughout
  - Rendering model usable for next layer (Lens UI / API)
  - No logic re-implementation in the binding layer
  - No traversal, validation, or filtering in Lens
  - Persona extension point reserved and constrained

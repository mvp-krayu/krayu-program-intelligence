ENL-003 — Traversal / Query Layer
────────────────────────────────────────────────────────────

Program
Krayu — Program Intelligence Discipline

Date
2026-03-21

Contract
ENL-003-CONTRACT-v1 · run_01_blueedge

────────────────────────────────────────────────────────────
Purpose
────────────────────────────────────────────────────────────

This document defines the traversal and query model for the
Evidence Navigation Layer (ENL). It specifies how structured
queries are executed against an ENL graph, what guarantees
apply to every result, and how failures are surfaced.

The implementation of this model is in:
  scripts/pios/enl/enl_query_engine_v1.py

ENL-003 sits between the ENL graph (ENL-002) and the Lens
integration boundary (ENL-002A):

  ENL graph artifacts (ENL-002)
       ↓
  ENL-003 — Traversal / Query Layer   ← THIS LAYER
       ↓
  Lens (ENL-002A boundary)

────────────────────────────────────────────────────────────
A. Query Types
────────────────────────────────────────────────────────────

Five query functions are defined. All are read-only. All
operate against a loaded and validated ENL graph object.
None modifies graph state.

──────────────────────────────────
A.1 get_graph(run_id)
──────────────────────────────────

Returns the complete ENL graph for the given run_id.

Input
  run_id: string — the execution context identifier

Behaviour
  Returns all nodes in the graph whose run_id matches the
  requested value. In v1, a loaded graph file contains
  exactly one run_id, so this is equivalent to returning
  all nodes in the graph.

  Node list is ordered deterministically: sorted by node_id
  (ascending lexicographic).

Output structure
  {
    "status":   "ok",
    "run_id":   "<run_id>",
    "count":    <integer>,
    "nodes":    [ <node>, ... ]
  }

Failure conditions
  - run_id not present in graph → status "empty", nodes []

──────────────────────────────────
A.2 get_node(node_id)
──────────────────────────────────

Returns a single node by its node_id.

Input
  node_id: string — unique node identifier within the graph

Behaviour
  Looks up the node in the graph's node map. Returns the full
  node object with all required fields unchanged.

Output structure
  {
    "status":  "ok",
    "node_id": "<node_id>",
    "node":    { <all node fields> }
  }

Failure conditions
  - node_id does not exist in graph → ENLNodeNotFoundError

──────────────────────────────────
A.3 get_upstream_chain(node_id)
──────────────────────────────────

Traverses the ENL graph from the given node upward through
all derived_from references, following the layer hierarchy
toward EVID.

Input
  node_id: string — starting node; any node type is valid
                    as a start point

Behaviour
  1. Resolve the start node.
  2. Follow all derived_from references recursively, one
     layer at a time.
  3. At each step, validate that the layer transition is
     permitted per enl_graph_rules_v1.
  4. Continue until all reachable upstream nodes have been
     visited. Traversal halts naturally at EVID nodes
     (derived_from is empty).
  5. Detect and reject cycles (not expected in v1; fail fast
     if encountered).

  Output nodes are sorted by node_id within each layer.
  Layer order is preserved: start node first, EVID last.

Output structure — complete chain
  {
    "status":            "complete",
    "start_node_id":     "<node_id>",
    "nodes":             [ <node>, ... ],
    "layer_sequence":    [ "<type>", ... ],
    "terminates_in_evid": true,
    "error":             null
  }

Output structure — incomplete chain
  {
    "status":            "incomplete",
    "start_node_id":     "<node_id>",
    "nodes":             [ <node>, ... ],
    "layer_sequence":    [ "<type>", ... ],
    "terminates_in_evid": false,
    "error":             "<reason>"
  }

Failure conditions
  - start node_id does not exist → ENLNodeNotFoundError
  - derived_from reference does not resolve → status "incomplete",
    error describes missing node_id
  - layer transition is forbidden → ENLTransitionError (fail fast)
  - cycle detected → ENLTraversalError (fail fast)

──────────────────────────────────
A.4 get_downstream_nodes(node_id)
──────────────────────────────────

Returns all nodes that directly reference the given node_id
in their derived_from array. This is the reverse direction
of get_upstream_chain — one level only, not recursive.

Input
  node_id: string — the node whose consumers are requested

Behaviour
  Scans all nodes in the graph. Returns any node whose
  derived_from array contains the requested node_id.

  Result is sorted by node_id (ascending lexicographic).

Output structure
  {
    "status":         "ok",
    "source_node_id": "<node_id>",
    "downstream":     [ <node>, ... ],
    "count":          <integer>
  }

Failure conditions
  - source node_id does not exist → ENLNodeNotFoundError

  A node with no downstream consumers returns status "ok"
  with an empty downstream list and count 0. This is not
  a failure.

──────────────────────────────────
A.5 get_query_subgraph(query_id)
──────────────────────────────────

Returns the complete ENL subgraph associated with a specific
intelligence query identifier.

Input
  query_id: string — intelligence query identifier (e.g. "GQ-003")

Behaviour
  Phase 1 — seed resolution
    Find all nodes whose source_ref contains the query_id as
    a substring. These are the nodes explicitly grounded in
    the query artifact.

  Phase 2 — upstream expansion
    For each seed node, traverse all derived_from references
    upstream (same algorithm as get_upstream_chain) and
    collect all reachable nodes.

  Phase 3 — union and deduplication
    Merge all reached node sets. Deduplicate by node_id.
    Sort result by node_id (ascending lexicographic).

  All filtering logic is executed within ENL. The returned
  node set is complete and unfiltered — Lens renders it
  as received. Lens may not reduce this set.

Output structure
  {
    "status":   "ok",
    "query_id": "<query_id>",
    "nodes":    [ <node>, ... ],
    "count":    <integer>
  }

  If no seed nodes are found:
  {
    "status":   "empty",
    "query_id": "<query_id>",
    "nodes":    [],
    "count":    0
  }

Failure conditions
  - A seed node's upstream chain contains an invalid transition
    → ENLTransitionError (fail fast)
  - A derived_from reference does not resolve → upstream chain
    returns incomplete; subgraph still returns all reachable
    nodes but marks status "incomplete"

────────────────────────────────────────────────────────────
B. Traversal Semantics
────────────────────────────────────────────────────────────

STRICT DERIVED_FROM TRAVERSAL
──────────────────────────────

All traversal is performed by following derived_from arrays
exactly as declared in the graph. No relationship is inferred,
computed, or assumed. If a relationship is not declared in
derived_from, it does not exist for traversal purposes.

LAYER-BY-LAYER ENFORCEMENT
───────────────────────────

At every traversal step, the engine resolves the node type
of the current node and the node type of each upstream
reference. The transition is validated against the
allowed_transitions table in enl_graph_rules_v1.json:

  INTEL   → may only reference SIG-41
  SIG-41  → may only reference SIG-40
  SIG-40  → may only reference EVID
  EVID    → may not reference any node (derived_from must be [])

If any transition violates this table, the engine raises
ENLTransitionError immediately. Traversal does not continue
past a violation.

NO SHORTCUTS
────────────

The engine does not provide any traversal path that skips
layers. A direct link from INTEL to EVID is not only
forbidden — it is unreachable by the traversal functions.
The layer-by-layer check would raise ENLTransitionError
before it could be followed.

NO INFERENCE
────────────

The engine never infers that two nodes are related based on:
- shared signal IDs in node titles
- matching source_ref patterns
- node_id naming conventions
- layer position or proximity

The only basis for a relationship is an explicit entry in
a derived_from array.

────────────────────────────────────────────────────────────
C. Determinism Rules
────────────────────────────────────────────────────────────

SAME INPUT → SAME OUTPUT
─────────────────────────

Given the same graph file and the same query parameters,
every query function must return the identical result on
every invocation. The engine has no internal state. It does
not cache, mutate, or accumulate data between calls.

NO RANDOMNESS
─────────────

The engine uses no random number generators, no UUIDs, and
no time-dependent logic. All results are computed solely
from the declared structure of the input graph.

NO ORDERING AMBIGUITY
─────────────────────

Wherever a collection of nodes is returned, the ordering
rule is unambiguous and applied uniformly:

  Primary sort:   node_id ascending (lexicographic)
  Secondary sort: none required — node_ids are unique

This rule applies to: get_graph node lists, upstream chain
results (within each layer), downstream node lists,
query subgraph node lists.

The layer_sequence field in get_upstream_chain results
reflects the actual traversal order from start to EVID and
is determined by the graph structure, not by sorting.

────────────────────────────────────────────────────────────
D. Failure Handling
────────────────────────────────────────────────────────────

The engine is fail-fast and fail-visible. No failure is
silenced. No partial result is presented as complete.

MISSING NODE
────────────

If get_node, get_upstream_chain, or get_downstream_nodes
is called with a node_id that does not exist in the graph:
  → raises ENLNodeNotFoundError
  → message includes the missing node_id

If a derived_from reference within a chain cannot be
resolved to an existing node during traversal:
  → get_upstream_chain returns status "incomplete"
  → error field names the unresolvable reference
  → nodes collected up to the point of failure are included
  → terminates_in_evid is false

INVALID TRANSITION
──────────────────

If traversal encounters a layer transition that is not
permitted by enl_graph_rules_v1:
  → raises ENLTransitionError immediately
  → message includes: from_node_id, from_type, to_node_id,
    to_type, and the reason (cross-layer shortcut, reverse
    direction, or same-layer derivation)
  → no partial result is returned for that traversal

INCOMPLETE CHAIN
────────────────

An incomplete chain is one where traversal cannot reach
an EVID node. This occurs when:
  - a non-EVID node has an empty derived_from (schema
    violation — the graph would have failed validate_graph)
  - a derived_from reference cannot be resolved

In all incomplete cases:
  → status is explicitly "incomplete"
  → terminates_in_evid is false
  → error field describes the condition
  → the incomplete result is never presented as resolved

GRAPH VALIDATION FAILURE
─────────────────────────

validate_graph checks all structural constraints before any
query is executed. If the graph fails validation:
  → raises ENLValidationError
  → message lists all violated constraints
  → no query may be executed against an invalid graph

────────────────────────────────────────────────────────────
E. Output Contract
────────────────────────────────────────────────────────────

JSON STRUCTURE
──────────────

All query functions return Python dicts that are directly
serialisable to JSON. No output contains Python-specific
types (sets, tuples, custom objects in the result body).

NODE REPRESENTATION
────────────────────

Every node in any output is returned with all required
fields intact and unmodified:

  node_id, node_type, run_id, title, status,
  derived_from, source_ref, created_at

The engine does not add, remove, or alter fields. The node
in the output is the node as stored in the graph.

FULL CHAIN REQUIREMENT
───────────────────────

get_upstream_chain results for a complete chain starting
at an INTEL node will include all four node types in order:
  [ INTEL node, SIG-41 node(s), SIG-40 node(s), EVID node ]

If the chain is not complete, status "incomplete" is
returned with whatever nodes were reachable, and the
error field explains where traversal stopped.

STATUS FIELD SEMANTICS
───────────────────────

  "ok"         → operation succeeded; result is complete
  "complete"   → chain traversal reached EVID successfully
  "incomplete" → traversal halted before EVID; error is set
  "empty"      → no matching nodes found; not an error
  "error"      → reserved for engine-level failures

────────────────────────────────────────────────────────────
F. Performance Constraints
────────────────────────────────────────────────────────────

These are conceptual constraints for v1. They define what
the engine does not do, not what it optimises.

NO CACHING
──────────

The v1 engine performs no caching of traversal results,
node lookups, or subgraph computations between calls.
Every call resolves the graph from the in-memory structure
passed as argument. A caller that needs to call multiple
query functions against the same graph calls load_graph
once, validate_graph once, and then calls query functions
as needed — the graph object is passed to each function.

NO PARTIAL GRAPH MUTATION
──────────────────────────

No query function modifies the graph dict passed to it.
The engine treats graph as immutable. A caller may safely
call multiple query functions against the same graph object
and receive consistent results.

GRAPH SIZE
──────────

v1 does not define size limits. The engine operates on
whatever graph is loaded from the input file. Performance
characteristics for large graphs are out of scope for v1.

────────────────────────────────────────────────────────────
Implementation Reference
────────────────────────────────────────────────────────────

  scripts/pios/enl/enl_query_engine_v1.py
    → full implementation of all query functions

  scripts/pios/enl/test_enl_query_engine.py
    → test coverage for all query functions and failure cases

  docs/pios/enl/examples/ENL-002_minimal_graph_example.json
    → reference graph used by tests

────────────────────────────────────────────────────────────
Alignment with ENL-001, ENL-002, ENL-002A
────────────────────────────────────────────────────────────

  ENL-001 Principle 1 (No Computation)
  → The query engine resolves, links, and exposes. It does
    not compute, transform, or generate signals.

  ENL-001 Principle 2 (Deterministic Traversal)
  → Section C (Determinism Rules) fully formalises this.
    Same input, same output. No state. No randomness.

  ENL-001 Principle 3 (Evidence First Enforcement)
  → Incomplete chains are explicit failures. The engine
    never presents a chain without EVID as resolved.

  ENL-001 Principle 4 (Layer Integrity)
  → Section B (Traversal Semantics) enforces strict
    layer-by-layer traversal. Shortcuts are structurally
    impossible within the defined query functions.

  ENL-001 Principle 5 (Progressive Concreteness)
  → Traversal direction is from abstract (INTEL) to concrete
    (EVID). Reverse transitions raise ENLTransitionError.

  ENL-001 Principle 6 (Run Awareness)
  → validate_graph enforces that all nodes in a graph share
    the same run_id. get_query_subgraph operates within a
    single validated graph and cannot produce cross-run results.

  ENL-002 Schema Conformance
  → All query outputs return nodes with full required fields.
    The engine validates schema compliance before any query
    is permitted.

  ENL-002A Boundary Compliance
  → All query functions are read-only. The engine exposes no
    write path. Filtering (query scoping) is executed by ENL.
    Lens receives the complete result and may not reduce it.

────────────────────────────────────────────────────────────
Acceptance Criteria
────────────────────────────────────────────────────────────

  ✓ All five query types defined with input, output, and
    failure behaviour
  ✓ Traversal semantics: strict, layer-by-layer, no inference
  ✓ Determinism formally specified
  ✓ All failure conditions explicit and non-silent
  ✓ Output contract complete with JSON structures
  ✓ Performance scope boundaries declared for v1
  ✓ Implementation and tests created and passing
  ✓ Compatible with Lens boundary (ENL-002A)
  ✓ Ready for ENL-004+

────────────────────────────────────────────────────────────
Definition of Done
────────────────────────────────────────────────────────────

  - Traversal / query model fully documented
  - All sections A–F complete with no placeholders
  - Engine implementation passing all tests
  - Model consistent with ENL-001, ENL-002, ENL-002A
  - Stream ready for next execution stage

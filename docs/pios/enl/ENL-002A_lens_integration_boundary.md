ENL-002A — Lens Integration Boundary
────────────────────────────────────────────────────────────

Program
Krayu — Program Intelligence Discipline

Date
2026-03-21

Contract
ENL-002A-CONTRACT-v1 · run_01_blueedge
Amended
2026-03-21 — filtering responsibility assigned to ENL; Section B retrieval
             model restructured; Section C prohibition C.10 added

────────────────────────────────────────────────────────────
Purpose
────────────────────────────────────────────────────────────

This document defines the formal integration boundary between
the Evidence Navigation Layer (ENL) and the Lens layer.

ENL is the system of record for evidence-anchored navigation.
Lens is the interface layer that renders ENL structures for
human or system consumers.

This boundary is structural and non-negotiable. It cannot be
relaxed by rendering logic, persona configuration, or query
design. It governs all current and future Lens implementations.

────────────────────────────────────────────────────────────
A. Layer Responsibility Model
────────────────────────────────────────────────────────────

ENL RESPONSIBILITIES
────────────────────

ENL owns the following exclusively:

  1. Graph structure
     The authoritative definition of nodes, edges (derived_from),
     and layer membership (INTEL, SIG-41, SIG-40, EVID).

  2. Traversal rules
     All permitted and forbidden layer transitions as declared
     in enl_graph_rules_v1.json. ENL enforces these. No
     external system may override or reinterpret them.

  3. Evidence termination
     The requirement that every navigation path terminates in
     an EVID node. This is enforced at the graph level, not
     the rendering level.

  4. Run-awareness
     The binding of all nodes to a run_id. ENL enforces that
     cross-run links do not exist within a graph.

  5. Node lifecycle
     The status field of each node (defined, active, validated,
     blocked, rejected) is owned by ENL. Lens may display
     status but may not modify it.

  6. Source provenance
     The source_ref field on each node is owned by ENL. It is
     the canonical pointer to the artifact that grounds the node.

  7. Graph composition filtering
     All logic that determines which nodes are included in a
     response — whether by run_id, query scope, layer, or any
     other declared criterion — is owned and executed by ENL.
     Lens may not apply filtering logic that alters or reduces
     the node set returned by ENL. What ENL returns is the graph.
     Lens renders it in full.

LENS RESPONSIBILITIES
─────────────────────

Lens owns the following exclusively:

  1. Rendering
     Translating ENL node data into human-readable or
     machine-consumable output. Lens controls how nodes are
     displayed — layout, labels, formatting, grouping.

  2. Persona projection
     Applying persona-specific views over ENL graph output
     without altering the underlying graph. A persona may
     suppress certain layers from display, emphasize specific
     signals, or reformat titles — but may not change node
     content, type, or relationships.

  3. Navigation UI
     Managing the user interaction model for traversal —
     which node the user is currently viewing, what is
     expanded or collapsed, scroll position, and step
     sequencing in guided flows.

  4. Query surface
     Accepting intelligence query selections from users or
     automated callers, and requesting the corresponding
     ENL subgraph from the ENL layer.

  5. Display state
     Lens maintains its own ephemeral state: selected node,
     active query, persona mode, step index. This state is
     separate from ENL graph state and does not persist
     back into ENL.

SEPARATION OF CONCERNS
───────────────────────

  ENL produces graph structure.
  Lens consumes and renders graph structure.

  ENL enforces navigation rules.
  Lens follows navigation rules.

  ENL owns filtering logic.
  Lens does not filter graph composition.

  ENL holds provenance.
  Lens exposes provenance.

  ENL fails closed if evidence is missing.
  Lens reflects failure — it does not compensate for it.

  There is no shared mutable state between ENL and Lens.
  All communication is unidirectional: ENL → Lens.
  Lens has no write path into ENL.

────────────────────────────────────────────────────────────
B. Allowed Operations (Lens → ENL)
────────────────────────────────────────────────────────────

Lens is permitted to perform the following operations against
ENL, all of which are read-only.

RETRIEVAL MODES
───────────────

Lens may request graph data in exactly two modes:

  1. Full graph retrieval
     Request the complete ENL graph for a given run_id.
     ENL returns all nodes with all fields.
     Lens may not reduce, filter, or recompose the returned
     node set. What ENL returns is the authoritative graph.
     Lens renders it in full.

  2. Query-scoped subgraph retrieval
     Request the ENL subgraph scoped to a specific intelligence
     query identifier (e.g. GQ-003).
     The scoping criterion is declared by Lens as a query
     parameter. All filtering logic — determining which nodes
     satisfy the scope — is executed by ENL, not by Lens.
     ENL returns the complete scoped subgraph. Lens may not
     further reduce the returned node set.

No other retrieval modes exist in v1. Lens may not construct
ad-hoc filters, apply layer masks at the ENL boundary, or
request partial graphs outside these two modes.

NODE AND TRAVERSAL OPERATIONS
──────────────────────────────

  3. Node retrieval
     Request a single node by node_id.
     ENL returns the node with all required fields.

  4. Upstream traversal (drill-down)
     Given a node, follow its derived_from references to
     retrieve upstream nodes, one layer at a time.
     This must follow the permitted layer transitions defined
     in enl_graph_rules_v1.json. Lens must not implement
     shortcut traversal that skips layers.

  5. Downstream traversal (roll-up)
     Given an EVID or intermediate node, find all nodes that
     declare it in their derived_from array, traversing back
     toward INTEL. This is the reverse navigation direction.
     Lens may expose this view but must not infer links that
     are not explicitly declared.

  6. Status inspection
     Read the status field on any node to determine lifecycle
     state. Lens may use this to adjust display (e.g. dim
     blocked nodes) but may not alter the status value.

  7. Source reference resolution
     Read the source_ref field and, if capable, render it as
     a navigable link (e.g. an Obsidian deep link or file path).
     The link target is the source artifact — Lens resolves
     the path but does not own it.

────────────────────────────────────────────────────────────
C. Forbidden Operations
────────────────────────────────────────────────────────────

The following operations are unconditionally forbidden for Lens.
None of these prohibitions may be suspended by configuration,
feature flag, persona mode, or runtime override.

  1. Altering node semantics
     Lens may not change the meaning of any node field.
     It may reformat a title for display; it may not rewrite
     it. It may translate a node_type label; it may not
     reclassify the node.

  2. Bypassing layer transitions
     Lens may not navigate directly from an INTEL node to an
     EVID node, skipping SIG-41 and SIG-40. All traversal
     must step through each layer in the declared order.

  3. Introducing alternative navigation paths
     Lens may not create, cache, or expose any navigation path
     that is not explicitly declared in the ENL graph via
     derived_from. Inferred, computed, or probabilistic links
     are forbidden.

  4. Modifying run_id
     Lens may not alter the run_id on any node, assign a
     new run_id, or present a graph as belonging to a
     different run than declared.

  5. Linking across runs
     Lens may not construct navigation paths that combine
     nodes from different run_ids. Cross-run comparison
     views may be presented as separate parallel structures,
     but they must never be merged into a single navigation
     chain.

  6. Generating synthetic nodes inside ENL
     Lens may not create, insert, or simulate ENL nodes that
     do not exist in the authoritative graph. Placeholder
     nodes, loading states that masquerade as graph nodes,
     and interpolated intermediate nodes are all forbidden.

  7. Modifying source_ref
     Lens may not alter the source_ref field of any node, nor
     substitute a different artifact reference at display time.

  8. Mutating status
     Lens may not change the status field on any node,
     regardless of user interaction or system event.

  9. Suppressing EVID
     Lens may not render a navigation chain as complete
     if the chain has not reached an EVID node. If traversal
     is incomplete, Lens must reflect this state explicitly
     rather than presenting a truncated chain as resolved.

  10. Applying filtering logic that alters graph composition
     Lens may not filter, reduce, mask, or recompose the node
     set returned by ENL — regardless of the mechanism used
     (persona configuration, display state, runtime parameter,
     or feature flag). Filtering logic that determines graph
     composition belongs exclusively to ENL and is executed
     before the response reaches Lens. Once ENL has returned
     a graph or subgraph, Lens renders it as received.
     Lens-side display suppression (e.g. collapsing a node in
     the UI) is permitted as a rendering choice and does not
     constitute graph composition filtering, provided the
     suppressed node remains present in the Lens data model
     and navigable on demand.

────────────────────────────────────────────────────────────
D. Rendering Model
────────────────────────────────────────────────────────────

Lens may render ENL graph data in any format that satisfies
the following constraints:

INVARIANTS
──────────

  - Rendering never modifies the underlying graph.
  - All displayed content is derived from ENL node fields.
  - No content is fabricated, inferred, or supplemented by
    Lens-internal logic.
  - Every visible claim about a node (its type, its source,
    its status, its relationships) must be directly traceable
    to an ENL field value.

PERMITTED RENDERING CHOICES
────────────────────────────

  - Label formatting: Lens may apply typography, truncation,
    icon decoration, or color coding to node labels.
    The underlying title and node_type values are not changed.

  - Layer grouping: Lens may group nodes by layer type
    (INTEL, SIG-41, SIG-40, EVID) for clarity. The layer
    assignment is ENL-owned; the visual grouping is Lens-owned.

  - Collapsing and expanding: Lens may allow users to expand
    or collapse portions of the graph in the UI. Collapsed
    nodes are not deleted from the graph — they are hidden
    in the render only.

  - Source link rendering: Lens may render source_ref as a
    hyperlink, Obsidian deep link, or plain text path.
    The reference value itself is unchanged.

  - Status decoration: Lens may visually differentiate node
    lifecycle states (e.g. greying out blocked nodes).
    The status value in ENL is unchanged.

  - Confidence display: Where signal nodes carry confidence
    values in their source artifact, Lens may surface these
    in the rendered view. These values originate in the
    source artifact; Lens does not compute them.

────────────────────────────────────────────────────────────
E. Navigation Contract
────────────────────────────────────────────────────────────

START POINTS
────────────

Navigation must begin at an INTEL node. INTEL nodes represent
the intelligence output layer — the highest abstraction level.
Lens must not allow a user to begin navigation mid-chain (e.g.
starting at SIG-41 and treating it as an origin). If Lens
exposes an entry point, it must be an INTEL node or the full
graph view showing all INTEL nodes as primary entry points.

TRAVERSAL RULES
───────────────

Traversal follows the derived_from relationship, moving
upstream (toward more concrete evidence):

  INTEL → SIG-41 → SIG-40 → EVID

At each step, Lens requests the upstream node(s) declared in
the current node's derived_from array. Lens must not:

  - Skip a layer
  - Merge layers in a single traversal step
  - Follow a derived_from reference that points to a
    forbidden transition (as defined in enl_graph_rules_v1.json)

If a derived_from reference resolves to a node of a
non-permitted upstream type, Lens must surface this as a
graph integrity error, not silently skip the node or
substitute an alternative.

TERMINATION REQUIREMENT
────────────────────────

Every navigation path must terminate at an EVID node.
Lens must treat any chain that does not reach EVID as
incomplete and must present this state explicitly to the
consumer — it must not render an incomplete chain as a
resolved evidence path.

Termination is confirmed when:

  1. The current node is of type EVID.
  2. Its derived_from array is empty.
  3. No further upstream traversal is possible.

REVERSE NAVIGATION
──────────────────

Lens may support reverse navigation (roll-up from EVID toward
INTEL) for consumers who need to understand which intelligence
outputs depend on a given evidence artifact. Reverse navigation
must use only explicitly declared derived_from relationships.
Lens must not infer reverse links from context or similarity.

────────────────────────────────────────────────────────────
F. Persona Layer
────────────────────────────────────────────────────────────

A persona is a named rendering configuration that shapes how
ENL graph content is presented to a specific consumer type
(e.g. executive, program lead, engineer).

Personas are a Lens construct. They have no presence inside
the ENL graph.

PERMITTED PERSONA OPERATIONS
──────────────────────────────

  - Layer emphasis: A persona may configure which layers are
    prominently displayed and which are visible but de-emphasized.
    All layers remain navigable; the persona adjusts the visual
    weight, not the navigability.

  - Label relabelling: A persona may substitute display-facing
    labels for ENL node titles (e.g. rendering a SIG-41 node
    title as a plain-language statement for an executive view).
    The underlying title field in ENL is unchanged.
    The substituted label must remain semantically faithful to
    the original — it must not change the meaning.

  - Entry point selection: A persona may configure which
    INTEL nodes appear as primary entry points in its view.
    This does not remove nodes from the graph; it scopes the
    rendered view.

  - Confidence thresholding: A persona may configure a minimum
    display confidence threshold for signal nodes, causing
    low-confidence nodes to be de-emphasized or hidden in the
    rendered view. The nodes remain in the ENL graph. The
    threshold is a display filter, not a deletion.

FORBIDDEN PERSONA OPERATIONS
──────────────────────────────

  - Personas may not alter node_type, node_id, run_id,
    status, source_ref, derived_from, or created_at.
  - Personas may not introduce navigation shortcuts that
    bypass layer transitions.
  - Personas may not create the appearance of EVID
    termination where none exists in the graph.
  - Personas may not synthesize intelligence by combining
    ENL node content with external data not grounded in
    the ENL graph.

PERSONA ISOLATION
─────────────────

Persona configuration is stored and applied entirely within
the Lens layer. It must not be written into ENL graph files,
ENL schema files, or any ENL artifact. A persona is a view
instruction, not a graph mutation.

────────────────────────────────────────────────────────────
G. Integrity Guarantees
────────────────────────────────────────────────────────────

The following invariants hold at all times across the
ENL–Lens boundary. They cannot be suspended.

  1. ENL graph immutability at the boundary
     The ENL graph is read-only from Lens's perspective.
     No Lens operation — including rendering, persona
     projection, traversal, or display state management —
     results in a write to ENL graph data.

  2. Full traceability to EVID
     Every intelligence output rendered by Lens is traceable,
     via the declared derived_from chain, to at least one
     EVID node. If this trace cannot be completed, Lens must
     not present the output as resolved intelligence.

  3. Layer integrity preservation
     The four-layer structure (INTEL → SIG-41 → SIG-40 → EVID)
     is enforced in all navigation paths presented by Lens.
     No rendering model may collapse, merge, or skip layers.

  4. Run-context fidelity
     Lens renders nodes within the run context declared by
     their run_id. Lens does not blend node populations from
     different runs into a single navigation chain.

  5. Source provenance exposure
     For every node rendered, the source_ref field is
     available to the consumer — either directly displayed
     or accessible on demand. Lens may not suppress
     source provenance.

  6. Failure transparency
     If ENL returns an error, an incomplete graph, or a
     chain that cannot reach EVID, Lens surfaces this
     condition explicitly. It does not mask failures with
     synthetic completions or fallback content.

  7. No inference in the navigation layer
     All relationships presented by Lens are declared in
     ENL derived_from arrays. No relationship is computed,
     inferred, probabilistic, or implied. The only valid
     claim Lens can make about a relationship between two
     nodes is one declared explicitly in ENL.

────────────────────────────────────────────────────────────
Alignment with ENL-001 and ENL-002
────────────────────────────────────────────────────────────

  ENL-001 Principle 1 (No Computation)
  → Lens is the only layer that renders. ENL does not render.
    ENL does not compute display logic. This boundary makes
    Principle 1 structurally enforceable: if Lens never writes
    to ENL, ENL cannot accumulate rendering concerns.

  ENL-001 Principle 2 (Deterministic Traversal)
  → Lens must follow derived_from arrays exactly as declared.
    Determinism is preserved because Lens has no mechanism to
    introduce alternative paths.

  ENL-001 Principle 3 (Evidence First Enforcement)
  → Lens is forbidden from presenting incomplete chains as
    resolved. This enforces the evidence-first guarantee at
    the display layer.

  ENL-001 Principle 4 (Layer Integrity)
  → Lens traversal must step through each layer in order.
    The forbidden operations in Section C make layer collapse
    impossible to implement within the allowed operations.

  ENL-001 Principle 5 (Progressive Concreteness)
  → The navigation contract in Section E mandates that each
    traversal step increases concreteness. Start at INTEL,
    end at EVID. Shortcuts are forbidden.

  ENL-001 Principle 6 (Run Awareness)
  → Lens may not merge nodes from different runs. Cross-run
    comparison, if surfaced, must be rendered as parallel
    structures, not as a unified navigation chain.

  ENL-002 Schema Conformance
  → Lens consumes nodes that conform to enl_node_schema_v1.
    Lens must not assume fields beyond those declared in the
    schema, and must not require ENL to produce non-schema
    fields to support rendering.

────────────────────────────────────────────────────────────
Readiness for ENL-003
────────────────────────────────────────────────────────────

This boundary document is a precondition for ENL-003
(Traversal / Query Layer). ENL-003 will define the formal
query interface through which Lens requests ENL subgraphs.

The constraints established in this document govern ENL-003
design. Specifically:

  - ENL-003 must not expose any operation that would allow
    Lens to bypass the restrictions in Section C.
  - ENL-003 query responses must always include the full
    derived_from chain to EVID, or explicitly signal that
    the chain is incomplete.
  - ENL-003 must not accept write operations from Lens.
  - ENL-003 traversal responses must be deterministic:
    the same query against the same graph must always
    return the same result.

────────────────────────────────────────────────────────────
Governance Rules
────────────────────────────────────────────────────────────

  - This boundary document may not be modified without
    issuing a new contract version (ENL-002A-CONTRACT-v2+).
  - No Lens implementation may declare itself exempt from
    the constraints defined here.
  - Section C (Forbidden Operations) may not be relaxed
    without a formal contract amendment and sign-off.
  - Any ENL-003 design that would require a Lens capability
    not permitted by this document must first amend this
    document before ENL-003 can proceed.

────────────────────────────────────────────────────────────
Acceptance Criteria
────────────────────────────────────────────────────────────

  ✓ Boundary between ENL and Lens is unambiguous
  ✓ No overlap in responsibilities between ENL and Lens
  ✓ No mechanism exists for Lens to bypass ENL constraints
  ✓ Document is consistent with ENL-001 and ENL-002
  ✓ Persona layer defined without structural coupling to ENL
  ✓ Integrity guarantees declared and non-negotiable
  ✓ Ready for ENL-003 (Traversal / Query Layer)

────────────────────────────────────────────────────────────
Definition of Done
────────────────────────────────────────────────────────────

  - ENL–Lens integration boundary fully documented
  - All seven sections (A–G) complete with no placeholders
  - No ambiguity in allowed or forbidden operations
  - No possibility for rendering logic to introduce
    structural or semantic drift into ENL
  - Document locked for ENL-002A-CONTRACT-v1

────────────────────────────────────────────────────────────
Sign-off Criteria
────────────────────────────────────────────────────────────

  - No shared mutable state between ENL and Lens
  - No Lens write path into ENL exists or is implied
  - Evidence-first guarantee enforced through to the
    rendering layer
  - All ENL-001 principles preserved at the boundary
  - ENL-003 preconditions satisfied

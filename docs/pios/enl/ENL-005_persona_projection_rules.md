ENL-005 — Persona Projection Rules
────────────────────────────────────────────────────────────

Program
Krayu — Program Intelligence Discipline

Date
2026-03-21

Contract
ENL-005-CONTRACT-v1 · run_01_blueedge

────────────────────────────────────────────────────────────
Purpose
────────────────────────────────────────────────────────────

This document defines the projection rules governing how
persona configuration is applied to Lens view structures.

ENL-005 projection is the final display-layer transformation
in the ENL stack. It operates on view structures produced by
the Lens Binding Layer (ENL-004) and adds display metadata
without altering ENL data.

────────────────────────────────────────────────────────────
Projection Architecture
────────────────────────────────────────────────────────────

Position in the stack:

  ENL graph artifacts (ENL-002)
       ↓
  ENL-003 — Query Engine
       ↓
  ENL-004 — Lens Binding Layer
       ↓
  ENL-005 — Persona Projection   ← THIS LAYER
       ↓
  Lens UI / API surface

Persona projection is the last transformation before
rendering. It touches only display metadata. It does not
call the engine. It does not call the binding layer. It
reads binding layer output and produces a projected output.

────────────────────────────────────────────────────────────
Strict Separation: Data vs Display
────────────────────────────────────────────────────────────

WHAT IS DATA
────────────

ENL data is everything declared in enl_node_schema_v1:

  node_id, node_type, run_id, title, status,
  derived_from, source_ref, created_at

These fields are owned by ENL. They are produced by the
graph and traversal layers. Persona projection has no write
access to any of them.

WHAT IS DISPLAY
───────────────

Display metadata is everything added by ENL-005:

  label, highlight, visible, confidence_flag

These fields live in the node_display block of the projected
view. They are keyed by node_id. They are not injected into
ENL node dicts. They are consumed by the rendering surface.

STRUCTURAL SEPARATION IN OUTPUT
────────────────────────────────

The projected view has this structure:

  {
    ... all original view fields unchanged ...

    "persona": {
      "persona_id": "<id>",
      "applied":    true
    },

    "node_display": {
      "<node_id>": {
        "label":           "<string>",
        "highlight":       true | false,
        "visible":         true | false,
        "confidence_flag": "low" | "normal"
      },
      ...
    }
  }

The ENL node dicts inside chain, subgraph, entry_node, node,
and nodes are the same object references as in the original
binding layer view. They are never copied, never modified.

────────────────────────────────────────────────────────────
Projection Rules per View Type
────────────────────────────────────────────────────────────

A. UPSTREAM VIEW PROJECTION
─────────────────────────────

  Input:  output of bind_get_upstream_view
  Output: projected upstream view

  Nodes processed:
    entry_node + all nodes in chain (deduplicated by node_id)

  All original fields preserved:
    status, entry_node, chain, terminates_in_evid, error

  node_display generated for:
    every node_id that appears in entry_node or chain

  Entry_node and chain list references are preserved.
  No node is added to or removed from chain.

B. QUERY VIEW PROJECTION
─────────────────────────

  Input:  output of bind_get_query_view
  Output: projected query view

  Nodes processed:
    seed_nodes + subgraph (deduplicated by node_id)

  All original fields preserved:
    status, query_id, seed_nodes, subgraph, count

  node_display generated for:
    every node_id in seed_nodes and subgraph

  seed_nodes and subgraph list references are preserved.
  No node is added to or removed from either list.

C. NODE VIEW PROJECTION
────────────────────────

  Input:  output of bind_get_node
  Output: projected node view

  Nodes processed:
    the single 'node' field

  All original fields preserved:
    status, node, upstream_available, downstream_available

  node_display generated for:
    the single node_id

  The 'node' reference is preserved. No fields are added to
  the ENL node dict.

D. FULL GRAPH VIEW PROJECTION
──────────────────────────────

  Input:  output of bind_get_full_graph
  Output: projected full graph view

  Nodes processed:
    all nodes in the 'nodes' list

  All original fields preserved:
    status, run_id, count, nodes

  node_display generated for:
    every node_id in nodes

────────────────────────────────────────────────────────────
Rule A — Label Projection
────────────────────────────────────────────────────────────

PURPOSE: provide human-friendly display names for nodes
without altering their stored titles.

RULE:
  If node_type is in label_map:
    display label = "<label_map[node_type]>: <node['title']>"
  Else:
    display label = node['title']

INVARIANTS:
  - node['title'] is never modified.
  - The label field lives in node_display, not in the ENL node.
  - The substituted label must reflect the meaning of the
    original title. Persona projection does not permit labels
    that misrepresent the underlying intelligence.
  - node['node_id'] is never modified.
  - node['node_type'] is never modified.

────────────────────────────────────────────────────────────
Rule B — Layer Emphasis
────────────────────────────────────────────────────────────

PURPOSE: visually differentiate layers of interest to a
given persona, without hiding or bypassing others.

RULE:
  If node['node_type'] is in layer_emphasis:
    highlight = true
  Else:
    highlight = false

INVARIANTS:
  - highlight is a boolean display flag.
  - A node not highlighted (highlight: false) is still present,
    still navigable, and still part of the evidence chain.
  - highlight: true does not grant any additional access or
    weight to a node in ENL terms.
  - All layer transitions remain enforced regardless of
    highlight values.

────────────────────────────────────────────────────────────
Rule C — Visibility (Display Collapse)
────────────────────────────────────────────────────────────

PURPOSE: allow a persona to configure which layers appear
collapsed by default, to reduce visual noise for consumer
types who do not need to see all layers immediately.

RULE:
  If visibility_rules[node_type] == "collapsed":
    visible = false
  Else (value is "visible" or key is absent):
    visible = true

INVARIANTS:
  - visible: false means the node is collapsed in the UI by
    default. It is NOT removed from the view.
  - The node with visible: false is still present in chain or
    subgraph. Node count before and after projection is identical.
  - A collapsed node is still navigable on demand by the Lens
    UI. Collapsing is an initial display state, not a deletion.
  - The projection layer does not remove nodes from any list.
    If a test confirms node count is identical pre/post projection,
    this invariant is satisfied.

────────────────────────────────────────────────────────────
Rule D — Confidence Projection
────────────────────────────────────────────────────────────

PURPOSE: allow a persona to tag nodes whose confidence score
falls below a configured threshold, so the rendering surface
can visually differentiate them.

RULE:
  If confidence_threshold is set AND node_id is in node_confidence:
    score = node_confidence[node_id]
    If score < confidence_threshold:
      confidence_flag = "low"
    Else:
      confidence_flag = "normal"
  Else:
    confidence_flag = "normal"

INVARIANTS:
  - confidence_flag: "low" is a display tag. The node is not
    removed from the view.
  - node['status'] is never modified. A node with
    confidence_flag: "low" may still have status: "validated"
    in ENL. These are orthogonal fields.
  - Nodes with no declared confidence score always receive
    confidence_flag: "normal". The projection layer never
    infers low confidence.
  - confidence_flag lives in node_display, not in the ENL
    node dict.

────────────────────────────────────────────────────────────
ENL-002A Section F Compliance
────────────────────────────────────────────────────────────

ENL-002A Section F defines the constraints on persona
overlays. The rules in this document satisfy them as follows:

  PERMITTED PERSONA OPERATIONS (ENL-002A F)
  ──────────────────────────────────────────

  Layer emphasis
  → Implemented by Rule B (highlight flag).
    All layers remain navigable (highlight does not remove).

  Label relabelling
  → Implemented by Rule A (label field in node_display).
    Underlying title is unchanged. Semantic faithfulness
    is required by the label_map contract.

  Entry point selection
  → Not implemented in v1. Reserved for future persona
    version. Entry point selection is a Lens UI concern —
    it does not alter ENL subgraph composition.

  Confidence thresholding
  → Implemented by Rule D (confidence_flag).
    "display filter, not a deletion" — nodes flagged
    "low" remain in all lists.

  FORBIDDEN PERSONA OPERATIONS (ENL-002A F)
  ──────────────────────────────────────────

  Altering node_type, node_id, run_id, status, source_ref,
  derived_from, or created_at
  → Structurally impossible. Projection adds node_display
    as a separate top-level block. ENL node dicts are never
    written to.

  Navigation shortcuts
  → Projection layer does not call engine or binding layer.
    No traversal occurs. No shortcuts are possible.

  Synthetic EVID termination
  → The terminates_in_evid field comes from the binding
    layer (which gets it from the engine). Persona projection
    preserves it unchanged. It cannot be set to true by
    persona config.

  Synthesising intelligence from external data
  → node_confidence is the only external input. It is used
    to compute a display flag, not to assert intelligence.

────────────────────────────────────────────────────────────
Example: Projected Upstream View
────────────────────────────────────────────────────────────

Input (binding layer output, abbreviated):

  {
    "status": "complete",
    "entry_node": {
      "node_id":   "INTEL-GQ003-001",
      "node_type": "INTEL",
      "title":     "Blast radius if a core platform component...",
      "status":    "validated",
      ...
    },
    "chain": [ ... all 4 nodes ... ],
    "terminates_in_evid": true,
    "error": null
  }

Persona config (executive):

  {
    "persona_id":    "executive",
    "label_map":     { "INTEL": "Finding", "EVID": "Source" },
    "layer_emphasis": ["INTEL"],
    "visibility_rules": { "SIG-40": "collapsed", "EVID": "collapsed" },
    "confidence_threshold": 0.7,
    "node_confidence": { "SIG41-SIG003-001": 0.6 }
  }

Projected output (new fields only — original fields unchanged):

  {
    ... all original fields unchanged ...

    "persona": {
      "persona_id": "executive",
      "applied":    true
    },

    "node_display": {
      "INTEL-GQ003-001": {
        "label":           "Finding: Blast radius if a core platform component...",
        "highlight":       true,
        "visible":         true,
        "confidence_flag": "normal"
      },
      "SIG41-SIG003-001": {
        "label":           "Dependency Load — semantic signal (SIG-003)",
        "highlight":       false,
        "visible":         true,
        "confidence_flag": "low"
      },
      "SIG40-SIG003-001": {
        "label":           "Dependency Load — computed signal (SIG-003 evidence binding)",
        "highlight":       false,
        "visible":         false,
        "confidence_flag": "normal"
      },
      "EVID-ST007-001": {
        "label":           "Source: ST-007: Structural telemetry — dependency relationship map",
        "highlight":       false,
        "visible":         false,
        "confidence_flag": "normal"
      }
    }
  }

Key observations:
  - SIG40 and EVID have visible: false → collapsed in UI; still in chain
  - SIG41 has confidence_flag: "low" → flagged; still in chain; status unchanged
  - INTEL-GQ003-001 title in entry_node and chain is unchanged
  - EVID-ST007-001 title in chain is unchanged ("Source:" prefix is display only)

────────────────────────────────────────────────────────────
Projection Invariants (Summary)
────────────────────────────────────────────────────────────

  1. The original view dict is not mutated.
     project_* functions return a new dict (shallow copy +
     two new keys). The original view is structurally
     identical before and after any projection call.

  2. ENL node dicts are not mutated.
     All node references in chain, subgraph, entry_node,
     node, and nodes are preserved as-is. No field is added,
     removed, or altered in any ENL node dict.

  3. Node count is identical before and after projection.
     visible: false does not delete. confidence_flag: "low"
     does not delete. Projection adds display annotations;
     it never reduces the node set.

  4. node_display is separate from ENL node fields.
     node_display is a top-level key on the projected view.
     It is not inside any ENL node dict.

  5. Determinism.
     The same view and the same persona_config always produce
     the same projected output.

  6. No state.
     The projection layer retains no state between calls.

────────────────────────────────────────────────────────────
Implementation Reference
────────────────────────────────────────────────────────────

  scripts/pios/enl/lens_persona_v1.py
    → apply_persona, project_upstream_view, project_query_view,
      project_node_view

  scripts/pios/enl/test_lens_persona.py
    → 89-test suite (100% PASS)

  docs/pios/enl/ENL-005_persona_model.md
    → persona_config field definitions and reference examples

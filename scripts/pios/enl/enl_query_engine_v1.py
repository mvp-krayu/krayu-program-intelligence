#!/usr/bin/env python3
"""
enl_query_engine_v1.py
ENL-003-CONTRACT-v1 · run_01_blueedge

Deterministic traversal and query engine for ENL graphs.

Implements:
  load_graph(path)              → dict
  validate_graph(graph)         → True or raises ENLValidationError
  get_node(graph, node_id)      → dict
  get_upstream_chain(graph, node_id)    → dict
  get_downstream_nodes(graph, node_id)  → dict
  get_query_subgraph(graph, query_id)   → dict

Rules:
  - All operations are read-only. No graph mutation.
  - All traversal follows derived_from exactly as declared.
  - No inference. No shortcuts. No cross-run linking.
  - Deterministic: same input → same output on every call.
  - Fail-fast on violations. Fail-visible on incomplete chains.

Python 3.9+ standard library only.
"""

import json
import os

# ── Constants ────────────────────────────────────────────────────────────────

ALLOWED_TRANSITIONS = {
    'INTEL':  ['SIG-41'],
    'SIG-41': ['SIG-40'],
    'SIG-40': ['EVID'],
    'EVID':   [],
}

CANONICAL_TYPES = ['INTEL', 'SIG-41', 'SIG-40', 'EVID']

REQUIRED_FIELDS = [
    'node_id', 'node_type', 'run_id', 'title',
    'status', 'derived_from', 'source_ref', 'created_at',
]

VALID_STATUSES = ['defined', 'active', 'validated', 'blocked', 'rejected']

# Layer order for chain assembly (low index = highest abstraction)
LAYER_ORDER = {t: i for i, t in enumerate(CANONICAL_TYPES)}

# ── Exceptions ───────────────────────────────────────────────────────────────

class ENLError(Exception):
    """Base exception for all ENL engine errors."""

class ENLLoadError(ENLError):
    """Raised when a graph file cannot be loaded or parsed."""

class ENLValidationError(ENLError):
    """Raised when a graph fails structural validation."""

class ENLNodeNotFoundError(ENLError):
    """Raised when a requested node_id does not exist in the graph."""

class ENLTransitionError(ENLError):
    """Raised when a layer transition violates enl_graph_rules_v1."""

class ENLTraversalError(ENLError):
    """Raised when traversal encounters a structural impossibility (e.g. cycle)."""

# ── Internal helpers ─────────────────────────────────────────────────────────

def _build_node_map(graph):
    """Return a dict mapping node_id → node for all nodes in graph."""
    return {n['node_id']: n for n in graph.get('nodes', [])}


def _check_transition(from_node, to_node):
    """
    Validate that from_node may declare to_node in its derived_from.
    Raises ENLTransitionError on violation.
    """
    from_type = from_node.get('node_type')
    to_type   = to_node.get('node_type')
    allowed   = ALLOWED_TRANSITIONS.get(from_type, [])
    if to_type not in allowed:
        raise ENLTransitionError(
            f"Invalid layer transition: {from_node['node_id']} ({from_type}) "
            f"→ {to_node['node_id']} ({to_type}). "
            f"{from_type} may only derive from: {allowed}."
        )


def _traverse_upstream(graph, start_node_id, node_map):
    """
    Internal BFS traversal from start_node upward via derived_from.

    Returns:
      (nodes_ordered, layer_sequence, terminates_in_evid, error_message)

    nodes_ordered: list of node dicts, ordered by layer (abstract→concrete),
                   then by node_id within each layer.
    layer_sequence: list of node_type strings in traversal order.
    terminates_in_evid: bool
    error_message: str or None
    """
    if start_node_id not in node_map:
        raise ENLNodeNotFoundError(
            f"Node not found: {start_node_id!r}"
        )

    visited_ids   = set()
    # queue entries: (node_id, parent_node_or_None)
    queue         = [start_node_id]
    visited_ids.add(start_node_id)
    reached_nodes = []  # in BFS encounter order
    error_message = None
    terminates    = True

    while queue:
        current_id   = queue.pop(0)
        current_node = node_map[current_id]
        reached_nodes.append(current_node)

        derived_from = current_node.get('derived_from', [])
        current_type = current_node.get('node_type')

        if current_type == 'EVID':
            # Terminal — derived_from must be empty; already validated
            continue

        if not derived_from:
            # Non-EVID node with empty derived_from: chain is incomplete
            terminates    = False
            error_message = (
                f"Node {current_id!r} (type={current_type}) has empty "
                f"derived_from but is not an EVID node. Chain is incomplete."
            )
            continue

        for ref_id in sorted(derived_from):  # sort for determinism
            if ref_id in visited_ids:
                raise ENLTraversalError(
                    f"Cycle detected at node {ref_id!r} during traversal "
                    f"from {start_node_id!r}."
                )
            if ref_id not in node_map:
                terminates    = False
                error_message = (
                    f"Node {current_id!r} declares derived_from reference "
                    f"{ref_id!r} which does not exist in the graph."
                )
                continue
            upstream_node = node_map[ref_id]
            _check_transition(current_node, upstream_node)
            visited_ids.add(ref_id)
            queue.append(ref_id)

    # Sort collected nodes: primary by layer order, secondary by node_id
    reached_nodes.sort(key=lambda n: (
        LAYER_ORDER.get(n.get('node_type', ''), 99),
        n.get('node_id', '')
    ))

    layer_sequence = [n['node_type'] for n in reached_nodes]

    return reached_nodes, layer_sequence, terminates, error_message

# ── Public API ───────────────────────────────────────────────────────────────

def load_graph(path):
    """
    Load an ENL graph from a JSON file.

    Args:
      path: str — absolute or relative path to a graph JSON file

    Returns:
      dict — the parsed graph

    Raises:
      ENLLoadError — if the file cannot be read or is not valid JSON
    """
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        raise ENLLoadError(f"Graph file not found: {path!r}")
    except json.JSONDecodeError as e:
        raise ENLLoadError(f"Graph file is not valid JSON: {path!r} — {e}")
    except OSError as e:
        raise ENLLoadError(f"Cannot read graph file: {path!r} — {e}")


def validate_graph(graph):
    """
    Validate an ENL graph against all ENL-002 structural constraints.

    Checks performed:
      - graph has required top-level fields (graph_id, run_id, nodes)
      - nodes is a non-empty list
      - all required fields present on every node
      - all node_type values are canonical
      - all status values are canonical
      - no duplicate node_ids
      - all derived_from references resolve to existing nodes
      - all layer transitions are permitted
      - only EVID nodes have empty derived_from
      - at least one EVID node exists
      - all nodes share the graph run_id
      - all nodes in linked pairs share the same run_id

    Args:
      graph: dict — a parsed graph (result of load_graph)

    Returns:
      True — if all checks pass

    Raises:
      ENLValidationError — if any check fails; message lists all violations
    """
    violations = []

    # Top-level structure
    if not isinstance(graph, dict):
        raise ENLValidationError("Graph must be a JSON object.")

    for field in ('graph_id', 'run_id', 'nodes'):
        if field not in graph or not graph[field]:
            violations.append(f"Missing or empty top-level field: {field!r}")

    nodes = graph.get('nodes', [])
    if not isinstance(nodes, list) or len(nodes) == 0:
        violations.append("'nodes' must be a non-empty array.")
        if violations:
            raise ENLValidationError(
                f"Graph validation failed ({len(violations)} violation(s)):\n"
                + "\n".join(f"  • {v}" for v in violations)
            )

    graph_run_id = graph.get('run_id')
    node_map     = {}
    seen_ids     = {}

    # Per-node field and type checks
    for idx, node in enumerate(nodes):
        if not isinstance(node, dict):
            violations.append(f"Node at index {idx} is not a JSON object.")
            continue

        nid = node.get('node_id', f'<index {idx}>')

        # Duplicate node_id
        if 'node_id' in node:
            if node['node_id'] in seen_ids:
                violations.append(
                    f"Duplicate node_id: {node['node_id']!r}"
                )
            else:
                seen_ids[node['node_id']] = True
                node_map[node['node_id']] = node

        # Required fields
        for field in REQUIRED_FIELDS:
            if field not in node or node[field] is None:
                violations.append(
                    f"Node {nid!r}: missing or null required field {field!r}"
                )
            elif field != 'derived_from':
                val = node[field]
                if not isinstance(val, str) or not val.strip():
                    violations.append(
                        f"Node {nid!r}: field {field!r} must be a non-empty string"
                    )

        # Canonical node_type
        nt = node.get('node_type')
        if nt not in CANONICAL_TYPES:
            violations.append(
                f"Node {nid!r}: node_type {nt!r} is not canonical "
                f"(must be one of {CANONICAL_TYPES})"
            )

        # Valid status
        st = node.get('status')
        if st not in VALID_STATUSES:
            violations.append(
                f"Node {nid!r}: status {st!r} is not valid "
                f"(must be one of {VALID_STATUSES})"
            )

        # derived_from type
        df = node.get('derived_from')
        if df is not None and not isinstance(df, list):
            violations.append(
                f"Node {nid!r}: derived_from must be an array"
            )

        # run_id matches graph run_id
        if node.get('run_id') != graph_run_id:
            violations.append(
                f"Node {nid!r}: run_id {node.get('run_id')!r} does not match "
                f"graph run_id {graph_run_id!r}"
            )

    # Relational checks (need complete node_map)
    for node in nodes:
        nid = node.get('node_id', '<unknown>')
        nt  = node.get('node_type')
        df  = node.get('derived_from', [])

        if not isinstance(df, list):
            continue

        # EVID must have empty derived_from
        if nt == 'EVID' and df:
            violations.append(
                f"Node {nid!r} (EVID): derived_from must be empty, got {df}"
            )

        # Non-EVID must have non-empty derived_from
        if nt != 'EVID' and nt in CANONICAL_TYPES and not df:
            violations.append(
                f"Node {nid!r} ({nt}): non-EVID node must not have "
                f"empty derived_from"
            )

        # derived_from references must resolve and respect transitions
        for ref_id in df:
            if ref_id not in node_map:
                violations.append(
                    f"Node {nid!r}: derived_from reference {ref_id!r} "
                    f"does not exist in graph"
                )
                continue

            upstream = node_map[ref_id]
            upstream_type = upstream.get('node_type')
            allowed = ALLOWED_TRANSITIONS.get(nt, [])
            if upstream_type not in allowed:
                violations.append(
                    f"Node {nid!r} ({nt}) → {ref_id!r} ({upstream_type}): "
                    f"forbidden layer transition. "
                    f"{nt} may only derive from {allowed}."
                )

            # Cross-run check
            if upstream.get('run_id') != node.get('run_id'):
                violations.append(
                    f"Node {nid!r} and upstream {ref_id!r} have different "
                    f"run_ids: {node.get('run_id')!r} vs "
                    f"{upstream.get('run_id')!r}"
                )

    # At least one EVID node required
    evid_nodes = [n for n in nodes if n.get('node_type') == 'EVID']
    if not evid_nodes:
        violations.append(
            "Graph contains no EVID node. Evidence termination not satisfied."
        )

    if violations:
        raise ENLValidationError(
            f"Graph validation failed ({len(violations)} violation(s)):\n"
            + "\n".join(f"  • {v}" for v in violations)
        )

    return True


def get_node(graph, node_id):
    """
    Return a single node by node_id.

    Args:
      graph:   dict — a validated graph
      node_id: str  — the node to retrieve

    Returns:
      {
        "status":  "ok",
        "node_id": <node_id>,
        "node":    <node dict>
      }

    Raises:
      ENLNodeNotFoundError — if node_id does not exist in graph
    """
    node_map = _build_node_map(graph)
    if node_id not in node_map:
        raise ENLNodeNotFoundError(f"Node not found: {node_id!r}")
    return {
        'status':  'ok',
        'node_id': node_id,
        'node':    node_map[node_id],
    }


def get_upstream_chain(graph, node_id):
    """
    Traverse the graph upstream from node_id via derived_from,
    following the INTEL → SIG-41 → SIG-40 → EVID hierarchy.

    Args:
      graph:   dict — a validated graph
      node_id: str  — starting node (any type)

    Returns:
      {
        "status":             "complete" | "incomplete",
        "start_node_id":      <node_id>,
        "nodes":              [ <node>, ... ],   # abstract→concrete order
        "layer_sequence":     [ <type>, ... ],
        "terminates_in_evid": bool,
        "error":              null | <str>
      }

    Raises:
      ENLNodeNotFoundError  — start node_id not in graph
      ENLTransitionError    — forbidden layer transition encountered
      ENLTraversalError     — cycle detected
    """
    node_map = _build_node_map(graph)
    nodes, layer_seq, terminates, error = _traverse_upstream(
        graph, node_id, node_map
    )
    return {
        'status':             'complete' if terminates else 'incomplete',
        'start_node_id':      node_id,
        'nodes':              nodes,
        'layer_sequence':     layer_seq,
        'terminates_in_evid': terminates,
        'error':              error,
    }


def get_downstream_nodes(graph, node_id):
    """
    Return all nodes that directly reference node_id in their derived_from.
    One level only — not recursive.

    Args:
      graph:   dict — a validated graph
      node_id: str  — the node whose consumers are requested

    Returns:
      {
        "status":         "ok",
        "source_node_id": <node_id>,
        "downstream":     [ <node>, ... ],  # sorted by node_id
        "count":          int
      }

    Raises:
      ENLNodeNotFoundError — source node_id not in graph
    """
    node_map = _build_node_map(graph)
    if node_id not in node_map:
        raise ENLNodeNotFoundError(f"Node not found: {node_id!r}")

    downstream = [
        n for n in graph.get('nodes', [])
        if node_id in n.get('derived_from', [])
    ]
    downstream.sort(key=lambda n: n.get('node_id', ''))

    return {
        'status':         'ok',
        'source_node_id': node_id,
        'downstream':     downstream,
        'count':          len(downstream),
    }


def get_query_subgraph(graph, query_id):
    """
    Return the complete ENL subgraph associated with query_id.

    Phase 1: find seed nodes whose source_ref contains query_id.
    Phase 2: expand each seed upstream via derived_from traversal.
    Phase 3: union and deduplicate; sort by node_id.

    All filtering is executed within ENL. The returned node set is
    complete and must not be reduced by the caller (Lens).

    Args:
      graph:    dict — a validated graph
      query_id: str  — intelligence query identifier (e.g. "GQ-003")

    Returns:
      {
        "status":   "ok" | "empty" | "incomplete",
        "query_id": <query_id>,
        "nodes":    [ <node>, ... ],  # sorted by node_id
        "count":    int
      }

    Raises:
      ENLTransitionError  — forbidden transition in upstream expansion
      ENLTraversalError   — cycle detected during expansion
    """
    node_map = _build_node_map(graph)

    # Phase 1: seed nodes whose source_ref contains query_id
    seeds = [
        n for n in graph.get('nodes', [])
        if query_id in n.get('source_ref', '')
    ]

    if not seeds:
        return {
            'status':   'empty',
            'query_id': query_id,
            'nodes':    [],
            'count':    0,
        }

    # Phase 2 & 3: expand each seed upstream, union results
    collected = {}
    overall_complete = True
    overall_error    = None

    for seed in seeds:
        seed_id = seed['node_id']
        nodes, _layer_seq, terminates, error = _traverse_upstream(
            graph, seed_id, node_map
        )
        if not terminates:
            overall_complete = False
            overall_error    = error
        for n in nodes:
            collected[n['node_id']] = n

    result_nodes = sorted(collected.values(), key=lambda n: n.get('node_id', ''))

    return {
        'status':   'ok' if overall_complete else 'incomplete',
        'query_id': query_id,
        'nodes':    result_nodes,
        'count':    len(result_nodes),
    }

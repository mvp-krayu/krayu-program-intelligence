#!/usr/bin/env python3
"""
lens_binding_v1.py
ENL-004-CONTRACT-v1 · run_01_blueedge

Lens Binding Layer — wraps ENL-003 query engine outputs into
render-ready view structures for consumption by Lens.

Rules:
  - Delegates exclusively to enl_query_engine_v1 functions.
  - Does not re-implement traversal, validation, or filtering.
  - Does not mutate ENL fields or node composition.
  - Does not cache, infer, or enrich ENL data.
  - All filtering logic remains in ENL (ENL-002A, Section B).

Public API:
  bind_get_full_graph(graph)             → full graph view
  bind_get_node(graph, node_id)          → node view
  bind_get_upstream_view(graph, node_id) → upstream chain view
  bind_get_query_view(graph, query_id)   → query subgraph view
  apply_persona(view, persona_config)    → placeholder; returns view unchanged

Python 3.9+ standard library only.
"""

import os
import sys

# Resolve engine — same directory as this module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from enl_query_engine_v1 import (
    get_node              as _engine_get_node,
    get_upstream_chain    as _engine_get_upstream_chain,
    get_downstream_nodes  as _engine_get_downstream_nodes,
    get_query_subgraph    as _engine_get_query_subgraph,
    ENLNodeNotFoundError,
    ENLTransitionError,
    ENLTraversalError,
    ENLValidationError,
)

# ── Lens exception types ──────────────────────────────────────────────────────

class LensBindingError(Exception):
    """Base exception for Lens binding layer errors."""

class LensNodeNotFoundError(LensBindingError):
    """Node does not exist in the ENL graph."""

class LensInvalidRequestError(LensBindingError):
    """Request parameter is invalid (e.g. empty node_id or query_id)."""

class LensTransitionError(LensBindingError):
    """ENL graph contains a forbidden layer transition."""

class LensTraversalError(LensBindingError):
    """ENL traversal encountered a structural impossibility."""

# ── Internal helpers ──────────────────────────────────────────────────────────

def _require_nonempty(value, param_name):
    """Raise LensInvalidRequestError if value is empty or not a string."""
    if not isinstance(value, str) or not value.strip():
        raise LensInvalidRequestError(
            f"Parameter {param_name!r} must be a non-empty string."
        )


def _upstream_available(node):
    """
    Returns True if the node has upstream nodes to navigate to.
    True when derived_from is non-empty.
    Does not traverse — reads declared field only.
    """
    return isinstance(node.get('derived_from'), list) and \
           len(node['derived_from']) > 0


def _downstream_available(graph, node_id):
    """
    Returns True if any node in the graph references node_id in derived_from.
    Delegates to engine get_downstream_nodes.
    """
    result = _engine_get_downstream_nodes(graph, node_id)
    return result['count'] > 0


def _translate_enl_exceptions(fn, *args, **kwargs):
    """
    Call fn(*args, **kwargs), translating ENL exceptions to Lens exceptions.
    ENL error messages are preserved verbatim — no masking.
    """
    try:
        return fn(*args, **kwargs)
    except ENLNodeNotFoundError as e:
        raise LensNodeNotFoundError(str(e)) from e
    except ENLTransitionError as e:
        raise LensTransitionError(str(e)) from e
    except ENLTraversalError as e:
        raise LensTraversalError(str(e)) from e


def _map_query_status(enl_status):
    """
    Map ENL query subgraph status to Lens query view status.

      ENL "ok"         → Lens "complete"
      ENL "incomplete" → Lens "partial"
      ENL "empty"      → Lens "empty"
    """
    return {
        'ok':         'complete',
        'incomplete': 'partial',
        'empty':      'empty',
    }.get(enl_status, enl_status)

# ── Public API ────────────────────────────────────────────────────────────────

def bind_get_full_graph(graph):
    """
    Return the complete ENL graph as a render-ready full graph view.

    Delegates to graph structure directly (already loaded and validated
    by the ENL engine layer). Nodes are sorted deterministically by node_id.
    No fields are added, removed, or altered.

    Args:
      graph: dict — a loaded and validated ENL graph

    Returns:
      {
        "status":  "ok",
        "run_id":  <str>,
        "count":   <int>,
        "nodes":   [ <node>, ... ]   # sorted by node_id, fields unchanged
      }
    """
    nodes = sorted(
        graph.get('nodes', []),
        key=lambda n: n.get('node_id', '')
    )
    return {
        'status': 'ok',
        'run_id': graph.get('run_id'),
        'count':  len(nodes),
        'nodes':  nodes,
    }


def bind_get_node(graph, node_id):
    """
    Return a node view for the given node_id.

    Delegates node lookup to enl_query_engine_v1.get_node.
    Annotates the result with upstream_available and downstream_available
    flags — both derived from declared ENL fields only.

    Args:
      graph:   dict — a loaded and validated ENL graph
      node_id: str  — node to retrieve

    Returns:
      {
        "status":               "ok",
        "node":                 <node dict — all fields unchanged>,
        "upstream_available":   bool,
        "downstream_available": bool
      }

    Raises:
      LensInvalidRequestError  — node_id is empty or not a string
      LensNodeNotFoundError    — node does not exist in graph
      LensTransitionError      — (propagated if engine raises)
    """
    _require_nonempty(node_id, 'node_id')

    engine_result = _translate_enl_exceptions(
        _engine_get_node, graph, node_id
    )
    node = engine_result['node']

    return {
        'status':               'ok',
        'node':                 node,
        'upstream_available':   _upstream_available(node),
        'downstream_available': _downstream_available(graph, node_id),
    }


def bind_get_upstream_view(graph, node_id):
    """
    Return an upstream chain view starting at node_id.

    Delegates traversal to enl_query_engine_v1.get_upstream_chain.
    No traversal logic is re-implemented here. Wraps the engine result
    into the Lens upstream view structure.

    An incomplete chain is surfaced explicitly — status "incomplete" and
    error field preserved. Lens must not present an incomplete chain as
    resolved evidence.

    Args:
      graph:   dict — a loaded and validated ENL graph
      node_id: str  — traversal start node (any layer type)

    Returns — complete:
      {
        "status":             "complete",
        "entry_node":         <node dict — unchanged>,
        "chain":              [ <node>, ... ],   # abstract→concrete order
        "terminates_in_evid": True,
        "error":              None
      }

    Returns — incomplete:
      {
        "status":             "incomplete",
        "entry_node":         <node dict — unchanged>,
        "chain":              [ <node>, ... ],
        "terminates_in_evid": False,
        "error":              <str>
      }

    Raises:
      LensInvalidRequestError  — node_id is empty or not a string
      LensNodeNotFoundError    — start node does not exist
      LensTransitionError      — forbidden layer transition in graph
      LensTraversalError       — cycle detected
    """
    _require_nonempty(node_id, 'node_id')

    engine_result = _translate_enl_exceptions(
        _engine_get_upstream_chain, graph, node_id
    )

    # Resolve entry node — first node in chain (the start node)
    chain      = engine_result['nodes']
    entry_node = next(
        (n for n in chain if n['node_id'] == node_id),
        chain[0] if chain else None
    )

    return {
        'status':             engine_result['status'],    # complete | incomplete
        'entry_node':         entry_node,
        'chain':              chain,
        'terminates_in_evid': engine_result['terminates_in_evid'],
        'error':              engine_result['error'],
    }


def bind_get_query_view(graph, query_id):
    """
    Return a query view for the given intelligence query identifier.

    Delegates to enl_query_engine_v1.get_query_subgraph. All filtering
    is performed within ENL. The returned subgraph is returned in full —
    Lens does not reduce it.

    seed_nodes: nodes whose source_ref directly references query_id.
    subgraph: the full node set returned by ENL (seeds + upstream expansion).
    seed_nodes is a subset of subgraph — both contain unchanged ENL node dicts.

    Args:
      graph:    dict — a loaded and validated ENL graph
      query_id: str  — intelligence query identifier (e.g. "GQ-003")

    Returns — complete:
      {
        "status":     "complete",
        "query_id":   <str>,
        "seed_nodes": [ <node>, ... ],
        "subgraph":   [ <node>, ... ],
        "count":      <int>
      }

    Returns — partial (upstream chain incomplete):
      {
        "status":     "partial",
        "query_id":   <str>,
        "seed_nodes": [ <node>, ... ],
        "subgraph":   [ <node>, ... ],
        "count":      <int>
      }

    Returns — empty (no nodes match query_id):
      {
        "status":     "empty",
        "query_id":   <str>,
        "seed_nodes": [],
        "subgraph":   [],
        "count":      0
      }

    Raises:
      LensInvalidRequestError — query_id is empty or not a string
      LensTransitionError     — forbidden transition in upstream expansion
      LensTraversalError      — cycle detected during expansion
    """
    _require_nonempty(query_id, 'query_id')

    engine_result = _translate_enl_exceptions(
        _engine_get_query_subgraph, graph, query_id
    )

    subgraph = engine_result['nodes']

    # Identify seed nodes: those whose source_ref directly references query_id.
    # This is a display annotation derived from declared ENL fields — not
    # a re-implementation of filtering logic.
    seed_nodes = [
        n for n in subgraph
        if query_id in n.get('source_ref', '')
    ]
    seed_nodes = sorted(seed_nodes, key=lambda n: n.get('node_id', ''))

    return {
        'status':     _map_query_status(engine_result['status']),
        'query_id':   query_id,
        'seed_nodes': seed_nodes,
        'subgraph':   subgraph,
        'count':      engine_result['count'],
    }


def apply_persona(view, persona_config):
    """
    Persona hook — placeholder only.

    Accepts a Lens view and a persona configuration dict.
    Returns the view unchanged.

    Constraints (invariant — enforced by returning view unmodified):
      - No ENL node fields are altered.
      - No nodes are removed from the view.
      - No fields are injected into ENL node dicts.
      - No navigation logic is applied.

    Implementation of persona rendering logic is reserved for a future
    contract version and must comply with ENL-002A Section F.

    Args:
      view:           dict — any Lens binding view structure
      persona_config: dict — persona configuration (not interpreted in v1)

    Returns:
      view — unmodified
    """
    return view

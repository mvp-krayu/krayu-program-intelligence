#!/usr/bin/env python3
"""
gauge_envelope_adapter.py
PSEE.BLUEEDGE.GAUGE.HANDOFF.01 — Envelope Render Adapter

Produces a deterministic render model from binding_envelope.json.
All topology structure is derived from nodes[], edges[], signals[],
and constraint_flags. No upstream artifact reads beyond the envelope.

Rules:
  R1  binding_envelope.json is the only topology input
  R2  render model is fully derived from the graph — no hardcoded names or counts
  R3  fail closed on missing required collections or malformed input
  R4  JSON to stdout only; no file writes
  R5  deterministic — same input produces same output (stable input order preserved)

Usage:
  python3 scripts/psee/gauge_envelope_adapter.py
  python3 scripts/psee/gauge_envelope_adapter.py --envelope <path>
"""

import json
import re
import sys
from collections import defaultdict, deque
from pathlib import Path

CONTRACT_ID          = "PSEE.BLUEEDGE.GAUGE.HANDOFF.01"
REQUIRED_COLLECTIONS = ("nodes", "edges", "signals", "constraint_flags")

REPO_ROOT = Path(__file__).resolve().parents[4]

DEFAULT_ENVELOPE = (
    REPO_ROOT
    / "clients"
    / "1de0d815-0721-58e9-bc8d-ca83e70fa903"
    / "psee"
    / "runs"
    / "run_335c0575a080"
    / "binding"
    / "binding_envelope.json"
)


# ---------------------------------------------------------------------------
# PSEE.STRUCTURAL.LABEL.RESOLUTION.01 — Structural label resolution
# Deterministic transformation grammar. No interpretation. No fallback naming.
# ---------------------------------------------------------------------------

_ABBREVIATION_REGISTER = {
    "cfg": "Config",
    "svc": "Service",
    "mgr": "Manager",
    "ctx": "Context",
    "idx": "Index",
    "api": "API",      # casing-only entry
}


def _build_product_names(nodes_list):
    """
    Collect original-cased tokens from node label corpus to support N-1 preservation.
    A token qualifies when its canonical form differs from its lowercase form.
    Returns: {lowercase_token: canonical_cased_form}
    """
    registry = {}
    for n in nodes_list:
        raw = n.get("label") or ""
        for tok in re.split(r"[_\-]+", raw):
            if not tok:
                continue
            lower = tok.lower()
            if lower not in registry:
                registry[lower] = tok
            elif tok != tok.lower() and registry[lower] == registry[lower].lower():
                registry[lower] = tok   # prefer cased form over lowercase
    return registry


def _tokenize(s):
    """
    T-1 through T-5: split snake_case, kebab-case, PascalCase, camelCase,
    and letter–digit / digit–letter boundaries.
    """
    parts = re.split(r"[_\-]+", s)
    tokens = []
    for part in parts:
        if not part:
            continue
        # T-3: PascalCase / camelCase
        p = re.sub(r"([a-z])([A-Z])", r"\1 \2", part)
        p = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", p)
        # T-5: letter–digit and digit–letter
        p = re.sub(r"([A-Za-z])([0-9])", r"\1 \2", p)
        p = re.sub(r"([0-9])([A-Za-z])", r"\1 \2", p)
        tokens.extend(p.split())
    return [t for t in tokens if t]


def _normalize(tok, product_names):
    """N-1 through N-4 normalization for a single token."""
    lower = tok.lower()
    # N-1: product casing preservation (cased form present in corpus)
    if lower in product_names and product_names[lower] != lower:
        return product_names[lower]
    # N-3: structural abbreviation register (closed set)
    if lower in _ABBREVIATION_REGISTER:
        return _ABBREVIATION_REGISTER[lower]
    # N-2: title case
    return (tok[0].upper() + tok[1:].lower()) if len(tok) > 1 else tok.upper()


def resolve_label(source, product_names):
    """
    Apply full grammar and return resolved_label string.
    Returns None only when source is empty — never invents content.
    """
    if not source:
        return None
    tokens = _tokenize(source)
    if not tokens:
        return None
    return " ".join(_normalize(t, product_names) for t in tokens)


# ---------------------------------------------------------------------------
# Fail-closed error handler
# ---------------------------------------------------------------------------

def fail(msg: str):
    print(json.dumps({"error": msg, "status": "FAIL_CLOSED"}), file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------------------
# Envelope loader + validator
# ---------------------------------------------------------------------------

def load_envelope(path: Path) -> dict:
    if not path.is_file():
        fail(f"ENVELOPE NOT FOUND: {path}")
    try:
        with open(path) as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        fail(f"ENVELOPE PARSE ERROR: {e}")


def validate_envelope(envelope: dict):
    missing = [c for c in REQUIRED_COLLECTIONS if c not in envelope]
    if missing:
        fail(f"REQUIRED COLLECTIONS ABSENT: {missing}")
    for c in ("nodes", "edges", "signals"):
        if not isinstance(envelope[c], list):
            fail(f"COLLECTION NOT A LIST: {c}")
    if not isinstance(envelope["constraint_flags"], dict):
        fail("constraint_flags is not an object")


# ---------------------------------------------------------------------------
# Render model derivation
# ---------------------------------------------------------------------------

def build_render_model(envelope: dict, envelope_path: str) -> dict:
    nodes_list       = envelope["nodes"]
    edges_list       = envelope["edges"]
    signals_list     = envelope["signals"]
    constraint_flags = envelope["constraint_flags"]

    # --- Node index ---
    node_index = {n["node_id"]: n for n in nodes_list}

    # --- Edge partition ---
    contains_edges = [e for e in edges_list if e.get("edge_type") == "CONTAINS"]
    overlap_edges  = [e for e in edges_list if e.get("edge_type") == "OVERLAP_STRUCTURAL"]
    unknown_edges  = [
        e for e in edges_list
        if e.get("edge_type") not in ("CONTAINS", "OVERLAP_STRUCTURAL")
    ]

    # --- CONTAINS adjacency (stable input order) ---
    children_of = defaultdict(list)   # parent_id  → [child_id, ...]
    parents_of  = defaultdict(list)   # child_id   → [parent_id, ...]
    for e in contains_edges:
        children_of[e["from_node"]].append(e["to_node"])
        parents_of[e["to_node"]].append(e["from_node"])

    # --- Root detection: nodes with no inbound CONTAINS ---
    has_inbound  = set(parents_of.keys())
    has_outbound = set(children_of.keys())

    # Stable order: preserve nodes[] input order
    roots = [n["node_id"] for n in nodes_list if n["node_id"] not in has_inbound]

    # --- Orphan detection: no inbound AND no outbound CONTAINS ---
    orphan_ids = {
        n["node_id"] for n in nodes_list
        if n["node_id"] not in has_inbound and n["node_id"] not in has_outbound
    }

    # --- Depth assignment via BFS from roots ---
    node_depths: dict[str, int] = {}
    queue: deque = deque()
    for r in roots:
        if r not in node_depths:
            node_depths[r] = 0
            queue.append(r)
    while queue:
        nid = queue.popleft()
        for child in children_of[nid]:
            if child not in node_depths:
                node_depths[child] = node_depths[nid] + 1
                queue.append(child)
    # Nodes reachable only from non-root CONTAINS sources
    for nid in list(children_of.keys()) + list(parents_of.keys()):
        if nid not in node_depths:
            node_depths[nid] = 0

    # --- Multi-parent detection ---
    multi_parent = {
        child: list(plist)   # stable: input order of first-seen parent
        for child, plist in parents_of.items()
        if len(plist) > 1
    }

    # Canonical parent: first parent in edges[] input order
    canonical_parent: dict[str, str] = {}
    for e in contains_edges:
        child = e["to_node"]
        if child not in canonical_parent:
            canonical_parent[child] = e["from_node"]

    # --- Containment tree ---
    # canonical_children: parent → [child_ids where canonical_parent[child] == parent]
    # additional_parent_refs: parent → [child_ids where child is multi-parent but canonical elsewhere]
    containment_tree: dict[str, list] = {}
    additional_parent_refs: dict[str, list] = defaultdict(list)

    for parent, children in children_of.items():
        seen: set = set()
        canon_children: list = []
        for child in children:
            if child in seen:
                continue
            seen.add(child)
            if canonical_parent.get(child) == parent:
                canon_children.append(child)
            else:
                # multi-parent child whose canonical location is elsewhere
                additional_parent_refs[parent].append(child)
        containment_tree[parent] = canon_children

    # --- Overlap endpoint index ---
    overlap_endpoints: set = set()
    for e in overlap_edges:
        overlap_endpoints.add(e["from_node"])
        overlap_endpoints.add(e["to_node"])

    # --- Signals by node ---
    signals_by_node: dict[str, list] = defaultdict(list)
    orphan_signals: list = []
    for s in signals_list:
        nid = s.get("node_id")
        if nid and nid in node_index:
            signals_by_node[nid].append(s)
        else:
            orphan_signals.append(s)

    # --- Bound label fields — PSEE.STRUCTURAL.LABEL.RESOLUTION.01 + GAUGE.RUNTIME.LABEL.BINDING.01 ---
    # Build product names corpus from label values for N-1 casing preservation rule.
    product_names = _build_product_names(nodes_list)

    # --- Annotated node list (non-mutating) ---
    annotated_nodes = []
    for n in nodes_list:
        nid = n["node_id"]
        ann = dict(n)
        ann["depth"]               = node_depths.get(nid, 0)
        ann["is_orphan"]           = nid in orphan_ids
        ann["is_root"]             = nid in roots
        ann["is_overlap_endpoint"] = nid in overlap_endpoints
        ann["signal_count"]        = len(signals_by_node.get(nid, []))
        ann["signals"]             = signals_by_node.get(nid, [])
        if nid in multi_parent:
            ann["canonical_parent"]    = canonical_parent.get(nid)
            ann["additional_parents"]  = [
                p for p in multi_parent[nid] if p != canonical_parent.get(nid)
            ]

        # Bound label fields (additive — structural fields above are unchanged)
        label_source          = n.get("label") or nid   # use node_id as UNRESOLVED fallback
        resolved              = resolve_label(label_source, product_names) or nid
        ann["resolved_label"] = resolved
        ann["display_label"]  = resolved                 # display_label := resolved_label
        ann["secondary_label"] = nid                     # secondary_label := canonical_id
        # short_label: passthrough only when present upstream; key absent otherwise
        if "short_label" in n:
            ann["short_label"] = n["short_label"]

        annotated_nodes.append(ann)

    # --- Summary ---
    summary = {
        "nodes_count":              len(nodes_list),
        "roots_count":              len(roots),
        "orphans_count":            len(orphan_ids),
        "edges_count":              len(edges_list),
        "contains_edges_count":     len(contains_edges),
        "overlap_edges_count":      len(overlap_edges),
        "unknown_edges_count":      len(unknown_edges),
        "signals_count":            len(signals_list),
        "orphan_signals_count":     len(orphan_signals),
        "multi_parent_nodes_count": len(multi_parent),
    }

    return {
        "envelope":               True,
        "contract_id":            CONTRACT_ID,
        "envelope_path":          envelope_path,
        "nodes":                  annotated_nodes,
        "roots":                  roots,
        "orphans":                sorted(orphan_ids),
        "containment_tree":       containment_tree,
        "additional_parent_refs": {k: v for k, v in additional_parent_refs.items()},
        "node_depths":            node_depths,
        "multi_parent_nodes":     multi_parent,
        "overlap_edges":          overlap_edges,
        "unknown_edges":          unknown_edges,
        "signals_by_node":        {k: v for k, v in signals_by_node.items()},
        "orphan_signals":         orphan_signals,
        "constraint_flags":       constraint_flags,
        "summary":                summary,
        # capability_surfaces[] exposed as declarative index only — not topology authority
        "capability_surfaces_index": envelope.get("capability_surfaces", []),
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    import argparse
    parser = argparse.ArgumentParser(
        description="GAUGE envelope render adapter — PSEE.BLUEEDGE.GAUGE.HANDOFF.01"
    )
    parser.add_argument(
        "--envelope",
        default=str(DEFAULT_ENVELOPE),
        help="Path to binding_envelope.json (default: canonical client envelope)",
    )
    args = parser.parse_args()

    path     = Path(args.envelope)
    envelope = load_envelope(path)
    validate_envelope(envelope)
    model    = build_render_model(envelope, str(path))
    print(json.dumps(model, indent=2))


if __name__ == "__main__":
    main()

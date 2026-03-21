#!/usr/bin/env python3
"""
lens_persona_v1.py
ENL-005-CONTRACT-v1 · run_01_blueedge

Persona Projection Layer — applies display-only metadata to Lens view
structures produced by lens_binding_v1, without mutating ENL node fields
or altering graph composition.

Rules:
  - Operates exclusively on Lens view structures (binding layer output).
  - Does not call the ENL engine directly.
  - Does not mutate the original view or any ENL node dict.
  - Returns a new view structure with two added top-level keys:
      "persona"      — persona identity block
      "node_display" — per-node display metadata (keyed by node_id)
  - All persona effects are display-only.
  - No nodes are removed. Node count is identical before and after.
  - Fully compliant with ENL-002A Section F.

Public API:
  apply_persona(view, persona_config)         → dispatches by view type
  project_upstream_view(view, persona_config)  → upstream view projection
  project_query_view(view, persona_config)     → query view projection
  project_node_view(view, persona_config)      → node view projection

Python 3.9+ standard library only.
"""

# ── Constants ─────────────────────────────────────────────────────────────────

# Canonical layer order used to sort nodes deterministically when building
# node_display. Matches LAYER_ORDER in the engine.
_LAYER_ORDER = {'INTEL': 0, 'SIG-41': 1, 'SIG-40': 2, 'EVID': 3}

# ── Exceptions ────────────────────────────────────────────────────────────────

class LensPersonaError(Exception):
    """Raised when a persona configuration is structurally invalid."""

# ── Validation ────────────────────────────────────────────────────────────────

def _validate_persona_config(persona_config):
    """
    Validate persona configuration structure.

    Required field:
      persona_id: non-empty string

    Optional fields (validated if present):
      label_map:            dict of str → str
      layer_emphasis:       list of str
      visibility_rules:     dict of str → "collapsed" | "visible"
      confidence_threshold: float in [0.0, 1.0]
      node_confidence:      dict of str → float

    Raises LensPersonaError on structural violations.
    """
    if not isinstance(persona_config, dict):
        raise LensPersonaError("persona_config must be a dict.")

    pid = persona_config.get('persona_id')
    if not isinstance(pid, str) or not pid.strip():
        raise LensPersonaError(
            "persona_config must include a non-empty 'persona_id' string."
        )

    label_map = persona_config.get('label_map')
    if label_map is not None:
        if not isinstance(label_map, dict):
            raise LensPersonaError("'label_map' must be a dict.")
        for k, v in label_map.items():
            if not isinstance(k, str) or not isinstance(v, str):
                raise LensPersonaError(
                    f"'label_map' keys and values must be strings, "
                    f"got {k!r} → {v!r}"
                )

    layer_emphasis = persona_config.get('layer_emphasis')
    if layer_emphasis is not None:
        if not isinstance(layer_emphasis, list):
            raise LensPersonaError("'layer_emphasis' must be a list.")
        for item in layer_emphasis:
            if not isinstance(item, str):
                raise LensPersonaError(
                    f"'layer_emphasis' items must be strings, got {item!r}"
                )

    visibility_rules = persona_config.get('visibility_rules')
    if visibility_rules is not None:
        if not isinstance(visibility_rules, dict):
            raise LensPersonaError("'visibility_rules' must be a dict.")
        for k, v in visibility_rules.items():
            if not isinstance(k, str):
                raise LensPersonaError(
                    f"'visibility_rules' keys must be strings, got {k!r}"
                )
            if v not in ('collapsed', 'visible'):
                raise LensPersonaError(
                    f"'visibility_rules' values must be 'collapsed' or "
                    f"'visible', got {v!r} for key {k!r}"
                )

    threshold = persona_config.get('confidence_threshold')
    if threshold is not None:
        if not isinstance(threshold, (int, float)) or not (0.0 <= threshold <= 1.0):
            raise LensPersonaError(
                f"'confidence_threshold' must be a float in [0.0, 1.0], "
                f"got {threshold!r}"
            )

    node_confidence = persona_config.get('node_confidence')
    if node_confidence is not None:
        if not isinstance(node_confidence, dict):
            raise LensPersonaError("'node_confidence' must be a dict.")
        for k, v in node_confidence.items():
            if not isinstance(k, str):
                raise LensPersonaError(
                    f"'node_confidence' keys must be strings, got {k!r}"
                )
            if not isinstance(v, (int, float)) or not (0.0 <= v <= 1.0):
                raise LensPersonaError(
                    f"'node_confidence' values must be floats in [0.0, 1.0], "
                    f"got {v!r} for key {k!r}"
                )


# ── Internal helpers ──────────────────────────────────────────────────────────

def _persona_block(persona_config):
    """Return the top-level persona identity block."""
    return {
        'persona_id': persona_config['persona_id'],
        'applied':    True,
    }


def _project_node_display(node, persona_config):
    """
    Generate display metadata for a single ENL node.

    Does not read or modify any ENL node field. Reads node_type, title,
    and node_id only to produce the display dict. ENL node dict is untouched.

    Returns:
      {
        "label":           str   — display label (type prefix + title, or title)
        "highlight":       bool  — True if node_type is in layer_emphasis
        "visible":         bool  — False if node_type is in visibility_rules as
                                   "collapsed"; True otherwise
        "confidence_flag": str   — "low" if node_id has a confidence score below
                                   confidence_threshold; "normal" otherwise
      }
    """
    node_type = node.get('node_type', '')
    title     = node.get('title', '')
    node_id   = node.get('node_id', '')

    label_map          = persona_config.get('label_map', {})
    layer_emphasis     = persona_config.get('layer_emphasis', [])
    visibility_rules   = persona_config.get('visibility_rules', {})
    confidence_threshold = persona_config.get('confidence_threshold')
    node_confidence    = persona_config.get('node_confidence', {})

    # Label: apply type prefix if declared; otherwise use title unchanged
    if node_type in label_map:
        label = f"{label_map[node_type]}: {title}"
    else:
        label = title

    # Highlight: True when node_type is in layer_emphasis
    highlight = node_type in layer_emphasis

    # Visible: False when node_type is declared "collapsed" in visibility_rules
    visible = visibility_rules.get(node_type, 'visible') != 'collapsed'

    # Confidence flag: "low" only when threshold is set AND node has a score
    # below threshold. No score → "normal" (never assume low confidence).
    if confidence_threshold is not None and node_id in node_confidence:
        score = node_confidence[node_id]
        confidence_flag = 'low' if score < confidence_threshold else 'normal'
    else:
        confidence_flag = 'normal'

    return {
        'label':           label,
        'highlight':       highlight,
        'visible':         visible,
        'confidence_flag': confidence_flag,
    }


def _build_node_display(nodes, persona_config):
    """
    Build the node_display dict for a list of nodes.

    Deduplicates by node_id. Order of nodes does not affect output
    (each node_id maps to exactly one display entry). Result is
    deterministic: the same node set and persona config always produce
    the same node_display.

    Returns:
      { node_id: { label, highlight, visible, confidence_flag }, ... }
    """
    result = {}
    seen   = set()
    # Sort by layer order then node_id for deterministic processing
    sorted_nodes = sorted(
        nodes,
        key=lambda n: (
            _LAYER_ORDER.get(n.get('node_type', ''), 99),
            n.get('node_id', '')
        )
    )
    for node in sorted_nodes:
        node_id = node.get('node_id')
        if node_id and node_id not in seen:
            seen.add(node_id)
            result[node_id] = _project_node_display(node, persona_config)
    return result


def _collect_nodes_from_view(view):
    """
    Collect all ENL node dicts from a Lens view structure.
    Returns a deduplicated list of node dicts, ordered by layer then node_id.
    """
    candidates = []

    # Upstream view
    entry = view.get('entry_node')
    if entry and isinstance(entry, dict):
        candidates.append(entry)
    for node in view.get('chain', []):
        if isinstance(node, dict):
            candidates.append(node)

    # Query view
    for node in view.get('seed_nodes', []):
        if isinstance(node, dict):
            candidates.append(node)
    for node in view.get('subgraph', []):
        if isinstance(node, dict):
            candidates.append(node)

    # Node view
    single = view.get('node')
    if single and isinstance(single, dict):
        candidates.append(single)

    # Full graph view
    for node in view.get('nodes', []):
        if isinstance(node, dict):
            candidates.append(node)

    # Deduplicate by node_id, preserving first occurrence
    seen  = set()
    result = []
    for node in candidates:
        nid = node.get('node_id')
        if nid and nid not in seen:
            seen.add(nid)
            result.append(node)
    return result


def _detect_view_type(view):
    """
    Detect the Lens view type from structure.

    Returns one of: "upstream", "query", "node", "full_graph", "unknown"
    """
    if 'entry_node' in view and 'chain' in view:
        return 'upstream'
    if 'query_id' in view and 'subgraph' in view:
        return 'query'
    if 'node' in view and 'upstream_available' in view:
        return 'node'
    if 'run_id' in view and 'nodes' in view:
        return 'full_graph'
    return 'unknown'


def _project_view(view, persona_config):
    """
    Core projection: shallow-copy the view, add persona and node_display blocks.
    The original view dict is not modified.
    All ENL node dicts referenced by the view remain unchanged.
    """
    nodes        = _collect_nodes_from_view(view)
    node_display = _build_node_display(nodes, persona_config)

    projected = dict(view)                       # shallow copy — original untouched
    projected['persona']      = _persona_block(persona_config)
    projected['node_display'] = node_display
    return projected


# ── Public API ────────────────────────────────────────────────────────────────

def project_upstream_view(view, persona_config):
    """
    Apply persona projection to a Lens upstream view.

    Returns a new dict with all original upstream view fields preserved,
    plus:
      "persona":      { persona_id, applied: true }
      "node_display": { node_id: { label, highlight, visible,
                                   confidence_flag }, ... }

    Covers entry_node and all nodes in chain.
    All ENL node dicts in entry_node and chain are untouched.
    No nodes are removed.

    Args:
      view:           dict — output of bind_get_upstream_view
      persona_config: dict — validated persona configuration

    Returns:
      dict — projected upstream view

    Raises:
      LensPersonaError — if persona_config is structurally invalid
    """
    _validate_persona_config(persona_config)
    return _project_view(view, persona_config)


def project_query_view(view, persona_config):
    """
    Apply persona projection to a Lens query view.

    Returns a new dict with all original query view fields preserved,
    plus persona and node_display blocks.

    Covers all nodes in seed_nodes and subgraph (deduplicated).
    All ENL node dicts in seed_nodes and subgraph are untouched.
    No nodes are removed from either list.

    Args:
      view:           dict — output of bind_get_query_view
      persona_config: dict — validated persona configuration

    Returns:
      dict — projected query view

    Raises:
      LensPersonaError — if persona_config is structurally invalid
    """
    _validate_persona_config(persona_config)
    return _project_view(view, persona_config)


def project_node_view(view, persona_config):
    """
    Apply persona projection to a Lens node view.

    Returns a new dict with all original node view fields preserved,
    plus persona and node_display blocks.

    The single ENL node dict in 'node' is untouched.
    upstream_available and downstream_available flags are preserved unchanged.

    Args:
      view:           dict — output of bind_get_node
      persona_config: dict — validated persona configuration

    Returns:
      dict — projected node view

    Raises:
      LensPersonaError — if persona_config is structurally invalid
    """
    _validate_persona_config(persona_config)
    return _project_view(view, persona_config)


def apply_persona(view, persona_config):
    """
    Apply persona projection to any Lens view structure.

    Detects the view type and delegates to the appropriate projection
    function. Returns a new view structure. The original view is not
    mutated. All ENL node dicts are unchanged.

    If persona_config is empty or has no persona_id, returns the view
    unchanged (no projection applied).

    Args:
      view:           dict — any Lens binding view (upstream, query, node,
                             full graph)
      persona_config: dict — persona configuration

    Returns:
      dict — projected view (or original view if persona_config is empty)

    Raises:
      LensPersonaError — if persona_config is provided but structurally invalid
    """
    if not isinstance(persona_config, dict) or not persona_config.get('persona_id'):
        return view

    _validate_persona_config(persona_config)

    view_type = _detect_view_type(view)

    if view_type == 'upstream':
        return project_upstream_view(view, persona_config)
    elif view_type == 'query':
        return project_query_view(view, persona_config)
    elif view_type == 'node':
        return project_node_view(view, persona_config)
    else:
        # Full graph view or unknown — project with all available nodes
        return _project_view(view, persona_config)

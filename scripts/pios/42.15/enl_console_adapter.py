#!/usr/bin/env python3
"""
enl_console_adapter.py
PIOS-42.15-RUN01-CONTRACT-v1 · run_01_enl_ui_exposure

ENL Evidence Exposure Console Adapter — Stream 42.15

Exposes ENL (Evidence Navigation Layer) structures for ExecLens signals
and queries. This is a pure exposure layer — no transformation, no
interpretation, no modification of upstream 41.x or 42.x artifacts.

Modes:
  --query GQ-003            Show ENL chain for all signals in a query
  --signal SIG-001          Show ENL chain for a single signal
  --drilldown <node_id>     Step-by-step ENL chain drill-down (ENL graph mode)
  --depth N                 With --drilldown: show N layers (default: all)
  --list                    List available signals and queries

Data sources (read-only):
  ENL graph:      docs/pios/enl/examples/ENL-002_minimal_graph_example.json
  Evidence index: docs/pios/41.4/evidence_mapping_index.json
  Signal registry:docs/pios/41.4/signal_registry.json
  Query map:      docs/pios/41.5/query_signal_map.json

Rules:
  R1  all output is verbatim from source files — no derived values
  R2  no modification of 42.x adapter output
  R3  deterministic — same input → same output
  R4  additive only — ENL section is independent of existing output
  R5  fail visible on missing data — explicit error, not silent omission

Python 3.9+ standard library only.
"""

import argparse
import json
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]

# ── Path constants ────────────────────────────────────────────────────────────

ENL_GRAPH_PATH  = REPO_ROOT / "docs/pios/enl/examples/ENL-002_minimal_graph_example.json"
EVIDENCE_INDEX  = REPO_ROOT / "docs/pios/41.4/evidence_mapping_index.json"
SIGNAL_REGISTRY = REPO_ROOT / "docs/pios/41.4/signal_registry.json"
QUERY_MAP       = REPO_ROOT / "docs/pios/41.5/query_signal_map.json"
ENL_MODULE_PATH = REPO_ROOT / "scripts/pios/enl"

W = 66  # console width for separators

CONTRACT_ID = "PIOS-42.15-RUN01-CONTRACT-v1"

# ── ENL engine imports (optional — graceful fail if unavailable) ──────────────

_enl_available = False
_engine = None
_binding = None
_drilldown = None

if ENL_MODULE_PATH.is_dir():
    sys.path.insert(0, str(ENL_MODULE_PATH))
    try:
        import enl_query_engine_v1 as _engine
        import lens_binding_v1 as _binding
        import lens_drilldown_v1 as _drilldown
        _enl_available = True
    except ImportError:
        pass

# ── Data loading ──────────────────────────────────────────────────────────────

def _load_json(path: Path, label: str) -> dict:
    """Load JSON file; fail visible on error. [R5]"""
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as e:
        print(f'[ERROR] Cannot load {label}: {e}', file=sys.stderr)
        sys.exit(1)

def _load_evidence_index() -> dict:
    data = _load_json(EVIDENCE_INDEX, 'evidence_mapping_index.json')
    return {s['signal_id']: s for s in data.get('signals', [])}

def _load_signal_registry() -> dict:
    data = _load_json(SIGNAL_REGISTRY, 'signal_registry.json')
    return {s['signal_id']: s for s in data.get('signals', [])}

def _load_query_map() -> dict:
    data = _load_json(QUERY_MAP, 'query_signal_map.json')
    return {q['query_id']: q for q in data.get('queries', [])}

def _load_enl_graph():
    """Load ENL graph; return None if unavailable."""
    if not ENL_GRAPH_PATH.is_file() or not _enl_available:
        return None
    try:
        g = _engine.load_graph(str(ENL_GRAPH_PATH))
        _engine.validate_graph(g)
        return g
    except Exception:
        return None

# ── Console display helpers ───────────────────────────────────────────────────

def _sep():
    return '━' * W

def _header(title: str):
    print()
    print(f'ENL EVIDENCE CHAIN — {title}')
    print(_sep())

def _node_block(step_label: str, node: dict, total: int):
    """Print a single ENL node block."""
    derived = node.get('derived_from', [])
    if derived:
        derived_str = ', '.join(derived)
    else:
        derived_str = '(terminal — evidence origin)'

    print(f'  {step_label}  [{node["node_type"]}]  {node["node_id"]}')
    print(f'    title:        {node["title"]}')
    print(f'    status:       {node["status"]}')
    print(f'    source_ref:   {node["source_ref"]}')
    print(f'    derived_from: {derived_str}')
    print(f'    run_id:       {node["run_id"]}')
    if node.get('created_at'):
        print(f'    created_at:   {node["created_at"]}')

# ── ENL graph mode — full chain display ───────────────────────────────────────

def display_enl_chain_from_graph(graph, start_node_id: str, depth: int = None):
    """
    Display the full ENL chain from start_node_id using ENL graph.
    depth limits how many layers are shown (None = all).
    """
    try:
        view = _binding.bind_get_upstream_view(graph, start_node_id)
    except Exception as e:
        print(f'[ERROR] Cannot bind upstream view for {start_node_id}: {e}', file=sys.stderr)
        sys.exit(1)

    chain = view['chain']
    total = len(chain)
    terminates = view.get('terminates_in_evid', False)

    session = _drilldown.create_drilldown_session(view)

    limit = total if depth is None else min(depth, total)
    shown = 0

    for i in range(total):
        step = _drilldown.get_current_step(session)
        if i < limit:
            step_label = f'Step {i + 1}/{total}'
            _node_block(step_label, step['node'], total)
            shown += 1
            if i < limit - 1 and i < total - 1:
                print()
                print('  ↓')
                print()
        if not step['at_end']:
            session = _drilldown.step_forward(session)

    print()
    print(_sep())
    if depth is not None and depth < total:
        print(f'  [depth limit reached — {shown} of {total} layers shown]')
    print(f'  chain_status:       {"complete" if terminates else "incomplete_terminal"}')
    print(f'  terminates_in_evid: {str(terminates).lower()}')

    breadcrumbs = _drilldown.get_breadcrumbs(session)
    bc_str = ' → '.join(b['node_id'] for b in breadcrumbs)
    print(f'  breadcrumbs:        {bc_str}')
    print(f'  source:             [ENL graph: {chain[0]["run_id"]}]')
    print()

# ── Evidence mapping mode — signal chain display ──────────────────────────────

def display_chain_from_evidence_mapping(signal_id: str, ev_entry: dict, sig_entry: dict):
    """
    Display ENL-structured chain from evidence_mapping_index.json data.
    """
    sig_title = sig_entry.get('title', signal_id) if sig_entry else signal_id

    print()
    print(f'  Signal: {signal_id} — {sig_title}')
    print()

    # Level 1 — Intelligence reference
    print(f'  [INTEL-REF]')
    print(f'    source_object_id: {ev_entry["source_object_id"]}')
    print(f'    source_layer:     {ev_entry["source_layer"]}')
    print(f'    source_file:      {ev_entry["source_file"]}')
    print()

    # Level 2 — Supporting objects
    supporting = ev_entry.get('supporting_objects', [])
    if supporting:
        print(f'  [SUPPORTING]  ({len(supporting)} objects)')
        for obj in supporting:
            print(f'    object_id: {obj["object_id"]}  layer: {obj["layer"]}  '
                  f'file: {obj["file"]}  state: {obj["state"]}')
        print()

    # Level 3 — Evidence chain (verbatim)
    print(f'  [EVIDENCE]')
    print(f'    evidence_chain:')
    # Wrap the evidence chain string at reasonable width for readability
    chain_str = ev_entry.get('evidence_chain', '')
    # Print verbatim — split on ' → ' for visual line breaks if long
    if ' → ' in chain_str:
        parts = chain_str.split(' → ')
        print(f'      {parts[0]}')
        for part in parts[1:]:
            print(f'      → {part}')
    else:
        print(f'      {chain_str}')

    bp = ev_entry.get('blocking_point')
    tr = ev_entry.get('temporal_reference')
    print(f'    blocking_point:   {bp}')
    if tr:
        print(f'    temporal_reference: {tr}')

    print()
    print(_sep())
    print(f'  chain_status:       evidence-mapping (41.4)')
    print(f'  source:             [evidence-mapping: 41.4]')
    print()

# ── Query mode ────────────────────────────────────────────────────────────────

def cmd_query(query_id: str):
    """Display ENL chains for all signals mapped to a query."""
    qmap = _load_query_map()
    if query_id not in qmap:
        print(f'[ERROR] Query {query_id!r} not found in query_signal_map.json', file=sys.stderr)
        sys.exit(1)

    query = qmap[query_id]
    mapped = query.get('mapped_signals', [])

    _header(f'{query_id} — {query["query_text"]}')
    print(f'  contract_id:  {CONTRACT_ID}')
    print(f'  query_id:     {query_id}')
    print(f'  intent_type:  {query["intent_type"]}')
    print(f'  signals:      {len(mapped)}')
    print()

    ev_index = _load_evidence_index()
    sig_registry = _load_signal_registry()

    # Attempt ENL graph mode for this query
    enl_graph = _load_enl_graph()

    for mapping in sorted(mapped, key=lambda m: m['signal_id']):
        signal_id = mapping['signal_id']
        print(f'  ─── Signal: {signal_id}  relevance: {mapping["relevance"]} ───')

        # Check if ENL graph has a node for this signal
        enl_node_id = None
        if enl_graph:
            # Look for a SIG-41 node linked to this signal
            for node in enl_graph.get('nodes', []):
                if (node['node_type'] == 'INTEL' and
                        _signal_in_graph_chain(enl_graph, node['node_id'], signal_id)):
                    enl_node_id = node['node_id']
                    break

        if enl_node_id and _enl_available:
            # ENL graph mode
            display_enl_chain_from_graph(enl_graph, enl_node_id)
        else:
            # Evidence mapping mode
            ev_entry = ev_index.get(signal_id)
            sig_entry = sig_registry.get(signal_id)
            if ev_entry:
                display_chain_from_evidence_mapping(signal_id, ev_entry, sig_entry)
            else:
                print(f'  [WARN] No evidence data for {signal_id}')
                print()

# ── Signal mode ───────────────────────────────────────────────────────────────

def cmd_signal(signal_id: str):
    """Display ENL chain for a single signal."""
    ev_index = _load_evidence_index()
    sig_registry = _load_signal_registry()

    sig_entry = sig_registry.get(signal_id)
    ev_entry = ev_index.get(signal_id)

    if not ev_entry and not sig_entry:
        print(f'[ERROR] Signal {signal_id!r} not found', file=sys.stderr)
        sys.exit(1)

    sig_title = sig_entry.get('title', signal_id) if sig_entry else signal_id
    _header(f'{signal_id} — {sig_title}')
    print(f'  contract_id:  {CONTRACT_ID}')
    print()

    # Try ENL graph mode first
    enl_graph = _load_enl_graph()
    enl_node_id = None
    if enl_graph:
        for node in enl_graph.get('nodes', []):
            if (node['node_type'] == 'INTEL' and
                    _signal_in_graph_chain(enl_graph, node['node_id'], signal_id)):
                enl_node_id = node['node_id']
                break

    if enl_node_id and _enl_available:
        display_enl_chain_from_graph(enl_graph, enl_node_id)
    elif ev_entry:
        display_chain_from_evidence_mapping(signal_id, ev_entry, sig_entry)
    else:
        print(f'  [WARN] No evidence data found for {signal_id}')

# ── Drilldown mode ────────────────────────────────────────────────────────────

def cmd_drilldown(node_id: str, depth: int = None):
    """Step-by-step drill-down from a specific ENL node."""
    if not _enl_available:
        print('[ERROR] ENL modules not available — drilldown requires ENL graph mode', file=sys.stderr)
        sys.exit(1)

    enl_graph = _load_enl_graph()
    if not enl_graph:
        print(f'[ERROR] ENL graph not available at {ENL_GRAPH_PATH}', file=sys.stderr)
        sys.exit(1)

    depth_label = f'depth: {depth}' if depth else 'full chain'
    _header(f'DRILLDOWN: {node_id}  [{depth_label}]')
    print(f'  contract_id:  {CONTRACT_ID}')
    print()

    display_enl_chain_from_graph(enl_graph, node_id, depth=depth)

# ── List mode ─────────────────────────────────────────────────────────────────

def cmd_list():
    """List available signals and queries."""
    ev_index = _load_evidence_index()
    sig_registry = _load_signal_registry()
    qmap = _load_query_map()

    print()
    print(f'ENL EXPOSURE — Available Resources')
    print(_sep())
    print(f'  contract_id: {CONTRACT_ID}')
    print()

    print(f'  Signals ({len(sig_registry)}):')
    for sid in sorted(sig_registry):
        sig = sig_registry[sid]
        has_ev = 'ev:YES' if sid in ev_index else 'ev:NO'
        print(f'    {sid}  [{has_ev}]  {sig["title"][:55]}')
    print()

    enl_graph = _load_enl_graph()
    graph_nodes = enl_graph.get('nodes', []) if enl_graph else []
    print(f'  ENL graph nodes ({len(graph_nodes)}):')
    for node in graph_nodes:
        print(f'    {node["node_id"]}  [{node["node_type"]}]  {node["title"][:50]}')
    print()

    print(f'  Queries ({len(qmap)}):')
    for qid in sorted(qmap):
        q = qmap[qid]
        sigs = [m['signal_id'] for m in q.get('mapped_signals', [])]
        print(f'    {qid}  [{q["intent_type"]}]  signals: {", ".join(sigs)}')
    print()

# ── Helper — check if a signal is reachable from an INTEL node in graph ───────

def _signal_in_graph_chain(graph: dict, intel_node_id: str, signal_id: str) -> bool:
    """
    Check if signal_id appears in the source_ref of any node in the upstream
    chain from intel_node_id. Used to match INTEL nodes to signals.
    """
    try:
        result = _engine.get_upstream_chain(graph, intel_node_id)
        for node in result.get('nodes', []):
            source_ref = node.get('source_ref', '')
            if signal_id in source_ref or signal_id.replace('SIG-', 'SIG-003').replace('003', '') in source_ref:
                return True
        # Also check SIG-41 node source_ref which typically references the signal
        for node in result.get('nodes', []):
            if node['node_type'] == 'SIG-41':
                sr = node.get('source_ref', '')
                # e.g. "docs/pios/41.4/signal_registry.json#SIG-003"
                for sig_num in ['001', '002', '003', '004', '005']:
                    if f'SIG-{sig_num}' in sr:
                        if signal_id == f'SIG-{sig_num}':
                            return True
        return False
    except Exception:
        return False

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description=(
            'ENL Evidence Exposure Console Adapter — PIOS-42.15-RUN01-CONTRACT-v1\n'
            'Exposes ENL chains for signals and queries. Read-only. Additive only.\n'
            'No modification of existing 42.x output.'
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--query', '-q', metavar='QUERY_ID',
                       help='Show ENL chains for all signals in a query (e.g. GQ-003)')
    group.add_argument('--signal', '-s', metavar='SIGNAL_ID',
                       help='Show ENL chain for a single signal (e.g. SIG-001)')
    group.add_argument('--drilldown', '-d', metavar='NODE_ID',
                       help='Step-by-step drilldown from ENL node (e.g. INTEL-GQ003-001)')
    group.add_argument('--list', '-l', action='store_true',
                       help='List available signals, queries, and ENL graph nodes')

    parser.add_argument('--depth', type=int, default=None,
                        help='With --drilldown: number of layers to show (default: all)')

    args = parser.parse_args()

    if args.list:
        cmd_list()
    elif args.query:
        cmd_query(args.query)
    elif args.signal:
        cmd_signal(args.signal)
    elif args.drilldown:
        cmd_drilldown(args.drilldown, depth=args.depth)


if __name__ == '__main__':
    main()

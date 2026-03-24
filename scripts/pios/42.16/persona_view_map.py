#!/usr/bin/env python3
"""
persona_view_map.py
PIOS-42.16-RUN01-CONTRACT-v1 · run_01_enl_ui_exposure

Persona-Based Evidence View Map — Stream 42.16

Renders ExecLens evidence views filtered by persona (EXECUTIVE, CTO, ANALYST).
Same governed truth. Different exposure depth, ordering, and emphasis.

Modes:
  --persona EXECUTIVE --query GQ-003      EXECUTIVE view for a query
  --persona CTO       --signal SIG-003    CTO view for a signal
  --persona ANALYST   --query GQ-003      ANALYST view for a query
  --depth N           Override default persona drill-down depth

Personas:
  EXECUTIVE  depth=1  signal + confidence + business impact; evidence collapsed
  CTO        depth=3  domain/capability/component + partial chain + blocking_point
  ANALYST    depth=4  full chain + supporting objects + full provenance

Rules:
  R1  all field values verbatim from source
  R2  persona changes display depth/order/emphasis only — no truth change
  R3  persona must be explicitly selected — no default
  R4  deterministic — same persona + query + state → same output
  R5  additive — does not modify existing 42.x output
  R6  read-only — no writes to upstream files

Python 3.9+ standard library only.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]

# ── Paths ─────────────────────────────────────────────────────────────────────

EVIDENCE_INDEX  = REPO_ROOT / "docs/pios/41.4/evidence_mapping_index.json"
SIGNAL_REGISTRY = REPO_ROOT / "docs/pios/41.4/signal_registry.json"
QUERY_MAP       = REPO_ROOT / "docs/pios/41.5/query_signal_map.json"
ENL_GRAPH_PATH  = REPO_ROOT / "docs/pios/enl/examples/ENL-002_minimal_graph_example.json"
ENL_MODULE_PATH = REPO_ROOT / "scripts/pios/enl"
DEMO_ACTIVATE   = REPO_ROOT / "scripts/pios/42.13/demo_activate.py"

CONTRACT_ID = "PIOS-42.16-RUN01-CONTRACT-v1"
W = 66

# ── Persona definitions ───────────────────────────────────────────────────────

PERSONAS = {
    'EXECUTIVE': {'default_depth': 1},
    'CTO':       {'default_depth': 3},
    'ANALYST':   {'default_depth': 4},
}

# ── ENL engine imports ────────────────────────────────────────────────────────

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
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as e:
        print(f'[ERROR] Cannot load {label}: {e}', file=sys.stderr)
        sys.exit(1)

def _load_evidence_index():
    data = _load_json(EVIDENCE_INDEX, 'evidence_mapping_index.json')
    return {s['signal_id']: s for s in data.get('signals', [])}

def _load_signal_registry():
    data = _load_json(SIGNAL_REGISTRY, 'signal_registry.json')
    return {s['signal_id']: s for s in data.get('signals', [])}

def _load_query_map():
    data = _load_json(QUERY_MAP, 'query_signal_map.json')
    return {q['query_id']: q for q in data.get('queries', [])}

def _load_enl_graph():
    if not ENL_GRAPH_PATH.is_file() or not _enl_available:
        return None
    try:
        g = _engine.load_graph(str(ENL_GRAPH_PATH))
        _engine.validate_graph(g)
        return g
    except Exception:
        return None

def _get_path_state() -> str:
    try:
        result = subprocess.run(
            [sys.executable, str(DEMO_ACTIVATE), '--status'],
            capture_output=True, text=True, cwd=str(REPO_ROOT)
        )
        for line in result.stdout.splitlines():
            if 'path_state' in line.lower():
                # Extract value after colon
                parts = line.split(':', 1)
                if len(parts) == 2:
                    return parts[1].strip()
    except Exception:
        pass
    return 'SEMANTIC_PATH_INACTIVE'

# ── Display helpers ───────────────────────────────────────────────────────────

def _sep(char='─'):
    return char * W

def _frame_header(persona: str, target_id: str, target_text: str, path_state: str) -> str:
    top    = '╔' + '═' * (W - 2) + '╗'
    bottom = '╚' + '═' * (W - 2) + '╝'
    l1 = f'  [PERSONA: {persona}]  {target_id} — {target_text}'[:W - 4]
    l2 = f'  path_state: {path_state}  |  mode: EVIDENCE-FIRST'[:W - 4]
    b1 = '║  ' + l1.ljust(W - 4) + '║'
    b2 = '║  ' + l2.ljust(W - 4) + '║'
    return '\n'.join([top, b1, b2, bottom])

# ── Evidence mapping chain display per persona ────────────────────────────────

def _display_ev_signal(persona: str, signal_id: str, ev: dict, sig: dict, depth: int):
    """Render a signal block from evidence_mapping_index.json for the given persona."""
    title = sig.get('title', signal_id) if sig else signal_id
    print(f'  {_sep()}')
    print(f'  Signal: {signal_id}  —  {title}')
    print()

    if persona == 'EXECUTIVE':
        # [1] statement
        print(f'  statement: {sig["statement"]}' if sig else '')
        # [2] evidence_confidence
        print(f'  evidence_confidence: {sig.get("evidence_confidence", "UNKNOWN")}' if sig else '')
        # [3] business_impact
        bi = sig.get('business_impact') if sig else None
        if bi:
            print(f'  business_impact: {bi}')
        # [4] risk
        risk = sig.get('risk') if sig else None
        if risk:
            print(f'  risk: {risk}')
        # [5] evidence summary line (verbatim fields only)
        conf = sig.get('evidence_confidence', '') if sig else ''
        print(f'  evidence: {ev["source_layer"]}/{ev["source_object_id"]} [{conf}]')
        if depth > 1:
            # Depth override: show more
            _display_ev_chain_partial(persona, ev, depth)

    elif persona == 'CTO':
        # [1] domain/capability/component
        if sig:
            print(f'  domain:     {sig.get("domain_name", "")}')
            print(f'  capability: {sig.get("capability_name", "")}')
            comps = sig.get('component_names', [])
            if comps:
                print(f'  components: {", ".join(comps)}')
        # [2] statement
        if sig:
            print(f'  statement: {sig["statement"]}')
        # [3] source_object_id
        print(f'  source_object_id: {ev["source_object_id"]}  layer: {ev["source_layer"]}')
        # [4] supporting objects
        supporting = ev.get('supporting_objects', [])
        if supporting:
            print(f'  [SUPPORTING]  ({len(supporting)} objects)')
            for obj in supporting:
                print(f'    {obj["object_id"]}  [{obj["layer"]}]  state: {obj["state"]}')
        # [5] blocking_point (always)
        bp = ev.get('blocking_point')
        print(f'  [BLOCKED]  blocking_point: {bp}' if bp else f'  blocking_point: {bp}')
        # [6] temporal_reference
        tr = ev.get('temporal_reference')
        if tr:
            print(f'  temporal_reference: {tr}')
        # [7] evidence_confidence
        if sig:
            print(f'  evidence_confidence: {sig.get("evidence_confidence", "")}')
        # partial evidence chain if depth >= 3
        if depth >= 3:
            _display_ev_chain_partial(persona, ev, depth)

    elif persona == 'ANALYST':
        # [1] evidence_chain (full verbatim — first)
        print(f'  [EVIDENCE]')
        chain_str = ev.get('evidence_chain', '')
        if ' → ' in chain_str:
            parts = chain_str.split(' → ')
            print(f'    {parts[0]}')
            for part in parts[1:]:
                print(f'    → {part}')
        else:
            print(f'    {chain_str}')
        # [2] supporting objects
        supporting = ev.get('supporting_objects', [])
        if supporting:
            print(f'  [SUPPORTING]  ({len(supporting)} objects)')
            for obj in supporting:
                print(f'    object_id: {obj["object_id"]}  layer: {obj["layer"]}  '
                      f'file: {obj["file"]}  state: {obj["state"]}')
        # [3] provenance
        print(f'  [PROVENANCE]')
        print(f'    source_object_id: {ev["source_object_id"]}')
        print(f'    source_layer:     {ev["source_layer"]}')
        print(f'    source_file:      {ev["source_file"]}')
        # [4] blocking_point (always)
        bp = ev.get('blocking_point')
        print(f'    blocking_point:   {bp}')
        # [5] temporal_reference
        tr = ev.get('temporal_reference')
        if tr:
            print(f'    temporal_reference: {tr}')
        # [6] statement
        if sig:
            print(f'  statement: {sig["statement"]}')
        # [7] domain/capability/component
        if sig:
            print(f'  domain:     {sig.get("domain_name", "")}')
            print(f'  capability: {sig.get("capability_name", "")}')
            comps = sig.get('component_names', [])
            if comps:
                print(f'  components: {", ".join(comps)}')
        # [8] evidence_confidence + rationale
        if sig:
            print(f'  evidence_confidence: {sig.get("evidence_confidence", "")}')
            cr = sig.get('confidence_rationale')
            if cr:
                print(f'  confidence_rationale: {cr}')
        # chain_status
        print(f'  chain_status: evidence-mapping (41.4)')
    print()

def _display_ev_chain_partial(persona: str, ev: dict, depth: int):
    """Show partial evidence chain string for depth override cases."""
    chain_str = ev.get('evidence_chain', '')
    if chain_str:
        print(f'  [EVIDENCE]  (verbatim)')
        if ' → ' in chain_str:
            parts = chain_str.split(' → ')
            shown = min(depth, len(parts))
            for i, part in enumerate(parts[:shown]):
                prefix = '    ' if i == 0 else '    → '
                print(f'{prefix}{part}')
            if shown < len(parts):
                print(f'    [{len(parts) - shown} more segments — use --depth 4]')
        else:
            print(f'    {chain_str}')

# ── ENL graph chain display per persona ───────────────────────────────────────

def _display_enl_chain(persona: str, graph, intel_node_id: str, depth: int,
                       sig: dict = None, ev: dict = None):
    """Render ENL chain from graph using drilldown, filtered by persona depth."""
    try:
        view = _binding.bind_get_upstream_view(graph, intel_node_id)
    except Exception as e:
        print(f'  [ERROR] ENL bind failed for {intel_node_id}: {e}')
        return

    chain = view['chain']
    total = len(chain)
    terminates = view.get('terminates_in_evid', False)
    session = _drilldown.create_drilldown_session(view)

    # For EXECUTIVE: show signal-level fields first, chain second
    if persona == 'EXECUTIVE' and sig:
        print(f'  statement: {sig["statement"]}')
        print(f'  evidence_confidence: {sig.get("evidence_confidence", "")}')
        bi = sig.get('business_impact')
        if bi:
            print(f'  business_impact: {bi}')
        risk = sig.get('risk')
        if risk:
            print(f'  risk: {risk}')
        print()

    # For CTO: domain/capability/component first
    if persona == 'CTO' and sig:
        print(f'  domain:     {sig.get("domain_name", "")}')
        print(f'  capability: {sig.get("capability_name", "")}')
        comps = sig.get('component_names', [])
        if comps:
            print(f'  components: {", ".join(comps)}')
        print()

    print(f'  [ENL CHAIN]  depth: {min(depth, total)}/{total}')
    shown = 0
    for i in range(total):
        step = _drilldown.get_current_step(session)
        if i < depth:
            node = step['node']
            derived = node.get('derived_from', [])
            derived_str = ', '.join(derived) if derived else '(terminal — evidence origin)'
            print()
            print(f'    Step {i+1}/{total}  [{node["node_type"]}]  {node["node_id"]}')
            print(f'      title:        {node["title"]}')
            print(f'      status:       {node["status"]}')
            print(f'      source_ref:   {node["source_ref"]}')
            print(f'      derived_from: {derived_str}')
            if persona == 'ANALYST':
                print(f'      run_id:       {node["run_id"]}')
                if node.get('created_at'):
                    print(f'      created_at:   {node["created_at"]}')
            shown += 1
            if i < depth - 1 and i < total - 1:
                print()
                print('    ↓')
        if not step['at_end']:
            session = _drilldown.step_forward(session)

    print()
    if depth < total:
        print(f'  [chain: {total - shown} more layers — use --depth 4 for full chain]')

    if persona in ('CTO', 'ANALYST'):
        print(f'  chain_status: {"complete" if terminates else "incomplete_terminal"}')

    if persona == 'ANALYST':
        breadcrumbs = _drilldown.get_breadcrumbs(session)
        bc_str = ' → '.join(b['node_id'] for b in breadcrumbs)
        print(f'  breadcrumbs:  {bc_str}')

    # For CTO: show blocking_point from evidence index
    if persona == 'CTO' and ev:
        bp = ev.get('blocking_point')
        print(f'  [BLOCKED]  blocking_point: {bp}' if bp else f'  blocking_point: {bp}')
        tr = ev.get('temporal_reference')
        if tr:
            print(f'  temporal_reference: {tr}')

    print()

# ── Signal detection in ENL graph ─────────────────────────────────────────────

def _find_intel_node_for_signal(graph, signal_id: str):
    """Find INTEL node in graph whose chain traces to this signal."""
    if not _enl_available or not graph:
        return None
    for node in graph.get('nodes', []):
        if node['node_type'] != 'INTEL':
            continue
        try:
            result = _engine.get_upstream_chain(graph, node['node_id'])
            for n in result.get('nodes', []):
                sr = n.get('source_ref', '')
                if signal_id in sr:
                    return node['node_id']
        except Exception:
            continue
    return None

# ── Query sort order per persona ──────────────────────────────────────────────

def _sort_signals(persona: str, mapped_signals: list, sig_registry: dict) -> list:
    """Sort mapped signals per persona ordering spec."""
    if persona == 'EXECUTIVE':
        # evidence_confidence DESC: STRONG > MODERATE > WEAK > unknown
        confidence_order = {'STRONG': 0, 'MODERATE': 1, 'WEAK': 2}
        def key_exec(m):
            sig = sig_registry.get(m['signal_id'], {})
            c = sig.get('evidence_confidence', 'UNKNOWN')
            return (confidence_order.get(c, 3), m['signal_id'])
        return sorted(mapped_signals, key=key_exec)

    elif persona == 'CTO':
        # INSTABILITY/structural signals first, then signal_id ASC
        def key_cto(m):
            sig = sig_registry.get(m['signal_id'], {})
            # Check if this signal has structural/dependency emphasis
            ev_chain = ''  # will be checked from evidence index
            is_structural = any(kw in sig.get('statement', '').lower()
                                for kw in ['dependency', 'structural', 'blast', 'infrastructure'])
            return (0 if is_structural else 1, m['signal_id'])
        return sorted(mapped_signals, key=key_cto)

    else:  # ANALYST
        # Canonical order: signal_id ASC
        return sorted(mapped_signals, key=lambda m: m['signal_id'])

# ── Main display functions ────────────────────────────────────────────────────

def display_query(persona: str, query_id: str, depth: int):
    """Display persona view for all signals in a query."""
    qmap = _load_query_map()
    if query_id not in qmap:
        print(f'[ERROR] Query {query_id!r} not found', file=sys.stderr)
        sys.exit(1)

    query = qmap[query_id]
    ev_index = _load_evidence_index()
    sig_registry = _load_signal_registry()
    path_state = _get_path_state()
    enl_graph = _load_enl_graph()

    qt = query['query_text'][:40] + '...' if len(query['query_text']) > 40 else query['query_text']
    print()
    print(_frame_header(persona, query_id, qt, path_state))
    print()
    print(f'  contract_id: {CONTRACT_ID}')
    print(f'  query_id:    {query_id}')

    if persona in ('CTO', 'ANALYST'):
        print(f'  intent_type: {query["intent_type"]}')
    if persona == 'ANALYST':
        tags = query.get('semantic_tags', [])
        if tags:
            print(f'  semantic_tags: {", ".join(tags)}')

    print(f'  aggregate_confidence: {query["aggregate_confidence"]}')
    mapped = query.get('mapped_signals', [])
    print(f'  signals: {len(mapped)}')
    print()

    sorted_signals = _sort_signals(persona, mapped, sig_registry)

    for i, mapping in enumerate(sorted_signals):
        signal_id = mapping['signal_id']
        print(f'  ── Signal {i+1}/{len(sorted_signals)}: {signal_id} [{mapping["relevance"]}] ──')

        ev = ev_index.get(signal_id)
        sig = sig_registry.get(signal_id)

        # Try ENL graph mode
        intel_node_id = _find_intel_node_for_signal(enl_graph, signal_id) if enl_graph else None

        if intel_node_id and _enl_available:
            _display_enl_chain(persona, enl_graph, intel_node_id, depth, sig=sig, ev=ev)
        elif ev:
            _display_ev_signal(persona, signal_id, ev, sig, depth)
        else:
            print(f'  [WARN] No evidence data for {signal_id}')
            print()


def display_signal(persona: str, signal_id: str, depth: int):
    """Display persona view for a single signal."""
    ev_index = _load_evidence_index()
    sig_registry = _load_signal_registry()
    path_state = _get_path_state()
    enl_graph = _load_enl_graph()

    ev = ev_index.get(signal_id)
    sig = sig_registry.get(signal_id)

    if not ev and not sig:
        print(f'[ERROR] Signal {signal_id!r} not found', file=sys.stderr)
        sys.exit(1)

    sig_title = sig.get('title', signal_id) if sig else signal_id
    short_title = sig_title[:40] + '...' if len(sig_title) > 40 else sig_title

    print()
    print(_frame_header(persona, signal_id, short_title, path_state))
    print()
    print(f'  contract_id: {CONTRACT_ID}')
    print()

    intel_node_id = _find_intel_node_for_signal(enl_graph, signal_id) if enl_graph else None

    if intel_node_id and _enl_available:
        _display_enl_chain(persona, enl_graph, intel_node_id, depth, sig=sig, ev=ev)
    elif ev:
        _display_ev_signal(persona, signal_id, ev, sig, depth)
    else:
        print(f'  [WARN] No evidence data for {signal_id}')

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description=(
            'Persona-Based Evidence View Map — PIOS-42.16-RUN01-CONTRACT-v1\n'
            'Same governed truth. Different exposure depth per persona.\n'
            'Personas: EXECUTIVE (depth=1), CTO (depth=3), ANALYST (depth=4)'
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--persona', '-p', required=True,
                        help='Persona: EXECUTIVE, CTO, or ANALYST (required)')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--query', '-q', metavar='QUERY_ID',
                       help='Query to display (e.g. GQ-003)')
    group.add_argument('--signal', '-s', metavar='SIGNAL_ID',
                       help='Signal to display (e.g. SIG-001)')
    parser.add_argument('--depth', type=int, default=None,
                        help='Override default persona drill-down depth (1-4)')

    args = parser.parse_args()

    persona = args.persona.upper()
    if persona not in PERSONAS:
        print(f'[ERROR] Unknown persona: {args.persona!r}. Valid: EXECUTIVE, CTO, ANALYST',
              file=sys.stderr)
        sys.exit(1)

    default_depth = PERSONAS[persona]['default_depth']
    depth = args.depth if args.depth is not None else default_depth
    depth = max(1, min(4, depth))  # clamp to valid range

    if args.query:
        display_query(persona, args.query, depth)
    elif args.signal:
        display_signal(persona, args.signal, depth)


if __name__ == '__main__':
    main()

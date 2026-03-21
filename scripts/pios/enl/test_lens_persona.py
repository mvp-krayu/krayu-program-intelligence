#!/usr/bin/env python3
"""
test_lens_persona.py
ENL-005-CONTRACT-v1 · run_01_blueedge

Tests for lens_persona_v1.py.

Validation criteria:
  - original view unchanged after projection (deep equality)
  - no ENL node field mutation in any projected view
  - node count identical before and after projection
  - collapsed nodes still present in chain / subgraph
  - deterministic output (identical results on repeated calls)
  - label mapping correctness (prefix applied, title unchanged in source)
  - confidence flags applied without filtering nodes
  - apply_persona dispatches to correct projection per view type
  - invalid persona_config raises LensPersonaError
  - empty persona_config returns view unchanged

Python 3.9+ standard library only.
"""

import copy
import os
import sys

REPO_ROOT    = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
EXAMPLE_PATH = os.path.join(
    REPO_ROOT, 'docs', 'pios', 'enl', 'examples',
    'ENL-002_minimal_graph_example.json'
)

sys.path.insert(0, os.path.dirname(__file__))

from enl_query_engine_v1 import load_graph, validate_graph
from lens_binding_v1 import (
    bind_get_full_graph, bind_get_node,
    bind_get_upstream_view, bind_get_query_view,
)
from lens_persona_v1 import (
    apply_persona,
    project_upstream_view,
    project_query_view,
    project_node_view,
    LensPersonaError,
)

# ── Test infrastructure ───────────────────────────────────────────────────────

results = []

def test(label, passed, detail=''):
    results.append((label, passed, detail))

def assert_raises(exc_type, fn, *args, **kwargs):
    try:
        fn(*args, **kwargs)
        return False, f"Expected {exc_type.__name__} but no exception raised"
    except exc_type:
        return True, ''
    except Exception as e:
        return False, f"Expected {exc_type.__name__}, got {type(e).__name__}: {e}"

# ── Test fixtures ─────────────────────────────────────────────────────────────

try:
    GRAPH = load_graph(EXAMPLE_PATH)
    validate_graph(GRAPH)
    LOADED = True
    LOAD_ERROR = ''
except Exception as e:
    LOADED = False
    LOAD_ERROR = str(e)

test('P-01: graph loads and validates', LOADED, LOAD_ERROR)

if LOADED:
    UPSTREAM_VIEW   = bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001')
    QUERY_VIEW      = bind_get_query_view(GRAPH, 'GQ-003')
    NODE_VIEW       = bind_get_node(GRAPH, 'INTEL-GQ003-001')
    FULL_GRAPH_VIEW = bind_get_full_graph(GRAPH)

# Full persona — all configuration fields set
FULL_PERSONA = {
    'persona_id':           'executive',
    'label_map': {
        'INTEL':  'Finding',
        'SIG-41': 'Signal',
        'SIG-40': 'Measurement',
        'EVID':   'Source',
    },
    'layer_emphasis':       ['INTEL'],
    'visibility_rules': {
        'SIG-40': 'collapsed',
        'EVID':   'collapsed',
    },
    'confidence_threshold': 0.7,
    'node_confidence': {
        'SIG41-SIG003-001': 0.6,   # below threshold → confidence_flag: "low"
        'INTEL-GQ003-001':  0.95,  # above threshold → confidence_flag: "normal"
    },
}

# Minimal persona — only persona_id
MINIMAL_PERSONA = {
    'persona_id': 'minimal',
}

# ── apply_persona — empty / missing persona_id returns view unchanged ─────────

if LOADED:
    result = apply_persona(UPSTREAM_VIEW, {})
    test('P-02: apply_persona with empty config returns original view',
         result is UPSTREAM_VIEW)

    result = apply_persona(UPSTREAM_VIEW, {'persona_id': ''})
    test('P-03: apply_persona with empty persona_id returns original view',
         result is UPSTREAM_VIEW)

# ── project_upstream_view — structure ─────────────────────────────────────────

if LOADED:
    projected = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)

    test('P-04: project_upstream_view returns a new dict (not the original)',
         projected is not UPSTREAM_VIEW)

    test('P-05: projected upstream view has persona block',
         'persona' in projected)

    test('P-06: persona block has persona_id',
         projected['persona']['persona_id'] == 'executive')

    test('P-07: persona block applied is True',
         projected['persona']['applied'] is True)

    test('P-08: projected upstream view has node_display block',
         'node_display' in projected)

    test('P-09: node_display has entry for every chain node',
         all(n['node_id'] in projected['node_display']
             for n in projected['chain']))

    test('P-10: original upstream view fields preserved (status)',
         projected['status'] == UPSTREAM_VIEW['status'])

    test('P-11: original upstream view fields preserved (terminates_in_evid)',
         projected['terminates_in_evid'] == UPSTREAM_VIEW['terminates_in_evid'])

    test('P-12: original chain list reference preserved',
         projected['chain'] is UPSTREAM_VIEW['chain'])

    test('P-13: original entry_node reference preserved',
         projected['entry_node'] is UPSTREAM_VIEW['entry_node'])

# ── Original view immutability after projection ───────────────────────────────

if LOADED:
    upstream_before  = copy.deepcopy(UPSTREAM_VIEW)
    query_before     = copy.deepcopy(QUERY_VIEW)
    node_before      = copy.deepcopy(NODE_VIEW)
    full_graph_before = copy.deepcopy(FULL_GRAPH_VIEW)

    _ = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)
    _ = project_query_view(QUERY_VIEW, FULL_PERSONA)
    _ = project_node_view(NODE_VIEW, FULL_PERSONA)
    _ = apply_persona(FULL_GRAPH_VIEW, FULL_PERSONA)

    test('P-14: original upstream view unchanged after projection',
         UPSTREAM_VIEW == upstream_before)
    test('P-15: original query view unchanged after projection',
         QUERY_VIEW == query_before)
    test('P-16: original node view unchanged after projection',
         NODE_VIEW == node_before)
    test('P-17: original full graph view unchanged after projection',
         FULL_GRAPH_VIEW == full_graph_before)

# ── ENL node field integrity ──────────────────────────────────────────────────

if LOADED:
    original_by_id = {n['node_id']: n for n in GRAPH['nodes']}

    projected = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)
    for node in projected['chain']:
        test(f'P-18: ENL node fields unchanged in chain: {node["node_id"]}',
             node == original_by_id[node['node_id']])

    projected = project_query_view(QUERY_VIEW, FULL_PERSONA)
    for node in projected['subgraph']:
        test(f'P-18: ENL node fields unchanged in subgraph: {node["node_id"]}',
             node == original_by_id[node['node_id']])

    projected = project_node_view(NODE_VIEW, FULL_PERSONA)
    intel_original = original_by_id['INTEL-GQ003-001']
    test('P-18: ENL node fields unchanged in node view',
         projected['node'] == intel_original)

    # No extra keys injected into ENL node dicts
    projected_up_chain = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)['chain']
    for node in projected_up_chain:
        test(f'P-19: no extra keys injected into chain node {node["node_id"]}',
             set(node.keys()) == set(original_by_id[node['node_id']].keys()))

# ── Node count unchanged after projection ─────────────────────────────────────

if LOADED:
    projected = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)
    test('P-20: upstream chain count unchanged after projection',
         len(projected['chain']) == len(UPSTREAM_VIEW['chain']))

    projected = project_query_view(QUERY_VIEW, FULL_PERSONA)
    test('P-21: query subgraph count unchanged after projection',
         len(projected['subgraph']) == len(QUERY_VIEW['subgraph']))
    test('P-22: query count field unchanged after projection',
         projected['count'] == QUERY_VIEW['count'])
    test('P-23: query seed_nodes count unchanged after projection',
         len(projected['seed_nodes']) == len(QUERY_VIEW['seed_nodes']))

# ── Collapsed nodes still present ────────────────────────────────────────────

if LOADED:
    projected = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)

    # SIG-40 and EVID are in visibility_rules as "collapsed"
    collapsed_types = {'SIG-40', 'EVID'}
    chain_types = {n['node_type'] for n in projected['chain']}

    test('P-24: collapsed node types (SIG-40, EVID) still present in chain',
         collapsed_types.issubset(chain_types),
         f"chain types: {chain_types}")

    # visible flag is False for collapsed types in node_display
    for node in projected['chain']:
        nid  = node['node_id']
        nt   = node['node_type']
        disp = projected['node_display'][nid]
        if nt in ('SIG-40', 'EVID'):
            test(f'P-25: visible=False for collapsed node {nid}',
                 disp['visible'] is False,
                 f"got visible={disp['visible']}")
        else:
            test(f'P-25: visible=True for non-collapsed node {nid}',
                 disp['visible'] is True,
                 f"got visible={disp['visible']}")

# ── Label mapping correctness ─────────────────────────────────────────────────

if LOADED:
    projected = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)

    intel_node = next(n for n in projected['chain'] if n['node_type'] == 'INTEL')
    intel_disp = projected['node_display'][intel_node['node_id']]
    expected_label = f"Finding: {intel_node['title']}"

    test('P-26: label_map prefix applied to INTEL node label',
         intel_disp['label'] == expected_label,
         f"got {intel_disp['label']!r}")

    # Original title in ENL node dict is unchanged
    test('P-27: original node title unchanged after label projection',
         intel_node['title'] == GRAPH['nodes'][0]['title']
         or intel_node['title'] in {n['title'] for n in GRAPH['nodes']})

    sig41_node = next(n for n in projected['chain'] if n['node_type'] == 'SIG-41')
    sig41_disp = projected['node_display'][sig41_node['node_id']]
    expected_sig41 = f"Signal: {sig41_node['title']}"
    test('P-28: label_map prefix applied to SIG-41 node',
         sig41_disp['label'] == expected_sig41,
         f"got {sig41_disp['label']!r}")

    # Minimal persona (no label_map) → label equals original title
    minimal_projected = project_upstream_view(UPSTREAM_VIEW, MINIMAL_PERSONA)
    for node in minimal_projected['chain']:
        disp = minimal_projected['node_display'][node['node_id']]
        test(f'P-29: no label_map → label equals original title for {node["node_id"]}',
             disp['label'] == node['title'],
             f"got {disp['label']!r}, expected {node['title']!r}")

# ── Layer emphasis / highlight ────────────────────────────────────────────────

if LOADED:
    projected = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)

    for node in projected['chain']:
        nid  = node['node_id']
        nt   = node['node_type']
        disp = projected['node_display'][nid]
        if nt == 'INTEL':
            test(f'P-30: highlight=True for INTEL node {nid} (in layer_emphasis)',
                 disp['highlight'] is True)
        else:
            test(f'P-30: highlight=False for {nt} node {nid} (not in layer_emphasis)',
                 disp['highlight'] is False,
                 f"got {disp['highlight']}")

# ── Confidence flags applied without filtering ────────────────────────────────

if LOADED:
    projected = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)

    sig41_disp  = projected['node_display']['SIG41-SIG003-001']
    intel_disp2 = projected['node_display']['INTEL-GQ003-001']

    test('P-31: SIG41-SIG003-001 confidence_flag is "low" (score 0.6 < threshold 0.7)',
         sig41_disp['confidence_flag'] == 'low',
         f"got {sig41_disp['confidence_flag']!r}")

    test('P-32: INTEL-GQ003-001 confidence_flag is "normal" (score 0.95 ≥ 0.7)',
         intel_disp2['confidence_flag'] == 'normal',
         f"got {intel_disp2['confidence_flag']!r}")

    # Nodes without explicit confidence score default to "normal"
    sig40_disp = projected['node_display']['SIG40-SIG003-001']
    evid_disp  = projected['node_display']['EVID-ST007-001']
    test('P-33: SIG40-SIG003-001 confidence_flag is "normal" (no score provided)',
         sig40_disp['confidence_flag'] == 'normal')
    test('P-34: EVID-ST007-001 confidence_flag is "normal" (no score provided)',
         evid_disp['confidence_flag'] == 'normal')

    # Low confidence_flag does NOT remove the node from the chain
    test('P-35: SIG41 node with low confidence_flag still present in chain',
         any(n['node_id'] == 'SIG41-SIG003-001' for n in projected['chain']))

    # Minimal persona (no threshold) → all nodes get "normal"
    minimal_projected = project_upstream_view(UPSTREAM_VIEW, MINIMAL_PERSONA)
    for node in minimal_projected['chain']:
        disp = minimal_projected['node_display'][node['node_id']]
        test(f'P-36: no threshold → confidence_flag "normal" for {node["node_id"]}',
             disp['confidence_flag'] == 'normal',
             f"got {disp['confidence_flag']!r}")

# ── project_query_view ────────────────────────────────────────────────────────

if LOADED:
    projected = project_query_view(QUERY_VIEW, FULL_PERSONA)

    test('P-37: project_query_view returns new dict',
         projected is not QUERY_VIEW)

    test('P-38: project_query_view has persona block',
         projected.get('persona', {}).get('applied') is True)

    test('P-39: project_query_view has node_display for all subgraph nodes',
         all(n['node_id'] in projected['node_display']
             for n in projected['subgraph']))

    test('P-40: project_query_view status preserved',
         projected['status'] == QUERY_VIEW['status'])

    test('P-41: project_query_view query_id preserved',
         projected['query_id'] == QUERY_VIEW['query_id'])

    test('P-42: project_query_view subgraph list reference preserved',
         projected['subgraph'] is QUERY_VIEW['subgraph'])

    test('P-43: project_query_view seed_nodes list reference preserved',
         projected['seed_nodes'] is QUERY_VIEW['seed_nodes'])

    test('P-44: project_query_view count field preserved',
         projected['count'] == QUERY_VIEW['count'])

# ── project_node_view ────────────────────────────────────────────────────────

if LOADED:
    projected = project_node_view(NODE_VIEW, FULL_PERSONA)

    test('P-45: project_node_view returns new dict',
         projected is not NODE_VIEW)

    test('P-46: project_node_view has persona block',
         projected.get('persona', {}).get('applied') is True)

    test('P-47: project_node_view has node_display for the single node',
         'INTEL-GQ003-001' in projected['node_display'])

    test('P-48: project_node_view node reference preserved',
         projected['node'] is NODE_VIEW['node'])

    test('P-49: project_node_view upstream_available preserved',
         projected['upstream_available'] == NODE_VIEW['upstream_available'])

    test('P-50: project_node_view downstream_available preserved',
         projected['downstream_available'] == NODE_VIEW['downstream_available'])

    test('P-51: project_node_view status preserved',
         projected['status'] == NODE_VIEW['status'])

# ── apply_persona dispatch ────────────────────────────────────────────────────

if LOADED:
    # Upstream view
    result = apply_persona(UPSTREAM_VIEW, FULL_PERSONA)
    test('P-52: apply_persona dispatches upstream view correctly',
         'entry_node' in result and 'persona' in result)

    # Query view
    result = apply_persona(QUERY_VIEW, FULL_PERSONA)
    test('P-53: apply_persona dispatches query view correctly',
         'query_id' in result and 'persona' in result)

    # Node view
    result = apply_persona(NODE_VIEW, FULL_PERSONA)
    test('P-54: apply_persona dispatches node view correctly',
         'upstream_available' in result and 'persona' in result)

    # Full graph view
    result = apply_persona(FULL_GRAPH_VIEW, FULL_PERSONA)
    test('P-55: apply_persona dispatches full graph view correctly',
         'run_id' in result and 'persona' in result)

    # apply_persona output matches direct projection function output
    direct = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)
    via_apply = apply_persona(UPSTREAM_VIEW, FULL_PERSONA)
    test('P-56: apply_persona output matches project_upstream_view output',
         via_apply == direct)

    direct = project_query_view(QUERY_VIEW, FULL_PERSONA)
    via_apply = apply_persona(QUERY_VIEW, FULL_PERSONA)
    test('P-57: apply_persona output matches project_query_view output',
         via_apply == direct)

# ── Determinism ──────────────────────────────────────────────────────────────

if LOADED:
    r1 = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)
    r2 = project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)
    test('P-58: project_upstream_view is deterministic',
         r1 == r2)

    r1 = project_query_view(QUERY_VIEW, FULL_PERSONA)
    r2 = project_query_view(QUERY_VIEW, FULL_PERSONA)
    test('P-59: project_query_view is deterministic',
         r1 == r2)

    r1 = project_node_view(NODE_VIEW, FULL_PERSONA)
    r2 = project_node_view(NODE_VIEW, FULL_PERSONA)
    test('P-60: project_node_view is deterministic',
         r1 == r2)

# ── Invalid persona_config raises LensPersonaError ───────────────────────────

if LOADED:
    ok, detail = assert_raises(LensPersonaError, project_upstream_view,
                                UPSTREAM_VIEW, 'not-a-dict')
    test('P-61: non-dict persona_config raises LensPersonaError', ok, detail)

    ok, detail = assert_raises(LensPersonaError, project_upstream_view,
                                UPSTREAM_VIEW, {'persona_id': ''})
    test('P-62: empty persona_id raises LensPersonaError', ok, detail)

    ok, detail = assert_raises(LensPersonaError, project_upstream_view,
                                UPSTREAM_VIEW,
                                {'persona_id': 'x',
                                 'visibility_rules': {'INTEL': 'invisible'}})
    test('P-63: invalid visibility_rules value raises LensPersonaError',
         ok, detail)

    ok, detail = assert_raises(LensPersonaError, project_upstream_view,
                                UPSTREAM_VIEW,
                                {'persona_id': 'x',
                                 'confidence_threshold': 1.5})
    test('P-64: confidence_threshold > 1.0 raises LensPersonaError',
         ok, detail)

    ok, detail = assert_raises(LensPersonaError, project_upstream_view,
                                UPSTREAM_VIEW,
                                {'persona_id': 'x',
                                 'node_confidence': {'NODE-001': 1.2}})
    test('P-65: node_confidence score > 1.0 raises LensPersonaError',
         ok, detail)

# ── Graph and original view still intact after all tests ─────────────────────

if LOADED:
    original_graph = copy.deepcopy(GRAPH)
    # Re-run projections to confirm no accumulated side effects
    project_upstream_view(UPSTREAM_VIEW, FULL_PERSONA)
    project_query_view(QUERY_VIEW, FULL_PERSONA)
    project_node_view(NODE_VIEW, FULL_PERSONA)
    apply_persona(FULL_GRAPH_VIEW, FULL_PERSONA)

    test('P-66: ENL graph unchanged after all persona projection calls',
         GRAPH == original_graph)

# ── Report ─────────────────────────────────────────────────────────────────

print()
print('ENL-005 Persona Projection Tests — test_lens_persona.py')
print('=' * 60)
passed = 0
failed = 0
for label, ok, detail in results:
    status = 'PASS' if ok else 'FAIL'
    line = f'  [{status}] {label}'
    if not ok and detail:
        line += f'\n         → {detail}'
    print(line)
    if ok:
        passed += 1
    else:
        failed += 1

print()
print(f'Result: {passed}/{passed + failed} checks passed')
print()

if failed > 0:
    print('STATUS: FAIL')
    sys.exit(1)
else:
    print('STATUS: PASS')
    sys.exit(0)

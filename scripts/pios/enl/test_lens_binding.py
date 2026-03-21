#!/usr/bin/env python3
"""
test_lens_binding.py
ENL-004-CONTRACT-v1 · run_01_blueedge

Tests for lens_binding_v1.py against the minimal graph example:
  docs/pios/enl/examples/ENL-002_minimal_graph_example.json

Validation criteria:
  - correct delegation to ENL engine (outputs match engine results)
  - graph immutability after all binding calls
  - full upstream chain integrity (all 4 nodes, correct order)
  - incomplete chain explicitly surfaced (status + error field)
  - no node loss in query view (seed + subgraph completeness)
  - deterministic output (identical results on repeated calls)
  - no field injection into ENL nodes
  - apply_persona returns view unchanged

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

from enl_query_engine_v1 import (
    load_graph, validate_graph,
    get_node              as engine_get_node,
    get_upstream_chain    as engine_get_upstream_chain,
    get_downstream_nodes  as engine_get_downstream_nodes,
    get_query_subgraph    as engine_get_query_subgraph,
)
from lens_binding_v1 import (
    bind_get_full_graph,
    bind_get_node,
    bind_get_upstream_view,
    bind_get_query_view,
    apply_persona,
    LensNodeNotFoundError,
    LensInvalidRequestError,
    LensTransitionError,
    LensTraversalError,
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

# ── Load reference graph ──────────────────────────────────────────────────────

try:
    GRAPH = load_graph(EXAMPLE_PATH)
    validate_graph(GRAPH)
    LOADED = True
    LOAD_ERROR = ''
except Exception as e:
    LOADED = False
    LOAD_ERROR = str(e)

test('L-01: minimal graph loads and validates without error', LOADED, LOAD_ERROR)

# ── bind_get_full_graph ───────────────────────────────────────────────────────

if LOADED:
    result = bind_get_full_graph(GRAPH)

    test('L-02: bind_get_full_graph returns status ok',
         result['status'] == 'ok')

    test('L-03: bind_get_full_graph returns correct run_id',
         result['run_id'] == GRAPH['run_id'],
         f"got {result['run_id']!r}")

    test('L-04: bind_get_full_graph returns all 4 nodes',
         result['count'] == 4,
         f"got {result['count']}")

    # Nodes sorted by node_id
    ids = [n['node_id'] for n in result['nodes']]
    test('L-05: bind_get_full_graph nodes sorted by node_id',
         ids == sorted(ids),
         f"got {ids}")

    # No fields added to nodes
    for node in result['nodes']:
        original = next(
            n for n in GRAPH['nodes'] if n['node_id'] == node['node_id']
        )
        test(f"L-06: bind_get_full_graph no fields injected into {node['node_id']}",
             set(node.keys()) == set(original.keys()),
             f"extra keys: {set(node.keys()) - set(original.keys())}")

    # Node field values unchanged
    original_by_id = {n['node_id']: n for n in GRAPH['nodes']}
    for node in result['nodes']:
        test(f"L-07: bind_get_full_graph node {node['node_id']} fields unchanged",
             node == original_by_id[node['node_id']])

# ── bind_get_node — valid ─────────────────────────────────────────────────────

if LOADED:
    result = bind_get_node(GRAPH, 'INTEL-GQ003-001')

    test('L-08: bind_get_node returns status ok',
         result['status'] == 'ok')

    test('L-09: bind_get_node returns correct node',
         result['node']['node_id'] == 'INTEL-GQ003-001')

    # No extra fields in the node itself
    original = next(
        n for n in GRAPH['nodes'] if n['node_id'] == 'INTEL-GQ003-001'
    )
    test('L-10: bind_get_node no fields injected into node dict',
         set(result['node'].keys()) == set(original.keys()),
         f"extra: {set(result['node'].keys()) - set(original.keys())}")

    test('L-11: bind_get_node node fields unchanged',
         result['node'] == original)

    # INTEL has derived_from → upstream_available True
    test('L-12: bind_get_node upstream_available True for INTEL',
         result['upstream_available'] is True)

    # INTEL is not referenced by any node → downstream_available False
    test('L-13: bind_get_node downstream_available False for INTEL',
         result['downstream_available'] is False)

    # EVID: upstream False, downstream True
    result_evid = bind_get_node(GRAPH, 'EVID-ST007-001')
    test('L-14: bind_get_node upstream_available False for EVID',
         result_evid['upstream_available'] is False)
    test('L-15: bind_get_node downstream_available True for EVID',
         result_evid['downstream_available'] is True)

    # SIG-40: upstream True, downstream True
    result_sig40 = bind_get_node(GRAPH, 'SIG40-SIG003-001')
    test('L-16: bind_get_node upstream_available True for SIG-40',
         result_sig40['upstream_available'] is True)
    test('L-17: bind_get_node downstream_available True for SIG-40',
         result_sig40['downstream_available'] is True)

# ── bind_get_node — delegation matches engine ─────────────────────────────────

if LOADED:
    binding_result = bind_get_node(GRAPH, 'SIG41-SIG003-001')
    engine_result  = engine_get_node(GRAPH, 'SIG41-SIG003-001')
    test('L-18: bind_get_node delegates to engine — node field matches',
         binding_result['node'] == engine_result['node'])

# ── bind_get_node — error cases ───────────────────────────────────────────────

if LOADED:
    ok, detail = assert_raises(LensNodeNotFoundError, bind_get_node,
                                GRAPH, 'NONEXISTENT-001')
    test('L-19: bind_get_node raises LensNodeNotFoundError for missing node',
         ok, detail)

    ok, detail = assert_raises(LensInvalidRequestError, bind_get_node,
                                GRAPH, '')
    test('L-20: bind_get_node raises LensInvalidRequestError for empty node_id',
         ok, detail)

    ok, detail = assert_raises(LensInvalidRequestError, bind_get_node,
                                GRAPH, '   ')
    test('L-21: bind_get_node raises LensInvalidRequestError for whitespace node_id',
         ok, detail)

# ── bind_get_upstream_view — complete chain from INTEL ────────────────────────

if LOADED:
    result = bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001')

    test('L-22: bind_get_upstream_view from INTEL returns status complete',
         result['status'] == 'complete')

    test('L-23: bind_get_upstream_view terminates_in_evid True',
         result['terminates_in_evid'] is True)

    test('L-24: bind_get_upstream_view error is None for complete chain',
         result['error'] is None)

    test('L-25: bind_get_upstream_view chain contains 4 nodes',
         len(result['chain']) == 4,
         f"got {len(result['chain'])}")

    returned_types = {n['node_type'] for n in result['chain']}
    test('L-26: bind_get_upstream_view chain covers all 4 layer types',
         returned_types == {'INTEL', 'SIG-41', 'SIG-40', 'EVID'},
         f"got {returned_types}")

    test('L-27: bind_get_upstream_view entry_node is the start node',
         result['entry_node']['node_id'] == 'INTEL-GQ003-001')

    # Layer order: INTEL before SIG-41 before SIG-40 before EVID
    layer_order = {'INTEL': 0, 'SIG-41': 1, 'SIG-40': 2, 'EVID': 3}
    positions = [layer_order[n['node_type']] for n in result['chain']]
    test('L-28: bind_get_upstream_view chain ordered abstract→concrete',
         positions == sorted(positions),
         f"positions: {positions}")

# ── bind_get_upstream_view — delegation matches engine ────────────────────────

if LOADED:
    binding_result = bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001')
    engine_result  = engine_get_upstream_chain(GRAPH, 'INTEL-GQ003-001')

    test('L-29: bind_get_upstream_view chain matches engine output',
         binding_result['chain'] == engine_result['nodes'])

    test('L-30: bind_get_upstream_view terminates_in_evid matches engine',
         binding_result['terminates_in_evid'] == engine_result['terminates_in_evid'])

# ── bind_get_upstream_view — no field injection in chain nodes ─────────────────

if LOADED:
    result = bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001')
    original_by_id = {n['node_id']: n for n in GRAPH['nodes']}
    for node in result['chain']:
        test(f"L-31: no fields injected into chain node {node['node_id']}",
             node == original_by_id[node['node_id']])

# ── bind_get_upstream_view — incomplete chain ─────────────────────────────────

if LOADED:
    bad_graph = copy.deepcopy(GRAPH)
    sig41 = next(n for n in bad_graph['nodes'] if n['node_type'] == 'SIG-41')
    sig41['derived_from'] = ['MISSING-NODE-001']

    result = bind_get_upstream_view(bad_graph, 'INTEL-GQ003-001')

    test('L-32: bind_get_upstream_view returns status incomplete for broken chain',
         result['status'] == 'incomplete',
         f"got {result['status']!r}")

    test('L-33: bind_get_upstream_view terminates_in_evid False for incomplete chain',
         result['terminates_in_evid'] is False)

    test('L-34: bind_get_upstream_view error field non-empty for incomplete chain',
         isinstance(result['error'], str) and len(result['error']) > 0,
         f"error={result['error']!r}")

# ── bind_get_upstream_view — forbidden transition raises ──────────────────────

if LOADED:
    bad_graph = copy.deepcopy(GRAPH)
    intel = next(n for n in bad_graph['nodes'] if n['node_type'] == 'INTEL')
    evid  = next(n for n in bad_graph['nodes'] if n['node_type'] == 'EVID')
    intel['derived_from'] = [evid['node_id']]

    ok, detail = assert_raises(LensTransitionError, bind_get_upstream_view,
                                bad_graph, 'INTEL-GQ003-001')
    test('L-35: bind_get_upstream_view raises LensTransitionError for '
         'forbidden transition', ok, detail)

# ── bind_get_upstream_view — error cases ──────────────────────────────────────

if LOADED:
    ok, detail = assert_raises(LensNodeNotFoundError, bind_get_upstream_view,
                                GRAPH, 'NONEXISTENT-001')
    test('L-36: bind_get_upstream_view raises LensNodeNotFoundError for '
         'missing start node', ok, detail)

    ok, detail = assert_raises(LensInvalidRequestError, bind_get_upstream_view,
                                GRAPH, '')
    test('L-37: bind_get_upstream_view raises LensInvalidRequestError for '
         'empty node_id', ok, detail)

# ── bind_get_query_view — GQ-003 full subgraph ────────────────────────────────

if LOADED:
    result = bind_get_query_view(GRAPH, 'GQ-003')

    test('L-38: bind_get_query_view for GQ-003 returns status complete',
         result['status'] == 'complete',
         f"got {result['status']!r}")

    test('L-39: bind_get_query_view query_id echoed in output',
         result['query_id'] == 'GQ-003')

    test('L-40: bind_get_query_view subgraph contains 4 nodes',
         result['count'] == 4,
         f"got {result['count']}")

    subgraph_types = {n['node_type'] for n in result['subgraph']}
    test('L-41: bind_get_query_view subgraph contains all 4 layer types',
         subgraph_types == {'INTEL', 'SIG-41', 'SIG-40', 'EVID'},
         f"got {subgraph_types}")

    test('L-42: bind_get_query_view seed_nodes is non-empty for GQ-003',
         len(result['seed_nodes']) > 0,
         f"got {len(result['seed_nodes'])}")

    # INTEL is the only node whose source_ref contains "GQ-003"
    seed_types = {n['node_type'] for n in result['seed_nodes']}
    test('L-43: bind_get_query_view seed_nodes contains INTEL node',
         'INTEL' in seed_types,
         f"got {seed_types}")

    # All seed_nodes are also in subgraph
    subgraph_ids = {n['node_id'] for n in result['subgraph']}
    for seed in result['seed_nodes']:
        test(f"L-44: seed node {seed['node_id']} is present in subgraph",
             seed['node_id'] in subgraph_ids)

# ── bind_get_query_view — delegation matches engine ───────────────────────────

if LOADED:
    binding_result = bind_get_query_view(GRAPH, 'GQ-003')
    engine_result  = engine_get_query_subgraph(GRAPH, 'GQ-003')

    test('L-45: bind_get_query_view subgraph matches engine result nodes',
         binding_result['subgraph'] == engine_result['nodes'])

    test('L-46: bind_get_query_view count matches engine result count',
         binding_result['count'] == engine_result['count'])

# ── bind_get_query_view — no node loss ────────────────────────────────────────

if LOADED:
    result = bind_get_query_view(GRAPH, 'GQ-003')
    engine_result = engine_get_query_subgraph(GRAPH, 'GQ-003')

    binding_ids = {n['node_id'] for n in result['subgraph']}
    engine_ids  = {n['node_id'] for n in engine_result['nodes']}

    test('L-47: bind_get_query_view no nodes lost from ENL subgraph',
         binding_ids == engine_ids,
         f"missing: {engine_ids - binding_ids}")

# ── bind_get_query_view — subgraph sorted by node_id ─────────────────────────

if LOADED:
    result = bind_get_query_view(GRAPH, 'GQ-003')
    ids = [n['node_id'] for n in result['subgraph']]
    test('L-48: bind_get_query_view subgraph sorted by node_id',
         ids == sorted(ids),
         f"got {ids}")

# ── bind_get_query_view — no field injection in subgraph nodes ────────────────

if LOADED:
    result = bind_get_query_view(GRAPH, 'GQ-003')
    original_by_id = {n['node_id']: n for n in GRAPH['nodes']}
    for node in result['subgraph']:
        test(f"L-49: no fields injected into subgraph node {node['node_id']}",
             node == original_by_id[node['node_id']])

# ── bind_get_query_view — empty result ───────────────────────────────────────

if LOADED:
    result = bind_get_query_view(GRAPH, 'GQ-NONEXISTENT')
    test('L-50: bind_get_query_view returns status empty for unknown query_id',
         result['status'] == 'empty',
         f"got {result['status']!r}")
    test('L-51: bind_get_query_view subgraph empty for unknown query_id',
         result['subgraph'] == [] and result['count'] == 0)
    test('L-52: bind_get_query_view seed_nodes empty for unknown query_id',
         result['seed_nodes'] == [])

# ── bind_get_query_view — error cases ─────────────────────────────────────────

if LOADED:
    ok, detail = assert_raises(LensInvalidRequestError, bind_get_query_view,
                                GRAPH, '')
    test('L-53: bind_get_query_view raises LensInvalidRequestError for '
         'empty query_id', ok, detail)

# ── apply_persona — placeholder behaviour ────────────────────────────────────

if LOADED:
    view = bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001')
    view_before = copy.deepcopy(view)

    result = apply_persona(view, {'persona': 'executive'})

    test('L-54: apply_persona returns the same view object',
         result is view)

    test('L-55: apply_persona does not mutate view content',
         result == view_before)

    # Persona with no config
    result2 = apply_persona(view, {})
    test('L-56: apply_persona with empty persona_config returns view unchanged',
         result2 == view_before)

    # No fields injected into chain nodes by persona
    original_by_id = {n['node_id']: n for n in GRAPH['nodes']}
    for node in result['chain']:
        test(f"L-57: apply_persona no fields injected into chain node "
             f"{node['node_id']}",
             node == original_by_id[node['node_id']])

# ── Determinism: repeated calls produce identical results ─────────────────────

if LOADED:
    r1 = bind_get_full_graph(GRAPH)
    r2 = bind_get_full_graph(GRAPH)
    test('L-58: bind_get_full_graph is deterministic', r1 == r2)

    r1 = bind_get_node(GRAPH, 'INTEL-GQ003-001')
    r2 = bind_get_node(GRAPH, 'INTEL-GQ003-001')
    test('L-59: bind_get_node is deterministic', r1 == r2)

    r1 = bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001')
    r2 = bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001')
    test('L-60: bind_get_upstream_view is deterministic', r1 == r2)

    r1 = bind_get_query_view(GRAPH, 'GQ-003')
    r2 = bind_get_query_view(GRAPH, 'GQ-003')
    test('L-61: bind_get_query_view is deterministic', r1 == r2)

# ── Graph immutability ────────────────────────────────────────────────────────

if LOADED:
    original = copy.deepcopy(GRAPH)

    bind_get_full_graph(GRAPH)
    bind_get_node(GRAPH, 'INTEL-GQ003-001')
    bind_get_node(GRAPH, 'EVID-ST007-001')
    bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001')
    bind_get_upstream_view(GRAPH, 'SIG41-SIG003-001')
    bind_get_query_view(GRAPH, 'GQ-003')
    bind_get_query_view(GRAPH, 'GQ-NONEXISTENT')
    apply_persona(bind_get_upstream_view(GRAPH, 'INTEL-GQ003-001'), {})

    test('L-62: graph is not mutated by any binding operation',
         GRAPH == original)

# ── Report ─────────────────────────────────────────────────────────────────

print()
print('ENL-004 Lens Binding Tests — test_lens_binding.py')
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

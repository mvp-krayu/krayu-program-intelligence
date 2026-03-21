#!/usr/bin/env python3
"""
test_enl_query_engine.py
ENL-003-CONTRACT-v1 · run_01_blueedge

Tests for enl_query_engine_v1.py against the minimal graph example:
  docs/pios/enl/examples/ENL-002_minimal_graph_example.json

Test coverage:
  - load_graph: valid file, missing file, invalid JSON
  - validate_graph: valid graph, missing field, bad type, bad transition,
    duplicate node_id, empty derived_from on non-EVID, non-empty on EVID,
    cross-run node, no EVID node
  - get_node: valid, missing
  - get_upstream_chain: from INTEL (full chain), from SIG-41, from EVID,
    invalid start node, correct ordering, terminates_in_evid flag
  - get_downstream_nodes: from EVID, from SIG-40, from INTEL (empty),
    missing source node
  - get_query_subgraph: matching query_id, no-match query_id, returns
    full chain, all 4 nodes present, sorted by node_id

Python 3.9+ standard library only.
"""

import copy
import json
import os
import sys
import tempfile

# Resolve engine path
REPO_ROOT   = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
EXAMPLE_PATH = os.path.join(
    REPO_ROOT, 'docs', 'pios', 'enl', 'examples',
    'ENL-002_minimal_graph_example.json'
)

sys.path.insert(0, os.path.dirname(__file__))
from enl_query_engine_v1 import (
    load_graph, validate_graph,
    get_node, get_upstream_chain,
    get_downstream_nodes, get_query_subgraph,
    ENLLoadError, ENLValidationError,
    ENLNodeNotFoundError, ENLTransitionError, ENLTraversalError,
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

def write_temp_json(data):
    f = tempfile.NamedTemporaryFile(mode='w', suffix='.json',
                                    delete=False, encoding='utf-8')
    json.dump(data, f)
    f.close()
    return f.name

# ── Load the reference graph ─────────────────────────────────────────────────

try:
    GRAPH = load_graph(EXAMPLE_PATH)
    validate_graph(GRAPH)
    LOADED = True
except Exception as e:
    LOADED = False
    LOAD_ERROR = str(e)

test('T-01: minimal graph example loads without error', LOADED,
     LOAD_ERROR if not LOADED else '')

# ── load_graph tests ─────────────────────────────────────────────────────────

ok, detail = assert_raises(ENLLoadError, load_graph, '/nonexistent/path/graph.json')
test('T-02: load_graph raises ENLLoadError for missing file', ok, detail)

tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.json',
                                   delete=False, encoding='utf-8')
tmp.write('{ not valid json')
tmp.close()
ok, detail = assert_raises(ENLLoadError, load_graph, tmp.name)
test('T-03: load_graph raises ENLLoadError for invalid JSON', ok, detail)
os.unlink(tmp.name)

# ── validate_graph — valid ───────────────────────────────────────────────────

if LOADED:
    try:
        result = validate_graph(GRAPH)
        test('T-04: validate_graph returns True for valid graph', result is True)
    except Exception as e:
        test('T-04: validate_graph returns True for valid graph', False, str(e))

# ── validate_graph — missing required field ───────────────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    del bad['nodes'][0]['title']
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-05: validate_graph raises ENLValidationError for missing field', ok, detail)

# ── validate_graph — invalid node_type ───────────────────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    bad['nodes'][0]['node_type'] = 'UNKNOWN_TYPE'
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-06: validate_graph raises ENLValidationError for invalid node_type',
         ok, detail)

# ── validate_graph — invalid status ──────────────────────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    bad['nodes'][0]['status'] = 'pending'
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-07: validate_graph raises ENLValidationError for invalid status',
         ok, detail)

# ── validate_graph — forbidden transition ─────────────────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    # Make INTEL derive directly from EVID (skip SIG-41 and SIG-40)
    intel_node = next(n for n in bad['nodes'] if n['node_type'] == 'INTEL')
    evid_node  = next(n for n in bad['nodes'] if n['node_type'] == 'EVID')
    intel_node['derived_from'] = [evid_node['node_id']]
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-08: validate_graph raises ENLValidationError for forbidden transition '
         '(INTEL→EVID)', ok, detail)

# ── validate_graph — duplicate node_id ───────────────────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    dup = copy.deepcopy(bad['nodes'][0])
    bad['nodes'].append(dup)
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-09: validate_graph raises ENLValidationError for duplicate node_id',
         ok, detail)

# ── validate_graph — non-EVID with empty derived_from ────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    intel_node = next(n for n in bad['nodes'] if n['node_type'] == 'INTEL')
    intel_node['derived_from'] = []
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-10: validate_graph raises ENLValidationError for non-EVID with '
         'empty derived_from', ok, detail)

# ── validate_graph — EVID with non-empty derived_from ────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    evid_node = next(n for n in bad['nodes'] if n['node_type'] == 'EVID')
    evid_node['derived_from'] = ['SOME-OTHER-001']
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-11: validate_graph raises ENLValidationError for EVID with '
         'non-empty derived_from', ok, detail)

# ── validate_graph — unresolvable derived_from reference ──────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    intel_node = next(n for n in bad['nodes'] if n['node_type'] == 'INTEL')
    intel_node['derived_from'] = ['DOES-NOT-EXIST-001']
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-12: validate_graph raises ENLValidationError for unresolvable '
         'derived_from reference', ok, detail)

# ── validate_graph — cross-run node ──────────────────────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    bad['nodes'][1]['run_id'] = 'run_99_other'
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-13: validate_graph raises ENLValidationError for cross-run node',
         ok, detail)

# ── validate_graph — no EVID node ────────────────────────────────────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    bad['nodes'] = [n for n in bad['nodes'] if n['node_type'] != 'EVID']
    ok, detail = assert_raises(ENLValidationError, validate_graph, bad)
    test('T-14: validate_graph raises ENLValidationError when no EVID node '
         'exists', ok, detail)

# ── get_node ─────────────────────────────────────────────────────────────────

if LOADED:
    result = get_node(GRAPH, 'INTEL-GQ003-001')
    test('T-15: get_node returns status ok for valid node_id',
         result['status'] == 'ok')
    test('T-16: get_node returns correct node',
         result['node']['node_id'] == 'INTEL-GQ003-001')
    test('T-17: get_node returns all required fields',
         all(f in result['node'] for f in
             ['node_id', 'node_type', 'run_id', 'title', 'status',
              'derived_from', 'source_ref', 'created_at']))

    ok, detail = assert_raises(ENLNodeNotFoundError, get_node, GRAPH,
                                'DOES-NOT-EXIST')
    test('T-18: get_node raises ENLNodeNotFoundError for missing node_id',
         ok, detail)

# ── get_upstream_chain — from INTEL ──────────────────────────────────────────

if LOADED:
    result = get_upstream_chain(GRAPH, 'INTEL-GQ003-001')

    test('T-19: get_upstream_chain from INTEL returns status complete',
         result['status'] == 'complete')

    test('T-20: get_upstream_chain from INTEL terminates_in_evid is True',
         result['terminates_in_evid'] is True)

    test('T-21: get_upstream_chain from INTEL error is None',
         result['error'] is None)

    test('T-22: get_upstream_chain from INTEL returns exactly 4 nodes',
         len(result['nodes']) == 4,
         f"got {len(result['nodes'])}")

    returned_types = [n['node_type'] for n in result['nodes']]
    test('T-23: get_upstream_chain from INTEL covers all 4 layer types',
         set(returned_types) == {'INTEL', 'SIG-41', 'SIG-40', 'EVID'},
         f"got {returned_types}")

    test('T-24: get_upstream_chain layer_sequence starts with INTEL',
         result['layer_sequence'][0] == 'INTEL',
         f"got {result['layer_sequence']}")

    test('T-25: get_upstream_chain layer_sequence ends with EVID',
         result['layer_sequence'][-1] == 'EVID',
         f"got {result['layer_sequence']}")

    # Verify order: INTEL before SIG-41 before SIG-40 before EVID
    layer_order = {'INTEL': 0, 'SIG-41': 1, 'SIG-40': 2, 'EVID': 3}
    positions = [layer_order[n['node_type']] for n in result['nodes']]
    test('T-26: get_upstream_chain nodes are ordered abstract→concrete',
         positions == sorted(positions),
         f"positions: {positions}")

# ── get_upstream_chain — from SIG-41 ─────────────────────────────────────────

if LOADED:
    result = get_upstream_chain(GRAPH, 'SIG41-SIG003-001')

    test('T-27: get_upstream_chain from SIG-41 returns status complete',
         result['status'] == 'complete')

    test('T-28: get_upstream_chain from SIG-41 terminates_in_evid is True',
         result['terminates_in_evid'] is True)

    test('T-29: get_upstream_chain from SIG-41 returns 3 nodes (SIG-41, SIG-40, EVID)',
         len(result['nodes']) == 3,
         f"got {len(result['nodes'])}")

    test('T-30: get_upstream_chain from SIG-41 does not include INTEL',
         all(n['node_type'] != 'INTEL' for n in result['nodes']))

# ── get_upstream_chain — from EVID ───────────────────────────────────────────

if LOADED:
    result = get_upstream_chain(GRAPH, 'EVID-ST007-001')

    test('T-31: get_upstream_chain from EVID returns status complete',
         result['status'] == 'complete')

    test('T-32: get_upstream_chain from EVID returns exactly 1 node',
         len(result['nodes']) == 1,
         f"got {len(result['nodes'])}")

    test('T-33: get_upstream_chain from EVID terminates_in_evid is True',
         result['terminates_in_evid'] is True)

# ── get_upstream_chain — invalid start ───────────────────────────────────────

if LOADED:
    ok, detail = assert_raises(ENLNodeNotFoundError, get_upstream_chain,
                                GRAPH, 'NONEXISTENT-001')
    test('T-34: get_upstream_chain raises ENLNodeNotFoundError for missing '
         'start node', ok, detail)

# ── get_upstream_chain — forbidden transition raises immediately ──────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    # INTEL skips to EVID — forbidden transition
    intel_node = next(n for n in bad['nodes'] if n['node_type'] == 'INTEL')
    evid_node  = next(n for n in bad['nodes'] if n['node_type'] == 'EVID')
    intel_node['derived_from'] = [evid_node['node_id']]
    # Bypass validate_graph to test engine traversal directly
    node_map = {n['node_id']: n for n in bad['nodes']}
    ok, detail = assert_raises(ENLTransitionError, get_upstream_chain,
                                bad, intel_node['node_id'])
    test('T-35: get_upstream_chain raises ENLTransitionError for forbidden '
         'layer transition', ok, detail)

# ── get_upstream_chain — incomplete chain (unresolvable reference) ────────────

if LOADED:
    bad = copy.deepcopy(GRAPH)
    sig41 = next(n for n in bad['nodes'] if n['node_type'] == 'SIG-41')
    sig41['derived_from'] = ['MISSING-SIG40-001']  # does not exist
    result = get_upstream_chain(bad, 'INTEL-GQ003-001')
    test('T-36: get_upstream_chain returns status incomplete for '
         'unresolvable reference',
         result['status'] == 'incomplete',
         f"got status={result['status']!r}")
    test('T-37: get_upstream_chain terminates_in_evid is False for '
         'incomplete chain',
         result['terminates_in_evid'] is False)
    test('T-38: get_upstream_chain error field is non-empty for '
         'incomplete chain',
         isinstance(result['error'], str) and len(result['error']) > 0,
         f"error={result['error']!r}")

# ── get_downstream_nodes ──────────────────────────────────────────────────────

if LOADED:
    # EVID-ST007-001 is referenced by SIG40-SIG003-001
    result = get_downstream_nodes(GRAPH, 'EVID-ST007-001')
    test('T-39: get_downstream_nodes from EVID returns status ok',
         result['status'] == 'ok')
    test('T-40: get_downstream_nodes from EVID returns 1 downstream node',
         result['count'] == 1,
         f"got {result['count']}")
    test('T-41: get_downstream_nodes from EVID returns SIG40 node',
         result['downstream'][0]['node_type'] == 'SIG-40')

    # SIG40 is referenced by SIG41
    result = get_downstream_nodes(GRAPH, 'SIG40-SIG003-001')
    test('T-42: get_downstream_nodes from SIG-40 returns 1 downstream node',
         result['count'] == 1,
         f"got {result['count']}")
    test('T-43: get_downstream_nodes from SIG-40 returns SIG-41 node',
         result['downstream'][0]['node_type'] == 'SIG-41')

    # INTEL is not referenced by anything
    result = get_downstream_nodes(GRAPH, 'INTEL-GQ003-001')
    test('T-44: get_downstream_nodes from INTEL returns empty list',
         result['count'] == 0 and result['downstream'] == [])

    # downstream list is sorted by node_id
    result = get_downstream_nodes(GRAPH, 'EVID-ST007-001')
    ids = [n['node_id'] for n in result['downstream']]
    test('T-45: get_downstream_nodes result is sorted by node_id',
         ids == sorted(ids))

    # missing source node
    ok, detail = assert_raises(ENLNodeNotFoundError, get_downstream_nodes,
                                GRAPH, 'NONEXISTENT-001')
    test('T-46: get_downstream_nodes raises ENLNodeNotFoundError for missing '
         'source node', ok, detail)

# ── get_query_subgraph ────────────────────────────────────────────────────────

if LOADED:
    # GQ-003 appears in INTEL node's source_ref → expands to full 4-node chain
    result = get_query_subgraph(GRAPH, 'GQ-003')
    test('T-47: get_query_subgraph for GQ-003 returns status ok',
         result['status'] == 'ok',
         f"got {result['status']!r}")
    test('T-48: get_query_subgraph for GQ-003 returns 4 nodes',
         result['count'] == 4,
         f"got {result['count']}")
    returned_types = {n['node_type'] for n in result['nodes']}
    test('T-49: get_query_subgraph for GQ-003 contains all 4 layer types',
         returned_types == {'INTEL', 'SIG-41', 'SIG-40', 'EVID'},
         f"got {returned_types}")
    test('T-50: get_query_subgraph includes INTEL node',
         any(n['node_id'] == 'INTEL-GQ003-001' for n in result['nodes']))
    test('T-51: get_query_subgraph includes EVID node',
         any(n['node_type'] == 'EVID' for n in result['nodes']))

    # Result must be sorted by node_id
    ids = [n['node_id'] for n in result['nodes']]
    test('T-52: get_query_subgraph result is sorted by node_id',
         ids == sorted(ids),
         f"got {ids}")

    # query_id field echoed in output
    test('T-53: get_query_subgraph echoes query_id in output',
         result['query_id'] == 'GQ-003')

    # No match returns empty status
    result_empty = get_query_subgraph(GRAPH, 'GQ-NONEXISTENT')
    test('T-54: get_query_subgraph returns status empty for unknown query_id',
         result_empty['status'] == 'empty',
         f"got {result_empty['status']!r}")
    test('T-55: get_query_subgraph returns empty nodes list for unknown query_id',
         result_empty['nodes'] == [] and result_empty['count'] == 0)

    # Node fields are unchanged — spot-check INTEL node
    intel_result = next(
        (n for n in result['nodes'] if n['node_id'] == 'INTEL-GQ003-001'), None
    )
    intel_original = next(
        (n for n in GRAPH['nodes'] if n['node_id'] == 'INTEL-GQ003-001'), None
    )
    test('T-56: get_query_subgraph returns node fields unchanged',
         intel_result == intel_original)

# ── Determinism: repeated calls return identical results ─────────────────────

if LOADED:
    r1 = get_upstream_chain(GRAPH, 'INTEL-GQ003-001')
    r2 = get_upstream_chain(GRAPH, 'INTEL-GQ003-001')
    test('T-57: get_upstream_chain is deterministic (same result on repeat call)',
         r1 == r2)

    r1 = get_query_subgraph(GRAPH, 'GQ-003')
    r2 = get_query_subgraph(GRAPH, 'GQ-003')
    test('T-58: get_query_subgraph is deterministic (same result on repeat call)',
         r1 == r2)

# ── Graph immutability ───────────────────────────────────────────────────────

if LOADED:
    original = copy.deepcopy(GRAPH)
    _ = get_upstream_chain(GRAPH, 'INTEL-GQ003-001')
    _ = get_query_subgraph(GRAPH, 'GQ-003')
    _ = get_downstream_nodes(GRAPH, 'EVID-ST007-001')
    test('T-59: graph is not mutated by query operations',
         GRAPH == original)

# ── Report ───────────────────────────────────────────────────────────────────

print()
print('ENL-003 Query Engine Tests — test_enl_query_engine.py')
print('=' * 60)
passed = 0
failed = 0
skipped = 0
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

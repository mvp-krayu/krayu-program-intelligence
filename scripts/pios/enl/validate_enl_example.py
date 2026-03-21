#!/usr/bin/env python3
"""
validate_enl_example.py
ENL-002-CONTRACT-v1 · run_01_blueedge

Validates the minimal ENL graph example against v1 rules:
  docs/pios/enl/examples/ENL-002_minimal_graph_example.json

Checks performed:
  - All required fields present on all nodes
  - All node_type values are canonical
  - No duplicate node_ids
  - All layer transitions conform to enl_graph_rules_v1
  - No forbidden transitions
  - EVID is the only node type with empty derived_from
  - All derived_from references resolve to existing nodes
  - All nodes share the same run_id
  - Graph terminates in EVID
  - Full 4-layer chain INTEL → SIG-41 → SIG-40 → EVID is present

Python 3.9+ standard library only.
"""

import json
import os
import sys

REPO_ROOT    = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
EXAMPLE_PATH = os.path.join(REPO_ROOT, 'docs', 'pios', 'enl', 'examples', 'ENL-002_minimal_graph_example.json')
RULES_PATH   = os.path.join(REPO_ROOT, 'docs', 'pios', 'enl', 'schema', 'enl_graph_rules_v1.json')

CANONICAL_TYPES   = ['INTEL', 'SIG-41', 'SIG-40', 'EVID']
REQUIRED_FIELDS   = ['node_id', 'node_type', 'run_id', 'title', 'status', 'derived_from', 'source_ref', 'created_at']
VALID_STATUSES    = ['defined', 'active', 'validated', 'blocked', 'rejected']

ALLOWED_TRANSITIONS = {
    'INTEL':  ['SIG-41'],
    'SIG-41': ['SIG-40'],
    'SIG-40': ['EVID'],
    'EVID':   []
}

results = []

def check(label, passed, detail=''):
    results.append((label, passed, detail))

# ── Load ─────────────────────────────────────────────────────────────────────

try:
    with open(EXAMPLE_PATH, 'r') as f:
        graph = json.load(f)
    check('V-01: example file loads as valid JSON', True)
except Exception as e:
    check('V-01: example file loads as valid JSON', False, str(e))
    # Cannot continue without data
    _print_results(results)
    sys.exit(1)

nodes = graph.get('nodes', [])
node_map = {n['node_id']: n for n in nodes if 'node_id' in n}

# ── Top-level graph fields ───────────────────────────────────────────────────

check('V-02: graph has graph_id',
      bool(graph.get('graph_id')))

check('V-03: graph has run_id',
      bool(graph.get('run_id')))

check('V-04: graph has nodes array',
      isinstance(graph.get('nodes'), list) and len(graph['nodes']) > 0)

# ── Node count ───────────────────────────────────────────────────────────────

check('V-05: graph contains exactly 4 nodes (one per layer)',
      len(nodes) == 4,
      f"got {len(nodes)}")

# ── No duplicate node_ids ────────────────────────────────────────────────────

all_ids = [n.get('node_id') for n in nodes if 'node_id' in n]
check('V-06: no duplicate node_ids',
      len(all_ids) == len(set(all_ids)),
      f"duplicates: {[x for x in all_ids if all_ids.count(x) > 1]}")

# ── Required fields on all nodes ─────────────────────────────────────────────

for node in nodes:
    nid = node.get('node_id', '<unknown>')
    missing = [f for f in REQUIRED_FIELDS if f not in node or node[f] is None]
    check(f'V-07: all required fields present on {nid}',
          len(missing) == 0,
          f"missing: {missing}")
    # Non-empty string checks
    for field in REQUIRED_FIELDS:
        val = node.get(field)
        if field == 'derived_from':
            continue  # allowed to be empty list for EVID
        if val is not None:
            check(f'V-08: {nid}.{field} is non-empty',
                  isinstance(val, str) and len(val.strip()) > 0,
                  f"got: {val!r}")

# ── Canonical node_type values ───────────────────────────────────────────────

for node in nodes:
    nid = node.get('node_id', '<unknown>')
    nt  = node.get('node_type')
    check(f'V-09: {nid} node_type is canonical',
          nt in CANONICAL_TYPES,
          f"got: {nt!r}")

# ── Valid status values ───────────────────────────────────────────────────────

for node in nodes:
    nid = node.get('node_id', '<unknown>')
    st  = node.get('status')
    check(f'V-10: {nid} status is a valid lifecycle state',
          st in VALID_STATUSES,
          f"got: {st!r}")

# ── Run-awareness: all nodes share the same run_id ───────────────────────────

graph_run_id = graph.get('run_id')
for node in nodes:
    nid = node.get('node_id', '<unknown>')
    nri = node.get('run_id')
    check(f'V-11: {nid} run_id matches graph run_id',
          nri == graph_run_id,
          f"node={nri!r} graph={graph_run_id!r}")

# ── derived_from: empty only for EVID ────────────────────────────────────────

for node in nodes:
    nid = node.get('node_id', '<unknown>')
    nt  = node.get('node_type')
    df  = node.get('derived_from', [])
    if nt == 'EVID':
        check(f'V-12: EVID node {nid} has empty derived_from',
              df == [],
              f"got: {df}")
    else:
        check(f'V-13: non-EVID node {nid} has non-empty derived_from',
              isinstance(df, list) and len(df) > 0,
              f"got: {df}")

# ── derived_from references resolve to existing nodes ────────────────────────

for node in nodes:
    nid = node.get('node_id', '<unknown>')
    df  = node.get('derived_from', [])
    for ref in df:
        check(f'V-14: {nid} derived_from ref {ref!r} resolves',
              ref in node_map,
              f"ref not found in graph")

# ── Layer transitions are permitted ─────────────────────────────────────────

for node in nodes:
    nid = node.get('node_id', '<unknown>')
    nt  = node.get('node_type')
    df  = node.get('derived_from', [])
    allowed_upstream = ALLOWED_TRANSITIONS.get(nt, [])
    for ref in df:
        upstream_node = node_map.get(ref)
        if upstream_node:
            upstream_type = upstream_node.get('node_type')
            check(f'V-15: {nid}({nt}) → {ref}({upstream_type}) transition is permitted',
                  upstream_type in allowed_upstream,
                  f"{nt} may not derive from {upstream_type}")

# ── run_id consistency across linked nodes ───────────────────────────────────

for node in nodes:
    nid = node.get('node_id', '<unknown>')
    nri = node.get('run_id')
    df  = node.get('derived_from', [])
    for ref in df:
        upstream = node_map.get(ref)
        if upstream:
            uri = upstream.get('run_id')
            check(f'V-16: {nid} and upstream {ref} share same run_id',
                  nri == uri,
                  f"node={nri!r} upstream={uri!r}")

# ── All 4 layer types present ────────────────────────────────────────────────

present_types = set(n.get('node_type') for n in nodes)
for t in CANONICAL_TYPES:
    check(f'V-17: graph contains at least one {t} node',
          t in present_types)

# ── Graph terminates in EVID ─────────────────────────────────────────────────

evid_nodes = [n for n in nodes if n.get('node_type') == 'EVID']
check('V-18: graph contains at least one EVID node (evidence termination satisfied)',
      len(evid_nodes) > 0)

# ── Full chain traversal INTEL → SIG-41 → SIG-40 → EVID ─────────────────────

intel_nodes = [n for n in nodes if n.get('node_type') == 'INTEL']
chain_valid = False
chain_path  = []

for intel in intel_nodes:
    # Attempt to trace a full chain from this INTEL node
    visited = set()
    path = [intel['node_id']]
    current = intel
    ok = True

    expected_sequence = ['INTEL', 'SIG-41', 'SIG-40', 'EVID']
    pos = 0

    while current is not None and pos < len(expected_sequence):
        ct = current.get('node_type')
        if ct != expected_sequence[pos]:
            ok = False
            break
        if ct == 'EVID':
            # Terminal — chain complete
            chain_valid = True
            chain_path = path[:]
            break
        # Follow first derived_from reference
        df = current.get('derived_from', [])
        if not df:
            ok = False
            break
        next_id = df[0]
        if next_id in visited:
            ok = False
            break
        visited.add(next_id)
        current = node_map.get(next_id)
        if current:
            path.append(current['node_id'])
        pos += 1

check('V-19: full 4-layer chain INTEL→SIG-41→SIG-40→EVID is traversable',
      chain_valid,
      f"chain: {' → '.join(chain_path) if chain_path else 'not found'}")

# ── source_ref non-empty on all nodes ────────────────────────────────────────

for node in nodes:
    nid = node.get('node_id', '<unknown>')
    sr  = node.get('source_ref', '')
    check(f'V-20: {nid} source_ref is non-empty',
          isinstance(sr, str) and len(sr.strip()) > 0,
          f"got: {sr!r}")

# ── Report ───────────────────────────────────────────────────────────────────

print()
print('ENL-002 Example Validation — validate_enl_example.py')
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

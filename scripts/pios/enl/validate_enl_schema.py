#!/usr/bin/env python3
"""
validate_enl_schema.py
ENL-002-CONTRACT-v1 · run_01_blueedge

Validates presence and structural integrity of ENL schema files:
  - docs/pios/enl/schema/enl_node_schema_v1.json
  - docs/pios/enl/schema/enl_graph_rules_v1.json

All checks are against the ENL-002-CONTRACT-v1 specification.
Python 3.9+ standard library only.
"""

import json
import os
import sys

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

NODE_SCHEMA_PATH  = os.path.join(REPO_ROOT, 'docs', 'pios', 'enl', 'schema', 'enl_node_schema_v1.json')
GRAPH_RULES_PATH  = os.path.join(REPO_ROOT, 'docs', 'pios', 'enl', 'schema', 'enl_graph_rules_v1.json')
ENL_001_PATH      = os.path.join(REPO_ROOT, 'docs', 'pios', 'enl', 'ENL-001_evidence_navigation_system.md')
ENL_002_PATH      = os.path.join(REPO_ROOT, 'docs', 'pios', 'enl', 'ENL-002_evidence_graph_schema.md')

EXPECTED_SCHEMA_ID_NODE  = 'enl_node_schema_v1'
EXPECTED_SCHEMA_ID_RULES = 'enl_graph_rules_v1'
EXPECTED_CONTRACT_REF    = 'ENL-002-CONTRACT-v1'
EXPECTED_VERSION         = '1.0.0'
EXPECTED_NODE_TYPES      = ['INTEL', 'SIG-41', 'SIG-40', 'EVID']
EXPECTED_STATUS_VALUES   = ['defined', 'active', 'validated', 'blocked', 'rejected']

REQUIRED_NODE_FIELDS = [
    'node_id', 'node_type', 'run_id', 'title',
    'status', 'derived_from', 'source_ref', 'created_at'
]

EXPECTED_ALLOWED_TRANSITIONS = {
    'INTEL':  ['SIG-41'],
    'SIG-41': ['SIG-40'],
    'SIG-40': ['EVID'],
    'EVID':   []
}

EXPECTED_TERMINAL_TYPES = ['EVID']
EXPECTED_EMPTY_DF_TYPES = ['EVID']

results = []

def check(label, passed, detail=''):
    results.append((label, passed, detail))

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

# ── File presence ────────────────────────────────────────────────────────────

check('S-01: enl_node_schema_v1.json exists',
      os.path.isfile(NODE_SCHEMA_PATH))

check('S-02: enl_graph_rules_v1.json exists',
      os.path.isfile(GRAPH_RULES_PATH))

check('S-03: ENL-001 concept document exists',
      os.path.isfile(ENL_001_PATH))

check('S-04: ENL-002 schema standard document exists',
      os.path.isfile(ENL_002_PATH))

# ── Node schema structure ────────────────────────────────────────────────────

try:
    ns = load_json(NODE_SCHEMA_PATH)

    check('S-05: node schema has schema_id field',
          'schema_id' in ns)

    check('S-06: node schema schema_id matches expected',
          ns.get('schema_id') == EXPECTED_SCHEMA_ID_NODE,
          f"got: {ns.get('schema_id')!r}")

    check('S-07: node schema has version field',
          'version' in ns)

    check('S-08: node schema version is 1.0.0',
          ns.get('version') == EXPECTED_VERSION,
          f"got: {ns.get('version')!r}")

    check('S-09: node schema has contract_ref field',
          'contract_ref' in ns)

    check('S-10: node schema contract_ref matches ENL-002-CONTRACT-v1',
          ns.get('contract_ref') == EXPECTED_CONTRACT_REF,
          f"got: {ns.get('contract_ref')!r}")

    check('S-11: node schema declares node_types array',
          'node_types' in ns and isinstance(ns['node_types'], list))

    check('S-12: node schema node_types are exactly INTEL SIG-41 SIG-40 EVID',
          set(ns.get('node_types', [])) == set(EXPECTED_NODE_TYPES),
          f"got: {ns.get('node_types')}")

    check('S-13: node schema has required_fields section',
          'required_fields' in ns and isinstance(ns['required_fields'], dict))

    rf = ns.get('required_fields', {})
    missing_fields = [f for f in REQUIRED_NODE_FIELDS if f not in rf]
    check('S-14: all 8 required fields declared in required_fields',
          len(missing_fields) == 0,
          f"missing: {missing_fields}")

    check('S-15: derived_from constraints include empty-only-for-EVID rule',
          'derived_from' in rf and
          any('EVID' in str(c) for c in rf.get('derived_from', {}).get('constraints', [])))

    check('S-16: status_values section declares all 5 lifecycle states',
          'status_values' in ns and
          set(ns.get('status_values', {}).keys()) == set(EXPECTED_STATUS_VALUES),
          f"got: {list(ns.get('status_values', {}).keys())}")

    check('S-17: node_type_layer_mapping covers all 4 types',
          'node_type_layer_mapping' in ns and
          set(ns['node_type_layer_mapping'].keys()) == set(EXPECTED_NODE_TYPES))

    check('S-18: v1_constraints section present and non-empty',
          'v1_constraints' in ns and len(ns.get('v1_constraints', [])) > 0)

except Exception as e:
    for i in range(5, 19):
        check(f'S-{i:02d}: node schema parse/check', False, str(e))

# ── Graph rules structure ────────────────────────────────────────────────────

try:
    gr = load_json(GRAPH_RULES_PATH)

    check('S-19: graph rules has schema_id field',
          'schema_id' in gr)

    check('S-20: graph rules schema_id matches expected',
          gr.get('schema_id') == EXPECTED_SCHEMA_ID_RULES,
          f"got: {gr.get('schema_id')!r}")

    check('S-21: graph rules contract_ref matches ENL-002-CONTRACT-v1',
          gr.get('contract_ref') == EXPECTED_CONTRACT_REF,
          f"got: {gr.get('contract_ref')!r}")

    check('S-22: graph rules has allowed_transitions section',
          'allowed_transitions' in gr and 'rules' in gr['allowed_transitions'])

    at = gr.get('allowed_transitions', {}).get('rules', {})
    transitions_correct = (at == EXPECTED_ALLOWED_TRANSITIONS)
    check('S-23: allowed_transitions match INTEL→SIG-41→SIG-40→EVID→[]',
          transitions_correct,
          f"got: {at}")

    check('S-24: graph rules has forbidden_transitions list',
          'forbidden_transitions' in gr and isinstance(gr['forbidden_transitions'], list))

    ft = gr.get('forbidden_transitions', [])
    has_cross_layer = any(
        e.get('from') == 'INTEL' and e.get('to') == 'SIG-40' for e in ft
    )
    check('S-25: forbidden_transitions includes INTEL→SIG-40 cross-layer shortcut',
          has_cross_layer)

    has_same_layer = any(
        e.get('from') == e.get('to') for e in ft
    )
    check('S-26: forbidden_transitions includes same-layer derivation entries',
          has_same_layer)

    check('S-27: terminal_node_policy declares EVID as terminal',
          'terminal_node_policy' in gr and
          gr['terminal_node_policy'].get('terminal_node_types') == EXPECTED_TERMINAL_TYPES)

    check('S-28: empty_derived_from_policy restricts empty derived_from to EVID',
          'empty_derived_from_policy' in gr and
          gr['empty_derived_from_policy'].get('permitted_types') == EXPECTED_EMPTY_DF_TYPES)

    check('S-29: run_awareness section present and declares cross-run NOT PERMITTED',
          'run_awareness' in gr and
          'NOT PERMITTED' in gr['run_awareness'].get('cross_run_linking', ''))

    check('S-30: fail_conditions list present and non-empty',
          'fail_conditions' in gr and len(gr.get('fail_conditions', [])) > 0)

    check('S-31: v1_scope_boundaries section present',
          'v1_scope_boundaries' in gr and
          'not_supported' in gr['v1_scope_boundaries'])

except Exception as e:
    for i in range(19, 32):
        check(f'S-{i:02d}: graph rules parse/check', False, str(e))

# ── Cross-file consistency ───────────────────────────────────────────────────

try:
    ns2 = load_json(NODE_SCHEMA_PATH)
    gr2 = load_json(GRAPH_RULES_PATH)

    ns_types = set(ns2.get('node_types', []))
    gr_types = set(gr2.get('allowed_transitions', {}).get('rules', {}).keys())

    check('S-32: node_types in node schema match transition keys in graph rules',
          ns_types == gr_types,
          f"node_schema={ns_types} graph_rules={gr_types}")

    ns_contract = ns2.get('contract_ref')
    gr_contract = gr2.get('contract_ref')
    check('S-33: both schema files share the same contract_ref',
          ns_contract == gr_contract == EXPECTED_CONTRACT_REF,
          f"node={ns_contract!r} rules={gr_contract!r}")

except Exception as e:
    check('S-32: cross-file consistency node_types', False, str(e))
    check('S-33: cross-file consistency contract_ref', False, str(e))

# ── Report ───────────────────────────────────────────────────────────────────

print()
print('ENL-002 Schema Validation — validate_enl_schema.py')
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

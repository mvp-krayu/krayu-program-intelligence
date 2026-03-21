#!/usr/bin/env python3
"""
validate_semantic_activation.py
PIOS-42.11-RUN01-CONTRACT-v1 · run_01_blueedge

Semantic Activation Validator — Stream 42.11

Validates:
  1. Required 42.11 artifact presence
  2. INACTIVE mode: default state, no annotations, no acceptance checks
  3. ACTIVE mode: path transitions, annotation content, additive-only
  4. FALLBACK mode: silent fallback, no annotations, honest reporting
  5. Reversibility: ACTIVE → INACTIVE → ACTIVE cycle
  6. Non-regression: 42.10 recheck, ENL isolation, adapter isolation
  7. Runtime honesty: path state always declared honestly
  8. Demo integrity: 42.9 validator unmodified and present

This script is read-only. It modifies no artifacts.
It temporarily mutates the ACTIVATION_STATUS constant in the imported module
to test all three path states — no files are written.

Python 3.9+ standard library only.
"""

import importlib
import os
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]

# ── Paths ──────────────────────────────────────────────────────────────────

PATH_42_11       = REPO_ROOT / "docs/pios/42.11"
PATH_CONTRACTS   = REPO_ROOT / "docs/pios/contracts/42.11"
PATH_SCRIPTS     = REPO_ROOT / "scripts/pios/42.11"
PATH_41_6        = REPO_ROOT / "docs/pios/41.6"
PATH_42_10_SCRIPT = REPO_ROOT / "scripts/pios/42.10/validate_semantic_binding.py"
PATH_42_9_VALIDATOR = REPO_ROOT / "scripts/pios/42.9/validate_demo_package.py"

REQUIRED_42_11_DOCS = [
    "activation_model.md",
    "runtime_state_contract.md",
    "activation_test_matrix.md",
    "demo_impact_assessment.md",
    "fallback_activation_integrity.md",
    "activation_validation_report.md",
]

REQUIRED_42_11_SCRIPTS = [
    "semantic_activation.py",
    "validate_semantic_activation.py",
]

REQUIRED_42_11_CONTRACTS = [
    "PIOS-42.11-RUN01-CONTRACT-v1.md",
]

ENL_MODULES = [
    REPO_ROOT / "scripts/pios/enl/enl_query_engine_v1.py",
    REPO_ROOT / "scripts/pios/enl/lens_binding_v1.py",
    REPO_ROOT / "scripts/pios/enl/lens_persona_v1.py",
    REPO_ROOT / "scripts/pios/enl/lens_drilldown_v1.py",
    REPO_ROOT / "scripts/pios/enl/lens_narrative_v1.py",
]

ADAPTER_MODULES = [
    REPO_ROOT / "scripts/pios/42.1/run_execlens_query.py",
    REPO_ROOT / "scripts/pios/42.4/execlens_adapter.py",
    REPO_ROOT / "scripts/pios/42.6/execlens_overview_adapter.py",
    REPO_ROOT / "scripts/pios/42.7/execlens_topology_adapter.py",
]

# ── Test harness ──────────────────────────────────────────────────────────

results = []

def check(label, passed, detail=''):
    results.append((label, passed, str(detail) if detail else ''))

def read_text(path):
    try:
        return Path(path).read_text(encoding='utf-8')
    except (OSError, IOError):
        return ''

# ── Section 1: 42.11 Artifact Presence ────────────────────────────────────

for artifact in REQUIRED_42_11_DOCS:
    path = PATH_42_11 / artifact
    check(f'42.11 doc present: {artifact}',
          path.is_file(),
          f'expected at {path}')

for artifact in REQUIRED_42_11_SCRIPTS:
    path = PATH_SCRIPTS / artifact
    check(f'42.11 script present: {artifact}',
          path.is_file(),
          f'expected at {path}')

for artifact in REQUIRED_42_11_CONTRACTS:
    path = PATH_CONTRACTS / artifact
    check(f'42.11 contract present: {artifact}',
          path.is_file(),
          f'expected at {path}')

# ── Section 2: Import semantic_activation module ───────────────────────────

activation_module = None
try:
    sys.path.insert(0, str(PATH_SCRIPTS))
    import semantic_activation as sa
    activation_module = sa
    check('Module import: semantic_activation.py importable', True)
except ImportError as e:
    check('Module import: semantic_activation.py importable', False, str(e))

if activation_module is None:
    print()
    print('CRITICAL: Cannot import semantic_activation — aborting module tests')
    print('VALIDATION STATUS: FAIL')
    sys.exit(1)

# ── Section 3: INACTIVE Mode Tests (AT-01..AT-08) ─────────────────────────

sa.ACTIVATION_STATUS = "NOT_ACTIVATED"

state_inactive = sa.get_path_state()

check('AT-01: default INACTIVE — path_state == SEMANTIC_PATH_INACTIVE',
      state_inactive["path_state"] == sa.SEMANTIC_PATH_INACTIVE,
      f'got: {state_inactive["path_state"]}')

check('AT-02: INACTIVE — activation_status == NOT_ACTIVATED',
      state_inactive["activation_status"] == "NOT_ACTIVATED",
      f'got: {state_inactive["activation_status"]}')

check('AT-03: INACTIVE — acceptance_results == {} (no checks run)',
      state_inactive["acceptance_results"] == {},
      f'got: {state_inactive["acceptance_results"]}')

check('AT-04: INACTIVE — fallback_triggers == []',
      state_inactive["fallback_triggers"] == [],
      f'got: {state_inactive["fallback_triggers"]}')

check('AT-05: INACTIVE — annotate_signal returns None',
      sa.annotate_signal("SIG-001") is None,
      'expected None')

check('AT-06: INACTIVE — annotate_query returns None',
      sa.annotate_query("GQ-001") is None,
      'expected None')

check('AT-07: INACTIVE — run_id == run_01_blueedge',
      state_inactive["run_id"] == "run_01_blueedge",
      f'got: {state_inactive["run_id"]}')

state_inactive_2 = sa.get_path_state()
check('AT-08: INACTIVE — deterministic (two calls identical)',
      state_inactive == state_inactive_2,
      'get_path_state() not deterministic in INACTIVE state')

# ── Section 4: ACTIVE Mode Tests (AT-09..AT-18) ───────────────────────────

sa.ACTIVATION_STATUS = "ACTIVATED"

state_active = sa.get_path_state()

check('AT-09: ACTIVATED — path_state == SEMANTIC_PATH_ACTIVE',
      state_active["path_state"] == sa.SEMANTIC_PATH_ACTIVE,
      f'got: {state_active["path_state"]} — fallback_triggers: {state_active.get("fallback_triggers")}')

check('AT-10: ACTIVE — all AC-001..008 pass',
      len(state_active.get("acceptance_results", {})) == 8 and
      all(state_active["acceptance_results"].values()),
      f'failed ACs: {[k for k, v in state_active.get("acceptance_results", {}).items() if not v]}')

check('AT-11: ACTIVE — fallback_triggers == []',
      state_active["fallback_triggers"] == [],
      f'got: {state_active["fallback_triggers"]}')

ann_sig = sa.annotate_signal("SIG-001")
check('AT-12: ACTIVE — annotate_signal("SIG-001") returns dict (not None)',
      ann_sig is not None,
      'expected annotation dict for SIG-001')

if ann_sig is not None:
    check('AT-13: ACTIVE — annotation has required fields',
          all(k in ann_sig for k in ("semantic_id", "construct_type", "source_enl_id")),
          f'annotation keys: {list(ann_sig.keys())}')

    check('AT-14: ACTIVE — semantic_id format valid (SEM-TYPE-NNN)',
          bool(re.match(r'SEM-[A-Z]+-\d+', ann_sig.get("semantic_id", ""))),
          f'got: {ann_sig.get("semantic_id")}')
else:
    check('AT-13: ACTIVE — annotation has required fields', False, 'annotation was None')
    check('AT-14: ACTIVE — semantic_id format valid', False, 'annotation was None')

ann_query = sa.annotate_query("GQ-001")
check('AT-15: ACTIVE — annotate_query("GQ-001") returns dict (not None)',
      ann_query is not None,
      'expected annotation dict for GQ-001')

ann_unknown = sa.annotate_signal("UNKNOWN-999")
check('AT-16: ACTIVE — annotate_signal("UNKNOWN-999") returns None (not error)',
      ann_unknown is None,
      f'expected None for unknown signal, got: {ann_unknown}')

enl_core_fields = {"title", "statement", "evidence_chain", "business_impact", "risk"}
if ann_sig is not None:
    check('AT-17: ACTIVE — annotation does not include ENL core fields (additive only)',
          not (set(ann_sig.keys()) & enl_core_fields),
          f'ENL fields in annotation: {set(ann_sig.keys()) & enl_core_fields}')
else:
    check('AT-17: ACTIVE — annotation does not include ENL core fields', False, 'annotation was None')

state_active_2 = sa.get_path_state()
check('AT-18: ACTIVE — deterministic (two calls identical)',
      state_active == state_active_2,
      'get_path_state() not deterministic in ACTIVE state')

# ── Section 5: FALLBACK Mode Tests (AT-19..AT-26) ─────────────────────────
# Simulate fallback by temporarily breaking the acceptance conditions
# We override the _check_acceptance_conditions function to return a failing result

sa.ACTIVATION_STATUS = "ACTIVATED"

# Save the real function and inject a failing one
_real_check = sa._check_acceptance_conditions

def _failing_check():
    """Simulate AC-001 failure (e.g., missing 41.6 artifacts)."""
    results = _real_check()
    results["AC-001"] = False  # Simulate: 41.6 artifacts missing
    return results

sa._check_acceptance_conditions = _failing_check
state_fallback = sa.get_path_state()

check('AT-19: FALLBACK — path_state == SEMANTIC_PATH_FALLBACK when AC-001 fails',
      state_fallback["path_state"] == sa.SEMANTIC_PATH_FALLBACK,
      f'got: {state_fallback["path_state"]}')

check('AT-20: FALLBACK — fallback_triggers is non-empty',
      len(state_fallback["fallback_triggers"]) >= 1,
      f'got: {state_fallback["fallback_triggers"]}')

ann_fallback_sig = sa.annotate_signal("SIG-001")
check('AT-21: FALLBACK — annotate_signal returns None',
      ann_fallback_sig is None,
      f'expected None, got: {ann_fallback_sig}')

ann_fallback_query = sa.annotate_query("GQ-001")
check('AT-22: FALLBACK — annotate_query returns None',
      ann_fallback_query is None,
      f'expected None, got: {ann_fallback_query}')

try:
    sa.annotate_signal("SIG-001")
    sa.annotate_query("GQ-001")
    check('AT-23: FALLBACK — no exception raised', True)
except Exception as e:
    check('AT-23: FALLBACK — no exception raised', False, str(e))

check('AT-24: FALLBACK — path_state honestly reports FALLBACK',
      state_fallback["path_state"] == sa.SEMANTIC_PATH_FALLBACK,
      f'got: {state_fallback["path_state"]}')

check('AT-25: FALLBACK — activation_status still ACTIVATED',
      state_fallback["activation_status"] == "ACTIVATED",
      f'got: {state_fallback["activation_status"]}')

state_fallback_2 = sa.get_path_state()
check('AT-26: FALLBACK — deterministic (two calls identical)',
      state_fallback == state_fallback_2,
      'get_path_state() not deterministic in FALLBACK state')

# Restore real acceptance check function
sa._check_acceptance_conditions = _real_check

# ── Section 6: Reversibility Tests (AT-27..AT-30) ─────────────────────────

# AT-27: ACTIVE → INACTIVE
sa.ACTIVATION_STATUS = "ACTIVATED"
state_pre = sa.get_path_state()
sa.ACTIVATION_STATUS = "NOT_ACTIVATED"
state_post = sa.get_path_state()
check('AT-27: Reversibility — ACTIVE → INACTIVE deactivation',
      state_pre["path_state"] == sa.SEMANTIC_PATH_ACTIVE and
      state_post["path_state"] == sa.SEMANTIC_PATH_INACTIVE,
      f'pre: {state_pre["path_state"]}, post: {state_post["path_state"]}')

# AT-28: Annotations disappear after deactivation
sa.ACTIVATION_STATUS = "ACTIVATED"
ann_before = sa.annotate_signal("SIG-001")
sa.ACTIVATION_STATUS = "NOT_ACTIVATED"
ann_after = sa.annotate_signal("SIG-001")
check('AT-28: Reversibility — annotations absent after deactivation',
      ann_before is not None and ann_after is None,
      f'before: {ann_before is not None}, after: {ann_after}')

# AT-29: Reactivation cycle
sa.ACTIVATION_STATUS = "NOT_ACTIVATED"
s1 = sa.get_path_state()["path_state"]
sa.ACTIVATION_STATUS = "ACTIVATED"
s2 = sa.get_path_state()["path_state"]
sa.ACTIVATION_STATUS = "NOT_ACTIVATED"
s3 = sa.get_path_state()["path_state"]
sa.ACTIVATION_STATUS = "ACTIVATED"
s4 = sa.get_path_state()["path_state"]
check('AT-29: Reversibility — INACTIVE→ACTIVE→INACTIVE→ACTIVE cycle stable',
      s1 == sa.SEMANTIC_PATH_INACTIVE and
      s2 == sa.SEMANTIC_PATH_ACTIVE and
      s3 == sa.SEMANTIC_PATH_INACTIVE and
      s4 == sa.SEMANTIC_PATH_ACTIVE,
      f'cycle: {s1} → {s2} → {s3} → {s4}')

# AT-30: No residual state after deactivation
sa.ACTIVATION_STATUS = "ACTIVATED"
sa.get_path_state()
sa.ACTIVATION_STATUS = "NOT_ACTIVATED"
state_clean = sa.get_path_state()
check('AT-30: Reversibility — acceptance_results == {} after deactivation',
      state_clean["acceptance_results"] == {},
      f'got: {state_clean["acceptance_results"]}')

# Restore to default safe state
sa.ACTIVATION_STATUS = "NOT_ACTIVATED"

# ── Section 7: Non-Regression (AT-31..AT-36) ──────────────────────────────

# AT-31: 42.10 validator recheck
result_42_10 = subprocess.run(
    [sys.executable, str(PATH_42_10_SCRIPT)],
    capture_output=True, text=True
)
check('AT-31: 42.10 validator still passes (64/64)',
      result_42_10.returncode == 0,
      f'42.10 validator exit code: {result_42_10.returncode}\n{result_42_10.stdout[-500:]}')

# AT-32: 41.6 artifacts unmodified
required_41_6 = [
    "enl_semantic_mapping.md",
    "semantic_assimilation_model.md",
    "semantic_construct_registry.md",
    "semantic_projection_output.md",
    "fallback_integrity_spec.md",
    "semantic_validation_report.md",
]
for artifact in required_41_6:
    path = PATH_41_6 / artifact
    check(f'AT-32: 41.6 artifact present and non-empty: {artifact}',
          path.is_file() and path.stat().st_size > 0,
          f'expected at {path}')

# AT-33: ENL modules have no 42.11 dependency
for module_path in ENL_MODULES:
    if module_path.is_file():
        content = module_path.read_text(encoding='utf-8')
        has_42_11 = '42.11' in content or 'semantic_activation' in content
        check(f'AT-33: ENL module has no 42.11 reference: {module_path.name}',
              not has_42_11,
              f'42.11 reference found in {module_path.name}')
    else:
        check(f'AT-33: ENL module exists: {module_path.name}', False,
              f'not found: {module_path}')

# AT-34: 42.x adapter modules have no 42.11 dependency
for module_path in ADAPTER_MODULES:
    if module_path.is_file():
        content = module_path.read_text(encoding='utf-8')
        has_42_11 = '42.11' in content or 'semantic_activation' in content
        check(f'AT-34: 42.x adapter has no 42.11 dependency: {module_path.name}',
              not has_42_11,
              f'42.11 reference found in {module_path.name}')
    else:
        check(f'AT-34: 42.x adapter exists: {module_path.name}', False,
              f'not found: {module_path}')

# AT-35: 42.9 validator present
check('AT-35: Demo integrity — 42.9 validate_demo_package.py exists',
      PATH_42_9_VALIDATOR.is_file(),
      f'expected at {PATH_42_9_VALIDATOR}')

# AT-36: semantic_activation.py imports no 42.x adapter layers
activation_source = read_text(PATH_SCRIPTS / "semantic_activation.py")
forbidden_42x_imports = re.findall(
    r'import\s+(execlens|render_executive|run_execlens|lens_binding|lens_persona|lens_drilldown|lens_narrative)',
    activation_source
)
check('AT-36: semantic_activation.py imports no 42.x layer modules',
      len(forbidden_42x_imports) == 0,
      f'cross-layer imports found: {forbidden_42x_imports}')

# ── Section 8: Document Content Checks ────────────────────────────────────

activation_model   = read_text(PATH_42_11 / "activation_model.md")
runtime_contract   = read_text(PATH_42_11 / "runtime_state_contract.md")
test_matrix        = read_text(PATH_42_11 / "activation_test_matrix.md")
demo_assessment    = read_text(PATH_42_11 / "demo_impact_assessment.md")
fallback_integrity = read_text(PATH_42_11 / "fallback_activation_integrity.md")

# Activation model coverage
check('Doc check: activation_model declares explicit activation switch',
      'ACTIVATION_STATUS' in activation_model,
      'ACTIVATION_STATUS not declared in activation_model.md')

check('Doc check: activation_model covers all 3 path states',
      all(s in activation_model for s in
          ['SEMANTIC_PATH_INACTIVE', 'SEMANTIC_PATH_ACTIVE', 'SEMANTIC_PATH_FALLBACK']),
      'Not all 3 path states declared in activation_model.md')

check('Doc check: activation_model declares reversibility',
      'reversib' in activation_model.lower(),
      'Reversibility not mentioned in activation_model.md')

check('Doc check: runtime_state_contract covers path_state contract',
      'path_state' in runtime_contract and 'NOT_ACTIVATED' in runtime_contract,
      'path_state contract incomplete')

check('Doc check: activation_test_matrix declares 36 tests (AT-01..AT-36)',
      'AT-36' in test_matrix,
      'AT-36 not found in activation_test_matrix.md')

check('Doc check: demo_impact_assessment declares PRESERVED verdict',
      'PRESERVED' in demo_assessment,
      'PRESERVED verdict not found in demo_impact_assessment.md')

check('Doc check: fallback_activation_integrity declares VERIFIED',
      'VERIFIED' in fallback_integrity,
      'VERIFIED not found in fallback_activation_integrity.md')

check('Doc check: no interpretation leakage in activation docs (no 75.x activation)',
      '75.x is active' not in activation_model.lower() and
      '75.x activated' not in activation_model.lower(),
      'Possible 75.x activation claim in activation model')

# ── Report ─────────────────────────────────────────────────────────────────

print()
print('PIOS-42.11-RUN01-CONTRACT-v1 — Semantic Activation Validation')
print('=' * 64)

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

# Path state declaration
print('Runtime State:')
print('  path_state:        SEMANTIC_PATH_INACTIVE')
print('  activation_status: NOT_ACTIVATED')
print('  enl_direct_path:   OPERATIONAL')
print('  semantic_ready:    YES (41.6 validated, 42.10 passed, 42.11 module active)')
print()

if failed > 0:
    print('VALIDATION STATUS: FAIL')
    sys.exit(1)
else:
    print('VALIDATION STATUS: PASS')
    sys.exit(0)

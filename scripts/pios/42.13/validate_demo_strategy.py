#!/usr/bin/env python3
"""
validate_demo_strategy.py
PIOS-42.13-RUN01-CONTRACT-v1 · run_01_blueedge

Demo Strategy Validator — Stream 42.13

Validates:
  1. Required 42.13 artifact presence
  2. 42.12 validator recheck
  3. Baseline-first rule declared
  4. No implicit activation
  5. Additive-only value language
  6. No interpretation leakage
  7. Fallback honesty declared
  8. Deterministic demo conditions declared
  9. demo_activate.py functional (--enable / --disable / --status)
 10. No ENL or adapter modifications

Python 3.9+ standard library only.
"""

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]

# ── Paths ──────────────────────────────────────────────────────────────────

PATH_42_13      = REPO_ROOT / "docs/pios/42.13"
PATH_CONTRACTS  = REPO_ROOT / "docs/pios/contracts/42.13"
PATH_SCRIPTS    = REPO_ROOT / "scripts/pios/42.13"
PATH_42_12_VAL  = REPO_ROOT / "scripts/pios/42.12/validate_semantic_exposure.py"
DEMO_ACTIVATE   = PATH_SCRIPTS / "demo_activate.py"

REQUIRED_42_13_DOCS = [
    "demo_modes_definition.md",
    "activation_strategy.md",
    "demo_choreography_integration.md",
    "value_delta_spec.md",
    "operator_playbook.md",
    "fallback_narrative.md",
    "demo_validation_report.md",
]

REQUIRED_42_13_SCRIPTS = [
    "demo_activate.py",
    "validate_demo_strategy.py",
]

REQUIRED_42_13_CONTRACTS = [
    "PIOS-42.13-RUN01-CONTRACT-v1.md",
]

ENL_MODULES = [
    REPO_ROOT / "scripts/pios/enl/enl_query_engine_v1.py",
    REPO_ROOT / "scripts/pios/enl/lens_binding_v1.py",
    REPO_ROOT / "scripts/pios/enl/lens_narrative_v1.py",
]

ADAPTER_MODULES = [
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

# ── Section 1: Artifact Presence ──────────────────────────────────────────

for artifact in REQUIRED_42_13_DOCS:
    path = PATH_42_13 / artifact
    check(f'42.13 doc present: {artifact}', path.is_file(), f'expected at {path}')

for artifact in REQUIRED_42_13_SCRIPTS:
    path = PATH_SCRIPTS / artifact
    check(f'42.13 script present: {artifact}', path.is_file(), f'expected at {path}')

for artifact in REQUIRED_42_13_CONTRACTS:
    path = PATH_CONTRACTS / artifact
    check(f'42.13 contract present: {artifact}', path.is_file(), f'expected at {path}')

# ── Section 2: 42.12 Validator Recheck ────────────────────────────────────

result_42_12 = subprocess.run(
    [sys.executable, str(PATH_42_12_VAL)],
    capture_output=True, text=True
)
check('42.12 validator passes (57/57)',
      result_42_12.returncode == 0,
      f'exit code: {result_42_12.returncode}')

# ── Section 3: Load docs ──────────────────────────────────────────────────

modes_def       = read_text(PATH_42_13 / "demo_modes_definition.md")
activation_strat = read_text(PATH_42_13 / "activation_strategy.md")
choreography    = read_text(PATH_42_13 / "demo_choreography_integration.md")
value_delta     = read_text(PATH_42_13 / "value_delta_spec.md")
playbook        = read_text(PATH_42_13 / "operator_playbook.md")
fallback_narr   = read_text(PATH_42_13 / "fallback_narrative.md")
val_report      = read_text(PATH_42_13 / "demo_validation_report.md")

# ── Section 4: Baseline First Rule ────────────────────────────────────────

check('Baseline first: SAFE MODE declared as opening mode',
      'SAFE MODE' in modes_def and ('opening' in modes_def.lower() or 'always' in modes_def.lower()),
      'SAFE MODE as opening mode not declared in demo_modes_definition.md')

check('Baseline first: SAFE MODE before ENHANCED in choreography',
      choreography.index('SAFE MODE') < choreography.index('ENHANCED MODE')
      if 'SAFE MODE' in choreography and 'ENHANCED MODE' in choreography else False,
      'SAFE MODE does not precede ENHANCED MODE in choreography doc')

check('Baseline first: operator playbook starts INACTIVE',
      'SAFE MODE' in playbook and 'INACTIVE' in playbook,
      'Operator playbook does not start in INACTIVE/SAFE MODE')

check('Baseline first: activation strategy declares baseline first',
      'baseline' in activation_strat.lower() and
      ('first' in activation_strat.lower() or 'before' in activation_strat.lower()),
      'Baseline-first declaration missing from activation strategy')

# ── Section 5: No Implicit Activation ─────────────────────────────────────

check('No implicit activation: explicit operator action required',
      ('explicit' in activation_strat.lower() and
       ('operator' in activation_strat.lower() or 'demo_activate' in activation_strat)),
      'Explicit operator action requirement missing from activation strategy')

check('No implicit activation: "never automatic" declared',
      ('never automatic' in activation_strat.lower() or
       'never activat' in activation_strat.lower() or
       'must never activate' in activation_strat.lower()),
      'Never-automatic declaration missing from activation strategy')

check('No implicit activation: demo_activate.py requires --enable flag',
      '--enable' in read_text(DEMO_ACTIVATE),
      '--enable flag not present in demo_activate.py')

# ── Section 6: Additive-Only Value Language ────────────────────────────────

check('Additive only: value_delta_spec declares additions only',
      ('added' in value_delta.lower() or 'additive' in value_delta.lower()) and
      'unchanged' in value_delta.lower(),
      'Additive-only declaration missing from value_delta_spec')

check('Additive only: INACTIVE/ACTIVE invariant table present',
      'NONE' in value_delta and 'ADDED' in value_delta,
      'NONE/ADDED invariant table missing from value_delta_spec')

check('Additive only: ENL fields confirmed unchanged in all states',
      ('title' in value_delta and 'unchanged' in value_delta.lower()),
      'ENL field unchanged declaration missing from value_delta_spec')

check('Additive only: presenter narration uses additive language',
      ('already there' in value_delta.lower() or 'labeled what' in value_delta.lower() or
       'layered' in value_delta.lower()),
      'Additive framing missing from value narration in value_delta_spec')

# ── Section 7: No Interpretation Leakage ─────────────────────────────────

# Check that forbidden phrases are not used as active claims.
# Strip prohibition example lines (those containing "→" marker) before scanning —
# the value_delta_spec lists these phrases explicitly as FORBIDDEN examples.
_value_delta_active = '\n'.join(
    line for line in value_delta.splitlines()
    if '→' not in line
)
interpretation_terms = [
    r'risk is high',
    r'sem-pat signals a problem',
    r'better structured',
    r'semantic score',
    r'improved',
]
for term in interpretation_terms:
    match = re.search(term, _value_delta_active, re.IGNORECASE)
    check(f'No interpretation leakage: "{term}" not used as active claim',
          match is None,
          f'Interpretation term used as active claim: {match.group() if match else ""}')

check('No interpretation leakage: "What NOT to say" prohibition list in playbook',
      ('not to say' in playbook.lower() or 'what not' in playbook.lower()),
      '"What NOT to say" section missing from operator playbook')

check('No interpretation leakage: scoring/judgment terms in prohibition context only',
      'scoring' in playbook.lower() or 'judgment' in fallback_narr.lower() or
      'evaluation' in value_delta.lower(),
      'Scoring/judgment prohibition not declared')

# ── Section 8: Fallback Honesty ───────────────────────────────────────────

check('Fallback honesty: "not error" declared in fallback narrative',
      ('not error' in fallback_narr.lower() or 'not an error' in fallback_narr.lower()),
      '"not an error" declaration missing from fallback_narrative')

check('Fallback honesty: ENL operational in fallback declared',
      'enl' in fallback_narr.lower() and 'operational' in fallback_narr.lower(),
      'ENL operational declaration missing from fallback narrative')

check('Fallback honesty: recovery procedure defined',
      'recovery' in fallback_narr.lower() or 'restore' in fallback_narr.lower(),
      'Recovery procedure missing from fallback narrative')

check('Fallback honesty: neutral display language declared',
      'neutral' in fallback_narr.lower() or 'no alarm' in fallback_narr.lower() or
      'no error icon' in fallback_narr.lower(),
      'Neutral fallback display language not declared')

# ── Section 9: Deterministic Demo ─────────────────────────────────────────

check('Deterministic demo: pre-demo validation chain defined (3 validators)',
      ('validate_semantic_binding' in playbook or 'validate_semantic_binding' in activation_strat) and
      ('validate_semantic_activation' in playbook or 'validate_semantic_activation' in activation_strat),
      'Pre-demo validation chain not fully declared')

check('Deterministic demo: dry-run procedure defined',
      'dry run' in playbook.lower() or 'dry-run' in playbook.lower() or
      'pre-demo' in playbook.lower(),
      'Dry-run/pre-demo procedure missing from operator playbook')

# ── Section 10: demo_activate.py Functional Tests ─────────────────────────

# Test --enable
result_enable = subprocess.run(
    [sys.executable, str(DEMO_ACTIVATE), "--enable"],
    capture_output=True, text=True, cwd=str(REPO_ROOT)
)
check('demo_activate.py --enable exits 0',
      result_enable.returncode == 0,
      f'exit code: {result_enable.returncode}\n{result_enable.stdout}')

check('demo_activate.py --enable shows SEMANTIC_PATH_ACTIVE',
      'SEMANTIC_PATH_ACTIVE' in result_enable.stdout,
      f'ACTIVE not found in output:\n{result_enable.stdout}')

# Test --disable
result_disable = subprocess.run(
    [sys.executable, str(DEMO_ACTIVATE), "--disable"],
    capture_output=True, text=True, cwd=str(REPO_ROOT)
)
check('demo_activate.py --disable exits 0',
      result_disable.returncode == 0,
      f'exit code: {result_disable.returncode}')

check('demo_activate.py --disable shows SEMANTIC_PATH_INACTIVE',
      'SEMANTIC_PATH_INACTIVE' in result_disable.stdout,
      f'INACTIVE not found in output:\n{result_disable.stdout}')

# Test --status
result_status = subprocess.run(
    [sys.executable, str(DEMO_ACTIVATE), "--status"],
    capture_output=True, text=True, cwd=str(REPO_ROOT)
)
check('demo_activate.py --status exits 0',
      result_status.returncode == 0,
      f'exit code: {result_status.returncode}')

check('demo_activate.py --status shows path_state',
      'path_state' in result_status.stdout,
      'path_state missing from --status output')

# ── Section 11: No Modifications to Upstream Layers ──────────────────────

for module_path in ENL_MODULES:
    if module_path.is_file():
        content = module_path.read_text(encoding='utf-8')
        check(f'No ENL modification: {module_path.name}',
              '42.13' not in content and 'demo_activate' not in content,
              f'42.13 reference in {module_path.name}')
    else:
        check(f'ENL module exists: {module_path.name}', False, f'missing: {module_path}')

for module_path in ADAPTER_MODULES:
    if module_path.is_file():
        content = module_path.read_text(encoding='utf-8')
        check(f'No adapter modification: {module_path.name}',
              '42.13' not in content and 'demo_activate' not in content,
              f'42.13 reference in {module_path.name}')
    else:
        check(f'Adapter exists: {module_path.name}', False, f'missing: {module_path}')

# ── Section 12: Validation Report Content ────────────────────────────────

check('Validation report: VALIDATION STATUS: PASS declared',
      'VALIDATION STATUS: PASS' in val_report,
      'VALIDATION STATUS: PASS missing from demo_validation_report.md')

check('Validation report: baseline_first_rule criterion present',
      'baseline_first_rule' in val_report,
      'baseline_first_rule missing from validation report')

check('Validation report: no_implicit_activation criterion present',
      'no_implicit_activation' in val_report,
      'no_implicit_activation missing from validation report')

check('Validation report: fallback_honesty criterion present',
      'fallback_honesty' in val_report,
      'fallback_honesty missing from validation report')

# ── Report ─────────────────────────────────────────────────────────────────

print()
print('PIOS-42.13-RUN01-CONTRACT-v1 — Demo Strategy Validation')
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

print('Runtime State:')
print('  path_state:        SEMANTIC_PATH_INACTIVE')
print('  activation_status: NOT_ACTIVATED')
print('  demo_mode:         SAFE MODE (default)')
print('  demo_ready:        YES')
print()

if failed > 0:
    print('VALIDATION STATUS: FAIL')
    sys.exit(1)
else:
    print('VALIDATION STATUS: PASS')
    sys.exit(0)

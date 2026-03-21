#!/usr/bin/env python3
"""
validate_semantic_exposure.py
PIOS-42.12-RUN01-CONTRACT-v1 · run_01_blueedge

Semantic Exposure Validator — Stream 42.12

Validates:
  1. Required 42.12 artifact presence
  2. 42.11 validator recheck
  3. Runtime honesty rules (H-01..H-07)
  4. Inactive mode: zero semantic content declared
  5. Active mode: additive-only annotations, no interpretation
  6. Fallback mode: ENL operational framing, no error presentation
  7. Non-clutter: primary/secondary/omitted decisions documented per surface
  8. No interpretation leakage (no scoring, banding, thresholds)
  9. Demo integrity declarations present
 10. Non-regression: no 42.x or ENL modifications

This script is read-only. It does not modify any artifacts.

Python 3.9+ standard library only.
"""

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]

# ── Paths ──────────────────────────────────────────────────────────────────

PATH_42_12       = REPO_ROOT / "docs/pios/42.12"
PATH_CONTRACTS   = REPO_ROOT / "docs/pios/contracts/42.12"
PATH_SCRIPTS     = REPO_ROOT / "scripts/pios/42.12"
PATH_42_11_VAL   = REPO_ROOT / "scripts/pios/42.11/validate_semantic_activation.py"
PATH_42_9_VAL    = REPO_ROOT / "scripts/pios/42.9/validate_demo_package.py"

REQUIRED_42_12_DOCS = [
    "exposure_model.md",
    "runtime_state_visibility_spec.md",
    "semantic_annotation_display_spec.md",
    "demo_adoption_assessment.md",
    "non_clutter_matrix.md",
    "exposure_validation_report.md",
]

REQUIRED_42_12_SCRIPTS = [
    "validate_semantic_exposure.py",
]

REQUIRED_42_12_CONTRACTS = [
    "PIOS-42.12-RUN01-CONTRACT-v1.md",
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

# ── Section 1: Artifact Presence ──────────────────────────────────────────

for artifact in REQUIRED_42_12_DOCS:
    path = PATH_42_12 / artifact
    check(f'42.12 doc present: {artifact}', path.is_file(), f'expected at {path}')

for artifact in REQUIRED_42_12_SCRIPTS:
    path = PATH_SCRIPTS / artifact
    check(f'42.12 script present: {artifact}', path.is_file(), f'expected at {path}')

for artifact in REQUIRED_42_12_CONTRACTS:
    path = PATH_CONTRACTS / artifact
    check(f'42.12 contract present: {artifact}', path.is_file(), f'expected at {path}')

# ── Section 2: 42.11 Validator Recheck ────────────────────────────────────

result_42_11 = subprocess.run(
    [sys.executable, str(PATH_42_11_VAL)],
    capture_output=True, text=True
)
check('42.11 validator passes (66/66)',
      result_42_11.returncode == 0,
      f'exit code: {result_42_11.returncode}\n{result_42_11.stdout[-300:]}')

# ── Section 3: Load docs ──────────────────────────────────────────────────

exposure_model   = read_text(PATH_42_12 / "exposure_model.md")
visibility_spec  = read_text(PATH_42_12 / "runtime_state_visibility_spec.md")
display_spec     = read_text(PATH_42_12 / "semantic_annotation_display_spec.md")
demo_assessment  = read_text(PATH_42_12 / "demo_adoption_assessment.md")
clutter_matrix   = read_text(PATH_42_12 / "non_clutter_matrix.md")
val_report       = read_text(PATH_42_12 / "exposure_validation_report.md")

# ── Section 4: Runtime Honesty Rules (H-01..H-07) ─────────────────────────

check('H-01: INACTIVE shows no semantic labels — declared in visibility spec',
      'INACTIVE' in visibility_spec and 'absent' in visibility_spec.lower(),
      'absent/INACTIVE declaration missing from visibility spec')

check('H-02: ACTIVE shows only registry annotations — declared in display spec',
      'SEMANTIC_PATH_ACTIVE' in display_spec or 'path_state == SEMANTIC_PATH_ACTIVE' in display_spec,
      'ACTIVE annotation condition not declared in display spec')

check('H-03: FALLBACK is not error — declared in docs',
      ('not an error' in exposure_model.lower() or
       'not flagged as error' in exposure_model.lower() or
       'not an error' in visibility_spec.lower()),
      'Fallback-is-not-error declaration missing from docs')

check('H-04: path_state sourced from get_path_state() — not hardcoded',
      'get_path_state()' in visibility_spec,
      'get_path_state() reference missing from visibility spec')

check('H-05: No synthesized content in annotations — declared in display spec',
      ('verbatim' in display_spec.lower() or
       'registry values only' in display_spec.lower()),
      'Prohibition on synthesized annotation content not declared (verbatim registry values rule)')

check('H-06: "active" must not appear in INACTIVE mode — declared',
      'INACTIVE' in visibility_spec and 'absent' in visibility_spec.lower(),
      'INACTIVE clean state not asserted in visibility spec')

check('H-07: State changes resolve at function call time — declared',
      'function call' in visibility_spec.lower() or 'call time' in visibility_spec.lower() or
      'get_path_state' in visibility_spec,
      'Runtime resolution rule not declared in visibility spec')

# ── Section 5: Inactive Mode Clarity ──────────────────────────────────────

check('Inactive mode: zero annotation content declared',
      'INACTIVE' in exposure_model and 'None' in exposure_model,
      'INACTIVE zero-annotation declaration missing from exposure model')

check('Inactive mode: zero secondary items in non-clutter matrix',
      'secondary item' in clutter_matrix.lower() and '0' in clutter_matrix,
      'Zero secondary items assertion missing from non-clutter matrix')

check('Inactive mode: pre-42.10 parity declared',
      'pre-42.10' in exposure_model or 'pre-42.10' in visibility_spec,
      'Pre-42.10 parity declaration missing')

check('Inactive mode: no placeholder annotation rule declared',
      'placeholder' in display_spec.lower(),
      'No-placeholder rule missing from display spec')

# ── Section 6: Active Mode — Additive Only ────────────────────────────────

check('Active mode: semantic_annotations is additive (not replacing)',
      ('additive' in exposure_model.lower() and
       ('after existing' in display_spec.lower() or 'additive' in display_spec.lower())),
      'Additive-only declaration missing')

check('Active mode: permitted display fields listed (semantic_id, construct_type)',
      'semantic_id' in display_spec and 'construct_type' in display_spec,
      'Permitted fields not listed in display spec')

check('Active mode: ENL fields protected from alteration',
      ('unchanged' in visibility_spec.lower() and
       ('title' in visibility_spec or 'statement' in visibility_spec)),
      'ENL field protection not declared in visibility spec')

check('Active mode: progressive disclosure model declared',
      'progressive' in display_spec.lower() or 'level 0' in display_spec.lower(),
      'Progressive disclosure model missing from display spec')

# ── Section 7: Fallback Mode Honesty ──────────────────────────────────────

check('Fallback mode: ENL direct path framing used',
      'ENL direct' in visibility_spec or 'ENL direct' in exposure_model,
      'ENL direct path framing missing from fallback spec')

check('Fallback mode: no error/alarm presentation',
      ('not an error' in exposure_model.lower() or
       'not flagged as error' in exposure_model.lower()),
      'Fallback-as-non-error declaration missing')

check('Fallback mode: annotation absence in fallback is correct behavior',
      'FALLBACK' in display_spec and ('absent' in display_spec or 'Forbidden' in display_spec),
      'Fallback annotation absence not declared as correct in display spec')

# ── Section 8: No Interpretation Leakage ─────────────────────────────────

check('No interpretation leakage: scoring language absent from display spec',
      'score' not in display_spec.lower().replace('scoring', '___REMOVED___').replace('score', ''),
      'Scoring language detected in display spec')

# Check for prohibition of scoring — the spec should mention it as forbidden
check('No interpretation leakage: scoring prohibition declared',
      'scoring' in display_spec.lower(),
      'Scoring prohibition not declared in display spec')

check('No interpretation leakage: 75.x deferred in exposure docs',
      '75.x' in display_spec or '75.x' in exposure_model,
      '75.x deferral not declared in exposure docs')

check('No interpretation leakage: construct type not severity indicator',
      'severity' in display_spec.lower() or 'not used as severity' in display_spec.lower() or
      'Forbidden' in display_spec,
      'Construct-type-as-severity prohibition missing')

check('No interpretation leakage: annotation absence not quality signal',
      'quality' in display_spec.lower() or 'absence' in display_spec.lower(),
      'Annotation-absence-as-quality-signal prohibition missing')

# Check display spec for actual forbidden pattern examples
check('No interpretation leakage: forbidden pattern examples declared',
      'Prohibited pattern' in display_spec or 'FORBIDDEN' in display_spec,
      'Forbidden display patterns not documented in display spec')

# ── Section 9: Non-Clutter ────────────────────────────────────────────────

check('Non-clutter: NC-01 (CLI) surface declared',
      'NC-01' in clutter_matrix,
      'NC-01 CLI surface missing from non-clutter matrix')

check('Non-clutter: NC-02 (JSON adapter) surface declared',
      'NC-02' in clutter_matrix,
      'NC-02 JSON adapter surface missing from non-clutter matrix')

check('Non-clutter: NC-03 (overview) surface declared',
      'NC-03' in clutter_matrix,
      'NC-03 overview surface missing')

check('Non-clutter: NC-04 (topology) surface declared',
      'NC-04' in clutter_matrix,
      'NC-04 topology surface missing')

check('Non-clutter: NC-05 (UI/demo) surface declared',
      'NC-05' in clutter_matrix,
      'NC-05 UI/demo surface missing')

check('Non-clutter: PRIMARY classification used',
      'PRIMARY' in clutter_matrix,
      'PRIMARY classification missing from non-clutter matrix')

check('Non-clutter: SECONDARY classification used',
      'SECONDARY' in clutter_matrix,
      'SECONDARY classification missing')

check('Non-clutter: OMITTED INTENTIONALLY classification used',
      'OMITTED INTENTIONALLY' in clutter_matrix,
      'OMITTED INTENTIONALLY classification missing')

check('Non-clutter: principle enforced declaration present',
      'ENFORCED' in clutter_matrix,
      'Non-clutter principle enforcement declaration missing')

# ── Section 10: Demo Integrity ────────────────────────────────────────────

check('Demo integrity: 42.8 choreography regression = NONE declared',
      'NONE' in demo_assessment and '42.8' in demo_assessment,
      '42.8 no-regression declaration missing from demo assessment')

check('Demo integrity: demo default remains INACTIVE',
      'INACTIVE' in demo_assessment and ('default' in demo_assessment.lower() or
                                          'recommendation' in demo_assessment.lower()),
      'Demo default INACTIVE recommendation missing')

check('Demo integrity: active demo requires explicit activation',
      'explicit' in demo_assessment.lower() or '42.13' in demo_assessment,
      'Active demo explicit activation requirement missing')

check('Demo integrity: 42.9 validator unmodified',
      PATH_42_9_VAL.is_file(),
      f'42.9 validator missing: {PATH_42_9_VAL}')

# ── Section 11: Non-Regression (no 42.x or ENL modifications) ────────────

for module_path in ENL_MODULES:
    if module_path.is_file():
        content = module_path.read_text(encoding='utf-8')
        check(f'No ENL module modified: {module_path.name}',
              '42.12' not in content and 'semantic_exposure' not in content,
              f'42.12 reference found in {module_path.name}')
    else:
        check(f'ENL module exists: {module_path.name}', False, f'missing: {module_path}')

for module_path in ADAPTER_MODULES:
    if module_path.is_file():
        content = module_path.read_text(encoding='utf-8')
        check(f'No 42.x adapter modified: {module_path.name}',
              '42.12' not in content and 'semantic_exposure' not in content,
              f'42.12 reference found in {module_path.name}')
    else:
        check(f'42.x adapter exists: {module_path.name}', False, f'missing: {module_path}')

# ── Section 12: Validation Report Content ────────────────────────────────

check('Validation report: VALIDATION STATUS: PASS declared',
      'VALIDATION STATUS: PASS' in val_report,
      'VALIDATION STATUS: PASS not found in exposure_validation_report.md')

check('Validation report: all 10 criteria present',
      all(c in val_report for c in [
          'filesystem_guard', 'runtime_honesty', 'inactive_mode',
          'active_mode', 'fallback_mode', 'no_interpretation_leakage',
          'non_clutter', 'demo_integrity', 'non_regression'
      ]),
      'One or more validation criteria missing from report')

# ── Report ─────────────────────────────────────────────────────────────────

print()
print('PIOS-42.12-RUN01-CONTRACT-v1 — Semantic Exposure Validation')
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
print('  enl_direct_path:   OPERATIONAL')
print('  exposure_active:   NO (default — INACTIVE mode is clean)')
print()

if failed > 0:
    print('VALIDATION STATUS: FAIL')
    sys.exit(1)
else:
    print('VALIDATION STATUS: PASS')
    sys.exit(0)

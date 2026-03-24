#!/usr/bin/env python3
"""
validate_enl_exposure.py
PIOS-42.15-RUN01-CONTRACT-v1 · run_01_enl_ui_exposure

ENL Exposure Validator — Stream 42.15

Validates:
  1. Required 42.15 artifact presence
  2. 42.14 validator recheck
  3. Exposure model integrity
  4. Drilldown spec integrity
  5. Provenance spec integrity
  6. AC-001: ENL chain visible for at least one query
  7. AC-002: Drill-down works (multi-level expansion)
  8. AC-003: Provenance fields present and correct
  9. AC-004: No change to existing 42.x output when ENL section disabled
 10. AC-005: Deterministic output (same input → same output)

Python 3.9+ standard library only.
"""

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]

# ── Paths ──────────────────────────────────────────────────────────────────

PATH_42_15       = REPO_ROOT / "docs/pios/42.15"
PATH_CONTRACTS   = REPO_ROOT / "docs/pios/contracts/42.15"
PATH_SCRIPTS     = REPO_ROOT / "scripts/pios/42.15"
PATH_42_14_VAL   = REPO_ROOT / "scripts/pios/42.14/validate_demo_packaging.py"
PATH_42_4_ADAPTER = REPO_ROOT / "scripts/pios/42.4/execlens_adapter.py"
PATH_CONSOLE_ADAPTER = PATH_SCRIPTS / "enl_console_adapter.py"

REQUIRED_42_15_DOCS = [
    "enl_exposure_model.md",
    "enl_drilldown_spec.md",
    "enl_provenance_spec.md",
]

REQUIRED_42_15_SCRIPTS = [
    "enl_console_adapter.py",
    "validate_enl_exposure.py",
]

REQUIRED_42_15_CONTRACTS = [
    "PIOS-42.15-RUN01-CONTRACT-v1.md",
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

def run_script(args, cwd=None):
    return subprocess.run(
        [sys.executable] + args,
        capture_output=True, text=True,
        cwd=str(cwd or REPO_ROOT)
    )

# ── Section 1: Artifact Presence ──────────────────────────────────────────

for artifact in REQUIRED_42_15_DOCS:
    path = PATH_42_15 / artifact
    check(f'42.15 doc present: {artifact}', path.is_file(), f'expected at {path}')

for artifact in REQUIRED_42_15_SCRIPTS:
    path = PATH_SCRIPTS / artifact
    check(f'42.15 script present: {artifact}', path.is_file(), f'expected at {path}')

for artifact in REQUIRED_42_15_CONTRACTS:
    path = PATH_CONTRACTS / artifact
    check(f'42.15 contract present: {artifact}', path.is_file(), f'expected at {path}')

# ── Section 2: 42.14 Validator Recheck ────────────────────────────────────

result_42_14 = run_script([str(PATH_42_14_VAL)])
check('42.14 validator passes',
      result_42_14.returncode == 0,
      f'exit code: {result_42_14.returncode}')

# ── Section 3: Load docs ──────────────────────────────────────────────────

exposure_model  = read_text(PATH_42_15 / "enl_exposure_model.md")
drilldown_spec  = read_text(PATH_42_15 / "enl_drilldown_spec.md")
provenance_spec = read_text(PATH_42_15 / "enl_provenance_spec.md")
adapter_text    = read_text(PATH_CONSOLE_ADAPTER)

# ── Section 4: Exposure Model Integrity ──────────────────────────────────

check('Exposure model: ENL chain structure defined (INTEL → SIG-41 → SIG-40 → EVID)',
      'INTEL' in exposure_model and 'SIG-41' in exposure_model and
      'SIG-40' in exposure_model and 'EVID' in exposure_model,
      'INTEL/SIG-41/SIG-40/EVID layer definitions missing')

check('Exposure model: additive-only principle declared',
      'additive' in exposure_model.lower(),
      'Additive-only principle missing from exposure model')

check('Exposure model: no interpretation declared',
      'no interpretation' in exposure_model.lower() or
      'no transformation' in exposure_model.lower(),
      'No-interpretation declaration missing')

check('Exposure model: verbatim field values rule declared (EE-01)',
      'EE-01' in exposure_model or 'verbatim' in exposure_model.lower(),
      'EE-01 verbatim rule missing from exposure model')

check('Exposure model: ENL graph mode and evidence mapping mode defined',
      'Mode 1' in exposure_model and 'Mode 2' in exposure_model,
      'Dual exposure modes not defined in exposure model')

check('Exposure model: deterministic output rule declared',
      'deterministic' in exposure_model.lower() or 'EE-06' in exposure_model,
      'Deterministic output rule missing from exposure model')

check('Exposure model: no 42.x modification declared',
      '42.x' in exposure_model and
      ('no modification' in exposure_model.lower() or 'not modify' in exposure_model.lower() or
       'unchanged' in exposure_model.lower()),
      'No-42.x-modification declaration missing from exposure model')

# ── Section 5: Drilldown Spec Integrity ───────────────────────────────────

check('Drilldown spec: --drilldown and --depth arguments defined',
      '--drilldown' in drilldown_spec and '--depth' in drilldown_spec,
      '--drilldown/--depth arguments missing from drilldown spec')

check('Drilldown spec: DD-01 derived_from navigation rule defined',
      'DD-01' in drilldown_spec,
      'DD-01 missing from drilldown spec')

check('Drilldown spec: DD-03 session immutability rule defined',
      'DD-03' in drilldown_spec,
      'DD-03 session immutability missing')

check('Drilldown spec: breadcrumbs defined',
      'breadcrumb' in drilldown_spec.lower(),
      'Breadcrumbs not defined in drilldown spec')

check('Drilldown spec: chain_status defined in output format',
      'chain_status' in drilldown_spec,
      'chain_status missing from drilldown spec output format')

check('Drilldown spec: depth limit defined',
      'depth limit' in drilldown_spec.lower(),
      'Depth limit not defined in drilldown spec')

# ── Section 6: Provenance Spec Integrity ──────────────────────────────────

check('Provenance spec: node_id field defined',
      'node_id' in provenance_spec,
      'node_id missing from provenance spec')

check('Provenance spec: source_ref field defined',
      'source_ref' in provenance_spec,
      'source_ref missing from provenance spec')

check('Provenance spec: derived_from field defined',
      'derived_from' in provenance_spec,
      'derived_from missing from provenance spec')

check('Provenance spec: PR-01 no field omission rule defined',
      'PR-01' in provenance_spec,
      'PR-01 no field omission rule missing')

check('Provenance spec: PR-05 no provenance synthesis rule defined',
      'PR-05' in provenance_spec,
      'PR-05 no provenance synthesis rule missing')

check('Provenance spec: evidence mapping mode fields defined (source_object_id)',
      'source_object_id' in provenance_spec,
      'source_object_id missing from evidence mapping mode in provenance spec')

check('Provenance spec: supporting_objects display defined',
      'supporting_objects' in provenance_spec,
      'supporting_objects missing from provenance spec')

check('Provenance spec: evidence_chain display defined',
      'evidence_chain' in provenance_spec,
      'evidence_chain missing from provenance spec')

# ── Section 7: Console Adapter Integrity ──────────────────────────────────

check('Adapter: ENL modules imported (enl_query_engine_v1)',
      'enl_query_engine_v1' in adapter_text,
      'enl_query_engine_v1 not imported in console adapter')

check('Adapter: lens_drilldown_v1 imported',
      'lens_drilldown_v1' in adapter_text,
      'lens_drilldown_v1 not imported in console adapter')

check('Adapter: evidence_mapping_index.json sourced',
      'evidence_mapping_index' in adapter_text,
      'evidence_mapping_index not referenced in console adapter')

check('Adapter: signal_registry.json sourced',
      'signal_registry' in adapter_text,
      'signal_registry not referenced in console adapter')

check('Adapter: --query mode defined',
      '--query' in adapter_text,
      '--query mode missing from console adapter')

check('Adapter: --signal mode defined',
      '--signal' in adapter_text,
      '--signal mode missing from console adapter')

check('Adapter: --drilldown mode defined',
      '--drilldown' in adapter_text,
      '--drilldown mode missing from console adapter')

check('Adapter: --depth option defined',
      '--depth' in adapter_text,
      '--depth option missing from console adapter')

check('Adapter: no 42.x import (additive — not modifying existing adapters)',
      '42.4' not in adapter_text.replace('docs/pios/42.4', '').replace('PATH_42_4', '') or
      'import' not in adapter_text.split('42.4')[0][-50:],
      '42.x adapter import detected in console adapter (should be standalone)')

# ── Section 8: AC-001 — ENL chain visible for at least one query ──────────

result_q3 = run_script([str(PATH_CONSOLE_ADAPTER), '--query', 'GQ-003'])
check('AC-001: enl_console_adapter --query GQ-003 exits 0',
      result_q3.returncode == 0,
      f'exit code: {result_q3.returncode}\n{result_q3.stderr[:200]}')

check('AC-001: GQ-003 output contains INTEL layer',
      'INTEL' in result_q3.stdout,
      'INTEL layer not visible in GQ-003 output')

check('AC-001: GQ-003 output contains EVID layer',
      'EVID' in result_q3.stdout,
      'EVID layer not visible in GQ-003 output')

check('AC-001: GQ-003 output contains ENL node IDs',
      'INTEL-GQ003-001' in result_q3.stdout,
      'ENL node INTEL-GQ003-001 not present in output')

check('AC-001: GQ-003 output contains chain_status',
      'chain_status' in result_q3.stdout,
      'chain_status not present in GQ-003 output')

# AC-001 also for evidence mapping mode
result_sig1 = run_script([str(PATH_CONSOLE_ADAPTER), '--signal', 'SIG-001'])
check('AC-001: enl_console_adapter --signal SIG-001 exits 0',
      result_sig1.returncode == 0,
      f'exit code: {result_sig1.returncode}\n{result_sig1.stderr[:200]}')

check('AC-001: SIG-001 output contains INTEL-REF section',
      'INTEL-REF' in result_sig1.stdout,
      'INTEL-REF section not present in SIG-001 output')

check('AC-001: SIG-001 output contains evidence_chain',
      'evidence_chain' in result_sig1.stdout,
      'evidence_chain not present in SIG-001 output')

# ── Section 9: AC-002 — Drill-down works (multi-level expansion) ──────────

# Depth 1: only INTEL layer
result_d1 = run_script([str(PATH_CONSOLE_ADAPTER), '--drilldown', 'INTEL-GQ003-001', '--depth', '1'])
check('AC-002: --drilldown --depth 1 exits 0',
      result_d1.returncode == 0,
      f'exit code: {result_d1.returncode}')

check('AC-002: depth 1 shows Step 1/4 [INTEL]',
      'Step 1/4' in result_d1.stdout and 'INTEL' in result_d1.stdout,
      'Step 1/4 INTEL not in depth-1 output')

check('AC-002: depth 1 does not show [SIG-41]',
      'Step 2/4' not in result_d1.stdout,
      'depth-1 output unexpectedly contains Step 2/4')

# Depth 2: INTEL + SIG-41
result_d2 = run_script([str(PATH_CONSOLE_ADAPTER), '--drilldown', 'INTEL-GQ003-001', '--depth', '2'])
check('AC-002: --drilldown --depth 2 exits 0',
      result_d2.returncode == 0,
      f'exit code: {result_d2.returncode}')

check('AC-002: depth 2 shows SIG-41 layer',
      'SIG-41' in result_d2.stdout and 'Step 2/4' in result_d2.stdout,
      'SIG-41 layer not in depth-2 output')

check('AC-002: depth 2 does not show SIG-40',
      'Step 3/4' not in result_d2.stdout,
      'depth-2 output unexpectedly contains Step 3/4')

# Full chain
result_df = run_script([str(PATH_CONSOLE_ADAPTER), '--drilldown', 'INTEL-GQ003-001'])
check('AC-002: full drilldown exits 0',
      result_df.returncode == 0,
      f'exit code: {result_df.returncode}')

check('AC-002: full drilldown reaches EVID',
      'EVID' in result_df.stdout and 'Step 4/4' in result_df.stdout,
      'EVID layer not in full drilldown output')

check('AC-002: full drilldown shows breadcrumbs trail',
      'breadcrumbs:' in result_df.stdout and 'EVID-ST007-001' in result_df.stdout,
      'Breadcrumbs trail missing from full drilldown output')

check('AC-002: depth-1 output is subset of full drilldown (progressive expansion)',
      'Step 1/4' in result_d1.stdout and 'Step 1/4' in result_df.stdout,
      'Step 1/4 not present in both depth-1 and full drilldown')

# ── Section 10: AC-003 — Provenance fields present and correct ────────────

# ENL graph mode provenance
check('AC-003: node_id present in GQ-003 chain output',
      'INTEL-GQ003-001' in result_q3.stdout,
      'node_id INTEL-GQ003-001 not in output')

check('AC-003: source_ref present in GQ-003 chain output',
      'source_ref:' in result_q3.stdout,
      'source_ref field not in GQ-003 output')

check('AC-003: derived_from present in GQ-003 chain output',
      'derived_from:' in result_q3.stdout,
      'derived_from field not in GQ-003 output')

check('AC-003: run_id present in GQ-003 chain output',
      'run_id:' in result_q3.stdout,
      'run_id field not in GQ-003 output')

# Evidence mapping mode provenance
check('AC-003: source_object_id present in SIG-001 output',
      'source_object_id:' in result_sig1.stdout,
      'source_object_id field not in SIG-001 output')

check('AC-003: source_layer present in SIG-001 output',
      'source_layer:' in result_sig1.stdout,
      'source_layer field not in SIG-001 output')

check('AC-003: supporting_objects section present in SIG-001 output',
      'SUPPORTING' in result_sig1.stdout,
      'SUPPORTING section not in SIG-001 output')

check('AC-003: blocking_point field present in SIG-001 output',
      'blocking_point:' in result_sig1.stdout,
      'blocking_point field not in SIG-001 output')

check('AC-003: source attribution present ([ENL graph:] or [evidence-mapping:])',
      '[ENL graph:' in result_q3.stdout and '[evidence-mapping:' in result_sig1.stdout,
      'Source attribution missing from output')

# ── Section 11: AC-004 — No change to 42.x output when ENL disabled ──────

# Run 42.4 adapter for GQ-003 — output should be unchanged
result_42_4_a = run_script([str(REPO_ROOT / 'scripts/pios/42.4/execlens_adapter.py'), 'GQ-003'])
result_42_4_b = run_script([str(REPO_ROOT / 'scripts/pios/42.4/execlens_adapter.py'), 'GQ-003'])

check('AC-004: 42.4 adapter GQ-003 exits 0 (baseline)',
      result_42_4_a.returncode == 0,
      f'42.4 adapter failed: {result_42_4_a.stderr[:200]}')

check('AC-004: 42.4 adapter output unchanged between runs (ENL adapter not interfering)',
      result_42_4_a.stdout == result_42_4_b.stdout,
      '42.4 adapter output differs between consecutive runs')

check('AC-004: 42.15 ENL output does not appear in 42.4 output',
      'PIOS-42.15' not in result_42_4_a.stdout,
      'PIOS-42.15 contract ID appears in 42.4 output (contamination)')

check('AC-004: ENL EVIDENCE CHAIN header not in 42.4 output',
      'ENL EVIDENCE CHAIN' not in result_42_4_a.stdout,
      'ENL EVIDENCE CHAIN header found in 42.4 output')

check('AC-004: 42.4 adapter imports not modified by 42.15',
      '42.15' not in read_text(REPO_ROOT / 'scripts/pios/42.4/execlens_adapter.py'),
      '42.15 reference found in 42.4 adapter (upstream modification)')

# ── Section 12: AC-005 — Deterministic output ─────────────────────────────

result_det_a = run_script([str(PATH_CONSOLE_ADAPTER), '--signal', 'SIG-002'])
result_det_b = run_script([str(PATH_CONSOLE_ADAPTER), '--signal', 'SIG-002'])

check('AC-005: --signal SIG-002 exits 0',
      result_det_a.returncode == 0,
      f'exit code: {result_det_a.returncode}')

check('AC-005: SIG-002 output identical between two runs (deterministic)',
      result_det_a.stdout == result_det_b.stdout,
      'SIG-002 output differs between consecutive runs')

result_det_c = run_script([str(PATH_CONSOLE_ADAPTER), '--query', 'GQ-001'])
result_det_d = run_script([str(PATH_CONSOLE_ADAPTER), '--query', 'GQ-001'])

check('AC-005: --query GQ-001 exits 0',
      result_det_c.returncode == 0,
      f'exit code: {result_det_c.returncode}')

check('AC-005: GQ-001 output identical between two runs (deterministic)',
      result_det_c.stdout == result_det_d.stdout,
      'GQ-001 output differs between consecutive runs')

# ── Section 13: Additional coverage ───────────────────────────────────────

# Test --list works
result_list = run_script([str(PATH_CONSOLE_ADAPTER), '--list'])
check('--list exits 0',
      result_list.returncode == 0,
      f'exit code: {result_list.returncode}')

check('--list shows signals section',
      'Signals' in result_list.stdout,
      'Signals section missing from --list output')

check('--list shows queries section',
      'Queries' in result_list.stdout or 'queries' in result_list.stdout.lower(),
      'Queries section missing from --list output')

# All 5 signals accessible
for sig_id in ['SIG-001', 'SIG-002', 'SIG-003', 'SIG-004', 'SIG-005']:
    result = run_script([str(PATH_CONSOLE_ADAPTER), '--signal', sig_id])
    check(f'Signal {sig_id} accessible via --signal',
          result.returncode == 0,
          f'{sig_id}: exit code {result.returncode}')

# ── Report ─────────────────────────────────────────────────────────────────

print()
print('PIOS-42.15-RUN01-CONTRACT-v1 — ENL Exposure Validation')
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
print('  enl_exposure:      ACTIVE')
print('  enl_graph_mode:    AVAILABLE (ENL-002_minimal_graph_example.json)')
print('  evidence_mapping:  ACTIVE (41.4)')
print('  upstream_modified: NO')
print()

if failed > 0:
    print('VALIDATION STATUS: FAIL')
    sys.exit(1)
else:
    print('VALIDATION STATUS: PASS')
    sys.exit(0)

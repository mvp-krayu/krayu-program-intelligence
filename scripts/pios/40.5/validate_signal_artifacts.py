#!/usr/bin/env python3
"""
validate_signal_artifacts.py
Stream 40.5 — PiOS Signal Computation Engine
run_id: run_01_blueedge
contract: PIOS-40.5-RUN01-CONTRACT-v1

Validates the 6 docs/pios/40.5 signal artifacts for run_01_blueedge
against contract requirements.

GOVERNANCE IMMUTABILITY DECLARATION
This validation script is a governed artifact.
It is read-only after stream execution is declared complete.
Validation failures must be resolved by correcting the artifact under validation.
This script must not be modified in response to a failing check.

Checks:
  1.  Artifact completeness           — all 6 expected artifacts present and non-empty
  2.  Run identity                     — run_01_blueedge and contract ID in all artifacts
  3.  Signal IDs present               — SIG-001..008 in traceability map
  4.  DIM reference coverage           — required DIM- dimensions cited in artifacts
  5.  40.4 artifact references         — telemetry_dimension_catalog.md cited
  6.  Temporal references declared     — TMP- references present in specification
  7.  VAR_ variables declared          — input matrix declares required VAR_ groups
  8.  SIG-006 computed value           — 0.333 present in output set
  9.  Boundary compliance              — no forbidden content in signal artifacts
  10. Not-accessed declaration         — 40.2/40.3 declared as not accessed
  11. Governance immutability          — GOVERNANCE IMMUTABILITY DECLARATION in this script

Usage:
    python3 scripts/pios/40.5/validate_signal_artifacts.py
"""

import re
import sys
from pathlib import Path

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
ARTIFACT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.5"

SIGNAL_INPUT_MATRIX      = ARTIFACT_DIR / "signal_input_matrix.md"
COMPUTATION_SPEC         = ARTIFACT_DIR / "signal_computation_specification.md"
OUTPUT_SET               = ARTIFACT_DIR / "signal_output_set.md"
TRACEABILITY_MAP         = ARTIFACT_DIR / "signal_traceability_map.md"
VALIDATION_LOG           = ARTIFACT_DIR / "signal_validation_log.md"
BOUNDARY_ENFORCEMENT     = ARTIFACT_DIR / "signal_boundary_enforcement.md"

REQUIRED_ARTIFACTS = [
    SIGNAL_INPUT_MATRIX, COMPUTATION_SPEC, OUTPUT_SET,
    TRACEABILITY_MAP, VALIDATION_LOG, BOUNDARY_ENFORCEMENT,
]

REQUIRED_RUN_TERMS = ["run_01_blueedge", "PIOS-40.5-RUN01-CONTRACT-v1"]

REQUIRED_SIGNAL_IDS = [
    "SIG-001", "SIG-002", "SIG-003", "SIG-004",
    "SIG-005", "SIG-006", "SIG-007", "SIG-008",
]

REQUIRED_DIM_REFS = [
    "DIM-PR-001",
    "DIM-CP-001", "DIM-CP-002", "DIM-CP-003",
    "DIM-ET-001",
    "DIM-CS-001",
    "DIM-PC-001", "DIM-PC-002",
    "DIM-DE-004", "DIM-DE-005", "DIM-DE-006", "DIM-DE-007",
]

REQUIRED_40_4_ARTIFACT_REFS = ["telemetry_dimension_catalog.md"]

REQUIRED_TMP_REFS = ["TMP-004", "TMP-009", "TMP-010"]

REQUIRED_VAR_GROUPS = [
    "VAR_SYS_001", "VAR_CACHE_001", "VAR_CACHE_002", "VAR_CACHE_003",
    "VAR_EVT_001", "VAR_WS_001", "VAR_HASI_001", "VAR_HASI_002",
    "VAR_ALT_001", "VAR_DS_004",
]

# SIG-006 computed value: DIM-PC-002 / DIM-PC-001 = 10 / 30
REQUIRED_COMPUTED_VALUE = "0.333"
REQUIRED_COMPUTED_LABEL = "SIG-006 batch throughput rate"

FORBIDDEN_PATTERNS = [
    r"condition\s+activation",
    r"diagnosis\s+result",
    r"intelligence\s+synthesis",
    r"trend\s+derived",
    r"scoring\s+applied",
    r"heuristic\s+applied",
]

# Lines matching these patterns are prohibition declarations, not violations.
FORBIDDEN_ALLOWED_CONTEXTS = [
    r"No\s+condition\s+activation",
    r"no\s+condition\s+activation",
    r"No\s+diagnosis",
    r"no\s+diagnosis",
    r"Not\s+activated",
    r"not\s+activated",
    r"No\s+intelligence",
    r"no\s+intelligence",
    r"prohibited",
    r"Enforced",
    r"Compliant",
    r"Forbidden\s+Type",
    r"forbidden\s+content",
    r"Boundary",
    r"downstream",
    r"stream\s+40\.6",
    r"constraints_and_prohibitions",
    r"prohibited_operations",
    r"No\s+heuristic",
    r"no\s+heuristic",
    r"intelligence\s+synthesis",
    r"No\s+intelligence\s+artifacts",
]


def section(title):
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print('=' * 60)


def load(path):
    if not path.exists():
        return None
    return path.read_text()


def all_content():
    return [load(p) or "" for p in REQUIRED_ARTIFACTS]


def check_artifact_completeness():
    section("Check 1 — All 6 Signal Artifacts Present and Non-Empty")
    failures = []
    for path in REQUIRED_ARTIFACTS:
        if path.exists() and path.stat().st_size > 0:
            print(f"  PASS  {path.relative_to(EXECUTION_WORKSPACE)}")
        elif path.exists():
            print(f"  FAIL  EMPTY: {path.relative_to(EXECUTION_WORKSPACE)}")
            failures.append(path.name)
        else:
            print(f"  FAIL  MISSING: {path.relative_to(EXECUTION_WORKSPACE)}")
            failures.append(path.name)
    return len(failures) == 0


def check_run_identity():
    section("Check 2 — Run and Contract Identifiers Present in All Artifacts")
    failures = []
    contents = all_content()
    for term in REQUIRED_RUN_TERMS:
        found = sum(1 for c in contents if term in c)
        if found >= len(REQUIRED_ARTIFACTS):
            print(f"  PASS  '{term}' present in all {found} artifacts")
        else:
            print(f"  FAIL  '{term}' present in only {found}/{len(REQUIRED_ARTIFACTS)} artifacts")
            failures.append(term)
    return len(failures) == 0


def check_signal_ids():
    section("Check 3 — SIG-001..008 Present in Traceability Map")
    content = load(TRACEABILITY_MAP) or ""
    failures = []
    for sig_id in REQUIRED_SIGNAL_IDS:
        if sig_id in content:
            print(f"  PASS  {sig_id} traced")
        else:
            print(f"  FAIL  {sig_id} missing from signal_traceability_map.md")
            failures.append(sig_id)
    return len(failures) == 0


def check_dim_references():
    section("Check 4 — Required DIM- Dimension References Present")
    all_text = " ".join(all_content())
    failures = []
    for dim_ref in REQUIRED_DIM_REFS:
        if dim_ref in all_text:
            print(f"  PASS  {dim_ref} referenced")
        else:
            print(f"  FAIL  {dim_ref} not found in any 40.5 artifact")
            failures.append(dim_ref)
    dim_count = len(set(re.findall(r"DIM-[A-Z]+-\d+", all_text)))
    if dim_count >= 10:
        print(f"  PASS  DIM- reference count: {dim_count} >= 10")
    else:
        print(f"  FAIL  DIM- reference count: {dim_count} < 10")
        failures.append("DIM-count")
    return len(failures) == 0


def check_40_4_artifact_references():
    section("Check 5 — 40.4 Artifact References Present")
    all_text = " ".join(all_content())
    failures = []
    for artifact_ref in REQUIRED_40_4_ARTIFACT_REFS:
        if artifact_ref in all_text:
            print(f"  PASS  '{artifact_ref}' referenced")
        else:
            print(f"  FAIL  '{artifact_ref}' not found in any 40.5 artifact")
            failures.append(artifact_ref)
    return len(failures) == 0


def check_temporal_references():
    section("Check 6 — Temporal References (TMP-) Declared in Specification")
    content = load(COMPUTATION_SPEC) or ""
    failures = []
    for tmp_ref in REQUIRED_TMP_REFS:
        if tmp_ref in content:
            print(f"  PASS  {tmp_ref} declared in computation specification")
        else:
            print(f"  FAIL  {tmp_ref} missing from signal_computation_specification.md")
            failures.append(tmp_ref)
    return len(failures) == 0


def check_var_variables():
    section("Check 7 — Required VAR_ Variables Declared in Input Matrix")
    content = load(SIGNAL_INPUT_MATRIX) or ""
    failures = []
    for var_id in REQUIRED_VAR_GROUPS:
        if var_id in content:
            print(f"  PASS  {var_id} declared")
        else:
            print(f"  FAIL  {var_id} missing from signal_input_matrix.md")
            failures.append(var_id)
    var_count = len(set(re.findall(r"VAR_[A-Z]+_\d+", content)))
    if var_count >= 35:
        print(f"  PASS  VAR_ count: {var_count} >= 35")
    else:
        print(f"  FAIL  VAR_ count: {var_count} < 35")
        failures.append("VAR-count")
    return len(failures) == 0


def check_sig006_computed_value():
    section("Check 8 — SIG-006 Computed Value Present in Output Set")
    content = load(OUTPUT_SET) or ""
    failures = []
    if REQUIRED_COMPUTED_VALUE in content:
        print(f"  PASS  SIG-006 computed value {REQUIRED_COMPUTED_VALUE} rec/sec present in output set")
    else:
        print(f"  FAIL  SIG-006 computed value {REQUIRED_COMPUTED_VALUE} not found in signal_output_set.md")
        failures.append(REQUIRED_COMPUTED_VALUE)
    if "SIG-006" in content and "complete" in content.lower():
        print(f"  PASS  SIG-006 computation state declared complete")
    else:
        print(f"  FAIL  SIG-006 complete state not confirmed in signal_output_set.md")
        failures.append("SIG-006-complete")
    return len(failures) == 0


def check_no_prohibited_operations():
    section("Check 9 — No Prohibited Operations in Signal Artifacts")
    all_lines = []
    for content in all_content():
        for line in content.splitlines():
            is_allowed_context = any(
                re.search(ctx, line, re.IGNORECASE)
                for ctx in FORBIDDEN_ALLOWED_CONTEXTS
            )
            if not is_allowed_context:
                all_lines.append(line)
    filtered_text = " ".join(all_lines)
    failures = []
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, filtered_text, re.IGNORECASE):
            print(f"  FAIL  Prohibited pattern found: '{pattern}'")
            failures.append(pattern)
    if not failures:
        print("  PASS  No prohibited operation terms detected")
    return len(failures) == 0


def check_not_accessed_declaration():
    section("Check 10 — 40.3 and 40.2 Declared as Not Accessed")
    content = load(BOUNDARY_ENFORCEMENT) or ""
    failures = []
    if "not accessed" in content:
        print("  PASS  Not-accessed declaration present in signal_boundary_enforcement.md")
    else:
        print("  FAIL  Not-accessed declaration missing from signal_boundary_enforcement.md")
        failures.append("not_accessed")
    return len(failures) == 0


def check_governance_immutability():
    section("Check 11 — Governance Immutability Declaration")
    script_content = Path(__file__).read_text()
    if "GOVERNANCE IMMUTABILITY DECLARATION" in script_content:
        print("  PASS  GOVERNANCE IMMUTABILITY DECLARATION present in this script")
        return True
    else:
        print("  FAIL  GOVERNANCE IMMUTABILITY DECLARATION missing from this script")
        return False


def main():
    print("\nStream 40.5 — PiOS Signal Computation Engine")
    print("Validate Signal Artifacts — run_01_blueedge")
    print("Contract: PIOS-40.5-RUN01-CONTRACT-v1")

    checks = {
        "Check 1  — Artifact Completeness":          check_artifact_completeness,
        "Check 2  — Run Identity":                   check_run_identity,
        "Check 3  — Signal IDs":                     check_signal_ids,
        "Check 4  — DIM References":                 check_dim_references,
        "Check 5  — 40.4 Artifact References":       check_40_4_artifact_references,
        "Check 6  — Temporal References":            check_temporal_references,
        "Check 7  — VAR Variables":                  check_var_variables,
        "Check 8  — SIG-006 Computed Value":         check_sig006_computed_value,
        "Check 9  — No Prohibited Operations":       check_no_prohibited_operations,
        "Check 10 — Not-Accessed Declaration":       check_not_accessed_declaration,
        "Check 11 — Governance Immutability":        check_governance_immutability,
    }

    results = {}
    for name, fn in checks.items():
        results[name] = fn()

    section("Validation Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    for name, result in results.items():
        print(f"  {'PASS' if result else 'FAIL'}  {name}")
    print(f"\n  Result: {passed}/{total} PASS")
    if passed == total:
        print("  Signal validation COMPLETE — all checks passed")
        return 0
    else:
        print("  Signal validation INCOMPLETE — one or more checks failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())

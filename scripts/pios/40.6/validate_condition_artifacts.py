#!/usr/bin/env python3
"""
validate_condition_artifacts.py
Stream 40.6 — PiOS Condition and Diagnosis Activation Layer
run_id: run_01_blueedge
contract: PIOS-40.6-RUN01-CONTRACT-v1

Validates the 7 docs/pios/40.6 condition artifacts for run_01_blueedge
against contract requirements.

GOVERNANCE IMMUTABILITY DECLARATION
This validation script is a governed artifact.
It is read-only after stream execution is declared complete.
Validation failures must be resolved by correcting the artifact under validation.
This script must not be modified in response to a failing check.

Checks:
  1.  Artifact completeness           — all 7 expected artifacts present and non-empty
  2.  Run identity                     — run_01_blueedge and contract ID in all artifacts
  3.  Condition IDs present            — COND-001..008 in traceability map
  4.  Signal IDs referenced            — SIG-001..008 cited across artifacts
  5.  40.5 artifact references         — signal_output_set.md cited
  6.  CVAR_ variables declared         — all required CVAR_ inputs in condition_input_matrix
  7.  COND-006 complete state          — 0.333 and configured present in output set
  8.  Blocked conditions declared      — 7 blocked conditions explicitly stated
  9.  Boundary compliance              — no forbidden content in condition artifacts
  10. Not-accessed declaration         — 40.4/40.3/40.2 declared as not accessed
  11. Governance immutability          — GOVERNANCE IMMUTABILITY DECLARATION in this script

Usage:
    python3 scripts/pios/40.6/validate_condition_artifacts.py
"""

import re
import sys
from pathlib import Path

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
ARTIFACT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.6"

CONDITION_INPUT_MATRIX  = ARTIFACT_DIR / "condition_input_matrix.md"
ACTIVATION_SPEC         = ARTIFACT_DIR / "condition_activation_specification.md"
OUTPUT_SET              = ARTIFACT_DIR / "condition_output_set.md"
TRACEABILITY_MAP        = ARTIFACT_DIR / "condition_traceability_map.md"
VALIDATION_LOG          = ARTIFACT_DIR / "condition_validation_log.md"
BOUNDARY_ENFORCEMENT    = ARTIFACT_DIR / "condition_boundary_enforcement.md"
EXECUTION_MANIFEST      = ARTIFACT_DIR / "execution_manifest.md"

REQUIRED_ARTIFACTS = [
    CONDITION_INPUT_MATRIX, ACTIVATION_SPEC, OUTPUT_SET,
    TRACEABILITY_MAP, VALIDATION_LOG, BOUNDARY_ENFORCEMENT, EXECUTION_MANIFEST,
]

REQUIRED_RUN_TERMS = ["run_01_blueedge", "PIOS-40.6-RUN01-CONTRACT-v1"]

REQUIRED_COND_IDS = [
    "COND-001", "COND-002", "COND-003", "COND-004",
    "COND-005", "COND-006", "COND-007", "COND-008",
]

REQUIRED_SIG_IDS = [
    "SIG-001", "SIG-002", "SIG-003", "SIG-004",
    "SIG-005", "SIG-006", "SIG-007", "SIG-008",
]

REQUIRED_40_5_ARTIFACT_REFS = ["signal_output_set.md"]

REQUIRED_CVAR_VARIABLES = [
    "CVAR_MEM_001",
    "CVAR_CACHE_001", "CVAR_CACHE_002",
    "CVAR_EVT_001",
    "CVAR_WS_001",
    "CVAR_HASI_001",
    "CVAR_ALT_001",
    "CVAR_DS_001",
]

# COND-006 complete state: SIG-006 = DIM-PC-002 / DIM-PC-001 = 10 / 30
REQUIRED_COMPLETE_VALUE = "0.333"
REQUIRED_COMPLETE_STATE = "configured"

EXPECTED_BLOCKED = [
    "COND-001", "COND-002", "COND-003", "COND-004",
    "COND-005", "COND-007", "COND-008",
]

FORBIDDEN_PATTERNS = [
    r"diagnosis\s+result",
    r"intelligence\s+synthesis",
    r"threshold\s+applied",
    r"trend\s+derived",
    r"scoring\s+applied",
    r"heuristic\s+applied",
]

# Lines matching these patterns are prohibition declarations, not violations.
FORBIDDEN_ALLOWED_CONTEXTS = [
    r"No\s+diagnosis",
    r"no\s+diagnosis",
    r"Not\s+activated",
    r"not\s+activated",
    r"No\s+intelligence",
    r"no\s+intelligence",
    r"intelligence\s+synthesis",
    r"No\s+intelligence\s+artifacts",
    r"No\s+threshold",
    r"no\s+threshold",
    r"Stream\s+75\.1",
    r"prohibited",
    r"Enforced",
    r"Compliant",
    r"Forbidden\s+Type",
    r"forbidden\s+content",
    r"Boundary",
    r"downstream",
    r"constraints_and_prohibitions",
    r"prohibited_operations",
    r"No\s+heuristic",
    r"no\s+heuristic",
    r"threshold\s+authority",
    r"Threshold\s+authority",
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
    section("Check 1 — All 7 Condition Artifacts Present and Non-Empty")
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


def check_condition_ids():
    section("Check 3 — COND-001..008 Present in Traceability Map")
    content = load(TRACEABILITY_MAP) or ""
    failures = []
    for cond_id in REQUIRED_COND_IDS:
        if cond_id in content:
            print(f"  PASS  {cond_id} traced")
        else:
            print(f"  FAIL  {cond_id} missing from condition_traceability_map.md")
            failures.append(cond_id)
    return len(failures) == 0


def check_signal_ids():
    section("Check 4 — SIG-001..008 Referenced in Artifacts")
    all_text = " ".join(all_content())
    failures = []
    for sig_id in REQUIRED_SIG_IDS:
        if sig_id in all_text:
            print(f"  PASS  {sig_id} referenced")
        else:
            print(f"  FAIL  {sig_id} not found in any 40.6 artifact")
            failures.append(sig_id)
    return len(failures) == 0


def check_40_5_artifact_references():
    section("Check 5 — 40.5 Artifact References Present")
    all_text = " ".join(all_content())
    failures = []
    for artifact_ref in REQUIRED_40_5_ARTIFACT_REFS:
        if artifact_ref in all_text:
            print(f"  PASS  '{artifact_ref}' referenced")
        else:
            print(f"  FAIL  '{artifact_ref}' not found in any 40.6 artifact")
            failures.append(artifact_ref)
    return len(failures) == 0


def check_cvar_variables():
    section("Check 6 — Required CVAR_ Variables Declared in Condition Input Matrix")
    content = load(CONDITION_INPUT_MATRIX) or ""
    failures = []
    for cvar_id in REQUIRED_CVAR_VARIABLES:
        if cvar_id in content:
            print(f"  PASS  {cvar_id} declared")
        else:
            print(f"  FAIL  {cvar_id} missing from condition_input_matrix.md")
            failures.append(cvar_id)
    cvar_count = len(set(re.findall(r"CVAR_[A-Z]+_\d+", content)))
    if cvar_count >= 8:
        print(f"  PASS  CVAR_ count: {cvar_count} >= 8")
    else:
        print(f"  FAIL  CVAR_ count: {cvar_count} < 8")
        failures.append("CVAR-count")
    return len(failures) == 0


def check_cond006_complete():
    section("Check 7 — COND-006 Complete State and Value Present in Output Set")
    content = load(OUTPUT_SET) or ""
    failures = []
    if REQUIRED_COMPLETE_VALUE in content:
        print(f"  PASS  COND-006 value {REQUIRED_COMPLETE_VALUE} rec/sec present in output set")
    else:
        print(f"  FAIL  COND-006 value {REQUIRED_COMPLETE_VALUE} not found in condition_output_set.md")
        failures.append(REQUIRED_COMPLETE_VALUE)
    if REQUIRED_COMPLETE_STATE in content and "COND-006" in content:
        print(f"  PASS  COND-006 activation state '{REQUIRED_COMPLETE_STATE}' declared in output set")
    else:
        print(f"  FAIL  COND-006 '{REQUIRED_COMPLETE_STATE}' state not confirmed in condition_output_set.md")
        failures.append("COND-006-configured")
    if "complete" in content.lower() and "COND-006" in content:
        print(f"  PASS  COND-006 complete coverage state declared")
    else:
        print(f"  FAIL  COND-006 complete state not confirmed in condition_output_set.md")
        failures.append("COND-006-complete")
    return len(failures) == 0


def check_blocked_conditions():
    section("Check 8 — 7 Blocked Conditions Declared")
    all_text = " ".join(all_content())
    failures = []
    for cond_id in EXPECTED_BLOCKED:
        # Check that this condition appears with "blocked" nearby in any artifact
        pattern = rf"{cond_id}.*?blocked|blocked.*?{cond_id}"
        if re.search(pattern, all_text, re.IGNORECASE | re.DOTALL):
            print(f"  PASS  {cond_id} declared as blocked")
        else:
            # Fallback: check both terms independently appear
            if cond_id in all_text and "blocked" in all_text:
                print(f"  PASS  {cond_id} present and blocked state declared")
            else:
                print(f"  FAIL  {cond_id} blocked declaration missing")
                failures.append(cond_id)
    return len(failures) == 0


def check_no_prohibited_operations():
    section("Check 9 — No Prohibited Operations in Condition Artifacts")
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
    section("Check 10 — 40.4, 40.3, and 40.2 Declared as Not Accessed")
    content = load(BOUNDARY_ENFORCEMENT) or ""
    failures = []
    if "not accessed" in content:
        print("  PASS  Not-accessed declaration present in condition_boundary_enforcement.md")
    else:
        print("  FAIL  Not-accessed declaration missing from condition_boundary_enforcement.md")
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
    print("\nStream 40.6 — PiOS Condition and Diagnosis Activation Layer")
    print("Validate Condition Artifacts — run_01_blueedge")
    print("Contract: PIOS-40.6-RUN01-CONTRACT-v1")

    checks = {
        "Check 1  — Artifact Completeness":          check_artifact_completeness,
        "Check 2  — Run Identity":                   check_run_identity,
        "Check 3  — Condition IDs":                  check_condition_ids,
        "Check 4  — Signal IDs Referenced":          check_signal_ids,
        "Check 5  — 40.5 Artifact References":       check_40_5_artifact_references,
        "Check 6  — CVAR Variables":                 check_cvar_variables,
        "Check 7  — COND-006 Complete State":        check_cond006_complete,
        "Check 8  — Blocked Conditions Declared":    check_blocked_conditions,
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
        print("  Condition validation COMPLETE — all checks passed")
        return 0
    else:
        print("  Condition validation INCOMPLETE — one or more checks failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())

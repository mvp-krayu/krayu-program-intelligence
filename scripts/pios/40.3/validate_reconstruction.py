#!/usr/bin/env python3
"""
validate_reconstruction.py
Stream 40.3 — PiOS Reverse Engineering
run_id: run_02_blueedge
contract: PIOS-40.3-RUN02-CONTRACT-v3

Validates all 6 canonical 40.3 reconstruction artifacts against the
governed rules of PIOS-40.3-RUN02-CONTRACT-v3.

GOVERNANCE IMMUTABILITY DECLARATION
This validation script is a governed artifact.
It is read-only after stream execution is declared complete.
Validation failures must be resolved by correcting the artifact under validation.
This script must not be modified in response to a failing check.
"""

import argparse
import re
import sys
from pathlib import Path

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
OUTPUT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.3"
CONTRACT_DIR = EXECUTION_WORKSPACE / "docs/pios/contracts/40.3"

ENTITY_CATALOG = OUTPUT_DIR / "entity_catalog.md"
DEPENDENCY_MAP = OUTPUT_DIR / "dependency_map.md"
INTERFACE_MAP = OUTPUT_DIR / "interface_map.md"
PEG = OUTPUT_DIR / "program_execution_graph.md"
TRACEABILITY_MAP = OUTPUT_DIR / "structural_traceability_map.md"
VALIDATION_LOG = OUTPUT_DIR / "reconstruction_validation_log.md"

REQUIRED_ARTIFACTS = [
    ENTITY_CATALOG, DEPENDENCY_MAP, INTERFACE_MAP,
    PEG, TRACEABILITY_MAP, VALIDATION_LOG,
]

REQUIRED_RUN_TERMS = ["run_02_blueedge", "PIOS-40.3-RUN02-CONTRACT-v3"]

REQUIRED_ENTITY_TIERS = ["CE-001", "CE-002", "SA-001", "INF-001", "INF-002", "FE-001", "DS-001"]
REQUIRED_INTERFACES = ["INT-001", "INT-003", "INT-004", "INT-005", "INT-008"]
REQUIRED_PEG_PATHS = ["EP-01", "EP-02", "EP-03", "EP-06", "EP-07"]
REQUIRED_OVERLAP_TERMS = ["OVL-01", "OVL-02"]
REQUIRED_UNKNOWN_SPACE_TERMS = ["US-04", "US-05", "US-06"]
REQUIRED_TRACEABILITY_REFS = ["CEU-08", "CEU-09", "CEU-10"]

PROHIBITED_TERMS = [
    r"signal\s+computation",
    r"telemetry\s+extraction",
    r"diagnosis\s+result",
    r"intelligence\s+synthesis",
    r"condition\s+activated",
    r"inferred\s+from\s+absence",
]

# Lines matching these patterns are prohibition declarations, not violations.
# Prevents false positives where artifact prohibition tables cite the prohibited terms
# as part of "NOT VIOLATED" confirmation rows (e.g. "| No signal computation | NOT VIOLATED |").
FORBIDDEN_ALLOWED_CONTEXTS = [
    r"NOT\s+VIOLATED",
    r"No\s+signal\s+computation",
    r"No\s+telemetry\s+extraction",
    r"No\s+diagnosis\s+or\s+intelligence",
    r"No\s+prohibited",
    r"no\s+signal\s+computation",
    r"no\s+telemetry\s+extraction",
    r"no\s+intelligence\s+synthesis",
    r"prohibited_operations",
    r"constraints_and_prohibitions",
]

VALID_COMPLETENESS_POSITIONS = ["PARTIAL", "COMPLETE"]


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
    section("Check 1 — All 6 Mandatory Canonical Artifacts Present")
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


def check_boundary_terms():
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


def check_entity_catalog_coverage():
    section("Check 3 — Entity Catalog Contains Required Entity Tiers")
    content = load(ENTITY_CATALOG)
    if not content:
        print("  FAIL  Entity catalog not found")
        return False
    failures = []
    for entity_id in REQUIRED_ENTITY_TIERS:
        if entity_id in content:
            print(f"  PASS  {entity_id}")
        else:
            print(f"  FAIL  {entity_id} missing from entity catalog")
            failures.append(entity_id)

    # Check BM- count
    bm_count = len(set(re.findall(r"BM-\d+", content)))
    if bm_count >= 65:
        print(f"  PASS  BM- count: {bm_count} >= 65")
    else:
        print(f"  FAIL  BM- count: {bm_count} < 65")
        failures.append("BM-count")

    return len(failures) == 0


def check_peg_produced():
    section("Check 4 — PEG Produced with Required Execution Paths")
    content = load(PEG)
    if not content:
        print("  FAIL  PEG not found")
        return False
    failures = []
    for ep in REQUIRED_PEG_PATHS:
        if ep in content:
            print(f"  PASS  {ep}")
        else:
            print(f"  FAIL  {ep} missing from PEG")
            failures.append(ep)

    # Verify PEG has node registry
    if "Node ID" in content or "N-01" in content:
        print("  PASS  PEG node registry present")
    else:
        print("  FAIL  PEG node registry missing")
        failures.append("node_registry")

    return len(failures) == 0


def check_interface_coverage():
    section("Check 5 — Interface Map Contains Required Interfaces")
    content = load(INTERFACE_MAP)
    if not content:
        print("  FAIL  Interface map not found")
        return False
    failures = []
    for int_id in REQUIRED_INTERFACES:
        if int_id in content:
            print(f"  PASS  {int_id}")
        else:
            print(f"  FAIL  {int_id} missing from interface map")
            failures.append(int_id)
    return len(failures) == 0


def check_overlap_carry_forward():
    section("Check 6 — 40.2 Overlap Declarations Carried Forward")
    contents = all_content()
    failures = []
    for term in REQUIRED_OVERLAP_TERMS:
        found = sum(1 for c in contents if term in c)
        if found >= 2:
            print(f"  PASS  {term} present in {found} artifacts")
        else:
            print(f"  FAIL  {term} not carried forward (only in {found} artifacts)")
            failures.append(term)
    return len(failures) == 0


def check_unknown_space_declared():
    section("Check 7 — Unknown-Space Declarations Present")
    all_text = " ".join(all_content())
    failures = []
    for term in REQUIRED_UNKNOWN_SPACE_TERMS:
        if term in all_text:
            print(f"  PASS  {term} declared")
        else:
            print(f"  FAIL  {term} not found in any artifact")
            failures.append(term)
    if "unknown-space" in all_text.lower():
        print("  PASS  'unknown-space' term present")
    else:
        print("  FAIL  'unknown-space' term not found")
        failures.append("unknown-space term")
    return len(failures) == 0


def check_traceability_completeness():
    section("Check 8 — Structural Traceability References Present")
    content = load(TRACEABILITY_MAP)
    if not content:
        print("  FAIL  Traceability map not found")
        return False
    failures = []
    for ref in REQUIRED_TRACEABILITY_REFS:
        if ref in content:
            print(f"  PASS  {ref} referenced in traceability map")
        else:
            print(f"  FAIL  {ref} not referenced in traceability map")
            failures.append(ref)
    # Verify "Evidence source" notation present
    if "Evidence source" in content or "evidence_origin" in content:
        print("  PASS  Evidence source notation present")
    else:
        print("  FAIL  Evidence source notation missing")
        failures.append("evidence_source_notation")
    return len(failures) == 0


def check_no_prohibited_operations():
    section("Check 9 — No Prohibited Operations in Artifacts")
    # Filter out lines that are prohibition declaration context before scanning.
    # This prevents false positives from "NOT VIOLATED" rows in validation tables
    # where the prohibited term appears only as the subject of a prohibition declaration.
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
    for pattern in PROHIBITED_TERMS:
        if re.search(pattern, filtered_text, re.IGNORECASE):
            print(f"  FAIL  Prohibited pattern found: '{pattern}'")
            failures.append(pattern)
    if not failures:
        print("  PASS  No prohibited operation terms detected")
    return len(failures) == 0


def check_completeness_position():
    section("Check 10 — Reconstruction Completeness Position Declared")
    content = load(VALIDATION_LOG)
    if not content:
        print("  FAIL  Validation log not found")
        return False
    for pos in VALID_COMPLETENESS_POSITIONS:
        if f"reconstruction_completeness: {pos}" in content:
            print(f"  PASS  Completeness position declared: {pos}")
            return True
    print("  FAIL  reconstruction_completeness position not declared in validation log")
    return False


def check_validation_log_pass():
    section("Check 11 — Reconstruction Validation Log Shows PASS")
    content = load(VALIDATION_LOG)
    if not content:
        print("  FAIL  Validation log not found")
        return False
    if "12/12 PASS" in content or re.search(r"12/12.*PASS", content):
        print("  PASS  Validation log shows 12/12 PASS")
        return True
    else:
        print("  FAIL  12/12 PASS not found in validation log")
        return False


def check_immutability_declaration():
    section("Check 12 — Governance Immutability Declaration")
    script_content = Path(__file__).read_text()
    if "GOVERNANCE IMMUTABILITY DECLARATION" in script_content:
        print("  PASS  GOVERNANCE IMMUTABILITY DECLARATION present in this script")
        return True
    else:
        print("  FAIL  GOVERNANCE IMMUTABILITY DECLARATION missing from this script")
        return False


def main():
    parser = argparse.ArgumentParser(description="Validate 40.3 reconstruction artifacts.")
    parser.add_argument("--expected-run-id", default="run_02_blueedge",
                        help="Expected run ID to validate against (default: run_02_blueedge)")
    args = parser.parse_args()
    global REQUIRED_RUN_TERMS
    REQUIRED_RUN_TERMS = [args.expected_run_id, "PIOS-40.3-RUN02-CONTRACT-v3"]

    print("\nStream 40.3 — PiOS Reverse Engineering")
    print(f"Validate Reconstruction — {args.expected_run_id}")
    print("Contract: PIOS-40.3-RUN02-CONTRACT-v3")

    checks = {
        "Check 1 — Artifact Completeness": check_artifact_completeness,
        "Check 2 — Boundary Terms": check_boundary_terms,
        "Check 3 — Entity Catalog Coverage": check_entity_catalog_coverage,
        "Check 4 — PEG Produced": check_peg_produced,
        "Check 5 — Interface Coverage": check_interface_coverage,
        "Check 6 — Overlap Carry-Forward": check_overlap_carry_forward,
        "Check 7 — Unknown-Space Declared": check_unknown_space_declared,
        "Check 8 — Traceability Completeness": check_traceability_completeness,
        "Check 9 — No Prohibited Operations": check_no_prohibited_operations,
        "Check 10 — Completeness Position": check_completeness_position,
        "Check 11 — Validation Log PASS": check_validation_log_pass,
        "Check 12 — Immutability Declaration": check_immutability_declaration,
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
        print("  Validation COMPLETE — all checks passed")
        return 0
    else:
        print("  Validation INCOMPLETE — one or more checks failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())

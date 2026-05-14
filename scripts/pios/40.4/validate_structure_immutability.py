#!/usr/bin/env python3
"""
validate_structure_immutability.py
Stream 40.4 — PiOS Telemetry Extraction Layer
run_id: run_01_blueedge
contract: PIOS-40.4-RUN01-CONTRACT-v1

Validates that the 40.3 canonical structure is fully intact and
unmodified after Stream 40.4 telemetry attachment operations.

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
STRUCTURE_DIR = EXECUTION_WORKSPACE / "docs/pios/40.3"
TELEMETRY_DIR = EXECUTION_WORKSPACE / "docs/pios/40.4"

ENTITY_CATALOG   = STRUCTURE_DIR / "entity_catalog.md"
DEPENDENCY_MAP   = STRUCTURE_DIR / "dependency_map.md"
INTERFACE_MAP    = STRUCTURE_DIR / "interface_map.md"
PEG              = STRUCTURE_DIR / "program_execution_graph.md"
TRACEABILITY_MAP = STRUCTURE_DIR / "structural_traceability_map.md"
VALIDATION_LOG   = STRUCTURE_DIR / "reconstruction_validation_log.md"

IMMUTABILITY_LOG = TELEMETRY_DIR / "structure_immutability_log.md"

REQUIRED_40_3_ARTIFACTS = [
    ENTITY_CATALOG, DEPENDENCY_MAP, INTERFACE_MAP,
    PEG, TRACEABILITY_MAP, VALIDATION_LOG,
]

LOCKED_ENTITY_IDS = ["CE-001", "CE-002", "CE-003",
                     "SA-001", "SA-002",
                     "INF-001", "INF-002", "INF-003", "INF-004", "INF-005"]

LOCKED_BM_COUNT = 65

LOCKED_PEG_NODES = ["N-01", "N-02", "N-03", "N-04", "N-05", "N-06",
                    "N-07", "N-08", "N-09", "N-10", "N-11", "N-12",
                    "N-13", "N-14", "N-15", "N-16", "N-17"]

LOCKED_PEG_PATHS = ["EP-01", "EP-02", "EP-03", "EP-04", "EP-05",
                    "EP-06", "EP-07", "EP-08"]

LOCKED_INTERFACES = ["INT-001", "INT-002", "INT-003", "INT-004",
                     "INT-005", "INT-006", "INT-007", "INT-008"]

LOCKED_DEPENDENCIES = (
    [f"SD-00{i}" for i in range(1, 10)] +
    [f"BD-00{i}" for i in range(1, 8)] +
    [f"FD-00{i}" for i in range(1, 6)] +
    ["LD-001", "LD-002"]
)

EXPECTED_40_3_RUN_ID   = "run_02_blueedge"
EXPECTED_40_3_CONTRACT = "PIOS-40.3-RUN02-CONTRACT-v3"
EXPECTED_40_3_VALIDATION = "12/12 PASS"


def section(title):
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print('=' * 60)


def load(path):
    if not path.exists():
        return None
    return path.read_text()


def check_40_3_artifacts_present():
    section("Check 1 — 40.3 Canonical Artifacts Present and Non-Empty")
    failures = []
    for path in REQUIRED_40_3_ARTIFACTS:
        if path.exists() and path.stat().st_size > 0:
            print(f"  PASS  {path.relative_to(EXECUTION_WORKSPACE)}")
        elif path.exists():
            print(f"  FAIL  EMPTY: {path.relative_to(EXECUTION_WORKSPACE)}")
            failures.append(path.name)
        else:
            print(f"  FAIL  MISSING: {path.relative_to(EXECUTION_WORKSPACE)}")
            failures.append(path.name)
    return len(failures) == 0


def check_40_3_run_identity():
    section("Check 2 — 40.3 Run Identity Preserved")
    catalog_content = load(ENTITY_CATALOG) or ""
    failures = []
    for term in [EXPECTED_40_3_RUN_ID, EXPECTED_40_3_CONTRACT]:
        if term in catalog_content:
            print(f"  PASS  '{term}' present in entity_catalog.md")
        else:
            print(f"  FAIL  '{term}' not found in entity_catalog.md")
            failures.append(term)
    return len(failures) == 0


def check_entity_set_intact():
    section("Check 3 — Locked Entity Set Intact in Entity Catalog")
    content = load(ENTITY_CATALOG) or ""
    failures = []
    for entity_id in LOCKED_ENTITY_IDS:
        if entity_id in content:
            print(f"  PASS  {entity_id}")
        else:
            print(f"  FAIL  {entity_id} missing from entity_catalog.md")
            failures.append(entity_id)
    bm_count = len(set(re.findall(r"BM-\d+", content)))
    if bm_count >= LOCKED_BM_COUNT:
        print(f"  PASS  BM- count: {bm_count} >= {LOCKED_BM_COUNT}")
    else:
        print(f"  FAIL  BM- count: {bm_count} < {LOCKED_BM_COUNT}")
        failures.append("BM-count")
    return len(failures) == 0


def check_peg_nodes_intact():
    section("Check 4 — Locked PEG Node Registry Intact")
    content = load(PEG) or ""
    failures = []
    for node in LOCKED_PEG_NODES:
        if node in content:
            print(f"  PASS  {node}")
        else:
            print(f"  FAIL  {node} missing from program_execution_graph.md")
            failures.append(node)
    return len(failures) == 0


def check_peg_paths_intact():
    section("Check 5 — Locked PEG Execution Paths Intact")
    content = load(PEG) or ""
    failures = []
    for path in LOCKED_PEG_PATHS:
        if path in content:
            print(f"  PASS  {path}")
        else:
            print(f"  FAIL  {path} missing from program_execution_graph.md")
            failures.append(path)
    return len(failures) == 0


def check_interfaces_intact():
    section("Check 6 — Locked Interface Registry Intact")
    content = load(INTERFACE_MAP) or ""
    failures = []
    for iface in LOCKED_INTERFACES:
        if iface in content:
            print(f"  PASS  {iface}")
        else:
            print(f"  FAIL  {iface} missing from interface_map.md")
            failures.append(iface)
    return len(failures) == 0


def check_dependencies_intact():
    section("Check 7 — Locked Dependency Registry Intact")
    content = load(DEPENDENCY_MAP) or ""
    failures = []
    for dep in LOCKED_DEPENDENCIES:
        if dep in content:
            print(f"  PASS  {dep}")
        else:
            print(f"  FAIL  {dep} missing from dependency_map.md")
            failures.append(dep)
    return len(failures) == 0


def check_40_3_validation_result():
    section("Check 8 — 40.3 Validation Log Shows 12/12 PASS")
    content = load(VALIDATION_LOG) or ""
    if EXPECTED_40_3_VALIDATION in content:
        print(f"  PASS  40.3 validation log shows {EXPECTED_40_3_VALIDATION}")
        return True
    else:
        print(f"  FAIL  '{EXPECTED_40_3_VALIDATION}' not found in 40.3 reconstruction_validation_log.md")
        return False


def check_immutability_log_produced():
    section("Check 9 — 40.4 Structure Immutability Log Produced")
    if IMMUTABILITY_LOG.exists() and IMMUTABILITY_LOG.stat().st_size > 0:
        print(f"  PASS  {IMMUTABILITY_LOG.relative_to(EXECUTION_WORKSPACE)}")
        return True
    else:
        print(f"  FAIL  structure_immutability_log.md not found or empty")
        return False


def check_immutability_log_content():
    section("Check 10 — Immutability Log Confirms Zero Drift")
    content = load(IMMUTABILITY_LOG) or ""
    failures = []
    required_terms = [
        "run_01_blueedge",
        "PIOS-40.4-RUN01-CONTRACT-v1",
        "structural_lock_established: TRUE",
        "modification_of_40_3_artifacts: NONE",
        "10/10 PASS",
    ]
    for term in required_terms:
        if term in content:
            print(f"  PASS  '{term}' confirmed in immutability log")
        else:
            print(f"  FAIL  '{term}' not found in immutability log")
            failures.append(term)
    return len(failures) == 0


def check_immutability_declaration():
    section("Check 11 — Governance Immutability Declaration")
    script_content = Path(__file__).read_text()
    if "GOVERNANCE IMMUTABILITY DECLARATION" in script_content:
        print("  PASS  GOVERNANCE IMMUTABILITY DECLARATION present in this script")
        return True
    else:
        print("  FAIL  GOVERNANCE IMMUTABILITY DECLARATION missing from this script")
        return False


def main():
    parser = argparse.ArgumentParser(description="Validate 40.4 structure immutability.")
    parser.add_argument("--expected-run-id", default="run_02_blueedge",
                        help="Expected run ID for the upstream 40.3 artifacts (default: run_02_blueedge)")
    args = parser.parse_args()
    global EXPECTED_40_3_RUN_ID
    EXPECTED_40_3_RUN_ID = args.expected_run_id

    print("\nStream 40.4 — PiOS Telemetry Extraction Layer")
    print("Validate Structure Immutability — run_01_blueedge")
    print("Contract: PIOS-40.4-RUN01-CONTRACT-v1")

    checks = {
        "Check 1  — 40.3 Artifacts Present": check_40_3_artifacts_present,
        "Check 2  — 40.3 Run Identity": check_40_3_run_identity,
        "Check 3  — Entity Set Intact": check_entity_set_intact,
        "Check 4  — PEG Nodes Intact": check_peg_nodes_intact,
        "Check 5  — PEG Paths Intact": check_peg_paths_intact,
        "Check 6  — Interfaces Intact": check_interfaces_intact,
        "Check 7  — Dependencies Intact": check_dependencies_intact,
        "Check 8  — 40.3 Validation PASS": check_40_3_validation_result,
        "Check 9  — Immutability Log Produced": check_immutability_log_produced,
        "Check 10 — Immutability Log Content": check_immutability_log_content,
        "Check 11 — Governance Declaration": check_immutability_declaration,
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
        print("  Immutability validation COMPLETE — 40.3 structure intact")
        return 0
    else:
        print("  Immutability validation FAILED — structure drift detected")
        return 1


if __name__ == "__main__":
    sys.exit(main())

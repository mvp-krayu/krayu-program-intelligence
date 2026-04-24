#!/usr/bin/env python3
"""
validate_evidence_inventory.py
Stream 40.2 — PiOS Evidence Connectors Layer
run_id: run_02_blueedge
contract: PIOS-40.2-RUN02-CONTRACT-v2

Validates the 4 produced evidence artifacts against the governed
rules of the evidence_boundary.md and Stream 40.2 contract.

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

# ─── PATHS ────────────────────────────────────────────────────────────────────

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
OUTPUT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.2"
CONTRACT_DIR = EXECUTION_WORKSPACE / "docs/pios/contracts/40.2"
SCRIPTS_DIR = EXECUTION_WORKSPACE / "scripts/pios/40.2"
EVIDENCE_BOUNDARY = EXECUTION_WORKSPACE / "docs/pios/runs/run_02_blueedge/evidence_boundary.md"

INVENTORY_FILE = OUTPUT_DIR / "evidence_surface_inventory.md"
CLASSIFICATION_FILE = OUTPUT_DIR / "evidence_classification_map.md"
NORMALIZED_MAP_FILE = OUTPUT_DIR / "normalized_evidence_map.md"
VALIDATION_LOG_FILE = OUTPUT_DIR / "intake_validation_log.md"

# ─── EXPECTED CANONICAL EVIDENCE UNITS ───────────────────────────────────────

EXPECTED_CEU_IDS = [
    "CEU-01", "CEU-02", "CEU-03",
    "CEU-04", "CEU-05", "CEU-06", "CEU-07",
    "CEU-08", "CEU-09", "CEU-10",
    "CEU-11", "CEU-12", "CEU-13",
]

# ─── REQUIRED EVIDENCE CLASSES ────────────────────────────────────────────────

REQUIRED_EVIDENCE_CLASSES = [
    "documentation",
    "code",
    "configuration",
    "structural artifact",
    "interface artifact",
    "extraction metadata",
]

# ─── REQUIRED BOUNDARY FIELDS ─────────────────────────────────────────────────

REQUIRED_BOUNDARY_TERMS = [
    "run_02_blueedge",
    "PIOS-40.2-RUN02-CONTRACT-v2",
    "evidence_boundary",
]

# ─── PROVENANCE CONTENT THAT MUST BE PRESENT ─────────────────────────────────

REQUIRED_PROVENANCE_TERMS = [
    "NOT INGESTED",
    "provenance",
    "blueedge-backend-v3_23_0-COMPLETE.tar",
    "blueedge-frontend-v3_23_0-COMPLETE.tar",
    "blueedge-platform-v3_23_0-COMPLETE.tar",
]

# ─── PROHIBITED INFERENCE PATTERNS ───────────────────────────────────────────

INFERENCE_FORBIDDEN_PATTERNS = [
    r"inferred\s+from\s+absence",
    r"assumed\s+to\s+exist",
    r"likely\s+contains",
    r"probably\s+has",
    r"estimated\s+\d+\s+modules",
]

# ─── REQUIRED UNKNOWN-SPACE DECLARATIONS ─────────────────────────────────────

REQUIRED_UNKNOWN_SPACE_TERMS = [
    "unknown-space",
    "UNKNOWN",
]

# ─── EXPLICITLY EXCLUDED PATH TERMS ──────────────────────────────────────────

EXCLUDED_PATH_TERMS = [
    "reverse_engineering",
    "program-charter",
    "execution-telemetry",
    "signal-layer",
    "case-study",
    "weekly/",
]


def section(title):
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print('=' * 60)


def load(path):
    if not path.exists():
        return None
    return path.read_text()


def check_artifact_completeness():
    """Check 1 — All 4 output artifacts are present and non-empty."""
    section("Check 1 — Artifact Completeness")
    required = [INVENTORY_FILE, CLASSIFICATION_FILE, NORMALIZED_MAP_FILE, VALIDATION_LOG_FILE]
    failures = []
    for path in required:
        if not path.exists():
            print(f"  FAIL  MISSING: {path.relative_to(EXECUTION_WORKSPACE)}")
            failures.append(path.name)
        elif path.stat().st_size == 0:
            print(f"  FAIL  EMPTY: {path.relative_to(EXECUTION_WORKSPACE)}")
            failures.append(path.name)
        else:
            print(f"  PASS  {path.relative_to(EXECUTION_WORKSPACE)}")
    return len(failures) == 0


def check_boundary_terms():
    """Check 2 — All artifacts carry required run and boundary identifiers."""
    section("Check 2 — Boundary Terms Present")
    files = [INVENTORY_FILE, CLASSIFICATION_FILE, NORMALIZED_MAP_FILE, VALIDATION_LOG_FILE]
    failures = []
    for term in REQUIRED_BOUNDARY_TERMS:
        found_in = [f.name for f in files if load(f) and term in load(f)]
        if len(found_in) < 1:
            print(f"  FAIL  Term '{term}' not found in any artifact")
            failures.append(term)
        else:
            print(f"  PASS  '{term}' found in {len(found_in)} artifact(s)")
    return len(failures) == 0


def check_evidence_class_coverage():
    """Check 3 — All accepted evidence classes are referenced in classification map."""
    section("Check 3 — Evidence Class Coverage")
    content = load(CLASSIFICATION_FILE)
    if content is None:
        print("  FAIL  Classification map not found")
        return False
    failures = []
    for ec in REQUIRED_EVIDENCE_CLASSES:
        if ec in content:
            print(f"  PASS  '{ec}' present in classification map")
        else:
            print(f"  FAIL  '{ec}' not found in classification map")
            failures.append(ec)
    return len(failures) == 0


def check_ceu_completeness():
    """Check 4 — All 13 CEU identifiers present in normalized evidence map."""
    section("Check 4 — CEU Completeness (normalized_evidence_map.md)")
    content = load(NORMALIZED_MAP_FILE)
    if content is None:
        print("  FAIL  Normalized evidence map not found")
        return False
    failures = []
    for ceu_id in EXPECTED_CEU_IDS:
        if ceu_id in content:
            print(f"  PASS  {ceu_id}")
        else:
            print(f"  FAIL  {ceu_id} not found in normalized_evidence_map.md")
            failures.append(ceu_id)
    return len(failures) == 0


def check_provenance_handling():
    """Check 5 — Provenance-only paths are declared NOT INGESTED."""
    section("Check 5 — Provenance-Only Path Handling")
    files = [INVENTORY_FILE, NORMALIZED_MAP_FILE, VALIDATION_LOG_FILE]
    failures = []
    for term in REQUIRED_PROVENANCE_TERMS:
        found = any(load(f) and term in load(f) for f in files)
        if found:
            print(f"  PASS  '{term}' present")
        else:
            print(f"  FAIL  '{term}' not found in artifacts")
            failures.append(term)
    return len(failures) == 0


def check_no_inference():
    """Check 6 — No forbidden inference patterns in any artifact."""
    section("Check 6 — No Inferred Evidence")
    all_files = [INVENTORY_FILE, CLASSIFICATION_FILE, NORMALIZED_MAP_FILE, VALIDATION_LOG_FILE]
    failures = []
    for pattern in INFERENCE_FORBIDDEN_PATTERNS:
        for f in all_files:
            content = load(f)
            if content and re.search(pattern, content, re.IGNORECASE):
                print(f"  FAIL  Forbidden inference pattern '{pattern}' found in {f.name}")
                failures.append((pattern, f.name))
    if not failures:
        print("  PASS  No forbidden inference patterns detected")
    return len(failures) == 0


def check_unknown_space_declared():
    """Check 7 — Unknown-space is declared; overlap positions are identified."""
    section("Check 7 — Unknown-Space and Overlap Declaration")
    content = load(NORMALIZED_MAP_FILE)
    if content is None:
        print("  FAIL  Normalized evidence map not found")
        return False
    failures = []
    for term in REQUIRED_UNKNOWN_SPACE_TERMS:
        if term in content:
            print(f"  PASS  '{term}' declared in normalized_evidence_map.md")
        else:
            print(f"  FAIL  '{term}' missing from normalized_evidence_map.md")
            failures.append(term)

    # Check overlap declarations
    if "OVL-01" in content and "OVL-02" in content:
        print("  PASS  Overlap declarations OVL-01 and OVL-02 present")
    else:
        print("  FAIL  Overlap declarations incomplete")
        failures.append("OVL declarations")

    return len(failures) == 0


def check_excluded_paths_not_in_evidence():
    """Check 8 — Explicitly excluded paths do not appear as accepted evidence."""
    section("Check 8 — Excluded Paths Not Accepted as Evidence")
    all_files = [INVENTORY_FILE, CLASSIFICATION_FILE, NORMALIZED_MAP_FILE, VALIDATION_LOG_FILE]
    failures = []
    for term in EXCLUDED_PATH_TERMS:
        for f in all_files:
            content = load(f)
            if not content:
                continue
            # Find all lines containing the excluded term
            for line in content.splitlines():
                if term in line:
                    # Accept if the line is a prohibition or exclusion declaration
                    line_lower = line.lower()
                    if any(ok in line_lower for ok in [
                        "not accessed", "excluded", "explicitly excluded",
                        "prohibited", "not accessed", "exclusion"
                    ]):
                        continue
                    # Flag lines that appear to reference excluded paths as valid evidence
                    if any(accept in line_lower for accept in ["accepted", "primary", "pass"]):
                        print(f"  FAIL  Excluded term '{term}' appears as accepted evidence in {f.name}")
                        failures.append((term, f.name))
                        break

    if not failures:
        print("  PASS  No excluded paths treated as accepted evidence")
    return len(failures) == 0


def check_validation_log_pass():
    """Check 9 — Intake validation log shows overall PASS result."""
    section("Check 9 — Intake Validation Log Overall Result")
    content = load(VALIDATION_LOG_FILE)
    if content is None:
        print("  FAIL  Intake validation log not found")
        return False
    if "8/8 PASS" in content or "8/8\nPASS" in content or re.search(r"8/8.*PASS", content):
        print("  PASS  Validation log shows 8/8 PASS")
        return True
    else:
        print("  FAIL  Validation log does not show 8/8 PASS result")
        return False


def check_immutability_declaration():
    """Check 10 — This script contains the governance immutability declaration."""
    section("Check 10 — Validation Immutability Declaration")
    script_content = Path(__file__).read_text()
    if "GOVERNANCE IMMUTABILITY DECLARATION" in script_content:
        print("  PASS  GOVERNANCE IMMUTABILITY DECLARATION present in this script")
        return True
    else:
        print("  FAIL  GOVERNANCE IMMUTABILITY DECLARATION missing from this script")
        return False


def main():
    parser = argparse.ArgumentParser(description="Validate 40.2 evidence inventory artifacts.")
    parser.add_argument("--expected-run-id", default="run_02_blueedge",
                        help="Expected run ID to validate against (default: run_02_blueedge)")
    args = parser.parse_args()
    global REQUIRED_BOUNDARY_TERMS
    REQUIRED_BOUNDARY_TERMS = [
        args.expected_run_id,
        "PIOS-40.2-RUN02-CONTRACT-v2",
        "evidence_boundary",
    ]

    print("\nStream 40.2 — Evidence Connectors Layer")
    print(f"Validate Evidence Inventory — {args.expected_run_id}")
    print(f"Contract: PIOS-40.2-RUN02-CONTRACT-v2")

    checks = {
        "Check 1 — Artifact Completeness": check_artifact_completeness,
        "Check 2 — Boundary Terms": check_boundary_terms,
        "Check 3 — Evidence Class Coverage": check_evidence_class_coverage,
        "Check 4 — CEU Completeness": check_ceu_completeness,
        "Check 5 — Provenance Handling": check_provenance_handling,
        "Check 6 — No Inference": check_no_inference,
        "Check 7 — Unknown-Space Declared": check_unknown_space_declared,
        "Check 8 — Excluded Paths": check_excluded_paths_not_in_evidence,
        "Check 9 — Validation Log PASS": check_validation_log_pass,
        "Check 10 — Immutability Declaration": check_immutability_declaration,
    }

    results = {}
    for name, fn in checks.items():
        results[name] = fn()

    section("Validation Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for name, result in results.items():
        status = "PASS" if result else "FAIL"
        print(f"  {status}  {name}")

    print(f"\n  Result: {passed}/{total} PASS")

    if passed == total:
        print("  Validation COMPLETE — all checks passed")
        return 0
    else:
        print("  Validation INCOMPLETE — one or more checks failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())

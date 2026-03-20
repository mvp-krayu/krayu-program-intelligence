#!/usr/bin/env python3
"""
validate_link_normalization.py
PIOS-41.3-ADDENDUM-SCRIPT-RECOVERY-v1

Validates 41.3 Link Normalization Layer artifacts against acceptance criteria.

Canonical artifact : semantic_consolidation_report.md
Default input      : /tmp/pios_41_3_output/

Acceptance Criteria:
  AC-01  Required file present (semantic_consolidation_report.md)
  AC-02  Contract and run metadata present
  AC-03  Processing counts: 17 domains, 42 capabilities, 89 components
  AC-04  All 7 transformations (T1–T7) documented
  AC-05  All 9 validation rules present and marked ✓
  AC-06  Zero orphan nodes confirmed
  AC-07  Zero broken paths confirmed
  AC-08  Node total ≈ 148 confirmed (17+42+89)
  AC-09  Traversal test PASS with all 5 link hops confirmed
  AC-10  Summary status PASS and semantic content integrity confirmed

Usage:
  python3 validate_link_normalization.py                              # reads /tmp/pios_41_3_output
  python3 validate_link_normalization.py --input /tmp/pios_41_3_verify
  python3 validate_link_normalization.py --input /tmp/pios_41_3_verify --verbose
"""

import argparse
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPORT_FILE    = "semantic_consolidation_report.md"
CONTRACT_ID    = "PIOS-41.3-RUN01-CONTRACT-v1"
RUN_REFERENCE  = "run_01_blueedge"

# Transformation IDs expected in the report
TRANSFORMATION_IDS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7"]

# Validation rule rows expected in the Validation Results table
VALIDATION_RULES = [
    "total_domains",
    "total_capabilities",
    "total_components",
    "domain_to_capability_links",
    "capability_to_domain_links",
    "capability_to_component_links",
    "component_to_capability_links",
    "orphan_nodes",
    "broken_paths",
]

# Traversal hop confirmations
TRAVERSAL_CONFIRMATIONS = [
    "D_01 → [[C_01_Vehicle_Sensor_Collection]]: CONFIRMED",
    "C_01 → [[D_01_Edge_Data_Acquisition]]: CONFIRMED",
    "C_01 → [[CMP_73_sensor_collector_py]]: CONFIRMED",
    "CMP_73 → [[C_01_Vehicle_Sensor_Collection]]: CONFIRMED",
    "CMP_73 → [[D_01_Edge_Data_Acquisition]]: CONFIRMED",
]


# ---------------------------------------------------------------------------
# Result tracking
# ---------------------------------------------------------------------------

class ValidationResult:
    def __init__(self, ac_id: str, description: str):
        self.ac_id       = ac_id
        self.description = description
        self.passed      = False
        self.details: list[str] = []

    def pass_(self, detail: str = ""):
        self.passed = True
        if detail:
            self.details.append(f"  PASS  {detail}")

    def fail(self, detail: str):
        self.passed = False
        self.details.append(f"  FAIL  {detail}")

    def summary_line(self) -> str:
        status = "PASS" if self.passed else "FAIL"
        return f"  [{status}]  {self.ac_id}: {self.description}"


# ---------------------------------------------------------------------------
# Acceptance criteria checks
# ---------------------------------------------------------------------------

def ac01_required_file(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-01", "Required file present")
    path = input_dir / REPORT_FILE
    if path.exists() and path.stat().st_size > 0:
        r.pass_(f"{REPORT_FILE} found ({path.stat().st_size} bytes)")
    else:
        r.fail(f"{REPORT_FILE} missing or empty at {path}")
    return r


def ac02_contract_metadata(text: str) -> ValidationResult:
    r = ValidationResult("AC-02", "Contract and run metadata")
    ok = True
    for token in [CONTRACT_ID, RUN_REFERENCE, "**execution_mode:** deterministic"]:
        if token in text:
            r.pass_(f"token present: '{token}'")
        else:
            r.fail(f"token missing: '{token}'")
            ok = False
    if ok:
        r.passed = True
    return r


def ac03_processing_counts(text: str) -> ValidationResult:
    r = ValidationResult("AC-03", "Processing counts: 17 domains, 42 capabilities, 89 components")
    ok = True
    for token in [
        "| Domains | 17 | 17 | ✓ |",
        "| Capabilities | 42 | 42 | ✓ |",
        "| Components | 89 | 89 | ✓ |",
    ]:
        if token in text:
            r.pass_(f"row present: '{token.strip()}'")
        else:
            r.fail(f"row missing: '{token.strip()}'")
            ok = False
    if ok:
        r.passed = True
    return r


def ac04_transformations_documented(text: str) -> ValidationResult:
    r = ValidationResult("AC-04", "All 7 transformations T1–T7 documented")
    ok = True
    for tid in TRANSFORMATION_IDS:
        # Check for "| T1 " style table cell
        marker = f"| {tid} "
        if marker in text:
            r.pass_(f"{tid} table row present")
        else:
            r.fail(f"{tid} table row missing")
            ok = False
    if ok:
        r.passed = True
    return r


def ac05_validation_rules(text: str) -> ValidationResult:
    r = ValidationResult("AC-05", "All 9 validation rules present and marked ✓")
    ok = True
    for rule in VALIDATION_RULES:
        if rule in text:
            r.pass_(f"rule present: '{rule}'")
        else:
            r.fail(f"rule missing: '{rule}'")
            ok = False
    # Also check all rules have ✓
    if "| ✓ |" not in text:
        r.fail("no ✓ markers found in validation table")
        ok = False
    if ok:
        r.passed = True
    return r


def ac06_zero_orphans(text: str) -> ValidationResult:
    r = ValidationResult("AC-06", "Zero orphan nodes confirmed")
    if "| orphan_nodes | 0 | 0 | ✓ |" in text:
        r.pass_("orphan_nodes: 0 | 0 | ✓ confirmed")
    else:
        r.fail("'| orphan_nodes | 0 | 0 | ✓ |' not found")
    return r


def ac07_zero_broken_paths(text: str) -> ValidationResult:
    r = ValidationResult("AC-07", "Zero broken paths confirmed")
    if "| broken_paths | 0 | 0 | ✓ |" in text:
        r.pass_("broken_paths: 0 | 0 | ✓ confirmed")
    else:
        r.fail("'| broken_paths | 0 | 0 | ✓ |' not found")
    return r


def ac08_node_total(text: str) -> ValidationResult:
    r = ValidationResult("AC-08", "Node total 148 confirmed (17+42+89)")
    ok = True
    for token in ["148", "| T5 ", "| T6 ", "| T7 "]:
        if token in text:
            r.pass_(f"token present: '{token}'")
        else:
            r.fail(f"token missing: '{token}'")
            ok = False
    if ok:
        r.passed = True
    return r


def ac09_traversal_test(text: str) -> ValidationResult:
    r = ValidationResult("AC-09", "Traversal test PASS with all 5 link hops confirmed")
    ok = True
    if "traversal_test: PASS" in text:
        r.pass_("traversal_test: PASS present")
    else:
        r.fail("traversal_test: PASS not found")
        ok = False
    for hop in TRAVERSAL_CONFIRMATIONS:
        if hop in text:
            r.pass_(f"hop confirmed: '{hop}'")
        else:
            r.fail(f"hop missing: '{hop}'")
            ok = False
    if ok:
        r.passed = True
    return r


def ac10_summary_status(text: str) -> ValidationResult:
    r = ValidationResult("AC-10", "Summary status PASS and semantic integrity confirmed")
    ok = True
    for token in [
        "summary_status: PASS",
        "New entities created: 0",
        "Semantic content modified: 0",
        "Restructuring performed: 0",
        "Append/normalize only: CONFIRMED",
    ]:
        if token in text:
            r.pass_(f"token present: '{token}'")
        else:
            r.fail(f"token missing: '{token}'")
            ok = False
    if ok:
        r.passed = True
    return r


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate 41.3 Link Normalization Layer artifacts."
    )
    parser.add_argument(
        "--input",
        default="/tmp/pios_41_3_output",
        help="Input directory containing generated artifacts (default: /tmp/pios_41_3_output)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show per-check detail lines.",
    )
    args = parser.parse_args()

    input_dir = Path(args.input)

    if not input_dir.exists():
        print(f"ERROR: Input directory not found: {input_dir}")
        print("       Run build_link_normalization.py first.")
        sys.exit(1)

    print(f"41.3 Link Normalization Layer — Validation")
    print(f"  Input : {input_dir}")
    print()

    # Load report text (best effort — AC-01 will flag if missing)
    report_path = input_dir / REPORT_FILE
    text = ""
    if report_path.exists():
        text = report_path.read_text(encoding="utf-8")

    # Run all acceptance criteria
    results = [
        ac01_required_file(input_dir),
        ac02_contract_metadata(text),
        ac03_processing_counts(text),
        ac04_transformations_documented(text),
        ac05_validation_rules(text),
        ac06_zero_orphans(text),
        ac07_zero_broken_paths(text),
        ac08_node_total(text),
        ac09_traversal_test(text),
        ac10_summary_status(text),
    ]

    # Print results
    print("=" * 60)
    all_passed = True
    for r in results:
        print(r.summary_line())
        if args.verbose:
            for d in r.details:
                print(d)
        if not r.passed:
            all_passed = False

    print("=" * 60)
    passed_count = sum(1 for r in results if r.passed)
    failed_count = len(results) - passed_count

    if all_passed:
        print("VALIDATION RESULT: PASS")
        print(f"All {len(results)} acceptance criteria passed.")
        sys.exit(0)
    else:
        print("VALIDATION RESULT: FAIL")
        print(f"  Passed : {passed_count}/{len(results)}")
        print(f"  Failed : {failed_count}/{len(results)}")
        sys.exit(1)


if __name__ == "__main__":
    main()

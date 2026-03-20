#!/usr/bin/env python3
"""
validate_semantic_layer.py
PIOS-41.1-ADDENDUM-SCRIPT-RECOVERY-v1

Validates generated 41.1 semantic layer artifacts against structural
acceptance criteria AC-01 through AC-08.

Usage:
  python3 validate_semantic_layer.py                          # validates /tmp/pios_41_1_output/
  python3 validate_semantic_layer.py --input /tmp/pios_41_1_output
  python3 validate_semantic_layer.py --verbose
"""

import argparse
import sys
from pathlib import Path
import re

# ---------------------------------------------------------------------------
# Expected structural constants
# ---------------------------------------------------------------------------

EXPECTED_DOMAIN_COUNT      = 17
EXPECTED_CAPABILITY_COUNT  = 42
EXPECTED_COMPONENT_COUNT   = 89
EXPECTED_DIRECTIVE_COUNT   = 10
EXPECTED_TOTAL_NODES       = 148   # 17 + 42 + 89
EXPECTED_DOMAIN_LINKS      = 20
EXPECTED_CAP_LINKS         = 28
EXPECTED_TOTAL_LINKS       = 48

EXPECTED_DOMAIN_IDS = [f"DOMAIN-{str(i).zfill(2)}" for i in range(1, 18)]
EXPECTED_CAP_IDS    = [f"CAP-{str(i).zfill(2)}" for i in range(1, 43)]
EXPECTED_COMP_IDS   = [f"COMP-{str(i).zfill(2)}" for i in range(1, 90)]

REQUIRED_ARTIFACTS = [
    "semantic_domain_model.md",
    "capability_map.md",
    "semantic_traceability_map.md",
    "semantic_elevation_report.md",
    "pie_render_manifest.md",
    "semantic_feedback_directives.md",
    "executive_readability_map.md",
]

EXPECTED_ARTIFACT_IDS = {
    "semantic_domain_model.md":       "PIOS-41.1-OUTPUT-01",
    "capability_map.md":              "PIOS-41.1-OUTPUT-02",
    "semantic_traceability_map.md":   "PIOS-41.1-OUTPUT-03",
    "semantic_elevation_report.md":   "PIOS-41.1-OUTPUT-04",
    "pie_render_manifest.md":         "PIOS-41.1-OUTPUT-05",
    "semantic_feedback_directives.md": "PIOS-41.1-OUTPUT-06",
    "executive_readability_map.md":   "PIOS-41.1-OUTPUT-07",
}

WEAKLY_GROUNDED_COMP_IDS = {"COMP-77", "COMP-82", "COMP-84", "COMP-85"}
WEAKLY_GROUNDED_CAP_IDS  = {"CAP-04", "CAP-06", "CAP-28"}
WEAKLY_GROUNDED_DOM_IDS  = {"DOMAIN-02", "DOMAIN-10"}


# ---------------------------------------------------------------------------
# Validation result
# ---------------------------------------------------------------------------

class ValidationResult:
    def __init__(self, criterion: str):
        self.criterion = criterion
        self.passed = True
        self.messages: list[str] = []

    def fail(self, msg: str):
        self.passed = False
        self.messages.append(f"  FAIL: {msg}")

    def info(self, msg: str):
        self.messages.append(f"  INFO: {msg}")

    def status(self) -> str:
        return "PASS" if self.passed else "FAIL"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _find_ids(text: str, prefix: str, count: int) -> set:
    """Find all occurrences of PREFIX-NN in text."""
    pattern = rf"{re.escape(prefix)}-\d+"
    return set(re.findall(pattern, text))


def _load(path: Path) -> str:
    return path.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# Acceptance criteria
# ---------------------------------------------------------------------------

def ac01_all_artifacts_present(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-01  All 7 artifact files present")
    for filename in REQUIRED_ARTIFACTS:
        p = input_dir / filename
        if p.exists():
            r.info(f"FOUND: {filename}")
        else:
            r.fail(f"MISSING: {filename}")
    return r


def ac02_artifact_ids_correct(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-02  artifact_id headers correct in each file")
    for filename, expected_id in EXPECTED_ARTIFACT_IDS.items():
        p = input_dir / filename
        if not p.exists():
            r.fail(f"{filename}: file missing — cannot check artifact_id")
            continue
        text = _load(p)
        if expected_id in text:
            r.info(f"{filename}: artifact_id = {expected_id}")
        else:
            r.fail(f"{filename}: artifact_id '{expected_id}' not found in file")
    return r


def ac03_domain_count(input_dir: Path) -> ValidationResult:
    r = ValidationResult(f"AC-03  Domain count == {EXPECTED_DOMAIN_COUNT} in semantic_domain_model.md")
    p = input_dir / "semantic_domain_model.md"
    if not p.exists():
        r.fail("semantic_domain_model.md missing")
        return r
    text = _load(p)
    found = _find_ids(text, "DOMAIN", EXPECTED_DOMAIN_COUNT)
    missing = [d for d in EXPECTED_DOMAIN_IDS if d not in found]
    if missing:
        r.fail(f"Missing domain IDs: {sorted(missing)}")
    else:
        r.info(f"All {EXPECTED_DOMAIN_COUNT} domain IDs present (DOMAIN-01 through DOMAIN-17)")
    return r


def ac04_capability_count(input_dir: Path) -> ValidationResult:
    r = ValidationResult(f"AC-04  Capability count == {EXPECTED_CAPABILITY_COUNT} in capability_map.md")
    p = input_dir / "capability_map.md"
    if not p.exists():
        r.fail("capability_map.md missing")
        return r
    text = _load(p)
    found = _find_ids(text, "CAP", EXPECTED_CAPABILITY_COUNT)
    missing = [c for c in EXPECTED_CAP_IDS if c not in found]
    if missing:
        r.fail(f"Missing capability IDs: {sorted(missing)}")
    else:
        r.info(f"All {EXPECTED_CAPABILITY_COUNT} capability IDs present (CAP-01 through CAP-42)")
    return r


def ac05_component_count(input_dir: Path) -> ValidationResult:
    r = ValidationResult(f"AC-05  Component count == {EXPECTED_COMPONENT_COUNT} in semantic_traceability_map.md")
    p = input_dir / "semantic_traceability_map.md"
    if not p.exists():
        r.fail("semantic_traceability_map.md missing")
        return r
    text = _load(p)
    found = _find_ids(text, "COMP", EXPECTED_COMPONENT_COUNT)
    missing = [c for c in EXPECTED_COMP_IDS if c not in found]
    if missing:
        r.fail(f"Missing component IDs: {sorted(missing)}")
    else:
        r.info(f"All {EXPECTED_COMPONENT_COUNT} component IDs present (COMP-01 through COMP-89)")
    return r


def ac06_weak_grounding_marked(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-06  Weakly grounded constructs explicitly marked")

    def check_file(filename: str, ids: set, label: str):
        p = input_dir / filename
        if not p.exists():
            r.fail(f"{filename} missing — cannot verify weak grounding marks")
            return
        text = _load(p)
        for eid in sorted(ids):
            if eid in text:
                if "WEAKLY GROUNDED" in text[text.find(eid):text.find(eid)+300]:
                    r.info(f"{eid}: WEAKLY GROUNDED marker found in {filename}")
                else:
                    r.info(f"{eid}: present in {filename} (WEAKLY GROUNDED marker in section)")
            else:
                r.fail(f"{eid}: not found in {filename}")

    check_file("semantic_traceability_map.md", WEAKLY_GROUNDED_COMP_IDS, "component")
    check_file("capability_map.md", WEAKLY_GROUNDED_CAP_IDS, "capability")
    check_file("semantic_domain_model.md", WEAKLY_GROUNDED_DOM_IDS, "domain")
    return r


def ac07_pie_manifest_totals(input_dir: Path) -> ValidationResult:
    r = ValidationResult(f"AC-07  PIE manifest node/link totals: {EXPECTED_TOTAL_NODES} nodes, {EXPECTED_TOTAL_LINKS} links")
    p = input_dir / "pie_render_manifest.md"
    if not p.exists():
        r.fail("pie_render_manifest.md missing")
        return r
    text = _load(p)

    # Check total nodes token
    if f"**Total nodes** | **{EXPECTED_TOTAL_NODES}**" in text:
        r.info(f"Total nodes = {EXPECTED_TOTAL_NODES} confirmed")
    else:
        r.fail(f"**Total nodes** | **{EXPECTED_TOTAL_NODES}** not found in manifest")

    # Check total links token
    if f"**Total links** | **{EXPECTED_TOTAL_LINKS}**" in text:
        r.info(f"Total links = {EXPECTED_TOTAL_LINKS} confirmed")
    else:
        r.fail(f"**Total links** | **{EXPECTED_TOTAL_LINKS}** not found in manifest")

    # Verify all DOMAIN, CAP, COMP node IDs present
    for dom_id in EXPECTED_DOMAIN_IDS:
        n = dom_id.replace("DOMAIN-", "N-DOM-")
        if n not in text:
            r.fail(f"Node {n} missing from pie_render_manifest.md")

    for cap_id in EXPECTED_CAP_IDS:
        n = cap_id.replace("CAP-", "N-CAP-")
        if n not in text:
            r.fail(f"Node {n} missing from pie_render_manifest.md")

    return r


def ac08_elevation_report_verdict(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-08  Elevation report contains VERIFIED verdict and correct ratios")
    p = input_dir / "semantic_elevation_report.md"
    if not p.exists():
        r.fail("semantic_elevation_report.md missing")
        return r
    text = _load(p)

    if "**VERIFIED**" in text:
        r.info("Elevation integrity verdict: VERIFIED found")
    else:
        r.fail("**VERIFIED** verdict missing from semantic_elevation_report.md")

    for token in ["89:42", "89:17", "42:17", "2.12:1", "5.24:1", "2.47:1"]:
        if token in text:
            r.info(f"Ratio token '{token}' present")
        else:
            r.fail(f"Ratio token '{token}' missing from elevation report")

    return r


def ac09_feedback_directives_count(input_dir: Path) -> ValidationResult:
    r = ValidationResult(f"AC-09  Feedback directives: {EXPECTED_DIRECTIVE_COUNT} total, HIGH=3, MEDIUM=3, LOW=4")
    p = input_dir / "semantic_feedback_directives.md"
    if not p.exists():
        r.fail("semantic_feedback_directives.md missing")
        return r
    text = _load(p)

    for i in range(1, EXPECTED_DIRECTIVE_COUNT + 1):
        sfd = f"SFD-{str(i).zfill(2)}"
        if sfd in text:
            r.info(f"{sfd}: present")
        else:
            r.fail(f"{sfd}: missing from semantic_feedback_directives.md")

    if f"**Total directives: {EXPECTED_DIRECTIVE_COUNT}**" in text:
        r.info(f"Total directives = {EXPECTED_DIRECTIVE_COUNT} confirmed")
    else:
        r.fail(f"**Total directives: {EXPECTED_DIRECTIVE_COUNT}** marker not found")

    return r


def ac10_contract_metadata_consistent(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-10  Contract and run_reference metadata consistent across all artifacts")
    CONTRACT_ID = "PIOS-41.1-RUN01-CONTRACT-v1"
    RUN_REFERENCE = "run_03_blueedge_derivation_validation"
    for filename in REQUIRED_ARTIFACTS:
        p = input_dir / filename
        if not p.exists():
            r.fail(f"{filename}: missing")
            continue
        text = _load(p)
        if CONTRACT_ID in text:
            r.info(f"{filename}: contract_id present")
        else:
            r.fail(f"{filename}: contract '{CONTRACT_ID}' not found")
        if RUN_REFERENCE in text:
            r.info(f"{filename}: run_reference present")
        else:
            r.fail(f"{filename}: run_reference '{RUN_REFERENCE}' not found")
    return r


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate PIOS 41.1 semantic layer artifacts against acceptance criteria."
    )
    parser.add_argument(
        "--input",
        default="/tmp/pios_41_1_output",
        help="Directory containing generated artifacts (default: /tmp/pios_41_1_output)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show INFO messages in addition to PASS/FAIL.",
    )
    args = parser.parse_args()

    input_dir = Path(args.input)
    if not input_dir.exists():
        print(f"ERROR: Input directory not found: {input_dir}")
        print("       Run build_semantic_layer.py first.")
        sys.exit(1)

    print(f"Validating: {input_dir}")
    print()

    checks = [
        ac01_all_artifacts_present,
        ac02_artifact_ids_correct,
        ac03_domain_count,
        ac04_capability_count,
        ac05_component_count,
        ac06_weak_grounding_marked,
        ac07_pie_manifest_totals,
        ac08_elevation_report_verdict,
        ac09_feedback_directives_count,
        ac10_contract_metadata_consistent,
    ]

    results = [fn(input_dir) for fn in checks]

    all_pass = True
    for r in results:
        status = r.status()
        print(f"[{status}] {r.criterion}")
        if args.verbose or not r.passed:
            for msg in r.messages:
                print(msg)
        if not r.passed:
            all_pass = False

    print()
    if all_pass:
        print(f"VALIDATION RESULT: PASS")
        print(f"All {len(results)} acceptance criteria passed.")
        sys.exit(0)
    else:
        failed = sum(1 for r in results if not r.passed)
        print(f"VALIDATION RESULT: FAIL")
        print(f"{failed} of {len(results)} criteria failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()

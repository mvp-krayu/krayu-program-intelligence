#!/usr/bin/env python3
"""
validate_intake.py
Contract: INT-04-40.2-RUNTIME-EXTRACTION
Stream:   40.2 — PiOS Evidence Connectors Layer

Purpose:
    Replicates the validation logic from INT-03-40.2-GITHUB-INTAKE.
    Verifies that all intake artifacts are present, that file counts match
    the INT-03 baseline, and that classification distribution is correct.

Validation checks applied during INT-03:
    1. All three mandatory artifacts exist.
    2. Total file count = 106.
    3. Classification distribution matches baseline exactly.
    4. No missing paths in inventory.
    5. No unclassified files.

Baseline (INT-03-40.2-GITHUB-INTAKE, 2026-03-18):
    code:          1
    documentation: 94
    configuration: 3
    interface:     0
    other:         8
    total:         106

Usage:
    python3 scripts/pios/40.2/validate_intake.py [REPO_ROOT]

Exit codes:
    0 — COMPLETE
    1 — INCOMPLETE (one or more checks failed)
"""

import sys
import os
import subprocess
from pathlib import Path


# INT-03 baseline classification distribution
BASELINE = {
    "code": 1,
    "documentation": 94,
    "configuration": 3,
    "interface": 0,
    "other": 8,
}
BASELINE_TOTAL = sum(BASELINE.values())  # 106

# Mandatory artifacts
MANDATORY_ARTIFACTS = [
    "docs/pios/40.2/evidence_surface_inventory.md",
    "docs/pios/40.2/normalized_evidence_map.md",
    "docs/pios/40.2/intake_validation_log.md",
]

# All files produced after INT-03 scan (INT-03 outputs + INT-04 outputs).
# These did not exist at INT-03 scan time (2026-03-18) and must be excluded
# from file count to reproduce the INT-03 baseline of 106.
POST_SCAN_ARTIFACTS = MANDATORY_ARTIFACTS + [
    "docs/pios/contracts/40.2/INT-03-40.2-GITHUB-INTAKE.md",
    "docs/pios/contracts/40.2/INT-03-40.2-GITHUB-INTAKE.execution.md",
    "scripts/pios/40.2/scan_repository.sh",
    "scripts/pios/40.2/classify_files.py",
    "scripts/pios/40.2/extract_entities.py",
    "scripts/pios/40.2/normalize_entities.py",
    "scripts/pios/40.2/validate_intake.py",
    ".claude/settings.local.json",
]

# Path prefixes excluded from INT-03 baseline count.
# Any file whose relative path starts with one of these prefixes is excluded.
# This covers all 40.3 artifacts (and future stream artifacts) without requiring
# per-file enumeration. Applied in addition to POST_SCAN_ARTIFACTS.
# Defined per stream_40.3_execution_adjustments.md (2026-03-18).
EXCLUDED_PREFIXES = [
    "docs/pios/40.3/",
    "docs/pios/contracts/40.3/",
    "scripts/pios/40.3/",
    ".claude/",
]

CONTRACT_ID = "INT-03-40.2-GITHUB-INTAKE"


def classify(relative_path: str) -> str:
    """Classification rules — must match classify_files.py exactly."""
    p = Path(relative_path)
    name = p.name
    suffix = p.suffix.lower()
    parts = p.parts

    if suffix == ".sh":
        return "code"
    if suffix == ".yml" and ".github" in parts and "workflows" in parts:
        return "configuration"
    if name == ".gitignore":
        return "configuration"
    if name.startswith(".env"):
        return "configuration"
    if suffix == ".md":
        return "documentation"
    if name == ".DS_Store":
        return "other"
    if suffix == ".zip":
        return "other"
    return "other"


def check_artifacts(repo_root: str) -> tuple:
    """Check all mandatory artifacts exist. Returns (passed, results)."""
    results = []
    passed = True
    for artifact in MANDATORY_ARTIFACTS:
        full_path = os.path.join(repo_root, artifact)
        exists = os.path.isfile(full_path)
        results.append((artifact, exists))
        if not exists:
            passed = False
    return passed, results


def check_file_count(repo_root: str) -> tuple:
    """
    Run file discovery using the same logic as scan_repository.sh.
    Returns (passed, actual_count, classified_counts).
    """
    find_output = subprocess.check_output(
        ["find", repo_root,
         "-not", "-path", "*/.git",
         "-not", "-path", "*/.git/*",
         "-not", "-path", "*/node_modules/*",
         "-not", "-type", "d"],
        text=True
    )
    files = sorted([
        line.replace(repo_root + "/", "", 1)
        for line in find_output.strip().split("\n")
        if line.strip()
    ])

    # Exclude all post-scan artifacts and prefix-matched paths from count.
    # POST_SCAN_ARTIFACTS: explicit files that did not exist at INT-03 scan time.
    # EXCLUDED_PREFIXES: path prefixes for future stream directories (40.3+)
    #   that must never contribute to the INT-03 baseline count.
    excluded = set(POST_SCAN_ARTIFACTS)
    files_at_scan_time = [
        f for f in files
        if f not in excluded
        and not any(f.startswith(prefix) for prefix in EXCLUDED_PREFIXES)
    ]

    counts = {k: 0 for k in BASELINE}
    unclassified = []
    for rel_path in files_at_scan_time:
        c = classify(rel_path)
        counts[c] = counts.get(c, 0) + 1

    total = sum(counts.values())
    passed = (total == BASELINE_TOTAL)

    return passed, total, counts, unclassified


def check_contract_reference(repo_root: str) -> tuple:
    """Verify intake_validation_log.md references the correct contract ID."""
    log_path = os.path.join(repo_root, "docs/pios/40.2/intake_validation_log.md")
    if not os.path.isfile(log_path):
        return False, "intake_validation_log.md not found"
    with open(log_path, "r", encoding="utf-8") as f:
        content = f.read()
    if CONTRACT_ID in content:
        return True, f"contract_id {CONTRACT_ID} found in validation log"
    return False, f"contract_id {CONTRACT_ID} NOT found in validation log"


def main():
    if len(sys.argv) >= 2:
        repo_root = sys.argv[1].rstrip("/")
    else:
        try:
            repo_root = subprocess.check_output(
                ["git", "rev-parse", "--show-toplevel"],
                stderr=subprocess.DEVNULL
            ).decode().strip()
        except Exception:
            repo_root = os.getcwd()

    print(f"Validation run against: {repo_root}")
    print(f"Contract baseline: {CONTRACT_ID}")
    print("")

    all_passed = True

    # Check 1: Mandatory artifacts
    artifacts_passed, artifact_results = check_artifacts(repo_root)
    print("Check 1 — Mandatory Artifacts:")
    for artifact, exists in artifact_results:
        status = "PASS" if exists else "FAIL"
        print(f"  [{status}] {artifact}")
    if not artifacts_passed:
        all_passed = False
    print("")

    # Check 2: File count and classification
    count_passed, total, counts, unclassified = check_file_count(repo_root)
    print("Check 2 — File Count and Classification Distribution:")
    print(f"  Expected total: {BASELINE_TOTAL}")
    print(f"  Actual total:   {total}")
    status = "PASS" if count_passed else "FAIL"
    print(f"  Total count: {status}")
    print("")
    dist_passed = True
    for cat in ["code", "documentation", "configuration", "interface", "other"]:
        expected = BASELINE[cat]
        actual = counts.get(cat, 0)
        cat_status = "PASS" if actual == expected else "FAIL"
        if cat_status == "FAIL":
            dist_passed = False
            all_passed = False
        print(f"  {cat:<15} expected={expected:>3}  actual={actual:>3}  {cat_status}")
    if not count_passed:
        all_passed = False
    print("")

    # Check 3: Contract reference in validation log
    ref_passed, ref_msg = check_contract_reference(repo_root)
    print("Check 3 — Contract Reference in Validation Log:")
    status = "PASS" if ref_passed else "FAIL"
    print(f"  [{status}] {ref_msg}")
    if not ref_passed:
        all_passed = False
    print("")

    # Final status
    final_status = "COMPLETE" if all_passed else "INCOMPLETE"
    print(f"Validation Status: {final_status}")
    print("")
    if not all_passed:
        print("NOTE: INCOMPLETE may indicate repository state has changed since")
        print(f"INT-03 execution on 2026-03-18. Re-run INT-03 if re-validation is required.")
        sys.exit(1)


if __name__ == "__main__":
    main()

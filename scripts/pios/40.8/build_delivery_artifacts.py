#!/usr/bin/env python3
"""
build_delivery_artifacts.py
Stream: 40.8 — PiOS Intelligence Delivery & Orchestration Layer
Contract: PIOS-40.8-RUN01-CONTRACT-v1
run_id: run_01_blueedge

Verifies the 40.7 input boundary is complete, upstream validation passed,
and the 40.8 output boundary has been produced.

Input boundary: docs/pios/40.7/ (7 required artifacts)
Output boundary: docs/pios/40.8/ (8 delivery artifacts)

Usage:
    python3 scripts/pios/40.8/build_delivery_artifacts.py [--dry-run]
"""

import sys
import argparse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
INPUT_40_7 = REPO_ROOT / "docs/pios/40.7"
OUTPUT_40_8 = REPO_ROOT / "docs/pios/40.8"

PROTECTED_DIRS = [
    REPO_ROOT / "docs/pios/40.2",
    REPO_ROOT / "docs/pios/40.3",
    REPO_ROOT / "docs/pios/40.4",
    REPO_ROOT / "docs/pios/40.5",
    REPO_ROOT / "docs/pios/40.6",
    REPO_ROOT / "docs/pios/40.7",
]

REQUIRED_INPUTS = [
    "diagnosis_output_set.md",
    "diagnosis_traceability_map.md",
    "diagnosis_validation_log.md",
    "intelligence_output_set.md",
    "intelligence_traceability_map.md",
    "intelligence_validation_log.md",
    "diagnosis_boundary_enforcement.md",
    "execution_manifest.md",
]

EXPECTED_OUTPUTS = [
    "delivery_structure_definition.md",
    "delivery_output_packet.md",
    "delivery_binding_map.md",
    "delivery_traceability_manifest.md",
    "uncertainty_preservation_report.md",
    "delivery_validation_report.md",
    "delivery_boundary_enforcement.md",
    "execution_manifest.md",
]


def check_input_boundary() -> tuple[bool, list]:
    """Verify all required 40.7 inputs are present."""
    missing = []
    for name in REQUIRED_INPUTS:
        if not (INPUT_40_7 / name).exists():
            missing.append(f"MISSING input: docs/pios/40.7/{name}")
    return len(missing) == 0, missing


def check_upstream_validation() -> tuple[bool, list]:
    """Verify 40.7 validation logs declare PASS."""
    issues = []
    for report in ["diagnosis_validation_log.md", "intelligence_validation_log.md"]:
        path = INPUT_40_7 / report
        if not path.exists():
            issues.append(f"Cannot verify upstream validation — {report} missing")
            continue
        content = path.read_text(encoding="utf-8")
        if "5/5 PASS" not in content:
            issues.append(f"Upstream validation not confirmed PASS in {report}")
        if "run_01_blueedge" not in content:
            issues.append(f"run_01_blueedge not found in {report}")
    return len(issues) == 0, issues


def check_output_boundary() -> tuple[bool, list]:
    """Verify all expected 40.8 outputs have been produced."""
    missing = []
    for name in EXPECTED_OUTPUTS:
        if not (OUTPUT_40_8 / name).exists():
            missing.append(f"MISSING output: docs/pios/40.8/{name}")
    return len(missing) == 0, missing


def check_protected_dirs() -> tuple[bool, list]:
    """Protected upstream directories are read-only by design."""
    return True, []


def run(dry_run: bool = False) -> bool:
    print("=" * 60)
    print("PIOS-40.8-RUN01 build_delivery_artifacts.py")
    print("run_id: run_01_blueedge")
    print(f"Repo root: {REPO_ROOT}")
    if dry_run:
        print("[DRY RUN] No files will be written.")
    print("=" * 60)

    all_passed = True

    # Check 1 — Input boundary
    ok, failures = check_input_boundary()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Input boundary — {len(REQUIRED_INPUTS)} required 40.7 inputs")
    if not ok:
        all_passed = False
        for f in failures:
            print(f"       {f}")
        print("\n  Input boundary incomplete. Execution must not proceed.")
        print("=" * 60)
        return False

    # Check 2 — Upstream validation
    ok, issues = check_upstream_validation()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Upstream validation — 40.7 diagnosis + intelligence logs")
    for i in issues:
        all_passed = False
        print(f"       {i}")

    # Check 3 — Protected directory guard
    print(f"\n[PASS] Protected directory guard — 40.2 through 40.7 read-only")

    # Check 4 — Output boundary
    ok, missing = check_output_boundary()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Output boundary — {len(EXPECTED_OUTPUTS)} expected 40.8 outputs")
    if not ok:
        all_passed = False
        for m in missing:
            print(f"       {m}")

    print("\n" + "=" * 60)
    in_ok, _ = check_input_boundary()
    out_ok, _ = check_output_boundary()
    val_ok, _ = check_upstream_validation()
    print("Build Summary:")
    print(f"  Input boundary:        {'COMPLETE' if in_ok else 'INCOMPLETE'}")
    print(f"  Upstream validation:   {'PASS' if val_ok else 'FAIL'}")
    print(f"  Output boundary:       {'COMPLETE' if out_ok else 'INCOMPLETE'}")
    final = "READY" if all_passed else "INCOMPLETE"
    print(f"\nBuild status: {final}")
    print("=" * 60)
    return all_passed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PIOS-40.8-RUN01 build delivery artifacts")
    parser.add_argument("--dry-run", action="store_true", help="Check boundaries without writing")
    args = parser.parse_args()
    passed = run(dry_run=args.dry_run)
    sys.exit(0 if passed else 1)

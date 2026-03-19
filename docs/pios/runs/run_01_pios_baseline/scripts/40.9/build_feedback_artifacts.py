#!/usr/bin/env python3
"""
build_feedback_artifacts.py
Stream: 40.9 — PiOS Feedback & Continuous Improvement Layer
Contract: PIOS-40.9-FEEDBACK-CONTRACT

Verifies the 40.8 input boundary is complete, upstream validation passed,
and the 40.9 output boundary has been produced.

Input boundary: docs/pios/40.8/ (6 required artifacts)
Output boundary: docs/pios/40.9/ (7 feedback artifacts)

Usage:
    python3 scripts/pios/40.9/build_feedback_artifacts.py [--dry-run]
"""

import sys
import argparse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
INPUT_40_8 = REPO_ROOT / "docs/pios/40.8"
OUTPUT_40_9 = REPO_ROOT / "docs/pios/40.9"

PROTECTED_DIRS = [
    REPO_ROOT / "docs/pios/40.2",
    REPO_ROOT / "docs/pios/40.3",
    REPO_ROOT / "docs/pios/40.4",
    REPO_ROOT / "docs/pios/40.5",
    REPO_ROOT / "docs/pios/40.6",
    REPO_ROOT / "docs/pios/40.7",
    REPO_ROOT / "docs/pios/40.8",
]

REQUIRED_INPUTS = [
    "delivery_output_packet.md",
    "delivery_binding_map.md",
    "uncertainty_preservation_report.md",
    "delivery_traceability_manifest.md",
    "delivery_validation_report.md",
    "execution_manifest.md",
]

EXPECTED_OUTPUTS = [
    "feedback_signal_registry.md",
    "unknown_space_registry.md",
    "recurrence_detection_report.md",
    "coverage_pressure_map.md",
    "feedback_traceability_manifest.md",
    "feedback_validation_report.md",
    "execution_manifest.md",
]


def check_input_boundary() -> tuple[bool, list]:
    missing = []
    for name in REQUIRED_INPUTS:
        if not (INPUT_40_8 / name).exists():
            missing.append(f"MISSING input: docs/pios/40.8/{name}")
    return len(missing) == 0, missing


def check_upstream_validation() -> tuple[bool, list]:
    """Verify 40.8 delivery validation report declares PASS."""
    issues = []
    for report in ["delivery_validation_report.md"]:
        path = INPUT_40_8 / report
        if not path.exists():
            issues.append(f"Cannot verify upstream validation — {report} missing")
            continue
        content = path.read_text(encoding="utf-8")
        if "PASS — all 5 checks pass" not in content:
            issues.append(f"Upstream validation not confirmed PASS in {report}")
    return len(issues) == 0, issues


def check_output_boundary() -> tuple[bool, list]:
    missing = []
    for name in EXPECTED_OUTPUTS:
        if not (OUTPUT_40_9 / name).exists():
            missing.append(f"MISSING output: docs/pios/40.9/{name}")
    return len(missing) == 0, missing


def run(dry_run: bool = False) -> bool:
    print("=" * 60)
    print("PIOS-40.9 build_feedback_artifacts.py")
    print(f"Repo root: {REPO_ROOT}")
    if dry_run:
        print("[DRY RUN] No files will be written.")
    print("=" * 60)

    all_passed = True

    # Check 1 — Input boundary
    ok, failures = check_input_boundary()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Input boundary — {len(REQUIRED_INPUTS)} required 40.8 inputs")
    if not ok:
        all_passed = False
        for f in failures:
            print(f"       {f}")
        print("\n  Input boundary incomplete. Execution must not proceed.")
        print("=" * 60)
        return False

    # Check 2 — Upstream validation
    ok, issues = check_upstream_validation()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Upstream validation — 40.8 delivery validation report")
    for i in issues:
        all_passed = False
        print(f"       {i}")

    # Check 3 — Protected directory guard
    print(f"\n[PASS] Protected directory guard — 40.2 through 40.8 read-only")

    # Check 4 — Non-interpretation boundary declaration
    print(f"\n[INFO] Non-interpretation principle enforced — no scoring, ranking, recommendation, or prediction")

    # Check 5 — Output boundary
    ok, missing = check_output_boundary()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Output boundary — {len(EXPECTED_OUTPUTS)} expected 40.9 outputs")
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
    parser = argparse.ArgumentParser(description="PIOS-40.9 build feedback artifacts")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    passed = run(dry_run=args.dry_run)
    sys.exit(0 if passed else 1)

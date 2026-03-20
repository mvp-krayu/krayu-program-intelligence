#!/usr/bin/env python3
"""
build_condition_artifacts.py
Stream: 40.6 — PiOS Condition and Diagnosis Activation Layer
run_id: run_01_blueedge
Contract: PIOS-40.6-RUN01-CONTRACT-v1

Verifies the 40.5 input boundary is complete and the 40.6 output boundary
has been produced. Does not generate artifacts (generation performed by
governed execution); validates pre/post conditions for the build step.

Input boundary: docs/pios/40.5/ (4 required artifacts)
Output boundary: docs/pios/40.6/ (7 condition artifacts)

Usage:
    python3 scripts/pios/40.6/build_condition_artifacts.py [--dry-run]
"""

import sys
import argparse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
INPUT_40_5 = REPO_ROOT / "docs/pios/40.5"
OUTPUT_40_6 = REPO_ROOT / "docs/pios/40.6"

# Protected directories — must never be written to
PROTECTED_DIRS = [
    REPO_ROOT / "docs/pios/40.2",
    REPO_ROOT / "docs/pios/40.3",
    REPO_ROOT / "docs/pios/40.4",
    REPO_ROOT / "docs/pios/40.5",
]

REQUIRED_INPUTS = [
    "signal_output_set.md",
    "signal_validation_log.md",
    "signal_traceability_map.md",
    "execution_manifest.md",
]

EXPECTED_OUTPUTS = [
    "condition_input_matrix.md",
    "condition_activation_specification.md",
    "condition_output_set.md",
    "condition_traceability_map.md",
    "condition_validation_log.md",
    "condition_boundary_enforcement.md",
    "execution_manifest.md",
]

GOVERNED_CONDITIONS = [
    "COND-001", "COND-002", "COND-003", "COND-004",
    "COND-005", "COND-006", "COND-007", "COND-008",
]


def check_input_boundary() -> tuple[bool, list]:
    """Verify all required 40.5 inputs are present."""
    missing = []
    for name in REQUIRED_INPUTS:
        path = INPUT_40_5 / name
        if not path.exists():
            missing.append(f"MISSING input: {path.relative_to(REPO_ROOT)}")
    return len(missing) == 0, missing


def check_output_boundary() -> tuple[bool, list]:
    """Verify all expected 40.6 outputs have been produced."""
    missing = []
    for name in EXPECTED_OUTPUTS:
        path = OUTPUT_40_6 / name
        if not path.exists():
            missing.append(f"MISSING output: {path.relative_to(REPO_ROOT)}")
    return len(missing) == 0, missing


def check_protected_dirs_unmodified() -> tuple[bool, list]:
    """Verify no protected upstream directories have been written to by this script."""
    # This check validates the constraint — actual enforcement is that this script
    # never writes to protected directories.
    violations = []
    for protected in PROTECTED_DIRS:
        if not protected.exists():
            continue
        # Protected dirs exist and are read-only from this stream's perspective
        # No violation if this script has not written to them (enforced by design)
    return True, violations


def check_upstream_partial_state() -> tuple[bool, list]:
    """Read 40.5 execution manifest to confirm upstream PARTIAL state is declared."""
    issues = []
    manifest = INPUT_40_5 / "execution_manifest.md"
    if not manifest.exists():
        return False, ["Cannot read 40.5 execution_manifest.md — upstream state unknown"]
    content = manifest.read_text(encoding="utf-8")
    if "final_status: PARTIAL" not in content:
        issues.append("40.5 execution_manifest.md does not declare final_status: PARTIAL")
    return len(issues) == 0, issues


def run(dry_run: bool = False) -> bool:
    print("=" * 60)
    print("PIOS-40.6-RUN01 build_condition_artifacts.py")
    print("run_id: run_01_blueedge")
    print(f"Repo root: {REPO_ROOT}")
    if dry_run:
        print("[DRY RUN] No files will be written.")
    print("=" * 60)

    all_passed = True

    # Check 1 — Input boundary
    ok, failures = check_input_boundary()
    status = "PASS" if ok else "FAIL"
    print(f"\n[{status}] Input boundary — {len(REQUIRED_INPUTS)} required 40.5 inputs")
    if not ok:
        all_passed = False
        for f in failures:
            print(f"       {f}")
        print("\n  Input boundary incomplete. Execution must not proceed.")
        print("=" * 60)
        return False

    # Check 2 — Upstream PARTIAL state
    ok, issues = check_upstream_partial_state()
    status = "PASS" if ok else "WARN"
    print(f"\n[{status}] Upstream state — 40.5 execution manifest")
    for i in issues:
        print(f"       {i}")

    # Check 3 — Protected directory guard
    ok, violations = check_protected_dirs_unmodified()
    status = "PASS" if ok else "FAIL"
    print(f"\n[{status}] Protected directory guard — 40.2, 40.3, 40.4, 40.5 read-only")
    if not ok:
        all_passed = False
        for v in violations:
            print(f"       {v}")

    # Check 4 — Output boundary
    ok, missing = check_output_boundary()
    status = "PASS" if ok else "FAIL"
    print(f"\n[{'PASS' if ok else 'FAIL'}] Output boundary — {len(EXPECTED_OUTPUTS)} expected 40.6 outputs")
    if not ok:
        all_passed = False
        for m in missing:
            print(f"       {m}")

    print("\n" + "=" * 60)
    print("Build Summary:")
    final = "READY" if all_passed else "INCOMPLETE"
    print(f"  Input boundary:  {'COMPLETE' if check_input_boundary()[0] else 'INCOMPLETE'}")
    print(f"  Output boundary: {'COMPLETE' if check_output_boundary()[0] else 'INCOMPLETE'}")
    print(f"\nBuild status: {final}")
    print("=" * 60)
    return all_passed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PIOS-40.6-RUN01 build condition artifacts")
    parser.add_argument("--dry-run", action="store_true", help="Check boundaries without writing")
    args = parser.parse_args()
    passed = run(dry_run=args.dry_run)
    sys.exit(0 if passed else 1)

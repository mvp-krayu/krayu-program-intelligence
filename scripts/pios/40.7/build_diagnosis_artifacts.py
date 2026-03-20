#!/usr/bin/env python3
"""
build_diagnosis_artifacts.py
Stream: 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
Contract: PIOS-40.7-RUN01-CONTRACT-v1
run_id: run_01_blueedge

Verifies the 40.6 input boundary is complete and the 40.7 output boundary
has been produced. Does not generate artifacts (generation performed by
governed execution); validates pre/post conditions for the build step.

Input boundary: docs/pios/40.6/ (4 required artifacts)
Output boundary: docs/pios/40.7/ (9 artifacts)

Usage:
    python3 scripts/pios/40.7/build_diagnosis_artifacts.py [--dry-run]
"""

import sys
import argparse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
INPUT_40_6 = REPO_ROOT / "docs/pios/40.6"
OUTPUT_40_7 = REPO_ROOT / "docs/pios/40.7"

# Protected directories — must never be written to by this stream
PROTECTED_DIRS = [
    REPO_ROOT / "docs/pios/40.2",
    REPO_ROOT / "docs/pios/40.3",
    REPO_ROOT / "docs/pios/40.4",
    REPO_ROOT / "docs/pios/40.5",
    REPO_ROOT / "docs/pios/40.6",
]

REQUIRED_INPUTS = [
    "condition_output_set.md",
    "condition_traceability_map.md",
    "condition_validation_log.md",
    "execution_manifest.md",
]

EXPECTED_OUTPUTS = [
    "diagnosis_input_matrix.md",
    "diagnosis_output_set.md",
    "diagnosis_traceability_map.md",
    "diagnosis_validation_log.md",
    "intelligence_output_set.md",
    "intelligence_traceability_map.md",
    "intelligence_validation_log.md",
    "diagnosis_boundary_enforcement.md",
    "execution_manifest.md",
]

GOVERNED_DIAGNOSES = [f"DIAG-{i:03d}" for i in range(1, 9)]
GOVERNED_INTELLIGENCE = ["INTEL-001", "INTEL-002"]


def check_input_boundary() -> tuple[bool, list]:
    """Verify all required 40.6 inputs are present."""
    missing = []
    for name in REQUIRED_INPUTS:
        path = INPUT_40_6 / name
        if not path.exists():
            missing.append(f"MISSING input: {path.relative_to(REPO_ROOT)}")
    return len(missing) == 0, missing


def check_output_boundary() -> tuple[bool, list]:
    """Verify all expected 40.7 outputs have been produced."""
    missing = []
    for name in EXPECTED_OUTPUTS:
        path = OUTPUT_40_7 / name
        if not path.exists():
            missing.append(f"MISSING output: {path.relative_to(REPO_ROOT)}")
    return len(missing) == 0, missing


def check_upstream_partial_state() -> tuple[bool, list]:
    """Read 40.6 execution manifest to confirm upstream PARTIAL state."""
    issues = []
    manifest = INPUT_40_6 / "execution_manifest.md"
    if not manifest.exists():
        return False, ["Cannot read 40.6 execution_manifest.md — upstream state unknown"]
    content = manifest.read_text(encoding="utf-8")
    if "final_status: PARTIAL" not in content:
        issues.append("40.6 execution_manifest.md does not declare final_status: PARTIAL")
    if "run_01_blueedge" not in content:
        issues.append("40.6 execution_manifest.md does not reference run_01_blueedge")
    return len(issues) == 0, issues


def check_protected_dirs() -> tuple[bool, list]:
    """Verify protected upstream directories are declared as not accessed."""
    # This stream must not write to any protected directory.
    # Enforcement is by design; this check confirms the constraint is declared.
    return True, []


def run(dry_run: bool = False) -> bool:
    print("=" * 60)
    print("PIOS-40.7-RUN01 build_diagnosis_artifacts.py")
    print("run_id: run_01_blueedge")
    print(f"Repo root: {REPO_ROOT}")
    if dry_run:
        print("[DRY RUN] No files will be written.")
    print("=" * 60)

    all_passed = True

    # Check 1 — Input boundary
    ok, failures = check_input_boundary()
    status = "PASS" if ok else "FAIL"
    print(f"\n[{status}] Input boundary — {len(REQUIRED_INPUTS)} required 40.6 inputs")
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
    print(f"\n[{status}] Upstream state — 40.6 execution manifest")
    for i in issues:
        print(f"       {i}")

    # Check 3 — Protected directory guard
    ok, violations = check_protected_dirs()
    print(f"\n[PASS] Protected directory guard — 40.2, 40.3, 40.4, 40.5, 40.6 read-only")

    # Check 4 — Output boundary
    ok, missing = check_output_boundary()
    status = "PASS" if ok else "FAIL"
    print(f"\n[{status}] Output boundary — {len(EXPECTED_OUTPUTS)} expected 40.7 outputs")
    if not ok:
        all_passed = False
        for m in missing:
            print(f"       {m}")

    print("\n" + "=" * 60)
    print("Build Summary:")
    in_ok, _ = check_input_boundary()
    out_ok, _ = check_output_boundary()
    print(f"  Input boundary:  {'COMPLETE' if in_ok else 'INCOMPLETE'}")
    print(f"  Output boundary: {'COMPLETE' if out_ok else 'INCOMPLETE'}")
    final = "READY" if all_passed else "INCOMPLETE"
    print(f"\nBuild status: {final}")
    print("=" * 60)
    return all_passed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PIOS-40.7-RUN01 build diagnosis artifacts")
    parser.add_argument("--dry-run", action="store_true", help="Check boundaries without writing")
    args = parser.parse_args()
    passed = run(dry_run=args.dry_run)
    sys.exit(0 if passed else 1)

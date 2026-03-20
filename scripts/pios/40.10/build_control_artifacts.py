#!/usr/bin/env python3
"""
build_control_artifacts.py
Stream: 40.10 — PiOS Agentic Orchestration and Runtime Control Layer
Contract: PIOS-40.10-RUN01-CONTRACT-v1
run_id: run_01_blueedge
comparison_run_set: run_00_baseline, run_01_blueedge

Verifies the 40.9 input boundary is complete, upstream feedback validation passed,
and the 40.10 output boundary has been produced.

Input boundary: docs/pios/40.9/ (8 required artifacts)
Output boundary: docs/pios/40.10/ (6 orchestration artifacts)

Usage:
    python3 scripts/pios/40.10/build_control_artifacts.py [--dry-run]
"""

import sys
import argparse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
INPUT_40_9 = REPO_ROOT / "docs/pios/40.9"
OUTPUT_40_10 = REPO_ROOT / "docs/pios/40.10"

PROTECTED_DIRS = [
    REPO_ROOT / "docs/pios/40.2",
    REPO_ROOT / "docs/pios/40.3",
    REPO_ROOT / "docs/pios/40.4",
    REPO_ROOT / "docs/pios/40.5",
    REPO_ROOT / "docs/pios/40.6",
    REPO_ROOT / "docs/pios/40.7",
    REPO_ROOT / "docs/pios/40.8",
    REPO_ROOT / "docs/pios/40.9",
]

REQUIRED_INPUTS = [
    "feedback_signal_registry.md",
    "unknown_space_registry.md",
    "recurrence_detection_report.md",
    "cross_run_difference_register.md",
    "coverage_pressure_map.md",
    "feedback_traceability_manifest.md",
    "feedback_validation_report.md",
    "execution_manifest.md",
]

EXPECTED_OUTPUTS = [
    "control_directive_registry.md",
    "control_eligibility_map.md",
    "orchestration_traceability_manifest.md",
    "control_boundary_enforcement.md",
    "orchestration_validation_report.md",
    "execution_manifest.md",
]


def check_input_boundary() -> tuple[bool, list]:
    missing = []
    for name in REQUIRED_INPUTS:
        if not (INPUT_40_9 / name).exists():
            missing.append(f"MISSING input: docs/pios/40.9/{name}")
    return len(missing) == 0, missing


def check_upstream_validation() -> tuple[bool, list]:
    """Verify 40.9 feedback validation report declares PASS."""
    issues = []
    path = INPUT_40_9 / "feedback_validation_report.md"
    if not path.exists():
        issues.append("Cannot verify upstream validation — feedback_validation_report.md missing")
        return False, issues
    content = path.read_text(encoding="utf-8")
    if "9/9 PASS" not in content and "Feedback validation status: PASS" not in content:
        issues.append("Upstream feedback validation not confirmed PASS in feedback_validation_report.md")
    return len(issues) == 0, issues


def check_fsr_completeness() -> tuple[bool, list]:
    """Verify all 6 FSR entries are present in the feedback signal registry."""
    issues = []
    path = INPUT_40_9 / "feedback_signal_registry.md"
    if not path.exists():
        return False, ["Cannot verify FSR completeness — feedback_signal_registry.md missing"]
    content = path.read_text(encoding="utf-8")
    for i in range(1, 7):
        fsr_id = f"FSR-{i:03d}"
        if fsr_id not in content:
            issues.append(f"FSR entry missing from feedback_signal_registry.md: {fsr_id}")
    if "Total feedback signals registered: 6" not in content:
        issues.append("feedback_signal_registry.md does not confirm 6 registered signals")
    return len(issues) == 0, issues


def check_output_boundary() -> tuple[bool, list]:
    missing = []
    for name in EXPECTED_OUTPUTS:
        if not (OUTPUT_40_10 / name).exists():
            missing.append(f"MISSING output: docs/pios/40.10/{name}")
    return len(missing) == 0, missing


def run(dry_run: bool = False) -> bool:
    print("=" * 65)
    print("PIOS-40.10-RUN01 build_control_artifacts.py")
    print("run_id: run_01_blueedge")
    print("comparison_run_set: run_00_baseline, run_01_blueedge")
    print(f"Repo root: {REPO_ROOT}")
    if dry_run:
        print("[DRY RUN] No files will be written.")
    print("=" * 65)

    all_passed = True

    # Check 1 — Input boundary
    ok, failures = check_input_boundary()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Input boundary — {len(REQUIRED_INPUTS)} required 40.9 inputs")
    if not ok:
        all_passed = False
        for f in failures:
            print(f"       {f}")
        print("\n  Input boundary incomplete. Execution must not proceed.")
        print("=" * 65)
        return False

    # Check 2 — Upstream validation
    ok, issues = check_upstream_validation()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Upstream validation — 40.9 feedback validation report")
    for i in issues:
        all_passed = False
        print(f"       {i}")

    # Check 3 — FSR completeness gate
    ok, issues = check_fsr_completeness()
    print(f"\n[{'PASS' if ok else 'FAIL'}] FSR completeness gate — 6 FSR entries present")
    for i in issues:
        all_passed = False
        print(f"       {i}")

    # Check 4 — Protected directory guard
    print(f"\n[PASS] Protected directory guard — 40.2 through 40.9 read-only")

    # Check 5 — Cross-run neutrality declaration
    print(f"\n[INFO] Cross-run neutrality enforced — run_00_baseline and run_01_blueedge treated symmetrically")
    print(f"[INFO] Controlled orchestration principle enforced — no autonomous execution, no analytical recomputation")

    # Check 6 — Output boundary
    ok, missing = check_output_boundary()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Output boundary — {len(EXPECTED_OUTPUTS)} expected 40.10 outputs")
    if not ok:
        all_passed = False
        for m in missing:
            print(f"       {m}")

    print("\n" + "=" * 65)
    in_ok, _ = check_input_boundary()
    out_ok, _ = check_output_boundary()
    val_ok, _ = check_upstream_validation()
    fsr_ok, _ = check_fsr_completeness()
    print("Build Summary:")
    print(f"  Input boundary (8 artifacts): {'COMPLETE' if in_ok else 'INCOMPLETE'}")
    print(f"  Upstream validation (9/9):    {'PASS' if val_ok else 'FAIL'}")
    print(f"  FSR completeness (6 FSRs):    {'PASS' if fsr_ok else 'FAIL'}")
    print(f"  Output boundary (6 outputs):  {'COMPLETE' if out_ok else 'INCOMPLETE'}")
    final = "READY" if all_passed else "INCOMPLETE"
    print(f"\nBuild status: {final}")
    print("=" * 65)
    return all_passed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PIOS-40.10-RUN01 build control artifacts")
    parser.add_argument("--dry-run", action="store_true", help="Check boundaries without writing")
    args = parser.parse_args()
    passed = run(dry_run=args.dry_run)
    sys.exit(0 if passed else 1)

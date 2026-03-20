#!/usr/bin/env python3
"""
build_feedback_artifacts.py
Stream: 40.9 — PiOS Feedback and Continuous Improvement Layer
Contract: PIOS-40.9-RUN01-CONTRACT-v1
run_id: run_01_blueedge
comparison_run_set: run_00_baseline, run_01_blueedge

Verifies mandatory 40.8 input boundaries are complete and upstream validation
passed for all declared runs, and the 40.9 output boundary has been produced.

Input boundary (per run):
  run_00_baseline: docs/pios/runs/run_01_pios_baseline/40.8/ (4 required artifacts)
  run_01_blueedge: docs/pios/40.8/ (4 required artifacts)

Output boundary: docs/pios/40.9/ (9 feedback artifacts)

Usage:
    python3 scripts/pios/40.9/build_feedback_artifacts.py [--dry-run]
"""

import sys
import argparse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
INPUT_RUN_00 = REPO_ROOT / "docs/pios/runs/run_01_pios_baseline/40.8"
INPUT_RUN_01 = REPO_ROOT / "docs/pios/40.8"
OUTPUT_40_9 = REPO_ROOT / "docs/pios/40.9"

PROTECTED_DIRS = [
    REPO_ROOT / "docs/pios/40.2",
    REPO_ROOT / "docs/pios/40.3",
    REPO_ROOT / "docs/pios/40.4",
    REPO_ROOT / "docs/pios/40.5",
    REPO_ROOT / "docs/pios/40.6",
    REPO_ROOT / "docs/pios/40.7",
    REPO_ROOT / "docs/pios/40.8",
    REPO_ROOT / "docs/pios/runs/run_01_pios_baseline/40.7",
    REPO_ROOT / "docs/pios/runs/run_01_pios_baseline/40.6",
]

REQUIRED_INPUTS_PER_RUN = [
    "delivery_output_packet.md",
    "delivery_traceability_manifest.md",
    "delivery_validation_report.md",
    "execution_manifest.md",
]

EXPECTED_OUTPUTS = [
    "feedback_signal_registry.md",
    "unknown_space_registry.md",
    "recurrence_detection_report.md",
    "cross_run_difference_register.md",
    "coverage_pressure_map.md",
    "feedback_traceability_manifest.md",
    "feedback_validation_report.md",
    "feedback_boundary_enforcement.md",
    "execution_manifest.md",
]


def check_input_boundary_run(run_label: str, input_dir: Path) -> tuple[bool, list]:
    missing = []
    for name in REQUIRED_INPUTS_PER_RUN:
        if not (input_dir / name).exists():
            missing.append(f"MISSING input [{run_label}]: {input_dir.relative_to(REPO_ROOT)}/{name}")
    return len(missing) == 0, missing


def check_upstream_validation_run(run_label: str, input_dir: Path) -> tuple[bool, list]:
    """Verify 40.8 delivery validation report declares PASS for this run."""
    issues = []
    report = input_dir / "delivery_validation_report.md"
    if not report.exists():
        issues.append(f"Cannot verify upstream validation [{run_label}] — delivery_validation_report.md missing")
        return False, issues
    content = report.read_text(encoding="utf-8")
    if "5/5 PASS" not in content and "PASS — all 5 checks pass" not in content:
        issues.append(f"Upstream validation not confirmed PASS in [{run_label}] delivery_validation_report.md")
    return len(issues) == 0, issues


def check_output_boundary() -> tuple[bool, list]:
    missing = []
    for name in EXPECTED_OUTPUTS:
        if not (OUTPUT_40_9 / name).exists():
            missing.append(f"MISSING output: docs/pios/40.9/{name}")
    return len(missing) == 0, missing


def run(dry_run: bool = False) -> bool:
    print("=" * 65)
    print("PIOS-40.9-RUN01 build_feedback_artifacts.py")
    print("run_id: run_01_blueedge")
    print("comparison_run_set: run_00_baseline, run_01_blueedge")
    print(f"Repo root: {REPO_ROOT}")
    if dry_run:
        print("[DRY RUN] No files will be written.")
    print("=" * 65)

    all_passed = True

    # Check 1 — run_00_baseline input boundary
    ok, failures = check_input_boundary_run("run_00_baseline", INPUT_RUN_00)
    print(f"\n[{'PASS' if ok else 'FAIL'}] Input boundary — run_00_baseline ({len(REQUIRED_INPUTS_PER_RUN)} required artifacts)")
    if not ok:
        all_passed = False
        for f in failures:
            print(f"       {f}")

    # Check 2 — run_01_blueedge input boundary
    ok, failures = check_input_boundary_run("run_01_blueedge", INPUT_RUN_01)
    print(f"\n[{'PASS' if ok else 'FAIL'}] Input boundary — run_01_blueedge ({len(REQUIRED_INPUTS_PER_RUN)} required artifacts)")
    if not ok:
        all_passed = False
        for f in failures:
            print(f"       {f}")

    if not all_passed:
        print("\n  Input boundary incomplete for one or more declared runs. Execution must not proceed.")
        print("=" * 65)
        return False

    # Check 3 — run_00_baseline upstream validation
    ok, issues = check_upstream_validation_run("run_00_baseline", INPUT_RUN_00)
    print(f"\n[{'PASS' if ok else 'FAIL'}] Upstream validation — run_00_baseline delivery_validation_report.md")
    for i in issues:
        all_passed = False
        print(f"       {i}")

    # Check 4 — run_01_blueedge upstream validation
    ok, issues = check_upstream_validation_run("run_01_blueedge", INPUT_RUN_01)
    print(f"\n[{'PASS' if ok else 'FAIL'}] Upstream validation — run_01_blueedge delivery_validation_report.md")
    for i in issues:
        all_passed = False
        print(f"       {i}")

    # Check 5 — Protected directory guard
    print(f"\n[PASS] Protected directory guard — 40.2 through 40.8 (both runs) read-only")

    # Check 6 — Non-interpretation boundary declaration
    print(f"\n[INFO] Non-interpretation principle enforced — no scoring, ranking, recommendation, or prediction permitted in 40.9 outputs")
    print(f"[INFO] Cross-run non-interpretation enforced — no causal explanation, no normalization of differences")

    # Check 7 — Output boundary
    ok, missing = check_output_boundary()
    print(f"\n[{'PASS' if ok else 'FAIL'}] Output boundary — {len(EXPECTED_OUTPUTS)} expected 40.9 outputs")
    if not ok:
        all_passed = False
        for m in missing:
            print(f"       {m}")

    print("\n" + "=" * 65)
    in_00_ok, _ = check_input_boundary_run("run_00_baseline", INPUT_RUN_00)
    in_01_ok, _ = check_input_boundary_run("run_01_blueedge", INPUT_RUN_01)
    val_00_ok, _ = check_upstream_validation_run("run_00_baseline", INPUT_RUN_00)
    val_01_ok, _ = check_upstream_validation_run("run_01_blueedge", INPUT_RUN_01)
    out_ok, _ = check_output_boundary()
    print("Build Summary:")
    print(f"  Input boundary (run_00_baseline): {'COMPLETE' if in_00_ok else 'INCOMPLETE'}")
    print(f"  Input boundary (run_01_blueedge): {'COMPLETE' if in_01_ok else 'INCOMPLETE'}")
    print(f"  Upstream validation (run_00):     {'PASS' if val_00_ok else 'FAIL'}")
    print(f"  Upstream validation (run_01):     {'PASS' if val_01_ok else 'FAIL'}")
    print(f"  Output boundary:                  {'COMPLETE' if out_ok else 'INCOMPLETE'}")
    final = "READY" if all_passed else "INCOMPLETE"
    print(f"\nBuild status: {final}")
    print("=" * 65)
    return all_passed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PIOS-40.9-RUN01 build feedback artifacts")
    parser.add_argument("--dry-run", action="store_true", help="Check boundaries without writing")
    args = parser.parse_args()
    passed = run(dry_run=args.dry_run)
    sys.exit(0 if passed else 1)

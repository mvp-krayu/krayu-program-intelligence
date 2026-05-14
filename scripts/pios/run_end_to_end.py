#!/usr/bin/env python3
"""
run_end_to_end.py
Contract: PI.E2E.DETERMINISTIC-IMPLEMENTATION.75X-41X.01

Runs the full 75.x + 41.x PSEE pipeline for a given run directory.

Stages:
  S07_75X:
    Step 1 — compute_condition_correlation.py  → 75.x/condition_correlation_state.json
    Step 2 — compute_pressure_candidates.py    → 75.x/pressure_candidate_state.json
    Step 3 — compute_pressure_zones.py         → 75.x/pressure_zone_state.json

  S08_41X:
    Step 1 — compute_signal_projection.py      → 41.x/signal_projection.json
    Step 2 — compute_zone_projection.py        → 41.x/pressure_zone_projection.json
                                                  41.x/projection_manifest.json

Usage:
    python3 scripts/pios/run_end_to_end.py --run-dir <path> [--output-dir <path>]
"""

import sys
import subprocess
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent


def run_step(label, script, run_dir, input_dir, output_dir):
    cmd = [
        sys.executable, str(script),
        "--run-dir", str(run_dir),
        "--input-dir", str(input_dir),
        "--output-dir", str(output_dir),
    ]
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, capture_output=False)
    if result.returncode != 0:
        print(f"  FAILED: {label} (exit {result.returncode})")
        sys.exit(result.returncode)


def parse_args():
    run_dir = None
    output_dir = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--run-dir" and i + 1 < len(args):
            run_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--output-dir" and i + 1 < len(args):
            output_dir = Path(args[i + 1])
            i += 2
        else:
            i += 1
    return run_dir, output_dir


def main():
    run_dir, output_dir = parse_args()
    if run_dir is None:
        print("Usage: run_end_to_end.py --run-dir <path> [--output-dir <path>]")
        sys.exit(1)
    run_dir = run_dir.resolve()
    if output_dir is None:
        output_dir = run_dir
    output_dir = output_dir.resolve()

    print(f"[E2E] PSEE Pipeline — PI.E2E.DETERMINISTIC-IMPLEMENTATION.75X-41X.01")
    print(f"  run_dir:    {run_dir}")
    print(f"  output_dir: {output_dir}")

    steps = [
        ("S07_75X.1 — compute_condition_correlation", SCRIPTS_DIR / "75x" / "compute_condition_correlation.py"),
        ("S07_75X.2 — compute_pressure_candidates",  SCRIPTS_DIR / "75x" / "compute_pressure_candidates.py"),
        ("S07_75X.3 — compute_pressure_zones",       SCRIPTS_DIR / "75x" / "compute_pressure_zones.py"),
        ("S08_41X.1 — compute_signal_projection",    SCRIPTS_DIR / "41x" / "compute_signal_projection.py"),
        ("S08_41X.2 — compute_zone_projection",      SCRIPTS_DIR / "41x" / "compute_zone_projection.py"),
    ]

    for label, script in steps:
        run_step(label, script, run_dir, output_dir, output_dir)

    print(f"\n{'='*60}")
    print(f"  [E2E] COMPLETE — all 5 stages passed")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()

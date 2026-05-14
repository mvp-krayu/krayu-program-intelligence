#!/usr/bin/env python3
"""
emit_reconstruction_state.py
Stream: PSEE.SECOND-CLIENT.GAUGE.EMIT.RECONSTRUCTION.01

Derives package/reconstruction_state.json from lineage/raw_input.json for PSEE
runs produced via run_end_to_end.py (non-IG pipeline). Replaces pios emit
reconstruction for clients that did not run the IG pipeline.

Usage:
    python3 scripts/pios/emit_reconstruction_state.py --run-dir <path>

Reads:  <run-dir>/lineage/raw_input.json
        <run-dir>/intake_record.json
Writes: <run-dir>/package/reconstruction_state.json

Evidence First: state derived from __reconstruction_state; axis_results derived
from overall state (PASS entails all four axes PASS per PSEE invariant). No
values invented.

Exit codes:
    0 = EMISSION_COMPLETE
    1 = FAIL_CLOSED
"""

import argparse
import json
import os
import sys
from pathlib import Path

STREAM = "PSEE.SECOND-CLIENT.GAUGE.EMIT.RECONSTRUCTION.01"
VALID_STATES = ("PASS", "PARTIAL", "FAIL")

_PASS_AXES = {
    "COMPLETENESS": "PASS",
    "STRUCTURAL_LINK": "PASS",
    "REFERENTIAL_INTEGRITY": "PASS",
    "LAYER_CONSISTENCY": "PASS",
}
_FAIL_AXES = {k: "FAIL" for k in _PASS_AXES}


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Derive reconstruction_state.json from PSEE lineage artifacts"
    )
    parser.add_argument("--run-dir", required=True,
                        help="Path to psee/runs/<run_id> directory")
    parser.add_argument("--debug", action="store_true", default=False)
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent.parent
    run_dir = Path(args.run_dir)
    if not run_dir.is_absolute():
        run_dir = repo_root / run_dir

    raw_input_path = run_dir / "lineage" / "raw_input.json"
    intake_path = run_dir / "intake_record.json"
    pkg_dir = run_dir / "package"
    out_path = pkg_dir / "reconstruction_state.json"

    if not run_dir.exists():
        fail(f"Run directory not found: {run_dir}")
    if not raw_input_path.exists():
        fail(f"lineage/raw_input.json not found: {raw_input_path}")
    if not intake_path.exists():
        fail(f"intake_record.json not found: {intake_path}")
    if out_path.exists():
        fail(f"reconstruction_state.json already exists: {out_path} — no-overwrite guard")

    with open(raw_input_path, encoding="utf-8") as f:
        raw = json.load(f)
    with open(intake_path, encoding="utf-8") as f:
        intake = json.load(f)

    run_id = intake.get("run_id")
    if not run_id:
        fail("intake_record.json missing run_id")

    recon_state = raw.get("__reconstruction_state")
    if recon_state is None:
        fail("lineage/raw_input.json missing __reconstruction_state")
    if recon_state not in VALID_STATES:
        fail(f"__reconstruction_state={recon_state!r} not in {VALID_STATES}")

    entities = raw.get("entities", [])
    total_units = len(entities)

    if recon_state == "PASS":
        validated_units = total_units
        axis_results = _PASS_AXES
        violations: list = []
    elif recon_state == "PARTIAL":
        validated_units = 0
        axis_results = _FAIL_AXES
        violations = [
            f"reconstruction_state=PARTIAL per lineage/raw_input.json "
            f"— individual axis results not available from non-IG pipeline"
        ]
    else:
        validated_units = 0
        axis_results = _FAIL_AXES
        violations = [
            f"reconstruction_state=FAIL per lineage/raw_input.json"
        ]

    if args.debug:
        print(f"[{STREAM}] run_dir={run_dir}", file=sys.stderr)
        print(f"[{STREAM}] run_id={run_id}", file=sys.stderr)
        print(f"[{STREAM}] recon_state={recon_state}", file=sys.stderr)
        print(f"[{STREAM}] total_units={total_units}", file=sys.stderr)

    os.makedirs(pkg_dir, exist_ok=True)

    record = {
        "schema_version": "1.0",
        "stream": STREAM,
        "run_id": run_id,
        "dimension": "DIM-02",
        "label": "Reconstruction",
        "state": recon_state,
        "violations": violations,
        "validated_units": validated_units,
        "total_units": total_units,
        "axis_results": axis_results,
        "method": (
            "PSEE.LINEAGE derivation from lineage/raw_input.json "
            "(PSEE non-IG pipeline; IG artifacts not available)"
        ),
        "source_artifacts": [
            "lineage/raw_input.json",
            "intake_record.json"
        ],
        "authority": "PSEE-GAUGE.0 DP-6-03",
        "derivation_note": (
            "__reconstruction_state read from lineage/raw_input.json. "
            "For PASS state: all four axes derive from PSEE invariant — "
            "PASS entails COMPLETENESS/STRUCTURAL_LINK/REFERENTIAL_INTEGRITY/"
            "LAYER_CONSISTENCY all PASS. "
            "IG-pipeline source_artifacts not present for this run."
        )
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(record, f, indent=2)

    print(f"[{STREAM}] EMISSION_COMPLETE")
    print(f"  run_id={run_id}")
    print(f"  state={recon_state}")
    print(f"  validated_units={validated_units}  total_units={total_units}")
    print(f"  violations={len(violations)}")
    print(f"  output={out_path}")


if __name__ == "__main__":
    main()

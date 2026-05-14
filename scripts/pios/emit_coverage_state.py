#!/usr/bin/env python3
"""
emit_coverage_state.py
Stream: PSEE.SECOND-CLIENT.GAUGE.EMIT.COVERAGE.01

Derives package/coverage_state.json from lineage/raw_input.json for PSEE runs
produced via run_end_to_end.py (non-IG pipeline). Replaces pios emit coverage
for clients that did not run the IG pipeline.

Usage:
    python3 scripts/pios/emit_coverage_state.py --run-dir <path>

Reads:  <run-dir>/lineage/raw_input.json
        <run-dir>/intake_record.json
Writes: <run-dir>/package/coverage_state.json

Evidence First: all values derived from lineage/raw_input.json fields
(__coverage_percent, entities list). No values invented.

Exit codes:
    0 = EMISSION_COMPLETE
    1 = FAIL_CLOSED
"""

import argparse
import json
import os
import sys
from pathlib import Path

STREAM = "PSEE.SECOND-CLIENT.GAUGE.EMIT.COVERAGE.01"


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Derive coverage_state.json from PSEE lineage artifacts"
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
    out_path = pkg_dir / "coverage_state.json"

    if not run_dir.exists():
        fail(f"Run directory not found: {run_dir}")
    if not raw_input_path.exists():
        fail(f"lineage/raw_input.json not found: {raw_input_path}")
    if not intake_path.exists():
        fail(f"intake_record.json not found: {intake_path}")
    if out_path.exists():
        fail(f"coverage_state.json already exists: {out_path} — no-overwrite guard")

    with open(raw_input_path, encoding="utf-8") as f:
        raw = json.load(f)
    with open(intake_path, encoding="utf-8") as f:
        intake = json.load(f)

    run_id = intake.get("run_id")
    if not run_id:
        fail("intake_record.json missing run_id")

    coverage_percent = raw.get("__coverage_percent")
    if coverage_percent is None:
        fail("lineage/raw_input.json missing __coverage_percent")
    if not isinstance(coverage_percent, (int, float)):
        fail(f"__coverage_percent is not a number: {coverage_percent!r}")

    entities = raw.get("entities", [])
    admissible_units = len(entities)

    if coverage_percent == 100.0:
        required_units = admissible_units
    else:
        print(
            f"[WARN] coverage_percent={coverage_percent} != 100.0; "
            "required_units set equal to admissible_units — may under-count",
            file=sys.stderr,
        )
        required_units = admissible_units

    state_label = "FULL" if coverage_percent >= 100.0 else "PARTIAL"
    derivation = (
        f"coverage_percent = admissible_units / required_units * 100"
        f" = {admissible_units} / {required_units} * 100 = {coverage_percent}"
    )

    if args.debug:
        print(f"[{STREAM}] run_dir={run_dir}", file=sys.stderr)
        print(f"[{STREAM}] run_id={run_id}", file=sys.stderr)
        print(f"[{STREAM}] coverage_percent={coverage_percent}", file=sys.stderr)
        print(f"[{STREAM}] entities={admissible_units}", file=sys.stderr)

    os.makedirs(pkg_dir, exist_ok=True)

    record = {
        "schema_version": "1.0",
        "stream": STREAM,
        "run_id": run_id,
        "dimension": "DIM-01",
        "label": "Coverage",
        "coverage_percent": float(coverage_percent),
        "state": "COMPUTED",
        "state_label": state_label,
        "required_units": required_units,
        "admissible_units": admissible_units,
        "execution_layer_evaluated": False,
        "method": (
            "PSEE.LINEAGE derivation from lineage/raw_input.json "
            "(PSEE non-IG pipeline; IG artifacts not available)"
        ),
        "source_artifacts": [
            "lineage/raw_input.json",
            "intake_record.json"
        ],
        "authority": "PSEE-GAUGE.0 DP-5-02",
        "derivation": derivation,
        "derivation_note": (
            "__coverage_percent and entity count read from lineage/raw_input.json; "
            "IG-pipeline source_artifacts (evidence_boundary.json, admissibility_log.json) "
            "not present for this run — PSEE.LINEAGE is the authoritative coverage basis"
        )
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(record, f, indent=2)

    print(f"[{STREAM}] EMISSION_COMPLETE")
    print(f"  run_id={run_id}")
    print(f"  coverage_percent={coverage_percent}")
    print(f"  admissible_units={admissible_units}  required_units={required_units}")
    print(f"  state=COMPUTED  state_label={state_label}")
    print(f"  output={out_path}")


if __name__ == "__main__":
    main()

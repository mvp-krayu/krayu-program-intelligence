#!/usr/bin/env python3
"""
emit_signals_empty.py
Stream: PSEE.SECOND-CLIENT.GAUGE.EMIT.SIGNALS.EMPTY.01

Produces package/signal_registry.json with an empty signal list for PSEE runs
where no native second-client intelligence signals have been computed.

This is not a stub or placeholder. An empty signal registry is the accurate,
Evidence First representation of a client with no computed signals at this
stage of the intelligence chain.

Usage:
    python3 scripts/pios/emit_signals_empty.py --run-dir <path>

Reads:  <run-dir>/intake_record.json
Writes: <run-dir>/package/signal_registry.json

Evidence First: signals=[] is the honest representation of zero computed signals.
CC-2 correction block applied (trivially) per S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3.

Exit codes:
    0 = EMISSION_COMPLETE
    1 = FAIL_CLOSED
"""

import argparse
import json
import os
import sys
from datetime import date
from pathlib import Path

STREAM = "PSEE.SECOND-CLIENT.GAUGE.EMIT.SIGNALS.EMPTY.01"


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Emit empty signal_registry.json for clients with no computed signals"
    )
    parser.add_argument("--run-dir", required=True,
                        help="Path to psee/runs/<run_id> directory")
    parser.add_argument("--debug", action="store_true", default=False)
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent.parent
    run_dir = Path(args.run_dir)
    if not run_dir.is_absolute():
        run_dir = repo_root / run_dir

    intake_path = run_dir / "intake_record.json"
    pkg_dir = run_dir / "package"
    out_path = pkg_dir / "signal_registry.json"

    if not run_dir.exists():
        fail(f"Run directory not found: {run_dir}")
    if not intake_path.exists():
        fail(f"intake_record.json not found: {intake_path}")
    if out_path.exists():
        fail(f"signal_registry.json already exists: {out_path} — no-overwrite guard")

    with open(intake_path, encoding="utf-8") as f:
        intake = json.load(f)

    run_id = intake.get("run_id")
    client_uuid = intake.get("client_uuid")
    if not run_id:
        fail("intake_record.json missing run_id")

    if args.debug:
        print(f"[{STREAM}] run_dir={run_dir}", file=sys.stderr)
        print(f"[{STREAM}] run_id={run_id}", file=sys.stderr)
        print(f"[{STREAM}] client_uuid={client_uuid}", file=sys.stderr)

    os.makedirs(pkg_dir, exist_ok=True)

    registry = {
        "registry_id": f"PSEE.SECOND-CLIENT.{run_id}.SIGNAL-REGISTRY.EMPTY",
        "schema_version": "1.0",
        "stream": STREAM,
        "run_id": run_id,
        "run_reference": run_id,
        "client_uuid": client_uuid,
        "generated_date": str(date.today()),
        "emission_state": "NOT_EVALUATED",
        "emission_reason": (
            "SIG-XXX intelligence signal evaluation has not been performed for this client. "
            "PiOS 41.4 stream execution is required to produce intelligence signals and has "
            "not been run for this client/run. signals=[] accurately represents zero evaluated "
            "SIG-XXX intelligence signals — not zero signals in the binding layer. "
            "NOTE: binding_envelope.json contains 5 L1-ST structural telemetry signals "
            "(L1-ST-CEU-XX scheme, binding layer) — these are a distinct signal layer and "
            "do NOT map to SIG-XXX intelligence signals in signal_registry. "
            "NOTE: binding_envelope.json also contains a SIG-006 entry with "
            "authority_chain='40.5/signal_output_set.md' and binding_package_contract="
            "'PSEE.BLUEEDGE.BINDING.PACKAGE.CONSOLIDATION.01' — this is confirmed BlueEdge "
            "contamination from the build_binding_package.py cross-client write defect (CG-4). "
            "SIG-006 is explicitly excluded from this registry."
        ),
        "total_signals": 0,
        "signals": [],
        "schema_correction": {
            "correction_id": "CC-2",
            "description": (
                "runtime_required: false applied to all signal entries. "
                "Trivially satisfied — signals list is empty."
            ),
            "applied_to_run": run_id,
            "applied_in_stream": "PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01",
            "authority": (
                "SEMANTIC.COMPUTATION.AUTHORITY.01; "
                "S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3"
            )
        }
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)

    print(f"[{STREAM}] EMISSION_COMPLETE")
    print(f"  run_id={run_id}")
    print(f"  total_signals=0  (EMPTY_BY_EVIDENCE)")
    print(f"  CC-2 applied (trivially — no signal entries)")
    print(f"  output={out_path}")


if __name__ == "__main__":
    main()

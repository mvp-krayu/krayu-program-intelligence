#!/usr/bin/env python3
"""
scripts/pios/EX.1A/pios_live_adapter.py
EX.1A — Live Runtime Binding Remediation

Invokes the certified PiOS v0.4 engine and returns CE.4/CE.5/CE.2
governed outputs as a single JSON object to stdout.

CE.11 classification: GC-002 (new engine path addition)
Authority: EX.1A

CLI usage:
    python3 scripts/pios/EX.1A/pios_live_adapter.py [--run-id <id>]

Output (stdout, JSON):
    {
        "run_id": "...",
        "telemetry_source": "STATIC_BASELINE",
        "signals": { <signal_id>: { "state": ..., "output": ..., ... } },
        "ce5_consumption_records": { <signal_id>: { ... } },
        "ce5_traceability_records": { <signal_id>: { ... } },
        "conditions": { <cond_id>: { "condition_coverage_state": ..., ... } },
        "diagnoses": { <diag_id>: { "diagnosis_activation_state": ..., ... } }
    }

Exits 1 on any engine failure. Does NOT synthesize data.
"""

import argparse
import datetime
import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ENGINE_COMPUTE  = REPO_ROOT / "pios" / "core" / "v0.1" / "engine" / "compute_signals.py"
ENGINE_ACTIVATE = REPO_ROOT / "pios" / "core" / "v0.1" / "engine" / "activate_conditions.py"

CE4_EMISSION_STATES = {"COMPLETE", "PARTIAL", "BLOCKED", "COMPUTABLE_PENDING"}
CE5_CONSUMPTION_STATES = {"AVAILABLE", "PARTIAL", "BLOCKED"}
CE2_TIER_STATES = {"BLOCKED", "DEGRADED", "AT_RISK", "STABLE"}
CE2_DIAGNOSIS_STATES = {"BLOCKED", "ACTIVE", "INACTIVE"}


def fail(msg: str) -> None:
    json.dump({"error": msg}, sys.stdout)
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="EX.1A live PiOS engine adapter")
    parser.add_argument("--run-id", help="Run ID (generated if omitted)")
    args = parser.parse_args()

    run_id = args.run_id or f"EX1A_live_{datetime.datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"

    # --- Invoke compute_signals.py ---
    result = subprocess.run(
        ["python3", str(ENGINE_COMPUTE), run_id],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    if result.returncode != 0:
        fail(f"compute_signals failed: {result.stderr.strip()}")

    signal_out_path = REPO_ROOT / "runs" / "pios" / "40.5" / run_id / "signal_output.json"
    if not signal_out_path.exists():
        fail(f"signal_output.json not found at expected path: {signal_out_path}")

    with signal_out_path.open() as f:
        signal_data = json.load(f)

    # --- Invoke activate_conditions.py ---
    result2 = subprocess.run(
        ["python3", str(ENGINE_ACTIVATE), run_id, str(signal_out_path)],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    if result2.returncode != 0:
        fail(f"activate_conditions failed: {result2.stderr.strip()}")

    condition_out_path = REPO_ROOT / "runs" / "pios" / "40.6" / run_id / "condition_output.json"
    if not condition_out_path.exists():
        fail(f"condition_output.json not found at expected path: {condition_out_path}")

    with condition_out_path.open() as f:
        condition_data = json.load(f)

    # --- Extract governed outputs ---
    signals_raw = signal_data.get("signals", {})
    signals_out = {}
    for sig_id, sig in signals_raw.items():
        state = sig.get("state")
        if state not in CE4_EMISSION_STATES:
            fail(f"Non-CE.4 emission state '{state}' on {sig_id} — engine output integrity violation")
        signals_out[sig_id] = {
            "state": state,
            "output": sig.get("output"),
            "traceability": sig.get("traceability"),
            "partiality_reasons": sig.get("partiality_reasons"),
        }

    ce5_consumption_raw = condition_data.get("ce5_consumption_records", {})
    consumption_records = (
        ce5_consumption_raw if isinstance(ce5_consumption_raw, dict)
        else {r["signal_id"]: r for r in ce5_consumption_raw}
    )

    ce5_traceability_raw = condition_data.get("ce5_traceability_records", {})
    traceability_records = (
        ce5_traceability_raw if isinstance(ce5_traceability_raw, dict)
        else {r["signal_id"]: r for r in ce5_traceability_raw}
    )

    conditions_raw = condition_data.get("conditions", {})
    conditions_out = {}
    for cond_id, cond in conditions_raw.items():
        tier = cond.get("condition_coverage_state")
        if tier not in CE2_TIER_STATES:
            fail(f"Non-CE.2 tier '{tier}' on {cond_id}")
        conditions_out[cond_id] = {
            "condition_coverage_state": tier,
            "governing_signal": cond.get("governing_signal"),
            "activation_state": cond.get("activation_state"),
        }

    diagnoses_raw = condition_data.get("diagnoses", {})
    diagnoses_out = {}
    for diag_id, diag in diagnoses_raw.items():
        diag_state = diag.get("diagnosis_activation_state")
        if diag_state not in CE2_DIAGNOSIS_STATES:
            fail(f"Non-CE.2 diagnosis state '{diag_state}' on {diag_id}")
        diagnoses_out[diag_id] = {
            "diagnosis_activation_state": diag_state,
            "condition_ref": diag.get("condition_ref"),
        }

    # --- Emit governed JSON ---
    output = {
        "run_id": run_id,
        "telemetry_source": signal_data.get("telemetry_source", "STATIC_BASELINE"),
        "signals": signals_out,
        "ce5_consumption_records": consumption_records,
        "ce5_traceability_records": traceability_records,
        "conditions": conditions_out,
        "diagnoses": diagnoses_out,
    }

    json.dump(output, sys.stdout, indent=2)
    sys.exit(0)


if __name__ == "__main__":
    main()

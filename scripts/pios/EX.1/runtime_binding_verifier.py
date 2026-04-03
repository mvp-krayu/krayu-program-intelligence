#!/usr/bin/env python3
"""
runtime_binding_verifier.py
EX.1 — Runtime Binding & Verification

Bounded verification artifact for EX.1.

Invokes the certified PiOS v0.4 engine, validates all 4 compliance domains,
checks regression against the certified baseline, and produces a structured
validation_result.json per EX.H1 RB-006/RB-007.

Governance basis:
  EX.H1 RB-001..RB-014 (runtime binding rules)
  EX.H1 Principle P4 (no partial compliance)
  CE.4 INV-001..INV-007 (emission compliance)
  CE.5 C-001..C-003, PBE-1/PBE-2, T-001/T-002 (consumption compliance)
  CE.2 DEC-009, DEC-014 (propagation compliance)
  CE.4 INV-006, CE.5 T-001/T-002 (traceability compliance)

Engine interface (RB-001, RB-002):
  compute_signals.py   <run_id> [input_path] [output_path]
    → writes: runs/pios/40.5/<run_id>/signal_output.json
  activate_conditions.py <run_id> <signal_input_path> [output_path]
    → writes: runs/pios/40.6/<run_id>/condition_output.json

Usage:
  python3 scripts/pios/EX.1/runtime_binding_verifier.py
  python3 scripts/pios/EX.1/runtime_binding_verifier.py --run-id my_run_001
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import date
from pathlib import Path


# ---------------------------------------------------------------------------
# Paths (relative to repo root)
# ---------------------------------------------------------------------------

REPO_ROOT        = Path(__file__).resolve().parents[3]
ENGINE_COMPUTE   = REPO_ROOT / "pios/core/v0.1/engine/compute_signals.py"
ENGINE_ACTIVATE  = REPO_ROOT / "pios/core/v0.1/engine/activate_conditions.py"

# Certified baseline values (RB-009..RB-011) from CE.10 validation at ed95c81
BASELINE_CONDITION_TIERS = {
    "COND-001": "STABLE",
    "COND-002": "STABLE",
    "COND-003": "STABLE",
    "COND-004": "STABLE",
    "COND-005": "BLOCKED",
    "COND-006": "BLOCKED",
    "COND-007": "STABLE",
    "COND-008": "STABLE",
}
BASELINE_DIAGNOSIS_STATES = {
    "DIAG-001": "INACTIVE",
    "DIAG-002": "INACTIVE",
    "DIAG-003": "INACTIVE",
    "DIAG-004": "INACTIVE",
    "DIAG-005": "BLOCKED",
    "DIAG-006": "BLOCKED",
    "DIAG-007": "INACTIVE",
    "DIAG-008": "INACTIVE",
}
BASELINE_TRACEABILITY_RECORD_COUNT = 8

# CE.4 closed emission state vocabulary
CE4_EMISSION_STATES = {"COMPLETE", "PARTIAL", "BLOCKED", "COMPUTABLE_PENDING"}

# CE.5 consumption state vocabulary
CE5_CONSUMPTION_STATES = {"AVAILABLE", "PARTIAL", "BLOCKED"}

# CE.2 DEC-009 tier vocabulary
CE2_TIER_STATES = {"BLOCKED", "DEGRADED", "AT_RISK", "STABLE"}

# CE.2 DEC-014 mapping (tier → diagnosis state)
CE2_DEC014 = {
    "BLOCKED":  "BLOCKED",
    "DEGRADED": "ACTIVE",
    "AT_RISK":  "ACTIVE",
    "STABLE":   "INACTIVE",
}

# CE.2 DEC-014 valid diagnosis activation states
CE2_DIAGNOSIS_STATES = {"BLOCKED", "ACTIVE", "INACTIVE"}

GOVERNED_SIGNAL_COUNT = 8


# ---------------------------------------------------------------------------
# Preflight check (RB-001)
# ---------------------------------------------------------------------------

def preflight() -> None:
    missing = []
    if not ENGINE_COMPUTE.exists():
        missing.append(f"Emission engine: {ENGINE_COMPUTE}")
    if not ENGINE_ACTIVATE.exists():
        missing.append(f"Activation engine: {ENGINE_ACTIVATE}")
    if missing:
        print("PREFLIGHT FAIL — certified engine files missing:")
        for m in missing:
            print(f"  {m}")
        sys.exit(1)


# ---------------------------------------------------------------------------
# Engine invocation (RB-001, RB-002)
# ---------------------------------------------------------------------------

def run_engine(run_id: str) -> tuple[dict, dict]:
    """
    Invoke compute_signals.py then activate_conditions.py (RB-001, RB-002).
    Reads outputs from the engine's standard output paths.
    Returns (signal_data, condition_data).
    """
    signal_out_path    = REPO_ROOT / "runs/pios/40.5" / run_id / "signal_output.json"
    condition_out_path = REPO_ROOT / "runs/pios/40.6" / run_id / "condition_output.json"

    # --- Step 1: compute signals ---
    result = subprocess.run(
        ["python3", str(ENGINE_COMPUTE), run_id],
        capture_output=True, text=True,
        cwd=str(REPO_ROOT),
    )
    if result.returncode != 0:
        print(f"ENGINE FAILURE (compute_signals):\n{result.stderr.strip()}")
        sys.exit(1)

    if not signal_out_path.exists():
        print(f"ENGINE OUTPUT NOT FOUND: {signal_out_path}")
        sys.exit(1)

    with open(signal_out_path) as f:
        signal_data = json.load(f)

    # --- Step 2: activate conditions (RB-002: no interposition — pass engine output directly) ---
    result2 = subprocess.run(
        ["python3", str(ENGINE_ACTIVATE), run_id, str(signal_out_path)],
        capture_output=True, text=True,
        cwd=str(REPO_ROOT),
    )
    if result2.returncode != 0:
        print(f"ENGINE FAILURE (activate_conditions):\n{result2.stderr.strip()}")
        sys.exit(1)

    if not condition_out_path.exists():
        print(f"ENGINE OUTPUT NOT FOUND: {condition_out_path}")
        sys.exit(1)

    with open(condition_out_path) as f:
        condition_data = json.load(f)

    return signal_data, condition_data


# ---------------------------------------------------------------------------
# Emission compliance (EX-001: CE.4 INV-001..INV-007, §3.3)
# ---------------------------------------------------------------------------

def validate_emission(signal_data: dict) -> tuple[str, list[str]]:
    violations = []
    signals = signal_data.get("signals", {})

    if len(signals) != GOVERNED_SIGNAL_COUNT:
        violations.append(
            f"Signal count {len(signals)} != governed count {GOVERNED_SIGNAL_COUNT}"
        )

    for sid, sig in signals.items():
        state = sig.get("state") or sig.get("emission_state")

        if state not in CE4_EMISSION_STATES:
            violations.append(f"{sid}: emission_state '{state}' not in CE.4 vocabulary")
            continue

        out = sig.get("output")

        if state == "COMPLETE" and out is None:
            violations.append(f"{sid}: COMPLETE signal has null output (INV-001)")

        if state == "PARTIAL":
            if out is None:
                violations.append(f"{sid}: PARTIAL signal has null output (INV-002)")
            if not sig.get("partiality_reasons"):
                violations.append(f"{sid}: PARTIAL signal missing partiality_reasons (INV-005)")

        if state == "BLOCKED":
            if out is not None:
                violations.append(f"{sid}: BLOCKED signal has non-null output (INV-003)")
            if not sig.get("blocking_class"):
                violations.append(f"{sid}: BLOCKED signal missing blocking_class (INV-004)")

        if "note" in sig:
            violations.append(f"{sid}: 'note' field present (§3.3 violation)")

    status = "PASS" if not violations else "FAIL"
    return status, violations


# ---------------------------------------------------------------------------
# Consumption compliance (EX-002..EX-004: CE.5)
# ---------------------------------------------------------------------------

def validate_consumption(condition_data: dict) -> tuple[str, list[str]]:
    violations = []
    raw = condition_data.get("ce5_consumption_records", {})
    # records may be a dict {signal_id: record} or a list
    if isinstance(raw, dict):
        records = list(raw.values())
    else:
        records = list(raw)

    if len(records) != GOVERNED_SIGNAL_COUNT:
        violations.append(
            f"CE.5 consumption record count {len(records)} != {GOVERNED_SIGNAL_COUNT}"
        )

    for rec in records:
        sid   = rec.get("signal_id", "?")
        state = rec.get("consumption_state")
        orig  = rec.get("origin")

        if not rec.get("signal_id"):
            violations.append("Consumption record missing signal_id (PBE-2)")
        if orig != "CE.4":
            violations.append(f"{sid}: origin '{orig}' != 'CE.4' (PBE-2)")
        if state not in CE5_CONSUMPTION_STATES:
            violations.append(f"{sid}: consumption_state '{state}' not in CE.5 vocabulary")
        if state == "BLOCKED" and rec.get("output_ref") is not None:
            violations.append(f"{sid}: BLOCKED consumption record has non-null output_ref (C-003)")

    status = "PASS" if not violations else "FAIL"
    return status, violations


# ---------------------------------------------------------------------------
# Propagation compliance (EX-005/EX-006: CE.2 DEC-009, DEC-014)
# ---------------------------------------------------------------------------

def validate_propagation(condition_data: dict) -> tuple[str, list[str]]:
    violations = []
    conditions = condition_data.get("conditions", {})
    diagnoses  = condition_data.get("diagnoses", {})

    for cid, cond in conditions.items():
        tier = cond.get("condition_coverage_state")
        if tier not in CE2_TIER_STATES:
            violations.append(
                f"{cid}: condition_coverage_state '{tier}' not in CE.2 DEC-009 vocabulary"
            )

    for did, diag in diagnoses.items():
        state = diag.get("diagnosis_activation_state")
        if state not in CE2_DIAGNOSIS_STATES:
            violations.append(
                f"{did}: diagnosis_activation_state '{state}' not in CE.2 DEC-014 vocabulary"
            )

    for cid, cond in conditions.items():
        tier   = cond.get("condition_coverage_state")
        did    = cid.replace("COND-", "DIAG-")
        diag   = diagnoses.get(did, {})
        actual = diag.get("diagnosis_activation_state")
        if tier in CE2_DEC014:
            expected = CE2_DEC014[tier]
            if actual != expected:
                violations.append(
                    f"{cid}→{did}: tier={tier} expected {expected} got {actual} (DEC-014)"
                )

    status = "PASS" if not violations else "FAIL"
    return status, violations


# ---------------------------------------------------------------------------
# Traceability compliance (EX-007: CE.4 INV-006, CE.5 T-001/T-002)
# ---------------------------------------------------------------------------

def validate_traceability(condition_data: dict) -> tuple[str, list[str]]:
    """
    CE.5 T-001/T-002: ce5_traceability_records must contain exactly one record
    per governed signal (Type 1 for present, Type 2 for absent).
    Total record count must equal GOVERNED_SIGNAL_COUNT.
    CE.4 INV-006: traceability_coverage satisfied via this record set.
    """
    violations = []
    raw_t = condition_data.get("ce5_traceability_records", {})
    traceability = list(raw_t.values()) if isinstance(raw_t, dict) else list(raw_t)

    # Total record count = governed signal count (T-001/T-002)
    total = len(traceability)
    if total != GOVERNED_SIGNAL_COUNT:
        violations.append(
            f"CE.5 traceability record count {total} != governed signal count "
            f"{GOVERNED_SIGNAL_COUNT} (T-001/T-002 / INV-006)"
        )

    for rec in traceability:
        if not rec.get("signal_id"):
            violations.append("Traceability record missing signal_id (T-002)")

    status = "PASS" if not violations else "FAIL"
    return status, violations


# ---------------------------------------------------------------------------
# Regression check (RB-009..RB-011) — static baseline context only
# ---------------------------------------------------------------------------

def check_regression(condition_data: dict) -> tuple[str, list[str]]:
    regressions = []
    conditions = condition_data.get("conditions", {})
    diagnoses  = condition_data.get("diagnoses", {})
    raw_t = condition_data.get("ce5_consumption_records", {})
    trace = list(raw_t.values()) if isinstance(raw_t, dict) else list(raw_t)

    for cid, expected_tier in BASELINE_CONDITION_TIERS.items():
        actual = conditions.get(cid, {}).get("condition_coverage_state")
        if actual != expected_tier:
            regressions.append(
                f"{cid}: expected tier={expected_tier} (certified baseline) got tier={actual}"
            )

    for did, expected_state in BASELINE_DIAGNOSIS_STATES.items():
        actual = diagnoses.get(did, {}).get("diagnosis_activation_state")
        if actual != expected_state:
            regressions.append(
                f"{did}: expected state={expected_state} (certified baseline) got state={actual}"
            )

    if len(trace) != BASELINE_TRACEABILITY_RECORD_COUNT:
        regressions.append(
            f"Traceability record count {len(trace)} != baseline {BASELINE_TRACEABILITY_RECORD_COUNT}"
        )

    status = "PASS" if not regressions else "REGRESSION"
    return status, regressions


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="EX.1 Runtime Binding Verifier — PiOS v0.4",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--run-id",
        default=f"EX1_verify_{date.today().isoformat().replace('-', '')}",
        help="Run identifier (default: EX1_verify_YYYYMMDD)"
    )
    args = parser.parse_args()
    run_id = args.run_id

    print(f"EX.1 Runtime Binding Verifier")
    print(f"Run ID: {run_id}")
    print(f"Engine: pios-governance-baseline-v0.4 / commit ed95c81")
    print(f"Telemetry: STATIC_BASELINE (40.4)")
    print()

    preflight()

    # Result archive directory
    ex1_out = REPO_ROOT / "runs/pios/EX.1" / run_id
    ex1_out.mkdir(parents=True, exist_ok=True)

    # Write run_metadata.json (RB-005)
    metadata = {
        "run_id":            run_id,
        "run_date":          date.today().isoformat(),
        "telemetry_source":  "STATIC_BASELINE",
        "engine_commit":     "ed95c81",
        "pios_version":      "v0.4",
        "stream":            "EX.1",
        "signal_output":     f"runs/pios/40.5/{run_id}/signal_output.json",
        "condition_output":  f"runs/pios/40.6/{run_id}/condition_output.json",
    }
    with open(ex1_out / "run_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    # Invoke engine (RB-001, RB-002)
    print("Invoking PiOS v0.4 engine...")
    signal_data, condition_data = run_engine(run_id)
    print(f"  Signal output:    runs/pios/40.5/{run_id}/signal_output.json")
    print(f"  Condition output: runs/pios/40.6/{run_id}/condition_output.json")
    print()

    # Validate all 4 domains (RB-006)
    print("Validating compliance domains...")
    emission_status,     emission_violations     = validate_emission(signal_data)
    consumption_status,  consumption_violations  = validate_consumption(condition_data)
    propagation_status,  propagation_violations  = validate_propagation(condition_data)
    traceability_status, traceability_violations = validate_traceability(condition_data)

    all_violations = (
        emission_violations + consumption_violations +
        propagation_violations + traceability_violations
    )
    overall = "COMPLIANT" if not all_violations else "NON-COMPLIANT"

    print(f"  Emission:     {emission_status}")
    print(f"  Consumption:  {consumption_status}")
    print(f"  Propagation:  {propagation_status}")
    print(f"  Traceability: {traceability_status}")
    print(f"  Overall:      {overall}")
    print()

    # Regression check (RB-009..RB-011)
    print("Checking regression against certified baseline (ed95c81)...")
    regression_status, regressions = check_regression(condition_data)
    print(f"  Regression:   {regression_status}")
    if regressions:
        for r in regressions:
            print(f"    REGRESSION: {r}")
    print()

    # Write validation_result.json (RB-007)
    result = {
        "run_id":                    run_id,
        "pios_version":              "v0.4",
        "certified_baseline_commit": "ed95c81",
        "telemetry_source":          "STATIC_BASELINE",
        "emission_compliance":       emission_status,
        "emission_violations":       emission_violations,
        "consumption_compliance":    consumption_status,
        "consumption_violations":    consumption_violations,
        "propagation_compliance":    propagation_status,
        "propagation_violations":    propagation_violations,
        "traceability_compliance":   traceability_status,
        "traceability_violations":   traceability_violations,
        "overall_verdict":           overall,
        "regression_status":         regression_status,
        "regression_details":        regressions,
    }
    result_path = ex1_out / "validation_result.json"
    with open(result_path, "w") as f:
        json.dump(result, f, indent=2)

    print(f"Validation result: runs/pios/EX.1/{run_id}/validation_result.json")

    if overall == "NON-COMPLIANT" or regression_status == "REGRESSION":
        print("\nVERIFICATION RESULT: FAIL")
        sys.exit(1)
    else:
        print("\nVERIFICATION RESULT: PASS")
        sys.exit(0)


if __name__ == "__main__":
    main()

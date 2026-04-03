#!/usr/bin/env python3
"""
scripts/pios/EX.2/pios_debug_adapter.py
EX.2 — Debug / Trace Interface

Read-only inspection surface over live PiOS execution outputs.
Exposes CE.4/CE.5/CE.2 trace data derived strictly from run archives.

NO recomputation. NO synthetic values. Data absent → exposed as absent.

CE.11 classification: GC-002 (new read-only debug surface)
Authority: EX.2

CLI usage:
    python3 scripts/pios/EX.2/pios_debug_adapter.py

Output (stdout, JSON):
    {
        "debug_run_id": "...",
        "telemetry_source": "STATIC_BASELINE",
        "stream": "EX.2",
        "signal_output_path": "...",
        "condition_output_path": "...",
        "signals": { <engine signals with full CE.4 trace data> },
        "ce5_consumption_records": { ... },
        "ce5_traceability_records": { ... },
        "conditions": { ... },
        "diagnoses": { ... },
        "trace_chains": [ { signal → condition → diagnosis, all states } ],
        "signal_summary": { "COMPLETE": [...], "PARTIAL": [...], "BLOCKED": [...] },
        "condition_summary": { "STABLE": [...], "BLOCKED": [...] },
        "diagnosis_summary": { "INACTIVE": [...], "BLOCKED": [...] }
    }

Trace questions answered:
    Q1  All signals + states         → signals
    Q2  CE.4 emission states         → signals[*].state
    Q3  CE.5 consumption records     → ce5_consumption_records
    Q4  CE.5 traceability records    → ce5_traceability_records
    Q5  Inputs / derivation formulas → signals[*].traceability + blocking_inputs
    Q6  CE.2 condition states        → conditions[*].condition_coverage_state
    Q7  CE.2 diagnosis states        → diagnoses[*].diagnosis_activation_state
    Q8  Signal → condition → diagnosis chain → trace_chains
    Q9  Run ID                       → debug_run_id
    Q10 BLOCKED / PARTIAL signals    → signal_summary + trace_chains[*].ce4_emission_state
"""

import json
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Import EX.3 bridge — live engine invocation (read-only use here)
# ---------------------------------------------------------------------------

_EX3_PATH = Path(__file__).resolve().parents[1] / "EX.3"
if str(_EX3_PATH) not in sys.path:
    sys.path.insert(0, str(_EX3_PATH))

try:
    import pios_bridge as _bridge
except ImportError as e:
    json.dump({"error": f"EX.2 FAILURE — cannot import pios_bridge: {e}"}, sys.stdout)
    sys.exit(1)

REPO_ROOT = _bridge.REPO_ROOT


# ---------------------------------------------------------------------------
# Trace chain builder — read-only, no recomputation
# ---------------------------------------------------------------------------

def build_trace_chains(signals: dict, conditions: dict, diagnoses: dict,
                       ce5_consumption: dict) -> list:
    """
    Reconstruct signal → condition → diagnosis chains from run archive fields.
    Uses governing_signal (conditions) and originating_condition (diagnoses).
    No derivation performed — reads only.
    """
    # Index: signal_id → condition_id
    sig_to_cond = {}
    for cond_id, cond in conditions.items():
        sig_id = cond.get("governing_signal")
        if sig_id:
            sig_to_cond[sig_id] = cond_id

    # Index: condition_id → diagnosis_id
    cond_to_diag = {}
    for diag_id, diag in diagnoses.items():
        cond_id = diag.get("originating_condition")
        if cond_id:
            cond_to_diag[cond_id] = diag_id

    chains = []
    for sig_id in sorted(signals):
        sig   = signals[sig_id]
        cond_id = sig_to_cond.get(sig_id)
        cond    = conditions.get(cond_id, {}) if cond_id else {}
        diag_id = cond_to_diag.get(cond_id) if cond_id else None
        diag    = diagnoses.get(diag_id, {}) if diag_id else {}

        cons_rec = (ce5_consumption.get(sig_id, {}) if isinstance(ce5_consumption, dict)
                    else {})

        chains.append({
            # Signal node
            "signal_id":               sig_id,
            "signal_name":             sig.get("canonical_name"),
            "ckr":                     sig.get("ckr"),
            "ce4_emission_state":      sig.get("state"),
            "ce5_consumption_state":   cons_rec.get("consumption_state"),
            "signal_output_present":   sig.get("output") is not None,
            "signal_traceability":     sig.get("traceability"),
            "signal_partiality":       sig.get("partiality_reasons"),
            "signal_blocking_class":   sig.get("blocking_class"),
            "signal_blocking_inputs":  sig.get("blocking_inputs"),
            "signal_blocking_reason":  sig.get("blocking_reason"),
            # Condition node
            "condition_id":            cond_id,
            "condition_name":          cond.get("canonical_name"),
            "ce2_condition_tier":      cond.get("condition_coverage_state"),
            "condition_activation":    cond.get("activation_state"),
            "condition_components":    cond.get("components"),
            "condition_blocking_inputs": cond.get("blocking_inputs"),
            "condition_blocking_reason": cond.get("blocking_reason"),
            # Diagnosis node
            "diagnosis_id":            diag_id,
            "diagnosis_name":          diag.get("canonical_name"),
            "dvar":                    diag.get("dvar"),
            "ce2_diagnosis_state":     diag.get("diagnosis_activation_state"),
            "diagnosis_blocking_inputs": diag.get("blocking_inputs"),
            "diagnosis_blocking_reason": diag.get("blocking_reason"),
        })

    return chains


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    # Invoke engine via bridge (same path as EX.3 runtime adapters)
    live_data = _bridge.get_live_pios_data()
    if live_data is None:
        json.dump({"error": "ENGINE_FAILURE: pios_bridge returned None — engine unavailable or vocabulary violation"}, sys.stdout)
        sys.exit(1)

    run_id = live_data["run_id"]

    # Locate run archive files (written by engine on this invocation)
    signal_path    = REPO_ROOT / "runs" / "pios" / "40.5" / run_id / "signal_output.json"
    condition_path = REPO_ROOT / "runs" / "pios" / "40.6" / run_id / "condition_output.json"

    if not signal_path.exists():
        json.dump({"error": f"signal_output.json not found: {signal_path}"}, sys.stdout)
        sys.exit(1)
    if not condition_path.exists():
        json.dump({"error": f"condition_output.json not found: {condition_path}"}, sys.stdout)
        sys.exit(1)

    # Read run archives — read-only
    with signal_path.open() as f:
        signal_data = json.load(f)
    with condition_path.open() as f:
        condition_data = json.load(f)

    signals         = signal_data["signals"]
    conditions      = condition_data["conditions"]
    diagnoses       = condition_data["diagnoses"]
    ce5_consumption = condition_data["ce5_consumption_records"]
    ce5_traceability = condition_data["ce5_traceability_records"]

    # Normalize CE.5 dicts (guard against list form)
    if isinstance(ce5_consumption, list):
        ce5_consumption = {r["signal_id"]: r for r in ce5_consumption}
    if isinstance(ce5_traceability, list):
        ce5_traceability = {r["signal_id"]: r for r in ce5_traceability}

    # Build trace chains — no recomputation
    trace_chains = build_trace_chains(signals, conditions, diagnoses, ce5_consumption)

    output = {
        "debug_run_id":         run_id,
        "telemetry_source":     live_data.get("telemetry_source", "STATIC_BASELINE"),
        "stream":               "EX.2",
        "signal_output_path":   str(signal_path.relative_to(REPO_ROOT)),
        "condition_output_path": str(condition_path.relative_to(REPO_ROOT)),
        "signals":              signals,
        "ce5_consumption_records":  ce5_consumption,
        "ce5_traceability_records": ce5_traceability,
        "conditions":           conditions,
        "diagnoses":            diagnoses,
        "trace_chains":         trace_chains,
        "signal_summary":       signal_data.get("summary", {}),
        "condition_summary":    condition_data.get("condition_summary", {}),
        "diagnosis_summary":    condition_data.get("diagnosis_summary", {}),
    }

    json.dump(output, sys.stdout, indent=2)
    sys.exit(0)


if __name__ == "__main__":
    main()

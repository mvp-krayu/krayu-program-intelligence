"""
scripts/pios/EX.3/pios_bridge.py
EX.3 — Runtime Integration & System Bridge

Shared live engine invocation module. Imported by 42.4 / 42.6 / 42.7 runtime adapters
to obtain CE.4/CE.5/CE.2 governed outputs from the certified PiOS v0.4 engine.

CE.11 classification: GC-002 (shared bridge — new engine path addition)
Authority: EX.3

Usage (from any 42.x adapter):
    _EX3_PATH = Path(__file__).resolve().parents[N] / "EX.3"
    if str(_EX3_PATH) not in sys.path:
        sys.path.insert(0, str(_EX3_PATH))
    import pios_bridge

    live_data = pios_bridge.get_live_pios_data()          # invoke engine once
    ctx = pios_bridge.get_l3_signal_pios_context(live_data, "SIG-003")
    # → {"pios_emission_state": "COMPLETE", "pios_ce5_consumption_state": "AVAILABLE", ...}

    value = pios_bridge.get_live_metric_value(live_data, "SIG-003")
    # → 0.682  (engine SIG-002.dependency_load_ratio)
"""

import datetime
import json
import subprocess
from pathlib import Path
from typing import Optional

REPO_ROOT       = Path(__file__).resolve().parents[3]
ENGINE_COMPUTE  = REPO_ROOT / "pios" / "core" / "v0.1" / "engine" / "compute_signals.py"
ENGINE_ACTIVATE = REPO_ROOT / "pios" / "core" / "v0.1" / "engine" / "activate_conditions.py"

CE4_EMISSION_STATES  = {"COMPLETE", "PARTIAL", "BLOCKED", "COMPUTABLE_PENDING"}
CE5_CONSUMPTION_STATES = {"AVAILABLE", "PARTIAL", "BLOCKED"}
CE2_TIER_STATES      = {"BLOCKED", "DEGRADED", "AT_RISK", "STABLE"}
CE2_DIAGNOSIS_STATES = {"BLOCKED", "ACTIVE", "INACTIVE"}

# Severity ordering (lower index = higher severity)
TIER_ORDER  = ["BLOCKED", "DEGRADED", "AT_RISK", "STABLE"]
DIAG_ORDER  = ["BLOCKED", "ACTIVE", "INACTIVE"]

# ---------------------------------------------------------------------------
# L3-to-engine signal mapping
# Derived from source_refs fields in docs/pios/41.4/signal_registry.json.
# Each L3 signal record carries a source_refs list that names the governing
# engine signal and conditions — this mapping is the authoritative bridge.
# ---------------------------------------------------------------------------
L3_TO_ENGINE = {
    "SIG-001": {
        "engine_signal":     "SIG-006",
        "engine_conditions": ["COND-006"],
        "engine_diagnoses":  ["DIAG-006"],
    },
    "SIG-002": {
        # Aggregate: no single governing engine signal; references 7 conditions/diagnoses
        "engine_signal":     None,
        "engine_conditions": ["COND-001", "COND-002", "COND-003", "COND-004",
                               "COND-005", "COND-007", "COND-008"],
        "engine_diagnoses":  ["DIAG-001", "DIAG-002", "DIAG-003", "DIAG-004",
                               "DIAG-005", "DIAG-007", "DIAG-008"],
    },
    "SIG-003": {
        "engine_signal":     "SIG-002",
        "engine_conditions": ["COND-001"],
        "engine_diagnoses":  ["DIAG-001"],
    },
    "SIG-004": {
        "engine_signal":     "SIG-004",
        "engine_conditions": ["COND-002"],
        "engine_diagnoses":  ["DIAG-002"],
    },
    "SIG-005": {
        "engine_signal":     "SIG-001",
        "engine_conditions": ["COND-003"],
        "engine_diagnoses":  ["DIAG-003"],
    },
}

# For overview metrics: L3 signal ID → (engine signal ID, output field name)
# These are the numeric values the 42.6 adapter previously extracted via regex.
L3_METRIC_LIVE_FIELDS = {
    "SIG-003": ("SIG-002", "dependency_load_ratio"),
    "SIG-004": ("SIG-004", "total_edge_density"),
    "SIG-005": ("SIG-001", "static_structural_ratio"),
    # SIG-002 has no single engine numeric field — keep static extraction
}


# ---------------------------------------------------------------------------
# Engine invocation
# ---------------------------------------------------------------------------

def get_live_pios_data(run_id: Optional[str] = None) -> Optional[dict]:
    """
    Invoke the certified PiOS v0.4 engine and return governed outputs.

    Returns dict with:
        run_id, telemetry_source, signals, ce5_consumption_records,
        ce5_traceability_records, conditions, diagnoses

    Returns None on engine failure or vocabulary violation.
    Callers must handle None gracefully (fail-closed: pios_* fields set to null).
    """
    if run_id is None:
        run_id = f"EX3_live_{datetime.datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"

    # --- compute_signals ---
    r1 = subprocess.run(
        ["python3", str(ENGINE_COMPUTE), run_id],
        capture_output=True, text=True, cwd=str(REPO_ROOT),
    )
    if r1.returncode != 0:
        return None

    sig_path = REPO_ROOT / "runs" / "pios" / "40.5" / run_id / "signal_output.json"
    if not sig_path.exists():
        return None
    with sig_path.open() as f:
        signal_data = json.load(f)

    # --- activate_conditions ---
    r2 = subprocess.run(
        ["python3", str(ENGINE_ACTIVATE), run_id, str(sig_path)],
        capture_output=True, text=True, cwd=str(REPO_ROOT),
    )
    if r2.returncode != 0:
        return None

    cond_path = REPO_ROOT / "runs" / "pios" / "40.6" / run_id / "condition_output.json"
    if not cond_path.exists():
        return None
    with cond_path.open() as f:
        condition_data = json.load(f)

    # --- Validate CE.4 vocabulary ---
    signals_raw = signal_data.get("signals", {})
    for sig in signals_raw.values():
        if sig.get("state") not in CE4_EMISSION_STATES:
            return None

    # --- Normalize CE.5 structures (dict or list) ---
    raw_consumption = condition_data.get("ce5_consumption_records", {})
    consumption = (raw_consumption if isinstance(raw_consumption, dict)
                   else {r["signal_id"]: r for r in raw_consumption})

    raw_traceability = condition_data.get("ce5_traceability_records", {})
    traceability = (raw_traceability if isinstance(raw_traceability, dict)
                    else {r["signal_id"]: r for r in raw_traceability})

    return {
        "run_id":                   run_id,
        "telemetry_source":         signal_data.get("telemetry_source", "STATIC_BASELINE"),
        "signals":                  signals_raw,
        "ce5_consumption_records":  consumption,
        "ce5_traceability_records": traceability,
        "conditions":               condition_data.get("conditions", {}),
        "diagnoses":                condition_data.get("diagnoses", {}),
    }


# ---------------------------------------------------------------------------
# Context helpers
# ---------------------------------------------------------------------------

def get_l3_signal_pios_context(live_data: Optional[dict], l3_signal_id: str) -> dict:
    """
    Return CE.4/CE.5/CE.2 governed context for an L3 signal_registry signal ID.
    Uses L3_TO_ENGINE mapping to resolve engine-level IDs.

    Returns dict:
        pios_emission_state       — CE.4 {COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING} or null
        pios_ce5_consumption_state — CE.5 {AVAILABLE, PARTIAL, BLOCKED} or null
        pios_condition_tier       — CE.2 worst-case tier among governing conditions or null
        pios_diagnosis_state      — CE.2 worst-case diagnosis state or null
        pios_run_id               — engine run_id or null
    """
    null_ctx = {
        "pios_emission_state":        None,
        "pios_ce5_consumption_state": None,
        "pios_condition_tier":        None,
        "pios_diagnosis_state":       None,
        "pios_run_id":                None,
    }
    if live_data is None:
        return null_ctx

    mapping = L3_TO_ENGINE.get(l3_signal_id)
    if mapping is None:
        return null_ctx

    ctx = {"pios_run_id": live_data.get("run_id")}

    # CE.4 / CE.5 — from the governing engine signal
    engine_sig_id = mapping["engine_signal"]
    if engine_sig_id:
        sig  = live_data["signals"].get(engine_sig_id, {})
        cons = live_data["ce5_consumption_records"].get(engine_sig_id, {})
        ctx["pios_emission_state"]        = sig.get("state")
        ctx["pios_ce5_consumption_state"] = cons.get("consumption_state")
    else:
        ctx["pios_emission_state"]        = None
        ctx["pios_ce5_consumption_state"] = None

    # CE.2 condition tier — worst-case across all governing conditions
    tier = None
    for cond_id in mapping["engine_conditions"]:
        t = live_data["conditions"].get(cond_id, {}).get("condition_coverage_state")
        if t and (tier is None or TIER_ORDER.index(t) < TIER_ORDER.index(tier)):
            tier = t
    ctx["pios_condition_tier"] = tier

    # CE.2 diagnosis state — worst-case across all governing diagnoses
    diag_state = None
    for diag_id in mapping["engine_diagnoses"]:
        d = live_data["diagnoses"].get(diag_id, {}).get("diagnosis_activation_state")
        if d and (diag_state is None or DIAG_ORDER.index(d) < DIAG_ORDER.index(diag_state)):
            diag_state = d
    ctx["pios_diagnosis_state"] = diag_state

    return ctx


def get_live_metric_value(live_data: Optional[dict], l3_signal_id: str) -> Optional[float]:
    """
    Return the live numeric value for an overview metric's L3 signal.
    Uses L3_METRIC_LIVE_FIELDS to map L3 signal → engine signal → output field.
    Returns None if live_data is unavailable or signal/field is absent.
    """
    if live_data is None:
        return None
    mapping = L3_METRIC_LIVE_FIELDS.get(l3_signal_id)
    if mapping is None:
        return None
    engine_sig_id, field_name = mapping
    sig = live_data["signals"].get(engine_sig_id, {})
    output = sig.get("output") or {}
    return output.get(field_name)


def get_pios_condition_summary(live_data: Optional[dict]) -> dict:
    """
    Return a flat summary of all CE.2 condition tiers and diagnosis states.
    Used by 42.7 topology adapter for top-level pios_summary block.
    """
    if live_data is None:
        return {
            "run_id":                 None,
            "telemetry_source":       None,
            "condition_tiers":        {},
            "diagnosis_states":       {},
            "blocked_condition_count": None,
            "blocked_diagnosis_count": None,
        }
    conditions = live_data["conditions"]
    diagnoses  = live_data["diagnoses"]
    return {
        "run_id":           live_data["run_id"],
        "telemetry_source": live_data["telemetry_source"],
        "condition_tiers":  {cid: c.get("condition_coverage_state")
                             for cid, c in conditions.items()},
        "diagnosis_states": {did: d.get("diagnosis_activation_state")
                             for did, d in diagnoses.items()},
        "blocked_condition_count": sum(
            1 for c in conditions.values()
            if c.get("condition_coverage_state") == "BLOCKED"
        ),
        "blocked_diagnosis_count": sum(
            1 for d in diagnoses.values()
            if d.get("diagnosis_activation_state") == "BLOCKED"
        ),
    }

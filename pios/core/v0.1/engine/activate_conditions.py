# activate_conditions.py
#
# Materialized from: runs/pios/40.6/run_01_condition_activation/
# Source artifacts:
#   condition_input_matrix.md
#   condition_activation_specification.md
#   condition_output_set.md
#   condition_traceability_map.md
#   diagnosis_input_matrix.md
#   diagnosis_activation_specification.md
#   diagnosis_output_set.md
#   condition_validation_report.md
#   execution_manifest.md
#
# Derivation run: run_01_condition_activation (Stream 40.6)
# Canonical condition schema: COND-001..COND-008 (CKR-012)
# Canonical diagnosis schema:  DIAG-001..DIAG-008
#
# No activation formulas, thresholds, identifiers, field names, or fallback
# behavior invented beyond explicit evidence in the derivation run artifacts.
# COMPLETE/PARTIAL/BLOCKED states propagate exactly as proven in run_01_condition_activation.
# No signals are recomputed. No semantic enrichment. No root-cause logic.

import json
import os
import sys

UNDEFINED = None

# ---------------------------------------------------------------------------
# Canonical condition schema — condition_activation_specification.md
# All conditions reference CKR-012.
# ---------------------------------------------------------------------------

CONDITION_SCHEMA = {
    "COND-001": {"canonical_name": "Dependency Load Elevation",        "ckr": "CKR-012", "governing_signal": "SIG-002"},
    "COND-002": {"canonical_name": "Structural Volatility State",       "ckr": "CKR-012", "governing_signal": "SIG-004"},
    "COND-003": {"canonical_name": "Coordination Pressure Active",      "ckr": "CKR-012", "governing_signal": "SIG-001"},
    "COND-004": {"canonical_name": "Throughput Degradation Risk",       "ckr": "CKR-012", "governing_signal": "SIG-005"},
    "COND-005": {"canonical_name": "Change Concentration Accumulation", "ckr": "CKR-012", "governing_signal": "SIG-003"},
    "COND-006": {"canonical_name": "Execution Instability",             "ckr": "CKR-012", "governing_signal": "SIG-006"},
    "COND-007": {"canonical_name": "Execution Health Deficit",          "ckr": "CKR-012", "governing_signal": "SIG-007"},
    "COND-008": {"canonical_name": "Risk Acceleration State",           "ckr": "CKR-012", "governing_signal": "SIG-008"},
}

# ---------------------------------------------------------------------------
# Canonical diagnosis schema — diagnosis_activation_specification.md
# ---------------------------------------------------------------------------

DIAGNOSIS_SCHEMA = {
    "DIAG-001": {"canonical_name": "Dependency Load Elevation",        "dvar": "DVAR_001", "originating_condition": "COND-001"},
    "DIAG-002": {"canonical_name": "Structural Volatility State",       "dvar": "DVAR_002", "originating_condition": "COND-002"},
    "DIAG-003": {"canonical_name": "Coordination Pressure Active",      "dvar": "DVAR_003", "originating_condition": "COND-003"},
    "DIAG-004": {"canonical_name": "Throughput Degradation Risk",       "dvar": "DVAR_004", "originating_condition": "COND-004"},
    "DIAG-005": {"canonical_name": "Change Concentration Accumulation", "dvar": "DVAR_005", "originating_condition": "COND-005"},
    "DIAG-006": {"canonical_name": "Execution Instability",             "dvar": "DVAR_006", "originating_condition": "COND-006"},
    "DIAG-007": {"canonical_name": "Execution Health Deficit",          "dvar": "DVAR_007", "originating_condition": "COND-007"},
    "DIAG-008": {"canonical_name": "Risk Acceleration State",           "dvar": "DVAR_008", "originating_condition": "COND-008"},
}

# ---------------------------------------------------------------------------
# Coverage state propagation rule — condition_activation_specification.md
# Signal state → condition coverage state
# Condition coverage state → diagnosis activation state
# ---------------------------------------------------------------------------

SIGNAL_TO_CONDITION_STATE = {
    "COMPLETE": "complete",
    "PARTIAL":  "partial",
    "BLOCKED":  "blocked",
}

CONDITION_TO_DIAGNOSIS_STATE = {
    "complete": "active",
    "partial":  "partial",
    "blocked":  "blocked",
}

# ---------------------------------------------------------------------------
# CVAR_ mapping — condition_input_matrix.md
# Signal → condition, with required signal output fields per condition
# ---------------------------------------------------------------------------

CVAR_MAP = {
    "CVAR_001": {"signal_id": "SIG-001", "condition_id": "COND-003"},
    "CVAR_002": {"signal_id": "SIG-002", "condition_id": "COND-001"},
    "CVAR_003": {"signal_id": "SIG-003", "condition_id": "COND-005"},
    "CVAR_004": {"signal_id": "SIG-004", "condition_id": "COND-002"},
    "CVAR_005": {"signal_id": "SIG-005", "condition_id": "COND-004"},
    "CVAR_006": {"signal_id": "SIG-006", "condition_id": "COND-006"},
    "CVAR_007": {"signal_id": "SIG-007", "condition_id": "COND-007"},
    "CVAR_008": {"signal_id": "SIG-008", "condition_id": "COND-008"},
}

# ---------------------------------------------------------------------------
# Condition activation functions
# Each function carries forward only the components proven by run_01_condition_activation.
# No new computation. Signal output values passed through exactly.
# ---------------------------------------------------------------------------

def activate_cond_001(sig_002_output):
    """COND-001 Dependency Load Elevation — governed by SIG-002 (COMPLETE)
    Carries: dependency_load_ratio, dependency_edge_count
    State: complete
    """
    return {
        "condition_id": "COND-001",
        "canonical_name": "Dependency Load Elevation",
        "ckr": "CKR-012",
        "governing_signal": "SIG-002",
        "signal_state": "COMPLETE",
        "condition_coverage_state": "complete",
        "activation_state": "activated",
        "components": {
            "dependency_load_ratio":  sig_002_output["dependency_load_ratio"],
            "dependency_edge_count":  sig_002_output["dependency_edge_count"],
        },
    }


def activate_cond_002(sig_004_output):
    """COND-002 Structural Volatility State — governed by SIG-004 (COMPLETE)
    Carries: total_edge_density, containment_density, responsibility_density, module_density
    State: complete
    """
    return {
        "condition_id": "COND-002",
        "canonical_name": "Structural Volatility State",
        "ckr": "CKR-012",
        "governing_signal": "SIG-004",
        "signal_state": "COMPLETE",
        "condition_coverage_state": "complete",
        "activation_state": "activated",
        "components": {
            "total_edge_density":     sig_004_output["total_edge_density"],
            "containment_density":    sig_004_output["containment_density"],
            "responsibility_density": sig_004_output["responsibility_density"],
            "module_density":         sig_004_output["module_density"],
        },
    }


def activate_cond_003(sig_001_output):
    """COND-003 Coordination Pressure Active — governed by SIG-001 (PARTIAL)
    Active: static_structural_ratio
    UNDEFINED: runtime_component (AT-007 PENDING)
    State: partial
    """
    return {
        "condition_id": "COND-003",
        "canonical_name": "Coordination Pressure Active",
        "ckr": "CKR-012",
        "governing_signal": "SIG-001",
        "signal_state": "PARTIAL",
        "condition_coverage_state": "partial",
        "activation_state": "partial — structural component activated; runtime component UNDEFINED",
        "components": {
            "structural_ratio":    sig_001_output["static_structural_ratio"],
            "runtime_component":   sig_001_output["runtime_component"],  # UNDEFINED
        },
    }


def activate_cond_004(sig_005_output):
    """COND-004 Throughput Degradation Risk — governed by SIG-005 (PARTIAL)
    Active: throughput_rate
    UNDEFINED: completion_factor (DT-007 PENDING)
    State: partial
    """
    return {
        "condition_id": "COND-004",
        "canonical_name": "Throughput Degradation Risk",
        "ckr": "CKR-012",
        "governing_signal": "SIG-005",
        "signal_state": "PARTIAL",
        "condition_coverage_state": "partial",
        "activation_state": "partial — throughput rate activated; completion factor UNDEFINED",
        "components": {
            "throughput_rate":     sig_005_output["throughput_rate"],
            "completion_factor":   sig_005_output["completion_factor"],  # UNDEFINED
        },
    }


def activate_cond_005(sig_003):
    """COND-005 Change Concentration Accumulation — governed by SIG-003 (BLOCKED)
    No activation. Blocking inputs: AT-001, AT-002 (time-series absent from static telemetry).
    State: blocked
    """
    return {
        "condition_id": "COND-005",
        "canonical_name": "Change Concentration Accumulation",
        "ckr": "CKR-012",
        "governing_signal": "SIG-003",
        "signal_state": "BLOCKED",
        "condition_coverage_state": "blocked",
        "activation_state": "blocked",
        "blocking_inputs": sig_003.get("blocking_inputs", ["VAR_AT_001", "VAR_AT_002"]),
        "blocking_reason": sig_003.get(
            "blocking_reason",
            "AT-001 and AT-002 time-series absent from static telemetry",
        ),
    }


def activate_cond_006(sig_006):
    """COND-006 Execution Instability — governed by SIG-006 (BLOCKED)
    No activation. Blocking inputs: AT-007, AT-009, DT-007, DT-008 (all event-based).
    State: blocked
    """
    return {
        "condition_id": "COND-006",
        "canonical_name": "Execution Instability",
        "ckr": "CKR-012",
        "governing_signal": "SIG-006",
        "signal_state": "BLOCKED",
        "condition_coverage_state": "blocked",
        "activation_state": "blocked",
        "blocking_inputs": sig_006.get("blocking_inputs", ["VAR_AT_007", "VAR_AT_009", "VAR_DT_007", "VAR_DT_008"]),
        "blocking_reason": sig_006.get(
            "blocking_reason",
            "All inputs event-based; require live pipeline execution",
        ),
    }


def activate_cond_007(sig_007_output):
    """COND-007 Execution Health Deficit — governed by SIG-007/ESI (PARTIAL)
    Active: sig_002_dependency_load_component (0.682)
    UNDEFINED: sig_005_completion_factor_component, sig_006_stability_component
    State: partial
    """
    return {
        "condition_id": "COND-007",
        "canonical_name": "Execution Health Deficit",
        "ckr": "CKR-012",
        "governing_signal": "SIG-007",
        "signal_state": "PARTIAL",
        "condition_coverage_state": "partial",
        "activation_state": "partial — SIG-002 component activated; SIG-005 and SIG-006 components UNDEFINED",
        "components": {
            "sig_002_dependency_load_component":      sig_007_output["sig_002_dependency_load_component"],
            "sig_005_completion_factor_component":    sig_007_output["sig_005_completion_factor_component"],  # UNDEFINED
            "sig_006_stability_component":            sig_007_output["sig_006_stability_component"],          # UNDEFINED
        },
    }


def activate_cond_008(sig_008_output):
    """COND-008 Risk Acceleration State — governed by SIG-008/RAG (PARTIAL)
    Active: sig_001_coordination_pressure_component, sig_004_* ratios
    UNDEFINED: sig_003_change_concentration_component
    State: partial
    """
    return {
        "condition_id": "COND-008",
        "canonical_name": "Risk Acceleration State",
        "ckr": "CKR-012",
        "governing_signal": "SIG-008",
        "signal_state": "PARTIAL",
        "condition_coverage_state": "partial",
        "activation_state": "partial — SIG-001 and SIG-004 components activated; SIG-003 component UNDEFINED",
        "components": {
            "sig_001_coordination_pressure_component": sig_008_output["sig_001_coordination_pressure_component"],
            "sig_004_total_edge_density":              sig_008_output["sig_004_total_edge_density"],
            "sig_004_containment_density":             sig_008_output["sig_004_containment_density"],
            "sig_004_responsibility_density":          sig_008_output["sig_004_responsibility_density"],
            "sig_004_module_density":                  sig_008_output["sig_004_module_density"],
            "sig_003_change_concentration_component":  sig_008_output["sig_003_change_concentration_component"],  # UNDEFINED
        },
    }


# ---------------------------------------------------------------------------
# Diagnosis activation functions
# Condition coverage state → diagnosis activation state (DVAR_ mapping)
# Values carried from condition output exactly — no recomputation.
# ---------------------------------------------------------------------------

def activate_diag(diag_id, condition):
    """Generic diagnosis activation — condition coverage state → diagnosis activation state.
    Diagnosis activation state may not exceed originating condition coverage state.
    Components carried from condition output exactly.
    """
    cond_state = condition["condition_coverage_state"]
    diag_state = CONDITION_TO_DIAGNOSIS_STATE[cond_state]
    schema = DIAGNOSIS_SCHEMA[diag_id]

    record = {
        "diagnosis_id": diag_id,
        "canonical_name": schema["canonical_name"],
        "dvar": schema["dvar"],
        "originating_condition": schema["originating_condition"],
        "condition_coverage_state": cond_state,
        "diagnosis_activation_state": diag_state,
    }

    if cond_state == "blocked":
        record["blocking_inputs"] = condition.get("blocking_inputs", [])
        record["blocking_reason"] = condition.get("blocking_reason", UNDEFINED)
    else:
        record["components"] = condition.get("components", {})

    return record


# ---------------------------------------------------------------------------
# Path validation — fail-closed
# ---------------------------------------------------------------------------

def _resolve(path):
    return os.path.normpath(os.path.abspath(path))


def validate_output_path(path):
    norm = _resolve(path)
    cwd = os.getcwd()

    docs_path = _resolve(os.path.join(cwd, "docs"))
    if norm.startswith(docs_path + os.sep) or norm == docs_path:
        sys.exit(f"ERROR: FORBIDDEN output path — targets docs/: {path}")

    for prefix in (
        "runs/pios/40.5/run_02_ce_validation",
        "runs/pios/40.6/run_01_condition_activation",
        "runs/pios/40.7/run_01_intelligence_synthesis",
    ):
        immutable = _resolve(os.path.join(cwd, prefix))
        if norm.startswith(immutable + os.sep) or norm == immutable:
            sys.exit(f"ERROR: FORBIDDEN output path — targets immutable run: {path}")


def validate_input_path(path):
    norm = _resolve(path)
    for token in (os.sep + "41.", os.sep + "42.", os.sep + "demo", os.sep + "51."):
        if token in norm:
            sys.exit(f"ERROR: FORBIDDEN input path — references prohibited scope: {path}")


# ---------------------------------------------------------------------------
# Signal output loading
# ---------------------------------------------------------------------------

def load_signal_output(signal_input_path):
    """Load signal output JSON from compute_signals.py.
    Fail-closed: file must exist and contain all 8 canonical signal IDs.
    No signal values recomputed — passed through exactly as loaded.
    """
    validate_input_path(signal_input_path)
    if not os.path.isfile(signal_input_path):
        sys.exit(f"ERROR: signal input file not found: {signal_input_path}")

    with open(signal_input_path, "r") as f:
        data = json.load(f)

    signals = data.get("signals", {})
    required = list(CONDITION_SCHEMA[c]["governing_signal"] for c in CONDITION_SCHEMA)
    for sig_id in required:
        if sig_id not in signals:
            sys.exit(f"ERROR: required signal missing from input: {sig_id}")

    return signals


# ---------------------------------------------------------------------------
# Main computation entry point
# ---------------------------------------------------------------------------

def activate(run_id, signal_input_path, output_path=None):
    if output_path is None:
        output_path = os.path.join("runs", "pios", "40.6", run_id, "condition_output.json")

    validate_output_path(output_path)

    signals = load_signal_output(signal_input_path)

    # Activate conditions — canonical order COND-001..COND-008, deterministic
    cond_001 = activate_cond_001(signals["SIG-002"]["output"])
    cond_002 = activate_cond_002(signals["SIG-004"]["output"])
    cond_003 = activate_cond_003(signals["SIG-001"]["output"])
    cond_004 = activate_cond_004(signals["SIG-005"]["output"])
    cond_005 = activate_cond_005(signals["SIG-003"])
    cond_006 = activate_cond_006(signals["SIG-006"])
    cond_007 = activate_cond_007(signals["SIG-007"]["output"])
    cond_008 = activate_cond_008(signals["SIG-008"]["output"])

    conditions = [cond_001, cond_002, cond_003, cond_004,
                  cond_005, cond_006, cond_007, cond_008]

    # Activate diagnoses — DVAR_ mapping, canonical order DIAG-001..DIAG-008, deterministic
    cond_by_id = {c["condition_id"]: c for c in conditions}
    diag_001 = activate_diag("DIAG-001", cond_by_id["COND-001"])
    diag_002 = activate_diag("DIAG-002", cond_by_id["COND-002"])
    diag_003 = activate_diag("DIAG-003", cond_by_id["COND-003"])
    diag_004 = activate_diag("DIAG-004", cond_by_id["COND-004"])
    diag_005 = activate_diag("DIAG-005", cond_by_id["COND-005"])
    diag_006 = activate_diag("DIAG-006", cond_by_id["COND-006"])
    diag_007 = activate_diag("DIAG-007", cond_by_id["COND-007"])
    diag_008 = activate_diag("DIAG-008", cond_by_id["COND-008"])

    diagnoses = [diag_001, diag_002, diag_003, diag_004,
                 diag_005, diag_006, diag_007, diag_008]

    # Summaries
    cond_complete = [c["condition_id"] for c in conditions if c["condition_coverage_state"] == "complete"]
    cond_partial  = [c["condition_id"] for c in conditions if c["condition_coverage_state"] == "partial"]
    cond_blocked  = [c["condition_id"] for c in conditions if c["condition_coverage_state"] == "blocked"]

    diag_active   = [d["diagnosis_id"] for d in diagnoses if d["diagnosis_activation_state"] == "active"]
    diag_partial  = [d["diagnosis_id"] for d in diagnoses if d["diagnosis_activation_state"] == "partial"]
    diag_blocked  = [d["diagnosis_id"] for d in diagnoses if d["diagnosis_activation_state"] == "blocked"]

    output = {
        "run_id": run_id,
        "stream": "40.6",
        "script": "activate_conditions.py",
        "derivation_run": "run_01_condition_activation",
        "upstream_signal_input": signal_input_path,
        "conditions": {c["condition_id"]: c for c in conditions},
        "diagnoses":  {d["diagnosis_id"]: d for d in diagnoses},
        "condition_summary": {
            "complete": cond_complete,
            "partial":  cond_partial,
            "blocked":  cond_blocked,
        },
        "diagnosis_summary": {
            "active":   diag_active,
            "partial":  diag_partial,
            "blocked":  diag_blocked,
        },
    }

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"conditions  — complete: {cond_complete}  partial: {cond_partial}  blocked: {cond_blocked}")
    print(f"diagnoses   — active:   {diag_active}   partial: {diag_partial}  blocked: {diag_blocked}")
    print(f"output: {output_path}")

    return output


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(
            "usage: activate_conditions.py <run_id> <signal_input_path> [output_path]",
            file=sys.stderr,
        )
        print(
            "  run_id             — required; run identifier for this execution",
            file=sys.stderr,
        )
        print(
            "  signal_input_path  — required; JSON output from compute_signals.py",
            file=sys.stderr,
        )
        print(
            "  output_path        — optional; defaults to runs/pios/40.6/<run_id>/condition_output.json",
            file=sys.stderr,
        )
        sys.exit(1)

    _run_id      = sys.argv[1]
    _signal_path = sys.argv[2]
    _output_path = sys.argv[3] if len(sys.argv) > 3 else None

    activate(_run_id, _signal_path, output_path=_output_path)

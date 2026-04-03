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
# CE.5 consumption state mapping — consumption_state_model.md §3
# Maps CE.4 emission state → CE.5 consumption state (AVAILABLE/PARTIAL/BLOCKED)
# CE.6 gaps: GAP-C-001, GAP-C-002 — CE.7 R-004
# ---------------------------------------------------------------------------

CE4_TO_CE5_CONSUMPTION_STATE = {
    "COMPLETE":           "AVAILABLE",
    "PARTIAL":            "PARTIAL",
    "BLOCKED":            "BLOCKED",
    "COMPUTABLE_PENDING": "PARTIAL",    # C-004
}

# CE.5 consumption vocabulary — replaces v0.1 lowercase emission state passthrough
# CE.6 gaps: GAP-C-001, GAP-C-002
SIGNAL_TO_CONDITION_STATE = {
    "COMPLETE": "AVAILABLE",
    "PARTIAL":  "PARTIAL",
    "BLOCKED":  "BLOCKED",
}

# CE.2 DEC-014 governed tier → diagnosis state mapping
# CE.6 gaps: GAP-P-003, GAP-P-004 — CE.10 closure
# Input: DEC-009/DEC-011 tier value (BLOCKED/DEGRADED/AT_RISK/STABLE)
# CE.8 interim AVAILABLE/PARTIAL shim entries removed — CE.9 supersession rule applied.
CONDITION_TO_DIAGNOSIS_STATE = {
    "BLOCKED":   "BLOCKED",   # DEC-014
    "DEGRADED":  "ACTIVE",    # DEC-014
    "AT_RISK":   "ACTIVE",    # DEC-014
    "STABLE":    "INACTIVE",  # DEC-014
}

# ---------------------------------------------------------------------------
# DEC-013 governed binding rule definitions — CE.10
# Every binding_rule_id resolves to a value-reactive rule specification.
# Fields: binding_rule_id, signal_field, evaluation_type, evaluation_logic,
#         output_tier, null_handling — DEC-013 minimum specification.
# ---------------------------------------------------------------------------

BINDING_RULES = {
    "BR-NULL-SIGNAL-BLOCKED": {
        "binding_rule_id":  "BR-NULL-SIGNAL-BLOCKED",
        "signal_field":     "output",
        "evaluation_type":  "NULL_CHECK",
        "evaluation_logic": "if output is None → BLOCKED",
        "output_tier":      {"null": "BLOCKED"},
        "null_handling":    "None is the trigger; always → BLOCKED",
    },
    "BR-DEP-LOAD-RATIO-001": {
        "binding_rule_id":  "BR-DEP-LOAD-RATIO-001",
        "signal_field":     "dependency_load_ratio",
        "evaluation_type":  "BASELINE_THRESHOLD_ABOVE",
        "evaluation_logic": "if value > 0.682 → AT_RISK; else → STABLE",
        "output_tier":      {"above": "AT_RISK", "at_or_below": "STABLE"},
        "threshold":        0.682,
        "null_handling":    "None → BLOCKED",
    },
    "BR-EDGE-DENSITY-001": {
        "binding_rule_id":  "BR-EDGE-DENSITY-001",
        "signal_field":     "total_edge_density",
        "evaluation_type":  "BASELINE_THRESHOLD_ABOVE",
        "evaluation_logic": "if value > 1.273 → AT_RISK; else → STABLE",
        "output_tier":      {"above": "AT_RISK", "at_or_below": "STABLE"},
        "threshold":        1.273,
        "null_handling":    "None → BLOCKED",
    },
    "BR-STRUCTURAL-RATIO-001": {
        "binding_rule_id":  "BR-STRUCTURAL-RATIO-001",
        "signal_field":     "static_structural_ratio",
        "evaluation_type":  "BASELINE_THRESHOLD_ABOVE",
        "evaluation_logic": "if value > 0.875 → AT_RISK; else → STABLE",
        "output_tier":      {"above": "AT_RISK", "at_or_below": "STABLE"},
        "threshold":        0.875,
        "null_handling":    "None → BLOCKED",
    },
    "BR-COORD-PRESSURE-001": {
        "binding_rule_id":  "BR-COORD-PRESSURE-001",
        "signal_field":     "sig_001_coordination_pressure_component",
        "evaluation_type":  "BASELINE_THRESHOLD_ABOVE",
        "evaluation_logic": "if value > 0.875 → AT_RISK; else → STABLE",
        "output_tier":      {"above": "AT_RISK", "at_or_below": "STABLE"},
        "threshold":        0.875,
        "null_handling":    "None → BLOCKED",
    },
    "BR-THROUGHPUT-RATE-001": {
        "binding_rule_id":  "BR-THROUGHPUT-RATE-001",
        "signal_field":     "throughput_rate",
        "evaluation_type":  "BASELINE_THRESHOLD_BELOW",
        "evaluation_logic": "if value < 1.125 → AT_RISK; else → STABLE",
        "output_tier":      {"below": "AT_RISK", "at_or_above": "STABLE"},
        "threshold":        1.125,
        "null_handling":    "None → BLOCKED",
    },
    "BR-HEALTH-DEP-COMP-001": {
        "binding_rule_id":  "BR-HEALTH-DEP-COMP-001",
        "signal_field":     "sig_002_dependency_load_component",
        "evaluation_type":  "BASELINE_THRESHOLD_ABOVE",
        "evaluation_logic": "if value > 0.682 → AT_RISK; else → STABLE",
        "output_tier":      {"above": "AT_RISK", "at_or_below": "STABLE"},
        "threshold":        0.682,
        "null_handling":    "None → BLOCKED",
    },
}

# ---------------------------------------------------------------------------
# DEC-012 binding surface — CE.10
# Governed table: (condition_id, signal_id, signal_field, binding_rule_id)
# 8-row baseline: one binding row per condition (CE.2 baseline configuration).
# Determinism from governed rule evaluation — not from row order.
# ---------------------------------------------------------------------------

BINDING_SURFACE = [
    {"condition_id": "COND-001", "signal_id": "SIG-002", "signal_field": "dependency_load_ratio",                  "binding_rule_id": "BR-DEP-LOAD-RATIO-001"},
    {"condition_id": "COND-002", "signal_id": "SIG-004", "signal_field": "total_edge_density",                     "binding_rule_id": "BR-EDGE-DENSITY-001"},
    {"condition_id": "COND-003", "signal_id": "SIG-001", "signal_field": "static_structural_ratio",                "binding_rule_id": "BR-STRUCTURAL-RATIO-001"},
    {"condition_id": "COND-004", "signal_id": "SIG-005", "signal_field": "throughput_rate",                        "binding_rule_id": "BR-THROUGHPUT-RATE-001"},
    {"condition_id": "COND-005", "signal_id": "SIG-003", "signal_field": "output",                                 "binding_rule_id": "BR-NULL-SIGNAL-BLOCKED"},
    {"condition_id": "COND-006", "signal_id": "SIG-006", "signal_field": "output",                                 "binding_rule_id": "BR-NULL-SIGNAL-BLOCKED"},
    {"condition_id": "COND-007", "signal_id": "SIG-002", "signal_field": "dependency_load_ratio",                  "binding_rule_id": "BR-DEP-LOAD-RATIO-001"},
    {"condition_id": "COND-008", "signal_id": "SIG-008", "signal_field": "sig_001_coordination_pressure_component", "binding_rule_id": "BR-COORD-PRESSURE-001"},
]

# DEC-009 tier order — strict total order; BLOCKED dominates all lower tiers
TIER_ORDER = {"BLOCKED": 3, "DEGRADED": 2, "AT_RISK": 1, "STABLE": 0}

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
        "condition_coverage_state": "AVAILABLE",   # CE.6 GAP-C-001
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
        "condition_coverage_state": "AVAILABLE",   # CE.6 GAP-C-001
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
        "condition_coverage_state": "PARTIAL",   # CE.6 GAP-C-001
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
        "condition_coverage_state": "PARTIAL",   # CE.6 GAP-C-001
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
        "condition_coverage_state": "BLOCKED",   # CE.6 GAP-C-001
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
        "condition_coverage_state": "BLOCKED",   # CE.6 GAP-C-001
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
        "condition_coverage_state": "PARTIAL",   # CE.6 GAP-C-001
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
        "condition_coverage_state": "PARTIAL",   # CE.6 GAP-C-001
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

    if cond_state == "BLOCKED":
        record["blocking_inputs"] = condition.get("blocking_inputs", [])
        record["blocking_reason"] = condition.get("blocking_reason", UNDEFINED)
    else:
        record["components"] = condition.get("components", {})

    return record


# ---------------------------------------------------------------------------
# CE.5 consumption layer — consumption_state_model.md, propagation_semantics.md
# CE.6 gaps: GAP-C-003, GAP-P-001, GAP-P-002, GAP-T-002, GAP-T-003 — CE.7 R-004, R-006
# ---------------------------------------------------------------------------

# Governed signal scope — Signal Ledger (CE.4)
GOVERNED_SIGNAL_IDS = [
    "SIG-001", "SIG-002", "SIG-003", "SIG-004",
    "SIG-005", "SIG-006", "SIG-007", "SIG-008",
]


def produce_ce5_consumption_record(signal):
    """CE.5 Type 1 consumption record per signal.
    CE.5 propagation_boundary_enforcement.md §3 (PBE-2):
    Delivers: signal_id, origin="CE.4", consumption_state, output_ref.
    Applies consumption rules C-001 (COMPLETE→AVAILABLE), C-002 (PARTIAL→PARTIAL),
    C-003 (BLOCKED→BLOCKED). CE.6 gaps: GAP-C-003, GAP-P-001, GAP-P-002.
    """
    consumption_state = CE4_TO_CE5_CONSUMPTION_STATE.get(signal.get("state"))
    return {
        "signal_id":         signal["signal_id"],
        "origin":            "CE.4",
        "consumption_state": consumption_state,
        "output_ref":        signal.get("output"),
    }


def produce_ce5_traceability_records(signals):
    """CE.5 consumption traceability records — consumption_traceability_model.md.
    Rule T-001: Type 2 structural gap trace for expected-but-absent signals.
    Rule T-002: Type 1 consumption traceability for all present signals.
    CE.6 gaps: GAP-T-002, GAP-T-003.
    """
    records = {}
    present_ids = set(signals.keys())
    for sig_id in GOVERNED_SIGNAL_IDS:
        if sig_id in present_ids:
            consumption_state = CE4_TO_CE5_CONSUMPTION_STATE.get(
                signals[sig_id].get("state")
            )
            records[sig_id] = {
                "signal_id":         sig_id,
                "origin":            "CE.4",
                "consumption_state": consumption_state,
                "record_type":       "Type 1",
            }
        else:
            # T-001 — structural gap trace record
            records[sig_id] = {
                "signal_id":   sig_id,
                "origin":      "CE.4",
                "status":      "MISSING",
                "record_type": "Type 2",
            }
    return records


# ---------------------------------------------------------------------------
# DEC-009 tier derivation — CE.10 (closes GAP-P-003, GAP-P-004)
# Per-condition-instance: each condition resolves independently (DEC-006).
# ---------------------------------------------------------------------------

def _get_field_value(signal, signal_field):
    """Extract signal field value for binding rule evaluation.
    For field='output': returns the raw output value (None for BLOCKED signals).
    For named fields: returns signal['output'][field_name] or None if output is None.
    """
    if signal_field == "output":
        return signal.get("output")
    output = signal.get("output")
    if output is None:
        return None
    return output.get(signal_field)


def _evaluate_rule(rule_id, field_value):
    """Evaluate one governed binding rule against a field value → exactly one tier.
    DEC-013: value-reactive; deterministic; one rule → one tier contribution.
    """
    rule = BINDING_RULES[rule_id]
    et = rule["evaluation_type"]
    if et == "NULL_CHECK":
        return "BLOCKED" if field_value is None else "STABLE"
    if field_value is None:
        return "BLOCKED"                            # null_handling for threshold rules
    if et == "BASELINE_THRESHOLD_ABOVE":
        return "AT_RISK" if field_value > rule["threshold"] else "STABLE"
    if et == "BASELINE_THRESHOLD_BELOW":
        return "AT_RISK" if field_value < rule["threshold"] else "STABLE"
    raise ValueError(f"Unknown evaluation_type in rule {rule_id}: {et}")


def derive_condition_tier(condition_id, signals):
    """DEC-009 per-condition-instance tier derivation.
    1. Collect binding rows for condition_id from BINDING_SURFACE (DEC-012).
    2. Evaluate each row's binding rule against declared signal field (DEC-013).
    3. Select max-tier per TIER_ORDER (DEC-009).
    CE.6 GAP-P-003, GAP-P-004 — CE.9 Decisions 2, 3 — CE.10 closure.
    """
    rows = [r for r in BINDING_SURFACE if r["condition_id"] == condition_id]
    contributions = [
        _evaluate_rule(
            row["binding_rule_id"],
            _get_field_value(signals[row["signal_id"]], row["signal_field"]),
        )
        for row in rows
    ]
    return max(contributions, key=lambda t: TIER_ORDER[t])


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

    # CE.5 consumption layer — produce consumption records per signal (GAP-C-003, GAP-P-001, GAP-P-002)
    ce5_consumption_records = {
        sig_id: produce_ce5_consumption_record(signals[sig_id])
        for sig_id in GOVERNED_SIGNAL_IDS
        if sig_id in signals
    }

    # CE.5 traceability records — Type 1 and Type 2 (GAP-T-002, GAP-T-003)
    ce5_traceability_records = produce_ce5_traceability_records(signals)

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

    # DEC-009 tier derivation — per-condition-instance (CE.6 GAP-P-003, GAP-P-004 — CE.10)
    # Overwrites condition_coverage_state with governed tier value (BLOCKED/DEGRADED/AT_RISK/STABLE).
    # Inserted between condition activation and diagnosis activation per CE.9 Decision 3.
    for cond in conditions:
        cond["condition_coverage_state"] = derive_condition_tier(cond["condition_id"], signals)

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

    # Summaries — DEC-009 tier vocabulary (BLOCKED/DEGRADED/AT_RISK/STABLE) — CE.10
    cond_stable    = [c["condition_id"] for c in conditions if c["condition_coverage_state"] == "STABLE"]
    cond_at_risk   = [c["condition_id"] for c in conditions if c["condition_coverage_state"] == "AT_RISK"]
    cond_degraded  = [c["condition_id"] for c in conditions if c["condition_coverage_state"] == "DEGRADED"]
    cond_blocked   = [c["condition_id"] for c in conditions if c["condition_coverage_state"] == "BLOCKED"]

    diag_active   = [d["diagnosis_id"] for d in diagnoses if d["diagnosis_activation_state"] == "ACTIVE"]
    diag_inactive = [d["diagnosis_id"] for d in diagnoses if d["diagnosis_activation_state"] == "INACTIVE"]
    diag_blocked  = [d["diagnosis_id"] for d in diagnoses if d["diagnosis_activation_state"] == "BLOCKED"]

    output = {
        "run_id": run_id,
        "stream": "40.6",
        "script": "activate_conditions.py",
        "derivation_run": "run_01_condition_activation",
        "upstream_signal_input": signal_input_path,
        "ce5_consumption_records": ce5_consumption_records,
        "ce5_traceability_records": ce5_traceability_records,
        "conditions": {c["condition_id"]: c for c in conditions},
        "diagnoses":  {d["diagnosis_id"]: d for d in diagnoses},
        "condition_summary": {
            "STABLE":    cond_stable,
            "AT_RISK":   cond_at_risk,
            "DEGRADED":  cond_degraded,
            "BLOCKED":   cond_blocked,
        },
        "diagnosis_summary": {
            "ACTIVE":    diag_active,
            "INACTIVE":  diag_inactive,
            "BLOCKED":   diag_blocked,
        },
    }

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"conditions  — STABLE: {cond_stable}  AT_RISK: {cond_at_risk}  DEGRADED: {cond_degraded}  BLOCKED: {cond_blocked}")
    print(f"diagnoses   — ACTIVE:    {diag_active}  INACTIVE: {diag_inactive}  BLOCKED: {diag_blocked}")
    print(f"ce5_traceability: {len(ce5_traceability_records)} records ({sum(1 for r in ce5_traceability_records.values() if r['record_type'] == 'Type 1')} Type 1, {sum(1 for r in ce5_traceability_records.values() if r['record_type'] == 'Type 2')} Type 2)")
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

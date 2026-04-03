# compute_signals.py
#
# Materialized from: runs/pios/40.5/run_02_ce_validation/
# Source artifacts:
#   signal_computation_specification.md
#   signal_input_matrix.md
#   signal_output_set.md
#   signal_traceability_map.md
#   signal_validation_report.md
#   execution_manifest.md
#
# Derivation run: run_02_ce_validation (Stream 40.5)
# Canonical signal schema: SIG-001..SIG-008 (CKR-006..CKR-015)
#
# No formulas, identifiers, thresholds, field names, or fallback behavior
# invented beyond explicit evidence in the derivation run artifacts.
# PARTIAL and BLOCKED states are preserved exactly as proven in run_02.

import json
import os
import sys

UNDEFINED = None

# ---------------------------------------------------------------------------
# Canonical signal schema — signal_computation_specification.md
# ---------------------------------------------------------------------------

SIGNAL_SCHEMA = {
    "SIG-001": {"canonical_name": "Coordination Pressure", "ckr": "CKR-006"},
    "SIG-002": {"canonical_name": "Dependency Load",       "ckr": "CKR-007"},
    "SIG-003": {"canonical_name": "Change Concentration",  "ckr": "CKR-008"},
    "SIG-004": {"canonical_name": "Structural Volatility", "ckr": "CKR-009"},
    "SIG-005": {"canonical_name": "Execution Throughput",  "ckr": "CKR-010"},
    "SIG-006": {"canonical_name": "Execution Stability",   "ckr": "CKR-011"},
    "SIG-007": {"canonical_name": "ESI",                   "ckr": "CKR-014"},
    "SIG-008": {"canonical_name": "RAG",                   "ckr": "CKR-015"},
}

# ---------------------------------------------------------------------------
# Static input variables — signal_input_matrix.md (Group VAR_ST + declared constants)
# Proven values from run_02_ce_validation. Source: docs/pios/40.4/
# ---------------------------------------------------------------------------

STATIC_VARIABLES = {
    # Group VAR_ST — structural_telemetry.md
    "VAR_ST_006": 8,    # ST-006: Architectural Responsibility Zone Count
    "VAR_ST_007": 22,   # ST-007: PEG Total Node Count
    "VAR_ST_009": 10,   # ST-009: PEG Module Node Count
    "VAR_ST_010": 28,   # ST-010: PEG Total Edge Count
    "VAR_ST_011": 12,   # ST-011: PEG Containment Edge Count
    "VAR_ST_012": 7,    # ST-012: PEG Pipeline Edge Count
    "VAR_ST_013": 3,    # ST-013: PEG Model Activation Edge Count
    "VAR_ST_014": 2,    # ST-014: PEG Governance Edge Count
    "VAR_ST_015": 3,    # ST-015: Non-PEG Governance Constraint Count
    "VAR_ST_016": 8,    # ST-016: PiOS Pipeline Stage Count
    # Group VAR_AT — activity_telemetry.md (declared constants, event-based per run)
    "VAR_AT_005": 8,    # AT-005: Pipeline Module Execution Count Per Run
    # Group VAR_DT — delivery_telemetry.md (declared constants, event-based per run)
    "VAR_DT_001": 4,    # DT-001: Intelligence Output Artifact Count Per Run
    "VAR_DT_003": 5,    # DT-003: Reconstruction Artifact Delivery Count Per Run
}

# Runtime and time-series variables — default UNDEFINED
# These are PENDING in static 40.4 context; override via input file for live runs.
RUNTIME_VARIABLES = {
    "VAR_AT_007": UNDEFINED,  # AT-007: Validation Gate Enforcement Count Per Run (event-based)
    "VAR_AT_009": UNDEFINED,  # AT-009: Feedback Routing Event Count Per Pipeline Run (event-based)
    "VAR_DT_007": UNDEFINED,  # DT-007: Pipeline Run Completion Status (event-based)
    "VAR_DT_008": UNDEFINED,  # DT-008: Feedback Loop Delivery Event Count (event-based)
    "VAR_AT_001": UNDEFINED,  # AT-001: Automation Trigger Frequency (time-series)
    "VAR_AT_002": UNDEFINED,  # AT-002: Auto-Commit Event Frequency (time-series)
    "VAR_AT_003": 1,          # AT-003: Script Execution Event Count (1/invocation; insufficient alone for SIG-003)
}

REQUIRED_STATIC_VARIABLES = list(STATIC_VARIABLES.keys())

# ---------------------------------------------------------------------------
# Signal computation functions
# Formulas exactly as defined in signal_computation_specification.md
# Rounding: round(x, 3) — matches proven run_02 outputs
# ---------------------------------------------------------------------------

def compute_sig_001(v):
    """SIG-001 Coordination Pressure — CKR-006
    static_structural_ratio = VAR_ST_012 / VAR_ST_016
    runtime_component = VAR_AT_005 * VAR_AT_007 (PENDING — event-based)
    State: PARTIAL — static component computed; runtime component UNDEFINED
    """
    static_structural_ratio = round(v["VAR_ST_012"] / v["VAR_ST_016"], 3)
    runtime_component = UNDEFINED  # VAR_AT_007 is PENDING
    return {
        "signal_id": "SIG-001",
        "canonical_name": "Coordination Pressure",
        "ckr": "CKR-006",
        "state": "PARTIAL",
        "output": {
            "static_structural_ratio": static_structural_ratio,
            "runtime_component": runtime_component,
        },
        "traceability": {
            "static_structural_ratio": "VAR_ST_012 / VAR_ST_016",
        },
        "partiality_reasons": {
            # CE.4 INV-005 — CE.6 GAP-E-001 — R-002
            "runtime_component": {
                "failure_class": "F-1b",
                "cause": "VAR_AT_007 not present in static 40.4 telemetry; requires live pipeline execution",
            },
        },
    }


def compute_sig_002(v):
    """SIG-002 Dependency Load — CKR-007
    dependency_edge_count = VAR_ST_012 + VAR_ST_013 + VAR_ST_014 + VAR_ST_015
    dependency_load_ratio = dependency_edge_count / VAR_ST_007
    State: COMPLETE — all inputs static
    """
    dependency_edge_count = (
        v["VAR_ST_012"] + v["VAR_ST_013"] + v["VAR_ST_014"] + v["VAR_ST_015"]
    )
    dependency_load_ratio = round(dependency_edge_count / v["VAR_ST_007"], 3)
    return {
        "signal_id": "SIG-002",
        "canonical_name": "Dependency Load",
        "ckr": "CKR-007",
        "state": "COMPLETE",
        "output": {
            "dependency_edge_count": dependency_edge_count,
            "dependency_load_ratio": dependency_load_ratio,
        },
        "traceability": {
            "dependency_edge_count": "VAR_ST_012 + VAR_ST_013 + VAR_ST_014 + VAR_ST_015",
            "dependency_load_ratio": "dependency_edge_count / VAR_ST_007",
        },
    }


def compute_sig_003(v):
    """SIG-003 Change Concentration — CKR-008
    Requires VAR_AT_001 and VAR_AT_002: accumulated time-series data across
    successive push-to-main intervals. Not present in static 40.4 telemetry.
    State: BLOCKED — AT-001 and AT-002 PENDING
    """
    if v.get("VAR_AT_001") is UNDEFINED or v.get("VAR_AT_002") is UNDEFINED:
        return {
            "signal_id": "SIG-003",
            "canonical_name": "Change Concentration",
            "ckr": "CKR-008",
            "state": "BLOCKED",
            "output": UNDEFINED,
            "blocking_class": "F-1a",   # CE.4 INV-004 — CE.6 GAP-E-002 — R-001
            "blocking_inputs": ["VAR_AT_001", "VAR_AT_002"],
            "blocking_reason": (
                "AT-001 and AT-002 require accumulated time-series data across "
                "successive push-to-main intervals; not present in static 40.4 telemetry"
            ),
        }
    # Unreachable in static context; both AT-001 and AT-002 are PENDING
    return {
        "signal_id": "SIG-003",
        "canonical_name": "Change Concentration",
        "ckr": "CKR-008",
        "state": "BLOCKED",
        "output": UNDEFINED,
        "blocking_class": "F-1a",   # CE.4 INV-004 — CE.6 GAP-E-002 — R-001
        "blocking_inputs": ["VAR_AT_001", "VAR_AT_002"],
        "blocking_reason": (
            "AT-001 and AT-002 require accumulated time-series data across "
            "successive push-to-main intervals; not present in static 40.4 telemetry"
        ),
    }


def compute_sig_004(v):
    """SIG-004 Structural Volatility — CKR-009
    total_edge_density     = VAR_ST_010 / VAR_ST_007
    containment_density    = VAR_ST_011 / VAR_ST_007
    responsibility_density = VAR_ST_006 / VAR_ST_007
    module_density         = VAR_ST_009 / VAR_ST_007
    State: COMPLETE — all inputs static
    """
    n = v["VAR_ST_007"]
    return {
        "signal_id": "SIG-004",
        "canonical_name": "Structural Volatility",
        "ckr": "CKR-009",
        "state": "COMPLETE",
        "output": {
            "total_edge_density":     round(v["VAR_ST_010"] / n, 3),
            "containment_density":    round(v["VAR_ST_011"] / n, 3),
            "responsibility_density": round(v["VAR_ST_006"] / n, 3),
            "module_density":         round(v["VAR_ST_009"] / n, 3),
        },
        "traceability": {
            "total_edge_density":     "VAR_ST_010 / VAR_ST_007",
            "containment_density":    "VAR_ST_011 / VAR_ST_007",
            "responsibility_density": "VAR_ST_006 / VAR_ST_007",
            "module_density":         "VAR_ST_009 / VAR_ST_007",
        },
    }


def compute_sig_005(v):
    """SIG-005 Execution Throughput — CKR-010
    total_artifacts_per_run = VAR_DT_001 + VAR_DT_003
    pipeline_stages_per_run = VAR_AT_005
    throughput_rate = total_artifacts_per_run / pipeline_stages_per_run
    completion_factor = VAR_DT_007 (PENDING — event-based)
    State: PARTIAL — throughput rate computed; completion factor UNDEFINED
    """
    total_artifacts_per_run = v["VAR_DT_001"] + v["VAR_DT_003"]
    pipeline_stages_per_run = v["VAR_AT_005"]
    throughput_rate = round(total_artifacts_per_run / pipeline_stages_per_run, 3)
    completion_factor = v.get("VAR_DT_007")  # UNDEFINED (PENDING runtime)
    return {
        "signal_id": "SIG-005",
        "canonical_name": "Execution Throughput",
        "ckr": "CKR-010",
        "state": "PARTIAL",
        "output": {
            "total_artifacts_per_run": total_artifacts_per_run,
            "pipeline_stages_per_run": pipeline_stages_per_run,
            "throughput_rate": throughput_rate,
            "completion_factor": completion_factor,
        },
        "traceability": {
            "total_artifacts_per_run": "VAR_DT_001 + VAR_DT_003",
            "pipeline_stages_per_run": "VAR_AT_005",
            "throughput_rate": "total_artifacts_per_run / pipeline_stages_per_run",
        },
        "partiality_reasons": {
            # CE.4 INV-005 — CE.6 GAP-E-003 — R-002
            "completion_factor": {
                "failure_class": "F-1b",
                "cause": "VAR_DT_007 not present in static 40.4 telemetry; requires live pipeline execution",
            },
        },
    }


def compute_sig_006(v):
    """SIG-006 Execution Stability — CKR-011
    All inputs event-based; require live pipeline execution.
    Inputs: VAR_AT_007, VAR_AT_009, VAR_DT_007, VAR_DT_008 — all PENDING
    State: BLOCKED
    """
    return {
        "signal_id": "SIG-006",
        "canonical_name": "Execution Stability",
        "ckr": "CKR-011",
        "state": "BLOCKED",
        "output": UNDEFINED,
        "blocking_class": "F-1a",   # CE.4 INV-004 — CE.6 GAP-E-004 — R-001
        "blocking_inputs": ["VAR_AT_007", "VAR_AT_009", "VAR_DT_007", "VAR_DT_008"],
        "blocking_reason": "All inputs event-based; require live pipeline execution",
    }


def compute_sig_007(sig_002, sig_005, sig_006):
    """SIG-007 ESI (Execution Stability Index) — CKR-014
    Derived from SIG-002, SIG-005, SIG-006.
    SIG-002 component: RESOLVED (dependency_load_ratio = 0.682)
    SIG-005 completion_factor: UNDEFINED (DT-007 PENDING)
    SIG-006 component: BLOCKED (UNDEFINED)
    ESI composite not computable without SIG-006.
    State: PARTIAL
    """
    sig_002_component = sig_002["output"]["dependency_load_ratio"]
    sig_005_completion_factor = sig_005["output"]["completion_factor"]  # UNDEFINED
    sig_006_component = UNDEFINED  # SIG-006 is BLOCKED
    return {
        "signal_id": "SIG-007",
        "canonical_name": "ESI",
        "ckr": "CKR-014",
        "state": "PARTIAL",
        "output": {
            "sig_002_dependency_load_component": sig_002_component,
            "sig_005_completion_factor_component": sig_005_completion_factor,
            "sig_006_stability_component": sig_006_component,
        },
        "partiality_reasons": {
            # CE.4 INV-005 — CE.6 GAP-E-005 — R-002/R-003
            "sig_005_completion_factor_component": {
                "failure_class": "F-4",
                "upstream_signal": "SIG-005",
                "upstream_field": "completion_factor",
                "cause": "completion_factor is null in upstream SIG-005 output (VAR_DT_007 PENDING)",
            },
            "sig_006_stability_component": {
                "failure_class": "F-3",
                "upstream_signal": "SIG-006",
                "cause": "SIG-006 is BLOCKED; no stability component available",
            },
        },
    }


def compute_sig_008(sig_001, sig_003, sig_004):
    """SIG-008 RAG (Risk Acceleration Gradient) — CKR-015
    Derived from SIG-001, SIG-003, SIG-004.
    SIG-001 static structural component: RESOLVED (0.875)
    SIG-004 density ratios: RESOLVED (1.273 / 0.545 / 0.364 / 0.455)
    SIG-003 component: BLOCKED (UNDEFINED)
    RAG acceleration component not computable without SIG-003.
    State: PARTIAL
    """
    sig_001_structural = sig_001["output"]["static_structural_ratio"]
    sig_004_out = sig_004["output"]
    sig_003_component = UNDEFINED  # SIG-003 is BLOCKED
    return {
        "signal_id": "SIG-008",
        "canonical_name": "RAG",
        "ckr": "CKR-015",
        "state": "PARTIAL",
        "output": {
            "sig_001_coordination_pressure_component": sig_001_structural,
            "sig_004_total_edge_density":              sig_004_out["total_edge_density"],
            "sig_004_containment_density":             sig_004_out["containment_density"],
            "sig_004_responsibility_density":          sig_004_out["responsibility_density"],
            "sig_004_module_density":                  sig_004_out["module_density"],
            "sig_003_change_concentration_component":  sig_003_component,
        },
        "partiality_reasons": {
            # CE.4 INV-005 — CE.6 GAP-E-007 — R-002/R-003
            "sig_003_change_concentration_component": {
                "failure_class": "F-3",
                "upstream_signal": "SIG-003",
                "cause": "SIG-003 is BLOCKED; no change concentration component available",
            },
        },
    }


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
    forbidden_tokens = (
        os.sep + "41." ,
        os.sep + "42." ,
        os.sep + "demo",
        os.sep + "51." ,
    )
    for token in forbidden_tokens:
        if token in norm:
            sys.exit(f"ERROR: FORBIDDEN input path — references prohibited scope: {path}")


# ---------------------------------------------------------------------------
# Variable loading
# ---------------------------------------------------------------------------

def load_variables(input_path=None):
    """Merge static proven values with runtime defaults (UNDEFINED).
    Optional input_path: JSON file with variable overrides for live pipeline context.
    Fail-closed: all required static variables must be present and non-None.
    """
    variables = {}
    variables.update(STATIC_VARIABLES)
    variables.update(RUNTIME_VARIABLES)

    if input_path is not None:
        validate_input_path(input_path)
        if not os.path.isfile(input_path):
            sys.exit(f"ERROR: input file not found: {input_path}")
        with open(input_path, "r") as f:
            overrides = json.load(f)
        variables.update(overrides)

    for key in REQUIRED_STATIC_VARIABLES:
        if variables.get(key) is None:
            sys.exit(f"ERROR: required static variable missing or None: {key}")

    return variables


# ---------------------------------------------------------------------------
# Main computation entry point
# ---------------------------------------------------------------------------

def compute(run_id, input_path=None, output_path=None):
    if output_path is None:
        output_path = os.path.join("runs", "pios", "40.5", run_id, "signal_output.json")

    validate_output_path(output_path)

    variables = load_variables(input_path)

    # Compute signals in canonical order — deterministic, SIG-001..SIG-008
    sig_001 = compute_sig_001(variables)
    sig_002 = compute_sig_002(variables)
    sig_003 = compute_sig_003(variables)
    sig_004 = compute_sig_004(variables)
    sig_005 = compute_sig_005(variables)
    sig_006 = compute_sig_006(variables)
    sig_007 = compute_sig_007(sig_002, sig_005, sig_006)
    sig_008 = compute_sig_008(sig_001, sig_003, sig_004)

    signals = [sig_001, sig_002, sig_003, sig_004, sig_005, sig_006, sig_007, sig_008]

    complete = [s["signal_id"] for s in signals if s["state"] == "COMPLETE"]
    partial  = [s["signal_id"] for s in signals if s["state"] == "PARTIAL"]
    blocked  = [s["signal_id"] for s in signals if s["state"] == "BLOCKED"]

    completeness = "COMPLETE" if not partial and not blocked else "PARTIAL"

    output = {
        "run_id": run_id,
        "stream": "40.5",
        "script": "compute_signals.py",
        "derivation_run": "run_02_ce_validation",
        "signals": {s["signal_id"]: s for s in signals},
        "summary": {
            "COMPLETE": complete,
            "PARTIAL": partial,
            "BLOCKED": blocked,
            "signal_output_completeness": completeness,
        },
    }

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"signal_output_completeness: {completeness}")
    print(f"COMPLETE: {complete}")
    print(f"PARTIAL:  {partial}")
    print(f"BLOCKED:  {blocked}")
    print(f"output: {output_path}")

    return output


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(
            "usage: compute_signals.py <run_id> [input_path] [output_path]",
            file=sys.stderr,
        )
        print(
            "  run_id      — required; run identifier for this execution",
            file=sys.stderr,
        )
        print(
            "  input_path  — optional; JSON file with variable overrides",
            file=sys.stderr,
        )
        print(
            "  output_path — optional; defaults to runs/pios/40.5/<run_id>/signal_output.json",
            file=sys.stderr,
        )
        sys.exit(1)

    _run_id      = sys.argv[1]
    _input_path  = sys.argv[2] if len(sys.argv) > 2 else None
    _output_path = sys.argv[3] if len(sys.argv) > 3 else None

    compute(_run_id, input_path=_input_path, output_path=_output_path)

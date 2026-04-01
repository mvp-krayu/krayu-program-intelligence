# synthesize_intelligence.py
#
# Materialized from: runs/pios/40.7/run_01_intelligence_synthesis/
# Source artifacts:
#   diagnosis_input_verification.md
#   diagnosis_normalization_report.md
#   intelligence_input_matrix.md
#   intelligence_synthesis_specification.md
#   intelligence_output_set.md
#   intelligence_traceability_map.md
#   intelligence_validation_report.md
#   execution_manifest.md
#
# Derivation run: run_01_intelligence_synthesis (Stream 40.7)
# Canonical intelligence schema: INTEL-001..INTEL-008
#
# No synthesis formulas, thresholds, identifiers, field names, or fallback
# behavior invented beyond explicit evidence in the derivation run artifacts.
# Synthesis rules SR-01..SR-10 reproduced exactly.
# COMPLETE/PARTIAL/BLOCKED states propagate as proven in run_01_intelligence_synthesis.
# No signals recomputed. No conditions or diagnoses recomputed.
# No semantic enrichment. No root-cause logic. No narrative language.

import json
import os
import sys

UNDEFINED = None

# ---------------------------------------------------------------------------
# Synthesis state mapping — intelligence_synthesis_specification.md SR-02
# diagnosis activation state → intelligence synthesis state
# ---------------------------------------------------------------------------

DIAGNOSIS_TO_SYNTHESIS_STATE = {
    "active":   "synthesized",
    "partial":  "partial",
    "blocked":  "blocked",
}

# ---------------------------------------------------------------------------
# IVAR_ mapping — intelligence_input_matrix.md
# SR-01: each intelligence entry derived from exactly one IVAR_ input (1:1)
# ---------------------------------------------------------------------------

IVAR_MAP = {
    "IVAR_001": {"diagnosis_id": "DIAG-001", "intel_id": "INTEL-001"},
    "IVAR_002": {"diagnosis_id": "DIAG-002", "intel_id": "INTEL-002"},
    "IVAR_003": {"diagnosis_id": "DIAG-003", "intel_id": "INTEL-003"},
    "IVAR_004": {"diagnosis_id": "DIAG-004", "intel_id": "INTEL-004"},
    "IVAR_005": {"diagnosis_id": "DIAG-005", "intel_id": "INTEL-005"},
    "IVAR_006": {"diagnosis_id": "DIAG-006", "intel_id": "INTEL-006"},
    "IVAR_007": {"diagnosis_id": "DIAG-007", "intel_id": "INTEL-007"},
    "IVAR_008": {"diagnosis_id": "DIAG-008", "intel_id": "INTEL-008"},
}

# ---------------------------------------------------------------------------
# Intelligence schema — intelligence_synthesis_specification.md
# SR-06: each entry declares source DIAG, originating COND, supporting SIG(s),
#         synthesis state, evidence scope note.
# SR-09: label derived from diagnosis canonical name — no relabeling.
# ---------------------------------------------------------------------------

INTEL_SCHEMA = {
    "INTEL-001": {
        "canonical_name":      "Dependency Load Elevation",
        "ivar":                "IVAR_001",
        "source_diagnosis":    "DIAG-001",
        "originating_condition": "COND-001",
        "supporting_signals":  "SIG-002",
        # SR-10: evidence-bounded scope note — verbatim from intelligence_synthesis_specification.md
        "evidence_scope_note": (
            "Intelligence entry is supported by full SIG-002 (Dependency Load) evidence. "
            "Values are static structural telemetry from 40.4. No runtime component. "
            "Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority."
        ),
    },
    "INTEL-002": {
        "canonical_name":      "Structural Volatility State",
        "ivar":                "IVAR_002",
        "source_diagnosis":    "DIAG-002",
        "originating_condition": "COND-002",
        "supporting_signals":  "SIG-004",
        "evidence_scope_note": (
            "Intelligence entry is supported by full SIG-004 (Structural Volatility) evidence — "
            "four density ratios from static structural telemetry (ST-006, ST-007, ST-009, ST-010, ST-011). "
            "No runtime component. Threshold evaluation: Stream 75.1 authority. "
            "Root cause attribution: Stream 75.2 authority."
        ),
    },
    "INTEL-003": {
        "canonical_name":      "Coordination Pressure Active",
        "ivar":                "IVAR_003",
        "source_diagnosis":    "DIAG-003",
        "originating_condition": "COND-003",
        "supporting_signals":  "SIG-001",
        "evidence_scope_note": (
            "Intelligence entry is supported by the static structural component of SIG-001 "
            "(ST-012/ST-016 = 7/8 = 0.875) only. Runtime component requires AT-007 event-based "
            "telemetry — unavailable in static 40.4 inputs. Intelligence state is partial, not complete. "
            "Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority."
        ),
    },
    "INTEL-004": {
        "canonical_name":      "Throughput Degradation Risk",
        "ivar":                "IVAR_004",
        "source_diagnosis":    "DIAG-004",
        "originating_condition": "COND-004",
        "supporting_signals":  "SIG-005",
        "evidence_scope_note": (
            "Intelligence entry is supported by static throughput constants from SIG-005 "
            "(9 artifacts / 8 stages = 1.125). Completion factor requires DT-007 event-based "
            "delivery telemetry — unavailable in static 40.4 inputs. Intelligence state is partial. "
            "Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority."
        ),
    },
    "INTEL-005": {
        "canonical_name":      "Change Concentration Accumulation",
        "ivar":                "IVAR_005",
        "source_diagnosis":    "DIAG-005",
        "originating_condition": "COND-005",
        "supporting_signals":  "SIG-003",
        "evidence_scope_note": (
            "No evidence available for this intelligence entry. SIG-003 (Change Concentration) "
            "is fully blocked. AT-001 and AT-002 require GitHub push-to-main event streams across "
            "successive intervals — not present in static analysis context. "
            "Intelligence entry declared blocked, not omitted."
        ),
    },
    "INTEL-006": {
        "canonical_name":      "Execution Instability",
        "ivar":                "IVAR_006",
        "source_diagnosis":    "DIAG-006",
        "originating_condition": "COND-006",
        "supporting_signals":  "SIG-006",
        "evidence_scope_note": (
            "No evidence available for this intelligence entry. SIG-006 (Execution Stability) "
            "is fully blocked. All four required inputs are live pipeline event-based — "
            "unavailable in static 40.4 context. Intelligence entry declared blocked, not omitted."
        ),
    },
    "INTEL-007": {
        "canonical_name":      "Execution Health Deficit",
        "ivar":                "IVAR_007",
        "source_diagnosis":    "DIAG-007",
        "originating_condition": "COND-007",
        "supporting_signals":  "SIG-007",
        "evidence_scope_note": (
            "Intelligence entry is supported by the SIG-002 component of SIG-007 (ESI) only. "
            "SIG-005 completion and SIG-006 components are UNDEFINED — dependent on DT-007 and "
            "AT-007/AT-009/DT-008 respectively. ESI composite value is not computable. "
            "Intelligence state is partial. Threshold evaluation: Stream 75.1 authority. "
            "Root cause attribution: Stream 75.2 authority."
        ),
    },
    "INTEL-008": {
        "canonical_name":      "Risk Acceleration State",
        "ivar":                "IVAR_008",
        "source_diagnosis":    "DIAG-008",
        "originating_condition": "COND-008",
        "supporting_signals":  "SIG-008",
        "evidence_scope_note": (
            "Intelligence entry is supported by SIG-001 and SIG-004 components of SIG-008 (RAG) only. "
            "SIG-003 component is UNDEFINED — blocked due to AT-001/AT-002 time-series absence. "
            "RAG composite value is not fully computable. Intelligence state is partial. "
            "Threshold evaluation: Stream 75.1 authority. Root cause attribution: Stream 75.2 authority."
        ),
    },
}

# ---------------------------------------------------------------------------
# Intelligence synthesis functions
# SR-03: values carried forward exactly from diagnosis — no recomputation.
# SR-04: UNDEFINED components remain UNDEFINED.
# SR-05: blocked entries recorded explicitly.
# ---------------------------------------------------------------------------

def synthesize_intel(intel_id, diagnosis):
    """Generic synthesis function — SR-01..SR-10.
    diagnosis activation state → intelligence synthesis state (SR-02).
    Components carried from diagnosis record exactly (SR-03).
    UNDEFINED propagated without substitution (SR-04).
    Blocked entries explicit (SR-05).
    """
    schema = INTEL_SCHEMA[intel_id]
    diag_state = diagnosis["diagnosis_activation_state"]
    synthesis_state = DIAGNOSIS_TO_SYNTHESIS_STATE[diag_state]

    record = {
        "intel_id":             intel_id,
        "canonical_name":       schema["canonical_name"],       # SR-09
        "ivar":                 schema["ivar"],
        "source_diagnosis":     schema["source_diagnosis"],      # SR-06
        "originating_condition": schema["originating_condition"], # SR-06
        "supporting_signals":   schema["supporting_signals"],    # SR-06
        "diagnosis_activation_state": diag_state,
        "synthesis_state":      synthesis_state,                 # SR-02
        "evidence_scope_note":  schema["evidence_scope_note"],   # SR-10
    }

    if diag_state == "blocked":
        # SR-05: explicit blocked record; components not applicable
        record["blocking_inputs"] = diagnosis.get("blocking_inputs", [])
        record["blocking_reason"] = diagnosis.get("blocking_reason", UNDEFINED)
    else:
        # SR-03: carry components forward exactly; SR-04: UNDEFINED stays UNDEFINED
        record["components"] = diagnosis.get("components", {})

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
# Diagnosis output loading
# ---------------------------------------------------------------------------

def load_diagnosis_output(condition_input_path):
    """Load condition/diagnosis output JSON from activate_conditions.py.
    Fail-closed: file must exist and contain all 8 canonical diagnosis IDs.
    No diagnosis values recomputed — passed through exactly as loaded.
    """
    validate_input_path(condition_input_path)
    if not os.path.isfile(condition_input_path):
        sys.exit(f"ERROR: condition input file not found: {condition_input_path}")

    with open(condition_input_path, "r") as f:
        data = json.load(f)

    diagnoses = data.get("diagnoses", {})
    required = [schema["source_diagnosis"] for schema in INTEL_SCHEMA.values()]
    for diag_id in required:
        if diag_id not in diagnoses:
            sys.exit(f"ERROR: required diagnosis missing from input: {diag_id}")

    return diagnoses


# ---------------------------------------------------------------------------
# Main synthesis entry point
# ---------------------------------------------------------------------------

def synthesize(run_id, condition_input_path, output_path=None):
    if output_path is None:
        output_path = os.path.join("runs", "pios", "40.7", run_id, "intelligence_output.json")

    validate_output_path(output_path)

    diagnoses = load_diagnosis_output(condition_input_path)

    # Synthesize intelligence entries — canonical order INTEL-001..INTEL-008, deterministic
    intel_001 = synthesize_intel("INTEL-001", diagnoses["DIAG-001"])
    intel_002 = synthesize_intel("INTEL-002", diagnoses["DIAG-002"])
    intel_003 = synthesize_intel("INTEL-003", diagnoses["DIAG-003"])
    intel_004 = synthesize_intel("INTEL-004", diagnoses["DIAG-004"])
    intel_005 = synthesize_intel("INTEL-005", diagnoses["DIAG-005"])
    intel_006 = synthesize_intel("INTEL-006", diagnoses["DIAG-006"])
    intel_007 = synthesize_intel("INTEL-007", diagnoses["DIAG-007"])
    intel_008 = synthesize_intel("INTEL-008", diagnoses["DIAG-008"])

    entries = [intel_001, intel_002, intel_003, intel_004,
               intel_005, intel_006, intel_007, intel_008]

    synthesized = [e["intel_id"] for e in entries if e["synthesis_state"] == "synthesized"]
    partial      = [e["intel_id"] for e in entries if e["synthesis_state"] == "partial"]
    blocked      = [e["intel_id"] for e in entries if e["synthesis_state"] == "blocked"]

    output = {
        "run_id":           run_id,
        "stream":           "40.7",
        "script":           "synthesize_intelligence.py",
        "derivation_run":   "run_01_intelligence_synthesis",
        "upstream_condition_input": condition_input_path,
        "intelligence":     {e["intel_id"]: e for e in entries},
        "summary": {
            "synthesized":  synthesized,
            "partial":      partial,
            "blocked":      blocked,
            "intelligence_output_completeness": "COMPLETE" if not partial and not blocked else "PARTIAL",
        },
    }

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"synthesized: {synthesized}")
    print(f"partial:     {partial}")
    print(f"blocked:     {blocked}")
    print(f"intelligence_output_completeness: {output['summary']['intelligence_output_completeness']}")
    print(f"output: {output_path}")

    return output


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(
            "usage: synthesize_intelligence.py <run_id> <condition_input_path> [output_path]",
            file=sys.stderr,
        )
        print(
            "  run_id                — required; run identifier for this execution",
            file=sys.stderr,
        )
        print(
            "  condition_input_path  — required; JSON output from activate_conditions.py",
            file=sys.stderr,
        )
        print(
            "  output_path           — optional; defaults to runs/pios/40.7/<run_id>/intelligence_output.json",
            file=sys.stderr,
        )
        sys.exit(1)

    _run_id     = sys.argv[1]
    _cond_path  = sys.argv[2]
    _out_path   = sys.argv[3] if len(sys.argv) > 3 else None

    synthesize(_run_id, _cond_path, output_path=_out_path)

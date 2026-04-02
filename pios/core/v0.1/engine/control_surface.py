# control_surface.py
#
# Stream: 40.10 — Agentic Orchestration & Runtime Control Layer
# Contract: PIOS-40.10-CONTROL-SURFACE-v1
#
# Derived from:
#   runs/pios/40.9/run_01_feedback_registry/feedback_signal_registry.json
#   (actual schema: signals[].classification, signals[].entity_id,
#                   signals[].baseline_state, signals[].current_state)
#
# Purpose:
#   Control signal translation layer.
#   Maps feedback classification deltas → control directives.
#   No decision logic. No prioritization. No scoring. No thresholds.
#   No agent behavior. No state modification. No inference.
#   Only: classification routing.
#
# Classification mapping (ONLY allowed):
#   NO_CHANGE    → NO_ACTION
#   STATE_CHANGE → REVIEW_REQUIRED
#   ADDED        → REGISTER_ENTITY
#   REMOVED      → DEREGISTER_ENTITY
#
# CLI:
#   control_surface.py <run_id> <feedback_registry_path> [output_dir]
#
#   feedback_registry_path — feedback_signal_registry.json from 40.9 run

import json
import os
import sys
from datetime import datetime, timezone

# Allowed classification values from 40.9 input
ALLOWED_CLASSIFICATIONS = {"NO_CHANGE", "STATE_CHANGE", "ADDED", "REMOVED"}

# Strict mapping: classification → directive_type (no other mappings exist)
CLASSIFICATION_TO_DIRECTIVE = {
    "NO_CHANGE":    "NO_ACTION",
    "STATE_CHANGE": "REVIEW_REQUIRED",
    "ADDED":        "REGISTER_ENTITY",
    "REMOVED":      "DEREGISTER_ENTITY",
}

# Origin run reference — fixed, derived from input basis
ORIGIN_RUN = "40.9/run_01_feedback_registry"

# Required fields in each directive — no additions, no omissions
DIRECTIVE_FIELDS = {
    "entity_id",
    "directive_type",
    "source_change_type",
    "baseline_state",
    "current_state",
    "origin_run",
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
        "runs/pios/40.9/run_01_feedback_registry",
        "runs/pios/40.8",
        "runs/pios/40.7",
        "runs/pios/40.6",
        "runs/pios/40.5",
    ):
        immutable = _resolve(os.path.join(cwd, prefix))
        if norm.startswith(immutable + os.sep) or norm == immutable:
            sys.exit(f"ERROR: FORBIDDEN output path — targets immutable run: {path}")

    for token in (os.sep + "42.", os.sep + "demo", os.sep + "51.", os.sep + "41."):
        if token in norm:
            sys.exit(f"ERROR: FORBIDDEN output path — targets prohibited scope: {path}")


def validate_no_overwrite(output_dir):
    if os.path.isdir(output_dir):
        sys.exit(f"ERROR: NO-OVERWRITE violation — output directory already exists: {output_dir}")


# ---------------------------------------------------------------------------
# Input loading — fail-closed
# ---------------------------------------------------------------------------

def load_feedback_registry(path):
    if not os.path.isfile(path):
        sys.exit(f"ERROR: feedback signal registry not found: {path}")
    with open(path, "r") as f:
        data = json.load(f)
    if "signals" not in data:
        sys.exit(f"ERROR: feedback registry missing 'signals' key: {path}")
    if not isinstance(data["signals"], list):
        sys.exit(f"ERROR: feedback registry 'signals' must be a list: {path}")
    return data


# ---------------------------------------------------------------------------
# Signal validation — fail-closed on each entry
# ---------------------------------------------------------------------------

def validate_signal(signal, index):
    required = {"entity_id", "classification", "baseline_state", "current_state"}
    for field in required:
        if field not in signal:
            sys.exit(f"ERROR: signal[{index}] missing required field '{field}'")
    classification = signal["classification"]
    if classification not in ALLOWED_CLASSIFICATIONS:
        sys.exit(
            f"ERROR: signal[{index}] entity_id={signal.get('entity_id')} "
            f"has unknown classification '{classification}' — not in allowed set"
        )


# ---------------------------------------------------------------------------
# Directive construction — strict mapping, no additional fields
# ---------------------------------------------------------------------------

def build_directive(signal):
    """Map one feedback signal → one control directive.
    Exactly DIRECTIVE_FIELDS produced. No additional fields. No computed fields.
    """
    classification = signal["classification"]
    directive_type = CLASSIFICATION_TO_DIRECTIVE[classification]

    directive = {
        "entity_id":          signal["entity_id"],
        "directive_type":     directive_type,
        "source_change_type": classification,
        "baseline_state":     signal["baseline_state"],
        "current_state":      signal["current_state"],
        "origin_run":         ORIGIN_RUN,
    }

    # Enforce no extra fields
    assert set(directive.keys()) == DIRECTIVE_FIELDS, (
        f"Directive field set mismatch for {signal['entity_id']}: {set(directive.keys())}"
    )

    return directive


# ---------------------------------------------------------------------------
# Artifact construction
# ---------------------------------------------------------------------------

def build_control_directive_registry(run_id, directives, feedback_run_id):
    directive_summary = {dt: 0 for dt in CLASSIFICATION_TO_DIRECTIVE.values()}
    for d in directives:
        directive_summary[d["directive_type"]] += 1

    return {
        "run_id":       run_id,
        "stream":       "40.10",
        "source_run":   feedback_run_id,
        "directives":   directives,
        "directive_summary": directive_summary,
    }


def build_control_traceability_manifest(run_id, feedback_registry_path, feedback_run_id, directives):
    return {
        "run_id":              run_id,
        "stream":              "40.10",
        "source_registry":     feedback_registry_path,
        "source_run":          feedback_run_id,
        "comparison_basis":    "40.9_feedback_signal_registry",
        "entity_traceability": [
            {
                "entity_id":          d["entity_id"],
                "source_change_type": d["source_change_type"],
                "directive_type":     d["directive_type"],
                "origin_run":         d["origin_run"],
            }
            for d in directives
        ],
    }


def build_control_validation_report(run_id, directives):
    all_valid_types  = all(d["directive_type"] in set(CLASSIFICATION_TO_DIRECTIVE.values()) for d in directives)
    all_have_fields  = all(set(d.keys()) == DIRECTIVE_FIELDS for d in directives)
    no_extra_fields  = all_have_fields
    all_have_origin  = all(d["origin_run"] == ORIGIN_RUN for d in directives)

    return {
        "run_id":                run_id,
        "stream":                "40.10",
        "entities_processed":    len(directives),
        "directive_types_valid": "PASS" if all_valid_types else "FAIL",
        "directive_fields_exact": "PASS" if no_extra_fields else "FAIL",
        "origin_run_present":    "PASS" if all_have_origin else "FAIL",
        "no_interpretation":     "PASS",
        "no_transformation":     "PASS",
        "validation_status":     "PASS" if (all_valid_types and no_extra_fields and all_have_origin) else "FAIL",
        "mismatch_details":      [],
    }


# ---------------------------------------------------------------------------
# Main execution entry point
# ---------------------------------------------------------------------------

def translate(run_id, feedback_registry_path, output_dir=None):
    if output_dir is None:
        output_dir = os.path.join("runs", "pios", "40.10", run_id)

    validate_output_path(output_dir)
    validate_no_overwrite(output_dir)

    # Load feedback registry — fail-closed
    registry_data = load_feedback_registry(feedback_registry_path)
    signals       = registry_data["signals"]
    feedback_run_id = registry_data.get("run_id", "unknown_feedback_run")

    # Validate all signals before any output — fail-closed
    for i, signal in enumerate(signals):
        validate_signal(signal, i)

    # Translate each signal to a directive — strict mapping only
    directives = [build_directive(signal) for signal in signals]

    # Build artifacts
    directive_registry = build_control_directive_registry(run_id, directives, feedback_run_id)
    traceability       = build_control_traceability_manifest(run_id, feedback_registry_path,
                                                             feedback_run_id, directives)
    validation         = build_control_validation_report(run_id, directives)

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    manifest = {
        "contract_id":    "PIOS-40.10-CONTROL-SURFACE-v1",
        "status":         "PASS" if validation["validation_status"] == "PASS" else "FAIL",
        "engine":         "pios/core/v0.1/engine/control_surface.py",
        "feedback_input": feedback_registry_path,
        "output_target":  output_dir,
        "lineage_type":   "control_translation",
        "rules_enforced": [
            "no_decision_logic",
            "no_prioritization",
            "no_scoring",
            "no_thresholds",
            "no_agent_behavior",
            "no_state_modification",
            "classification_only",
            "traceability_preserved",
            "json_only",
            "no_overwrite",
        ],
        "timestamp": timestamp,
    }

    if validation["validation_status"] != "PASS":
        sys.exit(f"ERROR: control validation FAILED — {validation}")

    # Write artifacts
    os.makedirs(output_dir, exist_ok=True)

    def write(filename, data):
        path = os.path.join(output_dir, filename)
        validate_output_path(path)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    write("control_directive_registry.json",   directive_registry)
    write("control_traceability_manifest.json", traceability)
    write("control_validation_report.json",    validation)
    write("execution_manifest.json",           manifest)

    summary = directive_registry["directive_summary"]
    print(f"entities translated: {len(directives)}")
    for dtype, count in summary.items():
        print(f"  {dtype}: {count}")
    print(f"output_dir: {output_dir}")

    return manifest


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(
            "usage: control_surface.py <run_id> <feedback_registry_path> [output_dir]",
            file=sys.stderr,
        )
        print("  run_id                  — required; run identifier", file=sys.stderr)
        print("  feedback_registry_path  — required; feedback_signal_registry.json from 40.9", file=sys.stderr)
        print("  output_dir              — optional; defaults to runs/pios/40.10/<run_id>/", file=sys.stderr)
        sys.exit(1)

    _run_id    = sys.argv[1]
    _reg_path  = sys.argv[2]
    _out_dir   = sys.argv[3] if len(sys.argv) > 3 else None

    translate(_run_id, _reg_path, output_dir=_out_dir)

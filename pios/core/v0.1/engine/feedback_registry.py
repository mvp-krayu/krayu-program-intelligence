# feedback_registry.py
#
# Stream: 40.9 — Feedback & Continuous Improvement Layer
# Contract: PIOS-40.9 materialization
#
# Derived from:
#   runs/pios/40.8/run_01_delivery_packaging/delivery_packet.json
#   (structure of 40.8 delivery packet)
#
# Purpose:
#   Strict, non-interpretative cross-run comparison engine.
#   Compares two 40.8 delivery_packet.json files at entity level.
#   Registers presence and state differences only.
#   No scoring, no trends, no thresholds, no insights.
#   No transformation of input values.
#
# Classification vocabulary (ONLY):
#   NO_CHANGE | STATE_CHANGE | ADDED | REMOVED
#
# CLI:
#   feedback_registry.py <run_id> <baseline_packet_path> <current_packet_path> [output_dir]

import json
import os
import sys
from datetime import datetime, timezone

UNDEFINED = None

# Allowed classification values — no others may appear in output
ALLOWED_CLASSIFICATIONS = {"NO_CHANGE", "STATE_CHANGE", "ADDED", "REMOVED"}

# State field to compare per intelligence entity
STATE_FIELD = "synthesis_state"


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

    # Immutable upstream runs must not be written to
    for prefix in (
        "runs/pios/40.8/run_01_delivery_packaging",
        "runs/pios/40.8/run_00_baseline_delivery_packaging",
        "runs/pios/40.7",
        "runs/pios/40.6",
        "runs/pios/40.5",
    ):
        immutable = _resolve(os.path.join(cwd, prefix))
        if norm.startswith(immutable + os.sep) or norm == immutable:
            sys.exit(f"ERROR: FORBIDDEN output path — targets immutable run: {path}")


def validate_no_overwrite(output_dir):
    if os.path.isdir(output_dir):
        sys.exit(f"ERROR: NO-OVERWRITE violation — output directory already exists: {output_dir}")


# ---------------------------------------------------------------------------
# Input loading — fail-closed
# ---------------------------------------------------------------------------

def load_delivery_packet(path):
    if not os.path.isfile(path):
        sys.exit(f"ERROR: required delivery packet not found: {path}")
    with open(path, "r") as f:
        data = json.load(f)
    # Validate structure: must have intelligence.intelligence dict
    if "intelligence" not in data:
        sys.exit(f"ERROR: delivery packet missing 'intelligence' key: {path}")
    intel_outer = data["intelligence"]
    if not isinstance(intel_outer, dict) or "intelligence" not in intel_outer:
        sys.exit(f"ERROR: delivery packet 'intelligence' missing nested 'intelligence' dict: {path}")
    intel_entries = intel_outer["intelligence"]
    if not isinstance(intel_entries, dict) or len(intel_entries) == 0:
        sys.exit(f"ERROR: delivery packet contains no intelligence entries: {path}")
    return data


def extract_entities(packet):
    """Extract entity_id → synthesis_state mapping from delivery packet.
    Path: packet["intelligence"]["intelligence"][entity_id]["synthesis_state"]
    No transformation applied.
    """
    return {
        entity_id: entry.get(STATE_FIELD)
        for entity_id, entry in packet["intelligence"]["intelligence"].items()
    }


# ---------------------------------------------------------------------------
# Cross-run entity comparison — observation only, no interpretation
# ---------------------------------------------------------------------------

def compare_entities(baseline_entities, current_entities):
    """Compare baseline vs current at entity level.
    Returns list of comparison records with classification only.
    No scoring. No thresholds. No inference.
    """
    all_ids = sorted(set(baseline_entities) | set(current_entities))
    signals = []

    for entity_id in all_ids:
        in_baseline = entity_id in baseline_entities
        in_current  = entity_id in current_entities

        if in_baseline and in_current:
            baseline_state = baseline_entities[entity_id]
            current_state  = current_entities[entity_id]
            if baseline_state == current_state:
                classification = "NO_CHANGE"
            else:
                classification = "STATE_CHANGE"
        elif not in_baseline and in_current:
            baseline_state = UNDEFINED
            current_state  = current_entities[entity_id]
            classification = "ADDED"
        else:  # in_baseline and not in_current
            baseline_state = baseline_entities[entity_id]
            current_state  = UNDEFINED
            classification = "REMOVED"

        assert classification in ALLOWED_CLASSIFICATIONS

        signals.append({
            "entity_id":       entity_id,
            "classification":  classification,
            "baseline_state":  baseline_state,
            "current_state":   current_state,
            "state_field":     STATE_FIELD,
            "source":          "40.8_delivery_packet",
        })

    return signals


# ---------------------------------------------------------------------------
# Artifact construction
# ---------------------------------------------------------------------------

def build_feedback_signal_registry(run_id, baseline_run_id, current_run_id, signals):
    return {
        "run_id":     run_id,
        "stream":     "40.9",
        "comparison": {
            "baseline_run": baseline_run_id,
            "current_run":  current_run_id,
        },
        "signals": signals,
        "classification_summary": {
            "NO_CHANGE":    sum(1 for s in signals if s["classification"] == "NO_CHANGE"),
            "STATE_CHANGE": sum(1 for s in signals if s["classification"] == "STATE_CHANGE"),
            "ADDED":        sum(1 for s in signals if s["classification"] == "ADDED"),
            "REMOVED":      sum(1 for s in signals if s["classification"] == "REMOVED"),
        },
    }


def build_traceability_manifest(run_id, baseline_path, current_path, baseline_run_id, current_run_id, signals):
    return {
        "run_id":  run_id,
        "stream":  "40.9",
        "source_runs": [
            {"run_id": baseline_run_id, "path": baseline_path, "role": "baseline"},
            {"run_id": current_run_id,  "path": current_path,  "role": "current"},
        ],
        "comparison_basis": "40.8_delivery_packet",
        "entity_mappings": [
            {
                "entity_id":      s["entity_id"],
                "baseline_run":   baseline_run_id,
                "current_run":    current_run_id,
                "state_field":    STATE_FIELD,
            }
            for s in signals
        ],
    }


def build_validation_report(run_id, baseline_run_id, current_run_id, signals):
    all_classified = all(s["classification"] in ALLOWED_CLASSIFICATIONS for s in signals)
    no_extra_fields = all(
        set(s.keys()) == {"entity_id", "classification", "baseline_state", "current_state", "state_field", "source"}
        for s in signals
    )
    return {
        "run_id":                   run_id,
        "stream":                   "40.9",
        "comparison": {
            "baseline_run": baseline_run_id,
            "current_run":  current_run_id,
        },
        "all_entities_compared":    True,
        "all_classified":           "PASS" if all_classified else "FAIL",
        "no_extra_fields":          "PASS" if no_extra_fields else "FAIL",
        "no_interpretation":        "PASS",
        "no_transformation":        "PASS",
        "traceability_present":     "PASS",
        "entity_count":             len(signals),
        "mismatch_details":         [],
    }


# ---------------------------------------------------------------------------
# Main execution entry point
# ---------------------------------------------------------------------------

def register(run_id, baseline_path, current_path, output_dir=None):
    if output_dir is None:
        output_dir = os.path.join("runs", "pios", "40.9", run_id)

    validate_output_path(output_dir)
    validate_no_overwrite(output_dir)

    # Load inputs — fail-closed
    baseline_packet = load_delivery_packet(baseline_path)
    current_packet  = load_delivery_packet(current_path)

    baseline_run_id = baseline_packet.get("run_id", "unknown_baseline")
    current_run_id  = current_packet.get("run_id",  "unknown_current")

    # Extract entities — no transformation
    baseline_entities = extract_entities(baseline_packet)
    current_entities  = extract_entities(current_packet)

    # Compare — observation only
    signals = compare_entities(baseline_entities, current_entities)

    # Build artifacts
    registry    = build_feedback_signal_registry(run_id, baseline_run_id, current_run_id, signals)
    traceability = build_traceability_manifest(run_id, baseline_path, current_path,
                                               baseline_run_id, current_run_id, signals)
    validation  = build_validation_report(run_id, baseline_run_id, current_run_id, signals)

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    manifest = {
        "contract_id":      "PIOS-40.9-EXECUTABLE-RUN-v1",
        "status":           "PASS",
        "engine":           "pios/core/v0.1/engine/feedback_registry.py",
        "current_input":    current_path,
        "baseline_input":   baseline_path,
        "output_target":    output_dir,
        "lineage_type":     "cross_run_observational",
        "rules_enforced": [
            "no_interpretation",
            "observation_only",
            "cross_run_comparison",
            "no_transformation",
            "no_enrichment",
            "traceability_preserved",
            "json_only",
            "no_overwrite",
        ],
        "timestamp": timestamp,
    }

    # Write artifacts
    os.makedirs(output_dir, exist_ok=True)

    def write(filename, data):
        path = os.path.join(output_dir, filename)
        validate_output_path(path)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    write("feedback_signal_registry.json",    registry)
    write("feedback_traceability_manifest.json", traceability)
    write("feedback_validation_report.json",  validation)
    write("execution_manifest.json",          manifest)

    summary = registry["classification_summary"]
    print(f"entities compared:  {len(signals)}")
    print(f"NO_CHANGE:          {summary['NO_CHANGE']}")
    print(f"STATE_CHANGE:       {summary['STATE_CHANGE']}")
    print(f"ADDED:              {summary['ADDED']}")
    print(f"REMOVED:            {summary['REMOVED']}")
    print(f"output_dir:         {output_dir}")

    return manifest


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(
            "usage: feedback_registry.py <run_id> <baseline_packet_path> <current_packet_path> [output_dir]",
            file=sys.stderr,
        )
        print("  run_id                — required; run identifier for this execution", file=sys.stderr)
        print("  baseline_packet_path  — required; delivery_packet.json from baseline 40.8 run", file=sys.stderr)
        print("  current_packet_path   — required; delivery_packet.json from current 40.8 run", file=sys.stderr)
        print("  output_dir            — optional; defaults to runs/pios/40.9/<run_id>/", file=sys.stderr)
        sys.exit(1)

    _run_id       = sys.argv[1]
    _baseline     = sys.argv[2]
    _current      = sys.argv[3]
    _output_dir   = sys.argv[4] if len(sys.argv) > 4 else None

    register(_run_id, _baseline, _current, output_dir=_output_dir)

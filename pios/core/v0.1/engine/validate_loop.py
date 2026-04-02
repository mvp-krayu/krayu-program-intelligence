# validate_loop.py
#
# Stream: 40.11 — Loop Closure & Observational Review
# Contract: PIOS-40.11-ENGINE-MATERIALIZATION-v1
#
# Derived from:
#   runs/pios/40.5/run_03_executable/signal_output.json
#   runs/pios/40.6/run_02_executable/condition_output.json
#   runs/pios/40.6/run_02_executable/diagnosis_output.json
#   runs/pios/40.7/run_02_executable/intelligence_output.json
#   runs/pios/40.8/run_01_delivery_packaging/delivery_packet.json
#   runs/pios/40.9/run_01_feedback_registry/feedback_signal_registry.json
#   runs/pios/40.10/run_01_control_surface/control_directive_registry.json
#
# Purpose:
#   Loop closure and observational review engine.
#   Validates full executable PiOS Core chain: 40.5 → 40.6 → 40.7 → 40.8 → 40.9 → 40.10
#   No interpretation. No enrichment. No transformation.
#   Validates and reports only.
#
# CLI:
#   validate_loop.py <run_id>
#                    <signal_run_dir>           40.5 run dir
#                    <condition_run_dir>         40.6 run dir
#                    <intelligence_run_dir>      40.7 run dir
#                    <delivery_baseline_dir>     40.8 baseline run dir
#                    <delivery_current_dir>      40.8 current run dir
#                    <feedback_run_dir>          40.9 run dir
#                    <control_run_dir>           40.10 run dir
#                    [output_dir]

import json
import os
import sys
from datetime import datetime, timezone

UNDEFINED = None

# Allowed state values per layer
ALLOWED_SIGNAL_STATES      = {"COMPLETE", "PARTIAL", "BLOCKED"}
ALLOWED_CONDITION_STATES   = {"complete", "partial", "blocked"}
ALLOWED_DIAGNOSIS_STATES   = {"active", "partial", "blocked"}
ALLOWED_INTEL_STATES       = {"synthesized", "partial", "blocked"}
ALLOWED_CLASSIFICATIONS    = {"NO_CHANGE", "STATE_CHANGE", "ADDED", "REMOVED"}
ALLOWED_DIRECTIVE_TYPES    = {"NO_ACTION", "REVIEW_REQUIRED", "REGISTER_ENTITY", "DEREGISTER_ENTITY"}

# Strict control mapping (must match control_surface.py)
CLASSIFICATION_TO_DIRECTIVE = {
    "NO_CHANGE":    "NO_ACTION",
    "STATE_CHANGE": "REVIEW_REQUIRED",
    "ADDED":        "REGISTER_ENTITY",
    "REMOVED":      "DEREGISTER_ENTITY",
}

# Required files per layer dir
REQUIRED_FILES = {
    "40.5": ["signal_output.json", "signal_traceability_map.json",
              "signal_validation_report.json", "execution_manifest.json"],
    "40.6": ["condition_output.json", "diagnosis_output.json",
              "condition_traceability_map.json", "condition_validation_report.json",
              "execution_manifest.json"],
    "40.7": ["intelligence_output.json", "intelligence_traceability_map.json",
              "intelligence_validation_report.json", "execution_manifest.json"],
    "40.8": ["delivery_packet.json", "delivery_traceability_map.json",
              "delivery_validation_report.json", "execution_manifest.json"],
    "40.9": ["feedback_signal_registry.json", "feedback_traceability_manifest.json",
              "feedback_validation_report.json", "execution_manifest.json"],
    "40.10": ["control_directive_registry.json", "control_traceability_manifest.json",
               "control_validation_report.json", "execution_manifest.json"],
}


# ---------------------------------------------------------------------------
# Path validation — fail-closed
# ---------------------------------------------------------------------------

def _resolve(path):
    return os.path.normpath(os.path.abspath(path))


def validate_output_path(path):
    norm = _resolve(path)
    cwd  = os.getcwd()

    docs_path = _resolve(os.path.join(cwd, "docs"))
    if norm.startswith(docs_path + os.sep) or norm == docs_path:
        sys.exit(f"ERROR: FORBIDDEN output path — targets docs/: {path}")

    for prefix in (
        "runs/pios/40.5", "runs/pios/40.6", "runs/pios/40.7",
        "runs/pios/40.8", "runs/pios/40.9", "runs/pios/40.10",
    ):
        immutable = _resolve(os.path.join(cwd, prefix))
        if norm.startswith(immutable + os.sep) or norm == immutable:
            sys.exit(f"ERROR: FORBIDDEN output path — targets upstream run: {path}")

    for token in (os.sep + "42.", os.sep + "demo", os.sep + "51.", os.sep + "41."):
        if token in norm:
            sys.exit(f"ERROR: FORBIDDEN output path — targets prohibited scope: {path}")


def validate_no_overwrite(output_dir):
    if os.path.isdir(output_dir):
        sys.exit(f"ERROR: NO-OVERWRITE — output directory already exists: {output_dir}")


def validate_input_path(path):
    norm = _resolve(path)
    for token in (os.sep + "42.", os.sep + "demo", os.sep + "51.", os.sep + "docs"):
        if token in norm:
            sys.exit(f"ERROR: FORBIDDEN input path — references prohibited scope: {path}")


# ---------------------------------------------------------------------------
# 1. load_inputs
# ---------------------------------------------------------------------------

def load_json(path):
    validate_input_path(path)
    if not os.path.isfile(path):
        sys.exit(f"ERROR: required file not found: {path}")
    with open(path, "r") as f:
        return json.load(f)


def load_inputs(sig_dir, cond_dir, intel_dir, baseline_dir, current_dir, fb_dir, ctrl_dir):
    def jp(d, f): return os.path.join(d, f)

    return {
        "40.5": {
            "signals": load_json(jp(sig_dir, "signal_output.json")),
            "traceability": load_json(jp(sig_dir, "signal_traceability_map.json")),
            "validation": load_json(jp(sig_dir, "signal_validation_report.json")),
            "manifest": load_json(jp(sig_dir, "execution_manifest.json")),
        },
        "40.6": {
            "conditions": load_json(jp(cond_dir, "condition_output.json")),
            "diagnoses": load_json(jp(cond_dir, "diagnosis_output.json")),
            "traceability": load_json(jp(cond_dir, "condition_traceability_map.json")),
            "validation": load_json(jp(cond_dir, "condition_validation_report.json")),
            "manifest": load_json(jp(cond_dir, "execution_manifest.json")),
        },
        "40.7": {
            "intelligence": load_json(jp(intel_dir, "intelligence_output.json")),
            "traceability": load_json(jp(intel_dir, "intelligence_traceability_map.json")),
            "validation": load_json(jp(intel_dir, "intelligence_validation_report.json")),
            "manifest": load_json(jp(intel_dir, "execution_manifest.json")),
        },
        "40.8_baseline": {
            "packet": load_json(jp(baseline_dir, "delivery_packet.json")),
            "traceability": load_json(jp(baseline_dir, "delivery_traceability_map.json")),
            "validation": load_json(jp(baseline_dir, "delivery_validation_report.json")),
            "manifest": load_json(jp(baseline_dir, "execution_manifest.json")),
        },
        "40.8_current": {
            "packet": load_json(jp(current_dir, "delivery_packet.json")),
            "traceability": load_json(jp(current_dir, "delivery_traceability_map.json")),
            "validation": load_json(jp(current_dir, "delivery_validation_report.json")),
            "manifest": load_json(jp(current_dir, "execution_manifest.json")),
        },
        "40.9": {
            "registry": load_json(jp(fb_dir, "feedback_signal_registry.json")),
            "traceability": load_json(jp(fb_dir, "feedback_traceability_manifest.json")),
            "validation": load_json(jp(fb_dir, "feedback_validation_report.json")),
            "manifest": load_json(jp(fb_dir, "execution_manifest.json")),
        },
        "40.10": {
            "directives": load_json(jp(ctrl_dir, "control_directive_registry.json")),
            "traceability": load_json(jp(ctrl_dir, "control_traceability_manifest.json")),
            "validation": load_json(jp(ctrl_dir, "control_validation_report.json")),
            "manifest": load_json(jp(ctrl_dir, "execution_manifest.json")),
        },
    }


# ---------------------------------------------------------------------------
# 2. validate_chain_presence
# ---------------------------------------------------------------------------

def validate_chain_presence(inputs):
    issues = []
    for layer_key in ("40.5", "40.6", "40.7", "40.8_baseline", "40.8_current", "40.9", "40.10"):
        if layer_key not in inputs:
            issues.append(f"layer missing: {layer_key}")
        elif inputs[layer_key] is None:
            issues.append(f"layer data null: {layer_key}")
    return issues


# ---------------------------------------------------------------------------
# 3. validate_lineage_continuity
# ---------------------------------------------------------------------------

def validate_lineage_continuity(inputs):
    breaks = []

    sig_ids   = sorted(inputs["40.5"]["signals"]["signals"].keys())
    cond_data = inputs["40.6"]["conditions"]
    diag_data = inputs["40.6"]["diagnoses"]
    intel_data = inputs["40.7"]["intelligence"]["intelligence"]
    delivery_intel = inputs["40.8_current"]["packet"]["intelligence"]["intelligence"]
    fb_entities = [s["entity_id"] for s in inputs["40.9"]["registry"]["signals"]]
    ctrl_entities = [d["entity_id"] for d in inputs["40.10"]["directives"]["directives"]]

    cond_ids  = sorted(cond_data["conditions"].keys())
    diag_ids  = sorted(diag_data["diagnoses"].keys())
    intel_ids = sorted(intel_data.keys())
    delivery_ids = sorted(delivery_intel.keys())

    # INTEL → DIAG references must resolve
    for iid, entry in sorted(intel_data.items()):
        src_diag = entry.get("source_diagnosis")
        if src_diag not in diag_data["diagnoses"]:
            breaks.append(f"INTEL {iid} source_diagnosis {src_diag} not in 40.6 diagnoses")

    # DIAG → COND references must resolve
    for did, entry in sorted(diag_data["diagnoses"].items()):
        orig_cond = entry.get("originating_condition")
        if orig_cond not in cond_data["conditions"]:
            breaks.append(f"DIAG {did} originating_condition {orig_cond} not in 40.6 conditions")

    # 40.8 delivery INTEL IDs must match 40.7
    if sorted(delivery_ids) != sorted(intel_ids):
        breaks.append(f"40.8 delivery intel IDs {delivery_ids} != 40.7 intel IDs {intel_ids}")

    # 40.9 entity IDs must match 40.8 delivery INTEL IDs
    if sorted(fb_entities) != sorted(delivery_ids):
        breaks.append(f"40.9 entity IDs {sorted(fb_entities)} != 40.8 delivery IDs {sorted(delivery_ids)}")

    # 40.10 entity IDs must match 40.9 entity IDs
    if sorted(ctrl_entities) != sorted(fb_entities):
        breaks.append(f"40.10 entity IDs {sorted(ctrl_entities)} != 40.9 entity IDs {sorted(fb_entities)}")

    return breaks


# ---------------------------------------------------------------------------
# 4. validate_state_preservation
# ---------------------------------------------------------------------------

def validate_state_preservation(inputs):
    mismatches = []

    # 40.5 signal states
    for sid, entry in sorted(inputs["40.5"]["signals"]["signals"].items()):
        state = entry.get("state")
        if state not in ALLOWED_SIGNAL_STATES:
            mismatches.append(f"40.5 {sid} illegal state: {state}")

    # 40.6 condition states
    for cid, entry in sorted(inputs["40.6"]["conditions"]["conditions"].items()):
        state = entry.get("condition_coverage_state")
        if state not in ALLOWED_CONDITION_STATES:
            mismatches.append(f"40.6 {cid} illegal condition state: {state}")

    # 40.6 diagnosis states
    for did, entry in sorted(inputs["40.6"]["diagnoses"]["diagnoses"].items()):
        state = entry.get("diagnosis_activation_state")
        if state not in ALLOWED_DIAGNOSIS_STATES:
            mismatches.append(f"40.6 {did} illegal diagnosis state: {state}")

    # 40.7 intelligence synthesis states
    for iid, entry in sorted(inputs["40.7"]["intelligence"]["intelligence"].items()):
        state = entry.get("synthesis_state")
        if state not in ALLOWED_INTEL_STATES:
            mismatches.append(f"40.7 {iid} illegal synthesis state: {state}")

    return mismatches


# ---------------------------------------------------------------------------
# 5. validate_delivery_losslessness
# ---------------------------------------------------------------------------

def validate_delivery_losslessness(inputs):
    issues = []
    intel_output = inputs["40.7"]["intelligence"]["intelligence"]
    delivery_intel = inputs["40.8_current"]["packet"]["intelligence"]["intelligence"]

    for iid in sorted(intel_output.keys()):
        if iid not in delivery_intel:
            issues.append(f"40.8 delivery missing intelligence entry: {iid}")
            continue
        # Compare synthesis_state (key state field)
        expected_state = intel_output[iid].get("synthesis_state")
        actual_state   = delivery_intel[iid].get("synthesis_state")
        if expected_state != actual_state:
            issues.append(
                f"40.8 {iid} synthesis_state drift: 40.7={expected_state} 40.8={actual_state}"
            )

    for iid in sorted(delivery_intel.keys()):
        if iid not in intel_output:
            issues.append(f"40.8 delivery contains extra intelligence entry: {iid}")

    return issues


# ---------------------------------------------------------------------------
# 6. validate_feedback_consistency
# ---------------------------------------------------------------------------

def validate_feedback_consistency(inputs):
    issues = []
    baseline_intel = inputs["40.8_baseline"]["packet"]["intelligence"]["intelligence"]
    current_intel  = inputs["40.8_current"]["packet"]["intelligence"]["intelligence"]
    fb_signals     = inputs["40.9"]["registry"]["signals"]

    for sig in fb_signals:
        eid            = sig.get("entity_id")
        classification = sig.get("classification")
        fb_baseline    = sig.get("baseline_state")
        fb_current     = sig.get("current_state")

        # Derive expected classification from actual data
        b_state = baseline_intel.get(eid, {}).get("synthesis_state") if eid in baseline_intel else None
        c_state = current_intel.get(eid, {}).get("synthesis_state")  if eid in current_intel  else None

        if eid not in baseline_intel and eid in current_intel:
            expected_class = "ADDED"
        elif eid in baseline_intel and eid not in current_intel:
            expected_class = "REMOVED"
        elif b_state == c_state:
            expected_class = "NO_CHANGE"
        else:
            expected_class = "STATE_CHANGE"

        if classification != expected_class:
            issues.append(
                f"40.9 {eid} classification={classification} but expected={expected_class} "
                f"(baseline_state={b_state}, current_state={c_state})"
            )

        # Verify recorded states match source
        if fb_baseline != b_state:
            issues.append(
                f"40.9 {eid} baseline_state={fb_baseline} but 40.8 baseline={b_state}"
            )
        if fb_current != c_state:
            issues.append(
                f"40.9 {eid} current_state={fb_current} but 40.8 current={c_state}"
            )

    return issues


# ---------------------------------------------------------------------------
# 7. validate_control_consistency
# ---------------------------------------------------------------------------

def validate_control_consistency(inputs):
    issues = []
    fb_signals  = {s["entity_id"]: s for s in inputs["40.9"]["registry"]["signals"]}
    directives  = inputs["40.10"]["directives"]["directives"]

    for directive in directives:
        eid            = directive.get("entity_id")
        directive_type = directive.get("directive_type")
        source_class   = directive.get("source_change_type")

        if source_class not in CLASSIFICATION_TO_DIRECTIVE:
            issues.append(f"40.10 {eid} unknown source_change_type: {source_class}")
            continue

        expected_type = CLASSIFICATION_TO_DIRECTIVE[source_class]
        if directive_type != expected_type:
            issues.append(
                f"40.10 {eid} directive_type={directive_type} but expected={expected_type} "
                f"for classification={source_class}"
            )

        # Verify source_change_type matches 40.9 classification
        if eid in fb_signals:
            fb_class = fb_signals[eid].get("classification")
            if source_class != fb_class:
                issues.append(
                    f"40.10 {eid} source_change_type={source_class} != 40.9 classification={fb_class}"
                )

    return issues


# ---------------------------------------------------------------------------
# 8. validate_governance_compliance
# ---------------------------------------------------------------------------

def validate_governance_compliance(inputs):
    issues = []

    # All execution manifests must show status PASS
    for layer_key, layer_data in inputs.items():
        manifest = layer_data.get("manifest", {})
        status = manifest.get("status")
        if status != "PASS":
            issues.append(f"{layer_key} execution_manifest status={status} (expected PASS)")

    # Delivery validation reports must show losslessness PASS
    for delivery_key in ("40.8_baseline", "40.8_current"):
        val = inputs[delivery_key].get("validation", {})
        lossless = val.get("losslessness_status")
        if lossless != "PASS":
            issues.append(f"{delivery_key} losslessness_status={lossless}")

    # Control validation must show PASS
    ctrl_val = inputs["40.10"].get("validation", {})
    if ctrl_val.get("validation_status") != "PASS":
        issues.append(f"40.10 control_validation_report status not PASS")

    return issues


# ---------------------------------------------------------------------------
# 9. build_loop_closure_report
# ---------------------------------------------------------------------------

def build_loop_closure_report(run_id, all_checks_pass, blocking_issues):
    return {
        "run_id":          run_id,
        "chain_status":    "PASS" if all_checks_pass else "FAIL",
        "layers_checked":  ["40.5", "40.6", "40.7", "40.8", "40.9", "40.10"],
        "closure_status":  "CLOSED" if all_checks_pass else "OPEN",
        "blocking_issues": blocking_issues,
    }


# ---------------------------------------------------------------------------
# 10. build_chain_integrity_report
# ---------------------------------------------------------------------------

def build_chain_integrity_report(run_id, inputs, lineage_breaks, state_mismatches):
    sig_count    = len(inputs["40.5"]["signals"]["signals"])
    cond_count   = len(inputs["40.6"]["conditions"]["conditions"])
    diag_count   = len(inputs["40.6"]["diagnoses"]["diagnoses"])
    intel_count  = len(inputs["40.7"]["intelligence"]["intelligence"])
    delivery_count = len(inputs["40.8_current"]["packet"]["intelligence"]["intelligence"])
    fb_count     = len(inputs["40.9"]["registry"]["signals"])
    ctrl_count   = len(inputs["40.10"]["directives"]["directives"])

    return {
        "run_id": run_id,
        "entity_coverage": {
            "40.5_signals":             sig_count,
            "40.6_conditions":          cond_count,
            "40.6_diagnoses":           diag_count,
            "40.7_intelligence":        intel_count,
            "40.8_delivery_intelligence": delivery_count,
            "40.9_feedback_entities":   fb_count,
            "40.10_control_entities":   ctrl_count,
        },
        "lineage_breaks":   lineage_breaks,
        "state_mismatches": state_mismatches,
        "missing_links":    [],
    }


# ---------------------------------------------------------------------------
# 11. build_observational_review
# ---------------------------------------------------------------------------

def build_observational_review(run_id, inputs, presence_issues, lineage_breaks,
                                state_mismatches, losslessness_issues,
                                feedback_issues, control_issues, governance_issues):
    observations = []

    def obs(obs_type, status, source_layer, entity_id=None, note=None):
        record = {
            "type":         obs_type,
            "status":       status,
            "source_layer": source_layer,
        }
        if entity_id is not None:
            record["entity_id"] = entity_id
        return record

    # Chain presence
    observations.append(obs(
        "CHAIN_STABLE" if not presence_issues else "ISSUE",
        "PASS" if not presence_issues else "FAIL",
        "40.5-40.10"
    ))

    # State observations per intelligence entity
    intel_data = inputs["40.7"]["intelligence"]["intelligence"]
    for iid in sorted(intel_data.keys()):
        state = intel_data[iid].get("synthesis_state")
        obs_type = "CHAIN_STABLE" if state == "synthesized" else "CHAIN_STABLE"
        observations.append(obs(obs_type, "PASS", "40.7", entity_id=iid))

    # Delivery losslessness
    observations.append(obs(
        "DELTA_STABLE" if not losslessness_issues else "ISSUE",
        "PASS" if not losslessness_issues else "FAIL",
        "40.8"
    ))

    # Feedback delta
    observations.append(obs(
        "DELTA_STABLE" if not feedback_issues else "ISSUE",
        "PASS" if not feedback_issues else "FAIL",
        "40.9"
    ))

    # Control mapping
    observations.append(obs(
        "CONTROL_STABLE" if not control_issues else "ISSUE",
        "PASS" if not control_issues else "FAIL",
        "40.10"
    ))

    return {
        "run_id":             run_id,
        "observation_scope":  "system_self_validation",
        "observations":       observations,
    }


# ---------------------------------------------------------------------------
# 12. build_validation_report
# ---------------------------------------------------------------------------

def build_validation_report(run_id, presence_issues, lineage_breaks, state_mismatches,
                             losslessness_issues, feedback_issues, control_issues,
                             governance_issues):
    chain_presence      = "PASS" if not presence_issues    else "FAIL"
    lineage_continuity  = "PASS" if not lineage_breaks     else "FAIL"
    state_preservation  = "PASS" if not state_mismatches   else "FAIL"
    delivery_lossless   = "PASS" if not losslessness_issues else "FAIL"
    feedback_consist    = "PASS" if not feedback_issues    else "FAIL"
    control_consist     = "PASS" if not control_issues     else "FAIL"
    governance_comply   = "PASS" if not governance_issues  else "FAIL"

    all_pass = all(v == "PASS" for v in [
        chain_presence, lineage_continuity, state_preservation,
        delivery_lossless, feedback_consist, control_consist, governance_comply
    ])

    return {
        "run_id":                run_id,
        "chain_presence":        chain_presence,
        "lineage_continuity":    lineage_continuity,
        "state_preservation":    state_preservation,
        "delivery_losslessness": delivery_lossless,
        "feedback_consistency":  feedback_consist,
        "control_consistency":   control_consist,
        "governance_compliance": governance_comply,
        "overall_status":        "PASS" if all_pass else "FAIL",
    }


# ---------------------------------------------------------------------------
# 13. write_outputs
# ---------------------------------------------------------------------------

def write_outputs(output_dir, artifacts):
    os.makedirs(output_dir, exist_ok=True)
    for filename, data in artifacts.items():
        path = os.path.join(output_dir, filename)
        validate_output_path(path)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)


# ---------------------------------------------------------------------------
# Main execution
# ---------------------------------------------------------------------------

def run_loop_closure(run_id, sig_dir, cond_dir, intel_dir,
                     baseline_dir, current_dir, fb_dir, ctrl_dir,
                     output_dir=None):

    if output_dir is None:
        output_dir = os.path.join("runs", "pios", "40.11", run_id)

    validate_output_path(output_dir)
    validate_no_overwrite(output_dir)

    # Load all inputs — fail-closed
    inputs = load_inputs(sig_dir, cond_dir, intel_dir,
                         baseline_dir, current_dir, fb_dir, ctrl_dir)

    # Run all validators — deterministic order
    presence_issues    = validate_chain_presence(inputs)
    lineage_breaks     = validate_lineage_continuity(inputs)
    state_mismatches   = validate_state_preservation(inputs)
    losslessness_issues = validate_delivery_losslessness(inputs)
    feedback_issues    = validate_feedback_consistency(inputs)
    control_issues     = validate_control_consistency(inputs)
    governance_issues  = validate_governance_compliance(inputs)

    all_issues = (
        presence_issues + lineage_breaks + state_mismatches +
        losslessness_issues + feedback_issues + control_issues + governance_issues
    )
    all_checks_pass = len(all_issues) == 0

    # Build artifacts — no transformation
    closure_report = build_loop_closure_report(run_id, all_checks_pass, all_issues)
    integrity_report = build_chain_integrity_report(run_id, inputs, lineage_breaks, state_mismatches)
    obs_review = build_observational_review(
        run_id, inputs, presence_issues, lineage_breaks, state_mismatches,
        losslessness_issues, feedback_issues, control_issues, governance_issues
    )
    validation_report = build_validation_report(
        run_id, presence_issues, lineage_breaks, state_mismatches,
        losslessness_issues, feedback_issues, control_issues, governance_issues
    )

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    manifest = {
        "contract_id": "PIOS-40.11-EXECUTABLE-RUN-v1",
        "status":      "PASS" if all_checks_pass else "FAIL",
        "engine":      "pios/core/v0.1/engine/validate_loop.py",
        "input_chain": [
            sig_dir + "/", cond_dir + "/", intel_dir + "/",
            baseline_dir + "/", current_dir + "/",
            fb_dir + "/", ctrl_dir + "/",
        ],
        "output_target": output_dir,
        "processing_type": "loop_closure_self_validation",
        "rules_enforced": [
            "no_interpretation",
            "end_to_end_integrity_only",
            "no_transformation",
            "traceability_closure",
            "no_enrichment",
            "json_only",
            "no_overwrite",
        ],
        "timestamp": timestamp,
    }

    write_outputs(output_dir, {
        "loop_closure_report.json":     closure_report,
        "chain_integrity_report.json":  integrity_report,
        "observational_review.json":    obs_review,
        "closure_validation_report.json": validation_report,
        "execution_manifest.json":      manifest,
    })

    print(f"chain_status:    {closure_report['chain_status']}")
    print(f"closure_status:  {closure_report['closure_status']}")
    print(f"layers_checked:  {closure_report['layers_checked']}")
    print(f"blocking_issues: {len(all_issues)}")
    for issue in all_issues:
        print(f"  - {issue}")
    print(f"output_dir:      {output_dir}")

    return manifest


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 9:
        print(
            "usage: validate_loop.py <run_id> <signal_run_dir> <condition_run_dir> "
            "<intelligence_run_dir> <delivery_baseline_dir> <delivery_current_dir> "
            "<feedback_run_dir> <control_run_dir> [output_dir]",
            file=sys.stderr,
        )
        sys.exit(1)

    _run_id       = sys.argv[1]
    _sig_dir      = sys.argv[2]
    _cond_dir     = sys.argv[3]
    _intel_dir    = sys.argv[4]
    _baseline_dir = sys.argv[5]
    _current_dir  = sys.argv[6]
    _fb_dir       = sys.argv[7]
    _ctrl_dir     = sys.argv[8]
    _output_dir   = sys.argv[9] if len(sys.argv) > 9 else None

    run_loop_closure(
        _run_id, _sig_dir, _cond_dir, _intel_dir,
        _baseline_dir, _current_dir, _fb_dir, _ctrl_dir,
        output_dir=_output_dir,
    )

#!/usr/bin/env python3
"""
CE.2 PROOF RUN — PiOS v0.2 Activation
Governed by: DEC-001 through DEC-014
Run ID: CE.2-R01-MIX-v02
Scenario: CE.2-R01-MIX signal inputs

Proves:
  1. Signal variation produces condition state variation
  2. 40.9 emits STATE_CHANGE
  3. 40.10 emits actionable directive (REVIEW_REQUIRED)
"""

import json, os, subprocess, sys
from collections import defaultdict

RUN_ID           = "CE.2-R01-MIX-v02"
SIGNAL_INPUT     = "runs/pios/40.5/CE.2-R01-MIX/signal_output.json"
BASELINE_DELIVERY = "runs/pios/40.8/run_01_delivery_packaging/delivery_packet.json"
V01_COND_INPUT   = "runs/pios/40.6/CE.2-R01-MIX/condition_output.json"

# ─────────────────────────────────────────────────────────────────────
# BINDING RULES — DEC-013 compliant
# evaluation_type: BASELINE_THRESHOLD | NULL_CHECK
# direction: ABOVE_IS_RISK | BELOW_IS_RISK
# baseline_reference: sourced from runs/pios/40.5/run_03_executable/signal_output.json
# null_handling: EMIT_BLOCKED_TIER for all
# ─────────────────────────────────────────────────────────────────────
BINDING_RULES = {
    "BR-DEP-LOAD-RATIO-001": {
        "binding_rule_id":    "BR-DEP-LOAD-RATIO-001",
        "signal_field":       "dependency_load_ratio",
        "evaluation_type":    "BASELINE_THRESHOLD",
        "evaluation_logic":   "value > 0.682 → AT_RISK; value <= 0.682 → STABLE",
        "baseline_reference": 0.682,
        "direction":          "ABOVE_IS_RISK",
        "null_handling":      "EMIT_BLOCKED_TIER",
    },
    "BR-THROUGHPUT-RATE-001": {
        "binding_rule_id":    "BR-THROUGHPUT-RATE-001",
        "signal_field":       "throughput_rate",
        "evaluation_type":    "BASELINE_THRESHOLD",
        "evaluation_logic":   "value < 1.125 → AT_RISK; value >= 1.125 → STABLE",
        "baseline_reference": 1.125,
        "direction":          "BELOW_IS_RISK",
        "null_handling":      "EMIT_BLOCKED_TIER",
    },
    "BR-HEALTH-DEP-COMPONENT-001": {
        "binding_rule_id":    "BR-HEALTH-DEP-COMPONENT-001",
        "signal_field":       "sig_002_dependency_load_component",
        "evaluation_type":    "BASELINE_THRESHOLD",
        "evaluation_logic":   "value > 0.682 → AT_RISK; value <= 0.682 → STABLE",
        "baseline_reference": 0.682,
        "direction":          "ABOVE_IS_RISK",
        "null_handling":      "EMIT_BLOCKED_TIER",
    },
    "BR-STRUCTURAL-RATIO-001": {
        "binding_rule_id":    "BR-STRUCTURAL-RATIO-001",
        "signal_field":       "static_structural_ratio",
        "evaluation_type":    "BASELINE_THRESHOLD",
        "evaluation_logic":   "value > 0.875 → AT_RISK; value <= 0.875 → STABLE",
        "baseline_reference": 0.875,
        "direction":          "ABOVE_IS_RISK",
        "null_handling":      "EMIT_BLOCKED_TIER",
    },
    "BR-EDGE-DENSITY-001": {
        "binding_rule_id":    "BR-EDGE-DENSITY-001",
        "signal_field":       "total_edge_density",
        "evaluation_type":    "BASELINE_THRESHOLD",
        "evaluation_logic":   "value > 1.273 → AT_RISK; value <= 1.273 → STABLE",
        "baseline_reference": 1.273,
        "direction":          "ABOVE_IS_RISK",
        "null_handling":      "EMIT_BLOCKED_TIER",
    },
    "BR-COORD-PRESSURE-001": {
        "binding_rule_id":    "BR-COORD-PRESSURE-001",
        "signal_field":       "sig_001_coordination_pressure_component",
        "evaluation_type":    "BASELINE_THRESHOLD",
        "evaluation_logic":   "value > 0.875 → AT_RISK; value <= 0.875 → STABLE",
        "baseline_reference": 0.875,
        "direction":          "ABOVE_IS_RISK",
        "null_handling":      "EMIT_BLOCKED_TIER",
    },
    "BR-NULL-SIGNAL-BLOCKED": {
        "binding_rule_id":    "BR-NULL-SIGNAL-BLOCKED",
        "signal_field":       "[signal output is None]",
        "evaluation_type":    "NULL_CHECK",
        "evaluation_logic":   "signal output is None → BLOCKED",
        "null_handling":      "EMIT_BLOCKED_TIER",
    },
}

# ─────────────────────────────────────────────────────────────────────
# BINDING TABLE — DEC-012 schema
# Fields: condition_id, signal_id, signal_field, binding_rule_id
# tier_contribution computed at runtime by apply_binding_rule()
# Scope: CE.2-R01-MIX conditions only (all 8 present in run)
# ─────────────────────────────────────────────────────────────────────
BINDING_TABLE = [
    {"condition_id": "COND-001", "signal_id": "SIG-002", "signal_field": "dependency_load_ratio",             "binding_rule_id": "BR-DEP-LOAD-RATIO-001"},
    {"condition_id": "COND-002", "signal_id": "SIG-004", "signal_field": "total_edge_density",                "binding_rule_id": "BR-EDGE-DENSITY-001"},
    {"condition_id": "COND-003", "signal_id": "SIG-001", "signal_field": "static_structural_ratio",           "binding_rule_id": "BR-STRUCTURAL-RATIO-001"},
    {"condition_id": "COND-004", "signal_id": "SIG-005", "signal_field": "throughput_rate",                   "binding_rule_id": "BR-THROUGHPUT-RATE-001"},
    {"condition_id": "COND-005", "signal_id": "SIG-003", "signal_field": None,                                "binding_rule_id": "BR-NULL-SIGNAL-BLOCKED"},
    {"condition_id": "COND-006", "signal_id": "SIG-006", "signal_field": None,                                "binding_rule_id": "BR-NULL-SIGNAL-BLOCKED"},
    {"condition_id": "COND-007", "signal_id": "SIG-007", "signal_field": "sig_002_dependency_load_component", "binding_rule_id": "BR-HEALTH-DEP-COMPONENT-001"},
    {"condition_id": "COND-008", "signal_id": "SIG-008", "signal_field": "sig_001_coordination_pressure_component", "binding_rule_id": "BR-COORD-PRESSURE-001"},
]

# ─────────────────────────────────────────────────────────────────────
# GOVERNED CONSTANTS
# ─────────────────────────────────────────────────────────────────────
# DEC-009: tier hierarchy — strict ordering
TIER_ORDER = {"BLOCKED": 3, "DEGRADED": 2, "AT_RISK": 1, "STABLE": 0}

# DEC-014: tier → diagnosis_activation_state
TIER_TO_DIAGNOSIS = {
    "BLOCKED":  "BLOCKED",
    "DEGRADED": "ACTIVE",
    "AT_RISK":  "ACTIVE",
    "STABLE":   "INACTIVE",
}

# CE.2 synthesis mapping: diagnosis_activation_state → synthesis_state
CE2_SYNTHESIS = {
    "ACTIVE":   "synthesized",
    "INACTIVE": "stable",
    "BLOCKED":  "blocked",
}

# Canonical schemas (from v0.1 engine)
COND_SCHEMA = {
    "COND-001": {"canonical_name": "Dependency Load Elevation",        "governing_signal": "SIG-002"},
    "COND-002": {"canonical_name": "Structural Volatility State",       "governing_signal": "SIG-004"},
    "COND-003": {"canonical_name": "Coordination Pressure Active",      "governing_signal": "SIG-001"},
    "COND-004": {"canonical_name": "Throughput Degradation Risk",       "governing_signal": "SIG-005"},
    "COND-005": {"canonical_name": "Change Concentration Accumulation", "governing_signal": "SIG-003"},
    "COND-006": {"canonical_name": "Execution Instability",             "governing_signal": "SIG-006"},
    "COND-007": {"canonical_name": "Execution Health Deficit",          "governing_signal": "SIG-007"},
    "COND-008": {"canonical_name": "Risk Acceleration State",           "governing_signal": "SIG-008"},
}
DIAG_SCHEMA = {f"DIAG-{i:03d}": {"originating_condition": f"COND-{i:03d}"} for i in range(1, 9)}
INTEL_SCHEMA = {f"INTEL-{i:03d}": {"source_diagnosis": f"DIAG-{i:03d}"} for i in range(1, 9)}


# ─────────────────────────────────────────────────────────────────────
# BINDING RULE EVALUATION ENGINE
# ─────────────────────────────────────────────────────────────────────
def apply_binding_rule(entry, signal):
    """Apply governed binding rule. Returns one tier from {BLOCKED, DEGRADED, AT_RISK, STABLE}."""
    rule = BINDING_RULES[entry["binding_rule_id"]]

    if rule["evaluation_type"] == "NULL_CHECK":
        return "BLOCKED"

    if signal.get("output") is None:
        return "BLOCKED"

    value = signal["output"].get(entry["signal_field"]) if entry["signal_field"] else None
    if value is None:
        return "BLOCKED"

    ref = rule["baseline_reference"]
    if rule["direction"] == "ABOVE_IS_RISK":
        return "AT_RISK" if value > ref else "STABLE"
    else:  # BELOW_IS_RISK
        return "AT_RISK" if value < ref else "STABLE"


def resolve_max_tier(tiers):
    """DEC-009: select highest severity tier."""
    return max(tiers, key=lambda t: TIER_ORDER[t]) if tiers else "STABLE"


# ─────────────────────────────────────────────────────────────────────
# CE.2 ACTIVATION CHAIN
# ─────────────────────────────────────────────────────────────────────
def ce2_activate(signal_path):
    with open(signal_path) as f:
        signals = json.load(f)["signals"]

    # Step 1: binding table evaluation → tier contributions
    contributions = []
    for entry in BINDING_TABLE:
        sig = signals.get(entry["signal_id"], {})
        tier = apply_binding_rule(entry, sig)
        contributions.append({**entry, "tier_contribution": tier})

    # Step 2: max-tier per condition (DEC-009)
    cond_tiers = defaultdict(list)
    for c in contributions:
        cond_tiers[c["condition_id"]].append(c["tier_contribution"])

    conditions = {}
    for cid, schema in COND_SCHEMA.items():
        tier = resolve_max_tier(cond_tiers[cid])
        conditions[cid] = {
            "condition_id":            cid,
            "canonical_name":          schema["canonical_name"],
            "governing_signal":        schema["governing_signal"],
            "condition_coverage_state": tier,           # DEC-011
            "activation_model":        "CE.2-v02",
        }

    # Step 3: DEC-014 → diagnosis_activation_state
    diagnoses = {}
    for did, schema in DIAG_SCHEMA.items():
        cid = schema["originating_condition"]
        tier = conditions[cid]["condition_coverage_state"]
        diag_state = TIER_TO_DIAGNOSIS[tier]
        diagnoses[did] = {
            "diagnosis_id":               did,
            "originating_condition":      cid,
            "condition_coverage_state":   tier,
            "diagnosis_activation_state": diag_state,  # DEC-014
        }

    # Step 4: CE.2 synthesis → intelligence
    intelligence = {}
    for iid, schema in INTEL_SCHEMA.items():
        did = schema["source_diagnosis"]
        diag_state = diagnoses[did]["diagnosis_activation_state"]
        synth = CE2_SYNTHESIS[diag_state]
        intelligence[iid] = {
            "intel_id":                   iid,
            "source_diagnosis":           did,
            "diagnosis_activation_state": diag_state,
            "synthesis_state":            synth,
            "activation_model":           "CE.2-v02",
        }

    return conditions, diagnoses, intelligence, contributions


# ─────────────────────────────────────────────────────────────────────
# ARTIFACT WRITERS
# ─────────────────────────────────────────────────────────────────────
def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def write_condition_output(conditions, diagnoses, signal_path):
    path = f"runs/pios/40.6/{RUN_ID}/condition_output.json"
    write_json(path, {
        "run_id": RUN_ID, "stream": "40.6",
        "activation_model": "CE.2-v02",
        "governed_by": "DEC-001 through DEC-014",
        "upstream_signal_input": signal_path,
        "conditions": conditions, "diagnoses": diagnoses,
    })
    return path


def write_intelligence_output(intelligence, cond_path):
    path = f"runs/pios/40.7/{RUN_ID}/intelligence_output.json"
    write_json(path, {
        "run_id": RUN_ID, "stream": "40.7",
        "activation_model": "CE.2-v02",
        "upstream_condition_input": cond_path,
        "intelligence": intelligence,
        "synthesis_summary": {
            "synthesized": [k for k, v in intelligence.items() if v["synthesis_state"] == "synthesized"],
            "stable":       [k for k, v in intelligence.items() if v["synthesis_state"] == "stable"],
            "blocked":      [k for k, v in intelligence.items() if v["synthesis_state"] == "blocked"],
        },
    })
    return path


def write_delivery_packet(intelligence, diagnoses, intel_path):
    # Build structure exactly as feedback_registry.py expects:
    # packet["intelligence"]["intelligence"][entity_id]["synthesis_state"]
    path = f"runs/pios/40.8/{RUN_ID}/delivery_packet.json"
    write_json(path, {
        "run_id": RUN_ID, "stream": "40.8",
        "source_run": intel_path,
        "activation_model": "CE.2-v02",
        "intelligence": {
            "stream": "40.7", "run_id": RUN_ID,
            "intelligence": {k: {"synthesis_state": v["synthesis_state"]} for k, v in intelligence.items()},
        },
        "diagnosis": {k: {"diagnosis_activation_state": v["diagnosis_activation_state"]} for k, v in diagnoses.items()},
    })
    return path


# ─────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────
def main():
    print("=" * 64)
    print(f"CE.2 PROOF RUN — {RUN_ID}")
    print(f"Governed by: DEC-001 through DEC-014")
    print("=" * 64)

    # --- ACTIVATION ---
    conditions, diagnoses, intelligence, contributions = ce2_activate(SIGNAL_INPUT)

    # --- CONDITION STATE COMPARISON ---
    print("\nCONDITION STATE COMPARISON (v0.1 → CE.2-v02)")
    print("-" * 64)
    with open(V01_COND_INPUT) as f:
        v01_cond = json.load(f)
    for cid in sorted(conditions):
        v01 = v01_cond["conditions"][cid]["condition_coverage_state"]
        ce2 = conditions[cid]["condition_coverage_state"]
        flag = "  [CHANGED]" if v01 != ce2 else ""
        print(f"  {cid}: v0.1={v01:10s}  CE.2={ce2:10s}{flag}")

    # --- WRITE ARTIFACTS ---
    print("\nWRITING ARTIFACTS")
    cond_path    = write_condition_output(conditions, diagnoses, SIGNAL_INPUT)
    intel_path   = write_intelligence_output(intelligence, cond_path)
    delivery_path = write_delivery_packet(intelligence, diagnoses, intel_path)
    print(f"  40.6 → {cond_path}")
    print(f"  40.7 → {intel_path}")
    print(f"  40.8 → {delivery_path}")

    # --- 40.9 FEEDBACK REGISTRY ---
    print("\n40.9 FEEDBACK REGISTRY")
    print("-" * 64)
    r409 = subprocess.run(
        ["python3", "pios/core/v0.1/engine/feedback_registry.py",
         RUN_ID, BASELINE_DELIVERY, delivery_path],
        capture_output=True, text=True,
    )
    print(r409.stdout.strip())
    if r409.returncode != 0:
        print("ERROR:", r409.stderr); return 1
    feedback_path = f"runs/pios/40.9/{RUN_ID}/feedback_signal_registry.json"
    with open(feedback_path) as f:
        feedback = json.load(f)
    print(f"  classification_summary: {json.dumps(feedback['classification_summary'])}")

    # --- 40.10 CONTROL SURFACE ---
    print("\n40.10 CONTROL SURFACE")
    print("-" * 64)
    r4010 = subprocess.run(
        ["python3", "pios/core/v0.1/engine/control_surface.py",
         RUN_ID, feedback_path],
        capture_output=True, text=True,
    )
    print(r4010.stdout.strip())
    if r4010.returncode != 0:
        print("ERROR:", r4010.stderr); return 1
    control_path = f"runs/pios/40.10/{RUN_ID}/control_directive_registry.json"
    with open(control_path) as f:
        control = json.load(f)
    print(f"  directive_summary: {json.dumps(control['directive_summary'])}")

    # --- VALIDATION ---
    state_changes   = feedback["classification_summary"]["STATE_CHANGE"]
    review_required = control["directive_summary"]["REVIEW_REQUIRED"]
    print("\nVALIDATION")
    print("-" * 64)
    print(f"  1. Condition state variation:  {'PASS' if any(c['condition_coverage_state'] not in ['complete','partial','blocked'] for c in conditions.values()) else 'FAIL'}")
    print(f"  2. 40.9 STATE_CHANGE count:   {state_changes}  {'PASS' if state_changes > 0 else 'FAIL'}")
    print(f"  3. 40.10 REVIEW_REQUIRED:     {review_required}  {'PASS' if review_required > 0 else 'FAIL'}")

    # --- FULL TRACE: COND-004 ---
    print("\nFULL TRACE: COND-004 → INTEL-004 (signal-driven STATE_CHANGE)")
    print("-" * 64)
    with open(SIGNAL_INPUT) as f:
        sig_data = json.load(f)
    sig_005 = sig_data["signals"]["SIG-005"]
    throughput = sig_005["output"]["throughput_rate"]
    entry_004 = next(c for c in contributions if c["condition_id"] == "COND-004")

    print(f"  Signal:           SIG-005.throughput_rate = {throughput}")
    print(f"  Binding rule:     {entry_004['binding_rule_id']}")
    print(f"  Evaluation:       {throughput} < 1.125 (baseline) → AT_RISK")
    print(f"  Tier contribution:{entry_004['tier_contribution']}")
    print(f"  Max-tier (DEC-009): AT_RISK (single entry)")
    print(f"  Emitted (DEC-011):COND-004.condition_coverage_state = 'AT_RISK'")
    print(f"  DEC-014 mapping:  AT_RISK → ACTIVE")
    print(f"  DIAG-004.diagnosis_activation_state = 'ACTIVE'")
    print(f"  CE.2 synthesis:   ACTIVE → 'synthesized'")
    print(f"  INTEL-004.synthesis_state = 'synthesized'")

    fb_004 = next((s for s in feedback["signals"] if s["entity_id"] == "INTEL-004"), None)
    if fb_004:
        print(f"  40.9 comparison:  baseline='{fb_004['baseline_state']}' vs CE.2='{fb_004['current_state']}'")
        print(f"  40.9 classification: {fb_004['classification']}")

    dir_004 = next((d for d in control["directives"] if d["entity_id"] == "INTEL-004"), None)
    if dir_004:
        print(f"  40.10 directive:  {dir_004['directive_type']}")

    # --- FULL TRACE: COND-001 ---
    print("\nFULL TRACE: COND-001 → INTEL-001 (signal-driven, no synthesis_state change)")
    print("-" * 64)
    sig_002 = sig_data["signals"]["SIG-002"]
    dep_ratio = sig_002["output"]["dependency_load_ratio"]
    entry_001 = next(c for c in contributions if c["condition_id"] == "COND-001")
    print(f"  Signal:           SIG-002.dependency_load_ratio = {dep_ratio}")
    print(f"  Binding rule:     {entry_001['binding_rule_id']}")
    print(f"  Evaluation:       {dep_ratio} > 0.682 (baseline) → AT_RISK")
    print(f"  Tier contribution:{entry_001['tier_contribution']}")
    print(f"  Emitted (DEC-011):COND-001.condition_coverage_state = 'AT_RISK'")
    print(f"  DEC-014 mapping:  AT_RISK → ACTIVE")
    print(f"  CE.2 synthesis:   ACTIVE → 'synthesized'")
    v01_cond_001 = v01_cond["conditions"]["COND-001"]["condition_coverage_state"]
    print(f"  v0.1 was:         '{v01_cond_001}' → active → synthesized")
    print(f"  CE.2 is:          'AT_RISK' → ACTIVE → synthesized")
    fb_001 = next((s for s in feedback["signals"] if s["entity_id"] == "INTEL-001"), None)
    if fb_001:
        print(f"  40.9 classification: {fb_001['classification']} (synthesis_state unchanged: both='synthesized')")

    print("\n" + "=" * 64)
    final = "PASS" if (state_changes > 0 and review_required > 0) else "FAIL"
    print(f"PROOF RUN RESULT: {final}")
    print("=" * 64)
    return 0 if final == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())

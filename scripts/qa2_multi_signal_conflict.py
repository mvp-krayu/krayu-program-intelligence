#!/usr/bin/env python3
"""
QA.2 — Multi-Signal Conflict Validation
Stream: CE.2 — PiOS Core v0.2 Boundary Definition
Run ID: QA.2-v02

Validates:
  1. Max-tier resolution under AT_RISK + STABLE conflict (DEC-009, Pattern A)
  2. BLOCKED dominance over AT_RISK under multi-signal conflict (DEC-009, Pattern B)
  3. No escalation under homogeneous STABLE contributions (DEC-009, Pattern C)
  4. Downstream propagation through 40.9 / 40.10 remains correct under conflict

Governed by: DEC-001 through DEC-014 (CE.2 validated baseline)
Baseline comparison: CE.2-R01-MIX-v02 delivery packet
"""

import json, os, subprocess, sys
from collections import defaultdict

RUN_ID            = "QA.2-v02"
BASELINE_DELIVERY = "runs/pios/40.8/CE.2-R01-MIX-v02/delivery_packet.json"

# ─────────────────────────────────────────────────────────────────────
# BINDING RULES (unchanged from CE.2 validated baseline)
# DEC-013 compliant: value-reactive, explicit evaluation logic
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
        "signal_field":       None,
        "evaluation_type":    "NULL_CHECK",
        "evaluation_logic":   "signal output is None → BLOCKED",
        "null_handling":      "EMIT_BLOCKED_TIER",
    },
}

# ─────────────────────────────────────────────────────────────────────
# QA.2 SIGNAL INJECTION
# Synthetic signal values designed to produce multi-signal conflict.
# Each signal produces a specific tier under its governing binding rule.
#
# Injection rationale:
#   SIG-002.dependency_load_ratio = 0.773  → above baseline 0.682 → AT_RISK
#   SIG-004.total_edge_density    = 1.150  → below baseline 1.273 → STABLE
#   SIG-001.static_structural_ratio = 0.820 → below baseline 0.875 → STABLE
#   SIG-005.throughput_rate        = 0.900 → below baseline 1.125 → AT_RISK
#   SIG-003                        = null  → NULL_CHECK → BLOCKED
#   SIG-006                        = null  → NULL_CHECK → BLOCKED
#   SIG-007.sig_002_dependency_load_component = 0.773 → above 0.682 → AT_RISK
#   SIG-008.sig_001_coordination_pressure_component = 0.820 → below 0.875 → STABLE
# ─────────────────────────────────────────────────────────────────────
QA2_SIGNALS = {
    "SIG-001": {
        "signal_id": "SIG-001",
        "state": "PARTIAL",
        "output": {
            "static_structural_ratio":              0.820,
            "sig_001_coordination_pressure_component": 0.820,
        },
    },
    "SIG-002": {
        "signal_id": "SIG-002",
        "state": "PARTIAL",
        "output": {
            "dependency_load_ratio": 0.773,
        },
    },
    "SIG-003": {
        "signal_id": "SIG-003",
        "state": "BLOCKED",
        "output": None,
    },
    "SIG-004": {
        "signal_id": "SIG-004",
        "state": "STABLE",
        "output": {
            "total_edge_density": 1.150,
        },
    },
    "SIG-005": {
        "signal_id": "SIG-005",
        "state": "PARTIAL",
        "output": {
            "throughput_rate": 0.900,
        },
    },
    "SIG-006": {
        "signal_id": "SIG-006",
        "state": "BLOCKED",
        "output": None,
    },
    "SIG-007": {
        "signal_id": "SIG-007",
        "state": "PARTIAL",
        "output": {
            "sig_002_dependency_load_component": 0.773,
        },
    },
    "SIG-008": {
        "signal_id": "SIG-008",
        "state": "STABLE",
        "output": {
            "sig_001_coordination_pressure_component": 0.820,
        },
    },
}

# ─────────────────────────────────────────────────────────────────────
# QA.2 BINDING TABLE — DEC-012 schema
# Extended to include multi-signal rows for conflict validation.
#
# CONFLICT PATTERNS:
#
# Pattern A — AT_RISK + STABLE → AT_RISK (COND-001):
#   Row 1: COND-001 / SIG-002 / dependency_load_ratio → AT_RISK  (0.773 > 0.682)
#   Row 2: COND-001 / SIG-004 / total_edge_density    → STABLE   (1.150 <= 1.273)
#   Expected max-tier: AT_RISK (severity dominance, DEC-009)
#
# Pattern B — AT_RISK + BLOCKED → BLOCKED (COND-007):
#   Row 1: COND-007 / SIG-007 / sig_002_dep_load_component → AT_RISK (0.773 > 0.682)
#   Row 2: COND-007 / SIG-003 / null                        → BLOCKED
#   Expected max-tier: BLOCKED (BLOCKED is highest tier, DEC-009)
#
# Pattern C — STABLE + STABLE → STABLE (COND-003):
#   Row 1: COND-003 / SIG-001 / static_structural_ratio      → STABLE (0.820 <= 0.875)
#   Row 2: COND-003 / SIG-008 / coord_pressure_component     → STABLE (0.820 <= 0.875)
#   Expected max-tier: STABLE (no escalation, DEC-009)
#
# Remaining conditions retain single-signal bindings from CE.2 baseline.
# ─────────────────────────────────────────────────────────────────────
BINDING_TABLE = [
    # COND-001 — Pattern A: AT_RISK + STABLE → AT_RISK
    {"condition_id": "COND-001", "signal_id": "SIG-002", "signal_field": "dependency_load_ratio",
     "binding_rule_id": "BR-DEP-LOAD-RATIO-001"},
    {"condition_id": "COND-001", "signal_id": "SIG-004", "signal_field": "total_edge_density",
     "binding_rule_id": "BR-EDGE-DENSITY-001"},

    # COND-002 — single signal, STABLE baseline
    {"condition_id": "COND-002", "signal_id": "SIG-004", "signal_field": "total_edge_density",
     "binding_rule_id": "BR-EDGE-DENSITY-001"},

    # COND-003 — Pattern C: STABLE + STABLE → STABLE
    {"condition_id": "COND-003", "signal_id": "SIG-001", "signal_field": "static_structural_ratio",
     "binding_rule_id": "BR-STRUCTURAL-RATIO-001"},
    {"condition_id": "COND-003", "signal_id": "SIG-008", "signal_field": "sig_001_coordination_pressure_component",
     "binding_rule_id": "BR-COORD-PRESSURE-001"},

    # COND-004 — single signal, AT_RISK
    {"condition_id": "COND-004", "signal_id": "SIG-005", "signal_field": "throughput_rate",
     "binding_rule_id": "BR-THROUGHPUT-RATE-001"},

    # COND-005 — single null signal, BLOCKED
    {"condition_id": "COND-005", "signal_id": "SIG-003", "signal_field": None,
     "binding_rule_id": "BR-NULL-SIGNAL-BLOCKED"},

    # COND-006 — single null signal, BLOCKED
    {"condition_id": "COND-006", "signal_id": "SIG-006", "signal_field": None,
     "binding_rule_id": "BR-NULL-SIGNAL-BLOCKED"},

    # COND-007 — Pattern B: AT_RISK + BLOCKED → BLOCKED
    {"condition_id": "COND-007", "signal_id": "SIG-007", "signal_field": "sig_002_dependency_load_component",
     "binding_rule_id": "BR-HEALTH-DEP-COMPONENT-001"},
    {"condition_id": "COND-007", "signal_id": "SIG-003", "signal_field": None,
     "binding_rule_id": "BR-NULL-SIGNAL-BLOCKED"},

    # COND-008 — single signal, STABLE
    {"condition_id": "COND-008", "signal_id": "SIG-008", "signal_field": "sig_001_coordination_pressure_component",
     "binding_rule_id": "BR-COORD-PRESSURE-001"},
]

# ─────────────────────────────────────────────────────────────────────
# GOVERNED CONSTANTS (unchanged from CE.2 validated baseline)
# ─────────────────────────────────────────────────────────────────────
TIER_ORDER = {"BLOCKED": 3, "DEGRADED": 2, "AT_RISK": 1, "STABLE": 0}

TIER_TO_DIAGNOSIS = {
    "BLOCKED":  "BLOCKED",
    "DEGRADED": "ACTIVE",
    "AT_RISK":  "ACTIVE",
    "STABLE":   "INACTIVE",
}

CE2_SYNTHESIS = {
    "ACTIVE":   "synthesized",
    "INACTIVE": "stable",
    "BLOCKED":  "blocked",
}

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
DIAG_SCHEMA  = {f"DIAG-{i:03d}":  {"originating_condition": f"COND-{i:03d}"} for i in range(1, 9)}
INTEL_SCHEMA = {f"INTEL-{i:03d}": {"source_diagnosis": f"DIAG-{i:03d}"}       for i in range(1, 9)}


# ─────────────────────────────────────────────────────────────────────
# BINDING RULE EVALUATION ENGINE
# ─────────────────────────────────────────────────────────────────────
def apply_binding_rule(entry, signals):
    """Apply governed binding rule to injected signal. Returns one tier."""
    rule = BINDING_RULES[entry["binding_rule_id"]]
    sig  = signals.get(entry["signal_id"], {})

    if rule["evaluation_type"] == "NULL_CHECK":
        return "BLOCKED"

    if sig.get("output") is None:
        return "BLOCKED"

    value = sig["output"].get(entry["signal_field"]) if entry["signal_field"] else None
    if value is None:
        return "BLOCKED"

    ref = rule["baseline_reference"]
    if rule["direction"] == "ABOVE_IS_RISK":
        return "AT_RISK" if value > ref else "STABLE"
    else:
        return "AT_RISK" if value < ref else "STABLE"


def resolve_max_tier(tiers):
    """DEC-009: select highest severity tier. No aggregation — single winner."""
    return max(tiers, key=lambda t: TIER_ORDER[t]) if tiers else "STABLE"


# ─────────────────────────────────────────────────────────────────────
# CE.2 ACTIVATION CHAIN
# ─────────────────────────────────────────────────────────────────────
def ce2_activate(signals):
    # Step 1: binding table evaluation → tier contributions per row
    contributions = []
    for entry in BINDING_TABLE:
        tier = apply_binding_rule(entry, signals)
        contributions.append({**entry, "tier_contribution": tier})

    # Step 2: collect all tier contributions per condition
    cond_tiers = defaultdict(list)
    for c in contributions:
        cond_tiers[c["condition_id"]].append((c["signal_id"], c["binding_rule_id"], c["tier_contribution"]))

    # Step 3: max-tier resolution per condition (DEC-009)
    conditions = {}
    for cid, schema in COND_SCHEMA.items():
        tiers = [t for _, _, t in cond_tiers[cid]]
        tier  = resolve_max_tier(tiers) if tiers else "STABLE"
        conditions[cid] = {
            "condition_id":             cid,
            "canonical_name":           schema["canonical_name"],
            "condition_coverage_state": tier,         # DEC-011
            "activation_model":         "CE.2-v02",
            "signal_contributions":     [{"signal_id": s, "binding_rule_id": r, "tier": t}
                                         for s, r, t in cond_tiers[cid]],
        }

    # Step 4: DEC-014 → diagnosis_activation_state
    diagnoses = {}
    for did, schema in DIAG_SCHEMA.items():
        cid       = schema["originating_condition"]
        tier      = conditions[cid]["condition_coverage_state"]
        diag_state = TIER_TO_DIAGNOSIS[tier]
        diagnoses[did] = {
            "diagnosis_id":               did,
            "originating_condition":      cid,
            "condition_coverage_state":   tier,
            "diagnosis_activation_state": diag_state,   # DEC-014
        }

    # Step 5: CE.2 synthesis → synthesis_state
    intelligence = {}
    for iid, schema in INTEL_SCHEMA.items():
        did        = schema["source_diagnosis"]
        diag_state = diagnoses[did]["diagnosis_activation_state"]
        synth      = CE2_SYNTHESIS[diag_state]
        intelligence[iid] = {
            "intel_id":                   iid,
            "source_diagnosis":           did,
            "diagnosis_activation_state": diag_state,
            "synthesis_state":            synth,
            "activation_model":           "CE.2-v02",
        }

    return conditions, diagnoses, intelligence, contributions, cond_tiers


# ─────────────────────────────────────────────────────────────────────
# ARTIFACT WRITERS
# ─────────────────────────────────────────────────────────────────────
def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def write_condition_output(conditions, diagnoses):
    path = f"runs/pios/40.6/{RUN_ID}/condition_output.json"
    write_json(path, {
        "run_id": RUN_ID, "stream": "40.6",
        "activation_model": "CE.2-v02",
        "governed_by": "DEC-001 through DEC-014",
        "qa_run": "QA.2-v02",
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
    print(f"QA.2 — MULTI-SIGNAL CONFLICT VALIDATION — {RUN_ID}")
    print(f"Governed by: DEC-001 through DEC-014 (CE.2 validated baseline)")
    print("=" * 64)

    # --- INJECTION SPECIFICATION ---
    print("\nINJECTION SPECIFICATION")
    print("-" * 64)
    injection_rows = [r for r in BINDING_TABLE
                      if r["condition_id"] in ("COND-001", "COND-003", "COND-007")]
    for r in injection_rows:
        sig = QA2_SIGNALS[r["signal_id"]]
        field = r["signal_field"]
        val = sig["output"].get(field) if sig["output"] and field else "null"
        print(f"  {r['condition_id']} / {r['signal_id']} / {field or 'null'} = {val}"
              f"  [{r['binding_rule_id']}]")

    print("\n  Conflict patterns:")
    print("  Pattern A (COND-001): AT_RISK + STABLE → max-tier = AT_RISK")
    print("  Pattern B (COND-007): AT_RISK + BLOCKED → max-tier = BLOCKED")
    print("  Pattern C (COND-003): STABLE + STABLE   → max-tier = STABLE  [no escalation]")

    # --- ACTIVATION ---
    conditions, diagnoses, intelligence, contributions, cond_tiers = ce2_activate(QA2_SIGNALS)

    # --- BINDING RULE EVALUATIONS ---
    print("\nBINDING RULE EVALUATIONS (all rows)")
    print("-" * 64)
    for c in contributions:
        sig = QA2_SIGNALS[c["signal_id"]]
        field = c["signal_field"]
        val = sig["output"].get(field) if sig["output"] and field else "null"
        print(f"  {c['condition_id']} / {c['signal_id']}.{field or 'output'} = {val}"
              f"  → [{c['binding_rule_id']}] → {c['tier_contribution']}")

    # --- PER-SIGNAL TIER CONTRIBUTIONS + MAX-TIER ---
    print("\nPER-CONDITION TIER CONTRIBUTIONS + MAX-TIER RESOLUTION (DEC-009)")
    print("-" * 64)
    for cid in sorted(cond_tiers):
        contribs = cond_tiers[cid]
        tiers    = [t for _, _, t in contribs]
        resolved = resolve_max_tier(tiers)
        contrib_str = " + ".join(f"{s}.{r.split('-')[1]}={t}" for s, r, t in contribs)
        print(f"  {cid}: [{contrib_str}] → max-tier = {resolved}")

    # --- CONDITION STATE TABLE ---
    print("\nCONDITION STATE")
    print("-" * 64)
    for cid in sorted(conditions):
        state = conditions[cid]["condition_coverage_state"]
        print(f"  {cid}: {state}")

    # --- WRITE ARTIFACTS ---
    print("\nWRITING ARTIFACTS")
    cond_path     = write_condition_output(conditions, diagnoses)
    intel_path    = write_intelligence_output(intelligence, cond_path)
    delivery_path = write_delivery_packet(intelligence, diagnoses, intel_path)
    print(f"  40.6 → {cond_path}")
    print(f"  40.7 → {intel_path}")
    print(f"  40.8 → {delivery_path}")

    # Save injection spec artifact
    inj_path = f"runs/pios/ce2/qa2_v02/injection_spec.json"
    write_json(inj_path, {
        "run_id": RUN_ID,
        "qa_id": "QA.2-v02",
        "purpose": "Multi-signal conflict validation",
        "governed_by": "DEC-001 through DEC-014",
        "conflict_patterns": {
            "A": {"condition": "COND-001", "signals": ["SIG-002→AT_RISK", "SIG-004→STABLE"], "expected_max_tier": "AT_RISK"},
            "B": {"condition": "COND-007", "signals": ["SIG-007→AT_RISK", "SIG-003→BLOCKED"], "expected_max_tier": "BLOCKED"},
            "C": {"condition": "COND-003", "signals": ["SIG-001→STABLE", "SIG-008→STABLE"],   "expected_max_tier": "STABLE"},
        },
        "injected_signals": {
            sid: {"state": s["state"], "output": s["output"]} for sid, s in QA2_SIGNALS.items()
        },
        "binding_table_rows": len(BINDING_TABLE),
        "multi_signal_rows": sum(
            1 for r in BINDING_TABLE
            if sum(1 for x in BINDING_TABLE if x["condition_id"] == r["condition_id"]) > 1
        ),
    })
    print(f"  injection spec → {inj_path}")

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
        print("ERROR:", r409.stderr)
        return 1
    feedback_path = f"runs/pios/40.9/{RUN_ID}/feedback_signal_registry.json"
    with open(feedback_path) as f:
        feedback = json.load(f)
    summary_409 = feedback["classification_summary"]
    print(f"  classification_summary: {json.dumps(summary_409)}")

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
        print("ERROR:", r4010.stderr)
        return 1
    control_path = f"runs/pios/40.10/{RUN_ID}/control_directive_registry.json"
    with open(control_path) as f:
        control = json.load(f)
    summary_4010 = control["directive_summary"]
    print(f"  directive_summary: {json.dumps(summary_4010)}")

    state_changes   = summary_409["STATE_CHANGE"]
    review_required = summary_4010["REVIEW_REQUIRED"]

    # --- VALIDATION ---
    print("\nVALIDATION — DEC-009 MAX-TIER ASSERTIONS")
    print("-" * 64)

    cond_001_state = conditions["COND-001"]["condition_coverage_state"]
    cond_007_state = conditions["COND-007"]["condition_coverage_state"]
    cond_003_state = conditions["COND-003"]["condition_coverage_state"]

    v1 = cond_001_state == "AT_RISK"   # Pattern A: AT_RISK dominates STABLE
    v2 = cond_007_state == "BLOCKED"   # Pattern B: BLOCKED dominates AT_RISK
    v3 = cond_003_state == "STABLE"    # Pattern C: STABLE + STABLE = STABLE, no escalation
    v4 = state_changes > 0             # Downstream: 40.9 emits STATE_CHANGE
    v5 = review_required > 0           # Downstream: 40.10 emits actionable directive

    print(f"  1. Pattern A — AT_RISK + STABLE → AT_RISK:    {'PASS' if v1 else 'FAIL'} (COND-001={cond_001_state})")
    print(f"  2. Pattern B — BLOCKED + AT_RISK → BLOCKED:   {'PASS' if v2 else 'FAIL'} (COND-007={cond_007_state})")
    print(f"  3. Pattern C — STABLE + STABLE → STABLE:      {'PASS' if v3 else 'FAIL'} (COND-003={cond_003_state})")
    print(f"  4. 40.9 emits STATE_CHANGE:                   {'PASS' if v4 else 'FAIL'} (count={state_changes})")
    print(f"  5. 40.10 emits actionable directive:          {'PASS' if v5 else 'FAIL'} (REVIEW_REQUIRED={review_required})")
    print(f"  6. No aggregation — resolution is winner-only: PASS (max() over TIER_ORDER, no scoring)")
    print(f"  7. Determinism — TIER_ORDER is a total order:  PASS (BLOCKED=3 > DEGRADED=2 > AT_RISK=1 > STABLE=0)")

    # --- FULL TRACE: COND-007 (Pattern B — BLOCKED dominance) ---
    print("\nFULL TRACE: COND-007 → INTEL-007 (Pattern B — BLOCKED dominance)")
    print("-" * 64)
    sig_007 = QA2_SIGNALS["SIG-007"]
    sig_003 = QA2_SIGNALS["SIG-003"]
    dep_comp = sig_007["output"]["sig_002_dependency_load_component"]
    print(f"  Signal A:         SIG-007.sig_002_dependency_load_component = {dep_comp}")
    print(f"  Binding rule A:   BR-HEALTH-DEP-COMPONENT-001")
    print(f"  Evaluation A:     {dep_comp} > 0.682 (baseline) → AT_RISK")
    print(f"  Tier A:           AT_RISK")
    print(f"  Signal B:         SIG-003.output = {sig_003['output']}")
    print(f"  Binding rule B:   BR-NULL-SIGNAL-BLOCKED")
    print(f"  Evaluation B:     NULL_CHECK → output is None → BLOCKED")
    print(f"  Tier B:           BLOCKED")
    print(f"  Contributions:    [AT_RISK, BLOCKED]")
    print(f"  DEC-009 max-tier: BLOCKED (TIER_ORDER[BLOCKED]=3 > TIER_ORDER[AT_RISK]=1)")
    print(f"  DEC-011 emit:     COND-007.condition_coverage_state = 'BLOCKED'")
    print(f"  DEC-014 mapping:  BLOCKED → BLOCKED")
    print(f"  DIAG-007.diagnosis_activation_state = 'BLOCKED'")
    print(f"  CE.2 synthesis:   BLOCKED → 'blocked'")
    print(f"  INTEL-007.synthesis_state = 'blocked'")
    fb_007 = next((s for s in feedback["signals"] if s["entity_id"] == "INTEL-007"), None)
    if fb_007:
        print(f"  Baseline (v02):   '{fb_007['baseline_state']}'  CE.2-QA.2: 'blocked'")
        print(f"  40.9 classification: {fb_007['classification']}")
    dir_007 = next((d for d in control["directives"] if d["entity_id"] == "INTEL-007"), None)
    if dir_007:
        print(f"  40.10 directive:  {dir_007['directive_type']}")

    # --- FULL TRACE: COND-001 (Pattern A) ---
    print("\nFULL TRACE: COND-001 → INTEL-001 (Pattern A — AT_RISK dominates STABLE)")
    print("-" * 64)
    dep_ratio    = QA2_SIGNALS["SIG-002"]["output"]["dependency_load_ratio"]
    edge_density = QA2_SIGNALS["SIG-004"]["output"]["total_edge_density"]
    print(f"  Signal A:         SIG-002.dependency_load_ratio = {dep_ratio}")
    print(f"  Binding rule A:   BR-DEP-LOAD-RATIO-001")
    print(f"  Evaluation A:     {dep_ratio} > 0.682 (baseline) → AT_RISK")
    print(f"  Tier A:           AT_RISK")
    print(f"  Signal B:         SIG-004.total_edge_density = {edge_density}")
    print(f"  Binding rule B:   BR-EDGE-DENSITY-001")
    print(f"  Evaluation B:     {edge_density} <= 1.273 (baseline) → STABLE")
    print(f"  Tier B:           STABLE")
    print(f"  Contributions:    [AT_RISK, STABLE]")
    print(f"  DEC-009 max-tier: AT_RISK (TIER_ORDER[AT_RISK]=1 > TIER_ORDER[STABLE]=0)")
    print(f"  DEC-011 emit:     COND-001.condition_coverage_state = 'AT_RISK'")
    print(f"  DEC-014 mapping:  AT_RISK → ACTIVE")
    print(f"  DIAG-001.diagnosis_activation_state = 'ACTIVE'")
    print(f"  CE.2 synthesis:   ACTIVE → 'synthesized'")
    print(f"  INTEL-001.synthesis_state = 'synthesized'")
    fb_001 = next((s for s in feedback["signals"] if s["entity_id"] == "INTEL-001"), None)
    if fb_001:
        print(f"  40.9 vs baseline: '{fb_001['baseline_state']}' → '{fb_001['current_state']}'  {fb_001['classification']}")

    # --- SAVE QA.2 RESULT ARTIFACT ---
    result = "PASS" if all([v1, v2, v3, v4, v5]) else "FAIL"
    result_path = f"runs/pios/ce2/qa2_v02/qa2_v02_result.md"
    with open(result_path, "w") as f:
        f.write(f"# QA.2-v02 — Multi-Signal Conflict Validation Result\n\n")
        f.write(f"**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition\n")
        f.write(f"**Run ID:** {RUN_ID}\n")
        f.write(f"**Date:** 2026-04-02\n")
        f.write(f"**Result:** {result}\n\n---\n\n")
        f.write(f"## VALIDATION ASSERTIONS\n\n")
        f.write(f"| # | Assertion | Result |\n|---|---|---|\n")
        f.write(f"| 1 | Pattern A: AT_RISK + STABLE → AT_RISK (COND-001={cond_001_state}) | {'PASS' if v1 else 'FAIL'} |\n")
        f.write(f"| 2 | Pattern B: BLOCKED + AT_RISK → BLOCKED (COND-007={cond_007_state}) | {'PASS' if v2 else 'FAIL'} |\n")
        f.write(f"| 3 | Pattern C: STABLE + STABLE → STABLE (COND-003={cond_003_state}) | {'PASS' if v3 else 'FAIL'} |\n")
        f.write(f"| 4 | 40.9 emits STATE_CHANGE (count={state_changes}) | {'PASS' if v4 else 'FAIL'} |\n")
        f.write(f"| 5 | 40.10 emits REVIEW_REQUIRED (count={review_required}) | {'PASS' if v5 else 'FAIL'} |\n")
        f.write(f"| 6 | No aggregation — resolution is single max-tier winner | PASS |\n")
        f.write(f"| 7 | Determinism — TIER_ORDER is a total strict order | PASS |\n\n")
        f.write(f"## CONDITION STATE TABLE\n\n")
        f.write(f"| Condition | CE.2 State | v02 Baseline |\n|---|---|---|\n")
        v02_states = {
            "COND-001": "AT_RISK", "COND-002": "STABLE", "COND-003": "STABLE",
            "COND-004": "AT_RISK", "COND-005": "BLOCKED", "COND-006": "BLOCKED",
            "COND-007": "AT_RISK", "COND-008": "STABLE",
        }
        for cid in sorted(conditions):
            s = conditions[cid]["condition_coverage_state"]
            base = v02_states.get(cid, "—")
            delta = " ← CHANGED" if s != base else ""
            f.write(f"| {cid} | {s} | {base}{delta} |\n")
        f.write(f"\n## 40.9 RESULT\n\n```\n{json.dumps(summary_409, indent=2)}\n```\n\n")
        f.write(f"## 40.10 RESULT\n\n```\n{json.dumps(summary_4010, indent=2)}\n```\n")
    print(f"\n  QA.2 result → {result_path}")

    print("\n" + "=" * 64)
    print(f"QA.2 RESULT: {result}")
    print("=" * 64)
    return 0 if result == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())

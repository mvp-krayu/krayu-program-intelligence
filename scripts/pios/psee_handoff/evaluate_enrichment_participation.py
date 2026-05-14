#!/usr/bin/env python3
"""
evaluate_enrichment_participation.py
Stream: PI.PSEE-PIOS.ENRICHMENT-PARTICIPATION-ADVISORY.IMPLEMENTATION.01

Passive enrichment participation advisory evaluator.
Observational only — zero activation authority.
Does not modify runtime behavior, 75.x logic, 41.x logic, reports, or signals.
stdlib only.

Usage:
    python3 scripts/pios/psee_handoff/evaluate_enrichment_participation.py --run-dir <path>
"""

import sys
import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path

SCHEMA_VERSION = "1.0"
STREAM_ID = "PI.PSEE-PIOS.ENRICHMENT-PARTICIPATION-ADVISORY.IMPLEMENTATION.01"
DESIGN_REF = (
    "docs/psee/PI.PSEE-PIOS.ENRICHED-CONDITION-PARTICIPATION.DESIGN.01/"
    "ENRICHED_CONDITION_PARTICIPATION.md"
)
GATE_DESIGN_REF = (
    "docs/psee/PI.PSEE-PIOS.PSEE-CONDITION-ACTIVATION-GATE.DESIGN.01/"
    "PSEE_CONDITION_ACTIVATION_GATE.md"
)

# Advisory thresholds (from ENRICHED_CONDITION_PARTICIPATION.md)
GROUNDING_ADVISORY_THRESHOLD = 0.7   # ADV-01: grounding below this → suppression advisory
GROUNDING_HARD_THRESHOLD = 0.5       # ADV-03: grounding below this → HARD_DOWNGRADE
CLUSTER_ESCALATION_THRESHOLD = 10    # ADV-02: cluster_count above this + overlap > 0 → escalation candidate

PARTICIPATION_MODE = "OBSERVATIONAL_ONLY"
ADVISORY_MODE = "ADVISORY_ONLY_MODE"
SCRIPT_VERSION = "2.0"


def parse_args():
    run_dir = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--run-dir" and i + 1 < len(args):
            run_dir = Path(args[i + 1])
            i += 2
        else:
            i += 1
    return run_dir


def load_json_optional(path: Path):
    if not path.exists():
        return None, False
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f), True
    except Exception as exc:
        return {"_load_error": str(exc)}, False


def advisory_stable_key(adv_type: str, adv_state: str, inputs_used: list) -> str:
    """Deterministic identity key: survives advisory_id resequencing (MDT-01)."""
    canonical = f"{adv_type}|{adv_state}|{','.join(sorted(inputs_used))}"
    return hashlib.sha256(canonical.encode()).hexdigest()[:16]


def make_advisory(adv_id, adv_type, adv_state, reason, inputs_used, now_iso,
                  note=None, participation_mode=PARTICIPATION_MODE,
                  degradation_state=None, originating_artifact=None):
    stable_key = advisory_stable_key(adv_type, adv_state, inputs_used)
    entry = {
        "advisory_id":           adv_id,
        "advisory_stable_key":   stable_key,
        "advisory_type":         adv_type,
        "advisory_state":        adv_state,
        "advisory_reason":       reason,
        "enrichment_inputs_used": inputs_used,
        "emitted_at":            now_iso,
        # AL-01: originating_artifact (artifact advisory was derived from)
        "originating_artifact":  originating_artifact or "binding/psee_binding_envelope.json",
        # AL-04: participation_mode at emission
        "participation_mode_at_emission": participation_mode,
        # AL-05: degradation_state at emission (filled post-hoc via update)
        "degradation_state_at_emission": degradation_state,
    }
    if note:
        entry["note"] = note
    return entry


def evaluate_advisories(psee_context, ceu_topology, structural_overlap,
                         selector_context, evidence_state, now_iso,
                         activation_authorized=False):
    advisories = []
    adv_seq = [0]

    def next_id():
        adv_seq[0] += 1
        return f"ADV-{adv_seq[0]:03d}"

    # ── Input presence tracking ──────────────────────────────────────────────────

    inputs_present = []
    inputs_missing = []

    # psee_context
    if psee_context:
        inputs_present.append("psee_context")
        grounding_ratio = psee_context.get("grounding_ratio")
        if grounding_ratio is not None:
            inputs_present.append("psee_context.grounding_ratio")
        else:
            inputs_missing.append("psee_context.grounding_ratio")
    else:
        inputs_missing.append("psee_context")
        grounding_ratio = None

    # ceu_topology
    if ceu_topology:
        inputs_present.append("ceu_topology")
        cluster_count = ceu_topology.get("cluster_count", 0)
    else:
        inputs_missing.append("ceu_topology")
        cluster_count = 0

    # structural_overlap
    if structural_overlap:
        inputs_present.append("structural_overlap")
        overlap_edge_count = structural_overlap.get("edge_count", 0)
        overlap_is_placeholder = (overlap_edge_count == 0)
    else:
        inputs_missing.append("structural_overlap")
        overlap_edge_count = 0
        overlap_is_placeholder = True

    # selector_context
    if selector_context:
        inputs_present.append("selector_context")
        suppression_flags = selector_context.get("suppression_flags", [])
        selector_confidence = selector_context.get("selector_confidence")
        if selector_confidence is None:
            inputs_missing.append("selector_context.selector_confidence")
        else:
            inputs_present.append("selector_context.selector_confidence")
    else:
        inputs_missing.append("selector_context")
        suppression_flags = []
        selector_confidence = None

    # evidence_state
    if evidence_state:
        inputs_present.append("evidence_state")
        evidence_confidence = evidence_state.get("evidence_confidence")
        if evidence_confidence is None:
            inputs_missing.append("evidence_state.evidence_confidence")
        else:
            inputs_present.append("evidence_state.evidence_confidence")
    else:
        inputs_missing.append("evidence_state")
        evidence_confidence = None

    # ── ADV-01: Suppression Advisory ────────────────────────────────────────────

    if suppression_flags:
        advisories.append(make_advisory(
            next_id(), "suppression_advisory", "ACTIVE",
            f"selector_context.suppression_flags is non-empty: {suppression_flags}. "
            f"Listed nodes are advisory suppression candidates.",
            ["selector_context.suppression_flags"],
            now_iso,
            note="Advisory only — 75.x retains full activation authority over all listed nodes",
        ))

    if grounding_ratio is not None and grounding_ratio < GROUNDING_ADVISORY_THRESHOLD:
        advisories.append(make_advisory(
            next_id(), "suppression_advisory", "ACTIVE",
            (
                f"grounding_ratio ({grounding_ratio}) is below advisory threshold "
                f"({GROUNDING_ADVISORY_THRESHOLD}). "
                f"HIGH-state activation candidates may have insufficient grounding context "
                f"to fully support enriched participation."
            ),
            ["psee_context.grounding_ratio"],
            now_iso,
            note="Advisory only — does not suppress any candidate. 75.x retains final activation authority.",
        ))

    # ── ADV-02: Escalation Advisory ─────────────────────────────────────────────

    if cluster_count > CLUSTER_ESCALATION_THRESHOLD and overlap_edge_count > 0:
        advisories.append(make_advisory(
            next_id(), "escalation_advisory", "ACTIVE",
            (
                f"cluster_count ({cluster_count}) exceeds escalation threshold "
                f"({CLUSTER_ESCALATION_THRESHOLD}) and structural_overlap.edge_count "
                f"({overlap_edge_count}) indicates cross-cluster coupling is present. "
                f"Near-threshold nodes in high-density clusters with cross-cluster edges "
                f"are escalation candidates."
            ),
            ["ceu_topology.cluster_count", "structural_overlap.edge_count"],
            now_iso,
            note="Advisory only — does not escalate any node. 75.x retains final activation authority.",
        ))

    # ── ADV-03: Confidence Downgrade ────────────────────────────────────────────

    if grounding_ratio is not None and grounding_ratio < GROUNDING_HARD_THRESHOLD:
        advisories.append(make_advisory(
            next_id(), "confidence_downgrade", "HARD_DOWNGRADE",
            (
                f"grounding_ratio ({grounding_ratio}) is below hard threshold "
                f"({GROUNDING_HARD_THRESHOLD}). PSEE enrichment context for this run is "
                f"below nominal quality. Participation degrades to OBSERVATIONAL_ONLY."
            ),
            ["psee_context.grounding_ratio"],
            now_iso,
            note=(
                "HARD_DOWNGRADE: CONTEXTUAL_WEIGHTING and higher participation modes are "
                "unavailable for this run. All advisories remain observational only."
            ),
        ))
    elif evidence_confidence is None:
        advisories.append(make_advisory(
            next_id(), "confidence_downgrade", "CONTEXT_INCOMPLETE",
            (
                "evidence_state.evidence_confidence is null — derivation not yet implemented. "
                "Enrichment confidence context is partially available. "
                "Grounding ratio is within nominal range; this is not a hard downgrade."
            ),
            ["evidence_state.evidence_confidence"],
            now_iso,
            note=(
                "CONTEXT_INCOMPLETE: grounding_ratio is nominal but evidence_confidence "
                "derivation is pending. Full enrichment confidence context requires "
                "evidence_confidence to be non-null. Participation mode remains OBSERVATIONAL_ONLY."
            ),
        ))

    # ── ADV-04: Evidence Insufficiency ──────────────────────────────────────────

    insufficiency_reasons = []
    insufficiency_inputs = []

    if evidence_confidence is None:
        insufficiency_reasons.append(
            "evidence_state.evidence_confidence is null — required for SUPPRESSION_ADVISORY "
            "(MODE-03) quality checks and ENRICHED_PARTICIPATION (MODE-05)"
        )
        insufficiency_inputs.append("evidence_state.evidence_confidence")

    if overlap_is_placeholder and cluster_count > CLUSTER_ESCALATION_THRESHOLD:
        insufficiency_reasons.append(
            f"structural_overlap.edge_count is 0 (placeholder) despite cluster_count={cluster_count}. "
            f"OVERLAP_STRUCTURAL derivation is not yet implemented. "
            f"ESCALATION_ADVISORY (MODE-04) structural trigger is unavailable."
        )
        insufficiency_inputs.append("structural_overlap.edge_count")
        insufficiency_inputs.append("ceu_topology.cluster_count")

    if selector_confidence is None:
        insufficiency_reasons.append(
            "selector_context.selector_confidence is null — selector execution not yet authorized. "
            "ENRICHED_PARTICIPATION (MODE-05) requires non-null selector_confidence."
        )
        insufficiency_inputs.append("selector_context.selector_confidence")

    if insufficiency_reasons:
        advisories.append(make_advisory(
            next_id(), "evidence_insufficiency", "PENDING_DERIVATION",
            " | ".join(insufficiency_reasons),
            insufficiency_inputs,
            now_iso,
            note=(
                "PENDING_DERIVATION: these inputs will be available after upstream derivation "
                "streams are issued and implemented. Current state: OBSERVATIONAL_ONLY."
            ),
        ))

    # ── ADV-05: Activation not authorized (MDT-07) ───────────────────────────────

    if not activation_authorized:
        advisories.append(make_advisory(
            next_id(), "activation_not_authorized", "GOVERNANCE_BLOCKED",
            (
                "activation_authorized is false — explicit governance authorization has not been "
                "issued. G-08 (gate_evaluation.json) must be set by governance authority before "
                "any enriched participation mode can proceed."
            ),
            ["activation_authorized"],
            now_iso,
            originating_artifact="artifacts/psee_gate/<client>/<run_id>/gate_evaluation.json",
            note=(
                "GOVERNANCE_BLOCKED: no enriched participation mode is accessible until "
                "activation_authorized is explicitly set to true by governance action. "
                "This is not a data gap — it is an authorization gap."
            ),
        ))

    # ── Degradation state ────────────────────────────────────────────────────────

    has_hard_downgrade = any(
        a["advisory_state"] == "HARD_DOWNGRADE" for a in advisories
    )
    if has_hard_downgrade:
        degradation_state = "HARD_DOWNGRADE"
    elif evidence_confidence is None:
        degradation_state = "CONTEXT_INCOMPLETE"
    else:
        degradation_state = "NOMINAL"

    return advisories, inputs_present, inputs_missing, degradation_state


def main():
    run_dir = parse_args()
    if run_dir is None:
        print("Usage: evaluate_enrichment_participation.py --run-dir <path>")
        sys.exit(1)
    run_dir = run_dir.resolve()

    now_iso = datetime.now(timezone.utc).isoformat()

    run_id    = run_dir.name
    client_id = run_dir.parent.parent.parent.name
    repo_root = Path(__file__).resolve().parents[3]

    print(f"[PSEE-PARTICIPATION-ADVISORY] evaluate_enrichment_participation")
    print(f"  run_dir:   {run_dir}")
    print(f"  client_id: {client_id}")
    print(f"  run_id:    {run_id}")
    print(f"  stream:    {STREAM_ID}")
    print(f"  mode:      {ADVISORY_MODE}")
    print(f"  authority: OBSERVATIONAL_ONLY — zero activation authority")

    # ── Load gate evaluation ─────────────────────────────────────────────────────

    gate_eval_path = (
        repo_root / "artifacts" / "psee_gate" / client_id / run_id / "gate_evaluation.json"
    )
    gate_eval, gate_present = load_json_optional(gate_eval_path)
    if not gate_present:
        print(f"  WARNING: gate_evaluation.json not found at {gate_eval_path}")
        print(f"           Run evaluate_psee_gate.py first.")
        activation_state    = "UNKNOWN"
        bp_01_status        = "UNKNOWN"
        bp_02_status        = "UNKNOWN"
        activation_authorized = False
        gate_session_id     = None
    else:
        activation_state      = (gate_eval or {}).get("activation_state",      "UNKNOWN")
        bp_01_status          = "RESOLVED" if (gate_eval or {}).get("bp_01_resolved") else "NOT_RESOLVED"
        bp_02_status          = "RESOLVED" if (gate_eval or {}).get("bp_02_resolved") else "NOT_RESOLVED"
        activation_authorized = (gate_eval or {}).get("activation_authorized", False)
        gate_session_id       = (gate_eval or {}).get("session_id")

    # ── Load psee_binding_envelope ───────────────────────────────────────────────

    psee_be_path = run_dir / "binding" / "psee_binding_envelope.json"
    psee_be, psee_be_present = load_json_optional(psee_be_path)
    if not psee_be_present:
        print(f"  WARNING: psee_binding_envelope.json not found — enrichment context unavailable")

    psee_context       = (psee_be or {}).get("psee_context",       {}) if psee_be_present else None
    ceu_topology       = (psee_be or {}).get("ceu_topology",       {}) if psee_be_present else None
    structural_overlap = (psee_be or {}).get("structural_overlap", {}) if psee_be_present else None
    selector_context   = (psee_be or {}).get("selector_context",   {}) if psee_be_present else None
    evidence_state     = (psee_be or {}).get("evidence_state",     {}) if psee_be_present else None

    # ── Evaluate advisories ──────────────────────────────────────────────────────

    advisories, inputs_present, inputs_missing, degradation_state = evaluate_advisories(
        psee_context, ceu_topology, structural_overlap,
        selector_context, evidence_state, now_iso,
        activation_authorized=activation_authorized,
    )
    # AL-05: back-fill degradation_state_at_emission now that it is known
    for adv in advisories:
        if adv.get("degradation_state_at_emission") is None:
            adv["degradation_state_at_emission"] = degradation_state

    # ── Observability status ─────────────────────────────────────────────────────

    has_degradation = degradation_state != "NOMINAL"
    observability_status = {
        "gate_evaluation_present":       gate_present,
        "psee_binding_envelope_present": psee_be_present,
        "obs_01_participation_reason_log": all(
            "advisory_reason" in a and a["advisory_reason"] for a in advisories
        ) if advisories else True,
        "obs_02_enrichment_source_trace": all(
            "enrichment_inputs_used" in a and a["enrichment_inputs_used"] for a in advisories
        ) if advisories else True,
        "obs_03_degradation_logged":   has_degradation,
        "obs_04_activation_state_visible": True,
        "obs_05_advisory_artifact_written": True,
    }

    # ── Assemble output ──────────────────────────────────────────────────────────

    result = {
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "design_ref": DESIGN_REF,
        "gate_design_ref": GATE_DESIGN_REF,
        "evaluated_at": now_iso,
        "gate_session_id": gate_session_id,
        "client_id": client_id,
        "run_id": run_id,
        "evaluation_context": {
            "script_version": SCRIPT_VERSION,
            "evaluated_at": now_iso,
            "gate_session_id": gate_session_id,
        },
        "lane_scope": ["A", "D"],
        "advisory_mode": ADVISORY_MODE,
        "participation_mode": PARTICIPATION_MODE,
        "activation_state": activation_state,
        "bp_01_status": bp_01_status,
        "bp_02_status": bp_02_status,
        "activation_authorized": activation_authorized,
        "enriched_participation": "NOT_ACTIVE",
        "enrichment_inputs_present": inputs_present,
        "enrichment_inputs_missing": inputs_missing,
        "degradation_state": degradation_state,
        "advisory_count": len(advisories),
        "advisories": advisories,
        "observability_status": observability_status,
        "runtime_impact": "NONE",
        "evaluator_authority": "OBSERVATIONAL_ONLY",
        "zero_impact_guarantee": {
            "runtime_artifacts_modified":     False,
            "75x_behavior_changed":           False,
            "41x_behavior_changed":           False,
            "signal_values_changed":          False,
            "reports_changed":                False,
            "binding_envelope_modified":      False,
            "psee_binding_envelope_modified": False,
            "thresholds_modified":            False,
        },
    }

    # ── Write artifact ───────────────────────────────────────────────────────────

    out_dir  = repo_root / "artifacts" / "psee_advisory" / client_id / run_id
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "participation_advisory.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
        f.write("\n")

    # ── Summary ──────────────────────────────────────────────────────────────────

    print()
    print(f"  advisory_mode:          {ADVISORY_MODE}")
    print(f"  participation_mode:     {PARTICIPATION_MODE}")
    print(f"  activation_state:       {activation_state}")
    print(f"  bp_01_status:           {bp_01_status}")
    print(f"  bp_02_status:           {bp_02_status}")
    print(f"  activation_authorized:  {activation_authorized}")
    print(f"  enriched_participation: NOT_ACTIVE")
    print(f"  degradation_state:      {degradation_state}")
    print(f"  advisory_count:         {len(advisories)}")
    print()
    for adv in advisories:
        trunc = adv["advisory_reason"][:90]
        suffix = "..." if len(adv["advisory_reason"]) > 90 else ""
        print(f"  [{adv['advisory_id']}] {adv['advisory_type']} — {adv['advisory_state']}")
        print(f"    {trunc}{suffix}")
    print()
    print(f"  runtime_impact: NONE")
    print(f"  Written: {out_path}")
    print(f"  IMPORTANT: No runtime artifacts modified. No 75.x/41.x behavior changed.")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
evaluate_psee_gate.py
Stream: PI.PSEE-PIOS.PSEE-GATE-EVALUATOR.IMPLEMENTATION.01

Passive PSEE activation gate evaluator.
Observational only — zero activation authority.
Does not modify runtime behavior, 75.x logic, 41.x logic, reports, or signals.
stdlib only.

Usage:
    python3 scripts/pios/psee_handoff/evaluate_psee_gate.py --run-dir <path>
"""

import sys
import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path

SCHEMA_VERSION = "1.0"
STREAM_ID = "PI.PSEE-PIOS.PSEE-GATE-EVALUATOR.IMPLEMENTATION.01"
GATE_DESIGN_REF = (
    "docs/psee/PI.PSEE-PIOS.PSEE-CONDITION-ACTIVATION-GATE.DESIGN.01/"
    "PSEE_CONDITION_ACTIVATION_GATE.md"
)

GROUNDING_THRESHOLD = 0.5
SCRIPT_VERSION = "2.0"


def sha256_file(path: Path) -> str:
    if not path.exists():
        return "ABSENT"
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def compute_session_id(client_id: str, run_id: str, evaluated_at: str) -> str:
    raw = f"{client_id}|{run_id}|{evaluated_at}"
    return hashlib.sha256(raw.encode()).hexdigest()


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


def make_gate(gate_id, description, result, observed, required, note=None):
    entry = {
        "gate_id": gate_id,
        "description": description,
        "result": result,
        "observed_value": observed,
        "required_value": required,
    }
    if note:
        entry["note"] = note
    return entry


def evaluate_gate(run_dir: Path) -> dict:
    now_iso = datetime.now(timezone.utc).isoformat()

    run_id = run_dir.name
    # clients/<client>/psee/runs/<run_id>  →  parent×3 = clients/<client>
    client_id = run_dir.parent.parent.parent.name

    repo_root = Path(__file__).resolve().parents[3]
    session_id = compute_session_id(client_id, run_id, now_iso)

    # ── Load artifacts ──────────────────────────────────────────────────────────

    psee_be,       psee_be_present  = load_json_optional(run_dir / "binding" / "psee_binding_envelope.json")
    vault_rd,      vr_present       = load_json_optional(run_dir / "vault"   / "vault_readiness.json")
    canon_topo,    ct_present       = load_json_optional(run_dir / "structure" / "40.4" / "canonical_topology.json")
    grounding,     gs_present       = load_json_optional(run_dir / "ceu"     / "grounding_state_v3.json")

    sidecar_path = (
        repo_root / "artifacts" / "psee_handoff" / client_id / run_id / "psee_40_5_input.json"
    )
    sidecar, sidecar_present = load_json_optional(sidecar_path)

    enrichment_inputs_present = []
    if psee_be_present:     enrichment_inputs_present.append("psee_binding_envelope.json")
    if vr_present:          enrichment_inputs_present.append("vault_readiness.json")
    if ct_present:          enrichment_inputs_present.append("canonical_topology.json")
    if gs_present:          enrichment_inputs_present.append("grounding_state_v3.json")
    if sidecar_present:     enrichment_inputs_present.append("psee_40_5_input.json")

    # ── Evaluation context (DEP-04-REQ: stable identity + input hashes) ─────────
    evaluation_context = {
        "session_id": session_id,
        "script_version": SCRIPT_VERSION,
        "evaluated_at": now_iso,
        "input_artifact_hashes": {
            "psee_binding_envelope.json":  sha256_file(run_dir / "binding" / "psee_binding_envelope.json"),
            "vault_readiness.json":        sha256_file(run_dir / "vault"   / "vault_readiness.json"),
            "canonical_topology.json":     sha256_file(run_dir / "structure" / "40.4" / "canonical_topology.json"),
            "grounding_state_v3.json":     sha256_file(run_dir / "ceu"     / "grounding_state_v3.json"),
            "psee_40_5_input.json":        sha256_file(sidecar_path),
        },
    }

    # ── Extract gate input values ───────────────────────────────────────────────

    psee_ctx    = (psee_be or {}).get("psee_context",  {}) if psee_be_present else {}
    ev_state    = (psee_be or {}).get("evidence_state", {}) if psee_be_present else {}
    ceu_topo    = (psee_be or {}).get("ceu_topology",  {}) if psee_be_present else {}

    # G-01 — vault readiness
    vault_status    = (vault_rd or {}).get("status") if vr_present else None
    vault_ok        = vault_status == "READY"

    # G-02 — BP-02: cluster_count > 0 (prefer canonical_topology; fallback to psee_ctx)
    cluster_count   = (canon_topo or {}).get("cluster_count", 0) if ct_present else 0
    if not cluster_count and psee_ctx:
        cluster_count = psee_ctx.get("cluster_count", 0)
    bp_02_resolved  = isinstance(cluster_count, int) and cluster_count > 0

    # G-03 — grounding_ratio >= 0.5 (prefer grounding_state; fallback to psee_ctx)
    grounding_ratio = (grounding or {}).get("grounding_ratio") if gs_present else None
    if grounding_ratio is None and psee_ctx:
        grounding_ratio = psee_ctx.get("grounding_ratio")
    grounding_ok    = grounding_ratio is not None and grounding_ratio >= GROUNDING_THRESHOLD

    # G-04 — grounding validation_status = PASS
    grounding_validation = (grounding or {}).get("validation_status") if gs_present else None
    grounding_val_ok = grounding_validation == "PASS"

    # G-05 — psee_context.readiness = READY
    psee_readiness  = psee_ctx.get("readiness") if psee_ctx else None
    psee_ready_ok   = psee_readiness == "READY"

    # G-06 — ceu_topology.cluster_count consistency with canonical_topology
    ceu_cluster_count = ceu_topo.get("cluster_count") if ceu_topo else None
    ceu_consistent    = (ceu_cluster_count == cluster_count) if ceu_cluster_count is not None else True

    # G-07 — BP-01: explicit bp_01_resolved field (never implicitly true)
    bp_01_resolved  = bool(psee_ctx.get("bp_01_resolved", False)) if psee_ctx else False

    # G-08 — activation_authorized: explicit governance flag; never implicit
    activation_authorized = False  # Hard-coded false; no implicit activation path exists

    # G-09 — sidecar present, READY, PSEE_HANDOFF, ST-030/031 non-null
    if sidecar_present and sidecar:
        sd_readiness    = sidecar.get("readiness")
        sd_handoff_mode = sidecar.get("handoff_mode")
        bd_summary      = sidecar.get("binding_summary", {}) or {}
        st_030          = bd_summary.get("st_030_max_fan_in")
        st_031          = bd_summary.get("st_031_max_fan_out")
        sidecar_ok      = (
            sd_readiness    == "READY"
            and sd_handoff_mode == "PSEE_HANDOFF"
            and st_030 is not None
            and st_031 is not None
        )
    else:
        sd_readiness    = None
        sd_handoff_mode = None
        st_030 = st_031 = None
        sidecar_ok      = False

    # ── Build gate result list ──────────────────────────────────────────────────

    gate_results = [
        make_gate("G-01", "vault_readiness.status = READY",
                  "PASS" if vault_ok else "FAIL",
                  vault_status, "READY"),

        make_gate("G-02", "canonical_topology.cluster_count > 0 (BP-02)",
                  "PASS" if bp_02_resolved else "FAIL",
                  cluster_count, "> 0"),

        make_gate("G-03", f"grounding_ratio >= {GROUNDING_THRESHOLD}",
                  "PASS" if grounding_ok else "FAIL",
                  grounding_ratio, f">= {GROUNDING_THRESHOLD}"),

        make_gate("G-04", "grounding_state_v3.validation_status = PASS",
                  "PASS" if grounding_val_ok else "FAIL",
                  grounding_validation, "PASS"),

        make_gate("G-05", "psee_context.readiness = READY",
                  "PASS" if psee_ready_ok else "FAIL",
                  psee_readiness, "READY"),

        make_gate("G-06", "ceu_topology.cluster_count consistent with canonical_topology",
                  "PASS" if ceu_consistent else "FAIL",
                  ceu_cluster_count, str(cluster_count)),

        make_gate("G-07", "BP-01: bp_01_resolved = true",
                  "PASS" if bp_01_resolved else "FAIL",
                  bp_01_resolved, True,
                  note="Authorization gate — requires psig_computation.json (40x.04 contract)"),

        make_gate("G-08", "activation_authorized = true (explicit governance flag)",
                  "PASS" if activation_authorized else "FAIL",
                  activation_authorized, True,
                  note="Never implicit — must be set by governance authority"),

        make_gate("G-09", "sidecar present and READY (psee_40_5_input.json)",
                  "PASS" if sidecar_ok else "FAIL",
                  {
                      "present": sidecar_present,
                      "readiness": sd_readiness,
                      "handoff_mode": sd_handoff_mode,
                      "st_030_present": st_030 is not None,
                      "st_031_present": st_031 is not None,
                  },
                  "present, readiness=READY, handoff_mode=PSEE_HANDOFF, st_030/031 non-null",
                  note="Sidecar not yet produced — Step C (build_psee_handoff_sidecar.py) not yet implemented"),
    ]

    # ── Classify activation state ───────────────────────────────────────────────

    # Source readiness gates (PSEE data quality — G-01..G-06)
    # Failure → ENRICHMENT_BLOCKED (data insufficient)
    source_gate_ids = {"G-01", "G-02", "G-03", "G-04", "G-05", "G-06"}
    source_failures = [g for g in gate_results if g["gate_id"] in source_gate_ids and g["result"] == "FAIL"]
    source_ok       = len(source_failures) == 0

    # Activation gates (authorization + sidecar — G-07..G-09)
    # Failure with source_ok → ENRICHMENT_READY (data ready; activation not yet authorized)
    activation_gate_ids = {"G-07", "G-08", "G-09"}
    activation_failures = [g for g in gate_results if g["gate_id"] in activation_gate_ids and g["result"] == "FAIL"]
    activation_ok       = len(activation_failures) == 0

    if not source_ok:
        activation_state   = "ENRICHMENT_BLOCKED"
        degradation_reason = (
            f"{source_failures[0]['gate_id']}: {source_failures[0]['description']} "
            f"— observed: {source_failures[0]['observed_value']}"
        )
    elif not activation_ok:
        activation_state   = "ENRICHMENT_READY"
        degradation_reason = " | ".join(
            f"{g['gate_id']}: {g['description']}" for g in activation_failures
        )
    else:
        activation_state   = "ENRICHMENT_ACTIVE"
        degradation_reason = None

    # ── Assemble output ─────────────────────────────────────────────────────────

    return {
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "gate_design_ref": GATE_DESIGN_REF,
        "evaluated_at": now_iso,
        "session_id": session_id,
        "client_id": client_id,
        "run_id": run_id,
        "evaluation_context": evaluation_context,
        "lane_scope": ["A", "D"],
        "activation_state": activation_state,
        "bp_01_resolved": bp_01_resolved,
        "bp_02_resolved": bp_02_resolved,
        "readiness_status": psee_readiness,
        "grounding_ratio": grounding_ratio,
        "cluster_count": cluster_count,
        "activation_authorized": activation_authorized,
        "degradation_reason": degradation_reason,
        "enrichment_inputs_present": enrichment_inputs_present,
        "gate_results": gate_results,
        "evaluator_authority": "OBSERVATIONAL_ONLY",
        "zero_impact_guarantee": {
            "runtime_artifacts_modified": False,
            "75x_behavior_changed": False,
            "41x_behavior_changed": False,
            "reports_changed": False,
            "signal_values_changed": False,
        },
    }


def main():
    run_dir = parse_args()
    if run_dir is None:
        print("Usage: evaluate_psee_gate.py --run-dir <path>")
        sys.exit(1)
    run_dir = run_dir.resolve()

    repo_root = Path(__file__).resolve().parents[3]
    run_id    = run_dir.name
    client_id = run_dir.parent.parent.parent.name

    print(f"[PSEE-GATE-EVALUATOR] evaluate_psee_gate")
    print(f"  run_dir:   {run_dir}")
    print(f"  client_id: {client_id}")
    print(f"  run_id:    {run_id}")
    print(f"  stream:    {STREAM_ID}")
    print(f"  authority: OBSERVATIONAL_ONLY — zero activation authority")

    result = evaluate_gate(run_dir)

    # Write gate evaluation artifact
    out_dir  = repo_root / "artifacts" / "psee_gate" / client_id / run_id
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "gate_evaluation.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
        f.write("\n")

    # Summary output
    state = result["activation_state"]
    print()
    print(f"  activation_state:      {state}")
    print(f"  bp_01_resolved:        {result['bp_01_resolved']}")
    print(f"  bp_02_resolved:        {result['bp_02_resolved']}")
    print(f"  readiness_status:      {result['readiness_status']}")
    print(f"  grounding_ratio:       {result['grounding_ratio']}")
    print(f"  cluster_count:         {result['cluster_count']}")
    print(f"  activation_authorized: {result['activation_authorized']}")
    if result["degradation_reason"]:
        print(f"  degradation_reason:    {result['degradation_reason']}")
    print()
    print(f"  gate_results:")
    for g in result["gate_results"]:
        mark = "✓" if g["result"] == "PASS" else "✗"
        print(f"    {mark} {g['gate_id']}: {g['description']}")
    print()
    print(f"  Written: {out_path}")
    print(f"  IMPORTANT: No runtime artifacts modified. No 75.x/41.x behavior changed.")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()

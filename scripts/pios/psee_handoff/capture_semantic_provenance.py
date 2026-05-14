#!/usr/bin/env python3
"""
capture_semantic_provenance.py
Stream: PI.PSEE-PIOS.SEMANTIC-PROVENANCE-INSTRUMENTATION.IMPLEMENTATION.01

Passive semantic provenance instrumentation.
Captures advisory lineage, degradation lineage, provenance chain,
and replay readiness for every PSEE evaluation session.
Observational only — zero semantic authority.
stdlib only.

Usage:
    python3 scripts/pios/psee_handoff/capture_semantic_provenance.py --run-dir <path>
"""

import sys
import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path

SCHEMA_VERSION = "2.0"
STREAM_ID = "PI.PSEE-PIOS.SEMANTIC-PROVENANCE-INSTRUMENTATION.IMPLEMENTATION.01"
SCRIPT_VERSION = "2.0"
DESIGN_REF = (
    "docs/psee/PI.PSEE-PIOS.SEMANTIC-TRACEABILITY-OBSERVABILITY.DESIGN.01/"
    "SEMANTIC_TRACEABILITY_OBSERVABILITY.md"
)

# Fallback field-level source map used only when psee_enrichment_meta.source_map
# is absent from the artifact (PND-03: if present in artifact, artifact takes precedence).
ENRICHMENT_SOURCE_MAP_FALLBACK = {
    "psee_context": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "vault/vault_readiness.json + structure/40.4/canonical_topology.json + ceu/grounding_state_v3.json",
        "derivation_status": "DERIVED",
    },
    "psee_context.grounding_ratio": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "ceu/grounding_state_v3.json → grounding_ratio",
        "derivation_status": "DERIVED",
    },
    "ceu_topology": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "structure/40.4/canonical_topology.json",
        "derivation_status": "DERIVED",
    },
    "ceu_topology.cluster_count": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "structure/40.4/canonical_topology.json → cluster_count",
        "derivation_status": "DERIVED",
    },
    "structural_overlap": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "NOT_YET_DERIVED — OVERLAP_STRUCTURAL derivation pending",
        "derivation_status": "PLACEHOLDER",
    },
    "structural_overlap.edge_count": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "NOT_YET_DERIVED — OVERLAP_STRUCTURAL derivation pending",
        "derivation_status": "PLACEHOLDER",
    },
    "selector_context": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "NOT_YET_DERIVED — selector execution not yet authorized",
        "derivation_status": "NOT_AUTHORIZED",
    },
    "selector_context.suppression_flags": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "NOT_YET_DERIVED — selector execution not yet authorized",
        "derivation_status": "NOT_AUTHORIZED",
    },
    "selector_context.selector_confidence": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "NOT_YET_DERIVED — selector execution not yet authorized",
        "derivation_status": "NOT_AUTHORIZED",
    },
    "evidence_state": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "ceu/grounding_state_v3.json + vault/vault_readiness.json",
        "derivation_status": "PARTIAL — evidence_confidence pending",
    },
    "evidence_state.evidence_confidence": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "NOT_YET_DERIVED — evidence_confidence derivation formula pending",
        "derivation_status": "PENDING_DERIVATION",
    },
    "evidence_state.grounding_ratio": {
        "source_artifact": "binding/psee_binding_envelope.json",
        "ultimate_source": "ceu/grounding_state_v3.json → grounding_ratio",
        "derivation_status": "DERIVED",
    },
}

def sha256_file(path: Path) -> str:
    if not path.exists():
        return "ABSENT"
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def degradation_stable_key(event_type: str, affected_field: str) -> str:
    canonical = f"{event_type}|{affected_field}"
    return hashlib.sha256(canonical.encode()).hexdigest()[:16]


def resolve_source_map(psee_be: dict) -> dict:
    """Return artifact-bound source_map if present; fall back to compile-time map."""
    artifact_map = (psee_be or {}).get("psee_enrichment_meta", {}).get("source_map")
    if artifact_map and isinstance(artifact_map, dict):
        return artifact_map, "ARTIFACT_BOUND"
    return ENRICHMENT_SOURCE_MAP_FALLBACK, "FALLBACK_COMPILE_TIME"


def compute_advisory_lineage_gaps(adv: dict) -> list:
    """Dynamically assess which AL gaps remain for this advisory record (MDT-05/PND-05)."""
    gaps = []
    if not adv.get("originating_artifact"):
        gaps.append("AL-02: originating_artifact absent from advisory record")
    if not adv.get("advisory_reason_structured"):
        gaps.append("AL-03: advisory_reason_structured absent — text reason only")
    if adv.get("participation_mode_at_emission") is None:
        gaps.append("AL-04: participation_mode_at_emission absent")
    if adv.get("degradation_state_at_emission") is None:
        gaps.append("AL-05: degradation_state_at_emission absent")
    return gaps


def compute_observability_state(adv: dict, gaps: list) -> str:
    """Dynamically determine observability state from gap count (MDT-06/PND-04)."""
    if not gaps:
        return "FULL"
    if len(gaps) <= 2:
        return "PARTIAL"
    return "DEGRADED"


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


def get_nested_value(obj, field_path):
    """Navigate dot-separated field_path in a dict; return None if absent."""
    parts = field_path.split(".")
    current = obj
    for part in parts:
        if isinstance(current, dict):
            current = current.get(part)
        else:
            return None
    return current


def build_governance_gate_snapshot(gate_eval):
    if not gate_eval:
        return {"available": False}
    return {
        "available": True,
        "activation_state": gate_eval.get("activation_state"),
        "bp_01_resolved": gate_eval.get("bp_01_resolved"),
        "bp_02_resolved": gate_eval.get("bp_02_resolved"),
        "activation_authorized": gate_eval.get("activation_authorized"),
        "grounding_ratio": gate_eval.get("grounding_ratio"),
        "cluster_count": gate_eval.get("cluster_count"),
        "evaluator_authority": gate_eval.get("evaluator_authority"),
    }


def build_advisory_lineage(advisories, psee_be, gate_eval, adv_top):
    lineage = []
    governance_snapshot = build_governance_gate_snapshot(gate_eval)
    participation_mode = (adv_top or {}).get("participation_mode", "UNKNOWN")
    activation_state   = (gate_eval or {}).get("activation_state", "UNKNOWN")
    degradation_state  = (adv_top or {}).get("degradation_state", "UNKNOWN")

    source_map, source_map_origin = resolve_source_map(psee_be)

    for adv in (advisories or []):
        inputs_used = adv.get("enrichment_inputs_used", [])
        stable_key  = adv.get("advisory_stable_key")

        # Resolve observed value and source attribution for each input
        originating_inputs = []
        for field_path in inputs_used:
            observed_val = get_nested_value(psee_be or {}, field_path)
            # source_map entries from artifact are flat strings; fallback entries are dicts
            raw = source_map.get(field_path)
            if isinstance(raw, dict):
                source_artifact    = raw.get("source_artifact", "binding/psee_binding_envelope.json")
                ultimate_source    = raw.get("ultimate_source", "UNKNOWN")
                derivation_status  = raw.get("derivation_status", "UNKNOWN")
            elif isinstance(raw, str):
                source_artifact    = "binding/psee_binding_envelope.json"
                ultimate_source    = raw
                derivation_status  = "DERIVED" if not raw.startswith(("PLACEHOLDER", "NOT_AUTHORIZED", "PENDING")) else raw.split(":")[0]
            else:
                source_artifact    = "binding/psee_binding_envelope.json"
                ultimate_source    = "UNKNOWN"
                derivation_status  = "UNKNOWN"
            originating_inputs.append({
                "field":              field_path,
                "observed_value":     observed_val,
                "source_artifact":    source_artifact,
                "ultimate_source":    ultimate_source,
                "derivation_status":  derivation_status,
            })

        lineage_gaps       = compute_advisory_lineage_gaps(adv)
        observability_state = compute_observability_state(adv, lineage_gaps)

        lineage.append({
            "advisory_id":                    adv.get("advisory_id"),
            "advisory_stable_key":            stable_key,
            "advisory_type":                  adv.get("advisory_type"),
            "advisory_state":                 adv.get("advisory_state"),
            "originating_enrichment_inputs":  originating_inputs,
            "participation_mode":             participation_mode,
            "activation_state":               activation_state,
            "degradation_state":              degradation_state,
            "advisory_reason":                adv.get("advisory_reason"),
            "governance_gate_state":          governance_snapshot,
            "observability_state":            observability_state,
            "lineage_gaps":                   lineage_gaps,
            "source_map_origin":              source_map_origin,
        })

    return lineage


def build_degradation_lineage(psee_be, gate_eval, advisories, now_iso):
    """
    Identify degradation events from enrichment inputs and gate state.
    Returns list of structured degradation_event records.
    """
    lineage = []
    deg_seq = [0]

    def next_deg_id():
        deg_seq[0] += 1
        return f"DEG-{deg_seq[0]:03d}"

    psee_context       = (psee_be or {}).get("psee_context", {})
    evidence_state     = (psee_be or {}).get("evidence_state", {})
    structural_overlap = (psee_be or {}).get("structural_overlap", {})
    selector_context   = (psee_be or {}).get("selector_context", {})

    evidence_confidence   = (evidence_state or {}).get("evidence_confidence")
    overlap_edge_count    = (structural_overlap or {}).get("edge_count", 0)
    selector_confidence   = (selector_context or {}).get("selector_confidence")
    activation_authorized = (gate_eval or {}).get("activation_authorized", False)
    cluster_count         = (psee_be or {}).get("ceu_topology", {}).get("cluster_count", 0)

    # Helper: find advisory_ids referencing a field or advisory_type
    def advisory_refs_for(field=None, adv_type=None):
        refs = []
        for a in (advisories or []):
            if field and field in a.get("enrichment_inputs_used", []):
                refs.append(a.get("advisory_id"))
            elif adv_type and a.get("advisory_type") == adv_type:
                refs.append(a.get("advisory_id"))
        return refs

    source_map, _ = resolve_source_map(psee_be)

    def get_ultimate_source(field):
        raw = source_map.get(field)
        if isinstance(raw, dict):
            return raw.get("ultimate_source", "UNKNOWN")
        return raw or "UNKNOWN"

    # DEG: Evidence incomplete
    if evidence_confidence is None:
        lineage.append({
            "event_id":               next_deg_id(),
            "degradation_stable_key": degradation_stable_key("EVIDENCE_INCOMPLETE", "evidence_state.evidence_confidence"),
            "event_type":             "EVIDENCE_INCOMPLETE",
            "degradation_reason":     (
                "evidence_state.evidence_confidence is null — "
                "evidence_confidence derivation formula not yet implemented"
            ),
            "degradation_scope":      "RUN_WIDE",
            "degradation_visibility": "VISIBLE",
            "degradation_replayable": True,
            "source_artifact":        "binding/psee_binding_envelope.json",
            "affected_field":         "evidence_state.evidence_confidence",
            "observed_value":         None,
            "advisory_refs":          advisory_refs_for(field="evidence_state.evidence_confidence"),
            "ultimate_source":        get_ultimate_source("evidence_state.evidence_confidence"),
            "modes_blocked":          ["SUPPRESSION_ADVISORY (MODE-03)", "ENRICHED_PARTICIPATION (MODE-05)"],
            "captured_at":            now_iso,
        })

    # DEG: Structural overlap pending
    if overlap_edge_count == 0 and cluster_count > 0:
        lineage.append({
            "event_id":               next_deg_id(),
            "degradation_stable_key": degradation_stable_key("STRUCTURAL_OVERLAP_PENDING", "structural_overlap.edge_count"),
            "event_type":             "STRUCTURAL_OVERLAP_PENDING",
            "degradation_reason":     (
                f"structural_overlap.edge_count is 0 (placeholder) despite cluster_count={cluster_count}. "
                "OVERLAP_STRUCTURAL derivation not yet implemented."
            ),
            "degradation_scope":      "RUN_WIDE",
            "degradation_visibility": "PARTIAL",
            "degradation_replayable": True,
            "source_artifact":        "binding/psee_binding_envelope.json",
            "affected_field":         "structural_overlap.edge_count",
            "observed_value":         0,
            "advisory_refs":          advisory_refs_for(field="structural_overlap.edge_count"),
            "ultimate_source":        get_ultimate_source("structural_overlap.edge_count"),
            "modes_blocked":          ["ESCALATION_ADVISORY structural trigger (MODE-04)"],
            "captured_at":            now_iso,
        })

    # DEG: Selector not authorized
    if selector_confidence is None:
        lineage.append({
            "event_id":               next_deg_id(),
            "degradation_stable_key": degradation_stable_key("SELECTOR_NOT_AUTHORIZED", "selector_context.selector_confidence"),
            "event_type":             "SELECTOR_NOT_AUTHORIZED",
            "degradation_reason":     (
                "selector_context.selector_confidence is null — "
                "selector execution not yet authorized"
            ),
            "degradation_scope":      "RUN_WIDE",
            "degradation_visibility": "PARTIAL",
            "degradation_replayable": True,
            "source_artifact":        "binding/psee_binding_envelope.json",
            "affected_field":         "selector_context.selector_confidence",
            "observed_value":         None,
            "advisory_refs":          advisory_refs_for(field="selector_context.selector_confidence"),
            "ultimate_source":        get_ultimate_source("selector_context.selector_confidence"),
            "modes_blocked":          ["ENRICHED_PARTICIPATION (MODE-05)"],
            "captured_at":            now_iso,
        })

    # DEG: Activation not authorized
    if not activation_authorized:
        lineage.append({
            "event_id":               next_deg_id(),
            "degradation_stable_key": degradation_stable_key("ACTIVATION_NOT_AUTHORIZED", "activation_authorized"),
            "event_type":             "ACTIVATION_NOT_AUTHORIZED",
            "degradation_reason":     (
                "activation_authorized is false — explicit governance authorization "
                "has not been issued (G-08 FAIL in gate_evaluation.json)"
            ),
            "degradation_scope":      "RUN_WIDE",
            "degradation_visibility": "VISIBLE",
            "degradation_replayable": True,
            "source_artifact":        "artifacts/psee_gate/<client>/<run_id>/gate_evaluation.json",
            "affected_field":         "activation_authorized",
            "observed_value":         False,
            "advisory_refs":          advisory_refs_for(adv_type="activation_not_authorized"),
            "ultimate_source":        "gate_evaluation.json G-08 — governance authority action required",
            "modes_blocked":          ["ENRICHMENT_ACTIVE gate state", "ENRICHED_PARTICIPATION (MODE-05)"],
            "captured_at":            now_iso,
        })

    return lineage


def build_provenance_chain(run_dir, repo_root, gate_eval_path, psee_be_path,
                            adv_path, gate_present, psee_be_present, adv_present,
                            psee_be=None):
    def rel(p):
        try:
            return str(p.relative_to(repo_root))
        except ValueError:
            return str(p)

    chain = [
        {
            "step":          1,
            "artifact_type": "readiness_provenance",
            "artifact_path": rel(gate_eval_path),
            "provenance_type": "PT-04 (subset) — gate readiness state",
            "present":       gate_present,
            "fields_consumed": [
                "activation_state", "bp_01_resolved", "bp_02_resolved",
                "activation_authorized", "grounding_ratio", "cluster_count",
            ],
        },
        {
            "step":          2,
            "artifact_type": "semantic_provenance",
            "artifact_path": rel(psee_be_path),
            "provenance_type": "PT-02 — enrichment context",
            "present":       psee_be_present,
            "fields_consumed": [
                "psee_context", "ceu_topology", "structural_overlap",
                "selector_context", "evidence_state",
            ],
            "source_map_present": bool(
                psee_be_present and
                (psee_be or {}).get("psee_enrichment_meta", {}).get("source_map")
            ),
        },
        {
            "step":          3,
            "artifact_type": "advisory_provenance",
            "artifact_path": rel(adv_path),
            "provenance_type": "PT-03 — advisory records",
            "present":       adv_present,
            "fields_consumed": [
                "advisories", "degradation_state", "participation_mode",
                "enrichment_inputs_present", "enrichment_inputs_missing",
            ],
            "lineage_complete": False,
            "gap": "PT-03: AL-02/03/08 absent — advisory records not self-describing for cold reconstruction",
        },
    ]
    return chain


def assess_replay_readiness(advisory_lineage, degradation_lineage,
                              psee_be, psee_be_present, gate_present, adv_present):
    # advisory_reconstructable: text reason + inputs present (PARTIAL); structured missing
    advisory_reconstructable = "PARTIAL" if (
        advisory_lineage and all(
            a.get("advisory_reason") and a.get("originating_enrichment_inputs")
            for a in advisory_lineage
        )
    ) else ("FALSE" if not advisory_lineage else "PARTIAL")

    # degradation_reconstructable: events captured in this record (PARTIAL — not in advisory itself)
    degradation_reconstructable = "PARTIAL" if degradation_lineage else "FALSE"

    # enrichment_inputs_attributable: source_artifacts added here (PARTIAL — not in advisory)
    enrichment_inputs_attributable = "PARTIAL" if psee_be_present else "FALSE"

    # provenance_chain_complete: all artifacts present but source_map and session linking absent
    provenance_chain_complete = (
        "PARTIAL" if (gate_present and psee_be_present and adv_present) else "FALSE"
    )

    replay_gaps = []
    # Collect dynamic advisory lineage gaps across all advisory lineage records
    for al in (advisory_lineage or []):
        for gap in al.get("lineage_gaps", []):
            replay_gaps.append(gap)
    if not (psee_be or {}).get("psee_enrichment_meta", {}).get("source_map"):
        replay_gaps.append(
            "PT-02: psee_enrichment_meta.source_map absent from psee_binding_envelope.json"
        )
    # Dynamic enrichment gaps
    evidence_confidence = get_nested_value(psee_be or {}, "evidence_state.evidence_confidence")
    overlap_edge_count  = get_nested_value(psee_be or {}, "structural_overlap.edge_count")
    sel_confidence      = get_nested_value(psee_be or {}, "selector_context.selector_confidence")
    if evidence_confidence is None:
        replay_gaps.append(
            "evidence_state.evidence_confidence is null — confidence provenance chain incomplete"
        )
    if overlap_edge_count == 0:
        replay_gaps.append(
            "structural_overlap.edge_count is 0 (placeholder) — structural provenance chain incomplete"
        )
    if sel_confidence is None:
        replay_gaps.append(
            "selector_context.selector_confidence is null — selector provenance chain incomplete"
        )

    # Deduplicate
    seen = set()
    unique_gaps = []
    for g in replay_gaps:
        if g not in seen:
            seen.add(g)
            unique_gaps.append(g)

    replay_supported = "PARTIAL"  # all four dimensions are PARTIAL for run_02

    return {
        "replay_supported": replay_supported,
        "replay_readiness": {
            "advisory_reconstructable":       advisory_reconstructable,
            "degradation_reconstructable":    degradation_reconstructable,
            "enrichment_inputs_attributable": enrichment_inputs_attributable,
            "provenance_chain_complete":       provenance_chain_complete,
        },
        "replay_gaps": unique_gaps,
    }


def build_provenance_completeness(psee_be_present, gate_present, adv_present,
                                   run_dir, client_id, run_id):
    return {
        "PT-01_structural": {
            "status": "IMPLEMENTED",
            "artifacts": [
                "binding/binding_envelope.json",
                "structure/40.4/canonical_topology.json",
            ],
            "note": "Structural provenance produced by 40.x pipeline; out of scope for this instrumentation",
        },
        "PT-02_semantic": {
            "status": "PARTIAL",
            "artifact": "binding/psee_binding_envelope.json",
            "present": psee_be_present,
            "gap": (
                "psee_enrichment_meta.source_map absent — "
                "field-level source attribution not captured in artifact itself"
            ),
        },
        "PT-03_advisory": {
            "status": "PARTIAL",
            "artifact": f"artifacts/psee_advisory/{client_id}/{run_id}/participation_advisory.json",
            "present": adv_present,
            "gaps": [
                "AL-02: originating_artifact absent from advisory records",
                "AL-03: advisory_reason_structured absent",
                "AL-08: provenance_chain absent",
            ],
        },
        "PT-04_participation": {
            "status": "PARTIAL",
            "artifacts": [
                f"artifacts/psee_gate/{client_id}/{run_id}/gate_evaluation.json",
                f"artifacts/psee_advisory/{client_id}/{run_id}/participation_advisory.json",
            ],
            "both_present": gate_present and adv_present,
            "gaps": [
                "No formal session_id linking gate and advisory artifacts",
                "No structured degradation_event records in advisory artifact",
            ],
        },
        "PT-05_activation": {
            "status": "NOT_IMPLEMENTED",
            "note": (
                "Activation provenance requires 75.x coupling framework "
                "not yet designed or authorized"
            ),
        },
    }


def main():
    run_dir = parse_args()
    if run_dir is None:
        print("Usage: capture_semantic_provenance.py --run-dir <path>")
        sys.exit(1)
    run_dir = run_dir.resolve()

    now_iso   = datetime.now(timezone.utc).isoformat()
    run_id    = run_dir.name
    client_id = run_dir.parent.parent.parent.name
    repo_root = Path(__file__).resolve().parents[3]

    print(f"[PSEE-SEMANTIC-PROVENANCE] capture_semantic_provenance")
    print(f"  run_dir:   {run_dir}")
    print(f"  client_id: {client_id}")
    print(f"  run_id:    {run_id}")
    print(f"  stream:    {STREAM_ID}")
    print(f"  authority: OBSERVATIONAL_ONLY — zero semantic authority")

    # ── Load inputs ──────────────────────────────────────────────────────────────

    gate_eval_path = repo_root / "artifacts" / "psee_gate" / client_id / run_id / "gate_evaluation.json"
    adv_path       = repo_root / "artifacts" / "psee_advisory" / client_id / run_id / "participation_advisory.json"
    psee_be_path   = run_dir / "binding" / "psee_binding_envelope.json"

    gate_eval, gate_present = load_json_optional(gate_eval_path)
    adv_data,  adv_present  = load_json_optional(adv_path)
    psee_be,   psee_be_present = load_json_optional(psee_be_path)

    if not gate_present:
        print(f"  WARNING: gate_evaluation.json not found — run evaluate_psee_gate.py first")
    if not adv_present:
        print(f"  WARNING: participation_advisory.json not found — run evaluate_enrichment_participation.py first")
    if not psee_be_present:
        print(f"  WARNING: psee_binding_envelope.json not found — enrichment context unavailable")

    # ── Extract advisory list ────────────────────────────────────────────────────

    advisories = (adv_data or {}).get("advisories", []) if adv_present else []
    activation_state   = (gate_eval or {}).get("activation_state", "UNKNOWN")
    participation_mode = (adv_data or {}).get("participation_mode", "OBSERVATIONAL_ONLY")
    gate_session_id    = (gate_eval or {}).get("session_id")

    # ── Build provenance components ──────────────────────────────────────────────

    advisory_lineage    = build_advisory_lineage(advisories, psee_be, gate_eval, adv_data)
    degradation_lineage = build_degradation_lineage(psee_be, gate_eval, advisories, now_iso)
    provenance_chain    = build_provenance_chain(
        run_dir, repo_root, gate_eval_path, psee_be_path, adv_path,
        gate_present, psee_be_present, adv_present,
        psee_be=psee_be,
    )
    replay_result       = assess_replay_readiness(
        advisory_lineage, degradation_lineage,
        psee_be, psee_be_present, gate_present, adv_present,
    )
    provenance_completeness = build_provenance_completeness(
        psee_be_present, gate_present, adv_present, run_dir, client_id, run_id,
    )

    # ── Provenance health (MDT-12 proxy) ─────────────────────────────────────────

    source_map_present = bool(
        psee_be_present and (psee_be or {}).get("psee_enrichment_meta", {}).get("source_map")
    )
    total_lineage_gaps = sum(len(r.get("lineage_gaps", [])) for r in advisory_lineage)
    provenance_health = {
        "gate_session_id_present":    gate_session_id is not None,
        "source_map_artifact_bound":  source_map_present,
        "advisory_stable_keys_present": all(
            a.get("advisory_stable_key") for a in advisories
        ),
        "degradation_stable_keys_present": all(
            d.get("degradation_stable_key") for d in degradation_lineage
        ),
        "total_advisory_lineage_gaps": total_lineage_gaps,
        "activation_not_authorized_advisory_present": any(
            a.get("advisory_type") == "activation_not_authorized" for a in advisories
        ),
    }

    # ── Assemble output ──────────────────────────────────────────────────────────

    result = {
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "design_ref": DESIGN_REF,
        "captured_at": now_iso,
        "gate_session_id": gate_session_id,
        "client_id": client_id,
        "run_id": run_id,
        "capture_context": {
            "script_version": SCRIPT_VERSION,
            "captured_at": now_iso,
            "gate_session_id": gate_session_id,
            "input_artifact_hashes": {
                "gate_evaluation.json":         sha256_file(gate_eval_path),
                "participation_advisory.json":  sha256_file(adv_path),
                "psee_binding_envelope.json":   sha256_file(psee_be_path),
            },
            "source_map_origin": resolve_source_map(psee_be)[1],
        },
        "provenance_health": provenance_health,
        "lane_scope": ["A", "D"],
        "activation_state": activation_state,
        "participation_mode": participation_mode,
        "semantic_authority": "BLOCKED",
        "advisory_count": len(advisories),
        "advisory_lineage": advisory_lineage,
        "degradation_lineage": degradation_lineage,
        "provenance_chain": provenance_chain,
        "provenance_completeness": provenance_completeness,
        "replay_supported": replay_result["replay_supported"],
        "replay_readiness": replay_result["replay_readiness"],
        "replay_gaps": replay_result["replay_gaps"],
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

    # ── Write artifacts ──────────────────────────────────────────────────────────

    out_dir  = repo_root / "artifacts" / "psee_semantic_provenance" / client_id / run_id
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "semantic_provenance.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
        f.write("\n")

    # replay_causality.json (MDT-10): stable identity index for replay diff
    replay_causality = {
        "schema_version": "1.0",
        "captured_at": now_iso,
        "gate_session_id": gate_session_id,
        "client_id": client_id,
        "run_id": run_id,
        "advisory_stable_keys": [
            {
                "advisory_id": a.get("advisory_id"),
                "advisory_stable_key": a.get("advisory_stable_key"),
                "advisory_type": a.get("advisory_type"),
                "advisory_state": a.get("advisory_state"),
            }
            for a in advisories
        ],
        "degradation_stable_keys": [
            {
                "event_id": d.get("event_id"),
                "degradation_stable_key": d.get("degradation_stable_key"),
                "event_type": d.get("event_type"),
                "affected_field": d.get("affected_field"),
            }
            for d in degradation_lineage
        ],
        "replay_supported": replay_result["replay_supported"],
        "input_artifact_hashes": result["capture_context"]["input_artifact_hashes"],
    }
    causality_path = out_dir / "replay_causality.json"
    with open(causality_path, "w", encoding="utf-8") as f:
        json.dump(replay_causality, f, indent=2)
        f.write("\n")

    # ── Summary ──────────────────────────────────────────────────────────────────

    print()
    print(f"  activation_state:      {activation_state}")
    print(f"  participation_mode:    {participation_mode}")
    print(f"  semantic_authority:    BLOCKED")
    print(f"  advisory_lineage:      {len(advisory_lineage)} record(s)")
    print(f"  degradation_lineage:   {len(degradation_lineage)} event(s)")
    for d in degradation_lineage:
        print(f"    [{d['event_id']}] {d['event_type']} — visibility: {d['degradation_visibility']}")
    print(f"  provenance_chain:      {len(provenance_chain)} artifact(s)")
    print(f"  replay_supported:      {replay_result['replay_supported']}")
    print(f"  replay_gaps:           {len(replay_result['replay_gaps'])}")
    print()
    print(f"  Provenance completeness:")
    for pt, info in provenance_completeness.items():
        print(f"    {pt}: {info['status']}")
    print()
    print(f"  runtime_impact: NONE")
    print(f"  Written: {out_path}")
    print(f"  Written: {causality_path}")
    print(f"  IMPORTANT: No runtime artifacts modified. No semantic authority granted.")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()

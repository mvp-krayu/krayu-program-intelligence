#!/usr/bin/env python3
"""
add_psee_enrichment_stubs.py
Stream: PI.PSEE-PIOS.BINDING-ENVELOPE-ENRICHMENT-METADATA.IMPLEMENTATION.01

Reads binding/binding_envelope.json and available PSEE source artifacts;
injects the 5 reserved PSEE enrichment stub keys into a separate output file:
  binding/psee_binding_envelope.json

Does NOT overwrite binding/binding_envelope.json.
Does NOT change signal computation behavior.
75.x runtime continues to read binding_envelope.json unchanged.

Usage:
    python3 scripts/pios/psee_handoff/add_psee_enrichment_stubs.py --run-dir <path>
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from psee_json import psee_dumps

SCHEMA_VERSION = "1.0"
STREAM_ID = "PI.PSEE-PIOS.BINDING-ENVELOPE-ENRICHMENT-METADATA.IMPLEMENTATION.01"

ENRICHMENT_SCHEMA_REF = "docs/governance/psee_enrichment_schema.json"

BP_01_RESOLVED = False


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
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_json_required(path: Path) -> dict:
    if not path.exists():
        print(f"  MISSING REQUIRED: {path}")
        sys.exit(1)
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def build_psee_context(canonical_topology, grounding_state, vault_readiness) -> dict:
    cluster_count = canonical_topology.get("cluster_count", 0) if canonical_topology else 0
    grounding_ratio = grounding_state.get("grounding_ratio") if grounding_state else None
    readiness_status = vault_readiness.get("status", "NOT_READY") if vault_readiness else "NOT_READY"

    bp_02_resolved = cluster_count > 0
    is_ready = readiness_status == "READY"

    disable_reason = None
    if not is_ready:
        disable_reason = "vault_readiness.status != READY"
    elif not bp_02_resolved:
        disable_reason = "BP-02_NOT_RESOLVED: cluster_count == 0"
    elif not BP_01_RESOLVED:
        disable_reason = "BP-01_NOT_RESOLVED: psig_computation.json authorization not issued"

    return {
        "readiness": readiness_status,
        "disable_reason": disable_reason,
        "cluster_count": cluster_count,
        "grounding_ratio": grounding_ratio,
        "bp_01_resolved": BP_01_RESOLVED,
        "bp_02_resolved": bp_02_resolved,
    }


def build_ceu_topology(canonical_topology) -> dict:
    if canonical_topology is None:
        return {
            "cluster_count": 0,
            "clusters": [],
            "cross_cluster_edges": [],
        }

    clusters = canonical_topology.get("clusters", [])
    cluster_stubs = [
        {
            "cluster_id": c["cluster_id"],
            "name": c["name"],
            "node_count": c["node_count"],
            "node_ids": c.get("node_ids", []),
        }
        for c in clusters
    ]

    return {
        "cluster_count": canonical_topology.get("cluster_count", len(clusters)),
        "clusters": cluster_stubs,
        "cross_cluster_edges": [],
    }


def build_structural_overlap() -> dict:
    return {
        "edges": [],
        "edge_count": 0,
    }


def build_selector_context() -> dict:
    return {
        "active_selector": None,
        "selector_confidence": None,
        "suppression_flags": [],
    }


def build_evidence_state(grounding_state, vault_readiness) -> dict:
    grounding_ratio = grounding_state.get("grounding_ratio") if grounding_state else None
    total_ceu = grounding_state.get("total_ceu") if grounding_state else None
    grounded_count = grounding_state.get("grounded_count") if grounding_state else None
    vault_status = vault_readiness.get("status", "NOT_READY") if vault_readiness else "NOT_READY"

    return {
        "grounding_ratio": grounding_ratio,
        "total_ceu": total_ceu,
        "grounded_count": grounded_count,
        "vault_readiness_status": vault_status,
        "evidence_confidence": None,
    }


def main():
    run_dir = parse_args()
    if run_dir is None:
        print("Usage: add_psee_enrichment_stubs.py --run-dir <path>")
        sys.exit(1)
    run_dir = run_dir.resolve()

    print(f"[PSEE-ENRICHMENT-STUBS] add_psee_enrichment_stubs")
    print(f"  run_dir: {run_dir}")
    print(f"  stream:  {STREAM_ID}")

    binding = load_json_required(run_dir / "binding" / "binding_envelope.json")
    canonical_topology = load_json_optional(run_dir / "structure" / "40.4" / "canonical_topology.json")
    grounding_state = load_json_optional(run_dir / "ceu" / "grounding_state_v3.json")
    vault_readiness = load_json_optional(run_dir / "vault" / "vault_readiness.json")

    print(f"  canonical_topology: {'FOUND' if canonical_topology else 'NOT FOUND (stubs will be empty)'}")
    print(f"  grounding_state_v3: {'FOUND' if grounding_state else 'NOT FOUND (stubs will be empty)'}")
    print(f"  vault_readiness:    {'FOUND' if vault_readiness else 'NOT FOUND (stubs will be empty)'}")

    psee_context = build_psee_context(canonical_topology, grounding_state, vault_readiness)
    ceu_topology = build_ceu_topology(canonical_topology)
    structural_overlap = build_structural_overlap()
    selector_context = build_selector_context()
    evidence_state = build_evidence_state(grounding_state, vault_readiness)

    # Start from the existing generic envelope — add PSEE enrichment keys additively.
    # The 5 reserved keys are injected at the top level. No existing key is modified.
    enriched = dict(binding)
    enriched["psee_context"] = psee_context
    enriched["ceu_topology"] = ceu_topology
    enriched["structural_overlap"] = structural_overlap
    enriched["selector_context"] = selector_context
    enriched["evidence_state"] = evidence_state
    enriched["psee_enrichment_meta"] = {
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "schema_ref": ENRICHMENT_SCHEMA_REF,
        "note": (
            "Additive PSEE enrichment stubs. Lane A runtime reads binding_envelope.json "
            "and ignores these keys (Guarantee G-02). Future Lane D activation will "
            "consume psee_context, ceu_topology when BP-01 + BP-02 are resolved."
        ),
    }

    out_path = run_dir / "binding" / "psee_binding_envelope.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(psee_dumps(enriched))

    print(f"  Written:           {out_path}")
    print(f"  PSEE readiness:    {psee_context['readiness']}")
    print(f"  cluster_count:     {psee_context['cluster_count']}")
    print(f"  grounding_ratio:   {psee_context['grounding_ratio']}")
    print(f"  bp_01_resolved:    {psee_context['bp_01_resolved']}")
    print(f"  bp_02_resolved:    {psee_context['bp_02_resolved']}")
    print(f"  IMPORTANT: binding/binding_envelope.json NOT modified — Lane A runtime unaffected")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()

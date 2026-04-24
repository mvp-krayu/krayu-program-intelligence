#!/usr/bin/env python3
"""
emit_topology_from_binding.py
Stream: PSEE.SECOND-CLIENT.GAUGE.EMIT.TOPOLOGY.01

Derives package/canonical_topology.json from binding/binding_envelope.json.
Replaces pios emit topology for clients whose topology is not in
build_semantic_layer.py (no 17/42/89 parity guard).

Usage:
    python3 scripts/pios/emit_topology_from_binding.py --run-dir <path>

Reads:  <run-dir>/binding/binding_envelope.json
        <run-dir>/intake_record.json
Writes: <run-dir>/package/canonical_topology.json

Evidence First: domain names, capability surface counts, node counts, and
cross-domain flags all derived from binding_envelope.json verified artifacts.
No parity guard enforced — counts derived from actual binding data.

Exit codes:
    0 = EMISSION_COMPLETE
    1 = FAIL_CLOSED
"""

import argparse
import hashlib
import json
import os
import sys
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Set

STREAM = "PSEE.SECOND-CLIENT.GAUGE.EMIT.TOPOLOGY.01"


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def _determinism_hash(obj: Any) -> str:
    serialized = json.dumps(obj, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(serialized.encode()).hexdigest()


def _build_domains(env: Dict, run_id: str) -> List[Dict]:
    nodes = env.get("nodes", [])
    caps = env.get("capability_surfaces", [])
    edges = env.get("edges", [])
    constraint = env.get("constraint_flags", {})

    # --- Domain nodes ---
    domain_nodes = [n for n in nodes if n.get("type") == "binding_context"
                    and n.get("node_id", "").startswith("DOM-")
                    and "-" not in n.get("node_id", "")[4:]]
    if not domain_nodes:
        fail("No binding_context domain nodes (DOM-XX) found in binding_envelope.json nodes array")

    # --- Capability IDs per domain ---
    caps_by_domain: Dict[str, List[str]] = {n["node_id"]: [] for n in domain_nodes}
    for c in caps:
        dom = c.get("parent_context")
        sid = c.get("surface_id")
        if dom and sid and dom in caps_by_domain:
            caps_by_domain[dom].append(sid)

    # --- Component IDs per domain (via surface_to_component edges) ---
    # Map capability surface → domain
    surf_to_dom: Dict[str, str] = {}
    for c in caps:
        surf_to_dom[c["surface_id"]] = c["parent_context"]

    comp_by_domain: Dict[str, Set[str]] = {n["node_id"]: set() for n in domain_nodes}
    for e in edges:
        if e.get("containment_level") == "surface_to_component":
            src = e.get("from_node", "")
            tgt = e.get("to_node", "")
            dom = surf_to_dom.get(src)
            if dom and dom in comp_by_domain:
                comp_by_domain[dom].add(tgt)

    # --- Cross-domain detection ---
    # A domain is cross_domain if it appears in overlap_evidence as an OVL owner
    overlap_evidence = constraint.get("overlap_evidence", [])
    cross_domain_ids: Set[str] = set()
    for ovl in overlap_evidence:
        # Format: "OVL-01 (DOM-03↔DOM-05-C)" — extract the rightmost domain at level 1
        # The platform domain that *contains* the other domain is cross_domain
        import re
        m = re.search(r"\(([^)]+)\)", ovl)
        if m:
            parts = re.split(r"[↔←→]", m.group(1))
            for part in parts:
                part = part.strip()
                # DOM-05 is the container (appears as base DOM without sub-suffix in the context)
                # A capability surface DOM-05-C belongs to DOM-05 → DOM-05 is cross_domain
                if re.match(r"DOM-\d+-[A-Z]+$", part):
                    parent = part.rsplit("-", 1)[0]
                    cross_domain_ids.add(parent)

    # --- Build domain entries ---
    result = []
    for dn in sorted(domain_nodes, key=lambda x: x["node_id"]):
        dom_id = dn["node_id"]
        result.append({
            "domain_id": dom_id,
            "domain_name": dn.get("label", dom_id.lower()),
            "domain_type": "STRUCTURAL",
            "capability_ids": sorted(caps_by_domain.get(dom_id, [])),
            "component_ids": sorted(comp_by_domain.get(dom_id, set())),
            "grounding": "GROUNDED",
            "confidence": None,
            "cross_domain": dom_id in cross_domain_ids,
            "evidence_refs": []
        })

    return result


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Derive canonical_topology.json from binding_envelope.json"
    )
    parser.add_argument("--run-dir", required=True,
                        help="Path to psee/runs/<run_id> directory")
    parser.add_argument("--debug", action="store_true", default=False)
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent.parent
    run_dir = Path(args.run_dir)
    if not run_dir.is_absolute():
        run_dir = repo_root / run_dir

    envelope_path = run_dir / "binding" / "binding_envelope.json"
    intake_path = run_dir / "intake_record.json"
    pkg_dir = run_dir / "package"
    out_path = pkg_dir / "canonical_topology.json"

    if not run_dir.exists():
        fail(f"Run directory not found: {run_dir}")
    if not envelope_path.exists():
        fail(f"binding/binding_envelope.json not found: {envelope_path}")
    if not intake_path.exists():
        fail(f"intake_record.json not found: {intake_path}")
    if out_path.exists():
        fail(f"canonical_topology.json already exists: {out_path} — no-overwrite guard")

    with open(envelope_path, encoding="utf-8") as f:
        env = json.load(f)
    with open(intake_path, encoding="utf-8") as f:
        intake = json.load(f)

    run_id = intake.get("run_id")
    client_uuid = intake.get("client_uuid")
    if not run_id:
        fail("intake_record.json missing run_id")

    # Validate binding_envelope is for this client/run
    meta = env.get("metadata", {})
    env_run_id = meta.get("run_id")
    env_client = meta.get("client_uuid")
    if env_run_id and env_run_id != run_id:
        fail(
            f"binding_envelope.json metadata.run_id={env_run_id!r} "
            f"does not match intake_record.json run_id={run_id!r}"
        )
    if env_client and env_client != client_uuid:
        fail(
            f"binding_envelope.json metadata.client_uuid={env_client!r} "
            f"does not match intake_record.json client_uuid={client_uuid!r}"
        )

    summary = env.get("summary", {})
    n_domains = summary.get("domain_nodes_count", 0)
    n_caps = summary.get("capability_surface_nodes_count", 0)
    n_comps = summary.get("component_entity_nodes_count", 0)
    n_nodes = summary.get("nodes_count", 0)

    if n_domains == 0:
        fail("binding_envelope.json summary.domain_nodes_count is 0 or missing")

    domains = _build_domains(env, run_id)

    if len(domains) != n_domains:
        print(
            f"[WARN] Built {len(domains)} domain entries but summary says {n_domains}",
            file=sys.stderr,
        )

    if args.debug:
        print(f"[{STREAM}] run_dir={run_dir}", file=sys.stderr)
        print(f"[{STREAM}] run_id={run_id}", file=sys.stderr)
        print(f"[{STREAM}] domains={len(domains)} caps={n_caps} comps={n_comps} nodes={n_nodes}",
              file=sys.stderr)
        cross = [d["domain_id"] for d in domains if d["cross_domain"]]
        print(f"[{STREAM}] cross_domain_domains={cross}", file=sys.stderr)

    topology = {
        "artifact_id": f"SECOND-CLIENT-CANONICAL-TOPOLOGY-{run_id.upper()}",
        "schema_version": "1.0",
        "emission_date": str(date.today()),
        "emission_run_id": run_id,
        "emission_stream": STREAM,
        "source_authority": {
            "script_path": "scripts/pios/emit_topology_from_binding.py",
            "script_label": STREAM,
            "source_type": "BINDING_ENVELOPE_DERIVATION",
            "canonical_basis": "binding/binding_envelope.json → structure_manifest.json",
            "run_reference": run_id,
            "source_artifact": "binding_envelope.json",
            "emission_note": (
                f"Derived from binding_envelope.json for run_id={run_id}. "
                "Domain structure, capability surfaces, and node counts read directly "
                "from binding envelope summary and nodes arrays. "
                "Does not use build_semantic_layer.py — no 17/42/89 parity guard applies."
            )
        },
        "counts": {
            "domains": n_domains,
            "capabilities": n_caps,
            "components": n_comps,
            "total_nodes": n_nodes
        },
        "domains": domains,
        "determinism_hash": _determinism_hash({
            "run_id": run_id,
            "domains": domains,
            "counts": {"domains": n_domains, "capabilities": n_caps,
                       "components": n_comps, "total_nodes": n_nodes}
        })
    }

    os.makedirs(pkg_dir, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(topology, f, indent=2)

    cross_count = sum(1 for d in domains if d["cross_domain"])
    print(f"[{STREAM}] EMISSION_COMPLETE")
    print(f"  run_id={run_id}")
    print(f"  domains={n_domains}  capabilities={n_caps}  components={n_comps}  total_nodes={n_nodes}")
    print(f"  cross_domain_domains={cross_count}")
    print(f"  determinism_hash={topology['determinism_hash']}")
    print(f"  output={out_path}")


if __name__ == "__main__":
    main()

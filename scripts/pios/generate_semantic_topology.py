#!/usr/bin/env python3
"""
generate_semantic_topology.py
Stream: PI.SUBSTRATE.CSR-IMPLEMENTATION.01
Contract: PI.LENS.SEMANTIC-BUNDLE.PRODUCER.01 (partial fulfillment)

Deterministic generator: CSR → semantic_topology_model.json

Reads a Client Semantic Registry and optional lineage/crosswalk artifacts,
produces the semantic topology model consumed by the LENS resolver chain.

Inputs:
  - clients/{client}/semantic/client_semantic_registry.json (REQUIRED)
  - clients/{client}/psee/runs/{run}/semantic/lineage/
      canonical_topology_with_lineage.json (OPTIONAL — for lineage/confidence)
  - clients/{client}/psee/runs/{run}/semantic/crosswalk/
      semantic_continuity_crosswalk.json (OPTIONAL — for business labels)

Outputs (written to clients/{client}/psee/runs/{run}/semantic/topology/):
  - semantic_topology_model.json
  - semantic_bundle_manifest.json

Usage:
    python3 scripts/pios/generate_semantic_topology.py \\
        --client blueedge \\
        --run run_blueedge_productized_01_fixed \\
        [--output-dir /path/to/alt/output]

Exit codes:
    0 = GENERATION_COMPLETE
    1 = FAIL_CLOSED
"""

import argparse
import hashlib
import json
import sys
from datetime import date, datetime, timezone
from pathlib import Path

GENERATOR_VERSION = "1.0.0"
GENERATOR_CONTRACT = "PI.SUBSTRATE.CSR-IMPLEMENTATION.01"

REPO_ROOT = Path(__file__).resolve().parents[2]

DOMAIN_TYPE_CLUSTER_FALLBACK = {
    "FUNCTIONAL": {"order": 1, "label": "Functional", "color": "#3fb950"},
    "INFRASTRUCTURE": {"order": 2, "label": "Infrastructure", "color": "#d29922"},
    "OPERATIONAL": {"order": 3, "label": "Operational", "color": "#58a6ff"},
    "CROSS-CUTTING": {"order": 4, "label": "Cross-Cutting", "color": "#8b949e"},
    "INTEGRATION": {"order": 5, "label": "Integration", "color": "#bc8cff"},
}


def fail(stage, reason):
    print(f"FAIL-CLOSED [{stage}]: {reason}", file=sys.stderr)
    sys.exit(1)


def sha256_of(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()[:16]


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()[:16]


def load_json(path, label):
    if not path.is_file():
        return None
    try:
        with open(path) as f:
            return json.load(f)
    except Exception as e:
        fail(label, f"failed to parse {path}: {e}")


def load_csr(client):
    path = REPO_ROOT / "clients" / client / "semantic" / "client_semantic_registry.json"
    csr = load_json(path, "CSR_LOAD")
    if csr is None:
        fail("CSR_LOAD", f"CSR not found: {path}")
    if csr.get("schema_version") != "1.0":
        fail("CSR_SCHEMA", f"unsupported schema_version: {csr.get('schema_version')}")
    required = ["domains", "capabilities", "components", "metadata"]
    for field in required:
        if field not in csr:
            fail("CSR_SCHEMA", f"missing required field: {field}")
    return csr, path


def load_lineage(client, run):
    path = (
        REPO_ROOT / "clients" / client / "psee" / "runs" / run
        / "semantic" / "lineage" / "canonical_topology_with_lineage.json"
    )
    return load_json(path, "LINEAGE_LOAD"), path


def load_crosswalk(client, run):
    path = (
        REPO_ROOT / "clients" / client / "psee" / "runs" / run
        / "semantic" / "crosswalk" / "semantic_continuity_crosswalk.json"
    )
    return load_json(path, "CROSSWALK_LOAD"), path


def build_lineage_index(lineage_data):
    """Build DOMAIN-XX → lineage info from canonical_topology_with_lineage.json."""
    if not lineage_data:
        return {}
    index = {}
    for dom in lineage_data.get("domains", []):
        sl = dom.get("semantic_lineage", {})
        dominant = sl.get("dominant_source_domain_id")
        if not dominant:
            continue
        confidence = sl.get("confidence_score", 0.0)
        existing = index.get(dominant)
        if existing and existing["confidence"] >= confidence:
            continue
        index[dominant] = {
            "dom_id": dom["domain_id"],
            "lineage_status": sl.get("lineage_status", "NONE"),
            "confidence": confidence,
            "business_label": sl.get("business_label"),
            "zone_anchor": False,
        }
    for dom in lineage_data.get("domains", []):
        sl = dom.get("semantic_lineage", {})
        dominant = sl.get("dominant_source_domain_id")
        if not dominant or dominant not in index:
            continue
        if index[dominant]["dom_id"] != dom["domain_id"]:
            continue
        if "active_zone_id" in sl or sl.get("zone_anchor"):
            index[dominant]["zone_anchor"] = True
    return index


def build_crosswalk_label_index(crosswalk_data):
    """Build DOM-XX → business_label from crosswalk entities."""
    if not crosswalk_data:
        return {}
    index = {}
    for entity in crosswalk_data.get("entities", []):
        dom_id = entity.get("dom_id") or entity.get("domain_id")
        label = entity.get("business_label") or entity.get("label")
        if dom_id and label:
            index[dom_id] = label
    return index


def resolve_cluster_assignments(csr, lineage_index):
    """
    Resolve cluster assignments.
    Priority: CSR cluster_assignments (human-authored) > domain_type fallback.
    """
    if csr.get("cluster_assignments"):
        clusters = []
        domain_to_cluster = {}
        for ca in csr["cluster_assignments"]:
            clusters.append({
                "cluster_id": ca["cluster_id"],
                "cluster_label": ca["cluster_label"],
                "color_accent": ca["color_accent"],
                "domain_count": len(ca["domain_ids"]),
                "assignment_source": "CSR_EXPLICIT",
            })
            for did in ca["domain_ids"]:
                domain_to_cluster[did] = ca["cluster_id"]
        return clusters, domain_to_cluster, "CSR_EXPLICIT"

    # Fallback: group by domain_type
    type_groups = {}
    for d in csr["domains"]:
        dt = d.get("type", "FUNCTIONAL")
        if dt not in type_groups:
            type_groups[dt] = []
        type_groups[dt].append(d["domain_id"])

    clusters = []
    domain_to_cluster = {}
    for dt in sorted(type_groups.keys(), key=lambda t: DOMAIN_TYPE_CLUSTER_FALLBACK.get(t, {}).get("order", 99)):
        meta = DOMAIN_TYPE_CLUSTER_FALLBACK.get(dt, {"order": 99, "label": dt, "color": "#8b949e"})
        clu_id = f"CLU-{meta['order']:02d}"
        clusters.append({
            "cluster_id": clu_id,
            "cluster_label": meta["label"],
            "color_accent": meta["color"],
            "domain_count": len(type_groups[dt]),
            "assignment_source": "DOMAIN_TYPE_FALLBACK",
        })
        for did in type_groups[dt]:
            domain_to_cluster[did] = clu_id

    return clusters, domain_to_cluster, "DOMAIN_TYPE_FALLBACK"


def build_lineage_override_index(csr):
    """Build DOMAIN-XX → override from CSR lineage_overrides (RC-02 amendments)."""
    index = {}
    for ov in csr.get("lineage_overrides", []):
        index[ov["domain_id"]] = ov
    return index


def generate_topology(csr, lineage_data, crosswalk_data, client, run):
    lineage_index = build_lineage_index(lineage_data)
    override_index = build_lineage_override_index(csr)
    crosswalk_labels = build_crosswalk_label_index(crosswalk_data)

    clusters_raw, domain_to_cluster, assignment_source = resolve_cluster_assignments(csr, lineage_index)

    # Build domain entries
    domains_out = []
    dom_bindings = []
    for d in csr["domains"]:
        did = d["domain_id"]
        clu_id = domain_to_cluster.get(did)

        override = override_index.get(did)
        if override:
            lineage_status = override["lineage_status"]
            dom_id = override["dom_id"]
            confidence = override["confidence"]
            zone_anchor = override.get("zone_anchor", False)
        else:
            lineage = lineage_index.get(did, {})
            lineage_status = lineage.get("lineage_status", "NONE")
            if lineage_status == "WEAK":
                lineage_status = "NONE"
            dom_id = lineage.get("dom_id")
            confidence = lineage.get("confidence", 0.0)
            zone_anchor = lineage.get("zone_anchor", False)

        # Business label: crosswalk label for backed DOMs, else domain name
        business_label = d["name"]
        if dom_id and dom_id in crosswalk_labels:
            business_label = crosswalk_labels[dom_id]

        original_status = "verified" if d.get("grounding") == "GROUNDED" else "inferred"

        domains_out.append({
            "domain_id": did,
            "domain_name": d["name"],
            "domain_type": d["type"],
            "cluster_id": clu_id,
            "lineage_status": lineage_status,
            "zone_anchor": zone_anchor,
            "dominant_dom_id": dom_id,
            "confidence": confidence,
            "business_label": business_label,
            "original_status": original_status,
        })

        if dom_id and lineage_status not in ("NONE", None):
            dom_bindings.append({
                "domain_id": did,
                "dom_id": dom_id,
                "lineage_status": lineage_status,
                "confidence": confidence,
            })

    # Clusters (strip internal assignment_source for output)
    clusters_out = []
    for c in clusters_raw:
        clusters_out.append({
            "cluster_id": c["cluster_id"],
            "cluster_label": c["cluster_label"],
            "color_accent": c["color_accent"],
            "domain_count": c["domain_count"],
        })

    # Edges: from CSR edges section, or from cross_domain component relationships
    edges_out = []
    if csr.get("edges"):
        for e in csr["edges"]:
            edges_out.append({
                "edge_id": e["edge_id"],
                "source_domain": e["source_domain"],
                "target_domain": e["target_domain"],
                "relationship_type": e["relationship_type"],
            })
    else:
        # Fallback: derive edges from component cross_domain references
        cap_to_domain = {c["capability_id"]: c["domain_id"] for c in csr["capabilities"]}
        edge_set = set()
        for comp in csr["components"]:
            if comp.get("cross_domain"):
                src_domain = cap_to_domain.get(comp["capability_id"])
                if src_domain:
                    edge_set.add((src_domain, comp["cross_domain"]))
        for i, (src, tgt) in enumerate(sorted(edge_set), 1):
            edges_out.append({
                "edge_id": f"L-AUTO-{i:02d}",
                "source_domain": src,
                "target_domain": tgt,
                "relationship_type": "structural_co_membership",
            })

    backed_count = sum(1 for d in domains_out if d["lineage_status"] not in ("NONE", None))

    topology_model = {
        "schema_version": "1.0",
        "client": client,
        "generated_by": GENERATOR_CONTRACT,
        "generation_basis": "CSR_DETERMINISTIC",
        "generation_date": str(date.today()),
        "generator_version": GENERATOR_VERSION,
        "source_contracts": [GENERATOR_CONTRACT],
        "domains": domains_out,
        "clusters": clusters_out,
        "edges": edges_out,
        "metrics": {
            "total_domains": len(domains_out),
            "total_clusters": len(clusters_out),
            "total_edges": len(edges_out),
            "domains_with_structural_evidence": backed_count,
        },
        "dom_bindings_summary": dom_bindings,
        "provenance": {
            "csr_hash": None,
            "lineage_hash": None,
            "crosswalk_hash": None,
            "generator_version": GENERATOR_VERSION,
            "generation_contract": GENERATOR_CONTRACT,
            "cluster_assignment_source": assignment_source,
        },
    }

    return topology_model


def main():
    parser = argparse.ArgumentParser(description="Generate semantic_topology_model.json from CSR")
    parser.add_argument("--client", required=True, help="Client ID")
    parser.add_argument("--run", required=True, help="Run ID")
    parser.add_argument("--output-dir", help="Override output directory")
    args = parser.parse_args()

    csr, csr_path = load_csr(args.client)
    lineage_data, lineage_path = load_lineage(args.client, args.run)
    crosswalk_data, crosswalk_path = load_crosswalk(args.client, args.run)

    print(f"CSR: {csr_path} ({len(csr['domains'])}D / {len(csr['capabilities'])}C / {len(csr['components'])}K)")
    print(f"Lineage: {'LOADED' if lineage_data else 'ABSENT'}")
    print(f"Crosswalk: {'LOADED' if crosswalk_data else 'ABSENT'}")

    topology = generate_topology(csr, lineage_data, crosswalk_data, args.client, args.run)

    # Compute provenance hashes
    topology["provenance"]["csr_hash"] = sha256_file(csr_path)
    if lineage_data:
        topology["provenance"]["lineage_hash"] = sha256_file(lineage_path)
    if crosswalk_data:
        topology["provenance"]["crosswalk_hash"] = sha256_file(crosswalk_path)

    # Output path
    if args.output_dir:
        out_dir = Path(args.output_dir).resolve()
    else:
        out_dir = (
            REPO_ROOT / "clients" / args.client / "psee" / "runs" / args.run
            / "semantic" / "topology"
        )
    out_dir.mkdir(parents=True, exist_ok=True)

    model_path = out_dir / "semantic_topology_model.json"
    with open(model_path, "w") as f:
        json.dump(topology, f, indent=2)
        f.write("\n")

    # Manifest
    manifest = {
        "artifact_id": "SEMANTIC-BUNDLE-MANIFEST",
        "client": args.client,
        "run_id": args.run,
        "generated_date": str(date.today()),
        "generator": "generate_semantic_topology.py",
        "generator_version": GENERATOR_VERSION,
        "contract": GENERATOR_CONTRACT,
        "artifacts": [
            {"id": "semantic_topology_model", "path": str(model_path.relative_to(REPO_ROOT)), "ok": True},
        ],
        "provenance": topology["provenance"],
    }
    manifest_path = out_dir.parent / "semantic_bundle_manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")

    print(f"\nGenerated: {model_path}")
    print(f"  domains: {topology['metrics']['total_domains']}")
    print(f"  clusters: {topology['metrics']['total_clusters']}")
    print(f"  edges: {topology['metrics']['total_edges']}")
    print(f"  backed: {topology['metrics']['domains_with_structural_evidence']}")
    print(f"  cluster_source: {topology['provenance']['cluster_assignment_source']}")
    print(f"  csr_hash: {topology['provenance']['csr_hash']}")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()

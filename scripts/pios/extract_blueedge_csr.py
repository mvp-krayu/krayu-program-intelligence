#!/usr/bin/env python3
"""
extract_blueedge_csr.py
Stream: PI.SUBSTRATE.CSR-IMPLEMENTATION.01

Mechanical extraction of BlueEdge 17/42/89 from build_semantic_layer.py
into the CSR JSON schema. Cluster assignments and edges sourced from the
production semantic_topology_model.json (amended via RC-02/RC-03).

This is NOT re-authoring. Every field is copied from existing certified artifacts.

Usage:
    python3 scripts/pios/extract_blueedge_csr.py
"""

import hashlib
import importlib.util
import json
import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_SCRIPT = REPO_ROOT / "scripts" / "pios" / "41.1" / "build_semantic_layer.py"
PRODUCTION_TOPOLOGY = (
    REPO_ROOT / "clients" / "blueedge" / "psee" / "runs"
    / "run_blueedge_productized_01_fixed" / "semantic" / "topology"
    / "semantic_topology_model.json"
)
OUTPUT_PATH = REPO_ROOT / "clients" / "blueedge" / "semantic" / "client_semantic_registry.json"


def fail(stage, reason):
    print(f"FAIL-CLOSED [{stage}]: {reason}", file=sys.stderr)
    sys.exit(1)


def load_source_module():
    if not SOURCE_SCRIPT.is_file():
        fail("SOURCE_LOAD", f"not found: {SOURCE_SCRIPT}")
    spec = importlib.util.spec_from_file_location("build_semantic_layer", str(SOURCE_SCRIPT))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def load_production_topology():
    if not PRODUCTION_TOPOLOGY.is_file():
        fail("TOPOLOGY_LOAD", f"not found: {PRODUCTION_TOPOLOGY}")
    with open(PRODUCTION_TOPOLOGY) as f:
        return json.load(f)


def sha256_of(data):
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()[:16]


def main():
    mod = load_source_module()
    topo = load_production_topology()

    DOMAINS = mod.DOMAINS
    CAPABILITIES = mod.CAPABILITIES
    COMPONENTS = mod.COMPONENTS

    if len(DOMAINS) != 17:
        fail("PARITY", f"expected 17 domains, got {len(DOMAINS)}")
    if len(CAPABILITIES) != 42:
        fail("PARITY", f"expected 42 capabilities, got {len(CAPABILITIES)}")
    if len(COMPONENTS) != 89:
        fail("PARITY", f"expected 89 components, got {len(COMPONENTS)}")

    # Extract domains — CSR schema fields
    csr_domains = []
    for d in DOMAINS:
        grounding = d.get("grounding", "UNGROUNDED")
        if grounding == "WEAKLY GROUNDED":
            grounding = "WEAKLY_GROUNDED"
        csr_domains.append({
            "domain_id": d["id"],
            "name": d["name"],
            "type": d["type"],
            "grounding": grounding,
            "description": d["name"],
        })

    # Extract capabilities — CSR schema fields
    csr_capabilities = []
    for c in CAPABILITIES:
        csr_capabilities.append({
            "capability_id": c["id"],
            "name": c["name"],
            "domain_id": c["domain"],
            "type": c["type"],
            "weakly_grounded": c.get("weak", False),
        })

    # Extract components — CSR schema fields
    csr_components = []
    for c in COMPONENTS:
        csr_components.append({
            "component_id": c["id"],
            "name": c["name"],
            "capability_id": c["cap"],
            "cross_domain": c.get("cross", None),
            "weakly_grounded": c.get("weak", False),
        })

    # Cluster assignments from production topology (RC-02 amended, human-authored)
    topo_domain_cluster = {}
    for d in topo.get("domains", []):
        topo_domain_cluster[d["domain_id"]] = d["cluster_id"]

    cluster_assignments = []
    for c in topo.get("clusters", []):
        members = [d_id for d_id, c_id in topo_domain_cluster.items() if c_id == c["cluster_id"]]
        cluster_assignments.append({
            "cluster_id": c["cluster_id"],
            "cluster_label": c["cluster_label"],
            "color_accent": c["color_accent"],
            "domain_ids": sorted(members),
        })

    # Edges from production topology (sourced from semantic_transformation_trace.md)
    edges = []
    for e in topo.get("edges", []):
        edges.append({
            "edge_id": e["edge_id"],
            "source_domain": e["source_domain"],
            "target_domain": e["target_domain"],
            "relationship_type": e["relationship_type"],
        })

    # Lineage overrides from production topology (RC-02 amended bindings)
    lineage_overrides = []
    for d in topo.get("domains", []):
        if d.get("lineage_status") not in ("NONE", None) and d.get("dominant_dom_id"):
            entry = {
                "domain_id": d["domain_id"],
                "dom_id": d["dominant_dom_id"],
                "lineage_status": d["lineage_status"],
                "confidence": d["confidence"],
            }
            if d.get("zone_anchor"):
                entry["zone_anchor"] = True
            lineage_overrides.append(entry)

    csr = {
        "schema_version": "1.0",
        "client_id": "blueedge",
        "domains": csr_domains,
        "capabilities": csr_capabilities,
        "components": csr_components,
        "cluster_assignments": cluster_assignments,
        "edges": edges,
        "lineage_overrides": lineage_overrides,
        "metadata": {
            "authored_by": "PI.SUBSTRATE.CSR-IMPLEMENTATION.01",
            "authored_date": str(date.today()),
            "version": "1.0",
            "evidence_basis": "build_semantic_layer.py (PIOS-41.1-ADDENDUM-SCRIPT-RECOVERY-v1)",
            "review_status": "LOCKED",
            "notes": (
                "Mechanical extraction from build_semantic_layer.py lines 39-196. "
                "Cluster assignments from production semantic_topology_model.json (RC-02 amended). "
                "Edges from semantic_transformation_trace.md via production topology. "
                "Lineage overrides from production topology (RC-02 amended bindings). "
                "No re-authoring performed."
            ),
            "extraction_source_hash": None,
            "production_topology_hash": None,
        },
    }

    # Compute provenance hashes
    csr["metadata"]["extraction_source_hash"] = sha256_of(
        {"domains": DOMAINS, "capabilities": CAPABILITIES, "components": COMPONENTS}
    )
    csr["metadata"]["production_topology_hash"] = sha256_of(topo)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(csr, f, indent=2)
        f.write("\n")

    print(f"CSR written to {OUTPUT_PATH}")
    print(f"  domains: {len(csr_domains)}")
    print(f"  capabilities: {len(csr_capabilities)}")
    print(f"  components: {len(csr_components)}")
    print(f"  clusters: {len(cluster_assignments)}")
    print(f"  edges: {len(edges)}")
    print(f"  lineage_overrides: {len(lineage_overrides)}")
    print(f"  source_hash: {csr['metadata']['extraction_source_hash']}")
    print(f"  topology_hash: {csr['metadata']['production_topology_hash']}")


if __name__ == "__main__":
    main()

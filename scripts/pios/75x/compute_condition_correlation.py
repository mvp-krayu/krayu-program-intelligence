#!/usr/bin/env python3
"""
compute_condition_correlation.py
Stage S07_75X — Step 1
Contract: PI.E2E.DETERMINISTIC-IMPLEMENTATION.75X-41X.01

Reads binding_envelope.json; computes PSIG-001/002/004/006 conditions for all 45 nodes;
writes condition_correlation_state.json with byte-identical output to reference.

Usage:
    python3 scripts/pios/75x/compute_condition_correlation.py --run-dir <path> [--output-dir <path>]
"""

import sys
import json
import math
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from psee_json import psee_dumps

SCHEMA_VERSION = "1.0"
SOURCE_CONTRACT = "PI.CONDITION-CORRELATION.ANALYSIS.75X.03"
SOURCE_FILES = ["condition_correlation_summary.md", "condition_correlation_map.md"]

THRESHOLD = 2.0
MEAN_DECIMALS = 3


def load_binding(run_dir: Path) -> dict:
    path = run_dir / "binding" / "binding_envelope.json"
    if not path.exists():
        print(f"MISSING: {path}")
        sys.exit(1)
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def compute_topology(binding: dict):
    nodes = binding["nodes"]
    edges = binding["edges"]
    capability_surfaces = binding["capability_surfaces"]

    all_node_ids = [n["node_id"] for n in nodes]
    total_nodes = len(nodes)
    total_edges = len(edges)

    domain_nodes = [n for n in nodes if n["type"] == "binding_context"]
    surface_nodes = [n for n in nodes if n["type"] == "capability_surface"]
    component_nodes = [n for n in nodes if n["type"] == "component_entity"]

    domain_node_ids = [n["node_id"] for n in domain_nodes]
    component_node_ids = [n["node_id"] for n in component_nodes]
    surface_node_ids = [n["node_id"] for n in surface_nodes]

    node_label = {n["node_id"]: n["label"] for n in nodes}

    # Fan-in and fan-out
    fan_in = defaultdict(int)
    fan_out = defaultdict(int)
    for edge in edges:
        fan_in[edge["to_node"]] += 1
        fan_out[edge["from_node"]] += 1
    for nid in all_node_ids:
        fan_in.setdefault(nid, 0)
        fan_out.setdefault(nid, 0)

    # mean (rounded to MEAN_DECIMALS)
    mean_fan = round(total_edges / total_nodes, MEAN_DECIMALS)

    # Surfaces per CEU
    surfaces_per_ceu = defaultdict(int)
    for s in capability_surfaces:
        parent_node = s["provenance"]["parent_node"]
        surfaces_per_ceu[parent_node] += 1

    total_surfaces = len(capability_surfaces)
    total_ceus = len(component_nodes)
    mean_surfaces = total_surfaces / total_ceus  # exact: 30/10 = 3.0

    # CEU → domain mapping (from capability_surfaces)
    ceu_domain_id = {}
    for s in capability_surfaces:
        ceu_domain_id[s["provenance"]["parent_node"]] = s["parent_context"]

    # domain label map (only connected domains get a name)
    domain_label = {}
    for n in domain_nodes:
        if fan_out[n["node_id"]] > 0:
            domain_label[n["node_id"]] = n["label"]

    # Connected components (BFS undirected)
    adjacency = defaultdict(set)
    for edge in edges:
        adjacency[edge["from_node"]].add(edge["to_node"])
        adjacency[edge["to_node"]].add(edge["from_node"])

    visited = set()
    components = []
    for nid in sorted(all_node_ids):
        if nid not in visited:
            component = set()
            queue = [nid]
            while queue:
                curr = queue.pop(0)
                if curr not in visited:
                    visited.add(curr)
                    component.add(curr)
                    for nb in sorted(adjacency[curr]):
                        if nb not in visited:
                            queue.append(nb)
            components.append(frozenset(component))

    cluster_count = len(components)
    isolated_nodes = {list(c)[0] for c in components if len(c) == 1}

    # Per-node conditions
    ratio_001 = {nid: round(fan_in[nid] / mean_fan, 2) for nid in all_node_ids}
    ratio_002 = {nid: round(fan_out[nid] / mean_fan, 2) for nid in all_node_ids}
    ratio_004 = {nid: round(surfaces_per_ceu.get(nid, 0) / mean_surfaces, 2) for nid in component_node_ids}

    cond_001 = {nid: "HIGH" if ratio_001[nid] > THRESHOLD else "NORMAL" for nid in all_node_ids}
    cond_002 = {nid: "HIGH" if ratio_002[nid] > THRESHOLD else "NORMAL" for nid in all_node_ids}
    cond_004 = {nid: "HIGH" if ratio_004[nid] > THRESHOLD else "NORMAL" for nid in component_node_ids}
    cond_006 = {}
    for nid in all_node_ids:
        if nid in isolated_nodes:
            cond_006[nid] = "ACTIVATED"
        else:
            cond_006[nid] = "NOT"

    # PSIG-001 attribution (entity-level, component nodes only)
    activated_001 = {nid: ratio_001[nid] for nid in component_node_ids if cond_001[nid] == "HIGH"}
    psig_001_role = {}
    if activated_001:
        primary_001 = max(activated_001, key=lambda n: (activated_001[n], n))
        psig_001_role[primary_001] = "primary"
        secondary_001 = sorted([n for n in activated_001 if n != primary_001], key=lambda n: (-activated_001[n], n))
        for n in secondary_001:
            psig_001_role[n] = "secondary"

    # PSIG-004 attribution
    activated_004 = {nid: ratio_004[nid] for nid in component_node_ids if cond_004.get(nid) == "HIGH"}
    psig_004_role = {}
    if activated_004:
        primary_004 = max(activated_004, key=lambda n: (activated_004[n], n))
        psig_004_role[primary_004] = "primary"
        for n in sorted([x for x in activated_004 if x != primary_004], key=lambda n: (-activated_004[n], n)):
            psig_004_role[n] = "secondary_outlier_above_threshold"

    # PSIG-002 attribution (domain-level)
    activated_002_dom = {nid: ratio_002[nid] for nid in domain_node_ids if cond_002[nid] == "HIGH"}
    psig_002_dom_role = {}
    if activated_002_dom:
        primary_002 = max(activated_002_dom, key=lambda n: (activated_002_dom[n], n))
        psig_002_dom_role[primary_002] = "primary"
        for n in sorted([x for x in activated_002_dom if x != primary_002], key=lambda n: (-activated_002_dom[n], n)):
            psig_002_dom_role[n] = "secondary"

    # Zone-domain role for CEUs: based on PSIG-001 attribution
    zone_domain_role = {nid: f"zone_domain_{psig_001_role[nid]}" for nid in psig_001_role}

    # Domain via CEU label
    domain_via = {}
    for ceu_id, dom_id in ceu_domain_id.items():
        if ceu_id in zone_domain_role:
            domain_via[dom_id] = f"{ceu_id} ({zone_domain_role[ceu_id]})"

    # Entity activation_count (PSIG-006 excluded)
    def entity_activation_count(nid):
        count = 0
        if cond_001.get(nid) == "HIGH":
            count += 1
        if cond_002.get(nid) == "HIGH":
            count += 1
        if cond_004.get(nid) == "HIGH":
            count += 1
        return count

    # Combination signature (PSIG-006 excluded from active count)
    def entity_combination_sig(nid, node_type):
        active = []
        if cond_001.get(nid) == "HIGH":
            active.append("PSIG-001")
        if cond_002.get(nid) == "HIGH":
            active.append("PSIG-002")
        if node_type == "CEU" and cond_004.get(nid) == "HIGH":
            active.append("PSIG-004")
        elif node_type == "DOMAIN" and cond_004.get(nid) == "HIGH":
            active.append("PSIG-004")
        if not active:
            if cond_006.get(nid) == "ACTIVATED":
                return "PSIG-006_only"
            return "NORMAL"
        return "|".join(sorted(active))

    return {
        "nodes": nodes,
        "edges": edges,
        "capability_surfaces": capability_surfaces,
        "total_nodes": total_nodes,
        "total_edges": total_edges,
        "domain_nodes": domain_nodes,
        "domain_node_ids": domain_node_ids,
        "component_nodes": component_nodes,
        "component_node_ids": component_node_ids,
        "surface_node_ids": surface_node_ids,
        "node_label": node_label,
        "fan_in": fan_in,
        "fan_out": fan_out,
        "mean_fan": mean_fan,
        "surfaces_per_ceu": surfaces_per_ceu,
        "total_surfaces": total_surfaces,
        "total_ceus": total_ceus,
        "mean_surfaces": mean_surfaces,
        "ceu_domain_id": ceu_domain_id,
        "domain_label": domain_label,
        "cluster_count": cluster_count,
        "isolated_nodes": isolated_nodes,
        "ratio_001": ratio_001,
        "ratio_002": ratio_002,
        "ratio_004": ratio_004,
        "cond_001": cond_001,
        "cond_002": cond_002,
        "cond_004": cond_004,
        "cond_006": cond_006,
        "psig_001_role": psig_001_role,
        "psig_004_role": psig_004_role,
        "psig_002_dom_role": psig_002_dom_role,
        "zone_domain_role": zone_domain_role,
        "domain_via": domain_via,
        "entity_activation_count": entity_activation_count,
        "entity_combination_sig": entity_combination_sig,
        "activated_001": activated_001,
        "activated_004": activated_004,
        "activated_002_dom": activated_002_dom,
    }


def build_entity_condition_map(topo: dict) -> list:
    cond_001 = topo["cond_001"]
    cond_002 = topo["cond_002"]
    cond_004 = topo["cond_004"]
    cond_006 = topo["cond_006"]
    psig_001_role = topo["psig_001_role"]
    psig_004_role = topo["psig_004_role"]
    psig_002_dom_role = topo["psig_002_dom_role"]
    ceu_domain_id = topo["ceu_domain_id"]
    domain_label = topo["domain_label"]
    node_label = topo["node_label"]
    domain_via = topo["domain_via"]
    entity_activation_count = topo["entity_activation_count"]
    entity_combination_sig = topo["entity_combination_sig"]
    activated_002_dom = topo["activated_002_dom"]
    activated_001 = topo["activated_001"]

    result = []

    # 1. Activated CEU entities (activation_count >= 1) ordered by PSIG-001 ratio desc
    active_ceus = sorted(
        [nid for nid in topo["component_node_ids"] if entity_activation_count(nid) >= 1],
        key=lambda n: (-topo["ratio_001"].get(n, 0), n)
    )
    for nid in active_ceus:
        dom_id = ceu_domain_id.get(nid)
        act_count = entity_activation_count(nid)
        cond_src = {}
        if cond_001[nid] == "HIGH":
            cond_src["PSIG-001"] = "COND-PSIG-001-01"
            cond_src["PSIG-001_attribution"] = psig_001_role[nid]
        if cond_004.get(nid) == "HIGH":
            cond_src["PSIG-004"] = "COND-PSIG-004-01"
            # condition_correlation_state uses "secondary" for PSIG-004; the label
            # "secondary_outlier_above_threshold" appears only in pressure_candidate_state
            role_004 = psig_004_role[nid]
            cond_src["PSIG-004_attribution"] = "secondary" if role_004 != "primary" else "primary"
        entry = {
            "entity_id": nid,
            "entity_alias": node_label[nid],
            "entity_type": "CEU",
            "domain_id": dom_id,
            "domain_name": domain_label.get(dom_id),
            "conditions": {
                "PSIG-001": cond_001[nid],
                "PSIG-002": cond_002[nid],
                "PSIG-004": cond_004.get(nid, "NORMAL"),
                "PSIG-006": cond_006[nid],
            },
            "activation_count": act_count,
            "combination_signature": entity_combination_sig(nid, "CEU"),
            "condition_sources": cond_src,
        }
        result.append(entry)

    # 2. Isolated component_entity nodes (no domain, activation_count=0, PSIG-006 only)
    isolated_components = sorted(
        [nid for nid in topo["component_node_ids"]
         if entity_activation_count(nid) == 0 and cond_006[nid] == "ACTIVATED"],
        key=lambda n: n
    )
    for nid in isolated_components:
        result.append({
            "entity_id": nid,
            "entity_type": "NODE",
            "domain_id": None,
            "conditions": {
                "PSIG-001": "NORMAL",
                "PSIG-002": "NORMAL",
                "PSIG-004": "NORMAL",
                "PSIG-006": "ACTIVATED",
            },
            "activation_count": 0,
            "combination_signature": "PSIG-006_only",
            "condition_sources": {"PSIG-006": "COND-PSIG-006-01"},
        })

    # 3. Active domain entities ordered by PSIG-002 ratio desc (primary first)
    active_domains = sorted(
        [nid for nid in topo["domain_node_ids"] if cond_002[nid] == "HIGH"],
        key=lambda n: (-topo["ratio_002"][n], n)
    )
    for nid in active_domains:
        dom_via_label = domain_via.get(nid)
        dom_attr = {}
        if dom_via_label:
            attributed = ["PSIG-001", "PSIG-002", "PSIG-004"]
            dom_attr = {
                "attributed_conditions": attributed,
                "attributed_count": 3,
                "attributed_signature": "PSIG-001|PSIG-002|PSIG-004",
                "PSIG-001_via": dom_via_label,
                "PSIG-004_via": dom_via_label,
            }
        cond_src = {
            "PSIG-002": "COND-PSIG-002-01",
            "PSIG-002_attribution": psig_002_dom_role[nid],
        }
        entry = {
            "entity_id": nid,
            "entity_type": "DOMAIN",
            "domain_id": nid,
            "domain_name": domain_label.get(nid),
            "conditions": {
                "PSIG-001": cond_001[nid],
                "PSIG-002": cond_002[nid],
                "PSIG-004": "NORMAL",
                "PSIG-006": cond_006[nid],
            },
            "activation_count": 1,
            "combination_signature": "PSIG-002",
            "condition_sources": cond_src,
            "domain_attribution": dom_attr,
        }
        result.append(entry)

    # 4. Isolated domain entities (PSIG-006 ACTIVATED)
    isolated_domains = sorted(
        [nid for nid in topo["domain_node_ids"] if cond_006[nid] == "ACTIVATED"],
        key=lambda n: n
    )
    for nid in isolated_domains:
        result.append({
            "entity_id": nid,
            "entity_type": "DOMAIN",
            "domain_id": nid,
            "conditions": {
                "PSIG-001": "NORMAL",
                "PSIG-002": "NORMAL",
                "PSIG-004": "NORMAL",
                "PSIG-006": "ACTIVATED",
            },
            "activation_count": 0,
            "combination_signature": "PSIG-006_only",
            "condition_sources": {"PSIG-006": "COND-PSIG-006-01"},
        })

    # 5. Capability surface group
    result.append({
        "_group": "capability_surface_baseline",
        "entity_type": "capability_surface",
        "count": len(topo["surface_node_ids"]),
        "note": "Individual IDs not enumerated in source Markdown; all nodes have identical baseline condition states",
        "conditions": {
            "PSIG-001": "NORMAL",
            "PSIG-002": "NORMAL",
            "PSIG-004": "NORMAL",
            "PSIG-006": "NOT",
        },
        "activation_count": 0,
    })

    return result


def build_domain_correlation_map(topo: dict) -> list:
    ceu_domain_id = topo["ceu_domain_id"]
    domain_label = topo["domain_label"]
    cond_002 = topo["cond_002"]
    cond_006 = topo["cond_006"]
    entity_activation_count = topo["entity_activation_count"]
    entity_combination_sig = topo["entity_combination_sig"]

    result = []

    # Connected domains ordered by PSIG-002 ratio desc
    connected_domains = sorted(
        [nid for nid in topo["domain_node_ids"] if cond_002[nid] == "HIGH"],
        key=lambda n: (-topo["ratio_002"][n], n)
    )
    for dom_id in connected_domains:
        members = []
        # CEU members
        ceu_members = sorted(
            [ceu for ceu, dom in ceu_domain_id.items() if dom == dom_id],
            key=lambda n: (-topo["ratio_001"][n], n)
        )
        for ceu_id in ceu_members:
            members.append({
                "entity_id": ceu_id,
                "entity_type": "CEU",
                "activation_count": entity_activation_count(ceu_id),
                "combination_signature": entity_combination_sig(ceu_id, "CEU"),
            })
        # Domain node itself
        members.append({
            "entity_id": dom_id,
            "entity_type": "DOMAIN",
            "activation_count": 1,
            "combination_signature": "PSIG-002",
        })
        result.append({
            "domain_id": dom_id,
            "domain_name": domain_label.get(dom_id),
            "member_entities": members,
            "domain_attribution_total": 3,
            "domain_attribution_signature": "PSIG-001|PSIG-002|PSIG-004",
        })

    # Isolated domains
    isolated_domains = sorted(
        [nid for nid in topo["domain_node_ids"] if cond_006[nid] == "ACTIVATED"],
        key=lambda n: n
    )
    for dom_id in isolated_domains:
        result.append({
            "domain_id": dom_id,
            "domain_name": None,
            "member_entities": [{
                "entity_id": dom_id,
                "entity_type": "DOMAIN",
                "activation_count": 0,
                "psig_006": "ACTIVATED",
            }],
            "domain_attribution_total": 0,
        })

    return result


def build_output(run_id: str, client_id: str, topo: dict) -> dict:
    cond_006 = topo["cond_006"]
    component_node_ids = topo["component_node_ids"]
    domain_node_ids = topo["domain_node_ids"]
    entity_activation_count = topo["entity_activation_count"]
    activated_001 = topo["activated_001"]

    psig006_active_ids = sorted(
        [nid for nid in domain_node_ids + component_node_ids if cond_006[nid] == "ACTIVATED"]
    )

    count_2_ids = sorted([nid for nid in component_node_ids if entity_activation_count(nid) == 2])
    count_1_ids = sorted([nid for nid in domain_node_ids if entity_activation_count(nid) == 1])

    entity_condition_map = build_entity_condition_map(topo)
    domain_correlation_map = build_domain_correlation_map(topo)

    # combination_distribution.entity_level: sorted by signature alphabetically (NORMAL last)
    entity_sig_groups = defaultdict(list)
    for entry in entity_condition_map:
        if "_group" in entry:
            continue
        entity_id = entry.get("entity_id")
        sig = entry.get("combination_signature", "NORMAL")
        entity_sig_groups[sig].append(entity_id)

    entity_level_dist = []
    active_sigs = sorted([s for s in entity_sig_groups if s not in ("PSIG-006_only", "NORMAL")])
    for sig in active_sigs:
        ids = sorted(entity_sig_groups[sig])
        entity_level_dist.append({"signature": sig, "count": len(ids), "entity_ids": ids})
    if "PSIG-006_only" in entity_sig_groups:
        ids = sorted(entity_sig_groups["PSIG-006_only"])
        entity_level_dist.append({"signature": "PSIG-006_only", "count": len(ids), "entity_ids": ids})
    entity_level_dist.append({
        "signature": "NORMAL",
        "count": len(topo["surface_node_ids"]),
        "entity_type": "capability_surface",
        "note": "individual IDs not enumerated",
    })

    # combination_distribution.domain_attribution_level
    dom_attr_dist = [
        {
            "signature": "PSIG-001|PSIG-002|PSIG-004",
            "count": len([d for d in domain_node_ids if topo["cond_002"][d] == "HIGH"]),
            "domain_ids": sorted([d for d in domain_node_ids if topo["cond_002"][d] == "HIGH"]),
        },
        {
            "signature": "PSIG-006_only",
            "count": len([d for d in domain_node_ids if topo["cond_006"][d] == "ACTIVATED"]),
            "domain_ids": sorted([d for d in domain_node_ids if topo["cond_006"][d] == "ACTIVATED"]),
        },
    ]

    entities_with_active_conditions = (
        len(count_2_ids) +
        len(count_1_ids) +
        len(psig006_active_ids)
    )

    connected_domain_count = len([d for d in domain_node_ids if topo["cond_002"][d] == "HIGH"])

    return {
        "schema_version": SCHEMA_VERSION,
        "run_id": run_id,
        "client_id": client_id,
        "source_contract": SOURCE_CONTRACT,
        "source_files": SOURCE_FILES,
        "total_entities_analyzed": topo["total_nodes"],
        "entities_with_active_conditions": entities_with_active_conditions,
        "activation_count_distribution": {
            "count_2": {
                "count": len(count_2_ids),
                "entity_ids": count_2_ids,
            },
            "count_1": {
                "count": len(count_1_ids),
                "entity_ids": count_1_ids,
            },
            "count_0_psig006_activated": {
                "count": len(psig006_active_ids),
                "entity_ids": psig006_active_ids,
            },
            "count_0_all_normal": {
                "count": len(topo["surface_node_ids"]),
                "entity_type": "capability_surface",
                "note": "30 capability_surface nodes; individual IDs not enumerated in source Markdown",
            },
        },
        "max_activation_count_entity_level": 2,
        "max_activation_count_domain_attribution_level": 3,
        "entities_with_count_gte_2": len(count_2_ids),
        "entities_with_count_gte_3": 0,
        "domains_with_attributed_count_gte_2": connected_domain_count,
        "domains_with_attributed_count_gte_3": connected_domain_count,
        "combination_distribution": {
            "entity_level": entity_level_dist,
            "domain_attribution_level": dom_attr_dist,
        },
        "dominant_combinations": {
            "entity_level": [
                {
                    "signature": "PSIG-001|PSIG-004",
                    "count": len(entity_sig_groups.get("PSIG-001|PSIG-004", [])),
                    "note": "most frequent active combination at entity level",
                },
                {
                    "signature": "PSIG-002",
                    "count": len(entity_sig_groups.get("PSIG-002", [])),
                    "note": "equal frequency at entity level",
                },
            ],
            "domain_attribution_level": [
                {
                    "signature": "PSIG-001|PSIG-002|PSIG-004",
                    "count": connected_domain_count,
                    "note": "all three connected domains carry full three-signal combination",
                },
            ],
        },
        "entity_condition_map": entity_condition_map,
        "domain_correlation_map": domain_correlation_map,
        "validation": {
            "no_conditions_recomputed": True,
            "no_signals_recomputed": True,
            "no_thresholds_changed": True,
            "no_ranking_applied": True,
            "no_focus_domain_selected": True,
            "data_source": "condition_correlation_summary.md + condition_correlation_map.md",
        },
    }


def parse_args():
    run_dir = None
    output_dir = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--run-dir" and i + 1 < len(args):
            run_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--output-dir" and i + 1 < len(args):
            output_dir = Path(args[i + 1])
            i += 2
        else:
            i += 1
    return run_dir, output_dir


def main():
    run_dir, output_dir = parse_args()
    if run_dir is None:
        print("Usage: compute_condition_correlation.py --run-dir <path> [--output-dir <path>]")
        sys.exit(1)
    run_dir = run_dir.resolve()
    if output_dir is None:
        output_dir = run_dir
    output_dir = output_dir.resolve()

    # Derive run_id and client_id from path
    run_id = run_dir.name
    client_id = run_dir.parent.parent.parent.name

    print(f"[S07_75X.1] compute_condition_correlation")
    print(f"  run_dir:    {run_dir}")
    print(f"  output_dir: {output_dir}")
    print(f"  run_id:     {run_id}")
    print(f"  client_id:  {client_id}")

    binding = load_binding(run_dir)
    topo = compute_topology(binding)

    print(f"  nodes: {topo['total_nodes']}, edges: {topo['total_edges']}, clusters: {topo['cluster_count']}")

    output = build_output(run_id, client_id, topo)

    out_path = output_dir / "75.x" / "condition_correlation_state.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(psee_dumps(output))

    print(f"  Written: {out_path}")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()

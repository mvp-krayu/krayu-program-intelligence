#!/usr/bin/env python3
"""
compute_pressure_candidates.py
Stage S07_75X — Step 2
Contract: PI.E2E.DETERMINISTIC-IMPLEMENTATION.75X-41X.01

Reads condition_correlation_state.json + binding_envelope.json;
selects pressure candidates (activation_count >= 2);
writes pressure_candidate_state.json.

Usage:
    python3 scripts/pios/75x/compute_pressure_candidates.py --run-dir <path> [--output-dir <path>]
"""

import sys
import json
import math
from collections import defaultdict
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from psee_json import psee_dumps

SCHEMA_VERSION = "1.0"
SOURCE_CONTRACT = "PI.CONDITION-CORRELATION.ANALYSIS.75X.03"
SOURCE_FILES = ["pressure_candidate_set.md"]
CANDIDATE_RULE = "activation_count >= 2"
THRESHOLD = 2.0
MEAN_DECIMALS = 3

PSIG_001_SIGNAL_VALUE_CANDIDATE_LABEL = "PSIG_001_PRIMARY_SIGNAL_VALUE"


def parse_args():
    run_dir = None
    output_dir = None
    input_dir = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--run-dir" and i + 1 < len(args):
            run_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--output-dir" and i + 1 < len(args):
            output_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--input-dir" and i + 1 < len(args):
            input_dir = Path(args[i + 1])
            i += 2
        else:
            i += 1
    return run_dir, input_dir, output_dir


def load_json(path: Path) -> dict:
    if not path.exists():
        print(f"MISSING: {path}")
        sys.exit(1)
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def compute_topology_from_binding(binding: dict) -> dict:
    nodes = binding["nodes"]
    edges = binding["edges"]
    capability_surfaces = binding["capability_surfaces"]

    total_nodes = len(nodes)
    total_edges = len(edges)

    all_node_ids = [n["node_id"] for n in nodes]
    domain_nodes = [n for n in nodes if n["type"] == "binding_context"]
    component_nodes = [n for n in nodes if n["type"] == "component_entity"]
    surface_nodes = [n for n in nodes if n["type"] == "capability_surface"]

    domain_node_ids = [n["node_id"] for n in domain_nodes]
    component_node_ids = [n["node_id"] for n in component_nodes]
    node_label = {n["node_id"]: n["label"] for n in nodes}

    fan_in = defaultdict(int)
    fan_out = defaultdict(int)
    for edge in edges:
        fan_in[edge["to_node"]] += 1
        fan_out[edge["from_node"]] += 1
    for nid in all_node_ids:
        fan_in.setdefault(nid, 0)
        fan_out.setdefault(nid, 0)

    mean_fan = round(total_edges / total_nodes, MEAN_DECIMALS)

    surfaces_per_ceu = defaultdict(int)
    for s in capability_surfaces:
        surfaces_per_ceu[s["provenance"]["parent_node"]] += 1

    total_surfaces = len(capability_surfaces)
    total_ceus = len(component_nodes)
    mean_surfaces = total_surfaces / total_ceus

    ceu_domain_id = {}
    ceu_domain_name = {}
    for s in capability_surfaces:
        pn = s["provenance"]["parent_node"]
        dom = s["parent_context"]
        ceu_domain_id[pn] = dom

    domain_label_map = {}
    for n in domain_nodes:
        if fan_out[n["node_id"]] > 0:
            domain_label_map[n["node_id"]] = n["label"]

    for ceu_id, dom_id in ceu_domain_id.items():
        ceu_domain_name[ceu_id] = domain_label_map.get(dom_id)

    ratio_001 = {nid: round(fan_in[nid] / mean_fan, 2) for nid in all_node_ids}
    ratio_002 = {nid: round(fan_out[nid] / mean_fan, 2) for nid in all_node_ids}
    ratio_004 = {nid: round(surfaces_per_ceu.get(nid, 0) / mean_surfaces, 2) for nid in component_node_ids}

    cond_001 = {nid: "HIGH" if ratio_001[nid] > THRESHOLD else "NORMAL" for nid in all_node_ids}
    cond_002 = {nid: "HIGH" if ratio_002[nid] > THRESHOLD else "NORMAL" for nid in all_node_ids}
    cond_004 = {nid: "HIGH" if ratio_004.get(nid, 0) > THRESHOLD else "NORMAL" for nid in component_node_ids}

    # Global signal values (max ratios)
    sig_val_001 = round(max(ratio_001[nid] for nid in component_node_ids), 2)
    sig_val_002 = round(max(ratio_002[nid] for nid in domain_node_ids), 2)
    sig_val_004 = round(max(ratio_004.get(nid, 0) for nid in component_node_ids), 2)

    # PSIG-001 attribution
    activated_001 = {nid: ratio_001[nid] for nid in component_node_ids if cond_001[nid] == "HIGH"}
    psig_001_role = {}
    if activated_001:
        p = max(activated_001, key=lambda n: (activated_001[n], n))
        psig_001_role[p] = "primary"
        for n in sorted([x for x in activated_001 if x != p], key=lambda n: (-activated_001[n], n)):
            psig_001_role[n] = "secondary"

    # PSIG-004 attribution
    activated_004 = {nid: ratio_004.get(nid, 0) for nid in component_node_ids if cond_004.get(nid) == "HIGH"}
    psig_004_role = {}
    if activated_004:
        p = max(activated_004, key=lambda n: (activated_004[n], n))
        psig_004_role[p] = "primary"
        for n in sorted([x for x in activated_004 if x != p], key=lambda n: (-activated_004[n], n)):
            psig_004_role[n] = "secondary_outlier_above_threshold"

    # PSIG-002 domain attribution
    activated_002_dom = {nid: ratio_002[nid] for nid in domain_node_ids if cond_002[nid] == "HIGH"}
    psig_002_dom_role = {}
    if activated_002_dom:
        p = max(activated_002_dom, key=lambda n: (activated_002_dom[n], n))
        psig_002_dom_role[p] = "primary"
        for n in sorted([x for x in activated_002_dom if x != p], key=lambda n: (-activated_002_dom[n], n)):
            psig_002_dom_role[n] = "secondary"

    # Zone-domain role for CEUs
    zone_domain_role = {nid: f"zone_domain_{psig_001_role[nid]}" for nid in psig_001_role}

    return {
        "domain_node_ids": domain_node_ids,
        "component_node_ids": component_node_ids,
        "node_label": node_label,
        "fan_in": fan_in,
        "fan_out": fan_out,
        "mean_fan": mean_fan,
        "surfaces_per_ceu": surfaces_per_ceu,
        "mean_surfaces": mean_surfaces,
        "ceu_domain_id": ceu_domain_id,
        "ceu_domain_name": ceu_domain_name,
        "domain_label_map": domain_label_map,
        "ratio_001": ratio_001,
        "ratio_002": ratio_002,
        "ratio_004": ratio_004,
        "cond_001": cond_001,
        "cond_002": cond_002,
        "cond_004": cond_004,
        "sig_val_001": sig_val_001,
        "sig_val_002": sig_val_002,
        "sig_val_004": sig_val_004,
        "psig_001_role": psig_001_role,
        "psig_004_role": psig_004_role,
        "psig_002_dom_role": psig_002_dom_role,
        "zone_domain_role": zone_domain_role,
        "activated_001": activated_001,
        "activated_004": activated_004,
        "activated_002_dom": activated_002_dom,
    }


def build_candidates(run_id: str, client_id: str, ccs: dict, topo: dict) -> dict:
    """Build pressure_candidate_state from condition_correlation_state + topology."""

    ceu_domain_id = topo["ceu_domain_id"]
    ceu_domain_name = topo["ceu_domain_name"]
    domain_label_map = topo["domain_label_map"]
    node_label = topo["node_label"]
    ratio_001 = topo["ratio_001"]
    ratio_002 = topo["ratio_002"]
    ratio_004 = topo["ratio_004"]
    cond_001 = topo["cond_001"]
    cond_004 = topo["cond_004"]
    psig_001_role = topo["psig_001_role"]
    psig_004_role = topo["psig_004_role"]
    psig_002_dom_role = topo["psig_002_dom_role"]
    zone_domain_role = topo["zone_domain_role"]
    sig_val_001 = topo["sig_val_001"]
    sig_val_002 = topo["sig_val_002"]
    sig_val_004 = topo["sig_val_004"]
    fan_in = topo["fan_in"]
    fan_out = topo["fan_out"]
    surfaces_per_ceu = topo["surfaces_per_ceu"]

    candidates = []
    candidate_idx = 1

    # Entity-level candidates: activated CEUs with activation_count >= 2
    # Order: by PSIG-001 ratio desc
    entity_cands = sorted(
        [nid for nid in topo["component_node_ids"]
         if cond_001.get(nid) == "HIGH" and cond_004.get(nid) == "HIGH"],
        key=lambda n: (-ratio_001[n], n)
    )

    for nid in entity_cands:
        dom_id = ceu_domain_id.get(nid)
        cand = {
            "candidate_id": f"PC-{candidate_idx:03d}",
            "entity_id": nid,
            "entity_alias": node_label[nid],
            "entity_type": "CEU",
            "domain_id": dom_id,
            "domain_name": ceu_domain_name.get(nid),
            "active_conditions": ["PSIG-001", "PSIG-004"],
            "activation_count": 2,
            "combination_signature": "PSIG-001|PSIG-004",
            "psig_006_flag": "NOT",
            "candidate_level": "entity",
            "evidence_trace": {
                "PSIG-001": {
                    "st_source": "ST-030",
                    "psig_signal_value": sig_val_001,
                    "condition_id": "COND-PSIG-001-01",
                    "condition_state": "HIGH",
                    "attribution_role": psig_001_role[nid],
                    "node_fan_in": fan_in[nid],
                    "node_ratio": ratio_001[nid],
                },
                "PSIG-004": {
                    "st_sources": ["ST-033", "ST-034"],
                    "psig_signal_value": sig_val_004,
                    "condition_id": "COND-PSIG-004-01",
                    "condition_state": "HIGH",
                    "attribution_role": psig_004_role[nid],
                    "node_surface_count": surfaces_per_ceu.get(nid, 0),
                    "node_ratio": ratio_004.get(nid, 0),
                },
            },
        }
        candidates.append(cand)
        candidate_idx += 1

    # Domain-level candidates: domains with attribution_count >= 2 (all connected domains)
    # Order: by PSIG-002 ratio desc
    domain_cands = sorted(
        list(topo["activated_002_dom"].keys()),
        key=lambda n: (-ratio_002[n], n)
    )

    for dom_id in domain_cands:
        # Find the via CEU for this domain
        dom_ceus = [ceu for ceu, d in ceu_domain_id.items() if d == dom_id]
        dom_ceus_sorted = sorted(dom_ceus, key=lambda n: (-ratio_001[n], n))
        via_ceu = dom_ceus_sorted[0] if dom_ceus_sorted else None
        via_role = zone_domain_role.get(via_ceu, "zone_domain_secondary") if via_ceu else "zone_domain_secondary"

        cand = {
            "candidate_id": f"PC-{candidate_idx:03d}",
            "entity_id": dom_id,
            "entity_type": "DOMAIN",
            "domain_id": dom_id,
            "domain_name": domain_label_map.get(dom_id),
            "active_conditions": ["PSIG-001", "PSIG-002", "PSIG-004"],
            "activation_count": 3,
            "combination_signature": "PSIG-001|PSIG-002|PSIG-004",
            "psig_006_flag": "NOT",
            "candidate_level": "domain_attribution",
            "evidence_trace": {
                "PSIG-001": {
                    "st_source": "ST-030",
                    "psig_signal_value": sig_val_001,
                    "condition_id": "COND-PSIG-001-01",
                    "condition_state": "HIGH",
                    "attribution_type": "domain_attribution",
                    "via_entity": via_ceu,
                    "attribution_role": via_role,
                },
                "PSIG-002": {
                    "st_source": "ST-031",
                    "psig_signal_value": sig_val_002,
                    "condition_id": "COND-PSIG-002-01",
                    "condition_state": "HIGH",
                    "attribution_type": "direct",
                    "domain_fan_out": fan_out[dom_id],
                    "domain_ratio": ratio_002[dom_id],
                },
                "PSIG-004": {
                    "st_sources": ["ST-033", "ST-034"],
                    "psig_signal_value": sig_val_004,
                    "condition_id": "COND-PSIG-004-01",
                    "condition_state": "HIGH",
                    "attribution_type": "domain_attribution",
                    "via_entity": via_ceu,
                    "attribution_role": via_role,
                },
            },
        }
        candidates.append(cand)
        candidate_idx += 1

    entity_level_count = len(entity_cands)
    domain_attr_count = len(domain_cands)

    return {
        "schema_version": SCHEMA_VERSION,
        "run_id": run_id,
        "client_id": client_id,
        "source_contract": SOURCE_CONTRACT,
        "source_files": SOURCE_FILES,
        "candidate_count": len(candidates),
        "entity_level_candidate_count": entity_level_count,
        "domain_attribution_candidate_count": domain_attr_count,
        "candidate_rule": CANDIDATE_RULE,
        "candidates": candidates,
    }


def main():
    run_dir, input_dir, output_dir = parse_args()
    if run_dir is None:
        print("Usage: compute_pressure_candidates.py --run-dir <path> [--input-dir <path>] [--output-dir <path>]")
        sys.exit(1)
    run_dir = run_dir.resolve()
    if input_dir is None:
        input_dir = run_dir
    if output_dir is None:
        output_dir = run_dir
    input_dir = input_dir.resolve()
    output_dir = output_dir.resolve()

    run_id = run_dir.name
    client_id = run_dir.parent.parent.parent.name

    print(f"[S07_75X.2] compute_pressure_candidates")
    print(f"  run_dir:    {run_dir}")
    print(f"  input_dir:  {input_dir}")
    print(f"  output_dir: {output_dir}")

    ccs = load_json(input_dir / "75.x" / "condition_correlation_state.json")
    binding = load_json(run_dir / "binding" / "binding_envelope.json")

    topo = compute_topology_from_binding(binding)
    output = build_candidates(run_id, client_id, ccs, topo)

    out_path = output_dir / "75.x" / "pressure_candidate_state.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(psee_dumps(output))

    print(f"  Written: {out_path}")
    print(f"  Candidates: {output['candidate_count']} ({output['entity_level_candidate_count']} entity, {output['domain_attribution_candidate_count']} domain)")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()

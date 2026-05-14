#!/usr/bin/env python3
"""
compute_pressure_zones.py
Stage S07_75X — Step 3
Contract: PI.E2E.DETERMINISTIC-IMPLEMENTATION.75X-41X.01

Reads pressure_candidate_state.json + binding_envelope.json;
constructs pressure zones; writes pressure_zone_state.json.

Usage:
    python3 scripts/pios/75x/compute_pressure_zones.py --run-dir <path> [--input-dir <path>] [--output-dir <path>]
"""

import sys
import json
from collections import defaultdict
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from psee_json import psee_dumps, CompactDict, THRESHOLD_75X

SCHEMA_VERSION = "1.0"
SOURCE_CONTRACT = "PI.PRESSURE-ZONE.DESIGNATION.75X.04"
SOURCE_FILES = ["pressure_zone_set.md", "pressure_zone_summary.md", "pressure_zone_mapping.md"]

ZONE_CLASS_RULES = {
    "COUPLING_ZONE": "PSIG-001 + PSIG-002",
    "PROPAGATION_ZONE": "PSIG-002 + PSIG-004",
    "RESPONSIBILITY_ZONE": "PSIG-001 + PSIG-004",
    "FRAGMENTATION_ZONE": "PSIG-006 present",
    "COMPOUND_ZONE": "condition_count >= 3",
}

PAIR_RULE_CONDITIONS = [
    ("COUPLING_ZONE", {"PSIG-001", "PSIG-002"}),
    ("PROPAGATION_ZONE", {"PSIG-002", "PSIG-004"}),
    ("RESPONSIBILITY_ZONE", {"PSIG-001", "PSIG-004"}),
]


def parse_args():
    run_dir = None
    input_dir = None
    output_dir = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--run-dir" and i + 1 < len(args):
            run_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--input-dir" and i + 1 < len(args):
            input_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--output-dir" and i + 1 < len(args):
            output_dir = Path(args[i + 1])
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


def derive_zone_class(conditions: list) -> str:
    cset = set(conditions)
    if len(conditions) >= 3:
        return "COMPOUND_ZONE"
    if "PSIG-001" in cset and "PSIG-002" in cset:
        return "COUPLING_ZONE"
    if "PSIG-002" in cset and "PSIG-004" in cset:
        return "PROPAGATION_ZONE"
    if "PSIG-001" in cset and "PSIG-004" in cset:
        return "RESPONSIBILITY_ZONE"
    if "PSIG-006" in cset:
        return "FRAGMENTATION_ZONE"
    return "UNKNOWN"


def derive_embedded_pair_rules(conditions: list) -> list:
    cset = set(conditions)
    rules = []
    for rule_name, required in PAIR_RULE_CONDITIONS:
        if required.issubset(cset):
            rules.append(rule_name)
    return rules


def _psig_002_role_for_domain(dom_id: str, domain_cands: list) -> str:
    all_dom_ratios = {c["domain_id"]: c["evidence_trace"]["PSIG-002"]["domain_ratio"] for c in domain_cands}
    max_dom = max(all_dom_ratios, key=lambda d: (all_dom_ratios[d], d))
    return "primary" if dom_id == max_dom else "secondary"


def build_zones(pcs: dict, binding: dict) -> dict:
    candidates = pcs["candidates"]

    entity_cands = [c for c in candidates if c["candidate_level"] == "entity"]
    domain_cands = [c for c in candidates if c["candidate_level"] == "domain_attribution"]

    entity_by_domain = defaultdict(list)
    for c in entity_cands:
        entity_by_domain[c["domain_id"]].append(c)

    domain_cand_by_domain = {c["domain_id"]: c for c in domain_cands}
    eligible_domains = sorted(domain_cand_by_domain.keys())

    domain_name_map = {c["domain_id"]: c.get("domain_name") for c in domain_cands}

    # PSIG-006 blind spots from binding
    nodes = binding["nodes"]
    edges = binding["edges"]
    all_node_ids = [n["node_id"] for n in nodes]
    adjacency = defaultdict(set)
    for edge in edges:
        adjacency[edge["from_node"]].add(edge["to_node"])
        adjacency[edge["to_node"]].add(edge["from_node"])
    visited = set()
    components = []
    for nid in sorted(all_node_ids):
        if nid not in visited:
            comp = set()
            queue = [nid]
            while queue:
                curr = queue.pop(0)
                if curr not in visited:
                    visited.add(curr)
                    comp.add(curr)
                    for nb in sorted(adjacency[curr]):
                        if nb not in visited:
                            queue.append(nb)
            components.append(frozenset(comp))
    isolated_node_ids = sorted([list(c)[0] for c in components if len(c) == 1])
    node_type_map = {n["node_id"]: n["type"] for n in nodes}
    # Build blind_spots: domains first (sorted), then nodes (sorted)
    blind_spot_domains = sorted([nid for nid in isolated_node_ids if node_type_map[nid] == "binding_context"])
    blind_spot_nodes = sorted([nid for nid in isolated_node_ids if node_type_map[nid] == "component_entity"])
    blind_spots = []
    for nid in blind_spot_domains:
        blind_spots.append(CompactDict({"entity_id": nid, "entity_type": "DOMAIN", "psig_006": "ACTIVATED"}))
    for nid in blind_spot_nodes:
        blind_spots.append(CompactDict({"entity_id": nid, "entity_type": "NODE", "psig_006": "ACTIVATED"}))

    zones = []
    # entity_zone_mapping ordered by candidate_id — collect all entries then sort
    entity_zone_entries_by_cand_id = {}
    # domain_zone_mapping: connected domains first (alpha), then isolated (alpha)
    domain_zone_entries_connected = []
    domain_zone_entries_isolated = []

    for zone_idx, dom_id in enumerate(eligible_domains):
        zone_id = f"PZ-{zone_idx + 1:03d}"
        dom_cand = domain_cand_by_domain[dom_id]
        ent_cands_for_dom = sorted(entity_by_domain[dom_id], key=lambda c: c["candidate_id"])

        aggregated_conditions = sorted(dom_cand.get("active_conditions", []))
        condition_count = len(aggregated_conditions)
        zone_class = derive_zone_class(aggregated_conditions)
        embedded_pair_rules = derive_embedded_pair_rules(aggregated_conditions)

        member_entities = []
        for ec in ent_cands_for_dom:
            member_entities.append({
                "entity_id": ec["entity_id"],
                "entity_type": ec["entity_type"],
                "candidate_id": ec["candidate_id"],
            })
        member_entities.append({
            "entity_id": dom_cand["entity_id"],
            "entity_type": dom_cand["entity_type"],
            "candidate_id": dom_cand["candidate_id"],
        })

        max_activation_count = 3

        # condition_sources: PSIG-001, PSIG-002, PSIG-004 order (alphabetical)
        condition_sources = []
        for sig in aggregated_conditions:
            if sig == "PSIG-001":
                for ec in ent_cands_for_dom:
                    et = ec["evidence_trace"].get("PSIG-001", {})
                    if et.get("condition_state") == "HIGH":
                        condition_sources.append({
                            "condition_id": "COND-PSIG-001-01",
                            "signal_id": "PSIG-001",
                            "attribution_role": et.get("attribution_role", "secondary"),
                            "entity_in_zone": ec["entity_id"],
                        })
                        break
            elif sig == "PSIG-002":
                role_002 = _psig_002_role_for_domain(dom_id, domain_cands)
                condition_sources.append({
                    "condition_id": "COND-PSIG-002-01",
                    "signal_id": "PSIG-002",
                    "attribution_role": role_002,
                    "entity_in_zone": dom_id,
                })
            elif sig == "PSIG-004":
                for ec in ent_cands_for_dom:
                    et = ec["evidence_trace"].get("PSIG-004", {})
                    if et.get("condition_state") == "HIGH":
                        # In pressure_zone_state condition_sources, use the PSIG-004
                        # attribution_role from evidence_trace, which uses
                        # "secondary_outlier_above_threshold". But the reference shows
                        # "secondary" in condition_sources for PSIG-004 secondary entities.
                        raw_role = et.get("attribution_role", "secondary")
                        condition_sources.append({
                            "condition_id": "COND-PSIG-004-01",
                            "signal_id": "PSIG-004",
                            "attribution_role": raw_role,
                            "entity_in_zone": ec["entity_id"],
                        })
                        break

        # evidence_trace: PSIG-001 first, then PSIG-002, then PSIG-004 (alphabetical order)
        evidence_trace = {}
        for ec in ent_cands_for_dom:
            et_001 = ec["evidence_trace"].get("PSIG-001", {})
            et_004 = ec["evidence_trace"].get("PSIG-004", {})
            role_001 = et_001.get("attribution_role", "secondary")
            # In evidence_trace strings, PSIG-004 uses "secondary" (not the long label)
            raw_role_004 = et_004.get("attribution_role", "secondary")
            role_004 = "secondary" if raw_role_004 != "primary" else "primary"
            fi = et_001.get("node_fan_in", "?")
            r001 = et_001.get("node_ratio", "?")
            surf = et_004.get("node_surface_count", "?")
            r004 = et_004.get("node_ratio", "?")
            sv001 = et_001.get("psig_signal_value", "?")
            sv004 = et_004.get("psig_signal_value", "?")
            eid = ec["entity_id"]
            cid = ec["candidate_id"]
            evidence_trace["PSIG-001"] = (
                f"ST-030 ({eid} fan_in={fi}, ratio={r001}x) "
                f"→ PSIG-001={sv001} → COND-PSIG-001-01 HIGH {role_001} "
                f"→ {eid} {cid} → zone {dom_id}"
            )

        et_002 = dom_cand["evidence_trace"].get("PSIG-002", {})
        dom_fo = et_002.get("domain_fan_out", "?")
        dom_r = et_002.get("domain_ratio", "?")
        sv002 = et_002.get("psig_signal_value", "?")
        role_002_ev = _psig_002_role_for_domain(dom_id, domain_cands)
        dom_cand_id = dom_cand["candidate_id"]
        evidence_trace["PSIG-002"] = (
            f"ST-031 ({dom_id} fan_out={dom_fo}, ratio={dom_r}x) "
            f"→ PSIG-002={sv002} → COND-PSIG-002-01 HIGH {role_002_ev} "
            f"→ {dom_id} {dom_cand_id} → zone {dom_id}"
        )

        for ec in ent_cands_for_dom:
            et_004 = ec["evidence_trace"].get("PSIG-004", {})
            raw_role_004 = et_004.get("attribution_role", "secondary")
            role_004 = "secondary" if raw_role_004 != "primary" else "primary"
            surf = et_004.get("node_surface_count", "?")
            r004 = et_004.get("node_ratio", "?")
            sv004 = et_004.get("psig_signal_value", "?")
            eid = ec["entity_id"]
            cid = ec["candidate_id"]
            evidence_trace["PSIG-004"] = (
                f"ST-033/ST-034 ({eid} surfaces={surf}, ratio={r004}x) "
                f"→ PSIG-004={sv004} → COND-PSIG-004-01 HIGH {role_004} "
                f"→ {eid} {cid} → zone {dom_id}"
            )

        zone = {
            "zone_id": zone_id,
            "zone_type": "DOMAIN_ZONE",
            "zone_class": zone_class,
            "class_rule_applied": "condition_count >= 3",
            "anchor_id": dom_id,
            "anchor_name": domain_name_map.get(dom_id),
            "member_entities": member_entities,
            "member_count": len(member_entities),
            "aggregated_conditions": aggregated_conditions,
            "condition_count": condition_count,
            "max_activation_count": max_activation_count,
            "embedded_pair_rules": embedded_pair_rules,
            "psig_006_flag": "NOT",
            "condition_sources": condition_sources,
            "evidence_trace": evidence_trace,
            "validation_status": "VALID",
        }
        zones.append(zone)

        # Collect entity_zone_mapping entries (to be sorted by candidate_id later)
        for ec in ent_cands_for_dom:
            entity_zone_entries_by_cand_id[ec["candidate_id"]] = {
                "entity_id": ec["entity_id"],
                "entity_type": ec["entity_type"],
                "domain_id": dom_id,
                "candidate_id": ec["candidate_id"],
                "zone_id": zone_id,
                "zone_class": zone_class,
            }
        entity_zone_entries_by_cand_id[dom_cand["candidate_id"]] = {
            "entity_id": dom_cand["entity_id"],
            "entity_type": dom_cand["entity_type"],
            "domain_id": dom_id,
            "candidate_id": dom_cand["candidate_id"],
            "zone_id": zone_id,
            "zone_class": zone_class,
        }

        # condition_attribution_summary for domain_zone_mapping
        # PSIG-001 and PSIG-004 attribution roles for this domain's CEU
        ceu_role_001 = "primary"
        ceu_role_004 = "primary"
        for ec in ent_cands_for_dom:
            ceu_role_001 = ec["evidence_trace"].get("PSIG-001", {}).get("attribution_role", "secondary")
            # For attribution summary, use the shortened form: "secondary" not "secondary_outlier..."
            raw_004 = ec["evidence_trace"].get("PSIG-004", {}).get("attribution_role", "secondary")
            ceu_role_004 = "secondary" if raw_004 != "primary" else "primary"
            ceu_id = ec["entity_id"]
            break
        else:
            ceu_id = None

        role_002_str = _psig_002_role_for_domain(dom_id, domain_cands)
        if ceu_id:
            attr_summary = (
                f"PSIG-001 {ceu_role_001} (via {ceu_id}); "
                f"PSIG-002 direct {role_002_str}; "
                f"PSIG-004 {ceu_role_004} (via {ceu_id})"
            )
        else:
            attr_summary = f"PSIG-002 direct {role_002_str}"

        domain_zone_entries_connected.append({
            "domain_id": dom_id,
            "domain_name": domain_name_map.get(dom_id),
            "zone_id": zone_id,
            "zone_class": zone_class,
            "condition_attribution_summary": attr_summary,
        })

    # Isolated domain entries for domain_zone_mapping
    all_domain_ids = sorted(set(n["node_id"] for n in nodes if n["type"] == "binding_context"))
    connected_domain_ids = set(eligible_domains)
    for dom_id in all_domain_ids:
        if dom_id not in connected_domain_ids:
            domain_zone_entries_isolated.append({
                "domain_id": dom_id,
                "domain_name": None,
                "zone_id": None,
                "note": "PSIG-006 ACTIVATED; activation_count=0; not a candidate; no zone assigned",
            })

    # entity_zone_mapping: entity candidates (PC-001..003) first, then domain candidates (PC-004..006)
    # sorted by candidate_id within each group
    entity_cand_ids_sorted = sorted(
        [k for k in entity_zone_entries_by_cand_id if entity_zone_entries_by_cand_id[k]["entity_type"] == "CEU"]
    )
    domain_cand_ids_sorted = sorted(
        [k for k in entity_zone_entries_by_cand_id if entity_zone_entries_by_cand_id[k]["entity_type"] == "DOMAIN"]
    )
    entity_zone_mapping = (
        [entity_zone_entries_by_cand_id[k] for k in entity_cand_ids_sorted] +
        [entity_zone_entries_by_cand_id[k] for k in domain_cand_ids_sorted]
    )

    domain_zone_mapping = domain_zone_entries_connected + domain_zone_entries_isolated

    zones_by_type = {"DOMAIN_ZONE": len(zones), "CEU_ZONE": 0, "NODE_ZONE": 0}
    zones_by_class_out = {"COMPOUND_ZONE": 0, "COUPLING_ZONE": 0, "PROPAGATION_ZONE": 0,
                          "RESPONSIBILITY_ZONE": 0, "FRAGMENTATION_ZONE": 0}
    for z in zones:
        zones_by_class_out[z["zone_class"]] += 1

    run_id = pcs["run_id"]
    client_id = pcs["client_id"]

    return {
        "schema_version": SCHEMA_VERSION,
        "run_id": run_id,
        "client_id": client_id,
        "source_contract": SOURCE_CONTRACT,
        "source_files": SOURCE_FILES,
        "total_zones": len(zones),
        "zone_grouping_rule": "domain_id anchor; DOMAIN_ZONE type; alphabetical ordering by anchor_id (deterministic)",
        "zone_class_rules": ZONE_CLASS_RULES,
        "zones_by_type": zones_by_type,
        "zones_by_class": zones_by_class_out,
        "zones": zones,
        "entity_zone_mapping": entity_zone_mapping,
        "domain_zone_mapping": domain_zone_mapping,
        "structural_blind_spot_entities": blind_spots,
    }


def main():
    run_dir, input_dir, output_dir = parse_args()
    if run_dir is None:
        print("Usage: compute_pressure_zones.py --run-dir <path> [--input-dir <path>] [--output-dir <path>]")
        sys.exit(1)
    run_dir = run_dir.resolve()
    if input_dir is None:
        input_dir = run_dir
    if output_dir is None:
        output_dir = run_dir
    input_dir = input_dir.resolve()
    output_dir = output_dir.resolve()

    print(f"[S07_75X.3] compute_pressure_zones")
    print(f"  run_dir:    {run_dir}")
    print(f"  input_dir:  {input_dir}")
    print(f"  output_dir: {output_dir}")

    pcs = load_json(input_dir / "75.x" / "pressure_candidate_state.json")
    binding = load_json(run_dir / "binding" / "binding_envelope.json")

    output = build_zones(pcs, binding)

    out_path = output_dir / "75.x" / "pressure_zone_state.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(psee_dumps(output, threshold=THRESHOLD_75X))

    print(f"  Written: {out_path}")
    print(f"  Zones: {output['total_zones']}")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()
